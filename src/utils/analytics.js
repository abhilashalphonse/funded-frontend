const API_URL = import.meta.env.VITE_API_URL || "";

const SESSION_KEY = "acg:analyticsSessionId";
const ATTRIBUTION_KEY = "acg:attribution";

function randomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `acg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getAnalyticsSessionId() {
  if (typeof window === "undefined") return "server";
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = randomId();
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function deviceType() {
  if (typeof window === "undefined") return "unknown";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function captureAttribution() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const current = JSON.parse(window.localStorage.getItem(ATTRIBUTION_KEY) || "{}");

  const next = {
    ...current,
    utmSource: params.get("utm_source") || current.utmSource,
    utmMedium: params.get("utm_medium") || current.utmMedium,
    utmCampaign: params.get("utm_campaign") || current.utmCampaign,
    utmContent: params.get("utm_content") || current.utmContent,
    utmTerm: params.get("utm_term") || current.utmTerm,
    referral: params.get("ref") || current.referral,
    affiliate: params.get("affiliate") || params.get("aff") || current.affiliate,
    landingVariant: params.get("variant") || current.landingVariant,
  };

  window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(next));
  return next;
}

export function getAttribution() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(ATTRIBUTION_KEY) || "{}");
  } catch {
    return {};
  }
}

export async function trackEvent(event, properties = {}, options = {}) {
  if (typeof window === "undefined") return;
  const payload = {
    event,
    sessionId: getAnalyticsSessionId(),
    attribution: getAttribution(),
    context: {
      path: window.location.pathname + window.location.search,
      referrer: document.referrer || "",
      device: deviceType(),
      entryIntent: options.entryIntent,
    },
    properties,
    occurredAt: new Date().toISOString(),
  };

  try {
    const token = options.getAccessToken ? await options.getAccessToken().catch(() => null) : null;
    await fetch(`${API_URL}/api/analytics/events`, {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Analytics must never block the product flow.
  }
}
