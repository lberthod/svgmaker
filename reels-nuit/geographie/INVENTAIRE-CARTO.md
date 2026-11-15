# Inventaire carto — série `geographie` (13/11/2026)

## Ce que la carte sait faire
- **Relief** : contrairement à ce que dit STYLE.md, `src/kit/geo/relief.py` n'est **pas procédural**. Il utilise de vraies altitudes (tuiles terrarium AWS, bathymétrie comprise), avec ombrage et teinte par altitude. Test (scratchpad `relief/europe.jpg`, `carpates.jpg`, `scandes.jpg`) : Alpes, Pyrénées, Carpates (arc complet et bassin de Transylvanie), Scandes, Apennins, Dinarides/Balkans, Massif central, Highlands et bassin pannonien sont **très lisibles**. Le plateau continental est visible (utile pour le Doggerland et les glaciations).
- **Hors des polygones `eu.json`** (Russie, Caucase, Amérique) : la terre est quand même dessinée d'après l'altitude, mais sans frontière, et un **liseré turquoise parasite** suit la frontière russe (artefact du masque terre/mer). À corriger lors de l'extension de la carte (session empires).
- **Fleuves** (`eu-regions.json`, Natural Earth 1:10m, scalerank ≤ 8, fenêtre jusqu'à lon 45) : 136 tracés, dont Danube, Rhin, Rhône, Seine, Loire, Tamise, Tage, Pô, Elbe, Vistule, Dniepr, Volga (amont seulement, coupée à 45°E), Èbre, Garonne, Oder, Tibre, Meuse, Escaut, Inn, Save, Tisza, Drina, Maritsa, Prut, Dniestr, Neva, Moselle, Main, Adige, Tessin. Ils sont dessinés en fond (bleu clair) mais **on ne peut pas surligner un fleuve par son nom** : il faut le tracer avec `line.points`. Outil de travail : `scratchpad/riverpts.py <Nom> <n>` extrait 12 à 18 points dans l'ordre amont → aval (testé : Danube, Rhône, Loire).
- **Lacs** : 78 (Léman, Constance, Balaton, Ladoga, Onega, Saimaa, Päijänne, Vänern, Vättern, Peipous, Skadar, Neagh…) + 22 lacs suisses (`ch.json`).
- **Villes** : 88 dans `CITIES`. Ce n'est pas bloquant : `people`, `pills`, `beacon` et `line` acceptent `[lon, lat]`.
- **Limite** : un seul `line` par scène, donc un seul tracé turquoise à la fois.
- **Arts** : `stats`, `bars` (barres verticales, utilisable pour altitudes et longueurs), `timeline`, `compare` (contours de **pays** seulement), `split` (pays ou régions), `languages`. **Pas d'art « profil/coupe ».**

## Manques et propositions (code partagé → verrou `reels-nuit/VERROUS.md`)
1. **Fleuves secondaires manquants** (scalerank > 8) : Saône, Durance, Isère, Aar, Reuss, Vltava, Arno, Somme. Contournement immédiat : tracer avec `line` et des coordonnées. Correction propre : relever la limite à scalerank ≤ 10 dans `scripts/build-geo-regions.mjs` (Natural Earth, domaine public), puis régénérer `eu-regions.json`. Lacs manquants : Garde, Majeur et Côme (côté italien).
2. **Art `profile`** (coupe d'altitude ou de profondeur : ligne de sol, sommets étiquetés, niveau de la mer) dans `src/formats/atlas/art.mjs`. Ajout rétrocompatible, ce serait l'art-signature de la série. **Décision de Loïc.**
3. **Plusieurs `line` par scène** : facultatif (pratique pour fleuve + frontière).

## Couverture des 50 sujets
| Statut | Sujets |
|---|---|
| **OK** | 1 Danube, 2 Rhin, 3 Rhône*, 4 Seine, 5 Loire, 6 Tamise, 7 Tage, 8 Pô, 9 Elbe, 10 Vistule, 13 Gothard*, 14 Mont Blanc, 16 Pyrénées, 17 Apennins, 18 Carpates, 19 Balkans, 20 Scandes, 23 Massif central, 24 Etna-Vésuve, 25 Islande, 26 Méditerranée, 27 Gibraltar, 28 Mer Noire (Bosphore, Turquie dans `eu.json`), 29 Baltique, 31 Fjords, 32 Mont-Saint-Michel (zoom z 10), 33 Venise, 34 Landes, 35 Sicile, 36 Sardaigne, 38 Mistral*, 41 Plaine hongroise, 43 Lacs finlandais, 44 Scandinavie, 45 Partage des eaux*, 46 Olivier, 47 Centre de l'Europe, 48 Banane bleue, 49 Fuseaux horaires, 50 Montée des eaux |
| **Données à ajouter (tracés `line` à documenter)** | 30 Doggerland (ancienne côte : points issus des sources), 42 Glaciations (limite de la calotte : points), 37 Gulf Stream (vue atlantique jusqu'à Montréal hors des polygones : à tester, sinon comparer Brest à Terre-Neuve), 39 Grande plaine (jusqu'à Moscou : relief OK, sans frontière russe) |
| **Impossible sans extension (session empires)** | 11 Dniepr (route des Varègues : Novgorod), 12 Volga (aval et Caspienne hors fenêtre), 15 Elbrouz, 21 Caucase, 22 Oural, 40 Steppe (Mongolie) → **en fin de production** |

\* tracés secondaires (Saône, Durance, Aar, Reuss) à faire avec `line` tant que les fleuves ne sont pas ajoutés.

## Reclassement après le cartographe (v1)
- Caméra : `camFor` limite la vue entre environ 37° × 28° (au plus large) et 0,65° (au plus serré). Les vues d'ouverture et de fin sont codées en dur sur l'Europe (`EUROPE`, format.mjs).
- **Données à ajouter** :
  - 32 Mont-Saint-Michel et 33 Venise : côte et lagune à tracer avec `line` ;
  - 45 Partage des eaux et 46 Olivier : la limite est à tracer avec `line`, en points ;
  - 30, 42, 50 et 26 : demandent le paramètre de niveau de la mer ;
  - 47 Ardennes : OK.
- **Fleuves** : le fichier source s'arrête au rang 9. Il apporte 34 tracés de plus (Durance, Vltava, Marne, Volkhov…). Aar, Reuss, Isère, Arno et Somme sont absents même à ce rang, donc à tracer à la main. Noms à normaliser : Rhein/Rhine, Tajo/Tagus, « Sane » = Saône aval.
- **37 Gulf Stream** : à faire en deux cadrages, `[-76,38,-48,56]` puis `[-30,40,-2,58]`, ou en abaissant la limite de zoom.
- **11 Dniepr, 12 Volga, 15 Elbrouz, 22 Oural** : faisables en cadrage régional, après la correction du liseré du masque (session empires). **40 Steppe** est recadré de l'Ukraine à la Hongrie. **21 Caucase** est remplacé.

## Mise à jour du 13/11 au soir : extension « mode monde » (session empires)
`"world": true` dans le brief, ou activation automatique. `world.json` et `world-regions.json` ajoutent la Russie, le Caucase, l'Asie centrale et l'Amérique du Nord. Le zoom arrière va jusqu'au planisphère, et il n'y a plus de liseré turquoise en mode monde.
- **Débloqués** :
  - 11 Dniepr : Novgorod, Staraïa Ladoga, Smolensk, Kiev, Constantinople ;
  - 12 Volga : aval, Caspienne, Astrakhan, Volgograd, Kazan ;
  - 15 Elbrouz : ville « Elbrouz », Géorgie, régions russes du Caucase ;
  - 22 Oural : Ekaterinbourg, Kazakhstan ;
  - 37 Gulf Stream : Canada, États-Unis, Montréal, Québec, en une seule vue atlantique ;
  - 39 Grande plaine : frontière russe tracée.
- **40 Steppe** : redevient possible jusqu'à la Mongolie (Oulan-Bator, Karakorum). Le recadrage Ukraine → Hongrie reste au choix.
- **Inchangé** : pas de fleuves de rang > 8, pas d'art `profile`.
- **Police** : glyphes absents en plus de ceux déjà connus : œ, š, ž, č, ř, ş, ı. Écrire « oe » ou utiliser la translittération française.
