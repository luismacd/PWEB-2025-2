import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchOrders } from '../../../api/ordersApi'
import { useAuth } from '../../../context/AuthContext'

export default function OrdersList(){
  const { token } = useAuth()
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let mounted = true
    ;(async ()=>{
      setLoading(true); setError(null)
      try{
        const data = await fetchOrders(token)
        if (!mounted) return
        // fetchOrders may return array or { ordenes }
        if (Array.isArray(data)) setOrdenes(data)
        else if (data && Array.isArray(data.ordenes)) setOrdenes(data.ordenes)
        else setOrdenes([])
      }catch(e){
        console.error('load admin orders', e)
        if (mounted) setError(e?.message || 'Error al cargar órdenes')
      }finally{ if (mounted) setLoading(false) }
    })()
    return ()=>{ mounted = false }
  },[token])

  return (
    <div className='container'>
      <h2>Listado de Órdenes</h2>
      {loading && <p>Cargando órdenes...</p>}
      {error && <p style={{color:'red'}}>Error: {error}</p>}
      <table style={{width:'100%',background:'#fff'}}>
        <thead><tr><th>ID</th><th>Usuario</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          {ordenes.map(o=> (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.usuarioId || o.usuario || (o.user && o.user.id) || '—'}</td>
              <td>S/ {o.total}</td>
              <td>{o.estado}</td>
              <td><Link to={`/admin/ordenes/${o.id}`}>Ver</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
