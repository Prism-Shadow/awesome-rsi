import { useMemo, useState } from "react";
import { methods } from "../data/methods.js";
import { systems } from "../data/systems.js";
import { methodCitationEdges } from "../data/methodCitationGraph.js";
import { methodFilterDimensions, methodTaxonomy } from "../data/methodTaxonomy.js";
import { localizeMethodDimensions } from "../data/methodTaxonomyZh.js";
import { FacetSidebar, ResultsBar, SearchField, activeFilterPills } from "./FilterBar.jsx";
import PageHead from "./PageHead.jsx";
import MethodCard from "./MethodCard.jsx";
import SystemCard from "./SystemCard.jsx";
import { appCopy, methodFilterCopy, methodsCopy } from "../i18n.js";

const INITIAL_SELECTIONS = Object.fromEntries(methodFilterDimensions.map(({ id }) => [id, []]));
const methodEntries = [
  ...methods.map((method) => ({
    ...method,
    entryType: "paper",
    facets: methodTaxonomy[method.id],
    corpusCitations: methodCitationEdges.filter((edge) => edge.target === method.id).length,
  })),
  ...systems.map((system) => ({
    ...system,
    entryType: "system",
    published: system.released,
    year: Number(system.released.slice(0, 4)),
    venue: "Open-source system",
    authors: [system.maintainers],
    facets: system.taxonomy,
    corpusCitations: 0,
  })),
];
const YEARS = methodEntries.map((method) => method.year);
const YEAR_BOUNDS = [Math.min(...YEARS), Math.max(...YEARS)];

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
      methodEntries.filter((method) => method.facets[dimension.id].includes(option.value)).length,
    ])),
  ])), []);

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return methodEntries
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

  const clearFilters = () => {
    setSelections(INITIAL_SELECTIONS);
    setYearRange(YEAR_BOUNDS);
    setQuery("");
  };

  const ranges = [{ label: filterText.publicationYear, bounds: YEAR_BOUNDS, value: yearRange, onChange: setYearRange }];
  const sortOptions = [
    { value: "date", label: filterText.newest },
    { value: "citations", label: filterText.mostCited },
  ];

  return (
    <>
      <PageHead title={appCopy[lang].tabs.methods} description={appCopy[lang].pageHeads.methods}>
        <SearchField value={query} onChange={setQuery} placeholder={filterText.searchPlaceholder} />
      </PageHead>
      <div className="catalog">
        <FacetSidebar
          dimensions={dimensions}
          selections={selections}
          facetCounts={facetCounts}
          onToggle={toggleOption}
          ranges={ranges}
          copy={filterText}
        />
        <section className="catalog-results" aria-label={filterText.filterPapers}>
          <ResultsBar
            resultCount={visible.length}
            totalCount={methodEntries.length}
            activeFilters={activeFilterPills({ dimensions, selections, onToggle: toggleOption, ranges })}
            onClear={clearFilters}
            sortBy={sortBy}
            sortOptions={sortOptions}
            onSortChange={setSortBy}
            copy={filterText}
          />
          {visible.length === 0 ? (
            <div className="empty-state">
              <b>{copy.noMethods}</b>
              <span>{copy.noMethodsHint}</span>
              <button onClick={clearFilters}>{copy.reset}</button>
            </div>
          ) : (
            <div className="paper-list method-list">
              {visible.map((method) => method.entryType === "system"
                ? <SystemCard system={method} lang={lang} key={method.id} />
                : <MethodCard method={method} lang={lang} key={method.id} />)}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
