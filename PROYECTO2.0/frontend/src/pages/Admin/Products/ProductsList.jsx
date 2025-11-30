import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BASE_URL, handleResponse, authHeaders } from '../../../api/apiClient'
import { useAuth } from '../../../context/AuthContext'
import './ProductsList.css'

export default function AdminProducts(){
  const { token } = useAuth()
  const [products, setProducts] = useState([])

  const load = async ()=>{
    try{
      const res = await fetch(`${BASE_URL}/productos?includeInactive=true&limit=50`, { headers: authHeaders(token) })
      const data = await handleResponse(res)
      setProducts(data.productos || [])
    }catch(e){ console.error('load products', e) }
  }

  useEffect(()=>{ load() }, [])

  const toggleActive = async (p)=>{
    try{
      const res = await fetch(`${BASE_URL}/productos/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type':'application/json', ...authHeaders(token) },
        body: JSON.stringify({ activo: !p.activo })
      })
      await handleResponse(res)
      load()
    }catch(e){ console.error('toggle product', e) }
  }

  return (
    <div className="admin-products container">
      <div className="products-header">
        <h2>Listado de productos</h2>
        <div className="products-actions">
          <input className="search" placeholder="Buscar un producto..." />
          <button className="btn primary">Buscar</button>
          <Link to="/admin/productos/nuevo" className="btn success">Agregar producto</Link>
        </div>
      </div>

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Presentación</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p=> (
              <tr key={p.id}>
                <td className="pid">#{p.sku || p.id?.slice(0,4) || p.id}</td>
                <td className="product-name">
                  <div className="thumb">
                    <img src={p.imagen || p.image || '/assets/img/default-product.png'} alt={p.nombre} />
                  </div>
                  <div className="name-wrap">
                    <div className="name">{p.nombre}</div>
                    <div className="sub">{p.marca || ''}</div>
                  </div>
                </td>
                <td>{p.presentacion || p.type || 'Físico'}</td>
                <td className="desc">{(p.descripcion || p.description || '').slice(0,100)}{(p.descripcion || p.description || '').length > 100 ? '...' : ''}</td>
                <td>{p.categoria || p.category || ''}</td>
                <td>{p.stock ?? p.cantidad ?? 0}</td>
                <td className="actions">
                  <Link to={`/admin/productos/${p.id}`} className="icon edit">✏️</Link>
                  <button className="icon" onClick={()=>toggleActive(p)}>{p.activo ? '🟢' : '⚪'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button className="page">◀</button>
        <button className="page active">1</button>
        <button className="page">2</button>
        <button className="page">3</button>
        <button className="page">▶</button>
      </div>
    </div>
  )
}
