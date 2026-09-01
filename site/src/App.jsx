import { useEffect, useState } from "react";
import BlogTab from "./components/BlogTab.jsx";
import PapersTab from "./components/PapersTab.jsx";
import MethodsTab from "./components/MethodsTab.jsx";
import GraphTab from "./components/GraphTab.jsx";
import ResourcesTab from "./components/ResourcesTab.jsx";
import { appCopy, getInitialLanguage } from "./i18n.js";

const REPO_URL = "https://github.com/Prism-Shadow/awesome-rsi";
const TAB_HASHES = { blog: "#blog", resources: "#resources", methods: "#methods", graph: "#graph-benchmark", papers: "" };

function tabFromHash() {
  if (window.location.hash.startsWith("#blog")) return "blog";
  if (window.location.hash === "#resources") return "resources";
  if (window.location.hash.startsWith("#graph") || window.location.hash === "#methods-graph") return "graph";
  if (window.location.hash.startsWith("#methods")) return "methods";
  return "papers";
}

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

function useLanguage() {
  const [lang, setLang] = useState(getInitialLanguage);
  useEffect(() => {
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh-Hans" : "en");
    try {
      localStorage.setItem("awesome-rsi-lang", lang);
    } catch {}
  }, [lang]);
  return [lang, setLang];
}

export default function App() {
  const [tab, setTab] = useState(tabFromHash);
  const [theme, toggleTheme] = useTheme();
  const [lang, setLang] = useLanguage();
  const copy = appCopy[lang];

  useEffect(() => {
    document.title = copy.pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", copy.pageDescription);
  }, [copy]);

  useEffect(() => {
    const syncTab = () => setTab(tabFromHash());
    window.addEventListener("hashchange", syncTab);
    return () => window.removeEventListener("hashchange", syncTab);
  }, []);

  const selectTab = (nextTab) => {
    const nextHash = TAB_HASHES[nextTab];
    const nextUrl = nextHash || `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(null, "", nextUrl);
    window.dispatchEvent(new Event("hashchange"));
    setTab(nextTab);
  };

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#">
            <span className="brand-full">Awesome Recursive Self-Improvement</span>
            <span className="brand-short">Awesome RSI</span>
          </a>
          <div className="header-actions">
            <div className="lang-segment" role="group" aria-label={copy.language}>
              {(["en", "zh"]).map((option) => (
                <button
                  type="button"
                  className={`lang-choice${lang === option ? " is-active" : ""}`}
                  aria-label={option === "en" ? copy.english : copy.chinese}
                  aria-pressed={lang === option}
                  onClick={() => setLang(option)}
                  key={option}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>
            <button className="icon-btn" onClick={toggleTheme} aria-label={copy.themeToggle}>
              {theme === "dark" ? "☀" : "☾"}
              <span className="icon-btn-label">{theme === "dark" ? copy.light : copy.dark}</span>
            </button>
            <a className="icon-btn" href={REPO_URL} target="_blank" rel="noreferrer">
              <span className="icon-btn-label">GitHub</span> ↗
            </a>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h1>
            {copy.heroTitleBefore}<em>{copy.heroTitleEmphasis}</em>{copy.heroTitleAfter}
          </h1>
          <p>{copy.heroBody}</p>
        </div>
      </section>

      <main className="container">
        <nav className="tabs" role="tablist">
          <button
            className={`tab${tab === "blog" ? " is-active" : ""}`}
            role="tab"
            id="tab-blog"
            aria-controls="panel-blog"
            aria-selected={tab === "blog"}
            onClick={() => selectTab("blog")}
          >
            {copy.tabs.blog}
          </button>
          <button
            className={`tab${tab === "papers" ? " is-active" : ""}`}
            role="tab"
            id="tab-benchmark-papers"
            aria-controls="panel-benchmark-papers"
            aria-selected={tab === "papers"}
            onClick={() => selectTab("papers")}
          >
            {copy.tabs.papers}
          </button>
          <button
            className={`tab${tab === "methods" ? " is-active" : ""}`}
            role="tab"
            id="tab-methods"
            aria-controls="panel-methods"
            aria-selected={tab === "methods"}
            onClick={() => selectTab("methods")}
          >
            {copy.tabs.methods}
          </button>
          <button
            className={`tab${tab === "graph" ? " is-active" : ""}`}
            role="tab"
            id="tab-graph"
            aria-controls="panel-graph"
            aria-selected={tab === "graph"}
            onClick={() => selectTab("graph")}
          >
            {copy.tabs.graph}
          </button>
          <button
            className={`tab${tab === "resources" ? " is-active" : ""}`}
            role="tab"
            id="tab-resources"
            aria-controls="panel-resources"
            aria-selected={tab === "resources"}
            onClick={() => selectTab("resources")}
          >
            {copy.tabs.resources}
          </button>
        </nav>
        <div
          id={`panel-${tab === "papers" ? "benchmark-papers" : tab}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab === "papers" ? "benchmark-papers" : tab}`}
        >
          {tab === "blog"
            ? <BlogTab lang={lang} />
            : tab === "papers"
              ? <PapersTab lang={lang} />
              : tab === "methods"
                ? <MethodsTab lang={lang} />
                : tab === "graph"
                  ? <GraphTab lang={lang} />
                  : <ResourcesTab lang={lang} />}
        </div>
      </main>

      <footer className="site-footer">
        <div className="container">
          {copy.footerBefore}<a href={REPO_URL}>awesome-rsi</a>{copy.footerAfter}
        </div>
      </footer>
    </>
  );
}
