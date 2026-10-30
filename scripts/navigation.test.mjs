import assert from "node:assert/strict";
import test from "node:test";
import { NAV_TABS, TAB_HASHES, tabFromHash } from "../site/src/lib/navigation.js";

test("the root URL and unknown fragments open the home page", () => {
  for (const hash of [undefined, "", "#", "#unknown", "#recently-added"]) {
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
  assert.equal(tabFromHash("#blog"), "blog");
  assert.equal(tabFromHash("#blog/understanding-rsi"), "blog");
  for (const hash of ["#graph", "#graph-methods", "#graph-benchmark", "#methods-graph"]) {
    assert.equal(tabFromHash(hash), "graph");
  }
  assert.equal(tabFromHash("#papers"), "papers");
});
