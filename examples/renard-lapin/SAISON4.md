# Roussin & Lino · Saison 4 « Un hiver à la montagne »

Suite des saisons 1 (l'école), 2 (la ferme) et 3 (la mer). Les vacances de fin d'année arrivent : Mme Chouette emmène la classe **une journée dans un chalet à la montagne**, du réveil sous la neige (7h30) jusqu'à la veillée au coin du feu (20h30). 15 épisodes de 30 s, 1280×720, mêmes règles de dessin et de ton que les saisons précédentes (public 3–7 ans, tendre et burlesque, aucun méchant, un gag original par épisode).

## Personnages

Anciens (inchangés, mêmes voix) : `fox` Roussin, `rab` Lino, `owl` Mme Chouette, `mimi`, `coin`, `snail` Mme Escargot, `hedge` Piquette, `badger` Papi Bernard (il a prêté son chalet), `frog` Plouf (invité de l'ép. 14, en vacances au chaud) ; Rouge-Gorge (oiseau, bruitage seulement).

Nouveaux (à dessiner dans `lib/cast4.mjs`, voix Ming à ajouter dans `CHARS` et `TARGET` de `lib/ming_design.py`) :

| id voix | Personnage | Caractère | Signes visuels | Voix (description FR) | Style Ming (chinois) | Hz cible |
|---|---|---|---|---|---|---|
| `marmot` | **Mamie Marmotte**, la marmotte gardienne du chalet | douce, somnolente, câline, s'endort au milieu des phrases, se réveille en sursaut avec une bonne idée | ronde, fourrure brun-miel, ventre crème, petites oreilles, bonnet de nuit rayé rouge et blanc avec pompon, paupières lourdes à demi fermées, chaussons | voix de grand-mère enveloppante, lente, un peu ensommeillée, bâillements | `一位慈祥的老奶奶，声音温暖柔和，带着睡意，语速很慢，语气亲切又迷迷糊糊。` | 190 |
| `ibex` | **Bouquet** le bouquetin, moniteur de luge et de patinoire | sportif, enthousiaste, fier de son équipement, très sûr de lui puis maladroit sur la glace, bon camarade | gris-beige, grandes cornes courbes annelées, barbiche, écharpe verte, bonnet orange, lunettes de ski relevées sur le front, sabots bruns | voix de jeune homme sportif, claire, énergique, sifflet et « Hop hop hop ! » | `一位年轻的男滑雪教练，声音洪亮清晰，充满活力，语速较快，语气热情鼓舞人心。` | 150 |
| `lynx` | **Flocon** le lynx des neiges, petit(e) timide et rêveur, artiste de la glace | petit curieux, parle tout bas et par chuchotements, dessine partout (dans la neige, sur la vitre givrée), toujours à moitié caché derrière quelque chose | blanc-gris tacheté, touffes de poils pointues au bout des oreilles, grosses pattes de neige, mitaines violettes, petit carnet jaune sous le bras, queue très courte | voix d'enfant de 5 ans, douce, aiguë, murmurée, cherche ses mots | `一个五岁的小孩，声音轻柔细小，像在悄悄说话，语速慢，语气好奇又有点害羞。` | 320 |

Voix : `marmot`, `ibex`, `lynx` (minuscules, sans accent). Réplique de test Ming conseillée : marmot « Oh... bonjour les enfants. Le chalet est tout chaud. Hmm... j'ai oublié ce que je disais. » ; ibex « Hop hop hop ! Tout le monde en piste ! Attention, ça glisse ! » ; lynx « Chut... regardez. J'ai dessiné un gros bonhomme dans la neige. »

## Fils rouges
1. **Flocon** : timide, il dessine en cachette un grand cadeau pour toute la classe ; en ép. 14–15 il le montre (une fresque de givre/neige de tous les amis).
2. **Le bonnet de Roussin** : il a un bonnet à pompon trop grand qui lui tombe sur les yeux ; il glisse, s'envole, se retrouve ailleurs (ép. 2, 5, 9, 13) et coiffe finalement la bonne tête (ép. 15). Rouge-Gorge s'y blottit.
3. **Le thermomètre de Lino** : il note la température à chaque épisode ; ses chiffres descendent, jusqu'à -10 °C, puis il découvre que « un pull, c'est +5 ».
4. **Mamie Marmotte et l'hibernation** : elle s'endort dans un coin différent à chaque épisode, sans que personne ne la voie partir ; les enfants la cherchent à la fin (gag courant, finale douce).

## Épisodes (une heure affichée dans chacun : horloge, montre, réveil ou soleil bas)
1. `s4e01-le-chalet` 7h30 : réveil sous la neige, tout est blanc par la fenêtre ; Mamie Marmotte accueille, Lino note -4 °C ; gag : Roussin ouvre la porte, une avalanche douce de neige entre et le recouvre. SFX : door, poof, tummy.
2. `s4e02-s-habiller` 8h00 : mettre bonnets, bottes, écharpes ; gag : le bonnet trop grand de Roussin lui cache les yeux, il met ses bottes sur le mauvais pied, Piquette ne trouve pas de gants à sa taille (piquants !) ; Mamie Marmotte lui tricote des moufles en trois secondes. SFX : step, click, laugh.
3. `s4e03-le-petit-dejeuner` 8h45 : chocolat chaud et tartines ; gag : le chocolat est si chaud que la vapeur soulève le bonnet de Roussin ; Lino souffle sur le sien trop fort et fait un nuage de lait. SFX : clink, sniff, tummy.
4. `s4e04-premier-bonhomme` 9h30 : bonhomme de neige ; gag : Flocon dessine un nez dans la neige, Roussin y plante sa carotte, mais Lino compte ses boules à l'envers et le bonhomme a la tête en bas ; Rouge-Gorge s'y pose. SFX : poof, crack, chirp.
5. `s4e05-la-luge` 10h15 : Bouquet enseigne la luge ; gag : Roussin part seul sur la luge, descend, remonte… sur la luge tirée par Lino ? le bonnet, lui, descend tout seul en face ; arrivée dans un tas de neige tout doux. SFX : slide, whoosh, boing.
6. `s4e06-la-grande-pente` 11h00 : tous sur la grande luge à six ; gag : Mme Escargot, tout au bout, avance… à la vitesse d'un escargot sur la luge, arrive la dernière mais pile devant le chalet. SFX : whoosh, skid, laugh.
7. `s4e07-la-fondue` 12h30 : repas dans le chalet ; gag : Roussin trempe un pain pour la fondue, le fil de fromage s'étire jusqu'au plafond, tout le monde mange par petites bouchées en lèvres d'un bout à l'autre. SFX : sniff, clink, tummy.
8. `s4e08-la-sieste` 13h30 : Mamie Marmotte propose une sieste ; gag : Lino ne peut pas dormir (l'horloge fait tic-tac), il compte les moutons mais Roussin ronfle trop fort ; à la fin, tout le monde dort sauf la marmotte, qui bâille et se lève. SFX : yawn, step, chime.
9. `s4e09-les-raquettes` 14h15 : balade en raquettes avec Bouquet ; gag : Roussin met ses raquettes à l'envers, tourne en rond sur lui-même ; les traces dessinent un grand cœur vu d'en haut (Rouge-Gorge est fier). SFX : step, poof, chirp.
10. `s4e10-la-patinoire` 15h30 : le lac gelé ; gag : Bouquet si sûr de lui glisse le premier, tourne comme une toupie, finit à genoux au milieu de la glace, et c'est Piquette qui le pousse avec ses patins de fortune ; Flocon patine, léger comme l'air. SFX : slide, skid, whoosh.
11. `s4e11-les-patins` 16h00 : apprendre à patiner ; gag : Roussin et Lino patinent en tenant la même écharpe, tirent chacun leur côté, tournent en ronde ; Mimi et Coin forment un train. SFX : slide, laugh, clink.
12. `s4e12-la-fete` 17h30 : préparer la fête de fin d'année ; gag : on guirlande le sapin du chalet, Roussin s'emmêle dans les fils lumineux et devient lui-même le sapin ; Piquette sert d'étoile (sur la pointe de son piquant). SFX : click, chime, laugh.
13. `s4e13-le-gateau` 18h30 : le gâteau de la fête (bûche) ; gag : Roussin goûte le glaçage « pour vérifier », sa moustache devient blanche ; Lino mesure le thermomètre sur la bûche (+20 °C : elle fond un peu) ; le bonnet s'envole par la fenêtre. SFX : tummy, clink, poof.
14. `s4e14-la-surprise` 19h30 : Flocon dévoile sa fresque sur la vitre givrée du chalet : tous les amis dessinés ; Plouf, invité surprise, applaudit en faisant « Ouaf ! » ; Mme Chouette essuie une larme (tendre). SFX : chime, laugh, handbell.
15. `s4e15-la-veillee` 20h30 : veillée devant la cheminée, Mamie Marmotte raconte, étoiles par la fenêtre ; Rouge-Gorge dort dans le bonnet de Roussin, bien coiffé ; tout le monde s'endort, Mamie Marmotte se réveille, bâille, éteint ; carton « Fin de la saison 4 ». SFX : yawn, chime, bell.

## Règles techniques
- Un dossier par épisode : `examples/renard-lapin/s4/<id>/make.mjs` qui écrit `<nom>.svg` et `timeline.json` (même format que la saison 2).
- Imports : `../../lib/kit.mjs`, `../../lib/props.mjs`, `../../lib/classroom.mjs`, `../../lib/courtyard.mjs`, `../../lib/cast4.mjs` (marmot, ibex, lynx), `../../lib/snow.mjs` (décors : chalet, neige, sapins, luge, lac gelé, flocons animés). Les personnages des saisons 2 et 3 restent importés via `cast2.mjs` (et `cast3.mjs` s'il existe).
- Carton final : titre « Roussin &amp; Lino — Saison 4 », annonce de l'épisode suivant (ép. 15 : « Fin de la saison 4 »).
- ≤ 12 répliques, ≤ 6 mots chacune, une bulle à la fois ; `who` ∈ fox, rab, owl, mimi, coin, snail, hedge, badger, frog, marmot, ibex, lynx.
- **Pas d'onomatopées dans les répliques parlées** (la voix les lit mal) : jamais « Hihi », « Aïe », « Brr », « Ouaf », « Atchoum », « Hop », « Chut », « Miam », « Pouet »… Un rire ou une émotion s'exprime avec de vrais mots (« C'est rigolo ! », « Oh non ! », « Il fait froid ! »). Les onomatopées restent permises seulement comme texte dessiné à l'écran (POP, SPLASH…), jamais dans `lines`.
- « TA-DA » à éviter (écrire « Tadaa »).
- Musique : bpm dans `timeline.json` (80–140 ; plus lent, 80–96, pour 8, 14 et 15 ; 120–140 pour les épisodes de glisse).
- Les SFX listés sont des suggestions, tirées de `lib/audio.py` : alarm, boing, skid, splash, bell, chalk, tummy, knock, chirp, chime, whoosh, click, step, slide, poof, clink, brush, laugh, crack, sniff, door, yawn, handbell.
