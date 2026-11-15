// Roussin & Lino · Saison 5 · Épisode 3 « La salle » — 30 s, 1280x720. 10h00, la salle des fêtes de la ville (la scène, énorme et vide).
//
//  0.0– 3.5  plan large     la classe sur la scène vide ; Mme Chouette : « Voici la salle des fêtes ! »
//  3.5– 7.0  Lino, Mimi       « Elle est énorme ! » (anneaux d'écho)
//  7.0–11.0  Roussin          il crie « Bonjour ! » ; silence ; l'écho répond avec retard : « Bonjour ! »
// 11.0–13.0  plan large     Lino : « Ça répond ! »
// 13.0–17.0  Roussin          « Bonjour ! » ; son ventre gargouille ; l'écho répond : « J'ai faim ! »
// 17.0–19.0  plan large     Mimi : « L'écho a faim ! »
// 19.0–23.0  plan large     TOC TOC ; Bastien entre avec ses plans : « Trois planches et demie ! » (coup de queue)
// 23.0–27.0  plan large     Mme Chouette : « Bienvenue, Bastien ! » — Roussin : « Bastien, un croissant ? »
// 27.0–30.0  carton « Saison 5 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, ao, vis, sfx, fox, rabbit, owl, put, style, addKF } from '../../lib/kit.mjs';
import { makeCam, pal } from '../../lib/props.mjs';
import { stage, echo, garland } from '../../lib/theatre.mjs';
import { beaver } from '../../lib/cast5.mjs';
import { mover, mkActors, mkSay, checkFraming } from '../_h123.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { solid, endCard5 } from '../_hfix.mjs';
import { say as say0 } from '../../lib/props.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.5, 640, 400, 1.0, 1.0],
  [3.5, 7.0, 320, 440, 2.0, 2.0],
  [7.0, 11.0, 952, 450, 1.95, 1.95],
  [11.0, 13.0, 640, 400, 1.0, 1.0],
  [13.0, 17.0, 952, 450, 1.95, 1.95],
  [17.0, 19.0, 640, 400, 1.0, 1.0],
  [19.0, 23.0, 640, 400, 1.0, 1.0],
  [23.0, 27.0, 640, 400, 1.0, 1.0],
  [27.0, 30, 640, 400, 1.0, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}`);

const FY = 600, S = 0.95;
const BX = [[0, 1450, FY], [19.1, 1450, FY], [20.7, 1110, FY]];
const ACT = mkActors([
  { id: 'owl', x: 150, y: FY, s: S, hl: 70, hr: 70 },
  { id: 'mimi', x: 330, y: FY, s: S, hl: 45, hr: 45 },
  { id: 'rab', x: 500, y: FY, s: S, hl: 62, hr: 90 },
  { id: 'fox', x: 780, y: FY, s: S, hl: 140, hr: 160 },
  { id: 'beaver', x: 1110, y: FY, s: S, hl: 160, hr: 100, t0: 20.6, t1: 30, path: [[20.6, 1110, FY], [30, 1110, FY]] },
]);
const say = mkSay(scr, ACT);

const bg = stage({ backdrop: `<rect width="${W}" height="440" fill="#f1e2bd"/><path d="M0 390 H${W}" stroke="#d8c293" stroke-width="6"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 160 + 40} 70 V390" stroke="#e5d3a6" stroke-width="30" opacity=".6"/>`).join('')}` });
const flags = garland(60, 90, W - 60, 90, 20);

const giggle = (inner, a, b) => `<g style="animation:${ao({ n: 'giggle', d: 0.16, t: a, c: Math.round((b - a) / 0.16), dir: 'alternate' })}">${inner}</g>`;
const owlEl = put(150, FY, S, owl([[0.6, 2.4], [23.4, 24.8]], { happyAt: 99, watchAt: null, look: [[0, 30, 0]] }));
const mimiEl = put(330, FY, S, giggle(pal('mouse', { talk: [[17.0, 18.4]], eyes: [[3.7, 6.0, 'wide'], [17.0, 18.6, 'arc'], [24, 30, 'arc']], moods: [[3.7, 6.0, 'oh'], [17.0, 18.6, 'happy'], [24, 30, 'happy']] }), 17.4, 19.0));
const rabEl = put(500, FY, S, rabbit({ run: null, noShadow: true, talk: [[3.7, 5.2], [11.0, 12.2]],
  eyes: [[3.6, 5.4, 'wide'], [10.8, 12.4, 'wide'], [12.4, 30, 'arc']], moods: [[3.6, 5.4, 'oh'], [10.8, 12.4, 'oh'], [12.4, 30, 'happy']] }));
const foxEl = put(780, FY, S, fox({ run: null, upright: -6, noShadow: true, talk: [[7.3, 8.4], [13.0, 13.9], [25.2, 26.6]], raise: [[7.2, 8.5], [12.9, 14.0]],
  eyes: [[7.0, 9.0, 'wide'], [9.0, 11.0, 'side'], [12.8, 14.2, 'wide'], [14.2, 16.6, 'oh'], [16.6, 30, 'arc']],
  moods: [[7.0, 9.0, 'happy'], [9.0, 11.0, 'oh'], [12.8, 14.2, 'happy'], [14.2, 16.6, 'oh'], [16.6, 30, 'happy']], jolt: [14.6] }));
const plans = `<g transform="rotate(-20)"><rect x="-8" y="-40" width="16" height="64" rx="8" fill="#f5f0d8" stroke="${INK}" stroke-width="4"/><path d="M-4 -26 h8 M-4 -14 h8 M-4 -2 h8" stroke="#7fb3ff" stroke-width="3" stroke-linecap="round"/></g>`;
const beaverEl = mover(put(0, 0, S, beaver([[21.2, 23.0]], { noShadow: true, tail: [22.7], item: plans, gest: [[21.2, 23.0]] })),
  [[19.1, 1450, FY, 0, 1], [20.6, 1110, FY, 0, 1], [30, 1110, FY, 0, 1]]);

// anneaux d'écho (mots qui partent vers la salle, puis qui reviennent)
const rings = echo(960, 480, 5.4, { n: 3 }) + echo(960, 480, 8.3, { n: 3 }) + echo(910, 470, 9.2, { n: 3, col: '#ffe27a' }) + echo(960, 480, 13.9, { n: 3 }) + echo(910, 470, 15.0, { n: 3, col: '#ffe27a' });
const world = `${bg}${flags}${owlEl}${mimiEl}${rabEl}${foxEl}${beaverEl}`;

// l'écho : le mot part vers le fond de la salle (mots fantômes de plus en plus petits), puis revient du fond, bulle pointée vers la salle
const echoSay = (who, tx, a, d) => say0(who, tx, a, d, { bx: 700, by: 250, tips: [[1250, 330]], fs: 41 });
const ghosts = (tx, t0, col) => [[760, 330, 66, 0], [930, 290, 50, 0.3], [1070, 262, 36, 0.6], [1170, 242, 26, 0.9]].map(([x, y, s, dt]) => sfx(tx, x, y, t0 + dt, 0.9, -4, col, s)).join('');
const fx = timeBadge(10, 0) +
  say('owl', 'Voici la salle des fêtes !', 0.6, 1.8) +
  say('rab', 'Elle est énorme !', 3.7, 1.5, { bxo: -170 }) +
  say('fox', 'Bonjour !', 7.3, 1.1, { shout: true }) +
  ghosts('Bonjour...', 7.7, '#b8c8ff') + echoSay('fox', 'Bonjour !', 9.7, 1.2) +
  say('rab', 'Ça répond !', 11.0, 1.2) +
  say('fox', 'Bonjour !', 13.0, 0.9, { shout: true }) +
  sfx('GRRR...', 830, 470, 14.5, 0.9, -5, '#ffd23f', 54) +
  ghosts('Bonjour...', 13.3, '#b8c8ff') + echoSay('fox', 'J’ai faim !', 15.4, 1.4) +
  say('mimi', 'L’écho a faim !', 17.0, 1.4) +
  sfx('TOC TOC !', 1040, 230, 19.0, 0.9, 4, '#ffd23f', 70) +
  say('beaver', 'Trois planches et demie !', 21.2, 1.8, { bxo: -120 }) +
  sfx('PAF !', 1040, 600, 22.7, 0.7, -6, '#ffffff', 60) +
  say('owl', 'Bienvenue, Bastien !', 23.4, 1.4) +
  say('fox', 'Bastien, un croissant ?', 25.2, 1.6, { bxo: -40 }) +
  '';
const card = endCard5(27.5, 'La salle', 'Prochain épisode : la première répétition');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#241a3a"/>
<g style="${camStyle}">${world}${rings}</g>
${solid(fx)}${card}
</svg>`;
sfxEv.push({ name: 'step', t: 0.3 }, { name: 'whoosh', t: 5.4 }, { name: 'whoosh', t: 8.3 }, { name: 'chime', t: 9.7 }, { name: 'tummy', t: 14.5 }, { name: 'laugh', t: 17.4 },
  { name: 'knock', t: 19.0 }, { name: 'step', t: 19.6 }, { name: 'step', t: 20.1 }, { name: 'knock', t: 22.7 }, { name: 'chime', t: 27.5 });
checkFraming(SHOTS, ACT, 's5e03');
writeFileSync(new URL('./la-salle.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 100, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
