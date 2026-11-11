# Format « carte » : reel géographique (style « maps »)

Une carte qui **zoome de scène en scène**, des régions qui se colorent, des villes épinglées, un mot ou un chiffre en gros. Carte disponible : la **Suisse** (26 cantons, 143 districts, lacs), colorée par langue. Pas de voix : on peut ajouter une musique au rendu.

```bash
svgmaker preview mon-brief.json                          # planche + audit en 2 s
src/formats/build.sh mon-brief.json --music musique.wav  # MP4
```

## Brief

```json
{
  "format": "carte", "id": "suisse-4-langues", "theme": "night",
  "brand": { "name": "La Suisse en cartes", "color": "#E5322D" },
  "scenes": [
    { "type": "hook", "text": "La Suisse parle 4 langues.", "sub": "26 cantons.", "flag": "ch" },
    { "type": "map", "text": "Le français : la Romandie.",
      "highlight": { "langs": ["fr"] }, "pins": ["Genève", "Lausanne"],
      "word": { "text": "Bonjour", "lang": "fr" }, "stat": { "value": "23 %", "label": "des habitants", "lang": "fr" } },
    { "type": "final", "text": "Suis-moi !", "sub": "Une carte à chaque reel" }
  ]
}
```

| Champ | Règle |
|---|---|
| `theme` | `night` (bleu nuit, défaut) ou `paper` (papier crème) ; `brand.color` remplace l'accent |
| `scenes[0]` / `scenes[-1]` | toujours `hook` (accroche lisible avant 1 s) et `final` (≥ 2,8 s) |
| `text`, `sub` | texte du haut (≤ 120 / 80 caractères) |
| `focus` | cadrage de la caméra : `"all"` (toute la Suisse) ou `{ langs, cantons, districts }`. Par défaut : les zones mises en évidence |
| `pad` | marge autour du cadrage (0,12 par défaut ; 1,6 pour un petit canton comme Genève) |
| `highlight` | une sélection ou une liste de sélections `{ langs \| cantons \| districts, color?, at?, keep? }` : balayage de gauche à droite. `keep: false` : la couleur disparaît à la fin de la scène |
| `pins` | villes : `"Genève"` ou `{ city, side: t\|b\|l\|r }` ou `{ label, at: [lon, lat] }` |
| `word` | `{ text, lang }` : le mot en gros (« Bonjour »), couleur de la langue |
| `stat` | `{ value, label, lang }` : pastille de chiffre (≤ 10 caractères) |
| `legend` | `true` : légende des 4 langues |
| `flag` | `"ch"` : drapeau suisse dessiné |
| `duration` | calculée sur la lecture ; à ne fixer que pour un rythme voulu |

**Langues** : `de`, `fr`, `it`, `rm` (romanche), `bi` (districts bilingues allemand-français : Bienne et le Lac). **Cantons** : codes officiels `GE`, `VD`, `GR`… **Villes** : voir `CITIES` dans `format.mjs`.

## Écrire un bon reel « maps »

- **Une idée par scène**, 6 à 10 mots en grand. La caméra doit « raconter » : on zoome sur ce dont on parle.
- **Accroche = tension** : « 4 langues dans un si petit pays », jamais « Bonjour ».
- **Les chiffres sont des ordres de grandeur** (allemand 62 %, français 23 %, italien 8 %, romanche 0,5 % des habitants, OFS 2022) : à vérifier avant publication.
- La carte colore la **langue dominante par district** (régions pour les Grisons). C'est un schéma pédagogique, pas la limite exacte des langues commune par commune.
- Durée visée : 30 à 55 s.

## Données

`src/kit/geo/ch.json` est généré par `scripts/build-geo-ch.mjs` à partir du paquet npm `swiss-maps` (swisstopo / OFS, licence dans `src/kit/geo/LICENSE-swiss-maps`). Aucun accès réseau au rendu.
