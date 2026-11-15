// Roussin & Lino · Épisode 15 « Dodo » — 30 s, 1280x720. 20h30, la chambre de Lino, la nuit. Clôture de la saison.
//
// Découpage :
//  0.0– 3.5  plan large      les deux amis au lit, au clair de lune ; Lino : « Roussin ? Tu dors ? »
//  3.5– 6.5  Roussin          « Pas encore... Je pense à notre journée. »
//  6.5–15.0  la bulle de rêve  la journée rejoue : le croissant (et Rouge-Gorge), la flaque (SPLASH), la cloche (DRING) ; « C'est drôle ! »
// 15.0–18.0  la fenêtre      Rouge-Gorge dort sur le rebord, la tête sous l'aile
// 18.0–21.0  Lino           « Bonne nuit, Roussin. »
// 21.0–24.0  Roussin          « Bonne nuit, Lino. »
// 24.0–30.0  plan large      ils dorment, Zzz ; la caméra recule ; carton « Fin »
import { writeFileSync } from 'node:fs';
import { timeBadge } from '../lib/badge.mjs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../lib/kit.mjs';
import { makeCam, say, bird, croissant } from '../lib/props.mjs';
import { wallClock } from '../lib/classroom.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.5, 600, 400, 1.1, 1.12],
  [3.5, 6.5, 380, 480, 1.9, 1.95],
  [6.5, 15.0, 640, 360, 1.15, 1.2],
  [15.0, 18.0, 880, 164, 2.2, 2.25],
  [18.0, 21.0, 860, 492, 1.9, 1.95],
  [21.0, 24.0, 380, 480, 1.9, 1.95],
  [24.0, 30, 620, 410, 1.12, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
const lerp = (a, b, u) => a + (b - a) * u;
addKF(`@keyframes zzz{0%{opacity:0;transform:translate(0,0) scale(.6)}15%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translate(40px,-70px) scale(1.2)}}
@keyframes cloudin{0%{opacity:0;transform:scale(.4)}100%{opacity:1;transform:scale(1)}}
@keyframes vignette{0%{opacity:0;transform:scale(.6)}15%{opacity:1;transform:scale(1)}85%{opacity:1}100%{opacity:0}}
@keyframes ring{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}
@keyframes splashd{0%{opacity:1;transform:translate(0,0)}100%{opacity:0;transform:translate(var(--dx),var(--dy))}}
@keyframes breathe2{from{transform:scaleY(1)}to{transform:scaleY(1.04)}}
@keyframes twinkle{from{opacity:.3}to{opacity:1}}
@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}`);

// ───────── décor : la chambre de Lino, la nuit ─────────
const FLOOR = 560;
const room = `<rect width="${W}" height="${H}" fill="#3c4886"/>
  ${Array.from({ length: 30 }, (_, i) => `<path d="M${(i * 97) % 1280} ${(i * 53) % 420 + 20} l4 9 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1z" fill="#ffe27a" style="animation:twinkle ${1.2 + (i % 4) * 0.4}s ease-in-out ${(i % 5) * 0.3}s infinite alternate"/>`).join('')}
  <rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="#5e4c40"/>
  ${Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${FLOOR + 14 + i * 30}" x2="${W}" y2="${FLOOR + 14 + i * 30}" stroke="#4f3f35" stroke-width="3"/>`).join('')}
  <g transform="translate(-120 0)"><rect x="1060" y="80" width="190" height="200" rx="10" fill="#d8dcf0" stroke="${INK}" stroke-width="6"/><rect x="1072" y="92" width="166" height="176" fill="#141d48"/><circle cx="1190" cy="140" r="26" fill="#fff6c8"/><circle cx="1202" cy="132" r="24" fill="#141d48"/>
    ${[[1090, 120], [1120, 210], [1220, 230]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff6c8"/>`).join('')}
    <rect x="1150" y="80" width="10" height="200" fill="#d8dcf0" stroke="${INK}" stroke-width="3"/><rect x="1046" y="276" width="218" height="16" rx="5" fill="#cfc4ad" stroke="${INK}" stroke-width="5"/></g>
  <path d="M952 268 L780 ${FLOOR + 160} L1120 ${FLOOR + 160} L1118 268Z" fill="#fff6c8" opacity=".12"/>
  ${wallClock(20, 30, 160, 150)}`;
const BED = { x: 680, w: 380, y: 520 };
const bedBack = `<g><rect x="${BED.x}" y="${BED.y - 140}" width="26" height="250" rx="10" fill="#a67a4e" stroke="${INK}" stroke-width="5"/><rect x="${BED.x + BED.w - 26}" y="${BED.y - 60}" width="26" height="170" rx="10" fill="#a67a4e" stroke="${INK}" stroke-width="5"/>
  <rect x="${BED.x + 20}" y="${BED.y - 20}" width="${BED.w - 40}" height="70" rx="14" fill="#e6e9f7" stroke="${INK}" stroke-width="5"/><ellipse cx="${BED.x + 90}" cy="${BED.y - 30}" rx="70" ry="30" fill="#e6e9f7" stroke="${INK}" stroke-width="5"/></g>`;
const blanket = (x, y, w, c) => `<g style="transform-origin:${x + w / 2}px ${y + 120}px;animation:breathe2 1.8s ease-in-out infinite alternate"><path d="M${x} ${y} Q${x + w / 2} ${y - 26} ${x + w} ${y} V${y + 120} H${x}Z" fill="${c}" stroke="${INK}" stroke-width="5"/>${[0, 1, 2].map((i) => `<circle cx="${x + 60 + i * (w - 120) / 2}" cy="${y + 50}" r="12" fill="#fff" opacity=".6"/>`).join('')}</g>`;
const mattress = `<g><rect x="110" y="600" width="360" height="40" rx="14" fill="#e6e9f7" stroke="${INK}" stroke-width="5"/><ellipse cx="170" cy="584" rx="60" ry="24" fill="#e6e9f7" stroke="${INK}" stroke-width="5"/></g>`;
const nightstand = `<g><rect x="510" y="520" width="100" height="130" rx="8" fill="#a67a4e" stroke="${INK}" stroke-width="5"/><g transform="translate(582 488)"><circle r="30" fill="#e8434e" stroke="${INK}" stroke-width="4"/><circle cx="-20" cy="-26" r="9" fill="#ffd23f" stroke="${INK}" stroke-width="3"/><circle cx="20" cy="-26" r="9" fill="#ffd23f" stroke="${INK}" stroke-width="3"/><circle r="22" fill="#fff" stroke="${INK}" stroke-width="2"/><line x1="0" y1="0" x2="0" y2="-18" stroke="${INK}" stroke-width="3" stroke-linecap="round" transform="rotate(180)"/><line x1="0" y1="0" x2="0" y2="-12" stroke="#e8434e" stroke-width="4" stroke-linecap="round" transform="rotate(225)"/></g></g>`;
const nightcap = (c, fx = false) => `<g transform="${fx ? 'translate(92 -212) rotate(14)' : 'translate(52 -224) rotate(-8)'}"><path d="M-46 30 Q-10 -60 60 -30 Q20 -10 46 30Z" fill="${c}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><rect x="-50" y="22" width="100" height="18" rx="9" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="62" cy="-30" r="12" fill="#fff" stroke="${INK}" stroke-width="3"/></g>`;

// ───────── personnages au lit ─────────
const foxBed = put(330, 690, 1.0, fox({ run: null, upright: -6, noShadow: true, noBag: true, hat: [[0, 99, nightcap('#3b82f6', true)]],
  talk: [[3.8, 6.2], [21.3, 22.8]], eyes: [[0, 3.6, 'side'], [3.6, 6.5, 'side'], [12.0, 14.6, 'arc'], [14.6, 21.0, 'side'], [21.0, 23.3, 'down'], [23.3, 30, 'closed']],
  moods: [[3.6, 6.5, 'happy'], [12.0, 14.6, 'happy'], [21.0, 30, 'calm']], blush: [[21.3, 22.8]] }));
const rabBed = put(860, 640, 1.0, rabbit({ run: null, noBag: true, noShadow: true, hat: [[0, 99, nightcap('#ff8fb1')]],
  talk: [[0.6, 2.2], [12.6, 13.4], [18.3, 19.3]], eyes: [[0, 6.5, 'side'], [6.5, 12.0, 'up'], [12.0, 14.6, 'arc'], [14.6, 19.2, 'side'], [19.2, 19.9, 'down'], [19.9, 30, 'closed']],
  moods: [[0.6, 2.2, 'happy'], [6.5, 19.3, 'happy'], [19.3, 30, 'calm']], blush: [[18.3, 19.9]] }), true);
const zzz = (x, y, t0, fs = 44, ds = [0, 1.5, 3.0, 4.5]) => ds.map((d) => vis(t0 + d, t0 + d + 1.4, `<g transform="translate(${x} ${y})"><g style="${an({ n: 'zzz', d: 1.4, t: t0 + d, f: 'both' })}"><text class="sfx" style="font-size:${fs}px;fill:#9fb3ff;stroke:#1d2550;stroke-width:3;paint-order:stroke">Z z z</text></g></g>`)).join('');

// ───────── la bulle de rêve (la journée) ─────────
const C = [580, 210];
const vign = (t0, t1, inner) => vis(t0, t1, `<g transform="translate(${C[0]} ${C[1]}) scale(1.2)"><g style="transform-origin:0 0;${an({ n: 'vignette', d: t1 - t0, t: t0, f: 'both' })}">${inner}</g></g>`);
const miniFox = `<g transform="scale(.42)">${fox({ run: null, upright: -10, noShadow: true, eyes: [[0, 99, 'arc']], moods: [[0, 99, 'happy']] })}</g>`;
const miniRab = `<g transform="scale(.4) scale(-1 1)">${rabbit({ run: null, noBag: true, noShadow: true, eyes: [[0, 99, 'arc']], moods: [[0, 99, 'happy']] })}</g>`;
const dream = vis(6.5, 14.95, `${[[430, 385, 6], [450, 362, 10], [478, 342, 14]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f4f0ff" stroke="${INK}" stroke-width="3"/>`).join('')}<g transform="translate(${C[0]} ${C[1]}) scale(.85)"><g style="transform-origin:-200px 180px;${an({ n: 'cloudin', d: 0.5, t: 6.5, f: 'both' })}">
    
    ${[[-200, 0, 80], [-110, -60, 90], [0, -80, 100], [110, -60, 90], [200, 0, 80], [120, 60, 85], [0, 75, 95], [-120, 60, 85]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f4f0ff" stroke="${INK}" stroke-width="5"/>`).join('')}
    <ellipse rx="250" ry="110" fill="#f4f0ff"/></g></g>`) +
  vign(7.0, 9.4, `<g transform="translate(-60 20) rotate(-15)"><path d="M-58 26 Q-56 -34 0 -38 Q56 -34 58 26 Q44 4 28 6 Q18 -8 0 -8 Q-18 -8 -28 6 Q-44 4 -58 26Z" fill="#e9a84a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-28 0 Q-30 -20 -20 -32 M28 0 Q30 -20 20 -32 M-8 -22 Q-8 -32 -4 -37 M8 -22 Q8 -32 4 -37" stroke="#b97520" stroke-width="3" fill="none"/></g><g transform="translate(90 -20)"><g style="${an({ n: 'ring', d: 0.3, t: 7.0, c: 8, dir: 'alternate' })}">${bird(true, true)}</g></g>`) +
  vign(9.4, 11.8, `<ellipse cx="0" cy="40" rx="150" ry="28" fill="#5ba7e8" stroke="${INK}" stroke-width="4"/><g transform="translate(-60 46)">${miniRab}</g><g transform="translate(70 46)">${miniFox}</g>${Array.from({ length: 8 }, (_, i) => `<g transform="translate(${-40 + i * 12} 30)"><g style="--dx:${(i - 4) * 18}px;--dy:${-60 - (i % 3) * 20}px;${an({ n: 'splashd', d: 0.8, t: 9.6 + (i % 2) * 0.6, c: 2, f: 'both' })}"><circle r="7" fill="#4fb3ff" stroke="${INK}" stroke-width="2"/></g></g>`).join('')}`) +
  vign(11.8, 14.95, `<g transform="translate(0 -10)"><g style="transform-origin:0 -60px;${an({ n: 'ring', d: 0.12, t: 11.9, c: 20, dir: 'alternate' })}"><path d="M-50 30 Q-50 -60 0 -64 Q50 -60 50 30Z" fill="#ffd23f" stroke="${INK}" stroke-width="5"/><rect x="-60" y="26" width="120" height="16" rx="8" fill="#e8b400" stroke="${INK}" stroke-width="4"/><circle cy="50" r="12" fill="#e8b400" stroke="${INK}" stroke-width="4"/></g></g><text x="80" y="-27" class="sfx" style="font-size:30px;fill:#e8434e" transform="rotate(-8)">DRING</text>`);

// ───────── Rouge-Gorge endormi sur le rebord ─────────
const sleepyBird = `<g transform="translate(990 262) scale(1.2)">${bird(false, false)}${vis(15.2, 99, `<circle cx="-18" cy="-8" r="12" fill="#e8434e"/><path d="M-26 -10 q6 4 12 0" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M-2 -8 Q14 -22 28 -6 Q12 2 -2 0Z" fill="#b8232d" stroke="${INK}" stroke-width="2.5"/>`)}</g>` + zzz(970, 250, 15.2, 18, [0, 1.5]).replace(/fill:#9fb3ff/g, 'fill:#DDE3FF').replace(/fill:#9fb3ff/g, 'fill:#E8ECFF');

const lidEye = (cx, cy, r, id, pct) => `<clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><rect clip-path="url(#${id})" x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${(2 * r * pct).toFixed(1)}" fill="#f1eff7" stroke="${INK}" stroke-width="3"/>`;
const lids = [[19.3, 19.6, 0.3], [19.6, 19.8, 0.6], [19.8, 19.95, 0.85]].map(([a, b, p], i) => vis(a, b, `<defs>${''}</defs>${lidEye(827, 468, 19, 'lidL' + i, p)}${lidEye(774, 468, 19, 'lidR' + i, p)}`)).join('');
const dim = `<rect x="-200" y="-200" width="1700" height="1200" fill="#0b1030" opacity=".28"/>`;
const world = `${room}${bedBack}${mattress}${nightstand}${sleepyBird}
  ${foxBed}${blanket(110, 590, 360, '#7cc8ff')}<g style="${an({ n: 'giggle', d: 0.13, t: 12.4, c: 12, dir: 'alternate' })}">${rabBed}</g>${blanket(BED.x + 26, BED.y + 45, BED.w - 52, '#ff8fb1')}
  ${dim}
  ${dream}
  ${zzz(480, 410, 24.0, 28)}${zzz(875, 330, 24.7, 28)}`;

const fin = vis(27.2, 99, `<g style="transform-origin:600px 115px;${an({ n: 'finin', d: 0.4, t: 27.2, f: 'both' })}"><g transform="translate(600 115)">
  <rect x="-270" y="-75" width="540" height="150" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-18" class="sfx" style="font-size:42px;fill:#e8434e">Roussin &amp; Lino — Fin</text>
  <text y="44" class="bt" style="font-size:32px;fill:#2b5ba8">Bonne nuit, les amis !</text></g></g>`);

const FM = [435, 528], RM = [785, 510];
const tipAt = (who, t, dx, dy) => { const m = scr(...(who === 'fox' ? FM : RM), t); return { bx: m[0] + dx, by: m[1] + dy, tips: [[m[0], m[1] - 20]] }; };
const fx =
  say('rab', 'Roussin ? Tu dors ?', 0.6, 1.7, { bx: 560, by: 300, fs: 28, tips: [[790, 480]] }) +
  say('fox', 'Pas encore. Quelle belle journée !', 3.8, 2.5, { bx: 930, by: 220, fs: 26, tips: [[785, 505]] }) +
  sfx('SPLASH !', 650, 230, 9.8, 0.9, -8, '#4fb3ff', 34, 'splash') +
  say('rab', 'Et la flaque !', 12.4, 1.8, { bx: 1035, by: 445, fs: 34, tips: [[905, 540]] }) +
  say('rab', 'Bonne nuit, Roussin.', 18.3, 1.0, { bx: 880, by: 196, tips: [[650, 420]] }) +
  say('fox', 'Bonne nuit, Lino.', 21.3, 1.6, { bx: 1100, by: 220, tips: [[775, 505]] }) +
  fin;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#3c4886"/>
<g style="${camStyle}">${world}</g>
${timeBadge(20, 30)}
${fx}
</svg>`;
sfxEv.push({ name: 'chirp', t: 7.3 }, { name: 'handbell', t: 11.9 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./dodo.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 80, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
