// Roussin & Lino · Saison 2 · Épisode 7 « Le pique-nique » — 30 s, 1280x720. 12h00, la prairie de la ferme.
//
// Découpage :
//  0.0– 3.5  plan large     midi pile (panneau-horloge), Lino : « Midi pile ! À table ! », Piquette timide à l'écart
//  3.5– 7.0  Roussin         sort LE croissant de son sac : « Mon dernier croissant ! »
//  7.0–10.0  la nappe        Rouge-Gorge se pose sur la nappe, les yeux sur le croissant ; Piquette : « Un oiseau ! »
// 10.0–14.0  dilemme         Roussin cache le croissant à gauche, à droite... Lino : « Roussin... partage ! »
// 14.0–18.0  gros plan       « Bon... d'accord. » CRAC, deux moitiés : « Un pour toi ! »
// 18.0–22.5  l'oiseau        il picore sa moitié, puis ATTRAPE aussi celle de Roussin et s'envole ; « Eh ! Mon croissant ! »
// 22.5–27.0  plan large     Piquette : « Hihi ! » — Lino : « Il avait faim ! » — Roussin rit
// 27.0–30.0  plan large     carton « Saison 2 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0, bird, croissant } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { farmBg, picnic, apple, GROUND } from '../../lib/farm.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.5, 640, 400, 1.0, 1.06],
  [3.5, 7.0, 600, 470, 1.9, 1.95],
  [7.0, 10.0, 540, 470, 1.45, 1.5],
  [10.0, 14.0, 610, 480, 1.5, 1.5],
  [14.0, 18.0, 660, 520, 2.0, 2.1],
  [18.0, 22.5, 660, 490, 1.55, 1.6],
  [22.5, 27.0, 640, 400, 1.0, 1.08],
  [27.0, 30, 640, 400, 1.08, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes crumb{0%{opacity:1;transform:translate(0,0)}100%{opacity:0;transform:translate(var(--dx),50px)}}`);

// ───────── trajectoires : pts = [[t, x, y, rot, scale]] (lissées) ─────────
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

// ───────── décor : prairie, pommier, panneau-horloge (12h00) ─────────
const tree = `<g transform="translate(150 ${GROUND + 6})"><rect x="-22" y="-190" width="44" height="196" rx="10" fill="#9b6a3c" stroke="${INK}" stroke-width="5"/>
  <circle cy="-250" r="110" fill="#3fae55" stroke="${INK}" stroke-width="5"/><circle cx="-70" cy="-210" r="66" fill="#52c468" stroke="${INK}" stroke-width="5"/><circle cx="70" cy="-220" r="70" fill="#52c468" stroke="${INK}" stroke-width="5"/>
  <circle cx="-30" cy="-300" r="16" fill="#fff" opacity=".25"/>${apple(-60, -230, .5)}${apple(50, -270, .5)}${apple(80, -200, .5)}</g>`;
const sign = `<g transform="translate(1128 ${GROUND + 6})"><rect x="-8" y="-230" width="16" height="236" rx="5" fill="#9b6a3c" stroke="${INK}" stroke-width="5"/>
  <rect x="-100" y="-340" width="200" height="190" rx="18" fill="#e8c590" stroke="${INK}" stroke-width="6"/>
  <g transform="translate(0 -268) scale(.95)">${wallClock(12, 0, 0, 0)}</g></g>`;
const bg = `${farmBg({ sunny: true, withFence: true })}${tree}${sign}`;

// ───────── personnages ─────────
const FY = 612;
const foxEl = put(560, FY, 1.0, fox({ run: null, upright: -6, noShadow: true,
  talk: [[4.0, 5.7], [14.2, 15.4], [16.3, 17.6], [21.2, 22.8], [25.5, 27.0]],
  eyes: [[3.7, 5.7, 'arc'], [7.9, 9.8, 'wide'], [12.2, 14.0, 'sq'], [14.0, 15.6, 'down'], [16.2, 17.8, 'arc'], [19.9, 22.9, 'wide'], [24.8, 27.5, 'arc']],
  moods: [[3.7, 5.7, 'happy'], [7.9, 9.8, 'oh'], [14.0, 15.6, 'sad'], [16.2, 17.8, 'happy'], [19.9, 22.9, 'oh'], [24.6, 30, 'happy']],
  blush: [[24.8, 27.0]] }));
const rabEl = put(885, FY, 1.0, rabbit({ run: null, noShadow: true,
  talk: [[0.6, 2.2], [12.2, 13.6], [23.9, 25.2]],
  eyes: [[0.5, 2.4, 'arc'], [10.2, 11.8, 'side'], [12.0, 13.8, 'arc'], [23.8, 25.4, 'arc']],
  moods: [[0.5, 2.4, 'happy'], [12.0, 13.8, 'happy'], [23.8, 30, 'happy']] }), true);
const hedgeEl = put(305, FY + 6, 1.0, hedgehog([[7.6, 8.7], [22.9, 23.9]], { noShadow: true,
  eyes: [[0, 3.5, 'side'], [7.4, 9.0, 'wide'], [22.8, 24.4, 'arc']],
  moods: [[0, 3.5, 'shy'], [7.4, 9.0, 'oh'], [22.8, 26, 'happy']], blush: [[0.4, 3.0]] }));
const cloth = picnic(640, 628, 1.5);

// ───────── le croissant et Rouge-Gorge ─────────
const C1 = [755, 490]; // croissant tenu devant Roussin
const whole = mover(`<g transform="scale(1)">${croissant}</g>`, [
  [3.6, 520, 500, 0, 0.3], [4.3, C1[0], C1[1], -10, 1.0], [7.8, C1[0], C1[1], -10, 1.0], [8.4, 630, 540, 20, 0.9],
  [10.0, 630, 540, 20, 0.9], [10.5, 780, 520, -14, 1.0], [11.0, 780, 520, -14, 1.0], [11.5, 610, 545, 24, 0.9], [12.0, 610, 545, 24, 0.9],
  [12.5, 780, 505, -12, 1.0], [14.0, 780, 500, -12, 1.0], [15.9, 755, 490, -10, 1.0], [16.0, 755, 490, -10, 1.0]]);
const half = (side, id) => `<clipPath id="${id}"><rect x="${side < 0 ? -60 : 0}" y="-60" width="60" height="100"/></clipPath><g clip-path="url(#${id})" transform="translate(${side * 3} 0)">${croissant}</g>`;
const halfBird = mover(half(1, 'hr'), [[16.0, 758, 490, -10, 1.0], [16.5, 762, 480, -6, 1.1], [17.1, 680, 548, 0, 1.0], [17.5, 620, 548, 6, 0.95],
  [18.2, 620, 548, 6, 0.55], [18.9, 620, 548, 6, 0.2], [19.1, 620, 548, 6, 0.01]]);
const halfFox = mover(half(-1, 'hl'), [[16.0, 752, 490, -10, 1.0], [16.6, 730, 500, -14, 1.05], [18.4, 730, 500, -14, 1.05], [19.2, 712, 468, -20, 1.0], [20.3, 712, 468, -20, 1.0]]);
const halfStolen = mover(`<g transform="scale(-1 1)">${half(-1, 'hl2')}</g>`, [[20.3, 712, 468, 10, 1.0], [20.55, 680, 500, 10, 1.0], [21.7, 1040, 200, -10, 1.0], [22.4, 1540, 40, -10, 1.0]]);

const BX = 660, BY = 560;
const flyIn = mover(`<g transform="scale(1.3)">${bird(true, false)}</g>`, [[7.0, 1440, 80, 0, 1], [7.8, 740, 520, 0, 1], [8.0, 680, 548, 0, 1]]);
const perched = mover(`<g transform="scale(1.3)">${bird(false, false)}</g>`, [
  [8.0, 680, BY, 0, 1], [10.4, 680, BY, 0, 1], [10.6, 680, BY - 14, 0, 1], [10.8, 662, BY, 0, 1], [12.3, 662, BY, 0, 1], [12.5, 650, BY - 12, 0, 1], [12.7, BX, BY, 0, 1],
  [19.8, BX, BY, 0, 1]]);
const peckBird = vis(17.5, 19.0, `<g transform="translate(${BX} ${BY}) scale(1.3)"><g style="transform-origin:-20px 0px;${an({ n: 'peck', d: 0.5, t: 17.5, c: 3 })}"></g></g>`);
const hop = mover(`<g transform="scale(1.3)">${bird(true, false)}</g>`, [[19.8, BX, BY, 0, 1], [20.1, 680, 520, 0, 1], [20.3, 690, 512, 0, 1]]);
const flyAway = mover(`<g transform="scale(-1.3 1.3)">${bird(true, false)}</g>`, [[20.3, 690, 512, 0, 1], [21.7, 1040, 200, 0, 1], [22.4, 1540, 40, 0, 1]]);
const crumbs = [0, 1, 2, 3, 4].map((i) => vis(17.9 + i * 0.12, 19.0, `<g transform="translate(${572 - i * 6} ${560})"><g style="--dx:${(i - 2) * 16}px;${an({ n: 'crumb', d: 0.7, t: 17.9 + i * 0.12, c: 2, f: 'both' })}"><circle r="4" fill="#e9a84a" stroke="${INK}" stroke-width="1.5"/></g></g>`)).join('');
const landPuff = [0, 1, 2].map((i) => vis(8.0, 9.0, `<g transform="translate(${600 + i * 40} 586)"><g style="${an({ n: 'puff', d: 0.7, t: 8.0 + i * 0.05, f: 'both' })}"><circle r="${12 + i * 4}" fill="#f3e1b0" stroke="${INK}" stroke-width="2.5"/></g></g>`)).join('');

const world = `${bg}${rabEl}${foxEl}${hedgeEl}${cloth}${landPuff}${whole}${halfBird}${halfFox}${halfStolen}${flyIn}${perched}${hop}${flyAway}${crumbs}`;

// ───────── espace écran ─────────
const FM = [640, 360], RM = [865, 300], HM = [310, 410];
const tip = (m, t, dx = 0, dy = 0) => { const p = scr(m[0], m[1], t); return [p[0] + dx, p[1] + dy]; };
const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.45, t: 27.2, f: 'both' })}"><g transform="translate(640 130)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 2</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">Le pique-nique</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : la mare</text></g></g>`;
vis; // (vis déjà importé)
const fx =
  say('rab', 'Midi pile ! À table !', 0.6, 1.7, { bx: 865, by: 205, tips: [tip(RM, 0.6, -10, -10)] }) +
  say('fox', 'Mon dernier croissant !', 4.0, 1.8, { bx: 520, by: 140, tips: [tip(FM, 4.0, -10, -50)] }) +
  sfx('SNIF', 380, 300, 4.0, 0.8, -8, '#ffd23f', 58) +
  say('hedge', 'Un oiseau !', 7.6, 1.2, { bx: 305, by: 150, tips: [tip(HM, 7.6, 0, -30)] }) +
  sfx('FRRR', 1040, 220, 7.2, 0.7, 8, '#ffffff', 56) +
  say('rab', 'Roussin... partage !', 12.2, 1.5, { bx: 865, by: 140, tips: [tip(RM, 12.2, -10, -10)] }) +
  say('fox', "Bon... d'accord.", 14.2, 1.3, { bx: 520, by: 130, tips: [tip(FM, 14.2, -10, -60)] }) +
  sfx('CRAC !', 700, 330, 16.0, 0.9, -6, '#ffd23f', 80) +
  say('fox', 'Un pour toi !', 16.35, 1.3, { bx: 470, by: 130, tips: [tip(FM, 16.4, -10, -60)] }) +
  sfx('FRRR !', 880, 220, 20.3, 0.8, 8, '#ffffff', 60) +
  say('fox', 'Mon croissant a disparu !', 21.2, 1.6, { bx: 520, by: 130, tips: [tip(FM, 21.2, -10, -50)], shout: true }) +
  say('hedge', 'Quel festin !', 22.9, 1.0, { bx: 315, by: 250, tips: [tip(HM, 22.9, 0, -30)] }) +
  say('rab', 'Il avait faim !', 24.0, 1.4, { bx: 865, by: 165, tips: [tip(RM, 24.0, -10, -10)] }) +
  say('fox', 'Bon appétit !', 25.5, 1.6, { bx: 560, by: 190, tips: [tip(FM, 25.5, -10, -50)] }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#7cc8ff"/>
<g style="${camStyle}">${world}</g>
${timeBadge(12, 0)}
${fx}
</svg>`;
sfxEv.push({ name: 'chime', t: 0.3 }, { name: 'sniff', t: 4.0 }, { name: 'whoosh', t: 7.2 }, { name: 'chirp', t: 8.0 }, { name: 'crack', t: 16.0 },
  { name: 'chirp', t: 18.0 }, { name: 'whoosh', t: 20.3 }, { name: 'laugh', t: 22.9 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./pique-nique.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 100, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
