// The pages the build writes as HTML files (see vite.config.js). Each is a copy of index.html with its
// own title, description, canonical URL, and preview tags, so a link to any page previews that page.
import { blogPosts } from "../data/blogPosts.js";
import { methods } from "../data/methods.js";
import { systems } from "../data/systems.js";
import { papers } from "../data/papers.js";
import { methodCitationEdges } from "../data/methodCitationGraph.js";
import { appCopy } from "../i18n.js";
import { catalogEntries, entryTitle } from "./catalog.js";
import { TAB_PATHS, detailPath, graphPath, postPath } from "./navigation.js";

export const SITE_ORIGIN = "https://prism-shadow.github.io";

const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (text) => text.replace(/[&<>"']/g, (character) => ENTITIES[character]);
const titled = (title) => `${title} — Awesome RSI`;

export function staticPages() {
  const tabs = appCopy.en.tabs;
  return [
    { path: TAB_PATHS.home, title: appCopy.en.pageTitle, description: appCopy.en.pageDescription },
    {
      path: TAB_PATHS.methods,
      title: titled(tabs.methods),
      description: `${methods.length} methods and ${systems.length} systems for recursive self-improvement, filterable along nine dimensions.`,
    },
    {
      path: TAB_PATHS.papers,
      title: titled(tabs.papers),
      description: `${papers.length} benchmark papers for recursive self-improvement, filterable by origin, mode, artifact, and metrics.`,
    },
    {
      path: TAB_PATHS.graph,
      title: titled(tabs.graph),
      description: `Verified citations among the collection's methods: ${methods.length} papers and ${methodCitationEdges.length} citations.`,
    },
    {
      path: graphPath("benchmark"),
      title: titled(`${tabs.graph}: ${tabs.papers}`),
      description: "Citations among the collection's benchmark papers.",
    },
    ...catalogEntries.map((entry) => ({
      path: detailPath(entry.collection, entry.id),
      title: titled(entryTitle(entry)),
      description: entry.summary,
      type: "article",
    })),
    ...blogPosts.map((post) => ({ path: postPath(post.id), title: titled(post.title), description: post.summary, type: "article" })),
  ];
}

function replaceOnce(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`index.html has no match for ${pattern}`);
  return html.replace(pattern, replacement);
}

export function pageHtml(template, page) {
  const url = `${SITE_ORIGIN}${page.path}`;
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const tags = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${page.type ?? "website"}" />`,
    `<meta property="og:site_name" content="Awesome RSI" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:card" content="summary" />`,
  ];
  let html = replaceOnce(template, /<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = replaceOnce(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`);
  return html.replace(/\s*<\/head>/, `\n${tags.map((tag) => `    ${tag}\n`).join("")}  </head>`);
}

// GitHub Pages serves 404.html for any path without a file; the app then shows its not-found page.
export function notFoundHtml(template) {
  const html = replaceOnce(template, /<title>[^<]*<\/title>/, `<title>${titled(appCopy.en.notFound)}</title>`);
  return html.replace(/\s*<\/head>/, `\n    <meta name="robots" content="noindex" />\n  </head>`);
}
