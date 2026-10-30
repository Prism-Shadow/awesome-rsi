// Feeds the home page's "Recently added" list: methods, systems, and benchmarks together,
// newest additions first, grouped by the day each entry joined the collection.
import { methods } from "../data/methods.js";
import { systems } from "../data/systems.js";
import { papers } from "../data/papers.js";
import { methodTaxonomy } from "../data/methodTaxonomy.js";
import { paperTaxonomy } from "../data/paperTaxonomy.js";
import { paperAbstractsZh } from "../data/paperAbstractsZh.js";

// Benchmarks have no one-line summary, so the feed uses the first sentence of the abstract.
function firstSentence(text = "") {
  return text.match(/^.+?[.!?。！？](?=\s|$)/)?.[0] ?? text;
}

export const collectionEntries = [
  ...methods.map((method) => ({
    kind: "method",
    id: method.id,
    nickname: method.nickname,
    title: method.title,
    published: method.published,
    added: method.added,
    url: method.arxiv ?? method.pdf,
    summary: method.summary,
    summaryZh: method.summaryZh,
    artifact: methodTaxonomy[method.id].artifact,
  })),
  ...systems.map((system) => ({
    kind: "system",
    id: system.id,
    nickname: system.nickname,
    title: system.title,
    published: system.released,
    added: system.added,
    url: system.links[0]?.url,
    summary: system.summary,
    summaryZh: system.summaryZh,
    artifact: system.taxonomy.artifact,
  })),
  ...papers.map((paper) => ({
    kind: "benchmark",
    id: paper.id,
    nickname: paper.nickname,
    title: paper.title,
    published: paper.published,
    added: paper.added,
    url: paper.arxiv,
    summary: firstSentence(paper.abstract),
    summaryZh: firstSentence(paperAbstractsZh[paper.id]),
    mode: paperTaxonomy[paper.id].mode,
  })),
];

export function recentlyAdded(entries = collectionEntries, limit = 10) {
  const newest = [...entries]
    .sort((a, b) => b.added.localeCompare(a.added)
      || b.published.localeCompare(a.published)
      || a.title.localeCompare(b.title))
    .slice(0, limit);
  const days = [];
  for (const entry of newest) {
    const day = days.at(-1);
    if (day?.date === entry.added) day.entries.push(entry);
    else days.push({ date: entry.added, entries: [entry] });
  }
  return days;
}
