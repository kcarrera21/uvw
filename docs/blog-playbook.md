# Daily blog playbook (Off-Script)

The blog is called **Off-Script** (from the site tagline, "Vegas weddings, off-script"). Call it that in copy, never "the blog" in headings. One new post goes live on uniquevegasweddings.com every day. This file is the standing brief for whoever writes it (usually the scheduled Claude task). Topic queue: `docs/blog-topics.md`.

## Where posts live
- One file per post: `src/content/blog/YYYY-MM-DD-slug.mjs`. Copy the newest post's structure exactly (fields: slug, date, photo, category, eyebrow, tags, guides, seoTitle, metaDescription, title, description, answer, readMins, body, faq, sources).
- `date` is the publish date (Pacific time). A future date stays hidden until a build runs on or after it.
- `category` is one of the six venue category slugs.
- `photo` is the post's lead image: a key from `src/data/photo-credits.json` (a venue slug with a real photo, or a `cat-…`/`hero-…` photo). It shows under the headline and is what Google Discover, Facebook and the RSS feed use. Pick a photo of a place the post actually covers, and don't reuse the photo of either of the last 3 posts. If you leave it out, the build uses the first pictured venue in the post's `{{venue-picks}}`, then the category photo. Never point it at an illustration-only venue.
- New photos come from Unsplash (Unsplash License) through the Unsplash connector: search, check the photo really shows the place (or set `note: "area"` if it shows the surroundings), then record the download with the connector before using it. Save `src/assets/photos/<key>.webp` at 1600px wide and `<key>-sm.webp` at 720px wide, add the credit to `photo-credits.json`, and run `python3 scripts/discover-images.py` before building so its 1200px Discover crops exist.
- `guides` lists 1–3 related guide slugs from `src/content/guides.mjs`.
- Body is HTML using the same pieces as the guides: `<p class="lede">`, `<h2>`, `<div class="quickfacts">`, `<ul class="checklist">`, `<div class="note">`, and the tokens `{{venue-picks:slug,slug}}`, `{{planner-cta}}`, `{{season-now}}`, `{{price-table}}`, `{{climate-table}}`.

## Picking the topic
1. Take the first unchecked topic in `docs/blog-topics.md` that is still timely, preferring anything tied to a date in the next 2–8 weeks.
2. Skip it if an existing guide or post already answers the same question. Check titles and slugs first. One topic per post, never a near-duplicate.
3. Tick it off in `blog-topics.md` with the publish date. When fewer than 10 topics are left, add 10 new ones in the same style.

## Facts (non-negotiable)
- Every fact, price, date, time, capacity and rule comes from an official source opened during this run: the venue's own site, Clark County Clerk, NOAA/NWS, National Park Service, BLM, Nevada State Parks, the Las Vegas Convention and Visitors Authority, or similar primary sources. List each one in `sources`.
- Venue facts already on the site (`src/data/venues.mjs`) can be reused and cited as "Our venue listings, checked <date>", but anything new gets checked live.
- Never invent numbers, prices, quotes, statistics, rankings or "most popular" claims. If you can't verify it, leave it out.
- Do the date math in code (day of week, counts, gaps between dates).
- Original writing only. Don't copy venue wording beyond a short quoted phrase (under 15 words, attributed). Never use photos from venue sites.

## Voice
- Plain, warm, confident, a little dry. Short paragraphs. Talk to the couple ("you").
- Open with the useful answer, not a warm-up.
- Never use: leverage, utilize, robust, synergy, best-in-class, cutting-edge, furthermore, moreover, additionally, "it's important to note", "in today's world", "when it comes to", "nestled", "tapestry", "elevate", "unforgettable experience".
- Don't write posts that single out SAHARA Las Vegas. It's listed like every other venue.

## Shape and SEO
- 600–1,100 words of body. `readMins` = words ÷ 220, rounded up.
- `seoTitle` ≤ 60 characters, `metaDescription` ≤ 160, both unique on the site. `answer` is 2–3 sentences that stand alone.
- 3–5 FAQ entries answering real questions in one or two sentences each.
- Link to at least one guide and at least one venue page.

## Publish checklist
1. `node build.mjs`: must finish with no title, description or heading warnings. Delete `stale-report.md` afterwards.
2. Open the built page (`public/blog/<slug>/index.html`) and read it once start to finish.
3. Commit as `Claude <noreply@anthropic.com>` with message "Blog: <title>", push to `main`, and confirm the GitHub Action deploys successfully. The deploy pings IndexNow by itself.
4. If any step fails, don't publish a half-finished post. Tell Kat what failed.
