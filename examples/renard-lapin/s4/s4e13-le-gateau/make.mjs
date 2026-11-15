// Roussin & Lino · Saison 4 · Épisode 13 « Le gâteau » — 30 s, 1280x720. 18h30, le chalet, la bûche de la fête.
//
// Découpage :
//  0.0– 3.6  plan large   18 h 30 (pastille), la bûche sur la table, Mamie Marmotte dort au coin ; Lino : « Dix-huit heures trente ! »
//  3.6– 7.6  Roussin      « Quelle belle bûche ! » (il lorgne)
//  7.6–11.4  la bûche     Lino : « Ne touche pas ! » (anticipation) ; Roussin : « Juste pour vérifier... »
// 11.4–15.4  la moustache il goûte le glaçage : « Hmm ! Délicieux ! » — moustache blanche ; Lino : « Hihi ! Ta moustache ! »
// 15.4–19.8  thermomètre  Lino mesure : -4 °C puis +20 °C : « Elle fond ! »
// 19.8–23.0  la fenêtre   Lino ouvre ; Roussin : « Atchoum ! » le bonnet s'envole
// 23.0–27.0  plan large   « Mon bonnet ! » ; Mamie Marmotte se réveille
// 27.0–30.0  carton « Saison 4 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { marmot } from '../../lib/cast4.mjs';
import { chaletInside, chaletWindow, buche, thermometer, foxBeanie, beanie, snowPoof } from '../../lib/snow.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.6, 640, 400, 1.12, 1.16],
  [3.6, 7.6, 700, 440, 1.6, 1.66],
  [7.6, 11.4, 760, 440, 1.35, 1.4],
  [11.4, 15.4, 740, 430, 1.4, 1.45],
  [15.4, 19.8, 920, 430, 1.8, 1.82],
  [19.8, 23.0, 640, 390, 1.12, 1.12],
  [23.0, 27.0, 640, 390, 1.12, 1.1],
  [27.0, 30, 640, 390, 1.1, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes e13pane{from{transform:scaleX(1)}to{transform:scaleX(.18)}}
@keyframes e13drip{from{transform:translateY(0) scaleY(.4)}to{transform:translateY(26px) scaleY(1)}}`);

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

// ───────── décor : chalet de nuit, table, bûche, thermomètre ─────────
const WX = 250, WY = 250;
const table = `<g><rect x="580" y="548" width="280" height="84" fill="#fff4dc" stroke="${INK}" stroke-width="5"/>
  ${[0, 1, 2, 3, 4].map((i) => `<path d="M${580 + i * 56} 632 q28 -26 56 0" fill="#e8434e" stroke="${INK}" stroke-width="4"/>`).join('')}
  <rect x="560" y="520" width="320" height="30" rx="10" fill="#e8434e" stroke="${INK}" stroke-width="5"/>
  <rect x="600" y="632" width="18" height="40" rx="5" fill="#8a5a33" stroke="${INK}" stroke-width="4"/><rect x="822" y="632" width="18" height="40" rx="5" fill="#8a5a33" stroke="${INK}" stroke-width="4"/></g>`;
const drip = vis(18.0, 99, `<g transform="translate(680 424)"><g style="transform-origin:0px 0px;${an({ n: 'e13drip', d: 2.4, t: 18.0, f: 'both', e: 'ease-out' })}"><path d="M-6 0 Q-6 18 0 22 Q6 18 6 0Z" fill="#fff" stroke="${INK}" stroke-width="3"/></g></g>`);
const winOpen = `<g transform="translate(${WX} ${WY})">${vis(20.6, 99, `<rect x="-100" y="-100" width="200" height="200" fill="#cfe0f0"/>
  <g style="transform-origin:-100px 0px;${an({ n: 'e13pane', d: 0.7, t: 20.6, f: 'both', e: 'ease-out' })}"><rect x="-100" y="-100" width="100" height="200" fill="#dff3ff" fill-opacity=".6" stroke="${INK}" stroke-width="6"/></g>
  <rect x="-110" y="-110" width="220" height="220" rx="8" fill="none" stroke="${INK}" stroke-width="18"/><rect x="-110" y="-110" width="220" height="220" rx="8" fill="none" stroke="#c98a4e" stroke-width="10"/>`)}</g>`;
const clipW = `<clipPath id="wclip"><rect x="${WX - 100}" y="${WY - 100}" width="200" height="200"/></clipPath>`;

// ───────── personnages ─────────
const FY = 600;
const moustache = () => `<g transform="translate(104 -112) scale(1.3)"><path d="M-6 0 Q-22 -16 -42 -4 Q-30 12 -4 10Z M-2 0 Q14 -16 34 -4 Q22 12 -2 10Z" fill="#fff" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/></g>`;
const foxEl = put(410, FY, 0.9, fox({ run: null, upright: -6, noShadow: true,
  hat: [[0, 22.1, foxBeanie(0)], [12.4, 99, moustache()]],
  talk: [[3.9, 5.4], [9.9, 11.5], [11.9, 13.2], [22.0, 23.0], [23.9, 25.0]],
  eyes: [[0.4, 3.5, 'arc'], [3.7, 7.5, 'wide'], [8.0, 11.6, 'side'], [11.8, 13.4, 'arc'], [13.6, 15.4, 'arc'], [22.0, 23.2, 'sq'], [23.4, 26.5, 'wide']],
  moods: [[3.7, 7.5, 'oh'], [8.0, 11.6, 'shy'], [11.8, 15.4, 'happy'], [22.0, 23.2, 'oh'], [23.4, 26.5, 'sad'], [26.5, 30, 'happy']],
  blush: [[13.6, 15.4]], jolt: [22.0] }));
const rabEl = put(1010, FY, 0.9, rabbit({ run: null, noShadow: true,
  talk: [[0.6, 2.4], [7.9, 9.7], [13.5, 15.1], [15.8, 17.4], [18.0, 20.0], [20.1, 21.7]],
  point: [[16.8, 18.0]],
  eyes: [[0.5, 2.6, 'arc'], [7.8, 9.8, 'wide'], [13.4, 15.2, 'arc'], [15.8, 17.5, 'arc'], [18.0, 20.0, 'wide'], [23.2, 27, 'arc']],
  moods: [[0.5, 2.6, 'happy'], [7.8, 9.8, 'panic'], [13.4, 15.2, 'happy'], [15.8, 17.5, 'happy'], [18.0, 20.0, 'oh'], [20.1, 21.7, 'happy'], [23.2, 30, 'happy']] }), true);
const marEl = put(185, FY, 0.9, marmot([[25.4, 27.0]], { noShadow: true, sleep: [[0, 25.2]],
  eyes: [[25.2, 27.5, 'wide']], moods: [[25.2, 25.5, 'yawn'], [25.5, 27.5, 'calm']] }));

// ───────── bonnet qui s'envole ─────────
const hatW = `<g transform="scale(.9)">${beanie(0, 0, 1, { col: '#e8434e' })}</g>`;
const flyA = mover(hatW, [[22.2, 430, 440, 0, 1], [22.6, 370, 330, -40, 1], [23.0, 300, 270, -150, 0.95], [23.15, 262, 258, -200, 0.9]]);
const flyB = vis(23.1, 24.9, `<g clip-path="url(#wclip)">${track(`<g transform="scale(.9)">${beanie(0, 0, 1, { col: '#e8434e' })}</g>`, 23.1, 24.8, (t, u) => ({ x: 262 - 30 * u, y: 258 - 120 * u, r: -200 - 300 * u, s: 0.9 - 0.5 * u }))}</g>`);
const gust = [0, 1, 2].map((i) => vis(20.7 + i * 0.1, 22.4, `<g transform="translate(${300 + i * 40} ${300 + i * 50})"><g style="--dx:${60 + i * 20}px;${an({ n: 's4puff', d: 1.3, t: 20.7 + i * 0.1, c: 1, f: 'both' })}"><circle r="${7 + i * 2}" fill="#fff" stroke="#a9c8e8" stroke-width="2"/></g></g>`)).join('');

const world = `${chaletInside({ clock: false, view: 'night', window: false })}${chaletWindow(WX, WY, 1, { view: 'night' })}${clipW}${winOpen}${flyB}
  ${marEl}${table}${buche(700, 520, 0.68)}${drip}${thermometer(822, 524, 0.62, { temp: -4, to: 20, t0: 17.2 })}
  ${foxEl}${rabEl}${flyA}${gust}`;

// ───────── espace écran ─────────
const FH = [475, 385], RH = [988, 335], MH = [223, 398];
const tip = (m, t, dx = 0, dy = 0) => { const p = scr(m[0], m[1], t); return [p[0] + dx, p[1] + dy]; };
// bulle auto : pointe sur la tête (m), bulle 95 px au-dessus, à gauche de la pastille d'heure
const sayH = (who, tx, a, d, m, o = {}) => { const p = scr(m[0], m[1], a + 0.3); return say(who, tx, a, d, { bx: Math.max(p[0] + (o.ox || 0), 420), by: Math.max(p[1] - 100, 58), tips: [[p[0], p[1] - 4]], ...o }); };
const hud = timeBadge(18, 30);
const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.45, t: 27.2, f: 'both' })}"><g transform="translate(640 130)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 4</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">Le gâteau</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : la surprise</text></g></g>`;
const fx = hud +
  sayH('rab', 'Dix-huit heures trente !', 0.6, 1.9, RH) +
  sayH('fox', 'Quelle belle bûche !', 3.9, 1.6, FH) +
  sayH('rab', 'Ne touche pas, Roussin !', 7.9, 1.9, RH) +
  sayH('fox', 'Juste pour vérifier...', 9.9, 1.7, FH) +
  sfx('SLURP', 560, 330, 12.0, 0.8, -6, '#ffd23f', 62) +
  sayH('fox', 'C’est délicieux !', 11.9, 1.5, FH) +
  sayH('rab', 'Roussin, ta moustache blanche !', 13.5, 2.0, RH) +
  sayH('rab', 'Vingt degrés ! Elle fond !', 17.8, 2.1, RH) +
  sayH('rab', 'J’ouvre la fenêtre !', 20.1, 1.7, RH) +
  sayH('fox', 'Je vais éternuer !', 22.0, 1.0, FH, { shout: true, ox: 150 }) +
  sayH('fox', 'Mon bonnet !', 23.9, 1.3, FH) +
  sayH('marmot', 'C’est l’heure du gâteau ?', 25.5, 1.6, MH) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#2a1a10"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'chime', t: 0.3 }, { name: 'tummy', t: 4.4 }, { name: 'sniff', t: 9.9 }, { name: 'clink', t: 12.0 }, { name: 'tummy', t: 12.4 },
  { name: 'clink', t: 17.2 }, { name: 'door', t: 20.6 }, { name: 'poof', t: 22.1 }, { name: 'yawn', t: 25.3 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./gateau.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 100, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
