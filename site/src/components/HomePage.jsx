import { useMemo } from "react";
import { methods } from "../data/methods.js";
import { systems } from "../data/systems.js";
import { papers } from "../data/papers.js";
import { methodCitationEdges } from "../data/methodCitationGraph.js";
import { blogPosts } from "../data/blogPosts.js";
import { blogPostsZh } from "../data/blogPosts.zh.js";
import { buildLayout } from "../lib/citationLayout.js";
import { recentlyAdded } from "../lib/recentlyAdded.js";
import { homeCopy, localizedValue } from "../i18n.js";
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
// Hubs on the far left sit under the headline, so they stay unlabeled.
const labeledHubs = hubNodes.filter((node) => node.x > 200);

function formatDate(value, lang) {
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
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
        {labeledHubs.map((node) => (
          <text x={node.x} y={node.y + node.radius * 0.55 + 14} textAnchor="middle" key={node.id}>
            {node.nickname}
          </text>
        ))}
      </g>
    </svg>
  );
}

function HomeHero({ copy }) {
  const stats = [
    [methods.length, copy.stats.methods, "#methods"],
    [systems.length, copy.stats.systems, "#methods"],
    [papers.length, copy.stats.benchmarks, "#benchmarks"],
    [methodCitationEdges.length, copy.stats.citations, "#graph-methods"],
  ];
  const { before, keep, gap, emphasis, after } = copy.title;
  return (
    <section className="home-hero">
      <CitationNetwork />
      <div className="container">
        <div className="home-hero-copy">
          <h1>{before}<span>{keep}</span>{gap}<em>{emphasis}</em>{after}</h1>
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
  return (
    <section className="home-block" id="recently-added" aria-labelledby="recently-added-title">
      <div className="section-head">
        <h2 id="recently-added-title">{copy.recentTitle}</h2>
        <p>
          <a href="#methods">{copy.allMethods} →</a>
          <a href="#benchmarks">{copy.allBenchmarks} →</a>
        </p>
      </div>
      <ol className="entry-list">
        {entries.map((entry) => (
          <li className={`entry entry--${entry.kind}`} key={`${entry.kind}-${entry.id}`}>
            <div className="entry-meta">
              <span>{copy.kinds[entry.kind]}</span>
              <time dateTime={entry.added}>{formatDate(entry.added, lang)}</time>
            </div>
            <h3><a href={entry.url} target="_blank" rel="noreferrer">{entry.title}</a></h3>
            <p>{localizedValue(entry, "summary", lang)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function FromTheBlog({ copy, lang }) {
  const posts = lang === "zh" ? blogPostsZh : blogPosts;
  return (
    <section className="home-block" aria-labelledby="blog-title">
      <div className="section-head">
        <h2 id="blog-title">{copy.blogTitle}</h2>
        <p><a href="#blog">{copy.allPosts} →</a></p>
      </div>
      <ol className="entry-list entry-list--posts">
        {posts.map((post) => (
          <li className="entry" key={post.id}>
            <div className="entry-meta">
              <span>{post.kind}</span>
              <time dateTime={post.published}>{formatDate(post.published, lang)}</time>
            </div>
            <h3><a href={`#blog/${encodeURIComponent(post.id)}`}>{post.title}</a></h3>
            <p>{post.summary}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function HomePage({ lang }) {
  const copy = homeCopy[lang];
  return (
    <>
      <HomeHero copy={copy} />
      <div className="container">
        <div className="home-column">
          <RecentlyAdded copy={copy} lang={lang} />
          <section className="home-block" aria-labelledby="survey-title">
            <SurveyFeature lang={lang} />
          </section>
          <FromTheBlog copy={copy} lang={lang} />
        </div>
      </div>
    </>
  );
}
