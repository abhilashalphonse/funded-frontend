const API_URL = String(import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const ANALYTICS_ID_KEY = "acg.analytics.anonymousId";

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getAnalyticsAnonymousId() {
  try {
    let value = localStorage.getItem(ANALYTICS_ID_KEY);
    if (!value) {
      value = makeId();
      localStorage.setItem(ANALYTICS_ID_KEY, value);
    }
    return value;
  } catch {
    return makeId();
  }
}

export async function trackAcquisitionEvent(name, metadata = {}) {
  if (!API_URL) return;

  try {
    await fetch(`${API_URL}/api/analytics/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        anonymousId: getAnalyticsAnonymousId(),
        metadata,
      }),
      keepalive: true,
    });
  } catch {
    // Analytics must never block the acquisition flow.
  }
}
