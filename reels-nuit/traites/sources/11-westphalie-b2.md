# 11-westphalie — boucle d'audit 2 → 3 (notes 8 / 7 / 7 / 7 / 6,5 / 7)

## Corrections appliquées
- E3 n°1, E5 n°1, E6 n°2 (Alsace et Suisse en une seule tache magenta) : scène 6, Alsace (Bas-Rhin, Haut-Rhin, Territoire de Belfort) en brique #B5523B dès 0,2 s avec l'Allemagne (le propriétaire avant 1648), puis magenta sur « Alsace », puis bleu France sur « Toul ». Le magenta ne dure qu'environ 1,5 s. Suisse inchangée.
- E5 « fil narratif » : phrase de liaison ajoutée en scène 6 : « Les vainqueurs, eux, se font payer en territoires arrachés à l'Empire. » (11 mots). Elle laisse voir l'Alsace brique avant la cession ; les ancres passent en réplique 1.
- E3 n°1, E2 n°3, E4, E5 n°1 : scène 6 recadrée [3.2,47.3,10.0,50.3] (Suisse sous la bande des sous-titres) ; flèche [4.6,47.75] → [6.6,47.95], sur « obtient » (les soldats ne couvrent plus l'Alsace) ; pill Alsace [7.4,48.2] côté r ; Strasbourg côté t, sur « garde » +0,9 ; Metz/Toul/Verdun sur « garde » +0/0,3/0,6 ; label Suisse supprimé ; France [3.9,48.3] à 1,0 s ; Saint-Empire [9.0,49.6] à 1,4 s.
- E3 n°2 : scène 3, Alsace en brique en même temps que la France bleue (l'anachronisme de 1635 disparaît).
- E2 n°4, E3 n°4, E1 n°6, E4 : scène 7 (Suède), pills désentassées : Wismar côté t (au-dessus de la baie) ; Poméranie [13.2,53.65] ; pill Oder → « Stettin / port sur l'Oder » posée sur Stettin [14.55,53.43] ; Brême-Verden [9.5,53.05] côté b (sous la zone, qu'elle ne cache plus).
- E4 (Brême-Verden magenta trop tôt) : `areas` coupées : Poméranie + Wismar sur « Poméranie », Brême-Verden sur « Brême ».
- Bible n°2 et E5 n°5 (Brême-Verden magenta collé aux Pays-Bas magenta), E4 (2,4 s de carte figée) : les trois zones passent en vert suédois sur « contrôle » (le cédé prend la couleur du gagnant).
- Faits (non relevés) : flèches suédoises partent de Kalmar [16.36,56.66] et de Halmstad [12.86,56.67] (Scanie et Blekinge restent danois jusqu'en 1658 ; Halland suédois depuis 1645) ; flèche 1 vers Rügen [13.5,54.5].
- E1 n°7, E2 n°2, E3 n°3, E4, E5 n°3, E6 n°3 (frontière finale) : `line.width` 14 ; `line.at` sur « borde » (plus longtemps à l'écran) ; label flottant « Suisse–Empire, 1648 » supprimé et remplacé par une pill « Rhin / frontière de 1648 » [8.86,47.66] côté t, pointée sur le trait, sur « Rhin » ; pill Suisse [6.9,46.85] côté l (à l'ouest de Bâle, hors du trait).
- E1 n°1 : titre final « Deux pays reconnus en 1648 ».
- E1 n°5 : split `title` « Ce qui sort de l'Empire ».
- E5 n°4, E6 n°5 : légende du split + « Espagne » #C77DFF (Belgique violette), 4 pastilles, textes ≤ 12 caractères.
- E4 (parchemin coupé par le split, sceau invisible) : treaty sur « négociés » −0,2 : il dure ses 3,5 s avant le split (sur « exemptée ») et la carte n'est plus figée.
- Leçon du pilote : timeline `spread: true`.
- E2 n°1, E3 n°5, E4, E6 n°4 : hook, label Pays-Bas [5.6,52.2] (sous le sous-titre « Traités de Westphalie »).
- E4, E1 n°4 : scène 4, balise et pill Münster à 1,0 s, Pays-Bas espagnols 1,3 s, Provinces-Unies 1,6 s, marin 1,9 s ; E5 n°7 : marin [5.6,52.3].
- E2 n°5, E3 n°6, E5 n°6 : scène 3, flèche suédoise depuis [16.2,56.2] (loin du label Suède) ; label France [1.5,46.4] ; flèche France vers [7.4,50.4] ; pill « Contours actuels » [13.0,49.3].
- E2 n°6 : scène 2, label « Pays-Bas espagnols » [4.9,50.0].
- E5 n°8 : scène 1, confédéré [8.6,46.3].
- Durée : 78,4 s réelles mesurées par `new` (73,0 + la phrase de liaison, encore estimée sans voix), sous 82 s. Validation `new` sans erreur.

## Corrections refusées
- E1 n°2 et n°3 (France actuelle en bleu avec Lorraine et Franche-Comté) : l'Alsace, seul territoire en jeu, a maintenant sa propre couleur ; une pill « Contours actuels » de plus surchargerait une scène qui en a déjà 5.
- E6 n°1 (art `compare` « Qui gagne quoi ») : `compare` compare des formes, pas des listes ; les gagnants sont maintenant montrés par les recoloriages (Alsace bleue, possessions suédoises vertes), et la phrase de liaison le dit.
- E5 n°2 (pill Osnabrück au hook, Münster côté l) : le haut du hook est déjà sous le titre de 3 lignes et le sous-titre ; Osnabrück [8.05,52.28] tomberait sous « Traités de Westphalie ». Osnabrück est montrée en scène 5.
- E5 n°5 (cadrage Suède à partir de 7.6° E) : Brême-Verden serait collée au bord gauche et sa pill sortirait du cadre ; remplacé par le passage au vert sur « contrôle ».
- E3 n°3, E5 n°3, E6 n°3 (cadrage serré de « Aujourd'hui ») : le Rhin passerait sous la bande des sous-titres ; le cadre du hook est gardé (P1 boucle 1), la frontière est épaissie et pointée par une pill.
- E3 n°1 (`focus.box` [4.4,46.9,9.8,49.7]) : Verdun à 1° du bord gauche, sa pill sortirait du cadre ; cadrage intermédiaire retenu.
- E5 (titre de scène « Les vainqueurs aussi gagnent ») : la phrase de liaison dite remplit ce rôle ; le titre « La France gagne l'Alsace » reste plus clair.
- E4 (pill « Elbe ») : l'Elbe et la Weser sont nommées dans la pill Brême-Verden ; le passage au vert donne le changement visuel de la 2e phrase.
- E2 n°7 (item de frise qui déborde en zoomant) : refusé : générateur (art.mjs).
- E2 n°8 (libellés Avant/Après de la couleur de la légende) : refusé : générateur.
