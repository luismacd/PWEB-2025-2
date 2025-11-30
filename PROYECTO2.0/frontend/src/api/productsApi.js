import { BASE_URL, handleResponse } from './apiClient';

const PRODUCTS_BASE = `${BASE_URL}/productos`;

export async function fetchTopProducts(limit = 8) {
  const res = await fetch(`${PRODUCTS_BASE}?limit=${limit}`);
  const data = await handleResponse(res);
  return (data && data.productos) ? data.productos : [];
}

export async function fetchProductsPage(page = 1, limit = 8) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  const res = await fetch(`${PRODUCTS_BASE}?${params.toString()}`);
  const data = await handleResponse(res);
  // Expect { productos: [...], total }
  return data || { productos: [], total: 0 };
}

export async function fetchHomeSeries(limit = 6) {
  const params = new URLSearchParams();
  params.set('categoria', 'Series');
  params.set('limit', String(limit));
  const res = await fetch(`${PRODUCTS_BASE}?${params.toString()}`);
  const data = await handleResponse(res);
  return (data && data.productos) ? data.productos : [];
}

export async function fetchRecentProducts(limit = 8) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('sortBy', 'recientes');
  const res = await fetch(`${PRODUCTS_BASE}?${params.toString()}`);
  const data = await handleResponse(res);
  return (data && data.productos) ? data.productos : [];
}

export async function searchProducts(q = '', sort, category, page = 1) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (sort) params.set('sortBy', sort);
  if (category) params.set('categoria', category);
  params.set('page', String(page));
  const res = await fetch(`${PRODUCTS_BASE}?${params.toString()}`);
  const data = await handleResponse(res);
  return (data && data.productos) ? data.productos : [];
}

export async function getProductById(id) {
  const res = await fetch(`${PRODUCTS_BASE}/${id}`);
  const data = await handleResponse(res);
  // Normalize response shape: some backends return { producto: {...} }
  if (data && data.producto) return data.producto;
  return data;
}

export default { fetchTopProducts, fetchHomeSeries, searchProducts, getProductById };
