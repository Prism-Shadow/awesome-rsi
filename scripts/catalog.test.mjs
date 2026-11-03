import assert from "node:assert/strict";
import test from "node:test";
import { bibtex, catalogEntries, citationNeighbors, entryHref, findEntry, firstSentence, similarEntries } from "../site/src/lib/catalog.js";
import { notFoundHtml, pageHtml, staticPages } from "../site/src/lib/staticPages.js";
import { methods } from "../site/src/data/methods.js";
import { systems } from "../site/src/data/systems.js";
import { papers } from "../site/src/data/papers.js";
import { methodCitationEdges } from "../site/src/data/methodCitationGraph.js";
import { routeFromPath } from "../site/src/lib/navigation.js";
import { blogPosts } from "../site/src/data/blogPosts.js";
import { readFile } from "node:fs/promises";

test("every method, system, and benchmark has exactly one detail page", () => {
  assert.equal(catalogEntries.length, methods.length + systems.length + papers.length);
  assert.equal(new Set(catalogEntries.map((entry) => entry.id)).size, catalogEntries.length);
  for (const entry of catalogEntries) {
    const { detail } = routeFromPath(entryHref(entry));
    assert.equal(findEntry(detail.collection, detail.id), entry, entry.id);
    assert.ok(entry.title && entry.summary && entry.facets, entry.id);
  }
  assert.equal(findEntry("methods", "9999.99999"), null);
});

test("detail pages list a paper's citations within its own collection", () => {
  for (const method of methods) {
    const { references, citedBy } = citationNeighbors(findEntry("methods", method.id));
    assert.equal(references.length, methodCitationEdges.filter((edge) => edge.source === method.id).length, method.id);
    assert.equal(citedBy.length, methodCitationEdges.filter((edge) => edge.target === method.id).length, method.id);
  }
  assert.deepEqual(citationNeighbors(findEntry("methods", "reme")), { references: [], citedBy: [] });
});

test("similar entries come from the same collection and exclude the entry itself", () => {
  for (const entry of catalogEntries) {
    const similar = similarEntries(entry);
    assert.equal(similar.length, 5, entry.id);
    assert.ok(similar.every((other) => other !== entry && other.collection === entry.collection), entry.id);
  }
});

test("BibTeX records cite arXiv papers and note accepted venues", () => {
  const record = bibtex(findEntry("methods", "2605.30105"));
  assert.match(record, /^@misc\{hu2026learning,/);
  assert.match(record, /eprint = \{2605\.30105\}/);
  assert.match(record, /note = \{ICSE 2027\}/);
  assert.match(bibtex(findEntry("methods", "2505.22954")), /and others\}/);
  assert.equal(bibtex(findEntry("methods", "reme")), null);
});

test("benchmark summaries take the first sentence in either language", () => {
  assert.equal(firstSentence("One. Two."), "One.");
  assert.equal(firstSentence("第一句。第二句。"), "第一句。");
  assert.equal(firstSentence("v1.5 works. Next."), "v1.5 works.");
});

test("the build writes one titled page per address, from the real index.html", async () => {
  const pages = staticPages();
  assert.equal(pages.length, 5 + catalogEntries.length + blogPosts.length);
  assert.equal(new Set(pages.map(({ path }) => path)).size, pages.length);
  for (const page of pages) assert.notEqual(routeFromPath(page.path).tab, "notFound", page.path);
  const template = await readFile(new URL("../site/index.html", import.meta.url), "utf8");
  const html = pageHtml(template, pages.find(({ path }) => path === "/awesome-rsi/methods/2605.30105/"));
  assert.match(html, /<title>EvoRepair: Learning from Repair Experience: .+ — Awesome RSI<\/title>/);
  assert.match(html, /<meta name="description" content="Retrieves past repair experience/);
  assert.match(html, /<link rel="canonical" href="https:\/\/prism-shadow\.github\.io\/awesome-rsi\/methods\/2605\.30105\/" \/>/);
  assert.equal((html.match(/<title>/g) ?? []).length, 1);
  assert.equal((html.match(/name="description"/g) ?? []).length, 1);
  const tricky = pageHtml(template, { path: "/awesome-rsi/", title: "A&B <script>", description: '"quoted"' });
  assert.ok(tricky.includes("<title>A&amp;B &lt;script&gt;</title>") && tricky.includes("&quot;quoted&quot;"));
  // A title that already starts with the nickname is not repeated.
  assert.ok(pages.some(({ title }) => title === "SKILL-KD: Contrastive Skill Distillation for LLM Agents — Awesome RSI"));
  assert.match(notFoundHtml(template), /<meta name="robots" content="noindex" \/>/);
});
