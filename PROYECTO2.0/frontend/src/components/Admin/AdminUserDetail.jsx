import React, { useEffect, useState } from "react";
import { BASE_URL, authHeaders, handleResponse } from '../../api/apiClient'
import { useAuth } from '../../context/AuthContext'

function AdminUserDetail({ user, users = [], onChangeUser }) {
  const { token } = useAuth()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!user || !user.id) { setDetail(null); return }
      setLoading(true)
      try {
        const res = await fetch(`${BASE_URL}/admin/users/${user.id}`, { headers: authHeaders(token) })
        if (!res.ok) {
          setDetail(user) // fallback to provided brief user
          return
        }
        const data = await handleResponse(res)
        if (mounted) setDetail(data)
      } catch (e) {
        if (mounted) setDetail(user)
      } finally { if (mounted) setLoading(false) }
    }
    load()
    return () => { mounted = false }
  }, [user, token])

  if (!user && !detail) {
    return (
      <section className="admin-user-detail empty">
        <h3>Detalle del usuario</h3>
        <p>Selecciona un usuario para ver su detalle.</p>
      </section>
    )
  }

  const u = detail || user
  const avatarSrc = u.photo || u.avatar || '/unknown.jpg'

  const index = users.findIndex((it) => it && u && it.id === u.id)
  const current = index >= 0 ? index : 0

  const goTo = (i) => {
    const ni = Math.max(0, Math.min(users.length - 1, i))
    if (onChangeUser) onChangeUser(users[ni])
  }

  const orders = (u.orders || u.ordenes || []).map(o => ({ id: o.id, date: o.fecha || o.date, total: o.total }))

  return (
    <section className="admin-user-detail">
      <h3>Detalle del usuario</h3>
      <div className="detalle-card">
        <div className="detalle-info">
          <h4>{u.nombre || u.name || `${u.nombre || ''} ${u.apellido || ''}`.trim()}</h4>
          <div className="user-avatar-wrap">
            <img src={avatarSrc} alt={`${u.nombre || u.name} avatar`} className="user-avatar" />
          </div>
          <p>Correo: {u.correo || u.email}</p>
          <p>Dirección: {u.direccion || u.address || '—'}</p>
          <p>Estado: {u.estado || (u.active ? 'Activo' : 'Inactivo') || u.status}</p>
        </div>
        <div className="detalle-orders">
          <h4>Órdenes</h4>
          {loading ? (
            <div>Cargando órdenes…</div>
          ) : (
            <table className="tabla-ordenes-peq">
              <thead>
                <tr><th>#ID</th><th>Fecha</th><th>Total</th></tr>
              </thead>
              <tbody>
                {orders.length > 0 ? orders.map(o => (
                  <tr key={o.id}><td className="link-id">{o.id}</td><td>{o.date}</td><td>S/ {o.total}.00</td></tr>
                )) : (
                  <tr><td colSpan="3" style={{textAlign:'center', padding:12}}>No hay órdenes para este usuario.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="user-detail-paginator">
        <button onClick={() => goTo(current - 1)} disabled={current === 0} className="page-arrow">&lt;</button>
        <span className="user-pos">{current + 1} / {users.length}</span>
        <button onClick={() => goTo(current + 1)} disabled={current === users.length - 1} className="page-arrow">&gt;</button>
      </div>
    </section>
  )
}

export default AdminUserDetail;
