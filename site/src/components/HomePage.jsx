import { useEffect, useMemo, useRef, useState } from "react";
import { methods } from "../data/methods.js";
import { systems } from "../data/systems.js";
import { papers } from "../data/papers.js";
import { methodCitationEdges } from "../data/methodCitationGraph.js";
import { blogPosts } from "../data/blogPosts.js";
import { blogPostsZh } from "../data/blogPosts.zh.js";
import { blogCover } from "../lib/blogMarkdown.js";
import { TAB_PATHS, postPath } from "../lib/navigation.js";
import { recentlyAdded } from "../lib/recentlyAdded.js";
import { homeCopy, localizedValue } from "../i18n.js";
import { heroHubIds, heroNodes as networkNodes } from "virtual:hero-network";
import { HERO_WIDTH } from "../lib/heroNetwork.js";
import BrandMark from "./BrandMark.jsx";
import SurveyFeature from "./SurveyFeature.jsx";

// The method citation network, with the most-cited papers spread evenly right of the headline.
// The layout is computed at build time (see vite.config.js).
const hubIds = new Set(heroHubIds);
const nodeIndex = new Map(networkNodes.map((node, index) => [node.id, index]));
// Each link is [citing, cited] as node indices.
const networkLinks = methodCitationEdges
  .filter((edge) => nodeIndex.has(edge.source) && nodeIndex.has(edge.target))
  .map((edge) => [nodeIndex.get(edge.source), nodeIndex.get(edge.target)]);
const linksByNode = networkNodes.map(() => []);
networkLinks.forEach(([source, target], index) => {
  linksByNode[source].push(index);
  linksByNode[target].push(index);
});
const labeledHubs = [...hubIds].map((id) => nodeIndex.get(id));
// Every node wanders along a slowly turning heading. A soft spring pulls it back toward its
// laid-out position, and link springs keep citing and cited papers near their laid-out distance,
// so neighbors move together. Larger nodes are heavier and wander less.
const WANDER = 0.11;
const TURN = 0.25;
const HOME_PULL = 0.0011;
const LINK_PULL = 0.0006;
const WALL_PULL = 0.01;
const DAMPING = 0.92;
// Random headings: ordered ones line up with the layout's own angular order and make the whole
// network visibly contract before it drifts freely.
const motion = networkNodes.map((node) => ({
  vx: 0,
  vy: 0,
  heading: Math.random() * 2 * Math.PI,
  mass: 1 + node.radius / 8,
}));
// The motion runs this many steps (about 10 s) before the first frame, so it starts mid-drift
// instead of every node setting off from rest at once. Fewer steps leave a visible outward
// spread at the start; this takes about 20 ms.
const WARMUP_STEPS = 300;
const restLengths = networkLinks.map(([source, target]) => (
  Math.hypot(networkNodes[source].x - networkNodes[target].x, networkNodes[source].y - networkNodes[target].y)
));
// A few faint pulses run from the cited paper to the paper that cites it.
const PULSE_COUNT = 4;
const PULSE_DURATION = 3000;

function formatDate(value, lang) {
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

// Current drifted positions, shared by the animation loop and the pointer handler.
const positions = new Float32Array(networkNodes.length * 2);
networkNodes.forEach((node, index) => {
  positions[index * 2] = node.x;
  positions[index * 2 + 1] = node.y;
});

// One step of the motion. The hovered node, if any, holds still so its label stays readable.
function step(focus) {
  const forces = new Float32Array(networkNodes.length * 2);
  networkNodes.forEach((node, index) => {
    const state = motion[index];
    const x = positions[index * 2];
    const y = positions[index * 2 + 1];
    state.heading += (Math.random() - 0.5) * TURN;
    // Soft walls keep nodes near the edges inside the canvas.
    forces[index * 2] = Math.cos(state.heading) * WANDER + (node.x - x) * HOME_PULL
      + (Math.max(0, 24 - x) - Math.max(0, x - (HERO_WIDTH - 24))) * WALL_PULL;
    forces[index * 2 + 1] = Math.sin(state.heading) * WANDER + (node.y - y) * HOME_PULL
      + (Math.max(0, 40 - y) - Math.max(0, y - 560)) * WALL_PULL;
  });
  networkLinks.forEach(([source, target], index) => {
    const dx = positions[target * 2] - positions[source * 2];
    const dy = positions[target * 2 + 1] - positions[source * 2 + 1];
    const distance = Math.max(Math.hypot(dx, dy), 1);
    const pull = ((distance - restLengths[index]) * LINK_PULL) / distance;
    forces[source * 2] += dx * pull;
    forces[source * 2 + 1] += dy * pull;
    forces[target * 2] -= dx * pull;
    forces[target * 2 + 1] -= dy * pull;
  });
  networkNodes.forEach((_, index) => {
    const state = motion[index];
    const damping = index === focus ? 0.6 : DAMPING;
    state.vx = (state.vx + forces[index * 2] / state.mass) * damping;
    state.vy = (state.vy + forces[index * 2 + 1] / state.mass) * damping;
    positions[index * 2] += state.vx;
    positions[index * 2 + 1] += state.vy;
  });
}

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!REDUCED_MOTION) for (let count = 0; count < WARMUP_STEPS; count += 1) step(null);

function labelY(index) {
  return positions[index * 2 + 1] + networkNodes[index].radius * 0.55 + 14;
}

// Links and nodes of the same style share one path, so a frame updates a few attributes instead of
// one per line and circle.
const allLinks = networkLinks.map((_, index) => index);

function point(index) {
  return `${positions[index * 2].toFixed(1)} ${positions[index * 2 + 1].toFixed(1)}`;
}

function linksPath(links) {
  let path = "";
  for (const index of links) path += `M${point(networkLinks[index][0])}L${point(networkLinks[index][1])}`;
  return path;
}

// Each circle is two arcs.
function nodesPath(nodes) {
  let path = "";
  for (const index of nodes) {
    const r = (networkNodes[index].radius * 0.55).toFixed(1);
    const left = (positions[index * 2] - networkNodes[index].radius * 0.55).toFixed(1);
    path += `M${left} ${positions[index * 2 + 1].toFixed(1)}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;
  }
  return path;
}

// A hovered node's links and neighbors stand out from the rest.
function neighborhood(focus) {
  if (focus === null) return { links: [], nodes: new Set() };
  return { links: linksByNode[focus], nodes: new Set([focus, ...linksByNode[focus].flatMap((link) => networkLinks[link])]) };
}

function nodeGroups(nearNodes) {
  const groups = { "": [], "is-hub": [], "is-near": [], "is-hub is-near": [] };
  networkNodes.forEach((node, index) => {
    groups[[hubIds.has(node.id) && "is-hub", nearNodes.has(index) && "is-near"].filter(Boolean).join(" ")].push(index);
  });
  return groups;
}

function CitationNetwork() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const focusRef = useRef(null);
  const [focus, setFocus] = useState(null);

  useEffect(() => {
    if (REDUCED_MOTION) return undefined;
    const svg = rootRef.current;
    const sparks = svg.querySelectorAll(".network-pulses circle");
    const pulses = [...sparks].map(() => ({ link: -1, start: 0 }));
    let frame = 0;
    let lastStep = 0;
    let nextPulse = 0;

    // The motion is slow, so the network redraws at about 30 fps.
    const draw = () => {
      const near = neighborhood(focusRef.current);
      const groups = nodeGroups(near.nodes);
      for (const path of svg.querySelectorAll("[data-links]")) {
        path.setAttribute("d", linksPath(path.dataset.links === "near" ? near.links : allLinks));
      }
      for (const path of svg.querySelectorAll("[data-nodes]")) path.setAttribute("d", nodesPath(groups[path.dataset.nodes]));
      // Labels and the focus layer follow their node.
      for (const element of svg.querySelectorAll("[data-index]")) {
        const index = Number(element.dataset.index);
        const isLabel = element.tagName === "text";
        element.setAttribute(isLabel ? "x" : "cx", positions[index * 2].toFixed(1));
        element.setAttribute(isLabel ? "y" : "cy", (isLabel ? labelY(index) : positions[index * 2 + 1]).toFixed(1));
      }
    };

    const movePulses = (time) => {
      pulses.forEach((pulse, slot) => {
        if (pulse.link < 0 && time >= nextPulse) {
          // While a node is focused, pulses only run along its own links.
          const pool = focusRef.current === null ? null : linksByNode[focusRef.current];
          if (!pool || pool.length) {
            pulse.link = pool ? pool[Math.floor(Math.random() * pool.length)] : Math.floor(Math.random() * networkLinks.length);
            pulse.start = time;
            nextPulse = time + (pool ? 300 : 900);
          }
        }
        const spark = sparks[slot];
        const progress = (time - pulse.start) / PULSE_DURATION;
        if (pulse.link < 0 || progress >= 1) {
          pulse.link = -1;
          spark.setAttribute("opacity", "0");
          return;
        }
        const [citing, cited] = networkLinks[pulse.link];
        const eased = progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2;
        spark.setAttribute("cx", (positions[cited * 2] + (positions[citing * 2] - positions[cited * 2]) * eased).toFixed(1));
        spark.setAttribute("cy", (positions[cited * 2 + 1] + (positions[citing * 2 + 1] - positions[cited * 2 + 1]) * eased).toFixed(1));
        spark.setAttribute("opacity", (Math.sin(Math.PI * progress) * 0.6).toFixed(2));
      });
    };

    const tick = (time) => {
      frame = requestAnimationFrame(tick);
      if (time - lastStep < 32) return;
      lastStep = time;
      step(focusRef.current);
      draw();
      movePulses(time);
    };

    // Pause while the hero is scrolled out of view.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !frame) frame = requestAnimationFrame(tick);
      if (!entry.isIntersecting && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    observer.observe(svg);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  // Hover is tracked over the whole hero, so a node under the headline or stats still shows its name;
  // the text above keeps its own selection and links.
  useEffect(() => {
    const hero = rootRef.current.parentElement;
    const updateFocus = (next) => {
      if (next === focusRef.current) return;
      focusRef.current = next;
      setFocus(next);
    };
    const handlePointerMove = (event) => {
      if (event.pointerType === "touch") return;
      const matrix = canvasRef.current.getScreenCTM();
      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
      const reach = 14 / matrix.a;
      let nearest = null;
      let nearestDistance = Infinity;
      networkNodes.forEach((node, index) => {
        const distance = Math.hypot(positions[index * 2] - point.x, positions[index * 2 + 1] - point.y);
        if (distance < node.radius * 0.55 + reach && distance < nearestDistance) {
          nearest = index;
          nearestDistance = distance;
        }
      });
      updateFocus(nearest);
    };
    const clearFocus = () => updateFocus(null);
    hero.addEventListener("pointermove", handlePointerMove);
    hero.addEventListener("pointerleave", clearFocus);
    return () => {
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", clearFocus);
    };
  }, []);

  const near = neighborhood(focus);
  const groups = nodeGroups(near.nodes);

  const viewBox = `0 20 ${HERO_WIDTH} 560`;
  return (
    <div ref={rootRef} className={`home-hero-network${focus === null ? "" : " has-focus"}`} aria-hidden="true">
      {/* The network fades out toward the headline. */}
      <svg ref={canvasRef} className="network-canvas" viewBox={viewBox} preserveAspectRatio="xMaxYMid meet">
        <defs>
          <linearGradient id="hero-network-fade-side" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="200" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0.12" />
            <stop offset="0.55" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
          <linearGradient id="hero-network-fade-bottom" gradientUnits="userSpaceOnUse" x1="0" y1="412" x2="0" y2="580">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="hero-network-mask-side" maskUnits="userSpaceOnUse" x="-100" y="-100" width={HERO_WIDTH + 200} height="820">
            <rect x="-100" y="-100" width={HERO_WIDTH + 200} height="820" fill="url(#hero-network-fade-side)" />
          </mask>
          <mask id="hero-network-mask-bottom" maskUnits="userSpaceOnUse" x="-100" y="-100" width={HERO_WIDTH + 200} height="820">
            <rect x="-100" y="-100" width={HERO_WIDTH + 200} height="820" fill="url(#hero-network-fade-bottom)" />
          </mask>
        </defs>
        <g className="network-graph">
          <path className="network-links" data-links="all" d={linksPath(allLinks)} />
          {focus !== null && <path className="network-links is-near" data-links="near" d={linksPath(near.links)} />}
          {Object.entries(groups).map(([style, nodes]) => (
            <path className={`network-nodes ${style}`.trim()} data-nodes={style} d={nodesPath(nodes)} key={style || "plain"} />
          ))}
          <g className="network-pulses">
            {Array.from({ length: PULSE_COUNT }, (_, slot) => (
              <circle r="2.2" opacity="0" key={slot} />
            ))}
          </g>
          <g className="network-labels">
            {labeledHubs.filter((index) => index !== focus).map((index) => (
              <text
                className={near.nodes.has(index) ? "is-near" : undefined}
                data-index={index}
                x={positions[index * 2]}
                y={labelY(index)}
                textAnchor="middle"
                key={networkNodes[index].id}
              >
                {networkNodes[index].nickname}
              </text>
            ))}
          </g>
        </g>
      </svg>
      {/* The hovered node and its name sit above the fade and the hero text. */}
      <svg className="network-overlay" viewBox={viewBox} preserveAspectRatio="xMaxYMid meet">
        {focus !== null && (
          <g className="network-focus">
            <circle data-index={focus} cx={positions[focus * 2]} cy={positions[focus * 2 + 1]} r={networkNodes[focus].radius * 0.55} />
            <text data-index={focus} x={positions[focus * 2]} y={labelY(focus)} textAnchor="middle">
              {networkNodes[focus].nickname}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

function HomeHero({ copy }) {
  const stats = [
    [methods.length, copy.stats.methods, TAB_PATHS.methods],
    [systems.length, copy.stats.systems, TAB_PATHS.methods],
    [papers.length, copy.stats.benchmarks, TAB_PATHS.papers],
    [methodCitationEdges.length, copy.stats.citations, TAB_PATHS.graph],
  ];
  const { before, keep, gap, emphasis, after } = copy.title;
  return (
    <section className="home-hero">
      <CitationNetwork />
      <div className="container">
        <div className="home-hero-copy">
          <h1>{before}<span>{keep}</span>{gap}<em>{emphasis}</em>{after}</h1>
          <p className="home-lede">{copy.lede}</p>
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
          <a href={TAB_PATHS.methods}>{copy.allMethods} →</a>
          <a href={TAB_PATHS.papers}>{copy.allBenchmarks} →</a>
        </p>
      </div>
      <ol className="entry-list">
        {entries.map((entry) => (
          <li className={`entry entry--${entry.kind}`} key={`${entry.kind}-${entry.id}`}>
            <div className="entry-meta">
              <span>{copy.kinds[entry.kind]}</span>
              <time dateTime={entry.added}>{formatDate(entry.added, lang)}</time>
            </div>
            <h3><a href={entry.href}>{entry.title}</a></h3>
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
    <section className="home-block" id="blog" aria-labelledby="blog-title">
      <div className="section-head">
        <h2 id="blog-title">{copy.blogTitle}</h2>
      </div>
      <ol className="entry-list entry-list--posts">
        {posts.map((post) => {
          const href = postPath(post.id);
          const cover = blogCover(post);
          return (
            <li className="entry entry--post" key={post.id}>
              <div className="entry-text">
                <div className="entry-meta">
                  <span>{post.kind}</span>
                  <time dateTime={post.published}>{formatDate(post.published, lang)}</time>
                </div>
                <h3><a href={href}>{post.title}</a></h3>
                <p>{post.summary}</p>
              </div>
              <span className={`entry-cover${cover ? "" : " entry-cover--mark"}`} aria-hidden="true">
                {cover ? <img src={cover} alt="" loading="lazy" decoding="async" /> : <BrandMark />}
              </span>
            </li>
          );
        })}
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
