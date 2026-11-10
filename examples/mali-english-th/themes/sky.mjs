// Thème « Sky » : nuage, pluie, lune, étoile, arc-en-ciel (dessins propres au thème, style Mali).
import { INK, S, face, f } from '../engine.mjs'

// nuage tout rond (arcs extérieurs), centré ~(0,0), ±170 × −110…+90
const CLOUD = 'M -140 80 A 50 50 0 0 1 -150 -10 A 70 70 0 0 1 -60 -90 A 80 80 0 0 1 70 -100 A 65 65 0 0 1 160 -10 A 50 50 0 0 1 140 80 Q 0 100 -140 80 Z'

// petit visage (étoile, nuages de l'arc-en-ciel) : yeux ±e, joues ±c
const miniFace = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})">
  <ellipse cx="-28" cy="-8" rx="11" ry="15" fill="${INK}"/><ellipse cx="28" cy="-8" rx="11" ry="15" fill="${INK}"/>
  <circle cx="-24" cy="-13" r="4" fill="#fff"/><circle cx="32" cy="-13" r="4" fill="#fff"/>
  <circle cx="-52" cy="18" r="13" fill="#FF8FA3" opacity=".75"/><circle cx="52" cy="18" r="13" fill="#FF8FA3" opacity=".75"/>
  <path d="M -22 20 Q 0 44 22 20" fill="none" ${S(8)}/></g>`

const cloud = `<path d="${CLOUD}" fill="#EAF6FF" ${S()}/>
  <ellipse cx="-70" cy="-40" rx="38" ry="20" fill="#fff" opacity=".9"/><ellipse cx="40" cy="-62" rx="30" ry="15" fill="#fff" opacity=".9"/>
  ${face(5)}`

const drop = (x, y) => `<path d="M ${x} ${y - 34} Q ${x + 24} ${y - 2} ${x + 24} ${y + 12} A 24 24 0 0 1 ${x - 24} ${y + 12} Q ${x - 24} ${y - 2} ${x} ${y - 34} Z" fill="#3FA9F5" ${S(9)}/>
  <ellipse cx="${x - 9}" cy="${y + 6}" rx="6" ry="10" fill="#fff" opacity=".6"/>`
const rain = `${[[-120, 85], [-45, 140], [30, 92], [110, 140]].map(([x, y]) => drop(x, y)).join('')}
  <g transform="translate(0 -95) scale(.8)"><path d="${CLOUD}" fill="#9DB4D0" stroke="${INK}" stroke-width="15" stroke-linejoin="round" stroke-linecap="round"/>
  <ellipse cx="-70" cy="-40" rx="38" ry="20" fill="#fff" opacity=".45"/>${face(5)}</g>`

// croissant de lune (pointes en (40, ±145)), profil souriant sur la partie épaisse
const moon = `<g transform="translate(60 -45)">
  <path d="M 40 -145 A 150 150 0 1 0 40 145 A 160 160 0 0 1 40 -145 Z" fill="#FFE066" ${S()}/>
  <circle cx="-110" cy="75" r="14" fill="#F2C230"/><circle cx="-70" cy="115" r="9" fill="#F2C230"/><circle cx="-125" cy="-70" r="10" fill="#F2C230"/>
  <path d="M -98 -88 Q -120 -60 -124 -20" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".7"/>
  <ellipse cx="-88" cy="-22" rx="12" ry="17" fill="${INK}"/><circle cx="-84" cy="-28" r="4" fill="#fff"/>
  <circle cx="-110" cy="20" r="15" fill="#FF8FA3" opacity=".75"/>
  <path d="M -98 30 Q -78 52 -62 28" fill="none" ${S(9)}/></g>`

// étoile à 5 branches arrondies
const starPts = Array.from({ length: 10 }, (_, i) => {
  const a = (i * Math.PI) / 5 - Math.PI / 2, r = i % 2 ? 78 : 175
  return `${i ? 'L' : 'M'} ${f(Math.cos(a) * r)} ${f(Math.sin(a) * r + 12)}`
}).join(' ')
const star = `<path d="${starPts} Z" fill="#FFD23F" ${S()}/>
  <path d="M -12 -80 L 0 -118" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".7"/>
  ${miniFace(0, 20)}`
// étincelles qui tournent derrière l'étoile
const sparkle = (a, r, s, c) => {
  const x = f(Math.cos(a) * r), y = f(Math.sin(a) * r)
  return `<path d="M ${x} ${f(y - s)} Q ${x} ${y} ${f(+x + s)} ${y} Q ${x} ${y} ${x} ${f(+y + s)} Q ${x} ${y} ${f(x - s)} ${y} Q ${x} ${y} ${x} ${f(y - s)} Z" fill="${c}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`
}
const starSpin = Array.from({ length: 6 }, (_, i) => sparkle((i * Math.PI) / 3 + 0.5, 200, i % 2 ? 18 : 26, i % 2 ? '#FFFFFF' : '#FFD23F')).join('')

// arc-en-ciel : 6 bandes, nuages souriants aux deux pieds
const BANDS = ['#F23B3B', '#FF8A3D', '#F2D600', '#3DBE5A', '#3FA9F5', '#8E5BD9']
const arc = (R) => `M ${-R} 55 A ${R} ${R} 0 0 1 ${R} 55`
const footCloud = (x) => `<g transform="translate(${x} 70) scale(.42)"><path d="${CLOUD}" fill="#fff" stroke="${INK}" stroke-width="26" stroke-linejoin="round"/></g>${miniFace(x, 66, 0.7)}`
const rainbow = `<path d="${arc(115)}" fill="none" stroke="${INK}" stroke-width="156"/>
  ${BANDS.map((c, i) => `<path d="${arc(170 - 22 * i)}" fill="none" stroke="${c}" stroke-width="23"/>`).join('')}
  ${footCloud(-115)}${footCloud(115)}`

export default {
  id: 'sky',
  title: { en: 'Sky', th: 'ท้องฟ้า', emoji: '🌈', say: 'Look up at the sky!' },
  color: '#3FA9F5',
  words: [
    { en: 'Cloud', say: 'คลาวด์', th: 'เมฆ', art: 'cloud', color: '#3FA9F5',
      gag: { type: 'float', balloon: '#F23B3B', sfx: 'whoosh', scale: 0.62 }, sound: 'Puff puff!' },
    { en: 'Rain', say: 'เรน', th: 'ฝน', art: 'rain', color: '#2F7FD8',
      gag: { type: 'splash', sfx: 'splash', scale: 0.62 }, sound: 'Splish!' },
    { en: 'Moon', say: 'มูน', th: 'พระจันทร์', art: 'moon', color: '#F2B705',
      gag: { type: 'rise', sfx: 'ding' }, sound: 'Hello!' },
    { en: 'Star', say: 'สตาร์', th: 'ดาว', art: 'star', color: '#FF8A3D',
      gag: { type: 'pop', sfx: 'sparkle', scale: 0.62 }, sound: 'Twinkle!' },
    { en: 'Rainbow', say: 'เรน-โบว์', th: 'รุ้ง', art: 'rainbow', color: '#8E5BD9',
      gag: { type: 'box', sfx: 'yay', scale: 0.7 }, sound: 'Wow!' },
  ],
  art: { cloud, rain, moon, star, starSpin, rainbow },
  quiz: { answer: 2, choices: [3, 2, 0] }, // « Where is the moon? » parmi étoile, lune, nuage
}
