// svgkit · synchronisation labiale : la bouche d'un acteur suit l'enveloppe RÉELLE de sa voix.
//
// voice.json (produit par audio.py) donne pour chaque réplique sa durée et son enveloppe de volume
// à 30 i/s ; on en tire une keyframe par image (ouverture verticale et largeur de la bouche).
// Sans voice.json (premier passage), la bouche bat à 0,16 s (animation « talk » du gabarit).

/**
 * Animations de bouche pour les répliques `speaking` (dans l'ordre), à mettre sur l'élément bouche.
 * Ajoute à la scène les @keyframes ls0, ls1… nécessaires.
 */
export function lipAnimations(s, speaking) {
  const f = s.f
  return speaking.map((l, i) => {
    const v = s.voiceOf(l)
    if (!v || v.env.length < 2) {
      const n = Math.max(2, Math.round(s.durOf(l) / 0.16) & ~1)
      return `talk 0.16s ease-in-out ${f(l.t)}s ${n} alternate`
    }
    const n = v.env.length
    s.keyframe(`@keyframes ls${i}{${v.env.map((e, k) => `${f((k / (n - 1)) * 100)}%{opacity:1;transform:scale(${f(0.75 + 0.3 * e)},${f(0.1 + 1.05 * e)})}`).join('')}}`)
    return `ls${i} ${f(v.dur)}s linear ${f(l.t)}s`
  })
}

/** Vrai si l'une des répliques `speaking` chevauche [t, t + d]. */
export const speakingDuring = (s, speaking, t, d) => speaking.some((l) => l.t < t + d && l.t + s.durOf(l) > t)
