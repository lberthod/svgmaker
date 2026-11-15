// Roussin & Lino · Saison 2 · Épisode 5 « La vache » — 30 s, 1280x720. 10h20, l'étable de Marguerite.
// Gag : après la traite, Roussin remercie la vache ; elle le lèche de la tête aux pieds. Piquette rit pour la première fois.
//
//  0.0– 3.4  plan large      Papi Bernard : « Qui veut traire Marguerite ? » — « Moi ! »
//  3.4– 6.5  le pis           Roussin tire... rien ne sort
//  6.5– 9.6  Lino             il trait : PSCHIT, le lait coule : « Comme ça ! »
//  9.6–11.9  plan large      « Bravo les enfants ! »
// 11.9–14.6  la vache         Roussin : « Merci, madame la vache ! »
// 14.6–16.2  gros plan        la langue sort doucement (anticipation)
// 16.2–18.6  la léchouille    SLURP ! Roussin tout décoiffé
// 18.6–21.0  Piquette         premier éclat de rire : « Qu'est-ce que c'est drôle ! »
// 21.0–27.6  plan large      « Marguerite t'adore ! » · « Encore ! Encore ! »
// 27.6–30.0  carton
import { writeFileSync } from 'node:fs';
import { W, H, INK, lines, sfxEv, an, vis, tf, sfx, fox, rabbit, put, style, addKF } from '../../lib/kit.mjs';
import { makeCam, say, card } from '../../lib/props.mjs';
import { hedgehog, badger } from '../../lib/cast2.mjs';
import { timeBadge } from '../../lib/badge.mjs';
import { farmBg, barn, cow, hay } from '../../lib/farm.mjs';

const DUR = 30;
const SHOTS = [
  [0, 2.5, 640, 400, 1.0, 1.05],
  [2.5, 3.4, 470, 490, 1.6, 1.65],
  [3.4, 6.5, 430, 500, 1.7, 1.75],
  [6.5, 9.6, 480, 490, 1.9, 1.95],
  [9.6, 11.9, 640, 430, 1.25, 1.3],
  [11.9, 14.6, 700, 470, 1.7, 1.75],
  [14.6, 16.2, 690, 440, 2.3, 2.4],
  [16.2, 18.6, 660, 470, 1.7, 1.75],
  [18.6, 21.0, 330, 520, 1.8, 1.85],
  [21.0, 27.6, 640, 400, 1.05, 1.12],
  [27.6, 30, 640, 380, 1.1, 1.0],
];
const { camStyle, scr } = makeCam(SHOTS, DUR);
addKF(`@keyframes laughs{from{transform:translateY(0) rotate(-2deg)}to{transform:translateY(-8px) rotate(2deg)}}
@keyframes squirt{0%,100%{opacity:1}50%{opacity:.55}}`);


const COWX = 540, COWY = 590, UDDER = [COWX - 40, COWY - 62];
const FY = 650;
const bucketX = COWX - 35, bucketY = 628;
const bucket = `<g transform="translate(${bucketX} ${bucketY})"><path d="M-44 -62 L-36 0 H36 L44 -62Z" fill="#cdd3dc" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M-36 -42 H36" stroke="#9aa3ad" stroke-width="4"/>
  <ellipse cy="-62" rx="44" ry="10" fill="#9aa3ad" stroke="${INK}" stroke-width="5"/>
  <g style="transform-origin:0px -58px;${an({ n: 'milkup', d: 2.8, t: 6.6, f: 'both' })}"><ellipse cy="-58" rx="38" ry="7" fill="#fff"/></g></g>`;
addKF(`@keyframes milkup{from{transform:translateY(8px) scale(.5,.4);opacity:0}to{transform:translateY(-1px) scale(1,1);opacity:1}}`);
const squirts = (a, b) => vis(a, b, `<g style="${an({ n: 'squirt', d: 0.16, t: a, c: Math.round((b - a) / 0.16), dir: 'alternate' })}"><path d="M${UDDER[0] - 8} ${UDDER[1] + 22} V${bucketY - 62}" stroke="#fff" stroke-width="10" stroke-linecap="round"/><path d="M${UDDER[0] + 8} ${UDDER[1] + 22} V${bucketY - 64}" stroke="#fff" stroke-width="9" stroke-linecap="round"/></g>`);
const drop = vis(5.6, 6.3, `<g transform="translate(${UDDER[0]} ${UDDER[1] + 22})"><g style="--dx:0px;--dy:50px;${an({ n: 'fdrop', d: 0.6, t: 5.6, f: 'both' })}"><path d="M0 0 q-6 10 0 14 q6 -4 0 -14z" fill="#fff" stroke="${INK}" stroke-width="2.5"/></g></g>`);

// tongue : base au museau, balayage 16.2 -> 17.6
const TB = [COWX + 150, COWY - 132];
const tongueShape = `<path d="M0 -15 H112 a15 15 0 0 1 0 30 H0Z" fill="#ff7f9f" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M14 0 H100" stroke="#e5557f" stroke-width="4" stroke-linecap="round"/><ellipse cx="80" cy="-6" rx="18" ry="4" fill="#fff" opacity=".4"/>`;
const mk = (t0, d, from, to, e = 'ease-in-out') => `transform-origin:0px 0px;`;
const tongue = `<g transform="translate(${TB[0]} ${TB[1]})">
  ${vis(14.7, 15.7, tf(tongueShape, { t0: 14.7, d: 0.9, from: 'rotate(58deg) scaleX(.12)', to: 'rotate(58deg) scaleX(.45)', e: 'ease-in-out' }))}
  ${vis(15.7, 16.4, tf(tongueShape, { t0: 15.7, d: 0.7, from: 'rotate(58deg) scaleX(.45)', to: 'rotate(55deg) scaleX(.9)', e: 'ease-in' }))}
  ${vis(16.4, 17.0, tf(tongueShape, { t0: 16.4, d: 0.6, from: 'rotate(55deg) scaleX(.95)', to: 'rotate(-18deg) scaleX(1.05)', e: 'ease-in-out' }))}
  ${vis(17.0, 17.7, tf(tongueShape, { t0: 17.0, d: 0.7, from: 'rotate(-18deg) scaleX(1.05)', to: 'rotate(40deg) scaleX(.1)', e: 'ease-in' }))}</g>`;

// personnages
const wet = `<path d="M40 -190 Q50 -226 62 -204 Q70 -236 84 -208 Q96 -226 94 -196" fill="#f28a1e" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><ellipse cx="62" cy="-176" rx="30" ry="8" fill="#9fdcff" opacity=".6"/><ellipse cx="96" cy="-132" rx="9" ry="14" fill="#9fdcff" opacity=".7"/>`;
const foxA = vis(0, 6.5, put(415, FY, 1.05, fox({ run: null, upright: 14, talk: [[2.6, 3.4], [5.0, 6.4]], gest: [[3.7, 6.2]],
  eyes: [[0.4, 2.4, 'side'], [2.6, 3.4, 'wide'], [3.6, 5.8, 'down'], [5.8, 6.5, 'wide']],
  moods: [[2.6, 3.4, 'happy'], [3.6, 5.0, 'shy'], [5.0, 6.5, 'sad']], sweatWin: [4.4, 6.4], jolt: [5.6] })));
const foxB = vis(11.8, 99, put(815, FY, 1.05, fox({ run: null, upright: -8, talk: [[12.1, 13.9], [17.4, 18.8], [24.7, 26.4]], gest: [[12.1, 13.9]],
  eyes: [[11.8, 14.4, 'arc'], [14.4, 16.3, 'wide'], [16.3, 17.7, 'closed'], [17.7, 19.5, 'wide'], [19.5, 30, 'side']],
  moods: [[12.1, 13.9, 'happy'], [14.4, 16.3, 'oh'], [16.3, 17.7, 'oh'], [17.7, 19.4, 'shy'], [19.5, 30, 'shy']],
  jolt: [16.4], hat: [[17.0, 99, wet]], blush: [[17.8, 22]] }), true));
const rabPre = vis(0, 6.5, put(290, FY - 8, 1.0, rabbit({ run: null, talk: [], eyes: [[0, 6.5, 'side']], moods: [[0, 6.5, 'calm']], jolt: [5.6] })));
const rabMilk = vis(6.5, 99, put(415, FY - 8, 1.0, rabbit({ run: null, talk: [[7.0, 8.2], [20.1, 21.0]], gest: [[6.8, 9.4]], raise: [],
  eyes: [[6.5, 9.6, 'down'], [9.6, 18.5, 'side'], [18.5, 21.0, 'wide'], [21.0, 30, 'arc']],
  moods: [[6.5, 9.6, 'happy'], [10.0, 18.5, 'happy'], [18.5, 21, 'oh'], [21, 30, 'happy']], jolt: [18.7] })));
const hedge = put(150, 640, 0.85, hedgehog([[18.9, 20.2], [26.4, 27.5]], { eyes: [[0, 16.3, 'side'], [16.3, 18.6, 'wide'], [18.6, 21.0, 'arc'], [21, 26, 'arc'], [26, 30, 'arc']],
  moods: [[0, 16.3, 'shy'], [16.3, 18.6, 'oh'], [18.6, 30, 'happy']], blush: [[18.9, 30]], jolt: [16.5, 18.7] }));
const hedgeLaugh = `<g style="${an({ n: 'laughs', d: 0.14, t: 18.9, c: 14, dir: 'alternate' })}">${hedge}</g>`;
const papi = put(1060, 620, 0.78, badger([[0.5, 2.4], [9.8, 11.2], [21.3, 23.3]], { moods: [[0.5, 2.4, 'happy'], [9.8, 11.2, 'happy'], [21.3, 23.3, 'happy']], eyes: [[2.5, 9, 'side']] }), true);
const cowEl = put(COWX, COWY, 1.0, cow([], { eyes: [[0, 14.4, 'calm'], [14.4, 16.3, 'wide'], [16.3, 18.3, 'arc']], moods: [[14.4, 18.3, 'happy']] }));

const foxBmove = tf(foxB, { t0: 17.7, d: 0.3, from: 'translate(0px,0px)', to: 'translate(90px,0px)' });
const world = `${farmBg()}${barn(190, 548, 0.9)}${hay(1180, 560, 0.7)}${rabPre}${hedgeLaugh}${papi}${cowEl}${tongue}${rabMilk}${foxA}${foxBmove}${bucket}${drop}${squirts(6.7, 9.4)}`;

const tip = (t, wx, wy) => { const [x, y] = scr(wx, wy, t + 0.1); return [x, y]; };
const S = (who, text, t0, dur, head, o = {}) => { const [x, y] = tip(t0, ...head); return say(who, text, t0, dur, { bx: x + (o.dx || 0), by: y - (o.up ?? 95), tips: [[x, y]], shout: o.shout, fs: o.fs || (o.shout ? 50 : 41) }); };
const H_FOXA = [415 + 60, FY - 150], H_FOXB = [815 - 78, FY - 215], H_RAB = [415 - 50, FY - 260], H_HEDGE = [150 + 40, 640 - 150], H_BAD = [1060 - 28, 620 - 245];

const fx =
  S('badger', 'Qui veut traire Marguerite ?', 0.4, 2.1, H_BAD, { dx: -150 }) +
  S('fox', 'Moi !', 2.6, 0.8, H_FOXA, { shout: true, dx: -40 }) +
  sfx('PLIC...', 520, 560, 5.6, 0.8, -6, '#ffffff', 46) +
  S('fox', 'Rien ne sort !', 5.0, 1.4, [H_FOXA[0] + 20, H_FOXA[1] - 10], { dx: -70, up: 80 }) +
  sfx('PSCHIT PSCHIT', 700, 640, 6.9, 2.2, -5, '#ffffff', 60, 'brush') +
  S('rab', 'Comme ça !', 7.0, 1.2, H_RAB, { dx: -40 }) +
  S('badger', 'Bravo les enfants !', 9.8, 1.6, H_BAD, { dx: -120 }) +
  S('fox', 'Merci, madame la vache !', 12.1, 1.8, H_FOXB, { dx: 110 }) +
  sfx('MMMEUUH...', 280, 200, 14.8, 1.4, -4, '#b57bff', 60, 'yawn') +
  sfx('SLURP !', 620, 230, 16.5, 1.4, 6, '#ff6f95', 90, 'slide') +
  S('fox', 'Ça me chatouille !', 17.4, 1.4, [H_FOXB[0] + 90, H_FOXB[1]], { dx: 30 }) +
  S('hedge', 'Que c’est drôle !', 18.9, 1.2, H_HEDGE, { dx: 20, shout: true }) +
  S('rab', 'Piquette a ri !', 20.1, 1.3, [415 - 50, FY - 260], { dx: 90 }) +
  S('badger', "Marguerite t'adore, Roussin !", 21.4, 2.2, H_BAD, { dx: -150 }) +
  S('fox', 'Je suis tout décoiffé !', 24.2, 1.9, [H_FOXB[0] + 90, H_FOXB[1]], { dx: 0 }) +
  S('hedge', 'Encore ! Encore !', 26.3, 1.2, H_HEDGE, { dx: 90 }) +
  card(27.8, 'Saison 2 · La vache', 'le potager');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#bfe6ff"/>
<g style="${camStyle}">${world}</g>
${timeBadge(10, 20)}
${fx}
</svg>`;
sfxEv.push({ name: 'laugh', t: 18.9 }, { name: 'laugh', t: 24.8 }, { name: 'chime', t: 27.8 }, { name: 'chirp', t: 1.2 });
writeFileSync(new URL('./vache.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 100, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
