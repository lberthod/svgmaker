// Roussin & Lino · Épisode 14 « Préparer le dodo » — 30 s, 1280x720. 20h00, la salle de bain puis la chambre de Lino.
//
// Découpage :
//  0.0– 3.5  salle de bain   ils se brossent les dents (mousse, jamais de dents) : « On se brosse les dents ! »
//  3.5– 6.5  Roussin          une barbe de mousse ! Lino : « Une barbe ! »
//  6.5– 9.5  le miroir       Roussin : « Je suis Papi Roussin ! » — ils rient ; GLOU GLOU
//  9.5–12.5  la chambre      bonnets de nuit : « En pyjama ! »
// 12.5–17.5  la chambre      bataille d'oreillers : POUF ! POUF ! plumes
// 17.5–21.0  le réveil       Lino le règle sur 7h00 : « Réveil à sept heures ! » — Roussin : « Comme ce matin ! »
// 21.0–24.5  les lits        chacun dans son lit ; Lino : « On éteint ? » — CLIC
// 24.5–27.6  le noir         deux paires d'yeux qui clignent ; « hi hi... »
// 27.6–30.0  le noir         carton
import { writeFileSync } from 'node:fs';
import { timeBadge } from '../lib/badge.mjs';
import { W, H, INK, lines, sfxEv, an, ao, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../lib/kit.mjs';
import { makeCam, say, card } from '../lib/props.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.5, 640, 440, 1.3, 1.33],
  [3.5, 6.5, 560, 480, 2.0, 2.05],
  [6.5, 9.5, 640, 420, 1.35, 1.38],
  [9.5, 12.5, 640, 450, 1.3, 1.33],
  [12.5, 17.5, 640, 450, 1.35, 1.38],
  [17.5, 21.0, 585, 470, 1.45, 1.48],
  [21.0, 24.5, 600, 450, 1.3, 1.33],
  [24.5, 30, 600, 450, 1.3, 1.31],
];
const { camStyle } = makeCam(SHOTS, DUR);
const lerp = (a, b, u) => a + (b - a) * u;
const armTo = (x0, y0, x1, y1, fur) => `<path d="M${x0} ${y0} Q${(x0 + x1) / 2} ${Math.max(y0, y1) + 40} ${x1} ${y1}" stroke="${INK}" stroke-width="24" stroke-linecap="round" fill="none"/><path d="M${x0} ${y0} Q${(x0 + x1) / 2} ${Math.max(y0, y1) + 40} ${x1} ${y1}" stroke="${fur}" stroke-width="16" stroke-linecap="round" fill="none"/>`;
addKF(`@keyframes scrub{from{transform:translate(-4px,0) rotate(-6deg)}to{transform:translate(4px,0) rotate(6deg)}}
@keyframes foamgrow{0%{transform:scale(.2)}100%{transform:scale(1)}}
@keyframes giggle{from{transform:translateY(0)}to{transform:translateY(-6px)}}
@keyframes feather{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--dx),120px) rotate(220deg)}}
@keyframes poufk{0%{opacity:0;transform:scale(.3)}30%{opacity:1;transform:scale(1.2)}100%{opacity:0;transform:scale(1.5)}}
@keyframes hand7{from{transform:rotate(240deg)}to{transform:rotate(210deg)}}
@keyframes blinkeye{0%,88%,100%{transform:scaleY(1)}92%,96%{transform:scaleY(.1)}}
@keyframes darkin{from{opacity:0}to{opacity:.97}}
@keyframes lampglow{from{opacity:.3}to{opacity:.45}}
@keyframes bubbleup{0%{opacity:0;transform:translateY(0) scale(.5)}30%{opacity:1}100%{opacity:0;transform:translateY(-60px) scale(1.1)}}`);

// ───────── décor 1 : la salle de bain ─────────
const FLOOR = 560;
const bath = `<rect width="${W}" height="${H}" fill="#e6f7ff"/>
  ${Array.from({ length: 16 }, (_, i) => Array.from({ length: 7 }, (_, j) => `<rect x="${i * 80}" y="${j * 80}" width="80" height="80" fill="${(i + j) % 2 ? '#cdeefc' : '#e6f7ff'}" stroke="#b5e0f5" stroke-width="2"/>`).join('')).join('')}
  <rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="#9fd3c7"/>
  <g><rect x="380" y="90" width="520" height="250" rx="40" fill="#cfe9ff" stroke="${INK}" stroke-width="7"/><rect x="400" y="110" width="480" height="210" rx="30" fill="#e9f6ff"/><path d="M430 140 l60 -20 M440 175 l100 -36" stroke="#fff" stroke-width="10" stroke-linecap="round"/></g>
  <g><rect x="330" y="${FLOOR - 10}" width="620" height="30" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="350" y="${FLOOR + 20}" width="580" height="150" fill="#f2f2f2" stroke="${INK}" stroke-width="5"/>
    <ellipse cx="640" cy="${FLOOR + 2}" rx="70" ry="10" fill="#bfe6ff" stroke="${INK}" stroke-width="3"/><path d="M640 ${FLOOR - 10} V${FLOOR - 50} Q640 ${FLOOR - 66} 660 ${FLOOR - 66} H690" stroke="#9aa3ad" stroke-width="12" fill="none" stroke-linecap="round"/>
    <g transform="translate(870 ${FLOOR - 14})"><rect x="-20" y="-50" width="40" height="50" rx="8" fill="#ff8fb1" stroke="${INK}" stroke-width="4"/><path d="M-6 -50 v-16 M6 -50 v-14" stroke="#7cc8ff" stroke-width="6" stroke-linecap="round"/></g></g>
  <g transform="translate(140 320)"><rect x="-40" y="-120" width="80" height="230" rx="10" fill="#ffd23f" stroke="${INK}" stroke-width="5"/><path d="M-40 -60 h80 M-40 0 h80 M-40 60 h80" stroke="#e8b400" stroke-width="5"/></g>
  <g transform="translate(1150 340)"><rect x="-20" y="-160" width="14" height="300" fill="#9aa3ad"/><path d="M-6 -150 h60 v120 q-30 20 -60 0Z" fill="#7cc8ff" stroke="${INK}" stroke-width="4"/></g>`;
const foam = (n, r) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return `<circle cx="${(Math.cos(a) * r).toFixed(0)}" cy="${(Math.sin(a) * r * 0.7).toFixed(0)}" r="${8 + (i % 3) * 4}" fill="#fff" stroke="#b5e0f5" stroke-width="2"/>`; }).join('') + `<circle r="${r * 0.7}" fill="#fff"/>`;
const brush = (c) => `<g><rect x="-36" y="-5" width="54" height="10" rx="5" fill="${c}" stroke="${INK}" stroke-width="3"/><rect x="14" y="-12" width="16" height="10" rx="3" fill="#fff" stroke="${INK}" stroke-width="2.5"/></g>`;
const FOXM = [552, 530], RABM = [745, 568];

// ───────── décor 2 : la chambre de Lino ─────────
const room = `<rect width="${W}" height="${H}" fill="#5f6fb8"/>
  ${Array.from({ length: 30 }, (_, i) => `<path d="M${(i * 97) % 1280} ${(i * 53) % 420 + 20} l4 9 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1z" fill="#ffe27a" opacity=".55"/>`).join('')}
  <rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="#8a6f5a"/>
  ${Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${FLOOR + 14 + i * 30}" x2="${W}" y2="${FLOOR + 14 + i * 30}" stroke="#7a604c" stroke-width="3"/>`).join('')}
  <g><rect x="1060" y="80" width="190" height="200" rx="10" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="1072" y="92" width="166" height="176" fill="#1d2a5c"/><circle cx="1190" cy="140" r="26" fill="#fff6c8"/><circle cx="1202" cy="132" r="24" fill="#1d2a5c"/><rect x="1150" y="80" width="10" height="200" fill="#fff" stroke="${INK}" stroke-width="3"/></g>
  <g transform="translate(400 250)"><rect x="-70" y="-60" width="140" height="120" rx="8" fill="#fff6d6" stroke="${INK}" stroke-width="5"/><path d="M-40 30 Q0 -50 40 30" stroke="#e8434e" stroke-width="10" fill="none"/><circle cx="0" cy="-10" r="12" fill="#ffd23f"/></g>`;
const BED = { x: 680, w: 380, y: 520 };
const bedBack = `<g><rect x="${BED.x}" y="${BED.y - 140}" width="26" height="250" rx="10" fill="#c98a4e" stroke="${INK}" stroke-width="5"/><rect x="${BED.x + BED.w - 26}" y="${BED.y - 60}" width="26" height="170" rx="10" fill="#c98a4e" stroke="${INK}" stroke-width="5"/>
  <rect x="${BED.x + 20}" y="${BED.y - 20}" width="${BED.w - 40}" height="70" rx="14" fill="#fff" stroke="${INK}" stroke-width="5"/><ellipse cx="${BED.x + 190}" cy="${BED.y - 22}" rx="90" ry="22" fill="#FFF3D6" stroke="${INK}" stroke-width="4"/><path d="M${BED.x + 120} ${BED.y - 22} h140" stroke="#f0d9a8" stroke-width="4"/></g>`;
const blanket = (x, y, w, c) => `<g><path d="M${x} ${y} Q${x + w / 2} ${y - 26} ${x + w} ${y} V${y + 120} H${x}Z" fill="${c}" stroke="${INK}" stroke-width="5"/>${[0, 1, 2].map((i) => `<circle cx="${x + 60 + i * (w - 120) / 2}" cy="${y + 50}" r="12" fill="#fff" opacity=".7"/>`).join('')}</g>`;
const mattress = `<g><rect x="110" y="600" width="360" height="40" rx="14" fill="#fff" stroke="${INK}" stroke-width="5"/><ellipse cx="170" cy="584" rx="60" ry="24" fill="#fff" stroke="${INK}" stroke-width="5"/></g>`;
const CLOCK = [560, 470];
const night = `<g><rect x="${CLOCK[0] - 50}" y="${CLOCK[1] + 50}" width="100" height="130" rx="8" fill="#c98a4e" stroke="${INK}" stroke-width="5"/>
  <g transform="translate(${CLOCK[0] - 30} ${CLOCK[1] - 40})"><path d="M-6 80 V0" stroke="#9aa3ad" stroke-width="6"/><path d="M-36 0 L24 0 L14 -40 L-26 -40Z" fill="#ffd23f" stroke="${INK}" stroke-width="4"/>${vis(0, 24.2, `<ellipse cx="-6" cy="10" rx="80" ry="60" fill="#fff2a8" style="animation:lampglow 2s ease-in-out infinite alternate"/>`)}</g>
  <g transform="translate(${CLOCK[0] + 22} ${CLOCK[1] + 18}) scale(1.5)"><circle r="30" fill="#e8434e" stroke="${INK}" stroke-width="4"/><circle cx="-20" cy="-26" r="9" fill="#ffd23f" stroke="${INK}" stroke-width="3"/><circle cx="20" cy="-26" r="9" fill="#ffd23f" stroke="${INK}" stroke-width="3"/><circle r="22" fill="#fff" stroke="${INK}" stroke-width="2"/>
    <line x1="0" y1="0" x2="0" y2="-18" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <g style="transform-origin:0 0;transform:rotate(240deg);${an({ n: 'hand7', d: 1.2, t: 18.3, f: 'forwards', e: 'ease-out' })}"><line x1="0" y1="0" x2="0" y2="-12" stroke="#e8434e" stroke-width="4" stroke-linecap="round"/></g>
    </g></g>`;
const nightcap = (c, fx = false) => `<g transform="${fx ? 'translate(92 -212) rotate(14)' : 'translate(52 -224) rotate(-8)'}"><path d="M-46 30 Q-10 -60 60 -30 Q20 -10 46 30Z" fill="${c}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><rect x="-50" y="22" width="100" height="18" rx="9" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="62" cy="-30" r="12" fill="#fff" stroke="${INK}" stroke-width="3"/></g>`;

// ───────── personnages ─────────
// salle de bain (0–9,5)
const foxBath = put(440, 700, 1.15, `<g style="${an({ n: 'giggle', d: 0.16, t: 7.6, c: 10, dir: 'alternate' })}">${fox({ run: null, upright: -10, noShadow: true,
  talk: [[6.8, 8.2]], eyes: [[0, 3.5, 'closed'], [3.5, 6.5, 'side'], [7.6, 9.5, 'arc']], moods: [[0, 3.5, 'calm'], [3.5, 6.5, 'oh'], [6.8, 9.5, 'happy']], blush: [[6.8, 8.2]] })}</g>`);
const rabBath = put(860, 700, 1.12, `<g style="${an({ n: 'giggle', d: 0.16, t: 4.4, c: 10, dir: 'alternate' })},${ao({ n: 'giggle', d: 0.16, t: 7.6, c: 10, dir: 'alternate' })}">${rabbit({ run: null, noBag: true, noShadow: true,
  talk: [[0.6, 2.4], [4.2, 5.6]], eyes: [[0, 3.5, 'closed'], [4.2, 6.5, 'arc'], [7.6, 9.5, 'arc']], moods: [[4.2, 6.5, 'happy'], [7.6, 9.5, 'happy']] })}</g>`, true);
const bathFx = vis(0, 9.5, `
  ${vis(0, 8.8, `<g transform="translate(${FOXM[0]} ${FOXM[1]})"><g style="transform-origin:0 0;${an({ n: 'foamgrow', d: 1.0, t: 0.2, f: 'both' })}">${foam(9, 22)}</g></g>`)}
  ${vis(3.4, 8.8, `<g transform="translate(${FOXM[0] - 18} ${FOXM[1] + 26})"><g style="transform-origin:0 -20px;${an({ n: 'foamgrow', d: 0.4, t: 3.4, f: 'both' })}">${foam(12, 40)}<g transform="translate(-6 62)">${foam(8, 22)}</g></g></g>`)}
  ${vis(0, 8.8, `<g transform="translate(${RABM[0]} ${RABM[1]})"><g style="transform-origin:0 0;${an({ n: 'foamgrow', d: 1.0, t: 0.4, f: 'both' })}">${foam(3, 8)}</g></g>`)}
  ${vis(0, 3.4, `<g transform="translate(${FOXM[0] + 20} ${FOXM[1]})"><g style="${an({ n: 'scrub', d: 0.12, t: 0, c: 28, dir: 'alternate' })}">${brush('#e8434e')}</g></g><g transform="translate(${RABM[0] - 22} ${RABM[1]}) scale(-1 1)"><g style="${an({ n: 'scrub', d: 0.12, t: 0.06, c: 28, dir: 'alternate' })}">${brush('#22a06b')}</g></g>`)}
  ${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(${560 + i * 30} 560)"><g style="${an({ n: 'bubbleup', d: 1.0, t: 8.4 + i * 0.12, f: 'both' })}"><circle r="${8 + (i % 2) * 5}" fill="#bfe6ff" stroke="#7cc8ff" stroke-width="2"/></g></g>`).join('')}`);
// chambre : debout en bonnets (9,5–17,5), Lino au réveil (17,5–21), au lit (21–30)
const capF = [[0, 99, nightcap('#3b82f6', true)]], capR = [[0, 99, nightcap('#ff8fb1')]];
const foxRoom = put(330, 700, 1.1, `<g style="${an({ n: 'giggle', d: 0.16, t: 15.6, c: 10, dir: 'alternate' })}">${fox({ run: null, upright: -10, noShadow: true, noBag: true, hat: capF,
  jumps: [[10.6, 11.0, 40], [14.0, 14.4, 30]], jolt: [13.4, 16.0],
  talk: [[19.6, 20.6]], eyes: [[9.6, 11.4, 'arc'], [13.4, 13.9, 'spiral'], [14.0, 17.5, 'arc'], [17.6, 21.0, 'side']], moods: [[9.6, 17.5, 'happy'], [19.6, 21, 'happy']] })}</g>`);
const rabRoom = put(830, 700, 1.08, `<g style="${an({ n: 'giggle', d: 0.16, t: 15.6, c: 10, dir: 'alternate' })}">${rabbit({ run: null, noBag: true, noShadow: true, hat: capR,
  jumps: [[10.6, 11.0, 40], [11.2, 11.55, 40]], jolt: [14.5, 16.2],
  talk: [[9.8, 10.9]], eyes: [[9.6, 11.4, 'arc'], [14.6, 15.1, 'spiral'], [15.2, 17.5, 'arc']], moods: [[9.6, 17.5, 'happy']] })}</g>`, true);
const rabClock = put(840, 700, 1.08, rabbit({ run: null, noBag: true, noShadow: true, hat: capR, talk: [[18.0, 19.4]], gest: [[18.0, 19.4]], eyes: [[17.6, 21, 'side']], moods: [[18.0, 21, 'happy']] }), true);
const foxBed = put(330, 668, 1.0, fox({ run: null, upright: -6, noShadow: true, noBag: true, hat: capF, eyes: [[21.0, 23.0, 'arc'], [23.0, 30, 'down']], moods: [[21, 30, 'happy']] }));
const rabBed = put(860, 640, 1.0, rabbit({ run: null, noBag: true, noShadow: true, hat: capR, talk: [[22.6, 23.6]], eyes: [[21.0, 22.5, 'arc'], [22.5, 30, 'side']], moods: [[21, 30, 'happy']] }), true);
// oreillers qui volent
const pillow = `<g transform="scale(1.6)"><rect x="-40" y="-24" width="80" height="48" rx="20" fill="#fff6c8" stroke="${INK}" stroke-width="4"/><path d="M-28 -10 q28 10 56 0" stroke="#d7e3ff" stroke-width="4" fill="none"/></g>`;
const armsBehind = [];
const throwP = (t0, from, to, sh, fur) => (armsBehind.push(vis(t0 - 0.35, t0, armTo(sh[0], sh[1], from[0], from[1] - 120, fur))), '') + vis(t0 - 0.35, t0, `<g transform="translate(${from[0]} ${from[1] - 150}) rotate(-10)">${pillow}</g>`) + vis(t0, t0 + 0.42, track(pillow, t0, t0 + 0.4, (t, u) => ({ x: lerp(from[0], to[0], u), y: lerp(from[1] - 150, to[1], u) - 120 * Math.sin(Math.PI * u), r: 20 * u, s: 1 })));
const pouf = (t, x, y) => vis(t, t + 1.4, `<g transform="translate(${x} ${y})"><g style="transform-origin:0 0;${an({ n: 'poufk', d: 0.5, t, f: 'both' })}"><path d="M0 -46 L10 -16 L42 -26 L20 0 L42 26 L10 16 L0 46 L-10 16 L-42 26 L-20 0 L-42 -26 L-10 -16Z" fill="#fff" stroke="${INK}" stroke-width="3"/></g>${Array.from({ length: 12 }, (_, i) => `<g style="--dx:${(i - 6) * 22}px;${an({ n: 'feather', d: 1.3, t: t + i * 0.03, f: 'both' })}"><ellipse rx="14" ry="6" fill="#fff" stroke="${INK}" stroke-width="2" transform="rotate(${i * 40})"/></g>`).join('')}</g>`);
const SHF = [368, 548], SHR = [792, 540];
const fight = throwP(13.0, [790, 520], [400, 470], SHR, '#f1eff7') + pouf(13.4, 400, 410) + throwP(14.1, [430, 520], [810, 470], SHF, '#f28a1e') + pouf(14.5, 805, 400) + throwP(15.4, [790, 520], [400, 470], SHR, '#f1eff7') + pouf(15.8, 410, 410);

const darkness = vis(24.15, 99, `<rect width="${W}" height="${H}" fill="#0b0f2a" style="${an({ n: 'darkin', d: 0.25, t: 24.15, f: 'both' })}"/>`);
const eyePair = (x, y, t0) => `<g transform="translate(${x} ${y})"><g style="transform-origin:0 0;${an({ n: 'blinkeye', d: 2.2, t: t0, c: 3 })}">${[-16, 16].map((dx) => `<ellipse cx="${dx}" cy="0" rx="11" ry="14" fill="#fff"/><circle cx="${dx + 3}" cy="2" r="6" fill="#0b0f2a"/>`).join('')}</g></g>`;
const eyes = vis(24.6, 99, `<g transform="translate(387 435) scale(2)">${eyePair(0, 0, 24.6)}</g><g transform="translate(900 415) scale(2)">${eyePair(0, 0, 25.1)}</g>`);

const brushArms = vis(0, 3.4, armTo(480, 590, FOXM[0] - 4, FOXM[1] + 6, '#f28a1e') + armTo(830, 610, RABM[0] + 6, RABM[1] + 8, '#f1eff7'));
const mirrorRefl = vis(6.5, 9.5, `<defs><clipPath id="mir"><rect x="400" y="110" width="480" height="210" rx="30"/></clipPath></defs><g clip-path="url(#mir)" opacity=".85">${put(440, 380, 0.75, fox({ run: null, upright: -10, noShadow: true, moods: [[0, 99, 'happy']] }))}<g transform="translate(518 284)">${vis(0, 8.8, foam(10, 24))}</g>${put(840, 380, 0.7, rabbit({ run: null, noBag: true, noShadow: true, moods: [[0, 99, 'happy']] }), true)}<g transform="translate(788 302)">${vis(0, 8.8, foam(7, 12))}</g></g>`);

const world = `${vis(0, 9.5, bath + mirrorRefl + foxBath + rabBath + bathFx + brushArms)}
  ${vis(9.5, 99, room + bedBack + mattress + night)}
  ${vis(9.5, 17.5, armsBehind.join('') + foxRoom + rabRoom + fight)}${vis(17.5, 21.0, rabClock + put(330, 700, 1.1, fox({ run: null, upright: -10, noShadow: true, noBag: true, hat: capF, talk: [[19.6, 20.6]], eyes: [[17.5, 21, 'side']], moods: [[17.5, 21, 'happy']] })))}
  ${vis(21.0, 99, foxBed + blanket(110, 580, 360, '#7cc8ff') + rabBed + blanket(BED.x + 26, BED.y + 40, BED.w - 52, '#ff8fb1'))}`;

const fx =
  say('rab', 'On se brosse les dents !', 0.6, 1.8, { bx: 900, by: 170, tips: [[760, 330]] }) +
  sfx('Brosse brosse !', 560, 120, 0.8, 2.4, -6, '#7cc8ff', 52, 'brush') +
  say('rab', 'Une barbe !', 4.2, 1.5, { bx: 900, by: 140, tips: [[1000, 300]] }) +
  say('fox', 'Je suis Papi Roussin !', 6.8, 1.5, { bx: 350, by: 275, tips: [[520, 455]], shout: true }) +
  sfx('GLOU GLOU', 640, 320, 8.6, 0.75, 6, '#1e8fe0', 50, 'splash') +
  say('rab', 'En pyjama !', 9.8, 1.2, { bx: 960, by: 160, tips: [[880, 300]], shout: true }) +
  sfx('POUF !', 520, 300, 13.4, 0.6, -10, '#fff', 70, 'poof') + sfx('POUF !', 800, 290, 14.6, 0.6, 10, '#fff', 70, 'poof') + sfx('POUF POUF !', 640, 120, 16.0, 0.9, -6, '#fff', 66, 'poof') +
  sfx('rires !', 1010, 130, 16.5, 0.85, 4, '#ffd23f', 56, 'laugh') +
  say('rab', 'Réveil à sept heures !', 18.0, 1.5, { bx: 900, by: 120, tips: [[1010, 330]] }) +
  say('fox', 'Comme ce matin !', 19.6, 1.1, { bx: 330, by: 230, tips: [[280, 390]] }) +
  say('rab', 'On éteint ?', 22.6, 1.0, { bx: 900, by: 250, tips: [[860, 350]] }) +
  sfx('CLIC', 560, 230, 24.0, 0.5, 0, '#ffd23f', 54, 'click') +
  sfx('rires...', 620, 330, 25.6, 1.8, -4, '#ffffff', 36, 'laugh') +
  card(27.6, 'Préparer le dodo !', 'Dodo, le dernier', 640, 150);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#5f6fb8"/>
<g style="${camStyle}">${world}</g>
${darkness}${eyes}
${timeBadge(20, 0)}
${fx}
</svg>`;
sfxEv.push({ name: 'whoosh', t: 13.0 }, { name: 'whoosh', t: 14.2 }, { name: 'whoosh', t: 15.6 }, { name: 'click', t: 18.6 }, { name: 'chime', t: 19.3 });
writeFileSync(new URL('./preparer-le-dodo.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 92, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
