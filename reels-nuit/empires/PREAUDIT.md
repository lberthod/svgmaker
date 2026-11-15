# Pré-audit d'un brief « Empires disparus » (avant rendu)

Tu relis et corriges EN PLACE un brief de la série `empires` du dépôt /Users/loicberthod/Desktop/Coding/svgMaker, avant son rendu vidéo. Tu ne modifies que ce brief et son fichier de sources. Tu ne lances jamais de rendu (ni produire.sh, ni build.sh, ni file.sh), et `new`/`preview` uniquement sur CE brief.

Lis : le brief ; `reels-nuit/empires/BIBLE.md` ; `reels-nuit/empires/REDACTION.md` ; `reels-nuit/outils/NOUVEAU.md` (leçons des audits) ; `src/formats/atlas/STYLE.md` ; le fichier de sources `reels-nuit/empires/sources/NN-slug.md`.

À faire :
1. **Faits** : vérifie par recherche web CHAQUE date, chiffre, nom, lieu et formulation absolue (« le premier », « le plus grand ») de la voix (`say`) et de l'écran (titres, pastilles, arts). Corrige ce qui est faux ou contesté (« environ », « vers », fourchette prudente). Écran = voix. Ajoute les URL dans les sources.
2. **Bible** : signature (couleur d'empire unique, violet #A77BE0 réservé à l'apogée au hook / apogée / final, `note` « Contours approximatifs », `timeline` Naissance / Apogée / Chute / Aujourd'hui, trace concrète dite avec un exemple, boucle par la dernière phrase), chute avant 42 s réelles (≈ 56 s de l'estimation de `new`), une scène = une idée, mots techniques définis à l'écran, phrases de 10 à 16 mots, aucune question au spectateur.
3. **Carte** : positions [lon, lat] des pastilles, personnages et flèches sur la bonne terre ; polygones plausibles pour l'époque ; anachronismes de noms.
3 bis. **Relief** : le cadre 9:16 montre bien plus haut et plus bas que la `focus.box` ; la grande boîte `terrain` doit couvrir toute la vue (prends au moins 8° de plus au sud et au nord que les `focus.box`, sinon une bande sans relief apparaît en bas des vues larges).
4. Valide : `node bin/svgmaker.mjs new <brief>` sans erreur ; puis `node bin/svgmaker.mjs preview <brief> -o /private/tmp/claude-501/empires-preview/<NN-slug>-pa` et lis l'image produite.
5. Ajoute en fin du fichier de sources une section « Pré-audit » : une ligne par correction.

Réponds en 100 mots au plus : corrections faites (les plus importantes), durée estimée, doutes restants.
