import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/context/UserContext";
import "./Register.css";
import EyeIcon from "../icons/EyeIcon";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [dni, setDni] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
    try{
      const res = await register(nuevousuario);
      // if register persisted token/user (backend or local fallback) redirect to profile
      const token = res?.token || res?.accessToken || null
      const u = res?.user || res?.usuario || res?.data || null
      if (token || u) {
        alert("Registro exitoso. Has iniciado sesión.");
        navigate('/perfil');
        return;
      }
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/login");
    }catch(e){
      alert(e?.message || "No se pudo registrar el usuario. Verifica el correo o intenta nuevamente.");
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
            <div className="input-with-icon">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
              />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                <EyeIcon open={!showPassword} width={18} height={18} />
              </button>
            </div>
          </div>

          <div>
            <label>Confirmar contraseña</label>
            <div className="input-with-icon">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirmar contraseña"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
              />
              <button type="button" className="eye-btn" onClick={() => setShowConfirm(s => !s)} aria-label={showConfirm ? 'Ocultar confirmación' : 'Mostrar confirmación'}>
                <EyeIcon open={!showConfirm} width={18} height={18} />
              </button>
            </div>
          </div>
        </div>

        <div style={{display:'flex', justifyContent:'center'}}>
          <button className="register-submit" onClick={handleRegister}>Registrarme</button>
        </div>
      </div>
    </div>
  );
};

export default Register;
