import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrderContext"; 
import { BASE_URL, handleResponse, authHeaders } from '../../api/apiClient'
import { useAuth } from '../../context/AuthContext'

function AdminOrders({ range }) {
  const navigate = useNavigate();
  const { ordenes: localOrders = [] } = useOrders(); 
  const { token } = useAuth()
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil((orders.length || localOrders.length) / pageSize));

  useEffect(() => {
    let mounted = true
    async function load(){
      try{
        if(!token) { setOrders(localOrders || []); return }
        const q = range ? `?from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}` : ''
        const res = await fetch(`${BASE_URL}/ordenes${q}`, { headers: { ...authHeaders(token) } })
        const data = await handleResponse(res)
        // normalize
        const norm = (data || []).map(o => ({ id: o.id, usuario: (o.usuario && (o.usuario.nombre || o.usuario.name)) || o.usuarioId || o.user || '', fecha: o.fecha || o.createdAt || o.date, total: o.total, estado: o.estado || o.status }))
        if(mounted) setOrders(norm)
      }catch(e){ console.error('AdminOrders load error', e); if(mounted) setOrders(localOrders || []) }
    }
    load()
    return () => { mounted = false }
  }, [token, range, JSON.stringify(localOrders)])


  const source = orders.length ? orders : localOrders
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return (source || []).slice(start, start + pageSize);
  }, [page, source]);

  const goTo = (p) => setPage(Math.max(1, Math.min(totalPages, p)));

  const renderPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, "dots", totalPages];
    if (page >= totalPages - 2) return [1, "dots", totalPages - 2, totalPages - 1, totalPages];
    return [1, "dots", page, "dots", totalPages];
  };

  const handleVerTodas = () => {
    navigate("/admin/ordenes");
  };

  return (
    <section className="admin-orders">
      <div className="orders-header">
        <h3>Listado de órdenes</h3>
        <div className="orders-actions">
          <Link to="/admin/productos" className="btn-ver-productos">Ver productos</Link>
          {/* Botón para ver todas las órdenes */}
          <button
            onClick={handleVerTodas}
            className="btn-ver-todas"
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            Ver órdenes
          </button>
        </div>
      </div>

      <table className="tabla-ordenes">
        <thead>
          <tr>
            <th>#ID</th>
            <th>Usuario</th>
            <th>Fecha de orden</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {paged.length > 0 ? (
            paged.map((o) => (
              <tr key={o.id}>
                <td className="link-id">{o.id}</td>
                <td>{o.usuario || o.user || "—"}</td>
                <td>{o.fecha || o.date}</td>
                <td>S/ {o.total}.00</td>
                <td className="estado">{o.estado || o.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "12px" }}>
                No hay órdenes registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>

    
      <div className="paginator">
        <button
          className="page-arrow"
          onClick={() => goTo(page - 1)}
          disabled={page === 1}
        >
          &lt;
        </button>

        {renderPageNumbers().map((p, idx) =>
          p === "dots" ? (
            <span key={"dots-" + idx} className="page-dots">
              …
            </span>
          ) : (
            <button
              key={p}
              className={"page" + (p === page ? " active" : "")}
              onClick={() => goTo(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          className="page-arrow"
          onClick={() => goTo(page + 1)}
          disabled={page === totalPages}
        >
          &gt;
        </button>
      </div>
    </section>
  );
}

export default AdminOrders;
