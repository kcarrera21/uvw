/* Wedding finder. Deterministic matching against the venue list.
   No personality score, no saved answers. Exposes globalThis.UVWFinder. */
(function (root) {
  var ORDER = ["desert", "quirky", "historic", "sky", "luxury", "chapel"];
  var STYLES = {
    desert: {
      cat: "desert-outdoors",
      title: "Out where the sky does the decorating",
      summary: "Red rock or open desert, away from the ballrooms, and a ceremony that does not need a chandelier.",
      touches: [
        "If the month runs hot, ask about a morning time. That is a question for them, not a package they have promised.",
        "Leave a quiet half hour before the vows, so you are not climbing out of the car and straight into the ceremony."
      ],
      soon: "A lot of desert sites are public land and need a permit. If the date is close, ask how long that takes before you tell anyone it is set."
    },
    quirky: {
      cat: "quirky-pop-culture",
      title: "Only this city would put a wedding here",
      summary: "A room your friends will describe twice, because it does not exist anywhere else.",
      touches: [
        "Bring one thing that is yours: a song, a jacket, a snack you both love. Check the listing before you assume costumes or outside vendors are welcome.",
        "If you want a few photos after, ask whether that time is part of the hour."
      ],
      soon: "Some of these rooms only hold a few ceremonies a day. Ask what is actually open this month."
    },
    historic: {
      cat: "historic-iconic",
      title: "Somewhere the city already has a story",
      summary: "A place that was here before the current skyline, not a ballroom that could be anywhere.",
      touches: [
        "Read the house rules on touching, confetti, and music. A lot of these are museums or landmarks first.",
        "Pick the one photo you want from the room, then let the rest of the hour be the ceremony."
      ],
      soon: "Landmark rooms are often by appointment. A close date is worth asking about. It is not a yes until they say so."
    },
    sky: {
      cat: "sky-high",
      title: "Up where the view is the room",
      summary: "A tower, a wheel, or a flight. The listing says what you can actually see from there.",
      touches: [
        "Talk about the view and about the people you are bringing. Cabins and aircraft only hold so many.",
        "If anyone hates heights or tight spaces, say so before you book. That is between you, not a promise from the venue."
      ],
      soon: "Flights and observation decks run on a schedule. Ask what a near date can still hold."
    },
    luxury: {
      cat: "strip-luxury",
      title: "Let the resort run the hour",
      summary: "A property that already hosts events, with rooms upstairs if you want the night to stay put.",
      touches: [
        "When you write them, ask about the ceremony, the meal, and the rooms as three separate lines. The starting price is rarely the whole number.",
        "If anyone in your group is under 21, ask for a way through that does not leave them on a casino floor."
      ],
      soon: "Weekends at the big resorts go first. A close date may mean a weekday, or a smaller room. Ask before you hold the night."
    },
    chapel: {
      cat: "classic-chapels",
      title: "A chapel, then the night is yours",
      summary: "Say it, sign it, and go have the dinner you actually want.",
      touches: [
        "Look at what the published package names. The officiant, photos, and a witness are often separate.",
        "The room is for the people who need to be there. Everyone else can meet you after."
      ],
      soon: "A chapel is the usual path when the date is close. Still ask before you tell anyone the hour is held."
    }
  };

  var QUESTIONS = [
    {
      id: "place",
      prompt: "Picture the moment you say “we do.” What’s around you?",
      options: [
        { id: "desert", label: "Red rock, open desert, and a lot of sky", styles: { desert: 3 } },
        { id: "historic", label: "A building that was here before the neon", styles: { historic: 3 } },
        { id: "sky", label: "Up high, with the view around us", styles: { sky: 3 } },
        { id: "chapel", label: "A little chapel, then the night is ours", styles: { chapel: 3 } },
        { id: "quirky", label: "A room that only exists in Las Vegas", styles: { quirky: 3 } },
        { id: "luxury", label: "A resort, and let their team run the hour", styles: { luxury: 3 } },
        { id: "unsure", label: "We’re still picturing it", styles: {} }
      ]
    },
    {
      id: "setting",
      prompt: "Sun on your face, or a roof over your head?",
      options: [
        { id: "indoor", label: "Inside, with a roof and the air conditioning" },
        { id: "outdoor", label: "Outside, even if the afternoon runs hot" },
        { id: "either", label: "Either. We’ll know when we see the spot" }
      ]
    },
    {
      id: "guests",
      prompt: "Who do you want in the room for the vows?",
      help: "Count the ceremony itself. The friends who fly in for dinner can be a longer list.",
      options: [
        { id: "us", label: "Just the two of us", guests: 2 },
        { id: "handful", label: "A few favorite people, about 10", guests: 10 },
        { id: "party", label: "A small party, about 40", guests: 40 },
        { id: "bigger", label: "A full room, about 80", guests: 80 },
        { id: "crowd", label: "A real crowd, about 100 or more", guests: 100 },
        { id: "unsure", label: "We haven’t counted yet", guests: null }
      ]
    },
    {
      id: "ceremony",
      prompt: "What feels comfortable for the ceremony itself?",
      help: "This is the venue’s published starting price for the ceremony. Dinner, photos, the license, and flights sit outside it.",
      options: [
        { id: "modest", label: "Keep it modest. A published start under $1,000" },
        { id: "middle", label: "Somewhere in the middle, $1,000 to $2,999 to start" },
        { id: "higher", label: "We’re fine at $3,000 or more to start" },
        { id: "quote", label: "Happy to call and ask, if they don’t list a price" },
        { id: "unsure", label: "We’ll know when we see the number" }
      ]
    },
    {
      id: "pace",
      prompt: "How soon is this happening?",
      options: [
        { id: "soon", label: "Soon. Days, or a couple of weeks" },
        { id: "planned", label: "We can pick a date and plan toward it" },
        { id: "unsure", label: "The calendar is still open" }
      ]
    },
    {
      id: "touch",
      prompt: "What would make that hour feel like yours?",
      options: [
        { id: "elvis", label: "Elvis, or a theme with a wink", styles: { chapel: 2, quirky: 1 } },
        { id: "quiet", label: "Quiet, and more sky than soundtrack", styles: { desert: 2, sky: 1 } },
        { id: "food", label: "A few favorite people, then a really good dinner", styles: { luxury: 2, historic: 1 } },
        { id: "photos", label: "Photos somewhere people will recognize", styles: { historic: 2, sky: 1, quirky: 1 } },
        { id: "simple", label: "Keep it legal, short, and done", styles: { chapel: 2 } },
        { id: "surprise", label: "Something our friends didn’t see coming", styles: { quirky: 2, sky: 1 } },
        { id: "unsure", label: "We’ll know it when we’re standing there", styles: {} }
      ]
    }
  ];

  function option(questionId, optionId) {
    var q = QUESTIONS.filter(function (item) { return item.id === questionId; })[0];
    if (!q) return null;
    var found = q.options.filter(function (item) { return item.id === optionId; })[0];
    return found || null;
  }

  function blankScores() {
    var scores = {};
    ORDER.forEach(function (id) { scores[id] = 0; });
    return scores;
  }

  function addStyles(scores, styles) {
    if (!styles) return;
    Object.keys(styles).forEach(function (id) { if (scores[id] != null) scores[id] += styles[id]; });
  }

  function scoreAnswers(answers) {
    var scores = blankScores();
    answers = answers || {};
    ["place", "touch"].forEach(function (id) {
      var choice = option(id, answers[id]);
      if (choice) addStyles(scores, choice.styles);
    });
    return scores;
  }

  function rank(scores) {
    return ORDER.slice().sort(function (a, b) {
      var diff = (scores[b] || 0) - (scores[a] || 0);
      if (diff) return diff;
      return ORDER.indexOf(a) - ORDER.indexOf(b);
    });
  }

  function guestNeed(id) {
    var choice = option("guests", id);
    return choice ? choice.guests : null;
  }

  function sharedGuests(a, b, together) {
    var left = guestNeed(a && a.guests);
    var right = together ? left : guestNeed(b && b.guests);
    if (left == null) return right;
    if (right == null) return left;
    return Math.max(left, right);
  }

  function settingFor(owner, a, b, together) {
    var left = (a && a.setting) || "either";
    var right = together ? left : ((b && b.setting) || "either");
    if (together) return left === "unsure" ? "either" : left;
    if (owner === "a") return left === "either" || left === "unsure" ? (right === "indoor" || right === "outdoor" ? right : "either") : left;
    if (owner === "b") return right === "either" || right === "unsure" ? (left === "indoor" || left === "outdoor" ? left : "either") : right;
    if ((left === "indoor" && right === "outdoor") || (left === "outdoor" && right === "indoor")) return "either";
    if (left === "indoor" || left === "outdoor") return left;
    if (right === "indoor" || right === "outdoor") return right;
    return "either";
  }

  function priceFor(owner, a, b, together) {
    var left = (a && a.ceremony) || "unsure";
    var right = together ? left : ((b && b.ceremony) || "unsure");
    function known(id) { return id && id !== "unsure" ? id : null; }
    if (together) return known(left) || "flexible";
    if (owner === "a") return known(left) || known(right) || "flexible";
    if (owner === "b") return known(right) || known(left) || "flexible";
    if (known(left) && known(right) && known(left) !== known(right)) return "flexible";
    return known(left) || known(right) || "flexible";
  }

  function money(n) {
    return "$" + Number(n).toLocaleString("en-US");
  }

  function priceOk(venue, price) {
    if (price === "flexible" || price === "quote") return venue.priceFrom != null;
    if (venue.priceFrom == null) return false;
    if (price === "modest") return venue.priceFrom < 1000;
    if (price === "middle") return venue.priceFrom >= 1000 && venue.priceFrom < 3000;
    if (price === "higher") return venue.priceFrom >= 3000;
    return false;
  }

  function priceGap(venue, price) {
    if (price === "flexible" || price === "quote") {
      if (venue.priceFrom == null) {
        return price === "quote"
          ? "No published starting price. You’re happy to call and ask, but this is not a confirmed price match."
          : "No published starting price, so this isn’t listed as a price match.";
      }
      return "";
    }
    if (venue.priceFrom == null) return "No published starting price.";
    if (!priceOk(venue, price)) return "The published start is " + money(venue.priceFrom) + ", outside the ceremony range for this idea.";
    return "";
  }

  function settingGap(venue, setting) {
    var text = String(venue.setting || "");
    var lower = text.toLowerCase();
    if (setting !== "indoor" && setting !== "outdoor") return "";
    if (!text) return "The listing doesn’t say whether it’s indoors or outdoors.";
    if (setting === "indoor" && lower.indexOf("indoor") === -1) return "The listing says " + text + ", not indoors.";
    if (setting === "outdoor" && lower.indexOf("outdoor") === -1) return "The listing says " + text + ", not outdoors.";
    return "";
  }

  function guestGap(venue, guests) {
    if (!guests) return "";
    if (venue.guestMax == null) return "The guest maximum is not published. Ask before you count on this room.";
    if (venue.guestMax < guests) return "The published maximum is " + Number(venue.guestMax).toLocaleString("en-US") + " guests, under the " + guests.toLocaleString("en-US") + " you named.";
    return "";
  }

  function assess(venue, concept) {
    var gaps = [];
    if (venue.ceremony === false) gaps.push("Reception only. Not a ceremony match.");
    if (venue.category !== STYLES[concept.style].cat) gaps.push("Different venue group.");
    var setting = settingGap(venue, concept.setting);
    var guests = guestGap(venue, concept.guests);
    var price = priceGap(venue, concept.price);
    if (setting) gaps.push(setting);
    if (guests) gaps.push(guests);
    if (price) gaps.push(price);
    return { fit: gaps.length === 0, gaps: gaps };
  }

  function venueBits(venue) {
    var price = venue.priceFrom == null
      ? "No published starting price."
      : "Published start " + money(venue.priceFrom) + (venue.priceLabel ? " (" + venue.priceLabel + ")" : "") + ".";
    var guests = venue.guestMax == null
      ? "Guest maximum not published."
      : "Published maximum " + Number(venue.guestMax).toLocaleString("en-US") + " guests.";
    var setting = venue.setting ? "Setting: " + venue.setting + "." : "Indoor or outdoor not stated.";
    return [setting, price, guests].join(" ");
  }

  function pickVenues(venues, concept) {
    var pool = (venues || []).filter(function (venue) { return venue.category === STYLES[concept.style].cat && venue.ceremony !== false; });
    var fits = [];
    var alts = [];
    pool.forEach(function (venue) {
      var judged = assess(venue, concept);
      var card = {
        slug: venue.slug,
        name: venue.name,
        url: "/venues/" + venue.slug + "/",
        plannerUrl: "/tools/budget-planner/?venue=" + venue.slug,
        setting: venue.setting || "",
        priceFrom: venue.priceFrom,
        priceLabel: venue.priceLabel || "",
        guestMax: venue.guestMax,
        checked: venue.checked || "",
        fit: judged.fit,
        gaps: judged.gaps,
        facts: venueBits(venue)
      };
      if (judged.fit) fits.push(card);
      else alts.push(card);
    });
    function bySlug(a, b) { return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0; }
    fits.sort(function (a, b) {
      var ap = a.priceFrom == null ? 1 : 0;
      var bp = b.priceFrom == null ? 1 : 0;
      if (ap !== bp) return ap - bp;
      if (a.priceFrom != null && b.priceFrom != null && a.priceFrom !== b.priceFrom) return a.priceFrom - b.priceFrom;
      return bySlug(a, b);
    });
    alts.sort(function (a, b) {
      if (a.gaps.length !== b.gaps.length) return a.gaps.length - b.gaps.length;
      return bySlug(a, b);
    });
    return {
      fits: fits.slice(0, 3),
      alternatives: alts.slice(0, 3),
      fitCount: fits.length
    };
  }

  function whyText(mode, owner) {
    if (owner === "flexible") return "You left a lot of this open, so these three are starting points. They’re places to look, not a verdict on the two of you.";
    if (mode === "together") return "This is one way the answers you gave together could look. It’s an idea, not a label for the two of you.";
    if (owner === "both") return "This showed up in both of your answers.";
    if (owner === "a") return "This one leans toward what Partner 1 pictured. Partner 2’s picture is in another idea, with the same weight.";
    if (owner === "b") return "This one leans toward what Partner 2 pictured. Partner 1’s picture is in another idea, with the same weight.";
    return "This is a third picture, so you can see a direction neither of you named. It’s here to compare, not to talk either of you out of the other two.";
  }

  function budgetNote(price, mode, a, b) {
    var lead = "The figures on the cards are the venue’s published ceremony start, not the cost of the whole day. Dinner, photos, the license, and getting people here are separate. Add those in the budget planner. It stays blank until you type.";
    var names = { modest: "a ceremony start under $1,000", middle: "a ceremony start of $1,000 to $2,999", higher: "a ceremony start of $3,000 or more", quote: "calling to ask for a number", flexible: "leaving the starting price open" };
    var used = price === "flexible"
      ? "This idea stays open on price. A match still has a published starting price, so we aren’t guessing. "
      : price === "quote"
        ? "You’re happy to call and ask. A match still needs a published starting price, and a listing without one is not a confirmed price match. "
        : "This idea looks for " + names[price] + ". ";
    if (mode !== "together" && a && b && a.ceremony && b.ceremony && a.ceremony !== "unsure" && b.ceremony !== "unsure" && a.ceremony !== b.ceremony) {
      return "Partner 1 was picturing " + names[a.ceremony] + ". Partner 2 was picturing " + names[b.ceremony] + ". " + used + lead;
    }
    return used + lead;
  }

  function differences(mode, a, b) {
    if (mode === "together") return [];
    var rows = [];
    function label(q, id) {
      var choice = option(q, id);
      return choice ? choice.label : "Not answered";
    }
    if (a.place !== b.place) rows.push("The setting: Partner 1 pictured “" + label("place", a.place) + "”. Partner 2 pictured “" + label("place", b.place) + "”.");
    if (a.setting !== b.setting) rows.push("Inside or outside: Partner 1 said “" + label("setting", a.setting) + "”. Partner 2 said “" + label("setting", b.setting) + "”.");
    if (a.guests !== b.guests) rows.push("Who’s there: Partner 1 said “" + label("guests", a.guests) + "”. Partner 2 said “" + label("guests", b.guests) + "”. We used the larger number, so neither list gets cut.");
    if (a.ceremony !== b.ceremony) rows.push("The ceremony price: Partner 1 said “" + label("ceremony", a.ceremony) + "”. Partner 2 said “" + label("ceremony", b.ceremony) + "”.");
    if (a.pace !== b.pace) rows.push("The timing: Partner 1 said “" + label("pace", a.pace) + "”. Partner 2 said “" + label("pace", b.pace) + "”.");
    if (a.touch !== b.touch) rows.push("The personal bit: Partner 1 said “" + label("touch", a.touch) + "”. Partner 2 said “" + label("touch", b.touch) + "”.");
    return rows;
  }

  function buildResults(mode, answersA, answersB, venues) {
    var together = mode !== "separate";
    var a = answersA || {};
    var b = together ? a : (answersB || {});
    var aScores = scoreAnswers(a);
    var bScores = together ? aScores : scoreAnswers(b);
    var combined = blankScores();
    ORDER.forEach(function (id) { combined[id] = (aScores[id] || 0) + (together ? 0 : (bScores[id] || 0)); });
    if (together) ORDER.forEach(function (id) { combined[id] = aScores[id] || 0; });
    var ranked = rank(combined);
    var allZero = ranked.every(function (id) { return !combined[id]; });
    var chosen = [];
    function take(id) {
      if (!id || chosen.indexOf(id) !== -1 || chosen.length >= 3) return;
      chosen.push(id);
    }
    if (allZero) {
      chosen = ["desert", "quirky", "chapel"];
    } else {
      take(ranked[0]);
      if (!together) {
        take(rank(aScores)[0]);
        take(rank(bScores)[0]);
      }
      ranked.forEach(take);
    }
    var guests = sharedGuests(a, b, together);
    var concepts = chosen.map(function (style) {
      var as = aScores[style] || 0;
      var bs = together ? as : (bScores[style] || 0);
      var owner = allZero ? "flexible" : (together ? "together" : (as > 0 && bs > 0 ? "both" : as > 0 ? "a" : bs > 0 ? "b" : "fill"));
      var setting = settingFor(owner === "together" ? "both" : owner, a, b, together);
      var price = priceFor(owner === "together" ? "both" : owner, a, b, together);
      var concept = { style: style, setting: setting, guests: guests, price: price };
      var picked = pickVenues(venues, concept);
      var meta = STYLES[style];
      var pace = together ? a.pace : (owner === "a" ? a.pace : owner === "b" ? b.pace : (a.pace === "soon" || b.pace === "soon" ? "soon" : a.pace));
      var none = picked.fitCount === 0
        ? "Nothing in this group fits every limit we can check. The places below are the same kind of wedding, with the gap named. They are not matches."
        : "";
      return {
        id: style,
        title: meta.title,
        summary: meta.summary,
        why: whyText(together ? "together" : "separate", owner),
        touches: meta.touches,
        paceNote: pace === "soon" ? meta.soon : "",
        budgetNote: budgetNote(price, together ? "together" : "separate", a, b),
        setting: setting,
        guests: guests,
        price: price,
        fits: picked.fits,
        alternatives: picked.alternatives,
        fitCount: picked.fitCount,
        noneMessage: none,
        categoryUrl: "/venues/category/" + meta.cat + "/",
        plannerUrl: "/tools/budget-planner/"
      };
    });
    return {
      mode: together ? "together" : "separate",
      guestsUsed: guests,
      differences: differences(together ? "together" : "separate", a, b),
      concepts: concepts
    };
  }

  function plainSummary(result) {
    var lines = ["Three ways the hour could look, from Unique Vegas Weddings", "", "These come from your answers and the venues already on this site. They aren’t a booking, and they aren’t a read on the two of you."];
    if (result.differences && result.differences.length) {
      lines.push("", "Where you pictured it differently:");
      result.differences.forEach(function (line) { lines.push("- " + line); });
    }
    (result.concepts || []).forEach(function (concept) {
      lines.push("", concept.title, concept.summary, concept.why);
      if (concept.paceNote) lines.push(concept.paceNote);
      lines.push(concept.budgetNote);
      lines.push("A few things you could bring to it. Ask before you assume the venue includes them:");
      (concept.touches || []).forEach(function (touch) { lines.push("- " + touch); });
      if (concept.noneMessage) lines.push(concept.noneMessage);
      if (concept.fits && concept.fits.length) {
        lines.push("Places that line up with the listing:");
        concept.fits.forEach(function (card) { lines.push("- " + card.name + ". " + card.facts + " Listing: " + card.url); });
      }
      if (concept.alternatives && concept.alternatives.length) {
        lines.push("Same kind of place, not a full match:");
        concept.alternatives.forEach(function (card) { lines.push("- " + card.name + ". " + card.facts + " Gap: " + card.gaps.join(" ") + " Listing: " + card.url); });
      }
      lines.push("More in this group: " + concept.categoryUrl);
      lines.push("Budget planner: " + concept.plannerUrl);
    });
    lines.push("", "A starting price is the ceremony price the venue published. It is not the cost of the whole day.");
    return lines.join("\n");
  }

  root.UVWFinder = {
    QUESTIONS: QUESTIONS,
    STYLES: STYLES,
    ORDER: ORDER,
    option: option,
    scoreAnswers: scoreAnswers,
    buildResults: buildResults,
    assess: assess,
    plainSummary: plainSummary
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
