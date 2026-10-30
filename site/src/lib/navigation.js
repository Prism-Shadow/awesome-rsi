// The home page lives at the root URL; every other page keeps its original fragment.
export const TAB_HASHES = {
  home: "",
  methods: "#methods",
  papers: "#benchmarks",
  graph: "#graph-methods",
  blog: "#blog",
};

export const NAV_TABS = ["home", "methods", "papers", "graph", "blog"];

export function tabFromHash(hash = "") {
  if (hash.startsWith("#blog")) return "blog";
  if (hash.startsWith("#graph") || hash === "#methods-graph") return "graph";
  if (hash.startsWith("#methods")) return "methods";
  if (hash === "#benchmarks" || hash === "#papers") return "papers";
  return "home";
}
