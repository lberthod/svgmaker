# Format « atlas » : reel « sur carte » (style vidéos d'histoire)

Un reel **d'histoire et de géographie** : carte **plein écran** (relief de satellite stylisé, mer et côtes, pays voisins), caméra qui zoome de l'Europe vers la Suisse puis glisse de scène en scène, **dates** (« 58 av. J.-C. », « 1291 »), **territoires qui changent de couleur**, **peuples qui arrivent** (flèche courbe + silhouettes qui marchent), **petits personnages plats** d'époque (Helvète, Romain, Alaman, Burgonde…) avec bulle et étiquette, **rayons de lumière** derrière le héros, **légendes jaunes** en majuscules, **sous-titres** qui suivent la voix, **chiffre géant**, **pictogramme de 100 personnes** et bouton **« abonné »** avec curseur. Les **questions à décompte** existent aussi (`choices`) mais ne sont pas utilisées par défaut. Voix : la guide « Heidi » (Ming, voix inventée `guide`). Carte disponible : la **Suisse** (26 cantons, 143 districts) dans son contexte européen (`src/kit/geo/ch.json` + `eu.json`, générés par `scripts/build-geo-*.mjs`).

```bash
svgmaker preview mon-brief.json                  # planche + audit en 2 s (voix estimées)
src/formats/build.sh mon-brief.json              # voix + bruitages + musique + MP4 + audit (3 à 8 min la 1re fois, puis les voix sont en cache)
```

## Brief

```json
{
  "format": "atlas", "id": "atlas-suisse-4-langues",
  "scenes": [
    { "type": "hook", "text": "Un petit pays. Quatre langues !", "focus": "all",
      "people": [{ "who": "heidi", "at": "Berne", "rays": true, "wave": true, "label": { "title": "Heidi", "sub": "ta guide suisse" }, "say": "Salut !" }],
      "say": ["Salut, moi c’est Heidi !"] },
    { "type": "map", "text": "Au nord : l’allemand", "highlight": { "langs": ["de"] },
      "people": [{ "who": "de", "at": "Zurich", "say": "Grüezi !", "when": { "line": 1, "d": 0.2 } }],
      "say": ["Au nord, on parle allemand.", { "say": "On dit Grüétsi !", "show": "On dit Grüezi !" }] },
    { "type": "map", "year": "Ve siècle", "text": "Les Alamans arrivent du nord", "highlight": { "langs": ["de"] },
      "moves": [{ "from": [9.4, 49.0], "to": "Zurich", "n": 5, "color": "#E8503A", "label": "Les Alamans", "at": { "line": 0, "d": 1.4 } }],
      "say": ["Au Ve siècle, les Alamans arrivent du nord.", "Leur langue donnera l’allemand suisse !"] },
    { "type": "final", "text": "Combien de bonnes réponses ?", "sub": "Écris ton score en commentaire !" }
  ]
}
```

| Champ | Règle |
|---|---|
| `scenes[0]` / `[-1]` | `hook` (accroche) et `final` (bouton « abonné » automatique) ; entre : `map` |
| `year` | date affichée en grand au-dessus de la légende (« 58 av. J.-C. », « 1291 », « Ve siècle ») |
| `text` | légende du haut (≤ 80 car.), **mise en majuscules automatiquement** ; jaune (blanche sur le hook et le final) ; `sub` : ligne blanche dessous |
| `focus` | cadrage : `"all"` (Suisse), `"europe"`, `{ langs \| cantons \| districts }`, ou `{ "box": [lon0, lat0, lon1, lat1] }`. Par défaut : les zones colorées de la scène. `pad` : marge |
| `highlight` | `{ langs \| cantons \| districts \| countries (noms anglais : "Italy", "France"…), color?, at?, keep? }` (un objet ou une liste) : territoire coloré en balayant de gauche à droite |
| `highlight.area`, `highlight.areas` | polygone libre rempli comme un pays : `"area": [[lon, lat], …]` (3 points au moins, fermé automatiquement) ou plusieurs : `"areas": [[[lon, lat], …], …]` ; combinable avec `countries` / `regions`. Pour un territoire ancien qui ne suit pas les frontières actuelles (empires, steppes). Le polygone est **découpé sur les terres** : on peut le tracer large sur la mer, seule la terre est coloriée. Le même polygone peut être redessiné en contour avec `line` (répéter le 1er point pour fermer) |
| `suisse` | `false` : ne pas dessiner cantons, districts et lacs suisses par-dessus la carte (utile pour les vues larges). Par défaut `true`, sauf en mode monde |
| `moves` | un peuple qui se déplace : `{ from, to, n?: silhouettes (1–8), color?, label?, at?, dur? }` — flèche courbe qui se dessine et silhouettes qui marchent |
| `people` | `{ who: heidi\|de\|fr\|it\|rm\|celte\|romain\|cesar\|alaman\|burgonde\|confedere, at: ville \| [lon, lat], size?, say?: « bulle », label?: { title, sub }, rays?, wave?, mood?: happy\|wow\|sad\|oops, when? }` : la couleur du vêtement = la couleur de la langue |
| `pills` | étiquette sombre sur la carte : `{ at, title, sub?, side?: t\|b\|l\|r, when? }` ou pile de pastilles colorées `{ at, stack: [{ text, lang }] }` |
| `labels` | nom blanc posé sur un territoire : `{ text, at, size? }` |
| `line` | trait qui se dessine (ex. le Röstigraben) : `{ points: [ville \| [lon, lat]…], label?, color?, at? }` |
| `big` | chiffre géant sur carte assombrie : `{ value, sub?, at?, dur? }` |
| `crowd` | « 100 personnes » : `{ at?, groups: [{ lang \| color, n, label?, at? }] }` (total ≤ 100) |
| `choices`, `answer` | **question** : 2 ou 3 réponses, index du bon. Décompte 3-2-1 ; la couleur, les personnages, étiquettes, chiffres… arrivent **à la révélation** |
| `say` | narration : `"texte"`, `["phrase", …]`, `{ ask, answer }` (question). Un élément peut être `{ "say": "texte lu (phonétique)", "show": "sous-titre" }`. La **durée de la scène suit la voix** |
| `at`, `when` | secondes depuis le début de la scène, ou `{ "line": n, "d": décalage }` = début de la n-ième réplique (calage image-voix) |

Villes : voir `CITIES` (`src/formats/carte/format.mjs`, 271 villes, dont Moscou, Kiev, Constantinople, Bagdad, Samarcande, Le Cap, Rio de Janeiro…). Langues : `de`, `fr`, `it`, `rm`, `bi`.

## Mode « monde » (hors d'Europe)

`eu.json` (49 pays d'Europe et de bordure) ne change pas. Les autres pays sont dans `src/kit/geo/world.json` et leurs régions dans `world-regions.json` (générés par `scripts/build-geo-world.mjs`, Natural Earth 1:10m, même projection).

- **Activation** : `"world": true` en tête du brief, ou automatiquement dès qu'un pays ou une région absents de `eu.json` / `eu-regions.json` sont cités (`base`, `highlight`, arts `compare` / `split`). Sans cela, le rendu est identique à l'ancien, octet pour octet.
- **Ce que ça change** : les pays du monde vus par une caméra sont dessinés, le zoom arrière descend jusqu'au planisphère (au lieu de 37° de large au maximum), le relief utilise un masque terre/mer complet (fichier de cache `…-w.jpg`, plus de liseré turquoise le long de la Russie), et les vues de plus de 90° de large ne dessinent plus les limites de régions.
- **Pays** (noms Natural Earth) : `Russia` (avec Kaliningrad, de 20° E à 191° E : la Tchoukotka est dépliée au-delà de l'antiméridien), `Georgia`, `Armenia`, `Azerbaijan`, `Kazakhstan`, `Uzbekistan`, `Turkmenistan`, `Kyrgyzstan`, `Tajikistan`, `Afghanistan`, `Iran`, `Iraq`, `Syria`, `Lebanon`, `Israel`, `Palestine`, `Jordan`, `Saudi Arabia`, `Kuwait`, `Egypt`, `Libya`, `W. Sahara`, `Mongolia`, `China`, `India`, `United States of America`, `Brazil`… (liste complète : `node -e "console.log(require('./src/kit/geo/world.json').countries.map(c=>c.name).join(', '))"`). Petits territoires : `Gibraltar`, `Jersey`, `Isle of Man`, `Faeroe Is.`, `Åland`.
- **Pays d'Europe en mode monde** : `France`, `Spain`, `Portugal`, `Netherlands`, `Norway` reçoivent leurs morceaux lointains (outre-mer, Canaries, Açores, Madère, Svalbard), et `Ukraine` reçoit la Crimée (frontières reconnues par l'ONU ; la source Natural Earth la rattache à la Russie).
- **Régions** (`highlight.regions`, `split.parts`) : Russie (84 sujets fédéraux, dont `{ "c": "Russia", "n": "Kaliningrad" }`, `Leningrad`, `City of St. Petersburg`, `Novgorod`, `Pskov`, `Moskva`, `Moskovskaya`, `Smolensk`, `Astrakhan'`, `Volgograd`, `Rostov`, `Krasnodar`, `Dagestan`, `Chechnya`…), `{ "c": "Ukraine", "n": "Crimea" }` et `Sevastopol`, Géorgie, Arménie, Azerbaïdjan, Iran, Irak, Syrie, Liban, Israël, Palestine, Jordanie, Arabie saoudite, Koweït, Égypte, Libye, Kazakhstan, Ouzbékistan, Turkménistan, Kirghizstan, Tadjikistan, Afghanistan. Liste : `node -e "console.log(require('./src/kit/geo/world-regions.json').regions.filter(r=>r.c==='Russia').map(r=>r.n).join(', '))"`.
- **Fleuves et lacs** hors d'Europe (Volga aval, Oural, Nil, Tigre, Euphrate, Amou-Daria, Syr-Daria, Indus, Gange… ; Aral, Baïkal, Victoria…) : dessinés en fond comme en Europe.
- **Relief** : même règle que d'habitude, mais la grande boîte doit couvrir les vues : `{ box: [lon0, lat0, lon1, lat1], px: 3000, z }` avec `z` = 3 pour le planisphère (`[-180, -58, 190, 83]`), 4 au-delà de 100° de large, 5 entre 40° et 100°, puis la règle habituelle. Au-delà de 180° E (Tchoukotka), le relief n'existe pas : cadrer avant.
- **Projection** : plate carrée à 46,8° N, comme le reste de la carte. Les surfaces sont justes vers 47° N, gonflées au nord (×1,4 à 60° N, ×2 à 70° N : Russie, Scandinavie, Canada) et réduites vers l'équateur (×0,7 : Afrique, Inde, Brésil). L'art `compare` utilise les mêmes contours, donc les mêmes déformations : ne comparer à l'œil que deux pays de latitudes voisines ; sinon donner les surfaces en chiffres (`stats`, `bars`).
- **Police** : pas de `œ`, `š`, `ž`, `č`, `ř`, `ş`, `ı` (écrire « oe », Sarajevo, Kaynardja…).

## Écrire un bon reel « atlas »

- **Un récit dans l'ordre du temps** : une date, un peuple qui arrive, un territoire qui change de couleur, **la conséquence visible aujourd'hui** (la langue). Une idée par scène, une légende de 3 à 6 mots, des phrases de la guide de ≤ 15 mots.
- **Cause → conséquence** : relier chaque langue à son origine (latin, peuples germaniques, relief des Alpes) plutôt qu'aligner des faits.
- **Montrer les proportions** (`crowd`) plutôt que des pourcentages seuls.
- Mots étrangers : écrire la **phonétique française** dans `say` (« Bouonne-djorno ») et le vrai mot dans `show`. Les années en chiffres sont lues en toutes lettres par la voix.
- Les chiffres (OFS 2022 : allemand 62 %, français 23 %, italien 8 %, romanche 0,5 %) sont des ordres de grandeur : à vérifier avant de publier.
- Durée visée : 80 à 95 s (≈ 14 caractères de narration par seconde).

## Voix, son, relief

`build.sh` lance `src/formats/carte/audio.py` deux fois (la durée des scènes dépend de la voix réelle). Ming contrôle chaque réplique avec Whisper (5 prises max) ; les mots étrangers ne sont lus qu'approximativement. Le relief est **procédural** (bruit éclairé + chaîne alpine), pas une vraie image satellite : pour de vraies tuiles, il faudrait une source libre de droits.

## Arts `treaty` et `split.to` (ajout série traites, 13/11/2026)
- `{ "kind": "treaty", "title": "Traité d'Utrecht", "sub": "11 avril 1713", "signers": ["2 à 4 noms courts"], "year": "1713", "seal": "#A3262F"?, "at", "dur": 3.5 }` : parchemin, signatures qui s'écrivent l'une après l'autre (0,35 s), puis sceau de cire qui tamponne l'année (≈ 0,9 s + 0,28 s × signataires après `at` ; prévoir `dur` ≥ 3,5 s et ne pas ouvrir d'autre art avant la fin). Noms ≤ 20 caractères.
- `split.parts[].area` : polygone [[lon, lat], …] (petit territoire : Gibraltar, une île) à la place de `country`/`region`. Au-delà de 8 parts, le liseré blanc s'affine.
- `timeline.spread: true` : lignes réparties sur toute la hauteur du panneau (utile pour 2 à 4 lignes).
- `split.legend` (si présent, « après » prend la couleur du 1er `to`) : `[{ color, text }]` (4 au plus, texte ≤ 12 caractères si 4) : pastilles de couleur sous les panneaux (« cédé », « Rollon », « le roi »).
- `split.parts[].to` : couleur de la partie dans le panneau « après » (le territoire qui change de main prend la couleur du gagnant) ; `lost` reste prioritaire (gris pointillé). Sans `to`, rendu inchangé.

## Options « relief » (série geographie, 13/11/2026) — toutes facultatives, sorties inchangées sans elles

| Champ | Règle |
|---|---|
| `open` | `{ "box": [lon0, lat0, lon1, lat1] }` : vue de la **première et de la dernière image** (boucle), au lieu de l'Europe entière. Mettre le même cadrage que `focus` du hook pour un hook serré dès 0 s |
| `rivers` | `"detail"` : ajoute en fond les fleuves secondaires (`src/kit/geo/eu-rivers-detail.json`, Natural Earth rang 9-11 : Saône, Durance, Aar, Reuss, Arno, Vltava, Volkhov, Marne, Isar…) |
| `terrain[].sea` | niveau de la mer en mètres pour cette image de relief (`-120` : dernière glaciation, Doggerland émergé ; `-1500` : Méditerranée presque vide ; `5` : côtes basses noyées, **sans tenir compte des digues**) |
| `terrain[].scenes` | indices de scènes consécutives où cette couche est visible (fondus de 0,6 s), par ex. la mer basse seulement dans les scènes du passé ; pas sur la première couche |
| `line.parts` | tracés supplémentaires dessinés en même temps et dans le même style que `points` : `[[ville \| [lon, lat], …], …]` (contour d'un empire en plusieurs morceaux, plusieurs routes) |
| `line.width`, `line.draw` | épaisseur du trait en px (8 par défaut ; le liseré navy fait +7) et durée du tracé en s (1,6 par défaut ; 3 pour un long fleuve) |
| art `profile` | coupe d'altitude ou de profondeur : `{ kind: "profile", at, dur, title, sub?, h: [altitudes en m, gauche → droite], peaks?: [{ i, label, value? }], from?, to?, color? }`. Le sol se dessine de gauche à droite dans `color` (menthe `#4DFFC3` par défaut), la mer apparaît sous le niveau 0. Altitudes : outil `profil.py` (tuiles terrarium) puis valeurs vérifiées à l'écran |
- `scenes[i].still: true` (14/11/2026) : caméra fixe sur le cadrage de la scène, sans la visite automatique (~1,7 s). C'est le trait ou une flèche qui apporte le mouvement.
- `terrain[k].fadeIn: <s>` (avec `scenes`) : la couche apparaît lentement à partir du début de sa première scène (ex. la mer qui se vide sous les yeux). Sans ce champ : fondu de 0,6 s.
- Art `profile` : le sol se révèle par un masque, de gauche à droite, au rythme du trait de crête.
