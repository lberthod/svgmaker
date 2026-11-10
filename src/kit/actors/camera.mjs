// svgkit · caméra : mouvements appliqués au calque « cam » d'une scène (tout ce qui est « dans le monde »).
//   <g style="${cameraStyle(s)}"> … décor, acteurs … </g>   (l'interface reste hors caméra)

/** Zoom bref vers (cx, cy), facteur k : monte en 22 %, tient, revient à 78 %. */
export function punch(s, t, dur, cx, cy, k = 1.12) {
  const n = s.nextId('cam'), z = `translate(${cx}px,${cy}px) scale(${k}) translate(${-cx}px,${-cy}px)`
  s.keyframe(`@keyframes ${n}{0%,100%{transform:none}22%,78%{transform:${z}}}`)
  s.win('cam', n, t, dur, 'ease-in-out')
}

/** Tremblement d'amplitude `a` px qui s'amortit. */
export function quake(s, t, dur, a = 16) {
  const f = s.f, n = s.nextId('cam')
  const steps = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((p, i) => {
    const k = (1 - p / 100) * a, x = i % 2 ? k : -k, y = i % 3 ? -k * 0.6 : k * 0.6
    return `${p}%{transform:translate(${f(p === 100 ? 0 : x)}px,${f(p === 100 ? 0 : y)}px)}`
  })
  s.keyframe(`@keyframes ${n}{${steps.join('')}}`)
  s.win('cam', n, t, dur, 'linear')
}

/** Style du groupe caméra. */
export const cameraStyle = (s) => `animation:${s.layer('cam').join(',') || 'none'}`

/** Nombre de mouvements de caméra créés. */
export const cameraMoves = (s) => s.ids.cam ?? 0
