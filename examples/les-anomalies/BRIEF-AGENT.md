# Brief de production d'un épisode de « LES ANOMALIES »

Tu produis UN épisode de la série (40 s, 9:16, en français), de bout en bout, en **3 boucles
« rendu → contrôle → correction »** obligatoires. L'utilisateur a demandé de tout faire sans lui poser de question.

## À lire d'abord
1. `examples/les-anomalies/BIBLE.md` — personnages, couleurs, voix, arc de la saison (ton épisode = sa ligne).
2. `examples/les-anomalies-ep2/make.mjs` + `audio.py` — **épisode modèle** à imiter (structure, densité, mouvement).
3. `examples/les-anomalies/lib.mjs` — API commune (exports listés ci-dessous) ; `audiolib.py` — son.
4. Pour plus d'exemples de mise en scène : `examples/les-anomalies-ep1/make.mjs`.

## Fichiers à créer (et seulement ceux-là)
- `examples/les-anomalies-epN/make.mjs` (importe `../les-anomalies/lib.mjs`, finit par `L.build(import.meta.url, 'les-anomalies-epN')`)
- `examples/les-anomalies-epN/audio.py` (utilise `audiolib.Episode`, écrit une partition propre à l'épisode, finit par `E.finish(rewrite={…})`)
- **Ne modifie PAS** `lib.mjs`, `audiolib.py`, `check.sh` ni les autres épisodes (d'autres agents travaillent en parallèle).
  Un dessin ou une animation qui manque → écris-le dans ton make.mjs (CSS sup. via `L.svgCss('…')`, ou `anim()`/`mv()`/`go()`).
  Un vrai bug de la bibliothèque → contourne-le localement et signale-le dans ton rapport.
- Pas de commit git.

## API de lib.mjs (essentiel)
- Constantes : `W H T(=40) PAPER INK NIGHT RED VOLTA GIVRE ECHO MIRAGE ORANGE`.
- Temps : `scene(a, b, corps)` (un plan), `vis(a, b, corps)` (fenêtre de visibilité), `an(classe, délai, corps, origine?, extraStyle?)`
  (classes CSS de la lib : pop slam rise inL inR impact spinS drift chunk shake shakeS leapA/B/C dropIn bob hover wob pulse
  epulse eyeOpen descend scan scanDown beamIn beamUp flick1/2 blink draw trail fly ripple grow zoomP lock parx swayL/R scanlines…).
- Caméra : `cam(a, b, [[t, x, y, rot, échelle, easing?], …], monde, origine)` — **chaque plan a sa caméra**. Fonds débordants : `BG(c)`, `GROUND(y, c)`, `sky`.
- Mouvements : `mv(t, durée, [dx,dy], corps)` (arrive), `go(t, durée, [dx,dy], corps)` (part), `anim(t, d, ['0%{…}','100%{…}'], corps, {origin, ease, iter, dir})`,
  `fadeIn fadeOut ghost bobbing spin shakeAt(t, corps, n, 'shake'|'shakeS') flashAt(t)`.
- Effets : `radial burst cracks zig bolt onom panel aura crystal smoke reticle particles streaks rain`.
- Personnages : `figure(clé, pose, {glow, float, shout, anim: 'idle'|'fight'|'cast'|'charge'|'still'})` posée par `put(corps, x, yPieds, échelle, miroir(±1), rot)`.
  Clés : volta givre echo mirage kessler (+ `addChar('clé', {accent, hair: 'spiky'|'swept'|'long'|'hood'|'bun', coat?, visor?})` pour les mutants libérés).
  Poses : stand hips cast castUp slam float throw charge leap run kneel point guard sad. `hand(pose, 'la'|'ra', X, Y, s, m)` = position d'une main.
  Gros plan : `bigEyes(cx, cy, clé)` (dans un `panel`). Une figure fait ≈ 680·s px de haut.
- Ennemis : `robotG(amplitude, {body, trim, eye, twin})` (Traqueur ; Mk II = `{body:'#e8e4da', trim: INK}` ; Colosse = `{twin:true, eye: ORANGE}` en grand),
  `drone(x, y, s)`, `swarm(n, [x0,x1], [y0,y1], [s0,s1])`, `ROBOT_EYE`.
- Décors : `city tower(x, yb, s) tube(x, yb, couleur, s, clé?) rooftops(y0) waterTower(x, yb, s) holo(x, y, w, h, corps, couleur) car searchlight`.
- HUD (textes hors caméra) : `header(N, 'Titre')`, `hook('accroche', 0.3, y)` (**obligatoire, avant 1 s**), `caption`, `bubbleFor(k, x, y, ['ligne 1','ligne 2'], [queueX, queueY])`,
  `tag(x, y, NOM, POUVOIR, couleur, t)`, `finalCard(36.9, 'sous-titre')` (titre immobile + bandeau, dernières 3 s), `logo`.
- Son : `sfx('nom', t)` ; noms dispo dans `audiolib.SFX_NAMES` (hit whoosh land scan alarm panel lock zap ice tk missile boom iceWall laser klang
  charge beam glitch bigboom wind eye shimmer invis drone swarm holo glass thunder rumble step door heart powerdown powerup siren train punch freeze crowd beep electric).
- `L.reseed(N*101)` au début pour un aléatoire propre à l'épisode. `L.setLines(LINES)` avec `{who, t0, t1, text}` ; `who` ∈ clés de VOICES (volta givre echo mirage kessler robot colosse omega ally ally2).

## Règles d'écriture
- 9 à 11 plans, ~10 à 12 répliques courtes (≤ 26 caractères par ligne de bulle, ≤ 2 lignes), une seule bulle à la fois, ≥ 1,1 s par réplique.
- Mouvement **partout** : caméra qui bouge dans chaque plan, personnages animés, particules, impacts avec tremblement. Aucun plan statique.
- Lisibilité : bulles et onomatopées dans y 300–1450, x 60–1020, rien en x > 960 et y > 1050 ; personnages pas coupés par le bas (pieds ≤ ~1650 après caméra).
- Respecte le résumé de la bible (début → cliffhanger) ; contenu tous publics (pas de sang).
- Carton final : `finalCard(36.9, 'ÉPISODE N+1 BIENTÔT')` (ép. 15 : `'FIN DE LA SAISON 1'`).

## Boucle de contrôle (×3, obligatoire)
```
zsh examples/les-anomalies/check.sh N --jobs 3
```
(génère le SVG, le son, contrôle Whisper de chaque réplique, rendu + audit Reels, et `examples/les-anomalies-epN/qa-planche.jpg` :
20 images, une toutes les 2 s, à lire en lignes : 1 s, 3 s, 5 s…). Puis **regarde la planche avec Read** et note les défauts :
texte qui chevauche un personnage, personnage coupé, plan vide ou statique, action illisible, bulle qui sort du cadre, incohérence avec la bible.
Pour un instant précis : `ffmpeg -v error -y -ss 12.4 -i examples/les-anomalies-epN/les-anomalies-epN.mp4 -frames:v 1 -vf scale=540:-1 /tmp/x.jpg` (utilise ton dossier temporaire).
- Whisper : ⚠ dû uniquement à un accent/une graphie (« Oméga »/« Omega ») = OK. Sinon, essaie des variantes :
  `python3 examples/les-anomalies/voxtest.py <who> "variante 1" "variante 2"` puis change le texte ou ajoute `rewrite={'texte affiché': 'texte prononcé'}`.
- Audit : doit finir « 0 alerte(s) d'audit ».
- Boucle 1 = premier jet ; boucles 2 et 3 = corrections de ce que tu as vu. Même si tout semble bon, la boucle 3 doit améliorer quelque chose
  (lisibilité, rythme, mouvement, composition).

## Rapport final (court, en français)
Titre, résumé en 2 phrases, ce que chaque boucle a corrigé, état final (audit, Whisper), contournements éventuels de la lib.
