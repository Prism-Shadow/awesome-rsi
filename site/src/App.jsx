import { useEffect, useState } from "react";
import { papers } from "./data/papers.js";
import PapersTab from "./components/PapersTab.jsx";
import ResourcesTab from "./components/ResourcesTab.jsx";

const REPO_URL = "https://github.com/Prism-Shadow/awesome-rsi";

function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") ?? "light",
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("awesome-rsi-theme", theme);
    } catch {}
  }, [theme]);
  return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))];
}

export default function App() {
  const [tab, setTab] = useState("papers");
  const [theme, toggleTheme] = useTheme();

  const totalCitations = papers.reduce((sum, p) => sum + p.citations, 0);
  const topicCount = new Set(papers.flatMap((p) => p.tags)).size;

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#">
            <span className="brand-mark">[RSI]</span> Awesome Recursive Self-Improvement
          </a>
          <div className="header-actions">
            <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? "☀ Light" : "☾ Dark"}
            </button>
            <a className="icon-btn" href={REPO_URL} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h1>
            A curated map of <em>Recursive Self-Improvement</em> research
          </h1>
          <p>
            Papers, books, and courses on agents that learn from their own experience — self-evolution,
            skill learning, memory, continual learning, and automated AI research. Filter by topic,
            search, and sort by recency or influence.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <b>{papers.length}</b>
              <span>Papers</span>
            </div>
            <div className="hero-stat">
              <b>{topicCount}</b>
              <span>Topics</span>
            </div>
            <div className="hero-stat">
              <b>{totalCitations}</b>
              <span>Citations</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container">
        <nav className="tabs" role="tablist">
          <button
            className={`tab${tab === "papers" ? " is-active" : ""}`}
            role="tab"
            aria-selected={tab === "papers"}
            onClick={() => setTab("papers")}
          >
            Paper List
          </button>
          <button
            className={`tab${tab === "resources" ? " is-active" : ""}`}
            role="tab"
            aria-selected={tab === "resources"}
            onClick={() => setTab("resources")}
          >
            Books &amp; Courses
          </button>
        </nav>
        {tab === "papers" ? <PapersTab /> : <ResourcesTab />}
      </main>

      <footer className="site-footer">
        <div className="container">
          Maintained as part of <a href={REPO_URL}>awesome-rsi</a>. Paper metadata from arXiv;
          citation counts from Semantic Scholar. Contributions welcome — open a PR to add a paper.
        </div>
      </footer>
    </>
  );
}
