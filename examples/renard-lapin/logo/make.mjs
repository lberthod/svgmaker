// Logo de la série « Roussin & Lino » : pastille crème, les deux amis côte à côte, nom en lettres rondes.
// node logo/make.mjs → logo/logo.svg (1080x1080, 1 s) ; rendu PNG via svgmaker + ffmpeg (voir logo/build.sh)
import { writeFileSync } from 'node:fs';
import { INK, fox, rabbit, put, style } from '../lib/kit.mjs';

const S = 1080;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}" data-duration="1" data-fps="30">
<style>${style()}</style>
<rect width="${S}" height="${S}" fill="#fff4dc"/>
<circle cx="540" cy="470" r="400" fill="#ffd23f" stroke="${INK}" stroke-width="14"/>
<circle cx="540" cy="470" r="352" fill="#bfe3ff" stroke="${INK}" stroke-width="8"/>
<path d="M188 600 Q540 520 892 600 L860 720 Q540 860 220 720Z" fill="#7ccf5a" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
${put(380, 700, 1.7, fox({ mood: 'happy' }))}
${put(735, 700, 1.7, rabbit({ mood: 'happy' }), true)}
<g transform="translate(540 890) rotate(-3)">
  <rect x="-430" y="-96" width="860" height="170" rx="60" fill="#fff" stroke="${INK}" stroke-width="12"/>
  <text y="30" class="sfx" style="font-size:116px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin <tspan style="fill:#2b5ba8">&amp;</tspan> <tspan style="fill:#2b5ba8">Lino</tspan></text>
</g>
</svg>`;
writeFileSync(new URL('./logo.svg', import.meta.url), svg);
console.log('logo.svg');
