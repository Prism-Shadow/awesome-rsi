// Lays out the home hero's citation network: the Citation Graph page's layout, mirrored and
// stretched so that the most-cited papers spread evenly over the part the headline leaves visible.
import { buildLayout, clamp } from "./citationLayout.js";

const WIDTH = 920;
// The headline covers the network left of this x.
const HEADLINE_EDGE = 150;
export const HUB_COUNT = 12;
// Where the labeled hubs may sit: right of the headline, with room for a label under each node.
export const HUB_AREA = { left: HEADLINE_EDGE + 40, right: 860, top: 80, bottom: 510 };
const LLOYD_ROUNDS = 6;
const SAMPLE_STEP = 8;
// How far a hub's move carries the nodes around it.
const FOLLOW_RADIUS = 80;

export function buildHeroNetwork(papers, edges) {
  const citedBy = new Map();
  for (const edge of edges) citedBy.set(edge.target, (citedBy.get(edge.target) ?? 0) + 1);
  const laidOut = [...buildLayout(papers, edges, (paper) => citedBy.get(paper.id) ?? 0, { height: 620, spacious: true }).values()];
  const hubIds = new Set([...laidOut].sort((a, b) => b.radius - a.radius).slice(0, HUB_COUNT).map((node) => node.id));
  // Mirror the layout when that brings more of the hubs' citations out from under the headline,
  // so the hubs move less when they spread.
  const visibleCitations = (xOf) => laidOut
    .filter((node) => hubIds.has(node.id) && xOf(node) > HEADLINE_EDGE)
    .reduce((sum, node) => sum + (citedBy.get(node.id) ?? 0), 0);
  const mirrored = visibleCitations((node) => WIDTH - node.x) > visibleCitations((node) => node.x);
  const nodes = laidOut.map((node) => ({ ...node, x: mirrored ? WIDTH - node.x : node.x }));
  spreadHubs(nodes, hubIds);
  return { nodes, hubIds };
}

// Lloyd relaxation: each hub moves to the centroid of the part of the hub area nearest to it, which
// spreads the hubs evenly while keeping their arrangement. Every other node then follows the hubs
// near it, so the network stretches instead of tearing.
function spreadHubs(nodes, hubIds) {
  const hubs = nodes.filter((node) => hubIds.has(node.id));
  const start = hubs.map(({ x, y }) => ({ x, y }));
  const samples = [];
  for (let x = HUB_AREA.left; x <= HUB_AREA.right; x += SAMPLE_STEP) {
    for (let y = HUB_AREA.top; y <= HUB_AREA.bottom; y += SAMPLE_STEP) samples.push([x, y]);
  }
  for (const hub of hubs) {
    hub.x = clamp(hub.x, HUB_AREA.left, HUB_AREA.right);
    hub.y = clamp(hub.y, HUB_AREA.top, HUB_AREA.bottom);
  }
  for (let round = 0; round < LLOYD_ROUNDS; round += 1) {
    const cells = hubs.map(() => ({ x: 0, y: 0, count: 0 }));
    for (const [x, y] of samples) {
      let nearest = 0;
      let nearestDistance = Infinity;
      hubs.forEach((hub, index) => {
        const distance = (hub.x - x) ** 2 + (hub.y - y) ** 2;
        if (distance < nearestDistance) {
          nearest = index;
          nearestDistance = distance;
        }
      });
      cells[nearest].x += x;
      cells[nearest].y += y;
      cells[nearest].count += 1;
    }
    hubs.forEach((hub, index) => {
      if (!cells[index].count) return;
      hub.x = cells[index].x / cells[index].count;
      hub.y = cells[index].y / cells[index].count;
    });
  }
  for (const node of nodes) {
    if (hubIds.has(node.id)) continue;
    let dx = 0;
    let dy = 0;
    let total = 0;
    hubs.forEach((hub, index) => {
      const weight = 1 / ((start[index].x - node.x) ** 2 + (start[index].y - node.y) ** 2 + FOLLOW_RADIUS ** 2);
      dx += (hub.x - start[index].x) * weight;
      dy += (hub.y - start[index].y) * weight;
      total += weight;
    });
    node.x = clamp(node.x + dx / total, 24, WIDTH - 24);
    node.y = clamp(node.y + dy / total, 40, 560);
  }
}
