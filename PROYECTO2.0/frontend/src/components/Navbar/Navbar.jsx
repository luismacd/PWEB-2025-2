import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="site-navbar">
      <div className="topbar">
        <div className="brand"><Link to="/">GamePlay</Link></div>
        <div className="search">
          <input placeholder="Buscar un producto..." onKeyDown={(e) => {
            if (e.key === "Enter") navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
          }} />
        </div>
        <div className="actions">
          <button className="cart-btn" onClick={() => navigate('/carrito')}>Carrito · S/ 0.00</button>
          {user ? (
            <>
              <Link to="/perfil" className="user-link">{user.nombre || 'Mi cuenta'}</Link>
              {user.role === "admin" && <Link to="/admin" className="user-link">Admin</Link>}
              <button className="link-btn" onClick={() => { logout(); navigate("/"); }}>Salir</button>
            </>
          ) : (
            <Link to="/login" className="user-link">Login</Link>
          )}
        </div>
      </div>

      <nav className="main-nav">
        <div className="nav-inner">
          <Link to="/categorias">Categorías</Link>
          <Link to="/products">Productos</Link>
          <Link to="/nosotros">Nosotros</Link>
          <div className="spacer" />
          <div className="offer">OFERTAS 🔥</div>
        </div>
      </nav>
    </header>
  );
}
