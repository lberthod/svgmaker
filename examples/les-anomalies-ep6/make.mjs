// « LES ANOMALIES » ép. 6 · Capturée : manga d'action, 40 s, 1080x1920 (Reel).
// Après la bataille de l'essaim, un Traqueur Mk II (blindé blanc et rouge) emporte Écho dans une cage d'énergie.
// Volta fonce seule, sa foudre glisse sur le blindage, elle est repoussée. Givre la retient : « On a besoin d'un plan. »
// Mirage surgit de l'ombre : « J'ai un plan. »
// Usage : node make.mjs → les-anomalies-ep6.svg + timeline.json (lu par audio.py)
import * as L from '../les-anomalies/lib.mjs';
const { W, H, PAPER, INK, NIGHT, RED, VOLTA, GIVRE, ECHO, MIRAGE, ORANGE, rnd, f, vis, scene, an, radial, burst, cracks, bolt, onom, panel,
  bubbleFor, tag, figure, hand, put, bigEyes, robotG, aura, crystal, smoke, reticle, BG, GROUND, cam, particles, streaks, shakeAt,
  flashAt, sfx, mv, go, anim, fadeIn, fadeOut, ghost, bobbing, tower, header, hook, finalCard, city, rooftops, waterTower, droneG, sky } = L;
L.reseed(606);

const LINES = [
  { who: 'givre', t0: 1.5, t1: 3.0, text: 'Écho, réponds-moi !' },
  { who: 'robot', t0: 5.0, t1: 7.1, text: 'Sujet 3. Capture confirmée.' },
  { who: 'volta', t0: 8.7, t1: 10.3, text: 'Lâche-la, espèce de robot !' },
  { who: 'robot', t0: 12.9, t1: 14.4, text: 'Blindage isolant.' },
  { who: 'echo', t0: 16.9, t1: 18.6, text: 'Volta… ne viens pas…' },
  { who: 'volta', t0: 19.6, t1: 21.0, text: 'Arrête-toi !' },
  { who: 'givre', t0: 23.7, t1: 25.1, text: 'Hé, Volta ! Ça va ?' },
  { who: 'volta', t0: 26.4, t1: 28.4, text: "J'y vais. Seule, s'il le faut !" },
  { who: 'givre', t0: 29.8, t1: 31.3, text: "On a besoin d'un plan." },
  { who: 'volta', t0: 31.6, t1: 33.0, text: 'Pas le temps de discuter !' },
  { who: 'mirage', t0: 34.0, t1: 35.6, text: "J'ai un plan." },
];
L.setLines(LINES);

// ---------- Éléments propres à l'épisode ----------
const MK = { body: '#e8e4da', trim: INK };
// Traqueur Mk II : blindage blanc, bandes rouges (centre du torse en 0,0, pieds à y = 700)
const mk2 = (amp = 1) => `<g>${robotG(amp, MK)}
  <path d="M-200 60 L200 60" stroke="${RED}" stroke-width="18"/><path d="M-190 100 L190 100" stroke="${RED}" stroke-width="6"/>
  <path d="M-240 -200 L-200 40 M240 -200 L200 40" stroke="${RED}" stroke-width="12"/>
  <text x="0" y="34" class="rt" style="font-size:54px" fill="${RED}">MK II</text></g>`;
// cage d'énergie rouge avec Écho évanouie (repère du robot : suspendue sous sa main droite)
const cage = (cx = 420, cy = 430, rx = 150, ry = 200, s = 0.42) => `
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${RED}" opacity=".16"/>
  <g opacity=".85">${put(figure('echo', 'sad', { anim: 'idle' }), cx, cy + ry * 0.85, s)}</g>
  <g class="flick1" style="animation-duration:.3s">${[-0.75, -0.4, 0, 0.4, 0.75].map((k) => `<path d="M${f(cx + k * rx * 0.3)} ${f(cy - ry)} Q${f(cx + k * rx * 1.25)} ${cy} ${f(cx + k * rx * 0.3)} ${f(cy + ry)}" fill="none" stroke="${RED}" stroke-width="8" filter="url(#glow)"/>`).join('')}</g>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${RED}" stroke-width="10" filter="url(#glow)"/>
  <path d="M${cx - 40} ${cy - ry} L${cx + 40} ${cy - ry} L${cx + 20} ${cy - ry - 40} L${cx - 20} ${cy - ry - 40}Z" fill="${INK}" stroke="${RED}" stroke-width="5"/>`;
// réacteurs sous les pieds
const thrust = (big = 1) => `<g class="flick1" style="animation-duration:.12s">${[-190, 190].map((x) => `<polygon points="${x - 50},700 ${x + 50},700 ${x},${700 + 380 * big}" fill="${ORANGE}" filter="url(#glow)"/><polygon points="${x - 26},700 ${x + 26},700 ${x},${700 + 200 * big}" fill="#fff"/>`).join('')}</g>`;
const mk2Carry = (amp = 1, jets = 0) => `${jets ? thrust(jets) : ''}${mk2(amp)}${cage()}`;
// drone abattu (épave fumante)
const wreck = (x, y, s, r) => put(`${droneG('#55101a')}<g class="flick2">${cracks(0, 0, 4, 40, RED, 3)}</g>`, x, y, s, 1, r);

// =====================================================================
// 1 · Après l'essaim (0 – 4 s) : toit fumant, Écho à terre, une ombre géante descend sur elle
scene(0, 4, cam(0, 4, [[0, 0, 0, 0, 1.0], [4, -40, -40, 1.5, 1.16]], `
  ${sky}
  ${an('parx', 0, city(1180, '#0b0b12', RED))}
  ${GROUND(1500, '#101018')}
  ${an('descend', 0.2, `${put(robotG(0.6, { body: '#050508', trim: '#2c2c36' }), 690, 830, 0.95)}${an('pulse', 0.2, `<circle cx="690" cy="412" r="260" fill="url(#rglow)"/>`, [690, 412], ';animation-iteration-count:infinite;animation-direction:alternate')}`)}
  ${an('drift', 0, smoke(560, 1460, 14, 900, '#22222c', 0.7))}
  ${wreck(140, 1490, 0.9, 20)}${wreck(930, 1500, 1.1, -30)}${wreck(820, 1470, 0.6, 60)}
  ${put(figure('echo', 'sad', { anim: 'still' }), 330, 1486, 0.55, 1, 84)}
  ${particles(26, ECHO, [420, 760], [1380, 1500], [0, -160], [2, 4], [1, 2], 0.6)}
  ${particles(30, '#ff9a6a', [-200, 1280], [800, 1500], [80, -300], [2, 5], [1.2, 2.4], 0.6)}
  ${mv(0.1, 1.6, [-520, 0], put(figure('givre', 'run', { anim: 'fight' }), 190, 1600, 0.62))}
`, [600, 1200]) + `
  ${header(6, 'Capturée')}
  ${hook('Une ombre géante a saisi Écho.', 0.3, 840)}
  ${bubbleFor(0, 370, 1000, ['Écho, réponds-moi !'], [-80, 90])}
`);
sfx('hit', 0.05); sfx('wind', 0.1); sfx('rumble', 0.2); sfx('step', 0.6); sfx('step', 1.1); sfx('heart', 2.4); sfx('eye', 3.2);

// 2 · Le Mk II (4 – 8,5 s) : contre-plongée, le Traqueur blindé blanc tient Écho dans une cage rouge
scene(4, 8.5, shakeAt(4.3, cam(4, 8.5, [[4, 0, -260, 0, 1.35], [5.3, 0, 0, 0, 1.0, 'ease-out'], [7.2, 0, 20, -1, 1.04], [8.5, -150, -80, -2, 1.22]], `
  ${BG(PAPER)}
  <rect x="-700" y="-1000" width="${W + 1400}" height="2700" fill="url(#tone)" opacity=".22"/>
  ${radial(540, 820, 160, INK, [380, 620])}
  ${GROUND(1640)}
  ${an('hover', 4, put(mk2Carry(0.8), 540, 1136, 0.72), null, ';animation-iteration-count:infinite;animation-direction:alternate')}
  ${vis(4.3, 4.9, an('impact', 4.3, burst(540, 818, 30, 150, 10, '#fff', RED), [540, 818]))}
  ${particles(34, RED, [600, 1060], [1300, 1640], [0, -260], [2, 5], [0.8, 1.6])}
  ${streaks(16, INK, [1500, 1640], -300, [3, 6], [0.4, 0.7])}
`, [540, 1100]), 2) + `
  ${tag(70, 236, 'TRAQUEUR MK II', 'BLINDÉ', RED, 4.6)}
  ${onom(260, 1440, 'KCHAK !', 100, -8, RED, INK, 4.3)}
  ${bubbleFor(1, 540, 470, ['Sujet 3.', 'Capture confirmée.'], [0, 100])}
`);
sfx('klang', 4.3); sfx('eye', 4.35); sfx('lock', 5.0); sfx('electric', 6.0); sfx('drone', 7.2);

// 3 · Colère (8,5 – 12 s) : Volta se charge à bloc, Givre tend la main trop tard, elle part comme une flèche
scene(8.5, 12, shakeAt(10.6, cam(8.5, 12, [[8.5, 0, 80, 0, 1.22], [10.4, 0, 0, 0, 1.04], [10.6, 0, 0, 0, 1.04], [12, -80, -30, -3, 1.14]], `
  ${BG(INK)}
  ${radial(540, 1150, 170, '#3a3410', [260, 520])}
  ${an('pulse', 8.5, `<circle cx="540" cy="1250" r="620" fill="url(#vglow)"/>`, [540, 1250], ';animation-iteration-count:infinite;animation-direction:alternate')}
  ${GROUND(1640, '#07070b')}
  ${put(figure('givre', 'point', { anim: 'idle' }), 150, 1620, 0.6)}
  ${vis(8.5, 10.6, `${aura(540, 1300, VOLTA, 3, 120, 8.6)}
    ${an('shakeS', 8.6, put(figure('volta', 'charge', { anim: 'charge', glow: true }), 540, 1620, 0.95), null, ';animation-iteration-count:5')}
    ${bolt(400, 820, 560, 1100, VOLTA, 10, 7, 30, 8.7)}${bolt(700, 860, 560, 1150, VOLTA, 10, 7, 30, 8.9)}${bolt(300, 1300, 470, 1240, VOLTA, 8, 6, 20, 9.2)}
    ${particles(50, VOLTA, [300, 780], [900, 1600], [0, -400], [3, 7], [0.4, 0.9])}`)}
  ${vis(10.6, 12, `${go(10.6, 0.7, [1300, -260], put(figure('volta', 'run', { anim: 'fight', glow: true }), 540, 1620, 0.95), 'cubic-bezier(.6,0,.9,.6)')}
    ${streaks(30, VOLTA, [900, 1600], 1400, [4, 9], [0.15, 0.3])}
    ${bolt(-100, 1300, 1200, 1100, VOLTA, 16, 10, 50, 10.7)}`)}
`, [540, 1200]), 2) + `
  ${bubbleFor(2, 560, 520, ['Lâche-la,', 'espèce de robot !'], [-20, 100])}
  ${vis(10.6, 12, onom(560, 760, 'FZZOOM !', 130, -8, VOLTA, INK, 10.65))}
  ${flashAt(10.6)}
`);
sfx('charge', 8.6); sfx('electric', 9.0); sfx('zap', 10.4); sfx('whoosh', 10.6);

// 4 · Le blindage (12 – 15,5 s) : la foudre glisse sur l'armure, le Mk II balaie Volta d'un revers
const chest = [720, 1090 - 0.8 * 110];
const hexes = Array.from({ length: 7 }, (_, i) => { const a = (i / 6) * Math.PI * 2, r = i === 6 ? 0 : 92; return [chest[0] + Math.cos(a) * r, chest[1] + Math.sin(a) * r]; })
  .map(([x, y]) => `<polygon points="${[0, 1, 2, 3, 4, 5].map((k) => `${f(x + Math.cos(k * Math.PI / 3 + Math.PI / 6) * 52)},${f(y + Math.sin(k * Math.PI / 3 + Math.PI / 6) * 52)}`).join(' ')}" fill="${RED}" fill-opacity=".18" stroke="${RED}" stroke-width="6"/>`).join('');
scene(12, 15.5, shakeAt(12.45, cam(12, 15.5, [[12, -60, 0, -2, 1.2], [12.4, 0, 0, 0, 1.05, 'ease-in'], [14.3, 20, -20, 1, 1.1], [15.5, -80, 30, -3, 1.2, 'ease-out']], `
  ${BG(PAPER)}
  <rect x="-700" y="-1000" width="${W + 1400}" height="2700" fill="url(#tone)" opacity=".28"/>
  ${radial(chest[0], chest[1], 150, INK, [300, 560])}
  ${GROUND(1650)}
  ${an('shakeS', 12.45, put(mk2(1.4), 720, 1090, 0.8), null, ';animation-iteration-count:3')}
  ${vis(12.4, 15.5, `<g class="flick1" style="animation-duration:.2s">${hexes}</g>`)}
  ${vis(12, 14.4, mv(12, 0.4, [-520, 160], put(figure('volta', 'leap', { anim: 'fight', glow: true }), 250, 1250, 0.62), 'ease-in'))}
  ${vis(12.35, 13.8, `${bolt(330, 1000, chest[0] - 60, chest[1], VOLTA, 22, 9, 40, 12.35)}
    ${bolt(chest[0], chest[1], 1150, 600, VOLTA, 10, 7, 40, 12.5)}${bolt(chest[0], chest[1], 1100, 1400, VOLTA, 10, 7, 40, 12.55)}${bolt(chest[0], chest[1], 640, 300, VOLTA, 8, 7, 40, 12.6)}`)}
  ${vis(12.45, 13.7, an('impact', 12.45, burst(chest[0] - 60, chest[1], 50, 220, 12, '#fff', VOLTA), [chest[0] - 60, chest[1]]))}
  ${particles(40, VOLTA, [500, 900], [800, 1200], [-500, -300], [3, 7], [0.4, 0.8])}
  ${vis(14.4, 15.5, `${go(14.4, 0.9, [-900, 500], put(figure('volta', 'leap', { anim: 'fight', shout: true }), 300, 1200, 0.62, -1), 'cubic-bezier(.2,.6,.4,1)', -70)}
    ${an('impact', 14.4, burst(360, 1100, 40, 200, 10, '#fff', RED), [360, 1100])}
    ${streaks(24, INK, [900, 1500], -1200, [3, 6], [0.15, 0.3])}`)}
`, [600, 1100]), 3) + `
  ${onom(400, 1420, 'KLANNG !', 120, -6, RED, INK, 12.45)}
  ${bubbleFor(3, 600, 420, ['Blindage isolant.'], [80, 100])}
  ${vis(14.4, 15.5, onom(330, 760, 'BAAM !', 140, 8, PAPER, INK, 14.45))}
  ${flashAt(12.45)}
`);
sfx('zap', 12.3); sfx('klang', 12.45); sfx('electric', 12.6); sfx('punch', 14.4); sfx('whoosh', 14.5);

// 5 · Choc + gros plan (15,5 – 19 s) : Volta s'écrase contre le château d'eau ; Écho, à travers les barreaux
scene(15.5, 19, `
  ${vis(15.5, 16.7, shakeAt(15.6, cam(15.5, 16.7, [[15.5, 0, 0, 0, 1.25], [15.8, 0, 0, 0, 1.05, 'ease-out'], [16.7, 40, -20, 2, 1.12]], `
    ${sky}
    ${rooftops(1560)}
    ${an('shakeS', 15.6, waterTower(690, 1560, 1.2), null, ';animation-iteration-count:2')}
    ${cracks(600, 1100, 7, 170, PAPER, 5)}
    ${an('impact', 15.6, burst(600, 1100, 60, 260, 12, '#fff', VOLTA), [600, 1100])}
    ${put(figure('volta', 'kneel', { anim: 'fight' }), 520, 1580, 0.75, 1, -12)}
    ${an('drift', 15.6, smoke(560, 1500, 12, 700, '#4a4a56', 0.9))}
    ${particles(30, '#c9c9d4', [380, 820], [1000, 1300], [0, 400], [3, 8], [0.5, 1])}`, [600, 1200]), 2))}
  ${vis(16.7, 19, cam(16.7, 19, [[16.7, 0, 0, 0, 1.0], [19, 0, -20, 0, 1.08]], `
    ${BG('#12040a')}
    ${particles(40, RED, [0, W], [300, 1700], [0, -300], [2, 5], [1, 2])}
    ${panel('ep6eyes', 60, 520, 960, 700, `${BG('#1e0a14')}${an('pulse', 16.7, `<circle cx="540" cy="880" r="520" fill="url(#rglow)"/>`, [540, 880], ';animation-iteration-count:infinite;animation-direction:alternate')}
      ${bigEyes(540, 900, 'echo')}
            <g class="flick1" style="animation-duration:.3s">${[180, 360, 540, 720, 900].map((x) => `<rect x="${x - 9}" y="520" width="18" height="700" fill="${RED}" opacity=".85"/>`).join('')}</g>`, INK)}`, [540, 870]))}
  ${vis(15.5, 16.7, onom(560, 760, 'BLAM !', 150, -6, VOLTA, INK, 15.6))}
  ${bubbleFor(4, 540, 1360, ['Volta…', 'ne viens pas…'], [0, -100])}
  ${flashAt(15.6)}
`);
sfx('bigboom', 15.6); sfx('klang', 15.7); sfx('heart', 16.8); sfx('electric', 17.6);

// 6 · Décollage (19 – 22,5 s) : les réacteurs s'allument, Volta saute après le robot, le souffle la rejette
scene(19, 22.5, cam(19, 22.5, [[19, 0, 60, 0, 1.12], [21.1, 0, 0, 0, 1.0], [21.3, 30, -30, 2, 1.06, 'ease-in'], [22.5, -30, 0, -1, 1.12]], `
  ${sky}
  ${an('parx', 19, city(1300, '#0b0b12', RED))}
  ${rooftops(1600)}
  ${go(19.4, 3.1, [180, -1500], an('hover', 19, put(mk2Carry(0.6, 1), 740, 900, 0.55), null, ';animation-iteration-count:infinite;animation-direction:alternate'), 'cubic-bezier(.5,0,.9,.6)')}
  ${vis(19.3, 21.2, mv(19.5, 0.9, [-300, 640], put(figure('volta', 'leap', { anim: 'fight', glow: true }), 420, 1320, 0.6), 'cubic-bezier(.2,.8,.4,1)'))}
  ${vis(19.5, 21.2, particles(30, VOLTA, [300, 560], [900, 1300], [0, 300], [3, 6], [0.4, 0.8]))}
  ${vis(21.2, 22.5, go(21.2, 1.1, [-520, 700], put(figure('volta', 'leap', { anim: 'fight', shout: true }), 420, 1320, 0.6, 1, -20), 'cubic-bezier(.2,.6,.4,1)', -110))}
  ${vis(21.1, 22.5, `${an('impact', 21.15, burst(470, 1050, 40, 260, 12, '#fff', ORANGE), [470, 1050])}${an('drift', 21.1, smoke(560, 1250, 12, 700, '#55505a', 0.85))}`)}
  ${particles(40, ORANGE, [500, 1000], [900, 1700], [0, 500], [3, 8], [0.4, 0.9])}
`, [540, 1100]) + `
  ${bubbleFor(5, 300, 680, ['Arrête-toi !'], [80, 110])}
  ${vis(21.1, 22.5, onom(540, 1380, 'FWOOOSH !', 120, -6, ORANGE, INK, 21.15))}
`);
sfx('powerup', 19.2); sfx('missile', 19.5); sfx('whoosh', 19.6); sfx('boom', 21.15); sfx('wind', 21.3);

// 7 · Retombée (22,5 – 26 s) : Volta s'écrase sur le toit, Givre accourt
scene(22.5, 26, shakeAt(22.9, cam(22.5, 26, [[22.5, 0, -40, 0, 1.18], [22.9, 0, 0, 0, 1.05, 'ease-in'], [26, 60, -30, 1.5, 1.14]], `
  ${sky}
  ${an('parx', 22.5, city(1250, '#0b0b12', VOLTA))}
  ${GROUND(1580, '#0d0d14')}
  ${mv(22.5, 0.4, [-260, -900], put(figure('volta', 'kneel', { anim: 'idle' }), 400, 1600, 0.85), 'ease-in', -40)}
  ${vis(22.9, 26, `${cracks(400, 1590, 8, 260, VOLTA, 5)}${vis(22.9, 23.5, an('impact', 22.9, burst(400, 1560, 60, 300, 12, '#fff', VOLTA), [400, 1560]))}
    ${an('drift', 22.9, smoke(420, 1570, 14, 800, '#23232c', 0.75))}
    <g class="flick2">${bolt(330, 1300, 260, 1180, VOLTA, 5, 5, 16, 23.2)}${bolt(470, 1280, 540, 1160, VOLTA, 5, 5, 16, 23.4)}</g>`)}
  ${mv(23.2, 1.1, [700, 0], put(figure('givre', 'run', { anim: 'fight' }), 780, 1600, 0.7, -1))}
  ${particles(30, '#c9c9d4', [100, 800], [1300, 1600], [0, -300], [2, 5], [1, 2], 0.7)}
`, [500, 1300]), 2) + `
  ${onom(560, 760, 'BOUM !', 150, -5, VOLTA, INK, 22.9)}
  ${bubbleFor(6, 680, 820, ['Hé, Volta ! Ça va ?'], [60, 110])}
`);
sfx('whoosh', 22.5); sfx('bigboom', 22.9); sfx('electric', 23.3); sfx('step', 23.5); sfx('step', 24.0);

// 8 · Vers la Tour (26 – 29,5 s) : le Mk II n'est plus qu'un point rouge qui file vers la Tour OMEGA ; Volta se relève, furieuse
scene(26, 29.5, cam(26, 29.5, [[26, 40, -20, 0, 1.0], [29.5, -30, 40, -1, 1.14]], `
  ${sky}
  ${an('pulse', 26, `<circle cx="880" cy="700" r="520" fill="url(#rglow)"/>`, [880, 700], ';animation-iteration-count:infinite;animation-direction:alternate')}
  ${an('parx', 26, city(1450, '#0a0a10', RED))}
  ${tower(880, 1460, 0.5)}
  <path d="M260 440 Q560 480 860 720" fill="none" stroke="${RED}" stroke-width="5" stroke-dasharray="14 18" class="flow" opacity=".7"/>
  ${go(26, 3.5, [560, 260], put(mk2Carry(0.6, 0.6), 280, 450, 0.11), 'ease-in')}
  ${GROUND(1520, '#060609')}
  ${aura(290, 1250, VOLTA, 2, 90, 26.2)}
  ${an('shakeS', 26.3, put(figure('volta', 'charge', { anim: 'charge', glow: true, shout: true }), 290, 1640, 0.85), null, ';animation-iteration-count:6')}
  ${bolt(160, 1000, 290, 1200, VOLTA, 8, 6, 20, 26.3)}${bolt(430, 980, 300, 1220, VOLTA, 8, 6, 20, 26.6)}
  ${particles(44, VOLTA, [100, 520], [1000, 1600], [0, -360], [3, 7], [0.5, 1])}
`, [400, 1200]) + `
  ${bubbleFor(7, 520, 760, ["J'y vais. Seule,", "s'il le faut !"], [-130, 110])}
`);
sfx('charge', 26.2); sfx('electric', 26.6); sfx('drone', 27.0); sfx('zap', 28.0);

// 9 · Givre la retient (29,5 – 33 s) : sa main gèle le poignet de Volta, les étincelles s'éteignent
const gH = hand('point', 'ra', 300, 1640, 0.85);
const vL = hand('run', 'la', 0, 1640, 0.85);
const VX = gH[0] - vL[0] + 10;
scene(29.5, 33, cam(29.5, 33, [[29.5, -40, 40, -1, 1.14], [31.5, 0, 0, 0, 1.06], [33, 40, -20, 1, 1.12]], `
  ${BG('#0c1a24')}
  ${radial(gH[0], gH[1], 120, '#123446', [280, 520])}
  ${an('parx', 29.5, city(1460, '#081018', GIVRE))}
  ${GROUND(1560, '#050a0e')}
  ${an('shakeS', 29.6, put(figure('volta', 'run', { anim: 'fight' }), VX, 1640, 0.85), null, ';animation-iteration-count:3')}
  ${put(figure('givre', 'point', { anim: 'idle', glow: true }), 300, 1640, 0.85)}
  ${an('rise', 29.7, `${crystal(gH[0] - 20, gH[1] + 30, 70, 110, -10)}${crystal(gH[0] + 30, gH[1] + 30, 60, 90, 12)}`)}
  ${aura(gH[0], gH[1], GIVRE, 2, 50, 29.7)}
  ${particles(40, '#c8f1ff', [gH[0] - 200, gH[0] + 260], [gH[1] - 260, gH[1] + 200], [0, -200], [2, 6], [0.8, 1.6])}
  ${vis(29.5, 30.6, particles(24, VOLTA, [VX - 120, VX + 160], [1000, 1400], [0, -260], [3, 6], [0.4, 0.8]))}
  ${particles(40, PAPER, [-200, 1280], [0, 1500], [-160, 260], [2, 4], [2, 4], 0.25)}
`, [540, 1300]) + `
  ${onom(gH[0], 1390, 'KRRSH', 90, -4, GIVRE, INK, 29.7)}
  ${bubbleFor(8, 360, 760, ["On a besoin", "d'un plan."], [-20, 110])}
  ${bubbleFor(9, 700, 760, ['Pas le temps', 'de discuter !'], [40, 110])}
`);
sfx('freeze', 29.7); sfx('ice', 29.9); sfx('powerdown', 30.4); sfx('wind', 31.0);

// 10 · « J'ai un plan. » + carton (33 – 40 s) : Mirage se matérialise sur le château d'eau, la Tour au loin
scene(33, 40, cam(33, 40, [[33, 0, 80, 0, 1.16], [35.2, 0, 0, 0, 1.0, 'ease-out'], [40, 0, -30, 0, 1.05]], `
  ${sky}
  ${an('pulse', 33, `<circle cx="540" cy="720" r="640" fill="url(#rglow)"/>`, [540, 720], ';animation-iteration-count:infinite;animation-direction:alternate')}
  ${an('parx', 33, city(1400, '#09090f', RED))}
  ${tower(540, 1420, 0.48)}
  ${waterTower(800, 1560, 0.55)}
  ${GROUND(1560, '#050508')}
  ${an('pulse', 33.4, `<circle cx="800" cy="1000" r="300" fill="url(#gglow)"/>`, [800, 1000], ';animation-iteration-count:infinite;animation-direction:alternate')}
  ${vis(33, 33.9, ghost(put(figure('mirage', 'hips', { anim: 'idle' }), 800, 1232, 0.6, -1), 0.05, 0.3))}
  ${vis(33.8, 40, fadeIn(33.8, 0.6, put(figure('mirage', 'hips', { anim: 'idle', glow: true }), 800, 1232, 0.6, -1)))}
  ${particles(40, MIRAGE, [640, 960], [800, 1300], [0, -260], [2, 6], [0.8, 1.8])}
  ${put(figure('volta', 'stand', { anim: 'idle' }), 200, 1640, 0.66)}
  ${put(figure('givre', 'stand', { anim: 'idle' }), 400, 1640, 0.64)}
  ${particles(40, PAPER, [-200, 1200], [0, 1500], [-160, 260], [2, 4], [2, 4], 0.3)}
`, [540, 1300]) + `
  ${vis(33.8, 36.9, onom(820, 700, 'SHIIIN', 90, 6, MIRAGE, INK, 33.8))}
  ${bubbleFor(10, 560, 760, ["J'ai un plan."], [190, 120])}
  ${finalCard(36.9, 'ÉPISODE 7 BIENTÔT')}
`);
sfx('shimmer', 33.4); sfx('invis', 33.8); sfx('eye', 36.9); sfx('hit', 37.0);

L.build(import.meta.url, 'les-anomalies-ep6');
