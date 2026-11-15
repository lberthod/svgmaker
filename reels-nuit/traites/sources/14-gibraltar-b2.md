# 14-gibraltar — boucle d'audit 2 → 3

Notes b2 : 8 / 7 / 6 / 7 / 6 / 7. Brief : reels-nuit/traites/briefs/14-gibraltar.json.

## Corrections appliquées
- Producteur (1) : Espagne plus coloriée dans les cadres serrés (hook, 1704, 1713, Aujourd'hui, final) : `keep:true` orange supprimé ; Espagne nommée par une pill « Espagne » (terre, côté gauche) ; Espagne orange seulement dans les vues larges (1700 et pertes 1713-1714, `keep:false`).
- Producteur (2) / E3, E5, E6 : rocher coloré et visible au hook : `Gibraltar` ajouté à `base.countries` (mode monde automatique : le polygone Natural Earth de Gibraltar entre dans le découpage des terres, l'area n'est plus grise), highlight = `countries:["Gibraltar"]` + area ; `open` et `focus` du hook/final/1713 = [-5.75,35.95,-4.95,36.32] (zoom ≈ 5,6, rocher ≈ 47 × 91 px au lieu de 17 × 33).
- Producteur (3) / E1 n°5, E3, E5 : archiduc déplacé à [12.4,47.9], cartouche « Charles / d'Autriche » (plus court), cadre de la scène 1701 décalé à l'est [-4.5,38.5,19.5,53.5] ; étiquette « Autriche » sur Vienne [16.4,47.7] ; audit : plus d'alerte de marge ni d'icônes.
- Producteur (4) : scène Utrecht : pill Grande-Bretagne remplacée par des labels « Grande-Bretagne » / « auj. Royaume-Uni » / « Pays-Bas » avec `until` (retirés avant le parchemin) ; audit : plus de textes superposés.
- E1 n°1 : `say[0]` scène 1701 = « Il lègue son trône à Philippe ; l'Autriche le veut pour l'archiduc Charles. » (testament de Charles II).
- E1 n°2 : `say[1]` = « Anglais et Néerlandais s'allient à l'Autriche : la guerre dure plus de dix ans. » (Grande Alliance 1701, sans prêter en 1701 le soutien à la candidature de Charles, venu en 1703).
- E1 n°3 : pastille des pertes « auj. Belgique, Luxembourg ».
- E1 n°4 : scène 1700 `say[1]` = « Il règne aussi sur Milan, Naples, la Sicile, la Sardaigne et la Belgique actuelle. »
- E3 (Milanais) : Novara, Alessandria, Verbano-Cusio-Ossola ajoutées en 1700 ; Novara et Verbano-Cusio-Ossola dans les gains autrichiens.
- E2, E5, E6 (Aujourd'hui) : titre « Toujours britannique » ; beacon supprimé ; `line.width` 22 sans label ; label « Frontière actuelle » sur la terre espagnole [-5.37,36.2] ; pile « Gibraltar / Toujours là » côté droit, en mer, rocher dégagé ; cadre [-5.7,35.98,-5.0,36.29] (zoom ≈ 6,3, moins de contour vectoriel grossier).
- E2 : sous-titre 99 % : « En 2002, ses habitants refusent, à environ 99 %, une souveraineté partagée. » (coupures sur les virgules).
- E2, E5, E6 (1704) : titre « La prise de Gibraltar » (2 lignes max) ; cadre serré [-5.85,35.95,-5.05,36.32] ; rocher orange (espagnol) puis bleu au mot « prend » (`keep`) ; beacon bleu ; flotte depuis le détroit ; label Maroc supprimé (hors voix, zone des sous-titres).
- E4 (1704) : pill « Anglais » bleue sous le rocher au mot « Anglais » (fin de l'image figée).
- E4 : parchemin `dur` 5,2 au mot « Grande-Bretagne » (couvre « renonce au trône de France ») ; split `dur` 5.
- E5, E2, E6 (split) : parts redessinées sur la baie : côte espagnole de La Línea à Algésiras et rocher détaillé (E3) : rocher ≈ 21 % de la largeur, 42 % de la hauteur du panneau ; `sub` = « la ville, le port et le château ».
- E4 : scène 1700 : pill Pays-Bas espagnols au mot « Milan », « Contours actuels » au mot « Sicile » ; surlignages au mot « règne ».
- E4 : troupes autrichiennes partent de [14.5,46.05] (terres des Habsbourg, Carniole) vers Milan, sous le cartouche de Charles.
- E2 : labels Angleterre [-1.8,52.9] et Pays-Bas [6.4,53.3] hors des soldats.
- E2, E6 : pertes : Savoie `side:"l"`, Minorque `side:"b"` ; E4 : Minorque (area + pill) au mot « Britanniques » ; label Espagne `when` 1,8.
- E5 : flèche des navires en mer [-8.0,35.95] → [-2.4,36.15] ; « Méditerranée » à [-3.4,35.75].
- E2 : pastille Utrecht `when` 1.
- E6 : trois rois différenciés : Philippe en orange (Espagne), Charles en brique #B5523B (Autriche), sans barbe ; Charles II garde la tenue royale.
- E3, E5 (raccord de terrain) : boîte z10 supprimée (aucune scène intermédiaire ne l'utilise) ; boîte z12 élargie [-6.15,35.25,-4.55,37.05] px 3000 : elle couvre tout l'écran des cadres serrés, fondu compris.
- Durée : 1351 caractères lus (1359 avant) ; `new` sans cache : 119,4 s estimées (119,9 avant, rendu 83,6 s) → ≈ 83 s réelles.
- À faire avant rendu : relancer relief.py (mode monde → fichiers `-w` : z6, z8 et nouvelle z12) puis audio.py.

## Corrections refusées
- E3 n°1 (option `clip:false` dans format.mjs) : refusé : générateur ; résolu dans le brief par `base.countries` + `Gibraltar`.
- E1 n°2 variante `year` « 1701 – 1714 » : remplacée par la reformulation de la voix.
- E3 (Vercelli dans le Milanais) : refusé, Vercelli était savoyarde en 1700 ; Alessandria non coloriée dans les gains autrichiens (passée à la Savoie en 1707-1713).
- E5 (supprimer la pastille « Toujours là ») : refusé, la bible l'impose ; déplacée pour dégager le rocher.
- E6 (treaty et split dans la même scène) : refusé, l'ordre est tenu ; la caméra doit passer d'Utrecht à Gibraltar entre les deux.
- E6 (Charles II remplacé par une pastille) : refusé, tenues différenciées à la place.
- E6 (stats au mot « refusent ») : refusé, la carte reste déjà seule ≈ 6 s pendant la 1re phrase.
- E5 (pill Gibraltar à l'ouest de la baie) : remplacé par `side:"r"` (boîte en mer, rocher dégagé).
- E2 (« 13 juillet 1713 » en minuscules) : gardé, conforme.
- E6 (fondu d'entrée à t=0, image vide) : refusé : générateur.
- E3, E5 (différence de teinte de mer entre z8 et z12 dans la scène « porte de la Méditerranée ») : refusé : générateur (un `terrain[].scenes` non contigu n'est pas possible et ferait disparaître la z12 à la dernière image) ; le raccord reste visible seulement dans cette vue régionale.
- Alerte « @terranarrata » sous la zone sûre : refusé : générateur.
- Sous-textes < 32 px : faux positifs.
