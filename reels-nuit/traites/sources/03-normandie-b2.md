# 03-normandie — boucle d'audit 2 → 3 : journal des corrections

## Appliquées
- Experts 3 n°1 / 4 n°1 / 5 · terre cédée en brique dès le traité : scène 6, 2e highlight Seine-Maritime + Eure `#B5523B` à « perd », `keep: true` ; scène 7, `highlight[0].at` → 0 (plus de retour au bleu du roi).
- Experts 2 n°2 / 3 n°2 / 5 / 4 n°7 · Rouen : label remplacé par une pill « Rouen » à [1.099, 49.443], side « r », au mot « fleuve » ; Rollon déplacé dans le pays de Caux [0.6, 49.72], size 250 → 190 (halo de Rouen dégagé).
- Experts 2 n°1 / 4 n°6 · bulle du hook : personnage à [0.75, 49.05], size 170 ; pill « Contours actuels » déplacée à [1.4, 48.85] pour ne pas le chevaucher.
- Expert 1 · « ils signent » → « ils concluent l'accord » (scène 6 say[0]) ; treaty calé sur « concluent ».
- Experts 1 / 2 n°6 · phrase contradictoire → « Après des décennies de raids, aucun camp ne parvient à chasser l'autre. »
- Expert 1 · ligne de l'Epte : commence à Gournay [1.72, 49.48] (cours supérieur en Seine-Maritime retiré).
- Experts 1 / 3 n°5 / 5 · pill « Francie occidentale » à l'est de Paris [2.6, 48.75], side « t » (hors de la zone bleue).
- Expert 2 n°8 / 5 · timeline `spread: true`.
- Expert 4 n°3 · timeline à `{ line: 1, d: 0 }` (après le repli, tient 4 s).
- Expert 4 n°2 · silhouettes en boucle : assaut vers Chartres `n: 0` (flèche seule, le repli se lit) ; repli n 3 → 2 ; Vikings sur la Seine n 4 → 3.
- Expert 4 n°4 · scène Charles/Rollon : flèche bleue « une terre » (n 0) de Paris vers la basse Seine au mot « terre ».
- Expert 4 n°5 · pill « Normandie / toujours là » avancée au mot « rose ».
- Experts 3 n°3-4 / 5 · « Royaume-Uni » (hors cadre, en mer) retiré ; labels « Hauts-de-France » et « Île-de-France » ajoutés pour nommer les deux régions du titre (« France » conservé).
- Expert 3 n°7 · beacon Saint-Clair-sur-Epte dans « Aujourd'hui », au mot « Epte » + 0,8 s.

## Refusées
- Expert 2 n°4 (sous-textes < 32 px) : faux positif, le générateur impose 32 px.
- Expert 5 (agrandir les panneaux du split, littoral) / expert 2 n°3 (échelle d'entrée), n°7 (couleur de « après ») / expert 5 (panneaux vides à l'ouverture) / expert 4 n°8 (opacité du hook à l'image 0) / expert 3 n°2 (plafond anti-collision) : refusé : générateur.
- Expert 5 · hook `highlight.at` 0.3 : la bible impose le magenta à `at: 0` ; défaut de fondu = générateur.
- Expert 2 n°5 · « Rollon reçoit » : « Rollon gagne / le roi perd » est salué par l'expert 1 ; coupure de ligne = générateur.
- Expert 5 · split `sub` « mer au nord-ouest · Paris au sud-est » : `sub` « contours actuels » obligatoire (anachronisme).
- Expert 1 · pill Bayeux « 924, avec l'Hiémois » : nouveau nom propre ; « Frontières approximatives » couvre l'approximation (jugé acceptable par l'expert 1).
- Expert 3 n°5 · highlight bleu du royaume (Eure-et-Loir, Yvelines, Oise…) : ajouterait une zone `keep` à gérer jusqu'au split ; la pill déplacée à l'est de Paris suffit à dire que le royaume dépasse la basse Seine.
- Expert 3 n°6 · tracé de la Seine en scène 2 : la flèche des Vikings suit déjà le fleuve ; un seul événement nouveau par scène.
- Expert 3 n°4 · highlight bleu Oise + Val-d'Oise et nouveau titre : le bleu signifie « le roi » dans tout le reel ; les labels des deux régions suffisent, le titre reste exact (expert 1).
