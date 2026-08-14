export default function FilterBar({
  allTags,
  tagCounts,
  activeTags,
  onToggleTag,
  years,
  activeYear,
  onSelectYear,
  query,
  onQueryChange,
  sortBy,
  onSortChange,
  resultCount,
  totalCount,
  onClear,
}) {
  const hasFilters = activeTags.length > 0 || activeYear !== null || query.trim() !== "";

  return (
    <div className="filter-bar">
      <div className="filter-row">
        <input
          className="search-input"
          type="search"
          placeholder="Search title, authors, abstract…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        <div className="sort-group" role="group" aria-label="Sort papers">
          <button
            className={`sort-btn${sortBy === "date" ? " is-active" : ""}`}
            onClick={() => onSortChange("date")}
          >
            Newest
          </button>
          <button
            className={`sort-btn${sortBy === "citations" ? " is-active" : ""}`}
            onClick={() => onSortChange("citations")}
          >
            Most cited
          </button>
        </div>
      </div>

      <div className="filter-row">
        <span className="filter-label">Topic</span>
        {allTags.map((tag) => (
          <button
            key={tag}
            className={`chip${activeTags.includes(tag) ? " is-active" : ""}`}
            onClick={() => onToggleTag(tag)}
          >
            {tag}
            <span className="chip-count">{tagCounts[tag]}</span>
          </button>
        ))}
      </div>

      <div className="filter-row">
        <span className="filter-label">Year</span>
        {years.map((year) => (
          <button
            key={year}
            className={`chip${activeYear === year ? " is-active" : ""}`}
            onClick={() => onSelectYear(activeYear === year ? null : year)}
          >
            {year}
          </button>
        ))}
        <span className="result-count">
          {resultCount} / {totalCount} papers
          {hasFilters && (
            <>
              {" · "}
              <button className="clear-btn" onClick={onClear}>
                Clear filters
              </button>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
