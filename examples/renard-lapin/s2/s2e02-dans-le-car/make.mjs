// Roussin & Lino · Saison 2 · Épisode 2 « Dans le car » — 30 s, 1280x720. 8h15, l'intérieur du car-tracteur de Papi Bernard.
//
// Découpage :
//  0.0– 3.5  plan large      le car cahote ; Papi Bernard : « Attention, ça cahote ! »
//  3.5– 6.5  Piquette          seule sur sa banquette : « Mes piquants font peur... »
//  6.5–10.0  Mimi + ballon    « Mon ballon s'envole ! » : il dérive vers le dos de Piquette
// 10.0–12.5  les piquants     gros plan, le ballon touche les piquants (anticipation)
// 12.5–14.5  POP !            le ballon éclate, Piquette se roule en boule, tout le monde sursaute
// 14.5–17.5  plan moyen       Roussin : « Mes oreilles ! » ; la boule tremble
// 17.5–20.0  Lino             traverse l'allée : « Je peux m'asseoir ici ? »
// 20.0–24.0  Piquette + Lino  elle se déroule : « Même avec mes piquants ? » — « Surtout avec tes piquants ! »
// 24.0–26.5  Lino s'assoit    « Aïe ! » — Hihi (premier sourire de Piquette)
// 26.5–30.0  plan large      « Plus que dix minutes ! » ; carton
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, shake, sfx, fox, rabbit, put, style, addKF } from '../../lib/kit.mjs';
import { makeCam, say as say0, card, pal } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog, badger } from '../../lib/cast2.mjs';
import { timeBadge } from '../../lib/badge.mjs';

const DUR = 30;
const say = (who, text, t0, dur, o) => say0(who, text, t0, dur, { ...o, fs: Math.round((o.fs || (o.shout ? 40 : 33)) * 1.25) });
const SHOTS = [
  [0, 3.5, 640, 380, 1.0, 1.05],
  [3.5, 6.5, 420, 470, 1.8, 1.85],
  [6.5, 10.0, 400, 450, 1.6, 1.65],
  [10.0, 12.5, 380, 480, 2.3, 2.4],
  [12.5, 14.5, 330, 470, 1.9, 1.95],
  [14.5, 17.5, 620, 450, 1.35, 1.35],
  [17.5, 20.0, 580, 480, 1.7, 1.75],
  [20.0, 24.0, 500, 480, 2.0, 2.05],
  [24.0, 26.5, 520, 480, 2.05, 2.1],
  [26.5, 30, 640, 380, 1.0, 1.05],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes scrollx{from{transform:translateX(0)}to{transform:translateX(-640px)}}
@keyframes burst{0%{opacity:0;transform:scale(.2) rotate(0)}25%{opacity:1;transform:scale(1.3) rotate(20deg)}100%{opacity:0;transform:scale(1.8) rotate(40deg)}}
@keyframes pieceflyk{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(200deg)}}`);

// ───────── décor : l'intérieur du car ─────────
const FLOORY = 600;
const tree = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-8" y="-50" width="16" height="52" fill="#8a5a33" stroke="${INK}" stroke-width="3"/><circle cy="-80" r="40" fill="#3fae55" stroke="${INK}" stroke-width="4"/><circle cx="-24" cy="-62" r="22" fill="#52c468" stroke="${INK}" stroke-width="3"/></g>`;
const scenery = `<defs><clipPath id="wclip"><rect x="0" y="130" width="${W}" height="210"/></clipPath></defs>
  <g clip-path="url(#wclip)"><rect x="0" y="130" width="${W}" height="210" fill="#bfe6ff"/>
  <g transform="translate(180 190)"><circle r="30" fill="#ffd23f"/></g>
  <g style="animation:scrollx 9s linear infinite">${[0, 1, 2].map((k) => `<path d="M${k * 640 - 40} 270 Q${k * 640 + 140} 170 ${k * 640 + 330} 262 Q${k * 640 + 480} 190 ${k * 640 + 700} 270 V340 H${k * 640 - 40}Z" fill="#9fdc7c"/>`).join('')}</g>
  <rect x="0" y="290" width="${W}" height="50" fill="#7ac35a"/>
  <g style="animation:scrollx 2.6s linear infinite">${[0, 1, 2].map((k) => `${tree(k * 640 + 120, 305, 1)}${tree(k * 640 + 470, 308, 0.8)}<path d="M${k * 640 + 240} 300 h140 M${k * 640 + 250} 280 v28 M${k * 640 + 300} 280 v28 M${k * 640 + 350} 280 v28 M${k * 640 + 240} 290 h140" stroke="${INK}" stroke-width="4" fill="none"/>`).join('')}</g>
  <rect x="0" y="322" width="${W}" height="18" fill="#c9a36a"/></g>`;
const wallBus = `<rect width="${W}" height="${H}" fill="#ffe08a"/>
  <rect width="${W}" height="120" fill="#f4b942"/><rect y="112" width="${W}" height="14" fill="#e8434e" stroke="${INK}" stroke-width="4"/>
  <rect y="${FLOORY}" width="${W}" height="${H - FLOORY}" fill="#7a5a44"/>${Array.from({ length: 5 }, (_, i) => `<line x1="0" y1="${FLOORY + 22 + i * 24}" x2="${W}" y2="${FLOORY + 22 + i * 24}" stroke="#684b38" stroke-width="3"/>`).join('')}
  <rect y="${FLOORY - 8}" width="${W}" height="12" fill="#5a3f2e" stroke="${INK}" stroke-width="3"/>
  ${scenery}
  <rect x="0" y="126" width="${W}" height="8" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="0" y="336" width="${W}" height="16" fill="#fff" stroke="${INK}" stroke-width="4"/>
  ${[0, 430, 850, 1270].map((x) => `<rect x="${x - 22}" y="126" width="44" height="226" fill="#ffe08a" stroke="${INK}" stroke-width="5"/>`).join('')}
  <path d="M0 352 H${W}" stroke="${INK}" stroke-width="4"/>
  <g transform="translate(940 66) scale(.9)">${wallClock(8, 15, 0, 0)}</g>`;
const seatBack = (x0, x1, c = '#e8434e') => `<g><rect x="${x0}" y="560" width="${x1 - x0}" height="170" rx="26" fill="${c}" stroke="${INK}" stroke-width="5"/><rect x="${x0 + 14}" y="574" width="${x1 - x0 - 28}" height="26" rx="12" fill="#fff" opacity=".28"/>
  <path d="M${x0 + 30} 640 h${x1 - x0 - 60} M${x0 + 30} 672 h${x1 - x0 - 60}" stroke="#c43e3e" stroke-width="5" stroke-linecap="round"/></g>`;

// ───────── personnages ─────────
const PIQ = [420, 606, 1.2], LIN = [770, 650, 1.15], ROU = [910, 650, 1.15], BER = [1105, 660, 1.1];
const piq = put(PIQ[0], PIQ[1], PIQ[2], hedgehog([[3.8, 5.8], [20.2, 21.9], [25.0, 26.2]], {
  ball: [[12.6, 20.0]], spikes: [[24.0, 24.8]],
  eyes: [[0, 12.6, 'down'], [20.0, 22.0, 'side'], [24.9, 26.4, 'arc']],
  moods: [[0, 20.0, 'shy'], [20.0, 22.0, 'shy'], [22.0, 24.0, 'happy'], [24.0, 30, 'happy']],
  blush: [[3.8, 5.8], [20.2, 24.0]], shiver: [14.5, 17.4], jolt: [12.6],
}));
const linSeated = put(LIN[0], LIN[1], LIN[2], rabbit({ run: null, noBag: false, talk: [], eyes: [[0, 12.4, 'side'], [12.6, 14.0, 'wide'], [14.0, 17.4, 'side']], moods: [[12.6, 17.5, 'oh']], jolt: [12.6] }));
const linWalk = tf(put(0, 0, LIN[2], rabbit({ run: [17.7, 19.7], noBag: false, talk: [[17.8, 19.4]], mood: 'happy', eyes: [[17.6, 20, 'side']], moods: [[17.6, 20, 'happy']] })), { t0: 17.7, d: 2.0, from: `translate(${LIN[0]}px,${LIN[1]}px)`, to: `translate(610px,${LIN[1]}px)`, e: 'ease-in-out' });
const linBeside = put(610, 650, LIN[2], rabbit({ run: null, noBag: false, talk: [[22.0, 23.8], [24.0, 24.8]], gest: [[22.0, 23.8]], eyes: [[19.7, 24, 'side'], [24.0, 24.9, 'wide'], [24.9, 30, 'arc']], moods: [[19.7, 24, 'happy'], [24.0, 24.9, 'oh'], [24.9, 30, 'happy']], jolt: [24.0], blush: [] }));
const rou = put(ROU[0], ROU[1], ROU[2], fox({ run: null, upright: -8, talk: [[14.8, 16.0]], eyes: [[0, 12.6, 'side'], [12.6, 17.5, 'wide'], [17.5, 30, 'side']], moods: [[12.6, 17.5, 'panic'], [17.5, 30, 'calm']], jolt: [12.6], sweatWin: [12.6, 16.5] }));
const mimi = put(100, 612, 1.2, pal('mouse', { talk: [[6.6, 8.0]], eyes: [[6.5, 9.0, 'wide'], [12.6, 14.5, 'wide']], moods: [[6.5, 9.0, 'oh']], giggle: [] }));
const coin = put(235, 612, 1.2, pal('duck', { eyes: [[6.5, 9.0, 'wide'], [12.6, 14.5, 'wide']], moods: [[12.6, 14.5, 'oh']] }));
const wheel = `<g transform="translate(1232 540) rotate(-28)"><ellipse rx="18" ry="46" fill="none" stroke="${INK}" stroke-width="14"/><ellipse rx="18" ry="46" fill="none" stroke="#3b82f6" stroke-width="7"/></g>`;
const ber = put(BER[0], BER[1], BER[2], badger([[0.5, 2.7], [26.3, 28.0]], { eyes: [[0, 30, 'side']], moods: [[0.5, 30, 'happy']], jolt: [] }));

// le ballon de Mimi : dérive jusqu'aux piquants
const balloonG = `<g style="transform-origin:0 0;animation:floaty 1.1s ease-in-out infinite alternate"><path d="M0 34 Q-8 70 4 110" stroke="${INK}" stroke-width="3" fill="none"/><ellipse rx="28" ry="34" fill="#e8434e" stroke="${INK}" stroke-width="4"/><path d="M-4 34 l-6 10 h14z" fill="#e8434e" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="-10" cy="-12" rx="7" ry="11" fill="#fff" opacity=".5" transform="rotate(20 -10 -12)"/></g>`;
const BAL0 = [185, 430], BAL1 = [352, 520];
const balloon = vis(0, 12.6, tf(balloonG, { t0: 6.5, d: 6.0, from: `translate(${BAL0[0]}px,${BAL0[1]}px)`, to: `translate(${BAL1[0]}px,${BAL1[1]}px)`, e: 'ease-in' }));
const pop = vis(12.6, 14.0, `<g transform="translate(${BAL1[0]} ${BAL1[1]})"><g style="${an({ n: 'burst', d: 0.9, t: 12.6, f: 'both' })}"><path d="M0 -58 L14 -20 L52 -30 L28 0 L58 26 L18 24 L6 62 L-12 28 L-50 40 L-30 6 L-62 -18 L-22 -20Z" fill="#ffd23f" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g></g>`
  + [[-90, -70], [100, -60], [-60, 80], [90, 70], [0, -110]].map(([dx, dy], i) => `<g transform="translate(${BAL1[0]} ${BAL1[1]})"><g style="--dx:${dx}px;--dy:${dy}px;${an({ n: 'pieceflyk', d: 0.9, t: 12.6, f: 'both' })}"><path d="M0 0 l14 -6 l6 14 l-14 4z" fill="#e8434e" stroke="${INK}" stroke-width="3"/></g></g>`).join(''));

const world = `${wallBus}
  <g style="animation:fbump .22s ease-in-out infinite alternate">
  ${seatBack(330, 680)}${wheel}${ber}${coin}${mimi}${piq}
  ${vis(0, 17.7, linSeated)}${vis(17.7, 19.7, linWalk)}${vis(19.7, 99, linBeside)}${rou}
  ${balloon}${pop}
  ${seatBack(10, 300, '#6aa6e8')}${seatBack(720, 1000)}${seatBack(1060, 1250, '#6aa6e8')}</g>`;

// ───────── écran : bulles, bruitages, carton ─────────
const tip = (c, t, dx, dy) => scr(c[0] + dx * c[2], c[1] + dy * c[2], t);
const fx =
  say('badger', 'Attention, ça cahote !', 0.5, 2.2, { bx: 880, by: 190, tips: [tip(BER, 0.5, 40, -300)] }) +
  say('hedge', 'Mes piquants font peur...', 3.8, 2.0, { bx: 520, by: 120, tips: [tip(PIQ, 3.8, 30, -215)] }) +
  say('mimi', "Mon ballon s'envole !", 6.6, 1.6, { bx: 380, by: 120, tips: [scr(100, 480, 6.6)], shout: true, fs: 32 }) +
  sfx('POP !', 880, 210, 12.6, 1.0, -8, '#ffd23f', 120, 'crack') +
  say('fox', 'Mes oreilles !', 14.8, 1.3, { bx: 800, by: 150, tips: [tip(ROU, 14.8, 60, -215)], shout: true, fs: 34 }) +
  say('rab', "Je peux m'asseoir ici ?", 17.8, 1.7, { bx: 560, by: 150, tips: [scr(700, 470, 17.8)] }) +
  say('hedge', 'Même avec mes piquants ?', 20.2, 1.8, { bx: 520, by: 150, tips: [tip(PIQ, 20.2, 30, -215)] }) +
  say('rab', 'Surtout avec tes piquants !', 22.0, 1.9, { bx: 860, by: 150, tips: [tip([610, 650, 1.15], 22.0, 40, -230)] }) +
  say('rab', 'Ça pique !', 24.0, 0.8, { bx: 900, by: 150, tips: [tip([610, 650, 1.15], 24.0, 40, -230)], shout: true }) +
  sfx('BOING', 360, 210, 24.0, 0.7, 6, '#ff6f95', 70, 'boing') +
  say('hedge', 'Merci !', 25.0, 1.2, { bx: 300, by: 160, tips: [tip(PIQ, 25.0, 30, -215)] }) +
  say('badger', 'Plus que dix minutes !', 26.3, 1.7, { bx: 860, by: 190, tips: [tip(BER, 26.3, 40, -300)] }) +
  card(28.0, 'Dans le car', 'la ferme', 640, 235);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#ffe08a"/>
<g style="${camStyle}">${shake(world, 12.6, 0.35, 8)}</g>
${timeBadge(8, 15)}
${fx}
</svg>`;
sfxEv.push({ name: 'step', t: 17.8 }, { name: 'laugh', t: 25.2 }, { name: 'chime', t: 20.3 }, { name: 'chime', t: 28.0 }, { name: 'sniff', t: 3.9 }, { name: 'whoosh', t: 12.0 });
writeFileSync(new URL('./dans-le-car.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 100, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
