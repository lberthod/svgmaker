// « LES ANOMALIES » ép. 2 · Sujet 4 : manga d'action, 40 s, 1080x1920 (Reel).
// Métro abandonné : trois Traqueurs cernent une fille invisible, Mirage (Sujet 4). Le trio la sauve,
// elle disparaît avec le badge Ω d'un robot… qui affiche « TOUR OMEGA ».
// Usage : node make.mjs → les-anomalies-ep2.svg + timeline.json (lu par audio.py)
import * as L from '../les-anomalies/lib.mjs';
const { W, H, PAPER, INK, NIGHT, RED, VOLTA, GIVRE, ECHO, MIRAGE, rnd, f, vis, scene, an, radial, burst, cracks, bolt, onom, panel,
  bubbleFor, tag, figure, hand, put, bigEyes, robotG, aura, crystal, smoke, reticle, BG, GROUND, cam, particles, streaks, shakeAt,
  flashAt, sfx, mv, go, anim, fadeIn, fadeOut, ghost, bobbing, holo, tower, header, hook, finalCard, city } = L;
L.reseed(202);

const LINES = [
  { who: 'givre', t0: 2.0, t1: 3.4, text: "Le signal vient d'ici." },
  { who: 'robot', t0: 5.3, t1: 7.2, text: 'Sujet 4. Reddition immédiate.' },
  { who: 'mirage', t0: 9.7, t1: 11.2, text: 'Laissez-moi tranquille !' },
  { who: 'volta', t0: 13.3, t1: 14.5, text: 'Hé, la ferraille !' },
  { who: 'echo', t0: 17.4, t1: 18.7, text: 'Attention, ça passe !' },
  { who: 'mirage', t0: 20.2, t1: 21.6, text: 'Devinez laquelle !' },
  { who: 'givre', t0: 23.3, t1: 24.5, text: 'Maintenant, Volta !' },
  { who: 'echo', t0: 27.6, t1: 28.9, text: 'On est comme toi, tu sais.' },
  { who: 'mirage', t0: 29.2, t1: 31.0, text: "Je n'ai confiance en personne." },
  { who: 'volta', t0: 32.5, t1: 33.7, text: 'Elle a disparu !' },
  { who: 'mirage', t0: 35.2, t1: 36.7, text: 'La Tour OMEGA…' },
];
L.setLines(LINES);

// ---------- Décors propres à l'épisode ----------
const VP = [540, 880]; // point de fuite du tunnel
const tunnel = (light = '#2a2a36') => {
  let s = '';
  for (let i = 0; i < 9; i++) { // arches de plus en plus lointaines
    const k = Math.pow(0.72, i), w = 1500 * k, h = 1700 * k, x = VP[0] - w / 2, y = VP[1] - h * 0.55;
    s += `<path d="M${f(x)} ${f(y + h)} L${f(x)} ${f(y + w * 0.35)} Q${f(x)} ${f(y)} ${VP[0]} ${f(y)} Q${f(x + w)} ${f(y)} ${f(x + w)} ${f(y + w * 0.35)} L${f(x + w)} ${f(y + h)}" fill="none" stroke="${light}" stroke-width="${f(26 * k + 3)}"/>`;
    if (i % 2 === 0) s += `<g class="flick${1 + (i % 4 ? 1 : 0)}" style="animation-duration:${f(rnd(0.3, 1.2))}s"><circle cx="${VP[0]}" cy="${f(y + 30 * k)}" r="${f(18 * k + 3)}" fill="${VOLTA}" opacity=".75" filter="url(#glow)"/></g>`;
  }
  const rails = [-420, -160, 160, 420].map((dx) => `<path d="M${VP[0] + dx * 2.2} ${H + 200} L${VP[0] + dx * 0.04} ${VP[1] + 40}" stroke="#55555f" stroke-width="10"/>`).join('');
  const sleepers = Array.from({ length: 12 }, (_, i) => { const k = Math.pow(0.78, i), y = VP[1] + 40 + 1250 * k; return `<path d="M${f(VP[0] - 1000 * k)} ${f(y)} L${f(VP[0] + 1000 * k)} ${f(y)}" stroke="#2a2a33" stroke-width="${f(30 * k + 2)}"/>`; }).join('');
  return `${BG('#0a0a10')}<rect x="-700" y="${VP[1] + 40}" width="${W + 1400}" height="1600" fill="#121218"/>${sleepers}${rails}${s}`;
};
const wagon = (s = 1, color = ECHO) => `<g transform="scale(${s})">
  <rect x="-420" y="-260" width="840" height="300" rx="30" fill="#2b2b35" stroke="${color}" stroke-width="10" filter="url(#glow)"/>
  ${[-330, -170, -10, 150].map((x) => `<rect x="${x}" y="-220" width="130" height="110" rx="10" fill="${PAPER}" opacity=".18"/>`).join('')}
  <rect x="300" y="-220" width="80" height="230" fill="#1a1a22" stroke="${PAPER}" stroke-width="3"/>
  <path d="M-420 -60 L420 -60" stroke="${VOLTA}" stroke-width="10"/>
  <circle cx="-280" cy="50" r="40" fill="${INK}" stroke="${PAPER}" stroke-width="5"/><circle cx="280" cy="50" r="40" fill="${INK}" stroke="${PAPER}" stroke-width="5"/>
  <text x="-120" y="-130" class="cap" fill="${PAPER}" opacity=".5" style="font-size:44px">LIGNE 7</text></g>`;
const badge = (s = 1) => `<g transform="scale(${s})">
  <polygon points="0,-90 78,-45 78,45 0,90 -78,45 -78,-45" fill="${INK}" stroke="${RED}" stroke-width="8" filter="url(#glow)"/>
  <path d="M-34 26 L-12 26 L-12 12 A40 40 0 1 1 12 12 L12 26 L34 26" fill="none" stroke="${RED}" stroke-width="10" stroke-linejoin="round"/></g>`;
// yeux de Traqueur qui s'allument dans le noir
const redEyes = (x, y, s, t) => an('eyeOpen', t, `<ellipse cx="${x}" cy="${y}" rx="${46 * s}" ry="${14 * s}" fill="${RED}" filter="url(#glow)"/><ellipse cx="${x}" cy="${y}" rx="${16 * s}" ry="${6 * s}" fill="#fff"/>`, [x, y]);
const torch = (x, y, ang, len = 900, color = VOLTA, op = 0.16) => an('swayL', 0, `<polygon points="${x},${y} ${f(x + Math.cos(ang - 0.22) * len)},${f(y + Math.sin(ang - 0.22) * len)} ${f(x + Math.cos(ang + 0.22) * len)},${f(y + Math.sin(ang + 0.22) * len)}" fill="${color}" opacity="${op}"/>`, [x, y], ';animation-duration:3s;animation-iteration-count:infinite;animation-direction:alternate');

// =====================================================================
// 1 · Le tunnel (0 – 4 s) : travelling avant, le trio avance, Volta éclaire avec ses étincelles
scene(0, 4, cam(0, 4, [[0, 0, 0, 0, 1.0], [4, 0, -60, 1, 1.22]], `
  ${tunnel()}
  ${particles(30, '#6a6a78', [-200, 1280], [0, 1900], [60, 200], [2, 4], [2, 4], 0.5)}
  ${torch(540, 1180, -1.57, 1000)}
  ${mv(0, 4, [0, 120], `
    ${put(figure('givre', 'stand', { anim: 'idle' }), 260, 1640, 0.62)}
    ${put(figure('echo', 'stand', { anim: 'idle', float: true }), 820, 1620, 0.6, -1)}
    ${put(figure('volta', 'castUp', { anim: 'cast', glow: true }), 540, 1700, 0.7)}
    ${particles(24, VOLTA, [500, 640], [1080, 1220], [0, -200], [2, 6], [0.3, 0.7])}
    ${bolt(560, 1150, 600, 1060, VOLTA, 8, 5, 18, 0)}`, 'linear')}
`, [540, 900]) + `
  ${header(2, 'Sujet 4')}
  ${hook('Sous la ville, quelqu’un se cache.', 0.3, 820)}
  ${bubbleFor(0, 330, 560, ["Le signal vient d'ici."], [-40, 90])}
`);
sfx('hit', 0.05); sfx('wind', 0.2); sfx('zap', 0.8); sfx('step', 1.4); sfx('step', 2.2); sfx('step', 3.0);

// 2 · Les yeux rouges (4 – 8 s) : trois Traqueurs s'allument dans le noir, viseurs sur un point vide
scene(4, 8, cam(4, 8, [[4, 0, 0, 0, 1.25], [5.2, 0, 0, 0, 1.0, 'ease-out'], [8, 30, -40, -2, 1.12]], `
  ${tunnel('#1e1e28')}
  ${an('hover', 4, `${put(`<g opacity=".9">${robotG(0.8)}</g>`, 230, 980, 0.42)}${put(`<g opacity=".9">${robotG(0.8)}</g>`, 850, 1000, 0.42)}${put(`<g opacity=".95">${robotG(1)}</g>`, 540, 930, 0.55)}`, null, ';animation-iteration-count:infinite')}
  <rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="#05050a" opacity=".55"/>
  ${redEyes(230, 980 - 442 * 0.42, 0.42, 4.3)}${redEyes(850, 1000 - 442 * 0.42, 0.42, 4.6)}${redEyes(540, 930 - 442 * 0.55, 0.55, 4.9)}
  ${vis(5.5, 8, `${an('scan', 5.5, `<polygon points="540,687 300,1520 780,1520" fill="${RED}" opacity=".2"/>`, [540, 687])}
    ${reticle(560, 1380, 90, 5.9)}${ghost(`<path d="M520 1240 C500 1300 520 1500 560 1520 C600 1500 610 1300 590 1240 C580 1200 530 1200 520 1240Z" fill="none" stroke="${MIRAGE}" stroke-width="6" filter="url(#glow)"/>`, 0.1, 0.45)}`)}
  ${particles(26, RED, [0, W], [500, 1700], [0, -300], [2, 4], [1, 2], 0.6)}
`, [540, 900]) + `
  ${onom(540, 1450, 'KLIK · KLIK · KLIK', 70, -3, RED, INK, 4.3)}
  ${bubbleFor(1, 540, 420, ['Sujet 4.', 'Reddition immédiate.'], [0, 90])}
`);
sfx('lock', 4.3); sfx('lock', 4.6); sfx('lock', 4.9); sfx('scan', 5.5); sfx('alarm', 6.0);

// 3 · Mirage apparaît (8 – 12 s) : contour qui scintille, puis la fille se matérialise, acculée
scene(8, 12, cam(8, 12, [[8, 0, 120, 0, 1.3], [9.6, 0, 0, 0, 1.08, 'ease-out'], [12, 0, -30, 2, 1.18]], `
  ${BG(INK)}
  ${radial(540, 1150, 140, '#103a22', [300, 520])}
  ${an('pulse', 8, `<circle cx="540" cy="1200" r="560" fill="url(#gglow)"/>`, [540, 1200], ';animation-iteration-count:infinite')}
  ${GROUND(1620, '#07070b')}
  ${vis(8, 9.3, ghost(put(figure('mirage', 'hips', { anim: 'idle' }), 540, 1620, 1.05), 0.1, 0.35))}
  ${vis(9.2, 12, fadeIn(9.2, 0.5, an('shakeS', 10.5, put(figure('mirage', 'cast', { anim: 'fight', glow: true }), 540, 1620, 1.05), null, ';animation-iteration-count:3')))}
  ${particles(46, MIRAGE, [200, 880], [700, 1650], [0, -260], [2, 6], [0.8, 1.8])}
  ${vis(10.4, 12, `<g class="flick1">${['-0.5', '0.4'].map((dx, i) => `<path d="M${i ? 1300 : -260} ${i ? 500 : 420} L${f(540 + dx * 200)} ${980 + i * 60}" stroke="${RED}" stroke-width="12" filter="url(#glow)"/>`).join('')}</g>
    ${reticle(540, 960, 70, 10.4)}`)}
`, [540, 1100]) + `
  ${tag(70, 236, 'MIRAGE', 'INVISIBILITÉ', MIRAGE, 9.3)}
  ${onom(540, 1450, 'SHIIIN', 110, -4, MIRAGE, INK, 9.2)}
  ${bubbleFor(2, 540, 470, ['Laissez-moi', 'tranquille !'], [0, 90])}
`);
sfx('shimmer', 8.2); sfx('invis', 9.2); sfx('lock', 10.4);

// 4 · Le tir (12 – 15,5 s) : le laser part, le mur de Givre l'arrête, Volta bondit
const wall = [[420, 200, 520, -20], [540, 220, 640, 10], [660, 200, 540, 20], [760, 160, 380, -10]].map(([x, w, h, l]) => crystal(x, 1560, w, h, l)).join('');
scene(12, 15.5, shakeAt(12.75, cam(12, 15.5, [[12, -80, 0, -3, 1.2], [12.7, 0, 0, 0, 1.04, 'ease-in'], [13.2, 0, 0, 0, 1.08], [15.5, 60, -40, 3, 1.2]], `
  ${BG(PAPER)}
  <rect x="-700" y="-1000" width="${W + 1400}" height="2600" fill="url(#tone)" opacity=".3"/>
  ${radial(560, 1100, 150, INK, [380, 600])}
  ${GROUND(1560)}
  ${vis(12, 12.8, `<g class="flick1"><polygon points="1300,560 1300,640 560,1110 560,1080" fill="${RED}" filter="url(#glow)"/></g>`)}
  ${an('rise', 12.6, wall)}
  ${vis(12.75, 15.5, `${an('impact', 12.75, burst(640, 1180, 50, 190, 12, '#fff', RED), [640, 1180])}${cracks(640, 1180, 6, 160, INK, 4)}${particles(30, '#c8f1ff', [560, 720], [1100, 1260], [-300, -200], [3, 7], [0.4, 0.8])}`)}
  ${put(figure('givre', 'cast', { glow: true, anim: 'cast' }), 200, 1560, 0.85)}
  ${vis(12, 15.5, put(figure('mirage', 'stand', { anim: 'idle' }), 860, 1560, 0.7, -1))}
  ${an('leapA', 13.2, put(figure('volta', 'leap', { anim: 'fight', glow: true }), 640, 820, 0.7, 1, -10))}
  ${vis(13.2, 15.5, particles(30, VOLTA, [500, 800], [500, 900], [-200, 300], [3, 7], [0.4, 0.8]))}
`, [540, 1100]), 3) + `
  ${onom(560, 1440, 'KRAAK !', 120, -6, GIVRE, INK, 12.75)}
  ${bubbleFor(3, 360, 380, ['Hé, la ferraille !'], [60, 90])}
`);
sfx('laser', 12.0); sfx('iceWall', 12.6); sfx('klang', 12.75); sfx('whoosh', 13.2);

// 5 · Foudre et wagon (15,5 – 19,5 s) : Volta frappe un robot, Écho soulève un wagon et le lance
const eH = hand('throw', 'ra', 250, 1600, 0.8);
scene(15.5, 19.5, `
  ${vis(15.5, 17.2, shakeAt(15.7, cam(15.5, 17.2, [[15.5, 0, 0, 0, 1.3], [16, 0, 0, 0, 1.05, 'ease-out'], [17.2, -40, 30, -2, 1.12]], `
    ${BG(INK)}
    ${radial(760, 900, 170, '#3a3410', [220, 460])}
    ${an('shake', 15.7, put(robotG(2.5), 760, 1250, 0.8), null, ';animation-iteration-count:3')}
    ${bolt(140, 400, 760, 900, VOLTA, 22, 10, 60, 15.5)}${bolt(200, 300, 800, 1000, VOLTA, 10, 9, 40, 15.6)}
    ${an('impact', 15.7, burst(760, 900, 80, 260, 14, '#fff', VOLTA), [760, 900])}
    ${particles(40, VOLTA, [600, 900], [800, 1000], [300, -500], [3, 8], [0.5, 1.0])}
    ${put(figure('volta', 'throw', { glow: true, anim: 'fight' }), 220, 1500, 0.75)}`, [760, 900]), 2))}
  ${vis(17.2, 19.5, cam(17.2, 19.5, [[17.2, 0, 0, 0, 1.0], [18.6, 0, -20, 0, 1.06], [18.9, 70, -60, 3, 1.12, 'ease-in'], [19.5, 0, 0, 0, 1.02, 'ease-out']], `
    ${tunnel('#26263a')}
    ${aura(f(eH[0]), f(eH[1]), ECHO, 3, 70, 17.2)}
    ${an('bob', 17.2, put(figure('echo', 'throw', { float: true, glow: true, anim: 'cast' }), 250, 1600, 0.8), null, ';animation-iteration-count:infinite')}
    ${go(18.6, 0.6, [700, -300], mv(17.2, 1.2, [200, 600], put(an('wob', 17.2, wagon(0.8), [0, 0], ';animation-iteration-count:infinite'), 640, 1100, 1)), 'cubic-bezier(.6,0,.9,.5)', 25)}
    ${put(robotG(1.2), 900, 1250, 0.4)}
    ${particles(36, ECHO, [-100, 1180], [800, 1700], [0, -500], [3, 8], [1, 2])}
    ${vis(18.6, 19.5, streaks(26, ECHO, [300, 1500], 900, [3, 6], [0.15, 0.3], -15))}`, [540, 1100]))}
  ${vis(15.5, 17.2, onom(560, 420, 'BZZRAK !!', 140, -8, VOLTA, INK, 15.7))}
  ${bubbleFor(4, 600, 520, ['Attention,', 'ça passe !'], [-120, 90])}
  ${vis(18.9, 19.5, onom(700, 1300, 'VLAM !', 130, 6, ECHO, INK, 19.05))}
  ${flashAt(15.7)}
`);
sfx('zap', 15.5); sfx('boom', 15.7); sfx('tk', 17.2); sfx('train', 17.3); sfx('whoosh', 18.6); sfx('bigboom', 19.05);

// 6 · Les illusions (19,5 – 23 s) : cinq Mirage, les robots tirent dans le vide et buggent
const copies = [[160, 0.62], [350, 0.7], [540, 0.78], [730, 0.7], [920, 0.62]];
scene(19.5, 23, cam(19.5, 23, [[19.5, -120, 0, 0, 1.15], [21.2, 120, 0, 0, 1.15], [23, 0, -40, 0, 1.0]], `
  ${BG('#06140c')}
  ${radial(540, 1200, 170, '#0d3a20', [320, 560])}
  ${GROUND(1620, '#04080a')}
  ${copies.map(([x, s], i) => an('pop', 19.6 + i * 0.12, i === 3 ? put(figure('mirage', 'hips', { anim: 'idle', glow: true }), x, 1620, s, -1)
    : ghost(put(figure('mirage', ['hips', 'cast', 'stand', 'hips', 'float'][i], { anim: 'idle', glow: true, float: i === 4 }), x, 1620, s, i % 2 ? -1 : 1), 0.3, 0.75))).join('')}
  ${vis(20.6, 23, `<g class="flick1">${[160, 350, 540, 920].map((x, i) => `<path d="M${i % 2 ? 1300 : -200} ${300 + i * 90} L${x} ${1300 - i * 30}" stroke="${RED}" stroke-width="9" filter="url(#glow)"/>`).join('')}</g>
    ${[160, 350, 540, 920].map((x, i) => an('impact', 20.7 + i * 0.1, burst(x, 1300 - i * 30, 30, 110, 10, '#fff', RED), [x, 1300 - i * 30])).join('')}`)}
  ${particles(50, MIRAGE, [0, W], [600, 1700], [0, -300], [2, 5], [1, 2.2])}
`, [540, 1200]) + `
  ${bubbleFor(5, 560, 520, ['Devinez laquelle !'], [170, 120])}
  ${vis(21.8, 23, an('blink', 21.8, `<rect x="210" y="236" width="660" height="80" fill="${INK}" stroke="${RED}" stroke-width="5"/><text x="540" y="290" class="rt" style="font-size:40px" fill="${RED}">ERREUR · CIBLE ×5</text>`, null, ';animation-iteration-count:infinite'))}
`);
sfx('shimmer', 19.6); sfx('laser', 20.6); sfx('glitch', 21.8);

// 7 · Attaque combinée (23 – 27 s) : Givre gèle les pieds, Volta enchaîne la foudre, explosion
scene(23, 27, shakeAt(25.1, cam(23, 27, [[23, 0, 0, 0, 1.05], [24.9, 0, -30, -2, 1.2, 'ease-in'], [25.2, 0, 0, 0, 1.3], [27, 0, 0, 1, 1.05, 'ease-out']], `
  ${BG(PAPER)}
  ${radial(540, 1000, 170, INK, [300, 520])}
  ${GROUND(1500)}
  ${[230, 540, 850].map((x, i) => put(robotG(1.5), x, 1500 - 700 * 0.38, 0.38)).join('')}
  ${vis(23, 24.7, mv(23, 0.5, [-300, 0], put(figure('givre', 'slam', { glow: true, anim: 'cast' }), 260, 1180, 0.75)))}
  ${vis(23, 24.7, aura(330, 1180, GIVRE, 2, 60, 23.1))}
  ${an('rise', 23.2, [230, 540, 850].map((x) => `${crystal(x - 60, 1505, 120, 200, -10)}${crystal(x + 60, 1505, 120, 180, 10)}`).join(''))}
  <path d="M-700 1505 L1780 1505" stroke="${GIVRE}" stroke-width="14" filter="url(#glow)" pathLength="1" class="draw" style="animation-delay:23.1s"/>
  ${vis(24.6, 27, `${bolt(540, -200, 540, 1200, VOLTA, 24, 12, 60, 24.6)}${bolt(540, 1200, 230, 1250, VOLTA, 14, 7, 30, 24.7)}${bolt(540, 1200, 850, 1250, VOLTA, 14, 7, 30, 24.75)}`)}
  ${vis(25.1, 27, `${[230, 540, 850].map((x) => an('impact', 25.1, an('spinS', 25.1, burst(x, 1240, 70, 230, 12, '#fff', VOLTA), [x, 1240]), [x, 1240])).join('')}
    ${an('drift', 25.2, smoke(540, 1400, 14, 560, '#5d5d68', 0.9))}
    ${particles(50, VOLTA, [100, 980], [1100, 1400], [0, -900], [3, 9], [0.8, 1.6])}`)}
`, [540, 1100]), 4) + `
  ${bubbleFor(6, 540, 420, ['Maintenant, Volta !'], [0, 90])}
  ${vis(25.1, 27, onom(540, 760, 'KRA-KOOOM !!', 130, -5, VOLTA, INK, 25.15))}
  ${flashAt(25.1)}
`);
sfx('freeze', 23.1); sfx('charge', 23.6); sfx('zap', 24.6); sfx('bigboom', 25.1);

// 8 · Face à face (27 – 31 s) : Écho tend la main, Mirage recule
scene(27, 31, cam(27, 31, [[27, 0, 60, 0, 1.25], [29.1, 0, 0, 0, 1.08], [29.3, 0, 0, 0, 1.08], [31, 120, -20, 1, 1.16]], `
  ${tunnel('#22222e')}
  ${an('drift', 27, smoke(540, 1500, 10, 600, '#3a3a44', 0.8))}
  ${particles(40, '#8a8578', [-200, 1200], [600, 1700], [300, -60], [2, 5], [1.5, 3], 0.6)}
  ${put(figure('givre', 'stand', { anim: 'idle' }), 170, 1560, 0.62)}
  ${put(figure('volta', 'hips', { anim: 'idle' }), 350, 1580, 0.66)}
  ${mv(27.3, 1.2, [-60, 0], put(figure('echo', 'cast', { anim: 'idle', float: true }), 560, 1560, 0.72))}
  ${go(29.2, 1.5, [80, 0], put(figure('mirage', 'stand', { anim: 'idle', glow: true }), 860, 1560, 0.74, -1), 'ease-out')}
`, [700, 1300]) + `
  ${bubbleFor(7, 450, 520, ['On est comme toi,', 'tu sais.'], [60, 100])}
  ${bubbleFor(8, 560, 480, ["Je n'ai confiance", 'en personne.'], [240, 120])}
`);
sfx('wind', 27.0);

// 9 · Disparition (31 – 34,5 s) : Mirage s'efface près du robot à terre, le badge Ω s'envole tout seul
const mH = hand('castUp', 'ra', 330, 1500, 0.8);
scene(31, 34.5, cam(31, 34.5, [[31, 0, 0, 0, 1.0], [32.4, 0, -20, 0, 1.06], [34.5, -40, 60, -2, 1.18]], `
  ${tunnel('#1c1c26')}
  ${an('drift', 31, smoke(560, 1500, 8, 500, '#2e2e38', 0.8))}
  ${put(robotG(0.2), 640, 1560, 0.5, 1, 78)}
  <g class="flick1">${cracks(640, 1380, 5, 140, RED, 4)}</g>
  ${vis(31, 32.3, fadeOut(31.4, 0.9, put(figure('mirage', 'stand', { anim: 'idle', glow: true }), 840, 1540, 0.72, -1)))}
  ${vis(31.3, 32.6, particles(40, MIRAGE, [720, 960], [1080, 1540], [0, -300], [3, 7], [0.5, 1.2]))}
  ${an('pop', 31.7, go(32.3, 2.0, [-300, -820], `<g transform="translate(640 1300)">${an('spinS', 32.3, badge(0.9), [0, 0])}</g>`, 'cubic-bezier(.4,0,.6,1)'))}
  ${vis(32.3, 34.5, ghost(`<path d="M640 1300 Q560 900 340 480" fill="none" stroke="${MIRAGE}" stroke-width="6" stroke-dasharray="12 16" class="flow"/>`, 0.2, 0.7))}
  ${an('shakeS', 32.6, put(figure('volta', 'hips', { anim: 'fight', shout: true }), 230, 1540, 0.74), null, ';animation-iteration-count:3')}
`, [560, 1200]) + `
  ${onom(820, 1000, 'FWIP', 100, 8, MIRAGE, INK, 31.4)}
  ${bubbleFor(9, 330, 640, ['Elle a disparu !'], [-60, 100])}
`);
sfx('invis', 31.3); sfx('whoosh', 32.3);

// 10 · Le badge s'allume + carton final (34,5 – 40 s) : Mirage sur un toit lève le badge, la Tour OMEGA au loin
scene(34.5, 40, cam(34.5, 40, [[34.5, -60, 120, 0, 1.25], [36.6, 0, 0, 0, 1.0, 'ease-out'], [40, 0, -30, 0, 1.06]], `
  ${BG(NIGHT)}<rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="url(#toneP)" opacity=".12"/>
  ${an('pulse', 34.5, `<circle cx="760" cy="760" r="700" fill="url(#rglow)"/>`, [760, 760], ';animation-iteration-count:infinite')}
  ${an('parx', 34.5, city(1500, '#07070b', RED))}
  ${tower(760, 1520, 0.6)}
  ${particles(40, PAPER, [-200, 1200], [0, 1500], [-160, 260], [2, 4], [2, 4], 0.35)}
  ${GROUND(1500, '#050508')}
  <path d="M-700 1500 L1780 1500" stroke="${MIRAGE}" stroke-width="4" opacity=".5"/>
  ${put(figure('mirage', 'castUp', { anim: 'idle', glow: true }), 330, 1500, 0.8)}
  <g transform="translate(${f(mH[0])} ${f(mH[1] - 40)})">${an('spinS', 34.5, badge(0.55), [0, 0])}</g>
  ${vis(34.9, 36.85, `<polygon points="${f(mH[0])},${f(mH[1] - 70)} 90,640 520,640" fill="${RED}" opacity=".18"/>`)}
`, [540, 1300]) + `
  ${vis(34.9, 36.85, an('pop', 34.9, holo(90, 280, 430, 360, `<text x="305" y="370" class="rt" style="font-size:40px">CIBLE :</text><text x="305" y="430" class="rt" style="font-size:42px">TOUR OMEGA</text>${put(`<path d="M-30 0 L-20 -120 L-6 -150 L6 -150 L20 -120 L30 0Z" fill="${RED}"/>`, 305, 610, 1)}`)))}
  ${bubbleFor(10, 640, 820, ['La Tour OMEGA…'], [-120, 100])}
  ${finalCard(36.9, 'ÉPISODE 3 BIENTÔT')}
`);
sfx('holo', 34.9); sfx('eye', 36.9); sfx('hit', 37.0);

L.build(import.meta.url, 'les-anomalies-ep2');
