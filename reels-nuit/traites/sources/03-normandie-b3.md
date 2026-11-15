# 03-normandie — boucle d'audit 3 (correction finale) : journal des corrections

## Appliquées
- Expert 1 · Charles le Simple vers Compiègne [2.8, 49.4] (plus sur Paris, base de Robert) ; départ de la flèche « une terre » idem ; focus scène 5 élargi à l'est (3.0 → 3.6) pour garder le roi dans le cadre.
- Expert 3 n°3 · « une terre » : label de la flèche retiré, pill « une terre » à la pointe [0.9, 49.3], side b, au mot « terre » + 0,6 s.
- Expert 2 n°6 · titre scène 5 → « Le roi et Rollon s'accordent » (plus de doublon avec le parchemin).
- Expert 2 n°2 · coupure « basse / Seine » : say → « Rollon gagne la Seine, de l'Epte à la mer ; le roi la perd. »
- Experts 2 n°1 / 5 · « Armée franque » lisible avant la timeline : moves[1] `d` -0.6, `dur` 1.2 ; label « Paris » remonté à [2.35, 49.05] (ne colle plus aux soldats).
- Expert 2 n°4 · flèche d'assaut décalée à l'ouest (`from` [1.0, 49.443]) pour dégager la pastille « Rollon ».
- Expert 4 n°3 · repli décalé de l'assaut ([1.35, 48.52] → [0.95, 49.35], `d` -0.3) : les deux traits ne se superposent plus.
- Expert 3 n°6 · label « Chartres » à [1.489, 48.30] (halo dégagé).
- Expert 3 n°4 · Rollon (scène 3) à [0.45, 49.78] (halo de Rouen dégagé).
- Expert 5 · timeline « Échec à Chartres » → « Rollon repoussé à Chartres » (le bleu = victoire franque, plus d'ambiguïté).
- Experts 2 n°5 / 6 n°5 · « Terre de Rollon » sur la terre [1.1, 49.38].
- Expert 4 n°2 · scène 924-933 : Cotentin highlight à « obtient », pill Cotentin à « ouest », Avranchin à « Cotentin » + 0,3 s (plus de trou de 3 s, Avranchin lisible plus longtemps).
- Experts 5 / 6 n°1 · Calvados, Orne, Manche en `keep: false` : la brique de 924-933 ne reste plus sur la carte « Aujourd'hui ».
- Experts 2 n°3 / 3 n°1 / 5 / 6 n°3 · « Aujourd'hui » désencombré : label « France » supprimé ; « Hauts-de-France » à [2.5, 49.7], « Île-de-France » à [2.4, 48.8].
- Expert 3 n°2 · Oise + Val-d'Oise en couleur neutre `#E8E2D0` (`at` 0.6, `keep` false) : la limite régionale de l'Epte se voit, sans le bleu du roi.
- Experts 1 / 5 · titre « Aujourd'hui » → « L'Epte borde toujours la Normandie ».
- Expert 1 · pill « Normandie / toujours là » à [1.0, 49.45] (sur les deux départements roses).
- Expert 4 n°1 · highlight magenta à `at: 0` dans « Aujourd'hui » et le final (plus de clignotement brique/magenta).
- Expert 4 n°6 · beacon du final au mot « Normands » (un événement pendant la phrase).

## Refusées
- Sous-textes < 32 px : faux positif (générateur impose 32 px).
- Expert 2 n°7 · bande magenta sous le panneau split : refusé : générateur.
- Expert 6 n°2 / n°4 · final qui réaffiche la question, cadrage Europe large : changement de structure/signature, à décider au niveau de la série (Trianon, Gibraltar) ; hors correction finale.
- Expert 6 n°3 · pill Epte à [1.6, 49.05] side l, suppression du beacon, `line.width` 18 : le retrait du label « France » et le déplacement des régions suffisent ; la pill à gauche tomberait sur la zone rose.
- Expert 5 · pill Normandie à [-0.4, 48.95] « toute la région » + label « Terre de 911 » : contredit le placement demandé (expert 1) et la sub obligatoire « toujours là » ; la brique de l'ouest est retirée.
- Expert 5 · pill « Francie occidentale » à [2.9, 48.6] : trop près du bord du cadre ; l'expert 1 valide la position actuelle.
- Expert 3 n°5 · label « Rouen » en scène 4 : Rouen n'est pas dit à la voix dans cette scène, et ajouterait un texte près de l'étiquette « Rollon ».
- Expert 4 n°4 · Chartres au mot « juillet » : moins d'1 s après le début d'une scène où la caméra bouge (règle du pilote).
- Expert 4 n°5 · treaty `dur` 3.2 : la bible impose 3,5 à 4 s.
- Expert 4 n°3 (fin) · timeline au mot « décennies » : raccourcirait la timeline complète à l'écran ; l'avance de l'armée franque règle le problème.
- Expert 1 · Orne entière en 924 : déjà couvert par « Frontières approximatives ».

## Durée
`new` : 73,6 s (voix réelles), 18 répliques, sans erreur (b2 ≈ 72 s).
- (producteur, vérif finale) timeline : « Rollon repoussé à Chartres » → « Échec à Chartres » (alerte zone des icônes).
