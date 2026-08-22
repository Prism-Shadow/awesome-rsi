import { useEffect, useRef, useState } from "react";
import { filterCopy } from "../i18n.js";

function RangeFilter({ label, min, max, value, onChange, copy, suffix = "" }) {
  const [low, high] = value;
  const span = Math.max(max - min, 1);
  const lowPercent = ((low - min) / span) * 100;
  const highPercent = ((high - min) / span) * 100;

  if (min === max) {
    return (
      <div className="range-filter is-fixed">
        <div className="range-copy">
          <span>{label}</span>
          <strong>{min}{suffix}</strong>
        </div>
        <div className="fixed-range"><i /><span>{copy.onlyValue}</span></div>
      </div>
    );
  }

  return (
    <div className="range-filter">
      <div className="range-copy">
        <span>{label}</span>
        <strong>
          {low}{suffix} <i>—</i> {high}{suffix}
        </strong>
      </div>
      <div
        className="dual-range"
        style={{ "--range-start": `${lowPercent}%`, "--range-end": `${highPercent}%` }}
      >
        <div className="range-rail" />
        <input
          type="range"
          min={min}
          max={max}
          value={low}
          aria-label={copy.minimum(label)}
          onChange={(event) => onChange([Math.min(Number(event.target.value), high), high])}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={high}
          aria-label={copy.maximum(label)}
          onChange={(event) => onChange([low, Math.max(Number(event.target.value), low)])}
        />
      </div>
      <div className="range-ends"><span>{min}{suffix}</span><span>{max}{suffix}</span></div>
    </div>
  );
}

function DimensionHelp({ id, label, help, copy }) {
  const rootItems = help.items.filter((item) => !item.parent);

  return (
    <section id={id} className="dimension-help" aria-label={copy.definitions(label)}>
      <p className="dimension-help-summary">{help.summary}</p>
      <div className="dimension-help-list">
        {rootItems.map((item) => {
          const children = help.items.filter((candidate) => candidate.parent === item.term);

          return (
            <article className={`dimension-help-item${children.length ? " has-children" : ""}`} key={item.term}>
              <h4>{item.term}</h4>
              <p>{item.description}</p>
              {children.length > 0 && (
                <div className="dimension-help-children">
                  <span className="dimension-help-children-label">{copy.includes}</span>
                  <div className="dimension-help-child-grid">
                    {children.map((child) => (
                      <section className="dimension-help-child" key={child.term}>
                        <h5>{child.term}</h5>
                        <p>{child.description}</p>
                      </section>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
      {help.note && <p className="dimension-help-note"><span>{copy.note}</span>{help.note}</p>}
    </section>
  );
}

function DimensionTitle({ label, helpId, helpOpen, onHelpToggle, copy }) {
  return (
    <div className="dimension-title">
      <span>{label}</span>
      <button
        type="button"
        className={`dimension-help-trigger${helpOpen ? " is-active" : ""}`}
        aria-label={copy.explain(label)}
        aria-expanded={helpOpen}
        aria-controls={helpId}
        title={copy.explain(label)}
        onClick={onHelpToggle}
      >
        ?
      </button>
    </div>
  );
}

function FilterDimension({ dimension, selected, counts, onToggle, onClear, helpOpen, onHelpToggle, copy }) {
  const visibleOptions = dimension.options.filter((option) => {
    if (!option.parent) return true;
    const siblingValues = dimension.options
      .filter(({ parent }) => parent === option.parent)
      .map(({ value }) => value);
    return selected.includes(option.parent) || siblingValues.some((value) => selected.includes(value));
  });
  const helpId = `dimension-help-${dimension.id}`;

  return (
    <div className={`dimension-row${helpOpen ? " has-help-open" : ""}`}>
      <div className="dimension-label">
        <DimensionTitle label={dimension.label} helpId={helpId} helpOpen={helpOpen} onHelpToggle={onHelpToggle} copy={copy} />
      </div>
      <div className="dimension-content">
        <div className="dimension-options">
          <button
            className={`filter-option filter-option-all${selected.length === 0 ? " is-active" : ""}`}
            onClick={onClear}
          >
            {copy.all}
          </button>
          {visibleOptions.map((option) => {
            const active = selected.includes(option.value);
            const childValues = dimension.options
              .filter(({ parent }) => parent === option.value)
              .map(({ value }) => value);
            const expanded = childValues.length > 0
              && (active || childValues.some((value) => selected.includes(value)));
            return (
              <button
                key={option.value}
                className={`filter-option${option.parent ? " is-child" : ""}${childValues.length > 0 ? " has-children" : ""}${expanded ? " is-expanded" : ""}${active ? " is-active" : ""}`}
                aria-pressed={active}
                aria-expanded={childValues.length > 0 ? expanded : undefined}
                aria-label={option.parent ? `${option.parentLabel ?? option.parent}：${option.label}` : option.label}
                onClick={() => onToggle(option.value)}
              >
                <span className="option-check" aria-hidden="true">{active ? "✓" : "+"}</span>
                {option.parent && <span className="option-parent">{option.parentLabel ?? option.parent}</span>}
                <span>{option.label}</span>
                <span className="option-count">{counts[option.value] ?? 0}</span>
                {childValues.length > 0 && <span className="option-disclosure" aria-hidden="true">⌄</span>}
              </button>
            );
          })}
        </div>
        {helpOpen && <DimensionHelp id={helpId} label={dimension.label} help={dimension.help} copy={copy} />}
      </div>
    </div>
  );
}

export default function FilterBar({
  dimensions,
  selections,
  facetCounts,
  onToggle,
  onClearDimension,
  yearBounds,
  yearRange,
  onYearRangeChange,
  citationBounds,
  citationRange,
  onCitationRangeChange,
  query,
  onQueryChange,
  sortBy,
  onSortChange,
  resultCount,
  totalCount,
  hasFilters,
  onClear,
  lang,
}) {
  const searchRef = useRef(null);
  const [openHelpId, setOpenHelpId] = useState(null);
  const copy = filterCopy[lang];
  const countCopy = copy.resultCount(resultCount, totalCount);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") setOpenHelpId(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="filter-shell" aria-label={copy.filterPapers}>
      <div className="filter-board">
        <div className="filter-board-head">
          <span className="filter-status">
            {countCopy.before}<b>{countCopy.visible}</b>{countCopy.middle}{countCopy.total}{countCopy.after}
          </span>
        </div>

        {dimensions.map((dimension) => (
          <FilterDimension
            key={dimension.id}
            dimension={dimension}
            selected={selections[dimension.id]}
            counts={facetCounts[dimension.id]}
            onToggle={(option) => onToggle(dimension.id, option)}
            onClear={() => onClearDimension(dimension.id)}
            helpOpen={openHelpId === dimension.id}
            onHelpToggle={() => setOpenHelpId((current) => current === dimension.id ? null : dimension.id)}
            copy={copy}
          />
        ))}

        <div className={`dimension-row number-row${openHelpId === "numeric" ? " has-help-open" : ""}`}>
          <div className="dimension-label">
            <DimensionTitle
              label={copy.numericRange}
              helpId="dimension-help-numeric"
              helpOpen={openHelpId === "numeric"}
              onHelpToggle={() => setOpenHelpId((current) => current === "numeric" ? null : "numeric")}
              copy={copy}
            />
          </div>
          <div className="dimension-content">
            <div className="range-grid">
              <RangeFilter label={copy.publicationYear} min={yearBounds[0]} max={yearBounds[1]} value={yearRange} onChange={onYearRangeChange} copy={copy} />
              <RangeFilter label={copy.citations} min={citationBounds[0]} max={citationBounds[1]} value={citationRange} onChange={onCitationRangeChange} copy={copy} />
            </div>
            {openHelpId === "numeric" && <DimensionHelp id="dimension-help-numeric" label={copy.numericRange} help={copy.numericHelp} copy={copy} />}
          </div>
        </div>

        <div className="filter-board-foot">
          <span><i className="logic-dot" /> {copy.logic} <b>+</b> {copy.logicAnd}</span>
          <button className="clear-btn" onClick={onClear} disabled={!hasFilters}>{copy.reset}</button>
        </div>
      </div>

      <div className="search-sort-row">
        <label className="search-field">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            ref={searchRef}
            type="search"
            placeholder={copy.searchPlaceholder}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
          <kbd>⌘ K</kbd>
        </label>
        <div className="sort-group" role="group" aria-label={copy.sortPapers}>
          <span className="sort-label">{copy.sort}</span>
          <button className={`sort-btn${sortBy === "date" ? " is-active" : ""}`} onClick={() => onSortChange("date")}>{copy.newest}</button>
          <button className={`sort-btn${sortBy === "citations" ? " is-active" : ""}`} onClick={() => onSortChange("citations")}>{copy.mostCited}</button>
        </div>
      </div>
    </section>
  );
}
