// Roussin & Lino · Saison 5 · Épisode 14 « La panne » — 30 s, 1280x720. 19h30, la scène de la salle des fêtes, en pleine pièce.
//
// Découpage :
//  0.0– 3.6  Piquette        sous le projecteur, elle chante : « Petite étoile, brille, brille » — CLIC ! panne de courant
//  3.6– 7.4  plan large      tout est noir ; Mme Chouette : « Restez calmes ! » — Lino : « Je ne vois plus l'heure ! »
//  7.4–11.2  Piquette + Taupin  « J'ai peur du noir... » — Taupin (souffleur, sa petite lampe) : « Brille, petite étoile ! »
// 11.2–14.8  Rouge-Gorge     il arrive avec une luciole ; les piquants de Piquette scintillent : « Une luciole, regardez ! »
// 14.8–19.4  plan large      elle chante ; les spectateurs sortent leurs lucioles, la salle s'éclaire : « Regardez... la salle brille ! »
// 19.4–23.4  Piquette + Taupin  « Je n'ai plus peur ! » — « Je crois que c'est beau. »
// 23.4–27.0  plan large      Lino : « Quelles belles lumières ! » — Roussin : « Un vrai ciel d'étoiles ! »
// 27.0–30.0  carton « Saison 5 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, owl, style, addKF } from '../../lib/kit.mjs';
import { makeCam, bird } from '../../lib/props.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { mole } from '../../lib/cast5.mjs';
import { stage, backdrop, curtains, lamp, beam, firefly, crowd, costumeBack, prompterHole } from '../../lib/theatre.mjs';
import { mkSay, mkActors, checkFraming, place, mover } from '../_h131415.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { solid, endCard5 } from '../_hfix.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.6, 580, 450, 1.7, 1.72],
  [3.6, 7.4, 640, 400, 1.1, 1.1],
  [7.4, 11.2, 880, 500, 1.6, 1.62],
  [11.2, 14.8, 600, 430, 1.9, 1.9],
  [14.8, 19.4, 640, 420, 1.1, 1.1],
  [19.4, 23.4, 880, 500, 1.6, 1.62],
  [23.4, 27.0, 640, 400, 1.1, 1.05],
  [27.0, 30, 640, 400, 1.05, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes e14fade{from{opacity:0}to{opacity:1}}
@keyframes e14spark{0%,100%{opacity:0;transform:scale(.3) rotate(0)}40%{opacity:1;transform:scale(1.1) rotate(40deg)}70%{opacity:.8;transform:scale(.8) rotate(70deg)}}`);
const ACT = [];
const say = mkSay(scr, ACT);
const FY = 590, HX = 620, MX = 1090, MY = 668;

// ───────── décor : la scène de nuit, projecteur, rideaux ouverts ─────────
const STAR = `<path d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4Z" fill="#fff6a8" stroke="${INK}" stroke-width="2"/>`;
const stageBg = `${stage({ backdrop: backdrop('night') })}${lamp(640, 66, 1, 0)}${beam(640, 178, 640, 600, 170, { on: [[0, 3.5]] })}`;

// ───────── personnages ─────────
const hedgeEl = `${costumeBack('star', -6, -102, 0.8)}${hedgehog([[0.5, 2.4], [7.7, 9.2], [13.6, 14.9], [15.2, 17.1], [20.0, 21.4]], { noShadow: true, shiver: [7.6, 9.4],
  eyes: [[0, 3.5, 'arc'], [3.6, 13.0, 'wide'], [13.0, 14.9, 'wide'], [15.0, 19.0, 'arc'], [21.6, 30, 'arc']],
  moods: [[0.4, 3.4, 'happy'], [3.6, 13.0, 'panic'], [13.0, 14.9, 'oh'], [15.0, 30, 'happy']], blush: [[14.0, 22.0]] })}`;
const foxEl = `${costumeBack('sun', 0, -100, 1.15)}${fox({ run: null, upright: -6, noShadow: true, talk: [[25.2, 26.9]],
  eyes: [[3.6, 8.0, 'wide'], [15.0, 19.0, 'arc'], [24.8, 30, 'arc']], moods: [[3.6, 8.0, 'panic'], [15.0, 30, 'happy']] })}`;
const rabEl = `${costumeBack('moon', 0, -100, 0.9)}${rabbit({ run: null, noShadow: true, talk: [[6.0, 7.4], [24.0, 25.1]], gest: [[6.0, 7.4]],
  eyes: [[3.6, 8.0, 'wide'], [15.0, 19.0, 'arc'], [23.9, 30, 'arc']], moods: [[3.6, 8.0, 'panic'], [15.0, 30, 'happy']] })}`;
const owlEl = owl([[4.2, 6.1], [18.0, 19.4]], { happyAt: 99, watchAt: null, look: [[0, 30, 0]] });
const moleEl = `<g transform="scale(-1 1)">${mole([[9.4, 11.1], [21.8, 23.3]], { eyes: [[3.6, 30, 'closed']].slice(0, 0), moods: [[9.4, 11.1, 'oh'], [21.9, 30, 'happy']] })}</g>`;

const hedgeP = place(ACT, 'hedge', hedgeEl, [{ t0: 0, t1: 30, x: HX, y: FY, hl: 100, hr: 70 }]);
const foxP = place(ACT, 'fox', foxEl, [{ t0: 3.6, t1: 7.4, x: 900, y: FY, hl: 136, hr: 136 }, { t0: 14.8, t1: 19.4, x: 900, y: FY, hl: 136, hr: 136 }, { t0: 23.4, t1: 30, x: 900, y: FY, hl: 136, hr: 136 }]);
const rabP = place(ACT, 'rab', rabEl, [{ t0: 3.6, t1: 11.2, x: 340, y: FY, hl: 100, hr: 100 }, { t0: 14.8, t1: 30, x: 340, y: FY, hl: 100, hr: 100 }]);
const owlP = place(ACT, 'owl', owlEl, [{ t0: 3.6, t1: 11.2, x: 205, y: FY, hl: 70, hr: 100 }, { t0: 14.8, t1: 30, x: 205, y: FY, hl: 70, hr: 100 }]);
ACT.push(...mkActors([{ id: 'mole', x: MX, y: MY, s: 1, hl: 70, hr: 70, tall: 115 }]));
const hole = prompterHole(MX, MY, 1, moleEl, { down: 60 });

// scintillement sur les piquants de Piquette quand la luciole arrive
const sparks = [[-60, -150], [-30, -200], [10, -215], [50, -200], [80, -160], [-80, -110], [-20, -240], [70, -120]].map(([dx, dy], i) =>
  vis(13.0, 99, `<g transform="translate(${HX + dx} ${FY + dy})"><g style="transform-origin:0px 0px;${an({ n: 'e14spark', d: 1.0, t: 13.0 + i * 0.13, c: 99 })}">${STAR}</g></g>`)).join('');

// ───────── l'obscurité (dans le monde, avec des trous de lumière) ─────────
let mid = 0;
const holes = [
  { x: MX, y: 590, r: 190, t0: 3.5 },                    // la petite lampe du souffleur
  { x: 650, y: 340, r: 300, t0: 12.8 },                   // la luciole de Rouge-Gorge
  { x: 650, y: 420, r: 640, t0: 16.6 }];                  // la salle s'éclaire
const LF = [[130, 650, 15.0], [260, 690, 15.3], [400, 660, 15.6], [530, 700, 15.9], [760, 690, 16.2], [900, 655, 16.5], [1040, 700, 16.8], [1160, 660, 17.1], [660, 680, 17.4]];
const veil = (() => {
  const id = `e14m${mid++}`;
  const hs = [...holes, ...LF.map(([x, y, t0]) => ({ x, y: y - 20, r: 130, t0 }))].map(({ x, y, r, t0 }) =>
    `<g style="opacity:0;${an({ n: 'e14fade', d: 0.8, t: t0, f: 'both' })}"><circle cx="${x}" cy="${y}" r="${r}" fill="#000" opacity=".4"/><circle cx="${x}" cy="${y}" r="${r * 0.68}" fill="#000" opacity=".6"/><circle cx="${x}" cy="${y}" r="${r * 0.4}" fill="#000"/></g>`).join('');
  return vis(3.5, 99, `<mask id="${id}" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="5300" height="4700"><rect x="-2000" y="-2000" width="5300" height="4700" fill="#fff"/>${hs}</mask><rect x="-2000" y="-2000" width="5300" height="4700" fill="#070a24" opacity=".66" mask="url(#${id})"/>`);
})();
const flies = LF.map(([x, y, t0], i) => vis(t0, 99, firefly(x, y - 20, 0.95))).join('');

// Rouge-Gorge + sa luciole
const birdEl = mover(`<g transform="scale(1.5)">${bird(true, false)}<g transform="translate(-32 36)">${firefly(0, 0, 1.1, { fly: false })}</g></g>`,
  [[11.4, 1340, 150, 0, 1], [13.0, 690, 270, 0, 1], [27.0, 690, 276, 0, 1]]);
const audience = crowd({ y: 768, x0: 60, x1: 1220, n: 9, s: 1.4, row: 0, seed: 5 });

const world = `${stageBg}${owlP}${rabP}${hedgeP}${foxP}${hole}${curtains({ start: 'open' })}${veil}${sparks}${audience}${flies}${birdEl}`;

// ───────── bulles, bruitages, carton ─────────
const fx = timeBadge(19, 30) +
  say('hedge', 'Petite étoile, brille, brille', 0.5, 2.4) +
  sfx('CLIC !', 700, 250, 3.5, 0.9, -6, '#ffffff', 72, 'click') +
  say('owl', 'Restez calmes, tout le monde !', 4.2, 1.7) +
  say('rab', "Je ne vois plus l'heure !", 6.0, 1.4) +
  say('hedge', "J'ai peur du noir...", 7.7, 1.5) +
  say('mole', 'Écoutez-moi : brille, petite étoile !', 9.4, 1.7) +
  say('hedge', 'Une luciole, regardez !', 13.6, 1.3) +
  say('hedge', 'Brille, brille, petite étoile !', 15.2, 1.9) +
  say('owl', 'Regardez... la salle brille !', 18.0, 1.4) +
  say('hedge', "Je n'ai plus peur !", 20.0, 1.4) +
  say('mole', "Je crois que c'est beau.", 21.8, 1.5) +
  say('rab', 'Quelles belles lumières !', 24.0, 1.1) +
  say('fox', "Un vrai ciel d'étoiles !", 25.2, 1.7) +
  '';
const card = endCard5(27.4, 'La panne', 'Prochain épisode : le dernier rideau');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#241a3a"/>
<g style="${camStyle}">${world}</g>
${solid(fx)}${card}
</svg>`;
sfxEv.push({ name: 'chirp', t: 11.6 }, { name: 'chime', t: 13.0 }, { name: 'chime', t: 15.2 }, { name: 'laugh', t: 24.0 }, { name: 'chime', t: 27.4 });
checkFraming(SHOTS, ACT, 's5e14');
writeFileSync(new URL('./panne.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 84, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
