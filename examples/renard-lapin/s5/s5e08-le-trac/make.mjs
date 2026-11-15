// Roussin & Lino · Saison 5 · Épisode 8 « Le trac » — 30 s, 1280x720. 15h30, les coulisses du spectacle.
//
// Découpage :
//  0.0– 3.4  plan large     Lino : « J'ai oublié mes mots ! » ; Coin est caché dans son costume de nuage
//  3.4– 7.0  Lino+Chouette  « Respire, Lino. Respire. »
//  7.0– 9.6  Coin+Roussin   le nuage tremble : « Je reste dans mon nuage. »
//  9.6–12.4  Coin+Roussin   Roussin : « Et moi... plus faim ! » (son ventre ne gargouille pas : silence)
// 12.4–16.0  plan large     panique : « Roussin n'a plus faim ?! » — « Vite ! Le croissant ! » : le croissant vole
// 16.0–20.0  Roussin        il croque, GRRR : son ventre gargouille de joie ; « Mon ventre chante ! »
// 20.0–24.5  plan large     « Il a retrouvé sa faim ! » ; le nuage s'envole, Coin sort
// 24.5–27.0  plan large     « Tu as réussi, Roussin ! » — Lino retrouve ses mots
// 27.0–30.0  carton « Saison 5 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, owl, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0, pal, croissant, puff } from '../../lib/props.mjs';
import { shake } from '../../lib/kit.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { solid, endCard5 } from '../_hfix.mjs';
import { backstage, dressForm, costume, FLOOR } from '../../lib/theatre.mjs';

const DUR = 30;
const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const SHOTS = [
  [0, 3.4, 640, 400, 1.06, 1.1],
  [3.4, 7.0, 340, 460, 1.9, 1.95],
  [7.0, 9.6, 940, 470, 1.9, 1.95],
  [9.6, 12.4, 940, 470, 1.95, 2.0],
  [12.4, 16.0, 640, 400, 1.06, 1.1],
  [16.0, 20.0, 960, 470, 1.9, 1.95],
  [20.0, 24.5, 640, 400, 1.06, 1.1],
  [24.5, 27.0, 640, 400, 1.1, 1.06],
  [27.0, 30, 640, 400, 1.06, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes s8cloudfly{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(140px,-330px) scale(.6)}}
@keyframes s8crumb{0%{opacity:1;transform:translate(0,0)}100%{opacity:0;transform:translate(var(--dx),60px)}}
@keyframes s8heart{0%{opacity:0;transform:translate(0,0) scale(.4)}25%{opacity:1}100%{opacity:0;transform:translate(var(--dx),-110px) scale(1.2)}}`);

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

// ───────── décor ─────────
const Y = 612;
const RAB = [190, Y], OWL = [440, Y], COIN = [810, Y], FOX = [1080, Y];
const bg = backstage();

// ───────── personnages ─────────
const rabEl0 = put(RAB[0], RAB[1], 1.0, rabbit({ run: null, noBag: true, noShadow: true,
  talk: [[0.7, 2.4], [12.6, 14.0], [20.3, 21.8], [25.7, 27.0]], sweatWin: [0.3, 3.4],
  eyes: [[0, 7, 'wide'], [7, 12.4, 'side'], [12.4, 16, 'wide'], [16, 20, 'wide'], [20.2, 30, 'arc']],
  moods: [[0, 7, 'panic'], [12.4, 16, 'panic'], [20.2, 30, 'happy']], blush: [[25.6, 27.4]] }));
const rabEl = shake(shake(rabEl0, 0.3, 6.7, 3), 12.4, 3.6, 3);
const owlEl = put(OWL[0], OWL[1], 1.0, owl([[3.7, 5.4], [14.3, 15.6], [24.5, 25.6]], { happyAt: 24.5, watchAt: 99 }));
const coinBase = put(COIN[0], COIN[1], 1.2, pal('duck', {
  talk: [[7.3, 8.9], [22.3, 23.9]], eyes: [[0, 22, 'wide'], [22.2, 30, 'arc']], moods: [[0, 22, 'oh'], [22.2, 30, 'happy']], giggle: [[22.2, 24.5]] }));
const cloudEye = (x) => `<g transform="translate(${x} -124)"><g style="transform-origin:0px 0px;animation:blink 3.4s ${x > 0 ? 1.1 : 1}s infinite"><circle r="12" fill="#fff" stroke="${INK}" stroke-width="3.5"/><circle cx="2" cy="1" r="5.5" fill="${INK}"/><circle cx="0" cy="-2" r="1.8" fill="#fff"/></g></g>`;
const cloudBody = `<g transform="translate(6 -104) scale(1.55)">${costume('cloud', 0, 0, 1)}</g>${cloudEye(-12)}${cloudEye(24)}
  <path d="M-2 -92 q12 8 24 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
const coinCloud = vis(0, 22.0, put(COIN[0], COIN[1], 1.2,
  `<g style="transform-origin:0px 0px;${an({ n: 'shake', d: 0.05, t: 0.4, c: 40, dir: 'alternate' }).replace('shake', 'shake')};--s:3px">${cloudBody}</g>`));
const coinCloudFly = vis(22.0, 23.4, put(COIN[0], COIN[1], 1.2, `<g style="transform-origin:0px -104px;${an({ n: 's8cloudfly', d: 1.3, t: 22.0, f: 'both', e: 'ease-out' })}">${cloudBody}</g>`));
const coinPuff = `<g transform="translate(${COIN[0]} ${COIN[1] - 100})">${puff(22.0, '#ffffff', 7, 90)}</g>`;
const foxEl0 = put(FOX[0], FOX[1], 1.0, fox({ run: null, upright: -6, noShadow: true, noBag: true, jolt: [17.8],
  talk: [[9.9, 11.4], [18.3, 19.8]], eyes: [[0, 16, 'down'], [16.0, 17.8, 'closed'], [17.8, 30, 'arc']],
  moods: [[0, 16, 'sad'], [16.0, 17.8, 'happy'], [17.8, 30, 'happy']], blush: [[17.8, 22]] }));

const foxEl = shake(foxEl0, 9.6, 2.8, 3);
// le trac se voit : traits de frisson autour de Lino (0-7 s, 12,4-16 s) et de Roussin (9,6-12,4 s)
const tremble = (x, y, a, b) => vis(a, b, shake(`<g transform="translate(${x} ${y})" fill="none" stroke="#5a6fb8" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="M-92 0 l-24 -14 l16 -16 l-24 -14"/><path d="M92 0 l24 -14 l-16 -16 l24 -14"/><path d="M-80 60 l-22 -8 l12 -14"/><path d="M80 60 l22 -8 l-12 -14"/></g>`, a, b - a, 5));
const shivers = tremble(RAB[0] + 10, Y - 250, 0.3, 7.0) + tremble(RAB[0] + 10, Y - 250, 12.4, 16.0) + tremble(FOX[0] + 30, Y - 160, 9.6, 12.4);
// croissant lancé par la chouette, croqué par Roussin
const crAir = mover(croissant, [[14.9, OWL[0] + 40, Y - 120, 0, 0.9], [15.4, 760, 200, 200, 1.0], [15.8, FOX[0] + 80, Y - 170, 420, 1.0], [16.0, FOX[0] + 112, Y - 128, 460, 0.9]]);
const crBite = vis(16.0, 17.6, `<g transform="translate(${FOX[0] + 112} ${Y - 128})"><g style="transform-origin:0px 0px;${an({ n: 'munch', d: 0.22, t: 16.0, c: 8, dir: 'alternate' })}"><g transform="scale(.62)">${croissant}</g></g></g>`);
const crumbs = [0, 1, 2, 3, 4].map((i) => vis(16.4 + i * 0.15, 17.9, `<g transform="translate(${FOX[0] + 100 + i * 6} ${Y - 96})"><g style="--dx:${(i - 1) * 18}px;${an({ n: 's8crumb', d: 0.7, t: 16.4 + i * 0.15, c: 2, f: 'both' })}"><circle r="4.5" fill="#e9a84a" stroke="${INK}" stroke-width="1.5"/></g></g>`)).join('');
const hearts = [0, 1, 2, 3].map((i) => `<g transform="translate(${FOX[0] - 20 + i * 24} ${Y - 150})"><g style="--dx:${(i - 1.5) * 34}px;${an({ n: 's8heart', d: 1.4, t: 18.0 + i * 0.2, f: 'both', e: 'ease-out' })}"><path d="M0 8 C-18 -6 -12 -22 0 -12 C12 -22 18 -6 0 8Z" fill="#ff6f95" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/></g></g>`).join('');

const world = `${bg}${rabEl}${owlEl}${coinBase}${coinCloud}${coinCloudFly}${coinPuff}${foxEl}${shivers}${crAir}${crBite}${crumbs}${hearts}`;

// ───────── espace écran ─────────
const HT = { rab: 330, owl: 225, coin: 205, fox: 250 };
const POS = { rab: RAB, owl: OWL, coin: COIN, fox: FOX };
const spk = (who, tx, t0, d, o = {}) => {
  const p = POS[who], t = scr(p[0], p[1] - HT[who] - 8, t0 + 0.2);
  return say(who, tx, t0, d, { bx: t[0] + (o.bxo || 0), by: Math.max(t[1] - 80, 135), tips: [t], shout: o.shout });
};
const hud = timeBadge(15, 30);
const bellyScr = (t) => scr(FOX[0] + 10, FOX[1] - 80, t);
const fx = hud +
  spk('rab', "J'ai oublié mes mots !", 0.7, 1.8, { bxo: 230 }) +
  sfx('SNIF', 330, 270, 2.3, 0.8, -8, '#ffffff', 56) +
  spk('owl', 'Respire, Lino. Respire.', 3.7, 1.8) +
  spk('coin', 'Je reste dans mon nuage.', 7.3, 1.8, { bxo: -30 }) +
  spk('fox', 'Et moi... plus faim !', 9.9, 1.6, { bxo: -30 }) +
  sfx('...', bellyScr(10.6)[0], bellyScr(10.6)[1], 10.6, 1.4, 0, '#ffffff', 80) +
  spk('rab', "Roussin n'a plus faim ?!", 12.6, 1.5, { shout: true, bxo: 300 }) +
  spk('owl', 'Vite ! Le croissant !', 14.3, 1.3, { bxo: 80 }) +
  sfx('GRRR !', bellyScr(17.9)[0] - 20, bellyScr(17.9)[1] - 20, 17.8, 1.0, -6, '#ffd23f', 84) +
  spk('fox', 'Mon ventre chante !', 18.3, 1.5, { bxo: -30 }) +
  spk('rab', 'Il a retrouvé sa faim !', 20.3, 1.7, { bxo: 230 }) +
  spk('coin', 'Je sors du nuage !', 22.3, 1.5, { bxo: 0 }) +
  spk('owl', 'Tu as réussi, Roussin !', 24.4, 1.2, { bxo: 60 }) +
  spk('rab', "J'ai mes mots !", 25.7, 1.4, { bxo: 230 }) +
  '';
const endCard = endCard5(27.2, 'Le trac', 'Prochain épisode : la répétition générale');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#3a3350"/>
<g style="${camStyle}">${world}</g>
${solid(fx)}${endCard}
</svg>`;
sfxEv.push({ name: 'sniff', t: 2.3 }, { name: 'tummy', t: 17.8 }, { name: 'whoosh', t: 14.9 }, { name: 'poof', t: 22.0 }, { name: 'laugh', t: 20.4 }, { name: 'laugh', t: 22.5 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./trac.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 104, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
