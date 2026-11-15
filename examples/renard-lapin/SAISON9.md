# Roussin & Lino · Saison 9 « Le grand concours »

Les Olympiades de l'école, de 8h00 à 19h30 : course, saut, lancer, équilibre, cuisine, inventions, dessin, médailles. 15 épisodes de 30 s, 1280x720, 3-7 ans, tendre et burlesque. **Aucun méchant, aucun tricheur** : on participe, on s'entraide. Règles : `REGLES_SAISONS_6-10.md` (gag annoncé avant 5 s, montré 2 fois ; badge d'heure unique haut-gauche ; ≤ 12 répliques de ≤ 5 mots ; aucune interjection ; objet cité = visible ; ≤ 4 persos par plan serré).

## Fils rouges
1. **La boîte aux médailles** : Mme Chouette porte une boîte fermée ; tous croient qu'elle contient « une seule médaille d'or ». Ép. 15 : il y en a une par enfant (« Toutes en or. »).
2. **Le dossard 7** : celui de Roussin passe de main en main (Lino, Zéphyr, Pablo, Piquette...) et revient sur le dos de Roussin à l'ép. 15.
3. **Le chrono de Lino** : il mesure tout ; il perd, puis range son chrono pour applaudir (ép. 13 et 15).
4. **Le croissant de Roussin** : ingrédient du gâteau (ép. 9), repris par Pépin (ép. 14).
5. **Mme Escargot** : partie de la ligne de départ à l'ép. 3, franchit la ligne d'arrivée à l'ép. 15 sous les cris.

## Nouveaux personnages (dessins dans `lib/cast9.mjs`, voix Ming à ajouter à `CHARS` et `TARGET` de `lib/ming_design.py`)
| id voix | Personnage | Caractère | Silhouette et couleurs | Hz | Phrase-type | Geste | Scène-signature |
|---|---|---|---|---|---|---|---|
| `cheetah` | **Zéphyr** le guépard | sprinteur pressé, gentil, jamais fini de parler | fin, long, sable à taches noires, traits de larmes noirs, baskets rouges, bandeau jaune | 280 | « J'arrive avant de partir ! » | refait ses lacets deux fois, puis file | ép. 3 : il gagne la course mais se trompe de sens et rejoint le départ ; gags aussi ép. 1, 4, 12 |
| `penguin` | **Pablo** le manchot, arbitre bénévole | sérieux et maladroit, adore le règlement | noir et blanc dodu, bec orange, casquette d'arbitre bleue, sifflet doré au cou, petit carnet | 220 | « Chacun son tour, s'il vous plaît. » | se dandine, puis glisse sur le ventre | ép. 6 : il arbitre la poutre et glisse sous elle ; gags aussi ép. 2, 5, 13 |
| `hamster` | **Pépin** la hamster pâtissière | généreuse, compte en gonflant les joues, minuscule mais très sûre d'elle | roux crème, grosses joues rondes, toque blanche trop grande, tablier à carreaux rose, cuillère en bois | 330 | « Une pincée, deux pincées ! » | gonfle les joues pour compter, les dégonfle en distribuant | ép. 9 : joues pleines de noisettes pour le gâteau, elle les partage ; gags aussi ép. 7, 8, 14 |
Voix Ming : `cheetah` jeune garçon essoufflé, rapide, enthousiaste ; `penguin` petit monsieur grave et solennel, débit posé ; `hamster` fillette aiguë, volubile, rieuse (réf. : « Une pincée, deux pincées, voilà le gâteau ! »).
Besoin sound design (absent de `lib/audio.py`) : sifflet d'arbitre, fanfare de remise, foule qui applaudit, ding de four.

## Anciens (même voix) : retours exacts par épisode (en plus de fox, rab ; ép. 15 : tous)
Chaque ancien revient au moins 1 épisode sur 3 (vérifié).

## Épisodes (heure affichée dans la pilule haut-gauche)
1. `s9e01-les-dossards` **8h00** — Cour de l'école, tribunes en carton. Présents : owl, mimi, coin, snail, hedge, beaver, otter, pelican, cheetah.
   Mme Chouette distribue les dossards ; Roussin veut le 1, il reçoit le 7. Lino mesure le chrono. Gag : Zéphyr passe si vite que tous les dossards s'envolent sur les mauvais dos (Lino porte celui de Mme Escargot, lent). Chute : Roussin garde le 7, content.
   Répliques : « Je veux le numéro un ! » · « Voici le sept. » · « J'arrive avant de partir ! » Sfx : bell, whoosh, laugh. Décor : cour + banderole OLYMPIADES. Carton : « Suivant : on s'échauffe ! »
2. `s9e02-l-echauffement` **8h45** — Pelouse. Présents : owl, hedge, badger, frog, marmot, penguin, lynx, giraffe, crab.
   Mamie Marmotte mène les étirements ; Pablo siffle chaque mouvement. Gag : Roussin s'étire si loin que Plouf, accroché à son pied, décolle ; chute : Plouf retombe dans le seau d'eau de Pablo.
   Répliques : « Levez les bras bien haut. » · « Chacun son tour, s'il vous plaît. » Sfx : whoosh, splash, boing. Décor : pelouse, tapis bleus. Carton : « Suivant : la course ! »
3. `s9e03-la-course` **9h30** — Piste de 3 plots. Présents : mimi, coin, snail, cheetah, penguin, ibex, pelican, beaver, mole.
   Départ ! Zéphyr file, Mme Escargot part tout doucement. Gag : Zéphyr franchit l'arrivée, se trompe de sens, revient au départ et croise Escargot ; il marche à son rythme jusqu'au bout avec elle. Chute : ils lèvent ensemble le ruban, Lino arrête le chrono.
   Répliques : « À vos marques ! » · « Je vais à ton pas. » · « Merci, Zéphyr. » Sfx : step, skid, whoosh. Décor : piste, ruban rouge. Carton : « Suivant : on saute ! »
4. `s9e04-le-saut` **10h15** — Fosse de sable. Présents : owl, badger, frog, otter, lynx, cheetah, marmot, hedge.
   Plouf saute le plus loin, Zéphyr ne sait pas sauter : il court, freine, s'enterre. Gag : Plouf, Lino et Roussin ratent un tas de sable en même temps ; chute : un seul pas de géant de Piquette roulée en boule.
   Répliques : « Prends ton élan. » · « Je saute avec toi ! » Sfx : boing, poof, laugh. Décor : fosse, règle géante. Carton : « Suivant : on lance ! »
5. `s9e05-le-lancer` **11h00** — Terrain d'herbe. Présents : mimi, coin, snail, beaver, giraffe, penguin, crab, ibex, frog.
   Lancer de balles en chaussettes ; Zélie lance un ruban qui s'enroule. Gag : la balle de Roussin retombe sur la casquette de Pablo, qui mesure quand même la distance. Chute : Bastien : « Trois planches et demie. »
   Répliques : « Lance vers la cible. » · « Elle a atterri ici. » Sfx : whoosh, clink, knock. Décor : cible ronde, mètre au sol. Carton : « Suivant : l'équilibre ! »
6. `s9e06-la-poutre` **11h45** — Gymnase. Présents : owl, hedge, badger, otter, pelican, penguin, mole.
   Piquette traverse la poutre en haut, très serrée de trac ; Taupin guide sans voir. Gag : Pablo glisse sous la poutre au même rythme qu'elle ; ils arrivent ensemble. Chute : les deux saluent.
   Répliques : « Un pas, puis un autre. » · « Je suis juste derrière. » Sfx : step, slide, chime. Décor : poutre, tapis. Carton : « Suivant : le pique-nique ! »
7. `s9e07-le-pique-nique` **12h30** — Prairie. Présents : mimi, coin, snail, badger, marmot, hamster, lynx, giraffe.
   Chacun partage son déjeuner ; Pépin arrive, joues rondes. Gag : elle compte quatre noisettes en gonflant ses joues, puis les rend une à une à ceux qui n'ont rien. Chute : elle a juste pour elle une noisette, qu'elle offre à Coin.
   Répliques : « Une pincée, deux pincées ! » · « Il y en a pour tous. » Sfx : tummy, chirp, laugh. Décor : nappe à carreaux. Carton : « Suivant : on fait un gâteau ! »
8. `s9e08-la-cuisine` **13h30** — Cuisine de l'école. Présents : owl, frog, otter, ibex, crab, mole, hamster, beaver.
   Concours de gâteaux : chaque équipe choisit ses ingrédients. Gag : Taupin pèse la farine à tâtons et prend le sel pour du sucre ; Pépin goûte, ses joues rougissent, elle ajoute un bon coup de miel. Chute : Bastien répare le four avec la queue.
   Répliques : « Deux œufs, pas trois. » · « Le sel ? Pas le sucre ! » Sfx : knock, clink, tummy. Décor : plans de travail, four. Carton : « Suivant : les gâteaux ! »
9. `s9e09-les-gateaux` **14h30** — Salle de dégustation. Présents : mimi, coin, snail, badger, hedge, marmot, pelican, hamster.
   Le jury goûte ; Roussin a gardé un morceau de croissant, il le glisse dans le gâteau du duo. Gag : le gâteau gonfle comme un nuage et touche le plafond ; chute : Pépin donne une part à chaque voisin, le plateau est vide.
   Répliques : « On partage la part. » · « Il est tout léger ! » Sfx : poof, handbell, tummy. Décor : table de jury, nappes. Carton : « Suivant : les inventions ! »
10. `s9e10-l-atelier` **15h00** — Atelier de Bastien. Présents : owl, otter, ibex, lynx, beaver, giraffe, mole, crab, cheetah.
    Chacun invente une machine rigolote. Gag : la machine de Zélie coud, celle de Taupin cherche ses lunettes, celle de Zéphyr tourne si vite qu'elle part au plafond. Chute : Lino les relie toutes avec une ficelle.
    Répliques : « Ça tient avec une ficelle. » · « Il faut des mesures. » Sfx : click, whoosh, knock. Décor : atelier, établi. Carton : « Suivant : la machine géante ! »
11. `s9e11-la-machine` **15h45** — Cour. Présents : mimi, coin, snail, hedge, frog, marmot, beaver, mole, hamster.
    La machine commune : tartine, souffle, arrose, tourne en un seul geste. Gag : Roussin appuie sur le bouton, Mimi reçoit la tartine, Coin le jet d'eau, Plouf est ravi. Chute : la machine finit par ranger tous les ballons dans la caisse.
    Répliques : « On appuie ensemble. » · « Elle marche pour tous ! » Sfx : click, splash, whoosh, boing. Décor : cour, tuyaux. Carton : « Suivant : on dessine ! »
12. `s9e12-le-dessin` **16h30** — Salle d'art. Présents : owl, badger, otter, lynx, giraffe, cheetah, pelican.
    Thème : « mon ami ». Zéphyr dessine si vite que ses amis sont des traits. Gag : Zélie lui coud un cadre ; chute : le trait flou devient un portrait de tous, avec le 7 sur le dos de Roussin.
    Répliques : « Voici mon ami. » · « Je dessine plus doucement. » Sfx : brush, chalk, chime. Décor : chevalets, pots de peinture. Carton : « Suivant : l'exposition ! »
13. `s9e13-l-exposition` **17h30** — Couloir d'exposition. Présents : mimi, coin, snail, owl, ibex, crab, mole, penguin, cheetah.
    Les dessins sont accrochés ; Lino compte les visiteurs au chrono. Gag : Pablo suspend les tableaux de travers pour « rester équitable » ; chute : tous les tableaux penchent, les enfants penchent la tête pareil.
    Répliques : « Chacun a sa place. » · « Je range mon chrono. » Sfx : knock, clink, chime. Décor : couloir, cadres. Carton : « Suivant : on se prépare ! »
14. `s9e14-la-preparation` **18h30** — Cour au soir. Présents : hedge, badger, frog, marmot, otter, pelican, beaver, giraffe, penguin, hamster.
    Bastien monte le podium ; Zélie coud des rubans ; Pablo répète le sifflet. Gag : le podium a assez de marches pour tous, pas pour une seule personne ; chute : Pépin y pose une assiette de croissants.
    Répliques : « Une marche pour chacun. » · « Il y a place. » Sfx : knock, click, bell. Décor : cour éclairée, guirlandes. Carton : « Suivant : les médailles ! »
15. `s9e15-les-medailles` **19h30** — Cour, podium plein. Présents : tous (anciens, Zéphyr, Pablo, Pépin).
    Mme Chouette ouvre la boîte : une médaille par enfant. Mme Escargot franchit enfin la ligne et reçoit la sienne en dernier, sous les applaudissements. Gag : la boîte est trop petite pour tant de médailles et déborde sur Roussin. Chute finale : Lino pose le chrono, Roussin accroche le 7 sur son cœur.
    Dernier mot au duo : LINO « On a tous gagné. » ROUSSIN « On était ensemble. »
    Sfx : handbell, chime, laugh, wave. Décor : podium, guirlandes. Carton : « Roussin & Lino · Saison 9 · Fin. À bientôt ! »

## Notes techniques
- Dossiers : `s9/<id>/make.mjs` ; imports `lib/kit.mjs`, `lib/props.mjs`, `lib/courtyard.mjs`, `lib/cast2-5.mjs`, `lib/cast9.mjs`, `lib/stade.mjs` (piste, tribunes, poutre, podium, cuisine : à créer).
- `who` ∈ fox, rab, owl, mimi, coin, snail, hedge, badger, frog, crab, pelican, otter, marmot, ibex, lynx, beaver, giraffe, mole, cheetah, penguin, hamster.
- Sfx : uniquement alarm, boing, skid, splash, bell, chalk, tummy, knock, chirp, chime, whoosh, wave, click, step, slide, poof, clink, brush, laugh, crack, sniff, door, yawn, handbell.


## Retours par épisode
x = présent dans la scène (ligne « Présents »). Contrôle : aucun ancien absent plus de 2 épisodes d'affilée ; tous réunis (plan large) à l'ép. 15 ; plans serrés ≤ 4 personnages, les listes « Présents » décrivent la scène, pas le cadre.

| Personnage | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| fox Roussin | x | x | x | x | x | x | x | x | x | x | x | x | x | x | x |
| rab Lino | x | x | x | x | x | x | x | x | x | x | x | x | x | x | x |
| owl Mme Chouette | x | x |  | x |  | x |  | x |  | x |  | x | x |  | x |
| mimi | x |  | x |  | x |  | x |  | x |  | x |  | x |  | x |
| coin | x |  | x |  | x |  | x |  | x |  | x |  | x |  | x |
| snail Mme Escargot | x |  | x |  | x |  | x |  | x |  | x |  | x |  | x |
| hedge Piquette | x | x |  | x |  | x |  |  | x |  | x |  |  | x | x |
| badger Papi Bernard |  | x |  | x |  | x | x |  | x |  |  | x |  | x | x |
| frog Plouf |  | x |  | x | x |  |  | x |  |  | x |  |  | x | x |
| crab Bidule |  | x |  |  | x |  |  | x |  | x |  |  | x |  | x |
| pelican Capitaine Gaston | x |  | x |  |  | x |  |  | x |  |  | x |  | x | x |
| otter Marinette | x |  |  | x |  | x |  | x |  | x |  | x |  | x | x |
| marmot Mamie Marmotte |  | x |  | x |  |  | x |  | x |  | x |  |  | x | x |
| ibex Bouquet |  |  | x |  | x |  |  | x |  | x |  |  | x |  | x |
| lynx Flocon |  | x |  | x |  |  | x |  |  | x |  | x |  |  | x |
| beaver Bastien | x |  | x |  | x |  |  | x |  | x | x |  |  | x | x |
| giraffe Mlle Zélie |  | x |  |  | x |  | x |  |  | x |  | x |  | x | x |
| mole Taupin |  |  | x |  |  | x |  | x |  | x | x |  | x |  | x |
| cheetah Zéphyr | x |  | x | x |  |  |  |  |  | x |  | x | x |  | x |
| penguin Pablo |  | x | x |  | x | x |  |  |  |  |  |  | x | x | x |
| hamster Pépin |  |  |  |  |  |  | x | x | x |  | x |  |  | x | x |

Contrôle d'absence maximale (épisodes d'affilée) : owl 1, mimi 1, coin 1, snail 1, hedge 2, badger 2, frog 2, crab 2, pelican 2, otter 2, marmot 2, ibex 2, lynx 2, beaver 2, giraffe 2, mole 2. Écarts constatés : aucun (aucune correction de contenu nécessaire).
