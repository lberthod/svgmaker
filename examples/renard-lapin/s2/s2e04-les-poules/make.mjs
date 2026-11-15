// Roussin & Lino · Saison 2 · Épisode 4 « Les poules » — 30 s, 1280x720. 9h40, le poulailler de la ferme.
// Gag : Roussin tient un œuf tout chaud, il lui glisse des mains, un poussin éclot et le prend pour sa maman.
//
//  0.0– 3.6  plan large      Papi Bernard : « Doucement avec les œufs ! »
//  3.6– 6.6  Lino            panier, « Un, deux, trois œufs ! »
//  6.6– 9.8  Roussin          prend un œuf tout chaud (anticipation : il transpire, l'œuf tremble)
//  9.8–11.4  la main         l'œuf glisse : « Oh non ! », il tombe
// 11.4–14.0  le sol           CRAC, le poussin sort de la coquille
// 14.0–17.8  Roussin + poussin « Je ne suis pas ta maman ! »
// 17.8–19.4  Lino            « Il t'adopte ! »
// 19.4–24.0  plan large      Roussin marche, le poussin le suit partout ; Piquette murmure
// 24.0–27.5  plan large      Papi Bernard : « Bienvenue dans la famille ! »
// 27.5–30.0  carton
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, sfx, fox, rabbit, put, style, addKF } from '../../lib/kit.mjs';
import { makeCam, say, card } from '../../lib/props.mjs';
import { hedgehog, badger } from '../../lib/cast2.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { farmBg, hen, chick, egg, GROUND } from '../../lib/farm.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.6, 640, 400, 1.0, 1.05],
  [3.6, 6.6, 790, 450, 1.5, 1.55],
  [6.6, 9.8, 470, 470, 1.55, 1.62],
  [9.8, 11.4, 450, 520, 1.9, 1.95],
  [11.4, 14.0, 540, 520, 1.7, 1.75],
  [14.0, 17.8, 470, 480, 1.6, 1.65],
  [17.8, 19.4, 790, 470, 1.7, 1.75],
  [19.4, 24.0, 600, 450, 1.25, 1.3],
  [24.0, 27.5, 640, 400, 1.0, 1.06],
  [27.5, 30, 640, 380, 1.06, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes wob{from{transform:rotate(-7deg)}to{transform:rotate(7deg)}}
@keyframes popin{0%{transform:scale(.1)}60%{transform:scale(1.25)}100%{transform:scale(1)}}`);

// ───────── décor : le poulailler ─────────
const coop = `<g transform="translate(200 560)">
  <rect x="-160" y="-240" width="320" height="240" fill="#c98a4e" stroke="${INK}" stroke-width="6"/>
  ${[-110, -60, -10, 40, 90].map((x) => `<path d="M${x} -236 V-4" stroke="#a96d36" stroke-width="4" opacity=".7"/>`).join('')}
  <path d="M-190 -236 L0 -340 L190 -236Z" fill="#e8434e" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M-110 -250 L0 -310 L110 -250" fill="none" stroke="#b92f3a" stroke-width="5"/>
  <path d="M-60 -4 V-120 Q0 -170 60 -120 V-4Z" fill="#2b1e1a" stroke="${INK}" stroke-width="5"/>
  <path d="M-60 -4 L-90 30 H90 L60 -4Z" fill="#a96d36" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <rect x="-140" y="-200" width="76" height="62" rx="6" fill="#fff4dc" stroke="${INK}" stroke-width="5"/><path d="M-102 -200 V-138 M-140 -169 H-64" stroke="${INK}" stroke-width="4"/>
  <rect x="70" y="-196" width="76" height="46" rx="8" fill="#fff4dc" stroke="${INK}" stroke-width="5"/><text x="108" y="-162" text-anchor="middle" class="bt" style="font-size:26px">ŒUFS</text></g>`;
const nest = (x, y) => `<g transform="translate(${x} ${y})"><ellipse rx="86" ry="20" fill="#d7a64a" stroke="${INK}" stroke-width="4"/>${[-60, -30, 0, 30, 60].map((k) => `<path d="M${k - 18} 4 l36 -10" stroke="#f2d27a" stroke-width="4" stroke-linecap="round"/>`).join('')}</g>`;
const NY = 618;
const NESTS = [[110, NY], [245, NY + 6], [375, NY]];
const hens = NESTS.map(([x, y], i) => nest(x, y) + put(x, y - 4, 1.15, hen([], { peck: i === 1 ? [[1.0, 1.6], [4.4, 5.0], [12.5, 13.1]] : i === 2 ? [[2.4, 3.0], [8.0, 8.6]] : [], eyes: i === 0 ? [[26.0, 30, 'arc']] : [] }))).join('');
const eggsFront = [[190, 640], [345, 646]].map(([x, y]) => egg(x, y, 0.42)).join('');


// ───────── personnages ─────────
const FX = 565, FY = 632, LX = 800, LY = 630, HX = 975, HY = 628, BX = 1150, BY = 620;
const basket = `<g transform="translate(6 14)"><path d="M-40 -6 Q-36 34 0 34 Q36 34 40 -6Z" fill="#c98a4e" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-30 6 h60 M-26 18 h52" stroke="#a96d36" stroke-width="3"/>
  ${[-22, 0, 22].map((x, i) => `<ellipse cx="${x}" cy="-8" rx="13" ry="16" fill="#fffaf0" stroke="${INK}" stroke-width="3" opacity="${i < 3 ? 1 : 0}"/>`).join('')}
  <path d="M-40 -6 Q0 -70 40 -6" stroke="${INK}" stroke-width="5" fill="none"/></g>`;
const mkFox = (o, flip, x = FX, win = null) => { const e = put(x, FY, 1.05, fox(o), flip); return win ? vis(win[0], win[1], e) : e; };
const foxBase = { run: null, upright: -8 };
const foxStand = mkFox({ ...foxBase,
  talk: [[7.0, 8.6], [10.3, 11.0], [15.6, 17.4]],
  eyes: [[3.0, 6.5, 'side'], [8.8, 10.4, 'wide'], [10.4, 11.6, 'wide'], [11.6, 14.4, 'down'], [14.4, 15.5, 'wide'], [17.8, 19.4, 'side']],
  moods: [[7.0, 8.6, 'happy'], [8.7, 10.2, 'shy'], [10.3, 11.2, 'oh'], [11.6, 14.2, 'oh'], [15.6, 17.4, 'shy']],
  sweatWin: [8.8, 10.2], jolt: [10.3, 14.4], blush: [[15.6, 17.4]],
  point: [], gest: [[7.0, 8.6]] }, true, FX, [0, 19.4]);
const foxWalkR = vis(19.4, 21.2, tf(put(0, 0, 1.05, fox({ run: [19.4, 21.2], upright: -14, noDust: true, moods: [[0, 99, 'shy']], eyes: [[0, 99, 'side']] })), { t0: 19.4, d: 1.8, from: `translate(${FX}px,${FY}px)`, to: `translate(720px,${FY}px)`, e: 'ease-in-out' }));
const foxWalkL = vis(21.2, 23.2, tf(put(0, 0, 1.05, fox({ run: [21.2, 23.2], upright: -14, noDust: true, talk: [[21.4, 22.8]], moods: [[0, 99, 'shy']], eyes: [[0, 99, 'wide']] }), true), { t0: 21.2, d: 2.0, from: `translate(720px,${FY}px)`, to: `translate(500px,${FY}px)`, e: 'ease-in-out' }));
const foxEnd = mkFox({ ...foxBase, moods: [[0, 99, 'happy']], eyes: [[0, 99, 'arc']], blush: [[23.4, 27]] }, true, 500, [23.2, 99]);

const rab = put(LX, LY, 1.0, rabbit({ run: null, talk: [[3.9, 5.9], [18.0, 19.2]], gest: [[3.9, 5.9]], item: basket,
  eyes: [[0, 3.6, 'side'], [3.6, 6.6, 'side'], [6.6, 9.8, 'side'], [10.3, 14.2, 'wide'], [17.8, 19.4, 'arc'], [19.4, 24, 'arc'], [24, 30, 'side']],
  moods: [[3.9, 5.9, 'happy'], [10.3, 14.2, 'oh'], [17.8, 24, 'happy']], jolt: [10.4], blush: [] }), true);
const hedge = put(HX, HY, 0.82, hedgehog([[23.6, 25.0]], { eyes: [[0, 22.8, 'side'], [23.5, 26, 'side']], moods: [[0, 23.5, 'shy'], [23.5, 27, 'happy']], blush: [[23.5, 27]] }), true);
const papi = put(BX, BY, 0.78, badger([[0.5, 2.4], [25.0, 27.2]], { moods: [[0.5, 2.4, 'happy'], [25.0, 27.5, 'happy']], eyes: [[2.6, 9, 'side'], [11, 14, 'wide']], jolt: [10.5] }), true);

// l'œuf : dans le nid → main de Roussin → échappe → sol → éclôt
const HAND = [462, 532];
const eggPick = tf(egg(0, 0, 0.5), { t0: 6.8, d: 0.5, from: 'translate(375px,640px)', to: `translate(${HAND[0]}px,${HAND[1]}px)`, e: 'ease-in-out' });
const eggHold = vis(6.8, 10.0, `<g style="--s:2px;${an({ n: 'shake', d: 0.06, t: 9.0, c: 15, dir: 'alternate' })}">${eggPick}</g>`);
const eggToss = vis(10.0, 10.35, tf(egg(0, 0, 0.5), { t0: 10.0, d: 0.35, from: `translate(${HAND[0]}px,${HAND[1]}px)`, to: `translate(${HAND[0] - 8}px,${HAND[1] - 70}px)`, e: 'ease-out' }));
const eggFall = vis(10.35, 10.8, tf(egg(0, 0, 0.5), { t0: 10.35, d: 0.45, from: `translate(${HAND[0] - 8}px,${HAND[1] - 70}px)`, to: `translate(${HAND[0] - 8}px,640px)`, e: 'cubic-bezier(.5,0,1,.6)' }));
const eggCrack = vis(10.8, 12.3, `<g style="transform-origin:${HAND[0] - 8}px 640px;${an({ n: 'wob', d: 0.18, t: 11.2, c: 4, dir: 'alternate' })}">${egg(HAND[0] - 8, 640, 0.6, { crack: true })}</g>`);
const CX0 = HAND[0] - 8;
// le poussin suit Roussin : on le remplace par un poussin qui trottine (deux allers)
const chickWalk1 = vis(19.4, 21.2, tf(put(0, 0, 1.5, chick([], { shell: true, hop: [[19.4, 21.2, 12]] })), { t0: 19.6, d: 1.6, from: `translate(${CX0}px,640px)`, to: 'translate(640px,640px)', e: 'ease-in-out' }));
const chickWalk2 = vis(21.2, 23.2, tf(put(0, 0, 1.5, chick([], { shell: true, hop: [[21.2, 23.2, 12]] }), true), { t0: 21.4, d: 1.6, from: 'translate(640px,640px)', to: 'translate(440px,640px)', e: 'ease-in-out' }));
const chickEnd = vis(23.2, 99, put(440, 640, 1.5, chick([], { shell: true, eyes: [[0, 99, 'arc']] }), true));

// l'ordre : pop sur 12.3 ; il reste debout jusqu'à 19.4 (chickPop persiste) ; on masque avant les marches
const chickPopV = vis(12.3, 19.4, tf(put(0, 0, 1.9, chick([], { shell: true, hop: [[12.5, 13.3, 10]], eyes: [[12.3, 13.4, 'wide'], [14.4, 17.8, 'wide'], [17.8, 99, 'arc']], blush: [[15.6, 17.4]] })), { t0: 12.3, d: 0.4, from: `translate(${CX0}px,640px) scale(.1)`, to: `translate(${CX0}px,640px) scale(1)`, e: 'cubic-bezier(.3,1.6,.5,1)' }));

const world = `${farmBg()}${coop}${hens}${eggsFront}${papi}${hedge}${rab}${foxStand}${foxWalkR}${foxWalkL}${foxEnd}
  ${eggHold}${eggToss}${eggFall}${eggCrack}${chickPopV}${chickWalk1}${chickWalk2}${chickEnd}`;

// ───────── bulles : pointe placée au-dessus de la tête, en espace écran ─────────
const tip = (t, wx, wy) => { const [x, y] = scr(wx, wy, t + 0.1); return [x, y]; };
const S = (who, text, t0, dur, head, o = {}) => { const [x, y] = tip(t0, ...head); return say(who, text, t0, dur, { bx: x + (o.dx || 0), by: y - (o.up ?? 95), tips: [[x, y]], shout: o.shout, fs: o.fs || (o.shout ? 50 : 41) }); };
// têtes (monde), pointe juste au-dessus
const H_FOX = [FX - 78, FY - 215], H_RAB = [LX - 50, FY - 250], H_HEDGE = [HX - 44, HY - 150], H_BAD = [BX - 36, BY - 245];

const fx =
  S('badger', 'Doucement avec les œufs !', 0.5, 1.9, H_BAD, { dx: -160 }) +
  sfx('COT COT !', 250, 330, 0.9, 1.2, -6, '#ffffff', 56, 'chirp') +
  S('rab', 'Un, deux, trois œufs !', 3.9, 2.0, H_RAB, { dx: -40 }) +
  S('fox', 'Cet œuf est tout chaud.', 7.0, 1.7, H_FOX, { dx: 60 }) +
  sfx('...', 640, 250, 8.9, 1.2, 0, '#ffffff', 80) +
  S('fox', 'Il glisse !', 10.3, 0.8, [HAND[0] - 20, HAND[1] - 120], { shout: true, up: 80 }) +
  sfx('CRAC !', 760, 650, 10.8, 1.0, 8, '#ffd23f', 100, 'crack') +
  sfx('PIOU !', 700, 440, 12.4, 1.3, -6, '#ff9f43', 80, 'boing') +
  S('fox', 'Je ne suis pas ta maman !', 15.6, 1.9, H_FOX, { dx: 90 }) +
  S('rab', "Il t'adopte !", 18.0, 1.5, H_RAB, { dx: -20 }) +
  S('fox', 'Arrête de me suivre !', 21.6, 1.7, [600, FY - 215], { dx: 0 }) +
  S('hedge', 'Il est mignon...', 23.6, 1.4, H_HEDGE, { dx: -30 }) +
  S('badger', 'Bienvenue dans la famille !', 25.1, 2.1, H_BAD, { dx: -130 }) +
  card(27.7, 'Saison 2 · Les poules', 'la vache');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#bfe6ff"/>
<g style="${camStyle}">${world}</g>
${timeBadge(9, 40)}
${fx}
</svg>`;
sfxEv.push({ name: 'whoosh', t: 10.0 }, { name: 'click', t: 6.8 }, { name: 'laugh', t: 18.1 }, { name: 'step', t: 19.6 }, { name: 'step', t: 21.6 }, { name: 'chime', t: 27.7 });
writeFileSync(new URL('./poules.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 112, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
