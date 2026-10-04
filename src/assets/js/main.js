/* Unique Vegas Weddings: front-end behaviors (no frameworks, no tracking by default). */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var now = new Date();

  // ---------- year stamps ----------
  $$("[data-year]").forEach(function (el) { el.textContent = now.getFullYear(); });

  // ---------- mobile nav ----------
  var navBtn = $(".nav-toggle");
  if (navBtn) navBtn.addEventListener("click", function () {
    var open = document.body.classList.toggle("nav-open");
    navBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // ---------- season-aware blocks: <div data-months="6,7,8"> ----------
  var mo = now.getMonth() + 1, dayOfMonth = now.getDate();
  $$("[data-months]").forEach(function (el) {
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
      var featured = items.filter(function (v) { return v.featured; });
      var pool = featured.length ? featured : items;
      var v = pool[((week % pool.length) + pool.length) % pool.length];
      if (v) {
        rot.querySelector("[data-rot-name]").textContent = v.name;
        rot.querySelector("[data-rot-blurb]").textContent = v.bestFor;
        rot.querySelector("[data-rot-meta]").textContent = v.meta;
        $$("[data-rot-link]", rot).forEach(function (a) { a.href = v.url; });
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
      a.tags.map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("") + '</div></div><div class="lucky-when">' + when + "</div></li>";
  }
  var todayIso = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
  if (L) {
    $$("[data-lucky-upcoming]").forEach(function (el) {
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
    if (countdown) {
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
    var state = { cat: "all", setting: "all", budget: "all", q: "" };
    var cards = $$("[data-venue]", grid);
    var empty = $("[data-filter-empty]");
    var countEl = $("[data-filter-count]");
    function apply() {
      var shown = 0;
      cards.forEach(function (c) {
        var ok = (state.cat === "all" || c.getAttribute("data-cat") === state.cat) &&
          (state.setting === "all" || c.getAttribute("data-setting").indexOf(state.setting) > -1) &&
          (state.budget === "all" || c.getAttribute("data-budget") === state.budget) &&
          (!state.q || c.getAttribute("data-search").indexOf(state.q) > -1);
        c.hidden = !ok; if (ok) shown++;
      });
      if (empty) empty.hidden = shown > 0;
      if (countEl) countEl.textContent = shown + (shown === 1 ? " venue" : " venues");
    }
    $$("[data-filter]").forEach(function (sel) {
      sel.addEventListener("change", function () { state[sel.getAttribute("data-filter")] = sel.value; apply(); });
    });
    var q = $("[data-filter-q]");
    if (q) q.addEventListener("input", function () { state.q = q.value.trim().toLowerCase(); apply(); });
    var pre = new URLSearchParams(location.search).get("category");
    if (pre) { var s = $('[data-filter="cat"]'); if (s) { s.value = pre; state.cat = pre; } }
    apply();
  }

  // ---------- budget planner ----------
  var bp = $("[data-budget-planner]");
  if (bp) {
    var total = $("#bp-total"), rows = $$("[data-bp-row]", bp);
    function fmt(n) { return "$" + Math.round(n).toLocaleString(); }
    function calc() {
      var t = +total.value || 0, used = 0;
      rows.forEach(function (r) {
        var pct = +$("input", r).value || 0; used += pct;
        $("output", r).textContent = fmt(t * pct / 100);
      });
      $("#bp-used").textContent = used + "%";
      $("#bp-used").className = used === 100 ? "ok" : "warn";
    }
    bp.addEventListener("input", calc); calc();
  }

  // ---------- forms: AJAX submit to Formspree, then go to thank-you page ----------
  $$("form[data-ajax]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      if (f.action.indexOf("formspree.io") === -1) return; // not configured: let browser handle
      e.preventDefault();
      var btn = $("button[type=submit]", f); if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      fetch(f.action, { method: "POST", body: new FormData(f), headers: { Accept: "application/json" } })
        .then(function (r) { if (!r.ok) throw 0; location.href = f.getAttribute("data-next") || "/thanks/"; })
        .catch(function () { if (btn) { btn.disabled = false; btn.textContent = "Try again"; } alert("Sorry, that didn't go through. Please try again in a moment."); });
    });
  });

  // ---------- big lucky date coming up? show the banner ----------
  var lb = $("[data-lucky-banner]");
  if (lb && L) {
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
})();
