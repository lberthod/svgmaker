// Roussin & Lino · Saison 2, épisode 14 « Le feu de camp » — 30 s, 1280x720. 18h30, le soir tombe sur la ferme.
// Gag : la guimauve de Roussin s'enflamme, il l'agite, elle s'envole et se plante sur un piquant de Piquette : grillée à point !
// Ensuite Piquette chante et sa voix émerveille tout le monde.
//
// Découpage :
//  0.0– 3.5  plan large     le feu, les bûches, l'horloge 18 h 30 ; Papi Bernard : « Qui veut des guimauves ? »
//  3.5– 6.5  Roussin        il rêvasse, sa guimauve dore (anticipation)
//  6.5– 9.4  les deux amis  Lino : « Roussin ! Ta guimauve ! » ; elle brûle : POUF
//  9.4–11.2  le vol         il l'agite, elle s'envole par-dessus le feu
// 11.2–14.6  Piquette       elle se plante sur un piquant, grillée à point ; Papi : « Un hérisson à guimauves ! »
// 14.6–18.8  le cercle      « Une chanson, Piquette ! » — « Je n'ose pas... » — « On t'écoute ! »
// 18.8–21.4  Piquette       elle chante, les notes s'envolent
// 21.4–24.0  plan large     tout le monde se balance
// 24.0–26.6  Mimi et Coin   « Oooh... c'est beau ! » — « Encore ! Encore ! »
// 26.6–30    plan large     carton Saison 2
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, sfx, fox, rabbit, put, track, style, addKF } from '../../lib/kit.mjs';
import { makeCam, say as say1, pal, puff } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { hedgehog, badger, frog } from '../../lib/cast2.mjs';
import { sky, sun, clouds, hills, meadow, campfire, hay } from '../../lib/farm.mjs';

// les bulles ne recouvrent jamais le badge d'heure (zone 24..230 x 24..80)
const say = (who, text, t0, dur, o) => { const fs = o.fs || (o.shout ? 50 : 41), w = text.length * fs * 0.56 + 56, left = Math.max(o.bx, w / 2 + 16) - w / 2; return say1(who, text, t0, dur, left < 250 && o.by < 130 ? { ...o, by: 130 } : o); };
const DUR = 30;
const SHOTS = [
  [0, 3.5, 640, 360, 1.0, 1.04],
  [3.5, 6.5, 480, 508, 1.7, 1.75],
  [6.5, 9.4, 560, 500, 1.45, 1.5],
  [9.4, 11.2, 700, 443, 1.3, 1.34],
  [11.2, 14.6, 800, 500, 2.0, 2.05],
  [14.6, 18.8, 640, 430, 1.2, 1.25],
  [18.8, 21.4, 800, 500, 2.0, 2.1],
  [21.4, 24.0, 640, 440, 1.2, 1.25],
  [24.0, 26.6, 356, 500, 1.8, 1.85],
  [26.6, 30, 640, 360, 1.0, 1.05],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes rattle3{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}
@keyframes noteup{0%{opacity:0;transform:translate(0,0) scale(.5)}15%{opacity:1}100%{opacity:0;transform:translate(var(--dx),-170px) scale(1.2) rotate(var(--rt))}}
@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}`);

// ───────── la guimauve au bout du bâton : (0,0) = la main, le bâton part vers la droite ─────────
const stick = `<path d="M0 0 L160 0" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M0 0 L160 0" stroke="#9b6a3c" stroke-width="4.5" stroke-linecap="round"/>`;
const mal = (fill, op = 1) => `<rect x="138" y="-17" width="34" height="34" rx="12" fill="${fill}" opacity="${op}"/>`;
const malBase = `<rect x="138" y="-17" width="34" height="34" rx="12" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M150 -10 q-4 10 0 20" stroke="#ffd2a0" stroke-width="5" stroke-linecap="round" fill="none"/>`;
const flameBit = `<g transform="translate(155 -14)"><g style="transform-origin:0 0;${an({ n: 'fflame', d: 0.22, c: 999, dir: 'alternate', e: 'ease-in-out' })}"><path d="M0 0 C-24 -4 -28 -36 -4 -70 C0 -46 14 -42 16 -58 C34 -32 24 -4 0 0Z" fill="#ff9f43" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M0 0 C-11 -2 -13 -18 -2 -34 C4 -22 12 -20 11 -4Z" fill="#ffe14a"/></g></g>`;
const states = {
  white: `${stick}${malBase}`,
  gold: `${stick}${malBase}${mal('#f4b860', 0.65)}`,
  brown: `${stick}${malBase}${mal('#9a5a28', 0.8)}`,
  fire: `${stick}${malBase}${mal('#2b2420', 0.9)}${flameBit}`,
  bare: stick,
};
const rat = (inner, per) => `<g style="transform-origin:0px 0px;${an({ n: 'rattle3', d: per, c: 999, dir: 'alternate' })}">${inner}</g>`;
// windows = [[t0,t1,state,wobbleSeconds|0]]
const stickSet = (wins, rot = 0) => `<g transform="rotate(${rot})">${wins.map(([a, b, s, w]) => vis(a, b, w ? rat(states[s], w) : states[s])).join('')}</g>`;

// ───────── décor ─────────
const FIREX = 640, GY = 640;
const bg = `${sky('dusk')}${sun(1060, 380, 1.0)}${clouds()}${hills('dusk')}${meadow('dusk')}<rect width="${W}" height="${H}" fill="#4a2a6a" opacity=".16"/>`;
const poleClock = `<g transform="translate(1070 0)"><rect x="162" y="215" width="16" height="360" rx="6" fill="#9b6a3c" stroke="${INK}" stroke-width="5"/>
  <g transform="translate(170 180) scale(1.25)">${wallClock(6, 30, 0, 0)}</g></g>`;
const logSeat = (x0, x1) => `<g><rect x="${x0}" y="630" width="${x1 - x0}" height="44" rx="20" fill="#9b6a3c" stroke="${INK}" stroke-width="5"/><ellipse cx="${x0 + 2}" cy="652" rx="12" ry="21" fill="#c98a4e" stroke="${INK}" stroke-width="4"/><path d="M${x0 + 40} 644 h60 M${x0 + 180} 660 h70" stroke="#7d5229" stroke-width="4" stroke-linecap="round"/></g>`;

// ───────── personnages ─────────
const sway = (inner, x, y, t0 = 19.2) => `<g style="transform-origin:${x}px ${y}px;${an({ n: 'dizzy', d: 1.1, t: t0, c: 8, dir: 'alternate', e: 'ease-in-out' })}">${inner}</g>`;
const FX = 480, FY = 646, FS = 0.85;
const foxEl = put(FX, FY, FS, fox({
  run: null, holdArm: true, upright: -14, sweatWin: [7.4, 9.4], jolt: [7.4, 9.4], noShadow: false,
  talk: [[2.5, 3.4], [9.5, 10.6], [25.7, 26.7]],
  eyes: [[2.5, 3.4, 'arc'], [3.5, 7.3, 'up'], [7.4, 9.5, 'wide'], [9.5, 11.2, 'wide'], [11.2, 14.0, 'down'], [14.0, 18.0, 'arc'], [19.0, 24, 'arc'], [25.5, 27.5, 'arc']],
  moods: [[2.5, 3.4, 'happy'], [3.5, 7.3, 'happy'], [7.4, 11.2, 'panic'], [11.2, 14.0, 'shy'], [14.0, 30, 'happy']],
  blush: [[11.4, 13.8]],
  overHead: `<g transform="translate(91 -107) rotate(26)"><g transform="scale(.75)">${stickSet([[0, 5.2, 'white'], [5.2, 6.8, 'gold'], [6.8, 7.4, 'brown'], [7.4, 7.9, 'fire'], [7.9, 9.4, 'fire', 0.1]]) + vis(9.4, 9.8, `<g transform="rotate(-40)">${states.bare}</g>`) + vis(9.8, 99, states.bare)}</g></g>`,
}));
const linoEl = sway(put(345, 646, 0.85, rabbit({
  run: null, gest: [], talk: [[7.0, 8.4]],
  eyes: [[6.9, 8.6, 'wide'], [14.6, 18, 'side'], [19.0, 24, 'arc']],
  moods: [[6.9, 8.6, 'oh'], [8.6, 30, 'happy']],
})), 345, 646);
const piqEl = put(790, 655, 0.85, hedgehog([[11.6, 12.9], [16.4, 17.6], [19.2, 23.2]], {
  item: `<g transform="rotate(22) scale(.7)">${stickSet([[0, 99, 'gold']])}</g>`,
  eyes: [[0, 10.4, 'side'], [10.5, 12.0, 'up'], [12.0, 14.2, 'arc'], [16.4, 18.8, 'down'], [19.0, 23.4, 'arc'], [23.4, 30, 'arc']],
  moods: [[0, 10.4, 'shy'], [10.5, 11.6, 'oh'], [11.6, 14.4, 'happy'], [14.5, 18.8, 'shy'], [18.8, 30, 'happy']],
  blush: [[12, 14.4], [16.4, 18.8], [23.4, 27]],
}), true);
const piqEl2 = sway(piqEl, 790, 655);
const papiEl = sway(put(1075, 640, 0.85, badger([[0.5, 2.3], [13.1, 14.6]], {
  eyes: [[0.5, 2.3, 'arc'], [11.2, 15.0, 'arc'], [19.0, 30, 'arc']], moods: [[0.4, 30, 'happy']], point: [[0.6, 2.2]],
}), true), 1075, 640);
const ploufEl = sway(put(930, 662, 0.6, frog([], { croak: [[21.8, 22.6], [23.6, 24.4]], eyes: [[11.2, 14.6, 'arc'], [19.0, 24.8, 'arc']], moods: [[11.2, 14.6, 'happy'], [19.0, 30, 'happy']] })), 930, 662);
const mimiEl = sway(put(135, 636, 0.85, pal('mouse', { talk: [[14.9, 16.3]], giggle: [[11.4, 12.6], [25.8, 26.8]], eyes: [[11.2, 12.8, 'arc'], [14.9, 16.3, 'wide'], [19, 24.8, 'arc']], moods: [[11.2, 12.8, 'happy'], [14.9, 16.3, 'happy'], [19, 30, 'happy']] })), 135, 636);
const coinEl = sway(put(235, 636, 0.85, pal('duck', { talk: [[24.2, 25.6]], giggle: [[11.4, 12.6]], eyes: [[11.2, 12.8, 'arc'], [19, 24.1, 'arc'], [24.1, 25.8, 'wide']], moods: [[11.2, 12.8, 'happy'], [19, 24.1, 'happy'], [24.1, 25.8, 'oh']] })), 235, 636);

// la guimauve volante : de la pointe du bâton à un piquant de Piquette
const TIP0 = [FX + 78 * FS + 118, FY - 120 * FS + 24], LAND = [790 + 6 * 0.85, 655 - 200 * 0.85];
const flyer = `<g transform="scale(1.2)"><g transform="translate(-155 0)">${malBase}${mal('#2b2420', 0.9)}${flameBit}</g></g>`;
const flying = vis(9.45, 10.55, track(flyer, 9.45, 10.5, (t, u) => ({ x: TIP0[0] + (LAND[0] - TIP0[0]) * u, y: TIP0[1] + (LAND[1] - TIP0[1]) * u - 4 * 230 * u * (1 - u), r: u * 540 })));
const toasted = vis(10.5, 99, `<g transform="translate(${LAND[0]} ${LAND[1] - 14}) scale(1.25)"><g transform="translate(-155 0)">${malBase}${mal('#e0a040', 0.8)}</g></g>`) +
  vis(10.5, 12.5, `<g transform="translate(${LAND[0]} ${LAND[1] - 40})">${puff(10.5, '#d8d8e4', 4, 24)}</g>`) +
  [[-34, -34], [30, -48], [4, -66]].map(([dx, dy], i) => vis(10.6, 12.2, `<g transform="translate(${LAND[0] + dx} ${LAND[1] + dy})"><g style="${an({ n: 'sparkle', d: 0.9, t: 10.6 + i * 0.12, f: 'both' })}"><path d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4Z" fill="#ffe27a" stroke="${INK}" stroke-width="2"/></g></g>`)).join('');

// notes de musique autour de Piquette
const notes = Array.from({ length: 9 }, (_, i) => vis(19.3 + i * 0.45, 19.3 + i * 0.45 + 1.8, `<g transform="translate(${745 + (i % 3) * 36} 480)"><g style="--dx:${(i % 3 - 1) * 50 - 20}px;--rt:${(i % 2 ? 1 : -1) * 20}deg;${an({ n: 'noteup', d: 1.8, t: 19.3 + i * 0.45, f: 'both' })}"><text class="sfx" style="font-size:54px;fill:${['#ff8fb1', '#ffd23f', '#7cc8ff'][i % 3]};stroke-width:7">${i % 2 ? '♫' : '♪'}</text></g></g>`)).join('');

const world = `${bg}${poleClock}
  ${campfire(FIREX, GY, 0.95)}
  ${mimiEl}${coinEl}${foxEl}${logSeat(60, 575)}
  ${linoEl}${piqEl2}${ploufEl}${papiEl}${logSeat(700, 1250)}
  ${flying}${toasted}${notes}`;

// ───────── espace écran ─────────
const endCard = (t, title, next) => `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.5, t, f: 'both' })}"><g transform="translate(640 130)">
  <rect x="-344" y="-86" width="700" height="206" rx="30" fill="#000" opacity=".22" transform="rotate(-1.2)"/><rect x="-350" y="-94" width="700" height="206" rx="30" fill="#fff" stroke="${INK}" stroke-width="7" transform="rotate(-1.2)"/>
  <text y="-16" class="sfx" style="font-size:50px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 2</text>
  <text y="38" class="bt" style="font-size:38px;fill:#2b5ba8">${title}</text>
  <text y="82" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : ${next}</text></g></g>`;
const FOXH = [FX + 30, FY - 205 * FS], LINOH = [372, 410], PIQH = [746, 512], PAPIH = [1034, 380], MIMIH = [135, 500], COINH = [235, 508];
const T = ([x, y], t) => scr(x, y, t);

const fx =
  say('badger', 'Qui veut des guimauves ?', 0.5, 1.8, { bx: 960, by: 200, tips: [T(PAPIH, 0.5)] }) +
  say('fox', 'Moi ! Moi !', 2.5, 0.9, { bx: 420, by: 250, tips: [T(FOXH, 2.5)], shout: true }) +
  say('rab', 'Roussin ! Ta guimauve !', 7.0, 1.4, { bx: 720, by: 190, tips: [T(LINOH, 7.0)], shout: true }) +
  sfx('POUF !', 600, 330, 7.4, 0.9, -6, '#ff9f43', 70, 'poof') +
  say('fox', 'Je vais tomber !', 9.5, 1.1, { bx: 360, by: 190, tips: [T(FOXH, 9.5)], shout: true }) +
  sfx('FIOU !', 640, 270, 9.5, 0.8, -8, '#ffffff', 60, 'whoosh') +
  sfx('TCHING !', 880, 260, 10.5, 0.8, 6, '#ffd23f', 56, 'clink') +
  say('hedge', 'Ça sent très bon !', 11.6, 1.3, { bx: 760, by: 260, tips: [T(PIQH, 11.6)] }) +
  say('badger', 'Un hérisson à guimauves !', 13.1, 1.5, { bx: 1000, by: 170, tips: [T(PAPIH, 13.1)] }) +
  say('mimi', 'Une chanson, Piquette !', 14.9, 1.4, { bx: 400, by: 250, tips: [T(MIMIH, 14.9)] }) +
  say('hedge', "Je n'ose pas...", 16.4, 1.2, { bx: 820, by: 250, tips: [T(PIQH, 16.4)] }) +
  say('rab', "On t'écoute !", 17.7, 1.0, { bx: 740, by: 280, tips: [T(LINOH, 17.7)], shout: true }) +
  say('hedge', 'La la la laaa...', 19.2, 4.0, { bx: 760, by: 230, tips: [T(PIQH, 19.2)], fs: 36 }) +
  say('coin', 'Quelle belle chanson !', 24.2, 1.4, { bx: 500, by: 230, tips: [T(COINH, 24.2)] }) +
  say('fox', 'Encore ! Encore !', 25.7, 0.95, { bx: 520, by: 160, tips: [T(FOXH, 25.7)], shout: true }) +
  endCard(27.2, 'Le feu de camp', 'les étoiles');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#ff9f6b"/>
<g style="${camStyle}">${world}</g>
${timeBadge(18, 30)}
${fx}
</svg>`;
sfxEv.push({ name: 'chime', t: 11.0 }, { name: 'chime', t: 19.3 }, { name: 'chime', t: 20.8 }, { name: 'chime', t: 22.3 }, { name: 'laugh', t: 12.4 }, { name: 'laugh', t: 25.9 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./le-feu-de-camp.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 92, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
