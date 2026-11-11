# LES ANOMALIES — saison 1 (15 × 40 s, Reel 9:16)

Montage complet : `les-anomalies-saison1.mp4` (10 min, généré, non versionné). Couvertures : `saison1-couvertures.jpg`.
Chaque épisode : `examples/les-anomalies-epN/` (`make.mjs` + `audio.py` versionnés ; mp4, gif, couverture, planches générés).
Régénérer un épisode : `zsh examples/les-anomalies/check.sh N` (SVG, son, Whisper, rendu + audit, planche de contrôle).

| Ép. | Titre | Cliffhanger |
|---|---|---|
| 1 | Chasse aux mutants | « Sujet 4… localisé. » |
| 2 | Sujet 4 | Le badge volé affiche « TOUR OMEGA » |
| 3 | La planque | Un drone traverse la verrière |
| 4 | La Directrice | Des milliers de drones décollent de la Tour |
| 5 | L'essaim | Une ombre géante emporte Écho |
| 6 | Capturée | « J'ai un plan. » |
| 7 | Infiltration | La porte s'ouvre sur le laboratoire |
| 8 | Le laboratoire | « Bon retour parmi nous, Sujet 2. » |
| 9 | Évasion | « Activez… le Colosse. » |
| 10 | Le Colosse | Volta n'a plus de pouvoir |
| 11 | Sans étincelle | Un éclair rallume ses yeux |
| 12 | La centrale | « On veut se battre avec vous. » |
| 13 | Les Anomalies | La Tour se déplie en forteresse |
| 14 | Assaut | Le grand œil OMEGA s'allume |
| 15 | Oméga | Kessler s'enfuit, un œil vert… « Saison 2 » |

Contrôle final : 15/15 audit Reels OK (0 alerte), image et son = 40,000 s chacun ; chaque épisode est passé par
3 boucles rendu → planche → corrections, avec contrôle Whisper de chaque réplique.

Points connus :
- Les mutants libérés n'ont pas les mêmes noms d'un épisode à l'autre (ép. 12 : Rose, Braise, Jade, Azur ; ép. 13 : Braise, Rose, Onde, Nova, Roc ; ép. 14 : Rose, Cobalt).
- La voix de Kessler (Grandma) est la moins bien comprise par Whisper ; ses répliques ont été reformulées en conséquence (ép. 4 : « Livrez-les donc… à moi. »).
