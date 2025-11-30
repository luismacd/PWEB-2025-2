import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "./ProductList.css";

function ProductList() {
  const [productos, setProductos] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/productos`);
        const data = await res.json();
        // API may return either an array or an object { productos, total }
        if (Array.isArray(data)) setProductos(data);
        else if (data && Array.isArray(data.productos)) setProductos(data.productos);
        else setProductos([]);
      } catch (err) {
        setProductos([]);
      }
    }
    load();
  }, []);

  const topProductos = Array.isArray(productos) ? productos.slice(0, 5) : [];

  return (
    <section className="mas-vendido">
      <h2>Lo más vendido</h2>
      <div className="productos">
        {topProductos.map((producto) => (
          <ProductCard
            key={producto.id}
            id={producto.id}
            nombre={producto.nombre}
            categoria={producto.categoria}
            precio={producto.precio}
            imagen={producto.imagen}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductList;
