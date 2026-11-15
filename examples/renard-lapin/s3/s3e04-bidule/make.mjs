// Roussin & Lino · Saison 3 · Épisode 4 « Bidule » — 30 s, 1280x720. 10h00, la plage.
//
// Découpage :
//  0.0– 4.0  plan large     Roussin fait la sieste sur sa serviette (10 h 00), Lino et Piquette installent la plage
//  4.0– 7.5  la rive        Bidule le crabe arrive de côté : « Hihi ! Tout droit ! » (il ne sait aller que de côté)
//  7.5–11.0  plan large     il rate sa cible et défile ; Lino : « Il va de côté ! »
// 11.0–14.8  gros plan      il s'approche du gros orteil, la pince s'ouvre : « Bonjour, gros orteil ! »
// 14.8–17.5  l'action       CLAC ! Roussin saute, tout droit, reste dans les airs, Bidule pendu à l'orteil
// 17.5–21.0  la réaction    en l'air : « Aïe ! » — Bidule : « Bonjour, Roussin ! »
// 21.0–25.0  la chute       ils retombent ; « Bon... bonjour, Bidule. »
// 25.0–27.0  plan large     tout le monde rit
// 27.0–30.0  plan large     carton « Saison 3 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { crab } from '../../lib/cast3.mjs';
import { seaBg, gull, rocks, towel, bucket, spade, starfish } from '../../lib/sea.mjs';
import { timeBadge } from '../../lib/badge.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 4.0, 540, 430, 1.25, 1.3],
  [4.0, 7.5, 600, 430, 1.25, 1.25],
  [7.5, 11.0, 575, 430, 1.25, 1.25],
  [11.0, 14.8, 860, 480, 1.7, 1.8],
  [14.8, 17.5, 640, 400, 1.1, 1.1],
  [17.5, 21.0, 640, 400, 1.1, 1.12],
  [21.0, 25.0, 540, 430, 1.25, 1.3],
  [25.0, 27.0, 540, 430, 1.25, 1.25],
  [27.0, 30, 540, 430, 1.25, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes zzz{0%{opacity:0;transform:translate(0,0) scale(.6)}15%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translate(40px,-70px) scale(1.2)}}
@keyframes puffk{0%{opacity:0;transform:scale(.3)}25%{opacity:1;transform:scale(1.1)}100%{opacity:0;transform:scale(1.7) translateY(-24px)}}`);

// ───────── trajectoires : pts = [[t, x, y, rot, scale]] (lissées) ─────────
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
// bulle ancrée sur un point du monde (la pointe suit la caméra du plan)
const talk = (who, text, t0, d, [wx, wy], o = {}) => {
  const [tx, ty] = scr(wx, wy, t0 + 0.2);
  const fs = o.shout ? 50 : 41, w = text.length * fs * 0.56 + 56;
  let bx = tx + (o.dx || 0); const by = ty - (o.up ?? 100);
  if (by < 175) bx = Math.max(bx, 250 + w / 2); // garde la pastille d'heure (haut gauche) libre
  return say(who, text, t0, d, { bx, by, tips: [[tx, ty]], shout: o.shout });
};

// ───────── décor ─────────
const GY = 640;
const bg = `${seaBg('day')}${gull(300, 130, 0.9)}${gull(780, 90, 0.7, 1.2)}${rocks(1190, 620, 0.75, 'pile')}`;
const FX0 = 800, FY0 = 575; // pieds de Roussin couché (rot -90)
const deco = `${towel(660, 648, 1.6, '#ff8fa3')}${bucket(470, 654, 0.85)}${spade(520, 655, 0.9, 20)}${starfish(930, 690, 0.45, '#ffb347')}`;

// ───────── personnages ─────────
const foxEl = mover(fox({ run: null, upright: -6, noShadow: true, noBag: true,
  talk: [[15.45, 16.3], [19.4, 20.8], [24.1, 25.5]],
  eyes: [[0, 14.9, 'closed'], [14.9, 18.5, 'wide'], [18.5, 21.0, 'sq'], [21.0, 23.3, 'down'], [23.3, 25.4, 'arc'], [25.4, 30, 'arc']],
  moods: [[0, 14.9, 'calm'], [14.9, 18.5, 'oh'], [18.5, 21.0, 'sad'], [21.0, 23.3, 'sad'], [23.3, 30, 'happy']] }), [
  [0, FX0, FY0 + 2, -90, 1], [2, FX0, FY0, -90, 1], [4, FX0, FY0 + 2, -90, 1], [6, FX0, FY0, -90, 1], [8, FX0, FY0 + 2, -90, 1], [10, FX0, FY0, -90, 1], [12, FX0, FY0 + 2, -90, 1], [14.0, FX0, FY0, -90, 1], [14.9, FX0, FY0, -90, 1],
  [15.5, 745, 460, -20, 1], [15.85, 700, 430, 0, 1], [17.0, 700, 438, 0, 1], [19.0, 700, 432, 0, 1], [20.9, 700, 438, 0, 1], [21.5, 700, GY, 0, 1], [30, 700, GY, 0, 1]]);
const CRY = GY;
const crabEl = mover(`<g transform="scale(-1 1)">${crab([[4.6, 5.6], [11.0, 12.6], [16.8, 18.0], [21.9, 23.3]], {
  walk: [[4.2, 7.0], [7.4, 10.6], [11.2, 14.3], [21.55, 21.9]], pinch: [[11.6, 13.2], [14.4, 15.0], [22.2, 24.4]], noShadow: false,
  eyes: [[0, 14.5, 'open'], [14.5, 15.0, 'wide'], [15.0, 21.0, 'arc'], [21.0, 30, 'arc']],
  moods: [[0, 30, 'happy']], blush: [[22.0, 25.0]], gest: [] })}</g>`, [
  [3.9, 1130, CRY, 0, 0.05], [4.2, 1130, CRY, 0, 1], [7.0, 950, CRY, 0, 1], [7.4, 950, CRY, 0, 1], [8.9, 965, CRY, 0, 1], [10.6, 920, CRY, 0, 1], [11.2, 920, CRY, 0, 1],
  [14.0, 899, CRY, 0, 1], [14.95, 899, CRY, 0, 1], [15.5, 850, 560, 12, 1], [15.9, 822, 515, -8, 1], [17.0, 822, 517, 10, 1], [18.2, 822, 515, -10, 1], [19.4, 822, 517, 8, 1], [20.8, 822, 515, -6, 1],
  [21.5, 822, CRY, 0, 1], [22.4, 850, CRY, 0, 1], [30, 850, CRY, 0, 1]]);
const rabEl = put(330, GY, 1.0, rabbit({ run: null, noBag: true, noShadow: true, jumps: [[14.95, 15.7, 50]],
  talk: [[0.8, 2.2], [7.6, 8.9], [18.2, 19.3]],
  eyes: [[0, 4.0, 'side'], [7.4, 9.0, 'wide'], [14.9, 21.0, 'wide'], [24.8, 27.5, 'arc']],
  moods: [[0, 7.4, 'happy'], [7.4, 9.0, 'oh'], [14.9, 21.0, 'oh'], [24.8, 30, 'happy']] }));
const hedgeEl = put(170, GY + 6, 1.0, hedgehog([[2.4, 3.5], [25.2, 26.3]], { noShadow: true,
  eyes: [[0, 4, 'side'], [14.9, 21.0, 'wide'], [25.0, 27.0, 'arc']],
  moods: [[0, 4, 'shy'], [14.9, 21.0, 'oh'], [25.0, 30, 'happy']], blush: [[25.0, 27.0]] }));
const zzz = [0, 1.7, 3.4, 5.1, 6.8, 8.5, 10.2, 11.9, 13.2].map((d) => vis(d + 0.2, d + 1.9, `<g transform="translate(560 485)"><g style="${an({ n: 'zzz', d: 1.7, t: d + 0.2, f: 'both' })}"><text class="sfx" style="font-size:44px;fill:#9fb3ff;stroke:#1d2550;stroke-width:3;paint-order:stroke">Z z z</text></g></g>`)).join('');
const landPuff = [0, 1, 2].map((i) => vis(21.5, 22.6, `<g transform="translate(${640 + i * 60} ${GY - 6})"><g style="${an({ n: 'puffk', d: 0.8, t: 21.5 + i * 0.05, f: 'both' })}"><circle r="${16 + i * 5}" fill="#f3e1b0" stroke="${INK}" stroke-width="3"/></g></g>`)).join('');

const dune = `<path d="M-40 720 L-40 694 Q200 668 420 692 T820 688 T1320 690 V720Z" fill="#ecd08a" stroke="${INK}" stroke-width="5"/>`;
const world = `${bg}${deco}${hedgeEl}${rabEl}${zzz}${foxEl}${crabEl}${landPuff}${dune}`;

// ───────── espace écran : heure, bulles, carton ─────────
const endCard = `<g style="transform-origin:640px 150px;${an({ n: 'finin', d: 0.3, t: 26.9, f: 'both' })}"><g transform="translate(640 150)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" text-anchor="middle" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 3</text>
  <text y="22" text-anchor="middle" class="bt" style="font-size:34px;fill:#2b5ba8">Bidule</text>
  <text y="64" text-anchor="middle" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : le château</text></g></g>`;
const fx =
  talk('rab', 'Roussin dort bien !', 0.8, 1.9, [345, GY - 335], { dx: 30 }) +
  talk('hedge', 'Il dort, doucement.', 2.4, 1.3, [175, GY - 180], { up: 90 }) +
  talk('crab', 'Moi, je vais tout droit !', 4.6, 1.6, [1100, GY - 190], { dx: -150, up: 90 }) +
  talk('rab', 'Il va de côté !', 7.6, 1.5, [345, GY - 335], { dx: 40 }) +
  talk('crab', 'Bonjour, gros orteil !', 11.0, 1.9, [920, GY - 190], { dx: 20, up: 140 }) +
  sfx('CLAC !', 880, 400, 14.5, 0.9, -8, '#ffd23f', 84, 'click') +
  talk('fox', 'Ça pince fort !', 15.45, 1.2, [735, 200], { shout: true, up: 70 }) +
  sfx('BOING !', 900, 260, 15.0, 0.8, 6, '#ff8fa3', 70, 'boing') +
  talk('crab', 'Bonjour !', 16.8, 1.3, [915, 455], { dx: 150, up: 75 }) +
  talk('rab', 'Il vole !', 18.2, 1.0, [345, GY - 335], { dx: 20 }) +
  talk('fox', 'Lâche mon orteil !', 19.4, 1.5, [735, 200], { up: 70 }) +
  talk('crab', 'On est amis ?', 21.9, 1.5, [850, GY - 190], { dx: 200, up: 120 }) +
  talk('fox', 'Bonjour, Bidule !', 24.1, 1.1, [715, GY - 250], { dx: -90, up: 90 }) +
  talk('hedge', 'Bidule est gentil !', 25.4, 1.3, [175, GY - 180], { up: 90 }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#7cc8ff"/>
<g style="${camStyle}">${world}</g>
${timeBadge(10, 0)}
${fx}
</svg>`;
sfxEv.push({ name: 'wave', t: 0.3 }, { name: 'step', t: 4.4 }, { name: 'step', t: 11.4 }, { name: 'laugh', t: 25.2 }, { name: 'poof', t: 21.5 }, { name: 'chime', t: 26.9 });
writeFileSync(new URL('./bidule.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 118, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
