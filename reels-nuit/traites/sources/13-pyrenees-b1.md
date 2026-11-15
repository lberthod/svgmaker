# 13-pyrenees — boucle d'audit 1 → 2

## Corrections appliquées
- E1 (Fenouillèdes, français depuis 1258) : Pyrénées-Orientales remplacées partout (hook, 1635, signature, split, Aujourd'hui) par une `area` « Roussillon » = PO moins le Fenouillèdes (66 points, contour Natural Earth découpé au nord vers 42,70-42,85° N, de 2,17 à 2,80° E) ; Fenouillèdes en `area` bleue `keep:true` dès 1635 et part bleue dans le split.
- E1 : Marie-Thérèse sans barbe, nattes, cheveux blonds (`beard:false`, `style:"braids"`, `hair` en surcharge du preset `roi`, accepté par `person({...preset,...pe})`) ; Louis XIV sans barbe, cheveux bruns.
- E1 : Capcir ajouté à la voix (scène crête) + label « Capcir » [2.07,42.7].
- E1 : bulle du rebelle « Visca la terra ! ».
- E1/E2 : « presque partout la crête » (scène crête et Aujourd'hui) ; Aujourd'hui : « Aujourd'hui, la frontière de 1659 suit encore, presque partout, la crête. ».
- E1/E2/E5/E6 : sub du split « La France gagne, l'Espagne perd » (Artois retiré).
- E1 : Perpignan passe en bleu (petite `area` au mot « Perpignan », scène révolte).
- E2/E3/E4/E5 : flèche « France » 1635 : from [2.4,43.6] → to [2.75,42.85], `at` « déclare » -0,2, `dur` 1,3 (sous le titre, vers le front, finie avant la coupe).
- E2/E3/E4/E5 : flèche « Armée française » from [2.6,43.0].
- E2 : sous-titre hook « Il était espagnol : une paix signée sur une île l'a rendu français. » (coupe sur la ponctuation).
- E2/E3 : pastille « Cerdagne française » déplacée [2.08,42.45] (hors de Mont-Louis, loin de la pastille Llívia) ; E3 : label « Espagne » [1.95,42.37] dans le zoom Llívia.
- E3/E6 : frontière `line` (crête et Aujourd'hui) retracée sur la vraie limite PO/Girona, 40 sommets de Cerbère au tripoint d'Andorre, Llívia au nord.
- E3/E5/E6 : hook élargi `focus` = `open` = [-2.4,41.3,3.6,44.0] : beacon île des Faisans visible dès 0 s ; labels France/Espagne replacés sur la terre, pastille Roussillon `side:"b"`.
- E3/E5 : pastille « Contours actuels » → « Roussillon / frontières approximatives » [2.6,42.6].
- E3/E5 : label « Catalogne » [1.3,41.95] scène révolte ; rebelle déplacé à Barcelone [2.17,41.5], pastille « Révolte catalane / Barcelone, 1640 ».
- E4/E5/E6 : scène crête : bleu posé à « gagne » +3,6 s (fin du split) ; labels Roussillon, Conflent, Vallespir, Cerdagne, Capcir de +3,9 à +5,1 s (tous visibles avant la coupe).
- E4 : signature : Louis XIV au mot « infante » -0,3, Marie-Thérèse au mot « mariage » -0,4 (après le parchemin).
- E5 : stats Llívia à « ville » +0,4, `dur` 3,2 : la 2e phrase (« entourée par la France ») se joue sur la carte.
- E4 : Aujourd'hui : highlights à 0,6 s (fin du fondu, plus de violet) et `keep:true`.
- E6/E4 : final sans recoloriage (l'état d'Aujourd'hui reste par `keep`), `focus` = boîte d'ouverture large (dézoom final, dernière image = première, magenta aux deux bouts : raccord de boucle sans saut).

## Corrections refusées
- E1 : presets `infante` / `jeune-roi` dans src/kit/people.mjs : refusé : générateur (résolu côté brief par surcharge).
- E2 n°4 (en-tête du split transparent), E2 n°6 (libellés stats loin du chiffre), E3 n°8 (fondu bleu→magenta violet, au générateur) , E3 n°1 option `line.border` : refusé : générateur.
- E4 n°7 (highlight du hook à 0,15) : refusé, la bible impose le magenta à `at: 0` ; le raccord est réglé par le magenta gardé au final.
- E4 n°5 (`treaty` `dur` 3,0) : refusé, bible 3,5 à 4 s ; seuls les personnages sont décalés.
- E5 n°3 (Haute-Garonne dans le split) : refusé, le split passe à 8 parts avec le Fenouillèdes (au-delà, le liseré s'affine).
- E5 n°8 (supprimer le beacon des Faisans) : refusé, la bible exige le beacon ; hook élargi à la place.
- E3 n°5 (Catalogne en contour blanc) : refusé, contour de région non prévu par `highlight` ; label « Catalogne » à la place.
- E2 n°5 (label France du hook [1.6,42.85]) : remplacé par le nouveau placement du hook élargi.
- Timeline : aucune dans ce brief (`spread` sans objet).

## Durée
- `new` sans cache : 114,6 s estimées (b1 : 112,7 s → 75,8 s réelles) ⇒ ≈ 77 s réelles. 1259 caractères dits (b1 : 1230).
