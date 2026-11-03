import assert from "node:assert/strict";
import test from "node:test";
import { bibtex, catalogEntries, citationNeighbors, entryHref, findEntry, firstSentence, similarEntries } from "../site/src/lib/catalog.js";
import { findShareEntry, sharePage, sharePath, SITE_URL } from "../site/src/lib/sharePages.js";
import { methods } from "../site/src/data/methods.js";
import { systems } from "../site/src/data/systems.js";
import { papers } from "../site/src/data/papers.js";
import { methodCitationEdges } from "../site/src/data/methodCitationGraph.js";
import { detailFromHash } from "../site/src/lib/navigation.js";

test("every method, system, and benchmark has exactly one detail page", () => {
  assert.equal(catalogEntries.length, methods.length + systems.length + papers.length);
  assert.equal(new Set(catalogEntries.map((entry) => entry.id)).size, catalogEntries.length);
  for (const entry of catalogEntries) {
    const route = detailFromHash(entryHref(entry));
    assert.equal(findEntry(route.collection, route.id), entry, entry.id);
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

test("share pages describe the paper and redirect to its detail page", () => {
  assert.equal(new Set(catalogEntries.map(sharePath)).size, catalogEntries.length);
  const entry = findShareEntry("2605.30105");
  const html = sharePage(entry);
  assert.match(html, new RegExp(`<link rel="canonical" href="${SITE_URL}p/2605.30105/" />`));
  assert.match(html, /<meta property="og:title" content="EvoRepair: Learning from Repair Experience/);
  assert.match(html, /location\.replace\("\.\.\/\.\.\/#methods\/2605\.30105"\)/);
  const tricky = sharePage({ ...entry, nickname: "A&B", title: "A&B <script>", summary: `"quoted"` });
  assert.ok(!tricky.includes("<script>A") && tricky.includes("A&amp;B &lt;script&gt;") && tricky.includes("&quot;quoted&quot;"));
  // A title that already starts with the nickname is not repeated.
  assert.match(sharePage(findShareEntry("2607.28048")), /<title>SKILL-KD: Contrastive Skill Distillation for LLM Agents · Awesome RSI<\/title>/);
});
