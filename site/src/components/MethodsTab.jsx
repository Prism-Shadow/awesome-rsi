import { useMemo, useState } from "react";
import { methods } from "../data/methods.js";
import { methodFilterDimensions, methodTaxonomy } from "../data/methodTaxonomy.js";
import { methodCitationEdges, methodCitationGraphMeta } from "../data/methodCitationGraph.js";
import { localizeMethodDimensions } from "../data/methodTaxonomyZh.js";
import CitationGraph from "./CitationGraph.jsx";
import FilterBar from "./FilterBar.jsx";
import MethodCard from "./MethodCard.jsx";
import { methodFilterCopy, methodGraphCopy, methodsCopy } from "../i18n.js";

const INITIAL_SELECTIONS = Object.fromEntries(methodFilterDimensions.map(({ id }) => [id, []]));
const YEARS = methods.map((method) => method.year);
const YEAR_BOUNDS = [Math.min(...YEARS), Math.max(...YEARS)];
const indexedMethods = methods.map((method) => ({ ...method, facets: methodTaxonomy[method.id] }));

export default function MethodsTab({ lang }) {
  const [selections, setSelections] = useState(INITIAL_SELECTIONS);
  const [yearRange, setYearRange] = useState(YEAR_BOUNDS);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [view, setView] = useState(() => window.location.hash === "#methods-graph" ? "graph" : "list");
  const dimensions = useMemo(() => localizeMethodDimensions(methodFilterDimensions, lang), [lang]);
  const copy = methodsCopy[lang];
  const filterText = methodFilterCopy[lang];
  const graphText = methodGraphCopy[lang];

  const facetCounts = useMemo(() => Object.fromEntries(methodFilterDimensions.map((dimension) => [
    dimension.id,
    Object.fromEntries(dimension.options.map((option) => [
      option.value,
      indexedMethods.filter((method) => method.facets[dimension.id].includes(option.value)).length,
    ])),
  ])), []);

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return indexedMethods
      .filter((method) => methodFilterDimensions.every(({ id }) =>
        selections[id].length === 0 || selections[id].some((value) => method.facets[id].includes(value))))
      .filter((method) => method.year >= yearRange[0] && method.year <= yearRange[1])
      .filter((method) => {
        if (!normalizedQuery) return true;
        return [
          method.id,
          method.title,
          method.nickname,
          method.venue,
          method.summary,
          method.summaryZh,
          ...method.authors,
          ...Object.values(method.facets).flat(),
        ].join(" ").toLowerCase().includes(normalizedQuery);
      })
      .sort((a, b) => sortBy === "title"
        ? a.title.localeCompare(b.title)
        : b.published.localeCompare(a.published) || a.title.localeCompare(b.title));
  }, [selections, yearRange, query, sortBy]);

  const toggleOption = (dimensionId, optionValue) => setSelections((current) => ({
    ...current,
    [dimensionId]: current[dimensionId].includes(optionValue)
      ? current[dimensionId].filter((value) => value !== optionValue)
      : [...current[dimensionId], optionValue],
  }));

  const clearDimension = (dimensionId) => setSelections((current) => ({ ...current, [dimensionId]: [] }));
  const hasFilters = query.trim() !== ""
    || Object.values(selections).some((values) => values.length > 0)
    || yearRange[0] !== YEAR_BOUNDS[0]
    || yearRange[1] !== YEAR_BOUNDS[1];

  const clearFilters = () => {
    setSelections(INITIAL_SELECTIONS);
    setYearRange(YEAR_BOUNDS);
    setQuery("");
  };

  const selectView = (nextView) => {
    setView(nextView);
    window.history.replaceState(null, "", nextView === "graph" ? "#methods-graph" : "#methods");
  };

  const visibleIds = new Set(visible.map((method) => method.id));
  const visibleIncomingCounts = Object.fromEntries(visible.map((method) => [
    method.id,
    methodCitationEdges.filter((edge) => edge.target === method.id
      && visibleIds.has(edge.source)
      && visibleIds.has(edge.target)).length,
  ]));

  return (
    <section className="methods-index" aria-label={filterText.filterPapers}>
      <FilterBar
        dimensions={dimensions}
        selections={selections}
        facetCounts={facetCounts}
        onToggle={toggleOption}
        onClearDimension={clearDimension}
        yearBounds={YEAR_BOUNDS}
        yearRange={yearRange}
        onYearRangeChange={setYearRange}
        citationBounds={null}
        citationRange={null}
        onCitationRangeChange={() => {}}
        query={query}
        onQueryChange={setQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultCount={visible.length}
        totalCount={methods.length}
        hasFilters={hasFilters}
        onClear={clearFilters}
        lang={lang}
        copyOverride={filterText}
        sortOptions={[
          { value: "date", label: filterText.newest },
          { value: "title", label: filterText.alphabetical },
        ]}
      />
      <div className="view-toolbar">
        <div>
          <span>{copy.viewAs}</span>
          <button className={view === "list" ? "is-active" : ""} onClick={() => selectView("list")} aria-pressed={view === "list"}>☷ {copy.list}</button>
          <button className={view === "graph" ? "is-active" : ""} onClick={() => selectView("graph")} aria-pressed={view === "graph"}>⌘ {copy.graph}</button>
        </div>
        <p>{view === "graph" ? copy.graphSummary(methodCitationEdges.length) : copy.listSummary}</p>
      </div>
      {visible.length === 0 ? (
        <div className="empty-state">
          <b>{copy.noMethods}</b>
          <span>{copy.noMethodsHint}</span>
          <button onClick={clearFilters}>{copy.reset}</button>
        </div>
      ) : view === "list" ? (
        <div className="paper-list method-list">
          {visible.map((method) => <MethodCard method={method} lang={lang} key={method.id} />)}
        </div>
      ) : (
        <CitationGraph
          papers={visible}
          lang={lang}
          edges={methodCitationEdges}
          meta={methodCitationGraphMeta}
          copyOverride={graphText}
          nodeWeight={(paper) => visibleIncomingCounts[paper.id] ?? 0}
          primaryMetric={(paper) => paper.year}
          primaryMetricLabel={graphText.primaryMetric}
          nodeAriaLabel={(paper, count) => `${paper.nickname}，${count} ${graphText.corpusCitations}`}
        />
      )}
    </section>
  );
}
