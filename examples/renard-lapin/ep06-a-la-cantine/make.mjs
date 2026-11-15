// Roussin & Lino · Épisode 6 « À la cantine » — 30 s, 1280x720. 12h00. Résolution du fil rouge du croissant.
//
// Découpage :
//  0.0– 3.5  plan large      la cantine ; Mme Escargot derrière le comptoir : « Le dessert... »
//  3.5– 6.5  Roussin          il attend, cuillère en main, les yeux sur la corbeille ; GROOOU
//  6.5– 9.6  le comptoir     Mme Escargot sort, une assiette sur la coquille, et traverse… très lentement : « ...croissant ! »
//  9.6–12.0  Roussin          le croissant est devant lui : « Enfin ! Mon croissant ! »
// 12.0–14.0  la fenêtre      Rouge-Gorge entre (sans croissant cette fois) et se pose sur le plateau
// 14.0–17.0  le plateau      il regarde le croissant avec de grands yeux tristes ; Roussin hésite (croissant, oiseau, croissant…) ;
//                            Lino (hors champ) : « On partage ? »
// 17.0–20.0  le plateau      CRAC : Roussin coupe le croissant en deux et pousse la moitié vers l'oiseau : « Tiens, la moitié ! »
// 20.0–23.0  plan moyen      l'oiseau saute de joie, cœurs ; il se pose sur la tête de Roussin : ils sont amis
// 23.0–26.5  plan large      Lino : « Bravo, Roussin ! » ; ils mangent ensemble : « Miam ! »
// 26.5–30.0  plan large      carton
import { writeFileSync } from 'node:fs';
import { timeBadge } from '../lib/badge.mjs';
import { W, H, INK, lines, sfxEv, an, ao, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../lib/kit.mjs';
import { makeCam, say, card, bird, pal, snail, croissant as croissant0 } from '../lib/props.mjs';
const croissant = `<g><path d="M-58 26 Q-56 -34 0 -38 Q56 -34 58 26 Q44 4 28 6 Q18 -8 0 -8 Q-18 -8 -28 6 Q-44 4 -58 26Z" fill="#e9a84a" stroke="#3a2418" stroke-width="4" stroke-linejoin="round"/><path d="M-28 0 Q-30 -20 -20 -32 M28 0 Q30 -20 20 -32 M-8 -22 Q-8 -32 -4 -37 M8 -22 Q8 -32 4 -37" stroke="#b97520" stroke-width="3" fill="none"/><path d="M-34 -24 Q0 -36 34 -24" stroke="#f6d08a" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
import { wallClock, windowEl, openSash, WIN, desk } from '../lib/classroom.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.5, 670, 400, 1.0, 1.02],
  [3.5, 6.5, 560, 470, 1.8, 1.85],
  [6.5, 9.6, 400, 430, 1.6, 1.65],
  [9.6, 12.0, 600, 470, 1.8, 1.85],
  [12.0, 14.0, 820, 470, 1.5, 1.55],
  [14.0, 17.0, 650, 480, 1.9, 1.95],
  [17.0, 17.9, 600, 520, 2.1, 2.2],
  [17.9, 20.0, 640, 480, 1.7, 1.75],
  [20.0, 23.0, 640, 450, 1.45, 1.5],
  [23.0, 26.5, 640, 450, 1.35, 1.4],
  [26.5, 30, 640, 400, 1.08, 1.1],
];
const { scr: P, camStyle } = makeCam(SHOTS, DUR);
const lerp = (a, b, u) => a + (b - a) * u;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
addKF(`@keyframes eaten{0%{transform:scale(1)}30%{transform:scale(.9)}60%{transform:scale(.8)}100%{transform:scale(.7)}}
@keyframes heart{0%{opacity:0;transform:translateY(0) scale(.3)}25%{opacity:1;transform:translateY(-20px) scale(1.15)}100%{opacity:0;transform:translateY(-90px) scale(1)}}
@keyframes sparkle{0%{opacity:0;transform:scale(.2) rotate(0)}30%{opacity:1;transform:scale(1.2) rotate(40deg)}100%{opacity:0;transform:scale(.6) rotate(90deg)}}
@keyframes peck{0%,100%{transform:rotate(0)}35%{transform:translateX(7px) rotate(12deg)}55%{transform:translateX(-6px) rotate(-22deg)}}
@keyframes hopk{0%,100%{transform:translateY(0)}50%{transform:translateY(-26px)}}
@keyframes munch{from{transform:translateY(0)}to{transform:translateY(-4px) rotate(3deg)}}
@keyframes steam{0%{opacity:0;transform:translateY(0) scale(.6)}30%{opacity:.8}100%{opacity:0;transform:translateY(-60px) scale(1.3)}}`);

// ───────── décor : la cantine ─────────
const FLOOR = 540;
const wall = `<rect width="${W}" height="${H}" fill="#fff6e3"/>
  ${Array.from({ length: 32 }, (_, i) => Array.from({ length: 4 }, (_, j) => `<rect x="${i * 40}" y="${FLOOR - 160 + j * 40}" width="40" height="40" fill="${(i + j) % 2 ? '#d7ecff' : '#ffffff'}"/>`).join('')).join('')}
  <rect y="${FLOOR - 166}" width="${W}" height="10" fill="#7cc8ff" stroke="${INK}" stroke-width="3"/>
  <rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="#f2c890"/>
  ${Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${FLOOR + 14 + i * 30}" x2="${W}" y2="${FLOOR + 14 + i * 30}" stroke="#ddb07a" stroke-width="3"/>`).join('')}
  <rect y="${FLOOR - 6}" width="${W}" height="10" fill="#8a5224"/>
  ${wallClock(12, 0, 640, 110)}
  ${windowEl('', { open: true })}${openSash()}`;
// comptoir à gauche, corbeille de croissants
const COUNTER = { x: 0, w: 280, top: 470 };
const basket = `<g transform="translate(78 ${COUNTER.top - 8})"><path d="M-60 0 L60 0 L48 36 L-48 36Z" fill="#c98a4e" stroke="${INK}" stroke-width="4"/><path d="M-56 10 H56 M-52 22 H52" stroke="#a46a34" stroke-width="3"/>
  ${[-30, 0, 30].map((x, i) => `<g transform="translate(${x} ${-6 - (i % 2) * 8}) scale(.6) rotate(${(i - 1) * 12})">${croissant}</g>`).join('')}
  ${[0, 1].map((i) => `<g transform="translate(${-14 + i * 30} -36)"><g style="${an({ n: 'steam', d: 1.4, t: i * 0.6, c: 99 })}"><path d="M0 0 q8 -10 0 -20 q-8 -10 0 -20" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></g></g>`).join('')}</g>`;
const counterFront = `<g><rect x="${COUNTER.x - 10}" y="${COUNTER.top}" width="${COUNTER.w}" height="${H - COUNTER.top}" fill="#7cc8ff" stroke="${INK}" stroke-width="5"/>
  <rect x="${COUNTER.x - 10}" y="${COUNTER.top - 14}" width="${COUNTER.w + 16}" height="18" rx="5" fill="#eadfca" stroke="${INK}" stroke-width="5"/>
  ${[0, 1, 2].map((i) => `<rect x="${20 + i * 84}" y="${COUNTER.top + 30}" width="60" height="120" rx="8" fill="#5aaee8" stroke="${INK}" stroke-width="3"/>`).join('')}</g>`;

// ───────── le plateau et le croissant ─────────
const TRAY = [660, 596];
const CRO = [TRAY[0] - 10, TRAY[1] - 40];
const tray = `<g><path d="M${TRAY[0] - 150} ${TRAY[1] - 14} L${TRAY[0] + 150} ${TRAY[1] - 14} L${TRAY[0] + 160} ${TRAY[1] + 6} L${TRAY[0] - 160} ${TRAY[1] + 6}Z" fill="#ff8fb1" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M${TRAY[0] + 108} ${TRAY[1] - 22} l30 -6" stroke="#9aa3ad" stroke-width="6" stroke-linecap="round"/></g>`;
const plate = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="58" ry="12" fill="#fff" stroke="${INK}" stroke-width="3.5"/>`;
const half = (side) => `<defs><clipPath id="h${side}"><path d="${side === 'L' ? 'M-90 -70 L0 -70 L-7 -50 L5 -36 L-6 -22 L6 -8 L-5 6 L4 20 L0 40 L-90 40Z' : 'M90 -70 L0 -70 L-7 -50 L5 -36 L-6 -22 L6 -8 L-5 6 L4 20 L0 40 L90 40Z'}"/></clipPath></defs><g clip-path="url(#h${side})"><g transform="scale(1.3)">${croissant}</g></g><path d="M0 -38 l-6 10 l6 8 l-6 10 l6 8 l-4 10" stroke="${INK}" stroke-width="3" fill="none"/>`;
const SPLIT = 17.5;
const croFly = vis(9.0, 9.42, track(`<g transform="translate(0 12)"><ellipse rx="58" ry="12" fill="#fff" stroke="#3a2418" stroke-width="3.5"/></g><g transform="scale(1.1)">${croissant}</g>`, 9.0, 9.4, (t, u) => ({ x: lerp(298, CRO[0], ss(u)), y: lerp(392, CRO[1], ss(u)) - 260 * Math.sin(Math.PI * u), s: lerp(0.9, 1.14, u) })));
const croOnTray = vis(9.4, SPLIT, `${plate(CRO[0], CRO[1] + 12)}<g transform="translate(${CRO[0]} ${CRO[1]})"><g transform="scale(1.25)">${croissant}</g></g>` +
  [[-60, -50], [64, -40], [10, -66]].map(([dx, dy], i) => vis(9.7, 11.6, `<g transform="translate(${CRO[0] + dx} ${CRO[1] + dy})"><g style="${an({ n: 'sparkle', d: 0.8, t: 9.7 + i * 0.15, c: 2 })}"><path d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4Z" fill="#ffe27a" stroke="${INK}" stroke-width="2"/></g></g>`)).join(''));
const halves = vis(SPLIT, 99, plate(CRO[0], CRO[1] + 12) +
  track(`<g style="transform-origin:0 0;${an({ n: 'eaten', d: 0.8, t: 24.8, f: 'forwards' })}">${half('L')}</g>`, SPLIT, SPLIT + 0.5, (t, u) => ({ x: CRO[0] - 6 - 14 * ss(u), y: CRO[1] + 2 * ss(u), r: -18 * ss(u), s: 1 - 0.22 * ss(u) })) +
  vis(SPLIT, 23.6, track(`<g style="transform-origin:0 0;${an({ n: 'eaten', d: 1.0, t: 19.0, f: 'forwards' })}">${half('R')}</g>`, SPLIT, SPLIT + 1.2, (t, u) => ({ x: CRO[0] + 6 + 70 * ss(clamp((u - 0.1) / 0.6, 0, 1)), y: CRO[1], r: 8 * ss(u), s: 1 }))) +
  vis(23.6, 99, `<g transform="translate(${CRO[0] + 76} ${CRO[1] + 6}) scale(.62)">${half('R')}</g>`));

// ───────── personnages ─────────
const FOX = [480, 690], RAB = [1010, 690];
const foxEl = put(FOX[0], FOX[1], 1.25, `<g style="transform-origin:20px -60px;${an({ n: 'hesit', d: 2.2, t: 14.2 })}"><g style="transform-origin:0 -90px;${an({ n: 'tummy', d: 0.3, t: 4.6, c: 4 })}">${fox({
  run: null, upright: -16,
  talk: [[10.0, 11.6], [18.4, 19.6], [24.8, 25.6]], gest: [[10.0, 11.6], [18.4, 19.6]],
  eyes: [[3.6, 6.4, 'side'], [7.2, 9.3, 'back'], [9.6, 11.8, 'wide'], [12.6, 14.0, 'side'], [14.2, 14.7, 'down'], [14.7, 15.2, 'side'], [15.2, 15.7, 'down'], [15.7, 16.2, 'side'], [16.2, 17.0, 'down'], [20.0, 20.9, 'arc'], [20.9, 21.4, 'up'], [21.4, 23.0, 'arc'], [24.6, 26.0, 'arc']],
  moods: [[3.6, 4.6, 'calm'], [4.6, 6.4, 'shy'], [9.6, 12.0, 'happy'], [12.6, 14.0, 'oh'], [14.0, 17.0, 'sad'], [17.0, 18.3, 'calm'], [18.3, 30, 'happy']],
  blush: [[4.7, 6.3], [20.2, 22.5]], jolt: [9.65],
})}</g></g>`);
addKF('@keyframes hesit{0%,100%{transform:rotate(0)}12%,30%{transform:rotate(8deg)}40%,58%{transform:rotate(-6deg)}68%,86%{transform:rotate(8deg)}}');
addKF('@keyframes tummy{0%{transform:scale(1)}30%{transform:scale(1.06,.95)}60%{transform:scale(.97,1.03)}100%{transform:scale(1)}}');
const rabEl = put(RAB[0], RAB[1], 1.25, rabbit({
  run: null, talk: [[15.3, 16.4], [23.3, 24.6]], gest: [[23.3, 24.6]],
  eyes: [[12.6, 14.0, 'side'], [20.0, 23.0, 'arc'], [24.6, 26.0, 'arc']], moods: [[12.6, 14.0, 'oh'], [14.0, 17.0, 'oh'], [20.0, 30, 'happy']],
  jolt: [20.1],
}), true);
const tableFront = desk(660, 600, 760, 720, '');
const backRow = desk(300, 505, 220, 562) + desk(1000, 505, 220, 562);
const pals = put(345, 522, 0.95, pal('duck', { eyes: [[20.0, 23.0, 'arc']], moods: [[20.0, 23.0, 'happy']], giggle: [[20.2, 22.0]], look: 3 })) +
  put(1170, 497, 0.95, pal('mouse', { eyes: [[20.0, 23.0, 'arc']], moods: [[20.0, 23.0, 'happy']], giggle: [[20.2, 22.0]], look: -3 }));

// Mme Escargot : derrière le comptoir, puis elle traverse avec l'assiette sur la coquille
const SN0 = [150, 530], SN1 = [330, 560];
const snailPos = (t) => { if (t < 6.6) return SN0[0]; if (t < 9.3) return lerp(SN0[0], SN1[0], (t - 6.6) / 2.7); if (t < 10.0) return SN1[0]; return lerp(SN1[0], 90, clamp((t - 10.0) / 2.2, 0, 1)); };
const snailEl = track(`<g transform="scale(-.8 .8)">${snail([[0.6, 2.6], [7.6, 9.2]])}${vis(6.6, 9.0, `<g transform="translate(40 -186)">${plate(0, 0)}<g transform="translate(0 -20) scale(1.1)">${croissant}</g></g>`)}</g>`, 0, 30, (t) => ({ x: snailPos(t), y: t < 6.6 ? 485 : t < 10.0 ? lerp(485, 570, clamp((t - 6.6) / 0.6, 0, 1)) : lerp(570, 485, clamp((t - 10.0) / 2, 0, 1)), s: 1 }), 15);

// Rouge-Gorge : entre par la fenêtre, se pose sur le plateau, mange sa moitié, puis se pose sur la tête de Roussin
const BS = 1.5;
const flyTo = (t0, t1, [x0, y0], [x1, y1], arc = -60, sc = BS) => vis(t0, t1 + 0.02, track(bird(true, false), t0, t1, (t, u) => { const k = ss(u); return { x: lerp(x0, x1, k), y: lerp(y0, y1, k) + arc * Math.sin(Math.PI * k), sx: x1 > x0 ? -sc : sc, sy: sc }; }));
const PERCH = [CRO[0] + 92, TRAY[1] - 44];
const HEADTOP = [FOX[0] + 40, FOX[1] - 282];
const sadEyes = `<g><circle cx="-20" cy="-10" r="11" fill="#fff" stroke="${INK}" stroke-width="1.5"/><circle cx="-21" cy="-8" r="7.6" fill="${INK}"/><circle cx="-24" cy="-11.5" r="2.8" fill="#fff"/><circle cx="-18.5" cy="-5" r="1.4" fill="#fff"/><ellipse cx="-21" cy="1.5" rx="3.5" ry="2" fill="#bfe6ff"/><path d="M-31 -21 Q-22 -25 -11 -29" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/></g>`;
const birdEl =
  flyTo(12.0, 13.5, [WIN.X + 150, 240], PERCH, -110) +
  vis(13.5, 17.5, `<g transform="translate(${PERCH[0]} ${PERCH[1] - 6}) scale(1.8)">${bird(false, false)}${vis(14.0, 17.5, sadEyes)}</g>`) +
  vis(17.5, 20.1, `<g transform="translate(${PERCH[0]} ${PERCH[1]}) scale(${BS})"><g style="transform-origin:-10px 10px;${an({ n: 'peck', d: 0.3, t: 18.9, c: 4 })}"><g style="${an({ n: 'hopk', d: 0.3, t: 18.05, c: 3 })}">${bird(false, false)}</g></g></g>`) +
  flyTo(20.1, 20.9, PERCH, HEADTOP, -70) +
  vis(20.9, 99, `<g transform="translate(${HEADTOP[0]} ${HEADTOP[1]}) scale(${BS})"><g style="${an({ n: 'hopk', d: 0.3, t: 21.0, c: 3 })}"><g transform="scale(-1 1)">${bird(false, false)}</g></g></g>`);
const hearts = [[PERCH[0], PERCH[1] - 40, 19.9], [HEADTOP[0] + 10, HEADTOP[1] - 40, 21.2], [FOX[0] + 140, FOX[1] - 250, 21.5], [HEADTOP[0] - 30, HEADTOP[1] - 20, 22.0]].map(([x, y, t]) =>
  vis(t, t + 1.3, `<g transform="translate(${x} ${y})"><g style="${an({ n: 'heart', d: 1.3, t, f: 'both' })}"><path d="M0 12 C-26 -6 -16 -26 0 -14 C16 -26 26 -6 0 12Z" fill="#ff5c7a" stroke="${INK}" stroke-width="3"/></g></g>`)).join('');

const pawOn = vis(16.95, 17.75, `<g style="${an({ n: 'press', d: 0.2, t: 17.3, f: 'forwards' })},${ao({ n: 'retract', d: 0.25, t: 17.5, f: 'forwards' })}"><path d="M${FOX[0] + 95} ${FOX[1] - 125} Q${CRO[0] - 70} ${CRO[1] - 30} ${CRO[0] - 46} ${CRO[1] - 18}" stroke="#3a2418" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M${FOX[0] + 95} ${FOX[1] - 125} Q${CRO[0] - 70} ${CRO[1] - 30} ${CRO[0] - 46} ${CRO[1] - 18}" stroke="#f28a1e" stroke-width="22" fill="none" stroke-linecap="round"/><g transform="translate(${CRO[0] - 44} ${CRO[1] - 18})"><ellipse rx="19" ry="15" fill="#f28a1e" stroke="#3a2418" stroke-width="3.5"/><path d="M-7 -12 v8 M0 -14 v9 M7 -12 v8" stroke="#3a2418" stroke-width="2.5" stroke-linecap="round"/></g></g>`);
addKF('@keyframes press{to{transform:translateY(8px)}}');
addKF('@keyframes retract{to{transform:translate(-110px,10px)}}');
const world = `${wall}
  ${backRow.replace(/<g>/, '<g>')}${pals}
  ${vis(0, 6.6, snailEl)}${vis(11.5, 99, snailEl)}${basket}${counterFront}
  ${croFly}${foxEl}${vis(6.6, 11.5, snailEl)}${rabEl}
  ${tableFront}${tray}${croOnTray}${halves}${pawOn}
  ${birdEl}${hearts}`;

const fx =
  say('snail', 'Le dessert...', 0.6, 2.0, { bx: 620, by: 160, tips: [[200, 400]] }) +
  sfx('GROOOUUU...', 330, 640, 4.6, 1.4, -4, '#b57bff', 66, 'tummy') +
  say('snail', '...croissant !', 7.6, 1.6, { bx: 860, by: 160, tips: [[560, 450]] }) +
  say('fox', 'Enfin ! Mon croissant !', 10.0, 1.7, { bx: 800, by: 120, tips: [[690, 430]], shout: true }) +
  sfx('CUI ?', 560, 400, 13.3, 0.7, -8, '#ff6f95', 58, 'chirp') +
  say('rab', 'On partage ?', 15.3, 1.2, { bx: 880, by: 120, tips: [[1080, 250]] }) +
  sfx('CRAC !', 1010, 150, SPLIT, 0.8, -8, '#ffd23f', 90, 'crack') +
  say('fox', 'Tiens, la moitié !', 18.4, 1.3, { bx: 330, by: 110, tips: [[470, 165]] }) +
  sfx('CUI CUI !', 720, 110, 20.1, 1.0, 8, '#ff6f95', 64, 'chirp') +
  say('rab', 'Bravo, Roussin !', 23.3, 1.4, { bx: 1000, by: 140, tips: [[960, 330]] }) +
  say('fox', 'Délicieux !', 24.8, 0.9, { bx: 760, by: 260, tips: [[640, 480]], shout: true }) +
  card(27.3, 'À la cantine !', 'la pause de midi', 640, 235);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#fff6e3"/>
<g style="${camStyle}">${world}</g>
${timeBadge(12, 0)}
${fx}
</svg>`;
sfxEv.push({ name: 'chime', t: 9.65 }, { name: 'whoosh', t: 12.2 }, { name: 'chime', t: 20.0 }, { name: 'whoosh', t: 20.1 }, { name: 'laugh', t: 20.4 });
writeFileSync(new URL('./a-la-cantine.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 112, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
