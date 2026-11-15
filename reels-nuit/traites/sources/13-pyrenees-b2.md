# 13-pyrenees — boucle d'audit 2 → finale

## Corrections appliquées
- E1/E3/E5 : label « Capcir » [2.07,42.7] → [2.10,42.61] (Formiguères, dans la zone bleue).
- E3 : label « Cerdagne » (scène crête) [1.98,42.56] → [1.84,42.56], dégage l'enclave de Llívia.
- E4 n°7 : labels de la crête dans l'ordre de la voix, rafale resserrée : Roussillon d 3,9, Conflent 4,1, Vallespir 4,3, Capcir 4,5, Cerdagne 4,7.
- E1/E3/E5/E6 : pastille « Catalan » sortie du Fenouillèdes (occitan) : `at` [2.38,42.39] (sur la ligne de 1659), `side:"b"`, à cheval sur les deux côtés.
- E2 n°6 : pastille « Frontière de 1659 » : sub « de Cerbère à l'Andorre » (plus de redite du titre), `side:"t"` (côté France, sépare de « Catalan » côté Espagne).
- E4 n°6 : pastille « Frontière de 1659 » `when` → mot « suit ».
- E5 n°4 : beacon orange sur Llívia (Aujourd'hui), au mot « Llívia ».
- E2 n°7 : titre Aujourd'hui « La frontière de 1659 tient ».
- E2/E3/E5 : label « Catalogne » [1.3,41.95] → [1.75,41.75] (n'est plus rogné à gauche).
- E3 n°4 : rebelle [2.17,41.5] → [2.1,41.9] (au-dessus du bandeau) ; sub « Barcelone, 1640 » → « dite des Segadors » (ne situe plus Barcelone à tort ; année déjà dans l'en-tête).
- E2/E4 : flèche « Armée française » : `from` [2.5,42.95] (sous le titre), label retiré (le sous-titre le dit, il couvrait les soldats).
- E4 n°2 : même flèche `at` mot « 1642 » +0,2, `dur` 2,2 (comble le temps mort).
- E3 n°6 : rectangle bleu de Perpignan supprimé (le beacon suffit).
- E1/E4 : flèche 1635 `to` [2.55,42.95] (s'arrête à la frontière : pas d'attaque du Roussillon avant 1639), `dur` 1,1.
- E2/E4 : pastille « Roussillon » 1635 : `at` [2.45,42.5], `side:"b"`, `when` mot « Roussillon » +0,1.
- E3 n°7/E5 n°2 : France colorée en bleu dès 1635 (`countries:["France"]`, `keep:true`, posée sous l'`area` orange du Roussillon) : le Fenouillèdes n'est plus une tache isolée.
- E1 : pastille du hook sub « auj. dans les Pyrénées-Orientales ».
- E5 n°8 : label « Île des Faisans » [-1.6,43.2], 32, au mot « île » (hook).
- E2 n°5 : label « Espagne » retiré de la scène Bidassoa (« pour l'Espagne » suffit).
- E4 n°1 : trait de crête `at` mot « frontière » -0,1, `draw` 1,6 (montré entier avant la coupe).
- E5 n°7 : légende du split « cédé » → « Roussillon cédé ».
- E2 n°4 : sous-titre Llívia « En 1660, on partage la Cerdagne. Llívia, déclarée ville, reste espagnole. »
- E5 n°6 : pastille « Cerdagne française » sans sub « 33 villages » (redite de l'art) ; `stats` dur 3,2 → 2,8 (cache moins l'enclave).
- E6 n°2 : final : beacon de l'île des Faisans ajouté (écho des deux halos du hook).

## Corrections refusées
- E1/E5 : extension de l'`area` Roussillon vers 42,72-42,80° N : refusé, faits : au nord de Puyvalador/Réal c'est le Donezan (Ariège, Rouze ≈ 42,71° N) et l'Aude ; le contour actuel (≈ 42,66° N) suit la limite du département. Le label déplacé suffit.
- E5 n°4 : pastille Llívia `side:"l"` : refusé, elle sortirait du cadre (mise en page auto) ; beacon ajouté à la place.
- E5 n°7 (nom de la part dans le panneau Après), E3 n°8 (opacité du highlight sur le relief), E5 n°6 (compteur qui part de 32) : refusé : générateur.
- E5 n°6 : remplacer « 33 villages » par « 1 ville » : refusé, chiffre faible ; redite traitée côté pastille.
- E6 n°1 (timeline à la place du rebelle) et n°4 (fusion Louis XIV/Marie-Thérèse) : refusé, structure figée pour la correction finale.

## Durée
- `new` : 80,0 s réelles (b2 : 78,5 s), sous 82 s. Validation sans erreur.
