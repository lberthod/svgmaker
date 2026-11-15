# Écrire un NOUVEAU reel Terra Narrata — consignes communes

Tu écris UN brief JSON atlas pour le dépôt /Users/loicberthod/Desktop/Coding/svgMaker : un reel de cartes animées (1080x1920, voix de synthèse française, 70 à 90 s RÉELLES, 9 à 11 scènes) sur le sujet qu'on te donne. Tu crées uniquement ton brief et ton fichier de sources. Tu ne lances ni build.sh ni rendu : la validation se fait par `cd /Users/loicberthod/Desktop/Coding/svgMaker && node bin/svgmaker.mjs new <brief>` (doit réussir sans erreur ; les avertissements « relief absent » sont normaux).

## À lire d'abord (obligatoire)
- reels-nuit/briefs/15-luxembourg-v5.json : le modèle le plus abouti (hook, scènes map, arts compare / castle / split / neutral / languages / timeline, beacon, labels, moves, pills, people, crowd).
- reels-nuit/briefs/22-balkans-yougoslavie.json et 20-pays-baltes.json : briefs récents, déjà corrigés par audit.
- src/formats/atlas/STYLE.md (champs), src/formats/atlas/art.mjs (arts : stats, bars, languages, timeline, compare, split ; castle et neutral sont propres au Luxembourg), reels-nuit/outils/REFONTE.md (les 6 exigences, à appliquer dès l'écriture).

## Exigences
1. **Aucun chiffre dans la voix** : écris les `say` avec chiffres, ordinaux (12e, 1er) ou chiffres romains (XIIe) : le générateur les convertit en lettres (« douzième siècle », « premier ») et la validation refuse le brief si un chiffre subsiste dans le texte dit. À l'écran : chiffres (« 12e siècle »), jamais de chiffres romains.
2. **Au moins 3 plein-écran SVG (`art`)** qui expliquent l'histoire (avant/après `split`, comparaison d'échelle `compare`, frise `timeline`, chiffres `stats`, répartition `bars`, langues `languages`), chacun 3,5 à 5 s (`dur`), ouvert sur un mot dit (`at`), visible en entier avant la fin de sa scène, avec des valeurs vérifiées.
3. **Texte toujours lisible** : ≥ 32 px, jamais sur un autre texte ni sur un bord, jamais dans la zone des icônes (x > 1000), pas de pastille qui masque la carte sans raison.
4. Le tag @terranarrata est ajouté automatiquement.
5. **Boucle** : la dernière image sera la même que la première (automatique). TA part : la dernière phrase dite doit amener logiquement la question d'ouverture du hook (par ex. « Voilà la réponse à la question qui nous a ouverts : » puis, en boucle, « Pourquoi X ? »). Le final conclut aussi (« Voilà pourquoi… »), sans question au spectateur, sans appel à l'action.
6. **Carte soignée** : `focus.box` qui cadre le sujet à chaque scène, `highlight` (pays ou `regions` de src/kit/geo/eu-regions.json, la validation signale les noms inconnus) justes pour l'époque et sans `keep` anachronique, une couleur par territoire dans tout le reel, `labels` des voisins, `beacon` sur le lieu du sujet, personnages/pastilles sur la bonne terre, flèches (`moves`) qui arrivent à destination, `when`/`at` calés sur les mots dits. `terrain` = [ {box:[min(-14,x0-3), min(27,y0-3), max(40,x1+3), max(76,y1+3)], px:3000, z:6}, {box: union des focus.box ±0,4°, px:2800, z:8 ou 9} ] ; `base` = {"countries":[noms Natural Earth]}.

## Leçons des audits (erreurs fréquentes à ne PAS refaire)
- Un plein-écran qui masque la carte pendant le mot-clé de la scène (cadre la zone d'intérêt sous le carton, ou raccourcis l'art) ; un art coupé par la fin de sa scène (les dernières lignes de frise jamais lues).
- Un élément lié à un mot que la voix ne dit jamais (`when` sur un mot absent du `say` : il apparaît au début) ; arrivées en retard ou en avance sur la voix.
- Toute la surface d'un pays actuel coloriée pour une époque où il n'existait pas (utilise des `regions`) ; couleurs gardées d'une scène à l'autre (`keep`) qui deviennent fausses ; deux pays voisins de la même couleur.
- Capitales ou villes anachroniques (une ville qui n'était pas encore une capitale) ; personnage posé en mer ou sur le mauvais pays ; pastilles de voisins posées à l'intérieur du pays.
- Faits absolus (« unique », « le seul », « le premier ») ou approximatifs : vérifie sur Wikipédia/sources officielles, arrondis avec « environ ». Année, chiffre et nom doivent être identiques à l'écran et dans la voix.
- Compteurs de `stats` : valeur finale lisible plusieurs secondes ; pas plus de 3 à 4 cases.
- Glyphes absents de la police : ≈ ś ł ć ń Ħ ș ț et autres diacritiques rares (écris Gdansk, Krakow, Iasi…) ; accents français ok.
- Phrases trop longues : 10 à 16 mots par phrase, 2 phrases par scène, vocabulaire simple. Le hook promet ce que le reel démontre (pas de promesse non tenue).
- Une scène ne doit jamais rester sans événement visuel plus de 2 s : chaque scène a au moins un déplacement de vue, une flèche, un personnage ou une surbrillance calée sur la voix.
- Pas de personnage de type inexistant : vois la liste dans STYLE.md (`who`). Pas de `punch` (n'existe pas).
- Titres de scène courts (2 lignes au plus) ; écris `year` en chiffres (« 14e siècle ») ; pas de question au spectateur.

## Journal et réponse
Écris dans reels-nuit/briefs/sources/<nom>.md la liste « fait → URL » de tes vérifications. Réponds en 120 mots : plan des scènes, arts utilisés (kind + sujet), première phrase du hook et dernière phrase du reel (pour juger la boucle), durée estimée donnée par `new` (la durée réelle ≈ 0,75 × l'estimation), faits peu sûrs.
