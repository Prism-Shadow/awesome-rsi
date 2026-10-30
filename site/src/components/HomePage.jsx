import { useMemo } from "react";
import { methods } from "../data/methods.js";
import { systems } from "../data/systems.js";
import { papers } from "../data/papers.js";
import { methodCitationEdges } from "../data/methodCitationGraph.js";
import { methodFilterDimensions } from "../data/methodTaxonomy.js";
import { filterDimensions } from "../data/paperTaxonomy.js";
import { localizeMethodDimensions } from "../data/methodTaxonomyZh.js";
import { localizeFilterDimensions } from "../data/taxonomyZh.js";
import { blogPosts } from "../data/blogPosts.js";
import { blogPostsZh } from "../data/blogPosts.zh.js";
import { buildLayout } from "../lib/citationLayout.js";
import { blogCover } from "../lib/blogMarkdown.js";
import { recentlyAdded } from "../lib/recentlyAdded.js";
import { homeCopy } from "../i18n.js";
import BrandMark from "./BrandMark.jsx";
import SurveyFeature from "./SurveyFeature.jsx";

// The method citation network, laid out once with the same layout as the Citation Graph page.
const citedBy = new Map();
for (const edge of methodCitationEdges) citedBy.set(edge.target, (citedBy.get(edge.target) ?? 0) + 1);
const networkNodes = [...buildLayout(
  methods,
  methodCitationEdges,
  (paper) => citedBy.get(paper.id) ?? 0,
  { height: 620, spacious: true },
).values()];
const nodesById = new Map(networkNodes.map((node) => [node.id, node]));
const networkLinks = methodCitationEdges
  .filter((edge) => nodesById.has(edge.source) && nodesById.has(edge.target))
  .map((edge) => [nodesById.get(edge.source), nodesById.get(edge.target)]);
const hubNodes = [...networkNodes].sort((a, b) => b.radius - a.radius).slice(0, 12);
const hubIds = new Set(hubNodes.map((node) => node.id));

function formatDate(value, lang, options) {
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en", { ...options, timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`));
}

function CitationNetwork() {
  return (
    <svg className="home-hero-network" viewBox="0 20 920 560" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
      <g className="network-links">
        {networkLinks.map(([source, target]) => (
          <line key={`${source.id}-${target.id}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} />
        ))}
      </g>
      <g className="network-nodes">
        {networkNodes.map((node) => (
          <circle
            className={hubIds.has(node.id) ? "is-hub" : undefined}
            cx={node.x}
            cy={node.y}
            r={node.radius * 0.55}
            key={node.id}
          />
        ))}
      </g>
      <g className="network-labels">
        {hubNodes.map((node) => (
          <text x={node.x} y={node.y + node.radius * 0.55 + 14} textAnchor="middle" key={node.id}>
            {node.nickname}
          </text>
        ))}
      </g>
    </svg>
  );
}

// Methods and systems list the artifacts they update; benchmarks list how experience arrives.
function useEntryTags(lang) {
  return useMemo(() => {
    const artifact = localizeMethodDimensions(methodFilterDimensions, lang).find(({ id }) => id === "artifact").options;
    const mode = localizeFilterDimensions(filterDimensions, lang).find(({ id }) => id === "mode").options;
    const modeLabel = (value) => mode.find((option) => option.value === value)?.label ?? value;
    const modeParent = (value) => mode.find((option) => option.value === value)?.parent;
    return (entry) => {
      if (entry.kind === "benchmark") {
        return entry.mode.filter((value) => !modeParent(value)).map((value) => {
          const children = entry.mode.filter((child) => modeParent(child) === value);
          return children.length ? `${modeLabel(value)} · ${children.map(modeLabel).join(", ")}` : modeLabel(value);
        });
      }
      const options = artifact.filter(({ value }) => entry.artifact.includes(value));
      const parents = new Set(options.map(({ parent }) => parent).filter(Boolean));
      return options.filter(({ value }) => !parents.has(value)).slice(0, 3).map(({ label }) => label);
    };
  }, [lang]);
}

function entryLink(entry, copy) {
  if (entry.kind === "system") return copy.linkLabels.github;
  const arxivId = entry.url.match(/arxiv\.org\/(?:abs|pdf)\/([^/?#]+)/)?.[1];
  return arxivId ?? copy.linkLabels.paper;
}

function HomeHero({ copy }) {
  const stats = [
    [methods.length, copy.stats.methods, "#methods"],
    [systems.length, copy.stats.systems, "#methods"],
    [papers.length, copy.stats.benchmarks, "#benchmarks"],
    [methodCitationEdges.length, copy.stats.citations, "#graph-methods"],
  ];
  return (
    <section className="home-hero">
      <CitationNetwork />
      <div className="container">
        <div className="home-hero-copy">
          <h1><span>{copy.titleBefore}</span>{copy.titleGap}<em>{copy.titleEmphasis}</em>{copy.titleAfter}</h1>
          <p className="home-lede">
            {copy.lede} <a href="#blog/understanding-rsi">{copy.guide}</a>
          </p>
          <div className="home-stats">
            {stats.map(([count, label, href]) => (
              <a href={href} key={label}>
                <b>{count}</b>
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RecentlyAdded({ copy, lang }) {
  const entries = useMemo(() => recentlyAdded(undefined, 8).flatMap((day) => day.entries), []);
  const tagsFor = useEntryTags(lang);
  return (
    <section className="home-section" id="recently-added" aria-labelledby="recently-added-title">
      <div className="container">
        <div className="section-head">
          <h2 id="recently-added-title">{copy.recentTitle}</h2>
          <p>
            {copy.updated(formatDate(entries[0].added, lang, { month: "short", day: "numeric" }))}
            {" · "}<a href="#methods">{copy.allMethods} →</a>
            {" · "}<a href="#benchmarks">{copy.allBenchmarks} →</a>
          </p>
        </div>
        <table className="recent-table">
          <thead>
            <tr>{copy.columns.map((label) => <th scope="col" key={label}>{label}</th>)}</tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr className={`recent-row recent-row--${entry.kind}`} key={`${entry.kind}-${entry.id}`}>
                <td className="recent-date">
                  <time dateTime={entry.added}>{formatDate(entry.added, lang, { month: "short", day: "numeric" })}</time>
                </td>
                <td className="recent-name">
                  <a href={entry.url} target="_blank" rel="noreferrer">{entry.nickname}</a>
                  {entry.kind === "method" ? null : <span className="recent-kind">{copy.kinds[entry.kind]}</span>}
                </td>
                <td className="recent-title">{entry.title.replace(/^[^:]+:\s*/, "")}</td>
                <td className="recent-tags">
                  {tagsFor(entry).map((tag) => <span key={tag}>{tag}</span>)}
                </td>
                <td className="recent-link">
                  <a href={entry.url} target="_blank" rel="noreferrer">{entryLink(entry, copy)}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FromTheBlog({ copy, lang }) {
  const [lead, ...rest] = lang === "zh" ? blogPostsZh : blogPosts;
  const meta = (post) => (
    <span className="post-meta">
      <span>{post.kind}</span>
      <time dateTime={post.published}>
        {formatDate(post.published, lang, { year: "numeric", month: "long", day: "numeric" })}
      </time>
    </span>
  );
  const cover = (post) => {
    const src = blogCover(post);
    return (
      <span className={`post-cover${src ? "" : " post-cover--mark"}`}>
        {src ? <img src={src} alt="" loading="lazy" decoding="async" /> : <BrandMark />}
      </span>
    );
  };
  return (
    <section className="home-section" aria-labelledby="blog-title">
      <div className="container">
        <div className="section-head">
          <h2 id="blog-title">{copy.blogTitle}</h2>
          <p><a href="#blog">{copy.allPosts} →</a></p>
        </div>
        <div className="magazine">
          <a className="magazine-lead" href={`#blog/${encodeURIComponent(lead.id)}`}>
            {cover(lead)}
            {meta(lead)}
            <h3>{lead.title}</h3>
            <p>{lead.summary}</p>
          </a>
          <div className="magazine-side">
            {rest.map((post) => (
              <a className="magazine-post" href={`#blog/${encodeURIComponent(post.id)}`} key={post.id}>
                <span>
                  {meta(post)}
                  <h3>{post.title}</h3>
                  <span className="magazine-summary">{post.summary}</span>
                </span>
                {cover(post)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage({ lang }) {
  const copy = homeCopy[lang];
  return (
    <>
      <HomeHero copy={copy} />
      <RecentlyAdded copy={copy} lang={lang} />
      <section className="survey-band">
        <div className="container">
          <SurveyFeature lang={lang} />
        </div>
      </section>
      <FromTheBlog copy={copy} lang={lang} />
    </>
  );
}
