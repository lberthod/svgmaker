// Roussin & Lino · Saison 3 · Épisode 14 « La pluie de poissons » — 30 s, 1280x720. 18h15, la plage au crépuscule.
//
// Découpage :
//  0.0– 3.5  plan large     pastille 18 h 15 ; Gaston renifle le ciel : « Ce soir, pluie de poissons ! »
//  3.5– 7.0  Roussin & Lino  « Des poissons ? » — « Vite, un parapluie ! »
//  7.0–10.5  Gaston          son panier plein de poissons : « Mon panier ! Mon dîner ! »
// 10.5–14.0  plan large     les premières gouttes, minuscules ; Lino met son seau sur la tête ; « Où sont les poissons ? »
// 14.0–18.0  la roulade     Piquette se met en boule, roule jusqu'au panier, se déplie, dos hérissé : « Je protège ton panier ! »
// 18.0–22.0  la sardine     la pluie se renforce, pic pic sur les piquants ; une sardine en peluche tombe et reste piquée
// 22.0–26.0  plan large     « Merci, Piquette, quel courage ! » — « Avec plaisir, Gaston ! »
// 26.0–30.0  plan large     carton + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { pelican } from '../../lib/cast3.mjs';
import { seaBg, bucket, fish, GROUND } from '../../lib/sea.mjs';
import { timeBadge } from '../../lib/badge.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.5, 640, 400, 1.0, 1.0],
  [3.5, 7.0, 427, 440, 1.5, 1.55],
  [7.0, 10.5, 892, 440, 1.7, 1.72],
  [10.5, 14.0, 640, 400, 1.0, 1.0],
  [14.0, 18.0, 640, 400, 1.0, 1.0],
  [18.0, 22.0, 892, 440, 1.7, 1.72],
  [22.0, 26.0, 788, 430, 1.3, 1.33],
  [26.0, 30, 640, 400, 1.0, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes rainfall{from{transform:translateY(-60px)}to{transform:translateY(800px)}}
@keyframes dimk{from{opacity:0}to{opacity:.24}}`);

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

// ───────── personnages ─────────
const SC = 0.85, FY = 600;
const HX0 = 170, FX = 390, RX = 700, GX = 1160, HX1 = 900, BK = 850;
const bucketHat = `<g transform="translate(54 -192) scale(.5) rotate(180) translate(0 96)">${bucket(0, 0, 1).replace(/<ellipse cy="3"[^>]*>/, '')}</g>`;
const foxEl = put(FX, FY, SC, fox({ run: null, upright: -6, noShadow: true, noBag: true,
  talk: [[5.6, 7.0], [11.4, 12.8]],
  eyes: [[3.6, 7.2, 'wide'], [10.6, 13.6, 'side'], [22.0, 26, 'arc']],
  moods: [[3.6, 7.2, 'oh'], [11.4, 13.0, 'sad'], [22.0, 30, 'happy']] }));
const rabEl = put(RX, FY, SC, rabbit({ run: null, noBag: true, noShadow: true,
  talk: [[3.8, 5.0], [19.8, 21.6]],
  hat: [[10.6, 99, bucketHat]],
  eyes: [[3.6, 5.4, 'wide'], [19.6, 21.8, 'wide'], [22.0, 26, 'arc']],
  moods: [[3.6, 5.4, 'oh'], [19.6, 21.8, 'happy'], [22.0, 30, 'happy']] }), true);
const pelEl = put(GX, FY, SC, pelican([[0.6, 3.0], [7.4, 9.4], [22.0, 24.0]], { noShadow: true, point: [[1.0, 2.6]],
  eyes: [[0, 7, 'open'], [7.2, 10.2, 'wide'], [22.0, 26, 'arc']],
  moods: [[0, 7, 'happy'], [7.2, 10.2, 'sad'], [22.0, 30, 'happy']] }), true);
const mkHedge = () => hedgehog([[16.2, 17.8], [24.2, 25.4]], { noShadow: true, ball: [[13.8, 15.7]], spikes: [[15.8, 22.0]],
  eyes: [[0, 3.5, 'open'], [16.0, 18.0, 'wide'], [18.8, 20.5, 'sq'], [22.0, 26, 'arc']],
  moods: [[16.0, 18.0, 'happy'], [18.8, 20.5, 'panic'], [22.0, 30, 'happy']] });
const hedgeEl = vis(0, 13.8, put(HX0, FY, SC, mkHedge())) +
  mover(`<g transform="scale(${SC})">${mkHedge()}</g>`, [[13.8, HX0, 612], [15.7, HX1, 612]]).replace(/$/, '') +
  vis(15.7, 99, put(HX1, FY, SC, mkHedge()));

// ───────── panier de Gaston, sardine ─────────
const basket = `<g transform="translate(${BK} ${FY + 6})"><ellipse cy="2" rx="70" ry="9" fill="#000" opacity=".16"/>
  ${fish(-22, -66, 0.45, 'fish', '#ff9f43')}${fish(26, -62, 0.45, 'herring')}${fish(2, -76, 0.4, 'fish', '#7cc8ff')}
  <path d="M-62 -58 L-48 0 H48 L62 -58Z" fill="#d9a05b" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M-56 -38 H56 M-52 -20 H52" stroke="#a8743f" stroke-width="5"/><path d="M-30 -58 L-26 0 M0 -58 V0 M30 -58 L26 0" stroke="#a8743f" stroke-width="4"/>
  <rect x="-66" y="-66" width="132" height="14" rx="7" fill="#c9965a" stroke="${INK}" stroke-width="5"/>
  <path d="M-56 -66 Q0 -150 56 -66" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M-56 -66 Q0 -150 56 -66" fill="none" stroke="#e8c590" stroke-width="4" stroke-linecap="round"/></g>`;
const sardine = (s) => `<g transform="scale(${s})">${fish(0, 0, 1, 'sardine')}</g>`;
const sardineFall = mover(sardine(0.55), [[18.6, 855, 120, -30], [19.4, 890, 448, 20]]) +
  vis(19.4, 99, `<g transform="translate(890 448) rotate(20)">${sardine(0.55)}</g>`);

// ───────── décor, pluie, pastille ─────────
const boatFar = `<g transform="translate(250 360) scale(.3)"><g style="animation:sbob 2.4s ease-in-out infinite alternate"><path d="M-170 -54 H190 Q180 4 120 20 H-110 Q-160 10 -170 -54Z" fill="#3b82f6" stroke="${INK}" stroke-width="8"/><path d="M100 -250 V-54" stroke="${INK}" stroke-width="12"/></g></g>`;
const world = `${seaBg('dusk', { sun: true })}${boatFar}${foxEl}${rabEl}${pelEl}${basket}${hedgeEl}${sardineFall}`;
const rnd = (i) => { const v = Math.sin(i * 91.7 + 13.3) * 43758.5; return v - Math.floor(v); };
const drop = (i, t0, len, op) => vis(t0, 99, `<g transform="translate(${(rnd(i) * 1300 - 10).toFixed(0)} 0)"><g style="animation:rainfall ${(0.7 + rnd(i + 5) * 0.5).toFixed(2)}s linear ${(rnd(i + 9) * 1.2).toFixed(2)}s infinite"><path d="M0 0 l-3 ${len}" stroke="#d9efff" stroke-width="${len > 12 ? 4 : 3}" stroke-linecap="round" opacity="${op}"/></g></g>`);
const rain = Array.from({ length: 22 }, (_, i) => drop(i, 11.0, 9, 0.8)).join('') + Array.from({ length: 36 }, (_, i) => drop(i + 40, 17.0, 20, 0.75)).join('');
const FK = ['fish', 'herring', 'fish', 'herring'], FC = ['#ff9f43', null, '#7cc8ff', null];
const fishRain = Array.from({ length: 9 }, (_, i) => vis(4.4, 10.4, `<g transform="translate(${90 + i * 135} 0)"><g style="animation:rainfall ${(1.3 + rnd(i + 3) * 0.5).toFixed(2)}s linear ${(rnd(i + 7) * 1.4).toFixed(2)}s infinite"><g transform="rotate(${(-25 + rnd(i) * 50).toFixed(0)}) scale(.6)">${FC[i % 4] ? fish(0, 0, 1, FK[i % 4], FC[i % 4]) : fish(0, 0, 1, FK[i % 4])}</g></g></g>`)).join('');
const dim = vis(10.5, 99, `<rect width="${W}" height="${H}" fill="#1d2766" style="${an({ n: 'dimk', d: 3.5, t: 10.5, f: 'both' })}"/>`);
const hud = timeBadge(18, 15);

// ───────── bulles ─────────
const HM = { pel: [GX - 18, FY - 215], fox: [FX + 28, FY - 200], rab: [RX - 26, FY - 250], hed: [HX1 + 46, FY - 140], hed0: [HX0 + 46, FY - 140] };
const tip = (k, t) => scr(...HM[k], t);
const sy = (who, text, t0, d, k, by, dx = 0, o = {}) => { const tp = tip(k, t0); return say(who, text, t0, d, { bx: tp[0] + dx, by, tips: [tp], ...o }); };
const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.3, t: 26.9, f: 'both' })}"><g transform="translate(640 130)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 3</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">La pluie de poissons</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : le coucher de soleil</text></g></g>`;
const fx = rain + fishRain + hud +
  sy('pelican', 'Ce soir, pluie de poissons !', 0.6, 2.6, 'pel', 160, -120) +
  sfx('SNIF', 700, 300, 0.4, 0.7, -6, '#ffd23f', 54) +
  sy('rab', 'Des poissons ?', 3.8, 1.4, 'rab', 110, 60) +
  sy('fox', 'Ça tombe, ça tombe !', 5.6, 1.5, 'fox', 110, -60) +
  sy('pelican', 'Mon panier ! Mon dîner !', 7.4, 2.0, 'pel', 110, -140) +
  sy('fox', 'Où sont les poissons ?', 11.4, 1.7, 'fox', 160, 60) +
  sy('hedge', 'Je protège ton panier !', 16.2, 1.8, 'hed', 150, -120) +
  sfx('PIC !', 300, 330, 18.0, 0.5, -8, '#ffffff', 52) + sfx('PIC !', 980, 620, 19.0, 0.5, 8, '#ffffff', 52) +
  sy('rab', 'Une sardine en peluche !', 19.8, 2.0, 'rab', 150, 250) +
  sy('pelican', 'Merci, Piquette, quel courage !', 22.0, 2.0, 'pel', 150, -170) +
  sy('hedge', 'Avec plaisir, Gaston !', 24.2, 1.3, 'hed', 150, -90) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#ff9f6b"/>
<g style="${camStyle}">${world}</g>
${dim}
${fx}
</svg>`;
sfxEv.push({ name: 'sniff', t: 0.5 }, { name: 'wave', t: 3.0 }, { name: 'whoosh', t: 13.8 }, { name: 'click', t: 18.0 }, { name: 'click', t: 19.0 },
  { name: 'poof', t: 19.4 }, { name: 'laugh', t: 22.2 }, { name: 'laugh', t: 24.3 }, { name: 'chime', t: 26.9 });
writeFileSync(new URL('./la-pluie-de-poissons.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 96, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
