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

// Roussin & Lino · Saison 4 · Épisode 11 « Les patins » — 30 s, 1280x720. 16h00, le lac gelé.
//
// Découpage :
//  0.0– 3.5  Mme Chouette   pastille 16 h 00 ; « Tout le monde, on patine ! » ; Roussin et Lino côte à côte
//  3.5– 7.0  le train       Mimi et Coin glissent en train depuis la droite : « Regardez, c'est un train ! »
//  7.0–11.0  l'écharpe      Roussin tend son écharpe à Lino ; ils partent ; « Tu tires trop fort, Roussin ! »
// 11.0–15.0  la ronde       chacun tire de son côté : ils tournent en rond autour de l'écharpe, étourdis
// 15.0–19.5  le train       Mimi : « Vous êtes très rigolos ! » ; Coin : « Venez, faites le train ! »
// 19.5–23.5  tous attachés  Roussin, Lino, Mimi, Coin forment un seul train qui tressaute
// 23.5–30.0  plan large     « En avant, mes amis ! » — carton final
const SHOTS = [
  [0, 3.5, 457, 450, 1.4, 1.4],
  [3.5, 8.0, 747, 450, 1.2, 1.2],
  [8.0, 12.0, 560, 450, 1.4, 1.4],
  [12.0, 16.0, 560, 450, 1.5, 1.5],
  [16.0, 19.5, 780, 450, 1.4, 1.4],
  [19.5, 23.5, 780, 450, 1.3, 1.3],
  [23.5, 30, 640, 450, 1.0, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
const tp = (kind, fn, t, dx = 0, dy = -8) => { const [x, y] = tipOf(kind, fn, t, dx, dy); return scr(x, y, t); };
const bg = `${S.snowBg({ kind: 'day', fall: false })}${S.frozenLake(640, 650, 1)}`;

// ───────── trajectoires ─────────
const Y = 640, CX = 580, R = 110, T0 = 9.5, T1 = 15.0;
const theta = (t, off) => Math.PI + off + Math.PI * 2 * 3 * ss(clamp01((t - T0) / (T1 - T0)));
const orbit = (off, sBase, fStart, fEnd) => (t) => {
  let x, y, sx = sBase * fStart;
  if (t >= T0 && t < T1) { const th = theta(t, off); x = CX + R * Math.cos(th); y = Y + 24 * Math.sin(th); sx = sBase * (-Math.sin(th) >= 0 ? 1 : -1); }
  else { const th = Math.PI + off; x = CX + R * Math.cos(th); y = Y + 24 * Math.sin(th); if (t >= 19.5) sx = sBase * fEnd; else if (t >= T1) sx = sBase * fStart; }
  const bob = t >= 21.5 && t < 27.5 ? -Math.abs(Math.sin((t - 21.5) * 5)) * 14 : 0;
  return { x, y: y + bob, r: 0, sx, sy: sBase };
};
const foxFn = orbit(0, 0.85, 1, -1), rabFn = orbit(Math.PI, 0.85, -1, -1);
const mimiFn = path([[0, 1330, 690, 0, 1.1, -1], [3.5, 1330, 690, 0, 1.1, -1], [5.0, 1030, 690, 0, 1.1, -1], [19.5, 1030, 690, 0, 1.1, -1], [21.0, 880, 650, 0, 1.1, -1], [30, 880, 650, 0, 1.1, -1]], (t, p) => { if (t >= 21.5 && t < 27.5) p.y -= Math.abs(Math.sin((t - 21.5) * 5 + 0.5)) * 14; return p; });
const coinFn = path([[0, 1490, 690, 0, 1.1, -1], [3.5, 1490, 690, 0, 1.1, -1], [5.0, 1190, 690, 0, 1.1, -1], [19.5, 1190, 690, 0, 1.1, -1], [21.0, 1040, 650, 0, 1.1, -1], [30, 1040, 650, 0, 1.1, -1]], (t, p) => { if (t >= 21.5 && t < 27.5) p.y -= Math.abs(Math.sin((t - 21.5) * 5 + 1)) * 14; return p; });
const owlFn = path([[0, 200, 610, 0, 0.9, 1], [30, 200, 610, 0, 0.9, 1]]);
// écharpe tendue entre Roussin et Lino (segment étiré, point gauche -> point droit)
const scarfFn = (t) => {
  const a = foxFn(t), b = rabFn(t), [l, r] = a.x <= b.x ? [a, b] : [b, a];
  const A = [l.x, l.y - 100], B = [r.x, r.y - 100], L = Math.hypot(B[0] - A[0], B[1] - A[1]);
  return { x: A[0], y: A[1], r: (Math.atan2(B[1] - A[1], B[0] - A[0]) * 180) / Math.PI, sx: L, sy: 1 };
};
const endFn = (which) => (t) => { const p = scarfFn(t), k = which ? 1 : 0, a = (p.r * Math.PI) / 180; return { x: p.x + k * Math.cos(a) * p.sx, y: p.y + k * Math.sin(a) * p.sx, r: 0, s: 1 }; };
const cap = `<circle r="13" fill="${INK}"/><circle r="8" fill="#e8434e"/>`;
const scarfEl = vis(8.0, 30, `${actor(`<rect y="-13" width="1" height="26" fill="${INK}"/><rect y="-8" width="1" height="16" fill="#e8434e"/><rect y="-1.5" width="1" height="3" fill="#fff" opacity=".7"/>`, scarfFn, 30)}${actor(cap, endFn(0), 30)}${actor(cap, endFn(1), 30)}`);

// ───────── personnages ─────────
const blades = `<g transform="translate(0 6)">${S.skateBlade(0, 0, 1.0)}</g>`;
const owlEl = actor(owl([[0.6, 2.2]], { happyAt: 99, watchAt: 99 }), owlFn);
const foxEl = actor(`${fox({ run: null, upright: -6, noShadow: true, talk: [[8.2, 9.6], [20.0, 21.6]],
  hat: [[0, 30, S.foxBeanie(0)]],
  eyes: [[8.0, 9.6, 'arc'], [9.6, 15.0, 'wide'], [15.0, 16.5, 'sq'], [19.5, 30, 'arc']],
  moods: [[8.0, 9.6, 'happy'], [9.6, 15.0, 'oh'], [15.0, 16.5, 'sad'], [19.5, 30, 'happy']] })}${vis(14.8, 17.0, `<g transform="translate(60 -300)">${stars(60)}</g>`)}`, foxFn);
const rabEl = actor(`${rabbit({ run: null, noShadow: true, talk: [[10.2, 11.9], [13.6, 14.8]],
  eyes: [[8.0, 9.6, 'arc'], [9.6, 15.0, 'wide'], [15.0, 16.5, 'sq'], [19.5, 30, 'arc']],
  moods: [[8.0, 9.6, 'happy'], [9.6, 15.0, 'oh'], [15.0, 16.5, 'sad'], [19.5, 30, 'happy']] })}${vis(14.8, 17.0, `<g transform="translate(30 -330)">${stars(60)}</g>`)}`, rabFn);
const mimiEl = actor(`${pal('mouse', { talk: [[5.1, 6.4], [16.4, 17.8], [24.0, 25.4]], eyes: [[5.0, 6.6, 'arc'], [16.2, 18.0, 'arc'], [23.8, 25.6, 'arc']], moods: [[5.0, 6.6, 'happy'], [16.2, 18.0, 'happy'], [23.8, 30, 'happy']] })}${blades}`, mimiFn);
const coinEl = actor(`${pal('duck', { talk: [[6.7, 7.9], [18.0, 19.4]], eyes: [[6.6, 8.0, 'arc'], [17.9, 19.5, 'arc']], moods: [[6.6, 8.0, 'happy'], [17.9, 19.5, 'happy'], [21, 30, 'happy']] })}${blades}`, coinFn);
const trailsEl = [[3.7, 1300, 1040], [8.5, 380, 780]].map(([t, a, b]) => '').join('');
const world = `${vis(0, 3.5, owlEl)}${vis(23.5, 30, owlEl)}${vis(3.4, 8.0, mimiEl)}${vis(16.0, 30, mimiEl)}${vis(3.4, 8.0, coinEl)}${vis(16.0, 30, coinEl)}${foxEl}${rabEl}${scarfEl}`;

const fx = hud(16, 0) +
  say('owl', 'Tout le monde, on patine !', 0.6, 2.0, { bx: 400, by: 150, tips: [tp('owl', owlFn, 0.8)] }) +
  say('mimi', 'Regardez, c’est un train !', 5.1, 1.6, { bx: 900, by: 150, tips: [tp('pal', mimiFn, 5.3)] }) +
  say('coin', 'Je suis le wagon !', 6.8, 1.2, { bx: 1000, by: 230, tips: [tp('pal', coinFn, 7.0)] }) +
  sfx('FIOUU', 640, 330, 3.8, 0.8, 4, '#ffffff', 70) +
  say('fox', 'Prends mon écharpe, Lino !', 8.2, 1.6, { bx: 520, by: 130, tips: [tp('fox', foxFn, 8.4)] }) +
  say('rab', 'Tu tires trop fort, Roussin !', 10.2, 1.9, { bx: 800, by: 130, tips: [tp('rab', rabFn, 10.6)] }) +
  sfx('VRRR', 640, 640, 9.8, 1.0, -4, '#ffd23f', 70) +
  say('rab', 'J’ai le tournis !', 13.6, 1.3, { bx: 760, by: 130, tips: [tp('rab', rabFn, 14.0)], shout: true }) +
  say('mimi', 'Vous tournez très vite !', 16.4, 1.6, { bx: 940, by: 150, tips: [tp('pal', mimiFn, 16.6)] }) +
  say('coin', 'Venez, faites le train !', 18.0, 1.5, { bx: 1000, by: 230, tips: [tp('pal', coinFn, 18.2)] }) +
  say('fox', 'D’accord, on fait le train !', 20.0, 1.9, { bx: 560, by: 140, tips: [tp('fox', foxFn, 20.4)] }) +
  sfx('CLIC !', 760, 560, 19.9, 0.7, -4, '#ffd23f', 60) +
  say('mimi', 'En avant, mes amis !', 24.0, 1.6, { bx: 760, by: 280, tips: [tp('pal', mimiFn, 24.3)] }) +
  endCard('Les patins', 'Prochain épisode : la fête', 27.6);

sfxEv.push({ name: 'slide', t: 3.7 }, { name: 'whoosh', t: 9.6 }, { name: 'skid', t: 15.0 }, { name: 'laugh', t: 17.0 }, { name: 'click', t: 19.9 }, { name: 'slide', t: 21.5 }, { name: 'chime', t: 27.6 });
svgOut('patins', camStyle, bg, world, fx, 124);
