import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/context/UserContext";
import "./CambiarContraseña.css"; 

const CambiarContraseña = () => {
  const navigate = useNavigate();

  const [antigua, setAntigua] = useState("");
  const [nueva, setNueva] = useState("");
  const [repetir, setRepetir] = useState("");
  const {changePassword} = useUser();

  const handleCambiar = () => {
    
    if (!antigua || !nueva || !repetir) {
      return alert("Por favor completa todos los campos");
    }

    if (nueva.length < 6) {
      return alert("La nueva contraseña debe tener al menos 6 caracteres");
     
    }

    if (nueva !== repetir) {
      return alert("Las contraseñas nuevas no coinciden");
    }

    const exito = changePassword(antigua, nueva);

    if (exito) {
      alert("Contraseña cambiada correctamente");
      setAntigua("");
      setNueva("");
      setRepetir("");
      navigate("/Home"); 
      alert("Contraseña actual incorrecta");
    }
  };

  return (
    <div className="Cambiar-container">
      <div className="Cambiar-card">
        <h2>Cambiar contraseña</h2>

        <label>Contraseña actual</label>
        <input
          type="password"
          placeholder="Ingresa tu contraseña actual"
          value={antigua}
          onChange={(e) => setAntigua(e.target.value)}
        />

        <label>Nueva contraseña</label>
        <input
          type="password"
          placeholder="Contraseña"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
        />

        <label>Repetir Contraseña</label>
        <input
          type="password"
          placeholder="Contraseña"
          value={repetir}
          onChange={(e) => setRepetir(e.target.value)}
        />

        <button onClick={handleCambiar}>Cambiar contraseña</button>

      </div>
    </div>
  );
};

export default CambiarContraseña;

