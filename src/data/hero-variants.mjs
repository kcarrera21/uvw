// Referral hero copy. The server-rendered headline is what crawlers and
// everyone else see. A tiny inline script swaps the same elements only
// when a visit matches. It does not touch the URL, so GA4 still records
// the original utm_ params.
//
// Try these (no layout change for a normal visit):
//   /?utm_source=pinterest&utm_content=desert-venues
//   /?utm_source=pinterest
//   /?utm_source=facebook
//   /?utm_source=instagram&utm_content=gothic-weddings
//   /?utm_campaign=packing-list
//   /?utm_content=marriage-license
//   /venues/?utm_content=venue-directory
// A Pinterest referrer with no utm also matches the Pinterest lines.
// Campaign and content keys win over a plain source or referrer match.

const pinRef = ["pinterest.com", "pinterest.co.uk", "pinterest.ca", "pinterest.com.au", "pin.it"];
const metaRef = ["facebook.com", "instagram.com", "fb.com"];

export const HERO_VARIANTS = [
  {
    id: "marriage-license",
    content: ["marriage-license", "license"],
    campaign: ["marriage-license", "license"],
    home: {
      title: "Get the license sorted, <em>then go celebrate.</em>",
      sub: "Clark County is $102, both of you in person, no waiting period, and the bureau is open until midnight. The guide walks the documents, the witness, and the morning of.",
      ctaHref: "/guides/las-vegas-marriage-license/",
      cta: "Read the license guide",
    },
    venues: {
      title: "License first, <em>then the place.</em>",
      sub: "Once the paperwork is clear, pick a room that fits the two of you. Every listing shows the price we checked and a link to book on the venue's own site.",
      ctaHref: "/guides/las-vegas-marriage-license/",
      cta: "Read the license guide",
    },
  },
  {
    id: "venue-directory",
    content: ["venue-directory", "venues", "directory"],
    campaign: ["venue-directory", "venues", "directory"],
    home: {
      title: "The long list of places that are not <em>a ballroom.</em>",
      sub: "Neon yards, ghost towns, canyon floors, chapels and a few rooms your friends will retell for years. Filter by budget and setting, then open any card for the checked price.",
      ctaHref: "/venues/",
      cta: "Browse the venues",
    },
    venues: {
      title: "Find the one that feels like <em>the two of you.</em>",
      sub: "Filter by setting and budget. Open a card for the price we checked, how many guests fit, and the official page where you actually book.",
      ctaHref: "/venues/",
      cta: "Start with all venues",
    },
  },
  {
    id: "packing-list",
    content: ["packing-list", "packing"],
    campaign: ["packing-list", "packing"],
    home: {
      title: "Pack for the desert, <em>not a hotel ballroom.</em>",
      sub: "Heat, wind, dress shoes on sandstone, and a ceremony that might be at sunrise. The list is the short version of what couples wish they had tossed in the bag.",
      ctaHref: "/guides/vegas-elopement-packing-list/",
      cta: "Open the packing list",
    },
    venues: {
      title: "Dress for the place, <em>then book it.</em>",
      sub: "A chapel, an overlook, and a lake deck do not share a packing list. Pick the setting first. The guide covers shoes, layers, and the desert sun.",
      ctaHref: "/guides/vegas-elopement-packing-list/",
      cta: "Open the packing list",
    },
  },
  {
    id: "where-to-stay",
    content: ["where-to-stay", "hotels", "stay"],
    campaign: ["where-to-stay", "hotels", "stay"],
    home: {
      title: "Stay where the wedding <em>actually is.</em>",
      sub: "Strip, downtown, or out toward the desert. Where you sleep changes the morning, the photos, and the ride over. The guide sorts it without the resort pitch.",
      ctaHref: "/guides/where-to-stay-for-a-las-vegas-wedding/",
      cta: "See where to stay",
    },
    venues: {
      title: "Pick the neighborhood, <em>then the room.</em>",
      sub: "The ceremony address should decide the hotel, not the other way around. Browse the venues in that part of town, then read where couples actually stay.",
      ctaHref: "/guides/where-to-stay-for-a-las-vegas-wedding/",
      cta: "See where to stay",
    },
  },
  {
    id: "desert-venues",
    content: ["desert-venues", "desert"],
    campaign: ["desert-venues", "desert"],
    home: {
      title: "Say yes with the desert <em>behind you.</em>",
      sub: "Red rock, ranch lawns, and lake light, a short drive from the Strip. Permits, heat, and the real starting prices, so the pretty plan is also a doable one.",
      ctaHref: "/venues/category/desert-outdoors/",
      cta: "See desert venues",
    },
    venues: {
      title: "Desert ceremonies, <em>with the practical bits.</em>",
      sub: "Valley of Fire, Red Rock, ranch lawns, and the lake. Filter to outdoor, then open a venue for the permit notes and the price we last checked.",
      ctaHref: "/venues/category/desert-outdoors/",
      cta: "See desert venues",
    },
  },
  {
    id: "guest-weekend",
    content: ["guest-weekend", "weekend", "guests"],
    campaign: ["guest-weekend", "weekend", "guests"],
    home: {
      title: "A weekend your guests will <em>actually enjoy.</em>",
      sub: "Ceremony, dinner, a little Vegas, and a plan that does not leave everyone standing in a lobby. The weekend guide lines the days up so you can be a guest too.",
      ctaHref: "/guides/las-vegas-wedding-weekend-guide/",
      cta: "Plan the weekend",
    },
    venues: {
      title: "Somewhere your people <em>can get to.</em>",
      sub: "Guest count, drive time, and a dinner nearby matter as much as the backdrop. Sort the directory, then sketch the weekend around the place you love.",
      ctaHref: "/guides/las-vegas-wedding-weekend-guide/",
      cta: "Plan the weekend",
    },
  },
  {
    id: "gothic-weddings",
    content: ["gothic-weddings", "gothic", "halloween"],
    campaign: ["gothic-weddings", "gothic", "halloween"],
    home: {
      title: "A black-dress Las Vegas wedding, <em>done warmly.</em>",
      sub: "Candlelight, velvet, a chapel with a past, or a museum after dark. The gothic guide covers the venues, the season, and how to keep it romantic.",
      ctaHref: "/guides/gothic-halloween-wedding-las-vegas/",
      cta: "Read the gothic guide",
    },
    venues: {
      title: "Moody rooms, <em>still completely Vegas.</em>",
      sub: "Museums, chapels, and after-dark galleries. Browse the directory for a setting with some shadow in it, then read how other couples put the day together.",
      ctaHref: "/guides/gothic-halloween-wedding-las-vegas/",
      cta: "Read the gothic guide",
    },
  },
  {
    id: "pinterest",
    source: ["pinterest"],
    referrer: pinRef,
    home: {
      title: "The Las Vegas wedding you saved, <em>planned for real.</em>",
      sub: "You already know the feeling you want. Here are the neon yards, desert rocks, chapels, and oddball rooms, with prices checked and the license steps spelled out.",
      ctaHref: "/venues/",
      cta: "Browse the venues",
    },
    venues: {
      title: "The places behind <em>those saved photos.</em>",
      sub: "Every card is a real venue with a checked starting price. Filter until the list looks like the board you made, then open the ones you want to stand in.",
      ctaHref: "/venues/",
      cta: "Browse the venues",
    },
  },
  {
    id: "facebook-instagram",
    source: ["facebook", "instagram", "fb", "ig"],
    referrer: metaRef,
    home: {
      title: "The Las Vegas wedding you two <em>keep talking about.</em>",
      sub: "Neon, desert, a chapel with a story, or something your friends will retell for years. Real prices, the license steps, and no ballroom as the default.",
      ctaHref: "/venues/",
      cta: "Browse the venues",
    },
    venues: {
      title: "Pick a place worth <em>telling people about.</em>",
      sub: "Start with the feeling, then the guest count and the budget. The directory is the whole list, with the price we checked on each one.",
      ctaHref: "/venues/",
      cta: "Browse the venues",
    },
  },
];
