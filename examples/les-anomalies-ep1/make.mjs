// « LES ANOMALIES » ch. 1 · Chasse aux mutants : manga d'action, 40 s, 1080x1920 (Reel).
// Trois jeunes mutants (Volta : électricité, Givre : glace, Écho : télékinésie) contre un robot
// chasseur, le Traqueur. Encre + trames, une couleur par pouvoir, rouge pour l'ennemi.
// Usage : node make.mjs → les-anomalies-ep1.svg + timeline.json (lu par audio.py)
import * as L from '../les-anomalies/lib.mjs';
const { W, H, T, PAPER, INK, NIGHT, RED, VOLTA, GIVRE, ECHO, rnd, f, vis, scene, an, radial, burst, cracks, zig, bolt, onom, panel, bubbleFor, tag, figure, hand, put, bigEyes, robotG, city, searchlight, car, aura, crystal, smoke, reticle, BG, GROUND, sky, cam, particles, streaks, shakeAt, flashAt, sfx } = L;

// ---------- Répliques (une bulle à la fois) et bruitages, partagés avec audio.py ----------
const LINES = [
  { who: 'robot', t0: 4.6, t1: 6.4, text: 'Mutants détectés. Capture immédiate.' },
  { who: 'volta', t0: 9.9, t1: 11.3, text: 'Cette fois, on se bat !' },
  { who: 'givre', t0: 16.2, t1: 17.4, text: 'Bouclier de glace !' },
  { who: 'echo', t0: 19.8, t1: 21.1, text: 'Tiens, prends ça !' },
  { who: 'robot', t0: 22.2, t1: 23.4, text: 'Résistance… inutile.' },
  { who: 'volta', t0: 23.8, t1: 25.2, text: 'Laissez-moi faire !' },
  { who: 'givre', t0: 26.9, t1: 28.1, text: 'Formation Delta !' },
  { who: 'robot', t0: 30.7, t1: 32.0, text: 'Erreur… erreur…' },
  { who: 'echo', t0: 34.3, t1: 35.4, text: "Alors, on l'a eu ?" },
  { who: 'volta', t0: 35.5, t1: 36.7, text: 'Trop facile.' },
  { who: 'robot', t0: 36.95, t1: 38.6, text: 'Sujet 4… localisé.' },
];
L.setLines(LINES);

// =====================================================================
// 1 · Titre (0 – 3,5 s) : balayage, viseurs, la caméra recule
scene(0, 3.5, cam(0, 3.5, [[0, 0, 40, -3, 1.3], [0.9, 0, 0, 0, 1.1, 'ease-out'], [3.5, 0, -30, 1.5, 1.02]], `
  ${sky}
  ${searchlight(220, 'swayL', 0)}${searchlight(860, 'swayR', 0)}
  <circle cx="540" cy="900" r="330" fill="${PAPER}" opacity=".92"/>
  <circle cx="540" cy="900" r="330" fill="url(#toneP)" opacity=".25"/>
  ${an('parx', 0, city(1340, '#07070b'))}
  ${GROUND(1290)}
  <path d="M-700 1290 L1780 1290" stroke="${PAPER}" stroke-width="4" opacity=".5"/>
  ${put(figure('echo', 'stand', { glow: true }), 330, 1292, 0.55)}
  ${put(figure('givre', 'stand', { glow: true }), 750, 1292, 0.55, -1)}
  ${put(figure('volta', 'hips', { glow: true, anim: 'fight' }), 540, 1300, 0.66)}
  ${particles(40, VOLTA, [0, W], [900, 1500], [40, -520], [2, 5], [1.6, 3], 0.8)}
  ${particles(26, PAPER, [0, W], [0, 1300], [-160, 260], [2, 4], [2, 4], 0.4)}
  ${vis(0.8, 1.9, an('scanDown', 0.8, `<rect x="-200" y="700" width="1480" height="16" fill="${RED}" filter="url(#glow)"/><rect x="-200" y="560" width="1480" height="150" fill="${RED}" opacity=".18"/>`))}
  ${reticle(330, 968, 64, 1.5)}${reticle(750, 968, 64, 1.85)}${reticle(540, 912, 78, 2.2)}
`, [540, 1000]) + `
  <text x="540" y="268" class="cap" text-anchor="middle" fill="${PAPER}" style="font-size:34px;letter-spacing:8px">CHAPITRE 1 · CHASSE AUX MUTANTS</text>
  ${an('slam', 0.1, an('beat', 0.5, `<text x="540" y="400" class="title" style="font-size:90px;letter-spacing:30px">LES</text><text x="540" y="560" class="title" style="font-size:170px">ANOMALIES</text>`, [540, 480], ';animation-iteration-count:infinite'))}
  ${an('pop', 0.3, `<text data-role="hook" x="540" y="1440" class="cap" text-anchor="middle" fill="${PAPER}" style="font-size:44px">Un gène de trop. Une cible dans le dos.</text>`)}
`);
sfx('hit', 0.1); sfx('scan', 0.8); sfx('lock', 1.5); sfx('lock', 1.85); sfx('lock', 2.2);

// 2 · Le Traqueur descend (3,5 – 8 s) : contre-plongée, atterrissage, poussée vers l'œil
scene(3.5, 8, cam(3.5, 8, [[3.5, 0, -160, 0, 1.18], [4.85, 0, 0, 0, 1.04, 'ease-out'], [6.3, 0, 60, 0, 1.12], [8, 0, 110, -2, 1.3]], `
  ${sky}
  ${an('parx', 3.5, city(1500, '#07070b'))}
  ${GROUND(1700, '#07070b')}
  ${an('scan', 5.0, `<polygon points="540,612 140,1920 940,1920" fill="${RED}" opacity=".22"/><path d="M540 612 L540 1920" stroke="${RED}" stroke-width="4" opacity=".7"/>`, [540, 612])}
  ${shakeAt(4.85, an('descend', 3.5, an('hover', 4.9, `
    <g class="flick1"><path d="M-200 1640 L-150 1840 L-120 1640Z M200 1640 L150 1840 L120 1640Z" transform="translate(540 0)" fill="${VOLTA}" opacity=".8" filter="url(#glow)"/></g>
    ${put(robotG(), 540, 988, 0.85)}`, null, ';animation-iteration-count:infinite')))}
  ${vis(4.85, 8, an('drift', 4.85, smoke(540, 1700, 12, 520, '#3a3a44', 0.95)))}
  ${particles(30, RED, [0, W], [600, 1900], [0, -400], [2, 5], [1, 2], 0.7)}
  ${streaks(20, '#2a2a36', [0, 1600], 0, [4, 8], [0.3, 0.5], 90)}
`, [540, 612]) + `
  ${onom(540, 1440, 'VWOOOOM', 120, -5, PAPER, INK, 3.6)}
  ${an('pop', 5.6, an('blink', 5.9, `<rect x="200" y="236" width="680" height="80" fill="${INK}" stroke="${RED}" stroke-width="5"/><text x="540" y="290" class="rt" style="font-size:42px" fill="${RED}">CIBLES MUTANTES : 3</text>`, null, ';animation-iteration-count:infinite'))}
  ${bubbleFor(0, 540, 430, ['Mutants détectés.', 'Capture immédiate.'], [0, 80])}
`);
sfx('whoosh', 3.5); sfx('land', 4.85); sfx('scan', 5.0); sfx('alarm', 5.6);

// 3 · Les trois regards (8 – 12,5 s) : cases qui claquent, yeux qui bougent, zoom dans chaque case
const eyePanel = (id, y, who, delay, fx, from) => an(from, delay, panel(id, 40, y, 1000, 600, an('zoomP', delay, `
  ${radial(540, y + 300, 110, '#d9d4c8', [380, 520])}
  ${fx}
  ${bigEyes(540, y + 330, who)}`, [540, y + 300])));
scene(8, 12.5, cam(8, 12.5, [[8, 0, 0, 0, 1.0], [10.2, 0, -20, 0.8, 1.04], [12.5, 0, 20, -0.8, 1.08]], `
  ${BG(INK)}
  ${eyePanel('e1', 40, 'volta', 7.8, `${bolt(60, 120, 1020, 260, VOLTA, 12, 10, 50, 8)}${bolt(80, 600, 1000, 540, VOLTA, 10, 10, 40, 8.1)}${particles(16, VOLTA, [60, 1020], [60, 620], [0, -120], [2, 5], [0.6, 1.2])}`, 'inL')}
  ${eyePanel('e2', 660, 'givre', 8.25, `${an('grow', 8.3, `${crystal(110, 1260, 120, 260, -20)}${crystal(200, 1260, 90, 160, 10)}`, [150, 1260])}${an('grow', 8.4, `${crystal(980, 1260, 130, 280, 20)}${crystal(890, 1260, 80, 150, -10)}`, [930, 1260])}${particles(22, '#c8f1ff', [60, 1020], [680, 1240], [60, 160], [2, 5], [1.2, 2.4])}`, 'inR')}
  ${eyePanel('e3', 1280, 'echo', 8.7, `${aura(540, 1610, ECHO, 3, 200, 9)}${particles(18, ECHO, [60, 1020], [1300, 1860], [0, -200], [3, 7], [1.2, 2.2])}`, 'inL')}
`) + `
  ${tag(70, 236, 'VOLTA', 'ÉLECTRICITÉ', VOLTA, 8.15)}
  ${tag(470, 1176, 'GIVRE', 'GLACE', GIVRE, 8.65)}
  ${tag(70, 1300, 'ÉCHO', 'TÉLÉKINÉSIE', ECHO, 9.15)}
  ${bubbleFor(1, 560, 650, ['Cette fois, on se bat !'], [-120, -80])}
`);
sfx('panel', 8.0); sfx('zap', 8.05); sfx('panel', 8.5); sfx('ice', 8.55); sfx('panel', 9.0); sfx('tk', 9.05);

// 4 · Salve de missiles (12,5 – 16 s) : la caméra suit les missiles, explosion, les héros bondissent
const missile = (x0, y0, x1, y1, d) => {
  const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  return `<path class="trail" style="animation-delay:${d}s" d="M${x0} ${y0} Q${f((x0 + x1) / 2 + 120)} ${f((y0 + y1) / 2 - 140)} ${x1} ${y1}" pathLength="1" fill="none" stroke="#9a9aa6" stroke-width="26" stroke-linecap="round" opacity=".8"/>
  ${an('fly', d, `<g transform="translate(${x1} ${y1}) rotate(${f(ang)})"><path d="M-60 -14 L30 -14 L60 0 L30 14 L-60 14Z" fill="${PAPER}" stroke="${INK}" stroke-width="5"/><g class="flick1"><path d="M-60 -10 L-120 0 L-60 10Z" fill="${VOLTA}" filter="url(#glow)"/></g><path d="M-60 -14 L-80 -30 L-60 0 L-80 30 L-60 14" fill="${RED}"/></g>`, null, `;--fx:${f(x0 - x1)}px;--fy:${f(y0 - y1)}px`)}`;
};
scene(12.5, 16, `
  ${vis(12.5, 14.2, cam(12.5, 14.2, [[12.5, 40, -30, 2, 1.15], [13.0, 0, 0, 0, 1.04, 'ease-out'], [14.2, -60, 80, -3, 1.2, 'ease-in']], `
    ${BG(PAPER)}
    ${radial(330, 1380, 150, INK, [420, 640])}
    ${shakeAt(12.7, put(robotG(1.6), 900, 760, 0.8), 3, 'shakeS')}
    ${missile(620, 440, 300, 1330, 12.7)}${missile(650, 460, 380, 1390, 12.95)}${missile(600, 470, 240, 1420, 13.2)}
    ${put(figure('echo', 'stand', { anim: 'fight' }), 200, 1560, 0.42)}${put(figure('volta', 'stand', { anim: 'fight' }), 330, 1580, 0.45)}${put(figure('givre', 'stand', { anim: 'fight' }), 460, 1560, 0.42, -1)}
    ${particles(20, '#9a9aa6', [500, 800], [400, 600], [-200, 300], [6, 14], [0.8, 1.4], 0.7)}`, [540, 960]))}
  ${vis(14.2, 16, shakeAt(14.2, cam(14.2, 16, [[14.2, 0, 0, 0, 1.3], [16, 20, -20, 2, 1.02, 'ease-out']], `
    ${BG(INK)}
    ${radial(330, 1380, 170, PAPER, [200, 380])}
    ${an('impact', 14.2, an('spinS', 14.2, `${burst(330, 1380, 260, 620, 18, PAPER, INK)}${burst(330, 1380, 160, 380, 15, VOLTA)}${burst(330, 1380, 80, 200, 12, RED)}`, [330, 1380]), [330, 1380])}
    ${an('drift', 14.3, smoke(330, 1500, 14, 380, '#5d5d68', 0.95), null)}
    ${particles(40, VOLTA, [200, 460], [1250, 1500], [0, -900], [4, 10], [0.8, 1.6])}
    ${particles(30, RED, [200, 460], [1250, 1500], [500, -600], [3, 8], [0.7, 1.3])}
    ${an('leapA', 14.25, put(figure('volta', 'leap', { anim: 'fight' }), 200, 1060, 0.45, 1, -20))}
    ${an('leapB', 14.25, put(figure('givre', 'leap', { anim: 'fight' }), 880, 1520, 0.45, -1, 15))}
    ${an('leapC', 14.25, put(figure('echo', 'float', { float: true, glow: true }), 640, 1820, 0.42))}`, [330, 1380]), 3))}
  ${vis(12.5, 14.2, onom(330, 360, 'FSSHHH', 100, -8, INK, PAPER, 12.7))}
  ${vis(14.2, 16, onom(560, 900, 'BOOOOM !!', 170, -6, VOLTA, INK, 14.25))}
  ${flashAt(14.2)}
`);
sfx('missile', 12.7); sfx('missile', 12.95); sfx('missile', 13.2); sfx('boom', 14.2);

// 5 · Le mur de glace de Givre (16 – 19,5 s) : Givre retombe, frappe, le mur jaillit, le laser cogne
const wall = [[600, 230, 640, -30], [700, 200, 820, 10], [800, 240, 760, 30], [900, 220, 860, -20], [990, 200, 700, 10], [660, 140, 420, 40], [860, 150, 460, -30]]
  .map(([x, w, h, l]) => crystal(x, 1520, w, h, l)).join('');
const givreSlam = hand('slam', 'ra', 300, 1500, 1.0);
const shards = Array.from({ length: 14 }, () => {
  const a = rnd(Math.PI * 0.6, Math.PI * 1.4), d = rnd(300, 700), sz = rnd(18, 40);
  return an('chunk', 17.5, `<polygon points="775,${945 - sz} ${775 + sz * 0.5},945 775,${945 + sz} ${775 - sz * 0.5},945" fill="#c8f1ff" stroke="${INK}" stroke-width="3"/>`, [775, 945], `;--cx:${f(Math.cos(a) * d)}px;--cy:${f(Math.sin(a) * d)}px;--cr:${f(rnd(-300, 300))}deg`);
}).join('');
scene(16, 19.5, shakeAt(16.55, cam(16, 19.5, [[16, 0, 0, 0, 1.35], [16.55, 0, 0, 0, 1.2, 'ease-in'], [16.95, 0, 0, 0, 1.0, 'ease-out'], [17.4, -20, 0, 0, 1.04], [17.6, -30, 10, 1.5, 1.1], [19.5, -60, 40, -2, 1.16]], `
  ${BG(PAPER)}
  <rect x="-700" y="-1000" width="${W + 1400}" height="2300" fill="url(#tone)" opacity=".35"/>
  ${radial(300, 1100, 120, '#cfc9bc', [320, 520])}
  ${GROUND(1500)}
  ${an('frost', 16.6, `<path d="M${f(givreSlam[0])} 1505 L1180 1505" stroke="${GIVRE}" stroke-width="16" filter="url(#glow)" pathLength="1" class="draw" style="animation-delay:16.6s"/>`)}
  ${shakeAt(17.5, an('rise', 16.85, wall), 4, 'shakeS')}
  ${vis(17.4, 19.5, `
    <g class="flick1">${an('beamIn', 17.4, `<polygon points="1280,200 1280,330 790,960 760,930" fill="${RED}" filter="url(#glow)"/><path d="M1280 260 L775 945" stroke="#fff" stroke-width="10"/>`, [1280, 260])}</g>
    ${an('impact', 17.5, an('spinS', 17.5, burst(775, 945, 60, 190, 12, '#fff', RED), [775, 945]), [775, 945])}
    ${cracks(775, 945, 7, 220, INK, 4)}
    ${shards}
    ${particles(30, '#ff6b6b', [740, 810], [910, 980], [-260, 0], [3, 7], [0.3, 0.6])}`)}
  ${an('dropIn', 16.0, put(figure('givre', 'slam', { glow: true, anim: 'cast' }), 300, 1500, 1.0))}
  ${aura(f(givreSlam[0]), 1495, GIVRE, 2, 60, 16.6)}
  ${particles(40, '#e6f8ff', [-100, 1180], [0, 1500], [-120, 380], [2, 5], [1.5, 3], 0.9)}
`, [300, 1150]), 2) + `
  ${onom(640, 1430, 'KRRSSH !', 100, -4, GIVRE, INK, 16.9)}
  ${onom(660, 420, 'TZZOOOM', 110, 8, RED, INK, 17.4)}
  ${bubbleFor(2, 330, 310, ['Bouclier', 'de glace !'], [-20, 80])}
`);
sfx('ice', 16.6); sfx('iceWall', 16.85); sfx('laser', 17.4);

// 6 · La télékinésie d'Écho (19,5 – 23,5 s) : lévitation, voitures qui tanguent, coup de fouet de caméra
const echoH = hand('throw', 'ra', 290, 1440, 0.95);
scene(19.5, 23.5, cam(19.5, 23.5, [[19.5, 0, 0, 0, 1.02], [21.2, 0, 0, 0, 1.12], [21.5, 90, -70, 4, 1.15, 'ease-in'], [21.8, 0, 0, 0, 1.04, 'ease-out'], [23.5, 0, 0, -1, 1.08]], `
  ${sky}
  ${an('parx', 19.5, city(1560, '#07070b', ECHO))}
  ${GROUND(1520)}
  ${radial(290, 1000, 90, '#2b1d44', [360, 560])}
  ${aura(290, 1060, ECHO, 3, 170, 19.5)}
  ${particles(36, ECHO, [-100, 1180], [900, 1600], [20, -600], [3, 9], [1.4, 2.6])}
  ${an('bob', 19.5, put(figure('echo', 'throw', { float: true, glow: true, anim: 'cast' }), 290, 1440, 0.95), null, ';animation-iteration-count:infinite')}
  ${an('liftA', 19.7, an('throwA', 21.25, an('wob', 19.7, car(680, 1290, 0.9, ECHO), [680, 1240], ';animation-iteration-count:infinite')))}
  ${an('liftB', 19.85, an('throwB', 21.35, an('wob', 19.9, car(890, 1500, 0.75, ECHO), [890, 1460], ';animation-iteration-count:infinite;animation-direction:alternate-reverse')))}
  ${vis(19.7, 21.3, `<path d="M${f(echoH[0])} ${f(echoH[1])} Q620 1000 690 1180" fill="none" stroke="${ECHO}" stroke-width="6" stroke-dasharray="14 18" filter="url(#glow)" class="flow"/>`)}
  ${vis(21.2, 21.9, streaks(30, ECHO, [200, 1600], 900, [3, 6], [0.15, 0.3], -50))}
`, [290, 1100]) + `
  ${vis(19.7, 21.3, onom(700, 980, 'VRRRMMM', 96, -6, ECHO, INK, 19.7))}
  ${bubbleFor(3, 330, 560, ['Tiens, prends ça !'], [-20, 90])}
  ${vis(21.8, 23.5, `
    ${an('inR', 21.8, panel('p6r', 500, 236, 540, 560, `
      <rect x="500" y="236" width="540" height="560" fill="${PAPER}"/>
      ${radial(770, 560, 90, INK, [200, 300])}
      ${an('shake', 21.85, `${put(robotG(2), 770, 1050, 1.15)}
        ${cracks(770, 540, 6, 160, PAPER, 5)}
        ${car(860, 520, 0.7, ECHO)}`, null, ';animation-iteration-count:3')}
      ${an('impact', 21.85, burst(880, 470, 40, 120, 12, '#fff', INK), [880, 470])}
      ${particles(16, ECHO, [820, 940], [420, 520], [200, -200], [3, 7], [0.4, 0.8])}`))}
    ${onom(770, 700, 'KLANG !!', 120, -8, PAPER, INK, 21.9)}`)}
  ${bubbleFor(4, 780, 900, ['Résistance…', 'inutile.'], [0, -90])}
`);
sfx('tk', 19.6); sfx('whoosh', 21.25); sfx('klang', 21.85);

// 7 · Volta se charge (23,5 – 26,8 s) : poussée lente, tremblement qui monte, roches qui lévitent
const vH = [hand('charge', 'la', 540, 1640, 1.25), hand('charge', 'ra', 540, 1640, 1.25)];
scene(23.5, 26.8, shakeAt(24.6, cam(23.5, 26.8, [[23.5, 0, 80, 0, 1.0], [25.2, 0, 0, -2, 1.12], [26.8, 0, -40, 2, 1.26]], `
  ${BG(INK)}
  ${radial(540, 1100, 160, '#3a3410', [260, 520])}
  ${an('pulse', 23.5, `<circle cx="540" cy="1150" r="520" fill="url(#vglow)"/>`, [540, 1150], ';animation-iteration-count:infinite')}
  ${an('parx', 23.5, smoke(540, 120, 12, 560, '#2a2a33', 1))}
  ${bolt(200, -200, vH[0][0], vH[0][1], VOLTA, 16, 10, 50, 23.6)}
  ${bolt(880, -200, vH[1][0], vH[1][1], VOLTA, 16, 10, 50, 23.7)}
  ${vis(24.6, 26.8, `${bolt(540, -200, 540, vH[0][1] + 20, VOLTA, 22, 12, 60, 24.6)}${bolt(vH[0][0], vH[0][1], 120, 1500, VOLTA, 10, 8, 40, 24.7)}${bolt(vH[1][0], vH[1][1], 960, 1480, VOLTA, 10, 8, 40, 24.8)}`)}
  ${put(figure('volta', 'charge', { glow: true, anim: 'charge' }), 540, 1640, 1.25)}
  ${GROUND(1640, '#07070b')}
  <g class="flick1">${cracks(540, 1645, 9, 400, VOLTA, 5)}</g>
  ${particles(26, '#55555f', [80, 1000], [1500, 1700], [0, -1100], [8, 22], [2, 3.5])}
  ${particles(50, VOLTA, [100, 980], [600, 1700], [0, -300], [2, 5], [0.5, 1.1])}
`, [540, 1000]), 8, 'shakeS') + `
  ${bubbleFor(5, 540, 380, ['Laissez-moi faire !'], [0, 80])}
  ${onom(540, 430, 'BZZZZT !!', 140, -6, VOLTA, INK, 25.3)}
`);
sfx('charge', 23.6); sfx('zap', 24.6); sfx('zap', 25.3);

// 8 · Formation Delta (26,8 – 30,5 s) : de l'équipe à l'œil du robot, en suivant le rayon
const RE = [540, 760 - 442 * 0.7];
const gH = hand('castUp', 'ra', 230, 1780, 0.6), eH = hand('castUp', 'ra', 850, 1780, 0.6, -1), vT = hand('charge', 'la', 540, 1900, 0.62);
const MERGE = [540, 1180];
scene(26.8, 30.5, shakeAt(28.6, cam(26.8, 30.5, [[26.8, 0, -340, 0, 1.2], [27.9, 0, 0, 0, 1.0], [28.5, 0, 0, 0, 1.0], [28.7, 0, 386, 0, 1.25, 'ease-out'], [30.5, 0, 300, -2, 1.18]], `
  ${BG(PAPER)}
  ${radial(MERGE[0], MERGE[1], 170, INK, [380, 600])}
  ${shakeAt(28.6, put(robotG(1.5), 540, 760, 0.7), 4, 'shakeS')}
  <g class="flick1">
  <path class="draw" style="animation-delay:27.9s" d="${zig(vT[0], vT[1], MERGE[0], MERGE[1], 8, 30)}" pathLength="1" fill="none" stroke="${VOLTA}" stroke-width="22" stroke-linejoin="round" filter="url(#glow)"/>
  <path class="draw" style="animation-delay:27.9s" d="M${f(gH[0])} ${f(gH[1])} L${MERGE[0]} ${MERGE[1]}" pathLength="1" fill="none" stroke="${GIVRE}" stroke-width="26" stroke-linecap="round" filter="url(#glow)"/>
  <path class="draw" style="animation-delay:27.9s" d="M${f(eH[0])} ${f(eH[1])} C${f(eH[0] - 40)} 1500 ${f(MERGE[0] + 160)} 1400 ${MERGE[0]} ${MERGE[1]}" pathLength="1" fill="none" stroke="${ECHO}" stroke-width="26" stroke-linecap="round" filter="url(#glow)"/>
  </g>
  ${vis(28.3, 30.5, `
    <g class="flick2">${an('beamUp', 28.3, `<polygon points="${MERGE[0] - 46},${MERGE[1]} ${MERGE[0] + 46},${MERGE[1]} ${RE[0] + 18},${f(RE[1])} ${RE[0] - 18},${f(RE[1])}" fill="#fff" stroke="${VOLTA}" stroke-width="10" filter="url(#glow)"/>
      <polygon points="${MERGE[0] - 16},${MERGE[1]} ${MERGE[0] + 16},${MERGE[1]} ${RE[0] + 6},${f(RE[1])} ${RE[0] - 6},${f(RE[1])}" fill="${GIVRE}" opacity=".6"/>`, [MERGE[0], MERGE[1]])}</g>
    ${an('spinS', 28.3, burst(MERGE[0], MERGE[1], 50, 130, 10, '#fff', ECHO), MERGE)}
    ${particles(40, '#fff', [500, 580], [500, 1180], [0, -300], [3, 7], [0.3, 0.6])}`)}
  ${vis(28.6, 30.5, an('impact', 28.6, an('spinS', 28.6, `${burst(RE[0], RE[1], 120, 330, 16, '#fff', RED)}${burst(RE[0], RE[1], 60, 160, 12, VOLTA)}`, RE), RE))}
  ${vis(28.6, 30.5, particles(40, RED, [480, 600], [400, 500], [0, 500], [4, 10], [0.6, 1.2]))}
  ${put(figure('givre', 'castUp', { glow: true, anim: 'cast' }), 230, 1780, 0.6)}
  ${put(figure('echo', 'castUp', { glow: true, float: true, anim: 'cast' }), 850, 1780, 0.6, -1)}
  ${put(figure('volta', 'charge', { glow: true, anim: 'charge' }), 540, 1900, 0.62)}
  ${particles(30, VOLTA, [100, 980], [1500, 1900], [0, -500], [2, 6], [0.6, 1.2])}
`, [540, 1000]), 3) + `
  ${bubbleFor(6, 330, 1210, ['Formation Delta !'], [-60, 90])}
  ${onom(520, 420, 'KA-BOOOM !!', 126, -5, RED, INK, 28.7)}
  ${flashAt(28.6)}
`);
sfx('charge', 27.0); sfx('beam', 27.9); sfx('boom', 28.6);

// 9 · Le Traqueur explose (30,5 – 34 s) : poussée vers le robot qui craque, explosion, recul
const chunks = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2 + rnd(-0.2, 0.2), d = rnd(700, 1200), sz = rnd(50, 130);
  return an('chunk', 32.2, `<polygon points="${f(540 - sz)},${f(1000 - sz * 0.6)} ${f(540 + sz * 0.8)},${f(1000 - sz)} ${f(540 + sz)},${f(1000 + sz * 0.7)} ${f(540 - sz * 0.5)},${f(1000 + sz)}" fill="${INK}" stroke="${PAPER}" stroke-width="5"/>`, [540, 1000], `;--cx:${f(Math.cos(a) * d)}px;--cy:${f(Math.sin(a) * d)}px;--cr:${f(rnd(-300, 300))}deg`);
}).join('');
scene(30.5, 34, shakeAt(32.2, cam(30.5, 34, [[30.5, 0, 0, 0, 1.0], [32.15, 0, -40, 2, 1.22, 'ease-in'], [32.3, 0, 0, 0, 1.3], [34, 0, 0, -1, 1.04, 'ease-out']], `
  ${BG(INK)}
  ${radial(540, 1000, 180, '#3b0a10', [260, 480])}
  ${vis(30.5, 32.25, an('shake', 30.5, `${put(robotG(3), 540, 1100, 0.9)}
      <g class="flick1">${cracks(540, 900, 9, 380, RED, 7)}</g>
      <g class="flick2">${cracks(540, 1000, 7, 320, '#fff', 4)}</g>
      ${particles(30, '#ffb020', [300, 780], [500, 1300], [0, -300], [3, 7], [0.4, 0.9])}`, null, ';animation-iteration-count:4'))}
  ${vis(32.2, 34, `
    ${an('impact', 32.2, an('spinS', 32.2, `${burst(540, 1000, 300, 760, 20, PAPER, INK)}${burst(540, 1000, 200, 520, 16, VOLTA)}${burst(540, 1000, 110, 300, 14, RED)}`, [540, 1000]), [540, 1000])}
    ${chunks}
    ${an('drift', 32.5, smoke(540, 1250, 16, 460, '#4a4a55', 0.9))}
    ${particles(60, VOLTA, [440, 640], [900, 1100], [0, -900], [3, 9], [0.8, 1.6])}
    ${particles(40, RED, [440, 640], [900, 1100], [600, 300], [3, 8], [0.7, 1.4])}`)}
`, [540, 1000]), 4) + `
  ${bubbleFor(7, 540, 330, ['Erreur… erreur…'], [0, 80])}
  ${vis(32.2, 34, onom(540, 1000, 'BOOOOM !', 190, -4, PAPER, RED, 32.25))}
  ${flashAt(32.2)}
`);
sfx('glitch', 30.6); sfx('bigboom', 32.2);

// 10 · Après la bataille (34 – 36,8 s) : la caméra recule, fumée et poussière au vent
scene(34, 36.8, cam(34, 36.8, [[34, 0, 80, 0, 1.25], [36.8, 0, 0, 0, 1.02, 'ease-out']], `
  ${BG(PAPER)}
  <rect x="-700" y="-1000" width="${W + 1400}" height="2100" fill="url(#tone)" opacity=".4"/>
  ${an('parx', 34, city(1250, '#3a3a44', PAPER))}
  ${an('drift', 34, smoke(540, 1220, 10, 520, '#b9b6ae', 0.9))}
  <path d="M-700 2400 L-700 1480 Q180 1330 400 1390 Q540 1340 700 1390 Q900 1340 1780 1470 L1780 2400Z" fill="${INK}"/>
  ${put(robotG(0.5), 900, 1960, 0.42, 1, 24)}
  <g fill="${INK}" stroke="${PAPER}" stroke-width="4"><polygon points="120,1460 220,1420 240,1480"/><polygon points="620,1400 700,1360 720,1420"/><polygon points="300,1420 360,1400 350,1450"/></g>
  ${put(figure('givre', 'stand'), 225, 1500, 0.95)}
  ${put(figure('echo', 'stand', { float: true }), 855, 1500, 0.95, -1)}
  ${put(figure('volta', 'hips'), 540, 1470, 1.05)}
  ${particles(50, '#8a8578', [-200, 1100], [300, 1500], [420, -60], [2, 6], [1.2, 2.4], 0.8)}
  ${streaks(14, '#d6d0c2', [200, 1300], 900, [2, 4], [0.6, 1.0])}
`, [540, 1300]) + `
  ${bubbleFor(8, 720, 640, ["Alors, on l'a eu ?"], [80, 90])}
  ${bubbleFor(9, 540, 640, ['Trop facile.'], [0, 90])}
`);
sfx('wind', 34);

// 11 · Un second œil s'ouvre + carton final (36,8 – 40 s)
scene(36.8, 40, cam(36.8, 40, [[36.8, 0, 0, 0, 1.0], [40, 0, 0, 0, 1.16]], `
  ${BG(INK)}
  ${shakeAt(36.9, `<g opacity=".5">${put(robotG(), 540, 1250, 1.1)}</g>`, 2, 'shakeS')}
  <rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="${INK}" opacity=".55"/>
  ${an('eyeOpen', 36.9, an('epulse', 37.5, `<ellipse cx="540" cy="764" rx="240" ry="70" fill="${RED}" filter="url(#glow)"/><ellipse cx="540" cy="764" rx="80" ry="26" fill="#fff"/>`, [540, 764], ';animation-iteration-count:infinite'), [540, 764])}
  ${particles(40, RED, [0, W], [0, H], [0, -260], [2, 5], [1.5, 3], 0.6)}
  ${an('scanlines', 36.8, `<g fill="${RED}" opacity=".07">${Array.from({ length: 40 }, (_, i) => `<rect x="-700" y="${i * 60 - 200}" width="${W + 1400}" height="10"/>`).join('')}</g>`, null, ';animation-iteration-count:infinite')}
`, [540, 764]) + `
  ${bubbleFor(10, 540, 420, ['Sujet 4… localisé.'], [0, 80])}
  ${an('pop', 36.85, `<text data-role="final" x="540" y="1180" class="title" style="font-size:120px">LES ANOMALIES</text>`)}
  ${an('pop', 37.1, `<text x="540" y="1280" class="cap" text-anchor="middle" fill="${PAPER}" style="font-size:44px;letter-spacing:10px">À SUIVRE…</text>`)}
`);
sfx('eye', 36.85); sfx('hit', 37.0);

L.build(import.meta.url, 'les-anomalies-ep1');
