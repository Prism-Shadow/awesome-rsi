import { useMemo, useState } from "react";
import { citationEdges, citationGraphMeta } from "../data/citationGraph.js";

const GRAPH_WIDTH = 920;
const GRAPH_HEIGHT = 620;

function nodeRadius(citations) {
  return 10 + Math.sqrt(Math.max(citations, 0)) * 2.65;
}

function buildLayout(papers, edges) {
  const nodes = papers.map((paper, index) => {
    const angle = index * 2.3999632297;
    const ring = 165 + (index % 4) * 34;
    return {
      ...paper,
      x: GRAPH_WIDTH / 2 + Math.cos(angle) * ring,
      y: GRAPH_HEIGHT / 2 + Math.sin(angle) * ring * 0.78,
      vx: 0,
      vy: 0,
      radius: nodeRadius(paper.citations),
    };
  });
  const byId = new Map(nodes.map((node) => [node.id, node]));

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
        const force = Math.min(3.2, 10500 / distanceSquared) * alpha;
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
      const force = (distance - 150) * 0.012 * alpha;
      const forceX = (dx / distance) * force;
      const forceY = (dy / distance) * force;
      source.vx += forceX;
      source.vy += forceY;
      target.vx -= forceX;
      target.vy -= forceY;
    }

    for (const node of nodes) {
      node.vx += (GRAPH_WIDTH / 2 - node.x) * 0.0018 * alpha;
      node.vy += (GRAPH_HEIGHT / 2 - node.y) * 0.0024 * alpha;
      node.vx *= 0.79;
      node.vy *= 0.79;
      node.x = Math.max(70, Math.min(GRAPH_WIDTH - 70, node.x + node.vx));
      node.y = Math.max(62, Math.min(GRAPH_HEIGHT - 62, node.y + node.vy));
    }
  }

  return new Map(nodes.map((node) => [node.id, node]));
}

function edgeCoordinates(source, target) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
  const unitX = dx / distance;
  const unitY = dy / distance;
  return {
    x1: source.x + unitX * (source.radius + 4),
    y1: source.y + unitY * (source.radius + 4),
    x2: target.x - unitX * (target.radius + 9),
    y2: target.y - unitY * (target.radius + 9),
  };
}

function getFreshnessColor(paper, minTime, maxTime) {
  const time = new Date(`${paper.published}T00:00:00Z`).getTime();
  const ratio = maxTime === minTime ? 0.5 : (time - minTime) / (maxTime - minTime);
  const lightness = 70 - ratio * 37;
  return `hsl(158 48% ${lightness}%)`;
}

function RelationList({ title, emptyText, edges, paperById, relationKey, onSelect }) {
  return (
    <div className="relation-list">
      <div className="relation-title"><span>{title}</span><b>{edges.length}</b></div>
      {edges.length === 0 ? <p>{emptyText}</p> : edges.map((edge) => {
        const related = paperById.get(edge[relationKey]);
        if (!related) return null;
        return (
          <button key={`${edge.source}-${edge.target}`} onClick={() => onSelect(related.id)}>
            <span>{related.nickname}</span>
            <small>{edge.verifiedBy === "paper-pdf" ? "Original PDF" : "Semantic Scholar"}</small>
          </button>
        );
      })}
    </div>
  );
}

export default function CitationGraph({ papers }) {
  const fullPaperById = useMemo(() => new Map(papers.map((paper) => [paper.id, paper])), [papers]);
  const visibleIds = useMemo(() => new Set(papers.map((paper) => paper.id)), [papers]);
  const visibleEdges = useMemo(() => citationEdges.filter((edge) =>
    visibleIds.has(edge.source) && visibleIds.has(edge.target)), [visibleIds]);
  const layout = useMemo(() => buildLayout(papers, visibleEdges), [papers, visibleEdges]);
  const [selectedId, setSelectedId] = useState(() => papers[0]?.id ?? null);
  const [hoveredId, setHoveredId] = useState(null);
  const [zoom, setZoom] = useState(1);

  const selectedPaper = fullPaperById.get(selectedId) ?? papers[0] ?? null;
  const activeId = hoveredId;
  const incoming = selectedPaper ? visibleEdges.filter((edge) => edge.target === selectedPaper.id) : [];
  const outgoing = selectedPaper ? visibleEdges.filter((edge) => edge.source === selectedPaper.id) : [];
  const activeEdges = new Set(visibleEdges
    .filter((edge) => edge.source === activeId || edge.target === activeId)
    .map((edge) => `${edge.source}-${edge.target}`));
  const connectedIds = new Set(visibleEdges.flatMap((edge) =>
    edge.source === activeId ? [edge.target] : edge.target === activeId ? [edge.source] : []));

  const times = papers.map((paper) => new Date(`${paper.published}T00:00:00Z`).getTime());
  const minTime = times.length ? Math.min(...times) : 0;
  const maxTime = times.length ? Math.max(...times) : 0;
  const focusNode = selectedPaper ? layout.get(selectedPaper.id) : null;
  const viewWidth = GRAPH_WIDTH / zoom;
  const viewHeight = GRAPH_HEIGHT / zoom;
  const centerX = zoom > 1 && focusNode ? focusNode.x : GRAPH_WIDTH / 2;
  const centerY = zoom > 1 && focusNode ? focusNode.y : GRAPH_HEIGHT / 2;
  const viewBox = `${centerX - viewWidth / 2} ${centerY - viewHeight / 2} ${viewWidth} ${viewHeight}`;

  if (papers.length === 0) return null;

  return (
    <section className="citation-view" aria-labelledby="citation-graph-title">
      <div className="graph-heading">
        <div>
          <span className="graph-eyebrow">Verified bibliography network</span>
          <h2 id="citation-graph-title">Citation topology</h2>
          <p>Arrows run from the citing paper to the paper it references. Filters above apply to both nodes and edges.</p>
        </div>
        <div className="graph-summary">
          <span><b>{papers.length}</b> visible papers</span>
          <span><b>{visibleEdges.length}</b> verified edges</span>
        </div>
      </div>

      <div className="graph-workspace">
        <div className="graph-stage">
          <div className="graph-controls" aria-label="Graph zoom controls">
            <button onClick={() => setZoom((value) => Math.min(1.8, Number((value + 0.2).toFixed(1))))} aria-label="Zoom in">+</button>
            <button onClick={() => setZoom((value) => Math.max(0.8, Number((value - 0.2).toFixed(1))))} aria-label="Zoom out">−</button>
            <button onClick={() => setZoom(1)} aria-label="Reset zoom">1:1</button>
          </div>
          <svg viewBox={viewBox} role="img" aria-label={`Citation network with ${papers.length} papers and ${visibleEdges.length} verified citation relationships`}>
            <defs>
              <marker id="citation-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" />
              </marker>
              <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.22" />
              </filter>
            </defs>
            <g className="citation-edges">
              {visibleEdges.map((edge) => {
                const source = layout.get(edge.source);
                const target = layout.get(edge.target);
                if (!source || !target) return null;
                const coordinates = edgeCoordinates(source, target);
                const key = `${edge.source}-${edge.target}`;
                const emphasized = !activeId || activeEdges.has(key);
                return <line key={key} {...coordinates} className={emphasized ? "is-active" : "is-muted"} markerEnd="url(#citation-arrow)" />;
              })}
            </g>
            <g className="citation-nodes">
              {papers.map((paper) => {
                const node = layout.get(paper.id);
                if (!node) return null;
                const selected = paper.id === selectedPaper?.id;
                const related = connectedIds.has(paper.id);
                const muted = activeId && paper.id !== activeId && !related;
                return (
                  <g
                    key={paper.id}
                    className={`citation-node${selected ? " is-selected" : ""}${muted ? " is-muted" : ""}`}
                    transform={`translate(${node.x} ${node.y})`}
                    role="button"
                    tabIndex="0"
                    aria-label={`${paper.nickname}, ${paper.citations} citations`}
                    onMouseEnter={() => setHoveredId(paper.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setSelectedId(paper.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedId(paper.id);
                      }
                    }}
                  >
                    <circle r={node.radius} fill={getFreshnessColor(paper, minTime, maxTime)} />
                    <circle className="node-ring" r={node.radius + 5} />
                    <text y={node.radius + 17} textAnchor="middle">{paper.nickname}</text>
                  </g>
                );
              })}
            </g>
          </svg>
          <div className="graph-legend">
            <div><span>Older</span><i className="date-ramp" /><span>Newer</span></div>
            <div><i className="size-dot small" /><i className="size-dot large" /><span>Node size = global citations</span></div>
            <div><i className="arrow-line" /><span>cites</span></div>
          </div>
          {visibleEdges.length === 0 && <div className="graph-no-edges">No verified citation relationships remain under the current filters.</div>}
        </div>

        <aside className="graph-inspector" aria-live="polite">
          {selectedPaper && (
            <>
              <span className="inspector-index">arXiv:{selectedPaper.id}</span>
              <h3>{selectedPaper.nickname}</h3>
              <p>{selectedPaper.title}</p>
              <div className="inspector-metrics">
                <div><b>{selectedPaper.citations}</b><span>global citations</span></div>
                <div><b>{incoming.length}</b><span>cited by corpus</span></div>
                <div><b>{outgoing.length}</b><span>references in corpus</span></div>
              </div>
              <RelationList title="References" emptyText="No verified references to another visible paper." edges={outgoing} paperById={fullPaperById} relationKey="target" onSelect={setSelectedId} />
              <RelationList title="Cited by" emptyText="No visible paper cites this work yet." edges={incoming} paperById={fullPaperById} relationKey="source" onSelect={setSelectedId} />
              <a className="inspector-link" href={selectedPaper.arxiv} target="_blank" rel="noreferrer">Open paper on arXiv ↗</a>
            </>
          )}
        </aside>
      </div>

      <div className="graph-provenance">
        <span className="verified-mark">✓</span>
        <p>
          <b>No inferred or topic-similarity edges.</b> {citationGraphMeta.semanticScholarEdges} relationships were verified through the
          {" "}<a href={citationGraphMeta.sourceUrl} target="_blank" rel="noreferrer">Semantic Scholar Academic Graph API</a> and {citationGraphMeta.pdfVerifiedEdges} from the original PDFs where API bibliography data was unavailable. Snapshot: {citationGraphMeta.snapshot}.
        </p>
      </div>
    </section>
  );
}
