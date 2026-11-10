// Thème « My body » : Mali montre ses propres parties du corps (gag « self »).
// La trompe de l'éléphant est son nez : Mali l'agite pour « Nose ».
import { lib } from '../../../src/kit/library.mjs'

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
  art: lib({ nose: 'nose-mali', ears: 'ears-mali', eyes: 'eyes-mali', mouth: 'mouth-mali', feet: 'feet-mali' }),
  quiz: { answer: 0, choices: [1, 0, 4], q: { en: 'Where is the nose?', th: 'จมูกอยู่ไหนนะ?' } },
}
