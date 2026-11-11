// « LES ANOMALIES » ép. 9 · Évasion : manga d'action, 40 s, 1080x1920 (Reel).
// Dans le laboratoire de la Tour OMEGA, Givre gèle le Dr Kessler dans un bloc de glace ; Volta brise la cage
// d'énergie d'Écho. La Tour passe en alerte, course-poursuite dans les escaliers… Kessler se libère et,
// tandis que le sol tremble, ordonne : « Activez… le Colosse. »
// Usage : node make.mjs → les-anomalies-ep9.svg + timeline.json (lu par audio.py)
import * as L from '../les-anomalies/lib.mjs';
const { W, H, PAPER, INK, RED, VOLTA, GIVRE, ECHO, MIRAGE, ORANGE, rnd, f, vis, scene, an, radial, burst, cracks, bolt, onom, panel,
  bubbleFor, figure, hand, put, bigEyes, robotG, aura, crystal, smoke, BG, GROUND, cam, particles, streaks, shakeAt,
  flashAt, sfx, mv, go, anim, fadeIn, fadeOut, ghost, bobbing, tube, header, hook, finalCard } = L;
L.reseed(909);

const LINES = [
  { who: 'kessler', t0: 1.3, t1: 3.1, text: "Tu m'as manqué, Sujet 2." },
  { who: 'givre', t0: 4.4, t1: 6.1, text: 'Je ne suis pas un numéro.' },
  { who: 'volta', t0: 10.0, t1: 11.3, text: 'Un vrai glaçon !' },
  { who: 'echo', t0: 12.4, t1: 13.7, text: 'Volta, au secours !' },
  { who: 'volta', t0: 15.6, t1: 16.8, text: 'Recule, Écho !' },
  { who: 'robot', t0: 19.9, t1: 21.7, text: 'Alerte. Évasion en cours.' },
  { who: 'mirage', t0: 23.4, t1: 24.8, text: "Par l'escalier, vite !" },
  { who: 'echo', t0: 27.4, t1: 28.7, text: 'Je les arrête !' },
  { who: 'volta', t0: 29.5, t1: 30.8, text: 'Plus que dix étages !' },
  { who: 'kessler', t0: 32.8, t1: 34.4, text: 'Fermez toutes les issues.' },
  { who: 'kessler', t0: 34.9, t1: 36.7, text: 'Activez… le Colosse.' },
];
L.setLines(LINES);

// ---------- Décors et accessoires propres à l'épisode ----------
const TUBES = ['#ff5fa2', ORANGE, '#5fffd0', GIVRE, '#ff5fa2', MIRAGE, '#ffe066', ECHO];
// laboratoire : rangée de cuves, passerelle, sol carrelé
const lab = (dim = 0.55) => `${BG('#0a0a12')}
  <rect x="-700" y="300" width="${W + 1400}" height="30" fill="#1e1e2a"/><rect x="-700" y="330" width="${W + 1400}" height="8" fill="${RED}" opacity=".5"/>
  ${TUBES.map((c, i) => tube(-420 + i * 260, 1330, c, 0.82)).join('')}
  <rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="#05050a" opacity="${dim}"/>
  ${GROUND(1330, '#101018')}
  ${Array.from({ length: 13 }, (_, i) => `<path d="M${540 + (i - 6) * 140} 1330 L${540 + (i - 6) * 520} 2400" stroke="#262634" stroke-width="5"/>`).join('')}
  ${[1400, 1500, 1640, 1820].map((y) => `<path d="M-700 ${y} L1780 ${y}" stroke="#262634" stroke-width="5"/>`).join('')}
  <path d="M-700 1330 L1780 1330" stroke="${GIVRE}" stroke-width="4" opacity=".35"/>`;
// bloc de glace (base yb), à dessiner par-dessus le personnage figé
const iceBlock = (x, yb, w, h) => `
  <polygon points="${x - w / 2},${yb} ${x - w / 2 - 24},${yb - h * 0.55} ${x - w / 2 + 30},${yb - h} ${x + 20},${yb - h - 40} ${x + w / 2 - 10},${yb - h + 10} ${x + w / 2 + 26},${yb - h * 0.45} ${x + w / 2},${yb}" fill="#c8f1ff" opacity=".5" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
  <polygon points="${x + 20},${yb - h - 40} ${x + w / 2 - 10},${yb - h + 10} ${x + w / 2 + 26},${yb - h * 0.45} ${x + w / 2},${yb} ${x + w * 0.15},${yb}" fill="${GIVRE}" opacity=".35"/>
  <path d="M${x - w / 2 + 30} ${yb - h} L${x - w * 0.1} ${yb - h * 0.4} L${x + w * 0.15} ${yb} M${x + 20} ${yb - h - 40} L${x - w * 0.1} ${yb - h * 0.4}" stroke="#fff" stroke-width="5" fill="none" opacity=".7"/>
  <path d="M${x - w / 2 + 40} ${yb - h * 0.8} L${x - w / 2 + 60} ${yb - h * 0.2}" stroke="#fff" stroke-width="14" opacity=".45" stroke-linecap="round"/>`;
// cage d'énergie : deux émetteurs et des barreaux électriques rouges
const cage = (x, yTop, yBot, w, delay = 0) => `
  ${[-0.5, -0.25, 0, 0.25, 0.5].map((k) => bolt(x + k * w, yTop + 20, x + k * w, yBot - 20, RED, 7, 8, 12, delay)).join('')}
  <ellipse cx="${x}" cy="${yTop}" rx="${w / 2 + 50}" ry="40" fill="${INK}" stroke="${RED}" stroke-width="8" filter="url(#glow)"/>
  <ellipse cx="${x}" cy="${yBot}" rx="${w / 2 + 50}" ry="40" fill="${INK}" stroke="${RED}" stroke-width="8" filter="url(#glow)"/>`;
const generator = (x, yb) => `<rect x="${x - 90}" y="${yb - 300}" width="180" height="300" fill="#1a1a24" stroke="${PAPER}" stroke-width="5"/>
  <path d="M${x - 30} ${yb - 150} L${x - 12} ${yb - 150} L${x - 12} ${yb - 162} A32 32 0 1 1 ${x + 12} ${yb - 162} L${x + 12} ${yb - 150} L${x + 30} ${yb - 150}" fill="none" stroke="${RED}" stroke-width="8" filter="url(#glow)"/>
  <g class="flick1">${[0, 1, 2].map((i) => `<circle cx="${x - 40 + i * 40}" cy="${yb - 250}" r="10" fill="${RED}"/>`).join('')}</g>`;
// gyrophare rouge qui balaie
const siren = (x, y, d = 0) => `${an('swayL', d, `<polygon points="${x},${y} ${x - 260},${y + 1400} ${x + 260},${y + 1400}" fill="${RED}" opacity=".16"/>`, [x, y], ';animation-duration:.9s;animation-iteration-count:infinite;animation-direction:alternate')}
  <rect x="${x - 34}" y="${y - 30}" width="68" height="40" rx="10" fill="${RED}" class="flick1" filter="url(#glow)"/>`;
const redPulse = (op = 0.22) => anim(0, 0.45, [`from{opacity:0}`, `to{opacity:${op}}`], `<rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="${RED}"/>`, { iter: 'infinite', dir: 'alternate' });
const redEyes = (x, y, s, t) => an('eyeOpen', t, `<ellipse cx="${x}" cy="${y}" rx="${46 * s}" ry="${14 * s}" fill="${RED}" filter="url(#glow)"/><ellipse cx="${x}" cy="${y}" rx="${16 * s}" ry="${6 * s}" fill="#fff"/>`, [x, y]);
// escalier qui descend vers la droite : marches, rampe, pente SL
const SL = 0.58, SX0 = -500, SY0 = 640;
const sy = (x) => SY0 + (x - SX0) * SL;
const stairs = (edge = PAPER) => {
  let d = `M${SX0} ${SY0}`;
  for (let x = SX0; x < 1700; x += 100) d += ` L${x + 100} ${f(sy(x))} L${x + 100} ${f(sy(x + 100))}`;
  const posts = Array.from({ length: 12 }, (_, i) => { const x = SX0 + 60 + i * 200; return `<path d="M${x} ${f(sy(x) - 6)} L${x} ${f(sy(x) - 170)}" stroke="${edge}" stroke-width="6" opacity=".7"/>`; }).join('');
  return `<path d="${d} L1700 3200 L${SX0} 3200Z" fill="#1b1b26" stroke="${edge}" stroke-width="5" stroke-linejoin="round"/>
    <path d="${d} L1700 3200 L${SX0} 3200Z" fill="url(#tone)" opacity=".25"/>
    ${posts}<path d="M${SX0} ${SY0 - 170} L1700 ${f(sy(1700) - 170)}" stroke="${edge}" stroke-width="10" opacity=".8"/>`;
};
const shaft = () => `${BG('#0b0b13')}
  ${[-300, 300, 900].map((x) => `<rect x="${x}" y="-1000" width="40" height="4000" fill="#14141e"/>`).join('')}
  <g opacity=".35" transform="translate(1100 -260) scale(-0.6 0.6)">${stairs('#5a5a68')}</g>
  ${siren(140, 130)}${siren(860, 90, 0.4)}`;
const slab = (w, h) => `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#3a3a46" stroke="${INK}" stroke-width="6"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="url(#toneL)" opacity=".35"/>
  <path d="M${-w / 2 + 20} ${-h / 2 + 18} L${w / 2 - 30} ${-h / 2 + 18}" stroke="${PAPER}" stroke-width="3" opacity=".5"/>`;
const shards = (cx, cy, t, n = 14) => Array.from({ length: n }, (_, i) => {
  const a = (i / n) * Math.PI * 2 + rnd(-0.2, 0.2), d = rnd(380, 820), s = rnd(30, 70);
  return an('chunk', t, `<polygon points="${cx},${f(cy - s)} ${f(cx + s * 0.7)},${cy} ${cx},${f(cy + s * 0.8)} ${f(cx - s * 0.6)},${cy}" fill="#c8f1ff" stroke="${INK}" stroke-width="4"/>`, [cx, cy],
    `;--cx:${f(Math.cos(a) * d)}px;--cy:${f(Math.sin(a) * d * 0.8 + 200)}px;--cr:${f(rnd(-200, 200))}deg`);
}).join('');

// =====================================================================
// 1 · Bon retour (0 – 4 s) : la caméra glisse le long des cuves ; Kessler sort de l'ombre derrière le trio
scene(0, 4, cam(0, 4, [[0, -120, 0, 0, 1.12], [4, 80, -30, 1, 1.2]], `
  ${lab()}
  ${particles(30, '#8fd8ff', [-300, 1300], [300, 1400], [0, -260], [2, 4], [1.5, 3], 0.5)}
  ${an('pulse', 0.6, `<circle cx="850" cy="1150" r="520" fill="url(#rglow)"/>`, [850, 1150], ';animation-iteration-count:infinite')}
  ${fadeIn(0.5, 0.9, mv(0.5, 1.4, [80, 0], put(figure('kessler', 'hips', { anim: 'idle' }), 850, 1600, 0.82, -1)))}
  ${put(figure('volta', 'stand', { anim: 'idle' }), 150, 1610, 0.6, -1)}
  ${put(figure('mirage', 'stand', { anim: 'idle' }), 320, 1600, 0.58, -1)}
  ${vis(0, 1.6, put(figure('givre', 'stand', { anim: 'idle' }), 500, 1620, 0.64, -1))}
  ${vis(1.6, 4, an('shakeS', 1.6, put(figure('givre', 'guard', { anim: 'fight', glow: true }), 500, 1620, 0.64)))}
`, [540, 1100]) + `
  ${header(9, 'Évasion')}
  ${an('pop', 0.3, `<rect x="150" y="752" width="780" height="70" rx="8" fill="${INK}" opacity=".7"/>`)}
  ${hook('Pris au piège dans la Tour OMEGA.', 0.3, 800)}
  ${bubbleFor(0, 600, 470, ["Tu m'as manqué,", 'Sujet 2.'], [200, 100])}
`);
sfx('hit', 0.05); sfx('drone', 0.2); sfx('step', 0.7); sfx('step', 1.2); sfx('heart', 1.6);

// 2 · La colère de Givre (4 – 8 s) : gros plan sur ses yeux, puis le froid se lève autour de lui
scene(4, 8, `
  ${vis(4, 5.7, cam(4, 5.7, [[4, 0, 30, -1, 1.0], [5.7, 0, -20, 1, 1.08]], `
    ${BG(INK)}
    ${an('inL', 4.0, panel('g1', 40, 600, 1000, 640, an('zoomP', 4.0, `
      ${radial(540, 900, 120, '#bfe9ff', [380, 520])}
      ${an('grow', 4.2, `${crystal(110, 1240, 130, 280, -20)}${crystal(220, 1240, 90, 170, 10)}`, [150, 1240])}
      ${an('grow', 4.35, `${crystal(970, 1240, 130, 300, 20)}${crystal(860, 1240, 80, 160, -10)}`, [930, 1240])}
      ${particles(26, '#9fdcff', [60, 1020], [620, 1220], [60, 160], [2, 5], [1.2, 2.4])}
      ${bigEyes(540, 930, 'givre')}`, [540, 900])))}
  `, [540, 920]))}
  ${vis(5.7, 8, cam(5.7, 8, [[5.7, 0, 0, 0, 1.25], [6.3, 0, 0, 0, 1.05, 'ease-out'], [8, -40, -20, -2, 1.14]], `
    ${BG('#06121c')}
    ${radial(330, 1100, 150, '#123a52', [300, 520])}
    ${GROUND(1620, '#050a10')}
    ${aura(560, 1150, GIVRE, 3, 90, 5.7)}
    ${put(figure('givre', 'cast', { anim: 'cast', glow: true }), 300, 1620, 0.95)}
    ${streaks(22, '#c8f1ff', [900, 1500], 900, [3, 6], [0.3, 0.6], -6)}
    ${particles(50, '#c8f1ff', [200, 1100], [800, 1600], [400, -100], [3, 8], [0.6, 1.4])}
    ${an('rise', 6.0, `${crystal(160, 1620, 120, 200, -10)}${crystal(440, 1620, 100, 150, 12)}${crystal(700, 1620, 140, 230, -6)}${crystal(960, 1620, 120, 190, 10)}`)}`, [400, 1200]))}
`+ `
  ${bubbleFor(1, 540, 440, ['Je ne suis pas', 'un numéro.'], [-120, 100])}
`);
sfx('ice', 4.2); sfx('eye', 4.0); sfx('charge', 5.7); sfx('iceWall', 6.0);

// 3 · Le glaçon (8 – 12 s) : un rayon de glace fige Kessler ; la caméra recule et révèle Volta, hilare
scene(8, 12, shakeAt(8.8, cam(8, 12, [[8, 0, 120, 0, 1.4], [8.8, 0, 100, 0, 1.36], [9.8, 0, 0, 0, 1.0, 'ease-out'], [12, 50, -30, 1.5, 1.08]], `
  ${lab(0.6)}
  ${vis(8, 8.8, `<g class="flick1"><polygon points="-300,1080 -300,1180 620,1250 620,1210" fill="${GIVRE}" filter="url(#glow)"/><polygon points="-300,1110 -300,1150 620,1236 620,1224" fill="#fff"/></g>`)}
  ${vis(8, 8.8, put(figure('kessler', 'point', { anim: 'idle' }), 640, 1600, 0.82, -1))}
  ${vis(8.8, 12, put(figure('kessler', 'guard', { anim: 'still', shout: true }), 640, 1600, 0.82, -1))}
  ${an('rise', 8.6, `${crystal(450, 1610, 150, 260, -16)}${crystal(840, 1610, 160, 300, 18)}${crystal(560, 1620, 110, 160, 6)}${crystal(740, 1620, 110, 170, -8)}`)}
  ${vis(8.8, 12, fadeIn(8.8, 0.35, iceBlock(640, 1610, 420, 640)))}
  ${vis(8.8, 12, `${an('impact', 8.8, burst(640, 1250, 60, 220, 12, '#fff', GIVRE), [640, 1250])}${particles(40, '#c8f1ff', [380, 900], [900, 1600], [0, -320], [3, 8], [0.6, 1.4])}`)}
  ${vis(9.6, 12, mv(9.6, 0.6, [-200, 0], put(figure('volta', 'hips', { anim: 'fight' }), 170, 1640, 0.68)))}
  ${vis(9.6, 12, put(figure('givre', 'stand', { anim: 'idle', glow: true }), 340, 1600, 0.6))}
  ${vis(9.6, 12, particles(16, VOLTA, [100, 260], [1100, 1300], [0, -200], [2, 5], [0.4, 0.9]))}
`, [640, 1250]), 2) + `
  ${onom(560, 760, 'KRIIIIC !', 130, -6, GIVRE, INK, 8.8)}
  ${bubbleFor(2, 420, 470, ['Un vrai glaçon !'], [-140, 100])}
  ${flashAt(8.8)}
`);
sfx('freeze', 8.1); sfx('iceWall', 8.6); sfx('glass', 8.8); sfx('ice', 9.2); sfx('whoosh', 9.6);

// 4 · La cage (12 – 15,5 s) : Écho flotte, prisonnière des barreaux électriques ; Volta déboule
scene(12, 15.5, cam(12, 15.5, [[12, 0, -60, 0, 1.25], [13.4, 0, 0, 0, 1.05, 'ease-out'], [15.5, -60, 30, 2, 1.12]], `
  ${BG('#0c0a14')}
  ${radial(560, 1120, 140, '#3a0d18', [320, 560])}
  ${GROUND(1560, '#08080e')}
  ${generator(920, 1560)}
  <path d="M830 1430 C760 1430 760 1540 690 1540" fill="none" stroke="${RED}" stroke-width="10" class="flick2"/>
  ${an('bob', 12, put(figure('echo', 'sad', { anim: 'idle', float: true }), 560, 1400, 0.72), null, ';animation-iteration-count:infinite')}
  ${cage(560, 760, 1540, 380, 12)}
  ${particles(26, RED, [340, 780], [800, 1500], [0, -200], [2, 5], [0.8, 1.6])}
  ${vis(13.6, 15.5, mv(13.6, 0.5, [-500, 0], put(figure('volta', 'run', { anim: 'fight', glow: true }), 150, 1580, 0.7), 'ease-out'))}
  ${vis(14.0, 15.5, streaks(14, VOLTA, [1100, 1500], -500, [3, 6], [0.2, 0.4]))}
`, [560, 1150]) + `
  ${bubbleFor(3, 540, 450, ['Volta, au secours !'], [40, 100])}
`);
sfx('electric', 12.0); sfx('beep', 12.4); sfx('step', 13.7); sfx('step', 14.0); sfx('whoosh', 13.6);

// 5 · Foudre sur la cage (15,5 – 19,5 s) : Volta se charge, frappe le générateur, la cage explose, Écho est libre
scene(15.5, 19.5, `
  ${vis(15.5, 17.0, cam(15.5, 17.0, [[15.5, 0, 0, 0, 1.25], [16.1, 0, 0, 0, 1.06, 'ease-out'], [17, 30, -20, -2, 1.14]], `
    ${BG(INK)}
    ${radial(320, 1080, 160, '#3a3410', [260, 480])}
    ${an('pulse', 15.5, `<circle cx="320" cy="1100" r="520" fill="url(#vglow)"/>`, [320, 1100], ';animation-iteration-count:infinite')}
    ${GROUND(1640, '#07070b')}
    ${put(figure('volta', 'charge', { anim: 'charge', glow: true }), 320, 1640, 1.0)}
    ${bolt(140, 900, 80, 600, VOLTA, 10, 7, 30, 15.5)}${bolt(500, 900, 600, 620, VOLTA, 10, 7, 30, 15.6)}${bolt(320, 760, 340, 520, VOLTA, 8, 6, 26, 15.7)}
    ${particles(50, VOLTA, [100, 560], [700, 1640], [0, -500], [3, 8], [0.5, 1.1])}
    ${aura(320, 1300, VOLTA, 3, 160, 15.5)}`, [320, 1150]))}
  ${vis(17.0, 19.5, shakeAt(17.1, cam(17.0, 19.5, [[17.0, 0, 0, 0, 1.0], [17.1, 0, 0, 0, 1.08, 'ease-in'], [19.5, -40, -40, 1, 1.12]], `
    ${BG('#0c0a14')}
    ${GROUND(1560, '#08080e')}
    ${vis(17.0, 17.15, `${generator(920, 1560)}${cage(560, 760, 1540, 380, 17)}`)}
    ${vis(17.1, 19.5, `<g transform="rotate(14 920 1560)">${generator(920, 1560)}</g>${cracks(920, 1360, 7, 200, VOLTA, 5)}
      <ellipse cx="560" cy="1540" rx="240" ry="40" fill="${INK}" stroke="${RED}" stroke-width="6" opacity=".7"/>`)}
    ${bolt(-100, 1100, 900, 1380, VOLTA, 20, 11, 50, 17.0)}
    ${vis(17.1, 19.5, `${an('impact', 17.1, an('spinS', 17.1, burst(900, 1380, 80, 300, 14, '#fff', VOLTA), [900, 1380]), [900, 1380])}
      ${an('drift', 17.2, smoke(860, 1450, 10, 260, '#4a4a56', 0.85))}
      ${particles(40, VOLTA, [600, 1080], [1100, 1500], [-200, -700], [3, 9], [0.6, 1.2])}`)}
    ${vis(17.0, 17.6, put(figure('echo', 'sad', { anim: 'idle', float: true }), 560, 1400, 0.72))}
    ${vis(17.6, 19.5, mv(17.6, 0.9, [0, 160], `${aura(560, 1100, ECHO, 3, 120, 17.6)}${put(figure('echo', 'float', { anim: 'cast', float: true, glow: true }), 560, 1400, 0.72)}${particles(30, ECHO, [380, 740], [800, 1450], [0, -300], [3, 7], [0.8, 1.6])}`))}
    ${vis(18.2, 19.5, mv(18.2, 0.5, [-400, 0], put(figure('volta', 'hips', { anim: 'fight', glow: true }), 210, 1580, 0.66)))}`, [600, 1200]), 2))}
  ${bubbleFor(4, 600, 440, ['Recule, Écho !'], [-160, 100])}
  ${vis(17.1, 19.5, onom(560, 600, 'BZZRAKK !!', 140, -7, VOLTA, INK, 17.1))}
  ${flashAt(17.1)}
`);
sfx('charge', 15.5); sfx('electric', 15.8); sfx('zap', 17.0); sfx('bigboom', 17.1); sfx('powerdown', 17.3); sfx('tk', 17.6);

// 6 · Alerte (19,5 – 23 s) : gyrophares, la Tour s'allume en rouge, les yeux des Traqueurs s'ouvrent au fond
scene(19.5, 23, shakeAt(19.6, cam(19.5, 23, [[19.5, 0, 0, 0, 1.0], [23, 0, -40, 0, 1.16]], `
  ${BG('#0d0a10')}
  ${Array.from({ length: 6 }, (_, i) => { const k = Math.pow(0.7, i), w = 1500 * k, h = 1500 * k; return `<rect x="${f(540 - w / 2)}" y="${f(900 - h * 0.55)}" width="${f(w)}" height="${f(h)}" fill="none" stroke="#2a2030" stroke-width="${f(24 * k + 3)}"/>`; }).join('')}
  ${an('hover', 19.5, `${put(`<g opacity=".85">${robotG(0.6)}</g>`, 380, 880, 0.22)}${put(`<g opacity=".85">${robotG(0.6)}</g>`, 700, 880, 0.22)}${put(`<g opacity=".9">${robotG(0.8)}</g>`, 540, 900, 0.28)}`, null, ';animation-iteration-count:infinite')}
  <rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="#05050a" opacity=".5"/>
  ${redEyes(380, 880 - 442 * 0.22, 0.22, 20.4)}${redEyes(700, 880 - 442 * 0.22, 0.22, 20.7)}${redEyes(540, 900 - 442 * 0.28, 0.28, 21.0)}
  ${GROUND(1600, '#09070c')}
  ${siren(120, 60)}${siren(960, 60, 0.45)}
  ${redPulse(0.2)}
  ${put(figure('volta', 'guard', { anim: 'fight', glow: true }), 250, 1610, 0.58)}
  ${put(figure('echo', 'stand', { anim: 'idle', float: true }), 430, 1590, 0.56)}
  ${put(figure('givre', 'guard', { anim: 'fight' }), 640, 1610, 0.58, -1)}
  ${fadeIn(21.4, 0.5, put(figure('mirage', 'hips', { anim: 'idle', glow: true }), 840, 1610, 0.58, -1))}
  ${vis(21.4, 23, particles(30, MIRAGE, [740, 940], [1200, 1610], [0, -260], [3, 6], [0.5, 1.2]))}
  ${particles(26, RED, [0, W], [500, 1700], [0, -300], [2, 4], [1, 2], 0.6)}
`, [540, 1000]), 2, 'shakeS') + `
  ${an('pop', 19.6, an('blink', 19.7, `<rect x="190" y="236" width="700" height="78" fill="${INK}" stroke="${RED}" stroke-width="5"/><text x="540" y="290" class="rt" style="font-size:40px" fill="${RED}">ALERTE · NIVEAU 40</text>`, null, ';animation-iteration-count:infinite'))}
  ${bubbleFor(5, 540, 480, ['Alerte.', 'Évasion en cours.'], [0, 100])}
  ${onom(540, 1150, 'WOUUU · WOUUU', 72, -3, RED, INK, 19.6)}
`);
sfx('siren', 19.5); sfx('alarm', 19.7); sfx('lock', 20.4); sfx('lock', 20.7); sfx('lock', 21.0); sfx('invis', 21.4);

// 7 · Les escaliers (23 – 27 s) : l'équipe dévale, deux Traqueurs surgissent en haut et tirent ; Volta riposte
const team7 = `
  ${put(figure('mirage', 'run', { anim: 'fight', glow: true }), 760, f(sy(760)), 0.5)}
  ${put(figure('echo', 'float', { anim: 'cast', float: true }), 600, f(sy(600) - 40), 0.5)}
  ${put(figure('givre', 'run', { anim: 'fight' }), 440, f(sy(440)), 0.5)}
  ${vis(23, 25.5, put(figure('volta', 'run', { anim: 'fight' }), 280, f(sy(280)), 0.52))}
  ${vis(25.5, 27, put(figure('volta', 'throw', { anim: 'fight', glow: true }), 280, f(sy(280)), 0.52, -1))}`;
const vH = hand('throw', 'ra', 280, sy(280), 0.52, -1);
scene(23, 27, cam(23, 27, [[23, 40, 60, 0, 1.08], [27, -140, -60, 1.5, 1.14]], `
  ${shaft()}
  ${stairs()}
  ${go(23, 4, [200, 200 * SL], `${team7}${particles(20, '#8a8578', [200, 900], [1000, 1500], [-200, -60], [2, 5], [0.6, 1.2], 0.7)}`, 'linear')}
  ${vis(23.8, 27, mv(23.8, 0.9, [-300, -174], `${put(robotG(1.5), 60, f(sy(60) - 230), 0.33)}${put(robotG(1.5), -140, f(sy(-140) - 230), 0.33)}`))}
  ${vis(24.7, 25.3, `<g class="flick1"><path d="M60 ${f(sy(60) - 230 - 146)} L330 ${f(sy(330) + 40)}" stroke="${RED}" stroke-width="10" filter="url(#glow)"/><path d="M-140 ${f(sy(-140) - 230 - 146)} L520 ${f(sy(520) + 30)}" stroke="${RED}" stroke-width="10" filter="url(#glow)"/></g>
    ${an('impact', 24.75, burst(360, sy(360) + 20, 30, 110, 10, '#fff', RED), [360, sy(360)])}${an('impact', 24.85, burst(540, sy(540) + 20, 30, 110, 10, '#fff', RED), [540, sy(540)])}`)}
  ${vis(25.6, 27, `${bolt(f(vH[0] + 115), f(vH[1] + 67), 60, f(sy(60) - 230), VOLTA, 14, 9, 40, 25.6)}
    ${an('impact', 25.75, burst(60, sy(60) - 230, 60, 220, 12, '#fff', VOLTA), [60, sy(60) - 230])}`)}
  ${streaks(16, '#5a5a68', [400, 1700], 300, [2, 4], [0.4, 0.7], 30)}
`, [400, 1100]) + `
  ${bubbleFor(6, 620, 430, ["Par l'escalier, vite !"], [80, 100])}
  ${onom(560, 760, 'ZIOU ZIOU', 80, -10, RED, INK, 24.7)}
  ${vis(25.7, 27, onom(380, 520, 'BZZT !', 120, 8, VOLTA, INK, 25.7))}
`);
sfx('step', 23.1); sfx('step', 23.4); sfx('step', 23.7); sfx('land', 23.9); sfx('laser', 24.7); sfx('laser', 24.85);
sfx('zap', 25.6); sfx('boom', 25.75); sfx('step', 26.2); sfx('step', 26.5);

// 8 · Éboulement et glissade (27 – 31 s) : Écho fait tomber des dalles sur les robots ; Givre gèle la rampe, tout le monde glisse
const eH = hand('cast', 'ra', 640, sy(640), 0.78, -1);
scene(27, 31, `
  ${vis(27, 29.2, shakeAt(28.35, cam(27, 29.2, [[27, 0, 0, 0, 1.0], [28.3, -20, 10, -1, 1.06], [29.2, 0, 0, 1, 1.1]], `
    ${shaft()}
    ${stairs()}
    ${vis(27, 28.4, `${put(robotG(1.2), -60, f(sy(-60) - 230), 0.33)}${put(robotG(1.2), 140, f(sy(140) - 230), 0.33)}`)}
    ${aura(f(eH[0]), f(eH[1]), ECHO, 3, 60, 27)}
    ${put(figure('echo', 'cast', { anim: 'cast', float: true, glow: true }), 640, f(sy(640) - 30), 0.78, -1)}
    ${go(28.3, 0.3, [0, 360], anim(27.1, 1.0, ['from{transform:translate(0,520px)}', 'to{transform:translate(0,0)}'], `
      <g>${an('wob', 27.2, `<g transform="translate(-40 500)">${slab(240, 110)}</g>`, [-40, 500], ';animation-iteration-count:infinite')}</g>
      <g transform="translate(160 600) rotate(-12)">${slab(200, 90)}</g>
      <g transform="translate(-200 610) rotate(10)">${slab(220, 100)}</g>
      <g fill="none" stroke="${ECHO}" stroke-width="6" filter="url(#glow)" opacity=".8"><rect x="-340" y="420" width="600" height="260" rx="40"/></g>`, { ease: 'cubic-bezier(.2,.8,.3,1)' }), 'cubic-bezier(.6,0,1,.6)')}
    ${vis(28.65, 29.2, `${an('impact', 28.65, burst(0, 960, 80, 300, 12, '#fff', ECHO), [0, 960])}${an('drift', 28.65, smoke(0, 940, 12, 360, '#4a4a56', 0.9))}`)}
    ${particles(30, ECHO, [300, 900], [700, 1400], [0, -300], [3, 7], [0.8, 1.6])}`, [500, 1100]), 2))}
  ${vis(29.2, 31, cam(29.2, 31, [[29.2, 0, 0, 0, 1.06], [31, -60, -40, 2, 1.12]], `
    ${shaft()}
    ${stairs()}
    <path d="M${SX0} ${SY0 - 4} L1700 ${f(sy(1700) - 4)}" stroke="${GIVRE}" stroke-width="40" filter="url(#glow)" pathLength="1" class="draw" style="animation-delay:29.2s;animation-duration:.5s"/>
    <path d="M${SX0} ${SY0 - 4} L1700 ${f(sy(1700) - 4)}" stroke="#e8faff" stroke-width="14" pathLength="1" class="draw" style="animation-delay:29.2s;animation-duration:.5s"/>
    ${go(29.3, 1.7, [950, 950 * SL], `
      ${put(figure('givre', 'cast', { anim: 'cast', glow: true }), 0, f(sy(0) - 20), 0.5, 1, 18)}
      ${put(figure('volta', 'leap', { anim: 'fight', glow: true, shout: true }), -170, f(sy(-170) - 20), 0.5, 1, 22)}
      ${put(figure('mirage', 'guard', { anim: 'fight' }), -330, f(sy(-330) - 20), 0.48, 1, 20)}
      ${put(figure('echo', 'float', { anim: 'cast', float: true }), -480, f(sy(-480) - 60), 0.48, 1, 16)}
      ${particles(30, '#c8f1ff', [-520, 60], [sy(-500) - 60, sy(60)], [-400, -200], [3, 7], [0.3, 0.7])}`, 'cubic-bezier(.3,0,.8,1)')}
    ${streaks(26, '#c8f1ff', [500, 1700], 800, [3, 6], [0.2, 0.4], 30)}`, [540, 1100]))}
  ${bubbleFor(7, 600, 430, ['Je les arrête !'], [60, 100])}
  ${vis(28.65, 29.2, onom(300, 760, 'KRAAAK !', 120, -8, ECHO, INK, 28.65))}
  ${bubbleFor(8, 560, 420, ['Plus que dix étages !'], [-80, 100])}
  ${vis(29.3, 31, onom(330, 1330, 'ZIIIIP', 100, 28, GIVRE, INK, 29.4))}
`);
sfx('tk', 27.1); sfx('rumble', 27.3); sfx('whoosh', 28.3); sfx('bigboom', 28.65); sfx('freeze', 29.2); sfx('ice', 29.4); sfx('wind', 29.6);

// 9 · Le dégel (31 – 34,5 s) : le bloc de glace se fend, la visière rouge s'allume, la glace vole en éclats
scene(31, 34.5, shakeAt(32.6, cam(31, 34.5, [[31, 0, 60, 0, 1.25], [32.6, 0, 0, 0, 1.12, 'ease-in'], [32.7, 0, 0, 0, 1.06], [34.5, 30, -30, -1.5, 1.12]], `
  ${lab(0.65)}
  ${an('pulse', 31, `<circle cx="540" cy="1250" r="560" fill="url(#rglow)"/>`, [540, 1250], ';animation-iteration-count:infinite')}
  ${vis(31, 32.6, `${put(figure('kessler', 'guard', { anim: 'still', shout: true }), 540, 1600, 0.95, -1)}
    ${an('epulse', 31, `<rect x="480" y="${f(1600 - 0.95 * (608 + 0))}" width="120" height="30" fill="${RED}" filter="url(#glow)" opacity=".9"/>`, [540, 1030], ';animation-iteration-count:infinite')}
    ${iceBlock(540, 1610, 470, 720)}
    ${vis(31.4, 32.6, cracks(520, 1200, 4, 180, '#fff', 6))}${vis(31.9, 32.6, cracks(580, 1000, 5, 220, '#fff', 6))}${vis(32.3, 32.6, cracks(500, 1400, 6, 260, INK, 6))}`)}
  ${vis(32.6, 34.5, `${put(figure('kessler', 'point', { anim: 'fight', glow: true }), 540, 1600, 0.95, -1)}
    ${aura(540, 1250, RED, 3, 140, 32.6)}${shards(540, 1250, 32.6, 16)}
    ${an('impact', 32.6, burst(540, 1250, 90, 340, 14, '#fff', GIVRE), [540, 1250])}
    ${particles(40, '#c8f1ff', [200, 900], [800, 1600], [0, 300], [3, 7], [0.8, 1.6])}`)}
`, [540, 1200]), 2) + `
  ${vis(32.6, 34.5, onom(540, 720, 'KRASH !!', 140, 5, PAPER, RED, 32.6))}
  ${bubbleFor(9, 560, 440, ['Fermez toutes', 'les issues.'], [-40, 100])}
  ${flashAt(32.6)}
`);
sfx('ice', 31.3); sfx('glass', 31.9); sfx('glass', 32.3); sfx('bigboom', 32.6); sfx('glass', 32.65); sfx('eye', 32.7);

// 10 · Le sol tremble (34,5 – 40 s) : l'équipe atteint le hall ; derrière la vitre, deux yeux orange géants s'allument
scene(34.5, 40, cam(34.5, 40, [[34.5, 0, 40, 0, 1.0], [35.6, 0, 0, 0, 1.03], [37, 0, 0, 0, 1.08, 'ease-out'], [40, 0, -10, 0, 1.1]], `
  ${BG('#08070c')}
  ${an('pulse', 35.7, `<circle cx="540" cy="650" r="700" fill="url(#rglow)"/>`, [540, 650], ';animation-iteration-count:infinite')}
  ${shakeAt(35.0, `${put(robotG(0.2, { twin: true, eye: ORANGE }), 540, 1180, 1.3)}
    <rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="#05050a" opacity=".78"/>
    ${[-1, 1].map((s) => an('eyeOpen', 35.7, `<ellipse cx="${540 + s * 78}" cy="${1180 - 575}" rx="44" ry="20" fill="${ORANGE}" filter="url(#glow)"/><ellipse cx="${540 + s * 78}" cy="${1180 - 575}" rx="16" ry="7" fill="#fff"/>`, [540 + s * 78, 605])).join('')}`, 8, 'shakeS')}
  ${vis(35.9, 40, an('scan', 35.9, `<polygon points="540,605 140,1700 940,1700" fill="${ORANGE}" opacity=".16"/><path d="M540 605 L540 1700" stroke="${ORANGE}" stroke-width="4" opacity=".5"/>`, [540, 605]))}
  ${[0, 270, 540, 810, 1080].map((x) => `<rect x="${x - 14}" y="-200" width="28" height="1700" fill="#16141e" stroke="${RED}" stroke-width="2" opacity=".9"/>`).join('')}
  <rect x="-700" y="200" width="${W + 1400}" height="1300" fill="#8fd8ff" opacity=".05"/>
  ${GROUND(1500, '#0e0c14')}
  <path d="M-700 1500 L1780 1500" stroke="${RED}" stroke-width="5" opacity=".6"/>
  ${vis(35.2, 40, `<g class="flick1">${cracks(110, 1560, 5, 260, ORANGE, 6)}${cracks(980, 1580, 5, 240, ORANGE, 6)}</g>`)}
  ${vis(35.0, 40, particles(40, '#8a8578', [0, W], [-100, 600], [0, 900], [2, 6], [1.2, 2.2], 0.8))}
  ${shakeAt(35.0, `
    ${mv(34.5, 0.8, [-260, 0], `${put(figure('volta', 'guard', { anim: 'fight', glow: true }), 270, 1600, 0.46)}${put(figure('givre', 'guard', { anim: 'fight' }), 430, 1600, 0.46)}`, 'ease-out')}
    ${mv(34.5, 1.0, [-320, 0], `${put(figure('echo', 'stand', { anim: 'idle', float: true }), 600, 1590, 0.44)}${put(figure('mirage', 'hips', { anim: 'idle' }), 770, 1600, 0.45, -1)}`, 'ease-out')}`, 8, 'shakeS')}
`, [540, 700]) + `
  ${bubbleFor(10, 540, 420, ['Activez… le Colosse.'], [0, -100])}
  ${vis(35.1, 36.9, onom(540, 960, 'GRRROOOOM', 110, -4, ORANGE, INK, 35.1))}
  ${finalCard(36.9, 'ÉPISODE 10 BIENTÔT')}
`);
sfx('rumble', 34.9); sfx('rumble', 35.6); sfx('eye', 35.7); sfx('powerup', 35.8); sfx('hit', 36.9); sfx('thunder', 37.0);

L.build(import.meta.url, 'les-anomalies-ep9');
