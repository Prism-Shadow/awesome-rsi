import { useMemo, useState } from "react";
import { methods } from "../data/methods.js";
import { methodCitationEdges } from "../data/methodCitationGraph.js";
import { methodFilterDimensions, methodTaxonomy } from "../data/methodTaxonomy.js";
import { localizeMethodDimensions } from "../data/methodTaxonomyZh.js";
import FilterBar from "./FilterBar.jsx";
import MethodCard from "./MethodCard.jsx";
import { methodFilterCopy, methodsCopy } from "../i18n.js";

const INITIAL_SELECTIONS = Object.fromEntries(methodFilterDimensions.map(({ id }) => [id, []]));
const YEARS = methods.map((method) => method.year);
const YEAR_BOUNDS = [Math.min(...YEARS), Math.max(...YEARS)];
const METHOD_CITATION_COUNTS = Object.fromEntries(methods.map((method) => [
  method.id,
  methodCitationEdges.filter((edge) => edge.target === method.id).length,
]));
const indexedMethods = methods.map((method) => ({
  ...method,
  facets: methodTaxonomy[method.id],
  corpusCitations: METHOD_CITATION_COUNTS[method.id] ?? 0,
}));

export default function MethodsTab({ lang }) {
  const [selections, setSelections] = useState(INITIAL_SELECTIONS);
  const [yearRange, setYearRange] = useState(YEAR_BOUNDS);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const dimensions = useMemo(() => localizeMethodDimensions(methodFilterDimensions, lang), [lang]);
  const copy = methodsCopy[lang];
  const filterText = methodFilterCopy[lang];

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
      .sort((a, b) => sortBy === "citations"
        ? b.corpusCitations - a.corpusCitations || b.published.localeCompare(a.published)
        : b.published.localeCompare(a.published) || a.title.localeCompare(b.title));
  }, [selections, yearRange, query, sortBy]);

  const toggleOption = (dimensionId, optionValue) => setSelections((current) => ({
    ...current,
    [dimensionId]: current[dimensionId].includes(optionValue)
      ? current[dimensionId].filter((value) => value !== optionValue)
      : [...current[dimensionId], optionValue],
  }));

  const clearDimension = (dimensionId) => setSelections((current) => ({ ...current, [dimensionId]: [] }));
  const clearFilters = () => {
    setSelections(INITIAL_SELECTIONS);
    setYearRange(YEAR_BOUNDS);
    setQuery("");
  };

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
        onClear={clearFilters}
        lang={lang}
        copyOverride={filterText}
        sortOptions={[
          { value: "date", label: filterText.newest },
          { value: "citations", label: filterText.mostCited },
        ]}
      />
      {visible.length === 0 ? (
        <div className="empty-state">
          <b>{copy.noMethods}</b>
          <span>{copy.noMethodsHint}</span>
          <button onClick={clearFilters}>{copy.reset}</button>
        </div>
      ) : (
        <div className="paper-list method-list">
          {visible.map((method) => <MethodCard method={method} lang={lang} key={method.id} />)}
        </div>
      )}
    </section>
  );
}
