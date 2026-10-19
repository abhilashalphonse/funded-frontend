import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/components/admin/AdminDashboard.jsx", import.meta.url), "utf8");
const primary = source.split("const NAV = [")[1]?.split("const WORKSPACE_TABS")[0] || "";
const tabs = source.split("const WORKSPACE_TABS = {")[1]?.split("const UNAVAILABLE_WORKSPACE_PAGES")[0] || "";

test("admin has a focused, human-oriented primary navigation", () => {
  const ids = [...primary.matchAll(/\{ id: "([^"]+)", label: /g)].map(match => match[1]);
  assert.deepEqual(ids, ["overview", "users", "challenges", "orders", "risk", "support", "funnel", "integrations"]);
});

test("core operator domains offer contextual tabs rather than sidebar clutter", () => {
  for (const label of ["Paid Challenges", "Free Trials", "Funded Accounts", "Payouts", "Breaches", "Revenue", "Audit Log"]) {
    assert.ok(tabs.includes(`label: "${label}"`), `Missing tab: ${label}`);
  }
  for (const moduleId of ["refunds", "affiliates", "products", "pricing", "jobs", "errors"]) {
    assert.ok(!tabs.includes(`id: "${moduleId}"`), `Unconnected module exposed: ${moduleId}`);
  }
});

test("customer and account inspectors preserve accessible review paths", () => {
  assert.match(source, /aria-label="Customer profile sections"/);
  assert.match(source, /aria-label="Account detail sections"/);
  assert.match(source, /Back to customer/);
  assert.match(source, /\["challenges", "trials", "funded", "breaches", "risk", "trades"\]\.includes\(page\)/);
});

test("command center prioritizes existing operational queues", () => {
  assert.match(source, /Action Center/);
  assert.match(source, /openQueue\(destination, nextQueue\)/);
  assert.match(source, /Payout summaries above cover only the records loaded on this page/);
});
