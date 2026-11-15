# 11-westphalie — boucle d'audit 1 → 2 (notes 5 à 7/10)

## Corrections appliquées
- P1 / E2, E3, E4, E5 : hook, « Aujourd'hui » et final cadrés sur la même boîte [0.5,42.6,13.5,56.7] ; `open` ajouté avec cette boîte (1re et dernière image identiques). Pays-Bas (≈ y 660) et Suisse entière (≈ y 1265) tiennent entre le titre et la bande des sous-titres (≈ y 1320).
- P7 : Suisse + Pays-Bas en magenta posés une seule fois au hook (`keep` par défaut, visibles jusqu'à la fin) ; redessins identiques supprimés en scènes 1, 2, 4, 5, « Aujourd'hui » et final.
- P4 / E1 n°8 : hook `text` « Reconnus indépendants la même année ? » ; 1re phrase « Comment la Suisse et les Pays-Bas ont-ils été reconnus indépendants la même année ? » (13 mots) ; final « Voilà pourquoi la paix de Westphalie a fait reconnaître la Suisse et les Pays-Bas. ».
- P4 / E1 n°2 : signature « Le 24 octobre 1648, les traités négociés à Munster et à Osnabruck sont signés à Munster. » (show avec ü) ; treaty `sub` « 24 octobre 1648, au nom de : » (plénipotentiaires), `dur` 3,5.
- P2 / E1 n°6, E2 n°1, E3 n°5, E5 n°1, E6 n°1 : split `before` « Avant 1648 », `after` « Après 1648 », `legend` [détachés #FF2E88, indépendants #FF7A3C, Saint-Empire #B5523B] ; parts = Suisse et Pays-Bas (magenta → orange), Belgique (Pays-Bas espagnols), Allemagne + Autriche + Tchéquie en brique (même Empire que la scène 1) ; Alsace retirée (scène dédiée).
- E1 n°7, E2 n°7, E3 n°6, E4 : scène signature recadrée [3.5,50.4,10.0,53.6] ; pill Münster `when` 1,0, pill et balise Osnabrück `when` 1,3 (avant le parchemin).
- P3 / E1 n°3, E3 n°1, E5 n°7 : Mecklembourg-Poméranie entier remplacé par `areas` magenta : Poméranie occidentale (avec Stettin et la rive est de l'Oder), Wismar, Brême-Verden.
- P3 / E1 n°5, E2 n°3, E4 : pills de la scène Suède refaites : « Poméranie / frontières approximatives » (une seule pill au lieu de deux), Wismar (côté r), « Brême-Verden / Weser et Elbe » (Weser nommée, pill sur la terre), « Oder / port de Stettin » (Stettin nommée) ; cadrage [6.8,51.2,18.0,57.2] ; flèches à 2 silhouettes, flèche 2 vers Stade ; labels Suède/Danemark à 1 s et plus.
- P3 / E1 n°4 : pill « Strasbourg / libre jusqu'en 1681 » ; la voix garde « la majeure partie de l'Alsace ».
- E3 n°7, E4, E5 n°3, E6 n°3 : scène Alsace : flèche bleue de la France vers l'Alsace [4.4,47.9] → [7.2,48.0] ; cadrage [2.6,46.5,10.6,50.0] (Verdun loin du bord) ; pills Metz/Toul/Verdun sur « garde » +0/0,3/0,6, côtés t/b/l ; label « France » ajouté ; « Allemagne » → « Saint-Empire » (anachronisme).
- E6 n°3 : bleu France #4FA3E0 → #3D6FD1 (se confondait avec la mer), aussi en scène 3.
- P5 / E1 n°1, E3 n°3, E5 n°8, E6 n°5 : line finale limitée au Rhin, de Bâle à Constance (8 points, sans Genève ni Jura), `width` 10 ; label au milieu du tracé (point de Coblence), donc posé juste au nord du trait.
- P7 / E2 n°2, E5 n°8, E6 n°5 : « Aujourd'hui » : labels Suisse et Pays-Bas supprimés (doublons des pills « toujours là ») ; pill Suisse côté l (sur la France, hors du trait) ; labels France/Belgique/Allemagne à 1 s et plus.
- P6 / E3 n°4, E5 n°5, E6 n°2 : scène 3 : Empire = Allemagne + Autriche + Tchéquie, label « Saint-Empire », pill « Contours actuels », pill « Prague » (après la frise) ; label Suède remonté [15.0,58.3] ; flèche France sur « France » −0,4 s, `dur` 1,6.
- E4 : scène 1 recadrée [4.5,44.0,17.5,53.2] (Suisse au-dessus des sous-titres) ; Empire et pill Saint-Empire sur « dépendent », « Contours actuels » +0,8 s.
- E2 n°6, E3 n°8, E5 n°4 : scène 2 : soldats violets [4.2,50.5] → [4.7,51.5], marin [6.4,52.8], pill Provinces-Unies [5.2,52.4].
- E5 n°6 : scène 4 : Belgique + Luxembourg en violet sous « Pays-Bas espagnols ».
- Durée : phrase « Pour elles, 80 ans de guerre contre l'Espagne s'achèvent enfin. » coupée (scène 4) ; 110,8 s estimées par `new` sans cache (81,1 s avec les anciennes voix en cache, à refaire après audio.py). Validation `new` sans erreur.

## Corrections refusées
- E1 n°1 (line à partir de Coblence à cause du Fricktal autrichien) : refusé au profit de P5 (Bâle → lac de Constance) ; l'écart d'environ 10 km fait moins de 10 px à ce cadrage, et la voix dit « presque comme en 1648 ».
- E1 n°4 (Mulhouse, alliée des Suisses jusqu'en 1798) : non affichée (scène déjà chargée) ; « la majeure partie » couvre l'écart.
- E2 n°4 (sous-textes de pills < 32 px) : faux positif (planches réduites, le générateur impose 32 px).
- E2 n°5 (article orphelin en fin de ligne de sous-titre) : refusé : générateur.
- E2 n°8 (parchemin collé sous le titre) : refusé : générateur (art.mjs) ; titre de scène gardé.
- E4 (masquer pills et balises sous un art actif) : refusé : générateur ; contourné par les `when` avancés.
- E4 (treaty `dur` 3,0, split 3,4) : refusé : la bible et STYLE.md demandent ≥ 3,5 s et 4 s.
- E4 (cadrage scène 9 différent du hook) : refusé au profit de P1 (même cadre que le hook, Suisse au-dessus des sous-titres).
- E5 / E6 (art `compare` des gagnants, phrase de liaison) : refusé : durée (110,8 s estimées) ; 3 arts au total (timeline, treaty, split), conforme.
- E6 n°1 (`to` blanc cassé, titre « Qui gagne, qui perd », phrase dite en plus) : refusé : orange expliqué par la légende ; durée.
- Légende « cédé » de la bible remplacée par « détachés » : la Suisse et les Provinces-Unies ne sont cédées à personne (E1 n°6).
- Magenta sur Suisse et Pays-Bas avant la signature (règle de la bible) : gardé, non relevé par le producteur (E6 l'écarte aussi).
- Empire brique redessiné en scènes 1 et 3 (avec Suède et France en plus en scène 3) : pas de `keep` possible, il ne doit pas rester sur la carte d'aujourd'hui.
- Line `labelAt` (E6) : champ inexistant ; label posé au milieu du tracé par le générateur.
