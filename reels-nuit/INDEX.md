# Série « Pourquoi… ? » — 11 reels histoire/géographie sur carte

Produits dans la nuit du 11 au 12 novembre 2026 avec le format `atlas` de svgMaker (carte plein écran, voix de la guide sans prénom, sous-titres, flèches, pastilles, bruitages sobres, musique lente).
Chaque reel : 1080×1920, 30 i/s, −14 LUFS, audit Reels à 0 alerte, sous-titres = phrase entière.

| # | Fichier | Sujet | Durée |
|---|---|---|---|
| 00 | `final/00-suisse.mp4` | Pourquoi la Suisse parle 4 langues | 93 s |
| 01 | `final/01-belgique.mp4` | Pourquoi la Belgique a 3 langues (Belges, Francs, 1830, 1993) | 94 s |
| 02 | `final/02-italie.mp4` | Comment l'Italie est née (1859 → 1870) | 82 s |
| 03 | `final/03-pays-bas.mp4` | Un pays sous le niveau de la mer (terpen → plan Delta) | 78 s |
| 04 | `final/04-portugal.mp4` | Pourquoi le Portugal existe (1143 → 1640) | 90 s |
| 05 | `final/05-autriche-hongrie.mp4` | Pourquoi l'Autriche-Hongrie a disparu (1867 → Trianon) | 74 s |
| 06 | `final/06-scandinavie.mp4` | Trois royaumes, une couronne : Kalmar (1397 → 1905) | 67 s |
| 07 | `final/07-espagne.mp4` | Pourquoi l'Espagne parle plusieurs langues | 71 s |
| 08 | `final/08-irlande.mp4` | Pourquoi l'Irlande est divisée (Ulster → 1998) | 73 s |
| 09 | `final/09-france.mp4` | Pourquoi la France parle français (Gaulois → Jules Ferry) | 81 s |
| 10 | `final/10-allemagne.mp4` | Pourquoi l'Allemagne naît en 1871 | 92 s |

Légendes prêtes à publier : `LEGENDES.md`. Couvertures (image à 1,9 s) : `couvertures/`. Briefs (sources JSON, modifiables) : `briefs/`. Relancer un reel : `src/formats/build.sh reels-nuit/briefs/NN-….json --crf 25` (les voix sont en cache : 1 à 3 min).

## À vérifier avant de publier (important)

Les récits ont été écrits de mémoire puis relus par un expert « faits » (une IA, sans accès au web) : des erreurs ont été corrigées (dates, raccourcis trompeurs, flèches), mais **aucune source externe n'a été consultée**. Relis au moins les chiffres :

- **00 Suisse** : 62 / 23 / 8 / 0,5 % (OFS 2022, plusieurs langues possibles) ; 91 % de oui en 1938 ; l'histoire des Helvètes et des Burgondes est simplifiée.
- **01 Belgique** : 59 % néerlandais / 40 % français / ~1 % allemand (ordres de grandeur) ; tracé de la frontière linguistique approximatif ; origine de la frontière débattue.
- **02 Italie** : « moins de 10 % parlent italien en 1861 » (estimation, 2,5 à 10 % selon les historiens).
- **03 Pays-Bas** : « environ 26 % sous le niveau de la mer » ; 1 836 morts en 1953 (chiffre courant) ; dates des polders.
- **04 Portugal** : « + 700 ans de frontière presque inchangée » ; l'alliance de Windsor est « souvent citée » comme la plus ancienne encore en vigueur.
- **05 Autriche-Hongrie** : pays coloriés avec les **contours actuels** (indiqué à l'écran), donc la Galicie, la Transylvanie, le Trentin… ne sont pas représentés ; « 50 millions » ≈ 51 M en 1910 ; Trianon : plus des deux tiers du territoire hongrois.
- **06 Scandinavie** : simplifié (la Finlande n'apparaît pas ; Copenhague n'est capitale qu'un peu plus tard).
- **07 Espagne** : étiquettes de langues posées à la main (pas de zones coloriées).
- **08 Irlande** : frontière irlandaise en **tracé simplifié** (indiqué à l'écran) ; sujet sensible : le texte reste factuel.
- **09 France** : l'estimation de l'abbé Grégoire (6 millions) est contestée ; l'ordonnance de 1539 vise surtout la justice.
- **10 Allemagne** : contours actuels (indiqué) ; Zollverein (~18 États en 1834).

## Voix
La voix de la série est la voix inventée « guide » (Ming-3.0, MIT), sans prénom ni personnage. Les mots étrangers sont lus approximativement (modèle français). Deux autres voix existent (`narrateur` homme posé, `narratrice` femme adulte) : ajouter `"voice": "narrateur"` à un brief puis relancer `build.sh` (3 à 8 min de synthèse).

## Technique
- Code : `src/formats/atlas/` (format, guide `STYLE.md`), `src/kit/{people,rays}.mjs`, `src/kit/geo/{ch,eu}.json`, `src/formats/carte/audio.py` (voix, musique « pad », bruitages, instants des mots par Whisper).
- Nouveaux champs utiles : `base` (contour permanent du pays), `year`, `moves`, `highlight.countries`, `at: {line, word, d}` (calage image-voix sur un mot), `backdrop`, `crowd`, `big`.
- `reels-nuit/produire.sh` rejoue tout le lot.

## Contrôles effectués cette nuit
- **Faits** : 5 relectures indépendantes (2 reels chacune) ont corrigé de nombreux raccourcis trompeurs avant le rendu (voir « À vérifier »). Aucune source web consultée.
- **Direction artistique** : audit sur 3 reels (notes 5 à 6/10) → cadrage décalé vers le bas, voile du haut renforcé, pastilles sur les étiquettes, flèches/silhouettes plus grosses, palettes sans doublons, mention « contours actuels » en pied de carte.
- **QA technique** : 11 MP4 en H.264 1080×1920 30 i/s, −14 LUFS (pic −1,4 dBFS), 0 alerte d'audit Reels, 58 tests verts. Calage image-voix désormais tolérant (mot flou ou, à défaut, position dans la phrase) et phonétique automatique (« Ier », « Ve siècle », « av. J.-C. », « Sadowa »…).
- **Reste à faire par un humain** : écouter chaque reel une fois (noms propres néerlandais, mots étrangers) et relire les chiffres ci-dessus.
