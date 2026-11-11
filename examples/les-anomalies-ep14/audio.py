"""Bande son de « LES ANOMALIES » ép. 14 (Assaut) : combat final en ré mineur 150 bpm, orage,
montée pour la charge de Volta, puis chute glaciale quand l'œil OMEGA s'ouvre.
Voix macOS calées sur timeline.json. Usage : python3 audio.py → audio.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'les-anomalies'))
from audiolib import Episode

E = Episode(__file__, seed=14, bpm=150)
# 1 · arrivée sous l'orage
E.add_music(E.stab([50, 57, 62, 65], 1.4, .55), 0.05); E.add_music(E.kick(1.3), .05)
E.add_music(E.pad([38, 45, 50, 53], 4.0, .17), 0.2); E.section(0.6, 4, 'half', True, riff=[38, 38, 50, 38, 41, 38, 48, 45])
# 2 · le Colosse monte : basse grave, puis impact
E.add_music(E.pad([38, 44, 50], 2.2, .2), 4); E.riser(4.2, 1.9, .12); E.section(4, 6.1, 'build', True)
E.add_music(E.stab([38, 44, 50, 56], 1.8, .65), 6.1); E.add_music(E.kick(1.5), 6.1)
E.section(6.2, 8, 'half', True, riff=[38, 38, 44, 38, 38, 38, 44, 43])
# 3–6 · le combat en équipe
E.add_music(E.pad([45, 52, 57, 60], 3.5, .16), 8); E.section(8, 15, 'full', True, True)
E.lead([74, None, 77, 74, None, 72, 69, None, 72, 74, None, None, 77, None, 81, 79], 11.6, E.BEAT)
E.add_music(E.pad([46, 53, 58, 62], 3.5, .15), 15); E.section(15, 18.5, 'half', True, riff=[46, 46, 53, 46, 58, 46, 53, 51])
E.add_music(E.stab([43, 50, 55, 58], 1.2, .55), 18.9); E.section(18.5, 22, 'full', True, True, chord=(62, 65, 70))
# 7 · la charge de Volta : montée
E.add_music(E.pad([50, 57, 62, 65, 69], 3.0, .2), 22); E.section(22, 24.9, 'build', True); E.riser(23.2, 1.8, .16)
# 8 · l'éclair et l'explosion
E.add_music(E.stab([50, 57, 62, 66, 69], 2.0, .7), 25.6); E.add_music(E.kick(1.5), 27.0)
E.section(25.6, 27.0, 'full', True, True, chord=(62, 66, 69))
E.add_music(E.stab([50, 54, 57, 62], 2.4, .5), 27.0)
# 9 · victoire… trompeuse
E.add_music(E.pad([50, 54, 57, 62], 2.0, .17), 29.5); E.add_music(E.pad([50, 53, 56, 62], 2.2, .17), 31.4)
E.section(31.4, 33.5, 'half', False)
# 10 · OMEGA s'ouvre
E.add_music(E.pad([38, 44, 50, 53], 1.6, .2), 33.5); E.riser(33.6, 1.4, .12)
E.add_music(E.stab([38, 44, 50, 56, 62], 2.6, .6), 35.0); E.add_music(E.kick(1.5), 35.0)
E.section(35.0, 36.9, 'half', True, riff=[38, 38, 44, 38])
E.add_music(E.pad([38, 44, 50], 3.1, .22), 36.9); E.add_music(E.kick(1.3), 36.9)
E.finish(rewrite={})
