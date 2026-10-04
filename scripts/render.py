"""Renders every creative listed in .render/jobs.json (PNG screenshots + PDFs).
Requires: pip install playwright && playwright install chromium"""
import json, os, sys
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
jobs = json.load(open(os.path.join(ROOT, ".render", "jobs.json")))
only = sys.argv[1] if len(sys.argv) > 1 else None

with sync_playwright() as p:
    b = p.chromium.launch()
    for j in jobs:
        if only and only not in j["out"]:
            continue
        os.makedirs(os.path.dirname(j["out"]), exist_ok=True)
        pg = b.new_page(viewport={"width": j["w"], "height": j["h"]}, device_scale_factor=1)
        pg.goto("file://" + j["html"])
        pg.evaluate("document.fonts.ready")
        pg.wait_for_timeout(120)
        if j["type"] == "pdf":
            pg.pdf(path=j["out"], format="Letter", print_background=True, margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})
        else:
            pg.screenshot(path=j["out"], clip={"x": 0, "y": 0, "width": j["w"], "height": j["h"]}, omit_background=("icon-32" in j["html"]))
        pg.close()
    b.close()
print("rendered", len(jobs) if not only else "subset")
