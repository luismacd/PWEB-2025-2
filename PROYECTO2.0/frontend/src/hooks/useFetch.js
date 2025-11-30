export default async function useFetch(url, opts) {
  const res = await fetch(url, opts);
  return res.json();
}
