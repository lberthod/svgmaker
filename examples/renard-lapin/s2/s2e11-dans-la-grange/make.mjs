// Roussin & Lino · Saison 2 · Épisode 11 « Dans la grange » — 30 s, 1280x720. 15h15, l'intérieur de la grange, sans lumière.
// Gag : une ombre géante et piquante avance sur le mur et terrorise tout le monde : c'est l'ombre de Piquette.
//       Elle se roule en boule, rebondit jusqu'à la lanterne et l'allume d'un coup de piquants.
//
//  0.0– 3.2  plan large     noir ; Roussin : « Il fait tout noir... »
//  3.2– 6.0  le mur         l'ombre apparaît ; Lino : « Un monstre ! »
//  6.0– 8.8  Roussin+Lino   « Il a des piquants ! »
//  8.8–11.5  Papi Bernard   « Piquette, allume la lanterne ! »
// 11.5–14.5  Piquette       « Moi ? D'accord, j'y vais ! »
// 14.5–17.0  la grange      elle marche vers la lanterne, l'ombre aussi ; « Le monstre avance ! »
// 17.0–19.6  sous la lampe  « Un, deux... trois ! » : boule, rebond, TCHING, lumière
// 19.6–22.5  plan large     « C'était ton ombre ! » / « Même pas peur ! »
// 22.5–25.2  Papi Bernard   « Bravo, Piquette ! »
// 25.2–30.0  plan large     Roussin : « Moi, j'avais pas peur ! » ; carton
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, ao, vis, sfx, fox, rabbit, put, style, addKF, track } from '../../lib/kit.mjs';
import { makeCam, say, card } from '../../lib/props.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { hedgehog, badger } from '../../lib/cast2.mjs';
import { barnInside, barnDarkness } from '../../lib/farm.mjs';

const DUR = 30, S = 0.85, LIT = 19.3;
const SHOTS = [
  [0, 3.2, 640, 400, 1.0, 1.04],
  [3.2, 6.0, 520, 330, 1.35, 1.4],
  [6.0, 8.8, 450, 500, 2.0, 2.05],
  [8.8, 11.5, 840, 480, 1.5, 1.75],
  [11.5, 14.5, 660, 480, 2.1, 2.15],
  [14.5, 17.0, 760, 460, 1.4, 1.45],
  [17.0, 19.6, 880, 410, 1.45, 1.5],
  [19.6, 22.5, 700, 420, 1.15, 1.2],
  [22.5, 25.2, 950, 470, 1.7, 1.75],
  [25.2, 30, 640, 400, 1.05, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
const lerp = (a, b, u) => a + (b - a) * u;
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


const Y = 640;
const pFox = mkPath([[0, 380, Y], [30, 380, Y]]);
const pRab = mkPath([[0, 520, Y], [30, 520, Y]]);
const pBad = mkPath([[0, 1010, Y], [30, 1010, Y]]);
const pHed = mkPath([[0, 660, Y], [14.5, 660, Y], [17.0, 880, Y], [18.7, 880, Y], [19.15, 880, 275], [19.6, 880, Y]], 6);

const J = [3.4, 4.1];
const foxEl = pFox.wrap(put(0, 0, S, jolt(fox({ upright: -6, talk: [[0.5, 2.4], [15.0, 16.4], [25.4, 27.0]], eyes: [[0, 19.4, 'wide'], [19.4, 25.2, 'side']], moods: [[0, 19.4, 'panic'], [19.4, 22, 'oh'], [24.5, 30, 'happy']] }), ...J)));
const rabEl = pRab.wrap(put(0, 0, S, jolt(rabbit({ talk: [[4.0, 5.3], [19.9, 21.4]], eyes: [[0, 19.4, 'wide'], [19.9, 21.6, 'arc']], moods: [[0, 19.4, 'panic'], [19.9, 21.6, 'happy']] }), ...J)));
const badEl = pBad.wrap(put(0, 0, S, badger([[9.0, 10.9], [23.3, 24.8]], { point: [[9.4, 11.0]], eyes: [[3.4, 8.0, 'wide'], [23.3, 24.8, 'arc']], moods: [[3.4, 8.0, 'oh'], [23.3, 24.8, 'happy']] })));
const hedEl = pHed.wrap(put(0, 0, S, hedgehog([[11.8, 13.6], [17.2, 18.6], [21.6, 23.2]], { ball: [[18.6, 19.5]],
  eyes: [[0, 11.5, 'wide'], [11.5, 14.5, 'wide'], [14.5, 17.0, 'side'], [17.0, 18.6, 'up'], [19.5, 21.5, 'wide'], [21.6, 23.2, 'arc']],
  moods: [[0, 11.5, 'panic'], [11.8, 14.5, 'shy'], [14.6, 17.0, 'calm'], [19.5, 21.5, 'oh'], [21.6, 23.2, 'happy']], blush: [[21.6, 23.2]] })));

// ombre géante de Piquette sur le mur du fond (silhouette sombre qui la suit)
const pSh = mkPath([[0, 660, 520], [14.5, 660, 520], [17.0, 880, 520], [19.3, 880, 520]]);
const shadow = vis(3.4, LIT, pSh.wrap(`<g style="filter:brightness(0);opacity:.55">${put(0, 0, 2.5, hedgehog([], { noShadow: true, ball: [] }))}</g>`));

const spark = vis(LIT, LIT + 0.7, `<g transform="translate(880 215)">${Array.from({ length: 8 }, (_, i) => `<g style="--dx:${Math.cos(i * 0.785) * 60}px;--dy:${Math.sin(i * 0.785) * 60}px;${an({ n: 'drop', d: 0.6, t: LIT, f: 'both' })}"><path d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3Z" fill="#fff36b" stroke="${INK}" stroke-width="2.5"/></g>`).join('')}</g>`);

const world = `${barnInside({ litAt: LIT })}${shadow}`;
const over = `${foxEl}${rabEl}${badEl}${hedEl}${spark}`;

const fx =
  sayOf('fox', 'fox', pFox, 'Il fait tout noir...', 0.5, 1.9) +
  sfx('WHOUUU...', 880, 230, 3.4, 1.6, -4, '#c7b8ff', 70, 'whoosh') +
  sayOf('rab', 'rab', pRab, 'Un monstre !', 4.0, 1.3, { shout: true, by: 20 }) +
  sayOf('fox', 'fox', pFox, 'Il a des piquants !', 6.3, 1.7) +
  sayOf('badger', 'badger', pBad, 'Piquette, allume la lanterne !', 9.0, 1.9) +
  sayOf('hedge', 'hedge', pHed, "Moi ? D'accord, j'y vais !", 11.8, 1.8) +
  sayOf('fox', 'fox', pFox, 'Le monstre avance !', 15.0, 1.4, { shout: true }) +
  sayOf('hedge', 'hedge', pHed, 'Un, deux... trois !', 17.2, 1.4, { by: -10 }) +
  sfx('TCHING !', 640, 150, LIT, 1.2, -6, '#fff36b', 100, 'clink') +
  sayOf('rab', 'rab', pRab, "C'était ton ombre !", 19.9, 1.5, { shout: true }) +
  sayOf('hedge', 'hedge', pHed, 'Même pas peur !', 21.6, 1.6, { by: 20, bx: -110 }) +
  sayOf('badger', 'badger', pBad, 'Bravo, Piquette !', 23.3, 1.5) +
  sayOf('fox', 'fox', pFox, "Moi, j'avais pas peur !", 25.4, 1.7) +
  card(27.3, "Saison 2 — Dans la grange", 'la tarte');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#a8743f"/>
<g style="${camStyle}">${world}${over}${barnDarkness(LIT, 0.55)}</g>
${timeBadge(15, 15)}
${fx}
</svg>`;
sfxEv.push({ name: 'whoosh', t: 3.4 }, { name: 'click', t: 18.9 }, { name: 'poof', t: 19.6 }, { name: 'laugh', t: 22.0 }, { name: 'chime', t: 27.3 });
writeFileSync(new URL('./dans-la-grange.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 84, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
