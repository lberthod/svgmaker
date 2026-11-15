// Format « dialogue » : feuille de style (animations nommées dg*, fenêtres de plans, bouche de repli).
// Les animations dont l'amplitude varie lisent des variables CSS (--k, --k0) posées sur l'élément animé.

export const DIALOGUE_CSS = `
.fx,.pop{transform-box:fill-box;transform-origin:center}
@keyframes dwin{0%{opacity:0}.01%,99.9%{opacity:1}100%{opacity:0}}
@keyframes dwin0{0%,99.9%{opacity:1}100%{opacity:0}}
@keyframes dwinEnd{0%{opacity:0}.01%,100%{opacity:1}}
@keyframes dwinOnly{from,to{opacity:1}}
@keyframes dshot{from,to{opacity:1}}
@keyframes dgOn{from,to{opacity:1}}
@keyframes dgOff{from,to{opacity:0}}
@keyframes dgBat{0%{opacity:1}50%{opacity:0}}
@keyframes talk{from{opacity:1;transform:scale(.8,.12)}to{opacity:1;transform:scale(1.05,1.1)}}
@keyframes dgBreath{0%,100%{transform:scale(1,1)}50%{transform:scale(1.012,1.022)}}
@keyframes dgBlink{0%,91%,100%{transform:scaleY(0)}94.5%{transform:scaleY(1)}}
@keyframes dgDrop{0%{opacity:0;transform:translateY(-1100px)}1%{opacity:1}60%{transform:translateY(0)}72%{transform:translateY(-70px)}84%{transform:translateY(0)}92%{transform:translateY(-16px)}100%{opacity:1;transform:none}}
@keyframes dgRise{0%{opacity:0;transform:translateY(700px)}100%{opacity:1;transform:none}}
@keyframes dgFly{0%{opacity:0;transform:translate(-1300px,-360px) rotate(-25deg)}1%{opacity:1}100%{opacity:1;transform:none}}
@keyframes dgFlyOut{to{opacity:0;transform:translate(1300px,-420px) rotate(25deg)}}
@keyframes dgSlideL{0%{opacity:0;transform:translateX(-1200px)}1%{opacity:1}100%{opacity:1;transform:none}}
@keyframes dgSlideR{0%{opacity:0;transform:translateX(1200px)}1%{opacity:1}100%{opacity:1;transform:none}}
@keyframes dgSlideLOut{to{opacity:0;transform:translateX(-1200px)}}
@keyframes dgSlideROut{to{opacity:0;transform:translateX(1200px)}}
@keyframes dgPopOut{to{opacity:0;transform:scale(.2)}}
@keyframes dgDropOut{to{opacity:0;transform:translateY(1300px)}}
@keyframes dgGrow{from{transform:scale(var(--k0,1))}to{transform:scale(var(--k,1))}}
@keyframes dgShrink{from{transform:scale(1)}to{transform:scale(var(--k,.3))}}
@keyframes dgPulse{0%,100%{transform:scale(1)}50%{transform:scale(var(--k,1.14))}}
@keyframes dgWiggle{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
@keyframes dgBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-26px)}}
@keyframes dgStamp{0%{opacity:0;transform:scale(3.2) rotate(-14deg)}55%{opacity:1;transform:scale(.9) rotate(2deg)}72%{transform:scale(1.07)}100%{opacity:1;transform:none}}
@keyframes dgPress{0%{transform:none;animation-timing-function:ease-in}42%{transform:translateY(calc(var(--k,40) * 1px));animation-timing-function:linear}62%{transform:translateY(calc(var(--k,40) * 1px));animation-timing-function:ease-out}100%{transform:none}}
@keyframes dgPullBar{0%,100%{transform:rotate(calc(var(--k0,-35) * 1deg))}28%,45%{transform:rotate(0deg)}}
@keyframes dgFlipX{0%,100%{transform:scaleX(1)}50%{transform:scaleX(0)}}
@keyframes dgDrain{from{transform:scaleY(1)}to{transform:scaleY(0)}}
@keyframes dgFill{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes dgBonk{0%{opacity:1;transform:translateY(-1000px) rotate(0)}30%{transform:translateY(0) rotate(0)}38%{transform:translateY(-34px) rotate(25deg)}100%{opacity:0;transform:translate(300px,420px) rotate(330deg)}}
@keyframes dgHop{0%,100%{transform:translateY(0)}40%{transform:translateY(-70px)}}
@keyframes dgJump{0%{transform:scale(1.1,.88)}20%{transform:translateY(-70px) scale(.92,1.1)}50%{transform:translateY(-170px)}85%{transform:scale(.95,1.05)}92%{transform:scale(1.12,.88)}100%{transform:none}}
@keyframes dgNod{0%,100%{transform:translateY(0) rotate(0)}20%{transform:translateY(16px) rotate(2deg)}40%{transform:translateY(0)}60%{transform:translateY(16px) rotate(2deg)}80%{transform:translateY(0)}}
@keyframes dgShake{0%,100%{transform:translateX(0)}12%{transform:translateX(-20px)}30%{transform:translateX(20px)}48%{transform:translateX(-16px)}66%{transform:translateX(14px)}84%{transform:translateX(-8px)}}
@keyframes dgTilt{0%,100%{transform:rotate(0)}30%,70%{transform:rotate(9deg)}}
@keyframes dgTiltBack{0%,100%{transform:rotate(0)}30%,70%{transform:rotate(-9deg)}}
@keyframes dgBurst{0%{opacity:0;transform:scale(.3) rotate(0)}30%{opacity:1}100%{opacity:0;transform:scale(1.4) rotate(40deg)}}
@keyframes dgCd{0%{opacity:0;transform:scale(1.8)}18%{opacity:1;transform:scale(1)}80%{opacity:1;transform:scale(.96)}100%{opacity:0;transform:scale(.7)}}
@keyframes dgRing{0%{opacity:0;transform:scale(.9)}20%,100%{opacity:1;transform:scale(1)}}
`

/** Animations disponibles pour les accessoires (`anims[].do`) : [keyframes, durée par défaut, itérations par seconde, remplissage]. */
export const PROP_ANIMS = {
  pop: ['pop', 0.6, 0, 'both'], drop: ['dgDrop', 0.9, 0, 'both'], rise: ['dgRise', 0.8, 0, 'both'], fly: ['dgFly', 0.9, 0, 'both'],
  stamp: ['dgStamp', 0.5, 0, 'both'], fade: ['fadeIn', 0.5, 0, 'both'], grow: ['dgGrow', 1.2, 0, 'forwards'], shrink: ['dgShrink', 1.2, 0, 'forwards'],
  flipx: ['dgFlipX', 0.4, 0, 'none'],
  wiggle: ['dgWiggle', 1.4, 1 / 1.4, 'none'], spin: ['dgSpin', 1, 1, 'none'], bounce: ['dgBounce', 0.9, 1 / 0.9, 'none'], pulse: ['dgPulse', 0.9, 1 / 0.9, 'none'],
}
export const PROP_ENTERS = ['pop', 'drop', 'rise', 'fly', 'fade', 'stamp', 'grow', 'none']
export const PROP_EXITS = { fade: 'out', pop: 'dgPopOut', fly: 'dgFlyOut', drop: 'dgDropOut', shrink: 'dgPopOut' }
export const IDLES = { wiggle: 'dgWiggle 1.6s ease-in-out infinite', bounce: 'dgBounce 1s ease-in-out infinite', pulse: 'dgPulse 1.2s ease-in-out infinite', none: '' }
/** Animations de parties d'un dessin (`parts[].do`). */
export const PART_ANIMS = {
  pop: ['pop', 0.5, 'both'], appear: ['fadeIn', 0.4, 'both'], vanish: ['out', 0.4, 'forwards'], pulse: ['dgPulse', 0.8, 'none'], wiggle: ['dgWiggle', 1.2, 'none'],
  shrink: ['dgShrink', 1.2, 'forwards'], grow: ['dgGrow', 1.2, 'both'], drain: ['dgDrain', 3, 'forwards'],
  show: ['dgShowP', 0.25, 'forwards'], hide: ['dgHideP', 0.25, 'forwards'], flicker: ['dgFlicker', 0.6, 'none'], smoke: ['dgSmoke', 2.2, 'none'],
  twinkle: ['dgTwinkle', 1.6, 'none'], swing: ['dgSwing', 1.6, 'none'], sway: ['dgSway', 3, 'none'], glow: ['dgGlowP', 2, 'none'], spin: ['dgSpin', 1, 'none'], press: ['dgPress', 1.2, 'none'], pullbar: ['dgPullBar', 0.9, 'both'], fill: ['dgFill', 3, 'both'], stamp: ['dgStamp', 0.5, 'both'],
}
/** Actions d'un acteur (`do`) : [keyframes, durée par défaut]. */
export const ACTOR_ACTIONS = { hop: ['dgHop', 0.5], bigjump: ['dgJump', 0.9], nod: ['dgNod', 1.1], shake: ['dgShake', 0.9], tilt: ['dgTilt', 1.4], tiltback: ['dgTiltBack', 1.4], surprised: ['dgHop', 0.45] }
export const ACTOR_ENTERS = ['pop', 'drop', 'rise', 'slide-left', 'slide-right', 'fade', 'none']
export const ACTOR_EXITS = ['fade', 'pop', 'drop', 'slide-left', 'slide-right']
