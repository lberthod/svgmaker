// Accessoires et outils de mise en scène partagés (extraits de l'épisode 2).
import { W, H, INK, lines, an, ao, vis, esc, eyeStates, mouthStates, addKF } from './kit.mjs';

// ───────── caméra à plans coupés : SHOTS = [t0, t1, cx, cy, z0, z1] ─────────
export function makeCam(SHOTS, DUR) {
  const clampC = (cx, cy, z) => [Math.min(Math.max(cx, 640 / z), W - 640 / z), Math.min(Math.max(cy, 360 / z), H - 360 / z)];
  const camT = (cx, cy, z) => { const [x, y] = clampC(cx, cy, z); return `translate(${(640 - x * z).toFixed(1)}px,${(360 - y * z).toFixed(1)}px) scale(${z})`; };
  let kf = '@keyframes cam{';
  for (const [t0, t1, cx, cy, z0, z1] of SHOTS) kf += `${((t0 / DUR) * 100).toFixed(3)}%{transform:${camT(cx, cy, z0)}}${(((t1 - 0.004) / DUR) * 100).toFixed(3)}%{transform:${camT(cx, cy, z1)}}`;
  addKF(kf + '}');
  // position écran d'un point du monde au temps t
  const scr = (wx, wy, t) => {
    const s = SHOTS.find(([a, b]) => t >= a && t < b) || SHOTS[SHOTS.length - 1];
    const z = (s[4] + s[5]) / 2, [cx, cy] = clampC(s[2], s[3], z);
    return [Math.round((wx - cx) * z + 640), Math.round((wy - cy) * z + 360)];
  };
  const camStyle = `transform-origin:0 0;animation:cam ${DUR}s linear 0s 1 normal both`;
  return { scr, camStyle };
}

// ───────── bulles (espace écran) : centre (bx,by), une ou plusieurs pointes ─────────
export function say(who, text, t0, dur, { bx, by, tips = [], shout = false, fs: fs0 }) {
  lines.push({ who, t0, t1: t0 + dur, text });
  const fs = Math.max(fs0 || (shout ? 50 : 41), shout ? 44 : 36), w = text.length * fs * 0.56 + 56, h = fs + 34;
  const x = Math.min(Math.max(bx, w / 2 + 16), W - 16 - w / 2), y = Math.min(Math.max(by, h / 2 + 14), H - h / 2 - 14);
  const fill = shout ? '#fff36b' : '#ffffff';
  const edge = (ty) => (ty < y ? y - h / 2 + 6 : y + h / 2 - 6);
  const baseOf = (tx) => Math.min(Math.max(tx, x - w / 2 + 34), x + w / 2 - 34);
  const tails = tips.map(([tx, ty]) => { const b = baseOf(tx); return `<path d="M${b - 17} ${edge(ty)} L${tx} ${ty} L${b + 17} ${edge(ty)}Z" fill="${fill}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`; }).join('');
  const covers = tips.map(([tx, ty]) => { const b = baseOf(tx); return `<rect x="${b - 14}" y="${ty < y ? y - h / 2 + 3 : y + h / 2 - 12}" width="28" height="9" fill="${fill}"/>`; }).join('');
  return `<g transform="translate(${x} ${y})"><g style="${an({ n: 'pop', d: dur, t: t0, f: 'both' })}"><g transform="translate(${-x} ${-y})">
  ${tails}<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${shout ? 14 : 26}" fill="${fill}" stroke="${INK}" stroke-width="5"/>${covers}
  <text x="${x}" y="${y + fs * 0.34}" class="bt" style="font-size:${fs}px">${esc(text)}</text></g></g></g>`;
}

// carton de fin
export const card = (t, title, next, cx = 640, cy = 120) => `<g style="transform-origin:${cx}px ${cy}px;${an({ n: 'cardk', d: 0.6, t, f: 'both', e: 'cubic-bezier(.2,1.6,.4,1)' })}"><g transform="translate(${cx} ${cy}) scale(.8)">
    <rect x="-279" y="-80" width="570" height="196" rx="30" fill="#000" opacity=".22" transform="rotate(-1.5)"/><rect x="-285" y="-88" width="570" height="196" rx="30" fill="#fff" stroke="${INK}" stroke-width="7" transform="rotate(-1.5)"/>
    <text y="0" class="sfx" style="font-size:68px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino</text>
    <text y="52" class="bt" style="font-size:40px;fill:#2b5ba8">${esc(title)}</text>
    <text y="90" class="bt" style="font-size:24px;fill:#7a6a5a">Prochain épisode : ${esc(next)}</text></g></g>`;

// ───────── objets ─────────
export const croissant = `<g><path d="M-40 8 Q-34 -30 0 -32 Q34 -30 40 8 Q26 -6 14 -9 Q0 -1 -14 -9 Q-26 -6 -40 8Z" fill="#e9a84a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-14 -9 Q-13 -22 -5 -30 M14 -9 Q13 -22 5 -30" stroke="#b97520" stroke-width="3" fill="none"/><path d="M-22 -22 Q0 -30 22 -22" stroke="#f6d08a" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
export const croissantLight = croissant.replace('#e9a84a', '#ffcf6b').replace('#b97520', '#c98a2c');

// Rouge-Gorge : regarde à gauche, corps centré en (0,0), pattes en y≈22
export const bird = (flap, withCroissant) => `<g style="transform-origin:0 0;${flap ? an({ n: 'birdbob', d: 0.24, c: 999, dir: 'alternate', e: 'ease-in-out' }) : ''}">
  <ellipse rx="22" ry="15" fill="#e8434e" stroke="${INK}" stroke-width="3.5"/><circle cx="-18" cy="-8" r="12" fill="#e8434e" stroke="${INK}" stroke-width="3.5"/>
  <ellipse cx="-16" cy="2" rx="10" ry="9" fill="#ff9f43"/><polygon points="-28,-8 -40,-4 -28,-1" fill="#ffb300" stroke="${INK}" stroke-width="2.5"/><circle cx="-20" cy="-11" r="5.5" fill="#fff" stroke="${INK}" stroke-width="1.5"/><circle cx="-21.5" cy="-11" r="3.4" fill="${INK}"/><circle cx="-22.5" cy="-12.3" r="1.2" fill="#fff"/>
  ${flap ? `<g style="transform-origin:4px -2px;${an({ n: 'wingk', d: 0.12, c: 999, dir: 'alternate', e: 'ease-in-out' })}"><path d="M0 -4 Q18 -50 36 -26 Q16 -10 6 2Z" fill="#b8232d" stroke="${INK}" stroke-width="3"/></g>` : `<path d="M-2 -6 Q16 -16 26 -2 Q12 4 -2 2Z" fill="#b8232d" stroke="${INK}" stroke-width="3"/>`}
  <path d="M20 -2 L34 -10 L32 4Z" fill="#b8232d" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M-6 14 v8 M6 14 v8" stroke="#ffb300" stroke-width="3" stroke-linecap="round"/>
  ${withCroissant ? `<g transform="translate(-50 -4) scale(.5) rotate(-24)">${croissantLight}</g>` : ''}</g>`;

// camarades (Mimi la souris, Coin le caneton) : buste de face, bas du buste en (0,0)
export const pal = (kind, o = {}) => {
  const mouse = kind === 'mouse';
  const head = mouse ? '#b9bfcc' : '#ffd84a', shirt = mouse ? '#ff9fbf' : '#7cc8ff';
  const ears = mouse
    ? `<circle cx="-36" cy="-148" r="24" fill="${head}" stroke="${INK}" stroke-width="4"/><circle cx="-36" cy="-148" r="13" fill="#ffb3c6"/><circle cx="36" cy="-148" r="24" fill="${head}" stroke="${INK}" stroke-width="4"/><circle cx="36" cy="-148" r="13" fill="#ffb3c6"/>`
    : `<path d="M-6 -150 q4 -22 14 -18 q-8 4 -4 16z" fill="${head}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  const face = `${eyeStates([[-15, -116, 11, o.look ?? 1.5], [15, -116, 11, o.look ?? 1.5]], o.eyes || [])}
    ${mouse ? `<ellipse cx="0" cy="-100" rx="6" ry="4.5" fill="#ff7f9f" stroke="${INK}" stroke-width="2.5"/>${mouthStates(0, -92, o.talk || [], o.moods || [], 'calm')}
      <path d="M-14 -98 l-26 -4 M-14 -94 l-26 4 M14 -98 l26 -4 M14 -94 l26 4" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`
    : `${mouthStates(0, -88, o.talk || [], (o.moods || []).filter((m) => m[2] !== 'yawn'), 'calm')}<ellipse cx="0" cy="-98" rx="17" ry="8" fill="#ff9f43" stroke="${INK}" stroke-width="3"/>${(o.moods || []).filter((m) => m[2] === 'yawn').map(([a, b]) => vis(a, b, `<ellipse cx="0" cy="-83" rx="16" ry="18" fill="#8c2f3a" stroke="${INK}" stroke-width="4"/><ellipse cx="0" cy="-73" rx="8" ry="5" fill="#ff8fa3"/><ellipse cx="0" cy="-100" rx="18" ry="6" fill="#ff9f43" stroke="${INK}" stroke-width="3"/><ellipse cx="0" cy="-64" rx="14" ry="5" fill="#ff9f43" stroke="${INK}" stroke-width="3"/>`)).join('')}`}
    <ellipse cx="-27" cy="-100" rx="8" ry="5" fill="#ff8fa3" opacity=".8"/><ellipse cx="27" cy="-100" rx="8" ry="5" fill="#ff8fa3" opacity=".8"/>`;
  const dx0 = (o.turn && o.turn[0] && o.turn[0][2]) || 0;
  const turn = (o.turn || []).map(([a, b]) => ao({ n: 'palturn', d: b - a, t: a })).join(',');
  const giggle = (o.giggle || []).map(([a, b]) => ao({ n: 'giggle', d: 0.16, t: a, c: Math.round((b - a) / 0.16), dir: 'alternate' })).join(',');
  const jolt = (o.jolt || []).map((t) => ao({ n: 'jolt', d: 0.6, t })).join(',');
  return `<g style="${jolt ? 'animation:' + jolt : ''}"><g style="${giggle ? 'animation:' + giggle : ''}"><g style="--rot:${dx0 > 0 ? 12 : -12}deg;--dx:${dx0}px;${turn ? 'animation:' + turn : ''}">
    ${(o.walk || []).length ? [-1, 1].map((k, i) => `<g style="transform-origin:${k * 14}px 0px;${o.walk.map(([wa, wb]) => an({ n: 'palstep', d: 0.36, t: wa + i * 0.18, c: Math.max(1, Math.round((wb - wa) / 0.36)) })).join(';').replace(/;animation:/g, ',')}"><rect x="${k * 14 - 8}" y="-6" width="16" height="30" rx="8" fill="${shirt}" stroke="${INK}" stroke-width="4"/><ellipse cx="${k * 14 + 4}" cy="24" rx="13" ry="8" fill="${mouse ? '#ff9fbf' : '#ffb300'}" stroke="${INK}" stroke-width="4"/></g>`).join('') : ''}
    <rect x="-36" y="-80" width="72" height="84" rx="26" fill="${shirt}" stroke="${INK}" stroke-width="4"/>${o.arms || ''}
    <g style="transform-origin:0 -80px;animation:idlehead ${mouse ? 1.5 : 1.9}s ease-in-out infinite alternate">${ears}<circle cx="0" cy="-114" r="42" fill="${head}" stroke="${INK}" stroke-width="4"/>${face}${o.hat || ''}</g></g></g></g>`;
};

addKF(`@keyframes wingk{from{transform:rotate(-30deg)}to{transform:rotate(40deg) scaleY(.7)}}
@keyframes birdbob{from{transform:translateY(-3px)}to{transform:translateY(3px)}}
@keyframes palturn{0%{transform:translateX(0) rotate(0)}12%,88%{transform:translateX(var(--dx)) rotate(var(--rot))}100%{transform:translateX(0) rotate(0)}}
@keyframes palstep{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px) rotate(-8deg)}}
@keyframes giggle{from{transform:translateY(0)}to{transform:translateY(-6px)}}
@keyframes peck{0%,100%{transform:rotate(0)}35%{transform:translateX(7px) rotate(12deg)}55%{transform:translateX(-6px) rotate(-18deg)}}
@keyframes floaty{from{transform:translateY(0) rotate(-6deg)}to{transform:translateY(-8px) rotate(6deg)}}
@keyframes sparkle{0%{opacity:0;transform:scale(.2) rotate(0)}30%{opacity:1;transform:scale(1.2) rotate(40deg)}100%{opacity:0;transform:scale(.6) rotate(90deg)}}
@keyframes dizzy{from{transform:rotate(-7deg)}to{transform:rotate(7deg)}}
@keyframes orbit{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes puff{0%{opacity:0;transform:scale(.3)}25%{opacity:1;transform:scale(1.1)}100%{opacity:0;transform:scale(1.6) translateY(-30px)}}`);

// étoiles qui tournent (étourdi) autour de (0,0)
export const stars = (rx = 60) => `<g transform="scale(1 .35)"><g style="animation:orbit .9s linear infinite">${[0, 120, 240].map((a) => `<g transform="rotate(${a}) translate(${rx} 0) scale(1 2.8)"><path d="M0 -12 L3.5 -4 L12 -3 L5.5 3 L7.5 12 L0 7.5 L-7.5 12 L-5.5 3 L-12 -3 L-3.5 -4Z" fill="#ffd23f" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/></g>`).join('')}</g></g>`;

// nuage de poussière / sable : n bouffées autour de (0,0)
export const puff = (t, col = '#f3e1b0', n = 7, R = 70) => Array.from({ length: n }, (_, i) => {
  const a = (i / n) * Math.PI * 2, x = Math.cos(a) * R * 0.8, y = Math.sin(a) * R * 0.45 - 20;
  return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><g style="${an({ n: 'puff', d: 0.9, t: t + (i % 3) * 0.05, f: 'both' })}"><circle r="${30 + (i % 3) * 8}" fill="${col}" stroke="${INK}" stroke-width="3"/></g></g>`;
}).join('');

// Mme Escargot, la cantinière (regarde à gauche) ; talk = [[t0,t1]] ; o.toque
export const snail = (talk = [], o = {}) => `<g>
  <ellipse cx="10" cy="4" rx="120" ry="12" fill="#000" opacity=".2"/>
  <path d="M-110 0 Q-120 -30 -96 -40 L-70 -120 Q-66 -150 -40 -152 Q-10 -150 -14 -116 L-20 -40 L110 -36 Q130 -18 112 0Z" fill="#c9eba0" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <g transform="translate(40 -100)"><circle r="78" fill="#ff9f43" stroke="${INK}" stroke-width="5"/><path d="M0 0 m0 -8 a8 8 0 1 1 -8 8 a20 20 0 1 1 20 20 a36 36 0 1 1 -36 -36 a54 54 0 1 1 54 54" stroke="#c96a1c" stroke-width="7" fill="none" stroke-linecap="round"/></g>
  <g style="transform-origin:-60px -150px;animation:earidle 1.6s ease-in-out infinite alternate">
    <path d="M-62 -146 Q-70 -186 -84 -206 M-44 -148 Q-40 -190 -30 -212" stroke="${INK}" stroke-width="12" stroke-linecap="round" fill="none"/><path d="M-62 -146 Q-70 -186 -84 -206 M-44 -148 Q-40 -190 -30 -212" stroke="#c9eba0" stroke-width="6" stroke-linecap="round" fill="none"/>
    <g style="transform-origin:-84px -214px;animation:blink 4.2s 1s infinite"><circle cx="-84" cy="-214" r="15" fill="#fff" stroke="${INK}" stroke-width="3.5"/><circle cx="-88" cy="-213" r="8" fill="#2a1710"/><circle cx="-90" cy="-217" r="3" fill="#fff"/></g>
    <g style="transform-origin:-30px -220px;animation:blink 4.2s 1.1s infinite"><circle cx="-30" cy="-220" r="15" fill="#fff" stroke="${INK}" stroke-width="3.5"/><circle cx="-34" cy="-219" r="8" fill="#2a1710"/><circle cx="-36" cy="-223" r="3" fill="#fff"/></g>
    ${o.toque === false ? '' : `<g transform="translate(-58 -238) rotate(-8)"><rect x="-30" y="-18" width="60" height="24" rx="4" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="-20" cy="-30" r="18" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="2" cy="-40" r="22" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="22" cy="-28" r="17" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="-28" y="-20" width="56" height="12" fill="#fff"/></g>`}
  </g>
  <ellipse cx="-70" cy="-92" rx="10" ry="6" fill="#ff8fa3" opacity=".8"/>
  <path d="M-100 -78 Q-86 -66 -72 -78" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>
  ${talk.map(([a, b]) => vis(a, b, `<g style="transform-origin:-86px -74px;${an({ n: 'talk', d: 0.3, t: a, c: Math.max(1, Math.round((b - a) / 0.3)), dir: 'alternate' })}"><ellipse cx="-86" cy="-72" rx="11" ry="13" fill="#c4545c" stroke="${INK}" stroke-width="3.5"/></g>`)).join('')}</g>`;
