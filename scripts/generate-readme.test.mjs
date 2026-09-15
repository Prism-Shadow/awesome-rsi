import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { artifactDimension } from '../site/src/data/artifactTaxonomy.js';
import { methods } from '../site/src/data/methods.js';
import { catalogData, renderCatalog, renderReadme, replaceSection } from './generate-readme.mjs';

test('method links preserve arXiv sources and support PDF-only preprints', () => {
  const { methodEntries } = catalogData();
  for (const method of methods) {
    assert.equal(methodEntries.find(({ id }) => id === method.id).url, method.arxiv || method.pdf);
  }
  const dream = methodEntries.find(({ id }) => id === 'dream-rsi');
  assert.equal(dream.url, 'https://dream-rsi.com/assets/dream-rsi.pdf');
  assert.ok(!renderCatalog().includes('arxiv.org/abs/dream-rsi'));
});

test('every method, system, and benchmark appears once per matching group', () => {
  const { methodEntries, systemEntries, benchmarkEntries } = catalogData();
  const catalog = renderCatalog();
  for (const entry of [...methodEntries, ...systemEntries]) {
    const count = artifactDimension.options.filter(({ value }) => value !== 'Non-parametric' && entry.taxonomy.artifact.includes(value)).length;
    assert.equal(catalog.split(`](${entry.url})`).length - 1, count, entry.title);
  }
  for (const entry of benchmarkEntries) {
    const count = ['Online', 'Offline', 'Offline → Online'].filter((mode) => entry.taxonomy.mode.includes(mode)).length;
    assert.equal(catalog.split(`](${entry.url})`).length - 1, count, entry.title);
  }
});

test('generated sections preserve all hand-written content and are idempotent', async () => {
  const markdown = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const generated = renderReadme(markdown);
  const strip = (text) => text.replace(/(<!-- BEGIN GENERATED (\w+) -->)[\s\S]*?(<!-- END GENERATED \2 -->)/g, '$1$3');
  assert.equal(strip(generated), strip(markdown));
  assert.equal(renderReadme(generated), generated);
});

test('missing, repeated, or reversed markers fail instead of overwriting prose', () => {
  const start = '<!-- BEGIN GENERATED COUNTS -->';
  const end = '<!-- END GENERATED COUNTS -->';
  for (const markdown of ['', start, `${start}${start}${end}`, `${start}${end}${end}`, `${end}${start}`]) {
    assert.throws(() => replaceSection(markdown, 'COUNTS', 'new'));
  }
});

test('all generated data rows have the expected number of table cells', () => {
  let columns;
  for (const line of renderCatalog().split('\n')) {
    if (!line.startsWith('|')) { columns = undefined; continue; }
    const count = line.split('|').length;
    if (columns === undefined) columns = count;
    assert.equal(count, columns, line);
  }
});
