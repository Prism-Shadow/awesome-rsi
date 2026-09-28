import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { themedAssets, darkPalette, renderDarkSvg } from './generate-readme-themes.mjs';
import { renderReadme } from './generate-readme.mjs';

test('every README illustration selects a dark source with a light fallback', async () => {
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  for (const text of [readme, renderReadme(readme)]) {
    const pictures = [...text.matchAll(/<picture>([\s\S]*?)<\/picture>/g)].map((match) => match[1]);
    assert.equal(pictures.length, themedAssets.length);
    for (const name of themedAssets) {
      const picture = pictures.find((markup) => markup.includes(`srcset="assets/readme/${name}-dark.svg"`));
      assert.ok(picture, name);
      assert.match(picture, /media="\(prefers-color-scheme: dark\)"/);
      assert.ok(picture.includes(`src="assets/readme/${name}.svg"`), `${name}: light fallback`);
      assert.match(picture, /alt="[^\"]+"/);
    }
  }
});

test('generated dark SVGs preserve all content and layout from the editable source', async () => {
  for (const name of themedAssets) {
    const light = await readFile(new URL(`../assets/readme/${name}.svg`, import.meta.url), 'utf8');
    const dark = await readFile(new URL(`../assets/readme/${name}-dark.svg`, import.meta.url), 'utf8');
    assert.equal(dark, renderDarkSvg(light), name);
    const stripColors = (svg) => svg.replace(/#[0-9a-f]{6}\b/gi, '#COLOR');
    assert.equal(stripColors(light), stripColors(dark), name);
    assert.ok(!dark.includes('#ffffff'), `${name}: no white canvas`);
  }
  assert.throws(() => renderDarkSvg('<svg fill="#abcdef"/>'), /mapping/);
});

function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map((channel) => parseInt(channel, 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

test('both palettes maintain readable text contrast, including tree labels and buttons', () => {
  const pairs = [
    ['#0d0f1a', '#ffffff'], ['#41465a', '#ffffff'], ['#0f6b4f', '#ffffff'],
    ['#ffffff', '#0f6b4f'], ['#d5efe1', '#0f6b4f'], ['#0a4b38', '#e8f4ee'],
    ...['#e8f4ee', '#e8eef6', '#eceefd', '#e3f5f2', '#f6eddc'].map((bg) => ['#0d0f1a', bg]),
  ];
  for (const palette of [(color) => color, (color) => darkPalette[color]]) {
    for (const pair of pairs) {
      const [a, b] = pair.map((color) => luminance(palette(color))).sort((x, y) => y - x);
      assert.ok((a + 0.05) / (b + 0.05) >= 4.5, `Low contrast: ${pair.map(palette).join(' on ')}`);
    }
  }
});
