import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { surveyPaper } from "../site/src/data/survey.js";
import { surveyCopy } from "../site/src/i18n.js";
import { renderReadme } from "./generate-readme.mjs";

test("the featured survey links directly to its arXiv PDF", async () => {
  assert.equal(surveyPaper.pdf, "https://arxiv.org/pdf/2610.14625");
  const feature = await readFile(new URL("../site/src/components/SurveyFeature.jsx", import.meta.url), "utf8");
  assert.match(feature, /const pdfUrl = surveyPaper\.pdf;/);
  assert.doesNotMatch(feature, /import\.meta\.env\.BASE_URL/);
  assert.equal(feature.match(/href=\{pdfUrl\}/g)?.length, 1);
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

test("the survey sits on the home page between Recently added and the blog, not in articles", async () => {
  const app = await readFile(new URL("../site/src/App.jsx", import.meta.url), "utf8");
  const home = await readFile(new URL("../site/src/components/HomePage.jsx", import.meta.url), "utf8");
  const blog = await readFile(new URL("../site/src/components/BlogTab.jsx", import.meta.url), "utf8");
  assert.doesNotMatch(app, /SurveyFeature/);
  assert.doesNotMatch(blog, /SurveyFeature/);
  const page = home.slice(home.indexOf("export default function HomePage("));
  assert.match(page, /<SurveyFeature lang=\{lang\} \/>/);
  assert.ok(page.indexOf("<RecentlyAdded") < page.indexOf("<SurveyFeature"));
  assert.ok(page.indexOf("<SurveyFeature") < page.indexOf("<FromTheBlog"));
  assert.equal(home.match(/<SurveyFeature\b/g)?.length, 1);
});

test("the survey styles stay independent of the hero and avoid a one-sided accent border", async () => {
  const css = await readFile(new URL("../site/src/styles.css", import.meta.url), "utf8");
  for (const [, rule] of css.matchAll(/\.survey-[a-z-]+\s*\{([^}]+)\}/g)) {
    assert.doesNotMatch(rule, /border-(?:left|inline-start)/);
  }
  assert.doesNotMatch(css, /\.home-hero\s+\.survey-summary/);
  assert.match(css, /\.survey-summary\s*\{[^}]*margin:\s*0;/);
});

test("the survey entry links only to the paper, not to the guide", async () => {
  const feature = await readFile(new URL("../site/src/components/SurveyFeature.jsx", import.meta.url), "utf8");
  assert.doesNotMatch(feature, /survey-guide-link|#blog\/understanding-rsi/);
});

test("the survey notice shows the date without PDF language or page-count metadata", async () => {
  const feature = await readFile(new URL("../site/src/components/SurveyFeature.jsx", import.meta.url), "utf8");
  assert.match(feature, /<time className="survey-meta" dateTime=\{surveyPaper.published\}>\{date\}<\/time>/);
  assert.doesNotMatch(feature, /surveyPaper\.pages|copy\.format\(/);
});

test("both languages have survey copy", () => {
  assert.ok(surveyPaper.title.trim());
  assert.ok(surveyPaper.titleZh.trim());
  for (const lang of ["en", "zh"]) {
    for (const field of ["eyebrow", "summary", "imageAlt"]) {
      assert.ok(surveyCopy[lang][field].trim(), `${lang}.${field}`);
    }
  }
});
