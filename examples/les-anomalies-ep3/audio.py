"""Bande son de « LES ANOMALIES » ép. 3 (La planque) : ré mineur 132 bpm. Ouverture légère sur les toits,
entraînement rythmé, dispute tendue, accalmie sans batterie pour Écho, mystère pour Mirage, montée du drone
et explosion de la verrière. Voix macOS calées sur timeline.json. Usage : python3 audio.py → audio.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'les-anomalies'))
from audiolib import Episode

E = Episode(__file__, seed=33, bpm=132)
# 1 · toits : accord d'ouverture, groove léger
E.add_music(E.stab([50, 57, 62, 65], 1.2, .5), 0.05); E.add_music(E.kick(1.2), .05)
E.add_music(E.pad([38, 45, 50, 53], 4.0, .15), 0.2)
E.section(0.6, 4, 'half', True, riff=[38, 38, 45, 38, 41, 38, 45, 43])
E.lead([74, None, 77, 76, None, 74, 72, None], 1.0, E.BEAT)
# 2-3 · entraînement puis ricochet
E.add_music(E.pad([41, 48, 53, 57], 4.0, .14), 4)
E.section(4, 8.3, 'full', True, True, riff=[38, 38, 41, 38, 43, 41, 38, 36], chord=(62, 65, 69))
E.add_music(E.stab([50, 56, 62], .8, .55), 8.55)
E.section(8.8, 12, 'half', True, riff=[38, 38, 39, 38, 38, 44, 43, 39])
# 4-5 · dispute : tension montante jusqu'à l'intervention d'Écho
E.add_music(E.pad([38, 44, 50, 56], 4.0, .16), 12)
E.section(12, 16, 'full', True, True, riff=[38, 39, 38, 44, 38, 39, 43, 44], chord=(62, 63, 68))
E.section(16, 17.15, 'build', True, riff=[38, 38, 38, 38])
E.add_music(E.stab([50, 57, 62, 66], 1.5, .55), 17.15)
E.add_music(E.pad([46, 53, 58, 62], 2.9, .15), 17.2)
# 6 · accalmie : nappes seules et petite mélodie
E.add_music(E.pad([41, 48, 53, 57, 60], 4.0, .18), 20)
E.lead([69, None, 72, None, 74, 72, None, 69, 67, None, 65, None], 20.4, E.BEAT * 1.5, .12)
# 7-8 · Mirage puis le regard vers le ciel
E.add_music(E.pad([43, 50, 55, 58], 4.0, .16), 24); E.section(24, 28, 'half', False)
E.add_music(E.pad([38, 44, 50], 3.5, .16), 28); E.section(28, 31.5, 'half', True, riff=[38, 38, 44, 38])
# 9 · repérés : montée
E.section(31.5, 34.7, 'build', True, riff=[38, 39, 38, 39]); E.riser(33.0, 1.7, .12)
# 10 · explosion et carton final
E.add_music(E.stab([38, 45, 50, 56], 2.2, .6), 34.7); E.add_music(E.kick(1.5), 34.7)
E.section(35.2, 36.9, 'half', True, riff=[38, 38, 44, 38])
E.add_music(E.pad([38, 45, 50, 53], 3.1, .2), 36.9); E.add_music(E.kick(1.3), 36.9)
E.finish()
