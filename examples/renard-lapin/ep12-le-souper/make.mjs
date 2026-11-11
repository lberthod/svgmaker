// Roussin & Lino · Épisode 12 « Le souper » — 30 s, 1280x720. 18h30, la cuisine de Lino.
//
// Découpage :
//  0.0– 3.5  plan large      la cuisine, la soupe fume ; Lino : « À table ! »
//  3.5– 6.5  Roussin          il s'assoit : GROOOU… « J'ai trop faim ! »
//  6.5– 9.5  la table        Lino le sert : « Soupe de carottes ! »
//  9.5–12.5  Roussin          grimace : « Des carottes ?... Je n'aime pas ça... »
// 12.5–15.5  Lino           « Goûte juste une cuillère ! »
// 15.5–18.5  Roussin          la cuillère tremble… GLOUP… les yeux s'ouvrent : « Mmm ! »
// 18.5–21.5  la table        il dévore : SLURP SLURP ; le bol est vide
// 21.5–24.5  plan large      il tend le bol : « Encore ! » ; Lino rit et le ressert
// 24.5–27.6  Roussin          ventre rond, il le tapote : « Mon ventre est content ! »
// 27.6–30.0  plan large      carton
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, ao, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../lib/kit.mjs';
import { makeCam, say, card } from '../lib/props.mjs';
import { wallClock } from '../lib/classroom.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.5, 640, 430, 1.25, 1.28],
  [3.5, 6.5, 300, 470, 1.7, 1.75],
  [6.5, 9.5, 660, 470, 1.45, 1.5],
  [9.5, 12.5, 400, 450, 1.9, 1.95],
  [12.5, 15.5, 904, 460, 1.7, 1.75],
  [15.5, 18.5, 400, 480, 2.1, 2.15],
  [18.5, 21.5, 560, 460, 1.4, 1.45],
  [21.5, 24.5, 640, 440, 1.3, 1.33],
  [24.5, 27.6, 630, 470, 1.6, 1.65],
  [27.6, 30, 640, 420, 1.18, 1.2],
];
const { camStyle } = makeCam(SHOTS, DUR);
const lerp = (a, b, u) => a + (b - a) * u;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
addKF(`@keyframes steam{0%{opacity:0;transform:translateY(0) scale(.6)}30%{opacity:.85}100%{opacity:0;transform:translateY(-70px) scale(1.3)}}
@keyframes tremble{from{transform:translate(-4px,0) rotate(-7deg)}to{transform:translate(4px,0) rotate(7deg)}}
@keyframes bellyk{0%{transform:scale(1)}100%{transform:scale(1.18,1.12)}}
@keyframes patk{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes sparkle{0%{opacity:0;transform:scale(.2) rotate(0)}30%{opacity:1;transform:scale(1.2) rotate(40deg)}100%{opacity:0;transform:scale(.6) rotate(90deg)}}
@keyframes heart{0%{opacity:0;transform:translateY(0) scale(.3)}25%{opacity:1;transform:translateY(-20px) scale(1.15)}100%{opacity:0;transform:translateY(-90px) scale(1)}}
@keyframes giggle{from{transform:translateY(0)}to{transform:translateY(-6px)}}
@keyframes slurp{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(10px) rotate(6deg)}}`);

// ───────── décor : la cuisine de Lino ─────────
const FLOOR = 560;
const carrot = (x, y, r = 0, k = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${k})"><path d="M-8 0 L8 0 L0 46Z" fill="#ff8a1e" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M-4 14 h6 M-2 26 h5" stroke="#c8650f" stroke-width="2.5"/><path d="M0 0 q-10 -16 -4 -22 M0 0 q2 -18 8 -22 M0 0 q10 -12 14 -12" stroke="#3fae55" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
const bg = `<rect width="${W}" height="${H}" fill="#fff4dc"/>
  ${Array.from({ length: 16 }, (_, i) => Array.from({ length: 3 }, (_, j) => `<rect x="${i * 80}" y="${FLOOR - 150 + j * 50}" width="80" height="50" fill="${(i + j) % 2 ? '#ffe3b0' : '#fff1d0'}" stroke="#f0cf95" stroke-width="2"/>`).join('')).join('')}
  <rect y="${FLOOR - 156}" width="${W}" height="8" fill="#e8a25a"/>
  <rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="#b98258"/>
  ${Array.from({ length: 9 }, (_, i) => `<line x1="${i * 160}" y1="${FLOOR}" x2="${i * 160 - 60}" y2="${H}" stroke="#a06e47" stroke-width="3"/>`).join('')}
  <g><rect x="930" y="70" width="260" height="210" rx="10" fill="#fff" stroke="${INK}" stroke-width="6"/>
    <defs><linearGradient id="dusk12" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6c5fc8"/><stop offset="1" stop-color="#ff9f8f"/></linearGradient></defs>
    <rect x="942" y="82" width="236" height="186" fill="url(#dusk12)"/><circle cx="1130" cy="128" r="22" fill="#fff6c8"/><circle cx="1140" cy="122" r="20" fill="url(#dusk12)"/>
    ${[[980, 120], [1030, 100], [1080, 150], [1000, 190]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff6c8"/>`).join('')}
    <path d="M942 230 Q1000 205 1060 225 T1178 215 V268 H942Z" fill="#4a7a52"/>
    <rect x="1055" y="70" width="10" height="210" fill="#fff" stroke="${INK}" stroke-width="3"/>
    <path d="M920 64 Q1060 110 1200 64 L1200 50 L920 50Z" fill="#ff8fb1" stroke="${INK}" stroke-width="4"/></g>
  ${wallClock(18, 30, 640, 110)}
  <g><rect x="60" y="150" width="300" height="12" rx="4" fill="#a46a34" stroke="${INK}" stroke-width="4"/>
    ${carrot(100, 110, -20)}${carrot(130, 112, 10)}${carrot(160, 108, -5)}
    <g transform="translate(240 120)"><rect x="-26" y="-30" width="52" height="58" rx="10" fill="#bfe6ff" stroke="${INK}" stroke-width="4"/><rect x="-26" y="-36" width="52" height="12" rx="5" fill="#e8434e" stroke="${INK}" stroke-width="3"/></g>
    <g transform="translate(320 128)"><circle r="20" fill="#ffd23f" stroke="${INK}" stroke-width="4"/></g></g>
  <g transform="translate(150 ${FLOOR})"><rect x="-100" y="-150" width="200" height="150" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="-100" y="-160" width="200" height="16" fill="#9aa3ad" stroke="${INK}" stroke-width="4"/>
    <circle cx="-50" cy="-152" r="0"/><rect x="-80" y="-120" width="160" height="90" rx="8" fill="#e9edf2" stroke="${INK}" stroke-width="4"/>
    <g transform="translate(0 -170)"><path d="M-50 0 L50 0 L42 -56 L-42 -56Z" fill="#e8434e" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><rect x="-56" y="-62" width="112" height="12" rx="5" fill="#c9303c" stroke="${INK}" stroke-width="4"/>
      ${[0, 1, 2].map((i) => `<g transform="translate(${-26 + i * 26} -66)"><g style="${an({ n: 'steam', d: 1.5, t: i * 0.5, c: 99 })}"><path d="M0 0 q9 -12 0 -24 q-9 -12 0 -24" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/></g></g>`).join('')}</g></g>`;

// ───────── la table, les bols ─────────
const TABLE_Y = 600;
const FOX = [420, 700], RAB = [870, 672];
const table = `<g><rect x="250" y="${TABLE_Y}" width="780" height="22" rx="8" fill="#e8a25a" stroke="${INK}" stroke-width="5"/>
  <path d="M250 ${TABLE_Y + 22} H1030 V${H + 10} H250Z" fill="#ff8fb1" stroke="${INK}" stroke-width="5"/>
  ${Array.from({ length: 9 }, (_, i) => `<circle cx="${290 + i * 88}" cy="${TABLE_Y + 48}" r="8" fill="#fff" opacity=".8"/>`).join('')}
  <rect x="290" y="${TABLE_Y + 70}" width="22" height="60" fill="#c98a4e" stroke="${INK}" stroke-width="4"/><rect x="968" y="${TABLE_Y + 70}" width="22" height="60" fill="#c98a4e" stroke="${INK}" stroke-width="4"/></g>`;
const FB = [520, TABLE_Y - 4]; // bol de Roussin
const RB = [760, TABLE_Y - 4]; // bol de Lino
const bowl = (x, y, full) => `<g transform="translate(${x} ${y})"><path d="M-46 -26 Q-44 6 0 8 Q44 6 46 -26Z" fill="#7cc8ff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><ellipse cy="-26" rx="46" ry="11" fill="#fff" stroke="${INK}" stroke-width="4"/>${full ? `<ellipse cy="-25" rx="38" ry="7" fill="#ff9f43"/><circle cx="-12" cy="-26" r="3" fill="#ffd38a"/><circle cx="10" cy="-24" r="2.5" fill="#ffd38a"/>` : '<ellipse cy="-25" rx="38" ry="7" fill="#e9edf2"/>'}</g>`;
const POT = [650, TABLE_Y - 4];
const potT = `<g transform="translate(${POT[0]} ${POT[1]})"><path d="M-48 0 L48 0 L44 -58 L-44 -58Z" fill="#ff9f43" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><rect x="-54" y="-64" width="108" height="12" rx="5" fill="#e07a24" stroke="${INK}" stroke-width="4"/><path d="M-54 -40 h-14 M54 -40 h14" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
  ${[0, 1].map((i) => `<g transform="translate(${-14 + i * 28} -70)"><g style="${an({ n: 'steam', d: 1.4, t: i * 0.6, c: 99 })}"><path d="M0 0 q8 -10 0 -20 q-8 -10 0 -20" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></g></g>`).join('')}</g>`;
const fbowl = vis(0, 7.8, bowl(...FB, false)) + vis(7.8, 20.6, bowl(...FB, true)) + vis(20.6, 21.9, bowl(...FB, false)) + vis(21.9, 23.3, `<g transform="rotate(12 640 450)">${bowl(640, 450, false)}</g>`) + vis(23.3, 23.6, `<g transform="rotate(12 640 450)">${bowl(640, 450, true)}</g>`) + Array.from({ length: 12 }, (_, i) => { const u = ss(i / 11), bx = lerp(640, FB[0], u), by = lerp(450, FB[1], u); return vis(23.6 + i / 30, 23.6 + (i + 1) / 30, `<path d="M${FOX[0] + 40} ${FOX[1] - 118} Q${(FOX[0] + 40 + bx) / 2} ${Math.max(FOX[1] - 118, by) + 40} ${bx - 22} ${by + 12}" stroke="${INK}" stroke-width="26" stroke-linecap="round" fill="none"/><path d="M${FOX[0] + 40} ${FOX[1] - 118} Q${(FOX[0] + 40 + bx) / 2} ${Math.max(FOX[1] - 118, by) + 40} ${bx - 22} ${by + 12}" stroke="#f28a1e" stroke-width="18" stroke-linecap="round" fill="none"/><g transform="rotate(${(12 * (1 - u)).toFixed(1)} ${bx} ${by})">${bowl(bx, by, true)}</g>`); }).join('') + vis(24.0, 24.45, bowl(...FB, true)) ;
const fbowlEnd = vis(24.45, 99, bowl(585, FB[1], false));
const rbowl = bowl(...RB, true);
// louche de Lino (sert à 7,0 puis ressert à 22,7)
const SHOULDER = [RAB[0] - 30, RAB[1] - 100];
const ladleAt = (u, tgt = [FB[0] - 5, FB[1] - 60]) => { const k = ss(Math.min(1, u * 1.4)); return { x: lerp(POT[0] + 10, tgt[0], k), y: lerp(POT[1] - 70, tgt[1], k) - 40 * Math.sin(Math.PI * k), r: u > 0.7 ? lerp(0, 50, (u - 0.7) / 0.3) : 0 }; };
const ladleImg = `<g transform="rotate(-20)"><path d="M0 0 L46 -60" stroke="#9aa3ad" stroke-width="7" stroke-linecap="round"/><path d="M-16 -4 Q0 16 16 -4Z" fill="#9aa3ad" stroke="${INK}" stroke-width="3"/><ellipse cy="-3" rx="14" ry="4" fill="#ff9f43"/></g>`;
const ladle = (t0, tgt) => Array.from({ length: 16 }, (_, i) => { const u = i / 15, p = ladleAt(u, tgt), hx = p.x + 26, hy = p.y - 40;
  const ex = (SHOULDER[0] + hx) / 2, ey = Math.min(SHOULDER[1], hy) - 30;
  return vis(t0 + i / 15, t0 + (i + 1) / 15 + (i === 15 ? 0.2 : 0), `<path d="M${SHOULDER[0]} ${SHOULDER[1]} Q${ex.toFixed(0)} ${ey.toFixed(0)} ${hx.toFixed(0)} ${hy.toFixed(0)}" stroke="${INK}" stroke-width="24" stroke-linecap="round" fill="none"/><path d="M${SHOULDER[0]} ${SHOULDER[1]} Q${ex.toFixed(0)} ${ey.toFixed(0)} ${hx.toFixed(0)} ${hy.toFixed(0)}" stroke="#f1eff7" stroke-width="16" stroke-linecap="round" fill="none"/><g transform="translate(${p.x.toFixed(0)} ${p.y.toFixed(0)}) rotate(${p.r.toFixed(0)})">${ladleImg}</g><circle cx="${hx.toFixed(0)}" cy="${hy.toFixed(0)}" r="13" fill="#f1eff7" stroke="${INK}" stroke-width="3.5"/>`); }).join('');
// cuillère de Roussin : approche tremblante (15,6–17,0), GLOUP (17,0), puis lapées rapides (18,6–20,6)
const FOXM = [548, 540];
const spoon = `<g><ellipse cx="-44" cy="-5" rx="13" ry="10" fill="#f28a1e" stroke="${INK}" stroke-width="3"/><path d="M0 0 L-42 -6" stroke="#9aa3ad" stroke-width="6" stroke-linecap="round"/><ellipse cx="4" cy="-2" rx="13" ry="7" fill="#9aa3ad" stroke="${INK}" stroke-width="3"/><ellipse cx="4" cy="-3" rx="9" ry="3.5" fill="#ff9f43"/></g>`;
const spoonA = vis(15.6, 17.25, track(`<g style="${an({ n: 'tremble', d: 0.07, t: 15.6, c: 18, dir: 'alternate' })}">${spoon}</g>`, 15.6, 17.0, (t, u) => ({ x: lerp(461, 528, ss(u)), y: lerp(590, 541, ss(u)), s: 1.1 })));
const spoonB = vis(18.6, 20.6, track(spoon, 18.6, 20.6, (t) => { const k = (Math.sin((t - 18.6) * Math.PI * 4) + 1) / 2; return { x: lerp(470, 528, k), y: lerp(562, 541, k), s: 1.1 }; }));

// ───────── personnages ─────────
const foxEl = put(FOX[0], FOX[1], 1.15, `<g style="transform-origin:0 -90px;${an({ n: 'slurp', d: 0.25, t: 18.6, c: 8 })}">${fox({
  run: null, upright: -14,
  talk: [[4.9, 6.2], [9.9, 12.2], [17.3, 18.0], [21.9, 22.6], [25.0, 26.6]], gest: [[21.9, 22.8], [25.0, 27.0]],
  eyes: [[3.6, 4.8, 'closed'], [7.0, 8.4, 'wide'], [9.6, 10.0, 'down'], [10.0, 10.6, 'closed'], [10.6, 12.4, 'down'], [12.6, 15.4, 'side'], [15.6, 16.7, 'down'], [16.7, 17.2, 'closed'], [17.2, 18.4, 'wide'], [18.6, 20.6, 'arc'], [21.6, 23.0, 'wide'], [23.0, 30, 'arc']],
  moods: [[3.6, 6.4, 'happy'], [9.6, 12.4, 'sad'], [12.6, 15.4, 'shy'], [15.6, 17.0, 'sad'], [17.1, 18.4, 'oh'], [18.6, 30, 'happy']],
  blush: [[17.4, 18.4], [25.0, 27.4]], jolt: [4.6],
})}</g>`);
// gros ventre content (24,5–30)
const belly = vis(24.4, 99, `<g transform="translate(${FOX[0] + 30} ${FOX[1] - 140})"><g style="transform-origin:0 0;${an({ n: 'bellyk', d: 0.5, t: 24.4, f: 'forwards', e: 'cubic-bezier(.3,1.6,.5,1)' })}"><ellipse rx="48" ry="40" fill="#fff4e6" stroke="${INK}" stroke-width="4"/><path d="M-14 -6 q14 -10 28 0" stroke="#f2c9a0" stroke-width="4" fill="none" stroke-linecap="round"/></g></g>
  <g transform="translate(${FOX[0] + 72} ${FOX[1] - 132})"><g style="${an({ n: 'patk', d: 0.3, t: 25.0, c: 7 })}"><ellipse rx="18" ry="14" fill="#f28a1e" stroke="${INK}" stroke-width="3.5"/></g></g>`);
const rabEl = put(RAB[0], RAB[1], 1.12, `<g style="${an({ n: 'giggle', d: 0.16, t: 22.6, c: 10, dir: 'alternate' })}">${rabbit({
  run: null, noBag: true, talk: [[0.6, 1.6], [7.0, 8.4], [12.8, 14.6], [26.7, 27.4]], gest: [[0.6, 1.6], [12.8, 14.6]],
  eyes: [[9.6, 12.4, 'side'], [17.1, 18.4, 'wide'], [22.0, 30, 'arc']],
  moods: [[0.6, 1.7, 'happy'], [7.0, 8.5, 'happy'], [9.6, 12.4, 'oh'], [12.8, 15.4, 'happy'], [17.1, 30, 'happy']],
  jolt: [17.15],
})}</g>`, true);
const hearts = [[FOX[0] + 200, FOX[1] - 260, 25.3], [FOX[0] + 260, FOX[1] - 230, 25.7], [FOX[0] + 160, FOX[1] - 210, 26.1]].map(([x, y, t]) => vis(t, t + 1.3, `<g transform="translate(${x} ${y})"><g style="${an({ n: 'heart', d: 1.3, t, f: 'both' })}"><path d="M0 12 C-26 -6 -16 -26 0 -14 C16 -26 26 -6 0 12Z" fill="#ff5c7a" stroke="${INK}" stroke-width="3"/></g></g>`)).join('');
const sparks = [[-60, -60], [70, -70], [0, -110]].map(([dx, dy], i) => vis(17.3, 18.4, `<g transform="translate(${FOXM[0] - 40 + dx} ${FOXM[1] - 60 + dy}) scale(1.7)"><g style="${an({ n: 'sparkle', d: 0.8, t: 17.6 + i * 0.12, f: 'both' })}"><path d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4Z" fill="#FFD84A" stroke="${INK}" stroke-width="2.5"/></g></g>`)).join('');
const chairs = `<g><rect x="${FOX[0] - 70}" y="440" width="22" height="170" rx="8" fill="#c98a4e" stroke="${INK}" stroke-width="4"/><rect x="${RAB[0] + 50}" y="440" width="22" height="170" rx="8" fill="#c98a4e" stroke="${INK}" stroke-width="4"/></g>`;

const holdBowl = vis(21.9, 23.6, `<path d="M${FOX[0] + 40} ${FOX[1] - 118} Q560 560 618 462" stroke="${INK}" stroke-width="26" stroke-linecap="round" fill="none"/><path d="M${FOX[0] + 40} ${FOX[1] - 118} Q560 560 618 462" stroke="#f28a1e" stroke-width="18" stroke-linecap="round" fill="none"/><circle cx="618" cy="462" r="14" fill="#f28a1e" stroke="${INK}" stroke-width="3.5"/>`);
const tummy = vis(24.45, 99, `<g transform="translate(455 576) scale(.85)"><g style="transform-origin:0 20px;${an({ n: 'bellyk', d: 0.5, t: 24.5, f: 'forwards', e: 'cubic-bezier(.3,1.6,.5,1)' })}"><path d="M-62 14 Q-60 -46 0 -48 Q60 -46 62 14Z" fill="#f28a1e" stroke="${INK}" stroke-width="4"/><ellipse cx="0" cy="-8" rx="40" ry="26" fill="#fff4e6"/></g></g>
  <g transform="translate(470 566)"><g style="${an({ n: 'patk', d: 0.25, t: 25.0, c: 10 })}"><ellipse rx="17" ry="13" fill="#f28a1e" stroke="${INK}" stroke-width="3.5"/></g></g>`);
const world = `${bg}
  ${foxEl}${rabEl}
  ${table}${potT}${fbowl}${rbowl}${tummy}${fbowlEnd}${holdBowl}
  ${ladle(7.0)}${ladle(22.4, [630, 400])}${spoonA}${spoonB}
  ${sparks}${hearts}`;

const fx =
  say('rab', 'À table !', 0.6, 1.1, { bx: 900, by: 250, tips: [[900, 360]], shout: true }) +
  sfx('GROOOUUU...', 560, 520, 4.6, 1.2, -6, '#b57bff', 56, 'tummy') +
  say('fox', "J'ai trop faim !", 4.9, 1.4, { bx: 900, by: 230, tips: [[960, 330]] }) +
  say('rab', 'Soupe de carottes !', 7.0, 1.4, { bx: 720, by: 140, tips: [[864, 190]] }) +
  say('fox', "Des carottes ?... Je n'aime pas ça...", 9.9, 2.4, { bx: 640, by: 120, tips: [[560, 250]] }) +
  say('rab', 'Goûte juste une cuillère !', 12.6, 2.1, { bx: 450, by: 85, tips: [[608, 150]] }) +
  sfx('GLOUP', 980, 260, 16.95, 0.35, 8, '#ff9f43', 60, 'click') +
  say('fox', 'Mmm !', 17.3, 1.2, { bx: 1030, by: 300, fs: 44, tips: [[920, 420]], shout: true }) +
  sfx('SLURP SLURP !', 640, 140, 18.7, 1.8, -6, '#ff9f43', 70, 'slide') +
  sfx('Ahh !', 620, 215, 20.7, 0.9, -6, '#ff9f43', 52, 'yawn') +
  say('fox', 'Encore !', 21.8, 1.6, { bx: 400, by: 180, tips: [[440, 255]], shout: true }) +
  say('fox', 'Mon ventre est content !', 25.0, 1.8, { bx: 550, by: 110, tips: [[480, 250]] }) +
  say('rab', 'Hi hi !', 26.5, 1.0, { bx: 1155, by: 410, tips: [[1045, 455]] }) +
  card(27.6, 'Le souper !', 'les devoirs', 640, 140);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#fff4dc"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'clink', t: 7.7 }, { name: 'clink', t: 23.3 }, { name: 'chime', t: 17.3 }, { name: 'clink', t: 20.6 }, { name: 'chime', t: 25.2 });
writeFileSync(new URL('./le-souper.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 104, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
