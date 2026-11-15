// Roussin & Lino · Épisode 13 « Les devoirs » — 30 s, 1280x720. 19h15, le salon de Lino.
//
// Découpage :
//  0.0– 3.5  plan large      le salon, la lampe ; Lino : « Les devoirs ! »
//  3.5– 6.5  le cahier       « 2 + 2 = ? » — Lino : « Deux plus deux... »
//  6.5– 9.5  Lino           il compte sur ses doigts, hésite : « Euh... trois ? Cinq ? »
//  9.5–12.5  Roussin          fier : « Quatre croissants ! » (bulle de pensée : 2 croissants + 2 croissants)
// 12.5–15.5  plan à deux     Lino : « Des croissants ?! » ; ils rient
// 15.5–19.0  la fenêtre      TOC TOC TOC TOC : Rouge-Gorge frappe 4 fois à la vitre (1, 2, 3, 4)
// 19.0–22.0  Lino           « Un, deux, trois, quatre... Quatre ! » — il écrit 4
// 22.0–25.0  le cahier       « 2 + 2 = 4 » ✓ ; Lino : « C'est juste ! »
// 25.0–27.6  plan à deux     Roussin : « Et quatre croissants ! » ; Rouge-Gorge salue à la fenêtre
// 27.6–30.0  plan large      carton
import { writeFileSync } from 'node:fs';
import { timeBadge } from '../lib/badge.mjs';
import { W, H, INK, lines, sfxEv, an, ao, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../lib/kit.mjs';
import { makeCam, say, card, bird, croissant } from '../lib/props.mjs';
import { wallClock } from '../lib/classroom.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.5, 640, 420, 1.2, 1.23],
  [3.5, 6.5, 640, 545, 2.2, 2.25],
  [6.5, 9.5, 780, 450, 1.8, 1.85],
  [9.5, 12.5, 540, 390, 1.45, 1.5],
  [12.5, 15.5, 660, 450, 1.5, 1.55],
  [15.5, 19.0, 1090, 185, 1.75, 1.8],
  [19.0, 22.0, 820, 400, 1.6, 1.65],
  [22.0, 25.0, 640, 520, 1.8, 1.83],
  [25.0, 27.6, 760, 410, 1.3, 1.33],
  [27.6, 30, 640, 420, 1.15, 1.18],
];
const { camStyle } = makeCam(SHOTS, DUR);
const lerp = (a, b, u) => a + (b - a) * u;
addKF(`@keyframes numpop{0%{opacity:0;transform:translateY(10px) scale(.3)}25%{opacity:1;transform:translateY(-10px) scale(1.2)}70%{opacity:1;transform:translateY(-24px) scale(1)}100%{opacity:0;transform:translateY(-40px) scale(.9)}}
@keyframes numstay{0%{opacity:0;transform:scale(.3)}40%{opacity:1;transform:scale(1.25)}100%{opacity:1;transform:scale(1)}}
@keyframes peck2{0%,100%{transform:rotate(0) translateX(0)}40%{transform:rotate(-16deg) translateX(-14px)}}
@keyframes write{from{stroke-dashoffset:200}to{stroke-dashoffset:0}}
@keyframes stamp{0%{opacity:0;transform:scale(2.2) rotate(-20deg)}60%{opacity:1;transform:scale(.9) rotate(4deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes thinkin{0%{opacity:0;transform:scale(.3)}100%{opacity:1;transform:scale(1)}}
@keyframes giggle{from{transform:translateY(0)}to{transform:translateY(-6px)}}
@keyframes lampglow{from{opacity:.25}to{opacity:.4}}
@keyframes wavebird{0%,100%{transform:rotate(0)}50%{transform:rotate(-30deg)}}`);

// ───────── décor : le salon de Lino ─────────
const FLOOR = 560;
const WIN = { X: 990, Y: 100, W: 230, H: 240 };
const bg = `<rect width="${W}" height="${H}" fill="#dfe9ff"/>
  ${Array.from({ length: 22 }, (_, i) => `<path d="M${i * 60 + 30} 0 V${FLOOR - 80}" stroke="#cbd9fb" stroke-width="14"/>`).join('')}
  ${Array.from({ length: 20 }, (_, i) => `<circle cx="${(i % 10) * 128 + 64}" cy="${60 + Math.floor(i / 10) * 180}" r="6" fill="#fff" opacity=".7"/>`).join('')}
  <rect y="${FLOOR - 86}" width="${W}" height="86" fill="#b9c9f0"/><rect y="${FLOOR - 92}" width="${W}" height="10" rx="4" fill="#8fa6dc" stroke="${INK}" stroke-width="3"/>
  <rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="#c98a4e"/>
  ${Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${FLOOR + 14 + i * 30}" x2="${W}" y2="${FLOOR + 14 + i * 30}" stroke="#b37740" stroke-width="3"/>`).join('')}
  <ellipse cx="640" cy="${FLOOR + 110}" rx="460" ry="60" fill="#e8434e" opacity=".85"/><ellipse cx="640" cy="${FLOOR + 110}" rx="400" ry="44" fill="none" stroke="#ffd23f" stroke-width="6" stroke-dasharray="18 14"/>
  <defs><linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2a5c"/><stop offset="1" stop-color="#3d4f96"/></linearGradient>
    <clipPath id="win13"><rect x="${WIN.X + 12}" y="${WIN.Y + 12}" width="${WIN.W - 24}" height="${WIN.H - 24}"/></clipPath></defs>
  <rect x="${WIN.X}" y="${WIN.Y}" width="${WIN.W}" height="${WIN.H}" rx="8" fill="#fff" stroke="${INK}" stroke-width="6"/>
  <g clip-path="url(#win13)"><rect x="${WIN.X}" y="${WIN.Y}" width="${WIN.W}" height="${WIN.H}" fill="url(#night)"/>
    <circle cx="${WIN.X + 170}" cy="${WIN.Y + 60}" r="24" fill="#fff6c8"/><circle cx="${WIN.X + 180}" cy="${WIN.Y + 52}" r="22" fill="#26357a"/>
    ${[[30, 40], [80, 90], [120, 30], [60, 150], [190, 140]].map(([x, y]) => `<circle cx="${WIN.X + x}" cy="${WIN.Y + y}" r="3" fill="#fff6c8"/>`).join('')}
    <path d="M${WIN.X} ${WIN.Y + 200} Q${WIN.X + 80} ${WIN.Y + 170} ${WIN.X + 150} ${WIN.Y + 195} T${WIN.X + WIN.W} ${WIN.Y + 185} V${WIN.Y + WIN.H} H${WIN.X}Z" fill="#2d4a3a"/></g>
  <rect x="${WIN.X + WIN.W / 2 - 5}" y="${WIN.Y}" width="10" height="${WIN.H}" fill="#fff" stroke="${INK}" stroke-width="3"/>
  <rect x="${WIN.X}" y="${WIN.Y + WIN.H / 2 - 5}" width="${WIN.W}" height="10" fill="#fff" stroke="${INK}" stroke-width="3"/>
  <rect x="${WIN.X - 14}" y="${WIN.Y + WIN.H - 4}" width="${WIN.W + 28}" height="16" rx="5" fill="#eadfca" stroke="${INK}" stroke-width="5"/>
  <path d="M${WIN.X - 30} ${WIN.Y - 20} Q${WIN.X - 10} ${WIN.Y + 120} ${WIN.X - 26} ${WIN.Y + WIN.H + 20} L${WIN.X - 60} ${WIN.Y + WIN.H + 20} L${WIN.X - 60} ${WIN.Y - 20}Z" fill="#ff8fb1" stroke="${INK}" stroke-width="4"/>
  <path d="M${WIN.X + WIN.W + 30} ${WIN.Y - 20} Q${WIN.X + WIN.W + 10} ${WIN.Y + 120} ${WIN.X + WIN.W + 26} ${WIN.Y + WIN.H + 20} L${WIN.X + WIN.W + 60} ${WIN.Y + WIN.H + 20} L${WIN.X + WIN.W + 60} ${WIN.Y - 20}Z" fill="#ff8fb1" stroke="${INK}" stroke-width="4"/>
  ${wallClock(19, 15, 640, 110)}
  <g transform="translate(170 ${FLOOR})"><path d="M-8 0 V-250" stroke="#8a5a33" stroke-width="10"/><ellipse cy="0" rx="50" ry="10" fill="#8a5a33" stroke="${INK}" stroke-width="3"/>
    <path d="M-60 -250 L60 -250 L40 -320 L-40 -320Z" fill="#ffd23f" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    <ellipse cx="0" cy="-150" rx="190" ry="150" fill="#fff2a8" style="animation:lampglow 2s ease-in-out infinite alternate"/></g>
  <g transform="translate(360 300)"><rect x="-70" y="-60" width="140" height="100" rx="6" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="-58" y="-48" width="116" height="76" fill="#bfe6ff"/><circle cx="-20" cy="-10" r="18" fill="#ff9f43" stroke="${INK}" stroke-width="3"/><circle cx="22" cy="-6" r="16" fill="#f1eff7" stroke="${INK}" stroke-width="3"/></g>`;

// ───────── table et cahier ─────────
const TABLE_Y = 610;
const table = `<g><rect x="300" y="${TABLE_Y}" width="680" height="20" rx="8" fill="#a46a34" stroke="${INK}" stroke-width="5"/><rect x="320" y="${TABLE_Y + 20}" width="640" height="40" fill="#8a5224" stroke="${INK}" stroke-width="5"/>
  <rect x="340" y="${TABLE_Y + 60}" width="22" height="70" fill="#8a5224" stroke="${INK}" stroke-width="4"/><rect x="918" y="${TABLE_Y + 60}" width="22" height="70" fill="#8a5224" stroke="${INK}" stroke-width="4"/></g>`;
const NB = [640, TABLE_Y - 4];
const PENCIL = (x, y) => `<g transform="translate(${x} ${y}) rotate(-30)"><rect x="-6" y="-46" width="12" height="60" rx="3" fill="#ffd23f" stroke="${INK}" stroke-width="3"/><path d="M-6 14 L0 26 L6 14Z" fill="#f3d2a2" stroke="${INK}" stroke-width="3"/></g>`;
const CRO = `<g><path d="M-58 26 Q-56 -34 0 -38 Q56 -34 58 26 Q44 4 28 6 Q18 -8 0 -8 Q-18 -8 -28 6 Q-44 4 -58 26Z" fill="#E8A640" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-28 0 Q-30 -20 -20 -32 M28 0 Q30 -20 20 -32" stroke="#b97520" stroke-width="3" fill="none"/></g>`;
const nbText = (s, x, y, size, col = '#2b5ba8') => `<text x="${x}" y="${y}" style="font-size:${size}px;fill:${col};font-weight:700">${s}</text>`;
const notebook = `<g transform="translate(${NB[0]} ${NB[1]})"><path d="M-118 0 L118 0 L108 -58 L-108 -58Z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  ${[0, 1, 2].map((i) => `<line x1="${-102 + i * 2}" y1="${-44 + i * 15}" x2="${102 - i * 2}" y2="${-44 + i * 15}" stroke="#bfe6ff" stroke-width="2"/>`).join('')}
  <line x1="-82" y1="-56" x2="-84" y2="-2" stroke="#ff8fb1" stroke-width="2.5"/>
  ${nbText('2 + 2 =', -10, -14, 30)}
  ${vis(0, 21.3, nbText('?', 58, -14, 32, '#e8434e'))}
  ${vis(21.3, 99, `<path d="M62 -36 L62 -24 L74 -24 M70 -38 L70 -14" stroke="#2b5ba8" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="200" style="${an({ n: 'write', d: 0.4, t: 21.3, f: 'both' })}"/>`)}
  ${vis(22.3, 99, `<g transform="translate(98 -24) scale(.8)"><g style="${an({ n: 'stamp', d: 0.4, t: 22.3, f: 'both' })}"><path d="M-14 0 L-4 12 L18 -16" stroke="#22a06b" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></g>`)}
  ${vis(23.0, 99, `<g transform="translate(97 -43) scale(.55)"><g style="${an({ n: 'stamp', d: 0.4, t: 23.0, f: 'both' })}"><path d="M0 -18 L5 -6 L18 -5 L8 4 L11 17 L0 10 L-11 17 L-8 4 L-18 -5 L-5 -6Z" fill="#ffd23f" stroke="${INK}" stroke-width="2.5"/></g></g>`)}
  ${vis(0, 21.25, PENCIL(150, -10))}${vis(21.75, 99, PENCIL(150, -10))}${[[62, -36], [62, -24], [74, -24], [70, -38], [70, -14]].map(([x, y], i, a) => vis(21.25 + i * 0.1, 21.25 + (i + 1) * 0.1, PENCIL(x - 4, y - 24))).join('')}</g>`;

// ───────── personnages ─────────
const FOX = [470, 685], RAB = [820, 685];
const foxEl = put(FOX[0], FOX[1], 1.15, `<g style="${an({ n: 'giggle', d: 0.16, t: 13.6, c: 10, dir: 'alternate' })},${ao({ n: 'giggle', d: 0.16, t: 25.4, c: 12, dir: 'alternate' })}">${fox({
  run: null, upright: -12, talk: [[9.8, 11.4], [25.2, 26.8]],
  eyes: [[6.6, 9.4, 'side'], [9.6, 11.6, 'arc'], [13.6, 15.2, 'arc'], [15.6, 18.8, 'side'], [19.0, 22.0, 'side'], [22.3, 30, 'arc']],
  moods: [[9.6, 11.6, 'happy'], [13.6, 15.4, 'happy'], [15.6, 19.0, 'oh'], [22.3, 30, 'happy']],
  blush: [[9.8, 11.4]],
})}</g>`);
const rabEl = put(RAB[0], RAB[1], 1.12, `<g style="${an({ n: 'giggle', d: 0.16, t: 13.8, c: 10, dir: 'alternate' })}">${rabbit({
  run: null, noBag: true,
  talk: [[0.6, 1.8], [4.0, 5.6], [6.9, 8.9], [12.7, 13.6], [19.2, 21.4], [23.0, 24.2]], gest: [[19.2, 21.0], [23.0, 24.2]],
  eyes: [[3.6, 6.4, 'down'], [6.6, 9.4, 'side'], [9.6, 11.6, 'side'], [12.6, 13.6, 'wide'], [13.6, 15.2, 'arc'], [15.6, 18.8, 'wide'], [19.0, 21.2, 'back'], [21.2, 22.0, 'down'], [22.8, 30, 'arc']],
  moods: [[0.6, 1.8, 'happy'], [6.6, 9.4, 'shy'], [12.6, 13.6, 'oh'], [13.6, 15.4, 'happy'], [15.6, 19.0, 'oh'], [19.2, 22.0, 'happy'], [22.6, 30, 'happy']],
  jolt: [15.8],
})}</g>`, true);
// doigts qui comptent (6,9–9,0) : petits chiffres au-dessus de la patte de Lino
const PAW = [815, 492];
const pawArm = vis(6.9, 9.0, `<path d="M848 572 Q840 540 ${PAW[0]} ${PAW[1] + 18}" stroke="${INK}" stroke-width="24" fill="none" stroke-linecap="round"/><path d="M848 572 Q840 540 ${PAW[0]} ${PAW[1] + 18}" stroke="#f1eff7" stroke-width="16" fill="none" stroke-linecap="round"/><ellipse cx="${PAW[0]}" cy="${PAW[1]}" rx="20" ry="18" fill="#f1eff7" stroke="${INK}" stroke-width="3.5"/>` + [1, 2, 3].map((n) => vis(7.0 + (n - 1) * 0.6, 9.0, Array.from({ length: n }, (_, k) => `<rect x="${PAW[0] - 14 + k * 10}" y="${PAW[1] - 40}" width="9" height="26" rx="4.5" fill="#f1eff7" stroke="${INK}" stroke-width="3"/>`).join(''))).join(''));
const pawArm2 = vis(19.3, 21.4, `<path d="M848 572 Q840 540 ${PAW[0]} ${PAW[1] + 18}" stroke="${INK}" stroke-width="24" fill="none" stroke-linecap="round"/><path d="M848 572 Q840 540 ${PAW[0]} ${PAW[1] + 18}" stroke="#f1eff7" stroke-width="16" fill="none" stroke-linecap="round"/><ellipse cx="${PAW[0]}" cy="${PAW[1]}" rx="20" ry="18" fill="#f1eff7" stroke="${INK}" stroke-width="3.5"/>` + [1, 2, 3, 4].map((n) => vis(19.3 + (n - 1) * 0.5, 21.4, Array.from({ length: n }, (_, k) => `<rect x="${PAW[0] - 19 + k * 10}" y="${PAW[1] - 40}" width="9" height="26" rx="4.5" fill="#f1eff7" stroke="${INK}" stroke-width="3"/>`).join(''))).join(''));
const fingers = pawArm2 + pawArm + [1, 2, 3].map((n, i) => { const t = 7.0 + i * 0.6; return vis(t, t + 0.6, `<g transform="translate(${PAW[0] + 20} ${PAW[1] - 60})"><g style="${an({ n: 'numpop', d: 0.6, t, f: 'both' })}"><text class="sfx" style="font-size:44px;fill:#2b5ba8;stroke:#fff;stroke-width:6;paint-order:stroke">${n} ?</text></g></g>`); }).join('');
// bulle de pensée de Roussin : 2 croissants + 2 croissants
const think = vis(9.7, 12.5, `<g transform="translate(${FOX[0] - 40} ${FOX[1] - 445})"><g style="transform-origin:60px 120px;${an({ n: 'thinkin', d: 0.35, t: 9.7, f: 'both' })}">
  <circle cx="70" cy="128" r="10" fill="#fff" stroke="${INK}" stroke-width="3.5"/><circle cx="52" cy="104" r="15" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
  <ellipse cx="14" cy="0" rx="292" ry="88" fill="#fff" stroke="${INK}" stroke-width="5"/>
  ${[-215, -120].map((x) => `<g transform="translate(${x} 8) scale(.75)">${CRO}</g>`).join('')}
  <text x="-35" y="22" style="font-size:48px;fill:${INK};font-weight:700">+</text>
  ${[50, 145].map((x) => `<g transform="translate(${x} 8) scale(.75)">${CRO}</g>`).join('')}
  <text x="240" y="20" style="font-size:44px;fill:#e8434e;font-weight:700">= 4</text></g></g>`);
// Rouge-Gorge à la fenêtre : il toque 4 fois
const BW = [WIN.X + 115, WIN.Y + 190];
const knocks = [15.9, 16.6, 17.3, 18.0];
const birdWin = vis(15.4, 99, `<g clip-path="url(#win13)"><g transform="translate(${BW[0]} ${BW[1]}) scale(2.0)"><g style="transform-origin:10px 10px;${knocks.map((t) => an({ n: 'peck2', d: 0.3, t })).join(';').replace(/;animation:/g, ',')}">${vis(0, 25.4, bird(false, false))}${vis(25.4, 99, bird(true, false))}</g></g></g>`);
const knockNums = knocks.map((t, i) => vis(t - 0.05, 19.0, `<g transform="translate(${WIN.X + 30 + i * 50} ${WIN.Y - 30})"><g style="${an({ n: 'numstay', d: 0.3, t: t - 0.05, f: 'both' })}"><text class="sfx" style="font-size:40px;fill:#fff;stroke:${INK};stroke-width:5;paint-order:stroke">${i + 1}</text></g></g>`)).join('');
const countNums = [1, 2, 3, 4].map((n, i) => { const t = 19.3 + i * 0.5; return vis(t, 21.9, `<g transform="translate(${1045 + i * 37} 379)"><g style="${an({ n: 'numstay', d: 0.4, t, f: 'both' })}"><text class="sfx" style="font-size:44px;fill:#fff;stroke:${INK};stroke-width:5;paint-order:stroke">${n}</text></g></g>`); }).join('');
const chairs = `<rect x="${FOX[0] - 80}" y="440" width="22" height="170" rx="8" fill="#a46a34" stroke="${INK}" stroke-width="4"/><rect x="${RAB[0] + 58}" y="440" width="22" height="170" rx="8" fill="#a46a34" stroke="${INK}" stroke-width="4"/>`;

const world = `${bg}${birdWin}${knockNums}${chairs}
  ${foxEl}${rabEl}
  ${table}${notebook}
  ${fingers}${think}${countNums}`;

const fx =
  say('rab', 'Les devoirs !', 0.6, 1.2, { bx: 900, by: 290, tips: [[860, 400]] }) +
  say('rab', 'Deux plus deux...', 4.0, 1.6, { bx: 1060, by: 160, tips: [[900, 300]] }) +
  say('rab', 'Trois ? Cinq ?', 6.9, 2.0, { bx: 900, by: 265, tips: [[700, 470]] }) +
  say('fox', 'Quatre croissants !', 9.8, 1.6, { bx: 930, by: 420, tips: [[700, 520]], shout: true }) +
  say('rab', 'Des croissants ?!', 12.7, 0.9, { bx: 1000, by: 330, tips: [[755, 490]] }) +
  sfx('rires !', 560, 160, 13.7, 1.4, -6, '#e8434e', 56, 'laugh') +
  knocks.map((t, i) => sfx('TOC', 860, 450, t, 0.5, i % 2 ? 8 : -8, '#ffffff', 56, 'knock')).join('') +
  say('rab', 'Un, deux, trois, quatre !', 19.3, 2.6, { bx: 900, by: 265, tips: [[700, 470]] }) +
  say('rab', "C'est juste !", 23.0, 1.2, { bx: 1060, by: 280, tips: [[820, 385]], shout: true }) +
  say('fox', 'Et quatre croissants !', 25.2, 1.6, { bx: 260, by: 300, tips: [[400, 345]] }) +
  sfx('CUI !', 1120, 60, 25.5, 1.9, 8, '#ff6f95', 54, 'chirp') +
  card(27.6, 'Les devoirs !', 'préparer le dodo', 640, 140);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#dfe9ff"/>
<g style="${camStyle}">${world}</g>
${timeBadge(19, 15)}
${fx}
</svg>`;
sfxEv.push({ name: 'chalk', t: 20.6 }, { name: 'chime', t: 22.3 }, { name: 'chime', t: 23.0 });
writeFileSync(new URL('./les-devoirs.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 110, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
