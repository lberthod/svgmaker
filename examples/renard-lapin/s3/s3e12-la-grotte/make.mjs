// Roussin & Lino · Saison 3 · Épisode 12 « La grotte » — 30 s, 1280x720. 16h15, l'intérieur d'une grotte.
//
// Découpage :
//  0.0– 3.4  plan large     la bande entre dans la grotte, Lino ouvre la marche avec sa lanterne ; pastille 16 h 15
//  3.4– 7.2  trois amis     « Il fait si noir ! » — GRRROUUH ! (le ventre de Roussin) — Piquette : « Un monstre ! »
//  7.2–10.0  Roussin        « Oups... c'est mon ventre ! »
// 10.0–17.2  plan large     Bidule surgit et claque des pinces : « Hou hou ! Écho ? » ; l'écho répond « Hihi » : c'est Lino qui rit tout seul
// 17.2–22.0  la lueur       les cristaux s'allument, la bouteille de la plage apparaît : « La bouteille ! »
// 22.0–27.0  le dessin      Lino déroule le message : un dessin de Mme Chouette ; Bidule : « Hihi ! Joli ! »
// 27.0–30.0  plan large     carton « Saison 3 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { crab } from '../../lib/cast3.mjs';
import { caveBg, lantern, bottle } from '../../lib/sea.mjs';
import { timeBadge } from '../../lib/badge.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.4, 600, 400, 1.12, 1.15],
  [3.4, 7.2, 400, 440, 1.6, 1.62],
  [7.2, 10.0, 400, 450, 1.6, 1.62],
  [10.0, 17.2, 600, 400, 1.12, 1.15],
  [17.2, 22.0, 600, 410, 1.12, 1.14],
  [22.0, 27.0, 850, 450, 1.8, 1.82],
  [27.0, 30, 620, 400, 1.15, 1.05],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes fadeout{from{opacity:1}to{opacity:0}}
@keyframes unroll{from{transform:scale(.2,.05)}to{transform:scale(1,1)}}
@keyframes echo{0%{opacity:0;transform:scale(.6)}30%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.3)}}`);

// ───────── décor : grotte sombre (la lueur s'allume à 17,8 s) ─────────
const GY = 616, S = 0.85;
const FX = 190, HX = 390, RX = 610, BX = 760, CX = 910;
const LIT = 17.8;
const lamp = lantern(0, 0, 0.75, { lit: 0 });
const dark = `<defs><radialGradient id="dk" gradientUnits="userSpaceOnUse" cx="${RX + 60}" cy="${GY - 130}" r="520"><stop offset="0.25" stop-color="#05081e" stop-opacity="0"/><stop offset="1" stop-color="#1a1840" stop-opacity=".1"/></radialGradient></defs>
  <g style="${an({ n: 'fadeout', d: 1.0, t: LIT, f: 'both' })}"><rect width="${W}" height="${H}" fill="url(#dk)"/></g>`;
const bg = caveBg({ lit: LIT });

const foxEl = put(FX, GY, S, fox({ run: null, upright: -4, noShadow: true, jolt: [5.2],
  talk: [[3.6, 5.0], [7.5, 9.2], [15.4, 16.8]],
  eyes: [[0, 3.4, 'side'], [3.5, 5.0, 'wide'], [5.0, 7.2, 'wide'], [7.4, 9.6, 'sq'], [13.4, 17.2, 'wide'], [17.8, 22.0, 'wide'], [22.0, 27.0, 'arc']],
  moods: [[3.5, 5.0, 'panic'], [5.0, 7.2, 'oh'], [7.4, 9.6, 'shy'], [13.4, 15.2, 'oh'], [15.2, 17.2, 'happy'], [17.8, 22.0, 'oh'], [22.0, 30, 'happy']], blush: [[7.4, 9.6]] }));
const hedgeEl = put(HX, GY + 4, S, hedgehog([[5.6, 6.8], [13.4, 14.8], [18.1, 19.4]], { noShadow: true,
  eyes: [[0, 3.4, 'side'], [3.5, 7.2, 'wide'], [7.4, 9.6, 'arc'], [13.2, 15.0, 'wide'], [17.8, 22.0, 'wide'], [22.0, 30, 'arc']],
  moods: [[0, 3.4, 'shy'], [3.5, 5.5, 'oh'], [5.5, 7.2, 'panic'], [7.4, 9.6, 'happy'], [13.2, 15.0, 'oh'], [17.8, 22.0, 'oh'], [22.0, 30, 'happy']], jolt: [5.7], point: [[18.0, 19.6]] }));
const rabEl = put(RX, GY, S, rabbit({ run: null, noShadow: true, item: lamp,
  talk: [[0.6, 2.6], [11.8, 12.8], [19.6, 21.0], [22.3, 23.7]], giggle: [[11.8, 14.0]],
  eyes: [[0, 3.4, 'side'], [3.5, 7.2, 'wide'], [7.4, 9.6, 'arc'], [11.7, 14.2, 'arc'], [17.8, 22.0, 'wide'], [22.0, 30, 'arc']],
  moods: [[0.5, 2.6, 'happy'], [7.4, 9.6, 'happy'], [11.7, 14.2, 'happy'], [17.8, 22.0, 'oh'], [22.0, 30, 'happy']] }));
const crabEl = vis(9.8, 99, `<g transform="translate(${CX} ${GY + 6}) scale(.78)">${crab([[10.1, 11.4], [24.0, 25.4]], {
  noShadow: true, pinch: [[10.2, 11.6]], eyes: [[9.8, 30, 'wide']], moods: [[9.8, 30, 'happy']], jolt: [9.9] })}</g>`);
const poofB = vis(9.8, 10.8, `<g transform="translate(${CX} ${GY - 20})"><g style="${an({ n: 'puff', d: 0.9, t: 9.8, f: 'both' })}"><circle r="46" fill="#cfc7e8" stroke="${INK}" stroke-width="3"/></g></g>`);

// ───────── la bouteille et son dessin ─────────
const glow = vis(LIT, 99, `<g transform="translate(${BX} ${GY - 70})"><g style="transform-origin:0px 0px;animation:sglo2 1.4s ease-in-out infinite alternate"><circle r="120" fill="#fff3a6" fill-opacity=".3"/><circle r="70" fill="#fff3a6" fill-opacity=".35"/></g></g>`);
const bottleEl = vis(LIT, 99, `<g style="transform-origin:${BX}px ${GY}px;${an({ n: 'finin', d: 0.5, t: LIT, f: 'both' })}">${bottle(BX, GY, 1.1, {})}</g>`);
const paper = vis(22.0, 99, `<g transform="translate(${BX} ${GY - 255}) scale(.6)"><g style="transform-origin:0px 40px;${an({ n: 'unroll', d: 0.6, t: 22.0, f: 'both', e: 'ease-out' })}">
  <rect x="-130" y="-100" width="260" height="200" rx="10" fill="#fff4d6" stroke="${INK}" stroke-width="6" transform="rotate(-3)"/>
  <g transform="rotate(-3)"><ellipse cy="14" rx="52" ry="58" fill="#c79a68" stroke="${INK}" stroke-width="5"/><ellipse cy="30" rx="32" ry="34" fill="#f3d9b0"/>
  <circle cx="-22" cy="-18" r="22" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="22" cy="-18" r="22" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-20" cy="-16" r="9" fill="${INK}"/><circle cx="24" cy="-16" r="9" fill="${INK}"/>
  <path d="M-8 -2 L0 12 L8 -2Z" fill="#ffb300" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-34 -50 L-24 -34 M34 -50 L24 -34" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
  <path d="M-100 80 q20 -14 40 0 M70 80 q20 -14 40 0" stroke="#2b5ba8" stroke-width="4" fill="none" stroke-linecap="round"/></g></g></g>`);
const sparks = vis(LIT, LIT + 1.6, [[-50, -150], [50, -170], [0, -210]].map(([dx, dy], i) => `<g transform="translate(${BX + dx} ${GY + dy})"><g style="${an({ n: 'sparkle', d: 0.9, t: LIT + i * 0.2, c: 2, f: 'both' })}"><path d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4Z" fill="#fff3a6" stroke="${INK}" stroke-width="2.5"/></g></g>`).join(''));

const world = `${bg}${glow}${foxEl}${hedgeEl}${rabEl}${poofB}${crabEl}${bottleEl}${sparks}${paper}${dark}`;

// ───────── espace écran ─────────
const tip = (m, t, dx = 0, dy = 0) => { const p = scr(m[0], m[1], t); return [p[0] + dx, p[1] + dy]; };
const FM = [FX + 30, GY - 250 * S], HM = [HX + 10, GY - 150 * S], RM = [RX + 30, GY - 250 * S], CM = [CX, GY - 150 * 0.78];
const hud = timeBadge(16, 15);
const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.45, t: 27.2, f: 'both' })}"><g transform="translate(640 150)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:44px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 3</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">La grotte</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : en bateau</text></g></g>`;
const echoP = scr(RX + 60, GY - 300, 12.6);
const fx = hud +
  say('rab', 'Doucement, les amis, on entre.', 0.6, 2.2, { bx: 640, by: 170, tips: [tip(RM, 0.6, 0, -6)] }) +
  say('fox', 'Il fait si noir !', 3.6, 1.6, { bx: 330, by: 170, tips: [tip(FM, 3.6, 0, -6)] }) +
  sfx('GRRROUUH !', 560, 300, 5.0, 1.5, -5, '#ffffff', 84, 'tummy') +
  say('hedge', 'Un monstre !', 5.7, 1.4, { bx: 560, by: 120, tips: [tip(HM, 5.7, 0, -4)], shout: true }) +
  say('fox', 'Pardon... c’est mon ventre !', 7.5, 2.0, { bx: 420, by: 140, tips: [tip(FM, 7.5, 0, -6)] }) +
  say('crab', 'Écoutez mon écho !', 10.1, 1.5, { bx: 900, by: 190, tips: [tip(CM, 10.1, 0, -6)] }) +
  say('rab', 'C’est trop drôle !', 11.8, 1.0, { bx: 690, by: 150, tips: [tip(RM, 11.8, 0, -6)] }) +
  `<g transform="translate(${echoP[0] + 120} ${echoP[1] - 40})"><g style="${an({ n: 'echo', d: 1.6, t: 12.9, f: 'both' })}"><text class="sfx" style="font-size:44px;fill:#cfc7e8;stroke:${INK};stroke-width:7;paint-order:stroke">trop drôle... drôle...</text></g></g>` +
  say('hedge', 'L’écho rit !', 13.6, 1.3, { bx: 440, by: 130, tips: [tip(HM, 13.6, 0, -4)] }) +
  say('fox', 'Non ! C’est Lino !', 15.2, 1.4, { bx: 330, by: 160, tips: [tip(FM, 15.2, 0, -6)] }) +
  say('hedge', 'Regardez, une lueur !', 18.1, 1.4, { bx: 520, by: 130, tips: [tip(HM, 18.1, 0, -4)] }) +
  say('rab', 'La bouteille !', 19.6, 1.4, { bx: 760, by: 130, tips: [tip(RM, 19.6, 0, -6)], shout: true }) +
  say('rab', 'Un dessin dedans !', 22.2, 1.6, { bx: 640, by: 110, tips: [tip(RM, 22.2, 0, -6)] }) +
  say('crab', 'C’est très joli !', 24.0, 1.4, { bx: 930, by: 150, tips: [tip(CM, 24.0, 0, -6)] }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#5b5496"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'step', t: 0.4 }, { name: 'step', t: 1.4 }, { name: 'tummy', t: 5.0 }, { name: 'poof', t: 9.8 }, { name: 'knock', t: 10.3 }, { name: 'knock', t: 10.9 },
  { name: 'laugh', t: 11.8 }, { name: 'chime', t: 17.8 }, { name: 'chime', t: 22.0 }, { name: 'laugh', t: 24.0 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./grotte.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 80, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
