# Roussin & Lino · Saison 3 « Les vacances à la mer »

Suite de la saison 2 (la ferme). Les vacances commencent : Roussin, Lino et Piquette partent **une journée à la mer** : du départ en train de la côte (7h30) jusqu'au coucher de soleil (20h30), en passant par la plage, le port et un petit bateau. 15 épisodes de 30 s, 1280×720, mêmes règles de dessin et de ton que les saisons 1 et 2 (public 3–7 ans, tendre et burlesque, aucun méchant).

## Personnages

Anciens (inchangés, mêmes voix) : `fox` Roussin, `rab` Lino, `hedge` Piquette (désormais courageuse, mais déteste les ballons de plage : ils lui rappellent ses piquants), `coin` le caneton (en bouée). En clins d'œil : `badger` Papi Bernard (cartes postales, ép. 1 et 15), `frog` Plouf (apparaît dans une flaque de marée, ép. 7), `owl` Mme Chouette (cartes postales), Rouge-Gorge (mouette-copine en visite, bruitage seulement).

Nouveaux (dessinés dans `lib/cast3.mjs`, voix Ming à ajouter dans `lib/ming_design.py` CHARS et TARGET) :

| id voix | Personnage | Caractère | Signes visuels | Voix (français) | Style Ming (chinois) | Hz cible |
|---|---|---|---|---|---|---|
| `crab` | **Bidule** le petit crabe | farceur têtu, veut toujours aller tout droit mais ne sait marcher que de côté ; pince les doigts de pied « pour dire bonjour » (sans faire mal) | rouge-orangé, deux grosses pinces inégales (la gauche plus petite), yeux sur tiges avec reflets, petite coquille de bigorneau comme casquette, joues roses | petit garçon espiègle, voix nasillarde, claquante et rapide, qui rit tout le temps | 一个五岁左右的小男孩，声音鼻音重，尖尖脆脆，语速很快，调皮爱笑，语气得意。 | 260 |
| `pelican` | **Capitaine Gaston** le pélican | vieux marin gentil et rêveur, raconte des histoires de mer exagérées, range tout dans son bec | gris-blanc, immense bec jaune avec poche rosée, casquette de capitaine bleu marine à ancre dorée, pipe en bois éteinte (jamais allumée), petit pull rayé | grand-père marin, voix grave, enrouée, chaleureuse, lente avec des éclats de rire | 一位七十岁左右的老船长，声音低沉沙哑，浑厚温暖，语速缓慢，爱讲故事，语气慈祥爽朗。 | 140 |
| `otter` | **Marinette** la loutre | sportive, joyeuse, un peu casse-cou, adore les vagues et les défis mais toujours prudente avec les plus petits ; sauveteuse volontaire | brun-roux, moustaches claires, ventre crème, maillot rayé jaune, bouée de sauvetage rouge à l'épaule, sifflet autour du cou | grande sœur enthousiaste, voix claire et énergique, bien articulée, rieuse | 一个十二岁左右的大姐姐，声音清亮有力，活泼开朗，语速轻快，充满自信，语气热情。 | 340 |

Textes de test Ming (une phrase d'environ 4 à 10 s, en français) :
- `crab` : « Hihi, je suis Bidule ! Je veux aller tout droit, mais mes pattes disent non ! »
- `pelican` : « Hohoho, mes petits ! Un jour, j'ai attrapé un poisson plus grand que mon bateau. »
- `otter` : « Allez, on y va ! Les vagues, c'est la fête, mais on reste ensemble, d'accord ? »

## Fils rouges
1. **Piquette vient aussi** : fin de la saison 2, Papi Bernard lui avait glissé une carte postale de la mer. Elle n'a jamais vu l'océan et craint que ses piquants éclatent les bouées et les ballons ; elle découvre qu'elle peut tout de même jouer, et finit par sauver la fête (ép. 11–15).
2. **Le seau de Lino** : Lino emporte un seau, une pelle et son horaire (clin d'œil de la saison 2) ; la marée n'a que faire de ses heures. Le seau voyage : château, panier de pêche, chapeau, bateau minuscule, lanterne.
3. **Bidule et les pieds de Roussin** : le crabe veut « dire bonjour » en pinçant les orteils de Roussin dès l'ép. 4 ; à l'ép. 12 il devient son meilleur ami en lui tenant la main (pince) dans la grotte.
4. **Le croissant de mer** : Roussin cherche un croissant à la boulangerie du port ; il n'y a que des biscuits en forme de coquillage... et un coquillage en forme de croissant (ép. 14).
5. **La bouteille** : une bouteille à la mer ramassée à l'ép. 3 contient un dessin ; elle est la clé du dernier épisode (la réponse de Mme Chouette).

## Épisodes (une heure affichée dans chacun : horloge, montre, soleil ou ombre)
1. `s3e01-le-train-de-la-mer` 7h30 — gare, Lino vérifie la liste, valise de Piquette débordante de piquants ; carte postale de Papi Bernard. Gag : la valise rebondit toute seule dans le filet. sfx : step, whoosh, bell, chime.
2. `s3e02-premier-regard` 9h00 — arrivée, odeur de sel, la mer apparaît ; Piquette n'ose pas ouvrir les yeux. Gag : Roussin tient « la mer » pour un grand ciel couché. sfx : wave, chirp, step.
3. `s3e03-la-plage` 9h30 — installation des serviettes, parasol qui s'envole puis revient ; Lino trouve une bouteille. Gag : parasol qui tourne comme hélice avec Coin dedans. sfx : whoosh, poof, wave.
4. `s3e04-bidule` 10h00 — rencontre avec le crabe ; Roussin fait la sieste, Bidule lui pince le gros orteil. Gag : Roussin saute et reste tout droit dans les airs, crabe suspendu. sfx : click, boing, laugh.
5. `s3e05-le-chateau` 10h45 — grand château de sable avec le seau de Lino, tours, drapeau ; la vague arrive. Gag : la vague ne détruit que le château de Roussin (pas celui de Lino, bâti plus haut). sfx : wave, splash, laugh.
6. `s3e06-marinette` 11h30 — la sauveteuse enseigne à nager, bouée jaune/rouge ; Piquette observe de loin. Gag : Marinette siffle et Coin pagaie à l'envers. sfx : click, splash, step.
7. `s3e07-les-flaques` 12h15 — marée basse, étoiles de mer, anémone ; Plouf (clin d'œil) saute d'une flaque. Gag : Roussin écoute un coquillage, entend « Ouaf ! » : c'est Plouf. sfx : splash, boing, chirp.
8. `s3e08-le-pique-nique-sable` 13h00 — sandwich, croissant imaginaire ; un goéland-copain (bruitage) emporte une chaussette. Gag : tout contient du sable, même le bonbon de Lino. sfx : crack, sniff, chirp.
9. `s3e09-le-port` 14h00 — le petit port, bateaux colorés, filets ; Capitaine Gaston, bec rempli d'objets. Gag : il sort de son bec une casquette, une tasse, un hareng... et la montre de Lino. sfx : bell, poof, clink.
10. `s3e10-l-histoire-du-poisson` 14h45 — Gaston raconte la pêche du poisson géant, chaque phrase l'agrandit de plus en plus. Gag : ombre en forme de baleine qui n'est que Coin avec une nageoire. sfx : whoosh, laugh, wave.
11. `s3e11-le-ballon` 15h30 — jeu de ballon sur la plage ; Piquette recule, pique le ballon ; un autre ballon fait tout pour la rejoindre. Gag : le ballon éclate en confettis de sable ; Marinette en sort un autre : c'est un ballon-hérisson. sfx : crack, poof, boing.
12. `s3e12-la-grotte` 16h15 — découverte d'une grotte, écho, Bidule claque pour avoir de l'écho ; peur, lueur. Gag : l'écho répond « Hihi » et c'est Lino qui rit tout seul ; la bouteille réapparait avec un dessin. sfx : tummy, knock, chime.
13. `s3e13-en-bateau` 17h00 — Gaston emmène la bande ; vagues douces ; la lanterne casse. Gag : le seau devient écope, Lino l'utilise puis fait un nœud avec sa montre. sfx : wave, splash, bell.
14. `s3e14-la-pluie-de-poissons` 18h15 — Gaston dit « Ce soir, il pleut des poissons » : la pluie est des gouttes minuscules, et Piquette sauve le panier de Gaston avec son dos hérissé. Gag : le seul poisson tombé est une sardine en peluche. sfx : sniff, laugh, wave.
15. `s3e15-coucher-de-soleil` 20h30 — plage vide, feu, soleil qui plonge ; la bouteille contient la réponse de Mme Chouette : « Bonne nuit ». Gag de fin : Bidule traverse l'écran, de côté. « Fin de la saison 3 ». sfx : wave, chime, yawn.

## Règles techniques
- Un dossier par épisode : `examples/renard-lapin/s3/<id>/make.mjs` qui écrit `<nom>.svg` et `timeline.json` (même format que la saison 2).
- Imports : `../../lib/kit.mjs`, `../../lib/props.mjs`, `../../lib/classroom.mjs`, `../../lib/courtyard.mjs`, `../../lib/cast2.mjs`, `../../lib/farm.mjs`, `../../lib/cast3.mjs` (à créer : Bidule, Gaston, Marinette) et `../../lib/sea.mjs` (à créer : plage, port, bateau, grotte, ciel de coucher).
- Carton final : titre « Roussin &amp; Lino — Saison 3 », annonce de l'épisode suivant (ép. 15 : « Fin de la saison 3 »).
- ≤ 12 répliques, ≤ 6 mots chacune, une bulle à la fois ; `who` ∈ fox, rab, owl, mimi, coin, snail, hedge, badger, frog, crab, pelican, otter.
- **Pas d'onomatopées dans les répliques parlées** (la voix les lit mal) : jamais « Hihi », « Aïe », « Brr », « Ouaf », « Atchoum », « Hop », « Chut », « Miam », « Pouet »… Un rire ou une émotion s'exprime avec de vrais mots (« C'est rigolo ! », « Oh non ! », « Il fait froid ! »). Les onomatopées restent permises seulement comme texte dessiné à l'écran (POP, SPLASH…), jamais dans `lines`.
- « TA-DA » à éviter (écrire « Tadaa »).
- Musique : bpm dans `timeline.json` (80–140 selon ambiance ; plage 110–126, grotte 80, coucher de soleil 84).
- Voix : ajouter crab, pelican, otter dans `lib/ming_design.py` (CHARS et TARGET) et générer les références dans `lib/voix-ref/`.
- Sfx : seulement ceux de `lib/audio.py` (alarm, bell, boing, brush, chalk, chime, chirp, class, click, clink, crack, door, handbell, knock, laugh, poof, skid, slide, sniff, splash, step, tummy, wave, whoosh, yawn).
