# Source corrections, November 8, 2026

Internal note. Not a public page. Tags: verified (read on the cited page that day), inferred (a reading of two verified texts), assumed (not used below).

## Red Rock wedding permit fees

**Issue.** The spring 2027 post said the BLM page sets a $130 minimum and that 10 commercial wedding permits are full. The Easter and Cinco de Mayo posts, and the Red Rock listing, said noncommercial groups pay the greater of $115 or $6 per person, and a commercial permit has a $345 minimum. Other posts said the commercial allotment is full.

**Evidence, verified November 8, 2026.**

- Red Rock Canyon National Conservation Area planning page, Bureau of Land Management: https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon-national-conservation-area/planning-your-visit
  - An approved Special Recreation Permit is required for all weddings. Apply no more than 180 days ahead and at least 30 days ahead.
  - Noncommercial groups: minimum is the greater of $115 or $6 per person.
  - New commercial permits, when an officiant and/or photographer are paid, are one-time permits with a minimum of $345.
  - Scenic Drive gate fees are included in the wedding permit.
  - The page's fee table also says "Wedding permit: Varies" and "Professional/commercial photography permit: Varies."
  - The linked commercial permittee list is labeled fiscal year 2022. The page does not give an effective date for the $115 / $345 figures. It does not say "10 commercial permits" or "currently full."
- National special recreation permit FAQ (EXPLORE Act): https://www.blm.gov/programs/recreation/permits-and-passes/special-recreation-permits/faqs
  - Other permit types use a $130 minimum annual fee or $7 per person per day, or 3% of adjusted gross receipts, depending on type.
- Red Rock commercial prospectus, file dated September 2026: https://www.blm.gov/sites/default/files/docs/2026-09/RRCNCA%20Prospectus%202026.pdf
  - Minimum use fee $130 for commercial operators under that prospectus, plus a post-use choice of $7 per person per day or 3% of adjusted gross receipts, and separate Scenic Drive entrance fees for commercial vehicles. This is not the one-time wedding paragraph.

**Inferred.** The $130 in the spring post was the national / prospectus minimum for a different permit, not the wedding minimum on the planning page. The $345 and $115 lines match that wedding paragraph. Repetition was not the reason for keeping them.

**Revised.** Posts and the desert guide now separate the two. They tell the reader to pay the amount on the approved permit because the planning page does not date its wedding fees. "Currently full" and the 10 / 100 caps were removed where the current page does not say them.

**Paths.** `src/data/venues.mjs` (red-rock-canyon facts), `src/content/guides.mjs` (desert permits body, answer, FAQ), `src/content/blog/2026-10-22-spring-desert-wedding-las-vegas-2027.mjs`, `2026-10-25-easter-weekend-wedding-las-vegas-2027.mjs`, `2026-10-26-cinco-de-mayo-wedding-las-vegas-2027.mjs`, `2026-10-14-valley-of-fire-december-closure-wedding-alternatives.mjs`, `2026-10-28-memorial-day-weekend-wedding-las-vegas-2027.mjs`, `2026-10-29-late-spring-desert-wedding-heat-las-vegas-2027.mjs`, `2026-10-15-thanksgiving-week-elopement-las-vegas-2026.mjs`.

**Unresolved.** Whether BLM will apply the newer $130 / $7 schedule to a 2027 wedding instead of the figures still printed on the planning page. Only the approved permit answers that. The individual-wedding PDF linked from the page is filed under a January 2022 path and is encrypted in a way this check could not read, so it was not used as a fee source.

## Taco Bell Cantina guest count

**Issue.** The listing said the package allows up to 25 guests, and a tip said other parts of the site mention 15.

**Evidence, verified November 8, 2026.** No page opened that day contained "15."

- Package: https://www.tacobellwedding.com/products/wedding-package — "you can have up to 25 guests"; at least one guest as a witness; 30 minutes; $777 before tax.
- FAQ: https://www.tacobellwedding.com/pages/faqs — "Our standard wedding package allows 25 guests for 30 minutes."
- Homepage: https://www.tacobellwedding.com/ — "couples and up to 25 of their guests," and a private reception area "with up to 25 of your closest family and friends."
- Cantina events sheet, PDF dated April 2025: https://tacobellcantinas.com/wp-content/uploads/2025/04/Las-Vegas-1.pdf — chapel room "Hosts up to 25 people." Other rooms on that sheet are larger (60, 90, 160) and are not the wedding package.

**Inferred.** "25 guests" on the package page and "couples and up to 25 of their guests" on the homepage do not say whether the couple is inside the 25. The chapel-room line "25 people" may be a room cap. That is why the listing asks the booker to confirm, instead of printing 27 or deleting 25.

**Revised.** Removed the claim that a current page says 15. Kept 25 as the published package number, with the couple-versus-guests question stated.

**Paths.** `src/data/venues.mjs` (`taco-bell-cantina-chapel` facts, description, tip). `guestMax` stays 25. `priceFrom` stays 777.

**Unresolved.** Whether 25 includes the couple. Not answered by the pages above. No booking or email was sent.

## Privacy and terms template lines

**Issue.** Both pages said they were templates to review before launch. The site is already published.

**Evidence from the repository, verified in code, not by a lawyer.**

- Hosting: `.github/workflows/weekly-rebuild.yml` deploys to GitHub Pages. Live responses from the current site have been served by GitHub (`server: GitHub.com`). This pull request is not deployed.
- Analytics: `src/data/config.mjs` sets `ga4Id` to `G-XD9FXYWXCR` and `consentMode` to `eu`. `src/assets/js/main.js` loads Google Analytics unless the stored choice is denied, Global Privacy Control is on, or a Europe time zone has not accepted yet. Cookie settings reopens the banner. The time-zone check is not a legal finding about where the visitor lives.
- Forms: newsletter, shortlist, partner application, and partner-venue inquiry forms post to Formspree (`formspreeNewsletter` `meaejdnv`, venue and partner forms `xbgdrbbl`). The HTML does not contain a venue inbox. Whether Formspree forwards a partner inquiry to the venue is not visible in this repo.
- Shortlist: `localStorage` key `uvw_shortlist`.
- Countdown: `localStorage` key `uvw_countdown`, and names, date, time, and venue in the share link. `src/assets/js/countdown.js`.
- Budget planner: `src/assets/js/budget-ui.js` does not write the amounts to storage. Save as PDF calls `window.print()`. Email builds a `mailto:` link the visitor sends. Copy uses the clipboard.
- Wedding finder: answers stay in page memory. `src/assets/js/wedding-finder-ui.js` does not write them to `localStorage`.
- Affiliates: `src/data/affiliates.mjs` has an Amazon tag and a Stay22 id set. The Viator partner id is empty. The disclosure page already turns its "active programs" sentence on from that file.

**Revised.** Removed "before launch." Stated that a lawyer has not reviewed the pages. Added the tool behavior above. Did not add a company address, a retention period, a new effective date, or a compliance claim. The existing effective line still uses the site's fact-check date already printed on the page.

**Paths.** `build.mjs` privacy and terms sections.

**Unresolved, for Kat, not guessed.**

- Who Formspree delivers each form to, and how long Formspree or Google keep data.
- Whether the Europe time-zone check is the consent rule she wants to stand behind.
- A legal entity, mailing address, and any formal effective date for a revised policy.
- Whether the "we don't sell personal information" sentence should stay as a commitment. The code does not show a sale, and the sentence was kept.
