import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { venues as raw } from "../src/data/venues.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ctx = {};
vm.runInNewContext(fs.readFileSync(path.join(root, "src/assets/js/wedding-finder.js"), "utf8"), { globalThis: ctx });
const F = ctx.UVWFinder;
const venues = raw.map((v) => ({
  slug: v.slug, name: v.name, category: v.category, setting: v.setting || "",
  priceFrom: v.priceFrom, priceLabel: v.priceLabel || "", guestMax: v.guestMax, checked: v.checked || ""
}));

function answers(over) {
  return Object.assign({
    place: "unsure", setting: "either", guests: "unsure", ceremony: "unsure", pace: "unsure", touch: "unsure"
  }, over);
}

test("two partners who agree get a shared desert idea and real modest outdoor matches", () => {
  const shared = answers({ place: "desert", setting: "outdoor", guests: "handful", ceremony: "modest", touch: "quiet" });
  const result = F.buildResults("separate", shared, shared, venues);
  assert.equal(result.concepts[0].id, "desert");
  assert.match(result.concepts[0].why, /both/i);
  assert.ok(result.concepts[0].fits.length > 0);
  for (const card of result.concepts[0].fits) {
    const venue = venues.find((v) => v.slug === card.slug);
    assert.equal(venue.category, "desert-outdoors");
    assert.ok(venue.priceFrom != null && venue.priceFrom < 1000);
    assert.ok(venue.guestMax >= 10);
    assert.match(venue.setting, /outdoor/i);
    assert.equal(card.fit, true);
    assert.equal(card.gaps.length, 0);
    assert.equal(card.url, "/venues/" + card.slug + "/");
  }
  assert.equal(JSON.stringify(result), JSON.stringify(F.buildResults("separate", shared, shared, venues)));
});

test("disagreement keeps both directions and names the difference", () => {
  const a = answers({ place: "chapel", touch: "simple", ceremony: "modest" });
  const b = answers({ place: "quirky", touch: "surprise", ceremony: "higher" });
  const result = F.buildResults("separate", a, b, venues);
  const ids = result.concepts.map((c) => c.id);
  assert.ok(ids.includes("chapel"));
  assert.ok(ids.includes("quirky"));
  assert.equal(new Set(ids).size, 3);
  assert.ok(result.differences.some((line) => /Partner 1/.test(line) && /Partner 2/.test(line)));
  const chapel = result.concepts.find((c) => c.id === "chapel");
  const quirky = result.concepts.find((c) => c.id === "quirky");
  assert.match(chapel.why + quirky.why, /Partner 1/);
  assert.match(chapel.why + quirky.why, /Partner 2/);
});

test("answering together does not invent two partners", () => {
  const shared = answers({ place: "sky", setting: "either", touch: "photos" });
  const result = F.buildResults("together", shared, null, venues);
  const blob = JSON.stringify(result);
  assert.equal(blob.includes("Partner 1"), false);
  assert.equal(blob.includes("Partner 2"), false);
  assert.match(result.concepts[0].why, /together/i);
  assert.equal(result.concepts[0].id, "sky");
});

test("all unsure stays flexible and still offers three different ideas", () => {
  const open = answers({});
  const result = F.buildResults("separate", open, open, venues);
  assert.equal(result.concepts.map((c) => c.id).join(","), "desert,quirky,chapel");
  assert.match(result.concepts[0].why, /starting points/);
  const togetherOpen = F.buildResults("together", open, null, venues);
  assert.match(togetherOpen.concepts[0].why, /starting points/);
  assert.equal(JSON.stringify(togetherOpen).includes("Partner 1"), false);
  assert.equal(result.differences.length, 0);
});

test("a crowd does not get a perfect chapel match, and unknown capacity is not called a fit", () => {
  const a = answers({ place: "chapel", guests: "crowd", ceremony: "higher", setting: "indoor" });
  const result = F.buildResults("together", a, null, venues);
  const chapel = result.concepts.find((c) => c.id === "chapel");
  assert.equal(chapel.fits.length, 0);
  const unknown = venues.find((v) => v.category === "classic-chapels" && v.guestMax == null);
  const judged = F.assess(unknown, { style: "chapel", setting: "either", guests: 100, price: "flexible" });
  assert.equal(judged.fit, false);
  assert.ok(judged.gaps.some((gap) => /not published/i.test(gap)));
  assert.match(chapel.noneMessage, /not matches/i);
  assert.ok(chapel.alternatives.length > 0);
  for (const card of chapel.alternatives) {
    assert.equal(card.fit, false);
    assert.ok(card.gaps.length > 0);
    const venue = venues.find((v) => v.slug === card.slug);
    const unknownCalledFit = venue.guestMax == null && card.fit;
    assert.equal(unknownCalledFit, false);
  }
  const everyFit = result.concepts.flatMap((c) => c.fits);
  for (const card of everyFit) {
    const venue = venues.find((v) => v.slug === card.slug);
    if (card.guestMax == null) assert.fail("unknown capacity labeled as a fit: " + card.slug);
    assert.ok(venue.guestMax >= 100);
  }
});

test("a missing price is never called a match, even when a quote is fine", () => {
  const unknown = venues.find((v) => v.priceFrom == null);
  const style = Object.keys(F.STYLES).find((id) => F.STYLES[id].cat === unknown.category);
  const judged = F.assess(unknown, { style: style, setting: "either", guests: null, price: "quote" });
  assert.equal(judged.fit, false);
  assert.ok(judged.gaps.some((gap) => /not a confirmed price match/i.test(gap)));
});

test("the copied summary keeps both partners and does not invent a wedding total", () => {
  const a = answers({ place: "desert", ceremony: "modest", guests: "handful" });
  const b = answers({ place: "chapel", ceremony: "higher", guests: "party" });
  const result = F.buildResults("separate", a, b, venues);
  const text = F.plainSummary(result);
  assert.match(text, /Partner 1/);
  assert.match(text, /Partner 2/);
  assert.match(text, /not the cost of the whole day/);
  for (const concept of result.concepts) {
    assert.equal(concept.plannerUrl.includes("?"), false);
    for (const card of concept.fits.concat(concept.alternatives)) {
      assert.equal(card.plannerUrl, "/tools/budget-planner/?venue=" + card.slug);
      assert.equal(/guests=|ceremony=|budget=/.test(card.plannerUrl), false);
    }
  }
});

test("indoor and outdoor disagreement is named and not forced into one setting", () => {
  const a = answers({ place: "desert", setting: "indoor" });
  const b = answers({ place: "desert", setting: "outdoor" });
  const result = F.buildResults("separate", a, b, venues);
  assert.ok(result.differences.some((line) => /Indoors or outdoors/.test(line)));
  const shared = result.concepts[0];
  assert.equal(shared.setting, "either");
});
