import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/components/admin/AdminDashboard.jsx", import.meta.url), "utf8");

test("admin records have mobile cards without removing desktop table columns", () => {
  assert.match(source, /className="space-y-2 md:hidden" aria-label="Records"/);
  assert.match(source, /className="hidden min-w-0 overflow-hidden rounded-xl/);
  assert.match(source, /columns\.slice\(1, 5\)/);
  assert.match(source, /columns\.slice\(5\)/);
  assert.match(source, /onClick=\{\(\) => onRow\(row\)\}/);
  assert.match(source, /More fields \(\{columns\.length - 5\}\)/);
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
