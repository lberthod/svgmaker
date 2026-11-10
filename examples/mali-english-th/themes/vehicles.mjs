// Thème « Vehicles » : voiture, bus, bateau, avion, train. Véhicules vus de côté, l'avant à gauche (vers Mali).
import { lib } from '../../../src/kit/library.mjs'

export default {
  id: 'vehicles',
  title: { en: 'Vehicles', th: 'ยานพาหนะ', emoji: '🚗', say: "Let's learn vehicles!" },
  color: '#1E9BE0',
  words: [
    { en: 'Car', say: 'คาร์', th: 'รถยนต์', art: 'car', color: '#F23B3B', gag: { type: 'drive', sfx: 'vroom' }, sound: 'Beep beep!' },
    { en: 'Bus', say: 'บัส', th: 'รถบัส', art: 'bus', color: '#F2B705', gag: { type: 'drive', sfx: 'beep', scale: 0.7 }, sound: 'Honk honk!' },
    { en: 'Boat', say: 'โบ๊ท', th: 'เรือ', art: 'boat', color: '#1E9BE0', gag: { type: 'splash', sfx: 'toot', bubble: false, scale: 0.62 }, sound: 'Toot toot!' },
    { en: 'Plane', say: 'เพลน', th: 'เครื่องบิน', art: 'plane', color: '#FF8A3D', gag: { type: 'fly', sfx: 'whoosh' }, sound: 'Zoom zoom!' },
    { en: 'Train', say: 'เทรน', th: 'รถไฟ', art: 'train', color: '#3DBE5A', gag: { type: 'run', sfx: 'toot' }, sound: 'Choo choo!' },
  ],
  art: lib({ car: 'car-mali', bus: 'bus-mali', boat: 'boat-mali', plane: 'plane-mali', train: 'train-mali' }),
  quiz: { answer: 4, choices: [1, 4, 2] }, // « Where is the train? » parmi bus, train, bateau
}
