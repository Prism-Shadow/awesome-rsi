import { useMemo, useState } from "react";
import { papers } from "../data/papers.js";
import { filterDimensions, paperTaxonomy } from "../data/paperTaxonomy.js";
import { FacetSidebar, ResultsBar, SearchField, activeFilterPills } from "./FilterBar.jsx";
import PageHead from "./PageHead.jsx";
import PaperCard from "./PaperCard.jsx";
import { localizeFilterDimensions } from "../data/taxonomyZh.js";
import { paperAbstractsZh } from "../data/paperAbstractsZh.js";
import { appCopy, filterCopy, papersCopy } from "../i18n.js";

const INITIAL_SELECTIONS = Object.fromEntries(filterDimensions.map(({ id }) => [id, []]));
const YEARS = papers.map((paper) => paper.year);
const CITATIONS = papers.map((paper) => paper.citations);
const YEAR_BOUNDS = [Math.min(...YEARS), Math.max(...YEARS)];
const CITATION_BOUNDS = [Math.min(...CITATIONS), Math.max(...CITATIONS)];
const indexedPapers = papers.map((paper) => ({ ...paper, facets: paperTaxonomy[paper.id] }));

export default function PapersTab({ lang }) {
  const [selections, setSelections] = useState(INITIAL_SELECTIONS);
  const [yearRange, setYearRange] = useState(YEAR_BOUNDS);
  const [citationRange, setCitationRange] = useState(CITATION_BOUNDS);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const dimensions = useMemo(() => localizeFilterDimensions(filterDimensions, lang), [lang]);
  const copy = papersCopy[lang];
  const filterText = filterCopy[lang];

  const facetCounts = useMemo(() => Object.fromEntries(dimensions.map((dimension) => [
    dimension.id,
    Object.fromEntries(dimension.options.map((option) => [
      option.value,
      indexedPapers.filter((paper) => paper.facets[dimension.id].includes(option.value)).length,
    ])),
  ])), [dimensions]);

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return indexedPapers
      .filter((paper) => filterDimensions.every(({ id }) =>
        selections[id].length === 0 || selections[id].some((value) => paper.facets[id].includes(value))))
      .filter((paper) => paper.year >= yearRange[0] && paper.year <= yearRange[1])
      .filter((paper) => paper.citations >= citationRange[0] && paper.citations <= citationRange[1])
      .filter((paper) => {
        if (!normalizedQuery) return true;
        return [paper.id, paper.title, paper.nickname, paper.abstract, paperAbstractsZh[paper.id], ...paper.authors]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) => sortBy === "citations"
        ? b.citations - a.citations || b.published.localeCompare(a.published)
        : b.published.localeCompare(a.published));
  }, [selections, yearRange, citationRange, query, sortBy, lang]);

  const toggleOption = (dimensionId, optionValue) => setSelections((current) => {
    const dimension = filterDimensions.find(({ id }) => id === dimensionId);
    const option = dimension.options.find(({ value }) => value === optionValue);
    const childValues = dimension.options
      .filter(({ parent }) => parent === optionValue)
      .map(({ value }) => value);
    const currentValues = current[dimensionId];

    if (childValues.length > 0) {
      const nextValues = currentValues.includes(optionValue)
        ? currentValues.filter((value) => value !== optionValue && !childValues.includes(value))
        : [...currentValues.filter((value) => !childValues.includes(value)), optionValue];
      return { ...current, [dimensionId]: nextValues };
    }

    if (option.parent) {
      const withoutBroadParent = currentValues.filter((value) => value !== option.parent);
      const nextValues = withoutBroadParent.includes(optionValue)
        ? withoutBroadParent.filter((value) => value !== optionValue)
        : [...withoutBroadParent, optionValue];
      return { ...current, [dimensionId]: nextValues };
    }

    return {
      ...current,
      [dimensionId]: currentValues.includes(optionValue)
        ? currentValues.filter((value) => value !== optionValue)
        : [...currentValues, optionValue],
    };
  });

  const clearFilters = () => {
    setSelections(INITIAL_SELECTIONS);
    setYearRange(YEAR_BOUNDS);
    setCitationRange(CITATION_BOUNDS);
    setQuery("");
  };

  const ranges = [
    { label: filterText.publicationYear, bounds: YEAR_BOUNDS, value: yearRange, onChange: setYearRange },
    { label: filterText.citations, bounds: CITATION_BOUNDS, value: citationRange, onChange: setCitationRange },
  ];
  const sortOptions = [
    { value: "date", label: filterText.newest },
    { value: "citations", label: filterText.mostCited },
  ];

  return (
    <>
      <PageHead title={appCopy[lang].tabs.papers} description={appCopy[lang].pageHeads.papers(papers.length)}>
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
            totalCount={papers.length}
            activeFilters={activeFilterPills({ dimensions, selections, onToggle: toggleOption, ranges })}
            onClear={clearFilters}
            sortBy={sortBy}
            sortOptions={sortOptions}
            onSortChange={setSortBy}
            copy={filterText}
          />
          {visible.length === 0 ? (
            <div className="empty-state">
              <b>{copy.noPapers}</b>
              <span>{copy.noPapersHint}</span>
              <button onClick={clearFilters}>{copy.reset}</button>
            </div>
          ) : (
            <div className="paper-list">
              {visible.map((paper) => <PaperCard key={paper.id} paper={paper} lang={lang} />)}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
