// Roussin & Lino · Saison 5 · Épisode 13 « Le grand soir » — 30 s, 1280x720. 18h30, la salle des fêtes, avant le lever de rideau.
//
// Découpage :
//  0.0– 4.0  plan moyen      Lino (lune) : « Dix-huit heures trente ! » ; Mme Chouette l'écoute
//  4.0– 8.0  le fauteuil     le siège « Mme Escargot — réservé » reste vide : « Elle va arriver. Patience. »
//  8.0–11.4  Roussin + Piquette  Roussin (soleil à grands rayons) : « Je passe en premier ! » — Piquette : « Mon cœur fait boum ! »
// 11.4–13.6  la porte         Roussin marche vers la porte du fond (la porte s'ouvre)
// 13.6–18.6  GAG              ses rayons en carton le coincent dans la porte : « Coincé ! » — Lino : « Rentre tes rayons ! » — BOING, il saute dehors
// 18.6–22.5  réaction         « Voilà, je suis passé ! » — Piquette : « Tes rayons sont revenus ! »
// 22.5–27.0  plan moyen      Mme Chouette : « Silence, on commence ! » — Lino : « Allons-y, c’est parti ! »
// 27.0–30.0  carton « Saison 5 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, shake, sfx, fox, rabbit, owl, put, style, addKF } from '../../lib/kit.mjs';
import { makeCam } from '../../lib/props.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { hall, backDoor, seat, crowd, costumeBack } from '../../lib/theatre.mjs';
import { mkSay, checkFraming, place } from '../_h131415.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { solid, endCard5 } from '../_hfix.mjs';

const DUR = 30;
const SHOTS = [
  [0, 4.0, 645, 440, 1.5, 1.52],
  [4.0, 8.0, 413, 470, 1.55, 1.58],
  [8.0, 11.4, 880, 430, 1.6, 1.62],
  [11.4, 13.6, 823, 470, 1.4, 1.45],
  [13.6, 18.6, 880, 420, 1.6, 1.65],
  [18.6, 22.5, 700, 450, 1.45, 1.45],
  [22.5, 27.0, 640, 440, 1.3, 1.28],
  [27.0, 30, 640, 400, 1.1, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}`);
const ACT = [];
const say = mkSay(scr, ACT);

// ───────── décor : le fond de la salle, la porte du fond, le siège réservé ─────────
const DX = 1080, DY = 560;
const reserved = `<g transform="translate(190 600)">${seat(0, 0, 1.5)}<g transform="translate(0 -92) rotate(-4)"><rect x="-56" y="-24" width="112" height="50" rx="6" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
  <text y="-4" style="font-size:15px;fill:${INK}">Mme Escargot</text><text y="16" style="font-size:15px;fill:#e8434e">RÉSERVÉ</text></g></g>`;
const exitSign = `<rect x="${DX - 41}" y="${DY - 316}" width="82" height="30" rx="6" fill="#2fae66"/><text x="${DX}" y="${DY - 293}" style="font-size:22px;fill:#fff">SORTIE</text>`;
const bg = `${hall({ clock: false })}${backDoor(DX, DY, 1, { open: 13.3 })}${exitSign}${seat(70, 600, 1.5)}${reserved}${seat(310, 600, 1.5)}`;
const jambs = `<rect x="-96" y="-282" width="18" height="268" fill="#e8d3a8" stroke="${INK}" stroke-width="5"/><rect x="78" y="-282" width="18" height="268" fill="#e8d3a8" stroke="${INK}" stroke-width="5"/>`;

// ───────── personnages (la position est donnée par place()) ─────────
const sun = costumeBack('sun', 0, -100, 1.15);
const foxBody = (o = {}) => fox({ run: null, upright: -6, noShadow: true,
  talk: [[8.3, 9.8], [14.3, 15.5], [18.9, 20.6]],
  eyes: [[8.2, 9.9, 'arc'], [11.4, 13.6, 'arc'], [13.9, 14.6, 'wide'], [14.6, 17.5, 'sq'], [17.6, 18.8, 'wide'], [18.9, 22.5, 'arc'], [24.8, 27.6, 'arc']],
  moods: [[8.2, 9.9, 'happy'], [13.9, 17.5, 'panic'], [17.6, 18.8, 'oh'], [18.9, 30, 'happy']], blush: [[19.2, 22.0]], ...o });
const foxStatic = (o) => `${sun}${foxBody(o)}`;
const rabEl = `${costumeBack('moon', 0, -100, 0.9)}${rabbit({ run: null, noShadow: true,
  talk: [[0.6, 2.4], [4.3, 6.2], [15.8, 17.2], [24.8, 26.3]], gest: [[0.6, 2.4], [4.3, 6.2]],
  eyes: [[0.5, 2.6, 'wide'], [4.2, 6.3, 'down'], [15.7, 17.3, 'wide'], [18.6, 19.0, 'oh'], [19.2, 22.5, 'arc'], [24.7, 30, 'arc']],
  moods: [[0.5, 2.6, 'oh'], [4.2, 6.3, 'sad'], [15.7, 17.3, 'panic'], [19.2, 22.5, 'happy'], [24.7, 30, 'happy']] })}`;
const owlEl = owl([[6.4, 7.9], [23.0, 24.5]], { happyAt: 99, watchAt: null, look: [[0, 30, 0]] });
const hedgeEl = `${costumeBack('star', -6, -102, 0.8)}${hedgehog([[10.0, 11.3], [20.8, 22.3]], { noShadow: true,
  eyes: [[8.0, 11.4, 'wide'], [18.6, 19.5, 'oh'], [20.6, 22.5, 'arc'], [22.5, 30, 'arc']], moods: [[8.0, 11.4, 'shy'], [20.6, 30, 'happy']], blush: [[9.8, 11.4]] })}`;

const FY = 600;
// Roussin : en attente → marche vers la porte → coincé → saute dehors → heureux
const foxA = place(ACT, 'fox', foxStatic({ run: [11.4, 13.5] }), [
  { t0: 8.0, t1: 11.4, x: 890, y: FY, hl: 136, hr: 136 },
  { path: [[11.4, 890, FY], [13.5, DX, DY + 14], [13.6, DX, DY + 14]], hl: 136, hr: 136 }]);
const foxStuck = place(ACT, 'fox', `${shake(tf(sun, { t0: 13.6, d: 0.4, from: 'scale(1,1)', to: 'scale(.72,1)', o: '0px -100px' }), 14.0, 3.5, 3)}${jambs}${shake(foxBody(), 14.0, 3.5, 4)}`,
  [{ t0: 13.6, t1: 17.6, x: DX, y: DY + 14, hl: 98, hr: 98 }]);
const foxPop = place(ACT, 'fox', `${tf(sun, { t0: 17.6, d: 0.7, from: 'scale(.72,1)', to: 'scale(1,1)', e: 'cubic-bezier(.3,1.8,.5,1)', o: '0px -100px' })}${foxBody()}`,
  [{ path: [[17.6, DX, DY + 14], [18.15, 1000, 505], [18.8, 910, FY], [19.0, 910, FY]], hl: 136, hr: 136 }]);
const foxAfter = place(ACT, 'fox', foxStatic(), [{ t0: 19.0, t1: 22.5, x: 910, y: FY, hl: 136, hr: 136 }, { t0: 22.5, t1: 30, x: 930, y: FY, hl: 136, hr: 136 }]);
const rabP = place(ACT, 'rab', rabEl, [
  { t0: 0, t1: 4.0, x: 800, y: FY, flip: true, hr: 100, hl: 62 }, { t0: 4.0, t1: 8.0, x: 480, y: FY, flip: true, hr: 100, hl: 62 },
  { t0: 13.6, t1: 22.5, x: 620, y: FY, hr: 100, hl: 62 }, { t0: 22.5, t1: 30, x: 660, y: FY, hr: 100, hl: 62 }]);
const owlP = place(ACT, 'owl', owlEl, [
  { t0: 0, t1: 4.0, x: 470, y: FY, hl: 70, hr: 100 }, { t0: 4.0, t1: 8.0, x: 660, y: FY, flip: true, hl: 100, hr: 70 }, { t0: 22.5, t1: 30, x: 258, y: FY, hl: 70, hr: 100 }]);
const hedgeP = place(ACT, 'hedge', hedgeEl, [
  { t0: 8.0, t1: 13.6, x: 650, y: FY, hl: 100, hr: 70 }, { t0: 18.6, t1: 22.5, x: 400, y: FY, hl: 100, hr: 70 }, { t0: 22.5, t1: 30, x: 458, y: FY, hl: 70, hr: 70 }]);
const audience = crowd({ y: 768, x0: 60, x1: 1220, n: 9, s: 1.4, row: 0, seed: 3 });
const world = `${bg}${owlP}${rabP}${hedgeP}${foxA}${foxStuck}${foxPop}${foxAfter}${audience}`;

// ───────── bulles, bruitages, carton ─────────
const fx = timeBadge(18, 30) +
  say('rab', 'Dix-huit heures trente !', 0.6, 1.8) +
  say('rab', "Mme Escargot n'est pas là !", 4.3, 1.9) +
  say('owl', 'Elle va arriver. Patience.', 6.4, 1.5) +
  say('fox', 'Je passe en premier !', 8.3, 1.5) +
  say('hedge', 'Mon cœur bat très fort !', 10.0, 1.3) +
  sfx('CLAC !', 860, 250, 13.3, 0.8, -6, '#ffffff', 64, 'door') +
  say('fox', 'Coincé !', 14.3, 1.2, { shout: true }) +
  say('rab', 'Rentre tes rayons !', 15.8, 1.4) +
  sfx('BOING !', 640, 300, 17.6, 0.9, -8, '#ffd23f', 84, 'boing') +
  say('fox', 'Voilà, je suis passé !', 18.9, 1.7) +
  say('hedge', 'Tes rayons sont revenus !', 20.8, 1.7) +
  say('owl', 'Silence, on commence !', 23.0, 1.5) +
  say('rab', 'Allons-y, c’est parti !', 24.8, 1.6);
const card = endCard5(27.4, 'Le grand soir', 'Prochain épisode : la panne');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#f3dfb8"/>
<g style="${camStyle}">${world}</g>
${solid(fx)}${card}
</svg>`;
sfxEv.push({ name: 'bell', t: 0.3 }, { name: 'laugh', t: 20.8 }, { name: 'laugh', t: 24.9 }, { name: 'chime', t: 27.4 });
checkFraming(SHOTS, ACT, 's5e13');
writeFileSync(new URL('./grand-soir.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 116, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
