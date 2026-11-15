# Format « carte » : reel géographique (style « maps »)

Une carte qui **zoome de scène en scène**, des régions qui se colorent, des villes épinglées, un mot ou un chiffre en gros. Carte disponible : la **Suisse** (26 cantons, 143 districts, lacs), colorée par langue.

C'est un reel **interactif** : une mascotte (la marmotte) raconte à la voix (Ming, voix inventée « guide »), pose des **questions avec décompte 3-2-1 et révélation** (confettis, bonne réponse en vert), fait **répéter les mots** (« Dis-le avec moi ! ») et finit par une **révision éclair** et un appel à commenter son score. Bruitages (whoosh, pop, tick, ding, tada) et musique de marimba qui s'efface sous la voix.

```bash
svgmaker preview mon-brief.json                          # planche + audit en 2 s
src/formats/build.sh mon-brief.json                      # voix + musique + MP4 + audit (comptez 3 à 6 min la 1re fois : les voix sont ensuite en cache)
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
| `say` | ce que dit la mascotte : `"texte"`, `["phrase 1", "phrase 2"]`, ou `{ "ask": […], "answer": […] }` pour une question. La **durée de la scène suit la voix**. Écrire les mots étrangers en **phonétique française** (« Grüétsi », « Bouonne-djorno », « Allégra ») et les nombres en toutes lettres au-delà de 59 |
| `choices`, `answer` | **question** : 2 ou 3 choix (≤ 18 caractères) et l'index du bon. Décompte de 3 s, puis `highlight`, `pins`, `word` ou `stat` apparaissent **à la révélation** (un mot ou un chiffre, pas les deux) |
| `words` | révision : 2 à 4 pastilles colorées `{ text, lang, at? }` qui apparaissent quand la mascotte les dit |
| `at` | sur `highlight`, `word`, `stat`, `words[]` : secondes depuis le début de la scène, ou `{ "line": n, "d": décalage }` = début de la n-ième réplique (calage image-voix) |
| `duration` | durée minimale (la voix peut l'allonger) |

**Langues** : `de`, `fr`, `it`, `rm` (romanche), `bi` (districts bilingues allemand-français : Bienne et le Lac). **Cantons** : codes officiels `GE`, `VD`, `GR`… **Villes** : voir `CITIES` dans `format.mjs`.

## Écrire un bon reel « maps »

- **Une idée par scène**, 6 à 10 mots en grand. La caméra doit « raconter » : on zoome sur ce dont on parle.
- **Accroche = tension** : « 4 langues dans un si petit pays », jamais « Bonjour ».
- **Les chiffres sont des ordres de grandeur** (allemand 62 %, français 23 %, italien 8 %, romanche 0,5 % des habitants, OFS 2022) : à vérifier avant publication.
- La carte colore la **langue dominante par district** (régions pour les Grisons). C'est un schéma pédagogique, pas la limite exacte des langues commune par commune.
- **Pédagogie efficace** : poser la question **avant** la réponse (le cerveau retient mieux ce qu'il a cherché), faire **répéter à voix haute** un mot, **réviser à la fin** ce qui a été appris, et finir par un défi (« écris ton score »).
- Rythme : une question toutes les 2 scènes d'information. Phrases de la mascotte courtes (≤ 12 mots). Durée visée : 45 à 65 s.

## Voix et bande son

`build.sh` lance `audio.py` **deux fois** : la durée des scènes dépend de la voix réelle (voice.json), donc on mixe, on reconstruit le SVG avec les vraies durées, puis on remixe. Les voix utilisent `examples/renard-lapin/lib/voix.py` (Ming-3.0, MIT, cache dans `~/.cache/svgmaker-voix`) ; la voix de référence `guide` s'invente avec `ming_design.py guide`. Ming contrôle chaque réplique par Whisper (5 prises maximum). `VOIX=kokoro` donne le secours Kokoro. Les mots étrangers ne sont lus qu'**approximativement** (modèle français) : ajuster l'écriture phonétique.

## Données

`src/kit/geo/ch.json` est généré par `scripts/build-geo-ch.mjs` à partir du paquet npm `swiss-maps` (swisstopo / OFS, licence dans `src/kit/geo/LICENSE-swiss-maps`). Aucun accès réseau au rendu.
