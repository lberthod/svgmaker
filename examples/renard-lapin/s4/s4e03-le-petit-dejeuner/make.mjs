// Roussin & Lino · Saison 4 · Épisode 3 « Le petit-déjeuner » — 30 s, 1280x720. 8h45, la table du chalet.
//
// Découpage :
//  0.0– 3.6  plan large    pastille 8 h 45 ; Mamie Marmotte pose les chocolats chauds : « Chocolat chaud pour tous ! »
//  3.6– 8.2  Roussin       « Mmm ! Ça sent bon ! » — la vapeur monte, soulève son bonnet
//  8.2–12.0  le bonnet     le bonnet flotte au-dessus de sa tête : « Mon bonnet s'envole ! » — Lino : « Hihi ! Il flotte ! » ; il retombe
// 12.0–15.2  Lino          « Moi, je souffle fort ! » : un énorme nuage de lait l'engloutit, puis éclate
// 15.2–19.4  Lino/Roussin  moustache de chocolat : « Hihi ! Un nuage de lait ! » — « Lino a une moustache ! »
// 19.4–22.6  Marmotte      « Mangez bien... mes petits... » et elle s'endort
// 22.6–27.0  plan large    le ventre de Roussin gargouille : « J'ai trop faim ! » — « Hihi ! Moi aussi ! »
// 27.0–30.0  plan large    carton « Saison 4 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, sfx, fox, rabbit, put, style, addKF } from '../../lib/kit.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { marmot } from '../../lib/cast4.mjs';
import { chaletInside, mug, foxBeanie, snowPoof } from '../../lib/snow.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.6, 640, 470, 1.0, 1.05],
  [3.6, 8.2, 420, 440, 1.6, 1.65],
  [8.2, 12.0, 560, 440, 1.35, 1.35],
  [12.0, 15.2, 800, 450, 1.5, 1.5],
  [15.2, 19.4, 600, 450, 1.4, 1.4],
  [19.4, 22.6, 1050, 450, 1.8, 1.8],
  [22.6, 27.0, 640, 470, 1.0, 1.05],
  [27.0, 30, 640, 470, 1.05, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes bobhat{from{transform:translateY(-5px) rotate(-3deg)}to{transform:translateY(5px) rotate(3deg)}}`);
const show = (inner, wins) => wins.map(([a, b]) => vis(a, b, inner)).join('');

const bg = chaletInside({ clock: false, view: 'snow', fire: true });
const pastille = timeBadge(8, 45);

// ───────── la table ─────────
const TOP = 590;
const checker = Array.from({ length: 24 }, (_, i) => Array.from({ length: 4 }, (_, j) => ((i + j) % 2 ? `<rect x="${150 + i * 40}" y="${TOP + 20 + j * 36}" width="40" height="36" fill="#f6b8bf"/>` : '')).join('')).join('');
const table = `<g><rect x="150" y="${TOP + 20}" width="960" height="150" fill="#fff" stroke="${INK}" stroke-width="6"/>${checker}
  <rect x="150" y="${TOP + 20}" width="960" height="150" fill="none" stroke="${INK}" stroke-width="6"/>
  <rect x="130" y="${TOP}" width="1000" height="28" rx="10" fill="#8a5a33" stroke="${INK}" stroke-width="6"/></g>`;
const tartine = (x, y) => `<g transform="translate(${x} ${y})"><ellipse cy="0" rx="62" ry="10" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="-40" y="-26" width="80" height="24" rx="8" fill="#e9b565" stroke="${INK}" stroke-width="4"/><rect x="-32" y="-24" width="64" height="9" rx="4" fill="#e8434e"/></g>`;
const FY = 690;
const FYC = 655;
const FXp = 420, RXp = 800, MXp = 1100;
const mugs = `${mug(FXp + 150, TOP + 4, 0.65, { steam: true, marsh: true })}${mug(RXp + 190, TOP + 4, 0.65, { steam: true })}${mug(MXp - 205, TOP + 4, 0.65, { steam: true })}${tartine(FXp + 20, TOP + 2)}${tartine(RXp - 70, TOP + 2)}`;
const bigSteam = vis(6.0, 11.4, [0, 1, 2].map((i) => `<g transform="translate(${FXp + 150 + (i - 1) * 24} ${TOP - 60}) scale(1 2.2)"><g style="${an({ n: 's4steam', d: 1.4, t: 6.0 + i * 0.4, c: 6 })}"><path d="M0 0 q-9 -12 0 -22 q9 -10 0 -20" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".9"/></g></g>`).join(''));

// ───────── personnages ─────────
const hatFloat = (d, t) => [t, t + 0.4, foxBeanie(d)];
const foxHat = [[0, 6.2, foxBeanie(0)], [6.2, 6.6, foxBeanie(-0.5)], [6.6, 7.0, foxBeanie(-1.2)], [7.0, 7.4, foxBeanie(-2)], [7.4, 7.8, foxBeanie(-2.8)], [7.8, 10.8, foxBeanie(-3.2)],
  [10.8, 11.0, foxBeanie(-2)], [11.0, 11.2, foxBeanie(-1)], [11.2, 99, foxBeanie(0)]];
const stache = (c) => `<path d="M62 -128 Q80 -142 96 -130 Q108 -122 96 -116 Q82 -126 70 -120 Q56 -118 62 -128Z" fill="${c}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
const foxEl = put(FXp, FYC, 1.0, fox({ run: null, upright: -6, noShadow: true, noBag: true,
  talk: [[3.9, 5.4], [8.6, 10.4], [17.4, 19.0], [23.0, 24.6]], hat: foxHat,
  eyes: [[3.6, 6.2, 'arc'], [6.2, 8.2, 'wide'], [8.2, 11.2, 'up'], [11.2, 15.2, 'arc'], [15.2, 20, 'arc'], [22.8, 24.8, 'down']],
  moods: [[3.6, 5.6, 'happy'], [6.2, 11.2, 'oh'], [11.2, 20, 'happy'], [22.8, 24.8, 'sad'], [24.8, 27, 'happy']], blush: [[17.4, 19.0]], gest: [[3.9, 5.2]] }));
const rabEl = put(RXp, FYC, 1.0, rabbit({ run: null, noBag: true, noShadow: true,
  talk: [[10.6, 12.0], [12.2, 13.8], [15.4, 17.2]],
  hat: [[15.0, 99, stache('#6b3e1e')]],
  eyes: [[0, 8.2, 'arc'], [8.2, 10.4, 'wide'], [10.6, 12.1, 'arc'], [12.1, 15.0, 'wide'], [15.0, 17.4, 'arc'], [17.4, 27, 'arc']],
  moods: [[0, 12.1, 'happy'], [12.1, 15.0, 'oh'], [15.0, 27, 'happy']], blush: [[15.4, 17.2]] }));
const marEl = put(MXp, FY, 1.0, marmot([[0.5, 2.5], [19.6, 21.8]], { noShadow: true, sleep: [[22.2, 28]], gest: [[0.5, 2.3]],
  moods: [[0.4, 2.6, 'happy'], [19.5, 21.9, 'calm']], blush: [[0.5, 2.3]] }), true);

// nuage de lait autour de Lino (13.0 → 15.0) puis éclatement
const cloudBlob = `${[[-70, 0, 70], [0, -50, 84], [70, 0, 72], [-40, 60, 68], [40, 60, 70]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="5"/>`).join('')}${[[-70, 0, 70], [0, -50, 84], [70, 0, 72], [-40, 60, 68], [40, 60, 70]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r - 3}" fill="#fff"/>`).join('')}<path d="M-50 -62 q20 -26 50 -22" stroke="#d6e6f4" stroke-width="7" fill="none" stroke-linecap="round"/>`;
const CC = [RXp + 50, FYC - 175];
const milk = vis(12.9, 15.05, `<g transform="translate(${CC[0]} ${CC[1]})">${tf(cloudBlob, { t0: 12.9, d: 2.0, from: 'scale(.12)', to: 'scale(1.7)', e: 'ease-in', o: '0px 0px' })}</g>`) + snowPoof(CC[0], CC[1], 15.0, 1.7);
const world = `${bg}${show(rabEl, [[0, 3.6], [8.2, 99]])}${show(marEl, [[0, 3.6], [12.0, 15.2], [19.4, 99]])}${show(foxEl, [[0, 12.0], [15.2, 19.4], [22.6, 99]])}${table}${mugs}${bigSteam}${milk}`;

// ───────── espace écran ─────────
const FOXH = (t, dy = -10) => { const p = scr(FXp + 90, FYC - 255, t); return [p[0], p[1] + dy]; };
const RABH = (t, dy = -6) => { const p = scr(RXp + 70, FYC - 300, t); return [p[0], p[1] + dy]; };
const MARH = (t, dy = -10) => { const p = scr(MXp - 48, FY - 235, t); return [p[0], p[1] + dy]; };
const endCard = `<g style="transform-origin:640px 150px;${an({ n: 'finin', d: 0.45, t: 27.2, f: 'both' })}"><g transform="translate(640 150)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" text-anchor="middle" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 4</text>
  <text y="22" text-anchor="middle" class="bt" style="font-size:34px;fill:#2b5ba8">Le petit-déjeuner</text>
  <text y="64" text-anchor="middle" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : le premier bonhomme</text></g></g>`;
const fx =
  say('marmot', 'Chocolat chaud pour tous !', 0.5, 2.1, { bx: 860, by: 180, tips: [MARH(0.6)] }) +
  say('fox', 'Ça sent très bon !', 3.9, 1.5, { bx: 700, by: 190, tips: [FOXH(4.0)] }) +
  sfx('SNIF', 360, 330, 3.9, 0.9, -8, '#ffd23f', 60) +
  say('fox', 'Mon bonnet s’envole !', 8.6, 1.8, { bx: 640, by: 230, tips: [FOXH(8.7, 40)], shout: true }) +
  say('rab', 'Il flotte dans les airs !', 10.6, 1.4, { bx: 880, by: 180, tips: [RABH(10.7)] }) +
  say('rab', 'Moi, je souffle fort !', 12.2, 1.6, { bx: 760, by: 190, tips: [RABH(12.3)] }) +
  sfx('FOUUU !', 480, 440, 13.2, 1.4, -6, '#ffffff', 64) +
  say('rab', 'C’est un nuage de lait !', 15.4, 1.9, { bx: 900, by: 180, tips: [RABH(15.5)] }) +
  say('fox', 'Lino a une moustache !', 17.4, 1.7, { bx: 560, by: 190, tips: [FOXH(17.5)] }) +
  say('marmot', 'Mangez bien... mes petits...', 19.6, 2.2, { bx: 860, by: 190, tips: [MARH(19.7)] }) +
  say('fox', 'J’ai trop faim !', 23.0, 1.6, { bx: 560, by: 190, tips: [FOXH(23.1)] }) +
  sfx('GROUU', 330, 400, 22.7, 0.9, -6, '#ffd23f', 54) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#c98a4e"/>
<g style="${camStyle}">${world}</g>
${pastille}
${fx}
</svg>`;
sfxEv.push({ name: 'chime', t: 0.3 }, { name: 'clink', t: 2.6 }, { name: 'sniff', t: 3.9 }, { name: 'whoosh', t: 6.6 }, { name: 'boing', t: 11.1 }, { name: 'whoosh', t: 13.2 }, { name: 'poof', t: 15.0 },
  { name: 'laugh', t: 15.4 }, { name: 'yawn', t: 21.9 }, { name: 'tummy', t: 22.7 }, { name: 'clink', t: 25.4 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./le-petit-dejeuner.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 100, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
