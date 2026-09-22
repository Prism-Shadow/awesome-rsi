import assert from "node:assert/strict";
import test from "node:test";
import { buildLayout, createGraphGeometry, nodeBounds } from "../site/src/lib/citationLayout.js";
import { methods } from "../site/src/data/methods.js";
import { methodCitationEdges } from "../site/src/data/methodCitationGraph.js";
import { papers } from "../site/src/data/papers.js";
import { citationEdges } from "../site/src/data/citationGraph.js";

const weights = new Map(methods.map((p) => [
  p.id, methodCitationEdges.filter((e) => e.target === p.id).length,
]));
const weight = (p) => weights.get(p.id);
const height = Math.max(820, Math.round(620 * Math.sqrt(methods.length / 32)));

test("spacious method layout keeps every node and label separate and inside the canvas", () => {
  const layout = buildLayout(methods, methodCitationEdges, weight, { height, spacious: true });
  assert.equal(layout.size, methods.length);
  const nodes = [...layout.values()];
  for (let i = 0; i < nodes.length; i += 1) {
    const a = nodes[i];
    const ab = nodeBounds(a);
    assert(a.x - ab.halfWidth >= 0 && a.x + ab.halfWidth <= 920);
    assert(a.y - ab.halfHeight >= 0 && a.y + ab.halfHeight <= height);
    for (const b of nodes.slice(i + 1)) {
      const bb = nodeBounds(b);
      assert(
        Math.abs(a.x - b.x) >= ab.halfWidth + bb.halfWidth
          || Math.abs(a.y - b.y) >= ab.halfHeight + bb.halfHeight,
        `overlapping labels: ${a.nickname}, ${b.nickname}`,
      );
    }
  }
});

test("layout is deterministic and does not mutate paper metadata", () => {
  const before = structuredClone(methods);
  const first = buildLayout(methods, methodCitationEdges, weight, { height, spacious: true });
  assert.deepEqual(first, buildLayout(methods, methodCitationEdges, weight, { height, spacious: true }));
  assert.deepEqual(methods, before);
});

test("benchmark layout retains the compact default; empty and singleton graphs work", () => {
  const weight = (p) => p.citations ?? 0;
  assert.deepEqual(
    buildLayout(papers, citationEdges, weight),
    buildLayout(papers, citationEdges, weight, { height: 620, spacious: false }),
  );
  assert.equal(buildLayout([], [], weight, { spacious: true }).size, 0);
  const lone = buildLayout([methods[0]], [], () => 0, { height, spacious: true }).get(methods[0].id);
  assert(Number.isFinite(lone.x) && Number.isFinite(lone.y));
});

test("zoom keeps the pointer anchor stable on desktop and phone viewports", () => {
  for (const graphHeight of [620, height]) {
    const geometry = createGraphGeometry(920, graphHeight);
    assert.deepEqual(geometry.defaultCamera(), { x: 460, y: graphHeight / 2, zoom: 1 });
    for (const bounds of [
      { left: 40, top: 80, width: 900, height: 950 },
      { left: 12, top: 60, width: 366, height: 608 },
    ]) {
      const svg = { getBoundingClientRect: () => bounds };
      const point = { x: bounds.left + bounds.width * 0.6, y: bounds.top + bounds.height * 0.4 };
      const anchor = geometry.worldPointAtClient(svg, geometry.defaultCamera(), point);
      const camera = geometry.cameraFromAnchor(svg, 1.65, anchor, point);
      const after = geometry.worldPointAtClient(svg, camera, point);
      assert(Math.abs(after.x - anchor.x) < 1e-8);
      assert(Math.abs(after.y - anchor.y) < 1e-8);
      const constrained = geometry.constrainCamera({ x: 1e9, y: -1e9, zoom: 3 });
      assert(constrained.x < 2000 && constrained.y > -2000);
    }
  }
});
