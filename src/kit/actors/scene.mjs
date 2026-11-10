// svgkit · scène : le « tableau de bord » commun à tous les acteurs, gags et caméras d'une vidéo.
//
//   const s = createScene({ fmt: fixed(3), voice })   // voice = voice.json (durées + enveloppes réelles)
//   s.say(t, 'mali_en', 'Hi!')      réplique (→ script.json, lu par audio.py)
//   s.fx(t, 'boing')                bruitage
//   s.win('hop', 'hop', t, 0.5)     fenêtre d'animation CSS sur un calque (« nom durée ease délai »)
//   s.keyframe('@keyframes …')      règle CSS générée (chemins, caméra, synchro labiale…)
//   s.path('fly0', [[0, x, y, rot, scale, opacity], …])   trajectoire → @keyframes, retourne son nom
//
// Tout est déterministe : l'ordre des appels fixe l'ordre des règles et des répliques.
import { fixed } from '../core.mjs'

export function createScene({ fmt = fixed(3), voice = {} } = {}) {
  const f = fmt
  const s = {
    f,
    voice,
    lines: [], // { t, role, text }
    sfx: [], // { t, kind }
    layers: {}, // calque → [« nom durée ease délai »…]
    keyframes: [], // règles CSS générées
    front: [], // éléments dessinés au premier plan (au-dessus des acteurs)
    ids: {}, // compteurs d'identifiants (cam0, cam1…)

    say: (t, role, text) => { s.lines.push({ t: f(t), role, text }) },
    fx: (t, kind) => { s.sfx.push({ t: f(t), kind }) },
    voiceOf: (l) => voice[`${l.role}|${l.text}`],
    /** Durée d'une réplique : réelle si voice.json la connaît, sinon estimée d'après sa longueur. */
    durOf: (l) => s.voiceOf(l)?.dur ?? 0.09 * l.text.length + 0.3,

    layer: (name) => (s.layers[name] ??= []),
    win: (layer, name, t, dur, ease = 'ease-in-out') => { s.layer(layer).push(`${name} ${f(dur)}s ${ease} ${f(t)}s`) },
    /** `animation:` d'un calque (avec une animation de base éventuelle), ou « none ». */
    animList: (list, base = '') => `animation:${[base, ...list].filter(Boolean).join(',') || 'none'}`,

    keyframe: (css) => { s.keyframes.push(css) },
    nextId: (prefix) => { const n = s.ids[prefix] ?? 0; s.ids[prefix] = n + 1; return `${prefix}${n}` },
    path: (raw, pts) => {
      // nom CSS valide : « fall6.6 » (instant décimal) deviendrait une règle ignorée, l'objet resterait figé
      const name = String(raw).replace(/[^\w-]/g, '_')
      s.keyframe(`@keyframes ${name}{${pts.map(([p, x, y, r = 0, k = 1, o = 1]) => `${p}%{transform:translate(${x}px,${y}px) rotate(${r}deg) scale(${k});opacity:${o}}`).join('')}}`)
      return name
    },

    /** Script trié par instant (voix + bruitages), pour audio.py. */
    script: (id, duration) => ({ id, duration: f(duration), lines: s.lines.sort((a, b) => a.t - b.t), sfx: s.sfx.sort((a, b) => a.t - b.t) }),
  }
  return s
}
