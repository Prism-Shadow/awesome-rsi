import { useState } from "react";
import { methodFilterDimensions, methodTaxonomy } from "../data/methodTaxonomy.js";
import { methodAbstracts } from "../data/methodAbstracts.js";
import { methodInstitutions } from "../data/methodInstitutions.js";
import { localizeMethodDimensions, localizeMethodValue } from "../data/methodTaxonomyZh.js";
import { methodCardCopy } from "../i18n.js";

function formatDate(iso, lang) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatAuthors(method, lang, copy) {
  if (method.authorCount <= method.authors.length) return method.authors.join(", ");
  return lang === "zh"
    ? `${method.authors.join(", ")} 等（${copy.authors(method.authorCount)}）`
    : `${method.authors.join(", ")}, et al. (${copy.authors(method.authorCount)})`;
}

export default function MethodCard({ method, lang }) {
  const [showAbstract, setShowAbstract] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const copy = methodCardCopy[lang];
  const facets = methodTaxonomy[method.id];
  const dimensions = localizeMethodDimensions(methodFilterDimensions, lang);
  const summary = lang === "zh" ? method.summaryZh : method.summary;

  return (
    <article className="paper-card method-card">
      <div className="paper-top">
        <span className="paper-nick">{method.nickname}</span>
        <span className={`method-status is-${method.status}`}>
          {method.status === "accepted" ? copy.accepted : copy.preprint}
        </span>
        <span className="paper-meta">
          <span>{method.venue}</span>
          <span>{formatDate(method.published, lang)}</span>
          <span>arXiv:{method.id}</span>
        </span>
      </div>
      <h3 className="paper-title">
        <a href={method.arxiv} target="_blank" rel="noreferrer">{method.title}</a>
      </h3>
      <p className="paper-authors">{formatAuthors(method, lang, copy)}</p>
      <p className="paper-institutions">
        <strong>{copy.institutions}</strong>
        <span>{methodInstitutions[method.id].join(" · ")}</span>
      </p>
      <p className="method-summary">{summary}</p>
      <div className="method-artifacts" aria-label={dimensions.find(({ id }) => id === "artifact")?.label}>
        {facets.artifact.map((value) => (
          <span className="tag" key={value}>{localizeMethodValue("artifact", value, lang)}</span>
        ))}
      </div>
      <div className="paper-links">
        <a href={method.arxiv} target="_blank" rel="noreferrer">arXiv</a>
        <button
          className="abstract-toggle"
          type="button"
          aria-expanded={showAbstract}
          onClick={() => setShowAbstract((value) => !value)}
        >
          {showAbstract ? copy.hideAbstract : copy.showAbstract}
        </button>
        <button
          className="abstract-toggle"
          type="button"
          aria-expanded={showProfile}
          onClick={() => setShowProfile((value) => !value)}
        >
          {showProfile ? copy.hideProfile : copy.showProfile}
        </button>
      </div>
      {showAbstract && <p className="paper-abstract">{methodAbstracts[method.id]}</p>}
      {showProfile && (
        <section className="taxonomy-profile" aria-label={copy.profileLabel}>
          {dimensions.map((dimension) => (
            <div className="taxonomy-profile-row" key={dimension.id}>
              <strong>{dimension.label}</strong>
              <div>
                {facets[dimension.id].map((value) => (
                  <span key={value}>{localizeMethodValue(dimension.id, value, lang)}</span>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </article>
  );
}
