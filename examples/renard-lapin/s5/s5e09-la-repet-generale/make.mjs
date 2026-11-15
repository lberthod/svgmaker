// Roussin & Lino · Saison 5 · Épisode 9 « La répétition générale » — 30 s, 1280x720. 16h30, la scène.
//
//  0.0– 3.4  plan large     Mme Chouette : « Répétition générale ! Silence ! »
//  3.4– 7.0  Lino+Chouette  « On est en retard ! » — « Lumière ! » : le projecteur se décroche (CRAC)
//  7.0– 9.6  Lino+Chouette  « Le projecteur est tombé ! »
//  9.6–12.0  plan large     le rideau se ferme tout seul (whoosh) puis se rouvre
// 12.0–14.5  plan large     la fumée de scène gonfle : « Trop de fumée ! »
// 14.5–18.0  Mimi+Roussin   Mimi tousse des bulles ; « Mimi crache des bulles ! »
// 18.0–22.0  plan large     la fumée est un rideau de nuages : il s'envole ; « Ils s’envolent ! »
// 22.0–27.0  plan large     « On recommence ! »
// 27.0–30.0  carton « Saison 5 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, owl, put, cloud, style, addKF } from '../../lib/kit.mjs';
import { makeCam, say as say0, pal } from '../../lib/props.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { solid, endCard5 } from '../_hfix.mjs';
import { stage, backdrop, curtains, lamp, beam } from '../../lib/theatre.mjs';

const DUR = 30;
const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const SHOTS = [
  [0, 3.4, 640, 440, 1.05, 1.1],
  [3.4, 7.0, 355, 440, 1.8, 1.8],
  [7.0, 9.6, 355, 440, 1.8, 1.8],
  [9.6, 12.0, 640, 440, 1.05, 1.05],
  [12.0, 14.5, 640, 440, 1.05, 1.1],
  [14.5, 18.0, 900, 470, 1.9, 1.95],
  [18.0, 22.0, 640, 440, 1.05, 1.08],
  [22.0, 27.0, 640, 440, 1.08, 1.05],
  [27.0, 30, 640, 400, 1.05, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes s9grow{0%{opacity:0;transform:scale(.1)}100%{opacity:.92;transform:scale(1)}}
@keyframes s9away{0%{opacity:.92;transform:translate(0,0)}100%{opacity:0;transform:translate(var(--dx),-420px)}}
@keyframes s9bub{0%{opacity:0;transform:translate(0,0) scale(.4)}15%{opacity:1}100%{opacity:0;transform:translate(var(--dx),-170px) scale(1.1)}}`);

const Y = 600;
const OWL = [210, Y], RAB = [420, Y], MIMI = [780, Y], FOX = [1000, Y];
const bg = stage({ backdrop: backdrop('day') });
const lampEl = lamp(340, 70, 1, 0, { fall: 6.0, drop: 400 });
const lampBeam = beam(340, 182, 360, 590, 90, { on: [[0, 6.0]] });

const owlEl = put(OWL[0], OWL[1], 1.0, owl([[0.7, 2.6], [5.4, 6.4], [12.3, 14.0], [18.5, 20.0]], { happyAt: 21, watchAt: 99 }));
const rabEl = put(RAB[0], RAB[1], 1.0, rabbit({ run: null, noBag: true, noShadow: true, jolt: [6.4],
  talk: [[3.7, 5.2], [7.1, 9.0], [22.6, 24.2]],
  eyes: [[0, 6.3, 'wide'], [6.3, 12, 'wide'], [12, 18, 'side'], [20.3, 30, 'arc']], moods: [[6.3, 12, 'panic'], [20.3, 30, 'happy']] }));
const mimiEl = put(MIMI[0], MIMI[1], 1.2, pal('mouse', { talk: [[14.8, 16.3], [20.5, 22.1]],
  eyes: [[14.6, 18, 'closed'], [20.4, 30, 'arc']], moods: [[14.6, 18, 'oh'], [20.4, 30, 'happy']], giggle: [[20.4, 21.8]] }));
const foxEl = put(FOX[0], FOX[1], 1.0, fox({ run: null, upright: -6, noShadow: true, noBag: true,
  talk: [[16.4, 18.0], [24.5, 25.8]], eyes: [[0, 16, 'side'], [16, 18, 'wide'], [19, 30, 'arc']], moods: [[16, 18, 'oh'], [19, 30, 'happy']] }));

// fumée de scène : gonfle à 12 s, s'envole à 18.2 s
const blobs = Array.from({ length: 9 }, (_, i) => ({ x: 120 + i * 130, y: 540 - (i % 3) * 38, s: 1.9 + (i % 2) * 0.5 }));
const smokeIn = blobs.map((b, i) => vis(12.0, 18.4, `<g transform="translate(${b.x} ${b.y})"><g style="${an({ n: 's9grow', d: 1.0, t: 12.0 + i * 0.12, f: 'both', e: 'ease-out' })}">${cloud(0, 0, b.s, 1)}</g></g>`)).join('');
const smokeOut = blobs.map((b, i) => vis(18.2, 20.8, `<g transform="translate(${b.x} ${b.y})"><g style="--dx:${(i - 4) * 40 + 120}px;${an({ n: 's9away', d: 2.2, t: 18.2 + i * 0.05, f: 'both', e: 'ease-in' })}">${cloud(0, 0, b.s, 1)}</g></g>`)).join('');
const bubs = Array.from({ length: 9 }, (_, i) => `<g transform="translate(${MIMI[0] + 40 + (i % 3) * 14} ${MIMI[1] - 120})"><g style="--dx:${(i - 4) * 22}px;${an({ n: 's9bub', d: 1.6, t: 14.9 + i * 0.28, f: 'both', e: 'ease-out' })}"><circle r="${12 + (i % 3) * 6}" fill="#bfe6ff" fill-opacity=".55" stroke="${INK}" stroke-width="3.5"/><path d="M-5 -5 q3 -5 8 -4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g></g>`).join('');

const world = `${bg}${lampBeam}${lampEl}${smokeIn}${smokeOut}${owlEl}${rabEl}${mimiEl}${foxEl}${bubs}${curtains({ start: 'open', events: [[9.8, 'close'], [11.4, 'open']], dur: 0.6 })}`;

const HT = { rab: 330, owl: 225, mimi: 205, fox: 250 };
const POS = { rab: RAB, owl: OWL, mimi: MIMI, fox: FOX };
const spk = (who, tx, t0, d, o = {}) => {
  const p = POS[who], t = scr(p[0], p[1] - HT[who] - 8, t0 + 0.2);
  return say(who, tx, t0, d, { bx: t[0] + (o.bxo || 0), by: Math.max(t[1] - 80, 135), tips: [t], shout: o.shout });
};
const hud = timeBadge(16, 30);
const fx = hud +
  spk('owl', 'Répétition générale ! Silence !', 0.7, 2.2, { bxo: 280 }) +
  spk('rab', 'On est en retard !', 3.7, 1.5, { bxo: 40 }) +
  spk('owl', 'Lumière !', 5.4, 0.9, { bxo: -40 }) +
  sfx('CRAC !', 640, 330, 6.2, 0.9, -6, '#ffd23f', 90) +
  spk('rab', 'Le projecteur est tombé !', 7.1, 1.9, { shout: true, bxo: 60 }) +
  sfx('FWOUF', 640, 300, 9.8, 0.9, 6, '#ffffff', 80) +
  spk('owl', 'Trop de fumée !', 12.3, 1.7, { bxo: 280 }) +
  spk('mimi', 'Je tousse des bulles !', 14.8, 1.5, { bxo: -30 }) +
  spk('fox', 'Mimi crache des bulles !', 16.4, 1.6, { bxo: 40 }) +
  spk('owl', 'Un rideau de nuages !', 18.5, 1.5, { bxo: 280 }) +
  spk('mimi', 'Ils s’envolent, regardez !', 20.5, 1.7) +
  spk('rab', 'On recommence !', 22.6, 1.6, { bxo: 200 }) +
  spk('fox', 'Allons-y, les amis !', 24.5, 1.3, { bxo: -40 }) +
  '';
const endCard = endCard5(27.2, 'La répétition générale', 'Prochain épisode : la générale est finie');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#241a3a"/>
<g style="${camStyle}">${world}</g>
${solid(fx)}${endCard}
</svg>`;
sfxEv.push({ name: 'chime', t: 0.4 }, { name: 'crack', t: 6.2 }, { name: 'whoosh', t: 9.8 }, { name: 'poof', t: 12.0 }, { name: 'poof', t: 15.0 }, { name: 'whoosh', t: 18.3 }, { name: 'laugh', t: 20.6 }, { name: 'laugh', t: 24.7 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./repet-generale.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 112, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
