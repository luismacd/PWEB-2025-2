import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BASE_URL, handleResponse, authHeaders } from '../../../api/apiClient'
import { useAuth } from '../../../context/AuthContext'

export default function UserDetail(){
  const { id } = useParams()
  const { token } = useAuth()
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let cancelled = false
    async function load(){
      setLoading(true)
      setError(null)
      try{
        const res = await fetch(`${BASE_URL}/admin/users/${encodeURIComponent(id)}`, { headers: authHeaders(token) })
        if (!res.ok) {
          const body = await res.text().catch(()=>null)
          throw new Error(body || `Server returned ${res.status}`)
        }
        const data = await handleResponse(res)
        if (!cancelled) {
          setUser(data)
          // backend returns user.orders or orders
          setOrders(data.orders || data.ordenes || [])
        }
      }catch(e){
        if (!cancelled) setError(e.message || 'Error al cargar usuario')
      }finally{
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return ()=>{ cancelled = true }
  }, [id, token])

  if (loading) return <div className='container'>Cargando...</div>
  if (error) return <div className='container'>Error: {error}</div>
  if (!user) return <div className='container'>Usuario no encontrado</div>

  return (
    <div className='container'>
      <h2>Detalle Usuario: {user.nombre}</h2>
      <p>Email: {user.correo}</p>
      <p>Estado: {user.estado}</p>
      <h3>Órdenes</h3>
      {orders.length === 0 ? <p>No hay órdenes</p> : (
        <ul>
          {orders.slice(0,10).map(o=> <li key={o.id}>{o.id} - S/ {o.total} - {o.estado}</li>)}
        </ul>
      )}
    </div>
  )
}
