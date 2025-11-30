import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
const LS_KEY = "carrito_v1";

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(carrito));
    } catch {}
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    setCarrito((carritoAnterior) => {
      const yaExisteElProducto = carritoAnterior.findIndex((articulo) => articulo.id === producto.id);
      if (yaExisteElProducto >= 0) {
        return carritoAnterior.map((nuevo, i) => i === yaExisteElProducto ? { ...nuevo, cantidad: (nuevo.cantidad ?? 0) + 1 } : nuevo);
      } else {
        return [...carritoAnterior, { ...producto, cantidad: 1 }];
      }
    });
  };

  const actualizarCantidad = (productoId, cantidad) => {
    setCarrito((carritoAnterior) => carritoAnterior.map((producto) => producto.id === productoId ? { ...producto, cantidad: producto.cantidad + cantidad } : producto));
  };

  const setCarritoGlobal = (nuevoCarrito) => {
    setCarrito(Array.isArray(nuevoCarrito) ? nuevoCarrito.map((p) => ({ ...p, cantidad: p.cantidad ?? 1 })) : []);
  };

  const eliminarProducto = (productoId) => {
    setCarrito((carritoAnterior) => carritoAnterior.filter((articulo) => articulo.id !== productoId));
  };

  const vaciarCarrito = () => setCarrito([]);

  return (
    <CartContext.Provider value={{ carrito, setCarritoGlobal, agregarAlCarrito, eliminarProducto, actualizarCantidad, vaciarCarrito }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
// Note: no default re-export. The canonical CartContext is defined in this file.
