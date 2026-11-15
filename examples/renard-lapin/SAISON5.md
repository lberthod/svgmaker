# Roussin & Lino · Saison 5 « Le grand spectacle »

Dernière saison de la série. La classe de Mme Chouette prépare **le spectacle de fin d'année dans la salle des fêtes de la ville** : répétitions, costumes, décors, trac, panne, puis le grand soir. 15 épisodes de 30 s, 1280×720, mêmes règles de dessin et de ton que les saisons 1 et 2 (public 3–7 ans, tendre et burlesque, aucun méchant). La pièce jouée s'appelle **« La petite étoile qui avait peur du noir »** (histoire originale écrite par la classe).

## Personnages

Anciens (inchangés, mêmes voix) : `fox` Roussin, `rab` Lino, `owl` Mme Chouette, `mimi`, `coin`, `snail` Mme Escargot, Rouge-Gorge (bruitage seulement) ; de la saison 2 : `hedge` Piquette, `badger` Papi Bernard (il prête sa grange-camionnette et sa paille), `frog` Plouf (il vient en maillot de bain « au cas où »).
Les personnages des saisons 3 et 4 n'apparaissent pas.

Nouveaux (dessinés dans `lib/cast5.mjs`, voix Ming à concevoir : ajouter à `CHARS` et `TARGET` de `lib/ming_design.py`) :

| id voix | Personnage | Caractère | Signes visuels | Hauteur cible |
|---|---|---|---|---|
| `beaver` | **Bastien** le castor, chef des décors | bricoleur fier, parle en mesures (« trois planches et demie »), tape sur tout avec sa queue plate pour « vérifier que ça tient » | brun roux, grandes dents blanches carrées dépassant (une seule paire, lèvre fermée autour), queue plate et large couleur chocolat, casque de chantier jaune, crayon derrière l'oreille, ceinture à outils orange | 150 Hz |
| `giraffe` | **Mlle Zélie** la girafe, costumière | rêveuse et distraite, tête dans les nuages ; pique toujours un tissu sur quelqu'un par erreur ; adore les rubans | jaune doré à taches orange, très long cou, petits cornes à pompons, mètre de couturière rose autour du cou, pelote à épingles violette au poignet, foulard à pois | 260 Hz |
| `mole` | **Taupin** la taupe, souffleur | myope et chuchoteur, il vit dans le trou du souffleur sous le bord de la scène, ne voit jamais le public, répète les répliques deux fois trop fort | gris-bleu velouté, museau rose en pointe, minuscules yeux plissés derrière d'énormes lunettes rondes, grandes pattes avant claires, petit livre de texte à pince sous le bras, bonnet de laine rouge | 190 Hz |

### Voix Ming (même format que `CHARS` dans `lib/ming_design.py`)
- `beaver` : style « 一位四十岁左右的男工头，声音粗哑浑厚，语速稳，语气自豪又爱显摆，说话像在报尺寸。 » Texte de référence : « Trois planches et demie, mes amis ! Moi, je construis des décors solides, solides, solides. »
- `giraffe` : style « 一位温柔的年轻女士，声音轻柔飘忽，语速偏慢，语气梦幻，有点心不在焉。 » Texte de référence : « Oh, un ruban rose... où est-ce que je l'ai mis ? Venez, je vais prendre vos mesures. »
- `mole` : style « 一个老爷爷般的小个子，声音沙哑，压低嗓门说悄悄话，语速急，语气紧张又认真。 » Texte de référence : « Psst ! Chut ! Vous avez oublié la phrase ! Je répète : la petite étoile a peur ! »

## Fils rouges
1. **La petite étoile** : Piquette (timide en saison 2, désormais courageuse mais encore un peu intimidée par la scène) joue le rôle de l'étoile, et sa chanson est le cœur du spectacle ; elle apprend que le trac ne disparaît pas, on joue avec lui (ép. 6–14).
2. **L'heure de Lino** : il a le minutage au quart d'heure près, et tout dérape ; à la finale il range sa montre et regarde les gens, pas l'heure.
3. **Le dernier croissant** : Roussin garde un croissant « pour après le spectacle » ; il le protège, le perd, le retrouve, et le donne à Rouge-Gorge dans le final.
4. **Mme Escargot** : invitée au premier rang, partie depuis l'épisode 1 ; elle arrive à la dernière seconde du spectacle (ép. 15), à l'heure pour la fin.
5. **Taupin** : on n'entend sa voix que sous la scène avant l'ép. 11 ; on ne le voit entier qu'à l'ép. 12.

## Épisodes (une heure affichée dans chacun : horloge de la salle, montre, affiche ou réveil)
1. `s5e01-l-affiche` 8h00 — Mme Chouette annonce le spectacle ; Lino colle l'affiche avec le minutage, Roussin colle son croissant dessus par erreur. Gag : toute la classe applaudit, l'affiche se décolle et vole sur la tête de Coin. Sfx : bell, laugh, whoosh.
2. `s5e02-les-roles` 9h00 — distribution des rôles tirés d'un chapeau : Roussin tire « le soleil », Lino « la lune », Piquette « la petite étoile », Mimi et Coin « les nuages ». Gag : Roussin refuse de lâcher son croissant et joue le soleil en tenant un croissant en guise de rayon. Sfx : chime, laugh, tummy.
3. `s5e03-la-salle` 10h00 — visite de la salle des fêtes de la ville, énorme et vide, l'écho répète tout ; Bastien arrive avec ses plans. Gag : l'écho répond avec un mot de retard et finit par dire autre chose (Roussin : « Bonjour ! » écho : « J'ai faim ! »). Sfx : step, knock, tummy.
4. `s5e04-la-premiere-repet` 11h00 — première répétition, tout le monde parle en même temps, Lino siffle une horloge à la place du sifflet. Gag : les nuages (Mimi, Coin) se cognent et font « pouf » comme de vrais nuages. Sfx : poof, handbell, laugh.
5. `s5e05-les-costumes` 12h00 — Mlle Zélie prend les mesures, dessine, pique. Gag : en prenant la mesure du cou de Roussin, elle lui coud le costume de soleil à son propre foulard ; ils tournent ensemble. Sfx : click, whoosh, laugh.
6. `s5e06-les-decors` 13h30 — Bastien et Papi Bernard construisent un grand arbre en carton-planches ; Plouf peint avec une éclaboussure géante. Gag : Bastien tape l'arbre avec sa queue « pour vérifier » et il se plie en accordéon. Sfx : knock, splash, boing.
7. `s5e07-la-chanson` 14h30 — Piquette répète sa chanson sur l'étoile derrière un rideau ; elle chante trop bas. Gag : Plouf rime en écho, « étoile... voile... toile », et finit par tisser un vrai rideau ; Piquette rit et chante juste. Sfx : chime, chirp, laugh.
8. `s5e08-le-trac` 15h30 — le trac attaque : Lino oublie ses mots, Coin se cache dans son costume de nuage, Roussin n'a plus faim (!). Gag : le ventre de Roussin ne gargouille plus, tout le monde panique et lui fait manger son croissant... qui le fait gargouiller de joie. Sfx : tummy, sniff, laugh.
9. `s5e09-la-repet-generale` 16h30 — répétition générale, tout rate en cascade : projecteur, rideau, fumée de scène. Gag : la fumée de scène est un rideau de nuages qui s'envole et fait Mimi tousser des bulles. Sfx : whoosh, poof, crack.
10. `s5e10-la-generale-finie` 17h30 — le soir tombe, tout le monde est fatigué et découragé ; Lino dit « on ne sera pas prêts ». Gag : Mme Chouette ne dit rien, elle s'assoit et mange un croissant avec Roussin ; Lino finit par rire. Sfx : yawn, sniff, laugh.
11. `s5e11-taupin` 18h30 — la voix mystérieuse sous la scène ; la classe cherche d'où elle vient, découvre le trou du souffleur. Gag : Taupin, myope, prend Bastien pour Mme Chouette et lui récite le texte à l'oreille. Sfx : knock, chirp, door.
12. `s5e12-la-veille` 20h00 — la nuit avant le grand soir : tout le monde dort dans la salle (matelas de Papi Bernard), Taupin révise tout seul. Gag : en cherchant ses lunettes, il tire sur une corde et décroche un projecteur qui illumine la classe endormie en pleine nuit. Sfx : yawn, click, clink.
13. `s5e13-le-grand-soir` 18h30 — le grand soir : public dans la salle, Mme Escargot est partie depuis ce matin, on n'est pas sûr qu'elle arrive. Gag : Roussin, en soleil, se retrouve coincé dans la porte du fond avec ses rayons en carton. Sfx : bell, door, boing.
14. `s5e14-la-panne` 19h30 — panne de courant au milieu de la pièce : tout est noir ; la petite étoile a peur du noir, comme dans la pièce. Gag : Piquette chante dans le noir et ses piquants captent la lumière de Rouge-Gorge qui apporte une luciole ; la salle s'éclaire de lucioles apportées par les spectateurs. Sfx : click, chime, chirp.
15. `s5e15-le-dernier-rideau` 20h30 — finale (voir ci-dessous). Sfx : handbell, laugh, chime, wave.

## Finale (ép. 15) : « Le dernier rideau »
La lumière revient, la pièce se termine ; le public se lève. Mme Escargot entre enfin sur la dernière note, juste à l'heure pour la fin (« Bonsoir... j'ai tout vu... en route. »). Lino range sa montre dans sa poche, pour la première fois, et regarde ses amis au lieu de l'heure. Roussin tend son dernier croissant à Rouge-Gorge. Mme Chouette réunit tous les personnages des saisons 1 et 2 sur scène pour la révérence, chacun dans son costume ; Taupin sort enfin du trou et salue. Dernier plan : un grand plan fixe sur la classe en rang, l'étoile en carton tenue par Piquette, la salle qui s'éteint doucement, et le carton « Roussin &amp; Lino : merci d'avoir été là. Fin de la série. »

## Règles techniques
- Un dossier par épisode : `examples/renard-lapin/s5/<id>/make.mjs` qui écrit `<nom>.svg` et `timeline.json` (même format que les saisons 1 et 2).
- Imports : `../../lib/kit.mjs`, `../../lib/props.mjs`, `../../lib/classroom.mjs`, `../../lib/courtyard.mjs`, `../../lib/cast2.mjs`, `../../lib/cast5.mjs` (Bastien, Zélie, Taupin), `../../lib/theatre.mjs` (salle des fêtes, scène, rideau, projecteurs, trou du souffleur, décors : à créer).
- Carton final : titre « Roussin &amp; Lino — Saison 5 », annonce de l'épisode suivant (ép. 15 : « Fin de la série »).
- ≤ 12 répliques, ≤ 6 mots chacune, une bulle à la fois ; `who` ∈ fox, rab, owl, mimi, coin, snail, hedge, badger, frog, beaver, giraffe, mole.
- **Pas d'onomatopées dans les répliques parlées** (la voix les lit mal) : jamais « Hihi », « Aïe », « Brr », « Ouaf », « Atchoum », « Hop », « Chut », « Miam », « Pouet »… Un rire ou une émotion s'exprime avec de vrais mots (« C'est rigolo ! », « Oh non ! », « Il fait froid ! »). Les onomatopées restent permises seulement comme texte dessiné à l'écran (POP, SPLASH…), jamais dans `lines`.
- « TA-DA » à éviter (écrire « Tadaa »).
- Musique : bpm dans `timeline.json` (80–140 selon l'ambiance ; ép. 10 et 12 lents, ép. 14 piano doux, ép. 15 crescendo).
- Bruitages uniquement parmi ceux de `lib/audio.py` (alarm, boing, skid, splash, bell, chalk, tummy, knock, chirp, chime, whoosh, wave, click, step, slide, poof, clink, brush, laugh, crack, sniff, door, yawn, handbell).
