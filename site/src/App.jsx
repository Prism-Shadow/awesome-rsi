import { useEffect, useRef, useState } from "react";
import HomePage from "./components/HomePage.jsx";
import BlogTab from "./components/BlogTab.jsx";
import PapersTab from "./components/PapersTab.jsx";
import MethodsTab from "./components/MethodsTab.jsx";
import GraphTab from "./components/GraphTab.jsx";
import PaperDetail from "./components/PaperDetail.jsx";
import BrandMark from "./components/BrandMark.jsx";
import PageHead from "./components/PageHead.jsx";
import { appCopy, getInitialLanguage } from "./i18n.js";
import { NAV_TABS, TAB_PATHS, routeFromPath } from "./lib/navigation.js";
import { LOCATION_CHANGE, inPageLink, navigate } from "./lib/router.js";

const REPO_URL = "https://github.com/Prism-Shadow/awesome-rsi";

function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme"),
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

function readLocation() {
  const { pathname, search, hash } = window.location;
  return { pathname, search, hash };
}

function NotFound({ copy }) {
  return (
    <PageHead title={copy.notFound} description={copy.notFoundHint}>
      <a className="detail-action" href={TAB_PATHS.home}>{copy.tabs.home}</a>
    </PageHead>
  );
}

export default function App() {
  const [location, setLocation] = useState(readLocation);
  const route = routeFromPath(location.pathname);
  const { tab, detail } = route;
  const [theme, toggleTheme] = useTheme();
  const [lang, setLang] = useLanguage();
  const copy = appCopy[lang];
  const previousPath = useRef(location.pathname);
  // Where each list page was scrolled to, so returning from a detail page lands in the same place.
  const listScroll = useRef({});
  const onList = useRef(!detail);
  onList.current = !detail;

  // Detail pages title the tab with their paper instead.
  const onDetail = Boolean(detail);
  useEffect(() => {
    if (!onDetail) document.title = copy.pageTitle;
    document.querySelector('meta[name="description"]').setAttribute("content", copy.pageDescription);
  }, [copy, onDetail]);

  useEffect(() => {
    const sync = () => setLocation(readLocation());
    const rememberScroll = () => {
      if (onList.current) listScroll.current[routeFromPath(window.location.pathname).tab] = window.scrollY;
    };
    const followLink = (event) => {
      const url = inPageLink(event);
      if (!url) return;
      event.preventDefault();
      navigate(`${url.pathname}${url.search}${url.hash}`);
    };
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    window.addEventListener(LOCATION_CHANGE, sync);
    window.addEventListener("scroll", rememberScroll, { passive: true });
    document.addEventListener("click", followLink);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
      window.removeEventListener(LOCATION_CHANGE, sync);
      window.removeEventListener("scroll", rememberScroll);
      document.removeEventListener("click", followLink);
    };
  }, []);

  // A hash that names a home section (#recently-added, #blog) scrolls to it. Detail pages and lists
  // opened with a filter start at the top, leaving a detail page returns its list to where it was,
  // and other page changes start at the top.
  useEffect(() => {
    const before = routeFromPath(previousPath.current);
    const samePage = previousPath.current === location.pathname;
    previousPath.current = location.pathname;
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
    else if (samePage) return;
    else if (detail || location.search) window.scrollTo(0, 0);
    else if (before.detail && before.tab === tab) window.scrollTo(0, listScroll.current[tab] ?? 0);
    else if (before.tab !== tab) window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href={TAB_PATHS.home}>
            <BrandMark />
            <span>awesome <b>rsi</b></span>
          </a>
          <nav className="site-nav" aria-label={copy.navigation}>
            {NAV_TABS.map((target) => (
              <a href={TAB_PATHS[target]} aria-current={tab === target ? "page" : undefined} key={target}>
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
            {tab === "blog" ? <BlogTab lang={lang} postId={route.postId} />
              : tab === "graph" ? <GraphTab lang={lang} kind={route.graphKind} focusId={new URLSearchParams(location.search).get("paper")} />
                : tab === "notFound" ? <NotFound copy={copy} />
                  : (
                    <>
                      {/* The list stays mounted under a detail page, so its filters survive the round trip. */}
                      <div hidden={Boolean(detail)}>
                        {tab === "papers"
                          ? <PapersTab lang={lang} search={detail ? "" : location.search} />
                          : <MethodsTab lang={lang} search={detail ? "" : location.search} />}
                      </div>
                      {detail && <PaperDetail collection={detail.collection} id={detail.id} lang={lang} />}
                    </>
                  )}
          </div>
        )}
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <a className="brand" href={TAB_PATHS.home}>
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
                    <a href={TAB_PATHS[target]}>{copy.tabs[target]}</a>
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
        </div>
      </footer>
    </>
  );
}
