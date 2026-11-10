// Thème « Fruits » : banane, mangue, orange, pastèque, raisins.
import { lib } from '../../../src/kit/library.mjs'

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
  art: lib({ banana: 'banana-mali', mango: 'mango-mali', orange: 'orange-mali', watermelon: 'watermelon-mali', grapes: 'grapes-mali' }),
  quiz: { answer: 1, choices: [3, 1, 4], q: { en: 'Find the mango!', th: 'มะม่วงอยู่ไหนนะ?' } }, // phrase courte : « Where is the watermelon/mango? » déborde des marges
}
