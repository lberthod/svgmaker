// Thème « Food » : riz, œuf, lait, pain, gâteau (dessins dans le thème, style Mali : contours épais, visages souriants).
import { INK, S, face } from '../engine.mjs'

const shine = (cx, cy, rx, ry, rot = 0) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" fill="#fff" opacity=".55"/>`

// bol bleu rempli d'un dôme de riz blanc, vapeur au-dessus ; visage sur le riz (le gag box cache le bas de l'objet)
const rice = `
  <path d="M -60 -175 Q -80 -195 -60 -215 Q -40 -235 -60 -250" fill="none" stroke="#C9D6E3" stroke-width="12" stroke-linecap="round"/>
  <path d="M 60 -175 Q 40 -195 60 -215 Q 80 -235 60 -250" fill="none" stroke="#C9D6E3" stroke-width="12" stroke-linecap="round"/>
  <path d="M -165 -10 C -165 -110 -90 -160 0 -160 C 90 -160 165 -110 165 -10 Z" fill="#FFFDF5" ${S()}/>
  <g fill="none" ${S(7)}>
    <path d="M -150 -40 q 12 -6 22 0"/><path d="M 120 -40 q 12 -6 22 0"/><path d="M -30 -145 q 12 -6 22 0"/>
    <path d="M 60 -135 q 12 -6 22 0"/><path d="M -110 -110 q 12 -6 22 0"/>
  </g>
  ${shine(-125, -80, 12, 22, 40)}
  <path d="M -200 -15 L 200 -15 C 195 100 120 165 0 165 C -120 165 -195 100 -200 -15 Z" fill="#2E8BFF" ${S()}/>
  <path d="M -60 165 L -50 195 L 50 195 L 60 165" fill="#1F6FD6" ${S()}/>
  <path d="M -185 15 L 185 15" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".7"/>
  ${face(-88)}`

// œuf entier, crème, un petit éclat brillant
const egg = `
  <path d="M 0 -195 C 95 -195 150 -60 150 40 C 150 140 85 195 0 195 C -85 195 -150 140 -150 40 C -150 -60 -95 -195 0 -195 Z" fill="#FFF3D6" ${S()}/>
  <ellipse cx="0" cy="145" rx="90" ry="26" fill="#F5D9A8" opacity=".6"/>
  ${shine(-75, -70, 22, 50, 25)}
  ${face(40)}`

// brique de lait : façade blanche, toit bleu, goutte de lait
const milk = `
  <path d="M -120 -90 L -80 -175 L 80 -175 L 120 -90 Z" fill="#2E8BFF" ${S()}/>
  <path d="M -80 -175 L -80 -215 L 80 -215 L 80 -175" fill="#FFFFFF" ${S()}/>
  <path d="M -135 -90 L 135 -90 L 135 190 L -135 190 Z" fill="#FFFFFF" ${S()}/>
  <path d="M -135 120 L 135 120 L 135 190 L -135 190 Z" fill="#2E8BFF" ${S()}/>
  <path d="M 0 -78 C 22 -50 32 -32 32 -18 C 32 0 18 10 0 10 C -18 10 -32 0 -32 -18 C -32 -32 -22 -50 0 -78 Z" fill="#7CC4FF" ${S(8)}/>
  <circle cx="-95" cy="155" r="10" fill="#fff"/><circle cx="-60" cy="155" r="10" fill="#fff"/><circle cx="95" cy="155" r="10" fill="#fff"/><circle cx="60" cy="155" r="10" fill="#fff"/>
  ${shine(-105, -20, 12, 45)}
  ${face(55)}`

// tranche de pain de mie : croûte dorée, mie claire
const bread = `
  <path d="M -150 190 L -150 -40 C -200 -60 -200 -190 -90 -195 C -50 -215 50 -215 90 -195 C 200 -190 200 -60 150 -40 L 150 190 Z" fill="#C8833A" ${S()}/>
  <path d="M -118 160 L -118 -62 C -160 -80 -158 -165 -82 -165 C -45 -185 45 -185 82 -165 C 158 -165 160 -80 118 -62 L 118 160 Z" fill="#FFE2A8" stroke="#E0A55A" stroke-width="8" stroke-linejoin="round"/>
  <g fill="#E8B96E"><circle cx="-60" cy="-110" r="6"/><circle cx="55" cy="-125" r="6"/><circle cx="85" cy="125" r="6"/><circle cx="-80" cy="120" r="6"/></g>
  ${shine(-95, -120, 14, 26, 30)}
  ${face(30)}`

// gâteau d'anniversaire à deux étages, glaçage qui coule, bougie et cerise
const cake = `
  <path d="M 0 -150 L 0 -205" fill="none" ${S(8)}/>
  <g transform="translate(0 -95)"><path d="M -14 -55 L 14 -55 L 14 0 L -14 0 Z" fill="#7CC4FF" ${S(8)}/></g>
  <path d="M 0 -250 C 22 -225 22 -200 0 -195 C -22 -200 -22 -225 0 -250 Z" fill="#FFC93C" stroke="#FF8A3D" stroke-width="7" stroke-linejoin="round"/>
  <path d="M -185 30 L 185 30 L 185 180 C 185 195 175 200 160 200 L -160 200 C -175 200 -185 195 -185 180 Z" fill="#FF6F91" ${S()}/>
  <path d="M -120 -95 L 120 -95 L 120 30 L -120 30 Z" fill="#FF9BB5" ${S()}/>
  <path d="M -125 -100 L 125 -100 L 125 -60 Q 105 -40 90 -60 Q 70 -20 50 -60 Q 25 -35 0 -60 Q -25 -25 -50 -60 Q -70 -35 -90 -60 Q -105 -40 -125 -60 Z" fill="#FFFDF5" ${S(9)}/>
  <path d="M -190 25 L 190 25 L 190 60 Q 170 85 150 60 Q 125 100 100 60 Q 75 80 50 60 Q 25 100 0 60 Q -25 85 -50 60 Q -75 100 -100 60 Q -125 80 -150 60 Q -170 85 -190 60 Z" fill="#FFFDF5" ${S(9)}/>
  <circle cx="-150" cy="160" r="9" fill="#FFC93C"/><circle cx="150" cy="160" r="9" fill="#3DBE5A"/><circle cx="-160" cy="100" r="8" fill="#2E8BFF"/><circle cx="160" cy="100" r="8" fill="#8E5BD9"/>
  <circle cx="75" cy="-118" r="22" fill="#F23B3B" ${S(8)}/>
  <path d="M 75 -140 Q 80 -165 100 -175" fill="none" stroke="#3DBE5A" stroke-width="7" stroke-linecap="round"/>
  ${shine(-95, -30, 10, 30)}
  ${face(105)}`

export default {
  id: 'food',
  title: { en: 'Food', th: 'อาหาร', emoji: '🍚', say: "Yummy! Let's eat!" },
  color: '#FF8A3D',
  words: [
    { en: 'Rice', say: 'ไรซ์', th: 'ข้าว', art: 'rice', color: '#2E8BFF',
      gag: { type: 'box', sfx: 'pop', scale: 0.66 }, sound: 'Yum yum!' },
    { en: 'Egg', say: 'เอ้ก', th: 'ไข่', art: 'egg', color: '#F2B705',
      gag: { type: 'bonk', sfx: 'bonk', scale: 0.55 }, sound: 'Bonk!' },
    { en: 'Milk', say: 'มิลค์', th: 'นม', art: 'milk', color: '#3DA5D9',
      gag: { type: 'splash', sfx: 'splash', scale: 0.62 }, sound: 'Splash!' },
    { en: 'Bread', say: 'เบรด', th: 'ขนมปัง', art: 'bread', color: '#B9773F',
      gag: { type: 'fly', sfx: 'whoosh', scale: 0.66 }, sound: 'Wheee!' },
    { en: 'Cake', say: 'เค้ก', th: 'เค้ก', art: 'cake', color: '#FF6F91',
      gag: { type: 'pop', sfx: 'sparkle', scale: 0.66 }, sound: 'Ta-da!' },
  ],
  art: { rice, egg, milk, bread, cake },
  quiz: { answer: 4, choices: [0, 4, 3] }, // « Where is the cake? » : mot court et net pour Whisper/Kokoro
}
