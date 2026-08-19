import { useState } from "react";

// Tag hues reuse the GDPevo domain palette (see styles.css variables).
const TAG_COLORS = {
  "Self-Evolution": ["var(--accent-ink)", "var(--accent-soft)"],
  "Skill Learning": ["var(--blue)", "var(--blue-soft)"],
  Memory: ["var(--purple)", "var(--purple-soft)"],
  "Continual Learning": ["var(--teal)", "var(--teal-soft)"],
  "Data-Centric": ["var(--gold)", "var(--gold-soft)"],
  "Post-Training & RL": ["var(--amber)", "var(--amber-soft)"],
  "Harness Optimization": ["var(--blue)", "var(--blue-soft)"],
  "Research Automation": ["var(--purple)", "var(--purple-soft)"],
  "Learning Dynamics": ["var(--teal)", "var(--teal-soft)"],
  "Finance & Business": ["var(--amber)", "var(--amber-soft)"],
};

function formatAuthors(authors) {
  if (authors.length <= 4) return authors.join(", ");
  return authors.slice(0, 3).join(", ") + `, et al. (${authors.length} authors)`;
}

function formatDate(iso) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function PaperCard({ paper }) {
  const [showAbstract, setShowAbstract] = useState(false);

  return (
    <article className="paper-card">
      <div className="paper-top">
        <span className="paper-nick">{paper.nickname}</span>
        <span className="paper-meta">
          <span>{formatDate(paper.published)}</span>
          <span className="cite-badge">
            {paper.citations} citation{paper.citations === 1 ? "" : "s"}
          </span>
          <span>arXiv:{paper.id}</span>
        </span>
      </div>
      <h3 className="paper-title">
        <a href={paper.arxiv} target="_blank" rel="noreferrer">
          {paper.title}
        </a>
      </h3>
      <p className="paper-authors">{formatAuthors(paper.authors)}</p>
      <div className="paper-tags">
        {paper.tags.map((tag) => {
          const [ink, bg] = TAG_COLORS[tag] ?? [];
          return (
            <span key={tag} className="tag" style={{ "--tag-ink": ink, "--tag-bg": bg }}>
              {tag}
            </span>
          );
        })}
      </div>
      <div className="paper-links">
        <a href={paper.arxiv} target="_blank" rel="noreferrer">
          arXiv
        </a>
        <a href={paper.pdf} target="_blank" rel="noreferrer">
          PDF
        </a>
        <button className="abstract-toggle" onClick={() => setShowAbstract((v) => !v)}>
          {showAbstract ? "Hide abstract ▴" : "Show abstract ▾"}
        </button>
      </div>
      {showAbstract && <p className="paper-abstract">{paper.abstract}</p>}
    </article>
  );
}
