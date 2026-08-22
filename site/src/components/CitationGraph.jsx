import { useEffect, useMemo, useRef, useState } from "react";
import { citationEdges, citationGraphMeta } from "../data/citationGraph.js";
import { graphCopy } from "../i18n.js";

const GRAPH_WIDTH = 920;
const GRAPH_HEIGHT = 620;
const MIN_ZOOM = 0.65;
const MAX_ZOOM = 3;

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

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

function pointerGeometry(pointers) {
  const points = [...pointers.values()];
  const centroid = points.reduce((total, point) => ({
    x: total.x + point.x / points.length,
    y: total.y + point.y / points.length,
  }), { x: 0, y: 0 });
  const distance = points.length > 1
    ? Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)
    : 0;
  return { centroid, distance };
}

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

function RelationList({ title, emptyText, edges, paperById, relationKey, onSelect, copy }) {
  return (
    <div className="relation-list">
      <div className="relation-title"><span>{title}</span><b>{edges.length}</b></div>
      {edges.length === 0 ? <p>{emptyText}</p> : edges.map((edge) => {
        const related = paperById.get(edge[relationKey]);
        if (!related) return null;
        return (
          <button key={`${edge.source}-${edge.target}`} onClick={() => onSelect(related.id)}>
            <span>{related.nickname}</span>
            <small>{edge.verifiedBy === "paper-pdf" ? copy.originalPdf : copy.semanticScholar}</small>
          </button>
        );
      })}
    </div>
  );
}

export default function CitationGraph({ papers, lang }) {
  const fullPaperById = useMemo(() => new Map(papers.map((paper) => [paper.id, paper])), [papers]);
  const visibleIds = useMemo(() => new Set(papers.map((paper) => paper.id)), [papers]);
  const visibleEdges = useMemo(() => citationEdges.filter((edge) =>
    visibleIds.has(edge.source) && visibleIds.has(edge.target)), [visibleIds]);
  const layout = useMemo(() => buildLayout(papers, visibleEdges), [papers, visibleEdges]);
  const [selectedId, setSelectedId] = useState(() => papers[0]?.id ?? null);
  const [hoveredId, setHoveredId] = useState(null);
  const [camera, setCamera] = useState(defaultCamera);
  const [isPanning, setIsPanning] = useState(false);
  const svgRef = useRef(null);
  const cameraRef = useRef(camera);
  const pointersRef = useRef(new Map());
  const gestureRef = useRef(null);
  const gestureMovedRef = useRef(false);
  const suppressClickUntilRef = useRef(0);
  const copy = graphCopy[lang];

  const updateCamera = (nextCamera) => {
    cameraRef.current = nextCamera;
    setCamera(nextCamera);
  };

  useEffect(() => {
    const nextCamera = defaultCamera();
    cameraRef.current = nextCamera;
    pointersRef.current.clear();
    gestureRef.current = null;
    setIsPanning(false);
    setCamera(nextCamera);
  }, [layout]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;

    const handleWheel = (event) => {
      event.preventDefault();
      const currentCamera = cameraRef.current;
      const nextZoom = clamp(
        currentCamera.zoom * Math.exp(-event.deltaY * 0.0015),
        MIN_ZOOM,
        MAX_ZOOM,
      );
      const point = { x: event.clientX, y: event.clientY };
      const anchor = worldPointAtClient(svg, currentCamera, point);
      const nextCamera = cameraFromAnchor(svg, nextZoom, anchor, point);
      cameraRef.current = nextCamera;
      setCamera(nextCamera);
    };

    svg.addEventListener("wheel", handleWheel, { passive: false });
    return () => svg.removeEventListener("wheel", handleWheel);
  }, [papers.length]);

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
  const viewWidth = GRAPH_WIDTH / camera.zoom;
  const viewHeight = GRAPH_HEIGHT / camera.zoom;
  const viewBox = `${camera.x - viewWidth / 2} ${camera.y - viewHeight / 2} ${viewWidth} ${viewHeight}`;

  const beginGesture = (svg) => {
    const geometry = pointerGeometry(pointersRef.current);
    const startCamera = cameraRef.current;
    gestureRef.current = {
      pointerCount: pointersRef.current.size,
      centroid: geometry.centroid,
      distance: geometry.distance,
      camera: startCamera,
      anchor: worldPointAtClient(svg, startCamera, geometry.centroid),
    };
  };

  const handlePointerDown = (event) => {
    event.preventDefault();
    if (pointersRef.current.size === 0) gestureMovedRef.current = false;
    const captureTarget = event.target;
    pointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
      captureTarget,
    });
    captureTarget.setPointerCapture(event.pointerId);
    beginGesture(event.currentTarget);
    setIsPanning(true);
  };

  const handlePointerMove = (event) => {
    if (!pointersRef.current.has(event.pointerId)) return;
    event.preventDefault();
    pointersRef.current.set(event.pointerId, {
      ...pointersRef.current.get(event.pointerId),
      x: event.clientX,
      y: event.clientY,
    });

    if (!gestureRef.current || gestureRef.current.pointerCount !== pointersRef.current.size) {
      beginGesture(event.currentTarget);
      return;
    }

    const gesture = gestureRef.current;
    const geometry = pointerGeometry(pointersRef.current);
    if (Math.hypot(
      geometry.centroid.x - gesture.centroid.x,
      geometry.centroid.y - gesture.centroid.y,
    ) > 3 || Math.abs(geometry.distance - gesture.distance) > 3) {
      gestureMovedRef.current = true;
    }

    const nextZoom = gesture.pointerCount > 1 && gesture.distance > 0
      ? clamp(gesture.camera.zoom * geometry.distance / gesture.distance, MIN_ZOOM, MAX_ZOOM)
      : gesture.camera.zoom;
    updateCamera(cameraFromAnchor(event.currentTarget, nextZoom, gesture.anchor, geometry.centroid));
  };

  const endPointerGesture = (event) => {
    const pointer = pointersRef.current.get(event.pointerId);
    if (!pointer) return;
    pointersRef.current.delete(event.pointerId);
    if (gestureMovedRef.current) suppressClickUntilRef.current = Date.now() + 250;

    if (pointersRef.current.size > 0) {
      beginGesture(event.currentTarget);
    } else {
      gestureRef.current = null;
      setIsPanning(false);
    }

    if (pointer.captureTarget.hasPointerCapture(event.pointerId)) {
      pointer.captureTarget.releasePointerCapture(event.pointerId);
    }
  };

  const changeZoom = (amount) => {
    const currentCamera = cameraRef.current;
    updateCamera(constrainCamera({
      ...currentCamera,
      zoom: clamp(Number((currentCamera.zoom + amount).toFixed(2)), MIN_ZOOM, MAX_ZOOM),
    }));
  };

  const resetView = () => updateCamera(defaultCamera());

  if (papers.length === 0) return null;

  return (
    <section className="citation-view" aria-labelledby="citation-graph-title">
      <div className="graph-heading">
        <div>
          <span className="graph-eyebrow">{copy.verifiedNetwork}</span>
          <h2 id="citation-graph-title">{copy.title}</h2>
          <p>{copy.intro}</p>
        </div>
        <div className="graph-summary">
          <span><b>{papers.length}</b> {copy.visiblePapers}</span>
          <span><b>{visibleEdges.length}</b> {copy.verifiedEdges}</span>
        </div>
      </div>

      <div className="graph-workspace">
        <div className="graph-stage">
          <div className="graph-controls" aria-label={copy.controls}>
            <button onClick={() => changeZoom(0.2)} aria-label={copy.zoomIn}>+</button>
            <button onClick={() => changeZoom(-0.2)} aria-label={copy.zoomOut}>−</button>
            <button onClick={resetView} aria-label={copy.resetView}>{Math.round(camera.zoom * 100)}%</button>
          </div>
          <div className="graph-interaction-hint">{copy.hint}</div>
          <svg
            ref={svgRef}
            className={isPanning ? "is-panning" : ""}
            viewBox={viewBox}
            role="img"
            aria-label={copy.networkLabel(papers.length, visibleEdges.length)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endPointerGesture}
            onPointerCancel={endPointerGesture}
            onLostPointerCapture={endPointerGesture}
          >
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
                    aria-label={`${paper.nickname}，${paper.citations} ${copy.citations}`}
                    onMouseEnter={() => setHoveredId(paper.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={(event) => {
                      if (event.detail > 0 && Date.now() < suppressClickUntilRef.current) return;
                      setSelectedId(paper.id);
                    }}
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
            <div><span>{copy.older}</span><i className="date-ramp" /><span>{copy.newer}</span></div>
            <div><i className="size-dot small" /><i className="size-dot large" /><span>{copy.nodeSize}</span></div>
            <div><i className="arrow-line" /><span>{copy.cites}</span></div>
          </div>
          {visibleEdges.length === 0 && <div className="graph-no-edges">{copy.noEdges}</div>}
        </div>

        <aside className="graph-inspector" aria-live="polite">
          {selectedPaper && (
            <>
              <span className="inspector-index">arXiv:{selectedPaper.id}</span>
              <h3>{selectedPaper.nickname}</h3>
              <p>{selectedPaper.title}</p>
              <div className="inspector-metrics">
                <div><b>{selectedPaper.citations}</b><span>{copy.globalCitations}</span></div>
                <div><b>{incoming.length}</b><span>{copy.citedByCorpus}</span></div>
                <div><b>{outgoing.length}</b><span>{copy.referencesInCorpus}</span></div>
              </div>
              <RelationList title={copy.references} emptyText={copy.noReferences} edges={outgoing} paperById={fullPaperById} relationKey="target" onSelect={setSelectedId} copy={copy} />
              <RelationList title={copy.citedBy} emptyText={copy.noCitations} edges={incoming} paperById={fullPaperById} relationKey="source" onSelect={setSelectedId} copy={copy} />
              <a className="inspector-link" href={selectedPaper.arxiv} target="_blank" rel="noreferrer">{copy.openArxiv}</a>
            </>
          )}
        </aside>
      </div>

      <div className="graph-provenance">
        <span className="verified-mark">✓</span>
        {lang === "zh" ? (
          <p>
            <b>{copy.provenanceLead}</b> {copy.snapshot}{citationGraphMeta.snapshot}。
          </p>
        ) : (
          <p>
            <b>{copy.provenanceLead}</b> {copy.snapshot} {citationGraphMeta.snapshot}.
          </p>
        )}
      </div>
    </section>
  );
}
