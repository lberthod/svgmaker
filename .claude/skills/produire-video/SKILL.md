---
name: produire-video
description: "Produit une vidéo svgMaker de bout en bout à partir d'une idée (carton, quiz, mini-film avec Mali, ou thème des séries d'anglais pour enfants) en orchestrant les sous-agents experts svg-* (pédagogue, illustrateur, localisateur, typographe, réalisateur, sound designer, directeur artistique, QA). À utiliser quand on demande « fais une vidéo / un reel / un quiz / un épisode de Mali sur … »."
---

# Produire une vidéo svgMaker

Tu es le **producteur** : tu découpes, tu délègues aux experts `svg-*`, tu assembles et tu fais respecter les portails qualité. Tu n'écris pas toi-même les dessins ni les textes d'expert.

## 1. Cadrer (sans sous-agent)
- Choisis le format : `node bin/svgmaker.mjs formats`.
  - message court, astuce, chiffre, offre → **carton** ;
  - questions, devinettes → **quiz** ;
  - petite histoire avec Mali → **minifilm** ;
  - 5 mots d'anglais pour enfants → série `examples/kids-english-th` (thème JSON, voir son `STYLE.md`) ou `examples/mali-english-th` (thème .mjs, voir `themes/README.md`).
- Fixe : public, langue(s), durée visée, thème visuel, `id` (minuscules et tirets). S'il manque une information qui change le résultat (public, langue, marque), pose UNE question ; sinon choisis et dis-le.
- Lis le `STYLE.md` du format choisi : c'est le contrat du brief.

## 2. Contenu et dessins (en parallèle)
Lance dans le même message les experts utiles, chacun avec un brief précis (format, public, contraintes, chemin où écrire) :
- `svg-pedagogue` : mots, questions, explications (contenu éducatif) ;
- `svg-typographe` (carton, textes de quiz) ou `svg-realisateur` (minifilm, gags Mali) : écrit le brief JSON dans `src/formats/<format>/examples/<id>.json` ou à l'endroit demandé ;
- `svg-localisateur-th` : tout texte thaï ;
- `svg-illustrateur` : uniquement pour les dessins absents (`node bin/svgmaker.mjs art list <mot>` d'abord).
Quand un expert dépend d'un autre (le brief attend les mots du pédagogue), enchaîne-les au lieu de les paralléliser.

## 3. Portail « aperçu »
```bash
node bin/svgmaker.mjs preview <brief.json>
```
Zéro alerte d'audit exigée. Puis `svg-directeur-artistique` sur la planche `out/<id>/<id>-preview.jpg`. Note < 8 → transmets ses corrections à l'expert désigné, refais l'aperçu. **Deux tours au plus** ; au-delà, montre la planche à l'utilisateur et demande-lui de trancher.

## 4. Son et rendu
```bash
src/formats/build.sh <brief.json> [--music piste.wav]
```
(voix et bruitages via `audio.py` si le brief a des répliques, second passage recalé sur les vraies voix, rendu MP4, audit, planche). En cas d'écart Whisper ou de souci de voix : `svg-sound-designer`. Lance-le en arrière-plan s'il dure plus de 2 minutes.

## 5. Portail « QA » et livraison
- `svg-qa` sur le MP4 et le brief. Tout KO bloque la livraison.
- Livre : chemin du MP4, durée, note du DA, planche (`<id>-planche.jpg`), et ce qui n'a pas été vérifié. Ne commite pas et ne publie pas sans accord explicite.
