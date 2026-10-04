// =====================================================================
//  UNIQUE VEGAS WEDDINGS: static site generator (zero dependencies)
//  Run:  node build.mjs        → writes the finished site to /public
//  Runs automatically every Monday via .github/workflows/weekly-rebuild.yml
// =====================================================================
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { config as C } from "./src/data/config.mjs";
import { venues as baseVenues, CATEGORIES } from "./src/data/venues.mjs";
import { guides } from "./src/content/guides.mjs";
import { art, logoSVG, markSVG } from "./scripts/art.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, "public");
const NOW = new Date(process.env.BUILD_DATE || Date.now());
const ISO = NOW.toISOString().slice(0, 10);
const YEAR = NOW.getFullYear();
const FACTS_CHECKED = "2026-10-04";

// ---------- lucky engine (shared with browser) ----------
const luckyCtx = {};
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "src/assets/js/lucky.js"), "utf8"), { globalThis: luckyCtx, window: luckyCtx });
const L = luckyCtx.UVWLucky;

// ---------- helpers ----------
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const money = (n) => "$" + Number(n).toLocaleString("en-US");
const fmtDate = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const catBy = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));
const write = (rel, content) => {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};
const copyDir = (src, dst) => {
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    const s = path.join(src, f), d = path.join(dst, f);
    fs.statSync(s).isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
};
const ogFor = (name) => (fs.existsSync(path.join(ROOT, "src/assets/og", name + ".png")) ? `/assets/og/${name}.png` : "/assets/og/default.png");
const budgetBand = (n) => (n == null ? "quote" : n < 1000 ? "1" : n < 3000 ? "2" : n < 10000 ? "3" : "4");
const BAND_LABEL = { 1: "Under $1,000", 2: "$1,000–$2,999", 3: "$3,000–$9,999", 4: "$10,000+", quote: "Custom quote" };
const warnings = [];
const seoWarnings = [];
// trim to a clean sentence or word boundary so search snippets never cut mid-word
const clip = (str, n = 158) => {
  const t = String(str).replace(/\s+/g, " ").trim();
  if (t.length <= n) return t;
  const cut = t.slice(0, n);
  const sent = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "));
  if (sent >= 110) return cut.slice(0, sent + 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\s]+$/, "") + "…";
};
const faqSchema = (faq) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
const faqHtml = (faq) => `<div class="faq">${faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div>`;

// ---------- optional: merge venues from a published Google Sheet (CSV) ----------
function parseCSV(text) {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') q = false; else cell += ch; }
    else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.some((c) => c.trim()));
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] || "").trim()])));
}
async function loadVenues() {
  const list = baseVenues.map((v) => ({ ...v }));
  if (!C.venueSheetCsvUrl) return list;
  try {
    const res = await fetch(C.venueSheetCsvUrl);
    const rows = parseCSV(await res.text());
    let added = 0;
    for (const r of rows) {
      if (!r.name || !r.slug || !catBy[r.category]) continue;
      const v = {
        name: r.name, slug: r.slug, category: r.category, area: r.area || "", drive: r.drive || "", setting: r.setting || "",
        vibe: (r.vibe || "").split("|").filter(Boolean), priceFrom: r.priceFrom ? Number(r.priceFrom) : null, priceLabel: r.priceLabel || null,
        guestMax: r.guestMax ? Number(r.guestMax) : null, facts: (r.facts || "").split("|").filter(Boolean), bestFor: r.bestFor || "",
        description: r.description || "", tips: (r.tips || "").split("|").filter(Boolean), url: r.url || "", checked: r.checked || ISO,
        status: r.status || "listed", featured: /^(true|yes|1)$/i.test(r.featured || ""), inquiryFormId: r.inquiryFormId || "",
      };
      const i = list.findIndex((x) => x.slug === v.slug);
      if (i > -1) list[i] = { ...list[i], ...Object.fromEntries(Object.entries(v).filter(([, val]) => val !== "" && val != null && !(Array.isArray(val) && !val.length))) };
      else { list.push(v); added++; }
    }
    console.log(`Sheet: merged ${rows.length} rows (${added} new venues).`);
  } catch (e) {
    warnings.push("Google Sheet fetch failed. Using built-in venue list only. (" + e.message + ")");
  }
  return list;
}

// ---------- shared UI pieces ----------
const HEART = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 6.9 4.5c2.1 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.5 0 5.5 3.5 4.2 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>`;
const saveBtn = (v) => `<button class="save" type="button" data-save="${v.slug}" data-name="${esc(v.name)}" data-url="/venues/${v.slug}/" aria-pressed="false" aria-label="Save ${esc(v.name)} to your shortlist">${HEART}<span class="save-label">Save</span></button>`;
const formAction = (id) => (id ? `https://formspree.io/f/${id}` : `mailto:${C.contactEmail}`);
const formAttrs = (id) => (id ? `method="POST" data-ajax` : `method="POST" enctype="text/plain"`);
if (!C.formspreeNewsletter) warnings.push("formspreeNewsletter not set: email signups fall back to mailto.");
if (!C.plannerCheckoutUrl) warnings.push("plannerCheckoutUrl not set: planner shows a waitlist instead of a Buy button.");
if (!C.featuredCheckoutUrl) warnings.push("featuredCheckoutUrl/spotlightCheckoutUrl not set: partner page uses the application form only.");
if (!C.amazonTag) warnings.push("amazonTag not set: Amazon links work but earn nothing.");
if (!C.viatorPid) warnings.push("viatorPid not set: Viator links work but earn nothing.");

function newsletterForm({ title = "Get the free Vegas Wedding Checklist", sub = "A printable, one-page checklist: license, documents, witness and certified copies. Plus our lucky-date alerts. Unsubscribe anytime.", dark = false, h = "h3" } = {}) {
  return `<div class="${dark ? "" : "panel"}">
  <${h} class="mt0 h3">${title}</${h}><p class="small" style="${dark ? "color:#CFC6C4" : ""}">${sub}</p>
  <form action="${formAction(C.formspreeNewsletter)}" ${formAttrs(C.formspreeNewsletter)} data-next="/thanks/?download=checklist" class="inline-form">
    <input type="hidden" name="list" value="newsletter"><input type="hidden" name="_subject" value="UVW: new checklist signup"><input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off">
    <input type="email" name="email" required placeholder="you@email.com" aria-label="Email address">
    <button class="btn btn-primary" type="submit">Send it</button>
  </form></div>`;
}

const SEARCH_EXAMPLES = ["Outdoor wedding under $2,500", "Indoor venue for 80 guests in July", "How much is a marriage license?", "Elvis chapel downtown", "Just the two of us, somewhere with a view", "Do we need a witness?"];
const searchBar = (id, placeholder = "Outdoor wedding under $2,500 for 40 guests…") => `<form class="searchbar" role="search" action="/search/" method="get"${id === "q" ? " data-search-form" : ""}>
  <label class="sr-only" for="${id}">Describe the wedding you want, or ask a question</label>
  <input id="${id}" name="q" type="search" placeholder="${esc(placeholder)}" autocomplete="off" enterkeyhint="search" required>
  <button class="btn btn-primary" type="submit">Search</button></form>`;
const searchExamples = (n = 6) => `<div class="chips" data-search-examples>${SEARCH_EXAMPLES.slice(0, n).map((q) => `<a class="chip" href="/search/?q=${encodeURIComponent(q)}">${esc(q)}</a>`).join("")}</div>`;

function plannerCta() {
  return `<div class="promo"><img src="/assets/img/planner-cover.png" alt="Cover of The Unique Vegas Wedding Planner" width="140" height="181" loading="lazy">
  <div><h3>The Unique Vegas Wedding Planner</h3><p>Our printable planner: 25 pages of timelines, license and document checklists, a budget worksheet, venue comparison sheets and day-of schedules, built specifically for Las Vegas.</p>
  <a class="btn btn-primary btn-sm" href="/planner/">Get the planner · ${esc(C.plannerPrice)}</a></div></div>`;
}

const amazonUrl = (q) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}${C.amazonTag ? "&tag=" + encodeURIComponent(C.amazonTag) : ""}`;
const viatorUrl = (q) => `https://www.viator.com/searchResults/all?text=${encodeURIComponent(q)}${C.viatorPid ? `&pid=${C.viatorPid}&mcid=${C.viatorMcid}&medium=link` : ""}`;

function venueCard(v) {
  const c = catBy[v.category];
  const price = v.priceFrom ? `<span>From</span><strong>${money(v.priceFrom)}</strong>` : `<span>Pricing</span><strong>Custom quote</strong>`;
  const search = [v.name, v.area, c.name, ...(v.vibe || [])].join(" ").toLowerCase();
  return `<article class="vcard" data-venue data-cat="${v.category}" data-setting="${esc((v.setting || "").toLowerCase())}" data-budget="${budgetBand(v.priceFrom)}" data-search="${esc(search)}">
  ${v.status === "partner" ? `<span class="badge">Partner</span>` : v.featured ? `<span class="badge">Featured</span>` : ""}
  ${saveBtn(v)}
  <div class="img"><img src="/assets/art/${v.slug}.svg" alt="" width="800" height="1000" loading="lazy"></div>
  <div class="body">
    <span class="tag sage" style="align-self:flex-start">${esc(c.name)}</span>
    <h3><a href="/venues/${v.slug}/">${esc(v.name)}</a></h3>
    <div class="meta">${esc(v.area)}${v.setting ? " · " + esc(v.setting) : ""}</div>
    <div class="price">${price}</div>
  </div></article>`;
}

function picks(slugs, venues) {
  const list = slugs.map((s) => venues.find((v) => v.slug === s)).filter(Boolean);
  return `<div class="picks">${list.map((v) => `<a class="pick" href="/venues/${v.slug}/"><img src="/assets/art/${v.slug}.svg" alt="" width="56" height="70" loading="lazy"><div><strong>${esc(v.name)}</strong><span>${v.priceFrom ? "From " + money(v.priceFrom) : "Custom quote"}</span></div></a>`).join("")}</div>`;
}

// ---------- layout ----------
const NAV = [
  ["/venues/", "Venues"], ["/guides/", "Guides"], ["/lucky-wedding-dates/", "Lucky dates"], ["/planner/", "Planner"], ["/for-venues/", "For venues"],
];
function layout({ path: p, title, seoTitle, description, body, og = "default", schema = [], noindex = false, type = "website", modified, scripts = [] }) {
  const url = C.domain + p;
  const base = seoTitle || title;
  const fullTitle = p === "/" || (base + " | " + C.siteName).length > 60 ? base : `${base} | ${C.siteName}`;
  description = clip(description);
  if (!noindex && fullTitle.length > 60) seoWarnings.push(`Title over 60 chars (${fullTitle.length}): ${p}`);
  if (!noindex && description.length < 70) seoWarnings.push(`Meta description under 70 chars: ${p}`);
  const ogImg = C.domain + ogFor(og);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${noindex ? "noindex,follow" : "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"}">
${C.googleSiteVerification ? `<meta name="google-site-verification" content="${esc(C.googleSiteVerification)}">` : ""}${C.bingSiteVerification ? `<meta name="msvalidate.01" content="${esc(C.bingSiteVerification)}">` : ""}
<meta property="og:type" content="${type}"><meta property="og:locale" content="en_US">${type === "article" && modified ? `<meta property="article:modified_time" content="${modified}">` : ""}<meta property="og:site_name" content="${esc(C.siteName)}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}"><meta property="og:image" content="${ogImg}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${ogImg}">
<meta name="theme-color" content="#FFFBF8">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest">
<link rel="alternate" type="application/rss+xml" title="${esc(C.siteName)}" href="/feed.xml">
<link rel="preload" href="/assets/fonts/playfair-display-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css?v=${ISO}">
${schema.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n")}
${C.ga4Id ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${C.ga4Id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${C.ga4Id}');</script>` : ""}
${C.adsenseClient ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${C.adsenseClient}" crossorigin="anonymous"></script>` : ""}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="notice" data-lucky-banner hidden></div>
<div class="notice" data-months="11" hidden>&#10022; Heads up: Valley of Fire closes to all visitors <strong>December 1–14</strong>, and no weddings are allowed. <a href="/guides/desert-wedding-permits/">Desert permit guide</a></div>
<div class="notice" data-months="12" data-until-day="12-14" hidden>&#10022; Valley of Fire is closed through <strong>December 14</strong>. Red Rock, Lake Mead and the chapels are open. <a href="/venues/category/desert-outdoors/">Other desert venues</a></div>
<div class="notice" data-months="6,7,8" hidden>&#10022; Summer in Las Vegas means 100°F+ average highs. <a href="/guides/best-time-to-get-married-in-las-vegas/">How to plan a heat-smart wedding</a></div>
<header class="site-header"><div class="wrap">
  <a class="brand" href="/" aria-label="${esc(C.siteName)} home">${logoSVG({ width: 236 })}</a>
  <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
  <nav class="nav" id="site-nav" aria-label="Main">
    ${NAV.map(([h, t]) => `<a href="${h}"${p.startsWith(h) ? ' aria-current="page"' : ""}>${t}</a>`).join("")}
    <a class="search-link" href="/search/"${p.startsWith("/search/") ? ' aria-current="page"' : ""}><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16.5 16.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>Search</a>
    <a class="sl-link" href="/shortlist/">Shortlist <span class="count-pill" data-sl-count hidden>0</span></a>
  </nav>
</div></header>
<main id="main">
${body}
</main>
<footer class="site-footer"><div class="wrap">
  <div class="foot-grid">
    <div><div style="margin-bottom:16px">${logoSVG({ width: 236, color: "#FFFFFF", accent: "#E8A0A8", sub: "#9CAF88" })}</div>
      <p>The independent guide to Las Vegas weddings that don't look like everyone else's. Verified facts, published prices, no fluff.</p>
      ${[["pinterest", "Pinterest"], ["instagram", "Instagram"], ["tiktok", "TikTok"]].filter(([k]) => C.social[k]).map(([k, t]) => `<a href="${C.social[k]}" rel="me noopener" target="_blank">${t}</a>`).join(" · ")}
    </div>
    <div><h2 class="foot-h">Venues</h2><ul>${CATEGORIES.map((c) => `<li><a href="/venues/category/${c.slug}/">${esc(c.name)}</a></li>`).join("")}</ul></div>
    <div><h2 class="foot-h">Plan</h2><ul>${guides.slice(0, 6).map((g) => `<li><a href="/guides/${g.slug}/">${esc(g.nav)}</a></li>`).join("")}<li><a href="/tools/budget-planner/">Budget planner</a></li></ul></div>
    <div><h2 class="foot-h">Company</h2><ul><li><a href="/about/">About</a></li><li><a href="/for-venues/">List your venue</a></li><li><a href="/contact/">Contact</a></li><li><a href="/disclosure/">Affiliate disclosure</a></li><li><a href="/privacy/">Privacy</a></li><li><a href="/terms/">Terms</a></li></ul></div>
  </div>
  <div class="foot-legal"><span>© <span data-year>${YEAR}</span> ${esc(C.siteName)}. Independent and not affiliated with any venue unless marked "Partner."</span><span>Some links earn us a commission at no cost to you.</span></div>
</div></footer>
<script src="/assets/js/lucky.js?v=${ISO}" defer></script>
<script src="/assets/js/main.js?v=${ISO}" defer></script>
${scripts.map((x) => `<script src="${x}?v=${ISO}" defer></script>`).join("\n")}
</body>
</html>`;
}

const orgSchema = { "@context": "https://schema.org", "@type": "Organization", "@id": C.domain + "/#org", name: C.siteName, alternateName: C.shortName, url: C.domain, logo: C.domain + "/assets/img/mark-512.png", email: C.contactEmail, description: C.description, slogan: C.tagline, areaServed: "Las Vegas, Nevada", knowsAbout: ["Las Vegas wedding venues", "Clark County marriage licenses", "Las Vegas elopements", "desert wedding permits in Nevada", "lucky wedding dates"], publishingPrinciples: C.domain + "/about/", sameAs: Object.values(C.social).filter(Boolean) };
const orgRef = { "@type": "Organization", "@id": C.domain + "/#org", name: C.siteName, url: C.domain };
const crumbSchema = (items) => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map(([name, p], i) => ({ "@type": "ListItem", position: i + 1, name, item: C.domain + p })) });
const crumbs = (items) => `<nav class="crumbs" aria-label="Breadcrumb">${items.map(([n, p], i) => (i < items.length - 1 ? `<a href="${p}">${esc(n)}</a> / ` : `<span>${esc(n)}</span>`)).join("")}</nav>`;

// =====================================================================
async function main() {
  const venues = await loadVenues();
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  copyDir(path.join(ROOT, "src/assets"), path.join(OUT, "assets"));
  if (fs.existsSync(path.join(ROOT, "src/static"))) copyDir(path.join(ROOT, "src/static"), OUT);

  // ---------- generated art + brand files ----------
  for (const v of venues) write(`assets/art/${v.slug}.svg`, art(v.slug, v.category, 800, 1000));
  for (const c of CATEGORIES) write(`assets/art/cat-${c.slug}.svg`, art("cat-" + c.slug, c.slug, 800, 1000));
  const b64 = (f) => fs.readFileSync(path.join(ROOT, "src/assets/fonts", f)).toString("base64");
  const fontStyle = `<style>@font-face{font-family:"Playfair Display";font-weight:500;src:url(data:font/woff2;base64,${b64("playfair-display-latin-500-normal.woff2")})}@font-face{font-family:"Playfair Display";font-weight:500;font-style:italic;src:url(data:font/woff2;base64,${b64("playfair-display-latin-500-italic.woff2")})}@font-face{font-family:Inter;font-weight:600;src:url(data:font/woff2;base64,${b64("inter-latin-600-normal.woff2")})}</style>`;
  const standalone = (svg) => svg.replace(/(<svg[^>]*>)/, `$1${fontStyle}`);
  write("assets/img/logo.svg", standalone(logoSVG()));
  write("assets/img/logo-light.svg", standalone(logoSVG({ color: "#FFFFFF", accent: "#E8A0A8", sub: "#9CAF88" })));
  fs.mkdirSync(path.join(ROOT, "brand"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "brand/logo-primary.svg"), standalone(logoSVG()));
  fs.writeFileSync(path.join(ROOT, "brand/logo-on-dark.svg"), standalone(logoSVG({ color: "#FFFFFF", accent: "#E8A0A8", sub: "#9CAF88" })));
  fs.writeFileSync(path.join(ROOT, "brand/mark.svg"), markSVG(512));
  write("assets/img/mark.svg", markSVG(64));
  write("favicon.svg", markSVG(64));
  write("assets/img/sparkle.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 0Q11 9 20 10Q11 11 10 20Q9 11 0 10Q9 9 10 0Z" fill="#000"/></svg>`);

  const sitemap = [];
  const page = (p, opts) => { const modified = opts.modified || FACTS_CHECKED; write(p === "/" ? "index.html" : p.replace(/^\//, "") + "index.html", layout({ path: p, ...opts, modified })); if (!opts.noindex) sitemap.push([p, modified]); };
  const maxChecked = (list) => list.reduce((m, v) => (v.checked > m ? v.checked : m), FACTS_CHECKED);
  const priced = venues.filter((v) => v.priceFrom);
  const priceMin = Math.min(...priced.map((v) => v.priceFrom)), priceMax = Math.max(...priced.map((v) => v.priceFrom));
  const sortedByPrice = [...venues].sort((a, b) => (a.priceFrom ?? 1e9) - (b.priceFrom ?? 1e9));
  const rotation = venues.map((v) => ({ name: v.name, bestFor: v.bestFor, meta: `${catBy[v.category].name} · ${v.area}${v.priceFrom ? " · from " + money(v.priceFrom) : ""}`, url: `/venues/${v.slug}/`, img: `/assets/art/${v.slug}.svg`, featured: !!v.featured }));
  const week = Math.floor((NOW - new Date(2026, 0, 5)) / 6048e5);
  const featPool = venues.filter((v) => v.featured);
  const votw = (featPool.length ? featPool : venues)[((week % (featPool.length || venues.length)) + (featPool.length || venues.length)) % (featPool.length || venues.length)];
  const nextLucky = L.upcoming(NOW, 6, 5);

  const homeFaq = [
    { q: "What is Unique Vegas Weddings?", a: `Unique Vegas Weddings is an independent guide to distinctive Las Vegas-area wedding venues. It lists ${venues.length} venues in ${CATEGORIES.length} categories, with published starting prices and facts checked against official sources.` },
    { q: "How much does it cost to get married in Las Vegas?", a: `The Clark County marriage license costs $102. Published venue starting prices in our directory range from ${money(priceMin)} to ${money(priceMax)}, and a county civil ceremony costs $77.75.` },
    guides[0].faq[2], guides[0].faq[3], guides[0].faq[1],
  ];
  // ================= HOME =================
  page("/", {
    title: C.siteName, seoTitle: "Unique Las Vegas Wedding Venues | Unique Vegas Weddings", description: C.description, og: "home", modified: ISO,
    schema: [orgSchema, { "@context": "https://schema.org", "@type": "WebSite", name: C.siteName, url: C.domain, publisher: orgRef, inLanguage: "en-US", potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: C.domain + "/search/?q={search_term_string}" }, "query-input": "required name=search_term_string" } }, faqSchema(homeFaq)],
    body: `
<section class="hero"><div class="wrap">
  <div>
    <span class="eyebrow">The unique Las Vegas wedding guide</span>
    <h1>Unique Las Vegas weddings, <em>off-script.</em></h1>
    <p class="lede">Neon boneyards, ghost towns, canyon floors, shark tanks and towers 800 feet up. ${venues.length} hand-picked places to say "I do," with verified details, published prices and zero fluff.</p>
    <div class="hero-cta"><a class="btn btn-primary" href="/venues/">Explore venues</a><a class="btn btn-ghost" href="/guides/las-vegas-marriage-license/">Get the license, step by step</a></div>
    <p class="search-label">Or just tell us what you want:</p>
    ${searchBar("hero-q")}
    ${searchExamples(3)}
  </div>
  <div class="arches" aria-hidden="true">
    <div class="a a1"><img src="/assets/art/the-neon-museum.svg" alt="" width="800" height="1000"></div>
    <div class="a a2"><img src="/assets/art/valley-of-fire-state-park.svg" alt="" width="800" height="1000"></div>
    <div class="a a3"><img src="/assets/art/strat-chapel-in-the-clouds.svg" alt="" width="800" height="1000"></div>
    <div class="hero-badge"><strong>$102</strong>License fee. No waiting period. Open until midnight, every day.</div>
  </div>
</div></section>

<section><div class="wrap">
  <div class="section-head"><div><span class="eyebrow">Six ways to say I do</span><h2>Pick your <em>kind</em> of unforgettable</h2></div><a class="btn btn-ghost btn-sm" href="/venues/">See all ${venues.length} venues</a></div>
  <div class="grid-3">${CATEGORIES.map((c) => `<a class="cat" href="/venues/category/${c.slug}/"><img src="/assets/art/cat-${c.slug}.svg" alt="" width="800" height="1000" loading="lazy"><div class="cat-txt"><h3>${esc(c.name)}</h3><p>${esc(c.blurb)}</p><span class="n">${venues.filter((v) => v.category === c.slug).length} venues →</span></div></a>`).join("")}</div>
</div></section>

<section class="band-blush"><div class="wrap">
  <div class="grid-2" style="align-items:center" data-rotation='${esc(JSON.stringify(rotation))}'>
    <a data-rot-link href="/venues/${votw.slug}/" class="cat" style="max-width:420px"><img data-rot-img src="/assets/art/${votw.slug}.svg" alt="" width="800" height="1000" loading="lazy"></a>
    <div><span class="eyebrow">Venue of the week</span><h2 class="mt0" data-rot-name>${esc(votw.name)}</h2>
      <p class="small" data-rot-meta>${esc(catBy[votw.category].name)} · ${esc(votw.area)}${votw.priceFrom ? " · from " + money(votw.priceFrom) : ""}</p>
      <p class="lede" data-rot-blurb>${esc(votw.bestFor)}</p>
      <a class="btn btn-primary" data-rot-link href="/venues/${votw.slug}/">See the details</a></div>
  </div>
</div></section>

<section class="band-dark"><div class="wrap">
  <div class="grid-2" style="align-items:start">
    <div><span class="eyebrow" style="color:var(--sage)">Lucky dates</span><h2 class="mt0">The dates <em>everyone</em> wants</h2>
      <p>Pattern dates like 6/26/26 are huge in Las Vegas. On that day, one chapel group alone scheduled about 130 weddings (News 3 Las Vegas). Here are the next special dates on the calendar. This list updates itself.</p>
      <p class="next-lucky" style="color:#CFC6C4" data-lucky-next></p>
      <a class="btn btn-light" href="/lucky-wedding-dates/">All lucky dates by year</a></div>
    <ul class="lucky-list" data-lucky-upcoming="5">${nextLucky.slice(0, 5).map((a) => `<li class="lucky-item"><div class="lucky-date">${a.short}</div><div><strong>${a.long}</strong><div class="tags">${a.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div></div><div class="lucky-when"></div></li>`).join("")}</ul>
  </div>
</div></section>

<section><div class="wrap">
  <div class="section-head"><div><span class="eyebrow">Plan it right</span><h2>Straight answers, <em>sourced</em></h2><p>Every fact comes from the Clark County Clerk, NOAA, the park agencies or the venue itself, and we link to the source.</p></div><a class="btn btn-ghost btn-sm" href="/guides/">All guides</a></div>
  <div class="grid-3">${guides.slice(0, 6).map((g) => `<a class="mini" href="/guides/${g.slug}/"><span class="tag sage">${esc(g.eyebrow)}</span><strong style="margin-top:10px">${esc(g.title)}</strong><span>${esc(g.description)}</span></a>`).join("")}</div>
</div></section>

<section class="band-sage"><div class="wrap product">
  <div class="product-shot"><img src="/assets/img/planner-cover.png" alt="The Unique Vegas Wedding Planner cover" width="560" height="724" loading="lazy"><img src="/assets/img/planner-spread.png" alt="Inside pages of the planner" width="560" height="724" loading="lazy"></div>
  <div><span class="eyebrow">Printable planner</span><h2 class="mt0">Everything in one place, <em>Vegas-specific</em></h2>
    <p class="lede">Generic wedding planners don't know about the $102 license, the one-witness rule, the Valley of Fire closure or Red Rock's timed entry. Ours does.</p>
    <ul class="checklist"><li>12-week, 4-week and day-of timelines</li><li>License, ID and certified copy checklists</li><li>Budget worksheet and venue comparison sheets</li><li>Guest list, vendor contacts and vows worksheet</li></ul>
    <a class="btn btn-primary" href="/planner/">Get the planner · ${esc(C.plannerPrice)}</a></div>
</div></section>

<section id="checklist"><div class="wrap grid-2" style="align-items:center">
  <div><span class="eyebrow">Free download</span><h2 class="mt0">Your Vegas wedding <em>checklist</em></h2><p>The exact paperwork steps, the documents to bring, and what to do after the ceremony. One page, printable, free.</p></div>
  ${newsletterForm()}
</div></section>

<section><div class="wrap narrow" style="margin:0 auto">
  <span class="eyebrow">The basics</span><h2 class="mt0">Las Vegas wedding <em>questions</em>, answered</h2>
  ${faqHtml(homeFaq)}
  <p class="small">Sources: Clark County Clerk and each venue's published pricing, checked ${fmtDate(FACTS_CHECKED)}. <a href="/guides/las-vegas-marriage-license/">Full license guide</a></p>
</div></section>

<section class="band-blush"><div class="wrap center narrow">
  <span class="eyebrow">For venues & planners</span><h2 class="mt0">Couples are looking for <em>you</em></h2>
  <p class="lede">Claim your free listing, add your own photos and copy, and get inquiries sent straight to your inbox.</p>
  <a class="btn btn-primary" href="/for-venues/">List your venue</a>
</div></section>`,
  });

  // ================= DIRECTORY =================
  const filters = `<div class="filters">
    <label>Search<input type="search" data-filter-q placeholder="Neon, desert, Elvis…"></label>
    <label>Category<select data-filter="cat"><option value="all">All categories</option>${CATEGORIES.map((c) => `<option value="${c.slug}">${esc(c.name)}</option>`).join("")}</select></label>
    <label>Setting<select data-filter="setting"><option value="all">Any setting</option><option value="indoor">Indoor</option><option value="outdoor">Outdoor</option><option value="airborne">Airborne</option></select></label>
    <label>Starting price<select data-filter="budget"><option value="all">Any budget</option>${["1", "2", "3", "4", "quote"].map((b) => `<option value="${b}">${BAND_LABEL[b]}</option>`).join("")}</select></label>
  </div><p class="filter-count" data-filter-count>${venues.length} venues</p>`;
  page("/venues/", {
    title: "Unique Las Vegas Wedding Venues", seoTitle: `${venues.length} Unique Las Vegas Wedding Venues, With Prices`, og: "venues", modified: maxChecked(venues),
    description: `Browse ${venues.length} unique Las Vegas wedding venues: neon, desert, sky-high, quirky and classic. Filter by setting and budget. Published prices, verified details.`,
    schema: [crumbSchema([["Home", "/"], ["Venues", "/venues/"]]), { "@context": "https://schema.org", "@type": "ItemList", itemListElement: venues.map((v, i) => ({ "@type": "ListItem", position: i + 1, url: `${C.domain}/venues/${v.slug}/`, name: v.name })) }],
    body: `<section style="padding-top:48px"><div class="wrap">
  ${crumbs([["Home", "/"], ["Venues", "/venues/"]])}
  <span class="eyebrow">The directory</span><h1>Unique Las Vegas <em>wedding venues</em></h1>
  <p class="lede narrow">${venues.length} places to get married that aren't another hotel ballroom. Prices are the venue's own published "from" prices on the date we checked. Always confirm before booking.</p>
  ${filters}
  <p class="small" style="margin:-10px 0 20px">Not sure what to filter? <a href="/search/">Describe the wedding you want in plain words</a>.</p>
  <h2 class="sr-only">All venues</h2>
  <div class="grid-3" data-filter-grid>${venues.map(venueCard).join("")}</div>
  <p data-filter-empty hidden class="center">No venues match those filters. Try widening the budget or setting.</p>
</div></section>`,
  });

  // ================= CATEGORY PAGES =================
  for (const c of CATEGORIES) {
    const list = venues.filter((v) => v.category === c.slug);
    const cp = list.filter((v) => v.priceFrom).sort((a, b) => a.priceFrom - b.priceFrom);
    const biggest = list.filter((v) => v.guestMax).sort((a, b) => b.guestMax - a.guestMax)[0];
    const lower = c.name.toLowerCase();
    const catFaq = [
      { q: `How much does a ${lower} wedding in Las Vegas cost?`, a: cp.length > 1
        ? `Published starting prices for ${lower} venues in our directory range from ${money(cp[0].priceFrom)} (${cp[0].name}) to ${money(cp[cp.length - 1].priceFrom)} (${cp[cp.length - 1].name}), as checked ${fmtDate(maxChecked(list))}. ${list.length - cp.length} of the ${list.length} venues are quote-only.`
        : cp.length === 1 ? `${cp[0].name} publishes a starting price of ${money(cp[0].priceFrom)}. The other ${list.length - 1} venues in this category quote by date and guest count.` : `Venues in this category quote by date and guest count.` },
      ...(biggest ? [{ q: `Which ${lower} venue holds the most guests?`, a: `${biggest.name}, with up to ${biggest.guestMax} guests in its largest published option.` }] : []),
      { q: `What are the ${lower} wedding venues in Las Vegas?`, a: `Our directory lists ${list.length}: ${list.map((v) => v.name).join(", ")}.` },
    ];
    page(`/venues/category/${c.slug}/`, {
      title: `${c.name} Wedding Venues in Las Vegas`, og: "cat-" + c.slug, modified: maxChecked(list),
      description: (() => { const head = `${list.length} ${lower} wedding venues in Las Vegas${cp.length ? `, with published prices from ${money(cp[0].priceFrom)}` : ""}: `; let names = []; for (const v of list) { if ((head + [...names, v.name].join(", ") + " and more.").length > 156) break; names.push(v.name); } return head + names.join(", ") + (names.length < list.length ? " and more." : "."); })(),
      schema: [crumbSchema([["Home", "/"], ["Venues", "/venues/"], [c.name, `/venues/category/${c.slug}/`]]),
        { "@context": "https://schema.org", "@type": "ItemList", name: `${c.name} wedding venues in Las Vegas`, numberOfItems: list.length, itemListElement: list.map((v, i) => ({ "@type": "ListItem", position: i + 1, url: `${C.domain}/venues/${v.slug}/`, name: v.name })) },
        faqSchema(catFaq)],
      body: `<section style="padding-top:48px"><div class="wrap">
  ${crumbs([["Home", "/"], ["Venues", "/venues/"], [c.name, ""]])}
  <div class="grid-2" style="align-items:center;margin-bottom:40px">
    <div><span class="eyebrow">${list.length} venues</span><h1>${esc(c.name)} <em>weddings</em> in Las Vegas</h1><p class="lede">${esc(c.blurb)}</p></div>
    <div class="cat" style="width:100%;max-width:340px;justify-self:end;aspect-ratio:4/4.4"><img src="/assets/art/cat-${c.slug}.svg" alt="" width="800" height="1000"></div>
  </div>
  <div class="prose narrow" style="margin-bottom:34px"><p>${c.intro}</p></div>
  <h2 class="mt0">${list.length} ${esc(lower)} venues</h2>
  <div class="grid-3">${list.map(venueCard).join("")}</div>
  <div class="narrow"><h2>${esc(c.name)} wedding FAQ</h2>${faqHtml(catFaq)}</div>
  <h2>Other ways to say I do</h2>
  <div class="chips">${CATEGORIES.filter((x) => x.slug !== c.slug).map((x) => `<a class="chip" href="/venues/category/${x.slug}/">${esc(x.name)}</a>`).join("")}</div>
</div></section>`,
    });
  }

  // ================= VENUE PAGES =================
  for (const v of venues) {
    const c = catBy[v.category];
    const related = venues.filter((x) => x.category === v.category && x.slug !== v.slug).slice(0, 3);
    const inquiryId = v.status === "partner" ? v.inquiryFormId || C.formspreeVenueInquiry : "";
    const paras = (v.description || "").split(/\n\s*\n/).map((t) => `<p>${esc(t.trim())}</p>`).join("");
    const sidebar = inquiryId
      ? `<div class="panel"><h3>Check availability</h3><p class="small">Your request goes directly to ${esc(v.name)}.</p>
        <form action="${formAction(inquiryId)}" ${formAttrs(inquiryId)} data-next="/thanks/?sent=inquiry">
          <input type="hidden" name="venue" value="${esc(v.name)}"><input type="hidden" name="_subject" value="UVW venue inquiry: ${esc(v.name)}"><input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off">
          <div class="field"><label for="iq-n">Your names</label><input id="iq-n" name="names" required></div>
          <div class="field"><label for="iq-e">Email</label><input id="iq-e" type="email" name="email" required></div>
          <div class="row2"><div class="field"><label for="iq-d">Date</label><input id="iq-d" type="date" name="date"></div><div class="field"><label for="iq-g">Guests</label><input id="iq-g" type="number" min="0" name="guests"></div></div>
          <div class="field"><label for="iq-m">Anything else?</label><textarea id="iq-m" name="message"></textarea></div>
          <button class="btn btn-primary" type="submit" style="width:100%">Send inquiry</button>
        </form></div>`
      : `<div class="panel"><h3>Plan it</h3>
        <p class="small">Check dates and packages on the venue's official site, and save it to compare later.</p>
        <div class="stack"><a class="btn btn-primary" style="width:100%" href="${esc(v.url)}" rel="nofollow noopener" target="_blank">Check dates on the official site ↗</a>
        <button class="btn btn-ghost" style="width:100%" type="button" data-save="${v.slug}" data-name="${esc(v.name)}" data-url="/venues/${v.slug}/"><span class="save-label">Save</span> to shortlist</button></div>
        <hr style="border:0;border-top:1px solid var(--line);margin:22px 0">
        ${newsletterForm({ title: "Free Vegas wedding checklist", sub: "License steps, documents, witness rules and certified copies on one printable page." }).replace('<div class="panel">', "<div>")}
      </div>`;
    const hasW = /wedding/i.test(v.name);
    const vBase = hasW ? v.name : `${v.name} Weddings`;
    const vTitle = (v.priceFrom ? ["Prices, Details & Tips", "Prices & Tips"] : ["Venue Details & Tips", "Details & Tips"]).map((t) => `${vBase}: ${t}`).find((t) => t.length <= 60) || vBase;
    const approx = /min|hr/.test(v.drive || "") ? " (approximate)" : "";
    const glance = `${v.priceFrom ? `At ${v.name}, published wedding pricing starts at ${money(v.priceFrom)}${v.priceLabel ? ` (${v.priceLabel})` : ""}.` : `${v.name} doesn't publish wedding prices, so pricing is by custom quote.`}${v.guestMax ? ` The largest published option holds up to ${v.guestMax} guests.` : ""} Location: ${v.area}. Details checked ${fmtDate(v.checked)} against the venue's official site.`;
    const vFaq = [
      { q: `How much does a wedding at ${v.name} cost?`, a: v.priceFrom ? `Published pricing starts at ${money(v.priceFrom)}${v.priceLabel ? ` for the ${v.priceLabel}` : ""}, as checked ${fmtDate(v.checked)}. Confirm current pricing with the venue.` : `${v.name} doesn't publish wedding prices. Request a quote for your date and guest count through its official weddings page.` },
      ...(v.guestMax ? [{ q: `How many guests can ${v.name} hold?`, a: `Up to ${v.guestMax} guests in its largest published option. Smaller spaces and packages have lower limits.` }] : []),
      { q: `Where is ${v.name}?`, a: `${v.area}. ${v.drive}${approx}.` },
      ...(v.setting ? [{ q: `Is ${v.name} an indoor or outdoor venue?`, a: `${v.setting}.` }] : []),
    ];
    const GUIDE_MAP = { "historic-iconic": ["how-to-elope-in-las-vegas", "best-time-to-get-married-in-las-vegas"], "desert-outdoors": ["desert-wedding-permits", "best-time-to-get-married-in-las-vegas", "vegas-elopement-packing-list"], "sky-high": ["how-to-elope-in-las-vegas", "las-vegas-wedding-weekend-guide"], "strip-luxury": ["las-vegas-wedding-weekend-guide", "legal-vs-symbolic-ceremony"], "quirky-pop-culture": ["las-vegas-vow-renewal", "how-to-elope-in-las-vegas"], "classic-chapels": ["las-vegas-courthouse-wedding", "las-vegas-vow-renewal", "legal-vs-symbolic-ceremony"] };
    const vGuides = ["las-vegas-marriage-license", "las-vegas-wedding-cost", ...(GUIDE_MAP[v.category] || [])].map((sl) => guides.find((g) => g.slug === sl)).filter(Boolean);
    const vDesc = `${v.name} wedding guide: ${v.priceFrom ? `published prices from ${money(v.priceFrom)}` : "quote-only pricing"}${v.guestMax ? `, up to ${v.guestMax} guests` : ""}, ${v.area}. Verified details, tips and the official booking link.`;
    page(`/venues/${v.slug}/`, {
      title: `${vBase}: Prices, Details & Tips`, seoTitle: vTitle, og: "v-" + v.slug, modified: v.checked,
      description: vDesc,
      schema: [crumbSchema([["Home", "/"], ["Venues", "/venues/"], [c.name, `/venues/category/${c.slug}/`], [v.name, `/venues/${v.slug}/`]]),
        { "@context": "https://schema.org", "@type": "WebPage", name: vTitle, url: `${C.domain}/venues/${v.slug}/`, description: clip(vDesc), dateModified: v.checked, lastReviewed: v.checked, reviewedBy: orgRef, inLanguage: "en-US", isPartOf: { "@type": "WebSite", name: C.siteName, url: C.domain },
          mainEntity: { "@type": /airborne/i.test(v.setting || "") ? "TouristAttraction" : "EventVenue", name: v.name, description: v.bestFor, url: v.url, image: C.domain + ogFor("v-" + v.slug), ...(v.guestMax ? { maximumAttendeeCapacity: v.guestMax } : {}), address: { "@type": "PostalAddress", addressRegion: /AZ/.test(v.area) ? "AZ" : "NV", addressCountry: "US" }, containedInPlace: { "@type": "Place", name: v.area } } },
        faqSchema(vFaq)],
      body: `<section class="vhero"><div class="wrap">
  <div>${crumbs([["Home", "/"], ["Venues", "/venues/"], [c.name, `/venues/category/${c.slug}/`], [v.name, ""]])}
    <span class="eyebrow">${esc(c.name)}</span><h1>${esc(v.name)}</h1>
    <p class="lede">${esc(v.bestFor)}</p>
    <p class="glance">${esc(glance)}</p>
    <div class="tags">${(v.vibe || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
    <div class="facts-row">
      <div><span>Starting price</span><strong>${v.priceFrom ? money(v.priceFrom) : "Custom quote"}</strong>${v.priceLabel ? `<div class="small">${esc(v.priceLabel)}</div>` : ""}</div>
      <div><span>Area</span><strong>${esc(v.area)}</strong></div>
      <div><span>Setting</span><strong>${esc(v.setting || "-")}</strong></div>
      <div><span>${v.guestMax ? "Max guests (largest option)" : "Getting there"}</span><strong>${v.guestMax ? v.guestMax : esc(v.drive || "-")}</strong></div>
    </div>
<p class="small">Prices change, so always confirm directly with the venue.</p>
  </div>
  <div class="art"><img src="/assets/art/${v.slug}.svg" alt="Illustration for ${esc(v.name)}" width="800" height="1000"></div>
</div></section>
<section style="padding-top:40px"><div class="wrap vlayout">
  <div class="prose">
    <h2 class="mt0">Why couples choose it</h2>${paras}
    <h2>Verified details</h2><ul class="checklist">${(v.facts || []).map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
    <h2>Good to know</h2><ul class="checklist">${(v.tips || []).map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
    <p><a href="${esc(v.url)}" rel="nofollow noopener" target="_blank">Official weddings page ↗</a></p>
    <div class="note"><strong>Getting married here legally?</strong> You'll still need a Clark County marriage license ($102, both partners in person) and at least one witness. <a href="/guides/las-vegas-marriage-license/">Here's the step-by-step.</a></div>
    ${plannerCta()}
    ${v.status !== "partner" ? `<div class="panel" style="box-shadow:none"><h3 class="mt0">Is this your venue?</h3><p class="small">Claim this listing to add your own photos and copy, correct anything we got wrong, and receive inquiries directly.</p><a class="btn btn-ghost btn-sm" href="/for-venues/?venue=${encodeURIComponent(v.name)}">Claim ${esc(v.name)}</a></div>` : ""}
    <h2>${esc(v.name)} wedding FAQ</h2>${faqHtml(vFaq)}
    <h2>Plan the rest</h2><ul class="checklist">${vGuides.map((g) => `<li><a href="/guides/${g.slug}/">${esc(g.title)}</a></li>`).join("")}<li><a href="/lucky-wedding-dates/">Lucky wedding dates</a></li></ul>
    ${related.length ? `<h2>More ${esc(c.name.toLowerCase())} venues</h2><div class="grid-3">${related.map(venueCard).join("")}</div>` : ""}
  </div>
  <aside class="sticky">${sidebar}</aside>
</div></section>`,
    });
  }

  // ================= GUIDES =================
  const priceTable = `<div class="table-scroll"><table class="data"><thead><tr><th>Venue</th><th>Starting price</th><th>For</th><th>Checked</th></tr></thead><tbody>${sortedByPrice.filter((v) => v.priceFrom).map((v) => `<tr><td><a href="/venues/${v.slug}/">${esc(v.name)}</a></td><td class="num">${money(v.priceFrom)}</td><td>${esc(v.priceLabel || "")}</td><td class="num">${fmtDate(v.checked)}</td></tr>`).join("")}</tbody></table></div>
  <p class="small">Quote-only venues: ${sortedByPrice.filter((v) => !v.priceFrom).map((v) => `<a href="/venues/${v.slug}/">${esc(v.name)}</a>`).join(", ")}.</p>`;
  const CLIMATE = [["Jan", 58.5, 40.5, 0.56], ["Feb", 62.9, 44.1, 0.8], ["Mar", 71.1, 50.5, 0.42], ["Apr", 78.5, 56.9, 0.2], ["May", 88.5, 66.1, 0.07], ["Jun", 99.4, 75.8, 0.04], ["Jul", 104.5, 82.0, 0.38], ["Aug", 102.8, 80.6, 0.32], ["Sep", 94.9, 72.4, 0.32], ["Oct", 81.2, 59.6, 0.32], ["Nov", 67.1, 47.3, 0.3], ["Dec", 56.9, 39.6, 0.45]];
  const verdict = (hi) => (hi <= 72 ? "Great outdoors; bring layers at night" : hi <= 86 ? "Prime outdoor season" : hi <= 96 ? "Outdoor at sunrise or sunset" : "Indoor, sunrise or after dark");
  const climateTable = `<div class="table-scroll"><table class="data"><thead><tr><th>Month</th><th>Avg high</th><th>Avg low</th><th>Rain</th><th>Our rule of thumb</th></tr></thead><tbody>${CLIMATE.map(([m, hi, lo, pr]) => `<tr><td>${m}</td><td class="num">${Math.round(hi)}°F</td><td class="num">${Math.round(lo)}°F</td><td class="num">${pr.toFixed(2)} in</td><td>${verdict(hi)}</td></tr>`).join("")}</tbody></table></div><p class="small">Source: NOAA NCEI 1991–2020 monthly normals, Harry Reid International Airport. "Rule of thumb" is our own guidance, not NOAA's.</p>`;
  const seasonNow = CLIMATE.map(([m, hi, lo], i) => `<div class="note" data-months="${i + 1}" hidden><strong>Planning for ${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][i]}?</strong> Normal high ${Math.round(hi)}°F, low ${Math.round(lo)}°F. ${verdict(hi)}.</div>`).join("");

  const fillTokens = (html) => html
    .replace(/\{\{price-table\}\}/g, priceTable)
    .replace(/\{\{climate-table\}\}/g, climateTable)
    .replace(/\{\{season-now\}\}/g, seasonNow)
    .replace(/\{\{planner-cta\}\}/g, plannerCta())
    .replace(/\{\{price-min\}\}/g, money(priceMin)).replace(/\{\{price-max\}\}/g, money(priceMax))
    .replace(/\{\{venue-picks:([^}]+)\}\}/g, (_, s) => picks(s.split(","), venues))
    .replace(/\{\{viator:([^|}]+)\|([^}]+)\}\}/g, (_, q, label) => `<a class="aff" href="${viatorUrl(q)}" rel="sponsored nofollow noopener" target="_blank"><span>${esc(label)}</span><span>Browse on Viator ↗</span></a>`)
    .replace(/\{\{amazon:([^|}]+)\|([^}]+)\}\}/g, (_, q, label) => `<a class="aff" href="${amazonUrl(q)}" rel="sponsored nofollow noopener" target="_blank"><span>${esc(label)}</span><span>See options on Amazon ↗</span></a>`)
    .replace(/\{\{stay22\}\}/g, C.stay22MapUrl ? `<div style="border-radius:16px;overflow:hidden;border:1px solid var(--line);margin:18px 0"><iframe src="${esc(C.stay22MapUrl)}" title="Hotels near the Las Vegas Strip" width="100%" height="460" frameborder="0" loading="lazy"></iframe></div><p class="small">Hotel map powered by Stay22. We may earn a commission on bookings.</p>` : "");

  for (const g of guides) {
    const body = fillTokens(g.body);
    let n = 0; const toc = [];
    const withIds = body.replace(/<h2>(.*?)<\/h2>/g, (_, t) => { const id = "s" + ++n; toc.push([id, t.replace(/<[^>]+>/g, "")]); return `<h2 id="${id}">${t}</h2>`; });
    const answer = fillTokens(g.answer || "");
    const gi = guides.indexOf(g);
    const relatedGuides = [1, 2, 3].map((k) => guides[(gi + k) % guides.length]);
    page(`/guides/${g.slug}/`, {
      title: g.title, seoTitle: g.seoTitle, description: g.metaDescription || g.description, og: "g-" + g.slug, type: "article", modified: g.updated || FACTS_CHECKED,
      schema: [crumbSchema([["Home", "/"], ["Guides", "/guides/"], [g.nav, `/guides/${g.slug}/`]]),
        { "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.metaDescription || g.description, abstract: answer, datePublished: g.published || FACTS_CHECKED, dateModified: g.updated || FACTS_CHECKED, inLanguage: "en-US", author: orgRef, publisher: orgSchema, mainEntityOfPage: `${C.domain}/guides/${g.slug}/`, image: C.domain + ogFor("g-" + g.slug), citation: g.sources.filter((x) => x.u.startsWith("http")).map((x) => ({ "@type": "CreativeWork", name: x.t, url: x.u })) },
        ...(g.faq?.length ? [faqSchema(g.faq)] : [])],
      body: `<header class="article-hero"><div class="wrap"><div class="narrow">
  ${crumbs([["Home", "/"], ["Guides", "/guides/"], [g.nav, ""]])}
  <span class="eyebrow">${esc(g.eyebrow)}</span><h1>${esc(g.title)}</h1>
  <div class="meta"><span>By the ${esc(C.siteName)} editors</span><span>${g.readMins} min read</span><span>Facts checked <time datetime="${g.updated || FACTS_CHECKED}">${fmtDate(g.updated || FACTS_CHECKED)}</time></span><span>${g.sources.length} sources · <a href="/about/">how we fact-check</a></span></div>
</div></div></header>
<article class="article"><div class="wrap">
  <div class="prose">${answer ? `<div class="answer"><strong>Quick answer</strong><p>${esc(answer)}</p></div>` : ""}${withIds}
    ${g.faq?.length ? `<h2 id="faq">Frequently asked questions</h2>${faqHtml(g.faq)}` : ""}
    <h2>Keep planning</h2><ul class="checklist">${relatedGuides.map((r) => `<li><a href="/guides/${r.slug}/">${esc(r.title)}</a></li>`).join("")}<li><a href="/venues/">Browse all ${venues.length} unique venues</a></li></ul>
    <div class="sources"><strong>Sources</strong><ol>${g.sources.map((s) => `<li><a href="${s.u}" ${s.u.startsWith("http") ? 'rel="nofollow noopener" target="_blank"' : ""}>${esc(s.t)}</a></li>`).join("")}</ol></div>
  </div>
  <aside class="toc"><nav aria-label="On this page"><strong style="display:block;margin-bottom:6px;color:var(--charcoal)">On this page</strong>${toc.map(([id, t]) => `<a href="#${id}">${esc(t)}</a>`).join("")}</nav>${newsletterForm({ title: "Free checklist", sub: "The whole license and paperwork process on one printable page." })}</aside>
</div></article>`,
    });
  }
  page("/guides/", {
    title: "Las Vegas Wedding Planning Guides", og: "guides",
    description: "Sourced, plain-English guides to getting married in Las Vegas: marriage license, costs, best time of year, elopements, desert permits and more.",
    schema: [crumbSchema([["Home", "/"], ["Guides", "/guides/"]])],
    body: `<section style="padding-top:48px"><div class="wrap">${crumbs([["Home", "/"], ["Guides", ""]])}
  <span class="eyebrow">Plan it right</span><h1>Las Vegas wedding <em>guides</em></h1><p class="lede narrow">Plain-English answers, with every fact linked to the official source.</p>
  <div class="grid-3" style="margin-top:30px">${guides.map((g) => `<a class="mini" href="/guides/${g.slug}/"><span class="tag sage">${esc(g.eyebrow)}</span><strong style="margin-top:10px">${esc(g.title)}</strong><span>${esc(g.metaDescription || g.description)}</span></a>`).join("")}
  <a class="mini" href="/lucky-wedding-dates/"><span class="tag sage">Tool</span><strong style="margin-top:10px">Lucky & special wedding dates</strong><span>Palindromes, mirror dates and lucky sevens, calculated for any year.</span></a>
  <a class="mini" href="/tools/budget-planner/"><span class="tag sage">Tool</span><strong style="margin-top:10px">Vegas wedding budget planner</strong><span>Set your total and split it across venue, photos, attire and the rest.</span></a></div>
</div></section>`,
  });

  // ================= LUCKY DATES =================
  const luckyItem = (a) => `<li class="lucky-item"><div class="lucky-date">${a.short}</div><div><strong>${a.long}</strong><div class="tags">${a.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div></div><div class="lucky-when"></div></li>`;
  const luckyHow = `<h2>How we pick them</h2>
  <ul class="checklist"><li><strong>Palindromes</strong> read the same backward and forward (7/2/27 → 7227).</li><li><strong>Mirror dates</strong> have a matching month and day (10/10).</li><li><strong>Day matches year</strong> dates repeat the year (7/27/27).</li><li><strong>Lucky sevens</strong> have three or more 7s (7/7/27).</li><li>Plus Valentine's Day, Leap Day, Halloween, New Year's Eve and Friday the 13th for the bold.</li></ul>
  <p class="small">"Lucky" here means a memorable number pattern or holiday. It's tradition and fun, not a prediction.</p>`;
  const luckyCheck = `<h2>Check any date</h2>
  <p><label for="date-check" class="small">Pick a date to see if it's special:</label><br><input type="date" id="date-check" style="font:1rem var(--sans);padding:10px;border:1px solid var(--line);border-radius:10px;margin-top:6px"></p>
  <p id="date-check-out" aria-live="polite"></p>`;
  const luckyNote = `<div class="note"><strong>Why book early?</strong> On 6/26/26, one Las Vegas chapel group alone scheduled about 130 weddings (News 3 Las Vegas, June 26, 2026). Pattern dates are the Super Bowl of the chapel calendar.</div>`;
  const bookFaq = { q: "Do lucky wedding dates book up in Las Vegas?", a: "Yes. On 6/26/26, one Las Vegas chapel group scheduled about 130 weddings, according to News 3 Las Vegas. Book as early as your venue allows." };
  const describe = (a) => `${a.short} (${a.weekday}; ${a.tags.join(", ")})`;
  const yearChips = (skip) => `<div class="chips">${[0, 1, 2, 3].map((k) => YEAR + k).filter((y) => y !== skip).map((y) => `<a class="chip" href="/lucky-wedding-dates/${y}/">Lucky dates ${y}: ${L.top(y, 2).map((a) => a.short).join(", ")}</a>`).join("")}</div>`;

  // hub: the next special dates across years
  const hubList = L.upcoming(NOW, 20, 5);
  const nextBig = L.upcoming(NOW, 3, 6);
  const hubFaq = [
    { q: "What is the next lucky wedding date?", a: `As of ${fmtDate(ISO)}, the next major pattern dates are ${nextBig.map(describe).join(", ")}.` },
    bookFaq,
    { q: "What makes a wedding date lucky?", a: "Couples favor dates with memorable number patterns: palindromes that read the same both ways, mirror dates where the month and day match, dates that repeat the year, and dates with several sevens. Holidays such as Valentine's Day are popular too." },
  ];
  page("/lucky-wedding-dates/", {
    title: `Lucky Wedding Dates ${YEAR}–${YEAR + 3}`, seoTitle: `Lucky Wedding Dates ${YEAR}–${YEAR + 3}: Upcoming Special Dates`, og: "lucky", modified: ISO,
    description: `The next lucky and special wedding dates for ${YEAR}–${YEAR + 3}: palindromes, mirror dates, matching numbers and lucky sevens. Updated every week.`,
    schema: [crumbSchema([["Home", "/"], ["Lucky dates", "/lucky-wedding-dates/"]]), faqSchema(hubFaq)],
    body: `<section style="padding-top:48px"><div class="wrap narrow" style="margin:0 auto">
  ${crumbs([["Home", "/"], ["Lucky dates", ""]])}
  <span class="eyebrow">Updated ${fmtDate(ISO)}</span>
  <h1>Lucky wedding dates: <em>what's coming up</em></h1>
  <p class="lede">Palindromes, mirror dates, matching numbers and lucky sevens: the dates Las Vegas chapels sell out first. Calculated straight from the calendar, so the list never goes stale.</p>
  <div class="quickfacts">${nextBig.map((a) => `<div><span>${a.tags[0]}</span><strong>${a.short}</strong><div class="small">${a.weekday}</div></div>`).join("")}<div><span>Next up</span><strong>${hubList[0].short}</strong><div class="small">${hubList[0].tags[0]}</div></div></div>
  ${luckyNote}
  <h2>The next ${hubList.length} special dates</h2>
  <ul class="lucky-list" data-lucky-upcoming="${hubList.length}">${hubList.map(luckyItem).join("")}</ul>
  <h2>Browse by year</h2>${yearChips(null)}${YEAR > 2026 ? `<p class="small" style="margin-top:12px">Past years: ${Array.from({ length: YEAR - 2026 }, (_, k) => 2026 + k).map((y) => `<a href="/lucky-wedding-dates/${y}/">${y}</a>`).join(" · ")}</p>` : ""}
  ${luckyCheck}
  ${luckyHow}
  <h2>Lucky date FAQ</h2>${faqHtml(hubFaq)}
  ${newsletterForm({ title: "Get lucky-date alerts", sub: "We'll email you before big pattern dates open up, plus the free Vegas wedding checklist." })}
  <p style="margin-top:28px">Found your date? <a href="/venues/">Find a venue →</a></p>
</div></section>`,
  });
  const FIRST_YEAR = 2026; // year pages are never deleted, so old links keep working
  for (let y = FIRST_YEAR; y <= YEAR + 3; y++) {
    const all = L.forYear(y, 4), list = y < YEAR ? all : all.filter((a) => a.iso >= ISO), top = L.top(y, 5);
    const yFaq = [
      { q: `What are the luckiest wedding dates in ${y}?`, a: `The standout pattern dates in ${y} are ${top.map(describe).join(", ")}.` },
      { q: `How many special wedding dates are there in ${y}?`, a: `We count ${all.length} pattern and holiday dates in ${y}, including palindromes, mirror dates, dates that match the year and popular holidays.` },
      bookFaq,
    ];
    page(`/lucky-wedding-dates/${y}/`, {
      title: `Lucky Wedding Dates ${y}: Every Special Date`, og: `lucky-${y}`, modified: y === YEAR ? ISO : FACTS_CHECKED,
      description: `The special wedding dates of ${y}, including ${top.slice(0, 3).map((a) => a.short).join(", ")}. Palindromes, mirror dates and lucky sevens, plus how to book them in Las Vegas.`,
      schema: [crumbSchema([["Home", "/"], ["Lucky dates", "/lucky-wedding-dates/"], [String(y), `/lucky-wedding-dates/${y}/`]]), faqSchema(yFaq)],
      body: `<section style="padding-top:48px"><div class="wrap narrow" style="margin:0 auto">
  ${crumbs([["Home", "/"], ["Lucky dates", "/lucky-wedding-dates/"], [String(y), ""]])}
  <span class="eyebrow">${all.length} special dates</span>
  <h1>Lucky wedding dates <em>${y}</em></h1>
  <p class="lede">The standout date of ${y} is ${top[0].short}, a ${top[0].weekday} (${top[0].tags.join(", ").toLowerCase()}). Here is every palindrome, mirror date, matching-number date and holiday worth knowing about in ${y}.</p>
  <div class="quickfacts">${top.slice(0, 3).map((a) => `<div><span>${a.tags[0]}</span><strong>${a.short}</strong><div class="small">${a.weekday}</div></div>`).join("")}<div><span>Special dates</span><strong>${all.length}</strong><div class="small">in ${y}</div></div></div>
  ${luckyNote}
  <h2>${y === YEAR ? "Upcoming special dates in" : "Every special date in"} <span data-lucky-title>${y}</span></h2>
  <ul class="lucky-list" data-lucky-list data-start-year="${y}">${list.map(luckyItem).join("")}</ul>
  <h2>Other years</h2>${yearChips(y)}
  ${luckyCheck}
  ${luckyHow}
  <h2>${y} lucky date FAQ</h2>${faqHtml(yFaq)}
  ${newsletterForm({ title: "Get lucky-date alerts", sub: "We'll email you before big pattern dates open up, plus the free Vegas wedding checklist." })}
  <p style="margin-top:28px">Found your date? <a href="/venues/">Find a venue →</a></p>
</div></section>`,
    });
  }

  // ================= PLANNER (digital product) =================
  const buy = C.plannerCheckoutUrl
    ? `<a class="btn btn-primary" href="${esc(C.plannerCheckoutUrl)}">Buy the planner · ${esc(C.plannerPrice)}</a><p class="small">Instant PDF download. Print it or fill it in on a tablet.</p>`
    : `<p><strong>Launching soon.</strong> Join the list and we'll send you a launch discount (plus the free checklist now).</p>${newsletterForm({ title: "Get notified", sub: "One email when it's live.", h: "h2" })}`;
  page("/planner/", {
    title: "The Unique Vegas Wedding Planner (Printable PDF)", og: "planner",
    description: "A 25-page printable Las Vegas wedding planner: timelines, license and document checklists, budget worksheet, venue comparisons, guest list, day-of schedule and vows worksheet.",
    schema: [{ "@context": "https://schema.org", "@type": "Product", name: "The Unique Vegas Wedding Planner", description: "25-page printable Las Vegas wedding planner (PDF).", image: C.domain + "/assets/img/planner-cover.png", brand: { "@type": "Brand", name: C.siteName }, ...(C.plannerCheckoutUrl ? { offers: { "@type": "Offer", price: C.plannerPrice.replace(/[^0-9.]/g, ""), priceCurrency: "USD", url: C.plannerCheckoutUrl, availability: "https://schema.org/InStock" } } : {}) }],
    body: `<section style="padding-top:48px"><div class="wrap product">
  <div class="product-shot"><img src="/assets/img/planner-cover.png" alt="Planner cover" width="560" height="724"><img src="/assets/img/planner-spread.png" alt="Planner inside page" width="560" height="724"></div>
  <div><span class="eyebrow">Printable PDF · 25 pages</span><h1>The Unique Vegas <em>Wedding Planner</em></h1>
    <p class="lede">A planner built for Las Vegas, not a generic wedding binder with a cactus on the cover.</p>
    ${buy}
  </div>
</div></section>
<section class="band-blush"><div class="wrap grid-2">
  <div><h2 class="mt0">What's inside</h2><ul class="checklist">
    <li>How to use this planner + your wedding at a glance</li><li>12-week, 4-week and final-week timelines</li><li>Clark County license checklist and document list</li>
    <li>Budget worksheet with a Vegas-specific line-item list</li><li>Venue comparison sheets (compare 3 venues side by side)</li><li>Questions to ask venues, photographers and officiants</li>
    <li>Guest list and RSVP tracker</li><li>Travel and room-block tracker</li><li>Day-of run sheet and vendor contacts</li><li>Vows worksheet with writing prompts</li><li>Desert-ready packing list</li><li>After-the-wedding checklist: certified copies, name change, apostille</li></ul></div>
  <div><h2 class="mt0">Made for real Vegas logistics</h2><p>It covers the things generic planners skip: the $102 license and both-partners-in-person rule, the one-witness requirement, certified copies at $20 each, Valley of Fire's December closure, Red Rock's timed-entry season, and summer heat strategy.</p>
  <p class="small">Facts reflect official sources checked ${fmtDate(FACTS_CHECKED)}. Always confirm requirements with the Clark County Clerk before you travel.</p></div>
</div></section>`,
  });

  // ================= FOR VENUES =================
  const tierBtn = (url, label) => (url ? `<a class="btn btn-primary" href="${esc(url)}">${label}</a>` : `<a class="btn btn-primary" href="#apply">${label}</a>`);
  page("/for-venues/", {
    title: "List Your Las Vegas Wedding Venue", og: "for-venues",
    description: "Claim your free listing on Unique Vegas Weddings, or upgrade to Featured or Spotlight placement and send couples' inquiries straight to your inbox.",
    body: `<section style="padding-top:48px"><div class="wrap">
  <div class="narrow"><span class="eyebrow">For venues, chapels & planners</span><h1>Get found by couples who want <em>different</em></h1>
  <p class="lede">Unique Vegas Weddings is built for couples searching beyond the ballroom. If your venue is memorable, it belongs here.</p></div>
  <h2 class="sr-only">Listing plans</h2>
  <div class="tiers">
    <div class="tier"><h3>Listed</h3><div class="price">Free</div><ul class="checklist"><li>Your venue page with verified details</li><li>Correct or update your info anytime</li><li>Link to your official booking page</li></ul><a class="btn btn-ghost" href="#apply">Claim your listing</a></div>
    <div class="tier hot"><span class="tag" style="align-self:flex-start">Most popular</span><h3>Featured</h3><div class="price">${esc(C.featuredPrice)}</div><ul class="checklist"><li>Everything in Listed</li><li>"Featured" badge and top placement in your category</li><li>Inquiry form that sends couples' requests to <strong>your</strong> inbox</li><li>Your own photos and copy</li><li>In the "Venue of the week" rotation</li></ul>${tierBtn(C.featuredCheckoutUrl, "Go Featured")}</div>
    <div class="tier"><h3>Spotlight</h3><div class="price">${esc(C.spotlightPrice)}</div><ul class="checklist"><li>Everything in Featured</li><li>Placement in relevant planning guides</li><li>A dedicated Pinterest pin set for your venue</li><li>Inclusion in our email to couples</li></ul>${tierBtn(C.spotlightCheckoutUrl, "Go Spotlight")}</div>
  </div>
  <p class="small center" style="margin-top:18px">Monthly, cancel anytime. Paid placements are always labeled. Editorial facts stay accurate whether you pay or not.</p>
</div></section>
<section class="band-blush" id="apply"><div class="wrap grid-2">
  <div><h2 class="mt0">Claim or apply</h2><p>Tell us about your venue. We'll verify that you represent it, then set up your listing. Already paid for Featured or Spotlight? Use this form to send your photos, copy and inquiry email.</p>
  <ul class="checklist"><li>Photos must be yours or properly licensed</li><li>We verify facts against your official site</li><li>Weddings must be currently offered</li></ul></div>
  <div class="panel"><form action="${formAction(C.formspreePartner)}" ${formAttrs(C.formspreePartner)} data-next="/thanks/?sent=partner">
    <input type="hidden" name="_subject" value="UVW: venue listing application">
    <input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off">
    <div class="field"><label for="pv">Venue or business name</label><input id="pv" name="venue" required></div>
    <div class="row2"><div class="field"><label for="pn">Your name</label><input id="pn" name="name" required></div><div class="field"><label for="pr">Your role</label><input id="pr" name="role"></div></div>
    <div class="field"><label for="pe">Work email</label><input id="pe" type="email" name="email" required></div>
    <div class="field"><label for="pw">Official website</label><input id="pw" type="url" name="website" placeholder="https://"></div>
    <div class="field"><label for="pt">Plan</label><select id="pt" name="plan"><option>Listed (free)</option><option>Featured</option><option>Spotlight</option></select></div>
    <div class="field"><label for="pm">Anything we should know?</label><textarea id="pm" name="message"></textarea></div>
    <button class="btn btn-primary" type="submit" style="width:100%">Send</button>
  </form></div>
</div></section>
<script>(function(){var v=new URLSearchParams(location.search).get("venue");if(v){var i=document.getElementById("pv");if(i)i.value=v;}})();</script>`,
  });

  // ================= TOOLS: BUDGET =================
  const BP = [["Venue & ceremony package", 35], ["Photography & video", 18], ["Attire, hair & makeup", 12], ["Reception food & drink", 15], ["Flowers & decor", 6], ["Travel & rooms", 8], ["License, certified copies & fees", 2], ["Buffer (you'll use it)", 4]];
  page("/tools/budget-planner/", {
    title: "Las Vegas Wedding Budget Planner", og: "budget",
    description: "Free Las Vegas wedding budget planner: enter your total and split it across venue, photography, attire, reception, travel and fees.",
    body: `<section style="padding-top:48px"><div class="wrap narrow" style="margin:0 auto">
  ${crumbs([["Home", "/"], ["Guides", "/guides/"], ["Budget planner", ""]])}
  <span class="eyebrow">Free tool</span><h1>Vegas wedding <em>budget planner</em></h1>
  <p class="lede">Enter your total, then adjust the percentages until they add up to 100%. The starting split is just a starting point. Your priorities set the real one.</p>
  <h2 class="sr-only">Split your budget</h2>
  <div class="panel" data-budget-planner>
    <div class="field"><label for="bp-total">Total budget ($)</label><input id="bp-total" type="number" min="0" step="100" value="5000"></div>
    ${BP.map(([n, p]) => `<div class="bp-row" data-bp-row><span>${n}</span><input type="number" min="0" max="100" value="${p}" aria-label="${n} percent"><output>$0</output></div>`).join("")}
    <p style="margin:14px 0 0">Allocated: <strong id="bp-used">100%</strong></p>
  </div>
  <p class="small" style="margin-top:14px">Every Vegas wedding pays the $102 license fee. Certified copies are $20 each. See <a href="/guides/las-vegas-wedding-cost/">published venue prices</a> to sanity-check your venue line.</p>
  ${plannerCta()}
</div></section>`,
  });

  // ================= SEARCH (plain language, runs in the browser) =================
  const ALIASES = {
    "the-neon-museum": ["neon museum", "neon boneyard", "boneyard"], "springs-preserve": ["springs preserve"], "nelson-ghost-town": ["nelson", "ghost town", "eldorado canyon"],
    "waldorf-astoria-las-vegas": ["waldorf"], "shark-reef-aquarium": ["shark reef", "mandalay bay", "aquarium", "sharks"], "little-church-of-the-west": ["little church"],
    "little-white-wedding-chapel": ["little white", "white chapel", "pink cadillac"], "tunnel-of-love-drive-thru": ["drive thru", "drive-thru", "drive through", "tunnel of love"],
    "graceland-wedding-chapel": ["graceland"], "chapel-of-the-flowers": ["chapel of the flowers"], "viva-las-vegas-wedding-chapel": ["viva las vegas"],
    "strat-chapel-in-the-clouds": ["strat", "stratosphere", "chapel in the clouds"], "high-roller-wheel": ["high roller", "ferris wheel", "linq"], "eiffel-tower-paris-las-vegas": ["eiffel tower", "paris las vegas", "paris hotel"],
    "maverick-helicopters-weddings": ["maverick"], "papillon-helicopter-weddings": ["papillon"], "valley-of-fire-state-park": ["valley of fire"], "red-rock-canyon": ["red rock"],
    "the-mob-museum": ["mob museum", "courtroom"], "area15": ["area15", "area 15"], "omega-mart-meow-wolf": ["omega mart", "meow wolf"], "bellagio": ["bellagio"],
    "venetian-gondola-weddings": ["venetian", "gondola"], "caesars-palace-weddings": ["caesars", "caesar's"], "spring-mountain-ranch-state-park": ["spring mountain"],
    "floyd-lamb-park": ["floyd lamb", "tule springs"], "lake-mead-cruises-desert-princess": ["lake mead", "desert princess", "paddle wheeler", "boat"], "welcome-to-fabulous-las-vegas-sign": ["welcome sign", "vegas sign", "las vegas sign"],
  };
  const strip = (h) => h.replace(/<script.*?<\/script>/gs, " ").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
  const sections = [];
  for (const g of guides) {
    const parts = fillTokens(g.body).split(/<h2>/).slice(1);
    parts.forEach((part, i) => { const [h, ...rest] = part.split("</h2>"); const text = strip(rest.join(" ")); if (text.length > 40) sections.push({ guide: g.nav, h: strip(h), url: `/guides/${g.slug}/#s${i + 1}`, text: text.slice(0, 600) }); });
  }
  const seenQ = new Set();
  const faqs = [...guides.flatMap((g) => (g.faq || []).map((f) => ({ q: f.q, a: f.a, url: `/guides/${g.slug}/`, src: g.title }))),
    ...guides.map((g) => ({ q: g.title, a: fillTokens(g.answer || ""), url: `/guides/${g.slug}/`, src: g.title })),
    { q: homeFaq[0].q, a: homeFaq[0].a, url: "/about/", src: "About Unique Vegas Weddings" },
    { q: `What are the next lucky wedding dates?`, a: `As of ${fmtDate(ISO)}, the next major pattern dates are ${L.upcoming(NOW, 3, 6).map((a) => `${a.short} (${a.weekday}; ${a.tags.join(", ")})`).join(", ")}.`, url: "/lucky-wedding-dates/", src: "Lucky wedding dates" },
  ].filter((f) => f.a && !seenQ.has(f.q) && seenQ.add(f.q));
  write("search-index.json", JSON.stringify({
    built: ISO,
    cats: Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.name])),
    climate: CLIMATE.map(([m, hi, lo]) => [["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(m)], hi, lo, verdict(hi)]),
    venues: venues.map((v) => ({ name: v.name, url: `/venues/${v.slug}/`, img: `/assets/art/${v.slug}.svg`, cat: catBy[v.category].name, catSlug: v.category, area: v.area, drive: v.drive || "", setting: v.setting || "", price: v.priceFrom ?? null, priceLabel: v.priceLabel || "", guests: v.guestMax ?? null, vibe: v.vibe || [], bestFor: v.bestFor || "", alias: ALIASES[v.slug] || [], checkedText: fmtDate(v.checked), text: [v.description, ...(v.facts || []), ...(v.tips || [])].join(" ") })),
    faqs, sections,
    pages: [
      ...guides.map((g) => ({ kind: "Guide", title: g.title, url: `/guides/${g.slug}/`, text: g.metaDescription || g.description, kw: g.nav + " " + g.eyebrow })),
      ...CATEGORIES.map((c) => ({ kind: "Venue category", title: `${c.name} wedding venues`, url: `/venues/category/${c.slug}/`, text: c.blurb })),
      { kind: "Tool", title: "Lucky wedding dates", url: "/lucky-wedding-dates/", text: "Upcoming palindrome, mirror and matching-number wedding dates, recalculated every week.", kw: "lucky special date palindrome numbers calendar" },
      { kind: "Tool", title: "Vegas wedding budget planner", url: "/tools/budget-planner/", text: "Enter your total and split it across venue, photos, attire, reception, travel and fees.", kw: "budget calculator money split" },
      { kind: "Planner", title: "The Unique Vegas Wedding Planner", url: "/planner/", text: "A 25-page printable planner with timelines, license checklists, a budget worksheet and venue comparison sheets.", kw: "planner printable pdf checklist timeline download" },
      { kind: "Free download", title: "Free Vegas wedding checklist", url: "/#checklist", text: "One printable page: license steps, documents, witness rules and certified copies.", kw: "free checklist download pdf" },
      { kind: "For venues", title: "List your venue", url: "/for-venues/", text: "Claim your free listing or upgrade to Featured or Spotlight placement.", kw: "advertise list claim partner vendor business owner listing" },
    ],
  }));
  page("/search/", {
    title: "Search", seoTitle: "Search Unique Las Vegas Wedding Venues & Guides", noindex: true, scripts: ["/assets/js/search.js"],
    description: "Describe the Las Vegas wedding you want in plain words, or ask a question. Search venues by budget, guest count, setting and vibe.",
    body: `<section style="padding-top:48px"><div class="wrap">
  <div class="narrow">
    <span class="eyebrow">Search</span><h1>Tell us what you're <em>looking for</em></h1>
    <p class="lede">Describe your wedding in your own words, or ask a question. Mention a budget, a guest count, indoor or outdoor, a month or a vibe.</p>
    ${searchBar("q", "Try: outdoor wedding under $2,500 for 40 guests")}
    ${searchExamples()}
    <div data-search-read aria-live="polite"></div>
  </div>
  <div data-search-out aria-live="polite" style="margin-top:8px"></div>
  <noscript><div class="note">Search needs JavaScript. You can still <a href="/venues/">browse all venues</a> or <a href="/guides/">read the guides</a>.</div></noscript>
  <p class="small" style="margin-top:36px">This search runs in your browser and matches your words against our venue data and guides. It isn't a chatbot, so it only shows what's published on this site.</p>
</div></section>`,
  });

  // ================= SHORTLIST =================
  page("/shortlist/", {
    title: "Your Venue Shortlist", noindex: true, description: "Your saved Las Vegas wedding venues.",
    body: `<section style="padding-top:48px"><div class="wrap grid-2">
  <div><span class="eyebrow">Saved on this device</span><h1>Your <em>shortlist</em></h1><ul class="shortlist-list" data-sl-list></ul><a class="btn btn-ghost btn-sm" href="/venues/">Keep browsing</a></div>
  <div class="panel"><h2 class="mt0 h3">Email me my shortlist</h2><p class="small">We'll send the list with links, plus the free Vegas wedding checklist.</p>
    <form action="${formAction(C.formspreeNewsletter)}" ${formAttrs(C.formspreeNewsletter)} data-next="/thanks/?download=checklist">
      <input type="hidden" name="list" value="shortlist"><input type="hidden" name="_subject" value="UVW: shortlist request"><input type="hidden" name="shortlist" data-sl-field><input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off">
      <div class="field"><label for="sle">Email</label><input id="sle" type="email" name="email" required></div>
      <div class="field"><label for="sld">Wedding date (if you know it)</label><input id="sld" type="date" name="date"></div>
      <button class="btn btn-primary" type="submit" style="width:100%">Send my shortlist</button>
    </form></div>
</div></section>`,
  });

  // ================= SIMPLE PAGES =================
  const simple = (p, title, description, html) => page(p, { title, description, body: `<section style="padding-top:48px"><div class="wrap narrow prose" style="margin:0 auto"><h1>${title}</h1>${html}</div></section>` });
  simple("/about/", "About Unique Vegas Weddings", "Why we built an independent guide to unique Las Vegas wedding venues, and how we keep it accurate.", `
<p class="lede">Las Vegas is the wedding capital of the world, and most of the internet's advice about it is either a sales page or ten years out of date. We built the guide we wanted to exist.</p>
<h2>What we do</h2><p>We curate Las Vegas-area wedding venues that are genuinely distinctive, from neon and desert to sky-high and only-in-Vegas. Then we write about them honestly, in our own words.</p>
<h2>How we keep it accurate</h2><ul class="checklist"><li>Every venue fact is checked against the venue's official site, and every listing shows the date we checked.</li><li>Legal and permit information comes from the Clark County Clerk, Nevada State Parks, the BLM, the National Park Service and the U.S. Forest Service, and we link to them.</li><li>We don't copy venue marketing copy or photos. Our illustrations are original, and venues can add their own photos by claiming their listing.</li><li>Paid placements are labeled "Featured" or "Partner." They never change the facts.</li></ul>
<h2>Independent</h2><p>Unique Vegas Weddings isn't owned by or affiliated with any venue, chapel or resort. Some links earn us a commission. See our <a href="/disclosure/">disclosure</a>.</p>
<p>Spotted something out of date? <a href="/contact/">Tell us</a> and we'll fix it.</p>`);
  simple("/contact/", "Contact", "Contact Unique Vegas Weddings about corrections, partnerships, press or a Las Vegas wedding question we haven't answered yet.", `
<p class="lede">Corrections, partnerships, press or a question we haven't answered yet: we'd love to hear it.</p>
<p>Email: <a href="mailto:${C.contactEmail}">${C.contactEmail}</a></p>
<p>Represent a venue? <a href="/for-venues/">Claim your listing here</a>, which is the fastest way to update your details.</p>
<div class="note">We're a guide, not a booking agency, so we can't book venues or issue marriage licenses. For licenses, contact the Clark County Clerk directly.</div>`);
  simple("/disclosure/", "Affiliate & Advertising Disclosure", "How Unique Vegas Weddings makes money: affiliate links, labeled paid venue listings, our own printable planner and display advertising.", `
<p>Unique Vegas Weddings is free to use. We earn money in a few ways, and we want you to know exactly how:</p>
<ul class="checklist"><li><strong>Affiliate links.</strong> Some links (for example Amazon, Viator and hotel booking partners) earn us a commission if you buy, at no extra cost to you. As an Amazon Associate we earn from qualifying purchases.</li><li><strong>Paid listings.</strong> Venues can pay for Featured or Spotlight placement. These are always labeled. Paid status never changes the facts we publish.</li><li><strong>Digital products.</strong> We sell our own printable planner.</li><li><strong>Advertising.</strong> Some pages may show display ads from third-party networks.</li></ul>
<p>We only recommend things we'd suggest to a friend getting married in Las Vegas.</p>`);
  simple("/privacy/", "Privacy Policy", "How Unique Vegas Weddings handles your information: what our forms collect, how the shortlist is stored, analytics, cookies and your choices.", `
<p class="small">Effective ${fmtDate(FACTS_CHECKED)}</p>
<h2>What we collect</h2><ul class="checklist"><li><strong>Forms.</strong> When you submit a form (newsletter, shortlist, venue inquiry or partner application), we receive what you enter. Forms are processed by Formspree. Venue inquiries for Partner venues are sent to that venue.</li><li><strong>Your shortlist</strong> is stored only in your own browser (localStorage). We never see it unless you email it to yourself.</li><li><strong>Analytics.</strong> If enabled, we use Google Analytics to understand which pages are useful. It uses cookies.</li><li><strong>Advertising and affiliates.</strong> Ad networks and affiliate partners may set cookies to measure ads and attribute purchases.</li></ul>
<h2>How we use it</h2><p>To send what you asked for (like the checklist or lucky-date alerts), to pass inquiries to the venue you chose, and to improve the site. We don't sell your personal information.</p>
<h2>Your choices</h2><p>Every email includes an unsubscribe link. You can clear your shortlist by clearing your browser storage. To ask us to delete your information, email <a href="mailto:${C.contactEmail}">${C.contactEmail}</a>.</p>
<p class="small">This policy is a plain-language template. Have it reviewed for your specific setup before launch.</p>`);
  simple("/terms/", "Terms of Use", "Terms of use for Unique Vegas Weddings: information only, no booking relationship, third-party links, content ownership and liability.", `
<p class="small">Effective ${fmtDate(FACTS_CHECKED)}</p>
<ul class="checklist"><li><strong>Information only.</strong> Our content is general information, not legal, financial or travel advice. Marriage requirements, permits and prices change, so always confirm with the official source and the venue before you book or travel.</li><li><strong>No booking relationship.</strong> We don't sell or guarantee venue services. Your contract is with the venue or vendor you choose.</li><li><strong>Third-party sites.</strong> We link to other sites and aren't responsible for their content or services.</li><li><strong>Our content.</strong> Text and illustrations on this site are ours. Please don't republish them without permission. Venue names and trademarks belong to their owners.</li><li><strong>Liability.</strong> To the extent the law allows, we aren't liable for losses arising from use of this site.</li></ul>
<p class="small">Template terms. Have them reviewed before launch.</p>`);
  page("/thanks/", {
    title: "Thank you", noindex: true, description: "Thanks for reaching out.",
    body: `<section style="padding-top:64px"><div class="wrap narrow center" style="margin:0 auto">
  <span class="eyebrow">Got it</span><h1>Thank <em>you!</em></h1>
  <div id="dl" hidden><p class="lede">Your free Vegas Wedding Checklist is ready.</p><a class="btn btn-primary" href="/downloads/vegas-wedding-checklist.pdf" download>Download the checklist (PDF)</a></div>
  <div id="sent"><p class="lede">Your message is on its way.</p></div>
  <p style="margin-top:28px"><a href="/venues/">Browse venues</a> · <a href="/lucky-wedding-dates/">Lucky dates</a> · <a href="/planner/">The planner</a></p>
</div></section><script>if(new URLSearchParams(location.search).get("download")){document.getElementById("dl").hidden=false;document.getElementById("sent").hidden=true;}</script>`,
  });
  write("404.html", layout({ path: "/404", title: "Page not found", noindex: true, description: "Page not found.", body: `<section style="padding-top:72px"><div class="wrap narrow center" style="margin:0 auto"><span class="eyebrow">404</span><h1>This page <em>eloped.</em></h1><p class="lede">It's not here anymore. Let's get you back on track.</p>${searchBar("nf-q")}<p style="margin-top:18px"></p><a class="btn btn-primary" href="/venues/">Browse venues</a> <a class="btn btn-ghost" href="/">Home</a></div></section>` }));

  // ================= FEEDS, SITEMAP, ROBOTS, MANIFEST =================
  write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map(([p, mod]) => `<url><loc>${C.domain}${p}</loc><lastmod>${mod}</lastmod></url>`).join("\n")}\n</urlset>\n`);

  // ---------- robots.txt: search engines + AI assistants ----------
  const RULES = "Allow: /\nDisallow: /thanks/\nDisallow: /shortlist/";
  const AI_ANSWER_BOTS = ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "DuckAssistBot"];
  const AI_TRAINING_BOTS = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot", "meta-externalagent", "Amazonbot"];
  const group = (bots, rules) => bots.map((b) => `User-agent: ${b}`).join("\n") + "\n" + rules;
  write("robots.txt", [
    "# Unique Vegas Weddings. Humans, search engines and AI assistants welcome.",
    "User-agent: *\n" + RULES,
    "# AI search and answer engines (they cite and link back)\n" + group(AI_ANSWER_BOTS, RULES),
    `# AI model-training crawlers (${C.allowAiTraining ? "allowed" : "blocked"}: see allowAiTraining in config)\n` + group(AI_TRAINING_BOTS, C.allowAiTraining ? RULES : "Disallow: /"),
    `Sitemap: ${C.domain}/sitemap.xml`,
  ].join("\n\n") + "\n");

  // ---------- llms.txt + llms-full.txt + venues.json: clean text for AI assistants ----------
  const abs = (u) => (u.startsWith("/") ? C.domain + u : u);
  const ent = (t) => t.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ").replace(/&middot;/g, "·");
  const inline = (h) => h.replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gs, (_, u, t) => `[${t.replace(/<[^>]+>/g, "").trim()}](${abs(u)})`).replace(/<\/?strong>/g, "**").replace(/<\/?em>/g, "*");
  const mdTable = (rows) => rows.map((r, i) => `| ${r.join(" | ")} |` + (i === 0 ? `\n|${r.map(() => " --- ").join("|")}|` : "")).join("\n");
  const toMd = (html) => ent(inline(html
    .replace(/<table.*?<\/table>/gs, (t) => "\n" + mdTable([...t.matchAll(/<tr>(.*?)<\/tr>/gs)].map((m) => [...m[1].matchAll(/<t[hd][^>]*>(.*?)<\/t[hd]>/gs)].map((c) => inline(c[1]).replace(/<[^>]+>/g, "").trim()))) + "\n")
    .replace(/<div class="quickfacts">(.*?)<\/div>\s*\n/gs, (_, q) => [...q.matchAll(/<span>(.*?)<\/span><strong>(.*?)<\/strong>/g)].map((m) => `- ${m[1]}: ${m[2]}`).join("\n") + "\n\n")
    .replace(/<a [^>]*class="mini"[^>]*href="([^"]+)"[^>]*><strong>(.*?)<\/strong><span>(.*?)<\/span><\/a>/g, (_, u, t, d) => `- [${t}](${abs(u)}): ${d}\n`)
    .replace(/<a [^>]*href="([^"]+)"[^>]*class="mini"[^>]*><strong>(.*?)<\/strong><span>(.*?)<\/span><\/a>/g, (_, u, t, d) => `- [${t}](${abs(u)}): ${d}\n`)
    .replace(/<h2[^>]*>(.*?)<\/h2>/g, "\n## $1\n\n").replace(/<li>/g, "- ").replace(/<\/li>/g, "\n")
    .replace(/<div class="note">(.*?)<\/div>/gs, "\n> $1\n\n").replace(/<\/p>/g, "\n\n"))
    .replace(/<[^>]+>/g, "")).replace(/[ \t]+\n/g, "\n").replace(/^[ \t]+/gm, "").replace(/\n\n(?=- )/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  const mdTokens = (h) => h
    .replace(/\{\{price-table\}\}/g, "\n" + mdTable([["Venue", "Starting price", "For", "Checked"], ...sortedByPrice.filter((v) => v.priceFrom).map((v) => [`[${v.name}](${C.domain}/venues/${v.slug}/)`, money(v.priceFrom), v.priceLabel || "", v.checked])]) + "\n\n")
    .replace(/\{\{climate-table\}\}/g, "\n" + mdTable([["Month", "Avg high °F", "Avg low °F", "Rain (in)"], ...CLIMATE.map(([m, hi, lo, pr]) => [m, hi, lo, pr])]) + "\n\nSource: NOAA NCEI 1991–2020 monthly normals, Harry Reid International Airport.\n\n")
    .replace(/\{\{venue-picks:([^}]+)\}\}/g, (_, sl) => sl.split(",").map((x) => venues.find((v) => v.slug === x)).filter(Boolean).map((v) => `<li><a href="/venues/${v.slug}/">${v.name}</a></li>`).join(""))
    .replace(/\{\{price-min\}\}/g, money(priceMin)).replace(/\{\{price-max\}\}/g, money(priceMax))
    .replace(/\{\{[^}]+\}\}/g, "");
  const venueLine = (v) => `${catBy[v.category].name}; ${v.area}; ${v.priceFrom ? `from ${money(v.priceFrom)}${v.priceLabel ? ` (${v.priceLabel})` : ""}` : "custom quote"}${v.guestMax ? `; up to ${v.guestMax} guests` : ""}; checked ${v.checked}`;
  const keyFacts = [
    "Clark County marriage license: $102; both partners must appear in person with original photo ID; no waiting period, blood test or residency requirement; valid for 1 year.",
    "Marriage License Bureau: 201 E. Clark Ave., Las Vegas, NV 89101; open 8 a.m. to midnight every day, including holidays; walk-in only.",
    "A legal Nevada ceremony needs an authorized officiant and at least one witness besides the officiant.",
    "Clark County civil ceremony (Office of Civil Marriages): $77.75 including card fee; appointment only; one witness plus up to eight guests.",
    "Certified copy of a marriage certificate: $20 from the Clark County Clerk. Apostilles come from the Nevada Secretary of State.",
    `Published venue starting prices in this directory range from ${money(priceMin)} to ${money(priceMax)}.`,
    "Valley of Fire State Park is closed December 1–14 every year, and weddings are not allowed during the closure.",
  ];
  write("llms.txt", `# ${C.siteName}

> ${C.description} Independent: not owned by or affiliated with any venue. Facts are checked against official sources (Clark County Clerk, NOAA, Nevada State Parks, BLM, National Park Service and each venue's own site). Last fact check: ${FACTS_CHECKED}. Site rebuilt: ${ISO}.

When citing, please link to the specific page and mention the "checked" date, because venue prices change.

## Key facts
${keyFacts.map((f) => `- ${f}`).join("\n")}

## Guides
${guides.map((g) => `- [${g.title}](${C.domain}/guides/${g.slug}/): ${fillTokens(g.answer || g.description)}`).join("\n")}

## Venues
${venues.map((v) => `- [${v.name}](${C.domain}/venues/${v.slug}/): ${venueLine(v)}`).join("\n")}

## Venue categories
${CATEGORIES.map((c) => `- [${c.name}](${C.domain}/venues/category/${c.slug}/): ${c.blurb}`).join("\n")}

## Tools
- [Lucky wedding dates](${C.domain}/lucky-wedding-dates/): upcoming palindrome, mirror and matching-number dates, recalculated every week
- [Budget planner](${C.domain}/tools/budget-planner/): split a Las Vegas wedding budget by category
- [Site search](${C.domain}/search/): plain-language search of venues and guides; pass the query as ${C.domain}/search/?q=your+words

## Optional
- [Full text of every guide and venue](${C.domain}/llms-full.txt)
- [Venue data as JSON](${C.domain}/data/venues.json)
- [About and fact-checking policy](${C.domain}/about/)
- [Sitemap](${C.domain}/sitemap.xml)
`);
  write("llms-full.txt", `# ${C.siteName}: full text\n\n> ${C.description} Last fact check: ${FACTS_CHECKED}.\n\n` +
    guides.map((g) => `# ${g.title}\n\nURL: ${C.domain}/guides/${g.slug}/\nFacts checked: ${g.updated || FACTS_CHECKED}\n\n**Quick answer:** ${fillTokens(g.answer || "")}\n\n${toMd(mdTokens(g.body))}\n\n## FAQ\n\n${(g.faq || []).map((f) => `**${f.q}**\n${f.a}`).join("\n\n")}\n\n## Sources\n\n${g.sources.map((x) => `- [${x.t}](${abs(x.u)})`).join("\n")}`).join("\n\n---\n\n") +
    "\n\n---\n\n# Venues\n\n" +
    venues.map((v) => `## ${v.name}\n\nURL: ${C.domain}/venues/${v.slug}/\nOfficial site: ${v.url}\nSummary: ${venueLine(v)}\nSetting: ${v.setting || "n/a"}\nGetting there: ${v.drive || "n/a"}\nBest for: ${v.bestFor}\n\n${v.description}\n\nVerified details:\n${(v.facts || []).map((x) => `- ${x}`).join("\n")}\n\nGood to know:\n${(v.tips || []).map((x) => `- ${x}`).join("\n")}`).join("\n\n") + "\n");
  write("data/venues.json", JSON.stringify({ source: C.siteName, url: C.domain, generated: ISO, note: "Starting prices are each venue's own published 'from' price on the lastChecked date. Confirm with the venue before booking.", venues: venues.map((v) => ({ name: v.name, url: `${C.domain}/venues/${v.slug}/`, officialUrl: v.url, category: catBy[v.category].name, area: v.area, setting: v.setting || null, startingPriceUSD: v.priceFrom ?? null, priceFor: v.priceLabel || null, maxGuests: v.guestMax ?? null, bestFor: v.bestFor, facts: v.facts || [], lastChecked: v.checked })) }, null, 1));

  // ---------- IndexNow (Bing, Copilot and other engines pick up changes fast) ----------
  if (C.indexNowKey) {
    write(`${C.indexNowKey}.txt`, C.indexNowKey);
    write("indexnow.json", JSON.stringify({ host: C.domain.replace(/^https?:\/\//, ""), key: C.indexNowKey, keyLocation: `${C.domain}/${C.indexNowKey}.txt`, urlList: sitemap.map(([p]) => C.domain + p) }));
  }

  // ---------- redirect stubs for old URLs (static hosts can't do real 301s) ----------
  for (const [from, to] of Object.entries(C.redirects || {})) {
    const rel = from.replace(/^\//, "") + (from.endsWith("/") ? "index.html" : "");
    if (fs.existsSync(path.join(OUT, rel))) continue;
    write(rel, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Moved</title><link rel="canonical" href="${C.domain}${to}"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0; url=${to}"></head><body><p>This page has moved to <a href="${to}">${C.domain}${to}</a>.</p></body></html>`);
  }
  const feedItems = [
    ...guides.map((g) => ({ t: g.title, u: `/guides/${g.slug}/`, d: g.metaDescription || g.description, date: g.updated || FACTS_CHECKED })),
    ...venues.map((v) => ({ t: `${v.name}: wedding venue guide`, u: `/venues/${v.slug}/`, d: v.bestFor, date: v.checked })),
    { t: `Lucky wedding dates ${YEAR + 1}`, u: `/lucky-wedding-dates/${YEAR + 1}/`, d: `Every special wedding date in ${YEAR + 1}.`, date: ISO },
  ].sort((a, b) => (a.date < b.date ? 1 : -1));
  write("feed.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${esc(C.siteName)}</title><link>${C.domain}</link><description>${esc(C.description)}</description><lastBuildDate>${NOW.toUTCString()}</lastBuildDate>\n${feedItems.map((i) => `<item><title>${esc(i.t)}</title><link>${C.domain}${i.u}</link><guid>${C.domain}${i.u}</guid><description>${esc(i.d)}</description><pubDate>${new Date(i.date + "T12:00:00Z").toUTCString()}</pubDate></item>`).join("\n")}\n</channel></rss>\n`);
  write("site.webmanifest", JSON.stringify({ name: C.siteName, short_name: C.shortName, start_url: "/", display: "browser", background_color: "#FFFBF8", theme_color: "#FFFBF8", icons: [{ src: "/assets/img/mark-192.png", sizes: "192x192", type: "image/png" }, { src: "/assets/img/mark-512.png", sizes: "512x512", type: "image/png" }] }, null, 2));
  write("CNAME", C.domain.replace(/^https?:\/\//, "") + "\n");
  if (C.adsenseClient) write("ads.txt", `google.com, ${C.adsenseClient.replace("ca-", "")}, DIRECT, f08c47fec0942fa0\n`);
  write("build-info.json", JSON.stringify({ built: NOW.toISOString(), venues: venues.length, guides: guides.length, pages: sitemap.length, featuredThisWeek: votw.slug }, null, 2));

  // stale-price report (used by the weekly GitHub Action)
  const stale = venues.filter((v) => (NOW - new Date(v.checked + "T12:00:00")) / 864e5 > 180);
  fs.writeFileSync(path.join(ROOT, "stale-report.md"), stale.length ? `These venues haven't been re-checked in 180+ days. Open each official page, confirm prices and facts, then update \`checked\` in src/data/venues.mjs:\n\n${stale.map((v) => `- [ ] **${v.name}**: last checked ${v.checked}: ${v.url}`).join("\n")}\n` : "");

  console.log(`Built ${sitemap.length} indexable pages, ${venues.length} venues, ${guides.length} guides → /public  (venue of the week: ${votw.name})`);
  if (seoWarnings.length) console.log("\nSEO warnings:\n- " + seoWarnings.join("\n- "));
  if (warnings.length) console.log("\nTo turn on revenue, set these in src/data/config.mjs:\n- " + warnings.join("\n- "));
}

main().catch((e) => { console.error(e); process.exit(1); });
