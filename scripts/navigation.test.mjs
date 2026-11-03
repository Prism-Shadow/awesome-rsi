import assert from "node:assert/strict";
import test from "node:test";
import { NAV_TABS, TAB_HASHES, detailFromHash, detailHash, graphFocusFromHash, tabFromHash } from "../site/src/lib/navigation.js";

test("the root URL, home sections, and retired pages open the home page", () => {
  for (const hash of [undefined, "", "#", "#unknown", "#recently-added", "#blog", "#resources"]) {
    assert.equal(tabFromHash(hash), "home");
  }
  assert.equal(TAB_HASHES.home, "");
});

test("each page has a persistent direct link that restores the same page", () => {
  for (const [tab, hash] of Object.entries(TAB_HASHES)) {
    if (tab === "home") continue;
    assert(hash.startsWith("#"));
    assert.equal(tabFromHash(hash), tab);
  }
  assert.equal(TAB_HASHES.papers, "#benchmarks");
  assert.equal(TAB_HASHES.graph, "#graph-methods");
  assert.deepEqual([...NAV_TABS].sort(), Object.keys(TAB_HASHES).sort());
});

test("article links and both citation graph datasets keep their routes", () => {
  assert.equal(tabFromHash("#blog/understanding-rsi"), "blog");
  assert.ok(!NAV_TABS.includes("blog"));
  for (const hash of ["#graph", "#graph-methods", "#graph-benchmark", "#methods-graph"]) {
    assert.equal(tabFromHash(hash), "graph");
  }
  assert.equal(tabFromHash("#papers"), "papers");
});

test("detail pages open under their list and round-trip through their hash", () => {
  assert.deepEqual(detailFromHash("#methods/2605.30105"), { collection: "methods", id: "2605.30105" });
  assert.deepEqual(detailFromHash("#methods/reme"), { collection: "methods", id: "reme" });
  assert.deepEqual(detailFromHash("#benchmarks/2610.10310"), { collection: "benchmarks", id: "2610.10310" });
  assert.equal(tabFromHash("#methods/2605.30105"), "methods");
  assert.equal(tabFromHash("#benchmarks/2610.10310"), "papers");
  for (const hash of ["", "#methods", "#methods/", "#benchmarks", "#blog/understanding-rsi", "#graph-methods/2505.22954"]) {
    assert.equal(detailFromHash(hash), null, hash);
  }
  assert.deepEqual(detailFromHash(detailHash("methods", "2605.30105")), { collection: "methods", id: "2605.30105" });
});

test("the citation graph can be opened focused on one paper", () => {
  assert.deepEqual(graphFocusFromHash("#graph-methods/2505.22954"), { kind: "methods", id: "2505.22954" });
  assert.deepEqual(graphFocusFromHash("#graph-benchmark/2610.10310"), { kind: "benchmark", id: "2610.10310" });
  assert.equal(graphFocusFromHash("#graph-methods"), null);
  assert.equal(tabFromHash("#graph-benchmark/2610.10310"), "graph");
});
