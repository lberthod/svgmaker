// « LES ANOMALIES » ép. 11 · Sans étincelle : manga d'action, 40 s, 1080x1920 (Reel).
// Planque sur le toit, sous la pluie : Volta a perdu son pouvoir face au Colosse et doute. Givre et Écho la
// soutiennent, Mirage raconte qu'elle aussi a eu peur. Fin : l'orage éclate, un éclair frappe le toit…
// et les yeux de Volta se rallument.
// Usage : node make.mjs → les-anomalies-ep11.svg + timeline.json (lu par audio.py)
import * as L from '../les-anomalies/lib.mjs';
const { W, H, PAPER, INK, NIGHT, RED, VOLTA, GIVRE, ECHO, MIRAGE, ORANGE, rnd, f, vis, scene, an, radial, burst, bolt, onom, panel,
  bubbleFor, figure, hand, put, bigEyes, robotG, aura, smoke, BG, GROUND, sky, cam, particles, shakeAt, flashAt, sfx, mv, go, anim,
  fadeIn, fadeOut, ghost, tower, tube, header, hook, finalCard, city, rooftops, waterTower } = L;
L.reseed(11 * 101);

const LINES = [
  { who: 'volta', t0: 1.8, t1: 3.4, text: 'Allez… une étincelle !' },
  { who: 'volta', t0: 5.0, t1: 6.7, text: 'Plus rien… Il a tout pris.' },
  { who: 'givre', t0: 8.6, t1: 10.1, text: 'On va le battre, ensemble.' },
  { who: 'volta', t0: 10.5, t1: 12.0, text: 'Sans pouvoir, je sers à quoi ?' },
  { who: 'echo', t0: 12.8, t1: 14.4, text: "Toi, tu n'es pas que la foudre." },
  { who: 'mirage', t0: 16.8, t1: 18.4, text: "Moi aussi, j'ai eu peur." },
  { who: 'mirage', t0: 20.4, t1: 21.9, text: 'Je me cachais, seule.' },
  { who: 'mirage', t0: 22.3, t1: 23.8, text: 'Et je vous ai trouvés.' },
  { who: 'volta', t0: 24.8, t1: 26.3, text: 'Merci… tous les trois.' },
  { who: 'volta', t0: 28.6, t1: 30.1, text: 'Attendez… vous sentez ?' },
  { who: 'echo', t0: 32.3, t1: 33.5, text: 'Volta, non !' },
  { who: 'volta', t0: 35.0, t1: 36.6, text: 'Enfin, une étincelle !' },
];
L.setLines(LINES);

// ---------- Décors et accessoires propres à l'épisode ----------
// pluie : traits fins presque verticaux qui tombent en boucle (la `rain` de la lib dessine des traits horizontaux)
const drizzle = (n = 70, color = '#9aa3b8', op = 0.45, speed = [0.45, 0.8]) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    const d = rnd(...speed), l = rnd(50, 130);
    s += `<rect class="pt" x="${f(rnd(-500, W + 600))}" y="${f(rnd(-1100, 1500))}" width="${f(rnd(2.5, 4.5))}" height="${f(l)}" transform="rotate(8)" style="--dx:-140px;--dy:1100px;animation-duration:${f(d)}s;animation-delay:-${f(rnd(0, d))}s"/>`;
  }
  return `<g fill="${color}" opacity="${op}">${s}</g>`;
};
// éclaboussures sur le sol du toit
const splashes = (n, y, [x0, x1] = [-100, 1180]) => Array.from({ length: n }, () => {
  const x = f(rnd(x0, x1)), yy = f(y + rnd(0, 120)), d = rnd(0.5, 0.9);
  return `<g class="ripple" style="transform-origin:${x}px ${yy}px;animation-duration:${f(d)}s;animation-delay:-${f(rnd(0, d))}s;animation-iteration-count:infinite"><ellipse cx="${x}" cy="${yy}" rx="22" ry="6" fill="none" stroke="#7d8598" stroke-width="3"/></g>`;
}).join('');
// parallaxe lente propre au plan
const par = (a, b, body, dx = -60) => anim(a, b - a, ['from{transform:translate(0,0)}', `to{transform:translate(${dx}px,0)}`], body, { ease: 'linear' });
// éclair lointain dans le ciel + lueur
const skyBolt = (t, x, y1 = 900) => vis(t, t + 0.35, `${bolt(x, -400, x + rnd(-120, 120), y1, '#e8ecff', 9, 9, 50, t)}<rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="#c9d3ff" class="flash" style="animation-delay:${t}s" opacity=".5"/>`);
// toit de la planque : ville, toits, château d'eau, pluie
const roof = (a, b, y0 = 1560, wt = [990, 1470, 0.62]) => `${sky}
  ${par(a, b, city(1250, '#0b0b12', '#9a8c58'), -50)}
  ${par(a, b, rooftops(1400, '#08080d', '#7a6f48'), -90)}
  ${waterTower(...wt)}
  ${GROUND(y0, '#111118')}<path d="M-700 ${y0} L1780 ${y0}" stroke="#3a3a48" stroke-width="6"/>
  ${splashes(14, y0 + 20)}`;
// gant de Volta (paume vers le haut), base du poignet en (0,0)
const glove = (m = 1) => `<g transform="scale(${m} 1)">
  <path d="M-90 120 L-112 -10 Q-122 -80 -72 -90 L-62 -150 Q-52 -192 -20 -182 L-10 -112 L0 -200 Q16 -236 40 -210 L40 -112 L60 -186 Q82 -212 102 -180 L86 -80 Q122 -100 132 -60 L92 40 L72 120Z" fill="${VOLTA}" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>
  <path d="M-60 40 Q0 70 60 30" fill="none" stroke="${INK}" stroke-width="6" opacity=".5"/>
  <rect x="-100" y="110" width="184" height="80" fill="${INK}"/><path d="M-100 130 L84 130" stroke="${VOLTA}" stroke-width="6"/></g>`;
// couverture tenue par la télékinésie d'Écho
const blanket = (s = 1) => `<g transform="scale(${s})"><path d="M-200 -60 Q-100 -110 0 -70 Q100 -110 200 -60 L230 160 Q120 120 0 170 Q-120 120 -230 160Z" fill="#5b3d8f" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
  <path d="M-170 0 L170 0 M-190 70 L190 70" stroke="${PAPER}" stroke-width="6" stroke-dasharray="18 14" opacity=".55"/></g>`;
// petite fumée qui monte d'un gant éteint
const wisp = (x, y, t) => an('drift', t, `<path d="M${x} ${y} C${x - 30} ${y - 60} ${x + 30} ${y - 110} ${x} ${y - 170} C${x - 30} ${y - 220} ${x + 20} ${y - 260} ${x} ${y - 300}" fill="none" stroke="#8a8a96" stroke-width="12" stroke-linecap="round" opacity=".7"/>`);

// =====================================================================
// 1 · Sous la pluie (0 – 4 s) : Volta à genoux sur le toit, essaie de faire jaillir une étincelle… rien
const vH = hand('point', 'ra', 560, 1560, 0.85);
scene(0, 4, cam(0, 4, [[0, 0, -60, 0, 1.0], [4, 30, 10, 1.5, 1.16]], `
  ${roof(0, 4)}
  ${vis(0, 2.2, put(figure('volta', 'point', { anim: 'idle' }), 560, 1560, 0.85))}
  ${vis(2.2, 4, put(figure('volta', 'sad', { anim: 'idle' }), 560, 1560, 0.85))}
  ${vis(1.1, 1.5, bolt(vH[0], vH[1], vH[0] + 40, vH[1] - 70, VOLTA, 6, 4, 14, 1.1))}
  ${vis(1.1, 1.6, particles(10, VOLTA, [vH[0] - 30, vH[0] + 30], [vH[1] - 40, vH[1]], [0, -80], [2, 4], [0.3, 0.5]))}
  ${wisp(vH[0], vH[1] - 20, 1.5)}
  ${drizzle(80)}
`, [600, 1400]) + `
  ${header(11, 'Sans étincelle')}
  ${hook('Volta a perdu sa foudre.', 0.3, 820)}
  ${bubbleFor(0, 520, 520, ['Allez…', 'une étincelle !'], [60, 100])}
`);
sfx('hit', 0.05); sfx('wind', 0.2); sfx('zap', 1.1); sfx('powerdown', 1.5);

// 2 · Souvenir et gants éteints (4 – 8 s) : case rouge du Colosse qui aspire la foudre, puis les gants qui tremblent
const gloves = `${put(glove(-1), 380, 1300, 1)}${put(glove(1), 700, 1300, 1)}`;
scene(4, 8, cam(4, 8, [[4, 0, 0, 0, 1.0], [8, 0, -24, -1, 1.06]], `
  ${BG(INK)}
  ${an('inL', 4.0, panel('p2a', 40, 300, 1000, 560, `
    <rect x="40" y="300" width="1000" height="560" fill="#2a0a0e"/>
    ${radial(720, 640, 110, '#4a1016', [160, 300])}
    ${an('shakeS', 4.3, put(robotG(1.2, { twin: true, eye: ORANGE }), 740, 1150, 1.0), null, ';animation-iteration-count:6')}
    ${put(`<g opacity=".9">${figure('volta', 'cast', { anim: 'charge', glow: true })}</g>`, 200, 840, 0.42)}
    ${bolt(260, 640, 700, 700, VOLTA, 16, 9, 34, 4.0)}
    ${particles(30, VOLTA, [250, 450], [580, 720], [420, 40], [3, 7], [0.4, 0.7])}
    <rect x="40" y="300" width="1000" height="560" fill="${RED}" opacity=".12"/>`, '#2a0a0e'))}
  ${an('inR', 4.4, panel('p2b', 40, 900, 1000, 640, `
    ${radial(540, 1180, 90, '#d9d4c8', [300, 460])}
    ${an('shakeS', 5.6, gloves, null, ';animation-iteration-count:5')}
    ${vis(4.6, 5.0, `${bolt(520, 1140, 580, 1040, VOLTA, 8, 5, 18, 4.6)}`)}
    ${wisp(400, 1100, 5.0)}${wisp(690, 1090, 5.2)}
    ${particles(18, '#8a8a96', [300, 780], [1000, 1150], [0, -160], [3, 7], [1.2, 2])}`))}
`, [540, 900]) + `
  ${vis(5.0, 8, onom(870, 1010, 'pfff…', 70, -6, '#b8b4aa', INK, 5.0))}
  ${bubbleFor(1, 540, 885, ['Plus rien…', 'Il a tout pris.'], [0, 90])}
`);
sfx('panel', 4.0); sfx('beam', 4.0); sfx('panel', 4.4); sfx('zap', 4.6); sfx('powerdown', 4.9); sfx('heart', 6.4);

// 3 · Givre arrive (8 – 12 s) : il marche jusqu'à elle, gèle les gouttes au-dessus de sa tête
scene(8, 12, cam(8, 12, [[8, -80, 0, 0, 1.12], [10.3, 0, 0, 0, 1.05], [12, 90, -20, 1, 1.14]], `
  ${roof(8, 12)}
  ${vis(8, 9.3, mv(8, 1.3, [-420, 0], put(figure('givre', 'stand', { anim: 'idle' }), 330, 1560, 0.8), 'ease-out'))}
  ${vis(9.3, 12, `${put(figure('givre', 'castUp', { anim: 'cast', glow: true }), 330, 1560, 0.8)}`)}
  ${put(figure('volta', 'sad', { anim: 'idle' }), 720, 1560, 0.85, -1)}
  ${vis(9.4, 12, `${aura(720, 1000, GIVRE, 2, 90, 9.4)}
    ${an('grow', 9.4, `<path d="M520 1010 Q720 880 920 1010" fill="none" stroke="${GIVRE}" stroke-width="14" filter="url(#glow)"/><path d="M520 1010 Q720 880 920 1010 L900 1030 Q720 920 540 1030Z" fill="#c8f1ff" opacity=".55"/>`, [720, 1010])}
    ${particles(30, '#c8f1ff', [520, 920], [860, 1000], [0, 40], [3, 6], [1.2, 2.2])}`)}
  ${vis(8, 9.4, drizzle(80))}${vis(9.4, 12, `${drizzle(50, '#9aa3b8', 0.4)}`)}
`, [540, 1400]) + `
  ${bubbleFor(2, 360, 560, ['On va le battre,', 'ensemble.'], [-30, 100])}
  ${bubbleFor(3, 700, 600, ['Sans pouvoir,', 'je sers à quoi ?'], [20, 100])}
`);
sfx('step', 8.1); sfx('step', 8.6); sfx('step', 9.1); sfx('freeze', 9.4); sfx('ice', 10.2);

// 4 · Écho et la couverture (12 – 16 s) : elle descend en flottant, pose une couverture sur les épaules de Volta
const eH = hand('cast', 'ra', 300, 1440, 0.78);
scene(12, 16, cam(12, 16, [[12, 0, 80, 0, 1.18], [13.8, 0, 0, 0, 1.06], [16, -60, -30, -1, 1.12]], `
  ${roof(12, 16)}
  ${mv(12, 1.2, [-120, -500], an('bob', 12, put(figure('echo', 'cast', { anim: 'cast', float: true, glow: true }), 300, 1440, 0.78), null, ';animation-iteration-count:infinite'))}
  ${aura(f(eH[0] + 10), f(eH[1]), ECHO, 3, 50, 12.4)}
  ${put(figure('volta', 'sad', { anim: 'idle' }), 720, 1560, 0.85, -1)}
  ${mv(12.4, 1.6, [-420, -520], an('wob', 12.4, put(blanket(0.6), 720, 1190, 1), [720, 1190], ';animation-iteration-count:3'))}
  ${vis(12.4, 14.2, `<path d="M${f(eH[0])} ${f(eH[1])} Q600 900 720 1190" fill="none" stroke="${ECHO}" stroke-width="6" stroke-dasharray="14 16" class="flow" filter="url(#glow)" opacity=".8"/>`)}
  ${particles(34, ECHO, [200, 900], [900, 1500], [0, -260], [3, 7], [1, 2])}
  ${drizzle(70)}
`, [540, 1350]) + `
  ${bubbleFor(4, 560, 560, ["Toi, tu n'es pas", 'que la foudre.'], [-150, 110])}
`);
sfx('tk', 12.3); sfx('whoosh', 12.5); sfx('land', 14.0);

// 5 · Mirage sur le château d'eau (16 – 20 s) : elle se matérialise, puis saute près d'eux
scene(16, 20, cam(16, 20, [[16, -80, 260, 0, 1.25], [17.6, -60, 140, 0, 1.14], [20, 0, 0, 1, 1.0]], `
  ${roof(16, 20, 1560, [820, 1560, 0.95])}
  ${vis(16, 16.9, ghost(put(figure('mirage', 'hips', { anim: 'idle' }), 820, 990, 0.6, -1), 0.1, 0.4))}
  ${vis(16.9, 18.6, fadeIn(16.9, 0.4, put(figure('mirage', 'hips', { anim: 'idle', glow: true }), 820, 990, 0.6, -1)))}
  ${vis(16.2, 17.4, particles(30, MIRAGE, [720, 920], [600, 1000], [0, -200], [2, 6], [0.6, 1.2]))}
  ${vis(18.6, 20, mv(18.6, 0.8, [80, -570], put(figure('mirage', 'leap', { anim: 'fight', glow: true }), 720, 1560, 0.72, -1), 'cubic-bezier(.4,0,.6,1)'))}
  ${put(figure('givre', 'stand', { anim: 'idle' }), 150, 1560, 0.74)}
  ${put(figure('volta', 'sad', { anim: 'idle' }), 420, 1560, 0.78)}
  ${put(blanket(0.55), 420, 1200, 1)}
  ${put(figure('echo', 'stand', { anim: 'idle', float: true }), 560, 1560, 0.7, -1)}
  ${drizzle(70)}
`, [700, 1100]) + `
  ${onom(740, 470, 'SHIIIN', 90, 6, MIRAGE, INK, 16.9)}
  ${bubbleFor(5, 430, 660, ['Moi aussi,', "j'ai eu peur."], [280, 120])}
`);
sfx('shimmer', 16.2); sfx('invis', 16.9); sfx('whoosh', 18.6); sfx('land', 19.4);

// 6 · Le souvenir de Mirage (20 – 24 s) : petite dans sa cuve, puis cachée sous la pluie… et le trio qui lui tend la main
scene(20, 24, cam(20, 24, [[20, 0, 0, 0, 1.0], [24, 0, 20, 1, 1.05]], `
  ${BG(INK)}
  ${an('inL', 20.0, panel('p6a', 40, 300, 1000, 580, an('zoomP', 20.0, `
    <rect x="40" y="300" width="1000" height="580" fill="#0a1a12"/>
    ${radial(540, 620, 90, '#123222', [220, 360])}
    ${tube(250, 900, ECHO, 0.62)}${tube(830, 900, '#ff5fa2', 0.62)}
    ${tube(540, 920, MIRAGE, 0.72, 'mirage')}
    ${an('scan', 20.3, `<polygon points="540,300 380,880 700,880" fill="${RED}" opacity=".18"/>`, [540, 300])}
    <rect x="40" y="300" width="1000" height="580" fill="${MIRAGE}" opacity=".08"/>`, [540, 600]), '#0a1a12'))}
  ${an('inR', 21.3, panel('p6b', 40, 920, 1000, 580, `
    <rect x="40" y="920" width="1000" height="580" fill="#141420"/>
    ${radial(760, 1250, 80, '#2a2a3a', [200, 340])}
    ${ghost(put(figure('mirage', 'sad', { anim: 'idle' }), 250, 1470, 0.62), 0.25, 0.6)}
    ${mv(22.0, 1.4, [260, 0], `${put(figure('givre', 'stand', { anim: 'idle', glow: true }), 640, 1470, 0.5, -1)}${put(figure('volta', 'hips', { anim: 'idle', glow: true }), 760, 1480, 0.52, -1)}${put(figure('echo', 'point', { anim: 'idle', float: true, glow: true }), 900, 1470, 0.52, -1)}`)}
    ${drizzle(40, '#7a8296', 0.5)}`, '#141420'))}
`, [540, 900]) + `
  ${bubbleFor(6, 540, 920, ['Je me cachais,', 'seule.'], [0, -95])}
  ${bubbleFor(7, 560, 880, ['Et je vous', 'ai trouvés.'], [0, 100])}
`);
sfx('panel', 20.0); sfx('scan', 20.3); sfx('panel', 21.3); sfx('shimmer', 22.4);

// 7 · Ensemble (24 – 28 s) : Volta se relève au milieu des trois ; le tonnerre gronde au loin
scene(24, 28, cam(24, 28, [[24, 0, 60, 0, 1.16], [26.4, 0, 0, 0, 1.0], [28, 0, -40, -1.5, 1.06]], `
  ${roof(24, 28)}
  ${skyBolt(26.6, 820, 700)}
  ${put(figure('givre', 'stand', { anim: 'idle' }), 190, 1560, 0.72)}
  ${vis(24, 24.6, put(figure('volta', 'sad', { anim: 'idle' }), 430, 1560, 0.8))}
  ${vis(24.6, 28, mv(24.6, 0.6, [0, 90], put(figure('volta', 'hips', { anim: 'idle' }), 430, 1560, 0.8)))}
  ${put(figure('echo', 'stand', { anim: 'idle', float: true }), 660, 1540, 0.72, -1)}
  ${put(figure('mirage', 'stand', { anim: 'idle' }), 890, 1560, 0.72, -1)}
  ${go(24.6, 1.2, [-260, 300], put(blanket(0.56), 430, 1195, 1))}
  ${drizzle(90, '#9aa3b8', 0.5)}
`, [540, 1300]) + `
  ${bubbleFor(8, 470, 560, ['Merci…', 'tous les trois.'], [-30, 110])}
  ${vis(26.6, 28, onom(540, 380, 'GRRROOOM…', 80, -3, '#c9d3ff', INK, 26.6))}
`);
sfx('step', 24.6); sfx('thunder', 26.6);

// 8 · L'orage éclate (28 – 31,5 s) : la ville sous les éclairs, la Tour OMEGA au loin ; Volta lève la main vers le ciel
scene(28, 31.5, cam(28, 31.5, [[28, 0, 0, 0, 1.0], [31.5, 0, 90, -3, 1.14]], `
  ${BG('#0c0c18')}<rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="url(#toneP)" opacity=".1"/>
  ${skyBolt(28.3, 220, 1000)}${skyBolt(29.2, 900, 900)}${skyBolt(30.4, 520, 800)}${skyBolt(31.1, 120, 1000)}
  ${par(28, 31.5, city(1350, '#06060b', '#7a6f48'), -40)}
  ${tower(800, 1360, 0.5)}
  ${GROUND(1500, '#0a0a10')}<path d="M-700 1500 L1780 1500" stroke="#3a3a48" stroke-width="6"/>
  ${an('swayL', 28, put(figure('volta', 'castUp', { anim: 'idle', shout: true }), 380, 1500, 0.78), null, ';animation-duration:6s')}
  ${vis(30.3, 31.5, `${particles(20, VOLTA, [440, 560], [880, 1000], [0, -120], [2, 5], [0.3, 0.6])}${bolt(500, 940, 540, 870, VOLTA, 5, 4, 12, 30.3)}`)}
  ${drizzle(110, '#a8b0c8', 0.55, [0.35, 0.55])}
`, [540, 1300]) + `
  ${bubbleFor(9, 420, 520, ['Attendez…', 'vous sentez ?'], [0, 110])}
`);
sfx('thunder', 28.3); sfx('wind', 28.6); sfx('rumble', 29.2); sfx('thunder', 30.4); sfx('electric', 30.3);

// 9 · L'éclair (31,5 – 34,5 s) : la foudre frappe Volta, explosion de lumière, puis fumée
const vUp = hand('castUp', 'ra', 420, 1580, 0.85);
scene(31.5, 34.5, shakeAt(31.9, cam(31.5, 34.5, [[31.5, 0, 0, 0, 1.2], [31.9, 0, 0, 0, 1.02, 'ease-in'], [32.2, 0, 0, 0, 1.08], [34.5, 30, -30, 2, 1.18]], `
  ${BG(PAPER)}
  <rect x="-700" y="-1000" width="${W + 1400}" height="2600" fill="url(#tone)" opacity=".25"/>
  ${radial(f(vUp[0]), f(vUp[1]), 160, INK, [260, 480])}
  ${GROUND(1580)}
  ${vis(31.5, 32.4, put(figure('volta', 'castUp', { anim: 'charge', shout: true }), 420, 1580, 0.85))}
  ${vis(31.9, 34.5, `${bolt(f(vUp[0]) + 60, -500, f(vUp[0]), f(vUp[1]), VOLTA, 34, 12, 70, 31.9)}${bolt(f(vUp[0]) - 200, -500, f(vUp[0]), f(vUp[1]), '#fff', 14, 10, 50, 31.95)}
    ${an('impact', 31.9, burst(f(vUp[0]), f(vUp[1]), 80, 300, 16, '#fff', VOLTA), [f(vUp[0]), f(vUp[1])])}
    ${particles(50, VOLTA, [200, 900], [700, 1600], [0, -500], [3, 9], [0.5, 1.1])}`)}
  ${vis(32.4, 34.5, `${put(`<g opacity=".9">${figure('volta', 'kneel', { anim: 'charge', glow: true })}</g>`, 420, 1580, 0.85)}
    ${an('drift', 32.4, smoke(420, 1500, 10, 380, '#9a968c', 0.55))}
    ${bolt(260, 1580, 600, 1560, VOLTA, 8, 7, 20, 32.6)}`)}
`, [540, 1100]), 4) + `
  ${onom(700, 760, 'KRA-KOOM !!', 96, -6, VOLTA, INK, 31.95)}
  ${bubbleFor(10, 300, 430, ['Volta, non !'], [-90, 100])}
  ${flashAt(31.9)}
`);
sfx('zap', 31.6); sfx('bigboom', 31.9); sfx('thunder', 32.0); sfx('electric', 32.6);

// 10 · Les yeux se rallument + carton final (34,5 – 40 s)
const eyeCY = 640;
scene(34.5, 40, cam(34.5, 40, [[34.5, 0, 40, 0, 1.08], [36.6, 0, 0, 0, 1.0, 'ease-out'], [40, 0, -20, 0, 1.04]], `
  ${BG(INK)}
  ${roof(34.5, 40, 1650, [900, 1650, 0.7])}
  ${an('epulse', 35.0, `<circle cx="540" cy="1300" r="520" fill="url(#vglow)"/>`, [540, 1300], ';animation-iteration-count:infinite')}
  ${put(figure('volta', 'charge', { anim: 'charge', glow: true }), 540, 1650, 0.6)}
  ${vis(35.0, 40, `${bolt(470, 1300, 360, 1180, VOLTA, 7, 5, 16, 35.0)}${bolt(610, 1320, 720, 1200, VOLTA, 7, 5, 16, 35.1)}${particles(30, VOLTA, [380, 700], [1150, 1600], [0, -260], [2, 6], [0.5, 1.1])}`)}
  ${drizzle(80)}
  ${an('slam', 34.5, panel('p10', 40, 300, 1000, 640, `
    ${radial(540, eyeCY, 120, '#e6d9a8', [320, 480])}
    ${vis(35.0, 40, `${bolt(60, 360, 1020, 470, VOLTA, 12, 10, 50, 35.0)}${bolt(60, 900, 1020, 820, VOLTA, 10, 10, 40, 35.1)}${particles(20, VOLTA, [60, 1020], [320, 920], [0, -140], [2, 6], [0.6, 1.2])}`)}
    ${vis(34.5, 35.0, `${[-1, 1].map((s) => `<path d="M${540 + 210 * s - 150} ${eyeCY + 10} Q${540 + 210 * s} ${eyeCY + 60} ${540 + 210 * s + 150} ${eyeCY + 10}" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>`).join('')}`)}
    ${an('eyeOpen', 35.0, bigEyes(540, eyeCY, 'volta'), [540, eyeCY])}`))}
`, [540, 960]) + `
  ${bubbleFor(11, 540, 1050, ['Enfin,', 'une étincelle !'], [0, -80])}
  ${finalCard(36.9, 'ÉPISODE 12 BIENTÔT')}
  ${flashAt(35.0)}
`);
sfx('panel', 34.5); sfx('heart', 34.6); sfx('powerup', 35.0); sfx('eye', 36.9); sfx('hit', 37.0);

L.build(import.meta.url, 'les-anomalies-ep11');
