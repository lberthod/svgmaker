import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, ao, vis, tf, sfx, fox, rabbit, owl, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { makeCam, say as say0, pal, stars } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog, badger } from '../../lib/cast2.mjs';
import { marmot, ibex, lynx } from '../../lib/cast4.mjs';
import * as S from '../../lib/snow.mjs';

const DUR = 30;
// bulles ×1,25 (fs 41, 50 pour les cris) ; évite la pastille d'heure en haut à gauche
const say = (w, tx, a, d, o = {}) => {
  const fs = o.shout ? 50 : 41, ww = tx.length * fs * 0.56 + 56;
  const x = Math.min(Math.max(o.bx, ww / 2 + 16), W - 16 - ww / 2);
  const by = x - ww / 2 < 290 ? Math.max(o.by, 190) : o.by;
  return say0(w, tx, a, d, { ...o, fs, by });
};
const lerp = (a, b, u) => a + (b - a) * u;
const clamp01 = (u) => Math.min(1, Math.max(0, u));
// trajectoire : pts = [[t, x, y, rot, échelle, signe(flip)]] ; mod(t,p) pour surcharger
const path = (pts, mod) => (t) => {
  let i = 0; while (i < pts.length - 2 && t > pts[i + 1][0]) i++;
  const [a, xa, ya, ra = 0, sa = 1, fa = 1] = pts[i], [b, xb, yb, rb = 0, sb = 1] = pts[i + 1];
  const u = ss(clamp01((t - a) / (b - a))), s = lerp(sa, sb, u);
  const p = { x: lerp(xa, xb, u), y: lerp(ya, yb, u), r: lerp(ra, rb, u), sx: s * fa, sy: s };
  return mod ? mod(t, p) : p;
};
const actor = (inner, fn, fps = 20) => track(inner, 0, DUR, fn, fps);
// pastille d'heure (écran, en haut à gauche, toujours entière)
const hud = (h, m) => timeBadge(h, m);
// sommet de tête (monde) par personnage : [dx, dy] à l'échelle 1, dx inversé si flip
const tipOf = (kind, fn, t, dx = 0, dy = -8) => { const p = fn(t), f = p.sx < 0 ? -1 : 1, [hx, hy] = HEAD[kind]; return [p.x + f * hx * p.sy + dx, p.y + hy * p.sy + dy]; };
const HEAD = { fox: [60, -285], rab: [30, -322], hedge: [5, -238], ibex: [30, -312], lynx: [35, -212], marmot: [40, -248], owl: [0, -200], pal: [0, -190], badger: [30, -250] };
const endCard = (title, next, t = 27.4) => `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.45, t, f: 'both' })}"><g transform="translate(640 150)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 4</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">${title}</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">${next}</text></g></g>`;
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}`);
const svgOut = (name, camStyle, bgWorld, world, fx, bpm) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#cfe8ff"/>
<g style="${camStyle}">${bgWorld}${world}</g>
${fx}
</svg>`;
  writeFileSync(new URL(`./${name}.svg`, import.meta.url), svg);
  writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm, lines, sfx: sfxEv }, null, 1));
  console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
};

// Roussin & Lino · Saison 4 · Épisode 12 « La fête » — 30 s, 1280x720. 17h30, dans le chalet : on décore le sapin.
//
// Découpage :
//  0.0– 3.5  plan large     pastille 17 h 30 ; Mamie Marmotte : « Décorons le grand sapin ! »
//  3.5– 8.0  les boules     Lino pose les boules sur le sapin ; Mamie s'endort debout
//  8.0–12.0  les lumières   Roussin court autour du sapin avec la guirlande et s'enroule dedans : « Je suis coincé, Lino ! »
// 12.0–16.0  le sapin       Roussin clignote comme un sapin ; Mamie se réveille : « Quel beau sapin... il parle ! »
// 16.0–20.0  l'étoile       Piquette arrive : « Il manque une étoile ! » ; elle bondit sur la tête de Roussin
// 20.0–24.0  sur la pointe  « Je suis l'étoile ! » — Roussin : « Je suis un vrai sapin ! »
// 24.0–30.0  plan large     « Joyeuses fêtes ! » — carton final
const SHOTS = [
  [0, 3.5, 640, 450, 1.1, 1.1],
  [3.5, 8.0, 780, 450, 1.35, 1.35],
  [8.0, 12.0, 788, 450, 1.3, 1.3],
  [12.0, 15.0, 700, 455, 1.6, 1.6],
  [15.0, 17.2, 640, 450, 1.15, 1.15],
  [17.2, 20.0, 800, 463, 1.4, 1.4],
  [20.0, 24.0, 760, 463, 1.35, 1.35],
  [24.0, 30, 640, 450, 1.1, 1.1],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
const tp = (kind, fn, t, dx = 0, dy = -8) => { const [x, y] = tipOf(kind, fn, t, dx, dy); return scr(x, y, t); };
const bg = S.chaletInside({ clock: false, view: 'dusk', fire: true, tree: false });

// ───────── trajectoires ─────────
const FY = 640, TX = 960, R = 130, T0 = 8.3, T1 = 11.6;
const ph = (t) => Math.PI + Math.PI * 2 * 1.5 * ss(clamp01((t - T0) / (T1 - T0)));
// Roussin : debout à gauche, orbite autour du sapin, puis planté à gauche du sapin
const foxFn = (t) => {
  const s = 0.85, bob = t >= 19.1 && t < 20.4 ? 6 : 0;
  if (t < T0) { const u = ss(clamp01((t - 7.6) / 0.7)); return { x: 700 + (TX - R - 700) * u, y: FY, r: 0, sx: s, sy: s }; }
  if (t < T1) { const th = ph(t); return { x: TX + R * Math.cos(th), y: FY + 26 * Math.sin(th), r: 0, sx: s * (-Math.sin(th) >= 0 ? 1 : -1), sy: s }; }
  const sway = t >= 11.8 ? Math.sin((t - 11.8) * 3) * 3 : 0;
  return { x: TX - R, y: FY + bob, r: sway, sx: s, sy: s };
};
const rabFn = path([[0, 460, FY, 0, 0.85, 1], [30, 460, FY, 0, 0.85, 1]]);
const marmotFn = path([[0, 235, FY, 0, 0.85, 1], [30, 235, FY, 0, 0.85, 1]]);
const hedgeFn = path([[0, 1330, 685, 0, 0.9, -1], [16.8, 1330, 685, 0, 0.9, -1], [17.7, 1040, 685, 0, 0.9, -1], [18.6, 1040, 685, 0, 0.9, -1], [18.9, 960, 500, 0, 0.75, -1], [19.2, 878, 392, 0, 0.5, -1], [30, 878, 392, 0, 0.5, -1]]);

// ───────── personnages ─────────
const star = `<g transform="translate(6 -226) scale(.9)"><path d="M0 -26 L8 -9 L26 -7 L13 6 L16 25 L0 16 L-16 25 L-13 6 L-26 -7 L-8 -9Z" fill="#ffd23f" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/></g>`;
const wrap = vis(9.3, 30, `<g transform="translate(0 0)">${S.lightString(-72, -150, 86, -128, { n: 7, sag: 12 })}</g>`) + vis(10.0, 30, S.lightString(-70, -104, 84, -84, { n: 7, sag: 12 })) + vis(10.7, 30, S.lightString(-60, -58, 78, -38, { n: 6, sag: 12 }));
const foxEl = actor(`${fox({ run: null, upright: -6, noShadow: true, talk: [[7.5, 9.0], [10.8, 12.2], [20.0, 21.8]],
  hat: [[0, 30, S.foxBeanie(0)]],
  eyes: [[7.4, 9.0, 'arc'], [9.0, 12.5, 'wide'], [12.5, 19.0, 'sq'], [19.0, 30, 'arc']],
  moods: [[7.4, 9.0, 'happy'], [9.0, 12.5, 'oh'], [12.5, 19.0, 'sad'], [19.0, 30, 'happy']] })}${wrap}`, foxFn);
const rabEl = actor(rabbit({ run: null, noShadow: true, talk: [[13.5, 15.0], [22.9, 24.3]], point: [[4.0, 6.5]],
  eyes: [[3.8, 5.8, 'arc'], [9.0, 12.0, 'wide'], [12.2, 14.0, 'arc'], [22.0, 24.0, 'arc']],
  moods: [[3.8, 5.8, 'happy'], [9.0, 12.0, 'oh'], [12.2, 14.0, 'happy'], [22.0, 30, 'happy']] }), rabFn);
const marmotEl = actor(marmot([[0.6, 2.4], [15.1, 17.0], [24.0, 26.0]], { noShadow: true, sleep: [[4.2, 14.9]],
  eyes: [[0.5, 2.6, 'arc'], [15.0, 17.0, 'wide'], [24.0, 26.2, 'arc']], moods: [[0.5, 2.6, 'happy'], [15.0, 17.0, 'oh'], [24.0, 30, 'happy']] }), marmotFn);
const hedgeEl = actor(`${hedgehog([[17.8, 19.0], [19.6, 20.6]], { noShadow: true,
  eyes: [[16.8, 19.0, 'wide'], [19.2, 30, 'arc']], moods: [[16.8, 19.0, 'oh'], [19.2, 30, 'happy']] })}${vis(19.0, 30, star)}`, hedgeFn);
const bareTree = S.xmasTree(TX, 625, 1, { lit: false, star: false, balls: false });
const ballTree = S.xmasTree(TX, 625, 1, { lit: false, star: false, balls: true });
const treeEl = `${vis(0, 5.2, bareTree)}${vis(5.2, 30, ballTree)}`;
const world = `${treeEl}${vis(0, 3.5, marmotEl)}${vis(12.0, 17.4, marmotEl)}${vis(24.0, 30, marmotEl)}${rabEl}${vis(0, 30, foxEl)}${vis(16.0, 30, hedgeEl)}${vis(5.0, 5.9, S.snowPoof(TX, 520, 5.0, 0.6))}`;

const sayT = (who, kind, fn, text, t0, d, by, o = {}) => { const tip = tp(kind, fn, t0 + 0.25); return say(who, text, t0, d, { bx: tip[0], by, tips: [tip], ...o }); };
const fx = hud(17, 30) +
  sayT('marmot', 'marmot', marmotFn, 'Décorons le grand sapin !', 0.6, 2.0, 170) +
  sfx('CLIC', 1000, 330, 5.2, 0.7, -6, '#ffd23f', 60) +
  sayT('fox', 'fox', foxFn, 'Moi, je pose les lumières !', 7.5, 2.0, 140) +
  sfx('VRRR', 1000, 330, 9.0, 0.9, 6, '#ffd23f', 70) +
  sayT('fox', 'fox', foxFn, 'Je suis coincé, Lino !', 10.7, 1.5, 130, { shout: true }) +
  sfx('BLING', 830, 330, 12.4, 1.0, -4, '#ffd23f', 60, 'chime') +
  sayT('rab', 'rab', rabFn, 'Tu brilles comme un sapin !', 13.5, 1.6, 140) +
  sayT('marmot', 'marmot', marmotFn, 'Quel beau sapin... il parle !', 15.1, 2.1, 190) +
  sayT('hedge', 'hedge', hedgeFn, 'Il manque une étoile !', 17.4, 1.5, 200) +
  sfx('BOING', 1000, 420, 18.9, 0.8, -8, '#ffffff', 70) +
  sayT('hedge', 'hedge', hedgeFn, 'Je suis l’étoile !', 19.6, 1.2, 110, {}) +
  sayT('fox', 'fox', foxFn, 'Je suis un vrai sapin !', 20.9, 1.7, 110, {}) +
  sayT('rab', 'rab', rabFn, 'Piquette est notre étoile !', 22.8, 1.5, 170) +
  sayT('marmot', 'marmot', marmotFn, 'Joyeuses fêtes, mes petits !', 24.2, 2.2, 200) +
  endCard('La fête', 'Prochain épisode : le gâteau', 27.6);

sfxEv.push({ name: 'click', t: 5.2 }, { name: 'whoosh', t: 8.4 }, { name: 'chime', t: 10.9 }, { name: 'boing', t: 18.9 }, { name: 'chime', t: 12.4 }, { name: 'yawn', t: 4.4 }, { name: 'chime', t: 27.6 });
svgOut('fete', camStyle, bg, world, fx, 112);
