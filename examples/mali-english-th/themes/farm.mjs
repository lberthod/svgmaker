// Thème « Farm animals » : vache, cochon, canard, poule, cheval (têtes dessinées dans le style cat/dog).
import { lib } from '../../../src/kit/library.mjs'

const art = lib({ cow: 'cow-mali', pig: 'pig-mali', duck: 'duck-mali', chicken: 'chicken-mali', horse: 'horse-mali' })

export default {
  id: 'farm',
  title: { en: 'Farm animals', th: 'สัตว์ในฟาร์ม', emoji: '🐮', say: "Let's visit the farm!" },
  color: '#3DBE5A',
  words: [
    { en: 'Cow', say: 'คาว', th: 'วัว', art: 'cow', color: '#8E5BD9', gag: { type: 'box', sfx: 'moo', scale: 0.72 }, sound: 'Moo!' },
    { en: 'Pig', say: 'พิก', th: 'หมู', art: 'pig', color: '#FF6F91', gag: { type: 'bonk', sfx: 'oink', scale: 0.6 }, sound: 'Oink oink!' },
    { en: 'Duck', say: 'ดั๊ก', th: 'เป็ด', art: 'duck', color: '#F2B705', gag: { type: 'splash', sfx: 'quack', scale: 0.66 }, sound: 'Quack!' },
    { en: 'Chicken', say: 'ชิค-เค่น', th: 'ไก่', art: 'chicken', color: '#F23B3B', gag: { type: 'fly', sfx: 'cluck', scale: 0.72 }, sound: 'Cluck cluck!' },
    { en: 'Horse', say: 'ฮอร์ส', th: 'ม้า', art: 'horse', color: '#B9773F', gag: { type: 'run', sfx: 'neigh', scale: 0.72 }, sound: 'Neigh!' },
  ],
  art,
  quiz: { answer: 1, choices: [3, 1, 4] }, // « Where is the pig? » parmi poule, cochon, cheval (« Yes! Duck! » était entendu « Yes, Doc. »)
}
