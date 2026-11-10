// Thème « Colors » : 5 taches de peinture-personnages, toutes de la même forme,
// pour que l'enfant comprenne que c'est la COULEUR qui change.
import { S, face, f } from '../engine.mjs'

// contour lissé (Catmull-Rom → Bézier) d'une tache à `n` bosses
function blob(n, r, amp, rot = 0) {
  const N = n * 4
  const pts = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * 2 * Math.PI + rot
    const rr = r + amp * Math.cos(n * (a - rot))
    return [Math.cos(a) * rr, Math.sin(a) * rr * 0.95]
  })
  let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C ${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`
  }
  return d + ' Z'
}

// une tache de peinture souriante : corps, coulure, gouttelettes, reflet, visage
const splat = (c, n, rot, drops) => `
  <path d="M 40 120 Q 52 185 62 200 Q 70 225 48 225 Q 28 225 34 200 Q 40 170 20 120 Z" fill="${c}" ${S()}/>
  <path d="${blob(n, 160, 18, rot)}" fill="${c}" ${S()}/>
  ${drops.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${S(9)}/>`).join('')}
  <ellipse cx="-78" cy="-78" rx="22" ry="40" transform="rotate(40 -78 -78)" fill="#fff" opacity=".6"/>
  <circle cx="-38" cy="-118" r="9" fill="#fff" opacity=".6"/>
  ${face(5)}`

const art = {
  red: splat('#F23B3B', 6, 0.2, [[-180, -110, 18], [175, -60, 14]]),
  blue: splat('#1FA2F2', 7, -0.1, [[178, -120, 17], [-182, 30, 13]]),
  yellow: splat('#FFD21A', 5, 0.5, [[-170, 90, 16], [168, -128, 14]]),
  green: splat('#2FBF4A', 6, -0.3, [[182, 60, 16], [-160, -145, 13]]),
  pink: splat('#FF6FB5', 7, 0.35, [[-182, -40, 16], [150, -150, 14]]),
}

export default {
  id: 'colors',
  title: { en: 'Colors', th: 'สี', emoji: '🎨', say: "Let's learn colors!" },
  color: '#8E5BD9',
  wordColor: 'own', // le mot s'écrit dans sa propre couleur (pas d'arc-en-ciel trompeur)
  words: [
    { en: 'Red', say: 'เร้ด', th: 'สีแดง', art: 'red', color: '#F23B3B', gag: { type: 'bonk', sfx: 'splash' }, sound: 'Splat!' },
    { en: 'Blue', say: 'บลู', th: 'สีฟ้า', art: 'blue', color: '#1FA2F2', gag: { type: 'splash', sfx: 'splash', bubble: false, scale: 0.66 }, sound: 'Splish!' },
    { en: 'Yellow', say: 'เยล-โล่ว', th: 'สีเหลือง', art: 'yellow', color: '#F2B705', gag: { type: 'rise', glasses: true }, sound: 'So bright!' },
    { en: 'Green', say: 'กรีน', th: 'สีเขียว', art: 'green', color: '#2FBF4A', gag: { type: 'run', sfx: 'boing' }, sound: 'Boing!' },
    { en: 'Pink', say: 'พิงค์', th: 'สีชมพู', art: 'pink', color: '#FF6FB5', gag: { type: 'float', balloon: '#FF6FB5', scale: 0.7, sfx: 'pop' }, sound: 'Pop!' },
  ],
  art,
  quiz: { answer: 0, choices: [2, 0, 1], q: { en: 'Where is red?', th: 'สีแดงอยู่ไหนนะ?' } },
}
