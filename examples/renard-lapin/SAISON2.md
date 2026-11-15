# Roussin & Lino · Saison 2 « La classe verte »

Suite de la saison 1 (une journée d'école). Cette fois, Mme Chouette emmène la classe **une journée à la ferme** : du départ en car (7h45) jusqu'aux étoiles (20h00). 15 épisodes de 30 s, 1280×720, mêmes règles de dessin et de ton que la saison 1 (public 3–7 ans, tendre et burlesque, aucun méchant).

## Personnages

Anciens (inchangés, mêmes voix) : `fox` Roussin, `rab` Lino, `owl` Mme Chouette, `mimi`, `coin`, `snail` Mme Escargot ; Rouge-Gorge (oiseau, bruitage seulement).

Nouveaux (dessinés dans `lib/cast2.mjs`, voix Ming déjà conçues) :
| id voix | Personnage | Caractère | Signes visuels |
|---|---|---|---|
| `hedge` | **Piquette** la hérissonne, nouvelle élève | timide, a peur que ses piquants fassent peur ; se roule en boule quand elle est effrayée ; au fil de la saison elle devient courageuse | brune, piquants bruns, museau rosé, nœud jaune dans les piquants, petit sac à dos rose |
| `badger` | **Papi Bernard** le blaireau, fermier | bourru et tendre, voix grave, aime les blagues | rayé noir/blanc sur la tête, salopette bleue, chapeau de paille, brin de paille à la bouche |
| `frog` | **Plouf** la grenouille de la mare | rigolo, rime et éclabousse, saute partout | verte, grands yeux sur le dessus, ventre clair, coasse « Ouaf ! » pour rire |

## Fils rouges
1. **Piquette** : timide → se fait accepter → sauve la soirée (ép. 10–15).
2. **Le croissant** : Roussin a emporté UN croissant pour la route ; Rouge-Gorge ami le suit (clin d'œil).
3. **L'heure de Lino** : il a un horaire de la journée dans sa poche ; la nature n'en a que faire.

## Épisodes (une heure affichée dans chacun : horloge, montre ou soleil)
1. `s2e01-le-grand-depart` 7h45 — cour de l'école, Lino vérifie la liste, Roussin a caché un croissant, le car arrive.
2. `s2e02-dans-le-car` 8h15 — Papi Bernard conduit un vieux car-tracteur ; Piquette seule sur sa banquette, un ballon éclate ; Lino lui fait de la place.
3. `s2e03-la-ferme` 9h00 — arrivée, Papi Bernard présente la ferme, les animaux (poules, vache, cochon) ; Piquette cachée derrière Lino.
4. `s2e04-les-poules` 9h40 — ramasser les œufs ; Roussin fait tomber un œuf, le poussin sort ; gag du poussin qui suit Roussin.
5. `s2e05-la-vache` 10h20 — la traite ; la vache lèche Roussin ; Piquette rit pour la première fois.
6. `s2e06-le-potager` 11h00 — cueillir des carottes ; Lino les compte ; Piquette utilise ses piquants pour ramasser des pommes tombées (utile !).
7. `s2e07-le-pique-nique` 12h00 — pique-nique, nappe à carreaux ; Rouge-Gorge arrive ; Roussin partage son croissant.
8. `s2e08-la-mare` 13h00 — rencontre avec Plouf, concours de sauts, éclaboussures.
9. `s2e09-le-pont` 13h45 — traversée d'une planche au-dessus de la mare ; Lino regarde l'heure et manque de tomber ; Mme Escargot passe très lentement.
10. `s2e10-l-orage` 14h30 — ciel noir, tonnerre, tout le monde court vers la grange ; Piquette se roule en boule et roule jusqu'à la grange.
11. `s2e11-dans-la-grange` 15h15 — il fait sombre, ombres chinoises, peur, Piquette allume la lampe grâce à ses piquants accrochés à une guirlande ? (idée libre, finale rassurante).
12. `s2e12-la-tarte` 16h00 — Papi Bernard et les enfants font une tarte aux pommes ; Roussin goûte la pâte ; four.
13. `s2e13-la-course` 17h00 — course d'œufs sur cuillère par équipes ; Piquette et Lino gagnent.
14. `s2e14-le-feu-de-camp` 18h30 — chansons autour du feu, guimauves ; Piquette chante (sa voix émerveille).
15. `s2e15-les-etoiles` 20h00 — couchage dans la paille, Papi Bernard raconte, étoiles filantes ; « Fin de la saison 2 ».

## Règles techniques
- Un dossier par épisode : `examples/renard-lapin/s2/<id>/make.mjs` qui écrit `<nom>.svg` et `timeline.json` (même format que la saison 1).
- Imports : `../../lib/kit.mjs`, `../../lib/props.mjs`, `../../lib/classroom.mjs`, `../../lib/courtyard.mjs`, `../../lib/cast2.mjs`, `../../lib/farm.mjs`.
- Carton final : titre « Roussin &amp; Lino — Saison 2 », annonce de l'épisode suivant (ép. 15 : « Fin de la saison 2 »).
- ≤ 12 répliques, ≤ 6 mots chacune, une bulle à la fois ; `who` ∈ fox, rab, owl, mimi, coin, snail, hedge, badger, frog.
- **Pas d'onomatopées dans les répliques parlées** (la voix les lit mal) : jamais « Hihi », « Aïe », « Brr », « Ouaf », « Atchoum », « Hop », « Chut », « Miam », « Pouet »… Un rire ou une émotion s'exprime avec de vrais mots (« C'est rigolo ! », « Oh non ! », « Il fait froid ! »). Les onomatopées restent permises seulement comme texte dessiné à l'écran (POP, SPLASH…), jamais dans `lines`.
- « TA-DA » à éviter (écrire « Tadaa »).
- Musique : bpm dans `timeline.json` (80–140 selon ambiance).
