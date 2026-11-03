import assert from "node:assert/strict";
import test from "node:test";
import { BASE, NAV_TABS, TAB_PATHS, detailPath, filterPath, graphPath, postPath, routeFromPath } from "../site/src/lib/navigation.js";

test("each nav page has a real path that routes back to it", () => {
  assert.equal(BASE, "/awesome-rsi/");
  assert.deepEqual([...NAV_TABS].sort(), Object.keys(TAB_PATHS).sort());
  for (const [tab, path] of Object.entries(TAB_PATHS)) {
    assert.ok(path.startsWith(BASE) && path.endsWith("/"), path);
    assert.equal(routeFromPath(path).tab, tab, path);
  }
  assert.equal(TAB_PATHS.papers, "/awesome-rsi/benchmarks/");
  assert.equal(routeFromPath("/awesome-rsi").tab, "home");
  assert.equal(routeFromPath("/awesome-rsi/methods").tab, "methods");
});

test("detail pages sit under their list", () => {
  assert.deepEqual(routeFromPath(detailPath("methods", "2605.30105")), { tab: "methods", detail: { collection: "methods", id: "2605.30105" } });
  assert.deepEqual(routeFromPath(detailPath("methods", "reme")), { tab: "methods", detail: { collection: "methods", id: "reme" } });
  assert.deepEqual(routeFromPath(detailPath("benchmarks", "2610.10310")), { tab: "papers", detail: { collection: "benchmarks", id: "2610.10310" } });
  assert.equal(detailPath("methods", "2605.30105"), "/awesome-rsi/methods/2605.30105/");
});

test("blog posts, both citation graphs, and filtered lists have their own addresses", () => {
  assert.deepEqual(routeFromPath(postPath("understanding-rsi")), { tab: "blog", postId: "understanding-rsi" });
  assert.deepEqual(routeFromPath(graphPath()), { tab: "graph", graphKind: "methods" });
  assert.deepEqual(routeFromPath(graphPath("benchmark")), { tab: "graph", graphKind: "benchmark" });
  assert.equal(graphPath("methods", "2505.22954"), "/awesome-rsi/graph/?paper=2505.22954");
  assert.equal(filterPath("methods", "artifact", "Harness code"), "/awesome-rsi/methods/?artifact=Harness+code");
});

test("unknown paths are not found, including the retired hash pages' paths", () => {
  for (const path of ["/awesome-rsi/resources/", "/awesome-rsi/blog/", "/awesome-rsi/graph/other/", "/awesome-rsi/methods/a/b/", "/other/"]) {
    assert.equal(routeFromPath(path).tab, "notFound", path);
  }
});
