import assert from "node:assert/strict";
import test from "node:test";
import { access, readFile } from "node:fs/promises";
import { blogPosts } from "../site/src/data/blogPosts.js";
import { blogPostsZh } from "../site/src/data/blogPosts.zh.js";

test("every blog cover set in the post data exists and is a small WebP", async () => {
  const covers = [...blogPosts, ...blogPostsZh].map(({ cover }) => cover).filter(Boolean);
  assert.ok(covers.length > 0);
  for (const cover of covers) {
    assert.match(cover, /^blog\/.+\.webp$/, cover);
    const url = new URL(`../site/public/${cover}`, import.meta.url);
    await access(url);
    assert.ok((await readFile(url)).length < 150_000, `${cover} is too large for a list thumbnail`);
  }
});

test("Markdown posts have covers and point their images at files under public/blog/", async () => {
  for (const lang of ["en", "zh"]) {
    for (const post of lang === "en" ? blogPosts : blogPostsZh) {
      if (post.sections) continue;
      assert.ok(post.cover, `${post.id}: Markdown posts need a cover for the post list`);
      const file = { "rsi-deep-learning": "rsi-deep-learning", "understanding-rsi": "rsi-guide" }[post.id];
      const markdown = await readFile(new URL(`../site/src/data/blog/${file}.${lang}.md`, import.meta.url), "utf8");
      for (const [, src] of markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
        if (/^https?:/.test(src)) continue;
        assert.match(src, /^blog\//, `${post.id}: ${src}`);
        await access(new URL(`../site/public/${src.replace(/\\(.)/g, "$1")}`, import.meta.url));
      }
    }
  }
});
