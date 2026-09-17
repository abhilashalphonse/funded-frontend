import { supabase } from '../supabaseClient.js';

const API_URL = import.meta.env.VITE_API_URL || '';

async function accessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const token = data?.session?.access_token;
  if (!token) throw new Error('You need to be signed in.');
  return token;
}

async function request(path, options = {}) {
  const token = await accessToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.message || `Request failed (${response.status}).`);
  return payload.data;
}

export const customerApi = {
  workspace: () => request('/api/customer/workspace'),
  accounts: () => request('/api/customer/accounts'),
  createDemoAccount: () => request('/api/customer/demo-account', { method: 'POST', body: '{}' }),
  placeDemoOrder: (accountId, order) => request(`/api/customer/demo-account/${encodeURIComponent(accountId)}/orders`, {
    method: 'POST',
    body: JSON.stringify(order),
  }),
  closeDemoPosition: (accountId, positionId, price) => request(`/api/customer/demo-account/${encodeURIComponent(accountId)}/positions/${encodeURIComponent(positionId)}/close`, {
    method: 'POST',
    body: JSON.stringify({ price }),
  }),
};
