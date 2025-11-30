import React, { useEffect, useState } from "react";
import Asside from "../asside.jsx";
import "./Checkout.css";

export default function CheckoutCompleted() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("lastOrder");
    if (raw) setOrder(JSON.parse(raw));
  }, []);

  if (!order) {
    return (
      <section className="checkout container" style={{ padding: 24 }}>
        <h1 className="checkout__title">Orden completada</h1>
        <p>No encontramos una orden reciente.</p>
      </section>
    );
  }

  const { items = [], subtotal = 0, total = 0, direccion = {} } = order;
  const totalItems = items.reduce((s, it) => s + (it.cantidad ?? 1), 0);

  return (
    <section className="checkout container">
      <h1 className="checkout__title">Orden completada :</h1>
      <p>Gracias por tu compra!</p>

      <div className="page-grid">
        {/* --------- Columna principal --------- */}
        <main className="main-content">
          <h2>Resumen de la compra</h2>
          <div className="order-summary">
            {items.map((it) => (
              <div key={it.id} className="order-item">
                <img src={it.imagen} alt={it.nombre} />
                <div className="order-item__info">
                  <h3>{it.nombre}</h3>
                  <p className="order-item__categoria">{it.categoria}</p>
                  <p className="order-item__envio">Llega mañana</p>
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
            buttonText="Ver más ofertas"
            onAction={() => (window.location.href = "/productos")}
          />
          
          {/* ✅ Mueve aquí la dirección de envío */}
          <div className="direccion-box">
            <h3>Dirección de envío</h3>
            <p>{direccion.direccion}</p>
            <p>{direccion.ciudad}</p>
            <p>Celular de contacto: {direccion.telefono}</p>
            {direccion.entrega && (
              <p>
                Fecha de entrega aproximada:{" "}
                <strong>{direccion.entrega}</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}