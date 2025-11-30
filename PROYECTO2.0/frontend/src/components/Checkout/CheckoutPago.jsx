import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import Asside from "../asside.jsx";
import "./Checkout.css";

import qrIcon from "../../assets/qr.png";
import Visa from "../../assets/Visa.png";
import VisaElectron from "../../assets/Visa-Electron.png";
import Mastercard from "../../assets/Mastercard.png";
import Maestro from "../../assets/Maestro.png";
import Paypal from "../../assets/Paypal.png";

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  const { carrito } = useCart();

  const items = Array.isArray(carrito) ? carrito : [];
  if (!items.length) {
    return (
      <section className="checkout container" style={{ padding: 24 }}>
        <h2>Tu carrito está vacío</h2>
      </section>
    );
  }

  const totalItems = items.reduce((s, it) => s + Number(it.cantidad ?? 1), 0);
  const subtotal   = items.reduce((s, it) => s + Number(it.precio ?? 0) * Number(it.cantidad ?? 1), 0);

  // método seleccionado (qr | card)
  const [metodo, setMetodo] = useState(
    localStorage.getItem("metodoPago") || "qr"
  );

  const continuar = () => {
    localStorage.setItem("metodoPago", metodo);
    if (metodo === "qr") navigate("/checkout/pago/qr");
    else navigate("/checkout/pago/tarjeta");
  };

  return (
    <section className="checkout container">
      <h1 className="checkout__title">Checkout</h1>

      <div className="page-grid">
        {/* --------- Columna principal --------- */}
        <main className="main-content">
          <h2>Método de pago</h2>

          <div className="pay-card">
            {/* Opción QR */}
            <label className={`pay-row ${metodo === "qr" ? "selected" : ""}`}>
              <input
                type="radio"
                name="metodo"
                checked={metodo === "qr"}
                onChange={() => setMetodo("qr")}
              />
              <span className="radio-dot" />
              <div className="pay-label">
                <strong>Generar QR</strong>
                <img src={qrIcon} alt="QR" className="qr-mini" />
              </div>
            </label>

            {/* Opción Tarjeta/otros */}
            <label className={`pay-row ${metodo === "card" ? "selected" : ""}`}>
              <input
                type="radio"
                name="metodo"
                checked={metodo === "card"}
                onChange={() => setMetodo("card")}
              />
              <span className="radio-dot" />
              <div className="pay-logos">
                <img src={Visa} alt="Visa" />
                <img src={VisaElectron} alt="Visa Electron" />
                <img src={Mastercard} alt="Mastercard" />
                <img src={Maestro} alt="Maestro" />
                <img src={Paypal} alt="PayPal" />
              </div>
            </label>
          </div>

          <button className="btn-green" onClick={continuar} style={{ marginTop: 16 }}>
            Continuar
          </button>
        </main>

        {/* --------- Aside --------- */}
        <Asside
          totalItems={totalItems}
          totalPrecio={subtotal}
          buttonText="Continuar"
          onAction={continuar}
        />
      </div>
    </section>
  );
}
