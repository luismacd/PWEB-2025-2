import { BASE_URL, authHeaders, handleResponse } from './apiClient';

export async function fetchOrders(token) {
  const res = await fetch(`${BASE_URL}/ordenes`, { headers: { ...authHeaders(token) } });
  return handleResponse(res);
}

export async function fetchOrder(id, token) {
  const res = await fetch(`${BASE_URL}/ordenes/${id}`, { headers: { ...authHeaders(token) } });
  return handleResponse(res);
}

export default { fetchOrders, fetchOrder };
