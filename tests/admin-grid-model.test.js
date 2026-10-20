import test from "node:test";
import assert from "node:assert/strict";
import { applyGridOperations, orderColumns, pageLocalRows, pageRange } from "../src/components/admin/adminGridModel.js";

const cols = [
  { key: "accountId", label: "Account" },
  { key: "status", label: "Status" },
  { key: "amount", label: "Amount" },
];
const values = [
  { accountId: "ACG-10", status: "FAILED", amount: 450 },
  { accountId: "ACG-2", status: "PAID", amount: 80 },
  { accountId: "ACG-1", status: "FAILED", amount: 100 },
];
const getValue = (row, col) => row[col.key];

test("column layout reorders known fields and ignores stale schema keys", () => {
  assert.deepEqual(orderColumns(cols, { order: ["status", "missing", "accountId"] }).map(x => x.key),
    ["status", "accountId", "amount"]);
  assert.deepEqual(orderColumns(cols).map(x => x.key), ["accountId", "status", "amount"]);
});

test("per-column filtering is case-insensitive and combines with AND semantics", () => {
  assert.deepEqual(
    applyGridOperations(values, cols, { status: "fail", accountId: "1" }, {}, getValue).map(row => row.accountId),
    ["ACG-10", "ACG-1"]
  );
  assert.deepEqual(
    applyGridOperations(values, cols, { status: "paid" }, {}, getValue).map(row => row.accountId),
    ["ACG-2"]
  );
  assert.equal(applyGridOperations(values, cols, { nonexistent: "nothing" }, {}, getValue).length, 3);
});

test("numeric sorting is numeric, and account IDs sort naturally", () => {
  assert.deepEqual(applyGridOperations(values, cols, {}, { key: "amount", direction: "asc" }, getValue).map(r => r.amount),
    [80, 100, 450]);
  assert.deepEqual(applyGridOperations(values, cols, {}, { key: "accountId", direction: "asc" }, getValue).map(r => r.accountId),
    ["ACG-1", "ACG-2", "ACG-10"]);
  assert.deepEqual(values.map(r => r.accountId), ["ACG-10", "ACG-2", "ACG-1"], "sorting must not mutate source rows");
});

test("local pagination handles zero records, last page and out-of-range requests", () => {
  assert.deepEqual(pageLocalRows([], 3, 10), { pages: 1, currentPage: 1, rows: [] });
  const twentySix = Array.from({ length: 26 }, (_, i) => i + 1);
  const final = pageLocalRows(twentySix, 99, 10);
  assert.equal(final.pages, 3);
  assert.equal(final.currentPage, 3);
  assert.deepEqual(final.rows, [21, 22, 23, 24, 25, 26]);
});

test("pagination range reports the backend total, not loaded rows", () => {
  assert.deepEqual(pageRange({ page: 2, limit: 25, total: 81 }), { from: 26, to: 50, total: 81, pages: 4 });
  assert.deepEqual(pageRange({ page: 1, limit: 25, total: 0 }), { from: 0, to: 0, total: 0, pages: 1 });
});

test("large loaded tables are paginated rather than all rendered", () => {
  const big = Array.from({ length: 10000 }, (_, i) => ({ accountId: "ACG-" + i, amount: i }));
  const { rows } = pageLocalRows(big, 5, 50);
  assert.equal(rows.length, 50);
  assert.equal(rows[0].amount, 200);
  assert.equal(rows.at(-1).amount, 249);
});
