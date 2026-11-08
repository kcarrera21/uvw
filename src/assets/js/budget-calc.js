/* True-cost budget math and venue-listing notes.
   Pure functions: same results in the browser and in node:test.
   Exposes globalThis.UVWBudget.
   County fee amounts are Clark County's published figures used across this site.
   Every other amount is the couple's own entry. Invalid numbers count as zero. */
(function (root) {
  var CONFIRMED = {
    license: 102,
    copy: 20,
    copyCardRate: 0.02,
    copyCardFlat: 1.25,
    civil: 77.75,
    apostille: 20
  };
  var MONEY_CAP = 10000000;
  var COUNT_CAP = 100000;
  var COPY_CAP = 100;
  var PERCENT_CAP = 100;
  var SPLIT_PERCENT_CAP = 1000;
  var SPLIT_DEFAULTS = [
    ["Venue & ceremony package", 35],
    ["Photography & video", 18],
    ["Attire, hair & makeup", 12],
    ["Reception food & drink", 15],
    ["Flowers & decor", 6],
    ["Travel & rooms", 8],
    ["License, certified copies & fees", 2],
    ["Buffer (you'll use it)", 4]
  ];

  function roundCents(n) {
    if (!Number.isFinite(n)) return 0;
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }

  function formatMoney(n) {
    if (!Number.isFinite(n)) return "$0";
    var rounded = roundCents(n);
    var cents = Math.abs(Math.round(rounded * 100) % 100);
    return "$" + rounded.toLocaleString("en-US", {
      minimumFractionDigits: cents ? 2 : 0,
      maximumFractionDigits: 2
    });
  }

  function parseMoney(v) {
    if (v == null || String(v).trim() === "") return { ok: true, empty: true, value: 0, capped: false };
    var s = String(v).trim().replace(/[$,\s]/g, "");
    if (!/^\d+\.?\d*$/.test(s)) return { ok: false, empty: false, value: 0, capped: false };
    var n = Number(s);
    if (!Number.isFinite(n) || n < 0) return { ok: false, empty: false, value: 0, capped: false };
    if (n > MONEY_CAP) return { ok: true, empty: false, value: MONEY_CAP, capped: true };
    return { ok: true, empty: false, value: roundCents(n), capped: false };
  }

  function parseCount(v, max) {
    var cap = max == null ? COUNT_CAP : max;
    if (v == null || String(v).trim() === "") return { ok: true, empty: true, value: 0, capped: false };
    var s = String(v).trim().replace(/[,\s]/g, "");
    if (!/^\d+$/.test(s)) return { ok: false, empty: false, value: 0, capped: false };
    var n = Number(s);
    if (!Number.isFinite(n) || n < 0) return { ok: false, empty: false, value: 0, capped: false };
    if (n > cap) return { ok: true, empty: false, value: cap, capped: true };
    return { ok: true, empty: false, value: n, capped: false };
  }

  function parsePercent(v, max) {
    var cap = max == null ? PERCENT_CAP : max;
    if (v == null || String(v).trim() === "") return { ok: true, empty: true, value: 0, capped: false };
    var s = String(v).trim().replace(/[%\s,]/g, "");
    if (!/^\d+\.?\d*$/.test(s)) return { ok: false, empty: false, value: 0, capped: false };
    var n = Number(s);
    if (!Number.isFinite(n) || n < 0) return { ok: false, empty: false, value: 0, capped: false };
    if (n > cap) return { ok: true, empty: false, value: cap, capped: true };
    return { ok: true, empty: false, value: roundCents(n), capped: false };
  }

  function counted(amount, included) {
    var parsed = parseMoney(amount);
    return { parsed: parsed, value: included ? 0 : parsed.value };
  }

  function sum() {
    var n = 0;
    for (var i = 0; i < arguments.length; i++) n += arguments[i] || 0;
    return roundCents(n);
  }

  function calculate(input) {
    input = input || {};
    var guests = parseCount(input.guests, COUNT_CAP);
    var copies = parseCount(input.copies, COPY_CAP);
    var licenseOn = input.license !== false && input.license !== 0 && input.license !== "0";
    var license = licenseOn ? CONFIRMED.license : 0;
    var copyCost = roundCents(copies.value * CONFIRMED.copy);
    var cardOn = !!input.copyCard && copies.value > 0;
    var cardFee = cardOn ? roundCents(copyCost * CONFIRMED.copyCardRate + CONFIRMED.copyCardFlat) : 0;
    var civil = input.civil ? CONFIRMED.civil : 0;
    var apostille = input.apostille ? CONFIRMED.apostille : 0;
    var confirmed = sum(license, copyCost, cardFee, civil, apostille);

    var packageLine = counted(input.packageAmount, false);
    var extras = counted(input.extras, false);
    var photo = counted(input.photo, !!input.photoIncluded);
    var photoPermit = counted(input.photoPermit, false);
    var transport = counted(input.transport, !!input.transportIncluded);
    var tips = counted(input.tips, !!input.tipsIncluded);
    var taxes = counted(input.taxes, !!input.taxesIncluded);
    var attire = counted(input.attire, false);
    var flowers = counted(input.flowers, !!input.flowersIncluded);
    var reception = counted(input.reception, !!input.receptionIncluded);
    var perGuest = parseMoney(input.perGuest);
    var perGuestTotal = input.perGuestIncluded ? 0 : roundCents(perGuest.value * guests.value);

    var estimate = sum(
      packageLine.value, extras.value, photo.value, photoPermit.value, transport.value,
      tips.value, taxes.value, attire.value, flowers.value, reception.value, perGuestTotal
    );
    var cushionPct = parsePercent(input.cushionPct, PERCENT_CAP);
    var cushion = roundCents(estimate * cushionPct.value / 100);

    var guestTravelEach = parseMoney(input.guestTravelEach);
    var guestOtherEach = parseMoney(input.guestOtherEach);
    var guestTravel = roundCents(guestTravelEach.value * guests.value);
    var guestOther = roundCents(guestOtherEach.value * guests.value);
    var guestCosts = sum(guestTravel, guestOther);
    var payGuestCosts = !!input.payGuestCosts && guestCosts > 0;
    var youPay = sum(confirmed, estimate, cushion, payGuestCosts ? guestCosts : 0);

    var invalid = [guests, copies, packageLine.parsed, extras.parsed, photo.parsed, photoPermit.parsed,
      transport.parsed, tips.parsed, taxes.parsed, attire.parsed, flowers.parsed, reception.parsed,
      perGuest, cushionPct, guestTravelEach, guestOtherEach].some(function (p) { return p && p.ok === false; });
    var capped = [guests, copies, packageLine.parsed, extras.parsed, photo.parsed, photoPermit.parsed,
      transport.parsed, tips.parsed, taxes.parsed, attire.parsed, flowers.parsed, reception.parsed,
      perGuest, cushionPct, guestTravelEach, guestOtherEach].some(function (p) { return p && p.capped; });

    var warnings = [];
    if (civil > 0 && packageLine.value > 0) warnings.push("civil-and-package");
    if (invalid) warnings.push("invalid-ignored");
    if (capped) warnings.push("capped");

    return {
      guests: guests.value,
      copies: copies.value,
      license: license,
      copyCost: copyCost,
      cardFee: cardFee,
      civil: civil,
      apostille: apostille,
      confirmed: confirmed,
      package: packageLine.value,
      extras: extras.value,
      photo: photo.value,
      photoPermit: photoPermit.value,
      transport: transport.value,
      tips: tips.value,
      taxes: taxes.value,
      attire: attire.value,
      flowers: flowers.value,
      reception: reception.value,
      perGuestTotal: perGuestTotal,
      estimate: estimate,
      cushionPct: cushionPct.value,
      cushion: cushion,
      guestTravel: guestTravel,
      guestOther: guestOther,
      guestCosts: guestCosts,
      payGuestCosts: payGuestCosts,
      youPay: youPay,
      guestsPay: payGuestCosts ? 0 : guestCosts,
      warnings: warnings
    };
  }

  function splitBudget(total, percents) {
    var t = parseMoney(total).value;
    var rows = (percents || []).map(function (p) {
      var pct = parsePercent(p, SPLIT_PERCENT_CAP).value;
      var dollars = Math.round(t * pct / 100);
      if (!Number.isFinite(dollars) || dollars < 0) dollars = 0;
      return { pct: pct, dollars: dollars };
    });
    var used = roundCents(rows.reduce(function (s, r) { return s + r.pct; }, 0));
    return {
      total: t,
      rows: rows,
      used: used,
      balanced: Math.abs(used - 100) < 0.001,
      dollars: rows.reduce(function (s, r) { return s + r.dollars; }, 0)
    };
  }

  function sourceSentences(facts, tips) {
    var items = [].concat(facts || [], tips || []);
    var out = [];
    items.forEach(function (item) {
      var text = String(item || "").replace(/\s+/g, " ").trim();
      if (!text) return;
      text = text.replace(/\b([AaPp])\.m\./g, function (_, ap) { return ap.toLowerCase() + "~m~"; });
      text.split(/(?<=[.!?])\s+/).forEach(function (part) {
        var s = part.trim().replace(/([ap])~m~/g, "$1.m.");
        if (s) out.push(s);
      });
    });
    return out;
  }

  function mentionsPhoto(s) {
    return /photographers?\b|photography\b|portraits?\b/i.test(s);
  }

  function photoIsIncluded(s) {
    if (!mentionsPhoto(s)) return false;
    if (/(?:not included|don'?t include|does(?:n'?t| not) include|do not include|neither is included|bring your own)/i.test(s)) return false;
    return /(?:includes?|included|cover(?:s|ing)?)[^.]{0,120}photograph|photograph[^.]{0,50}included|with a photographer/i.test(s);
  }

  function photoPermitLimit(s) {
    if (!mentionsPhoto(s) || !/permit/i.test(s)) return false;
    if (/(?:includes?|included|cover(?:s|ing)?)[^.]{0,120}permit/i.test(s)) return false;
    return /need|require|film permit|commercial permit|permit fee/i.test(s);
  }

  function dedupe(list) {
    var seen = {};
    var out = [];
    list.forEach(function (s) {
      if (!s || seen[s]) return;
      seen[s] = true;
      out.push(s);
    });
    return out;
  }

  function classifyPhoto(sentences) {
    var quotes = sentences.filter(function (s) {
      return mentionsPhoto(s) || /no dslrs?|no tripods?|phone cameras only|only phone cameras/i.test(s);
    });
    var yes = [], no = [], limited = [];
    quotes.forEach(function (s) {
      if (/no outside photographer|outside photographers? (?:are |is )?not|photographers? (?:are |is )?not allowed|can(?:not|'t) bring [^.]{0,40}photographer|house photographer only|only (?:our |the )?(?:house |in-house )?photographer/i.test(s)) no.push(s);
      else if (/bring your own [^.]{0,60}photographer|your own photographer|photographer at no extra|(?:does(?:n'?t| not)|don'?t|do not) include [^.]{0,140}photographer|photographer (?:is |are )?not included/i.test(s)) yes.push(s);
      else if (/no dslrs?|no tripods?|phone cameras only|only phone cameras/i.test(s) || photoPermitLimit(s)) limited.push(s);
    });
    var included = quotes.some(photoIsIncluded);
    var fit = "unknown";
    if (yes.length && no.length) fit = "mixed";
    else if (no.length) fit = "no";
    else if (yes.length) fit = "yes";
    else if (limited.length) fit = "limited";
    var show = dedupe([].concat(no, yes, limited));
    if (!show.length) show = quotes.slice(0, 2);
    if (included) show = dedupe(quotes.filter(photoIsIncluded).concat(show)).slice(0, 3);
    return { fit: fit, quotes: show, included: included };
  }

  function classifyAccess(sentences) {
    var quotes = sentences.filter(function (s) { return /wheelchair|step-free|\bADA\b/i.test(s); });
    var yes = [], no = [], limited = [];
    quotes.forEach(function (s) {
      if (/not wheelchair|no wheelchair|not accessible to (?:a )?wheelchair/i.test(s)) no.push(s);
      else if (/(?:is|are) wheelchair accessible|fully accessible|step-free|ADA accessible|ADA-compliant/i.test(s)) yes.push(s);
      else limited.push(s);
    });
    var fit = "unknown";
    if (yes.length && no.length) fit = "mixed";
    else if (no.length) fit = "no";
    else if (yes.length) fit = "yes";
    else if (limited.length) fit = "limited";
    return { fit: fit, quotes: dedupe(quotes) };
  }

  function classifyPrivacy(sentences) {
    var quotes = sentences.filter(function (s) { return /privacy|closed to the public|open to the public|tour groups|working attraction|\bbuyout\b|exclusive use/i.test(s); });
    var yes = [], no = [], limited = [];
    quotes.forEach(function (s) {
      var negatedExclusive = /(?:does(?:n'?t| not)|don'?t|do not|won'?t|will not)[^.]{0,50}exclusive use|no exclusive use/i.test(s);
      var closed = /isn'?t open to the public|not open to the public|closed to the public/i.test(s);
      var exclusive = /\bexclusive use\b/i.test(s) && !negatedExclusive;
      if (closed || exclusive) yes.push(s);
      else if (negatedExclusive) no.push(s);
      else limited.push(s);
    });
    var fit = "unknown";
    if (yes.length && no.length) fit = "mixed";
    else if (no.length) fit = "no";
    else if (yes.length) fit = "yes";
    else if (limited.length) fit = "limited";
    return { fit: fit, quotes: dedupe(quotes).slice(0, 3) };
  }

  function classifyMusic(sentences) {
    var quotes = sentences.filter(function (s) { return /music curfew|no music|music unless|instruments and music|amplified music|no amplified|quiet hours|sound curfew/i.test(s); });
    var yes = [], no = [], limited = [];
    quotes.forEach(function (s) {
      if (/unless|authoriz|approval|curfew|quiet hours/i.test(s)) limited.push(s);
      else if (/music is not (?:allowed|permitted)|no music|no amplified/i.test(s)) no.push(s);
      else if (/amplified music is (?:allowed|welcome)|you (?:can|may) (?:have|bring) (?:a )?dj/i.test(s)) yes.push(s);
      else limited.push(s);
    });
    var fit = "unknown";
    if (yes.length && no.length) fit = "mixed";
    else if (no.length) fit = "no";
    else if (yes.length) fit = "yes";
    else if (limited.length) fit = "limited";
    return { fit: fit, quotes: dedupe(quotes) };
  }

  function moneyNotes(sentences, used) {
    var re = /service charge|gratuity|\btips?\b|\btax(?:es)?\b|not included|don'?t include|does(?:n'?t| not) include|minimum|\+\+|per person|per guest|leave out|on top|come on top/i;
    return sentences.filter(function (s) { return re.test(s) && used.indexOf(s) === -1; }).slice(0, 4);
  }

  function includedGuestCap(sentences) {
    var cap = null;
    var quote = "";
    sentences.forEach(function (s) {
      var m = s.match(/up to (\d[\d,]*) guests included/i);
      if (!m) return;
      var n = Number(m[1].replace(/,/g, ""));
      if (cap == null || n > cap) { cap = n; quote = s; }
    });
    return { cap: cap, quote: quote };
  }

  function topicNotes(facts, tips) {
    var sentences = sourceSentences(facts, tips);
    var photo = classifyPhoto(sentences);
    var access = classifyAccess(sentences);
    var privacy = classifyPrivacy(sentences);
    var music = classifyMusic(sentences);
    var used = [].concat(photo.quotes, access.quotes, privacy.quotes, music.quotes);
    return {
      photo: photo,
      access: access,
      privacy: privacy,
      music: music,
      money: moneyNotes(sentences, used),
      includedGuests: includedGuestCap(sentences)
    };
  }

  function labelGuestCap(label) {
    var text = String(label || "");
    var m = text.match(/up to (\d[\d,]*) guests/i);
    if (m) return Number(m[1].replace(/,/g, ""));
    if (/couple only|for two|dinner for two|just the two/i.test(text)) return 2;
    if (/\belopement\b/i.test(text)) return 2;
    return null;
  }

  function guestFit(info, guests) {
    info = info || {};
    var count = parseCount(guests, COUNT_CAP);
    var n = count.value;
    var max = info.guests == null || info.guests === "" ? null : Number(info.guests);
    if (!Number.isFinite(max) || max <= 0) max = null;
    var capacity = "unknown";
    if (!count.ok) capacity = "unknown";
    else if (n <= 0) capacity = "need-count";
    else if (max == null) capacity = "unknown";
    else capacity = n > max ? "over" : "within";
    var price = info.price == null || info.price === "" ? null : Number(info.price);
    if (!Number.isFinite(price) || price <= 0) price = null;
    var labelCap = labelGuestCap(info.label);
    var includedCap = info.includedCap == null ? null : Number(info.includedCap);
    if (!Number.isFinite(includedCap) || includedCap <= 0) includedCap = null;
    var flags = [];
    if (price == null) flags.push("no-price");
    else flags.push("from-price");
    if (n > 0 && labelCap != null && n > labelCap) flags.push("label-smaller");
    if (n > 0 && includedCap != null && n > includedCap) flags.push("included-cap");
    return {
      guests: n,
      capacity: capacity,
      max: max,
      price: price,
      label: info.label || "",
      checked: info.checked || "",
      labelCap: labelCap,
      includedCap: includedCap,
      includedQuote: info.includedQuote || "",
      flags: flags
    };
  }

  root.UVWBudget = {
    CONFIRMED: CONFIRMED,
    SPLIT_DEFAULTS: SPLIT_DEFAULTS,
    parseMoney: parseMoney,
    parseCount: parseCount,
    parsePercent: parsePercent,
    formatMoney: formatMoney,
    calculate: calculate,
    splitBudget: splitBudget,
    topicNotes: topicNotes,
    guestFit: guestFit,
    sourceSentences: sourceSentences
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
