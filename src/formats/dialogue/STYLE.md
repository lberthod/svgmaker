# Format « dialogue » : personnages qui parlent

Un Reel 9:16 (1080×1920, 30 i/s) en **plans** (1 à 12) : des personnages dessinés (poses de `library/`) dont la **bouche suit l'enveloppe réelle de leur voix**, des accessoires animés, des gags, une caméra, du texte à l'écran, des sous-titres dans la zone sûre, un mode quiz et un carton final. Un narrateur (voix off) n'a pas de corps : son sous-titre a un style distinct.

```bash
svgmaker preview film.json              # SVG + planche + audit (≈ 3 s) : REGARDER la planche
svgmaker lipsync film.json              # contrôle auto de la bouche (voir « Synchro labiale : contrôle »)
src/formats/build.sh film.json          # SVG → rendu MP4 + audit + planche (n'appelle PAS audio.py de Mali)
```

## Brief

```json
{
  "format": "dialogue", "id": "mon-film", "theme": "night", "captions": "bar",
  "voices": "voice.json", "timeline": "timeline.json", "audio": "audio.wav",
  "cast": {
    "atlas": { "art": "atlas", "talk": "atlas-talk", "surprised": "atlas-surprised", "color": "#3E8E5A",
               "feet": 160, "top": -170, "badge": { "x": 0, "y": -45 },
               "blink": { "eyes": [[-38, 45], [38, 45]], "r": 27, "color": "#B5C98A" } }
  },
  "shots": [ { "duration": 4, "bg": "workshop-bg",
      "texts": [{ "kind": "title", "text": "Un livre = très cher", "at": 0.1 }],
      "actors": [{ "who": "atlas", "x": 540, "y": 1000, "size": 600 }],
      "props": [{ "art": "price-tag", "x": 700, "y": 600, "size": 200, "anims": [{ "do": "grow", "at": 0.7, "dur": 2, "k": 6 }] }],
      "lines": [{ "at": 0.3, "who": "atlas", "text": "Un livre coûtait une fortune." }] } ],
  "end": { "text": "Suis-nous !", "sub": "Prochaine époque ?" }
}
```

### Niveau brief

| Champ | Règle |
|---|---|
| `theme` | `night` (dégradé bleu nuit, texte blanc) ou `warm` (papier crème) |
| `captions` | `bar` (défaut : sous-titre en bas de la zone sûre) ou `bubble` (bulle au-dessus de la tête du locuteur ; le narrateur reste en barre) |
| `cast` | `{ id: { art, talk?, surprised?, <autres poses>, color?, feet?, top?, badge?, blink?, mouth? } }`, voir plus bas |
| `voices` | chemin (relatif au brief) du `voice.json` des voix : `{ "<qui>\|<texte>": { dur, env } }` (format svgMaker : enveloppe à 30 i/s) ; accepte aussi `{ lines: [{ who, text, t0, t1, env? }] }`. Le `voice.json` du dossier de sortie est lu aussi (le premier est prioritaire) |
| `timeline` | chemin de `timeline.json` (`{ lines: [{ who, t0, t1, text }] }`) : **remplace les temps `at` du brief** (appariement par `who` + `text`) ; une réplique du brief absente de la timeline garde son `at` et déclenche un avertissement |
| `audio` | chemin de la bande son (`data-music` du SVG, mixée au rendu). Absent : avertissement, rendu muet |
| `end` | `{ text, sub?, dur? }` carton final ≥ 3 s (défaut 3,4 s, ne dépasse pas le dernier plan), `data-role="final"` ; l'audit exige ≥ 2,8 s lisible |
| `bg` | décor par défaut des plans (voir ci-dessous) |

### Un plan

| Champ | Règle |
|---|---|
| `duration` | 1,5 à 15 s. Tous les temps `at` d'un plan sont **relatifs au début du plan** |
| `bg` | `"#RRGGBB"`, `{ from, to }` (dégradé), `"day"\|"night"\|"beach"\|"paper"\|"ink"` (décors de `kit/scenery`), ou un dessin plein cadre `"workshop-bg"` / `{ art, fit: "cover"\|"width", x, y, k }` (les décors de `library/` ont un cadre arrondi : `cover` le sort du champ). Absent : dégradé du thème |
| `actors` | `{ who, x, y, size, flip?, enter?, at?, exit?, exitAt?, do?, poses?, idle?, bleed? }` : (x, y) = centre du carré de dessin, `size` = côté en px (le dessin tient dans ±250 sur 500). `enter` = `pop drop rise slide-left slide-right fade none`, `exit` = `fade pop drop slide-left slide-right`. `do` = `[{ at, do, dur? }]` avec `hop bigjump nod shake tilt tiltback surprised`. `poses` = `[{ at, dur, pose }]` (toute pose déclarée dans `cast`). `bleed: true` = cadrage volontairement coupé (gros plan), exempté de l'audit. Un acteur par plan au plus |
| `props` | `{ art, x, y, size, label?, labelAt?, flip?, at?, enter?, exit?, idle?, anims?, parts?, layer? }` : `enter` = `pop drop rise fly fade stamp grow none` ; `exit` = `"fade"\|"pop"\|"fly"\|"drop"` ou `{ do, at }` ; `idle` = `wiggle bounce pulse` ; `anims` = `[{ do, at, dur?, k?, k0? }]` avec `do` = `pop drop rise fly stamp fade grow shrink wiggle bounce pulse` (`k` = échelle cible de grow/shrink/pulse) ; `layer: "front"` = devant les acteurs ; `label` = étiquette (pastille) sous le dessin, `labelAt: [dx, dy]` |
| `props[].parts` | anime une **partie** d'un dessin (`data-part`) : `{ part, do, at, dur?, every?, loop?, origin?, k? }` ; `part` accepte `*` (`"book-*"`, avec `every` = décalage entre parties), `do` = `pop appear vanish pulse wiggle shrink grow drain fill stamp press` (`press` : descente puis remontée de `k` unités de dessin, ex. la vis de `printing-press`, partie `screw`, avec un « poum » à 42 % de `dur`), `origin` = `center\|bottom\|top` (sable : `drain`/`fill` avec `origin: "bottom"`). Partie introuvable : avertissement |
| `props[].letters` / `frise` | accessoires dessinés par le moteur (pas de `art`) : `{ letters: "LIVRE", x, y, size, at, every?, printAt?, print?, caption? }` = lettres de plomb (miroir) qui montent une à une puis le mot imprimé à l'endroit ; `{ frise: { start, next, slideAt?, lightAt?, k? }, x, y, size, at }` (`k` = agrandissement de la frise, 1 par défaut) = frise : point daté, flèche qui glisse, case suivante qui s'allume avec le texte `next` (ses textes portent `data-role="final"` : la frise tient lieu de carton final, `final: false` pour l'éviter) |
| `gags` | déclaratifs : `{ type: "shock", who, at }` (pose surprise + saut + secousse), `{ type: "bonk", who, art, at }` (un objet tombe sur la tête), `{ type: "stamp", who, text, at, color?, quake? }` (`quake: 0` sans secousse) (lettre d'imprimerie tamponnée sur le personnage, reste jusqu'à la fin du plan ; position `cast.<id>.badge`), `{ type: "burst", x, y, at }` (gerbe d'étincelles) |
| `camera` | `{ at, dur, zoom, x, y }` (zoom bref qui revient), `{ at, dur, quake }` (tremblement), `{ at, dur, to: { zoom, x, y }, from?, ease? }` (travelling, pan, zoom qui reste jusqu'à la fin du plan ; `ease: "linear"` pour un mouvement lent). Le cadre est borné au décor |
| `texts` | `{ kind, text, at, dur?, y? }` : `title` (gros, ≤ 2 lignes), `date` (cartouche parchemin), `label` (pastille sombre), `brand` (pastille avec la marmotte du studio, dessin `marmotoons-mark`, et le nom), `bubble` (`{ who, text, at, dur }` : bulle SANS voix au-dessus d'un personnage, pour un gag muet), `countdown` (`{ at, from: 3, step: 1 }` : 3-2-1 en chiffres). Les textes simultanés s'empilent à partir de y = 252 (≈ 12 % de la hauteur) ; titres, cartouches et étiquettes font ≥ 44 px. **Le plan 1 a un `title` avant 0,6 s** (accroche écrite, vérifiée par l'audit) |
| `lines` | `{ at, who, text }` ; `who` = id de `cast` ou `narrator` ; ≤ 90 caractères. Sans `timeline`, une réplique attend la fin de la précédente (+0,15 s) : jamais de chevauchement |
| `quiz` | voir ci-dessous |
| `focus` | instant (dans le plan) de l'image de la planche d'aperçu |

### Personnages (`cast`)

`art` = pose neutre, `talk` = bouche ouverte, `surprised` = surprise ; toute autre clé est une pose utilisable dans `poses` (ex. `"shell": "atlas-shell"`).

- **Synchro labiale** : pendant une réplique de ce personnage, la pose `talk` s'affiche quand l'enveloppe de `voice.json` dépasse un seuil (hystérésis 0,3 / 0,18) et le corps « porte » légèrement la voix. **Sans `voice.json`** : la bouche bat toutes les 0,32 s. Hors parole : pose neutre, clignement, respiration.
- `blink` `{ eyes: [[x, y], …], r, color }` : paupières dessinées sur les yeux (coordonnées du dessin, ±250), couleur de la peau. Absent : pas de clignement.
- `mouth` `{ x, y, w }` : repli si la pose `talk` n'existe pas encore : une bouche dessinée suit l'enveloppe. Sans `talk` ni `mouth`, seul un rebond du corps marque la parole (avertissement).
- `feet` / `top` : ordonnée des pieds et du haut de la tête dans le dessin (±250), pour le rebond, les bulles et le gag `bonk`. `color` : couleur du sous-titre (`#RRGGBB`).
- Les poses se superposent : leurs contours doivent coïncider (idéalement un liseré clair commun) pour éviter un saut visuel.

### Mode quiz

```json
"quiz": { "at": 0.3, "cdAt": 1.9, "countdown": 3, "step": 0.7, "reveal": 3.4, "correct": 1, "zoom": 1.15, "y": 820,
          "cards": [{ "art": "scribe" }, { "art": "printing-press" }, { "art": "knight" }] }
```

Trois cartes (`quiz-card` + dessin + lettre A/B/C dessinée dans la pastille), compte à rebours (`countdown` chiffres de `step` s chacun, à partir de `cdAt`), puis **révélation** : la bonne carte s'éclaire (`data-part="glow"` de `quiz-card`, éteint avant, + pulsation), les autres s'assombrissent ; `zoom` recadre sur la bonne carte. Centres des cartes : x = 197, 540, 883 ; y = `y` (800) par défaut, ou `positions: [[x, y], …]` (ex. triangle) ; `size` (côté du carré de la carte, 340 par défaut, la carte fait 0,8 × `size` de large) ; compte à rebours `cdY`, `cdR` ; `zoom` recadre sur la bonne carte ou sur `zoomAt: [x, y]`. La question et les réponses parlées sont de simples `lines` ; la révélation tombe à `reveal` (secondes depuis le début du plan ; défaut `cdAt + countdown × step`) : on peut ainsi la caler sur un `ding` de `timeline.json`, le dernier chiffre est raccourci en conséquence.

## Synchro labiale : contrôle

`svgmaker lipsync film.json [--min 85] [--frames dossier]` reconstruit le SVG, puis, pour chaque réplique d'un personnage à l'écran, se place aux instants de forte (≥ 0,5) et de faible (≤ 0,1) énergie de l'enveloppe de `voice.json`, lit la pose réellement affichée et vérifie : pose `talk` ouverte à forte énergie, fermée à faible énergie ; **aucun autre personnage** ne parle pendant la réplique ; **personne** ne parle dans les silences ; et **chaque réplique a son sous-titre visible pendant toute sa durée**. Rapport par réplique (pourcentage de concordance), code de sortie 1 sous le seuil. `--frames` enregistre une image « ouverte » et une « fermée » par réplique (à regarder). Module réutilisable : `src/lipcheck.mjs` (`checkLipsync`, `formatReport`). La voix off n'a pas de corps : non contrôlée.

## Sous-titres

Une seule pastille pour toute la vidéo (mêmes forme, cadre blanc, opacité 92 %) : corps 44 à 48 px, 2 lignes au plus, centrée à y = 1310 (≈ 68 % de la hauteur, dans la zone sûre). Un personnage = pastille de sa couleur (`cast.<id>.color`), texte blanc ; le **narrateur** = pastille indigo, texte doré et petite icône de haut-parleur. Chaque sous-titre reste ≈ 0,6 s après la voix ; le dernier (l'appel à l'action) reste jusqu'à la fin. `captions: "bubble"` les met en bulles au-dessus des personnages.

## Contrat et audit

- Même contrat que les autres formats : polices embarquées, aucun script, aucune image externe, durée en `data-duration`. **Les lettres et chiffres sont des `<text>` des polices embarquées** (comme le carton), jamais des polices système.
- `svgmaker audit` / `preview` vérifient en plus : accroche lisible avant 1 s, carton final ≥ 2,8 s, texte dans la zone sûre (sous-titres bornés à y ≤ 1470, hors bandes Reels/TikTok), textes superposés, **taille minimale des sous-titres** (44 px, `data-role="sub"`), et **aucun acteur coupé** par le bord (un acteur immobile à moitié hors cadre ; `bleed: true` pour un gros plan voulu). Attention : un zoom de caméra qui rogne un acteur est signalé aussi.
- Dessins absents ou parties introuvables : **cadre de remplacement + avertissement** (`svgmaker new/preview` les affiche ; `info.warnings`), jamais une erreur. Les erreurs de brief (champ manquant, personnage inconnu) sont explicites.
- Bruitages proposés dans `script.json` (`sfx` : pop, boing, whoosh, bonk, sparkle, tick, drumroll, ding) ; `script.lines` = `{ t, role, who, text }` pour la production des voix.

## Écrire de bons dialogues

- Répliques courtes (≤ 6 mots), une voix à la fois, nombres en lettres ; **une chose qui bouge par plan** (gag, entrée d'un accessoire).
- Garder acteurs et accessoires dans la zone sûre (y de 220 à 1500) ; les sous-titres occupent y 1340–1470, donc pieds des acteurs au-dessus de ~1330.
- Un zoom de caméra rogne les bords : prévoir de la marge autour des acteurs.

## V2 : décors plein cadre et personnages articulés

Exemple qui marche : `examples/v2-demo.json` (décor de test `test-atelier`, poses `test-figure--idle` et
`test-figure--arms-up`, sources dans `library/scenes/` et `library/demo-v2/`). Contrôle : `svgmaker art check`,
tests : `test/v2.test.mjs`. Code : `src/kit/v2art.mjs` (contrat, validation) et `src/formats/dialogue/v2.mjs` (moteur).

### Contrat des illustrateurs

**Décor** (`library/scenes/<id>.svg`, ajout : `svgmaker art add <id> fichier.svg --cat scenes`)
- `<svg viewBox="0 0 W 1920" data-kind="scene">` en **pixels finaux** : W = 1080 (plan fixe) jusqu'à 4320 (travelling ; 2160 = deux écrans).
- Exactement trois groupes de premier niveau, dans cet ordre : `<g data-layer="back">` (arrière-plan, parallaxe ×0,7),
  `<g data-layer="mid">` (sol, meubles, lumière ; les personnages y sont posés, ×1), `<g data-layer="fore">` (amorce sombre, ×1,3 ;
  peut être vide). Rien d'autre au premier niveau qu'un `<defs>`.
- Le sol des personnages : y = 1450 environ (sujet entre 260 et 1450 px, haut 0–220 et bas 1500–1920 réservés aux plateformes).
- Parties animables : `data-part="nom"` sur un `<g>` (ex. `flame`, `sand-top`) ; **jamais `id`** sauf sur `<linearGradient>`,
  `<radialGradient>`, `<clipPath>`, `<mask>`, `<pattern>`, référencés par `url(#id)` (le moteur préfixe ces id à chaque usage).
- Interdits (comme en V1) : `<script>`, `<style>`, `class`, animation, `<image>`, `href`, `on…`. Filtres déconseillés (rendu lent).

**Pose de personnage** (`library/<cat>/<perso>--<pose>.svg`, ex. `library/history/gutenberg--pull-bar.svg` ; ajout : `svgmaker art add gutenberg--pull-bar fichier.svg --cat history`)
- `<svg viewBox="…" data-kind="pose" data-height="1150">` : **ancre (0,0) = sol entre les pieds**, la tête vers y < 0 ;
  `data-height` = hauteur de référence en px (sommet du bonnet en pose debout à y = −data-height), **la même pour toutes les poses
  d'un personnage** (Gutenberg 1150 = 60 % de 1920). Le viewBox est libre (il doit contenir le dessin), seul l'ancrage compte.
- Dessiné **tourné vers la droite** (trois quarts droit) : le moteur le retourne quand il marche vers la gauche.
- Parties obligatoires : `data-part="mouth-closed"` et `data-part="mouth-open"` (le moteur montre l'une ou l'autre selon
  l'enveloppe de la voix : plus de pose « talk »), `data-part="eyes-open"` et `data-part="eyes-closed"` (clignement).
- Facultatif : point de prise d'un accessoire, un cercle vide `<circle data-part="grip-r" cx="…" cy="…" r="0"/>` (ou `grip-l`)
  au creux de la main ; l'accessoire du plan (`hold`) y est accroché, dans chaque pose.
- Cycle de marche : plusieurs fichiers (`gutenberg--walk-1` … `-4`), joués à 8 images/s.

**Trait** (vérifié dans le rendu Chromium de svgMaker) : `vector-effect="non-scaling-stroke"` sur chaque élément tracé, avec
`stroke-width` en px d'écran : **7** contour des personnages et accessoires manipulés, **4** détails intérieurs, **3** décor, sans contour
pour les lointains. Le trait reste à cette épaisseur quels que soient l'échelle de la pose, le zoom et la parallaxe (mesuré : 7 px à
l'échelle 0,5 comme à 3). Les traits épais qui servent de forme (bras en `stroke-width="56"`) restent normaux. `svgmaker art add`
signale les traits sans `non-scaling-stroke`.

### Dans le brief

```json
"cast": { "gutenberg": { "poses": { "idle": "gutenberg--idle", "pull-bar": "gutenberg--pull-bar",
                                    "walk": ["gutenberg--walk-1", "gutenberg--walk-2", "gutenberg--walk-3", "gutenberg--walk-4"] },
                         "height": 1150, "color": "#6E2B2B", "top": -1150 } },
"shots": [{ "duration": 5, "scene": { "id": "d4-atelier-presse", "x": 0, "pan": [{ "at": 1, "dur": 3, "to": 700 }] },
  "actors": [{ "who": "gutenberg", "x": 420, "y": 1450, "pose": "idle", "hold": { "art": "quill", "size": 200 },
               "play": [{ "at": 0.5, "walk": 640, "dur": 1.2 }, { "at": 1.8, "pose": "pull-bar" }] }] }]
```

- `scene` : id d'un décor, ou `{ id, x, pan: [{ at, dur, to, ease }], parallax: { back, fore } }` ; `x` et `to` = décalage du cadre
  dans le décor (0 à W − 1080 px). Les accessoires et les acteurs sont en coordonnées du décor (couche `mid`).
- Personnage articulé : `x`, `y` = position des pieds ; `height` (sinon `cast.height`) ; `pose` = pose de départ (`idle` par défaut) ;
  `play` = `{ at, pose }` (change de pose) ou `{ at, walk: x, dur }` (marche jusqu'à x avec le cycle `walk`). La bouche, les yeux,
  la respiration, `enter`/`exit`, `bleed`, et le contrôle `svgmaker lipsync` marchent comme pour les autres acteurs.
- V1 et V2 cohabitent : un acteur V1 (`art`, `talk`, `surprised`, `size`) peut jouer dans un décor V2.

### V2 (suite) : parties animées, liseré, accessoires tenus, sous-titres charte

- `shots[].parts` : `[{ at, part, do, target?, dur?, origin?, k?, k0?, loop? }]` anime une partie `data-part` du **décor**
  (`target` absent ou `"scene"`) ou d'une **pose** (`target: "atlas"`). `do` : `show`, `hide` (parties cachées par
  `opacity="0"` dans le dessin), `pop`, `appear`, `vanish`, `pulse`, `wiggle`, `grow`, `shrink`, `drain`, `fill`, `flicker`,
  `smoke`, `twinkle`, `swing`, `sway`, `glow`, `spin`, `press`, `pullbar` (barreau de presse : de `k0` degrés à 0 puis retour).
  `origin` = pivot : `top|bottom|left|right|center` ou `"x y"` en unités du dessin (ex. `"-19 -85"`).
  Les props acceptent les mêmes `parts` (dessin de l'accessoire).
- Ambiance automatique des décors (désactivable : `scene.ambient: false`) : `flame*`, `lamp-flame` vacillent, `smoke*` montent,
  `dust-*` scintillent, `bell` se balance, `sheet-N` bougent, `window-glow` pulse.
- `shots[].dim` (0 à 1) : voile `#140F1E` entre la couche mid et l'amorce ; `shots[].fade: { in, out }` : fondus au noir.
- Acteur articulé : `rim: { color, side: left|right|all, width, opacity }` (liseré chaud côté bougie, ou contour clair `all`),
  `hold: [{ art, size, grip: r|l|both, behind, rotate, offset, poses, mirror }]` (deux mains = `both`, derrière le corps =
  `behind`, accessoire seulement dans certaines poses = `poses` ; un accessoire tenu par un personnage retourné reste à
  l'endroit sauf `mirror: true`), `offsets: { sit: [dx, dy] }` (pose dont l'ancre n'est pas au sol ; aussi dans `cast`),
  `cast.fps: { walk: 8 }` (vitesse d'un cycle).
- Sous-titres : `captionStyle: "charte"` (une seule pastille `#1E2233` 90 %, texte `#F2DFB0`, bord `#D9A441`, rayon 24 ; puce
  de couleur du personnage, haut-parleur pour la narratrice) ; `subY` = centre vertical (1420 : bas de la zone d'action, au-dessus
  de la zone d'interface 1500) ; `holdLastSub: false` pour ne pas garder la dernière réplique jusqu'à la fin.
- Texte `question` : `{ kind: "question", text: "?", at, y, size, pulse: [t…] }` (grand signe qui pulse sur les tics).
