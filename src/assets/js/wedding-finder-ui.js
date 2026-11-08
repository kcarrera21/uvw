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
    if (state.mode !== "separate") return "Together";
    return state.partner === 2 ? "Partner 2’s turn" : "Partner 1’s turn";
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
      + '<h2 data-wf-focus tabindex="-1">Want a turn each, or one conversation?</h2>'
      + '<p>Same six questions either way. Taking turns is more fun if you don\'t peek. Your answers stay on this page. We don\'t ask for names or an email.</p>'
      + '<div class="wf-actions">'
      + '<button class="btn btn-primary" type="button" data-wf="separate">We\'ll each take a turn</button>'
      + '<button class="btn btn-ghost" type="button" data-wf="together">We\'ll answer together</button>'
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
      + '<p class="wf-need" id="wf-need" hidden>Pick the one that feels closest. The open option counts.</p>'
      + "</fieldset>"
      + '<div class="wf-actions">'
      + '<button class="btn btn-ghost" type="button" data-wf="back">Back</button>'
      + '<button class="btn btn-primary" type="submit">' + (state.step === total - 1 ? (state.mode === "separate" && state.partner === 1 ? "Hand the phone over" : "Show us the three ideas") : "Next question") + "</button>"
      + "</div></form>"
      + '<p class="small"><button class="link-btn" type="button" data-wf="restart">Start over</button></p>'
      + "</div>";
    focusHeading();
  }

  function renderHandoff() {
    root.innerHTML = ''
      + '<div class="wf-screen">'
      + '<h2 data-wf-focus tabindex="-1">Don\'t show them your answers</h2>'
      + "<p>Partner 2 gets the same six questions. The good part is seeing where you pictured the same hour, and where you didn't. Nothing here asks for a name or an email.</p>"
      + '<div class="wf-actions">'
      + '<button class="btn btn-ghost" type="button" data-wf="back">Back</button>'
      + '<button class="btn btn-primary" type="button" data-wf="handoff">Partner 2, it\'s yours</button>'
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
      + (kind === "fit" ? '<p class="wf-fit">This lines up with what the listing publishes.</p>' : '<p class="wf-gaplabel">Not a match. Here is what to check:</p>' + gaps)
      + checked
      + '<p class="wf-cardlinks"><a href="' + esc(card.url) + '">Read the listing</a> · <a href="' + esc(card.plannerUrl) + '">Take this venue to the budget planner</a></p>'
      + "</article>";
  }

  function renderResults() {
    var result = state.result;
    var diff = result.differences.length
      ? '<section class="wf-diff"><h3>Where you pictured it differently</h3><p>Neither answer cancels the other. Both show up below.</p><ul>' + result.differences.map(function (line) { return "<li>" + esc(line) + "</li>"; }).join("") + "</ul></section>"
      : "";
    var concepts = result.concepts.map(function (concept, index) {
      var fits = concept.fits.length
        ? '<h4>Places that line up</h4>' + concept.fits.map(function (card) { return cardHtml(card, "fit"); }).join("")
        : '<p class="wf-none">' + esc(concept.noneMessage) + "</p>";
      var alts = concept.alternatives.length
        ? '<h4>Same kind of place, once you check this</h4>' + concept.alternatives.map(function (card) { return cardHtml(card, "alt"); }).join("")
        : "";
      var pace = concept.paceNote ? "<p>" + esc(concept.paceNote) + "</p>" : "";
      var touches = '<h4>A few things you could bring to it</h4><ul>' + concept.touches.map(function (touch) { return "<li>" + esc(touch) + "</li>"; }).join("") + "</ul>";
      return '<article class="panel wf-concept"><p class="wf-kicker">Idea ' + (index + 1) + " of 3</p><h3>" + esc(concept.title) + "</h3>"
        + "<p>" + esc(concept.summary) + "</p><p>" + esc(concept.why) + "</p>" + pace + touches
        + "<p>" + esc(concept.budgetNote) + "</p>" + fits + alts
        + '<p class="wf-cardlinks"><a href="' + esc(concept.categoryUrl) + '">See more places like this</a> · <a href="' + esc(concept.plannerUrl) + '">Add the rest of the costs</a></p>'
        + "</article>";
    }).join("");
    root.innerHTML = ''
      + '<div class="wf-screen" aria-live="polite">'
      + '<h2 data-wf-focus tabindex="-1">Three ways the hour could look</h2>'
      + "<p>Built from what you just said, and from venues already on this site. If a listing is missing a guest count, a price, or indoors versus outdoors, we say so instead of calling it a yes.</p>"
      + diff + concepts
      + '<div class="wf-actions">'
      + '<button class="btn btn-ghost" type="button" data-wf="edit">Change an answer</button>'
      + '<button class="btn btn-ghost" type="button" data-wf="copy">Copy this for the two of you</button>'
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
      + "<p>" + (state.mode === "separate" ? "This clears both of your answers on this page. We never saved them anywhere else." : "This clears the answers you gave together. We never saved them anywhere else.") + "</p>"
      + '<div class="wf-actions">'
      + '<button class="btn btn-primary" type="button" data-wf="confirm-restart">Yes, clear them</button>'
      + '<button class="btn btn-ghost" type="button" data-wf="cancel-restart">No, keep what we have</button>'
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
        showCopyFallback(text, "Copy didn’t work in this browser. The ideas are selected below. They stay on this page only.");
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          if (note) { note.hidden = false; note.textContent = "Copied. Paste it into a note for the two of you. We don’t keep a copy."; }
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
