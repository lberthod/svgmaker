// « LES ANOMALIES » ép. 14 · Assaut : manga d'action, 40 s, 1080x1920 (Reel).
// Assaut final sur le toit de la forteresse OMEGA : le Colosse surgit, toute l'équipe (trio, Mirage,
// mutants libérés Rose et Cobalt) l'immobilise, Volta l'abat d'un éclair. Kessler rit :
// « Vous croyez que c'est moi qui commande ? » — le grand œil OMEGA s'allume.
// Usage : node make.mjs → les-anomalies-ep14.svg + timeline.json (lu par audio.py)
import * as L from '../les-anomalies/lib.mjs';
const { W, H, PAPER, INK, NIGHT, RED, VOLTA, GIVRE, ECHO, MIRAGE, ORANGE, rnd, f, vis, scene, an, radial, burst, cracks, bolt, onom, panel,
  bubbleFor, tag, figure, hand, put, bigEyes, robotG, aura, crystal, smoke, reticle, BG, GROUND, cam, particles, streaks, shakeAt,
  flashAt, sfx, mv, go, anim, fadeIn, fadeOut, ghost, bobbing, holo, header, hook, finalCard, city, rain } = L;
L.reseed(14 * 101);

const ROSE = '#ff5fa2', COBALT = '#4d6bff';
L.addChar('rose', { accent: ROSE, hair: 'long' });
L.addChar('cobalt', { accent: COBALT, hair: 'spiky' });

const LINES = [
  { who: 'volta', t0: 2.0, t1: 3.4, text: 'On y va, les Anomalies !' },
  { who: 'colosse', t0: 5.4, t1: 7.2, text: 'Cibles détectées. Élimination.' },
  { who: 'givre', t0: 8.3, t1: 9.85, text: 'Écho, attention aux missiles !' },
  { who: 'echo', t0: 9.95, t1: 11.3, text: 'Je les renvoie !' },
  { who: 'ally', t0: 12.2, t1: 13.6, text: 'On bloque ses jambes !' },
  { who: 'mirage', t0: 15.5, t1: 16.9, text: 'Laquelle est la vraie ?' },
  { who: 'echo', t0: 18.9, t1: 20.5, text: 'Je le tiens, vas-y Volta !' },
  { who: 'volta', t0: 22.3, t1: 23.8, text: 'Absorbe ça, pour voir !' },
  { who: 'colosse', t0: 26.1, t1: 27.9, text: 'Surcharge. Système critique.' },
  { who: 'givre', t0: 29.7, t1: 31.3, text: "Docteur Kessler, c'est fini." },
  { who: 'kessler', t0: 31.5, t1: 33.0, text: 'Fini ? Ha ha ha !' },
  { who: 'kessler', t0: 33.6, t1: 35.6, text: "Vous croyez que c'est moi qui commande ?" },
];
L.setLines(LINES);

// ---------- Dessins propres à l'épisode ----------
// Volta rechargée (ép. 12) : cheveux blanc-jaune
const voltaMax = (pose, o = {}) => figure('volta', pose, o).replace(`fill="${INK}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`, `fill="#fff6c2" stroke="${INK}" stroke-width="6" stroke-linejoin="round" filter="url(#glow)"/>`);
// Colosse (Traqueur géant, deux yeux orange)
const colosse = (amp = 1) => robotG(amp, { twin: true, eye: ORANGE });
// ciel d'orage : nuages lourds + éclairs lointains
const storm = (seedT = 0) => `${BG(NIGHT)}<rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="url(#toneP)" opacity=".1"/>
  ${an('pulse', 0, `<circle cx="540" cy="200" r="900" fill="url(#rglow)" opacity=".5"/>`, [540, 200], ';animation-iteration-count:infinite;animation-duration:1.4s')}
  ${an('parx', seedT, Array.from({ length: 9 }, (_, i) => `<ellipse cx="${f(-400 + i * 230 + rnd(-40, 40))}" cy="${f(rnd(-60, 360))}" rx="${f(rnd(220, 360))}" ry="${f(rnd(70, 130))}" fill="#22222e" opacity=".9"/>`).join(''))}
  <g class="flick2" style="animation-duration:${f(rnd(1.6, 2.4))}s">${bolt(f(rnd(80, 300)), -100, f(rnd(200, 360)), 520, '#cfd6ff', 5, 8, 40, 0)}</g>`;
// toit de la forteresse (sol à y) : ville loin en contrebas, pylônes, garde-corps, Ω peint au sol
const roof = (y = 1560) => `
  ${city(y - 150, '#0b0b12', RED)}
  <path d="M-700 ${y - 160} L-160 ${y - 160} L-60 ${y - 760} L-20 ${y - 160} M1240 ${y - 160} L1140 ${y - 820} L1100 ${y - 160} L1780 ${y - 160}" fill="${INK}" stroke="${RED}" stroke-width="5"/>
  <g class="flick1"><circle cx="-60" cy="${y - 760}" r="12" fill="${RED}"/><circle cx="1140" cy="${y - 820}" r="12" fill="${RED}"/></g>
  <rect x="-700" y="${y - 160}" width="${W + 1400}" height="1600" fill="#15151e"/>
  <path d="M-700 ${y - 160} L1780 ${y - 160}" stroke="${RED}" stroke-width="6" opacity=".8"/>
  ${Array.from({ length: 22 }, (_, i) => `<path d="M${-660 + i * 110} ${y - 160} L${-660 + i * 110} ${y - 240}" stroke="#3a3a48" stroke-width="10"/>`).join('')}
  <path d="M-700 ${y - 240} L1780 ${y - 240}" stroke="#3a3a48" stroke-width="10"/>
  ${[-3, -2, -1, 0, 1, 2, 3].map((k) => `<path d="M${540 + k * 140} ${y - 160} L${540 + k * 520} ${y + 500}" stroke="#262632" stroke-width="6"/>`).join('')}
  ${[0, 1, 2, 3].map((k) => `<path d="M-700 ${f(y - 120 + k * k * 60 + k * 60)} L1780 ${f(y - 120 + k * k * 60 + k * 60)}" stroke="#262632" stroke-width="5"/>`).join('')}
  <g transform="translate(540 ${y + 40}) scale(2.6 .8)" opacity=".55"><path d="M-56 -100 L-24 -100 L-24 -120 A62 62 0 1 1 24 -120 L24 -100 L56 -100" transform="translate(0 110)" fill="none" stroke="${RED}" stroke-width="12"/></g>`;
// missile (pointe vers la droite, à l'origine)
const missile = (s = 1) => `<g transform="scale(${s})"><path d="M-120 0 L-160 -30 M-120 0 L-160 30" stroke="${INK}" stroke-width="10"/>
  <g class="flick1"><path d="M-130 -14 L-230 0 L-130 14Z" fill="${ORANGE}" filter="url(#glow)"/></g>
  <rect x="-130" y="-22" width="190" height="44" rx="20" fill="${INK}" stroke="${PAPER}" stroke-width="4"/>
  <path d="M60 -22 Q120 0 60 22Z" fill="${RED}" stroke="${INK}" stroke-width="4"/><path d="M-80 -22 L-80 22" stroke="${RED}" stroke-width="6"/></g>`;
// poing géant du Colosse (vient du haut à droite)
const fist = () => `<g>
  <path d="M120 -120 L900 -900 L1060 -760 L260 60Z" fill="${INK}" stroke="${PAPER}" stroke-width="6"/>
  <path d="M300 -300 L600 -600" stroke="${ORANGE}" stroke-width="12" filter="url(#glow)"/>
  <rect x="-170" y="-170" width="340" height="320" rx="50" fill="${INK}" stroke="${PAPER}" stroke-width="7"/>
  ${[-120, -40, 40, 120].map((x) => `<rect x="${x - 36}" y="110" width="72" height="90" rx="26" fill="${INK}" stroke="${PAPER}" stroke-width="5"/>`).join('')}
  <path d="M-150 -60 L150 -60" stroke="${PAPER}" stroke-width="4" opacity=".5"/>
  <g class="epulse" style="transform-origin:0px -10px"><circle cx="0" cy="-10" r="34" fill="${ORANGE}" filter="url(#glow)"/></g></g>`;
// liens d'énergie rose autour d'une jambe
const ropes = (x, y, w, n = 3) => Array.from({ length: n }, (_, i) => `<ellipse cx="${x}" cy="${y + i * 70}" rx="${w}" ry="26" fill="none" stroke="${ROSE}" stroke-width="10" filter="url(#glow)"/>`).join('');
// Ω
const omegaPath = (sw = 12, col = RED) => `<path d="M-56 -100 L-24 -100 L-24 -120 A62 62 0 1 1 24 -120 L24 -100 L56 -100" transform="translate(0 110)" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linejoin="round"/>`;
// le grand œil OMEGA (centre 0,0)
const omegaEye = () => `<g>
  <path d="M-470 0 Q0 -330 470 0 Q0 330 -470 0Z" fill="${INK}" stroke="${RED}" stroke-width="14" filter="url(#glow)"/>
  <g class="eyeOpen" style="animation-delay:35s;transform-origin:0px 0px">
    <path d="M-430 0 Q0 -290 430 0 Q0 290 -430 0Z" fill="#2a0005"/>
    <circle r="170" fill="${RED}" filter="url(#glow)"/>
    <circle r="170" fill="none" stroke="${INK}" stroke-width="14"/>
    <circle r="110" fill="#5a0008"/>
    <g class="epulse" style="transform-origin:0px 0px">${put(omegaPath(16, '#fff'), 0, 0, 1.1)}</g>
    <circle cx="60" cy="-70" r="20" fill="#fff" opacity=".8"/>
  </g>
  <path d="M-500 -10 Q0 -370 500 -10" fill="none" stroke="${INK}" stroke-width="26" stroke-linecap="round"/></g>`;

// =====================================================================
// 1 · L'arrivée (0 – 4 s) : la forteresse sous l'orage, l'équipe atterrit sur le toit (Écho les porte)
const team1 = [['rose', 'stand', 130, 0.5, 1, 0.25], ['givre', 'stand', 320, 0.56, 1, 0.45], ['echo', 'float', 740, 0.56, -1, 0.1],
  ['mirage', 'hips', 930, 0.5, -1, 0.55], ['cobalt', 'hips', 1060, 0.5, -1, 0.7]];
scene(0, 4, cam(0, 4, [[0, 0, -260, 0, 1.3], [1.7, 0, 0, 0, 1.05, 'ease-out'], [4, 30, -50, -1.5, 1.14]], `
  ${storm()}
  ${roof(1600)}
  ${an('pulse', 0, `<ellipse cx="540" cy="1640" rx="420" ry="90" fill="url(#rglow)"/>`, [540, 1640], ';animation-iteration-count:infinite')}
  ${team1.map(([k, p, x, s, m, d]) => an('descend', d, put(figure(k, p, { anim: 'idle', float: k === 'echo', glow: k === 'echo' }), x, k === 'echo' ? 1560 : 1620, s, m))).join('')}
  ${aura(740, 1350, ECHO, 2, 140, 0.4)}
  ${an('descend', 0.35, put(voltaMax('castUp', { anim: 'cast', glow: true }), 540, 1660, 0.66))}
  ${vis(1.75, 4, `${an('impact', 1.75, burst(540, 1650, 60, 260, 12, '#fff', VOLTA), [540, 1650])}${particles(30, VOLTA, [380, 700], [1500, 1660], [0, -260], [3, 7], [0.4, 0.9])}`)}
  ${bolt(560, 1150, 620, 1010, VOLTA, 8, 5, 18, 1.8)}
  ${rain(70)}
`, [540, 1300]) + `
  ${header(14, 'Assaut')}
  ${hook('Dernière mission : le toit de la Tour.', 0.3, 560)}
  ${bubbleFor(0, 540, 880, ['On y va,', 'les Anomalies !'], [0, 110])}
`);
sfx('thunder', 0.05); sfx('wind', 0.2); sfx('tk', 0.4); sfx('whoosh', 0.6); sfx('land', 1.75); sfx('zap', 1.8); sfx('step', 3.0);

// 2 · Le Colosse surgit (4 – 8 s) : la trappe Ω s'ouvre, le géant monte, ses deux yeux orange s'allument
scene(4, 8, shakeAt(6.1, cam(4, 8, [[4, 0, -40, 0, 1.12], [6.0, 0, 0, 0, 1.0, 'ease-in'], [6.2, 0, 0, 0, 1.03], [8, -30, 30, 2, 1.1]], `
  ${storm(4)}
  ${roof(1600)}
  <ellipse cx="540" cy="1600" rx="380" ry="70" fill="#050508" stroke="${ORANGE}" stroke-width="8" filter="url(#glow)"/>
  ${vis(4, 6.2, an('beamUp', 4.2, `<polygon points="200,1600 880,1600 1000,-200 80,-200" fill="${ORANGE}" opacity=".16"/>`, [540, 1600]))}
  ${mv(4.2, 1.9, [0, 1250], put(colosse(0.6), 540, 1080, 0.74), 'cubic-bezier(.25,.6,.3,1)')}
  ${an('eyeOpen', 6.3, `<ellipse cx="${540 - 60 * 0.74}" cy="${f(1080 - 442 * 0.74)}" rx="70" ry="26" fill="${ORANGE}" filter="url(#glow)" opacity=".8"/><ellipse cx="${540 + 60 * 0.74}" cy="${f(1080 - 442 * 0.74)}" rx="70" ry="26" fill="${ORANGE}" filter="url(#glow)" opacity=".8"/>`, [540, f(1080 - 442 * 0.74)])}
  <rect x="-700" y="1600" width="${W + 1400}" height="800" fill="#15151e"/>
  ${vis(6.1, 8, `${an('drift', 6.1, smoke(540, 1600, 14, 900, '#4a4a56', 0.85))}${cracks(540, 1620, 7, 260, ORANGE, 5)}`)}
  ${put(figure('givre', 'guard', { anim: 'fight' }), 140, 1720, 0.5)}
  ${put(voltaMax('hips', { anim: 'fight', glow: true }), 960, 1720, 0.52, -1)}
  ${particles(30, ORANGE, [100, 980], [600, 1600], [0, -300], [2, 5], [1, 2])}
`, [540, 1100]), 3) + `
  ${onom(540, 1420, 'BOOOM', 130, -4, ORANGE, INK, 6.1)}
  ${bubbleFor(1, 540, 400, ['Cibles détectées.', 'Élimination.'], [0, 90])}
`);
sfx('rumble', 4.1); sfx('door', 4.2); sfx('powerup', 4.6); sfx('bigboom', 6.1); sfx('eye', 6.3); sfx('alarm', 7.0);

// 3 · Les missiles (8 – 11,5 s) : salve du Colosse, Écho les fige en l'air… et les renvoie
const mis = [[700, 760, 160], [830, 980, 170], [640, 1140, 150], [900, 1250, 175], [760, 1400, 165]];
scene(8, 11.5, shakeAt(10.75, cam(8, 11.5, [[8, 60, 0, 2, 1.12], [9.5, 0, 0, 0, 1.02], [10.6, 0, 0, 0, 1.04], [10.8, 30, 20, -2, 1.12, 'ease-out'], [11.5, 0, 0, 0, 1.08]], `
  ${storm(8)}
  ${roof(1700)}
  ${put(colosse(1), 1080, 640, 0.66, -1)}
  ${vis(10.75, 11.5, `${an('impact', 10.75, burst(1000, 600, 90, 340, 14, '#fff', ECHO), [1000, 600])}${an('drift', 10.8, smoke(980, 640, 12, 500, '#4a4a56', 0.9))}`)}
  ${mis.map(([x, y, a], i) => go(10.1 + i * 0.05, 0.6, [1000 - x, 600 - y], mv(8.05 + i * 0.08, 0.55, [1000 - x, 600 - y],
    `<g transform="translate(${x} ${y}) rotate(${a})">${an('shakeS', 8.7, missile(0.8), null, ';animation-iteration-count:4')}</g>`), 'cubic-bezier(.6,0,.9,.5)')).join('')}
  ${vis(8.6, 10.2, mis.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="110" fill="none" stroke="${ECHO}" stroke-width="8" stroke-dasharray="20 14" filter="url(#glow)" class="flow"/>`).join(''))}
  ${vis(8, 8.7, streaks(20, '#9a9aa8', [600, 1500], -700, [2, 4], [0.2, 0.35], -30))}
  ${aura(370, 1150, ECHO, 3, 90, 8.5)}
  ${an('bob', 8, put(figure('echo', 'cast', { anim: 'cast', float: true, glow: true }), 250, 1640, 0.75), null, ';animation-iteration-count:infinite')}
  ${particles(36, ECHO, [100, 1000], [700, 1600], [200, -300], [3, 7], [0.8, 1.6])}
`, [540, 1100]), 3) + `
  ${bubbleFor(2, 340, 420, ['Écho, attention', 'aux missiles !'], [-60, 110])}
  ${bubbleFor(3, 300, 800, ['Je les renvoie !'], [-20, 100])}
  ${vis(10.75, 11.5, onom(700, 380, 'KA-BOOM !', 120, -6, ECHO, INK, 10.75))}
  ${flashAt(10.75)}
`);
sfx('missile', 8.0); sfx('missile', 8.2); sfx('tk', 8.6); sfx('freeze', 8.7); sfx('whoosh', 10.1); sfx('boom', 10.75);

// 4 · Les jambes (11,5 – 15 s) : Rose ligote, Cobalt fait trembler le toit, Givre gèle les pieds
const RX = 760, RY = 730, RS = 1.3;
scene(11.5, 15, shakeAt(12.45, cam(11.5, 15, [[11.5, 0, 100, 0, 1.18], [12.4, 0, 0, -1, 1.04], [12.6, 0, 0, 0, 1.06], [15, -40, -20, 1.5, 1.12]], `
  ${storm(11.5)}
  ${roof(1640)}
  ${an('hover', 11.5, put(colosse(1.4), RX, RY, RS), null, ';animation-iteration-count:infinite')}
  ${vis(11.9, 15, `${ropes(RX - 230, 1180, 120)}${ropes(RX + 230, 1180, 120)}
    <path d="M760 1300 Q640 1240 ${RX - 230} 1250 M760 1300 Q880 1240 ${RX + 230} 1250" stroke="${ROSE}" stroke-width="8" fill="none" filter="url(#glow)" class="flow" stroke-dasharray="18 12"/>`)}
  ${put(figure('rose', 'castUp', { anim: 'cast', glow: true }), 760, 1640, 0.45)}
  ${vis(12.45, 15, `${an('ripple', 12.45, `<ellipse cx="260" cy="1640" rx="300" ry="60" fill="none" stroke="${COBALT}" stroke-width="12" filter="url(#glow)"/>`, [260, 1640])}${cracks(300, 1640, 6, 420, COBALT, 6)}${particles(26, COBALT, [100, 700], [1500, 1650], [0, -400], [3, 8], [0.5, 1])}`)}
  ${mv(11.6, 0.7, [-500, -300], put(figure('cobalt', 'slam', { anim: 'fight', glow: true }), 220, 1640, 0.62), 'cubic-bezier(.5,0,.9,.6)')}
  ${an('rise', 13.5, [RX - 230, RX + 230].map((x) => `${crystal(x - 90, 1645, 150, 300, -14)}${crystal(x, 1645, 170, 360, 4)}${crystal(x + 90, 1645, 140, 280, 16)}`).join(''))}
  <path d="M-700 1645 L1780 1645" stroke="${GIVRE}" stroke-width="14" filter="url(#glow)" pathLength="1" class="draw" style="animation-delay:13.4s"/>
  ${vis(13.5, 15, particles(30, '#c8f1ff', [300, 1100], [1300, 1640], [0, -200], [3, 6], [0.8, 1.6]))}
`, [540, 1300]), 3) + `
  ${tag(70, 236, 'ROSE', 'LIENS', ROSE, 11.8)}
  ${tag(70, 316, 'COBALT', 'SÉISME', COBALT, 12.3)}
  ${bubbleFor(4, 270, 760, ['On bloque', 'ses jambes !'], [-40, 110])}
  ${vis(13.5, 15, onom(560, 1440, 'KRRAK !', 110, -5, GIVRE, INK, 13.55))}
`);
sfx('electric', 11.9); sfx('whoosh', 11.6); sfx('punch', 12.4); sfx('rumble', 12.45); sfx('iceWall', 13.5); sfx('freeze', 13.6);

// 5 · Vision du Colosse (15 – 18,5 s) : cinq Volta, les viseurs sautent de l'une à l'autre
const vcopies = [[150, 0.5, 1420], [340, 0.56, 1500], [540, 0.62, 1580], [740, 0.56, 1500], [930, 0.5, 1420]];
scene(15, 18.5, cam(15, 18.5, [[15, -110, 0, -1, 1.12], [16.8, 110, 0, 1, 1.12], [18.5, 0, -20, 0, 1.0]], `
  ${storm(15)}
  ${roof(1600)}
  ${vcopies.map(([x, s, y], i) => an('pop', 14.7 + i * 0.05, i === 1 ? put(voltaMax('guard', { anim: 'fight', glow: true }), x, y, s, 1)
    : ghost(put(voltaMax(['hips', 'guard', 'charge', 'castUp', 'hips'][i], { anim: 'idle', glow: true }), x, y, s, i % 2 ? -1 : 1), 0.35, 0.8))).join('')}
  ${particles(46, MIRAGE, [0, W], [700, 1600], [0, -300], [2, 5], [1, 2.2])}
  ${aura(230, 1440, MIRAGE, 2, 90, 15)}${fadeIn(14.7, 0.3, put(figure('mirage', 'cast', { anim: 'cast', glow: true }), 170, 1700, 0.56))}
  <rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="${RED}" opacity=".14"/>
  <g fill="${RED}" opacity=".12" class="scanlines" style="animation-iteration-count:infinite;animation-duration:.6s">${Array.from({ length: 50 }, (_, i) => `<rect x="-700" y="${i * 60 - 600}" width="${W + 1400}" height="10"/>`).join('')}</g>
  ${vcopies.map(([x, s, y], i) => vis(15.6 + i * 0.35, 15.6 + i * 0.35 + 0.5, reticle(x, f(y - 400 * s), 80, 15.6 + i * 0.35))).join('')}
  ${vis(17.4, 18.5, vcopies.map(([x, s, y], i) => reticle(x, f(y - 400 * s), 70, 17.4 + i * 0.05)).join(''))}
`, [540, 1200]) + `
  ${bubbleFor(5, 540, 520, ['Laquelle', 'est la vraie ?'], [0, 110])}
  ${vis(17.3, 18.5, an('blink', 17.3, `<rect x="190" y="236" width="700" height="80" fill="${INK}" stroke="${ORANGE}" stroke-width="5"/><text x="540" y="290" class="rt" style="font-size:40px" fill="${ORANGE}">ERREUR · CIBLES ×5</text>`, null, ';animation-iteration-count:infinite'))}
`);
sfx('shimmer', 15.1); sfx('scan', 15.6); sfx('lock', 15.6); sfx('lock', 15.95); sfx('lock', 16.3); sfx('lock', 16.65); sfx('lock', 17.0); sfx('glitch', 17.3);

// 6 · Le poing (18,5 – 22 s) : le Colosse frappe, Écho bloque le poing par télékinésie, Volta se prépare
scene(18.5, 22, shakeAt(18.9, cam(18.5, 22, [[18.5, 40, -40, 2, 1.15], [18.9, 0, 0, 0, 1.02, 'ease-out'], [22, -30, 20, -1.5, 1.1]], `
  ${storm(18.5)}
  ${roof(1640)}
  ${an('shakeS', 19, `${mv(18.5, 0.4, [600, -600], put(fist(), 560, 930, 0.95), 'cubic-bezier(.6,0,.9,.5)')}`, null, ';animation-iteration-count:7')}
  ${vis(18.9, 22, `${aura(560, 930, ECHO, 3, 200, 18.9)}${cracks(560, 930, 8, 260, ECHO, 5)}`)}
  ${vis(18.9, 19.4, an('impact', 18.9, burst(560, 930, 120, 360, 14, '#fff', ECHO), [560, 930]))}
  ${an('shakeS', 19, put(figure('echo', 'guard', { anim: 'charge', float: true, glow: true }), 300, 1640, 0.78), null, ';animation-iteration-count:7')}
  ${vis(18.9, 22, `<path d="M${f(hand('guard', 'ra', 300, 1640, 0.78)[0])} ${f(hand('guard', 'ra', 300, 1640, 0.78)[1])} L480 1000 M${f(hand('guard', 'la', 300, 1640, 0.78)[0])} ${f(hand('guard', 'la', 300, 1640, 0.78)[1])} L460 880" stroke="${ECHO}" stroke-width="16" filter="url(#glow)" class="flow" stroke-dasharray="26 16"/>`)}
  ${vis(20.4, 22, fadeIn(20.4, 0.4, `${put(voltaMax('charge', { anim: 'charge', glow: true }), 860, 1640, 0.62, -1)}${aura(860, 1300, VOLTA, 2, 110, 20.5)}${bolt(800, 1240, 920, 1180, VOLTA, 8, 6, 20, 20.5)}`))}
  ${particles(40, ECHO, [60, 1020], [700, 1600], [0, -300], [3, 7], [0.8, 1.6])}
  ${vis(20.4, 22, particles(24, VOLTA, [760, 960], [1100, 1500], [0, -300], [3, 6], [0.4, 0.8]))}
`, [540, 1100]), 2) + `
  ${onom(560, 1450, 'DOOOM !', 120, 4, ECHO, INK, 18.9)}
  ${bubbleFor(6, 330, 480, ['Je le tiens,', 'vas-y Volta !'], [-30, 110])}
`);
sfx('whoosh', 18.5); sfx('klang', 18.9); sfx('tk', 19.0); sfx('heart', 19.6); sfx('charge', 20.4); sfx('electric', 20.6);

// 7 · La charge (22 – 25,5 s) : gros plan sur les yeux, la foudre de l'orage tombe dans les mains de Volta
const vH = hand('charge', 'ra', 540, 1650, 0.82), vHl = hand('charge', 'la', 540, 1650, 0.82);
scene(22, 25.5, shakeAt(24.9, cam(22, 25.5, [[22, 0, -60, 0, 1.0], [24.6, 0, 0, 0, 1.08], [25.5, 0, 0, 0, 1.2, 'ease-in']], `
  ${storm(22)}
  ${radial(540, 1250, 160, '#3a3410', [260, 520])}
  ${roof(1650)}
  ${an('pulse', 22, `<circle cx="540" cy="1250" r="600" fill="url(#vglow)"/>`, [540, 1250], ';animation-iteration-count:infinite')}
  ${[22.5, 23.3, 24.1, 24.7].map((t, i) => vis(t, t + 0.35, bolt(f(rnd(100, 980)), -300, f(i % 2 ? vH[0] : vHl[0]), f(i % 2 ? vH[1] : vHl[1]), VOLTA, 18, 10, 60, t))).join('')}
  ${an('shakeS', 22, put(voltaMax('charge', { anim: 'charge', glow: true, shout: true }), 540, 1650, 0.82), null, ';animation-iteration-count:infinite')}
  ${aura(540, 1300, VOLTA, 3, 150, 22.2)}
  ${particles(50, VOLTA, [200, 880], [800, 1650], [0, -500], [3, 8], [0.4, 1])}
  ${an('inL', 22, panel('p7', 40, 290, 1000, 400, an('zoomP', 22, `${radial(540, 490, 110, '#3a3410', [300, 480])}${bigEyes(540, 520, 'volta')}${bolt(60, 330, 1020, 420, VOLTA, 10, 10, 40, 22.1)}`, [540, 490]), INK))}
`, [540, 1200]), 2) + `
  ${bubbleFor(7, 540, 800, ['Absorbe ça,', 'pour voir !'], [0, 110])}
  ${flashAt(24.7)}
`);
sfx('thunder', 22.5); sfx('zap', 23.3); sfx('thunder', 24.1); sfx('charge', 24.2); sfx('zap', 24.7); sfx('electric', 25.0);

// 8 · L'éclair (25,5 – 29,5 s) : Volta bondit, la foudre traverse le noyau, le Colosse explose et tombe
const CX = 620, CY = 980, CS = 0.8, core = [CX, CY - 110 * CS];
scene(25.5, 29.5, shakeAt(27.0, cam(25.5, 29.5, [[25.5, 0, 0, 0, 1.12], [26.9, 0, 0, 0, 1.0, 'ease-in'], [27.1, 0, 0, 0, 1.06], [29.5, -30, -40, 2, 1.1]], `
  ${storm(25.5)}
  ${roof(1640)}
  ${go(27.3, 1.8, [260, 700], `${an('shakeS', 25.6, put(colosse(2), CX, CY, CS), null, ';animation-iteration-count:5')}
    ${vis(25.9, 29.5, `<g class="flick1">${cracks(core[0], core[1], 9, 300, VOLTA, 6)}</g>`)}`, 'cubic-bezier(.5,0,.9,.6)', 22)}
  ${vis(25.7, 27.2, `${bolt(260, 1260, core[0], core[1], VOLTA, 30, 12, 60, 25.7)}${bolt(260, 1260, core[0], core[1], '#fff', 10, 10, 50, 25.75)}`)}
  ${vis(25.7, 29.5, an('impact', 25.7, burst(core[0], core[1], 50, 200, 12, '#fff', VOLTA), core))}
  ${vis(27.0, 29.5, `${an('impact', 27.0, an('spinS', 27.0, burst(core[0], core[1], 120, 560, 16, '#fff', VOLTA), core), core)}
    ${an('drift', 27.1, smoke(620, 1300, 16, 900, '#5d5d68', 0.9))}
    ${particles(60, VOLTA, [100, 1000], [500, 1500], [0, -900], [3, 9], [0.8, 1.6])}`)}
  ${an('leapB', 25.5, put(voltaMax('throw', { anim: 'fight', glow: true }), 240, 1500, 0.62, 1, -8))}
  ${streaks(22, VOLTA, [900, 1500], 900, [3, 6], [0.2, 0.35], -20)}
`, [540, 1100]), 4) + `
  ${bubbleFor(8, 560, 360, ['Surcharge.', 'Système critique.'], [60, 90])}
  ${vis(27.0, 29.5, onom(540, 1420, 'KRA-THOOOM !!', 120, -5, VOLTA, INK, 27.05))}
  ${flashAt(27.0)}
`);
sfx('beam', 25.6); sfx('electric', 25.8); sfx('powerdown', 26.4); sfx('bigboom', 27.0); sfx('rumble', 27.4); sfx('klang', 28.9);

// 9 · Après la tempête (29,5 – 33,5 s) : l'équipe debout devant l'épave… Kessler apparaît et rit
const team9 = [['cobalt', 'castUp', 80, 0.46, 1], ['rose', 'hips', 200, 0.46, 1], ['givre', 'point', 330, 0.52, 1], ['mirage', 'stand', 450, 0.5, 1], ['echo', 'stand', 570, 0.5, 1]];
scene(29.5, 33.5, cam(29.5, 33.5, [[29.5, -40, 30, 0, 1.06], [31.3, 0, 0, 0, 1.06], [33.5, 50, 40, 1, 1.15]], `
  ${storm(29.5)}
  ${roof(1640)}
  ${put(`<g opacity=".95">${robotG(0.2, { twin: true, eye: '#4a2a10' })}</g>`, 780, 1540, 0.6, 1, 78)}
  <g class="flick1">${cracks(780, 1450, 6, 160, ORANGE, 4)}</g>
  ${an('drift', 29.5, smoke(820, 1620, 7, 500, '#3e3e4a', 0.5))}
  ${team9.map(([k, p, x, s, m]) => put(figure(k, p, { anim: 'idle', float: k === 'echo' }), x, 1660, s, m)).join('')}
  ${put(voltaMax('hips', { anim: 'idle', glow: true }), 300, 1720, 0.56)}
  ${vis(30.8, 33.5, `${fadeIn(30.8, 0.5, `<rect x="660" y="1100" width="320" height="40" fill="${INK}" stroke="${RED}" stroke-width="5"/>${an('pulse', 30.8, `<ellipse cx="820" cy="1100" rx="260" ry="80" fill="url(#rglow)"/>`, [820, 1100], ';animation-iteration-count:infinite')}`)}
    ${fadeIn(30.8, 0.5, an('shakeS', 31.5, put(figure('kessler', 'hips', { anim: 'fight', shout: true }), 820, 1100, 0.6, -1), null, ';animation-iteration-count:4'))}`)}
  ${particles(30, '#8a8578', [-100, 1180], [800, 1700], [200, -80], [2, 5], [1.5, 3], 0.6)}
`, [700, 1200]) + `
  ${bubbleFor(9, 300, 1030, ['Docteur Kessler,', "c'est fini."], [20, 110])}
  ${bubbleFor(10, 700, 470, ['Fini ?', 'Ha ha ha !'], [100, 110])}
`);
sfx('wind', 29.5); sfx('powerdown', 29.6); sfx('holo', 30.8); sfx('step', 31.0);

// 10 · Le vrai maître (33,5 – 40 s) : Kessler en gros plan, l'œil OMEGA s'ouvre dans le ciel + carton final
scene(33.5, 40, cam(33.5, 40, [[33.5, 0, 40, 0, 1.15], [35.0, 0, 0, 0, 1.06], [35.4, 0, 0, 0, 1.0, 'ease-out'], [40, 0, -20, 0, 1.04]], `
  ${storm(33.5)}
  ${vis(35, 40, `<rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="${RED}" opacity=".16"/>${an('pulse', 35, `<circle cx="540" cy="620" r="800" fill="url(#rglow)"/>`, [540, 620], ';animation-iteration-count:infinite')}`)}
  ${vis(35, 40, [[-80, 420], [1160, 420], [-40, 880], [1120, 880]].map(([x, y], i) => an('pop', 35.1 + i * 0.12, holo(x - 130, y - 90, 260, 180, put(omegaPath(10), x, y, 0.8)))).join(''))}
  ${put(omegaEye(), 540, 620, 1)}
  ${roof(1660)}
  ${vis(35, 40, streaks(18, RED, [200, 1100], 0, [2, 4], [0.4, 0.8], 90))}
  ${put(figure('kessler', 'castUp', { anim: 'idle', shout: true }), 800, 1660, 0.92, -1)}
  ${particles(40, RED, [0, W], [300, 1600], [0, -260], [2, 5], [1.2, 2.4], 0.8)}
`, [540, 1000]) + `
  ${bubbleFor(11, 430, 900, ["Vous croyez que c'est", 'moi qui commande ?'], [220, 110])}
  ${vis(35.4, 36.9, an('pop', 35.4, `<text x="540" y="330" class="rt" style="font-size:48px" fill="${RED}">OMEGA · EN LIGNE</text>`))}
  ${finalCard(36.9, 'ÉPISODE 15 BIENTÔT')}
`);
sfx('heart', 33.6); sfx('eye', 35.0); sfx('powerup', 35.1); sfx('holo', 35.4); sfx('hit', 36.9);

L.build(import.meta.url, 'les-anomalies-ep14');
