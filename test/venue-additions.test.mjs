import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { venues } from "../src/data/venues.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const finderCtx = {};
vm.runInNewContext(fs.readFileSync(path.join(root, "src/assets/js/wedding-finder.js"), "utf8"), { globalThis: finderCtx });
const F = finderCtx.UVWFinder;
const budgetCtx = {};
vm.runInNewContext(fs.readFileSync(path.join(root, "src/assets/js/budget-calc.js"), "utf8"), { globalThis: budgetCtx });
const B = budgetCtx.UVWBudget;

const ADDED = [
  "love-it-loud-rock-roll-chapel",
  "dennys-wedding-chapel",
  "brooklyn-bowl-las-vegas",
  "keep-memory-alive-event-center",
  "lakeside-weddings-events",
  "minus5-icebar",
];

function bySlug(slug) {
  return venues.find((v) => v.slug === slug);
}

test("the six new listings exist once, stay unpartnered, and never use a zero price", () => {
  assert.equal(venues.length, 111);
  const slugs = venues.map((v) => v.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of ADDED) assert.equal(slugs.filter((s) => s === slug).length, 1);
  for (const venue of venues) {
    assert.notEqual(venue.priceFrom, 0);
    assert.equal(venue.status, "listed");
    if (venue.priceFrom != null) assert.ok(venue.priceFrom > 0);
  }
  assert.equal(venues.filter((v) => v.offers === "reception").map((v) => v.slug).join(","), "minus5-icebar");
});

test("priced chapels keep the fee and inclusion labels, and quote venues stay unknown", () => {
  const kiss = bySlug("love-it-loud-rock-roll-chapel");
  assert.equal(kiss.priceFrom, 299);
  assert.equal(kiss.guestMax, null);
  assert.match(kiss.priceLabel, /18% service fee/);
  assert.match(kiss.priceLabel, /traditional minister/);
  assert.match(kiss.facts.join(" "), /\$649/);
  assert.match(kiss.facts.join(" "), /impersonators/);

  const dennys = bySlug("dennys-wedding-chapel");
  assert.equal(dennys.priceFrom, 199);
  assert.equal(dennys.guestMax, null);
  assert.match(dennys.priceLabel, /Original Grand Slams/);
  assert.match(dennys.facts.join(" "), /does not say an officiant is included/);

  for (const slug of ["brooklyn-bowl-las-vegas", "keep-memory-alive-event-center", "lakeside-weddings-events", "minus5-icebar"]) {
    const venue = bySlug(slug);
    assert.equal(venue.priceFrom, null);
    assert.equal(venue.guestMax, null);
  }
  assert.match(bySlug("lakeside-weddings-events").facts.join(" "), /minister is paid separately/);
  assert.match(bySlug("brooklyn-bowl-las-vegas").facts.join(" "), /does not publish one wedding capacity/);
  assert.match(bySlug("minus5-icebar").bestFor, /Not a confirmed ceremony site/);
});

test("a missing price is not treated as zero dollars", () => {
  const fit = B.guestFit({ price: null, guests: null, label: "Reception quote" }, 40);
  assert.equal(fit.price, null);
  assert.ok(fit.flags.includes("no-price"));
  const zero = B.guestFit({ price: 0, guests: null, label: "" }, 40);
  assert.equal(zero.price, null);
  assert.ok(zero.flags.includes("no-price"));
  const blank = B.calculate({ copies: 1, packageAmount: null });
  assert.equal(blank.package, 0);
  assert.equal(blank.youPay, 122);
  const zeroAmount = B.calculate({ copies: 1, packageAmount: 0 });
  assert.equal(zeroAmount.package, 0);
  assert.equal(zeroAmount.youPay, 122);
});

test("a reception-only venue is never a finder ceremony match or alternative", () => {
  const ice = {
    slug: "minus5-icebar", name: "minus5 ICEBAR", category: "quirky-pop-culture",
    setting: "Indoor", priceFrom: null, priceLabel: "Reception quote", guestMax: null,
    ceremony: false, checked: "2026-11-08",
  };
  const pool = venues.map((v) => ({
    slug: v.slug, name: v.name, category: v.category, setting: v.setting || "",
    priceFrom: v.priceFrom, priceLabel: v.priceLabel || "", guestMax: v.guestMax,
    checked: v.checked || "", ceremony: v.offers === "reception" ? false : true,
  }));
  const answers = { place: "quirky", setting: "indoor", guests: "unsure", ceremony: "modest", pace: "unsure", touch: "food" };
  const result = F.buildResults("together", answers, null, pool);
  const cards = result.concepts.flatMap((c) => c.fits.concat(c.alternatives));
  assert.equal(cards.some((c) => c.slug === "minus5-icebar"), false);
  const judged = F.assess(ice, { style: "quirky", setting: "either", guests: null, price: "quote" });
  assert.equal(judged.fit, false);
  assert.ok(judged.gaps.some((gap) => /Reception only/i.test(gap)));
});

test("the public templates keep reception-only wording out of the ceremony defaults", () => {
  const build = fs.readFileSync(path.join(root, "build.mjs"), "utf8");
  const finder = fs.readFileSync(path.join(root, "src/assets/js/wedding-finder.js"), "utf8");
  const budget = fs.readFileSync(path.join(root, "src/assets/js/budget-ui.js"), "utf8");
  assert.match(build, /Reception only/);
  assert.match(build, /reception only\)/);
  assert.match(build, /hostsCeremony/);
  assert.match(build, /filter\(hostsCeremony\)/);
  assert.match(finder, /venue\.ceremony !== false/);
  assert.match(finder, /Reception only/);
  assert.match(budget, /not a confirmed place to say the vows/);
  assert.match(budget, /v\.ceremony !== false && v\.price > 0/);
  const directory = fs.readFileSync(path.join(root, "src/assets/js/main.js"), "utf8");
  assert.match(directory, /Reception only/);
  assert.match(directory, /data-ceremony/);
});
