# 14-gibraltar — boucle d'audit 1 → 2 (restructuration)

## Corrections appliquées
- Axe 1 / E3, E5, E6 : rocher dessiné en surface `highlight.area` [[-5.372,36.1555],[-5.334,36.1555],[-5.335,36.105],[-5.372,36.105]] (découpé sur les terres) : magenta au hook, à la signature (scène 1713), dans « Aujourd'hui » et au final ; orange Espagne (Espagne `keep:true` dès le hook) jusqu'en 1704 ; bleu #4F7FD0 posé en 1704 (`keep:true`) et visible après la signature.
- Axe 2 / E6 : hook serré sur le détroit (`focus` et `open` [-6.5,35.6,-4.3,36.9]), année/question/sub dès 0 s, Espagne orange + rocher magenta `at:0` ; pastille Gibraltar `when:1.0`, étiquettes ≥ 1,2 s.
- Axe 2 / E2, E3, E4, E5 : pastilles Gibraltar des scènes 1704, 1713, Aujourd'hui et final posées après le mouvement de caméra (`when` ≥ 1 s ou sur un mot tardif).
- Axe 3 / E5 : nouvelle scène « La porte de la Méditerranée » : labels Atlantique, Méditerranée, Espagne, Maroc, pastille « Détroit, environ 14 km de large », flèche de navires ; voix « Le rocher garde le détroit, la porte entre l'Atlantique et la Méditerranée. »
- Axe 4 / E1, E3, E5, E6 : `treaty` sub « 13 juillet 1713, au nom de : », signataires « La reine Anne » / « Le roi Philippe V » ; split dans la scène suivante (≈ 57-75 s estimées, ≈ 43-52 s réelles), cadré sur Cádiz + Málaga + area Gibraltar magenta→#4F7FD0, before « Avant 1713 », after « Après 1713 », legend [cédé, Britanniques, Espagne].
- Axe 4 / E1, E2, E3, E5 : les pertes italiennes et belges quittent le split : scène carte « L'Espagne perd ses terres d'Europe » (titre corrigé, E1 n°3), Autriche #B5523B (Milan, Naples, Sardaigne, Belgique actuelle), Savoie #C77DFF (Sicile), Minorque en area bleue ; gagnants nommés par la voix.
- E3 : province de Limbourg retirée des Pays-Bas espagnols (scène 1700 et gains).
- Axe 5 / E5, E6 : scène « 1802 Minorque » supprimée ; scène « 1708 Minorque » supprimée, Minorque réduite à une area + pastille dans la scène des gains.
- Axe 6 / E1, E3, E5, E6 : « Aujourd'hui » : rocher magenta, `line` sur l'isthme (3 points, `width` 14) avec label « Frontière actuelle » (posé au nord, sur la terre espagnole), étiquette « Royaume-Uni » en mer supprimée, « Maroc » hors cadre supprimé, `terrain` dédié z 12 [-5.75,35.88,-4.95,36.38].
- Axe 6 / E2, E5 : titre de scène sur une ligne « Gibraltar aujourd'hui ».
- Axe 6 / E1, E5 : voix exacte « En 2002, ses habitants refusent à environ 99 % une souveraineté partagée. » ; stats 99,6 % (`decimals:1`) « 1967 : rester britanniques » et « environ 99 % » « 2002 : non au partage » ; couleur #8FCBF0 pour le contraste (E2).
- Axe 7 / E1 n°4 : flèche autrichienne vers l'Italie du Nord [9.0,45.3].
- Axe 7 / E1 n°6 : titre « Anglais et Néerlandais prennent Gibraltar » ; flotte venue de l'Atlantique [-6.5,35.95] → baie d'Algésiras [-5.40,36.12] (E3).
- Axe 7 / E5, E6 : les deux candidats montrés (Philippe sur la France, l'archiduc Charles sur l'Autriche) dans une seule scène « Deux candidats, une guerre » ; plus de roi répété deux scènes de suite sur l'Espagne.
- Axe 7 / E3 : France plus surlignée dans ses frontières actuelles en 1701 (simple étiquette « France »).
- E1 n°2 : « Gagne : Autriche » supprimé (Savoie nommée pour la Sicile).
- E2 : scène 1700 recadrée [-10,35.5,19,54.5], pastille Pays-Bas espagnols [4.4,50.3], Portugal déplacé [-8.4,40.9].
- E4 : surlignages Italie/Belgique de la scène 1700 avancés sur « empire » (≈ 2,5 s visibles) ; pastille Grande-Bretagne de la signature à `when` 1,2 s, avant le parchemin.
- E4 : `move` blanc immobile de Minorque supprimé avec la scène 1802.
- Terrain : boîte z 8 élargie [-10.4,34,19.4,54.9], boîte z 10 détroit [-7.3,35,-3.4,37.6], boîte z 12 isthme.
- Durée : 119,9 s estimées par `new` sans voix en cache (le `new` en place lit l'ancien voice.json et affiche 104 s, à refaire après audio.py).

## Corrections refusées
- Bible / E6 (beacon sur le lieu de signature visible au hook) : Utrecht hors du cadre serré exigé par l'axe 2 ; beacon gardé mais invisible, « Traité d'Utrecht » reste à l'écran en `sub`.
- E5 : Minorque dans le split : refusée, le split est cadré sur l'Andalousie (axe 4), Minorque passe dans la scène des gains.
- E5 : legend « Autriche » dans le split : refusée, le split ne montre plus que Gibraltar ; legend = Britanniques / Espagne.
- E6 : art `compare` pour les gains : refusé, une carte colorée par gagnant montre mieux Milan, Naples, Sicile et Belgique ; arts du reel : treaty + split + stats (3, conforme).
- E1 n°1 option « Ville cédée en 1713 » : refusée au profit de « Frontière actuelle » (consigne axe 6).
- E2 (« ≈ » en prefix) : refusé, glyphe absent de la police ; « environ » gardé.
- E2/E3/E4/E5 corrections dans art.mjs / format.mjs (taille des pastilles pendant le zoom, liseré du split, labels stats ≥ 34 px, people.label.sub) : hors périmètre (aucune modification de src/).
- E4 (stats `count:true`) : appliqué pour 1967 seulement (compteur), 2002 reste fixe (`count:false`) pour ne jamais afficher une valeur fausse.
- Règle « un nouveau nom propre par scène » : dépassée dans la scène des candidats (Philippe, Charles) et des gains (Milan, Naples, Sardaigne, Savoie, Sicile, Minorque), imposée par le titre « Deux candidats » (axe 7) et par la liste des pertes.
- Timeline supprimée (la scène de guerre fusionnée n'a plus la place sous le budget 120 s).

- (producteur) split recadré sur la baie d'Algésiras (area Espagne voisine + rocher) : avec Cádiz et Málaga entiers, le rocher faisait environ 5 px.
