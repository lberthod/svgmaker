# Bible — « Le jour où la carte a changé » (`traites`) — v1.1 (en attente de l'accord de Loïc)

**Promesse.** Un traité, un jour, un lieu : la carte juste avant, la carte juste après, qui gagne, qui perd, et ce qu'il en reste aujourd'hui.

## Signature : 4 éléments identiques dans les 50 épisodes
1. **Ouverture.** 1re image (`at: 0`) : `year` = année du traité, `text` = la question courte, `sub` = « Traité de <lieu> » ; le territoire en jeu déjà en **magenta** ; `beacon` sur le lieu de signature. 1re phrase : « Pourquoi / Comment <pays, région ou ville d'aujourd'hui> … ? », 14 mots au plus, sans date dite.
2. **Magenta `#FF2E88`** = le territoire qui change de main, et rien d'autre. **Quand** : dans le hook (la question), puis au moment de la signature (scène 5) et dans le panneau avant du `split` ; **avant** la signature (scènes 1-4), le territoire garde la couleur de son propriétaire (on doit voir qu'il lui appartient) ; **après**, il prend la couleur du gagnant ; il redevient magenta dans « Aujourd'hui » pour montrer ce qui a bougé. Le magenta ne doit jamais couvrir la carte pendant plus de la moitié du reel. Exception : quand rien n'est cédé à personne (indépendance reconnue, séparation), le territoire peut rester magenta depuis le hook (`keep`), et la légende du split dit « détaché » au lieu de « cédé ». Zone « à décider » (plébiscite à venir) : grise. Rouge germanique → brique `#B5523B` ; Russie/URSS hors carte → flèches `#8E2A2A` ; jamais de jaune pour un acteur.
3. **Le parchemin, puis l'avant/après.** Scène 5 (≈ 45 s), toujours dans cet ordre :
   - art **`treaty`** (nouveau, 3,5 s) : un parchemin avec le nom du traité, la date, 2 à 4 signataires, et un sceau de cire qui **tamponne** l'année. C'est l'image que l'on reconnaît d'un épisode à l'autre ;
   - art **`split`** (4 s) : à gauche l'avant, à droite l'après, où le magenta prend la couleur du gagnant (`to`) ; `before` = « Avant <année> », `after` = « Après <année> », `legend` = 2 ou 3 pastilles (« cédé » magenta, le gagnant, le perdant) ; la voix dit qui gagne et qui perd. Panneau vide ou tout gris interdit.
4. **Fin « hier sur aujourd'hui ».** Dernière scène `map` : `year: "Aujourd'hui"`, `labels` des pays actuels, le territoire toujours magenta, la frontière du traité dessinée par-dessus (`line`, blanc) et une `pill` « toujours là » ou « effacée en <année> ». Puis le final : « Voilà pourquoi… » + « Et tout part de cette question : ».

Le reste varie d'un épisode à l'autre, pour éviter la lassitude sur 50 : cadrage du hook (Europe large un épisode sur deux, zoom serré l'autre fois), arts de la crise et des conséquences, personnages.

## Écriture
- **Pas de recoloriage répétitif** : une zone qui reste la même d'une scène à l'autre se pose une fois avec `keep: true` (pas de `highlight` identique redessiné à chaque scène) ; chaque scène apporte un changement visuel nouveau.
- **Relief net** : toute scène très zoomée (moins de 1° de large) a sa boîte de `terrain` dédiée (z 11 à 12) ; une pastille ou un nom n'apparaît qu'après le mouvement de caméra (`when` ≥ 1 s), sinon il grossit pendant le zoom.
- **Petits territoires** (rocher, île, enclave) : `highlight.area` ; dans le `split`, cadrer les parts sur la région proche (provinces voisines) pour que le magenta se voie.
- **Repères** : chaque lieu dit à la voix a son nom à l'écran (`labels`/`pills`), sur la terre, jamais en mer ni sur un autre texte ; titres de scène sur 2 lignes au plus quand un art suit.
- Une idée par scène : 2 phrases au plus, 10 à 16 mots, au plus **un** nouveau nom propre. Une scène qui demande « et » se coupe en deux.
- **Repère d'aujourd'hui** : à la 1re mention d'un nom d'époque, une `pill` le relie au présent (« Francie occidentale ≈ France »).
- Gagnants et perdants : gagnant d'abord, phrases sujet-verbe-complément (« La Prusse prend la Silésie. L'Autriche la perd. »).
- Ton dramatique par le rythme et les enjeux, jamais par les adjectifs : « En une signature, des villes entières changent de pays » plutôt que « un traité terrible ».

## Structure type (≈ 80 s réelles, 9 scènes)
| t | scène | contenu |
|---|---|---|
| 0–5 s | hook | question d'aujourd'hui ; carte avant, magenta et halo dès 0 s |
| 5–20 s | 1–2 | **l'avant** : qui tient quoi, voisins étiquetés |
| 20–40 s | 3–4 | **la crise** : guerre, mariage, vote (`moves`, personnages, `timeline` si plusieurs étapes) |
| 40–52 s | 5 | **la signature** : `treaty` puis `split` |
| 52–68 s | 6 | **gagnants et perdants** : `stats`, `bars` ou `compare` (« environ ») |
| 68–80 s | 7 | **aujourd'hui** : la frontière du traité sur la carte actuelle |
| 80–88 s | final | « Voilà pourquoi… » + « Et tout part de cette question : » |

Arts : `treaty` + `split` obligatoires, + 1 ou 2 parmi `timeline`, `stats`, `bars`, `compare`, `languages`.

## Pièges
- **Anachronismes** : jamais un pays actuel entier pour un État qui n'existait pas → `regions` + pastille « contours actuels ». Noms d'époque exacts (Francie, Prusse, Saint-Empire, royaume de Sardaigne, URSS…).
- **Carte** : Russie (84 régions, dont `{"c":"Russia","n":"Kaliningrad"}`), Crimée (`{"c":"Ukraine","n":"Crimea"}`, `"Sevastopol"`) et monde sont disponibles en **mode monde** (`"world": true`, ou automatique dès qu'un pays du monde est cité ; voir « Mode monde » dans STYLE.md). Ne l'activer que si le sujet en a besoin. La police n'a pas œ, š, ž, č, ř, ş, ı. Les zones qui ne suivent pas les régions (Sudètes, Schleswig, Haute-Silésie, secteurs de Berlin) se dessinent avec `highlight.area` (polygone [[lon, lat], …]) ou `areas` (plusieurs), combinables avec `countries`/`regions` (voir STYLE.md).
- **Sensibles** (Trianon 1920, 1923, 1935, 1938, 1939, 1945, Brexit) : verbes neutres, aucun adjectif de jugement, chiffres en fourchette « environ / plus de », source dans `sources/`.
- **Recoupements** avec « Pourquoi ce pays ? » (Luxembourg 1839, Savoie-Nice 1860, Danemark 1864, Alsace 1871, Hongrie 1920, Tyrol 1919) : on raconte **le jour du traité**, pas l'histoire du pays. Pas de doublon interne : Verdun sans la Lotharingie (→ Meerssen), rideau de fer arrêté en 1955, UE sans Schengen ni Brexit détaillés.
- **Les 5 briefs existants** n'ont pas la signature : chacun passe une refonte (parchemin, split gagne/perd, fin « aujourd'hui », boucle) avant de rejoindre un lot.

## Ordre de production
Pilote : 03 Normandie (médiéval), 14 Gibraltar (moderne), 34 Trianon (20e). Puis lots de 10 qui alternent les époques ; les 5 briefs existants (01, 11, 22, 43, 49) entrent dans les lots 1 et 2 après refonte. Les sujets en mode monde (08, 15, 17, 18, 20, 30, 31, 36, 40, 41) sont désormais faisables : on les répartit dans les lots, sans attendre la fin.
