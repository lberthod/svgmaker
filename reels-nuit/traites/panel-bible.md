# Panel de 5 experts sur la bible v0 (13/11/2026)

## 3. Directeur artistique motion design — 6,5/10
La bible reprend bien l'ADN de la chaîne et la règle du magenta est forte, mais la signature n'est pas lisible à t = 0 ; le « tampon » ressemble au chiffre géant des autres séries ; le `split` contredit la règle du magenta (le territoire disparaît au lieu de changer de main).
1. Générateur (rétrocompatible) : `split.parts[].to` (couleur après) ; `split.context` pour dessiner les voisins en gris. `lost` seulement pour une partie détruite ou partagée.
2. Badge du split : il masque la forme (y 300) ; rouge proche du magenta → options `badgeY` et `badgeColor` (or / bleu nuit cerclé d'or).
3. Hook lisible dès la 1re image : `year`, magenta, `beacon` et `pill` « Traité de <lieu> » dès 0,2 s ; pas de `sub` redondant.
4. `big: { value, sub: "Signé à <lieu>", dur: 1.8 }` + option `big.anim: "stamp"` (keyframe existant) ; retirer le badge du split si le big précède.
5. Magenta trop proche des rouges #E8503A/#C0392B en petit : acteur rouge → #D9573A ; jamais de jaune pour un acteur.
6. Variété : 3 variantes de signature en rotation (a) big + split, (b) signataires `people` + `rays` + split, (c) `line` de la nouvelle frontière + split ; alterner le cadrage du hook ; pas d'image de transition vide.

## 2. Didacticien — 6,5/10
Promesse claire, mais rien sur les noms d'époque (Lotharingie, Francie, Scanie), pas de règle « une idée par scène », et le gagnant n'apparaît pas dans le split publié (panneau « après » gris).
1. Split : panneau après = magenta collé au gagnant, perdant en `lost`, étiquettes « gagne : X / perd : Y » ; panneau vide ou tout gris interdit.
2. Une idée par scène : 2 phrases max, au plus un nouveau nom propre ; une scène qui demande « et » se coupe en deux.
3. Repère d'aujourd'hui : 1re mention d'un nom d'époque → `pill` « Francie occidentale ≈ France », « Scanie = sud de la Suède ».
4. Hook : question sur un enjeu concret connu (pays, région, ville d'aujourd'hui) ; le lieu du traité écrit à l'écran, pas forcément dit ; 14 mots max.
5. Scènes 6-7 : la voix nomme le gagnant puis le perdant, phrases sujet-verbe-complément.
6. Titres réécrits : 10, 11, 12, 23, 26, 30, 32, 34, 49 (voir rapport).

## 4. Stratège formats courts — 6,5/10
Promesse forte, titres bien construits, mais le hook date + lieu est scolaire : ce qui accroche, c'est un angle d'aujourd'hui.
1. Hook : « Pourquoi/Comment <conséquence encore visible ou paradoxe> ? » ; année dans `hook.year`, lieu dans `sub`, dits seulement à la signature.
2. Pas de carte vide à 0 s : magenta et titre visibles dès la 1re image.
3. Boucle : « Et tout part de cette question : » (se raccorde à tout hook).
4. Titres réécrits : 12, 23, 10, 11, 30, 43 (« plus de 40 ans » = chiffre dit). Forts : 3, 13, 14, 15, 21, 37, 38, 42.
5. Pilote : 3 Normandie, 15 Gibraltar, 32 Trianon (ou 41 Berlin 1945) ; Verdun à éviter s'il est déjà publié.
6. Lot 1 : 14, 4, 41, 13, 21, 48, 6, 37, 12, 1 (Verdun refait sous l'angle traité).

## 1. Historien — 7/10
Sélection solide, mais titres faux ou approximatifs (Trianon, Grèce, Roskilde, Tilsit, Troyes) ; Francfort 1871 oublié alors que Hastings n'est pas un traité.
1. #4 Hastings → Turin 1860 (Nice et Savoie) ; fusionner Potsdam et Kaliningrad ; place libérée → Francfort 1871. Ajouter Turin et Francfort aux recoupements (briefs 38, 39).
2. #32 Trianon : « plus des deux tiers » (≈ 71-72 %) ; couverture + UA (Transcarpatie), AT (Burgenland), PL ; Trianon parmi les sensibles.
3. #30 Versailles : « plus d'un huitième » (≈ 13 %) ; Schleswig, Haute-Silésie, Sarre, Memel non tranchés le jour de la signature → « à décider », pas magenta.
4. #24 Grèce : « premier État indépendant des Balkans » (Serbie autonome dès 1830) ; préciser le tracé 1830 ou 1832 (Arta-Volos).
5. #13 Roskilde : « Comment la Scanie est-elle passée du Danemark à la Suède ? » ; + Bohuslän ; Bornholm et Trøndelag rendus en 1660 ; « le Blekinge ».
6. Tilsit (le radeau = rencontre, pas signature) ; Troyes (« héritier du trône ») ; Lublin (« la Volhynie et Kiev ») ; Sarre (1955 = rejet du statut européen, « sous Hitler » en 1935, sensible) ; Schleswig avant Trianon ; Meerssen recoupe la scène Lotharingie du brief Verdun.

## 5. Cartographe — 6,5/10
Classement correct en gros, mais trois sujets « OK » butent sur le trou de Kaliningrad, et `line` ne remplit pas de zone.
1. 30 Versailles, 39 Pacte, 18 Partages, 21 Tilsit : R partiel (Prusse-Orientale absente). Une donnée débloque tout : le polygone de l'oblast de Kaliningrad (Natural Earth admin-1 RUS), utile aussi pour Potsdam.
2. Schleswig, Sudètes, Haute-Silésie, secteurs de Berlin : D avec une vraie donnée → `highlight.area` (polygone [lon, lat] rempli). Les kraje ne suivent pas les Sudètes ; la zone 1 du Schleswig n'est qu'une partie de Syddanmark (zone 2 = ligne Clausen = frontière actuelle).
3. Zones 1945 : GB = SH, HH, NI, NRW ; US = BY, HE, HB ; FR = RP, SL ; URSS = MV, BB, SN, ST, TH ; Bade-Wurtemberg coupé (line ≈ 48,7° N, autoroute Karlsruhe-Ulm).
4. Trianon : Transylvanie (Alba, Bistrita-Nasaud, Brasov, Cluj, Covasna, Harghita, Hunedoara, Mures, Sibiu, Salaj), Partium (Bihor, Satu Mare, Maramures, Arad), Banat (Timis, Caras-Severin), Voïvodine (7 okrugs), + Transcarpathia, Burgenland. Données HU : comitats et villes mélangés, Veszprém en double, « Gyôr ».
5. Brexit : 232 unités ≠ 382 zones de dépouillement → regrouper en 12 régions + résultats Electoral Commission.
6. Fredrikshamn : Hamina russe dès 1743 (`line` sur la Kymi) ; Minorque et Gibraltar en points ; Llívia en point.
Magenta : bien visible sur le relief, risque à côté du rouge #E8503A et des flèches #C0392B → liseré/pulsation ou rouge brique plus sombre.

## Synthèse des décisions (bible v1)
- Hook : question sur une conséquence d'aujourd'hui (stratège + didacticien), année et lieu à l'écran dès la 1re image, dits seulement à la signature.
- Boucle : « Et tout part de cette question : ».
- Split : gagnant visible (`to`), étiquettes gagne/perd ; tampon `big` en animation `stamp` ; 3 variantes de signature en rotation.
- Rouge germanique → brique #B5523B ; Russie/URSS hors carte → flèches #8E2A2A ; jamais de jaune pour un acteur.
- Une idée par scène, repère d'aujourd'hui pour chaque nom d'époque, gagnant puis perdant dans la voix.
- Programme : 8 remplacements, Kaliningrad demandé à la session empires, zones « à décider » hachurées/grises (pas magenta).
