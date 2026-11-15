// Roussin & Lino · Saison 5 · Épisode 1 « L'affiche » — 30 s, 1280x720. 8h00, la classe de Mme Chouette.
//
// Découpage :
//  0.0– 3.5  plan large     la classe ; Mme Chouette : « Un grand spectacle ! » — Mimi : « Youpi ! »
//  3.5– 7.0  Chouette       « Dans la salle des fêtes ! » — Coin : « Hourra ! »
//  7.0–11.0  Lino           il colle l'affiche : « Voici l’heure du spectacle ! » ; Roussin garde son croissant
// 11.0–15.0  Roussin         « Pour après le spectacle ! » : il colle son croissant sur l'affiche, par erreur
// 15.0–19.0  plan large     « Très bien, la classe ! » — tout le monde applaudit, l'affiche tremble
// 19.0–22.5  plan large     l'affiche se décolle, vole (whoosh) et se pose sur la tête de Coin
// 22.5–27.0  Coin           « Je ne vois rien ! » — Roussin : « Mon croissant est là ! » — Mimi : « On lit l’affiche ! »
// 27.0–30.0  plan large     carton « Saison 5 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, ao, vis, sfx, fox, rabbit, owl, put, style, addKF } from '../../lib/kit.mjs';
import { makeCam, croissant, pal } from '../../lib/props.mjs';
import { wall, banner, board } from '../../lib/classroom.mjs';
import { poster } from '../../lib/theatre.mjs';
import { mover, mkActors, mkSay, checkFraming } from '../_h123.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { solid, endCard5 } from '../_hfix.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.5, 640, 400, 1.0, 1.0],
  [3.5, 7.0, 376, 460, 1.7, 1.75],
  [7.0, 11.0, 943, 480, 1.9, 1.95],
  [11.0, 15.0, 943, 480, 1.9, 1.9],
  [15.0, 19.0, 640, 400, 1.0, 1.0],
  [19.0, 22.5, 640, 400, 1.0, 1.0],
  [22.5, 27.0, 545, 500, 2.0, 2.0],
  [27.0, 30, 640, 400, 1.0, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}`);

const FY = 645, S = 1.15;
const ACT = mkActors([
  { id: 'owl', x: 140, y: FY, s: S, hl: 70, hr: 70 },
  { id: 'mimi', x: 310, y: FY, s: S, hl: 45, hr: 45 },
  { id: 'coin', x: 450, y: FY, s: S, hl: 45, hr: 45 },
  { id: 'fox', x: 920, y: FY, s: S, hl: 95, hr: 190, path: [[0, 920, FY], [20.0, 920, FY], [21.6, 610, FY]] },
  { id: 'rab', x: 1110, y: FY, s: S, hl: 62, hr: 90 },
]);
const say = mkSay(scr, ACT);

// ───────── décor ─────────
const boardInner = `<text x="586" y="170" style="font-size:54px;fill:#e8f2e0">Le spectacle</text><text x="586" y="248" style="font-size:44px;fill:#ffe27a">20 h 30 · salle des fêtes</text>`;
const wallNoPlant = wall.replace(/<g transform="translate\(900 470\)">[\s\S]*?<\/g>/, '');
const bg = `${wallNoPlant}${banner}${board(boardInner)}`;

// ───────── personnages ─────────
const giggle = (inner, a, b) => `<g style="animation:${ao({ n: 'giggle', d: 0.16, t: a, c: Math.round((b - a) / 0.16), dir: 'alternate' })}">${inner}</g>`;
const owlEl = put(140, FY, S, giggle(owl([[0.6, 2.2], [3.7, 5.4], [15.2, 16.8]], { happyAt: 99, watchAt: null, look: [[0, 30, 0]] }), 16.9, 19.0));
const mimiEl = put(310, FY, S, giggle(pal('mouse', { talk: [[2.4, 3.3], [26.3, 27.1]], eyes: [[2.3, 3.5, 'wide'], [16.8, 19.0, 'arc'], [26.2, 27.4, 'arc']], moods: [[2.3, 3.5, 'oh'], [16.8, 19.0, 'happy'], [26.2, 30, 'happy']] }), 16.9, 19.0));
const coinEl = put(450, FY, S, giggle(pal('duck', { talk: [[5.6, 6.6], [22.7, 24.2]], eyes: [[5.5, 6.8, 'wide'], [16.8, 19.0, 'arc']], moods: [[5.5, 6.8, 'oh'], [16.8, 19.0, 'happy']] }), 16.9, 19.0));
const rabEl = put(1110, FY, S, giggle(rabbit({ run: null, noShadow: true, talk: [[7.3, 9.1]], gest: [[7.3, 9.1]],
  eyes: [[7.2, 9.0, 'arc'], [13.2, 14.6, 'wide'], [16.8, 19.0, 'arc'], [26.0, 30, 'arc']], moods: [[7.2, 9.0, 'happy'], [13.2, 14.6, 'oh'], [16.8, 19.0, 'happy'], [26.0, 30, 'happy']] }), 16.9, 19.0));
const foxMove = mover(put(0, 0, S, giggle(fox({ run: [20.0, 21.6], upright: -6, noShadow: true, talk: [[9.6, 10.9], [11.2, 12.9], [24.4, 26.0]],
  eyes: [[10.0, 13.0, 'arc'], [13.4, 14.6, 'wide'], [16.8, 19.0, 'arc'], [19.4, 22.5, 'wide'], [24.3, 26.2, 'arc'], [26.2, 30, 'arc']],
  moods: [[10.0, 13.0, 'happy'], [13.4, 14.6, 'oh'], [16.8, 19.0, 'happy'], [19.4, 22.5, 'oh'], [24.3, 30, 'happy']] }), 16.9, 19.0)),
  [[0, 900, FY, 0, 1], [20.0, 900, FY, 0, 1], [21.6, 680, FY, 0, 1], [30, 680, FY, 0, 1]]);

// ───────── l'affiche et le croissant ─────────
const PX = 1190, PY = 410;
const posterInner = `${poster(0, 0, 1, { hour: '20h30' })}${vis(13.3, 99, `<g transform="translate(40 -80) rotate(-14) scale(1.7)">${croissant}</g>`)}`;
const posterBack = mover(posterInner, [
  [7.4, PX, PY, 0, 0.1], [7.9, PX, PY, 0, 0.5], [17.4, PX, PY, 0, 0.5],
  [17.6, PX, PY, -3, 0.5], [17.8, PX, PY, 3, 0.5], [18.0, PX, PY, -4, 0.5], [18.2, PX, PY, 4, 0.5], [18.8, PX, PY, -6, 0.5], [19.0, PX, PY, -6, 0.5]]);
const posterEl = mover(posterInner, [
  [19.0, PX, PY, -6, 0.5], [19.6, 1000, 250, -22, 0.55], [20.4, 720, 290, 22, 0.5], [21.3, 450, 520, 5, 0.46], [30, 450, 520, 5, 0.46]]);
const croFly = mover(`<g>${croissant}</g>`, [
  [9.5, 1010, 530, -10, 1.0], [11.9, 1010, 530, -10, 1.0], [12.6, 1140, 470, 20, 1.0], [13.3, 1210, 375, 0, 0.85]]);
const world = `${bg}${posterBack}${owlEl}${mimiEl}${coinEl}${foxMove}${rabEl}${croFly}${posterEl}`;

const fx = timeBadge(8, 0) +
  say('owl', 'Un grand spectacle !', 0.6, 1.6) +
  say('mimi', 'C’est génial !', 2.4, 1.1) +
  say('owl', 'Dans la salle des fêtes !', 3.7, 1.7) +
  say('coin', 'Super idée !', 5.6, 1.2) +
  say('rab', 'Voici l’heure du spectacle !', 7.3, 1.9) +
  say('fox', 'Mon dernier croissant !', 9.5, 1.5) +
  say('fox', 'Pour après le spectacle !', 11.2, 1.8) +
  say('owl', 'Très bien, la classe !', 15.2, 1.6) +
  sfx('FROUUU !', 700, 220, 19.3, 1.0, -6, '#ffffff', 80) +
  say('coin', 'Je ne vois rien !', 22.7, 1.5, { shout: true, by: 190 }) +
  say('fox', 'Mon croissant est là !', 24.4, 1.6) +
  say('mimi', 'On lit l’affiche !', 26.2, 1.1, { by: 190 });
const card = endCard5(27.5, 'L’affiche', 'Prochain épisode : les rôles');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#ffe9bd"/>
<g style="${camStyle}">${world}</g>
${solid(fx)}${card}
</svg>`;
sfxEv.push({ name: 'bell', t: 0.3 }, { name: 'whoosh', t: 7.4 }, { name: 'whoosh', t: 19.2 }, { name: 'laugh', t: 26.2 }, { name: 'chime', t: 27.5 });
checkFraming(SHOTS, ACT, 's5e01');
writeFileSync(new URL('./affiche.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 112, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
