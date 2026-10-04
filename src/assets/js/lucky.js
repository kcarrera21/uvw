/* Lucky & special wedding date engine.
   Pure date math, so it never goes stale: works for any year, in the browser
   and at build time. Exposes window.UVWLucky (or globalThis.UVWLucky). */
(function (root) {
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  function isPal(s) { return s.length > 2 && s === s.split("").reverse().join(""); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function consecutive(s, dir) {
    if (s.length < 4) return false;
    for (var i = 1; i < s.length; i++) if (+s[i] - +s[i - 1] !== dir) return false;
    return true;
  }
  function sevens(s) { return (s.match(/7/g) || []).length; }

  function analyze(y, m, d) {
    var yy = y % 100, YY = pad(yy);
    var us = "" + m + d + YY;                     // 7/27/27 -> 72727
    var usPad = pad(m) + pad(d) + YY;             // 07/27/27 -> 072727
    var full = pad(m) + pad(d) + y;               // 07272027
    var intl = "" + d + m + YY;                   // 27/7/27 -> 27727
    var dt = new Date(y, m - 1, d);
    var wd = dt.getDay();
    var tags = [], score = 0;

    if (m === d && d === yy) { tags.push("Triple match"); score += 10; }
    else if (/^(\d)\1+$/.test(us)) { tags.push("All one digit"); score += 10; }
    else {
      if (m === d) { tags.push("Mirror date"); score += 4; }
      if (d === yy) { tags.push("Day matches year"); score += 4; }
      if (m === yy) { tags.push("Month matches year"); score += 3; }
    }
    if (isPal(full)) { tags.push("Perfect palindrome"); score += 9; }
    else if (isPal(usPad) || isPal(us)) { tags.push("Palindrome"); score += 6; }
    else if (isPal(intl) && intl.length >= 4) { tags.push("Palindrome (day/month)"); score += 4; }
    if (consecutive(us, 1) || consecutive(us, -1)) { tags.push("Sequential"); score += 7; }
    var s7 = sevens(us);
    if (s7 >= 3) { tags.push("Lucky sevens"); score += 2 + s7; }
    if (m === 2 && d === 14) { tags.push("Valentine's Day"); score += 5; }
    if (m === 2 && d === 29) { tags.push("Leap Day"); score += 7; }
    if (m === 12 && d === 31) { tags.push("New Year's Eve"); score += 4; }
    if (m === 10 && d === 31) { tags.push("Halloween"); score += 3; }
    if (m === 12 && d === 12) { /* already mirror */ }
    if (d === 13 && wd === 5) { tags.push("Friday the 13th (for the bold)"); score += 3; }
    if (score > 0 && (wd === 6 || wd === 5)) score += 1;

    return {
      y: y, m: m, d: d, iso: y + "-" + pad(m) + "-" + pad(d),
      short: m + "/" + d + "/" + YY,
      long: DAYS[wd] + ", " + MONTHS[m - 1] + " " + d + ", " + y,
      weekday: DAYS[wd], tags: tags, score: score
    };
  }

  function forYear(y, min) {
    min = min == null ? 4 : min;
    var out = [];
    for (var m = 1; m <= 12; m++) {
      var dim = new Date(y, m, 0).getDate();
      for (var d = 1; d <= dim; d++) {
        var a = analyze(y, m, d);
        if (a.score >= min) out.push(a);
      }
    }
    return out;
  }

  function upcoming(fromDate, count, min) {
    var y = fromDate.getFullYear(), res = [];
    var todayIso = fromDate.getFullYear() + "-" + pad(fromDate.getMonth() + 1) + "-" + pad(fromDate.getDate());
    while (res.length < count && y < fromDate.getFullYear() + 6) {
      var list = forYear(y, min);
      for (var i = 0; i < list.length && res.length < count; i++) if (list[i].iso >= todayIso) res.push(list[i]);
      y++;
    }
    return res;
  }

  function top(y, n) {
    return forYear(y, 4).slice().sort(function (a, b) { return b.score - a.score || (a.iso < b.iso ? -1 : 1); }).slice(0, n);
  }

  var api = { analyze: analyze, forYear: forYear, upcoming: upcoming, top: top, MONTHS: MONTHS };
  root.UVWLucky = api;
})(typeof window !== "undefined" ? window : globalThis);
