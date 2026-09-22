export function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

// Camera math shares the same dimensions as layout and SVG viewBox.
export function createGraphGeometry(width = 920, height = 620) {
  const GRAPH_WIDTH = width;
  const GRAPH_HEIGHT = height;
  function defaultCamera() {
    return { x: GRAPH_WIDTH / 2, y: GRAPH_HEIGHT / 2, zoom: 1 };
  }

  function constrainCamera(camera) {
    const halfWidth = GRAPH_WIDTH / camera.zoom / 2;
    const halfHeight = GRAPH_HEIGHT / camera.zoom / 2;
    const minimumVisible = 72;
    return {
      ...camera,
      x: clamp(camera.x, minimumVisible - halfWidth, GRAPH_WIDTH - minimumVisible + halfWidth),
      y: clamp(camera.y, minimumVisible - halfHeight, GRAPH_HEIGHT - minimumVisible + halfHeight),
    };
  }

  function worldUnitsPerPixel(svg, zoom) {
    const bounds = svg.getBoundingClientRect();
    return Math.max(
      GRAPH_WIDTH / zoom / Math.max(bounds.width, 1),
      GRAPH_HEIGHT / zoom / Math.max(bounds.height, 1),
    );
  }

  function worldPointAtClient(svg, camera, point) {
    const bounds = svg.getBoundingClientRect();
    const unitsPerPixel = worldUnitsPerPixel(svg, camera.zoom);
    return {
      x: camera.x + (point.x - bounds.left - bounds.width / 2) * unitsPerPixel,
      y: camera.y + (point.y - bounds.top - bounds.height / 2) * unitsPerPixel,
    };
  }

  function cameraFromAnchor(svg, zoom, anchor, clientPoint) {
    const bounds = svg.getBoundingClientRect();
    const unitsPerPixel = worldUnitsPerPixel(svg, zoom);
    return constrainCamera({
      zoom,
      x: anchor.x - (clientPoint.x - bounds.left - bounds.width / 2) * unitsPerPixel,
      y: anchor.y - (clientPoint.y - bounds.top - bounds.height / 2) * unitsPerPixel,
    });
  }

  return { defaultCamera, constrainCamera, worldPointAtClient, cameraFromAnchor };
}

export function nodeBounds(node) {
  return {
    halfWidth: Math.max(node.radius + 12, (node.nickname?.length ?? 0) * 3.5 + 12),
    halfHeight: node.radius + 16,
  };
}

function nodeRadius(citations) {
  return 10 + Math.sqrt(Math.max(citations, 0)) * 2.65;
}

export function buildLayout(papers, edges, getNodeWeight, { height = 620, spacious = false } = {}) {
  const GRAPH_WIDTH = 920;
  const GRAPH_HEIGHT = height;
  const nodes = papers.map((paper, index) => {
    const angle = index * 2.3999632297;
    const ring = spacious ? 110 + Math.sqrt((index + 1) / papers.length) * 290 : 165 + (index % 4) * 34;
    return {
      ...paper,
      x: GRAPH_WIDTH / 2 + Math.cos(angle) * ring,
      y: GRAPH_HEIGHT / 2 + Math.sin(angle) * ring * (spacious ? height / GRAPH_WIDTH : 0.78),
      vx: 0,
      vy: 0,
      radius: nodeRadius(getNodeWeight(paper)),
    };
  });
  const byId = new Map(nodes.map((node) => [node.id, node]));

  const degree = new Map(nodes.map((n) => [n.id, 0]));
  for (const e of edges) {
    if (byId.has(e.source) && byId.has(e.target)) {
      degree.set(e.source, degree.get(e.source) + 1);
      degree.set(e.target, degree.get(e.target) + 1);
    }
  }

  for (let iteration = 0; iteration < 460; iteration += 1) {
    const alpha = 1 - iteration / 460;

    for (let leftIndex = 0; leftIndex < nodes.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < nodes.length; rightIndex += 1) {
        const left = nodes[leftIndex];
        const right = nodes[rightIndex];
        let dx = right.x - left.x;
        let dy = right.y - left.y;
        let distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < 1) {
          dx = 1;
          dy = 0;
          distanceSquared = 1;
        }
        const distance = Math.sqrt(distanceSquared);
        const force = Math.min(spacious ? 5 : 3.2, (spacious ? 22000 : 10500) / distanceSquared) * alpha;
        const forceX = (dx / distance) * force;
        const forceY = (dy / distance) * force;
        left.vx -= forceX;
        left.vy -= forceY;
        right.vx += forceX;
        right.vy += forceY;
      }
    }

    for (const edge of edges) {
      const source = byId.get(edge.source);
      const target = byId.get(edge.target);
      if (!source || !target) continue;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const linkStrength = spacious ? 0.012 / Math.sqrt(Math.max(degree.get(source.id), degree.get(target.id), 1)) : 0.012;
      const force = (distance - (spacious ? 215 : 150)) * linkStrength * alpha;
      const forceX = (dx / distance) * force;
      const forceY = (dy / distance) * force;
      source.vx += forceX;
      source.vy += forceY;
      target.vx -= forceX;
      target.vy -= forceY;
    }

    for (const node of nodes) {
      node.vx += (GRAPH_WIDTH / 2 - node.x) * (spacious ? 0.0012 : 0.0018) * alpha;
      node.vy += (GRAPH_HEIGHT / 2 - node.y) * (spacious ? 0.0012 : 0.0024) * alpha;
      node.vx *= 0.79;
      node.vy *= 0.79;
      node.x = Math.max(70, Math.min(GRAPH_WIDTH - 70, node.x + node.vx));
      node.y = Math.max(62, Math.min(GRAPH_HEIGHT - 62, node.y + node.vy));
    }
  }

  if (spacious) {
    // Separate the full node + label rectangles, not just the circles.
    for (let pass = 0; pass < 240; pass += 1) {
      let overlaps = 0;
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const ab = nodeBounds(a);
          const bb = nodeBounds(b);
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const overlapX = ab.halfWidth + bb.halfWidth - Math.abs(dx);
          const overlapY = ab.halfHeight + bb.halfHeight - Math.abs(dy);
          if (overlapX <= 0 || overlapY <= 0) continue;
          overlaps += 1;
          if (overlapX < overlapY) {
            const shift = Math.sign(dx || 1) * (overlapX + 0.5) / 2;
            a.x -= shift;
            b.x += shift;
          } else {
            const shift = Math.sign(dy || 1) * (overlapY + 0.5) / 2;
            a.y -= shift;
            b.y += shift;
          }
        }
      }
      for (const node of nodes) {
        const box = nodeBounds(node);
        node.x = clamp(node.x, box.halfWidth + 24, GRAPH_WIDTH - box.halfWidth - 24);
        node.y = clamp(node.y, box.halfHeight + 50, GRAPH_HEIGHT - box.halfHeight - 80);
      }
      if (overlaps === 0) break;
    }
    // Dense hubs can trap the relaxation against the boundary. Place remaining
    // rectangles in the nearest free slot, keeping large nodes stable first.
    const placed = [];
    for (const node of [...nodes].sort((a, b) => b.radius - a.radius)) {
      const box = nodeBounds(node);
      const isFree = (p) => placed.every((other) => {
        const otherBox = nodeBounds(other);
        return Math.abs(p.x - other.x) >= box.halfWidth + otherBox.halfWidth
          || Math.abs(p.y - other.y) >= box.halfHeight + otherBox.halfHeight;
      });
      if (isFree(node)) {
        placed.push(node);
        continue;
      }
      const candidates = [{ x: node.x, y: node.y, distance: 0 }];
      for (let x = box.halfWidth + 24; x <= GRAPH_WIDTH - box.halfWidth - 24; x += 12) {
        for (let y = box.halfHeight + 50; y <= GRAPH_HEIGHT - box.halfHeight - 80; y += 12) {
          candidates.push({ x, y, distance: (x - node.x) ** 2 + (y - node.y) ** 2 });
        }
      }
      candidates.sort((a, b) => a.distance - b.distance);
      const position = candidates.find(isFree);
      if (position) {
        node.x = position.x;
        node.y = position.y;
      }
      placed.push(node);
    }
  }
  return new Map(nodes.map((node) => [node.id, node]));
}
