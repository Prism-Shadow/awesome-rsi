import { useEffect, useMemo, useRef, useState } from "react";
import { papers } from "../data/papers.js";
import { citationEdges, citationGraphMeta } from "../data/citationGraph.js";
import { methods } from "../data/methods.js";
import { methodCitationEdges, methodCitationGraphMeta } from "../data/methodCitationGraph.js";
import { graphCopy, graphExplorerCopy, methodGraphCopy } from "../i18n.js";
import CitationGraph from "./CitationGraph.jsx";

const METHOD_INCOMING_COUNTS = Object.fromEntries(methods.map((method) => [
  method.id,
  methodCitationEdges.filter((edge) => edge.target === method.id).length,
]));
const methodNodeWeight = (paper) => METHOD_INCOMING_COUNTS[paper.id] ?? 0;

function graphKindFromHash() {
  return window.location.hash === "#methods-graph" || window.location.hash === "#graph-methods"
    ? "methods"
    : "benchmark";
}

function searchableText(paper) {
  return [paper.id, paper.nickname, paper.title, ...(paper.authors ?? [])]
    .join(" ")
    .toLowerCase();
}

export default function GraphTab({ lang }) {
  const [kind, setKind] = useState(graphKindFromHash);
  const [query, setQuery] = useState("");
  const [resultsOpen, setResultsOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(0);
  const [focusRequest, setFocusRequest] = useState(null);
  const focusSequence = useRef(0);
  const copy = graphExplorerCopy[lang];
  const graphText = kind === "methods" ? methodGraphCopy[lang] : graphCopy[lang];
  const graphPapers = kind === "methods" ? methods : papers;
  const graphEdges = kind === "methods" ? methodCitationEdges : citationEdges;
  const graphMeta = kind === "methods" ? methodCitationGraphMeta : citationGraphMeta;

  useEffect(() => {
    const syncKindFromHash = () => {
      if (!window.location.hash.startsWith("#graph") && window.location.hash !== "#methods-graph") return;
      setKind(graphKindFromHash());
      setQuery("");
      setResultsOpen(false);
      setActiveResult(0);
      setFocusRequest(null);
    };
    window.addEventListener("hashchange", syncKindFromHash);
    return () => window.removeEventListener("hashchange", syncKindFromHash);
  }, []);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return graphPapers.filter((paper) => searchableText(paper).includes(normalized)).slice(0, 8);
  }, [graphPapers, query]);

  const selectKind = (nextKind) => {
    setKind(nextKind);
    setQuery("");
    setResultsOpen(false);
    setActiveResult(0);
    setFocusRequest(null);
    window.history.replaceState(null, "", nextKind === "methods" ? "#graph-methods" : "#graph-benchmark");
  };

  const focusPaper = (paper) => {
    focusSequence.current += 1;
    setQuery(paper.nickname);
    setResultsOpen(false);
    setActiveResult(0);
    setFocusRequest({ id: paper.id, sequence: focusSequence.current });
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "ArrowDown" && matches.length > 0) {
      event.preventDefault();
      setResultsOpen(true);
      setActiveResult((current) => (current + 1) % matches.length);
    } else if (event.key === "ArrowUp" && matches.length > 0) {
      event.preventDefault();
      setResultsOpen(true);
      setActiveResult((current) => (current - 1 + matches.length) % matches.length);
    } else if (event.key === "Enter" && resultsOpen && matches[activeResult]) {
      event.preventDefault();
      focusPaper(matches[activeResult]);
    } else if (event.key === "Escape") {
      setResultsOpen(false);
    }
  };

  return (
    <section className="graph-explorer" aria-label={copy.title}>
      <div className="graph-explorer-toolbar">
        <div className="graph-dataset-switch" role="tablist" aria-label={copy.datasetLabel}>
          <button
            type="button"
            role="tab"
            aria-selected={kind === "benchmark"}
            className={kind === "benchmark" ? "is-active" : ""}
            onClick={() => selectKind("benchmark")}
          >
            {copy.benchmark}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={kind === "methods"}
            className={kind === "methods" ? "is-active" : ""}
            onClick={() => selectKind("methods")}
          >
            {copy.methods}
          </button>
        </div>

        <div
          className="graph-node-search"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setResultsOpen(false);
          }}
        >
          <label htmlFor="graph-node-query">{copy.searchLabel}</label>
          <div className="graph-node-search-field">
            <span aria-hidden="true">⌕</span>
            <input
              id="graph-node-query"
              type="search"
              value={query}
              placeholder={copy.searchPlaceholder}
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={resultsOpen && query.trim() !== ""}
              aria-controls="graph-node-results"
              aria-activedescendant={resultsOpen && matches[activeResult] ? `graph-result-${matches[activeResult].id}` : undefined}
              onFocus={() => setResultsOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value);
                setResultsOpen(true);
                setActiveResult(0);
              }}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
          {resultsOpen && query.trim() !== "" && (
            <div id="graph-node-results" className="graph-search-results" role="listbox">
              {matches.length === 0 ? (
                <p>{copy.noResults}</p>
              ) : matches.map((paper, index) => (
                <button
                  id={`graph-result-${paper.id}`}
                  type="button"
                  role="option"
                  aria-selected={index === activeResult}
                  className={index === activeResult ? "is-active" : ""}
                  onMouseEnter={() => setActiveResult(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => focusPaper(paper)}
                  key={paper.id}
                >
                  <span>{paper.nickname}</span>
                  <strong>{paper.title}</strong>
                  <small>arXiv:{paper.id} · {(paper.authors ?? []).slice(0, 2).join(", ")}</small>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <CitationGraph
        key={kind}
        papers={graphPapers}
        lang={lang}
        edges={graphEdges}
        meta={graphMeta}
        copyOverride={graphText}
        focusRequest={focusRequest}
        nodeWeight={kind === "methods" ? methodNodeWeight : undefined}
        primaryMetric={kind === "methods" ? (paper) => paper.year : undefined}
        primaryMetricLabel={kind === "methods" ? graphText.primaryMetric : undefined}
        nodeAriaLabel={kind === "methods"
          ? (paper, count) => `${paper.nickname}, ${count} ${graphText.corpusCitations}`
          : undefined}
      />
    </section>
  );
}
