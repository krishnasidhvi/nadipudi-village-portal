// Runs after `vite build`. GitHub Pages has no URL rewriting, so each page gets
// its own dist/<path>/index.html with the right title, description and
// canonical link. Also writes sitemap.xml and a 404.html fallback.

import fs from "node:fs";
import path from "node:path";
import { routes, SITE_URL } from "../src/utils/routes.js";

const DIST = path.join(process.cwd(), "dist");
const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function replaceOnce(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`postbuild: pattern not found in index.html: ${pattern}`);
  return html.replace(pattern, replacement);
}

function pageHtml(route) {
  const url = route.path ? `${SITE_URL}${route.path}/` : SITE_URL;
  const title = escapeHtml(route.titleEn);
  const description = escapeHtml(route.descEn);
  let html = replaceOnce(template, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = replaceOnce(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`);
  const social = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
  ].join("\n    ");
  return replaceOnce(html, /<\/head>/, `  ${social}\n  </head>`);
}

for (const route of routes) {
  const dir = path.join(DIST, route.path);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), pageHtml(route), "utf8");
}

// Unknown addresses load the app, which then shows the home page.
fs.writeFileSync(path.join(DIST, "404.html"), template, "utf8");

const today = new Date().toISOString().slice(0, 10);
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes
    .map((r) => `  <url><loc>${r.path ? `${SITE_URL}${r.path}/` : SITE_URL}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap, "utf8");

console.log(`postbuild: wrote ${routes.length} pages, 404.html and sitemap.xml`);
