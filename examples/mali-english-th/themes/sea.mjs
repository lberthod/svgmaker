// Thème « Sea animals » : crabe, requin, tortue, pieuvre, baleine.
// Dessins en ligne (style Mali : encre épaisse, aplats vifs, visages souriants), animaux vus de côté, la tête à gauche (vers Mali).
import { INK, S, face } from '../engine.mjs'

const CHEEK = '#FF8FA3'
const eye = (x, y, r = 16) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.3}" fill="${INK}"/><circle cx="${x + r * 0.35}" cy="${y - r * 0.45}" r="${r * 0.35}" fill="#fff"/>`

// Crabe : carapace rouge, pinces levées, yeux sur pédoncules
const crab = `
  <path d="M -120 20 L -185 0 M -125 50 L -190 55 M -110 75 L -165 110 M 120 20 L 185 0 M 125 50 L 190 55 M 110 75 L 165 110" fill="none" ${S(14)}/>
  <path d="M -95 -20 Q -130 -70 -140 -110 M 95 -20 Q 130 -70 140 -110" fill="none" ${S(14)}/>
  <path d="M -140 -100 Q -205 -120 -185 -175 L -150 -150 L -140 -190 Q -95 -160 -140 -100 Z" fill="#F23B3B" ${S(10)}/>
  <path d="M 140 -100 Q 205 -120 185 -175 L 150 -150 L 140 -190 Q 95 -160 140 -100 Z" fill="#F23B3B" ${S(10)}/>
  <path d="M -45 -60 L -55 -125 M 45 -60 L 55 -125" fill="none" ${S(10)}/>
  <circle cx="-55" cy="-135" r="26" fill="#fff" ${S(8)}/><circle cx="55" cy="-135" r="26" fill="#fff" ${S(8)}/>
  <circle cx="-52" cy="-132" r="13" fill="${INK}"/><circle cx="58" cy="-132" r="13" fill="${INK}"/>
  <circle cx="-48" cy="-137" r="4" fill="#fff"/><circle cx="62" cy="-137" r="4" fill="#fff"/>
  <ellipse cy="25" rx="135" ry="95" fill="#FF5A4E" ${S()}/>
  <ellipse cx="-70" cy="-15" rx="30" ry="16" transform="rotate(-25 -70 -15)" fill="#fff" opacity=".45"/>
  <circle cx="-75" cy="50" r="20" fill="${CHEEK}" opacity=".8"/><circle cx="75" cy="50" r="20" fill="${CHEEK}" opacity=".8"/>
  <path d="M -40 45 Q 0 90 40 45" fill="none" ${S(10)}/>`

// Requin : gris-bleu, ventre blanc, aileron, grand sourire avec petites dents
const shark = `
  <path d="M 140 -5 L 210 -95 Q 195 -10 215 70 Z" fill="#6E8FB5" ${S()}/>
  <path d="M -10 -70 L 40 -175 L 80 -65 Z" fill="#6E8FB5" ${S()}/>
  <path d="M -185 10 Q -150 -85 -20 -85 Q 120 -85 160 0 Q 120 85 -20 80 Q -150 80 -185 10 Z" fill="#8FB3DA" ${S()}/>
  <path d="M -170 25 Q -100 75 -10 75 Q 90 72 140 25 Q 60 40 -20 40 Q -110 40 -170 25 Z" fill="#fff"/>
  <path d="M -10 50 L 40 115 L 60 55 Z" fill="#6E8FB5" ${S(10)}/>
  <path d="M 40 -35 q 12 25 0 50 M 65 -35 q 12 25 0 50 M 90 -32 q 12 22 0 44" fill="none" stroke="#5A7AA0" stroke-width="9" stroke-linecap="round"/>
  ${eye(-110, -25, 15)}
  <path d="M -168 18 Q -120 60 -72 22 Q -120 34 -168 18 Z" fill="#fff" ${S(9)}/>
  <path d="M -145 26 L -138 38 L -131 28 M -112 30 L -105 42 L -98 29" fill="#fff" ${S(5)}/>
  <circle cx="-60" cy="5" r="16" fill="${CHEEK}" opacity=".8"/>
  <ellipse cx="0" cy="-55" rx="40" ry="12" transform="rotate(-8 0 -55)" fill="#fff" opacity=".5"/>`

// Tortue : carapace verte en dôme avec écailles, tête et pattes vert clair
const turtle = `
  <ellipse cx="-80" cy="85" rx="36" ry="26" fill="#9BE07A" ${S()}/>
  <ellipse cx="110" cy="85" rx="36" ry="26" fill="#9BE07A" ${S()}/>
  <path d="M 150 30 L 200 50 L 150 65 Z" fill="#9BE07A" ${S(10)}/>
  <path d="M -95 40 Q -125 -10 -150 -40 Q -205 -50 -200 -100 Q -195 -150 -145 -150 Q -95 -150 -95 -100 Q -95 -60 -60 20 Z" fill="#9BE07A" ${S()}/>
  ${eye(-165, -108, 11)}${eye(-125, -108, 11)}
  <circle cx="-186" cy="-75" r="11" fill="${CHEEK}" opacity=".8"/><circle cx="-104" cy="-75" r="11" fill="${CHEEK}" opacity=".8"/>
  <path d="M -165 -78 Q -145 -58 -125 -78" fill="none" ${S(8)}/>
  <path d="M -120 65 Q -120 -100 15 -100 Q 155 -100 155 65 Z" fill="#3DBE5A" ${S()}/>
  <path d="M -20 -55 L 50 -55 L 70 -5 L 15 30 L -40 -5 Z" fill="#2E9A47" ${S(8)}/>
  <path d="M -20 -55 L -45 -88 M 50 -55 L 75 -88 M -40 -5 L -110 10 M 70 -5 L 140 10 M 15 30 L 15 65 M -40 -5 L -75 65 M 70 -5 L 105 65" fill="none" ${S(8)}/>
  <rect x="-135" y="55" width="305" height="28" rx="14" fill="#F2D27A" ${S(10)}/>
  <ellipse cx="-60" cy="-60" rx="28" ry="14" transform="rotate(-35 -60 -60)" fill="#fff" opacity=".45"/>`

// Pieuvre : tête violette ronde, 6 tentacules ondulées, visage souriant
const tentPath = (x, d) => `M ${x} 30 Q ${x + d * 20} 100 ${x + d * 45} 140 Q ${x + d * 65} 175 ${x + d * 35} 185`
const tent = (x, d) => `<path d="${tentPath(x, d)}" fill="none" stroke="${INK}" stroke-width="54" stroke-linecap="round"/><path d="${tentPath(x, d)}" fill="none" stroke="#B57BEA" stroke-width="30" stroke-linecap="round"/>`
const octopus = `
  ${tent(-120, -1)}${tent(120, 1)}${tent(-60, -0.6)}${tent(60, 0.6)}${tent(0, 0.25)}
  <path d="M -155 50 Q -170 -185 0 -190 Q 170 -185 155 50 Q 0 85 -155 50 Z" fill="#B57BEA" ${S()}/>
  <circle cx="-60" cy="-120" r="16" fill="#8E5BD9"/><circle cx="35" cy="-145" r="12" fill="#8E5BD9"/><circle cx="85" cy="-100" r="18" fill="#8E5BD9"/>
  <ellipse cx="-95" cy="-110" rx="20" ry="38" transform="rotate(30 -95 -110)" fill="#fff" opacity=".45"/>
  ${face(-10)}`

// Baleine : grosse baleine bleue, queue relevée à droite, jet d'eau sur la tête
const whale = `
  <path d="M -60 -120 Q -75 -165 -110 -175 M -60 -120 Q -60 -175 -60 -195 M -60 -120 Q -45 -165 -10 -175" fill="none" stroke="#29A8F0" stroke-width="16" stroke-linecap="round"/>
  <circle cx="-110" cy="-178" r="13" fill="#7FD3FF" ${S(6)}/><circle cx="-60" cy="-198" r="13" fill="#7FD3FF" ${S(6)}/><circle cx="-10" cy="-178" r="13" fill="#7FD3FF" ${S(6)}/>
  <path d="M 120 10 Q 160 -20 170 -70 L 140 -120 Q 175 -105 190 -85 Q 205 -115 235 -120 Q 205 -60 160 40 Z" fill="#1E7FD0" ${S()}/>
  <path d="M -200 20 Q -200 -115 -50 -115 Q 110 -115 150 20 Q 150 105 -40 105 Q -200 105 -200 20 Z" fill="#2E95E8" ${S()}/>
  <path d="M -190 45 Q -120 100 -40 100 Q 90 100 140 50 Q 40 65 -60 62 Q -140 60 -190 45 Z" fill="#BDE6FF"/>
  <path d="M -150 72 L -150 92 M -110 80 L -110 100 M -70 84 L -70 102 M -30 85 L -30 103 M 10 84 L 10 102 M 50 80 L 50 98" fill="none" stroke="#7FB8E0" stroke-width="7" stroke-linecap="round"/>
  <path d="M -10 40 Q 30 95 70 60" fill="#1E7FD0" ${S(10)}/>
  ${eye(-130, -20, 16)}
  <path d="M -185 25 Q -150 52 -115 30" fill="none" ${S(9)}/>
  <circle cx="-95" cy="15" r="17" fill="${CHEEK}" opacity=".8"/>
  <ellipse cx="-80" cy="-85" rx="45" ry="13" transform="rotate(-10 -80 -85)" fill="#fff" opacity=".45"/>`

export default {
  id: 'sea',
  title: { en: 'Sea animals', th: 'สัตว์ทะเล', emoji: '🐙', say: "Let's go to the sea!" },
  color: '#1E9BE0',
  words: [
    { en: 'Crab', say: 'แคร็บ', th: 'ปู', art: 'crab', color: '#F23B3B', gag: { type: 'run', sfx: 'step', scale: 0.66 }, sound: 'Snip snap!' },
    { en: 'Shark', say: 'ชาร์ค', th: 'ฉลาม', art: 'shark', color: '#1E9BE0', gag: { type: 'splash', sfx: 'splash', scale: 0.66 }, sound: 'Chomp!' },
    { en: 'Turtle', say: 'เทอ-เทิ่ล', th: 'เต่า', art: 'turtle', color: '#3DBE5A', gag: { type: 'box', sfx: 'pop', scale: 0.7 }, sound: 'Hello!' },
    { en: 'Octopus', say: 'อ๊อก-โท-พัส', th: 'ปลาหมึก', art: 'octopus', color: '#8E5BD9', gag: { type: 'bonk', sfx: 'boing', scale: 0.55 }, sound: 'Wiggle!' },
    { en: 'Whale', say: 'เวล', th: 'ปลาวาฬ', art: 'whale', color: '#29A8F0', gag: { type: 'splash', sfx: 'splash', bubble: false, scale: 0.66 }, sound: 'Splash!' },
  ],
  art: { crab, shark, turtle, octopus, whale },
  quiz: { answer: 1, choices: [3, 1, 4] }, // « Where is the shark? » parmi pieuvre, requin, baleine (« crab » risque d'être entendu « crap »)
}
