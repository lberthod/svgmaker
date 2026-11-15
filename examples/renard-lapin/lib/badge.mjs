// Badge d'heure unique de la série : pastille fixe en haut à gauche (espace écran, hors caméra), même taille dans tous les épisodes.
// Usage : dans le SVG, après la caméra et avant les bulles : ${timeBadge(7, 30)}  (heure 0-23, minutes 0-59)
const INK = '#3a2418';
export function timeBadge(h, m = 0, { x = 24, y = 24 } = {}) {
  const txt = `${h} h ${String(m).padStart(2, '0')}`.replace(' 00', m === 0 ? '' : ' 00');
  const w = 70 + txt.length * 19;
  const a = ((h % 12) + m / 60) * 30 - 90, b = m * 6 - 90, rad = (d) => (d * Math.PI) / 180;
  const hx = (Math.cos(rad(a)) * 9).toFixed(1), hy = (Math.sin(rad(a)) * 9).toFixed(1);
  const mx = (Math.cos(rad(b)) * 13).toFixed(1), my = (Math.sin(rad(b)) * 13).toFixed(1);
  return `<g id="timebadge" transform="translate(${x} ${y})">
  <rect width="${w}" height="56" rx="28" fill="#fff" stroke="${INK}" stroke-width="5"/>
  <g transform="translate(32 28)"><circle r="17" fill="#fffbe8" stroke="${INK}" stroke-width="3.5"/><path d="M0 0L${hx} ${hy}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M0 0L${mx} ${my}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><circle r="2.5" fill="${INK}"/></g>
  <text x="${58 + (w - 58) / 2}" y="39" text-anchor="middle" class="bt" style="font-size:30px">${txt}</text></g>`;
}
