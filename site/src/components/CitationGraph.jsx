import { useEffect, useMemo, useRef, useState } from "react";
import { citationEdges, citationGraphMeta } from "../data/citationGraph.js";
import { graphCopy } from "../i18n.js";
import { buildLayout, clamp, createGraphGeometry } from "../lib/citationLayout.js";

const GRAPH_WIDTH = 920;
const GRAPH_HEIGHT = 620;
const MIN_ZOOM = 0.65;
const MAX_ZOOM = 3;

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

const defaultNodeWeight = (paper) => paper.citations ?? 0;
const defaultPrimaryMetric = (paper) => paper.citations ?? 0;

export default function CitationGraph({
  papers,
  lang,
  edges = citationEdges,
  meta = citationGraphMeta,
  copyOverride,
  nodeWeight = defaultNodeWeight,
  primaryMetric = defaultPrimaryMetric,
  primaryMetricLabel,
  nodeAriaLabel,
  focusRequest,
  spacious = false,
}) {
  const graphHeight = spacious ? Math.max(820, Math.round(620 * Math.sqrt(papers.length / 32))) : GRAPH_HEIGHT;
  const geometry = useMemo(() => createGraphGeometry(GRAPH_WIDTH, graphHeight), [graphHeight]);
  const { defaultCamera, constrainCamera, worldPointAtClient, cameraFromAnchor } = geometry;
  const fullPaperById = useMemo(() => new Map(papers.map((paper) => [paper.id, paper])), [papers]);
  const visibleIds = useMemo(() => new Set(papers.map((paper) => paper.id)), [papers]);
  const visibleEdges = useMemo(() => edges.filter((edge) =>
    visibleIds.has(edge.source) && visibleIds.has(edge.target)), [edges, visibleIds]);
  const layout = useMemo(() => buildLayout(papers, visibleEdges, nodeWeight, { height: graphHeight, spacious }), [papers, visibleEdges, nodeWeight, graphHeight, spacious]);
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [camera, setCamera] = useState(defaultCamera);
  const [isPanning, setIsPanning] = useState(false);
  const svgRef = useRef(null);
  const cameraRef = useRef(camera);
  const pointersRef = useRef(new Map());
  const gestureRef = useRef(null);
  const gestureMovedRef = useRef(false);
  const suppressClickUntilRef = useRef(0);
  const copy = copyOverride ?? graphCopy[lang];

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
  }, [layout, defaultCamera]);

  useEffect(() => {
    if (!focusRequest?.id) return;
    const node = layout.get(focusRequest.id);
    if (!node) return;
    setSelectedId(focusRequest.id);
    setHoveredId(null);
    updateCamera(constrainCamera({ x: node.x, y: node.y, zoom: 1.65 }));
  }, [focusRequest, layout, constrainCamera]);

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
  }, [geometry]);

  const selectedPaper = fullPaperById.get(selectedId) ?? papers[0] ?? null;
  const activeId = hoveredId ?? selectedId;
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
  const viewHeight = graphHeight / camera.zoom;
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
    <section className={`citation-view${spacious ? " citation-view--spacious" : ""}`} style={{ "--graph-ratio": `${GRAPH_WIDTH} / ${graphHeight}` }} aria-labelledby="citation-graph-title">
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
                const edgeClass = activeId
                  ? (activeEdges.has(key) ? "is-active" : "is-muted")
                  : (spacious ? "is-overview" : "is-active");
                return <line key={key} {...coordinates} className={edgeClass} markerEnd="url(#citation-arrow)" />;
              })}
            </g>
            <g className="citation-nodes">
              {papers.map((paper) => {
                const node = layout.get(paper.id);
                if (!node) return null;
                const selected = paper.id === selectedId;
                const related = connectedIds.has(paper.id);
                const muted = activeId && paper.id !== activeId && !related;
                return (
                  <g
                    key={paper.id}
                    className={`citation-node${selected ? " is-selected" : ""}${muted ? " is-muted" : ""}`}
                    transform={`translate(${node.x} ${node.y})`}
                    role="button"
                    tabIndex="0"
                    aria-label={nodeAriaLabel
                      ? nodeAriaLabel(paper, nodeWeight(paper))
                      : `${paper.nickname}，${paper.citations} ${copy.citations}`}
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
              {selectedPaper.arxiv && <span className="inspector-index">arXiv:{selectedPaper.id}</span>}
              <h3>{selectedPaper.nickname}</h3>
              <p>{selectedPaper.title}</p>
              <div className="inspector-metrics">
                <div><b>{primaryMetric(selectedPaper)}</b><span>{primaryMetricLabel ?? copy.globalCitations}</span></div>
                <div><b>{incoming.length}</b><span>{copy.citedByCorpus}</span></div>
                <div><b>{outgoing.length}</b><span>{copy.referencesInCorpus}</span></div>
              </div>
              <RelationList title={copy.references} emptyText={copy.noReferences} edges={outgoing} paperById={fullPaperById} relationKey="target" onSelect={setSelectedId} copy={copy} />
              <RelationList title={copy.citedBy} emptyText={copy.noCitations} edges={incoming} paperById={fullPaperById} relationKey="source" onSelect={setSelectedId} copy={copy} />
              <a className="inspector-link" href={selectedPaper.arxiv || selectedPaper.pdf} target="_blank" rel="noreferrer">{selectedPaper.arxiv ? copy.openArxiv : copy.openPaper}</a>
            </>
          )}
        </aside>
      </div>

      <div className="graph-provenance">
        <span className="verified-mark">✓</span>
        {lang === "zh" ? (
          <p>
            <b>{copy.provenanceLead}</b> {copy.snapshot}{meta.snapshot}。
          </p>
        ) : (
          <p>
            <b>{copy.provenanceLead}</b> {copy.snapshot} {meta.snapshot}.
          </p>
        )}
      </div>
    </section>
  );
}
