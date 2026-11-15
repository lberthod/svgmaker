#!/usr/bin/env python3
"""Fond de carte topographique (relief ombré + bathymétrie) en plate carrée « projet ».

usage : python3 relief.py <lon0> <lat0> <lon1> <lat1> <largeur_px> <zoom> <sortie.jpg> [monde] [sea=<m>]
  sea=<m> : niveau de la mer en mètres (ex. sea=-120 : mer de la dernière glaciation ; sea=5 : côtes basses noyées)
Tuiles terrarium (AWS Open Data, voir LICENSE-relief.txt), cache ~/.cache/svgmaker-geo/tiles.
L'image s'aligne dans un <image preserveAspectRatio="none"> sur la projection de ch.json.
"""
import sys, os, re, io, json, math, time, urllib.request
from concurrent.futures import ThreadPoolExecutor
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.expanduser("~/.cache/svgmaker-geo/tiles")
URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"


def fetch(z, x, y):
    p = f"{CACHE}/{z}/{x}/{y}.png"
    if os.path.exists(p):
        return p
    os.makedirs(os.path.dirname(p), exist_ok=True)
    for t in range(4):
        try:
            with urllib.request.urlopen(URL.format(z=z, x=x, y=y), timeout=30) as r:
                data = r.read()
            with open(p + ".tmp", "wb") as f:
                f.write(data)
            os.replace(p + ".tmp", p)
            return p
        except urllib.error.HTTPError as e:
            if e.code in (403, 404):
                return None
        except Exception:
            pass
        time.sleep(1 + t)
    return None


def merc(lon, lat, z):
    n = 256 * 2 ** z
    x = (lon + 180) / 360 * n
    s = np.sin(np.radians(lat))
    y = (0.5 - np.log((1 + s) / (1 - s)) / (4 * np.pi)) * n
    return x, y


def lerp_ramp(v, stops):
    xs = [s[0] for s in stops]
    cols = np.array([s[1] for s in stops], float)
    return np.stack([np.interp(v, xs, cols[:, i]) for i in range(3)], -1)


def hexc(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


LAND = [(0, "#8DAE62"), (60, "#9FB46C"), (300, "#B8C07A"), (800, "#C9A96B"),
        (1800, "#A08A6E"), (2500, "#D8D4CC"), (3200, "#F2F2F2"), (9000, "#FFFFFF")]
LAND = [(a, hexc(b)) for a, b in LAND]
SEA = [(0, "#3B9AA3"), (200, "#2A7C8C"), (2000, "#123F52"), (11000, "#0E3446")]
SEA = [(a, hexc(b)) for a, b in SEA]


def main():
    t0 = time.time()
    lon0, lat0, lon1, lat1 = map(float, sys.argv[1:5])
    W = int(sys.argv[5]); z = int(sys.argv[6]); out = sys.argv[7]
    pr = json.load(open(f"{HERE}/ch.json"))["proj"]
    ckx, minX, maxY, K = pr["ckx"], pr["minX"], pr["maxY"], pr["K"]
    H = round(W * (lat1 - lat0) / ((lon1 - lon0) * ckx))
    lons = lon0 + (np.arange(W) + .5) / W * (lon1 - lon0)
    lats = lat1 - (np.arange(H) + .5) / H * (lat1 - lat0)

    # --- tuiles
    xa, ya = merc(lon0, lat1, z); xb, yb = merc(lon1, lat0, z)
    tx0, tx1 = int(xa // 256) - 1, int(xb // 256) + 1
    ty0, ty1 = max(int(ya // 256) - 1, 0), min(int(yb // 256) + 1, 2 ** z - 1)
    tx0 = max(tx0, 0); tx1 = min(tx1, 2 ** z - 1)
    tiles = [(x, y) for y in range(ty0, ty1 + 1) for x in range(tx0, tx1 + 1)]
    with ThreadPoolExecutor(8) as ex:
        paths = list(ex.map(lambda t: fetch(z, *t), tiles))
    t1 = time.time()
    mos = np.zeros(((ty1 - ty0 + 1) * 256, (tx1 - tx0 + 1) * 256), np.float32)
    miss = 0
    for (x, y), p in zip(tiles, paths):
        if p is None:
            miss += 1; continue
        try:
            a = np.asarray(Image.open(p).convert("RGB"), np.float32)
        except Exception:
            miss += 1; continue
        mos[(y - ty0) * 256:(y - ty0 + 1) * 256, (x - tx0) * 256:(x - tx0 + 1) * 256] = \
            a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
    # --- reprojection
    px, _ = merc(lons, np.full(W, lats[0]), z)
    _, py = merc(np.full(H, lons[0]), lats, z)
    cx = px - tx0 * 256 - .5; cy = py - ty0 * 256 - .5
    # léger flou pré-échantillonnage si suréchantillonné
    scale = W / (xb - xa)
    if scale > 1.2:
        mos = ndimage.gaussian_filter(mos, min(scale * .6, 2.5))
    elif scale < .7:
        mos = ndimage.zoom(mos, 1, order=1)
        mos = ndimage.gaussian_filter(mos, .5 / scale)
    elev = ndimage.map_coordinates(mos, [np.repeat(cy[:, None], W, 1), np.repeat(cx[None, :], H, 0)],
                                   order=1, mode="nearest").astype(np.float32)

    # niveau de la mer optionnel (paléogéographie, montée des eaux) : altitudes relatives au nouveau niveau
    opts = sys.argv[8:]
    SL = next((float(a[4:]) for a in opts if a.startswith("sea=")), 0.0)
    elev0 = elev
    if SL:
        elev = elev - SL

    # --- masque terre/mer
    SS = 2
    m = Image.new("L", (W * SS, H * SS), 0)
    d = ImageDraw.Draw(m)
    eu = json.load(open(f"{HERE}/eu.json"))
    if "monde" in opts:  # mode monde : + world.json (Russie, Proche-Orient, Afrique…), image « -w »
        eu["countries"] += json.load(open(f"{HERE}/world.json"))["countries"]
    # pixel -> projeté : X = (lon*ckx - minX)*K
    ax = (lon0 * ckx - minX) * K; sx = (lon1 - lon0) * ckx * K / (W * SS)
    ay = (maxY - lat1) * K; sy = (lat1 - lat0) * K / (H * SS)
    for c in eu["countries"]:
        for sub in re.split(r"(?=M)", c["d"]):
            nums = re.findall(r"-?\d+\.?\d*(?:e-?\d+)?", sub)
            if len(nums) < 6:
                continue
            v = np.array(nums, float).reshape(-1, 2)
            pts = [((a - ax) / sx, (b - ay) / sy) for a, b in v]
            d.polygon(pts, fill=255, outline=255)
    mask = np.asarray(m.resize((W, H), Image.BOX), np.float32) / 255
    # terre hors couverture vectorielle (Afrique du Nord...) : altitude nette > 0
    outside = ndimage.gaussian_filter((elev > 8).astype(np.float32), 1.0)
    cov = ndimage.maximum_filter(mask, 7)
    ext = np.where(cov < .01, outside, 0)
    land = np.clip(np.maximum(mask, ext), 0, 1)
    if SL:  # terres émergées (SL < 0) ou noyées (SL > 0) d'après l'altitude relative au nouveau niveau
        above = ndimage.gaussian_filter((elev > 0).astype(np.float32), 1.0)
        land = np.clip(np.maximum(land * (above if SL > 0 else 1), above if SL < 0 else 0), 0, 1)

    # --- hillshade
    mx = (lon1 - lon0) / W * 111320 * np.cos(np.radians(lats))[:, None]
    my = (lat1 - lat0) / H * 110574
    el = ndimage.gaussian_filter(np.maximum(elev, 0) if True else elev, .7)
    dzdy, dzdx = np.gradient(el)
    dzdx = dzdx / mx; dzdy = dzdy / my  # y image vers le sud
    # exagération : plus forte aux petites échelles (pixels larges)
    px_m = float(np.mean(mx))
    ex = float(np.clip(1.0 + px_m / 700.0, 1.6, 5.0))
    az = np.radians(315); alt = np.radians(40)
    # formulation directe : normale n = (-ex*dzdx, +ex*dzdy(nord), 1) avec y nord = -y image
    nx = -ex * dzdx; ny = ex * dzdy; nz = np.ones_like(nx)
    nn = np.sqrt(nx * nx + ny * ny + nz * nz)
    lx, ly, lz = np.cos(alt) * np.sin(az), np.cos(alt) * np.cos(az), np.sin(alt)  # lumière depuis NO
    hs = (nx * lx + ny * ly + nz * lz) / nn / np.sin(alt)
    shade = np.clip(1 + (hs - 1) * 1.0, .55, 1.25)
    shade = np.clip((shade - .9) * 1.12 + .9, .55, 1.25)

    # teinte : altitude d'origine pour les terres actuelles, fond émergé teinté doucement (sinon tout paraît « haute montagne »)
    tint = np.where(elev0 > 0, elev0, np.maximum(elev, 0) * .3) if SL else np.maximum(elev, 0)
    land_rgb = lerp_ramp(tint, LAND) * shade[..., None]
    sea_rgb = lerp_ramp(np.maximum(-elev, 0), SEA)
    sh_sea = np.clip(1 + (hs - 1) * .25, .9, 1.06)
    sea_rgb = sea_rgb * sh_sea[..., None]
    rgb = land_rgb * land[..., None] + sea_rgb * (1 - land[..., None])
    Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).save(out, quality=82, optimize=True, subsampling=0)
    print(f"{out}: {W}x{H}px, {len(tiles)} tuiles ({miss} manquantes), {os.path.getsize(out)/1024:.0f} Ko, "
          f"dl {t1-t0:.1f}s, total {time.time()-t0:.1f}s")


if __name__ == "__main__":
    main()
