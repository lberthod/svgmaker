# Guide : les méthodes de création vidéo utilisées, et la meilleure

*Synthèse du 8 novembre 2026, faite à partir de l'analyse de ~/Desktop/Coding, ~/ai-video et des caches de modèles. Elle complète [RAPPORT-VIDEOS-SVG.md](RAPPORT-VIDEOS-SVG.md) et [PIPELINE-SVG-VIDEO.md](PIPELINE-SVG-VIDEO.md).*

## 1. Les 10 méthodes trouvées

| # | Méthode | Où | Volume produit | Vitesse | Points forts | Limites |
|---|---|---|---|---|---|---|
| **A** | **SVG animé (CSS/SMIL) → Chrome image par image → ffmpeg** | barbatoPeintures, loicberthod-sitevitrine, terredebienetre, dronepeaks, Initi/svg_reels | environ 640 MP4 | 12 i/s ; 66 i/s avec 6 Chrome | Déterministe, aperçu direct dans le navigateur, l'IA écrit très bien du SVG, fichiers légers, textes nets, multilingue | Pas d'audio intégré ; effets (grain, halos) limités ; mouvement des personnages pénible en CSS |
| **B** | **Python procédural (Pillow + numpy) → pipe ffmpeg** | reels DEMIC (Greny/reels-demic-src), Initi Pinocchio karaoké, leggendo-idees, promos Vedeo | environ 1 500 | rapide (aucun navigateur) | Contrôle total : cinématique inverse des personnages, grain, halos, zoom ; **son synthétisé et calé à l'image près** | Aucun aperçu visuel sans rendu ; 500 à 800 lignes par reel, beaucoup de code dupliqué |
| **C** | SVG généré en Python → cairosvg → ffmpeg | jordi `*numero.py` (guitare, flûte, pastel…) | 14 | moyenne | Vectoriel net, audio synthétisé | cairosvg ne gère ni le CSS animé ni les filtres : tout le mouvement est recalculé à chaque image |
| **D** | Moteur natif Rust (tiny-skia, ou capture de la fenêtre egui) | jordi (Pianumero, kalimba, handpan, glow) | environ 1 800 | très rapide | Production de masse, audio au sample près, même moteur que l'app | Réservé à un domaine (musique) ; lourd à faire évoluer |
| **E** | Page HTML/Canvas → Playwright → ffmpeg | Typiano (`typiano-reel`) | 67 | moyenne | Réutilise le code du site | Comme A, en moins standard |
| **F** | Capture d'écran temps réel (recordVideo, MediaRecorder) | terredebienetre, tutoriel chauffageplan, export navigateur de sitevitrine | environ 75 | temps réel | Simple, parfait pour un **tutoriel d'application** | Non déterministe (images perdues) ; double compression |
| **G** | **IA générative locale** : image → vidéo + voix + musique | ~/ai-video (V01–V22, Zone Grise, manga, manhwa), Initi Leggendo, videeo, devis-solaire | environ 150 films et reels | **lente** : environ 34 min par film de 45 s ; 11 à 13 min par plan avec personnage | Images réalistes ou illustrées impossibles à coder ; voix clonée de Loïc | Plafond qualité des audits environ 5,5/10 (« propre mais oubliable ») ; plans de 8 s max ; un seul job GPU à la fois |
| **H** | Banque de vidéos + LLM + TTS | MoneyPrinterTurbo, Vedeo | environ 20 | rapide | Automatique de bout en bout | Rendu générique, dépend de Pexels (API cloud) |
| **I** | Montage de vidéos existantes (découpe, hook, bandeau) | Classicanimated, handpan_montage, nouveaux-formats, `add_hook.py` | environ 250 | très rapide | Gratuit, immédiat | Pas de création ; droits à vérifier |
| **J** | 3D Blender (bpy) | jordi/billes | 48 | lente | Vraie 3D physique | Lourd |

### Les modèles d'IA en place (tous en local sur le M5 Pro, MLX en priorité)

| Rôle | Modèle retenu | Alternatives testées | Notes des docs |
|---|---|---|---|
| Texte → image (quotidien) | **FLUX.2-klein 4B q4** (environ 18 s par image) | — | Cheval de trait des films |
| Texte → image (qualité) | **FLUX 3 Klein q8** + réécriveur (74 à 96 s) ; **Krea 2 Turbo** (105 s) | MOSS-Image (492 s, le plus beau), Qwen-Image-2512, Z-Image-Turbo | FLUX 3 est le meilleur compromis (4,45/5) et imbattable pour le texte dans l'image |
| Retouche et cohérence du personnage | **Qwen-Image-Edit 2511** (7 min) | — | Garde l'identité sur 8 épisodes |
| Image → vidéo | **Sulphur-2 distill (LTX-2.3) q4** (environ 68 s pour 2 s de vidéo) | LTX-2.5 q8, Wan 2.2 (10× plus lent, exclu) | Bon pour les mouvements subtils, mauvais pour les grands mouvements de caméra |
| Lip-sync | LTX **Dub-It** LoRA (6 s max), **MuseTalk 1.5** | — | 16 s de parole demandent environ 45 min |
| Voix clonée | **Chatterbox Multilingual v2** (ressemblance 0,976) | Qwen3-TTS 1.7B (clonage VCTK et VoiceDesign), Ming 0.5B, MOSS-TTSD (dialogues), Kokoro, Parler, Piper | Chatterbox reste la référence ; v3 n'est pas meilleure |
| Musique | **ACE-Step 1.5** (moins d'1 min) | YuE2 (chanté), Stable Audio 3 (ambiance, ComfyUI) | — |
| Transcription et vérification | **mlx-whisper large-v3-turbo** | Cohere Transcribe (meilleur dans le bruit, sans horodatage mot à mot) | — |
| Choix automatique de la meilleure image | CLIP ViT-L/14 | — | — |
| Détourage | SAM 2.1 tiny | rembg | — |
| Script, plan, critique | Ollama **qwen3.5:35b-a3b** et qwen3:30b-a3b ; Qwen3-VL pour vérifier les plans | — | Les audits « 5 experts » sont faits par Claude Code |

## 2. Quelle est la meilleure méthode ?

**Il n'y en a pas une seule : tout dépend du type de vidéo.** Mais le constat dans tes projets est net :

> Les vidéos **dessinées par du code** (méthodes A, B, D) sont rapides, reproductibles, modifiables et se produisent par centaines. L'**IA générative** (G) coûte 30 à 100 fois plus de temps par seconde de vidéo, et ses propres audits plafonnent vers 5,5/10.
>
> Le format qui marche sur Instagram et Facebook (style DEMIC : 38 M de vues dans ton analyse du top 300) est **minimaliste et graphique**. Il se code ; il ne se génère pas.

### Recommandation par type de contenu

| Je veux faire… | Meilleure méthode | Pourquoi |
|---|---|---|
| Reel de marque : textes, astuces, quiz, offres, logo animé | **A, SVG + Chrome** | Rapide à écrire pour l'IA, aperçu immédiat, traduction FR/EN depuis i18n, audit des zones sûres |
| Métaphore animée avec personnages (style DEMIC), tuto de mouvement (squat) | **B, Python procédural**, ou A si l'animation reste simple | Cinématique inverse, grain, son synchronisé coup par coup : c'est ce qui donne le « punch » |
| Apprentissage musical, karaoké, notes | **D ou B** | Synchronisation audio au sample près |
| Tutoriel d'application ou de site | **F, capture d'écran** | C'est le seul cas où le temps réel se justifie |
| Histoire illustrée, manga, ambiance réaliste | **G, IA**, en ciblant des plans courts | FLUX.2 ou Krea, puis Sulphur-2, Chatterbox et ACE-Step ; comptez une nuit pour 10 films |
| Volume « rapide et sale » | H ou I | Seulement pour tester un format |

### La « meilleure manière » à viser : un pipeline hybride unique

```
 idée (CSV top reels) → script JSON (LLM local ou Claude)
        │
        ├─ scènes graphiques ──► SVG animé (gabarits)   ─┐
        ├─ personnages animés ─► Python procédural      ─┼─► rendu déterministe image par image
        └─ plans réalistes ────► FLUX/Krea → Sulphur-2 ─┘     (6 workers, incrémental)
                                                                │
 voix : Chatterbox (clonée)  ·  musique : ACE-Step  ·  SFX synthétisés
                                                                │
                                   ffmpeg : mix, loudnorm −14 LUFS, H.264 bt709
                                                                │
                      contrôle auto : whisper (texte dit) + audit zones sûres + planche contact
                                                                │
                                      MP4 + couverture + légende + CSV de publication
```

**Les 7 règles tirées de tous les projets :**

1. **Toujours un rendu déterministe** (on fige le temps, puis on capture), jamais une capture en temps réel.
2. **Le contenu dans des données, la mise en forme dans des gabarits.** sitevitrine v3 (séries plus `core.mjs`) et barbato (`lib.mjs`) le font déjà ; les reels DEMIC non (un fichier de 700 lignes par reel).
3. **Une timeline unique** (`data-duration`) qui pilote l'image **et** le son. C'est la force des reels DEMIC.
4. **Images de contrôle avant le rendu complet** (planches), puis audit automatique : zones sûres, police de 26 px minimum, accroche avant 1 s, carton final de 2,8 s minimum.
5. **Rendu parallèle et incrémental** : ×5,4 mesuré, et rien à refaire quand rien n'a changé.
6. **Garder les sources dans un projet versionné avec git**, jamais seulement dans un dossier temporaire (cas DEMIC, sauvé de justesse) ni hors git (cas de `social/` dans sitevitrine).
7. **IA générative seulement là où le code ne peut pas** (décors réels, personnages illustrés), un seul job GPU à la fois, et vérification whisper de chaque réplique.

## 3. Points d'attention trouvés

- 🔐 **`moneyturbo/config.toml` contient une clé API Pexels en clair.** Il faut la déplacer dans un `.env` ignoré par git, ou la renouveler si le dépôt a été partagé.
- Les poids FLUX.1 utilisés par `Vedeo/tools/storyimage` ont été supprimés le 12 septembre. Cet outil ne marche plus sans retéléchargement.
- Il existe des poids « uncensored » (FLUX.2-klein). Ils sont interdits par tes propres guides et bloqués dans videeo.
- Il y a 6 copies du moteur de rendu (A, B, C, E) : c'est la raison d'être de **svgMaker**.
