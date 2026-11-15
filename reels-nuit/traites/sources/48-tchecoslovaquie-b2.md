# 48-tchecoslovaquie — corrections boucle 2 → 3

## Appliquées
- Experts 1.6, 6.2 (arbitrage : 1992) · hook `sub` « Loi de dissolution, 1992 », identique au final ; `year` du hook reste « 1993 » (date du changement de carte).
- Expert 1.7 · sceau du parchemin `year` « 1993 » → « 1992 » (cohérent avec « votée le 25 nov. 1992 »).
- Expert 5.7 · hook : label Tchéquie `[15.6,49.25]` (dégage le repère de Prague), Slovaquie `[19.8,48.6]` (sans collision).
- Expert 1.2 · pill Ruthénie `sub` « rattachée en 1919, auj. Ukraine ».
- Expert 4.4 · pill Ruthénie sur « fondent » (+0,3 s), plus 0,6 s seulement.
- Expert 3.7 · scène 1989 `focus` `[11.8,47.6,20.5,51.4]` : la Slovaquie est dans le cadre.
- Experts 3.1, 3.2, 2.2, 4.7, 5.5 · juin 1992 : `focus` `[12.0,47.3,22.0,50.6]`, Klaus `[14.8,49.9]`, Meciar `[19.2,48.85]` (hors zone des icônes), bulle « Fédération ou séparation ! » ; sous-titres d'étiquettes courts « côté tchèque » / « côté slovaque ».
- Experts 2.3, 5.5, 6.4 · pill « Frontière intérieure » `[17.4,48.83]` side l (plus collée à Klaus ni sur le tracé central).
- Expert 4.8 · beacon de Bratislava sur « juillet » (avant la ligne) : plus de 2,5 s vides.
- Expert 1.4 · « En juillet, le parlement slovaque vote la souveraineté de la Slovaquie. »
- Expert 6.5 · Meciar en `savant` (vert, cheveux bruns, sans barbe) au lieu de `paysan`, aux scènes juin 1992 et Brno.
- Experts 1.5, 3.4, 4.1, 5.1, 6.1 (partiel) · Brno : pill Brno `when` 1,0 (avant la timeline) ; timeline sur {line 1, « annoncent »}, dur 3 ; personnages remontés `[15.9,49.7]` / `[17.3,49.7]`.
- Expert 3.3 · Brno : frontière intérieure lavande déjà tracée (`at` 0, `draw` 0,01) + label Slovaquie `[17.9,48.75]` : le violet ne masque plus la frontière.
- Expert 2.4 (contournement brief) · timeline : « Révolution », « Souveraineté » (textes courts).
- Experts 2.6 · « Le 25 novembre, les députés votent la loi : elle signe la fin du pays. » (coupure sur la ponctuation, parchemin toujours sur « signe »).
- Experts 2.5, 5.2 · « Pas de référendum : seul un tiers des habitants veut la séparation. » (minorité explicite, plus de coupure dans la proportion).
- Experts 1.3 (+ consigne) · légende du split « séparé ».
- Experts 2.7, 6.3 · `sub` du split « un pays avant, deux après ».
- Experts 1.1, 2.1 · partage : « Les biens mobiles fédéraux : deux tiers aux Tchèques, un tiers aux Slovaques. » / « Comme la population : environ 10 millions de Tchèques et 5 millions de Slovaques. » (plus de coupure « deux / pour un ») ; flèche « 1/3 des biens mobiles ».
- Experts 4.2, 5.4 · flèche sur « biens », dur 1,0 ; barres {line 1, d 0,4}, dur 3,2 : étiquette lisible avant les barres.
- Experts 3.5, 5.6 · « Aujourd'hui » : pill « Frontière ouverte » `[17.5,48.85]` side b (au premier coude, plus sur le tiers central).
- Expert 3.6 · points intermédiaires de la frontière décalés de +0,02° lon / −0,02° lat (vers la Slovaquie), dans les trois `line`.
- Experts 5.3, 4.3 (partiel) · final : frontière lavande tracée sur « frontière » (width 10, draw 1,2) : l'argument a son image et le final bouge.

## Refusées
- Expert 6.1 (supprimer la timeline) : gardée (consigne, 4e art), raccourcie et déplacée après la pill Brno.
- Expert 4.3 (labels au final) : l'image de fin doit rester identique à l'ouverture (boucle) ; la ligne lavande suffit comme mouvement.
- Expert 4.5 (highlights du hook à 0,15 s) : la bible impose le territoire visible à t = 0 (`at: 0`).
- Expert 5.2 (pill « Pour la séparation ») : elle tomberait sous le parchemin (« signe » → +3,8 s) ; la phrase dit désormais « seul un tiers ».
- Expert 1.7 (`sub` « votée en nov. 1992, effet au 1/1/1993 : ») : remplacé par le sceau « 1992 », on garde « voulue par ».
- refusé : générateur — avancée lente de caméra sur les vues larges (4.3), queue finale ≤ 0,8 s (4.6), décalage automatique des personnages (3.1), `line` sur contour réel (3.6), animation/alignement timeline (2.4, déjà corrigé côté générateur).

## Durée
`new` (cache voix) : 87,0 s ; sans cache : 113,3 s estimées contre 113,0 avant (1214 car. contre 1210) → ≈ 77,3 s réelles (< 82 s).
