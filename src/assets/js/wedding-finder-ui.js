/* Wedding finder page. Answers stay in memory for this visit only. */
(function () {
  var F = window.UVWFinder;
  var root = document.querySelector("[data-finder]");
  if (!F || !root) return;

  var venues = [];
  try { venues = JSON.parse((document.getElementById("wf-venues") || {}).textContent || "[]"); } catch (e) { venues = []; }

  var state = {
    screen: "intro",
    mode: "separate",
    partner: 1,
    step: 0,
    a: {},
    b: {},
    result: null
  };

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function questions() { return F.QUESTIONS; }

  function bag() { return state.partner === 2 ? state.b : state.a; }

  function partnerLabel() {
    if (state.mode !== "separate") return "Answering together";
    return state.partner === 2 ? "Partner 2" : "Partner 1";
  }

  function focusHeading() {
    var heading = root.querySelector("[data-wf-focus]");
    if (heading) heading.focus();
  }

  function choiceButtons(question, selected) {
    return question.options.map(function (opt) {
      var checked = selected === opt.id ? " checked" : "";
      return '<label class="wf-opt"><input type="radio" name="wf-choice" value="' + esc(opt.id) + '"' + checked + '><span>' + esc(opt.label) + "</span></label>";
    }).join("");
  }

  function renderIntro() {
    root.innerHTML = ''
      + '<div class="wf-screen">'
      + '<h2 data-wf-focus tabindex="-1">How do you want to answer?</h2>'
      + '<p>Six short questions. You can each answer on this phone, or answer once together. We don\'t save the answers, and we don\'t ask for an email.</p>'
      + '<div class="wf-actions">'
      + '<button class="btn btn-primary" type="button" data-wf="separate">Answer separately</button>'
      + '<button class="btn btn-ghost" type="button" data-wf="together">Answer together</button>'
      + "</div></div>";
    focusHeading();
  }

  function renderQuestion() {
    var list = questions();
    var question = list[state.step];
    var selected = bag()[question.id] || "";
    var total = list.length;
    root.innerHTML = ''
      + '<div class="wf-screen">'
      + '<p class="wf-progress" id="wf-progress">' + esc(partnerLabel()) + " · Question " + (state.step + 1) + " of " + total + "</p>"
      + '<div class="wf-bar" role="progressbar" aria-valuemin="1" aria-valuemax="' + total + '" aria-valuenow="' + (state.step + 1) + '" aria-valuetext="Question ' + (state.step + 1) + " of " + total + '"><span style="width:' + Math.round(((state.step + 1) / total) * 100) + '%"></span></div>'
      + '<form data-wf-form>'
      + '<fieldset class="wf-q"><legend data-wf-focus tabindex="-1">' + esc(question.prompt) + "</legend>"
      + (question.help ? '<p class="small" id="wf-help">' + esc(question.help) + "</p>" : "")
      + '<div class="wf-options"' + (question.help ? ' aria-describedby="wf-help"' : "") + ">" + choiceButtons(question, selected) + "</div>"
      + '<p class="wf-need" id="wf-need" hidden>Pick one answer. "Not sure" is a fine answer.</p>'
      + "</fieldset>"
      + '<div class="wf-actions">'
      + '<button class="btn btn-ghost" type="button" data-wf="back">Back</button>'
      + '<button class="btn btn-primary" type="submit">' + (state.step === total - 1 ? (state.mode === "separate" && state.partner === 1 ? "Partner 2's turn" : "See the three ideas") : "Next") + "</button>"
      + "</div></form>"
      + '<p class="small"><button class="link-btn" type="button" data-wf="restart">Start over</button></p>'
      + "</div>";
    focusHeading();
  }

  function renderHandoff() {
    root.innerHTML = ''
      + '<div class="wf-screen">'
      + '<h2 data-wf-focus tabindex="-1">Hand this to Partner 2</h2>'
      + "<p>Partner 1's answers stay on this page until you leave it. Partner 2 answers the same six questions. We won't mix in names or email addresses, because we never ask for them.</p>"
      + '<div class="wf-actions">'
      + '<button class="btn btn-ghost" type="button" data-wf="back">Back</button>'
      + '<button class="btn btn-primary" type="button" data-wf="handoff">Partner 2 is ready</button>'
      + "</div>"
      + '<p class="small"><button class="link-btn" type="button" data-wf="restart">Start over</button></p>'
      + "</div>";
    focusHeading();
  }

  function cardHtml(card, kind) {
    var gaps = card.gaps.length
      ? "<ul class=\"wf-gaps\">" + card.gaps.map(function (gap) { return "<li>" + esc(gap) + "</li>"; }).join("") + "</ul>"
      : "";
    var checked = card.checked ? '<p class="small">Listing checked ' + esc(card.checked) + ".</p>" : "";
    return '<article class="wf-card">'
      + "<h4><a href=\"" + esc(card.url) + "\">" + esc(card.name) + "</a></h4>"
      + "<p>" + esc(card.facts) + "</p>"
      + (kind === "fit" ? '<p class="wf-fit">Fits the limits we can check on this listing.</p>' : '<p class="wf-gaplabel">Not a match. Here is the gap:</p>' + gaps)
      + checked
      + '<p class="wf-cardlinks"><a href="' + esc(card.url) + '">Open the listing</a> · <a href="' + esc(card.plannerUrl) + '">Open the budget planner with this venue</a></p>'
      + "</article>";
  }

  function renderResults() {
    var result = state.result;
    var diff = result.differences.length
      ? '<section class="wf-diff"><h3>Where you answered differently</h3><ul>' + result.differences.map(function (line) { return "<li>" + esc(line) + "</li>"; }).join("") + "</ul></section>"
      : "";
    var concepts = result.concepts.map(function (concept, index) {
      var fits = concept.fits.length
        ? '<h4>Venues that fit the limits we can check</h4>' + concept.fits.map(function (card) { return cardHtml(card, "fit"); }).join("")
        : '<p class="wf-none">' + esc(concept.noneMessage) + "</p>";
      var alts = concept.alternatives.length
        ? '<h4>Same group, with the gap named</h4>' + concept.alternatives.map(function (card) { return cardHtml(card, "alt"); }).join("")
        : "";
      var pace = concept.paceNote ? "<p>" + esc(concept.paceNote) + "</p>" : "";
      var touches = '<h4>Ideas, not promises</h4><ul>' + concept.touches.map(function (touch) { return "<li>" + esc(touch) + "</li>"; }).join("") + "</ul>";
      return '<article class="panel wf-concept"><p class="wf-kicker">Idea ' + (index + 1) + " of 3</p><h3>" + esc(concept.title) + "</h3>"
        + "<p>" + esc(concept.summary) + "</p><p>" + esc(concept.why) + "</p>" + pace + touches
        + "<p>" + esc(concept.budgetNote) + "</p>" + fits + alts
        + '<p class="wf-cardlinks"><a href="' + esc(concept.categoryUrl) + '">See this whole venue group</a> · <a href="' + esc(concept.plannerUrl) + '">Open the budget planner</a></p>'
        + "</article>";
    }).join("");
    root.innerHTML = ''
      + '<div class="wf-screen" aria-live="polite">'
      + '<h2 data-wf-focus tabindex="-1">Three ways this could go</h2>'
      + "<p>Each idea uses the venue list on this site. A match means the published category, setting, guest maximum, and starting price line up with the answers. If a fact isn't on the listing, we don't treat it as a yes.</p>"
      + diff + concepts
      + '<div class="wf-actions">'
      + '<button class="btn btn-ghost" type="button" data-wf="edit">Edit answers</button>'
      + '<button class="btn btn-ghost" type="button" data-wf="copy">Copy these ideas</button>'
      + '<button class="btn btn-ghost" type="button" data-wf="restart">Start over</button>'
      + "</div>"
      + '<p class="small" id="wf-copy-note" hidden></p>'
      + '<label class="sr-only" for="wf-fallback">Wedding ideas to copy</label>'
      + '<textarea id="wf-fallback" class="wf-fallback" hidden readonly rows="8"></textarea>'
      + "</div>";
    focusHeading();
  }

  function renderConfirm() {
    root.innerHTML = ''
      + '<div class="wf-screen">'
      + '<h2 data-wf-focus tabindex="-1">Start over?</h2>'
      + "<p>This clears both sets of answers on this page. Nothing was saved anywhere else.</p>"
      + '<div class="wf-actions">'
      + '<button class="btn btn-primary" type="button" data-wf="confirm-restart">Yes, clear the answers</button>'
      + '<button class="btn btn-ghost" type="button" data-wf="cancel-restart">Keep them</button>'
      + "</div></div>";
    focusHeading();
  }

  function render() {
    if (state.screen === "intro") renderIntro();
    else if (state.screen === "question") renderQuestion();
    else if (state.screen === "handoff") renderHandoff();
    else if (state.screen === "confirm") renderConfirm();
    else renderResults();
  }

  function resetAll() {
    state.screen = "intro";
    state.mode = "separate";
    state.partner = 1;
    state.step = 0;
    state.a = {};
    state.b = {};
    state.result = null;
    state.returnScreen = "intro";
    render();
  }

  function showResults() {
    state.result = F.buildResults(state.mode, state.a, state.mode === "separate" ? state.b : state.a, venues);
    state.screen = "results";
    render();
  }

  function selectedChoice() {
    var picked = root.querySelector('input[name="wf-choice"]:checked');
    return picked ? picked.value : "";
  }

  function goNext() {
    var list = questions();
    var question = list[state.step];
    var value = selectedChoice();
    var need = root.querySelector("#wf-need");
    if (!value) {
      if (need) need.hidden = false;
      var first = root.querySelector('input[name="wf-choice"]');
      if (first) first.focus();
      return;
    }
    bag()[question.id] = value;
    if (state.step < list.length - 1) {
      state.step += 1;
      state.screen = "question";
      render();
      return;
    }
    if (state.mode === "separate" && state.partner === 1) {
      state.screen = "handoff";
      render();
      return;
    }
    showResults();
  }

  function goBack() {
    if (state.screen === "handoff") {
      state.partner = 1;
      state.step = questions().length - 1;
      state.screen = "question";
      render();
      return;
    }
    if (state.step > 0) {
      state.step -= 1;
      render();
      return;
    }
    if (state.mode === "separate" && state.partner === 2) {
      state.screen = "handoff";
      render();
      return;
    }
    state.screen = "intro";
    render();
  }

  function showCopyFallback(text, message) {
    var box = root.querySelector("#wf-fallback");
    var note = root.querySelector("#wf-copy-note");
    if (box) {
      box.hidden = false;
      box.value = text;
      box.focus();
      box.select();
    }
    if (note) { note.hidden = false; note.textContent = message; }
  }

  root.addEventListener("click", function (event) {
    var button = event.target.closest("[data-wf]");
    if (!button || !root.contains(button)) return;
    var action = button.getAttribute("data-wf");
    if (action === "separate" || action === "together") {
      state.mode = action;
      state.partner = 1;
      state.step = 0;
      state.screen = "question";
      render();
      return;
    }
    if (action === "back") { goBack(); return; }
    if (action === "handoff") {
      state.partner = 2;
      state.step = 0;
      state.screen = "question";
      render();
      return;
    }
    if (action === "edit") {
      state.partner = 1;
      state.step = 0;
      state.screen = "question";
      render();
      return;
    }
    if (action === "restart") {
      state.returnScreen = state.screen;
      state.screen = "confirm";
      render();
      return;
    }
    if (action === "confirm-restart") { resetAll(); return; }
    if (action === "cancel-restart") {
      state.screen = state.returnScreen || "intro";
      render();
      return;
    }
    if (action === "copy" && state.result) {
      var text = F.plainSummary(state.result);
      var note = root.querySelector("#wf-copy-note");
      function failed() {
        showCopyFallback(text, "Copy didn't work in this browser. The ideas are selected below. They stay on this page only.");
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          if (note) { note.hidden = false; note.textContent = "Copied. Paste it wherever you want to keep it. We don't store it."; }
        }).catch(failed);
      } else failed();
    }
  });

  root.addEventListener("submit", function (event) {
    var form = event.target.closest("[data-wf-form]");
    if (!form) return;
    event.preventDefault();
    goNext();
  });

  resetAll();
})();
