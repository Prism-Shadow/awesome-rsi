import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const BASE = "/awesome-rsi/";

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

// GitHub Pages only serves files that exist, so after the build every page gets its own copy of
// index.html with that page's title and preview tags (see src/lib/staticPages.js), plus a 404.html.
function staticPages() {
  let outDir;
  return {
    name: "static-pages",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const { notFoundHtml, pageHtml, staticPages: pages } = await import(new URL("./src/lib/staticPages.js", import.meta.url).href);
      const template = await readFile(path.join(outDir, "index.html"), "utf8");
      for (const page of pages()) {
        const file = path.join(outDir, page.path.slice(BASE.length), "index.html");
        await mkdir(path.dirname(file), { recursive: true });
        await writeFile(file, pageHtml(template, page));
      }
      await writeFile(path.join(outDir, "404.html"), notFoundHtml(template));
    },
  };
}

// base must match the GitHub Pages project path: https://<org>.github.io/awesome-rsi/
export default defineConfig({
  base: BASE,
  plugins: [react(), heroNetwork(), staticPages()],
});
