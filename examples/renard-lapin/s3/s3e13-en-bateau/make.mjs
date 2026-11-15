// Roussin & Lino · Saison 3 · Épisode 13 « En bateau » — 30 s, 1280x720. 17h00, en mer avec le Capitaine Gaston.
//
// Découpage :
//  0.0– 3.5  plan large     le petit bateau sur la mer, pastille 17 h 00 ; Gaston : « Tous à bord, mes petits ! »
//  3.5– 7.0  Lino & Piquette  « Quelle belle mer ! » — Piquette, courageuse : « J'aime bien le bateau ! »
//  7.0–10.0  la lanterne     Gaston fier de sa lanterne porte-bonheur, au mât
// 10.0–13.5  la vague        « Attention, grosse vague ! » SPLASH, le bateau tangue, la lanterne tombe et se fend
// 13.5–17.0  Lino            « Mon seau fait écope ! » il écope à grands gestes
// 17.0–21.0  le nœud         « Un nœud avec ma montre ! » la lanterne remonte au mât, la montre pend dessous
// 21.0–25.0  la lueur        la lanterne brille : « Elle brille encore ! » — « C\'est rigolo, merci Lino ! »
// 25.0–30.0  plan large     Gaston : « Bravo, matelot Lino ! » carton + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { splash } from '../../lib/farm.mjs';
import { pelican } from '../../lib/cast3.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { seaView, boat, bucket, lantern } from '../../lib/sea.mjs';
import { timeBadge } from '../../lib/badge.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const BX = 640, BY = 640, S = 1.9;               // bateau dans le monde
const B = (x, y) => [BX + x * S, BY + y * S];      // coordonnées bateau -> monde
const SHOTS = [
  [0, 3.5, 640, 380, 1.0, 1.08],
  [3.5, 7.0, 640, 400, 1.15, 1.2],
  [7.0, 10.0, 660, 400, 1.15, 1.15],
  [10.0, 13.5, 640, 380, 1.0, 1.05],
  [13.5, 17.0, 680, 400, 1.15, 1.2],
  [17.0, 21.0, 680, 400, 1.2, 1.2],
  [21.0, 25.0, 650, 400, 1.12, 1.15],
  [25.0, 30, 640, 380, 1.0, 1.0],
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

// ───────── personnages (dans le bateau, coordonnées bateau) ─────────
const PEL = -135, FOX = 5, RAB = 85, HED = 170;
const K = 0.55, FY = -40;
const inB = (x, el) => `<g transform="translate(${x} ${FY}) scale(${K} ${K})">${el}</g>`;
const pelEl = pelican([[0.6, 3.0], [7.3, 9.4], [10.2, 11.8], [21.4, 23.0]], { noShadow: true, point: [[8.0, 9.4]],
  eyes: [[0, 10, 'open'], [10.0, 12.2, 'wide'], [21.2, 23.4, 'arc'], [25.0, 27.5, 'arc']],
  moods: [[0, 30, 'happy'], [10.0, 12.2, 'oh']] });
const foxEl = fox({ run: null, upright: -6, noShadow: true, noBag: true,
  talk: [[12.0, 13.4], [19.4, 20.8], [23.4, 24.9]],
  eyes: [[3.5, 7, 'side'], [11.0, 13.6, 'wide'], [17.0, 20.6, 'side'], [23.2, 25, 'arc']],
  moods: [[5.2, 7, 'happy'], [11.0, 13.6, 'oh'], [19.2, 21, 'happy'], [23.2, 30, 'happy']], blush: [[23.4, 24.9]] });
const watchHand = `<g transform="translate(-6 -8) scale(.7)"><path d="M0 -40 V-18" stroke="#ffc933" stroke-width="5"/><circle r="22" fill="#fff" stroke="${INK}" stroke-width="5"/><circle r="22" fill="none" stroke="#ffc933" stroke-width="3" transform="scale(.7)"/><path d="M0 0 V-14 M0 0 L10 4" stroke="${INK}" stroke-width="4" stroke-linecap="round"/></g>`;
const bucketHand = vis(13.0, 99, `<g transform="translate(18 -2) rotate(-20) scale(.55)">${bucket(0, 0, 1)}</g>`) + vis(16.2, 19.3, watchHand);
const hedEl = hedgehog([[3.7, 5.1], [21.5, 22.9]], { noShadow: true,
  eyes: [[0, 10, 'wide'], [10.0, 13.5, 'wide'], [21.2, 25, 'arc']],
  moods: [[0, 10, 'happy'], [10.0, 13.5, 'oh'], [13.5, 30, 'happy']], blush: [[3.7, 5.1]] });
const rabEl = rabbit({ run: null, noBag: true, noShadow: true, item: bucketHand,
  talk: [[13.4, 14.8], [17.4, 19.2]], gest: [[13.6, 16.6]],
  eyes: [[3.6, 5.2, 'arc'], [13.2, 15.0, 'wide'], [15.0, 17.0, 'sq'], [17.2, 19.2, 'arc'], [21.0, 25.5, 'arc']],
  moods: [[3.6, 5.2, 'happy'], [13.2, 17.0, 'oh'], [17.2, 30, 'happy']], blush: [[23.0, 25.0]] });

// ───────── lanterne : au mât, tombe à la vague, remonte avec la montre ─────────
const MAST = [100, -246], LAND = [84, -92];
const lampOn = lantern(0, 0, 0.75, { lit: 0 });
const lampOff = lantern(0, 0, 0.75, { lit: 99, cracked: true });
const lampFix = lantern(0, 0, 0.75, { lit: 0, cracked: true });
const chain = `<path d="M0 -20 Q-8 -50 0 -78" stroke="#ffc933" stroke-width="5" fill="none" stroke-linecap="round"/><circle cy="-34" r="7" fill="#ffc933" stroke="${INK}" stroke-width="3"/>`;
const watch = `<g transform="translate(0 78)"><g style="--a:14deg;transform-origin:0px -50px;animation:swing 0.7s ease-in-out infinite alternate"><path d="M0 -50 V-12" stroke="#ffc933" stroke-width="4"/><circle r="17" fill="#fff" stroke="${INK}" stroke-width="4"/><circle r="17" fill="none" stroke="#ffc933" stroke-width="3" transform="scale(.7)"/><path d="M0 0 V-11 M0 0 L8 3" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><rect x="-5" y="-23" width="10" height="7" rx="2" fill="#ffc933" stroke="${INK}" stroke-width="2.5"/></g></g>`;
const lampMast = vis(0, 10.9, `<g transform="translate(${MAST[0]} ${MAST[1]})">${lampOn}</g>`) +
  vis(19.2, 99, `<g transform="translate(${MAST[0]} ${MAST[1]})">${lampFix}${chain}${watch}</g>`);
const lampFall = mover(lampOff, [[10.9, MAST[0], MAST[1], 0], [11.2, MAST[0] - 4, MAST[1] + 90, 18], [11.5, LAND[0], LAND[1], 40], [11.7, LAND[0], LAND[1], 32], [17.4, LAND[0], LAND[1], 32]]) +
  mover(lampOff, [[17.4, LAND[0], LAND[1], 32], [18.3, 70, -150, 10], [19.2, MAST[0], MAST[1], 0]]);
const inside = `${lampMast}${inB(PEL, pelEl)}${inB(FOX, foxEl)}${inB(RAB, rabEl)}${inB(HED, hedEl)}${lampFall}`;

const drops = (t0, x, y) => [0, 1, 2, 3, 4].map((i) => vis(t0 + i * 0.03, t0 + 1.0, `<g transform="translate(${x} ${y})"><g style="--dx:${30 + i * 18}px;--dy:${-60 - (i % 3) * 26}px;${an({ n: 'drop', d: 0.9, t: t0 + i * 0.03, f: 'both', e: 'cubic-bezier(.2,.8,.5,1)' })}"><path d="M0 0 q-7 12 0 17 q7 -5 0 -17z" fill="#8fd3ff" stroke="${INK}" stroke-width="2.5"/></g></g>`)).join('');
const boatEl = boat(0, 0, 1, { sail: false, col: '#e8434e', inside });
const bailDrops = [14.2, 14.9, 15.6, 16.3].map((t) => drops(t, 205, -105)).join('');
const boatShake = `<g style="--s:7px;${an({ n: 'shake', d: 0.05, t: 11.0, c: 12, dir: 'alternate' })}">${boatEl}${bailDrops}</g>`;

// ───────── décor ─────────
const frontWave = `<g style="animation:swave 3s ease-in-out infinite alternate"><path d="M-100 ${BY + 6} ${Array.from({ length: 22 }, () => 'q40 -22 80 0').join(' ')} V${H + 40} H-100Z" fill="#37a9e4" stroke="${INK}" stroke-width="5" opacity=".95"/><path d="M-100 ${BY + 30} ${Array.from({ length: 22 }, () => 'q40 -16 80 0').join(' ')}" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".6"/></g>`;
const world = `${seaView('day', { sun: true })}
  <g transform="translate(${BX} ${BY}) scale(${S})">${boatShake}</g>${frontWave}
  ${vis(11.0, 12.6, splash(B(190, 10)[0], BY, 11.0, 3.0, 13))}${vis(11.15, 12.6, splash(B(-150, 10)[0], BY, 11.15, 2.4, 11))}`;

// ───────── interface écran ─────────
const hud = timeBadge(17, 0);
const HM = { pel: [PEL + 20, -182], fox: [FOX + 30, -158], rab: [RAB + 32, -205], hed: [HED + 10, -120] };
const tip = (k, t) => scr(...B(...HM[k]), t);
// bulle : décalée de dx par rapport à la pointe (pour dégager les oreilles de Lino)
const sy = (who, text, t0, d, k, by, dx = 0, o = {}) => { const tp = tip(k, t0); return say(who, text, t0, d, { bx: tp[0] + dx, by, tips: [tp], ...o }); };
const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.3, t: 26.9, f: 'both' })}"><g transform="translate(640 130)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 3</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">En bateau</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : la pluie de poissons</text></g></g>`;
const fx = hud +
  sy('pelican', 'Tous à bord, mes petits !', 0.6, 2.4, 'pel', 150, 220) +
  sy('hedge', 'Quelle belle mer !', 3.7, 1.7, 'hed', 130, -170) +
  sy('pelican', 'Ma lanterne magique !', 7.3, 2.4, 'pel', 150, 280) +
  sy('pelican', 'Attention, grosse vague !', 10.2, 1.5, 'pel', 150, 250, { shout: true }) +
  sfx('SPLASH !', 230, 560, 11.0, 0.9, -6, '#4fb3ff', 70, 'splash') +
  sy('fox', 'La lanterne est cassée !', 12.0, 1.5, 'fox', 150, -150) +
  sy('rab', 'Mon seau vide l’eau !', 13.6, 1.5, 'rab', 90, -170) +
  sfx('SPLASH !', 1100, 590, 14.2, 0.7, 6, '#4fb3ff', 54) +
  sy('rab', 'Ma montre accroche la lanterne !', 17.4, 2.0, 'rab', 90, -170) +
  sy('fox', 'Elle brille encore !', 19.4, 1.5, 'fox', 150, -260) +
  sy('pelican', 'Bravo, matelot Lino !', 21.4, 1.6, 'pel', 150, 240) +
  sy('fox', 'Merci Lino, on rentre !', 23.4, 1.5, 'fox', 150, -80) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#7cc8ff"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'bell', t: 0.4 }, { name: 'wave', t: 7.0 }, { name: 'whoosh', t: 10.6 },
  { name: 'splash', t: 14.4 }, { name: 'splash', t: 15.6 }, { name: 'click', t: 18.6 }, { name: 'bell', t: 21.0 }, { name: 'chime', t: 26.9 });
writeFileSync(new URL('./en-bateau.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 100, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
