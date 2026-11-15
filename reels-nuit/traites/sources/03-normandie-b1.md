# 03-normandie — boucle d'audit 1 → 2 : journal des corrections

## Appliquées
- Producteur 1 · magenta : hook magenta (keep false) ; scène 841 : basse Seine en bleu franc #4FA3E0 posée une fois (keep true) ; scènes 2-4 sans highlight ; accord : bascule magenta (at 0) ; 924-933 : brique #B5523B (keep true) ; « Aujourd'hui » et final : magenta.
- Producteur 2 · split : before « Avant 911 », after « Après 911 », legend cédé / Rollon / le roi.
- Producteur 3 / expert 4 n°1 · plus de recoloriage identique : un seul highlight posé par couleur, chaque scène a un événement nouveau (flèches, Rollon, combat + repli, personnages, parchemin, extension, ligne de l'Epte).
- Expert 1 · Epte = « une partie de la limite » (scène 8 say[0]).
- Expert 1 · 924 = « le nouveau roi Raoul » (scène 7 say[0]).
- Expert 1 · 933 = « le Cotentin et l'Avranchin » ; îles retirées de la scène 7 (et de la scène 8) ; pastille « Avranchin » ajoutée.
- Expert 1 · baptême : « Rollon promet le baptême ».
- Expert 1 · final sub → « Saint-Clair-sur-Epte, 911 ».
- Expert 1 · timeline titre → « De 841 à 911 » ; voix « Après des décennies de raids » (plus de « 70 ans » faux depuis 820).
- Expert 1 · split : Calvados et Orne retirés des parts (ils n'étaient pas au roi).
- Expert 5 · split : Paris (et Yvelines, Somme) en bleu pour ancrer le royaume.
- Experts 1/3/6 · « Royaume-Uni » déplacé sur la terre anglaise [0.6, 50.97].
- Experts 3/5 · Chartres et Paris nommés (labels scène 4) ; Rouen en side « r » (scène 2) ; label Rouen ramené sur Rouen [1.099, 49.40] (scène 3).
- Experts 3/4/5 · Rollon déplacé hors de Rouen [0.55, 49.78] (scènes 3 et 5), le halo de Rouen reste visible.
- Expert 3 n°5 · flèche viking depuis l'estuaire [-0.1, 49.47] ; expert 5 : arrivée [0.95, 49.48], hors pastille Rouen.
- Experts 2/5 · « Armée franque » part de [2.6, 48.7], hors des silhouettes.
- Expert 4 n°2 · repli de Rollon animé au mot « repousse » ; timeline retardée (« raids » + 0,3 s).
- Expert 4 n°3 · Rollon apparaît au mot « Rollon » (scène 5).
- Expert 4 n°4-5 · treaty calé sur « signent », magenta et halo à 0, split au début de la phrase 2 (−0,4 s) pour tenir 4 s.
- Experts 2/4/5 · bulle du hook déplacée [0.7, 49.35], size 200, au mot « roi ».
- Expert 6 n°1 · ouverture : `open` = cadrage du hook (titre et magenta lisibles dès la 1re image, boucle conservée).
- Expert 6 n°4 · « Aujourd'hui » : seules Seine-Maritime et Eure en magenta, Calvados/Orne/Manche restent brique.
- Expert 6 n°5 · titre « Aujourd'hui » → « L'Epte sépare toujours deux régions ».
- Producteur 5 / experts 4-5 · « Aujourd'hui » cadré [-0.4, 48.2, 3.8, 50.4] (Epte au centre), line.width 14, draw 2,2 s ; étiquette de ligne remplacée par une pastille « L'Epte, 911 » side « r » (ne couvre plus le trait) ; « Normandie / toujours là » à l'ouest [0.9, 49.0], « France » au sud [1.6, 47.95].
- Expert 5 · « Frontières approximatives » avancée à when 0,8.
- Producteur 6 / expert 2 n°1 · toutes les phrases réécrites : coupures de sous-titres sur la ponctuation, 10 à 14 mots (hook et boucle exceptés).

## Refusées
- Expert 1 · « 70 ans de raids sur Rouen » : 885 (Paris) n'est pas Rouen ; remplacé par « De 841 à 911 ».
- Expert 3 n°4 / « Manche en bleu dans parts » : le département de la Manche n'était pas au roi (Bretons) ; mer et Seine dans le split = générateur (src/ interdit).
- Expert 3 n°8 et expert 5 (îles) : sans objet, les îles sont retirées (tradition non sûre).
- Expert 3 n°6 · sub « région française » : la bible impose « toujours là » ; « France » placé sous la Normandie suffit.
- Expert 6 n°2 · cadrage Europe large + Bretagne/Flandre et suppression de la pastille Rouen : un seul nom propre nouveau par scène, et Rouen est dit à la voix (doit être nommé).
- Expert 6 n°3 · art `compare` en scène 924-933 : il masquerait l'extension par étapes sur la carte (saluée par les experts 3, 4, 5) ; 3 arts déjà présents.
- Experts 2 n°3-5-7, 2 n°4, 3 n°4, 3 n°7, 4 n°1 (fondu), 5 (split mer) : corrections du générateur (art.mjs / format.mjs), hors périmètre.
- Expert 4 n°7 · focus [-2.8, 48.0, 3.4, 50.7] : remplacé par le cadrage centré sur l'Epte demandé par le producteur.
- Terrain : cadrage « Aujourd'hui » limité à la couche de relief existante (pas de nouveau relief.py).
