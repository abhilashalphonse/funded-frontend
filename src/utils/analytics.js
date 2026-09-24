const API_URL = import.meta.env.VITE_API_URL || "";

const SESSION_KEY = "acg:analyticsSessionId";
const ATTRIBUTION_KEY = "acg:attribution";
const ATTRIBUTION_VERSION = 2;
const TOUCH_FIELDS = [
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmContent",
  "utmTerm",
  "referral",
  "affiliate",
  "landingVariant",
  "creatorId",
  "creativeId",
  "market",
  "language",
  "hook",
];

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

function readStoredAttribution() {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ATTRIBUTION_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function cleanValue(value, max = 256) {
  const text = String(value ?? "").trim();
  return text ? text.slice(0, max) : undefined;
}

function cleanTouch(value = {}) {
  const touch = {};
  for (const field of TOUCH_FIELDS) {
    const cleaned = cleanValue(value?.[field]);
    if (cleaned) touch[field] = cleaned;
  }
  if (value?.capturedAt) touch.capturedAt = value.capturedAt;
  return touch;
}

function hasTouch(touch = {}) {
  return TOUCH_FIELDS.some(field => Boolean(touch?.[field]));
}

function sameTouch(left = {}, right = {}) {
  return TOUCH_FIELDS.every(field => (left?.[field] || "") === (right?.[field] || ""));
}

function incomingTouch(params) {
  const raw = {
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmContent: params.get("utm_content"),
    utmTerm: params.get("utm_term"),
    referral: params.get("ref"),
    affiliate: params.get("affiliate") || params.get("aff"),
    landingVariant: params.get("variant"),
    creatorId: params.get("creator_id") || params.get("creator"),
    creativeId: params.get("creative_id") || params.get("creative"),
    market: params.get("market"),
    language: params.get("lang") || params.get("language"),
    hook: params.get("hook"),
  };
  const touch = cleanTouch(raw);
  if (!hasTouch(touch)) return null;
  touch.capturedAt = new Date().toISOString();
  return touch;
}

function publicAttribution(stored = {}) {
  const legacy = cleanTouch(stored);
  const firstTouch = hasTouch(cleanTouch(stored.firstTouch))
    ? cleanTouch(stored.firstTouch)
    : legacy;
  const lastTouch = hasTouch(cleanTouch(stored.lastTouch))
    ? cleanTouch(stored.lastTouch)
    : firstTouch;
  const flat = hasTouch(firstTouch) ? firstTouch : lastTouch;

  return {
    version: ATTRIBUTION_VERSION,
    anonymousId: cleanValue(stored.anonymousId, 128) || getAnalyticsSessionId(),
    ...(hasTouch(flat) ? flat : {}),
    ...(hasTouch(firstTouch) ? { firstTouch } : {}),
    ...(hasTouch(lastTouch) ? { lastTouch } : {}),
  };
}

export function captureAttribution() {
  if (typeof window === "undefined") return {};

  const current = readStoredAttribution();
  const migrated = publicAttribution(current);
  const incoming = incomingTouch(new URLSearchParams(window.location.search));

  let firstTouch = cleanTouch(migrated.firstTouch);
  let lastTouch = cleanTouch(migrated.lastTouch);

  if (incoming) {
    if (!hasTouch(firstTouch)) firstTouch = incoming;
    if (!hasTouch(lastTouch) || !sameTouch(lastTouch, incoming)) lastTouch = incoming;
  }

  const next = {
    version: ATTRIBUTION_VERSION,
    anonymousId: migrated.anonymousId || getAnalyticsSessionId(),
    ...(hasTouch(firstTouch) ? { firstTouch } : {}),
    ...(hasTouch(lastTouch) ? { lastTouch } : {}),
  };

  window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(next));
  return publicAttribution(next);
}

export function getAttribution() {
  if (typeof window === "undefined") return {};
  return publicAttribution(readStoredAttribution());
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
