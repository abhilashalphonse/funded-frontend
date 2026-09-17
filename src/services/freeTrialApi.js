import { supabase } from "../supabaseClient.js";

const API_URL = String(import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function accessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  const token = data?.session?.access_token;
  if (!token) {
    const authError = new Error("Please sign in to continue.");
    authError.code = "AUTHENTICATION_REQUIRED";
    throw authError;
  }

  return token;
}

async function request(path, options = {}) {
  const token = await accessToken();
  const response = await fetch(`${API_URL}/api/free-trials${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.message || "Free Trial request failed.");
    error.code = data?.code;
    error.details = data?.details;
    error.activeTrialId = data?.activeTrialId;
    error.status = response.status;
    throw error;
  }

  return data?.data;
}

export function getFreeTrialEligibility() {
  return request("/eligibility");
}

export function getActiveFreeTrial() {
  return request("/active");
}

export function getFreeTrialHistory() {
  return request("/history");
}

export function createFreeTrial(challengeDefinition, commercialConfig, platform) {
  return request("", {
    method: "POST",
    body: JSON.stringify({
      challengeDefinition,
      commercialConfig,
      ...(platform ? { platform } : {}),
    }),
  });
}

export function cancelFreeTrial(accountId) {
  return request(`/${encodeURIComponent(accountId)}/cancel`, {
    method: "POST",
  });
}


export function createFreeTrialTradingSession(accountId) {
  return request(`/${encodeURIComponent(accountId)}/trading-session`, {
    method: "POST",
  });
}
