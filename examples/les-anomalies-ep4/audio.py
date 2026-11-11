"""Bande son de « LES ANOMALIES » ép. 4 (La Directrice) : thème froid de Kessler en ré mineur 120 bpm
(orgue grave, cloches), montée d'angoisse, puis essaim de drones en action plein régime pour le cliffhanger.
Voix macOS calées sur timeline.json. Usage : python3 audio.py → audio.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'les-anomalies'))
from audiolib import Episode

E = Episode(__file__, seed=44, bpm=120)
# 1-2 · ruines de la planque puis écrans qui basculent
E.add_music(E.stab([50, 57, 62, 65], 1.2, .45), 0.05); E.add_music(E.kick(1.1), .05)
E.add_music(E.pad([38, 45, 50, 53], 4.2, .15), 0.2); E.section(0.6, 4, 'half', True, riff=[38, 38, 45, 38, 41, 38, 45, 44])
E.add_music(E.pad([38, 44, 50], 4.0, .16), 4); E.section(5.1, 8, 'half', True, riff=[38, 38, 39, 38, 38, 38, 44, 43])
# 3-5 · le thème de la Directrice : lent, solennel, cloches (lead) sur nappes
E.add_music(E.stab([38, 45, 50, 53, 57], 2.0, .5), 8.2)
E.add_music(E.pad([38, 45, 50, 53], 4.0, .2), 8.2); E.lead([74, None, 72, 69, None, None, 70, None, 69, 65, None, None], 8.6, E.BEAT * .66)
E.add_music(E.pad([34, 41, 46, 50], 3.5, .18), 12); E.section(12, 15.5, 'half', True, riff=[34, 34, 41, 34])
E.add_music(E.pad([36, 43, 48, 51], 4.0, .18), 15.5); E.lead([72, None, 70, 69, None, 67, 69, None], 16.2, E.BEAT)
E.section(15.5, 19.5, 'half', False)
# 6-7 · réaction de l'équipe, Mirage : rythme qui repart
E.section(19.5, 22.5, 'full', True, True, riff=[38, 38, 50, 38, 48, 38, 45, 46], chord=(62, 65, 69))
E.add_music(E.pad([43, 50, 55, 58], 4.5, .14), 22.5); E.section(22.5, 27, 'half', True, riff=[43, 43, 50, 43])
# 8 · écran grillé
E.add_music(E.pad([38, 44, 50], 3.0, .16), 27); E.section(27, 29.8, 'build', True)
E.add_music(E.stab([38, 45, 50, 57], 1.4, .6), 30.0); E.add_music(E.kick(1.4), 30.0)
# 9 · « Livrez-les donc… à moi » : silence tendu puis montée
E.add_music(E.pad([37, 44, 49, 52], 3.5, .2), 31.0); E.riser(32.8, 1.7, .12)
# 10 · l'essaim + carton final
E.add_music(E.stab([38, 45, 50, 53, 57], 1.6, .6), 34.6); E.add_music(E.kick(1.4), 34.6)
E.section(34.6, 36.9, 'full', True, True, riff=[38, 38, 50, 38, 39, 38, 46, 45])
E.add_music(E.pad([38, 44, 50], 3.1, .2), 36.9); E.add_music(E.kick(1.3), 36.9)
E.finish()
