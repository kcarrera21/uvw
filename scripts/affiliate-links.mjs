// =====================================================================
//  Affiliate link engine (zero dependencies, pure functions).
//  Used by build.mjs for every generated HTML page, and by
//  scripts/check-affiliates.mjs for self-tests.
//
//  With every ID empty, processHtml() returns its input untouched
//  (byte-for-byte), so the site renders identically until IDs are added.
// =====================================================================

const hostIs = (host, ...roots) => roots.some((r) => host === r || host.endsWith("." + r));
const SPONSORED_REL = ["sponsored", "nofollow", "noopener"];
const OTA_ALLEZ = { "booking.com": "booking", "expedia.com": "expedia", "hotels.com": "hotelscom", "vrbo.com": "vrbo" };

export function createAffiliateEngine(ids = {}, { campaign = "uvw" } = {}) {
  const I = {
    AMAZON_TAG: "", VIATOR_PID: "", VIATOR_MCID: "42383", STAY22_AID: "",
    BOOKING_LINK_TEMPLATE: "", EXPEDIA_LINK_TEMPLATE: "", STAY22_MAP_URL: "", ...ids,
  };
  const hotelProvider = I.STAY22_AID ? "stay22" : I.BOOKING_LINK_TEMPLATE ? "booking" : I.EXPEDIA_LINK_TEMPLATE ? "expedia" : "";
  const fill = (tpl, url) => tpl.replace(/\{urlenc\}/g, encodeURIComponent(url)).replace(/\{url\}/g, url);

  // ---- plain (untagged) URL builders: build.mjs uses these, tagging happens afterwards ----
  const amazonSearch = (q) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}`;
  const viatorSearch = (q) => `https://www.viator.com/searchResults/all?text=${encodeURIComponent(q)}`;
  const bookingSearch = (q) => `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(q)}`;
  const expediaSearch = (q) => `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(q)}`;

  // Link to compare hotel rates for a place. Returns "" when no hotel program is configured
  // (callers then render nothing, so empty config == no hotel slot).
  const hotelSearchUrl = (q, { campaignName = campaign } = {}) => {
    if (hotelProvider === "stay22") return `https://www.stay22.com/allez/roam?aid=${encodeURIComponent(I.STAY22_AID)}&address=${encodeURIComponent(q)}&campaign=${encodeURIComponent(campaignName)}`;
    if (hotelProvider === "booking") return fill(I.BOOKING_LINK_TEMPLATE, bookingSearch(q));
    if (hotelProvider === "expedia") return fill(I.EXPEDIA_LINK_TEMPLATE, expediaSearch(q));
    return "";
  };
  const hotelProviderLabel = { stay22: "Stay22", booking: "Booking.com", expedia: "Expedia" }[hotelProvider] || "";

  // Embedded Stay22 map (iframe src), or "" if not configured.
  const stay22MapSrc = (address = "Las Vegas Strip, Las Vegas, NV", campaignName = campaign) =>
    I.STAY22_MAP_URL || (I.STAY22_AID ? `https://www.stay22.com/embed/gm?aid=${encodeURIComponent(I.STAY22_AID)}&address=${encodeURIComponent(address)}&campaign=${encodeURIComponent(campaignName)}` : "");

  // ---- tag one URL. Returns { url, affiliate } ----
  function tagUrl(href) {
    let u;
    try { u = new URL(href); } catch { return { url: href, affiliate: false }; }
    if (!/^https?:$/.test(u.protocol)) return { url: href, affiliate: false };
    const host = u.hostname.toLowerCase().replace(/^www\./, "");

    if (I.AMAZON_TAG && hostIs(host, "amazon.com")) {
      if (!u.searchParams.has("tag")) u.searchParams.set("tag", I.AMAZON_TAG);
      return { url: u.toString(), affiliate: u.searchParams.get("tag") === I.AMAZON_TAG };
    }
    if (I.VIATOR_PID && hostIs(host, "viator.com")) {
      if (!u.searchParams.has("pid")) {
        u.searchParams.set("pid", I.VIATOR_PID);
        u.searchParams.set("mcid", I.VIATOR_MCID || "42383");
        u.searchParams.set("medium", "link");
      }
      return { url: u.toString(), affiliate: u.searchParams.get("pid") === I.VIATOR_PID };
    }
    // Raw hotel-site links written into content get routed through the configured hotel program.
    const ota = Object.keys(OTA_ALLEZ).find((d) => hostIs(host, d));
    if (ota && hotelProvider) {
      if (hotelProvider === "stay22") {
        const out = `https://www.stay22.com/allez/${OTA_ALLEZ[ota]}?aid=${encodeURIComponent(I.STAY22_AID)}&campaign=${encodeURIComponent(campaign)}&link=${encodeURIComponent(href)}`;
        return { url: out, affiliate: true };
      }
      if (hotelProvider === "booking" && ota === "booking.com") return { url: fill(I.BOOKING_LINK_TEMPLATE, href), affiliate: true };
      if (hotelProvider === "expedia" && ota === "expedia.com") return { url: fill(I.EXPEDIA_LINK_TEMPLATE, href), affiliate: true };
    }
    // Already an affiliate-routed link carrying our Stay22 ID (built by hotelSearchUrl).
    if (I.STAY22_AID && host === "stay22.com" && /^\/allez\//.test(u.pathname) && u.searchParams.get("aid") === I.STAY22_AID) return { url: href, affiliate: true };
    return { url: href, affiliate: false };
  }

  const decodeAmp = (s) => s.replace(/&amp;/g, "&");
  const encodeAmp = (s) => s.replace(/&/g, "&amp;");
  const mergeRel = (existing) => {
    const have = new Set(String(existing || "").split(/\s+/).filter(Boolean));
    for (const t of SPONSORED_REL) have.add(t);
    return [...have].join(" ");
  };

  const active = () => [
    I.AMAZON_TAG && "amazon", I.VIATOR_PID && "viator", hotelProvider && hotelProvider,
  ].filter(Boolean);
  const isActive = () => active().length > 0;

  const NOTE = `<p class="aff-note"><strong>Heads up:</strong> some links on this page are affiliate links. If you book or buy through them, we may earn a commission at no extra cost to you. It never changes what we recommend. <a href="/disclosure/">How we make money</a></p>`;

  // Rewrite every <a href> in a generated page. Idempotent. No-op when nothing is configured.
  function processHtml(html) {
    if (!isActive()) return html;
    let hits = 0;
    const out = html.replace(/<a\b([^>]*?)>/gi, (tag, attrs) => {
      const m = attrs.match(/\shref="([^"]*)"/i);
      if (!m) return tag;
      // data-aff="1" = href is already affiliate-routed (e.g. built by hotelSearchUrl); keep it, just enforce rel.
      const declared = /\sdata-aff="1"/i.test(attrs);
      const { url, affiliate } = declared ? { url: decodeAmp(m[1]), affiliate: true } : tagUrl(decodeAmp(m[1]));
      if (!affiliate) return tag;
      hits++;
      let a = attrs.replace(m[0], ` href="${encodeAmp(url)}"`);
      const r = a.match(/\srel="([^"]*)"/i);
      a = r ? a.replace(r[0], ` rel="${mergeRel(r[1])}"`) : a + ` rel="${mergeRel("")}"`;
      return `<a${a}>`;
    });
    const hasMap = /<iframe[^>]+src="https:\/\/www\.stay22\.com\/embed/i.test(out);
    if ((hits || hasMap) && !out.includes('class="aff-note"')) {
      if (out.includes('<div class="prose">')) return out.replace('<div class="prose">', `<div class="prose">${NOTE}`);
      if (out.includes('<main id="main">')) return out.replace('<main id="main">', `<main id="main"><div class="wrap narrow">${NOTE}</div>`);
    }
    return out;
  }

  return { ids: I, hotelProvider, hotelProviderLabel, active, isActive, tagUrl, processHtml, amazonSearch, viatorSearch, hotelSearchUrl, stay22MapSrc };
}
