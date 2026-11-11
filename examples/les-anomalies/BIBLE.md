# LES ANOMALIES — bible de la série (saison 1, 15 épisodes)

Manga d'action original, format Reel 9:16 (1080×1920), 40 s par épisode, en français.
Encre noire + papier crème + trames, **une couleur par pouvoir**, rouge pour l'ennemi.
Chaque épisode : accroche ≤ 1 s, ~10 répliques courtes (≤ 2 lignes de bulle), 9 à 11 plans,
mouvement permanent (caméra par plan, squelettes animés, particules), cliffhanger final
+ carton « LES ANOMALIES » immobile ≥ 2,8 s.

## Personnages

| Clé | Nom | Pouvoir | Couleur | Silhouette | Voix macOS |
|---|---|---|---|---|---|
| `volta` | **Volta** | électricité | jaune `#ffd21f` | cheveux en pointes, fonceuse, vanne facile | Flo (FR) |
| `givre` | **Givre** | glace | cyan `#2ec5ff` | mèche balayée blanche, calme, stratège | Eddy (FR) |
| `echo` | **Écho** | télékinésie | violet `#a35bff` | cheveux longs violets, flotte, cœur du groupe | Shelley (FR) |
| `mirage` | **Mirage** (Sujet 4) | invisibilité, illusions | vert `#2fe07d` | capuche, méfiante, ironique | Amélie |
| `kessler` | **Dr Kessler** | — (cheffe du projet OMEGA) | rouge `#e3122a` | blouse/manteau long, chignon, visière rouge | Grandma (FR), grave |
| `robot` | **Le Traqueur** (et ses copies) | chasseur, laser, missiles | rouge | robot noir, œil rouge, symbole Ω | Thomas, voix métallique |
| `colosse` | **Le Colosse** | robot géant (ép. 10+) | rouge/orange | Traqueur géant à deux yeux | Jacques, voix métallique grave |
| `omega` | **OMEGA** (l'IA) | — (vrai boss, ép. 14–15) | rouge | grand œil Ω sur écrans | Thomas, très métallique |

L'organisation ennemie s'appelle **le projet OMEGA** (logo Ω). Les mutants sont des « Sujets » numérotés.
Ville : **Néo-Lyre**, nuit, toits, néons.

## Arc de la saison

| Ép. | Titre | Résumé (début → cliffhanger) |
|---|---|---|
| 1 | Chasse aux mutants | Le trio bat un Traqueur. Un 2ᵉ œil s'ouvre : « Sujet 4… localisé. » |
| 2 | Sujet 4 | Métro abandonné. Les Traqueurs cernent une fille invisible : Mirage. Le trio la sauve ; elle disparaît en volant le badge Ω d'un robot. Fin : le badge affiche « Tour OMEGA ». |
| 3 | La planque | Repaire sur un toit (vieux château d'eau). Entraînement qui tourne mal : Volta et Givre se disputent, Écho calme tout. Mirage réapparaît : « Vous êtes suivis. » Fin : un drone espion explose la verrière. |
| 4 | La Directrice | Hologramme géant du Dr Kessler sur les écrans de la ville : elle offre une récompense. Fin : « Livrez-les-moi. » — des milliers de drones décollent de la Tour. |
| 5 | L'essaim | Bataille contre l'essaim de drones au-dessus des toits. Écho retient une pluie de drones et s'épuise. Fin : Écho s'effondre, une ombre géante la saisit. |
| 6 | Capturée | Un Traqueur Mk II (blindé blanc et rouge) enlève Écho. Volta fonce seule et se fait repousser. Fin : Givre retient Volta : « On a besoin d'un plan. » Mirage : « J'ai un plan. » |
| 7 | Infiltration | Mirage rend le trio invisible ; ils entrent dans la Tour OMEGA. Couloirs, lasers de détection, Givre gèle les caméras. Fin : une porte s'ouvre sur un laboratoire géant. |
| 8 | Le laboratoire | Cuves pleines de mutants endormis, de toutes les couleurs. Givre reconnaît sa propre cuve : il s'est déjà évadé d'ici. Fin : Kessler, derrière eux : « Bon retour, Sujet 2. » |
| 9 | Évasion | Givre gèle Kessler dans un bloc de glace ; Volta libère Écho (cage d'énergie). Course-poursuite dans les escaliers, la Tour se met en alerte. Fin : le sol tremble — « Activez… le Colosse. » |
| 10 | Le Colosse | Robot géant dans la rue. Volta l'attaque de front : son pouvoir est absorbé. Fin : Volta s'effondre, ses mains ne crépitent plus. |
| 11 | Sans étincelle | Planque. Volta sans pouvoir, doute. Écho et Givre la soutiennent, Mirage raconte qu'elle aussi a eu peur. Fin : l'orage éclate sur la ville, un éclair frappe le toit… les yeux de Volta se rallument. |
| 12 | La centrale | Volta se recharge sur la centrale électrique de Néo-Lyre ; plus puissante que jamais (cheveux blancs-jaunes). Traqueurs balayés. Fin : un message des mutants libérés du labo : « On veut se battre. » |
| 13 | Les Anomalies | Les mutants libérés rejoignent l'équipe (silhouettes colorées). Le groupe prend un nom : « LES ANOMALIES ». Fin : la Tour OMEGA se déplie et devient une forteresse. |
| 14 | Assaut | Assaut final : combat contre le Colosse sur le toit de la Tour. Volta l'abat avec l'aide de tous. Fin : Kessler rit — « Vous croyez que c'est moi qui commande ? » Le grand œil OMEGA s'allume. |
| 15 | Oméga | L'IA OMEGA prend le contrôle de toutes les machines. Formation Delta + Mirage : illusions + glace + télékinésie + foudre détruisent le noyau. Victoire, aube sur la ville. Fin d'épilogue : Kessler s'échappe, un nouvel œil vert dans l'ombre — « Saison 2 ». |

## Règles techniques (communes)

- Code : `examples/les-anomalies-epN/make.mjs` importe `../les-anomalies/lib.mjs` ; son : `audio.py` appelle `../les-anomalies/audiolib.py`.
- Une seule bulle à l'écran à la fois ; réplique ≤ 26 caractères par ligne, ≤ 2 lignes.
- Textes (bulles, onomatopées, titres) **hors caméra** (couche HUD) ; tout le reste bouge.
- Zones sûres Reels : haut 220, bas 1500, côtés 60–1020, pas de texte en x > 960 et y > 1050.
- Carton final : `data-role="final"`, immobile (pas de scale), dernières 3 s.
- Bandeau d'ouverture : « ÉPISODE N · TITRE » en haut, accroche (`data-role="hook"`) avant 1 s.
- Rendu : `node bin/svgmaker.mjs render <svg> -f --audit --gif --sheet --cover-at X`.
