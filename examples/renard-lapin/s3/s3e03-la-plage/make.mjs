// Roussin & Lino · Saison 3 · Épisode 3 « La plage » — 30 s, 1280x720. 9h30, la plage.
//
// Découpage :
//  0.0– 3.6  plan large     installation ; Lino : « Neuf heures et demie ! » — Roussin porte le parasol : « Je plante le parasol ! »
//  3.6– 7.0  le parasol      planté ; Piquette : « Il fait si bon ! »
//  7.0–10.4  le vent          une rafale ; Lino : « Attention, le vent ! » ; le parasol s'envole ; Roussin : « Mon parasol ! »
// 10.4–14.4  le retour        Lino : « Il revient ! Il tourne ! » — le parasol revient en hélice, Coin accroché au mât
// 14.4–17.8  l'atterrissage    poof ; Coin, étourdi : « C'est rigolo ! Encore ! » — Roussin : « Coin, ça va ? »
// 17.8–20.4  plan large      Piquette : « C'est rigolo, un hélicoptère ! »
// 20.4–24.0  la bouteille      elle surgit du sable ; Lino : « Une bouteille ! » — Roussin : « Ouvre vite, Lino ! »
// 24.0–27.2  le message        Lino regarde le papier : « Un dessin mystérieux ! »
// 27.2–30.0  carton « Saison 3 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0, pal, puff } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { seaBg, gull, parasol, towel, bucket, bottle } from '../../lib/sea.mjs';
import { timeBadge } from '../../lib/badge.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.6, 640, 700, 1.3, 1.3],
  [3.6, 7.0, 640, 700, 1.3, 1.35],
  [7.0, 10.4, 680, 700, 1.2, 1.2],
  [10.4, 14.4, 640, 700, 1.15, 1.15],
  [14.4, 17.8, 680, 700, 1.25, 1.25],
  [17.8, 20.4, 660, 700, 1.25, 1.3],
  [20.4, 24.0, 660, 700, 1.3, 1.3],
  [24.0, 27.2, 680, 700, 1.2, 1.2],
  [27.2, 30, 680, 700, 1.15, 1.05],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes gust{from{opacity:1;transform:translateX(1500px)}to{opacity:0;transform:translateX(-500px)}}`);

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
const sayAt = (w, tx, a, d, M, o = {}) => {
  const fs = o.shout ? 50 : 41, h = fs + 34, bw = tx.length * fs * 0.56 + 56;
  const [px, py] = scr(M[0], M[1], a + 0.1);
  let bx = o.bx ?? px + (o.dx || 0), by = o.by ?? Math.max(py - 30 - h / 2, h / 2 + 16);
  const left = Math.min(Math.max(bx, bw / 2 + 16), W - 16 - bw / 2) - bw / 2;
  if (left < 270 && by - h / 2 < 134) bx = bw / 2 + 276;
  return say(w, tx, a, d, { bx, by, tips: [[px, py]], shout: o.shout });
};

const LN = {
  plante: ['fox', 'Je plante le parasol !', 2.4, 1.5],
  bon: ['hedge', 'Il fait si bon !', 4.6, 1.4],
  vent: ['rab', 'Attention, le vent !', 7.0, 1.4],
  mon: ['fox', 'Mon parasol !', 8.9, 1.3],
  revient: ['rab', 'Il revient ! Il tourne !', 10.6, 1.7],
  wouiii: ['coin', 'Encore, encore !', 14.7, 1.8],
  ca: ['fox', 'Coin, ça va ?', 16.6, 1.2],
  helico: ['hedge', 'Coin a volé très haut !', 18.0, 1.9],
  bouteille: ['rab', 'Une bouteille !', 20.6, 1.4],
  ouvre: ['fox', 'Ouvre vite, Lino !', 22.2, 1.6],
  dessin: ['rab', 'Un joli dessin !', 24.2, 1.8],
};
const tw = (who) => Object.values(LN).filter((l) => l[0] === who).map((l) => [l[2] + 0.05, l[2] + l[3] - 0.1]);

// ───────── positions ─────────
const FY = 640, XR = 290, XH = 500, XF = 760, XP = 940, XC = 1060;
const bg = `${seaBg('day')}${gull(430, 190, 0.8, 0)}${gull(900, 150, 0.6, 1.2)}`;
const wind = [[250, 0], [330, 0.15], [400, 0.3], [300, 0.5]].map(([y, d], i) => `<g transform="translate(0 ${y})"><g style="${an({ n: 'gust', d: 1.2, t: 7.0 + d, f: 'both' })}"><path d="M0 0 q60 -26 130 0 t130 0 q30 10 40 -8" stroke="#fff" stroke-width="${7 - i}" fill="none" stroke-linecap="round" opacity=".9"/></g></g>`).join('');

// ───────── le parasol (planté, porté, envolé, revenu) ─────────
const col = '#e8434e';
const carried = mover(parasol(0, 0, 1, { col }), [[2.0, 850, 590, 28], [3.8, XP, FY, 4], [4.2, XP, FY, 0]]);
const planted1 = vis(4.2, 7.3, parasol(XP, FY, 1, { col }));
const away = mover(parasol(0, 0, 1, { col, spin: [[7.4, 9.5]] }), [[7.2, XP, FY, 0], [7.6, XP, FY - 40, -10], [8.2, 1060, 470, 35], [9.5, 1500, 400, 80]]);
const coinHang = `<g transform="translate(0 26) scale(.85)">${pal('duck', { arms: `<ellipse cx="0" cy="-34" rx="44" ry="17" fill="none" stroke="${INK}" stroke-width="20"/><ellipse cx="0" cy="-34" rx="44" ry="17" fill="none" stroke="#ffd23f" stroke-width="12"/>`, eyes: [[10.7, 14.5, 'spiral']], moods: [[10.7, 14.5, 'oh']] })}</g>`;
const back = mover(`${parasol(0, 0, 1, { col, spin: [[10.8, 14.4]] })}${coinHang}`, [[10.8, 1500, 330, 40], [12.0, 1020, 420, -30], [13.0, 700, 410, 20], [14.0, 880, 540, -10], [14.5, XP, FY, 0]]);
const planted2 = vis(14.5, 99, parasol(XP, FY, 1, { col }));
const landPuff = `<g transform="translate(${XP} ${FY - 4})">${puff(14.5)}</g>`;

// ───────── Coin au sol (après l'atterrissage) ─────────
const ring = `<ellipse cx="0" cy="-34" rx="44" ry="17" fill="none" stroke="${INK}" stroke-width="20"/><ellipse cx="0" cy="-34" rx="44" ry="17" fill="none" stroke="#ffd23f" stroke-width="12"/>`;
const coinEl = vis(14.5, 99, `<g transform="translate(${XC} ${FY + 14})"><ellipse cy="2" rx="46" ry="10" fill="#000" opacity=".2"/>${pal('duck', { talk: tw('coin'), arms: ring, giggle: [[14.7, 16.4]], eyes: [[14.5, 16.6, 'spiral'], [16.6, 17.8, 'wide'], [17.8, 19.6, 'arc']], moods: [[14.5, 16.8, 'happy'], [17.8, 30, 'happy']] })}</g>`);

// ───────── la bouteille : surgit du sable, puis dans les mains de Lino ─────────
const BT = [640, 662];
const bottleUp = vis(19.9, 21.3, `<g transform="translate(${BT[0]} ${BT[1]})">${tf(bottle(0, 0, 0.9, {}), { t0: 19.9, d: 0.5, from: 'scale(.1)', to: 'scale(1)', e: 'cubic-bezier(.3,1.5,.5,1)', o: '0px 0px' })}</g>`);
const bottleHeld = mover(bottle(0, 0, 0.8, { rot: 8 }), [[21.2, BT[0], BT[1], 0, 1], [22.0, 350, 560, 10, 1]]);
const bottleHeld2 = vis(22.0, 99, `<g transform="translate(350 560) rotate(10)">${bottle(0, 0, 0.8, {})}</g>`);

// ───────── personnages ─────────
const foxEl = put(XF, FY, 1.0, fox({ run: null, upright: -6, talk: tw('fox'),
  eyes: [[2.0, 4.0, 'side'], [7.2, 8.8, 'wide'], [8.8, 10.4, 'up'], [10.6, 13.0, 'up'], [13.0, 14.6, 'wide'], [16.0, 17.6, 'down'], [18.0, 19.8, 'arc'], [20.4, 23.5, 'wide']],
  moods: [[0, 7.0, 'happy'], [7.2, 10.4, 'oh'], [10.4, 14.4, 'oh'], [14.4, 30, 'happy']] }));
const rabEl = put(XR, FY, 1.0, rabbit({ run: null, talk: tw('rab'), eyes: [[7.0, 10.4, 'wide'], [10.4, 14.4, 'up'], [14.5, 16.0, 'wide'], [20.4, 22.0, 'wide'], [24.0, 27.0, 'down']],
  moods: [[0, 7.0, 'happy'], [7.0, 8.6, 'oh'], [8.6, 30, 'happy']] }));
const hedgeEl = put(XH, FY, 1.0, hedgehog(tw('hedge'), {
  eyes: [[4.4, 6.2, 'arc'], [7.2, 10.4, 'wide'], [10.5, 14.4, 'up'], [17.9, 20.0, 'arc'], [20.4, 24.0, 'wide']],
  moods: [[0, 4.4, 'shy'], [4.4, 7.0, 'happy'], [7.0, 10.6, 'oh'], [10.6, 30, 'happy']], blush: [[0.3, 3.5]] }));

const props = `${towel(395, 676, 0.95, '#ff8fa3')}${bucket(395, 668, 0.6, { col: '#3b82f6' })}`;
const world = `${bg}${wind}${props}${planted1}${planted2}${rabEl}${hedgeEl}${foxEl}${coinEl}${bottleUp}${bottleHeld}${bottleHeld2}${carried}${away}${back}${landPuff}`;

const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.3, t: 26.9, f: 'both' })}"><g transform="translate(640 130)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 3</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">La plage</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : Bidule</text></g></g>`;
const RMp = [XR + 54, FY - 318], HM = [XH + 55, FY - 205], FMp = [XF + 70, FY - 245], CM = [XC, FY - 170];
const S = (k, M, o) => sayAt(LN[k][0], LN[k][1], LN[k][2], LN[k][3], M, o);
const fx = timeBadge(9, 30) +
  S('plante', FMp) + S('bon', HM) + S('vent', RMp) + S('mon', FMp, { shout: true }) + S('revient', RMp) +
  S('wouiii', CM) + S('ca', FMp) + S('helico', HM, { dx: 120 }) + S('bouteille', RMp, { shout: true }) + S('ouvre', FMp) + S('dessin', RMp) +
  sfx('FWOUUSH', 640, 250, 7.0, 1.2, -4, '#ffffff', 72) + sfx('POUF !', 780, 330, 14.5, 0.8, 6, '#ffd23f', 66) + sfx('SCHHH...', 560, 280, 19.8, 1.0, -4, '#ffffff', 60) + endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#7cc8ff"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'chirp', t: 0.3 }, { name: 'step', t: 2.6 }, { name: 'poof', t: 4.0 }, { name: 'whoosh', t: 7.0 }, { name: 'whoosh', t: 10.9 }, { name: 'poof', t: 14.5 },
  { name: 'laugh', t: 18.1 }, { name: 'wave', t: 19.8 }, { name: 'chime', t: 26.9 });
writeFileSync(new URL('./la-plage.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 118, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
