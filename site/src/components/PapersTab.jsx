import { useMemo, useState } from "react";
import { papers } from "../data/papers.js";
import { filterDimensions, paperTaxonomy } from "../data/paperTaxonomy.js";
import { citationEdges } from "../data/citationGraph.js";
import FilterBar from "./FilterBar.jsx";
import PaperCard from "./PaperCard.jsx";
import CitationGraph from "./CitationGraph.jsx";

const INITIAL_SELECTIONS = Object.fromEntries(filterDimensions.map(({ id }) => [id, []]));
const YEARS = papers.map((paper) => paper.year);
const CITATIONS = papers.map((paper) => paper.citations);
const YEAR_BOUNDS = [Math.min(...YEARS), Math.max(...YEARS)];
const CITATION_BOUNDS = [Math.min(...CITATIONS), Math.max(...CITATIONS)];
const indexedPapers = papers.map((paper) => ({ ...paper, facets: paperTaxonomy[paper.id] }));

export default function PapersTab() {
  const [selections, setSelections] = useState(INITIAL_SELECTIONS);
  const [yearRange, setYearRange] = useState(YEAR_BOUNDS);
  const [citationRange, setCitationRange] = useState(CITATION_BOUNDS);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [view, setView] = useState("list");

  const facetCounts = useMemo(() => Object.fromEntries(filterDimensions.map((dimension) => [
    dimension.id,
    Object.fromEntries(dimension.options.map((option) => [
      option.value,
      indexedPapers.filter((paper) => paper.facets[dimension.id].includes(option.value)).length,
    ])),
  ])), []);

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return indexedPapers
      .filter((paper) => filterDimensions.every(({ id }) =>
        selections[id].length === 0 || selections[id].some((value) => paper.facets[id].includes(value))))
      .filter((paper) => paper.year >= yearRange[0] && paper.year <= yearRange[1])
      .filter((paper) => paper.citations >= citationRange[0] && paper.citations <= citationRange[1])
      .filter((paper) => {
        if (!normalizedQuery) return true;
        return [paper.id, paper.title, paper.nickname, paper.abstract, ...paper.authors]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) => sortBy === "citations"
        ? b.citations - a.citations || b.published.localeCompare(a.published)
        : b.published.localeCompare(a.published));
  }, [selections, yearRange, citationRange, query, sortBy]);

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

  const clearDimension = (dimensionId) => setSelections((current) => ({ ...current, [dimensionId]: [] }));

  const hasFilters = query.trim() !== ""
    || Object.values(selections).some((values) => values.length > 0)
    || yearRange[0] !== YEAR_BOUNDS[0]
    || yearRange[1] !== YEAR_BOUNDS[1]
    || citationRange[0] !== CITATION_BOUNDS[0]
    || citationRange[1] !== CITATION_BOUNDS[1];

  const clearFilters = () => {
    setSelections(INITIAL_SELECTIONS);
    setYearRange(YEAR_BOUNDS);
    setCitationRange(CITATION_BOUNDS);
    setQuery("");
  };

  return (
    <>
      <FilterBar
        dimensions={filterDimensions}
        selections={selections}
        facetCounts={facetCounts}
        onToggle={toggleOption}
        onClearDimension={clearDimension}
        yearBounds={YEAR_BOUNDS}
        yearRange={yearRange}
        onYearRangeChange={setYearRange}
        citationBounds={CITATION_BOUNDS}
        citationRange={citationRange}
        onCitationRangeChange={setCitationRange}
        query={query}
        onQueryChange={setQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultCount={visible.length}
        totalCount={papers.length}
        hasFilters={hasFilters}
        onClear={clearFilters}
      />
      <div className="view-toolbar">
        <div>
          <span>View as</span>
          <button className={view === "list" ? "is-active" : ""} onClick={() => setView("list")} aria-pressed={view === "list"}>☷ List</button>
          <button className={view === "graph" ? "is-active" : ""} onClick={() => setView("graph")} aria-pressed={view === "graph"}>⌘ Citation graph</button>
        </div>
        <p>{view === "graph" ? `${citationEdges.length} real citation relationships in the full corpus` : "Detailed metadata and abstracts"}</p>
      </div>
      {visible.length === 0 ? (
        <div className="empty-state">
          <b>No papers found</b>
          <span>Try removing one of the filters or widening a range.</span>
          <button onClick={clearFilters}>Reset all filters</button>
        </div>
      ) : view === "list" ? (
        <div className="paper-list">
          {visible.map((paper) => <PaperCard key={paper.id} paper={paper} />)}
        </div>
      ) : <CitationGraph papers={visible} />}
    </>
  );
}
