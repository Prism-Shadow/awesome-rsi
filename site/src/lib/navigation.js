// Every page lives at a real path under the site base, and the build writes an HTML file for each
// (see vite.config.js), so a page's address is also its share link. Sections of the home page keep
// in-page anchors (#recently-added, #blog).
export const BASE = import.meta.env?.BASE_URL ?? "/awesome-rsi/";

export const TAB_PATHS = {
  home: BASE,
  methods: `${BASE}methods/`,
  papers: `${BASE}benchmarks/`,
  graph: `${BASE}graph/`,
};

export const NAV_TABS = ["home", "methods", "papers", "graph"];

// Detail pages sit under their list: methods/<id>/ for methods and systems, benchmarks/<id>/ for benchmarks.
const COLLECTION_TABS = { methods: "methods", benchmarks: "papers" };

// The page a path shows: { tab, detail?, postId?, graphKind? }, with tab "notFound" for anything else.
export function routeFromPath(pathname = BASE) {
  const base = BASE.replace(/\/$/, "");
  if (pathname !== base && !pathname.startsWith(BASE)) return { tab: "notFound" };
  const [section, item, ...rest] = pathname.slice(base.length).split("/").filter(Boolean).map(decodeURIComponent);
  if (!section) return { tab: "home" };
  if (rest.length) return { tab: "notFound" };
  if (section in COLLECTION_TABS) {
    return item ? { tab: COLLECTION_TABS[section], detail: { collection: section, id: item } } : { tab: COLLECTION_TABS[section] };
  }
  if (section === "graph" && (!item || item === "benchmarks")) return { tab: "graph", graphKind: item ? "benchmark" : "methods" };
  if (section === "blog" && item) return { tab: "blog", postId: item };
  return { tab: "notFound" };
}

export function detailPath(collection, id) {
  return `${BASE}${collection}/${encodeURIComponent(id)}/`;
}

export function postPath(id) {
  return `${BASE}blog/${encodeURIComponent(id)}/`;
}

// The citation graph for methods or benchmarks, optionally opened focused on one paper.
export function graphPath(kind = "methods", focusId) {
  const path = kind === "benchmark" ? `${BASE}graph/benchmarks/` : TAB_PATHS.graph;
  return focusId ? `${path}?paper=${encodeURIComponent(focusId)}` : path;
}

// A list opened with one taxonomy label selected, e.g. methods/?artifact=Memory.
export function filterPath(collection, dimension, value) {
  return `${BASE}${collection}/?${new URLSearchParams({ [dimension]: value })}`;
}
