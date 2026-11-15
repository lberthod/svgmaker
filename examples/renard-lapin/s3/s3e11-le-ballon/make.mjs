// Roussin & Lino · Saison 3 · Épisode 11 « Le ballon » — 30 s, 1280x720. 15h30, la plage.
//
// Découpage :
//  0.0– 3.2  plan large     jeu de ballon ; Roussin lance : « Piquette ! Attrape ! » ; pastille 15 h 30
//  3.2–10.5  Piquette       elle recule (« Non ! Mes piquants ! »), le ballon file chez Lino ; Lino le relance : POP sur ses piquants
//  10.5–14.3 plan large     confettis de sable ; « Oh non... pardon ! » — « Pas grave, Piquette ! »
//  14.3–18.2 Marinette      jaillit de l'eau : « Un ballon spécial ! » (un ballon-hérisson, qui roule tout seul vers Piquette)
//  18.2–22.5 Piquette       le ballon-hérisson se blottit contre elle : « Il me ressemble ! » — « Il t'adore ! »
//  22.5–27.0 plan large     elle jongle avec le ballon sur la tête : « Hihi ! Je joue ! » — « Bravo, Piquette ! »
//  27.0–30.0 plan large     carton « Saison 3 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog } from '../../lib/cast2.mjs';
import { splash } from '../../lib/farm.mjs';
import { otter } from '../../lib/cast3.mjs';
import { seaBg, beachBall, parasol, bucket, spade, towel } from '../../lib/sea.mjs';
import { timeBadge } from '../../lib/badge.mjs';

const say = (w, tx, a, d, o = {}) => say0(w, tx, a, d, { fs: o.shout ? 50 : 41, ...o });
const DUR = 30;
const SHOTS = [
  [0, 3.2, 640, 400, 1.0, 1.04],
  [3.2, 10.5, 800, 450, 1.5, 1.52],
  [10.5, 14.3, 640, 400, 1.0, 1.04],
  [14.3, 18.2, 430, 440, 1.6, 1.6],
  [18.2, 22.5, 740, 450, 1.5, 1.5],
  [22.5, 27.0, 640, 400, 1.0, 1.06],
  [27.0, 30, 640, 400, 1.06, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes confd{0%{opacity:1;transform:translate(0,0) rotate(0)}40%{opacity:1;transform:translate(calc(var(--dx)*.6),var(--dy0)) rotate(120deg)}100%{opacity:0;transform:translate(var(--dx),var(--dy1)) rotate(300deg)}}`);

const lerp = (a, b, u) => a + (b - a) * u;
// trajet par segments {a,b,x0,y0,x1,y1,h (arc), hops (rebonds)} ; hors segment : le ballon garde sa dernière position
const flight = (inner, segs, t0 = segs[0].a, t1 = segs[segs.length - 1].b) => {
  const fn = (t) => {
    let g = segs[0];
    for (const s of segs) if (t >= s.a) g = s;
    const u = Math.min(1, Math.max(0, (t - g.a) / (g.b - g.a)));
    const hop = g.hops ? Math.abs(Math.sin(u * Math.PI * g.hops)) * (g.hopH || 30) : 0;
    return { x: lerp(g.x0, g.x1, u), y: lerp(g.y0, g.y1, u) - 4 * (g.h || 0) * u * (1 - u) - hop, r: lerp(g.r0 || 0, g.r1 || 0, u), s: 1 };
  };
  return vis(t0, t1, track(inner, t0, t1, fn, 30));
};
const walker = (inner, t0, t1, x0, x1, y, amp = 8) => vis(t0, 99, track(inner, t0, 30, (t) => {
  const u = Math.min(1, Math.max(0, (t - t0) / (t1 - t0)));
  return { x: lerp(x0, x1, ss(u)), y: y - (u > 0 && u < 1 ? Math.abs(Math.sin(u * Math.PI * 4)) * amp : 0), r: 0, s: 1 };
}, 30));

// ───────── décor ─────────
const GY = 600, S = 0.85;
const FX = 200, MX = 470, HX = 710, RX = 1040;
const bg = `${seaBg('day', {})}${parasol(1180, 600, 0.9, { col: '#e8434e' })}${towel(1180, 632, 0.7, '#7cc8ff')}${bucket(1130, 640, 0.8, {})}${spade(1100, 650, 0.8, 12)}`;

const foxEl = put(FX, GY, S, fox({ run: null, upright: -4, noShadow: true,
  talk: [[0.7, 2.2], [12.7, 14.0]], point: [[0.8, 2.0]],
  eyes: [[0, 3.0, 'arc'], [9.4, 12.4, 'wide'], [12.6, 14.2, 'arc'], [22.4, 27.0, 'arc']],
  moods: [[0, 3.0, 'happy'], [9.4, 12.4, 'oh'], [12.6, 14.2, 'happy'], [22.4, 30, 'happy']] }));
const rabEl = put(RX, GY, S, rabbit({ run: null, noShadow: true,
  talk: [[7.6, 8.9], [25.2, 26.6]], raise: [[7.9, 9.3]],
  eyes: [[0, 7.4, 'arc'], [9.4, 12.4, 'wide'], [17.0, 21.0, 'wide'], [22.4, 30, 'arc']],
  moods: [[0, 7.4, 'happy'], [9.4, 12.4, 'oh'], [22.4, 30, 'happy']] }), true);
const hedgeEl = put(HX, GY + 4, S, hedgehog([[4.2, 5.8], [11.1, 12.6], [20.0, 21.4], [23.5, 24.9]], { noShadow: true,
  eyes: [[0, 3.2, 'wide'], [3.2, 5.9, 'wide'], [9.4, 14.2, 'down'], [17.8, 19.6, 'wide'], [19.6, 22.0, 'arc'], [22.0, 30, 'arc']],
  moods: [[0, 3.2, 'shy'], [3.2, 5.9, 'oh'], [9.4, 14.2, 'sad'], [17.8, 19.6, 'oh'], [19.6, 30, 'happy']], blush: [[19.6, 22.0]], jolt: [3.3, 17.9, 19.6] }), true);
const mariEl = (() => {
  const body = put(0, 0, S, otter([[15.2, 16.6], [21.4, 22.6]], { noShadow: true,
    whistle: [[14.7, 15.3], [21.3, 21.8], [25.0, 25.5]], point: [[15.6, 16.6]],
    eyes: [[14.6, 30, 'arc']], moods: [[14.6, 30, 'happy']] }));
  return vis(14.5, 99, track(body, 14.5, 15.3, (t) => {
    const u = Math.min(1, Math.max(0, (t - 14.5) / 0.7));
    return { x: MX, y: 520 + 80 * ss(u) - 140 * 4 * u * (1 - u) * 0.9, r: 0, s: 1 };
  }, 30)) + vis(15.3, 99, `<g transform="translate(${MX} ${GY + 4})">${body}</g>`);
})();
const confetti = (x, y, t0) => vis(t0, t0 + 1.6, `<g transform="translate(${x} ${y})">${Array.from({ length: 22 }, (_, i) => {
  const a = (i / 22) * Math.PI * 2, d = 70 + (i % 5) * 18, col = ['#f3e1b0', '#e9c97a', '#ffffff', '#ffd23f', '#e8434e', '#3b82f6'][i % 6];
  return `<g style="--dx:${(Math.cos(a) * d).toFixed(0)}px;--dy0:${(Math.sin(a) * d - 40).toFixed(0)}px;--dy1:${(Math.sin(a) * d + 90).toFixed(0)}px;${an({ n: 'confd', d: 1.4, t: t0, f: 'both', e: 'ease-out' })}"><rect x="-6" y="-4" width="12" height="8" rx="2" fill="${col}" stroke="${INK}" stroke-width="2"/></g>`;
}).join('')}</g>`);

// ───────── les ballons ─────────
const ball = (spin) => beachBall(0, 0, 0.8, { spin });
const spiky = (spin) => beachBall(0, 0, 0.8, { hedgehog: true, spin });
const b1 = flight(ball([[1.2, 6.6]]), [
  { a: 0.3, b: 1.2, x0: 330, y0: 430, x1: 330, y1: 430 },
  { a: 1.2, b: 3.3, x0: 330, y0: 430, x1: 640, y1: 440, h: 130 },
  { a: 3.3, b: 4.3, x0: 640, y0: 440, x1: 790, y1: 580, h: 40 },
  { a: 4.3, b: 6.6, x0: 790, y0: 580, x1: 930, y1: 578, h: 0, hops: 2, hopH: 18 },
  { a: 6.6, b: 7.7, x0: 930, y0: 578, x1: 985, y1: 500, h: 20 },
  { a: 7.7, b: 8.0, x0: 985, y0: 500, x1: 985, y1: 480 },
  { a: 8.0, b: 9.5, x0: 985, y0: 480, x1: 762, y1: 500, h: 120 },
], 0.3, 9.5);
const b2 = flight(spiky([[16.9, 19.6]]), [
  { a: 14.9, b: 16.9, x0: 540, y0: 585, x1: 540, y1: 585 },
  { a: 16.9, b: 19.6, x0: 540, y0: 585, x1: 628, y1: 580, h: 0, hops: 4, hopH: 40 },
  { a: 19.6, b: 22.8, x0: 628, y0: 580, x1: 628, y1: 580 },
  { a: 22.8, b: 23.4, x0: 628, y0: 580, x1: 702, y1: 470, h: 60 },
], 14.9, 23.4);
const juggle = [];
{ let t = 23.4, y = 470; for (let i = 0; i < 6; i++) { juggle.push({ a: t, b: t + 0.4, x0: 702, y0: y, x1: 702, y1: 330, h: 0 }); juggle.push({ a: t + 0.4, b: t + 0.8, x0: 702, y0: 330, x1: 702, y1: 470 }); t += 0.8; } }
const b3 = flight(spiky([[23.4, 28.2]]), juggle, 23.4, 28.2);
const pop = vis(9.5, 9.6, '') + confetti(762, 500, 9.5);

const world = `${bg}${foxEl}${hedgeEl}${rabEl}${mariEl}${b1}${b2}${b3}${splash(MX, 520, 14.5, 1.1, 10)}${pop}`;

// ───────── espace écran ─────────
const tip = (m, t, dx = 0, dy = 0) => { const p = scr(m[0], m[1], t); return [p[0] + dx, p[1] + dy]; };
const FM = [FX + 30, GY - 250 * S], MM = [MX + 50 * S, GY - 215 * S], HM = [HX - 10, GY - 150 * S], RM = [RX - 20, GY - 250 * S];
const hud = timeBadge(15, 30);
const endCard = `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.3, t: 26.9, f: 'both' })}"><g transform="translate(640 150)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:44px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 3</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">Le ballon</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">Prochain épisode : la grotte</text></g></g>`;
const fx = hud +
  say('fox', 'Piquette ! Attrape !', 0.7, 1.7, { bx: 330, by: 190, tips: [tip(FM, 0.7, 0, -6)] }) +
  say('hedge', 'Non ! Mes piquants !', 4.2, 1.8, { bx: 520, by: 150, tips: [tip(HM, 4.2, 0, -4)] }) +
  say('rab', 'Encore ! Essaie !', 7.6, 1.5, { bx: 900, by: 170, tips: [tip(RM, 7.6, 0, -6)] }) +
  sfx('POP !', 760, 270, 9.5, 1.0, -6, '#ffd23f', 100, 'crack') +
  say('hedge', 'Je suis désolée !', 11.1, 1.7, { bx: 700, by: 190, tips: [tip(HM, 11.1, 0, -4)] }) +
  say('fox', 'Pas grave, Piquette !', 12.7, 1.7, { bx: 380, by: 180, tips: [tip(FM, 12.7, 0, -6)] }) +
  sfx('PIIIT !', 880, 330, 14.8, 0.8, -6, '#ffd23f', 64, 'click') +
  say('otter', 'Voilà un ballon spécial !', 15.2, 1.8, { bx: 520, by: 150, tips: [tip(MM, 15.2, 0, -6)] }) +
  say('hedge', 'Il me ressemble !', 20.0, 1.6, { bx: 700, by: 150, tips: [tip(HM, 20.0, 0, -4)] }) +
  say('otter', 'Il t’adore !', 21.7, 1.2, { bx: 430, by: 190, tips: [tip(MM, 21.7, 0, -6)] }) +
  sfx('PIIIT !', 400, 330, 21.3, 0.7, -6, '#ffd23f', 60, 'click') +
  say('hedge', 'C’est rigolo ! Je joue !', 23.5, 1.5, { bx: 580, by: 150, tips: [tip(HM, 23.5, 0, -4)] }) +
  sfx('PIIIT !', 330, 300, 25.1, 0.7, -6, '#ffd23f', 58, 'click') +
  say('rab', 'Bravo, Piquette !', 25.2, 1.5, { bx: 880, by: 190, tips: [tip(RM, 25.2, 0, -6)] }) +
  endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#7cc8ff"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'wave', t: 0.2 }, { name: 'boing', t: 3.3 }, { name: 'poof', t: 9.55 }, { name: 'splash', t: 14.5 }, { name: 'chirp', t: 14.9 },
  { name: 'boing', t: 17.6 }, { name: 'boing', t: 19.6 }, { name: 'boing', t: 23.8 }, { name: 'laugh', t: 23.5 }, { name: 'chime', t: 26.9 });
writeFileSync(new URL('./ballon.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 118, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
