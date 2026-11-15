# 34-trianon — corrections boucle 1 → 2

## Appliquées
- Producteur 1 · magenta selon la bible : hook = Hongrie orange + morceaux perdus magenta (keep:false) ; scène 1 = royaume entier en orange `#D9773A` posé une fois (keep:true) ; scènes 2-4 sans highlight ; scène 5 : les morceaux perdus basculent en magenta juste après le parchemin (keep:true) ; scène 7 : chaque gagnant recouvre sa part (keep:true) ; « Aujourd'hui » : magenta (keep:true) jusqu'au final, qui reboucle sur le hook. Magenta ≈ hook + fin de scène 5 + scène 6 + « Aujourd'hui » + final, moins de la moitié du reel.
- Producteur 2 / experts 3, 6 · hook serré sur le royaume entier `[13.0,43.0,28.6,50.5]` + `open` sur le même cadre (1re et dernière image) ; beacon et pastille Versailles déplacés en scène 5 ; say[1] du hook sans « Paris » (lieu absent de l'écran).
- Producteur 3 / experts 1, 5 · split : before « Avant 1920 », after « Après 1920 », legend cédé / Roumanie / Hongrie ; Prekmurje (18 communes minuscules) retiré des parts pour réduire l'effet confettis.
- Producteur 4 / experts 1, 2, 5 · barres : valeurs « 103 k / 63 k / 62 k / 93 k », sub « en milliers de km², environ », Hongrie (reste) en dernier, titre « Le partage ».
- Producteur 5 / experts 2, 5, 6 · stats : 2 cases (72 %, 64 %), titre « Le bilan », sub « environ, par rapport à 1914 » ; les 3 millions restent dans la voix et les 3 pastilles.
- Producteur 6 / experts 3, 5 · « Aujourd'hui » : la `line` suit le vrai contour de la Hongrie (232 points tirés du contour Natural Earth de eu.json), width 6, draw 2,6 ; Slovénie sur le Prekmurje, Autriche sur le Burgenland ; cascade des étiquettes resserrée (pas de 0,15 s) ; pastille « Toujours là » déplacée en Roumanie, side b.
- Producteur 7 / experts 4, 6 · plus de highlight identique redessiné à chaque scène ; cadrages variés (scènes 2, 3, 6, 7, 8, final) ; chaque scène a un événement nouveau (peuples, troupes, flèche, parchemin + bascule magenta, stats, recoloriage des gagnants, frontière).
- Expert 1.1 · « sept pays voisins » → « Ses anciens morceaux sont presque tous chez ses sept voisins. » (la Pologne a reçu environ 580 km²).
- Expert 1.2 / 2.5 · pastille Budapest sub → « + Slovaquie, Transylvanie… » (plus d'anachronisme, plus court).
- Expert 1.3 · hook text → « Plus des deux tiers d'un royaume perdus ? ».
- Expert 1.6 · « En novembre 1918 » → « Fin 1918 ».
- Expert 1.7 · say[1] scène 5 → « Trois États et l'Autriche en gagnent plus des deux tiers ; la Hongrie les perd. ».
- Expert 1.8 · Ruthènes ajoutés (pastille en Transcarpatie + voix).
- Expert 2.2 · pastilles scène 2 : Hongrois déplacée [19.5,47.3] side t, Croates [16.4,45.4], cadre élargi au sud.
- Expert 2.3 · « royaume serbe-croate-slovène » en un mot composé : plus de coupure du nom propre au sous-titre.
- Expert 3.2 · trou de Požeško-slavonska (absente de eu-regions.json) comblé par un `area` dans tous les highlights du royaume / magenta / vert SCS.
- Expert 3.3 · étiquette « Autriche » de la scène 1 retirée (posée sur la Croatie ; la pastille Autriche-Hongrie suffit).
- Expert 3.7 · label « Autriche » sur le Burgenland en scène 7.
- Expert 3.8 · pastilles Hongrois : pays sicule [25.4,46.4], Žitný ostrov [17.6,48.0].
- Expert 3.5 · scène 4 cadre [1.5,42.5,29.5,52.5].
- Expert 4.1-2 · parchemin sur « juin » (dur 3,8), split après (line 1, d 0,9, dur 4,3).
- Expert 4.6 / 5 · flèche Paris → Budapest sur « vainqueurs », dur 1,6.
- Expert 4.8 · final : cadre [15.6,44.4,25.8,49.4] (poussée avant la boucle).
- Expert 5.1 · cause du tracé : « La Hongrie réclame des votes locaux ; les vainqueurs refusent. » (demande de plébiscites de la délégation Apponyi, janvier 1920, rejetée).
- Expert 6.5 · Hongrie `#E8A33C` (trop doré) → orange `#D9773A`.
- Durée : phrases raccourcies (hook, scènes 2, 7, 8, final) pour tenir 119,5 s estimées.

## Refusées
- Expert 1.4 · barre Autriche (4 000 km²) : h ≈ 0,04 illisible et 5 barres font coller les étiquettes ; l'Autriche est montrée sur la carte (brique + label).
- Expert 1.5 · « Croatie comprise » dans le sub des barres et des stats : remplacé par la consigne du producteur (« par rapport à 1914 ») ; le détail reste dans les sources.
- Expert 2.4 (marge sub/grille), 2.6 (pastille à travers le split), 2.8 (sub des pastilles à 32 px), 3.1 option `outline`, 3.4 frontières actuelles par-dessus le magenta, 3.9 traits de split fusionnés, 5.3/2.1 anti-collision des barres : défauts du générateur (src/ hors périmètre) ; contournés côté brief quand c'était possible.
- Expert 3.6 / 5.6 / 6.3 · zoom sur Versailles avec labels Paris : remplacé par un cadre Europe large où l'on voit Versailles ET le royaume, pour montrer la bascule magenta à la signature (consigne producteur).
- Expert 3.9 bis · îles de Krk/Cres/Lošinj dans Primorsko-Goranska : imperceptible à cette échelle ; un `area` de remplacement coûterait plus de risque que de gain.
- Expert 5.1 bis · pill « Apponyi » et scène 4b : un nom propre de plus et environ 5 s ; la demande de votes est dite dans la scène 4.
- Expert 5.2 / 1.7 · before « Gagnent : Roumanie, Tchécoslovaquie, SCS » : la bible impose « Avant 1920 » ; les gagnants passent par la legend et la voix.
- Expert 5.7 · year « 1914 » en scène 2 : la voix dit « En 1910 » (recensement) ; l'écran garde 1910 pour ne pas contredire la voix.
- Expert 5 (flèche jaune `#FFD23F`) : jaune proscrit par la bible ; flèche blanche gardée.
- Expert 6.4 bis · 3e case stats en pleine largeur : générateur ; 2 cases à la place.
- Expert 6.2 · zoom Transylvanie en scène 2 : la scène montre des peuples de tout le royaume ; cadre [15.2,44.4,25.8,49.6] différent du précédent à la place.

## Raccourci (demande du coordinateur : viser ≈ 85 s réelles)
- Coupé : Ruthènes (pastille + voix), retour sur l'expert 1.8.
- Coupé : « La Hongrie réclame des votes locaux ; les vainqueurs refusent. » (scène 4), retour sur l'expert 5.1.
- Scène 2 en une phrase : « En 1910, environ la moitié des habitants sont hongrois, entourés de Roumains, Slovaques, Serbes et Croates. » ; pastille Allemands retirée.
- Hook : 2e phrase « Tout se joue en une signature… » retirée (la question seule).
- Raccourcis : scène 3 « …envoient leurs troupes dans le royaume. », scène 6 « …vivent hors de ses frontières. ».
- Signature et couleurs inchangées. Durée `new` : 106,9 s estimées (copie sans voix en cache) ; 90,3 s affichées avec le cache partiel (les répliques nouvelles y sont encore estimées).
