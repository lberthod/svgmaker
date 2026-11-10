# svgMaker

Rendu **déterministe** de SVG animés (CSS `@keyframes` **et** SMIL `<animate>`) en MP4 et GIF, pour Reels, Shorts et Stories.

Cet outil remplace les 6 moteurs recopiés de projet en projet :
- `barbatoPeintures/scripts/reels/render.mjs`
- `loicberthod-sitevitrine/scripts/reels/core.mjs`
- `terredebienetre/scripts/render-animations-mp4.mjs`
- `dronepeaks/scripts/svg2gif.mjs`
- `Initi/leggendo-serie/svg_reels/render_svg.py`
- le script de Typiano

Analyses à l'origine du projet : [RAPPORT-VIDEOS-SVG.md](RAPPORT-VIDEOS-SVG.md), [PIPELINE-SVG-VIDEO.md](PIPELINE-SVG-VIDEO.md) et [GUIDE-METHODES-VIDEO.md](GUIDE-METHODES-VIDEO.md).

## Installation

```bash
cd ~/Desktop/Coding/svgMaker && npm install
```

Pour avoir la commande `svgmaker` partout (facultatif) : `npm link`. Sinon, utilise `node ~/Desktop/Coding/svgMaker/bin/svgmaker.mjs`.

Prérequis : Node 20 ou plus, ffmpeg (Homebrew) et le Chromium de Playwright (déjà en cache sur ce Mac).

## Utilisation

```bash
svgmaker render public/brand/noel            # tout un dossier : MP4 + couverture à côté de chaque SVG
svgmaker render reel.svg --music musique.wav --gif --audit --sheet
svgmaker render social/reels -r -o out/ --fps 25
svgmaker probe  public/brand/reels           # durée, taille et animations détectées, sans rien rendre
svgmaker audit  public/brand/serie2          # contrôle Reels seul, en environ 2 s pour 8 fichiers
```

| Option | Rôle |
|---|---|
| `-o, --out` | dossier de sortie (par défaut : à côté du SVG) |
| `-r, --recursive` | parcourt les sous-dossiers |
| `-j, --jobs` | nombre de Chromium en parallèle (par défaut 6 sur le M5 Pro) |
| `--fps`, `--size LxH`, `--duration` | forcent les réglages lus dans le SVG |
| `--crf` (18), `--preset` (medium), `--quality` (92) | qualité x264 et qualité de la capture JPEG |
| `--music f.wav` | piste audio : bouclée si trop courte, coupée à la durée, fondus, loudnorm −14 LUFS |
| `--music-volume 0.55` | volume fixe à la place de loudnorm |
| `--gif` | GIF 12 i/s, 360 px, palette optimisée |
| `--audit` | audit Reels pendant le rendu, rapport dans `svgmaker-audit.json` |
| `--sheet` | planche de 6 images : `<nom>-planche.jpg` |
| `--no-cover`, `--cover-at s` | couverture JPG (par défaut à t = 0) |
| `--no-dedup` | capture toutes les images, même celles qui ne changent pas |
| `-f, --force` | refait tout, même si l'empreinte n'a pas changé |

### Ce que le SVG peut déclarer (facultatif)

```xml
<svg viewBox="0 0 1080 1920" data-duration="14.5" data-fps="30">
  <text data-role="hook">SAME TREE.</text>          <!-- accroche : doit être lisible avant 1 s -->
  <text data-role="final">DIFFERENT PREPARATION.</text> <!-- carton final : au moins 2,8 s -->
```

Sans `data-duration`, la durée est **détectée** :
1. fin de la dernière animation finie, CSS et SMIL confondus (y compris les `begin="id.end+0.5s"`) ;
2. sinon, un cycle de la plus longue boucle.

La taille vient de `width`/`height`. À défaut, le `viewBox` est mis à l'échelle sur 1080 px de large, donc un viewBox `320×569` donne 1080×1920.

## Fonctionnement

```
SVG ─► sondage (durée, taille, animations)
     ─► découpage en segments ─► N Chromium en parallèle
          pour chaque image : seek(t) = CSS currentTime + SMIL setCurrentTime
                              image identique à la précédente ? on la réutilise
                              sinon capture JPEG (CDP) ─► ffmpeg ─► segment .ts
     ─► assemblage (copie sans réencodage) + musique ─► MP4 faststart
     ─► couverture, GIF, planche, audit, manifeste .svgmaker.json
```

Les choix qui comptent :

- **Image par image, jamais d'enregistrement en temps réel.** Le résultat est identique à chaque rendu, sans image perdue, même sur une machine chargée.
- **Parallèle à deux niveaux.** Un lot se répartit par fichier ; une longue vidéo seule se découpe en segments répartis sur tous les Chromium.
- **Incrémental.** L'empreinte combine le SVG, les réglages et la musique ; un fichier inchangé est sauté.
- **Couleurs Instagram.** Conversion explicite de la capture sRGB plein écart vers BT.709 « TV range », avec les métadonnées complètes. Cela évite les couleurs délavées (les 285 MP4 `yuvj420p` de barbato étaient dans ce cas).
- **JS figé.** Les SVG « interactifs » (avec `<script>`, comme ceux d'Initi) ont leurs timers et `requestAnimationFrame` neutralisés après le chargement. Les polices et les `<image>` sont attendues avant la première capture.
- **Audit utile.** Seuls les textes lisibles sont jugés : à l'écran, immobiles au moins 0,25 s, non masqués par un élément au-dessus. Un texte qui glisse ou une carte cachée derrière une autre ne déclenche pas d'alerte. Les règles portent sur les zones sûres, le corps minimal de 26 px, le texte coupé, la superposition, l'accroche et le carton final.

## Mesures (M5 Pro, 8 novembre 2026)

| Cas | Avant | svgMaker |
|---|---|---|
| Reel barbato 45 s (1 125 images à 25 i/s) | environ 45 s (script barbato, 1 Chromium, 25 i/s) | **15 à 21 s** (53 à 73 i/s), SSIM 0,996 avec le MP4 d'origine |
| Lot de 8 SVG de 5 projets (5 447 images) | — | 102 s, environ 53 i/s |
| Audit seul des 8 SVG | passe séparée de quelques minutes | environ 2 s |
| Relancer un lot inchangé | tout est refait | 0 s (empreinte) |

## Boîte à outils de création (`src/kit/`, `library/`)

Les générateurs de séries partagent :

- `src/kit/core.mjs` : charte (encre, arc-en-ciel, polices), échappement, animations, étoile, nuage, ciel, filtre crayon, `validateArt` ;
- `src/kit/text.mjs` + `src/kit/fonts/` : **polices libres embarquées** dans chaque SVG (Fredoka pour l'anglais, Mali pour le thaï, licence OFL, environ 60 Ko en base64) et **texte mesuré** avec les vraies avances des glyphes (`fitSize`, `textWidth`) : plus d'estimation, le rendu est identique sur toutes les machines. Pour changer de police : `python3 -I src/kit/fonts/build-fonts.py <en.ttf> <th.ttf>` ;
- `src/kit/actors/` : de quoi animer des personnages, indépendamment d'une série :
  - `scene.mjs` (répliques, bruitages, calques d'animation, trajectoires, script pour l'audio),
  - `camera.mjs` (zoom `punch`, tremblement `quake`),
  - `lipsync.mjs` (bouche calée sur l'enveloppe réelle de la voix),
  - `mali.mjs` (l'éléphante Mali : marche, saut, expressions, trompe, oreilles, lunettes),
  - `gags.mjs` (10 entrées en scène d'objet avec la réaction du personnage : `box`, `run`, `bonk`, `rise`, `splash`, `float`, `drive`, `fly`, `self`, `pop`) ;
- `src/kit/library.mjs` + `library/` : **540 dessins** réutilisables, un fichier par dessin (`library/<catégorie>/<id>.svg`) et un index `library/index.json`.

```bash
svgmaker art list [texte] [--cat fruits] [--tags mali]   # chercher un dessin
svgmaker art add <id> dessin.svg --cat <cat> [--tags …]   # ajouter (validé, indexé)
svgmaker art check                                        # contrôler toute la bibliothèque
```

### Formats (`src/formats/`) : un brief JSON → une vidéo

| Format | Pour | Guide |
|---|---|---|
| `carton` | astuces, chiffres clés, listes, citations, offres (thèmes `warm`, `night`, `kids`, couleur de marque) | [STYLE.md](src/formats/carton/STYLE.md) |
| `quiz` | questions à 2 à 4 choix illustrés, compte à rebours, révélation, explication | [STYLE.md](src/formats/quiz/STYLE.md) |
| `minifilm` | petite histoire en plans avec Mali : décors, accessoires, gags, caméra, voix et sous-titres | [STYLE.md](src/formats/minifilm/STYLE.md) |

```bash
svgmaker formats                                  # liste
svgmaker preview src/formats/quiz/examples/animal-sounds.json   # planche + audit en 2 s
src/formats/build.sh <brief.json> [--music x.wav]  # voix (si répliques) → MP4 + audit + planche
```

Chaque format a 3 briefs d'exemple dans `src/formats/<format>/examples/`. Les textes sont mesurés, coupés en lignes équilibrées (« 18 °C » et « nuit ! » ne sont jamais séparés), et l'audit Reels doit être vide.

### Sous-agents experts (`.claude/agents/`) et skill `/produire-video`

`svg-pedagogue`, `svg-illustrateur`, `svg-localisateur-th`, `svg-typographe`, `svg-realisateur`, `svg-sound-designer`, `svg-directeur-artistique`, `svg-qa` : chacun connaît son métier, les commandes svgMaker de son domaine et son portail qualité. La skill `.claude/skills/produire-video` les orchestre (cadrage → contenu et dessins en parallèle → aperçu + DA → son et rendu → QA). Dans Claude Code : « fais un quiz sur les animaux de la ferme pour enfants ».

Dans un thème : `"art": "cow"` (kids-english-th) ou `art: lib({ cow: 'cow-mali' })` (Mali). Le studio a un onglet **Bibliothèque** (recherche, catégories, style). Feuille de route : [RAPPORT-BOITE-A-OUTILS-SVG.md](RAPPORT-BOITE-A-OUTILS-SVG.md).

## Tests

```bash
npm test   # audit, détection de durée, rendu MP4, incrémental, studio, bibliothèque, générateurs (golden)
```

## Limites connues

- La réutilisation des images fixes est désactivée quand le SVG contient du SMIL : on ne peut pas prouver qu'une image n'a pas changé. Le rendu reste correct.
- Il n'y a pas de rendu sans navigateur (resvg) : il ne gère pas les animations CSS.
- Le contrôle piloté image par image de Chrome (`beginFrame`) n'est pas disponible sur macOS.
- Les reels « Python procédural » (DEMIC, `Greny/reels-demic-src`) gardent leur propre moteur pour l'instant. Prochaine étape possible : une commande `svgmaker frames` qui reçoit des images brutes et réutilise le même encodage, l'audio et la planche.
