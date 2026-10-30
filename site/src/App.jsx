import { useEffect, useRef, useState } from "react";
import HomePage from "./components/HomePage.jsx";
import BlogTab from "./components/BlogTab.jsx";
import PapersTab from "./components/PapersTab.jsx";
import MethodsTab from "./components/MethodsTab.jsx";
import GraphTab from "./components/GraphTab.jsx";
import BrandMark from "./components/BrandMark.jsx";
import { appCopy, getInitialLanguage } from "./i18n.js";
import { NAV_TABS, TAB_HASHES, tabFromHash } from "./lib/navigation.js";

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

function ThemeIcon({ theme }) {
  return theme === "dark" ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}

export default function App() {
  const [tab, setTab] = useState(() => tabFromHash(window.location.hash));
  const [theme, toggleTheme] = useTheme();
  const [lang, setLang] = useLanguage();
  const copy = appCopy[lang];
  const previousTab = useRef(tab);

  useEffect(() => {
    document.title = copy.pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", copy.pageDescription);
  }, [copy]);

  useEffect(() => {
    const syncTab = () => setTab(tabFromHash(window.location.hash));
    window.addEventListener("hashchange", syncTab);
    window.addEventListener("popstate", syncTab);
    return () => {
      window.removeEventListener("hashchange", syncTab);
      window.removeEventListener("popstate", syncTab);
    };
  }, []);

  // A hash that names a section (#recently-added, #blog) scrolls to it; other page changes start at the top.
  useEffect(() => {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) target.scrollIntoView();
    else if (previousTab.current !== tab) window.scrollTo(0, 0);
    previousTab.current = tab;
  }, [tab]);

  const hrefFor = (target) => TAB_HASHES[target] || import.meta.env.BASE_URL;
  const selectTab = (event, nextTab) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const nextUrl = TAB_HASHES[nextTab] || `${window.location.pathname}${window.location.search}`;
    window.history.pushState(null, "", nextUrl);
    window.dispatchEvent(new Event("hashchange"));
    setTab(nextTab);
  };

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href={hrefFor("home")} onClick={(event) => selectTab(event, "home")}>
            <BrandMark />
            <span>awesome <b>rsi</b></span>
          </a>
          <nav className="site-nav" aria-label={copy.navigation}>
            {NAV_TABS.map((target) => (
              <a
                href={hrefFor(target)}
                aria-current={tab === target ? "page" : undefined}
                onClick={(event) => selectTab(event, target)}
                key={target}
              >
                {copy.tabs[target]}
              </a>
            ))}
          </nav>
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
                  {option === "en" ? "EN" : "中文"}
                </button>
              ))}
            </div>
            <button className="icon-btn" onClick={toggleTheme} aria-label={copy.themeToggle}>
              <ThemeIcon theme={theme} />
            </button>
            <a className="icon-btn icon-btn--github" href={REPO_URL} target="_blank" rel="noreferrer">
              <GitHubIcon />
              <span className="icon-btn-label">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        {tab === "home" ? (
          <HomePage lang={lang} />
        ) : (
          <div className="container page-body">
            {tab === "blog"
              ? <BlogTab lang={lang} />
              : tab === "papers"
                ? <PapersTab lang={lang} />
                : tab === "methods"
                  ? <MethodsTab lang={lang} />
                  : <GraphTab lang={lang} />}
          </div>
        )}
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <a className="brand" href={hrefFor("home")} onClick={(event) => selectTab(event, "home")}>
                <BrandMark />
                <span>awesome <b>rsi</b></span>
              </a>
              <p>{copy.footerTagline}</p>
            </div>
            <div>
              <h2>{copy.footerExplore}</h2>
              <ul>
                {NAV_TABS.filter((target) => target !== "home").map((target) => (
                  <li key={target}>
                    <a href={hrefFor(target)} onClick={(event) => selectTab(event, target)}>{copy.tabs[target]}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2>{copy.footerProject}</h2>
              <ul>
                {copy.footerLinks.map(([label, path]) => (
                  <li key={label}><a href={`${REPO_URL}${path}`} target="_blank" rel="noreferrer">{label}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <p className="footer-note">{copy.footerNote}</p>
        </div>
      </footer>
    </>
  );
}
