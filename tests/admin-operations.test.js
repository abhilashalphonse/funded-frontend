import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/components/admin/AdminDashboard.jsx", import.meta.url), "utf8");
const grid = readFileSync(new URL("../src/components/admin/AdminDataGrid.jsx", import.meta.url), "utf8");

test("mobile record cards present status without expanding hidden fields", () => {
  assert.match(grid, /const statusColumn = columns\.find\(c => c\.key === "status"\)/);
  assert.match(grid, /\{statusColumn && <div aria-label="Record status"/);
  assert.match(grid, /More fields/);
});

test("operator errors do not replace the entire table or discard partial success", () => {
  assert.match(source, /err\.code = payload\?\.code/);
  assert.match(source, /err\.details = payload\?\.data/);
  assert.match(source, /TRADING_PLATFORM_CONTROL_PARTIAL_FAILURE/);
  assert.match(source, /Customer status was changed, but/);
  assert.match(source, /fixed right-3 top-16 z-\[80\]/);
});

test("risk action center uses the UTC today server filter and actual category counts", () => {
  assert.match(source, /"breaches-today" \? "\/risk\?breached=today"/);
  assert.match(source, /\["Breaches today",[^\n]*"breaches-today"\]/);
  assert.match(source, /data\?\.counts \|\| \{\}/);
  assert.match(source, /data\?\.fundedReview \|\| \[\]/);
});

test("customer support history and separate finance views remain accessible", () => {
  assert.match(source, /\["support", "Support"\]/);
  assert.match(source, /openSupportFromCustomer/);
  assert.match(source, /selectedDetail\.support \|\| \[\]/);
  assert.match(source, /page === "orders" \? orderColumns : paymentColumns/);
});

test("privileged controls defer to the server-reported admin role", () => {
  assert.match(source, /adminFetch\("\/me"\)/);
  assert.match(source, /canOperate\("FINANCE_WRITE"\)/);
  assert.match(source, /canOperate\("RISK_WRITE"\)/);
  assert.match(source, /canOperate\("SUPPORT_WRITE"\)/);
});
