import { BASE_URL, authHeaders, handleResponse } from './apiClient';

const ADMIN_BASE = `${BASE_URL}/admin`;

export async function getAdminStats(fromDate, toDate, token) {
  const params = fromDate && toDate ? `?from=${fromDate}&to=${toDate}` : '';
  const res = await fetch(`${ADMIN_BASE}/stats${params}`, { headers: { ...authHeaders(token) } });
  return handleResponse(res);
}

export async function getAdminProducts(page = 1, q = '', token) {
  const res = await fetch(`${ADMIN_BASE}/products?page=${page}&q=${encodeURIComponent(q)}`, { headers: { ...authHeaders(token) } });
  return handleResponse(res);
}

export async function createProduct(payload, token) {
  const res = await fetch(`${ADMIN_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateProduct(id, payload, token) {
  const res = await fetch(`${ADMIN_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function toggleProductActive(id, token) {
  const res = await fetch(`${ADMIN_BASE}/products/${id}/toggle`, { method: 'POST', headers: { ...authHeaders(token) } });
  return handleResponse(res);
}
