"""Bande son de « LES ANOMALIES » ép. 9 (Évasion) : menace froide en ré mineur pour Kessler, explosion de la
cage, course-poursuite à 150 bpm dans les escaliers, puis grondement grave du Colosse.
Voix macOS calées sur timeline.json. Usage : python3 audio.py → audio.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'les-anomalies'))
from audiolib import Episode

E = Episode(__file__, seed=99, bpm=150)
# 1-2 · Kessler, colère de Givre : nappes froides, pulsation lente
E.add_music(E.stab([38, 45, 50, 53], 1.4, .5), 0.05); E.add_music(E.kick(1.2), .05)
E.add_music(E.pad([38, 45, 50, 53], 4.2, .16), 0.2); E.section(0.8, 4, 'half', True, riff=[38, 38, 38, 39, 38, 38, 45, 44])
E.add_music(E.pad([43, 50, 55, 58], 4.0, .16), 4); E.section(4, 8, 'build', True, riff=[43, 43, 46, 43, 43, 43, 50, 48])
E.riser(6.4, 1.6, .1)
# 3 · le gel : impact puis action
E.add_music(E.stab([38, 45, 50, 57], 1.4, .6), 8.8); E.add_music(E.kick(1.4), 8.8)
E.section(9.2, 12, 'full', True, True, riff=[38, 38, 41, 38, 36, 38, 45, 43], chord=(62, 65, 69))
# 4 · la cage : suspense
E.add_music(E.pad([46, 53, 58, 62], 3.5, .16), 12); E.section(12, 15.5, 'half', True, riff=[46, 46, 46, 45, 46, 46, 50, 49])
E.lead([74, None, 77, 76, None, 74, 70, None, 69, None, None, None], 12.3, E.BEAT)
# 5 · charge de Volta et explosion
E.section(15.5, 17.0, 'build', True); E.riser(15.5, 1.5, .12)
E.add_music(E.stab([38, 45, 50, 53, 57], 1.6, .65), 17.1); E.add_music(E.kick(1.5), 17.1)
E.section(17.6, 19.5, 'full', True, True, chord=(62, 65, 69))
# 6 · alerte : sirène et riff chromatique
E.add_music(E.pad([39, 46, 51], 3.5, .18), 19.5); E.section(19.5, 23, 'full', True, riff=[38, 39, 38, 39, 38, 39, 44, 43])
# 7-8 · course dans les escaliers : riff rapide et mélodie de poursuite
E.section(23, 31, 'full', True, True, riff=[38, 50, 38, 48, 38, 46, 38, 45], chord=(62, 65, 69))
E.lead([74, 74, 77, 74, 72, 74, 69, None, 74, 74, 77, 79, 81, None, 77, None], 23.2, E.BEAT / 2)
E.lead([81, 79, 77, 74, 77, 79, 81, None, 86, None, 84, 81, 79, None, None, None], 27.2, E.BEAT / 2)
E.add_music(E.stab([38, 45, 50, 57], 1.0, .5), 28.65)
# 9 · le dégel : retour au froid, coup sur l'explosion
E.add_music(E.pad([38, 44, 50, 53], 3.5, .18), 31); E.section(31, 32.6, 'half', False)
E.add_music(E.stab([38, 44, 50, 56], 1.8, .6), 32.6); E.add_music(E.kick(1.4), 32.6)
E.section(32.8, 34.5, 'half', True, riff=[38, 38, 44, 38])
# 10 · le Colosse : basse très grave, puis carton
E.add_music(E.pad([26, 33, 38], 2.6, .25), 34.5); E.riser(35.0, 1.9, .1)
E.add_music(E.stab([38, 44, 50, 56, 62], 2.6, .55), 36.9); E.add_music(E.kick(1.5), 36.9)
E.add_music(E.pad([38, 44, 50], 3.1, .2), 36.9)
E.finish(rewrite={"Tu m'as manqué, Sujet 2.": "Tu m'as manqué, sujet deux.", 'Activez… le Colosse.': 'Activez, le co-losse.'})
