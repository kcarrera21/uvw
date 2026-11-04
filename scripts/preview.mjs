// Local production preview with gzip and the same cache policy as src/static/_headers.
// GitHub Pages will not send these headers; Lighthouse against this server will.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const PORT = Number(process.env.PORT || 8765);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".pdf": "application/pdf",
};

function cacheControl(urlPath) {
  if (/^\/assets\/(photos|fonts|img|css|js|art)\//.test(urlPath)) return "public, max-age=31536000, immutable";
  if (urlPath.endsWith(".html") || urlPath === "/" || urlPath.endsWith("/")) return "public, max-age=600";
  return "public, max-age=3600";
}

const server = http.createServer((req, res) => {
  const raw = decodeURIComponent((req.url || "/").split("?")[0]);
  let rel = raw.endsWith("/") ? raw + "index.html" : raw;
  const file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403);
    res.end();
    return;
  }
  fs.readFile(file, (err, buf) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
      res.end("Not found");
      return;
    }
    const ext = path.extname(file);
    const headers = {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "Cache-Control": cacheControl(raw),
      "X-Content-Type-Options": "nosniff",
    };
    const compressible = /\.(html|css|js|svg|json|xml|txt|webmanifest)$/.test(ext);
    const ae = req.headers["accept-encoding"] || "";
    if (compressible && ae.includes("gzip")) {
      zlib.gzip(buf, (zipErr, gz) => {
        if (zipErr) {
          res.writeHead(200, headers);
          res.end(buf);
          return;
        }
        headers["Content-Encoding"] = "gzip";
        headers.Vary = "Accept-Encoding";
        res.writeHead(200, headers);
        res.end(gz);
      });
      return;
    }
    res.writeHead(200, headers);
    res.end(buf);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`preview http://127.0.0.1:${PORT}`);
});
