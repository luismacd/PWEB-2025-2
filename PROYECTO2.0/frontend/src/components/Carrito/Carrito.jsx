import "./Carrito.css";
import { useCart } from "../context/CartContext.jsx";
import Asside from "../asside.jsx";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";

const Carrito = () => {
  const {
    carrito,
    eliminarProducto,
    actualizarCantidad,
    vaciarCarrito,
    agregarProducto,
    setCarritoGlobal, 
  } = useCart();
  const navigate = useNavigate();
  const { user } = useUser();


  const guardarParaDespues = () => {
    if (!carrito || carrito.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }
    localStorage.setItem("guardados", JSON.stringify(carrito));
    vaciarCarrito();
    alert("Productos guardados para después ✅");
  };

  const traerGuardado = () => {
    const guardados = JSON.parse(localStorage.getItem("guardados") || "[]");
    if (!guardados || guardados.length === 0) {
      alert("No tienes productos guardados.");
      return;
    }

    // Reemplaza el carrito global
    setCarritoGlobal(guardados);
    localStorage.removeItem("guardados");
    alert("Productos traídos al carrito 🛒");
  };

  // ======== OPERACIONES ========
  const AumentarCantidad = (id) => actualizarCantidad(id, 1);
  const DisminuirCantidad = (id) => {
    const p = carrito.find((i) => i.id === id);
    if (p && p.cantidad > 1) actualizarCantidad(id, -1);
  };

  const handleCancelar = () => {
    vaciarCarrito();
    navigate("/");
  };

  const handleContinuar = () => {
    if (user) navigate("/checkout");
    else {
      alert("Inicia sesión para continuar la compra");
      navigate("/login");
    }
  };

  if (!carrito || carrito.length === 0) {
    return (
      <section className="cart container">
        <h1 className="cart__title">Carrito (0 productos)</h1>
        <p>Tu carrito está vacío.</p>
        <div className="extra-buttons">
          <button className="btn-green" onClick={traerGuardado}>
            Traer guardado
          </button>
        </div>
      </section>
    );
  }

  const totalItems = carrito.reduce((s, it) => s + (it.cantidad ?? 1), 0);
  const totalPrecio = carrito.reduce(
    (s, it) => s + it.precio * (it.cantidad ?? 1),
    0
  );

  return (
    <section className="cart-container">
      <h1 className="cart__title">
        Carrito <span className="muted">({totalItems} productos)</span>
      </h1>

      <div className="cart-grid">
        <div className="cart-list">
          {carrito.map((producto) => {
            const price = Number(producto.precio ?? 0);
            const qty = Number(producto.cantidad ?? 1);

            return (
              <article key={producto.id} className="cart-item">
                <img src={producto.imagen} alt={producto.nombre} className="cart-img" />
                <div className="cart-info">
                  <h3>{producto.nombre}</h3>
                  <p className="cat">{producto.categoria}</p>
                  <p className="eta">Llega mañana</p>

                  <div className="controls">
                    <span>Cantidad</span>
                    <div className="qty">
                      <button onClick={() => DisminuirCantidad(producto.id)}>-</button>
                      <span>{qty}</span>
                      <button onClick={() => AumentarCantidad(producto.id)}>+</button>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => eliminarProducto(producto.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="cart-price">S/ {(price * qty).toFixed(2)}</div>
              </article>
            );
          })}
        </div>

        <div className="cart-aside">
          <Asside
            totalItems={totalItems}
            totalPrecio={totalPrecio}
            buttonText="Continuar compra"
            onAction={handleContinuar}
          />

          <div className="extra-buttons">
            <button className="btn-orange" onClick={guardarParaDespues}>
              Guardar para después
            </button>
            <button className="btn-grey" onClick={traerGuardado}>
              Traer guardado
            </button>
            <button className="btn-red" onClick={handleCancelar}>
              Cancelar compra
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carrito;