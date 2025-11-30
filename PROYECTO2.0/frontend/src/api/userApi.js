import { BASE_URL, authHeaders, handleResponse } from './apiClient';

export async function fetchUser(id, token) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, { headers: { ...authHeaders(token) } });
  return handleResponse(res);
}

export async function updateUser(id, body, token) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export default { fetchUser, updateUser };
