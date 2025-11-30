import React, { useState, useEffect } from "react";
import { useUser } from "../../components/context/UserContext";

function ListaOrdenes() {
  const { user } = useUser();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const [ordenes, setOrdenes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        // Endpoint protegido que devuelve las órdenes del usuario
        const res = await fetch(`${API_URL}/ordenes/mias`, { headers });
        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }
        const data = await res.json();
        // data is expected to be an array of órdenes
        setOrdenes(data || []);
      } catch (err) {
        setError(err.message || "Error al cargar órdenes");
      } finally {
        setLoading(false);
      }
    }

    // Only load if user is authenticated
    if (user) load();
  }, [user]);

  const filtradas = ordenes.filter((o) => {
    const usuarioName = (o.usuario?.nombre || o.usuario || "").toString();
    const id = (o.id || "").toString();
    const q = busqueda.toLowerCase();
    return usuarioName.toLowerCase().includes(q) || id.toLowerCase().includes(q);
  });

  return (
    <main className="admin-page" style={{ padding: "30px 60px" }}>
      <h2 style={{ marginBottom: "20px" }}>Listado de órdenes</h2>

      {/* Buscador */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar una órden..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            flex: "1",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={() => {}}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Buscar
        </button>
      </div>

      {loading ? (
        <div>Cargando órdenes...</div>
      ) : error ? (
        <div style={{ color: "red" }}>Error: {error}</div>
      ) : (
        <>
          {/* Tabla */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#fff",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <thead style={{ backgroundColor: "#f3f3f3" }}>
              <tr>
                <th style={{ padding: "12px", textAlign: "left" }}>#ORDEN</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Usuario</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Fecha de órden</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Total</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Estado</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.length > 0 ? (
                filtradas.map((o, i) => (
                  <tr key={o.id || i} style={{ borderBottom: "1px solid #eee" }}>
                    <td
                      style={{
                        color: "#28a745",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      {o.id}
                    </td>
                    <td>{(o.usuario && (o.usuario.nombre || `${o.usuario.nombre} ${o.usuario.apellido}`)) || (o.usuario?.nombre || "-")}</td>
                    <td>{new Date(o.fecha).toLocaleDateString?.() || o.fecha || "-"}</td>
                    <td>S/ {o.total ?? 0}</td>
                    <td
                      style={{
                        color:
                          o.estado === "Entregado"
                            ? "green"
                            : o.estado === "Por entregar"
                            ? "red"
                            : "black",
                        fontWeight: "bold",
                      }}
                    >
                      {o.estado}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          // future: navigate to detalle de orden
                        }}
                        style={{
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "6px 10px",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "15px",
                      color: "#777",
                    }}
                  >
                    No se encontraron órdenes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Paginación estática por ahora */}
          <div
            style={{
              marginTop: "15px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <button style={{ border: "none", background: "none" }}>{"<"}</button>
            <button
              style={{
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                cursor: "pointer",
              }}
            >
              1
            </button>
            <button style={{ border: "none", background: "none" }}>2</button>
            <button style={{ border: "none", background: "none" }}>3</button>
            <span>...</span>
            <button style={{ border: "none", background: "none" }}>10</button>
            <button style={{ border: "none", background: "none" }}>{">"}</button>
          </div>
        </>
      )}
    </main>
  );
}

export default ListaOrdenes;
