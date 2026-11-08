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
  var venueBrief = $("#bp-venue-brief");
  var venueMore = $("#bp-venue-more");
  var useBtn = $("#bp-use-price");
  var packageInput = $("[data-money='packageAmount']", root);
  var packageNote = $("#bp-package-note");
  var dirLink = $("#bp-directory");
  var youLabel = $("#bp-you-label");
  var youEl = $("#bp-you");
  var noteEl = $("#bp-total-note");
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
    "civil-and-package": "You have both a courthouse ceremony and a venue package. Keep both only if the courthouse is the legal part and the venue is a separate celebration. Otherwise turn off the courthouse ceremony.",
    "invalid-ignored": "A line that isn't a positive number was left out.",
    "capped": "A very large number was reduced so the total stays readable."
  };

  function renderTotals(r) {
    var partial = r.estimate === 0 && r.cushion === 0 && !r.payGuestCosts;
    if (partial) {
      youLabel.textContent = "County fees so far";
      youEl.textContent = B.formatMoney(r.confirmed);
      noteEl.textContent = "Your package and other costs are still blank, so this is not the full amount you pay." + (r.guestCosts > 0 ? " Guest costs stay separate." : "");
    } else {
      youLabel.textContent = "You pay";
      youEl.textContent = B.formatMoney(r.youPay);
      var bits = [B.formatMoney(r.confirmed) + " county fees (published)"];
      if (r.estimate > 0) bits.push(B.formatMoney(r.estimate) + " you entered");
      if (r.cushion > 0) bits.push(B.formatMoney(r.cushion) + " extra for unexpected costs");
      if (r.payGuestCosts) bits.push(B.formatMoney(r.guestCosts) + " guest costs you're covering");
      noteEl.textContent = bits.join(" + ") + ".";
    }
    if (r.payGuestCosts) guestsEl.textContent = "Included in what you pay";
    else if (r.guestCosts > 0) guestsEl.textContent = B.formatMoney(r.guestsPay);
    else guestsEl.textContent = "Not entered";
    warnEl.textContent = r.warnings.map(function (code) { return WARN[code] || ""; }).filter(Boolean).join(" ");
    if (dirLink) {
      if (r.guests > 0) {
        dirLink.href = "/venues/?guests=" + r.guests;
        dirLink.textContent = "Venues with room for " + r.guests.toLocaleString("en-US");
      } else {
        dirLink.href = "/venues/";
        dirLink.textContent = "Browse venues";
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
    if (v.photo.included && fit !== "yes") extra = "A listed package includes a photographer. That does not say you can bring your own. If yours is included, check Already included.";
    return [line, extra];
  }

  var shownSlug = "";
  function clearBox(el) { if (el) el.textContent = ""; }
  function hasListingNote(topicObj) {
    return topicObj && ((topicObj.quotes && topicObj.quotes.length) || (topicObj.fit && topicObj.fit !== "unknown") || topicObj.included);
  }
  function renderVenue(slug, guestCount) {
    if (slug !== shownSlug) {
      if (packageNote && shownSlug) packageNote.textContent = "";
      shownSlug = slug;
    }
    clearBox(venueBrief);
    if (venueOut) venueOut.textContent = "";
    var v = bySlug[slug];
    if (!v) {
      if (useBtn) useBtn.hidden = true;
      if (venueMore) venueMore.hidden = true;
      return;
    }
    var fit = B.guestFit({
      guests: v.guests, price: v.price, label: v.label, checked: v.checked,
      includedCap: v.includedCap, includedQuote: v.includedQuote
    }, guestCount);
    briefLines(fit).forEach(function (line) { addP(venueBrief, line); });
    if (useBtn) {
      useBtn.hidden = !(v.price > 0);
      useBtn.textContent = v.price > 0 ? "Use " + B.formatMoney(v.price) + " as the package price" : "";
    }
    if (venueMore) venueMore.hidden = false;
    var head = document.createElement("p");
    var a = document.createElement("a");
    a.href = "/venues/" + v.s + "/";
    a.textContent = "Open the " + v.n + " page";
    head.appendChild(a);
    venueOut.appendChild(head);
    var any = false;
    [["Photographer", v.photo, photoLead(v)], ["Access", v.access, [accessLead(v.access)]], ["Privacy", v.privacy, [privacyLead(v.privacy)]], ["Music", v.music, [musicLead(v.music)]]].forEach(function (row) {
      if (!hasListingNote(row[1])) return;
      any = true;
      topic(venueOut, row[0], row[1], row[2]);
    });
    if (v.money && v.money.length) {
      any = true;
      topic(venueOut, "Fees the listing mentions", { fit: "yes", quotes: v.money }, ["Nothing here is added for you. Type a fee only if your quote doesn't already include it."]);
    }
    if (!any) addP(venueOut, "This listing doesn't say, in a way we can check, whether you can bring a photographer, or what the access, privacy, and music rules are.");
  }

  function briefLines(fit) {
    var lines = [];
    if (fit.capacity === "need-count") lines.push("Add a guest count to compare it with the published maximum.");
    else if (fit.capacity === "unknown") lines.push("This listing doesn't give a maximum guest count.");
    else if (fit.capacity === "over") lines.push("That's more guests than the largest number in the listing (" + fit.max.toLocaleString("en-US") + ").");
    else lines.push("That fits the largest published option (" + fit.max.toLocaleString("en-US") + "). A smaller package may hold fewer.");
    if (fit.flags.indexOf("no-price") > -1) lines.push("No published starting price. Leave the package line blank until you have a quote.");
    else {
      var when = fit.checked ? ", checked " + prettyDate(fit.checked) : "";
      lines.push("Starting price " + B.formatMoney(fit.price) + (fit.label ? " for " + fit.label : "") + when + ". That's the venue's from price, not a quote for your guests.");
    }
    if (fit.flags.indexOf("label-smaller") > -1) lines.push("That starting price looks like a smaller group than you entered. Use it only until you have a real quote.");
    if (fit.flags.indexOf("included-cap") > -1) {
      if (fit.includedQuote) lines.push(fit.includedQuote);
      lines.push("Your guest count is above the number included in that sentence. Add any extra guest fee yourself if you know it.");
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

  function markIncluded() {
    $$("[data-flag]", root).forEach(function (box) {
      if (!/Included$/.test(box.getAttribute("data-flag") || "")) return;
      var line = box.closest(".bp-line");
      if (line) line.classList.toggle("is-included", box.checked);
    });
  }
  function recalc() {
    var input = markInvalid(read());
    var result = B.calculate(input);
    renderTotals(result);
    renderVenue(venueSel ? venueSel.value : "", input.guests);
    markIncluded();
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
