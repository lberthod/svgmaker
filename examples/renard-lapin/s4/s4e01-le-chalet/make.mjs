// Roussin & Lino · Saison 4 · Épisode 1 « Le chalet » — 30 s, 1280x720. 7h30, l'intérieur du chalet, il neige dehors.
//
// Découpage :
//  0.0– 3.6  plan large    Mamie Marmotte : « Bonjour les enfants ! » (pastille 7 h 30)
//  3.6– 7.2  thermomètre   Lino : « Moins quatre degrés ! » — Roussin : « Il fait froid ! »
//  7.2–11.0  Marmotte      « Le chalet est tout chaud... » et elle s'endort debout
// 11.0–14.0  la porte      Roussin : « J'ouvre la porte ! » — Lino : « Attends ! Ça pousse ! » ; la porte s'ouvre
// 14.0–18.0  l'avalanche   une avalanche douce entre et recouvre Roussin ; Lino : « Roussin ?! »
// 18.0–22.5  Marmotte      se réveille : « Oh ! Un manteau blanc ! » — Lino : « rire ! Bonhomme de neige ! »
// 22.5–27.0  plan large    Roussin secoue la neige : « rire ! Bonjour la montagne ! » (son ventre gargouille)
// 27.0–30.0  plan large    carton « Saison 4 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, sfx, fox, rabbit, put, style, addKF } from '../../lib/kit.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { marmot } from '../../lib/cast4.mjs';
import { chaletInside, FLOOR, thermometer, snowPile, avalanche, snowPoof } from '../../lib/snow.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.6, 640, 420, 1.0, 1.05],
  [3.6, 7.2, 370, 440, 1.8, 1.85],
  [7.2, 11.0, 860, 440, 1.9, 1.95],
  [11.0, 14.0, 570, 450, 1.5, 1.5],
  [14.0, 18.0, 570, 450, 1.5, 1.5],
  [18.0, 22.5, 570, 450, 1.5, 1.5],
  [22.5, 27.0, 640, 420, 1.0, 1.05],
  [27.0, 30, 640, 420, 1.05, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}`);
const show = (inner, wins) => wins.map(([a, b]) => vis(a, b, inner)).join('');

// ───────── décor : l'intérieur du chalet, la porte ─────────
const DX = 640;
const door = `<g transform="translate(${DX} ${FLOOR})">
  <rect x="-70" y="-262" width="140" height="262" rx="10" fill="#6a3f20" stroke="${INK}" stroke-width="6"/>
  <rect x="-58" y="-250" width="116" height="250" fill="#dcebf8"/><path d="M-58 -120 Q-30 -150 0 -124 Q30 -150 58 -118 V0 H-58Z" fill="#fff"/>
  ${tf(`<rect x="-56" y="-250" width="112" height="250" rx="6" fill="#a8683a" stroke="${INK}" stroke-width="5"/><path d="M0 -250 V0 M-56 -125 H56" stroke="#7d4a28" stroke-width="4"/><circle cx="36" cy="-120" r="8" fill="#ffd23f" stroke="${INK}" stroke-width="3"/><circle cx="-28" cy="-190" r="11" fill="#ffe8a8" stroke="${INK}" stroke-width="3"/>`,
    { t0: 13.4, d: 0.6, from: 'scaleX(1)', to: 'scaleX(.12)', e: 'ease-out', o: '-56px 0px' })}</g>`;
const bg = `${chaletInside({ clock: false, view: 'snow', fire: true })}${door}`;

// ───────── pastille d'heure (écran, haut gauche) ─────────
const pastille = timeBadge(7, 30);

// ───────── personnages ─────────
const FY = 600;
const snowCap = `<g><ellipse cx="70" cy="-198" rx="46" ry="18" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="46" cy="-206" r="10" fill="#fff"/><circle cx="98" cy="-206" r="9" fill="#fff"/></g>`;
const FX = 540, RX = 320, MX = 870;
const foxOpt = { run: null, upright: -6, noShadow: true, noBag: true,
  talk: [[5.8, 7.0], [11.2, 12.4], [16.8, 18.4], [22.6, 24.4]],
  eyes: [[5.7, 7.1, 'shut'], [11.1, 12.5, 'wide'], [13.0, 14.6, 'wide'], [16.5, 24.5, 'arc']],
  moods: [[5.7, 7.1, 'sad'], [11.1, 12.5, 'happy'], [13.0, 14.6, 'oh'], [16.5, 24.5, 'happy']],
  shiver: [5.8, 7.0], blush: [[22.6, 24.4]] };
const foxPre = put(FX, FY, 1.0, fox(foxOpt));
const foxPost = put(FX, FY, 1.0, fox({ ...foxOpt, shiver: [16.6, 17.6], hat: [[16.5, 99, snowCap]] }));
const foxEl = show(foxPre, [[0, 7.2], [11, 14.9]]) + vis(16.5, 99, foxPost);
const rabEl = put(RX, FY, 1.0, rabbit({ run: null, noBag: true, noShadow: true,
  talk: [[3.9, 5.6], [12.5, 13.6], [15.2, 16.4], [20.8, 22.2]],
  eyes: [[3.8, 5.7, 'wide'], [12.4, 13.7, 'wide'], [15.1, 16.5, 'wide'], [20.7, 22.3, 'arc']],
  moods: [[3.8, 5.7, 'happy'], [12.4, 13.7, 'oh'], [15.1, 16.5, 'panic'], [20.7, 22.3, 'happy']],
  point: [[3.9, 5.2]] }), true);
const marEl = put(MX, FY, 1.0, marmot([[0.5, 2.1], [7.3, 9.3], [18.8, 20.6]], { noShadow: true, sleep: [[9.7, 18.3]], jolt: 18.3,
  moods: [[0.4, 2.2, 'happy'], [7.2, 9.4, 'calm'], [18.8, 20.6, 'happy']], blush: [[0.5, 2.1]] }), true);

// ───────── effets dans le monde ─────────
const mercury = thermometer(95, 470, 0.95, { temp: -4 });
const snowFx = avalanche(560, FY + 10, 14.0, 1.0) +
  vis(14.7, 16.55, `<g transform="translate(${FX} ${FY + 10}) scale(1.5 2.5)">${snowPile(0, 0, 1, { grow: 14.7 })}</g>`) +
  vis(16.5, 99, snowPile(FX + 30, FY + 24, 1.1)) +
  snowPoof(FX, FY - 60, 16.5, 1.4);
// ce qui passe devant l'avalanche : les flocons par la porte
const world = `${bg}${mercury}${show(rabEl, [[0, 7.2], [11, 99]])}${show(marEl, [[0, 3.6], [7.2, 99]])}${foxEl}${snowFx}`;

// ───────── espace écran ─────────
const hd = (x, t, k = 1, dx = 0, dy = 0) => scr(x + dx, FY - 250 * k + dy, t); // sommet de la tête au temps t
const FOXH = (t) => { const p = hd(FX, t, 1, 90, -4); return [p[0], p[1] - 10]; };
const RABH = (t) => { const p = hd(RX, t, 1, -55, -70); return [p[0], p[1]]; };
const MARH = (t) => { const p = hd(MX, t, 0.95, -48, 0); return [p[0], p[1]]; };
const endCard = `<g style="transform-origin:640px 150px;${an({ n: 'finin', d: 0.45, t: 27.2, f: 'both' })}"><g transform="translate(640 150)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" text-anchor="middle" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 4</text>
  <text y="22" text-anchor="middle" class="bt" style="font-size:34px;fill:#2b5ba8">Le chalet</text>
  <text y="64" text-anchor="middle" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : s'habiller</text></g></g>`;
const T = (who, t, dy = -10) => { const p = who(t); return [p[0], p[1] + dy]; };
const fx =
  say('marmot', 'Bonjour les enfants !', 0.5, 1.7, { bx: 780, by: 200, tips: [T(MARH, 0.6)] }) +
  say('rab', 'Moins quatre degrés !', 3.9, 1.7, { bx: 690, by: 190, tips: [T(RABH, 4.0)] }) +
  say('fox', 'Il fait froid !', 5.8, 1.2, { bx: 1000, by: 200, tips: [T(FOXH, 6.0)] }) +
  say('marmot', 'Le chalet est tout chaud...', 7.3, 2.0, { bx: 640, by: 150, tips: [T(MARH, 7.6)] }) +
  say('fox', 'J’ouvre la porte !', 11.2, 1.3, { bx: 720, by: 200, tips: [T(FOXH, 11.4)] }) +
  say('rab', 'Attends ! Ça pousse !', 12.5, 1.1, { bx: 560, by: 200, tips: [T(RABH, 12.6)] }) +
  sfx('CLAC', 940, 420, 13.4, 0.7, -8, '#ffd23f', 70) +
  sfx('POUF !', 700, 420, 14.8, 1.0, 6, '#ffffff', 90) +
  say('rab', 'Roussin ?!', 15.2, 1.2, { bx: 520, by: 190, tips: [T(RABH, 15.3, 70)], shout: true }) +
  say('fox', 'Il neige... dedans !', 16.8, 1.6, { bx: 700, by: 170, tips: [T(FOXH, 17.0, 10)] }) +
  say('marmot', 'Quel joli manteau blanc !', 18.8, 1.8, { bx: 900, by: 165, tips: [T(MARH, 19.0, -14)] }) +
  say('rab', 'C’est un bonhomme de neige !', 20.8, 1.4, { bx: 520, by: 190, tips: [T(RABH, 21.0)] }) +
  say('fox', 'Bonjour la belle montagne !', 22.6, 1.8, { bx: 760, by: 190, tips: [T(FOXH, 22.8)] }) +
  sfx('GROUU', 440, 340, 24.8, 0.9, -6, '#ffd23f', 54) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#c98a4e"/>
<g style="${camStyle}">${world}</g>
${pastille}
${fx}
</svg>`;
sfxEv.push({ name: 'chime', t: 0.3 }, { name: 'yawn', t: 9.5 }, { name: 'door', t: 13.4 }, { name: 'poof', t: 14.8 }, { name: 'laugh', t: 22.6 }, { name: 'tummy', t: 24.8 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./chalet.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 96, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
