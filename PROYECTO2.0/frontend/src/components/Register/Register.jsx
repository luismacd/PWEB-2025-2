import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/context/UserContext";
import "./Register.css";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [dni, setDni] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const navigate = useNavigate();
  const { register } = useUser();

  const handleRegister = async () => {
    if (contraseña !== confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }
    const nuevousuario = {
        DNI : dni,
        nombre : nombre,
        apellido: apellido,
        correo: correo,
        contraseña : contraseña,
        role : "usuario",
        active : true
    }
    const exito = await register(nuevousuario);
    if (exito) {
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/login");
    } else {
      alert("No se pudo registrar el usuario. Verifica el correo o intenta nuevamente.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Registro</h2>

        <div className="register-grid">
          <div>
            <label>Nombre</label>
            <input
              placeholder="Nombre del usuario"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div>
            <label>Apellido</label>
            <input
              placeholder="Apellido del usuario"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>

          <div>
            <label>Correo</label>
            <input
              type="email"
              placeholder="usuario@gmail.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div>
            <label>DNI</label>
            <input
              placeholder="DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
          </div>

          <div>
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
            />
          </div>

          <div>
            <label>Confirmar contraseña</label>
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
            />
          </div>
        </div>

        <button onClick={handleRegister}>Registrarme</button>
      </div>
    </div>
  );
};

export default Register;
