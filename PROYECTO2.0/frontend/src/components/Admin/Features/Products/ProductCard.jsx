import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import { useCart } from "../../../context/CartContext.jsx";

function ProductCard({ id, nombre, categoria, precio, imagen }) {
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCart(); 

  const imagePath = `/${imagen.replace(/^\//, "")}`;

  const verDetalle = () => {
    if (!id) {
      console.error("⚠️ ID indefinido en ProductCard:", { nombre, categoria });
      return;
    }
    navigate(`/producto/${id}`);
  };

  const handleAgregar = (e) => {
   e.stopPropagation();               
    e.preventDefault();

    agregarAlCarrito({
      id,
      imagen: imagePath,
      nombre,
      precio: Number(precio),
      categoria: categoria || ""
    });
  }

  return (
    <div className="product-card" onClick={verDetalle} style={{ cursor: "pointer" }}>
      <img src={imagePath} alt={nombre} className="product-image" />

      <div className="product-info">
        <p className="product-name">{nombre}</p>
        <p className="product-category">{categoria}</p>
        <p className="product-price">S/ {precio}</p>
      </div>

      <button className="product-btn" onClick={handleAgregar}>
        Agregar
      </button>
    </div>
  );
}

export default ProductCard;
