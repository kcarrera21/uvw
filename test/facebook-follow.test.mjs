import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "../src/data/config.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PAGE = "https://www.facebook.com/uniquevegasweddings";

test("the Facebook follow link is the existing Page and not a plugin", () => {
  assert.equal(config.social.facebook, PAGE);
  assert.equal(config.social.pinterest, "https://www.pinterest.com/uniquevegasweddings/");
  const build = fs.readFileSync(path.join(root, "build.mjs"), "utf8");
  const css = fs.readFileSync(path.join(root, "src/assets/css/site.css"), "utf8");
  assert.match(build, /Follow on Facebook/);
  assert.match(build, /\["facebook", "Follow on Facebook"/);
  assert.match(css, /\.social-links a:focus-visible/);
  assert.equal(build.includes("connect.facebook.net"), false);
  assert.equal(build.includes("fb-root"), false);
  assert.equal(build.includes("facebook.com/plugins"), false);
  assert.equal(build.includes("facebook.com/sharer"), false);
});

test("a built page puts that exact href in the shared footer and on contact", () => {
  const home = path.join(root, "public/index.html");
  const contact = path.join(root, "public/contact/index.html");
  const venue = path.join(root, "public/venues/minus5-icebar/index.html");
  assert.equal(fs.existsSync(home), true, "build public/ before this render check");
  for (const file of [home, contact, venue]) {
    const html = fs.readFileSync(file, "utf8");
    const hrefs = [...html.matchAll(/href="(https:\/\/www\.facebook\.com\/[^"]*)"/g)].map((m) => m[1]);
    assert.ok(hrefs.length >= 1, file);
    assert.deepEqual([...new Set(hrefs)], [PAGE]);
    assert.match(html, />Follow on Facebook</);
    assert.equal(html.includes("connect.facebook.net"), false);
    assert.match(html, /Follow Unique Vegas Weddings on Pinterest|social-links[\s\S]*Pinterest/);
  }
  const footer = fs.readFileSync(home, "utf8").split('<footer class="site-footer">')[1];
  assert.match(footer, new RegExp(`href="${PAGE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>[\\s\\S]*Follow on Facebook`));
  assert.match(footer, /Pinterest/);
});
