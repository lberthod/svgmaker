"""Bande son de « LES ANOMALIES » ép. 13 (Les Anomalies) : ré mineur 136 bpm qui bascule en ré majeur triomphant
au moment du nom, puis grondement sombre pour la forteresse. Voix macOS calées sur timeline.json. Usage : python3 audio.py → audio.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'les-anomalies'))
from audiolib import Episode

E = Episode(__file__, seed=1313, bpm=136)
Dm = [38, 38, 41, 38, 45, 38, 43, 41]          # riff ré mineur
DM = [38, 38, 42, 38, 45, 45, 47, 45]          # riff ré majeur (le nom)
# 1-2 · planque + lueurs : attente, pad grave et mélodie qui monte note à note
E.add_music(E.stab([50, 57, 62, 65], 1.2, .5), 0.05); E.add_music(E.kick(1.2), .05)
E.add_music(E.pad([38, 45, 50, 53], 4.2, .16), 0.2); E.section(0.6, 4, 'half', True, riff=Dm)
E.add_music(E.pad([41, 48, 53, 57], 4.0, .16), 4)
E.lead([62, None, 65, None, 69, None, 72, None, 74, None, None, None], 4.3, E.BEAT / 2 * 1.0)
E.section(4, 6.6, 'half', False); E.riser(5.6, 1.0, .1)
# 3-6 · atterrissage, méfiance, drone, victoire : action pleine
E.add_music(E.stab([50, 57, 62, 65, 69], 1.4, .55), 8.55); E.add_music(E.kick(1.4), 8.55)
E.section(6.6, 12, 'full', True, True, riff=Dm, chord=(62, 65, 69))
E.add_music(E.pad([46, 53, 58, 62], 3.5, .15), 12); E.section(12, 15.5, 'half', True, riff=[46, 46, 50, 46, 45, 45, 41, 45])
E.add_music(E.pad([45, 52, 57, 61], 3.0, .16), 15.5); E.section(15.5, 18.5, 'build', True, riff=[45, 45, 45, 45, 46, 46, 47, 47])
E.add_music(E.stab([50, 57, 62, 66, 69], 1.6, .6), 18.5); E.add_music(E.kick(1.5), 18.5)
E.section(19.5, 23, 'full', True, True, riff=DM, chord=(62, 66, 69))
E.lead([74, 74, None, 76, 78, None, 76, 74, None, 71, 74, None], 20.0, E.BEAT / 2)
# 7 · un nom : calme, pad doux
E.add_music(E.pad([43, 50, 55, 59], 4.0, .16), 23); E.section(23, 27, 'half', True, riff=[43, 43, 47, 43, 45, 45, 49, 45])
# 8 · LES ANOMALIES : montée puis ré majeur triomphant
E.riser(27.6, 1.9, .12); E.section(27, 29.5, 'build', True, riff=[45, 45, 45, 45, 45, 45, 45, 45])
E.add_music(E.stab([50, 57, 62, 66, 69, 74], 2.0, .7), 29.5); E.add_music(E.kick(1.6), 29.5)
E.add_music(E.pad([50, 57, 62, 66], 1.6, .2), 29.5); E.section(29.5, 31, 'full', True, True, riff=DM, chord=(62, 66, 69))
E.lead([74, 78, 81, None, 78, 81, 86, None], 29.6, E.BEAT / 2, .2)
# 9-10 · la Tour bouge, la forteresse : bascule sombre, demi-tons inquiétants
E.add_music(E.pad([38, 39, 45], 3.5, .18), 31); E.section(31, 34.5, 'half', True, riff=[38, 38, 39, 38, 38, 38, 44, 43])
E.add_music(E.stab([38, 44, 50, 56], 2.4, .5), 34.6); E.section(34.6, 36.9, 'half', True, riff=[38, 38, 44, 38])
E.add_music(E.pad([38, 44, 50], 3.1, .2), 36.9); E.add_music(E.kick(1.3), 36.9)
E.finish(rewrite={"Sujet 9. On s'est évadés du labo.": "Sujet neuf. On s'est évadés du labo.",
                  'Euh… la Tour bouge.': 'Euh, la tour bouge.',
                  'Alors nous serons… LES ANOMALIES !': 'Alors nous serons les Anomalies !',
                  'Kessler nous a tout pris.': 'Kesslère nous a tout pris.'})
