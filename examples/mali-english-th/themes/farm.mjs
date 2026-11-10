// Thème « Farm animals » : vache, cochon, canard, poule, cheval (têtes dessinées dans le style cat/dog).
import { INK, S } from '../engine.mjs'

const eyes = (y, dx = 50, rx = 17, ry = 25) => `
  <ellipse cx="${-dx}" cy="${y}" rx="${rx}" ry="${ry}" fill="${INK}"/><ellipse cx="${dx}" cy="${y}" rx="${rx}" ry="${ry}" fill="${INK}"/>
  <circle cx="${-dx + 6}" cy="${y - 8}" r="6" fill="#fff"/><circle cx="${dx + 6}" cy="${y - 8}" r="6" fill="#fff"/>`
const cheeks = (y, dx = 95, r = 18) => `<circle cx="${-dx}" cy="${y}" r="${r}" fill="#FF8FA3" opacity=".7"/><circle cx="${dx}" cy="${y}" r="${r}" fill="#FF8FA3" opacity=".7"/>`

const art = {
  cow: `
    <path d="M -80 -115 Q -125 -150 -118 -200 Q -80 -175 -55 -128 Z" fill="#FFE7A3" ${S(9)}/>
    <path d="M 80 -115 Q 125 -150 118 -200 Q 80 -175 55 -128 Z" fill="#FFE7A3" ${S(9)}/>
    <ellipse cx="-160" cy="-70" rx="58" ry="30" transform="rotate(-20 -160 -70)" fill="#fff" ${S()}/>
    <ellipse cx="160" cy="-70" rx="58" ry="30" transform="rotate(20 160 -70)" fill="#fff" ${S()}/>
    <ellipse cx="-160" cy="-70" rx="30" ry="13" transform="rotate(-20 -160 -70)" fill="#FFB3C1"/>
    <ellipse cx="160" cy="-70" rx="30" ry="13" transform="rotate(20 160 -70)" fill="#FFB3C1"/>
    <ellipse cy="-5" rx="135" ry="150" fill="#fff" ${S()}/>
    <path d="M -40 -150 Q -10 -125 -30 -95 Q -60 -70 -100 -85 Q -110 -120 -80 -140 Q -60 -152 -40 -150 Z" fill="${INK}"/>
    <path d="M 60 -145 Q 110 -140 118 -90 Q 80 -75 58 -105 Q 45 -130 60 -145 Z" fill="${INK}"/>
    <ellipse cx="-105" cy="-40" rx="14" ry="28" transform="rotate(25 -105 -40)" fill="#E8F4FF" opacity=".9"/>
    ${eyes(-30, 52)}
    <ellipse cy="85" rx="112" ry="72" fill="#FFB3C1" ${S()}/>
    <ellipse cx="-40" cy="78" rx="15" ry="20" fill="#E0708A"/><ellipse cx="40" cy="78" rx="15" ry="20" fill="#E0708A"/>
    <path d="M -36 118 Q 0 140 36 118" fill="none" ${S(8)}/>
    ${cheeks(30, 102, 16)}`,
  pig: `
    <path d="M -120 -60 L -150 -180 L -40 -130 Z" fill="#FF9EB5" ${S()}/><path d="M 120 -60 L 150 -180 L 40 -130 Z" fill="#FF9EB5" ${S()}/>
    <path d="M -112 -85 L -128 -150 L -70 -124 Z" fill="#FF7A9A"/><path d="M 112 -85 L 128 -150 L 70 -124 Z" fill="#FF7A9A"/>
    <circle r="150" fill="#FFB3C6" ${S()}/>
    <ellipse cx="-75" cy="-80" rx="22" ry="40" transform="rotate(30 -75 -80)" fill="#fff" opacity=".45"/>
    ${eyes(-30, 55)}
    <ellipse cy="45" rx="66" ry="48" fill="#FF8AA8" ${S()}/>
    <ellipse cx="-22" cy="45" rx="12" ry="18" fill="${INK}"/><ellipse cx="22" cy="45" rx="12" ry="18" fill="${INK}"/>
    <path d="M -34 110 Q 0 135 34 110" fill="none" ${S(8)}/>
    ${cheeks(60, 105)}`,
  duck: `
    <path d="M -10 -140 Q -30 -200 5 -205 Q 0 -170 25 -195 Q 30 -160 10 -140 Z" fill="#FFD93B" ${S(9)}/>
    <circle r="145" fill="#FFD93B" ${S()}/>
    <ellipse cx="-75" cy="-70" rx="22" ry="40" transform="rotate(30 -75 -70)" fill="#fff" opacity=".5"/>
    ${eyes(-35, 52)}
    <path d="M -80 62 Q -60 105 0 108 Q 60 105 80 62 Z" fill="#F07A10" ${S(10)}/>
    <path d="M -115 50 Q -120 12 -60 18 Q 0 28 60 18 Q 120 12 115 50 Q 110 72 0 72 Q -110 72 -115 50 Z" fill="#FF9A2E" ${S()}/>
    <ellipse cx="-20" cy="34" rx="7" ry="5" fill="${INK}"/><ellipse cx="20" cy="34" rx="7" ry="5" fill="${INK}"/>
    ${cheeks(-2, 100, 17)}`,
  chicken: `
    <path d="M -60 -120 Q -80 -190 -30 -180 Q -20 -225 20 -200 Q 55 -220 65 -175 Q 100 -170 75 -120 Z" fill="#F23B3B" ${S()}/>
    <circle r="140" fill="#fff" ${S()}/>
    <ellipse cx="-70" cy="-65" rx="20" ry="38" transform="rotate(30 -70 -65)" fill="#E8F4FF" opacity=".9"/>
    ${eyes(-25, 52)}
    <ellipse cx="-13" cy="88" rx="16" ry="28" fill="#F23B3B" ${S(7)}/><ellipse cx="13" cy="88" rx="16" ry="28" fill="#F23B3B" ${S(7)}/>
    <path d="M -38 20 L 38 20 L 0 70 Z" fill="#FFA41B" ${S(9)}/>
    <path d="M -30 30 L 30 30" fill="none" ${S(6)}/>
    ${cheeks(35, 92)}`,
  horse: `
    <path d="M -72 -105 L -95 -195 L -25 -140 Z" fill="#B9773F" ${S()}/><path d="M 72 -105 L 95 -195 L 25 -140 Z" fill="#B9773F" ${S()}/>
    <path d="M -72 -120 L -84 -168 L -48 -140 Z" fill="#FFB3C1"/><path d="M 72 -120 L 84 -168 L 48 -140 Z" fill="#FFB3C1"/>
    <path d="M 70 -130 Q 165 -100 150 20 Q 175 60 140 110 Q 120 40 110 0 Z" fill="#5A3418" ${S()}/>
    <ellipse cy="-10" rx="115" ry="160" fill="#B9773F" ${S()}/>
    <path d="M -55 -150 Q -40 -195 0 -165 Q 30 -200 55 -150 Q 40 -95 0 -105 Q -45 -95 -55 -150 Z" fill="#5A3418" ${S(9)}/>
    <ellipse cx="-60" cy="-55" rx="16" ry="34" transform="rotate(20 -60 -55)" fill="#fff" opacity=".35"/>
    ${eyes(-30, 48, 16, 23)}
    <ellipse cy="90" rx="95" ry="65" fill="#E8C08F" ${S()}/>
    <ellipse cx="-38" cy="78" rx="12" ry="16" fill="${INK}"/><ellipse cx="38" cy="78" rx="12" ry="16" fill="${INK}"/>
    <path d="M -36 118 Q 0 140 36 118" fill="none" ${S(8)}/>
    ${cheeks(15, 78, 15)}`,
}

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
