// Roussin & Lino · Saison 5 · Épisode 11 « Taupin » — 30 s, 1280x720. 18h30, la scène de la salle des fêtes.
//
// Découpage :
//  0.0– 3.4  plan large     une petite voix sort du trou du souffleur (seul un pompon rouge dépasse) : « Écoutez, écoutez ! »
//  3.4– 7.4  Roussin/Lino   « Qui parle ? Un fantôme ? » — « Ça vient d'en bas ! »
//  7.4–10.4  plan large     Piquette : « Je vois un pompon rouge ! » ; Bastien arrive
// 10.4–13.4  Bastien         « Je vais vérifier ! » (coup de queue) ; Taupin sort du trou
// 13.4–17.0  nez à nez      Taupin, myope, prend Bastien pour Mme Chouette : « Madame Chouette ! C'est vous ? » — « La petite étoile a peur ! »
// 17.0–20.5  nez à nez      Bastien : « Je suis Bastien, le castor ! » — « Pardon, Bastien ! »
// 20.5–26.5  plan large     Mme Chouette entre : « Bienvenue, Taupin ! » ; Lino : « Il ne voit rien ! »
// 26.5–30.0  carton « Saison 5 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, owl, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { solid, endCard5 } from '../_hfix.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { beaver, mole } from '../../lib/cast5.mjs';
import { stage, backdrop, prompterHole, garland } from '../../lib/theatre.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.4, 620, 470, 1.1, 1.15],
  [3.4, 7.4, 427, 480, 1.5, 1.55],
  [7.4, 10.4, 620, 470, 1.1, 1.15],
  [10.4, 13.4, 930, 520, 1.85, 1.9],
  [13.4, 17.0, 930, 520, 1.85, 1.9],
  [17.0, 20.5, 930, 520, 1.85, 1.85],
  [20.5, 26.5, 640, 460, 1.0, 1.05],
  [26.5, 30, 640, 460, 1.05, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes lookup{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`);
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
const FY = 604, S = 0.9, HX = 720, HY = 672, HS = 1.15;
const bg = `${stage({ backdrop: backdrop('night'), frame: false })}${garland(0, 30, W, 30, 12)}`;

// ───────── personnages ─────────
const hedgeEl = put(140, FY, S, hedgehog([[7.6, 9.2]], { noShadow: true,
  eyes: [[7.4, 10.2, 'wide']], moods: [[0, 7.0, 'calm'], [7.4, 10.2, 'oh'], [10.2, 30, 'calm']], blush: [] }));
const foxEl = put(320, FY, S, fox({ run: null, upright: -6, noShadow: true, noBag: true,
  talk: [[3.7, 5.3]],
  eyes: [[0, 3.4, 'wide'], [3.4, 7.4, 'side'], [10.4, 20.0, 'wide']],
  moods: [[0, 3.4, 'oh'], [3.4, 7.4, 'panic'], [7.4, 30, 'calm']] }));
const rabEl = put(485, FY, S, rabbit({ run: null, noBag: true, noShadow: true, upright: 0,
  talk: [[5.5, 6.9], [21.9, 23.3]],
  eyes: [[0, 3.4, 'wide'], [3.4, 7.4, 'side'], [20.5, 26.5, 'arc']],
  moods: [[0, 7.4, 'oh'], [20.5, 30, 'happy']] }), false);
// Bastien arrive de la droite, retourné (regarde à gauche), puis tape de la queue
const beaverEl = mover(`<g transform="scale(${-S} ${S})">${beaver([[10.9, 12.0], [17.5, 19.2]], { noShadow: true, tail: [11.6],
  eyes: [[12.8, 20.5, 'wide']], moods: [[0, 12.5, 'happy'], [12.5, 17.0, 'oh'], [17.0, 20.5, 'happy'], [20.5, 30, 'happy']] })}</g>`, [
  [9.4, 1330, FY, 0, 1], [9.8, 1330, FY, 0, 1], [10.9, 920, FY, 0, 1], [99, 920, FY, 0, 1]]);
const owlEl = mover(`<g transform="scale(${S * 1.1})">${owl([[23.5, 25.2]], { happyAt: 22.0, watchAt: 99 })}</g>`, [
  [20.4, 1360, FY, 0, 1], [21.0, 1360, FY, 0, 1], [22.2, 1135, FY, 0, 1], [99, 1135, FY, 0, 1]]);
// Taupin : seul le pompon dépasse, puis il sort
const moleA = (down) => `<g transform="scale(1)">${mole([], { noShadow: true, eyes: [[0, 99, 'closed']] })}</g>`;
const holeA = vis(0, 12.0, prompterHole(HX, HY, HS, mole([], { noShadow: true }), { down: 128, lamp: false }));
const holeB = vis(12.0, 99, prompterHole(HX, HY, HS, mole([[13.6, 15.4], [15.6, 17.2], [19.4, 20.8]], { noShadow: true,
  moods: [[12.4, 17.4, 'oh'], [17.4, 19.2, 'shy'], [19.2, 30, 'happy']], blush: [[19.4, 30]] }), { down: 12, lamp: false, rise: [12.0, 13.0] }));

const world = `${bg}${hedgeEl}${foxEl}${rabEl}${holeA}${holeB}${beaverEl}${owlEl}`;

// ───────── écran ─────────
const pill = timeBadge(18, 30);
const endCard = endCard5(27.4, 'Taupin', 'Prochain épisode : la veille');

const HM = [140, FY - 190], FM = [350, FY - 290], RM = [485, FY - 300], BM = [885, FY - 250], MM = [HX + 30, HY - 150], OM = [1135, FY - 250], PM = [HX + 10, HY - 70];
const tip = (m, t, dx = 0, dy = 0) => { const p = scr(m[0], m[1], t); return [p[0] + dx, p[1] + dy]; };
const fx = pill +
  say('mole', 'Écoutez, écoutez !', 0.7, 1.7, { bx: 720, by: 190, tips: [tip(PM, 0.7, 0, 0)] }) +
  say('fox', 'Qui parle ? Un fantôme ?', 3.7, 1.7, { bx: 520, by: 150, tips: [tip(FM, 3.7, 0, -10)] }) +
  say('rab', "Ça vient d'en bas !", 5.5, 1.5, { bx: 640, by: 135, tips: [tip(RM, 5.5, 0, -10)] }) +
  say('hedge', 'Je vois un pompon rouge !', 7.6, 1.9, { bx: 470, by: 190, tips: [tip(HM, 7.6, 0, -10)] }) +
  say('beaver', 'Je vais vérifier !', 10.9, 1.4, { bx: 900, by: 100, tips: [tip(BM, 10.9, 0, -10)] }) +
  sfx('TOC !', 1100, 560, 11.6, 0.7, -6, '#ffd23f', 52, 'knock') +
  say('mole', "Madame Chouette ! C'est vous ?", 13.6, 1.9, { bx: 700, by: 100, tips: [tip(MM, 13.6, 0, -10)] }) +
  say('mole', 'La petite étoile a peur !', 15.7, 1.6, { bx: 700, by: 100, tips: [tip(MM, 15.7, 0, -10)] }) +
  say('beaver', 'Je suis Bastien, le castor !', 17.5, 1.7, { bx: 900, by: 100, tips: [tip(BM, 17.5, 0, -10)] }) +
  say('mole', 'Pardon, Bastien !', 19.4, 1.4, { bx: 700, by: 100, tips: [tip(MM, 19.4, 0, -10)] }) +
  say('rab', 'Il ne voit rien !', 21.9, 1.4, { bx: 640, by: 140, tips: [tip(RM, 21.9, 0, -10)] }) +
  say('owl', 'Bienvenue, Taupin !', 23.5, 1.6, { bx: 960, by: 150, tips: [tip(OM, 23.5, 0, -10)] }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#241a3a"/>
<g style="${camStyle}">${world}</g>
${solid(fx)}
</svg>`;
sfxEv.push({ name: 'chirp', t: 0.7 }, { name: 'step', t: 10.0 }, { name: 'chirp', t: 12.2 }, { name: 'door', t: 20.6 }, { name: 'chime', t: 27.4 });
writeFileSync(new URL('./taupin.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 100, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
