"""Prépare les polices embarquées de svgkit (à relancer seulement pour changer de police ou de jeu de caractères).

    python3 -I src/kit/fonts/build-fonts.py <Fredoka[wdth,wght].ttf> <Mali-Bold.ttf>

Sources : https://github.com/google/fonts (ofl/fredoka, ofl/mali), licence SIL OFL 1.1 (fichiers *-OFL.txt).
Sorties dans ce dossier :
- en.woff2 : Fredoka figée en gras (wght 700, wdth 100), latin ;
- th.woff2 : Mali Bold, thaï + latin ;
- metrics.json : avances horizontales et hauteurs d'encre par caractère (mesure des textes sans navigateur).
"""
import json
import os
import sys

from fontTools import subset
from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

HERE = os.path.dirname(os.path.abspath(__file__))
LATIN = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + [0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2026, 0x2022, 0x00B7, 0x20AC]
THAI = list(range(0x0E01, 0x0E3B)) + list(range(0x0E3F, 0x0E5C))


def build(font, codepoints, out):
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]  # garde le positionnement des voyelles et tons thaïs (mark, mkmk, ccmp)
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=codepoints)
    sub.subset(font)
    font.flavor = "woff2"
    font.save(os.path.join(HERE, out))
    cmap, hmtx = font.getBestCmap(), font["hmtx"]
    adv = {str(cp): hmtx[g][0] for cp, g in sorted(cmap.items())}
    # hauteur d'encre par caractère [yMin, yMax], et la plus haute de toutes les formes (tons thaïs empilés
    # au-dessus d'une voyelle : variantes « .small » choisies par la police, absentes du cmap)
    gs = font.getGlyphSet()
    bounds = {}
    for name in font.getGlyphOrder():
        pen = BoundsPen(gs)
        gs[name].draw(pen)
        if pen.bounds:
            bounds[name] = (round(pen.bounds[1]), round(pen.bounds[3]))
    ink = {str(cp): bounds[g] for cp, g in sorted(cmap.items()) if g in bounds}
    stack = max((b[1] for b in bounds.values()), default=0)
    return {"upm": font["head"].unitsPerEm, "adv": adv, "ink": ink, "stackTop": stack}


def main(fredoka, mali):
    en = instancer.instantiateVariableFont(TTFont(fredoka), {"wght": 700, "wdth": 100})
    metrics = {"en": build(en, LATIN, "en.woff2"), "th": build(TTFont(mali), LATIN + THAI, "th.woff2")}
    with open(os.path.join(HERE, "metrics.json"), "w", encoding="utf-8") as f:
        json.dump(metrics, f, separators=(",", ":"))
    for k in ("en", "th"):
        print(f"{k}.woff2 : {os.path.getsize(os.path.join(HERE, k + '.woff2'))} o, {len(metrics[k]['adv'])} caractères")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(*sys.argv[1:])
