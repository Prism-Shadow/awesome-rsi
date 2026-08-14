import { useMemo, useState } from "react";
import { papers } from "../data/papers.js";
import FilterBar from "./FilterBar.jsx";
import PaperCard from "./PaperCard.jsx";

export default function PapersTab() {
  const [activeTags, setActiveTags] = useState([]);
  const [activeYear, setActiveYear] = useState(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const { allTags, tagCounts, years } = useMemo(() => {
    const counts = {};
    for (const p of papers) {
      for (const t of p.tags) counts[t] = (counts[t] ?? 0) + 1;
    }
    return {
      allTags: Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b)),
      tagCounts: counts,
      years: [...new Set(papers.map((p) => p.year))].sort((a, b) => b - a),
    };
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = papers.filter((p) => {
      if (activeTags.length > 0 && !activeTags.some((t) => p.tags.includes(t))) return false;
      if (activeYear !== null && p.year !== activeYear) return false;
      if (q) {
        const haystack = [p.title, p.nickname, p.abstract, ...p.authors].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    return filtered.sort((a, b) =>
      sortBy === "citations"
        ? b.citations - a.citations || b.published.localeCompare(a.published)
        : b.published.localeCompare(a.published),
    );
  }, [activeTags, activeYear, query, sortBy]);

  const toggleTag = (tag) =>
    setActiveTags((tags) => (tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]));

  const clearFilters = () => {
    setActiveTags([]);
    setActiveYear(null);
    setQuery("");
  };

  return (
    <>
      <FilterBar
        allTags={allTags}
        tagCounts={tagCounts}
        activeTags={activeTags}
        onToggleTag={toggleTag}
        years={years}
        activeYear={activeYear}
        onSelectYear={setActiveYear}
        query={query}
        onQueryChange={setQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultCount={visible.length}
        totalCount={papers.length}
        onClear={clearFilters}
      />
      <div className="paper-list">
        {visible.length === 0 ? (
          <p className="empty-state">No papers match the current filters.</p>
        ) : (
          visible.map((paper) => <PaperCard key={paper.id} paper={paper} />)
        )}
      </div>
    </>
  );
}
