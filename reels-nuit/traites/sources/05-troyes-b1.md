# 05-troyes — boucle d'audit 1 → 2 : journal des corrections
Notes b1 : 7 / 6,5 / 6 / 6 / 5,5 / 6,5. Priorité : pédagogie (qui tient quoi en 1420, ce que promet le traité, une idée par scène).

## Appliquées
- Pédagogie (consigne) · ancienne scène 3 coupée en deux : « La France coupée en trois » (dauphin au sud de la Loire + phrase « La France est coupée en trois : Anglais, Bourguignons et dauphin. », labels Anglais / Bourguignons / Dauphin posés sur la terre au mot dit) puis nouvelle scène « Le meurtre de Montereau » (beacon + pastille au mot « tuent », Philippe le Bon « nouveau duc », flèche orange Bourgogne → Normandie au mot « allie »). 10 scènes.
- Pédagogie (consigne) · la promesse du traité dite en clair (scène 5, say[1]) : « Henri V gouverne à la place du roi malade, et sera roi après lui. »
- Experts 1/5/6 · contresens Montereau : « des partisans du dauphin tuent le duc de Bourgogne à Montereau. » / « Pour se venger, le fils du duc s'allie aux Anglais. »
- Experts 1/3/5/6 · split : le Sud du dauphin en #4FA3E0 sans `to` ; seule la zone gouvernée par Henri V après 1420 (Île-de-France, Eure-et-Loir, Picardie, Champagne : 16 départements) en magenta → #9AA6FF ; Bourgogne/Nord/Pas-de-Calais orange ; Bretagne grise. Titre de l'art « Le Nord à Henri V ».
- Expert 6 n°1 / expert 2 · légende : gagnant d'abord (cédé, Henri V, le dauphin, Bourguignons) ; « Bourgogne » → « Bourguignons ».
- Experts 3 n°6 / 6 n°2-3 · magenta du hook, de la signature, d'« Aujourd'hui » et du final réduit à ces 16 départements (Bretagne et Sud retirés) ; « Aujourd'hui » repasse en magenta (plus de bleu dauphin sur toute la France).
- Expert 1 n°3 · hook : texte et 1re phrase identiques, « …l'héritier du trône de France ? ».
- Expert 1 n°4 · « perd la couronne, mais garde le Sud » supprimé (le traité ne lui laisse rien) ; le déshéritement reste dit dans le hook.
- Expert 1 n°6 · titre « Charles VII reprend le royaume » ; voix « …fait sacrer le dauphin à Reims : Charles VII. »
- Expert 1 n°2 · Paris n'est plus bleue en 1429 : seules Marne, Aube, Aisne au mot « sacrer » ; le reste du Nord, la Normandie et la Guyenne à la phrase de 1453.
- Expert 1 n°7 · parchemin `sub` « 21 mai 1420, scellé au nom de : » ; voix « signé au nom du roi ».
- Expert 4 n°1-2 · timeline retirée de la scène du dauphin, déplacée dans « Un roi anglais à Paris » (1420 héritier / août 1422 Henri V meurt / oct. 1422 Charles VI meurt), `spread: true`, `dur` 4, titre « Le plan déraille ».
- Expert 5 n°7 · pastille « Henri VI, roi à moins d'un an » sur Paris (side r) au mot « bébé ».
- Expert 5 n°6 · label « Paris » (scènes 3 et 6), rois déplacés à [2.35, 49.3].
- Expert 4 n°3 / 6 n°5 / 2 / 3 n°8 · « Troyes » à [4.074, 47.85], `when` 0,3 ; split `dur` 4,6.
- Experts 2/5 · bulle du hook déplacée à [0.0, 47.6] ; expert 4 n°6 : entrée à 1,2 s.
- Expert 3 n°8 · « Frontières approximatives » en mer [-3.6, 45.6] (légende générale, pas un lieu).
- Experts 2/3/4 · scène Normandie : focus [-3.6, 42.4, 4.2, 52.4], Henri V à [-0.3, 47.6], flèche depuis [0.4, 49.3], pastille Azincourt side t.
- Expert 6 n°5 · Guyenne sub « anglaise (Gironde) » ; pastille « Bourguignons / parti du duc de Bourgogne » (remplace le label) ; dauphin sub « le prince héritier » (repère d'aujourd'hui). Le signe « ≈ » est absent des polices : remplacé.
- Experts 3/4/5 · scène 1429-1453 : focus [-3.6, 42.2, 7.4, 52.4], flèche de Jeanne jusqu'à Reims [4.03, 49.25], label Reims [4.03, 49.0], pastille Calais side l au mot « Calais ».
- Experts 2/3 · « Aujourd'hui » : focus [-5.8, 41.0, 9, 52.8], pastille « Ligne de 1420 » à [-0.4, 47.4] (ne couvre plus le trait), « Royaume-Uni » sur l'île [-1.5, 52.4] ; titre « La ligne de 1420 a disparu ».
- Durée : phrases resserrées (fils du duc, Calais, Charles VII) : 1 229 caractères (1 156 en b1, rendu 74,4 s) → ≈ 79-80 s réelles, sous 82 s.

## Refusées
- Expert 4 n°7 (hook `highlight.at` 0,4) : la bible impose le magenta dès 0 s.
- Expert 4 n°3 (traité calé sur « Troyes ») : la bible cale le parchemin sur « signé » ; Troyes apparaît déjà ≈ 1,5 s avant.
- Experts 1/2 (légende « promis à Henri V ») : 4 pastilles imposent ≤ 12 caractères ; « cédé » reste juste pour la zone montrée, gouvernée par Henri V régent dès 1420.
- Expert 3 n°1 (Picardie et Champagne en orange dans le split) : experts 5/6 retenus, ces provinces passent sous la régence d'Henri V après Troyes.
- Expert 6 n°4 (art `compare`) : `compare` met deux pays à l'échelle, il ne sert pas à comparer deux statuts ; treaty + split + timeline = 3 arts, durée sous 82 s.
- Expert 6 n°2 (`keep: true` sur le magenta de la signature) : la scène suivante repeint la zone au gagnant ; `keep: false` évite un magenta résiduel.
- Expert 5 n°8 (labels « anglo-bourguignon » / « dauphin » dans « Aujourd'hui ») : la bible veut les pays actuels ; le magenta marque déjà le côté d'Henri V.
- Expert 3 n°7 (pastille « Orléans ») : nom propre non dit à la voix ; étiquette du move supprimée à la place.
- Experts 2/5 (position des étiquettes de `moves` « Anglais », « Jeanne d'Arc ») : refusé : générateur (pas de `label.at` ; étiquette forcée au milieu de la flèche) → étiquettes retirées.
- Expert 4 n°5 (flèche qui se redessine en boucle) : refusé : générateur (format.mjs, `moves`).
- Expert 2 (Calais side b) : side l retenu (experts 5/6), la pastille sort de la carte vers la Manche.
- Rappel : `Seien-et-Marne` est le nom dans eu-regions.json (coquille des données), conservé.

## Validation
- `node bin/svgmaker.mjs new reels-nuit/traites/briefs/05-troyes.json` : OK, 104,8 s estimées (le b1 donnait 112,8 s estimées pour 74,4 s réelles).
