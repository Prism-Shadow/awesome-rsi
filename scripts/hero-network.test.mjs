import assert from "node:assert/strict";
import test from "node:test";
import { buildHeroNetwork, HERO_WIDTH, HUB_AREA, HUB_COUNT } from "../site/src/lib/heroNetwork.js";
import { methods } from "../site/src/data/methods.js";
import { methodCitationEdges } from "../site/src/data/methodCitationGraph.js";

const { nodes, hubIds } = buildHeroNetwork(methods, methodCitationEdges);
const hubs = nodes.filter((node) => hubIds.has(node.id));
const citations = (id) => methodCitationEdges.filter((edge) => edge.target === id).length;

// The label sits under the node, as the home hero draws it.
function labelBox(node) {
  const halfWidth = node.nickname.length * 3.4 + 4;
  const top = node.y + node.radius * 0.55 + 4;
  return { left: node.x - halfWidth, right: node.x + halfWidth, top, bottom: top + 14 };
}

test("the hero labels the most-cited methods, all right of the headline", () => {
  assert.equal(hubs.length, HUB_COUNT);
  const fewestHubCitations = Math.min(...hubs.map((hub) => citations(hub.id)));
  for (const node of nodes) {
    if (!hubIds.has(node.id)) assert.ok(citations(node.id) <= fewestHubCitations, node.nickname);
  }
  for (const hub of hubs) {
    assert.ok(hub.x >= HUB_AREA.left && hub.x <= HUB_AREA.right, hub.nickname);
    assert.ok(hub.y >= HUB_AREA.top && hub.y <= HUB_AREA.bottom, hub.nickname);
  }
});

test("hero hubs are spread out and their labels stay clear of each other", () => {
  for (const a of hubs) {
    const box = labelBox(a);
    for (const b of hubs) {
      if (a === b) continue;
      assert.ok(Math.hypot(a.x - b.x, a.y - b.y) >= 90, `${a.nickname} and ${b.nickname} are too close`);
      const other = labelBox(b);
      assert.ok(
        box.right <= other.left || other.right <= box.left || box.bottom <= other.top || other.bottom <= box.top,
        `labels of ${a.nickname} and ${b.nickname} overlap`,
      );
    }
  }
});

test("the hero network keeps every node in the canvas, is deterministic, and leaves the data untouched", () => {
  const before = structuredClone(methods);
  for (const node of nodes) {
    assert.ok(node.x >= 0 && node.x <= HERO_WIDTH && node.y >= 20 && node.y <= 580, node.nickname);
  }
  assert.deepEqual(buildHeroNetwork(methods, methodCitationEdges).nodes, nodes);
  assert.deepEqual(methods, before);
});
