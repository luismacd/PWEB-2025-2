import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BASE_URL, handleResponse, authHeaders } from '../../../api/apiClient'
import { useAuth } from '../../../context/AuthContext'

export default function UsersList(){
  const { token } = useAuth()
  const [users, setUsers] = useState([])

  const load = async ()=>{
    try{
      const res = await fetch(`${BASE_URL}/admin/users`, { headers: authHeaders(token) })
      const data = await handleResponse(res)
      setUsers(data)
    }catch(e){ console.error('load users', e) }
  }

  useEffect(()=>{ load() }, [])

  const toggleActive = async (u)=>{
    try{
      const newEstado = u.estado === 'activo' ? 'inactivo' : 'activo'
      const res = await fetch(`${BASE_URL}/usuarios/${u.id}`, {
        method: 'PUT',
        headers: { 'Content-Type':'application/json', ...authHeaders(token) },
        body: JSON.stringify({ estado: newEstado })
      })
      await handleResponse(res)
      load()
    }catch(e){ console.error('toggleActive', e) }
  }

  return (
    <div className='container'>
      <h2>Lista de Usuarios</h2>
      <table style={{width:'100%',background:'#fff'}}>
        <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          {users.map(u=> (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre} {u.apellido || ''}</td>
              <td>{u.correo}</td>
              <td>{u.estado}</td>
              <td>
                <Link to={`/admin/usuarios/${u.id}`}>Ver</Link>
                <button style={{marginLeft:8}} onClick={()=>toggleActive(u)}>{u.estado==='activo' ? 'Desactivar' : 'Activar'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
