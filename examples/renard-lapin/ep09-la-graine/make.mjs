// Roussin & Lino · Épisode 9 « La graine » — 30 s, 1280x720. 14h30, la salle de classe, le rebord de la fenêtre.
//
// Découpage :
//  0.0– 3.5  plan large      la maîtresse : « On plante une graine ! » ; Lino, sur un tabouret, la met dans le pot : « Pousse vite ! »
//  3.5– 6.5  le pot          Lino fixe le pot : « Allez... pousse ! » — rien
//  6.5– 9.5  l'horloge       accéléré comique : les aiguilles filent, TIC TAC
//  9.5–12.0  Lino           toujours rien : « Toujours rien... » ; il se tourne vers l'horloge
// 12.0–15.0  la fenêtre      dans son dos, Rouge-Gorge entre avec un petit arrosoir et arrose le pot ; Roussin le voit et sourit
// 15.0–18.0  l'horloge       nouvel accéléré, jusqu'à 15h55
// 18.0–21.0  le pot          une pousse ! « Elle pousse ! » ; Lino se tourne vers Roussin (« Roussin, regarde ! ») ; l'oiseau revient arroser
// 21.0–23.6  l'horloge       la dernière minute… 16h00 : DRIIING !
// 23.6–28.2  le pot          une grande fleur jaillit (POP) : « Quelle belle fleur ! » ; l'oiseau se pose dessus ; Roussin : « C'est l'oiseau qui arrose ! » ; Lino : « Merci, petit oiseau ! »
// 28.2–30.0  plan large      carton
import { writeFileSync } from 'node:fs';
import { timeBadge } from '../lib/badge.mjs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, owl, put, style, addKF, track, ss } from '../lib/kit.mjs';
import { makeCam, say, card, bird, pal, puff } from '../lib/props.mjs';
import { wall, banner, board, windowEl, openSash, radiator, desk, book, pencil } from '../lib/classroom.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.5, 640, 360, 1.0, 1.03],
  [3.5, 6.5, 1010, 370, 2.1, 2.15],
  [6.5, 8.0, 150, 160, 3.0, 3.3],
  [8.0, 12.0, 880, 400, 1.7, 1.75],
  [12.0, 15.0, 960, 360, 1.25, 1.3],
  [15.0, 16.5, 150, 160, 2.6, 2.9],
  [16.5, 21.0, 860, 400, 1.35, 1.42],
  [21.0, 22.0, 150, 160, 3.0, 3.1],
  [22.0, 23.6, 920, 405, 1.5, 1.55],
  [23.6, 28.2, 740, 330, 1.25, 1.28],
  [28.2, 30, 640, 360, 1.0, 1.03],
];
const { camStyle } = makeCam(SHOTS, DUR);
const lerp = (a, b, u) => a + (b - a) * u;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

// ───────── horloge animée (accélérés comiques) ─────────
// angle de l'aiguille des minutes (deg) en fonction du temps : 14h30 → 15h00 → 15h55 → 16h00
const MPTS = [[0, 180], [6.6, 180], [8.0, 360], [15.0, 360], [16.4, 690], [21.0, 690], [21.25, 696], [21.5, 702], [21.7, 708], [21.9, 720]];
const kf = (name, pts, f) => `@keyframes ${name}{${pts.map(([t, a]) => `${((t / DUR) * 100).toFixed(3)}%{transform:rotate(${f(a).toFixed(1)}deg)}`).join('')}100%{transform:rotate(${f(pts[pts.length - 1][1]).toFixed(1)}deg)}}`;
// heure : 14h30 = 75° ; l'aiguille des heures avance de 1/12 des minutes (le tour « comique » en plus ne compte pas)
const realMin = (a) => a;
addKF(kf('clockM', MPTS, (a) => a) + '\n' + kf('clockH', MPTS, (a) => 60 + realMin(a) / 12));
addKF(`@keyframes grow{0%{transform:scale(0)}55%{transform:scale(1.25)}100%{transform:scale(1)}}
@keyframes growY{0%{transform:scaleY(0)}70%{transform:scaleY(1.12)}100%{transform:scaleY(1)}}
@keyframes pour{0%,100%{transform:rotate(0)}25%,80%{transform:rotate(-38deg)}}
@keyframes hover{from{transform:translateY(0)}to{transform:translateY(-8px)}}
@keyframes speed{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes sway2{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}
@keyframes giggle{from{transform:translateY(0)}to{transform:translateY(-6px)}}
@keyframes sparkle{0%{opacity:0;transform:scale(.2) rotate(0)}30%{opacity:1;transform:scale(1.2) rotate(40deg)}100%{opacity:0;transform:scale(.6) rotate(90deg)}}`);
const clock = `<g transform="translate(150 150)"><circle r="50" fill="#fff" stroke="${INK}" stroke-width="7"/><circle r="43" fill="none" stroke="#3b82f6" stroke-width="3"/>
  ${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-38" x2="0" y2="${i % 3 ? -33 : -28}" stroke="${INK}" stroke-width="${i % 3 ? 2.5 : 4}" transform="rotate(${i * 30})"/>`).join('')}
  <g style="${an({ n: 'clockH', d: DUR, f: 'both' })}"><line x1="0" y1="0" x2="0" y2="-22" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></g>
  <g style="${an({ n: 'clockM', d: DUR, f: 'both' })}"><line x1="0" y1="0" x2="0" y2="-34" stroke="#e8434e" stroke-width="4" stroke-linecap="round"/></g><circle r="4.5" fill="${INK}"/>
  ${[[6.6, 8.0], [15.0, 16.4]].map(([a, b]) => vis(a, b, `<g style="${an({ n: 'speed', d: 0.4, t: a, c: 20 })}"><path d="M0 -62 A62 62 0 0 1 54 -31 M0 62 A62 62 0 0 1 -54 31" stroke="#ff8fb1" stroke-width="6" fill="none" stroke-linecap="round"/></g>`)).join('')}</g>`;

// ───────── tableau ─────────
const chalk = '#f6f6ea';
const boardInner = `<text x="586" y="150" style="font-size:34px;fill:#e8f2e0;font-weight:400">La graine</text>
  <g transform="translate(420 270)"><ellipse rx="12" ry="8" fill="none" stroke="${chalk}" stroke-width="4"/></g>
  <path d="M460 270 h40 l-10 -8 M500 270 l-10 8" stroke="${chalk}" stroke-width="4" fill="none" stroke-linecap="round"/>
  <g transform="translate(560 290)"><path d="M0 0 v-36 M0 -24 q-16 -10 -24 2 q12 6 24 -2 M0 -30 q16 -10 24 2 q-12 6 -24 -2" stroke="${chalk}" stroke-width="4" fill="none"/></g>
  <path d="M610 270 h40 l-10 -8 M650 270 l-10 8" stroke="${chalk}" stroke-width="4" fill="none" stroke-linecap="round"/>
  <g transform="translate(720 300)"><path d="M0 0 v-60" stroke="${chalk}" stroke-width="4"/>${Array.from({ length: 8 }, (_, i) => `<ellipse cx="0" cy="-86" rx="7" ry="14" fill="none" stroke="#ffe27a" stroke-width="3.5" transform="rotate(${i * 45} 0 -72) translate(0 0)"/>`).join('')}<circle cy="-72" r="9" fill="none" stroke="#ffb84d" stroke-width="4"/></g>`;

// ───────── le pot, la pousse, la fleur ─────────
const POT = [1050, 384];
const SOIL = [POT[0], POT[1] - 50];
const pot = `<g transform="translate(${POT[0]} ${POT[1]})"><path d="M-30 -48 L30 -48 L22 0 L-22 0Z" fill="#e2703a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><rect x="-35" y="-58" width="70" height="13" rx="4" fill="#f08a4b" stroke="${INK}" stroke-width="4"/><ellipse cy="-52" rx="27" ry="4.5" fill="#6b4a2e"/><path d="M-14 -28 q6 6 12 0" stroke="#b9541f" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
const seed = vis(2.0, 2.65, track(`<ellipse rx="14" ry="10" fill="#8a5a33" stroke="${INK}" stroke-width="3"/>`, 2.0, 2.6, (t, u) => ({ x: lerp(940, SOIL[0], u), y: lerp(520, SOIL[1] - 2, u) - 110 * Math.sin(Math.PI * u), r: 200 * u, s: 1 })));
const sprout = vis(18.4, 24.05, `<g transform="translate(${SOIL[0]} ${SOIL[1]})"><g style="transform-origin:0 0;${an({ n: 'grow', d: 0.45, t: 18.4, f: 'both', e: 'ease-out' })}"><g style="transform-origin:0 0;animation:sway2 1s ease-in-out infinite alternate">
  <path d="M0 0 v-30" stroke="#2f8f3e" stroke-width="6" stroke-linecap="round"/><path d="M0 -22 q-20 -14 -30 2 q14 8 30 -2Z M0 -26 q20 -14 30 2 q-14 8 -30 -2Z" fill="#6fd27e" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></g></g></g>`);
const FL = [SOIL[0], SOIL[1] - 128];
const flower = vis(24.0, 99, `<g transform="translate(${SOIL[0]} ${SOIL[1]})"><g style="transform-origin:0 0;${an({ n: 'growY', d: 0.35, t: 24.0, f: 'both', e: 'ease-out' })}"><g style="transform-origin:0 0;animation:sway2 1.4s ease-in-out infinite alternate">
  <path d="M0 0 C-8 -40 10 -80 0 -110" stroke="#2f8f3e" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M-2 -40 q-30 -18 -46 4 q22 12 46 -4Z M2 -64 q30 -18 46 4 q-22 12 -46 -4Z" fill="#6fd27e" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
  <g transform="translate(0 -128)"><g style="transform-origin:0 0;${an({ n: 'grow', d: 0.45, t: 24.2, f: 'both', e: 'cubic-bezier(.3,1.6,.5,1)' })}">
    ${Array.from({ length: 10 }, (_, i) => `<ellipse cx="0" cy="-34" rx="14" ry="24" fill="#ffd23f" stroke="${INK}" stroke-width="3.5" transform="rotate(${i * 36})"/>`).join('')}
    <circle r="24" fill="#ff9f43" stroke="${INK}" stroke-width="4"/><path d="M-10 -4 q3 -4 6 0 M4 -4 q3 -4 6 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M-8 6 q8 8 16 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="-15" cy="6" rx="5" ry="3" fill="#ff8fa3"/><ellipse cx="15" cy="6" rx="5" ry="3" fill="#ff8fa3"/></g></g></g></g></g>` +
  [[-90, -40], [86, -60], [-60, 50], [70, 40], [0, -100]].map(([dx, dy], i) => `<g transform="translate(${FL[0] + dx} ${FL[1] + dy})"><g style="${an({ n: 'sparkle', d: 0.8, t: 24.2 + i * 0.12, c: 2, f: 'both' })}"><path d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4Z" fill="#ffe27a" stroke="${INK}" stroke-width="2"/></g></g>`).join(''));

// ───────── Rouge-Gorge et son petit arrosoir ─────────
const BS = 1.4;
const HOV = [1140, 262];
const can = (t) => `<g transform="translate(-44 8)"><g style="transform-origin:0 0;${an({ n: 'pour', d: 1.3, t })}"><rect x="-12" y="-9" width="22" height="16" rx="4" fill="#7cc8ff" stroke="${INK}" stroke-width="2.5"/><path d="M-11 -4 L-25 -13" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M-11 -4 L-25 -13" stroke="#7cc8ff" stroke-width="3" stroke-linecap="round"/><path d="M-2 -9 q7 -9 10 0" stroke="${INK}" stroke-width="2.5" fill="none"/></g></g>`;
const flyTo = (t0, t1, [x0, y0], [x1, y1], arc = -40, extra = '') => vis(t0, t1 + 0.02, track(bird(true, false) + extra, t0, t1, (t, u) => { const k = ss(u); return { x: lerp(x0, x1, k), y: lerp(y0, y1, k) + arc * Math.sin(Math.PI * k), sx: x1 > x0 ? -BS : BS, sy: BS }; }));
const drops = (t) => [0, 1, 2].map((i) => vis(t + 0.35 + i * 0.28, t + 0.75 + i * 0.28, track(`<path d="M0 -7 q-6 8 0 11 q6 -3 0 -11z" fill="#4fb3ff" stroke="${INK}" stroke-width="2"/>`, t + 0.35 + i * 0.28, t + 0.7 + i * 0.28, (tt, u) => ({ x: lerp(1046, 1044 + i * 6, u), y: lerp(262, SOIL[1] - 4, u * u), s: 1.7 })))).join('');
const visit = (tIn, tPour, tOut) => flyTo(tIn, tPour - 0.1, [960, 200], HOV, -20, can(99)) +
  vis(tPour - 0.1, tOut, `<g transform="translate(${HOV[0]} ${HOV[1]})"><g style="animation:hover .25s ease-in-out infinite alternate"><g transform="scale(${BS})">${bird(true, false)}${can(tPour)}</g></g></g>`) + drops(tPour) +
  flyTo(tOut, tOut + 0.55, HOV, [960, 120], -30, can(99));
const PERCH = [FL[0] + 4, FL[1] - 58];
const birdEl = visit(12.2, 12.9, 14.3) + visit(16.3, 16.75, 17.6) + visit(19.85, 20.25, 21.0) +
  flyTo(24.7, 25.35, [1340, 140], PERCH, -50) +
  vis(25.35, 99, `<g transform="translate(${PERCH[0]} ${PERCH[1]})"><g style="${an({ n: 'giggle', d: 0.15, t: 25.6, c: 6, dir: 'alternate' })}"><g transform="scale(${BS})">${bird(false, false)}</g></g></g>`);

// ───────── personnages ─────────
const STOOL = [900, 600];
const stool = `<g><path d="M${STOOL[0] - 36} ${STOOL[1] + 14} L${STOOL[0] - 44} 702 M${STOOL[0] + 36} ${STOOL[1] + 14} L${STOOL[0] + 44} 702" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M${STOOL[0] - 36} ${STOOL[1] + 14} L${STOOL[0] - 44} 702 M${STOOL[0] + 36} ${STOOL[1] + 14} L${STOOL[0] + 44} 702" stroke="#c98a4e" stroke-width="7" stroke-linecap="round"/><path d="M${STOOL[0] - 40} 660 H${STOOL[0] + 40}" stroke="#a46a34" stroke-width="6"/><rect x="${STOOL[0] - 52}" y="${STOOL[1]}" width="104" height="18" rx="7" fill="#e8a25a" stroke="${INK}" stroke-width="4"/></g>`;
// Lino regarde le pot (droite) ; tourné vers l'horloge / vers Roussin (gauche)
const RF = (t) => ((t >= 11.0 && t < 18.0) || (t >= 19.75 && t < 23.6) ? -1 : 1);
const rab = rabbit({
  run: null, talk: [[2.65, 3.4], [4.0, 5.6], [10.0, 11.0], [18.6, 19.6], [19.9, 20.9], [26.2, 27.5]], gest: [[1.6, 2.4], [18.6, 19.6], [26.2, 27.5]],
  eyes: [[3.5, 6.5, 'side'], [9.5, 11.3, 'down'], [18.0, 18.25, 'down'], [11.3, 15.0, 'side'], [18.25, 19.7, 'side'], [24.0, 27.7, 'up'], [27.7, 30, 'arc']],
  moods: [[2.4, 3.4, 'happy'], [3.5, 6.5, 'oh'], [9.5, 15.0, 'sad'], [18.0, 18.25, 'sad'], [18.25, 21.0, 'happy'], [24.0, 25.3, 'oh'], [25.3, 30, 'happy']],
  jolt: [18.1, 24.05], blush: [[26.2, 27.6]], noShadow: true, noBag: true,
});
const rabEl = track(rab, 0, 30, (t) => ({ x: STOOL[0], y: STOOL[1] + 2, sx: 0.95 * RF(t), sy: 0.95 }), 60);
const foxEl = put(500, 690, 1.15, `<g style="animation:${'none'}">${fox({
  run: null, upright: -14, talk: [[25.4, 26.0]],
  eyes: [[12.6, 14.4, 'up'], [14.4, 15.0, 'arc'], [18.4, 19.7, 'wide'], [19.9, 21.0, 'up'], [24.0, 25.2, 'wide'], [25.2, 26.4, 'up'], [26.4, 30, 'arc']],
  moods: [[12.6, 13.4, 'oh'], [13.4, 15.0, 'happy'], [18.4, 21.0, 'happy'], [24.0, 25.2, 'oh'], [25.2, 30, 'happy']],
  blush: [[13.4, 15.0]],
})}</g>`);
const owlT = [[0.4, 1.9]];
const owlEl = put(185, 640, 1.3, `<g style="animation:owlsway 1.8s ease-in-out infinite alternate">${owl(owlT, { happyAt: 24.3, watchAt: null, point: [[0.4, 1.9]], look: [[1.9, 3.4, 9]] })}</g>`);
const pals = put(395, 540, 0.85, pal('duck', { eyes: [[24.1, 26.0, 'wide'], [26.0, 30, 'arc']], moods: [[24.1, 26.0, 'oh'], [26.0, 30, 'happy']], talk: [[24.3, 25.2]], look: 4 })) +
  put(300, 540, 0.85, pal('mouse', { eyes: [[24.1, 26.0, 'wide'], [26.0, 30, 'arc']], moods: [[24.1, 26.0, 'oh'], [26.0, 30, 'happy']], talk: [[24.3, 25.2]], look: 4 }));
const backDesk = desk(450, 560, 250, 640, book(410, 554, '#7cc8ff') + pencil(500, 552, 6));

const wallNoPlant = wall.replace(/<g transform="translate\(900 470\)">[\s\S]*?<\/g>/, '');
const world = `${wallNoPlant}${banner}${board(boardInner)}${clock}${windowEl('', { open: true })}${openSash()}${radiator(false)}
  ${owlEl}${pals}${backDesk}
  ${foxEl}
  ${pot}${seed}${sprout}${flower}
  ${stool}${rabEl}
  ${birdEl}`;

const fx =
  say('owl', 'On plante une graine !', 0.4, 1.5, { bx: 420, by: 325, tips: [[225, 440]] }) +
  say('rab', 'Pousse vite !', 2.65, 0.85, { bx: 780, by: 350, tips: [[930, 450]], shout: true }) +
  say('rab', 'Allez... pousse !', 4.0, 1.6, { bx: 880, by: 600, tips: [[665, 600]] }) +
  sfx('TIC TAC TIC TAC', 640, 610, 6.6, 1.4, -4, '#ff8fb1', 58, 'click') +
  say('rab', 'Toujours rien...', 9.0, 1.2, { bx: 470, by: 300, tips: [[640, 395]] }) +
  sfx('plic !', 1040, 245, 13.6, 0.3, 6, '#1e8fe0', 36, 'click') + sfx('ploc !', 960, 320, 13.92, 0.4, -6, '#1e8fe0', 36, 'click') + sfx('plic !', 960, 190, 20.6, 0.35, 6, '#1e8fe0', 50, 'click') + sfx('plic !', 1000, 200, 17.0, 0.4, 6, '#1e8fe0', 50, 'click') +
  sfx('TIC TAC TIC TAC', 640, 610, 15.0, 1.4, 4, '#ff8fb1', 58, 'click') +
  sfx('POP !', 1000, 170, 18.4, 0.7, -8, '#ffd23f', 90, 'poof') +
  say('rab', 'Elle pousse !', 18.7, 1.2, { bx: 1050, by: 360, tips: [[870, 450]], shout: true }) +
  say('rab', 'Roussin, regarde !', 19.9, 1.0, { bx: 290, by: 205, tips: [[515, 410]] }) +
  sfx('tic... tac...', 640, 600, 21.0, 0.9, -4, '#ff8fb1', 50, 'click') +
  sfx('DRIIING !', 640, 560, 21.9, 0.9, -6, '#ffd23f', 90, 'bell') +
  sfx('POP !', 1110, 110, 24.1, 0.7, 8, '#ffd23f', 76, 'poof') +
  say('rab', 'Quelle belle fleur !', 24.35, 0.9, { bx: 1010, by: 600, tips: [[870, 605]], shout: true }) +
  sfx('CUI CUI !', 745, 150, 25.6, 0.8, 8, '#ff6f95', 34, 'chirp') +
  say('fox', 'C’est l’oiseau qui arrose !', 25.4, 1.4, { bx: 560, by: 410, tips: [[345, 500]] }) +
  say('rab', 'Merci, petit oiseau !', 26.9, 1.25, { bx: 1082, by: 620, tips: [[825, 605]] }) +
  card(28.2, 'La graine !', 'le club de musique', 640, 215);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#ffe9bd"/>
<g style="${camStyle}">${world}</g>
${timeBadge(14, 30)}
${fx}
</svg>`;
for (let t = 6.7; t < 8.0; t += 0.3) sfxEv.push({ name: 'click', t: +t.toFixed(2) });
for (let t = 15.1; t < 16.4; t += 0.3) sfxEv.push({ name: 'click', t: +t.toFixed(2) });
for (const t of [21.2, 21.45, 21.7]) sfxEv.push({ name: 'click', t });
sfxEv.push({ name: 'whoosh', t: 12.2 }, { name: 'whoosh', t: 16.3 }, { name: 'whoosh', t: 19.85 }, { name: 'chime', t: 18.4 }, { name: 'chime', t: 24.15 }, { name: 'whoosh', t: 24.7 });
writeFileSync(new URL('./la-graine.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 116, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
