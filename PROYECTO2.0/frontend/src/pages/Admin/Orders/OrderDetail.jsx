import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchOrder } from '../../../api/ordersApi'
import { useAuth } from '../../../context/AuthContext'
import formatMoney from '../../../utils/formatMoney'

export default function OrderDetail(){
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let mounted = true
    ;(async()=>{
      setLoading(true); setError(null)
      try{
        const data = await fetchOrder(id, token)
        if (!mounted) return
        // API may return { orden } or order object
        if (data && data.orden) setOrder(data.orden)
        else setOrder(data)
      }catch(e){
        console.error('fetch order', e)
        if (mounted) setError(e?.message || 'Error al cargar la orden')
      }finally{ if (mounted) setLoading(false) }
    })()
    return ()=>{ mounted = false }
  },[id, token])

  if (loading) return <div className='container'>Cargando orden...</div>
  if (error) return <div className='container'>Error: {error}</div>
  if (!order) return <div className='container'>Orden no encontrada</div>

  const items = order.items || order.detalle || []

  return (
    <div className='container'>
      <h2>Detalle Orden {order.id}</h2>
      <p>Usuario: {order.usuarioId || order.usuario || (order.user && order.user.id) || '—'}</p>
      <p>Total: {formatMoney(order.total)}</p>
      <p>Estado: {order.estado || order.estadoOrden || order.estado_orden}</p>
      <h3>Items</h3>
      <ul>
        {items.map((it,idx)=> (
          <li key={idx}>{(it.productId || it.product || it.producto || it.id)} x {it.cantidad || it.cantidad_producto || 1}</li>
        ))}
      </ul>
      <div style={{marginTop:16}}>
        <button className='btn-grey' onClick={()=>navigate(-1)}>Volver</button>
      </div>
    </div>
  )
}
