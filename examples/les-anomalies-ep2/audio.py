"""Bande son de « LES ANOMALIES » ép. 2 (Sujet 4) : action en mi mineur 140 bpm, passage mystérieux
pour Mirage, voix macOS calées sur timeline.json. Usage : python3 audio.py → audio.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'les-anomalies'))
from audiolib import Episode

E = Episode(__file__, seed=22, bpm=140)
E.add_music(E.stab([52, 59, 64, 67], 1.2, .5), 0.05); E.add_music(E.kick(1.2), .05)
E.add_music(E.pad([40, 47, 52, 55], 4.2, .16), 0.2); E.section(0.6, 4, 'half', True)
E.add_music(E.pad([40, 46, 52], 4.0, .16), 4); E.section(4, 8, 'half', True, riff=[40, 40, 41, 40, 40, 40, 46, 45])
E.add_music(E.pad([47, 54, 59, 62], 4.0, .18), 8); E.lead([71, None, 74, 76, None, 74, 71, None, 69, 71, None, None], 8.4, E.BEAT)
E.section(12, 23, 'full', True, True)
E.add_music(E.pad([45, 52, 57, 60], 2.0, .15), 23); E.section(23, 25.1, 'build', True)
E.add_music(E.stab([52, 59, 64, 67, 71], 1.6, .6), 25.1); E.add_music(E.kick(1.4), 25.1)
E.add_music(E.pad([52, 56, 59, 64], 4.0, .16), 27.0)
E.add_music(E.pad([47, 54, 59], 3.5, .14), 31.0); E.section(31, 34.5, 'half', False)
E.riser(33.0, 1.5, .1)
E.add_music(E.stab([40, 46, 52, 58], 2.5, .45), 34.6); E.section(34.6, 36.9, 'half', True, riff=[40, 40, 46, 40])
E.add_music(E.pad([40, 46, 52], 3.1, .2), 36.9); E.add_music(E.kick(1.3), 36.9)
E.finish(rewrite={'Sujet 4. Reddition immédiate.': 'Sujet quatre. Reddition immédiate.', 'La Tour OMEGA…': 'La tour Oméga.'})
