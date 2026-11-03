import assert from "node:assert/strict";
import test from "node:test";
import { papers } from "../site/src/data/papers.js";
import { paperAbstractsZh } from "../site/src/data/paperAbstractsZh.js";
import { paperInstitutions } from "../site/src/data/paperInstitutions.js";
import { citationEdges } from "../site/src/data/citationGraph.js";
import { filterDimensions, paperTaxonomy } from "../site/src/data/paperTaxonomy.js";
import { tagLabelsZh } from "../site/src/i18n.js";
import { TAG_COLORS } from "../site/src/lib/tagColors.js";

// The pages render these fields without fallbacks, so every benchmark must have them.
test("every benchmark has a Chinese abstract, institutions, and a citation count", () => {
  assert.equal(new Set(papers.map(({ id }) => id)).size, papers.length);
  for (const paper of papers) {
    assert.ok(paperAbstractsZh[paper.id]?.trim(), `${paper.id}: missing Chinese abstract`);
    assert.ok(paperInstitutions[paper.id]?.length, `${paper.id}: missing institutions`);
    assert.equal(typeof paper.citations, "number", paper.id);
    assert.ok(paper.authors.length > 0 && paper.nickname && paper.title && paper.abstract, paper.id);
  }
});

test("benchmark taxonomy values and topic tags are all defined", () => {
  for (const paper of papers) {
    for (const dimension of filterDimensions) {
      for (const value of paperTaxonomy[paper.id][dimension.id]) {
        assert.ok(dimension.options.some((option) => option.value === value), `${paper.id}: ${dimension.id} "${value}"`);
      }
    }
    for (const tag of paper.tags) {
      assert.ok(TAG_COLORS[tag], `${paper.id}: no color for tag "${tag}"`);
      assert.ok(tagLabelsZh[tag], `${paper.id}: no Chinese label for tag "${tag}"`);
    }
  }
});

test("benchmark citation edges reference existing benchmarks without duplicates or self-links", () => {
  const ids = new Set(papers.map(({ id }) => id));
  const keys = citationEdges.map(({ source, target }) => `${source}->${target}`);
  assert.equal(new Set(keys).size, keys.length);
  for (const edge of citationEdges) {
    assert.ok(ids.has(edge.source) && ids.has(edge.target), `${edge.source}->${edge.target}`);
    assert.notEqual(edge.source, edge.target);
    assert.ok(edge.verifiedBy);
  }
});
