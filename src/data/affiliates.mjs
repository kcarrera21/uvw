// =====================================================================
//  UVW AFFILIATE IDs: the ONE place to paste tracking IDs.
//
//  Leave a value as "" and that program is OFF: links stay plain, nothing
//  is tagged, and the disclosure page says no affiliate programs are active.
//  Paste an ID, push, and the next build tags every matching link on every
//  page (guides, blog, venue pages, tokens like {{amazon:...}}) and adds
//  rel="sponsored nofollow noopener". No other edits needed.
//
//  The rules for HOW links are tagged live in scripts/affiliate-links.mjs.
//  Self-test: node scripts/check-affiliates.mjs
//
//  Only paste an ID AFTER the program has approved you. Several programs
//  (Amazon especially) can close an account for using links before approval.
//  See docs/affiliate-programs.md for signup URLs and requirements.
// =====================================================================

export const AFFILIATE_IDS = {
  // Amazon Associates US store ID, e.g. "uvw-20". Tags amazon.com links with ?tag=
  AMAZON_TAG: "",

  // Viator partner ID (the "pid"), e.g. "P00012345". Tags viator.com links.
  VIATOR_PID: "",
  // Viator campaign/mcid. Keep the default unless your Viator dashboard says otherwise.
  VIATOR_MCID: "42383",

  // ---- Hotels: fill in ONE of these. First one set wins (Stay22, then Booking, then Expedia). ----
  // Stay22 affiliate ID ("aid" from hub.stay22.com). Easiest option: one ID covers
  // Booking.com, Expedia, Hotels.com and Vrbo, and also powers the hotel map.
  STAY22_AID: "uniquevegasweddings",
  // Booking.com is run through CJ. After approval, build a deep link in CJ's Link Builder,
  // then paste its pattern here with the destination replaced by {urlenc}.
  // e.g. "https://www.anrdoezrs.net/click-1234567-7654321?url={urlenc}"
  BOOKING_LINK_TEMPLATE: "",
  // Expedia Group Travel Creator program: same idea. Paste your creator link pattern with {urlenc}.
  EXPEDIA_LINK_TEMPLATE: "",

  // Optional: full Stay22 map embed URL from your Stay22 dashboard. Overrides the auto-built map.
  STAY22_MAP_URL: "",
};
