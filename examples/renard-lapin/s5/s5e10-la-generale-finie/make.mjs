// Roussin & Lino · Saison 5 · Épisode 10 « La générale est finie » — 30 s, 1280x720. 17h30, la salle des fêtes au crépuscule.
//
// Découpage :
//  0.0– 3.4  plan large     tout le monde affalé sur le banc ; Lino : « On ne sera pas prêts. »
//  3.4– 7.0  Piquette/Roussin  « J'ai oublié ma chanson. » — « Je suis fatigué... » (bâillement)
//  7.0–10.0  plan large     Lino : « Dites quelque chose ! » — Mme Chouette ne dit rien, vient s'asseoir
// 10.0–14.0  Roussin/Chouette  elle sort deux croissants, en tend un : « Merci, Madame Chouette. »
// 14.0–18.0  gros plan      CROUNCH : ils mangent en silence
// 18.0–22.0  les trois amis  une miette tombe sur le nez de Lino ; Roussin : « Tu veux une miette ? »
// 22.0–26.5  plan large     Lino rit : « C'est rigolo ! D'accord. » — Piquette : « C'est drôle ! » — Chouette : « Demain, on brille. »
// 26.5–30.0  carton « Saison 5 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, sfx, fox, rabbit, owl, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0, croissant } from '../../lib/props.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { solid, endCard5 } from '../_hfix.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { hall, garland } from '../../lib/theatre.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.4, 620, 450, 1.05, 1.1],
  [3.4, 5.3, 305, 430, 2.0, 2.05],
  [5.3, 7.0, 912, 430, 1.85, 1.9],
  [7.0, 10.0, 620, 450, 1.05, 1.1],
  [10.0, 14.0, 912, 430, 1.85, 1.9],
  [14.0, 18.0, 925, 430, 1.95, 2.0],
  [18.0, 22.0, 620, 450, 1.05, 1.1],
  [22.0, 26.5, 620, 450, 1.05, 1.1],
  [26.5, 30, 620, 450, 1.1, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes crumb{0%{opacity:1;transform:translate(0,0)}100%{opacity:0;transform:translate(var(--dx),60px)}}
@keyframes drop{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:1;transform:translate(var(--dx),var(--dy)) rotate(200deg)}}`);

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

// ───────── décor : salle des fêtes au crépuscule + banc ─────────
const FY = 624, S = 1.25;
const bench = `<g><rect x="130" y="${FY - 46}" width="1030" height="76" rx="12" fill="#a8743f" stroke="${INK}" stroke-width="6"/><rect x="130" y="${FY - 46}" width="1030" height="14" rx="7" fill="#c98a4e" stroke="${INK}" stroke-width="5"/>
  ${[170, 1120].map((x) => `<rect x="${x - 14}" y="${FY + 10}" width="28" height="60" rx="6" fill="#8a5a33" stroke="${INK}" stroke-width="5"/>`).join('')}</g>`;
const bg = `${hall({ clock: false, bunting: false })}${garland(0, 40, W, 40, 14, ['#c9a98a', '#b5a0c8', '#9ab0c8', '#b0c89a', '#c8a0a8', '#c8b08a'])}
  <rect width="${W}" height="${H}" fill="#ff8a3d" opacity=".22"/>`;

// ───────── personnages ─────────
const hedgeEl0 = put(170, FY + 4, S, hedgehog([[3.7, 5.3], [8.9, 9.8], [23.9, 25.0]], { noShadow: true,
  eyes: [[0, 8.3, 'down'], [8.4, 9.4, 'wide'], [9.5, 12, 'down'], [22.8, 26.5, 'arc']], moods: [[0, 8.3, 'sad'], [8.4, 9.4, 'oh'], [9.5, 12, 'sad'], [22.8, 26.5, 'happy']] }));
const rabEl0 = put(385, FY, S, rabbit({ run: null, noBag: true, noShadow: true, upright: 0,
  talk: [[0.7, 2.4], [7.3, 8.6], [22.4, 23.8]],
  eyes: [[0, 7.0, 'down'], [7.0, 8.8, 'wide'], [8.8, 10.5, 'down'], [18.6, 20.8, 'wide'], [20.8, 22.2, 'sq'], [22.2, 26.5, 'arc']],
  moods: [[0, 7.0, 'sad'], [7.0, 8.8, 'panic'], [8.8, 18.5, 'sad'], [18.6, 20.8, 'oh'], [20.8, 22.2, 'sad'], [22.2, 30, 'happy']], blush: [[22.4, 26.5]] }));
const foxEl0 = put(800, FY, S, fox({ run: null, upright: -6, noShadow: true, noBag: true,
  talk: [[5.5, 7.0], [12.3, 13.7], [18.9, 20.4]],
  eyes: [[0, 3.4, 'down'], [3.4, 7.0, 'closed'], [7.0, 11.0, 'down'], [11.0, 12.2, 'wide'], [12.2, 13.8, 'arc'], [14.2, 18.0, 'arc'], [18.6, 22.0, 'wide'], [22.0, 30, 'arc']],
  moods: [[0, 3.2, 'sad'], [3.4, 5.2, 'yawn'], [5.2, 7.0, 'sad'], [7.0, 11.0, 'sad'], [11.0, 12.2, 'oh'], [12.2, 30, 'happy']] }));
const owlEl0 = mover(`<g transform="scale(1.2)">${owl([[25.1, 26.6]], { happyAt: 14.0, watchAt: 99 })}</g>`, [
  [0, 1070, FY, 0, 1], [7.6, 1070, FY, 0, 1], [8.0, 1050, FY - 8, 0, 1], [8.4, 1025, FY, 0, 1], [8.7, 1015, FY - 2, 0, 1], [99, 1015, FY - 2, 0, 1]]);

// ───────── croissants ─────────
const CR = (sc) => `<g transform="scale(${sc})">${croissant}</g>`;
const gift = mover(CR(1.1), [
  [10.6, 985, 520, -10, 0.01], [11.0, 985, 520, -10, 1.0], [11.3, 985, 520, -10, 1.0], [12.0, 898, 514, 6, 1.0], [14.2, 898, 514, 6, 1.0],
  [14.8, 929, 474, -4, 0.95], [15.4, 929, 474, -4, 0.7], [16.0, 929, 474, -4, 0.72], [16.6, 929, 474, -4, 0.4], [17.4, 929, 474, -4, 0.01]]);
const mine = mover(CR(1.1), [
  [10.4, 1040, 560, 0, 0.01], [10.8, 1040, 560, 10, 1.0], [14.6, 1040, 560, 10, 1.0], [15.0, 1030, 515, 0, 0.95], [15.6, 1030, 515, 0, 0.7],
  [16.2, 1030, 515, 0, 0.72], [16.8, 1030, 515, 0, 0.4], [17.6, 1030, 515, 0, 0.01]]);
const crumbs = [[15.2, 929], [15.5, 945], [16.0, 1030], [16.5, 935], [16.9, 1035]].map(([t, x], i) =>
  vis(t, t + 0.8, `<g transform="translate(${x} 510)"><g style="--dx:${(i - 2) * 12}px;${an({ n: 'crumb', d: 0.7, t, f: 'both' })}"><circle r="5.5" fill="#e9a84a" stroke="${INK}" stroke-width="1.8"/></g></g>`)).join('');
// la miette qui tombe sur le nez de Lino (vers t = 19)
const noseCrumb = vis(18.2, 22.0, `<g transform="translate(455 380)"><g style="--dx:0px;--dy:100px;${an({ n: 'drop', d: 0.5, t: 18.2, f: 'both', e: 'ease-in' })}"><circle r="10" fill="#e9a84a" stroke="${INK}" stroke-width="2.5"/></g></g>`) + vis(18.7, 22.0, `<g transform="translate(455 480)"><circle r="10" fill="#e9a84a" stroke="${INK}" stroke-width="2.5"/></g>`);

// gag : Mme Chouette s'assoit tout au bout du banc (8,4 s) : la bascule envoie Piquette et Lino en l'air, puis ils retombent
const hop = (inner, t, h, d = 0.3) => tf(tf(inner, { t0: t, d, from: 'translateY(0px)', to: `translateY(${-h}px)`, e: 'ease-out' }), { t0: t + d, d: d + 0.05, from: 'translateY(0px)', to: `translateY(${h}px)`, e: 'ease-in' });
const tilt = (inner, t, a) => tf(tf(inner, { t0: t, d: 0.25, from: 'rotate(0deg)', to: `rotate(${a}deg)`, o: '645px 650px' }), { t0: t + 0.4, d: 0.35, from: 'rotate(0deg)', to: `rotate(${-a}deg)`, e: 'ease-out', o: '645px 650px' });
const JOY = 25.2;   // chute : tout le monde saute de joie sur le banc
const hedgeEl = hop(hop(hedgeEl0, 8.45, 150, 0.32), JOY, 45, 0.18);
const rabEl = hop(hop(rabEl0, 8.45, 130, 0.3), JOY, 45, 0.18);
const foxEl = hop(foxEl0, JOY, 45, 0.18);
const owlEl = hop(owlEl0, JOY, 45, 0.18);
const star = (x, y, t0, s = 1) => vis(t0, t0 + 1.4, `<g transform="translate(${x} ${y}) scale(${s})"><g style="${an({ n: 'sparkle', d: 1.2, t: t0, f: 'both' })}"><path d="M0 -18 L5 -5 L18 0 L5 5 L0 18 L-5 5 L-18 0 L-5 -5Z" fill="#fff36b" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/></g></g>`);
const stars = star(170, FY - 330, JOY + 0.1, 2.0) + star(385, FY - 420, JOY + 0.2, 2.4) + star(800, FY - 400, JOY + 0.3, 2.4) + star(1015, FY - 340, JOY + 0.4, 2.0) + star(600, FY - 470, JOY + 0.5, 1.8);
const world = `${bg}${hedgeEl}${rabEl}${foxEl}${owlEl}${tilt(bench, 8.4, 2.2)}${gift}${mine}${crumbs}${noseCrumb}${stars}`;

// ───────── pastille d'heure (écran, en haut à gauche) ─────────
const pill = timeBadge(17, 30);
const endCard = endCard5(27.4, 'La générale est finie', 'Prochain épisode : Taupin');

const HM = [170, FY - 215], RM = [385, FY - 330], FM = [830, FY - 320], OM = [1015, FY - 250];
const tip = (m, t, dx = 0, dy = 0) => { const p = scr(m[0], m[1], t); return [p[0] + dx, p[1] + dy]; };
const fx = pill +
  say('rab', 'On ne sera pas prêts.', 0.7, 1.9, { bx: 580, by: 135, tips: [tip(RM, 0.7, 0, -10)] }) +
  sfx('FFIIOUU', 760, 280, 1.6, 0.9, -4, '#9fb3ff', 44, 'yawn') +
  say('hedge', "J'ai oublié ma chanson.", 3.7, 1.7, { bx: 330, by: 150, tips: [tip(HM, 3.7, 0, -10)] }) +
  say('fox', 'Je suis fatigué...', 5.5, 1.5, { bx: 700, by: 100, tips: [tip(FM, 5.5, 0, -10)] }) +
  say('rab', 'Dites quelque chose !', 7.3, 1.3, { bx: 640, by: 135, tips: [tip(RM, 7.3, 0, -10)], shout: true }) +
  sfx('BOING !', 790, 235, 8.5, 1.0, -6, '#9be08a', 92, 'boing') +
  say('hedge', 'Je vole !', 8.9, 1.0, { bx: 330, by: 170, tips: [tip(HM, 8.9, 0, -20)] }) +
  say('fox', 'Merci, Madame Chouette.', 12.3, 1.6, { bx: 740, by: 95, tips: [tip(FM, 12.3, 0, -10)] }) +
  sfx('CROUNCH !', 740, 270, 15.0, 0.9, -6, '#ffd23f', 64, 'crack') +
  sfx('CROUNCH !', 1010, 300, 16.3, 0.8, 5, '#ffd23f', 54) +
  say('fox', 'Tu veux une miette ?', 18.9, 1.5, { bx: 800, by: 135, tips: [tip(FM, 18.9, 0, -10)] }) +
  sfx('PLIC', 560, 380, 18.4, 0.6, -4, '#ffffff', 40) +
  say('rab', 'Oui, merci, Roussin !', 22.4, 1.4, { bx: 600, by: 135, tips: [tip(RM, 22.4, 0, -10)] }) +
  say('hedge', 'Moi aussi, j’ai faim !', 23.9, 1.1, { bx: 360, by: 190, tips: [tip(HM, 23.9, 0, -10)] }) +
  say('owl', 'Demain, on brille !', 25.1, 1.5, { bx: 980, by: 160, tips: [tip(OM, 25.1, 0, -10)] }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#f3dfb8"/>
<g style="${camStyle}">${world}</g>
${solid(fx)}
</svg>`;
sfxEv.push({ name: 'sniff', t: 3.2 }, { name: 'step', t: 8.0 }, { name: 'laugh', t: 22.5 }, { name: 'laugh', t: 25.3 }, { name: 'chime', t: 27.4 });
writeFileSync(new URL('./generale-finie.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 92, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
