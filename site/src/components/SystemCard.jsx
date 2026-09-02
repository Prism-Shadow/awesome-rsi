import { useState } from "react";
import { methodFilterDimensions } from "../data/methodTaxonomy.js";
import { localizeMethodDimensions, localizeMethodValue } from "../data/methodTaxonomyZh.js";
import { systemCardCopy } from "../i18n.js";

function formatDate(iso, lang) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function SystemCard({ system, lang }) {
  const [showProfile, setShowProfile] = useState(false);
  const copy = systemCardCopy[lang];
  const dimensions = localizeMethodDimensions(methodFilterDimensions, lang);
  const summary = lang === "zh" ? system.summaryZh : system.summary;

  return (
    <article className="paper-card method-card system-card">
      <div className="paper-top">
        <span className="paper-nick">{system.nickname}</span>
        <span className="method-status is-system">{copy.researchPreview}</span>
        <span className="paper-meta">
          <span>{system.version}</span>
          <span>{formatDate(system.released, lang)}</span>
        </span>
      </div>
      <h3 className="paper-title">
        <a href={system.links[0].url} target="_blank" rel="noreferrer">{system.title}</a>
      </h3>
      <p className="paper-authors system-maintainers">
        <strong>{copy.maintainers}</strong> {system.maintainers}
      </p>
      <p className="method-summary">{summary}</p>
      <div className="method-artifacts" aria-label={dimensions.find(({ id }) => id === "artifact")?.label}>
        {system.taxonomy.artifact.map((value) => (
          <span className="tag" key={value}>{localizeMethodValue("artifact", value, lang)}</span>
        ))}
      </div>
      <div className="paper-links">
        {system.links.map((link) => (
          <a href={link.url} target="_blank" rel="noreferrer" key={link.url}>
            {lang === "zh" ? link.labelZh : link.label}
          </a>
        ))}
        <button
          className="abstract-toggle"
          type="button"
          aria-expanded={showProfile}
          onClick={() => setShowProfile((value) => !value)}
        >
          {showProfile ? copy.hideProfile : copy.showProfile}
        </button>
      </div>
      {showProfile && (
        <section className="taxonomy-profile" aria-label={copy.profileLabel}>
          {dimensions.map((dimension) => (
            <div className="taxonomy-profile-row" key={dimension.id}>
              <strong>{dimension.label}</strong>
              <div>
                {system.taxonomy[dimension.id].map((value) => (
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
