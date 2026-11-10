# Format « minifilm » : une petite histoire avec Mali

1 à 8 **plans**. Chaque plan a un décor, Mali (qui marche, parle, réagit), des accessoires de la bibliothèque, un gag éventuel, des mouvements de caméra et des répliques sous-titrées. Les voix sont réelles (Kokoro en anglais, Kanya en thaï) et la bouche de Mali suit sa voix.

```bash
svgmaker preview film.json                 # planche + audit (voix estimées)
src/formats/build.sh film.json             # SVG → voix (audio.py) → SVG recalé → MP4
```

## Brief

```json
{
  "format": "minifilm",
  "id": "mali-sunny-day",
  "title": { "en": "Mali's sunny day", "th": "วันแดดดีของมะลิ" },
  "shots": [
    { "duration": 6, "set": "day", "mali": { "x": 300, "move": "walk" },
      "props": [{ "art": "sun-mali", "x": 850, "y": 800, "size": 420, "enter": "rise", "at": 0.6 }],
      "lines": [{ "at": 2.6, "role": "mali_en", "text": "What a sunny day!" }],
      "actions": [{ "at": 2.4, "do": "wave", "eyes": "happy", "mouth": "laugh" }],
      "camera": [{ "at": 0.8, "dur": 1.6, "k": 1.1 }] },
    { "duration": 6, "gag": { "type": "bonk", "art": "apple-mali", "at": 0.6, "sfx": "bonk" },
      "lines": [{ "at": 2.6, "role": "mali_en", "text": "Ouch! An apple!" }] }
  ],
  "end": "The end"
}
```

| Champ | Règle |
|---|---|
| `title` | `en` (accroche, affichée les 3 premières secondes), `th` facultatif |
| `shots[].duration` | 2 à 15 s ; **le dernier plan dure au moins 4,5 s** (carton de fin) |
| `set` | `day`, `night`, `beach`, `paper`, `ink` ; un plan sans `set` garde celui du précédent |
| `mali.x` | 120 à 700 (Mali regarde à droite, l'action se passe à sa droite) |
| `mali.move` | `walk` (marche jusqu'à `x`, **vers la droite seulement**), `cut` (replacée d'un coup, changement de plan), `stay`, `walk-out` (sort à droite à la fin du plan) |
| `lines` | `{ at, role, text }` ; `role` = `narrator`, `mali_en`, `mali_th` ; ≤ 70 caractères. Une réplique attend la fin de la précédente : les voix ne se chevauchent jamais |
| `actions` | `{ at, do, eyes, mouth, dur, sfx }` ; `do` = `wave`, `point`, `dance`, `shake`, `tilt`, `lean`, `listen`, `glasses`, `dizzy`, `hop`, `bigjump` ; `eyes` = `happy`, `wide`, `dizzy`, `squint` ; `mouth` = `o`, `laugh` |
| `props` | `{ art, x, y, size, enter, idle, at }` ; `enter` = `pop`, `drop`, `fly`, `rise`, `none` ; `idle` = `wiggle`, `bounce`, `swing`, `swim`, `none` |
| `gag` | `{ type, art, at, x, y, sfx, … }` : les gags de Mali (`box`, `run`, `bonk`, `rise`, `splash`, `float`, `drive`, `fly`, `self`, `pop`), voir `examples/mali-english-th/themes/README.md` |
| `camera` | `{ at, dur, k, x, y }` (zoom, vers Mali par défaut) ou `{ at, dur, quake: 14 }` (tremblement) |
| `end` | texte du carton de fin (« The end » par défaut) |

Bruitages possibles (`sfx`) : `step boing pop meow woof bonk splash sparkle cool tick drumroll ding yay whoosh collect giggle moo oink quack cluck neigh beep toot vroom`.

## Écrire un bon mini-film

- **Une histoire = une situation, un problème ou une surprise, une fin.** 3 à 5 plans de 5 à 7 s.
- **Une réplique courte par moment** (3 à 6 mots). Une réplique en anglais puis sa version thaïe, pour les enfants.
- **Chaque plan a UNE chose qui bouge vraiment** (gag, entrée d'un accessoire, action de Mali) ; la caméra souligne ce moment.
- Les accessoires viennent de `library/` ; les dessins `-mali` sont dans le style du personnage.
