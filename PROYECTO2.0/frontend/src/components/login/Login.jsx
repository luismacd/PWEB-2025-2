
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/context/UserContext";
import "./Login.css";
import EyeIcon from "../icons/EyeIcon";

const Login = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useUser();

  const handleLogin = () => {
    // login puede ser async (intenta backend)
    (async () => {
      const ok = await login(correo, contraseña);
      if (ok) {
        // after successful login, read the freshest user info (from context or localStorage)
        const stored = (typeof window !== 'undefined') ? (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null } })() : null;
        const role = user?.role || user?.tipo || user?.tipoUsuario || stored?.role || stored?.tipo || stored?.tipoUsuario;
        if (role === 'admin') navigate('/admin');
        else navigate('/perfil');
      } else alert("Correo o contraseña incorrectos");
    })();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar sesión</h2>
        <label>Correo</label>
        <input
          type="email"
          placeholder="usuario@gmail.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

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
        <button onClick={handleLogin}>Iniciar sesión</button>

        <p>
          <span
            className="registro-link"
            onClick={() => navigate("/register")}
          >
            Registrarme
          </span>
        </p>
        <p className="olvide-link">Olvidé mi contraseña</p>
      </div>
    </div>
  );
};

export default Login;
