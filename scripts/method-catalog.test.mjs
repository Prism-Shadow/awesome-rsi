import test from 'node:test';
import assert from 'node:assert/strict';
import { methods } from '../site/src/data/methods.js';
import { methodAbstracts } from '../site/src/data/methodAbstracts.js';
import { methodInstitutions } from '../site/src/data/methodInstitutions.js';
import { methodFilterDimensions, methodTaxonomy } from '../site/src/data/methodTaxonomy.js';
import { methodCitationEdges } from '../site/src/data/methodCitationGraph.js';

test('every method has unique identity and complete card metadata', () => {
  assert.equal(new Set(methods.map(({ id }) => id)).size, methods.length);
  for (const method of methods) {
    for (const key of ['title', 'nickname', 'summary', 'summaryZh', 'published', 'venue', 'status']) {
      assert.ok(method[key]?.trim(), `${method.id}: missing ${key}`);
    }
    assert.ok(method.authors.length > 0, method.id);
    assert.ok(method.authorCount >= method.authors.length, method.id);
    assert.ok(methodAbstracts[method.id]?.trim(), `${method.id}: missing abstract`);
    assert.ok(methodInstitutions[method.id]?.length, `${method.id}: missing institutions`);
    assert.ok(!Number.isNaN(Date.parse(method.published)), method.id);
    assert.equal(new URL(method.arxiv || method.pdf).protocol, 'https:');
  }
});

test('method profiles use complete, valid taxonomy values and include parent labels', () => {
  for (const { id } of methods) {
    for (const dimension of methodFilterDimensions) {
      const values = methodTaxonomy[id]?.[dimension.id];
      assert.ok(values?.length, `${id}: missing ${dimension.id}`);
      assert.equal(new Set(values).size, values.length, `${id}: duplicate ${dimension.id}`);
      for (const value of values) {
        const option = dimension.options.find((candidate) => candidate.value === value);
        assert.ok(option, `${id}: invalid ${dimension.id}=${value}`);
        if (option.parent) assert.ok(values.includes(option.parent), `${id}: missing ${option.parent}`);
      }
    }
  }
});

test('method citation edges reference existing methods without duplicates or self-links', () => {
  const ids = new Set(methods.map(({ id }) => id));
  const seen = new Set();
  for (const edge of methodCitationEdges) {
    const key = `${edge.source}->${edge.target}`;
    assert.ok(ids.has(edge.source) && ids.has(edge.target), key);
    assert.notEqual(edge.source, edge.target, key);
    assert.ok(!seen.has(key), `duplicate ${key}`);
    assert.ok(edge.verifiedBy, `missing provenance for ${key}`);
    seen.add(key);
  }
});
