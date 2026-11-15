// Roussin & Lino · Saison 5 · Épisode 4 « La première répétition » — 30 s, 1280x720. 11h00, la scène de la salle des fêtes.
//
// Découpage :
//  0.0– 3.2  plan large     Mme Chouette : « Première répétition ! » (pastille 11 h 00 en haut à gauche)
//  3.2– 5.0  Roussin        « Je suis le soleil ! » (costume de soleil)
//  5.0– 6.8  les nuages     Mimi : « Nous, les nuages ! »
//  6.8– 9.6  plan large     tout le monde parle en même temps (BLA BLA)
//  9.6–11.4  Chouette       « Un seul à la fois ! »
// 11.4–16.4  Lino           siffle... une horloge (DRING) ; Chouette : « Lino, c'est une horloge ! » ; « Oups ! »
// 16.4–18.0  plan large     Chouette : « Nuages, croisez-vous doucement ! »
// 18.0–22.0  les nuages     Coin s'élance, bouscule Mimi : POUF ! comme de vrais nuages
// 22.0–26.4  plan large     « Des vrais nuages ! » — « Encore une fois ! »
// 26.4–30.0  plan large     carton « Saison 5 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, owl, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0, pal } from '../../lib/props.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { solid, endCard5 } from '../_hfix.mjs';
import { stage, backdrop, costumeBack, costumeFront, echo } from '../../lib/theatre.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.2, 640, 400, 1.0, 1.05],
  [3.2, 5.0, 710, 470, 2.25, 2.3],
  [5.0, 6.8, 815, 440, 1.7, 1.75],
  [6.8, 9.6, 640, 400, 1.0, 1.08],
  [9.6, 16.4, 492, 440, 1.3, 1.3],
  [16.4, 18.0, 640, 400, 1.05, 1.0],
  [18.0, 22.0, 815, 440, 1.7, 1.75],
  [22.0, 26.4, 640, 400, 1.0, 1.08],
  [26.4, 30, 640, 400, 1.08, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes cbob{from{transform:translateY(0)}to{transform:translateY(-9px)}}
@keyframes blak{0%{opacity:0;transform:scale(.3) rotate(-10deg)}15%{opacity:1;transform:scale(1.2) rotate(3deg)}30%{transform:scale(1)}80%{opacity:1}100%{opacity:0}}`);

// ───────── répliques (source unique : bulles + mouvements de bouche) ─────────
const L = [
  { w: 'owl', t: 'Première répétition !', a: 0.5, d: 2.3, m: 'happy' },
  { w: 'fox', t: 'Je suis le soleil !', a: 3.4, d: 1.5, m: 'happy' },
  { w: 'mimi', t: 'Nous, les nuages !', a: 5.2, d: 1.5, m: 'happy' },
  { w: 'owl', t: 'Un seul à la fois !', a: 9.8, d: 1.5, m: 'oh', sh: true, abs: [600, 82] },
  { w: 'rab', t: 'Voici mon sifflet !', a: 11.6, d: 1.5, m: 'happy', abs: [560, 82] },
  { w: 'owl', t: "C'est une horloge !", a: 13.6, d: 1.6, m: 'oh', abs: [540, 82] },
  { w: 'rab', t: 'Pardon, Mme Chouette !', a: 15.3, d: 1.1, m: 'sad', abs: [520, 82] },
  { w: 'owl', t: 'Nuages, croisez-vous doucement !', a: 16.5, d: 1.5, m: 'happy', o: [250, -140] },
  { w: 'mimi', t: 'Je suis toute écrasée !', a: 20.3, d: 1.0, m: 'oh', sh: true },
  { w: 'fox', t: 'De vrais nuages !', a: 22.3, d: 1.7, m: 'happy', o: [0, -150] },
  { w: 'owl', t: 'Encore une fois !', a: 24.3, d: 1.5, m: 'happy', o: [60, -150] },
];
const talk = (w) => L.filter((l) => l.w === w).map((l) => [l.a + 0.1, l.a + l.d - 0.15]);
const moods = (w) => L.filter((l) => l.w === w).map((l) => [l.a, l.a + l.d, l.m]);

// positions (monde) : pieds en y = 600
const FY = 600;
const X = { owl: 140, rab: 340, fox: 650, coin: 870, mimi: 1070 };
// bump des nuages : Coin recule (18.4-19.0), fonce (19.0-19.5), POUF (19.5), rebondit
const coinX = (t) => (t < 18.4 ? 870 : t < 19.0 ? 870 - 24 * ss((t - 18.4) / 0.6) : t < 19.5 ? 846 + 88 * ss((t - 19.0) / 0.5) : t < 20.4 ? 934 - 64 * ss((t - 19.5) / 0.9) : 870);
const HEAD = {
  owl: () => [X.owl, FY - 235], rab: () => [X.rab - 50, FY - 290], fox: () => [X.fox + 70, FY - 225],
  coin: (t) => [coinX(t), FY - 195], mimi: () => [X.mimi, FY - 195],
};
const squash = (t, t0) => { const u = t - t0; if (u < 0 || u > 0.7) return [1, 1]; const k = Math.sin((u / 0.7) * Math.PI * 3) * Math.exp(-u * 4); return [1 - 0.28 * k, 1 + 0.2 * k]; };

// ───────── décor : la scène (rideaux ouverts), décor de jour ─────────
const bg = stage({ backdrop: backdrop('day') });
const badge = timeBadge(11, 0);

// ───────── personnages ─────────
const owlEl = put(X.owl, FY + 24, 1.1, `<g style="animation:owlsway 1.8s ease-in-out infinite alternate">${owl(talk('owl'), { happyAt: 25, watchAt: null })}</g>`);
const rabEl = put(X.rab, FY, 1.0, rabbit({ run: null, noBag: true, noShadow: true, talk: talk('rab'), moods: moods('rab'), eyes: [[11.6, 13.0, 'arc'], [15.3, 16.4, 'down'], [24, 27, 'arc']], blush: [[15.3, 16.4]] }), true);
const sun = costumeBack('sun', 0, -100, 0.85);
const foxEl = put(X.fox, FY, 1.0, sun + fox({ run: null, upright: -6, noShadow: true, noBag: true, talk: talk('fox'), moods: [...moods('fox'), [20.0, 21.5, 'oh']], eyes: [[3.4, 5.0, 'arc'], [19.6, 21.5, 'wide'], [22.3, 24.0, 'arc']], blush: [[22.3, 24.0]] }));
const cloudFig = (kind, o) => costumeBack('cloud', 0, -60, 0.6) + pal(kind, o) + costumeFront('cloud', 0, -22, 1.05);
const cb = (inner, d) => `<g style="animation:cbob ${d}s ease-in-out infinite alternate">${inner}</g>`;
const coinEl = track(cb(cloudFig('duck', { look: 3, eyes: [[18.4, 19.5, 'wide'], [19.5, 21.5, 'sq'], [22.3, 25, 'arc']], moods: [[19.5, 21.5, 'oh'], [22.3, 25, 'happy']] }), 1.1), 0, DUR, (t) => {
  const [sx, sy] = squash(t, 19.5); return { x: coinX(t), y: FY, sx, sy };
}, 30);
const mimiEl = track(cb(cloudFig('mouse', { look: -3, talk: talk('mimi'), eyes: [[19.5, 21.5, 'sq'], [22.3, 25, 'arc']], moods: [...moods('mimi'), [22.3, 25, 'happy']] }), 1.3), 0, DUR, (t) => {
  const [sx, sy] = squash(t, 19.55); return { x: X.mimi, y: FY - (t > 19.55 && t < 20.2 ? 26 * Math.sin(((t - 19.55) / 0.65) * Math.PI) : 0), sx, sy };
}, 30);

// le « sifflet » de Lino : une petite horloge réveil
const clk = `<g><circle cy="-4" r="28" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-20" cy="-30" r="11" fill="#e8434e" stroke="${INK}" stroke-width="4"/><circle cx="20" cy="-30" r="11" fill="#e8434e" stroke="${INK}" stroke-width="4"/><path d="M0 -4 V-20 M0 -4 L12 4" stroke="${INK}" stroke-width="4" stroke-linecap="round"/></g>`;
const whistle = vis(11.8, 13.4, `<g transform="translate(${X.rab - 92} ${FY - 128}) scale(.9)"><g style="--s:3px;${an({ n: 'shake', d: 0.05, t: 12.2, c: 16, dir: 'alternate' })}">${clk}</g></g>`) +
  vis(12.2, 13.4, `<g transform="translate(${X.rab - 128} ${FY - 132}) scale(-1 1)">${echo(0, 0, 12.2, { n: 3 })}</g>`);

// bouffées de nuage au POUF
const pouf = [0, 1, 2, 3, 4, 5].map((i) => vis(19.5, 20.3, `<g transform="translate(${1002 + (i - 2.5) * 22} ${FY - 150 - (i % 2) * 30})"><g style="${an({ n: 'puff', d: 0.8, t: 19.5 + i * 0.03, f: 'both' })}"><circle r="${16 + (i % 3) * 5}" fill="#fff" stroke="${INK}" stroke-width="3"/></g></g>`)).join('');

const world = `${bg}${owlEl}${rabEl}${foxEl}${coinEl}${mimiEl}${whistle}${pouf}`;

// ───────── espace écran : bulles, bruitages, carton ─────────
const sayL = (l) => {
  const tm = l.a + 0.3, hp = HEAD[l.w](tm), [sx, sy] = scr(hp[0], hp[1], tm), off = l.o || [0, -125];
  if (l.abs) return say0(l.w, l.t, l.a, l.d, { bx: l.abs[0], by: l.abs[1], tips: [[sx, sy - 6]], shout: !!l.sh, fs: l.sh ? 50 : 41 });
  return say0(l.w, l.t, l.a, l.d, { bx: sx + off[0], by: sy + off[1], tips: [[sx, sy - 6]], shout: !!l.sh, fs: l.sh ? 50 : 41 });
};
const bla = [[200, 230, 'BLA BLA', -8, '#ff8fb1'], [470, 170, 'BLA !', 6, '#7cc8ff'], [740, 200, 'BLA BLA', -5, '#9be08a'], [1000, 260, 'BLA !', 9, '#c7a3ff'], [330, 300, 'BLA BLA', -7, '#ffd23f']]
  .map(([x, y, tx, r, c], i) => `<g transform="translate(${x} ${y}) rotate(${r})"><g style="${an({ n: 'blak', d: 1.0, t: 7.0 + i * 0.4, f: 'both' })}"><text class="sfx" style="font-size:64px;fill:${c}">${tx}</text></g></g>`).join('');
const endCard = endCard5(27.0, 'La première répétition', 'Prochain épisode : les costumes');
const fx = badge + solid(L.map(sayL).join('')) + bla +
  sfx('DRING !', 560, 235, 12.2, 0.9, -6, '#ffd23f', 70) +
  sfx('POUF !', 940, 130, 19.5, 0.9, -6, '#ffffff', 90) + endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#241a3a"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'chime', t: 0.3 }, { name: 'whoosh', t: 7.0 }, { name: 'handbell', t: 12.2 }, { name: 'poof', t: 19.5 }, { name: 'laugh', t: 22.6 }, { name: 'chime', t: 27.0 });
writeFileSync(new URL('./la-premiere-repet.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 112, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
