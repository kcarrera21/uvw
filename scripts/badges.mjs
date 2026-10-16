// Badge artwork venues can put on their own sites: a round seal and a horizontal bar (light + dark),
// personalized with the venue's name. Imported by scripts/creatives.mjs.
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Short display name for tight spaces: drop parentheticals and trailing "Weddings".
export const badgeName = (name) => name.replace(/\s*\([^)]*\)/g, "").replace(/\s+Weddings?$/i, "").trim();

const C = { ink: "#2A2328", plum: "#3D2A33", cream: "#FBF1EC", rose: "#E8A0A8", roseDeep: "#8E4F5A", champ: "#D9B88F", sage: "#5E7356" };

// Rosette edge: a circle with small rounded scallops, the classic "official seal" outline.
function rosette(cx, cy, r, n, depth) {
  let d = "";
  for (let i = 0; i <= n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const rr = i % 2 ? r - depth : r;
    const x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a);
    d += (i ? " L" : "M") + x.toFixed(2) + " " + y.toFixed(2);
  }
  return d + " Z";
}
const star = (x, y, s, fill) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -10 Q1.2 -1.2 10 0 Q1.2 1.2 0 10 Q-1.2 1.2 -10 0 Q-1.2 -1.2 0 -10Z" fill="${fill}"/>`;

// The seal, drawn in a 400×400 box. `name` is the venue (optional: generic seal says "Las Vegas").
export function sealSVG({ name = "", year, size = 400, id = "s" } = {}) {
  const cx = 200, cy = 200;
  const nm = badgeName(name);
  const words = nm ? nm.split(/\s+/) : [];
  // break the venue name into up to 3 balanced lines
  const maxLine = nm.length <= 14 ? 14 : nm.length <= 26 ? 14 : 16;
  const lines = [];
  for (const w of words) { const l = lines[lines.length - 1]; if (l && (l + " " + w).length <= maxLine) lines[lines.length - 1] = l + " " + w; else lines.push(w); }
  const fs = !nm ? 0 : lines.length === 1 ? (nm.length <= 9 ? 42 : nm.length <= 12 ? 36 : 31) : lines.length === 2 ? 29 : 24;
  const lh = fs * 1.12;
  const nameTop = cy + 6 - ((lines.length - 1) * lh) / 2;
  const nameSvg = lines.map((l, i) => `<text x="${cx}" y="${(nameTop + i * lh).toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-family="PF, serif" font-weight="500" font-size="${fs}" fill="${C.cream}">${esc(l)}</text>`).join("");
  const rt = 156, rb = 173; // top text baseline radius / bottom text baseline radius
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="${size}" height="${size}">
<defs>
  <radialGradient id="${id}g" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="#4A3340"/><stop offset="1" stop-color="${C.ink}"/></radialGradient>
  <path id="${id}t" d="M ${cx - rt} ${cy} A ${rt} ${rt} 0 0 1 ${cx + rt} ${cy}"/>
  <path id="${id}b" d="M ${cx - rb} ${cy} A ${rb} ${rb} 0 0 0 ${cx + rb} ${cy}"/>
</defs>
<path d="${rosette(cx, cy, 198, 60, 5)}" fill="${C.champ}"/>
<circle cx="${cx}" cy="${cy}" r="188" fill="url(#${id}g)"/>
<circle cx="${cx}" cy="${cy}" r="181" fill="none" stroke="${C.champ}" stroke-width="1.6"/>
<circle cx="${cx}" cy="${cy}" r="136" fill="none" stroke="${C.champ}" stroke-width="1.6"/>
<circle cx="${cx}" cy="${cy}" r="130" fill="none" stroke="${C.champ}" stroke-width="0.8" opacity=".7"/>
<text font-family="IN, sans-serif" font-weight="600" font-size="19.5" letter-spacing="5.2" fill="${C.cream}"><textPath href="#${id}t" startOffset="50%" text-anchor="middle">UNIQUE VEGAS WEDDINGS</textPath></text>
<text font-family="IN, sans-serif" font-weight="600" font-size="19.5" letter-spacing="5.2" fill="${C.rose}"><textPath href="#${id}b" startOffset="50%" text-anchor="middle">OFFICIALLY LISTED</textPath></text>
${star(cx - 165, cy + 2, 0.75, C.champ)}${star(cx + 165, cy + 2, 0.75, C.champ)}
<g transform="translate(${cx - 24} ${nm ? nameTop - lh / 2 - 66 : cy - 80}) scale(0.75)"><circle cx="32" cy="38" r="17" fill="none" stroke="${C.rose}" stroke-width="4.5"/><path d="M32 4 Q34 13 43 15 Q34 17 32 26 Q30 17 21 15 Q30 13 32 4Z" fill="${C.rose}"/></g>
${nm ? nameSvg : `<text x="${cx}" y="${cy + 10}" text-anchor="middle" dominant-baseline="middle" font-family="PF, serif" font-style="italic" font-weight="500" font-size="40" fill="${C.cream}">Las Vegas</text>`}
<line x1="${cx - 34}" y1="${(nm ? nameTop + (lines.length - 1) * lh + lh / 2 + 16 : cy + 44).toFixed(1)}" x2="${cx + 34}" y2="${(nm ? nameTop + (lines.length - 1) * lh + lh / 2 + 16 : cy + 44).toFixed(1)}" stroke="${C.champ}" stroke-width="1.2"/>
<text x="${cx}" y="${(nm ? nameTop + (lines.length - 1) * lh + lh / 2 + 40 : cy + 68).toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-family="IN, sans-serif" font-weight="600" font-size="17" letter-spacing="4" fill="${C.champ}">${year}</text>
</svg>`;
}


// Small emblem used inside the bar: same seal, no ring text (unreadable at that size).
export function miniSealSVG({ year, size = 168, id = "m" } = {}) {
  const cx = 200, cy = 200;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="${size}" height="${size}">
<defs><radialGradient id="${id}g" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="#4A3340"/><stop offset="1" stop-color="${C.ink}"/></radialGradient></defs>
<path d="${rosette(cx, cy, 198, 48, 7)}" fill="${C.champ}"/>
<circle cx="${cx}" cy="${cy}" r="186" fill="url(#${id}g)"/>
<circle cx="${cx}" cy="${cy}" r="170" fill="none" stroke="${C.champ}" stroke-width="3"/>
<circle cx="${cx}" cy="${cy}" r="158" fill="none" stroke="${C.champ}" stroke-width="1.6" opacity=".7"/>
<g transform="translate(${cx - 72} ${cy - 118}) scale(2.25)"><circle cx="32" cy="38" r="17" fill="none" stroke="${C.rose}" stroke-width="4"/><path d="M32 4 Q34 13 43 15 Q34 17 32 26 Q30 17 21 15 Q30 13 32 4Z" fill="${C.rose}"/></g>
<text x="${cx}" y="${cy + 92}" text-anchor="middle" dominant-baseline="middle" font-family="IN, sans-serif" font-weight="600" font-size="40" letter-spacing="8" fill="${C.champ}">${year}</text>
${star(cx - 128, cy + 92, 1.1, C.champ)}${star(cx + 128, cy + 92, 1.1, C.champ)}
</svg>`;
}

// Horizontal bar, 600×200 box (shown at 300×100). theme: "light" | "dark".
export function barHTML({ name = "", year, theme = "light" } = {}) {
  const dark = theme === "dark";
  const nm = badgeName(name) || "Unique Vegas Weddings";
  const fs = nm.length <= 16 ? 38 : nm.length <= 22 ? 33 : nm.length <= 28 ? 28 : 24;
  return `<div style="width:600px;height:200px;border-radius:28px;background:${dark ? C.ink : C.cream};border:3px solid ${dark ? "#4A3A42" : "#E6D3CD"};display:flex;align-items:center;gap:24px;padding:0 34px 0 18px;box-sizing:border-box">
  <div style="flex:none;width:156px;height:156px">${miniSealSVG({ year, size: 156, id: "bb" + theme })}</div>
  <div style="min-width:0">
    <div style="font:600 15px IN;letter-spacing:.24em;text-transform:uppercase;color:${dark ? C.rose : C.roseDeep}">Officially listed · ${year}</div>
    <div style="font:500 ${fs}px/1.12 PF;color:${dark ? C.cream : C.ink};margin:10px 0 10px;overflow-wrap:anywhere">${esc(nm)}</div>
    <div style="font:500 17px IN;color:${dark ? "#CDB8B3" : C.sage}">on <span style="font-family:PF;font-style:italic;font-size:19px;color:${dark ? C.cream : C.ink}">Unique Vegas Weddings</span></div>
  </div></div>`;
}
