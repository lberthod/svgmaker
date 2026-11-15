# Pipeline Terra Narrata (état de travail)

Objectif : 47 reels (00-10, 15-25 existants refondus ; 26-50 nouveaux), audités puis publiés par lots de 10 sur https://terranarrata.fr/.

## Étapes (par lot)
1. Rendu : `reels-nuit/produire.sh <briefs…>` (un seul à la fois ; ne jamais lancer deux rendus en parallèle). Journal : reels-nuit/STATUS.txt, logs/<id>.log.
2. Planches d'audit (0,5 s) : `reels-nuit/outils/planches.sh final/<id>.mp4 <dossier>`.
3. Audit : 5 agents par vidéo (rôles dans reels-nuit/outils/AUDIT.md), rapports extraits avec `reels-nuit/outils/extraire-rapport.py <agentId> <fichier>`.
4. Correction des briefs (agents « fixers »), re-rendu, contrôle : `python3 reels-nuit/outils/controle.py <id>` (durée 55-100 s, son, boucle ssim ≥ 0,85, ≤ 2 alertes d'audit).
5. Publication : `reels-nuit/outils/publier.sh <id> …` (réencode 720p, fiche, ingest, deploy du projet Astro ~/Desktop/Coding/terranarrata). Lots : A = 00-09, B = 10,15-23, C = 24-33, D = 34-43, E = 44-50.

## Règles de la série
Pas de question au spectateur, pas d'appel à l'action ; aucun chiffre dans la voix (ordinaux compris) ; ≥ 2 plein-écran ; tag @terranarrata automatique ; dernière image = première ; dernière phrase amène la question d'ouverture ; faits vérifiés (Wikipédia, sources officielles).

## Notes
- Le site est un projet Astro (séries/épisodes), pas un index.html : ne pas écraser dist/ à la main.
- Ne pas écrire de scripts de travail dans un dossier partagé entre agents (collisions).

## Audit lot A, vague 1 (agents : faits, lisibilité, carto, caméra, compo) — rapports à extraire avec outils/extraire-rapport.py <agentId> <sortie.md>
Sortie : /private/tmp/claude-501/-Users-loicberthod-Desktop-Coding-svgMaker/323a639c-fe64-4057-acf3-202ba488ad53/scratchpad/audit/A/rapports/<id>-<n>-<role>.md
- 00-suisse : a10c892c15852044d, ac43975e4412b5bb7, ad0be43acf8a9657b, a800caaf2e887ebee, a4ce06c547a72166d
- 01-belgique : a3d7c52ddc17384bc, a67fe9415475824d2, a7b07e30c7f1eadb8, aa7feb5b5360abfb0, a903a12a423b857f2
- 02-italie : a56e3f3a63d408cdc, a2f8c054d51d56d2b, aa3d29468bec2f88a, a043ffb1cd1f452c8, a4ab569f2e1a666a4
- 03-pays-bas : abc3e351bb848e60e, a3a85d6c026a80030, ad74cc538ecea5d2a, a9d7d8baa7aa4d8b1, a3749b28b03071414
(Reste lot A : 04 à 09 ; planches déjà faites dans .../scratchpad/audit/A/<id>/)
- 04-portugal : a1b82bc6d92c2db83, a97bfd1728c308f81, a3f3619e4caaaafe7, a06b64da1dc8974ec, ae3e5573ba022a503
- 05-autriche-hongrie : a2d1b143e2f00a89b, a44771dcf76d72b1f, a977c881857c55d8d, a7cb9c1690079b25b, a2e85b6e5dae0ca3b
- 06-scandinavie : ac61320c26f4c93cb, a1e5bfa9523f9f97f, ae1cdcab8e7dffe7f, ac73504dc41aba8e5, a85131edc69857d0a
Fixers lancés (boucle 2 du lot A) : 00, 02, 03 ; rapports 00-03 extraits dans .../audit/A/rapports/. Générateur amélioré après l'audit : boucle (fondu final), frises, chiffres romains → arabes (disp), mots-outils en fin de ligne, étiquettes moins repoussées.
- 07-espagne : a0799ba930b008487, a90f68468d2b0059e, aebee626bff981b94, a8ad929c8046de3bf, afac7b491994a87ec (audit terminé ; rapports à extraire en 07-<n>-<rôle>.md)
- File de rendus : reels-nuit/outils/file.sh tourne en fond (queue reels-nuit/queue.txt) ; prio.sh pour passer un brief en tête. Ne JAMAIS lancer produire.sh en parallèle.

## État lot A (13/11 12:30)
Briefs corrigés (boucle 2) : 00–09 tous. File de rendu : 09,07,08,05,04,06,02,01,03,... (00 en rendu). Ensuite : controle.py 00–09, puis publier.sh lot A.
13/11 13:45 fix générateur: endfade (fondu sortie highlights/lines/entities/ui sur dernière 1.5s) -> re-rendu lot A complet
13/11 14:10 LOT A PUBLIE (00-09). controle.py: alertes réelles <=1 (hors tag/carton final).

## Lot B audit (13/11 14:40) - planches dans scratchpad/audit/B/<id> ; agents (faits,lisib,carto,camera,compo)
10-allemagne: aa55e4bb2fa05e9fd ab62169601534f470 ac54c33f326f143f4 a1975ef38733e88ef a59c220637348bbd5
15-luxembourg-v5: af3b61f9f98d29ca5 a7cd9aa41f8ea0111 a782cfdc45a69fd4a a77af61f703595121 ada1a6bf380e6e3ca
16-royaume-uni: a9b885bb9f098db72 afc63fa979dcc3708 aabb8548ddc7e821d a2600e9ff3194ef7b ae3deb07c4273ad80
17-pologne: a19d5aad010dd2d29 aad92b3e265fd3684 a010f79584880cafd a092f1144dc401ad9 a0cae4422ac0d816a
A lancer ensuite : 18,19,20,21,22,23 (planches prêtes). Extraction: bash + extraire-rapport.py <id> <out> (zsh: pas de word-split).
18-grece: a898e890a2ba5c910 ad50b277133cbd807 a9543a649061c50da af80967556a687aa9 a16664a7a67d14796
19-finlande: ae2686d1a47d76e8f a35df7f5f7f2b4efa aff3284f00c509ee2 a3dd1b59cf0e67299 aab0bc0fc11847e5d
20-pays-baltes: abb6a474259053db0 a21ee1b3559c82c35 a0cba5b57b72a3770 a9954a50a0cf75bcb a66174c4f504c3915
21-roumanie: a97df1b0eb3d86ea4 a42bf65308762c0d8 a83a34d52bb4e0a12 a275ec3eb44f9e4e2 a68874d80ffc922b7
Fixers lancés : 10,15,16,17 (briefs corrigés, en tête de file de rendu). Générateur corrigé (agent): stats/arts 32px/endfade/hook t0.4 etc.
(fixers 19=a2360fc00904844e8, 21=a1883463e8dd6d718)
22-balkans-yougoslavie: a7912718de64b8801 ab35211d79a32809f aae8a81e741e7a9c9 a26fbd1567fc0a01e ab5466d1f166247bc
23-islande: a39281babe449b8c4 ad3cd423b02477648 a20379750af813d66 aab9ff99c59a9f266 ac835bb0435fcce08
Reste: fixer 20 (carto a0cba5b57b72a3770), puis lot B = 10,15..23 rendus/controles/publication.
14:50 lot B: tous briefs corriges (10,15-23). Rendus en file (ordre prio: 22,20,23,21,19,18,15,17,10 + 16 en cours). Ensuite: controle.py, inspection visuelle, publier lot B (10,15-23) si OK; puis lot C (24-33) audit.
13/11 15:55 LOT B PUBLIE (10,15-23).

## Lot C audit (13/11 16:55) - planches scratchpad/audit/C/<id> ; lot lance 24..27 ; ensuite 28..33
24-malte: a3b604a44c39f9155 abe980f767c2b7104 a10d70d7cd2e6d17a a02ac7a1c1cbb29de a7cd205312591649b
25-micro-etats: a38eb9ec35fe93626 ae9f20ac4963b7319 ab6306c47996132b8 ad4412288f70344a8 a666f21ea990ed003
26-hongrie: aaf449d75c5053c43 ab4eef92a338174e8 acd63633372c04b34 a07b2a30341f225db a438cbdaa0cda7571
27-tchequie: acf6cb997bd16983b a705a15ddd411ea41 a68869784d1d22de4 a257d895cae07ea78 a62a665c8add83619
(ext.py <lot=C> <id> 5 agents ; planches 28-32 deja prêtes, 33 a generer)
28-bulgarie: afd74fed57adfef6a a09ad314dd72bcfc5 abdacbee20d20b6d7 a9ff10ab43af056db a43a6e0e06e4a9b0f
29-istanbul: a14e89c810e3b6d40 a38585fc8c8acb6c8 af4abfdb50c7e056e a6efbd7c3e7839214 af1219baf8f78bf64
(Lot C: fixers a lancer quand 5 rapports complets; 24 OK; 25 manque lisib ae9f20ac4963b7319; 26 manque compo a438cbdaa0cda7571; 27 manque camera a257d895cae07ea78)
Defaut police: « IV »/« VI »/« VIVANT » crénage V-I : a corriger dans le générateur.
17:25 kernIV ajoute dans formats/common.mjs textBlock (IV/VI). Fixers lances 24,25,26,27 (lot C).
31-danemark: a6a895f5cd1cedf97 a23aa088876d8c0fc afea9a057d962ce25 a6025509f85176917 a94f49856354377e0
32-norvege: a531f90501c796a86 a1e626ee21d3545b3 a306393b71cd5ada7 aba5aa77399bea1e0 a474459328c7fa5c5
33-catalogne: aae4b6af9bf702785 abbb4840a7c04e29a a68e22de5f14fa416 a6cacc727a5561473 a414d9bfb9f04e208
Lot C: briefs 24-29 corriges (en file de rendu), 30 en correction (a164a3a86fd0f41ea). split art accelere (tr=a+1.0).
Lot C: fixers lances 31 (ad18a8b1cf04d155e), 32 (a37cecb5da740ea05), 33 (af3fc5daf31cebcce). Prochain: re-rendus C, controle, publication C; puis audit D (34-43).
13/11 19:05 LOT C PUBLIE (24-33).

## Lot D audit (13/11 19:10) - planches scratchpad/audit/D/<id> ; 34 re-rendu prio ; 38+ a generer
35-ecosse: ab8e1cac187d1fe2f af9d9698abefa7164 a6fafd6507a0329a4 ad7eaf5637f474e95 adfb15fbee80cc5f1
36-corse: aff24bfdcb0d77797 ade70e042b857ba2c a761337d5cf634847 ace705831f942501e ad085ece720514430
37-bretagne: ae7e8c7e066d1fb02 a83efa6bc80b769a2 a14a7d43798958bae a4832d9a5dc8cd921 a78e75f1c5d042b7f
(ext.py D <id> 5 agents) ; controle.py compare maintenant la 1ere image (t=0).
38-alsace-lorraine: aaac67f2834747ca1 a00df87b09d5f38d9 a652518efe1671e38 a488246bd9e69d1b1 a3af963ad869ade2c
Fixers D: 36=aae38dede216ccf7a 35=a85c5c3f77b9a3174 ; 37 a lancer ; decimales "5,4" corrigees dans le generateur.
34-pays-basque: ae7337c81b3359a3b a6e2f5c3e5f84765f a3b444bfbc5d2eb64 a3a612735f7d1758c a740304c92f3272f6
Fixers D lances: 35,36,37 (briefs en file de rendu), 38 (a6dc55d48043b30eb). A faire: audits 39..43 apres rendus, puis publication lot D.
39-savoie-nice: a594867facabc187b a4a87ec57977dad50 a8d6067ce454742d5 a16c18149a8ad7e89 afe56ae517958fc26
Fixers D tous lances/finis: 34,35,36,37,38 (briefs corriges, en file de rendu). Reste audits 39,40,41,42,43.
40-tyrol-du-sud: a17c947e06872f038 a06ea4dbfc918415b acd526fc86962a680 aebbd1187d4cfc984 aa3a62489094e66bb
D re-rendus: 34,35,36,38,39 OK (controle); 37 re-rendu en cours (pill Lampaul retire). Reste audits 41,42,43.
41-albanie: a7fecb322ed1f21e2 a2cb7ab4b792f71c8 a8b8574ba20121f1c ab5f754b0fa5c21b1 abb3b60a67498db0a  (fixer 40 = afd13ee94ac64d55a)
Reste audit 42,43 apres rendu ; 37 re-rendu ok? a controler.
42-bosnie: a6a3f401b5ab0f020 a4615e36d63f53e41 ae0d79c82012ce187 a560577c2abefb3cc ad64d382294a51e67 ; fixer 41 a lancer
43-slovenie: a0f47802168c454d1 aba6d44ce7827c476 a5e27fc6b0d823a7e a99867d779cee5f5c a2094b59811101a64
LOT E: 44-moldavie: a04b606c66cbc810f a63441826c3508061 a497940ba2c1ae907 a284300616691056c ada48b1d518343d24 (faits lisib carto camera compo). Fixers D: 41,42,43 corriges. Reste: publier D (34-43) apres controle; E 45-50 audits.
13/11 20:42 LOT D PUBLIE (34-43).
20:50 LOT D: media 34-43 prêts + fiches draft:false + titres + textes/og locaux, MAIS deploy NON fait : la session site a une refonte non validée par Loïc dans le même build (npm run deploy publierait tout). En attente de l'accord de Loïc. deploy.sh corrigé (sans --chmod).
45-charlemagne-verdun: ab741b8505de0af26 a17404a7a97016630 aa32be0ce92bfd107 aba38030d2bc9f73c a3f9237989b5561a6 ; LOT D EN LIGNE (deploye par la session site, 40 episodes). Fixer 44 fait (brief en file de rendu).
LOT E: 45 fixer a35630328aadb029b fait (re-rendu prio). 46 audits: faits aadbfa4ff7146538b lisib abfa5ca8eb1390d0a carto a8915edaed4a85077 camera a7ad79d332db24aeb compo a30ea849602876379
46 fixer ac8288eb7122c061b fait, prio re-rendu. 45 re-rendu (Francie mediane decalee)
CONSIGNE session site (13/11): 45-49 -> serie traites, 50 -> serie geographie, publies par sessions dediees (npm run publier). Je ne publie en europe que 44. Je finis audits/rendus 45-50.
44-moldavie PUBLIE (13/11 21:56)
47-50 audites (rapports audit/E/rapports) + fixers faits ; re-rendus en file (13/11 22:10). 46 controle OK. 45 label Francie recale a 3.6
LOT E TERMINE (14/11 08:55): 44 publie europe; 45-49 contrôle OK -> serie traites (session dediee), 50 contrôle OK -> geographie. Sessions prevenues.
