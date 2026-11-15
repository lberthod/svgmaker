# 34-trianon — corrections boucle 2 → 3

## Appliquées
- Expert 4.1 · split coupé : parchemin dur 3,4 ; bascule magenta sur « Trianon » (+0,3 s), visible entre parchemin et split ; split sur {line:1, word:"Trois"}, dur 4,0 ; scène 5 `duration` 9,5 pour que le split tienne ses 4 s avant la coupe.
- Expert 4.2 / 1.1 / 2.2 / 5.4 / 6.5 · barres : « Hongrie (reste) » en 2e position, juste après la Roumanie ; `at` = {line:0, word:"partagent"}, dur 4,8 ; scène 7 `duration` 9,3 : les 4 valeurs sont lisibles pendant la comparaison.
- Expert 4.3 · troupes qui rebouclent : `dur` Roumains 3,4, Tchécoslovaques 2,6 (période ≥ temps restant dans la scène, plus de retour au départ visible).
- Expert 4.4 / 3.3 / 5.6 / 2.4 · scène 3 cadre [14,43.6,27.2,50.4] (Prague dans le champ) ; soldat [20.6,47.0] ; flèche tchécoslovaque vers [18.6,48.5] (hors de la bulle).
- Expert 4.5 · plus de carte vide à la 1re coupe : orange du hook `keep: true`, orange du royaume de la scène 1 à `at: 0`.
- Expert 4.6 · soldat sur {line:0, word:"Fin", d:0.3}.
- Expert 4.7 · pastille Hongrois (scène 2) sur « moitié ».
- Expert 4.8 / 6.1 / 6.2 · hook en Europe large `[-0.5,43,31,52]` (alternance large/serré : Normandie et Gibraltar sont serrés), `open` et final sur le même cadre : vraie poussée arrière au final et boucle parfaite. `beacon` Versailles à `when: 0` dans le hook (signature de la bible).
- Expert 3.4 / 5.2 · scène 4 cadre [-0.5,42.5,31.5,52.5] (halo de Paris entier) ; scène 5 = cadre du hook (Transylvanie hors de la zone des icônes).
- Expert 3.5 / 5.8 · scène 6 cadre [14.4,43.9,27.4,49.8] ; pastille « Hongrois en Roumanie » [25.0,46.4] side l.
- Expert 3.1 · « Aujourd'hui » cadre [13.6,44.4,27.4,49.8] ; Croatie [16.6,45.35], Slovénie [16.0,46.6], Autriche [15.9,47.6].
- Expert 5.8 · « Toujours là » posée sur la ligne blanche [21.35,46.6].
- Expert 3.2 · trous de Slavonie : polygone `area` élargi dans les 5 occurrences (sud relevé à 45,13-45,2 pour ne pas déborder sur la Bosnie).
- Expert 3.6 · label Autriche (scène 7) [15.7,47.5], hors du Burgenland.
- Expert 3.8 / 5.5 · « Frontières approximatives » ancrée dans le royaume [23.6,46.6] ; Budapest side b, Vienne side t (expert 2.3).
- Expert 2.6 · pastille Croates : sub « Croatie autonome », at [16.9,45.6], side t.
- Expert 2.7 · label Roumanie (scène 3) [24.2,44.5], hors du trajet des troupes bleues.
- Expert 2.1 / 5.1 · stats : `sub` retiré (il chevauchait 72 %) ; titre « Le bilan, environ » ; labels « du territoire de 1914 », « des habitants de 1914 ». Expert 6.4 : `at` = {line:0, d:0}.
- Expert 2.5 · coupures : scène 3 « …occupent alors une partie du royaume. » ; scène 5 « Le 4 juin 1920, à Versailles, la Hongrie signe le traité au Grand Trianon. » (« à Versailles » n'est plus seul) ; scène 7 « La Roumanie, à elle seule, reçoit plus de terres que n'en garde la Hongrie. » ; scène 8 « Ses anciens morceaux, presque tous, sont chez ses sept voisins. »
- Expert 5.7 · « Trois voisins et l'Autriche reçoivent plus des deux tiers du royaume. » (plus de « en » obscur).
- Expert 5.3 · pourquoi ce tracé : scène 4 say[1] « La Hongrie réclame des votes locaux, mais les vainqueurs les refusent. » + pastille Budapest « Votes locaux / demandés, refusés » (demande de plébiscites d'Apponyi, janvier 1920, rejetée → https://fr.wikipedia.org/wiki/Traité_de_Trianon).
- Expert 1.2 · « en Voïvodine (royaume SCS) ».
- Expert 1.3 · « se partagent l'essentiel des morceaux » (Pologne et Fiume omises).
- Expert 1.4 · légende du split : cédé / Roumanie / Tchécoslovaquie / SCS (4 au plus ; « Hongrie » retiré, l'orange est connu depuis la scène 1).
- Expert 1.5 · signers « Hongrie, France, Royaume-Uni, Italie » (Italie parmi les principales puissances signataires → https://en.wikipedia.org/wiki/Treaty_of_Trianon).
- Terrain z8 élargi à l'union des cadres ±0,4° : [-0.9,42.1,31.9,52.9] (relief généré au build).

## Refusées
- Expert 2.5 (hook) · « a-t-elle perdu / plus des deux tiers » : 1re phrase imposée par la bible (question du titre mot pour mot) ; scène 1 « forme / une moitié » gardée (pas de reformulation plus courte sans perdre l'Autriche-Hongrie).
- Expert 2.1 (marge sub/grille des stats) : générateur ; contourné en retirant le `sub`.
- Expert 4.3 (ne pas reboucler les `moves`) : générateur (format.mjs) ; contourné par les durées.
- Expert 4.8 (final serré [16.6,44.9,24.8,49]) : remplacé par le final large = `open` (expert 6), poussée arrière nette et boucle parfaite.
- Expert 6.3 · scène 2 zoomée à l'est : la pastille Croates sortirait du cadre ; la variété vient du hook large, de la scène 3 décalée au nord-ouest et des scènes 4, 5 et final en Europe large.
- Expert 6.3 bis · orange de la scène 1 sur « royaume » : conflit avec l'expert 4.5 (rythme prioritaire, plus de carte vide).
- Expert 6 (aplat orange qui masque le relief) : pas d'option d'opacité pour `highlight` ; générateur.
- Expert 5.2 (scène 5 [0.5,39,28.5,55]) : cadre de l'expert 3 retenu (même but, Versailles et la Transylvanie hors des icônes).

## Durée
- `new` : 90,5 s affichées, dont 7 répliques nouvelles estimées (surestimation ≈ 15 s) → ≈ 75-76 s réelles (rendu b2 : 70,9 s).
