# 48-tchecoslovaquie — corrections boucle 1 → 2

## Appliquées
- Rythme et caméra (experts 4, 6, note de boucle) · 10 scènes, 10 cadres différents : hook et final en vue large `[3,42.5,31,56]` (= `open`, une ouverture large sur deux, Trianon large / Berlin serré / ici large), 1918 avec la Ruthénie `[11.5,46.8,25.2,51.6]`, 1989 serré sur la Bohême, juin 1992 `[13.6,47.3,22.8,50.5]`, Brno `[14.6,48.0,18.8,50.2]`, vote `[11.8,47.0,23.0,51.4]`, minuit serré sur la Slovaquie `[14.6,47.4,22.8,50.4]`, partage Prague → Bratislava `[13.0,47.4,19.8,50.8]`, « Aujourd'hui » serré sur la frontière `[15.6,47.2,20.8,49.9]`. Chaque scène a son événement : étiquettes en cascade, Ruthénie, rebelle, Klaus/Meciar + tracé de la frontière intérieure, timeline, parchemin + magenta, split + recoloriage, flèche + barres, frontière blanche.
- Expert 3.4 · scène « 1918 – 1989 » coupée en deux (« 1918 » avec la Ruthénie, keep false ; « 1989 » sans elle, violet keep true) : plus d'anachronisme Ruthénie violette en 1989.
- Experts 1.4, 6.1 · l'acte = la loi : hook `sub` « Loi de dissolution, Prague », beacon sur Prague ; final `sub` « Loi de dissolution, 1992 », beacon Prague. Brno reste la scène de crise.
- Expert 1.2 · parchemin `title` « Loi de dissolution », `sub` « votée le 25 nov. 1992, voulue par : » (sans n° pour la longueur).
- Expert 1.3 · scène 5 say[1] : « Il n'y a pas de référendum ; environ un habitant sur trois veut la séparation. » (sondage sept. 1992 : 36-37 %).
- Experts 5.3 / 1.5 · final say[0] : « Voilà pourquoi aucune guerre : la frontière existait déjà, et tout s'est négocié. » ; mis en place en juin 1992 par une `line` lavande sur la frontière tchéco-slovaque + pill « Frontière intérieure / entre deux républiques » (remplace la pill Bratislava, le beacon vert reste).
- Expert 5.7 · hook say[1] sans « référendum » répété : « La Tchécoslovaquie devient la Tchéquie et la Slovaquie, sans une goutte de sang. » ; labels Tchéquie/Slovaquie calés sur ces mots.
- Experts 1.6, 2.3 · « Václav Klaus », « Vladimír Meciar » (étiquettes, parchemin) ; labels « Klaus »/« Meciar » ajoutés aux personnages de Brno (expert 5.5).
- Expert 1.8 · bulle de Klaus « Fédération forte, ou séparation ! ».
- Experts 1.1, 2.2, 3.2, 5.1 · scène 1918 : Autriche `[15.2,47.9]`, Hongrie `[19.8,47.4]`, pastille Tchécoslovaquie `[15.6,49.7]` side t (libère la Moravie).
- Experts 5.4 · pill « Frontières de 1920 » → « Ruthénie / auj. Ukraine ».
- Experts 2.1, 3.1, 3.6, 6 (hors domaine) · « Aujourd'hui » recadré et étiquettes repositionnées dans leur pays, hors bande des sous-titres (Hongrie `[19.6,47.75]`, Slovaquie `[19.6,48.6]`, Pologne `[19.0,49.95]`, Autriche `[16.5,48.15]`, Tchéquie `[17.0,49.55]`) ; pill « Frontière ouverte » side b `[18.35,49.32]`.
- Expert 4.3 · frontière blanche sur « Union », draw 1,5 ; pill sur le début de la phrase 2 (plus de 1 s visible avant la coupe).
- Experts 3.3, 6.5, 4.8 · Brno élargi (frontière, Morava, label Autriche) : plus d'écran tout violet.
- Expert 4.4 · timeline sur « villa », dur 3,5, `spread: true`.
- Expert 4.5 · barres sur {line 1, d −0,3}, dur 3,5.
- Experts 4.7, 5.6 · minuit : Slovaquie verte à {line 0, d 4,3} (fin du split), plus de retour au violet ; labels Pologne/Hongrie ajoutés (expert 3.5).
- Expert 6.3 · légende du split « détaché » (bible, séparation) ; expert 2.8 · `sub` « la fédération coupée en deux ».
- Expert 2.7 · pill Assemblée fédérale side b.
- Expert 2.4 · scène juin 1992 say[0] : « … élisent deux chefs opposés. »
- Experts 2.5, 1.7, 3.7 · partage : « Les biens fédéraux sont partagés à deux pour un, comme la population. » / « Les Tchèques sont environ 10 millions, les Slovaques environ 5 millions. » ; flèche depuis Prague (siège fédéral) vers Bratislava, label « 1/3 des biens fédéraux ».
- Expert 4.6 · final avec les couleurs du hook (Tchéquie violette + Slovaquie magenta) et le même cadre que `open` : boucle continue.

## Refusées
- Expert 6.2 (1re phrase nommant un pays d'aujourd'hui) : la 1re phrase reste le titre du programme mot pour mot ; la Tchéquie et la Slovaquie sont nommées dès la 2e phrase et à l'écran.
- Expert 1.6 « Mečiar » : police sans č (bible) → « Meciar ».
- Expert 5.2 (supprimer la flèche) : gardée, corrigée (Prague → Bratislava, « biens fédéraux »), sinon la 1re phrase de la scène n'a pas d'événement visuel.
- Expert 1.2 « n° 542/1992 » dans le sous-titre du parchemin : trop long.
- Expert 6.4 box `[-4,40,34,58]` : remplacée par `[3,42.5,31,56]` (pays encore lisibles, étiquettes sans collision).
- refusé : générateur — avancée lente de caméra dans une scène (4.1), queue finale ≤ 0,8 s (4.6), retrait/alignement de la timeline (2.6, 5.8), insécables après nombres (2.5), étiquettes repoussées hors de leur pays (3.1, 5.1), `until` sur les highlights (3.4).

## Durée
`new` : 89,3 s (voix en cache pour 12 répliques, 6 nouvelles estimées à 0,065 s/car.). Les répliques changées font 441 car. contre 422 avant ; à la vitesse réelle mesurée (≈ 0,045 s/car.) + la scène ajoutée : ≈ 77-78 s réelles (< 82 s).
