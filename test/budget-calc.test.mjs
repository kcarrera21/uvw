import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { venues } from "../src/data/venues.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ctx = {};
vm.runInNewContext(fs.readFileSync(path.join(root, "src/assets/js/budget-calc.js"), "utf8"), { globalThis: ctx });
const B = ctx.UVWBudget;

test("default county fees are the published license and one copy, with estimates at zero", () => {
  const r = B.calculate({ copies: 1 });
  assert.equal(r.license, 102);
  assert.equal(r.copyCost, 20);
  assert.equal(r.cardFee, 0);
  assert.equal(r.civil, 0);
  assert.equal(r.apostille, 0);
  assert.equal(r.confirmed, 122);
  assert.equal(r.estimate, 0);
  assert.equal(r.cushion, 0);
  assert.equal(r.youPay, 122);
  assert.equal(r.guestsPay, 0);
});

test("card fee is 2% plus $1.25 once per order, and only when copies are ordered", () => {
  const two = B.calculate({ copies: 2, copyCard: true, license: false });
  assert.equal(two.copyCost, 40);
  assert.equal(two.cardFee, 2.05);
  assert.equal(two.confirmed, 42.05);
  const three = B.calculate({ copies: 3, copyCard: true, license: false });
  assert.equal(three.cardFee, 2.45);
  const none = B.calculate({ copies: 0, copyCard: true, license: false });
  assert.equal(none.cardFee, 0);
  assert.equal(none.confirmed, 0);
});

test("optional county ceremony and apostille are added once, at the published amounts", () => {
  const r = B.calculate({ copies: 0, civil: true, apostille: true });
  assert.equal(r.civil, 77.75);
  assert.equal(r.apostille, 20);
  assert.equal(r.confirmed, 102 + 77.75 + 20);
});

test("package inclusions are not added again", () => {
  const shared = {
    copies: 0,
    license: false,
    packageAmount: 2700,
    photo: 800,
    transport: 200,
    taxes: 500,
    tips: 300,
    flowers: 150,
    reception: 1000,
    perGuest: 75,
    guests: 5,
    guestTravelEach: 400,
    cushionPct: 0
  };
  const doubled = B.calculate(shared);
  assert.equal(doubled.estimate, 2700 + 800 + 200 + 500 + 300 + 150 + 1000 + 375);
  const once = B.calculate(Object.assign({}, shared, {
    photoIncluded: true,
    transportIncluded: true,
    taxesIncluded: true,
    tipsIncluded: true,
    flowersIncluded: true
  }));
  assert.equal(once.photo, 0);
  assert.equal(once.transport, 0);
  assert.equal(once.taxes, 0);
  assert.equal(once.tips, 0);
  assert.equal(once.flowers, 0);
  assert.equal(once.reception, 1000);
  assert.equal(once.perGuestTotal, 375);
  assert.equal(once.estimate, 2700 + 1000 + 375);
  assert.equal(once.guestCosts, 2000);
  assert.equal(once.youPay, once.estimate);
  assert.equal(once.guestsPay, 2000);
  assert.ok(once.youPay < doubled.youPay);
});

test("per-guest charges already in the package are not multiplied again", () => {
  const r = B.calculate({
    copies: 0, license: false, perGuest: 75, perGuestIncluded: true, guests: 5
  });
  assert.equal(r.perGuestTotal, 0);
  assert.equal(r.youPay, 0);
});

test("guest travel stays out of the couple total unless the couple is paying it, and then only once", () => {
  const base = { copies: 0, license: false, packageAmount: 1000, guests: 4, guestTravelEach: 200, guestOtherEach: 50 };
  const separate = B.calculate(base);
  assert.equal(separate.youPay, 1000);
  assert.equal(separate.guestsPay, 1000);
  assert.equal(separate.guestCosts, 1000);
  const covered = B.calculate(Object.assign({ payGuestCosts: true }, base));
  assert.equal(covered.youPay, 2000);
  assert.equal(covered.guestsPay, 0);
  assert.equal(covered.payGuestCosts, true);
});

test("a cushion is a percent of estimate lines only, not county fees, guest travel, or itself", () => {
  const r = B.calculate({
    copies: 1,
    packageAmount: 1000,
    cushionPct: 10,
    guests: 2,
    guestTravelEach: 500
  });
  assert.equal(r.confirmed, 122);
  assert.equal(r.estimate, 1000);
  assert.equal(r.cushion, 100);
  assert.equal(r.youPay, 1222);
  assert.equal(r.guestsPay, 1000);
  const empty = B.calculate({ copies: 0, license: false, cushionPct: 10 });
  assert.equal(empty.cushion, 0);
});

test("county ceremony plus a venue package is counted, and flagged so it is not a silent double charge", () => {
  const r = B.calculate({ copies: 0, civil: true, packageAmount: 400 });
  assert.equal(r.civil, 77.75);
  assert.equal(r.package, 400);
  assert.equal(r.youPay, 102 + 77.75 + 400);
  assert.ok(r.warnings.includes("civil-and-package"));
  const chapel = B.calculate({ copies: 0, packageAmount: 400 });
  assert.equal(chapel.warnings.includes("civil-and-package"), false);
});

test("negative, blank, and invalid amounts do not break the total", () => {
  const r = B.calculate({
    copies: "",
    license: false,
    packageAmount: "-50",
    photo: "abc",
    transport: "",
    guests: "-3",
    perGuest: "nope",
    cushionPct: "-10",
    guestTravelEach: "Infinity",
    taxes: null
  });
  assert.equal(r.youPay, 0);
  assert.equal(r.estimate, 0);
  assert.equal(r.guests, 0);
  assert.equal(r.guestCosts, 0);
  assert.ok(Number.isFinite(r.youPay));
  assert.ok(r.warnings.includes("invalid-ignored"));
});

test("currency paste, zero guests, and huge counts stay finite", () => {
  const pasted = B.calculate({
    copies: 0, license: false, packageAmount: "$1,200.50", perGuest: "25", guests: "0"
  });
  assert.equal(pasted.package, 1200.5);
  assert.equal(pasted.perGuestTotal, 0);
  assert.equal(pasted.youPay, 1200.5);
  const huge = B.calculate({
    copies: 0, license: false, perGuest: "10", guests: "100000000000", guestTravelEach: "500"
  });
  assert.equal(huge.guests, 100000);
  assert.equal(huge.perGuestTotal, 1000000);
  assert.equal(huge.guestCosts, 50000000);
  assert.ok(Number.isFinite(huge.youPay));
  assert.ok(huge.warnings.includes("capped"));
  const scientific = B.calculate({ copies: 0, license: false, packageAmount: "1e309", guests: "1e20" });
  assert.equal(scientific.package, 0);
  assert.equal(scientific.guests, 0);
  assert.equal(scientific.youPay, 0);
  assert.ok(Number.isFinite(scientific.youPay));
});

test("photo permit stays separate from an included photographer", () => {
  const r = B.calculate({
    copies: 0, license: false, photo: 600, photoIncluded: true, photoPermit: 50
  });
  assert.equal(r.photo, 0);
  assert.equal(r.photoPermit, 50);
  assert.equal(r.estimate, 50);
});

test("the percentage split still divides a total, and rejects junk", () => {
  const defs = B.SPLIT_DEFAULTS.map((row) => row[1]);
  assert.equal(defs.reduce((s, n) => s + n, 0), 100);
  const ok = B.splitBudget(5000, defs);
  assert.equal(ok.balanced, true);
  assert.equal(ok.dollars, 5000);
  assert.deepEqual([...ok.rows.map((r) => r.dollars)], [1750, 900, 600, 750, 300, 400, 100, 200]);
  const over = B.splitBudget(1000, [60, 60]);
  assert.equal(over.balanced, false);
  assert.equal(over.used, 120);
  assert.equal(over.dollars, 1200);
  const bad = B.splitBudget("-20", ["", "abc", "-5", "1e309"]);
  assert.equal(bad.total, 0);
  assert.ok(bad.rows.every((r) => r.dollars === 0 && r.pct === 0));
  assert.ok(Number.isFinite(bad.used));
});

test("listing notes quote the listing, and stay unknown when it is silent", () => {
  const silent = B.topicNotes(["A garden ceremony with seating for guests."], []);
  for (const key of ["photo", "access", "privacy", "music"]) {
    assert.equal(silent[key].fit, "unknown");
    assert.deepEqual([...silent[key].quotes], []);
  }
  assert.equal(silent.photo.included, false);

  const own = B.topicNotes([
    "Packages don't include an officiant, marriage license filing or a photographer.",
    "Bring your own officiant and photographer. Neither is included."
  ], []);
  assert.equal(own.photo.fit, "yes");
  assert.equal(own.photo.included, false);
  assert.ok(own.photo.quotes.some((q) => q.includes("Bring your own officiant and photographer")));

  const included = B.topicNotes([
    "The elopement package includes your choice of ceremony spots, an officiant, a photographer, and pickup."
  ], []);
  assert.equal(included.photo.fit, "unknown");
  assert.equal(included.photo.included, true);
  assert.equal(included.photo.quotes[0].includes("a photographer"), true);

  const banned = B.topicNotes(["Outside photographers are not allowed on the chapel grounds."], []);
  assert.equal(banned.photo.fit, "no");

  const gear = B.topicNotes(["Phone cameras only during the ceremony. No DSLRs or tripods."], []);
  assert.equal(gear.photo.fit, "limited");

  const music = B.topicNotes(["Park rules: no drones, and no music unless park staff authorize it."], [
    "The music curfew (7 p.m. summer, 4 p.m. winter) shapes your timeline."
  ]);
  assert.equal(music.music.fit, "limited");
  assert.equal(music.music.quotes.length, 2);

  const access = B.topicNotes(["Cars include a wheelchair-accessible car and restroom."], []);
  assert.equal(access.access.fit, "limited");
  assert.equal(access.access.quotes.length, 1);

  const terrace = B.topicNotes(["The private terrace holds 40 guests."], []);
  assert.equal(terrace.privacy.fit, "unknown");
  assert.equal(terrace.privacy.quotes.length, 0);

  const privacy = B.topicNotes(["It's a working attraction, so ask how much privacy your time slot includes."], []);
  assert.equal(privacy.privacy.fit, "limited");

  const closed = B.topicNotes(["The farm isn't open to the public, so book a tour by appointment."], []);
  assert.equal(closed.privacy.fit, "yes");
  const sharedSite = B.topicNotes(["A group use permit doesn't give you exclusive use of a site."], []);
  assert.equal(sharedSite.privacy.fit, "no");
  const covered = B.topicNotes(["Packages cover the photographer, officiant, and the wedding permit."], []);
  assert.equal(covered.photo.fit, "unknown");
  assert.equal(covered.photo.included, true);
  const boots = B.topicNotes(["Boots photograph beautifully here."], []);
  assert.equal(boots.photo.fit, "unknown");
  assert.equal(boots.photo.included, false);
  assert.equal(boots.photo.quotes.length, 0);
  const session = B.topicNotes(["Pair it with a Neon Museum photo session."], []);
  assert.equal(session.photo.quotes.length, 0);
  assert.equal(session.photo.included, false);
});

test("guest count is compared with the published maximum and the advertised package, without inventing a price", () => {
  const within = B.guestFit({ guests: 24, price: 99, label: "Short & Sweet special (legal ceremony, up to 2 guests)", checked: "2026-10-13" }, 10);
  assert.equal(within.capacity, "within");
  assert.ok(within.flags.includes("label-smaller"));
  assert.equal(within.labelCap, 2);
  assert.equal(within.price, 99);

  const over = B.guestFit({ guests: 24, price: 99, label: "Chapel package" }, 30);
  assert.equal(over.capacity, "over");

  const unknown = B.guestFit({ guests: null, price: null, label: "" }, 8);
  assert.equal(unknown.capacity, "unknown");
  assert.ok(unknown.flags.includes("no-price"));

  const need = B.guestFit({ guests: 90, price: 2500, label: "Sweetheart Wedding (daytime)", includedCap: 50, includedQuote: "Up to 50 guests included (benches seat 48–50)." }, 0);
  assert.equal(need.capacity, "need-count");

  const extra = B.guestFit({ guests: 90, price: 2500, label: "Sweetheart Wedding (daytime)", includedCap: 50, includedQuote: "Up to 50 guests included." }, 60);
  assert.equal(extra.capacity, "within");
  assert.ok(extra.flags.includes("included-cap"));
  assert.equal(extra.flags.includes("label-smaller"), false);
});

test("every real listing note is a verbatim sentence, and a silent listing stays unknown", () => {
  const punk = venues.find((v) => v.slug === "punk-rock-museum");
  const punkNotes = B.topicNotes(punk.facts, punk.tips);
  assert.equal(punkNotes.photo.fit, "yes");
  assert.equal(punkNotes.photo.included, false);

  const neon = venues.find((v) => v.slug === "the-neon-museum");
  const neonNotes = B.topicNotes(neon.facts, neon.tips);
  assert.equal(neonNotes.includedGuests.cap, 50);
  assert.match(neonNotes.includedGuests.quote, /Up to 50 guests included/);

  const fort = venues.find((v) => v.slug === "old-las-vegas-mormon-fort");
  assert.equal(B.topicNotes(fort.facts, fort.tips).music.fit, "limited");

  const train = venues.find((v) => v.slug === "nevada-southern-railway-train-charter");
  assert.equal(B.topicNotes(train.facts, train.tips).access.fit, "limited");

  for (const v of venues) {
    const notes = B.topicNotes(v.facts, v.tips);
    const blob = [].concat(v.facts || [], v.tips || []).join(" ");
    for (const key of ["photo", "access", "privacy", "music"]) {
      const topic = notes[key];
      assert.ok(["unknown", "yes", "no", "limited", "mixed"].includes(topic.fit), v.slug + " " + key);
      if (topic.fit !== "unknown") assert.ok(topic.quotes.length > 0, v.slug + " " + key + " fit without a quote");
      for (const quote of topic.quotes) {
        assert.ok(blob.includes(quote), v.slug + " quote not in listing: " + quote);
      }
    }
    for (const quote of notes.money) assert.ok(blob.includes(quote), v.slug + " money quote");
    if (notes.includedGuests.quote) assert.ok(blob.includes(notes.includedGuests.quote));
    if (notes.photo.included) {
      assert.ok(notes.photo.quotes.some((q) => /photograph/i.test(q)));
    }
  }
});

function summaryFor(input, context) {
  const result = B.calculate(input);
  const sheet = B.budgetSheet(input, result, context || { prepared: "November 8, 2026" });
  return { result, sheet, text: B.plainSummary(sheet) };
}

test("a blank planner snapshot is county fees only, not a full wedding total", () => {
  const { result, sheet, text } = summaryFor({ copies: 1 });
  assert.equal(result.youPay, 122);
  assert.equal(sheet.partial, true);
  assert.equal(sheet.headline, "County fees so far");
  assert.equal(sheet.amountText, "$122");
  assert.match(text, /not the full amount you pay/);
  assert.match(text, /Package price: Not entered/);
  assert.match(text, /Who pays guest costs: Not entered/);
  assert.match(text, /https:\/\/uniquevegasweddings\.com\/tools\/budget-planner\//);
  assert.equal(text.includes("?"), false);
});

test("the snapshot matches the calculation, including excluded lines and guest costs", () => {
  const input = {
    copies: 1,
    packageAmount: 2700,
    photo: 800,
    photoIncluded: true,
    reception: 1000,
    perGuest: 25,
    guests: 10,
    guestTravelEach: 250,
    cushionPct: 10,
    civil: true,
    payGuestCosts: false
  };
  const separate = summaryFor(input, { prepared: "November 8, 2026", venueName: "Fish & Chips Chapel", venueChecked: "Oct 13, 2026" });
  assert.equal(separate.sheet.amount, separate.result.youPay);
  assert.equal(separate.sheet.headline, "You pay");
  assert.match(separate.text, new RegExp("You pay: " + separate.sheet.amountText.replace("$", "\\$")));
  assert.match(separate.text, /Photographer: \$800 typed\. Already included, not added\./);
  assert.match(separate.text, /\$25 per guest × 10 = \$250/);
  assert.match(separate.text, /\$250 per guest × 10 = \$2,500/);
  assert.match(separate.text, /Guests pay \$2,500 themselves/);
  assert.match(separate.text, /Courthouse ceremony: \$77\.75/);
  assert.match(separate.text, /10% of the costs you entered/);
  assert.match(separate.text, /Fish & Chips Chapel/);
  assert.match(separate.text, /Listing checked Oct 13, 2026/);
  assert.match(separate.text, /courthouse ceremony and a venue package/);
  assert.match(separate.text, /Amounts you typed are your own estimates/);
  assert.equal(separate.text.includes("?package="), false);

  const coveredInput = Object.assign({}, input, { payGuestCosts: true, civil: false });
  const covered = summaryFor(coveredInput);
  assert.equal(covered.sheet.amount, covered.result.youPay);
  assert.ok(covered.result.youPay > separate.result.youPay - 77.75);
  assert.match(covered.text, /You're paying them, so \$2,500 is inside what you pay/);
  assert.match(covered.text, /guest costs you're covering/);
});

test("mailto keeps currency, ampersands, and unicode, and falls back when the link is too long", () => {
  const body = "You pay: $1,200\nVenue: Fish & Chips Chapel\nNote: café × 2";
  const href = B.mailtoHref({ subject: "Budget & plans", body });
  assert.ok(href.startsWith("mailto:?subject="));
  assert.equal(href.includes("mailto:?subject="), true);
  const query = href.slice("mailto:?".length);
  const params = new URLSearchParams(query);
  assert.equal(params.get("subject"), "Budget & plans");
  assert.equal(params.get("body"), body);
  assert.equal(decodeURIComponent(href).includes("$1,200"), true);
  assert.equal(href.includes("&body="), true);
  assert.equal(href.includes("Fish & Chips"), false);
  const huge = B.mailtoHref({ body: "x".repeat(9000) });
  assert.equal(huge, null);
  const edge = "y".repeat(B.MAILTO_LIMIT);
  assert.equal(B.mailtoHref({ body: edge, limit: 100 }), null);
});
