// Roussin & Lino · Saison 2 · Épisode 9 « Le pont » — 30 s, 1280x720. 13h45, la planche au-dessus de la mare.
//
// Découpage :
//  0.0– 3.5  plan large     le panneau dit 13 h 45 ; Lino : « Il est 13 h 45 ! » ; Mme Escargot avance sur la planche, très lentement
//  3.5– 7.0  la planche      Mme Escargot : « Bonjour, mes chéris ! » — Lino : « On est pressés, madame ! »
//  7.0–10.0  les enfants     Mme Escargot : « Doucement, mon lapin. » — Roussin : « Pas de panique, Lino. »
// 10.0–13.0  Lino            il consulte sa montre, s'impatiente : « Je passe par-dessus ! »
// 13.0–16.2  le vacillement  il avance les yeux sur la montre : la planche tremble, il vacille, bras en moulinet ; Roussin : « Attention ! »
// 16.2–18.5  le saut          Lino bondit par-dessus la coquille et se réceptionne de l'autre côté
// 18.5–22.0  Lino/escargot    Mme Escargot : « Tout vient à point ! » — Lino regarde sa montre : « Il est 14 h 00 ! »
// 22.0–27.0  plan large     Mme Escargot n'a avancé que de quelques pas ; Roussin s'endort : « Réveillez-moi à l'arrivée ! »
// 27.0–30.0  carton « Saison 2 »
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, shake, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say, snail } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { farmBg, pond, GROUND } from '../../lib/farm.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.5, 640, 420, 1.0, 1.06],
  [3.5, 7.0, 600, 440, 1.7, 1.75],
  [7.0, 10.0, 560, 440, 1.55, 1.6],
  [10.0, 13.0, 480, 450, 1.9, 1.95],
  [13.0, 16.2, 600, 450, 1.6, 1.65],
  [16.2, 18.5, 650, 430, 1.5, 1.5],
  [18.5, 22.0, 800, 440, 1.7, 1.75],
  [22.0, 27.0, 640, 420, 1.1, 1.0],
  [27.0, 30, 640, 420, 1.0, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}`);

const lerp = (a, b, u) => a + (b - a) * u;
const mover = (inner, pts) => {
  const t0 = pts[0][0], t1 = pts[pts.length - 1][0];
  const fn = (t) => {
    let i = 0; while (i < pts.length - 2 && t > pts[i + 1][0]) i++;
    const [a, xa, ya, ra = 0, sa = 1] = pts[i], [b, xb, yb, rb = 0, sb = 1] = pts[i + 1];
    const u = ss(Math.min(1, Math.max(0, (t - a) / (b - a))));
    return { x: lerp(xa, xb, u), y: lerp(ya, yb, u), r: lerp(ra, rb, u), s: lerp(sa, sb, u) };
  };
  return vis(t0, t1, track(inner, t0, t1, fn, 30));
};

// ───────── décor : mare, planche, panneau-horloge ─────────
const PY = 560; // dessus de la planche
const signAt = (h, m, t0, t1) => vis(t0, t1, `<g transform="translate(1195 ${GROUND + 6})"><rect x="-8" y="-230" width="16" height="236" rx="5" fill="#9b6a3c" stroke="${INK}" stroke-width="5"/>
  <rect x="-92" y="-340" width="184" height="190" rx="18" fill="#e8c590" stroke="${INK}" stroke-width="6"/>
  <g transform="translate(0 -268) scale(.9)">${wallClock(h, m, 0, 0)}</g></g>`);
const bg = `${farmBg({ sunny: true, withFence: false })}${pond(640, 612, 1.7, { ripples: [[0, -150, 20], [1.4, 160, 30], [2.6, 20, 34]] })}${signAt(13, 45, 0, 99)}`;
const plank = `<g><rect x="190" y="${PY + 44}" width="40" height="40" rx="6" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><rect x="1050" y="${PY + 44}" width="40" height="40" rx="6" fill="#8a5a33" stroke="${INK}" stroke-width="5"/>
  <rect x="170" y="${PY}" width="940" height="30" rx="10" fill="#d99a5e" stroke="${INK}" stroke-width="6"/>
  <path d="M220 ${PY + 12} h120 M420 ${PY + 18} h160 M650 ${PY + 11} h110 M840 ${PY + 18} h150" stroke="#b97a3e" stroke-width="4" stroke-linecap="round"/>
  <circle cx="260" cy="${PY + 15}" r="4" fill="#8a5a33"/><circle cx="1020" cy="${PY + 15}" r="4" fill="#8a5a33"/></g>`;

// ───────── personnages ─────────
const watch = `<g transform="translate(12 6) scale(1.0)"><circle r="19" fill="#ffd23f" stroke="${INK}" stroke-width="4"/><circle r="14" fill="#fff"/>
  <line x1="0" y1="0" x2="0" y2="-11" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><line x1="0" y1="0" x2="7" y2="2" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/><circle r="2" fill="#e8434e"/></g>`;
const watchItem = [[0.4, 2.6], [10.6, 16.0], [20.2, 22.4]].map(([a, b]) => vis(a, b, watch)).join('');

const foxEl = put(270, PY + 4, 1.0, fox({ run: null, upright: -8, noShadow: false,
  talk: [[9.5, 10.8], [13.6, 14.5], [23.6, 26.0]],
  eyes: [[0, 3, 'side'], [13.4, 16.4, 'wide'], [16.4, 18.5, 'arc'], [22.8, 23.6, 'down'], [23.6, 30, 'closed']],
  moods: [[9.4, 10.9, 'happy'], [13.4, 16.4, 'panic'], [16.4, 18.5, 'happy'], [22.8, 30, 'happy']], blush: [[23.6, 26]] }));

const rabPts = [[0, 430, PY + 4], [10.9, 430, PY + 4], [12.0, 500, PY + 4, 0], [13.6, 500, PY + 4, 0]];
let tt = 13.6; [-12, 12, -14, 14, -10, 10, -6].forEach((r, i) => { tt += 0.32; rabPts.push([+tt.toFixed(2), 500, PY + 4, r]); });
rabPts.push([15.9, 500, PY + 4, 0], [16.9, 790, PY + 4, 0], [30, 790, PY + 4, 0]);
const rabEl = mover(put(0, 0, 1.0, rabbit({ runExtra: [[11.0, 12.0]], jumps: [[15.95, 16.9, 190]], item: watchItem, shiver: [13.6, 15.8], sweatWin: [13.6, 16.4], jolt: [16.95],
  talk: [[0.6, 2.2], [5.6, 7.2], [11.1, 12.5], [14.4, 15.6], [20.4, 22.0]],
  eyes: [[0.4, 2.6, 'down'], [5.4, 7.4, 'side'], [10.6, 16.2, 'down'], [16.2, 17.0, 'wide'], [17.2, 18.6, 'arc'], [20.2, 22.4, 'wide']],
  moods: [[0.4, 2.4, 'panic'], [5.4, 7.4, 'panic'], [11.0, 12.6, 'panic'], [13.6, 16.5, 'oh'], [17.2, 18.6, 'happy'], [20.2, 22.4, 'oh']] })), rabPts);

const snailEl = mover(`<g transform="translate(0 0)"><g style="transform-origin:0 0;animation:crawl 2.4s ease-in-out infinite">${put(0, 0, 0.55, snail([[3.7, 5.3], [7.5, 9.2], [18.5, 20.0]]))}</g></g>`, [[0, 810, PY + 6], [30, 520, PY + 6]]);

const zzz = [0, 1.5, 3.0].map((d) => vis(24.2 + d, 24.2 + d + 1.4, `<g transform="translate(400 300)"><g style="${an({ n: 'zzz', d: 1.4, t: 24.2 + d, f: 'both' })}"><text class="sfx" style="font-size:40px;fill:#fff;stroke-width:6">Z z z</text></g></g>`)).join('');
const piqEl = put(1010, PY + 4, 0.85, hedgehog([[22.3, 23.5]], { eyes: [[0, 22, 'side'], [22, 30, 'arc']], moods: [[0, 30, 'happy']] }));
const world = `${bg}${shake(`${plank}${piqEl}${foxEl}${snailEl}${rabEl}`, 13.7, 2.2, 4)}${zzz}`;

// ───────── espace écran ─────────
// M = point du monde juste au-dessus de la tête ; dx/dy décalent la bulle, la pointe vise M
const B = (who, text, t0, dur, getM, { dx = 0, dy = 0, shout = false, fs } = {}) => {
  const m = getM(t0 + 0.2), p = scr(m[0], m[1], t0 + 0.2);
  return say(who, text, t0, dur, { bx: p[0] + dx, by: p[1] - 80 + dy, tips: [[p[0], p[1] - 10]], shout, fs });
};
const snailX = (t) => lerp(810, 520, ss(t / 30));
const MS = (t) => [snailX(t) - 40, PY - 150];
const MF = () => [350, PY - 255];
const MR = (t) => [t < 10.9 ? 430 : t < 16.0 ? 500 : 790, PY - 315];
const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.45, t: 27.2, f: 'both' })}"><g transform="translate(640 130)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 2</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">Le pont</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : l'orage</text></g></g>`;
const fxs =
  B('rab', 'Il est tard ! Vite !', 0.6, 1.6, MR, { dx: 20, dy: -10 }) +
  B('snail', 'Bonjour, mes chéris !', 3.7, 1.6, MS, { dx: 20, dy: -10 }) +
  B('rab', 'On est pressés, madame !', 5.6, 1.7, MR, { dx: -40, dy: 0 }) +
  B('snail', 'Doucement, mon lapin.', 7.5, 1.7, MS, { dx: 40, dy: 0 }) +
  B('fox', 'Pas de panique, Lino.', 9.5, 1.4, MF, { dx: -40, dy: 0 }) +
  B('rab', 'Je passe par-dessus !', 11.1, 1.5, MR, { dx: 30, dy: 0, shout: true }) +
  sfx('CRRRIC', 620, 250, 13.8, 0.9, -6, '#ffd23f', 56, 'boing') +
  B('fox', 'Attention !', 13.6, 0.9, MF, { dx: -30, dy: 20, shout: true }) +
  B('rab', 'Je vais tomber !', 14.5, 1.1, MR, { dx: 20, dy: 0, shout: true }) +
  sfx('BOING !', 640, 200, 16.0, 0.8, 6, '#ffd23f', 70) +
  B('snail', 'Tout vient à point !', 18.5, 1.5, MS, { dx: -60, dy: -10 }) +
  B('rab', 'On a perdu du temps !', 20.4, 1.6, MR, { dx: 20, dy: -10 }) +
  B('hedge', 'Je vous attends ici !', 22.1, 1.4, () => [964, PY - 160], { dx: -60, dy: 0 }) +
  B('fox', 'Réveillez-moi à l\'arrivée !', 23.6, 2.4, MF, { dx: 40, dy: -10 }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#7cc8ff"/>
<g style="${camStyle}">${world}</g>
${timeBadge(13, 45)}
${fxs}
</svg>`;
sfxEv.push({ name: 'chime', t: 0.3 }, { name: 'step', t: 11.2 }, { name: 'step', t: 11.6 }, { name: 'whoosh', t: 15.95 }, { name: 'boing', t: 16.9 },
  { name: 'yawn', t: 23.5 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./pont.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 90, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
