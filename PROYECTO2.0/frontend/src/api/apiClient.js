export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export function authHeaders(token) {
  // If token not provided, try reading from localStorage so callers don't have to pass it everywhere
  let tk = token;
  try {
    if (!tk) tk = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  } catch (e) {
    tk = token;
  }
  return tk ? { Authorization: `Bearer ${tk}` } : {};
}

export async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    // try parse json error, otherwise return status text
    if (contentType.includes('application/json')) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw err;
    }
    throw { message: res.statusText };
  }
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}
