"""Bande son de « LES ANOMALIES » ép. 10 (Le Colosse) : ré mineur 132 bpm, lourd et métallique ; riff grave
pour le géant, montée pour la charge de Volta, puis tout s'éteint quand son pouvoir est absorbé.
Voix macOS calées sur timeline.json. Usage : python3 audio.py → audio.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'les-anomalies'))
from audiolib import Episode

E = Episode(__file__, seed=110, bpm=132)
GIANT = [38, 38, 38, 39, 38, 38, 44, 43]          # riff du Colosse (ré, mi bémol, la bémol)
# 1 · fuite : alarme, batterie pleine
E.add_music(E.stab([50, 57, 62, 65], 1.2, .5), 0.05); E.add_music(E.kick(1.2), .05)
E.section(0.5, 4, 'full', True, True, riff=[38, 38, 50, 38, 41, 38, 50, 43], chord=(62, 65, 69))
# 2 · séisme : la musique se retire, grondement
E.add_music(E.pad([38, 45, 50], 4.0, .18), 4); E.section(4, 6.9, 'half', True, riff=[26, 26, 26, 27])
E.add_music(E.stab([38, 45, 50, 53], 1.8, .6), 6.9); E.add_music(E.kick(1.5), 6.9)
# 3 · le Colosse se dresse : riff géant
E.add_music(E.pad([38, 44, 50, 53], 4.0, .2), 8.0); E.section(8, 12, 'half', True, riff=GIANT)
E.lead([62, None, 63, None, 62, None, 56, None], 9.0, E.BEAT, v=.14)
# 4 · premier assaut
E.section(12, 15.5, 'full', True, True, riff=GIANT, chord=(62, 65, 68))
# 5 · Volta se charge : montée
E.add_music(E.pad([41, 48, 53, 57], 4.0, .16), 15.5); E.section(15.5, 19.5, 'build', True, riff=[41, 41, 53, 41, 43, 43, 55, 43])
E.riser(17.7, 1.8, .12)
# 6 · l'attaque de front
E.add_music(E.stab([50, 57, 62, 65, 69], 1.4, .6), 20.6); E.add_music(E.kick(1.4), 20.6)
E.section(19.5, 23, 'full', True, True, riff=[38, 38, 50, 38, 45, 38, 50, 44], chord=(62, 65, 69))
# 7 · absorption : la musique se tord, plus que le riff grave
E.add_music(E.pad([38, 44, 51], 4.0, .2), 23.0); E.section(23, 27, 'half', True, riff=GIANT)
E.lead([74, 73, 72, 71, 70, 69, 68, 67], 23.4, E.BEAT, v=.12)
# 8 · Écho l'arrache
E.section(27, 29.8, 'build', True, riff=[43, 43, 55, 43])
E.add_music(E.stab([43, 50, 55, 58], 1.6, .55), 29.8); E.add_music(E.kick(1.3), 29.8)
# 9 · à terre : nappe triste
E.add_music(E.pad([50, 53, 57], 4.0, .18), 31.0); E.add_music(E.pad([46, 50, 53], 4.0, .16), 33.0)
E.lead([69, None, 67, None, 65, None, None, None, 62], 31.6, E.BEAT, v=.1)
# 10 · mains éteintes, carton final
E.add_music(E.pad([38, 45, 50, 53], 2.0, .14), 35.0)
E.add_music(E.stab([38, 44, 50, 53], 2.5, .45), 36.9); E.add_music(E.kick(1.3), 36.9)
E.add_music(E.pad([38, 44, 50], 3.1, .2), 36.9); E.section(37.4, 40, 'half', True, riff=GIANT)
E.finish(rewrite={})
