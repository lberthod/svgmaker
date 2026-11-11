// Cour de récré réutilisable (créée pour l'épisode 3) : façade et cloche, palissade, marelle, grand arbre, buissons, toboggan, bac à sable.
import { W, H, INK, an, ao, vis, cloud } from './kit.mjs';
export function courtyard(O = {}) {
  O = { h: 10, m: 0, bell: 99, door: 99, doorClose: 99, ...O };
  const GROUND = 520;
  const TREE_X = 900;
  const BRANCH = [742, 334];      // oiseau perché (centre du corps) sur la branche basse
  const TOP = [905, 52];          // oiseau perché tout en haut
  // toboggan : plateforme y 410 (x 210–320), toboggan = Bézier cubique
  const CH = [[320, 410], [395, 410], [430, 602], [520, 606]];
  const bez = (v) => { const m = 1 - v; const k = [m * m * m, 3 * m * m * v, 3 * m * v * v, v * v * v]; return [0, 1].map((i) => k.reduce((s, c, j) => s + c * CH[j][i], 0)); };
  const bezAng = (v) => { const [a, b] = bez(Math.max(0, v - 0.01)), [c, d] = bez(Math.min(1, v + 0.01)); return (Math.atan2(d - b, c - a) * 180) / Math.PI; };
  const clockEl = `<g transform="translate(85 300)"><circle r="40" fill="#fff" stroke="${INK}" stroke-width="6"/>
    ${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-30" x2="0" y2="${i % 3 ? -26 : -22}" stroke="${INK}" stroke-width="${i % 3 ? 2 : 3.5}" transform="rotate(${i * 30})"/>`).join('')}
    <line x1="0" y1="0" x2="0" y2="-28" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" transform="rotate(${O.m * 6})"/><line x1="0" y1="0" x2="0" y2="-18" stroke="${INK}" stroke-width="5" stroke-linecap="round" transform="rotate(${(O.h % 12) * 30 + O.m * 0.5})"/><circle r="4" fill="#e8434e"/></g>`;
  const bellEl = `<g transform="translate(85 92)"><rect x="-34" y="-34" width="68" height="64" fill="#e8b27a" stroke="${INK}" stroke-width="4"/><path d="M-44 -34 L0 -70 L44 -34Z" fill="#c4545c" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <rect x="-24" y="-24" width="48" height="48" rx="6" fill="#6b4a2e"/>
    <g style="transform-origin:0px -22px;${an({ n: 'bellrock', d: 0.18, t: O.bell, c: 8, dir: 'alternate', e: 'ease-in-out' })}"><path d="M-17 14 Q-17 -20 0 -20 Q17 -20 17 14Z" fill="#ffd23f" stroke="${INK}" stroke-width="3.5"/><circle cy="18" r="5" fill="#b97520" stroke="${INK}" stroke-width="2.5"/></g>
    ${vis(O.bell, O.bell + 1.4, `<path d="M-52 -14 q-12 16 0 32 M52 -14 q12 16 0 32 M-66 -22 q-18 26 0 48 M66 -22 q18 26 0 48" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`)}</g>`;
  const facade = `<g><rect x="-10" y="150" width="180" height="${GROUND + 150 - 150}" fill="#f6cf8f" stroke="${INK}" stroke-width="5"/>
    <path d="M-20 160 L80 50 L182 160Z" fill="#e8434e" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    ${bellEl}
    <rect x="20" y="370" width="50" height="44" rx="5" fill="#bfe6ff" stroke="${INK}" stroke-width="4"/><rect x="100" y="370" width="50" height="44" rx="5" fill="#bfe6ff" stroke="${INK}" stroke-width="4"/>
    ${clockEl}
    <rect x="40" y="460" width="90" height="${GROUND + 150 - 460}" fill="#3a2418"/><g style="transform-origin:40px 0;${an({ n: 'dooropen', d: 0.25, t: O.door, f: 'forwards' })},${ao({ n: 'doorclose', d: 0.2, t: O.doorClose, f: 'forwards' })}"><rect x="40" y="460" width="90" height="${GROUND + 150 - 460}" rx="8" fill="#8a5a33" stroke="${INK}" stroke-width="5"/><circle cx="116" cy="560" r="6" fill="#ffd23f" stroke="${INK}" stroke-width="2.5"/></g>
    <rect x="30" y="440" width="110" height="22" rx="4" fill="#fff" stroke="${INK}" stroke-width="3.5"/><text x="85" y="457" style="font-size:16px;fill:${INK}">ÉCOLE</text></g>`;
  const fence = `<g>${Array.from({ length: 22 }, (_, i) => { const x = 180 + i * 52; return `<path d="M${x} ${GROUND + 6} V${GROUND - 70} l12 -14 l12 14 V${GROUND + 6}Z" fill="#fff4dc" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`; }).join('')}
    <rect x="170" y="${GROUND - 54}" width="1120" height="12" fill="#fff4dc" stroke="${INK}" stroke-width="3.5"/><rect x="170" y="${GROUND - 20}" width="1120" height="12" fill="#fff4dc" stroke="${INK}" stroke-width="3.5"/></g>`;
  const hop = `<g transform="translate(1035 700)" opacity=".85">${[[0, 0], [70, 0], [140, -14], [140, 14]].map(([x, y], i) => `<rect x="${x - 30}" y="${y - 12}" width="60" height="26" fill="none" stroke="#fff" stroke-width="5" transform="skewX(-30)"/><text x="${x - 6}" y="${y + 8}" style="font-size:20px;fill:#fff">${i + 1}</text>`).join('')}</g>`;
  const bg = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc8ff"/><stop offset="1" stop-color="#d9f2ff"/></linearGradient></defs>
    <clipPath id="doorclip"><rect x="120" y="-400" width="2400" height="1600"/></clipPath><clipPath id="sandclip"><rect x="-400" y="-400" width="2400" height="1052"/></clipPath>
    <rect width="${W}" height="${GROUND}" fill="url(#sky)"/>
    <g transform="translate(330 80)"><g style="animation:spin 24s linear infinite">${Array.from({ length: 10 }, (_, i) => `<path d="M0 -62 L8 -46 L-8 -46Z" fill="#ffd23f" transform="rotate(${i * 36})"/>`).join('')}</g><circle r="38" fill="#ffd23f" stroke="${INK}" stroke-width="4"/><path d="M-12 6 q12 12 24 0" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="-12" cy="-6" r="3.5" fill="${INK}"/><circle cx="12" cy="-6" r="3.5" fill="${INK}"/></g>
    <g style="animation:cdrift 14s ease-in-out infinite alternate">${cloud(520, 130, 0.8)}${cloud(1180, 90, 0.6)}${cloud(760, 60, 0.45, 0.9)}</g>
    <path d="M170 ${GROUND - 40} Q420 ${GROUND - 140} 700 ${GROUND - 60} Q960 ${GROUND - 150} 1290 ${GROUND - 70} V${GROUND} H170Z" fill="#9fdc7c"/>
    ${fence}
    <rect y="${GROUND}" width="${W}" height="${H - GROUND}" fill="#e9d3a8"/>
    <rect y="${GROUND}" width="${W}" height="16" fill="#8fd16e"/>
    ${Array.from({ length: 9 }, (_, i) => `<ellipse cx="${200 + i * 130}" cy="${GROUND + 60 + (i % 3) * 40}" rx="10" ry="4" fill="#d9bf8f"/>`).join('')}
    ${hop}
    ${facade}`;
  
  const tree = `<g>
    <path d="M${TREE_X - 42} 632 Q${TREE_X - 30} 470 ${TREE_X - 24} 300 L${TREE_X + 24} 300 Q${TREE_X + 30} 470 ${TREE_X + 42} 632Z" fill="#9b6a3c" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M${TREE_X - 8} 600 q6 -60 -2 -120 M${TREE_X + 14} 560 q-4 -40 4 -80" stroke="#7d5229" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M${TREE_X - 22} 410 Q880 392 ${BRANCH[0] - 22} ${BRANCH[1] + 26}" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M${TREE_X - 22} 410 Q880 392 ${BRANCH[0] - 22} ${BRANCH[1] + 26}" stroke="#9b6a3c" stroke-width="13" fill="none" stroke-linecap="round"/>
    <g transform="translate(${BRANCH[0] - 30} ${BRANCH[1] + 20})"><ellipse rx="22" ry="12" fill="#52c468" stroke="${INK}" stroke-width="3.5" transform="rotate(-20)"/></g>
    <g style="transform-origin:${TREE_X}px 300px;animation:sway 3s ease-in-out infinite alternate">
    ${[[TREE_X, 200, 125, '#3fae55'], [TREE_X - 112, 232, 82, '#3fae55'], [TREE_X + 118, 240, 86, '#3fae55'], [TREE_X + 10, 290, 88, '#3fae55']].map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${INK}" stroke-width="5"/>`).join('')}
    ${[[TREE_X, 200, 117], [TREE_X - 112, 232, 74], [TREE_X + 118, 240, 78], [TREE_X + 10, 290, 80]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#3fae55"/>`).join('')}
    ${[[TREE_X - 40, 160, 40], [TREE_X + 70, 210, 34], [TREE_X - 120, 220, 28], [TREE_X + 30, 290, 30]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#52c468"/>`).join('')}
    ${[[TREE_X - 60, 250], [TREE_X + 90, 170], [TREE_X - 10, 130], [TREE_X + 120, 280]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#ff6b6b" stroke="${INK}" stroke-width="2.5"/>`).join('')}</g></g>`;
  const bush = (x, y, r) => `<g><circle cx="${x - r * 0.6}" cy="${y}" r="${r * 0.75}" fill="#3fae55" stroke="${INK}" stroke-width="4"/><circle cx="${x + r * 0.6}" cy="${y}" r="${r * 0.75}" fill="#3fae55" stroke="${INK}" stroke-width="4"/><circle cx="${x}" cy="${y - r * 0.35}" r="${r}" fill="#3fae55" stroke="${INK}" stroke-width="4"/><ellipse cx="${x}" cy="${y + 4}" rx="${r * 1.2}" ry="${r * 0.5}" fill="#3fae55"/></g>`;
  const bushes = bush(TREE_X - 135, 622, 44) + bush(TREE_X + 135, 624, 46);
  
  const slide = (() => {
    const d = `M${CH[0][0]} ${CH[0][1]} C${CH[1][0]} ${CH[1][1]} ${CH[2][0]} ${CH[2][1]} ${CH[3][0]} ${CH[3][1]}`;
    return `<g>
    <path d="M215 410 V668 M318 410 V668 M440 560 V668" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M215 410 V668 M318 410 V668 M440 560 V668" stroke="#3b82f6" stroke-width="6" stroke-linecap="round"/>
    <path d="M208 400 V668 M250 400 V668" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M208 400 V668 M250 400 V668" stroke="#e8434e" stroke-width="5" stroke-linecap="round"/>
    ${Array.from({ length: 6 }, (_, i) => `<path d="M208 ${450 + i * 40} H250" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M208 ${450 + i * 40} H250" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`).join('')}
    <rect x="204" y="402" width="124" height="16" rx="5" fill="#ffd23f" stroke="${INK}" stroke-width="4"/>
    <path d="M320 410 V350 M210 404 V350 M210 352 H320" stroke="${INK}" stroke-width="11" stroke-linecap="round" fill="none"/><path d="M320 410 V350 M210 404 V350 M210 352 H320" stroke="#e8434e" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path d="${d}" stroke="${INK}" stroke-width="38" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#ffd23f" stroke-width="28" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#fff3a6" stroke-width="7" fill="none" stroke-linecap="round" transform="translate(0 -7)"/></g>`;
  })();
  
  // bac à sable et château de Coin
  const sandBack = `<g><path d="M470 600 L760 600 L770 640 L460 640Z" fill="#b97a44" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M482 608 L748 608 L758 650 L472 650Z" fill="#f3d58c"/>
    <circle cx="500" cy="630" r="6" fill="#e6c272"/><circle cx="720" cy="624" r="5" fill="#e6c272"/></g>`;
  const sandFront = `<g><rect x="452" y="650" width="326" height="26" rx="6" fill="#c98a4e" stroke="${INK}" stroke-width="5"/><path d="M470 662 h40 M560 664 h50 M680 662 h40" stroke="#a46a34" stroke-width="3" stroke-linecap="round"/></g>`;
  return { GROUND, TREE_X, BRANCH, TOP, CH, bez, bezAng, bg, tree, bush, bushes, slide, sandBack, sandFront, facade };
}
