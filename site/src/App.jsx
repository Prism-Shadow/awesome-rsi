import { useEffect, useState } from "react";
import { papers } from "./data/papers.js";
import PapersTab from "./components/PapersTab.jsx";
import MethodsTab from "./components/MethodsTab.jsx";
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

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#">
            <span className="brand-full">Awesome Recursive Self-Improvement</span>
            <span className="brand-short">Awesome RSI</span>
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
        </div>
      </section>

      <main className="container">
        <nav className="tabs" role="tablist">
          <button
            className={`tab${tab === "papers" ? " is-active" : ""}`}
            role="tab"
            id="tab-benchmark-papers"
            aria-controls="panel-benchmark-papers"
            aria-selected={tab === "papers"}
            onClick={() => setTab("papers")}
          >
            Benchmark Paper List
          </button>
          <button
            className={`tab${tab === "methods" ? " is-active" : ""}`}
            role="tab"
            id="tab-methods"
            aria-controls="panel-methods"
            aria-selected={tab === "methods"}
            onClick={() => setTab("methods")}
          >
            Methods &amp; Systems
          </button>
          <button
            className={`tab${tab === "resources" ? " is-active" : ""}`}
            role="tab"
            id="tab-resources"
            aria-controls="panel-resources"
            aria-selected={tab === "resources"}
            onClick={() => setTab("resources")}
          >
            Books &amp; Courses
          </button>
        </nav>
        <div
          id={`panel-${tab === "papers" ? "benchmark-papers" : tab}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab === "papers" ? "benchmark-papers" : tab}`}
        >
          {tab === "papers" ? <PapersTab /> : tab === "methods" ? <MethodsTab /> : <ResourcesTab />}
        </div>
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
