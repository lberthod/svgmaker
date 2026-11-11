// « LES ANOMALIES » ép. 8 · Le laboratoire : manga d'action, 40 s, 1080x1920 (Reel).
// La porte de la Tour OMEGA s'ouvre sur un laboratoire géant : des centaines de cuves, des mutants endormis
// de toutes les couleurs. Givre reconnaît sa propre cuve (Sujet 2) : il s'est déjà évadé d'ici.
// Fin : le Dr Kessler, derrière eux : « Bon retour, Sujet 2. »
// Usage : node make.mjs → les-anomalies-ep8.svg + timeline.json (lu par audio.py)
import * as L from '../les-anomalies/lib.mjs';
const { W, H, PAPER, INK, NIGHT, RED, VOLTA, GIVRE, ECHO, MIRAGE, ORANGE, rnd, f, vis, scene, an, radial, burst, cracks, bolt, onom, panel,
  bubbleFor, figure, hand, put, bigEyes, aura, crystal, smoke, reticle, BG, GROUND, cam, particles, streaks, shakeAt,
  flashAt, sfx, mv, go, anim, fadeIn, fadeOut, ghost, holo, tube, drone, header, hook, finalCard } = L;
L.reseed(808);

// mutants endormis (silhouettes colorées, futurs alliés de l'ép. 13)
const SLEEPERS = [
  ['rose', '#ff5fa2', 'spiky'], ['ambre', ORANGE, 'bun'], ['jade', '#3fffd2', 'long'], ['azur', '#4a7dff', 'swept'],
  ['lilas', '#ff9df0', 'hood'], ['citron', '#c8ff3a', 'spiky'], ['corail', '#ff6a4a', 'long'], ['menthe', '#7dffb0', 'swept'],
];
SLEEPERS.forEach(([k, accent, hair]) => L.addChar(k, { accent, hair }));
const COLORS = SLEEPERS.map((s) => s[1]);

const LINES = [
  { who: 'volta', t0: 1.7, t1: 3.1, text: "C'est quoi, cet endroit ?" },
  { who: 'mirage', t0: 5.0, t1: 6.6, text: 'Des mutants… endormis.' },
  { who: 'volta', t0: 9.1, t1: 10.7, text: 'Mais ils sont des centaines !' },
  { who: 'mirage', t0: 12.4, t1: 13.9, text: 'Chut. Restez près de moi.' },
  { who: 'givre', t0: 16.2, t1: 17.8, text: 'Cette cuve… je la connais.' },
  { who: 'givre', t0: 19.4, t1: 20.9, text: "J'étais dedans. Avant." },
  { who: 'volta', t0: 21.4, t1: 22.8, text: 'Tu étais prisonnier ici ?' },
  { who: 'mirage', t0: 24.7, t1: 26.2, text: 'Écho est au niveau 3.' },
  { who: 'volta', t0: 27.6, t1: 29.0, text: "Tu n'es plus seul, Givre." },
  { who: 'givre', t0: 29.4, t1: 30.9, text: 'Alors, on va la chercher.' },
  { who: 'kessler', t0: 34.9, t1: 37.2, text: 'Bon retour parmi nous, Sujet 2.' },
];
L.setLines(LINES);

// ---------- Décors propres à l'épisode ----------
const LAB = '#070a10';
// mur de capsules (étages lointains), chaque case : lueur colorée + petite silhouette endormie
const capsWall = (x0, x1, y0, rows, cw = 130, ch = 150, op = 0.5) => {
  let s = '';
  for (let r = 0; r < rows; r++) for (let x = x0; x < x1; x += cw) {
    const c = COLORS[Math.floor(rnd(0, COLORS.length))], y = y0 + r * ch;
    s += `<rect x="${f(x)}" y="${f(y)}" width="${cw - 36}" height="${ch - 30}" rx="16" fill="${c}" opacity="${f(op * rnd(0.5, 1))}"/>
      <circle cx="${f(x + (cw - 36) / 2)}" cy="${f(y + 34)}" r="13" fill="${INK}" opacity=".7"/><rect x="${f(x + (cw - 36) / 2 - 12)}" y="${f(y + 50)}" width="24" height="50" rx="8" fill="${INK}" opacity=".7"/>`;
  }
  return `${s}${Array.from({ length: rows + 1 }, (_, r) => `<rect x="${x0 - 40}" y="${y0 + r * ch - 22}" width="${x1 - x0 + 80}" height="14" fill="#1b2230"/>`).join('')}`;
};
// rangée de cuves avec un dormeur dans chacune
const tubeRow = (xs, yb, s, dim = 1) => xs.map((x, i) => {
  const [k, c] = SLEEPERS[i % SLEEPERS.length];
  return `<g opacity="${dim}">${tube(x, yb, c, s, k)}</g>`;
}).join('');
// cuve vide de Givre : vitre brisée, givre au fond, plaque « SUJET 2 »
const emptyTube = (x, yb, s) => put(`
  <rect x="-110" y="-700" width="220" height="660" rx="30" fill="${GIVRE}" opacity=".08"/>
  ${[[-80, 0], [-30, 10], [30, -8], [80, 6], [0, 0]].map(([dx, l], i) => crystal(dx, -40, 70 + i * 6, 110 + i * 30, l)).join('')}
  <path d="M-110 -40 L-110 -560 L-70 -520 L-40 -600 L0 -540 L30 -620 L70 -540 L110 -590 L110 -40" fill="none" stroke="${GIVRE}" stroke-width="8" filter="url(#glow)"/>
  <path d="M-110 -700 L-110 -640 M110 -700 L110 -650 M-110 -700 L110 -700" stroke="${GIVRE}" stroke-width="8" opacity=".55"/>
  ${cracks(20, -560, 7, 120, PAPER, 3)}
  <rect x="-140" y="-760" width="280" height="70" fill="${INK}" stroke="${PAPER}" stroke-width="4"/>
  <rect x="-140" y="-50" width="280" height="70" fill="${INK}" stroke="${PAPER}" stroke-width="4"/>
  <rect x="-92" y="-250" width="184" height="64" fill="${INK}" stroke="${RED}" stroke-width="5"/>
  <text x="0" y="-205" class="rt" style="font-size:36px">SUJET 2</text>
  <circle cx="0" cy="-15" r="12" fill="${RED}" class="flick1"/>`, x, yb, s);
const glass = (x, y, w, h, color) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="40" fill="${color}" opacity=".16"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="40" fill="none" stroke="${color}" stroke-width="10" filter="url(#glow)"/>
  <path d="M${x + 60} ${y + 70} L${x + 60} ${y + h - 70}" stroke="#fff" stroke-width="16" opacity=".3"/>`;
const floorLines = (y, c = '#1a2130') => `${GROUND(y, '#05070b')}${Array.from({ length: 7 }, (_, i) => `<path d="M-700 ${y + 30 + i * i * 14} L1780 ${y + 30 + i * i * 14}" stroke="${c}" stroke-width="${3 + i}"/>`).join('')}`;
const omegaSign = (x, y, s, op = 1) => put(`<path d="M-46 26 L-18 26 L-18 10 A50 50 0 1 1 18 10 L18 26 L46 26" fill="none" stroke="${RED}" stroke-width="12" stroke-linejoin="round" filter="url(#glow)" opacity="${op}"/>`, x, y, s);

// =====================================================================
// 1 · La porte (0 – 4 s) : la porte blindée s'ouvre, le trio entre dans la lumière, les cuves s'allument
scene(0, 4, cam(0, 4, [[0, 0, -40, 0, 1.18], [1.4, 0, 0, 0, 1.08], [4, 0, 30, -1, 0.98]], `
  ${BG(LAB)}
  <rect x="190" y="420" width="700" height="1140" fill="#dff4ff"/>
  ${radial(540, 1000, 120, '#bfe9ff', [280, 520])}
  ${vis(0.6, 4, fadeIn(0.6, 1.0, `<g opacity=".18">${[[-1, 400], [1, 400], [-1, 900], [1, 900]].map(([s, w]) => `<polygon points="${540 + s * 240},1560 ${540 + s * 360},1560 ${540 + s * w * 1.6},2300 ${540 + s * (w - 160)},2300" fill="#dff4ff"/>`).join('')}</g>`))}
  ${mv(0.8, 3.2, [0, -120], `
    ${put(figure('givre', 'stand', { anim: 'idle' }), 360, 1560, 0.52)}
    ${put(figure('mirage', 'stand', { anim: 'idle', glow: true }), 720, 1560, 0.5, -1)}
    ${put(figure('volta', 'castUp', { anim: 'cast', glow: true }), 540, 1590, 0.58)}
    ${particles(18, VOLTA, [520, 640], [1080, 1220], [0, -200], [2, 6], [0.3, 0.7])}`, 'cubic-bezier(.3,.6,.4,1)')}
  ${go(0.3, 1.5, [-400, 0], `<rect x="190" y="420" width="350" height="1140" fill="#262b36" stroke="${PAPER}" stroke-width="6"/><path d="M230 980 L500 980" stroke="${RED}" stroke-width="10"/>${omegaSign(470, 760, 1.4)}`, 'cubic-bezier(.6,0,.4,1)')}
  ${go(0.3, 1.5, [400, 0], `<rect x="540" y="420" width="350" height="1140" fill="#262b36" stroke="${PAPER}" stroke-width="6"/><path d="M580 980 L850 980" stroke="${RED}" stroke-width="10"/>`, 'cubic-bezier(.6,0,.4,1)')}
  <path d="M150 1560 L150 380 L930 380 L930 1560" fill="none" stroke="#3a4252" stroke-width="40"/>
  ${floorLines(1560)}
  ${an('flick1', 1.2, `<g opacity=".95">${tube(40, 1760, '#ff5fa2', 1.15, 'rose')}${tube(1040, 1760, '#3fffd2', 1.15, 'jade')}</g>`)}
  ${particles(30, '#bfe9ff', [150, 930], [500, 1600], [0, -140], [2, 4], [1.5, 3], 0.5)}
`, [540, 1100]) + `
  ${header(8, 'Le laboratoire')}
  ${hook('Derrière la porte, des centaines de dormeurs.', 0.3, 370)}
  ${bubbleFor(0, 540, 560, ["C'est quoi, cet endroit ?"], [0, 90])}
`);
sfx('hit', 0.05); sfx('door', 0.3); sfx('rumble', 0.4); sfx('shimmer', 1.2); sfx('step', 1.8); sfx('step', 2.6); sfx('step', 3.4);

// 2 · La rangée de cuves (4 – 8 s) : long travelling latéral, les dormeurs flottent, le trio avance
scene(4, 8, cam(4, 8, [[4, 260, 0, 0, 1.08], [8, -260, -30, 0, 1.14]], `
  ${BG(LAB)}
  ${capsWall(-700, 1800, 260, 3, 130, 150, 0.35)}
  ${tubeRow([-560, -290, -20, 250, 520, 790, 1060, 1330, 1600], 1530, 0.95)}
  ${floorLines(1530)}
  ${particles(40, '#fff', [-600, 1700], [800, 1500], [0, -260], [3, 6], [1.2, 2.4], 0.6)}
  ${mv(4, 4, [-420, 0], `
    ${put(figure('givre', 'run', { anim: 'idle' }), 360, 1650, 0.5)}
    ${put(figure('volta', 'run', { anim: 'idle' }), 560, 1650, 0.52)}
    ${put(figure('mirage', 'run', { anim: 'idle', glow: true }), 760, 1650, 0.5)}`, 'linear')}
`, [540, 1100]) + `
  ${bubbleFor(1, 540, 430, ['Des mutants…', 'endormis.'], [0, 90])}
  ${onom(790, 640, 'BLOUB…', 62, 6, '#3fffd2', INK, 6.8, 'pop')}
`);
sfx('wind', 4.0); sfx('shimmer', 4.3); sfx('step', 4.4); sfx('step', 5.0); sfx('step', 5.6); sfx('step', 6.2); sfx('heart', 6.8);

// 3 · Le mur de capsules (8 – 11,5 s) : Volta allume ses mains, la lumière révèle des étages entiers… un œil s'ouvre
scene(8, 11.5, cam(8, 11.5, [[8, 0, 260, 0, 1.6], [9.2, 0, 120, 0, 1.25], [11.5, 0, 0, 1, 0.92, 'ease-out']], `
  ${BG(LAB)}
  ${capsWall(-500, 1600, 300, 8, 130, 150, 0.6)}
  ${an('eyeOpen', 10.6, `<ellipse cx="757" cy="809" rx="14" ry="6" fill="#ff5fa2" filter="url(#glow)"/><ellipse cx="787" cy="809" rx="14" ry="6" fill="#ff5fa2" filter="url(#glow)"/>`, [772, 809])}
  ${vis(8, 11.5, fadeOut(8.3, 1.4, `<rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="${LAB}" opacity=".93"/>`))}
  ${an('pulse', 8.2, `<circle cx="540" cy="1100" r="520" fill="url(#vglow)"/>`, [540, 1100], ';animation-iteration-count:infinite')}
  <rect x="-700" y="1560" width="${W + 1400}" height="30" fill="#2b3446"/>
  ${[-600, -400, -200, 0, 200, 400, 600, 800, 1000, 1200, 1400, 1600].map((x) => `<rect x="${x}" y="1440" width="14" height="140" fill="#2b3446"/>`).join('')}
  <rect x="-700" y="1440" width="${W + 1400}" height="14" fill="#2b3446"/>
  ${GROUND(1590, '#05070b')}
  ${put(figure('volta', 'castUp', { anim: 'cast', glow: true }), 540, 1590, 0.68)}
  ${particles(40, VOLTA, [440, 700], [1000, 1250], [0, -300], [2, 6], [0.3, 0.8])}
  ${bolt(600, 1150, 700, 1000, VOLTA, 8, 5, 18, 8.2)}${bolt(600, 1150, 480, 980, VOLTA, 6, 5, 16, 8.4)}
  ${vis(10.6, 11.5, an('ripple', 10.6, `<circle cx="772" cy="809" r="60" fill="none" stroke="#ff5fa2" stroke-width="6"/>`, [772, 809], ';animation-iteration-count:2'))}
`, [540, 1100]) + `
  ${bubbleFor(2, 540, 400, ['Mais ils sont', 'des centaines !'], [0, 90])}
`);
sfx('zap', 8.2); sfx('electric', 8.4); sfx('powerup', 8.5); sfx('eye', 10.6);

// 4 · La patrouille (11,5 – 15 s) : un drone scanne l'allée, Mirage rend le trio invisible, le scan passe à travers
scene(11.5, 15, cam(11.5, 15, [[11.5, -60, 0, -2, 1.12], [13.3, 0, -20, 0, 1.06], [15, 70, -40, 2, 1.16]], `
  ${BG(LAB)}
  ${capsWall(-700, 1800, 280, 2, 130, 150, 0.3)}
  ${tubeRow([-420, -140, 140, 420, 700, 980, 1260, 1540], 1450, 0.75, 0.7)}
  ${floorLines(1450)}
  ${aura(760, 1300, MIRAGE, 3, 90, 11.7)}
  ${vis(11.5, 12.0, `${put(figure('givre', 'kneel', { anim: 'idle' }), 290, 1620, 0.62)}${put(figure('volta', 'kneel', { anim: 'idle' }), 500, 1620, 0.62, -1)}`)}
  ${vis(12.0, 15, ghost(`${put(figure('givre', 'kneel', { anim: 'idle', glow: true }), 290, 1620, 0.62)}${put(figure('volta', 'kneel', { anim: 'idle', glow: true }), 500, 1620, 0.62, -1)}`, 0.3, 0.6))}
  ${put(figure('mirage', 'castUp', { anim: 'cast', glow: true }), 760, 1630, 0.64, -1)}
  ${vis(12.0, 15, ghost(`<rect x="-700" y="1150" width="${W + 1400}" height="520" fill="${MIRAGE}" opacity=".12"/>`, 0.4, 1))}
  ${vis(12.0, 15, particles(40, MIRAGE, [150, 900], [1150, 1650], [0, -260], [2, 6], [0.8, 1.6]))}
  <rect x="160" y="1480" width="460" height="160" rx="10" fill="#1c2230" stroke="${PAPER}" stroke-width="4" opacity=".55"/>
  ${[200, 260, 320, 380].map((x, i) => `<circle cx="${x}" cy="1530" r="10" fill="${COLORS[i]}" class="flick${1 + (i % 2)}"/>`).join('')}
  ${anim(11.5, 3.5, ['0%{transform:translate(-420px,0)}', '100%{transform:translate(1500px,0)}'], `
    <g transform="translate(0 0)">
      <polygon points="0,760 -230,1680 230,1680" fill="${RED}" opacity=".2"/>
      <path d="M-230 1680 L230 1680" stroke="${RED}" stroke-width="10" filter="url(#glow)"/>
      ${drone(0, 720, 1.5)}
    </g>`, { ease: 'linear' })}
`, [540, 1100]) + `
  ${bubbleFor(3, 540, 470, ['Chut. Restez', 'près de moi.'], [180, 100])}
  ${vis(14.1, 15, an('blink', 14.1, `<rect x="250" y="250" width="580" height="80" fill="${INK}" stroke="${RED}" stroke-width="5"/><text x="540" y="304" class="rt" style="font-size:40px" fill="${RED}">SCAN · AUCUNE CIBLE</text>`, null, ';animation-iteration-count:infinite'))}
`);
sfx('invis', 11.7); sfx('drone', 11.6); sfx('scan', 12.2); sfx('drone', 13.4); sfx('beep', 14.1); sfx('beep', 14.35);

// 5 · La cuve vide (15 – 19 s) : Givre s'arrête devant une cuve brisée et givrée… « SUJET 2 »
scene(15, 19, shakeAt(18.4, cam(15, 19, [[15, -80, 0, 0, 1.0], [17.6, 0, -40, 1, 1.12], [19, 30, -90, 2, 1.22]], `
  ${BG('#05080d')}
  ${capsWall(-700, 1800, 260, 3, 130, 150, 0.22)}
  ${radial(700, 1100, 120, '#0e2a3a', [320, 560])}
  ${an('pulse', 15, `<circle cx="720" cy="1000" r="560" fill="${GIVRE}" opacity=".12"/>`, [720, 1000], ';animation-iteration-count:infinite')}
  ${tubeRow([-250, 1300], 1500, 0.9, 0.6)}
  ${floorLines(1500)}
  ${emptyTube(720, 1500, 1.3)}
  ${particles(40, '#c8f1ff', [520, 920], [600, 1480], [0, -200], [2, 6], [1.2, 2.4])}
  ${mv(15, 1.0, [-170, 0], `
    ${vis(15, 17.2, put(figure('givre', 'run', { anim: 'idle' }), 280, 1500, 0.78))}
    ${vis(17.2, 19, put(figure('givre', 'point', { anim: 'idle', glow: true }), 280, 1500, 0.78))}`)}
  ${vis(17.2, 19, particles(26, GIVRE, [380, 560], [1100, 1300], [120, -200], [2, 6], [0.6, 1.2]))}
  ${vis(18.4, 19, `${cracks(720, 1500, 6, 220, GIVRE, 5)}${an('rise', 18.4, `${crystal(560, 1505, 90, 160, -10)}${crystal(880, 1505, 90, 140, 10)}`)}`)}
`, [600, 1300]), 2, 'shakeS') + `
  ${bubbleFor(4, 430, 400, ['Cette cuve…', 'je la connais.'], [-80, 90])}
  ${vis(18.4, 19, onom(540, 1400, 'KRRIIK', 96, -4, GIVRE, INK, 18.4))}
`);
sfx('step', 15.1); sfx('step', 15.6); sfx('ice', 15.4); sfx('heart', 16.0); sfx('heart', 17.0); sfx('freeze', 18.4);

// 6 · Souvenir (19 – 23 s) : planches manga — le jeune Givre dans la cuve, la vitre explose ; puis les yeux de Volta
scene(19, 23, `
  ${vis(19, 21.3, `
    ${an('inL', 19, panel('p6a', 40, 300, 1000, 560, cam(19, 21.3, [[19, 0, 0, 0, 1.12], [21.3, -30, 20, 0, 1.0]], `
      <rect x="0" y="0" width="${W}" height="${H}" fill="url(#tone)" opacity=".28"/>
      ${radial(330, 600, 90, INK, [200, 400])}
      ${glass(220, 340, 220, 500, GIVRE)}
      ${an('bob', 19, put(figure('givre', 'float', { anim: 'still', float: true }), 330, 760, 0.55), null, ';animation-iteration-count:infinite')}
      ${particles(12, GIVRE, [240, 420], [380, 820], [0, -120], [3, 6], [1, 2])}
      <rect x="560" y="390" width="400" height="90" fill="${INK}"/><text x="760" y="450" class="rt" style="font-size:40px">SUJET 2</text>
      <rect x="560" y="500" width="400" height="60" fill="${INK}"/><text x="760" y="542" class="rt" style="font-size:30px">STATUT : DORT</text>
    `, [540, 580]))
    , [0, 0])}
    ${an('inR', 19.7, panel('p6b', 40, 900, 1000, 580, shakeAt(20.0, cam(19.7, 21.3, [[19.7, 0, 0, 0, 1.25], [20.0, 0, 0, 0, 1.0, 'ease-out'], [21.3, 20, -20, -2, 1.1]], `
      <rect x="0" y="0" width="${W}" height="${H}" fill="url(#tone)" opacity=".18"/>
      ${radial(540, 1200, 140, INK, [240, 480])}
      ${an('impact', 20.0, burst(540, 1180, 60, 320, 14, '#fff', GIVRE), [540, 1180])}
      ${an('rise', 20.0, [380, 470, 610, 700].map((x, i) => crystal(x, 1490, 110, 220 + (i % 2) * 80, i < 2 ? -20 : 20)).join(''))}
      ${[[-1, -1], [1, -1], [-1, 1], [1, 0.5], [0.3, -1.4]].map(([dx, dy], i) => an('chunk', 20.0, `<polygon points="540,1180 ${540 + dx * 40},${1180 + dy * 70} ${540 + dx * 80},${1180 + dy * 20}" fill="#c8f1ff" stroke="${INK}" stroke-width="4"/>`, null, `;--cx:${dx * 420}px;--cy:${dy * 300}px;--cr:${i * 90}deg`)).join('')}
      ${put(figure('givre', 'slam', { anim: 'fight', glow: true }), 540, 1440, 0.62)}
    `, [540, 1190]), 2)), [0, 0])}
  `)}
  ${vis(21.3, 23, an('zoomP', 21.3, panel('p6c', 40, 420, 1000, 640, cam(21.3, 23, [[21.3, 0, 0, 0, 1.1], [23, 0, -10, 0, 1.0]], `
    ${radial(540, 740, 120, INK, [300, 520])}
    ${streaks(20, INK, [430, 1050], 300, [3, 6], [0.2, 0.35])}
    ${bigEyes(540, 760, 'volta')}
    ${particles(16, VOLTA, [100, 980], [440, 1050], [0, -100], [2, 5], [0.4, 0.8])}`, [540, 740])), [540, 740]))}
  ${bubbleFor(5, 690, 360, ["J'étais dedans.", 'Avant.'], [-100, 100])}
  ${vis(20.0, 21.3, onom(760, 1000, 'KRAAAK !', 100, -6, GIVRE, INK, 20.0))}
  ${bubbleFor(6, 540, 1240, ['Tu étais prisonnier', 'ici ?'], [0, -90])}
  ${flashAt(20.0)}
`);
sfx('panel', 19.0); sfx('heart', 19.2); sfx('panel', 19.7); sfx('glass', 20.0); sfx('iceWall', 20.05); sfx('whoosh', 21.3); sfx('hit', 21.35);

// 7 · Le dossier (23 – 27 s) : Mirage branche le badge Ω, l'écran affiche les fiches — Givre « ÉVADÉ », Écho au niveau 3
const mH = hand('point', 'ra', 330, 1620, 0.7);
scene(23, 27, cam(23, 27, [[23, 0, 80, 0, 1.18], [24.6, 0, 0, 0, 1.04, 'ease-out'], [27, -50, -20, -1, 1.1]], `
  ${BG(LAB)}
  ${capsWall(-700, 1800, 240, 4, 130, 150, 0.25)}
  ${an('pulse', 23, `<circle cx="540" cy="700" r="640" fill="url(#rglow)"/>`, [540, 700], ';animation-iteration-count:infinite')}
  <path d="M240 1250 L840 1250 L900 1440 L180 1440Z" fill="#1c2230" stroke="${PAPER}" stroke-width="5"/>
  ${[300, 380, 460, 620, 700, 780].map((x, i) => `<rect x="${x}" y="1300" width="50" height="22" fill="${i % 2 ? RED : GIVRE}" class="flick${1 + (i % 2)}"/>`).join('')}
  <polygon points="540,1250 200,760 880,760" fill="${RED}" opacity=".1"/>
  ${floorLines(1620)}
  ${put(figure('mirage', 'point', { anim: 'cast', glow: true }), 330, 1620, 0.7)}
  ${an('pop', 23.4, `<g transform="translate(${f(mH[0] + 10)} ${f(mH[1] - 10)}) scale(.5)"><polygon points="0,-90 78,-45 78,45 0,90 -78,45 -78,-45" fill="${INK}" stroke="${RED}" stroke-width="10" filter="url(#glow)"/><path d="M-34 26 L-12 26 L-12 12 A40 40 0 1 1 12 12 L12 26 L34 26" fill="none" stroke="${RED}" stroke-width="12"/></g>`)}
  ${put(figure('givre', 'stand', { anim: 'idle' }), 620, 1620, 0.7, -1)}
  ${put(figure('volta', 'hips', { anim: 'idle' }), 860, 1640, 0.7, -1)}
  ${particles(30, RED, [200, 900], [700, 1250], [0, -200], [2, 4], [1, 2], 0.6)}
`, [540, 1200]) + `
  ${an('pop', 23.6, holo(130, 300, 820, 380, `
    <text x="540" y="372" class="rt" style="font-size:40px">PROJET OMEGA · DOSSIERS</text>
    <rect x="170" y="400" width="740" height="4" fill="${RED}"/>
    ${an('pop', 23.9, `<text x="540" y="470" class="rt" style="font-size:42px">SUJET 2 · GIVRE</text>`)}
    ${an('slam', 24.2, `<g transform="rotate(-8 540 540)"><rect x="380" y="500" width="320" height="76" fill="none" stroke="${GIVRE}" stroke-width="6"/><text x="540" y="555" class="rt" style="font-size:44px;fill:${GIVRE}">ÉVADÉ</text></g>`)}
    ${an('pop', 24.8, `<text x="540" y="640" class="rt" style="font-size:38px;fill:${ECHO}">ÉCHO · CAGE · NIVEAU 3</text>`)}`))}
  ${bubbleFor(7, 520, 820, ['Écho est au niveau 3.'], [-120, 100])}
`);
sfx('tk', 23.2); sfx('beep', 23.4); sfx('holo', 23.6); sfx('beep', 23.9); sfx('klang', 24.2); sfx('beep', 24.8);

// 8 · Soutien (27 – 31 s) : Volta pose la main sur l'épaule de Givre ; le givre et les étincelles se mêlent
scene(27, 31, cam(27, 31, [[27, 120, 40, 2, 1.28], [29.3, 0, 0, 0, 1.12], [31, -100, -30, -2, 1.2]], `
  ${BG(LAB)}
  ${capsWall(-700, 1800, 300, 5, 130, 150, 0.3)}
  ${radial(540, 1050, 140, '#141c2a', [260, 520])}
  ${an('pulse', 27, `<circle cx="420" cy="1100" r="420" fill="${GIVRE}" opacity=".12"/>`, [420, 1100], ';animation-iteration-count:infinite')}
  ${an('pulse', 27.2, `<circle cx="700" cy="1100" r="420" fill="url(#vglow)"/>`, [700, 1100], ';animation-iteration-count:infinite')}
  ${floorLines(1600)}
  ${vis(27, 29.3, put(figure('givre', 'sad', { anim: 'idle' }), 420, 1600, 0.85))}
  ${vis(29.3, 31, put(figure('givre', 'cast', { anim: 'cast', glow: true }), 420, 1600, 0.85))}
  ${vis(29.3, 31, `${aura(f(hand('cast', 'ra', 420, 1600, 0.85)[0]), f(hand('cast', 'ra', 420, 1600, 0.85)[1]), GIVRE, 3, 50, 29.3)}`)}
  ${mv(27, 1.0, [160, 0], put(figure('volta', 'point', { anim: 'idle', glow: true }), 700, 1600, 0.85, -1))}
  ${particles(30, GIVRE, [250, 560], [800, 1550], [0, -260], [2, 6], [1, 2])}
  ${particles(30, VOLTA, [560, 860], [800, 1550], [0, -260], [2, 6], [0.5, 1.2])}
`, [540, 1200]) + `
  ${bubbleFor(8, 560, 420, ["Tu n'es plus seul,", 'Givre.'], [120, 100])}
  ${bubbleFor(9, 520, 420, ['Alors, on va', 'la chercher.'], [-100, 100])}
`);
sfx('wind', 27.0); sfx('electric', 27.4); sfx('ice', 29.3); sfx('charge', 29.6);

// 9 · Les lumières s'éteignent (31 – 34,5 s) : rangée après rangée, CLAC ; des pas résonnent derrière eux
const offRow = (t, y0, y1) => fadeIn(t, 0.12, `<rect x="-700" y="${y0}" width="${W + 1400}" height="${y1 - y0}" fill="#020306" opacity=".9"/>`);
scene(31, 34.5, shakeAt(33.9, cam(31, 34.5, [[31, 0, 0, 0, 0.96], [33.4, 0, -20, 0, 1.08], [34.5, 0, -40, -3, 1.22, 'ease-in']], `
  ${BG(LAB)}
  ${capsWall(-700, 1800, 220, 6, 130, 150, 0.55)}
  ${tubeRow([-200, 80, 1000, 1280], 1560, 1.0, 0.85)}
  ${offRow(31.4, -1000, 520)}${offRow(31.9, 520, 820)}${offRow(32.4, 820, 1120)}${offRow(32.9, 1120, 3000)}
  ${floorLines(1560)}
  ${vis(32.9, 34.5, `<g opacity=".1"><rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="${RED}" class="flick1"/></g>`)}
  ${put(figure('givre', 'guard', { anim: 'fight' }), 330, 1580, 0.68)}
  ${put(figure('volta', 'guard', { anim: 'fight', glow: true }), 540, 1600, 0.7)}
  ${put(figure('mirage', 'guard', { anim: 'fight', glow: true }), 750, 1580, 0.68, -1)}
  ${particles(30, VOLTA, [460, 620], [1100, 1300], [0, -160], [2, 5], [0.4, 0.8])}
  ${particles(30, '#3a4252', [-200, 1280], [1300, 1700], [0, -200], [3, 7], [1.5, 3], 0.6)}
`, [540, 1200]), 2, 'shakeS') + `
  ${vis(31.4, 33.0, onom(540, 760, 'CLAC · CLAC · CLAC', 74, -3, PAPER, INK, 31.4))}
  ${vis(33.0, 34.5, onom(560, 760, 'TAC… TAC…', 90, 4, RED, INK, 33.0))}
`);
sfx('powerdown', 31.2); sfx('panel', 31.4); sfx('panel', 31.9); sfx('panel', 32.4); sfx('panel', 32.9);
sfx('step', 33.0); sfx('step', 33.6); sfx('heart', 33.3); sfx('step', 34.2);

// 10 · Kessler (34,5 – 40 s) : le trio se retourne, la Directrice sort de l'ombre, visière rouge + carton final
scene(34.5, 40, cam(34.5, 40, [[34.5, 0, 160, 0, 1.3], [35.4, 0, 0, 0, 1.04, 'ease-out'], [36.9, 0, -20, 0, 1.0], [40, 0, -50, 0, 1.06]], `
  ${BG('#050306')}
  ${capsWall(-700, 1800, 200, 4, 130, 150, 0.12)}
  ${an('pulse', 34.5, `<circle cx="540" cy="800" r="700" fill="url(#rglow)"/>`, [540, 800], ';animation-iteration-count:infinite')}
  ${omegaSign(540, 620, 3.2, 0.5)}
  ${radial(540, 900, 130, '#2a0508', [320, 560])}
  ${floorLines(1560, '#2a0b10')}
  ${mv(34.5, 1.4, [0, -60], put(figure('kessler', 'hips', { anim: 'idle', glow: true }), 540, 1560, 1.15))}
  ${particles(30, RED, [200, 880], [700, 1560], [0, -200], [2, 5], [1.2, 2.4], 0.7)}
  ${an('shakeS', 34.6, `${put(figure('givre', 'guard', { anim: 'fight', glow: true }), 140, 1700, 0.5)}${put(figure('volta', 'guard', { anim: 'fight', glow: true }), 940, 1700, 0.5, -1)}`, null, ';animation-iteration-count:3')}
`, [540, 1300]) + `
  ${bubbleFor(10, 540, 420, ['Bon retour parmi nous,', 'Sujet 2.'], [0, 100])}
  ${finalCard(36.9, 'ÉPISODE 9 BIENTÔT')}
  ${flashAt(34.6)}
`);
sfx('hit', 34.5); sfx('eye', 34.6); sfx('step', 34.8); sfx('eye', 36.9); sfx('hit', 37.0);

L.build(import.meta.url, 'les-anomalies-ep8');
