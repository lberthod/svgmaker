// Roussin & Lino · Saison 2 · Épisode 12 « La tarte » — 30 s, 1280x720. 16h00, la cuisine de la ferme.
// Gag : Roussin goûte la pâte en cachette (museau blanc), puis éternue de la farine sur toute la bande.
//
//  0.0– 3.5  plan large     Papi Bernard : « Aujourd'hui, tarte aux pommes ! »
//  3.5– 6.0  Lino           « Je lis la recette ! »
//  6.0– 9.0  la table       « Personne ne touche la pâte ! »
//  9.0–12.0  Roussin         il s'approche, « Juste un petit goût... », SLURP
// 12.0–15.0  la table       « Roussin ! » / « Mmm... délicieux ! »
// 15.0–18.5  le four        la tarte entre au four, « Au four, vingt minutes ! »
// 18.5–22.0  l'attente      16h20 ; la tarte gonfle ; « Ça sent bon ! »
// 22.0–25.0  le four        DING ! la tarte sort ; Roussin éternue : tous blancs de farine
// 25.0–30.0  plan large     « On dirait des fantômes ! » / « Bon appétit ! » ; carton
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, ao, vis, tf, sfx, fox, rabbit, put, style, addKF, track } from '../../lib/kit.mjs';
import { makeCam, say as say1, card } from '../../lib/props.mjs';
import { wallClock } from '../../lib/classroom.mjs';
import { hedgehog, badger } from '../../lib/cast2.mjs';
import { pie, apple } from '../../lib/farm.mjs';
import { timeBadge } from '../../lib/badge.mjs';

const DUR = 30, S = 0.8;
// les bulles ne recouvrent jamais le badge d'heure (zone 24..230 x 24..80)
const say = (who, text, t0, dur, o) => { const fs = o.fs || (o.shout ? 50 : 41), w = text.length * fs * 0.56 + 56, left = Math.max(o.bx, w / 2 + 16) - w / 2; return say1(who, text, t0, dur, left < 250 && o.by < 130 ? { ...o, by: 130 } : o); };
const SHOTS = [
  [0, 3.5, 640, 400, 1.0, 1.04],
  [3.5, 6.0, 470, 420, 1.8, 1.85],
  [6.0, 9.0, 600, 420, 1.5, 1.55],
  [9.0, 12.0, 800, 430, 2.0, 2.05],
  [12.0, 15.0, 700, 430, 1.55, 1.6],
  [15.0, 18.5, 900, 440, 1.5, 1.55],
  [18.5, 22.0, 850, 430, 1.4, 1.45],
  [22.0, 25.0, 900, 430, 1.5, 1.55],
  [25.0, 30, 640, 400, 1.05, 1.0],
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


const FY = 530; // sol derrière la table
const pBad = mkPath([[0, 400, FY], [15.0, 400, FY], [16.0, 990, FY]], 5);
const pRab = mkPath([[0, 520, FY], [18.0, 520, FY], [19.2, 700, FY]], 5);
const pHed = mkPath([[0, 640, FY], [18.0, 640, FY], [19.2, 790, FY]], 5);
const pFox = mkPath([[0, 720, FY], [9.6, 720, FY], [10.4, 790, FY], [18.0, 790, FY], [19.3, 880, FY]], 6);

const flourHat = `<g><ellipse cx="114" cy="-122" rx="24" ry="15" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="96" cy="-108" r="6" fill="#fff"/><circle cx="132" cy="-110" r="5" fill="#fff"/></g>`;
const badEl = pBad.wrap(put(0, 0, S, badger([[0.5, 2.9], [6.2, 7.8], [12.4, 13.4], [16.2, 17.8], [26.2, 27.2]], { point: [[6.2, 7.8]], eyes: [[6.2, 7.8, 'side'], [12.0, 13.6, 'wide'], [26.2, 27.2, 'arc']], moods: [[12.0, 13.6, 'oh'], [25.0, 27.4, 'happy']] })));
const rabEl = pRab.wrap(put(0, 0, S, rabbit({ talk: [[3.7, 5.3], [24.6, 26.1]], eyes: [[24.5, 26.2, 'arc']], moods: [[3.6, 5.4, 'happy'], [13.8, 15.0, 'happy'], [24.5, 26.2, 'happy']] })));
const hedEl = pHed.wrap(put(0, 0, S, hedgehog([[19.2, 20.6]], { eyes: [[18.5, 22.0, 'arc'], [22.0, 23.2, 'wide']], moods: [[18.5, 22.0, 'happy'], [23.2, 30, 'happy']], blush: [[19.2, 20.8]] })));
const foxEl = pFox.wrap(put(0, 0, S, fox({ upright: -8, talk: [[9.6, 11.2], [13.7, 15.2], [23.2, 24.1]], hat: [[11.5, 99, flourHat]],
  eyes: [[9.0, 11.2, 'side'], [11.2, 12.0, 'arc'], [13.5, 15.2, 'arc'], [18.5, 22.0, 'arc'], [23.0, 24.2, 'shut']], moods: [[9.0, 11.2, 'shy'], [11.2, 15.2, 'happy'], [23.0, 24.2, 'oh']], blush: [[13.5, 15.0]] })));

// ───────── décor : cuisine de ferme ─────────
const kitchen = `<rect width="${W}" height="${H}" fill="#ffe7c2"/>
  <rect y="360" width="${W}" height="150" fill="#fff4dc"/>${Array.from({ length: 22 }, (_, i) => `<rect x="${i * 60}" y="${360 + (i % 2) * 50}" width="60" height="50" fill="#f6cf8a" opacity=".55"/>`).join('')}
  <rect y="360" width="${W}" height="8" fill="${INK}" opacity=".25"/>
  <rect y="505" width="${W}" height="215" fill="#b9814a"/>${Array.from({ length: 5 }, (_, i) => `<line x1="0" y1="${540 + i * 40}" x2="${W}" y2="${540 + i * 40}" stroke="#9b6a3c" stroke-width="4"/>`).join('')}
  <g transform="translate(150 190)"><rect x="-100" y="-90" width="200" height="190" rx="10" fill="#cfeaff" stroke="${INK}" stroke-width="7"/><circle cx="50" cy="-40" r="26" fill="#ffd23f"/><path d="M-100 100 Q-30 20 40 80 Q70 50 100 100Z" fill="#8fd16e"/><rect x="-6" y="-90" width="12" height="190" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="-100" y="-10" width="200" height="12" fill="#fff" stroke="${INK}" stroke-width="4"/>
    <path d="M-110 -96 Q-70 -60 -20 -96 M110 -96 Q70 -60 20 -96" stroke="#e8434e" stroke-width="10" fill="none"/></g>
  <g transform="translate(450 150)"><rect x="-90" y="14" width="180" height="12" rx="4" fill="#a67a4e" stroke="${INK}" stroke-width="5"/>${[-60, -20, 24, 62].map((x, i) => `<rect x="${x - 14}" y="${-24 + (i % 2) * 6}" width="28" height="${38 - (i % 2) * 6}" rx="6" fill="${['#e8434e', '#3b82f6', '#ffd23f', '#9be08a'][i]}" stroke="${INK}" stroke-width="3.5"/>`).join('')}</g>
  <g transform="translate(700 130) scale(.9)">${wallClock(4, 0, 0, 0)}</g>`;

const FLOUR = 'M-60 0 q10 -40 60 -40 q50 0 60 40z';
const table = `<g><rect x="330" y="498" width="630" height="38" rx="10" fill="#e8b87a" stroke="${INK}" stroke-width="5"/><rect x="345" y="536" width="600" height="40" fill="#c98a4e" stroke="${INK}" stroke-width="5"/>
  <rect x="352" y="576" width="26" height="100" rx="6" fill="#a8693a" stroke="${INK}" stroke-width="5"/><rect x="912" y="576" width="26" height="100" rx="6" fill="#a8693a" stroke="${INK}" stroke-width="5"/>
  <path d="${FLOUR}" transform="translate(420 506) scale(.7)" fill="#fff" stroke="${INK}" stroke-width="5"/>
  ${apple(520, 505, 0.62)}${apple(580, 512, 0.55, '#8bd34a')}${apple(470, 514, 0.5)}
  ${vis(0, 13.8, `<g transform="translate(870 506)"><ellipse rx="62" ry="30" fill="#fff0c8" stroke="${INK}" stroke-width="5"/><ellipse cx="-16" cy="-8" rx="26" ry="9" fill="#fff" opacity=".6"/></g>`)}
  ${vis(13.8, 15.0, pie(870, 512, 0.7))}
  <g transform="translate(750 500) rotate(-4)"><rect x="-70" y="-8" width="140" height="16" rx="8" fill="#d9a05a" stroke="${INK}" stroke-width="4"/><rect x="-86" y="-12" width="22" height="24" rx="8" fill="#a8693a" stroke="${INK}" stroke-width="4"/><rect x="64" y="-12" width="22" height="24" rx="8" fill="#a8693a" stroke="${INK}" stroke-width="4"/></g></g>`;
// la tarte voyage de la table au four (15.0 → 16.4)
const pieTravel = vis(15.0, 16.45, track(pie(0, 0, 0.7), 15.0, 16.4, (t, u) => ({ x: lerp(870, 1130, u), y: lerp(512, 470, u) - 90 * Math.sin(Math.PI * u) })));
const OV = { x: 1120, y: 300 };
const oven = `<g><rect x="1010" y="${OV.y}" width="250" height="330" rx="14" fill="#6b6f86" stroke="${INK}" stroke-width="6"/>
  <rect x="1010" y="${OV.y}" width="250" height="58" rx="14" fill="#4a4d63" stroke="${INK}" stroke-width="6"/>${[0, 1, 2].map((i) => `<circle cx="${1050 + i * 70}" cy="${OV.y + 29}" r="14" fill="#e8434e" stroke="${INK}" stroke-width="4"/>`).join('')}
  <rect x="1030" y="${OV.y + 90}" width="210" height="190" rx="12" fill="#3d3f52" stroke="${INK}" stroke-width="5"/>
  <rect x="1048" y="${OV.y + 108}" width="174" height="130" rx="10" fill="${'#2a1710'}" stroke="${INK}" stroke-width="4"/>
  ${vis(16.4, 22.2, `<rect x="1048" y="${OV.y + 108}" width="174" height="130" rx="10" fill="#ff9f43" opacity=".75"/><g transform="translate(1135 ${OV.y + 232})">${tf(pie(0, 0, 0.62), { t0: 17.0, d: 5, from: 'scale(1)', to: 'scale(1.18)', o: '0px 0px' })}</g>`)}
  <rect x="1048" y="${OV.y + 108}" width="174" height="130" rx="10" fill="#cfeaff" opacity="${0.18}"/>
  <rect x="1060" y="${OV.y + 252}" width="150" height="12" rx="6" fill="#d9d9e6" stroke="${INK}" stroke-width="3"/></g>`;
const ovenOpen = vis(22.2, 99, `<g><rect x="1020" y="${OV.y + 275}" width="230" height="30" rx="8" fill="#4a4d63" stroke="${INK}" stroke-width="5"/>${pie(1135, OV.y + 276, 0.78, { steam: true })}</g>`);

// farine : éternuement
const sneezeAt = pFox.at(23.3);
const SX = sneezeAt[0] + 115, SY = sneezeAt[1] - 120;
const blob = (x, y, r, t, i) => `<g transform="translate(${x} ${y})"><g style="--dx:${(i % 4 - 1.5) * 40}px;--dy:${-20 - (i % 3) * 22}px;${an({ n: 'drop', d: 1.6, t, f: 'both' })}"><circle r="${r}" fill="#fff" opacity=".9"/></g></g>`;
const blast = vis(23.25, 25.3, `${Array.from({ length: 14 }, (_, i) => blob(SX + 20 + (i % 5) * 28, SY + (i % 4) * 14 - 20, 26 + (i % 3) * 12, 23.25 + (i % 3) * 0.1, i)).join('')}`);
const dusty = (pt, hw, hh) => `<g opacity=".8" fill="#fff"><ellipse cx="${pt[0]}" cy="${pt[1] - 70}" rx="${hw}" ry="${hh}"/><circle cx="${pt[0] - hw * 0.5}" cy="${pt[1] - 150}" r="26"/><circle cx="${pt[0] + hw * 0.4}" cy="${pt[1] - 150}" r="22"/></g>`;
const white = vis(24.0, 99, `${dusty(pBad.at(30), 52, 70)}${dusty(pRab.at(30), 48, 66)}${dusty(pHed.at(30), 46, 52)}${dusty(pFox.at(30), 50, 66)}`);


const fx =
  sayOf('badger', 'badger', pBad, "Aujourd'hui, tarte aux pommes !", 0.5, 2.4, { bx: 80 }) +
  sayOf('rab', 'rab', pRab, 'Je lis la recette !', 3.7, 1.6, { bx: -40, by: 40 }) +
  sayOf('badger', 'badger', pBad, 'Personne ne touche la pâte !', 6.2, 1.9) +
  sayOf('fox', 'fox', pFox, 'Juste un petit goût...', 9.6, 1.6, { by: 20 }) +
  sfx('SLURP !', 960, 330, 11.3, 1.0, -6, '#ffffff', 70, 'tummy') +
  sayOf('badger', 'badger', pBad, 'Roussin !', 12.4, 1.0, { shout: true }) +
  sayOf('fox', 'fox', pFox, 'C’est vraiment délicieux !', 13.7, 1.5) +
  sayOf('badger', 'badger', pBad, 'Au four, vingt minutes !', 16.2, 1.7) +
  sayOf('hedge', 'hedge', pHed, 'Ça sent bon !', 19.3, 1.4, { by: 30 }) +
  sfx('DING !', 700, 230, 22.0, 1.0, -6, '#ffd23f', 90, 'handbell') +
  sayOf('fox', 'fox', pFox, 'Quelle farine partout !', 23.2, 0.95, { shout: true, by: -20 }) +
  sayOf('rab', 'rab', pRab, 'On est tout blancs !', 24.6, 1.5, { bx: -60, by: -20 }) +
  sayOf('badger', 'badger', pBad, 'Bon appétit !', 26.2, 1.0, { by: -10 }) +
  card(27.4, 'Saison 2 — La tarte', 'la course');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#ffe7c2"/>
<g style="${camStyle}">${kitchen}${oven}${hedEl}${rabEl}${badEl}${foxEl}${table}${pieTravel}${ovenOpen}${blast}</g>
${timeBadge(16, 0)}
${fx}
</svg>`;
sfxEv.push({ name: 'sniff', t: 9.8 }, { name: 'poof', t: 23.3 }, { name: 'laugh', t: 24.8 }, { name: 'clink', t: 16.4 }, { name: 'chime', t: 27.4 });
writeFileSync(new URL('./la-tarte.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 100, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
