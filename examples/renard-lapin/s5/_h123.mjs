// Aides communes aux épisodes s5e01–s5e03 (bulles auto-placées, trajectoires, pastille d'heure, carton final, contrôle de cadrage).
import { W, H, INK, lines, an, vis, ss, track } from '../lib/kit.mjs';
import { say as say0 } from '../lib/props.mjs';
import { wallClock } from '../lib/classroom.mjs';

const lerp = (a, b, u) => a + (b - a) * u;
// hauteur (tête) approximative au sol, à l'échelle 1
export const TALL = { fox: 215, rab: 270, owl: 215, mimi: 175, coin: 160, hedge: 175, badger: 200, frog: 170, beaver: 235, giraffe: 420, mole: 175, snail: 120 };

// trajectoire : pts = [[t, x, y, rot, scale]] lissées ; visible de t0 à t1
export const mover = (inner, pts) => {
  const t0 = pts[0][0], t1 = pts[pts.length - 1][0];
  const fn = (t) => {
    let i = 0; while (i < pts.length - 2 && t > pts[i + 1][0]) i++;
    const [a, xa, ya, ra = 0, sa = 1] = pts[i], [b, xb, yb, rb = 0, sb = 1] = pts[i + 1];
    const u = ss(Math.min(1, Math.max(0, (t - a) / (b - a))));
    return { x: lerp(xa, xb, u), y: lerp(ya, yb, u), r: lerp(ra, rb, u), s: lerp(sa, sb, u) };
  };
  return vis(t0, t1, track(inner, t0, t1, fn, 30));
};

// pastille d'heure (espace écran, haut gauche)
export const pastille = (h, m = 0) => `<g transform="translate(22 18)"><rect x="3" y="5" width="198" height="66" rx="22" fill="#000" opacity=".22"/><rect width="198" height="66" rx="22" fill="#fff" stroke="${INK}" stroke-width="5"/>
  <g transform="translate(38 33) scale(.46)">${wallClock(h, m, 0, 0)}</g><text x="122" y="45" class="bt" style="font-size:34px">${h} h ${String(m).padStart(2, '0')}</text></g>`;

export const endCard = (t, next) => `<g style="transform-origin:640px 130px;${an({ n: 'finin', d: 0.45, t, f: 'both' })}"><g transform="translate(640 130)">
  <rect x="-330" y="-86" width="660" height="180" rx="30" fill="#000" opacity=".2" transform="translate(6 8)"/><rect x="-330" y="-86" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <text y="-22" class="sfx" style="font-size:46px;fill:#e8434e;stroke:#fff;stroke-width:0">Roussin &amp; Lino — Saison 5</text>
  <text y="22" class="bt" style="font-size:34px;fill:#2b5ba8">${next[0]}</text>
  <text y="64" class="bt" style="font-size:25px;fill:#7a6a5a">${next[1]}</text></g></g>`;

// acteurs : { id, x, y, s, hl, hr, t0, t1, path:[[t,x,y]] } ; pos(t) interpole
export const mkActors = (list) => list.map((a) => ({ hl: 70, hr: 110, t0: 0, t1: 30, ...a, pos(t) {
  const p = this.path; if (!p) return [this.x, this.y];
  let i = 0; while (i < p.length - 2 && t > p[i + 1][0]) i++;
  const [ta, xa, ya] = p[i], [tb, xb, yb] = p[Math.min(i + 1, p.length - 1)];
  const u = tb === ta ? 1 : ss(Math.min(1, Math.max(0, (t - ta) / (tb - ta))));
  return [lerp(xa, xb, u), lerp(ya ?? this.y, yb ?? this.y, u)];
} }));

// bulle auto : la pointe vise le haut de la tête du locuteur (id) à l'instant t0
export const mkSay = (scr, ACT) => (who, tx, a, d, o = {}) => {
  const ac = ACT.find((q) => q.id === (o.act || who) && a >= q.t0 - 0.01 && a <= q.t1 + 0.01) || ACT.find((q) => q.id === (o.act || who));
  const [x, y] = ac.pos(a + 0.3);
  const top = y - (o.tall ?? TALL[who] ?? 200) * ac.s;
  const [tx0, ty0] = scr(x + (o.dx ?? 0), top - 8, a + 0.3);
  const by = o.by ?? Math.max(150, ty0 - 90);
  const bx = o.bx ?? tx0 + (o.bxo || 0);
  return say0(who, tx, a, d, { bx, by, tips: [[tx0, ty0]], shout: !!o.shout, fs: o.shout ? 50 : 41 });
};

// contrôle de cadrage : aucun acteur ne doit être coupé par le bord d'un plan (marge 40 px) ; ≤ 4 acteurs dans un plan serré
export const checkFraming = (SHOTS, ACT, name) => {
  const warn = [];
  for (const [a, b, cx0, cy0, z0, z1] of SHOTS) {
    for (let t = a + 0.05; t < b; t += 0.4) {
      const z = lerp(z0, z1, (t - a) / (b - a));
      const cx = Math.min(Math.max(cx0, 640 / z), W - 640 / z), cy = Math.min(Math.max(cy0, 360 / z), H - 360 / z);
      const vx0 = cx - 640 / z, vx1 = cx + 640 / z, vy0 = cy - 360 / z, vy1 = cy + 360 / z;
      let inView = 0;
      for (const ac of ACT) {
        if (t < ac.t0 || t > ac.t1) continue;
        const [x, y] = ac.pos(t);
        const L = x - ac.hl * ac.s, R = x + ac.hr * ac.s, T = y - (ac.tall ?? TALL[ac.id] ?? 200) * ac.s, B = y;
        const overlap = R > vx0 && L < vx1 && B > vy0 && T < vy1;
        if (!overlap) continue;
        inView++;
        const m = 40 / z;
        if (L < vx0 + m || R > vx1 - m || B > vy1 - m * 0.3 || (T < vy0 && z > 1.2)) {
          if (ac.underFrame && B > vy1 - m) continue;
          warn.push(`t=${t.toFixed(1)} ${ac.id} coupé (vue x ${vx0.toFixed(0)}–${vx1.toFixed(0)}, y ${vy0.toFixed(0)}–${vy1.toFixed(0)}; acteur x ${L.toFixed(0)}–${R.toFixed(0)}, y ${T.toFixed(0)}–${B.toFixed(0)})`);
        }
      }
      if (z > 1.25 && inView > 4) warn.push(`t=${t.toFixed(1)} ${inView} acteurs dans un plan serré`);
    }
  }
  const uniq = [...new Set(warn)];
  if (uniq.length) console.warn(`[${name}] cadrage :\n  ` + uniq.slice(0, 25).join('\n  '));
  else console.log(`[${name}] cadrage OK`);
  // contrôle bulles : ≤ 12 répliques, ≤ 5 mots
  if (lines.length > 12) console.warn(`[${name}] ${lines.length} répliques (> 12)`);
  for (const l of lines) if (l.text.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length > 5) console.warn(`[${name}] réplique trop longue : « ${l.text} »`);
  for (let i = 1; i < lines.length; i++) { const p = lines.slice().sort((x, y) => x.t0 - y.t0); if (p[i].t0 < p[i - 1].t1 - 0.01) console.warn(`[${name}] bulles superposées : « ${p[i - 1].text} » / « ${p[i].text} »`); }
};
