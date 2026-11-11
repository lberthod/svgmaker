// Roussin & Lino · Épisode 2 « En classe » — 30 s, 1280x720.
// Un seul décor (la salle de classe), une caméra à plans coupés, bulles et onomatopées en espace écran.
//
// Découpage :
//  0.0– 4.3  plan large      Mme Chouette : « Bonjour la classe ! » — la classe répond en chœur
//  4.3– 8.0  tableau         elle écrit 2 + 2 = ? (craie) : « Combien font 2 + 2 ? »
//  8.0–13.6  pupitres        Lino lève la main « Moi ! Moi ! » — le ventre de Roussin gargouille, rires, « J'ai faim... »
// 13.6–14.8  la maîtresse    « Oui, Lino ? »
// 14.8–16.2  Lino           « Quatre carottes ! »
// 16.2–17.4  plan large      elle écrit 4 : « Bravo ! »
// 17.4–19.6  Roussin          rêve de 4 croissants
// 19.6–21.0  fenêtre         Rouge-Gorge se pose avec LE croissant, TOC TOC
// 21.0–22.6  Roussin          « MON CROISSANT !! »
// 22.6–30.0  plan large      DRING la récré : l'oiseau s'envole, Roussin puis Lino foncent ; « Ah... ces deux-là ! » ; carton
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, ao, anims, vis, tf, esc, sfx, fox, rabbit, owl, put, cloud, eyeStates, mouthStates, style, addKF } from '../lib/kit.mjs';

const DUR = 30;

// ───────── caméra : [t0, t1, cx, cy, z0, z1] (point du monde au centre de l'écran) ─────────
const SHOTS = [
  [0, 4.3, 640, 360, 1.0, 1.035],
  [4.3, 8.0, 470, 330, 1.45, 1.52],
  [8.0, 13.6, 760, 460, 1.4, 1.46],
  [13.6, 14.8, 380, 420, 1.7, 1.75],
  [14.8, 16.2, 960, 450, 1.75, 1.8],
  [16.2, 17.4, 640, 360, 1.0, 1.02],
  [17.4, 19.6, 620, 480, 2.15, 2.22],
  [19.6, 21.0, 1100, 290, 1.9, 1.95],
  [21.0, 22.6, 820, 440, 1.35, 1.4],
  [22.6, 30, 640, 360, 1.0, 1.03],
];
const clampC = (cx, cy, z) => [Math.min(Math.max(cx, 640 / z), W - 640 / z), Math.min(Math.max(cy, 360 / z), H - 360 / z)];
const camT = (cx, cy, z) => { const [x, y] = clampC(cx, cy, z); return `translate(${(640 - x * z).toFixed(1)}px,${(360 - y * z).toFixed(1)}px) scale(${z})`; };
let camKF = '@keyframes cam{';
for (const [t0, t1, cx, cy, z0, z1] of SHOTS) {
  camKF += `${((t0 / DUR) * 100).toFixed(3)}%{transform:${camT(cx, cy, z0)}}${(((t1 - 0.004) / DUR) * 100).toFixed(3)}%{transform:${camT(cx, cy, z1)}}`;
}
addKF(camKF + '}');
// position écran d'un point du monde au temps t
const scr = (wx, wy, t) => {
  const s = SHOTS.find(([a, b]) => t >= a && t < b) || SHOTS[SHOTS.length - 1];
  const z = (s[4] + s[5]) / 2, [cx, cy] = clampC(s[2], s[3], z);
  return [Math.round((wx - cx) * z + 640), Math.round((wy - cy) * z + 360)];
};

// ───────── bulles (espace écran) : centre (bx,by), une ou plusieurs pointes ─────────
function say(who, text, t0, dur, { bx, by, tips, shout = false, fs: fs0 }) {
  lines.push({ who, t0, t1: t0 + dur, text });
  const fs = fs0 || (shout ? 40 : 33), w = text.length * fs * 0.56 + 56, h = fs + 34;
  const x = Math.min(Math.max(bx, w / 2 + 16), W - 16 - w / 2), y = Math.min(Math.max(by, h / 2 + 14), H - h / 2 - 14);
  const fill = shout ? '#fff36b' : '#ffffff';
  const edge = (ty) => (ty < y ? y - h / 2 + 6 : y + h / 2 - 6);
  const tails = tips.map(([tx, ty]) => {
    const base = Math.min(Math.max(tx, x - w / 2 + 34), x + w / 2 - 34);
    return `<path d="M${base - 17} ${edge(ty)} L${tx} ${ty} L${base + 17} ${edge(ty)}Z" fill="${fill}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  }).join('');
  const covers = tips.map(([tx, ty]) => { const base = Math.min(Math.max(tx, x - w / 2 + 34), x + w / 2 - 34); return `<rect x="${base - 14}" y="${ty < y ? y - h / 2 + 3 : y + h / 2 - 12}" width="28" height="9" fill="${fill}"/>`; }).join('');
  return `<g transform="translate(${x} ${y})"><g style="${an({ n: 'pop', d: dur, t: t0, f: 'both' })}"><g transform="translate(${-x} ${-y})">
  ${tails}<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${shout ? 14 : 26}" fill="${fill}" stroke="${INK}" stroke-width="5"/>${covers}
  <text x="${x}" y="${y + fs * 0.34}" class="bt" style="font-size:${fs}px">${esc(text)}</text></g></g></g>`;
}

// ───────── éléments du décor ─────────
const croissant = `<g><path d="M-40 8 Q-34 -30 0 -32 Q34 -30 40 8 Q26 -6 14 -9 Q0 -1 -14 -9 Q-26 -6 -40 8Z" fill="#e9a84a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-14 -9 Q-13 -22 -5 -30 M14 -9 Q13 -22 5 -30" stroke="#b97520" stroke-width="3" fill="none"/><path d="M-22 -22 Q0 -30 22 -22" stroke="#f6d08a" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
const croissantLight = croissant.replace('#e9a84a', '#ffcf6b').replace('#b97520', '#c98a2c');
const desk = (x, top, w, bottom, items = '') => `<g>
  <path d="M${x - w / 2 + 14} ${top - 22} L${x + w / 2 - 14} ${top - 22} L${x + w / 2} ${top} L${x - w / 2} ${top}Z" fill="#eec08a" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  ${items}
  <rect x="${x - w / 2}" y="${top}" width="${w}" height="${bottom - top}" rx="6" fill="#d49a5c" stroke="${INK}" stroke-width="5"/>
  <rect x="${x - w / 2 + 18}" y="${top + 16}" width="${w - 36}" height="${Math.max(10, (bottom - top) * 0.32)}" rx="6" fill="#c2884c"/></g>`;
const pencil = (x, y, r = -8) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-34" y="-5" width="60" height="10" rx="3" fill="#ffd23f" stroke="${INK}" stroke-width="3"/><path d="M26 -5 L40 0 L26 5Z" fill="#f3d2a2" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><rect x="-40" y="-5" width="8" height="10" rx="2" fill="#ff8fb1" stroke="${INK}" stroke-width="3"/></g>`;
const book = (x, y, c) => `<g transform="translate(${x} ${y})"><path d="M-46 -6 L0 -14 L46 -6 L46 2 L0 -6 L-46 2Z" fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M-40 -6 L0 -12 L40 -6" stroke="#fff" stroke-width="3" fill="none"/></g>`;
const bird = (flap, withCroissant) => `<g style="transform-origin:0 0;${flap ? an({ n: 'flap', d: 0.12, c: 999, dir: 'alternate' }) : ''}">
  <ellipse rx="22" ry="15" fill="#e8434e" stroke="${INK}" stroke-width="3.5"/><circle cx="-18" cy="-8" r="12" fill="#e8434e" stroke="${INK}" stroke-width="3.5"/>
  <ellipse cx="-16" cy="2" rx="10" ry="9" fill="#ff9f43"/><polygon points="-28,-8 -40,-4 -28,-1" fill="#ffb300" stroke="${INK}" stroke-width="2.5"/><circle cx="-20" cy="-11" r="5.5" fill="#fff" stroke="${INK}" stroke-width="1.5"/><circle cx="-21.5" cy="-11" r="3.4" fill="${INK}"/><circle cx="-22.5" cy="-12.3" r="1.2" fill="#fff"/>
  ${flap ? `<path d="M0 -4 Q18 -50 36 -26 Q16 -10 6 2Z" fill="#b8232d" stroke="${INK}" stroke-width="3"/>` : `<path d="M-2 -6 Q16 -16 26 -2 Q12 4 -2 2Z" fill="#b8232d" stroke="${INK}" stroke-width="3"/>`}
  <path d="M20 -2 L34 -10 L32 4Z" fill="#b8232d" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M-6 14 v8 M6 14 v8" stroke="#ffb300" stroke-width="3" stroke-linecap="round"/>
  ${withCroissant ? `<g transform="translate(-50 -4) scale(.5) rotate(-24)">${croissantLight}</g>` : ''}</g>`;

// camarades du 2e rang : tête de face derrière un pupitre (pieds du buste en 0,0)
const pal = (kind, o = {}) => {
  const mouse = kind === 'mouse';
  const head = mouse ? '#b9bfcc' : '#ffd84a', shirt = mouse ? '#ff9fbf' : '#7cc8ff';
  const ears = mouse
    ? `<circle cx="-36" cy="-148" r="24" fill="${head}" stroke="${INK}" stroke-width="4"/><circle cx="-36" cy="-148" r="13" fill="#ffb3c6"/><circle cx="36" cy="-148" r="24" fill="${head}" stroke="${INK}" stroke-width="4"/><circle cx="36" cy="-148" r="13" fill="#ffb3c6"/>`
    : `<path d="M-6 -150 q4 -22 14 -18 q-8 4 -4 16z" fill="${head}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  const face = `${eyeStates([[-15, -116, 11, 1.5], [15, -116, 11, 1.5]], o.eyes || [])}
    ${mouse ? `<ellipse cx="0" cy="-100" rx="6" ry="4.5" fill="#ff7f9f" stroke="${INK}" stroke-width="2.5"/>${mouthStates(0, -92, o.talk || [], o.moods || [], 'calm')}
      <path d="M-14 -98 l-26 -4 M-14 -94 l-26 4 M14 -98 l26 -4 M14 -94 l26 4" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`
    : `${mouthStates(0, -88, o.talk || [], o.moods || [], 'calm')}<ellipse cx="0" cy="-98" rx="17" ry="8" fill="#ff9f43" stroke="${INK}" stroke-width="3"/>`}
    <ellipse cx="-27" cy="-100" rx="8" ry="5" fill="#ff8fa3" opacity=".8"/><ellipse cx="27" cy="-100" rx="8" ry="5" fill="#ff8fa3" opacity=".8"/>`;
  const turn = (o.turn || []).map(([a, b, dx]) => ao({ n: 'palturn', d: b - a, t: a })).join(',');
  const giggle = (o.giggle || []).map(([a, b]) => ao({ n: 'giggle', d: 0.16, t: a, c: Math.round((b - a) / 0.16), dir: 'alternate' })).join(',');
  return `<g style="${giggle ? 'animation:' + giggle : ''}"><g style="--rot:${(o.turn && o.turn[0] && o.turn[0][2] > 0) ? 12 : -12}deg;--dx:${(o.turn && o.turn[0] && o.turn[0][2]) || 0}px;${turn ? 'animation:' + turn : ''}">
    <rect x="-36" y="-80" width="72" height="84" rx="26" fill="${shirt}" stroke="${INK}" stroke-width="4"/>
    <g style="transform-origin:0 -80px;animation:idlehead ${mouse ? 1.5 : 1.9}s ease-in-out infinite alternate">${ears}<circle cx="0" cy="-114" r="42" fill="${head}" stroke="${INK}" stroke-width="4"/>${face}</g></g></g>`;
};
addKF(`@keyframes palturn{0%{transform:translateX(0) rotate(0)}12%,88%{transform:translateX(var(--dx)) rotate(var(--rot))}100%{transform:translateX(0) rotate(0)}}
@keyframes giggle{from{transform:translateY(0)}to{transform:translateY(-6px)}}
@keyframes chalk{0%{opacity:0;transform:scale(.6)}40%{opacity:1;transform:scale(1.12)}100%{opacity:1;transform:scale(1)}}
@keyframes sparkle{0%{opacity:0;transform:scale(.2) rotate(0)}30%{opacity:1;transform:scale(1.2) rotate(40deg)}100%{opacity:0;transform:scale(.6) rotate(90deg)}}
@keyframes peck{0%,100%{transform:rotate(0)}35%{transform:translateX(7px) rotate(12deg)}55%{transform:translateX(-6px) rotate(-18deg)}}
@keyframes tummy{0%{transform:scale(1)}30%{transform:scale(1.06,.95)}60%{transform:scale(.97,1.03)}100%{transform:scale(1)}}
@keyframes thinkk{0%{opacity:0;transform:scale(.3)}12%{opacity:1;transform:scale(1.06)}20%,92%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.9)}}
@keyframes floaty{from{transform:translateY(0) rotate(-6deg)}to{transform:translateY(-8px) rotate(6deg)}}`);

// ───────── le monde (salle de classe) ─────────
const FLOOR = 540;
const FOX_X = 560, RAB_X = 990, SEAT_Y = 680;
const chalkCh = [['2', 440, 4.5], ['+', 520, 4.75], ['2', 600, 5.0], ['=', 680, 5.25]];
const board = `<g>
  <rect x="290" y="88" width="592" height="268" rx="10" fill="#8a5a33" stroke="${INK}" stroke-width="6"/>
  <rect x="306" y="104" width="560" height="236" rx="4" fill="#2f6b4f"/>
  <path d="M330 300 Q420 285 470 310 M640 130 Q720 120 800 140" stroke="#4d8a6c" stroke-width="10" fill="none" stroke-linecap="round" opacity=".6"/>
  <text x="380" y="146" style="font-size:30px;fill:#e8f2e0;font-weight:400">Lundi</text>
  <g transform="translate(812 150)" stroke="#ffe27a" stroke-width="4" fill="none" stroke-linecap="round"><circle r="15"/><path d="M0 -24 v-8 M0 24 v8 M-24 0 h-8 M24 0 h8 M-17 -17 l-6 -6 M17 17 l6 6 M17 -17 l6 -6 M-17 17 l-6 6"/></g>
  ${chalkCh.map(([c, x, t]) => vis(t, 99, `<g transform="translate(${x} 262)"><g style="${an({ n: 'chalk', d: 0.25, t, f: 'both' })}"><text style="font-size:96px;fill:#f6f6ea;font-weight:700">${c}</text></g></g>`)).join('')}
  ${vis(5.5, 16.25, `<g transform="translate(760 262)"><g style="${an({ n: 'chalk', d: 0.25, t: 5.5, f: 'both' })}"><text style="font-size:96px;fill:#f6f6ea;font-weight:700">?</text></g></g>`)}
  ${vis(16.25, 99, `<g transform="translate(760 262)"><g style="${an({ n: 'chalk', d: 0.3, t: 16.25, f: 'both' })}"><text style="font-size:104px;fill:#ffe27a;font-weight:700">4</text></g></g>`)}
  ${[[722, 170], [812, 214], [790, 290]].map(([x, y], i) => vis(16.3, 17.6, `<g transform="translate(${x} ${y})"><g style="${an({ n: 'sparkle', d: 0.9, t: 16.3 + i * 0.12, f: 'both' })}"><path d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4Z" fill="#ffe27a" stroke="${INK}" stroke-width="2"/></g></g>`)).join('')}
  <rect x="300" y="340" width="572" height="14" rx="4" fill="#a8743f" stroke="${INK}" stroke-width="4"/>
  <rect x="340" y="332" width="34" height="9" rx="4" fill="#fff"/><rect x="392" y="333" width="26" height="8" rx="4" fill="#ff8fb1"/><rect x="800" y="331" width="44" height="12" rx="3" fill="#6b4a2e" stroke="${INK}" stroke-width="2.5"/></g>`;
// horloge 8h35
const clock = `<g transform="translate(150 150)"><circle r="50" fill="#fff" stroke="${INK}" stroke-width="7"/><circle r="50" fill="none" stroke="#3b82f6" stroke-width="3" transform="scale(.86)"/>
  ${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-38" x2="0" y2="${i % 3 ? -33 : -28}" stroke="${INK}" stroke-width="${i % 3 ? 2.5 : 4}" transform="rotate(${i * 30})"/>`).join('')}
  <line x1="0" y1="0" x2="0" y2="-34" stroke="${INK}" stroke-width="4" stroke-linecap="round" transform="rotate(210)"/><line x1="0" y1="0" x2="0" y2="-22" stroke="${INK}" stroke-width="6" stroke-linecap="round" transform="rotate(258)"/><circle r="4.5" fill="#e8434e"/></g>`;
// sonnerie murale
const bellEl = `<g transform="translate(62 262)"><rect x="-8" y="-40" width="16" height="22" fill="#9aa3ad" stroke="${INK}" stroke-width="3"/>
  <g style="transform-origin:0 -18px;--s:2px;${an({ n: 'shake', d: 0.04, t: 22.6, c: 30, dir: 'alternate' })}"><path d="M-26 8 Q-26 -22 0 -22 Q26 -22 26 8Z" fill="#e8434e" stroke="${INK}" stroke-width="4"/><circle cy="12" r="6" fill="#ffd23f" stroke="${INK}" stroke-width="3"/></g>
  ${vis(22.6, 24.2, `<path d="M-40 -20 q-12 16 0 32 M40 -20 q12 16 0 32 M-54 -28 q-18 26 0 48 M54 -28 q18 26 0 48" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`)}</g>`;
// fenêtre : extérieur (ciel, arbre, cour) + oiseau, découpés dans la vitre
const WX = 950, WY = 118, WW = 262, WH = 270;
const birdOnSill = vis(19.6, 22.75, tf(`<g transform="scale(1.7)"><g style="transform-origin:-10px 10px;${an({ n: 'peck', d: 0.25, t: 20.0, c: 2 })}">${bird(false, true)}</g></g>`,
  { t0: 19.6, d: 0.4, from: 'translate(1330px,200px)', to: `translate(1186px,${WY + WH - 46}px)`, e: 'cubic-bezier(.2,.8,.4,1)' }));
const birdFly = vis(22.75, 99, tf(`<g transform="scale(1.9)">${bird(true, true)}</g>`, { t0: 22.75, d: 1.15, from: `translate(1186px,${WY + WH - 46}px)`, to: 'translate(1360px,40px)', e: 'cubic-bezier(.4,0,.7,.6)' }));
const windowEl = `<defs><clipPath id="win"><rect x="${WX + 12}" y="${WY + 12}" width="${WW - 24}" height="${WH - 24}"/></clipPath>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6cc4ff"/><stop offset="1" stop-color="#d8f1ff"/></linearGradient></defs>
  <rect x="${WX}" y="${WY}" width="${WW}" height="${WH}" rx="8" fill="#fff" stroke="${INK}" stroke-width="6"/>
  <g clip-path="url(#win)">
    <rect x="${WX}" y="${WY}" width="${WW}" height="${WH}" fill="url(#sky)"/>
    <g style="animation:cdrift 11s ease-in-out infinite alternate">${cloud(1020, 170, 0.55)}${cloud(1170, 210, 0.42)}</g>
    <rect x="${WX}" y="${WY + 200}" width="${WW}" height="80" fill="#7ac35a"/>
    <g transform="translate(1180 330)"><rect x="-10" y="-80" width="20" height="82" fill="#8a5a33" stroke="${INK}" stroke-width="3"/><circle cy="-110" r="52" fill="#3fae55" stroke="${INK}" stroke-width="4"/><circle cx="-38" cy="-80" r="30" fill="#52c468" stroke="${INK}" stroke-width="4"/></g>
    <rect x="${WX}" y="${WY + WH - 30}" width="${WW}" height="30" fill="#c9b79a"/>
    ${birdOnSill}${birdFly}
  </g>
  <rect x="${WX + WW / 2 - 5}" y="${WY}" width="10" height="${WH}" fill="#fff" stroke="${INK}" stroke-width="3"/>
  <rect x="${WX}" y="${WY + 118}" width="${WW}" height="10" fill="#fff" stroke="${INK}" stroke-width="3"/>
  <rect x="${WX + 12}" y="${WY + 12}" width="${WW - 24}" height="${WH - 24}" fill="none" stroke="${INK}" stroke-width="4"/>
  <path d="M${WX + 30} ${WY + 40} l40 -14 M${WX + 30} ${WY + 62} l24 -8" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/>
  <rect x="${WX - 16}" y="${WY + WH - 4}" width="${WW + 32}" height="18" rx="5" fill="#eadfca" stroke="${INK}" stroke-width="5"/>`;
// radiateur + chaussettes de Roussin qui sèchent (rappel de l'épisode 1)
const sockDrip = (x, d) => `<g transform="translate(${x} 470)"><g style="${an({ n: 'dripk', d: 1.1, t: d, c: 999 })}"><path d="M0 0 q-5 10 0 13 q5 -3 0 -13z" fill="#8fd3ff" stroke="${INK}" stroke-width="2"/></g></g>`;
const radiator = `<g><rect x="1000" y="410" width="200" height="96" rx="10" fill="#e9edf2" stroke="${INK}" stroke-width="5"/>
  ${Array.from({ length: 7 }, (_, i) => `<rect x="${1012 + i * 27}" y="420" width="18" height="76" rx="8" fill="#d3dae3" stroke="${INK}" stroke-width="2.5"/>`).join('')}
  <path d="M1062 404 v14 M1138 404 v14" stroke="${INK}" stroke-width="3"/>
  ${[1118, 1162].map((x, i) => `<g style="transform-origin:${x}px 404px;animation:sway ${1.6 + i * 0.3}s ease-in-out infinite alternate"><path d="M${x - 11} 400 L${x + 11} 400 L${x + 11} 446 Q${x + 11} 462 ${x - 5} 462 L${x - 26} 462 Q${x - 36} 462 ${x - 36} 452 Q${x - 36} 442 ${x - 11} 440Z" fill="#f28a1e" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <rect x="${x - 11}" y="400" width="22" height="9" fill="#fff"/><rect x="${x - 11}" y="418" width="22" height="7" fill="#fff"/><path d="M${x - 26} 462 Q${x - 36} 462 ${x - 36} 452 Q${x - 36} 444 ${x - 26} 443Z" fill="#fff"/><path d="M${x - 11} 400 L${x + 11} 400 L${x + 11} 446 Q${x + 11} 462 ${x - 5} 462 L${x - 26} 462 Q${x - 36} 462 ${x - 36} 452 Q${x - 36} 442 ${x - 11} 440Z" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/></g>`).join('')}
  ${sockDrip(1104, 0)}${sockDrip(1148, 0.55)}
  <path d="M1100 392 q8 -10 0 -20 q-8 -10 0 -20 M1150 392 q8 -10 0 -20 q-8 -10 0 -20" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7" style="${an({ n: 'floaty', d: 1.2, c: 999, dir: 'alternate' })}"/></g>`;
const banner = `<g>${'ABCDEFGHIJKL'.split('').map((c, i) => { const x = 60 + i * 100; const col = ['#ff8fb1', '#ffd23f', '#7cc8ff', '#9be08a', '#c7a3ff', '#ffb36b'][i % 6]; return `<g transform="translate(${x} ${30 + (i % 2) * 4}) rotate(${i % 2 ? 4 : -4})"><path d="M-32 0 L32 0 L26 50 L-26 50Z" fill="${col}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><text y="38" style="font-size:32px;fill:${INK}">${c}</text></g>`; }).join('')}
  <path d="M0 26 Q640 46 1280 26" stroke="${INK}" stroke-width="3" fill="none"/></g>`;
const wall = `
  <rect width="${W}" height="${H}" fill="#ffe9bd"/>
  ${Array.from({ length: 16 }, (_, i) => `<rect x="${i * 80 + 40}" y="0" width="40" height="${FLOOR - 90}" fill="#ffe0a6" opacity=".7"/>`).join('')}
  <rect y="${FLOOR - 92}" width="${W}" height="92" fill="#f4c27f"/><rect y="${FLOOR - 98}" width="${W}" height="12" rx="4" fill="#d9954f" stroke="${INK}" stroke-width="3"/>
  ${Array.from({ length: 16 }, (_, i) => `<rect x="${i * 80 + 12}" y="${FLOOR - 76}" width="56" height="62" rx="6" fill="#efb46a"/>`).join('')}
  <rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="#c98a4e"/>
  ${Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${FLOOR + 14 + i * 30}" x2="${W}" y2="${FLOOR + 14 + i * 30}" stroke="#b37740" stroke-width="3"/>`).join('')}
  <rect y="${FLOOR - 6}" width="${W}" height="10" fill="#8a5224"/>
  <g transform="translate(900 470)"><rect x="-26" y="-46" width="52" height="46" rx="6" fill="#ff9f43" stroke="${INK}" stroke-width="4"/><path d="M0 -46 q-26 -40 -10 -70 M0 -46 q16 -44 30 -60 M0 -46 q-2 -30 4 -58" stroke="#3fae55" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="-10" cy="-116" rx="14" ry="9" fill="#52c468" stroke="${INK}" stroke-width="3"/><ellipse cx="30" cy="-106" rx="14" ry="9" fill="#52c468" stroke="${INK}" stroke-width="3"/></g>
  <g transform="translate(40 380)"><rect width="190" height="10" rx="4" fill="#8a5224" stroke="${INK}" stroke-width="3.5"/></g>
  <g transform="translate(36 312)"><rect width="22" height="66" fill="#e8434e" stroke="${INK}" stroke-width="3.5"/><rect x="24" y="10" width="26" height="56" fill="#3b82f6" stroke="${INK}" stroke-width="3.5"/><rect x="52" y="-2" width="20" height="68" fill="#22a06b" stroke="${INK}" stroke-width="3.5"/><rect x="74" y="16" width="30" height="50" fill="#ffd23f" stroke="${INK}" stroke-width="3.5"/></g>`;

// personnages
const owlT = [[0.5, 1.9], [6.0, 7.8], [13.7, 14.6], [16.5, 17.3], [25.75, 27.85]];
const owlEl = put(185, 640, 1.35, `<g style="animation:owlsway 1.8s ease-in-out infinite alternate"><g style="animation:${ao({ n: 'jolt', d: 0.6, t: 22.65 })},${ao({ n: 'jolt', d: 0.6, t: 16.45 })}">${owl(owlT, { happyAt: 25.55, watchAt: null, point: [[4.4, 8.0], [13.6, 14.8], [16.0, 16.8]], wave: [[0.3, 2.0], [27.8, 29.8]], look: [[13.6, 14.8, 9], [25.1, 26.8, 9]] })}</g></g>`);
const coin = put(365, 522, 1.0, pal('duck', { eyes: [[10.4, 11.0, 'wide'], [11.0, 12.5, 'arc'], [25.4, 27.0, 'arc']], moods: [[11.0, 12.5, 'happy'], [25.4, 27.4, 'happy']], turn: [[10.4, 12.8, 22]], giggle: [[11.0, 12.5], [25.4, 26.6]] }));
const mimi = put(800, 522, 1.0, pal('mouse', { eyes: [[10.4, 11.0, 'wide'], [11.0, 12.5, 'arc'], [25.4, 27.0, 'arc']], talk: [[11.1, 12.3]], moods: [[11.0, 12.5, 'happy'], [25.4, 27.4, 'happy']], turn: [[10.4, 12.8, -22]], giggle: [[11.0, 12.5], [25.4, 26.6]] }));
const backDesks = desk(365, 505, 190, 562, book(335, 500, '#7cc8ff')) + desk(800, 505, 190, 562, pencil(830, 498, 6));

const foxSeatOpts = {
  run: null, upright: -18, talk: [[2.1, 3.8], [12.4, 13.5], [17.6, 19.4], [21.1, 22.4]], gest: [[12.4, 13.5]], raise: [[21.05, 22.6]],
  eyes: [[8.2, 10.0, 'up'], [10.0, 10.6, 'sq'], [10.6, 13.6, 'down'], [17.4, 19.6, 'arc'], [21.0, 23.25, 'wide']],
  moods: [[10.0, 12.3, 'shy'], [12.3, 13.7, 'sad'], [17.4, 19.6, 'happy'], [19.9, 21.0, 'shy'], [21.0, 23.25, 'panic']],
  blush: [[10.3, 13.7]], jolt: [10.0, 21.0], shiver: [10.0, 10.9],
};
const foxSeat = (flip) => put(FOX_X, SEAT_Y, 1.25, `<g style="transform-origin:0 -90px;${an({ n: 'tummy', d: 0.3, t: 10.0, c: 4 })}">${fox(foxSeatOpts)}</g>`, flip);
const foxRun = fox({ run: [24.15, 25.05], jumps: [[23.5, 24.15, 100]], mood: 'calm', moods: [[0, 99, 'oh']], eyes: [[0, 99, 'wide']], upright: -24 });
const foxRunEl = tf(tf(`<g style="transform-origin:0 0;${an({ n: 'antic', d: 0.13, t: 23.25, c: 2, dir: 'alternate', e: 'ease-out' })}">${put(0, 0, 1.25, foxRun)}</g>`,
  { t0: 24.15, d: 0.8, from: 'translate(0px,0px)', to: 'translate(880px,0px)', e: 'cubic-bezier(.4,0,.9,.6)' }),
  { t0: 23.5, d: 0.65, from: `translate(${FOX_X}px,${SEAT_Y}px)`, to: `translate(680px,775px)`, e: 'linear' });

const rabSeatOpts = {
  run: null, talk: [[2.1, 3.8], [8.2, 9.6], [14.9, 16.1], [24.85, 25.55]], gest: [[14.9, 16.1]], raise: [[8.0, 10.3], [13.1, 14.8]],
  eyes: [[2.0, 3.9, 'side'], [10.3, 11.0, 'wide'], [11.0, 13.0, 'side'], [16.4, 17.4, 'arc'], [21.0, 23.0, 'wide'], [24.8, 25.7, 'wide']],
  moods: [[8.0, 10.3, 'happy'], [10.3, 11.6, 'oh'], [11.6, 13.4, 'shy'], [13.1, 18.0, 'happy'], [21.0, 23.1, 'oh'], [24.8, 25.7, 'oh']],
  jolt: [8.05, 8.75, 9.45, 13.15, 16.5, 25.0],
};
const rabSeat = put(RAB_X, SEAT_Y, 1.3, rabbit(rabSeatOpts), true);
const rabRun = rabbit({ run: [26.2, 27.35], jumps: [[25.65, 26.2, 110]], mood: 'calm', moods: [[0, 99, 'happy']] });
const rabRunEl = tf(put(0, 0, 1.3, rabRun), { t0: 25.65, d: 1.5, from: `translate(${RAB_X}px,${SEAT_Y}px)`, to: `translate(1600px,760px)`, e: 'cubic-bezier(.3,0,.8,.7)' });

const frontDesks = desk(FOX_X - 20, 600, 330, 720, book(FOX_X - 90, 594, '#e8434e') + pencil(FOX_X + 50, 592, -4)) +
  desk(RAB_X + 10, 600, 330, 720, book(RAB_X + 80, 594, '#22a06b') + pencil(RAB_X - 40, 593, 8));

const world = `${wall}${banner}${board}${clock}${bellEl}${windowEl}${radiator}
  ${owlEl}
  ${coin}${mimi}
  ${backDesks}
  ${vis(0, 19.7, foxSeat(true))}${vis(19.7, 23.25, foxSeat(false))}${vis(23.25, 23.65, foxRunEl)}
  ${vis(0, 25.65, rabSeat)}${vis(25.65, 25.9, rabRunEl)}
  ${frontDesks}
  ${vis(23.65, 99, foxRunEl)}${vis(25.9, 99, rabRunEl)}`;

// ───────── espace écran : bulles, pensées, onomatopées, carton ─────────
const P = (wx, wy, t) => scr(wx, wy, t);
const owlTip = (t) => P(240, 345, t), foxTip = (t) => P(470, 372, t), rabTip = (t) => P(905, 318, t);
const thought = (() => {
  const [hx, hy] = P(470, 420, 18);
  const cx = hx + 400, cy = 170;
  const blob = [[-150, 0, 70], [-70, -40, 76], [30, -46, 80], [120, -16, 70], [150, 40, 54], [60, 52, 66], [-50, 50, 66], [-140, 40, 52]]
    .map(([x, y, r]) => `<circle cx="${cx + x}" cy="${cy + y}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="5"/>`).join('') +
    [[-150, 0, 66], [-70, -40, 72], [30, -46, 76], [120, -16, 66], [150, 40, 50], [60, 52, 62], [-50, 50, 62], [-140, 40, 48]]
      .map(([x, y, r]) => `<circle cx="${cx + x}" cy="${cy + y}" r="${r}" fill="#fff"/>`).join('');
  const dots = [[hx + 60, hy - 30, 12], [hx + 100, hy - 62, 17], [hx + 150, hy - 92, 22]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="4"/>`).join('');
  const crs = [-144, -48, 48, 144].map((dx, i) => `<g transform="translate(${cx + dx} ${cy - 4})"><g style="${an({ n: 'floaty', d: 0.6, t: i * 0.15, c: 999, dir: 'alternate' })}"><g transform="scale(1.1)">${croissant}</g></g></g>`).join('') + `<text x="${cx}" y="${cy + 66}" class="bt" style="font-size:27px">Mmm... quatre croissants...</text>`;
  return `<g style="transform-origin:${hx + 100}px ${hy - 60}px;${an({ n: 'thinkk', d: 2.2, t: 17.45, f: 'both' })}">${dots}${blob}${crs}
    </g>`;
})();

const fx =
  say('owl', 'Bonjour la classe !', 0.5, 1.4, { bx: 330, by: 230, tips: [owlTip(0.5)] }) +
  say('class', 'Bonjour madame Chouette !', 2.1, 1.7, { bx: 690, by: 225, tips: [[485, 388], [868, 398]] }) +
  sfx('SCRITCH', 940, 150, 4.5, 1.3, 8, '#ffffff', 56, 'chalk') +
  say('owl', 'Combien font 2 + 2 ?', 6.0, 1.8, { bx: 470, by: 335, tips: [[230, 520]] }) +
  say('rab', 'Moi ! Moi ! Moi !', 8.2, 1.4, { bx: 1010, by: 52, tips: [[905, 150]], shout: true }) +
  sfx('GROOOUUU...', 330, 660, 10.0, 1.4, -4, '#b57bff', 72, 'tummy') +
  say('mimi', 'Hi hi hi !', 11.1, 1.2, { bx: 760, by: 150, tips: [P(800, 390, 11.1)] }) +
  say('fox', "J'ai faim...", 12.4, 1.2, { bx: 300, by: 160, tips: [P(470, 400, 12.4)] }) +
  say('owl', 'Oui, Lino ?', 13.7, 0.95, { bx: 480, by: 110, tips: [P(260, 360, 13.7)] }) +
  say('rab', 'Quatre carottes !', 14.9, 1.25, { bx: 1000, by: 110, tips: [[690, 300]], shout: true }) +
  say('owl', 'Bravo !', 16.5, 0.85, { bx: 240, by: 240, tips: [owlTip(16.5)] }) +
  thought +
  (lines.push({ who: 'fox', t0: 17.6, t1: 19.4, text: 'Mmm... quatre croissants...' }), '') +
  sfx('TOC !', 930, 330, 20.08, 0.6, -8, '#ffd23f', 70, 'knock') + sfx('TOC !', 1010, 260, 20.33, 0.6, 8, '#ffd23f', 70) +
  sfx('!!', 560, 300, 21.0, 1.2, 0, '#e8434e', 90) +
  say('fox', 'MON CROISSANT !!', 21.1, 1.3, { bx: 440, by: 200, tips: [P(667, 500, 21.1)], shout: true }) +
  sfx('DRING !', 165, 200, 22.6, 1.2, -8, '#ffd23f', 54, 'bell') +
  sfx('ZIP !', 1140, 150, 22.8, 0.8, 8, '#ff6f95', 70) +
  say('rab', 'Attends-moi !', 24.85, 0.75, { bx: 1010, by: 215, tips: [[905, 330]], shout: true }) +
  say('owl', 'Ah... ces deux-là !', 25.75, 2.1, { bx: 300, by: 300, tips: [[200, 455]] }) +
  `<g style="${an({ n: 'cardk', d: 0.6, t: 27.7, f: 'both', e: 'cubic-bezier(.2,1.6,.4,1)' })}"><g transform="translate(640 120) scale(.8)">
    <rect x="-279" y="-80" width="570" height="196" rx="30" fill="#000" opacity=".22" transform="rotate(-1.5)"/><rect x="-285" y="-88" width="570" height="196" rx="30" fill="#fff" stroke="${INK}" stroke-width="7" transform="rotate(-1.5)"/>
    <text y="0" class="sfx" style="font-size:68px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino</text>
    <text y="52" class="bt" style="font-size:40px;fill:#2b5ba8">En classe !</text>
    <text y="90" class="bt" style="font-size:24px;fill:#7a6a5a">Prochain épisode : la récré</text></g></g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#ffe9bd"/>
<g style="transform-origin:0 0;animation:cam ${DUR}s linear 0s 1 normal both">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'chirp', t: 19.6 }, { name: 'chirp', t: 22.75 }, { name: 'chime', t: 16.3 }, { name: 'whoosh', t: 23.3 }, { name: 'whoosh', t: 25.7 }, { name: 'wave', t: 0.35 });
writeFileSync(new URL('./en-classe.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
