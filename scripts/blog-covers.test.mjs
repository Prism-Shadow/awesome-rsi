import assert from "node:assert/strict";
import test from "node:test";
import { access, readFile } from "node:fs/promises";

// The post data imports Markdown with Vite's ?raw suffix, so read the source instead of importing it.
test("every blog cover set in the post data exists and is a small WebP", async () => {
  for (const file of ["blogPosts.js", "blogPosts.zh.js"]) {
    const source = await readFile(new URL(`../site/src/data/${file}`, import.meta.url), "utf8");
    const covers = [...source.matchAll(/^\s+cover: "([^"]+)",$/gm)].map(([, path]) => path);
    assert.ok(covers.length > 0, `${file}: no covers`);
    for (const cover of covers) {
      assert.match(cover, /^blog\/.+\.webp$/, cover);
      const url = new URL(`../site/public/${cover}`, import.meta.url);
      await access(url);
      assert.ok((await readFile(url)).length < 150_000, `${cover} is too large for a list thumbnail`);
    }
  }
});
