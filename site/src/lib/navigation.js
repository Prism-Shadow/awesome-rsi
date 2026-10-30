// The home page lives at the root URL; every other page keeps its original fragment.
// Blog posts open at #blog/<id>; the post list itself is a section of the home page (#blog).
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
  if (hash === "#benchmarks" || hash === "#papers") return "papers";
  return "home";
}
