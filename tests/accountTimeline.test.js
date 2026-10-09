import test from "node:test";
import assert from "node:assert/strict";
import { accountTimelineLabel, formatTimeSince } from "../src/utils/accountTimeline.js";

const now = Date.parse("2026-10-09T10:00:00Z");

test("format elapsed snapshot time in seconds, minutes, hours and days", () => {
  assert.equal(formatTimeSince(new Date(now - 2_000), now), "just now");
  assert.equal(formatTimeSince(new Date(now - 45_000), now), "45s ago");
  assert.equal(formatTimeSince(new Date(now - 1196 * 60_000), now), "19h ago");
  assert.equal(formatTimeSince(new Date(now - 25 * 3600_000), now), "1d ago");
  assert.equal(formatTimeSince("invalid", now), null);
});

test("breach event date takes priority over fresh snapshots and account updates", () => {
  assert.equal(accountTimelineLabel({
    status: "BREACHED",
    breach: { breachedAt: "2026-10-08T15:20:00Z" },
    lastPlatformSnapshotAt: "2026-10-09T09:59:00Z",
    updatedAt: "2026-10-09T09:59:00Z",
  }, now), "Breached on Oct 8, 2026");
});

test("a passed trial uses actual completion timestamp", () => {
  assert.equal(accountTimelineLabel({
    status: "PASSED",
    accountMode: "DEMO",
    trial: { result: "PASSED", completedAt: "2026-10-07T10:00:00Z" },
  }, now), "Passed on Oct 7, 2026");
});

test("never invent terminal transition dates from updatedAt", () => {
  assert.equal(accountTimelineLabel({ status: "CLOSED", updatedAt: "2026-10-08" }, now), "Closed");
  assert.equal(accountTimelineLabel({ status: "BREACHED", updatedAt: "2026-10-08" }, now), "Breached");
  assert.equal(accountTimelineLabel({ status: "PASSED", updatedAt: "2026-10-08" }, now), "Passed");
  assert.equal(accountTimelineLabel({ status: "LOCKED", updatedAt: "2026-10-08" }, now), "Trading locked");
});

test("differentiate snapshots from generic account updates", () => {
  assert.equal(accountTimelineLabel({ status: "ACTIVE", lastPlatformSnapshotAt: new Date(now - 90_000) }, now), "Last synced 1m ago");
  assert.equal(accountTimelineLabel({ status: "ACTIVE", updatedAt: new Date(now - 90_000) }, now), "Account updated 1m ago");
  assert.equal(accountTimelineLabel({ status: "ACTIVE" }, now), "Waiting for account data");
});

test("trial cancellation and expiry display their own lifecycle dates", () => {
  assert.equal(accountTimelineLabel({
    status: "CLOSED", trial: { result: "CANCELLED", cancelledAt: "2026-10-08T09:00:00Z" },
  }, now), "Cancelled on Oct 8, 2026");
  assert.equal(accountTimelineLabel({
    status: "EXPIRED", trial: { expiresAt: "2026-10-08T09:00:00Z" },
  }, now), "Expired on Oct 8, 2026");
});
