import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserDetail } from "../../../api/usersApi";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const u = await getUserDetail(id);
      setUser(u);
    })();
  }, [id]);

  if (!user) return <div>Cargando...</div>;

  return (
    <div>
      <h3>Detalle de usuario</h3>
      <div style={{ display:"flex", gap:20 }}>
        <div>
          <h4>{user.nombre}</h4>
          <p>Email: {user.email}</p>
          <p>Registro: {user.fechaRegistro}</p>
        </div>
        <div>
          <h4>Últimas órdenes</h4>
          <table>
            <thead><tr><th>ID</th><th>Fecha</th><th>Total</th></tr></thead>
            <tbody>
              {user.orders?.map(o => (
                <tr key={o.id}><td>{o.id}</td><td>{o.fecha}</td><td>S/{o.total}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
