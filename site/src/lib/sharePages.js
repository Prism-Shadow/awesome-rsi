// A small static page per detail page, published at p/<id>/. Link previews in WeChat, X, or Slack
// read its title and description without running the site's JavaScript; visitors are sent straight
// on to the detail page.
import { catalogEntries, entryHref } from "./catalog.js";

export const SITE_URL = "https://prism-shadow.github.io/awesome-rsi/";

const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (text) => text.replace(/[&<>"']/g, (character) => ENTITIES[character]);

export function sharePath(entry) {
  return `p/${encodeURIComponent(entry.id)}/index.html`;
}

export function findShareEntry(id) {
  return catalogEntries.find((entry) => entry.id === id) ?? null;
}

export function sharePage(entry, siteUrl = SITE_URL) {
  const url = `${siteUrl}p/${encodeURIComponent(entry.id)}/`;
  // Relative, so the redirect also works on a local preview server.
  const target = `../../${entryHref(entry)}`;
  const title = entry.title.startsWith(entry.nickname) ? entry.title : `${entry.nickname}: ${entry.title}`;
  const meta = {
    title: escapeHtml(title),
    description: escapeHtml(entry.summary),
  };
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${meta.title} · Awesome RSI</title>
    <meta name="description" content="${meta.description}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Awesome RSI" />
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <script>location.replace(${JSON.stringify(target).replace(/</g, "\\u003c")});</script>
  </head>
  <body>
    <p><a href="${target}">${meta.title}</a></p>
  </body>
</html>
`;
}

export { catalogEntries };
