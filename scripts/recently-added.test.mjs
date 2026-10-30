import assert from "node:assert/strict";
import test from "node:test";
import { methods } from "../site/src/data/methods.js";
import { systems } from "../site/src/data/systems.js";
import { papers } from "../site/src/data/papers.js";
import { collectionEntries, recentlyAdded } from "../site/src/lib/recentlyAdded.js";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

test("every method, system, and benchmark records the day it joined the collection", () => {
  for (const entry of [...methods, ...systems, ...papers]) {
    assert.match(entry.added ?? "", ISO_DATE, `${entry.id}: missing added date`);
    assert.ok(!Number.isNaN(Date.parse(entry.added)), `${entry.id}: invalid added date`);
  }
  // A paper cannot join the collection before it is posted; systems may ship newer releases later.
  for (const paper of [...methods, ...papers]) {
    assert.ok(paper.added >= paper.published, `${paper.id}: added ${paper.added} before published ${paper.published}`);
  }
  assert.equal(collectionEntries.length, methods.length + systems.length + papers.length);
});

test("the feed lists the newest additions first, grouped by day", () => {
  const days = recentlyAdded(collectionEntries, 10);
  assert.equal(days.flatMap((day) => day.entries).length, 10);
  const newest = collectionEntries.map((entry) => entry.added).sort().at(-1);
  assert.equal(days[0].date, newest);
  for (const [index, day] of days.entries()) {
    assert.ok(day.entries.every((entry) => entry.added === day.date), day.date);
    if (index > 0) assert.ok(day.date < days[index - 1].date, `${day.date} is out of order`);
  }
});

test("feed entries link to the paper and carry the tags shown on the home page", () => {
  for (const entry of collectionEntries) {
    assert.equal(new URL(entry.url).protocol, "https:", entry.id);
    if (entry.kind === "benchmark") assert.ok(entry.mode.length > 0, entry.id);
    else assert.ok(entry.artifact.length > 0, entry.id);
  }
});
