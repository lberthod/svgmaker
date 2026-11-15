// Roussin & Lino · Saison 2 · Épisode 10 « L'orage » — 30 s, 1280x720. 14h30, le pré devant la grange.
// Gag : Piquette, morte de peur, se roule en boule et traverse le groupe comme une boule de bowling jusqu'à la grange.
//
//  0.0– 3.2  plan large     Mme Chouette : « Quel ciel noir ! »
//  3.2– 5.4  le ciel        éclair, BOUM, tout le monde sursaute ; Lino : « Un orage ! »
//  5.4– 8.2  Roussin+Lino   Roussin protège son croissant
//  8.2–10.8  Papi Bernard   « Tous à la grange ! »
// 10.8–13.2  Piquette       éclair, « J'ai trop peur ! », elle se roule en boule
// 13.2–15.4  le pré         la boule traverse le groupe (tous sautent), « Elle roule ! »
// 15.4–17.9  la grange      les portes s'ouvrent, tout le monde court à l'abri
// 17.9–21.6  l'entrée       Piquette ressort : « Bravo ! » / « C'était rigolo ! »
// 21.6–25.2  l'entrée       Mme Chouette compte tout le monde ; le croissant est au sec
// 25.2–30.0  plan large     carton de fin
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, ao, vis, sfx, fox, rabbit, owl, put, style, addKF, track } from '../../lib/kit.mjs';
import { makeCam, say, card, croissant } from '../../lib/props.mjs';
import { hedgehog, badger } from '../../lib/cast2.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { stormSky, flash, barn, meadow, hills, fence, GROUND } from '../../lib/farm.mjs';

const DUR = 30, S = 0.7;
const SHOTS = [
  [0, 3.2, 430, 430, 1.5, 1.55],
  [3.2, 5.4, 500, 450, 1.45, 1.5],
  [5.4, 8.2, 480, 470, 1.9, 1.95],
  [8.2, 10.8, 820, 450, 1.6, 1.65],
  [10.8, 13.2, 330, 480, 2.1, 2.15],
  [13.2, 14.3, 400, 480, 1.5, 1.5],
  [14.3, 15.4, 700, 480, 1.5, 1.5],
  [15.4, 17.9, 900, 480, 1.4, 1.45],
  [17.9, 21.6, 1010, 450, 2.0, 2.05],
  [21.6, 25.2, 1000, 470, 1.55, 1.6],
  [25.2, 30, 640, 400, 1.05, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
const lerp = (a, b, u) => a + (b - a) * u;
const FLASHES = [3.4, 11.0, 25.6];

// trajet : pts = [[t,x,y],…] ; wrap(inner) translate (et rebondit en marchant)
const mkPath = (pts, bob = 0) => {
  const at = (t) => {
    if (t <= pts[0][0]) return [pts[0][1], pts[0][2]];
    for (let i = 0; i < pts.length - 1; i++) { const [a, xa, ya] = pts[i], [b, xb, yb] = pts[i + 1]; if (t < b) { const u = (t - a) / (b - a); return [lerp(xa, xb, u), lerp(ya, yb, u)]; } }
    return [pts.at(-1)[1], pts.at(-1)[2]];
  };
  const still = pts.every((p) => p[1] === pts[0][1] && p[2] === pts[0][2]);
  const wrap = (inner) => {
    if (still) return `<g transform="translate(${pts[0][1]} ${pts[0][2]})">${inner}</g>`;
    return track(inner, pts[0][0], pts.at(-1)[0], (t) => { const [x, y] = at(t), [x2] = at(t + 0.05); return { x, y: y - (Math.abs(x2 - x) > 0.3 ? bob * Math.abs(Math.sin(t * 13)) : 0) }; });
  };
  return { at, wrap };
};
const jolt = (inner, ...ts) => `<g style="animation:${ts.map((t) => ao({ n: 'jolt', d: 0.6, t })).join(',')}">${inner}</g>`;
const HEAD = { owl: 300, fox: 250, rab: 330, hedge: 215, badger: 290 };
const sayOf = (who, key, p, text, t0, dur, o = {}) => {
  const [x, y] = p.at(t0 + 0.1), m = scr(x + (o.dx || 0), y - HEAD[key] * S - 8, t0 + 0.1);
  return say(who, text, t0, dur, { bx: m[0] + (o.bx || 0), by: m[1] - 80 + (o.by || 0), tips: [m], shout: o.shout, fs: o.fs });
};

addKF(`@keyframes fwob{from{transform:rotate(-3deg)}to{transform:rotate(3deg)}}`);

// ───────── chemins ─────────
const Y = { owl: 612, fox: 630, rab: 645, hedge: 640, badger: 618 };
const pOwl = mkPath([[0, 110, Y.owl], [16.0, 110, Y.owl], [18.2, 770, Y.owl]], 8);
const pFox = mkPath([[0, 470, Y.fox], [16.0, 470, Y.fox], [18.2, 880, Y.fox]], 10);
const pRab = mkPath([[0, 650, Y.rab], [16.0, 650, Y.rab], [18.2, 1090, Y.rab]], 10);
const pBad = mkPath([[0, 830, Y.badger], [16.0, 830, Y.badger], [18.3, 1195, Y.badger]], 8);
const pHed = mkPath([[0, 290, Y.hedge], [12.9, 290, Y.hedge], [16.9, 990, Y.hedge]], 0);

// ───────── décor ─────────
const rain2 = `<g style="animation:frain .4s linear infinite" opacity=".4">${Array.from({ length: 36 }, (_, i) => `<path d="M${(i * 47 + 20) % 1400 - 60} ${(i * 71) % 760 - 60} l-14 36" stroke="#dff3ff" stroke-width="4" stroke-linecap="round"/>`).join('')}</g>`;
const world = `${stormSky({ flashes: FLASHES })}${fence(0, W, GROUND - 6)}${meadow('dark')}
  ${barn(1000, 590, 1.25, { open: 16.6 })}`;

// ───────── acteurs ─────────
const owlEl = pOwl.wrap(put(0, 0, S, jolt(owl([[0.4, 1.9], [21.8, 23.5]], { happyAt: 99, watchAt: null, point: [], wave: [] }), 3.4, 11.0)));
const foxEl = pFox.wrap(put(0, 0, S, jolt(fox({ jumps: [[13.75, 14.3, 110]], run: [16.0, 18.2], upright: -8, overHead: vis(5.3, 17.8, `<g transform="translate(95 -255) scale(1.2)">${croissant}</g>`),
  talk: [[5.7, 7.3], [23.5, 25.2]], eyes: [[3.4, 5.3, 'wide'], [5.3, 8.2, 'side'], [13.3, 15.4, 'wide'], [23.3, 25.4, 'arc']],
  moods: [[3.4, 8.2, 'panic'], [13.3, 15.4, 'oh'], [23.3, 25.4, 'happy']] }), 3.4, 11.0)));
const rabEl = pRab.wrap(put(0, 0, S, jolt(rabbit({ jumps: [[14.85, 15.4, 110]], run: [16.0, 18.2], noBag: false, talk: [[3.9, 5.3], [13.5, 14.6], [18.5, 19.8]], eyes: [[3.4, 5.4, 'wide'], [13.3, 15.4, 'wide'], [18.3, 20.0, 'arc']],
  moods: [[3.4, 5.4, 'panic'], [13.3, 15.4, 'oh'], [18.3, 20.0, 'happy']] }), 3.4, 11.0)));
const badEl = pBad.wrap(put(0, 0, S, jolt(badger([[9.0, 10.6]], {  point: [[8.4, 10.7]], eyes: [[3.4, 5.4, 'wide'], [11.0, 12.5, 'wide']], moods: [[3.4, 5.4, 'oh'], [8.4, 10.7, 'calm']] }), 3.4, 11.0)));
const hedEl = pHed.wrap(put(0, 0, S, hedgehog([[11.2, 12.7], [20.0, 21.6]], { ball: [[12.9, 17.2]], spikes: [[3.4, 5.0], [11.0, 12.7]],
  eyes: [[3.2, 5.4, 'wide'], [10.8, 12.8, 'wide'], [17.2, 19.8, 'wide'], [19.9, 21.6, 'arc']], moods: [[3.2, 5.4, 'panic'], [10.8, 12.8, 'panic'], [17.2, 19.8, 'oh'], [19.9, 21.6, 'happy']], blush: [[19.9, 21.6]], jolt: [3.4, 11.0] })));

const dust = (t, x, y) => vis(t, t + 1, Array.from({ length: 6 }, (_, i) => `<g transform="translate(${x + (i - 2.5) * 22} ${y})"><g style="--dx:${(i - 2.5) * 16}px;--dy:${-30 - (i % 3) * 14}px;${an({ n: 'drop', d: 0.8, t, f: 'both' })}"><circle r="${12 + (i % 3) * 5}" fill="#e9dcc0" stroke="${INK}" stroke-width="3"/></g></g>`).join(''));

const actors = `${owlEl}${foxEl}${rabEl}${badEl}${hedEl}${dust(16.9, 990, 640)}`;


// ───────── bulles et bruitages (espace écran) ─────────
const fx =
  sayOf('owl', 'owl', pOwl, 'Quel ciel noir !', 0.4, 1.5) +
  sfx('BOUM !', 640, 200, 3.4, 1.4, -6, '#ffe14a', 120, 'crack') +
  sayOf('rab', 'rab', pRab, 'Un orage !', 4.0, 1.3, { shout: true, by: 40 }) +
  sayOf('fox', 'fox', pFox, 'Pas mon croissant !', 5.7, 1.6) +
  sayOf('badger', 'badger', pBad, 'Tous à la grange !', 9.0, 1.6, { bx: -60 }) +
  sfx('CRAAAC !', 330, 175, 11.0, 1.2, 5, '#ffe14a', 100, 'crack') +
  sayOf('hedge', 'hedge', pHed, "J'ai trop peur !", 11.5, 1.2, { bx: 60 }) +
  sfx('FROUUU...', 640, 250, 13.3, 1.8, -4, '#ffffff', 70, 'whoosh') +
  sayOf('rab', 'rab', pRab, 'Elle roule !', 13.6, 1.1, { shout: true, by: -30 }) +
  sfx('BONG !', 640, 300, 16.7, 1.2, -6, '#ffd23f', 100, 'door') +
  sayOf('rab', 'rab', pRab, 'Bravo Piquette !', 18.5, 1.4, { shout: true }) +
  sayOf('hedge', 'hedge', pHed, 'Je roule très vite !', 20.0, 1.6, { by: 10 }) +
  sayOf('owl', 'owl', pOwl, 'Tout le monde est au sec ?', 21.8, 1.7, { bx: -40 }) +
  sayOf('fox', 'fox', pFox, 'Mon croissant est au sec !', 23.5, 1.7, { bx: -40, by: 20 }) +
  card(27.2, 'Saison 2 — L\'orage', 'dans la grange') +
  flash(FLASHES);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#3d4257"/>
<g style="${camStyle}">${world}${actors}</g>
${rain2}
${timeBadge(14, 30)}
${fx}
</svg>`;
sfxEv.push({ name: 'whoosh', t: 13.0 }, { name: 'skid', t: 16.4 }, { name: 'poof', t: 16.9 }, { name: 'laugh', t: 20.3 }, { name: 'chime', t: 27.2 });
writeFileSync(new URL('./l-orage.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 90, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
