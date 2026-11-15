// svgkit · rayons de lumière derrière un héros (comme dans les vidéos d'histoire sur carte) : halo coloré + rayons
// blancs qui tournent lentement. rays({ id, r, color }) → SVG à placer (centré en 0,0) derrière le personnage.
import { fixed } from './core.mjs'

const f = fixed(2)
export const RAYS_CSS = '@keyframes aspin{to{transform:rotate(360deg)}}'

/** n rayons (un sur deux), rayon r en unités locales, fondus vers l'extérieur. */
export function rays({ id, r = 300, color = '#FFFFFF', n = 22, opacity = 0.32 }) {
  const wedge = (i) => {
    const a0 = (i / n) * 2 * Math.PI, a1 = a0 + (Math.PI / n)
    return `M0 0 L${f(Math.cos(a0) * r)} ${f(Math.sin(a0) * r)} A${r} ${r} 0 0 1 ${f(Math.cos(a1) * r)} ${f(Math.sin(a1) * r)} Z`
  }
  return `<defs><radialGradient id="${id}-h" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="${r}"><stop offset="0" stop-color="${color}" stop-opacity=".95"/><stop offset=".55" stop-color="${color}" stop-opacity=".45"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>
  <radialGradient id="${id}-w" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="${r}"><stop offset="0" stop-color="#fff" stop-opacity="${opacity}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
  <circle r="${r}" fill="url(#${id}-h)"/>
  <g style="transform-box:fill-box;transform-origin:center;animation:aspin 46s linear infinite"><path d="${Array.from({ length: n }, (_, i) => wedge(i)).join('')}" fill="url(#${id}-w)"/></g>`
}
