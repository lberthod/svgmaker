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

// Roussin & Lino · Saison 4 · Épisode 10 « La patinoire » — 30 s, 1280x720. 15h30, le lac gelé.
//
// Découpage :
//  0.0– 3.5  plan large    pastille 15 h 30 ; Bouquet, fier : « Regardez-moi bien ! »
//  3.5– 7.0  Bouquet       il s'élance sur la glace : « Allez, allez ! »
//  7.0–11.0  la toupie     il tourne sur lui-même ; Lino : « Il tourne comme une toupie ! » ; Bouquet : « Tout tourne ! Au secours ! »
// 11.0–14.0  gros plan     il s'arrête à genoux au milieu, étoiles : « Je ne peux plus bouger. »
// 14.0–17.5  Piquette      Roussin : « Qui peut l'aider ? » ; Piquette glisse sur ses patins : « Mes patins de fortune ! »
// 17.5–21.5  la poussée    elle le pousse : « Allez, allez ! »
// 21.5–24.5  Flocon        glisse léger comme l'air : « Regardez-moi bien glisser. »
// 24.5–30.0  plan large    « Merci, Piquette ! » — « C'est rigolo ! » — carton final
const SHOTS = [
  [0, 3.5, 427, 440, 1.5, 1.5],
  [3.5, 7.0, 440, 460, 1.5, 1.5],
  [7.0, 11.0, 620, 450, 1.3, 1.3],
  [11.0, 14.0, 500, 470, 1.7, 1.7],
  [14.0, 17.5, 620, 460, 1.3, 1.3],
  [17.5, 21.5, 620, 460, 1.3, 1.3],
  [21.5, 24.5, 427, 460, 1.5, 1.5],
  [24.5, 30, 640, 450, 1.0, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
const tp = (kind, fn, t, dx = 0, dy = -8) => { const [x, y] = tipOf(kind, fn, t, dx, dy); return scr(x, y, t); };

// ───────── décor : lac gelé ─────────
const bg = `${S.snowBg({ kind: 'day', fall: false })}${S.frozenLake(640, 650, 1)}`;

// ───────── trajectoires ─────────
const IY = 612, S1 = 0.85;
const ibexFn = path([[0, 240, IY, 0, S1], [3.7, 240, IY, 0, S1], [7.0, 460, IY, 0, S1], [11.0, 520, IY, 0, S1], [17.3, 520, IY, 0, S1], [21.3, 660, IY, 0, S1], [30, 660, IY, 0, S1]], (t, p) => {
  if (t >= 7.0 && t < 11.0) { const u = (t - 7) / 4, ph = Math.PI * 2 * 3.2 * (1 - (1 - u) * (1 - u)); p.sx = S1 * Math.cos(ph); p.r = Math.sin(ph * 2) * 3; }
  const k = ss(clamp01((t - 11.0) / 0.4)) * (1 - ss(clamp01((t - 24.3) / 0.5)));
  p.sy = S1 * (1 - 0.26 * k);
  if (k > 0.5) p.r = (t < 11.6 ? -8 : -3 * Math.sin(t * 3)) * (1 - ss(clamp01((t - 24.3) / 0.5)));
  return p;
});
const hedgeFn = path([[0, 760, 650, 0, 0.9, -1], [14.3, 760, 650, 0, 0.9, -1], [16.4, 345, 650, 0, 0.9, 1], [17.3, 345, 650, 0, 0.9, 1], [21.3, 485, 650, 0, 0.9, 1], [30, 485, 650, 0, 0.9, 1]]);
const foxFn = path([[0, 990, 590, 0, 0.85, -1], [30, 990, 590, 0, 0.85, -1]]);
const rabFn = path([[0, 1215, 590, 0, 0.85, -1], [30, 1215, 590, 0, 0.85, -1]]);
const lynxFn = path([[0, 120, 668, 0, 0.9, 1], [21.4, 120, 668, 0, 0.9, 1], [22.4, 170, 668, 0, 0.9, 1], [23.4, 230, 660, 0, 0.9, 1], [24.3, 270, 668, 0, 0.9, 1], [30, 270, 668, 0, 0.9, 1]]);

// ───────── personnages ─────────
const blades = `${S.skateBlade(0, 0, 0.9)}`;
const ibexEl = actor(`${ibex([[0.6, 2.2], [4.0, 6.0], [9.0, 10.4], [12.0, 13.8], [24.8, 26.2]], {
  noShadow: true, wobble: [[7.0, 11.0]],
  eyes: [[0.5, 2.1, 'wide'], [4.0, 5.3, 'wide'], [7.0, 11.0, 'wide'], [11.2, 14.0, 'sq'], [24.8, 26.4, 'arc']],
  moods: [[0.5, 2.1, 'happy'], [4.0, 5.3, 'happy'], [7.0, 11.0, 'panic'], [11.2, 14.0, 'sad'], [24.8, 26.4, 'happy']], blush: [[11.4, 14]] })}${vis(11.3, 14.6, `<g transform="translate(40 -322)">${stars(60)}</g>`)}`, ibexFn, 30);
const hedgeEl = actor(`${hedgehog([[15.7, 16.9], [18.1, 19.3], [26.4, 27.5]], {
  noShadow: true, eyes: [[14.0, 16.4, 'wide'], [17.4, 21.5, 'arc'], [26.2, 27.5, 'arc']], moods: [[14.0, 16.4, 'oh'], [17.4, 21.5, 'happy'], [26.2, 30, 'happy']] })}<g transform="translate(-20 4)">${blades}</g><g transform="translate(28 4)">${blades}</g>`, hedgeFn);
const foxEl = actor(fox({ run: null, upright: -6, noShadow: true, talk: [[14.2, 15.4]],
  hat: [[0, 30, S.foxBeanie(0)]],
  eyes: [[2.5, 3.5, 'arc'], [7.0, 11.0, 'wide'], [11.2, 14.0, 'arc'], [14.0, 15.6, 'wide'], [17.5, 21.5, 'arc'], [24.6, 30, 'arc']],
  moods: [[7.0, 11.0, 'oh'], [11.2, 13.8, 'happy'], [14.0, 15.6, 'oh'], [21.5, 30, 'happy']] }), foxFn);
const rabEl = actor(rabbit({ run: null, noShadow: true, talk: [[7.8, 9.0]],
  eyes: [[7.0, 11.0, 'wide'], [11.2, 14.0, 'arc'], [24.6, 30, 'arc']], moods: [[7.0, 11.0, 'oh'], [11.2, 14.0, 'happy'], [24.6, 30, 'happy']] }), rabFn);
const lynxEl = actor(lynx([[21.8, 23.6]], { noShadow: true, noBook: false, shiver: undefined,
  eyes: [[21.5, 24.5, 'arc'], [24.6, 30, 'arc']], moods: [[21.5, 30, 'happy']] }), lynxFn);

// glisse : traînées sous les patins, poof à l'arrêt
const trails = `${[[3.8, 240, 460], [16.5, 345, 485]].map(([t, a, b]) => vis(t, t + 3.6, `<path d="M${a} ${IY + 6 + (a > 300 ? 38 : 0)} L${b} ${IY + 6 + (a > 300 ? 38 : 0)}" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".8"/>`)).join('')}`;
const world = `${trails}${S.snowPoof(520, 650, 11.0, 1.1)}${ibexEl}${foxEl}${rabEl}${hedgeEl}${vis(21.2, 30, lynxEl)}`;

// ───────── bulles et bruitages (espace écran) ─────────
const fx = hud(15, 30) +
  say('ibex', 'Je suis le moniteur !', 0.6, 1.8, { bx: 420, by: 150, tips: [tp('ibex', ibexFn, 0.6)] }) +
  say('ibex', 'Suivez-moi, je vous guide !', 3.9, 2.2, { bx: 520, by: 130, tips: [tp('ibex', ibexFn, 4.4)], shout: true }) +
  sfx('FIOUU', 640, 300, 4.2, 0.8, -6, '#ffffff', 70) +
  say('fox', 'Il tourne comme une toupie !', 7.6, 2.0, { bx: 800, by: 130, tips: [tp('fox', foxFn, 7.6)] }) +
  say('ibex', 'Tout tourne ! Au secours !', 9.7, 1.6, { bx: 520, by: 130, tips: [tp('ibex', ibexFn, 10.0)], shout: true }) +
  sfx('VRRR', 640, 300, 7.3, 0.9, 6, '#ffd23f', 70) +
  sfx("SCRRR", 330, 640, 11.0, 0.8, -4, '#ffffff', 72) +
  say('ibex', 'Je ne peux plus bouger.', 12.0, 1.9, { bx: 640, by: 120, tips: [tp('ibex', ibexFn, 12.4, 0, 6)] }) +
  say('fox', 'Qui peut l’aider ?', 14.2, 1.5, { bx: 760, by: 135, tips: [tp('fox', foxFn, 14.2)] }) +
  say('hedge', 'Mes patins de fortune !', 15.8, 1.7, { bx: 700, by: 150, tips: [tp('hedge', hedgeFn, 16.2)] }) +
  say('hedge', 'Je te pousse !', 18.0, 1.4, { bx: 560, by: 130, tips: [tp('hedge', hedgeFn, 18.4)], shout: true }) +
  sfx('FIOUU !', 760, 330, 17.8, 0.9, 6, '#ffffff', 72) +
  say('lynx', 'Je peux glisser aussi ?', 21.7, 2.2, { bx: 520, by: 140, tips: [tp('lynx', lynxFn, 22.0)] }) +
  say('ibex', 'Merci, Piquette !', 24.7, 1.5, { bx: 700, by: 140, tips: [tp('ibex', ibexFn, 25.0)] }) +
  say('hedge', 'De rien, Bouquet !', 26.4, 1.2, { bx: 640, by: 190, tips: [tp('hedge', hedgeFn, 26.5)] }) +
  endCard('La patinoire', 'Prochain épisode : les patins', 27.6);

sfxEv.push({ name: 'slide', t: 3.8 }, { name: 'whoosh', t: 7.2 }, { name: 'skid', t: 11.0 }, { name: 'slide', t: 17.4 }, { name: 'whoosh', t: 22.0 }, { name: 'chime', t: 25.9 }, { name: 'chime', t: 27.6 });
svgOut('patinoire', camStyle, bg, world, fx, 128);
