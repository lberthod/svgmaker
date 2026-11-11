// Roussin & Lino · Épisode 3 « La récré » — 30 s, 1280x720. 10h00, la cour.
// Un seul décor (cour : façade et cloche, toboggan, bac à sable, grand arbre), caméra à plans coupés.
//
// Découpage :
//  0.0– 3.6  plan large      Rouge-Gorge se pose sur la branche avec le croissant ; Roussin déboule : « Rends-moi mon croissant ! »
//  3.6– 5.7  la branche      l'oiseau nargue (CUI CUI), Roussin saute… raté de peu
//  5.7–11.2  l'arbre         Lino : « Top chrono ! » — poursuite : deux tours d'arbre (ZOUM)
// 11.2–12.8  Lino           « Deux tours ! Record ! »
// 12.8–15.0  Roussin          étourdi (étoiles), l'oiseau file vers le toboggan : « Je t'aurai ! »
// 15.0–18.4  le toboggan     Roussin grimpe, plonge… l'oiseau s'envole, Roussin reste suspendu en l'air, puis WHIIIZ
// 18.4–21.6  bac à sable     POUF ! le château de Coin est écrasé, Roussin a le seau sur la tête ; « Mon château ! » « Pardon... »
// 21.6–24.8  plan large      Lino accourt : « Ça va, Roussin ? » — « Il est là-haut ! »
// 24.8–26.6  la cime         l'oiseau, tout en haut, avec le croissant : trop haut
// 26.6–30.0  plan large      DRING la cloche : « La cloche ! On rentre ! » ; ils filent ; carton
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, ao, vis, tf, sfx, fox, rabbit, put, cloud, style, addKF, track, trackKF, ss } from '../lib/kit.mjs';
import { makeCam, say, card, bird, pal, stars, puff } from '../lib/props.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.6, 640, 360, 1.0, 1.03],
  [3.6, 5.7, 720, 420, 1.8, 1.86],
  [5.7, 11.2, 930, 420, 1.25, 1.29],
  [11.2, 12.8, 1150, 520, 2.2, 2.25],
  [12.8, 15.0, 930, 480, 1.5, 1.55],
  [15.0, 18.4, 420, 400, 1.25, 1.3],
  [18.4, 22.0, 600, 540, 1.55, 1.62],
  [22.0, 23.5, 640, 360, 1.0, 1.02],
  [23.5, 24.8, 520, 520, 1.8, 1.85],
  [24.8, 25.8, 965, 170, 2.0, 2.06],
  [25.8, 30, 640, 360, 1.0, 1.03],
];
const { scr: P, camStyle } = makeCam(SHOTS, DUR);
const lerp = (a, b, u) => a + (b - a) * u;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
// intervalles de temps où pred(t) est vrai
const windows = (t0, t1, pred, dt = 1 / 60) => {
  const out = []; let start = null;
  for (let t = t0; t <= t1 + 1e-9; t += dt) { const v = pred(t); if (v && start === null) start = t; if (!v && start !== null) { out.push([start, t]); start = null; } }
  if (start !== null) out.push([start, t1]);
  return out;
};

// ───────── géométrie du monde ─────────
const GROUND = 520;
const TREE_X = 900;
const BRANCH = [742, 334];      // oiseau perché (centre du corps) sur la branche basse
const TOP = [905, 52];          // oiseau perché tout en haut
// toboggan : plateforme y 410 (x 210–320), toboggan = Bézier cubique
const CH = [[320, 410], [395, 410], [430, 602], [520, 606]];
const bez = (v) => { const m = 1 - v; const k = [m * m * m, 3 * m * m * v, 3 * m * v * v, v * v * v]; return [0, 1].map((i) => k.reduce((s, c, j) => s + c * CH[j][i], 0)); };
const bezAng = (v) => { const [a, b] = bez(Math.max(0, v - 0.01)), [c, d] = bez(Math.min(1, v + 0.01)); return (Math.atan2(d - b, c - a) * 180) / Math.PI; };
const BIRD_CHUTE = (() => { const [x, y] = bez(0.5); return [x + 4, y - 28]; })();
const LAND = [545, 704];        // Roussin dans le bac à sable
const RAB_X = 1245, RAB_Y = 705, RAB_X2 = 990;

// ───────── décor ─────────
const clockEl = `<g transform="translate(85 300)"><circle r="40" fill="#fff" stroke="${INK}" stroke-width="6"/>
  ${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-30" x2="0" y2="${i % 3 ? -26 : -22}" stroke="${INK}" stroke-width="${i % 3 ? 2 : 3.5}" transform="rotate(${i * 30})"/>`).join('')}
  <line x1="0" y1="0" x2="0" y2="-28" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/><line x1="0" y1="0" x2="0" y2="-18" stroke="${INK}" stroke-width="5" stroke-linecap="round" transform="rotate(300)"/><circle r="4" fill="#e8434e"/></g>`;
const bellEl = `<g transform="translate(85 92)"><rect x="-34" y="-34" width="68" height="64" fill="#e8b27a" stroke="${INK}" stroke-width="4"/><path d="M-44 -34 L0 -70 L44 -34Z" fill="#c4545c" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <rect x="-24" y="-24" width="48" height="48" rx="6" fill="#6b4a2e"/>
  <g style="transform-origin:0px -22px;${an({ n: 'bellrock', d: 0.18, t: 27.0, c: 8, dir: 'alternate', e: 'ease-in-out' })}"><path d="M-17 14 Q-17 -20 0 -20 Q17 -20 17 14Z" fill="#ffd23f" stroke="${INK}" stroke-width="3.5"/><circle cy="18" r="5" fill="#b97520" stroke="${INK}" stroke-width="2.5"/></g>
  ${vis(27.0, 28.4, `<path d="M-52 -14 q-12 16 0 32 M52 -14 q12 16 0 32 M-66 -22 q-18 26 0 48 M66 -22 q18 26 0 48" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`)}</g>`;
const facade = `<g><rect x="-10" y="150" width="180" height="${GROUND + 150 - 150}" fill="#f6cf8f" stroke="${INK}" stroke-width="5"/>
  <path d="M-20 160 L80 50 L182 160Z" fill="#e8434e" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  ${bellEl}
  <rect x="20" y="370" width="50" height="44" rx="5" fill="#bfe6ff" stroke="${INK}" stroke-width="4"/><rect x="100" y="370" width="50" height="44" rx="5" fill="#bfe6ff" stroke="${INK}" stroke-width="4"/>
  ${clockEl}
  <rect x="40" y="460" width="90" height="${GROUND + 150 - 460}" fill="#3a2418"/><g style="transform-origin:40px 0;${an({ n: 'dooropen', d: 0.25, t: 28.25, f: 'forwards' })},${ao({ n: 'doorclose', d: 0.2, t: 29.45, f: 'forwards' })}"><rect x="40" y="460" width="90" height="${GROUND + 150 - 460}" rx="8" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><circle cx="116" cy="560" r="6" fill="#ffd23f" stroke="${INK}" stroke-width="2.5"/></g>
  <rect x="30" y="440" width="110" height="22" rx="4" fill="#fff" stroke="${INK}" stroke-width="3.5"/><text x="85" y="457" style="font-size:16px;fill:${INK}">ÉCOLE</text></g>`;
const fence = `<g>${Array.from({ length: 22 }, (_, i) => { const x = 180 + i * 52; return `<path d="M${x} ${GROUND + 6} V${GROUND - 70} l12 -14 l12 14 V${GROUND + 6}Z" fill="#fff4dc" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`; }).join('')}
  <rect x="170" y="${GROUND - 54}" width="1120" height="12" fill="#fff4dc" stroke="${INK}" stroke-width="3.5"/><rect x="170" y="${GROUND - 20}" width="1120" height="12" fill="#fff4dc" stroke="${INK}" stroke-width="3.5"/></g>`;
const hop = `<g transform="translate(1035 700)" opacity=".85">${[[0, 0], [70, 0], [140, -14], [140, 14]].map(([x, y], i) => `<rect x="${x - 30}" y="${y - 12}" width="60" height="26" fill="none" stroke="#fff" stroke-width="5" transform="skewX(-30)"/><text x="${x - 6}" y="${y + 8}" style="font-size:20px;fill:#fff">${i + 1}</text>`).join('')}</g>`;
const bg = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc8ff"/><stop offset="1" stop-color="#d9f2ff"/></linearGradient></defs>
  <clipPath id="doorclip"><rect x="120" y="-400" width="2400" height="1600"/></clipPath><clipPath id="sandclip"><rect x="-400" y="-400" width="2400" height="1052"/></clipPath>
  <rect width="${W}" height="${GROUND}" fill="url(#sky)"/>
  <g transform="translate(330 80)"><g style="animation:spin 24s linear infinite">${Array.from({ length: 10 }, (_, i) => `<path d="M0 -62 L8 -46 L-8 -46Z" fill="#ffd23f" transform="rotate(${i * 36})"/>`).join('')}</g><circle r="38" fill="#ffd23f" stroke="${INK}" stroke-width="4"/><path d="M-12 6 q12 12 24 0" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="-12" cy="-6" r="3.5" fill="${INK}"/><circle cx="12" cy="-6" r="3.5" fill="${INK}"/></g>
  <g style="animation:cdrift 14s ease-in-out infinite alternate">${cloud(520, 130, 0.8)}${cloud(1180, 90, 0.6)}${cloud(760, 60, 0.45, 0.9)}</g>
  <path d="M170 ${GROUND - 40} Q420 ${GROUND - 140} 700 ${GROUND - 60} Q960 ${GROUND - 150} 1290 ${GROUND - 70} V${GROUND} H170Z" fill="#9fdc7c"/>
  ${fence}
  <rect y="${GROUND}" width="${W}" height="${H - GROUND}" fill="#e9d3a8"/>
  <rect y="${GROUND}" width="${W}" height="16" fill="#8fd16e"/>
  ${Array.from({ length: 9 }, (_, i) => `<ellipse cx="${200 + i * 130}" cy="${GROUND + 60 + (i % 3) * 40}" rx="10" ry="4" fill="#d9bf8f"/>`).join('')}
  ${hop}
  ${facade}`;

const tree = `<g>
  <path d="M${TREE_X - 42} 632 Q${TREE_X - 30} 470 ${TREE_X - 24} 300 L${TREE_X + 24} 300 Q${TREE_X + 30} 470 ${TREE_X + 42} 632Z" fill="#9b6a3c" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M${TREE_X - 8} 600 q6 -60 -2 -120 M${TREE_X + 14} 560 q-4 -40 4 -80" stroke="#7d5229" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M${TREE_X - 22} 410 Q880 392 ${BRANCH[0] - 22} ${BRANCH[1] + 26}" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M${TREE_X - 22} 410 Q880 392 ${BRANCH[0] - 22} ${BRANCH[1] + 26}" stroke="#9b6a3c" stroke-width="13" fill="none" stroke-linecap="round"/>
  <g transform="translate(${BRANCH[0] - 30} ${BRANCH[1] + 20})"><ellipse rx="22" ry="12" fill="#52c468" stroke="${INK}" stroke-width="3.5" transform="rotate(-20)"/></g>
  <g style="transform-origin:${TREE_X}px 300px;animation:sway 3s ease-in-out infinite alternate">
  ${[[TREE_X, 200, 125, '#3fae55'], [TREE_X - 112, 232, 82, '#3fae55'], [TREE_X + 118, 240, 86, '#3fae55'], [TREE_X + 10, 290, 88, '#3fae55']].map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${INK}" stroke-width="5"/>`).join('')}
  ${[[TREE_X, 200, 117], [TREE_X - 112, 232, 74], [TREE_X + 118, 240, 78], [TREE_X + 10, 290, 80]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#3fae55"/>`).join('')}
  ${[[TREE_X - 40, 160, 40], [TREE_X + 70, 210, 34], [TREE_X - 120, 220, 28], [TREE_X + 30, 290, 30]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#52c468"/>`).join('')}
  ${[[TREE_X - 60, 250], [TREE_X + 90, 170], [TREE_X - 10, 130], [TREE_X + 120, 280]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#ff6b6b" stroke="${INK}" stroke-width="2.5"/>`).join('')}</g></g>`;
const bush = (x, y, r) => `<g><circle cx="${x - r * 0.6}" cy="${y}" r="${r * 0.75}" fill="#3fae55" stroke="${INK}" stroke-width="4"/><circle cx="${x + r * 0.6}" cy="${y}" r="${r * 0.75}" fill="#3fae55" stroke="${INK}" stroke-width="4"/><circle cx="${x}" cy="${y - r * 0.35}" r="${r}" fill="#3fae55" stroke="${INK}" stroke-width="4"/><ellipse cx="${x}" cy="${y + 4}" rx="${r * 1.2}" ry="${r * 0.5}" fill="#3fae55"/></g>`;
const bushes = bush(TREE_X - 135, 622, 44) + bush(TREE_X + 135, 624, 46);

const slide = (() => {
  const d = `M${CH[0][0]} ${CH[0][1]} C${CH[1][0]} ${CH[1][1]} ${CH[2][0]} ${CH[2][1]} ${CH[3][0]} ${CH[3][1]}`;
  return `<g>
  <path d="M215 410 V668 M318 410 V668 M440 560 V668" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M215 410 V668 M318 410 V668 M440 560 V668" stroke="#3b82f6" stroke-width="6" stroke-linecap="round"/>
  <path d="M208 400 V668 M250 400 V668" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M208 400 V668 M250 400 V668" stroke="#e8434e" stroke-width="5" stroke-linecap="round"/>
  ${Array.from({ length: 6 }, (_, i) => `<path d="M208 ${450 + i * 40} H250" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M208 ${450 + i * 40} H250" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`).join('')}
  <rect x="204" y="402" width="124" height="16" rx="5" fill="#ffd23f" stroke="${INK}" stroke-width="4"/>
  <path d="M320 410 V350 M210 404 V350 M210 352 H320" stroke="${INK}" stroke-width="11" stroke-linecap="round" fill="none"/><path d="M320 410 V350 M210 404 V350 M210 352 H320" stroke="#e8434e" stroke-width="4" stroke-linecap="round" fill="none"/>
  <path d="${d}" stroke="${INK}" stroke-width="38" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#ffd23f" stroke-width="28" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#fff3a6" stroke-width="7" fill="none" stroke-linecap="round" transform="translate(0 -7)"/></g>`;
})();

// bac à sable et château de Coin
const sandBack = `<g><path d="M470 600 L760 600 L770 640 L460 640Z" fill="#b97a44" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M482 608 L748 608 L758 650 L472 650Z" fill="#f3d58c"/>
  <circle cx="500" cy="630" r="6" fill="#e6c272"/><circle cx="720" cy="624" r="5" fill="#e6c272"/></g>`;
const sandFront = `<g><rect x="452" y="650" width="326" height="26" rx="6" fill="#c98a4e" stroke="${INK}" stroke-width="5"/><path d="M470 662 h40 M560 664 h50 M680 662 h40" stroke="#a46a34" stroke-width="3" stroke-linecap="round"/></g>`;
const castle = vis(0, 18.5, `<g transform="translate(${LAND[0]} 642)"><g style="transform-origin:0 0;${an({ n: 'crush', d: 0.08, t: 18.42, f: 'forwards' })}"><path d="M-46 0 V-40 h12 v-10 h10 v10 h10 v-10 h10 v10 h10 v-10 h10 v10 h12 V0Z" fill="#f0c66c" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M-16 -40 V-74 h8 v-8 h8 v8 h8 v-8 h8 v8 h0 V-40" fill="#f0c66c" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M0 -82 V-104 l18 6 l-18 6" fill="#e8434e" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><rect x="-8" y="-22" width="16" height="22" rx="8" fill="#c9a050"/></g></g>`);
addKF('@keyframes doorclose{from{transform:scaleX(.15)}to{transform:scaleX(1)}}');
addKF('@keyframes dooropen{from{transform:scaleX(1)}to{transform:scaleX(.15)}}');
addKF('@keyframes crush{from{transform:scale(1,1)}to{transform:scale(1.4,.2)}}');
const bucketHat = `<g><path d="M6 -150 L134 -150 L120 -242 L20 -242Z" fill="#e8434e" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><rect x="0" y="-162" width="140" height="16" rx="5" fill="#ff6f7c" stroke="${INK}" stroke-width="4"/>
  <path d="M30 -230 L40 -170 M70 -236 V-170" stroke="#ff9aa5" stroke-width="5" stroke-linecap="round"/><path d="M8 -150 Q70 -96 132 -150" stroke="#9aa3ad" stroke-width="4" fill="none"/>
  ${[[20, -144], [50, -140], [100, -142], [126, -146]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#f0c66c" stroke="${INK}" stroke-width="2"/>`).join('')}</g>`;
// le seau, debout dans le bac (fond en haut) ; à l'impact il saute et coiffe Roussin
const BUCKET0 = [LAND[0] - 102, 566];
const bucketUpright = `<g transform="scale(1 -1) translate(-70 150)">${bucketHat}</g>`;
const bucketProp = vis(0, 18.62, `<g transform="translate(${BUCKET0[0]} ${BUCKET0[1]}) scale(.72)">${bucketUpright}</g>`);
const bucketJump = vis(18.62, 18.87, track(`<g transform="scale(.95) translate(-70 196)">${bucketHat}</g>`, 18.62, 18.87, (t, u) => ({ x: lerp(BUCKET0[0], LAND[0] + 45, u), y: lerp(BUCKET0[1] - 40, LAND[1] - 196, u) - 90 * Math.sin(Math.PI * u), r: lerp(180, 360, u), s: 0.85 })));
const bucketHatNH = bucketHat.replace(/<path d="M8 -150 Q70 -96 132 -150"[^>]*\/>/, '');
const sandHat = `<g>${[[56, -140], [90, -168], [48, -170], [112, -150]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#e3b85a"/>`).join('')}</g>`;

// chronomètre (tenu dans la patte)
const stopwatch = `<g transform="translate(-2 6)"><rect x="-4" y="-24" width="8" height="8" rx="2" fill="#9aa3ad" stroke="${INK}" stroke-width="2.5"/><circle r="17" fill="#c7ced8" stroke="${INK}" stroke-width="3.5"/><circle r="12" fill="#fff"/>
  <g style="animation:spin 1s linear infinite"><line x1="0" y1="0" x2="0" y2="-10" stroke="#e8434e" stroke-width="3" stroke-linecap="round"/></g><circle r="2.5" fill="${INK}"/></g>`;

// ───────── Rouge-Gorge ─────────
const BS = 1.3;
const perched = (t0, t1, [x, y], o = {}) => vis(t0, t1, `<g transform="translate(${x} ${y}) scale(${o.flip ? -BS : BS} ${BS})"><g style="transform-origin:-10px 10px;${o.peck ? an({ n: 'peck', d: 0.25, t: o.peck, c: o.pc || 3 }) : ''}">${bird(false, true)}</g></g>`);
const flyTo = (t0, t1, [x0, y0], [x1, y1], arc = -60, e = ss) => vis(t0, t1 + 0.02, track(bird(true, true), t0, t1, (t, u) => {
  const k = e(u); return { x: lerp(x0, x1, k), y: lerp(y0, y1, k) + arc * Math.sin(Math.PI * k), sx: x1 > x0 ? -BS : BS, sy: BS };
}));
// tour de l'arbre (l'oiseau devance Roussin)
const LAP = 2.3, L0 = 5.8;
const thFox = (t) => (t <= L0 ? 0 : t <= L0 + 2 * LAP ? (2 * Math.PI * (t - L0)) / LAP : 4 * Math.PI + (Math.PI / 2) * (1 - (1 - clamp((t - L0 - 2 * LAP) / 0.6, 0, 1)) ** 2));
const thBird = (t) => thFox(t) + 1.15;
const birdLapPos = (t) => { const th = thBird(t); return { x: TREE_X - 110 * Math.cos(th), y: 332 + 25 * Math.sin(th), s: 1.1 + 0.15 * Math.sin(th), face: Math.sin(th) }; };
const BL0 = 5.6, BL1 = 10.5;
const birdLapFn = (t, u) => {
  const p = birdLapPos(clamp(t, L0, 99));
  let { x, y } = p; const s = p.s;
  if (t < L0 + 0.35) { const k = ss(clamp((t - BL0) / (L0 + 0.35 - BL0), 0, 1)); x = lerp(BRANCH[0], x, k); y = lerp(BRANCH[1], y, k); }
  return { x, y, sx: (p.face > 0 ? -1 : 1) * s, sy: s };
};
const birdLapKF = trackKF(BL0, BL1, birdLapFn);
const birdFrontW = windows(BL0, BL1, (t) => Math.sin(thBird(t)) >= 0 || t < L0 + 0.2);
const birdBackW = windows(BL0, BL1, (t) => !(Math.sin(thBird(t)) >= 0 || t < L0 + 0.2));
const birdLap = (W_) => W_.map(([a, b]) => vis(a, b, `<g style="${birdLapKF}">${bird(true, true)}</g>`)).join('');
const lapEnd = birdLapFn(BL1);

const birdsBack = birdLap(birdBackW);
const birdsFront =
  flyTo(0.2, 1.25, [-120, 160], BRANCH, -40) +
  perched(1.25, 4.5, BRANCH, { peck: 3.75 }) +
  vis(4.5, 5.1, track(bird(true, true), 4.5, 5.1, (t, u) => ({ x: BRANCH[0] + 6 * Math.sin(u * 6), y: BRANCH[1] - 55 * Math.sin(Math.PI * u), s: BS }))) +
  perched(5.1, BL0, BRANCH) +
  birdLap(birdFrontW) +
  flyTo(BL1, 11.05, [lapEnd.x, lapEnd.y], BRANCH, -30) +
  perched(11.05, 13.4, BRANCH, { peck: 12.95, pc: 2 }) +
  flyTo(13.4, 14.25, BRANCH, BIRD_CHUTE, -90) +
  perched(14.25, 15.15, BIRD_CHUTE) +
  vis(15.15, 15.6, track(bird(true, true), 15.15, 15.6, (t, u) => ({ x: BIRD_CHUTE[0] + 10 * Math.sin(u * 6), y: BIRD_CHUTE[1] - 80 * Math.sin(Math.PI * u), s: BS }))) +
  perched(15.6, 16.86, BIRD_CHUTE, { peck: 15.9, pc: 2 }) +
  flyTo(16.86, 17.85, BIRD_CHUTE, TOP, -170, (u) => 1 - (1 - u) ** 2) +
  perched(17.95, 99, TOP, { peck: 25.0, pc: 3 });

// ───────── Roussin ─────────
const FS = 0.95;
// F1 : arrive en courant, saute sous la branche
const f1 = vis(0, 5.8, track(`<g style="transform-origin:0 0;${an({ n: 'antic', d: 0.12, t: 4.28, c: 2, dir: 'alternate', e: 'ease-out' })}">${put(0, 0, FS, fox({
  run: [0.6, 2.2], skid: 2.15, jumps: [[4.4, 5.0, 95]], talk: [[1.6, 3.1]], gest: [[1.6, 3.1]],
  eyes: [[2.4, 4.3, 'up'], [4.3, 5.0, 'wide'], [5.0, 5.8, 'up']], moods: [[0, 3.3, 'panic'], [3.3, 4.3, 'sad'], [4.3, 5.0, 'oh'], [5.0, 5.8, 'sad']],
}))}</g>`, 0.6, 5.8, (t, u) => ({ x: lerp(-200, TREE_X - 110, 1 - (1 - clamp((t - 0.6) / 1.6, 0, 1)) ** 2), y: 665, sx: t > 2.45 && t < 5.75 ? -1 : 1, sy: 1 })));
// F2 : deux tours d'arbre (copies devant/derrière le tronc)
const foxLapFn = (t) => { const th = thFox(t); const s = FS + 0.12 * Math.sin(th); const face = clamp(Math.sin(th) * 4 + (t < L0 + 0.05 ? 1 : 0), -1, 1); return { x: TREE_X - 110 * Math.cos(th), y: 665 + 25 * Math.sin(th), sx: s * (Math.abs(face) < 0.12 ? 0.12 * Math.sign(face || 1) : face), sy: s }; };
const foxLapKF = trackKF(L0, 11.0, foxLapFn);
const foxLapBody = fox({ run: [L0, 10.85], moods: [[0, 99, 'panic']], eyes: [[0, 99, 'wide']], upright: -24 });
const foxFrontW = windows(L0, 11.0, (t) => Math.sin(thFox(t)) >= -0.02 || t < L0 + 0.05);
const foxBackW = windows(L0, 11.0, (t) => !(Math.sin(thFox(t)) >= -0.02 || t < L0 + 0.05));
const foxLap = (W_) => W_.map(([a, b]) => vis(a, b, `<g style="${foxLapKF}">${foxLapBody}</g>`)).join('');
// F3 : étourdi, puis repart
const DZ = [TREE_X - 40, 690], DS = FS + 0.12;
const f3 = vis(11.0, 14.7, put(DZ[0], DZ[1], DS, `<g style="transform-origin:0 0;${an({ n: 'flipx', d: 0.08, t: 13.88, f: 'forwards' })}"><g style="transform-origin:0 0;${an({ n: 'dizzy', d: 0.4, t: 11.0, c: 6, dir: 'alternate', e: 'ease-in-out' })}"><g style="transform-origin:60px -150px;${an({ n: 'hshake', d: 0.075, t: 13.4, c: 6, dir: 'alternate' })}">${fox({
  talk: [[14.0, 14.85]], gest: [], raise: [[14.0, 14.9]], jolt: 13.9,
  eyes: [[11.0, 13.4, 'spiral'], [13.4, 13.85, 'shut'], [13.85, 14.9, 'wide']], moods: [[11.0, 13.4, 'oh'], [13.4, 13.85, 'panic'], [13.85, 14.9, 'panic']], upright: -10,
})}</g>${vis(11.0, 13.4, `<g transform="translate(60 -262)">${stars(70)}</g>`)}${vis(13.4, 13.9, `<path d="M-60 -200 q-20 30 0 60 M180 -200 q20 30 0 60 M-80 -230 q-26 40 0 80 M200 -230 q26 40 0 80" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`)}</g></g>`));
addKF('@keyframes flipx{from{transform:scaleX(1)}to{transform:scaleX(-1)}}');
addKF('@keyframes hshake{from{transform:rotate(-12deg)}to{transform:rotate(12deg)}}');
// F4 : file vers l'échelle (de dos à droite → regarde à gauche)
const LAD = [238, 665];
const f4 = vis(14.7, 15.62, track(fox({ run: [14.7, 15.6], moods: [[0, 99, 'panic']], eyes: [[0, 99, 'wide']], upright: -26 }), 14.7, 15.6, (t, u) => ({ x: lerp(DZ[0], LAD[0] + 20, u), y: lerp(DZ[1], LAD[1], u), sx: -lerp(DS, FS, u), sy: lerp(DS, FS, u) })));
// F5 : grimpe, plonge, reste suspendu, glisse, s'envole vers le bac à sable
const T = { climb: [15.62, 16.4], antic: 16.6, dive: [16.85, 17.12], hold: [17.12, 17.68], drop: [17.68, 17.86], slide: [17.86, 18.36], fly: [18.36, 18.5] };
const DIVE = [BIRD_CHUTE[0] - 40, 405];
const vStart = 0.3, [cx0, cy0] = bez(vStart);
const f5fn = (t) => {
  if (t < T.climb[1]) { const u = (t - T.climb[0]) / (T.climb[1] - T.climb[0]); return { x: LAD[0], y: lerp(LAD[1], 412, ss(u)) + 6 * Math.sin(u * Math.PI * 8), s: FS }; }
  if (t < T.dive[0]) return { x: LAD[0] + 14, y: 412, s: FS };
  if (t < T.dive[1]) { const u = (t - T.dive[0]) / (T.dive[1] - T.dive[0]); return { x: lerp(LAD[0] + 14, DIVE[0], u), y: lerp(412, DIVE[1], u) - 30 * Math.sin(Math.PI * u), r: 40 * u, s: FS }; }
  if (t < T.hold[1]) { const u = (t - T.hold[0]) / (T.hold[1] - T.hold[0]); return { x: DIVE[0], y: DIVE[1] - 4 * Math.sin(Math.PI * u), r: 40, s: FS }; }
  if (t < T.drop[1]) { const u = (t - T.drop[0]) / (T.drop[1] - T.drop[0]); return { x: lerp(DIVE[0], cx0, u), y: lerp(DIVE[1], cy0 - 8, u * u), r: lerp(40, bezAng(vStart) * 0.4, u), s: FS }; }
  if (t < T.slide[1]) { const u = (t - T.slide[0]) / (T.slide[1] - T.slide[0]); const v = lerp(vStart, 1, u * u * (1.6 - 0.6 * u)); const [x, y] = bez(v); return { x, y: y - 8, r: bezAng(v) * 0.4, s: FS }; }
  const u = clamp((t - T.fly[0]) / (T.fly[1] - T.fly[0]), 0, 1); const [x1, y1] = bez(1);
  return { x: lerp(x1, LAND[0], u), y: lerp(y1 - 8, LAND[1], u) - 50 * Math.sin(Math.PI * u), r: lerp(bezAng(1) * 0.4, 0, u), s: FS };
};
const f5 = vis(15.62, 18.5, track(`<g style="transform-origin:0 0;${an({ n: 'antic', d: 0.17, t: T.antic, c: 2, dir: 'alternate', e: 'ease-out' })}">${fox({
  run: T.climb, upright: -8, sweatWin: T.hold, raise: [[T.slide[0], T.fly[1]]], noShadow: true, noDust: true,
  eyes: [[16.3, 16.62, 'down'], [16.62, 17.12, 'wide'], [17.12, 17.6, 'wide'], [17.6, 18.62, 'wide']], moods: [[15.6, 16.4, 'calm'], [16.4, 17.12, 'panic'], [17.12, 17.6, 'shy'], [17.6, 18.62, 'oh']],
})}</g>`, 15.62, 18.5, f5fn));
// F6 : dans le bac à sable
const f6 = vis(18.5, 27.8, put(LAND[0], LAND[1], FS, `<g style="transform-origin:0 0;animation:${ao({ n: 'antic', d: 0.12, t: 25.63, c: 2, dir: 'alternate' })},${ao({ n: 'antic', d: 0.1, t: 26.17, c: 2, dir: 'alternate' })}">` + fox({
  hat: [[18.85, 20.45, `<g transform="translate(70 -166) scale(.8) translate(-70 150)">${bucketHatNH}</g>`], [20.45, 99, sandHat]], jumps: [[25.87, 26.3, 135], [26.42, 26.85, 135]], jolt: [18.62, 20.4, 26.75],
  talk: [[20.75, 21.7], [23.6, 24.7]], point: [[23.35, 24.85]], noShadow: true, blush: [[20.6, 21.6]],
  eyes: [[18.5, 18.9, 'shut'], [20.45, 21.6, 'down'], [23.5, 26.6, 'up']], moods: [[18.5, 20.45, 'oh'], [20.45, 21.6, 'shy'], [23.5, 24.8, 'panic'], [24.8, 26.7, 'sad'], [26.7, 28, 'oh']],
}) + `</g>`));
const bucketFall = vis(20.42, 99, track(`<g transform="scale(.95) translate(-70 196)">${bucketHatNH}</g>`, 20.42, 20.85, (t, u) => ({ x: lerp(LAND[0] + 45, LAND[0] - 108, u), y: lerp(LAND[1] - 196, 646, u * u) - 40 * Math.sin(Math.PI * u), r: -170 * u, s: 0.85 })));
// F7 : sort du bac et file à l'école
const f7 = vis(27.8, 29.0, track(fox({ run: [28.12, 28.97], jumps: [[27.8, 28.12, 70]], moods: [[0, 99, 'calm']], upright: -22, hat: [[0, 99, sandHat]] }), 27.8, 29.05, (t, u) => {
  const k = clamp((t - 27.8) / 0.32, 0, 1), m = clamp((t - 28.12) / 0.85, 0, 1);
  return { x: lerp(LAND[0], 500, k) + lerp(0, -470, ss(m)), y: lerp(LAND[1], 700, k) - 30 * ss(m), sx: -FS * (1 - 0.3 * ss(m)), sy: FS * (1 - 0.3 * ss(m)) };
}));

// ───────── Lino (toujours tourné vers la gauche) ─────────
const rab = rabbit({
  runExtra: [[1.0, 1.8], [22.0, 22.55], [28.55, 29.45]], item: stopwatch,
  talk: [[5.85, 6.8], [11.3, 12.6], [22.6, 23.45], [27.1, 28.0]], gest: [[5.7, 6.9], [11.2, 12.7]],
  eyes: [[22.4, 23.5, 'down'], [26.75, 27.6, 'side'], [6.9, 10.8, 'side'], [11.9, 12.7, 'arc'], [14.0, 15.0, 'side'], [18.6, 19.4, 'wide'], [23.6, 24.8, 'up']],
  moods: [[6.9, 10.8, 'oh'], [11.2, 12.7, 'happy'], [18.6, 19.4, 'oh'], [22.4, 23.5, 'oh'], [23.6, 26.7, 'calm'], [26.7, 28.0, 'oh']],
  jolt: [18.65, 27.02],
});
const rabFnX = 0;
const rabFn = (t) => {
  if (t < 1.8) { const u = clamp((t - 1.0) / 0.8, 0, 1); return { x: lerp(1460, RAB_X, 1 - (1 - u) ** 2), y: RAB_Y }; }
  if (t < 22.55) { const u = clamp((t - 22.0) / 0.55, 0, 1); return { x: lerp(RAB_X, RAB_X2, ss(u)), y: RAB_Y }; }
  const u = clamp((t - 28.55) / 0.9, 0, 1); return { x: lerp(RAB_X2, 20, ss(u)), y: RAB_Y - 40 * ss(u), k: 1 - 0.3 * ss(u) };
};
const rabEl0 = track(`<g transform="scale(${-0.95} .95)">${rab}</g>`, 0, 30, (t) => { const p = rabFn(t); return { x: p.x, y: p.y, s: p.k || 1 }; }, 20);

const rabEl = vis(0, 29.75, rabEl0);
// Coin dans le bac à sable
const coin = `<g style="${an({ n: 'duckdown', d: 4.8, t: 1.0 })}">` + put(740, 668, 0.8, pal('duck', {
  talk: [[19.45, 20.4]], jolt: [18.65], eyes: [[18.6, 19.2, 'wide'], [19.2, 21.3, 'down'], [21.35, 22.1, 'arc'], [23.7, 25.8, 'up'], [26.7, 27.6, 'wide']], moods: [[18.6, 19.0, 'oh'], [19.0, 21.3, 'sad'], [21.3, 22.1, 'happy']],
  look: -3,
})) + '</g>';
addKF('@keyframes duckdown{0%{transform:translateY(0)}10%,88%{transform:translateY(64px)}100%{transform:translateY(0)}}');

const world = `${bg}
  ${foxLap(foxBackW)}${birdsBack}
  ${tree}${bushes}
  ${slide}
  ${sandBack}${castle}<g clip-path="url(#sandclip)">${coin}</g>${vis(18.6, 99, `<g transform="translate(${LAND[0] + 78} 646)"><path d="M-40 0 Q-30 -26 0 -28 Q30 -26 40 0Z" fill="#f0c66c" stroke="${INK}" stroke-width="3.5"/><g transform="rotate(40)"><path d="M0 -20 V-44 l16 6 l-16 6" fill="#e8434e" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></g></g>`)}${bucketProp}<g clip-path="url(#sandclip)">${f6}</g>${bucketFall}${bucketJump}<g transform="translate(${LAND[0]} 640)">${puff(18.45, '#f3d58c', 8, 90).replace(/puff 0.9s/g, 'puff 0.5s')}</g>${sandFront}
  ${f5}${f1}${foxLap(foxFrontW)}${f3}${f4}<g clip-path="url(#doorclip)">${f7}${rabEl}</g>
  ${birdsFront}`;

// ───────── espace écran ─────────
const fx =
  say('fox', 'Rends-moi mon croissant !', 1.6, 1.5, { bx: 470, by: 410, tips: [[690, 500]], shout: true }) +
  sfx('CUI !', 0, 0, 15.2, 0.01, 0, '#fff', 1, 'chirp') + sfx('CUI CUI !', 930, 80, 3.75, 1.0, 8, '#ff6f95', 62, 'chirp') +
  sfx('BOING', 520, 300, 4.4, 0.7, -10, '#ffb84d', 60, 'boing') +
  say('rab', 'Top chrono !', 5.85, 1.0, { bx: 1130, by: 150, tips: [[1150, 345]] }) +
  sfx('ZOUM !', 1000, 200, 6.95, 0.8, -8, '#ffd23f', 66, 'whoosh') +
  sfx('ZOUM !', 980, 360, 9.2, 0.8, 8, '#ffd23f', 66, 'whoosh') +
  say('rab', 'Deux tours ! Record !', 11.3, 1.35, { bx: 760, by: 130, tips: [[900, 330]] }) +
  say('fox', "Je t'aurai !", 13.95, 0.75, { bx: 690, by: 190, tips: [[830, 280]], shout: true }) +
  sfx('!', 640, 130, 17.12, 0.45, 0, '#e8434e', 110) +
  sfx('WHIIIZ !', 920, 540, 17.72, 0.7, 18, '#7cc8ff', 66, 'slide') +
  sfx('POUF !', 640, 240, 18.45, 1.0, -6, '#ffb84d', 96, 'poof') +
  say('coin', 'Mon château !', 19.45, 1.0, { bx: 900, by: 270, tips: [[805, 425]], shout: true, fs: 46 }) +
  say('fox', 'Pardon...', 20.75, 1.05, { bx: 470, by: 180, tips: [[640, 250]] }) +
  say('rab', 'Ça va, Roussin ?', 22.6, 0.9, { bx: 1040, by: 320, tips: [[960, 425]] }) +
  say('fox', 'Il est là-haut !', 23.6, 1.1, { bx: 860, by: 60, tips: [[800, 200]] }) +
  sfx('CUI CUI !', 820, 120, 25.0, 0.8, -8, '#ff6f95', 64, 'chirp') +
  sfx('DRING !', 170, 170, 27.0, 1.2, -8, '#ffd23f', 50, 'handbell') +
  say('rab', 'La cloche ! On rentre !', 27.1, 0.95, { bx: 1040, by: 320, tips: [[960, 425]], shout: true }) +
  card(29.45, 'La récré !', "l'atelier peinture", 430, 215);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#7cc8ff"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'chirp', t: 0.4 }, { name: 'chirp', t: 13.0 }, { name: 'chirp', t: 16.95 }, { name: 'click', t: 5.85 }, { name: 'click', t: 11.25 },
  { name: 'step', t: 15.65 }, { name: 'whoosh', t: 16.85 }, { name: 'skid', t: 2.15 }, { name: 'boing', t: 13.9 });
writeFileSync(new URL('./la-recre.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 132, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
