import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const themedAssets = ['logo', 'website-entry', 'paper-map', 'benchmark-map'];

// Existing light SVGs remain the editable source of truth for text and geometry.
// Keep the blue identity of the website, using its dark-mode accents and quiet tinted panels at night.
export const darkPalette = {
  '#ffffff': '#0d1117', // canvas; dark text/icons on the bright blue button/root
  '#0d0f1a': '#e6edf3', // primary text
  '#41465a': '#adbac7', // secondary text
  '#0b57d0': '#8ab4f8', // blue accent and primary button/root
  '#0842a0': '#aecbfa', // blue text on tinted panels
  '#d3e3fd': '#173463', // secondary text on the bright blue root
  '#e8f0fe': '#18304f', // blue panel
  '#f3f7fe': '#161d29', // leaf panel
  '#e7e8f0': '#33434c', // panel border
  '#c6dafc': '#2f4a74', // entry border
  '#a9c4ef': '#56739f', // tree connections
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
