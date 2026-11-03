import { useEffect, useState } from "react";
import { methodFilterDimensions } from "../data/methodTaxonomy.js";
import { localizeMethodDimensions, localizeMethodValue } from "../data/methodTaxonomyZh.js";
import { leafArtifacts } from "../data/artifactTaxonomy.js";
import { filterDimensions } from "../data/paperTaxonomy.js";
import { localizeFilterDimensions } from "../data/taxonomyZh.js";
import { bibtex, citationNeighbors, entryHref, entryTitle, findEntry, similarEntries } from "../lib/catalog.js";
import { appCopy, detailCopy, methodCardCopy, systemCardCopy, tagLabelsZh } from "../i18n.js";
import { TAG_COLORS } from "../lib/tagColors.js";
import { TAB_PATHS, filterPath, graphPath } from "../lib/navigation.js";

const ABSTRACT_SUMMARY = "Abstract summary: ";
// Long relation lists, such as the papers citing DGM, start collapsed to this many entries.
const LIST_PREVIEW = 8;

function formatDate(iso, lang) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatAuthors(entry, lang) {
  const names = entry.authors.join(", ");
  if (entry.authorCount <= entry.authors.length) return names;
  const total = methodCardCopy[lang].authors(entry.authorCount);
  return lang === "zh" ? `${names} 等（${total}）` : `${names}, et al. (${total})`;
}

// The BibTeX record, with a copy button that confirms for a moment.
function BibtexBlock({ record, copy }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);
  return (
    <div className="detail-bibtex">
      <pre>{record}</pre>
      <button type="button" onClick={() => navigator.clipboard.writeText(record).then(() => setCopied(true))}>
        {copied ? copy.copied : copy.copyBibtex}
      </button>
    </div>
  );
}

// Each label links to its list filtered by that label.
function profileRows(entry, lang) {
  if (entry.kind === "benchmark") {
    return localizeFilterDimensions(filterDimensions, lang).map((dimension) => {
      const labels = Object.fromEntries(dimension.options.map((option) => [option.value, option.label]));
      return {
        id: dimension.id,
        label: dimension.label,
        values: entry.facets[dimension.id].map((value) => ({ value, label: labels[value] })),
      };
    });
  }
  return localizeMethodDimensions(methodFilterDimensions, lang).map((dimension) => ({
    id: dimension.id,
    label: dimension.label,
    values: entry.facets[dimension.id].map((value) => ({ value, label: localizeMethodValue(dimension.id, value, lang) })),
  }));
}

function EntryList({ title, entries, copy }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? entries : entries.slice(0, LIST_PREVIEW);
  return (
    <section className="detail-related">
      <h2>{title}<span>{entries.length}</span></h2>
      {entries.length === 0 ? <p className="detail-empty">{copy.noCitations}</p> : (
        <ul>
          {shown.map((entry) => (
            <li key={entry.id}>
              <a href={entryHref(entry)}>
                <b>{entry.nickname}</b>
                <span>{entry.title}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      {entries.length > LIST_PREVIEW && (
        <button className="abstract-toggle" type="button" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>
          {expanded ? copy.showFewer : copy.showAll(entries.length)}
        </button>
      )}
    </section>
  );
}

export default function PaperDetail({ collection, id, lang }) {
  const entry = findEntry(collection, id);
  const copy = detailCopy[lang];
  const [showBibtex, setShowBibtex] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const listLabel = appCopy[lang].tabs[collection === "methods" ? "methods" : "papers"];

  useEffect(() => {
    setShowBibtex(false);
    setShowOriginal(false);
    if (!entry) return undefined;
    document.title = `${entryTitle(entry)} — Awesome RSI`;
    return () => {
      document.title = appCopy[lang].pageTitle;
    };
  }, [entry, lang]);

  const back = <a className="detail-back" href={TAB_PATHS[collection === "methods" ? "methods" : "papers"]}>← {listLabel}</a>;
  if (!entry) {
    return (
      <article className="detail">
        {back}
        <p className="detail-empty">{copy.notFound}</p>
      </article>
    );
  }

  const { references, citedBy } = citationNeighbors(entry);
  const record = bibtex(entry);
  const isSummary = entry.abstract?.startsWith(ABSTRACT_SUMMARY);
  const abstract = isSummary ? entry.abstract.slice(ABSTRACT_SUMMARY.length) : entry.abstract;
  const translated = lang === "zh" && entry.abstractZh;
  const graphHref = entry.kind === "system" ? null : graphPath(entry.kind === "method" ? "methods" : "benchmark", entry.id);
  const status = entry.kind === "system"
    ? systemCardCopy[lang].researchPreview
    : entry.kind === "method" ? methodCardCopy[lang][entry.status === "accepted" ? "accepted" : "preprint"] : null;

  return (
    <article className="detail">
      {back}
      <header className="detail-head">
        <div className="detail-meta">
          <span className="paper-nick">{entry.nickname}</span>
          {status && <span className={`method-status is-${entry.kind === "system" ? "system" : entry.status}`}>{status}</span>}
          {entry.venue && <span>{entry.kind === "system" ? entry.version : entry.venue}</span>}
          <span>{formatDate(entry.published, lang)}</span>
          {entry.arxiv && <span>arXiv:{entry.id}</span>}
          {entry.kind === "benchmark" && <span>{copy.citations(entry.citations)}</span>}
        </div>
        <h1>{entry.title}</h1>
        {entry.kind === "system"
          ? <p className="detail-authors"><strong>{copy.maintainers}</strong> {entry.maintainers}</p>
          : <p className="detail-authors">{formatAuthors(entry, lang)}</p>}
        {entry.institutions && (
          <p className="detail-institutions">{entry.institutions.join(" · ")}</p>
        )}
        <div className="detail-tags">
          {entry.kind === "benchmark"
            ? entry.tags.map((tag) => {
              const [ink, bg] = TAG_COLORS[tag];
              return <span className="tag" style={{ "--tag-ink": ink, "--tag-bg": bg }} key={tag}>{lang === "zh" ? tagLabelsZh[tag] : tag}</span>;
            })
            : leafArtifacts(entry.facets.artifact).map((value) => (
              <a className="tag" href={filterPath(collection, "artifact", value)} key={value}>{localizeMethodValue("artifact", value, lang)}</a>
            ))}
        </div>
        <div className="detail-actions">
          {entry.arxiv && <a className="detail-action is-primary" href={entry.arxiv} target="_blank" rel="noreferrer">arXiv</a>}
          {entry.pdf && <a className="detail-action" href={entry.pdf} target="_blank" rel="noreferrer">{entry.arxiv ? "PDF" : copy.paper}</a>}
          {entry.links?.map((link) => (
            <a className="detail-action" href={link.url} target="_blank" rel="noreferrer" key={link.url}>{lang === "zh" ? link.labelZh : link.label}</a>
          ))}
          {record && (
            <button className="detail-action" type="button" aria-expanded={showBibtex} onClick={() => setShowBibtex((value) => !value)}>
              {copy.bibtex}
            </button>
          )}
          {graphHref && <a className="detail-action" href={graphHref}>{copy.graph}</a>}
        </div>
        {showBibtex && <BibtexBlock record={record} copy={copy} />}
      </header>

      <div className="detail-grid">
        <div className="detail-main">
          {entry.kind !== "benchmark" && (
            <section>
              <h2>{copy.summary}</h2>
              <p className="detail-summary">{lang === "zh" ? entry.summaryZh : entry.summary}</p>
            </section>
          )}
          {abstract && (
            <section>
              <h2>{isSummary ? copy.abstractSummary : copy.abstract}</h2>
              <p className="detail-abstract">{translated ? entry.abstractZh : abstract}</p>
              {translated && (
                <>
                  <button className="abstract-toggle" type="button" aria-expanded={showOriginal} onClick={() => setShowOriginal((value) => !value)}>
                    {showOriginal ? copy.hideOriginal : copy.showOriginal}
                  </button>
                  {showOriginal && <p className="detail-abstract" lang="en">{abstract}</p>}
                </>
              )}
            </section>
          )}
          <section>
            <h2>{entry.kind === "benchmark" ? copy.benchmarkProfile : copy.profile}</h2>
            <div className="taxonomy-profile">
              {profileRows(entry, lang).map((row) => (
                <div className="taxonomy-profile-row" key={row.id}>
                  <strong>{row.label}</strong>
                  <div>
                    {row.values.map(({ value, label }) => (
                      <a href={filterPath(collection, row.id, value)} key={value}>{label}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="detail-side">
          {entry.kind !== "system" && (
            <>
              <EntryList title={copy.references} entries={references} copy={copy} key={`references-${entry.id}`} />
              <EntryList title={copy.citedBy} entries={citedBy} copy={copy} key={`cited-${entry.id}`} />
            </>
          )}
          <EntryList title={copy.similar[collection]} entries={similarEntries(entry)} copy={copy} key={`similar-${entry.id}`} />
        </aside>
      </div>
    </article>
  );
}
