// Roussin & Lino · Saison 2 · Épisode 3 « La ferme » — 30 s, 1280x720. 9h00 (horloge de la grange), la cour de la ferme.
//
// Découpage :
//  0.0– 3.5  plan large      arrivée ; Papi Bernard : « Bienvenue à la ferme ! » (le car est garé derrière)
//  3.5– 6.5  les enfants      Lino regarde l'horloge de la grange : « Neuf heures pile, noté ! » ; Roussin : « J'ai faim ! »
//  6.5–10.0  les animaux      « Voici Cocotte, Rosette et Truffe ! » (poule, vache, cochon)
// 10.0–12.5  Piquette         cachée derrière Lino : « Ils sont très grands... »
// 12.5–15.0  la vache         MEUUUH, elle avance ; Lino se cache derrière Roussin : « Roussin, passe devant ! »
// 15.0–18.2  cascade          Roussin : « Moi ? Papi Bernard ! » ; tous se cachent derrière Papi Bernard
// 18.2–22.0  le chapeau       la vache chipe la paille de Papi Bernard : « Hé ! Ma paille, Rosette ! »
// 22.0–26.0  Piquette         sort un peu de sa cachette, Hihi : « Elle est drôle... »
// 26.0–30.0  plan large      « Au travail ! » ; carton
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, sfx, fox, rabbit, put, style, addKF } from '../../lib/kit.mjs';
import { makeCam, say as say0, card } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog, badger } from '../../lib/cast2.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { farmBg, barn, hay, hen, cow, pig, tractorBus, GROUND } from '../../lib/farm.mjs';

const DUR = 30;
const say = (who, text, t0, dur, o) => say0(who, text, t0, dur, { ...o, fs: Math.round((o.fs || (o.shout ? 40 : 33)) * 1.25) });
const SHOTS = [
  [0, 3.5, 640, 420, 1.0, 1.04],
  [3.5, 6.5, 640, 430, 1.25, 1.3],
  [6.5, 10.0, 800, 470, 1.4, 1.45],
  [10.0, 12.5, 330, 470, 2.0, 2.05],
  [12.5, 15.0, 670, 470, 1.05, 1.1],
  [15.0, 18.2, 700, 470, 1.25, 1.3],
  [18.2, 22.0, 750, 450, 1.4, 1.45],
  [22.0, 26.0, 695, 470, 1.3, 1.3],
  [26.0, 30, 640, 420, 1.0, 1.04],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes crumbk{0%{opacity:0;transform:translate(0,0) rotate(0)}15%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(180deg)}}`);

// ───────── décor ─────────
const BARN = [1010, GROUND + 6];
const decor = `${farmBg()}
  ${put(110, GROUND + 4, 0.55, tractorBus({ smoke: false }))}
  ${barn(BARN[0], BARN[1], 1.0)}${wallClock(9, 0, BARN[0], BARN[1] - 232).replace('<g transform="translate', '<g transform="scale(1) translate')}
  ${hay(1250, GROUND + 14, 0.8, 'bale')}${hay(780, GROUND + 6, 0.6, 'stack')}`;
const sign = `<text x="${BARN[0]}" y="${BARN[1] - 160}" text-anchor="middle" class="sfx" style="font-size:38px;fill:#fff;stroke:${INK};stroke-width:5;paint-order:stroke">9h00</text>`;

// ───────── personnages ─────────
const Y = 660, S = 1.15;
const hop = (x0, x1, t0, d, inner, y = Y) => tf(inner, { t0, d, from: `translate(${x0}px,${y}px)`, to: `translate(${x1}px,${y}px)`, e: 'ease-in-out' });

const piq = tf(tf(tf(put(0, 0, S, hedgehog([[10.2, 12.0], [22.2, 24.0]], {
    eyes: [[0, 10.0, 'down'], [10.0, 12.4, 'side'], [12.5, 18.0, 'wide'], [22.0, 26, 'arc']],
    moods: [[0, 22, 'shy'], [12.5, 18.0, 'panic'], [22.0, 30, 'happy']], blush: [[10.2, 12.0], [22.0, 26.0]], shiver: [12.5, 18.0], jolt: [12.6, 15.0],
  })), { t0: 13.7, d: 0.7, from: 'translate(0px,0px)', to: 'translate(140px,0px)', e: 'ease-in-out' }), { t0: 15.7, d: 0.8, from: 'translate(0px,0px)', to: 'translate(90px,0px)', e: 'ease-in-out' }), { t0: 22.4, d: 0.6, from: 'translate(0px,0px)', to: 'translate(-40px,0px)', e: 'ease-in-out' });
const piqEl = `<g transform="translate(150 ${Y})">${piq}</g>`;

const linEl = `<g transform="translate(250 ${Y})">${tf(tf(put(0, 0, S, rabbit({
  run: null, noBag: false, talk: [[3.7, 5.4], [13.2, 14.8], [26.3, 27.2]], eyes: [[0, 3.6, 'side'], [3.6, 5.6, 'up'], [12.5, 18.0, 'wide']], moods: [[3.6, 5.6, 'happy'], [12.5, 18.0, 'oh'], [22, 30, 'happy']], jolt: [12.6, 13.4],
  hops: [[13.4, 14.0], [15.4, 16.0]],
})), { t0: 13.4, d: 0.7, from: 'translate(0px,0px)', to: 'translate(120px,0px)', e: 'ease-in-out' }), { t0: 15.4, d: 0.8, from: 'translate(0px,0px)', to: 'translate(110px,0px)', e: 'ease-in-out' })}</g>`;

const rouEl = `<g transform="translate(410 ${Y})">${tf(put(0, 0, S, fox({
  run: null, upright: -8, talk: [[5.5, 6.8], [15.0, 16.2], [26.4, 27.0]], eyes: [[0, 6, 'side'], [12.5, 18.0, 'wide'], [22.0, 26, 'arc']],
  moods: [[5.5, 6.8, 'sad'], [12.5, 18.0, 'panic'], [22.0, 30, 'happy']], jolt: [12.6, 15.0], sweatWin: [12.6, 17.0], jumps: [[15.8, 16.5, 50]],
})), { t0: 15.8, d: 0.7, from: 'translate(0px,0px)', to: 'translate(170px,0px)', e: 'ease-in-out' })}</g>`;

const PAP = [700, Y, 1.15];
const papEl = put(PAP[0], PAP[1], PAP[2], badger([[0.5, 2.5], [6.6, 9.4], [18.4, 20.0], [26.2, 27.8]], {
  eyes: [[0, 18.2, 'side'], [18.2, 22, 'wide'], [22.0, 26, 'arc']], moods: [[0, 18.0, 'happy'], [18.2, 22.0, 'oh'], [22.0, 30, 'happy']], jolt: [18.2], point: [[6.8, 9.4]], wave: [[0.4, 2.6]],
}));
const hat = vis(18.6, 99, `<g transform="translate(${PAP[0]} ${PAP[1]}) scale(${PAP[2]})">${[[170, -190, 60, -60], [176, -184, 80, -20], [166, -196, 40, -90]].map(([x, y, dx, dy], i) => `<g transform="translate(${x} ${y})"><g style="--dx:${dx}px;--dy:${dy}px;${an({ n: 'crumbk', d: 0.9, t: 18.6 + i * 0.5, c: 3 })}"><path d="M0 0 l16 -4 M6 6 l12 4" stroke="#d8b04a" stroke-width="5" stroke-linecap="round"/></g></g>`).join('')}</g>`);

const henEl = put(850, 705, 1.0, hen([], { peck: [[0, 99]] }), true);
const cowEl = `<g transform="translate(1060 650)">${tf(put(0, 0, 0.95, cow([[18.4, 22.0], [12.6, 13.6]], { eyes: [[18.2, 22, 'arc']], moods: [[18.2, 22, 'happy']] }), true), { t0: 12.9, d: 1.4, from: 'translate(0px,0px)', to: 'translate(-110px,0px)', e: 'ease-in-out' })}</g>`;
const pigEl = put(1200, 700, 0.95, pig([], {}), true);

const world = `${decor}
  ${pigEl}${henEl}${cowEl}
  ${piqEl}${linEl}${rouEl}${papEl}${hat}`;

// ───────── écran ─────────
const tip = (x, y, s, t, dx = 30, dy = -215) => scr(x + dx * s, y + dy * s, t);
const fx =
  say('badger', 'Bienvenue à la ferme !', 0.5, 2.0, { bx: 800, by: 150, tips: [tip(...PAP, 0.5, 40, -300)] }) +
  say('rab', 'Neuf heures pile, noté !', 3.7, 1.7, { bx: 420, by: 140, tips: [tip(250, Y, S, 3.7, 30, -225)] }) +
  say('fox', "J'ai faim !", 5.5, 1.3, { bx: 640, by: 160, tips: [tip(410, Y, S, 5.5, 60, -215)] }) +
  say('badger', 'Voici Cocotte, Rosette et Truffe !', 6.6, 2.8, { bx: 400, by: 100, tips: [tip(...PAP, 6.6, 40, -300)], fs: 30 }) +
  sfx('COT COT', 850, 400, 8.0, 0.8, -6, '#ffd23f', 52, 'chirp') +
  say('hedge', 'Ils sont très grands...', 10.2, 1.8, { bx: 400, by: 150, tips: [tip(150, Y, S, 10.2, 20, -170)] }) +
  sfx('MEUUUH !', 420, 170, 12.6, 1.4, -4, '#ffffff', 90, 'tummy') +
  say('rab', 'Roussin, passe devant !', 13.4, 1.6, { bx: 620, by: 130, tips: [tip(290, Y, S, 13.4, 30, -225)] }) +
  say('fox', 'Moi ? Papi Bernard !', 15.0, 1.4, { bx: 560, by: 120, tips: [tip(410, Y, S, 15.0, 60, -215)], shout: true, fs: 32 }) +
  sfx('CRONCH !', 900, 330, 18.5, 1.1, 6, '#ffd23f', 66, 'crack') +
  say('badger', 'Rosette ! Rends-moi ma paille !', 18.4, 1.7, { bx: 480, by: 130, tips: [tip(...PAP, 18.4, 40, -300)], shout: true, fs: 32 }) +
  say('hedge', 'Elle est drôle...', 22.2, 1.6, { bx: 330, by: 140, tips: [tip(380, Y, S, 22.2, 20, -170)] }) +
  say('rab', 'Elle est gentille !', 26.3, 0.9, { bx: 380, by: 330, tips: [tip(480, Y, S, 26.3, 30, -225)] }) +
  say('badger', 'Au travail !', 26.2, 1.6, { bx: 920, by: 190, tips: [tip(...PAP, 26.2, 40, -300)], shout: true }) +
  card(27.8, 'La ferme', 'les poules', 640, 110);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#bfe6ff"/>
<g style="${camStyle}">${world}</g>
${timeBadge(9, 0)}
${fx}
</svg>`;
sfxEv.push({ name: 'door', t: 0.3 }, { name: 'chime', t: 3.8 }, { name: 'sniff', t: 12.4 }, { name: 'whoosh', t: 13.5 }, { name: 'whoosh', t: 15.8 }, { name: 'laugh', t: 24.2 }, { name: 'chime', t: 27.8 });
writeFileSync(new URL('./la-ferme.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 108, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
