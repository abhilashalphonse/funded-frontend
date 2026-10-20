import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const dashboard = readFileSync(new URL("../src/components/admin/AdminDashboard.jsx", import.meta.url), "utf8");
const grid = readFileSync(new URL("../src/components/admin/AdminDataGrid.jsx", import.meta.url), "utf8");

test("server pagination offers row count, first last and page jumping on every result set", () => {
  assert.match(dashboard, /function Pagination\(\{ pagination, onPage, pageSize, onPageSize \}\)/);
  assert.doesNotMatch(dashboard, /if \(!pagination \|\| Number\(pagination\.pages \|\| 1\) <= 1\)/);
  assert.match(dashboard, /aria-label="Rows per page"/);
  assert.match(dashboard, /aria-label="Jump to page"/);
  assert.match(dashboard, /<option key=\{n\} value=\{n\}>/);
  assert.match(dashboard, /onPageSize=\{size => \{ setListLimit\(size\); setListPage\(1\); \}\}/);
  assert.match(dashboard, /limit=\$\{listLimit\}/);
});

test("shared grid provides column visibility ordering widths and saved density", () => {
  assert.match(grid, /aria-controls=\{"grid-columns-" \+ tableId\}/);
  assert.match(grid, /checked=\{!settings\.hidden\.includes\(col\.key\)\}/);
  assert.match(grid, /onClick=\{\(\) => moveColumn\(col\.key, -1\)\}/);
  assert.match(grid, /onClick=\{\(\) => moveColumn\(col\.key, 1\)\}/);
  assert.match(grid, /aria-label=\{"Width of " \+ col\.label\}/);
  assert.match(grid, /localStorage\.setItem\(settingsKey, JSON\.stringify\(settings\)\)/);
  assert.match(grid, /Comfortable rows/);
  assert.match(grid, /Compact rows/);
});

test("scroll viewport and sorting work on desktop and mobile", () => {
  assert.match(grid, /max-h-\[min\(65dvh,740px\)\]/);
  assert.match(grid, /overflow-auto overscroll-contain/);
  assert.match(grid, /sticky top-0 z-20/);
  assert.match(grid, /sticky left-0/);
  assert.match(grid, /aria-sort=\{sort\.key === col\.key/);
  assert.match(grid, /aria-label="Sort records by"/);
});

test("per-column filters disclose server paging scope instead of implying whole-database filtering", () => {
  assert.match(grid, /Filter by column/);
  assert.match(grid, /These column filters search loaded rows on this page only/);
  assert.match(grid, /Use the main search and status controls to query all records on the server/);
  assert.match(grid, /pageLocalRows\(filtered, localPage, localSize\)/);
});
