import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useUser } from "../context/UserContext.jsx";
import { useOrders } from "../context/OrderContext.jsx";
import Asside from "../asside.jsx";
import qrImage from "../../assets/qr.png";
import "./Checkout.css";

export default function PaymentQRPage() {
  const navigate = useNavigate();
  const { carrito, vaciarCarrito } = useCart();
  const { user } = useUser();
  const { guardarOrden } = useOrders();

  const direccion = JSON.parse(localStorage.getItem("direccionEnvio") || "{}");
  const items = Array.isArray(carrito) ? carrito : [];
  const totalItems = items.reduce((s, it) => s + Number(it.cantidad ?? 1), 0);
  const total = items.reduce(
    (s, it) => s + Number(it.precio ?? 0) * Number(it.cantidad ?? 1),
    0
  );

  // 👉 Tu misma variable `order`
  const order = {
    items,
    subtotal: total,
    total: total,
    direccion,
    createdAt: Date.now(),
    metodoPago: "Código QR",
  };

  const handlePago = () => {
    if (!user) {
      alert("Debes iniciar sesión para continuar con el pago");
      navigate("/login");
      return;
    }

    const orderConUsuario = {
      ...order,
      idUsuario: user.DNI,
      nombreUsuario: user.nombre,
    };

    const id = guardarOrden(orderConUsuario);

    localStorage.setItem("lastOrder", JSON.stringify(orderConUsuario));

    vaciarCarrito();

    navigate("/checkout/completado");

  };

  return (
    <section className="checkout container">
      <h1 className="checkout__title">Checkout</h1>

      <div className="page-grid">
        <main className="main-content">
          <h2>Método de pago</h2>

          <div className="qr-box">
            <h3>Escanear QR</h3>
            <img src={qrImage} alt="Código QR de pago" className="qr-image" />
            <p className="qr-expiration">Válido por 05:00 minutos</p>
          </div>
        </main>

        <Asside
          totalItems={totalItems}
          totalPrecio={total}
          buttonText="Ya realicé el pago"
          onAction={handlePago}
        />
      </div>
    </section>
  );
}

