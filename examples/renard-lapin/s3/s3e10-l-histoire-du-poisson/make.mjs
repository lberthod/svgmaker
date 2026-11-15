// Roussin & Lino · Saison 3 · Épisode 10 « L'histoire du poisson » — 30 s, 1280x720. 14h45, le petit port.
//
// Découpage :
//  0.0– 3.2  plan large     le quai : Gaston raconte, la bande écoute ; pastille 14 h 45
//  3.2– 8.5  Gaston         « Un poisson... gigantesque ! » : le nuage-poisson apparaît ; Roussin : « Grand comme moi ? »
//  8.5–12.0  la bande       Gaston : « Plus grand ! Comme un bateau ! » (le nuage grandit) ; Lino : « Et comme une baleine ? »
// 12.0–17.2  plan large     « Oui ! Une baleine géante ! » : le nuage devient énorme
// 17.2–20.5  l'ombre        une ombre de baleine passe sur le quai : Piquette et Lino sursautent
// 20.5–24.0  la révélation  c'est Coin, un aileron sur la tête : « Hihi ! C'est moi ! »
// 24.0–27.0  plan large     Gaston : « Hihi ! Bravo, la baleine ! »
// 27.0–30.0  plan large     carton « Saison 3 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0, pal } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { pelican } from '../../lib/cast3.mjs';
import { harborBg, fish, lifebuoy } from '../../lib/sea.mjs';
import { timeBadge } from '../../lib/badge.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.2, 600, 430, 1.1, 1.14],
  [3.2, 8.5, 457, 440, 1.4, 1.42],
  [8.5, 12.0, 600, 430, 1.1, 1.1],
  [12.0, 17.2, 600, 430, 1.1, 1.1],
  [17.2, 20.5, 800, 470, 1.5, 1.5],
  [20.5, 24.0, 880, 480, 1.45, 1.5],
  [24.0, 27.0, 680, 430, 1.1, 1.1],
  [27.0, 30, 640, 400, 1.1, 1.0],
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

// ───────── décor ─────────
const bg = harborBg({});
const GY = 620, S = 0.8;
const GX = 230, FX = 600, RX = 790, HX = 1010;

const gaston = put(GX, GY, S, pelican([[0.6, 2.2], [3.5, 5.2], [8.7, 11.0], [14.1, 16.0], [24.6, 26.4]], {
  noShadow: true, gest: [[3.4, 5.6], [8.8, 11.2], [14.0, 16.4]],
  eyes: [[0, 30, 'calm']], moods: [[3.4, 5.6, 'happy'], [14.0, 16.4, 'happy'], [24.4, 30, 'happy']] }));
const foxEl = put(FX, GY, S, fox({ run: null, upright: -4, noShadow: true,
  talk: [[6.7, 8.0], [22.8, 23.9]],
  eyes: [[0, 6.4, 'wide'], [17.2, 20.6, 'wide'], [22.4, 24.0, 'arc']],
  moods: [[0, 6.4, 'happy'], [17.2, 20.6, 'oh'], [22.4, 30, 'happy']] }), true);
const rabEl = put(RX, GY, S, rabbit({ run: null, noShadow: true,
  talk: [[12.2, 13.6], [19.2, 20.2]],
  eyes: [[0, 12.0, 'wide'], [17.2, 20.6, 'wide'], [21.4, 30, 'arc']],
  moods: [[0, 12.0, 'happy'], [17.2, 20.6, 'oh'], [21.4, 30, 'happy']] }), true);
const hedgeEl = put(HX, GY + 4, S, hedgehog([[17.7, 19.0]], { noShadow: true,
  eyes: [[0, 17.2, 'wide'], [17.2, 20.6, 'wide'], [22.0, 30, 'arc']],
  moods: [[17.2, 20.6, 'oh'], [22.0, 30, 'happy']] }), true);
const coinWalk = [[20.4, 21.5]];
const coinEl = mover(put(0, 0, 0.95, pal('duck', { walk: coinWalk, talk: [[21.6, 22.8]], giggle: [[21.6, 23.2]],
  arms: lifebuoy(0, -34, 0.78),
  hat: `<path d="M-16 -152 Q-8 -214 24 -226 Q18 -184 32 -152Z" fill="#7f8fa6" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M0 -164 Q6 -190 20 -204" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".5"/>`,
  eyes: [[21.5, 30, 'arc']], moods: [[21.5, 30, 'happy']] })),
  [[20.4, 1420, GY, 0, 1], [21.5, 1160, GY, 0, 1], [30, 1160, GY, 0, 1]]);

// ───────── le nuage-poisson (espace écran ; le poisson grandit en trois temps et finit par déborder) ─────────
const cloudSvg = `<ellipse cx="0" cy="-50" rx="150" ry="50" fill="#f1f9ff" stroke="${INK}" stroke-width="5"/>
  <circle cx="-110" cy="-66" r="36" fill="#f1f9ff" stroke="${INK}" stroke-width="5"/><circle cx="100" cy="-72" r="40" fill="#f1f9ff" stroke="${INK}" stroke-width="5"/><circle cx="-30" cy="-92" r="42" fill="#f1f9ff" stroke="${INK}" stroke-width="5"/><circle cx="50" cy="-96" r="34" fill="#f1f9ff" stroke="${INK}" stroke-width="5"/>
  <ellipse cx="0" cy="-54" rx="146" ry="46" fill="#f1f9ff"/><circle cx="-60" cy="-70" r="34" fill="#f1f9ff"/><circle cx="40" cy="-80" r="30" fill="#f1f9ff"/>`;
const grow = (inner, t0, d, a, b) => tf(inner, { t0, d, from: `scale(${a})`, to: `scale(${b})`, e: 'ease-out', o: '0px 0px' });
const cloudFx = `<g transform="translate(640 300)">${vis(3.4, 16.6,
  grow(grow(grow(cloudSvg, 3.4, 0.5, 0.15, 0.8), 8.8, 1.2, 1, 1.3), 14.2, 1.6, 1, 1.25) +
  `<g transform="translate(0 -50)">${grow(grow(grow(fish(0, 0, 1, 'fish', '#ff9f43'), 3.4, 0.5, 0.15, 0.55), 8.8, 1.2, 1, 2), 14.2, 1.6, 1, 1.7)}</g>`)}</g>`;

// ───────── l'ombre de baleine ─────────
const whale = `<g fill="#14223f" opacity=".5"><ellipse rx="100" ry="40"/><path d="M92 -4 L150 -44 Q144 -8 162 0 Q144 8 150 44 L92 12Z"/><path d="M-10 -34 Q20 -80 52 -34Z"/><path d="M-30 30 Q-10 62 30 36Z"/></g>`;
const shadow = mover(`<g transform="scale(-3.2 1.8)">${whale}</g>`, [[15.4, -420, 610, 0, 1], [19.8, 1500, 610, 0, 1]]);
const coinShadow = vis(21.3, 27.0, `<g transform="translate(1160 ${GY + 10}) scale(.42 .26)">${whale}</g>`);

const world = `${bg}${gaston}${foxEl}${rabEl}${hedgeEl}${coinEl}${coinShadow}${shadow}`;

// ───────── espace écran ─────────
const tip = (m, t, dx = 0, dy = 0) => { const p = scr(m[0], m[1], t); return [p[0] + dx, p[1] + dy]; };
const GM = [GX + 40, GY - 270 * S], FM = [FX - 20, GY - 250 * S], RM = [RX - 20, GY - 250 * S], HM = [HX - 10, GY - 150 * S], CM = [1160, GY - 170];
const hud = cloudFx + timeBadge(14, 45);
const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.45, t: 27.2, f: 'both' })}"><g transform="translate(640 150)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:44px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 3</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">L'histoire du poisson</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : le ballon</text></g></g>`;
const fx = hud +
  say('pelican', 'Écoutez, mes petits !', 0.6, 1.8, { bx: 520, by: 130, tips: [tip(GM, 0.6, 0, -6)] }) +
  say('pelican', 'Un poisson... gigantesque !', 3.5, 2.0, { bx: 700, by: 75, tips: [tip(GM, 3.5, 0, -6)] }) +
  say('fox', 'Grand comme moi ?', 6.7, 1.5, { bx: 640, by: 75, tips: [tip(FM, 6.7, 0, -6)] }) +
  say('pelican', 'Plus grand ! Comme un bateau !', 8.7, 2.5, { bx: 700, by: 75, tips: [tip(GM, 8.7, 0, -6)] }) +
  say('rab', 'Et comme une baleine ?', 12.2, 1.8, { bx: 800, by: 75, tips: [tip(RM, 12.2, 0, -6)] }) +
  say('pelican', 'Oui ! Une baleine géante !', 14.1, 2.2, { bx: 700, by: 75, tips: [tip(GM, 14.1, 0, -6)] }) +
  sfx('WOUUSH !', 640, 330, 15.6, 1.3, -6, '#ffffff', 80, 'whoosh') +
  say('hedge', "C'est quoi, ça ?", 17.7, 1.4, { bx: 900, by: 170, tips: [tip(HM, 17.7, 0, -4)] }) +
  say('rab', 'Une baleine !', 19.2, 1.2, { bx: 800, by: 210, tips: [tip(RM, 19.2, 0, -6)], shout: true }) +
  say('coin', 'C\'est moi, la baleine !', 21.6, 1.5, { bx: 930, by: 170, tips: [tip(CM, 21.6, 0, -6)] }) +
  say('fox', "C'est Coin !", 22.8, 1.2, { bx: 520, by: 190, tips: [tip(FM, 22.8, 0, -6)] }) +
  say('pelican', 'Bravo, la petite baleine !', 24.6, 1.9, { bx: 520, by: 190, tips: [tip(GM, 24.6, 0, -6)] }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#7cc8ff"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'wave', t: 0.2 }, { name: 'whoosh', t: 3.4 }, { name: 'whoosh', t: 8.8 }, { name: 'whoosh', t: 15.6 },
  { name: 'laugh', t: 21.6 }, { name: 'laugh', t: 24.6 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./histoire-du-poisson.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 110, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
