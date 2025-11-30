import React from 'react'
import Navbar from './Navbar/Navbar'
import './Header.css'

export default function Header(){
  return (
    <header className="site-header">
      <div className="top-strip">
        <div className="top-strip-inner">
          <span className="dot" />
          <span className="text">Envíos rápidos · Soporte 24/7 · Ofertas diarias</span>
        </div>
      </div>
      <Navbar />
    </header>
  )
}
