// « LES ANOMALIES » ép. 3 · La planque : manga d'action, 40 s, 1080x1920 (Reel).
// Repaire sur un toit, sous une verrière près d'un vieux château d'eau. L'entraînement tourne mal :
// Volta et Givre se disputent, Écho calme tout. Mirage réapparaît : « Vous êtes suivis. »
// Fin : un drone espion explose la verrière.
// Usage : node make.mjs → les-anomalies-ep3.svg + timeline.json (lu par audio.py)
import * as L from '../les-anomalies/lib.mjs';
const { W, H, PAPER, INK, NIGHT, RED, VOLTA, GIVRE, ECHO, MIRAGE, rnd, f, vis, scene, an, radial, burst, cracks, bolt, onom, panel,
  bubbleFor, tag, figure, hand, put, bigEyes, aura, crystal, smoke, reticle, BG, GROUND, cam, particles, streaks, shakeAt,
  flashAt, sfx, mv, go, anim, fadeIn, fadeOut, ghost, bobbing, header, hook, finalCard, rooftops, waterTower, droneG, drone } = L;
L.reseed(303);

const LINES = [
  { who: 'volta', t0: 1.6, t1: 3.2, text: 'Bienvenue chez nous !' },
  { who: 'givre', t0: 4.9, t1: 6.3, text: 'Concentre-toi, Volta.' },
  { who: 'volta', t0: 6.5, t1: 7.9, text: 'Je suis concentrée !' },
  { who: 'givre', t0: 9.9, t1: 11.6, text: "Hé ! Tu m'as presque grillé !" },
  { who: 'volta', t0: 12.2, t1: 13.9, text: "Ta glace a renvoyé l'éclair !" },
  { who: 'givre', t0: 14.2, t1: 16.1, text: 'Toi, tu fonces toujours sans réfléchir !' },
  { who: 'echo', t0: 17.5, t1: 19.0, text: 'Stop ! Tous les deux !' },
  { who: 'echo', t0: 20.5, t1: 22.2, text: 'On est une équipe, non ?' },
  { who: 'volta', t0: 22.6, t1: 23.9, text: 'Bon… pardon, vraiment.' },
  { who: 'mirage', t0: 25.4, t1: 27.0, text: 'Vous êtes suivis.' },
  { who: 'volta', t0: 28.1, t1: 29.5, text: 'Suivis ? Par qui ?' },
  { who: 'givre', t0: 31.7, t1: 33.0, text: 'Un drone nous observe !' },
];
L.setLines(LINES);

// ---------- Décors propres à l'épisode ----------
const GLASS_Y = 640; // bas de la verrière (poutre)
// éclats de verre qui tombent en tournoyant
const shards = (t, n, [x0, x1], [y0, y1], fall = [900, 1800]) => Array.from({ length: n }, () => {
  const x = f(rnd(x0, x1)), y = f(rnd(y0, y1)), s = rnd(18, 60), dx = f(rnd(-520, 520)), dy = f(rnd(...fall)), r = f(rnd(-600, 600)), d = rnd(1.1, 2.4);
  return anim(t, d, ['0%{transform:translate(0,0) rotate(0deg);opacity:1}', `100%{transform:translate(${dx}px,${dy}px) rotate(${r}deg);opacity:.15}`],
    `<polygon points="${x},${f(y - s)} ${f(x + s * 0.6)},${f(y + s * 0.4)} ${f(x - s * 0.5)},${f(y + s * 0.7)}" fill="#cfeaff" fill-opacity=".75" stroke="#fff" stroke-width="3"/>`,
    { origin: [x, y], ease: 'cubic-bezier(.3,0,.8,.6)' });
}).join('');
// guirlande d'ampoules qui clignotent
const garland = (y, sag = 90) => {
  let b = '';
  for (let i = 0; i <= 16; i++) {
    const u = i / 16, x = -120 + u * 1320, yy = y + sag * 4 * u * (1 - u);
    b += `<g class="flick${1 + (i % 2)}" style="animation-duration:${f(rnd(0.6, 1.6))}s"><circle cx="${f(x)}" cy="${f(yy + 14)}" r="13" fill="${[VOLTA, GIVRE, ECHO, MIRAGE][i % 4]}" filter="url(#glow)"/></g>`;
  }
  return `<path d="M-120 ${y} Q540 ${y + sag * 2} 1200 ${y}" fill="none" stroke="${INK}" stroke-width="5"/>${b}`;
};
const crate = (x, yb, w = 200, h = 150) => `<rect x="${x - w / 2}" y="${yb - h}" width="${w}" height="${h}" fill="#3a2d22" stroke="${INK}" stroke-width="7"/>
  <path d="M${x - w / 2} ${yb - h} L${x + w / 2} ${yb} M${x + w / 2} ${yb - h} L${x - w / 2} ${yb}" stroke="${INK}" stroke-width="6" opacity=".7"/>`;
// le repaire sous la verrière ; behind = ce qu'on voit à travers la vitre (ciel, drone…)
const planque = (o = {}) => {
  const mull = Array.from({ length: 13 }, (_, i) => `<path d="M${-640 + i * 190} -1000 L${-640 + i * 190} ${GLASS_Y}" stroke="${INK}" stroke-width="16"/>`).join('');
  const trans = [-760, -400, -40, 300].map((y) => `<path d="M-700 ${y} L1780 ${y}" stroke="${INK}" stroke-width="12"/>`).join('');
  const shine = [-400, 0, 420, 820].map((x) => `<path d="M${x} ${GLASS_Y - 40} L${x + 260} -900" stroke="#fff" stroke-width="30" opacity=".05"/>`).join('');
  const bricks = Array.from({ length: 22 }, (_, r) => `<path d="M-700 ${GLASS_Y + 40 + r * 42} L1780 ${GLASS_Y + 40 + r * 42}" stroke="#17141c" stroke-width="4"/>`).join('');
  return `${BG(NIGHT)}<rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="url(#toneP)" opacity=".12"/>
    <circle cx="820" cy="-560" r="120" fill="${PAPER}" opacity=".85"/>
    ${particles(30, PAPER, [-600, 1680], [-1000, 600], [0, 0], [2, 4], [1.5, 3], 0.5)}
    ${rooftops(420, '#0b0b14', VOLTA)}
    ${o.behind || ''}
    <rect x="-700" y="-1000" width="${W + 1400}" height="${1000 + GLASS_Y}" fill="#3d6a8f" opacity=".16"/>
    ${o.broken ? '' : shine}${mull}${trans}
    <rect x="-700" y="${GLASS_Y}" width="${W + 1400}" height="1000" fill="#2a2430"/>${bricks}
    <rect x="-700" y="${GLASS_Y - 10}" width="${W + 1400}" height="56" fill="${INK}"/>
    ${garland(GLASS_Y + 70)}
    <text x="780" y="1010" class="onom" font-size="120" fill="${VOLTA}" opacity=".3" transform="rotate(-8 780 1010)">QG</text>
    ${[[610, VOLTA], [680, GIVRE], [750, ECHO]].map(([x, c]) => `<circle cx="${x}" cy="1110" r="26" fill="${c}" opacity=".35"/>`).join('')}
    <rect x="-80" y="1150" width="380" height="140" rx="40" fill="#5a3a4a" stroke="${INK}" stroke-width="8"/>
    ${GROUND(1560, '#141119')}
    ${[1610, 1690, 1800].map((y) => `<path d="M-700 ${y} L1780 ${y}" stroke="#0b0910" stroke-width="5"/>`).join('')}`;
};
const waterT = (x, yb, s = 1) => put(`<path d="M-130 0 L-100 -330 M130 0 L100 -330 M-40 0 L-30 -330 M40 0 L30 -330 M-120 -110 L120 -220 M120 -110 L-120 -220" stroke="#5a5a70" stroke-width="12" fill="none"/>
  <rect x="-170" y="-640" width="340" height="320" rx="24" fill="#2b2b3a" stroke="${PAPER}" stroke-width="6"/>
  <path d="M-170 -560 L170 -560 M-170 -470 L170 -470 M-170 -390 L170 -390" stroke="${PAPER}" stroke-width="3" opacity=".35"/>
  <path d="M-190 -640 L0 -760 L190 -640Z" fill="${INK}" stroke="${PAPER}" stroke-width="6"/>
  <rect x="-48" y="-470" width="96" height="70" fill="${VOLTA}" opacity=".85"/>
  <text x="0" y="-505" class="cap" text-anchor="middle" fill="${PAPER}" opacity=".6" style="font-size:40px">EAU</text>`, x, yb, s);
const hut = (x, yb, s = 1) => put(`<rect x="-280" y="-360" width="560" height="360" fill="${INK}" stroke="${PAPER}" stroke-width="5"/>
  <polygon points="-310,-360 0,-560 310,-360" fill="${VOLTA}" opacity=".45" filter="url(#glow)"/>
  <path d="M-310 -360 L0 -560 L310 -360 M-155 -360 L0 -560 L155 -360 M0 -560 L0 -360 M-230 -410 L230 -410" stroke="${INK}" stroke-width="10" fill="none"/>
  <rect x="-60" y="-210" width="120" height="210" fill="${VOLTA}" opacity=".6"/>`, x, yb, s);
// rayon de glace (Givre)
const iceBeam = (x0, y0, x1, y1, w = 34) => `<path d="M${f(x0)} ${f(y0)} L${f(x1)} ${f(y1)}" stroke="${GIVRE}" stroke-width="${w}" stroke-linecap="round" filter="url(#glow)" opacity=".85"/>
  <path d="M${f(x0)} ${f(y0)} L${f(x1)} ${f(y1)}" stroke="#fff" stroke-width="${f(w * 0.3)}" stroke-linecap="round"/>`;
const bigDrone = (x, y, s) => put(droneG(), x, y, s);

// =====================================================================
// 1 · Les toits (0 – 4 s) : travelling sur Néo-Lyre, le trio file vers la cabane vitrée du château d'eau
scene(0, 4, cam(0, 4, [[0, 0, -260, 0, 1.25], [1.6, 0, 0, 0, 1.0, 'ease-out'], [4, -60, -40, 1, 1.1]], `
  ${BG(NIGHT)}<rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="url(#toneP)" opacity=".12"/>
  <circle cx="830" cy="420" r="110" fill="${PAPER}" opacity=".9"/>
  ${particles(30, PAPER, [-500, 1580], [-600, 1000], [0, 0], [2, 4], [1.5, 3], 0.5)}
  ${an('parx', 0, rooftops(1180, '#0d0d18', VOLTA))}
  ${waterT(250, 1560, 1.15)}
  ${hut(760, 1560, 0.9)}
  ${an('pulse', 0, `<circle cx="720" cy="1170" r="260" fill="url(#rglow)" opacity=".4"/>`, [720, 1170], ';animation-iteration-count:infinite;animation-direction:alternate')}
  ${GROUND(1560, '#07070b')}
  ${mv(0, 2.6, [-900, 0], `
    ${put(figure('givre', 'run', { anim: 'fight' }), 290, 1640, 0.5)}
    ${put(figure('volta', 'run', { anim: 'fight', glow: true }), 450, 1650, 0.54)}
    ${put(figure('echo', 'float', { anim: 'idle', float: true }), 610, 1600, 0.5)}
    ${particles(20, VOLTA, [400, 520], [1300, 1500], [-300, -60], [2, 5], [0.3, 0.6])}`, 'cubic-bezier(.2,.7,.3,1)')}
  ${vis(0, 2.8, streaks(18, PAPER, [1100, 1600], -900, [2, 4], [0.2, 0.4]))}
`, [540, 1200]) + `
  ${header(3, 'La planque')}
  ${hook('Même les héros ont besoin d’un repaire.', 0.3, 820)}
  ${bubbleFor(0, 440, 560, ['Bienvenue chez nous !'], [-80, 90])}
`);
sfx('hit', 0.05); sfx('wind', 0.2); sfx('whoosh', 0.4); sfx('step', 1.0); sfx('step', 1.6); sfx('land', 2.6); sfx('door', 3.4);

// 2 · L'entraînement (4 – 8 s) : Givre lance des cibles de glace, Volta les pulvérise
const vH2 = hand('throw', 'ra', 860, 1560, 0.72, -1);
scene(4, 8, cam(4, 8, [[4, 0, 60, 0, 1.15], [6, -40, 0, -1, 1.05], [8, 40, -20, 1, 1.12]], `
  ${planque()}
  ${put(figure('givre', 'cast', { anim: 'cast', glow: true }), 210, 1560, 0.72)}
  ${put(figure('volta', 'throw', { anim: 'fight', glow: true }), 860, 1560, 0.72, -1)}
  ${[[420, 1080, 0], [560, 900, 1], [480, 1260, 2]].map(([x, y, i]) => an('pop', 4.2 + i * 0.35, an('bob', 0, i === 1
    ? vis(4, 7.05, crystal(x, y + 60, 90, 150, 6))
    : crystal(x, y + 60, 90, 150, -6), null, ';animation-iteration-count:infinite;animation-direction:alternate'), [x, y])).join('')}
  ${particles(26, GIVRE, [300, 620], [800, 1350], [0, -160], [2, 5], [0.8, 1.6])}
  ${vis(6.95, 7.6, bolt(f(vH2[0]), f(vH2[1]), 560, 930, VOLTA, 16, 8, 34, 6.95))}
  ${vis(7.05, 8, `${an('impact', 7.05, burst(560, 930, 40, 170, 12, '#fff', VOLTA), [560, 930])}${shards(7.05, 10, [520, 600], [860, 980], [300, 700])}`)}
  ${particles(20, VOLTA, [760, 900], [1060, 1200], [-200, -200], [2, 6], [0.3, 0.7])}
`, [540, 1200]) + `
  ${bubbleFor(1, 330, 520, ['Concentre-toi,', 'Volta.'], [-90, 100])}
  ${bubbleFor(2, 700, 520, ['Je suis', 'concentrée !'], [120, 100])}
  ${vis(7.05, 8, onom(560, 760, 'TCHAK !', 100, -6, VOLTA, INK, 7.05))}
`);
sfx('ice', 4.2); sfx('ice', 4.55); sfx('ice', 4.9); sfx('charge', 6.3); sfx('zap', 6.95); sfx('glass', 7.05);

// 3 · Le ricochet (8 – 12 s) : la foudre rebondit sur un miroir de glace et frappe Givre
const vH3 = hand('throw', 'ra', 880, 1560, 0.74, -1);
scene(8, 12, shakeAt(8.75, cam(8, 12, [[8, 120, 0, 2, 1.2], [8.6, 0, 0, 0, 1.0, 'ease-in'], [8.9, -60, 0, -2, 1.12, 'ease-out'], [12, -20, -40, 0, 1.18]], `
  ${planque()}
  ${an('rise', 8.0, `${crystal(580, 1560, 230, 640, 10)}${crystal(470, 1560, 120, 380, -14)}`)}
  ${put(figure('volta', 'throw', { anim: 'fight', glow: true }), 880, 1560, 0.74, -1)}
  ${vis(8.3, 8.8, bolt(f(vH3[0]), f(vH3[1]), 600, 1120, VOLTA, 20, 8, 40, 8.3))}
  ${vis(8.55, 9.1, bolt(600, 1120, 330, 1240, VOLTA, 18, 8, 50, 8.55))}
  ${vis(8.55, 9.6, an('impact', 8.55, burst(600, 1120, 30, 120, 10, '#fff', VOLTA), [600, 1120]))}
  ${vis(8, 8.75, put(figure('givre', 'stand', { anim: 'idle' }), 310, 1560, 0.74))}
  ${vis(8.75, 9.5, an('impact', 8.75, burst(330, 1240, 50, 220, 12, '#fff', VOLTA), [330, 1240]))}
  ${vis(8.75, 12, `${an('shakeS', 8.75, put(figure('givre', 'kneel', { anim: 'fight', shout: true }), 320, 1560, 0.74), null, ';animation-iteration-count:4')}
    ${an('drift', 8.9, smoke(310, 1130, 6, 90, '#4a4a55', 0.75))}
    ${particles(24, VOLTA, [240, 410], [1050, 1250], [0, -300], [2, 5], [0.4, 0.9])}
    ${cracks(540, 1300, 5, 130, INK, 4)}`)}
`, [540, 1200]), 3) + `
  ${vis(8.75, 9.9, onom(400, 820, 'BZZAK !', 130, -8, VOLTA, INK, 8.75))}
  ${bubbleFor(3, 420, 700, ["Hé ! Tu m'as", 'presque grillé !'], [-140, 110])}
  ${flashAt(8.75)}
`);
sfx('zap', 8.3); sfx('klang', 8.55); sfx('electric', 8.6); sfx('hit', 8.75);

// 4 · La dispute (12 – 16 s) : gros plans face à face, étincelles contre givre
scene(12, 16, cam(12, 16, [[12, 0, 0, 0, 1.08], [14, 0, 0, 0, 1.0], [16, 0, 0, 0, 1.06]], `
  ${BG(INK)}
  ${anim(12, 0.5, ['from{transform:translate(-1200px,0)}', 'to{transform:translate(0,0)}'], panel('p4a', 40, 330, 1000, 640, `
    ${radial(540, 700, 120, '#e8c21a', [260, 480])}
    ${an('shakeS', 12.2, bigEyes(540, 720, 'volta'), null, ';animation-iteration-count:6')}
    ${bolt(80, 420, 300, 600, VOLTA, 10, 6, 30, 12)}${bolt(1000, 450, 790, 620, VOLTA, 10, 6, 30, 12.1)}
    ${particles(26, VOLTA, [60, 1020], [380, 940], [0, -200], [3, 7], [0.4, 0.9])}`, '#fff6c8'), { ease: 'cubic-bezier(.2,.8,.3,1)' })}
  ${anim(13.4, 0.5, ['from{transform:translate(1200px,0)}', 'to{transform:translate(0,0)}'], panel('p4b', 40, 1000, 1000, 640, `
    ${radial(540, 1380, 120, '#7fd8ff', [260, 480])}
    ${an('shakeS', 14.2, bigEyes(540, 1400, 'givre'), null, ';animation-iteration-count:4')}
    ${crystal(120, 1640, 130, 280, 10)}${crystal(960, 1640, 130, 300, -10)}
    ${particles(30, '#ffffff', [60, 1020], [1020, 1620], [-80, 220], [3, 7], [0.8, 1.6])}`, '#e3f6ff'), { ease: 'cubic-bezier(.2,.8,.3,1)' })}
`, [540, 980]) + `
  ${bubbleFor(4, 540, 420, ['Ta glace a renvoyé', "l'éclair !"], [0, 100])}
  ${bubbleFor(5, 540, 1100, ['Toi, tu fonces toujours', 'sans réfléchir !'], [0, 100])}
`);
sfx('panel', 12.0); sfx('electric', 12.2); sfx('panel', 14.0); sfx('freeze', 14.2);

// 5 · Collision évitée (16 – 20 s) : foudre contre glace… Écho tombe entre eux et fige tout
const vH5 = hand('throw', 'ra', 190, 1560, 0.72), gH5 = hand('throw', 'ra', 890, 1560, 0.72, -1);
scene(16, 20, shakeAt(17.15, cam(16, 20, [[16, 0, 0, 0, 1.0], [17.0, 0, 0, 0, 1.12, 'ease-in'], [17.2, 0, 0, 0, 1.18], [20, 0, -30, 0, 1.05, 'ease-out']], `
  ${planque()}
  ${put(figure('volta', 'throw', { anim: 'charge', glow: true, shout: true }), 190, 1560, 0.72)}
  ${put(figure('givre', 'throw', { anim: 'charge', glow: true, shout: true }), 890, 1560, 0.72, -1)}
  ${vis(16.3, 19.2, `${bolt(f(vH5[0]), f(vH5[1]), 470, 1060, VOLTA, 20, 7, 36, 16.3)}${iceBeam(gH5[0], gH5[1], 610, 1060)}`)}
  ${vis(16, 17.15, particles(30, '#fff', [460, 620], [980, 1140], [0, 0], [3, 7], [0.2, 0.4]))}
  ${mv(16.7, 0.45, [0, -1500], put(figure('echo', 'float', { anim: 'cast', glow: true, float: true }), 540, 1300, 0.62), 'cubic-bezier(.5,0,.9,.6)')}
  ${vis(17.15, 19.4, `${an('grow', 17.15, `<circle cx="540" cy="1060" r="230" fill="${ECHO}" opacity=".16" stroke="${ECHO}" stroke-width="10" filter="url(#glow)"/>`, [540, 1060])}
    ${aura(540, 1060, ECHO, 3, 140, 17.2)}
    ${particles(30, ECHO, [300, 780], [850, 1300], [0, -120], [3, 7], [0.8, 1.6])}`)}
  ${vis(19.2, 20, `${an('drift', 19.2, smoke(540, 1060, 8, 200, '#6a5a8a', 0.6))}${particles(30, VOLTA, [300, 780], [900, 1200], [0, 300], [2, 5], [0.6, 1.0])}`)}
`, [540, 1100]), 3) + `
  ${vis(17.15, 17.5, onom(540, 760, 'VWOMM', 110, 0, ECHO, INK, 17.15))}
  ${bubbleFor(6, 540, 520, ['Stop !', 'Tous les deux !'], [0, 100])}
`);
sfx('charge', 16.0); sfx('zap', 16.3); sfx('freeze', 16.3); sfx('whoosh', 16.7); sfx('tk', 17.15); sfx('powerdown', 19.2);

// 6 · On se calme (20 – 24 s) : Écho pose les débris, Volta tend la main à Givre
scene(20, 24, cam(20, 24, [[20, 0, 40, 0, 1.0], [24, 30, -20, 0, 1.1]], `
  ${planque()}
  ${an('drift', 20, smoke(540, 1500, 6, 500, '#3a3448', 0.6))}
  ${[[380, 900, 0.45], [700, 820, 0.4], [560, 760, 0.5]].map(([x, y, s], i) => mv(20, 3.4, [0, -260 - i * 60], put(`<g transform="rotate(${i * 25 - 20})">${crate(0, 0, 200, 150)}</g>`, x, 1560 - 75 * s + (i - 1) * 0, s), 'ease-in-out')).join('')}
  ${vis(20, 23.6, aura(540, 1220, ECHO, 2, 120, 20))}
  ${mv(20, 1.4, [0, -120], put(figure('echo', 'cast', { anim: 'idle', float: true, glow: true }), 540, 1560, 0.7), 'ease-out')}
  ${put(figure('givre', 'sad', { anim: 'idle' }), 870, 1560, 0.68, -1)}
  ${vis(20, 22.6, put(figure('volta', 'sad', { anim: 'idle' }), 200, 1560, 0.68))}
  ${vis(22.6, 24, mv(22.6, 0.6, [-60, 0], put(figure('volta', 'point', { anim: 'idle' }), 250, 1560, 0.68)))}
  ${particles(26, ECHO, [-100, 1180], [900, 1600], [0, -160], [2, 5], [1.2, 2.4], 0.7)}
`, [540, 1200]) + `
  ${bubbleFor(7, 540, 560, ['On est une équipe,', 'non ?'], [0, 110])}
  ${bubbleFor(8, 360, 640, ['Bon… pardon,', 'vraiment.'], [-120, 110])}
`);
sfx('tk', 20.0); sfx('land', 21.6); sfx('heart', 22.6);

// 7 · Mirage (24 – 28 s) : un scintillement vert sur les caisses, la fille à capuche apparaît
scene(24, 28, cam(24, 28, [[24, 0, 0, 0, 1.0], [25.2, -40, 0, 0, 1.08, 'ease-out'], [28, -50, 20, 1, 1.12]], `
  ${planque()}
  ${crate(840, 1560, 240, 180)}${crate(860, 1380, 180, 130)}
  ${an('pulse', 24, `<circle cx="840" cy="1000" r="380" fill="url(#gglow)"/>`, [840, 1000], ';animation-iteration-count:infinite;animation-direction:alternate')}
  ${vis(24, 25, ghost(put(figure('mirage', 'hips', { anim: 'idle' }), 860, 1250, 0.66, -1), 0.05, 0.4))}
  ${vis(24.9, 28, fadeIn(24.9, 0.5, put(figure('mirage', 'hips', { anim: 'idle', glow: true }), 860, 1250, 0.66, -1)))}
  ${particles(40, MIRAGE, [700, 1020], [800, 1300], [0, -240], [2, 6], [0.8, 1.6])}
  ${put(figure('volta', 'guard', { anim: 'fight', glow: true }), 230, 1560, 0.6)}
  ${put(figure('echo', 'stand', { anim: 'idle', float: true }), 400, 1540, 0.58)}
  ${put(figure('givre', 'guard', { anim: 'fight' }), 560, 1560, 0.6)}
`, [700, 1200]) + `
  ${tag(70, 236, 'MIRAGE', 'INVISIBILITÉ', MIRAGE, 25.0)}
  ${vis(24.9, 25.9, onom(700, 790, 'SHIIIN', 100, -4, MIRAGE, INK, 24.9))}
  ${bubbleFor(9, 560, 600, ['Vous êtes suivis.'], [180, 110])}
`);
sfx('shimmer', 24.1); sfx('invis', 24.9);

// 8 · Le regard vers le ciel (28 – 31,5 s) : la caméra remonte vers la verrière… un œil rouge derrière la vitre
scene(28, 31.5, cam(28, 31.5, [[28, 0, 0, 0, 1.05], [29.6, 0, 0, 0, 1.1], [30.6, 0, 1000, 0, 1.0, 'ease-in-out'], [31.5, 0, 1040, 0, 1.08]], `
  ${planque({ behind: `<circle cx="560" cy="-370" r="230" fill="url(#rglow)" opacity=".8"/><circle cx="560" cy="-380" r="150" fill="#3a3a50" opacity=".6"/>${an('hover', 0, bigDrone(560, -360, 2.4), null, ';animation-iteration-count:infinite;animation-direction:alternate')}
    ${an('scan', 30.4, `<polygon points="560,-350 260,${GLASS_Y + 300} 860,${GLASS_Y + 300}" fill="${RED}" opacity=".18"/>`, [560, -350])}` })}
  ${put(figure('volta', 'hips', { anim: 'idle', shout: true }), 230, 1560, 0.66)}
  ${put(figure('echo', 'stand', { anim: 'idle', float: true }), 540, 1540, 0.62)}
  ${put(figure('givre', 'stand', { anim: 'idle' }), 840, 1560, 0.66, -1)}
  ${vis(30.6, 31.5, reticle(560, -345, 170, 30.6))}
  ${particles(20, PAPER, [-200, 1280], [-1000, 600], [60, 200], [2, 4], [1.5, 3], 0.4)}
`, [540, 1000]) + `
  ${bubbleFor(10, 420, 600, ['Suivis ?', 'Par qui ?'], [-100, 110])}
  ${vis(30.6, 31.5, onom(540, 1250, 'BZZZZ…', 90, 4, RED, INK, 30.6))}
`);
sfx('wind', 28.0); sfx('drone', 29.6); sfx('lock', 30.6);

// 9 · Repérés (31,5 – 34,5 s) : contre-plongée sur le trio éclairé de rouge, puis l'œil du drone se charge
scene(31.5, 34.5, `
  ${vis(31.5, 33.1, cam(31.5, 33.1, [[31.5, 0, 0, 0, 1.15], [33.1, 0, -30, -2, 1.04]], `
    ${planque()}
    <rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="${RED}" opacity=".12"/>
    ${an('scan', 31.5, `<polygon points="540,-200 120,1700 960,1700" fill="${RED}" opacity=".2"/>`, [540, -200])}
    ${put(figure('volta', 'guard', { anim: 'fight', glow: true }), 210, 1630, 0.8)}
    ${put(figure('givre', 'castUp', { anim: 'cast', glow: true }), 560, 1640, 0.84)}
    ${put(figure('echo', 'guard', { anim: 'fight', float: true }), 880, 1610, 0.78, -1)}
    ${particles(30, RED, [-100, 1180], [700, 1600], [0, -300], [2, 5], [0.8, 1.6], 0.7)}`, [540, 1300]))}
  ${vis(33.1, 34.5, cam(33.1, 34.5, [[33.1, 0, 0, 0, 1.0], [34.2, 0, 0, 0, 1.25, 'ease-in'], [34.5, 0, 40, 0, 1.6, 'ease-in']], `
    ${BG(NIGHT)}<circle cx="300" cy="420" r="90" fill="${PAPER}" opacity=".8"/>
    <circle cx="540" cy="900" r="420" fill="#5a5a72" opacity=".55"/><circle cx="540" cy="940" r="520" fill="url(#rglow)" opacity=".7"/>${an('bob', 33.1, bigDrone(540, 960, 3.2), null, ';animation-iteration-count:infinite;animation-direction:alternate')}
    ${an('grow', 33.3, an('pulse', 0, `<circle cx="540" cy="979" r="110" fill="${RED}" opacity=".5" filter="url(#glow)"/><circle cx="540" cy="979" r="50" fill="#fff"/>`, [540, 979], ';animation-iteration-count:infinite;animation-direction:alternate'), [540, 979])}
    ${particles(36, RED, [140, 940], [600, 1400], [0, 0], [3, 7], [0.4, 0.8])}
    <rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="#3d6a8f" opacity=".14"/>
    ${[-110, 300, 710, 1120].map((x) => `<path d="M${x} -1000 L${x} 2900" stroke="${INK}" stroke-width="30"/>`).join('')}
    <path d="M-700 1500 L1780 1500" stroke="${INK}" stroke-width="24"/>
    ${[-200, 250, 700].map((x) => `<path d="M${x} 1450 L${x + 320} 300" stroke="#fff" stroke-width="40" opacity=".06"/>`).join('')}`, [540, 986]))}
`+ `
  ${bubbleFor(11, 540, 560, ['Un drone', 'nous observe !'], [0, 110])}
  ${vis(33.3, 34.5, onom(540, 1320, 'VRRRIII…', 100, -4, RED, INK, 33.3))}
`);
sfx('alarm', 31.5); sfx('scan', 31.6); sfx('drone', 33.1); sfx('charge', 33.3); sfx('beep', 33.6); sfx('beep', 33.9); sfx('beep', 34.2);

// 10 · La verrière explose (34,5 – 40 s) : le drone traverse la vitre, pluie d'éclats, Écho protège le trio + carton final
scene(34.5, 40, shakeAt(34.7, cam(34.5, 40, [[34.5, 0, 700, 0, 1.0], [35.6, 0, 650, -2, 1.05], [36.7, 0, 60, 0, 1.0, 'ease-in-out'], [40, 0, 0, 0, 1.05]], `
  ${planque({ broken: true })}
  ${vis(34.5, 34.75, mv(34.5, 0.25, [0, -500], bigDrone(540, -60, 2), 'ease-in'))}
  ${vis(34.7, 40, `${an('impact', 34.7, burst(540, -60, 80, 420, 16, '#fff', RED), [540, -60])}
    ${an('impact', 34.75, burst(540, -60, 40, 260, 12, VOLTA, L.ORANGE), [540, -60])}
    ${cracks(540, -60, 9, 520, '#cfeaff', 6)}
    ${an('drift', 34.9, smoke(540, 0, 14, 420, '#4a4452', 0.85))}
    ${shards(34.7, 46, [-200, 1280], [-500, 620], [1400, 2400])}
    ${particles(40, L.ORANGE, [200, 880], [-300, 300], [0, 600], [3, 8], [0.6, 1.2])}`)}
  ${vis(35.2, 40, `${an('grow', 35.2, `<path d="M60 1560 A480 520 0 0 1 1020 1560" fill="${ECHO}" fill-opacity=".14" stroke="${ECHO}" stroke-width="12" filter="url(#glow)"/>`, [540, 1560])}
    ${shards(35.6, 16, [80, 1000], [900, 1000], [-60, 60])}`)}
  ${put(figure('volta', 'guard', { anim: 'fight', glow: true }), 230, 1560, 0.6)}
  ${put(figure('echo', 'castUp', { anim: 'cast', glow: true, float: true }), 540, 1540, 0.62)}
  ${put(figure('givre', 'guard', { anim: 'fight', glow: true }), 850, 1560, 0.6, -1)}
  ${vis(34.7, 40, `<g class="flick1" style="animation-duration:.4s"><rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="${RED}" opacity=".08"/></g>`)}
`, [540, 960]), 4) + `
  ${vis(34.7, 36.8, onom(540, 820, 'KRAAASH !!', 150, -6, '#cfeaff', INK, 34.7))}
  ${flashAt(34.7)}
  ${finalCard(36.9, 'ÉPISODE 4 BIENTÔT')}
`);
sfx('glass', 34.7); sfx('bigboom', 34.7); sfx('glass', 35.0); sfx('tk', 35.2); sfx('eye', 36.9); sfx('hit', 37.0);

L.build(import.meta.url, 'les-anomalies-ep3');
