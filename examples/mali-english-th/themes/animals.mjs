// Thème « Animals & things » : la première vidéo de Mali (chat, chien, pomme, soleil, poisson).
// Les dessins viennent d'ART_BUILTIN (engine.mjs).
export default {
  id: 'animals',
  title: { en: 'Animals', th: 'สัตว์และสิ่งของ', emoji: '🐱', say: "Let's learn new words!" },
  color: '#FF8A3D',
  words: [
    { en: 'Cat', say: 'แค็ท', th: 'แมว', art: 'cat', color: '#FF8A3D', gag: { type: 'box', sfx: 'meow' }, sound: 'Meow!' },
    { en: 'Dog', say: 'ด็อก', th: 'หมา', art: 'dog', color: '#B9773F', gag: { type: 'run', sfx: 'woof' }, sound: 'Woof!' },
    { en: 'Apple', say: 'แอ๊ป-เปิ้ล', th: 'แอปเปิ้ล', art: 'apple', color: '#F23B3B', gag: 'bonk', sound: 'Bonk!' },
    { en: 'Sun', say: 'ซัน', th: 'พระอาทิตย์', art: 'sun', color: '#FFB400', gag: { type: 'rise', glasses: true }, sound: 'So hot!' },
    { en: 'Fish', say: 'ฟิช', th: 'ปลา', art: 'fish', color: '#1E9BE0', gag: 'splash', sound: 'Splash!' },
  ],
  quiz: { answer: 4, choices: [0, 4, 2] }, // « Where is the fish? » parmi chat, poisson, pomme
}
