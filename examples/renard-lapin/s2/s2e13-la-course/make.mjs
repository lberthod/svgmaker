// Roussin & Lino · Saison 2, épisode 13 « La course » — 30 s, 1280x720. 17h00, le pré de la ferme.
// Course d'œufs sur cuillère : Roussin fonce tout seul, Lino et Piquette courent en relais, doucement.
//
// Découpage :
//  0.0– 3.4  plan large       le pré, l'horloge (17 h), Papi Bernard : « À vos cuillères ! »
//  3.4– 6.3  la ligne         Roussin : « Je vais gagner ! » — « Prêts ? Partez ! »
//  6.3– 9.0  la course (1)    Roussin fonce, Lino avance tout doucement
//  9.0–11.0  la course (2)    Roussin file ; l'œuf commence à trembler
// 11.0–15.2  le relais+gag    Lino passe la cuillère à Piquette ; l'œuf de Roussin saute, retombe sur sa tête : CRAC
// 15.2–19.0  la réaction      Plouf : « Quelle omelette ! » ; Roussin coiffé d'un œuf ; Piquette le dépasse
// 19.0–22.2  l'arrivée        Piquette franchit le ruban ; Papi Bernard : « Bravo, Piquette ! »
// 22.2–25.4  les gagnants     Lino et Piquette : « On a gagné ! »
// 25.4–30    plan large       Roussin : « Bravo, les gagnants ! » ; carton Saison 2
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, sfx, fox, rabbit, put, track, style, addKF } from '../../lib/kit.mjs';
import { makeCam, say as say1, pal, puff } from '../../lib/props.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog, badger, frog } from '../../lib/cast2.mjs';
import { farmBg, hay, spoon, egg } from '../../lib/farm.mjs';

const DUR = 30;
// les bulles ne recouvrent jamais le badge d'heure (zone 24..230 x 24..80)
const say = (who, text, t0, dur, o) => { const fs = o.fs || (o.shout ? 50 : 41), w = text.length * fs * 0.56 + 56, left = Math.max(o.bx, w / 2 + 16) - w / 2; return say1(who, text, t0, dur, left < 250 && o.by < 130 ? { ...o, by: 130 } : o); };
const SHOTS = [
  [0, 3.4, 640, 360, 1.0, 1.04],
  [3.4, 6.3, 400, 508, 1.7, 1.75],
  [6.3, 9.0, 500, 480, 1.5, 1.55],
  [9.0, 11.0, 700, 480, 1.4, 1.45],
  [11.0, 15.2, 700, 480, 1.5, 1.55],
  [15.2, 19.0, 800, 520, 2.1, 2.15],
  [19.0, 22.2, 853, 480, 1.5, 1.55],
  [22.2, 25.4, 900, 520, 1.9, 1.95],
  [25.4, 30, 640, 360, 1.0, 1.06],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes rattle2{from{transform:rotate(-9deg)}to{transform:rotate(9deg)}}
@keyframes ribbonL{from{transform:rotate(0)}to{transform:rotate(-70deg)}}
@keyframes ribbonR{from{transform:rotate(0)}to{transform:rotate(60deg)}}
@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes yolkdrip{0%{opacity:0;transform:translateY(0)}20%{opacity:1}100%{opacity:0;transform:translateY(70px)}}`);

// ───────── positions au cours du temps ─────────
const lin = (t0, t1, x0, x1) => (t) => x0 + (x1 - x0) * Math.min(1, Math.max(0, (t - t0) / (t1 - t0)));
const FOXT = [6.3, 13.2], LINT = [6.3, 11.0], PIQT = [11.9, 20.6];
const foxX = lin(...FOXT, 230, 800), linX = lin(...LINT, 140, 500), piqX = lin(...PIQT, 580, 1070);
const YA = 672, YB = 612, SA = 0.85, SB = 0.75;
const glide = (inner, [t0, t1], x0, x1, y) => tf(inner, { t0, d: t1 - t0, from: `translate(${x0}px,${y}px)`, to: `translate(${x1}px,${y}px)`, e: 'linear' });
const hopper = (inner, [t0, t1], h, per = 0.5) => { const n = Math.max(1, Math.round((t1 - t0) / per)); return `<g style="--h:${h}px;${an({ n: 'hop', d: (t1 - t0) / n, t: t0, c: n })}">${inner}</g>`; };

// ───────── décor ─────────
const lineSeg = (y, x0, x1) => `<path d="M${x0} ${y} H${x1}" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-dasharray="26 20" opacity=".85"/>`;
const checker = (x, y0, y1) => Array.from({ length: 8 }, (_, i) => `<rect x="${x - 8 + (i % 2) * 8}" y="${y0 + i * ((y1 - y0) / 8)}" width="8" height="${(y1 - y0) / 8}" fill="${INK}"/>`).join('');
const poleClock = `<g><rect x="632" y="215" width="16" height="360" rx="6" fill="#9b6a3c" stroke="${INK}" stroke-width="5"/>
  <g transform="translate(640 180) scale(1.25)">${wallClock(5, 0, 0, 0)}</g>
  </g>`;
const startBoard = `<g><rect x="76" y="470" width="14" height="130" rx="5" fill="#9b6a3c" stroke="${INK}" stroke-width="4"/>
  <rect x="26" y="440" width="140" height="56" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/><text x="96" y="480" style="font-size:30px;fill:#e8434e">DÉPART</text></g>`;
const finishBoard = `<g><rect x="1166" y="470" width="14" height="110" rx="5" fill="#9b6a3c" stroke="${INK}" stroke-width="4"/>
  <rect x="1106" y="436" width="136" height="52" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/><text x="1174" y="474" style="font-size:26px;fill:#2b5ba8">ARRIVÉE</text></g>`;
const track0 = `<rect x="246" y="584" width="10" height="122" fill="#fff" opacity=".9"/>${checker(1070, 586, 700)}
  ${lineSeg(588, 256, 1070)}${lineSeg(642, 256, 1070)}${lineSeg(702, 256, 1070)}`;
const post = (y, h) => `<rect x="1064" y="${y - h}" width="12" height="${h + 6}" rx="4" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="1070" cy="${y - h}" r="9" fill="#e8434e" stroke="${INK}" stroke-width="3.5"/>`;
const ribbonWhole = `<path d="M1070 536 L1070 652" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M1070 536 L1070 652" stroke="#e8434e" stroke-width="7" stroke-linecap="round" stroke-dasharray="14 10"/>`;
const ribbonBroken = `<g transform="translate(1070 536)"><g style="transform-origin:0 0;${an({ n: 'ribbonL', d: 0.6, t: PIQT[1], f: 'both', e: 'ease-out' })}"><path d="M0 0 L0 52" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M0 0 L0 52" stroke="#e8434e" stroke-width="7" stroke-linecap="round" stroke-dasharray="14 10"/></g></g>
  <g transform="translate(1070 652)"><g style="transform-origin:0 0;${an({ n: 'ribbonR', d: 0.6, t: PIQT[1], f: 'both', e: 'ease-out' })}"><path d="M0 0 L0 -52" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M0 0 L0 -52" stroke="#e8434e" stroke-width="7" stroke-linecap="round" stroke-dasharray="14 10"/></g></g>`;
const ribbon = `${post(590, 54)}${vis(0, PIQT[1], ribbonWhole)}${vis(PIQT[1], 99, ribbonBroken)}${post(706, 60)}`;

// ───────── la cuillère et l'œuf ─────────
const eggBig = (o = {}) => egg(0, 0, 0.9, o);
// cuillère + œuf, origine = la main ; wob = [[t0,t1,période]] ; l'œuf quitte la cuillère à tOut (null = jamais)
const spoonSet = (rot, tOut, wobs, tStart = 0) => {
  const base = (withEgg, per) => `<g style="transform-origin:0px 0px;${an({ n: 'rattle2', d: per, c: 999, dir: 'alternate', t: 0 })}">${spoon(0, 0, 0.7, {})}${withEgg ? `<g style="transform-origin:130px -4px;${an({ n: 'rattle2', d: per * 0.8, c: 999, dir: 'alternate', t: 0.05 })}">${egg(130, -6, 0.9)}</g>` : ''}</g>`;
  let out = '';
  let t = tStart;
  const cuts = (wobs || []).map(([a, b, p]) => [a, b, p]);
  const slow = 0.5;
  const segs = [];
  for (const [a, b, p] of cuts) { if (a > t) segs.push([t, a, slow]); segs.push([a, b, p]); t = b; }
  segs.push([t, tOut ?? 99, slow]);
  for (const [a, b, p] of segs) if (b > a) out += vis(a, Math.min(b, tOut ?? 99), `<g transform="rotate(${rot})">${base(true, p)}</g>`);
  if (tOut != null) out += vis(tOut, tOut + 0.35, `<g transform="rotate(${rot - 40})">${spoon(0, 0, 0.7, {})}</g>`) + vis(tOut + 0.35, 99, `<g transform="rotate(${rot})">${spoon(0, 0, 0.7, {})}</g>`);
  return out;
};

// ───────── personnages ─────────
const splat = `<g transform="translate(70 -194)"><ellipse rx="36" ry="15" fill="#fff" stroke="${INK}" stroke-width="3.5"/><ellipse cx="-18" cy="6" rx="12" ry="14" fill="#fff" stroke="${INK}" stroke-width="3"/><ellipse cx="20" cy="6" rx="10" ry="12" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cy="-6" r="14" fill="#ffd23f" stroke="${INK}" stroke-width="3.5"/><circle cx="-5" cy="-11" r="4" fill="#fff" opacity=".6"/>
  <g transform="translate(-18 14)"><g style="${an({ n: 'yolkdrip', d: 1.2, c: 999 })}"><path d="M0 0 q-6 12 0 17 q6 -5 0 -17z" fill="#ffd23f" stroke="${INK}" stroke-width="2.5"/></g></g></g>`;
const foxEl = glide(put(0, 0, SA, fox({
  run: null, runExtra: [FOXT], holdArm: true, noBag: false, upright: -14, skid: 13.2, jolt: [13.3, 14.25], sweatWin: [10.8, 13.2],
  talk: [[3.5, 4.9], [13.3, 14.3], [17.2, 19.0], [26.0, 27.7]],
  eyes: [[3.5, 4.9, 'arc'], [10.8, 13.2, 'wide'], [13.2, 14.25, 'up'], [14.25, 15.6, 'shut'], [15.6, 17.0, 'down'], [17.1, 19.0, 'arc'], [25.8, 28, 'arc']],
  moods: [[3.5, 4.9, 'happy'], [10.8, 13.3, 'panic'], [13.3, 14.3, 'oh'], [14.3, 17.0, 'sad'], [17.1, 19.0, 'happy'], [25.8, 28, 'happy']],
  hat: [[14.25, 99, splat]],
  overHead: `<g transform="translate(91 -107) rotate(14)">${spoonSet(0, 13.25, [[10.8, 13.25, 0.12]])}</g>`,
}).replace('</g>', '</g>')), FOXT, 230, 800, YA);
const foxStill = (x) => '';
// avant le départ / après l'arrivée : même élément, la tf garde la position finale (fill both)

const LINO_ITEM = (t) => `<g transform="rotate(63)">${spoonSet(0, null, [], 0)}</g>`;
const linoOpts = (item) => ({
  run: null, gest: [], talk: [[7.4, 9.0], [11.0, 12.1], [22.6, 23.8]], item,
  eyes: [[3.4, 6.3, 'side'], [7.4, 9.0, 'side'], [12.1, 19.0, 'up'], [22.6, 23.8, 'arc']],
  moods: [[0, 6.3, 'calm'], [7.4, 9.0, 'oh'], [11.0, 12.1, 'happy'], [12.1, 20, 'happy'], [22.4, 30, 'happy']],
  raise: [[12.3, 18.8]],
});
const linoEl0 = glide(hopper(put(0, 0, SB, vis(0, 11.6, rabbit(linoOpts(LINO_ITEM()))) + vis(11.6, 99, rabbit(linoOpts('')))), LINT, 9, 0.5), LINT, 140, 500, YB);
const LINT2 = [18.5, 21.5];
const linoEl = tf(hopper(linoEl0, LINT2, 8, 0.45), { t0: LINT2[0], d: LINT2[1] - LINT2[0], from: "translate(0px,0px)", to: "translate(460px,0px)", e: "linear" });
// Lino court encore (hop) jusqu'à l'arrivée à la fin
const linoEl2 = '';

const PIQ_ITEM = `<g transform="rotate(22)">${spoonSet(0, null, [], 0)}</g>`;
const piqOpts = (item) => ({
  talk: [[22.6, 23.8]], item,
  eyes: [[0, 11.6, 'side'], [12.0, 20.6, 'sq'], [20.7, 30, 'arc']],
  moods: [[0, 11.6, 'shy'], [11.6, 20.6, 'calm'], [20.6, 30, 'happy']],
  blush: [[0, 6], [21, 26]],
});
const piqEl = glide(hopper(put(0, 0, SB, vis(0, 11.6, hedgehog([], piqOpts(''))) + vis(11.6, 99, hedgehog([[22.6, 23.8]], piqOpts(PIQ_ITEM)))), PIQT, 6, 0.46), PIQT, 580, 1070, YB);

const papiStart = vis(0, 12, put(330, 592, 0.7, badger([[0.4, 1.9], [5.0, 6.2]], { eyes: [[0.4, 1.9, 'arc']], moods: [[0.4, 1.9, 'happy'], [5.0, 6.2, 'happy']], point: [[5.0, 6.0]] })));
const papiEnd = vis(12, 99, put(1215, 620, 0.8, badger([[21.0, 22.4]], { eyes: [[19, 26, 'arc']], moods: [[19, 30, 'happy']], wave: [[21, 22.6]] }), true));
const ploufEl = put(880, 596, 0.65, frog([[15.4, 17.0]], { croak: [[15.4, 16.2]], eyes: [[15.4, 17.0, 'arc']], moods: [[15.2, 17.2, 'happy']] }));
const mimiEl = put(980, 600, 0.8, pal('mouse', { giggle: [[17.2, 19.0], [26.0, 27.7]], eyes: [[17.2, 19, 'arc'], [20.4, 26, 'arc']], moods: [[17.2, 19, 'happy'], [20.4, 26, 'happy']] }));
const coinEl = put(1040, 600, 0.8, pal('duck', { giggle: [[17.2, 19.0], [26.0, 27.7]], eyes: [[17.2, 19, 'arc'], [20.4, 26, 'arc']], moods: [[17.2, 19, 'happy'], [20.4, 26, 'happy']] }));
const balesSpectateurs = hay(980, 612, 1.0, 'bale') + hay(1050, 612, 0.95, 'bale');

// œuf qui s'envole : de la cuillère (13.25) jusqu'à la tête de Roussin (14.25)
const EGG0 = [foxX(13.2) + 208 * SA, YA - 128 * SA - 10], EGG1 = [foxX(13.2) + 38, YA - 232 * SA];
const flyingEgg = vis(13.25, 14.3, track(egg(0, 0, 0.9 * SA * 1.15), 13.25, 14.25, (t, u) => ({
  x: EGG0[0] + (EGG1[0] - EGG0[0]) * u, y: EGG0[1] + (EGG1[1] - EGG0[1]) * u - 4 * 190 * u * (1 - u), r: u * 340,
})));

const world = `${farmBg({ withFence: true })}${poleClock}${startBoard}${finishBoard}${track0}
  ${papiStart}${ploufEl}${mimiEl}${coinEl}${balesSpectateurs}${papiEnd}
  ${foxEl}
  ${vis(13.2, 14.4, `<g transform="translate(${foxX(13.2) - 10} ${YA})">${puff(13.2, '#f3e1b0', 6, 46)}</g>`)}
  ${flyingEgg}
  ${ribbon}
  ${linoEl}${piqEl}`;

// ───────── espace écran : bulles, bruitages, carton ─────────
const fxHead = (t) => scr(foxX(t) + 34, YA - 205 * SA, t);
const linoHead = (t) => scr(linX(t) + 30, YB - 285 * SB, t);
const piqHead = (t) => scr(piqX(t) + 40, YB - 190 * SB, t);
const papiHead = (t) => scr(330 + 40 * 0.7, 592 - 300 * 0.7, t);

const endCard = (t, title, next) => `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.5, t, f: 'both' })}"><g transform="translate(640 130)">
  <rect x="-344" y="-86" width="700" height="206" rx="30" fill="#000" opacity=".22" transform="rotate(-1.2)"/><rect x="-350" y="-94" width="700" height="206" rx="30" fill="#fff" stroke="${INK}" stroke-width="7" transform="rotate(-1.2)"/>
  <text y="-16" class="sfx" style="font-size:50px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 2</text>
  <text y="38" class="bt" style="font-size:38px;fill:#2b5ba8">${title}</text>
  <text y="82" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : ${next}</text></g></g>`;

const fx =
  say('badger', 'À vos cuillères !', 0.4, 1.5, { bx: 420, by: 200, tips: [scr(330 + 28, 592 - 300 * 0.7, 0.4)] }) +
  say('fox', 'Je vais gagner !', 3.5, 1.4, { bx: 330, by: 215, tips: [fxHead(3.5)] }) +
  say('badger', 'Prêts ? Partez !', 5.0, 1.2, { bx: 560, by: 150, tips: [scr(370, 592 - 285 * 0.7, 5.0)], shout: true }) +
  sfx('FIOUU !', 560, 480, 6.4, 0.8, -6, '#ffd23f', 64, 'whoosh') +
  say('rab', 'Doucement, doucement...', 7.4, 1.6, { bx: 520, by: 200, tips: [linoHead(7.4)] }) +
  say('rab', 'À toi, Piquette !', 11.0, 1.1, { bx: 340, by: 150, tips: [linoHead(11.0)] }) +
  sfx('CLIC', 560, 520, 11.6, 0.6, 0, '#ffd23f', 36, 'click') +
  sfx('ZIIIP !', 620, 600, 13.2, 0.9, -6, '#ffffff', 60, 'skid') +
  say('fox', 'Mon œuf !', 13.3, 1.0, { bx: 1060, by: 190, tips: [fxHead(13.3)], shout: true }) +
  sfx('CRAC !', 980, 330, 14.25, 0.9, 6, '#ffd23f', 76, 'crack') +
  say('frog', 'Quelle omelette !', 15.4, 1.6, { bx: 860, by: 150, tips: [scr(880 + 6, 596 - 200 * 0.65, 15.4)] }) +
  say('fox', 'Un chapeau en œuf !', 17.2, 1.8, { bx: 540, by: 140, tips: [scr(foxX(17.2) + 34, YA - 215 * SA, 17.2)] }) +
  sfx('DING !', 520, 320, 20.6, 0.9, -8, '#ffd23f', 70, 'chime') +
  say('badger', 'Bravo, Piquette !', 21.0, 1.3, { bx: 700, by: 120, tips: [scr(1215 - 30, 620 - 300 * 0.8, 21.0)] }) +
  say('hedge', 'On a gagné !', 22.6, 1.2, { bx: 900, by: 150, tips: [scr(1070 + 40, YB - 190 * SB, 22.6)] }) +
  say('fox', 'Bravo, les gagnants !', 26.0, 1.9, { bx: 680, by: 310, tips: [scr(foxX(26) + 34, YA - 205 * SA, 26.0)] }) +
  endCard(27.4, 'La course', 'le feu de camp');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#7cc8ff"/>
<g style="${camStyle}">${world}</g>
${timeBadge(17, 0)}
${fx}
</svg>`;
sfxEv.push({ name: 'step', t: 6.6 }, { name: 'laugh', t: 17.4 }, { name: 'laugh', t: 26.3 }, { name: 'chime', t: 27.4 });
writeFileSync(new URL('./la-course.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 120, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
