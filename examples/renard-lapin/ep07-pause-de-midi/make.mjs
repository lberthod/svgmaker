// Roussin & Lino · Épisode 7 « La pause de midi » — 30 s, 1280x720. 12h45, la cour. Cache-cache.
//
// Découpage :
//  0.0– 4.0  plan large      Roussin compte contre l'arbre, les yeux fermés ; Lino court se cacher derrière un buisson
//  4.0– 6.5  le buisson      ses grandes oreilles dépassent du buisson : « Silence... »
//  6.5– 9.5  Roussin          « Prêt ou pas, j'arrive ! » ; il voit les oreilles (!)
//  9.5–12.0  plan moyen      « Trouvé, Lino ! » — Lino sort : « Oh non ! »
// 12.0–14.2  plan moyen      Lino compte à son tour ; Roussin se faufile et plonge derrière l'autre buisson
// 14.2–17.2  plan moyen      Lino trouve Mimi (« Trouvée, Mimi ! »), puis cherche du mauvais côté : « Roussin ? Où es-tu ? »
// 17.2–21.0  gros plan       derrière le buisson : Roussin s'est endormi, Zzz
// 21.0–23.5  plan moyen      Lino appelle toujours du mauvais côté (« Roussin !! ») ; Rouge-Gorge arrive et se pose sur le buisson
// 23.5–26.0  gros plan       CUI CUI ! Roussin se réveille, des feuilles sur la tête : « Hein ? J'ai gagné ? »
// 26.0–30.0  plan large      Lino accourt : « Je t'ai trouvé ! » ; l'oiseau sur la tête de Roussin ; carton
import { writeFileSync } from 'node:fs';
import { timeBadge } from '../lib/badge.mjs';
import { W, H, INK, lines, sfxEv, an, ao, vis, sfx, fox, rabbit, put, style, addKF, track, ss } from '../lib/kit.mjs';
import { makeCam, say, card, bird, pal } from '../lib/props.mjs';
import { courtyard } from '../lib/courtyard.mjs';

const DUR = 30;
const SHOTS = [
  [0, 4.0, 640, 360, 1.0, 1.03],
  [4.0, 6.5, 1080, 560, 2.0, 2.05],
  [6.5, 9.5, 920, 450, 1.4, 1.45],
  [9.5, 12.0, 900, 470, 1.3, 1.33],
  [12.0, 14.2, 760, 460, 1.2, 1.24],
  [14.2, 17.2, 840, 450, 1.25, 1.3],
  [17.2, 21.0, 400, 560, 2.0, 2.05],
  [21.0, 23.5, 880, 450, 1.6, 1.63],
  [23.5, 26.0, 380, 540, 1.9, 1.95],
  [26.0, 30, 640, 360, 1.0, 1.03],
];
const { scr: P, camStyle } = makeCam(SHOTS, DUR);
const lerp = (a, b, u) => a + (b - a) * u;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const seg = (t, keys) => { if (t <= keys[0][0]) return keys[0][1]; for (let i = 0; i < keys.length - 1; i++) { const [a, va] = keys[i], [b, vb] = keys[i + 1]; if (t <= b) return lerp(va, vb, ss((t - a) / (b - a))); } return keys[keys.length - 1][1]; };
const C = courtyard({ h: 12, m: 45 });
addKF(`@keyframes numpop{0%{opacity:0;transform:translateY(10px) scale(.3)}25%{opacity:1;transform:translateY(-10px) scale(1.2)}70%{opacity:1;transform:translateY(-24px) scale(1)}100%{opacity:0;transform:translateY(-40px) scale(.9)}}
@keyframes earwig{from{transform:rotate(-8deg)}to{transform:rotate(8deg)}}
@keyframes rustle{0%,100%{transform:translate(0,0)}25%{transform:translate(-4px,2px)}75%{transform:translate(4px,-2px)}}
@keyframes zzz{0%{opacity:0;transform:translate(0,0) scale(.6)}15%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translate(40px,-55px) scale(1.2)}}
@keyframes leaf{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--dx),90px) rotate(200deg)}}
@keyframes peck{0%,100%{transform:rotate(0)}35%{transform:translateX(7px) rotate(12deg)}55%{transform:translateX(-6px) rotate(-22deg)}}`);

// ───────── buissons-cachettes ─────────
const BA = [1090, 662, 76], BB = [420, 668, 82], MB = [640, 655, 68];
const bigBush = ([x, y, r], rustleAt = []) => `<g style="transform-origin:${x}px ${y}px;${rustleAt.map((t) => an({ n: 'rustle', d: 0.12, t, c: 4 })).join(';').replace(/;animation:/g, ',')}">${C.bush(x, y, r)}
  ${[[-0.5, -0.5], [0.3, -0.75], [0.7, -0.2], [-0.2, 0.1]].map(([dx, dy]) => `<circle cx="${x + dx * r}" cy="${y + dy * r}" r="${r * 0.18}" fill="#52c468"/>`).join('')}
  ${[[-0.35, -0.3], [0.45, -0.45], [0.1, 0.05]].map(([dx, dy]) => `<circle cx="${x + dx * r}" cy="${y + dy * r}" r="6" fill="#ff6b6b" stroke="${INK}" stroke-width="2"/>`).join('')}</g>`;

// ───────── Lino ─────────
const LX = (t) => seg(t, [[0.4, 560], [1.6, 1090], [10.0, 1090], [10.45, 950], [12.0, 950], [12.4, 960], [14.2, 960], [15.0, 940], [16.0, 940], [16.4, 920], [23.49, 920], [23.5, 1360], [26.0, 1360], [26.8, 660]]);
const LY = (t) => (t > 1.55 && t < 10.0 ? 748 : t >= 10.0 && t < 10.45 ? lerp(748, 690, ss((t - 10.0) / 0.45)) - 70 * Math.sin(Math.PI * (t - 10.0) / 0.45) : 690);
const LFACE = (t) => ((t >= 12.0 && t < 15.95) || t >= 26.0 ? -1 : 1);
const rab = rabbit({
  runExtra: [[0.4, 1.55], [12.0, 12.4], [14.2, 15.0], [16.0, 16.4], [26.0, 26.8]], item: '',
  talk: [[4.6, 5.5], [11.0, 11.9], [12.1, 13.6], [15.05, 15.9], [16.3, 17.2], [21.35, 22.2], [26.85, 27.45]],
  eyes: [[1.6, 9.9, 'wide'], [10.5, 12.0, 'closed'], [12.4, 14.2, 'closed'], [16.0, 17.1, 'side'], [21.3, 23.3, 'side'], [26.7, 28.5, 'arc']],
  moods: [[1.6, 9.9, 'shy'], [10.4, 12.0, 'sad'], [15.0, 16.0, 'happy'], [16.0, 17.2, 'oh'], [21.0, 23.4, 'oh'], [26.6, 30, 'happy']],
  blush: [[10.6, 11.9]], jolt: [8.25, 24.25], gest: [[15.05, 15.9], [21.35, 22.2]],
});
const rabEl = track(rab, 0, 30, (t) => ({ x: LX(t), y: LY(t), sx: 0.9 * LFACE(t), sy: 0.9 }), 20);
// oreilles qui dépassent du buisson (visibles derrière le buisson pendant la cachette)
const earsWig = vis(1.6, 10.0, `<g transform="translate(${BA[0] + 36} ${BA[1] - 95})"><g style="transform-origin:0 30px;${an({ n: 'earwig', d: 0.5, t: 1.6, c: 20, dir: 'alternate', e: 'ease-in-out' })}">
  <ellipse cx="-14" cy="-20" rx="15" ry="42" fill="#f1eff7" stroke="${INK}" stroke-width="4" transform="rotate(-10 -14 -20)"/><ellipse cx="-14" cy="-20" rx="7" ry="30" fill="#ffb3c6" transform="rotate(-10 -14 -20)"/>
  <ellipse cx="22" cy="-16" rx="15" ry="42" fill="#f1eff7" stroke="${INK}" stroke-width="4" transform="rotate(14 22 -16)"/><ellipse cx="22" cy="-16" rx="7" ry="30" fill="#ffb3c6" transform="rotate(14 22 -16)"/></g></g>`);

// ───────── Roussin ─────────
const FS = 1.0;
const leafHat = `<g>${[[40, -230, -30], [72, -238, 10], [100, -222, 40], [60, -206, -60]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="14" ry="7" fill="#52c468" stroke="${INK}" stroke-width="2.5" transform="rotate(${r} ${x} ${y})"/>`).join('')}</g>`;
// compte contre l'arbre, se retourne, voit, pointe
const f1 = vis(0, 12.3, track(fox({
  talk: [[0.5, 2.6], [6.6, 8.0], [9.6, 10.8]], gest: [], point: [[9.35, 10.9]], jolt: [8.2],
  eyes: [[0, 6.5, 'closed'], [6.6, 8.1, 'side'], [8.1, 9.5, 'wide'], [9.5, 12.3, 'arc']],
  moods: [[0, 6.5, 'calm'], [6.6, 8.1, 'happy'], [8.1, 9.5, 'oh'], [9.5, 12.3, 'happy']], upright: -10,
}), 0, 12.3, (t) => ({ x: 790 - 60 * ss(clamp((t - 6.6) / 0.4, 0, 1)), y: 665, sx: FS, sy: FS }), 20));
// se faufile vers le buisson et plonge derrière
const f2 = vis(12.3, 14.05, track(fox({ runExtra: [[12.3, 13.5]], moods: [[0, 99, 'happy']], eyes: [[0, 99, 'arc']], upright: -24, jumps: [[13.55, 14.0, 70]] }), 12.3, 14.0, (t) => ({ x: seg(t, [[12.3, 730], [13.5, 520], [14.0, 390]]), y: seg(t, [[13.5, 665], [14.0, 690]]), sx: -FS, sy: FS }), 20));
// endormi, couché derrière le buisson (tête à gauche)
const sleepBody = `<g style="transform-origin:0 -90px;animation:breathe 1.6s ease-in-out infinite alternate">${fox({ eyes: [[0, 99, 'closed']], moods: [[0, 99, 'calm']], upright: -12, noShadow: true })}</g>`;
const sleepFox = vis(17.2, 24.2, `<g transform="translate(${BB[0] - 60} 662) scale(${FS})">${sleepBody}</g>`);
// réveillé, assis, feuilles sur la tête, puis l'oiseau s'y pose
const f5 = vis(24.2, 99, put(360, 690, FS, fox({
  hat: [[24.2, 99, leafHat]], jumps: [[24.2, 24.5, 50]], talk: [[24.35, 25.6]], raise: [[28.0, 29.5]],
  eyes: [[24.2, 24.5, 'spiral'], [24.5, 26.0, 'wide'], [26.0, 30, 'arc']], moods: [[24.2, 26.0, 'oh'], [26.0, 30, 'happy']], upright: -12,
})));
const leavesFly = vis(24.2, 25.6, [[-40, 1], [10, 0.6], [50, -0.8], [-10, -1.2]].map(([x, k], i) => `<g transform="translate(${330 + x} ${380 - i * 10})"><g style="--dx:${k * 60}px;${an({ n: 'leaf', d: 1.2, t: 24.2 + i * 0.05, f: 'both' })}"><ellipse rx="12" ry="6" fill="#52c468" stroke="${INK}" stroke-width="2"/></g></g>`).join(''));

// ───────── Mimi cachée derrière le petit buisson ─────────
const mimiPal = put(MB[0], 692, 0.8, pal('mouse', { eyes: [[0, 14.9, 'wide'], [15.0, 16.2, 'arc'], [26.6, 28.4, 'arc']], moods: [[15.0, 16.2, 'happy'], [26.6, 28.5, 'happy']], jolt: [15.0], giggle: [[15.0, 16.0], [26.7, 28.2]] }));
const mimi = vis(0, 23.5, `<g style="${an({ n: 'popout', d: 0.35, t: 15.0, f: 'both', e: 'cubic-bezier(.3,1.5,.5,1)' })}">${mimiPal}</g>`) + vis(23.5, 99, `<g transform="translate(120 -50)">${mimiPal}</g>`);
addKF('@keyframes popout{from{transform:translate(0,0)}to{transform:translate(120px,-50px)}}');

// ───────── Rouge-Gorge ─────────
const BS = 1.4;
const flyTo = (t0, t1, [x0, y0], [x1, y1], arc = -60, sc = BS) => vis(t0, t1 + 0.02, track(bird(true, false), t0, t1, (t, u) => { const k = ss(u); return { x: lerp(x0, x1, k), y: lerp(y0, y1, k) + arc * Math.sin(Math.PI * k), sx: x1 > x0 ? -sc : sc, sy: sc }; }));
const ONBUSH = [BB[0] + 85, BB[1] - BB[2] - 18];
const HEADTOP = [395, 439];
const SLEEPHEAD = [BB[0] - 10, 418];
const HOVER = [520, 410];
const birdEl = flyTo(21.9, 22.8, [1340, 120], SLEEPHEAD, -40) +
  vis(22.8, 24.2, `<g transform="translate(${SLEEPHEAD[0]} ${SLEEPHEAD[1]}) scale(${-BS} ${BS})"><g style="transform-origin:-10px 10px;${an({ n: 'peck', d: 0.25, t: 23.3, c: 3 })}">${bird(false, false)}</g></g>`) +
  flyTo(24.2, 24.6, SLEEPHEAD, HOVER, -50) +
  vis(24.6, 26.2, `<g transform="translate(${HOVER[0]} ${HOVER[1]}) scale(${-BS} ${BS})">${bird(true, false)}</g>`) +
  flyTo(26.2, 26.7, HOVER, HEADTOP, -40) +
  vis(26.7, 99, `<g transform="translate(${HEADTOP[0]} ${HEADTOP[1]}) scale(${-BS} ${BS})">${bird(false, false)}</g>`);

// chiffres au-dessus de Roussin
const nums = [1, 2, 3, 4, 5].map((n, i) => { const t = 0.6 + i * 0.6; return vis(t, t + 0.6, `<g transform="translate(1190 160)"><g style="${an({ n: 'numpop', d: 0.6, t, f: 'both' })}"><text class="sfx" style="font-size:72px;fill:#ffd23f">${n}</text></g></g>`); }).join('');
const zzz = [17.3, 18.5, 19.7, 20.9, 22.1, 22.7].map((t) => vis(t, Math.min(t + 1.3, 23.6), `<g transform="translate(480 470)"><g style="${an({ n: 'zzz', d: 1.4, t, f: 'both' })}"><text class="sfx" style="font-size:46px;fill:#3a7bd5;stroke:#3a2418;stroke-width:3;paint-order:stroke">Z z z</text></g></g>`)).join('');

const world = `${C.bg}${C.tree}${C.slide}
  ${mimi}${C.bush(MB[0], MB[1], MB[2])}
  ${f2}${vis(0, 26.0, rabEl)}${earsWig}${bigBush(BA, [4.2, 5.4, 9.95])}
  ${f1}${sleepFox}${zzz}${bigBush(BB, [13.95, 23.7, 24.2])}${f5}${vis(26.0, 99, rabEl)}${leavesFly}
  ${nums}
  ${birdEl}`;

const fx =
  say('fox', 'Je compte jusqu’à cinq !', 0.6, 3.0, { bx: 600, by: 200, tips: [[880, 420]] }) +
  say('rab', 'Silence...', 4.6, 1.0, { bx: 900, by: 140, tips: [[1080, 250]] }) +
  say('fox', "Prêt ou pas, j'arrive !", 6.6, 1.4, { bx: 520, by: 130, tips: [[640, 300]] }) +
  sfx('!', 880, 330, 8.2, 0.8, 0, '#ffd23f', 130, 'boing') +
  say('fox', 'Trouvé, Lino !', 9.6, 1.2, { bx: 520, by: 140, tips: [[620, 300]], shout: true }) +
  say('rab', 'Zut, trouvé !', 11.0, 0.9, { bx: 1060, by: 140, tips: [[1000, 300]] }) +
  say('rab', 'À toi de compter !', 12.1, 1.5, { bx: 900, by: 150, tips: [[960, 300]] }) +
  say('rab', 'Trouvée, Mimi !', 15.2, 0.8, { bx: 700, by: 150, tips: [[800, 290]] }) +
  say('rab', 'Roussin ? Où es-tu ?', 16.3, 0.85, { bx: 900, by: 150, tips: [[930, 300]] }) +
  say('rab', 'Roussin !!', 21.35, 0.9, { bx: 1000, by: 170, tips: [[960, 310]], shout: true }) +
  sfx('CUI CUI !', 820, 90, 23.55, 0.75, -8, '#ffd23f', 70, 'chirp') +
  say('fox', 'Quoi ? J’ai gagné ?', 24.35, 1.3, { bx: 980, by: 90, tips: [[760, 370]] }) +
  say('rab', 'Je t’ai trouvé !', 26.85, 1.2, { bx: 800, by: 230, tips: [[700, 390]] }) +
  card(27.5, 'La pause de midi !', 'les lettres', 640, 130);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-duration="${DUR}" data-fps="30">
<style>${style()}</style>
<rect width="${W}" height="${H}" fill="#7cc8ff"/>
<g style="${camStyle}">${world}</g>
${timeBadge(12, 45)}
${fx}
</svg>`;
sfxEv.push({ name: 'whoosh', t: 0.4 }, { name: 'whoosh', t: 13.55 }, { name: 'step', t: 12.4 }, { name: 'whoosh', t: 21.9 }, { name: 'boing', t: 24.2 }, { name: 'laugh', t: 26.8 }, { name: 'chirp', t: 26.3 });
writeFileSync(new URL('./pause-de-midi.svg', import.meta.url), svg);
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({ duration: DUR, bpm: 126, lines, sfx: sfxEv }, null, 1));
console.log('svg', (svg.length / 1024).toFixed(0), 'Ko ·', lines.length, 'répliques');
