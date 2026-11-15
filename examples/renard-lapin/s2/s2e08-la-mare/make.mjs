// Roussin & Lino · Saison 2 · Épisode 8 « La mare » — 30 s, 1280x720. 13h00, au bord de la mare.
//
// Découpage :
//  0.0– 3.5  plan large     panneau 13 h 00 ; Lino : « Une mare ! » ; Plouf surgit de l'eau
//  3.5– 6.5  Plouf           « Salut ! Moi, c'est Plouf ! » (il salue)
//  6.5–10.0  plan large     Plouf : « Concours de sauts ? » — Roussin : « Moi d'abord ! »
// 10.0–13.0  la mare        Plouf fait trois sauts ; Lino compte : « Un, deux, trois ! »
// 13.0–16.5  Roussin         anticipation : il tremble et se prépare ; Piquette : « Courage, Roussin ! »
// 16.5–18.0  plan large     élan, grand saut au-dessus de la mare...
// 18.0–20.5  éclaboussure   SPLASH ! Roussin atterrit en plein milieu, Plouf est trempé
// 20.5–24.0  dans l'eau     Plouf : « Bravo ! Quel plongeon ! » — Roussin : « Je suis tout mouillé... »
// 24.0–27.0  plan large     Piquette : « Hihi ! » — Lino : « Il est 13 h 05 ! » (le panneau change)
// 27.0–30.0  carton « Saison 2 »
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0, puff } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { hedgehog, frog } from '../../lib/cast2.mjs';
import { farmBg, pond, splash, GROUND } from '../../lib/farm.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.5, 640, 400, 1.0, 1.06],
  [3.5, 6.5, 820, 430, 1.9, 1.95],
  [6.5, 10.0, 520, 450, 1.25, 1.3],
  [10.0, 13.0, 650, 440, 1.3, 1.35],
  [13.0, 16.5, 400, 520, 1.55, 1.6],
  [16.5, 18.0, 600, 470, 1.2, 1.25],
  [18.0, 20.5, 640, 440, 1.45, 1.45],
  [20.5, 24.0, 650, 430, 1.7, 1.75],
  [24.0, 27.0, 640, 430, 1.0, 1.0],
  [27.0, 30, 640, 400, 1.0, 1.0],
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

// ───────── décor : prairie, mare, panneau-horloge ─────────
const signAt = (h, m, t0, t1) => vis(t0, t1, `<g transform="translate(1160 ${GROUND + 6})"><rect x="-8" y="-230" width="16" height="236" rx="5" fill="#9b6a3c" stroke="${INK}" stroke-width="5"/>
  <rect x="-92" y="-340" width="184" height="190" rx="18" fill="#e8c590" stroke="${INK}" stroke-width="6"/>
  <g transform="translate(0 -268) scale(.9)">${wallClock(h, m, 0, 0)}</g></g>`);
const POND = [760, 500];
const bg = `${farmBg({ sunny: true, withFence: false })}${pond(POND[0], POND[1], 1.2)}${signAt(13, 0, 0, 99)}`;

// ───────── personnages ─────────
const FY = 650;
const hedgeEl = put(130, FY, 1.0, hedgehog([[15.0, 16.2], [24.4, 25.4]], { noShadow: false,
  eyes: [[0, 6, 'side'], [14.8, 16.4, 'wide'], [24.3, 26, 'arc']], moods: [[0, 3, 'shy'], [14.8, 16.4, 'oh'], [24.3, 27, 'happy']], blush: [[0.5, 3.0]] }));
const rabEl = put(280, FY, 1.0, rabbit({ run: null,
  talk: [[0.5, 1.6], [10.6, 12.4], [25.6, 27.0]],
  eyes: [[0.4, 1.8, 'wide'], [10.4, 12.6, 'arc'], [25.4, 27.2, 'arc']], moods: [[0.4, 1.8, 'happy'], [10.4, 12.6, 'happy'], [25.4, 30, 'happy']] }));
const foxOpts = (extra) => ({ run: null, upright: -8, talk: [[8.3, 9.5], [13.2, 14.8], [22.7, 24.2]], ...extra });
const foxJump = put(0, 0, 1.0, fox(foxOpts({ run: [16.4, 17.0], jumps: [[17.0, 17.9, 210]], shiver: [13.3, 14.7],
  eyes: [[8.2, 9.6, 'wide'], [13.0, 16.4, 'wide'], [16.4, 17.9, 'sq']], moods: [[8.2, 9.6, 'happy'], [13.0, 14.9, 'panic'], [16.4, 17.9, 'oh']] })));
const foxRun = vis(0, 17.95, mover(`<g style="transform-origin:0 0;${an({ n: 'antic', d: 0.13, t: 16.0, c: 2, dir: 'alternate', e: 'ease-out' })}">${foxJump}</g>`,
  [[0, 470, FY], [16.4, 470, FY], [17.0, 500, FY], [17.9, 520, 534], [17.95, 520, 534]]));
const FOXPOND = [520, 548];
const foxIn = `<g clip-path="url(#pondclip)">${put(FOXPOND[0], FOXPOND[1], 1.0, fox(foxOpts({ wetFrom: 17.9, noShadow: true,
  eyes: [[17.9, 20.6, 'wide'], [20.6, 22.6, 'sq'], [22.6, 24.4, 'down'], [24.4, 30, 'arc']], moods: [[17.9, 22.6, 'oh'], [22.6, 24.4, 'sad'], [24.4, 30, 'happy']], blush: [[22.6, 24.4]] })))}</g>`;
const foxInEl = vis(17.9, 99, `<defs><clipPath id="pondclip"><rect x="0" y="0" width="${W}" height="${FOXPOND[1] + 4}"/></clipPath></defs>${foxIn}
  <g transform="translate(${FOXPOND[0]} ${FOXPOND[1] + 2})"><ellipse rx="96" ry="20" fill="none" stroke="#fff" stroke-width="6" style="${an({ n: 'fripple', d: 1.2, t: 17.95, c: 3 })}"/></g>`);

const FR = [940, 520];
const frogEl = mover(put(0, 0, 0.95, frog([[3.7, 5.4], [6.7, 8.0], [21.0, 22.4]], {
  wave: [[3.8, 5.4]], croak: [[22.1, 22.9]], jumps: [[10.2, 10.9, 150], [11.0, 11.7, 180], [11.8, 12.6, 240]], jolt: 18.0, noShadow: true,
  eyes: [[18.0, 19.8, 'wide'], [20.8, 23, 'arc'], [24, 27, 'arc']], moods: [[3.6, 8.2, 'happy'], [18.0, 19.8, 'oh'], [20.8, 30, 'happy']], blush: [[21, 23]] })),
  [[2.0, FR[0], FR[1] + 70, 0, 0.25], [2.7, FR[0], FR[1], 0, 1], [10.2, FR[0], FR[1], 0, 1], [10.9, 850, FR[1], 0, 1], [11.0, 850, FR[1], 0, 1], [11.7, 1000, FR[1], 0, 1], [11.8, 1000, FR[1], 0, 1], [12.6, FR[0], FR[1], 0, 1], [30, FR[0], FR[1], 0, 1]]);
const popSplash = splash(FR[0], FR[1] + 10, 2.0, 1.7, 11) .replace(/<g transform/, '<g transform') ;
const popSplashV = vis(2.0, 3.2, popSplash);
const hopSplashes = [[10.9, 850], [11.7, 1000], [12.6, FR[0]]].map(([t, x]) => vis(t, t + 1.1, splash(x, FR[1] + 12, t, 1.4, 10))).join('');
const bigSplash = vis(17.9, 19.4, splash(520, 540, 17.9, 3.2, 18) + splash(430, 548, 18.05, 2.2, 11) + splash(620, 548, 18.1, 2.2, 11));

const world = `${bg}${hedgeEl}${rabEl}${popSplashV}${frogEl}${foxRun}${foxInEl}${bigSplash}${hopSplashes}`;

// ───────── espace écran ─────────
const hd = (x, Y = FY) => [x + 5, Y - 202], fx_ = (x, Y = FY) => [x + 80, Y - 252], rb = (x, Y = FY) => [x + 20, Y - 312], fg = (x, Y) => [x, Y - 240];
const B = (who, text, t0, dur, M, { dx = 0, dy = 0, shout = false, fs } = {}) => {
  const p = scr(M[0], M[1], t0 + 0.2);
  return say(who, text, t0, dur, { bx: p[0] + dx, by: p[1] - 80 + dy, tips: [[p[0], p[1] - 10]], shout, fs });
};
const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.45, t: 27.2, f: 'both' })}"><g transform="translate(640 130)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 2</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">La mare</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : le pont</text></g></g>`;
const fxs =
  B('rab', 'Une mare !', 0.5, 1.2, rb(280), { dy: -10 }) +
  sfx('PLOUF !', 830, 260, 2.0, 0.9, -8, '#4fb3ff', 54) +
  B('frog', 'Salut ! Moi, c\'est Plouf !', 3.7, 1.8, fg(FR[0], FR[1]), { dx: -30 }) +
  B('frog', 'Concours de sauts ?', 6.7, 1.4, fg(FR[0], FR[1]), { dx: -60, dy: -20 }) +
  B('fox', 'Moi d\'abord !', 8.3, 1.3, fx_(470), { shout: true, dy: -20 }) +
  sfx('BOING !', 560, 250, 10.2, 0.6, -6, '#ffd23f', 58) +
  B('rab', 'Un, deux, trois !', 10.6, 1.9, rb(280), { dx: 20, dy: 10 }) +
  B('fox', 'Attention, je saute !', 13.2, 1.7, fx_(470), { dx: 40 }) +
  B('hedge', 'Courage, Roussin !', 15.0, 1.3, hd(130), { dx: 60 }) +
  sfx('SPLASH !!', 760, 190, 18.0, 1.4, -6, '#4fb3ff', 96) +
  B('frog', 'Bravo ! Quel plongeon !', 21.0, 1.6, fg(FR[0], FR[1]), { dx: 60, dy: -10 }) +
  B('fox', 'Je suis tout mouillé...', 22.7, 1.7, fx_(FOXPOND[0], FOXPOND[1]), { dx: -90, dy: 10 }) +
  B('hedge', 'Bravo, Roussin !', 24.4, 1.0, hd(130), { dx: 20 }) +
  B('rab', 'Quel beau concours !', 25.6, 1.4, rb(280), { dx: 40 }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#7cc8ff"/>
<g style="${camStyle}">${world}</g>
${timeBadge(13, 0)}
${fxs}
</svg>`;
sfxEv.push({ name: 'chime', t: 0.3 }, { name: 'boing', t: 10.2 }, { name: 'boing', t: 11.0 }, { name: 'boing', t: 11.8 }, { name: 'whoosh', t: 16.9 },
  { name: 'laugh', t: 24.4 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./mare.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 110, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
