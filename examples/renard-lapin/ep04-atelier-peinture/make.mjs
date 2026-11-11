// Roussin & Lino · Épisode 4 « L'atelier peinture » — 30 s, 1280x720. 10h20, la salle de classe (décor de l'épisode 2).
//
// Découpage :
//  0.0– 3.5  plan large      Mme Chouette : « Aujourd'hui : peinture ! » ; Roussin et Lino à leurs chevalets
//  3.5– 7.0  Lino           il peint soigneusement une horloge : « Une horloge ! »
//  7.0–10.5  Roussin          il peint à toute vitesse (FLIC FLAC) un croissant énorme : « Un croissant géant ! »
// 10.5–13.0  plan large      la maîtresse vient voir : « Très joli ! »
// 13.0–15.0  fenêtre         Rouge-Gorge se pose, voit le croissant peint (!) et entre par le battant ouvert
// 15.0–17.25 le tableau      il pique le croissant peint (TOC TOC), perplexe (?) ; Roussin rit : « Il est en peinture ! »
// 17.25–18.25 plan moyen     l'oiseau repart en rasant la table, heurte le pot bleu qui s'envole… « Attention ! »
// 18.25–21.0 la maîtresse    SPLASH : elle est toute bleue, le pot sur la tête ; silence
// 21.0–24.0  plan large      elle éclate de rire : « Ha ha ha ! » ; tout le monde rit
// 24.0–26.5  plan moyen      Lino : « Une chouette bleue ! » ; Roussin ajoute une chouette bleue à son tableau
// 26.5–30.0  plan large      coucou de la maîtresse bleue ; carton
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, ao, vis, sfx, fox, rabbit, owl, put, style, addKF, track, ss } from '../lib/kit.mjs';
import { makeCam, say, card, bird, croissant } from '../lib/props.mjs';
import { FLOOR, wall, banner, board, wallClock, windowEl, openSash, radiator, WIN } from '../lib/classroom.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.5, 640, 360, 1.0, 1.03],
  [3.5, 7.0, 940, 470, 1.75, 1.8],
  [7.0, 10.5, 330, 460, 1.75, 1.8],
  [10.5, 13.0, 640, 360, 1.0, 1.02],
  [13.0, 15.0, 780, 360, 1.33, 1.36],
  [15.0, 17.25, 430, 420, 1.9, 1.95],
  [17.25, 18.45, 880, 470, 1.6, 1.63],
  [18.45, 21.0, 650, 400, 2.4, 2.48],
  [21.0, 24.0, 640, 360, 1.0, 1.02],
  [24.0, 26.5, 600, 500, 1.15, 1.18],
  [26.5, 30, 640, 360, 1.0, 1.03],
];
const { scr: P, camStyle } = makeCam(SHOTS, DUR);
const lerp = (a, b, u) => a + (b - a) * u;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

addKF(`@keyframes draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes fadein{from{opacity:0}to{opacity:1}}
@keyframes paintk{0%{transform:rotate(var(--r))}8%,24%,40%,56%,72%,88%{transform:rotate(-138deg)}16%,32%,48%,64%,80%{transform:rotate(-112deg)}100%{transform:rotate(var(--r))}}
@keyframes popin{0%{opacity:0;transform:scale(.2)}60%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
@keyframes splat{0%{opacity:0;transform:scale(.2)}20%{opacity:1;transform:scale(1.2)}100%{opacity:1;transform:scale(1)}}`);
const drawOn = (d, t, dur, stroke, w = 6) => vis(t, 99, `<path d="${d}" pathLength="1" stroke="${stroke}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 1" stroke-dashoffset="1" style="${an({ n: 'draw', d: dur, t, f: 'forwards', e: 'ease-in-out' })}"/>`);
const fadeIn = (t, d, inner) => `<g style="opacity:0;${an({ n: 'fadein', d, t, f: 'forwards' })}">${inner}</g>`;
const popIn = (t, inner, ox = 0, oy = 0) => `<g style="opacity:0;transform-origin:${ox}px ${oy}px;${an({ n: 'popin', d: 0.25, t, f: 'forwards' })}">${inner}</g>`;

// ───────── chevalets et peintures ─────────
const E1 = [455, 410], E2 = [860, 410], CW = 200, CHH = 150;
const easel = ([x, y], painting) => `<g>
  <path d="M${x} ${y - 90} L${x} ${FLOOR + 90}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${x} ${y - 90} L${x} ${FLOOR + 90}" stroke="#a8743f" stroke-width="5" stroke-linecap="round"/>
  <path d="M${x - 20} ${y - 96} L${x - 80} ${FLOOR + 110} M${x + 20} ${y - 96} L${x + 80} ${FLOOR + 110}" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M${x - 20} ${y - 96} L${x - 80} ${FLOOR + 110} M${x + 20} ${y - 96} L${x + 80} ${FLOOR + 110}" stroke="#c98a4e" stroke-width="7" stroke-linecap="round"/>
  <rect x="${x - CW / 2}" y="${y - CHH / 2}" width="${CW}" height="${CHH}" rx="4" fill="#fffdf6" stroke="${INK}" stroke-width="5"/>
  <g>${painting}</g>
  <rect x="${x - CW / 2 - 14}" y="${y + CHH / 2}" width="${CW + 28}" height="14" rx="4" fill="#c98a4e" stroke="${INK}" stroke-width="4"/></g>`;
// horloge peinte par Lino (10h20)
const clockPaint = (() => {
  const [x, y] = E2;
  return drawOn(`M${x} ${y - 55} a55 55 0 1 1 -0.1 0`, 3.9, 0.7, '#3b82f6', 7) +
    Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; return popIn(4.6 + i * 0.03, `<circle cx="${x + Math.sin(a) * 44}" cy="${y - Math.cos(a) * 44}" r="${i % 3 ? 3 : 5}" fill="#e8434e"/>`, x + Math.sin(a) * 44, y - Math.cos(a) * 44); }).join('') +
    drawOn(`M${x} ${y} L${x + Math.sin((310 * Math.PI) / 180) * 26} ${y - Math.cos((310 * Math.PI) / 180) * 26}`, 5.0, 0.2, INK, 7) +
    drawOn(`M${x} ${y} L${x + Math.sin((120 * Math.PI) / 180) * 40} ${y - Math.cos((120 * Math.PI) / 180) * 40}`, 5.2, 0.2, INK, 5) +
    popIn(5.4, `<circle cx="${x}" cy="${y}" r="6" fill="#ffd23f" stroke="${INK}" stroke-width="2"/>`, x, y);
})();
// croissant géant peint par Roussin (+ la chouette bleue à la fin)
const croPaint = (() => {
  const [x, y] = E1;
  const big = croissant.replace(/stroke="#3a2418" stroke-width="4"/, 'stroke="#b45f12" stroke-width="3"');
  return drawOn(`M${x - 80} ${y + 40} Q${x - 50} ${y - 60} ${x} ${y - 55} Q${x + 60} ${y - 60} ${x + 85} ${y + 35}`, 7.25, 0.45, '#f28a1e', 12) +
    fadeIn(7.7, 0.5, `<g transform="translate(${x} ${y + 14}) scale(2.15)">${big}</g>`) +
    [[x - 76, y - 50, '#ffd23f'], [x + 70, y - 52, '#ff8fb1'], [x + 82, y + 50, '#7cc8ff'], [x - 84, y + 52, '#9be08a']].map(([px, py, c], i) => popIn(7.4 + i * 0.12, `<circle cx="${px}" cy="${py}" r="9" fill="${c}"/>`, px, py)).join('') +
    drawOn(`M${x} ${y + 18} a24 28 0 1 1 -0.1 0`, 25.0, 0.4, '#3b82f6', 6) + popIn(25.35, `<g transform="translate(${x} ${y + 46})"><path d="M-18 -18 L-12 -36 L-4 -22 M18 -18 L12 -36 L4 -22" fill="#3b82f6" stroke="${INK}" stroke-width="2.5"/><ellipse rx="24" ry="28" fill="#3b82f6" stroke="${INK}" stroke-width="2.5"/><path d="M-9 -38 L9 -38 L7 -28 L-7 -28Z" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="-7" cy="-6" r="6" fill="#fff"/><circle cx="7" cy="-6" r="6" fill="#fff"/><circle cx="-7" cy="-6" r="2.5" fill="${INK}"/><circle cx="7" cy="-6" r="2.5" fill="${INK}"/><path d="M-3 2 L3 2 L0 8Z" fill="#ffb300"/></g>`, x, y + 46);
})();

// table et pots
const TABLE = [470, 600];
const pot = (c, lab = '') => `<g><path d="M-17 -30 L17 -30 L14 0 L-14 0Z" fill="#f3f6fa" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><ellipse cy="-30" rx="17" ry="6" fill="${c}" stroke="${INK}" stroke-width="3"/><path d="M-12 -26 q-3 12 -1 20" stroke="${c}" stroke-width="5" stroke-linecap="round"/>${lab}</g>`;
const POT_B = [517, 594];
const table = `<g><rect x="${TABLE[0] - 82}" y="${TABLE[1]}" width="164" height="14" rx="4" fill="#eec08a" stroke="${INK}" stroke-width="4"/>
  <path d="M${TABLE[0] - 70} ${TABLE[1] + 14} V${TABLE[1] + 62} M${TABLE[0] + 70} ${TABLE[1] + 14} V${TABLE[1] + 62}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M${TABLE[0] - 70} ${TABLE[1] + 14} V${TABLE[1] + 62} M${TABLE[0] + 70} ${TABLE[1] + 14} V${TABLE[1] + 62}" stroke="#c98a4e" stroke-width="4" stroke-linecap="round"/>
  <g transform="translate(${TABLE[0] - 47} ${TABLE[1] - 4})">${pot('#e8434e')}</g><g transform="translate(${TABLE[0]} ${TABLE[1] - 4})">${pot('#ffd23f')}</g>
  ${vis(0, 17.55, `<g transform="translate(${POT_B[0]} ${POT_B[1]})">${pot('#3b82f6')}</g>`)}</g>`;

// ───────── Mme Chouette ─────────
const OWL1 = [650, 640], OWL2 = [650, 640], OS = 1.35;
const owlPos = (t) => { const u = clamp((t - 10.5) / 1.5, 0, 1); return { x: lerp(OWL1[0], OWL2[0], ss(u)), y: OWL1[1] - (u > 0 && u < 1 ? 8 * Math.abs(Math.sin(u * Math.PI * 6)) : 0), s: 1 }; };
const owlBrown = owl([[0.5, 2.3], [10.8, 12.3]], { happyAt: 99, watchAt: null, wave: [[0.4, 2.3]], look: [[10.8, 12.4, -9], [15.2, 17.2, -9], [17.3, 18.6, 9]] });
const recolor = (s) => s.replaceAll('#8d6a4a', '#3b82f6').replaceAll('#e9d5b5', '#9cc8ff').replaceAll('#7a4a22', '#1e4fa8');
const drips = `<g fill="#3b82f6" stroke="${INK}" stroke-width="3">${[[-64, -150, 30], [64, -140, 36], [-70, -100, 28], [68, -96, 32], [0, -188, 22]].map(([x, y, h]) => `<path d="M${x - 8} ${y} Q${x - 9} ${y + h} ${x} ${y + h} Q${x + 9} ${y + h} ${x + 8} ${y}Z"/>`).join('')}</g>`;
const potHat = `<g transform="translate(0 -224) scale(1.5) rotate(166)">${pot('#3b82f6')}</g>`;
const owlBlue = recolor(owl([[18.65, 19.1], [21.0, 22.4]], { happyAt: 21.0, watchAt: null, wave: [[26.6, 29.2]], look: [[19.2, 20.0, 9], [20.1, 20.9, -9]] })) + drips + potHat;
const owlEl = track(put(0, 0, OS, `<g style="animation:owlsway 1.8s ease-in-out infinite alternate">${vis(0, 18.6, owlBrown)}${vis(18.6, 99, `<g style="transform-origin:0 0;${an({ n: 'squash', d: 0.35, t: 18.6 })}"><g style="transform-origin:0 -100px;${an({ n: 'giggle', d: 0.16, t: 21.0, c: 9, dir: 'alternate' })}"><g style="transform-origin:0 -60px;${an({ n: 'lookaround', d: 1.8, t: 19.1 })}">${owlBlue}</g></g></g>`)}</g>`), 0, 30, (t) => owlPos(t), 20);
addKF('@keyframes lookaround{0%{transform:rotate(0)}20%,45%{transform:rotate(-12deg)}60%,85%{transform:rotate(12deg)}100%{transform:rotate(0)}}');
addKF('@keyframes giggle{from{transform:translateY(0)}to{transform:translateY(-6px)}}');

// ───────── Roussin et Lino ─────────
const brush = (c, k = 1.6, r = 212) => `<g transform="rotate(${r}) scale(${k})"><rect x="-4" y="-52" width="8" height="58" rx="3" fill="#c98a4e" stroke="${INK}" stroke-width="2.5"/><rect x="-5" y="-60" width="10" height="10" fill="#c7ced8" stroke="${INK}" stroke-width="2"/><path d="M-6 -60 Q0 -84 6 -60Z" fill="${c}" stroke="${INK}" stroke-width="2.5"/></g>`;
const FOX = [262, 665];
const holdBrush = (c, k, r, wins, rest = 30) => { let out = '', t = 0; for (const [a, b] of wins) { out += vis(t, a, brush(c, k * 0.75, rest)) + vis(a, b, brush(c, k, r)); t = b; } return out + vis(t, 99, brush(c, k * 0.75, rest)); };
const foxEl = put(FOX[0], FOX[1], 1.0, fox({
  item: holdBrush('#f28a1e', 1.6, 212, [[1.0, 2.6], [7.15, 8.7], [25.0, 26.4]], 125), talk: [[8.8, 10.0], [16.45, 17.2]],
  gest: [[1.0, 2.6, 'paintk'], [7.15, 8.7, 'paintk'], [25.0, 26.4, 'paintk']], jolt: [18.65, 21.0],
  eyes: [[8.7, 10.4, 'arc'], [12.0, 13.0, 'arc'], [16.2, 17.25, 'arc'], [17.3, 21.0, 'wide'], [21.0, 24.0, 'arc'], [24.0, 25.4, 'arc']],
  moods: [[7.1, 8.7, 'happy'], [8.7, 10.5, 'happy'], [12.0, 13.0, 'happy'], [16.2, 17.25, 'happy'], [17.3, 21.0, 'oh'], [21.0, 24.0, 'happy'], [24.0, 25.5, 'calm'], [25.5, 26.5, 'happy']],
  blush: [[12.0, 13.0]],
}));
const RAB = [1040, 705];
const rabEl = put(RAB[0], RAB[1], 0.95, rabbit({
  item: holdBrush('#3b82f6', 2.3, 190, [[3.85, 5.5]]), talk: [[5.8, 6.9], [17.3, 18.2], [24.2, 25.4]],
  gest: [[3.85, 5.5, 'paintk']], jolt: [18.65, 21.0],
  eyes: [[3.5, 3.85, 'up'], [5.7, 6.9, 'arc'], [17.3, 21.0, 'wide'], [21.0, 24.0, 'arc']],
  moods: [[5.6, 7.0, 'happy'], [17.3, 21.0, 'oh'], [21.0, 26.5, 'happy']],
}), true);

// ───────── Rouge-Gorge ─────────
const BS = 1.3;
const flyTo = (t0, t1, [x0, y0], [x1, y1], arc = -60, sc = BS) => vis(t0, t1 + 0.02, track(bird(true, false), t0, t1, (t, u) => { const k = ss(u); return { x: lerp(x0, x1, k), y: lerp(y0, y1, k) + arc * Math.sin(Math.PI * k), sx: x1 > x0 ? -sc : sc, sy: sc }; }));
const SILL = [1015, WIN.Y + WIN.H - 46];
const birdOutside = flyTo(12.9, 13.35, [1300, 160], SILL, -20, 1.7) + vis(13.35, 14.0, `<g transform="translate(${SILL[0]} ${SILL[1]}) scale(1.7)"><g style="transform-origin:0 0;${an({ n: 'jolt', d: 0.6, t: 13.6 })}">${bird(false, false)}</g></g>`);
const PERCH = [E1[0] + 40, E1[1] - 56];
const birdInside =
  flyTo(14.0, 14.35, SILL, [1046, 190], -20, 1.7) + flyTo(14.35, 14.75, [1040, 190], PERCH, -30, 1.7) +
  vis(14.75, 17.3, `<g transform="translate(${PERCH[0]} ${PERCH[1]}) scale(1.7)"><g style="${an({ n: 'hover', d: 0.3, t: 14.75, c: 9, dir: 'alternate', e: 'ease-in-out' })}"><g style="transform-origin:-10px 10px;${an({ n: 'peck', d: 0.25, t: 15.55, c: 3 })}">${bird(false, false)}</g></g></g>`) +
  vis(17.3, 18.4, track(bird(true, false), 17.3, 18.4, (t, u) => {
    const a = clamp(u / 0.23, 0, 1), b = clamp((u - 0.23) / 0.77, 0, 1);
    const x = u < 0.23 ? lerp(PERCH[0], POT_B[0] + 6, ss(a)) : lerp(POT_B[0] + 6, 1150, b);
    const y = u < 0.23 ? lerp(PERCH[1], POT_B[1] - 44, ss(a)) : b < 0.45 ? POT_B[1] - 78 : lerp(POT_B[1] - 78, 200, (b - 0.45) / 0.55);
    return { x, y, sx: -BS, sy: BS };
  }));
addKF('@keyframes hover{from{transform:translateY(-6px)}to{transform:translateY(6px)}}');
addKF('@keyframes peck{0%,100%{transform:rotate(0)}35%{transform:translateX(7px) rotate(12deg)}55%{transform:translateX(-6px) rotate(-22deg)}}');

// le pot bleu s'envole et coiffe la maîtresse
const HEAD = [OWL2[0], OWL2[1] - 224 * OS];
const potFly = vis(17.55, 18.62, track(pot('#3b82f6'), 17.55, 18.6, (t, u) => ({ x: lerp(POT_B[0], HEAD[0], u), y: lerp(POT_B[1], HEAD[1], u) - 260 * Math.sin(Math.PI * u), r: 180 * ss(u), s: lerp(1, OS * 1.5, u) }))) +
  [0, 1, 2, 3].map((i) => vis(17.6 + i * 0.1, 18.62, track(`<path d="M0 -8 Q7 4 0 8 Q-7 4 0 -8Z" fill="#3b82f6" stroke="${INK}" stroke-width="2"/>`, 17.6 + i * 0.1, 18.62, (t, u) => ({ x: lerp(POT_B[0], HEAD[0], u * 0.9) - 40 - 10 * i, y: lerp(POT_B[1], HEAD[1], u) - 120 * Math.sin(Math.PI * u) + 18 * i, s: 1.4 }))).replace('track', 'track')).join('');
addKF('@keyframes dropfall{0%{opacity:0;transform:translateY(0) scale(.3)}20%{opacity:1;transform:translateY(-20px) scale(1.2)}100%{opacity:0;transform:translateY(60px) scale(1)}}');
const splash = vis(18.6, 19.4, `<g transform="translate(${HEAD[0]} ${HEAD[1] + 40})">${[[-120, -40, -60], [120, -30, 60], [-90, 70, -120], [100, 80, 120], [0, -110, 0], [-60, -90, -30], [70, -100, 30]].map(([x, y, r], i) => `<g transform="translate(${x} ${y}) rotate(${r})"><g style="${an({ n: 'dropfall', d: 0.6, t: 18.6 + i * 0.03, f: 'both' })}"><path d="M0 -16 Q10 0 0 10 Q-10 0 0 -16Z" fill="#3b82f6" stroke="${INK}" stroke-width="3"/></g></g>`).join('')}</g>`);

// ───────── décor ─────────
const boardInner = `<text x="586" y="160" style="font-size:44px;fill:#f6f6ea">Atelier peinture</text>
  ${['#e8434e', '#ffd23f', '#7cc8ff', '#9be08a'].map((c, i) => `<path d="M440 ${310 - i * 0} A146 ${120 - i * 22} 0 0 1 732 310" transform="translate(${0} ${i * 0})" stroke="${c}" stroke-width="14" fill="none" opacity=".9" style="transform-origin:586px 310px;transform:scale(${1 - i * 0.16})"/>`).join('')}
  <g transform="translate(800 250)"><path d="M-40 10 Q-48 -34 -2 -40 Q44 -44 42 0 Q40 26 14 22 Q4 20 4 34 Q2 46 -18 40 Q-36 34 -40 10Z" fill="#e8c38c" stroke="#f6f6ea" stroke-width="3"/><circle cx="-20" cy="-16" r="7" fill="#e8434e"/><circle cx="6" cy="-24" r="7" fill="#3b82f6"/><circle cx="26" cy="-8" r="7" fill="#ffd23f"/></g>`;
const world = `${wall}${banner}${board(boardInner)}${wallClock(10, 20)}
  ${windowEl(birdOutside, { open: true })}${openSash()}${radiator(false)}
  ${owlEl}
  ${easel(E1, croPaint)}${easel(E2, clockPaint)}
  ${table}
  ${foxEl}${rabEl}
  ${potFly}${splash}
  ${birdInside}`;

// ───────── espace écran ─────────
const fx =
  say('owl', "Aujourd'hui : peinture !", 0.5, 1.8, { bx: 690, by: 240, tips: [[690, 440]] }) +
  say('rab', 'Une horloge !', 5.8, 1.1, { bx: 1080, by: 300, tips: [[880, 560]] }) +
  sfx('FLIC FLAC FLOC !', 340, 250, 7.2, 1.4, -8, '#ffd23f', 58) +
  say('fox', 'Un croissant géant !', 8.8, 1.2, { bx: 330, by: 90, tips: [[470, 290]] }) +
  say('owl', 'Très joli !', 10.8, 1.5, { bx: 690, by: 240, tips: [[690, 440]] }) +
  sfx('!', 1150, 270, 13.55, 0.7, 0, '#ffd23f', 120, 'chirp') +
  sfx('TOC TOC !', 420, 140, 15.55, 0.9, 8, '#ffd23f', 66, 'knock') +
  sfx('?', 780, 170, 15.95, 0.8, 0, '#ffd23f', 130) +
  say('fox', 'Il est en peinture !', 16.45, 0.8, { bx: 250, by: 250, tips: [[420, 360]] }) +
  sfx('TING !', 170, 320, 17.6, 0.6, -10, '#ffd23f', 84, 'clink') +
  say('rab', 'Attention !', 17.3, 1.0, { bx: 760, by: 120, tips: [[780, 260]], shout: true }) +
  sfx('SPLASH !', 1010, 160, 18.55, 1.2, -8, '#ffd23f', 92, 'splash') +
  say('owl', 'Ha ha ha !', 21.0, 1.4, { bx: 690, by: 210, tips: [[690, 400]] }) +
  say('rab', 'Une chouette bleue !', 24.2, 1.2, { bx: 880, by: 260, tips: [[1110, 430]] }) +
  card(27.3, "L'atelier peinture !", 'en route pour la cantine', 640, 160);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#ffe9bd"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'wave', t: 0.3 }, { name: 'brush', t: 1.0 }, { name: 'brush', t: 3.9 }, { name: 'brush', t: 7.2 }, { name: 'brush', t: 25.5 }, { name: 'chirp', t: 12.95 },
  { name: 'whoosh', t: 14.45 }, { name: 'whoosh', t: 17.3 }, { name: 'whoosh', t: 17.6 }, { name: 'laugh', t: 21.0 }, { name: 'chime', t: 25.7 });
writeFileSync(new URL('./atelier-peinture.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 124, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
