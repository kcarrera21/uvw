/* Unique Vegas Weddings: plain-language search.
   Runs entirely in the browser against /search-index.json (rebuilt with the site).
   It reads budgets, guest counts, settings, vibes, months and questions.
   No AI service, no tracking, no cost. */
(function () {
  var form = document.querySelector("[data-search-form]");
  var out = document.querySelector("[data-search-out]");
  if (!form || !out) return;
  var input = form.querySelector("input[name=q]");
  var read = document.querySelector("[data-search-read]");
  var IDX = null;

  // ---------- text helpers ----------
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function money(n) { return "$" + Number(n).toLocaleString("en-US"); }
  var STOP = {};
  ("a an the for of in on at to with and or but we i me my our us you your want wants wanted looking look need needs find show give tell something somewhere place places venue venues wedding weddings wed marry married marrying get getting got las vegas is are was be been do does did can could would should will that this it its have has had where what whats when which who why how there any some please like about around really very just also under over below above less more up max min minimum maximum near friendly kind type sort thing things into from by as if than then so not no yes ok hi hello best good great nice ideas idea options option").split(" ").forEach(function (w) { STOP[w] = 1; });
  var SYN = {
    licence: "license", licenses: "license", licences: "license",
    cheapest: "cheap", affordable: "cheap", inexpensive: "cheap", budget: "cheap", lowcost: "cheap",
    price: "cost", prices: "cost", pricing: "cost", priced: "cost", costs: "cost", much: "cost", fee: "cost", fees: "cost", expensive: "cost", pay: "cost",
    civil: "courthouse", court: "courthouse",
    eloping: "elope", elopement: "elope", elopements: "elope", eloped: "elope",
    renew: "renewal", renewing: "renewal", renewals: "renewal",
    witnesses: "witness", permits: "permit",
    photos: "photo", photography: "photo", photographer: "photo", pictures: "photo",
    lgbt: "lgbtq", gay: "lgbtq", queer: "lgbtq",
    abroad: "international", overseas: "international", foreign: "international", uk: "international", england: "international", britain: "international", canada: "international", australia: "international", europe: "international", ireland: "international", mexico: "international", germany: "international", country: "international", countries: "international", home: "international",
    hot: "heat", temperature: "weather", temp: "weather", temps: "weather", rain: "weather", climate: "weather",
    identification: "id", passport: "id", ids: "id",
    heli: "helicopter", chopper: "helicopter", helicopters: "helicopter",
    kids: "family", children: "family",
    views: "view", skyline: "view",
    certificate: "certified", copies: "copy",
    spontaneous: "sameday", quick: "sameday", fast: "sameday", today: "sameday", tonight: "sameday", tomorrow: "sameday",
    themed: "theme", quirky: "quirky", weird: "quirky", unusual: "quirky", offbeat: "quirky",
    luxurious: "luxury", upscale: "luxury", fancy: "luxury", elegant: "luxury",
    gardens: "garden", lakes: "lake", sharks: "shark", dates: "date", guests: "guest",
  };
  function norm(w) {
    if (SYN[w]) return SYN[w];
    if (w.length > 4 && /sses$/.test(w)) w = w.slice(0, -2);
    else if (w.length > 3 && /s$/.test(w) && !/ss$/.test(w)) w = w.slice(0, -1);
    return SYN[w] || w;
  }
  function toks(s, keepStop) {
    return String(s || "").toLowerCase().replace(/same[- ]day/g, "sameday").replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").split(" ").filter(function (w) {
      return w && (keepStop || !STOP[w]);
    }).map(norm);
  }
  function bag(s) { var b = {}; toks(s).forEach(function (t) { b[t] = (b[t] || 0) + 1; }); return b; }

  // ---------- understand the request ----------
  var MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  var SEASONS = { spring: [3, 4, 5], summer: [6, 7, 8], fall: [9, 10, 11], autumn: [9, 10, 11], winter: [12, 1, 2] };
  var CATWORDS = {
    "desert-outdoors": ["desert", "outdoors", "nature", "red rock", "canyon", "park", "lake", "garden", "ranch", "hiking", "mountain", "scenic"],
    "classic-chapels": ["chapel", "elvis", "classic", "traditional", "old school", "church"],
    "historic-iconic": ["neon", "historic", "history", "vintage", "old vegas", "retro", "museum", "ghost town", "western", "iconic"],
    "sky-high": ["view", "tower", "sky", "helicopter", "rooftop", "high up", "observation", "wheel", "thrill", "flying"],
    "quirky-pop-culture": ["quirky", "fun", "theme", "drive thru", "drive through", "shark", "aquarium", "immersive", "art", "funny", "kitsch", "only in vegas", "crazy", "different"],
    "strip-luxury": ["luxury", "resort", "hotel", "fountain", "gondola", "ballroom", "casino", "glamorous"],
  };
  function parse(raw) {
    var q = " " + raw.toLowerCase().replace(/[’']/g, "").replace(/(\d),(\d{3})/g, "$1$2").replace(/\$\s*(\d+(?:\.\d+)?)\s*k\b/g, function (_, n) { return "$" + Math.round(n * 1000); })
      .replace(/\b(\d+(?:\.\d+)?)\s*(?:k|grand)\b/g, function (_, n) { return "$" + Math.round(n * 1000); }).replace(/drive[- ]?through|drive-thru|drivethru/g, "drive thru") + " ";
    var p = { raw: raw, chips: [], cats: [], months: [] };
    var m;
    // guests
    var GW = "(?:guests?|people|persons?|ppl|attendees|friends|seats?|of us)";
    if ((m = q.match(new RegExp("(\\d{1,4})\\s*\\+?\\s*" + GW)))) { p.guests = +m[1]; q = q.replace(m[0], " "); }
    else if ((m = q.match(/(?:party of|group of|guest list of|headcount of)\s+(\d{1,4})/))) { p.guests = +m[1]; q = q.replace(m[0], " "); }
    else if ((m = q.match(/\bfor\s+(?:about\s+|around\s+|roughly\s+)?(\d{1,3})\b(?!\s*(?:\$|dollars|bucks|days?|hours?|hrs?|nights?))/))) { p.guests = +m[1]; q = q.replace(m[0], " "); }
    if (/\b(just (?:us|the two of us)|two of us|only us|no guests)\b/.test(q)) { p.small = true; q = q.replace(/\b(just (?:us|the two of us)|two of us|only us|no guests)\b/, " elope "); }
    if (!p.guests && /\b(big|large|huge)\b/.test(q)) { p.guests = 100; p.guestsWord = true; }
    if (/\b(small|intimate|tiny|micro)\b/.test(q)) p.small = true;
    // budget
    if ((m = q.match(/(?:over|above|more than|at least|starting at|min(?:imum)?(?: of)?)\s*\$?\s*(\d{3,6})/))) { p.min = +m[1]; q = q.replace(m[0], " "); }
    if ((m = q.match(/(?:between|from)\s*\$?\s*(\d{2,6})\s*(?:and|to|-)\s*\$?\s*(\d{3,6})/))) { p.min = +m[1]; p.max = +m[2]; q = q.replace(m[0], " "); }
    else if ((m = q.match(/(?:under|below|less than|max(?:imum)?(?: of)?|up to|no more than|within|at most|cheaper than|budget(?: of| is|:)?|spend(?:ing)?(?: up to| about| around)?|about|around)\s*\$?\s*(\d{2,6})(?:\s*(?:dollars|bucks))?/))) { p.max = +m[1]; q = q.replace(m[0], " "); }
    else if ((m = q.match(/\$\s*(\d{2,6})/))) { p.max = +m[1]; q = q.replace(m[0], " "); }
    else if ((m = q.match(/\b(\d{3,6})\s*(?:dollars|bucks)/))) { p.max = +m[1]; q = q.replace(m[0], " "); }
    if (/\b(cheap|cheapest|affordable|inexpensive|on a budget|low cost|budget)\b/.test(q)) p.cheap = true;
    // setting
    if (/\b(indoors?|inside|air[- ]?condition(?:ed|ing)|a\/c|ac)\b/.test(q)) p.setting = "indoor";
    else if (/\b(outdoors?|outside|open[- ]air|al fresco)\b/.test(q)) p.setting = "outdoor";
    else if (/\b(in the air|airborne|flying|fly)\b/.test(q)) p.setting = "airborne";
    // months
    MONTHS.forEach(function (mn, i) { if (new RegExp("\\b" + mn + "\\b").test(q) || (mn.length > 4 && new RegExp("\\b" + mn.slice(0, 3) + "\\b").test(q))) p.months.push(i + 1); });
    Object.keys(SEASONS).forEach(function (s) { if (new RegExp("\\b" + s + "\\b").test(q)) { p.months = p.months.concat(SEASONS[s]); p.season = s; } });
    // area
    if (/\b(downtown|fremont)\b/.test(q)) p.area = "downtown";
    else if (/\b(off[- ]strip|away from the strip|outside (?:the )?city)\b/.test(q)) p.area = "off";
    else if (/\bstrip\b/.test(q)) p.area = "strip";
    // categories
    Object.keys(CATWORDS).forEach(function (c) { if (CATWORDS[c].some(function (w) { return new RegExp("\\b" + w + "s?\\b").test(q); })) p.cats.push(c); });
    p.question = /^\s*(how|what|whats|do|does|can|could|is|are|where|when|which|who|why|should|will)\b/.test(q) || /\?\s*$/.test(raw);
    p.terms = toks(q.replace(/\$?\d+/g, " "));
    p.rawTerms = toks(raw.replace(/\$?\d[\d,]*/g, " "));
    return p;
  }

  // ---------- scoring ----------
  function fieldScore(terms, fields) {
    var total = 0, hit = 0;
    terms.forEach(function (t) {
      var best = 0;
      fields.forEach(function (f) {
        var b = f[0], w = f[1];
        if (b[t]) best = Math.max(best, w * (1 + Math.min(b[t], 3) * 0.15));
        else if (t.length >= 4) for (var k in b) if (k.length >= 4 && (k.indexOf(t) === 0 || t.indexOf(k) === 0)) { best = Math.max(best, w * 0.5); break; }
      });
      if (best) hit++;
      total += best;
    });
    return { score: total, hit: hit, cov: terms.length ? hit / terms.length : 0 };
  }
  function prep(d) {
    IDX = d;
    d.venues.forEach(function (v) { v._n = bag(v.name + " " + (v.alias || []).join(" ")); v._v = bag((v.vibe || []).join(" ") + " " + v.cat + " " + v.area + " " + (v.setting || "")); v._b = bag(v.bestFor); v._t = bag(v.text); });
    d.faqs.forEach(function (f) { f._q = bag(f.q); f._a = bag(f.a); });
    d.sections.forEach(function (s) { s._h = bag(s.h + " " + s.guide); s._t = bag(s.text); });
    d.pages.forEach(function (g) { g._h = bag(g.title + " " + (g.kw || "")); g._t = bag(g.text); });
  }
  function settingOk(v, s) {
    var st = (v.setting || "").toLowerCase();
    if (s === "indoor") return st.indexOf("indoor") > -1 || st.indexOf("cabin") > -1;
    if (s === "outdoor") return st.indexOf("outdoor") > -1 || st.indexOf("canyon") > -1;
    if (s === "airborne") return st.indexOf("airborne") > -1;
    return true;
  }
  function areaOk(v, a) {
    var ar = v.area.toLowerCase();
    if (a === "downtown") return /^downtown|fremont/.test(ar);
    if (a === "strip") return /strip/.test(ar) && !/west of the strip/.test(ar);
    if (a === "off") return !/the strip/.test(ar);
    return true;
  }
  function aliasHit(v, lowerRaw) {
    return (v.alias || []).some(function (a) { return lowerRaw.indexOf(a) > -1; }) || lowerRaw.indexOf(v.name.toLowerCase()) > -1;
  }

  function search(raw) {
    var p = parse(raw), lower = raw.toLowerCase().replace(/[’']/g, "");
    var strict = p.max != null || p.min != null || p.guests != null || p.setting || p.area;
    var hasFilter = strict || p.cats.length || p.small || p.cheap;
    var named = IDX.venues.filter(function (v) { return aliasHit(v, lower); });
    p.named = named.length;

    // venues
    var hiddenQuote = 0, list = [];
    IDX.venues.forEach(function (v) {
      var isNamed = named.indexOf(v) > -1;
      if (!isNamed) {
        if (p.setting && !settingOk(v, p.setting)) return;
        if (p.area && !areaOk(v, p.area)) return;
        if (p.max != null) { if (v.price == null) { hiddenQuote++; return; } if (v.price > p.max) return; }
        if (p.min != null && v.price != null && v.price < p.min) return;
        if (p.guests != null && v.guests != null && v.guests < p.guests) return;
        if (p.guests >= 50 && /airborne/i.test(v.setting || "")) return;   // aircraft and wheel cabins are small-group venues
        if (p.guests >= 20 && /in your car/i.test(v.setting || "")) return;
      }
      var fs = fieldScore(p.terms, [[v._n, 6], [v._v, 3], [v._b, 2], [v._t, 1]]);
      var s = fs.score * (0.5 + fs.cov / 2);
      if (isNamed) s += 40;
      if (p.cats.indexOf(v.catSlug) > -1) s += 7;
      if (p.small && /elope|intimate|small/i.test(v.bestFor + " " + (v.vibe || []).join(" "))) s += 3;
      if (p.guests != null) s += v.guests == null ? -3 : 3;
      var st = (v.setting || "").toLowerCase();
      if (p.setting === "outdoor" && st.indexOf("indoor") === -1) s += 4;
      if (p.setting === "indoor" && st.indexOf("outdoor") === -1) s += 4;
      if (p.months.some(function (m) { return m >= 6 && m <= 8; }) && settingOk(v, "indoor")) s += 2;
      list.push({ v: v, s: s, kw: fs.hit });
    });
    var anyKw = list.some(function (x) { return x.s > 2; });
    var similar = [];
    if (named.length) {
      similar = list.filter(function (x) { return named.indexOf(x.v) === -1 && x.v.catSlug === named[0].catSlug; }).slice(0, 3).map(function (x) { return x.v; });
      list = list.filter(function (x) { return named.indexOf(x.v) > -1; });
    }
    else if (!hasFilter) list = list.filter(function (x) { return x.s > (p.question ? 5 : 2) && x.kw > 0; });
    else if (anyKw && !(p.max != null || p.guests != null || p.setting)) list = list.filter(function (x) { return x.s > 0; });
    list.sort(function (a, b) {
      if (Math.abs(b.s - a.s) > 0.01) return b.s - a.s;
      return (a.v.price == null ? 1e9 : a.v.price) - (b.v.price == null ? 1e9 : b.v.price);
    });
    if (p.cheap && !named.length) list.sort(function (a, b) {
      var d = (b.s - a.s); if (Math.abs(d) > 4) return d;
      return (a.v.price == null ? 1e9 : a.v.price) - (b.v.price == null ? 1e9 : b.v.price);
    });

    // answers (FAQ) + guide sections + pages
    var qt = p.rawTerms;
    var faqs = IDX.faqs.map(function (f) { var r = fieldScore(qt, [[f._q, 3], [f._a, 1]]); return { f: f, s: r.score * r.cov, cov: r.cov, hit: r.hit, qcov: fieldScore(qt, [[f._q, 1]]).cov }; })
      .filter(function (x) { return x.s > 0; }).sort(function (a, b) { return b.s - a.s; });
    var secs = IDX.sections.map(function (s) { var r = fieldScore(qt, [[s._h, 3], [s._t, 1]]); return { d: s, s: r.score * r.cov, cov: r.cov }; })
      .filter(function (x) { return x.s > 1.5 && x.cov >= 0.5; }).sort(function (a, b) { return b.s - a.s; });
    var pages = IDX.pages.map(function (g) { var r = fieldScore(qt, [[g._h, 4], [g._t, 1]]); return { d: g, s: r.score * r.cov, cov: r.cov }; })
      .filter(function (x) { return x.s > 2 && x.cov >= 0.5; }).sort(function (a, b) { return b.s - a.s; });

    // pick a direct answer
    var answer = null, v0 = named[0];
    var wantsCost = qt.indexOf("cost") > -1 || qt.indexOf("cheap") > -1 || /\bcheaper\b/.test(lower);
    if (named.length > 1 && wantsCost) {
      var byPrice = named.slice().sort(function (a, b) { return (a.price == null ? 1e9 : a.price) - (b.price == null ? 1e9 : b.price); });
      answer = { text: byPrice.map(function (v) { return v.price != null ? v.name + ": published pricing starts at " + money(v.price) + (v.priceLabel ? " (" + v.priceLabel + ")" : "") + "." : v.name + ": quote-only, no published price."; }).join(" ") + " Packages include different things, so compare what each one covers.", url: "/guides/las-vegas-wedding-cost/", src: "Published venue prices (checked " + byPrice[0].checkedText + ")" };
    } else if (v0 && (p.question || wantsCost)) {
      var bits = [];
      var wantsGuests = /\b(guest|many|capacity|hold|fit|big|large)\b/.test(qt.join(" "));
      var wantsWhere = /\b(where|located|location|far|drive|address)\b/.test(lower);
      var wantsSetting = /\b(indoor|outdoor|inside|outside)\b/.test(lower);
      if (wantsCost || (!wantsGuests && !wantsWhere && !wantsSetting)) bits.push(v0.price != null ? "At " + v0.name + ", published wedding pricing starts at " + money(v0.price) + (v0.priceLabel ? " (" + v0.priceLabel + ")" : "") + "." : v0.name + " doesn't publish wedding prices, so pricing is by custom quote.");
      if (wantsGuests) bits.push(v0.guests != null ? "The largest published option at " + v0.name + " holds up to " + v0.guests + " guests." : v0.name + " doesn't publish a maximum guest count.");
      if (wantsWhere) bits.push("Location: " + v0.area + ". " + v0.drive + ".");
      if (wantsSetting) bits.push("Setting: " + v0.setting + ".");
      answer = { text: bits.join(" "), url: v0.url, src: v0.name + " (checked " + v0.checkedText + ")" };
    } else if (faqs.length && faqs[0].cov >= 0.6 && faqs[0].qcov >= 0.5 && (p.question || !strict || faqs[0].cov === 1)) {
      answer = { q: faqs[0].f.q, text: faqs[0].f.a, url: faqs[0].f.url, src: faqs[0].f.src };
    }
    return { p: p, venues: list.map(function (x) { return x.v; }), hiddenQuote: hiddenQuote, answer: answer, similar: similar, named: named.length, faqs: faqs.filter(function (x) { return x.cov >= 0.6 && x.qcov >= 0.5; }).slice(answer && answer.q ? 1 : 0, 4), secs: secs.slice(0, 4), pages: pages.slice(0, 3) };
  }

  // ---------- render ----------
  function chipList(p) {
    var c = [];
    if (p.min != null && p.max != null) c.push(money(p.min) + "–" + money(p.max));
    else if (p.max != null) c.push("Up to " + money(p.max));
    else if (p.min != null) c.push(money(p.min) + " and up");
    if (p.cheap && p.max == null) c.push("Lowest prices first");
    if (p.guests != null) c.push(p.guestsWord ? "Large group (100+ guests)" : p.guests + "+ guests");
    if (p.small) c.push("Small or just the two of you");
    if (p.setting) c.push({ indoor: "Indoor", outdoor: "Outdoor", airborne: "In the air" }[p.setting]);
    if (p.area) c.push({ downtown: "Downtown / Fremont", strip: "On the Strip", off: "Away from the Strip" }[p.area]);
    if (!p.named) p.cats.forEach(function (s) { c.push(IDX.cats[s]); });
    if (p.season) c.push(p.season.charAt(0).toUpperCase() + p.season.slice(1));
    else p.months.forEach(function (m) { c.push(MONTHS[m - 1].charAt(0).toUpperCase() + MONTHS[m - 1].slice(1)); });
    return c;
  }
  function venueCard(v, p) {
    return '<article class="vcard"><div class="img"><img src="' + v.img + '" alt="" width="800" height="600" loading="lazy"></div><div class="body">' +
      '<span class="tag sage" style="align-self:flex-start">' + esc(v.cat) + '</span><h3><a href="' + v.url + '">' + esc(v.name) + '</a></h3>' +
      '<div class="meta">' + esc(v.area) + (v.setting ? " · " + esc(v.setting) : "") + (v.guests ? " · up to " + v.guests + " guests" : (p && p.guests != null ? " · guest limit not published" : "")) + '</div>' +
      '<div class="price">' + (v.price != null ? "<span>From</span><strong>" + money(v.price) + "</strong>" : "<span>Pricing</span><strong>Custom quote</strong>") + '</div></div></article>';
  }
  function monthTip(p) {
    if (!p.months.length || !IDX.climate) return "";
    var ms = p.months.slice(0, 3).map(function (m) { var c = IDX.climate[m - 1]; return "<strong>" + c[0] + ":</strong> average high " + Math.round(c[1]) + "°F, low " + Math.round(c[2]) + "°F. " + esc(c[3]) + "."; });
    var vof = p.months.indexOf(12) > -1 ? " Valley of Fire is closed December 1–14." : "";
    return '<div class="note"><strong>Weather check.</strong> ' + ms.join(" ") + vof + ' <a href="/guides/best-time-to-get-married-in-las-vegas/">Month-by-month guide</a></div>';
  }
  function render(raw) {
    raw = (raw || "").trim();
    document.querySelectorAll("[data-search-examples]").forEach(function (el) { el.hidden = !!raw; });
    if (!raw) { out.innerHTML = ""; if (read) read.innerHTML = ""; return; }
    var r = search(raw), p = r.p, h = "";
    var chips = chipList(p);
    if (read) read.innerHTML = chips.length ? '<p class="readback"><span>Here\'s how we read that:</span> ' + chips.map(function (c) { return '<span class="tag">' + esc(c) + "</span>"; }).join(" ") + "</p>" : "";
    if (r.answer) h += '<div class="answer">' + "<strong>" + (r.answer.q ? esc(r.answer.q) : "Quick answer") + "</strong><p>" + esc(r.answer.text) + '</p><p class="small" style="margin-top:10px">Source: <a href="' + r.answer.url + '">' + esc(r.answer.src) + "</a></p></div>";
    h += monthTip(p);
    if (r.venues.length) {
      var shown = r.venues.slice(0, 12);
      h += '<h2 class="h3 search-h">' + (r.named ? "Venue" + (r.venues.length > 1 ? "s" : "") + " you asked about" : r.venues.length + (r.venues.length === 1 ? " venue matches" : " venues match")) + '</h2><div class="grid-3">' + shown.map(function (v) { return venueCard(v, p); }).join("") + "</div>";
      if (p.guests != null && shown.some(function (v) { return v.guests == null; })) h += '<p class="small" style="margin-top:14px">Some venues don\'t publish a guest limit. Confirm capacity with the venue before you plan around it.</p>';
      if (r.similar.length) h += '<h2 class="h3 search-h">Similar venues</h2><div class="grid-3">' + r.similar.map(function (v) { return venueCard(v, p); }).join("") + "</div>";
      if (r.venues.length > shown.length) h += '<p class="small" style="margin-top:14px">Showing the top ' + shown.length + '. <a href="/venues/">Browse the full directory</a></p>';
    }
    if (r.hiddenQuote && p.max != null) h += '<p class="small" style="margin-top:14px">' + r.hiddenQuote + " quote-only " + (r.hiddenQuote === 1 ? "venue isn't" : "venues aren't") + " shown because they don't publish prices. <a href=\"/venues/\">See them in the directory</a></p>";
    var info = "";
    r.faqs.forEach(function (x) { if (x.cov >= 0.5) info += '<details><summary>' + esc(x.f.q) + "</summary><p>" + esc(x.f.a) + ' <a href="' + x.f.url + '">Read more</a></p></details>'; });
    var links = "";
    r.secs.forEach(function (x) { links += '<a class="mini" href="' + x.d.url + '"><span class="tag sage">' + esc(x.d.guide) + '</span><strong style="margin-top:8px">' + esc(x.d.h) + "</strong><span>" + esc(x.d.text.slice(0, 150)) + "…</span></a>"; });
    r.pages.forEach(function (x) { links += '<a class="mini" href="' + x.d.url + '"><span class="tag sage">' + esc(x.d.kind) + '</span><strong style="margin-top:8px">' + esc(x.d.title) + "</strong><span>" + esc(x.d.text.slice(0, 150)) + "</span></a>"; });
    if (info) h += '<h2 class="h3 search-h">Related answers</h2><div class="faq narrow">' + info + "</div>";
    if (links) h += '<h2 class="h3 search-h">From our guides</h2><div class="grid-3">' + links + "</div>";
    if (!r.venues.length && !r.answer && !info && !links) {
      h += '<div class="note"><strong>No matches for “' + esc(raw) + '”.</strong> Try describing the wedding instead: a budget, a guest count, indoor or outdoor, or a vibe like “desert” or “Elvis.” Or <a href="/venues/">browse all venues</a> and <a href="/guides/">read the guides</a>.</div>';
      document.querySelectorAll("[data-search-examples]").forEach(function (el) { el.hidden = false; });
    } else if (!r.venues.length && (p.max != null || p.guests != null || p.setting)) {
      h = '<div class="note"><strong>No venues fit every part of that.</strong> Try raising the budget, lowering the guest count or dropping indoor/outdoor. Many venues don\'t publish prices, so a quote may still work.</div>' + h;
    }
    out.innerHTML = h;
    document.title = "“" + raw.slice(0, 40) + "” | Search | Unique Vegas Weddings";
  }

  function current() { return new URLSearchParams(location.search).get("q") || ""; }
  form.addEventListener("submit", function (e) {
    if (!IDX) return; // not loaded yet: let the normal page load handle it
    e.preventDefault();
    var q = input.value.trim();
    history.pushState({}, "", q ? "/search/?q=" + encodeURIComponent(q) : "/search/");
    render(q);
    if (window.gtag && q) window.gtag("event", "search", { search_term: q });
  });
  window.addEventListener("popstate", function () { input.value = current(); if (IDX) render(input.value); });
  input.value = current();
  fetch("/search-index.json").then(function (r) { return r.json(); }).then(function (d) { prep(d); render(input.value); })
    .catch(function () { out.innerHTML = '<div class="note">Search couldn\'t load. <a href="/venues/">Browse venues</a> or <a href="/guides/">read the guides</a>.</div>'; });
})();
