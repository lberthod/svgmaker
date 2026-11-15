// Roussin & Lino · Saison 2 · Épisode 6 « Le potager » — 30 s, 1280x720. 11h00, le potager et le pommier.
// Gag : Lino compte ses carottes, Roussin en croque une à chaque fois (le compte est toujours faux) ;
//       puis Piquette roule sous le pommier : les pommes tombées se plantent dans ses piquants. Enfin utile !
//
//  0.0– 3.4  plan large      Papi Bernard : « Cueillez les carottes ! »
//  3.4– 7.2  Lino             il compte « Un, deux, trois, quatre ! » (4 carottes dans le panier)
//  7.2– 9.6  Roussin           une carotte s'envole vers sa bouche : CROUNCH
//  9.6–12.6  Lino             recompte : « Trois ? J'en avais quatre ! »
// 12.6–15.2  Roussin           « Pas moi ! » (la bouche pleine de miettes)
// 15.2–18.2  le pommier       les pommes tombent ; Papi : « Des pommes tombées ! »
// 18.2–22.6  Piquette          roule dans les pommes : elles se plantent dans ses piquants
// 22.6–27.4  plan large      « Cinq pommes ! Merci ! » ; Roussin croque encore une carotte
// 27.4–30.0  carton
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, sfx, fox, rabbit, put, style, addKF } from '../../lib/kit.mjs';
import { makeCam, say, card } from '../../lib/props.mjs';
import { hedgehog, badger } from '../../lib/cast2.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { farmBg, garden, carrot, apple, hay } from '../../lib/farm.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.4, 640, 420, 1.0, 1.05],
  [3.4, 7.2, 600, 500, 1.6, 1.65],
  [7.2, 9.6, 740, 500, 1.8, 1.85],
  [9.6, 12.6, 600, 500, 1.6, 1.65],
  [12.6, 15.2, 700, 470, 1.7, 1.75],
  [15.2, 18.2, 806, 440, 1.35, 1.4],
  [18.2, 22.6, 904, 500, 1.7, 1.75],
  [22.6, 27.4, 700, 420, 1.05, 1.12],
  [27.4, 30, 640, 380, 1.1, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes munch{from{transform:translate(0,0) rotate(-3deg)}to{transform:translate(3px,2px) rotate(3deg)}}
@keyframes crumb{0%{opacity:0;transform:translate(0,0)}15%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy))}}`);


const FY = 665, LX = 430, FXX = 720, BSK = [565, 668], HY = 676, HX0 = 1000, PX = 1190;
// ───────── décor ─────────
const tree = `<g transform="translate(1120 570)"><path d="M-22 0 L-16 -150 H16 L22 0Z" fill="#8a5a33" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <g style="transform-origin:0px -150px;--s:3px;${an({ n: 'shake', d: 0.05, t: 15.1, c: 14, dir: 'alternate' })}">
  ${[[-110, -220, 100], [0, -280, 120], [110, -220, 100], [-40, -190, 90], [60, -180, 90]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#3fae55" stroke="${INK}" stroke-width="5"/>`).join('')}
  ${[[-110, -220, 100], [0, -280, 120], [110, -220, 100]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r - 5}" fill="#52c468"/>`).join('')}</g></g>`;
const APPLES = [975, 955, 935, 920, 905];
const ROLL = [19.2, 21.2], X1 = 1000, X2 = 895;
const tPass = (x) => ROLL[0] + (ROLL[1] - ROLL[0]) * (X1 - x) / (X1 - X2);
const fallApples = APPLES.map((x, i) => {
  const t0 = 15.3 + i * 0.12, cx = 1120 + (i - 2) * 38, cy = 330 + (i % 2) * 25;
  const e = tf(apple(0, 0, 0.8), { t0, d: 0.55, from: `translate(${cx}px,${cy}px)`, to: `translate(${x}px,${HY + 8}px)`, e: 'cubic-bezier(.5,0,1,.7)' });
  return vis(0, tPass(x), e);
}).join('');
const hedgeApples = (r, c) => APPLES.map((x, i) => { const a = ((150 + i * 38) * Math.PI) / 180; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]; });
const bp = hedgeApples(72, [0, -72]), np = [160, 195, 230, 265, 300].map((d) => [-6 + 86 * Math.cos((d * Math.PI) / 180), -102 + 86 * Math.sin((d * Math.PI) / 180)]);
const stuckRoll = APPLES.map((x, i) => vis(tPass(x), ROLL[1], apple(bp[i][0], bp[i][1], 0.5))).join('');
const stuckAfter = vis(ROLL[1], 99, np.map(([x, y]) => apple(x, y, 0.5)).join(''));

const basketEl = `<g transform="translate(${BSK[0]} ${BSK[1]})">
  ${[[-26, -18], [-8, -6], [10, 8], [28, 20]].map(([x, r], i) => {
    const t0 = 3.9 + i * 0.5, t1 = i === 2 ? 7.4 : i === 1 ? 25.5 : 99;
    return vis(t0, t1, `<g transform="translate(${x} -66)">${carrot(0, 0, 0.8, r)}</g>`);
  }).join('')}
  <path d="M-52 -40 Q-48 0 0 0 Q48 0 52 -40Z" fill="#c98a4e" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-44 -24 h88 M-40 -10 h80" stroke="#a96d36" stroke-width="3.5"/>
  <path d="M-52 -40 H52" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></g>`;
// carottes volées : s'envolent du panier vers la bouche
const stolen = (t0, t1, stay) => vis(t0, stay, tf(`<g style="${an({ n: 'munch', d: 0.14, t: t1, c: 9, dir: 'alternate' })}">${carrot(0, 0, 0.55, 78)}</g>`, { t0, d: t1 - t0, from: `translate(${BSK[0] + 12}px,${BSK[1] - 64}px)`, to: `translate(${FXX - 96}px,${FY - 140}px)`, e: 'ease-in-out' }));
const crumbs = (t, x, y) => vis(t, t + 0.9, `<g transform="translate(${x} ${y})">${[0, 1, 2, 3, 4].map((i) => `<g style="--dx:${(i - 2) * 16}px;--dy:${20 + (i % 2) * 14}px;${an({ n: 'crumb', d: 0.8, t, f: 'both' })}"><circle r="4" fill="#ff9f43" stroke="${INK}" stroke-width="2"/></g>`).join('')}</g>`);

// ───────── personnages ─────────
const papi = put(PX, 652, 0.78, badger([[0.5, 2.4], [15.5, 17.2]], { moods: [[0.5, 2.4, 'happy'], [15.5, 17.2, 'oh']], eyes: [[2.5, 15, 'side'], [17.3, 30, 'arc']], jolt: [15.4] }), true);
const rab = put(LX, FY, 1.0, rabbit({ run: null, talk: [[3.9, 6.7], [9.8, 11.6], [22.9, 24.6], [26.2, 27.2]], gest: [[3.9, 6.7]],
  eyes: [[0, 3.8, 'side'], [3.8, 7.0, 'down'], [7.0, 9.7, 'side'], [9.7, 12.5, 'down'], [12.5, 22.8, 'side'], [22.8, 24.8, 'arc'], [24.8, 26.1, 'side'], [26.1, 30, 'wide']],
  moods: [[3.9, 6.7, 'happy'], [9.8, 11.6, 'oh'], [11.6, 13, 'sad'], [22.8, 24.8, 'happy'], [26.1, 30, 'oh']], jolt: [9.9, 26.2] }));
const foxEl = put(FXX, FY, 1.05, fox({ run: null, upright: -8, talk: [[7.9, 9.3], [13.0, 14.3], [21.6, 22.6], [25.7, 26.6]], gest: [[13.0, 14.3]],
  eyes: [[0, 6.8, 'side'], [6.8, 7.9, 'wide'], [7.9, 9.4, 'closed'], [9.4, 12.9, 'arc'], [12.9, 14.6, 'wide'], [14.6, 18.0, 'wide'], [18.0, 21.4, 'wide'], [21.4, 25.0, 'arc'], [25.0, 25.8, 'side'], [25.8, 27.6, 'closed']],
  moods: [[7.9, 9.4, 'happy'], [9.4, 12.9, 'shy'], [13.0, 14.6, 'shy'], [15.4, 18, 'oh'], [21.5, 22.7, 'happy'], [25.7, 27.6, 'happy']], blush: [[9.5, 14.6], [25.8, 28]], jolt: [15.4], point: [] }), true);
const hedgeStand = vis(0, ROLL[0], put(HX0, HY, 0.85, hedgehog([[18.3, 19.1]], { eyes: [[0, 15.2, 'side'], [15.2, 17.8, 'wide'], [17.8, 19.2, 'side']], moods: [[0, 15.2, 'shy'], [15.2, 17.8, 'oh'], [17.8, 19.2, 'happy']], blush: [[0, 19.2]], jolt: [15.4] }), true));
const hedgeRoll = vis(ROLL[0], ROLL[1], tf(put(0, 0, 0.85, `${hedgehog([], { ball: [[ROLL[0], ROLL[1]]], noShadow: false })}${stuckRoll}`, true), { t0: ROLL[0], d: ROLL[1] - ROLL[0], from: `translate(${X1}px,${HY}px)`, to: `translate(${X2}px,${HY}px)`, e: 'linear' }));
const hedgeEnd = vis(ROLL[1], 99, put(X2, HY, 0.85, `${hedgehog([[24.4, 25.4]], { eyes: [[0, 21.8, 'wide'], [21.8, 30, 'arc']], moods: [[0, 30, 'happy']], blush: [[21.2, 30]], jolt: [21.3] })}${stuckAfter}`, true));
// pose de départ : roulé en boule (spikes up) pendant la roulade géré par ball ; position haute du sol
const world = `${farmBg()}${hay(60, 565, 0.6)}${garden(400, 604, 0.95)}${tree}${hedgeStand}${papi}${basketEl}${rab}${foxEl}${fallApples}${hedgeRoll}${hedgeEnd}
  ${stolen(7.4, 7.9, 9.4)}${crumbs(9.4, FXX - 100, FY - 120)}${stolen(25.5, 25.9, 26.7)}${crumbs(26.7, FXX - 100, FY - 120)}`;

const tip = (t, wx, wy) => { const [x, y] = scr(wx, wy, t + 0.1); return [x, y]; };
const S = (who, text, t0, dur, head, o = {}) => { const [x, y] = tip(t0, ...head); return say(who, text, t0, dur, { bx: x + (o.dx || 0), by: y - (o.up ?? 95), tips: [[x, y]], shout: o.shout, fs: o.fs || (o.shout ? 50 : 41) }); };
const H_RAB = [LX + 58, FY - 255], H_FOX = [FXX - 78, FY - 215], H_BAD = [PX - 36, 652 - 245], H_HEDGE = [HX0 - 46, HY - 150], H_HEDGE2 = [X2 - 46, HY - 150];

const fx =
  S('badger', 'Cueillez les carottes !', 0.5, 1.9, H_BAD, { dx: -200 }) +
  S('rab', 'Un, deux, trois, quatre !', 3.9, 2.8, H_RAB, { dx: 40 }) +
  sfx('CROUNCH !', 640, 300, 7.9, 1.2, -6, '#ff9f43', 84, 'crack') +
  S('rab', "Trois ? J'en avais quatre !", 9.8, 1.9, H_RAB, { dx: 120 }) +
  S('fox', 'Pas moi !', 13.0, 1.2, H_FOX, { shout: true, dx: 30 }) +
  S('badger', 'Des pommes tombées !', 15.5, 1.7, H_BAD, { dx: -140 }) +
  sfx('PLOUF ! PLOUF !', 560, 560, 15.6, 1.4, -4, '#e8434e', 60, 'click') +
  S('hedge', 'Je peux les porter !', 18.3, 1.5, H_HEDGE, { dx: -60 }) +
  sfx('PIC ! PIC ! PIC !', 640, 190, 19.6, 1.6, -4, '#ffd23f', 70, 'poof') +
  S('fox', 'Bravo, Piquette !', 21.6, 1.1, H_FOX, { dx: -40 }) +
  S('rab', 'Cinq pommes ! Merci !', 22.9, 1.6, H_RAB, { dx: 60, fs: 50 }) +
  S('hedge', 'De rien !', 24.5, 0.9, H_HEDGE2, { dx: 0 }) +
  S('rab', 'Roussin !', 26.2, 1.0, H_RAB, { shout: true, dx: 0 }) +
  card(27.7, 'Saison 2 · Le potager', 'le pique-nique');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#bfe6ff"/>
<g style="${camStyle}">${world}</g>
${timeBadge(11, 0)}
${fx}
</svg>`;
sfxEv.push({ name: 'whoosh', t: 7.4 }, { name: 'crack', t: 25.9 }, { name: 'whoosh', t: 15.3 }, { name: 'laugh', t: 21.8 }, { name: 'chime', t: 27.7 });
writeFileSync(new URL('./potager.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 108, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
