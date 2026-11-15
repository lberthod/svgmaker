// Roussin & Lino · Épisode 8 « Les lettres » — 30 s, 1280x720. 13h30, la salle de classe. Le bâillement contagieux.
//
// Découpage :
//  0.0– 3.5  plan large      la maîtresse écrit R : « R comme... Roussin ! » — Roussin, fier : « C'est moi ! »
//  3.5– 6.5  le tableau      elle écrit L : « L comme... Lino ! »
//  6.5– 9.5  Lino           main levée, ravi : « C'est moi aussi ! »
//  9.5–12.0  Roussin          après la cantine, les paupières tombent… énorme bâillement : AAAAH
// 12.0–14.0  Lino           il bâille à son tour
// 14.0–16.0  le fond         Mimi, puis Coin, bâillent
// 16.0–18.5  la maîtresse    « Non... pas de... » — elle résiste… et bâille : AAAAH !
// 18.5–24.0  plan large      silence ; Roussin pouffe « C'est rigolo ! » ; toute la classe éclate de rire : « Bravo, bravo ! »
// 24.0–27.0  le tableau      elle écrit B : « B comme... bâillement ! »
// 27.0–30.0  plan large      Rouge-Gorge bâille à la fenêtre ; carton
import { writeFileSync } from 'node:fs';
import { timeBadge } from '../lib/badge.mjs';
import { W, H, INK, lines, sfxEv, an, ao, vis, sfx, fox, rabbit, owl, put, style, addKF, track, ss } from '../lib/kit.mjs';
import { makeCam, say, card, bird, pal } from '../lib/props.mjs';
import { FLOOR, wall, banner, board, wallClock, windowEl, radiator, desk, pencil, book, WIN } from '../lib/classroom.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.5, 640, 360, 1.0, 1.03],
  [3.5, 6.5, 500, 260, 1.4, 1.45],
  [6.5, 9.5, 960, 450, 1.75, 1.8],
  [9.5, 12.0, 470, 510, 2.0, 2.05],
  [12.0, 14.0, 960, 490, 1.9, 1.95],
  [14.0, 15.0, 800, 430, 3.2, 3.25],
  [15.0, 16.0, 370, 430, 3.2, 3.25],
  [16.0, 18.5, 185, 470, 2.3, 2.4],
  [18.5, 24.0, 640, 360, 1.0, 1.02],
  [24.0, 27.0, 450, 300, 1.25, 1.3],
  [27.0, 28.8, 1080, 330, 2.2, 2.25],
  [28.8, 30, 640, 360, 1.0, 1.03],
];
const { scr: P, camStyle } = makeCam(SHOTS, DUR);
addKF(`@keyframes chalk{0%{opacity:0;transform:scale(.6)}40%{opacity:1;transform:scale(1.12)}100%{opacity:1;transform:scale(1)}}
@keyframes yawnk{0%,100%{transform:scale(1,1)}20%{transform:scale(.97,.94)}50%,75%{transform:scale(.96,1.08) rotate(-4deg)}}
@keyframes giggle{from{transform:translateY(0) rotate(0)}to{transform:translateY(-14px) rotate(2deg)}}
@keyframes droop{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(8px) rotate(4deg)}}`);
const yawn = (inner, t, d = 1.4, ox = 0, oy = -120) => `<g style="transform-origin:${ox}px ${oy}px;${an({ n: 'yawnk', d, t })}">${inner}</g>`;

// ───────── tableau : R, L, B ─────────
const letter = (c, x, t, word) => vis(t, 99, `<g transform="translate(${x} 240)"><g style="${an({ n: 'chalk', d: 0.3, t, f: 'both' })}"><text style="font-size:110px;fill:#f6f6ea;font-weight:700">${c}</text></g></g>`) +
  vis(t + 0.9, 99, `<g transform="translate(${x} 300)"><g style="${an({ n: 'chalk', d: 0.3, t: t + 0.9, f: 'both' })}"><text style="font-size:28px;fill:#ffe27a;font-weight:700">${word}</text></g></g>`);
const boardInner = `<text x="586" y="140" style="font-size:30px;fill:#e8f2e0;font-weight:400">Les lettres</text>
  ${letter('R', 420, 0.6, 'Roussin')}${letter('L', 586, 4.0, 'Lino')}${letter('B', 752, 24.3, 'Bâillement')}`;

// ───────── personnages ─────────
const owlT = [[0.6, 2.4], [4.0, 5.6], [16.1, 16.5], [24.3, 26.4]];
const owlEl = put(185, 640, 1.35, `<g style="animation:owlsway 1.8s ease-in-out infinite alternate">${yawn(`<g style="animation:${ao({ n: 'giggle', d: 0.16, t: 21.2, c: 14, dir: 'alternate' })}">${owl(owlT, { yawn: [[17.25, 18.5]], lids: [[15.0, 16.3], [16.45, 16.7], [16.8, 17.25], [18.6, 19.5]], happyAt: 21.0, watchAt: null, point: [[0.6, 2.4], [4.0, 5.6], [24.3, 26.4]], wave: [[27.2, 29.3]], look: [[1.4, 2.4, 9], [19.0, 20.6, 9]] })}</g>`, 17.3, 1.3, 0, -120)}</g>`);
const FOX_X = 560, RAB_X = 990, SEAT_Y = 680;
const foxEl = put(FOX_X, SEAT_Y, 1.25, yawn(`<g style="transform-origin:0 -90px;${an({ n: 'droop', d: 1.2, t: 9.6 })}"><g style="animation:${ao({ n: 'giggle', d: 0.16, t: 20.0, c: 22, dir: 'alternate' })}">${fox({
  run: null, upright: -18, talk: [[2.5, 3.4], [20.0, 20.8]],
  eyes: [[2.4, 3.5, 'arc'], [9.5, 9.8, 'down'], [9.8, 9.95, 'closed'], [9.95, 10.08, 'down'], [10.08, 10.2, 'closed'], [10.2, 11.8, 'closed'], [11.8, 12.6, 'down'], [12.6, 16.0, 'closed'], [18.6, 19.8, 'side'], [19.9, 24.0, 'arc']],
  moods: [[2.4, 3.5, 'happy'], [9.5, 10.2, 'calm'], [10.2, 11.8, 'yawnbig'], [18.6, 19.8, 'shy'], [19.9, 24.0, 'happy']],
  blush: [[2.5, 3.5], [18.6, 19.9]],
})}</g></g>`, 10.2, 1.6, 0, -120), true);
const rabEl = put(RAB_X, SEAT_Y, 1.3, yawn(`<g style="animation:${ao({ n: 'giggle', d: 0.16, t: 21.1, c: 18, dir: 'alternate' })}">${rabbit({
  run: null, noBag: true, talk: [[6.7, 7.9]], jolt: [4.9, 12.3],
  eyes: [[4.9, 6.0, 'wide'], [6.6, 8.3, 'arc'], [12.2, 13.7, 'closed'], [13.7, 16.2, 'closed'], [18.6, 21.0, 'side'], [21.0, 24.0, 'arc']],
  moods: [[4.9, 6.0, 'happy'], [6.5, 8.4, 'happy'], [12.2, 13.7, 'yawn'], [21.0, 24.0, 'happy']],
  blush: [[6.8, 8.2]],
})}</g>`, 12.3, 1.4, 0, -120), true);
const pals = put(365, 522, 1.0, yawn(pal('duck', { eyes: [[14.9, 15.9, 'closed'], [21.0, 24.0, 'arc']], moods: [[14.9, 15.9, 'yawn'], [21.0, 24.0, 'happy']], giggle: [[21.0, 23.6]] }), 14.9, 1.1, 0, -80)) +
  put(800, 522, 1.0, yawn(pal('mouse', { eyes: [[14.2, 15.2, 'closed'], [21.0, 24.0, 'arc']], moods: [[14.2, 15.2, 'yawn'], [21.0, 24.0, 'happy']], giggle: [[21.0, 23.6]] }), 14.2, 1.1, 0, -80));
const backDesks = desk(365, 505, 190, 562, book(335, 500, '#7cc8ff')) + desk(800, 505, 190, 562, pencil(830, 498, 6));
const frontDesks = desk(FOX_X - 20, 600, 330, 720, book(FOX_X - 90, 594, '#e8434e') + pencil(FOX_X + 50, 592, -4)) + desk(RAB_X + 10, 600, 330, 720, book(RAB_X + 80, 594, '#22a06b') + pencil(RAB_X - 40, 593, 8));

// Rouge-Gorge bâille sur le rebord de la fenêtre (dehors)
const SILL = [WIN.X + 190, WIN.Y + WIN.H - 35];
const birdOut = vis(26.6, 99, `<g transform="translate(${SILL[0]} ${SILL[1]}) scale(1.4)">${yawn(bird(false, false) + vis(27.5, 28.4, `<ellipse cx="-32" cy="-4" rx="6" ry="7" fill="#8c2f3a" stroke="${INK}" stroke-width="2"/><path d="M-26 -12 q6 4 12 0" stroke="${INK}" stroke-width="2.5" fill="none"/>`), 27.5, 1.0, 0, 0)}</g>`);

// insert plein écran : Rouge-Gorge bâille derrière la vitre (27,0–28,4)
const birdNoBeak = bird(false, false).replace(/<polygon points="-28,-8 -40,-4 -28,-1"[^>]*\/>/, '');
const birdYawn = `<g transform="scale(6.4)">${vis(0, 27.35, bird(false, false))}${vis(27.35, 28.45, birdNoBeak)}${vis(28.45, 99, bird(false, false))}${vis(27.35, 28.45, `<circle cx="-18" cy="-8" r="12" fill="#e8434e"/><path d="M-26 -11 q6 4 12 0" stroke="${INK}" stroke-width="1.6" fill="none" stroke-linecap="round"/><ellipse cx="-26" cy="-4.5" rx="4" ry="5.5" fill="#8c2f3a" stroke="${INK}" stroke-width="1.4"/><ellipse cx="-26" cy="-1.8" rx="2.3" ry="1.6" fill="#ff8fa3"/><g transform="rotate(22 -28 -5)"><polygon points="-28,-8.5 -41,-5 -28,-4.5" fill="#ffb300" stroke="${INK}" stroke-width="1.3" stroke-linejoin="round"/></g><g transform="rotate(-26 -28 -5)"><polygon points="-28,-5.5 -39,-4 -28,-1.5" fill="#ffb300" stroke="${INK}" stroke-width="1.3" stroke-linejoin="round"/></g><circle cx="-10" cy="-2" r="3" fill="#ff8fa3" opacity=".9"/>`)}</g>`;
const insert = vis(27.0, 28.8, `<g><rect width="1280" height="720" fill="#bfe6ff"/><ellipse cx="260" cy="170" rx="150" ry="46" fill="#fff" opacity=".9"/><ellipse cx="1020" cy="120" rx="120" ry="38" fill="#fff" opacity=".9"/>
  <g transform="translate(1220 560)"><rect x="-26" y="-220" width="52" height="222" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><circle cy="-300" r="150" fill="#3fae55" stroke="${INK}" stroke-width="6"/><circle cx="-110" cy="-210" r="80" fill="#52c468" stroke="${INK}" stroke-width="6"/></g><rect x="0" y="560" width="1280" height="160" fill="#eadfca" stroke="${INK}" stroke-width="6"/><rect x="0" y="560" width="1280" height="26" fill="#f3e3c3"/>
  <rect x="0" y="0" width="70" height="560" fill="#f2e3c6" stroke="${INK}" stroke-width="6"/><rect x="1210" y="0" width="70" height="560" fill="#f2e3c6" stroke="${INK}" stroke-width="6"/>
  <g transform="translate(700 430)">${yawn(birdYawn, 27.35, 1.1, 0, 0)}</g>
  ${sfx('aah...', 820, 210, 27.4, 1.0, 6, '#b57bff', 70, 'yawn')}</g>`);

const wallNoPlant = wall.replace(/<g transform="translate\(900 470\)">[\s\S]*?<\/g>/, '');
const world = `${wallNoPlant}${banner}${board(boardInner)}${wallClock(13, 30)}${windowEl('')}${radiator(false)}${birdOut}
  ${owlEl}
  ${pals}${backDesks}
  ${foxEl}${rabEl}${frontDesks}`;

const fx =
  say('owl', 'R comme... Roussin !', 0.6, 1.8, { bx: 400, by: 350, tips: [[240, 470]] }) +
  say('fox', "C'est moi !", 2.5, 0.95, { bx: 720, by: 200, tips: [[500, 400]], shout: true }) +
  say('owl', 'L comme... Lino !', 4.0, 1.6, { bx: 290, by: 470, tips: [[230, 560]] }) +
  say('rab', "C'est moi aussi !", 6.7, 1.2, { bx: 1030, by: 170, tips: [[760, 400]], shout: true }) +
  sfx('AAAAHHH...', 960, 90, 10.25, 1.5, -6, '#b57bff', 76, 'yawn') +
  sfx('aaah...', 880, 85, 12.3, 1.3, 6, '#b57bff', 60, 'yawn') +
  sfx('aah...', 405, 285, 14.2, 0.75, -6, '#b57bff', 62, 'yawn') + sfx('aah...', 375, 215, 15.05, 0.75, 6, '#b57bff', 60, 'yawn') +
  say('owl', 'Je ne bâille pas !', 16.1, 1.1, { bx: 240, by: 95, tips: [[330, 160]] }) +
  sfx('AAAAAHHH !', 540, 80, 17.3, 1.2, -6, '#b57bff', 64, 'yawn') +
  say('fox', 'C’est rigolo !', 20.0, 0.8, { bx: 720, by: 324, tips: [[480, 445]] }) +
  say('class', 'Bravo, bravo !', 21.2, 1.4, { bx: 640, by: 640, tips: [], shout: true }) +
  say('owl', 'B comme... bâillement !', 24.3, 2.1, { bx: 290, by: 292, tips: [[290, 470]] }) +
  insert + card(28.9, 'Les lettres !', 'la graine', 640, 592);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#ffe9bd"/>
<g style="${camStyle}">${world}</g>
${timeBadge(13, 30)}
${fx}
</svg>`;
sfxEv.push({ name: 'chalk', t: 0.6 }, { name: 'chalk', t: 4.0 }, { name: 'chalk', t: 24.3 }, { name: 'laugh', t: 21.2 }, { name: 'chirp', t: 27.4 });
writeFileSync(new URL('./les-lettres.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 108, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
