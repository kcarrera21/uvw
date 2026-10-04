// =====================================================================
//  GUIDES — original UVW content. Facts sourced from official pages,
//  checked 2026-10-04 (see each guide's sources list).
//  Tokens like {{price-table}} are filled in by build.mjs at build time,
//  so they stay in sync with venues.mjs automatically.
// =====================================================================

const CLERK = "https://www.clarkcountynv.gov/government/elected_officials/county_clerk";

export const guides = [
  // ------------------------------------------------------------------
  {
    slug: "las-vegas-marriage-license",
    seoTitle: "Las Vegas Marriage License: Cost, Hours & Requirements",
    metaDescription: "Clark County marriage license, step by step: the $102 fee, 8 a.m.–midnight hours, ID rules, online pre-application, witness and certified copies.",
    answer: "A Las Vegas marriage license costs $102 from the Clark County Marriage License Bureau at 201 E. Clark Ave., open 8 a.m. to midnight every day. Both partners must appear together with original photo ID. There is no waiting period, blood test or residency requirement, and the license is valid for one year.",
    title: "How to Get a Las Vegas Marriage License (Step by Step)",
    nav: "Marriage license",
    eyebrow: "Legal essentials",
    description: "Clark County marriage license requirements: the $102 fee, hours (8 a.m. to midnight, every day), ID rules, the online pre-application, witnesses and certified copies.",
    readMins: 7,
    hero: "license",
    body: `
<p class="lede">Las Vegas is famous for fast weddings because the paperwork really is simple. No blood test, no waiting period, no residency requirement. But "simple" isn't "skippable." Here's exactly what Clark County asks for, in the order you'll need it.</p>

<div class="quickfacts">
  <div><span>Fee</span><strong>$102</strong></div>
  <div><span>Hours</span><strong>8 a.m.–midnight, 7 days</strong></div>
  <div><span>Waiting period</span><strong>None</strong></div>
  <div><span>Valid for</span><strong>1 year</strong></div>
</div>

<h2>Step 1: Pre-apply online (10 minutes, saves you an hour)</h2>
<p>Fill out the <a href="https://clerk.clarkcountynv.gov/AcclaimClerkPreApp/Home/Index" rel="nofollow noopener" target="_blank">Clark County online pre-application</a> before you travel. It stays on file for one year. The pre-application is <em>not</em> your license. You still have to appear in person, but it turns a form-filling session into a quick check-in.</p>

<h2>Step 2: Go to the Marriage License Bureau, together</h2>
<p>Both of you must appear in person at the same time. There are no appointments; it's walk-in only, and processing typically takes about 15 minutes.</p>
<ul class="checklist">
  <li><strong>Address:</strong> 201 E. Clark Ave., Las Vegas, NV 89101 (downtown)</li>
  <li><strong>Hours:</strong> 8 a.m. to midnight, seven days a week, including all holidays</li>
  <li><strong>Quietest times:</strong> Sundays and Tuesdays, 8–10 a.m. and 8 p.m.–midnight, per the Clerk's office</li>
</ul>
<p>Satellite offices in Henderson, Laughlin and Mesquite also issue licenses on limited weekday schedules. They close for lunch and on legal holidays, and they don't take cash. The Government Center on Grand Central Parkway does <em>not</em> issue marriage licenses.</p>

<h2>Step 3: Bring the right ID</h2>
<p>Each of you needs an <strong>original</strong> photo ID. Photocopies and digital IDs aren't accepted. Accepted IDs include:</p>
<ul class="checklist">
  <li>Driver's license or U.S. state ID card</li>
  <li>Passport</li>
  <li>Foreign government ID showing date of birth</li>
  <li>Matrícula Consular card</li>
  <li>U.S. military ID</li>
  <li>Permanent resident card, or USCIS citizenship or naturalization certificate</li>
</ul>
<p>Your name on the license will match your ID exactly, so make sure your IDs are current. U.S. citizens who have a Social Security number will need to provide it.</p>

<div class="note"><strong>Previously married?</strong> You only need to be not currently married. There's no waiting period after a divorce, and you don't need the decree unless it changed your name and your ID doesn't match yet.</div>

<h2>Step 4: Pay the $102 fee</h2>
<p>The license costs <strong>$102</strong>. Credit and debit cards carry a processing fee of 2% + $1.25. Checks and money orders aren't accepted, and the satellite offices don't take cash.</p>

<h2>Step 5: Have your ceremony (within one year)</h2>
<p>The license expires one year after it's issued. To make it legal you need:</p>
<ul class="checklist">
  <li><strong>An authorized officiant.</strong> Most chapel and venue packages include one. If you're planning a DIY ceremony (at a park, say), you'll need to book your own.</li>
  <li><strong>At least one witness</strong> besides the officiant. Eloping with just the two of you? Many chapels can provide a witness. Ask when you book.</li>
</ul>
<p>After the ceremony, your officiant files the marriage certificate with the County Clerk within 10 days. You don't have to do anything for that part.</p>

<h2>Step 6: Order your certified marriage certificate</h2>
<p>Your license is <em>not</em> proof of marriage. To change your name, update insurance or travel documents, or prove the marriage anywhere, you need a <strong>certified copy</strong> of your marriage certificate from the Clark County Clerk.</p>
<ul class="checklist">
  <li><strong>Cost:</strong> $20 per certified copy</li>
  <li><strong>How:</strong> order online through the Clerk's records search, in person or at a kiosk, or by mail (money order or cashier's check)</li>
  <li><strong>Timing:</strong> the certificate is usually filed 1–2 business days after the Clerk receives it. Allow about 3 weeks for mailed copies, or 6 weeks for international mail.</li>
</ul>

<h2>Need it to count overseas?</h2>
<p>Many countries require an <strong>apostille</strong> on your certified copy. In Nevada, apostilles come from the Nevada Secretary of State, not the County Clerk. See our <a href="/guides/legal-vs-symbolic-ceremony/">legal vs. symbolic ceremony guide</a> for the full international checklist.</p>

{{planner-cta}}

<h2>Common mistakes we see</h2>
<ul class="checklist">
  <li><strong>Showing up alone.</strong> Both partners must appear together.</li>
  <li><strong>Bringing a photo of your ID.</strong> Only originals count.</li>
  <li><strong>Confusing the license with the certificate.</strong> Order certified copies after the wedding.</li>
  <li><strong>Forgetting a witness.</strong> No witness, no legal wedding.</li>
  <li><strong>Getting married outside Nevada with a Nevada license.</strong> It's a Nevada license. Planning a ceremony across the line at the Grand Canyon? Ask your operator how they handle the legal side.</li>
</ul>
<p class="small">This guide summarizes Clark County Clerk information as of the date above. It isn't legal advice. Requirements can change, so confirm with the Clerk before you travel.</p>
`,
    faq: [
      { q: "How much is a marriage license in Las Vegas?", a: "$102 at the Clark County Marriage License Bureau. Card payments carry a processing fee of 2% + $1.25." },
      { q: "Can we get a Las Vegas marriage license online?", a: "No. You can pre-apply online, but both partners must appear in person together to receive the license." },
      { q: "Is there a waiting period or blood test in Nevada?", a: "No. There's no waiting period, no blood test and no residency requirement." },
      { q: "How many witnesses do you need to get married in Las Vegas?", a: "At least one witness besides the officiant." },
      { q: "How long is a Nevada marriage license valid?", a: "One year from the date it's issued." },
    ],
    sources: [
      { t: "Clark County Clerk: Marriage License Requirements", u: `${CLERK}/marriage-license-requirements` },
      { t: "Clark County Clerk: Fees", u: `${CLERK}/fees` },
      { t: "Clark County Clerk: Locations and Hours", u: `${CLERK}/location-and-hours` },
      { t: "Clark County Clerk: What Is Proof of Marriage", u: `${CLERK}/what-is-proof-of-marriage` },
      { t: "Nevada Revised Statutes, Chapter 122", u: "https://www.leg.state.nv.us/NRS/NRS-122.html" },
    ],
  },

  // ------------------------------------------------------------------
  {
    slug: "las-vegas-courthouse-wedding",
    seoTitle: "Las Vegas Courthouse Wedding: Cost, Hours & How to Book",
    metaDescription: "How to book a Las Vegas courthouse wedding: the $77.75 civil ceremony, appointment-only hours, one witness plus eight guests, and what to bring.",
    answer: "A Las Vegas courthouse wedding costs $77.75 ($75 plus a $2.75 card fee) at the Clark County Office of Civil Marriages, 330 S. 3rd St., on top of the $102 marriage license. Ceremonies are by appointment only, and you can bring one required witness plus up to eight guests.",
    title: "Las Vegas Courthouse Wedding: The $77.75 Civil Ceremony",
    nav: "Courthouse wedding",
    eyebrow: "Budget & simple",
    description: "How to book a civil marriage ceremony at the Clark County Office of Civil Marriages: cost, hours, appointments, witnesses and what to expect.",
    readMins: 5,
    hero: "license",
    body: `
<p class="lede">You can have a legal Las Vegas wedding for less than the cost of a nice dinner on the Strip. Clark County's Office of Civil Marriages performs simple, dignified ceremonies by appointment. It's the courthouse wedding, Vegas style.</p>

<div class="quickfacts">
  <div><span>Ceremony fee</span><strong>$77.75 (incl. card fee)</strong></div>
  <div><span>Booking</span><strong>Appointment only</strong></div>
  <div><span>Guests</span><strong>1 witness + up to 8</strong></div>
  <div><span>Payment</span><strong>Card only</strong></div>
</div>

<h2>What it costs, all in</h2>
<table class="data">
  <thead><tr><th>Item</th><th>Cost</th></tr></thead>
  <tbody>
    <tr><td>Marriage license (Marriage License Bureau)</td><td>$102</td></tr>
    <tr><td>Civil ceremony ($75 + $2.75 card fee)</td><td>$77.75</td></tr>
    <tr><td>Certified copy of your marriage certificate</td><td>$20 each</td></tr>
    <tr><td><strong>Legally married, with proof</strong></td><td><strong>About $200</strong></td></tr>
  </tbody>
</table>
<p class="small">Card processing fees on the license are extra (2% + $1.25).</p>

<h2>Where and when</h2>
<ul class="checklist">
  <li><strong>Office of Civil Marriages:</strong> 330 S. 3rd St., 6th Floor, Suite 660, Las Vegas</li>
  <li><strong>Hours:</strong> Sun–Thu 10:30 a.m.–5:45 p.m.; Fri 10:30 a.m.–7:30 p.m.; Sat 2:30–7:30 p.m.</li>
  <li><strong>Appointments:</strong> required, booked online through the Clerk's scheduling page</li>
  <li><strong>Payment:</strong> Visa, Mastercard, Discover or Amex only</li>
</ul>

<h2>Who can come</h2>
<p>Bring <strong>one required witness</strong> plus up to <strong>eight guests</strong>. That's ten people in the room besides you two and the officiant, which is enough for parents, siblings and a best friend with a phone camera.</p>

<div class="note"><strong>Be on time.</strong> Late arrivals have to reschedule. Get your license first (the Bureau is a short walk away), then head over with time to spare.</div>

<h2>Is a civil ceremony right for you?</h2>
<p>It's ideal if you want to be legally married quickly and affordably, and plan to celebrate somewhere more personal. Many couples do the civil ceremony for the legal part, then hold a <a href="/guides/legal-vs-symbolic-ceremony/">symbolic ceremony</a> at a venue that would be complicated or expensive to make "official," like a canyon floor, a ghost town or the top of a tower.</p>
<p>Want something with more atmosphere for not much more money? Several <a href="/venues/category/classic-chapels/">classic chapels</a> publish ceremony prices from about $150.</p>

{{planner-cta}}
`,
    faq: [
      { q: "How much is a courthouse wedding in Las Vegas?", a: "The Clark County Office of Civil Marriages charges $75 plus a $2.75 card fee ($77.75). The marriage license is a separate $102." },
      { q: "Do I need an appointment for a civil ceremony in Las Vegas?", a: "Yes. The Office of Civil Marriages is appointment-only and books online." },
      { q: "How many guests can attend a Clark County civil marriage?", a: "One required witness plus up to eight guests." },
    ],
    sources: [
      { t: "Clark County Clerk: Civil Marriage", u: `${CLERK}/civil-marriage` },
      { t: "Clark County Clerk: Fees", u: `${CLERK}/fees` },
    ],
  },

  // ------------------------------------------------------------------
  {
    slug: "las-vegas-wedding-cost",
    seoTitle: "Las Vegas Wedding Cost: Real Published Venue Prices",
    metaDescription: "Published Las Vegas wedding prices by venue, from $150 chapel ceremonies to $15,500+ receptions, plus the license fee and the costs couples forget.",
    answer: "Published starting prices at Las Vegas wedding venues in our directory range from {{price-min}} for a chapel ceremony to {{price-max}} or more for a full-production reception. Every couple also pays the $102 Clark County marriage license, and a county civil ceremony costs $77.75.",
    title: "How Much Does a Las Vegas Wedding Cost? Real Published Prices",
    nav: "Wedding cost",
    eyebrow: "Budget",
    description: "Published prices from Las Vegas wedding venues, from $150 chapel ceremonies to $15,500+ immersive receptions, plus the fees couples forget to budget for.",
    readMins: 6,
    hero: "cost",
    body: `
<p class="lede">"How much is a Vegas wedding?" ranges from the price of a nice pair of shoes to the price of a car. We pulled the <strong>published starting prices</strong> from the venues in our directory, so you can see the real range instead of somebody's "average."</p>

<h2>The non-negotiables (everyone pays these)</h2>
<table class="data">
  <thead><tr><th>Item</th><th>Cost</th></tr></thead>
  <tbody>
    <tr><td>Clark County marriage license</td><td>$102</td></tr>
    <tr><td>Certified copy of marriage certificate</td><td>$20 each</td></tr>
    <tr><td>Officiant</td><td>Usually included in venue packages. Confirm.</td></tr>
  </tbody>
</table>

<h2>Published starting prices by venue</h2>
<p>These are "from" prices published by each venue on the date shown. Packages differ wildly in what's included, so use this table to shortlist, then compare inclusions.</p>
{{price-table}}

<h2>Price bands, in plain English</h2>
<ul class="checklist">
  <li><strong>Under $1,000:</strong> classic chapels, the drive-thru, the courthouse, the STRAT's base-of-tower Minimony, the Venetian gondola (midweek) and park-permit DIY options.</li>
  <li><strong>$1,000–$3,000:</strong> Neon Museum, Nelson Ghost Town, Springs Preserve ceremonies, Valley of Fire packages, helicopter flights over the Strip.</li>
  <li><strong>$3,000–$10,000:</strong> Grand Canyon helicopter weddings, Red Rock packages, garden receptions.</li>
  <li><strong>$10,000+:</strong> full-production receptions like AREA15. Large Strip-resort weddings are usually quote-only, so ask for a full estimate.</li>
</ul>

<h2>Costs couples forget</h2>
<ul class="checklist">
  <li><strong>Service charges and tax.</strong> When you see "++" after a price, both get added on top.</li>
  <li><strong>Gratuities</strong> for officiants, drivers and photographers (some packages include them; many don't).</li>
  <li><strong>Permits</strong> for outdoor public lands. See our <a href="/guides/desert-wedding-permits/">desert permits guide</a>.</li>
  <li><strong>Park entry fees</strong> per vehicle at state parks and Lake Mead.</li>
  <li><strong>Weekend premiums.</strong> Several venues publish lower Sunday–Thursday pricing.</li>
  <li><strong>Special-date demand.</strong> Lucky dates sell out early. See <a href="/lucky-wedding-dates/">upcoming lucky dates</a>.</li>
</ul>

{{planner-cta}}
<p class="small">Prices change. Every venue page shows the date we last checked, and you should always confirm directly with the venue before booking.</p>
`,
    faq: [
      { q: "What is the cheapest way to get married in Las Vegas?", a: "A Clark County civil ceremony ($77.75 including the card fee) plus the $102 license. Several chapels publish ceremonies from about $150." },
      { q: "How much does a Neon Museum wedding cost?", a: "The Neon Museum publishes its daytime Sweetheart Wedding at $2,500 and the nighttime Stardust Wedding at $3,500 (checked October 2026)." },
    ],
    sources: [
      { t: "Clark County Clerk: Fees", u: `${CLERK}/fees` },
      { t: "Individual venue pages (linked from each listing)", u: "/venues/" },
    ],
  },

  // ------------------------------------------------------------------
  {
    slug: "best-time-to-get-married-in-las-vegas",
    seoTitle: "Best Time to Get Married in Las Vegas, Month by Month",
    metaDescription: "Las Vegas wedding weather by month from NOAA normals: the best months for outdoor ceremonies, summer heat plans and seasonal venue closures.",
    answer: "The best months for an outdoor Las Vegas wedding are March to May and October to November, when average highs run from the high 60s to the high 80s °F. From June through August average highs pass 100°F, so plan an indoor, sunrise or after-dark ceremony.",
    title: "The Best Time of Year to Get Married in Las Vegas (Month by Month)",
    nav: "Best time to marry",
    eyebrow: "Planning",
    description: "Month-by-month Las Vegas weather for weddings using NOAA climate normals, plus seasonal venue rules, closures and the best months for outdoor ceremonies.",
    readMins: 6,
    hero: "season",
    body: `
<p class="lede">Las Vegas has two wedding seasons: "gorgeous" and "plan around the heat." Here's the month-by-month picture using official NOAA climate normals, plus the venue rules that change with the calendar.</p>

{{season-now}}

<h2>Las Vegas weather by month</h2>
<p>Average highs and lows at Harry Reid International Airport (NOAA 1991–2020 normals). Las Vegas averages only about 4.2 inches of rain a year, so the question is almost never "will it rain?" It's "will it be 104°?"</p>
{{climate-table}}

<h2>The sweet spots</h2>
<ul class="checklist">
  <li><strong>March–May:</strong> highs in the 70s and 80s, desert wildflowers some years, and every outdoor venue in play. It's the most popular outdoor season, so book early.</li>
  <li><strong>October–November:</strong> highs from the low 80s down to the high 60s, golden light and comfortable evenings. Note that Red Rock's timed-entry season starts October 1.</li>
</ul>

<h2>Summer (June–August): go indoor, go early or go up</h2>
<p>Average highs pass 100°F from June through August. That doesn't rule out a summer wedding; it changes the plan:</p>
<ul class="checklist">
  <li><strong>Sunrise ceremonies.</strong> The Neon Museum offers sunrise weddings in summer instead of its daytime package.</li>
  <li><strong>Indoor icons.</strong> The <a href="/venues/shark-reef-aquarium/">Shark Reef Aquarium</a>, <a href="/venues/the-mob-museum/">Mob Museum courtroom</a>, <a href="/venues/omega-mart-meow-wolf/">Omega Mart</a> and the <a href="/venues/high-roller-wheel/">High Roller</a> are all climate-controlled.</li>
  <li><strong>Night.</strong> The Neon Museum's Stardust package returns in September, and a Strip helicopter flight looks best after dark anyway.</li>
</ul>

<h2>Winter (December–February): crisp, cheap(er), and closures to know</h2>
<p>Highs sit in the high 50s and low 60s, and nights get cold. It's lovely for photos, but bring layers.</p>
<div class="note"><strong>Valley of Fire closes December 1–14 every year</strong>, and weddings are prohibited during the closure. In 2026, the park's West Entrance is also closed Monday–Thursday through the end of the year.</div>

<h2>Seasonal rules worth calendaring</h2>
<table class="data">
  <thead><tr><th>When</th><th>What changes</th></tr></thead>
  <tbody>
    <tr><td>Oct 1 – May 31</td><td>Red Rock Canyon Scenic Drive requires timed-entry reservations</td></tr>
    <tr><td>June – August</td><td>Neon Museum daytime Sweetheart Weddings pause (sunrise offered)</td></tr>
    <tr><td>September – May</td><td>Neon Museum Stardust (nighttime) weddings available</td></tr>
    <tr><td>Dec 1 – 14</td><td>Valley of Fire closed; no weddings</td></tr>
    <tr><td>Summer / Winter</td><td>Floyd Lamb Park music curfew: 7 p.m. summer, 4 p.m. winter</td></tr>
  </tbody>
</table>
{{planner-cta}}
`,
    faq: [
      { q: "What is the best month to get married in Las Vegas?", a: "For outdoor weddings, March–May and October–November offer average highs between the high 60s and high 80s °F (NOAA normals). Summer works best indoors or at sunrise." },
      { q: "How hot is Las Vegas in July?", a: "July's normal high at Harry Reid International Airport is about 104.5°F, with a normal low of about 82°F (NOAA 1991–2020)." },
    ],
    sources: [
      { t: "NOAA NCEI U.S. Climate Normals 1991–2020 (station USW00023169)", u: "https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals" },
      { t: "Nevada State Parks: Valley of Fire", u: "https://parks.nv.gov/parks/valley-of-fire" },
      { t: "BLM: Red Rock Canyon NCA", u: "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon" },
      { t: "The Neon Museum: Weddings", u: "https://neonmuseum.org/weddings/" },
    ],
  },

  // ------------------------------------------------------------------
  {
    slug: "how-to-elope-in-las-vegas",
    seoTitle: "How to Elope in Las Vegas: A 48-Hour Plan",
    metaDescription: "A 48-hour plan to elope in Las Vegas: pre-apply online, get the $102 license together, book a venue and witness, and order certified copies after.",
    answer: "To elope in Las Vegas, pre-apply online, then pick up your $102 marriage license together at the Clark County Marriage License Bureau, open 8 a.m. to midnight daily. There is no waiting period, so you can marry the same day with an authorized officiant and at least one witness.",
    title: "How to Elope in Las Vegas: A 48-Hour Game Plan",
    nav: "How to elope",
    eyebrow: "Elopements",
    description: "A practical 48-hour plan for eloping in Las Vegas: license, venue, witness, photos and the certified copy, with unique venue ideas beyond the chapel.",
    readMins: 6,
    hero: "elope",
    body: `
<p class="lede">Eloping in Las Vegas is a time-honored tradition, and it's easier than ever. Here's a realistic 48-hour plan that gets you legally married somewhere you'll actually want to remember.</p>

<h2>Before you fly (one evening of planning)</h2>
<ul class="checklist">
  <li><strong>Pre-apply for your license online.</strong> It takes 10 minutes and stays valid for a year. (<a href="/guides/las-vegas-marriage-license/">How-to here.</a>)</li>
  <li><strong>Pick your venue.</strong> Many chapels take same-week bookings. Permitted desert sites and helicopter weddings need more lead time.</li>
  <li><strong>Sort your witness.</strong> Nevada requires at least one besides the officiant. Many venues can provide one. Ask.</li>
  <li><strong>Pack originals.</strong> Original photo IDs only. See our <a href="/guides/vegas-elopement-packing-list/">packing list</a>.</li>
</ul>

<h2>Day 1: Land, license, dinner</h2>
<p>Head downtown to the Marriage License Bureau (201 E. Clark Ave., open 8 a.m. to midnight every day). Both of you need to go, together. Processing usually takes about 15 minutes. Then celebrate being <em>almost</em> married. Fremont Street is right there.</p>

<h2>Day 2: The wedding</h2>
<p>Choose your adventure:</p>
<div class="grid-3 mini-cards">
  <a href="/venues/category/classic-chapels/" class="mini"><strong>Classic</strong><span>A chapel ceremony from about $150. In and out in an hour, Elvis optional.</span></a>
  <a href="/venues/category/desert-outdoors/" class="mini"><strong>Wild</strong><span>Red rock at Valley of Fire or Red Rock Canyon with a permitted planner.</span></a>
  <a href="/venues/category/sky-high/" class="mini"><strong>Sky high</strong><span>The STRAT, the High Roller or a helicopter over the Strip.</span></a>
</div>
<p>Book a photographer for golden hour. Desert light an hour before sunset does more for your photos than any filter.</p>

<h2>After: make it official</h2>
<p>Your officiant files the paperwork. Your job is to <strong>order certified copies</strong> ($20 each) from the Clark County Clerk. You'll need them for name changes, insurance and anything else that asks, "are you married?"</p>

<h2>Elopement venues worth the detour</h2>
{{venue-picks:the-neon-museum,nelson-ghost-town,valley-of-fire-state-park,omega-mart-meow-wolf,papillon-helicopter-weddings,tunnel-of-love-drive-thru}}

{{viator:las vegas helicopter tour|Can't fit a helicopter ceremony in the budget? Book a sunset helicopter flight as your celebration.}}

{{planner-cta}}
`,
    faq: [
      { q: "Can you get married in Las Vegas the same day?", a: "Often, yes. There's no waiting period after you get your license, and many chapels take same-day or same-week bookings. Outdoor permitted sites and helicopter weddings need more notice." },
      { q: "Do you need a witness to elope in Las Vegas?", a: "Yes. Nevada requires at least one witness besides the officiant. Many chapels can provide one." },
    ],
    sources: [
      { t: "Clark County Clerk: Marriage License Requirements", u: `${CLERK}/marriage-license-requirements` },
      { t: "Clark County Clerk: Locations and Hours", u: `${CLERK}/location-and-hours` },
    ],
  },

  // ------------------------------------------------------------------
  {
    slug: "desert-wedding-permits",
    seoTitle: "Las Vegas Desert Wedding Permits: Rules, Fees & Closures",
    metaDescription: "Which parks near Las Vegas allow weddings, which permit you need, published fees, lead times and closures, from the agencies that manage them.",
    answer: "Most public lands near Las Vegas allow weddings with a permit. Valley of Fire requires a Nevada State Parks Special Use Permit ($25 processing fee, apply 60 days ahead), Red Rock Canyon requires a BLM Special Recreation Permit, and Lake Mead requires a National Park Service Special Use Permit ($150 application fee).",
    title: "Desert & Outdoor Wedding Permits Near Las Vegas",
    nav: "Desert permits",
    eyebrow: "Outdoor weddings",
    description: "Which Las Vegas-area parks and public lands allow weddings, which permit you need, published fees, lead times and seasonal closures, all from official sources.",
    readMins: 7,
    hero: "desert",
    body: `
<p class="lede">The desert around Las Vegas is some of the most dramatic wedding scenery in the country, and most of it is public land. That means permits. Here's what each place requires, according to the agencies that manage it.</p>

<div class="note"><strong>The easy route:</strong> hire a planner or chapel that already holds the permit and runs ceremonies there. They handle the paperwork, and the permit is usually built into the package price.</div>

<h2>Valley of Fire State Park</h2>
<ul class="checklist">
  <li><strong>Weddings allowed?</strong> Yes. Nevada State Parks treats them as a commercial activity.</li>
  <li><strong>Permit:</strong> Special Use Permit, with a $25 non-refundable processing fee; apply 60 days ahead. A cost-recovery fee may apply.</li>
  <li><strong>Group use area:</strong> $25 plus vehicle entry ($10 for Nevada plates, $15 for others).</li>
  <li><strong>Pro photography:</strong> needs a separate photography permit.</li>
  <li><strong>Closed:</strong> December 1–14 every year. Weddings are prohibited during the closure.</li>
</ul>

<h2>Red Rock Canyon National Conservation Area (BLM)</h2>
<ul class="checklist">
  <li><strong>Weddings allowed?</strong> Yes, with a BLM Special Recreation Permit.</li>
  <li><strong>Limits:</strong> 10 commercial wedding permittees (currently full) and 100 noncommercial wedding permits.</li>
  <li><strong>How to apply:</strong> email the Red Rock recreation team listed on the BLM page.</li>
  <li><strong>Pro portraits:</strong> need a film permit, which can take up to 60 days.</li>
  <li><strong>Timed entry:</strong> required for the Scenic Drive October 1–May 31.</li>
</ul>

<h2>Lake Mead National Recreation Area (NPS)</h2>
<ul class="checklist">
  <li><strong>Weddings allowed?</strong> Yes, with a Special Use Permit.</li>
  <li><strong>Fee:</strong> $150 non-refundable application fee (card only); cost-recovery charges may apply. Entrance fees aren't waived.</li>
  <li><strong>Lead time:</strong> apply at least 45 business days ahead, and up to one year in advance.</li>
  <li><strong>Shortcut:</strong> the <a href="/venues/lake-mead-cruises-desert-princess/">Desert Princess</a> operates inside the park as an authorized concessioner.</li>
</ul>

<h2>Spring Mountain Ranch State Park</h2>
<ul class="checklist">
  <li><strong>Weddings:</strong> must reserve the group use area (up to 200 people, $200 plus vehicle entry). The event lawn and stage need a Special Use Permit.</li>
</ul>

<h2>Floyd Lamb Park at Tule Springs (City of Las Vegas)</h2>
<ul class="checklist">
  <li><strong>Weddings:</strong> through the city's Park Special Events permit. Published rates range from $600 (weekday courtyard) to $2,250 (weekend hay barn package).</li>
  <li><strong>Curfew:</strong> music ends at 7 p.m. in summer and 4 p.m. in winter.</li>
</ul>

<h2>Mount Charleston (Spring Mountains NRA, U.S. Forest Service)</h2>
<ul class="checklist">
  <li><strong>Weddings of 75 or more people</strong> need a noncommercial group use permit; commercial operators need a special use permit.</li>
  <li><strong>Fire restrictions</strong> are posted seasonally, so check before planning candles or anything with a flame.</li>
</ul>

<h2>What about Seven Magic Mountains?</h2>
<p>We couldn't find any official wedding permit process for Seven Magic Mountains, and the artwork's official visitor page says photography there is for private, non-commercial use only. We don't recommend planning a ceremony there.</p>

<h2>Desert etiquette (it matters)</h2>
<ul class="checklist">
  <li>No confetti, rice, petals or balloons. Pack out everything.</li>
  <li>Stay on durable surfaces; desert crust takes decades to recover.</li>
  <li>Never touch petroglyphs.</li>
  <li>Bring more water than you think, plus shade for guests.</li>
</ul>
{{planner-cta}}
`,
    faq: [
      { q: "Do you need a permit to get married at Valley of Fire?", a: "Yes. Weddings require a Special Use Permit from Nevada State Parks ($25 processing fee, apply 60 days ahead), and they're prohibited during the park's December 1–14 closure." },
      { q: "Can you get married at Red Rock Canyon?", a: "Yes, with a BLM Special Recreation Permit. The BLM limits wedding permits to 10 commercial permittees and 100 noncommercial permits." },
      { q: "Can you get married at Seven Magic Mountains?", a: "We found no official wedding permit process, and the site's official guidance limits photography to private, non-commercial use." },
    ],
    sources: [
      { t: "Nevada State Parks: Valley of Fire", u: "https://parks.nv.gov/parks/valley-of-fire" },
      { t: "Nevada State Parks: Group Use & Special Commercial Use", u: "https://parks.nv.gov/fees/group-use-special-commercial-use" },
      { t: "BLM: Red Rock Canyon NCA", u: "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon" },
      { t: "NPS Lake Mead: Special Use Permits", u: "https://www.nps.gov/lake/planyourvisit/special-use-permit.htm" },
      { t: "Nevada State Parks: Spring Mountain Ranch", u: "https://parks.nv.gov/parks/spring-mountain-ranch" },
      { t: "City of Las Vegas: Floyd Lamb Park", u: "https://www.lasvegasnevada.gov/Residents/Parks-Facilities/Floyd-Lamb-Park" },
      { t: "USFS: Noncommercial Group Use", u: "https://www.fs.usda.gov/managing-land/lands-minerals-geology/special-uses/applying-for-permit/non-commercial" },
      { t: "Seven Magic Mountains: Visit", u: "https://sevenmagicmountains.com/visit/" },
    ],
  },

  // ------------------------------------------------------------------
  {
    slug: "legal-vs-symbolic-ceremony",
    seoTitle: "Is a Las Vegas Wedding Legal? Legal vs. Symbolic Ceremony",
    metaDescription: "When a Las Vegas wedding is legally binding, when a symbolic ceremony fits better, and how international couples get certified copies and an apostille.",
    answer: "A Las Vegas wedding is legally binding when you have a Nevada marriage license, an authorized officiant and at least one witness, and the officiant files the certificate with the County Clerk. A symbolic ceremony needs none of these, so it suits couples who are already married or plan to marry elsewhere.",
    title: "Legal vs. Symbolic Vegas Weddings (and Using Your Marriage Abroad)",
    nav: "Legal vs. symbolic",
    eyebrow: "Legal essentials",
    description: "When your Las Vegas wedding is legally binding, when a symbolic ceremony makes more sense, and how international couples get certified copies and an apostille.",
    readMins: 5,
    hero: "license",
    body: `
<p class="lede">Some couples want their Vegas wedding to be <em>the</em> wedding. Others are already married, or plan to marry at home, and want Vegas for the experience. Both are great. Here's how to decide, and what to do if you need your Vegas marriage recognized abroad.</p>

<h2>A legal ceremony needs four things</h2>
<ul class="checklist">
  <li>A Nevada marriage license (valid for one year)</li>
  <li>An authorized officiant</li>
  <li>At least one witness besides the officiant</li>
  <li>The officiant filing the certificate with the County Clerk, which they do within 10 days</li>
</ul>

<h2>When a symbolic ceremony makes sense</h2>
<ul class="checklist">
  <li><strong>You're already legally married</strong> and want the celebration (see <a href="/guides/las-vegas-vow-renewal/">vow renewals</a>).</li>
  <li><strong>Your home country has its own rules</strong> and you'd rather do the legal part there.</li>
  <li><strong>Your dream ceremony spot is outside Nevada,</strong> like the floor of the Grand Canyon in Arizona.</li>
</ul>
<p>Several chapels, including <a href="/venues/graceland-wedding-chapel/">Graceland</a>, explicitly offer non-legal ceremonies.</p>

<h2>International couples: proving your marriage at home</h2>
<ol class="steps">
  <li><strong>Order certified copies</strong> of your marriage certificate from the Clark County Clerk ($20 each). Allow about 6 weeks for international mail.</li>
  <li><strong>Get an apostille</strong> if your country requires one. In Nevada, apostilles are issued by the <a href="https://www.nvsos.gov/sos/businesses/apostille" rel="nofollow noopener" target="_blank">Nevada Secretary of State</a>, not the County Clerk. Check the current fee on their site.</li>
  <li><strong>Check your country's registration rules.</strong> Some require you to register a foreign marriage with a consulate or local registry, sometimes with a certified translation.</li>
</ol>
<div class="note">Recognition rules vary by country. This is a starting checklist, not legal advice. Contact your consulate or home registry before you travel.</div>
{{planner-cta}}
`,
    faq: [
      { q: "Is a Las Vegas wedding legal in other countries?", a: "Generally, a valid Nevada marriage can be recognized abroad, but each country sets its own rules. Most require a certified copy and often an apostille from the Nevada Secretary of State." },
      { q: "Who issues an apostille for a Las Vegas marriage certificate?", a: "The Nevada Secretary of State. The Clark County Clerk issues the certified copy." },
    ],
    sources: [
      { t: "Clark County Clerk: What Is Proof of Marriage", u: `${CLERK}/what-is-proof-of-marriage` },
      { t: "Nevada Secretary of State: Apostille", u: "https://www.nvsos.gov/sos/businesses/apostille" },
      { t: "Nevada Revised Statutes, Chapter 122", u: "https://www.leg.state.nv.us/NRS/NRS-122.html" },
    ],
  },

  // ------------------------------------------------------------------
  {
    slug: "las-vegas-vow-renewal",
    seoTitle: "Las Vegas Vow Renewal Ideas (No License Needed)",
    metaDescription: "Las Vegas vow renewal ideas, from Elvis chapels to helicopter flights and the Neon Museum. Renewals are symbolic, so no marriage license is needed.",
    answer: "You don't need a marriage license to renew your vows in Las Vegas, because a vow renewal is a symbolic ceremony. Pick any venue that offers renewals, from a classic Elvis chapel to the Neon Museum or a helicopter flight.",
    title: "Renewing Your Vows in Las Vegas: Unique Ideas That Aren't a Ballroom",
    nav: "Vow renewals",
    eyebrow: "Celebrations",
    description: "Vow renewal ideas in Las Vegas, from Elvis chapels to helicopter flights and the Neon Museum. No marriage license required.",
    readMins: 4,
    hero: "renewal",
    body: `
<p class="lede">The best part of a Vegas vow renewal? No paperwork. You're already married, so you don't need a license. Just pick a place, a time and maybe an Elvis.</p>

<h2>Do you need a license to renew vows?</h2>
<p>No. A vow renewal is a symbolic ceremony, so no Clark County license is needed. Bring your enthusiasm and leave the ID drama at home.</p>

<h2>Renewal ideas by personality</h2>
<ul class="checklist">
  <li><strong>The "we did it here the first time" couple:</strong> go back to a <a href="/venues/category/classic-chapels/">classic chapel</a>. Many have hosted renewals for decades.</li>
  <li><strong>The milestone-anniversary couple:</strong> trade the ballroom for the <a href="/venues/the-neon-museum/">Neon Museum</a> after dark.</li>
  <li><strong>The adventure couple:</strong> renew 3,500 feet below the Grand Canyon rim with <a href="/venues/maverick-helicopters-weddings/">Maverick</a> or <a href="/venues/papillon-helicopter-weddings/">Papillon</a>.</li>
  <li><strong>The party couple:</strong> theme it at <a href="/venues/viva-las-vegas-wedding-chapel/">Viva Las Vegas</a> and get your names on the marquee.</li>
  <li><strong>The kids-are-coming couple:</strong> <a href="/venues/springs-preserve/">Springs Preserve</a> gardens or the <a href="/venues/shark-reef-aquarium/">Shark Reef</a>.</li>
</ul>

{{venue-picks:viva-las-vegas-wedding-chapel,little-white-wedding-chapel,the-neon-museum}}
{{planner-cta}}
`,
    faq: [
      { q: "Do you need a marriage license to renew vows in Las Vegas?", a: "No. Vow renewals are symbolic ceremonies, so no marriage license is required." },
    ],
    sources: [
      { t: "Clark County Clerk: Marriage License Requirements", u: `${CLERK}/marriage-license-requirements` },
    ],
  },

  // ------------------------------------------------------------------
  {
    slug: "las-vegas-wedding-weekend-guide",
    seoTitle: "Las Vegas Wedding Weekend Guide for Guests",
    metaDescription: "Plan a Las Vegas wedding weekend guests will love: where to stay, getting around, group activities and what to put in the welcome note.",
    answer: "For a Las Vegas wedding weekend, base guests near the ceremony: Fremont-area hotels for downtown venues, and Strip hotels for Strip or desert venues. Book one shuttle for off-Strip ceremonies, plan a welcome night and a late brunch, and send a welcome note with times, addresses and the dress code.",
    title: "Planning a Las Vegas Wedding Weekend for Your Guests",
    nav: "Guest weekend",
    eyebrow: "Guests",
    description: "How to plan a Las Vegas wedding weekend that guests love: where to stay, getting around, group activities and what to put in the welcome note.",
    readMins: 5,
    hero: "weekend",
    body: `
<p class="lede">A Vegas wedding is a mini vacation for everyone you invite. Plan the weekend around them, not just the ceremony, and people will still be talking about it at your tenth anniversary.</p>

<h2>Where should guests stay?</h2>
<p>Base guests close to your ceremony. A downtown wedding (Neon Museum, Mob Museum, Graceland) suits Fremont-area hotels. A Strip ceremony makes walking to the reception easy. For desert venues, choose a Strip hotel and book one shuttle instead of 20 rideshares.</p>
{{stay22}}

<h2>Group activities that work</h2>
<ul class="checklist">
  <li><strong>Welcome night:</strong> a Fremont Street walk or a show the night before.</li>
  <li><strong>Day trip:</strong> Hoover Dam and Lake Mead, or Red Rock Canyon (remember timed entry from October to May).</li>
  <li><strong>Morning-after brunch:</strong> plan it, and plan it late.</li>
</ul>
{{viator:las vegas tours|Browse group-friendly Las Vegas tours and day trips for your guests.}}

<h2>Write a great welcome note</h2>
<ul class="checklist">
  <li>The schedule, with addresses and drive times</li>
  <li>The dress code, in honest terms ("desert ceremony = no stilettos")</li>
  <li>Heat and hydration advice for summer weddings</li>
  <li>Transport plan: who's riding the shuttle, and when it leaves</li>
  <li>A link to your livestream for anyone who couldn't come</li>
</ul>
{{planner-cta}}
`,
    faq: [
      { q: "Where should wedding guests stay in Las Vegas?", a: "Stay close to the ceremony: Fremont-area hotels for downtown venues, and Strip hotels for Strip venues and as a shuttle base for desert venues." },
    ],
    sources: [
      { t: "BLM: Red Rock Canyon NCA (timed entry)", u: "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon" },
    ],
  },

  // ------------------------------------------------------------------
  {
    slug: "vegas-elopement-packing-list",
    seoTitle: "Las Vegas Elopement Packing List (Desert-Tested)",
    metaDescription: "What to pack for a Las Vegas elopement or desert wedding: legal documents, heat and sun gear, outfit emergency fixes and photo-day keepsakes.",
    answer: "For a Las Vegas elopement, pack original photo IDs for both partners, your pre-application confirmation and a payment card for the $102 license. For a desert ceremony, add water, sun protection, a handheld fan and flat shoes for rocky ground.",
    title: "The Vegas Elopement Packing List (Desert-Tested)",
    nav: "Packing list",
    eyebrow: "Planning",
    description: "Everything to pack for a Las Vegas elopement or desert wedding: legal documents, heat survival, outfit emergencies and photo-day essentials.",
    readMins: 4,
    hero: "pack",
    body: `
<p class="lede">The desert is gorgeous and unforgiving. The heat is dry, the wind kicks up, and the ground is rocky. Here's what to pack so your photos show the view, not a sunburn.</p>

<h2>Legal documents (don't check these bags)</h2>
<ul class="checklist">
  <li>Original photo IDs for both of you (no copies)</li>
  <li>Your online pre-application confirmation</li>
  <li>A card for the $102 license fee</li>
  <li>Your witness (or a confirmed venue-provided witness)</li>
</ul>

<h2>Heat & sun</h2>
{{amazon:portable handheld fan|Rechargeable handheld fan}}
{{amazon:cooling towel|Cooling towels for the wedding party}}
{{amazon:sunscreen stick spf 50|Mineral sunscreen stick (no white cast in photos)}}
{{amazon:insulated water bottle 32 oz|Insulated water bottle}}
{{amazon:sun parasol umbrella uv|UV parasol (also great in photos)}}

<h2>Outfit emergencies</h2>
{{amazon:portable garment steamer travel|Travel garment steamer}}
{{amazon:wedding emergency kit|Wedding day emergency kit}}
{{amazon:foldable ballet flats|Foldable flats for rocky ground}}
{{amazon:blister bandages|Blister bandages}}
{{amazon:veil clips|Wind-proof veil clips}}

<h2>The keepsakes</h2>
{{amazon:vow books set|Vow books}}
{{amazon:wedding ring box|Ring box for photos}}
{{amazon:garment bag wedding dress travel|Wedding dress travel garment bag}}

<p class="small">As an Amazon Associate, Unique Vegas Weddings earns from qualifying purchases. It doesn't change our picks.</p>
{{planner-cta}}
`,
    faq: [
      { q: "What should I bring to get married in Las Vegas?", a: "Original photo IDs for both partners, a card for the $102 license fee, and a witness. For outdoor ceremonies, add water, sun protection and shoes that can handle rocky ground." },
    ],
    sources: [
      { t: "Clark County Clerk: Marriage License Requirements", u: `${CLERK}/marriage-license-requirements` },
    ],
  },
];
