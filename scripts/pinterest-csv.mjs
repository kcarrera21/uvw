// Builds Pinterest bulk-upload CSVs (Pinterest → Create → Create Pins in bulk → Upload .csv).
// Pins are served by the site at /pins/<name>.png. One pin a day, alternating topic and venue pins.
// Usage: node scripts/pinterest-csv.mjs [YYYY-MM-DD]  (the first pin goes out at 7 p.m. Pacific the evening before that date; default: two days from now)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { venues, CATEGORIES } from "../src/data/venues.mjs";
import { guides } from "../src/content/guides.mjs";
import { config as C } from "../src/data/config.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "marketing/pinterest");
fs.mkdirSync(OUT, { recursive: true });
const PHOTOS = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/photo-credits.json"), "utf8"));
const cat = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.name]));
const g = Object.fromEntries(guides.map((x) => [x.slug, x]));
const money = (n) => "$" + Number(n).toLocaleString("en-US");
const BOARDS = { venues: "Unique Las Vegas Wedding Venues", plan: "Las Vegas Wedding Planning Tips", ideas: "Vegas Wedding Ideas" };
const utm = (u, name) => `${C.domain}${u}?utm_source=pinterest&utm_medium=social&utm_campaign=pins&utm_content=${name}`;
const clip = (s, n) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…");

const topics = [
  ["marriage-license", "How to get a Las Vegas marriage license", BOARDS.plan, "/guides/las-vegas-marriage-license/", g["las-vegas-marriage-license"].metaDescription, "las vegas marriage license, clark county marriage license, vegas wedding paperwork"],
  ["elope", "How to elope in Las Vegas: a 48-hour plan", BOARDS.plan, "/guides/how-to-elope-in-las-vegas/", g["how-to-elope-in-las-vegas"].metaDescription, "las vegas elopement, elope in vegas, vegas elopement ideas"],
  ["cost", "What a Las Vegas wedding actually costs", BOARDS.plan, "/guides/las-vegas-wedding-cost/", g["las-vegas-wedding-cost"].metaDescription, "las vegas wedding cost, vegas wedding budget, cheap vegas wedding"],
  ["unique-venues", "Unique Las Vegas wedding venues", BOARDS.venues, "/venues/", `${venues.length} unique places to get married in Las Vegas, from a neon boneyard and a ghost town to red-rock canyons and towers 800 feet up. Published prices and verified details.`, "unique las vegas wedding venues, vegas wedding venues, alternative wedding venues"],
  ["best-time", "The best time of year to marry in Las Vegas", BOARDS.plan, "/guides/best-time-to-get-married-in-las-vegas/", g["best-time-to-get-married-in-las-vegas"].metaDescription, "best time to get married in las vegas, vegas wedding weather, desert wedding season"],
  ["drive-thru", "Yes, the Las Vegas drive-thru wedding is real", BOARDS.ideas, "/venues/tunnel-of-love-drive-thru/", "The Tunnel of Love drive-thru wedding: ceremonies at a drive-up window for cars, motorcycles or walk-ups, from $150. Here's how it works.", "drive thru wedding las vegas, tunnel of love, quirky vegas wedding"],
  ["courthouse", "The $77.75 Las Vegas courthouse wedding", BOARDS.plan, "/guides/las-vegas-courthouse-wedding/", g["las-vegas-courthouse-wedding"].metaDescription, "las vegas courthouse wedding, civil ceremony las vegas, budget wedding"],
  ["neon-museum", "Getting married at the Neon Museum", BOARDS.venues, "/venues/the-neon-museum/", "Say your vows among retired Las Vegas neon signs. Daytime packages from $2,500, a nighttime Stardust Wedding with projection mapping, and up to 90 guests with add-ons.", "neon museum wedding, neon boneyard wedding, vintage vegas wedding"],
  ["desert-permits", "Desert wedding permits near Las Vegas", BOARDS.plan, "/guides/desert-wedding-permits/", g["desert-wedding-permits"].metaDescription, "valley of fire wedding, red rock canyon wedding permit, desert elopement"],
  ["helicopter", "Helicopter weddings over Las Vegas", BOARDS.ideas, "/venues/category/sky-high/", "Helicopter weddings over the Strip and down into the Grand Canyon, plus tower chapels and the High Roller. Published prices and what each one includes.", "helicopter wedding las vegas, grand canyon wedding, sky high wedding"],
  ["lucky-2027", "The luckiest wedding dates of 2027", BOARDS.ideas, "/lucky-wedding-dates/2027/", "Palindromes, mirror dates and lucky sevens in 2027, with the weekday for each, so you can book a memorable date early.", "lucky wedding dates 2027, special wedding dates, palindrome dates"],
].map(([name, title, board, url, desc, kw]) => ({ name, title, board, url, desc, kw }));

// Venue pins only where we have a real photo of the venue itself.
const venuePins = venues.filter((v) => PHOTOS[v.slug] && v.slug !== "sahara-las-vegas").map((v) => ({
  name: "venue-" + v.slug,
  title: clip(`${v.name}: a unique Las Vegas wedding venue`, 100),
  board: BOARDS.venues,
  url: `/venues/${v.slug}/`,
  desc: clip(`${v.bestFor} ${v.priceFrom ? `Published packages from ${money(v.priceFrom)}.` : "Pricing by custom quote."}${v.guestMax ? ` Up to ${v.guestMax.toLocaleString("en-US")} guests.` : ""} ${v.area}. Verified details and the official booking link.`, 500),
  kw: `${v.name.toLowerCase()} wedding, ${cat[v.category].toLowerCase()} las vegas wedding, unique las vegas wedding venues`,
}));

// Interleave topic and venue pins.
const order = [];
for (let i = 0; i < Math.max(topics.length, venuePins.length); i++) { if (topics[i]) order.push(topics[i]); if (venuePins[i]) order.push(venuePins[i]); }

const start = new Date((process.argv[2] || new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10)) + "T02:00:00Z"); // 02:00 UTC = 7 p.m. Pacific (PDT) the evening before
const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
const header = ["Title", "Media URL", "Pinterest board", "Thumbnail", "Description", "Link", "Publish date", "Keywords"];
const rows = order.map((p, i) => {
  const d = new Date(start.getTime() + i * 864e5);
  return [clip(p.title, 100), `${C.domain}/pins/${p.name}.png`, p.board, "", clip(p.desc, 500), utm(p.url, p.name), d.toISOString().slice(0, 19), p.kw];
});
// Pinterest schedules up to about 30 days ahead, so split into 28-pin files.
const files = [];
for (let i = 0; i < rows.length; i += 28) {
  const f = path.join(OUT, `pinterest-bulk-${String(files.length + 1).padStart(2, "0")}.csv`);
  fs.writeFileSync(f, [header, ...rows.slice(i, i + 28)].map((r) => r.map(q).join(",")).join("\n") + "\n");
  files.push(path.relative(ROOT, f));
}
console.log(`${rows.length} pins (${topics.length} topic, ${venuePins.length} venue) → ${files.join(", ")}`);
console.log(`Boards to create first: ${Object.values(BOARDS).join(" | ")}`);
