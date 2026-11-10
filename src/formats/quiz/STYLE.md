# Format « quiz »

Un titre (accroche), puis 1 à 8 questions. Chaque question suit le même déroulé : la question, 2 à 4 choix (dessins de la bibliothèque et/ou textes), un compte à rebours, la bonne réponse qui brille, les autres qui pâlissent, et une explication. Un carton final avec 3 étoiles conclut. Les bruitages (`whoosh`, `tick`, `ding`, `yay`) sont prévus dans `script.json`.

```bash
svgmaker preview quiz.json
src/formats/build.sh quiz.json      # bruitages + MP4
```

## Brief

```json
{
  "format": "quiz",
  "id": "animal-sounds",
  "theme": "kids",
  "title": "Animal quiz!",
  "sub": "ทายเสียงสัตว์กัน",
  "countdown": 3,
  "questions": [
    { "q": "Who says “moo”?",
      "choices": [{ "art": "cow", "label": "Cow" }, { "art": "pig", "label": "Pig" }, { "art": "duck", "label": "Duck" }],
      "answer": 0,
      "explain": "The cow says moo! · วัวร้องมอ" }
  ],
  "outro": { "text": "Great job!", "sub": "เก่งมาก!" }
}
```

| Champ | Règle |
|---|---|
| `theme` | `kids` (ciel, arc-en-ciel), `warm` (papier crème), `night` (ciel étoilé, lune) |
| `title` / `sub` | accroche (≤ 60 caractères) et sous-titre |
| `countdown` | 2 à 6 s (3 par défaut) ; une question dure `1,6 + countdown + 2,8` s |
| `choices` | 2 à 4 ; chacun a un `art` (id de `library/`) et/ou un `label` (≤ 30 caractères). 2 choix = grandes cartes, 3 = une rangée, 4 = une grille 2×2 |
| `answer` | indice du bon choix (0 = A) |
| `explain` | facultatif : une phrase qui apprend quelque chose (sinon « A · label ») |
| `outro` | carton final (≥ 2,8 s) |

## Écrire un bon quiz

- **Une question = une seule bonne réponse évidente une fois révélée.** Pas de piège sur les mots.
- **Les mauvais choix sont plausibles** et de la même famille (trois animaux, trois fruits).
- **Varie la place de la bonne réponse** d'une question à l'autre.
- Pour les enfants : des dessins, des labels d'un seul mot, une explication bilingue (`EN · TH`).
- Pour les adultes (`warm`) : choix en texte seul, explication qui donne la raison (« Le satiné résiste à l'humidité »).
