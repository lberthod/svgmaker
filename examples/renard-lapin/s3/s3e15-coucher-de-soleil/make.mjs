// Roussin & Lino · Saison 3 · Épisode 15 « Coucher de soleil » — 30 s, 1280x720. 20h30, la plage vide, le feu. Fin de la saison.
//
// Découpage :
//  0.0– 3.5  plan large     pastille 20 h 30, le feu ; Roussin : « Quelle belle journée ! »
//  3.5– 7.0  Piquette        « Le soleil se couche. »
//  7.0–11.0  l'horizon       le soleil glisse vers la mer ; Lino : « Il plonge dans l'eau ! »
// 11.0–15.0  la bouteille    elle atterrit près du feu ; Roussin : « Une bouteille arrive ! »
// 15.0–19.0  Lino            « Une lettre de Mme Chouette ! » le papier se déroule : « Bonne nuit »
// 19.0–23.0  Roussin         « Elle dit : bonne nuit ! » — Piquette : « Bonne nuit, la mer ! », bâillements
// 23.0–26.0  plan large     Bidule traverse la plage de côté
// 26.0–30.0  Bidule         s'arrête : « Moi, je vais tout droit ! » ; carton « Fin de la saison 3 »
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { crab, otter } from '../../lib/cast3.mjs';
import { campfire, splash } from '../../lib/farm.mjs';
import { sunsetBg, bottle } from '../../lib/sea.mjs';
import { timeBadge } from '../../lib/badge.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.5, 560, 420, 1.3, 1.34],
  [3.5, 7.0, 560, 430, 1.4, 1.45],
  [7.0, 11.0, 640, 330, 1.15, 1.15],
  [11.0, 15.0, 600, 430, 1.4, 1.4],
  [15.0, 19.0, 600, 400, 1.35, 1.38],
  [19.0, 23.0, 560, 430, 1.4, 1.42],
  [23.0, 26.0, 640, 400, 1.0, 1.0],
  [26.0, 30, 640, 400, 1.0, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes dimk{from{opacity:0}to{opacity:.3}}`);

const lerp = (a, b, u) => a + (b - a) * u;
const pathFn = (pts) => (t) => {
  let i = 0; while (i < pts.length - 2 && t > pts[i + 1][0]) i++;
  const [a, xa, ya, ra = 0, sa = 1] = pts[i], [b, xb, yb, rb = 0, sb = 1] = pts[i + 1];
  const u = ss(Math.min(1, Math.max(0, (t - a) / (b - a))));
  return { x: lerp(xa, xb, u), y: lerp(ya, yb, u), r: lerp(ra, rb, u), s: lerp(sa, sb, u) };
};
const mover = (inner, pts) => vis(pts[0][0], pts[pts.length - 1][0], track(inner, pts[0][0], pts[pts.length - 1][0], pathFn(pts), 30));

// ───────── personnages ─────────
const SC = 0.9, FY = 600;
const HX = 260, FX = 470, FIRE = 660, RX = 850, BTL = 990;
const yawn = (a, b) => [a, b, 'yawn'];
const foxEl = put(FX, FY, SC, fox({ run: null, upright: -6, noShadow: true, noBag: true,
  talk: [[0.7, 2.4], [11.4, 13.0], [19.1, 20.8]],
  eyes: [[0, 3.5, 'arc'], [11.2, 14.0, 'wide'], [15.0, 19.0, 'side'], [19.0, 21.0, 'arc'], [22.6, 30, 'closed']],
  moods: [[0, 3.5, 'happy'], [11.2, 14.0, 'oh'], [19.0, 22.4, 'happy'], yawn(22.4, 24.6), [24.6, 30, 'calm']] }));
const rabEl = put(RX, FY, SC, rabbit({ run: null, noBag: true, noShadow: true,
  talk: [[7.1, 8.6], [15.4, 17.6]],
  eyes: [[0, 7, 'arc'], [7.0, 9.0, 'wide'], [15.2, 17.8, 'wide'], [19.0, 22.4, 'arc'], [22.6, 30, 'closed']],
  moods: [[7.0, 9.0, 'oh'], [15.2, 17.8, 'happy'], [19.0, 22.4, 'happy'], yawn(22.6, 24.8), [24.8, 30, 'calm']] }), true);
const hedgeEl = put(HX, FY + 4, SC, hedgehog([[3.6, 5.4], [21.8, 23.2]], { noShadow: true,
  eyes: [[0, 3.5, 'side'], [3.6, 5.6, 'arc'], [21.6, 23.4, 'arc'], [23.6, 30, 'closed']],
  moods: [[3.6, 5.6, 'happy'], [21.6, 23.4, 'happy'], [23.4, 30, 'calm']] }));
const otterEl = vis(23.0, 99, put(1180, FY, 0.8, otter([[24.0, 25.6]], { noShadow: true, whistle: [[23.2, 23.8]],
  eyes: [[23.0, 30, 'arc']], moods: [[23.0, 30, 'happy']] }), true));
const fire = campfire(FIRE, FY + 14, 0.8);

// ───────── bouteille : arrive sur la mousse ─────────
const btlFly = mover(bottle(0, 0, 0.9), [[11.0, 1170, 420, -140], [11.6, 1070, 500, 40], [12.1, BTL + 4, 608, 0]]);
const btlFull = vis(12.1, 15.2, bottle(BTL, 608, 0.9));
const btlEmpty = vis(15.2, 99, bottle(BTL, 608, 0.9, { scroll: false }));
const btlSplash = vis(11.9, 13.2, splash(BTL + 40, 600, 11.9, 1.0, 9));

// ───────── Bidule traverse ─────────
const CRAB_Y = 668, CSC = 0.8;
const crabPath = [[23.2, -160, CRAB_Y], [26.0, 1130, CRAB_Y], [27.9, 1135, CRAB_Y], [29.8, 1470, CRAB_Y]];
const crabEl = mover(`<g transform="scale(${CSC})">${crab([[26.3, 27.8]], { noShadow: true, walk: [[23.2, 26.0], [27.9, 29.8]], pinch: [[26.6, 27.4]],
  eyes: [[26.0, 28.0, 'wide']], moods: [[26.0, 30, 'happy']] })}</g>`, crabPath);

// ───────── décor, nuit qui tombe, pastille, papier ─────────
const world = `${sunsetBg(2, 14, { drop: 170, shells: false })}${fire}${hedgeEl}${foxEl}${rabEl}${otterEl}${btlFly}${btlFull}${btlEmpty}${btlSplash}${crabEl}`;
const dim = vis(12, 99, `<rect width="${W}" height="${H}" fill="#1d1b52" style="${an({ n: 'dimk', d: 14, t: 12, f: 'both' })}"/>`);
const hud = timeBadge(20, 30);
const letter = vis(16.2, 21.0, `<g style="transform-origin:1040px 135px;${an({ n: 'cardk', d: 0.5, t: 16.2, f: 'both', e: 'cubic-bezier(.2,1.6,.4,1)' })}"><g transform="translate(1040 135) rotate(-4)">
  <rect x="-170" y="-76" width="340" height="152" rx="14" fill="#fff4d6" stroke="${INK}" stroke-width="6"/><path d="M-170 -76 q-24 38 0 76 q-24 38 0 76" fill="none" stroke="#e8c590" stroke-width="10" stroke-linecap="round"/>
  <text y="6" class="bt" style="font-size:52px;fill:#2b5ba8">Bonne nuit</text><text y="52" class="bt" style="font-size:26px;fill:#7a6a5a">Mme Chouette</text></g></g>`);

// ───────── bulles ─────────
const HM = { fox: [FX + 30, FY - 215], rab: [RX - 24, FY - 262], hed: [HX + 46, FY - 150] };
const tip = (k, t) => scr(...HM[k], t);
const sy = (who, text, t0, d, k, by, dx = 0, o = {}) => { const tp = tip(k, t0); return say(who, text, t0, d, { bx: tp[0] + dx, by, tips: [tp], ...o }); };
const cx = pathFn(crabPath)(26.5);
const crabTip = scr(cx.x, CRAB_Y - 0.8 * 125, 26.5);
const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.3, t: 26.9, f: 'both' })}"><g transform="translate(640 130)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 3</text>
  <text y="22" class="bt" style="font-size:36px;fill:#2b5ba8">Fin de la saison 3</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Coucher de soleil · bonne nuit, les amis !</text></g></g>`;
const fx = hud + letter +
  sy('fox', 'Quelle belle journée !', 0.7, 2.2, 'fox', 130, 40) +
  sy('hedge', 'Le soleil se couche.', 3.7, 2.2, 'hed', 150, 120) +
  sy('rab', 'Il plonge dans l’eau !', 7.1, 2.0, 'rab', 110, -120) +
  sy('fox', 'Une bouteille arrive !', 11.4, 2.0, 'fox', 130, 60) +
  sfx('SPLASH !', 1000, 420, 11.9, 0.8, 6, '#4fb3ff', 54) +
  sy('rab', 'Une lettre de Mme Chouette !', 15.4, 2.4, 'rab', 230, -450) +
  sy('fox', 'La lettre dit : bonne nuit !', 19.1, 2.0, 'fox', 130, -60) +
  sy('hedge', 'Bonne nuit, la mer !', 21.8, 1.6, 'hed', 150, 140) +
  sfx('PIIIT !', 960, 330, 23.2, 0.7, -6, '#ffd23f', 60, 'click') +
  say('otter', 'Bonne nuit, les amis !', 24.0, 1.6, { bx: 930, by: 250, tips: [[1180, 380]] }) +
  say('crab', 'Moi, je vais tout droit !', 26.3, 1.7, { bx: 780, by: 250, tips: [[crabTip[0], crabTip[1]]] }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#5c4a9c"/>
<g style="${camStyle}">${world}</g>
${dim}
${fx}
</svg>`;
sfxEv.push({ name: 'wave', t: 0.3 }, { name: 'wave', t: 7.2 }, { name: 'whoosh', t: 11.0 }, { name: 'splash', t: 11.9 }, { name: 'poof', t: 15.3 },
  { name: 'chime', t: 16.3 }, { name: 'yawn', t: 22.4 }, { name: 'yawn', t: 22.8 }, { name: 'step', t: 24.0 }, { name: 'chime', t: 26.9 });
writeFileSync(new URL('./coucher-de-soleil.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 84, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
