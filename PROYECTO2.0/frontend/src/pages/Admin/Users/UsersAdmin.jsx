import React, { useEffect, useState } from "react";
import { getAdminUsers, toggleUserActive } from "../../../api/usersApi";
import { Link } from "react-router-dom";

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getAdminUsers();
      setUsers(res.items || []);
    })();
  }, []);

  const toggle = async (id) => {
    await toggleUserActive(id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, activo: !u.activo } : u));
  };

  return (
    <div>
      <h3>Listado de usuarios</h3>
      <table style={{ width: "100%" }}>
        <thead><tr><th>Nombre</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.fechaRegistro}</td>
              <td>{u.activo ? "Activo" : "Inactivo"}</td>
              <td>
                <Link to={`/admin/users/${u.id}`}><button>Ver</button></Link>
                <button onClick={() => toggle(u.id)}>{u.activo ? "Desactivar" : "Activar"}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
