# Format « dialogue » : personnages qui parlent

Un Reel 9:16 (1080×1920, 30 i/s) en **plans** (1 à 12) : des personnages dessinés (poses de `library/`) dont la **bouche suit l'enveloppe réelle de leur voix**, des accessoires animés, des gags, une caméra, du texte à l'écran, des sous-titres dans la zone sûre, un mode quiz et un carton final. Un narrateur (voix off) n'a pas de corps : son sous-titre a un style distinct.

```bash
svgmaker preview film.json              # SVG + planche + audit (≈ 3 s) : REGARDER la planche
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
| `props` | `{ art, x, y, size, flip?, at?, enter?, exit?, idle?, anims?, parts?, layer? }` : `enter` = `pop drop rise fly fade stamp grow none` ; `exit` = `"fade"\|"pop"\|"fly"\|"drop"` ou `{ do, at }` ; `idle` = `wiggle bounce pulse` ; `anims` = `[{ do, at, dur?, k?, k0? }]` avec `do` = `pop drop rise fly stamp fade grow shrink wiggle bounce pulse` (`k` = échelle cible de grow/shrink/pulse) ; `layer: "front"` = devant les acteurs |
| `props[].parts` | anime une **partie** d'un dessin (`data-part`) : `{ part, do, at, dur?, every?, loop?, origin?, k? }` ; `part` accepte `*` (`"book-*"`, avec `every` = décalage entre parties), `do` = `pop appear vanish pulse wiggle shrink grow drain fill stamp`, `origin` = `center\|bottom\|top` (sable : `drain`/`fill` avec `origin: "bottom"`). Partie introuvable : avertissement |
| `gags` | déclaratifs : `{ type: "shock", who, at }` (pose surprise + saut + secousse), `{ type: "bonk", who, art, at }` (un objet tombe sur la tête), `{ type: "stamp", who, text, at, color? }` (lettre d'imprimerie tamponnée sur le personnage, reste jusqu'à la fin du plan ; position `cast.<id>.badge`), `{ type: "burst", x, y, at }` (gerbe d'étincelles) |
| `camera` | `{ at, dur, zoom, x, y }` (zoom bref qui revient), `{ at, dur, quake }` (tremblement), `{ at, dur, to: { zoom, x, y }, from?, ease? }` (travelling, pan, zoom qui reste jusqu'à la fin du plan ; `ease: "linear"` pour un mouvement lent). Le cadre est borné au décor |
| `texts` | `{ kind, text, at, dur?, y? }` : `title` (gros, ≤ 2 lignes), `date` (cartouche parchemin), `label` (pastille sombre), `countdown` (`{ at, from: 3, step: 1 }` : 3-2-1 en chiffres). Les textes simultanés s'empilent sous la zone haute masquée. **Le plan 1 a un `title` avant 0,6 s** (accroche écrite, vérifiée par l'audit) |
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
"quiz": { "at": 0.3, "cdAt": 1.9, "countdown": 3, "step": 0.7, "correct": 1, "zoom": 1.15, "y": 820,
          "cards": [{ "art": "scribe" }, { "art": "printing-press" }, { "art": "knight" }] }
```

Trois cartes (`quiz-card` + dessin + lettre A/B/C dessinée dans la pastille), compte à rebours (`countdown` chiffres de `step` s chacun, à partir de `cdAt`), puis **révélation** : la bonne carte s'éclaire (`data-part="glow"` de `quiz-card`, éteint avant, + pulsation), les autres s'assombrissent ; `zoom` recadre sur la bonne carte. Centres des cartes : x = 197, 540, 883 ; y = `y` (800). La question et les réponses parlées sont de simples `lines` ; la révélation tombe à `cdAt + countdown × step`.

## Contrat et audit

- Même contrat que les autres formats : polices embarquées, aucun script, aucune image externe, durée en `data-duration`. **Les lettres et chiffres sont des `<text>` des polices embarquées** (comme le carton), jamais des polices système.
- `svgmaker audit` / `preview` vérifient en plus : accroche lisible avant 1 s, carton final ≥ 2,8 s, texte dans la zone sûre (sous-titres bornés à y ≤ 1470, hors bandes Reels/TikTok), textes superposés, et **aucun acteur coupé** par le bord (un acteur immobile à moitié hors cadre ; `bleed: true` pour un gros plan voulu). Attention : un zoom de caméra qui rogne un acteur est signalé aussi.
- Dessins absents ou parties introuvables : **cadre de remplacement + avertissement** (`svgmaker new/preview` les affiche ; `info.warnings`), jamais une erreur. Les erreurs de brief (champ manquant, personnage inconnu) sont explicites.
- Bruitages proposés dans `script.json` (`sfx` : pop, boing, whoosh, bonk, sparkle, tick, drumroll, ding) ; `script.lines` = `{ t, role, who, text }` pour la production des voix.

## Écrire de bons dialogues

- Répliques courtes (≤ 6 mots), une voix à la fois, nombres en lettres ; **une chose qui bouge par plan** (gag, entrée d'un accessoire).
- Garder acteurs et accessoires dans la zone sûre (y de 220 à 1500) ; les sous-titres occupent y 1340–1470, donc pieds des acteurs au-dessus de ~1330.
- Un zoom de caméra rogne les bords : prévoir de la marge autour des acteurs.
