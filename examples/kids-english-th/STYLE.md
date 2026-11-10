# Série « 5 English words » : guide pour écrire un thème

Chaque vidéo est un fichier `themes/NNN-slug.json`. Le gabarit (intro, cartes, voix, musique, récapitulatif) est commun ; **toi, tu fournis les mots, les traductions et les 5 dessins.**

Public : enfants thaïlandais d'environ **4 ans**. Tout doit être immédiatement reconnaissable, gai et doux, sans rien d'effrayant.

## Format du fichier

```json
{
  "id": "001-farm-animals",
  "theme": { "en": "Farm animals", "th": "สัตว์ในฟาร์ม", "voiceTh": "สัตว์ในฟาร์ม" },
  "words": [
    {
      "en": "Cow",
      "say": "คาว",
      "th": "วัว",
      "color": "#8E5BD9",
      "idle": "wiggle",
      "art": "cow",
      "spin": "(facultatif) id d'un dessin qui tourne sans fin DERRIÈRE le dessin, ex. « sun-spin »",
      "bubbles": false
    }
  ]
}
```

| Champ | Règle |
|---|---|
| `id` | `NNN-slug`, exactement celui qui t'est attribué ; le fichier s'appelle `themes/<id>.json` |
| `theme.en` | nom du thème en anglais, court : 25 caractères maximum |
| `theme.th` | nom du thème en thaï, affiché à l'écran |
| `theme.voiceTh` | (facultatif) version prononcée par la voix thaïe dans « มาเรียนคำศัพท์ หมวด… กัน! » |
| `en` | le mot anglais, première lettre en majuscule (« Ice cream », « Traffic light ») |
| `say` | prononciation anglaise **écrite en thaï**, comme dans les livres pour enfants thaïs : แค็ท, ด็อก, แอ๊ป-เปิ้ล, ซัน, ฟิช. Tiret entre les syllabes si le mot en a plusieurs |
| `th` | le mot thaï naturel qu'un parent dit à un enfant de 4 ans : หมา plutôt que สุนัข, แม่ plutôt que มารดา |
| `color` | couleur vive `#RRGGBB` du cadre et de la pastille, **différente pour les 5 mots** et assortie au dessin |
| `idle` | petit mouvement en boucle du dessin : `wiggle` (penche), `bounce` (saute), `swing` (balance), `swim` (nage), `pulse` (gonfle), `float` (flotte), `spin` (tourne un peu dans les deux sens) |
| `art` | **id d'un dessin de la bibliothèque** `library/` (« cow », « ice-cream »). Un fragment SVG en ligne (commençant par `<`) est encore accepté, mais un dessin réutilisable va dans la bibliothèque |
| `spin` | (facultatif) id d'un dessin qui tourne en continu autour de (0,0), placé **derrière** `art` : rayons, pétales, auréole. Convention : `<id>-spin` |
| `bubbles` | (facultatif) `true` = 3 bulles qui montent (animaux marins) |

## Bibliothèque de dessins (`library/`)

Les dessins vivent dans `library/<catégorie>/<id>.svg` (un fichier par dessin, visible tel quel dans un navigateur et dans l'onglet **Bibliothèque** du studio). Avant de dessiner, **cherche s'il existe déjà** :

```bash
node ../../bin/svgmaker.mjs art list cow          # par nom
node ../../bin/svgmaker.mjs art list --cat fruits  # par catégorie
```

Pour un nouveau dessin : écris le fragment SVG (règles ci-dessous) dans un fichier, puis

```bash
node ../../bin/svgmaker.mjs art add giraffe /chemin/giraffe.svg --cat wild-animals --tags kids
```

`art add` valide le dessin, l'enregistre et met `library/index.json` à jour. Les id sont en minuscules avec des tirets (`traffic-light`). Le suffixe `-mali` est réservé aux dessins dans le style de Mali.

## Règles de dessin (`art` et `spin`)

- Fragment SVG **statique** centré sur **(0,0)**. Tout doit tenir dans le carré **-230…230** sur les deux axes ; vise environ ±200 pour que le dessin remplisse bien la carte.
- Contour **#3B2A20** (brun encre), `stroke-width` de **12** pour les formes principales et de 6 à 9 pour les détails. Toujours `stroke-linejoin="round" stroke-linecap="round"`.
- **Aplats de couleurs vives et franches**, sans dégradé ou presque. Un reflet blanc semi-transparent (`opacity=".5"`) donne du volume.
- **Style dessin d'enfant mignon** : formes rondes et simples, grosses têtes, yeux ronds noirs avec un petit point blanc, joues roses (`#FF8FA3`, `opacity=".7"`), sourire. Les objets peuvent avoir un visage (pomme, soleil, nuage…), sauf si ça gêne la compréhension (les chiffres, les formes, les couleurs…).
- **Lisibilité d'abord** : un enfant doit reconnaître le mot en 1 seconde, sans lire. Montre l'élément typique (girafe = long cou + taches ; tuk-tuk = 3 roues + toit).
- Concepts abstraits (couleurs, nombres, actions, émotions, positions, politesse) : montre-les avec un enfant-bonhomme rond et souriant, des objets ou des quantités.
  - « Three » = 3 pommes ou 3 doigts, et éventuellement le chiffre 3 dessiné en grosse forme.
  - « Red » = un gros pot de peinture rouge, ou un ballon rouge.
  - « Under » = un chat sous une table.
  - « Hello » = enfant qui fait coucou.
- **Interdit** (refusé par `make.mjs`) : `<script>`, `<animate>`, `<set>`, `animation`, `@keyframes`, `<style>`, attributs `id=` et `class=`, `href=`, `<image>`, `<foreignObject>`. Les dégradés sont donc impossibles (ils demandent un `id`) : utilise des aplats.
- `<text>` est autorisé seulement pour un chiffre ou une lettre **dessinés comme élément du dessin**, en grand (au moins 60), avec `font-family="Fredoka, Chalkboard SE, sans-serif"` (police embarquée). Jamais pour répéter le mot : il est déjà écrit sous la carte.
- Rien d'effrayant ni de violent : pas d'armes, de sang ou de dents pointues menaçantes. Requin, crocodile, monstre, dragon et loup doivent être **gentils et souriants**.
- Échappe les guillemets dans le JSON (`\"`). Un fichier JSON par thème, encodé en UTF-8.

L'exemple de référence est `themes/000-first-words.json` (chat, chien, pomme, soleil avec `spin`, poisson avec `bubbles`). Lis-le avant de commencer : c'est le niveau de qualité attendu.

## Vérification (obligatoire pour chaque thème)

```bash
cd ~/Desktop/Coding/svgMaker/examples/kids-english-th
node preview.mjs themes/001-farm-animals.json
```

La commande :
- valide le JSON et les règles ci-dessus ;
- produit `out/<id>/<id>-preview.jpg` (intro, 5 cartes, récapitulatif) et `out/<id>/<id>-art.jpg` (les 5 dessins en grand) ;
- lance l'audit svgMaker.

**Ouvre les deux images avec l'outil Read et regarde-les vraiment.** Pour chaque dessin, vérifie :
- qu'il est reconnaissable ;
- qu'il n'est ni coupé ni débordant du cadre ;
- que les traits et les couleurs sont dans le style ;
- que le texte thaï est lisible.

Corrige et relance jusqu'à obtenir **✓ sans alerte**, avec des dessins dont tu es fier.

Ne lance **ni** `audio.py` **ni** `svgmaker render` : la voix et le rendu vidéo sont faits ensuite pour les 100 vidéos d'un coup.
