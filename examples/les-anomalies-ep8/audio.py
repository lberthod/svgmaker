"""Bande son de « LES ANOMALIES » ép. 8 (Le laboratoire) : suspense en ré mineur 120 bpm,
nappes froides de laboratoire, souvenir de Givre en accords suspendus, montée vers l'apparition de Kessler.
Voix macOS calées sur timeline.json. Usage : python3 audio.py → audio.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'les-anomalies'))
from audiolib import Episode

E = Episode(__file__, seed=88, bpm=120)
E.riff = [38, 38, 45, 38, 41, 38, 44, 43]
# 1-2 · la porte, la rangée de cuves : pulsation sourde et nappe froide
E.add_music(E.stab([38, 45, 50, 53], 1.4, .5), 0.05); E.add_music(E.kick(1.2), .05)
E.add_music(E.pad([38, 45, 50, 53], 4.2, .16), 0.3); E.section(0.6, 4, 'none', True, riff=[38, 38, 38, 38, 45, 38, 38, 38])
E.add_music(E.pad([41, 48, 53, 57], 4.0, .16), 4); E.section(4, 8, 'half', True)
E.lead([74, None, 72, None, 69, None, None, 72, 74, None, 77, None, None, None, 76, None], 4.2, E.BEAT / 2, .12)
# 3 · le mur de capsules : montée
E.add_music(E.pad([43, 50, 55, 58], 3.5, .18), 8); E.riser(8.6, 2.0, .1); E.section(8, 11.5, 'build', True)
E.add_music(E.stab([38, 45, 50, 56], 1.0, .45), 10.6)
# 4 · la patrouille : tension, basse seule
E.add_music(E.pad([38, 44, 50], 3.5, .14), 11.5); E.section(11.5, 15, 'half', True, riff=[38, 38, 39, 38, 38, 38, 44, 43])
# 5-6 · la cuve vide et le souvenir : accords suspendus, puis choc
E.add_music(E.pad([45, 50, 52, 57], 4.0, .2), 15); E.lead([81, None, None, 79, None, None, 76, None, None, 74, None, None], 15.4, E.BEAT / 2, .1)
E.add_music(E.pad([46, 53, 58, 62], 2.0, .2), 19); E.add_music(E.stab([38, 45, 50, 57, 62], 1.6, .55), 20.0); E.add_music(E.kick(1.4), 20.0)
E.section(20.0, 23, 'full', True, True)
# 7 · le dossier : pulsation électronique
E.add_music(E.pad([41, 48, 53, 56], 4.0, .15), 23); E.section(23, 27, 'half', True, riff=[38, 50, 38, 50, 41, 53, 43, 55])
# 8 · soutien : majeur, chaleureux
E.add_music(E.pad([46, 53, 58, 62], 2.3, .2), 27); E.add_music(E.pad([48, 55, 60, 64], 1.7, .2), 29.3)
E.lead([74, None, 77, None, 81, None, None, None, 79, None, 77, None, 79, None, None, None], 27.3, E.BEAT / 2, .12)
E.section(29.3, 31, 'build', True, riff=[48, 48, 55, 48, 48, 48, 55, 53])
# 9 · les lumières s'éteignent : silence presque total, battement
E.add_music(E.pad([38, 44], 3.5, .12), 31.2); E.riser(32.9, 1.6, .12)
# 10 · Kessler + carton
E.add_music(E.stab([38, 44, 50, 56], 2.5, .55), 34.5); E.add_music(E.kick(1.4), 34.5)
E.section(34.6, 36.9, 'half', True, riff=[38, 38, 44, 38])
E.add_music(E.pad([38, 45, 50, 53], 3.1, .22), 36.9); E.add_music(E.kick(1.3), 36.9)
E.finish(rewrite={'Écho est au niveau 3.': 'Écho est au niveau trois.', 'Bon retour parmi nous, Sujet 2.': 'Bon retour parmi nous, Sujet deux.'})
