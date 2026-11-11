// « LES ANOMALIES » ép. 10 · Le Colosse : manga d'action, 40 s, 1080x1920 (Reel).
// Sortis de la Tour, les quatre fuient dans la rue quand le sol tremble : le Colosse, Traqueur géant à deux yeux,
// se dresse. Volta l'attaque de front… et son pouvoir est absorbé. Fin : Volta s'effondre, ses mains ne crépitent plus.
// Usage : node make.mjs → les-anomalies-ep10.svg + timeline.json (lu par audio.py)
import * as L from '../les-anomalies/lib.mjs';
const { W, H, PAPER, INK, NIGHT, RED, VOLTA, GIVRE, ECHO, MIRAGE, ORANGE, rnd, f, vis, scene, an, radial, burst, cracks, bolt, onom, panel,
  bubbleFor, tag, figure, hand, put, bigEyes, robotG, aura, crystal, smoke, BG, GROUND, cam, particles, streaks, shakeAt,
  flashAt, sfx, mv, go, anim, fadeIn, fadeOut, ghost, bobbing, holo, tower, header, hook, finalCard, city, car, searchlight } = L;
L.reseed(10 * 101);

const LINES = [
  { who: 'volta', t0: 1.8, t1: 3.2, text: 'On est dehors !' },
  { who: 'givre', t0: 5.2, t1: 6.8, text: 'Le sol bouge, attention !' },
  { who: 'colosse', t0: 9.4, t1: 11.7, text: 'Cibles identifiées. Destruction.' },
  { who: 'echo', t0: 14.0, t1: 15.4, text: "Rien ne l'arrête !" },
  { who: 'volta', t0: 15.9, t1: 17.2, text: "Je m'en occupe !" },
  { who: 'givre', t0: 17.5, t1: 18.9, text: "Non, c'est un piège !" },
  { who: 'colosse', t0: 23.2, t1: 25.0, text: "Absorption de l'énergie." },
  { who: 'volta', t0: 25.2, t1: 26.9, text: 'Il me prend mon énergie !' },
  { who: 'echo', t0: 28.2, t1: 29.7, text: 'Je te tiens, Volta !' },
  { who: 'givre', t0: 31.9, t1: 33.3, text: 'Volta, réponds !' },
  { who: 'volta', t0: 35.0, t1: 36.7, text: 'Je ne sens plus rien…' },
];
L.setLines(LINES);

// Volta vidée de son pouvoir : même silhouette, couleur éteinte
const DEAD = '#8d8676';
L.addChar('voltaGris', { accent: DEAD, hair: 'spiky' });

// bulle « robot » (rectangulaire, rouge) pour le Colosse : bubbleFor ne la donne qu'à who === 'robot'
const robotBubble = (k, ...a) => { const w = LINES[k].who; LINES[k].who = 'robot'; const s = bubbleFor(k, ...a); LINES[k].who = w; return s; };

// ---------- Le Colosse ----------
// colosse(œil) : Traqueur géant à deux yeux ; les lumières (yeux, Ω, mains) prennent la couleur donnée
const colosse = (eye = ORANGE, amp = 0.5) => robotG(amp, { twin: true, eye });
// pied géant (pour la chute) : origine = semelle au centre
const giantFoot = `<g>
  <path d="M-150 -2400 L150 -2400 L170 -300 L-170 -300Z" fill="${INK}" stroke="${PAPER}" stroke-width="6"/>
  <path d="M-150 -2400 L-170 -300 L-80 -300 L-60 -2400Z" fill="url(#toneL)" opacity=".5"/>
  <path d="M-160 -900 L160 -900 M-165 -620 L165 -620" stroke="${ORANGE}" stroke-width="14" filter="url(#glow)"/>
  <path d="M-340 0 L-300 -220 L-170 -330 L230 -330 L330 -200 L400 0Z" fill="${INK}" stroke="${PAPER}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M-300 -110 L370 -110" stroke="${ORANGE}" stroke-width="10" filter="url(#glow)"/>
  <g fill="${PAPER}" opacity=".7"><circle cx="-230" cy="-170" r="10"/><circle cx="260" cy="-170" r="10"/></g></g>`;
// rue de nuit en perspective (point de fuite au centre, horizon y0)
const street = (y0, lit = RED) => `
  ${BG(NIGHT)}<rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="url(#toneP)" opacity=".1"/>
  ${an('parx', 0, city(y0, '#07070b', lit))}
  ${GROUND(y0, '#101018')}
  <polygon points="540,${y0} -700,${H + 600} 1780,${H + 600}" fill="#16161f"/>
  ${Array.from({ length: 7 }, (_, i) => { const k = Math.pow(0.68, i), y = y0 + 900 * k; return `<polygon points="${f(540 - 16 * k)},${f(y)} ${f(540 + 16 * k)},${f(y)} ${f(540 + 10 * k)},${f(y - 160 * k)} ${f(540 - 10 * k)},${f(y - 160 * k)}" fill="${PAPER}" opacity=".5"/>`; }).join('')}`;
// mains de Volta en gros plan (paume vers le haut), couleur des gants
const palm = (c) => `<g>
  <path d="M-70 60 L-90 -40 Q-92 -80 -60 -86 L60 -86 Q92 -80 90 -40 L70 60Z" fill="${c}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
  ${[-60, -20, 20, 60].map((x, i) => `<rect x="${x - 18}" y="${-86 - [110, 140, 132, 100][i]}" width="36" height="${[120, 150, 142, 110][i]}" rx="18" fill="${c}" stroke="${INK}" stroke-width="8"/>`).join('')}
  <rect x="84" y="-70" width="34" height="100" rx="17" fill="${c}" stroke="${INK}" stroke-width="8" transform="rotate(-38 100 -20)"/>
  <path d="M-60 -20 Q0 10 60 -20" stroke="${INK}" stroke-width="4" fill="none" opacity=".6"/>
  <path d="M-80 60 L80 60 L90 140 L-90 140Z" fill="${INK}"/></g>`;
// passage couleur → gris d'une figure (scintillement puis extinction)
const drain = (t, d, yellowFig, greyFig) => `${greyFig}${vis(0, t + d, fadeOut(t, d, `<g class="flick1" style="animation-delay:${t}s">${yellowFig}</g>`))}`;

// =====================================================================
// 1 · La fuite (0 – 4 s) : les quatre jaillissent de la Tour, alarme, projecteurs
scene(0, 4, cam(0, 4, [[0, 0, -60, 0, 1.18], [4, 0, 30, -1, 1.0]], `
  ${street(1420)}
  ${an('pulse', 0, `<circle cx="540" cy="700" r="640" fill="url(#rglow)"/>`, [540, 700], ';animation-iteration-count:infinite')}
  ${searchlight(250, 'swayL', 0)}${searchlight(830, 'swayR', 0)}
  ${tower(540, 1420, 0.62)}
  ${an('blink', 0, `<rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="${RED}" opacity=".1"/>`, null, ';animation-iteration-count:infinite')}
  ${particles(30, RED, [-100, 1180], [400, 1500], [0, -260], [2, 5], [1.2, 2.4], 0.7)}
  ${anim(0, 4, ['0%{transform:translate(0,-60px) scale(.8)}', '100%{transform:translate(0,30px) scale(1)}'], `
    ${put(figure('givre', 'run', { anim: 'fight' }), 250, 1640, 0.6)}
    ${put(figure('mirage', 'run', { anim: 'fight' }), 900, 1620, 0.55, -1)}
    ${put(figure('echo', 'float', { anim: 'idle', float: true }), 760, 1560, 0.56, -1)}
    ${put(figure('volta', 'run', { anim: 'fight', glow: true }), 500, 1700, 0.68)}
    ${particles(20, VOLTA, [440, 600], [1150, 1300], [0, -160], [2, 5], [0.3, 0.7])}`, { origin: [540, 1700], ease: 'linear' })}
  ${streaks(16, PAPER, [600, 1700], -500, [2, 4], [0.3, 0.5], 90)}
`, [540, 1000]) + `
  ${header(10, 'Le Colosse')}
  ${hook('Ils ont réveillé un géant.', 0.3, 800)}
  ${bubbleFor(0, 560, 560, ['On est dehors !'], [-40, 100])}
`);
sfx('hit', 0.05); sfx('siren', 0.2); sfx('alarm', 0.6); sfx('step', 1.2); sfx('step', 1.6); sfx('step', 2.0); sfx('step', 2.4); sfx('whoosh', 3.0);

// 2 · Le séisme (4 – 8 s) : la rue se fend, les voitures sautent, un pied géant s'écrase
scene(4, 8, shakeAt(6.9, shakeAt(4.6, cam(4, 8, [[4, 0, 0, 0, 1.12], [6.8, 0, -30, 1, 1.2], [7.0, 0, 0, 0, 1.04, 'ease-out'], [8, -30, -10, -1, 1.1]], `
  ${street(1300, ORANGE)}
  ${anim(5.9, 1.0, ['0%{opacity:0;transform:scale(.3,.3)}', '100%{opacity:.85;transform:scale(1,1)}'], `<ellipse cx="560" cy="1330" rx="520" ry="70" fill="#000"/>`, { origin: [560, 1330], ease: 'ease-in' })}
  ${anim(6.4, 0.5, ['0%{transform:translate(0,-2400px)}', '100%{transform:translate(0,0)}'], put(giantFoot, 560, 1330, 0.75), { ease: 'cubic-bezier(.5,0,.9,.6)' })}
  ${vis(6.9, 8, `${an('impact', 6.9, burst(560, 1320, 90, 360, 14, '#fff', ORANGE), [560, 1320])}
    ${an('drift', 6.9, smoke(560, 1420, 9, 700, '#3a3a46', 0.55))}
    ${particles(40, '#8a8578', [100, 1000], [1250, 1400], [0, -700], [4, 10], [0.6, 1.2])}`)}
  ${vis(4.6, 8, `<g class="flick1" style="animation-duration:.3s">${cracks(540, 1560, 8, 380, ORANGE, 7)}</g>`)}
  ${an('wob', 4.6, put(car(0, 0, 1, RED), 200, 1560, 0.8), [200, 1560], ';animation-iteration-count:6;animation-duration:.18s')}
  ${an('wob', 4.7, put(car(0, 0, 1, GIVRE), 900, 1580, 0.7, -1), [900, 1580], ';animation-iteration-count:6;animation-duration:.2s')}
  ${an('shakeS', 4.6, `
    ${put(figure('givre', 'guard', { anim: 'fight' }), 280, 1660, 0.7)}
    ${put(figure('volta', 'hips', { anim: 'idle', glow: true }), 540, 1680, 0.72)}
    ${put(figure('echo', 'stand', { anim: 'idle', float: true }), 760, 1630, 0.62, -1)}
    ${put(figure('mirage', 'guard', { anim: 'fight' }), 930, 1650, 0.56, -1)}`, null, ';animation-iteration-count:8')}
  ${particles(30, '#6a6a78', [-100, 1180], [0, 900], [0, 500], [2, 5], [0.8, 1.6], 0.7)}
`, [540, 1300]), 3, 'shakeS'), 3) + `
  ${vis(4.6, 6.9, onom(560, 1000, 'GRRRRRR…', 90, -3, ORANGE, INK, 4.6))}
  ${bubbleFor(1, 400, 560, ['Le sol bouge,', 'attention !'], [-60, 100])}
  ${vis(6.9, 8, onom(560, 820, 'DOOOM !!', 150, -6, PAPER, INK, 6.9))}
  ${flashAt(6.9)}
`);
sfx('rumble', 4.4); sfx('rumble', 5.6); sfx('step', 6.0); sfx('whoosh', 6.4); sfx('bigboom', 6.9);

// 3 · Le Colosse se dresse (8 – 12 s) : panoramique des pieds à la tête, les deux yeux orange s'allument
const C3 = [540, 1640, 0.9]; // x, pieds, échelle
const c3y = C3[1] - 700 * C3[2];
scene(8, 12, cam(8, 12, [[8, 0, -620, 0, 1.45], [9.5, 0, 0, 0, 1.0, 'ease-out'], [12, 0, 20, 1, 1.05]], `
  ${BG(NIGHT)}
  ${an('pulse', 8, `<circle cx="540" cy="800" r="760" fill="url(#rglow)"/>`, [540, 800], ';animation-iteration-count:infinite')}
  ${radial(540, 800, 120, '#24242f', [420, 700])}
  ${an('parx', 8, city(1500, '#07070b', ORANGE))}
  ${GROUND(1640, '#0b0b12')}
  ${put(colosse(ORANGE, 0.6), C3[0], c3y, C3[2])}
  ${vis(8, 9.05, put(`<rect x="-120" y="-470" width="240" height="60" fill="#2a0005"/>`, C3[0], c3y, C3[2]))}
  ${an('eyeOpen', 9.0, `<circle cx="${C3[0]}" cy="${f(c3y - 442 * C3[2])}" r="260" fill="url(#rglow)"/>`, [C3[0], f(c3y - 442 * C3[2])])}
  ${an('drift', 8, smoke(540, 1700, 10, 900, '#2e2e3a', 0.5))}
  ${particles(40, '#8a8578', [100, 980], [300, 1500], [0, 600], [3, 9], [0.8, 1.6])}
  ${particles(30, ORANGE, [150, 930], [500, 1500], [0, -300], [2, 5], [1, 2], 0.8)}
  ${put(figure('givre', 'guard', { anim: 'idle' }), 120, 1650, 0.24)}
  ${put(figure('volta', 'hips', { anim: 'idle', glow: true }), 200, 1650, 0.25)}
  ${put(figure('echo', 'stand', { anim: 'idle', float: true }), 880, 1640, 0.23, -1)}
  ${put(figure('mirage', 'guard', { anim: 'idle' }), 960, 1650, 0.22, -1)}
`, [540, 960]) + `
  ${tag(70, 1360, 'LE COLOSSE', 'ROBOT GÉANT', ORANGE, 9.3)}
  ${robotBubble(2, 540, 378, ['Cibles identifiées.', 'Destruction.'], [0, 40])}
`);
sfx('rumble', 8.0); sfx('step', 8.4); sfx('eye', 9.0); sfx('lock', 9.3); sfx('lock', 9.45);

// 4 · Premier assaut (12 – 15,5 s) : lasers orange, mur de glace de Givre, Écho lui lance une voiture
const C4 = [620, 1260, 0.55], c4y = C4[1] - 700 * C4[2];
const eyeL = [C4[0] - 60 * C4[2], c4y - 442 * C4[2]], eyeR = [C4[0] + 60 * C4[2], c4y - 442 * C4[2]], chest4 = [C4[0], c4y - 110 * C4[2]];
const ice4 = [[560, 160, 300, -14], [660, 190, 360, 6], [760, 150, 280, 16]].map(([x, w, h, l]) => crystal(x, 1560, w, h, l)).join('');
scene(12, 15.5, shakeAt(14.1, cam(12, 15.5, [[12, 40, 0, 2, 1.12], [13.9, -20, -20, 0, 1.04], [14.2, 0, 0, 0, 1.1, 'ease-out'], [15.5, -50, 20, -2, 1.16]], `
  ${street(1260, ORANGE)}
  ${put(colosse(ORANGE, 1.2), C4[0], c4y, C4[2])}
  ${vis(12, 12.9, `<g class="flick1">${[eyeL, eyeR].map(([x, y], i) => `<polygon points="${f(x)},${f(y)} ${640 + i * 50},1400 ${690 + i * 50},1400" fill="${ORANGE}" filter="url(#glow)"/>`).join('')}</g>`)}
  ${an('rise', 12.05, ice4)}
  ${vis(12.3, 13.2, `${an('impact', 12.3, burst(680, 1390, 50, 200, 12, '#fff', ORANGE), [680, 1390])}${particles(30, '#c8f1ff', [580, 780], [1300, 1450], [0, -300], [3, 7], [0.4, 0.8])}`)}
  ${put(figure('givre', 'cast', { glow: true, anim: 'cast' }), 900, 1640, 0.7, -1)}
  ${an('bob', 12, put(figure('echo', 'throw', { float: true, glow: true, anim: 'cast' }), 200, 1600, 0.72), null, ';animation-iteration-count:infinite')}
  ${aura(330, 1250, ECHO, 3, 70, 12.2)}
  ${anim(12.4, 2.4, ['0%{transform:translate(0,0) rotate(0deg)}', '30%{transform:translate(-20px,-300px) rotate(-12deg)}', '62%{transform:translate(' + f(chest4[0] - 360) + 'px,' + f(chest4[1] - 1460) + 'px) rotate(18deg)}', '100%{transform:translate(480px,140px) rotate(150deg)}'],
    `${an('flick1', 0, `<circle cx="360" cy="1420" r="150" fill="${ECHO}" opacity=".25" filter="url(#glow)"/>`)}${put(car(0, 0, 1, ECHO), 360, 1460, 0.6)}`, { origin: [360, 1420], ease: 'linear' })}
  ${vis(13.9, 15.5, `${an('impact', 13.9, burst(chest4[0], chest4[1], 40, 170, 10, '#fff', ECHO), chest4)}${particles(24, ECHO, [chest4[0] - 80, chest4[0] + 80], [chest4[1] - 60, chest4[1] + 60], [0, 400], [3, 6], [0.5, 1])}`)}
  ${particles(30, ORANGE, [0, W], [600, 1600], [0, -260], [2, 5], [1, 2], 0.6)}
`, [540, 1200]), 2, 'shakeS') + `
  ${vis(12.3, 13.9, onom(700, 1000, 'KRAK !', 100, 6, GIVRE, INK, 12.3))}
  ${bubbleFor(3, 270, 620, ['Rien ne', "l'arrête !"], [-20, 110])}
  ${vis(13.9, 15.5, onom(680, 760, 'KLANG !', 110, 8, ECHO, INK, 13.9))}
`);
sfx('laser', 12.0); sfx('iceWall', 12.1); sfx('tk', 12.3); sfx('whoosh', 13.2); sfx('klang', 13.9); sfx('land', 14.8);

// 5 · Volta se charge (15,5 – 19,5 s) : foudre, cheveux dressés ; Givre tente de la retenir
const vH = hand('charge', 'ra', 600, 1660, 0.95), vH2 = hand('charge', 'la', 600, 1660, 0.95);
scene(15.5, 19.5, cam(15.5, 19.5, [[15.5, 0, 40, 0, 1.0], [17.4, 0, -20, 1, 1.1], [19.5, 30, -60, -1, 1.18]], `
  ${BG(INK)}
  ${radial(600, 1100, 160, '#3a3410', [260, 520])}
  ${an('pulse', 15.5, `<circle cx="600" cy="1100" r="700" fill="url(#vglow)"/>`, [600, 1100], ';animation-iteration-count:infinite')}
  ${GROUND(1660, '#07070b')}
  ${aura(600, 1250, VOLTA, 4, 120, 15.5)}
  ${an('shakeS', 15.6, put(figure('volta', 'charge', { glow: true, anim: 'charge' }), 600, 1660, 0.95), null, ';animation-iteration-count:infinite')}
  ${bolt(f(vH[0]), f(vH[1]), f(vH2[0]), f(vH2[1]), VOLTA, 10, 7, 40, 15.5)}
  ${bolt(f(vH[0]), f(vH[1]), 1100, 500, VOLTA, 8, 8, 50, 16.0)}${bolt(f(vH2[0]), f(vH2[1]), -40, 560, VOLTA, 8, 8, 50, 16.3)}
  ${particles(60, VOLTA, [300, 900], [900, 1700], [0, -700], [3, 8], [0.4, 0.9])}
  ${vis(17.3, 19.5, mv(17.3, 0.45, [-500, 0], put(figure('givre', 'point', { anim: 'fight', shout: true }), 190, 1680, 0.82)))}
`, [600, 1200]) + `
  ${bubbleFor(4, 560, 600, ["Je m'en occupe !"], [40, 110])}
  ${bubbleFor(5, 330, 680, ["Non, c'est", 'un piège !'], [-110, 130])}
`);
sfx('charge', 15.5); sfx('electric', 16.0); sfx('zap', 16.4); sfx('whoosh', 17.3); sfx('electric', 18.2);

// 6 · L'attaque de front (19,5 – 23 s) : bond, éclair en plein Ω… qui ne lui fait rien
const C6 = [720, 1660, 0.82], c6y = C6[1] - 700 * C6[2], chest6 = [C6[0], c6y - 110 * C6[2]];
const lH = hand('throw', 'ra', 240, 1100, 0.74);
scene(19.5, 23, shakeAt(20.6, cam(19.5, 23, [[19.5, -60, 60, -3, 1.2], [20.5, 0, 0, 0, 1.0, 'ease-out'], [23, 30, -30, 2, 1.12]], `
  ${BG(PAPER)}
  <rect x="-700" y="-1000" width="${W + 1400}" height="2700" fill="url(#tone)" opacity=".25"/>
  ${radial(chest6[0], chest6[1], 150, INK, [300, 560])}
  ${GROUND(1660)}
  ${an('shakeS', 20.6, put(colosse(ORANGE, 1.0), C6[0], c6y, C6[2]), null, ';animation-iteration-count:4')}
  ${vis(22.0, 23, fadeIn(22.0, 0.8, `<g filter="url(#glow)"><circle cx="${chest6[0]}" cy="${f(chest6[1])}" r="150" fill="url(#vglow)"/>
    ${put(`<path d="M-56 -100 L-24 -100 L-24 -120 A62 62 0 1 1 24 -120 L24 -100 L56 -100" fill="none" stroke="${VOLTA}" stroke-width="18" stroke-linejoin="round"/>`, C6[0], c6y, C6[2])}</g>`))}
  ${an('leapA', 19.5, put(figure('volta', 'throw', { glow: true, anim: 'fight', shout: true }), 240, 1100, 0.74, 1, -8), null, ';animation-duration:1s')}
  ${vis(20.5, 23, `${bolt(f(lH[0]), f(lH[1]), chest6[0], f(chest6[1]), VOLTA, 26, 11, 60, 20.5)}${bolt(f(lH[0]), f(lH[1]), chest6[0] + 40, f(chest6[1]) + 30, VOLTA, 12, 9, 40, 20.55)}
    ${an('impact', 20.6, burst(chest6[0], chest6[1], 70, 260, 14, '#fff', VOLTA), chest6)}
    ${particles(50, VOLTA, [chest6[0] - 200, chest6[0] + 200], [chest6[1] - 200, chest6[1] + 200], [-200, -300], [3, 9], [0.4, 1])}`)}
  ${vis(19.5, 20.6, streaks(20, INK, [700, 1500], 600, [3, 6], [0.15, 0.3], -30))}
`, [600, 1100]), 3) + `
  ${vis(20.6, 23, onom(470, 560, 'BZZRAAAK !!', 130, -8, VOLTA, INK, 20.6))}
  ${flashAt(20.6)}
`);
sfx('whoosh', 19.5); sfx('zap', 20.5); sfx('bigboom', 20.6); sfx('electric', 21.2); sfx('scan', 22.0);

// 7 · Absorption (23 – 27 s) : l'éclair est aspiré par le Ω, le Colosse brille de jaune, Volta pâlit
const C7 = [680, 1520, 0.68], c7y = C7[1] - 700 * C7[2], chest7 = [C7[0], c7y - 110 * C7[2]];
const aH = hand('cast', 'ra', 230, 1660, 0.82);
scene(23, 27, cam(23, 27, [[23, 40, 0, 0, 1.0], [25.2, 0, -20, -1, 1.08], [27, -40, -40, 1, 1.16]], `
  ${BG(NIGHT)}
  ${radial(chest7[0], chest7[1], 140, '#2a2a10', [300, 520])}
  ${an('parx', 23, city(1520, '#07070b', VOLTA))}
  ${GROUND(1520, '#0b0b12')}
  ${put(colosse(ORANGE, 0.5), C7[0], c7y, C7[2])}
  ${vis(0, 40, fadeIn(23.4, 1.6, put(colosse(VOLTA, 0.5), C7[0], c7y, C7[2])))}
  ${an('pulse', 23, `<circle cx="${chest7[0]}" cy="${f(chest7[1])}" r="${260}" fill="url(#vglow)"/>`, chest7, ';animation-iteration-count:infinite')}
  <path d="M${f(aH[0])} ${f(aH[1])} Q${f((aH[0] + chest7[0]) / 2)} ${f(aH[1] - 260)} ${chest7[0]} ${f(chest7[1])}" fill="none" stroke="${VOLTA}" stroke-width="22" stroke-dasharray="40 24" class="flow" filter="url(#glow)" style="animation-direction:reverse;animation-duration:.25s"/>
  ${bolt(f(aH[0]), f(aH[1]), chest7[0], f(chest7[1]), '#fff', 6, 9, 50, 23)}
  ${particles(60, VOLTA, [aH[0] - 40, aH[0] + 60], [aH[1] - 60, aH[1] + 40], [chest7[0] - aH[0], chest7[1] - aH[1]], [3, 8], [0.5, 0.9])}
  ${an('shakeS', 23, drain(25.3, 1.4, put(figure('volta', 'cast', { glow: true, anim: 'charge', shout: true }), 230, 1660, 0.82),
    put(figure('voltaGris', 'cast', { anim: 'charge', shout: true }), 230, 1660, 0.82)), null, ';animation-iteration-count:infinite')}
`, [500, 1200]) + `
  ${robotBubble(6, 400, 420, ['Absorption', "de l'énergie."], [120, 70])}
  ${vis(23.6, 27, an('pop', 23.6, `<rect x="80" y="610" width="420" height="96" fill="${INK}" stroke="${VOLTA}" stroke-width="5"/>
    <text x="290" y="650" class="rt" style="font-size:30px" fill="${VOLTA}">ABSORPTION</text>
    <rect x="100" y="666" width="380" height="24" fill="none" stroke="${VOLTA}" stroke-width="3"/>
    ${anim(23.6, 3.2, ['0%{transform:scale(.05,1)}', '100%{transform:scale(1,1)}'], `<rect x="104" y="670" width="372" height="16" fill="${VOLTA}"/>`, { origin: [104, 678], ease: 'linear' })}`))}
  ${bubbleFor(7, 320, 880, ['Il me prend', 'mon énergie !'], [-80, 110])}
`);
sfx('beam', 23.0); sfx('electric', 23.3); sfx('charge', 23.6); sfx('powerdown', 25.3); sfx('heart', 26.2);

// 8 · Écho l'arrache au rayon (27 – 31 s) : télékinésie, le lien jaune casse, Volta est projetée
const C8 = [130, 1620, 0.95], c8y = C8[1] - 700 * C8[2], chest8 = [C8[0], c8y - 110 * C8[2]];
const gH = hand('charge', 'ra', 560, 1560, 0.72, -1);
scene(27, 31, shakeAt(29.8, cam(27, 31, [[27, 0, 0, 0, 1.08], [29.7, 20, -20, 1, 1.16], [29.9, 0, 0, 0, 1.04, 'ease-out'], [31, 40, 20, -1, 1.1]], `
  ${BG(INK)}
  ${radial(560, 1100, 130, '#22102e', [300, 520])}
  ${GROUND(1620, '#07070b')}
  ${put(colosse(VOLTA, 0.6), C8[0], c8y, C8[2])}
  ${an('pulse', 27, `<circle cx="${chest8[0]}" cy="${f(chest8[1])}" r="300" fill="url(#vglow)"/>`, chest8, ';animation-iteration-count:infinite')}
  ${vis(27, 29.8, `<g class="flick1"><path d="M${f(gH[0])} ${f(gH[1])} Q${f((gH[0] + chest8[0]) / 2)} ${f(gH[1] - 200)} ${chest8[0]} ${f(chest8[1])}" fill="none" stroke="${VOLTA}" stroke-width="14" stroke-dasharray="30 20" class="flow" filter="url(#glow)" style="animation-direction:reverse;animation-duration:.25s"/></g>
    ${particles(40, VOLTA, [gH[0] - 40, gH[0] + 40], [gH[1] - 40, gH[1] + 40], [chest8[0] - gH[0], chest8[1] - gH[1]], [2, 6], [0.5, 0.9])}`)}
  ${vis(29.8, 31, `${an('impact', 29.8, burst(f(gH[0] - 120), f(gH[1] - 60), 40, 180, 10, '#fff', VOLTA), [f(gH[0] - 120), f(gH[1] - 60)])}${particles(30, VOLTA, [300, 500], [1000, 1200], [0, 500], [2, 6], [0.4, 0.8])}`)}
  ${aura(560, 1250, ECHO, 3, 140, 27.3)}
  ${go(29.85, 0.8, [260, 60], an('shakeS', 27, put(figure('voltaGris', 'charge', { anim: 'charge', shout: true }), 560, 1560, 0.72, -1), null, ';animation-iteration-count:infinite'), 'cubic-bezier(.2,.8,.3,1)', 20)}
  ${mv(27, 0.6, [500, -200], an('bob', 27.6, put(figure('echo', 'castUp', { float: true, glow: true, anim: 'cast' }), 900, 1560, 0.76, -1), null, ';animation-iteration-count:infinite'))}
  ${particles(40, ECHO, [400, 1100], [900, 1700], [0, -400], [3, 7], [0.8, 1.6])}
`, [560, 1200]), 3, 'shakeS') + `
  ${bubbleFor(8, 600, 560, ['Je te tiens, Volta !'], [160, 110])}
  ${vis(29.8, 31, onom(560, 900, 'KRRSSH !', 120, -6, ECHO, INK, 29.8))}
  ${flashAt(29.8)}
`);
sfx('tk', 27.1); sfx('whoosh', 27.0); sfx('electric', 27.6); sfx('glitch', 29.2); sfx('boom', 29.8); sfx('land', 30.6);

// 9 · À terre (31 – 35 s) : Volta à genoux, Givre accourt, Mirage les cache ; le Colosse balaie la rue
scene(31, 35, cam(31, 35, [[31, 0, -40, 0, 1.14], [33.4, 0, 0, 0, 1.04], [35, 0, 30, 1, 1.0]], `
  ${street(1340, VOLTA)}
  ${put(colosse(VOLTA, 0.5), 800, 1340 - 700 * 0.42, 0.42)}
  ${an('scan', 31.2, `<polygon points="800,${f(1340 - 700 * 0.42 - 442 * 0.42)} 300,1700 1100,1700" fill="${VOLTA}" opacity=".16"/>`, [800, f(1340 - 700 * 0.42 - 442 * 0.42)], ';animation-iteration-count:2;animation-direction:alternate')}
  ${an('drift', 31, smoke(540, 1600, 12, 900, '#2e2e3a', 0.85))}
  ${ghost(`<ellipse cx="450" cy="1480" rx="420" ry="300" fill="${MIRAGE}" opacity=".12" stroke="${MIRAGE}" stroke-width="6"/>`, 0.4, 0.9)}
  ${put(figure('mirage', 'castUp', { glow: true, anim: 'cast' }), 790, 1640, 0.62, -1)}
  ${anim(31, 4, ['0%{transform:rotate(0deg)}', '100%{transform:rotate(6deg)}'], put(figure('voltaGris', 'kneel', { anim: 'still' }), 530, 1660, 0.8), { origin: [530, 1660] })}
  ${particles(10, DEAD, [380, 560], [1100, 1400], [0, 120], [2, 4], [1, 2], 0.6)}
  ${mv(31, 0.7, [-500, 0], put(figure('givre', 'kneel', { anim: 'idle', shout: true }), 190, 1660, 0.74))}
  ${particles(30, MIRAGE, [100, 900], [1100, 1700], [0, -200], [2, 5], [1, 2], 0.7)}
  ${vis(33.4, 35, mv(33.4, 0.3, [1100, 0], panel('ep10eyes', 60, 360, 960, 400, `<rect x="60" y="360" width="960" height="400" fill="url(#tone)" opacity=".2"/>${bigEyes(540, 590, 'voltaGris')}`), 'cubic-bezier(.2,1.2,.4,1)'))}
`, [470, 1400]) + `
  ${bubbleFor(9, 380, 560, ['Volta, réponds !'], [-60, 110])}
`);
sfx('step', 31.0); sfx('invis', 31.3); sfx('scan', 31.4); sfx('panel', 33.4); sfx('heart', 34.0);

// 10 · Les mains éteintes + carton final (35 – 40 s) : deux dernières étincelles, puis plus rien
scene(35, 40, cam(35, 40, [[35, 0, -40, 0, 1.0], [37, 0, 0, 0, 1.08], [40, 0, 0, 0, 1.12]], `
  ${BG(NIGHT)}
  ${an('pulse', 35, `<circle cx="540" cy="560" r="560" fill="url(#vglow)"/>`, [540, 560], ';animation-iteration-count:infinite')}
  <g opacity=".7">${put(colosse(VOLTA, 0.6), 540, 1000, 0.62)}</g>
  <rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="${NIGHT}" opacity=".35"/>
  ${GROUND(1300, '#0b0b12')}
  ${an('drift', 35, smoke(540, 1700, 10, 900, '#2e2e3a', 0.8))}
  ${anim(35, 5, ['0%{transform:translate(0,30px)}', '100%{transform:translate(0,-10px)}'], `
    ${an('shakeS', 35, `${put(palm(DEAD), 360, 1560, 1.25, 1, -14)}${put(palm(DEAD), 720, 1560, 1.25, -1, 14)}`, null, ';animation-iteration-count:infinite;animation-duration:.6s')}
    ${vis(35, 36.2, `${fadeOut(35.2, 1.0, `<g class="flick1">${bolt(330, 1330, 400, 1250, VOLTA, 6, 5, 20, 35)}${bolt(740, 1320, 690, 1240, VOLTA, 6, 5, 20, 35.1)}</g>`)}`)}
    ${vis(36.2, 36.6, `<g class="flick2">${bolt(720, 1330, 700, 1280, VOLTA, 3, 4, 10, 36.2)}</g>`)}`)}
  ${particles(20, DEAD, [250, 830], [1250, 1450], [0, 160], [2, 4], [1.5, 2.5], 0.6)}
`, [540, 1300]) + `
  ${bubbleFor(10, 540, 560, ['Je ne sens', 'plus rien…'], [0, 100])}
  ${finalCard(36.9, 'ÉPISODE 11 BIENTÔT')}
`);
sfx('electric', 35.0); sfx('zap', 36.2); sfx('powerdown', 36.3); sfx('heart', 37.2); sfx('rumble', 38.0);

L.build(import.meta.url, 'les-anomalies-ep10');
