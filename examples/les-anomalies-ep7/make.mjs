// « LES ANOMALIES » ép. 7 · Infiltration : manga d'action, 40 s, 1080x1920 (Reel).
// Mirage rend Volta et Givre invisibles ; le trio entre dans la Tour OMEGA pour sauver Écho.
// Gardes, couloirs, lasers de détection, Givre gèle les caméras. Fin : une porte s'ouvre sur un laboratoire géant.
// Usage : node make.mjs → les-anomalies-ep7.svg + timeline.json (lu par audio.py)
import * as L from '../les-anomalies/lib.mjs';
const { W, H, PAPER, INK, NIGHT, RED, VOLTA, GIVRE, ECHO, MIRAGE, ORANGE, rnd, f, vis, scene, an, radial, burst, cracks, bolt, onom,
  bubbleFor, tag, figure, hand, put, robotG, aura, crystal, smoke, reticle, BG, GROUND, cam, particles, streaks, shakeAt,
  flashAt, sfx, mv, go, anim, fadeIn, ghost, bobbing, holo, tower, tube, header, hook, finalCard, city, sky, searchlight } = L;
L.reseed(707);

const LINES = [
  { who: 'volta', t0: 1.6, t1: 3.0, text: 'On arrive, Écho.' },
  { who: 'mirage', t0: 4.6, t1: 6.0, text: 'Restez collés à moi.' },
  { who: 'volta', t0: 6.4, t1: 7.8, text: 'Je vois plus mes mains !' },
  { who: 'robot', t0: 9.0, t1: 10.6, text: 'Rien à signaler.' },
  { who: 'givre', t0: 12.5, t1: 13.8, text: 'Chut. Pas un bruit.' },
  { who: 'givre', t0: 15.8, t1: 17.2, text: 'Lasers de détection.' },
  { who: 'volta', t0: 17.9, t1: 19.2, text: 'Même pas peur !' },
  { who: 'robot', t0: 20.1, t1: 21.6, text: 'Mouvement détecté ?' },
  { who: 'givre', t0: 22.7, t1: 24.1, text: 'Je gèle les caméras.' },
  { who: 'mirage', t0: 26.4, t1: 27.8, text: 'Vite, je faiblis !' },
  { who: 'volta', t0: 30.4, t1: 31.8, text: 'Écho est là-dedans.' },
  { who: 'givre', t0: 34.8, t1: 36.4, text: "C'est… un laboratoire." },
];
L.setLines(LINES);

// ---------- Invisibilité ----------
// inv : le personnage s'efface (reste un contour fantôme) ; gh : fantôme qui ondule ; flk : invisibilité qui faiblit
const inv = (t, body, lo = 0.3) => anim(t, 0.9, ['from{opacity:1}', `to{opacity:${lo}}`], body);
const gh = (body) => ghost(body, 0.26, 0.48);
const flk = (body, d = 0.9) => anim(-rnd(0, d), d, ['0%,38%{opacity:.42}', '42%,56%{opacity:1}', '60%,100%{opacity:.42}'], body, { iter: 'infinite' });
const shimmerOn = (x0, x1, y0, y1, n = 22) => particles(n, MIRAGE, [x0, x1], [y0, y1], [0, -220], [2, 5], [0.8, 1.6], 0.8);

// ---------- Décors propres à l'épisode ----------
const VP = [540, 900]; // point de fuite du couloir
const corridor = (edge = '#2c2c3c', lamp = RED) => {
  let s = '';
  for (let i = 0; i < 8; i++) {
    const k = Math.pow(0.74, i), w = 1700 * k, h = 2300 * k, x = VP[0] - w / 2, y = VP[1] - h * 0.5;
    s += `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="none" stroke="${edge}" stroke-width="${f(22 * k + 3)}"/>`;
    s += `<g class="flick${1 + (i % 2)}" style="animation-duration:${f(rnd(0.6, 1.8))}s"><rect x="${f(VP[0] - 120 * k)}" y="${f(y + 10 * k)}" width="${f(240 * k)}" height="${f(16 * k + 2)}" fill="${lamp}" opacity=".8" filter="url(#glow)"/></g>`;
    if (i % 2) s += `<rect x="${f(x + 40 * k)}" y="${f(VP[1] - 260 * k)}" width="${f(150 * k)}" height="${f(560 * k)}" fill="#14141e" stroke="${edge}" stroke-width="${f(6 * k + 1)}"/>`
      + `<rect x="${f(x + w - 190 * k)}" y="${f(VP[1] - 260 * k)}" width="${f(150 * k)}" height="${f(560 * k)}" fill="#14141e" stroke="${edge}" stroke-width="${f(6 * k + 1)}"/>`;
  }
  const floor = `<polygon points="-700,${H + 400} ${W + 700},${H + 400} ${VP[0] + 60},${VP[1] + 80} ${VP[0] - 60},${VP[1] + 80}" fill="#101018"/>`;
  const lines = [-600, -250, 250, 600].map((dx) => `<path d="M${VP[0] + dx * 2.4} ${H + 300} L${VP[0] + dx * 0.05} ${VP[1] + 80}" stroke="${lamp}" stroke-width="5" opacity=".35"/>`).join('');
  return `${BG('#08080e')}${floor}${lines}${s}`;
};
// caméra de surveillance (centre de rotation = fixation au plafond, en 0,0)
const secCamG = (frozen = false) => `<g>
  <rect x="-26" y="-200" width="52" height="210" fill="${INK}" stroke="${PAPER}" stroke-width="5"/>
  <rect x="-200" y="-10" width="360" height="150" rx="22" fill="${INK}" stroke="${PAPER}" stroke-width="6"/>
  <path d="M-180 120 L140 120" stroke="${PAPER}" stroke-width="3" opacity=".4"/>
  <rect x="150" y="10" width="80" height="110" fill="#1d1d26" stroke="${PAPER}" stroke-width="5"/>
  <circle cx="230" cy="65" r="58" fill="#2a0005" stroke="${frozen ? GIVRE : RED}" stroke-width="9"/>
  ${frozen ? `<circle cx="230" cy="65" r="34" fill="#cfefff" opacity=".9"/>` : `<g class="epulse" style="transform-origin:230px 65px"><circle cx="230" cy="65" r="32" fill="${RED}" filter="url(#glow)"/></g><circle cx="244" cy="52" r="9" fill="#fff"/>`}
  <circle cx="-160" cy="30" r="11" fill="${frozen ? GIVRE : RED}" class="flick1"/></g>`;
// gel sur une caméra (coordonnées locales de la caméra)
const iceCap = () => `<g>${[[-150, 150, 160, 120, -20], [-20, 150, 200, 180, 10], [120, 150, 170, 200, 20], [240, 140, 140, 150, -15]].map(([x, y, w, h, l]) => crystal(x, y, w, h, l)).join('')}
  <path d="M-210 -20 L280 -20 L300 150 L-210 150Z" fill="#c8f1ff" opacity=".45"/>
  ${cracks(230, 65, 6, 90, '#fff', 4)}</g>`;
// grande porte Ω (deux battants, ouverture à tOpen)
const omegaDoor = (tOpen = 99) => {
  const half = (side) => `<g>
    <rect x="${side < 0 ? -700 : 540}" y="-1000" width="1240" height="3200" fill="#15151f"/>
    <rect x="${side < 0 ? 120 : 540}" y="380" width="420" height="1240" fill="#1d1d2a" stroke="${PAPER}" stroke-width="6"/>
    ${[540, 760, 980, 1200, 1420].map((y) => `<path d="M${side < 0 ? 150 : 570} ${y} L${side < 0 ? 510 : 930} ${y}" stroke="${PAPER}" stroke-width="3" opacity=".25"/>`).join('')}
    <rect x="${side < 0 ? 500 : 540}" y="380" width="40" height="1240" fill="${INK}"/>
  </g>`;
  const omega = `<g class="epulse" style="transform-origin:540px 960px"><path d="M440 1040 L490 1040 L490 1010 A90 90 0 1 1 590 1010 L590 1040 L640 1040" fill="none" stroke="${RED}" stroke-width="22" stroke-linejoin="round" filter="url(#glow)"/></g>`;
  return `${go(tOpen, 1.8, [-900, 0], `${half(-1)}<g clip-path="url(#c_doorL)">${omega}</g>`, 'cubic-bezier(.5,0,.4,1)')}
    ${go(tOpen, 1.8, [900, 0], `${half(1)}<g clip-path="url(#c_doorR)">${omega}</g>`, 'cubic-bezier(.5,0,.4,1)')}`;
};
// les deux moitiés du logo Ω : clips déclarés via des rectangles (un panneau vide de la lib ajouterait un cadre)
L.svgCss('.doorseam{animation:seam .5s ease-in-out infinite alternate} @keyframes seam{from{opacity:.4}to{opacity:1}}');
const doorClips = `<defs><clipPath id="c_doorL"><rect x="-700" y="-1000" width="1240" height="3200"/></clipPath><clipPath id="c_doorR"><rect x="540" y="-1000" width="1240" height="3200"/></clipPath>
  <radialGradient id="lglow"><stop offset="0" stop-color="#e8fbff" stop-opacity=".6"/><stop offset="1" stop-color="${GIVRE}" stop-opacity="0"/></radialGradient></defs>`;
// laboratoire derrière la porte : rangées de cuves en perspective
const LABC = [GIVRE, ECHO, ORANGE, '#ff5fa2', MIRAGE, VOLTA, '#7cf2e0', ECHO];
const lab = () => {
  let s = `${BG('#0b1820')}${an('pulse', 34, `<circle cx="540" cy="820" r="900" fill="url(#lglow)"/>`, [540, 820], ';animation-iteration-count:infinite')}`;
  s += `<polygon points="-700,${H + 400} ${W + 700},${H + 400} 600,900 480,900" fill="#0e2230"/>`;
  s += [-700, -350, 0, 350, 700].map((dx) => `<path d="M${540 + dx * 2} ${H + 300} L${540 + dx * 0.05} 900" stroke="${GIVRE}" stroke-width="4" opacity=".3"/>`).join('');
  const rows = [[0.26, 960, 150], [0.36, 1060, 210], [0.5, 1220, 300], [0.72, 1480, 430]];
  rows.forEach(([sc, yb, dx], r) => {
    for (const side of [-1, 1]) for (let j = 0; j < 2; j++) {
      const x = 540 + side * (dx + j * dx * 0.9);
      s += tube(f(x), yb, LABC[(r * 4 + j * 2 + (side > 0 ? 1 : 0)) % LABC.length], sc);
    }
  });
  return s;
};

// =====================================================================
// 1 · Devant la Tour (0 – 4 s) : sur un toit, Volta, Givre et Mirage face à la Tour OMEGA ; travelling avant
scene(0, 4, cam(0, 4, [[0, 0, 70, 0, 1.0], [4, 0, -40, 0, 1.16]], `
  ${sky}
  ${an('pulse', 0, `<circle cx="760" cy="760" r="680" fill="url(#rglow)"/>`, [760, 760], ';animation-iteration-count:infinite')}
  ${searchlight(260, 'swayL', 0)}${searchlight(1000, 'swayR', 0)}
  ${an('parx', 0, city(1450, '#07070b', RED))}
  ${tower(760, 1470, 0.55)}
  ${particles(40, PAPER, [-200, 1200], [0, 1500], [-160, 260], [2, 4], [2, 4], 0.35)}
  ${GROUND(1580, '#050508')}
  <path d="M-700 1580 L1780 1580" stroke="${VOLTA}" stroke-width="4" opacity=".5"/>
  ${put(figure('givre', 'stand', { anim: 'idle' }), 210, 1580, 0.6)}
  ${put(figure('mirage', 'hips', { anim: 'idle' }), 870, 1580, 0.6, -1)}
  ${put(figure('volta', 'charge', { anim: 'charge', glow: true }), 540, 1600, 0.68)}
  ${particles(26, VOLTA, [420, 660], [1100, 1400], [0, -260], [2, 6], [0.3, 0.7])}
  ${bolt(470, 1180, 400, 1060, VOLTA, 7, 5, 16, 0)}${bolt(610, 1180, 690, 1070, VOLTA, 7, 5, 16, 0)}
`, [540, 1100]) + `
  ${header(7, 'Infiltration')}
  ${hook('Cette nuit, ils entrent chez l’ennemi.', 0.3, 1000)}
  ${bubbleFor(0, 330, 640, ['On arrive, Écho.'], [150, 120])}
`);
sfx('hit', 0.05); sfx('wind', 0.2); sfx('electric', 0.6); sfx('drone', 2.2);

// 2 · L'illusion (4 – 8,5 s) : Mirage lève la main, des ondes vertes ; Volta et Givre s'effacent
scene(4, 8.5, cam(4, 8.5, [[4, 0, 90, 0, 1.25], [5, 0, 0, 0, 1.04, 'ease-out'], [8.5, 0, -30, -2, 1.14]], `
  ${BG('#06140c')}
  ${radial(540, 1150, 150, '#0d3a20', [300, 520])}
  ${an('pulse', 4, `<circle cx="540" cy="1150" r="620" fill="url(#gglow)"/>`, [540, 1150], ';animation-iteration-count:infinite')}
  ${[4.4, 4.9, 5.4, 5.9, 6.4, 6.9, 7.4].map((t) => vis(t, t + 1.2, an('ripple', t, `<circle cx="540" cy="1150" r="260" fill="none" stroke="${MIRAGE}" stroke-width="10"/>`, [540, 1150]))).join('')}
  ${GROUND(1600, '#04080a')}
  ${inv(5.3, put(figure('givre', 'guard', { anim: 'idle' }), 190, 1600, 0.64))}
  ${inv(5.7, an('shakeS', 6.4, put(figure('volta', 'guard', { anim: 'fight', shout: true }), 890, 1600, 0.64, -1), null, ';animation-iteration-count:3'))}
  ${vis(5.3, 8.5, shimmerOn(60, 330, 1150, 1600))}${vis(5.7, 8.5, shimmerOn(750, 1020, 1150, 1600))}
  ${put(figure('mirage', 'castUp', { anim: 'cast', glow: true }), 540, 1600, 0.8)}
  ${particles(46, MIRAGE, [0, W], [700, 1650], [0, -300], [2, 6], [1, 2])}
`, [540, 1150]) + `
  ${tag(70, 236, 'MIRAGE', 'ILLUSIONS', MIRAGE, 4.2)}
  ${vis(5.2, 6.4, onom(540, 1420, 'SHIIIN', 100, -4, MIRAGE, INK, 5.2))}
  ${bubbleFor(1, 540, 470, ['Restez collés à moi.'], [0, 110])}
  ${bubbleFor(2, 680, 600, ['Je vois plus', 'mes mains !'], [140, 120])}
`);
sfx('shimmer', 4.3); sfx('invis', 5.3); sfx('invis', 5.7);

// 3 · L'entrée (8,5 – 12 s) : deux Traqueurs gardent le hall, trois fantômes passent entre leurs faisceaux
const guardY = 1600 - 700 * 0.42;
scene(8.5, 12, cam(8.5, 12, [[8.5, -70, 0, -1, 1.08], [12, 70, -30, 1, 1.18]], `
  ${BG('#0c0c14')}
  <rect x="-700" y="400" width="${W + 1400}" height="40" fill="${RED}" opacity=".5"/>
  <g opacity=".35">${tower(540, 1500, 0.32)}</g>
  ${an('epulse', 8.5, `<path d="M480 860 L515 860 L515 840 A50 50 0 1 1 565 840 L565 860 L600 860" fill="none" stroke="${RED}" stroke-width="12" filter="url(#glow)"/>`, [540, 820], ';animation-iteration-count:infinite')}
  ${GROUND(1600, '#07070c')}
  ${[-500, -150, 150, 500].map((dx) => `<path d="M${540 + dx * 2.2} ${H + 200} L${540 + dx * 0.4} 1600" stroke="#2a2a38" stroke-width="6"/>`).join('')}
  ${put(robotG(0.6), 240, guardY, 0.42)}${put(robotG(0.6), 840, guardY, 0.42, -1)}
  ${an('scan', 8.6, `<polygon points="240,${f(guardY - 442 * 0.42)} 520,1600 760,1600" fill="${RED}" opacity=".16"/>`, [240, guardY - 442 * 0.42], ';animation-iteration-count:2')}
  ${an('scan', 9.2, `<polygon points="840,${f(guardY - 442 * 0.42)} 300,1600 560,1600" fill="${RED}" opacity=".16"/>`, [840, guardY - 442 * 0.42], ';animation-iteration-count:2;animation-direction:reverse')}
  ${mv(8.5, 3.5, [-420, 0], `
    ${gh(put(bobbing(figure('givre', 'run', { anim: 'idle' }), 8, 0.5), 420, 1600, 0.5))}
    ${gh(put(bobbing(figure('mirage', 'run', { anim: 'idle', glow: true }), 8, 0.5), 560, 1610, 0.52))}
    ${gh(put(bobbing(figure('volta', 'run', { anim: 'idle' }), 8, 0.5), 700, 1600, 0.5))}
    ${shimmerOn(360, 760, 1300, 1600, 26)}`, 'linear')}
`, [540, 1200]) + `
  ${bubbleFor(3, 540, 460, ['Rien à signaler.'], [-260, 120])}
  ${vis(10.8, 12, onom(540, 1000, 'tip · tip · tip', 64, -3, MIRAGE, INK, 10.8, 'pop'))}
`);
sfx('scan', 8.6); sfx('scan', 9.2); sfx('step', 10.8); sfx('step', 11.2); sfx('step', 11.6);

// 4 · Le couloir (12 – 15,5 s) : travelling avant dans un couloir rouge, les fantômes avancent vers nous
scene(12, 15.5, cam(12, 15.5, [[12, 0, 0, 0, 1.0], [15.5, 0, -50, 1, 1.2]], `
  ${corridor()}
  ${put(an('swayL', 12, secCamG(), [0, 0], ';animation-iteration-count:infinite;animation-direction:alternate;animation-duration:2.5s'), 300, 560, 0.28, -1)}
  ${put(an('swayR', 12, secCamG(), [0, 0], ';animation-iteration-count:infinite;animation-direction:alternate;animation-duration:2.5s'), 780, 560, 0.28)}
  ${particles(30, '#6a6a78', [-200, 1280], [300, 1900], [60, 200], [2, 4], [2, 4], 0.5)}
  ${anim(12, 3.5, ['from{transform:translate(0,-150px) scale(.78)}', 'to{transform:translate(0,0) scale(1)}'], `
    ${gh(put(figure('givre', 'stand', { anim: 'idle' }), 290, 1600, 0.62))}
    ${gh(put(figure('volta', 'run', { anim: 'idle' }), 790, 1600, 0.62, -1))}
    ${gh(put(figure('mirage', 'cast', { anim: 'cast', glow: true }), 540, 1640, 0.66))}
    ${shimmerOn(200, 880, 1200, 1640, 30)}`, { origin: [540, 1600], ease: 'linear' })}
`, [540, 1000]) + `
  ${bubbleFor(4, 540, 420, ['Chut. Pas un bruit.'], [-120, 130])}
`);
sfx('door', 12.0); sfx('step', 12.6); sfx('step', 13.4); sfx('step', 14.2); sfx('beep', 14.8);

// 5 · Les lasers (15,5 – 19,5 s) : grille de faisceaux mobiles ; Givre glisse dessous, Volta saute par-dessus
const beam = (y, d, amp, delay) => anim(-delay, d, [`from{transform:translate(0,${-amp}px)}`, `to{transform:translate(0,${amp}px)}`],
  `<rect x="-700" y="${y - 5}" width="${W + 1400}" height="10" fill="${RED}" filter="url(#glow)"/><rect x="-700" y="${y - 2}" width="${W + 1400}" height="4" fill="#fff"/>`, { iter: 'infinite', dir: 'alternate' });
scene(15.5, 19.5, cam(15.5, 19.5, [[15.5, 0, 0, 0, 1.22], [16.4, 0, 0, 0, 1.04, 'ease-out'], [17.8, 0, -10, 0, 1.06], [19.5, 50, -40, 2, 1.14]], `
  ${corridor('#222230')}
  <rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="#200008" opacity=".35"/>
  ${beam(1180, 1.3, 90, 0)}${beam(1380, 1.1, 70, 0.4)}${beam(1520, 0.9, 40, 0.2)}
  ${['-0.35', '0.35'].map((a, i) => `<g transform="rotate(${a * 57} 540 1250)">${beam(1250, 1.6, 60, i * 0.5)}</g>`).join('')}
  ${gh(mv(15.5, 1.6, [-260, 0], put(figure('givre', 'kneel', { anim: 'idle' }), 250, 1620, 0.6)))}
  ${vis(15.5, 17.9, gh(put(figure('volta', 'guard', { anim: 'idle' }), 820, 1620, 0.6, -1)))}
  ${vis(17.9, 19.5, gh(an('leapB', 17.9, put(figure('volta', 'leap', { anim: 'fight', glow: true }), 700, 1180, 0.6, -1, 10))))}
  ${vis(17.9, 19.5, particles(24, VOLTA, [520, 860], [700, 1100], [-200, 300], [3, 6], [0.4, 0.8]))}
  ${gh(put(figure('mirage', 'cast', { anim: 'cast', glow: true }), 540, 1640, 0.56))}
  ${particles(26, RED, [0, W], [1100, 1600], [0, -200], [2, 4], [0.8, 1.6], 0.6)}
`, [540, 1250]) + `
  ${bubbleFor(5, 540, 440, ['Lasers de détection.'], [-160, 120])}
  ${bubbleFor(6, 600, 470, ['Même pas peur !'], [80, 120])}
  ${vis(18.1, 19.5, onom(330, 960, 'HOP !', 110, -8, VOLTA, INK, 18.1))}
`);
sfx('laser', 15.6); sfx('beam', 16.2); sfx('whoosh', 17.95); sfx('land', 19.0);

// 6 · La caméra (19,5 – 22,5 s) : une caméra pivote vers eux, l'objectif rouge cherche, réticule
scene(19.5, 22.5, cam(19.5, 22.5, [[19.5, 0, 0, 0, 1.0], [21.2, 0, 20, 0, 1.12], [22.5, 0, 40, 0, 1.22]], `
  ${BG('#0a0a12')}
  ${radial(540, 700, 90, '#2a0610', [300, 520])}
  <rect x="-700" y="-1000" width="${W + 1400}" height="1300" fill="#16161f"/>
  <path d="M-700 300 L1780 300" stroke="${PAPER}" stroke-width="6" opacity=".4"/>
  ${put(anim(19.6, 1.6, ['0%{transform:rotate(-38deg)}', '60%{transform:rotate(24deg)}', '100%{transform:rotate(14deg)}'], secCamG(), { origin: [0, 0], ease: 'cubic-bezier(.4,0,.2,1)' }), 380, 500, 1.15)}
  ${vis(20.0, 22.5, an('scan', 20.0, `<polygon points="640,700 260,1700 900,1700" fill="${RED}" opacity=".18"/>`, [640, 700]))}
  ${GROUND(1720, '#07070c')}
  ${gh(put(figure('givre', 'stand', { anim: 'idle' }), 340, 1720, 0.44))}
  ${gh(put(figure('mirage', 'guard', { anim: 'idle' }), 540, 1720, 0.46))}
  ${gh(put(figure('volta', 'stand', { anim: 'idle' }), 740, 1720, 0.44, -1))}
  ${vis(21.0, 22.5, mv(21.0, 1.0, [-200, -120], reticle(560, 1500, 110, 21.0)))}
`, [540, 900]) + `
  ${bubbleFor(7, 560, 1080, ['Mouvement', 'détecté ?'], [60, -120])}
  ${vis(21.7, 22.5, onom(540, 1320, 'BIP · BIP', 80, 4, RED, INK, 21.7))}
`);
sfx('panel', 19.6); sfx('scan', 20.0); sfx('beep', 21.7); sfx('beep', 22.0);

// 7 · Givre gèle les caméras (22,5 – 26 s) : rayon de glace, l'objectif se couvre de cristaux, écran « SIGNAL PERDU »
const gH = hand('castUp', 'ra', 280, 1620, 0.76);
scene(22.5, 26, shakeAt(24.3, cam(22.5, 26, [[22.5, -60, 40, -2, 1.12], [24.2, 0, 0, 0, 1.02, 'ease-in'], [24.4, 0, 0, 0, 1.08], [26, 40, -30, 1, 1.12]], `
  ${corridor('#20303c', GIVRE)}
  <rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="#001018" opacity=".35"/>
  ${put(`${secCamG()}${vis(24.3, 26, an('impact', 24.3, `${secCamG(true)}${iceCap()}`, [40, 60]))}`, 700, 520, 0.6, -1)}
  ${put(`${secCamG()}${vis(24.9, 26, an('impact', 24.9, `${secCamG(true)}${iceCap()}`, [40, 60]))}`, 200, 760, 0.3)}
  ${aura(f(gH[0]), f(gH[1]), GIVRE, 3, 60, 22.6)}
  ${vis(23.6, 24.6, `<path d="M${f(gH[0])} ${f(gH[1])} L560 560" stroke="${GIVRE}" stroke-width="26" filter="url(#glow)" pathLength="1" class="draw" style="animation-delay:23.6s"/><path d="M${f(gH[0])} ${f(gH[1])} L560 560" stroke="#fff" stroke-width="8" pathLength="1" class="draw" style="animation-delay:23.6s"/>`)}
  ${vis(24.3, 26, `${an('impact', 24.3, burst(560, 560, 40, 170, 12, '#e8fbff', GIVRE), [560, 560])}${particles(36, '#c8f1ff', [380, 760], [400, 760], [0, 300], [3, 7], [0.6, 1.2])}`)}
  ${vis(24.8, 25.4, `<path d="M${f(gH[0])} ${f(gH[1])} L230 790" stroke="${GIVRE}" stroke-width="16" filter="url(#glow)" pathLength="1" class="draw" style="animation-delay:24.8s"/>`)}
  ${anim(22.6, 0.6, ['from{opacity:.3}', 'to{opacity:.72}'], put(figure('givre', 'castUp', { anim: 'cast', glow: true }), 280, 1620, 0.76))}
  ${gh(put(figure('mirage', 'cast', { anim: 'cast', glow: true }), 640, 1620, 0.6, -1))}
  ${gh(put(figure('volta', 'stand', { anim: 'idle' }), 860, 1620, 0.58, -1))}
  ${particles(30, GIVRE, [100, 600], [1000, 1600], [0, -300], [2, 6], [0.8, 1.6])}
`, [540, 1100]), 3) + `
  ${bubbleFor(8, 450, 420, ['Je gèle les caméras.'], [-120, 120])}
  ${vis(24.3, 26, onom(660, 1000, 'KRIIIK !', 120, -6, GIVRE, INK, 24.3))}
  ${vis(25.0, 26, an('pop', 25.0, holo(180, 1180, 720, 120, `<text x="540" y="1260" class="rt" style="font-size:52px">SIGNAL PERDU</text>`)))}
  ${flashAt(24.3)}
`);
sfx('charge', 22.6); sfx('freeze', 23.6); sfx('ice', 24.3); sfx('glass', 24.35); sfx('ice', 24.9); sfx('glitch', 25.0);

// 8 · La course (26 – 30 s) : ils filent dans le couloir, l'invisibilité de Mirage clignote, un balayage les frôle
scene(26, 30, cam(26, 30, [[26, -110, 0, -2, 1.08], [30, 110, -30, 2, 1.16]], `
  ${corridor('#2a2234', MIRAGE)}
  ${streaks(30, '#3a3a4c', [300, 1700], -900, [3, 6], [0.2, 0.4])}
  ${vis(28.3, 30, an('scanDown', 28.3, `<rect x="-700" y="560" width="${W + 1400}" height="40" fill="${RED}" opacity=".5" filter="url(#glow)"/>`))}
  ${mv(26, 4, [-380, 0], `
    ${flk(put(bobbing(figure('givre', 'run', { anim: 'fight' }), 10, 0.3), 250, 1630, 0.68), 0.8)}
    ${flk(put(bobbing(figure('volta', 'run', { anim: 'fight' }), 10, 0.3), 520, 1640, 0.68), 0.95)}
    ${an('shakeS', 26.4, flk(put(figure('mirage', 'charge', { anim: 'charge', glow: true }), 800, 1650, 0.72), 0.7), null, ';animation-iteration-count:6')}
    ${particles(40, MIRAGE, [140, 980], [1050, 1630], [-300, -200], [2, 6], [0.5, 1.0])}`, 'linear')}
`, [540, 1200]) + `
  ${bubbleFor(9, 560, 480, ['Vite, je faiblis !'], [180, 130])}
  ${vis(27.9, 29.4, onom(360, 900, 'BZZT', 100, -6, MIRAGE, INK, 27.9))}
`);
sfx('whoosh', 26.1); sfx('step', 26.5); sfx('step', 26.9); sfx('glitch', 27.9); sfx('scan', 28.3); sfx('step', 29.0); sfx('step', 29.4);

// 9 · La porte Ω (30 – 34 s) : Volta pose la main sur le boîtier, la serrure grille, voyant rouge → vert
const vH = hand('point', 'ra', 640, 1620, 0.66);
scene(30, 34, shakeAt(32.5, cam(30, 34, [[30, 0, 30, 0, 1.0], [32.4, 0, 0, 0, 1.08], [34, 0, -40, 0, 1.14]], `
  ${doorClips}
  ${omegaDoor()}
  ${vis(33.1, 34, `<rect x="530" y="380" width="20" height="1240" fill="${PAPER}" class="doorseam" filter="url(#glow)"/>`)}
  <rect x="${f(vH[0] - 20)}" y="${f(vH[1] - 80)}" width="120" height="170" rx="10" fill="${INK}" stroke="${PAPER}" stroke-width="5"/>
  ${vis(30, 32.2, `<circle cx="${f(vH[0] + 40)}" cy="${f(vH[1] - 40)}" r="18" fill="${RED}" filter="url(#glow)" class="flick1"/>`)}
  ${vis(32.2, 34, `<circle cx="${f(vH[0] + 40)}" cy="${f(vH[1] - 40)}" r="20" fill="${MIRAGE}" filter="url(#glow)"/>`)}
  ${vis(30.8, 32.3, `${bolt(vH[0], vH[1], vH[0] + 60, vH[1] - 60, VOLTA, 9, 5, 18, 30.8)}${bolt(vH[0], vH[1], vH[0] + 80, vH[1] + 40, VOLTA, 8, 5, 18, 30.9)}
    ${particles(28, VOLTA, [vH[0] - 40, vH[0] + 120], [vH[1] - 120, vH[1] + 80], [0, 200], [2, 6], [0.3, 0.7])}`)}
  ${GROUND(1620, '#07070c')}
  ${gh(put(figure('givre', 'stand', { anim: 'idle' }), 170, 1620, 0.6))}
  ${gh(put(figure('mirage', 'hips', { anim: 'idle' }), 360, 1620, 0.6))}
  ${anim(30.6, 0.5, ['from{opacity:.35}', 'to{opacity:.8}'], put(figure('volta', 'point', { anim: 'charge', glow: true }), 640, 1620, 0.66))}
`, [540, 1100]), 2) + `
  ${bubbleFor(10, 480, 420, ['Écho est là-dedans.'], [100, 120])}
  ${vis(32.5, 34, onom(330, 700, 'KLAK !', 120, -6, PAPER, INK, 32.5))}
`);
sfx('electric', 30.8); sfx('zap', 31.2); sfx('beep', 32.2); sfx('klang', 32.5); sfx('rumble', 33.1);

// 10 · Le laboratoire (34 – 40 s) : la porte s'ouvre, lumière froide, des cuves à perte de vue + carton final
scene(34, 40, cam(34, 40, [[34, 0, 0, 0, 1.15], [36.6, 0, -50, 0, 1.0, 'ease-out'], [40, 0, -70, 0, 1.05]], `
  ${lab()}
  ${particles(40, '#dff6ff', [-200, 1280], [300, 1700], [0, -240], [2, 5], [1.5, 3], 0.6)}
  ${particles(30, '#bfe9ff', [-100, 1180], [1500, 1800], [0, -160], [10, 22], [2, 3.5], 0.18)}
  ${omegaDoor(34.1)}
  ${vis(34.1, 35.4, `<rect x="440" y="-1000" width="200" height="3200" fill="#fff" opacity=".55" filter="url(#glow)"/>`)}
  ${gh(put(figure('givre', 'stand', { anim: 'idle' }), 300, 1700, 0.52))}
  ${gh(put(figure('mirage', 'stand', { anim: 'idle' }), 540, 1720, 0.54))}
  ${anim(34.2, 1.2, ['from{opacity:.4}', 'to{opacity:.85}'], put(figure('volta', 'guard', { anim: 'idle', glow: true }), 780, 1700, 0.52, -1))}
`, [540, 1100]) + `
  ${bubbleFor(11, 540, 470, ["C'est… un laboratoire."], [-200, 120])}
  ${finalCard(36.9, 'ÉPISODE 8 BIENTÔT')}
`);
sfx('door', 34.1); sfx('rumble', 34.2); sfx('holo', 35.0); sfx('heart', 35.6); sfx('eye', 36.9); sfx('hit', 37.0);

L.build(import.meta.url, 'les-anomalies-ep7');
