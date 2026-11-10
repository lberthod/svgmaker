// Thème « Toys » : ballon, nounours, cerf-volant, tambour, robot (dessins de la série kids-english-th, même style).
// « Doll » a été remplacé par « Teddy » : Whisper entend « Dull / Dawn / Dall » même après les 4 réparations.
import { lib } from '../../../src/kit/library.mjs'
import { face } from '../engine.mjs'

const art = lib({ ball: 'ball', teddy: 'teddy-bear', kite: 'kite', drum: 'drum', robot: 'robot' })
art.drum += face(78) // le tambour sourit aussi (visage sur le fût)

export default {
  id: 'toys',
  title: { en: 'Toys', th: 'ของเล่น', emoji: '🧸', say: "Let's play with toys!" },
  color: '#FF6F91',
  words: [
    { en: 'Ball', say: 'บอล', th: 'ลูกบอล', art: 'ball', color: '#F23B3B', gag: { type: 'bonk', sfx: 'boing', scale: 0.55 }, sound: 'Boing!' },
    { en: 'Teddy', say: 'เท็ด-ดี้', th: 'ตุ๊กตาหมี', art: 'teddy', color: '#B9773F', gag: { type: 'run', sfx: 'giggle', scale: 0.62 }, sound: 'Hug me!' },
    { en: 'Kite', say: 'ไคท์', th: 'ว่าว', art: 'kite', color: '#3DBE5A', gag: { type: 'fly', sfx: 'whoosh', scale: 0.7 }, sound: 'Wheee!' },
    { en: 'Drum', say: 'ดรัม', th: 'กลอง', art: 'drum', color: '#FF8A3D', gag: { type: 'pop', sfx: 'drumroll', scale: 0.66 }, sound: 'Boom boom!' },
    { en: 'Robot', say: 'โร-บอท', th: 'หุ่นยนต์', art: 'robot', color: '#1E9BE0', gag: { type: 'box', sfx: 'beep', scale: 0.7 }, sound: 'Beep boop!' },
  ],
  art,
  quiz: { answer: 4, choices: [0, 4, 2] }, // « Where is the robot? » parmi ballon, robot, cerf-volant 
}
