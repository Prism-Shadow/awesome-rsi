// Every entry that has a detail page — method papers, open-source systems, and benchmark papers —
// in one shape, with its neighbors in the collection's citation graphs and its most similar entries.
import { methods } from "../data/methods.js";
import { systems } from "../data/systems.js";
import { papers } from "../data/papers.js";
import { methodAbstracts } from "../data/methodAbstracts.js";
import { methodInstitutions } from "../data/methodInstitutions.js";
import { methodTaxonomy } from "../data/methodTaxonomy.js";
import { methodCitationEdges } from "../data/methodCitationGraph.js";
import { paperTaxonomy } from "../data/paperTaxonomy.js";
import { paperInstitutions } from "../data/paperInstitutions.js";
import { paperAbstractsZh } from "../data/paperAbstractsZh.js";
import { citationEdges } from "../data/citationGraph.js";
import { detailPath } from "./navigation.js";

// Benchmarks have no one-line summary, so their first abstract sentence stands in for one.
// Chinese full stops end a sentence without a following space.
export function firstSentence(text = "") {
  return text.match(/^.+?(?:[.!?](?=\s|$)|[。！？])/)?.[0] ?? text;
}

const methodEntries = methods.map((method) => ({
  kind: "method",
  collection: "methods",
  id: method.id,
  nickname: method.nickname,
  title: method.title,
  authors: method.authors,
  authorCount: method.authorCount,
  published: method.published,
  venue: method.venue,
  status: method.status,
  institutions: methodInstitutions[method.id],
  summary: method.summary,
  summaryZh: method.summaryZh,
  abstract: methodAbstracts[method.id],
  facets: methodTaxonomy[method.id],
  arxiv: method.arxiv,
  pdf: method.pdf,
}));

const systemEntries = systems.map((system) => ({
  kind: "system",
  collection: "methods",
  id: system.id,
  nickname: system.nickname,
  title: system.title,
  authors: [],
  maintainers: system.maintainers,
  version: system.version,
  published: system.released,
  venue: "Open-source system",
  summary: system.summary,
  summaryZh: system.summaryZh,
  facets: system.taxonomy,
  links: system.links,
}));

const benchmarkEntries = papers.map((paper) => ({
  kind: "benchmark",
  collection: "benchmarks",
  id: paper.id,
  nickname: paper.nickname,
  title: paper.title,
  authors: paper.authors,
  authorCount: paper.authors.length,
  published: paper.published,
  institutions: paperInstitutions[paper.id],
  summary: firstSentence(paper.abstract),
  summaryZh: firstSentence(paperAbstractsZh[paper.id]),
  abstract: paper.abstract,
  abstractZh: paperAbstractsZh[paper.id],
  facets: paperTaxonomy[paper.id],
  tags: paper.tags,
  citations: paper.citations,
  arxiv: paper.arxiv,
  pdf: paper.pdf,
}));

export const catalogEntries = [...methodEntries, ...systemEntries, ...benchmarkEntries];
const entriesByKey = new Map(catalogEntries.map((entry) => [`${entry.collection}/${entry.id}`, entry]));

export function findEntry(collection, id) {
  return entriesByKey.get(`${collection}/${id}`) ?? null;
}

export function entryHref(entry) {
  return detailPath(entry.collection, entry.id);
}

// The page title: "Nickname: Title", unless the title already starts with the nickname.
export function entryTitle(entry) {
  return entry.title.startsWith(entry.nickname) ? entry.title : `${entry.nickname}: ${entry.title}`;
}

// Methods and benchmarks each have their own citation graph; systems are not in either.
const graphs = {
  method: { edges: methodCitationEdges, collection: "methods" },
  benchmark: { edges: citationEdges, collection: "benchmarks" },
};

export function citationNeighbors(entry) {
  const graph = graphs[entry.kind];
  if (!graph) return { references: [], citedBy: [] };
  const lookup = (id) => findEntry(graph.collection, id);
  const newestFirst = (a, b) => b.published.localeCompare(a.published);
  return {
    references: graph.edges.filter((edge) => edge.source === entry.id).map((edge) => lookup(edge.target)).filter(Boolean).sort(newestFirst),
    citedBy: graph.edges.filter((edge) => edge.target === entry.id).map((edge) => lookup(edge.source)).filter(Boolean).sort(newestFirst),
  };
}

function facetSet(entry) {
  return new Set(Object.entries(entry.facets).flatMap(([dimension, values]) => values.map((value) => `${dimension}:${value}`)));
}

// The entries of the same collection whose taxonomy labels overlap most (Jaccard), newest first on ties.
export function similarEntries(entry, limit = 5) {
  const own = facetSet(entry);
  return catalogEntries
    .filter((other) => other.collection === entry.collection && other !== entry)
    .map((other) => {
      const labels = facetSet(other);
      const shared = [...own].filter((label) => labels.has(label)).length;
      return { entry: other, score: shared / (own.size + labels.size - shared) };
    })
    .sort((a, b) => b.score - a.score || b.entry.published.localeCompare(a.entry.published))
    .slice(0, limit)
    .map(({ entry: other }) => other);
}

// A BibTeX record for papers on arXiv; other entries have no stable record to cite here.
export function bibtex(entry) {
  if (!entry.arxiv) return null;
  const surname = (entry.authors[0] ?? "anon").split(" ").pop().normalize("NFD").replace(/[^A-Za-z]/g, "").toLowerCase();
  const titleWord = entry.title.split(/[^A-Za-z]+/).find((word) => word.length > 3)?.toLowerCase() ?? "paper";
  const authors = [...entry.authors, ...(entry.authorCount > entry.authors.length ? ["others"] : [])].join(" and ");
  const fields = [
    ["title", `{${entry.title}}`],
    ["author", authors],
    ["year", entry.published.slice(0, 4)],
    ["eprint", entry.id],
    ["archivePrefix", "arXiv"],
    ...(entry.status === "accepted" ? [["note", entry.venue]] : []),
    ["url", entry.arxiv],
  ];
  return `@misc{${surname}${entry.published.slice(0, 4)}${titleWord},\n${fields.map(([key, value]) => `  ${key} = {${value}}`).join(",\n")}\n}`;
}
