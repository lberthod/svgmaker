// Roussin & Lino · Saison 2 · Épisode 1 « Le grand départ » — 30 s, 1280x720. 7h45, la cour de l'école.
//
// Découpage :
//  0.0– 3.5  plan large      Lino vérifie sa liste : « Gourde, casquette, goûter : OK ! »
//  3.5– 7.0  Roussin          cache son croissant dans son sac : « Mon croissant est secret. »
//  7.0–10.8  les deux amis    Lino soupçonneux ; Roussin : « Moi ? Rien du tout ! » ; Hihi
// 10.8–13.6  le sac           le croissant dépasse, Lino renifle ; Rouge-Gorge pique vers le sac
// 13.6–16.6  Roussin          « Pas touche, Rouge-Gorge ! » il serre son sac, l'oiseau remonte
// 16.6–19.6  l'horloge        7h45 : Mme Chouette « Le car arrive ! »
// 19.6–23.0  plan large      le car-tracteur entre, freine : POUET !
// 23.0–26.0  Papi Bernard     « Bonjour, les petits ! »
// 26.0–30.0  plan large      tout le monde court vers le car ; carton
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, ao, vis, tf, sfx, fox, rabbit, owl, put, style, addKF } from '../../lib/kit.mjs';
import { makeCam, say as say0, card, bird, croissant } from '../../lib/props.mjs';
import { courtyard } from '../../lib/courtyard.mjs';
import { badger } from '../../lib/cast2.mjs';
import { tractorBus } from '../../lib/farm.mjs';
import { timeBadge } from '../../lib/badge.mjs';

const DUR = 30;
const say = (who, text, t0, dur, o) => say0(who, text, t0, dur, { ...o, fs: Math.round((o.fs || (o.shout ? 40 : 33)) * 1.25) });
const SHOTS = [
  [0, 3.5, 430, 470, 1.5, 1.55],
  [3.5, 7.0, 430, 470, 1.55, 1.6],
  [7.0, 10.8, 430, 460, 1.5, 1.55],
  [10.8, 13.6, 420, 470, 1.6, 1.65],
  [13.6, 16.6, 420, 460, 1.7, 1.75],
  [16.6, 19.6, 400, 470, 1.5, 1.5],
  [19.6, 23.0, 760, 440, 1.1, 1.15],
  [23.0, 26.0, 1000, 500, 1.5, 1.55],
  [26.0, 30, 640, 400, 1.0, 1.05],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes peekk{from{transform:translateY(34px)}to{transform:translateY(0)}}`);

// ───────── décor ─────────
const cy = courtyard({ h: 7, m: 45 });
const { bg, tree, bushes, BRANCH } = cy;

// ───────── personnages ─────────
const OWL = [200, 650, 1.25], RAB = [390, 664, 1.2], FOXP = [640, 664, 1.25];
const list = `<g transform="translate(6 -4) rotate(-8)"><rect x="-8" y="-62" width="50" height="66" rx="4" fill="#fffdf2" stroke="${INK}" stroke-width="3.5"/>${[0, 1, 2, 3].map((i) => `<path d="M0 ${-50 + i * 14} h5 M10 ${-50 + i * 14} h24" stroke="#2b5ba8" stroke-width="3" stroke-linecap="round"/>`).join('')}</g>`;
const owlEl = put(OWL[0], OWL[1], OWL[2], `<g style="animation:owlsway 1.8s ease-in-out infinite alternate">${owl([[16.9, 18.6]], { happyAt: 5, watchAt: null, wave: [[26.4, 28.4]] })}</g>`);
const rabEl = put(RAB[0], RAB[1], RAB[2], rabbit({
  run: null, noBag: false, item: list,
  talk: [[0.6, 2.9], [7.3, 9.1], [10.9, 12.8], [26.3, 28.2]], gest: [],
  eyes: [[0, 3.4, 'down'], [7.0, 10.8, 'side'], [10.8, 13.4, 'arc'], [26.0, 30, 'arc']],
  moods: [[0.6, 2.9, 'happy'], [7.0, 9.1, 'shy'], [9.9, 10.8, 'happy'], [10.9, 12.8, 'happy'], [26.0, 30, 'happy']],
  jolt: [12.0, 20.0],
}));
const foxOpts = {
  run: null, upright: -10,
  talk: [[3.8, 5.8], [9.3, 10.7], [13.7, 15.5]],
  eyes: [[0, 3.5, 'side'], [3.5, 5.9, 'side'], [7.0, 9.2, 'down'], [9.2, 10.8, 'wide'], [13.6, 16.0, 'wide'], [16.6, 19.6, 'oh']],
  moods: [[3.6, 5.9, 'shy'], [9.2, 10.8, 'panic'], [11.0, 16.0, 'panic'], [16.6, 26, 'calm'], [26, 30, 'happy']],
  blush: [[3.8, 5.8]], sweatWin: [9.2, 16.0], jolt: [9.2, 12.0, 13.6],
};
// le croissant : tenu devant, puis rangé dans le sac, dépasse du sac
const crHold = vis(3.6, 5.0, tf(`<g transform="scale(.6) rotate(-20)">${croissant}</g>`, { t0: 3.6, d: 1.3, from: 'translate(86px,-110px)', to: 'translate(-34px,-150px)', e: 'ease-in-out' }));
const crPeek = vis(5.0, 99, `<g transform="translate(-38 -150)"><g style="${an({ n: 'peekk', d: 0.5, t: 8.6, f: 'both' })}"><g transform="scale(.6) rotate(-20)">${croissant}</g></g></g>`);
const foxEl = put(FOXP[0], FOXP[1], FOXP[2], fox(foxOpts) + crHold + crPeek);

// Rouge-Gorge : sur la branche, pique vers le sac, remonte
const birdPerch = vis(0, 11.3, `<g transform="translate(${BRANCH[0]} ${BRANCH[1] - 8}) scale(1.3)">${bird(false, false)}</g>`);
const birdDive = vis(11.3, 14.2, tf(`<g transform="scale(1.4)">${bird(true, false)}</g>`, { t0: 11.3, d: 1.0, from: `translate(${BRANCH[0]}px,${BRANCH[1]}px)`, to: `translate(${FOXP[0] - 40}px,${FOXP[1] - 200}px)`, e: 'cubic-bezier(.4,0,.6,1)' }));
const birdUp = vis(14.2, 99, tf(`<g transform="scale(1.4)">${bird(true, false)}</g>`, { t0: 14.2, d: 0.8, from: `translate(${FOXP[0] - 40}px,${FOXP[1] - 200}px)`, to: `translate(${BRANCH[0]}px,${BRANCH[1]}px)`, e: 'ease-out' }));
const birdBack = vis(15.0, 99, `<g transform="translate(${BRANCH[0]} ${BRANCH[1] - 8}) scale(1.3)">${bird(false, false)}</g>`);

// le car-tracteur
const BUS_Y = 650, BUS_S = 0.78;
const busStop = 960;
const bus = vis(19.6, 99, tf(put(0, 0, BUS_S, tractorBus({ drive: [[19.6, 22.2]] })), { t0: 19.6, d: 2.6, from: `translate(1750px,${BUS_Y}px)`, to: `translate(${busStop}px,${BUS_Y}px)`, e: 'cubic-bezier(.1,.6,.3,1)' }));
// Papi Bernard descend
const papi = vis(22.8, 99, put(1200, 690, 1.1, badger([[23.2, 24.9]], { eyes: [[22.8, 26, 'arc']], moods: [[23.2, 26, 'happy']], jolt: 22.8, wave: [[25.0, 26.6]] }), true));
// les amis se précipitent vers le car (sortie à droite)
const runFox = vis(26.0, 99, tf(put(0, 0, 1.2, fox({ run: [26.0, 28.5], mood: 'happy', upright: -24 })), { t0: 26.0, d: 2.2, from: `translate(${FOXP[0]}px,${FOXP[1]}px)`, to: `translate(880px,${FOXP[1] + 30}px)`, e: 'cubic-bezier(.4,0,.8,.8)' }));
const runRab = vis(26.0, 99, tf(put(0, 0, 1.15, rabbit({ run: [26.0, 28.5], mood: 'happy' })), { t0: 26.0, d: 2.3, from: `translate(${RAB[0]}px,${RAB[1]}px)`, to: `translate(800px,${RAB[1] + 40}px)`, e: 'cubic-bezier(.4,0,.8,.8)' }));

const world = `${bg}${tree}${bushes}${birdPerch}${birdBack}
  ${owlEl}
  ${vis(0, 26.0, rabEl)}${vis(0, 26.0, foxEl)}
  ${bus}${papi}${runRab}${runFox}${birdDive}${birdUp}`;

// ───────── écran : bulles, bruitages, carton ─────────
const tipOf = (x, y, s, t, dx = 40, dy = -200) => scr(x + dx * s, y + dy * s, t);
const fx =
  say('rab', 'Gourde, casquette, goûter : OK !', 0.6, 2.4, { bx: 880, by: 100, tips: [tipOf(...RAB, 0.6, 20, -230)] }) +
  say('fox', 'Mon croissant est secret.', 3.8, 2.1, { bx: 600, by: 120, tips: [tipOf(...FOXP, 3.8, 60, -215)] }) +
  say('rab', 'Tu caches quelque chose ?', 7.3, 1.9, { bx: 780, by: 110, tips: [tipOf(...RAB, 7.3, 30, -230)] }) +
  say('fox', 'Moi ? Rien du tout !', 9.3, 1.5, { bx: 860, by: 130, tips: [tipOf(...FOXP, 9.3, 60, -215)] }) +
  sfx('SNIF', 470, 330, 11.0, 0.9, -6, '#ffd23f', 64, 'sniff') +
  say('rab', 'Ça sent bon le beurre...', 11.1, 1.9, { bx: 500, by: 130, tips: [tipOf(...RAB, 11.1, 40, -230)] }) +
  sfx('FIIIT !', 1050, 250, 11.5, 0.8, -10, '#ff6f95', 56, 'whoosh') +
  say('fox', 'Pas touche, Rouge-Gorge !', 13.7, 1.9, { bx: 600, by: 140, tips: [tipOf(...FOXP, 13.7, 60, -215)], shout: true, fs: 34 }) +
  say('owl', 'Le car arrive !', 17.0, 1.5, { bx: 600, by: 150, tips: [tipOf(...OWL, 17.0, 20, -205)] }) +
  sfx('POUET !', 960, 180, 21.9, 0.9, 6, '#ffd23f', 84, 'boing') +
  sfx('CRIIIIK', 640, 320, 21.4, 0.9, -4, '#ffffff', 56, 'skid') +
  say('badger', 'Bonjour, les petits !', 23.2, 1.8, { bx: 780, by: 190, tips: [tipOf(1200, 690, 1.1, 23.2, -50, -250)] }) +
  say('rab', 'Génial ! En route !', 26.3, 1.6, { bx: 760, by: 250, tips: [[460, 440]], shout: true, fs: 34 }) +
  card(27.7, 'Le grand départ', 'dans le car', 640, 110);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#cfeaff"/>
<g style="${camStyle}">${world}</g>
${timeBadge(7, 45)}
${fx}
</svg>`;
sfxEv.push({ name: 'chirp', t: 11.3 }, { name: 'chirp', t: 14.2 }, { name: 'laugh', t: 10.2 }, { name: 'whoosh', t: 19.7 }, { name: 'chime', t: 17.0 }, { name: 'door', t: 22.9 }, { name: 'step', t: 26.1 }, { name: 'whoosh', t: 26.4 }, { name: 'chime', t: 27.7 });
writeFileSync(new URL('./grand-depart.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 112, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
