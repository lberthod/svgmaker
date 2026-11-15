# Bible — « Le relief raconte » (série `geographie`) · v1.1 (après panel ; outils du générateur prêts)

**Promesse.** Comment les fleuves, les montagnes, les mers et le climat ont décidé de l'histoire de l'Europe : la carte est le personnage principal.
**Ton.** Émerveillement et explication, avec des mots simples et une analogie du quotidien par mécanisme.

## Signature (champs de brief, chaque épisode)
1. **Le trait menthe** : le héros (fleuve, crête, côte, faille, limite, méridien) est tracé avec `line.color: "#4DFFC3"`, une couleur réservée qui n'est jamais utilisée ailleurs. Au hook, il est tracé avec `line.at: 0`. Il reste ensuite visible dans chaque scène carte, hors plein-écran, et revient au final. `#3fb8a9` (l'accent du site) sert seulement à l'habillage (`pills[].stroke`). Tracés de fleuves : `python3 reels-nuit/geographie/outils/riverpts.py <Nom> 14` (alias français : Rhin, Tage, Dniepr…). Altitudes d'une coupe : `outils/profil.py <n> <z> lon,lat lon,lat…`, puis valeurs officielles à l'écran. Brief : `"rivers": "detail"` quand un affluent compte.
2. **Relief d'abord** : au hook, aucun `highlight` ni `beacon` ; le trait est le seul élément coloré. Ensuite, au plus 2 territoires colorés par scène, seulement pour une conséquence humaine. Ils ne recouvrent jamais le trait.
3. **Caméra** : hook cadré serré dès 0 s (*nécessite le champ `open`, voir les décisions*). Les ouvertures alternent entre trois types : (a) très serré puis dézoom, (b) travelling le long du trait, de l'amont vers l'aval, (c) `profile` dès le hook. Les cadrages serrés font 3 à 8° de large. Une seule vue large par épisode (≤ 36° × 28°). Deux scènes au moins gardent un cadrage fixe, et c'est le trait ou une flèche qui y apporte le mouvement. Jamais sous 1,5° de large.
4. **L'art « mesure »**, qui change selon la famille du héros :
   - fleuve : `bars` (longueur, débit) ;
   - montagne : `profile` ;
   - mer et détroit : `profile` en profondeur ou `split` ;
   - climat : `timeline` ;
   - humain : `compare`.

   Deux épisodes qui se suivent n'ont ni la même famille ni le même art principal. Toute frise géologique a un repère humain (premiers humains, pyramides).
5. **Final « aujourd'hui »** : avant-dernière scène avec `year: "Aujourd'hui"`, plus `beacon` et `pill` sur la conséquence visible (frontière, ville, langue, route, tunnel). Ensuite `final` : « Voilà pourquoi [réponse concrète qui nomme le héros]. », puis une courte phrase de reprise (« Et tout commence par cette question : ») qui enchaîne sur la question du hook.

## Structure type (≈ 85 s réelles, 9 à 10 scènes)
- 0–5 s : **hook**. Question dite en entier avant 2 s, sans phrase rituelle. Un seul bloc de texte : la question en 6 mots au plus ; le sous-titre n'arrive qu'après 2 s. Révélation visuelle à 3 s (dézoom, `profile` ou trait qui file).
- 5–14 s : **le décor** (où, quelle taille, voisins en `labels`).
- 14–36 s : **le mécanisme**. Deux scènes pour la tectonique, la glace, le rebond, la crise messinienne ou le partage des eaux ; une scène sinon. Chaque phrase porte un seul « parce que → donc ».
- 36–68 s : **l'histoire**, en 3 scènes dans l'ordre du temps : le relief impose, les humains s'adaptent.
- 68–78 s : **aujourd'hui**. Puis 78–88 s : **final**, boucle.

## Mots et faits
- **Interdits dans la voix** : tectonique, isostasie, messinienne, salinité, dorsale, subduction, bouclier, ligne de partage. Le terme savant peut figurer à l'écran en `pill`, après l'image qui l'explique.
- **Analogies conseillées** :
  - tapis qui se plisse contre un mur : les montagnes ;
  - rabot : le glacier ;
  - matelas qui remonte : le rebond du sol ;
  - baignoire dont on ferme le robinet : la Méditerranée ;
  - toit à deux pentes : le partage des eaux.
- **Mythe → nuance** : un titre qui reprend une idée reçue la corrige à l'écran (Gulf Stream, « cheval au galop », « fleuve sauvage »).
- **Sources** :
  - BRGM, USGS et articles revus pour la géologie ;
  - GIEC AR6 2021 pour le climat (horizon, scénario et référence 1995-2014 dits) ;
  - Inrap pour l'archéologie ;
  - Wikipédia seulement avec ses sources.
- Toujours « environ » pour les âges et les mesures. Mécanismes débattus dits comme tels (origine de l'Etna, ampleur de l'assèchement messinien). Records définis un par un.
- **Ne pas refaire** : 03-pays-bas (digues, polders, plan Delta), 23-islande et 32-norvège (langue).

## Carte (règles du cartographe)
- Image de relief :
  - zoom 7 au-delà de 20° de large, 8 entre 10 et 20°, 9 entre 3 et 8° ;
  - au plus 3 images par épisode.
- Les côtes de `eu.json` sont grossières : pas de cadrage de baie ou de lagune sans tracé `line` de la côte (Mont-Saint-Michel, Venise).
- Trait sur la mer : `line.width: 12` (liseré navy 19). Long fleuve : `line.draw: 3`.
- Mers anciennes : une couche `terrain` avec `sea` (−120, −1500, +5…) et `scenes: [i…]` limitée aux scènes du passé. Les côtes noyées à +N m ignorent les digues : le dire à l'écran.

## Ordre
- **Pilote** : 01 Danube (fleuve, brief existant), 14 Mont Blanc (montagne, `profile`), 26 Méditerranée (mer, `terrain.sea`).
- Ensuite des lots de 10 qui alternent les familles ; les sujets glaciaires (30, 31, 42, 44) sont espacés.
- En fin de série, les sujets qui attendent l'extension de la carte : 11, 12, 15, 22, 37 (zoom), 39.
