# Roussin & Lino · Saison 10 « Les grandes vacances »

Finale de la série. Le dernier jour d'école devient le premier jour des vacances : **8h → 21h**, de la classe à la grande fête du soir, via valise, gare, train, camping, tente, baignade, pêche, glaces, jeux de plage et lettre aux amis. 15 épisodes de 30 s, 1280×720, 3–7 ans, tendre et burlesque, aucun méchant. Règles : `REGLES_SAISONS_6-10.md` (badge d'heure pilule haut-gauche, bulles opaques ≥ 36 px, une à la fois, ≤ 12 répliques de ≤ 5 mots, aucune interjection, objet cité visible, ≤ 4 personnages par plan serré).

## Personnages
Anciens (mêmes voix) : `fox` Roussin, `rab` Lino, `owl` Mme Chouette, `mimi`, `coin`, `snail` Mme Escargot, `hedge` Piquette, `badger` Papi Bernard, `frog` Plouf, `crab` Bidule, `pelican` Capitaine Gaston, `otter` Marinette, `marmot` Mamie Marmotte, `ibex` Bouquet, `lynx` Flocon, `beaver` Bastien le castor, `giraffe` Mlle Zélie, `mole` Taupin, Rouge-Gorge (bruitage seulement).
Nouveaux (dessinés dans `lib/cast10.mjs` ; ajouter à `CHARS` et `TARGET` de `lib/ming_design.py`) :

| id voix | Personnage | Caractère | Silhouette et couleurs | Hz | Phrase-type | Geste récurrent |
|---|---|---|---|---|---|---|
| `turtle` | **Pétronille** la tortue, gardienne du camping | calme, accueillante, jamais pressée ; tout arrive « à son heure » ; ne perd jamais une clé | carapace ronde vert mousse à losanges brun clair, peau vert tendre, petits yeux doux, chapeau de paille à ruban jaune, trousseau de clés à la ceinture, panneau « CAMPING » sous le bras | 210 | « Doucement, doucement, tout arrive. » | Elle rentre la tête dans sa carapace pour réfléchir, ressort avec la solution |
| `seal` | **Marius** le phoque, marchand de glaces | jovial, jongleur, joue des applaudissements avec ses nageoires ; ne laisse jamais un enfant sans glace | gris-argent tacheté, ventre crème, moustaches blanches, calot rayé rouge et blanc, tablier bleu, charrette-glacière jaune à parasol | 130 | « Une boule, deux boules, trois ! » | Fait tenir une boule de glace sur son nez, puis la rattrape |

- **Pétronille, scène-signature** (ép. 5) : l'unique barrière du camping se lève en dix secondes d'attente tendue ; elle compte les tentes un par un et les range en cercle. Gags propres : ép. 5, 6, 12, 14.
- **Marius, scène-signature** (ép. 9) : jonglage de cinq boules de glace sur le nez, la pyramide vacille sans tomber. Gags propres : ép. 9, 10, 14, 15.
- Voix Ming : `turtle` « 一位温和的中年女士，声音沉稳缓慢，语速很慢，语气从容亲切。 » ; `seal` « 一位开朗的大叔，声音低沉浑厚，爱笑，语速中等，语气热情豪爽。 ».

## Fils rouges
1. **La lettre** : Mme Chouette offre à Lino un carnet d'adresses (ép. 1) ; il écrit « Venez nous voir ! » (ép. 11) ; Rouge-Gorge la porte ; tous arrivent (ép. 13) ; Lino écrit la dernière page (ép. 15).
2. **Le croissant du soir** : Roussin garde un croissant pour la fête, le protège, le perd, le retrouve, le partage (ép. 15).
3. **Mme Escargot** : partie de l'école à 8h pour la fête, on la voit minuscule au bord de la route (vignettes ép. 3, 6, 8, 10, 12), elle arrive à 20h55 (ép. 14), à l'heure.
4. **Pétronille et son « tout arrive »** : sa lenteur douce répond à la hâte de Lino, qui range sa montre (ép. 14).
5. **Vignettes de rappel** (v) : un personnage absent apparaît dans un coin cadre-carte-postale, 1 s, pour qu'aucun principal ne reste plus de 2 épisodes absent ; les vignettes d'un même épisode sont groupées en frises de 4 mini-portraits maximum (2 s par frise), jamais dans un plan serré.

## Épisodes (pilule d'heure en haut à gauche)
1. `s10e01-dernier-jour` 8h00 — dernière classe de l'année ; Mme Chouette donne un carnet d'adresses à Lino. Gag : la cloche sonne, tous filent ; Roussin reste coincé dans la porte avec un cartable plus gros que lui. « Les vacances ! » (Roussin) · « Mon beau carnet. » Présents : fox, rab, owl, mimi, coin (plan serré : 4 max) ; snail sort au loin ; v : lynx, otter, giraffe, ibex. Classe. Sfx : bell, door, laugh. Carton : « 9h00 · La valise ».
2. `s10e02-la-valise` 9h00 — Roussin veut tout emporter : la valise ne ferme pas. Gag : Piquette s'assoit dessus, elle ferme, puis un croissant jaillit et vole dans la main de Roussin (début du fil 2). « Elle ne ferme pas. » · « Assieds-toi dessus. » Présents : fox, rab, hedge ; v : owl (carte), crab, frog, coin. Chambre. Sfx : click, boing, tummy. Carton : « 10h00 · La gare ».
3. `s10e03-la-gare` 10h00 — quai, billets, cloche du départ. Gag : la valise est trop large pour la porte du train ; Capitaine Gaston la range d'un coup dans son bec, puis la recrache dans le wagon. « Tous à bord ! » · « Bon voyage, mes petits. » Présents : fox, rab, hedge, pelican ; v : snail (point lent sur la route, fond), mole, beaver, marmot, badger. Gare. Sfx : handbell, whoosh, door. Carton : « 11h00 · Le train ».
4. `s10e04-le-train` 11h00 — le paysage défile, Lino lit le plan. Gag : Mlle Zélie passe son long cou par la fenêtre, un tunnel arrive, elle rentre d'un coup, son foulard reste dehors. « Un tunnel arrive ! » · « Mon foulard ! » Présents : fox, rab, hedge, giraffe ; v : mimi (carte), lynx, otter, owl, ibex. Wagon, fenêtre. Sfx : whoosh, click, laugh. Carton : « 12h00 · Le camping ».
5. `s10e05-le-camping` 12h00 — arrivée au camping ; Pétronille lève la barrière. Gag : la barrière monte pendant tout l'épisode, Roussin attend sans bouger, elle s'ouvre à la dernière seconde juste devant son nez. « Doucement, doucement, tout arrive. » · « J'attends gentiment. » Présents : fox, rab, turtle, badger (sa caravane) ; v : coin, crab, mole, pelican, frog. Entrée du camping. Sfx : step, click, chirp. Carton : « 13h30 · La tente ».
6. `s10e06-la-tente` 13h30 — monter la tente avec Bastien le castor. Gag : il tape un piquet avec sa queue « pour vérifier » et la tente se dresse à l'envers, toit au sol ; Pétronille la retourne d'un doigt. « Trois piquets et demi. » · « Elle est à l'envers. » Présents : fox, rab, beaver, turtle ; v : snail (route), giraffe, marmot, badger. Pré du camping. Sfx : knock, boing, poof. Carton : « 14h30 · La baignade ».
7. `s10e07-la-baignade` 14h30 — bain dans le lac, bouées. Gag : Marinette lance la bouée à Roussin qui tombe en plein dedans ; Coin s'y assoit aussi, ils filent ensemble comme sur un bateau. « À l'eau, tout le monde ! » · « Je flotte ! » Présents : fox, rab, otter, coin ; v : owl, lynx, hedge, mimi, ibex. Lac. Sfx : splash, wave, whoosh. Carton : « 15h30 · La pêche ».
8. `s10e08-la-peche` 15h30 — pêche sur le ponton : Roussin veut un poisson pour le dîner. Gag : sa ligne remonte une botte, puis Bidule pendu à la ligne par la pince, puis enfin un poisson que Plouf renvoie à l'eau. « Ça mord ! » · « C'est une botte. » Présents : fox, rab, frog, crab ; v : pelican, mole, snail, giraffe. Ponton. Sfx : splash, click, clink. Carton : « 16h30 · Les glaces ».
9. `s10e09-les-glaces` 16h30 — Marius vend des glaces ; Roussin en commande cinq boules. Gag : la pyramide tient sur son nez, Mimi éternue de rire, tout glisse et atterrit en chapeau sur la tête de Marius. « Trois boules, s'il vous plaît. » · « Je les rattrape. » Présents : fox, rab, seal, mimi ; v : owl, badger, beaver, marmot. Plage, charrette. Sfx : slide, clink, tummy. Carton : « 17h30 · Jeux de plage ».
10. `s10e10-jeux-de-plage` 17h30 — olympiades de sable de Bouquet ; Flocon bâtit un château. Gag : Bouquet saute sur la plage, sa corne plante le château comme un drapeau ; la vague l'emporte, la corne reste, avec le drapeau. « Un, deux, trois, partez ! » · « Mon château ! » Présents : fox, rab, ibex, lynx ; v : snail, seal, hedge, otter, coin. Plage. Sfx : wave, skid, crack. Carton : « 18h30 · La lettre ».
11. `s10e11-la-lettre` 18h30 — Lino écrit à tous les amis, Roussin colle un croissant sur l'enveloppe. Gag : Mamie Marmotte dort dans le hamac, la lettre tombe sur son bonnet, elle la lit en rêve et répond « Oui » dans son sommeil ; Rouge-Gorge emporte la lettre. « Venez nous voir ! » · « J'arrive demain. » Présents : fox, rab, marmot ; v : mole, crab, pelican, frog, giraffe. Hamac, table du camping. Sfx : brush, chirp, yawn. Carton : « 19h30 · Le feu de camp ».
12. `s10e12-le-feu-de-camp` 19h30 — Roussin et Lino préparent le feu et le banc. Gag : Taupin surgit du sol au milieu du tas de bois, myope, il prend le feu pour le soleil et le salue ; Pétronille rentre la tête, puis installe un grand drap. « Le soleil se couche. » · « Doucement, tout arrive. » Présents : fox, rab, mole, turtle ; v : lynx, beaver, snail, mimi, badger, owl. Clairière, tas de bois. Sfx : crack, knock, chime. Carton : « 20h00 · Les arrivées ».
13. `s10e13-les-arrivees` 20h00 — la lettre a marché : les amis arrivent un à un par le chemin, guidés par Rouge-Gorge. Gag : à chaque arrivée un nouveau personnage entre dans le cadre ; la valise de Roussin sert de banc pour tous ; le croissant (fil 2) disparaît, trouvé dans la poche de Papi Bernard. Plans serrés : le duo + 2 personnages max ; plan large final de **tous** : owl, mimi, coin, hedge, badger, frog, crab, pelican, otter, marmot, ibex, lynx, beaver, giraffe, mole, turtle, seal. « Vous êtes venus ! » · « On a reçu la lettre. » Chemin, clairière. Sfx : chirp, door, handbell. Carton : « 20h30 · La grande fête ».
14. `s10e14-la-grande-fete` 20h30 — grande fête sous les lampions ; chacun apporte sa chose (glaces de Marius, planches de Bastien, rubans de Zélie, jeux de Bouquet). Gag : tous dansent, le banc de Bastien se plie en accordéon, Marius rattrape tout le monde sur son nez ; à 20h55 Mme Escargot entre dans le cadre, Lino range sa montre. « Mme Escargot est là ! » · « À l'heure pour la fin. » Plans larges, une bulle seule ; plans serrés ≤ 4 (duo, Marius, Pétronille, snail). Sfx : handbell, laugh, chime. Carton : « 21h00 · À bientôt ».
15. `s10e15-a-bientot` 21h00 — nuit étoilée ; tous chantent autour du feu, puis s'endorment ou s'embrassent. Roussin partage le dernier croissant en autant de miettes qu'il y a d'amis ; Lino écrit la dernière page du carnet. Gag : Roussin tend le croissant à Rouge-Gorge, qui le rend en miettes à tous. Plan large puis serré sur le duo, qui a le dernier mot : Lino : « À bientôt, mes amis. » · Roussin : « À l'année prochaine ! » Carton final : « Roussin &amp; Lino : à bientôt ! » (lisible vers 27 s, ≥ 4,5 s). Décor : clairière, feu, étoiles. Sfx : chime, laugh, chirp, wave. Pas de carton suivant.

## Règles techniques
- Un dossier `s10/<id>/make.mjs` par épisode (même format que S2–S5) ; imports `../../lib/kit.mjs`, `props.mjs`, `cast2.mjs` … `cast5.mjs`, `cast10.mjs` (Pétronille, Marius) et `camping.mjs` (à créer : gare, wagon, lac, ponton, tente, clairière).
- Sons : seulement les noms de `lib/audio.py` (alarm, boing, skid, splash, bell, chalk, tummy, knock, chirp, chime, whoosh, wave, click, step, slide, poof, clink, brush, laugh, crack, sniff, door, yawn, handbell). Besoin sound design : train (roulement), grillons du soir, feu qui crépite.
- Musique : 90–110 bpm ; ép. 11 et 15 lents ; ép. 14 crescendo ; ép. 15 piano doux puis accord final.


## Retours par épisode
x = présent dans la scène (ligne « Présents ») ; v = vignette de rappel (carte postale, 1 s). Contrôle : aucun ancien absent plus de 2 épisodes d'affilée ; plans serrés ≤ 4 ; rassemblement de tous réservé aux plans larges des ép. 13-15 (Mme Escargot n'arrive qu'à l'ép. 14, comme prévu).

| Personnage | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| fox Roussin | x | x | x | x | x | x | x | x | x | x | x | x | x | x | x |
| rab Lino | x | x | x | x | x | x | x | x | x | x | x | x | x | x | x |
| owl Mme Chouette | x | v |  | v |  |  | v |  | v |  |  | v | x | x | x |
| mimi | x |  |  | v |  |  | v |  | x |  |  | v | x | x | x |
| coin | x | v |  |  | v |  | x |  |  | v |  |  | x | x | x |
| snail Mme Escargot | x |  | v |  |  | v |  | v |  | v |  | v |  | x | x |
| hedge Piquette |  | x | x | x |  |  | v |  |  | v |  |  | x | x | x |
| badger Papi Bernard |  |  | v |  | x | v |  |  | v |  |  | v | x | x | x |
| frog Plouf |  | v |  |  | v |  |  | x |  |  | v |  | x | x | x |
| crab Bidule |  | v |  |  | v |  |  | x |  |  | v |  | x | x | x |
| pelican Capitaine Gaston |  |  | x |  | v |  |  | v |  |  | v |  | x | x | x |
| otter Marinette | v |  |  | v |  |  | x |  |  | v |  |  | x | x | x |
| marmot Mamie Marmotte |  |  | v |  |  | v |  |  | v |  | x |  | x | x | x |
| ibex Bouquet | v |  |  | v |  |  | v |  |  | x |  |  | x | x | x |
| lynx Flocon | v |  |  | v |  |  | v |  |  | x |  | v | x | x | x |
| beaver Bastien |  |  | v |  |  | x |  |  | v |  |  | v | x | x | x |
| giraffe Mlle Zélie | v |  |  | x |  | v |  | v |  |  | v |  | x | x | x |
| mole Taupin |  |  | v |  | v |  |  | v |  |  | v | x | x | x | x |
| turtle Pétronille |  |  |  |  | x | x |  |  |  |  |  | x | x | x | x |
| seal Marius |  |  |  |  |  |  |  |  | x | v |  |  | x | x | x |

Contrôle d'absence maximale (épisodes d'affilée) : owl 2, mimi 2, coin 2, snail 2, hedge 2, badger 2, frog 2, crab 2, pelican 2, otter 2, marmot 2, ibex 2, lynx 2, beaver 2, giraffe 2, mole 2.
