// Thème « Fruits » : banane, mangue, orange, pastèque, raisins.
import { INK, S, face } from '../engine.mjs'

const leaf = (x, y, rot, k = 1) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k})">
  <path d="M 0 0 Q 45 -55 105 -20 Q 50 30 0 0 Z" fill="#3DBE5A" ${S(9)}/>
  <path d="M 12 -4 Q 50 -14 86 -18" fill="none" stroke="#2E9446" stroke-width="7" stroke-linecap="round"/></g>`

const GRAPES = [
  [-118, -95], [-40, -100], [40, -100], [118, -95],
  [-80, -15], [0, -20], [80, -15],
  [-40, 65], [40, 65],
  [0, 140],
]

export default {
  id: 'fruits',
  title: { en: 'Fruits', th: 'ผลไม้', emoji: '🍌', say: "Let's learn fruits!" },
  color: '#F2B705',
  words: [
    { en: 'Banana', say: 'บะ-นา-น่า', th: 'กล้วย', art: 'banana', color: '#F2B705',
      gag: { type: 'bonk', sfx: 'bonk' }, sound: 'Bonk!' },
    { en: 'Mango', say: 'แม็ง-โก', th: 'มะม่วง', art: 'mango', color: '#3DBE5A',
      gag: { type: 'pop', sfx: 'sparkle' }, sound: 'Ta-da!' },
    { en: 'Orange', say: 'ออ-เร้นจ์', th: 'ส้ม', art: 'orange', color: '#FF8A3D',
      gag: { type: 'fly', sfx: 'whoosh' }, sound: 'Wheee!' },
    { en: 'Watermelon', say: 'วอ-เทอ-เมล-ลอน', th: 'แตงโม', art: 'watermelon', color: '#F23B3B',
      gag: { type: 'run', sfx: 'boing' }, sound: 'Boing boing!' },
    { en: 'Grapes', say: 'เกรปส์', th: 'องุ่น', art: 'grapes', color: '#8E5BD9',
      gag: { type: 'float', balloon: '#3DBE5A', sfx: 'giggle' }, sound: 'Yum yum!' },
  ],
  art: {
    banana: `
      <path d="M 170 -95 L 196 -150" stroke="#7A4B2A" stroke-width="26" stroke-linecap="round"/>
      <path d="M -190 -75 C -160 205 160 205 185 -95 C 110 15 -110 15 -190 -75 Z" fill="#FFD93B" ${S()}/>
      <path d="M -150 -20 C -90 60 90 60 150 -30" fill="none" stroke="#E8B400" stroke-width="10" stroke-linecap="round"/>
      <circle cx="-188" cy="-74" r="10" fill="#7A4B2A"/>
      <ellipse cx="-120" cy="40" rx="16" ry="34" transform="rotate(-40 -120 40)" fill="#fff" opacity=".55"/>
      ${face(65)}`,
    mango: `
      <g transform="rotate(-28)">
        <path d="M 10 -185 Q 22 -205 42 -212" fill="none" stroke="#7A4B2A" stroke-width="16" stroke-linecap="round"/>
        <path d="M 10 -190 C 120 -200 150 -60 135 40 C 120 150 60 210 -10 205 C -95 200 -130 120 -125 20 C -120 -80 -90 -180 10 -190 Z" fill="#FFC531" ${S()}/>
        <ellipse cx="70" cy="-105" rx="45" ry="60" transform="rotate(15 70 -105)" fill="#FF7A3D" opacity=".5"/>
        <ellipse cx="-70" cy="-80" rx="20" ry="48" transform="rotate(10 -70 -80)" fill="#fff" opacity=".55"/>
      </g>
      ${leaf(-70, -175, -150, 0.85)}
      ${face(25)}`,
    orange: `
      <path d="M 0 -145 Q 0 -170 10 -185" fill="none" stroke="#7A4B2A" stroke-width="16" stroke-linecap="round"/>
      ${leaf(8, -178, -15)}
      <circle r="155" fill="#FF8A1E" ${S()}/>
      ${[[-95, -70], [-20, -110], [70, -95], [110, -30], [-120, 60], [115, 75], [-60, 120], [55, 125], [0, -60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#E06A00"/>`).join('')}
      <ellipse cx="-80" cy="-75" rx="22" ry="42" transform="rotate(35 -80 -75)" fill="#fff" opacity=".55"/>
      ${face(20)}`,
    watermelon: `
      <path d="M -205 -95 A 205 205 0 0 0 205 -95 Z" fill="#2E9446" ${S()}/>
      <path d="M -180 -95 A 180 180 0 0 0 180 -95 Z" fill="#D8F5B0"/>
      <path d="M -160 -95 A 160 160 0 0 0 160 -95 Z" fill="#FF4D5E" ${S(8)}/>
      ${[[-140, -72], [140, -72], [-100, -82], [100, -82], [-118, -22], [118, -22]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="11" fill="${INK}"/>`).join('')}
      <path d="M -140 -110 L 140 -110" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".5"/>
      ${face(-45)}`,
    grapes: `
      <path d="M 0 -140 Q 2 -175 -12 -205" fill="none" stroke="#7A4B2A" stroke-width="16" stroke-linecap="round"/>
      ${leaf(0, -165, -20, 0.9)}
      ${GRAPES.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="56" fill="#A56BE0" ${S(10)}/>${i === 5 ? '' : `<ellipse cx="${x - 20}" cy="${y - 22}" rx="10" ry="16" transform="rotate(30 ${x - 20} ${y - 22})" fill="#fff" opacity=".55"/>`}`).join('')}
      ${face(-10)}`,
  },
  quiz: { answer: 1, choices: [3, 1, 4], q: { en: 'Find the mango!', th: 'มะม่วงอยู่ไหนนะ?' } }, // phrase courte : « Where is the watermelon/mango? » déborde des marges
}
