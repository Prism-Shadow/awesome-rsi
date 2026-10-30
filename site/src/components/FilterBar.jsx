import { useEffect, useRef, useState } from "react";

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

function Facet({ id, label, help, selectedCount, open, onOpenToggle, helpOpen, onHelpToggle, copy, children }) {
  const helpId = `dimension-help-${id}`;
  return (
    <section className={`facet${open ? " is-open" : ""}`}>
      <div className="facet-head">
        <button type="button" className="facet-title" aria-expanded={open} onClick={onOpenToggle}>
          <span>{label}</span>
          {selectedCount > 0 && <b>{selectedCount}</b>}
        </button>
        <button
          type="button"
          className={`facet-help${helpOpen ? " is-active" : ""}`}
          aria-label={copy.explain(label)}
          aria-expanded={helpOpen}
          aria-controls={helpId}
          title={copy.explain(label)}
          onClick={onHelpToggle}
        >
          ?
        </button>
        <button type="button" className="facet-disclosure" aria-hidden="true" tabIndex={-1} onClick={onOpenToggle}>
          {open ? "−" : "+"}
        </button>
      </div>
      {helpOpen && <DimensionHelp id={helpId} label={label} help={help} copy={copy} />}
      {open && children}
    </section>
  );
}

export function SearchField({ value, onChange, placeholder }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName ?? "");
      if (((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") || (event.key === "/" && !typing)) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <label className="search-field">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <kbd>/</kbd>
    </label>
  );
}

export function FacetSidebar({ dimensions, selections, facetCounts, onToggle, ranges, copy }) {
  const [openIds, setOpenIds] = useState(() => new Set(dimensions.slice(0, 3).map(({ id }) => id)));
  const [helpId, setHelpId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCount = dimensions.reduce((total, { id }) => total + selections[id].length, 0);

  useEffect(() => {
    const closeHelp = (event) => { if (event.key === "Escape") setHelpId(null); };
    window.addEventListener("keydown", closeHelp);
    return () => window.removeEventListener("keydown", closeHelp);
  }, []);

  const toggleOpen = (id) => setOpenIds((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const toggleHelp = (id) => setHelpId((current) => (current === id ? null : id));

  return (
    <aside className="facets" aria-label={copy.filterPapers}>
      <button type="button" className="facets-toggle" aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)}>
        {copy.filters}{activeCount > 0 ? ` · ${activeCount}` : ""}
        <span aria-hidden="true">{mobileOpen ? "−" : "+"}</span>
      </button>
      <div className={`facets-body${mobileOpen ? " is-open" : ""}`}>
        {dimensions.map((dimension) => {
          const selected = selections[dimension.id];
          return (
            <Facet
              key={dimension.id}
              id={dimension.id}
              label={dimension.label}
              help={dimension.help}
              selectedCount={selected.length}
              open={openIds.has(dimension.id) || selected.length > 0}
              onOpenToggle={() => toggleOpen(dimension.id)}
              helpOpen={helpId === dimension.id}
              onHelpToggle={() => toggleHelp(dimension.id)}
              copy={copy}
            >
              <ul className="facet-options">
                {dimension.options.map((option) => (
                  <li key={option.value}>
                    <label className={`facet-option${option.parent ? " is-child" : ""}`}>
                      <input
                        type="checkbox"
                        checked={selected.includes(option.value)}
                        aria-label={option.parent ? `${option.parentLabel ?? option.parent}: ${option.label}` : option.label}
                        onChange={() => onToggle(dimension.id, option.value)}
                      />
                      <span>{option.label}</span>
                      <small>{facetCounts[dimension.id][option.value] ?? 0}</small>
                    </label>
                  </li>
                ))}
              </ul>
            </Facet>
          );
        })}
        {ranges.length > 0 && (
          <Facet
            id="numeric"
            label={copy.numericRange}
            help={copy.numericHelp}
            selectedCount={0}
            open={openIds.has("numeric")}
            onOpenToggle={() => toggleOpen("numeric")}
            helpOpen={helpId === "numeric"}
            onHelpToggle={() => toggleHelp("numeric")}
            copy={copy}
          >
            <div className="facet-ranges">
              {ranges.map((range) => (
                <RangeFilter
                  key={range.label}
                  label={range.label}
                  min={range.bounds[0]}
                  max={range.bounds[1]}
                  value={range.value}
                  onChange={range.onChange}
                  copy={copy}
                />
              ))}
            </div>
          </Facet>
        )}
      </div>
    </aside>
  );
}

export function ResultsBar({ resultCount, totalCount, activeFilters, onClear, sortBy, sortOptions, onSortChange, copy }) {
  const count = copy.resultCount(resultCount, totalCount);
  return (
    <div className="results-bar">
      <div className="results-summary">
        <span className="results-count">
          {count.before}<b>{count.visible}</b>{count.middle}{count.total}{count.after}
        </span>
        {activeFilters.map((filter) => (
          <button
            type="button"
            className="filter-pill"
            onClick={filter.onRemove}
            aria-label={copy.removeFilter(filter.label)}
            key={filter.key}
          >
            {filter.label}<span aria-hidden="true">×</span>
          </button>
        ))}
        {activeFilters.length > 0 && (
          <button type="button" className="clear-link" onClick={onClear}>{copy.clearAll}</button>
        )}
      </div>
      <label className="sort-select">
        <span>{copy.sort}</span>
        <select value={sortBy} aria-label={copy.sortPapers} onChange={(event) => onSortChange(event.target.value)}>
          {sortOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
        </select>
      </label>
    </div>
  );
}

// Pills for the filters currently narrowing the list, each removable on its own.
export function activeFilterPills({ dimensions, selections, onToggle, ranges }) {
  const pills = dimensions.flatMap((dimension) => selections[dimension.id].map((value) => ({
    key: `${dimension.id}:${value}`,
    label: dimension.options.find((option) => option.value === value)?.label ?? value,
    onRemove: () => onToggle(dimension.id, value),
  })));
  for (const range of ranges) {
    const [low, high] = range.value;
    if (low !== range.bounds[0] || high !== range.bounds[1]) {
      const span = low === high ? `${low}` : `${low}–${high}`;
      pills.push({ key: range.label, label: `${range.label} ${span}`, onRemove: () => range.onChange(range.bounds) });
    }
  }
  return pills;
}
