// Roussin & Lino · Saison 4 · Épisode 6 « La grande pente » — 30 s, 1280x720. 11h00, la piste et le chalet.
//
// Découpage :
//  0.0– 3.5  plan large   pastille 11h00 ; cinq amis sur la grande luge ; Lino : « Tous à bord ! Il est onze heures ! »
//  3.5– 7.0  Escargot     elle approche de la dernière place, très lentement
//  7.0– 9.5  l'embarquement  elle grimpe enfin à l'avant : « Voilà ! En route ! »
//  9.5–13.5  la descente  la grande luge file ; tous crient, Escargot reste sereine
// 13.5–17.0  l'arrêt      la luge s'arrête net, mais Escargot, elle, continue de glisser...
// 17.0–21.5  la glisse    ... tout doucement, jusqu'à la porte du chalet
// 21.5–25.0  la porte     pile devant le chalet : « Je suis arrivée ! »
// 25.0–27.0  plan large   Roussin : « Dernière, mais pile ! »
// 27.0–30.0  carton « Saison 4 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { makeCam, say as say0, pal, snail } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { piste, bigSled, chalet, slopeY, SLOPE_DEG, snowPoof, foxBeanie, snowfall } from '../../lib/snow.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.5, 560, 300, 1.2, 1.24],
  [3.5, 7.0, 560, 300, 1.2, 1.3],
  [7.0, 9.5, 560, 300, 1.2, 1.2],
  [9.5, 13.5, 640, 420, 1.05, 1.05],
  [13.5, 17.0, 770, 420, 1.3, 1.3],
  [17.0, 21.5, 770, 400, 1.25, 1.25],
  [21.5, 25.0, 770, 400, 1.3, 1.3],
  [25.0, 27.0, 640, 400, 1.1, 1.05],
  [27.0, 30, 640, 360, 1.0, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes s6crawl{0%,100%{transform:scale(1,1)}50%{transform:scale(1.05,.95)}}`);

const lerp = (a, b, u) => a + (b - a) * u;
const clamp01 = (u) => Math.min(1, Math.max(0, u));
const G = (x) => slopeY(x) + 30;
const cs = Math.cos((SLOPE_DEG * Math.PI) / 180), sn = Math.sin((SLOPE_DEG * Math.PI) / 180);

// ───────── mouvement de la grande luge ─────────
const X0 = 360, X1 = 620, TR = 9.5, TS = 13.2, TE = 13.9;
const D1 = (X1 - X0) * 0.88;
const sledX = (t) => (t <= TR ? X0 : t < TS ? X0 + D1 * Math.pow((t - TR) / (TS - TR), 1.6) : t < TE ? X0 + D1 + (X1 - X0 - D1) * (1 - Math.pow(1 - (t - TS) / (TE - TS), 2)) : X1);
const sledY = (x) => slopeY(x) + 24;
const SC = 0.8;
// position monde d'un point local (lx, ly) de la luge à l'instant t
const SEAT = { fox: -280, rab: -170, mimi: -60, coin: 50, hedge: 160, snail: 290 };
const loc = (lx, ly, t) => { const X = sledX(t), Y = sledY(X), a = lx * SC, b = ly * SC; return [X + a * cs - b * sn, Y + a * sn + b * cs]; };
const seat = (who, t) => loc(SEAT[who], -50, t);

// ───────── passagers ─────────
const B = [[0, 30, foxBeanie(0.5)]];
const foxP = fox({ run: null, upright: -6, noShadow: true, noBag: true, hat: B, talk: [[8.8, 9.9], [24.6, 26.0]],
  eyes: [[8.7, 10, 'arc'], [10, 13.9, 'wide'], [13.9, 17, 'oh'], [24.5, 27.5, 'arc']], moods: [[8.7, 10, 'happy'], [10, 13.9, 'panic'], [13.9, 17, 'oh'], [24.5, 30, 'happy']], jolt: 13.5 });
const rabP = rabbit({ run: null, noShadow: true, talk: [[0.6, 2.6]], eyes: [[0.5, 2.7, 'arc'], [10, 13.9, 'wide'], [13.9, 17, 'oh'], [24.5, 27.5, 'arc']],
  moods: [[0.5, 2.7, 'happy'], [10, 13.9, 'panic'], [13.9, 17, 'oh'], [24.5, 30, 'happy']], jolt: 13.5 });
const hedgeP = hedgehog([[4.0, 5.5], [26.2, 27.2]], { noShadow: true, eyes: [[3.9, 5.6, 'wide'], [10, 13.9, 'wide'], [26.1, 27.4, 'arc']],
  moods: [[10, 13.9, 'panic'], [26.1, 30, 'happy']], jolt: 13.5 });
const mimiP = pal('mouse', { talk: [[10.4, 11.9]], eyes: [[10, 13.9, 'wide'], [24.5, 27.5, 'arc']], moods: [[10.3, 11.9, 'oh'], [24.5, 30, 'happy']], jolt: [13.5] });
const coinP = pal('duck', { eyes: [[10, 13.9, 'wide'], [24.5, 27.5, 'arc']], moods: [[10, 13.9, 'oh'], [24.5, 30, 'happy']], jolt: [13.5] });
const pass = (who, k, inner) => `<g transform="translate(${SEAT[who]} -46) scale(${k})">${inner}</g>`;
const sledGroup = `${bigSled(0, 0, 1, { slope: false })}${pass('fox', 0.7, foxP)}${pass('rab', 0.68, rabP)}${pass('mimi', 1.0, mimiP)}${pass('coin', 1.0, coinP)}${pass('hedge', 0.82, hedgeP)}`;
const sledEl = track(`<g transform="scale(${SC})">${sledGroup}</g>`, 0, 30, (t) => {
  const x = sledX(t), shake = t > TR && t < TS ? Math.sin(t * 40) * 1.2 : 0;
  return { x, y: sledY(x) + shake, r: SLOPE_DEG + (t > TS && t < TE ? -5 * Math.sin(((t - TS) / (TE - TS)) * Math.PI) : 0), s: 1 };
}, 30);

// ───────── Mme Escargot ─────────
const SNAIL_K = 0.45;
const sT = [[3.8, 900], [7.0, 760]]; // arrivée en rampant (x au sol)
const GLIDE0 = 14.1, DOOR_X = 1130, ARR = 21.4;
const sg = (x) => G(x) + 16; // sol de l'escargot
const snailPos = (t) => {
  if (t < sT[0][0]) return [sT[0][1], sg(sT[0][1]), 0];
  if (t < sT[1][0]) { const u = (t - sT[0][0]) / (sT[1][0] - sT[0][0]), x = lerp(sT[0][1], sT[1][1], u); return [x, sg(x), 0]; }
  if (t < 8.6) { const u = ss(clamp01((t - 7.0) / 1.6)), [sx, sy] = seat('snail', 8.6), x0 = sT[1][1], y0 = sg(x0); return [lerp(x0, sx, u), lerp(y0, sy, u) - 90 * Math.sin(Math.PI * u), 0]; }
  if (t < GLIDE0) { const [x, y] = seat('snail', t); return [x, y, 0]; }
  const [fx, fy] = seat('snail', GLIDE0), fxg = fx + 38;
  if (t < GLIDE0 + 0.6) { const u = ss((t - GLIDE0) / 0.6); return [lerp(fx, fxg, u), lerp(fy, sg(fxg), u) - 30 * Math.sin(Math.PI * u), 0]; }
  const u = clamp01((t - GLIDE0 - 0.6) / (ARR - GLIDE0 - 0.6)), x = lerp(fxg, DOOR_X, u);
  return [x, sg(x), 0];
};
const crawl = (inner, wins) => `<g style="transform-origin:0 0;animation:${wins}">${inner}</g>`;
const crawlAn = [[3.8, 7.0], [14.7, ARR]].map(([a, b]) => an({ n: 's6crawl', d: 0.9, t: a, c: Math.round((b - a) / 0.9) }).replace('animation:', '')).join(',');
const sT_ = [[5.6, 7.0], [8.7, 9.6], [12.0, 13.4], [22.0, 23.7]];
const snailOpts = [[5.6, 7.0], [8.8, 9.6], [12.0, 13.4], [22.0, 23.7]];
const snailBody = (flip) => `<g transform="scale(${flip ? -SNAIL_K : SNAIL_K} ${SNAIL_K})">${snail(snailOpts, { toque: true })}</g>`;
const snailEl = vis(0, 8.6, track(crawl(snailBody(false), crawlAn), 0, 8.6, (t) => { const [x, y] = snailPos(t); return { x, y, r: 0, s: 1 }; }, 30))
  + vis(8.6, 30, track(crawl(snailBody(true), crawlAn), 8.6, 30, (t) => { const [x, y] = snailPos(t); return { x, y, r: t < GLIDE0 ? SLOPE_DEG : 0, s: 1 }; }, 30));

// ───────── décor ─────────
const CHX = 1130;
const bg = `${piste({ kind: 'day' })}${snowfall({ n: 16, speed: 0.7 })}${chalet(CHX, G(CHX) + 12, 0.55, { open: 21.6, smoke: true })}`;
const puffs = snowPoof(X1 - 200, G(X1 - 200) + 10, 13.3, 0.8);

const world = `${bg}${sledEl}${snailEl}${puffs}`;

// ───────── espace écran ─────────
const pastille = timeBadge(11, 0);
const tipAt = (m, t) => scr(m[0], m[1], t + 0.1);
const sp = (who, tx, t0, d, m, o = {}) => {
  const [x, y] = tipAt(m, t0);
  const bw = tx.length * (o.shout ? 50 : 41) * 0.56 + 56;
  return say(who, tx, t0, d, { bx: Math.max(x + (o.ox || 0), 310 + bw / 2), by: y - (o.up || 90), tips: [[x, y - (o.gap || 14)]], shout: o.shout });
};
const head = (who, h, t) => { const [x, y] = seat(who, t); return [x + 10, y - h]; };
const snailHead = (t) => { const [x, y] = snailPos(t); return [x, y - 150 * SNAIL_K * 1.15]; };
const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.45, t: 27.2, f: 'both' })}"><g transform="translate(640 130)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 4</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">La grande pente</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : la fondue</text></g></g>`;
const fx = pastille +
  sp('rab', 'Tous à bord ! Il est onze heures !', 0.6, 2.0, head('rab', 215, 0.6), { ox: 40 }) +
  sp('hedge', 'Vite, Madame Escargot !', 4.0, 1.5, head('hedge', 160, 4.0), { ox: 40 }) +
  sp('snail', 'J’arrive... tout doucement.', 5.6, 1.5, snailHead(5.6), { ox: 40 }) +
  sp('fox', 'Voilà ! En route !', 8.8, 1.0, head('fox', 215, 8.8), { ox: 30 }) +
  sp('mimi', 'On va vite !', 10.4, 1.4, head('mimi', 170, 10.4), { ox: 0, shout: true }) +
  sfx('FIOUUU', 560, 280, 10.0, 0.9, -8, '#ffffff', 64) +
  sp('snail', 'Tout doux... tout doux.', 12.0, 1.4, snailHead(12.0), { ox: 220, up: 120 }) +
  sfx('CRRRR !', 700, 560, 13.3, 0.9, -4, '#ffd23f', 70) +
  sp('snail', 'Je suis arrivée !', 22.0, 1.7, snailHead(22.0), { ox: -120 }) +
  sp('fox', 'Dernière, mais pile !', 24.6, 1.5, head('fox', 215, 24.6), { ox: 190, up: 60 }) +
  sp('hedge', 'C’est rigolo !', 26.2, 1.0, head('hedge', 160, 26.2), { ox: 40 }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#7cc8ff"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'chime', t: 0.3 }, { name: 'whoosh', t: 9.6 }, { name: 'slide', t: 10.0 }, { name: 'skid', t: 13.2 }, { name: 'door', t: 21.6 }, { name: 'laugh', t: 25.2 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./grande-pente.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 132, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
