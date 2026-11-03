// The home page lives at the root URL; every other page keeps its original fragment.
// Blog posts open at #blog/<id>; the post list itself is a section of the home page (#blog).
// Detail pages open under their list: #methods/<id> for methods and systems, #benchmarks/<id>
// for benchmark papers, and the citation graph can focus a node with #graph-methods/<id>.
export const TAB_HASHES = {
  home: "",
  methods: "#methods",
  papers: "#benchmarks",
  graph: "#graph-methods",
};

export const NAV_TABS = ["home", "methods", "papers", "graph"];

export function tabFromHash(hash = "") {
  if (hash.startsWith("#blog/")) return "blog";
  if (hash.startsWith("#graph") || hash === "#methods-graph") return "graph";
  if (hash.startsWith("#methods")) return "methods";
  if (hash === "#benchmarks" || hash === "#papers" || hash.startsWith("#benchmarks/")) return "papers";
  return "home";
}

const DETAIL_ROUTES = { "#methods/": "methods", "#benchmarks/": "benchmarks" };

// The collection and entry a detail-page hash names, or null for any other hash.
export function detailFromHash(hash = "") {
  for (const [prefix, collection] of Object.entries(DETAIL_ROUTES)) {
    if (hash.startsWith(prefix) && hash.length > prefix.length) {
      return { collection, id: decodeURIComponent(hash.slice(prefix.length)) };
    }
  }
  return null;
}

export function detailHash(collection, id) {
  return `#${collection}/${encodeURIComponent(id)}`;
}

// The entry the citation graph should focus, from #graph-methods/<id> or #graph-benchmark/<id>.
export function graphFocusFromHash(hash = "") {
  const match = hash.match(/^#graph-(methods|benchmark)\/(.+)$/);
  return match ? { kind: match[1], id: decodeURIComponent(match[2]) } : null;
}
