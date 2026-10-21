/* Vegas wedding countdown: live timer, shareable link, story/square images, calendar file, embed code.
   Everything lives in the link (?n=&d=&t=&v=) and this browser. Nothing is sent to a server. */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var root = $("[data-countdown]");
  if (!root) return;
  var SITE = root.getAttribute("data-site") || "https://uniquevegasweddings.com";
  var PATH = "/tools/wedding-countdown/";
  var VENUES = {};
  try { JSON.parse($("#cd-venues").textContent).forEach(function (v) { VENUES[v.s] = v.n; }); } catch (e) {}
  var L = window.UVWLucky;
  var KEY = "uvw_countdown";
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  var f = { n: $("#cd-n"), d: $("#cd-d"), t: $("#cd-t"), v: $("#cd-v") };
  var out = {
    names: $("[data-cd-names]"), lead: $("[data-cd-lead]"), days: $("[data-cd-days]"), hrs: $("[data-cd-hrs]"), min: $("[data-cd-min]"), sec: $("[data-cd-sec]"),
    date: $("[data-cd-date]"), venue: $("[data-cd-venue]"), lucky: $("[data-cd-lucky]"), units: $("[data-cd-units]"), empty: $("[data-cd-empty]"),
    actions: $("[data-cd-actions]"), list: $("[data-cd-list]"), embed: $("#cd-embed"), link: $("#cd-link")
  };

  // ---------- state ----------
  var clean = {
    n: function (s) { return String(s || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 48); },
    d: function (s) { return /^\d{4}-\d{2}-\d{2}$/.test(s || "") ? s : ""; },
    t: function (s) { return /^\d{2}:\d{2}$/.test(s || "") ? s : ""; },
    v: function (s) { return VENUES[s] ? s : ""; }
  };
  var qs = new URLSearchParams(location.search), saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) {}
  var fromLink = qs.has("d") || qs.has("n") || qs.has("v");
  var S = {};
  ["n", "d", "t", "v"].forEach(function (k) { S[k] = clean[k](fromLink ? qs.get(k) : saved[k]); });
  ["n", "d", "t", "v"].forEach(function (k) { if (f[k]) f[k].value = S[k]; });

  // ---------- Las Vegas time ----------
  var tzFmt = null;
  try { tzFmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }); } catch (e) {}
  function vegasToUtc(y, mo, d, h, mi) {
    var want = Date.UTC(y, mo - 1, d, h, mi), guess = want + 8 * 3600e3;
    if (!tzFmt) return guess;
    for (var i = 0; i < 3; i++) {
      var p = {}; tzFmt.formatToParts(new Date(guess)).forEach(function (x) { p[x.type] = +x.value; });
      var seen = Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute);
      guess += want - seen;
    }
    return guess;
  }
  function target() {
    if (!S.d) return null;
    var a = S.d.split("-").map(Number), tm = (S.t || "00:00").split(":").map(Number);
    return vegasToUtc(a[0], a[1], a[2], tm[0], tm[1]);
  }
  function fmtTime(t) { var h = +t.slice(0, 2), m = t.slice(3); return (h % 12 || 12) + (m === "00" ? "" : ":" + m) + (h < 12 ? " a.m." : " p.m."); }
  function longDate() {
    var a = S.d.split("-").map(Number), wd = new Date(a[0], a[1] - 1, a[2]).getDay();
    return DAYS[wd] + ", " + MONTHS[a[1] - 1] + " " + a[2] + ", " + a[0];
  }
  var TAG_ORDER = ["Triple match", "All one digit", "Perfect palindrome", "Palindrome", "Sequential", "Leap Day", "Lucky sevens", "Lucky eights", "Mirror date", "Valentine's Day"];
  function bestTag(tags) { for (var i = 0; i < TAG_ORDER.length; i++) if (tags.indexOf(TAG_ORDER[i]) > -1) return TAG_ORDER[i]; return tags[0]; }
  function title() { return S.n || "Our wedding"; }
  function shareUrl(extra) {
    var u = new URL(SITE + PATH);
    ["n", "d", "t", "v"].forEach(function (k) { if (S[k]) u.searchParams.set(k, S[k]); });
    if (extra) Object.keys(extra).forEach(function (k) { u.searchParams.set(k, extra[k]); });
    return u.toString();
  }
  function track(ev, p) { try { if (window.gtag) window.gtag("event", ev, p || {}); } catch (e) {} }

  // ---------- render ----------
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  var lastKey = "";
  function tick() {
    var T = target(), has = !!T;
    out.empty.hidden = has; out.units.hidden = !has; out.actions.hidden = !has;
    out.names.textContent = title();
    if (!has) { out.lead.textContent = "Pick your date to start the clock"; return; }
    var diff = T - Date.now(), past = diff < 0, ad = Math.abs(diff);
    var d = Math.floor(ad / 864e5), h = Math.floor(ad % 864e5 / 36e5), m = Math.floor(ad % 36e5 / 6e4), s = Math.floor(ad % 6e4 / 1e3);
    out.days.textContent = d.toLocaleString("en-US"); out.hrs.textContent = pad(h); out.min.textContent = pad(m); out.sec.textContent = pad(s);
    out.lead.textContent = past ? (d === 0 ? "Just married. Today's the day" : "Married and counting") : (d === 0 ? "It's wedding day" : "until we say I do");
    root.classList.toggle("is-past", past);
    var key = JSON.stringify(S);
    if (key !== lastKey) { lastKey = key; renderStatic(); }
  }
  function renderStatic() {
    out.date.textContent = longDate() + (S.t ? " · " + fmtTime(S.t) + " Las Vegas time" : "");
    if (S.v) { out.venue.hidden = false; out.venue.innerHTML = ""; var a = document.createElement("a"); a.href = "/venues/" + S.v + "/"; a.textContent = "at " + VENUES[S.v]; out.venue.appendChild(a); }
    else { out.venue.hidden = false; out.venue.textContent = "in Las Vegas"; }
    var a2 = S.d.split("-").map(Number), info = L ? L.analyze(a2[0], a2[1], a2[2]) : null;
    if (info && info.tags.length) { out.lucky.hidden = false; out.lucky.innerHTML = "&#10022; Lucky date: " + info.tags.join(" + ").replace(/</g, "&lt;") + ' <a href="/lucky-wedding-dates/">See all</a>'; }
    else out.lucky.hidden = true;
    var url = shareUrl();
    out.link.value = url;
    var q = url.split("?")[1] || "";
    out.embed.value = '<iframe src="' + SITE + PATH + 'embed/?' + q + '" title="Wedding countdown" width="100%" height="230" style="border:0;max-width:520px" loading="lazy"></iframe>\n<p style="font:13px sans-serif;margin:4px 0"><a href="' + SITE + PATH + '?utm_source=countdown-embed&amp;utm_medium=referral">Las Vegas wedding countdown</a> by Unique Vegas Weddings</p>';
    renderChecklist();
  }

  // ---------- checklist (dates relative to the wedding) ----------
  var STEPS = [
    [-365, "Your marriage license window opens", "A Clark County license is valid for one year after it's issued, with no waiting period. Most couples get it a day or two before.", "/guides/las-vegas-marriage-license/"],
    [-30, "Confirm the details with your venue", "Final guest count, payments, timings and who's officiating. Ask for everything in writing.", ""],
    [-14, "Pre-apply online for your license", "Filling in the application online ahead of time shortens your wait at the bureau.", "/guides/las-vegas-marriage-license/"],
    [-1, "Pick up your marriage license together", "Both of you go in person with valid ID. The fee is $102, and the Marriage License Bureau is open 8 a.m. to midnight every day.", "/guides/las-vegas-marriage-license/"],
    [0, "Wedding day", "Bring the license and at least one witness. Then go enjoy it.", ""],
    [14, "Order certified copies of your certificate", "You'll need them for name changes, insurance and travel documents.", "/guides/las-vegas-marriage-certificate-copies/"]
  ];
  function renderChecklist() {
    var a = S.d.split("-").map(Number), base = new Date(a[0], a[1] - 1, a[2]), today = new Date(); today.setHours(0, 0, 0, 0);
    out.list.innerHTML = "";
    STEPS.forEach(function (st) {
      var dt = new Date(base); dt.setDate(dt.getDate() + st[0]);
      var li = document.createElement("li"), passed = dt < today, open = st[0] === -365;
      if (passed && !open && st[0] !== 0) li.className = "is-done";
      var when = document.createElement("span"); when.className = "cd-when";
      when.textContent = passed && open ? "Open now" : MONTHS[dt.getMonth()].slice(0, 3) + " " + dt.getDate() + ", " + dt.getFullYear();
      var h = document.createElement("strong"); h.textContent = st[1];
      var p = document.createElement("span"); p.textContent = " " + st[2] + " ";
      li.appendChild(when); li.appendChild(h); li.appendChild(p);
      if (st[3]) { var lk = document.createElement("a"); lk.href = st[3]; lk.textContent = "How it works"; li.appendChild(lk); }
      out.list.appendChild(li);
    });
  }

  // ---------- inputs ----------
  var created = false;
  function onInput() {
    ["n", "d", "t", "v"].forEach(function (k) { S[k] = clean[k](f[k] ? f[k].value : ""); });
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
    try { var u = new URL(location.href); ["n", "d", "t", "v"].forEach(function (k) { if (S[k]) u.searchParams.set(k, S[k]); else u.searchParams.delete(k); }); history.replaceState(null, "", u); } catch (e) {}
    if (S.d && !created) { created = true; track("countdown_create", { venue: S.v || "none" }); }
    lastKey = ""; tick();
  }
  ["n", "d", "t", "v"].forEach(function (k) { if (f[k]) { f[k].addEventListener("input", onInput); f[k].addEventListener("change", onInput); } });
  var min = new Date(); min.setFullYear(min.getFullYear() - 5); if (f.d) f.d.min = min.toISOString().slice(0, 10);

  // ---------- share + copy ----------
  function flash(btn, txt) { var o = btn.getAttribute("data-label") || btn.textContent; btn.setAttribute("data-label", o); btn.textContent = txt; setTimeout(function () { btn.textContent = o; }, 1800); }
  function copy(text, btn) {
    var ok = function () { flash(btn, "Copied"); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, function () { fallback(); });
    else fallback();
    function fallback() { var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); ok(); } catch (e) {} ta.remove(); }
  }
  root.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cd]"); if (!b) return;
    var act = b.getAttribute("data-cd");
    if (act === "copy") { copy(shareUrl({ utm_source: "countdown-share", utm_medium: "referral" }), b); track("countdown_share", { method: "copy" }); }
    if (act === "share") {
      var data = { title: title() + " countdown", text: "Counting down to " + longDate() + " in Las Vegas", url: shareUrl({ utm_source: "countdown-share", utm_medium: "referral" }) };
      if (navigator.share) navigator.share(data).then(function () { track("countdown_share", { method: "native" }); }, function () {});
      else { copy(data.url, b); track("countdown_share", { method: "copy" }); }
    }
    if (act === "story" || act === "square") { drawImage(act); track("countdown_download", { format: act }); }
    if (act === "ics") { downloadIcs(); track("countdown_download", { format: "calendar" }); }
    if (act === "embed") { var box = $("[data-cd-embedbox]"); box.hidden = !box.hidden; if (!box.hidden) out.embed.select(); }
    if (act === "copy-embed") { copy(out.embed.value, b); track("countdown_embed_copy"); }
  });

  // ---------- calendar file ----------
  function downloadIcs() {
    var a = S.d.replace(/-/g, ""), end = new Date(S.d + "T00:00:00Z"); end.setUTCDate(end.getUTCDate() + 1);
    var endS = end.toISOString().slice(0, 10).replace(/-/g, "");
    var esc = function (s) { return String(s).replace(/([,;\\])/g, "\\$1"); };
    var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Unique Vegas Weddings//Countdown//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
      "UID:" + a + "-" + Math.random().toString(36).slice(2) + "@uniquevegasweddings.com",
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z"];
    if (S.t) {
      var st = new Date(target()), en = new Date(target() + 2 * 3600e3), z = function (d) { return d.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z"; };
      lines.push("DTSTART:" + z(st), "DTEND:" + z(en));
    } else lines.push("DTSTART;VALUE=DATE:" + a, "DTEND;VALUE=DATE:" + endS);
    lines.push("SUMMARY:" + esc(title() + " 💍"), "LOCATION:" + esc(S.v ? VENUES[S.v] + ", Las Vegas" : "Las Vegas, NV"),
      "DESCRIPTION:" + esc("Countdown: " + shareUrl()), "URL:" + shareUrl(), "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:Pick up your marriage license", "TRIGGER:-P1D", "END:VALARM", "END:VEVENT", "END:VCALENDAR");
    save(new Blob([lines.join("\r\n")], { type: "text/calendar" }), "wedding-" + S.d + ".ics");
  }
  function save(blob, name) {
    var u = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
  }

  // ---------- share image (canvas) ----------
  function drawImage(kind) {
    var W = 1080, H = kind === "story" ? 1920 : 1350;
    var c = document.createElement("canvas"); c.width = W; c.height = H;
    var x = c.getContext("2d");
    var go = function () {
      var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#FFFBF8"); g.addColorStop(1, "#F6E4E1");
      x.fillStyle = g; x.fillRect(0, 0, W, H);
      // soft arcs
      x.strokeStyle = "rgba(183,110,121,.16)"; x.lineWidth = 2;
      for (var i = 0; i < 4; i++) { x.beginPath(); x.arc(W / 2, H * 0.47, 330 + i * 46, 0, Math.PI * 2); x.stroke(); }
      x.textAlign = "center"; x.textBaseline = "alphabetic";
      var cy = kind === "story" ? 330 : 190;
      // ring mark
      x.save(); x.translate(W / 2, cy - 70); x.strokeStyle = "#B76E79"; x.lineWidth = 5; x.beginPath(); x.arc(0, 18, 22, 0, Math.PI * 2); x.stroke();
      x.fillStyle = "#B76E79"; x.beginPath(); x.moveTo(0, -26); x.quadraticCurveTo(2.5, -14, 14, -11.5); x.quadraticCurveTo(2.5, -9, 0, 3); x.quadraticCurveTo(-2.5, -9, -14, -11.5); x.quadraticCurveTo(-2.5, -14, 0, -26); x.fill(); x.restore();
      x.fillStyle = "#5E7356"; x.font = "600 26px Inter, sans-serif"; spaced("WEDDING COUNTDOWN", W / 2, cy + 22, 7);
      fit("500 76px 'Playfair Display', serif", title(), W - 140, cy + 130, "#2B2B2E", 76);
      var T = target(), diff = T - Date.now(), past = diff < 0, d = Math.floor(Math.abs(diff) / 864e5);
      var mid = kind === "story" ? 950 : 670;
      x.fillStyle = "#8E4F5A"; x.font = "500 " + (d > 999 ? 250 : 300) + "px 'Playfair Display', serif"; x.fillText(d.toLocaleString("en-US"), W / 2, mid);
      x.fillStyle = "#2B2B2E"; x.font = "italic 500 60px 'Playfair Display', serif";
      x.fillText(past ? (d === 1 ? "day married" : "days married") : (d === 1 ? "day to go" : "days to go"), W / 2, mid + 135);
      x.fillStyle = "#5B5558"; x.font = "500 34px Inter, sans-serif"; x.fillText(longDate(), W / 2, mid + 230);
      fit("500 34px Inter, sans-serif", S.v ? VENUES[S.v] + " · Las Vegas" : "Las Vegas, Nevada", W - 160, mid + 282, "#5B5558", 34);
      var a = S.d.split("-").map(Number), info = L ? L.analyze(a[0], a[1], a[2]) : null;
      if (info && info.tags.length) { x.fillStyle = "#B76E79"; x.font = "600 28px Inter, sans-serif"; spaced(("✦ " + bestTag(info.tags) + " ✦").toUpperCase(), W / 2, mid + 350, 3); }
      // footer
      var fy = H - (kind === "story" ? 170 : 110);
      x.fillStyle = "#2B2B2E"; x.beginPath(); roundRect(x, W / 2 - 330, fy - 58, 660, 92, 46); x.fill();
      x.fillStyle = "#FFFBF8"; x.font = "500 30px Inter, sans-serif"; x.fillText("uniquevegasweddings.com/countdown", W / 2, fy);
      x.fillStyle = "#5B5558"; x.font = "500 24px Inter, sans-serif"; x.fillText("Make your own free countdown", W / 2, fy + 76);
      c.toBlob(function (b) { if (b) save(b, "wedding-countdown-" + kind + ".png"); }, "image/png");
    };
    function spaced(t, cx, y, sp) { var w = 0, ch = t.split(""); ch.forEach(function (k) { w += x.measureText(k).width + sp; }); w -= sp; var px = cx - w / 2; x.textAlign = "left"; ch.forEach(function (k) { x.fillText(k, px, y); px += x.measureText(k).width + sp; }); x.textAlign = "center"; }
    function fit(font, text, maxW, y, color, size) { var s = size; x.fillStyle = color; do { x.font = font.replace(/\d+px/, s + "px"); s -= 2; } while (x.measureText(text).width > maxW && s > 18); x.fillText(text, W / 2, y); }
    function roundRect(ctx, rx, ry, w, h, r) { ctx.moveTo(rx + r, ry); ctx.arcTo(rx + w, ry, rx + w, ry + h, r); ctx.arcTo(rx + w, ry + h, rx, ry + h, r); ctx.arcTo(rx, ry + h, rx, ry, r); ctx.arcTo(rx, ry, rx + w, ry, r); ctx.closePath(); }
    if (document.fonts && document.fonts.load) Promise.all([document.fonts.load("500 76px 'Playfair Display'"), document.fonts.load("italic 500 60px 'Playfair Display'"), document.fonts.load("600 26px Inter"), document.fonts.load("500 30px Inter")]).then(go, go);
    else go();
  }

  tick();
  setInterval(tick, 1000);
  if (fromLink && S.d) track("countdown_view_shared", { venue: S.v || "none" });
})();
