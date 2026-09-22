export const TAB_HASHES = {
  blog: "#blog",
  methods: "#methods",
  papers: "#benchmarks",
  graph: "#graph-methods",
  resources: "#resources",
};

export function tabFromHash(hash = "") {
  if (hash.startsWith("#blog")) return "blog";
  if (hash === "#resources") return "resources";
  if (hash.startsWith("#graph") || hash === "#methods-graph") return "graph";
  if (hash.startsWith("#methods")) return "methods";
  if (hash === "#benchmarks" || hash === "#papers") return "papers";
  return "blog";
}
