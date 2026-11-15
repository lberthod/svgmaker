# Bible — « Empires disparus » (`empires`) · v2, 13/11/2026 (après panel : 7, 7, 7, 7, 6/10)

**Promesse.** En 80 secondes : comment un empire est né, jusqu'où il est allé, pourquoi il est tombé, et ce qu'il en reste aujourd'hui, dans la vie d'un enfant de 12 ans (un mot, une ville, une langue, une frontière).
**Ton.** Épique mais sobre : la montée, l'apogée, la chute, la trace. Faits datés et sourcés, aucune glorification.

## Signature (champs de brief)
1. **Image 0 = la promesse** : le hook montre déjà le contour violet de l'apogée (`line` fermée, `color: "#A77BE0"`, `at: 0`) et un `beacon` sur la capitale ; le champ `open: { box }` = la `focus.box` du hook : la première et la dernière image montrent ce cadrage, pas l'Europe vide.
2. **Une couleur d'empire par épisode**, la seule couleur vive à l'écran : `#C8372D` rouge, `#3F8FE0` bleu, `#D9487A` rose, `#E8823A` orange, `#9E2A4F` bordeaux, `#2F6FD6` bleu roi (vert `#2E9E5B` seulement hors des plaines ; jamais turquoise, brun, jaune ni violet). Rivaux et voisins : gris `#8A93A8`.
3. **Le territoire grandit en 3 temps** (naissance, conquête, apogée ; la conquête tient en 1 à 3 scènes), avec `highlight.area` (polygone libre [lon, lat], disponible) ou `regions`, jamais un pays actuel entier si l'empire n'en tenait qu'une partie. `note` : « Contours approximatifs ». Une flèche `moves` (couleur d'empire) au moins une fois.
4. **Le violet `#A77BE0` (accent du site) est réservé à l'apogée** : contour au hook, surface à la scène d'apogée (titre « À son apogée », `year`), contour au final. Nulle part ailleurs.
5. **Arts** (3 au moins, une scène sans art entre deux arts) : (a) apogée en repère d'enfant, « environ N fois la France », durées en siècles ou générations (`stats`, `bars`, `big` ou `crowd`, jamais le même que l'épisode précédent) ; (b) `timeline` **Naissance / Apogée / Chute / Aujourd'hui**, 4 lignes, 5 s au plus, préparée par des `pills` datées au fil du reel ; (c) un art libre (`split`, `languages`, `compare`, `treaty`, `profile`).
6. **Final « Ce qu'il en reste »** : carte d'aujourd'hui (`base`), contour violet fermé (même polygone que l'apogée, 30 points au plus), une trace concrète dite avec un exemple (« algèbre », « Marseille », l'alphabet cyrillique…), `note` : « Contour approximatif, frontières d'aujourd'hui ».

**Variantes.** *Empire de comptoirs* (Grecs, Venise, Gênes, Hanse, Portugal, Pays-Bas) : apogée et final en `pills` + `line` des routes en violet, pas de surface. *Empire très large* (> 60° de long : Mongols, Charles Quint, britannique, colonial français, décolonisation) : 2 ou 3 `focus.box` qui glissent d'ouest en est, un seul planisphère (apogée). *Hooks* : 4 types en rotation (jamais deux fois de suite) : capitale serrée + personnage ; planisphère dézoomé ; `big` chiffre choc ; `split` avant/après.

## Structure type (70-95 s, 9 à 11 scènes de 5 à 14 s, rien de figé plus de 6 s)
hook 0-5 s : la question du titre, puis une phrase-promesse qui oppose début et fin (« D'une seule cité à trois continents, puis plus rien. ») → naissance → conquête → apogée (+ « comment il tenait », 6 s au plus) → **chute avant 42 s** → frise (5 s) → ce qu'il en reste → final. Une scène = une idée = une phrase principale (10 à 16 mots). Tout mot technique (tribut, comptoir, califat, khagan, vassal) est défini à l'écran à sa première apparition, en 5 mots. **Boucle** : la dernière phrase reprend les mots de la question en réponse (« Voilà jusqu'où Alexandre est allé en dix ans. ») ; jamais « la question qui nous a ouverts ».

## Pièges
- **Frontières floues** : « Contours approximatifs », polygones honnêtes, pas de `keep` d'une époque à l'autre. Projection : ne jamais conclure « grand / petit » à l'œil entre latitudes éloignées (Sibérie, Canada ×2 ; Inde, Afrique ×0,7) : chiffres.
- **Anachronismes** : noms d'époque (Byzance, Constantinople, Lutèce…), pays actuels dits « aujourd'hui » ; personnage plausible (pas de `cesar` pour un Franc).
- **Chiffres contestés** : « environ », source dans `sources/NN-slug.md`, écran = voix. Dates conventionnelles signalées (476).
- **Sujets sensibles** (Mussolini, Allemagne nazie, URSS, Rus' de Kiev, colonisation) : exception à la signature, **pas de violet ni de titre « À son apogée »** (gris neutre, titre « En 1942 »), pas de `stats` de puissance, pas de `rays`, victimes nommées (la Shoah, les gaz en Éthiopie) sans chiffres de choc ; final « Ce qui a changé ». Origine varègue de la Rus' = un débat ; États baltes « annexés en 1940 » ; frontières reconnues par l'ONU (Crimée ukrainienne).
- **Ne pas refaire** : Autriche-Hongrie, Pologne, Yougoslavie, Istanbul (Europe) ; Verdun 843, Tordesillas, Nystad, Rideau de fer (Traités) : une phrase au plus.
- **Police** : pas de œ, š, ž, č, ř, ş, ı (écrire Dusan, oe).

## Ordre de production
Pilote : **Empire romain** (territoire), **Venise** (comptoirs), **Mongols** (steppe, mode monde, `highlight.area`). Puis lots de 10 alternant les époques : sujets dans `eu.json` d'abord (Carthage, Byzance, Charlemagne, Habsbourg, Napoléon, Hanse…), mode monde ensuite, sujets sensibles au dernier lot avec relecture renforcée.
