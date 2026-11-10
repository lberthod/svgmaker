# Guide : réussir un épisode animé avec svgMaker

Ce guide rassemble ce que les boucles d'amélioration ont appris : environ 15 itérations et 30 audits d'experts sur un épisode de 30 s. Il s'adresse à l'IA qui écrit l'épisode, et à la personne qui la pilote.

La règle de fond : **une image qui « a l'air bien » en vignette n'est pas validée.** La plupart des défauts n'apparaissent qu'en grand, image par image, ou en séquence rapprochée.

---

## 1. Méthode de travail

### 1.1 Le cycle à respecter

1. **Écrire** l'épisode (générateur `make.mjs` qui produit le SVG et `timeline.json`).
2. **Rendre vite**, sans son ni GIF, puis extraire une image par seconde et quelques gros plans.
3. **Regarder soi-même en grand** les images clés, pas seulement une planche de vignettes.
4. **Faire auditer** par 3 regards indépendants (voir § 7).
5. **Vérifier chaque affirmation sur l'image** avant de corriger. Les auditeurs se trompent environ une fois sur cinq.
6. **Corriger en un seul patch**, avec un seul rédacteur du fichier source.
7. **Re-rendre et contrôler** les points corrigés (avant/après), puis recommencer.
8. Rendu final **avec son** quand l'image est stable.

### 1.2 Ne jamais déclarer « c'est mieux » sans preuve

- Une impression générale d'amélioration ne suffit pas : il faut **une image à l'appui** pour chaque point corrigé.
- Après chaque patch, extraire l'instant précis du défaut et le regarder.
- Vérifier que le patch s'est **vraiment appliqué**. Un script lancé depuis le mauvais dossier échoue en silence, et l'image ne change pas.

### 1.3 Outils utiles

```bash
# rendu rapide sans son
node bin/svgmaker.mjs render episode.svg -o /tmp/fast -f
# une image par seconde
ffmpeg -i video.mp4 -vf "fps=1,scale=1280:-1" f%02d.jpg
# séquence rapprochée (8 i/s sur 1,2 s) pour juger un mouvement
ffmpeg -ss 13.5 -t 1.2 -i video.mp4 -vf "fps=8,scale=480:-1,tile=4x3" -frames:v 1 seq.jpg
# gros plan
ffmpeg -ss 15.0 -i video.mp4 -frames:v 1 -vf "crop=640:300:0:420" zoom.jpg
```

Une planche de 30 vignettes sert à juger le rythme global, jamais un visage ni une collision.

---

## 2. Récit et compréhension

- **L'histoire doit se comprendre sans le son.** Couper le son mentalement : chaque gag doit se lire à l'image.
- **Chaque gag suit trois temps : anticipation, action, réaction.**
  - Anticipation : le personnage se ramasse, recule, regarde le danger (0,1 à 0,3 s).
  - Action : rapide et lisible (0,15 à 0,5 s).
  - Réaction : une pose tenue assez longtemps pour être lue (0,4 à 1 s), puis un retour progressif (pose intermédiaire, puis debout).
- **Une cause visible avant chaque effet.** Si un personnage part en courant, on doit voir pourquoi : sursaut, sueur, regard.
- **L'objet du gag doit être visible quand on en parle.** Une réplique qui évoque un obstacle ou un objet doit arriver quand cet objet est à l'écran, pas avant ni après.
- **Logique des accessoires.** Un objet ne se téléporte pas : on le voit posé, puis pris. Un personnage mouillé sèche, et l'effet s'arrête après quelques secondes.
- **Une fin qui se lit comme une fin.** Expressions ravies, sauts, confettis, carton. Retirer tout signe de stress (sueur, sourcils inquiets) avant la célébration.
- **Pas de plan figé de plus de 2 à 3 s.** Ajouter respiration, piétinement, regard, balancement, ou raccourcir.

---

## 3. Dessin des personnages

### 3.1 Visages : la mignonnerie se joue sur peu de choses

- **Yeux :** pupille grande (environ 70 % de l'œil), deux reflets blancs, **les deux yeux de même taille** et au même niveau. Une petite pupille dans un grand blanc donne un regard fou.
- **Pas de dents** apparentes, ni de cavité buccale sombre et béante. Elles font peur.
- **Bouches selon l'émotion :**
  - calme : petit sourire en arc ;
  - inquiet : ligne ondulée ;
  - parle normalement : bouche en « D » rose ;
  - parle en paniquant : ovale vertical (surtout pas un sourire) ;
  - joie finale : grande bouche ouverte et yeux fermés en arc (^^) ;
  - choc ou chute : yeux en « >< ».
- **Sourcils :** fins et en arc. Des sourcils épais en V donnent un air fâché ou méchant.
- **Joues roses** sur tous les personnages, pour un style cohérent.
- **Clignements brefs** (environ 0,1 s), avec les deux yeux en même temps. Un clignement lent se lit comme de l'ennui, et un seul œil comme un clin d'œil involontaire.
- **La goutte de sueur va hors de la tête**, sur la tempe ou derrière. Collée sous l'œil, elle se lit comme une larme, et collée au museau comme de la morve. **À revérifier à chaque fois qu'on change l'inclinaison de la tête ou du corps.**

### 3.2 Corps et membres

- **Compter les membres** : un personnage anthropomorphe a 2 jambes et 2 bras. 4 pattes plus 2 bras font un nœud illisible.
- **Contour unique par membre.** Dessiner chaque membre en deux passes : contour épais (même couleur, trait large), puis remplissage par-dessus. Sinon les jointures (cuisse/tibia/pied) apparaissent comme des tuyaux ou des « œufs empilés ».
- **Proportions « chibi » :** grosse tête, corps rond et visible (ventre clair), jambes courtes et potelées, grands pieds. Si la tête cache le corps, le personnage devient une tête sur des bâtons.
- **Bras courts au repos**, pliés sur le ventre. Un bras long et droit se lit comme une jambe de plus.
- **Posture droite :** un buste trop penché fait « quadrupède accroupi ». Vérifier la posture dans **chaque** scène.
- **Membres arrière un ton plus foncés**, pour séparer les plans.
- **Personnage endormi :** il doit rester identifiable (traits distinctifs bien visibles, posés sur l'oreiller), avec une couverture jusqu'au menton, un volume de corps qui respire et des « Zzz » lisibles.

### 3.3 Cohérence

- Même style partout : contour brun épais, mêmes yeux, mêmes joues.
- Un personnage secondaire doit avoir une « vie » propre : balancement, réaction, changement d'expression. Il ne doit pas rester figé pendant 8 s.
- Un accessoire doit avoir sa forme évidente : une montre a un bracelet, une horloge a des graduations, un objet clé a une silhouette reconnaissable dès la vignette.

---

## 4. Mouvement

- **Cycle de course :** jambe en deux segments (cuisse et tibia), genou qui plie en phase de retour, rebond du torse à chaque appui, tête qui suit avec un léger retard, bras qui balancent en opposition **avec assez d'amplitude pour se voir** (±60° et plus pour des bras courts).
- **Écrasement et étirement** au décollage et à l'atterrissage (scale 1,15/0,85 environ).
- **Les ombres restent au sol.** L'ombre ne doit pas être dans le groupe qui saute. Elle rétrécit et pâlit pendant le saut.
- **Dérapage :** corps penché en arrière, jambes figées sans cycle de course, glissade réelle (150 à 200 px), léger dépassement puis retour.
- **Arrêts et démarrages :** pas de passage instantané de la pose de course à la pose de repos. Prévoir une transition de 0,1 à 0,2 s.
- **Saut au-dessus d'un obstacle :** le décollage se fait **avant** l'obstacle et la réception **après**, avec le sommet centré dessus. Calculer avec la vitesse de défilement.
- **Retournement :** échange instantané (ou très bref) de sens. Un `scaleX` qui passe lentement par 0 fait « rétrécir » le personnage.
- **Décor qui défile et action sur place :** quand un personnage tombe ou s'arrête alors que le sol défile, **l'objet du gag doit rester sous lui** (copie fixe de l'objet, ou arrêt du défilement). Sinon il tombe à côté.
- **Sortie de plan :** les personnages doivent réellement sortir du cadre avant la transition, sans se traverser l'un l'autre. Les départs se décalent de 0,1 à 0,15 s.

---

## 5. Mise en page : bulles, onomatopées, carton

- **Bulles :**
  - au-dessus de **tout** le personnage (oreilles, cheveux, chapeau compris), avec au moins 16 à 24 px de marge ;
  - la pointe vise clairement celui qui parle ; si elle tombe entre deux personnages, on se trompe de locuteur ;
  - **une seule bulle à la fois**, et une réplique courte ;
  - 40 px de marge avec le bord du cadre ;
  - si une bulle est trop large, raccourcir le texte plutôt que la laisser masquer le décor clé.
- **Onomatopées :**
  - jamais sur un visage, une tête ou un élément clé du décor (horloge, enseigne, soleil) ;
  - jamais coupées par le bord du cadre ;
  - placées près de leur source (au sol pour un dérapage, près de l'impact pour une éclaboussure) ;
  - synchronisées avec l'action, pas après.
- **Élément clé du gag :** s'il faut voir une horloge, une montre ou un objet au moment de la réplique, rien ne doit le couvrir à cet instant. En cas de conflit, choisir consciemment ce qui doit rester visible.
- **Carton de fin :** lisible (titre fort et sous-titre d'au moins 30 px), ombre portée, entrée avec rebond, **sans couper les personnages** même au sommet de leurs sauts. Les confettis passent derrière les personnages et le carton.
- **Artefacts :** traits de vitesse isolés (on les lit comme des rayures), morceaux d'objets qui traînent au bord du cadre, éléments qui débordent. Les chercher en grand.

---

## 6. Décors et direction artistique

- **Un décor vide paraît triste.** Ajouter quelques objets qui racontent le lieu : cadres, étagère, tapis, drapeau, fenêtres habitées.
- **Profondeur :** premier plan (buissons en bas), parallaxe à plusieurs vitesses, léger écart d'échelle et de hauteur entre deux personnages côte à côte.
- **Contraste figure/fond :** si un personnage a la même luminance que le mur derrière lui, ajouter un panneau clair derrière lui.
- **Vie ambiante :** rideaux qui bougent, nuages qui dérivent, drapeau qui flotte. Toujours subtil.
- **Transitions entre scènes :** un balayage ou un fondu court masque la coupe.
- **Formes reconnaissables :** un rideau a une tringle et des plis, pas une pointe. Chaque forme doit se lire en vignette.

---

## 7. Orchestrer les audits d'experts

### 7.1 Trois regards indépendants, en parallèle

| Expert | Ce qu'il juge |
|---|---|
| Personnages | silhouettes, proportions, anatomie, mignonnerie, expressions face au texte, poses ratées |
| Direction artistique | composition, collisions, lisibilité des textes, contraste, profondeur, décors, artefacts |
| Animation et récit | compréhension sans le son, gags, timing, poses clés, mouvements (en séquences rapprochées) |

### 7.2 Un brief commun, écrit une fois

Le brief contient le minutage de l'histoire, le style visé, ce qui a **déjà** été corrigé (pour éviter les re-signalements), le chemin des images et de la vidéo, et les commandes ffmpeg pour extraire des images.

Il pose aussi les règles :
- ne signaler que ce qui est vu sur une image précise ;
- donner un correctif chiffré (px, degrés, secondes) ;
- se limiter aux 4 problèmes les plus gênants ;
- finir par une note sur 10.

Le brief précise enfin ce qui **n'est pas** un défaut : bulles en fondu, transitions voulues. Sinon les auditeurs signalent des « bulles fantômes ».

### 7.3 Trier avant de corriger

- **Vérifier sur l'image** chaque point important : gros plan ou séquence rapprochée. Des affirmations fausses arrivent régulièrement (une horloge mal lue, un saut jugé trop bas alors qu'il est haut, une pose vue sur une image intermédiaire).
- **Prioriser ce qui revient chez plusieurs experts.**
- **Arbitrer les conflits :** deux correctifs peuvent se contredire, par exemple une bulle plus basse qui cache l'objet du gag. Garder ce qui sert l'histoire et le noter.
- **Un seul rédacteur du code**, pour éviter les modifications concurrentes.

### 7.4 Rendements décroissants

- Les premières itérations corrigent des défauts majeurs : gain de 1 à 2 points par round.
- Vers 8,5/10, les retours deviennent des finitions de jeu d'acteur : direction du regard, gestes de pointage, réactions secondaires. Chaque round rapporte alors environ 0,1 à 0,2 point.
- Passé ce seuil, il vaut mieux planifier ces finitions dès l'écriture (voir § 9) que les ajouter après coup.

---

## 8. Pièges techniques (SVG et CSS animé)

- **Une transformation CSS remplace l'attribut `transform`** du même élément. Il faut toujours deux groupes : l'extérieur porte la position (`transform="translate(...)"`), l'intérieur l'animation CSS.
- **`transform-origin`** se donne en px du repère local. Dessiner les personnages avec les **pieds en (0,0)** rend les écrasements, inclinaisons et retournements naturels.
- **Fenêtres de visibilité :** l'élément est en `opacity:0`, et une animation `vis` en `forwards` le montre de t0 à t1. Les durées « infinies » s'écrivent avec une grande valeur.
- **`fill-mode: both`** maintient la première image clé avant le délai : pratique pour une pose de départ, piégeux si on l'oublie.
- **Plusieurs animations sur la même propriété** d'un même élément : la dernière de la liste gagne quand elles sont actives en même temps. Il faut séparer les fenêtres dans le temps, ou imbriquer des groupes.
- **Variables CSS dans les images clés** (`var(--h)`, `var(--a)`) : un seul jeu d'images clés réutilisable par instance.
- **Le contour unique d'un membre** (§ 3.2) demande de dupliquer le sous-groupe animé (contour, puis remplissage) avec la même animation.
- **Les cycles générés par table** (cuisse, tibia, bras) sont échantillonnés en JS dans des images clés : précis et faciles à régler.
- **Défilement de décor :** des calques périodiques (deux copies côte à côte, translation de −largeur en boucle) avec une vitesse par calque. Les objets ponctuels se placent selon `x(t) = x_impact − v·(t − t_impact)`.
- **Une fenêtre de mouvement peut en masquer une autre :** une option ajoutée pour un nouveau geste ne doit pas désactiver silencieusement une fenêtre existante (par exemple une course ignorée parce que d'autres fenêtres de mouvement sont déclarées). Revérifier les scènes déjà validées après chaque refonte.
- **Rotation du corps et éléments posés à la main :** si on incline le torse, recalculer les objets placés en coordonnées de scène (objet tenu, cible d'un mouvement, goutte de sueur).

---

## 9. Checklist avant de livrer

**Récit**
- [ ] Se comprend sans le son ; chaque gag a anticipation, action et réaction.
- [ ] L'objet du gag est visible quand on en parle ; aucun objet ne se téléporte.
- [ ] La fin se lit comme une fin heureuse, sans aucun signe de stress résiduel.

**Personnages**
- [ ] Yeux grands et identiques, pas de dents, sourcils fins.
- [ ] Bouche adaptée à l'émotion de chaque réplique.
- [ ] Sueur hors des yeux et du museau, dans **toutes** les poses.
- [ ] Membres à contour unique ; bon nombre de membres ; posture droite partout.
- [ ] Personnages secondaires vivants (balancement, réaction, changement d'expression).

**Mouvement**
- [ ] Ombres au sol pendant les sauts ; sauts centrés sur les obstacles.
- [ ] Dérapages avec glissade réelle, jambes figées et inclinaison.
- [ ] Pas de traversée entre personnages, ni de demi-tour qui « rétrécit ».
- [ ] Sorties de plan complètes avant la transition.

**Mise en page**
- [ ] Bulles au-dessus de tout, avec marges ; une seule à la fois.
- [ ] Onomatopées hors des visages, des éléments clés et des bords.
- [ ] Carton lisible, sans couper les personnages ; confettis derrière.
- [ ] Aucun artefact (rayure, élément orphelin au bord).

**Vérification**
- [ ] 30 images (1 par seconde) regardées en grand, plus des séquences rapprochées sur chaque gag.
- [ ] Rendu final avec son, durée vidéo = durée audio.
- [ ] Répliques et `timeline.json` synchronisés (régénérer l'audio après tout changement de texte ou d'horaire).
