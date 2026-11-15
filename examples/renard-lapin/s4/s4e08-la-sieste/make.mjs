// Roussin & Lino · Saison 4 · Épisode 8 « La sieste » — 30 s, 1280x720. 13h30, le chalet.
//
// Découpage :
//  0.0– 3.5  plan large     Mamie Marmotte : « C'est l'heure de la sieste ! » ; Roussin et Lino sur leurs matelas
//  3.5– 5.6  Lino            « L'horloge m'empêche de dormir. »
//  5.6– 7.0  l'horloge       TIC TAC
//  7.0–11.5  Lino            il compte les moutons (nuage de rêve) : « Un mouton... deux moutons... »
// 11.5–16.5  Roussin         il ronfle (RRONF), les moutons s'enfuient ; « Roussin ! Tu ronfles fort ! »
// 16.5–20.0  Lino            « Bon... je dors aussi. » — il s'endort
// 20.0–24.0  plan large     tous dorment, Zzz ; Mamie Marmotte bâille
// 24.0–27.0  Mamie          elle se lève, vient les border : « Dormez bien, mes petits. »
// 27.0–30.0  carton « Saison 4 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { marmot } from '../../lib/cast4.mjs';
import { chaletInside, mat, sheep, woodFence } from '../../lib/snow.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.5, 640, 420, 1.0, 1.04],
  [3.5, 5.6, 870, 520, 1.6, 1.65],
  [5.6, 7.0, 640, 190, 2.2, 2.25],
  [7.0, 11.5, 700, 400, 1.25, 1.25],
  [11.5, 16.5, 520, 540, 1.25, 1.25],
  [16.5, 20.0, 850, 540, 1.6, 1.6],
  [20.0, 24.0, 640, 420, 1.0, 1.0],
  [24.0, 27.0, 640, 440, 1.15, 1.15],
  [27.0, 30, 640, 420, 1.05, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes snore{0%,100%{transform:scale(1)}50%{transform:scale(1.04,1.07)}}
@keyframes tic{from{transform:rotate(-8deg)}to{transform:rotate(8deg)}}`);
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
const zz = (x, y, t0, t1, fs = 44) => { const out = []; for (let t = t0, i = 0; t < t1; t += 1.5, i++) out.push(vis(t, t + 1.4, `<g transform="translate(${x + (i % 2) * 14} ${y})"><g style="${an({ n: 'c4zzz', d: 1.4, t, f: 'both' })}"><text class="sfx" style="font-size:${fs}px;fill:#9fb3ff;stroke:#1d2550;stroke-width:3;paint-order:stroke">Z z z</text></g></g>`)); return out.join(''); };

// ───────── décor ─────────
const AXIS = 620, GR = 684;
const room = chaletInside({ h: 1, m: 30, view: 'snow', fire: true });
const mats = `${mat(305, GR, 1.3, { col: '#7cc8ff' })}<g transform="translate(725 ${GR}) scale(-1 1)">${mat(0, 0, 1.3, { col: '#ff8fb1' }).replace('translate(0 0)', '')}</g>`;
const chairBack = `<g><rect x="1000" y="430" width="210" height="210" rx="40" fill="#b04a3a" stroke="${INK}" stroke-width="6"/><rect x="1030" y="460" width="150" height="120" rx="26" fill="#c9604d"/></g>`;
const chairFront = `<g><rect x="990" y="590" width="230" height="70" rx="22" fill="#c9604d" stroke="${INK}" stroke-width="6"/><rect x="980" y="540" width="40" height="120" rx="18" fill="#b04a3a" stroke="${INK}" stroke-width="6"/><rect x="1190" y="540" width="40" height="120" rx="18" fill="#b04a3a" stroke="${INK}" stroke-width="6"/><rect x="995" y="656" width="22" height="30" fill="#8a5a33" stroke="${INK}" stroke-width="4"/><rect x="1195" y="656" width="22" height="30" fill="#8a5a33" stroke="${INK}" stroke-width="4"/></g>`;

// ───────── personnages ─────────
const foxEl = `<g transform="translate(430 ${AXIS}) rotate(-90)">${fox({ run: null, upright: 0, noShadow: true, noBag: true,
  talk: [],
  eyes: [[0, 3.0, 'side'], [3.0, 30, 'shut']],
  moods: [[0, 11.8, 'calm'], [11.8, 16.5, 'yawnbig'], [16.5, 30, 'calm']] })}</g>`;
const foxSnore = `<g style="transform-origin:430px ${AXIS}px;${an({ n: 'snore', d: 0.7, t: 11.8, c: 7, e: 'ease-in-out' })}">${foxEl}</g>`;
const rabEl = `<g transform="translate(600 ${AXIS}) rotate(90) scale(-1 1)">${rabbit({ run: null, noShadow: true, noBag: true,
  talk: [[3.6, 5.2], [7.2, 9.1], [9.7, 11.3], [13.0, 14.8], [16.8, 18.2]],
  eyes: [[0, 3.5, 'arc'], [3.5, 5.8, 'side'], [5.8, 13.0, 'wide'], [13.0, 16.5, 'side'], [16.5, 18.3, 'down'], [18.3, 30, 'shut']],
  moods: [[0, 16.8, 'calm'], [16.8, 18.3, 'happy'], [18.3, 30, 'calm']] })}</g>`;
const marmotEl = (() => {
  const m = put(1090, 650, 0.9, marmot([[0.5, 2.8], [24.4, 26.2]], { noShadow: true, moods: [[21.2, 23.0, 'yawnbig']], eyes: [[21.2, 23.0, 'shut']], lids: true }), true);
  const walk = (t) => ({ x: -105 * ss(Math.min(1, Math.max(0, (t - 23.2) / 0.9))), y: 0 });
  return track(m, 0, DUR, walk, 15);
})();

// ───────── le rêve de Lino : moutons qui sautent la barrière ─────────
const CX = 800, CY = 320;
const cloud = vis(7.0, 11.6, `<g transform="translate(${CX} ${CY})">${[[-190, 40, 70], [-110, -40, 90], [0, -70, 100], [110, -40, 90], [190, 40, 70], [90, 70, 80], [-80, 70, 80]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f4f0ff" stroke="${INK}" stroke-width="5"/>`).join('')}<ellipse rx="230" ry="100" fill="#f4f0ff"/></g>${[[600, 400, 14], [640, 430, 10], [685, 452, 7]].map(([x, y, r]) => `<circle cx="${x + 120}" cy="${y + 20}" r="${r}" fill="#f4f0ff" stroke="${INK}" stroke-width="3"/>`).join('')}`);
const fence = vis(7.0, 11.6, woodFence(CX, CY + 80, 0.9));
const hopper = (t) => mover(sheep(0, 0, 0.7), [[t, CX - 190, CY + 78, 0, 1], [t + 0.35, CX - 80, CY + 78, 0, 1], [t + 0.7, CX, CY - 20, -10, 1], [t + 1.05, CX + 80, CY + 78, 10, 1], [t + 1.5, CX + 190, CY + 78, 0, 1]]);
const dream = cloud + fence + [7.3, 8.5, 9.8, 11.0].map((t) => hopper(Math.min(t, 10.0))).slice(0, 0).join('') + [7.3, 8.6, 9.9].map((t) => hopper(t)).join('');
const scatter = vis(11.5, 12.6, `<g transform="translate(${CX} ${CY})">${[0, 1, 2].map((i) => `<g style="--dx:${(i - 1) * 160}px;${an({ n: 'splashd', d: 1.0, t: 11.6, f: 'both' })}"><circle r="30" fill="#fff" stroke="${INK}" stroke-width="4"/></g>`).join('')}</g>`);
addKF(`@keyframes splashd{0%{opacity:1;transform:translate(0,0)}100%{opacity:0;transform:translate(var(--dx),-120px)}}`);
const clockShake = vis(5.6, 7.0, `<g transform="translate(640 150)"><g style="transform-origin:0 0;${an({ n: 'tic', d: 0.25, t: 5.6, c: 6, dir: 'alternate' })}"><circle r="62" fill="none" stroke="#3b82f6" stroke-width="3" opacity=".6"/></g></g>`);

const world = `${room}${mats}${chairBack}${foxEl.length ? vis(0, 11.8, foxEl) + vis(11.8, 16.6, foxSnore) + vis(16.6, 99, foxEl) : ''}${rabEl}${marmotEl}${chairFront}${dream}${scatter}${clockShake}${zz(300, 560, 4.5, 11.5, 40)}${zz(300, 560, 16.5, 28, 40)}${zz(780, 560, 19.0, 28, 40)}`;

// ───────── espace écran ─────────
const MM = [1060, 640 - 215], RM = [748, 540], FM = [280, 540];
const tip = (m, t, dx = 0, dy = 0) => { const p = scr(m[0], m[1], t); return [p[0] + dx, p[1] + dy]; };
const pill = timeBadge(13, 30);
const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.45, t: 27.2, f: 'both' })}"><g transform="translate(640 200)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 4</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">La sieste</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : les raquettes</text></g></g>`;
const fx = pill +
  say('marmot', 'C’est l’heure de la sieste !', 0.5, 2.4, { bx: 860, by: 240, tips: [tip(MM, 0.5, -10, -20)] }) +
  say('rab', 'L’horloge m’empêche de dormir.', 3.6, 1.8, { bx: 760, by: 190, tips: [tip(RM, 3.6, 0, -10)] }) +
  sfx('TIC', 560, 300, 5.7, 0.6, -8, '#ffd23f', 70, 'click') + sfx('TAC', 760, 300, 6.3, 0.6, 8, '#ffd23f', 70, 'click') +
  say('rab', 'Un mouton... deux moutons...', 7.2, 2.2, { bx: 656, by: 250, tips: [tip(RM, 7.2, 0, -10)] }) +
  say('rab', 'Trois moutons... quatre...', 9.7, 1.7, { bx: 656, by: 250, tips: [tip(RM, 9.7, 0, -10)] }) +
  sfx('RRONF !', 300, 360, 12.0, 1.0, -6, '#ffffff', 90, 'yawn') + sfx('RRONF !', 330, 330, 14.0, 1.0, 5, '#ffffff', 90) +
  say('rab', 'Roussin ! Tu ronfles fort !', 13.0, 1.8, { bx: 740, by: 260, tips: [tip(RM, 13.0, 0, -10)], shout: false }) +
  say('fox', 'Un croissant... encore un...', 14.9, 1.5, { bx: 330, by: 330, tips: [tip(FM, 14.9, 0, -10)] }) +
  say('rab', 'Bon... je dors aussi.', 16.8, 1.5, { bx: 900, by: 270, tips: [tip(RM, 16.8, 0, -10)] }) +
  sfx('HAAAH', 1000, 230, 21.3, 1.5, -5, '#ffffff', 60) +
  say('marmot', 'Dormez bien, mes petits.', 24.4, 2.0, { bx: 800, by: 250, tips: [tip([985, 640 - 215], 24.4, -10, -20)] }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#c98a4e"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'chime', t: 0.3 }, { name: 'step', t: 23.3 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./la-sieste.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 88, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
