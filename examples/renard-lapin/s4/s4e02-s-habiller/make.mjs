// Roussin & Lino · Saison 4 · Épisode 2 « S'habiller » — 30 s, 1280x720. 8h00, l'intérieur du chalet.
//
// Découpage :
//  0.0– 3.6  plan large    Mamie Marmotte : « Bonnets, bottes, écharpes ! » ; tout le monde s'habille
//  3.6– 8.2  Roussin       enfile son bonnet : « Mon beau bonnet ! » — il glisse sur ses yeux : « Je ne vois plus rien ! »
//  8.2–11.5  Roussin/Lino  Roussin avance à l'aveugle, cogne Lino : « Hihi ! Il est trop grand ! » (le bonnet remonte)
// 11.5–15.5  les bottes    elles sont sur le mauvais pied : « Mes bottes sont bizarres... » — « Pied gauche, pied droit ! »
// 15.5–23.5  Piquette      pas de gants pour ses piquants ; Mamie Marmotte tricote des moufles en trois secondes
// 23.5–27.0  plan large    tous habillés ; « Dehors, tout le monde ! » — le bonnet retombe sur les yeux
// 27.0–30.0  plan large    carton « Saison 4 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { marmot } from '../../lib/cast4.mjs';
import { chaletInside, mitten, foxBeanie, snowPoof } from '../../lib/snow.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.6, 640, 420, 1.0, 1.05],
  [3.6, 8.2, 360, 420, 1.7, 1.75],
  [8.2, 11.5, 500, 430, 1.6, 1.6],
  [11.5, 15.5, 520, 440, 1.7, 1.7],
  [15.5, 23.5, 960, 440, 1.7, 1.7],
  [23.5, 27.0, 640, 420, 1.0, 1.05],
  [27.0, 30, 640, 420, 1.05, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes knit{from{transform:rotate(-9deg)}to{transform:rotate(9deg)}}`);
const show = (inner, wins) => wins.map(([a, b]) => vis(a, b, inner)).join('');
const lerp = (a, b, u) => a + (b - a) * u;
const mover = (inner, pts) => {
  const t0 = pts[0][0], t1 = pts[pts.length - 1][0];
  const fn = (t) => { let i = 0; while (i < pts.length - 2 && t > pts[i + 1][0]) i++;
    const [a, xa, ya] = pts[i], [b, xb, yb] = pts[i + 1]; const u = ss(Math.min(1, Math.max(0, (t - a) / (b - a)))); return { x: lerp(xa, xb, u), y: lerp(ya, yb, u), r: 0, s: 1 }; };
  return vis(t0, t1, track(inner, t0, t1, fn, 30));
};

const bg = chaletInside({ clock: false, view: 'snow', fire: true });
const pastille = timeBadge(8, 0);

// ───────── accessoires ─────────
const boot = (x, flip, col = '#3b82f6') => `<g transform="translate(${x} 4) scale(${flip ? -.75 : .75} .75)"><path d="M-18 -64 H14 V-24 Q50 -22 54 -4 Q54 6 40 6 H-24 Q-28 6 -28 -4 V-40Z" fill="${col}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><rect x="-22" y="-70" width="40" height="16" rx="6" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M-20 -10 H40" stroke="#fff" stroke-width="4" opacity=".7"/></g>`;
const bootsOn = vis(11.4, 99, `${boot(-34, true)}${boot(30, false)}`);
const bootsOk = vis(15.0, 99, ''); // (bottes inversées jusqu'à la fin : gag visuel)
const knitting = `<g transform="translate(0 0)"><circle cx="0" cy="0" r="22" fill="#e8434e" stroke="${INK}" stroke-width="4"/><path d="M-14 -8 Q0 -16 14 -6 M-16 4 Q0 -4 16 6" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>
  <g style="transform-origin:0px -10px;${an({ n: 'knit', d: 0.18, t: 18.8, c: 14, dir: 'alternate' })}"><line x1="-8" y1="-8" x2="-70" y2="-84" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><line x1="-8" y1="-8" x2="-70" y2="-84" stroke="#ffd23f" stroke-width="4.5" stroke-linecap="round"/></g>
  <g style="transform-origin:0px -10px;${an({ n: 'knit', d: 0.18, t: 18.9, c: 14, dir: 'alternate-reverse' })}"><line x1="8" y1="-8" x2="62" y2="-86" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><line x1="8" y1="-8" x2="62" y2="-86" stroke="#ffd23f" stroke-width="4.5" stroke-linecap="round"/></g></g>`;
const mittensPair = `<g transform="translate(-18 0)">${mitten(0, 0, 1.3, { col: '#ffd23f' })}</g><g transform="translate(40 0)">${mitten(0, 0, 1.3, { col: '#ffd23f' })}</g>`;

// ───────── personnages ─────────
const FY = 600;
const RX = 640, HX = 850, MX = 1140, FX0 = 320, FX1 = 440;
const foxOpt = { run: [8.6, 10.2], upright: -6, noShadow: true, noBag: true, runExtra: [],
  talk: [[4.3, 5.8], [6.3, 7.9], [11.9, 13.4], [24.4, 26.2]],
  hat: [[4.0, 4.6, foxBeanie(0)], [4.6, 5.2, foxBeanie(0.4)], [5.2, 10.6, foxBeanie(1)], [10.6, 24.9, foxBeanie(0.1)], [24.9, 99, foxBeanie(1)]],
  eyes: [[3.7, 5.2, 'arc'], [5.2, 10.6, 'wide'], [10.6, 12.0, 'sq'], [12.0, 14.6, 'down'], [14.6, 24.9, 'arc'], [24.9, 27, 'wide']],
  moods: [[3.7, 5.2, 'happy'], [5.2, 10.6, 'oh'], [10.6, 12.0, 'happy'], [12.0, 14.6, 'sad'], [14.6, 24.9, 'happy'], [24.9, 27, 'oh']],
  blush: [[24.4, 26.2]] };
const walkingFox = mover(`<g transform="translate(0 ${FY})">${fox({ ...foxOpt, run: [8.6, 10.2] })}</g>`, [[3.5, FX0, 0], [8.6, FX0, 0], [10.2, FX1, 0], [10.3, FX1, 0]]).replace('', '');
const foxStill = put(FX0, FY, 1.0, fox({ ...foxOpt, run: null }));
const foxStill2 = put(FX1, FY, 1.0, fox({ ...foxOpt, run: null }) + bootsOn);
// (le mover ci-dessus couvre 3.5–10.3 ; avant : plan large 0–3.6 à FX0)
const foxEl = vis(0, 3.5, foxStill) + walkingFox + show(foxStill2, [[10.3, 15.5], [23.5, 99]]);
const rabEl = put(RX, FY, 1.0, rabbit({ run: null, noBag: true, noShadow: true,
  talk: [[8.4, 10.4], [14.0, 15.6]], eyes: [[0, 8.2, 'arc'], [10.2, 11.0, 'wide'], [8.3, 10.2, 'arc'], [14.0, 15.6, 'arc']],
  moods: [[0, 99, 'happy']], gest: [[14.0, 15.4]] }), true);
const hedgeEl = put(HX, FY, 1.0, hedgehog([[16.5, 18.5], [22.3, 24.2]], { noShadow: true,
  eyes: [[15.8, 18.7, 'sq'], [18.8, 22.0, 'wide'], [22.0, 27, 'arc']], moods: [[15.8, 18.7, 'sad'], [18.8, 22.0, 'oh'], [22.0, 27, 'happy']], blush: [[22.3, 24.2]] }));
const marEl = put(MX, FY, 1.0, marmot([[0.5, 2.5], [18.8, 21.0]], { noShadow: true, gest: [[18.8, 21.2]],
  moods: [[0.4, 2.6, 'happy'], [18.7, 21.2, 'happy']], blush: [[18.8, 21.0]] }), true);

const knit = vis(18.7, 21.5, `<g transform="translate(${MX - 175} ${FY - 96})">${knitting}</g>`);
const mits = vis(21.5, 24.6, `<g transform="translate(${(HX + MX) / 2 - 30} ${FY - 140})"><g style="${an({ n: 'finin', d: 0.4, t: 21.5, f: 'both' })}">${mittensPair}</g></g>`);
const poof = snowPoof((HX + MX) / 2 - 30, FY - 140, 21.5, 0.7);
const world = `${bg}${show(rabEl, [[0, 3.6], [8.2, 15.5], [23.5, 99]])}${show(hedgeEl, [[0, 3.6], [15.5, 99]])}${show(marEl, [[0, 3.6], [15.5, 99]])}${foxEl}${knit}${mits}${poof}`;

// ───────── espace écran ─────────
const foxX = (t) => (t < 8.6 ? FX0 : t < 10.2 ? lerp(FX0, FX1, ss((t - 8.6) / 1.6)) : t < 10.3 ? FX1 : FX1);
const FOXH = (t, dy = -10) => { const p = scr(foxX(t) + 90, FY - 255, t); return [p[0], p[1] + dy]; };
const RABH = (t, dy = -6) => { const p = scr(RX - 55, FY - 300, t); return [p[0], p[1] + dy]; };
const HEDH = (t, dy = -6) => { const p = scr(HX + 40, FY - 215, t); return [p[0], p[1] + dy]; };
const MARH = (t, dy = -10) => { const p = scr(MX - 48, FY - 235, t); return [p[0], p[1] + dy]; };
const endCard = `<g style="transform-origin:640px 150px;${an({ n: 'finin', d: 0.45, t: 27.2, f: 'both' })}"><g transform="translate(640 150)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" text-anchor="middle" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 4</text>
  <text y="22" text-anchor="middle" class="bt" style="font-size:34px;fill:#2b5ba8">S'habiller</text>
  <text y="64" text-anchor="middle" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : le petit-déjeuner</text></g></g>`;
const fx =
  say('marmot', 'Bonnets, bottes, écharpes !', 0.5, 2.2, { bx: 860, by: 170, tips: [MARH(0.6)] }) +
  say('fox', 'Mon beau bonnet !', 4.3, 1.5, { bx: 640, by: 190, tips: [FOXH(4.4)] }) +
  say('fox', 'Je ne vois plus rien !', 6.3, 1.7, { bx: 700, by: 190, tips: [FOXH(6.4)] }) +
  sfx('PLOUF', 1000, 420, 5.2, 0.7, -6, '#ffd23f', 60) +
  say('rab', 'Il est vraiment trop grand !', 8.4, 2.0, { bx: 800, by: 170, tips: [RABH(8.5)] }) +
  sfx('BONK !', 700, 420, 10.1, 0.8, -6, '#ffd23f', 80) +
  say('fox', 'Mes bottes sont bizarres...', 11.9, 1.7, { bx: 740, by: 160, tips: [FOXH(12.0)] }) +
  say('rab', 'Pied gauche, pied droit !', 14.0, 1.6, { bx: 860, by: 190, tips: [RABH(14.1)] }) +
  say('hedge', 'Pas de gants pour moi...', 16.5, 2.0, { bx: 640, by: 170, tips: [HEDH(16.6)] }) +
  say('marmot', 'Un, deux, trois ! Voilà !', 18.8, 2.2, { bx: 1000, by: 170, tips: [MARH(18.9)] }) +
  sfx('CLIC CLIC', 560, 330, 19.0, 2.2, -4, '#ffd23f', 56) +
  say('hedge', 'Mes mains sont au chaud !', 22.3, 1.9, { bx: 640, by: 170, tips: [HEDH(22.4)] }) +
  say('fox', 'Dehors, tout le monde !', 24.4, 1.8, { bx: 760, by: 180, tips: [FOXH(24.5)] }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#c98a4e"/>
<g style="${camStyle}">${world}</g>
${pastille}
${fx}
</svg>`;
sfxEv.push({ name: 'chime', t: 0.3 }, { name: 'poof', t: 5.2 }, { name: 'step', t: 8.8 }, { name: 'step', t: 9.4 }, { name: 'step', t: 10.0 }, { name: 'click', t: 10.1 },
  { name: 'click', t: 19.0 }, { name: 'click', t: 19.6 }, { name: 'click', t: 20.2 }, { name: 'chime', t: 21.5 }, { name: 'laugh', t: 22.3 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./s-habiller.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 110, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
