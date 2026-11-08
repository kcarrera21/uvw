/* Budget planner page. Reads UVWBudget. Does not store amounts. */
(function () {
  var B = window.UVWBudget;
  var root = document.querySelector("[data-true-cost]");
  if (!B || !root) return;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var venues = [];
  try { venues = JSON.parse($("#bp-venues").textContent || "[]"); } catch (e) { venues = []; }
  var bySlug = {};
  venues.forEach(function (v) { bySlug[v.s] = v; });

  var venueSel = $("#bp-venue");
  var venueOut = $("#bp-venue-out");
  var useBtn = $("#bp-use-price");
  var packageInput = $("[data-money='packageAmount']", root);
  var packageNote = $("#bp-package-note");
  var dirLink = $("#bp-directory");
  var confirmedEl = $("#bp-confirmed");
  var estimateEl = $("#bp-estimates");
  var cushionEl = $("#bp-cushion-out");
  var youEl = $("#bp-you");
  var guestsEl = $("#bp-guests-out");
  var warnEl = $("#bp-warnings");

  function read() {
    var input = {};
    $$("[data-money]", root).forEach(function (el) { input[el.getAttribute("data-money")] = el.value; });
    $$("[data-count]", root).forEach(function (el) { input[el.getAttribute("data-count")] = el.value; });
    $$("[data-percent]", root).forEach(function (el) { input[el.getAttribute("data-percent")] = el.value; });
    $$("[data-flag]", root).forEach(function (el) { input[el.getAttribute("data-flag")] = el.checked; });
    return input;
  }

  function markInvalid(input) {
    $$("[data-money]", root).forEach(function (el) {
      el.setAttribute("aria-invalid", B.parseMoney(el.value).ok ? "false" : "true");
    });
    $$("[data-count]", root).forEach(function (el) {
      var max = el.getAttribute("data-count") === "copies" ? 100 : 100000;
      el.setAttribute("aria-invalid", B.parseCount(el.value, max).ok ? "false" : "true");
    });
    $$("[data-percent]", root).forEach(function (el) {
      el.setAttribute("aria-invalid", B.parsePercent(el.value, 100).ok ? "false" : "true");
    });
    return input;
  }

  var WARN = {
    "civil-and-package": "You're counting a county ceremony and a venue package. Keep both if the courthouse is the legal part and the venue is a separate celebration. If the package includes the officiant, uncheck the county ceremony.",
    "invalid-ignored": "Something that isn't a positive number was left out of the total.",
    "capped": "A very large number was capped so the total stays a real figure."
  };

  function renderTotals(r) {
    confirmedEl.textContent = B.formatMoney(r.confirmed);
    estimateEl.textContent = B.formatMoney(r.estimate);
    cushionEl.textContent = B.formatMoney(r.cushion);
    youEl.textContent = B.formatMoney(r.youPay);
    if (r.payGuestCosts) guestsEl.textContent = B.formatMoney(r.guestCosts) + ", in what you pay";
    else guestsEl.textContent = B.formatMoney(r.guestsPay);
    warnEl.textContent = r.warnings.map(function (code) { return WARN[code] || ""; }).filter(Boolean).join(" ");
    if (dirLink) {
      if (r.guests > 0) {
        dirLink.href = "/venues/?guests=" + r.guests;
        dirLink.textContent = "Browse venues that publish room for " + r.guests.toLocaleString("en-US") + (r.guests === 1 ? " guest" : " guests");
      } else {
        dirLink.href = "/venues/";
        dirLink.textContent = "Browse the venue directory";
      }
    }
  }

  function prettyDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) return "";
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[+m[2] - 1] + " " + (+m[3]) + ", " + m[1];
  }

  function addP(parent, text) {
    var p = document.createElement("p");
    p.textContent = text;
    parent.appendChild(p);
    return p;
  }

  function addQuotes(parent, quotes) {
    if (!quotes || !quotes.length) return;
    var ul = document.createElement("ul");
    ul.className = "bp-quotes";
    quotes.forEach(function (q) {
      var li = document.createElement("li");
      li.textContent = q;
      ul.appendChild(li);
    });
    parent.appendChild(ul);
  }

  function topic(parent, label, topicObj, lines) {
    var box = document.createElement("div");
    box.className = "bp-topic";
    var h = document.createElement("h3");
    h.textContent = label;
    var tag = document.createElement("span");
    tag.className = "bp-tag " + (topicObj.fit || "unknown");
    var tags = { yes: "Stated", no: "Stated", limited: "Stated, with limits", mixed: "Mixed", unknown: "Not stated" };
    var tagText = tags[topicObj.fit] || "Not stated";
    if ((topicObj.fit || "unknown") === "unknown" && topicObj.quotes && topicObj.quotes.length) tagText = "Mentioned";
    tag.textContent = tagText;
    h.appendChild(tag);
    box.appendChild(h);
    lines.forEach(function (line) { if (line) addP(box, line); });
    addQuotes(box, topicObj.quotes);
    parent.appendChild(box);
  }

  function photoLead(v) {
    var fit = v.photo.fit;
    var line = "Not stated in our checked listing.";
    if (fit === "yes") line = "The listing says a photographer is not included, or that you bring your own.";
    else if (fit === "no") line = "The listing restricts an outside photographer.";
    else if (fit === "limited") line = "The listing limits photography, gear, or a photo permit.";
    else if (fit === "mixed") line = "The listing says more than one thing. Read the sentences, then ask the venue.";
    else if (v.photo.quotes && v.photo.quotes.length) line = "The listing mentions photography, but not whether an outside photographer is allowed.";
    var extra = "";
    if (v.photo.included && fit !== "yes") extra = "A package in the listing includes a photographer. That is not a yes or no on bringing someone else. If your quote includes one, check Already in the package so you don't count it twice.";
    return [line, extra];
  }

  var shownSlug = "";
  function renderVenue(slug, guestCount) {
    if (slug !== shownSlug) {
      if (packageNote && shownSlug) packageNote.textContent = "";
      shownSlug = slug;
    }
    venueOut.textContent = "";
    var v = bySlug[slug];
    if (!v) {
      if (useBtn) useBtn.hidden = true;
      addP(venueOut, "Pick a venue to compare your guest count with the published maximum, and to read what the listing actually says. If a listing is silent, it stays not stated.");
      return;
    }
    var fit = B.guestFit({
      guests: v.guests, price: v.price, label: v.label, checked: v.checked,
      includedCap: v.includedCap, includedQuote: v.includedQuote
    }, guestCount);
    var head = document.createElement("p");
    var a = document.createElement("a");
    a.href = "/venues/" + v.s + "/";
    a.textContent = v.n;
    head.appendChild(a);
    venueOut.appendChild(head);
    addP(venueOut, capacityLine(fit));
    priceLines(fit).forEach(function (line) { addP(venueOut, line); });
    topic(venueOut, "Outside photographer", v.photo, photoLead(v));
    topic(venueOut, "Access", v.access, [accessLead(v.access)]);
    topic(venueOut, "Privacy", v.privacy, [privacyLead(v.privacy)]);
    topic(venueOut, "Music", v.music, [musicLead(v.music)]);
    if (v.money && v.money.length) {
      var moneyTopic = { fit: "yes", quotes: v.money };
      topic(venueOut, "Money notes from the listing", moneyTopic, ["These sentences are from the listing. Nothing here is added for you. If your quote already includes a fee, don't type it again."]);
    }
    if (useBtn) {
      useBtn.hidden = !(v.price > 0);
      useBtn.textContent = v.price > 0 ? "Use " + B.formatMoney(v.price) + " as the package estimate" : "";
    }
  }

  function capacityLine(fit) {
    if (fit.capacity === "need-count") return "Add your guest count to compare it with the published maximum.";
    if (fit.capacity === "unknown") return "Our listing doesn't publish a maximum guest count.";
    if (fit.capacity === "over") return "Your guest count is higher than the largest number in our listing (" + fit.max.toLocaleString("en-US") + ").";
    return "Your guest count is within the largest published option (" + fit.max.toLocaleString("en-US") + "). A smaller package can still have a lower limit.";
  }

  function priceLines(fit) {
    var lines = [];
    if (fit.flags.indexOf("no-price") > -1) {
      lines.push("Our listing doesn't have a published starting price. Leave the package line blank until you have a quote.");
    } else {
      var when = fit.checked ? " Checked " + prettyDate(fit.checked) + "." : "";
      lines.push("Published starting price: " + B.formatMoney(fit.price) + (fit.label ? " for " + fit.label : "") + "." + when + " That is the venue's from price, not a quote for your guest count.");
    }
    if (fit.flags.indexOf("label-smaller") > -1) {
      lines.push("The price label reads as a smaller guest count than you entered. Use that figure only as a floor, then replace it when you have a quote for your real headcount.");
    }
    if (fit.flags.indexOf("included-cap") > -1) {
      if (fit.includedQuote) lines.push(fit.includedQuote);
      lines.push("Your guest count is above the included number in that sentence. Add any extra-guest fee yourself if you know it. We won't turn it into a new price.");
    }
    return lines;
  }

  function accessLead(topicObj) {
    if (topicObj.fit === "yes") return "The listing says:";
    if (topicObj.fit === "no") return "The listing says wheelchair access is a problem:";
    if (topicObj.fit === "limited") return "The listing mentions access. This is not a full accessibility check.";
    if (topicObj.fit === "mixed") return "The listing says more than one thing:";
    return "Not stated in our checked listing.";
  }
  function privacyLead(topicObj) {
    if (topicObj.fit === "yes") return "The listing describes exclusive use, or says the place isn't open to the public.";
    if (topicObj.fit === "no") return "The listing says you should not count on having the site to yourselves.";
    if (topicObj.fit === "limited") return "The listing mentions privacy, public hours, or a buyout. A buyout option is not the same as every ceremony being closed to other visitors.";
    if (topicObj.fit === "mixed") return "The listing says more than one thing:";
    return "Not stated in our checked listing.";
  }
  function musicLead(topicObj) {
    if (topicObj.fit === "limited") return "The listing has a music rule.";
    if (topicObj.fit === "no") return "The listing restricts music.";
    if (topicObj.fit === "yes") return "The listing says:";
    if (topicObj.fit === "mixed") return "The listing says more than one thing:";
    return "Not stated in our checked listing.";
  }

  function recalc() {
    var input = markInvalid(read());
    var result = B.calculate(input);
    renderTotals(result);
    renderVenue(venueSel ? venueSel.value : "", input.guests);
  }

  root.addEventListener("input", recalc);
  root.addEventListener("change", recalc);
  if (useBtn) useBtn.addEventListener("click", function () {
    var v = bySlug[venueSel.value];
    if (!v || !(v.price > 0) || !packageInput) return;
    packageInput.value = String(v.price);
    if (packageNote) packageNote.textContent = "Using the published starting price of " + B.formatMoney(v.price) + " as a stand-in. Replace it when you have your quote.";
    recalc();
  });

  var params = new URLSearchParams(location.search);
  var preVenue = params.get("venue");
  if (preVenue && venueSel && bySlug[preVenue]) venueSel.value = preVenue;
  var preGuests = params.get("guests");
  var guestField = $("[data-count='guests']", root);
  if (preGuests && guestField && /^\d+$/.test(preGuests)) guestField.value = preGuests;

  var split = $("[data-budget-split]");
  if (split) {
    var total = $("#bp-total");
    var used = $("#bp-used");
    var balance = $("#bp-balance");
    split.addEventListener("input", function () {
      var percents = $$("[data-bp-row]", split).map(function (row) { return $("input", row).value; });
      var result = B.splitBudget(total.value, percents);
      $$("[data-bp-row]", split).forEach(function (row, i) {
        $("output", row).textContent = B.formatMoney(result.rows[i].dollars);
      });
      var shown = Math.round(result.used * 100) / 100;
      used.textContent = (shown % 1 ? String(shown) : String(shown)) + "%";
      used.className = result.balanced ? "ok" : "warn";
      if (balance) {
        if (result.balanced) balance.textContent = "Adds up.";
        else if (result.used < 100) balance.textContent = "Short by " + (Math.round((100 - result.used) * 100) / 100) + "%.";
        else balance.textContent = "Over by " + (Math.round((result.used - 100) * 100) / 100) + "%.";
      }
    });
    split.dispatchEvent(new Event("input"));
  }

  recalc();
})();
