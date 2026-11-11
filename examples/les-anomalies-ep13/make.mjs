// « LES ANOMALIES » ép. 13 · Les Anomalies : manga d'action, 40 s, 1080x1920 (Reel).
// Les mutants libérés du labo rejoignent l'équipe sur le toit de la planque. Un drone espion est pulvérisé
// par toutes les couleurs à la fois ; le groupe prend un nom : « LES ANOMALIES ». Fin : la Tour OMEGA se déplie en forteresse.
// Usage : node make.mjs → les-anomalies-ep13.svg + timeline.json (lu par audio.py)
import * as L from '../les-anomalies/lib.mjs';
const { W, H, PAPER, INK, NIGHT, RED, VOLTA, GIVRE, ECHO, MIRAGE, ORANGE, rnd, f, vis, scene, an, radial, burst, cracks, bolt, onom,
  bubbleFor, tag, figure, hand, put, aura, smoke, reticle, BG, GROUND, cam, particles, streaks, shakeAt, flashAt, sfx, mv, go, anim,
  fadeIn, ghost, bobbing, holo, tower, header, hook, finalCard, city, rooftops, waterTower, drone, searchlight, logo, sky, swarm } = L;
L.reseed(13 * 101);

// ---------- Les mutants libérés (nouveaux personnages) ----------
const ROSE = '#ff4fa8', ONDE = '#3d7bff', NOVA = '#e9e6ff', ROC = '#c08a4e';
L.addChar('braise', { accent: ORANGE, hair: 'spiky' });
L.addChar('rose', { accent: ROSE, hair: 'long' });
L.addChar('onde', { accent: ONDE, hair: 'swept' });
L.addChar('nova', { accent: NOVA, hair: 'bun' });
L.addChar('roc', { accent: ROC, hair: 'hood' });
// Volta depuis l'ép. 12 : cheveux blanc-jaune (on recolore les pointes de la figure de la lib)
const voltaX = (pose, o = {}) => figure('volta', pose, o).replace(
  `fill="${INK}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"`, `fill="#fff4b8" stroke="${INK}" stroke-width="5" stroke-linejoin="round"`);

const LINES = [
  { who: 'givre', t0: 1.9, t1: 3.4, text: 'Ils ont répondu. Ils arrivent.' },
  { who: 'echo', t0: 4.7, t1: 6.1, text: 'Là, sur les toits !' },
  { who: 'ally', t0: 9.3, t1: 11.3, text: "Sujet 9. On s'est évadés du labo." },
  { who: 'mirage', t0: 12.2, t1: 13.5, text: "Et si c'est un piège ?" },
  { who: 'ally2', t0: 13.8, t1: 15.4, text: 'Kessler nous a tout pris.' },
  { who: 'givre', t0: 15.8, t1: 17.1, text: 'Attention, un drone !' },
  { who: 'volta', t0: 20.2, t1: 21.6, text: "Ça, c'est une équipe !" },
  { who: 'echo', t0: 23.2, t1: 25.0, text: "Et notre équipe, on l'appelle comment ?" },
  { who: 'givre', t0: 25.2, t1: 27.0, text: 'Kessler nous appelle des anomalies.' },
  { who: 'volta', t0: 27.5, t1: 29.4, text: 'Alors nous serons… LES ANOMALIES !' },
  { who: 'mirage', t0: 31.5, t1: 33.0, text: 'Euh… la Tour bouge.' },
  { who: 'kessler', t0: 35.0, t1: 36.6, text: 'Activez la forteresse.' },
];
L.setLines(LINES);

// ---------- Décors et effets propres à l'épisode ----------
const SKY = `${sky}${an('pulse', 0, `<circle cx="760" cy="520" r="200" fill="${PAPER}" opacity=".16"/>`, [760, 520], ';animation-iteration-count:infinite;animation-direction:alternate;animation-duration:2.4s')}`;
const roofDeck = (y) => `${GROUND(y, '#0b0b12')}<path d="M-700 ${y} L1780 ${y}" stroke="${PAPER}" stroke-width="5" opacity=".35"/>
  ${Array.from({ length: 14 }, (_, i) => `<path d="M${-600 + i * 180} ${y + 6} L${-640 + i * 180} ${y + 400}" stroke="#1c1c26" stroke-width="10"/>`).join('')}`;
// arc de saut : le personnage part de [dx,dy], monte de « up » px et retombe à sa place
const hop = (t, d, [dx, dy], up, body) => anim(t, d, [`0%{transform:translate(${dx}px,${dy}px)}`, `50%{transform:translate(${f(dx / 2)}px,${f(dy / 2 - up)}px)}`, '100%{transform:translate(0,0)}'], body, { ease: 'cubic-bezier(.3,.6,.4,1)' });
// signal coloré dans le noir (yeux/aura d'un mutant sur un toit lointain)
const beacon = (x, y, color, t) => an('pop', t, `${an('pulse', t, `<circle cx="${x}" cy="${y}" r="70" fill="${color}" opacity=".35" filter="url(#glow)"/>`, [x, y], ';animation-iteration-count:infinite;animation-direction:alternate;animation-duration:.7s')}`, [x, y]);
const TEAM = [['braise', ORANGE], ['rose', ROSE], ['onde', ONDE], ['nova', NOVA], ['roc', ROC]];
// flamme stylisée (Braise)
const flame = (x, y, s = 1) => put(`<g class="flick2" style="animation-duration:.18s"><path d="M0 0 C-60 -40 -50 -120 -10 -200 C0 -140 30 -130 26 -190 C70 -120 70 -40 0 0Z" fill="${ORANGE}" filter="url(#glow)"/>
  <path d="M0 -10 C-26 -40 -20 -90 0 -120 C10 -80 30 -60 0 -10Z" fill="#ffe08a"/></g>`, x, y, s);
// la forteresse : ailes qui coulissent, tourelles qui montent, canons qui s'abaissent, bouclier rouge
const wing = (side) => {
  const x0 = side < 0 ? -470 : 170, w = 300;
  let win = '';
  for (let yy = -560; yy < -60; yy += 80) for (let xx = x0 + 40; xx < x0 + w - 30; xx += 70) if (rnd() > 0.35) win += `<rect x="${xx}" y="${yy}" width="26" height="38"/>`;
  return `<path d="M${x0} 0 L${x0} -620 ${Array.from({ length: 5 }, (_, i) => `L${x0 + i * 60} -620 L${x0 + i * 60} -670 L${x0 + i * 60 + 30} -670 L${x0 + i * 60 + 30} -620`).join(' ')} L${x0 + w} -620 L${x0 + w} 0Z" fill="#14141c" stroke="${RED}" stroke-width="7"/>
    <g fill="${RED}" opacity=".7" class="flick1" style="animation-duration:1.4s">${win}</g>
    <path d="M${x0} -320 L${x0 + w} -320" stroke="${RED}" stroke-width="4" opacity=".6"/>`;
};
const turret = (x, t) => `<g transform="translate(${x} -620)">
  <rect x="-60" y="-200" width="120" height="200" fill="#1a1a22" stroke="${RED}" stroke-width="6"/>
  ${anim(t, 0.8, ['from{transform:rotate(-80deg)}', 'to{transform:rotate(0deg)}'], `<rect x="-16" y="-180" width="32" height="200" fill="${INK}" stroke="${PAPER}" stroke-width="4" transform="rotate(${x < 0 ? 30 : -30} 0 -180) translate(0 -150)"/>`, { origin: [x + 540, 880], ease: 'cubic-bezier(.3,1.4,.5,1)' })}
  <circle cx="0" cy="-180" r="44" fill="${INK}" stroke="${RED}" stroke-width="6"/>
  <g class="epulse" style="transform-origin:0px -180px"><circle cx="0" cy="-180" r="16" fill="${RED}" filter="url(#glow)"/></g></g>`;
const fortress = (x, yb, s, t0) => put(`
  ${an('impact', t0 + 2.0, `<path d="M-760 0 A760 820 0 0 1 760 0Z" fill="${RED}" opacity=".12"/><path d="M-760 0 A760 820 0 0 1 760 0" fill="none" stroke="${RED}" stroke-width="10" filter="url(#glow)" opacity=".8"/>
    <path d="M-560 -420 L560 -420 M-700 -200 L700 -200 M0 -820 L0 0" stroke="${RED}" stroke-width="3" opacity=".35"/>`, [x, yb])}
  ${mv(t0 + 0.9, 0.9, [0, 500], `${turret(-320, t0 + 1.6)}${turret(320, t0 + 1.7)}`, 'cubic-bezier(.2,.9,.3,1)')}
  ${mv(t0, 1.1, [300, 0], wing(-1), 'cubic-bezier(.6,0,.3,1)')}${mv(t0, 1.1, [-300, 0], wing(1), 'cubic-bezier(.6,0,.3,1)')}
  ${tower(0, 0, 1)}
  ${vis(t0, t0 + 1.2, particles(30, '#ff9a8a', [-500, 500], [-700, 0], [0, -200], [3, 7], [0.4, 0.8]))}`, x, yb, s);

// =====================================================================
// 1 · La planque (0 – 4 s) : toit, nuit ; le message des mutants clignote, Volta crépite (cheveux blanc-jaune)
scene(0, 4, cam(0, 4, [[0, 0, 40, 0, 1.0], [4, 0, -50, 1, 1.15]], `
  ${SKY}
  ${an('parx', 0, city(1250, '#0a0a12', VOLTA))}
  ${waterTower(900, 1600, 0.9)}
  ${roofDeck(1600)}
  ${particles(26, PAPER, [-200, 1280], [0, 1500], [-80, 240], [2, 4], [2, 4], 0.3)}
  ${put(figure('givre', 'stand', { anim: 'idle' }), 210, 1640, 0.6)}
  ${put(figure('mirage', 'hips', { anim: 'idle' }), 900, 1640, 0.52, -1)}
  ${put(figure('echo', 'stand', { anim: 'idle', float: true }), 700, 1610, 0.56, -1)}
  ${put(voltaX('charge', { anim: 'charge', glow: true }), 450, 1680, 0.7)}
  ${aura(450, 1400, VOLTA, 3, 90, 0)}
  ${bolt(400, 1200, 300, 980, VOLTA, 8, 6, 26, 0.4)}${bolt(500, 1200, 620, 1000, VOLTA, 8, 6, 26, 1.1)}
  ${particles(30, VOLTA, [360, 540], [1000, 1500], [0, -260], [2, 6], [0.3, 0.7])}
`, [540, 1300]) + `
  ${header(13, 'Les Anomalies')}
  ${hook('Ce soir, l’équipe s’agrandit.', 0.3, 900)}
  ${an('pop', 0.6, holo(560, 560, 400, 210, `<text x="760" y="640" class="rt" style="font-size:36px" fill="${MIRAGE}">MESSAGE REÇU :</text><text x="760" y="710" class="rt" style="font-size:40px" fill="${PAPER}">ON VEUT</text><text x="760" y="755" class="rt" style="font-size:40px" fill="${PAPER}">SE BATTRE.</text>`, MIRAGE), [760, 665])}
  ${bubbleFor(0, 300, 470, ['Ils ont répondu.', 'Ils arrivent.'], [-60, 100])}
`);
sfx('hit', 0.05); sfx('electric', 0.2); sfx('holo', 0.6); sfx('zap', 1.1); sfx('wind', 2.0);

// 2 · Sur les toits (4 – 8 s) : des lueurs de couleur s'allument sur les toits voisins, puis tout le monde saute
const far = [[150, 1010, ORANGE], [360, 960, ROSE], [640, 990, ONDE], [840, 940, NOVA], [990, 1000, ROC]];
scene(4, 8, cam(4, 8, [[4, -140, 0, -1, 1.18], [6.4, 140, -20, 1, 1.18], [8, 0, -60, 0, 1.0, 'ease-in']], `
  ${SKY}
  ${an('parx', 4, city(1180, '#08080e', '#6a6a88'))}
  ${rooftops(1080, '#0b0b13', VOLTA)}
  ${far.map(([x, y, c], i) => beacon(x, y - 120, c, 4.3 + i * 0.25)).join('')}
  ${far.map(([x, y, c], i) => vis(4.3 + i * 0.25, 8, go(6.6 + i * 0.08, 1.2, [(540 - x) * 0.4, 900], an('pop', 4.3 + i * 0.25,
    put(figure(TEAM[i][0], i % 2 ? 'stand' : 'hips', { anim: 'idle', glow: true }), x, y, 0.32, i < 2 ? 1 : -1), [x, y - 110]), 'cubic-bezier(.4,-0.6,.7,.4)'))).join('')}
  ${vis(6.6, 8, streaks(22, PAPER, [300, 1500], -700, [2, 4], [0.2, 0.35], 80))}
  ${particles(30, ECHO, [-200, 1280], [800, 1500], [0, -200], [2, 4], [1, 2], 0.5)}
  ${roofDeck(1640)}
  ${put(figure('echo', 'point', { anim: 'idle', float: true, glow: true }), 160, 1680, 0.62)}
`, [540, 1100]) + `
  ${bubbleFor(1, 560, 430, ['Là, sur les toits !'], [-260, 100])}
  ${vis(6.6, 8, onom(600, 1350, 'TAP · TAP · TAP', 76, -4, PAPER, INK, 6.6))}
`);
sfx('beep', 4.3); sfx('beep', 4.55); sfx('beep', 4.8); sfx('beep', 5.05); sfx('beep', 5.3); sfx('whoosh', 6.6); sfx('step', 6.9); sfx('step', 7.2); sfx('step', 7.5);

// 3 · L'atterrissage (8 – 12 s) : Braise tombe en flammes, Rose et Onde atterrissent derrière lui
scene(8, 12, shakeAt(8.55, cam(8, 12, [[8, 0, -80, 0, 1.3], [8.6, 0, 0, 0, 1.12, 'ease-out'], [12, -30, -40, -1, 1.2]], `
  ${BG(PAPER)}
  <rect x="-700" y="-1000" width="${W + 1400}" height="2600" fill="url(#tone)" opacity=".25"/>
  ${radial(540, 1200, 160, INK, [320, 560])}
  ${GROUND(1600)}
  ${an('dropIn', 9.4, put(figure('rose', 'float', { anim: 'idle', glow: true, float: true }), 220, 1560, 0.62))}
  ${an('dropIn', 9.6, put(figure('onde', 'guard', { anim: 'idle', glow: true }), 870, 1580, 0.64, -1))}
  ${vis(9.85, 12, an('impact', 9.85, burst(220, 1570, 30, 110, 9, '#fff', ROSE), [220, 1570]))}
  ${vis(10.05, 12, an('impact', 10.05, burst(870, 1590, 30, 110, 9, '#fff', ONDE), [870, 1590]))}
  ${an('dropIn', 8.0, put(figure('braise', 'slam', { anim: 'fight', glow: true }), 540, 1620, 0.86))}
  ${vis(8.55, 12, `${an('impact', 8.55, burst(560, 1600, 60, 260, 14, '#fff', ORANGE), [560, 1600])}${cracks(560, 1610, 7, 220, INK, 5)}
    ${flame(380, 1600, 0.9)}${flame(720, 1600, 1.1)}${flame(470, 1600, 0.6)}
    ${particles(40, ORANGE, [380, 760], [1100, 1600], [0, -420], [3, 8], [0.5, 1.1])}
    ${an('drift', 8.6, smoke(560, 1600, 6, 360, '#6d6a66', 0.3))}`)}
`, [540, 1300]), 2) + `
  ${tag(70, 236, 'BRAISE', 'FEU', ORANGE, 8.7)}
  ${vis(8.55, 9.3, onom(540, 760, 'BOOM !', 150, -6, ORANGE, INK, 8.55))}
  ${bubbleFor(2, 560, 520, ['Sujet 9.', "On s'est évadés du labo."], [0, 110])}
  ${flashAt(8.55)}
`);
sfx('whoosh', 8.0); sfx('boom', 8.55); sfx('land', 9.85); sfx('land', 10.05);

// 4 · Méfiance (12 – 15,5 s) : Mirage croise les bras ; Onde répond, la main levée sur une bulle d'eau
const oH = hand('cast', 'ra', 820, 1640, 0.95, -1);
scene(12, 15.5, cam(12, 15.5, [[12, 120, 0, -2, 1.12], [13.6, 60, 0, 0, 1.08], [15.5, -110, -20, 2, 1.14]], `
  ${BG('#0b1020')}
  ${radial(540, 1100, 120, '#121a33', [320, 560])}
  ${an('parx', 12, rooftops(1500, '#06060c', ONDE))}
  ${GROUND(1640, '#05050a')}
  ${put(figure('mirage', 'hips', { anim: 'idle' }), 250, 1640, 0.95)}
  ${particles(24, MIRAGE, [80, 420], [1000, 1640], [0, -200], [2, 5], [1, 2], 0.6)}
  ${put(figure('onde', 'cast', { anim: 'cast', glow: true }), 820, 1640, 0.95, -1)}
  ${put(an('pulse', 12, `<circle cx="0" cy="0" r="80" fill="${ONDE}" opacity=".35"/><circle cx="0" cy="0" r="80" fill="none" stroke="#bfe1ff" stroke-width="6"/><path d="M-40 -20 Q-10 -50 30 -30" stroke="#fff" stroke-width="8" fill="none" opacity=".8"/>`, [0, 0], ';animation-iteration-count:infinite;animation-direction:alternate;animation-duration:.6s'), f(oH[0]), f(oH[1] - 70), 1)}
  ${an('ripple', 13.9, `<circle cx="${f(oH[0])}" cy="${f(oH[1] - 70)}" r="120" fill="none" stroke="${ONDE}" stroke-width="6"/>`, [oH[0], oH[1] - 70], ';animation-iteration-count:infinite;animation-duration:.9s')}
  ${particles(30, ONDE, [600, 1000], [900, 1500], [0, -260], [3, 6], [0.8, 1.6])}
`, [540, 1200]) + `
  ${tag(70, 236, 'ONDE', 'EAU', ONDE, 13.8)}
  ${bubbleFor(3, 400, 500, ["Et si c'est", 'un piège ?'], [-80, 110])}
  ${bubbleFor(4, 640, 520, ['Kessler nous a', 'tout pris.'], [120, 110])}
`);
sfx('wind', 12.0); sfx('ice', 13.9);

// 5 · Le drone espion (15,5 – 19,5 s) : un drone scanne le groupe, toutes les couleurs tirent ensemble
const row = [[110, 'nova', 0.4], [230, 'rose', 0.44], [350, 'givre', 0.48], [470, 'braise', 0.5], [590, 'volta', 0.5], [710, 'echo', 0.48], [830, 'onde', 0.44], [950, 'roc', 0.4]];
const col = { nova: NOVA, rose: ROSE, givre: GIVRE, braise: ORANGE, volta: VOLTA, echo: ECHO, onde: ONDE, roc: ROC };
const DR = [700, 640];
scene(15.5, 19.5, shakeAt(18.5, cam(15.5, 19.5, [[15.5, 0, 0, 0, 1.0], [17.3, 0, 20, 0, 1.04], [18.4, -60, 120, -3, 1.25, 'ease-in'], [19.5, 0, 0, 0, 1.08, 'ease-out']], `
  ${SKY}
  ${an('parx', 15.5, city(1300, '#08080e', RED))}
  ${roofDeck(1560)}
  ${vis(15.5, 18.5, `${mv(15.5, 1.0, [500, -500], an('hover', 15.5, drone(DR[0], DR[1], 2.2), null, ';animation-iteration-count:infinite;animation-direction:alternate'))}
    ${an('scan', 16.2, `<polygon points="${DR[0]},${DR[1] + 40} 180,1560 1000,1560" fill="${RED}" opacity=".18"/>`, [DR[0], DR[1] + 40])}
    ${reticle(590, 1330, 80, 16.6)}`)}
  ${row.map(([x, k, s], i) => put(k === 'volta' ? voltaX(i % 2 ? 'castUp' : 'cast', { anim: 'cast', glow: true }) : figure(k, k === 'givre' ? 'point' : (i % 2 ? 'castUp' : 'cast'), { anim: 'cast', glow: true, float: k === 'echo' || k === 'rose' }), x, 1560, s, x > 600 ? -1 : 1)).join('')}
  ${vis(17.4, 18.6, row.map(([x, k, s], i) => bolt(x, 1560 - 560 * s, DR[0] + (i - 3.5) * 8, DR[1] + 10, col[k], 12, 8, 30, 17.4 + i * 0.05)).join(''))}
  ${vis(18.5, 19.5, `${an('impact', 18.5, burst(DR[0], DR[1], 90, 380, 16, '#fff', VOLTA), DR)}
    ${Object.values(col).map((c, i) => an('impact', 18.5 + i * 0.04, burst(DR[0], DR[1], 40 + i * 12, 200 + i * 30, 6, 'none', c), DR)).join('')}
    ${particles(60, PAPER, [500, 900], [440, 840], [0, 700], [3, 8], [0.6, 1.2])}
    ${an('drift', 18.6, smoke(DR[0], DR[1], 7, 300, '#55555f', 0.45))}`)}
`, [540, 1100]), 3) + `
  ${bubbleFor(5, 320, 460, ['Attention, un drone !'], [40, 100])}
  ${vis(18.5, 19.5, onom(560, 1050, 'KRA-BOOM !!', 130, -5, VOLTA, INK, 18.5))}
  ${flashAt(18.5)}
`);
sfx('drone', 15.5); sfx('scan', 16.2); sfx('lock', 16.6); sfx('alarm', 16.8); sfx('charge', 17.0); sfx('beam', 17.4); sfx('bigboom', 18.5);

// 6 · La victoire (19,5 – 23 s) : débris qui tombent, Volta crépite au premier plan, confettis de toutes les couleurs
scene(19.5, 23, cam(19.5, 23, [[19.5, 0, 160, 0, 1.25], [21, 0, 0, 0, 1.06, 'ease-out'], [23, 80, -40, 2, 1.14]], `
  ${SKY}
  ${radial(540, 1150, 140, '#2a2614', [300, 520])}
  ${an('parx', 19.5, city(1300, '#08080e', VOLTA))}
  ${roofDeck(1600)}
  ${particles(30, '#6a6a74', [-100, 1180], [-200, 600], [60, 1400], [4, 10], [1.0, 1.8], 0.8)}
  ${[[130, 'roc', 0.46, -1], [270, 'nova', 0.48, 1], [810, 'braise', 0.52, -1], [950, 'rose', 0.48, -1]].map(([x, k, s, m], i) => an('bob', 19.5 + i * 0.2, put(figure(k, i % 2 ? 'castUp' : 'charge', { anim: 'fight', glow: true }), x, 1600, s, m), null, ';animation-iteration-count:infinite;animation-direction:alternate;animation-duration:.5s')).join('')}
  ${put(figure('givre', 'hips', { anim: 'idle' }), 370, 1610, 0.58)}
  ${put(figure('echo', 'float', { anim: 'idle', float: true, glow: true }), 690, 1580, 0.56, -1)}
  ${put(voltaX('charge', { anim: 'charge', glow: true }), 540, 1700, 0.78)}
  ${aura(540, 1380, VOLTA, 3, 110, 19.6)}
  ${bolt(470, 1180, 330, 900, VOLTA, 10, 7, 30, 19.8)}${bolt(610, 1180, 760, 920, VOLTA, 10, 7, 30, 20.4)}
  ${Object.values(col).map((c) => particles(8, c, [-100, 1180], [900, 1600], [0, -900], [4, 9], [1.0, 2.0])).join('')}
`, [540, 1300]) + `
  ${bubbleFor(6, 540, 440, ["Ça, c'est une équipe !"], [0, 110])}
`);
sfx('crowd', 19.6); sfx('electric', 19.8); sfx('zap', 20.4);

// 7 · Un nom (23 – 27 s) : Écho en lévitation devant le château d'eau, Givre répond ; caméra qui glisse de l'une à l'autre
scene(23, 27, cam(23, 27, [[23, 140, 40, 0, 1.18], [24.9, 100, 0, 0, 1.12], [25.3, -60, 0, 0, 1.12], [27, -140, -40, -1, 1.2]], `
  ${SKY}
  ${an('parx', 23, city(1250, '#0a0a12', VOLTA))}
  ${waterTower(540, 1560, 1.05)}
  ${roofDeck(1560)}
  ${[[-80, 'roc'], [60, 'nova'], [1020, 'rose'], [1150, 'braise']].map(([x, k], i) => put(figure(k, 'stand', { anim: 'idle' }), x, 1560, 0.4, i < 2 ? 1 : -1)).join('')}
  ${an('bob', 23, put(figure('echo', 'float', { anim: 'idle', float: true, glow: true }), 250, 1620, 0.8), null, ';animation-iteration-count:infinite;animation-direction:alternate;animation-duration:1.4s')}
  ${particles(30, ECHO, [60, 460], [900, 1600], [0, -240], [2, 6], [1, 2])}
  ${put(figure('givre', 'stand', { anim: 'idle', glow: true }), 840, 1660, 0.82, -1)}
  ${particles(26, '#c8f1ff', [660, 1020], [900, 1600], [0, -200], [2, 5], [1, 2], 0.7)}
`, [540, 1200]) + `
  ${bubbleFor(7, 380, 480, ['Et notre équipe,', "on l'appelle comment ?"], [-60, 110])}
  ${bubbleFor(8, 640, 480, ['Kessler nous appelle', 'des anomalies.'], [140, 110])}
`);
sfx('wind', 23.0); sfx('tk', 23.3); sfx('ice', 25.1);

// 8 · LES ANOMALIES (27 – 31 s) : Volta bondit sur le château d'eau, tout le monde lève son pouvoir, le nom éclate
scene(27, 31, shakeAt(29.5, cam(27, 31, [[27, 0, 120, 0, 1.2], [29.4, 0, 20, 0, 1.0, 'ease-out'], [29.6, 0, 0, 0, 1.05], [31, 0, -40, 1, 1.12]], `
  ${SKY}
  ${vis(29.5, 31, radial(540, 860, 36, VOLTA, [200, 360]))}
  ${an('parx', 27, city(1300, '#0a0a12', VOLTA))}
  ${waterTower(540, 1520, 0.9)}
  ${roofDeck(1520)}
  ${row.filter(([, k]) => k !== 'volta').map(([x, k, s], i) => put(figure(k, 'castUp', { anim: 'cast', glow: true, float: k === 'echo' }), x < 540 ? x - 20 : x + 20, 1560, s * 1.05, x > 540 ? -1 : 1)).join('')}
  ${vis(29.5, 31, row.filter(([, k]) => k !== 'volta').map(([x, k, s]) => { const X = x < 540 ? x - 20 : x + 20; return an('beamUp', 29.5, `<rect x="${X - 12}" y="-400" width="24" height="${f(1560 - 600 * s + 400)}" fill="${col[k]}" opacity=".75" filter="url(#glow)"/>`, [X, 1560 - 600 * s]); }).join(''))}
  ${vis(29.5, 31, `${an('impact', 29.5, burst(540, 760, 120, 460, 18, '#fff', VOLTA), [540, 760])}${Object.values(col).map((c) => particles(10, c, [100, 980], [500, 1300], [0, -500], [4, 10], [0.8, 1.6])).join('')}`)}
  ${hop(27.3, 1.0, [-380, 520], 260, put(voltaX('castUp', { anim: 'charge', glow: true }), 540, 990, 0.74))}
  ${vis(28.3, 31, aura(560, 760, VOLTA, 3, 80, 28.3))}
`, [540, 1100]), 3) + `
  ${bubbleFor(9, 540, 380, ['Alors nous serons…', 'LES ANOMALIES !'], [0, 110])}
  ${vis(29.5, 31, logo(29.5, 400, 124))}
  ${flashAt(29.5)}
`);
sfx('whoosh', 27.3); sfx('land', 28.3); sfx('powerup', 28.5); sfx('thunder', 29.5); sfx('crowd', 29.7);

// 9 · La Tour bouge (31 – 34,5 s) : grondement, la Tour OMEGA tremble à l'horizon, Mirage se retourne
scene(31, 34.5, cam(31, 34.5, [[31, 0, 0, 0, 1.0], [34.5, 0, 100, 0, 1.22, 'ease-in']], `
  ${BG(NIGHT)}<rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="url(#toneP)" opacity=".12"/>
  ${an('pulse', 31, `<circle cx="540" cy="900" r="620" fill="url(#rglow)"/>`, [540, 900], ';animation-iteration-count:infinite;animation-direction:alternate;animation-duration:.8s')}
  ${an('shakeS', 31.3, `${tower(540, 1360, 0.55)}${vis(32.2, 34.5, `<g class="flick1" style="animation-duration:.3s">${cracks(540, 900, 6, 180, RED, 4)}</g>`)}`, null, ';animation-iteration-count:14')}
  ${an('parx', 31, city(1360, '#07070b', RED))}
  ${roofDeck(1560)}
  ${particles(26, '#8a8578', [-100, 1180], [1300, 1560], [0, -120], [2, 4], [0.8, 1.4], 0.6)}
  ${shakeAt(31.5, put(figure('mirage', 'point', { anim: 'idle', glow: true }), 230, 1680, 0.8), 3, 'shakeS')}
  ${put(figure('braise', 'guard', { anim: 'idle' }), 900, 1660, 0.66, -1)}
`, [540, 1200]) + `
  ${bubbleFor(10, 560, 470, ['Euh…', 'la Tour bouge.'], [-160, 110])}
  ${vis(31.3, 34.5, onom(600, 1120, 'GRRRRMMM', 76, 4, RED, INK, 31.3))}
`);
sfx('rumble', 31.2); sfx('alarm', 32.4); sfx('siren', 33.2);

// 10 · La forteresse + carton final (34,5 – 40 s) : la Tour se déplie, tourelles, bouclier rouge ; l'équipe en contre-jour
scene(34.5, 40, shakeAt(34.6, cam(34.5, 40, [[34.5, 0, 80, 0, 1.15], [36.8, 0, 0, 0, 1.0, 'ease-out'], [40, 0, -30, 0, 1.05]], `
  ${BG(NIGHT)}
  ${an('pulse', 34.5, `<circle cx="540" cy="800" r="760" fill="url(#rglow)"/>`, [540, 800], ';animation-iteration-count:infinite;animation-direction:alternate;animation-duration:1.1s')}
  ${searchlight(260, 'swayL', 35.6)}${searchlight(820, 'swayR', 35.6)}
  ${an('parx', 34.5, city(1380, '#07070b', RED))}
  ${fortress(540, 1380, 0.6, 34.6)}
  ${swarm(10, [80, 1000], [300, 700], [0.25, 0.45])}
  ${GROUND(1560, '#050508')}
  ${[120, 230, 340, 450, 560, 670, 780, 890, 1000].map((x, i) => put(`<g opacity=".95">${(i === 4 ? voltaX('stand', { anim: 'idle' }) : figure(['nova', 'rose', 'givre', 'braise', 'volta', 'echo', 'onde', 'mirage', 'roc'][i], 'stand', { anim: 'idle', glow: true }))}</g>`, x, 1620, 0.34, i > 4 ? -1 : 1)).join('')}
`, [540, 1200]), 2) + `
  ${bubbleFor(11, 330, 420, ['Activez', 'la forteresse.'], [120, 100])}
  ${finalCard(36.9, 'ÉPISODE 14 BIENTÔT')}
`);
sfx('powerdown', 34.5); sfx('klang', 34.6); sfx('rumble', 34.7); sfx('door', 35.5); sfx('lock', 36.3); sfx('eye', 36.9); sfx('hit', 37.0);

L.build(import.meta.url, 'les-anomalies-ep13');
