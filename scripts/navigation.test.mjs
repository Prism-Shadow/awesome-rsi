import assert from "node:assert/strict";
import test from "node:test";
import { TAB_HASHES, tabFromHash } from "../site/src/lib/navigation.js";

test("the root URL and unknown fragments open Blog", () => {
  for (const hash of [undefined, "", "#", "#unknown"]) {
    assert.equal(tabFromHash(hash), "blog");
  }
});

test("each tab has a persistent direct link that restores the same tab", () => {
  for (const [tab, hash] of Object.entries(TAB_HASHES)) {
    assert(hash.startsWith("#"));
    assert.equal(tabFromHash(hash), tab);
  }
  assert.equal(TAB_HASHES.papers, "#benchmarks");
  assert.equal(TAB_HASHES.graph, "#graph-methods");
});

test("article links and both citation graph datasets keep their routes", () => {
  assert.equal(tabFromHash("#blog/understanding-rsi"), "blog");
  for (const hash of ["#graph", "#graph-methods", "#graph-benchmark", "#methods-graph"]) {
    assert.equal(tabFromHash(hash), "graph");
  }
  assert.equal(tabFromHash("#papers"), "papers");
});
