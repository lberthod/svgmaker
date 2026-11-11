// « LES ANOMALIES » ép. 15 · Oméga (final de saison) : manga d'action, 40 s, 1080x1920 (Reel).
// L'IA OMEGA prend le contrôle de toutes les machines de Néo-Lyre. Formation Delta + Mirage :
// illusions, glace, télékinésie et foudre détruisent le noyau. Aube sur la ville… mais Kessler s'enfuit
// et un œil vert s'ouvre dans l'ombre : saison 2.
// Usage : node make.mjs → les-anomalies-ep15.svg + timeline.json (lu par audio.py)
import * as L from '../les-anomalies/lib.mjs';
const { W, H, PAPER, INK, NIGHT, RED, VOLTA, GIVRE, ECHO, MIRAGE, ORANGE, rnd, f, vis, scene, an, radial, burst, cracks, bolt, onom,
  bubbleFor, figure, hand, put, robotG, aura, crystal, smoke, reticle, BG, GROUND, cam, particles, streaks, shakeAt, flashAt, sfx,
  mv, go, anim, fadeIn, fadeOut, ghost, spin, holo, tower, header, hook, caption, finalCard, city, swarm } = L;
L.reseed(15 * 101);

const LINES = [
  { who: 'omega', t0: 1.4, t1: 3.4, text: 'Je suis OMEGA.' },
  { who: 'omega', t0: 4.9, t1: 7.3, text: "Toutes les machines m'obéissent." },
  { who: 'volta', t0: 8.9, t1: 10.3, text: 'Ça fait du monde !' },
  { who: 'givre', t0: 11.7, t1: 13.0, text: 'Formation Delta !' },
  { who: 'mirage', t0: 13.4, t1: 14.9, text: 'Avec moi, cette fois.' },
  { who: 'mirage', t0: 16.0, t1: 17.5, text: 'Visez, si vous pouvez !' },
  { who: 'givre', t0: 20.2, t1: 21.5, text: 'Le bouclier gèle !' },
  { who: 'echo', t0: 23.1, t1: 24.5, text: "Je l'ouvre… maintenant !" },
  { who: 'volta', t0: 26.1, t1: 27.6, text: "C'est terminé, OMEGA !" },
  { who: 'echo', t0: 30.4, t1: 31.8, text: "C'est fini, on a gagné." },
  { who: 'volta', t0: 32.0, t1: 33.2, text: 'Nous sommes les Anomalies !' },
  { who: 'kessler', t0: 33.7, t1: 35.4, text: "Ce n'est qu'un début…" },
];
L.setLines(LINES);

// ---------- Bulle « machine » pour OMEGA (la lib ne stylise en rouge que le robot) ----------
const mBubble = (k, x, y, lines, [tx, ty] = [0, 70]) => {
  const Ln = LINES[k], w = Math.max(...lines.map((l) => l.length)) * 27.5 + 70, h = lines.length * 50 + 56, sg = Math.sign(ty || 1);
  return vis(Ln.t0, Ln.t1, an('pop', Ln.t0, `
    <path d="M${x - 24} ${y + sg * (h / 2 - 12)} L${x + tx} ${y + ty + sg * (h / 2)} L${x + 24} ${y + sg * (h / 2 - 12)}Z" fill="${INK}" stroke="${RED}" stroke-width="5" stroke-linejoin="round"/>
    <rect x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${f(h)}" fill="${INK}" stroke="${RED}" stroke-width="6" filter="url(#glow)"/>
    <rect x="${f(x - w / 2 + 10)}" y="${f(y - h / 2 + 10)}" width="${f(w - 20)}" height="${f(h - 20)}" fill="none" stroke="${RED}" stroke-width="2" opacity=".6"/>
    <path d="M${x - 22} ${y + sg * (h / 2 - 3)} L${x + 22} ${y + sg * (h / 2 - 3)}" stroke="${INK}" stroke-width="8"/>
    ${lines.map((l, i) => `<text x="${x}" y="${f(y - ((lines.length - 1) * 50) / 2 + i * 50 + 14)}" class="rt">${l}</text>`).join('')}`));
};
// bandeau d'alerte HUD (rouge clignotant)
const alertBar = (a, b, txt, y = 236, color = RED) => vis(a, b, an('blink', a, `<rect x="160" y="${y}" width="760" height="80" fill="${INK}" stroke="${color}" stroke-width="5"/><text x="540" y="${y + 54}" class="rt" style="font-size:40px" fill="${color}">${txt}</text>`, null, ';animation-iteration-count:infinite'));

// ---------- Dessins propres à l'épisode ----------
const OMEGA_SYM = (s = 1, color = RED, w = 14) => `<path transform="scale(${s})" d="M-56 34 L-24 34 L-24 14 A62 62 0 1 1 24 14 L24 34 L56 34" fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round"/>`;
// le grand œil OMEGA (centré en 0,0, ≈ 840 × 520)
const omegaEye = (color = RED) => `<g>
  <path d="M-430 0 Q0 -290 430 0 Q0 290 -430 0Z" fill="#14000a" stroke="${color}" stroke-width="12" filter="url(#glow)"/>
  <path d="M-380 0 Q0 -240 380 0" fill="none" stroke="${color}" stroke-width="3" opacity=".5"/>
  <g class="dart">
    <circle r="168" fill="${color}" opacity=".35" filter="url(#glow)"/>
    <circle r="150" fill="none" stroke="${color}" stroke-width="16"/>
    <circle r="112" fill="#2a0005" stroke="${color}" stroke-width="5"/>
    ${spin(0, 0, 3, `<circle r="132" fill="none" stroke="${color}" stroke-width="6" stroke-dasharray="30 22"/>`)}
    <g class="epulse" style="transform-origin:0px 0px">${OMEGA_SYM(1.2, color, 16)}</g>
    <circle cx="-60" cy="-70" r="16" fill="#fff" opacity=".8"/>
  </g></g>`;
// noyau d'OMEGA (sphère + anneaux qui tournent), centre (cx, cy)
const core = (cx, cy, r) => `
  <circle cx="${cx}" cy="${cy}" r="${r * 2.2}" fill="url(#rglow)"/>
  ${spin(cx, cy, 2.4, `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.55}" ry="${r * 0.45}" fill="none" stroke="${RED}" stroke-width="10" stroke-dasharray="60 30"/>`)}
  ${spin(cx, cy, 3.6, `<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.45}" ry="${r * 1.5}" fill="none" stroke="${ORANGE}" stroke-width="6" stroke-dasharray="40 26"/>`)}
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#2a0005" stroke="${RED}" stroke-width="12" filter="url(#glow)"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.7}" fill="${RED}" opacity=".45"/>
  <g class="epulse" style="transform-origin:${cx}px ${cy}px"><g transform="translate(${cx} ${cy})">${OMEGA_SYM(r / 70, '#fff', 12)}</g></g>`;
// bouclier : hexagone autour du noyau
const hexPts = (cx, cy, r) => Array.from({ length: 6 }, (_, i) => `${f(cx + Math.cos((i / 6) * Math.PI * 2 + Math.PI / 6) * r)},${f(cy + Math.sin((i / 6) * Math.PI * 2 + Math.PI / 6) * r)}`).join(' ');
const redDome = (cx, cy, r) => `<g class="flick1" style="animation-duration:.4s"><polygon points="${hexPts(cx, cy, r)}" fill="${RED}" fill-opacity=".1" stroke="${RED}" stroke-width="10" filter="url(#glow)"/></g>`;
const iceDome = (cx, cy, r) => `<polygon points="${hexPts(cx, cy, r)}" fill="#c8f1ff" fill-opacity=".45" stroke="${GIVRE}" stroke-width="14" filter="url(#glow)"/>
  ${cracks(cx, cy, 7, r * 0.9, '#fff', 5)}<polygon points="${hexPts(cx, cy, r * 0.82)}" fill="none" stroke="#fff" stroke-width="4" opacity=".7"/>`;
// éclats qui volent (classe chunk de la lib, variables --cx --cy --cr)
const shards = (cx, cy, n, t, color = '#c8f1ff', dist = 900) => Array.from({ length: n }, (_, i) => {
  const a = (i / n) * Math.PI * 2 + rnd(-0.2, 0.2), d = rnd(0.6, 1.2) * dist, s = rnd(30, 70);
  return `<g class="chunk" style="animation-delay:${t}s;--cx:${f(Math.cos(a) * d)}px;--cy:${f(Math.sin(a) * d)}px;--cr:${f(rnd(-300, 300))}deg"><polygon points="${f(cx)},${f(cy - s)} ${f(cx + s * 0.7)},${f(cy + s * 0.4)} ${f(cx - s * 0.5)},${f(cy + s * 0.6)}" fill="${color}" stroke="${INK}" stroke-width="4"/></g>`;
}).join('');
// Traqueur posé pieds au sol (yFeet), avec yeux rouges
const trq = (x, yFeet, s, m = 1, o = {}) => put(robotG(1, o), x, yFeet - 700 * s, s, m);
const ROOF = (y, c = '#07070b', line = RED) => `${GROUND(y, c)}<g stroke="${line}" stroke-width="3" opacity=".28">${[-9, -6, -4, -2.5, -1.2, 0, 1.2, 2.5, 4, 6, 9].map((k) => `<path d="M${540 + k * 40} ${y} L${540 + k * 260} ${y + 700}"/>`).join('')}${[40, 110, 210, 350].map((d) => `<path d="M-700 ${y + d} L1780 ${y + d}"/>`).join('')}</g><path d="M-700 ${y} L1780 ${y}" stroke="${line}" stroke-width="4" opacity=".55"/>`;

// =====================================================================
// 1 · L'œil s'allume (0 – 4 s) : sur le toit de la Tour, l'écran géant s'éveille au-dessus des quatre héros
scene(0, 4, cam(0, 4, [[0, 0, 40, 0, 1.0], [4, 0, -20, -1.5, 1.12]], `
  ${BG(NIGHT)}<rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="url(#toneP)" opacity=".12"/>
  ${an('parx', 0, city(1450, '#07070b', RED))}
  ${an('pulse', 0.4, `<circle cx="540" cy="740" r="760" fill="url(#rglow)"/>`, [540, 740], ';animation-iteration-count:infinite')}
  ${vis(0.6, 4, radial(540, 740, 110, RED, [460, 640]))}
  <rect x="80" y="430" width="920" height="620" fill="#0a0006" stroke="${RED}" stroke-width="10"/>
  <rect x="100" y="450" width="880" height="580" fill="none" stroke="${RED}" stroke-width="3" opacity=".5"/>
  ${an('eyeOpen', 0.4, put(omegaEye(), 540, 740, 0.95), [540, 740])}
  <g fill="${RED}" opacity=".12" class="scanlines" style="animation-iteration-count:infinite;animation-duration:.6s">${Array.from({ length: 28 }, (_, i) => `<rect x="80" y="${430 + i * 22}" width="920" height="6"/>`).join('')}</g>
  ${ROOF(1540)}
  ${particles(34, RED, [-100, 1180], [400, 1500], [0, -260], [2, 5], [1.4, 2.6], 0.7)}
  ${put(figure('givre', 'guard', { anim: 'idle' }), 210, 1540, 0.52)}
  ${put(figure('volta', 'hips', { anim: 'fight' }), 420, 1550, 0.56)}
  ${put(figure('echo', 'guard', { anim: 'idle', float: true }), 650, 1530, 0.54, -1)}
  ${put(figure('mirage', 'stand', { anim: 'idle' }), 870, 1540, 0.52, -1)}
`, [540, 760]) + `
  ${header(15, 'Oméga')}
  ${hook('Le vrai boss n’a jamais été humain.', 0.3, 1150)}
  ${mBubble(0, 540, 370, ['Je suis OMEGA.'], [0, 60])}
`);
sfx('hit', 0.05); sfx('eye', 0.4); sfx('rumble', 0.6); sfx('heart', 2.6);

// 2 · Toutes les machines (4 – 8,5 s) : la ville vire au rouge, écrans Ω, drones et Traqueurs se réveillent
scene(4, 8.5, cam(4, 8.5, [[4, 0, -160, 0, 1.12], [8.5, 0, 0, -2, 1.0]], `
  ${BG('#120208')}
  ${radial(540, 700, 90, '#3a0610', [240, 480])}
  ${an('parx', 4, city(1250, '#07070b', RED))}
  ${[[120, 700, 220, 160], [760, 620, 240, 180], [430, 900, 200, 140]].map(([x, y, w, h], i) => an('pop', 4.3 + i * 0.25,
    holo(x, y, w, h, `<g transform="translate(${x + w / 2} ${y + h / 2 - 10})">${OMEGA_SYM(1, RED, 12)}</g>`))).join('')}
  ${mv(4, 3.5, [0, 600], swarm(24, [-80, 1160], [300, 1150], [0.3, 0.65]), 'cubic-bezier(.3,.7,.3,1)')}
  ${ROOF(1580)}
  ${[[200, 0.36, 1], [540, 0.44, 1], [880, 0.36, -1]].map(([x, s, m], i) => `${trq(x, 1580, s, m)}
    ${an('eyeOpen', 4.8 + i * 0.3, `<ellipse cx="${x}" cy="${f(1580 - 700 * s - 442 * s)}" rx="${f(60 * s)}" ry="${f(22 * s)}" fill="${RED}" filter="url(#glow)"/>`, [x, f(1580 - 700 * s - 442 * s)])}`).join('')}
  ${an('scan', 6.2, `<polygon points="540,1050 120,1700 960,1700" fill="${RED}" opacity=".16"/>`, [540, 1050])}
  ${particles(40, RED, [-100, 1180], [300, 1700], [0, -400], [2, 5], [1, 2])}
`, [540, 960]) + `
  ${alertBar(4.3, 8.5, 'RÉSEAU · CONTRÔLE TOTAL')}
  ${mBubble(1, 540, 480, ['Toutes les machines', "m'obéissent."], [0, 70])}
`);
sfx('powerup', 4.1); sfx('swarm', 4.6); sfx('lock', 4.8); sfx('lock', 5.1); sfx('lock', 5.4); sfx('alarm', 6.0); sfx('siren', 6.2);

// 3 · Encerclés (8,5 – 11,5 s) : dos à dos sur le toit, Traqueurs et drones se referment
scene(8.5, 11.5, cam(8.5, 11.5, [[8.5, -70, 0, -3, 1.15], [11.5, 60, -20, 3, 1.04]], `
  ${BG(NIGHT)}
  ${radial(540, 1200, 120, '#2a0a12', [320, 560])}
  ${swarm(16, [-60, 1140], [320, 900], [0.25, 0.5])}
  ${mv(8.5, 2.2, [-420, 0], `${trq(40, 1300, 0.3)}${trq(230, 1290, 0.28)}`)}
  ${mv(8.5, 2.2, [420, 0], `${trq(850, 1290, 0.28, -1)}${trq(1040, 1300, 0.3, -1)}`)}
  <rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="${NIGHT}" opacity=".35"/>
  ${ROOF(1500)}
  ${put(figure('givre', 'guard', { anim: 'fight' }), 250, 1500, 0.56)}
  ${put(figure('volta', 'charge', { anim: 'charge', glow: true, shout: true }), 450, 1510, 0.58)}
  ${particles(26, VOLTA, [400, 520], [1120, 1260], [0, -200], [2, 6], [0.3, 0.7])}
  ${put(figure('echo', 'guard', { anim: 'fight', float: true }), 650, 1490, 0.56, -1)}
  ${put(figure('mirage', 'hips', { anim: 'fight' }), 850, 1500, 0.56, -1)}
  ${reticle(250, 1300, 60, 9.3)}${reticle(650, 1290, 60, 9.6)}${reticle(850, 1310, 60, 9.9)}
  ${vis(10.4, 11.5, `<g class="flick1"><path d="M-200 600 L640 1250" stroke="${RED}" stroke-width="10" filter="url(#glow)"/><path d="M1300 520 L460 1220" stroke="${RED}" stroke-width="10" filter="url(#glow)"/></g>`)}
`, [540, 1200]) + `
  ${bubbleFor(2, 450, 600, ['Ça fait du monde !'], [0, 100])}
`);
sfx('step', 8.6); sfx('step', 9.0); sfx('lock', 9.3); sfx('lock', 9.6); sfx('lock', 9.9); sfx('charge', 9.2); sfx('laser', 10.4);

// 4 · Formation Delta (11,5 – 15,5 s) : triangle Givre-Volta-Écho, puis Mirage les rejoint au centre
const DV = [540, 900], DG = [230, 1250], DE = [850, 1250];
scene(11.5, 15.5, shakeAt(13.35, cam(11.5, 15.5, [[11.5, 0, 0, -4, 1.25], [13.2, 0, 0, 0, 1.04, 'ease-out'], [15.5, 0, -30, 2, 1.12]], `
  ${BG(PAPER)}
  <rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="url(#tone)" opacity=".25"/>
  ${radial(540, 1100, 160, INK, [380, 620])}
  ${GROUND(1520)}
  <polygon points="${DV.join(',')} ${DG.join(',')} ${DE.join(',')}" fill="${PAPER}" opacity=".7"/>
  ${[[DV, DG, VOLTA], [DG, DE, GIVRE], [DE, DV, ECHO]].map(([a, b, c], i) => `<path d="M${a.join(' ')} L${b.join(' ')}" stroke="${c}" stroke-width="16" filter="url(#glow)" pathLength="1" class="draw" style="animation-delay:${11.8 + i * 0.3}s"/>`).join('')}
  ${aura(540, 1130, MIRAGE, 3, 90, 13.4)}
  ${put(figure('volta', 'charge', { anim: 'charge', glow: true }), 540, 1130, 0.5)}
  ${put(figure('givre', 'cast', { anim: 'cast', glow: true }), 210, 1520, 0.62)}
  ${put(figure('echo', 'cast', { anim: 'cast', glow: true, float: true }), 870, 1520, 0.62, -1)}
  ${vis(13.3, 15.5, fadeIn(13.3, 0.4, put(figure('mirage', 'hips', { anim: 'idle', glow: true }), 540, 1560, 0.5)))}
  ${vis(13.3, 15.5, particles(40, MIRAGE, [380, 700], [1100, 1560], [0, -300], [3, 7], [0.6, 1.4]))}
  ${particles(30, INK, [-100, 1180], [400, 1500], [0, -200], [2, 4], [1, 2], 0.4)}
`, [540, 1200]), 2, 'shakeS') + `
  ${bubbleFor(3, 400, 400, ['Formation Delta !'], [-120, 100])}
  ${bubbleFor(4, 560, 400, ['Avec moi,', 'cette fois.'], [0, 120])}
`);
sfx('whoosh', 11.6); sfx('zap', 11.8); sfx('ice', 12.1); sfx('tk', 12.4); sfx('invis', 13.3); sfx('shimmer', 13.5);

// 5 · Les illusions (15,5 – 19,3 s) : quarante copies de l'équipe, les machines tirent dans le vide
const KEYS = ['volta', 'givre', 'echo', 'mirage'];
const row = (n, y, s, x0, x1, t0, real = -1) => Array.from({ length: n }, (_, i) => {
  const k = KEYS[(i + n) % 4], x = x0 + ((x1 - x0) * i) / (n - 1);
  const fig = put(figure(k, ['guard', 'hips', 'cast', 'stand'][i % 4], { anim: 'idle', glow: true, float: k === 'echo' }), x, y, s, i % 2 ? -1 : 1);
  return an('pop', t0 + i * 0.07, i === real ? fig : ghost(fig, 0.3, 0.75));
}).join('');
scene(15.5, 19.3, cam(15.5, 19.3, [[15.5, -110, 0, 0, 1.12], [17.6, 110, -20, 0, 1.12], [19.3, 0, -40, 1, 1.0]], `
  ${BG('#06140c')}
  ${radial(540, 1200, 170, '#0d3a20', [320, 560])}
  ${an('pulse', 15.5, `<circle cx="540" cy="1200" r="620" fill="url(#gglow)"/>`, [540, 1200], ';animation-iteration-count:infinite')}
  ${GROUND(1560, '#04080a')}
  ${row(8, 1160, 0.28, 0, 1080, 15.6)}
  ${row(6, 1340, 0.4, 60, 1020, 15.8)}
  ${row(4, 1560, 0.55, 150, 930, 16.0, 3)}
  ${vis(16.6, 19.3, `<g class="flick1">${[[140, 1250], [430, 1070], [700, 1200], [960, 1080], [300, 1400]].map(([x, y], i) => `<path d="M${i % 2 ? 1300 : -220} ${300 + i * 80} L${x} ${y}" stroke="${RED}" stroke-width="9" filter="url(#glow)"/>`).join('')}</g>
    ${[[140, 1250], [430, 1070], [700, 1200], [960, 1080], [300, 1400]].map(([x, y], i) => an('impact', 16.7 + i * 0.12, burst(x, y, 30, 110, 10, '#fff', RED), [x, y])).join('')}`)}
  ${particles(50, MIRAGE, [0, W], [600, 1700], [0, -300], [2, 5], [1, 2.2])}
`, [540, 1200]) + `
  ${bubbleFor(5, 540, 440, ['Visez, si vous', 'pouvez !'], [140, 110])}
  ${onom(540, 760, 'SHIIIN', 110, -4, MIRAGE, INK, 15.6)}
  ${alertBar(17.6, 19.3, 'ERREUR · CIBLES ×40')}
`);
sfx('shimmer', 15.6); sfx('invis', 15.8); sfx('laser', 16.6); sfx('hit', 16.8); sfx('hit', 17.1); sfx('glitch', 17.6);

// 6 · Bouclier gelé (19,3 – 22,8 s) : vague de glace sur les robots, le bouclier rouge du noyau gèle
const CX = 540, CY = 560;
scene(19.3, 22.8, shakeAt(20.6, cam(19.3, 22.8, [[19.3, 80, 60, 2, 1.18], [20.6, 0, 0, 0, 1.0, 'ease-out'], [22.8, -30, -30, -1, 1.08]], `
  ${BG(NIGHT)}
  ${radial(CX, CY, 100, '#0c2a3a', [300, 480])}
  ${core(CX, CY, 120)}
  ${vis(19.3, 20.6, redDome(CX, CY, 270))}
  ${vis(20.6, 22.8, an('impact', 20.6, iceDome(CX, CY, 270), [CX, CY]))}
  ${vis(20.6, 22.8, particles(40, '#c8f1ff', [260, 820], [300, 820], [0, 200], [3, 7], [0.8, 1.6]))}
  ${ROOF(1500)}
  ${[[560, 0.32], [880, 0.32]].map(([x, s]) => an('shakeS', 20.2, trq(x, 1500, s, -1), null, ';animation-iteration-count:3')).join('')}
  ${an('rise', 20.1, [560, 880].map((x) => `${crystal(x - 70, 1505, 140, 330, -12)}${crystal(x + 60, 1505, 130, 290, 14)}${crystal(x, 1505, 120, 380, 0)}`).join(''))}
  <path d="M120 1505 L1780 1505" stroke="${GIVRE}" stroke-width="14" filter="url(#glow)" pathLength="1" class="draw" style="animation-delay:19.9s"/>
  ${mv(19.3, 0.5, [-300, 0], put(figure('givre', 'cast', { glow: true, anim: 'cast' }), 200, 1560, 0.66))}
  ${aura(330, 1500, GIVRE, 3, 70, 19.6)}
  ${particles(40, GIVRE, [100, 1100], [1300, 1520], [0, -500], [3, 7], [0.6, 1.4])}
`, [540, 1100]), 3, 'shakeS') + `
  ${onom(540, 400, 'KRIIIK !', 110, -5, GIVRE, INK, 20.6)}
  ${bubbleFor(6, 640, 960, ['Le bouclier gèle !'], [-220, 100])}
`);
sfx('freeze', 19.6); sfx('iceWall', 20.1); sfx('glass', 20.6); sfx('ice', 21.4);

// 7 · Écho ouvre le noyau (22,8 – 26 s) : la glace éclate, le noyau est arraché vers elle
const eH = hand('castUp', 'ra', 250, 1580, 0.72);
scene(22.8, 26, shakeAt(24.6, cam(22.8, 26, [[22.8, 0, 0, 0, 1.0], [24.5, 0, -20, -2, 1.12, 'ease-in'], [24.7, 0, 0, 0, 1.18], [26, 20, -30, 1, 1.06, 'ease-out']], `
  ${BG('#100a1c')}
  ${radial(620, 560, 130, '#2a1648', [300, 520])}
  ${an('pulse', 22.8, `<circle cx="620" cy="560" r="640" fill="url(#rglow)"/>`, [620, 560], ';animation-iteration-count:infinite')}
  ${mv(24.6, 1.4, [80, -60], core(620, 560, 140), 'cubic-bezier(.3,.7,.3,1)')}
  ${vis(22.8, 24.6, an('shakeS', 23.2, iceDome(620, 560, 290), null, ';animation-iteration-count:4'))}
  ${vis(24.6, 26, shards(620, 560, 22, 24.6))}
  ${vis(24.6, 26, an('impact', 24.6, burst(620, 560, 140, 420, 16, 'none', ECHO), [620, 560]))}
  ${[0, 1, 2].map((i) => `<path d="M${f(eH[0])} ${f(eH[1])} Q${380 + i * 120} ${780 - i * 60} ${560 + i * 60} ${680 - i * 50}" fill="none" stroke="${ECHO}" stroke-width="${10 - i * 2}" stroke-dasharray="16 12" class="flow" filter="url(#glow)"/>`).join('')}
  ${GROUND(1580, '#07070b')}
  ${aura(f(eH[0]), f(eH[1]), ECHO, 3, 60, 22.9)}
  ${an('bob', 22.8, put(figure('echo', 'castUp', { anim: 'cast', glow: true, float: true }), 250, 1580, 0.72), null, ';animation-iteration-count:infinite')}
  ${particles(46, ECHO, [-100, 1180], [700, 1700], [0, -500], [3, 8], [1, 2])}
  ${vis(24.6, 26, streaks(20, ECHO, [300, 1400], -700, [3, 6], [0.15, 0.3], -20))}
`, [540, 1000]), 3) + `
  ${bubbleFor(7, 680, 960, ["Je l'ouvre…", 'maintenant !'], [-160, 110])}
  ${vis(24.6, 26, onom(620, 420, 'KRASH !!', 130, -6, ECHO, INK, 24.65))}
  ${flashAt(24.6)}
`);
sfx('tk', 22.9); sfx('rumble', 23.2); sfx('glass', 24.6); sfx('boom', 24.65);

// 8 · La foudre finale (26 – 30 s) : Volta se charge, éclair géant dans le noyau, OMEGA explose
scene(26, 30, `
  ${vis(26, 28, shakeAt(26.4, cam(26, 28, [[26, 0, 40, 0, 1.0], [28, 0, -20, 2, 1.18, 'ease-in']], `
    ${BG(INK)}
    ${radial(540, 1100, 180, '#4a3e08', [200, 420])}
    ${an('pulse', 26, `<circle cx="540" cy="1100" r="700" fill="url(#vglow)"/>`, [540, 1100], ';animation-iteration-count:infinite')}
    ${GROUND(1640, '#050508')}
    ${put(figure('volta', 'charge', { anim: 'charge', glow: true, shout: true }), 540, 1640, 0.88)}
    ${bolt(540, 940, 380, 520, VOLTA, 10, 7, 30, 26.2)}${bolt(540, 940, 720, 520, VOLTA, 10, 7, 30, 26.3)}
    ${bolt(380, 1100, 120, 760, VOLTA, 8, 6, 30, 26.6)}${bolt(700, 1100, 980, 760, VOLTA, 8, 6, 30, 26.7)}
    ${particles(60, VOLTA, [200, 880], [800, 1600], [0, -600], [3, 9], [0.4, 0.9])}
    ${streaks(16, VOLTA, [300, 1500], 0, [3, 6], [0.2, 0.35], 90)}`, [540, 1100]), 4, 'shakeS'))}
  ${vis(28, 30, shakeAt(28.3, cam(28, 30, [[28, 0, 0, 0, 1.25], [28.4, 0, 0, 0, 1.0, 'ease-out'], [30, 0, -40, -2, 1.1]], `
    ${BG('#1a0208')}
    ${vis(28, 28.3, core(540, 760, 150))}
    ${vis(28, 29.2, an('shakeS', 28.3, put(omegaEye(), 540, 760, 0.55), null, ';animation-iteration-count:5'))}
    ${bolt(-100, 1900, 540, 760, VOLTA, 34, 12, 70, 28)}${bolt(1180, 1900, 540, 760, VOLTA, 18, 10, 50, 28.05)}
    ${vis(28.3, 30, `${an('impact', 28.3, an('spinS', 28.3, burst(540, 760, 160, 640, 18, '#fff', VOLTA), [540, 760]), [540, 760])}
      ${an('impact', 28.45, burst(540, 760, 90, 360, 14, VOLTA, ORANGE), [540, 760])}
      ${shards(540, 760, 26, 28.3, RED, 1100)}
      ${an('drift', 28.6, smoke(540, 1100, 14, 700, '#5d5d68', 0.85))}
      ${particles(60, VOLTA, [100, 980], [400, 1300], [0, -800], [3, 9], [0.8, 1.6])}`)}
    ${radial(540, 760, 140, VOLTA, [500, 760])}`, [540, 760]), 4))}
  ${bubbleFor(8, 540, 520, ["C'est terminé,", 'OMEGA !'], [0, 110])}
  ${vis(28.3, 30, onom(540, 1380, 'KA-BOOOOM !!', 120, -5, VOLTA, INK, 28.35))}
  ${alertBar(28.5, 30, 'ERREUR · ERREUR · ERR…', 300)}
  ${flashAt(28.3)}
`);
sfx('charge', 26.0); sfx('electric', 26.4); sfx('thunder', 28.0); sfx('bigboom', 28.3); sfx('powerdown', 28.8); sfx('glitch', 28.6);

// 9 · L'aube (30 – 33,2 s) : le soleil se lève sur Néo-Lyre, la Tour fume, l'équipe sur le toit
scene(30, 33.2, cam(30, 33.2, [[30, 0, 60, 0, 1.18], [33.2, 0, 0, 0, 1.0]], `
  <defs><linearGradient id="dawn15" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2a5a"/><stop offset=".45" stop-color="#c8577a"/><stop offset=".7" stop-color="#ff8a4a"/><stop offset="1" stop-color="#ffd27a"/></linearGradient></defs>
  <rect x="-700" y="-1000" width="${W + 1400}" height="${H + 2000}" fill="url(#dawn15)"/>
  ${mv(30, 3.2, [0, 260], `<circle cx="300" cy="1180" r="220" fill="#ffe9a8"/><circle cx="300" cy="1180" r="320" fill="#fff3c4" opacity=".3"/>`, 'ease-out')}
  ${radial(300, 1180, 60, '#fff3c4', [340, 520])}
  ${an('parx', 30, city(1400, '#2a1a2e', '#ffd27a'))}
  ${tower(800, 1460, 0.5)}
  ${an('drift', 30, smoke(800, 520, 10, 260, '#4a3a4a', 0.8))}
  ${particles(30, '#fff3c4', [-200, 1200], [300, 1400], [-200, -100], [2, 4], [2, 4], 0.6)}
  ${GROUND(1560, '#140c18')}
  <path d="M-700 1560 L1780 1560" stroke="#ffd27a" stroke-width="5" opacity=".6"/>
  ${put(figure('givre', 'stand', { anim: 'idle' }), 200, 1560, 0.56)}
  ${put(figure('volta', 'hips', { anim: 'idle', shout: true }), 420, 1570, 0.6)}
  ${put(figure('echo', 'stand', { anim: 'idle', float: true }), 640, 1550, 0.58, -1)}
  ${put(figure('mirage', 'hips', { anim: 'idle' }), 860, 1560, 0.56, -1)}
`, [540, 1300]) + `
  ${bubbleFor(9, 620, 520, ["C'est fini,", 'on a gagné.'], [20, 110])}
  ${bubbleFor(10, 440, 560, ['Nous sommes', 'les Anomalies !'], [-20, 110])}
`);
sfx('wind', 30.0); sfx('crowd', 30.6); sfx('shimmer', 32.0);

// 10 · Épilogue (33,2 – 40 s) : Kessler s'enfuit dans une ruelle, un œil vert s'ouvre dans l'ombre → carton
const GREEN = '#39ff6a';
scene(33.2, 40, cam(33.2, 40, [[33.2, 0, 0, 0, 1.12], [35.3, 0, -30, 0, 1.0, 'ease-out'], [40, 0, -60, 0, 1.06]], `
  ${BG('#05050a')}
  ${[0, 1, 2, 3, 4].map((i) => `<rect x="${-200 + i * 300}" y="300" width="110" height="1300" fill="#101018"/>`).join('')}
  ${an('swayL', 33.2, `<polygon points="980,-100 1060,-100 300,1600 -100,1600" fill="${PAPER}" opacity=".06"/>`, [1020, -100], ';animation-iteration-count:infinite;animation-direction:alternate')}
  ${particles(26, '#6a6a78', [-200, 1280], [200, 1700], [80, 160], [2, 4], [2, 4], 0.4)}
  ${ROOF(1580, '#020204', '#3a3a48')}
  ${vis(33.2, 35.8, go(35.0, 0.7, [-1200, 0], mv(33.2, 0.8, [700, 0], put(figure('kessler', 'run', { anim: 'fight', glow: true }), 620, 1580, 0.78, -1)), 'cubic-bezier(.5,0,.9,.5)'))}
  ${vis(35.0, 35.8, streaks(14, '#3a3a48', [1100, 1500], 600, [3, 5], [0.2, 0.3]))}
  <defs><radialGradient id="g15"><stop offset="0" stop-color="${GREEN}" stop-opacity=".4"/><stop offset="1" stop-color="${GREEN}" stop-opacity="0"/></radialGradient></defs>
  ${vis(35.3, 40, `${an('pulse', 35.3, `<circle cx="540" cy="760" r="560" fill="url(#g15)"/>`, [540, 760], ';animation-iteration-count:infinite')}
    ${fadeIn(35.3, 0.8, put(`<path d="M-120 -540 L120 -540 L146 -410 L84 -330 L-84 -330 L-146 -410Z" fill="#050a06" stroke="${GREEN}" stroke-width="2" stroke-opacity=".5"/>
      <path d="M-150 -560 L-120 -640 L-100 -545 M150 -560 L120 -640 L100 -545" fill="#050a06" stroke="${GREEN}" stroke-width="2" stroke-opacity=".5"/>
      <path d="M-60 -370 L60 -370 M-50 -350 L50 -350" stroke="${GREEN}" stroke-width="2" opacity=".4"/>`, 540, 760 + 442 * 2.6, 2.6))}
    ${an('eyeOpen', 35.4, `<path d="M300 760 Q540 640 780 760 Q540 880 300 760Z" fill="#031a08" stroke="${GREEN}" stroke-width="8" filter="url(#glow)"/>
      <circle cx="540" cy="760" r="78" fill="${GREEN}" filter="url(#glow)"/><circle cx="540" cy="760" r="30" fill="#031a08"/><circle cx="516" cy="738" r="10" fill="#fff"/>`, [540, 760])}`)}
`, [540, 960]) + `
  ${bubbleFor(11, 520, 760, ["Ce n'est qu'un début…"], [60, 130])}
  ${vis(35.6, 36.9, caption('… SAISON 2', 35.6, 1130, 76, GREEN))}
  ${finalCard(36.9, 'FIN DE LA SAISON 1')}
`);
sfx('step', 33.3); sfx('step', 33.6); sfx('whoosh', 35.0); sfx('eye', 35.4); sfx('heart', 35.9); sfx('hit', 36.9);

L.build(import.meta.url, 'les-anomalies-ep15');
