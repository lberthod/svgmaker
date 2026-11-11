"""Bande son de « LES ANOMALIES » ép. 15 (Oméga, final de saison) : ré mineur 150 bpm, ouverture menaçante
pour l'IA, montée héroïque de la Formation Delta, explosion, aube en majeur, épilogue inquiétant.
Usage : python3 audio.py → audio.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'les-anomalies'))
from audiolib import Episode

E = Episode(__file__, seed=15, bpm=150)
# 1-2 · OMEGA s'éveille : nappe grave, pulsation, riff chromatique
E.add_music(E.stab([38, 45, 50, 53], 1.4, .5), 0.05); E.add_music(E.kick(1.3), .05)
E.add_music(E.pad([38, 45, 50, 51], 4.2, .18), 0.3); E.section(0.8, 4, 'none', True, riff=[38, 38, 39, 38])
E.add_music(E.pad([38, 44, 50], 4.5, .18), 4); E.section(4, 8.5, 'half', True, riff=[38, 38, 39, 38, 38, 38, 44, 43])
# 3 · Encerclés : tension qui monte
E.section(8.5, 11.5, 'build', True, riff=[38, 38, 41, 38, 43, 38, 44, 43]); E.riser(10.0, 1.5, .12)
# 4-7 · Formation Delta → assaut : plein tempo, mélodie héroïque
E.add_music(E.stab([50, 57, 62, 65], 1.0, .55), 11.5); E.add_music(E.kick(1.3), 11.5)
E.add_music(E.pad([46, 53, 58, 62], 4.0, .16), 11.5)
E.lead([74, None, 77, 79, None, 77, 74, None, 81, 79, 77, None, 74, None, 72, 74], 11.8, E.BEAT / 2)
E.section(11.5, 26, 'full', True, True, riff=[38, 38, 50, 38, 41, 38, 43, 45], chord=(62, 65, 69))
E.add_music(E.pad([43, 50, 55, 58], 3.5, .15), 19.3); E.add_music(E.pad([45, 52, 57, 61], 3.2, .15), 22.8)
# 8 · La charge de Volta puis l'explosion
E.section(26, 28, 'build', True, riff=[45, 45, 45, 45]); E.riser(26.2, 1.8, .16)
E.add_music(E.stab([38, 45, 50, 57, 62], 2.2, .7), 28.3); E.add_music(E.kick(1.5), 28.3)
# 9 · L'aube : ré majeur, lumineux
E.add_music(E.pad([50, 54, 57, 62], 3.4, .2), 30.0); E.lead([78, None, 81, None, 83, 81, 78, None], 30.4, E.BEAT)
E.section(30.4, 33.2, 'half', True, riff=[38, 45, 50, 45], chord=(62, 66, 69))
# 10 · Épilogue inquiétant puis carton
E.add_music(E.pad([38, 44, 50, 53], 3.7, .16), 33.2); E.section(33.2, 36.9, 'none', True, riff=[38, 38, 44, 38])
E.add_music(E.stab([38, 45, 50, 53, 57], 2.6, .5), 36.9); E.add_music(E.kick(1.3), 36.9)
E.add_music(E.pad([38, 45, 50, 53], 3.0, .18), 37.0)
E.finish(rewrite={'Je suis OMEGA.': 'Je suis Oméga.', "Toutes les machines m'obéissent.": "Toutes les machines m'obéissent.",
                  "C'est terminé, OMEGA !": "C'est terminé, Oméga !", 'Formation Delta !': 'Formation Delta !'})
