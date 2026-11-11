// « LES ANOMALIES » ép. 5 · L'essaim : manga d'action, 40 s, 1080x1920 (Reel).
// Les drones de la Tour OMEGA fondent sur les toits de Néo-Lyre. Givre bouclier, Volta foudroie, mais ils sont
// des milliers ; l'essaim forme un Ω géant et plonge. Écho retient la pluie de drones, la renvoie… et s'effondre.
// Fin : une ombre géante à l'œil rouge saisit Écho.
// Usage : node make.mjs → les-anomalies-ep5.svg + timeline.json (lu par audio.py)
import * as L from '../les-anomalies/lib.mjs';
const { W, H, PAPER, INK, NIGHT, RED, VOLTA, GIVRE, ECHO, rnd, f, vis, scene, an, radial, burst, cracks, bolt, onom,
  bubbleFor, tag, figure, hand, put, bigEyes, robotG, aura, crystal, smoke, BG, GROUND, sky, cam, particles, streaks, shakeAt,
  flashAt, sfx, mv, go, anim, fadeIn, fadeOut, ghost, tower, header, hook, finalCard, rooftops, waterTower, drone, droneG, bobbing } = L;
L.reseed(505);

const LINES = [
  { who: 'volta', t0: 2.0, t1: 3.5, text: 'Regardez le ciel !' },
  { who: 'givre', t0: 5.0, t1: 6.5, text: 'Restez groupés !' },
  { who: 'volta', t0: 9.0, t1: 10.5, text: 'À table, les moustiques !' },
  { who: 'givre', t0: 13.0, t1: 14.4, text: 'Ils sont trop nombreux !' },
  { who: 'robot', t0: 16.3, t1: 18.2, text: 'Cibles verrouillées. Attaque.' },
  { who: 'echo', t0: 20.4, t1: 21.7, text: 'Je les tiens !' },
  { who: 'volta', t0: 23.7, t1: 25.2, text: 'Lâche-les, tu vas tomber !' },
  { who: 'echo', t0: 25.4, t1: 27.0, text: "Pas encore ! Mettez-vous à l'abri !" },
  { who: 'givre', t0: 28.6, t1: 30.0, text: 'Elle les a tous eus !' },
  { who: 'volta', t0: 31.5, t1: 32.9, text: "Réveille-toi, s'il te plaît !" },
  { who: 'volta', t0: 35.0, t1: 36.5, text: 'Repose-la, sale robot !' },
];
L.setLines(LINES);

// ---------- Éléments propres à l'épisode ----------
// drones qui sortent d'un point (from) et rejoignent leur place
const flyOut = (n, [fx, fy], [x0, x1], [y0, y1], [s0, s1], t, d) => Array.from({ length: n }, () => {
  const x = f(rnd(x0, x1)), y = f(rnd(y0, y1)), s = f(rnd(s0, s1) * 100) / 100;
  return mv(f(t + rnd(0, 0.9)), d, [f(fx - x), f(fy - y)], drone(x, y, s), 'cubic-bezier(.2,.7,.3,1)');
}).join('');
// drones qui plongent depuis le haut et s'arrêtent net (ou continuent)
const dive = (n, [x0, x1], [y0, y1], [s0, s1], t, d, dy = -1100) => Array.from({ length: n }, () => {
  const x = f(rnd(x0, x1)), y = f(rnd(y0, y1)), s = f(rnd(s0, s1) * 100) / 100;
  return mv(f(t + rnd(0, 0.5)), d, [f(rnd(-80, 80)), dy], drone(x, y, s), 'cubic-bezier(.1,.9,.2,1)');
}).join('');
// drone pris dans un bloc de glace
const iceDrone = (s = 1) => `<g transform="scale(${s})">${droneG()}<rect x="-90" y="-70" width="180" height="130" rx="14" fill="#c8f1ff" opacity=".55" stroke="${INK}" stroke-width="6"/>
  <path d="M-70 -50 L-20 -50 M50 30 L70 10" stroke="#fff" stroke-width="6"/></g>`;
// dôme de glace de Givre
const dome = (cx, yb, rx, ry) => `<path d="M${cx - rx} ${yb} A${rx} ${ry} 0 0 1 ${cx + rx} ${yb}Z" fill="${GIVRE}" opacity=".2"/>
  <path d="M${cx - rx} ${yb} A${rx} ${ry} 0 0 1 ${cx + rx} ${yb}" fill="none" stroke="#c8f1ff" stroke-width="10" filter="url(#glow)"/>
  ${[-0.55, 0, 0.55].map((k) => `<path d="M${f(cx + k * rx)} ${yb} Q${f(cx + k * rx * 0.6)} ${f(yb - ry * 0.7)} ${cx} ${yb - ry}" fill="none" stroke="#c8f1ff" stroke-width="4" opacity=".6"/>`).join('')}
  <path d="M${f(cx - rx * 0.95)} ${f(yb - ry * 0.3)} Q${cx} ${f(yb - ry * 0.55)} ${f(cx + rx * 0.95)} ${f(yb - ry * 0.3)}" fill="none" stroke="#c8f1ff" stroke-width="4" opacity=".5"/>`;
const domePt = (cx, yb, rx, ry, deg) => [f(cx + rx * Math.cos((deg * Math.PI) / 180)), f(yb - ry * Math.sin((deg * Math.PI) / 180))];
// pince mécanique géante (paume en 0,0, bras vers le haut) ; o = ouverture des doigts en degrés
const claw = (o = 0) => {
  const B = '#101016', S = '#34343f';
  const finger = (rot) => `<g transform="rotate(${rot})"><path d="M-26 20 L-40 160 L-10 250 L14 250 L-6 160 L22 20Z" fill="${B}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
    <circle cx="-22" cy="160" r="12" fill="${RED}" filter="url(#glow)"/></g>`;
  return `<rect x="-70" y="-1600" width="140" height="1560" fill="${B}" stroke="${S}" stroke-width="6"/>
    ${[-1300, -1000, -700, -400].map((y) => `<rect x="-90" y="${y}" width="180" height="50" fill="${B}" stroke="${S}" stroke-width="5"/>`).join('')}
    ${finger(28 + o)}${finger(-28 - o)}${finger(180 - 0)}
    <ellipse cx="0" cy="0" rx="110" ry="70" fill="${B}" stroke="${S}" stroke-width="6"/>
    <g class="epulse" style="transform-origin:0px 0px"><circle cx="0" cy="0" r="22" fill="${RED}" filter="url(#glow)"/></g>`;
};
const roofEdge = (y, c = '#0a0a10', lit = ECHO) => `${GROUND(y, c)}<path d="M-700 ${y} L1780 ${y}" stroke="${lit}" stroke-width="5" opacity=".55"/>
  ${[-200, 140, 480, 820, 1160].map((x) => `<rect x="${x}" y="${y - 40}" width="16" height="40" fill="${c}" stroke="${lit}" stroke-width="3" opacity=".7"/>`).join('')}
  <path d="M-700 ${y - 40} L1780 ${y - 40}" stroke="${lit}" stroke-width="3" opacity=".4"/>`;
// Ω formé de drones (centre cx, cy, rayon r)
const omegaPts = (cx, cy, r) => {
  const pts = [];
  for (let i = 0; i <= 26; i++) { const a = ((125 + (290 * i) / 26) * Math.PI) / 180; pts.push([f(cx + r * Math.cos(a)), f(cy + r * Math.sin(a))]); }
  const yE = f(cy + r * Math.sin((125 * Math.PI) / 180)), xL = f(cx + r * Math.cos((125 * Math.PI) / 180)), xR = f(cx + r * Math.cos((55 * Math.PI) / 180));
  for (let k = 1; k <= 3; k++) { pts.push([f(xL - k * 55), yE]); pts.push([f(xR + k * 55), yE]); }
  return pts;
};

// =====================================================================
// 1 · L'essaim décolle (0 – 4 s) : la Tour OMEGA crache des drones au-dessus des toits, le trio les regarde venir
scene(0, 4, cam(0, 4, [[0, 0, -80, 0, 1.18], [4, 0, 40, -1.5, 1.0]], `
  ${sky}
  ${an('pulse', 0, `<circle cx="800" cy="420" r="560" fill="url(#rglow)"/>`, [800, 420], ';animation-iteration-count:infinite')}
  ${tower(800, 1360, 0.52)}
  ${rooftops(1330)}
  ${waterTower(140, 1340, 0.6)}
  ${flyOut(34, [800, 400], [-80, 1160], [220, 1000], [0.22, 0.5], 0.1, 1.6)}
  ${particles(30, RED, [500, 1100], [200, 900], [-300, 200], [2, 4], [1, 2], 0.6)}
  ${roofEdge(1640)}
  ${put(figure('givre', 'guard', { anim: 'fight' }), 240, 1640, 0.6)}
  ${put(figure('volta', 'point', { anim: 'fight', glow: true }), 540, 1650, 0.66)}
  ${an('bob', 0, put(figure('echo', 'stand', { anim: 'idle', float: true }), 840, 1630, 0.6, -1), null, ';animation-iteration-count:infinite')}
  ${particles(16, VOLTA, [520, 660], [1150, 1300], [0, -160], [2, 5], [0.4, 0.8])}
`, [540, 1100]) + `
  ${header(5, "L'essaim")}
  ${hook('Ils arrivent par milliers.', 0.3, 1130)}
  ${bubbleFor(0, 470, 480, ['Regardez le ciel !'], [40, 90])}
`);
sfx('hit', 0.05); sfx('swarm', 0.3); sfx('alarm', 1.0); sfx('swarm', 2.4);

// 2 · Le dôme (4 – 8 s) : piqué des drones, Givre lève un dôme de glace, les lasers ricochent
const DM = [540, 1620, 470, 600];
scene(4, 8, shakeAt(5.3, cam(4, 8, [[4, 0, 120, 2, 1.25], [5.2, 0, 0, 0, 1.05, 'ease-out'], [8, -30, -30, -1.5, 1.12]], `
  ${sky}
  ${radial(540, 700, 120, '#2a0a10', [260, 480])}
  ${dive(14, [80, 1000], [240, 820], [0.35, 0.65], 4.0, 0.9, -1000)}
  ${roofEdge(1620)}
  ${vis(4, 4.5, `<rect x="-700" y="-200" width="2500" height="2000" fill="${GIVRE}" opacity=".05"/>`)}
  ${an('grow', 4.35, dome(...DM), [540, 1620])}
  ${vis(5.1, 8, `<g class="flick1">${[[220, 300, 150], [880, 360, 40], [540, 260, 95], [120, 640, 165], [980, 700, 20]].map(([x, y, a]) => { const p = domePt(...DM, a); return `<path d="M${x} ${y} L${p[0]} ${p[1]}" stroke="${RED}" stroke-width="10" filter="url(#glow)"/>`; }).join('')}</g>
    ${[150, 40, 95, 165, 20].map((a, i) => { const p = domePt(...DM, a); return an('impact', 5.2 + i * 0.18, burst(p[0], p[1], 26, 100, 10, '#fff', RED), p); }).join('')}
    ${particles(30, '#c8f1ff', [100, 980], [1000, 1500], [0, -260], [2, 6], [0.5, 1])}`)}
  ${put(figure('volta', 'guard', { anim: 'fight', glow: true }), 300, 1620, 0.6)}
  ${put(figure('givre', 'castUp', { anim: 'cast', glow: true }), 540, 1620, 0.64)}
  ${put(figure('echo', 'guard', { anim: 'fight', float: true }), 790, 1610, 0.6, -1)}
`, [540, 1200]), 2, 'shakeS') + `
  ${onom(540, 840, 'TAK-TAK-TAK', 84, -4, RED, INK, 5.2)}
  ${bubbleFor(1, 540, 470, ['Restez groupés !'], [-40, 90])}
`);
sfx('swarm', 4.0); sfx('iceWall', 4.35); sfx('laser', 5.1); sfx('klang', 5.3); sfx('laser', 5.6); sfx('klang', 5.9);

// 3 · Chaîne de foudre (8 – 12 s) : Volta bondit au-dessus du toit, l'éclair saute de drone en drone
const chain = [[620, 900], [760, 700], [900, 860], [700, 520], [940, 560], [560, 380]];
const vh = hand('charge', 'ra', 300, 1560, 0.78);
scene(8, 12, shakeAt(9.4, cam(8, 12, [[8, -60, 160, -3, 1.3], [8.9, 0, 0, 0, 1.05, 'ease-out'], [12, 50, -40, 2, 1.15]], `
  ${BG(PAPER)}
  <rect x="-700" y="-1000" width="${W + 1400}" height="2600" fill="url(#tone)" opacity=".25"/>
  ${radial(300, 1200, 150, INK, [320, 560])}
  ${chain.map(([x, y], i) => vis(8, 9.4 + i * 0.2, drone(x, y, 0.75))).join('')}
  ${vis(9.2, 12, chain.map(([x, y], i) => `${bolt(i ? chain[i - 1][0] : f(vh[0]), i ? chain[i - 1][1] : f(vh[1]), x, y, VOLTA, 14, 7, 30, 9.2 + i * 0.2)}
    ${an('impact', 9.4 + i * 0.2, burst(x, y, 40, 150, 12, '#fff', VOLTA), [x, y])}`).join(''))}
  ${vis(9.4, 12, particles(50, VOLTA, [500, 1000], [300, 1000], [0, 500], [3, 8], [0.6, 1.2]))}
  ${vis(10.4, 12, an('drift', 10.4, smoke(800, 640, 8, 220, '#5d5d68', 0.6)))}
  ${GROUND(1640)}
  ${an('leapA', 8, put(figure('volta', 'charge', { anim: 'charge', glow: true }), 300, 1560, 0.78))}
  ${aura(f(vh[0]), f(vh[1]), VOLTA, 2, 50, 8.6)}
`, [400, 1100]), 3) + `
  ${vis(9.4, 12, onom(680, 1440, 'BZZRAK !!', 120, -7, VOLTA, INK, 9.45))}
  ${bubbleFor(2, 420, 410, ['À table,', 'les moustiques !'], [-60, 100])}
  ${flashAt(9.4)}
`);
sfx('charge', 8.0); sfx('zap', 9.2); sfx('electric', 9.4); sfx('boom', 9.6); sfx('boom', 10.1); sfx('boom', 10.4);

// 4 · Les glaçons (12 – 15,5 s) : Givre gèle une colonne de drones qui tombent… mais une nouvelle vague arrive
scene(12, 15.5, cam(12, 15.5, [[12, 0, 0, 0, 1.15], [13, 0, 0, 0, 1.05, 'ease-out'], [15.5, 0, 100, 0, 1.0]], `
  ${sky}
  ${radial(620, 700, 130, '#0b2a3a', [260, 480])}
  ${[[560, 520], [700, 640], [840, 460], [640, 820], [900, 760], [500, 360]].map(([x, y], i) => `${vis(12, 12.6 + i * 0.08, drone(x, y, 0.5))}
    ${vis(12.6 + i * 0.08, 15.5, go(12.6 + i * 0.08, 1.4, [f(rnd(-60, 60)), 1400], put(an('pop', 12.6 + i * 0.08, iceDrone(0.5)), x, y, 1), 'cubic-bezier(.5,0,.9,.5)', f(rnd(-60, 60))))}`).join('')}
  <path d="M240 1300 L860 400" stroke="#c8f1ff" stroke-width="16" filter="url(#glow)" pathLength="1" class="draw" style="animation-delay:12.3s;opacity:.8"/>
  ${vis(12.3, 13.2, particles(40, '#c8f1ff', [240, 900], [400, 1300], [0, -200], [3, 7], [0.4, 0.9]))}
  ${vis(14.3, 15.5, dive(22, [-60, 1140], [200, 900], [0.25, 0.5], 14.3, 0.9, -1100))}
  ${roofEdge(1640)}
  ${an('shakeS', 14.4, put(figure('givre', 'cast', { anim: 'cast', glow: true }), 230, 1640, 0.78), null, ';animation-iteration-count:3')}
  ${vis(13.6, 15.5, `${an('rise', 13.6, `${crystal(700, 1645, 120, 120, -10)}${crystal(820, 1645, 90, 90, 12)}`)}${an('impact', 13.7, burst(760, 1600, 30, 120, 10, '#fff', GIVRE), [760, 1600])}`)}
`, [540, 1100]) + `
  ${onom(660, 1060, 'KRIIIK !', 110, -6, GIVRE, INK, 12.4)}
  ${bubbleFor(3, 560, 400, ['Ils sont', 'trop nombreux !'], [-160, 100])}
`);
sfx('freeze', 12.3); sfx('glass', 13.7); sfx('glass', 14.0); sfx('swarm', 14.3);

// 5 · L'Ω géant (15,5 – 19,5 s) : l'essaim se rassemble en symbole OMEGA au-dessus de la ville, puis pique
const OM = omegaPts(540, 720, 300);
const OMP = `M${OM[OM.length - 2][0]} ${OM[OM.length - 2][1]} L${OM.slice(0, 27).map(([x, y]) => `${x} ${y}`).join(' L')} L${OM[OM.length - 1][0]} ${OM[OM.length - 1][1]}`;
scene(15.5, 19.5, shakeAt(18.7, cam(15.5, 19.5, [[15.5, 0, 200, 0, 1.25], [17.3, 0, 0, 0, 1.0, 'ease-out'], [18.6, 0, 0, 0, 1.03], [19.5, 0, -160, 0, 1.25, 'ease-in']], `
  ${sky}
  ${an('pulse', 15.5, `<circle cx="540" cy="560" r="420" fill="url(#rglow)"/>`, [540, 560], ';animation-iteration-count:infinite')}
  ${tower(900, 1560, 0.42)}
  ${rooftops(1520)}
  ${OM.map(([x, y], i) => mv(f(15.5 + rnd(0, 0.6)), 1.3, [f(rnd(-700, 700)), f(rnd(-500, 900))], go(18.6 + (i % 5) * 0.06, 0.9, [f((540 - x) * 0.4), 1500], drone(x, y, 0.5), 'cubic-bezier(.6,0,.9,.4)'), 'cubic-bezier(.2,.8,.3,1)')).join('')}
  ${vis(16.7, 18.6, an('pulse', 16.7, `<path d="${OMP}" fill="none" stroke="${RED}" stroke-width="26" opacity=".7" stroke-linejoin="round" stroke-linecap="round" filter="url(#glow)"/>`, [540, 720], ';animation-iteration-count:infinite'))}
  ${vis(18.6, 19.5, streaks(30, RED, [-400, 1600], 0, [3, 6], [0.2, 0.35], 90))}
  ${particles(30, PAPER, [-200, 1200], [0, 1500], [-80, 200], [2, 4], [2, 4], 0.3)}
  ${roofEdge(1660)}
  ${put(figure('givre', 'guard', { anim: 'idle' }), 440, 1660, 0.3)}
  ${put(figure('volta', 'guard', { anim: 'idle' }), 540, 1660, 0.32)}
  ${put(figure('echo', 'castUp', { anim: 'idle' }), 640, 1660, 0.3, -1)}
`, [540, 900]), 2, 'shakeS') + `
  ${vis(16.0, 18.6, an('pop', 16.0, an('blink', 16.2, `<rect x="200" y="236" width="680" height="80" fill="${INK}" stroke="${RED}" stroke-width="5"/><text x="540" y="290" class="rt" style="font-size:40px" fill="${RED}">ESSAIM OMEGA · 4 812</text>`, null, ';animation-iteration-count:infinite')))}
  ${bubbleFor(4, 540, 1270, ['Cibles verrouillées.', 'Attaque.'], [0, 90])}
`);
sfx('swarm', 15.5); sfx('lock', 17.2); sfx('scan', 17.4); sfx('alarm', 18.2); sfx('missile', 18.6); sfx('swarm', 18.7);

// 6 · Écho retient la pluie (19,5 – 23,5 s) : les drones plongent et se figent dans un champ violet
const eHL = hand('float', 'la', 540, 1640, 0.8), eHR = hand('float', 'ra', 540, 1640, 0.8);
const held = Array.from({ length: 30 }, () => [f(rnd(60, 1020)), f(rnd(260, 880)), f(rnd(0.3, 0.6) * 100) / 100]);
scene(19.5, 23.5, cam(19.5, 23.5, [[19.5, 0, -140, 0, 1.2], [20.3, 0, 0, 0, 1.0, 'ease-out'], [23.5, 0, 40, 1.5, 1.12]], `
  ${BG('#120a1e')}
  ${radial(540, 1150, 150, '#2c1450', [300, 520])}
  ${an('pulse', 19.5, `<circle cx="540" cy="900" r="720" fill="${ECHO}" opacity=".12"/>`, [540, 900], ';animation-iteration-count:infinite')}
  ${held.map(([x, y, s]) => mv(f(19.6 + rnd(0, 0.5)), 0.55, [f(rnd(-60, 60)), -1100], an('shakeS', 20.3, drone(x, y, s), null, ';animation-iteration-count:infinite'), 'cubic-bezier(.1,.9,.2,1)')).join('')}
  ${vis(20.2, 23.5, `${an('pulse', 20.2, `<rect x="-100" y="200" width="1280" height="760" rx="200" fill="none" stroke="${ECHO}" stroke-width="10" filter="url(#glow)" opacity=".7"/>`, [540, 580], ';animation-iteration-count:infinite')}
    ${held.slice(0, 8).map(([x, y], i) => `<path d="M${f(i % 2 ? eHR[0] : eHL[0])} ${f(i % 2 ? eHR[1] : eHL[1])} L${x} ${y}" stroke="${ECHO}" stroke-width="5" stroke-dasharray="12 16" class="flow" opacity=".75"/>`).join('')}`)}
  ${particles(46, ECHO, [-100, 1180], [200, 1600], [0, -260], [3, 7], [0.8, 1.6])}
  ${roofEdge(1640)}
  ${aura(f(eHL[0]), f(eHL[1]), ECHO, 2, 60, 20.0)}${aura(f(eHR[0]), f(eHR[1]), ECHO, 2, 60, 20.2)}
  ${an('shakeS', 21.8, put(figure('echo', 'float', { anim: 'cast', glow: true, float: true }), 540, 1640, 0.8), null, ';animation-iteration-count:infinite')}
`, [540, 1200]) + `
  ${tag(70, 236, 'ÉCHO', 'TÉLÉKINÉSIE', ECHO, 20.0)}
  ${onom(300, 1440, 'VMMMMM', 80, -6, ECHO, INK, 20.2)}
  ${bubbleFor(5, 790, 1020, ['Je les tiens !'], [-150, 90])}
`);
sfx('swarm', 19.5); sfx('tk', 20.2); sfx('tk', 21.8); sfx('heart', 22.6);

// 7 · L'effort (23,5 – 27 s) : a) Volta s'inquiète en bas, Écho tremble là-haut ; b) gros plan sur ses yeux
const swDrops = Array.from({ length: 6 }, (_, i) => anim(f(25.5 + i * 0.25), 0.9, ['from{transform:translate(0,0);opacity:1}', 'to{transform:translate(0,260px);opacity:0}'],
  `<path d="M${[200, 880, 260, 820, 330, 760][i]} ${[640, 660, 1060, 1080, 600, 620][i]} q-14 26 0 36 q14 -10 0 -36Z" fill="#c8f1ff" stroke="${INK}" stroke-width="4"/>`, { iter: 'infinite' })).join('');
scene(23.5, 27, `
  ${vis(23.5, 25.4, cam(23.5, 25.4, [[23.5, 0, 60, 0, 1.05], [25.4, 0, -20, -1.5, 1.14]], `
    ${BG('#120a1e')}
    ${an('pulse', 23.5, `<circle cx="620" cy="560" r="520" fill="${ECHO}" opacity=".16"/>`, [620, 560], ';animation-iteration-count:infinite')}
    ${held.map(([x, y, s]) => an('shakeS', 23.5, drone(f(x * 0.8 + 120), f(y * 0.55 + 60), f(s * 0.7 * 100) / 100), null, ';animation-iteration-count:infinite')).join('')}
    ${an('shake', 23.6, put(figure('echo', 'float', { anim: 'charge', glow: true, float: true }), 620, 860, 0.42), null, ';animation-iteration-count:infinite')}
    ${aura(620, 700, ECHO, 3, 80, 23.5)}
    ${particles(30, ECHO, [300, 940], [300, 900], [0, 200], [2, 5], [0.8, 1.4])}
    ${roofEdge(1640)}
    ${mv(23.5, 0.6, [-200, 0], put(figure('volta', 'point', { anim: 'fight', shout: true, glow: true }), 270, 1640, 0.7))}
    ${put(figure('givre', 'guard', { anim: 'idle' }), 830, 1640, 0.66, -1)}`, [540, 1200]))}
  ${vis(25.4, 27, shakeAt(25.4, cam(25.4, 27, [[25.4, 0, 0, 0, 1.25], [27, 0, 0, 0, 1.05]], `
    ${BG(PAPER)}
    ${radial(540, 900, 130, ECHO, [420, 560])}
    ${aura(540, 880, ECHO, 3, 260, 25.4)}
    ${an('swayL', 25.4, `<path d="M190 260 C110 600 150 1100 60 1700 L-400 1700 L-400 260Z" fill="${ECHO}" stroke="${INK}" stroke-width="8"/>`, [190, 260], ';animation-duration:.8s;animation-iteration-count:infinite;animation-direction:alternate')}
    ${an('swayR', 25.4, `<path d="M890 260 C970 600 930 1100 1020 1700 L1480 1700 L1480 260Z" fill="${ECHO}" stroke="${INK}" stroke-width="8"/>`, [890, 260], ';animation-duration:.8s;animation-iteration-count:infinite;animation-direction:alternate')}
    <path d="M120 260 Q540 120 960 260 L960 -200 L120 -200Z" fill="${ECHO}" stroke="${INK}" stroke-width="8"/>
    ${an('shakeS', 25.4, bigEyes(540, 880, 'echo'), null, ';animation-iteration-count:infinite')}
    <path d="M300 620 L470 690 M780 620 L610 690" stroke="${INK}" stroke-width="18" stroke-linecap="round"/>
    ${swDrops}
    ${particles(30, ECHO, [100, 980], [400, 1500], [0, -300], [3, 7], [0.6, 1.2])}`, [540, 900]), 4, 'shakeS'))}
  ${bubbleFor(6, 500, 1060, ['Lâche-les,', 'tu vas tomber !'], [-150, 90])}
  ${bubbleFor(7, 540, 1330, ['Pas encore !', "Mettez-vous à l'abri !"], [0, -90])}
`);
sfx('heart', 23.6); sfx('rumble', 24.0); sfx('panel', 25.4); sfx('heart', 25.6); sfx('tk', 25.6);

// 8 · La riposte (27 – 30,5 s) : Écho renvoie tout l'essaim vers le ciel, explosion géante
const eC = hand('charge', 'ra', 540, 1640, 0.72);
scene(27, 30.5, shakeAt(27.95, cam(27, 30.5, [[27, 0, -100, 0, 1.15], [27.9, 0, 0, 0, 1.0, 'ease-in'], [28.1, 0, 0, 0, 1.08], [30.5, 0, 30, -1.5, 1.0, 'ease-out']], `
  ${BG(INK)}
  ${radial(540, 520, 160, '#3a1a5a', [200, 420])}
  ${held.map(([x, y, s]) => vis(27, 27.95, go(27.15 + rnd(0, 0.2), 0.75, [f((x - 540) * 0.6), -900], drone(x, y, s), 'cubic-bezier(.6,0,.9,.5)'))).join('')}
  ${vis(27.1, 27.95, streaks(30, ECHO, [-200, 1600], 0, [3, 6], [0.2, 0.3], -90))}
  ${vis(27.95, 30.5, `${an('impact', 27.95, burst(540, 420, 140, 520, 16, '#fff', ECHO), [540, 420])}
    ${[[200, 300], [880, 260], [320, 620], [800, 600], [560, 180]].map(([x, y], i) => an('impact', 28.1 + i * 0.12, burst(x, y, 40, 160, 12, '#fff', RED), [x, y])).join('')}
    ${an('drift', 28.2, smoke(540, 520, 16, 520, '#3d3d48', 0.85))}
    ${particles(60, ECHO, [0, W], [100, 900], [0, 700], [3, 9], [1, 2])}
    ${particles(30, RED, [0, W], [100, 800], [0, 900], [3, 7], [1, 2])}`)}
  ${roofEdge(1640)}
  ${put(figure('echo', 'charge', { anim: 'charge', glow: true, float: true }), 540, 1640, 0.72)}
  ${aura(f(eC[0]), f(eC[1]), ECHO, 3, 70, 27)}
  ${put(figure('givre', 'guard', { anim: 'fight' }), 150, 1660, 0.55)}
  ${put(figure('volta', 'guard', { anim: 'fight' }), 930, 1660, 0.55, -1)}
`, [540, 1000]), 4) + `
  ${vis(27.95, 30.5, onom(540, 760, 'KRA-BOOOM !!', 120, -5, ECHO, INK, 28.0))}
  ${bubbleFor(8, 470, 1010, ['Elle les a', 'tous eus !'], [-260, 100])}
  ${flashAt(27.95)}
`);
sfx('tk', 27.0); sfx('whoosh', 27.15); sfx('bigboom', 27.95); sfx('boom', 28.3); sfx('boom', 28.6);

// 9 · La chute (30,5 – 34 s) : Écho s'éteint et tombe sur le toit ; Volta accourt ; une ombre recouvre tout
scene(30.5, 34, cam(30.5, 34, [[30.5, 0, -200, 0, 1.0], [31.6, 0, 0, 0, 1.05, 'ease-in'], [31.8, 0, 10, 0, 1.08], [34, 0, -40, 2, 1.2]], `
  ${sky}
  ${an('drift', 30.5, smoke(540, 400, 12, 500, '#2a2a34', 0.7))}
  ${particles(30, ECHO, [100, 980], [0, 600], [0, 600], [2, 5], [1.5, 2.5], 0.5)}
  ${rooftops(1300)}
  ${roofEdge(1620)}
  ${vis(30.5, 31.65, go(30.6, 1.05, [0, 900], put(figure('echo', 'sad', { anim: 'still' }), 560, 720, 0.6, 1, 20), 'cubic-bezier(.5,0,1,.6)', 70))}
  ${vis(31.6, 34, `${an('drift', 31.6, smoke(560, 1640, 6, 300, '#3a3a44', 0.6))}${put(figure('echo', 'sad', { anim: 'still' }), 760, 1590, 0.6, 1, -88)}`)}
  ${vis(31.6, 32.1, an('impact', 31.6, burst(560, 1590, 40, 160, 10, '#fff', ECHO), [560, 1590]))}
  ${mv(31.4, 0.7, [-500, 0], put(figure('volta', 'kneel', { anim: 'idle', shout: true }), 300, 1620, 0.62))}
  ${mv(31.7, 0.9, [500, 0], put(figure('givre', 'stand', { anim: 'idle' }), 920, 1620, 0.62, -1))}
  ${vis(32.4, 34, go(32.4, 1.4, [0, 2300], `<path d="M-700 -2600 L1780 -2600 L1780 -500 Q540 -200 -700 -500Z" fill="#000" opacity=".7"/><path d="M-700 -500 Q540 -200 1780 -500" stroke="${RED}" stroke-width="8" opacity=".6" filter="url(#glow)"/>`, 'ease-in'))}
`, [540, 1300]) + `
  ${bubbleFor(9, 400, 920, ['Réveille-toi,', "s'il te plaît !"], [-40, 100])}
`);
sfx('powerdown', 30.5); sfx('whoosh', 30.8); sfx('land', 31.6); sfx('step', 31.9); sfx('heart', 32.6); sfx('rumble', 32.8);

// 10 · L'ombre (34 – 40 s) : un géant à l'œil rouge surgit, sa pince saisit Écho et l'emporte + carton final
scene(34, 40, shakeAt(34.3, cam(34, 40, [[34, 0, 160, 0, 1.3], [35.4, 0, 0, 0, 1.08, 'ease-out'], [40, 0, -40, 0, 1.0]], `
  ${BG('#07070b')}
  ${an('pulse', 34, `<circle cx="640" cy="320" r="700" fill="url(#rglow)"/>`, [640, 320], ';animation-iteration-count:infinite')}
  ${an('descend', 34, put(`<g opacity=".92">${robotG(0.5, { body: '#09090d', trim: '#2a2a33' })}</g>`, 660, 1000, 1.5))}
  ${an('descend', 34, an('eyeOpen', 34.4, `<ellipse cx="660" cy="337" rx="90" ry="26" fill="${RED}" filter="url(#glow)"/><ellipse cx="660" cy="337" rx="30" ry="10" fill="#fff"/>`, [660, 337]))}
  ${particles(30, RED, [200, 1100], [100, 1200], [0, 300], [2, 4], [1.5, 2.5], 0.5)}
  ${roofEdge(1620, '#050508', RED)}
  ${go(35.3, 1.6, [60, -760], `${put(figure('echo', 'sad', { anim: 'still' }), 760, 1590, 0.6, 1, -88)}
    ${mv(34.3, 0.8, [0, -1300], `<g transform="translate(560 1480)">${claw(0)}</g>`, 'cubic-bezier(.5,0,.6,1)')}`, 'cubic-bezier(.4,0,.3,1)')}
  ${vis(34.9, 35.3, an('impact', 34.95, burst(380, 1560, 30, 110, 10, '#fff', RED), [380, 1560]))}
  ${an('drift', 35.2, smoke(560, 1700, 8, 360, '#202028', 0.7))}
  ${mv(34.8, 0.6, [-260, 0], put(figure('volta', 'run', { anim: 'fight', shout: true, glow: true }), 230, 1630, 0.62))}
  ${vis(35.6, 40, particles(20, VOLTA, [140, 360], [1200, 1400], [0, -200], [2, 5], [0.4, 0.8]))}
`, [540, 1100]), 2) + `
  ${vis(34.95, 36.85, onom(740, 1380, 'KLAMP !', 96, 6, RED, INK, 34.95))}
  ${bubbleFor(10, 360, 980, ['Repose-la,', 'sale robot !'], [-80, 110])}
  ${finalCard(36.9, 'ÉPISODE 6 BIENTÔT')}
`);
sfx('rumble', 34.0); sfx('eye', 34.4); sfx('klang', 34.95); sfx('whoosh', 35.3); sfx('siren', 36.0); sfx('hit', 37.0);

L.build(import.meta.url, 'les-anomalies-ep5');
