// Aides saison 5 (correctifs d'audit) : bulles opaques dès la première image, carton final unique.
import { INK, an, addKF } from '../lib/kit.mjs';

// Les bulles de lib/props.mjs entrent par un fondu « pop » (0 → 100 % d'opacité sur ~0,1 s) : une image tirée à l'instant exact de l'apparition
// montre une bulle grise et translucide. Ici : opaque dès la première image (le rebond de taille reste), fondu de sortie seulement sur la fin.
addKF(`@keyframes pops{0%{opacity:0;transform:scale(.55)}1%{opacity:1;transform:scale(.6)}8%{transform:scale(1.08)}12%{transform:scale(1)}97%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.97)}}`);
export const solid = (svg) => svg.replaceAll('animation:pop ', 'animation:pops ');

// carton final : « Roussin & Lino — Saison 5 », titre de l'épisode, annonce du suivant (casse : minuscule après les deux-points, sauf nom propre)
addKF(`@keyframes finin{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}`);
export const endCard5 = (t, title, next, cy = 130) => `<g style="transform-origin:640px ${cy}px;${an({ n: 'finin', d: 0.35, t, f: 'both' })}"><g transform="translate(640 ${cy})">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 5</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">${title}</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">${next}</text></g></g>`;
