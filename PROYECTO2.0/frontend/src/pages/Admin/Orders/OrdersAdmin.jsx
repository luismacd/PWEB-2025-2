import React, { useEffect, useState } from "react";

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:3000/admin/orders");
      const data = await res.json();
      setOrders(data.items || []);
    })();
  }, []);

  return (
    <div>
      <h3>Listado de órdenes</h3>
      <table style={{ width: "100%" }}>
        <thead><tr><th>ID</th><th>Usuario</th><th>Fecha</th><th>Total</th><th>Estado</th></tr></thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.usuario}</td>
              <td>{o.fecha}</td>
              <td>S/{o.total}</td>
              <td>{o.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
