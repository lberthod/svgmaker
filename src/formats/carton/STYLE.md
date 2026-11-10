# Format « carton » : typographie animée

Une suite de **cartons plein écran** (2 à 12) : une accroche, des idées, un carton final. C'est le format des astuces, des chiffres clés, des listes et des offres. Il n'a pas de voix ; on peut ajouter une musique au rendu.

```bash
svgmaker preview mon-brief.json      # planche + audit en 2 s
src/formats/build.sh mon-brief.json --music musique.wav   # MP4
```

## Brief

```json
{
  "format": "carton",
  "id": "astuce-peinture",
  "theme": "warm",
  "brand": { "name": "Votre atelier peinture", "color": "#C2410C" },
  "cards": [
    { "type": "hook", "text": "Même mur. Deux résultats.", "sub": "La différence tient en 10 minutes." },
    { "type": "text", "text": "Sans sous-couche, la peinture finit par s’écailler.", "art": "paint" },
    { "type": "stat", "value": "3×", "text": "plus durable avec une sous-couche" },
    { "type": "list", "title": "Les 3 étapes", "items": ["Lessiver", "Poncer", "Sous-couche"] },
    { "type": "quote", "text": "…", "by": "…" },
    { "type": "final", "text": "Un devis en 24 h", "sub": "Écrivez-nous en message privé" }
  ]
}
```

| Champ | Règle |
|---|---|
| `id` | minuscules, chiffres, tirets ; nom des fichiers produits |
| `theme` | `warm` (papier crème, encre brune), `night` (bleu nuit, texte blanc), `kids` (ciel pastel, accroche arc-en-ciel, dessins au crayon) |
| `brand` | facultatif : `color` remplace la couleur d'accent ; `name` s'affiche dans une pastille sur le carton final |
| `cards[0]` | toujours `hook` : l'accroche, lisible avant 1 s (l'audit le vérifie) |
| `cards[-1]` | toujours `final` : affiché au moins 2,8 s (l'audit le vérifie) |
| `type` | `hook`, `text`, `stat` (`value` ≤ 12 caractères, très gros), `list` (`title`, 2 à 5 `items`), `quote` (`text`, `by`), `final` |
| `sub` | sous-titre en couleur d'accent ou en gris doux |
| `art` | facultatif : id d'un dessin de `library/` (`svgmaker art list`), affiché au-dessus du texte |
| `duration` | facultatif : la durée est calculée sur la lecture (environ 3 mots/s) ; à ne fixer que pour un rythme voulu |

## Écrire de bons cartons

- **Une idée par carton.** 4 à 10 mots en grand. Si une phrase passe 15 mots, coupe-la en deux cartons.
- **L'accroche crée une tension** : contraste (« Même mur. Deux résultats. »), question, chiffre surprenant. Jamais « Bonjour » ni le nom de la marque.
- **Le chiffre (`stat`) est concret** : « 3× », « 90 min », « 18 °C ». L'explication va dans `text`.
- **Le carton final demande UNE action** claire (« Demandez un devis », « Enregistre ce rappel »).
- Le texte est mesuré avec la vraie police (Fredoka, Mali pour le thaï) : taille et coupures sont automatiques et équilibrées ; « 18 °C », « 24 h » et « nuit ! » ne sont jamais coupés.
- Caractères : latin (accents compris) et thaï. Les emoji passent par la police du système.
