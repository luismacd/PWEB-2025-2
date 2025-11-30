import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrderContext.jsx";
import Asside from "../asside.jsx";
import "../DetalleOrden/DetalleOrden.css";

export default function DetalleOrden() {
  const { id } = useParams(); // ID de la orden desde la URL
  const navigate = useNavigate();
  const { ordenes } = useOrders();

  // Buscar la orden específica
  const orden = ordenes.find((o) => String(o.id) === String(id));

  if (!orden) {
    return (
      <section className="checkout container" style={{ padding: 24 }}>
        <h1 className="checkout__title">Detalle de orden</h1>
        <p>No se encontró la orden #{id}.</p>
        <button className="btn-green" onClick={() => navigate(-1)}>
          Volver
        </button>
      </section>
    );
  }

  const { items = [], subtotal = 0, total = 0, direccion = {}, fecha } = orden;
  const totalItems = items.reduce((s, it) => s + (it.cantidad ?? 1), 0);

  return (
    <section className="checkout container">
      <h1 className="checkout__title">Orden #{orden.id}</h1>
      <p>Fecha: {fecha}</p>

      <div className="page-grid">
        {/* --------- Columna principal --------- */}
        <main className="main-content">
          <h2>Productos de la orden</h2>

          <div className="order-summary">
            {items.map((it) => (
              <div key={it.id} className="order-item">
                <img src={it.imagen} alt={it.nombre} />
                <div className="order-item__info">
                  <h3>{it.nombre}</h3>
                  <p className="order-item__categoria">{it.categoria}</p>
                  <p className="order-item__envio">Cantidad: {it.cantidad ?? 1}</p>
                </div>
                <div className="order-item__precio">
                  S/ {(it.precio * (it.cantidad ?? 1)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* --------- Columna lateral --------- */}
        <div className="checkout-aside">
          <Asside
            totalItems={totalItems}
            totalPrecio={total}
            buttonText="Volver a mis pedidos"
            onAction={() => navigate(-1)}
          />

          {/* Información de envío */}
          <div className="direccion-box">
            <h3>Dirección de envío</h3>
            <p>{direccion.direccion}</p>
            <p>{direccion.ciudad}</p>
            <p>Teléfono: {direccion.telefono}</p>
            {direccion.entrega && (
              <p>
                Fecha estimada de entrega: <strong>{direccion.entrega}</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
