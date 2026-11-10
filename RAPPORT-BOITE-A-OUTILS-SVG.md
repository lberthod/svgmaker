# Rapport : de deux générateurs à une boîte à outils SVG experte

*Audit du 10 novembre 2026 de la logique de **création** des SVG animés dans svgMaker. Le moteur de **rendu** (SVG → MP4) est traité dans [PIPELINE-SVG-VIDEO.md](PIPELINE-SVG-VIDEO.md). Il est sain : 10 tests sur 10 passent et il atteint 53 à 73 images/s.*

---

## 1. En bref

- **Le rendu est industrialisé, la création ne l'est pas.** `src/` est générique, testé et rapide. À l'inverse, chaque série invente son propre générateur dans `examples/` : `kids-english-th/make.mjs` (207 lignes) et `mali-english-th/engine.mjs` (614 lignes). Ils partagent la même charte et les mêmes primitives, mais par copier-coller.
- **Le vrai capital, ce sont les dessins, et ils sont enfermés.** Les 101 thèmes de `kids-english-th` contiennent 505 dessins, soit environ 1,5 Mo de SVG en ligne dans du JSON. Mali ne peut en réutiliser aucun : il a ses 5 dessins intégrés, plus ceux de ses thèmes `.mjs`.
- **La qualité repose sur l'intuition de celui qui écrit le thème.** La largeur des textes est estimée (`fit()`), le minutage est codé en dur et les dessins ne sont jamais contrôlés. L'audit n'intervient qu'*après* la génération.
- **Recommandation.** Extraire une boîte à outils `svgkit/` en 5 couches : primitives, bibliothèque de dessins, timeline, formats et contrôle qualité. La faire piloter par **des sous-agents experts par format** (pédagogique, carton et typographie, mini-film, personnage, données, marque). Chacun a un contrat d'entrée et de sortie JSON et un portail qualité automatique.

---

## 2. État des lieux

### 2.1 Les deux générateurs

| | `kids-english-th` | `mali-english-th` |
|---|---|---|
| Entrée | `themes/NNN-slug.json` (données pures) | `themes/<id>.mjs` (code JS) |
| Volume | 101 thèmes, 505 mots | 6 thèmes |
| Structure | Intro 5 s, 5 scènes de 5,2 s, récap 7,4 s, soit 38,4 s | Intro 8 s, 5 scènes de 9 s, quiz 10 s, fin 5 s, soit 68 s |
| Animation | Classes CSS d'« idle » : wiggle, bounce, swing… | Personnage articulé, gags scénarisés (`box`, `run`, `bonk`, `rise`, `splash`, `float`, `self`…), caméra (`punch`, `quake`), expressions |
| Audio | Voix macOS `say` (Samantha et Kanya), xylophone synthétisé | Kokoro-82M plus Kanya, bruitages, contrôle Whisper, **bouche synchronisée sur l'enveloppe réelle** de la voix |
| Pipeline | SVG → audio → MP4 | SVG estimé → audio → SVG recalé → MP4 (2 passes) |
| Validation | `validate()` stricte (5 mots, couleurs, aucun script ni animation dans `art`) | 3 contrôles dans `make.mjs` (id, 5 mots, `art` présent) |
| Aperçu rapide | `preview.mjs` (planche en environ 2 s, plus audit) | aucun |

### 2.2 Ce qui est déjà très bien

1. **Une séparation données et gabarit** (kids) : un thème est un JSON. Une IA peut en écrire 100 sans toucher au moteur, et `STYLE.md` sert de brief.
2. **Les dessins passent par `<defs>` et `<use>`** : un dessin est écrit une fois et réutilisé dans la scène et dans le récap.
3. **L'audio pilote l'image** (Mali) : `voice.json`, avec durées et enveloppes, recale la bouche et le minutage. C'est le bon sens de dépendance pour un format parlé.
4. **Le contrat `data-*`** avec le moteur (`data-duration`, `data-fps`, `data-role="hook|final"`) : l'audit sait ce qu'est une accroche.
5. **La sécurité des dessins** (kids) : le filtre interdit `<script>`, `<animate>`, `id`, `class`, `href` et `<image>` dans `art`. Un dessin reste un dessin.
6. **Un hasard déterministe** (Mali, `confetti()` avec un PRNG à graine fixe) : le rendu est reproductible.

### 2.3 Les problèmes

| # | Constat | Où | Gravité |
|---|---|---|---|
| P1 | **Code dupliqué entre les séries** : `RAINBOW`, `INK`, polices, `f()`, `star`, filtre `crayon`, `anim()`, `rainbow()` sont recopiés | `make.mjs:13-19,45-80` et `engine.mjs:9-14,66,257-258` | Haute : chaque correctif doit être fait deux fois |
| P2 | **Dessins prisonniers de leur série** : 505 dessins en ligne dans des JSON, plus des dessins dans les `.mjs` de Mali, sans index, sans nom canonique ni métadonnées (catégorie, couleurs, cadre) | `kids-english-th/themes/*.json` | Haute : c'est l'actif le plus coûteux à produire |
| P3 | **Texte non échappé dans Mali** : `rainbow()` et les bulles injectent le texte tel quel. Un mot avec `&` ou `<` (« Fish & chips ») produit un SVG invalide | `engine.mjs:258` | Moyenne (bug latent) |
| P4 | **Pas de validation de `art` dans Mali** : `<script>`, `id` en conflit ou `@keyframes` dans un dessin passent sans erreur | `make.mjs:13-15` | Moyenne |
| P5 | **Largeur des textes estimée** (`visLen() × k`) au lieu d'être mesurée. Le thaï et ses diacritiques sont approximés à la main | `make.mjs:22-23` | Moyenne : l'audit rattrape, mais après coup |
| P6 | **Polices système macOS** (Chalkboard SE, Sukhumvit Set) non embarquées. Le rendu change sur une autre machine et le SVG n'est pas portable | `make.mjs:16-17`, `engine.mjs:11-12` | Moyenne |
| P7 | **Minutage codé en dur** (`INTRO=5.0`, `SCENE=5.2`…) dans kids, alors que Mali sait se caler sur la voix | `make.mjs:12` | Moyenne : silences ou voix accélérées (`atempo` ≤ 1,35) |
| P8 | **`build()` de Mali est un monolithe de 540 lignes** : état mutable partagé (`lines`, `sfx`, `ev`, `custom`…), constantes non indentées dans la fonction, et un `switch` de gags qui grossit à chaque thème | `engine.mjs:71-614` | Moyenne : difficile à tester, impossible à réutiliser pour un autre personnage |
| P9 | **Aucun test des générateurs.** Seul le moteur est testé. Une régression de gabarit casse 101 vidéos en silence | `test/` | Moyenne |
| P10 | **Aucun contrôle visuel des dessins** : un dessin peut déborder du cadre, être illisible en vignette ou faire peur, et rien ne le détecte | partout | Moyenne |
| P11 | **Deux styles d'audio** (`audio.py` de 122 lignes et de 339 lignes) qui partagent le xylophone, le mixage et `load_wav` | `*/audio.py` | Basse |

---

## 3. Optimisations immédiates (sans changer d'architecture)

Par ordre de rapport gain sur effort :

1. **Créer `src/kit/core.mjs`** avec `f`, `esc`, `INK`, `RAINBOW`, les polices, `star5`, `cloud`, le filtre `crayon`, `anim()` et `rainbow()` (avec échappement). Les deux séries l'importent. Cela règle P1 et P3.
2. **Un `validateArt()` commun** (le filtre de kids) appelé aussi par Mali, pour P4.
3. **Mesurer le texte au lieu de l'estimer.** `preview.mjs` ouvre déjà Chromium : il suffit d'ajouter une passe `getComputedTextLength()` qui écrit les tailles dans un cache `out/<id>/metrics.json`, relu par `make.mjs`. Pour P5, le plus simple est de faire échouer `preview` dès qu'un texte dépasse sa boîte.
4. **Embarquer les polices** : sous-ensemble WOFF2 en base64 dans `<style>@font-face`, avec seulement les glyphes utilisés (`pyftsubset`, environ 10 à 30 Ko). Pour P6, il faut choisir des polices libres équivalentes, par exemple Baloo 2 ou Fredoka pour l'anglais et Sarabun ou Mitr pour le thaï.
5. **Minutage piloté par la voix dans kids**, comme Mali : 2 passes `make → audio → make`. On supprime les `atempo` et les blancs (P7).
6. **Tests « golden »** : pour 3 thèmes témoins par série, on compare l'empreinte du SVG généré et l'audit de `preview` (zéro problème attendu). Ils tournent en moins de 10 s dans `npm test` (P9).
7. **Une planche des dessins dans le studio** : `preview.mjs` produit déjà `-art.jpg`, il suffit de l'afficher dans la fiche de l'élément (P10).

---

## 4. Architecture cible : `svgkit`, une boîte à outils en 5 couches

```
                ┌──────────────────────────────────────────────────────────────┐
  brief ──────► │ 5. FORMATS (gabarits)  pedago · carton · minifilm · quiz ·   │
  (JSON)        │                        data · marque · karaoké               │
                ├──────────────────────────────────────────────────────────────┤
                │ 4. ACTEURS             personnage articulé (rig), caméra,    │
                │                        gags, expressions, lip-sync           │
                ├──────────────────────────────────────────────────────────────┤
                │ 3. TIMELINE            cues → @keyframes ; calage sur la     │
                │                        voix ; scènes ; transitions           │
                ├──────────────────────────────────────────────────────────────┤
                │ 2. BIBLIOTHÈQUE        dessins indexés (art/<cat>/<nom>.svg  │
                │                        + meta), décors, icônes, chartes      │
                ├──────────────────────────────────────────────────────────────┤
                │ 1. PRIMITIVES          esc, f, texte mesuré, polices, filtres,│
                │                        formes (étoile, nuage, bulle, pastille)│
                └──────────────────────────────────────────────────────────────┘
                         │ SVG + cues.json ─► audio (src/kit/audio.py) ─► svgMaker render ─► MP4
                         └─ QA à chaque étage : validateArt · metrics · audit · planche
```

### 4.1 Couche 1 : primitives (`src/kit/core.mjs`, `text.mjs`, `fonts.mjs`)
- `esc`, `f`, `S(stroke)`, palettes nommées (`charte.kids`, `charte.marque`…).
- `text({ str, box, font, min, max })` : taille calculée à partir de **métriques réelles**, avec un cache par police. Il retourne `{ size, lines }` et coupe sur 2 lignes si nécessaire.
- `fonts.embed(usedChars)` : sous-ensemble WOFF2 en base64.

### 4.2 Couche 2 : bibliothèque de dessins (`library/`)
- **Un fichier par dessin** : `library/animals/cow.svg`, dessin centré en (0,0) et tenant dans un carré de ±250.
- **Un index** : `library/index.json` décrit chaque dessin.
  ```json
  { "cow": { "cat": "animals", "tags": ["farm"], "palette": ["#fff", "#3B2A20"], "bbox": [-180, -150, 180, 160],
             "spin": null, "idle": "wiggle", "styles": ["crayon"], "source": "kids-english-th/001", "qa": { "thumb64": "ok" } } }
  ```
- **Migration automatique** : un script extrait les 505 dessins des JSON kids et les dessins Mali vers `library/`. Les thèmes ne gardent plus qu'une clé (`"art": "cow"`). La bibliothèque est immédiatement utilisable par Mali, et inversement.
- **Variantes** : un même dessin en style `crayon` (filtre) ou `flat` (sans filtre, contour fin) pour d'autres séries.

### 4.3 Couche 3 : timeline (`src/kit/timeline.mjs`)
Elle remplace les tableaux mutables de Mali par un objet explicite :
```js
const tl = timeline({ fps: 30 })
tl.scene('intro', { min: 5 })            // durée = max(min, voix + marge)
  .say('narrator', "Let's learn English!")
  .at('+0.2').pop(titleEl)
tl.scene('word-1').after('intro') …
const { css, cues, duration } = tl.compile(voice)   // voice.json optionnel → calage réel
```
- Elle compile en `@keyframes` et en `animation:` sur les calques.
- **Deux passes intégrées** : sans `voice.json`, elle estime ; avec, elle recale.
- `data-duration` est écrit automatiquement.

### 4.4 Couche 4 : acteurs (`src/kit/actors/`)
- `rig.mjs` : un **personnage articulé générique**. Il décrit des parties (tête, oreilles, jambes, bouche), des points d'ancrage et des expressions. Mali devient *une instance* (`actors/mali.mjs`), et un deuxième personnage coûte un fichier, pas un moteur.
- `gags.mjs` : un registre `{ box, run, bonk, rise, splash, float, self }`. Chaque gag est une fonction pure `(ctx, word, t) → { svg, fx, expr, cam }`, testable unitairement.
- `camera.mjs` : `punch`, `quake`, `pan`, `follow`.
- `lipsync.mjs` : enveloppe de la voix → keyframes de bouche (extrait de `mali()`).

### 4.5 Couche 5 : formats (`formats/<nom>/`)
Chaque format, c'est un **schéma JSON** du brief, un **gabarit** (`build(brief, voice) → { svg, cues }`), un **guide de style** (`STYLE.md`, le brief de l'agent) et **3 briefs témoins** pour les tests.

| Format | Description | Origine |
|---|---|---|
| `pedago-words` | 5 mots, carte, voix bilingue, récap | `kids-english-th` |
| `pedago-character` | Personnage qui présente, gags, « Your turn! », quiz | Mali |
| `carton` | Typographie animée : accroche, citation, statistique, carton final, liste | barbato et sitevitrine (RAPPORT-VIDEOS-SVG) |
| `minifilm` | 3 à 6 plans, décor, personnages, caméra, sous-titres, musique | nouveau, sur la base des couches 3 et 4 |
| `quiz` | Question, choix, compte à rebours, révélation, score | quiz Mali généralisé |
| `data` | Barres, courbes, compteurs qui montent, comparaison | nouveau |
| `marque` | Logo animé, offre, appel à l'action, charte client | barbato et terredebienetre |
| `karaoke` | Paroles calées au mot (Whisper), notes | Initi et jordi (méthodes B et D du guide) |

---

## 5. Les sous-agents experts

### 5.1 Principe
- **Un agent par domaine d'expertise.** Chacun a un `.claude/agents/<nom>.md` avec un rôle, des règles, les outils autorisés et un contrat d'entrée et de sortie.
- **Le contrat, c'est du JSON validé par schéma**, jamais de la prose. L'agent suivant ne lit que le JSON.
- **Chaque agent passe un portail automatique** avant de rendre la main : `validate`, puis `preview`, puis `audit`. En cas d'échec, il corrige lui-même, 3 tentatives au maximum.
- **Un agent ne dessine pas et ne code pas le moteur en même temps.** Les dessins vont dans `library/`, la mise en scène dans le brief, et le code dans `src/kit/` (réservé à l'humain ou à un agent « ingénieur »).

### 5.2 Les agents

| Agent | Expertise | Entrée → sortie | Portail qualité |
|---|---|---|---|
| **producteur** (orchestrateur) | Découpe une demande en briefs, choisit le format, répartit le travail | Demande libre → `brief.json` (schéma du format) | Schéma valide, durée cible respectée |
| **pédagogue** | Progression, vocabulaire adapté à l'âge, répétition espacée, consignes de quiz | Thème → liste de mots, traductions, prononciation, quiz | Mots uniques dans la série (index), longueur ≤ N, relecture du thaï par Whisper ou la voix |
| **illustrateur** | Dessins SVG à la charte : formes simples, contours de 12 px, visages souriants, lisibles en vignette 64 px | Liste de noms → `library/<cat>/<nom>.svg` + méta | `validateArt`, bbox dans ±250, planche des dessins, pas de doublon avec l'index |
| **typographe / carton** | Hiérarchie, accroche < 1 s, corps ≥ 26 px, zones sûres, rythme de lecture (environ 3 mots/s) | Textes → brief `carton` | Métriques mesurées sans débordement, audit sans problème |
| **animateur** | Courbes d'accélération, anticipation et rebond, idles, gags, caméra | Brief → choix de gags, idles et `cam` par scène | Aucun mouvement > X px/image, pas de clignotement < 3 Hz (épilepsie), planche |
| **réalisateur mini-film** | Découpage en plans, continuité, valeur des plans, transitions | Synopsis → `shots[]` (décor, acteurs, action, durée, dialogue) | 3 à 6 plans, chaque plan ≥ 2 s, continuité des personnages |
| **sound designer** | Voix, bruitages, musique, mixage −14 LUFS, calage | `cues.json` → `audio.wav` + `voice.json` | Whisper : le texte dit = le texte attendu ; pas de chevauchement de voix ; LUFS |
| **localisateur** | Thaï et autres langues : diacritiques, longueur, politesse, transcription phonétique | Textes source → traductions + `say` | Relecture croisée (LLM et Whisper), longueur visible ≤ case |
| **data designer** | Choix du graphique, échelles honnêtes, annotations | Données → brief `data` | Axes non trompeurs, chiffres lisibles ≥ 2 s |
| **directeur artistique** (relecteur) | Cohérence de la charte sur une série, regarde les planches | Planches → note /10 + corrections ciblées | Note ≥ 8 pour publier, sinon renvoi à l'agent fautif |
| **QA / auditeur** | Contrôles techniques indépendants, sans lien avec l'auteur | SVG + MP4 → rapport | Audit svgMaker, durée, taille, couleurs BT.709, son |

### 5.3 Exemple de définition d'agent (`.claude/agents/illustrateur-svg.md`)
```markdown
---
name: illustrateur-svg
description: Dessine des illustrations SVG pour la bibliothèque svgkit (style enfant, contours épais). À utiliser pour tout nouveau dessin.
tools: Read, Write, Bash
---
Tu dessines UN objet par fichier dans library/<cat>/<nom>.svg.
Règles : centré en (0,0), tient dans un carré de ±250 ; contour #3B2A20 de 10 à 14 px, joints ronds ;
au plus 6 couleurs, prises dans la palette de la charte ; visage souriant si c'est un être vivant ou un objet « mignon » ;
rien d'effrayant ; interdit : script, animation, style, id, class, href, image, text.
Avant de rendre la main : `node svgkit art check <fichier>` (validation, bbox, vignette 64 px).
Corrige jusqu'à ce que la commande ne signale plus rien (3 tentatives au maximum), puis mets à jour library/index.json.
```

### 5.4 Le flux de production d'une vidéo
```
demande ─► producteur ─► brief.json
                │
     ┌──────────┼──────────────┬──────────────┐        (en parallèle)
 pédagogue   illustrateur   localisateur   animateur
     └──────────┼──────────────┴──────────────┘
                ▼
        svgkit build (format) ──► preview + audit ──✗──► renvoi à l'agent concerné
                ▼ ✓
        sound designer ──► svgkit build (recalage voix) ──► svgMaker render
                ▼
        QA + directeur artistique ──✗──► corrections ciblées
                ▼ ✓
             publish
```
Dans Claude Code, ce flux devient un **workflow** : un `agent()` par étape, `parallel()` pour les quatre experts, et des boucles de correction bornées. Pour une série, on traite un lot de briefs avec `pipeline()`, et la bibliothèque de dessins se remplit au fil de l'eau.

---

## 6. Commandes à ajouter à svgMaker

| Commande | Rôle |
|---|---|
| `svgmaker new <format> <brief.json>` | Génère le SVG et `cues.json` depuis un brief |
| `svgmaker preview <brief.json>` | Planche et audit en environ 2 s (généralisation de `kids-english-th/preview.mjs`) |
| `svgmaker art check <fichier.svg>` | Valide un dessin et produit sa vignette 64 px |
| `svgmaker art list [--cat animals]` | Parcourt la bibliothèque (le studio peut l'afficher en grille) |
| `svgmaker art migrate <dossier-thèmes>` | Extrait les dessins en ligne vers `library/` |
| `svgmaker build <brief.json>` | SVG → audio → recalage → MP4 → audit, en une seule commande |

---

## 7. Feuille de route

| Phase | Contenu | Durée estimée | Résultat vérifiable |
|---|---|---|---|
| **0. Hygiène** | `src/kit/core.mjs` partagé ; échappement et `validateArt` dans Mali ; tests golden des 2 séries | ½ jour | `npm test` couvre les générateurs ; SVG identiques avant et après (empreinte) |
| **1. Bibliothèque** | `library/` + index + migration des 505 dessins kids et des dessins Mali ; grille dans le studio | 1 jour | `art list` ≥ 520 dessins ; les thèmes kids ne contiennent plus que des clés ; MP4 inchangés |
| **2. Texte et polices** | Métriques mesurées, polices libres embarquées | 1 jour | Zéro débordement à l'audit des 101 thèmes ; SVG portable |
| **3. Timeline** | `timeline.mjs` ; kids passe au minutage calé sur la voix | 1 à 2 jours | Plus d'`atempo` > 1,1 ; durée des vidéos ajustée à la voix |
| **4. Acteurs** | `rig`, `gags`, `camera` et `lipsync` extraits de Mali ; Mali = instance | 2 jours | Mêmes MP4 Mali (SSIM ≥ 0,99) ; un 2ᵉ personnage en un fichier |
| **5. Formats** | `carton`, `quiz`, `minifilm` (puis `data`, `marque`, `karaoke`) avec schéma, gabarit, STYLE et briefs témoins | 1 jour par format | 3 briefs témoins par format passent preview et audit |
| **6. Agents** | `.claude/agents/*.md` (section 5.2) + un workflow de production | 1 jour | Une vidéo produite de bout en bout depuis une phrase, sans intervention, avec une note DA ≥ 8 |

**Avancement (10 novembre 2026)**

| Phase | État |
|---|---|
| 0 | ✅ `src/kit/core.mjs`, échappement et `validateTheme` dans Mali, tests golden : SVG identiques octet pour octet |
| 1 | ✅ `library/` : 540 dessins, `svgmaker art list/check/add/refresh`, onglet Bibliothèque du studio ; SVG identiques |
| 4 | ✅ `src/kit/actors/` : scène, caméra, synchro labiale, acteur Mali, gags ; `engine.mjs` 600 → 389 lignes ; sorties identiques octet pour octet (6 thèmes, avec et sans voix) ; 6 tests unitaires |
| 5 | ✅ formats `carton`, `quiz`, `minifilm` (`src/formats/`) : validation explicite, 3 briefs d'exemple chacun, aperçus sans alerte ; `svgmaker formats/new/preview`, `src/formats/build.sh` ; texte multiligne équilibré et insécable ; décors `day/night/beach/paper/ink` ; bug corrigé : noms d'animation à virgule (`fall6.6`) qui figeaient les gags |
| 6 | ✅ 8 sous-agents `.claude/agents/svg-*.md` + skill `.claude/skills/produire-video` (orchestration et portails qualité). Formats `data`, `marque`, `karaoke` et agent data designer : non faits |
| 3 | ⏸ en attente d'accord : changerait la durée des 101 vidéos kids et referait toutes les voix |
| 2 | ✅ Fredoka et Mali embarquées, texte mesuré en largeur **et en hauteur d'encre** (`src/kit/text.mjs` : `fitSize`, `fitInBox`) ; audit sans alerte sur les 107 vidéos ; vidéos à refaire |

*Leçon de la phase 2 :* l'audit de svgMaker juge les textes sur leur boîte de police (`getBBox`), pas sur l'encre. Avec Mali, un ton thaï empilé (ตั๊กแตน) dépassait de sa pastille sans alerte ; seul l'aperçu l'a montré. `fitInBox` règle le cas dans les gabarits ; un contrôle d'encre dans l'audit (capture de la zone du texte) reste à faire.

**Ordre conseillé : 0 → 1 → 2, puis 6 sur les formats existants.** Les agents rapportent dès que la bibliothèque et le contrôle qualité existent. On attaque ensuite 3, 4 et 5 au fil des besoins.

---

## 8. Indicateurs de réussite

- **Réutilisation** : part des dessins d'une nouvelle vidéo déjà présents dans `library/`. Objectif > 50 % après 200 dessins.
- **Taux de premier passage** : briefs qui passent preview et audit sans correction. Objectif > 80 %.
- **Temps entre l'idée et le MP4** pour une vidéo d'un format existant. Objectif < 10 min, dont environ 1 min de rendu.
- **Lignes de code par série** : un nouveau format pédagogique doit tenir en un brief JSON et un STYLE.md, **avec zéro ligne de moteur**.
- **Régressions** : zéro MP4 modifié par un refactor sans changement de brief (tests golden).
