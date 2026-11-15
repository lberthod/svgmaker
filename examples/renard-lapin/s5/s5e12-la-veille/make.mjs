// Roussin & Lino · Saison 5 · Épisode 12 « La veille » — 30 s, 1280x720. 20h00, la scène de la salle des fêtes, la nuit avant le grand soir.
//
// Découpage :
//  0.0– 3.4  plan large     trois dormeurs sur les matelas de Papi Bernard ; Taupin, seul, révise : « Je répète tout bas. »
//  3.4– 7.4  Taupin         « La petite étoile a peur. »
//  7.4–10.8  Taupin         « Mes lunettes ! Où sont-elles ? » (il les a sur le nez)
// 10.8–14.0  la corde       il avance à tâtons : « Les voici ! Une corde... »
// 14.0–17.0  plan large     « Je tire doucement. » — la corde tire, le projecteur se décroche, tombe : clink, lumière !
// 17.0–19.4  Taupin         « La lumière s’allume ! »
// 19.4–23.0  les dormeurs   éclairés mais profondément endormis : Roussin et Lino parlent en dormant
// 23.0–26.5  plan large     « Pardon... bonne nuit. »
// 26.5–30.0  carton « Saison 5 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { solid, endCard5 } from '../_hfix.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { mole } from '../../lib/cast5.mjs';
import { stage, backdrop, lamp, garland } from '../../lib/theatre.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.4, 700, 440, 1.1, 1.15],
  [3.4, 7.4, 740, 450, 1.28, 1.3],
  [7.4, 10.8, 740, 450, 1.3, 1.3],
  [10.8, 14.0, 740, 450, 1.3, 1.3],
  [14.0, 17.0, 640, 400, 1.0, 1.0],
  [17.0, 19.4, 740, 450, 1.3, 1.3],
  [19.4, 23.0, 640, 440, 1.5, 1.55],
  [23.0, 26.5, 640, 430, 1.0, 1.05],
  [26.5, 30, 640, 430, 1.05, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes zzz{0%{opacity:0;transform:translate(0,0) scale(.6)}15%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translate(40px,-70px) scale(1.2)}}
@keyframes breathe2{from{transform:scaleY(1)}to{transform:scaleY(1.04)}}
@keyframes lightin{from{opacity:0}to{opacity:1}}`);
const lerp = (a, b, u) => a + (b - a) * u;
const mover = (inner, pts) => {
  const t0 = pts[0][0], t1 = pts[pts.length - 1][0];
  const fn = (t) => {
    let i = 0; while (i < pts.length - 2 && t > pts[i + 1][0]) i++;
    const [a, xa, ya, ra = 0, sa = 1] = pts[i], [b, xb, yb, rb = 0, sb = 1] = pts[i + 1];
    const u = ss(Math.min(1, Math.max(0, (t - a) / (b - a))));
    return { x: lerp(xa, xb, u), y: lerp(ya, yb, u), r: lerp(ra, rb, u), s: lerp(sa, sb, u) };
  };
  return vis(t0, t1, track(inner, t0, t1, fn, 30));
};

// ───────── décor : la scène la nuit, matelas, corde, projecteur ─────────
const FY = 600;
const LAMPX = 960, LAMPY = 70;
const bg = `${stage({ backdrop: backdrop('night'), frame: false })}${garland(0, 30, W, 30, 12)}`;
const blanket = (x, w, c) => `<g style="transform-origin:${x}px ${FY}px;animation:breathe2 1.8s ease-in-out infinite alternate"><path d="M${x - w / 2} ${FY - 118} Q${x} ${FY - 146} ${x + w / 2} ${FY - 118} V${FY + 8} H${x - w / 2}Z" fill="${c}" stroke="${INK}" stroke-width="5"/>${[0, 1, 2].map((i) => `<circle cx="${x - w / 2 + 40 + i * (w - 80) / 2}" cy="${FY - 60}" r="12" fill="#fff" opacity=".6"/>`).join('')}</g>`;
const mattress = (x, w) => `<rect x="${x - w / 2 - 10}" y="${FY - 20}" width="${w + 20}" height="52" rx="14" fill="#e6e9f7" stroke="${INK}" stroke-width="5"/>`;
const zzz = (x, y, t0, fs = 40, ds = [0, 1.6, 3.2, 4.8, 6.4, 8, 9.6, 11.2, 12.8, 14.4, 16, 17.6, 19.2, 20.8, 22.4, 24]) => ds.map((d) => vis(t0 + d, t0 + d + 1.5, `<g transform="translate(${x} ${y})"><g style="${an({ n: 'zzz', d: 1.5, t: t0 + d, f: 'both' })}"><text class="sfx" style="font-size:${fs}px;fill:#9fb3ff;stroke:#1d2550;stroke-width:3;paint-order:stroke">Z z z</text></g></g>`)).join('');

// ───────── personnages ─────────
const sleepEyes = [[0, 99, 'closed']];
// Lino à moitié réveillé : il répond à Taupin en marmonnant
const rabEyes = [[0, 6.3, 'closed'], [6.3, 8.0, 'down'], [8.0, 10.4, 'closed'], [10.4, 12.0, 'down'], [12.0, 21.2, 'closed'], [21.2, 22.8, 'down'], [22.8, 99, 'closed']];
const SX = [470, 640, 810];
const foxEl = put(SX[0], FY, 1.0, fox({ run: null, upright: -6, noShadow: true, noBag: true, talk: [[19.7, 21.0]], eyes: sleepEyes, moods: [[0, 30, 'happy']] }));
const rabEl = put(SX[1], FY, 1.0, rabbit({ run: null, noBag: true, noShadow: true, upright: 0, talk: [[6.5, 7.8], [10.6, 11.8], [21.3, 22.6]], eyes: rabEyes, moods: [[0, 30, 'happy']] }));
const hedgeEl = put(SX[2], FY, 1.0, hedgehog([], { noShadow: true, eyes: sleepEyes, moods: [[0, 30, 'happy']] }));
const sleepers = `${[0, 1, 2].map((i) => mattress(SX[i], 150)).join('')}${foxEl}${rabEl}${hedgeEl}${blanket(SX[0], 150, '#7cc8ff')}${blanket(SX[1], 150, '#ff8fb1')}${blanket(SX[2], 150, '#9be08a')}`;

// Taupin : lit, cherche ses lunettes (sur le nez), va à la corde et tire
const MS = 1.0;
const moleEl = mover(`<g transform="scale(${MS})">${mole([[0.7, 2.2], [4.0, 6.0], [8.0, 10.0], [12.1, 13.9], [14.2, 15.6], [17.3, 18.8], [23.5, 25.0]], { noShadow: true,
  gest: [[8.2, 9.2], [14.4, 15.6]],
  eyes: [[0, 3.4, 'down'], [3.4, 7.4, 'sq'], [7.4, 10.8, 'side'], [10.8, 14.0, 'sq'], [17.0, 19.4, 'wide'], [23, 30, 'arc']],
  moods: [[0, 3.4, 'calm'], [3.4, 7.4, 'shy'], [7.4, 10.8, 'oh'], [17.0, 19.4, 'panic'], [19.4, 23, 'shy'], [23, 30, 'happy']] })}</g>`, [
  [0, 1100, FY, 0, 1], [10.8, 1100, FY, 0, 1], [11.6, 1110, FY - 8, 0, 1], [12.4, 1125, FY, 0, 1], [13.2, 1135, FY - 8, 0, 1], [14.0, 1140, FY, 0, 1], [99, 1140, FY, 0, 1]]);

// corde : poulie au plafond (1200,24), pend jusqu'à y=470 ; tirée vers le bas à 14.4
const rope = (pull) => `<path d="M${LAMPX} ${LAMPY - 24} L${LAMPX + 40} 22 L1200 22" stroke="#d9b779" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${LAMPX} ${LAMPY - 24} L${LAMPX + 40} 22 L1200 22" stroke="${INK}" stroke-width="2" fill="none" stroke-dasharray="3 9"/>
  <circle cx="1200" cy="22" r="12" fill="#8a5a33" stroke="${INK}" stroke-width="4"/>
  <g style="${pull ? an({ n: 'tfk', d: 0.4, t: 14.5, f: 'both', e: 'ease-in-out' }) : ''};--f:translateY(0px);--t:translateY(70px)"><path d="M1200 22 V470" stroke="#d9b779" stroke-width="8" stroke-linecap="round"/><path d="M1200 22 V470" stroke="${INK}" stroke-width="2" stroke-dasharray="3 9"/><circle cx="1200" cy="478" r="14" fill="#c98a4e" stroke="${INK}" stroke-width="4"/></g>`;
const lampEl = `<g style="transform-origin:${LAMPX}px ${LAMPY}px;${an({ n: 't5swing', d: 0.15, t: 15.4, c: 5, dir: 'alternate' })}">${lamp(LAMPX, LAMPY, 1, 8, { fall: 16.3, drop: 400 })}</g>`;

const dark = vis(0, 16.9, `<rect x="-200" y="-200" width="1700" height="1200" fill="#0a0f2e" opacity=".26"/>`) + vis(16.9, 99, `<rect x="-200" y="-200" width="1700" height="1200" fill="#0a0f2e" opacity=".06"/>`)
  + `<ellipse cx="640" cy="560" rx="520" ry="190" fill="#ffe9a0" opacity=".16"/>`;
const light = vis(16.9, 99, `<g style="animation:lightin .3s ease-out both"><ellipse cx="${LAMPX}" cy="480" rx="520" ry="220" fill="#fff3b0" opacity=".2"/><ellipse cx="${LAMPX}" cy="500" rx="300" ry="120" fill="#fff3b0" opacity=".2"/></g>`);

const world = `${bg}${rope(true)}${sleepers}${moleEl}${dark}${light}${lampEl}${zzz(SX[0] + 70, 330, 1.0, 38)}${zzz(SX[2] + 50, 330, 2.0, 38)}`;

// ───────── écran ─────────
const pill = timeBadge(20, 0);
const endCard = endCard5(27.4, 'La veille', 'Prochain épisode : le grand soir');

const tip = (m, t, dx = 0, dy = 0) => { const p = scr(m[0], m[1], t); return [p[0] + dx, p[1] + dy]; };
const MM = (t) => (t < 10.8 ? [1100, FY - 175] : [1135, FY - 175]);
const FM = [SX[0] + 40, FY - 250], RM = [SX[1] + 30, FY - 290];
const fx = pill +
  say('mole', 'Je répète tout bas.', 0.7, 1.6, { bx: 880, by: 200, tips: [tip(MM(0.7), 0.7, 0, -5)] }) +
  say('mole', 'La petite étoile a peur.', 4.0, 2.0, { bx: 760, by: 110, tips: [tip(MM(4), 4.0, 0, -5)] }) +
  say('rab', 'Taupin, dors un peu...', 6.4, 1.5, { bx: 420, by: 135, tips: [tip(RM, 6.4, 0, -10)] }) +
  say('mole', 'Mes lunettes ! Où sont-elles ?', 8.0, 2.4, { bx: 700, by: 100, tips: [tip(MM(8), 8.0, 0, -5)] }) +
  say('rab', 'Sur ton nez, Taupin...', 10.5, 1.5, { bx: 420, by: 135, tips: [tip(RM, 10.5, 0, -10)] }) +
  say('mole', 'Les voici ! Une corde...', 12.1, 1.8, { bx: 760, by: 110, tips: [tip(MM(12.1), 12.1, 0, -5)] }) +
  say('mole', 'Je tire doucement.', 14.2, 1.5, { bx: 900, by: 220, tips: [tip(MM(14.2), 14.2, 0, -5)] }) +
  sfx('CLINK !', 700, 560, 17.0, 0.8, -6, '#ffd23f', 64, 'clink') +
  say('mole', 'La lumière s’allume !', 17.3, 1.6, { bx: 700, by: 100, tips: [tip(MM(17.3), 17.3, 0, -5)] }) +
  say('fox', 'Mon croissant... à moi...', 19.7, 1.5, { bx: 640, by: 105, tips: [tip(FM, 19.7, 0, -10)] }) +
  say('rab', 'Cinq minutes encore...', 21.3, 1.6, { bx: 640, by: 105, tips: [tip(RM, 21.3, 0, -10)] }) +
  say('mole', 'Pardon... bonne nuit.', 23.5, 1.6, { bx: 880, by: 200, tips: [tip(MM(23.5), 23.5, 0, -5)] }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#241a3a"/>
<g style="${camStyle}">${world}</g>
${solid(fx)}
</svg>`;
sfxEv.push({ name: 'yawn', t: 0.5 }, { name: 'step', t: 11.0 }, { name: 'click', t: 14.5 }, { name: 'click', t: 16.9 }, { name: 'yawn', t: 20.0 }, { name: 'chime', t: 27.4 });
writeFileSync(new URL('./la-veille.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 80, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
