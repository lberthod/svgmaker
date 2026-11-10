// Thème « My body » : Mali montre ses propres parties du corps (gag « self »).
// La trompe de l'éléphant est son nez : Mali l'agite pour « Nose ».
import { INK, S } from '../engine.mjs'

const SKIN = '#FFD0A8', SKIN_D = '#F2A877', BLUSH = '#FF8FA3'

// un pied vu de dessus (x = centre, m = 1 pied droit / -1 pied gauche)
const foot = (x, m) => {
  const toes = [[-34, -112, 25], [6, -132, 20], [38, -126, 17], [62, -108, 15], [78, -84, 13]]
    .map(([tx, ty, r]) => `<circle cx="${x + m * tx}" cy="${ty}" r="${r}" fill="${SKIN}" ${S(8)}/>`).join('')
  return `${toes}
    <path d="M ${x - m * 50} -70 C ${x - m * 60} -110 ${x + m * 70} -110 ${x + m * 70} -40 C ${x + m * 74} 20 ${x + m * 50} 60 ${x + m * 54} 110 C ${x + m * 56} 160 ${x - m * 50} 165 ${x - m * 52} 110 C ${x - m * 54} 50 ${x - m * 70} -10 ${x - m * 50} -70 Z" fill="${SKIN}" ${S()}/>
    <ellipse cx="${x - m * 20}" cy="-40" rx="14" ry="34" transform="rotate(${m * 10} ${x - m * 20} -40)" fill="#fff" opacity=".55"/>
    <circle cx="${x + m * 18}" cy="40" r="16" fill="${BLUSH}" opacity=".6"/>`
}

// une oreille (m = 1 droite / -1 gauche)
const ear = (m) => `
  <path d="M ${m * 60} -120 C ${m * 175} -190 ${m * 230} -20 ${m * 160} 70 C ${m * 130} 110 ${m * 150} 165 ${m * 95} 160 C ${m * 50} 155 ${m * 60} 110 ${m * 70} 70 C ${m * 80} 30 ${m * 40} 0 ${m * 45} -60 C ${m * 47} -90 ${m * 52} -110 ${m * 60} -120 Z" fill="${SKIN}" ${S()}/>
  <path d="M ${m * 80} -80 C ${m * 150} -110 ${m * 175} -20 ${m * 130} 30 C ${m * 110} 50 ${m * 100} 20 ${m * 115} 0" fill="none" stroke="${SKIN_D}" stroke-width="14" stroke-linecap="round"/>
  <circle cx="${m * 108}" cy="125" r="14" fill="${BLUSH}" opacity=".7"/>
  <ellipse cx="${m * 155}" cy="-80" rx="12" ry="26" transform="rotate(${m * 30} ${m * 155} -80)" fill="#fff" opacity=".55"/>`

// un œil (x = centre)
const eye = (x) => `
  <path d="M ${x - 55} -110 l -14 -34 M ${x} -122 l 0 -38 M ${x + 55} -110 l 14 -34" fill="none" ${S(10)}/>
  <ellipse cx="${x}" cy="0" rx="78" ry="100" fill="#fff" ${S()}/>
  <circle cx="${x + 8}" cy="14" r="50" fill="#7A4B2A"/>
  <circle cx="${x + 8}" cy="14" r="28" fill="${INK}"/>
  <circle cx="${x + 26}" cy="-6" r="13" fill="#fff"/><circle cx="${x - 6}" cy="34" r="6" fill="#fff"/>`

export default {
  id: 'body',
  title: { en: 'My body', th: 'ร่างกายของฉัน', emoji: '👃', say: "Let's learn my body!" },
  color: '#FF6F91',
  words: [
    { en: 'Nose', say: 'โนส', th: 'จมูก', art: 'nose', color: '#FF8A3D', gag: { type: 'self', part: 'nose', sfx: 'toot' }, sound: 'Sniff sniff!' },
    { en: 'Ears', say: 'เอียร์ส', th: 'หู', art: 'ears', color: '#8E5BD9', gag: { type: 'self', part: 'ears', sfx: 'whoosh' }, sound: 'Flap!' },
    { en: 'Eyes', say: 'อายส์', th: 'ตา', art: 'eyes', color: '#1E9BE0', gag: { type: 'self', part: 'eyes', sfx: 'ding' }, sound: 'Peekaboo!' },
    { en: 'Mouth', say: 'เมาธ์', th: 'ปาก', art: 'mouth', color: '#F23B3B', gag: { type: 'self', part: 'mouth', sfx: 'giggle' }, sound: 'Yum yum!' },
    { en: 'Feet', say: 'ฟีท', th: 'เท้า', art: 'feet', color: '#3DBE5A', gag: { type: 'self', part: 'feet', sfx: 'boing' }, sound: 'Hop hop!' },
  ],
  art: {
    nose: `
      <path d="M 0 -165 C 40 -165 50 -70 80 -10 C 150 10 165 120 90 140 C 50 160 -50 160 -90 140 C -165 120 -150 10 -80 -10 C -50 -70 -40 -165 0 -165 Z" fill="${SKIN}" ${S()}/>
      <path d="M -60 70 C -80 70 -80 100 -50 102 M 60 70 C 80 70 80 100 50 102" fill="none" stroke="${SKIN_D}" stroke-width="10" stroke-linecap="round"/>
      <ellipse cx="-40" cy="108" rx="20" ry="13" fill="${INK}"/><ellipse cx="40" cy="108" rx="20" ry="13" fill="${INK}"/>
      <ellipse cx="-22" cy="-70" rx="16" ry="44" transform="rotate(12 -22 -70)" fill="#fff" opacity=".6"/>
      <circle cx="-100" cy="60" r="18" fill="${BLUSH}" opacity=".7"/><circle cx="100" cy="60" r="18" fill="${BLUSH}" opacity=".7"/>`,
    ears: `${ear(-1)}${ear(1)}`,
    eyes: `${eye(-88)}${eye(88)}`,
    mouth: `
      <path d="M -175 -50 Q 0 -10 175 -50 Q 165 150 0 155 Q -165 150 -175 -50 Z" fill="#C8243A" ${S()}/>
      <path d="M -150 -40 Q 0 -10 150 -40 L 140 5 Q 0 25 -140 5 Z" fill="#fff" ${S(7)}/>
      <path d="M -50 -22 L -48 15 M 50 -22 L 48 15" fill="none" stroke="#E8D9CC" stroke-width="7" stroke-linecap="round"/>
      <path d="M -85 140 Q -80 60 0 70 Q 80 60 85 140 Q 0 165 -85 140 Z" fill="#FF6F91" ${S(8)}/>
      <path d="M 0 80 L 0 125" stroke="#E2466F" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="-120" cy="-62" rx="30" ry="9" fill="#fff" opacity=".55"/>
      <path d="M -175 -50 q -18 -14 -30 -32 M 175 -50 q 18 -14 30 -32" fill="none" ${S(10)}/>`,
    feet: `${foot(-82, -1)}${foot(82, 1)}`,
  },
  quiz: { answer: 0, choices: [1, 0, 4], q: { en: 'Where is the nose?', th: 'จมูกอยู่ไหนนะ?' } },
}
