import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

function AdminSummary({ range }) {
  const { user } = useUser();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Use token directly (do not gate on user.role here) so we can diagnose issues
        const token = localStorage.getItem("token");
        if (!token) {
          console.debug('AdminSummary: no token found, skipping fetch');
          setLoading(false);
          return;
        }
        const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
        const q = range ? `?from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}` : "";
        console.debug('AdminSummary: fetching', `${API_URL}/admin/summary${q}`, headers);
        const res = await fetch(`${API_URL}/admin/summary${q}`, { headers });

        let data = null;
        try {
          data = await res.json();
        } catch (err) {
          // fallback: try to read text and parse
          const txt = await res.text();
          console.warn('AdminSummary: response not JSON', txt);
          try { data = txt ? JSON.parse(txt) : null } catch (parseErr) { data = null }
        }

        console.debug('AdminSummary: response', res.status, data);
        if (!res.ok) {
          setError(`Server returned ${res.status}`);
          setLoading(false);
          return;
        }
        if (!cancelled) setSummary(data);
      } catch (e) {
        console.error('AdminSummary load error', e);
        if (!cancelled) setError(e.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [range, user]);

  const data = summary || { totalOrders: 0, newUsers: 0, totalIncome: 0 };

  const formattedIncome = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 }).format(Number(data.totalIncome ?? data.revenue ?? 0));

  return (
    <section className="admin-summary">
      {loading ? <div className="summary-loading">Cargando resumen...</div> : null}
      {error ? <div className="summary-error">Error: {error}</div> : null}
      <div className="summary-card">
        <h3>Órdenes</h3>
        <div className="valor">{data.totalOrders ?? data.orders ?? 0}</div>
      </div>
      <div className="summary-card">
        <h3>Usuarios nuevos</h3>
        <div className="valor">{data.newUsers ?? 0}</div>
      </div>
      <div className="summary-card">
        <h3>Ingresos totales</h3>
        <div className="valor">{formattedIncome}</div>
      </div>
    </section>
  );
}

export default AdminSummary;
