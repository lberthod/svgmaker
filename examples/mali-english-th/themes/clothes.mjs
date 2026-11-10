// Thème « Clothes » : chapeau, chaussures, t-shirt, chaussettes, robe (dessins dans le style de Mali, écrits ici).
import { INK, S, face } from '../engine.mjs'

// petit visage pour les objets étroits (chaussures, chaussettes) : centré en (x, y), ~70 px de large
const miniFace = (x, y) => `
  <ellipse cx="${x - 17}" cy="${y - 4}" rx="7" ry="10" fill="${INK}"/><ellipse cx="${x + 17}" cy="${y - 4}" rx="7" ry="10" fill="${INK}"/>
  <circle cx="${x - 15}" cy="${y - 8}" r="2.6" fill="#fff"/><circle cx="${x + 19}" cy="${y - 8}" r="2.6" fill="#fff"/>
  <circle cx="${x - 33}" cy="${y + 13}" r="9" fill="#FF8FA3" opacity=".75"/><circle cx="${x + 33}" cy="${y + 13}" r="9" fill="#FF8FA3" opacity=".75"/>
  <path d="M ${x - 14} ${y + 13} Q ${x} ${y + 29} ${x + 14} ${y + 13}" fill="none" ${S(7)}/>`

// chapeau de soleil bleu, ruban rouge, fleur
const hat = `<g transform="translate(0 30)">
  <ellipse cx="0" cy="60" rx="205" ry="58" fill="#3FA7F5" ${S()}/>
  <path d="M -122 58 Q -132 -150 0 -150 Q 132 -150 122 58 Q 0 84 -122 58 Z" fill="#5BC0FF" ${S()}/>
  <path d="M -124 14 Q 0 36 124 14 L 123 54 Q 0 78 -123 54 Z" fill="#F23B3B" ${S(9)}/>
  <circle cx="96" cy="34" r="22" fill="#FFC93C" ${S(7)}/><circle cx="96" cy="34" r="9" fill="#FF8A3D"/>
  <ellipse cx="-74" cy="-92" rx="16" ry="36" transform="rotate(25 -74 -92)" fill="#fff" opacity=".5"/>
  ${face(-48)}
</g>`

// une chaussure de sport vue de côté (pointe à droite), x/y = centre
const shoe = (x, y, c) => `<g transform="translate(${x} ${y})">
  <path d="M -82 -70 Q -84 -96 -56 -96 L -14 -96 Q 0 -60 30 -50 Q 88 -40 94 0 L 94 22 L -84 22 Z" fill="${c}" ${S()}/>
  <path d="M -92 22 L 102 22 Q 106 48 80 48 L -82 48 Q -100 48 -92 22 Z" fill="#fff" ${S(9)}/>
  <path d="M -10 -84 L 10 -70 M 0 -70 L 22 -58" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
  <ellipse cx="-56" cy="-62" rx="9" ry="20" fill="#fff" opacity=".5"/>
  ${miniFace(30, -8)}
</g>`
const shoes = `${shoe(-92, 30, '#F23B3B')}${shoe(92, 60, '#F23B3B')}`

// t-shirt vert avec étoile
const shirt = `<g transform="translate(0 10)">
  <path d="M -70 -150 Q 0 -112 70 -150 L 170 -96 L 132 -20 L 96 -40 L 96 160 L -96 160 L -96 -40 L -132 -20 L -170 -96 Z" fill="#3DBE5A" ${S()}/>
  <path d="M -70 -150 Q 0 -96 70 -150" fill="none" ${S(9)}/>
  <path d="M -146 -82 L -120 -32 M 146 -82 L 120 -32" fill="none" stroke="#2A9944" stroke-width="10" stroke-linecap="round"/>
  <ellipse cx="-62" cy="-72" rx="14" ry="30" transform="rotate(20 -62 -72)" fill="#fff" opacity=".5"/>
  ${face(30)}
</g>`

// une chaussette rayée (pointe à droite), x/y = haut de la tige
const sock = (x, y, c, s) => `<g transform="translate(${x} ${y})">
  <path d="M -45 -130 L 45 -130 L 45 40 Q 50 62 80 66 Q 132 74 128 116 Q 122 150 70 146 L -10 140 Q -55 134 -50 80 Z" fill="${c}" ${S()}/>
  <path d="M -46 -94 L 45 -94 M -47 -58 L 45 -58" fill="none" stroke="${s}" stroke-width="18"/>
  <path d="M -45 -130 L 45 -130 L 45 -108 L -45 -108 Z" fill="#fff" ${S(8)}/>
  <path d="M 92 74 Q 124 92 120 126" fill="none" stroke="${s}" stroke-width="12" stroke-linecap="round"/>
  ${miniFace(0, 0)}
</g>`
const socks = `${sock(-95, 0, '#FFC93C', '#FF6F91')}${sock(70, 20, '#8E5BD9', '#5BC0FF')}`

// robe rose à pois, nœud
const dress = `<g transform="translate(0 0)">
  <path d="M -48 -170 L -32 -110 L 32 -110 L 48 -170" fill="none" ${S(10)}/>
  <path d="M -62 -110 Q 0 -96 62 -110 L 78 -20 Q 180 120 176 168 Q 0 196 -176 168 Q -180 120 -78 -20 Z" fill="#FF6F91" ${S()}/>
  <path d="M -78 -20 Q 0 0 78 -20" fill="none" ${S(9)}/>
  <circle cx="-110" cy="120" r="12" fill="#fff"/><circle cx="-40" cy="150" r="12" fill="#fff"/><circle cx="40" cy="150" r="12" fill="#fff"/><circle cx="110" cy="120" r="12" fill="#fff"/>
  <path d="M 0 -18 L -34 -40 L -34 2 Z M 0 -18 L 34 -40 L 34 2 Z" fill="#FFC93C" ${S(7)}/><circle cx="0" cy="-18" r="10" fill="#FFC93C" ${S(7)}/>
  <ellipse cx="-36" cy="-72" rx="10" ry="22" transform="rotate(15 -36 -72)" fill="#fff" opacity=".5"/>
  ${face(66)}
</g>`

export default {
  id: 'clothes',
  title: { en: 'Clothes', th: 'เสื้อผ้า', emoji: '👕', say: "Let's get dressed!" },
  color: '#3FA7F5',
  words: [
    { en: 'Hat', say: 'แฮ็ท', th: 'หมวก', art: 'hat', color: '#3FA7F5',
      gag: { type: 'bonk', sfx: 'bonk', scale: 0.62 }, sound: 'Bonk!' },
    { en: 'Shoes', say: 'ชูส์', th: 'รองเท้า', art: 'shoes', color: '#F23B3B', plural: true,
      gag: { type: 'run', sfx: 'step', scale: 0.7 }, sound: 'Tap tap!' },
    { en: 'Shirt', say: 'เชิ้ร์ท', th: 'เสื้อ', art: 'shirt', color: '#3DBE5A',
      gag: { type: 'float', balloon: '#FFC93C', sfx: 'giggle', scale: 0.6 }, sound: 'Wheee!' },
    { en: 'Socks', say: 'ซ็อกส์', th: 'ถุงเท้า', art: 'socks', color: '#8E5BD9', plural: true,
      gag: { type: 'pop', sfx: 'sparkle', scale: 0.72 }, sound: 'Ta-da!' },
    { en: 'Dress', say: 'เดรส', th: 'ชุดกระโปรง', art: 'dress', color: '#FF6F91',
      gag: { type: 'fly', sfx: 'whoosh', scale: 0.66 }, sound: 'Twirl!' },
  ],
  art: { hat, shoes, shirt, socks, dress },
  quiz: { answer: 1, choices: [2, 1, 4] }, // « Where are the shoes? » parmi t-shirt, chaussures, robe (« Shoes » est net à l'oreille)
}
