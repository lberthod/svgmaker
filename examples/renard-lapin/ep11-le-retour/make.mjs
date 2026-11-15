// Roussin & Lino · Épisode 11 « Le retour » — 30 s, 1280x720. 17h00, le chemin de l'école au coucher du soleil.
//
// Découpage :
//  0.0– 3.5  plan large      ils rentrent ensemble ; Lino : « Quelle journée ! »
//  3.5– 6.5  plan à deux     Lino : « Ce soir, tu dors chez moi ! » — Roussin : « Ouiii ! »
//  6.5– 9.5  la flaque       elle est toujours là ! Lino : « Attention, la flaque ! » — Roussin : « Cette fois, je saute ! »
//  9.5–12.5  le saut         Roussin court, saute par-dessus… et atterrit fièrement : « TA-DAAA ! »
// 12.5–15.0  Lino           « Moi aussi ! » — il saute… trop court : SPLASH !
// 15.0–18.0  Lino           assis dans la flaque, trempé ; Roussin accourt : « Oh non ! Lino ! »
// 18.0–21.0  la flaque       Lino éclate de rire : « C'est rigolo ! » — Roussin saute dedans aussi : SPLASH !
// 21.0–24.0  la flaque       ils rient et s'éclaboussent
// 24.0–27.6  plan moyen      Mme Escargot passe en rentrant chez elle : « Bonsoir... » — « Bonsoir, Madame Escargot ! »
// 27.6–30.0  plan large      carton
import { writeFileSync } from 'node:fs';
import { timeBadge } from '../lib/badge.mjs';
import { W, H, INK, lines, sfxEv, an, ao, vis, sfx, fox, rabbit, put, style, addKF, track, ss, cloud } from '../lib/kit.mjs';
import { makeCam, say, card, snail, bird } from '../lib/props.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.5, 640, 360, 1.0, 1.03],
  [3.5, 6.5, 470, 480, 1.4, 1.42],
  [6.5, 9.5, 660, 450, 1.25, 1.3],
  [9.5, 12.5, 640, 380, 1.0, 1.02],
  [12.5, 15.0, 740, 460, 1.2, 1.22],
  [15.0, 18.0, 880, 500, 1.6, 1.65],
  [18.0, 21.0, 860, 470, 1.3, 1.35],
  [21.0, 24.0, 860, 460, 1.25, 1.3],
  [24.0, 27.6, 860, 440, 1.1, 1.12],
  [27.6, 30, 640, 360, 1.0, 1.03],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
const lerp = (a, b, u) => a + (b - a) * u;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const seg = (t, keys) => { if (t <= keys[0][0]) return keys[0][1]; for (let i = 0; i < keys.length - 1; i++) { const [a, va] = keys[i], [b, vb] = keys[i + 1]; if (t <= b) return lerp(va, vb, (t - a) / (b - a)); } return keys[keys.length - 1][1]; };
addKF(`@keyframes splashdrop{0%,70%{opacity:1;transform:translate(0,0) scale(.6)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1)}}
@keyframes ripple{0%{opacity:.9;transform:scale(.3)}100%{opacity:0;transform:scale(1.4)}}
@keyframes drip{0%{opacity:0;transform:translateY(0)}20%{opacity:1}100%{opacity:0;transform:translateY(40px)}}
@keyframes laughb{from{transform:translateY(0) rotate(-2deg)}to{transform:translateY(-10px) rotate(2deg)}}
@keyframes glow{from{opacity:.35}to{opacity:.6}}`);

// ───────── décor : le chemin au coucher du soleil ─────────
const GROUND = 560;
const P = [880, 655]; // la flaque
const treeS = (x, s = 1) => `<g transform="translate(${x} ${GROUND}) scale(${s})"><rect x="-14" y="-110" width="28" height="112" rx="8" fill="#7a4a2e" stroke="${INK}" stroke-width="4"/><circle cy="-150" r="72" fill="#3d8f4a" stroke="${INK}" stroke-width="4"/><circle cx="-52" cy="-108" r="46" fill="#4aa457" stroke="${INK}" stroke-width="4"/><circle cx="52" cy="-112" r="48" fill="#35843f" stroke="${INK}" stroke-width="4"/></g>`;
const house = (x, c, roof) => `<g transform="translate(${x} ${GROUND - 10})"><rect x="-60" y="-110" width="120" height="110" fill="${c}" stroke="${INK}" stroke-width="4"/><path d="M-74 -106 L0 -170 L74 -106Z" fill="${roof}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><rect x="-36" y="-80" width="30" height="30" fill="#ffe27a" stroke="${INK}" stroke-width="3"/><rect x="10" y="-60" width="30" height="60" fill="#8a5a33" stroke="${INK}" stroke-width="3"/></g>`;
const bg = `<defs><linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a6fd6"/><stop offset=".45" stop-color="#ff9f8f"/><stop offset=".8" stop-color="#ffd38a"/></linearGradient>
  <radialGradient id="sunglow"><stop offset="0" stop-color="#fff2b0"/><stop offset="1" stop-color="#fff2b0" stop-opacity="0"/></radialGradient></defs>
  <rect width="${W}" height="${GROUND}" fill="url(#dusk)"/>
  <circle cx="1010" cy="400" r="230" fill="url(#sunglow)" style="animation:glow 2s ease-in-out infinite alternate"/>
  <circle cx="1010" cy="420" r="95" fill="#ff8a3d" stroke="#e8672a" stroke-width="6"/>
  <g style="animation:cdrift 14s ease-in-out infinite alternate;opacity:.85">${cloud(300, 120, 0.8)}${cloud(760, 90, 0.6)}${cloud(1150, 170, 0.5)}</g>
  <path d="M0 470 Q200 400 420 460 T860 450 T1280 430 V${GROUND} H0Z" fill="#9b7fc9" stroke="${INK}" stroke-width="4"/>
  <path d="M0 510 Q260 470 560 505 T1280 490 V${GROUND} H0Z" fill="#7fb36a" stroke="${INK}" stroke-width="4"/>
  ${house(130, '#ffcf9e', '#e8434e')}${house(1180, '#bfe6ff', '#3b82f6')}
  ${treeS(330, 0.9)}${treeS(1010, 0.75)}
  <g transform="translate(40 0)">${Array.from({ length: 9 }, (_, i) => `<rect x="${400 + i * 46}" y="${GROUND - 56}" width="14" height="60" rx="4" fill="#f4e1c1" stroke="${INK}" stroke-width="3"/>`).join('')}<rect x="392" y="${GROUND - 44}" width="400" height="10" fill="#f4e1c1" stroke="${INK}" stroke-width="3"/></g>
  <rect y="${GROUND}" width="${W}" height="${H - GROUND}" fill="#8fc46a"/>
  <path d="M0 600 Q640 570 1280 600 V720 H0Z" fill="#f0d29a" stroke="${INK}" stroke-width="4"/>
  ${[120, 380, 610, 1100, 1230].map((x, i) => `<ellipse cx="${x}" cy="${640 + (i % 2) * 40}" rx="14" ry="6" fill="#d9b67a"/>`).join('')}`;
const waterClip = `<defs><clipPath id="water"><path clip-rule="evenodd" d="M-500 -500 H2400 V2000 H-500Z M${P[0] - 222} ${P[1] + 20} H${P[0] + 222} V1500 H${P[0] - 222}Z"/></clipPath></defs>`;
const puddleBack = `<g transform="translate(${P[0]} ${P[1]})"><ellipse rx="232" ry="38" fill="#5ba7e8" stroke="${INK}" stroke-width="5"/><ellipse cx="-56" cy="-8" rx="100" ry="11" fill="#ffc9a3" opacity=".8"/></g>`;
const puddleFront = `<g transform="translate(${P[0]} ${P[1]})"><path d="M-232 0 A232 38 0 0 0 232 0 L208 2 A208 26 0 0 1 -208 2Z" fill="#5ba7e8"/><path d="M-232 0 A232 38 0 0 0 232 0" fill="none" stroke="${INK}" stroke-width="5"/></g>`;

// éclaboussure
const splash = (t, x, y, n = 14, big = 1) => vis(t, t + 1.0, Array.from({ length: n }, (_, i) => { const a = Math.PI * (0.08 + 0.84 * (i / (n - 1))); const r = (130 + (i % 3) * 45) * big; return `<g transform="translate(${x} ${y})"><g style="--dx:${(Math.cos(a) * r).toFixed(0)}px;--dy:${(-Math.sin(a) * r * 1.1).toFixed(0)}px;${an({ n: 'splashdrop', d: 0.8 + (i % 3) * 0.1, t, f: 'both', e: 'cubic-bezier(.2,.7,.4,1)' })}"><path d="M0 -12 q-9 12 0 16 q9 -4 0 -16z" fill="#5DADE2" stroke="${INK}" stroke-width="1.4" transform="scale(2.4)"/></g></g>`; }).join('') +
  `<g transform="translate(${x} ${y})"><g style="${an({ n: 'ripple', d: 0.9, t, f: 'both' })}"><ellipse rx="120" ry="24" fill="none" stroke="#fff" stroke-width="6"/></g></g>`);
const drips = (x, y, t0, t1) => vis(t0, t1, [0, 1, 2].map((i) => `<g transform="translate(${x + (i - 1) * 46} ${y + (i % 2) * 20})"><g style="${an({ n: 'drip', d: 0.9, t: t0 + i * 0.3, c: Math.round((t1 - t0) / 0.9) })}"><path d="M0 -8 q-6 8 0 11 q6 -3 0 -11z" fill="#8fd3ff" stroke="${INK}" stroke-width="2"/></g></g>`).join(''));

// ───────── personnages ─────────
// Roussin : marche, s'arrête, saute la flaque, revient, saute dedans
const foxPos = (t) => {
  if (t < 9.6) return { x: seg(t, [[0, 320], [3.4, 660]]), y: 690 };
  if (t < 10.0) return { x: lerp(660, 670, (t - 9.6) / 0.4), y: 690 + 14 * Math.sin(Math.PI * (t - 9.6) / 0.4) };
  if (t < 10.9) { const u = (t - 10.0) / 0.9; return { x: lerp(670, 1150, u), y: 690 - 200 * Math.sin(Math.PI * u), r: lerp(-10, 10, u) }; }
  if (t < 15.2) return { x: 1150, y: 690 };
  if (t < 20.0) return { x: 1150, y: 690 + (t > 19.75 ? 16 * Math.sin(Math.PI * (t - 19.75) / 0.25) : 0) };
  if (t < 20.6) { const u = (t - 20.0) / 0.6; return { x: lerp(1170, 1000, u), y: lerp(690, 725, u) - 160 * Math.sin(Math.PI * u) }; }
  return { x: 1000, y: 725 };
};
const FF = (t) => ((t >= 3.6 && t < 6.5) || (t >= 11.1 && t < 26.9) ? -1 : 1);
const foxEl = track(fox({
  runExtra: [[0.05, 3.4], [9.6, 10.0]], noShadow: true, upright: -10,
  talk: [[5.4, 6.3], [8.2, 9.4], [11.2, 12.2], [15.6, 16.8], [26.7, 27.6]], raise: [[11.1, 12.4]],
  eyes: [[6.6, 8.0, 'side'], [10.0, 10.9, 'wide'], [11.0, 12.5, 'arc'], [13.9, 15.1, 'wide'], [15.2, 17.8, 'wide'], [18.4, 19.9, 'side'], [20.5, 24.0, 'arc'], [24.2, 25.8, 'side'], [26.0, 26.9, 'arc'], [26.9, 30, 'side']],
  moods: [[3.6, 5.3, 'happy'], [8.2, 12.5, 'happy'], [13.9, 18.0, 'oh'], [18.4, 30, 'happy']],
  blush: [[11.1, 12.4]], jolt: [13.95, 15.8], jumps: [[5.4, 5.8, 60], [5.9, 6.3, 60]],
}), 0, 30, (t) => { const p = foxPos(t); return { x: p.x, y: p.y, r: p.r || 0, sx: 1.1 * FF(t), sy: 1.1 }; }, 30);
const foxLaugh = foxEl; // le rire est porté par les yeux et la bouche

const rabPos = (t) => {
  if (t < 13.3) return { x: seg(t, [[0, 30], [3.4, 360]]), y: 690 + (t > 13.0 ? 14 * Math.sin(Math.PI * (t - 13.0) / 0.3) : 0) };
  if (t < 13.95) { const u = (t - 13.3) / 0.65; return { x: lerp(360, 760, u), y: lerp(690, 735, u) - 210 * Math.sin(Math.PI * u), r: lerp(-8, 6, u) }; }
  return { x: 750, y: 735 };
};
const rabEl = track(`<g style="${an({ n: 'laughb', d: 0.18, t: 18.3, c: 32, dir: 'alternate' })}">${rabbit({
  runExtra: [[0.05, 3.4]], noShadow: true, noBag: false,
  talk: [[1.0, 2.2], [3.7, 5.2], [6.9, 8.0], [12.6, 13.3], [18.4, 19.8], [26.7, 27.6]], gest: [[1.0, 2.2], [3.7, 5.2], [12.6, 13.3]],
  eyes: [[5.4, 6.3, 'arc'], [6.8, 8.0, 'wide'], [11.0, 12.5, 'wide'], [13.6, 13.95, 'wide'], [13.95, 15.0, 'spiral'], [15.0, 17.6, 'down'], [17.6, 18.3, 'closed'], [18.3, 24.0, 'arc'], [24.2, 25.8, 'side'], [26.0, 30, 'arc']],
  moods: [[1.0, 2.3, 'happy'], [5.4, 6.4, 'happy'], [6.8, 8.1, 'oh'], [11.0, 13.4, 'happy'], [13.6, 15.0, 'oh'], [15.0, 17.6, 'sad'], [18.3, 30, 'happy']],
  blush: [[18.4, 21.0]], jolt: [13.95],
})}</g>`, 0, 30, (t) => { const p = rabPos(t); return { x: p.x, y: p.y, r: p.r || 0, sx: 1.05, sy: 1.05 }; }, 30);

// Mme Escargot rentre chez elle (premier plan, très lentement)
const snailEl = vis(23.9, 99, track(put(0, 0, 0.95, snail([[25.4, 26.6]], { toque: false })), 23.9, 30, (t) => ({ x: lerp(1360, 1145, clamp((t - 24.0) / 3.0, 0, 1)), y: 712, s: 1 }), 15));
// Rouge-Gorge rentre au nid (clin d'œil)
const birdEl = vis(1.0, 3.4, track(bird(true, false), 1.0, 3.4, (t, u) => ({ x: lerp(-60, 1340, u), y: 200 - 40 * Math.sin(u * 6), sx: -1.3, sy: 1.3 })));

const world = `${bg}${birdEl}
  ${puddleBack}
  ${vis(13.9, 99, '')}
  ${splash(13.95, P[0] - 160, P[1] - 10, 16, 1.4)}${splash(13.97, P[0] - 40, P[1] - 10, 10, 0.9)}${splash(20.58, P[0] + 160, P[1] - 10, 14, 1.1)}
  ${[21.2, 22.0, 22.8, 23.5].map((t, i) => splash(t, P[0] + (i % 2 ? 110 : -120), P[1] - 10, 10, 1.0)).join('')}
  ${waterClip}${vis(0, 20.3, foxLaugh)}<g clip-path="url(#water)">${vis(20.3, 99, foxLaugh)}${vis(13.85, 99, rabEl)}</g>${vis(0, 13.85, rabEl)}
  ${vis(13.9, 99, puddleFront)}
  ${drips(750, 510, 15.0, 18.0)}
  ${snailEl}`;

const fx =
  say('rab', 'Quelle journée !', 1.0, 1.3, { bx: 380, by: 330, tips: [[140, 430]] }) +
  say('rab', 'Ce soir, tu dors chez moi !', 3.7, 1.6, { bx: 560, by: 150, tips: [[640, 290]] }) +
  say('fox', 'Oui, d’accord !', 5.4, 0.9, { bx: 1030, by: 75, tips: [[1010, 150]], shout: true }) +
  say('rab', 'Attention, la flaque !', 6.9, 1.2, { bx: 380, by: 170, tips: [[420, 300]], shout: true }) +
  say('fox', 'Cette fois, je saute !', 8.2, 1.3, { bx: 760, by: 170, tips: [[640, 300]] }) +
  sfx('BOING !', 760, 160, 10.0, 0.6, -8, '#ffd23f', 70, 'boing') +
  say('fox', 'J’ai réussi !', 11.2, 1.1, { bx: 1020, by: 230, tips: [[1080, 330]], shout: true }) +
  say('rab', 'Moi aussi !', 12.6, 0.8, { bx: 300, by: 200, tips: [[190, 380]], shout: true }) +
  sfx('SPLASH !', 700, 170, 13.95, 1.0, -8, '#4fb3ff', 96, 'splash') +
  say('fox', 'Lino, ça va ?', 15.6, 1.3, { bx: 900, by: 120, tips: [[1000, 260]], shout: true }) +
  say('rab', "C'est rigolo !", 18.4, 1.4, { bx: 460, by: 140, tips: [[560, 330]] }) +
  sfx('SPLASH !', 900, 140, 20.6, 0.9, 8, '#4fb3ff', 90, 'splash') +
  sfx('Ha ha ha !', 640, 290, 21.4, 2.2, -4, '#e8434e', 62, 'laugh') +
  say('snail', 'Bonsoir...', 25.4, 1.3, (() => { const sx = lerp(1360, 1145, (25.8 - 24.0) / 3.0), m = scr(sx - 82, 712 - 68, 25.8); return { bx: Math.min(1130, m[0] - 10), by: m[1] - 140, tips: [[m[0], m[1] - 30]] }; })()) +
  say('fox', 'Bonsoir, Madame Escargot !', 26.7, 1.0, (() => { const m = scr(1000 + 100 * 1.1, 725 - 140 * 1.1, 27.0); return { bx: m[0] - 120, by: m[1] - 190, tips: [[m[0], m[1] - 40]] }; })()) +
  card(27.6, 'Le retour !', 'le souper', 640, 140);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#ffd38a"/>
<g style="${camStyle}">${world}</g>
${timeBadge(17, 0)}
${fx}
</svg>`;
sfxEv.push({ name: 'chirp', t: 1.6 }, { name: 'whoosh', t: 10.0 }, { name: 'step', t: 10.9 }, { name: 'splash', t: 21.2 }, { name: 'splash', t: 22.8 }, { name: 'laugh', t: 18.5 });
writeFileSync(new URL('./le-retour.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 100, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
