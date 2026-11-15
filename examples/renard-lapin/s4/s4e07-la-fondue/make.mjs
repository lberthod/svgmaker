// Roussin & Lino · Saison 4 · Épisode 7 « La fondue » — 30 s, 1280x720. 12h30, le chalet.
//
// Découpage :
//  0.0– 3.5  plan large     le chalet, table de fondue ; Lino : « À table ! La fondue ! »
//  3.5– 8.6  Roussin + pot   « Je trempe mon pain ! », le pain plonge dans le caquelon (clink)
//  8.6–12.4  plan haut       Roussin tire : le fil de fromage s'étire jusqu'au plafond ; « Regardez, ça s'étire ! » ; Piquette : « Jusqu'au plafond ! »
// 12.4–18.4  les bouchées    Lino saute et grignote le fil, bouchée après bouchée ; Mimi : « Il est délicieux ! »
// 18.4–22.2  Roussin         le fil lâche, le pain retombe pile dans sa bouche ; « Mon pain revient ! »
// 22.2–27.0  plan large     rigolo, Mamie Marmotte dort dans son coin ; « Bon appétit ! »
// 27.0–30.0  carton « Saison 4 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { makeCam, say as say0, pal } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { marmot } from '../../lib/cast4.mjs';
import { chaletInside, fondue, snowPoof } from '../../lib/snow.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.5, 640, 400, 1.0, 1.04],
  [3.5, 8.6, 500, 470, 1.4, 1.45],
  [8.6, 12.4, 640, 360, 1.0, 1.0],
  [12.4, 18.4, 640, 340, 1.12, 1.12],
  [18.4, 22.2, 520, 480, 1.5, 1.55],
  [22.2, 27.0, 640, 420, 1.0, 1.03],
  [27.0, 30, 640, 420, 1.03, 1.0],
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

// ───────── décor : le chalet, la table de fondue ─────────
const FY = 640;               // pieds des personnages
const POTX = 640, POTY = 586, RIM = POTY - 140;
const TOP = 70;               // plafond (poutre)
const H0 = RIM - TOP;         // longueur du fil tendu
const table = `<g><rect x="150" y="574" width="980" height="26" rx="10" fill="#e8c590" stroke="${INK}" stroke-width="5"/>
  <rect x="168" y="598" width="944" height="130" fill="#fff" stroke="${INK}" stroke-width="5"/>
  ${Array.from({ length: 17 }, (_, i) => Array.from({ length: 5 }, (_, j) => ((i + j) % 2 ? '' : `<rect x="${168 + i * 55.53}" y="${598 + j * 26}" width="55.53" height="26" fill="#e8434e" opacity=".85"/>`)).join('')).join('')}
  <rect x="168" y="598" width="944" height="130" fill="none" stroke="${INK}" stroke-width="5"/></g>`;
const room = `${chaletInside({ clock: false, view: 'snow', fire: true })}
  <rect x="0" y="38" width="${W}" height="14" fill="#8a5a33" opacity=".55"/>`;
const pot = fondue(POTX, POTY, 1, {});
const bread = `<g><rect x="-26" y="-26" width="52" height="52" rx="9" fill="#f3d9a0" stroke="${INK}" stroke-width="4.5"/><path d="M-16 -14 H12" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/><path d="M-26 6 Q-28 28 -10 30 Q4 36 8 26 Q26 30 26 8 Q0 20 -26 6Z" fill="#ffd23f" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/></g>`;
// fil de fromage : version ancrée en bas (pousse vers le haut) et version ancrée en haut (se raccourcit par le bas)
const pathUp = (h) => `M0 0 Q-10 ${-h * 0.25} 0 ${-h * 0.5} Q10 ${-h * 0.75} 0 ${-h}`;
const pathDown = (h) => `M0 0 Q10 ${h * 0.25} 0 ${h * 0.5} Q-10 ${h * 0.75} 0 ${h}`;
const strand = (d) => `<path d="${d}" stroke="${INK}" stroke-width="15" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#ffd23f" stroke-width="8" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5" transform="translate(-2 0)"/>`;
const growS = vis(8.7, 10.0, `<g transform="translate(${POTX} ${RIM})">${tf(strand(pathUp(H0)), { t0: 8.7, d: 1.3, from: 'scaleY(.02)', to: 'scaleY(1)', e: 'ease-in-out', o: '0px 0px' })}</g>`);
// bouchées : [t0, t1, s0, s1] — le bas du fil remonte
const BITES = [[10.0, 13.0, 1, 1], [13.0, 13.4, 1, 0.88], [13.4, 14.8, 0.88, 0.88], [14.8, 15.2, 0.88, 0.7], [15.2, 16.4, 0.7, 0.7], [16.4, 16.8, 0.7, 0.52], [16.8, 17.5, 0.52, 0.52]];
const shrinkS = BITES.map(([a, b, s0, s1]) => vis(a, b, `<g transform="translate(${POTX} ${TOP})">${tf(strand(pathDown(H0)), { t0: a, d: Math.max(0.01, b - a), from: `scaleY(${s0})`, to: `scaleY(${s1})`, e: 'ease-out', o: '0px 0px' })}</g>`)).join('');
const hs = BITES[BITES.length - 1][3];
// le fil lâche : tout tombe vers Roussin
const fall = vis(17.5, 19.3, `<g transform="translate(${POTX} ${TOP})">${tf(`<g>${tf(strand(pathDown(H0)), { t0: 17.5, d: 0.55, from: `scaleY(${hs})`, to: 'scaleY(.2)', e: 'ease-in', o: '0px 0px' })}</g>`, { t0: 17.5, d: 0.55, from: 'translateY(0px)', to: `translateY(${FY - 140 - TOP - H0 * 0.2}px)`, e: 'ease-in', o: '0px 0px' })}</g>`);
const breadTop = vis(10.0, 17.5, `<g transform="translate(${POTX} ${TOP})">${bread}</g>`);
const breadFall = mover(bread, [[17.5, POTX, TOP, 0, 1], [18.05, 520, FY - 135, 20, 1], [18.3, 520, FY - 135, 20, 1], [18.9, 520, FY - 135, 20, 0.05]]);
// pain : plonge dans le caquelon puis remonte avec le fil
const breadDip = mover(bread, [[3.5, 480, 540, -8, 1], [5.5, 545, 480, -8, 1], [6.9, 606, 470, -6, 1], [7.5, 640, 482, 0, 1], [8.0, 640, 482, 0, 1], [8.7, 640, RIM - 10, 0, 1], [9.15, 640, RIM - 10, 0, 1],
  [10.0, POTX, TOP, 0, 1]]);
const fork = (p) => '';
const bitePuff = [[13.1, 0.8], [14.9, 0.8], [16.5, 0.9]].map(([t, s]) => snowPoof(0, 0, 99)).join('');
const crumbs = (t, x, y) => vis(t, t + 0.8, `<g transform="translate(${x} ${y})">${[0, 1, 2, 3].map((i) => `<g transform="translate(${(i - 1.5) * 10} ${-i * 4})"><circle r="${4 + (i % 2) * 2}" fill="#ffd23f" stroke="${INK}" stroke-width="2"/></g>`).join('')}</g>`);

// ───────── personnages ─────────
const foxEl = put(395, FY, 1.0, fox({ run: null, upright: -6, noShadow: true, noBag: true,
  talk: [[3.8, 5.4], [8.9, 10.3], [19.9, 21.3], [25.9, 27.0]],
  eyes: [[0, 3.5, 'side'], [3.6, 5.6, 'arc'], [8.5, 10.6, 'up'], [10.6, 17.4, 'up'], [17.6, 19.2, 'wide'], [19.2, 21.6, 'arc'], [22.2, 30, 'arc']],
  moods: [[3.6, 5.6, 'happy'], [8.5, 10.6, 'oh'], [10.6, 17.4, 'oh'], [17.6, 19.2, 'oh'], [19.2, 30, 'happy']],
  raise: [[8.6, 10.2]], blush: [[22.5, 27]] }));
const rabEl = put(800, FY, 1.0, rabbit({ run: null, noShadow: true, noBag: true,
  talk: [[0.5, 2.3], [12.9, 14.5], [24.3, 25.5]],
  eyes: [[0, 3.5, 'arc'], [3.5, 8.5, 'side'], [8.6, 12.4, 'wide'], [12.4, 19, 'arc'], [19, 22, 'wide'], [22.2, 30, 'arc']],
  moods: [[0, 3.5, 'happy'], [8.6, 12.4, 'oh'], [12.4, 30, 'happy']],
  jumps: [[13.0, 13.45, 60], [14.7, 15.2, 135], [16.3, 16.9, 205]] }), true);
const rabMove = (t) => ({ x: -105 * (ss(Math.min(1, Math.max(0, (t - 12.55) / 0.4))) - ss(Math.min(1, Math.max(0, (t - 18.6) / 0.5)))), y: 0 });
const rabTrack = track(rabEl, 0, DUR, rabMove, 15);
const hedgeEl = put(195, FY + 4, 1.0, hedgehog([[10.7, 12.1], [22.6, 23.6]], { noShadow: true,
  eyes: [[0, 8.6, 'side'], [8.6, 12.4, 'wide'], [12.4, 19, 'side'], [22.4, 24.0, 'arc']],
  moods: [[0, 8.6, 'shy'], [8.6, 12.4, 'oh'], [22.4, 30, 'happy']], blush: [[0.4, 3.0]] }));
const mimiEl = put(1000, FY - 10, 1.0, pal('mouse', { talk: [[15.4, 17.0]], eyes: [[0, 8.6, 'arc'], [8.6, 12.4, 'wide'], [12.4, 30, 'arc']], moods: [[0, 30, 'happy']], giggle: [[22.2, 24.0]] }));
const marmotEl = put(1140, FY - 40, 0.8, marmot([], { sleep: [[0, 99]], noShadow: true }));

const world = `${room}${hedgeEl}${foxEl}${mimiEl}${marmotEl}${rabTrack}${table}${pot}${growS}${shrinkS}${fall}${breadDip}${breadTop}${breadFall}${crumbs(13.0, 700, 440)}${crumbs(14.8, 690, 360)}${crumbs(16.4, 680, 290)}`;

// ───────── espace écran ─────────
const FM = [445, FY - 255], RM = [745, FY - 300], HM = [245, FY - 215], MM = [1000, FY - 180];
const tip = (m, t, dx = 0, dy = 0) => { const p = scr(m[0], m[1], t); return [p[0] + dx, p[1] + dy]; };
const pill = timeBadge(12, 30);
const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.45, t: 27.2, f: 'both' })}"><g transform="translate(640 160)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 4</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">La fondue</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : la sieste</text></g></g>`;
const fx = pill +
  say('rab', 'À table ! La fondue !', 0.5, 1.9, { bx: 760, by: 180, tips: [tip(RM, 0.5, 10, -10)] }) +
  say('fox', 'Je trempe mon pain !', 3.8, 1.7, { bx: 700, by: 160, tips: [tip(FM, 3.8, -10, -20)] }) +
  sfx('CLINK', 760, 330, 7.3, 0.8, -6, '#ffd23f', 70, 'clink') +
  say('fox', 'Regardez, ça s’étire !', 8.9, 1.5, { bx: 420, by: 190, tips: [tip(FM, 8.9, -10, -20)], shout: true }) +
  say('hedge', 'Jusqu’au plafond !', 10.7, 1.6, { bx: 520, by: 300, tips: [tip(HM, 10.7, 0, -30)] }) +
  sfx('POUF', 760, 140, 10.0, 0.7, 8, '#ffffff', 56) +
  say('rab', 'Je grignote le bas !', 12.9, 1.8, { bx: 900, by: 180, tips: [tip(RM, 12.9, 10, -50)] }) +
  sfx('MIAM', 860, 330, 13.1, 0.7, -8, '#ffd23f', 54, 'tummy') +
  sfx('MIAM', 840, 260, 14.8, 0.7, 6, '#ffd23f', 54) +
  say('mimi', 'Il est délicieux !', 15.4, 1.6, { bx: 940, by: 170, tips: [tip(MM, 15.4, 0, -30)] }) +
  sfx('PLOP !', 780, 480, 18.15, 0.8, -6, '#ffffff', 70, 'poof') +
  say('fox', 'Mon pain revient !', 19.9, 1.6, { bx: 470, by: 190, tips: [tip(FM, 19.9, 0, -30)], shout: true }) +
  say('hedge', 'C’est rigolo !', 22.6, 1.4, { bx: 330, by: 300, tips: [tip(HM, 22.6, 0, -30)] }) +
  say('rab', 'Bon appétit !', 24.3, 1.3, { bx: 780, by: 200, tips: [tip(RM, 24.3, 10, -10)] }) +
  say('fox', 'C’est trop bon !', 25.9, 1.1, { bx: 480, by: 230, tips: [tip(FM, 25.9, 0, -20)] }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#c98a4e"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'chime', t: 0.3 }, { name: 'whoosh', t: 8.8 }, { name: 'tummy', t: 14.8 }, { name: 'laugh', t: 22.6 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./la-fondue.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 104, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
