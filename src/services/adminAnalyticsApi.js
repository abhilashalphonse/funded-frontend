import { supabase } from "../supabaseClient.js";

const API_URL = String(import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export async function getAdminAcquisitionFunnel(days = 30) {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  const token = data?.session?.access_token;
  if (!token) throw new Error("Admin authentication required.");

  const response = await fetch(
    `${API_URL}/api/admin/analytics/acquisition?days=${encodeURIComponent(days)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.message || "Unable to load acquisition analytics.");
  return payload?.data;
}
