import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { methods } from '../site/src/data/methods.js';
import { methodTaxonomy } from '../site/src/data/methodTaxonomy.js';
import { papers } from '../site/src/data/papers.js';
import { paperTaxonomy } from '../site/src/data/paperTaxonomy.js';
import { systems } from '../site/src/data/systems.js';
import { artifactDimension } from '../site/src/data/artifactTaxonomy.js';

const readmePath = fileURLToPath(new URL('../README.md', import.meta.url));
const modes = ['Online', 'Offline', 'Offline → Online'];
const headings = { Parametric: 'Model parameters', 'Other artifact': 'Other artifacts' };
const leaves = artifactDimension.options.filter(({ value }) => value !== 'Non-parametric');
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('|', '&#124;').replaceAll('[', '&#91;')
  .replaceAll(']', '&#93;').replaceAll('*', '&#42;').replaceAll('_', '&#95;')
  .replaceAll('\n', ' ');
const link = (title, url) => `[${escape(title)}](${url})`;
const table = (headers, rows) => [
  `| ${headers.join(' | ')} |`, `| ${headers.map(() => ':---').join(' | ')} |`,
  ...rows.map((row) => `| ${row.join(' | ')} |`),
].join('\n');
const newest = (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'en');

function validate(entries, options, label) {
  const ids = new Set();
  for (const entry of entries) {
    if (ids.has(entry.id)) throw new Error(`Duplicate ${label} ID: ${entry.id}`);
    ids.add(entry.id);
    if (!entry.title || !entry.date || !entry.taxonomy) throw new Error(`Incomplete ${label}: ${entry.id}`);
    if (!/^https:\/\//.test(entry.url)) throw new Error(`Missing HTTPS source: ${entry.id}`);
    const artifacts = entry.taxonomy.artifact ?? [];
    if (artifacts.some((value) => !options.includes(value))) throw new Error(`Unknown artifact: ${entry.id}`);
    if (!leaves.some(({ value }) => artifacts.includes(value))) throw new Error(`No artifact group: ${entry.id}`);
    if (!modes.some((mode) => entry.taxonomy.mode?.includes(mode))) throw new Error(`No RSI mode: ${entry.id}`);
  }
}

export function catalogData() {
  const methodEntries = methods.map((method) => ({
    ...method, date: method.published, url: `https://arxiv.org/abs/${method.id}`,
    taxonomy: methodTaxonomy[method.id], publication: method.venue,
  }));
  const systemEntries = systems.map((system) => ({
    ...system, date: system.released, url: system.links.find(({ label }) => label === 'GitHub')?.url,
    publication: `Project${system.version ? ` · ${system.version}` : ''}`,
  }));
  const benchmarkEntries = papers.map((paper) => ({
    ...paper, date: paper.published, url: paper.arxiv, taxonomy: paperTaxonomy[paper.id],
  }));
  const options = artifactDimension.options.map(({ value }) => value);
  validate([...methodEntries, ...systemEntries], options, 'method or system');
  validate(benchmarkEntries, options, 'benchmark');
  return { methodEntries, systemEntries, benchmarkEntries };
}

export function renderCounts() {
  const { methodEntries, systemEntries, benchmarkEntries } = catalogData();
  return `**${methodEntries.length} method papers · ${benchmarkEntries.length} benchmark papers · ${systemEntries.length} systems**`;
}

export function renderCatalog() {
  const { methodEntries, systemEntries, benchmarkEntries } = catalogData();
  const entries = [...methodEntries, ...systemEntries].sort(newest);
  const sections = [
    '## Methods & Systems',
    '[Compare all dimensions on the website →](https://prism-shadow.github.io/awesome-rsi/#methods)',
    'Grouped by RSI artifact and ordered by first publication or project release date, newest first. Conference labels reflect the venue recorded in the collection; projects link to their repositories.',
  ];
  for (const { value, label } of leaves) {
    sections.push(`### ${headings[value] ?? label}`);
    const definition = artifactDimension.help.items.find((item) => item.term === label);
    sections.push(definition.description);
    const group = entries.filter(({ taxonomy }) => taxonomy.artifact.includes(value));
    if (group.length) {
      sections.push(table(['Paper or project', 'Publication'], group.map((entry) => [
        link(entry.title, entry.url), escape(entry.publication),
      ])));
    } else {
      sections.push('Currently represented in the [benchmark collection](#benchmarks), including data strategies, experiment configurations, and evolving task solutions.');
    }
  }
  sections.push('## Benchmarks');
  sections.push('[Compare benchmark dimensions on the website →](https://prism-shadow.github.io/awesome-rsi/)');
  sections.push('Grouped by RSI mode, newest first. Benchmarks that support multiple protocols appear in each relevant group. Artifact labels describe what evolves in the evaluated workflow.');
  sections.push('<a href="assets/readme/benchmark-map.svg">\n  <img src="assets/readme/benchmark-map.svg" alt="Left-to-right benchmark tree: RSI mode branches into Online, Offline, and Offline to Online, with representative benchmarks for each protocol. Open the full-size map for a closer look." width="100%">\n</a>');
  sections.push('[Online](#online) · [Offline](#offline) · [Offline → Online](#offline-to-online)');
  const descriptions = {
    Online: 'Experience accumulates during the task stream or repeated interaction, and later work can use it.',
    Offline: 'Evolution precedes a separate held-out evaluation.',
    'Offline → Online': 'An artifact is built offline and continues to evolve during online use.',
  };
  for (const mode of modes) {
    sections.push(`### ${mode === 'Offline → Online' ? 'Offline to online' : mode}`, descriptions[mode]);
    const group = benchmarkEntries.filter(({ taxonomy }) => taxonomy.mode.includes(mode)).sort(newest);
    if (!group.length) { sections.push('No entries yet.'); continue; }
    sections.push(table(['Benchmark paper', 'Year', 'RSI artifact'], group.map((entry) => [
      link(entry.title, entry.url), String(entry.year),
      leaves.filter(({ value }) => entry.taxonomy.artifact.includes(value))
        .map(({ value, label }) => escape(headings[value] ?? label)).join(' · '),
    ])));
  }
  return sections.join('\n\n');
}

export function replaceSection(markdown, name, content) {
  const start = `<!-- BEGIN GENERATED ${name} -->`;
  const end = `<!-- END GENERATED ${name} -->`;
  if (markdown.split(start).length !== 2 || markdown.split(end).length !== 2) {
    throw new Error(`Expected exactly one ${name} marker pair`);
  }
  const a = markdown.indexOf(start) + start.length;
  const b = markdown.indexOf(end);
  if (a > b) throw new Error(`Reversed ${name} markers`);
  return `${markdown.slice(0, a)}\n\n${content}\n\n${markdown.slice(b)}`;
}

export function renderReadme(markdown) {
  return replaceSection(replaceSection(markdown, 'COUNTS', renderCounts()), 'CATALOG', renderCatalog());
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.slice(2).some((arg) => arg !== '--check')) throw new Error('Usage: node scripts/generate-readme.mjs [--check]');
  const current = await readFile(readmePath, 'utf8');
  const generated = renderReadme(current);
  if (process.argv.includes('--check')) {
    if (generated !== current) {
      console.error('README catalog is stale. Run: node scripts/generate-readme.mjs');
      process.exitCode = 1;
    } else console.log('README catalog and counts match the site data.');
  } else if (current !== generated) {
    await writeFile(readmePath, generated);
    console.log('Updated README catalog and counts from the site data.');
  } else console.log('README is already up to date.');
}
