# Unique Vegas Weddings: launch guide

The site is finished: 61 pages, 29 verified venues, 10 sourced guides, lucky-date tools, a 25-page paid planner, a free lead-magnet PDF, brand kit and 13 Pinterest pins. What's left are the account setups only you can do. Plan on about 2–3 hours total.

---

## What's in this folder

| Folder / file | What it is |
|---|---|
| `public/` | **The finished website.** This is what goes live. (Rebuilt automatically, don't edit by hand.) |
| `src/data/config.mjs` | **The only file you edit to turn on revenue.** Paste IDs, leave blanks blank. |
| `src/data/venues.mjs` | Venue data (facts checked 2026-10-04). Add, edit, mark `status: "partner"` / `featured: true`. |
| `src/content/guides.mjs` | Guide articles. |
| `build.mjs` | Turns `src/` into `public/`. Run with `node build.mjs`. |
| `.github/workflows/weekly-rebuild.yml` | The self-update engine (see below). |
| `products/the-unique-vegas-wedding-planner.pdf` | **The paid product.** Upload to Gumroad or Lemon Squeezy. Never put it in `public/`. |
| `marketing/pins/` | 13 Pinterest pins (1000×1500), ready to post. |
| `brand/` | Brand guide PDF, logo SVG/PNG, mark. |
| `docs/venue-sheet-template.csv` | Columns for adding venues from a Google Sheet. |

---

## Step 1: Put it online (free, self-updating)

**Recommended: GitHub Pages ($0)**
1. Create a free GitHub account and install **GitHub Desktop**.
2. In GitHub Desktop: *File → Add local repository →* choose this folder → *Publish repository*. Make it **Public** (free Pages hosting needs a public repo; `products/` is git-ignored, so the paid PDF is never uploaded).
3. On github.com, open the repo and go to **Settings → Pages → Source: GitHub Actions**. The first build runs on its own, in about 2 minutes.
4. Still in **Settings → Pages → Custom domain**, enter `uniquevegasweddings.com` and tick **Enforce HTTPS** once it's available.
5. At your domain registrar's DNS settings, add:
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` → `YOURUSERNAME.github.io`
   DNS can take up to 24 hours.

**Fastest (but no weekly rebuild): Netlify Drop.** Drag the `public/` folder onto app.netlify.com/drop and connect your domain. The in-browser parts still update themselves: lucky dates, venue of the week, seasonal banners and the year. The weekly SEO refresh and Google Sheet sync won't run.

---

## Step 2: Turn on revenue (edit `src/data/config.mjs`, then push)

Do these in order. The first three matter most.

| # | Stream | Setup | Paste into config |
|---|---|---|---|
| 1 | **Email list** (free checklist) | formspree.io → new form "Newsletter" | `formspreeNewsletter` |
| 2 | **Planner sales** | Gumroad or Lemon Squeezy → new product → upload the planner PDF | `plannerCheckoutUrl` (+ `plannerPrice`) |
| 3 | **Venue listings** | Stripe → Payment Links → two monthly subscriptions | `featuredCheckoutUrl`, `spotlightCheckoutUrl` (+ prices) |
| 4 | Partner applications | formspree.io → new form "Partners" | `formspreePartner` |
| 5 | Amazon affiliate (packing list) | affiliate-program.amazon.com | `amazonTag` |
| 6 | Viator affiliate (helicopters, tours) | partnerresources.viator.com | `viatorPid` |
| 7 | Hotel map for guests | Stay22 → copy the map embed URL | `stay22MapUrl` |
| 8 | Analytics | Google Analytics 4 property | `ga4Id` |
| 9 | Display ads (later) | Apply to AdSense once traffic is steady | `adsenseClient` |

The build prints a reminder list of anything still blank. The forms work without config (they fall back to email), but set Formspree before you promote the site.

**Pricing:** the Featured ($79/mo), Spotlight ($199/mo) and planner ($19) prices are my placeholders, not market benchmarks. Change them freely.

---

## Step 3: Get traffic (this is the actual business)

1. **Google Search Console:** add the domain, paste the verification code into `googleSiteVerification` in the config, and submit `https://uniquevegasweddings.com/sitemap.xml`. (The domain isn't in your Search Console account yet.)
1. **Bing Webmaster Tools:** same thing with `bingSiteVerification`. Bing's index feeds ChatGPT search and Copilot, so this is the AI-search step. It can import your site straight from Search Console.
2. **Pinterest Business account:** post the 13 pins in `marketing/pins/`. Link each one to its page (pin filename = page topic). Weddings run on Pinterest, so this is your fastest free channel.
3. **Venue outreach:** every venue page has a "Claim this listing" button. Email each venue a link to its page and the "for venues" page. That's how listings become Featured revenue.

---

## What updates itself (no work from you)

**In every visitor's browser, every day:**
- Lucky-date lists, countdowns and the "big date coming up" banner (pure date math, any year)
- Venue of the week (rotates weekly; paid `featured: true` venues get priority)
- Seasonal banners: Valley of Fire's Dec 1–14 closure (shows in November and early December) and the summer heat tips (June–August)
- The current month's weather note on the "best time" guide, and footer years

**Every Monday, via the GitHub Action:**
- Full rebuild: lucky-date pages roll forward (passed dates drop off, next year's page appears automatically). Sitemap dates only change when the content really changed, because search engines stop trusting sitemaps that fake it.
- If you set `venueSheetCsvUrl`, new rows in your Google Sheet become live venue pages, with no code
- When any venue hasn't been re-checked for 180 days, it **opens a GitHub Issue** listing exactly which venue pages to verify

**Partner inquiries:** a partner venue's inquiry form posts to that venue's own Formspree form (`inquiryFormId` in `venues.mjs`). Leads go straight to them, not to you.

## What still needs you (~1 hour/month)
- Onboard paying venues: set `status: "partner"` or `featured: true`, add their `inquiryFormId`, swap in their photos if provided
- Re-check venue prices when the GitHub Issue appears (about twice a year)
- Optional: one new guide a month compounds SEO faster than anything else

---

## SEO and AI search: what's built in

- **Every page:** a unique title under 60 characters, a unique description under 160, one H1, clean heading order, canonical URL, share images and structured data (the build prints a warning if any of this breaks).
- **Answer-first writing:** each guide opens with a "Quick answer" box, and each venue page has an at-a-glance summary and FAQ. Those short, dated, sourced statements are what Google's AI Overviews, ChatGPT, Claude and Perplexity quote.
- **Structured data:** Organization, WebSite, Article (with citations), FAQPage, ItemList, EventVenue, Product and BreadcrumbList.
- **`robots.txt`** welcomes search engines and AI assistants by name. To let AI assistants cite the site but not train on it, set `allowAiTraining: false` in the config.
- **`/llms.txt`, `/llms-full.txt` and `/data/venues.json`:** plain-text and data versions of the whole site for AI tools. These are an emerging convention, not a ranking factor. They're cheap, so they're in.
- **IndexNow:** when you push a change, the deploy tells Bing which pages changed. No setup.
- **Old URLs:** if the previous version of the site is live, list its page addresses under `redirects` in the config so they forward to the new pages. The entries there now are guesses.

## Plain-language search

Visitors can type what they want in their own words at `/search/`, from the search bar on the homepage, or from "Search" in the menu. It reads:
- **Budgets:** "under $2,500", "around 6k", "cheap"
- **Guest counts:** "for 80 guests", "just the two of us", "big wedding"
- **Setting, area and vibe:** indoor, outdoor, downtown, on the Strip, desert, Elvis, quirky, luxury
- **Months and seasons:** adds a weather note from the NOAA averages
- **Questions:** "how much is a marriage license?", "do we need a witness?", "how much does the Neon Museum cost?"

It shows how it read the request, answers questions from the guides with a source link, and never makes anything up, because it only matches against what's published on the site. It runs in the visitor's browser: no AI service, no monthly cost, nothing to maintain. The search data rebuilds itself whenever the site does, so new venues are searchable automatically.

Once Google Analytics is connected, the Site Search report shows what people typed. Searches with no results are your list of content to write next.

What the site can't do for itself: earn links and mentions. AI assistants and Google both lean on what other sites say about you. Venue partners linking to their listing, Pinterest, and answering wedding questions on Reddit under the brand name will move this more than any further on-page work.

## Adding a venue (no code)
Use the Google Sheet route (`docs/venue-sheet-template.csv` shows the columns), or copy any venue block in `src/data/venues.mjs`. Rule: only original copy and facts from the venue's official site. No scraped text or photos.

## Rebuilding creatives (optional)
Changed a venue or the planner? `npm run creatives` regenerates OG images, pins, icons and PDFs. Needs Python Playwright.

---

*Legal and permit facts were checked against official sources on 2026-10-04 (see `docs/sources.md`). The privacy policy and terms are plain-language templates. Have them reviewed before you take payments.*
