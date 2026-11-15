# Rédiger un brief « Empires disparus » — consigne du rédacteur

Tu écris UN brief JSON atlas dans le dépôt /Users/loicberthod/Desktop/Coding/svgMaker pour la série `empires`. Tu ne crées que ton brief et ton fichier de sources. Tu ne lances JAMAIS produire.sh, build.sh, file.sh ni aucun rendu vidéo.

## À lire d'abord (obligatoire, en entier)
1. `reels-nuit/outils/NOUVEAU.md` : exigences communes de la chaîne et leçons des audits (tout s'applique).
2. `reels-nuit/empires/BIBLE.md` : signature de la série (à appliquer à la lettre).
3. `src/formats/atlas/STYLE.md` : champs du brief, dont `open`, `highlight.area`, `line.width`, le **mode monde** et les arts (`src/formats/atlas/art.mjs` : stats, bars, languages, timeline, compare, split, treaty, profile ; lis les paramètres de chaque art que tu utilises).
4. Modèles : `reels-nuit/briefs/15-luxembourg-v5.json`, `reels-nuit/briefs/22-balkans-yougoslavie.json`, et les briefs déjà écrits de la série dans `reels-nuit/empires/briefs/` (pour varier : type de hook, arts, couleur d'empire différents des 2 épisodes précédents).

## Ton brief
- Fichier : `reels-nuit/empires/briefs/NN-slug.json` (NN = numéro dans le programme, 01 à 50 ; slug court, sans accent). `"id": "empires-NN-slug"`.
- Le hook dit d'abord la question du programme (le « Titre (question) »), puis la phrase-promesse qui oppose début et fin.
- `open: { "box": … }` = la `focus.box` du hook. Contour violet de l'apogée (`line`, `color: "#A77BE0"`, polygone fermé de 30 points au plus ; pour un empire en plusieurs morceaux, `line.parts` ajoute d'autres tracés dans le même style) au hook (`at` ≈ 0,3 s), à l'apogée (surface violette via `highlight.area` ou `regions`), et au final.
- Territoires anciens : `highlight.area` (polygones [lon, lat] tirés de cartes historiques, simplifiés, 10 à 30 points ; le polygone est découpé sur les terres, tu peux donc le tracer large sur la mer) ou `regions` ; toujours `"suisse": false` à la racine du brief (cantons et lacs suisses masqués) ; `note: "Contours approximatifs"` sur chaque scène de territoire ancien ; final : `note: "Contour approximatif, frontières d'aujourd'hui"`.
- Mode monde (`"world": true`) dès qu'un lieu sort de la fenêtre Europe (Russie, Proche-Orient, Asie, Afrique au sud de l'Algérie/Tunisie, Amériques). `terrain` : règle de NOUVEAU.md, et pour les grandes vues `z` = 3 (planisphère), 4 (plus de 100° de large), 5 (40 à 100°).
- 3 arts au moins (dont la `timeline` Naissance / Apogée / Chute / Aujourd'hui, 4 lignes, `dur` ≤ 5) ; une scène sans art entre deux arts ; valeurs vérifiées.
- Voix : 10 à 16 mots par phrase, une idée par scène, mots techniques définis à l'écran ; dernière phrase = réponse à la question avec ses mots (boucle), jamais « la question qui nous a ouverts ».
- Durée : `new` affiche une estimation ; vise 95 à 120 s estimées (durée réelle ≈ 0,75 × estimation, cible 70-90 s).

- **Relief** : le cadre 9:16 montre bien plus haut et plus bas que la `focus.box` ; la grande boîte `terrain` doit couvrir toute la vue (prends au moins 8° de plus au sud et au nord que les `focus.box`, sinon une bande sans relief apparaît en bas des vues larges).

## Vérifier (uniquement sur TON brief : ne lance jamais `new` ni `preview` sur un brief d'une autre série ou d'un autre épisode)
1. `cd /Users/loicberthod/Desktop/Coding/svgMaker && node bin/svgmaker.mjs new reels-nuit/empires/briefs/NN-slug.json` : aucune erreur (les avertissements « relief absent » sont normaux).
2. `node bin/svgmaker.mjs preview reels-nuit/empires/briefs/NN-slug.json -o /private/tmp/claude-501/empires-preview/NN-slug` puis lis l'image `*-preview.jpg` produite (une image par scène) : carte juste, cadrage, couleurs, textes. Corrige et recommence si besoin. (Si l'aperçu échoue par « TimeoutError », la machine est chargée : réessaie une fois, sinon continue.)
3. Sources : `reels-nuit/empires/sources/NN-slug.md`, une ligne « fait → URL » pour chaque date, chiffre, nom et contour (recherche web obligatoire : Wikipédia FR/EN, encyclopédies, atlas historiques).

## Réponse (150 mots au plus)
Plan des scènes ; arts (kind + sujet) ; type de hook ; couleur d'empire ; première phrase du hook et dernière phrase du reel ; durée estimée par `new` ; faits peu sûrs.

## Leçons des audits de la série (à appliquer dès l'écriture)
- Territoire perdu ou « tombé » : gris foncé `#6E6E6E` (le gris `#8A93A8` paraît mauve à côté du violet de l'apogée) ; `#8A93A8` reste pour les rivaux vivants.
- Préférer un `highlight.area` (découpé sur les terres) à des centaines de `regions` : le maillage blanc des régions est trop dense et laisse des îlots non coloriés.
- Une surbrillance, une pastille ou une étiquette doit rester visible au moins 2 s avant la fin de sa scène (`at`/`when` sur un mot dit tôt) et ne jamais être recouverte par un art moins d'1 s après son apparition.
- Un label hors du cadre sûr (y > 1290 à l'écran) bloque les mouvements de caméra : ne pose pas d'étiquette loin du sujet de la scène.
- Frise : exactement 4 lignes, et la voix ne cite pas une date qui n'y est pas.
- `stats` : 2 ou 4 cases (jamais 3, la 4e case vide se voit), pas de `sub` court collé aux cases ; varier l'art d'apogée (`big`, `bars`, `crowd`) d'un épisode à l'autre.
- `languages` : couleurs des lignes en alternance couleur d'empire / gris, une seule couleur vive.
- Cause historique : jamais une explication simplifiée inventée (« trop grand à défendre ») ; la cause sourcée, même plus sèche.
- Le contour violet du hook doit être visible dans le cadrage du hook (sinon il n'en reste que des traits qui coupent le titre).
