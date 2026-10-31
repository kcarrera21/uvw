// Self-test for the affiliate link engine. Run: node scripts/check-affiliates.mjs
import assert from "node:assert/strict";
import { createAffiliateEngine } from "./affiliate-links.mjs";

const sample = `<div class="prose"><p>x</p>
<a class="aff" href="https://www.amazon.com/s?k=veil%20clips" rel="sponsored nofollow noopener" target="_blank">amz</a>
<a href="https://www.viator.com/searchResults/all?text=helicopter&amp;x=1">vi</a>
<a href="https://www.booking.com/hotel/us/bellagio.html">bk</a>
<a href="https://example.com/venue?utm_source=uvw">venue</a></div>`;

// 1. Blank config is a byte-for-byte no-op
const off = createAffiliateEngine({});
assert.equal(off.isActive(), false);
assert.equal(off.processHtml(sample), sample);
assert.equal(off.hotelSearchUrl("Las Vegas"), "");
assert.equal(off.stay22MapSrc(), "");

// 2. Amazon + Viator tagging, rel merge, note injection, idempotence
const on = createAffiliateEngine({ AMAZON_TAG: "uvw-20", VIATOR_PID: "P0001", VIATOR_MCID: "42383" });
const out = on.processHtml(sample);
assert.match(out, /amazon\.com\/s\?k=veil\+clips&amp;tag=uvw-20|amazon\.com\/s\?k=veil%20clips&amp;tag=uvw-20/);
assert.match(out, /viator\.com\/searchResults\/all\?text=helicopter&amp;x=1&amp;pid=P0001&amp;mcid=42383&amp;medium=link/);
assert.match(out, /<a href="https:\/\/www\.viator\.com[^>]*rel="sponsored nofollow noopener"/);
assert.ok(out.includes('<p class="aff-note">'));
assert.ok(out.includes('href="https://example.com/venue?utm_source=uvw"'), "non-affiliate link untouched");
assert.ok(!/booking\.com[^"]*"[^>]*sponsored/.test(out), "booking not tagged without a hotel program");
assert.equal(on.processHtml(out), out, "idempotent");
assert.equal((out.match(/tag=uvw-20/g) || []).length, 1, "tag added once");

// 3. Existing tag is never overwritten
assert.ok(on.tagUrl("https://www.amazon.com/dp/B000?tag=other-20").url.includes("tag=other-20"));
assert.equal(on.tagUrl("https://www.amazon.com/dp/B000?tag=other-20").affiliate, false);

// 4. Hotels: Stay22 routes raw OTA links and builds search links
const st = createAffiliateEngine({ STAY22_AID: "abc123" });
assert.equal(st.hotelProvider, "stay22");
assert.match(st.hotelSearchUrl("Las Vegas Strip"), /^https:\/\/www\.stay22\.com\/allez\/roam\?aid=abc123&address=Las%20Vegas%20Strip/);
assert.match(st.tagUrl("https://www.booking.com/hotel/us/x.html").url, /^https:\/\/www\.stay22\.com\/allez\/booking\?aid=abc123&campaign=uvw&link=https%3A%2F%2Fwww\.booking\.com/);
assert.match(st.stay22MapSrc("Fremont Street"), /embed\/gm\?aid=abc123&address=Fremont%20Street/);
assert.ok(st.processHtml('<main id="main"><p>hi</p>').includes("aff-note") === false, "no note when no affiliate links");
assert.ok(st.processHtml('<div class="prose"><iframe src="https://www.stay22.com/embed/gm?aid=abc123"></iframe>').includes("aff-note"), "map alone triggers note");

// 5. Booking (CJ) template
const bk = createAffiliateEngine({ BOOKING_LINK_TEMPLATE: "https://www.anrdoezrs.net/click-1-2?url={urlenc}" });
assert.equal(bk.hotelProvider, "booking");
assert.match(bk.hotelSearchUrl("Las Vegas"), /^https:\/\/www\.anrdoezrs\.net\/click-1-2\?url=https%3A%2F%2Fwww\.booking\.com%2Fsearchresults\.html%3Fss%3DLas%2520Vegas/);
const o2 = bk.processHtml('<div class="prose"><a data-aff="1" class="aff" href="' + bk.hotelSearchUrl("Las Vegas").replace(/&/g, "&amp;") + '">x</a></div>');
assert.ok(/rel="sponsored nofollow noopener"/.test(o2) && o2.includes("aff-note"));

console.log("affiliate engine: all checks passed");
