"""Bande son de « LES ANOMALIES » ép. 7 (Infiltration) : thriller d'espionnage en ré mineur 120 bpm,
basse sourde et pas feutrés pendant l'infiltration, montée d'alerte sur la caméra, course rapide,
puis grand accord froid à l'ouverture du laboratoire. Voix macOS calées sur timeline.json.
Usage : python3 audio.py → audio.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'les-anomalies'))
from audiolib import Episode

E = Episode(__file__, seed=77, bpm=120)
SNEAK = [38, 38, 41, 38, 45, 38, 44, 41]
# 1 · le toit : accord tendu, nappe de nuit
E.add_music(E.stab([50, 57, 62, 65], 1.4, .5), 0.05); E.add_music(E.kick(1.2), .05)
E.add_music(E.pad([38, 45, 50, 53], 4.2, .16), 0.2); E.section(0.8, 4, 'half', True, riff=[38, 38, 45, 38, 41, 38, 45, 44])
# 2 · l'illusion : nappe scintillante, mélodie en carré douce
E.add_music(E.pad([46, 53, 58, 62], 4.5, .18), 4.0)
E.lead([74, None, 77, None, 81, None, 79, 77, None, 74, None, None, 72, None, 74, None], 4.4, E.BEAT / 2, .12)
E.section(4, 8.5, 'none', True, riff=[46, 46, 53, 46, 50, 46, 53, 52])
# 3-4 · infiltration : basse feutrée, grosse caisse une fois sur deux
E.add_music(E.pad([38, 44, 50], 7.0, .14), 8.5); E.section(8.5, 15.5, 'half', True, riff=SNEAK)
E.lead([62, None, None, 63, None, None, 62, None, 60, None, None, None], 12.0, E.BEAT / 2, .08)
# 5 · les lasers : la batterie entre
E.add_music(E.pad([41, 48, 53, 56], 4.0, .14), 15.5); E.section(15.5, 19.5, 'full', True, True, riff=SNEAK, chord=(62, 65, 69))
# 6 · la caméra : montée
E.add_music(E.pad([39, 46, 51], 3.0, .16), 19.5); E.section(19.5, 22.5, 'build', True, riff=[39] * 8); E.riser(21.0, 1.5, .1)
# 7 · le gel : coupure puis accent
E.section(22.5, 24.3, 'half', True, riff=[38, 38, 50, 38])
E.add_music(E.stab([50, 57, 62, 69], 1.4, .55), 24.3); E.add_music(E.kick(1.4), 24.3); E.section(24.8, 26, 'none', True, riff=[38, 45])
# 8 · la course
E.section(26, 30, 'full', True, True, riff=[38, 38, 41, 38, 43, 38, 44, 45], chord=(62, 65, 70))
# 9 · la porte
E.add_music(E.pad([38, 44, 50, 56], 4.0, .16), 30); E.section(30, 32.5, 'half', True, riff=[38, 38, 44, 38])
E.add_music(E.stab([44, 50, 56], .8, .45), 32.5); E.riser(32.6, 1.4, .1)
# 10 · le laboratoire : grand accord froid, puis carton
E.add_music(E.stab([50, 57, 62, 65, 69], 2.0, .55), 34.1); E.add_music(E.kick(1.3), 34.1)
E.add_music(E.pad([50, 57, 62, 65, 69], 2.9, .2), 34.2)
E.add_music(E.pad([38, 45, 50, 53], 3.1, .2), 36.9); E.add_music(E.kick(1.3), 36.9)
E.finish(rewrite={"C'est… un laboratoire.": "C'est un laboratoire."})
