import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="col">
          <h4>Síguenos</h4>
          <div className="socials">Facebook · X · Instagram · YouTube</div>
        </div>

        <div className="col">
          <h4>Nosotros</h4>
          <ul>
            <li>Conócenos</li>
            <li>Responsabilidad social</li>
            <li>Nuestras tiendas</li>
          </ul>
        </div>

        <div className="col">
          <h4>Atención al cliente</h4>
          <ul>
            <li>Atención al cliente</li>
            <li>Horarios</li>
            <li>Preguntas frecuentes</li>
          </ul>
        </div>

        <div className="col">
          <h4>Políticas y condiciones</h4>
          <ul>
            <li>Política de datos</li>
            <li>Términos y condiciones</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">© 2025 Tienda On-Line · Todos los derechos reservados</div>
    </footer>
  );
}
