// Generates HTML for every rendered creative (OG images, Pinterest pins, icons,
// planner PDF, free checklist PDF, brand guide) + a job list for render.py.
// Usage: node scripts/creatives.mjs && python3 scripts/render.py
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { art, logoSVG, markSVG, PALETTES } from "./art.mjs";
import { venues, CATEGORIES } from "../src/data/venues.mjs";
import { guides } from "../src/content/guides.mjs";
import { config as C } from "../src/data/config.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TMP = path.join(ROOT, ".render");
fs.rmSync(TMP, { recursive: true, force: true });
fs.mkdirSync(TMP, { recursive: true });
const FONT = (f) => "file://" + path.join(ROOT, "src/assets/fonts", f);
const luckyCtx = {};
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "src/assets/js/lucky.js"), "utf8"), { globalThis: luckyCtx, window: luckyCtx });
const L = luckyCtx.UVWLucky;
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const money = (n) => "$" + Number(n).toLocaleString("en-US");
const jobs = [];
const catBy = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));

const BASE_CSS = `
@font-face{font-family:"PF";src:url(${FONT("playfair-display-latin-500-normal.woff2")});font-weight:500}
@font-face{font-family:"PF";src:url(${FONT("playfair-display-latin-400-normal.woff2")});font-weight:400}
@font-face{font-family:"PF";src:url(${FONT("playfair-display-latin-500-italic.woff2")});font-weight:500;font-style:italic}
@font-face{font-family:"PF";src:url(${FONT("playfair-display-latin-400-italic.woff2")});font-weight:400;font-style:italic}
@font-face{font-family:"IN";src:url(${FONT("inter-latin-400-normal.woff2")});font-weight:400}
@font-face{font-family:"IN";src:url(${FONT("inter-latin-500-normal.woff2")});font-weight:500}
@font-face{font-family:"IN";src:url(${FONT("inter-latin-600-normal.woff2")});font-weight:600}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:IN,sans-serif;color:#2B2B2E;-webkit-font-smoothing:antialiased}
.serif{font-family:PF,serif} em{font-style:italic;color:#B76E79}
`;
// logo SVGs reference 'Playfair Display'/'Inter' — map to our loaded names
const logo = (o) => logoSVG(o).replace(/'Playfair Display', Georgia, serif/g, "PF, serif").replace(/Inter, Arial, sans-serif/g, "IN, sans-serif");

function job(name, html, out, w, h, type = "png") {
  const file = path.join(TMP, name + ".html");
  fs.writeFileSync(file, `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}</style></head><body>${html}</body></html>`);
  jobs.push({ html: file, out: path.join(ROOT, out), w, h, type });
}

// Free-license photo for a slug when we have one (see src/data/photo-credits.json); otherwise the illustration.
const PHOTOS = fs.existsSync(path.join(ROOT, "src/data/photo-credits.json")) ? JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/photo-credits.json"), "utf8")) : {};
const PIN_PHOTO = { "pin-license": "little-church-of-the-west", "pin-cost": "bellagio", "pin-court": "welcome-to-fabulous-las-vegas-sign", "pin-season": "hero-2", "pin-elope": "hero-1", "pin-desert": "valley-of-fire-state-park", "pin-venues": "high-roller-wheel", "pin-drive": "tunnel-of-love-drive-thru", "pin-heli": "papillon-helicopter-weddings", "cat-classic-chapels": "cat-classic-chapels" };
const photoKey = (slug, cat) => (PHOTOS[slug] ? slug : PIN_PHOTO[slug] || (PHOTOS["cat-" + cat] ? "cat-" + cat : null));
const visual = (slug, cat, w, h) => {
  const key = photoKey(slug, cat);
  if (key && PHOTOS[key]) return `<img src="file://${path.join(ROOT, "src/assets/photos", key + ".webp")}" style="display:block;width:${w}px;height:${h}px;object-fit:cover">`;
  return art(slug, cat, 800, 1000).replace('width="800" height="1000"', `width="${w}" height="${h}"`);
};
// Small on-image credit, required by CC BY / BY-SA when the image travels without the page.
const visualCredit = (slug, cat) => {
  const key = photoKey(slug, cat);
  const p = key && PHOTOS[key];
  return p ? `<div style="position:absolute;right:10px;bottom:8px;font:500 13px IN;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.7);opacity:.9">Photo: ${esc(p.creator || "unknown")} · ${esc(p.license)}</div>` : "";
};

// ---------------------------------------------------------------- OG 1200x630
function og(name, { eyebrow, title, sub, slug, cat }) {
  const p = PALETTES[cat] || PALETTES["classic-chapels"];
  const html = `<div style="width:1200px;height:630px;display:grid;grid-template-columns:690px 510px;background:#FFFBF8;position:relative;overflow:hidden">
  <div style="padding:64px 40px 56px 72px;display:flex;flex-direction:column">
    <div style="width:300px">${logo({ width: 300 })}</div>
    <div style="margin-top:auto">
      <div style="font:600 18px IN;letter-spacing:.22em;text-transform:uppercase;color:#5E7356;margin-bottom:18px">${esc(eyebrow)}</div>
      <div class="serif" style="font-size:${title.length > 52 ? 50 : title.length > 34 ? 60 : 70}px;line-height:1.06;font-weight:500;letter-spacing:-.01em">${title}</div>
      ${sub ? `<div style="font:400 24px/1.4 IN;color:#5B5558;margin-top:20px">${esc(sub)}</div>` : ""}
    </div>
  </div>
  <div style="padding:0;position:relative"><div style="height:630px;overflow:hidden">${visual(slug, cat, 510, 630)}</div>${visualCredit(slug, cat)}</div>
  </div>`;
  job("og-" + name, html, `src/assets/og/${name}.png`, 1200, 630);
}
og("default", { eyebrow: "Unique Vegas Weddings", title: "Vegas weddings, <em>off-script.</em>", sub: "Unique venues · verified facts · published prices", slug: "the-neon-museum", cat: "historic-iconic" });
og("home", { eyebrow: `${venues.length} unique venues`, title: "Vegas weddings, <em>off-script.</em>", sub: "Neon boneyards, ghost towns, canyon floors and sky-high chapels.", slug: "the-neon-museum", cat: "historic-iconic" });
og("venues", { eyebrow: "The directory", title: "Unique Las Vegas <em>wedding venues</em>", sub: "Filter by setting and budget. Published prices.", slug: "valley-of-fire-state-park", cat: "desert-outdoors" });
og("guides", { eyebrow: "Plan it right", title: "Las Vegas wedding <em>guides</em>", sub: "Plain-English answers, every fact sourced.", slug: "cat-classic-chapels", cat: "classic-chapels" });
og("lucky", { eyebrow: "Updates itself", title: "Lucky wedding <em>dates</em>", sub: "Palindromes, mirror dates and lucky sevens.", slug: "lucky", cat: "quirky-pop-culture" });
og("planner", { eyebrow: "Printable PDF · 25 pages", title: "The Unique Vegas <em>Wedding Planner</em>", sub: "Built for Las Vegas logistics.", slug: "planner", cat: "strip-luxury" });
og("for-venues", { eyebrow: "For venues & planners", title: "Get found by couples who want <em>different</em>", sub: "", slug: "cat-sky-high", cat: "sky-high" });
og("budget", { eyebrow: "Free tool", title: "Vegas wedding <em>budget planner</em>", sub: "", slug: "budget", cat: "classic-chapels" });
for (let y = 2026; y <= 2031; y++) {
  const t = L.top(y, 3).map((a) => a.short).join(" · ");
  og("lucky-" + y, { eyebrow: "Lucky wedding dates", title: `The special dates of <em>${y}</em>`, sub: t, slug: "lucky-" + y, cat: "quirky-pop-culture" });
}
for (const c of CATEGORIES) og("cat-" + c.slug, { eyebrow: "Las Vegas wedding venues", title: `${esc(c.name.replace("&", "&amp;"))} <em>weddings</em>`, sub: c.blurb, slug: "cat-" + c.slug, cat: c.slug });
for (const v of venues) og("v-" + v.slug, { eyebrow: catBy[v.category].name, title: esc(v.name), sub: v.priceFrom ? `Weddings from ${money(v.priceFrom)} · ${v.area}` : v.area, slug: v.slug, cat: v.category });
const guideCat = { license: "classic-chapels", cost: "strip-luxury", season: "desert-outdoors", elope: "historic-iconic", desert: "desert-outdoors", renewal: "quirky-pop-culture", weekend: "sky-high", pack: "desert-outdoors" };
for (const g of guides) og("g-" + g.slug, { eyebrow: g.eyebrow, title: esc(g.title.replace(/:.*$/, "")), sub: "", slug: "g-" + g.slug, cat: guideCat[g.hero] || "classic-chapels" });

// ---------------------------------------------------------------- Pinterest 1000x1500
function pin(name, { kicker, title, list = [], foot, slug, cat }) {
  const html = `<div style="width:1000px;height:1500px;background:#FFFBF8;position:relative;overflow:hidden;display:flex;flex-direction:column">
  <div style="height:760px;margin:44px 44px 0;border-radius:20px;overflow:hidden;position:relative">${visual(slug, cat, 912, 760)}${visualCredit(slug, cat)}</div>
  <div style="padding:46px 70px 0;flex:1;display:flex;flex-direction:column">
    <div style="font:600 22px IN;letter-spacing:.24em;text-transform:uppercase;color:#5E7356">${esc(kicker)}</div>
    <div class="serif" style="font-size:${title.length > 44 ? 66 : 80}px;line-height:1.04;font-weight:500;margin-top:16px">${title}</div>
    ${list.length ? `<div style="margin-top:26px;display:flex;flex-direction:column;gap:12px">${list.map((x) => `<div style="font:500 30px IN;color:#2B2B2E;display:flex;gap:14px;align-items:center"><span style="color:#B76E79;font-size:26px">✦</span>${x}</div>`).join("")}</div>` : ""}
    <div style="margin-top:auto;padding-bottom:50px;display:flex;justify-content:space-between;align-items:center">
      <div style="width:330px">${logo({ width: 330 })}</div>
      <div style="font:600 24px IN;color:#8E4F5A">${esc(foot || "uniquevegasweddings.com")}</div>
    </div>
  </div></div>`;
  job("pin-" + name, html, `marketing/pins/${name}.png`, 1000, 1500);
}
pin("marriage-license", { kicker: "Las Vegas marriage license", title: "Get married in Vegas: <em>the paperwork</em>", list: ["$102 · no waiting period", "Open 8 a.m.–midnight daily", "Both partners, original IDs", "1 witness required"], slug: "pin-license", cat: "classic-chapels" });
pin("courthouse", { kicker: "Budget wedding", title: "The <em>$77.75</em> Vegas courthouse wedding", list: ["Appointment only", "1 witness + up to 8 guests", "Card payment only"], slug: "pin-court", cat: "classic-chapels" });
pin("cost", { kicker: "Real published prices", title: "What a Vegas wedding <em>actually</em> costs", list: ["Chapels from $150", "Neon Museum from $2,500", "Helicopter weddings from $1,249"], slug: "pin-cost", cat: "strip-luxury" });
pin("best-time", { kicker: "Month by month", title: "The best time to marry in <em>Las Vegas</em>", list: ["Mar–May: prime outdoor season", "Oct–Nov: golden & mild", "Jun–Aug: indoor, sunrise or night"], slug: "pin-season", cat: "desert-outdoors" });
pin("elope", { kicker: "48-hour game plan", title: "How to <em>elope</em> in Las Vegas", list: ["Pre-apply online", "License downtown, together", "Golden-hour ceremony", "Order certified copies"], slug: "pin-elope", cat: "historic-iconic" });
pin("desert-permits", { kicker: "Outdoor weddings", title: "Desert wedding <em>permits</em> near Vegas", list: ["Valley of Fire: closed Dec 1–14", "Red Rock: BLM permit", "Lake Mead: apply 45 business days out"], slug: "pin-desert", cat: "desert-outdoors" });
pin("unique-venues", { kicker: `${venues.length} unique venues`, title: "Vegas weddings, <em>off-script</em>", list: ["Neon boneyard", "Ghost town", "Shark reef", "800 feet up"], slug: "pin-venues", cat: "sky-high" });
pin("drive-thru", { kicker: "Only in Vegas", title: "Yes, the <em>drive-thru</em> wedding is real", list: ["Ceremonies from $150", "Cars, motorcycles, walk-ups", "Cherub-painted tunnel"], slug: "pin-drive", cat: "quirky-pop-culture" });
pin("neon-museum", { kicker: "Venue spotlight", title: "Getting married at the <em>Neon Museum</em>", list: ["Daytime from $2,500", "Stardust (night) $3,500", "Up to 90 guests with add-ons"], slug: "the-neon-museum", cat: "historic-iconic" });
pin("helicopter", { kicker: "Sky-high weddings", title: "Helicopter weddings <em>over Vegas</em>", list: ["Over the Strip from $1,249", "Grand Canyon floor from $4,399"], slug: "pin-heli", cat: "sky-high" });
for (let y = 2026; y <= 2028; y++) {
  const top = L.top(y, 4);
  pin("lucky-" + y, { kicker: "Lucky wedding dates", title: `The luckiest dates of <em>${y}</em>`, list: top.map((a) => `${a.short} · ${a.tags[0]}`), slug: "pin-lucky-" + y, cat: "quirky-pop-culture" });
}

// ---------------------------------------------------------------- icons
const iconHtml = (s, bg) => `<div style="width:${s}px;height:${s}px;display:grid;place-items:center;background:${bg}">${markSVG(Math.round(s * 0.78))}</div>`;
job("icon-32", iconHtml(32, "transparent"), "src/static/favicon-32.png", 32, 32);
job("icon-180", iconHtml(180, "#FFFBF8"), "src/static/apple-touch-icon.png", 180, 180);
job("icon-192", iconHtml(192, "#FFFBF8"), "src/assets/img/mark-192.png", 192, 192);
job("icon-512", iconHtml(512, "#FFFBF8"), "src/assets/img/mark-512.png", 512, 512);
job("logo-png", `<div style="width:1040px;height:192px;background:transparent">${logo({ width: 1040 })}</div>`, "brand/logo-primary.png", 1040, 192);
job("logo-light-png", `<div style="width:1040px;height:192px;background:#2B2B2E">${logo({ width: 1040, color: "#FFFFFF", accent: "#E8A0A8", sub: "#9CAF88" })}</div>`, "brand/logo-on-charcoal.png", 1040, 192);

// ---------------------------------------------------------------- PRINT DOCUMENTS (Letter)
const PRINT_CSS = `
@page{size:Letter;margin:0}
.pg{width:8.5in;height:11in;padding:.7in .75in .7in;position:relative;page-break-after:always;overflow:hidden;background:#fff;display:flex;flex-direction:column}
.fill{flex:1;min-height:0;overflow:hidden;margin-top:18px;background:repeating-linear-gradient(to bottom,transparent 0 25px,#E6D6D2 25px 26px)}.fill b{display:block;font:600 8.5px IN;letter-spacing:.2em;text-transform:uppercase;color:#5E7356;background:#fff;width:max-content;padding-right:8px;height:26px;line-height:26px}
.pg:last-child{page-break-after:auto}
.hd{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #EBDCD8;padding-bottom:10px;margin-bottom:22px}
.hd .k{font:600 9px IN;letter-spacing:.22em;text-transform:uppercase;color:#5E7356}
.hd .n{font:500 10px IN;color:#B76E79}
h1{font:500 34px/1.1 PF;margin-bottom:8px} h2{font:500 22px/1.15 PF;margin:18px 0 8px} h3{font:600 11px IN;letter-spacing:.16em;text-transform:uppercase;color:#5E7356;margin:16px 0 8px}
p{font:400 11.5px/1.55 IN;margin-bottom:8px;color:#3a3638} .sm{font-size:9.5px;color:#6b6466}
.box{border:1px solid #EBDCD8;border-radius:12px;padding:14px 16px;margin:10px 0}
.blush{background:#FBF2EF;border-color:#F0DCD7}
.ck{list-style:none;font:400 11.5px/1.5 IN} .ck li{display:flex;gap:10px;align-items:flex-start;padding:5px 0;border-bottom:1px dotted #E6D6D2}
.ck li::before{content:"";flex:0 0 13px;height:13px;border:1.5px solid #B76E79;border-radius:3px;margin-top:2px}
table{width:100%;border-collapse:collapse;font:400 10.5px IN} th{font:600 8.5px IN;letter-spacing:.14em;text-transform:uppercase;color:#5E7356;background:#E7EEE1;text-align:left;padding:7px 8px}
td{border-bottom:1px solid #EBDCD8;padding:0 8px;height:25px;vertical-align:middle}
.lines div{border-bottom:1px solid #E6D6D2;height:26px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.field{display:flex;gap:8px;align-items:flex-end;margin:9px 0;font:500 11px IN} .field span{white-space:nowrap} .field i{flex:1;border-bottom:1px solid #CDB9B5;height:16px}
.ft{position:absolute;left:.75in;right:.75in;bottom:.35in;display:flex;justify-content:space-between;font:500 8.5px IN;color:#9a8f8d}
.star{color:#B76E79}
`;
let pageNo = 0;
const P = (kicker, inner, opts = {}) => { pageNo++; return `<div class="pg"${opts.style ? ` style="${opts.style}"` : ""}>${opts.bare ? "" : `<div class="hd"><span class="k">${kicker}</span><span class="n">The Unique Vegas Wedding Planner</span></div>`}${inner}${opts.bare ? "" : `<div class="fill"><b>Notes</b></div>`}${opts.bare ? "" : `<div class="ft"><span>uniquevegasweddings.com</span><span>${pageNo}</span></div>`}</div>`; };
const rows = (n, cols) => Array.from({ length: n }, () => `<tr>${"<td></td>".repeat(cols)}</tr>`).join("");
const lines = (n) => `<div class="lines">${"<div></div>".repeat(n)}</div>`;
const ck = (items) => `<ul class="ck">${items.map((i) => `<li><span>${i}</span></li>`).join("")}</ul>`;
const fieldsHtml = (labels) => labels.map((l) => `<div class="field"><span>${l}</span><i></i></div>`).join("");

const cover = `<div class="pg" style="padding:0;background:#FFFBF8">
  <div style="position:absolute;inset:0">${art("planner-cover", "historic-iconic", 816, 1056).replace('width="816" height="1056"', 'width="816" height="1056"')}</div>
  <div style="position:absolute;left:.7in;right:.7in;top:.8in;background:rgba(255,251,248,.94);border-radius:20px;padding:1.2in .5in .5in;text-align:center">
    <div style="width:70px;margin:0 auto 18px">${markSVG(70)}</div>
    <div style="font:600 11px IN;letter-spacing:.3em;text-transform:uppercase;color:#5E7356">The</div>
    <div class="serif" style="font-size:58px;line-height:1.02;margin:10px 0 6px">Unique <em>Vegas</em><br>Wedding Planner</div>
    <div style="font:500 13px IN;color:#5B5558;margin-top:16px">Timelines · Legal checklists · Budget · Venues · Vows</div>
    <div style="font:600 10px IN;letter-spacing:.22em;text-transform:uppercase;color:#8E4F5A;margin-top:26px">uniquevegasweddings.com</div>
  </div></div>`;

const planner = [
  cover,
  P("Start here", `<h1>Welcome to your <em>Vegas</em> wedding</h1>
    <p>This planner is built for Las Vegas logistics: the license, the witness rule, desert permits, heat, and the paperwork after. Fill it in, print it, or annotate it on a tablet.</p>
    <h3>How to use it</h3>${ck(["Fill in “At a glance” first. It's your one-page cheat sheet.", "Work the timelines backward from your date.", "Use the venue comparison sheets before you pay any deposit.", "Bring the day-of run sheet and contact list on the day (or give them to your coordinator).", "Do the after-the-wedding checklist within two weeks."])}
    <h2>Our wedding at a glance</h2>
    <div class="two"><div>${fieldsHtml(["Partner 1", "Partner 2", "Wedding date", "Ceremony time", "Venue", "Venue contact"])}</div><div>${fieldsHtml(["Officiant", "Witness", "Photographer", "Guest count", "Total budget", "Hotel / room block"])}</div></div>
    <div class="box blush" style="margin-top:18px"><p style="margin:0"><strong>Legal must-haves:</strong> a Clark County marriage license, an authorized officiant, and at least one witness besides the officiant.</p></div>`),
  P("Legal essentials", `<h1>The Clark County <em>marriage license</em></h1>
    <p>Facts from the Clark County Clerk (checked October 2026). Confirm before you travel. Requirements can change.</p>
    <div class="two"><div class="box"><h3 style="margin-top:0">The basics</h3><p>Fee: <strong>$102</strong> (card fee: 2% + $1.25)<br>Hours: <strong>8 a.m.–midnight, 7 days</strong>, holidays included<br>Where: 201 E. Clark Ave., Las Vegas, NV 89101<br>Walk-in only · about 15 minutes</p></div>
    <div class="box"><h3 style="margin-top:0">No…</h3><p>…waiting period<br>…blood test<br>…residency requirement<br>License valid for <strong>1 year</strong></p></div></div>
    <h3>Step by step</h3>${ck(["Pre-apply online (stays on file 1 year). Confirmation #: ________________", "Both partners go to the Bureau together", "Bring original photo IDs (no photocopies or digital IDs)", "U.S. citizens: know your Social Security number", "Pay the $102 fee (cards OK, no checks or money orders)", "Check the names on the license match your IDs exactly", "Keep the license safe and bring it to your ceremony", "Confirm your witness (1 required besides the officiant)"])}
    <h3>Quietest times at the Bureau</h3><p>Sundays and Tuesdays, 8–10 a.m. and 8 p.m.–midnight (per the Clerk's office).</p>
    <p class="sm">Satellite offices (Henderson, Laughlin, Mesquite) have limited weekday hours and don't take cash. The Government Center on Grand Central Pkwy does not issue licenses.</p>`),
  P("Legal essentials", `<h1>Documents & <em>ID</em></h1>
    <h3>Accepted photo ID (originals only)</h3>${ck(["Driver's license or U.S. state ID", "Passport", "Foreign government ID showing date of birth", "Matrícula Consular", "U.S. military ID", "Permanent resident card, or USCIS citizenship / naturalization certificate"])}
    <h3>Pack these</h3>${ck(["Both original IDs", "Pre-application confirmation", "Payment card", "Marriage license (after you get it!)", "Rings", "Vows", "Officiant & venue confirmations"])}
    <div class="box blush"><p style="margin:0"><strong>Previously married?</strong> You just can't be currently married. There's no waiting period after a divorce, and no decree is needed unless your name differs from your ID.</p></div>`),
  P("Timeline", `<h1>The 12-week <em>countdown</em></h1>
    <h3>12–9 weeks out</h3>${ck(["Set budget and guest count", "Shortlist 3 venues (use the comparison sheets)", "Check your date against lucky dates. Pattern dates book first.", "Book venue + officiant", "Desert venue? Confirm who holds the permit", "Book photographer", "Send save-the-dates / tell guests"])}
    <h3>8–5 weeks out</h3>${ck(["Book flights + room block", "Attire ordered (allow alteration time)", "Plan transport (shuttle for desert venues)", "Book hair & makeup", "Plan reception or celebration dinner", "Pre-apply for the license online"])}`),
  P("Timeline", `<h1>The final <em>month</em></h1>
    <h3>4–2 weeks out</h3>${ck(["Confirm every vendor in writing", "Final guest count to venue", "Write vows (see the worksheet)", "Build the day-of run sheet", "Weather check: plan shade, water, layers", "Send guests the welcome note"])}
    <h3>The week of</h3>${ck(["Pack documents (originals!)", "Confirm witness", "Get the license together at the Bureau", "Confirm pickup times", "Charge phones / cameras", "Hydrate. Seriously."])}
    <h3>The day after</h3>${ck(["Order certified copies ($20 each)", "Thank-you notes started", "Back up photos"])}`),
  P("Budget", `<h1>Budget <em>worksheet</em></h1><p>Total budget: ____________________</p>
    <table><thead><tr><th style="width:34%">Item</th><th>Estimated</th><th>Actual</th><th>Paid</th><th>Due</th></tr></thead><tbody>
    ${["Marriage license ($102)", "Certified copies ($20 each)", "Venue / ceremony package", "Officiant (if not included)", "Permits & park fees", "Photography", "Video / livestream", "Attire", "Hair & makeup", "Flowers & bouquet", "Rings", "Reception / dinner", "Cake or dessert", "Transportation", "Flights", "Hotel", "Gratuities", "Guest welcome gifts", "Buffer"].map((i) => `<tr><td>${i}</td><td></td><td></td><td></td><td></td></tr>`).join("")}
    <tr><td><strong>Total</strong></td><td></td><td></td><td></td><td></td></tr></tbody></table>`),
  P("Budget", `<h1>Payment <em>tracker</em></h1>
    <table><thead><tr><th style="width:28%">Vendor</th><th>Deposit</th><th>Paid on</th><th>Balance</th><th>Due date</th><th>Refund policy</th></tr></thead><tbody>${rows(18, 6)}</tbody></table>
    <p class="sm" style="margin-top:12px">Tip: when a price ends in “++,” tax and service charges are added on top.</p>`),
  ...[1, 2].map((n) => P("Venues", `<h1>Venue <em>comparison</em> ${n === 2 ? "(cont.)" : ""}</h1>
    <table><thead><tr><th style="width:28%"></th><th>Venue A</th><th>Venue B</th><th>Venue C</th></tr></thead><tbody>
    ${["Name", "Starting price", "What's included", "Extra fees (++, permits)", "Max guests", "Indoor / outdoor", "Heat or weather plan", "Officiant included?", "Witness provided?", "Photo minutes / prints", "Getting there", "Weekday vs. weekend price", "Deposit & cancellation", "Date available?", "Gut feeling (1–10)"].map((r) => `<tr><td>${r}</td><td></td><td></td><td></td></tr>`).join("")}</tbody></table>`)),
  P("Questions to ask", `<h1>Questions to ask the <em>venue</em></h1>${ck(["Is my date available, and is there a weekday price?", "What exactly is included: officiant, witness, photos, music, flowers?", "How long is our ceremony slot? Is there buffer before or after?", "What's the maximum guest count for the package we want?", "Are there service charges, taxes or gratuities not in the price?", "What's the heat/wind/rain plan for outdoor spaces?", "Do you handle permits for off-site or public-land ceremonies?", "Can guests watch a livestream?", "What's the deposit, and the cancellation/reschedule policy?", "Are there rules on confetti, petals, candles or decor?", "Can we bring our own photographer?", "Where do guests park, and is there a fee?"])}`),
  P("Questions to ask", `<h1>Photographer & <em>officiant</em></h1>
    <h3>Photographer</h3>${ck(["Have you shot at our venue (or in the desert / low light) before?", "How many hours and edited images are included?", "Do you hold any permits our location needs?", "When do we get our gallery?", "What happens if our timing shifts?"])}
    <h3>Officiant</h3>${ck(["Are you authorized to perform marriages in Nevada?", "Will you file the certificate with the County Clerk (within 10 days)?", "Can we personalize the ceremony and vows?", "Can you provide a witness if we need one?", "How long is the ceremony?"])}`),
  ...[1, 2].map((n) => P("Guests", `<h1>Guest <em>list</em> ${n === 2 ? "(cont.)" : ""}</h1>
    <table><thead><tr><th style="width:30%">Name</th><th>RSVP</th><th>Party size</th><th>Hotel</th><th>Arrives</th><th>Notes</th></tr></thead><tbody>${rows(26, 6)}</tbody></table>`)),
  P("Travel", `<h1>Travel & <em>room block</em></h1>
    <div class="two"><div>${fieldsHtml(["Hotel", "Block code", "Cut-off date", "Rate", "Contact"])}</div><div>${fieldsHtml(["Our flight in", "Our flight out", "Shuttle company", "Pickup time", "Pickup spot"])}</div></div>
    <table style="margin-top:14px"><thead><tr><th style="width:30%">Guest</th><th>Flight / arrival</th><th>Hotel</th><th>Needs a ride?</th></tr></thead><tbody>${rows(16, 4)}</tbody></table>`),
  P("Contacts", `<h1>Vendor <em>contacts</em></h1>
    <table><thead><tr><th style="width:24%">Role</th><th>Name</th><th>Phone</th><th>Email</th><th>Confirmed</th></tr></thead><tbody>
    ${["Venue coordinator", "Officiant", "Witness", "Photographer", "Videographer", "Hair & makeup", "Florist", "Transportation", "Restaurant / reception", "Hotel", "Planner", "Emergency contact"].map((r) => `<tr><td>${r}</td><td></td><td></td><td></td><td></td></tr>`).join("")}${rows(4, 5)}</tbody></table>`),
  P("The day", `<h1>Day-of <em>run sheet</em></h1>
    <table><thead><tr><th style="width:16%">Time</th><th style="width:44%">What happens</th><th>Who</th><th>Where</th></tr></thead><tbody>${rows(22, 4)}</tbody></table>
    <p class="sm" style="margin-top:10px">Don't forget: the license, the rings, the witness, water, and a phone charger.</p>`),
  P("Weather", `<h1>The desert & <em>weather</em> plan</h1>
    <p>Average highs and lows at Harry Reid International Airport (NOAA 1991–2020 normals).</p>
    <table><thead><tr><th>Month</th><th>High</th><th>Low</th><th>Month</th><th>High</th><th>Low</th></tr></thead><tbody>
    ${[["Jan", 59, 41, "Jul", 105, 82], ["Feb", 63, 44, "Aug", 103, 81], ["Mar", 71, 51, "Sep", 95, 72], ["Apr", 79, 57, "Oct", 81, 60], ["May", 89, 66, "Nov", 67, 47], ["Jun", 99, 76, "Dec", 57, 40]].map((r) => `<tr><td>${r[0]}</td><td>${r[1]}°F</td><td>${r[2]}°F</td><td>${r[3]}</td><td>${r[4]}°F</td><td>${r[5]}°F</td></tr>`).join("")}</tbody></table>
    <h3>Calendar rules</h3>${ck(["Valley of Fire: closed Dec 1–14, no weddings", "Red Rock Scenic Drive: timed entry Oct 1–May 31", "Neon Museum: daytime weddings pause Jun–Aug; nighttime Stardust Sep–May", "Floyd Lamb Park music curfew: 7 p.m. summer / 4 p.m. winter"])}
    <h3>Heat kit</h3>${ck(["Water for every guest", "Shade or parasols", "Sunscreen (mineral, no white cast)", "Ceremony at sunrise or golden hour", "Flat shoes for rocky ground", "Layers for winter evenings"])}`),
  P("Vows", `<h1>Vows <em>worksheet</em></h1>
    <p>Answer these quickly. Don't edit yet. The good lines hide in first drafts.</p>
    ${["When did you know?", "What do they do that no one else notices?", "What are you promising, in plain words?", "What's a small, specific promise (the funny one)?", "How do you want to finish?"].map((q) => `<h3>${q}</h3>${lines(3)}`).join("")}`),
  P("Vows", `<h1>My vows, <em>draft</em></h1><p class="sm">Aim for about one minute when read aloud.</p>${lines(28)}`),
  P("Packing", `<h1>The desert-tested <em>packing list</em></h1>
    <div class="two"><div><h3>Documents</h3>${ck(["Original IDs ×2", "Pre-application confirmation", "Payment card", "License (after pickup)", "Vendor confirmations"])}<h3>Heat & sun</h3>${ck(["Handheld fan", "Cooling towels", "Sunscreen stick", "Water bottles", "Parasol"])}</div>
    <div><h3>Outfit emergencies</h3>${ck(["Travel steamer", "Emergency kit (pins, thread, stain pen)", "Foldable flats", "Blister bandages", "Veil clips"])}<h3>Keepsakes</h3>${ck(["Rings + ring box", "Vow books", "Garment bag", "Something old/new/borrowed/blue"])}</div></div>`),
  P("After the wedding", `<h1>After the <em>wedding</em></h1>
    <p>Your <strong>license is not proof of marriage</strong>. You need a <strong>certified copy</strong> of the marriage certificate from the Clark County Clerk.</p>
    ${ck(["Officiant files the certificate (within 10 days)", "Order certified copies: $20 each (online, in person/kiosk, or by mail)", "How many copies? ____ (name changes often need more than one)", "Allow ~3 weeks by mail (~6 weeks internationally)"])}
    <h3>Changing your name? Typical places to update</h3>${ck(["Social Security", "Driver's license / state ID", "Passport", "Bank and credit cards", "Employer / payroll", "Insurance and benefits", "Voter registration", "Utilities, subscriptions, loyalty programs"])}
    <p class="sm">Each agency has its own rules and documents. Check its official site.</p>`),
  P("International couples", `<h1>Using your marriage <em>abroad</em></h1>
    ${ck(["Order certified copies from the Clark County Clerk", "Request an apostille from the Nevada Secretary of State if your country requires one (check their current fee)", "Ask your consulate or home registry whether you must register the marriage", "Check whether you need a certified translation", "Keep one certified copy at home and one with your passport"])}
    <div class="box blush"><p style="margin:0">Recognition rules vary by country. Contact your consulate before you travel. This is a checklist, not legal advice.</p></div>
    <h2>Notes</h2>${lines(10)}`),
  P("Notes", `<h1><em>Notes</em></h1>${lines(30)}`),
  `<div class="pg" style="padding:0;background:#2B2B2E">${art("planner-back", "sky-high", 816, 1056)}
   <div style="position:absolute;left:.8in;right:.8in;bottom:1in;background:rgba(255,251,248,.95);border-radius:18px;padding:.45in;text-align:center">
   <div class="serif" style="font-size:40px">Congratulations. <em>Go be unforgettable.</em></div>
   <p style="margin-top:12px">Venues, lucky dates and sourced guides at <strong>uniquevegasweddings.com</strong></p>
   <p class="sm">Facts checked October 2026 from official sources (Clark County Clerk, NOAA, Nevada State Parks, BLM, NPS, USFS). Requirements change, so always confirm. © Unique Vegas Weddings. For personal use only; please don't redistribute.</p></div></div>`,
];
job("planner", `<style>${PRINT_CSS}</style>${planner.join("")}`, "products/the-unique-vegas-wedding-planner.pdf", 816, 1056, "pdf");
// product shots for the site (page 1 + a spread page)
job("shot-cover", `<style>${PRINT_CSS}</style>${cover}`, "src/assets/img/planner-cover.png", 816, 1056);
pageNo = 6;
job("shot-spread", `<style>${PRINT_CSS}</style>${planner[8]}`, "src/assets/img/planner-spread.png", 816, 1056);

// ---------------------------------------------------------------- FREE CHECKLIST (lead magnet)
pageNo = 0;
const checklist = [
  P("Free checklist", `<div style="display:flex;justify-content:space-between;align-items:center"><h1 style="margin:0">Your Vegas wedding <em>checklist</em></h1><div style="width:52px">${markSVG(52)}</div></div>
   <p style="margin-top:8px">Everything you legally need, in order. Facts from the Clark County Clerk, checked October 2026.</p>
   <div class="two"><div><h3>Before you fly</h3>${ck(["Pre-apply online (Clark County Clerk)", "Book venue & officiant", "Confirm a witness (1 required)", "Pack ORIGINAL photo IDs for both of you"])}
   <h3>Get the license</h3>${ck(["201 E. Clark Ave., downtown Las Vegas", "8 a.m.–midnight, every day", "Both partners, together", "Pay $102 (card OK, no checks)", "Check names match your IDs"])}</div>
   <div><h3>The ceremony</h3>${ck(["Bring the license", "Authorized officiant", "At least 1 witness besides the officiant", "Use the license within 1 year"])}
   <h3>After</h3>${ck(["Officiant files the certificate (within 10 days)", "Order certified copies ($20 each)", "International? Ask about an apostille (Nevada Secretary of State)"])}</div></div>
   <div class="box blush" style="margin-top:16px"><p style="margin:0"><strong>No</strong> waiting period · <strong>No</strong> blood test · <strong>No</strong> residency requirement</p></div>`),
  P("Next steps", `<h1>Ready for the <em>fun part?</em></h1>
   <p>Find a venue that fits your story: neon, desert, sky-high, quirky or classic.</p>
   <div style="height:4.2in;border-radius:16px;overflow:hidden;margin:16px 0">${art("checklist-p2", "desert-outdoors", 700, 420).replace('width="700" height="420"', 'width="100%" height="100%"')}</div>
   ${ck([`Browse ${venues.length} unique venues at uniquevegasweddings.com/venues`, "Check the lucky-date calendar before you pick a date", "Get the 25-page Unique Vegas Wedding Planner"])}
   <p class="sm" style="margin-top:14px">Requirements can change. Confirm with the Clark County Clerk before you travel. Not legal advice.</p>`),
];
job("checklist", `<style>${PRINT_CSS}</style>${checklist.join("")}`, "src/static/downloads/vegas-wedding-checklist.pdf", 816, 1056, "pdf");

// ---------------------------------------------------------------- BRAND GUIDE
pageNo = 0;
const sw = (hex, name, use, dark) => `<div style="border-radius:14px;overflow:hidden;border:1px solid #EBDCD8"><div style="height:1.05in;background:${hex}"></div><div style="padding:10px 12px"><div style="font:600 11px IN">${name}</div><div style="font:500 10px IN;color:#8E4F5A">${hex}</div><div class="sm" style="margin-top:4px">${use}</div></div></div>`;
const BG = (k, inner) => P(k, inner).replace("The Unique Vegas Wedding Planner", "Brand Guide");
const brand = [
  `<div class="pg" style="padding:0">${art("brand-cover", "historic-iconic", 816, 1056)}<div style="position:absolute;left:.8in;right:.8in;top:3.2in;background:rgba(255,251,248,.95);border-radius:20px;padding:.9in .5in .5in;text-align:center"><div style="width:420px;margin:0 auto">${logo({ width: 420 })}</div><div class="serif" style="font-size:34px;margin-top:24px">Brand <em>guide</em></div><p style="margin-top:8px">Vegas weddings, off-script.</p></div></div>`,
  BG("Logo", `<h1>The <em>logo</em></h1><p>The mark is a wedding ring crowned by a desert star: commitment meets neon. Use the full lockup wherever there's room, and the mark alone for icons and avatars.</p>
   <div class="two" style="margin-top:14px"><div class="box" style="display:grid;place-items:center;height:1.6in">${logo({ width: 290 })}</div><div class="box" style="display:grid;place-items:center;height:1.6in;background:#2B2B2E">${logo({ width: 290, color: "#FFFFFF", accent: "#E8A0A8", sub: "#9CAF88" })}</div></div>
   <div class="two"><div class="box" style="display:grid;place-items:center;height:1.4in">${markSVG(90)}</div><div class="box" style="display:grid;place-items:center;height:1.4in;background:#FBF2EF">${markSVG(90, "#8E4F5A", "#B76E79")}</div></div>
   <h3>Rules</h3>${ck(["Clear space on all sides = the height of the star", "Minimum width: 140px digital / 1.25 in print", "Never stretch, recolor outside the palette, add shadows, or place on busy photos without a solid backing"])}`),
  BG("Color", `<h1>Color <em>palette</em></h1><p>Warm, romantic and desert-born. Rose gold leads, sage grounds it, charcoal makes it read.</p>
   <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:12px">${sw("#B76E79", "Rose Gold", "Accents, italics, icons")}${sw("#8E4F5A", "Rose Deep", "Buttons, links (AA on cream)")}${sw("#E8A0A8", "Neon Rose", "On charcoal only")}${sw("#F6E4E1", "Blush", "Bands, tags")}${sw("#FFFBF8", "Cream", "Page background")}${sw("#9CAF88", "Sage", "Illustration, dark-band accents")}${sw("#5E7356", "Sage Deep", "Eyebrows, labels")}${sw("#2B2B2E", "Charcoal", "Text, dark bands")}</div>
   <h3>Proportion</h3><div style="display:flex;height:26px;border-radius:8px;overflow:hidden"><div style="flex:55;background:#FFFBF8;border:1px solid #EBDCD8"></div><div style="flex:15;background:#F6E4E1"></div><div style="flex:15;background:#2B2B2E"></div><div style="flex:8;background:#9CAF88"></div><div style="flex:7;background:#B76E79"></div></div>
   <p class="sm" style="margin-top:6px">Mostly cream, blush for rhythm, charcoal for contrast, sage and rose gold as accents.</p>`),
  BG("Type", `<h1><em>Typography</em></h1>
   <div class="box"><div class="sm">Display: Playfair Display 400/500 + Italic (SIL OFL)</div><div class="serif" style="font-size:48px;line-height:1.05;margin-top:6px">Vegas weddings, <em>off-script.</em></div></div>
   <div class="box"><div class="sm">Text & UI: Inter 400/500/600 (SIL OFL)</div><p style="font-size:14px;margin-top:6px">Neon boneyards, ghost towns, canyon floors and sky-high chapels. Verified details, published prices, zero fluff.</p><div style="font:600 11px IN;letter-spacing:.22em;text-transform:uppercase;color:#5E7356;margin-top:8px">✦ Eyebrow label style</div></div>
   <h3>Rules</h3>${ck(["Headlines in Playfair; put one or two words in rose-gold italic for emphasis", "Body and UI always in Inter", "Eyebrows: Inter 600, uppercase, wide tracking, sage deep, with the ✦ star", "Never more than one italic phrase per headline"])}`),
  BG("Voice", `<h1>Voice & <em>tone</em></h1><p>We sound like a well-connected friend who lives in Las Vegas: warm, witty, direct and allergic to fluff.</p>
   <div class="two"><div><h3>We are</h3>${ck(["Specific: real prices, real rules, real dates", "Warm, a little cheeky", "Sourced: we link to the official page", "Inclusive of every kind of couple"])}</div><div><h3>We aren't</h3>${ck(["Salesy or breathless", "Vague (“affordable packages!”)", "Snobby about chapels or Elvis", "Making claims we can't back up"])}</div></div>
   <h3>Examples</h3><div class="box blush"><p><strong>Yes:</strong> “A ceremony starts at $150, and you can scale up to Elvis.”</p><p style="margin:0"><strong>No:</strong> “Experience unforgettable, affordable, magical wedding packages!”</p></div>`),
  BG("Illustration & social", `<h1>Illustration & <em>social</em></h1><p>Every venue gets an original desert illustration, generated from the brand palette. One motif per category. No stock photos, no scraped images.</p>
   <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin:12px 0">${CATEGORIES.map((c) => `<div><div style="height:1.4in;border-radius:8px;overflow:hidden">${art("bg-" + c.slug, c.slug, 400, 500).replace('width="400" height="500"', 'width="100%" height="100%"')}</div><div class="sm" style="text-align:center;margin-top:4px">${c.name}</div></div>`).join("")}</div>
   <h3>Pinterest pin template (1000×1500)</h3><p>Full-width illustration on top, Inter eyebrow, Playfair headline with one italic phrase, three or four ✦ facts, logo and URL at the bottom. Ready-made pins are in /marketing/pins.</p>
   <h3>Open Graph (1200×630)</h3><p>Every page ships with its own share image: logo, eyebrow, headline, full-height illustration.</p>`),
];
job("brand-guide", `<style>${PRINT_CSS}</style>${brand.join("")}`, "brand/brand-guide.pdf", 816, 1056, "pdf");

fs.writeFileSync(path.join(TMP, "jobs.json"), JSON.stringify(jobs, null, 1));
console.log(`Prepared ${jobs.length} render jobs → .render/jobs.json`);
