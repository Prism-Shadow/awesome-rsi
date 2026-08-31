import { useState } from "react";
import { paperAbstractsZh } from "../data/paperAbstractsZh.js";
import { filterDimensions, paperTaxonomy } from "../data/paperTaxonomy.js";
import { paperInstitutions } from "../data/paperInstitutions.js";
import { localizeFilterDimensions } from "../data/taxonomyZh.js";
import { paperCardCopy, tagLabelsZh } from "../i18n.js";

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

function formatAuthors(authors, lang, copy) {
  if (authors.length <= 4) return authors.join(", ");
  if (lang === "zh") return `${authors.slice(0, 3).join(", ")} 等（${copy.authors(authors.length)}）`;
  return authors.slice(0, 3).join(", ") + `, et al. (${copy.authors(authors.length)})`;
}

function formatDate(iso, lang) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function PaperCard({ paper, lang }) {
  const [showAbstract, setShowAbstract] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const copy = paperCardCopy[lang];
  const abstract = lang === "zh" ? paperAbstractsZh[paper.id] ?? paper.abstract : paper.abstract;
  const dimensions = localizeFilterDimensions(filterDimensions, lang);
  const facets = paperTaxonomy[paper.id];
  const labels = Object.fromEntries(dimensions.map((dimension) => [
    dimension.id,
    {
      label: dimension.label,
      values: Object.fromEntries(dimension.options.map((option) => [option.value, option.label])),
    },
  ]));

  return (
    <article className="paper-card">
      <div className="paper-top">
        <span className="paper-nick">{paper.nickname}</span>
        <span className="paper-meta">
          <span>{formatDate(paper.published, lang)}</span>
          <span className="cite-badge">
            {copy.citations(paper.citations)}
          </span>
          <span>arXiv:{paper.id}</span>
        </span>
      </div>
      <h3 className="paper-title">
        <a href={paper.arxiv} target="_blank" rel="noreferrer">
          {paper.title}
        </a>
      </h3>
      <p className="paper-authors">{formatAuthors(paper.authors, lang, copy)}</p>
      <p className="paper-institutions">
        <strong>{copy.institutions}</strong>
        <span>{paperInstitutions[paper.id].join(" · ")}</span>
      </p>
      <div className="paper-tags">
        {paper.tags.map((tag) => {
          const [ink, bg] = TAG_COLORS[tag] ?? [];
          return (
            <span key={tag} className="tag" style={{ "--tag-ink": ink, "--tag-bg": bg }}>
              {lang === "zh" ? tagLabelsZh[tag] ?? tag : tag}
            </span>
          );
        })}
      </div>
      <div className="paper-links">
        <a href={paper.arxiv} target="_blank" rel="noreferrer">
          arXiv
        </a>
        <button className="abstract-toggle" onClick={() => setShowAbstract((v) => !v)}>
          {showAbstract ? copy.hideAbstract : copy.showAbstract}
        </button>
        <button className="abstract-toggle" onClick={() => setShowProfile((v) => !v)} aria-expanded={showProfile}>
          {showProfile ? copy.hideProfile : copy.showProfile}
        </button>
      </div>
      {showAbstract && <p className="paper-abstract">{abstract}</p>}
      {showProfile && (
        <section className="taxonomy-profile" aria-label={copy.profileLabel}>
          {dimensions.map((dimension) => (
            <div className="taxonomy-profile-row" key={dimension.id}>
              <strong>{labels[dimension.id].label}</strong>
              <div>
                {facets[dimension.id].map((value) => (
                  <span key={value}>{labels[dimension.id].values[value] ?? value}</span>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </article>
  );
}
