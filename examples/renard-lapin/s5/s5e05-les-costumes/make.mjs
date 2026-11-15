// Roussin & Lino · Saison 5 · Épisode 5 « Les costumes » — 30 s, 1280x720. 12h00, les coulisses de la salle des fêtes.
//
// Découpage :
//  0.0– 3.5  plan large     Lino : « Midi pile ! Les costumes ! » (pastille 12 h 00)
//  3.5– 7.0  Mlle Zélie     « Venez, je prends vos mesures. »
//  7.0–10.2  Roussin        « Moi d'abord ! » — elle, distraite : « Oh... un ruban rose ! »
// 10.2–14.0  le cou         elle mesure le cou de Roussin (« Trois rubans et demi »), « Ça chatouille ! Hihi ! »
// 14.0–17.4  la couture     elle pique le costume de soleil... avec son propre foulard (CLIC)
// 17.4–26.4  le manège      Roussin tourne pour se voir et l'entraîne : « Oh ! Je suis cousue ! » ; Lino : « Un manège ! »
// 26.4–30.0  plan large     carton « Saison 5 » + annonce
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../../lib/kit.mjs';
import { makeCam, say as say0 } from '../../lib/props.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { solid, endCard5 } from '../_hfix.mjs';
import { giraffe } from '../../lib/cast5.mjs';
import { backstage, costumeRack, dressForm, costumeBack, ribbon, FLOOR } from '../../lib/theatre.mjs';

const DUR = 30;
const SHOTS = [
  [0, 3.5, 640, 400, 1.0, 1.05],
  [3.5, 17.4, 500, 395, 1.3, 1.3],
  [17.4, 26.4, 640, 410, 1.1, 1.1],
  [26.4, 30, 640, 400, 1.08, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes bandk{0%{opacity:0;transform:scale(.2)}60%{opacity:1;transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}`);

const L = [
  { w: 'rab', t: 'Midi pile ! Les costumes !', a: 0.5, d: 2.5, m: 'happy' },
  { w: 'giraffe', t: 'Je suis Mlle Zélie !', a: 3.6, d: 1.7, m: 'happy' },
  { w: 'giraffe', t: 'Je prends vos mesures.', a: 5.4, d: 1.6, m: 'happy' },
  { w: 'fox', t: "Moi d'abord !", a: 7.2, d: 1.3, m: 'happy' },
  { w: 'giraffe', t: 'Un ruban rose, magnifique !', a: 8.8, d: 1.8, m: 'oh' },
  { w: 'giraffe', t: 'Trois rubans et demi.', a: 10.8, d: 1.9, m: 'calm' },
  { w: 'fox', t: 'Ça me chatouille le cou !', a: 12.8, d: 1.5, m: 'happy', o: [250, -125] },
  { w: 'giraffe', t: 'Voilà, presque fini !', a: 15.3, d: 1.8, m: 'happy' },
  { w: 'fox', t: 'Je tourne pour voir !', a: 17.6, d: 1.5, m: 'happy' },
  { w: 'giraffe', t: 'Je suis cousue à lui !', a: 19.2, d: 1.6, m: 'oh', sh: true },
  { w: 'fox', t: 'Pourquoi on tourne ?!', a: 21.0, d: 1.6, m: 'oh', sh: true },
  { w: 'rab', t: 'Ils tournent, tournent, tournent !', a: 22.9, d: 1.4, m: 'happy' },
];
const talk = (w) => L.filter((l) => l.w === w).map((l) => [l.a + 0.1, l.a + l.d - 0.15]);
const moods = (w) => L.filter((l) => l.w === w).map((l) => [l.a, l.a + l.d, l.m]);

const FY = 620, GS = 0.85, CX0 = 445;
// manège : de 17.6 à 24.8 le duo tourne en rond (4 tours), tourné vers sa direction
const pair = (t) => {
  const tau = Math.min(1, Math.max(0, (t - 17.6) / 7.2)), th = 8 * Math.PI * ss(tau);
  if (tau <= 0 || tau >= 1) return { x: CX0, y: 0, f: 1 };
  return { x: CX0 + 75 * Math.sin(th), y: -9 * Math.abs(Math.sin(3 * th)), f: Math.cos(th) >= 0 ? 1 : -1 };
};
const HEAD = {
  rab: () => [830 - 50, FY - 290],
  giraffe: (t) => { const p = pair(t); return [p.x + p.f * (-115 + 86 * GS), FY + p.y - 415 * GS]; },
  fox: (t) => { const p = pair(t); return [p.x + p.f * (115 + 70), FY + p.y - 225]; },
};

// ───────── décor ─────────
const bg = `${backstage()}${costumeRack(1070, FLOOR + 66, 0.75)}${dressForm(1175, FY + 4, 0.9, { kind: 'cloud' })}${ribbon(700, FY + 8, 0.7)}`;
const badge = timeBadge(12, 0);

// ───────── personnages ─────────
const rabEl = put(830, FY, 1.0, rabbit({ run: null, noBag: true, noShadow: true, talk: talk('rab'), moods: moods('rab'), eyes: [[0.5, 3, 'arc'], [22.9, 26, 'arc']], blush: [[22.9, 24.3]] }), true);
const giraffeEl = put(-115, 0, GS, giraffe(talk('giraffe'), { moods: moods('giraffe'), eyes: [[3.6, 6.4, 'up'], [8.8, 10.4, 'side'], [10.8, 13, 'down'], [15.3, 17, 'arc'], [19.2, 20.8, 'wide'], [24.5, 27, 'arc']], blush: [[24.5, 26.1]] }));
const tape = vis(11.0, 14.2, `<ellipse cx="40" cy="-146" rx="36" ry="10" fill="none" stroke="${INK}" stroke-width="13"/><ellipse cx="40" cy="-146" rx="36" ry="10" fill="none" stroke="#ff8fb8" stroke-width="8"/>`);
const foxEl = put(115, 0, 1.0, vis(10.8, 99, costumeBack('sun', 0, -100, 0.85)) + fox({ run: null, upright: -6, noShadow: true, noBag: true, talk: talk('fox'), moods: moods('fox'),
  eyes: [[7.2, 8.5, 'arc'], [12.8, 14.3, 'sq'], [17.6, 19.1, 'arc'], [21.0, 22.6, 'wide'], [24.5, 27, 'arc']], blush: [[12.8, 14.3], [24.5, 26.1]] }) + tape);
// le foulard à pois cousu : du cou de Zélie à la poitrine de Roussin
const band = vis(14.6, 99, `<g style="transform-origin:-78px -272px;${an({ n: 'bandk', d: 0.5, t: 14.6, f: 'both' })}"><path d="M-78 -272 Q10 -190 135 -96" stroke="${INK}" stroke-width="20" fill="none" stroke-linecap="round"/><path d="M-78 -272 Q10 -190 135 -96" stroke="#5fb7f2" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M-78 -272 Q10 -190 135 -96" stroke="#fff" stroke-width="5" fill="none" stroke-dasharray="1 24" stroke-linecap="round"/></g>`);
const duo = track(`${giraffeEl}${foxEl}${band}`, 0, DUR, (t) => { const p = pair(t); return { x: p.x, y: FY + p.y, sx: p.f, sy: 1 }; }, 30);

const world = `${bg}${rabEl}${duo}`;

// ───────── espace écran ─────────
const sayL = (l) => {
  const tm = l.a + l.d / 2, hp = HEAD[l.w](tm), [sx, sy] = scr(hp[0], hp[1], tm), off = l.o || [0, -125];
  const fs = l.sh ? 50 : 41, w = l.t.length * fs * 0.56 + 56;
  let bx = sx + off[0], by = sy + off[1];
  by = Math.max(by, 56);
  if (by - 42 < 90 && bx - w / 2 < 240) bx = 240 + w / 2; // évite le badge d'heure
  return say0(l.w, l.t, l.a, l.d, { bx, by, tips: [[sx, sy - 6]], shout: !!l.sh, fs });
};
const endCard = endCard5(27.0, 'Les costumes', 'Prochain épisode : les décors');
const fx = badge + solid(L.map(sayL).join('')) + sfx('CLIC !', 700, 300, 14.6, 0.8, -6, '#ffd23f', 80) + sfx('FRRR !', 640, 560, 17.6, 0.8, 4, '#ffffff', 64) + endCard;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#3a3350"/>
<g style="${camStyle}">${world}</g>
${fx}
</svg>`;
sfxEv.push({ name: 'chime', t: 0.3 }, { name: 'click', t: 14.6 }, { name: 'whoosh', t: 17.6 }, { name: 'laugh', t: 22.9 }, { name: 'chime', t: 27.0 });
writeFileSync(new URL('./les-costumes.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 104, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
