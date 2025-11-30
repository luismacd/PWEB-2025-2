import { useUser } from "../../components/context/UserContext";
import { useOrders } from "../../components/context/OrderContext";
import "./PerfilUsuario.css";
import { useNavigate, Link } from "react-router-dom";

const PerfilUsuario = () => {
  const { user } = useUser();
  const { ordenes } = useOrders();

  if (!user) {
    return <p className="perfil-mensaje">No hay usuario autenticado.</p>;
  }

  // Filtrar órdenes del usuario autenticado
  const ordenesUsuario = ordenes.filter((orden) => orden.idUsuario === user.DNI);

  return (
    <div className="perfil-container">
      <h2>Detalles de usuario</h2>

      <div className="perfil-card">
        <div className="perfil-info">
          <div>
            <h3>{`${user.nombre} ${user.apellido}`}</h3>
            <p>
              <strong>Correo:</strong>{" "}
              <span className="perfil-correo">{user.correo}</span>
            </p>
            <p>
              <strong>DNI:</strong> {user.DNI}
            </p>
            <p>
              <strong>Fecha de registro:</strong>{" "}
              {user.fechaRegistro || "20/01/2025"}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              <span className="perfil-estado">Activo</span>
            </p>
          </div>
          <div className="perfil-foto">
            <img
              src={user.foto || "/images/avatar-default.png"}
              alt="Foto de perfil"
            />

          <Link to={`/cambiar-contraseña`} className="perfil-btn">
                             Cambiar contraseña
                          </Link>
          </div>
        </div>

        <div className="perfil-ordenes">
          <h3>Últimas órdenes</h3>
          {ordenesUsuario.length > 0 ? (
            <table className="tabla-ordenes">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenesUsuario.map((orden) => (
                  <tr key={orden.id}>
                    <td className="perfil-id">#{orden.id}</td>
                    <td>{orden.fecha}</td>
                    <td>S/{orden.total.toFixed(2)}</td>
                    <td>

                       <Link to={`/orden/${orden.id}`} className="perfil-ver-detalle">
                             Ver detalle
                          </Link>
               
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="perfil-sin-ordenes">No tienes órdenes registradas.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;
