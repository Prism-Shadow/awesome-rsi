import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const HERO_NETWORK = "virtual:hero-network";
const HERO_NETWORK_ID = `\0${HERO_NETWORK}`;
const HERO_NETWORK_INPUTS = /\/src\/(data\/methods|data\/methodCitationGraph|lib\/heroNetwork|lib\/citationLayout)\.js$/;

// The home hero's network layout takes a few hundred milliseconds, so it is computed here at build
// time (and again in dev when its inputs change) instead of in every visitor's browser.
function heroNetwork() {
  let server;
  return {
    name: "hero-network",
    configureServer(devServer) {
      server = devServer;
    },
    resolveId: (source) => (source === HERO_NETWORK ? HERO_NETWORK_ID : undefined),
    async load(id) {
      if (id !== HERO_NETWORK_ID) return undefined;
      // In dev, Vite's module loader picks up edits to the data and the layout code.
      const load = server
        ? (path) => server.ssrLoadModule(path)
        : (path) => import(new URL(`.${path}`, import.meta.url).href);
      const [{ buildHeroNetwork }, { methods }, { methodCitationEdges }] = await Promise.all([
        load("/src/lib/heroNetwork.js"),
        load("/src/data/methods.js"),
        load("/src/data/methodCitationGraph.js"),
      ]);
      const { nodes, hubIds } = buildHeroNetwork(methods, methodCitationEdges);
      const round = (value) => Math.round(value * 10) / 10;
      const heroNodes = nodes.map(({ id: paperId, nickname, x, y, radius }) => (
        { id: paperId, nickname, x: round(x), y: round(y), radius: round(radius) }
      ));
      return `export const heroNodes = ${JSON.stringify(heroNodes)};\nexport const heroHubIds = ${JSON.stringify([...hubIds])};\n`;
    },
    handleHotUpdate({ file, modules, server: devServer }) {
      if (!HERO_NETWORK_INPUTS.test(file)) return undefined;
      const hero = devServer.moduleGraph.getModuleById(HERO_NETWORK_ID);
      if (!hero) return undefined;
      devServer.moduleGraph.invalidateModule(hero);
      return [...modules, hero];
    },
  };
}

// Emits the static share page for every detail page (see src/lib/sharePages.js), and serves the
// same pages from the dev server so shared links can be tried locally.
function sharePages() {
  return {
    name: "share-pages",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const match = request.url?.match(/^\/awesome-rsi\/p\/([^/?#]+)\/?(?:index\.html)?(?:[?#].*)?$/);
        if (!match) return next();
        const { findShareEntry, sharePage } = await server.ssrLoadModule("/src/lib/sharePages.js");
        const entry = findShareEntry(decodeURIComponent(match[1]));
        if (!entry) return next();
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(sharePage(entry));
      });
    },
    async generateBundle() {
      const { catalogEntries, sharePage, sharePath } = await import(new URL("./src/lib/sharePages.js", import.meta.url).href);
      for (const entry of catalogEntries) {
        this.emitFile({ type: "asset", fileName: sharePath(entry), source: sharePage(entry) });
      }
    },
  };
}

// base must match the GitHub Pages project path: https://<org>.github.io/awesome-rsi/
export default defineConfig({
  base: "/awesome-rsi/",
  plugins: [react(), heroNetwork(), sharePages()],
});
