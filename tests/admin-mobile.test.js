import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/components/admin/AdminDashboard.jsx", import.meta.url), "utf8");
const grid = readFileSync(new URL("../src/components/admin/AdminDataGrid.jsx", import.meta.url), "utf8");

test("admin grid renders mobile record cards and a retained desktop table", () => {
  assert.match(source, /<AdminDataGrid key=\{inferredId\}/);
  assert.match(grid, /md:hidden" aria-label="Records"/);
  assert.match(grid, /md:table/);
  assert.match(grid, /sticky top-0 z-20/);
  assert.match(grid, /More fields/);
  assert.match(grid, /onClick=\{\(\) => openRow\(row\)\}/);
});

test("mobile workspace and account section pickers use existing navigation functions", () => {
  assert.match(source, /id="admin-section-select" value=\{page\} onChange=\{e => changePage\(e\.target\.value\)\}/);
  assert.match(source, /id="account-detail-section" value=\{accountTab\} onChange=\{e => setAccountTab\(e\.target\.value\)\}/);
});

test("mobile inspectors and operation confirmations fit dynamic viewport", () => {
  assert.match(source, /h-\[100dvh\] w-full min-w-0 max-w-2xl/);
  assert.match(source, /max-h-\[calc\(100dvh-2rem\)\]/);
  assert.match(source, /aria-label="Close details"/);
});

test("compact KPI layout preserves desktop breakpoints", () => {
  assert.match(source, /grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-4/);
  assert.match(source, /text-\[19px\].*sm:text-\[24px\]/);
});
