# Rapport : vidéos SVG dans ~/Desktop/Coding

*Analyse du 8 novembre 2026, en lecture seule (aucun fichier modifié).*

Dans ce rapport, « vidéo SVG » désigne un SVG animé (CSS `@keyframes` ou SMIL `<animate>`) rendu en MP4 ou GIF. Le rendu se fait image par image dans un navigateur headless, puis ffmpeg assemble les images.

Les copies ont été exclues des comptes : `dist/`, `.nuxt`/`.output`, builds Android et iOS, `.claude/worktrees`, `node_modules`, venv Python.

---

## 1. Est-ce que tous ces projets font des vidéos SVG ?

**Non, pas tous.**

| Projet | Vidéo SVG ? | SVG animés (sources) | MP4 issus de SVG | Autres vidéos (hors SVG) |
|---|---|---|---|---|
| **barbatoPeintures** | ✅ OUI (le plus gros) | 356 | 345 (+6 GIF) | 0 |
| **loicberthod-sitevitrine** | ✅ OUI | 219 | 210 | 4 hooks externes |
| **terredebienetre** | ✅ OUI | 72 | 72 | 0 |
| **dronepeaks** | ✅ OUI | 13 | 13 (+14 GIF) | 0 |
| **jordi / Pianumero** | 🟡 PARTIEL | SVG générés en Python, non stockés | 14 (+67 Typiano, SVG rendu dans le navigateur) | **environ 1 800** (Rust, Blender, montage) |
| **Initi / Leggendo** | 🟡 Presque non | 10 | **1** | 1 244 (PIL, IA, TTS) |
| **lettore-italiano** (+ gratuit, lettore) | ❌ NON | 0 (uniquement des icônes) | 0 | 0 |
| Vedeo, Classicanimated, moneyturbo, videeo, rectoverso, chauffageplan, brandi, motor3derust | ❌ NON | 0 (1 loader dans rectoverso) | 0 | oui, sans SVG |

### Totaux

- **670 SVG animés sources**, et environ **641 MP4 issus de fichiers SVG**, plus 20 GIF.
- En comptant aussi les SVG générés à la volée par jordi (14 vidéos) et Typiano (67 vidéos), on arrive à **environ 722 vidéos d'origine SVG**.

---

## 2. Détail par projet

### 2.1 barbatoPeintures : 356 SVG / 345 MP4 / 6 GIF

- **Format :** 1080×1920 (9:16), 25 fps, H.264, sans audio (la musique est ajoutée dans Instagram).
- **Animation :** tout en CSS `@keyframes`, sauf un fichier avec du SMIL.

| Dossier `public/brand/` | SVG | MP4 | Thème | Durée |
|---|---|---|---|---|
| reels | 63 | 53 (+6 GIF) | 40 « Astuces de pro » (`reel-peinture-01..40`), 7 anim présentation/explosion, 6 logos animés, 10 fonds `anim30-*` **sans MP4** | 6–24 s |
| noel | 40 | 40 | Noël v1 et v2 (2 × 15 reels + 5 stories) | 8–14 s |
| chalet-bellevue | 22 | 22 | Feuilleton « Le Chalet Bellevue », 20 épisodes (épisode 11 en 3 variantes) | 45 s |
| chantiers | 20 | 20 | « De A à Z » (lambris, cuisine, dégât d'eau…) | 40–52 s |
| chantier-a-z | 20 | 20 | « Chantier de A à Z » | 48 s |
| voisins | 20 | 20 | « Les Voisins » (Léo et Mia) | 40 s |
| couleurs | 20 | 20 | « La bonne couleur », saison 1 | 13–15 s |
| couleurs-s2 | 20 | 20 | « La bonne couleur », saison 2 | 13–14 s |
| serie | 20 | 20 | « L'Atelier Barbato » (astuces, quiz, mythes) | 15–16 s |
| serie2 | 20 | 20 | « Avant ton devis » (20 questions clients) | 16 s |
| docteur | 20 | 20 | « Le docteur des murs » | 14,5 s |
| erreur | 20 | 20 | « Cherche l'erreur » (quiz) | 15–19 s |
| stories | 20 | 20 | Stories de marque (services, valeurs, FAQ, zones) | 15–20 s |
| concours | 5 | 5 | Concours (⚠️ en 720×1280, 15 fps) | 16–30 s |
| animations | 5 | 5 | Logo animé (1080×1080) | 8 s |
| `src/assets` | 1 | – (1 GIF) | Logo animé du site | – |

**Rendu.** Le script `scripts/reels/render.mjs` fonctionne ainsi :
- Puppeteer pilote Chrome headless, met les animations en pause et avance `currentTime` image par image à 25 fps.
- Chaque image est capturée en JPEG, puis passée par pipe à ffmpeg (libx264, crf 20).
- Le mode `audit` vérifie les zones sûres Instagram, la taille des polices, l'accroche avant 1 s et la durée du carton final.

**Générateurs.**
- `scripts/reels/lib.mjs` est le moteur commun.
- Les séries ont leurs propres scripts : `astuces-01-05/06-20.mjs`, `serie-docteur.mjs`, `serie-erreur.mjs`. Les deux séries produisent aussi un CSV de calendrier de publication.

**⚠️ Points notés.**
- Il n'y a **pas de générateur** dans le dépôt pour chalet-bellevue, voisins, couleurs, serie, serie2, noel, stories, concours, ni pour les astuces 21 à 40. Seuls les SVG finaux existent.
- 285 MP4 sont en `yuvj420p`, ce qui ne correspond pas au script actuel. Ils viennent donc d'une autre version du rendu.
- Les 10 fonds `reels/anim30-*` n'ont jamais été rendus en vidéo.
- Puppeteer n'est pas dans `package.json`. Il faut définir `PUPPETEER_DIR`.

### 2.2 loicberthod-sitevitrine : 219 SVG / 210 MP4

- **Format :** 1080×1920, 30 fps, sans audio, animation en SMIL.
- **Charte :** « Registre » (blanc, encre, rouge #c8102e).
- **Contenu :** tous les textes viennent de `i18n/locales/{fr,en}.json` et `data/production.ts`.

| Dossier | SVG | MP4 | Contenu | Durée moyenne |
|---|---|---|---|---|
| social/reels/fr | 51 | 50 | v1 : promesse, méthode, offres, prix, garanties, fiches projet (barbato, dronepeaks, pianumero, leggendo…) | 14,8 s |
| social/reels/en | 51 | 50 | idem en anglais | 14,1 s |
| social/reels/v2/fr + en | 10 | 10 | 5 reels « audit » (garanties, prototype, rapportia, remote, vitrine) | 25 s |
| v3/fr/a-visuel | 25 | 25 | Animations illustrées par projet | 21,7 s |
| v3/fr/b-libre | 25 | 25 | Conseils, coulisses, idées reçues | 22,4 s |
| v3/fr/c-look | 25 | 25 | Textes du site dans de nouvelles mises en page | 20,6 s |
| v3/en/c-look | 25 | 25 | idem en anglais | 20,3 s |
| public/animations | 8 (7 animés) | 0 issu de SVG | `lb-*` (style sombre), export MP4 fait dans le navigateur | – |

**Scripts.**
- `generate-reels.mjs` pour v1, `generate-reels-v2.mjs` pour v2.
- `generate-reels-v3.mjs` pour v3. Il s'appuie sur le moteur `scripts/reels/core.mjs` et sur les séries de `scripts/reels/series/*.mjs`, écrites par des agents IA.

**Rendu.**
- Playwright met les animations en pause, puis appelle `setCurrentTime(i/30)` pour chaque image.
- Chaque image est capturée en JPEG, puis ffmpeg encode en crf 18.
- Une couverture PNG est extraite à t=0.

**Export dans le navigateur.** `composables/useMergedHookExport.ts` assemble un hook MP4 et un SVG. L'enregistrement passe par MediaRecorder, puis ffmpeg.wasm encode.

**⚠️ Points notés.**
- `reel-suisse.svg` (fr et en) n'a pas de MP4. C'est un orphelin : il n'apparaît plus dans le générateur.
- Le dossier `social/` et les scripts de reels **ne sont pas suivis par git**.
- `assets/animations` est une copie de `public/animations`.

### 2.3 terredebienetre : 72 SVG / 72 MP4

- **Emplacements :**
  - `svg-animations/output/` contient les sources.
  - `public/downloads/animations/{svg,mp4}` contient les fichiers publiés. La copie depuis `output/` est manuelle.
- **Format :**
  - 70 vidéos en 1080×1920 et 2 logos en 1080×472.
  - 30 fps, sans audio, animation en CSS `@keyframes`.
  - Durée totale : 31 min (60 vidéos de 30 s).
- **Deux familles :**
  - **01 à 30 :** concepts bien-être (lotus, vagues, chakras, respiration…), écrits par l'IA d'après `BRIEF.md`. Style glassmorphism bleu et or.
  - **42 extraits de `BrandGuideView.vue`** par `generate-brandguide-svgs.mjs` : Kit Vrai/Faux (20), Kit Vidéos 30s (10), Stories (6), Kit Reels (4), logo (2).
- **Rendu :** `scripts/render-animations-mp4.mjs` utilise une autre technique. Playwright **enregistre en temps réel** (`recordVideo`, en WebM), puis ffmpeg convertit en MP4 (crf 20).
- **Date :** tout a été produit le 8 août 2026.

### 2.4 dronepeaks : 13 SVG / 13 MP4 / 14 GIF

- **Emplacement :** `public/charte/`, dans des fichiers `dronepeaks_anim*_9x16.svg` et `anim04` à `anim13`.
- **Contenu :** intros du logo (drone qui pose la montagne, courbes de niveau, brume, flocons, écran FPV avec REC, atterrissage…).
- **Format :** 1080×1920, en CSS (et SMIL dans 2 fichiers).
- **Rendu :** `scripts/svg2gif.mjs`, un outil générique et réutilisable :
  - puppeteer-core avance le SMIL avec `setCurrentTime` et le CSS avec `getAnimations()`.
  - Sortie MP4 : 30 fps, libx264 crf 20.
  - Sortie GIF : 10 fps, 360 px, avec palette optimisée.
  - Usage : `node scripts/svg2gif.mjs in.svg out.mp4 9`.
- **Date :** tout a été produit le 1er août 2026.
- **⚠️ Point noté :** les MP4 et GIF `anim1` n'ont pas de SVG nommé à l'identique. La source est probablement `dronepeaks_anim_9x16.svg`.

### 2.5 jordi / Pianumero : partiel (environ 81 vidéos d'origine SVG sur environ 1 900)

Dans ce projet, le SVG n'est pas stocké sous forme de fichier. Il est **généré en Python, rasterisé par cairosvg, puis assemblé par ffmpeg**, en 1080×1920 à 30 fps avec audio.

| Générateur | Vidéos | Sortie |
|---|---|---|
| `scripts/pastelnumero.py` (« candy keys », 6 formats) | 6 | `~/Movies/Pianumero/pastel` |
| `scripts/pastel_batch.py` (lot de 50 prévus, P07 à P56) | **3** (lot interrompu ou en cours le 8 nov.) | `~/Movies/Pianumero/pastel2` |
| `scripts/guitarnumero.py` | 2 (+16 copies dans `comparaison/`) | `~/Desktop/Pianumero/Guitarnumero` |
| `scripts/whistlenumero.py`, `snapnumero.py`, `flutenumero.py` | 1 chacun | `~/Desktop/Pianumero/…` |
| `scripts/typiano-reel/render.mjs` (SVG/HTML rendu dans Chromium par Playwright) | 67 | `~/Movies/Typiano` |

**Ce qui n'est PAS du SVG (environ 1 800 vidéos) :**
- **Le binaire Rust `jordi`, qui produit l'essentiel :**
  - `--film` et `--wide` capturent la fenêtre egui : leçons piano et YouTube, `~/Movies/Pianumero`, environ 1 500 vidéos.
  - `--kalimba`, `--glow`, `--pop` et `--handpan` dessinent en tiny-skia : kalimba 34, handpan 166, glow et pop 13.
- **Blender :** les billes (48 vidéos).
- **Montages ffmpeg :** `handpan_montage.py` et `nouveaux-formats`.

Les vidéos sont presque toutes hors du dépôt : `~/Movies/Pianumero` (1 783), `~/Movies/Typiano` (67), `~/Movies/Kalimbanumero` (34), `~/Desktop/Pianumero` (28).

### 2.6 Initi / Leggendo : 10 SVG / 1 MP4 (sur 1 245 vidéos)

**Seul pipeline SVG : `leggendo-serie/svg_reels/`.**
- 10 SVG animés sur l'apprentissage de l'italien (faux amis, karaoké, vrai/faux…), datés du 6 novembre.
- Le rendu passe par `render_svg.py` : Chrome headless piloté par le protocole DevTools, puis ffmpeg, avec la musique de `reels_expr/musique.wav`.
- **Une seule vidéo rendue :** `svg_reels/out/7_falsi_amici.mp4`, publiée sur Instagram le 7 novembre. **Les 9 autres SVG n'ont jamais été rendus.**

**Les 1 244 autres vidéos ne sont pas du SVG :**
- Rendu image par image avec PIL : Pinocchio en karaoké, 36 chapitres (environ 480 MP4 finaux et intermédiaires).
- Pilotes, 50 reels « expressions italiennes », 138 tests dans leggendo-idees.
- Production IA : images Krea-2, clips LTX-2, voix Qwen3-TTS.
- Séries manga et manhwa à la racine d'Initi.

### 2.7 lettore-italiano : non

- Aucune génération de vidéo.
- Les SVG trouvés sont des icônes, des décors dans les composants Vue et le favicon. Le reste vient des venv Python.
- `lettore` est vide.

---

## 3. Les 5 techniques de rendu SVG → vidéo utilisées

| Projet | Outil | Méthode | fps | Qualité |
|---|---|---|---|---|
| barbatoPeintures | Puppeteer | pause, puis `currentTime` image par image, JPEG, ffmpeg | 25 | crf 20 |
| sitevitrine | Playwright | `pauseAnimations` + `setCurrentTime`, JPEG, ffmpeg | 30 | crf 18 |
| dronepeaks | puppeteer-core | SMIL et CSS image par image, PNG ×2, ffmpeg, et GIF | 30 / 10 | crf 20 |
| Initi | Chrome DevTools (Python) | pause, puis image par image, PNG, ffmpeg avec audio | 30 | crf 18 |
| terredebienetre | Playwright `recordVideo` | **temps réel**, WebM, ffmpeg | 30 | crf 20 |
| jordi | cairosvg (Python) | SVG généré en code, PNG, ffmpeg avec audio | 30 | crf 18 |

Ces outils font tous la même chose, mais chaque projet a sa propre copie. **C'est un bon point de départ pour `svgMaker`** : un seul outil commun qui reprendrait le meilleur de chacun.
- Il prendrait en charge le SMIL et le CSS, comme dronepeaks.
- Il ferait l'audit des zones sûres, comme barbato.
- Il ajouterait l'audio, comme Initi.
- Il produirait les planches de contrôle et les manifestes, comme sitevitrine v3.

## 4. Travail non terminé repéré

- **barbatoPeintures :**
  - Les 10 fonds `anim30-*` n'ont pas de MP4.
  - Les générateurs de 13 séries manquent dans le dépôt.
- **Initi :** 9 SVG Leggendo ne sont pas rendus.
- **jordi :** le lot `pastel2` est à 3 vidéos sur 50.
- **sitevitrine :**
  - `reel-suisse` est orphelin.
  - `social/` et les scripts de reels ne sont pas versionnés dans git.
