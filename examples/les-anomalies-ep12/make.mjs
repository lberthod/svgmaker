// « LES ANOMALIES » ép. 12 · La centrale : manga d'action, 40 s, 1080x1920 (Reel).
// Volta, sans pouvoir depuis le Colosse, se branche sur la centrale électrique de Néo-Lyre. Elle se recharge,
// plus puissante que jamais (cheveux blancs-jaunes), et balaie les Traqueurs. Fin : un message des mutants
// libérés du labo : « On veut se battre. »
// Usage : node make.mjs → les-anomalies-ep12.svg + timeline.json (lu par audio.py)
import * as L from '../les-anomalies/lib.mjs';
const { W, H, PAPER, INK, NIGHT, RED, VOLTA, GIVRE, ECHO, MIRAGE, ORANGE, rnd, f, vis, scene, an, radial, burst, cracks, bolt, onom, panel,
  bubbleFor, tag, figure, hand, put, bigEyes, robotG, aura, smoke, reticle, BG, GROUND, cam, particles, streaks, shakeAt,
  flashAt, sfx, mv, go, anim, fadeIn, ghost, bobbing, holo, header, hook, finalCard, rain, swarm, addChar } = L;
L.reseed(12 * 101);

const LINES = [
  { who: 'volta', t0: 1.9, t1: 3.5, text: "J'ai besoin de courant." },
  { who: 'givre', t0: 4.6, t1: 6.2, text: "Volta, c'est trop risqué." },
  { who: 'volta', t0: 6.6, t1: 7.9, text: 'Je sais ce que je fais.' },
  { who: 'echo', t0: 10.2, t1: 11.7, text: "Elle aspire toute l'énergie !" },
  { who: 'robot', t0: 12.6, t1: 14.6, text: 'Cible détectée. Neutralisation.' },
  { who: 'volta', t0: 16.2, t1: 17.6, text: 'Je suis de retour !' },
  { who: 'mirage', t0: 21.3, t1: 22.9, text: "Rappelez-moi de ne pas l'énerver." },
  { who: 'volta', t0: 23.3, t1: 24.6, text: 'Dégage, le robot !' },
  { who: 'echo', t0: 27.4, t1: 28.9, text: 'Ta coiffure a changé !' },
  { who: 'volta', t0: 29.3, t1: 30.7, text: 'Nouveau look, non ?' },
  { who: 'mirage', t0: 31.7, t1: 33.4, text: 'Un message… du labo.' },
  { who: 'ally', t0: 34.8, t1: 36.8, text: 'On veut se battre avec vous.' },
];
L.setLines(LINES);

// ---------- Volta surchargée : cheveux blancs-jaunes, yeux pâles ----------
const HAIRX = '#fff4b0';
addChar('voltaX', { accent: HAIRX, hair: 'spiky' }); // pour le gros plan des yeux
const voltaX = (pose, o = {}) => figure('volta', pose, { glow: true, ...o })
  .replace(`-50,-590" fill="${INK}" stroke="${INK}"`, `-50,-590" fill="${HAIRX}" stroke="${INK}" filter="url(#glow)"`);
// mutants libérés (silhouettes colorées du labo)
addChar('rose', { accent: '#ff5fa2', hair: 'long' });
addChar('braise', { accent: ORANGE, hair: 'spiky' });
addChar('jade', { accent: '#19d3b0', hair: 'swept' });
addChar('azur', { accent: '#4d7bff', hair: 'bun' });

// ---------- Décors propres à l'épisode : la centrale ----------
const STEEL = '#22222e';
const pylon = (x, yb, s = 1, c = STEEL) => {
  const w = (y) => 120 - 90 * (-y / 900);
  let lat = '';
  for (let y = 0; y > -900; y -= 100) lat += `M${f(-w(y))} ${y} L${f(w(y - 100))} ${y - 100} M${f(w(y))} ${y} L${f(-w(y - 100))} ${y - 100} `;
  return put(`<g stroke="${c}" fill="none" stroke-linejoin="round">
    <path d="M-120 0 L-30 -900 L0 -1000 L30 -900 L120 0" stroke-width="14"/>
    <path d="${lat}" stroke-width="6"/>
    <path d="M-280 -780 L280 -780 M-220 -600 L220 -600" stroke-width="14"/>
    <path d="M-280 -780 L-30 -880 M280 -780 L30 -880 M-220 -600 L-60 -700 M220 -600 L60 -700" stroke-width="6"/></g>
    <g fill="${VOLTA}" class="flick1" style="animation-duration:${f(rnd(0.4, 1.1))}s">${[-270, 270, -210, 210].map((dx, i) => `<circle cx="${dx}" cy="${i < 2 ? -760 : -580}" r="12"/>`).join('')}</g>`, x, yb, s);
};
const coolTower = (x, yb, s = 1) => put(`
  <path d="M-260 0 C-180 -300 -150 -520 -190 -820 L190 -820 C150 -520 180 -300 260 0Z" fill="#191924" stroke="#3a3a4a" stroke-width="5"/>
  <path d="M-260 0 C-180 -300 -150 -520 -190 -820 L-120 -820 C-90 -520 -110 -300 -160 0Z" fill="url(#toneL)" opacity=".18"/>
  <path d="M-200 -150 L200 -150" stroke="${VOLTA}" stroke-width="5" opacity=".5"/>
  ${particles(10, '#c9c9d4', [-150, 150], [-900, -820], [60, -420], [40, 80], [3, 5], 0.22)}`, x, yb, s);
const sign = (x, y, s = 1) => put(`<polygon points="0,-60 56,40 -56,40" fill="${VOLTA}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M6 -34 L-14 6 L4 6 L-6 32 L16 -6 L-2 -6Z" fill="${INK}"/>`, x, y, s);
const transformer = (x, yb, s = 1) => put(`
  <rect x="-200" y="-380" width="400" height="380" fill="#262634" stroke="${PAPER}" stroke-width="5"/>
  ${[-160, -120, -80, -40, 0, 40, 80, 120, 160].map((dx) => `<path d="M${dx} -340 L${dx} -40" stroke="#14141c" stroke-width="16"/>`).join('')}
  ${[-120, 0, 120].map((dx) => `<g transform="translate(${dx} -380)">${[0, 1, 2, 3, 4].map((k) => `<ellipse cx="0" cy="${-k * 30}" rx="${34 - k * 3}" ry="10" fill="#8a8a9a" stroke="${INK}" stroke-width="3"/>`).join('')}
    <circle cx="0" cy="-150" r="16" fill="${VOLTA}" filter="url(#glow)" class="flick${dx > 0 ? 2 : 1}"/></g>`).join('')}
  ${put(`<polygon points="0,-60 56,40 -56,40" fill="${VOLTA}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M6 -34 L-14 6 L4 6 L-6 32 L16 -6 L-2 -6Z" fill="${INK}"/>`, 0, -180, 1)}`, x, yb, s);
const fence = (y, c = '#2c2c3a') => `<g stroke="${c}" stroke-width="5" opacity=".9">${Array.from({ length: 30 }, (_, i) => `<path d="M${-700 + i * 100} ${y - 380} L${-600 + i * 100} ${y} M${-600 + i * 100} ${y - 380} L${-700 + i * 100} ${y}"/>`).join('')}</g>
  <path d="M-700 ${y - 380} L1780 ${y - 380}" stroke="${c}" stroke-width="12"/>
  ${Array.from({ length: 13 }, (_, i) => `<path d="M${-700 + i * 200} ${y + 20} L${-700 + i * 200} ${y - 420}" stroke="${c}" stroke-width="16"/>`).join('')}`;
const clouds = (y = 200) => `<g fill="#1c1c2a" stroke="#2a2a3c" stroke-width="5">${Array.from({ length: 12 }, () => `<ellipse cx="${f(rnd(-600, W + 600))}" cy="${f(y + rnd(-160, 160))}" rx="${f(rnd(220, 420))}" ry="${f(rnd(80, 150))}"/>`).join('')}</g>
  <g class="flick2" style="animation-duration:1.7s"><rect x="-700" y="-1000" width="${W + 1400}" height="${y + 1200}" fill="${PAPER}" opacity=".05"/></g>`;
const plantBG = (gy, lit = 0.5) => `
  ${BG('#0b0b14')}${clouds(260)}
  ${an('pulse', 0, `<ellipse cx="540" cy="${gy - 300}" rx="900" ry="500" fill="url(#vglow)" opacity="${lit}"/>`, [540, gy - 300], ';animation-iteration-count:infinite')}
  ${coolTower(110, gy - 120, 0.75)}${coolTower(1000, gy - 140, 0.6)}
  ${pylon(-80, gy - 60, 0.8)}${pylon(560, gy - 100, 0.7)}${pylon(1180, gy - 60, 0.8)}
  <g fill="none" stroke="#3a3a48" stroke-width="4">
    <path d="M${-80 - 224} ${gy - 684} Q${240} ${gy - 560} ${560 - 196} ${gy - 646}"/><path d="M${-80 + 224} ${gy - 684} Q${400} ${gy - 590} ${560 + 196} ${gy - 646}"/>
    <path d="M${560 + 196} ${gy - 646} Q${880} ${gy - 560} ${1180 - 224} ${gy - 684}"/><path d="M${560 - 196} ${gy - 646} Q${700} ${gy - 600} ${1180 + 224} ${gy - 684}"/></g>`;
const badgeO = (x, y, s) => put(`<polygon points="0,-90 78,-45 78,45 0,90 -78,45 -78,-45" fill="${INK}" stroke="${RED}" stroke-width="8"/>
  <path d="M-34 26 L-12 26 L-12 12 A40 40 0 1 1 12 12 L12 26 L34 26" fill="none" stroke="${RED}" stroke-width="10" stroke-linejoin="round"/>`, x, y, s);
// robot qui part en tournoyant (chassé par la foudre)
const flung = (t, x, y, s, [dx, dy], rot, amp = 2) => go(t, 1.1, [dx, dy], put(robotG(amp), x, y, s), 'cubic-bezier(.2,.6,.4,1)', rot);
// éclats qui volent (métal)
const shards = (t, cx, cy, n, dist) => Array.from({ length: n }, () => {
  const a = rnd(0, Math.PI * 2), d = rnd(dist * 0.5, dist), sz = rnd(16, 46);
  return an('chunk', t, `<polygon points="${f(cx - sz)},${f(cy - sz * 0.6)} ${f(cx + sz * 0.8)},${f(cy - sz)} ${f(cx + sz)},${f(cy + sz * 0.7)} ${f(cx - sz * 0.5)},${f(cy + sz)}" fill="${INK}" stroke="${PAPER}" stroke-width="4"/>`, [cx, cy], `;--cx:${f(Math.cos(a) * d)}px;--cy:${f(Math.sin(a) * d)}px;--cr:${f(rnd(-300, 300))}deg`);
}).join('');

// =====================================================================
// 1 · Le toit sous la pluie (0 – 4 s) : Volta regarde la centrale au loin, une étincelle faiblarde au bout des doigts
const vH = hand('point', 'ra', 330, 1600, 0.78);
scene(0, 4, cam(0, 4, [[0, 0, 0, 0, 1.0], [4, -40, -60, -1, 1.18]], `
  ${BG('#0b0b14')}${clouds(300)}
  ${an('pulse', 0, `<ellipse cx="780" cy="1040" rx="520" ry="300" fill="url(#vglow)"/>`, [780, 1040], ';animation-iteration-count:infinite')}
  ${put(`${coolTower(-200, 0, 1)}${coolTower(260, 30, 0.8)}${pylon(-560, 40, 0.9)}${pylon(620, 40, 0.9)}<rect x="-500" y="-60" width="1000" height="80" fill="#14141e"/>`, 820, 1110, 0.42)}
  ${an('parx', 0, L.rooftops(1290, '#07070b', VOLTA))}
  ${rain(70, '#9aa3b8', 0.45)}
  ${GROUND(1600, '#050508')}
  <path d="M-700 1600 L1780 1600" stroke="${VOLTA}" stroke-width="4" opacity=".4"/>
  ${put(figure('volta', 'point', { anim: 'idle' }), 330, 1600, 0.78)}
  ${vis(0.8, 4, `${bolt(vH[0], vH[1], vH[0] + 40, vH[1] - 50, VOLTA, 5, 4, 10, 0.8)}${particles(10, VOLTA, [vH[0] - 20, vH[0] + 20], [vH[1] - 20, vH[1] + 20], [30, -80], [2, 4], [0.3, 0.6])}`)}
`, [540, 1100]) + `
  ${header(12, 'La centrale')}
  ${hook('Une étincelle ne suffit plus.', 0.3, 760, 48)}
  ${bubbleFor(0, 440, 500, ["J'ai besoin", 'de courant.'], [-60, 100])}
`);
sfx('hit', 0.05); sfx('rumble', 0.2); sfx('zap', 0.9); sfx('thunder', 2.6);

// 2 · La clôture (4 – 8 s) : l'équipe arrive en courant devant les panneaux « danger », travelling latéral
scene(4, 8, cam(4, 8, [[4, -120, 0, 0, 1.12], [6.2, 0, -10, 0, 1.06], [8, 90, -40, 1.5, 1.14]], `
  ${plantBG(1560, 0.6)}
  ${transformer(760, 1380, 0.75)}
  ${fence(1560)}
  ${[80, 520, 960].map((x) => sign(x, 1330, 0.8)).join('')}
  ${GROUND(1560, '#06060a')}
  ${rain(50, '#9aa3b8', 0.35)}
  ${mv(4, 1.0, [-700, 0], put(figure('mirage', 'run', { anim: 'fight' }), 160, 1600, 0.62))}
  ${mv(4.1, 1.0, [-760, 0], put(figure('givre', 'stand', { anim: 'idle' }), 340, 1610, 0.68))}
  ${mv(4.2, 1.0, [-820, 0], put(figure('echo', 'stand', { anim: 'idle', float: true }), 560, 1590, 0.64))}
  ${mv(4.0, 0.8, [-900, 0], put(figure('volta', 'hips', { anim: 'fight' }), 790, 1620, 0.74, -1))}
  ${particles(20, VOLTA, [500, 1000], [900, 1400], [0, -200], [2, 4], [1, 2], 0.6)}
`, [540, 1200]) + `
  ${bubbleFor(1, 400, 470, ["Volta, c'est", 'trop risqué.'], [-40, 110])}
  ${bubbleFor(2, 640, 470, ['Je sais ce', 'que je fais.'], [120, 110])}
`);
sfx('step', 4.1); sfx('step', 4.4); sfx('step', 4.7); sfx('land', 5.0); sfx('electric', 5.2);

// 3 · La recharge (8 – 12 s) : Volta agrippe les câbles, la foudre la traverse, ses cheveux deviennent blancs
const cH = hand('charge', 'la', 540, 1620, 0.86), cH2 = hand('charge', 'ra', 540, 1620, 0.86);
scene(8, 12, shakeAt(9.0, cam(8, 12, [[8, 0, 80, 0, 1.25], [9.6, 0, 0, 0, 1.05, 'ease-out'], [12, 0, -30, -2, 1.16]], `
  ${BG(INK)}
  ${vis(8, 10, radial(540, 1000, 120, '#3a3410', [260, 480]))}
  ${vis(10, 12, radial(540, 1000, 160, '#6a5a10', [220, 420]))}
  ${an('pulse', 8, `<circle cx="540" cy="1000" r="700" fill="url(#vglow)"/>`, [540, 1000], ';animation-iteration-count:infinite')}
  ${put(`${pylon(-300, 0, 1, '#2e2e3e')}${pylon(300, 0, 1, '#2e2e3e')}`, 540, 1700, 1)}
  ${transformer(540, 1700, 0.9)}
  ${GROUND(1640, '#06060a')}
  ${bolt(-100, 560, cH[0], cH[1], VOLTA, 18, 10, 50, 8.2)}${bolt(1180, 560, cH2[0], cH2[1], VOLTA, 18, 10, 50, 8.3)}
  ${vis(9.0, 12, `${bolt(540, -200, 540, 1000, '#fff', 26, 12, 70, 9.0)}${bolt(cH[0], cH[1], 200, 300, VOLTA, 10, 8, 40, 9.1)}${bolt(cH2[0], cH2[1], 900, 280, VOLTA, 10, 8, 40, 9.2)}`)}
  ${vis(8, 10, an('shakeS', 8.2, put(figure('volta', 'charge', { anim: 'charge', shout: true }), 540, 1620, 0.86), null, ';animation-iteration-count:5'))}
  ${vis(10, 12, an('shakeS', 10, put(voltaX('charge', { anim: 'charge' }), 540, 1620, 0.86), null, ';animation-iteration-count:5'))}
  ${vis(10, 12, aura(540, 1240, VOLTA, 3, 180, 10))}
  ${particles(60, VOLTA, [200, 880], [700, 1600], [0, -600], [3, 8], [0.4, 1])}
`, [540, 1100]), 3) + `
  ${onom(540, 790, 'BZZZZZT !!', 130, -6, VOLTA, INK, 8.4)}
  ${bubbleFor(3, 540, 440, ['Elle aspire', "toute l'énergie !"], [-260, -100])}
  ${flashAt(9.0)}${flashAt(10.0)}
`);
sfx('electric', 8.2); sfx('charge', 8.4); sfx('thunder', 9.0); sfx('powerup', 9.8); sfx('zap', 10.0);

// 4 · L'alarme (12 – 15,5 s) : les Traqueurs atterrissent dans la centrale, viseurs rouges
scene(12, 15.5, cam(12, 15.5, [[12, 0, -80, 0, 1.0], [13.2, 0, 0, 0, 1.06, 'ease-out'], [15.5, -40, 40, 2, 1.16]], `
  ${plantBG(1560, 0.35)}
  <g class="flick1" style="animation-duration:.9s"><rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="${RED}" opacity=".1"/></g>
  ${swarm(10, [-100, 1180], [400, 800], [0.25, 0.45])}
  ${GROUND(1560, '#06060a')}
  ${an('descend', 12.0, put(robotG(1), 210, 1560 - 700 * 0.4, 0.4))}
  ${an('descend', 12.25, put(robotG(1), 870, 1560 - 700 * 0.4, 0.4))}
  ${an('descend', 12.5, put(robotG(1.2), 540, 1560 - 700 * 0.5, 0.5))}
  ${vis(12.9, 15.5, `${an('impact', 12.9, burst(540, 1560, 60, 200, 12, '#fff', RED), [540, 1560])}${smoke(540, 1560, 8, 380, '#3a3a44', 0.8)}`)}
  ${vis(13.5, 15.5, an('scan', 13.5, `<polygon points="540,1100 200,1560 880,1560" fill="${RED}" opacity=".18"/>`, [540, 1100]))}
`, [540, 1200]) + `
  ${an('blink', 13.0, `<rect x="210" y="236" width="660" height="80" fill="${INK}" stroke="${RED}" stroke-width="5"/><text x="540" y="290" class="rt" style="font-size:40px" fill="${RED}">ALERTE · SECTEUR 7</text>`, null, ';animation-iteration-count:infinite')}
  ${bubbleFor(4, 540, 520, ['Cible détectée.', 'Neutralisation.'], [0, 100])}
`);
sfx('siren', 12.0); sfx('whoosh', 12.1); sfx('land', 12.9); sfx('alarm', 13.0); sfx('scan', 13.5);

// 5 · Le retour (15,5 – 19 s) : les yeux s'ouvrent en gros plan, puis Volta surchargée, cheveux blancs-jaunes
scene(15.5, 19, `
  ${vis(15.5, 17.0, cam(15.5, 17.0, [[15.5, 0, 0, 0, 1.0], [17.0, 0, -10, 1, 1.1]], `
    ${BG(INK)}
    ${radial(540, 960, 130, '#4a3c0c', [520, 700])}
    ${streaks(20, VOLTA, [200, 1700], 900, [3, 6], [0.2, 0.4], -8)}
    ${an('inL', 15.5, panel('ex', 40, 660, 1000, 600, an('zoomP', 15.5, `
      ${radial(540, 960, 110, '#5a4a10', [380, 520])}
      ${bolt(60, 740, 1020, 860, VOLTA, 10, 10, 40, 15.5)}${bolt(80, 1200, 1000, 1140, VOLTA, 10, 10, 40, 15.6)}
      ${particles(20, HAIRX, [60, 1020], [680, 1240], [0, -140], [2, 5], [0.6, 1.2])}
      ${an('eyeOpen', 15.6, bigEyes(540, 990, 'voltaX'), [540, 990])}`, [540, 960]), '#211d08'))}`, [540, 960]))}
  ${vis(17.0, 19, shakeAt(17.0, cam(17.0, 19, [[17.0, 0, 0, 0, 1.25], [17.5, 0, 0, 0, 1.04, 'ease-out'], [19, 0, -30, 0, 1.12]], `
    ${BG('#141008')}
    ${radial(540, 1150, 170, '#5a4a10', [300, 520])}
    ${an('pulse', 17, `<circle cx="540" cy="1150" r="760" fill="url(#vglow)"/>`, [540, 1150], ';animation-iteration-count:infinite')}
    ${GROUND(1640, '#06060a')}
    ${aura(540, 1300, HAIRX, 3, 200, 17.0)}
    ${put(voltaX('hips', { anim: 'fight' }), 540, 1640, 1.0)}
    ${bolt(380, 1100, 300, 860, VOLTA, 8, 6, 20, 17)}${bolt(700, 1100, 790, 880, VOLTA, 8, 6, 20, 17.1)}
    ${particles(50, VOLTA, [200, 880], [900, 1640], [0, -500], [3, 8], [0.5, 1.2])}`, [540, 1200]), 2))}
  ${bubbleFor(5, 540, 440, ['Je suis', 'de retour !'], [0, 100])}
  ${vis(17.0, 19, tag(70, 236, 'VOLTA', 'SURCHARGÉE', VOLTA, 17.1))}
  ${flashAt(17.0)}
`);
sfx('eye', 15.6); sfx('charge', 15.8); sfx('bigboom', 17.0); sfx('electric', 17.3);

// 6 · La tempête (19 – 21,2 s) : Volta flotte, la foudre part dans toutes les directions, les robots valsent
scene(19, 21.2, shakeAt(19.4, cam(19, 21.2, [[19, 0, 0, 0, 1.0], [19.4, 0, 0, 0, 1.08, 'ease-in'], [21.2, 30, -40, -2, 1.16]], `
  ${plantBG(1600, 0.9)}
  ${GROUND(1600, '#06060a')}
  ${flung(19.4, 150, 1250, 0.32, [-700, -500], -200)}
  ${flung(19.5, 930, 1250, 0.32, [700, -600], 220)}
  ${flung(19.6, 300, 1330, 0.28, [-600, 300], -140)}
  ${flung(19.65, 800, 1340, 0.28, [600, 200], 160)}
  ${vis(19.3, 21.2, `${[[150, 1250], [930, 1250], [300, 1330], [800, 1340], [-100, 400], [1180, 380]].map(([x, y], i) => bolt(540, 980, x, y, i < 4 ? VOLTA : HAIRX, 16, 9, 50, 19.3)).join('')}
    ${[[150, 1250], [930, 1250]].map(([x, y]) => an('impact', 19.45, burst(x, y, 50, 170, 11, '#fff', VOLTA), [x, y])).join('')}`)}
  ${an('bob', 19, put(voltaX('float', { anim: 'cast', float: true }), 540, 1330, 0.72), null, ';animation-iteration-count:infinite')}
  ${particles(60, VOLTA, [-100, 1180], [600, 1600], [0, -500], [3, 8], [0.5, 1.2])}
  ${vis(19.4, 21.2, streaks(24, VOLTA, [400, 1500], 900, [3, 6], [0.15, 0.3], -10))}
`, [540, 1100]), 3) + `
  ${onom(540, 430, 'ZZRAAAK !!', 150, -6, VOLTA, INK, 19.35)}
  ${flashAt(19.35)}
`);
sfx('thunder', 19.3); sfx('zap', 19.35); sfx('boom', 19.45); sfx('klang', 19.6); sfx('whoosh', 19.7);

// 7 · Les spectateurs (21,2 – 23 s) : Mirage, Givre et Écho derrière la clôture, visages éclairés en jaune
scene(21.2, 23, cam(21.2, 23, [[21.2, 0, 40, 0, 1.18], [23, -30, 0, 1, 1.08]], `
  ${BG('#120f06')}
  ${an('pulse', 21.2, `<rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="${VOLTA}" opacity=".12"/>`, [540, 960], ';animation-iteration-count:infinite')}
  ${radial(540, 760, 90, '#3a3410', [200, 400])}
  ${GROUND(1640, '#06060a')}
  ${put(figure('givre', 'guard', { anim: 'idle' }), 250, 1640, 0.82)}
  ${put(figure('mirage', 'hips', { anim: 'idle' }), 560, 1650, 0.86, -1)}
  ${put(figure('echo', 'stand', { anim: 'idle', float: true }), 850, 1630, 0.8, -1)}
  ${fence(1700, '#1a1a24')}
  ${particles(40, VOLTA, [-100, 1180], [200, 1500], [200, -200], [2, 6], [0.6, 1.4], 0.8)}
`, [540, 1300]) + `
  ${bubbleFor(6, 540, 600, ['Rappelez-moi de', "ne pas l'énerver."], [20, 110])}
`);
sfx('rumble', 21.2); sfx('zap', 22.0);

// 8 · Le coup de poing (23 – 27 s) : le dernier Traqueur fonce, Volta frappe, le robot vole en éclats
scene(23, 27, shakeAt(24.9, cam(23, 27, [[23, 60, 0, 2, 1.12], [24.8, -20, -20, -2, 1.24, 'ease-in'], [25.0, 0, 0, 0, 1.3], [27, 0, 0, 1, 1.05, 'ease-out']], `
  ${BG(PAPER)}
  <rect x="-700" y="-1000" width="${W + 1400}" height="2600" fill="url(#tone)" opacity=".25"/>
  ${radial(720, 1050, 160, INK, [300, 520])}
  ${GROUND(1600)}
  ${vis(23, 24.9, mv(23, 1.6, [240, -80], put(robotG(2.5), 800, 1050, 0.6), 'ease-in'))}
  ${vis(23, 25.6, put(voltaX('throw', { anim: 'fight' }), 260, 1600, 0.8))}
  ${vis(24.6, 25.6, bolt(hand('throw', 'ra', 260, 1600, 0.8)[0], hand('throw', 'ra', 260, 1600, 0.8)[1], 820, 1060, '#fff', 40, 9, 30, 24.6))}
  ${vis(24.9, 27, `${an('impact', 24.9, an('spinS', 24.9, burst(800, 1050, 120, 380, 14, '#fff', VOLTA), [800, 1050]), [800, 1050])}
    ${cracks(800, 1050, 8, 260, INK, 6)}${shards(24.9, 800, 1050, 18, 900)}
    ${an('drift', 25.1, smoke(760, 1150, 12, 420, '#bdb8ac', 0.9))}`)}
  ${vis(25.6, 27, put(voltaX('hips', { anim: 'idle' }), 260, 1600, 0.8))}
  ${particles(40, VOLTA, [100, 1000], [800, 1500], [0, -500], [3, 8], [0.5, 1.2])}
`, [540, 1100]), 4) + `
  ${bubbleFor(7, 360, 460, ['Dégage,', 'le robot !'], [-40, 110])}
  ${vis(24.9, 27, onom(620, 640, 'KRA-KOOOM !!', 130, -5, VOLTA, INK, 24.95))}
  ${flashAt(24.9)}
`);
sfx('charge', 23.2); sfx('whoosh', 23.6); sfx('punch', 24.8); sfx('bigboom', 24.9); sfx('klang', 25.1);

// 9 · Après la bataille (27 – 31 s) : fumée, les trois l'entourent, Volta fait la maline
scene(27, 31, cam(27, 31, [[27, 0, 60, 0, 1.2], [29.1, 0, 0, 0, 1.06], [31, 80, -30, 1, 1.14]], `
  ${plantBG(1580, 0.4)}
  ${an('drift', 27, smoke(540, 1560, 10, 640, '#3a3a44', 0.8))}
  ${GROUND(1580, '#06060a')}
  ${put(robotG(0.2), 880, 1560, 0.3, 1, 80)}${put(robotG(0.2), 130, 1570, 0.26, -1, -78)}
  ${particles(40, '#8a8578', [-200, 1200], [600, 1700], [300, -60], [2, 5], [1.5, 3], 0.6)}
  ${put(figure('givre', 'stand', { anim: 'idle' }), 200, 1600, 0.66)}
  ${mv(27.2, 1.2, [-80, 0], put(figure('echo', 'stand', { anim: 'idle', float: true }), 410, 1580, 0.66))}
  ${put(figure('mirage', 'hips', { anim: 'idle' }), 860, 1600, 0.66, -1)}
  ${put(voltaX('hips', { anim: 'idle' }), 640, 1610, 0.74, -1)}
  ${particles(16, VOLTA, [580, 700], [1080, 1180], [0, -160], [2, 5], [0.4, 0.9])}
`, [600, 1300]) + `
  ${bubbleFor(8, 430, 560, ['Ta coiffure', 'a changé !'], [-20, 110])}
  ${bubbleFor(9, 620, 560, ['Nouveau look,', 'non ?'], [20, 110])}
`);
sfx('wind', 27.0); sfx('zap', 29.4);

// 10 · Le message (31 – 34,5 s) : le badge Ω de Mirage grésille, un écran vert s'ouvre
const mH = hand('castUp', 'ra', 340, 1600, 0.8);
scene(31, 34.5, cam(31, 34.5, [[31, 0, 0, 0, 1.0], [34.5, 60, 80, -1, 1.2]], `
  ${BG('#06100a')}
  ${radial(540, 1000, 120, '#0d3a20', [300, 520])}
  ${an('pulse', 31, `<circle cx="${f(mH[0])}" cy="${f(mH[1])}" r="520" fill="url(#gglow)"/>`, [mH[0], mH[1]], ';animation-iteration-count:infinite')}
  ${GROUND(1600, '#04080a')}
  ${put(figure('mirage', 'castUp', { anim: 'idle', glow: true }), 340, 1600, 0.8)}
  ${an('spinS', 31.2, badgeO(f(mH[0]), f(mH[1] - 30), 0.45), [mH[0], mH[1] - 30])}
  ${put(voltaX('stand', { anim: 'idle' }), 800, 1610, 0.66, -1)}
  ${vis(31.6, 34.5, an('beamIn', 31.6, holo(470, 660, 540, 340, `
    <text x="740" y="740" class="rt" style="font-size:36px;fill:${MIRAGE}">MESSAGE ENTRANT</text>
    <text x="740" y="800" class="rt" style="font-size:36px;fill:${MIRAGE}">SOURCE : LABO Ω</text>
    ${an('blink', 32, `<rect x="600" y="850" width="280" height="90" fill="${MIRAGE}" opacity=".3"/><text x="740" y="910" class="rt" style="font-size:44px;fill:#fff">▶ LIRE</text>`, null, ';animation-iteration-count:infinite')}`, MIRAGE), [740, 830]))}
  ${particles(30, MIRAGE, [300, 1000], [700, 1500], [0, -200], [2, 5], [1, 2])}
`, [540, 1200]) + `
  ${bubbleFor(10, 420, 520, ['Un message…', 'du labo.'], [-40, 110])}
`);
sfx('beep', 31.2); sfx('holo', 31.6); sfx('beep', 32.4);

// 11 · « On veut se battre » + carton final (34,5 – 40 s) : écran géant, mutants libérés dans les cuves brisées
const mutants = [['rose', 'castUp', 220], ['braise', 'charge', 420], ['jade', 'guard', 660], ['azur', 'point', 860]];
scene(34.5, 40, cam(34.5, 40, [[34.5, 0, 120, 0, 1.25], [36.6, 0, 0, 0, 1.0, 'ease-out'], [40, 0, -30, 0, 1.05]], `
  ${BG('#03060a')}
  ${holo(60, 340, 960, 1300, `
    <rect x="60" y="340" width="960" height="1300" fill="#041a0e"/>
    ${radial(540, 1100, 90, '#0d3a20', [260, 460])}
    ${[160, 380, 620, 860].map((x, i) => `<g opacity=".6">${put(`<rect x="-110" y="-700" width="220" height="660" rx="30" fill="none" stroke="${['#ff5fa2', ORANGE, '#19d3b0', '#4d7bff'][i]}" stroke-width="8"/>${cracks(0, -360, 5, 160, PAPER, 4)}`, x + 40, 1560, 0.95)}</g>`).join('')}
    ${mutants.map(([k, p, x], i) => an('pop', 34.6 + i * 0.15, put(figure(k, p, { anim: 'fight', glow: true }), x, 1580, 0.84, i % 2 ? -1 : 1))).join('')}
    ${particles(40, MIRAGE, [80, 1000], [400, 1600], [0, -300], [2, 5], [1, 2])}`, MIRAGE)}
`, [540, 1100]) + `
  ${bubbleFor(11, 540, 470, ['On veut se battre', 'avec vous.'], [0, 110])}
  ${finalCard(36.9, 'ÉPISODE 13 BIENTÔT', 640)}
`);
sfx('holo', 34.5); sfx('crowd', 35.2); sfx('eye', 36.9); sfx('hit', 37.0);

L.build(import.meta.url, 'les-anomalies-ep12');
