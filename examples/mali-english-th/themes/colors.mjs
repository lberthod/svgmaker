// Thème « Colors » : 5 taches de peinture-personnages, toutes de la même forme,
// pour que l'enfant comprenne que c'est la COULEUR qui change.
import { lib } from '../../../src/kit/library.mjs'

const art = lib({ red: 'red-mali', blue: 'blue-mali', yellow: 'yellow-mali', green: 'green-mali', pink: 'pink-mali' })

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
