import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import Asside from "../asside.jsx";
import "./Checkout.css";

const INITIAL_FORM = {
  nombre: "",
  apellido: "",
  ciudad: "",
  departamento: "",
  direccion: "",
  postal: "",
  telefono: "",
};

export default function Checkout() {
  const { carrito } = useCart();
  const navigate = useNavigate();

  const items = Array.isArray(carrito) ? carrito : [];
  const totalItems = items.reduce((s, it) => s + Number(it.cantidad ?? 1), 0);
  const subtotal = items.reduce(
    (s, it) => s + Number(it.precio ?? 0) * Number(it.cantidad ?? 1),
    0
  );
  const envioCosto = 0;
  const total = subtotal + envioCosto;

  const [form, setForm] = useState(INITIAL_FORM);
  const [err, setErr] = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Ingresa tu nombre";
    if (!form.apellido.trim()) e.apellido = "Ingresa tu apellido";
    if (!form.ciudad.trim()) e.ciudad = "Ingresa tu ciudad";
    if (!form.departamento.trim()) e.departamento = "Ingresa tu departamento";
    if (!form.direccion.trim()) e.direccion = "Ingresa tu dirección";
    if (!form.postal.trim()) e.postal = "Ingresa tu código postal";
    if (!form.telefono.trim()) e.telefono = "Ingresa tu teléfono";
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Guardar datos del formulario en localStorage para usarlos en la pantalla de pago
    localStorage.setItem("direccionEnvio", JSON.stringify(form));

    // Redirigir a la pantalla de pago
    navigate("/checkout/pago");
  };

  if (items.length === 0) {
    return (
      <section className="checkout container" style={{ padding: 24 }}>
        <h2>Tu carrito está vacío</h2>
      </section>
    );
  }

  return (
    <section className="checkout container">
      <h1 className="checkout__title">Checkout</h1>

      <div className="page-grid">
        {/* --------- Columna principal (formulario) --------- */}
        <main className="main-content">
          <form className="checkout-form" onSubmit={onSubmit}>
            <h2>Dirección de envío</h2>

            {/* Fila 1: Nombre / Apellido */}
            <div className="grid2">
              <div className="field">
                <label>Nombre</label>
                <input
                  name="nombre"
                  placeholder="Nombre del usuario"
                  value={form.nombre}
                  onChange={onChange}
                />
                {err.nombre && <small className="err">{err.nombre}</small>}
              </div>

              <div className="field">
                <label>Apellido</label>
                <input
                  name="apellido"
                  placeholder="Apellido del usuario"
                  value={form.apellido}
                  onChange={onChange}
                />
                {err.apellido && <small className="err">{err.apellido}</small>}
              </div>
            </div>

            {/* Fila 2: Ciudad / Departamento */}
            <div className="grid2">
              <div className="field">
                <label>Ciudad</label>
                <input
                  name="ciudad"
                  placeholder="Nombre de la ciudad"
                  value={form.ciudad}
                  onChange={onChange}
                />
                {err.ciudad && <small className="err">{err.ciudad}</small>}
              </div>

              <div className="field">
                <label>Departamento</label>
                <input
                  name="departamento"
                  placeholder="Nombre del departamento"
                  value={form.departamento}
                  onChange={onChange}
                />
                {err.departamento && (
                  <small className="err">{err.departamento}</small>
                )}
              </div>
            </div>

            {/* Fila 3: Dirección */}
            <div className="field">
              <label>Dirección</label>
              <input
                name="direccion"
                placeholder="Av. la molina 1233..."
                value={form.direccion}
                onChange={onChange}
              />
              {err.direccion && <small className="err">{err.direccion}</small>}
            </div>

            {/* Fila 4: Código postal / Teléfono */}
            <div className="grid2">
              <div className="field">
                <label>Código postal</label>
                <input
                  name="postal"
                  placeholder="Código postal"
                  value={form.postal}
                  onChange={onChange}
                />
                {err.postal && <small className="err">{err.postal}</small>}
              </div>

              <div className="field">
                <label>Teléfono de contacto</label>
                <input
                  name="telefono"
                  placeholder="Teléfono de contacto"
                  value={form.telefono}
                  onChange={onChange}
                />
                {err.telefono && <small className="err">{err.telefono}</small>}
              </div>
            </div>
 
          </form>
        </main>

        <Asside
          totalItems={totalItems}
          totalPrecio={total}
          buttonText="Seleccionar método de pago"
          onAction={onSubmit}
        />
      </div>
    </section>
  );
}
