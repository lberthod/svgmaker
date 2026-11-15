// Roussin & Lino · Saison 4 · Épisode 5 « La luge » — 30 s, 1280x720. 10h15, la grande piste de luge.
//
// Découpage :
//  0.0– 3.5  plan large   pastille 10h15 ; Bouquet : « Hop hop hop ! En piste ! »
//  3.5– 7.0  consignes    Bouquet : « Assis ! Pieds devant ! » — Roussin : « Prêt ! » — Lino : « Vas-y ! »
//  7.0–10.6  la descente  Roussin file ; son bonnet s'envole, glisse TOUT SEUL, double la luge
// 10.6–14.6  l'arrivée    la luge s'enfonce dans le tas de neige ; le bonnet attend déjà sur le tas
// 14.6–18.5  en haut      Lino : « Bravo, Roussin ! » — Bouquet : « Hop hop hop ! Bravo ! »
// 18.5–22.5  le bonnet    Roussin se recoiffe : « Mon bonnet m'attendait ! » (gros plan)
// 22.5–27.0  plan large   rires
// 27.0–30.0  carton « Saison 4 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { ibex } from '../../lib/cast4.mjs';
import { piste, sled, slopeY, SLOPE_DEG, snowPile, snowPoof, beanie, foxBeanie, sledTracks, snowfall } from '../../lib/snow.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.5, 560, 300, 1.25, 1.29],
  [3.5, 7.0, 400, 330, 1.6, 1.65],
  [7.0, 10.6, 640, 460, 1.1, 1.1],
  [10.6, 14.6, 925, 500, 1.8, 1.85],
  [14.6, 18.5, 640, 330, 1.15, 1.15],
  [18.5, 22.5, 880, 400, 1.6, 1.65],
  [22.5, 27.0, 640, 400, 1.05, 1.0],
  [27.0, 30, 640, 360, 1.0, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}`);

const lerp = (a, b, u) => a + (b - a) * u;
// trajectoire linéaire par morceaux (les points sont déjà lissés) : pts = [[t,x,y,rot,scale]]
const mover = (inner, pts, lin = false) => {
  const t0 = pts[0][0], t1 = pts[pts.length - 1][0];
  const fn = (t) => {
    let i = 0; while (i < pts.length - 2 && t > pts[i + 1][0]) i++;
    const [a, xa, ya, ra = 0, sa = 1] = pts[i], [b, xb, yb, rb = 0, sb = 1] = pts[i + 1];
    const u0 = Math.min(1, Math.max(0, (t - a) / (b - a))), u = lin ? u0 : ss(u0);
    return { x: lerp(xa, xb, u), y: lerp(ya, yb, u), r: lerp(ra, rb, u), s: lerp(sa, sb, u) };
  };
  return vis(t0, t1, track(inner, t0, t1, fn, 30));
};
const G = (x) => slopeY(x) + 30; // sol sous les pieds à l'abscisse x

// ───────── décor : piste, tas de neige ─────────
const PILE_X = 1060;
const bg = `${piste({ kind: 'day' })}${snowfall({ n: 18, speed: 0.7 })}`;
const pile = snowPile(PILE_X, 640, 1.0);

// ───────── la luge de Roussin : x(t) ─────────
const SX0 = 580, SX1 = 880, TG = 7.2, TE = 10.6;
const sx = (t) => (t <= TG ? SX0 : t >= TE ? SX1 : SX0 + (SX1 - SX0) * Math.pow((t - TG) / (TE - TG), 1.5));
const foxOpts = (hatEnd) => ({ run: null, upright: -6, noShadow: true, noBag: true,
  hat: [[0, hatEnd, foxBeanie(0.5)], [18.6, 30, foxBeanie(0.5)]],
  talk: [[5.3, 6.1], [7.5, 8.6], [9.0, 10.0], [18.8, 21.0], [23.6, 25.0]],
  eyes: [[5.2, 6.2, 'arc'], [7.4, 8.8, 'wide'], [8.8, 10.0, 'sq'], [10.6, 12.0, 'oh'], [18.6, 21.2, 'arc'], [22.6, 27.4, 'arc']],
  moods: [[5.2, 6.2, 'happy'], [7.4, 8.8, 'happy'], [8.8, 10.0, 'oh'], [10.6, 12.0, 'oh'], [18.6, 30, 'happy']] });
const sledFox = () => `${sled(0, 0, 1, { shadow: false })}<g transform="translate(-6 -44) scale(.72)">${fox(foxOpts(8.8))}</g>`;
const ridePts = [];
for (let t = TG; t <= TE + 0.001; t += 0.1) ridePts.push([+t.toFixed(2), sx(t), G(sx(t)) + 2 + (t > 8 && t < 10.3 ? -3 * Math.abs(Math.sin(t * 9)) : 0), SLOPE_DEG - (t > 10.45 ? -6 : 0), 1]);
const foxRide = vis(0, TG, `<g transform="translate(${SX0} ${G(SX0)}) rotate(${SLOPE_DEG})">${sledFox()}</g>`)
  + mover(sledFox(), ridePts, true)
  + vis(TE, 30, `<g transform="translate(${SX1} ${G(SX1) + 2}) rotate(${SLOPE_DEG + 4})">${sledFox()}</g>`);
const trail = vis(8.4, 30, sledTracks(SX0 + 30, G(SX0 + 30) + 14, SX1 - 40, G(SX1 - 40) + 14));

// ───────── le bonnet qui descend tout seul ─────────
const hx0 = sx(8.8) + 40, hy0 = G(sx(8.8)) - 175;
const hatPts = [[8.8, hx0, hy0, 0, 1], [9.0, hx0 + 55, hy0 - 90, 160, 1], [9.25, hx0 + 120, hy0 - 40, 300, 1], [9.5, hx0 + 160, G(hx0 + 160) - 4, 360 + SLOPE_DEG * 0, 1]];
for (let t = 9.6; t <= 10.3; t += 0.1) { const u = (t - 9.5) / 0.8, x = lerp(hx0 + 160, PILE_X - 12, u * u * 0.4 + u * 0.6); hatPts.push([+t.toFixed(2), x, G(x) - 4 - (u > 0.9 ? 60 * (u - 0.9) * 10 : 0), 360 + SLOPE_DEG * 0, 1]); }
hatPts.push([10.35, PILE_X - 12, 540, 370, 1]);
const hatSolo = mover(`<g transform="scale(.85)">${beanie(0, 0, 1)}</g>`, hatPts, true);
const hatOnPile = vis(10.35, 18.5, `<g transform="translate(${PILE_X - 12} 540) rotate(10) scale(.85)">${beanie(0, 0, 1)}</g>`);
const poofs = snowPoof(PILE_X - 30, 560, 10.5, 0.9) + snowPoof(PILE_X - 12, 520, 10.4, 0.6);

// ───────── Bouquet et Lino en haut ─────────
const IX = 190, RX = 380;
const ibexEl = put(IX, G(IX), 0.85, ibex([[0.5, 2.4], [3.7, 5.2], [16.6, 18.2]], { noShadow: true,
  eyes: [[0.4, 2.5, 'arc'], [16.5, 18.3, 'arc'], [22.6, 27.5, 'arc']],
  moods: [[0.4, 2.5, 'happy'], [3.6, 5.3, 'happy'], [16.5, 18.3, 'happy'], [22.6, 30, 'happy']] }));
const rabEl = put(RX, G(RX), 1.0, rabbit({ run: null, noShadow: true,
  talk: [[6.1, 7.1], [14.8, 16.3]],
  eyes: [[6.0, 7.2, 'wide'], [9.0, 12.0, 'wide'], [14.7, 16.4, 'arc'], [24.9, 26.5, 'arc']],
  moods: [[6.0, 7.2, 'happy'], [9.0, 12.0, 'oh'], [14.7, 16.4, 'happy'], [24.9, 30, 'happy']] }));

const world = `${bg}${trail}${ibexEl}${rabEl}${foxRide}${hatOnPile}${hatSolo}${pile}${poofs}`;

// ───────── espace écran ─────────
const pastille = timeBadge(10, 15);
const sp = (who, tx, t0, d, m, o = {}) => {
  const [x, y] = scr(m[0], m[1], t0 + 0.1);
  const bw = tx.length * (o.shout ? 50 : 41) * 0.56 + 56;
  return say(who, tx, t0, d, { bx: Math.max(x + (o.ox || 0), 310 + bw / 2), by: y - (o.up || 90), tips: [[x, y - (o.gap || 14)]], shout: o.shout });
};
const im = [IX + 25, G(IX) - 262];
const rm = [RX + 25, G(RX) - 325];
const fxm = (t) => [sx(t) + 40, G(sx(t)) - 270];
const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.45, t: 27.2, f: 'both' })}"><g transform="translate(640 130)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 4</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">La luge</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : la grande pente</text></g></g>`;
const fx = pastille +
  sp('ibex', 'Tout le monde en piste !', 0.5, 1.9, im, { ox: 120 }) +
  sp('ibex', 'Assis ! Pieds devant !', 3.7, 1.5, im, { ox: 100 }) +
  sp('fox', 'Prêt !', 5.3, 0.8, fxm(5.3), { ox: 0 }) +
  sp('rab', 'Vas-y !', 6.1, 0.9, rm, { ox: 30 }) +
  sp('fox', 'On y va !', 7.5, 1.1, fxm(7.5), { shout: true }) +
  sfx('FIOUUU', 560, 250, 7.8, 0.9, -8, '#ffffff', 64) +
  sp('fox', 'Mon bonnet !', 9.0, 1.0, fxm(9.0), { shout: true }) +
  sfx('BOING !', 900, 330, 10.7, 0.8, -6, '#ffd23f', 80) +
  sp('rab', 'Roussin a gagné !', 14.8, 1.5, rm, { ox: 30 }) +
  sp('ibex', 'Quelle belle descente !', 16.6, 1.6, im, { ox: 100 }) +
  sp('fox', 'Mon bonnet m’attendait !', 18.8, 2.2, [SX1 + 20, G(SX1) - 215], { ox: -330, up: 10 }) +
  sp('fox', 'On remonte ! Encore !', 23.6, 1.4, [SX1 + 20, G(SX1) - 300], { ox: -80 }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#7cc8ff"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'chime', t: 0.3 }, { name: 'slide', t: 7.2 }, { name: 'whoosh', t: 7.8 }, { name: 'whoosh', t: 9.2 }, { name: 'boing', t: 10.6 }, { name: 'laugh', t: 23.6 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./luge.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 126, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
