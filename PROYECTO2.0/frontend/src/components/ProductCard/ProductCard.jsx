import React from 'react'
import { useNavigate } from 'react-router-dom'
import './ProductCard.css'

export default function ProductCard({ producto }){
  const nav = useNavigate()
  if(!producto) return null
  return (
    <div className="product-card" onClick={()=>nav(`/producto/${producto.id}`)} style={{cursor:'pointer'}}>
      <img className="product-image" src={producto.imagen || producto.image || '/placeholder.png'} alt={producto.nombre} />
      <div className="product-info">
        <div className="product-name">{producto.nombre}</div>
        <div className="product-price">S/ {producto.precio}</div>
      </div>
    </div>
  )
}
