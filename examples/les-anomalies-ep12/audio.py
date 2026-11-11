"""Bande son de « LES ANOMALIES » ép. 12 (La centrale) : orage en ré mineur, montée de la recharge,
action pleine à 150 bpm quand Volta revient, accalmie puis message mystérieux du labo.
Voix macOS calées sur timeline.json. Usage : python3 audio.py → audio.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'les-anomalies'))
from audiolib import Episode

E = Episode(__file__, seed=1212, bpm=150)
# 1–2 · pluie sur le toit, la clôture
E.add_music(E.stab([50, 57, 62, 65], 1.2, .45), 0.05); E.add_music(E.kick(1.1), .05)
E.add_music(E.pad([38, 45, 50, 53], 4.2, .15), 0.2); E.section(0.8, 4, 'half', False)
E.add_music(E.pad([38, 46, 50, 53], 4.0, .16), 4); E.section(4, 8, 'half', True, riff=[38, 38, 41, 38, 38, 45, 44, 41])
# 3 · la recharge : montée
E.add_music(E.pad([43, 50, 55, 58], 4.0, .18), 8); E.riser(8.2, 1.8, .14); E.section(8, 12, 'build', True)
E.add_music(E.stab([50, 57, 62, 66], 1.0, .55), 10.0)
# 4 · l'alarme
E.add_music(E.pad([38, 44, 50], 3.5, .16), 12); E.section(12, 15.5, 'half', True, riff=[38, 38, 44, 38, 38, 38, 44, 43])
# 5–8 · le retour de Volta : action pleine, mélodie héroïque
E.add_music(E.stab([50, 57, 62, 65, 69], 1.6, .6), 17.0); E.add_music(E.kick(1.4), 17.0)
E.section(17, 21.2, 'full', True, True, chord=(62, 66, 69))
E.lead([74, None, 77, 79, None, 77, 74, None, 72, 74, None, 81], 17.2, E.BEAT)
E.add_music(E.pad([45, 52, 57, 61], 1.9, .15), 21.2); E.section(21.2, 23, 'half', True)
E.section(23, 24.9, 'build', True); E.riser(23.2, 1.6, .12)
E.add_music(E.stab([50, 57, 62, 65, 69], 1.6, .6), 24.9); E.add_music(E.kick(1.4), 24.9)
# 9 · après la bataille : majeur, détente
E.add_music(E.pad([50, 54, 57, 62], 4.0, .16), 27.0); E.section(27, 31, 'half', False)
E.lead([66, None, 69, None, 74, None, 73, None], 27.6, E.BEAT * 2, .12)
# 10–11 · le message, le cliffhanger
E.add_music(E.pad([43, 50, 53, 58], 3.5, .14), 31.0); E.section(31, 34.5, 'half', False)
E.riser(33.0, 1.5, .1)
E.add_music(E.stab([38, 45, 50, 57], 2.5, .45), 34.6); E.section(34.6, 36.9, 'half', True, riff=[38, 38, 45, 38])
E.add_music(E.pad([38, 45, 50, 53], 3.1, .2), 36.9); E.add_music(E.kick(1.3), 36.9)
E.finish(rewrite={})
