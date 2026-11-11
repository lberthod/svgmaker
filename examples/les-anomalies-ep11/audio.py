"""Bande son de « LES ANOMALIES » ép. 11 (Sans étincelle) : épisode intime en la mineur 84 bpm, pluie continue,
nappes douces et petite mélodie triste ; l'orage monte (28 s), l'éclair (31,9 s), puis le thème héroïque revient
en majeur quand les yeux de Volta se rallument. Usage : python3 audio.py → audio.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'les-anomalies'))
from audiolib import Episode

E = Episode(__file__, seed=111, bpm=84)
# pluie : souffle aigu continu, plus dense pendant l'orage
E.add_sfx(E.hp(E.noise(28.0), 4) * .035, 0.0)
E.add_sfx(E.hp(E.noise(6.5), 3) * .06, 28.0)
E.add_sfx(E.hp(E.noise(5.5), 4) * .03, 34.5)
# 0–8 s : la mineur, vide, piano carré lent
E.add_music(E.pad([45, 52, 57, 60], 4.2, .14), 0.1); E.add_music(E.pad([41, 48, 53, 57], 4.0, .14), 4.1)
E.lead([69, None, 67, 64, None, None, 62, 64, None, None, None, None], 0.8, E.BEAT, .12)
E.lead([65, None, 64, 60, None, None, 59, 57, None, None, None, None], 4.6, E.BEAT, .1)
# 8–16 s : Givre et Écho, la basse revient doucement
E.add_music(E.pad([48, 55, 60, 64], 4.0, .15), 8.0); E.add_music(E.pad([43, 50, 55, 59], 4.0, .15), 12.0)
E.section(8.0, 16.0, 'none', True, riff=[48, 48, 55, 48, 43, 43, 50, 43])
E.lead([72, None, 71, 67, None, 64, 67, None, 69, None, None, None], 12.6, E.BEAT, .1)
# 16–24 s : Mirage, couleur mystérieuse puis éclaircie
E.add_music(E.pad([45, 51, 57, 60], 4.0, .14), 16.0); E.add_music(E.pad([41, 48, 53, 60], 4.0, .15), 20.0)
E.section(20.0, 24.0, 'half', True, riff=[41, 41, 48, 41, 43, 43, 50, 43])
# 24–28 s : ensemble (do majeur), puis le grondement
E.add_music(E.pad([48, 55, 60, 64, 67], 2.6, .17), 24.0); E.add_music(E.pad([45, 52, 57], 1.6, .12), 26.5)
E.lead([67, None, 72, None, 71, 67, 64, None], 24.4, E.BEAT / 2, .12)
# 28–31,9 s : l'orage monte
E.add_music(E.pad([45, 46, 52, 57], 3.9, .17), 28.0); E.section(28.0, 31.9, 'build', True, riff=[45, 45, 46, 45, 45, 45, 52, 51])
E.riser(30.2, 1.7, .14)
# 31,9 s : l'éclair, puis silence lourd
E.add_music(E.stab([45, 52, 57, 61, 64], 2.0, .6), 31.9); E.add_music(E.kick(1.4), 31.9)
E.add_music(E.pad([45, 52, 57], 2.4, .1), 32.2)
# 35 s : le thème héroïque revient (la majeur), carton final
E.add_music(E.stab([45, 52, 57, 61, 64], 1.2, .55), 35.0); E.section(35.0, 36.9, 'full', True, True, riff=[45, 45, 52, 45, 47, 47, 52, 49], chord=(61, 64, 69))
E.lead([69, 73, 76, None, 76, 78, 76, 73], 35.0, E.BEAT / 2, .14)
E.add_music(E.pad([45, 52, 57, 61], 3.1, .2), 36.9); E.add_music(E.kick(1.3), 36.9); E.add_music(E.stab([45, 52, 57, 61], 1.6, .4), 36.9)
E.finish(rewrite={'Plus rien… Il a tout pris.': 'Plus rien. Il a tout pris.'})
