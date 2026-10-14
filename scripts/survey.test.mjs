import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { surveyPaper } from "../site/src/data/survey.js";
import { surveyCopy } from "../site/src/i18n.js";
import { renderReadme } from "./generate-readme.mjs";

test("the featured survey points to a real PDF in the public papers directory", async () => {
  assert.match(surveyPaper.pdf, /^papers\/[a-z0-9-]+\.pdf$/);
  const pdf = await readFile(new URL(`../site/public/${surveyPaper.pdf}`, import.meta.url));
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  assert.match(pdf.subarray(-1024).toString(), /%%EOF/);
  assert.ok(Number.isInteger(surveyPaper.pages) && surveyPaper.pages > 0);
  assert.match(surveyPaper.published, /^\d{4}-\d{2}-\d{2}$/);
});

test("README features the same survey before the video and catalog generation preserves it", async () => {
  const original = await readFile(new URL("../README.md", import.meta.url), "utf8");
  for (const readme of [original, renderReadme(original)]) {
    const start = readme.indexOf("## Our survey");
    const end = readme.indexOf("Watch the walkthrough");
    assert.ok(start >= 0 && end > start);
    const section = readme.slice(start, end);
    assert.ok(section.includes(`[${surveyPaper.title}](site/public/${surveyPaper.pdf})`));
    assert.equal(section.split(`](site/public/${surveyPaper.pdf})`).length - 1, 1);
    assert.doesNotMatch(section, /\b\d+\s+pages\b/);
  }
});

test("README shows a linked, full-width overview image after the survey title", async () => {
  const imagePath = "assets/readme/survey-overview.png";
  const image = await readFile(new URL(`../${imagePath}`, import.meta.url));
  assert.deepEqual([...image.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  const original = await readFile(new URL("../README.md", import.meta.url), "utf8");
  for (const readme of [original, renderReadme(original)]) {
    const section = readme.slice(readme.indexOf("## Our survey"), readme.indexOf("Watch the walkthrough"));
    const imageStart = section.indexOf(`<a href="${imagePath}">`);
    const titleStart = section.indexOf(`[${surveyPaper.title}]`);
    assert.ok(titleStart >= 0 && imageStart > titleStart);
    const imageMarkup = section.slice(imageStart, section.indexOf("</a>", imageStart));
    assert.ok(imageMarkup.includes(`src="${imagePath}"`));
    assert.match(imageMarkup, /width="100%"/);
    assert.match(imageMarkup, /alt="[^\"]+"/);
  }
});

test("both homepage languages have survey copy and identify the PDF as English", () => {
  assert.ok(surveyPaper.title.trim());
  assert.ok(surveyPaper.titleZh.trim());
  for (const lang of ["en", "zh"]) {
    for (const field of ["eyebrow", "summary", "read"]) {
      assert.ok(surveyCopy[lang][field].trim(), `${lang}.${field}`);
    }
    assert.ok(surveyCopy[lang].format(surveyPaper.pages).includes(String(surveyPaper.pages)));
  }
  assert.match(surveyCopy.en.format(surveyPaper.pages), /English PDF/);
  assert.match(surveyCopy.zh.format(surveyPaper.pages), /英文 PDF/);
});
