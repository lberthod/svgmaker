// Thème « Vehicles » : voiture, bus, bateau, avion, train. Véhicules vus de côté, l'avant à gauche (vers Mali).
import { INK, S, face } from '../engine.mjs'

const wheel = (x, y, r = 48) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#4A4A55" ${S()}/><circle cx="${x}" cy="${y}" r="${Math.round(r * 0.42)}" fill="#D9DDE5" ${S(7)}/>`
const faceAt = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})">${face(0)}</g>`

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
  art: {
    car: `
      <path d="M -120 -20 L -85 -120 Q -78 -138 -58 -138 L 70 -138 Q 92 -138 102 -118 L 140 -20 Z" fill="#F23B3B" ${S()}/>
      <path d="M -88 -28 L -64 -108 L -10 -108 L -10 -28 Z M 10 -28 L 10 -108 L 66 -108 L 102 -28 Z" fill="#A9E4FF" ${S(8)}/>
      <rect x="-195" y="-40" width="390" height="120" rx="50" fill="#F23B3B" ${S()}/>
      <ellipse cx="-150" cy="-12" rx="20" ry="14" fill="#FFE066" ${S(7)}/>
      <ellipse cx="-50" cy="-120" rx="12" ry="7" fill="#fff" opacity=".55"/>
      <ellipse cx="120" cy="-15" rx="40" ry="12" fill="#fff" opacity=".45"/>
      ${faceAt(-25, 10, 0.62)}
      ${wheel(-110, 85)}${wheel(115, 85)}`,
    bus: `
      <rect x="-195" y="-150" width="390" height="235" rx="44" fill="#FFC21A" ${S()}/>
      <rect x="-168" y="-122" width="72" height="62" rx="14" fill="#A9E4FF" ${S(8)}/>
      <rect x="-76" y="-122" width="72" height="62" rx="14" fill="#A9E4FF" ${S(8)}/>
      <rect x="16" y="-122" width="72" height="62" rx="14" fill="#A9E4FF" ${S(8)}/>
      <rect x="108" y="-122" width="60" height="62" rx="14" fill="#A9E4FF" ${S(8)}/>
      <path d="M -190 40 L 190 40" stroke="#F23B3B" stroke-width="14" stroke-linecap="round"/>
      <ellipse cx="-178" cy="10" rx="12" ry="16" fill="#FFF3B0" ${S(6)}/>
      <ellipse cx="-110" cy="-138" rx="40" ry="8" fill="#fff" opacity=".55"/>
      ${faceAt(-10, 0, 0.6)}
      ${wheel(-112, 88)}${wheel(118, 88)}`,
    boat: `
      <path d="M 70 -110 L 70 -175 L 120 -175 L 120 -110 Z" fill="#F23B3B" ${S(9)}/>
      <path d="M 70 -150 L 120 -150" stroke="#fff" stroke-width="12"/>
      <circle cx="138" cy="-192" r="16" fill="#fff" ${S(6)}/><circle cx="160" cy="-208" r="11" fill="#fff" ${S(6)}/>
      <rect x="-30" y="-120" width="180" height="110" rx="22" fill="#FFFFFF" ${S()}/>
      <circle cx="30" cy="-65" r="22" fill="#A9E4FF" ${S(7)}/><circle cx="95" cy="-65" r="22" fill="#A9E4FF" ${S(7)}/>
      <path d="M -205 -20 L 200 -20 Q 190 70 120 115 L -130 115 Q -185 70 -205 -20 Z" fill="#FF8A3D" ${S()}/>
      <path d="M -190 20 L 192 20" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".9"/>
      <ellipse cx="-140" cy="-2" rx="30" ry="8" fill="#fff" opacity=".55"/>
      ${faceAt(-30, 50, 0.58)}
      <path d="M -200 140 q 25 -22 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0" fill="none" stroke="#2E9BD6" stroke-width="12" stroke-linecap="round"/>`,
    plane: `
      <path d="M 100 -50 L 140 -175 Q 150 -195 172 -186 L 200 -40 Z" fill="#F23B3B" ${S()}/>
      <path d="M 30 -40 L 110 -120 Q 125 -132 138 -118 L 100 -40 Z" fill="#F2B705" ${S(9)}/>
      <path d="M -150 55 Q -200 45 -200 -10 Q -200 -80 -120 -85 L 160 -70 Q 205 -65 205 -15 Q 205 40 160 50 Z" fill="#FFFFFF" ${S()}/>
      <circle cx="60" cy="-28" r="15" fill="#A9E4FF" ${S(6)}/><circle cx="105" cy="-28" r="15" fill="#A9E4FF" ${S(6)}/><circle cx="150" cy="-28" r="15" fill="#A9E4FF" ${S(6)}/>
      <path d="M -175 -30 Q -170 -68 -130 -74 L -130 -30 Z" fill="#A9E4FF" ${S(7)}/>
      <ellipse cx="0" cy="-66" rx="60" ry="7" fill="#1E9BE0" opacity=".3"/>
      ${faceAt(-55, -5, 0.5)}
      <path d="M -10 20 L 75 20 L 120 100 Q 124 120 104 117 Z" fill="#F2B705" ${S()}/>`,
    train: `
      <circle cx="-150" cy="-200" r="22" fill="#fff" ${S(6)}/><circle cx="-110" cy="-228" r="16" fill="#fff" ${S(6)}/>
      <path d="M -165 -50 L -155 -130 L -175 -160 L -95 -160 L -115 -130 L -105 -50 Z" fill="#4A4A55" ${S(9)}/>
      <rect x="40" y="-170" width="155" height="230" rx="18" fill="#F23B3B" ${S()}/>
      <path d="M 25 -170 L 210 -170" stroke="${INK}" stroke-width="22" stroke-linecap="round"/>
      <rect x="75" y="-140" width="85" height="70" rx="14" fill="#A9E4FF" ${S(8)}/>
      <rect x="-180" y="-70" width="240" height="130" rx="40" fill="#3DBE5A" ${S()}/>
      <path d="M -180 60 L -205 95 L -150 95 Z" fill="#F2B705" ${S(8)}/>
      <ellipse cx="-110" cy="-52" rx="40" ry="8" fill="#fff" opacity=".55"/>
      ${faceAt(-60, -5, 0.55)}
      <path d="M -120 95 L 120 95" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
      ${wheel(-120, 92, 38)}${wheel(-30, 92, 38)}${wheel(120, 85, 52)}`,
  },
  quiz: { answer: 4, choices: [1, 4, 2] }, // « Where is the train? » parmi bus, train, bateau
}
