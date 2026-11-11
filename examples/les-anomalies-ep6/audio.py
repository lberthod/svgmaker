"""Bande son de « LES ANOMALIES » ép. 6 (Capturée) : action sombre en ré mineur 150 bpm, menace métallique
pour le Mk II, poursuite, chute, puis passage suspendu (Givre, Mirage). Usage : python3 audio.py → audio.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'les-anomalies'))
from audiolib import Episode

E = Episode(__file__, seed=66, bpm=150)
# 1 · après l'essaim : nappe grave, cœur qui bat
E.add_music(E.stab([38, 45, 50, 53], 1.4, .5), 0.05); E.add_music(E.kick(1.2), .05)
E.add_music(E.pad([38, 45, 50, 53], 4.0, .16), 0.3); E.section(0.8, 4, 'none', True, riff=[38, 38, 38, 38, 38, 38, 37, 37])
# 2 · le Mk II : riff chromatique lourd
E.add_music(E.stab([38, 44, 50, 56], 1.4, .6), 4.3); E.add_music(E.kick(1.4), 4.3)
E.add_music(E.pad([38, 44, 50], 4.2, .17), 4.3); E.section(4.3, 8.5, 'half', True, riff=[38, 38, 39, 38, 38, 38, 44, 43])
# 3–4 · charge de Volta, choc sur le blindage
E.riser(8.6, 2.0, .12); E.section(8.5, 10.6, 'build', True, riff=[38, 41, 43, 45, 46, 45, 43, 41])
E.add_music(E.stab([50, 53, 57, 62], 1.0, .55), 10.6)
E.section(10.6, 15.5, 'full', True, True, riff=[38, 38, 50, 38, 48, 38, 46, 45], chord=(62, 65, 69))
E.add_music(E.stab([39, 46, 51, 58], 1.2, .55), 15.6); E.add_music(E.kick(1.4), 15.6)
# 5 · gros plan sur Écho : suspendu
E.add_music(E.pad([50, 53, 57, 60], 2.4, .16), 16.7); E.lead([74, None, 72, None, 69, None, 67, None, None], 16.8, E.BEAT * 1.2, .12)
# 6–7 · décollage, poursuite, chute
E.section(19, 22.9, 'full', True, True, riff=[38, 38, 41, 38, 43, 38, 45, 46])
E.add_music(E.stab([38, 45, 50, 53, 57], 1.6, .6), 22.9); E.add_music(E.kick(1.4), 22.9)
E.add_music(E.pad([38, 45, 50], 3.1, .15), 22.9); E.section(23.4, 26, 'half', True)
# 8 · Volta furieuse face à la Tour
E.add_music(E.pad([43, 50, 55, 58], 3.5, .17), 26); E.section(26, 29.5, 'build', True, riff=[43, 43, 46, 43, 48, 43, 50, 48])
# 9 · Givre la retient : tout retombe
E.add_music(E.pad([45, 52, 57, 60], 3.5, .16), 29.6); E.section(29.6, 33, 'none', True, riff=[45, 45, 45, 45, 44, 44, 44, 44])
# 10 · Mirage : mystère puis carton
E.add_music(E.pad([47, 54, 59, 62], 3.9, .15), 33); E.lead([71, None, 74, 76, None, 74, 71, None], 33.4, E.BEAT, .14)
E.riser(35.4, 1.5, .1)
E.add_music(E.stab([38, 45, 50, 53, 57], 2.5, .5), 36.9); E.add_music(E.kick(1.3), 36.9)
E.add_music(E.pad([38, 45, 50, 57], 3.1, .2), 36.9)
E.finish(rewrite={'Sujet 3. Capture confirmée.': 'Sujet trois. Capture confirmée.'})
