/* Wedding finder. Deterministic matching against the venue list.
   No personality score, no saved answers. Exposes globalThis.UVWFinder. */
(function (root) {
  var ORDER = ["desert", "quirky", "historic", "sky", "luxury", "chapel"];
  var STYLES = {
    desert: {
      cat: "desert-outdoors",
      title: "Desert light",
      summary: "Say the vows outside the neon, and let the landscape do the decorating.",
      touches: [
        "Ask about a morning time if the month runs hot. That is a question for the venue, not a package they have promised.",
        "Leave a quiet half hour before the vows so you are not stepping straight out of the car into the ceremony."
      ],
      soon: "Many desert sites are public land and need a permit. If you want a near date, ask about lead time before you settle on one."
    },
    quirky: {
      cat: "quirky-pop-culture",
      title: "Only in this city",
      summary: "A ceremony your friends will retell, in a place that does not exist anywhere else.",
      touches: [
        "Bring one detail that is yours: a song, a jacket, a snack. Check the listing before you assume props, costumes, or outside vendors are welcome.",
        "Plan a few minutes of photos after, only if the venue says that time is included."
      ],
      soon: "Some of these rooms book in short windows. Ask what is actually open this month instead of assuming a walk-in."
    },
    historic: {
      cat: "historic-iconic",
      title: "A place with a past",
      summary: "Marry somewhere the city already has a story, instead of a ballroom that could be anywhere.",
      touches: [
        "Read the house rules on touching, confetti, and music. Several of these places are museums or landmarks first.",
        "Pick one photo you want from the setting, then let the rest of the hour be the ceremony."
      ],
      soon: "Landmark rooms are often appointment-only. A soon date is a question, not a guarantee."
    },
    sky: {
      cat: "sky-high",
      title: "Above the city",
      summary: "Take the ceremony up: a tower, a wheel, or a flight, with the valley behind you.",
      touches: [
        "Decide whether the view or the comfort of your guests matters more. Cabins and aircraft cap the headcount.",
        "If anyone dislikes heights or tight spaces, say so before you book. That is a people question, not a venue promise."
      ],
      soon: "Flights and observation decks run on schedules. Ask what a near date can still hold."
    },
    luxury: {
      cat: "strip-luxury",
      title: "Let the resort carry it",
      summary: "Ceremony, rooms, and dinner on one property, with a team that already runs events.",
      touches: [
        "Ask for the ceremony, the meal, and the room block in one note, so the starting price is not the only number you see.",
        "If you are bringing anyone under 21, ask for a route that does not park them on a casino floor."
      ],
      soon: "Weekend dates at the big resorts go first. A soon wedding may mean a weekday, or a smaller room."
    },
    chapel: {
      cat: "classic-chapels",
      title: "Chapel, then the night is yours",
      summary: "A legal ceremony without a production, and the rest of the day left open.",
      touches: [
        "Confirm what the published package actually includes. Officiant, photos, and a witness are often separate.",
        "Keep the guest list to the people who need to be in the room. You can celebrate with everyone else afterward."
      ],
      soon: "Chapels are the usual path when the date is close. Still ask before you tell anyone the hour is held."
    }
  };

  var QUESTIONS = [
    {
      id: "place",
      prompt: "Where do you picture the ceremony?",
      options: [
        { id: "desert", label: "Out in the desert", styles: { desert: 3 } },
        { id: "historic", label: "Somewhere with a real history", styles: { historic: 3 } },
        { id: "sky", label: "Up high, with a view", styles: { sky: 3 } },
        { id: "chapel", label: "A classic chapel", styles: { chapel: 3 } },
        { id: "quirky", label: "Somewhere only Las Vegas would have", styles: { quirky: 3 } },
        { id: "luxury", label: "A resort that handles the details", styles: { luxury: 3 } },
        { id: "unsure", label: "Not sure yet", styles: {} }
      ]
    },
    {
      id: "setting",
      prompt: "Indoors or outdoors?",
      options: [
        { id: "indoor", label: "Indoors" },
        { id: "outdoor", label: "Outdoors" },
        { id: "either", label: "Either is fine" }
      ]
    },
    {
      id: "guests",
      prompt: "How many people need to be in the room?",
      help: "This is the ceremony headcount, not a whole guest-weekend list.",
      options: [
        { id: "us", label: "Just the two of you", guests: 2 },
        { id: "handful", label: "A handful, about 10", guests: 10 },
        { id: "party", label: "A small party, about 40", guests: 40 },
        { id: "bigger", label: "A larger group, about 80", guests: 80 },
        { id: "crowd", label: "A crowd, about 100 or more", guests: 100 },
        { id: "unsure", label: "We don't know yet", guests: null }
      ]
    },
    {
      id: "ceremony",
      prompt: "What feels comfortable for the ceremony's published starting price?",
      help: "This is not your whole wedding budget. Food, photos, the license, and guest travel are separate.",
      options: [
        { id: "modest", label: "Modest. A published start under $1,000" },
        { id: "middle", label: "Middle. A published start of $1,000 to $2,999" },
        { id: "higher", label: "Higher. A published start of $3,000 or more" },
        { id: "quote", label: "A quote is fine. No published price required" },
        { id: "unsure", label: "Flexible on the starting price" }
      ]
    },
    {
      id: "pace",
      prompt: "How soon do you want the ceremony?",
      options: [
        { id: "soon", label: "Soon. Days or a couple of weeks" },
        { id: "planned", label: "We can plan ahead" },
        { id: "unsure", label: "The timing is flexible" }
      ]
    },
    {
      id: "touch",
      prompt: "What would make the hour feel like yours?",
      options: [
        { id: "elvis", label: "A theme, Elvis included", styles: { chapel: 2, quirky: 1 } },
        { id: "quiet", label: "Quiet and a lot of sky", styles: { desert: 2, sky: 1 } },
        { id: "food", label: "A real meal after the vows", styles: { luxury: 2, historic: 1 } },
        { id: "photos", label: "Photos in a place people recognize", styles: { historic: 2, sky: 1, quirky: 1 } },
        { id: "simple", label: "Keep it legal and simple", styles: { chapel: 2 } },
        { id: "surprise", label: "Something our friends did not see coming", styles: { quirky: 2, sky: 1 } },
        { id: "unsure", label: "We'll know it when we see it", styles: {} }
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
          ? "No published starting price. You said a quote is fine, but this is not a confirmed price match."
          : "No published starting price, so it is not listed as a price match.";
      }
      return "";
    }
    if (venue.priceFrom == null) return "No published starting price.";
    if (!priceOk(venue, price)) return "Published start is " + money(venue.priceFrom) + ", outside the ceremony range for this idea.";
    return "";
  }

  function settingGap(venue, setting) {
    var text = String(venue.setting || "");
    var lower = text.toLowerCase();
    if (setting !== "indoor" && setting !== "outdoor") return "";
    if (!text) return "The listing does not say indoor or outdoor.";
    if (setting === "indoor" && lower.indexOf("indoor") === -1) return "Listing says " + text + ", not indoor.";
    if (setting === "outdoor" && lower.indexOf("outdoor") === -1) return "Listing says " + text + ", not outdoor.";
    return "";
  }

  function guestGap(venue, guests) {
    if (!guests) return "";
    if (venue.guestMax == null) return "Guest maximum is not published. Confirm it before you count on this room.";
    if (venue.guestMax < guests) return "Published maximum is " + Number(venue.guestMax).toLocaleString("en-US") + " guests, under the " + guests.toLocaleString("en-US") + " you named.";
    return "";
  }

  function assess(venue, concept) {
    var gaps = [];
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
    var pool = (venues || []).filter(function (venue) { return venue.category === STYLES[concept.style].cat; });
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
    if (owner === "flexible") return "The questions were left open, so these three are starting points, not a read on who you are.";
    if (mode === "together") return "This is one direction in the answers you gave together. It is not a label for you as a couple.";
    if (owner === "both") return "You both gave this some weight.";
    if (owner === "a") return "This follows Partner 1 more closely. Partner 2's answers show up in another idea.";
    if (owner === "b") return "This follows Partner 2 more closely. Partner 1's answers show up in another idea.";
    if (owner === "flexible") return "You both left this open, so these three are starting points, not a read on who you are.";
    return "This is here so you can see a third, different direction. Neither of you has to prefer it.";
  }

  function budgetNote(price, mode, a, b) {
    var lead = "The figures on the venue cards are published starting prices for a ceremony, not the cost of the whole day. The license, photos, food, and guest travel are separate. The budget planner is where those get added. Nothing here fills that planner in for you.";
    var names = { modest: "a published start under $1,000", middle: "a published start of $1,000 to $2,999", higher: "a published start of $3,000 or more", quote: "that a quote is fine", flexible: "any published starting price" };
    var used = price === "flexible"
      ? "No single ceremony price was required. Venues with no published start are not called a price match. "
      : price === "quote"
        ? "A quote is fine, but a match still needs a published starting price so we are not guessing. Listings without one are shown separately. "
        : "This idea looks for " + names[price] + ". ";
    if (mode !== "together" && a && b && a.ceremony && b.ceremony && a.ceremony !== "unsure" && b.ceremony !== "unsure" && a.ceremony !== b.ceremony) {
      return "Partner 1 said " + names[a.ceremony] + ". Partner 2 said " + names[b.ceremony] + ". " + used + lead;
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
    if (a.place !== b.place) rows.push("Place: Partner 1 said “" + label("place", a.place) + "”. Partner 2 said “" + label("place", b.place) + "”.");
    if (a.setting !== b.setting) rows.push("Indoors or outdoors: Partner 1 said “" + label("setting", a.setting) + "”. Partner 2 said “" + label("setting", b.setting) + "”.");
    if (a.guests !== b.guests) rows.push("Guest count: Partner 1 said “" + label("guests", a.guests) + "”. Partner 2 said “" + label("guests", b.guests) + "”. The larger known count is the one we used.");
    if (a.ceremony !== b.ceremony) rows.push("Ceremony price: Partner 1 said “" + label("ceremony", a.ceremony) + "”. Partner 2 said “" + label("ceremony", b.ceremony) + "”.");
    if (a.pace !== b.pace) rows.push("Timing: Partner 1 said “" + label("pace", a.pace) + "”. Partner 2 said “" + label("pace", b.pace) + "”.");
    if (a.touch !== b.touch) rows.push("Personal note: Partner 1 said “" + label("touch", a.touch) + "”. Partner 2 said “" + label("touch", b.touch) + "”.");
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
        ? "Nothing in this group fits every limit we can check. The places below are in the same group, with the gap named. They are not matches."
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
    var lines = ["Wedding ideas from Unique Vegas Weddings", "", "These compare your answers with venues already listed on the site. They are not a booking, and not a read on who you are."];
    if (result.differences && result.differences.length) {
      lines.push("", "Where the answers differ:");
      result.differences.forEach(function (line) { lines.push("- " + line); });
    }
    (result.concepts || []).forEach(function (concept) {
      lines.push("", concept.title, concept.summary, concept.why);
      if (concept.paceNote) lines.push(concept.paceNote);
      lines.push(concept.budgetNote);
      lines.push("Ideas, not promises:");
      (concept.touches || []).forEach(function (touch) { lines.push("- " + touch); });
      if (concept.noneMessage) lines.push(concept.noneMessage);
      if (concept.fits && concept.fits.length) {
        lines.push("Venues that fit the limits we can check:");
        concept.fits.forEach(function (card) { lines.push("- " + card.name + ". " + card.facts + " Listing: " + card.url); });
      }
      if (concept.alternatives && concept.alternatives.length) {
        lines.push("Same group, not a full match:");
        concept.alternatives.forEach(function (card) { lines.push("- " + card.name + ". " + card.facts + " Gap: " + card.gaps.join(" ") + " Listing: " + card.url); });
      }
      lines.push("More in this group: " + concept.categoryUrl);
      lines.push("Budget planner: " + concept.plannerUrl);
    });
    lines.push("", "Starting prices are ceremony prices the venue published. They are not a full wedding cost.");
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
