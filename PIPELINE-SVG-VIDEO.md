# Pipeline SVG → vidéo : analyse et optimisations

*Mesures du 8 novembre 2026 sur l'Apple M5 Pro (18 cœurs), avec `chalet-bellevue/chalet-01-la-visite.svg` de barbatoPeintures : 45 s, 63 animations CSS, 1 125 images à 25 fps. Les tests ont tourné sur une copie, aucun projet n'a été modifié.*

## 1. Fonctionnement actuel

```
 ┌───────────── 1. GÉNÉRATION ─────────────┐   ┌────────────── 2. RENDU ──────────────┐   ┌── 3. ENCODAGE ──┐
 script Node (lib.mjs / core.mjs)            Chrome headless (Puppeteer/Playwright)     ffmpeg
 ou SVG écrit par l'IA                       ouvre le SVG en file://                    image2pipe
   → contenu (i18n, séries, briefs)          met TOUTES les animations en pause         libx264 crf 18-20
   → une timeline @keyframes ou SMIL         pour i = 0..N :                            yuv420p, +faststart
   → polices en base64, logo injecté           currentTime = i/fps  (seek)              (+ musique pour Initi)
   → fichier .svg 1080×1920                    capture JPEG → pipe ───────────────────►  .mp4 à côté du .svg
                                                                                         + couverture (image 0)
                                             (barbato : mode audit = zones sûres,
                                              polices, accroche, carton final)
```

**Pourquoi cette méthode est bonne.** Le rendu est **déterministe**. On ne filme pas l'écran : on fige le temps et on photographie chaque instant. Aucune image n'est perdue et la vidéo est identique à chaque rendu, même sur une machine lente.

### Les 6 variantes

| Projet | Pilotage | Images | Parallélisme | Problème principal |
|---|---|---|---|---|
| barbatoPeintures `render.mjs` | Puppeteer, `getAnimations()` | JPEG q92 en pipe | aucun (1 page) | durée = **1re animation** seulement (bug sur `noel/`) ; polices non attendues |
| sitevitrine `core.mjs` | Playwright, `setCurrentTime` (SMIL) | JPEG q95 en pipe | 6 workers (une vidéo par worker) | gère le SMIL mais pas le CSS |
| dronepeaks `svg2gif.mjs` | puppeteer-core, SMIL **et** CSS | PNG ×2 **sur disque** | aucun | durée passée à la main ; fichiers temporaires |
| Initi `render_svg.py` | DevTools en websockets | PNG **sur disque** | aucun | `sleep(1.5)` au lieu d'attendre les polices ; le plus lent |
| terredebienetre | Playwright `recordVideo` **en temps réel** | WebM VP8, puis réencodage | 5 en même temps | **non déterministe** : images perdues, qualité VP8 faible puis double compression |
| jordi `*numero.py` | SVG en chaîne Python → cairosvg | PNG | aucun | ne gère pas le CSS animé (dessin manuel image par image) |

## 2. Mesures

Mesures prises sur ce fichier de 45 s.

| Étape | Mesure |
|---|---|
| seek (changer `currentTime` sur 63 animations) | **2,4 ms** par image |
| capture JPEG q92 1080×1920 | **79 ms** par image, soit 97 % du temps |
| **→ méthode actuelle (1 page)** | **12,3 images/s** : le reel de 45 s prend environ **92 s** |
| capture PNG | 7,4 images/s, **40 % plus lent** (cas d'Initi et dronepeaks) |
| CDP direct + `optimizeForSpeed` | 12,6 images/s (gain négligeable) |
| 4 pages dans **le même** Chrome | 26,6 images/s |
| **6 Chrome séparés** | **65,9 images/s : 17 s au lieu de 92 s (×5,4)** |
| 8 Chrome séparés | 45 images/s (saturation) |
| GPU Metal, 1 Chrome | 17,5 images/s (+40 %), mais aucun gain avec 4 à 6 Chrome |
| images identiques consécutives | 9 % (déduplication peu rentable) |

**Encodage ffmpeg des 1 125 images** (ce n'est **pas** le goulot, car il tourne pendant la capture) :

| Encodeur | Temps | Taille |
|---|---|---|
| libx264 crf 20 medium (actuel) | 8,0 s | 2,81 Mo |
| libx264 veryfast | 8,6 s | 2,35 Mo |
| h264_videotoolbox | 6,0 s | 6,01 Mo (×2 pour la même qualité) |
| hevc_videotoolbox | 11,8 s | 4,35 Mo |

→ **On garde libx264.** Le matériel Apple ne fait rien gagner ici.

**À l'échelle de barbatoPeintures :** 325 MP4 font 7 126 s de vidéo, soit 178 000 images.
- Méthode actuelle : environ **4 h** de rendu.
- Avec 6 processus : environ **45 min**.
- En incrémental : quelques secondes quand rien n'a changé.

## 3. Optimisations, par ordre d'impact

### A. Vitesse

1. **Lancer 6 processus Chrome en parallèle (×5,4, mesuré).** Pour un lot, on rend une vidéo par processus (le plus simple). Pour une seule longue vidéo, on répartit les images entre les processus et on les remet dans l'ordre avant ffmpeg. Le seek est déterministe, donc chaque processus peut calculer n'importe quelle image.
2. **Faire un rendu incrémental.** On calcule une empreinte (SVG + fps + réglages) et on la stocke dans un `.manifest.json`. On ne rend que ce qui a changé. Aujourd'hui, terredebienetre teste seulement si le MP4 existe, et les autres projets rendent tout à chaque fois.
3. **Toujours utiliser un pipe JPEG, jamais de PNG sur disque.** Cela supprime environ 160 Mo de fichiers temporaires par reel, et c'est 40 % plus rapide pour Initi et dronepeaks.
4. Si on n'a qu'un seul processus : `channel: 'chrome'` et GPU Metal donnent +40 %.

### B. Fiabilité (rendus faux ou fragiles aujourd'hui)

5. **Calculer la durée correctement.**
   - Le calcul doit être `max(endTime)` de toutes les animations, ou mieux, un attribut `data-duration` sur la balise `<svg>` écrit par le générateur.
   - barbato prend la 1re animation : `noel/` donnerait environ 1 s.
   - dronepeaks et Initi demandent la durée à la main.
6. **Attendre les polices** avec `document.fonts.ready`, plus une capture de chauffe (comme Initi), au lieu d'un `sleep`.
7. **Gérer SMIL et CSS dans le même seek** (comme dronepeaks) : `svg.setCurrentTime(t)` et `getAnimations().currentTime`. Aujourd'hui, sitevitrine ne gère que le SMIL et barbato que le CSS.
8. **terredebienetre : abandonner `recordVideo`** pour le seek image par image. On gagne en qualité (pas de VP8 intermédiaire), il n'y a plus d'images perdues, et c'est plus rapide qu'un enregistrement en temps réel de 31 s par vidéo.
9. **Couleurs cohérentes.**
   - Forcer `-pix_fmt yuv420p -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709`.
   - 285 MP4 de barbato sont en `yuvj420p`, avec un risque de couleurs délavées sur Instagram.
   - Garder `--force-color-profile=srgb`.

### C. Qualité éditoriale (déjà bien faite dans barbato, à généraliser)

10. **Faire l'audit pendant le rendu, pas dans une passe séparée** : zones sûres Instagram, taille de police ≥ 26 px, chevauchements, accroche avant 1 s, carton final ≥ 2,8 s. L'audit actuel rouvre le SVG et refait 4 seeks par seconde.
11. **Générer à chaque lot une planche de contrôle et un manifeste** (comme sitevitrine v3), pour relire 50 reels en une image.
12. **Gérer la musique en option** (comme Initi) avec fondu d'entrée et de sortie, plus `loudnorm` à −14 LUFS.

### D. Maintenance

13. **Un seul outil `svgMaker`** pour remplacer les 6 copies :
    ```
    svgmaker render <fichiers|dossier> [--fps 25|30] [--jobs 6] [--music x.wav] [--gif] [--audit] [--sheet]
    ```
    - Il lit `data-duration` et `data-fps` dans le SVG.
    - Le rendu est incrémental, avec manifeste.
    - Il sort MP4, couverture JPG, GIF en option, rapport d'audit et planche.
14. **Versionner les générateurs.**
    - barbato : 13 séries n'ont plus leur script.
    - sitevitrine : `social/` et `scripts/reels/` ne sont pas suivis par git.
15. Ajouter `playwright` en dépendance de svgMaker (au lieu de `PUPPETEER_DIR`) et une commande `npm run render`.

### Pistes écartées

- **Encodeur matériel VideoToolbox :** fichiers 2× plus gros, gain de 2 s seulement.
- **Déduplication des images fixes :** seulement 9 % d'images identiques.
- **Rendu sans navigateur (resvg) :** ne gère pas les animations CSS.
