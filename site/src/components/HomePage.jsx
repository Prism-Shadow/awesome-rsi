import { useMemo } from "react";
import { methods } from "../data/methods.js";
import { systems } from "../data/systems.js";
import { papers } from "../data/papers.js";
import { methodCitationEdges } from "../data/methodCitationGraph.js";
import { methodFilterDimensions, methodTaxonomy } from "../data/methodTaxonomy.js";
import { filterDimensions, paperTaxonomy } from "../data/paperTaxonomy.js";
import { localizeMethodDimensions } from "../data/methodTaxonomyZh.js";
import { localizeFilterDimensions } from "../data/taxonomyZh.js";
import { blogPosts } from "../data/blogPosts.js";
import { blogPostsZh } from "../data/blogPosts.zh.js";
import { buildLayout } from "../lib/citationLayout.js";
import { blogCover } from "../lib/blogMarkdown.js";
import { recentlyAdded } from "../lib/recentlyAdded.js";
import { appCopy, homeCopy } from "../i18n.js";
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
const nodesBySize = [...networkNodes].sort((a, b) => b.radius - a.radius);

const methodEntries = [
  ...methods.map((method) => methodTaxonomy[method.id]),
  ...systems.map((system) => system.taxonomy),
];
const benchmarkProfiles = papers.map((paper) => paperTaxonomy[paper.id]);
const countValue = (profiles, dimension, value) =>
  profiles.filter((profile) => profile[dimension].includes(value)).length;

function formatDate(value, lang, options) {
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en", { ...options, timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`));
}

function CitationNetwork({ className, viewBox, hubCount, nodeScale, labelGap }) {
  const hubs = new Set(nodesBySize.slice(0, hubCount).map((node) => node.id));
  return (
    <svg className={className} viewBox={viewBox} preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
      <g className="network-links">
        {networkLinks.map(([source, target]) => (
          <line key={`${source.id}-${target.id}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} />
        ))}
      </g>
      <g className="network-nodes">
        {networkNodes.map((node) => (
          <circle
            className={hubs.has(node.id) ? "is-hub" : undefined}
            cx={node.x}
            cy={node.y}
            r={node.radius * nodeScale}
            key={node.id}
          />
        ))}
      </g>
      <g className="network-labels">
        {nodesBySize.slice(0, hubCount).map((node) => (
          <text x={node.x} y={node.y + node.radius * nodeScale + labelGap} textAnchor="middle" key={node.id}>
            {node.nickname}
          </text>
        ))}
      </g>
    </svg>
  );
}

function useTagLabels(lang) {
  return useMemo(() => {
    const artifact = localizeMethodDimensions(methodFilterDimensions, lang).find(({ id }) => id === "artifact");
    const mode = localizeFilterDimensions(filterDimensions, lang).find(({ id }) => id === "mode");
    return { artifact: artifact.options, mode: mode.options };
  }, [lang]);
}

// Methods and systems list the artifacts they update; benchmarks list how experience arrives.
function entryTags(entry, labels) {
  if (entry.kind === "benchmark") {
    const label = (value) => labels.mode.find((option) => option.value === value)?.label ?? value;
    const parentOf = (value) => labels.mode.find((option) => option.value === value)?.parent;
    return entry.mode.filter((value) => !parentOf(value)).map((value) => {
      const children = entry.mode.filter((child) => parentOf(child) === value);
      return children.length ? `${label(value)} · ${children.map(label).join(", ")}` : label(value);
    });
  }
  const options = labels.artifact.filter(({ value }) => entry.artifact.includes(value));
  const parents = new Set(options.map(({ parent }) => parent).filter(Boolean));
  return options.filter(({ value }) => !parents.has(value)).slice(0, 3).map(({ label }) => label);
}

function HomeHero({ copy, lang, lastUpdated }) {
  return (
    <section className="home-hero">
      <CitationNetwork className="home-hero-network" viewBox="0 20 920 560" hubCount={12} nodeScale={0.55} labelGap={14} />
      <div className="container">
        <div className="home-hero-copy">
          <a className="update-pill" href="#recently-added">
            <span className="update-dot" aria-hidden="true" />
            {copy.updated(formatDate(lastUpdated, lang, { month: "short", day: "numeric" }))}
            <span className="update-arrow" aria-hidden="true">→</span>
          </a>
          <h1>
            {copy.titleLines(methods.length, methodCitationEdges.length).map((line) => (
              <span key={line}>{line}<br /></span>
            ))}
            <em>{copy.titleEmphasis}</em>
          </h1>
          <p className="home-lede">{copy.lede}</p>
          <div className="home-actions">
            <a className="btn btn-primary" href="#methods">{copy.browseMethods} <span aria-hidden="true">→</span></a>
            <a className="btn btn-ghost" href="#blog/understanding-rsi">{copy.guide}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function RecentlyAdded({ copy, lang }) {
  const days = useMemo(() => recentlyAdded(), []);
  const labels = useTagLabels(lang);
  return (
    <section className="home-section" id="recently-added" aria-labelledby="recently-added-title">
      <div className="container">
        <div className="section-head">
          <h2 id="recently-added-title">{copy.recentTitle}</h2>
          <div className="section-links">
            <a href="#methods">{copy.allMethods(methods.length + systems.length)} →</a>
            <a href="#benchmarks">{copy.allBenchmarks(papers.length)} →</a>
          </div>
        </div>
        <div className="feed-columns" aria-hidden="true">
          {copy.columns.map((label) => <span key={label}>{label}</span>)}
        </div>
        {days.map((day) => (
          <div className="feed-day" key={day.date}>
            <time className="feed-date" dateTime={day.date}>
              <b>{formatDate(day.date, lang, { month: "short", day: "numeric" })}</b>
              <span>{formatDate(day.date, lang, { year: "numeric" })}</span>
            </time>
            <ul className="feed-list">
              {day.entries.map((entry) => (
                <li key={`${entry.kind}-${entry.id}`}>
                  <a className="feed-row" href={entry.url} target="_blank" rel="noreferrer">
                    <span className={`feed-kind feed-kind--${entry.kind}`}>{copy.kinds[entry.kind]}</span>
                    <span className="feed-paper">
                      <strong>{entry.nickname}</strong>
                      <span>{entry.title.replace(/^[^:]+:\s*/, "")}</span>
                    </span>
                    <span className="feed-tags">
                      {entryTags(entry, labels).map((tag) => <span key={tag}>{tag}</span>)}
                    </span>
                    <time className="feed-posted" dateTime={entry.published}>
                      {formatDate(entry.published, lang, entry.published.slice(0, 4) === day.date.slice(0, 4)
                        ? { month: "short", day: "numeric" }
                        : { month: "short", year: "numeric" })}
                    </time>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function SurveyAndBlog({ copy, lang }) {
  const posts = lang === "zh" ? blogPostsZh : blogPosts;
  return (
    <section className="home-section home-section--band" aria-labelledby="writing-title">
      <div className="container">
        <div className="section-head">
          <h2 id="writing-title">{copy.writingTitle}</h2>
          <div className="section-links"><a href="#blog">{copy.allPosts} →</a></div>
        </div>
        <div className="writing-grid">
          <SurveyFeature lang={lang} />
          <div className="writing-posts">
            {posts.map((post) => {
              const cover = blogCover(post);
              return (
                <a className="writing-post" href={`#blog/${encodeURIComponent(post.id)}`} key={post.id}>
                  <span className={`post-cover${cover ? "" : " post-cover--mark"}`}>
                    {cover ? <img src={cover} alt="" loading="lazy" decoding="async" /> : <BrandMark />}
                  </span>
                  <span className="writing-post-text">
                    <span className="post-meta">
                      <span>{post.kind}</span>
                      <time dateTime={post.published}>
                        {formatDate(post.published, lang, { year: "numeric", month: "short", day: "numeric" })}
                      </time>
                    </span>
                    <h3>{post.title}</h3>
                    <span className="writing-post-summary">{post.summary}</span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function DistributionRow({ label, count, total, child }) {
  return (
    <div className={`distribution-row${child ? " is-child" : ""}`}>
      <span>{label}</span>
      <i><em style={{ width: `${(count / total) * 100}%` }} /></i>
      <b>{count}</b>
    </div>
  );
}

function ExploreCollection({ copy, lang }) {
  const tabs = appCopy[lang].tabs;
  const labels = useTagLabels(lang);
  const works = methodEntries.length;
  const artifactRows = labels.artifact.filter(({ value }) => value !== "Non-parametric");
  const cards = [
    {
      href: "#methods",
      count: works,
      title: tabs.methods,
      ...copy.cards.methods,
      body: artifactRows.map(({ value, label }) => (
        <DistributionRow label={label} count={countValue(methodEntries, "artifact", value)} total={works} key={value} />
      )),
    },
    {
      href: "#benchmarks",
      count: papers.length,
      title: tabs.papers,
      ...copy.cards.benchmarks,
      body: labels.mode.map(({ value, label, parent }) => (
        <DistributionRow
          label={label}
          count={countValue(benchmarkProfiles, "mode", value)}
          total={papers.length}
          child={Boolean(parent)}
          key={value}
        />
      )),
    },
    {
      href: "#graph-methods",
      count: methodCitationEdges.length,
      title: tabs.graph,
      ...copy.cards.graph,
      body: <CitationNetwork className="explore-network" viewBox="-36 24 992 552" hubCount={5} nodeScale={0.6} labelGap={22} />,
    },
  ];
  return (
    <section className="home-section" aria-labelledby="explore-title">
      <div className="container">
        <div className="section-head">
          <h2 id="explore-title">{copy.exploreTitle}</h2>
        </div>
        <div className="explore-grid">
          {cards.map((card) => (
            <a className="explore-card" href={card.href} key={card.href}>
              <span className="explore-count"><b>{card.count}</b>{card.unit}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <div className="explore-visual">{card.body}</div>
              <span className="explore-go">{card.go}<span aria-hidden="true">→</span></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage({ lang }) {
  const copy = homeCopy[lang];
  const lastUpdated = useMemo(() => recentlyAdded(undefined, 1)[0].date, []);
  return (
    <>
      <HomeHero copy={copy} lang={lang} lastUpdated={lastUpdated} />
      <RecentlyAdded copy={copy} lang={lang} />
      <SurveyAndBlog copy={copy} lang={lang} />
      <ExploreCollection copy={copy} lang={lang} />
    </>
  );
}
