# 12-roskilde — boucle d'audit 1 → 2 (notes b1 : 7 / 6,5 / 6,5 / 6 / 6,5 / 7)

## Corrections appliquées
- E4 n°1, E2 n°3, E5 n°2 : Charles X Gustave à [9.9, 56.6] (étiquette dans le cadre), entrée sur « roi » de la réplique 2 (au lieu de « Jutland » d+0,4).
- E5 n°3 : bulle de Charles X « Demi-tour ! » → « Au Danemark ! ».
- E3 n°1 : flèche « Armée suédoise » par voie de terre en 2 segments [18,53.2]→[10.2,53.7] (Poméranie, Mecklembourg) puis [10.2,53.7]→[9.5,55.5] (Holstein, Schleswig), enchaînés.
- E4 n°5, E3 n°1, E5 n°2 : Frédéric III déplacé sur le Seeland [12.4, 55.75], `size` 170 (plus sous la flèche).
- E4 n°6 : label « Pologne » entre dès « Suède » de la réplique 1 (nouvel élément pendant la 1re phrase).
- E2 n°3, E5 n°2 : label « Jutland » à [9.1, 55.5] (plus sous les cartouches).
- E2 n°2 : titre scène 1657 « Le Danemark attaque » (2 lignes au lieu de 3).
- E1 n°3 : année de la scène « Juin 1657 » → « 1657 » (conquête du Jutland jusqu'en octobre).
- E1 n°4 : année de la traversée « Janvier 1658 » → « Janv.-févr. 1658 ».
- E4 n°4 : 1re flèche de la traversée sur « soldats » (début de scène plus vide).
- E5 n°5 : pastille Petit-Belt `side: "l"` (plus sous « Sur la glace ») ; labels « Fionie » et « Lolland » (32 px) pour le « d'île en île ».
- E3 n°7 : pastille Grand-Belt à [10.98, 55.3] (Grand-Belt, plus sur Langeland), `side: "t"` ; label Seeland à [11.95, 55.5].
- E4 n°3 : flèche du 11 février sur « armée » (d −0,3).
- E1 n°5 : « débarque au Seeland » → « atteint le Seeland » (arrivée à pied sur la glace).
- E1 n°6 : réplique 2 → « Pris de court, le roi danois accepte une paix préliminaire, une semaine plus tard. » (Taastrup, 18 février ; nom non ajouté : un nom propre par scène).
- E5 n°6 : 4e ligne de la frise « 18 févr. 1658 · Paix préliminaire » (orange).
- Consigne : frise `spread: true`.
- E2 n°5, E4 n°8 : frise à {line 1, d +0,4} (le débarquement et Copenhague restent visibles) ; label « Seeland » ajouté dans la scène.
- E1 n°2 : split, Bornholm ajouté en `area` magenta → bleu (vrai pour « Après 1658 ») ; titre « Quatre provinces cédées » → « Les terres cédées » (Roskilde en cède six).
- E4 n°7 : labels Scanie, Halland, Blekinge, Bohuslän après la fin du split ({line 1, d 3,9} puis +0,25 s chacun).
- E4 n°2, E5 n°4, E1 n°8, E3 n°3 : scène 1658-1660 coupée en deux : « 1658 · Deux prises de plus » (`focus` [3.5,52.6,19.5,65], Bornholm hors sous-titres, `beacon` sur Bornholm, pastille `side: "t"` à [14.92,55.25]) puis « 1660 · Deux prises rendues » (zoom [10.4,54.3,16,57], beacon Copenhague d −0,4, pastille Copenhague, Trøndelag et Bornholm repassent à l'orange sur « rend »).
- E1 n°1, E3 n°4 : Scanie, Halland, Blekinge et Bohuslän en bleu `keep` à `at: 0` dans la scène 1658 (plus de flash orange après la signature).
- E3 n°8 : pastille Trøndelag ancrée à [11.6, 64.0], `side: "r"`.
- E3 n°2 : Norvège orange `keep: true` dès 1657 (le Bohuslän n'est plus détaché de son royaume) ; highlight Norvège redondant de 1658-1660 supprimé.
- E2 n°4 : pastille « Le détroit » à [12.62, 55.9] `side: "b"`, Halland à [12.85, 56.9] ; E5 n°7 : sous-titre Halland « gage suédois depuis 1645 » (explique la contradiction orange/gage).
- E6 n°1, E5 n°1, E2 n°1, E1 n°7 : question du hook « Pourquoi la Scanie est-elle suédoise ? » (`text` = `say[0]`, 1 bloc de sous-titre) ; pastille du hook « Scanie / contours actuels ».
- E6 n°4, E5 n°1, E1 n°7 : final `text` « La Scanie devenue suédoise » ; voix « Voilà pourquoi la Scanie est suédoise : le Danemark-Norvège l'a cédée à Roskilde. »
- E6 n°5 (en partie) : accroche plus large `open` = hook = final [2, 51, 26, 64] (Baltique visible, zoom réel vers la scène 1657, image différente de « Aujourd'hui »).
- E3 n°5 (en partie) : `line.width` 14 → 8 ; E6 n°3 : frontière prolongée vers le Kattegat [12.4, 56.6] et 2e tracé (`line.parts`) sur l'Idefjord.
- E5 n°8 : « Aujourd'hui » réplique 2 → « Le Danemark ne tient plus qu'une rive du détroit ; un pont les relie depuis 2000. » (reprend l'enjeu du péage) ; pastille Pont à [12.82, 55.57] `side: "b"`, pastille « Sud de la Suède » à [14.0, 56.3] (E2 n°7).

## Corrections refusées
- E2 n°6 (contraste « Après » bleu dans le split) : générateur.
- E2 n°8 (« 30 janv. » coupé à l'entrée de la frise) : générateur.
- E3 n°5 (cadrage Øresund [11.4,55.0,14.4,56.6], labels Copenhague/Malmö, 2e ligne pour le pont) : la bible exige le territoire en magenta visible dans « Aujourd'hui » (Halland, Bohuslän hors cadre sinon) ; la voix ne dit plus « Copenhague » ; un trait blanc pour le pont se confondrait avec la frontière (pastille pointée sur le pont à la place).
- E3 n°6 (duchés de Schleswig-Holstein + pastille) : statut partagé avec Holstein-Gottorp (allié suédois), nom propre de plus ; hors sujet du traité.
- E6 n°2 (art stats « un tiers du territoire danois ») : chiffre non sourcé ici, + 4 s ; la scène est déjà coupée en deux avec un mouvement de caméra ; 3 arts (treaty, split, timeline), conforme.
- E6 n°5 (ouverture [-2, 50, 30, 66]) : réduite à [2, 51, 26, 64], sinon le territoire magenta fait moins de 120 px à t = 0.
- E5 n°1 (« Comment la Scanie, au sud de la Suède, est-elle devenue suédoise ? ») : trop longue (3 lignes) ; version courte d'E6 retenue.
- E1 (mention calendrier julien) : facultative, non ajoutée.

## Durée
- `new` : 86,6 s affichées (voix en cache mêlée aux estimations des répliques modifiées). Texte dit 1 246 caractères (1 250 avant) pour 10 scènes au lieu de 9 : ≈ 78 s réelles attendues (rendu b1 : 76,9 s), sous 82 s.
