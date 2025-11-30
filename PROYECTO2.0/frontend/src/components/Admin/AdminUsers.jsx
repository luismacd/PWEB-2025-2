import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../../context/AuthContext'
import { BASE_URL, authHeaders } from '../../api/apiClient'

function AdminUsers({ range, onSelectUser, users }) {

  // Estado para la paginación
  const [page, setPage] = useState(1);
  const pageSize = 7;

  const [localUsers, setLocalUsers] = useState(users || [])

  useEffect(() => { setLocalUsers(users || []) }, [users])

  const totalPages = Math.max(1, Math.ceil((localUsers || []).length / pageSize));

  const pagedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return (localUsers || []).slice(start, start + pageSize);
  }, [page, localUsers]);

  const goTo = (p) => {
    const np = Math.max(1, Math.min(totalPages, p));
    setPage(np);
  };

  const { token } = useAuth()

  const toggleActive = async (u, e) => {
    if (e) e.stopPropagation()
    try{
      const newEstado = u.active ? 'inactivo' : 'activo'
      const res = await fetch(`${BASE_URL}/admin/users/${encodeURIComponent(u.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
        body: JSON.stringify({ estado: newEstado })
      })
      if (!res.ok) {
        const err = await res.json().catch(()=>({message:res.statusText}))
        alert(err.message || 'Error al actualizar usuario')
        return
      }
      // update local state
      setLocalUsers(prev => prev.map(x => x.id === u.id ? { ...x, active: !x.active } : x))
    }catch(err){
      console.error('toggleActive error', err)
      alert('Error de red al actualizar usuario')
    }
  }

  // Función para renderizar los números de página
  const renderPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Cuando hay muchas páginas, mostrar [1,2,3,...,última]
    if (page <= 3) {
      return [1, 2, 3, 'dots', totalPages];
    }
    if (page >= totalPages - 2) {
      return [1, 'dots', totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, 'dots', page, 'dots', totalPages];
  };

  return (
    <aside className="admin-users">
      <div className="users-header">
        <h3>Usuarios registrados</h3>
        {}
        <Link to="/admin/usuarios" className="btn-ver-todos">Ver todos los usuarios</Link>
      </div>

      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pagedUsers.map((u) => (
            <tr key={u.id} onClick={() => onSelectUser && onSelectUser(u)} className="fila-usuario">
              <td>
                <div className="user-cell">
                  <img src={u.photo ? u.photo : '/unknown.jpg'} alt={`${u.name} avatar`} className="user-mini-avatar" />
                  <span>{u.nombre + " " + u.apellido}</span>
                </div>
              </td>
              <td className={u.active === true ? "activo" : "inactivo"}>{u.active === true ? "Activo" : "Inactivo"}</td>
              <td>
                <button className="btn-sec" onClick={(e) => toggleActive(u, e)}>{u.active ? 'Desactivar' : 'Activar'}</button>
                <button className="btn-ver" onClick={(e) => { e.stopPropagation(); onSelectUser && onSelectUser(u); }}>Ver detalle</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="paginator">
        <button className="page-arrow" onClick={() => goTo(page - 1)} disabled={page === 1}>&lt;</button>

        {renderPageNumbers().map((p, idx) => (
          p === 'dots' ? (
            <span key={"dots-" + idx} className="page-dots">…</span>
          ) : (
            <button
              key={p}
              className={"page" + (p === page ? " active" : "")}
              onClick={() => goTo(p)}
            >{p}</button>
          )
        ))}

        <button className="page-arrow" onClick={() => goTo(page + 1)} disabled={page === totalPages}>&gt;</button>
      </div>
    </aside>
  );
}

export default AdminUsers;
