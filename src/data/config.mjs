// =====================================================================
//  UNIQUE VEGAS WEDDINGS — SITE CONFIG
//  This is the ONLY file you need to edit to turn on revenue.
//  Leave a value as "" and that feature quietly hides itself.
// =====================================================================

export const config = {
  siteName: "Unique Vegas Weddings",
  shortName: "UVW",
  domain: "https://uniquevegasweddings.com",
  tagline: "Vegas weddings, off-script.",
  description:
    "The independent guide to unique Las Vegas wedding venues: neon boneyards, ghost towns, canyon floors and sky-high chapels. Verified facts, honest prices, zero fluff.",
  contactEmail: "hello@uniquevegasweddings.com", // public inbox (set up a free forward to your Gmail)

  // ---------- LEADS + EMAIL (free tier: formspree.io) ----------
  // Create a form at formspree.io → copy the ID after /f/  (e.g. "xyzabcd")
  // Two forms: couples (checklist + shortlist) and business (venue applications + inquiries).
  // Each submission carries its own email subject line.
  formspreeVenueInquiry: "xbgdrbbl", // couples asking a venue for pricing/availability (your referral leads)
  formspreePartner: "xbgdrbbl",      // venues/vendors applying for a listing
  formspreeNewsletter: "meaejdnv",   // email list (free checklist download)

  // ---------- PRODUCTS + PAYMENTS (Stripe Payment Links, Gumroad, or Lemon Squeezy) ----------
  plannerCheckoutUrl: "https://uniquevegasweddings.gumroad.com/l/jtixjn?wanted=true",    // link to buy "The Unique Vegas Wedding Planner" PDF
  plannerPrice: "$19",       // must match the price on the Gumroad listing
  featuredCheckoutUrl: "https://buy.stripe.com/eVq28sf0S8MzcO86Vu4wM00",   // Stripe Payment Link: Featured Listing (monthly)
  featuredPrice: "$79/mo",   // must match the Stripe Payment Link
  spotlightCheckoutUrl: "https://buy.stripe.com/8x27sM5qi3sf3dyenW4wM01",  // Stripe Payment Link: Spotlight Listing (monthly)
  spotlightPrice: "$199/mo", // must match the Stripe Payment Link

  // ---------- AFFILIATES (paste your tracking IDs; links build themselves) ----------
  amazonTag: "",            // Amazon Associates tag, e.g. "uvw-20"
  viatorPid: "",            // Viator partner ID (pid), e.g. "P00012345"
  viatorMcid: "42383",      // Viator default mcid (keep unless your dashboard says otherwise)
  stay22MapUrl: "",         // Stay22: copy the map "embed URL" from your dashboard (hotel map for guests)

  // ---------- ADS + ANALYTICS ----------
  adsenseClient: "",        // e.g. "ca-pub-1234567890123456" (ad slots stay hidden until set)
  ga4Id: "G-XD9FXYWXCR",                // e.g. "G-XXXXXXX"

  // ---------- SEARCH + AI VISIBILITY ----------
  googleSiteVerification: "", // Google Search Console → "HTML tag" method → paste the content value
  bingSiteVerification: "",   // Bing Webmaster Tools → "HTML meta tag" → paste the content value (Bing feeds ChatGPT search and Copilot)
  indexNowKey: "e9ed47e89d07c153dfd3b0c210a7e88f", // tells Bing/Copilot about changed pages instantly. Leave as is.
  // true  = AI assistants may read AND train on the site (most visibility)
  // false = AI search/answer bots may still read and cite pages, but training crawlers are blocked
  allowAiTraining: false,
  // Old URLs from the previous version of the site → where they should go now.
  // [Assumption] These are guesses at the v1 file names. Edit to match the real ones.
  redirects: {
    "/venues.html": "/venues/",
    "/venue.html": "/venues/",
    "/pricing.html": "/for-venues/",
    "/resources.html": "/guides/",
    "/blog.html": "/guides/",
    "/partners.html": "/for-venues/",
    "/partner.html": "/for-venues/",
    "/thank-you.html": "/thanks/",
  },

  // ---------- OPTIONAL: add venues from a Google Sheet (no code) ----------
  // File → Share → Publish to web → CSV. Paste that URL. Weekly rebuild merges new rows.
  venueSheetCsvUrl: "",

  social: {
    pinterest: "", // full URL to your Pinterest profile
    instagram: "",
    tiktok: "",
  },
};
