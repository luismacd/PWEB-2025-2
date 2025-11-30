import React from 'react'
import './asside.css'

export default function Asside({ totalItems = 0, totalPrecio = 0, buttonText = 'Continuar', onAction = () => {} }){
  return (
    <aside className="detalle-aside">
      <div className="aside-card">
        <h3>Resumen de pedido</h3>
        <div className="aside-row"><span>Items</span><strong>{totalItems}</strong></div>
        <div className="aside-row"><span>Subtotal</span><strong>S/ {Number(totalPrecio || 0).toFixed(2)}</strong></div>
        <div className="aside-actions">
          <button className="btn-green" onClick={onAction}>{buttonText}</button>
        </div>
      </div>
    </aside>
  )
}
