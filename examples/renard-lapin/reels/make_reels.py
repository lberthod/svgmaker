#!/usr/bin/env python3
"""Versions 9:16 (1080x1920) des 15 épisodes pour les Reels Instagram.

La vidéo 16:9 est posée au centre sur un fond flou tiré de la même image,
avec un bandeau titre en haut et l'annonce de l'épisode suivant en bas.
Usage : python3 make_reels.py [numéros...]   (sans argument : les 15)
"""
import subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
EP = [
    ('../cartoon-ecole/cartoon-ecole.mp4', "Le réveil et l'école"),
    ('ep02-en-classe/en-classe.mp4', 'En classe'),
    ('ep03-la-recre/la-recre.mp4', 'La récré'),
    ('ep04-atelier-peinture/atelier-peinture.mp4', "L'atelier peinture"),
    ('ep05-vers-la-cantine/vers-la-cantine.mp4', 'En route pour la cantine'),
    ('ep06-a-la-cantine/a-la-cantine.mp4', 'À la cantine'),
    ('ep07-pause-de-midi/pause-de-midi.mp4', 'La pause de midi'),
    ('ep08-les-lettres/les-lettres.mp4', 'Les lettres'),
    ('ep09-la-graine/la-graine.mp4', 'La graine'),
    ('ep10-club-de-musique/club-de-musique.mp4', 'Le club de musique'),
    ('ep11-le-retour/le-retour.mp4', 'Le retour'),
    ('ep12-le-souper/le-souper.mp4', 'Le souper'),
    ('ep13-les-devoirs/les-devoirs.mp4', 'Les devoirs'),
    ('ep14-preparer-le-dodo/preparer-le-dodo.mp4', 'Préparer le dodo'),
    ('ep15-dodo/dodo.mp4', 'Dodo'),
]
W, H = 1080, 1920
VH = round(W * 9 / 16)            # 608 : hauteur de la vidéo posée
VY = (H - VH) // 2                # 656 : haut de la vidéo
INK, RED, BLUE, CREAM = (58, 36, 24), (232, 67, 78), (43, 91, 168), (255, 244, 220)
FONT = '/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf'
font = lambda s: ImageFont.truetype(FONT, s)


def card(d, box, fill, r=40, w=8):
    d.rounded_rectangle(box, r, fill=fill, outline=INK, width=w)


def centered(d, y, text, f, fill, cx=W / 2):
    w = d.textlength(text, font=f)
    d.text((cx - w / 2, y), text, font=f, fill=fill)


def overlay(n, title, nxt, path):
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    # bandeau titre
    card(d, (70, 230, W - 70, 580), CREAM + (255,), 46)
    centered(d, 275, 'Roussin & Lino', font(92), RED)
    centered(d, 395, f'Épisode {n}', font(56), INK)
    t = title
    f = font(70)
    while d.textlength(t, font=f) > W - 200:
        f = font(f.size - 4)
    centered(d, 470, t, f, BLUE)
    # cadre autour de la vidéo
    d.rounded_rectangle((-10, VY - 10, W + 10, VY + VH + 10), 0, outline=INK, width=10)
    # bas : épisode suivant
    card(d, (120, 1310, W - 200, 1510), (255, 255, 255, 240), 40, 6)
    if nxt:
        centered(d, 1340, 'Épisode suivant', font(44), INK, 500)
        f = font(60)
        while d.textlength(nxt, font=f) > W - 380:
            f = font(f.size - 4)
        centered(d, 1405, nxt, f, RED, 500)
    else:
        centered(d, 1350, 'Fin de la saison', font(60), RED, 500)
        centered(d, 1430, 'Bonne nuit !', font(46), BLUE, 500)
    im.save(path)


def build(i):
    src, title = EP[i]
    nxt = EP[i + 1][1] if i + 1 < len(EP) else None
    n = i + 1
    src = (ROOT / src).resolve()
    out = HERE / f'ep{n:02d}-{src.stem}-9x16.mp4'
    png = HERE / f'.overlay{n:02d}.png'
    overlay(n, title, nxt, png)
    flt = (f'[0:v]split=2[a][b];'
           f'[a]scale=-2:{H},crop={W}:{H},gblur=sigma=28,eq=brightness=-0.08:saturation=1.15[bg];'
           f'[b]scale={W}:{VH}[fg];'
           f'[bg][fg]overlay=0:{VY}[m];[m][1:v]overlay=0:0,format=yuv420p[v]')
    cmd = ['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-i', str(png), '-filter_complex', flt,
           '-map', '[v]', '-map', '0:a?', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19',
           '-r', '30', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', str(out)]
    subprocess.run(cmd, check=True)
    png.unlink(missing_ok=True)
    print(out.name)


if __name__ == '__main__':
    idx = [int(a) - 1 for a in sys.argv[1:]] or range(len(EP))
    for i in idx:
        build(i)
