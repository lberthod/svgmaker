// Roussin & Lino · Épisode 10 « Le club de musique » — 30 s, 1280x720. 16h15, la salle de musique.
//
// Découpage :
//  0.0– 3.5  plan large      Mme Chouette, baguette en l'air : « Le club de musique ! Un, deux, trois... »
//  3.5– 6.5  Lino           à la batterie, beaucoup trop vite : BADABADABOUM !
//  6.5– 9.5  Roussin          au tuba, beaucoup trop lentement : POUUUUU...
//  9.5–12.0  plan large      les deux ensemble : vacarme ; Mimi et Coin se bouchent les oreilles ; la maîtresse : « Stop ! »
// 12.0–15.0  plan à deux     Lino : « Trop vite ? » — Roussin : « Trop lent ? »
// 15.0–18.0  la maîtresse    « Écoutez-vous ! » — elle bat la mesure : boum... pom...
// 18.0–23.5  plan large      ils jouent ensemble, au même rythme : les notes dansent, la classe se balance
// 23.5–27.8  plan à deux     Roussin : « Lino... je dors chez toi ce soir ? » — Lino : « Oui !! » (saut de joie)
// 27.8–30.0  plan large      carton
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, ao, vis, sfx, fox, rabbit, owl, put, style, addKF, track, ss } from '../lib/kit.mjs';
import { makeCam, say, card, pal } from '../lib/props.mjs';
import { wallClock } from '../lib/classroom.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.5, 640, 410, 1.12, 1.15],
  [3.5, 6.5, 960, 470, 1.8, 1.85],
  [6.5, 9.5, 370, 470, 1.8, 1.85],
  [9.5, 12.0, 640, 420, 1.15, 1.17],
  [12.0, 15.0, 650, 495, 1.6, 1.62],
  [15.0, 18.0, 480, 430, 1.9, 1.95],
  [18.0, 23.5, 640, 410, 1.12, 1.15],
  [23.5, 27.8, 650, 450, 1.6, 1.65],
  [27.8, 30, 640, 360, 1.0, 1.03],
];
const { camStyle } = makeCam(SHOTS, DUR);
const lerp = (a, b, u) => a + (b - a) * u;
addKF(`@keyframes hitL{from{transform:rotate(-38deg)}to{transform:rotate(12deg)}}
@keyframes hitR{from{transform:rotate(38deg)}to{transform:rotate(-12deg)}}
@keyframes noteup{0%{opacity:0;transform:translate(0,0) scale(.5)}20%{opacity:1;transform:translate(6px,-20px) scale(1)}100%{opacity:0;transform:translate(var(--dx),-150px) scale(1.1) rotate(15deg)}}
@keyframes notebeat{0%{opacity:0;transform:translate(0,0) scale(.4)}25%{opacity:1;transform:translate(10px,-30px) scale(1.15)}60%{transform:translate(var(--dx),-80px) scale(1)}100%{opacity:0;transform:translate(var(--dx),-130px) scale(.9)}}
@keyframes bounceb{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
@keyframes swayb{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
@keyframes thrum{0%,100%{transform:scale(1)}50%{transform:scale(1.06,.95)}}
@keyframes blow{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes shiverbig{0%,100%{transform:translate(0,0) rotate(0)}25%{transform:translate(-6px,2px) rotate(-3deg)}75%{transform:translate(6px,-2px) rotate(3deg)}}
@keyframes shiver{0%,100%{transform:translate(0,0)}25%{transform:translate(-3px,1px)}75%{transform:translate(3px,-1px)}}
@keyframes heart{0%{opacity:0;transform:translateY(0) scale(.3)}25%{opacity:1;transform:translateY(-20px) scale(1.15)}100%{opacity:0;transform:translateY(-90px) scale(1)}}`);

// ───────── décor : la salle de musique ─────────
const FLOOR = 540;
const note = (c = '#7a4fd6', k = 1) => `<g transform="scale(${k})"><ellipse cx="0" cy="0" rx="10" ry="7.5" fill="${c}" stroke="${INK}" stroke-width="2.5" transform="rotate(-20)"/><path d="M8 -3 V-36 q12 4 15 14" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>`;
const staff = (x, y, w) => `<g>${[0, 1, 2, 3, 4].map((i) => `<line x1="${x}" y1="${y + i * 12}" x2="${x + w}" y2="${y + i * 12}" stroke="#b9a3e8" stroke-width="3"/>`).join('')}</g>`;
const wall = `<rect width="${W}" height="${H}" fill="#efe4ff"/>
  ${Array.from({ length: 16 }, (_, i) => `<rect x="${i * 80 + 40}" y="0" width="40" height="${FLOOR - 90}" fill="#e6d8ff" opacity=".8"/>`).join('')}
  <rect y="${FLOOR - 92}" width="${W}" height="92" fill="#c9b2f2"/><rect y="${FLOOR - 98}" width="${W}" height="12" rx="4" fill="#a98ae0" stroke="${INK}" stroke-width="3"/>
  <rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="#c98a4e"/>
  ${Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${FLOOR + 14 + i * 30}" x2="${W}" y2="${FLOOR + 14 + i * 30}" stroke="#b37740" stroke-width="3"/>`).join('')}
  <rect y="${FLOOR - 6}" width="${W}" height="10" fill="#8a5224"/>
  <g><rect x="380" y="70" width="520" height="150" rx="14" fill="#fff" stroke="${INK}" stroke-width="5"/>${staff(410, 100, 460)}
    ${[[450, 136, '#e8434e'], [520, 124, '#3b82f6'], [590, 112, '#22a06b'], [660, 124, '#ffb300'], [730, 136, '#e8434e'], [800, 112, '#7a4fd6']].map(([x, y, c]) => `<g transform="translate(${x} ${y})">${note(c, 0.9)}</g>`).join('')}
    <text x="640" y="205" style="font-size:26px;fill:#7a4fd6">Do Ré Mi Fa Sol</text></g>
  ${wallClock(16, 15, 150, 140)}
  <g transform="translate(1130 150)"><rect x="-80" y="-70" width="160" height="140" rx="10" fill="#fff6d6" stroke="${INK}" stroke-width="5"/><path d="M-40 30 V-30 L40 -44 V16" stroke="${INK}" stroke-width="7" fill="none"/><circle cx="-52" cy="30" r="14" fill="#ff8fb1" stroke="${INK}" stroke-width="4"/><circle cx="28" cy="16" r="14" fill="#7cc8ff" stroke="${INK}" stroke-width="4"/></g>
  <g transform="translate(-300 455)"><rect x="-40" y="-150" width="80" height="150" rx="8" fill="#8a5224" stroke="${INK}" stroke-width="4"/><rect x="-30" y="-140" width="60" height="30" rx="4" fill="#fff"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="${-28 + i * 12}" y="-140" width="7" height="18" fill="${INK}"/>`).join('')}</g>`;

// ───────── instruments ─────────
const DRUM = [990, 640];
const drums = `<g>
  <path d="M${DRUM[0] + 120} 640 L${DRUM[0] + 120} 548" stroke="#9aa3ad" stroke-width="6"/><ellipse cx="${DRUM[0] + 120}" cy="548" rx="56" ry="12" fill="#ffd23f" stroke="${INK}" stroke-width="4"/>
  <g transform="translate(${DRUM[0] - 105} 560)" style="${an({ n: 'vis', d: 23.5, t: 0, f: 'forwards' })}"><rect x="-46" y="-6" width="92" height="40" rx="6" fill="#e8434e" stroke="${INK}" stroke-width="4"/><ellipse cx="0" cy="-6" rx="46" ry="12" fill="#f4f4f4" stroke="${INK}" stroke-width="4"/><path d="M-30 34 L-40 90 M30 34 L40 90" stroke="#9aa3ad" stroke-width="5"/></g>
  <g transform="translate(${DRUM[0]} ${DRUM[1]})"><g style="transform-origin:0 0;${[[3.6, 6.4, 0.09], [9.6, 12.0, 0.09], [18.0, 23.5, 0.5]].map(([a, b, d]) => an({ n: 'thrum', d, t: a, c: Math.round((b - a) / d) })).join(';').replace(/;animation:/g, ',')}">
    <circle r="78" fill="#3b82f6" stroke="${INK}" stroke-width="5"/><circle r="62" fill="#fff6d6" stroke="${INK}" stroke-width="4"/><text y="12" style="font-size:34px;fill:#e8434e">R&amp;L</text></g></g></g>`;
// baguettes de Lino (pivots aux pattes)
const stick = (x, y, kf, t0) => `<g transform="translate(${x} ${y})"><g style="transform-origin:0 0;transform:rotate(${kf === 'hitL' ? -20 : 20}deg);${[[3.6, 6.4, 0.07], [9.6, 12.0, 0.07], [18.0, 23.5, 0.25]].map(([a, b, d]) => ao({ n: kf, d, t: a + t0, c: Math.round((b - a) / d), dir: 'alternate' })).join(',').replace(/^/, 'animation:')}"><path d="M0 0 L${kf === 'hitL' ? -64 : 64} 34" stroke="#8a5a33" stroke-width="8" stroke-linecap="round"/><circle cx="${kf === 'hitL' ? -66 : 66}" cy="35" r="6" fill="#d9a46a" stroke="${INK}" stroke-width="2.5"/></g></g>`;
const arm2 = (x0, y0, x1, y1) => `<path d="M${x0} ${y0} L${x1} ${y1}" stroke="${INK}" stroke-width="24" stroke-linecap="round"/><path d="M${x0} ${y0} L${x1} ${y1}" stroke="#f1eff7" stroke-width="16" stroke-linecap="round"/>`;
const sticks = vis(0, 23.5, arm2(DRUM[0] - 28, 515, DRUM[0] - 50, 548) + arm2(DRUM[0] + 28, 515, DRUM[0] + 40, 548) + stick(DRUM[0] - 50, 548, 'hitL', 0) + stick(DRUM[0] + 40, 548, 'hitR', 0.035));
// tuba de Roussin
const TUBA = [385, 632];
const tuba = `<g transform="translate(${TUBA[0]} ${TUBA[1]})"><g style="transform-origin:0 0;${[[6.6, 9.4, 1.4], [9.6, 12.0, 1.2], [18.0, 23.5, 0.5]].map(([a, b, d]) => an({ n: 'blow', d, t: a, c: Math.round((b - a) / d) })).join(';').replace(/;animation:/g, ',')}">
  <circle r="58" fill="none" stroke="${INK}" stroke-width="26"/><circle r="58" fill="none" stroke="#ffc83d" stroke-width="18"/>
  <path d="M30 -50 Q60 -110 92 -150" stroke="${INK}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M30 -50 Q60 -110 92 -150" stroke="#ffc83d" stroke-width="22" fill="none" stroke-linecap="round"/>
  <ellipse cx="100" cy="-160" rx="52" ry="22" fill="#ffd96b" stroke="${INK}" stroke-width="5" transform="rotate(30 100 -160)"/><ellipse cx="104" cy="-164" rx="36" ry="12" fill="#a8741c" transform="rotate(30 104 -164)"/>
  ${[40, 56, 72].map((x) => `<rect x="${x - 6}" y="-34" width="12" height="22" rx="4" fill="#e0a92a" stroke="${INK}" stroke-width="3"/>`).join('')}
  <path d="M-8 -62 Q-2 -86 12 -98" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-8 -62 Q-2 -86 12 -98" stroke="#ffc83d" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="14" cy="-101" r="6" fill="#ffd96b" stroke="${INK}" stroke-width="3"/></g></g>`;
const BELL = [TUBA[0] + 104, TUBA[1] - 175];
addKF('@keyframes noteslow{0%{opacity:0;transform:translate(0,0) scale(.5)}10%{opacity:1;transform:translate(0,-20px) scale(1)}30%{transform:translate(20px,-35px)}55%{transform:translate(-20px,-70px)}80%{opacity:1;transform:translate(20px,-100px)}100%{opacity:0;transform:translate(0,-118px)}}');

// notes qui sortent : lentes (tuba seul), en rythme (ensemble)
const notesSlow = vis(6.8, 9.5, `<g transform="translate(${BELL[0]} ${BELL[1]})"><g style="${an({ n: 'noteslow', d: 2.6, t: 6.8, f: 'both', e: 'linear' })}">${note('#ffb300', 1.5)}</g></g>`);
const notesChaos = Array.from({ length: 12 }, (_, i) => { const t = 9.6 + i * 0.2, x = i % 2 ? BELL[0] : DRUM[0] + 40, y = i % 2 ? BELL[1] : 470; return vis(t, Math.min(t + 0.9, 11.2), `<g transform="translate(${x} ${y})"><g style="--dx:${(i % 3 - 1) * 60}px;${an({ n: 'noteup', d: 0.9, t, f: 'both' })}"><g transform="rotate(${(i * 47) % 60 - 30})">${note(['#e8434e', '#3b82f6', '#22a06b'][i % 3], 1.1)}</g></g></g>`); }).join('');
const notesBeat = Array.from({ length: 11 }, (_, i) => { const t = 18.1 + i * 0.5, fromTuba = i % 2 === 0; const [x, y] = fromTuba ? BELL : [DRUM[0] + 50, 470]; return vis(t, Math.min(t + 1.3, 23.45), `<g transform="translate(${x} ${y})"><g style="--dx:${fromTuba ? 40 : -40}px;${an({ n: 'notebeat', d: 1.3, t, f: 'both' })}">${note(['#e8434e', '#3b82f6', '#22a06b', '#7a4fd6'][i % 4], 1.3)}</g></g>`); }).join('');

// ───────── personnages ─────────
const beat = (a, b, d = 0.5) => an({ n: 'bounceb', d, t: a, c: Math.round((b - a) / d) });
const rabEl = put(DRUM[0], 640, 1.15, `<g style="${[beat(3.6, 6.4, 0.18), beat(9.6, 12.0, 0.18), beat(18.0, 23.5)].join(';').replace(/;animation:/g, ',')}">${rabbit({
  run: null, talk: [[12.2, 13.2], [23.8, 25.9]], gest: [[23.8, 25.9]], jumps: [[26.4, 26.9, 60]], noBag: true,
  eyes: [[3.6, 6.4, 'wide'], [9.6, 11.6, 'spiral'], [11.8, 13.4, 'side'], [15.2, 17.8, 'side'], [18.2, 23.5, 'arc'], [23.6, 26.0, 'side'], [26.3, 30, 'arc']],
  moods: [[3.6, 6.4, 'happy'], [9.6, 11.6, 'oh'], [11.8, 13.6, 'shy'], [18.0, 23.5, 'happy'], [23.6, 26.0, 'shy'], [26.2, 30, 'happy']],
  blush: [[12.2, 13.4], [23.8, 26.0]], jolt: [11.05],
})}</g>`, true);
const foxEl = put(290, 690, 1.15, `<g style="${[beat(18.0, 23.5)].join('')}">${fox({
  run: null, upright: -12, talk: [[13.5, 14.5], [23.8, 25.9]],
  eyes: [[6.6, 9.4, 'closed'], [9.6, 11.6, 'closed'], [11.8, 13.4, 'side'], [15.2, 17.8, 'side'], [18.2, 23.5, 'closed'], [23.6, 26.2, 'side'], [26.3, 30, 'arc']],
  moods: [[6.6, 9.4, 'calm'], [11.8, 14.6, 'shy'], [18.0, 23.5, 'happy'], [23.6, 26.2, 'oh'], [26.2, 30, 'happy']],
  blush: [[6.6, 9.4], [13.5, 14.6], [26.3, 28.0]], jolt: [11.05],
})}</g>`);
const owlEl = put(640, 590, 1.0, `<g style="${beat(18.0, 23.5)}"><g style="${an({ n: 'shiverbig', d: 0.065, t: 9.7, c: 34 })}">${owl([[0.4, 2.8], [10.6, 11.9], [15.2, 17.2]], { happyAt: 18.4, watchAt: null, wave: [[0.4, 2.8], [15.4, 17.9], [18.0, 20.0], [20.0, 22.0], [22.0, 23.5]], point: [[11.0, 11.8]] })}</g></g>`);
const palsBack = (x, kind) => put(x, 520, 0.8, `<g style="transform-origin:0 -60px;${an({ n: 'swayb', d: 1.0, t: 18.0, c: 5 })}">${pal(kind, { eyes: [[9.6, 12.0, 'closed'], [18.2, 23.5, 'arc'], [26.4, 30, 'arc']], moods: [[9.6, 12.0, 'sad'], [18.0, 23.5, 'happy'], [26.3, 30, 'happy']], jolt: [9.65],
  arms: vis(9.6, 12.0, `<circle cx="-50" cy="-124" r="15" fill="${kind === 'mouse' ? '#6E6E7A' : '#E0A800'}" stroke="${INK}" stroke-width="3.5"/><circle cx="50" cy="-124" r="15" fill="${kind === 'mouse' ? '#6E6E7A' : '#E0A800'}" stroke="${INK}" stroke-width="3.5"/>`) })}</g>`);
const benches = `<rect x="95" y="520" width="150" height="22" rx="6" fill="#d49a5c" stroke="${INK}" stroke-width="4"/><rect x="1075" y="520" width="150" height="22" rx="6" fill="#d49a5c" stroke="${INK}" stroke-width="4"/>`;
const hearts = [[650, 420, 26.5], [590, 400, 26.8], [710, 410, 27.1]].map(([x, y, t]) => vis(t, Math.min(t + 1.3, 27.75), `<g transform="translate(${x} ${y})"><g style="${an({ n: 'heart', d: 1.3, t, f: 'both' })}"><path d="M0 12 C-26 -6 -16 -26 0 -14 C16 -26 26 -6 0 12Z" fill="#ff5c7a" stroke="${INK}" stroke-width="3"/></g></g>`)).join('');

const foxGroup = foxEl + tuba;
const rab2 = put(900, 690, 1.15, rabbit({ run: null, noBag: true, talk: [[26.0, 27.0]], gest: [[26.0, 27.0]], jumps: [[26.4, 26.9, 70]],
  eyes: [[23.5, 26.0, 'side'], [26.3, 30, 'arc']], moods: [[23.5, 26.0, 'shy'], [26.2, 30, 'happy']], blush: [[23.8, 26.0]] }), true);
const world = `${wall}
  ${palsBack(170, 'duck')}${palsBack(1120, 'mouse')}${benches}
  ${vis(0, 23.5, owlEl)}${vis(27.8, 99, owlEl)}
  ${vis(0, 23.5, foxGroup)}${vis(23.5, 99, `<g transform="translate(150 640) rotate(-28) scale(.6) translate(${-TUBA[0]} ${-TUBA[1]})">${tuba}</g>`)}${vis(23.5, 99, `<g transform="translate(100 0)"><g style="--h:20px;transform-origin:290px 690px;${an({ n: 'jmp', d: 0.4, t: 26.8 })}">${foxEl}</g></g>`)}
  ${vis(0, 23.5, rabEl)}${drums}${sticks}${vis(23.5, 99, rab2)}
  ${notesSlow}${notesChaos}${notesBeat}${hearts}`;

const fx =
  say('owl', 'Le club de musique ! Un, deux, trois...', 0.4, 2.4, { bx: 640, by: 250, tips: [[640, 330]] }) +
  sfx('BADABADABOUM !', 1010, 95, 3.7, 2.6, -6, '#e8434e', 58, 'knock') +
  sfx('POUUUUU...', 520, 150, 6.8, 2.5, 4, '#ffb300', 70, 'tummy') +
  sfx('BADABOUM !', 1060, 195, 9.6, 1.4, 8, '#e8434e', 45, 'knock') + sfx('POUUU...', 300, 230, 9.8, 1.4, -6, '#ffb300', 60, 'tummy') +
  say('owl', 'Stop !', 10.9, 1.2, { bx: 640, by: 200, tips: [[640, 320]], shout: true }) +
  say('rab', 'Trop vite ?', 12.2, 1.1, { bx: 800, by: 150, tips: [[965, 228]] }) +
  say('fox', 'Trop lent ?', 13.3, 1.5, { bx: 170, by: 100, tips: [[150, 190]] }) +
  say('owl', 'Écoutez-vous !', 15.2, 2.1, { bx: 870, by: 120, tips: [[870, 230]] }) +
  sfx('boum...', 1150, 225, 15.8, 0.6, -6, '#e8434e', 60, 'knock') + sfx('pom...', 400, 210, 16.6, 0.6, 6, '#ffb300', 60, 'knock') + sfx('boum...', 1150, 225, 17.2, 0.6, -6, '#e8434e', 60, 'knock') +
  sfx('BOUM - POM - BOUM - POM', 630, 210, 18.4, 4.6, -3, '#7a4fd6', 42, 'chime') +
  say('fox', 'Lino... je dors chez toi ce soir ?', 23.8, 2.2, { bx: 560, by: 110, tips: [[440, 220]] }) +
  say('rab', 'Oui !!', 25.9, 1.8, { bx: 1135, by: 260, tips: [[1000, 300]], shout: true }) +
  card(27.8, 'Le club de musique !', 'le retour', 640, 130);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#efe4ff"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
for (let t = 3.7; t < 6.4; t += 0.14) sfxEv.push({ name: 'knock', t: +t.toFixed(2) });
for (let t = 9.7; t < 11.0; t += 0.14) sfxEv.push({ name: 'knock', t: +t.toFixed(2) });
for (let t = 18.0; t < 23.5; t += 0.5) sfxEv.push({ name: 'knock', t: +t.toFixed(2) }, { name: 'tummy', t: +(t + 0.25).toFixed(2) });
sfxEv.push({ name: 'tummy', t: 8.2 }, { name: 'chime', t: 26.3 }, { name: 'laugh', t: 26.5 });
writeFileSync(new URL('./club-de-musique.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 120, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
