import test from 'node:test';
import assert from 'node:assert/strict';
import { methods } from '../site/src/data/methods.js';
import { methodAbstracts } from '../site/src/data/methodAbstracts.js';
import { methodInstitutions } from '../site/src/data/methodInstitutions.js';
import { methodFilterDimensions, methodTaxonomy } from '../site/src/data/methodTaxonomy.js';
import { localizeMethodDimensions, localizeMethodValue } from '../site/src/data/methodTaxonomyZh.js';
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

test('LLM-generated tests is a localized feedback source, not a feedback format', () => {
  const source = methodFilterDimensions.find(({ id }) => id === 'source');
  assert.ok(source.options.some(({ value }) => value === 'LLM-generated tests'));
  const feedback = methodFilterDimensions.find(({ id }) => id === 'feedback');
  assert.ok(!feedback.options.some(({ value }) => value === 'LLM-generated tests'));

  const sourceZh = localizeMethodDimensions(methodFilterDimensions, 'zh').find(({ id }) => id === 'source');
  assert.equal(sourceZh.options.find(({ value }) => value === 'LLM-generated tests').label, 'LLM 生成测试');
  assert.equal(sourceZh.help.items.find(({ term }) => term === 'LLM 生成测试').description,
    '由 LLM 生成可执行测试，用实际运行结果为进化提供反馈。');
  assert.equal(localizeMethodValue('source', 'LLM-generated tests', 'zh'), 'LLM 生成测试');
});

test('generated-test feedback is backed by execution and applied to verified papers', () => {
  for (const { id } of methods) {
    const profile = methodTaxonomy[id];
    if (profile.source.includes('LLM-generated tests')) {
      assert.ok(profile.source.includes('Executable verifier'), `${id}: generated tests must be executed`);
    }
  }
  // HarnessPro, OpenSkill, SkillHEX, HGM, Mem²Evolve, and SkillSmith explicitly execute generated tests.
  for (const id of ['2610.26770', '2606.06741', '2608.05628', '2510.21614', '2604.10923', '2606.01314']) {
    assert.ok(methodTaxonomy[id].source.includes('LLM-generated tests'), id);
  }
  // Live environment experiments and running provided benchmark tests alone do not qualify.
  for (const id of ['2610.12789', '2610.02616']) {
    assert.ok(!methodTaxonomy[id].source.includes('LLM-generated tests'), id);
  }
  // OpenSkill uses tests to refine in place, but exports the last version even if its budget expires before passing.
  assert.deepEqual(methodTaxonomy['2606.06741'].selection, ['No validation']);
});

test('the six new method papers have original abstracts and are represented in the citation graph', () => {
  for (const id of ['2610.26770', '2610.12789', '2610.12424', '2610.12086', '2610.02616', '2609.09468']) {
    assert.ok(methods.some((method) => method.id === id), id);
    assert.ok(!methodAbstracts[id].startsWith('Abstract summary:'), id);
    assert.ok(methodCitationEdges.some(({ source }) => source === id), id);
  }
});

test('Harness² and Skill∞ have original abstracts and are represented in the citation graph', () => {
  for (const id of ['2610.14224', '2610.35434']) {
    assert.ok(methods.some((method) => method.id === id), id);
    assert.ok(!methodAbstracts[id].startsWith('Abstract summary:'), id);
    assert.ok(methodCitationEdges.some(({ source }) => source === id), id);
  }
});

test('SKILL-KD has its original abstract and is represented in the citation graph', () => {
  assert.ok(methods.some((method) => method.id === '2607.28048'));
  assert.ok(!methodAbstracts['2607.28048'].startsWith('Abstract summary:'));
  assert.ok(methodCitationEdges.some(({ source }) => source === '2607.28048'));
  // §3.2: each student failure triggers an update that is committed before the next instance.
  assert.deepEqual(methodTaxonomy['2607.28048'].frequency, ['Event']);
});

test('EvoRepair has its original abstract and is represented in the citation graph', () => {
  assert.ok(methods.some((method) => method.id === '2605.30105'));
  assert.ok(!methodAbstracts['2605.30105'].startsWith('Abstract summary:'));
  assert.ok(methodCitationEdges.some(({ source }) => source === '2605.30105'));
  // §§III-C2 and IV-D: repairs run the benchmark's own PoC and unit-test scripts.
  assert.ok(methodTaxonomy['2605.30105'].source.includes('Benchmark'));
});

test('VideoHarness-SRSI and VideoHarness-RSI have original abstracts and are linked in the citation graph', () => {
  for (const id of ['2610.19424', '2608.24302']) {
    assert.ok(methods.some((method) => method.id === id), id);
    assert.ok(!methodAbstracts[id].startsWith('Abstract summary:'), id);
    assert.ok(methodCitationEdges.some(({ source }) => source === id), id);
  }
  // SRSI names VideoHarness-RSI as its closest, concurrent work.
  assert.ok(methodCitationEdges.some(({ source, target }) => source === '2610.19424' && target === '2608.24302'));
});

test('AutoSR has its original abstract and labels its per-problem research states', () => {
  assert.ok(!methodAbstracts['2608.16876'].startsWith('Abstract summary:'));
  assert.ok(!/\\textbf|--/.test(methodAbstracts['2608.16876']));
  // §3.2: children see only their ancestors' records, and every cycle adds one state.
  assert.deepEqual(methodTaxonomy['2608.16876'].topology, ['Tree']);
  assert.deepEqual(methodTaxonomy['2608.16876'].frequency, ['Trajectory']);
});

test('an optimizer rewriting its own procedure is labeled only by its role toward the student', () => {
  // SePO, Hyperagents, Escher-Loop, Red Queen Gödel Machine, VERSE, HMED, and Skill∞ also revise their own optimizer.
  for (const id of ['2606.04465', '2603.19461', '2604.23472', '2606.26294', '2610.02616', '2610.07979', '2610.35434']) {
    assert.deepEqual(methodTaxonomy[id].updater, ['Teacher'], id);
  }
  // HGM reuses DGM's self-modification step: a separate diagnosis call directs the agent's edits to its own code.
  assert.deepEqual(methodTaxonomy['2510.21614'].updater, methodTaxonomy['2505.22954'].updater);
});
