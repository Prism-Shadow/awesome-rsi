import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const themedAssets = ['logo', 'website-entry', 'paper-map', 'benchmark-map'];

// Existing light SVGs remain the editable source of truth for text and geometry.
// Keep the green identity, using brighter accents and quiet tinted panels at night.
export const darkPalette = {
  '#ffffff': '#0d1117', // canvas; dark text/icons on the bright green button/root
  '#0d0f1a': '#e6edf3', // primary text
  '#41465a': '#adbac7', // secondary text
  '#0f6b4f': '#6bd5aa', // green accent and primary button/root
  '#0a4b38': '#a1e8cb', // green text on tinted panels
  '#d5efe1': '#153d2e', // secondary text on the bright green root
  '#e8f4ee': '#18382d', // green panel
  '#e8eef6': '#1d3044', // blue panel
  '#eceefd': '#2a2c49', // violet panel
  '#e3f5f2': '#173c39', // teal panel
  '#f6eddc': '#3d3321', // amber panel
  '#e7e8f0': '#33434c', // panel border
  '#cddfd5': '#3b5b4d', // entry border
  '#b7cfc3': '#638b79', // tree connections
};

export function renderDarkSvg(lightSvg) {
  return lightSvg.replace(/#[0-9a-f]{6}\b/gi, (color) => {
    const replacement = darkPalette[color.toLowerCase()];
    if (!replacement) throw new Error(`Add a dark-theme mapping for ${color}`);
    return replacement;
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== '--check')) throw new Error('Usage: node scripts/generate-readme-themes.mjs [--check]');
  for (const name of themedAssets) {
    const source = new URL(`../assets/readme/${name}.svg`, import.meta.url);
    const target = new URL(`../assets/readme/${name}-dark.svg`, import.meta.url);
    const generated = renderDarkSvg(await readFile(source, 'utf8'));
    let current;
    try { current = await readFile(target, 'utf8'); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (current === generated) continue;
    if (args.includes('--check')) {
      console.error(`${name}-dark.svg is stale. Run: node scripts/generate-readme-themes.mjs`);
      process.exitCode = 1;
    } else {
      await writeFile(target, generated);
      console.log(`Updated ${name}-dark.svg`);
    }
  }
}
