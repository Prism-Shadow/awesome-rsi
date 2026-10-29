import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { surveyPaper } from "../site/src/data/survey.js";
import { appCopy, surveyCopy } from "../site/src/i18n.js";
import { renderReadme } from "./generate-readme.mjs";

test("the featured survey links directly to its arXiv PDF", async () => {
  assert.equal(surveyPaper.pdf, "https://arxiv.org/pdf/2610.14625");
  const feature = await readFile(new URL("../site/src/components/SurveyFeature.jsx", import.meta.url), "utf8");
  assert.match(feature, /const pdfUrl = surveyPaper\.pdf;/);
  assert.doesNotMatch(feature, /import\.meta\.env\.BASE_URL/);
  assert.equal(feature.match(/href=\{pdfUrl\}/g)?.length, 2);
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
    assert.ok(section.includes(`[${surveyPaper.title}](${surveyPaper.pdf})`));
    assert.equal(section.split(`](${surveyPaper.pdf})`).length - 1, 1);
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

test("the survey entry belongs to the Blog index, not the global hero or individual articles", async () => {
  const app = await readFile(new URL("../site/src/App.jsx", import.meta.url), "utf8");
  const blog = await readFile(new URL("../site/src/components/BlogTab.jsx", import.meta.url), "utf8");
  assert.doesNotMatch(app, /SurveyFeature/);
  const index = blog.slice(blog.indexOf("function BlogIndex("), blog.indexOf("function BlogArticle("));
  assert.match(index, /<SurveyFeature lang=\{lang\} \/>/);
  assert.ok(index.indexOf("<SurveyFeature") < index.indexOf('className="blog-post-list"'));
  assert.equal(blog.match(/<SurveyFeature\b/g)?.length, 1);
});

test("the survey uses an even border and summary styles independent of the hero", async () => {
  const css = await readFile(new URL("../site/src/styles.css", import.meta.url), "utf8");
  const feature = css.match(/\.survey-feature\s*\{([^}]+)\}/)?.[1];
  assert.ok(feature);
  assert.match(feature, /border:\s*1px solid var\(--line\)/);
  assert.doesNotMatch(feature, /border-(?:left|inline-start)/);
  assert.doesNotMatch(css, /\.hero\s+\.survey-summary/);
  assert.match(css, /\.survey-summary\s*\{[^}]*margin:\s*0;/);
});

test("the complete guide keeps its original hero entry, separate from the survey notice", async () => {
  const app = await readFile(new URL("../site/src/App.jsx", import.meta.url), "utf8");
  const feature = await readFile(new URL("../site/src/components/SurveyFeature.jsx", import.meta.url), "utf8");
  const hero = app.slice(app.indexOf('<section className="hero">'), app.indexOf("</section>"));
  assert.match(hero, /className="hero-guide-link"/);
  assert.match(hero, /href="#blog\/understanding-rsi"/);
  assert.match(hero, /<span>\{copy.guideEyebrow\}<\/span>/);
  assert.match(hero, /\{copy.guideLink\}/);
  assert.equal(appCopy.en.guideEyebrow, "START HERE");
  assert.equal(appCopy.en.guideLink, "New to RSI? Read the complete guide");
  assert.equal(appCopy.zh.guideEyebrow, "从这里开始");
  assert.equal(appCopy.zh.guideLink, "初次了解 RSI？阅读完整导读");
  assert.doesNotMatch(feature, /survey-guide-link|#blog\/understanding-rsi/);
});

test("the survey notice shows the date without PDF language or page-count metadata", async () => {
  const feature = await readFile(new URL("../site/src/components/SurveyFeature.jsx", import.meta.url), "utf8");
  assert.match(feature, /<time className="survey-meta" dateTime=\{surveyPaper.published\}>\{date\}<\/time>/);
  assert.doesNotMatch(feature, /surveyPaper\.pages|copy\.format\(/);
});

test("both Blog languages have survey copy", () => {
  assert.ok(surveyPaper.title.trim());
  assert.ok(surveyPaper.titleZh.trim());
  for (const lang of ["en", "zh"]) {
    for (const field of ["eyebrow", "summary", "read"]) {
      assert.ok(surveyCopy[lang][field].trim(), `${lang}.${field}`);
    }
  }
});
