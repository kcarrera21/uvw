/* Unique Vegas Weddings: front-end behaviors (no frameworks, no tracking by default). */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var now = new Date();
  var todayIso = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
  var builtToday = document.documentElement.getAttribute("data-built") === todayIso;

  // ---------- cookie consent + Google Analytics ----------
  (function () {
    var root = document.documentElement, GA = root.getAttribute("data-ga");
    if (!GA) return;
    var mode = root.getAttribute("data-consent") || "eu", KEY = "uvw_consent";
    var banner = $("[data-consent-banner]");
    var tz = ""; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
    var inEurope = /^Europe\//.test(tz) || /^(Atlantic\/(Reykjavik|Canary|Madeira|Azores|Faroe)|Arctic\/Longyearbyen)$/.test(tz);
    var mustAsk = mode === "all" || (mode === "eu" && inEurope);
    var gpc = navigator.globalPrivacyControl === true;
    var choice = null; try { choice = localStorage.getItem(KEY); } catch (e) {}
    var loaded = false;
    function loadGA() {
      if (loaded) return; loaded = true;
      window["ga-disable-" + GA] = false;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date()); window.gtag("config", GA);
      var s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA; document.head.appendChild(s);
    }
    function stopGA() {
      window["ga-disable-" + GA] = true; window.gtag = undefined;
      document.cookie.split(";").forEach(function (c) {
        var n = c.split("=")[0].trim();
        if (/^_ga/.test(n)) ["", "; domain=" + location.hostname, "; domain=." + location.hostname.replace(/^www\./, "")].forEach(function (d) { document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + d; });
      });
    }
    function decide(v) {
      try { localStorage.setItem(KEY, v); } catch (e) {}
      if (banner) banner.hidden = true;
      if (v === "granted") loadGA(); else stopGA();
    }
    function armGA() {
      var kicked = false;
      function kick() {
        if (kicked || loaded) return;
        kicked = true;
        var run = function () { loadGA(); };
        var later = function () {
          if (window.requestIdleCallback) window.requestIdleCallback(run, { timeout: 2000 });
          else setTimeout(run, 1);
        };
        if (document.readyState === "complete") later();
        else window.addEventListener("load", later);
      }
      ["pointerdown", "keydown", "touchstart"].forEach(function (ev) {
        window.addEventListener(ev, kick, { once: true, passive: true, capture: true });
      });
      if (document.readyState === "complete") kick();
      else window.addEventListener("load", kick);
    }
    if (choice === "granted") armGA();
    else if (choice === "denied" || gpc) { /* stay off */ }
    else if (mode === "off" || !mustAsk) armGA();
    else if (banner) banner.hidden = false;
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-consent-choice]"); if (b) return decide(b.getAttribute("data-consent-choice"));
      if (e.target.closest("[data-cookie-settings]") && banner) { banner.hidden = false; banner.querySelector("button").focus(); }
    });
  })();

  // ---------- year stamps ----------
  $$("[data-year]").forEach(function (el) { el.textContent = now.getFullYear(); });

  // ---------- mobile nav ----------
  var navBtn = $(".nav-toggle");
  if (navBtn) navBtn.addEventListener("click", function () {
    var open = document.body.classList.toggle("nav-open");
    navBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // ---------- trust strip: "Updated today / yesterday / 3 days ago" ----------
  $$("time[data-ago]").forEach(function (t) {
    if (builtToday) return;
    var d = t.getAttribute("datetime").split("-").map(Number);
    var days = Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - new Date(d[0], d[1] - 1, d[2])) / 864e5);
    if (days === 0) t.textContent = "today";
    else if (days === 1) t.textContent = "yesterday";
    else if (days > 1 && days < 7) t.textContent = days + " days ago";
  });

  // ---------- season-aware blocks: <div data-months="6,7,8"> ----------
  var mo = now.getMonth() + 1, dayOfMonth = now.getDate();
  if (!builtToday) $$("[data-months]").forEach(function (el) {
    var list = el.getAttribute("data-months").split(",").map(Number);
    var until = el.getAttribute("data-until-day"); // optional e.g. "12-14"
    var show = list.indexOf(mo) > -1;
    if (show && until) {
      var p = until.split("-").map(Number);
      if (mo === p[0] && dayOfMonth > p[1]) show = false;
    }
    el.hidden = !show;
  });

  // ---------- venue of the week (rotates weekly, featured venues first) ----------
  var rot = $("[data-rotation]");
  if (rot) {
    try {
      var items = JSON.parse(rot.getAttribute("data-rotation"));
      var week = Math.floor((now - new Date(2026, 0, 5)) / 6048e5);
      var delta = week - (+rot.getAttribute("data-rot-week") || 0);
      var v = delta > 0 && delta < items.length ? items[delta] : null;
      if (v) {
        rot.querySelector("[data-rot-name]").textContent = v.name;
        rot.querySelector("[data-rot-blurb]").textContent = v.bestFor;
        rot.querySelector("[data-rot-meta]").textContent = v.meta;
        $$("[data-rot-link]", rot).forEach(function (a) { a.href = v.url; });
        var catLink = rot.querySelector("a.cat[data-rot-link]");
        if (catLink) catLink.setAttribute("aria-label", v.name);
        var img = rot.querySelector("[data-rot-img]"); if (img) img.src = v.img;
      }
    } catch (e) {}
  }

  // ---------- lucky dates ----------
  var L = window.UVWLucky;
  function dateCard(a, todayIso) {
    var days = Math.round((new Date(a.y, a.m - 1, a.d) - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 864e5);
    var when = a.iso < todayIso ? "Passed" : (days === 0 ? "Today!" : days === 1 ? "Tomorrow" : "In " + days + " days");
    return '<li class="lucky-item' + (a.iso < todayIso ? " past" : "") + '"><div class="lucky-date">' + a.short + '</div><div><strong>' + a.long + '</strong><div class="tags">' +
      a.tags.map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("") + '</div></div><div class="lucky-when">' + when + (a.iso >= todayIso ? '<a class="lucky-cd" href="/tools/wedding-countdown/?d=' + a.iso + '">Count down</a>' : "") + "</div></li>";
  }
  if (L) {
    $$("[data-lucky-upcoming]").forEach(function (el) {
      if (el.getAttribute("data-built") === todayIso && el.children.length) return;
      var n = +el.getAttribute("data-lucky-upcoming") || 5;
      el.innerHTML = L.upcoming(now, n, 5).map(function (a) { return dateCard(a, todayIso); }).join("");
    });
    var yearSel = $("[data-lucky-year]");
    var yearList = $("[data-lucky-list]");
    function renderYear(y) {
      if (!yearList) return;
      yearList.innerHTML = L.forYear(y, 4).filter(function (a) { return y < now.getFullYear() || a.iso >= todayIso; }).map(function (a) { return dateCard(a, todayIso); }).join("");
      var t = $("[data-lucky-title]"); if (t) t.textContent = y;
    }
    if (yearSel) {
      var y0 = now.getFullYear();
      yearSel.innerHTML = [y0, y0 + 1, y0 + 2, y0 + 3].map(function (y) { return '<button type="button" data-y="' + y + '">' + y + "</button>"; }).join("");
      yearSel.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return;
        $$("button", yearSel).forEach(function (x) { x.classList.toggle("on", x === b); });
        renderYear(+b.getAttribute("data-y"));
      });
      var start = +(yearList && yearList.getAttribute("data-start-year")) || y0;
      var btn = $('button[data-y="' + start + '"]', yearSel) || $("button", yearSel);
      btn.click();
    }
    if (yearList && !yearSel) renderYear(+yearList.getAttribute("data-start-year") || now.getFullYear());
    var countdown = $("[data-lucky-next]");
    if (countdown && countdown.getAttribute("data-built") !== todayIso) {
      var nx = L.upcoming(now, 1, 6)[0];
      if (nx) {
        var dd = Math.round((new Date(nx.y, nx.m - 1, nx.d) - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 864e5);
        countdown.innerHTML = "<strong>" + nx.short + "</strong> " + (dd === 0 ? "is today" : "is " + dd + " days away") + " &middot; " + nx.tags.join(" + ");
      }
    }
    // date checker
    var chk = $("#date-check");
    if (chk) chk.addEventListener("change", function () {
      var p = chk.value.split("-").map(Number); if (p.length < 3) return;
      var a = L.analyze(p[0], p[1], p[2]);
      $("#date-check-out").innerHTML = a.tags.length
        ? "<strong>" + a.short + "</strong> is special: " + a.tags.join(", ") + ". Book early. Dates like this fill up."
        : "<strong>" + a.short + "</strong> isn't a pattern date, which means better availability and calmer chapels. That's its own kind of lucky.";
    });
  }

  // ---------- shortlist (saved venues) ----------
  var SL = "uvw_shortlist";
  function getSL() { return store.get(SL, []); }
  function setSL(v) { store.set(SL, v); paintSL(); }
  function paintSL() {
    var list = getSL();
    $$("[data-save]").forEach(function (b) {
      var on = list.some(function (x) { return x.slug === b.getAttribute("data-save"); });
      b.classList.toggle("saved", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      var lbl = b.querySelector(".save-label"); if (lbl) lbl.textContent = on ? "Saved" : "Save";
    });
    $$("[data-sl-count]").forEach(function (el) { el.textContent = list.length; el.hidden = list.length === 0; });
    var wrap = $("[data-sl-list]");
    if (wrap) {
      wrap.innerHTML = list.length ? list.map(function (v) {
        return '<li><a href="' + v.url + '">' + v.name + '</a><button type="button" class="link-btn" data-remove="' + v.slug + '">Remove</button></li>';
      }).join("") : '<li class="empty">Nothing saved yet. Tap the heart on any venue to start your shortlist.</li>';
      var hid = $("[data-sl-field]"); if (hid) hid.value = list.map(function (v) { return v.name; }).join("; ");
    }
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-save]");
    if (b) {
      e.preventDefault();
      var slug = b.getAttribute("data-save"), list = getSL();
      var i = list.findIndex(function (x) { return x.slug === slug; });
      if (i > -1) list.splice(i, 1); else list.push({ slug: slug, name: b.getAttribute("data-name"), url: b.getAttribute("data-url") });
      setSL(list);
    }
    var r = e.target.closest("[data-remove]");
    if (r) setSL(getSL().filter(function (x) { return x.slug !== r.getAttribute("data-remove"); }));
  });
  paintSL();

  // ---------- directory filters ----------
  var grid = $("[data-filter-grid]");
  if (grid) {
    var state = { cat: "all", setting: "all", budget: "all", q: "", guests: 0, knownOnly: false };
    var guestInput = $("[data-filter-guests]");
    var knownInput = $("[data-filter-known]");
    var moreNote = $("[data-filter-more]");
    function capValue(raw) {
      if (raw === "" || raw == null) return null;
      var n = +raw;
      return Number.isFinite(n) && n > 0 ? n : null;
    }
    function guestPass(cap) {
      if (state.knownOnly && cap == null) return false;
      if (state.guests > 0 && cap != null && cap < state.guests) return false;
      return true;
    }
    function guestNote(list, capOf) {
      if (!moreNote) return;
      if (!state.guests && !state.knownOnly) { moreNote.hidden = true; moreNote.textContent = ""; return; }
      var caps = list.map(capOf);
      var unknown = caps.filter(function (c) { return c == null; }).length;
      var fit = caps.filter(function (c) { return c != null && (state.guests <= 0 || c >= state.guests); }).length;
      var low = state.guests > 0 ? caps.filter(function (c) { return c != null && c < state.guests; }).length : 0;
      var bits = [];
      if (state.guests > 0) bits.push(fit + (fit === 1 ? " venue publishes" : " venues publish") + " a capacity of at least " + state.guests.toLocaleString("en-US") + ".");
      if (low) bits.push(low + (low === 1 ? " is" : " are") + " hidden because the published maximum is lower.");
      if (unknown && !state.knownOnly) bits.push(unknown + (unknown === 1 ? " doesn't publish a maximum, so it stays in the list." : " don't publish a maximum, so they stay in the list."));
      if (unknown && state.knownOnly) bits.push(unknown + (unknown === 1 ? " doesn't publish a maximum and is hidden." : " don't publish a maximum and are hidden."));
      moreNote.hidden = false;
      moreNote.textContent = bits.join(" ");
    }
    function syncGuestUrl() {
      try {
        var u = new URL(location.href);
        if (state.guests > 0) u.searchParams.set("guests", String(state.guests)); else u.searchParams.delete("guests");
        if (state.knownOnly) u.searchParams.set("known", "1"); else u.searchParams.delete("known");
        history.replaceState(null, "", u);
      } catch (e) {}
    }
    function readGuestState() {
      var n = parseInt(guestInput && guestInput.value, 10);
      state.guests = Number.isFinite(n) && n > 0 ? n : 0;
      state.knownOnly = !!(knownInput && knownInput.checked);
    }
    var empty = $("[data-filter-empty]");
    var countEl = $("[data-filter-count]");
    var catalog = null;
    var catalogEl = document.getElementById("venue-catalog");
    try { catalog = catalogEl ? JSON.parse(catalogEl.textContent) : null; } catch (e) { catalog = null; }
    if (catalog) {
      var pageSize = +grid.getAttribute("data-page-size") || 24;
      var rendered = $$("[data-venue]", grid).length;
      var more = $("[data-venue-more]");
      var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 6.9 4.5c2.1 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.5 0 5.5 3.5 4.2 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>';
      function escH(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
      function cardHtml(v) {
        var price = v.price ? "<span>From</span><strong>" + escH(v.price) + "</strong>" : "<span>Pricing</span><strong>Custom quote</strong>";
        var badge = v.badge ? '<span class="badge">' + escH(v.badge) + "</span>" : "";
        var reception = v.reception ? '<span class="tag">Reception only</span>' : "";
        return '<article class="vcard" data-venue data-cat="' + escH(v.c) + '" data-setting="' + escH(v.st) + '" data-budget="' + escH(v.b) + '" data-search="' + escH(v.q) + '" data-price="' + escH(v.p) + '" data-guests="' + escH(v.g) + '" data-name="' + escH(v.ns) + '" data-checked="' + escH(v.k) + '" data-ceremony="' + (v.reception ? "0" : "1") + '">' +
          badge + '<button class="save" type="button" data-save="' + escH(v.s) + '" data-name="' + escH(v.n) + '" data-url="/venues/' + escH(v.s) + '/" aria-pressed="false" aria-label="Save ' + escH(v.n) + ' to your shortlist">' + HEART + '<span class="save-label">Save</span></button>' +
          '<div class="img">' + v.img + '</div><div class="body"><span class="tag sage" style="align-self:flex-start">' + escH(v.cn) + "</span>" + reception + '<h3><a href="/venues/' + escH(v.s) + '/">' + escH(v.n) + '</a></h3><div class="meta">' + escH(v.area) + (v.setting ? " · " + escH(v.setting) : "") + (v.g ? " · up to " + Number(v.g).toLocaleString("en-US") + " guests" : "") + '</div><div class="price">' + price + "</div></div></article>";
      }
      function matchOther(v) {
        return (state.cat === "all" || v.c === state.cat) &&
          (state.setting === "all" || String(v.st).indexOf(state.setting) > -1) &&
          (state.budget === "all" || v.b === state.budget) &&
          (!state.q || String(v.q).indexOf(state.q) > -1);
      }
      function matchRec(v) { return matchOther(v) && guestPass(capValue(v.g)); }
      function numOf(v, k) { return v[k] === "" || v[k] == null ? null : +v[k]; }
      var byRec = {
        "recommended": function (a, b) { return a.i - b.i; },
        "price-asc": function (a, b) { var x = numOf(a, "p"), y = numOf(b, "p"); return x === null ? (y === null ? 0 : 1) : y === null ? -1 : x - y; },
        "price-desc": function (a, b) { var x = numOf(a, "p"), y = numOf(b, "p"); return x === null ? (y === null ? 0 : 1) : y === null ? -1 : y - x; },
        "guests-desc": function (a, b) { var x = numOf(a, "g"), y = numOf(b, "g"); return x === null ? (y === null ? 0 : 1) : y === null ? -1 : y - x; },
        "name": function (a, b) { return a.ns < b.ns ? -1 : a.ns > b.ns ? 1 : 0; },
        "checked": function (a, b) { return a.k < b.k ? 1 : a.k > b.k ? -1 : 0; }
      };
      catalog.forEach(function (v, i) { v.i = i; });
      function rowsNow() {
        var key = ($("[data-sort]") || {}).value || "recommended";
        var f = byRec[key] || byRec.recommended;
        return catalog.filter(matchRec).sort(function (a, b) { return f(a, b) || a.i - b.i; });
      }
      function syncRows(rows) {
        if (countEl) countEl.textContent = rows.length + (rows.length === 1 ? " venue" : " venues");
        if (empty) empty.hidden = rows.length > 0;
        if (more) more.hidden = rendered >= rows.length;
        guestNote(catalog.filter(matchOther), function (v) { return capValue(v.g); });
      }
      function paint(reset) {
        var rows = rowsNow();
        if (reset) {
          rendered = Math.min(pageSize, rows.length);
          grid.innerHTML = rows.slice(0, rendered).map(cardHtml).join("");
        }
        syncRows(rows);
        paintSL();
      }
      $$("[data-filter]").forEach(function (sel) {
        sel.addEventListener("change", function () { state[sel.getAttribute("data-filter")] = sel.value; paint(true); });
      });
      var qIn = $("[data-filter-q]");
      if (qIn) qIn.addEventListener("input", function () { state.q = qIn.value.trim().toLowerCase(); paint(true); });
      var sortSel = $("[data-sort]");
      if (sortSel) sortSel.addEventListener("change", function () {
        try { var u = new URL(location.href); if (sortSel.value === "recommended") u.searchParams.delete("sort"); else u.searchParams.set("sort", sortSel.value); history.replaceState(null, "", u); } catch (e) {}
        paint(true);
      });
      if (more) more.addEventListener("click", function (e) {
        e.preventDefault();
        var rows = rowsNow();
        var next = rows.slice(rendered, rendered + pageSize);
        if (next.length) grid.insertAdjacentHTML("beforeend", next.map(cardHtml).join(""));
        rendered += next.length;
        syncRows(rows);
        paintSL();
      });
      var params = new URLSearchParams(location.search);
      var preCat = params.get("category");
      var preSort = params.get("sort");
      if (preCat) { var sel = $('[data-filter="cat"]'); if (sel) { sel.value = preCat; state.cat = preCat; } }
      if (preSort && byRec[preSort] && sortSel) sortSel.value = preSort;
      var preGuests = parseInt(params.get("guests"), 10);
      if (preGuests > 0 && guestInput) { guestInput.value = String(preGuests); state.guests = preGuests; }
      if (params.get("known") === "1" && knownInput) { knownInput.checked = true; state.knownOnly = true; }
      function onGuest() { readGuestState(); syncGuestUrl(); paint(true); }
      if (guestInput) guestInput.addEventListener("input", onGuest);
      if (knownInput) knownInput.addEventListener("change", onGuest);
      if (preCat || (preSort && byRec[preSort]) || state.guests || state.knownOnly) paint(true);
      else syncRows(rowsNow());
    } else {
      var cards = $$("[data-venue]", grid);
      function apply() {
        var shown = 0;
        cards.forEach(function (c) {
          var other = (state.cat === "all" || c.getAttribute("data-cat") === state.cat) &&
            (state.setting === "all" || c.getAttribute("data-setting").indexOf(state.setting) > -1) &&
            (state.budget === "all" || c.getAttribute("data-budget") === state.budget) &&
            (!state.q || c.getAttribute("data-search").indexOf(state.q) > -1);
          var ok = other && guestPass(capValue(c.getAttribute("data-guests")));
          c.hidden = !ok; if (ok) shown++;
        });
        if (empty) empty.hidden = shown > 0;
        if (countEl) countEl.textContent = shown + (shown === 1 ? " venue" : " venues");
        guestNote(cards.filter(function (c) {
          return (state.cat === "all" || c.getAttribute("data-cat") === state.cat) &&
            (state.setting === "all" || c.getAttribute("data-setting").indexOf(state.setting) > -1) &&
            (state.budget === "all" || c.getAttribute("data-budget") === state.budget) &&
            (!state.q || c.getAttribute("data-search").indexOf(state.q) > -1);
        }), function (c) { return capValue(c.getAttribute("data-guests")); });
      }
      $$("[data-filter]").forEach(function (sel) {
        sel.addEventListener("change", function () { state[sel.getAttribute("data-filter")] = sel.value; apply(); });
      });
      var q = $("[data-filter-q]");
      if (q) q.addEventListener("input", function () { state.q = q.value.trim().toLowerCase(); apply(); });
      var preParams = new URLSearchParams(location.search);
      var pre = preParams.get("category");
      if (pre) { var s = $('[data-filter="cat"]'); if (s) { s.value = pre; state.cat = pre; } }
      var preGuests2 = parseInt(preParams.get("guests"), 10);
      if (preGuests2 > 0 && guestInput) { guestInput.value = String(preGuests2); state.guests = preGuests2; }
      if (preParams.get("known") === "1" && knownInput) { knownInput.checked = true; state.knownOnly = true; }
      function onGuestFallback() { readGuestState(); syncGuestUrl(); apply(); }
      if (guestInput) guestInput.addEventListener("input", onGuestFallback);
      if (knownInput) knownInput.addEventListener("change", onGuestFallback);
      apply();
    }
  }

  // ---------- forms: AJAX submit to Formspree, then go to thank-you page ----------
  $$("form[data-ajax]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      if (f.action.indexOf("formspree.io") === -1) return; // not configured: let browser handle
      e.preventDefault();
      var btn = $("button[type=submit]", f); if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      fetch(f.action, { method: "POST", body: new FormData(f), headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw 0;
          var next = f.getAttribute("data-next") || "/thanks/";
          var kind = (f.querySelector("[name=_subject]") || {}).value || "form";
          var go = function () { location.href = next; };
          // count the lead in Google Analytics (if connected), then continue
          if (window.gtag) { window.gtag("event", "generate_lead", { form_name: kind, event_callback: go }); setTimeout(go, 800); } else go();
        })
        .catch(function () { if (btn) { btn.disabled = false; btn.textContent = "Try again"; } alert("Sorry, that didn't go through. Please try again in a moment."); });
    });
  });

  // ---------- count checkout clicks in Google Analytics (if connected) ----------
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]"); if (!a || !window.gtag) return;
    var h = a.href, item = /gumroad\.com/.test(h) ? "Planner PDF" : /buy\.stripe\.com/.test(h) ? (a.textContent.indexOf("Spotlight") > -1 ? "Spotlight listing" : "Featured listing") : null;
    if (item) window.gtag("event", "begin_checkout", { items: [{ item_name: item }], item_name: item });
  });

  // ---------- big lucky date coming up? show the banner ----------
  var lb = $("[data-lucky-banner]");
  if (lb && L && lb.getAttribute("data-built") !== todayIso) {
    var big = L.upcoming(now, 12, 9).filter(function (a) {
      var dd = (new Date(a.y, a.m - 1, a.d) - now) / 864e5; return dd >= 0 && dd <= 150;
    })[0];
    if (big) {
      var d2 = Math.ceil((new Date(big.y, big.m - 1, big.d) - now) / 864e5);
      lb.innerHTML = "&#10022; <strong>" + big.short + "</strong> is " + d2 + " days away (" + big.tags.join(" + ") + "). Chapels book up fast. <a href=\"/lucky-wedding-dates/\">See all lucky dates</a>";
      lb.hidden = false;
      $$("[data-months]").forEach(function (el) { el.hidden = true; });
    }
  }
  // ---------- venue videos: click to play (YouTube loads only after a press) ----------
  $$("[data-yt]").forEach(function (box) {
    var btn = $(".yt-play", box); if (!btn) return;
    btn.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(box.getAttribute("data-yt")) + "?autoplay=1&rel=0&playsinline=1";
      f.title = box.getAttribute("data-yt-title") || "Video";
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.allowFullscreen = true; f.loading = "eager";
      f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      box.innerHTML = ""; box.appendChild(f); box.classList.add("is-playing");
      if (window.gtag) window.gtag("event", "video_play", { video_id: box.getAttribute("data-yt"), page: location.pathname });
    });
  });
})();
