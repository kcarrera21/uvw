// Generative, original SVG artwork for every venue + category.
// Seeded by slug so each venue gets its own landscape but stays on-brand.
// No photos, no scraped images, no licensing questions.

function hash(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h >>> 0);
}
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n) => Math.round(n * 10) / 10;

export const PALETTES = {
  "historic-iconic": { bg: ["#2B2B2E", "#5B3B46"], ridges: ["#4A3741", "#3A2D35", "#2A2226"], stroke: "#F7C9CF", accent: "#E8A0A8", sun: "#F6E4E1", night: true },
  "desert-outdoors": { bg: ["#FBEDE6", "#E7B4A1"], ridges: ["#DB9C86", "#C27F6D", "#9E6054"], stroke: "#FFFBF8", accent: "#5E7356", sun: "#FFF6EC", night: false },
  "sky-high": { bg: ["#34343F", "#C98E97"], ridges: ["#7C5C67", "#5C4752", "#3B3239"], stroke: "#F6E4E1", accent: "#E8A0A8", sun: "#FBE3D8", night: true },
  "strip-luxury": { bg: ["#FFF8F5", "#EBC6C1"], ridges: ["#E0B6B0", "#CC9D98", "#B7868A"], stroke: "#8E4F5A", accent: "#B76E79", sun: "#FFFFFF", night: false },
  "quirky-pop-culture": { bg: ["#EEF3EA", "#A9BC96"], ridges: ["#8FA87E", "#768F67", "#5E7356"], stroke: "#FFFBF8", accent: "#B76E79", sun: "#F6E4E1", night: false },
  "classic-chapels": { bg: ["#FFFBF8", "#F2D6D2"], ridges: ["#D5E0CC", "#B9CBAE", "#9CAF88"], stroke: "#8E4F5A", accent: "#B76E79", sun: "#FFFFFF", night: false },
};

function ridge(r, w, h, baseY, amp, steps) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const x = (w / steps) * i;
    const y = baseY + (r() - 0.5) * amp * 2;
    pts.push([x, y]);
  }
  // mesa-ish: occasionally flatten a top
  let d = `M0 ${h} L0 ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    if (r() < 0.25) {
      const yy = Math.min(y0, y1);
      d += ` L${f(x0 + (x1 - x0) * 0.2)} ${f(yy)} L${f(x0 + (x1 - x0) * 0.8)} ${f(yy)} L${f(x1)} ${f(y1)}`;
    } else {
      const cx = (x0 + x1) / 2;
      d += ` Q${f(cx)} ${f(Math.min(y0, y1) - amp * 0.3 * r())} ${f(x1)} ${f(y1)}`;
    }
  }
  d += ` L${w} ${h} Z`;
  return d;
}

function sparkle(x, y, s, fill, op = 1) {
  return `<path d="M${f(x)} ${f(y - s)} Q${f(x + s * 0.18)} ${f(y - s * 0.18)} ${f(x + s)} ${f(y)} Q${f(x + s * 0.18)} ${f(y + s * 0.18)} ${f(x)} ${f(y + s)} Q${f(x - s * 0.18)} ${f(y + s * 0.18)} ${f(x - s)} ${f(y)} Q${f(x - s * 0.18)} ${f(y - s * 0.18)} ${f(x)} ${f(y - s)}Z" fill="${fill}" opacity="${op}"/>`;
}

// ---------- motifs (drawn in a 400x400 local box, bottom-centered) ----------
function motif(cat, p, r) {
  const st = p.stroke, ac = p.accent;
  const sw = 3.2;
  switch (cat) {
    case "historic-iconic": {
      // vintage arrow sign with bulbs + pole
      let bulbs = "";
      for (let i = 0; i < 12; i++) bulbs += `<circle cx="${70 + i * 20}" cy="132" r="4.2" fill="${st}"/><circle cx="${70 + i * 20}" cy="228" r="4.2" fill="${st}"/>`;
      return `<g filter="url(#glow)">
        <path d="M60 120 H300 L352 180 L300 240 H60 Q48 240 48 228 V132 Q48 120 60 120Z" fill="none" stroke="${st}" stroke-width="${sw}"/>
        <path d="M76 140 H294 L334 180 L294 220 H76" fill="none" stroke="${ac}" stroke-width="2" stroke-dasharray="2 7" stroke-linecap="round"/>
        ${bulbs}
        <path d="M110 166 h120 M110 194 h86" stroke="${ac}" stroke-width="7" stroke-linecap="round"/>
        ${sparkle(268, 92, 22, st)}
      </g>
      <path d="M150 240 V400 M210 240 V400" stroke="${st}" stroke-width="${sw}" opacity=".8"/>`;
    }
    case "desert-outdoors": {
      // Joshua tree + ocotillo with flowering tips + desert rocks
      const tuft = (x, y) => {
        let s = "";
        for (let a = 0; a < 360; a += 30) {
          const rad = (a * Math.PI) / 180;
          s += `<line x1="${x}" y1="${y}" x2="${f(x + Math.cos(rad) * 16)}" y2="${f(y + Math.sin(rad) * 16)}" stroke="${st}" stroke-width="2.4" stroke-linecap="round"/>`;
        }
        return s;
      };
      return `<g fill="none" stroke="${st}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">
        <path d="M120 400 V250 Q120 220 95 205 Q80 196 82 170 M120 260 Q122 225 150 214 Q170 206 168 180 M120 300 Q118 280 140 270 Q160 262 172 236 M120 232 Q118 210 120 190"/>
        ${[-34, -21, -9, 4, 16, 29].map((deg, i) => { const a = (deg * Math.PI) / 180, L = 120 + (i % 2) * 22; const x1 = 292 + Math.sin(a) * L, y1 = 400 - Math.cos(a) * L; const cx = 292 + Math.sin(a) * L * 0.55 + (i % 2 ? 6 : -6), cy = 400 - Math.cos(a) * L * 0.55; return `<path d="M292 400 Q${f(cx)} ${f(cy)} ${f(x1)} ${f(y1)}" stroke-width="2.6"/>`; }).join("")}
        <path d="M236 400 Q240 384 258 384 Q272 384 276 400 M310 400 Q316 390 330 390 Q344 390 348 400" stroke-width="2.6"/>
      </g>${[-34, -21, -9, 4, 16, 29].map((deg, i) => { const a = (deg * Math.PI) / 180, L = 120 + (i % 2) * 22; return `<path d="M${f(292 + Math.sin(a) * L)} ${f(400 - Math.cos(a) * L)} l${f(Math.sin(a) * 14)} ${f(-Math.cos(a) * 14)}" stroke="#B76E79" stroke-width="6" stroke-linecap="round"/>`; }).join("")}${tuft(82, 170)}${tuft(168, 180)}${tuft(172, 236)}${tuft(120, 190)}`;
    }
    case "sky-high": {
      // needle tower + observation wheel
      let spokes = "", cabins = "";
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        spokes += `<line x1="276" y1="250" x2="${f(276 + Math.cos(a) * 92)}" y2="${f(250 + Math.sin(a) * 92)}"/>`;
        cabins += `<ellipse cx="${f(276 + Math.cos(a) * 100)}" cy="${f(250 + Math.sin(a) * 100)}" rx="8" ry="6" fill="${p.stroke}" stroke="none"/>`;
      }
      return `<g fill="none" stroke="${st}" stroke-width="${sw}" stroke-linecap="round">
        <path d="M112 400 L122 140 M140 400 L130 140"/>
        <path d="M98 140 H154 L146 116 H106 Z"/>
        <path d="M104 116 Q126 96 148 116"/>
        <path d="M126 96 V40"/>
        <circle cx="276" cy="250" r="92"/>
        <g stroke-width="1.4" opacity=".75">${spokes}</g>
        <path d="M256 400 L276 250 L296 400"/>
      </g>${cabins}${sparkle(126, 34, 12, st)}`;
    }
    case "strip-luxury": {
      // fountain jets fanning from a basin + balustrade
      let arcs = "", drops = "";
      const n = 9;
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1) - 0.5;            // -0.5..0.5
        const x0 = 200 + t * 120;
        const hgt = 170 + (1 - Math.abs(t) * 2) * 120 + r() * 30;
        const reach = t * 330 + (t === 0 ? 0 : Math.sign(t) * 30);
        const x1 = x0 + reach;
        arcs += `<path d="M${f(x0)} 336 Q${f(x0 + reach * 0.35)} ${f(336 - hgt * 1.6)} ${f(x1)} ${f(Math.min(400, 336 + 10))}" />`;
        drops += `<circle cx="${f(x0 + reach * 0.4 + (r() - 0.5) * 10)}" cy="${f(336 - hgt * 0.82 - r() * 18)}" r="2.6" fill="${ac}"/>`;
      }
      let posts = "";
      for (let x = 20; x <= 380; x += 30) posts += `<path d="M${x} 352 q-6 12 0 24 q6 12 0 24"/>`;
      return `<g fill="none" stroke="${ac}" stroke-width="2.2" stroke-linecap="round" opacity=".9">${arcs}</g>${drops}
      <g fill="none" stroke="${st}" stroke-width="${sw}" stroke-linecap="round"><path d="M0 344 H400 M0 352 H400"/>${posts}</g>`;
    }
    case "quirky-pop-culture": {
      // atomic starburst + heart
      let rays = "";
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        const len = i % 2 ? 70 : 118;
        const x2 = 200 + Math.cos(a) * len, y2 = 200 + Math.sin(a) * len;
        rays += `<line x1="200" y1="200" x2="${f(x2)}" y2="${f(y2)}"/><circle cx="${f(x2)}" cy="${f(y2)}" r="${i % 2 ? 4 : 7}" fill="${st}" stroke="none"/>`;
      }
      return `<g stroke="${st}" stroke-width="2.6" stroke-linecap="round">${rays}</g>
      <path d="M200 252 C150 214 150 168 182 162 C194 160 200 170 200 178 C200 170 206 160 218 162 C250 168 250 214 200 252Z" fill="${ac}" stroke="${st}" stroke-width="${sw}"/>`;
    }
    case "classic-chapels":
    default: {
      // chapel with steeple, bell, heart window, arched door
      return `<g fill="none" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round">
        <path d="M110 400 V250 L200 180 L290 250 V400"/>
        <path d="M168 205 V120 L200 70 L232 120 V205"/>
        <path d="M200 70 V40"/>
        <path d="M186 132 Q186 112 200 112 Q214 112 214 132 Z"/>
        <path d="M200 132 v6"/>
        <path d="M172 400 V330 Q172 300 200 300 Q228 300 228 330 V400"/>
        <path d="M200 264 C186 254 186 240 194 238 C197 237 200 240 200 243 C200 240 203 237 206 238 C214 240 214 254 200 264Z" fill="${ac}"/>
      </g>${sparkle(200, 28, 12, ac)}`;
    }
  }
}

export function art(slug, cat, w = 800, h = 1000) {
  const p = PALETTES[cat] || PALETTES["classic-chapels"];
  const r = rng(hash(slug));
  const id = "g" + hash(slug + w + h).toString(36);
  const sunX = w * (0.2 + r() * 0.6), sunY = h * (0.18 + r() * 0.16), sunR = Math.min(w, h) * (0.09 + r() * 0.05);
  let stars = "";
  const nStars = p.night ? 22 : 8;
  for (let i = 0; i < nStars; i++) {
    const x = r() * w, y = r() * h * 0.5;
    stars += p.night
      ? (i % 4 === 0 ? sparkle(x, y, 4 + r() * 6, p.sun, 0.9) : `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.8 + r() * 1.6)}" fill="${p.sun}" opacity="${f(0.4 + r() * 0.5)}"/>`)
      : sparkle(x, y, 3 + r() * 6, "#FFFFFF", 0.7);
  }
  const r1 = ridge(r, w, h, h * (0.56 + r() * 0.06), h * 0.05, 5);
  const r2 = ridge(r, w, h, h * (0.68 + r() * 0.05), h * 0.045, 4);
  const r3 = ridge(r, w, h, h * (0.82 + r() * 0.04), h * 0.03, 3);
  const flip = r() < 0.5 && cat !== "classic-chapels";
  const scale = Math.min(w, h) / 400 * (w > h ? 0.62 : 0.86);
  const mx = w / 2 - 200 * scale + (r() - 0.5) * w * 0.1;
  const my = h - 400 * scale - h * 0.07;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.bg[0]}"/><stop offset="1" stop-color="${p.bg[1]}"/></linearGradient>
<radialGradient id="${id}s"><stop offset="0" stop-color="${p.sun}" stop-opacity="1"/><stop offset=".6" stop-color="${p.sun}" stop-opacity=".9"/><stop offset="1" stop-color="${p.sun}" stop-opacity="0"/></radialGradient>
<filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<rect width="${w}" height="${h}" fill="url(#${id}b)"/>
${stars}
<circle cx="${f(sunX)}" cy="${f(sunY)}" r="${f(sunR * 1.6)}" fill="url(#${id}s)" opacity=".55"/>
<circle cx="${f(sunX)}" cy="${f(sunY)}" r="${f(sunR)}" fill="${p.sun}" opacity="${p.night ? 0.95 : 0.9}"/>
<path d="${r1}" fill="${p.ridges[0]}"/>
<path d="${r2}" fill="${p.ridges[1]}"/>
<g transform="translate(${f(mx)} ${f(my)}) scale(${f(scale * 100) / 100})"><g transform="${flip ? "translate(400 0) scale(-1 1)" : ""}">${motif(cat, p, r)}</g></g>
<path d="${r3}" fill="${p.ridges[2]}"/>
</svg>`;
}

// ---------- brand marks ----------
export function markSVG(size = 64, color = "#B76E79", gem = "#B76E79") {
  // ring with a desert-star gem
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
<circle cx="32" cy="38" r="17" fill="none" stroke="${color}" stroke-width="4"/>
<path d="M32 4 Q34 13 43 15 Q34 17 32 26 Q30 17 21 15 Q30 13 32 4Z" fill="${gem}"/>
</svg>`;
}

export function logoSVG({ color = "#2B2B2E", accent = "#B76E79", sub = "#5E7356", width = 520 } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 96" width="${width}" height="${(width * 96) / 520}" role="img" aria-label="Unique Vegas Weddings">
<g transform="translate(0 12)">
<circle cx="36" cy="44" r="22" fill="none" stroke="${accent}" stroke-width="4.5"/>
<path d="M36 0 Q38.6 11.7 50 14.3 Q38.6 17 36 28.6 Q33.4 17 22 14.3 Q33.4 11.7 36 0Z" fill="${accent}"/>
</g>
<text x="80" y="54" font-family="'Playfair Display', Georgia, serif" font-size="40" font-weight="500" fill="${color}" letter-spacing="0.2">Unique <tspan font-style="italic" fill="${accent}">Vegas</tspan></text>
<text x="82" y="82" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="600" fill="${sub}" letter-spacing="7.2">WEDDINGS</text>
</svg>`;
}
