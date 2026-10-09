const validDate = value => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
};

const dateLabel = value => {
  const date = validDate(value);
  return date
    ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;
};

export function formatTimeSince(value, now = Date.now()) {
  const date = validDate(value);
  if (!date) return null;
  const milliseconds = Math.max(0, now - date.getTime());
  const seconds = Math.floor(milliseconds / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// A lifecycle event is not the same thing as a trading valuation snapshot.
// Never describe account.updatedAt as a trading-platform sync or as a breach time.
export function accountTimelineLabel(account, now = Date.now()) {
  if (!account) return "Waiting for account data";
  const status = String(account.status || "").toUpperCase();
  const result = String(account.trial?.result || "").toUpperCase();

  if (status === "BREACHED") {
    const when = dateLabel(
      account.breach?.breachedAt
      || account.projections?.breachedAt
      || (result === "BREACHED" ? account.trial?.completedAt : null),
    );
    return when ? `Breached on ${when}` : "Breached";
  }

  if (status === "PASSED") {
    const when = dateLabel(
      (result === "PASSED" ? account.trial?.completedAt : null)
      || account.projections?.passedAt,
    );
    return when ? `Passed on ${when}` : "Passed";
  }

  if (status === "CLOSED") {
    if (result === "CANCELLED") {
      const when = dateLabel(account.trial?.cancelledAt);
      return when ? `Cancelled on ${when}` : "Cancelled";
    }
    return "Closed";
  }

  if (status === "EXPIRED") {
    const when = dateLabel(account.trial?.expiresAt);
    return when ? `Expired on ${when}` : "Expired";
  }

  if (status === "LOCKED") return "Trading locked";
  if (status === "FUNDED_REVIEW") return "Awaiting Master Review";

  const synced = formatTimeSince(account.lastPlatformSnapshotAt, now);
  if (synced) return `Last synced ${synced}`;
  const updated = formatTimeSince(account.updatedAt, now);
  return updated ? `Account updated ${updated}` : "Waiting for account data";
}
