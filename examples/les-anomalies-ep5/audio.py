"""Bande son de « LES ANOMALIES » ép. 5 (L'essaim) : bataille en ré mineur 150 bpm, bourdon d'essaim,
passage tendu (battements de cœur) pendant l'effort d'Écho, chute et menace finale.
Voix macOS calées sur timeline.json. Usage : python3 audio.py → audio.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'les-anomalies'))
from audiolib import Episode

E = Episode(__file__, seed=55, bpm=150)
D_RIFF = [38, 38, 41, 38, 36, 38, 45, 43]
E.add_music(E.stab([50, 57, 62, 65], 1.2, .5), 0.05); E.add_music(E.kick(1.2), .05)
E.add_music(E.pad([38, 45, 50, 53], 4.0, .16), 0.2); E.section(0.6, 4, 'build', True, riff=D_RIFF)
E.add_music(E.stab([50, 57, 62], .8, .5), 4.3)
E.section(4, 12, 'full', True, True, riff=D_RIFF, chord=(62, 65, 69))
E.lead([74, None, 77, 76, None, 74, 72, None, 74, None, 69, None], 8.0, E.BEAT)
E.add_music(E.pad([46, 53, 58, 62], 3.5, .16), 12); E.section(12, 15.5, 'full', True, riff=[46, 46, 50, 46, 45, 46, 53, 50], chord=(62, 65, 70))
E.add_music(E.pad([38, 44, 50, 53], 3.1, .2), 15.5); E.section(15.5, 18.6, 'half', True, riff=[38, 38, 44, 38])
E.riser(17.0, 1.6, .12)
E.add_music(E.stab([50, 57, 62, 65, 69], 1.2, .55), 18.6); E.section(18.6, 23.5, 'full', True, True, riff=D_RIFF)
E.add_music(E.pad([43, 50, 55, 58], 3.5, .18), 23.5); E.section(23.5, 27, 'none', False)
E.riser(25.6, 2.3, .14)
E.add_music(E.stab([50, 57, 62, 65, 69, 74], 1.8, .6), 27.95); E.add_music(E.kick(1.4), 27.95)
E.section(28.2, 30.5, 'full', True, True, riff=D_RIFF)
E.add_music(E.pad([41, 48, 53, 57], 3.5, .15), 30.5); E.section(30.5, 34, 'none', False)
E.add_music(E.stab([38, 44, 50, 56], 2.5, .5), 34.0); E.section(34.0, 36.9, 'half', True, riff=[38, 38, 44, 38])
E.add_music(E.pad([38, 44, 50], 3.1, .2), 36.9); E.add_music(E.kick(1.3), 36.9)
E.finish()
