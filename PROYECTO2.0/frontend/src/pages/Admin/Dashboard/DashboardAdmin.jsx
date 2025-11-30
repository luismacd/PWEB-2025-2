import React, { useEffect, useState } from 'react'
import { BASE_URL, handleResponse, authHeaders } from '../../../api/apiClient'
import { useAuth } from '../../../context/AuthContext'
import AdminSummary from '../../../components/Admin/AdminSummary'
import AdminUsers from '../../../components/Admin/AdminUsers'
import AdminUserDetail from '../../../components/Admin/AdminUserDetail'
import AdminOrders from '../../../components/Admin/AdminOrders'
import '../../../components/Admin/AdminDashboard.css'

export default function AdminDashboard(){
  const { token } = useAuth()
  // Default to no range (show all data). The user can pick a range to filter.
  const [range, setRange] = useState(null)
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)

  const loadSummary = async () => {
    try{
      const params = new URLSearchParams()
      if (range.from) params.set('from', new Date(range.from).toISOString())
      if (range.to) params.set('to', new Date(range.to).toISOString())
      const res = await fetch(`${BASE_URL}/admin/summary?${params.toString()}`, { headers: authHeaders(token) })
      await handleResponse(res) // summary component will fetch itself; keep here for parity (no-op)
    }catch(e){ console.error('dashboard load error', e) }
  }

  const loadUsers = async () => {
    try{
      const res = await fetch(`${BASE_URL}/admin/users`, { headers: authHeaders(token) })
      const data = await handleResponse(res)
      // normalize array to expected shape
      const norm = (data || []).map(u => ({ id: u.id, nombre: u.nombre || u.name || '', apellido: u.apellido || '', correo: u.correo || u.email || '', active: u.estado === 'Activo' || u.estado === 'activo' || u.estado === true || u.estado === 'active', tipoUsuario: u.tipoUsuario || u.tipo || u.role }))
      setUsers(norm)
    }catch(e){ console.error('load users error', e); setUsers([]) }
  }

  const selectUser = async (u) => {
    if(!u) { setSelectedUser(null); return }
    try{
      // fetch detailed user from backend if possible
      const res = await fetch(`${BASE_URL}/admin/users/${u.id}`, { headers: authHeaders(token) })
      if (res.ok){
        const detail = await res.json()
        setSelectedUser(detail)
        return
      }
    }catch(e){ /* ignore and fallback */ }
    setSelectedUser(u)
  }

  useEffect(()=>{ loadUsers(); loadSummary(); }, [token])

  return (
    <div className="admin-page">
      <AdminSummary range={range} />
      <div className="admin-panels">
        <div className="users-detail-row">
          <AdminUsers users={users} onSelectUser={selectUser} />
          <AdminUserDetail user={selectedUser} users={users} onChangeUser={selectUser} />
        </div>
        <AdminOrders range={range} />
      </div>
    </div>
  )
}
