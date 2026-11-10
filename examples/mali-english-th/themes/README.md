# Thèmes de Mali

Un thème correspond à un fichier `themes/<id>.mjs`. On fabrique la vidéo avec `./build.sh <id>`, qui produit `out/<id>/mali-<id>.mp4`.

Le moteur (`engine.mjs`) gère tout ce qui est commun : Mali, voix, bouche synchronisée, expressions, caméra, « Your turn! », étoiles, quiz et fin. Un thème ne fournit que **5 mots, leurs dessins et leurs gags**.

```js
import { lib } from '../../../src/kit/library.mjs'

export default {
  id: 'fruits',                                   // = nom du fichier
  title: { en: 'Fruits', th: 'ผลไม้', emoji: '🍌', say: "Let's learn fruits!" }, // say : annonce de Mali (facultatif)
  color: '#F2B705',                               // couleur du bandeau de thème
  words: [                                        // exactement 5 mots
    { en: 'Banana', say: 'บะ-นา-น่า', th: 'กล้วย', art: 'banana', color: '#F2B705',
      gag: { type: 'bonk', sfx: 'bonk' }, sound: 'Bonk!' },
    …
  ],
  art: lib({ banana: 'banana-mali', … }),         // clé du mot → id dans library/ (voir ci-dessous)
  quiz: { answer: 3, choices: [1, 3, 0], q: { en: 'Where is the watermelon?', th: 'แตงโมอยู่ไหนนะ?' } }, // q facultatif
}
```

## Champs d'un mot

| Champ | Rôle |
|---|---|
| `en` | Mot anglais, affiché et dit 3 fois (narrateur, Mali, puis l'enfant). **Un seul mot**, avec la majuscule. |
| `say` | Prononciation écrite en thaï (`อ่านว่า “…”`). |
| `th` | Traduction thaïe, affichée « Cat = แมว » et dite par Mali. |
| `art` | Clé du dessin, dans `art` du thème ou dans `ART_BUILTIN` (cat, dog, apple, sun, fish → `cat-mali`, `dog-mali`… dans `library/`). |
| `color` | Couleur du mot (cadre, pastille). Couleur vive. |
| `gag` | Mise en scène, voir le tableau. Une chaîne (`'bonk'`) ou un objet (`{ type, sfx, … }`). |
| `plural` | `true` pour un mot au pluriel (Ears, Grapes) : la question du quiz devient « Where are the … ? ». |
| `sound` | Texte de la bulle comique près de l'objet (« Meow! », « Beep beep! »). **12 caractères maximum.** |

## Gags (le dessin `art` est l'objet de la scène)

Les gags sont dans `src/kit/actors/gags.mjs` (partagés avec les futurs formats) ; pour en ajouter un, c'est là.

| type | Ce qui se passe | Options |
|---|---|---|
| `box` | L'objet surgit d'un carton, Mali fait un grand saut, yeux écarquillés, zoom. | `scale` (défaut 0,62), `sfx` |
| `run` | L'objet arrive en bondissant de la droite, Mali rit et se secoue. | `scale` (défaut 0,62), `sfx` |
| `bonk` | L'objet tombe sur la tête de Mali (étoiles, yeux en spirale, l'image tremble) puis rebondit à sa place. | `scale` (défaut 0,5), `sfx` |
| `rise` | L'objet se lève derrière une colline. | `glasses: true` (Mali met des lunettes de soleil), `sfx` |
| `splash` | L'objet saute d'une mare et éclabousse Mali. | `bubble: false` (pas de bulle d'eau), `scale`, `sfx` |
| `float` | L'objet descend du ciel accroché à un ballon, Mali lève la tête et rit. | `balloon` (couleur), `scale`, `sfx` |
| `drive` | L'objet arrive en glissant avec un bruit de moteur et un « bip bip », de la fumée ; Mali recule, surprise. | `scale`, `sfx` (défaut `vroom`) |
| `fly` | L'objet traverse le ciel en arc puis se pose, Mali le suit des yeux. | `scale`, `sfx` |
| `self` | Partie du corps : l'objet s'affiche dans une carte, et **la même partie sur Mali** est entourée et bouge. | `part` : `nose` (trompe qui s'agite), `ears` (oreilles déployées), `eyes`, `mouth`, `feet` (elle saute), `tail` |
| `pop` | L'objet apparaît dans une gerbe d'étincelles, Mali danse. | `scale`, `sfx` |

Varier les gags dans un thème : au moins 4 types différents sur les 5 mots.

**Bruitages (`sfx`)** : `step boing pop meow woof bonk splash sparkle cool tick drumroll ding yay whoosh collect giggle moo oink quack cluck neigh beep toot vroom`.

## Dessins (`art`)

Les dessins sont dans la bibliothèque partagée `library/` (onglet **Bibliothèque** du studio, ou `node ../../bin/svgmaker.mjs art list --tags mali`). Ceux dans le style de Mali portent le suffixe `-mali` (`cow-mali`) ; ceux sans suffixe viennent de la série kids-english-th et marchent aussi (`art: lib({ giraffe: 'giraffe' })`).

Nouveau dessin : écris-le (ou génère-le avec un petit script qui utilise `S()` et `face()` de `engine.mjs`) dans un fichier, puis
`node ../../bin/svgmaker.mjs art add <nom>-mali <fichier.svg> --cat <catégorie> --tags mali`. `make.mjs` refuse un dessin qui contient un script, une animation, un style, un `id` ou une `class`.

- Chaque dessin est une chaîne SVG **centrée en (0,0)**, qui tient dans un rayon d'environ **200 px** (le moteur le réduit selon le gag, entre ×0,3 et ×0,75).
- **Style imposé** : dessin d'enfant au crayon.
  - Contours épais `${S()}`, encre `#3B2A20`, épaisseur 12 ; `${S(8)}` pour les détails.
  - Aplats de couleurs vives, pas de dégradés, formes rondes et simples.
  - Un reflet blanc semi-transparent pour le volume.
- **Les objets ont souvent un visage souriant** (`${face(dy)}`, centré en x = 0, environ 170 px de large). Les animaux ont leurs propres yeux, nez et joues roses `#FF8FA3`.
- Pour un élément qui tourne derrière l'objet (rayons, hélice…), ajouter un dessin `<clé>Spin` : il tournera derrière `<clé>`.
- Ne pas utiliser `<text>` dans les dessins (l'audit vérifie les textes).
- Ne pas mettre d'`id` dans les dessins, ni d'animation CSS sur un élément qui a un attribut `transform` : l'animation écraserait l'attribut. Mettre la position sur un `<g>` parent.

## Options du thème

- `wordColor: 'own'` : le mot s'écrit dans sa couleur `w.color` au lieu de l'arc-en-ciel (indispensable pour le thème des couleurs).

## Quiz

`quiz.choices` contient 3 indices de mots, dont la réponse `quiz.answer`. La question par défaut est « Where is the <mot>? » et « <th>อยู่ไหนนะ? ». `q` la remplace (pour les couleurs : « Where is red? »).

## Vérifier

```bash
JOBS=2 ./build.sh <id>
```

Le résultat doit afficher **« audit : OK »** et **« réparation : n/n »**, ou aucune ligne ⚠ [en]. Ensuite, regarder les images :

```bash
ffmpeg -v error -ss <t> -i out/<id>/mali-<id>.mp4 -frames:v 1 -vf scale=360:-2 /tmp/x.png
```

Repères de temps : intro de 0 à 8 s ; mot `i` de 8 + 9i à 17 + 9i s (le gag joue pendant les 2 premières secondes) ; quiz à 53 s ; fin à 63 s.

Le contrôle Whisper n'affiche qu'un avis (ℹ) pour le thaï, qui n'est pas fiable sur un mot isolé. Ce n'est pas une erreur.
