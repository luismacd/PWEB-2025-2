import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { OrderProvider } from './components/context/OrderContext'
import { CartProvider } from './context/CartContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <OrderProvider>
        <CartProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CartProvider>
      </OrderProvider>
    </AuthProvider>
  </React.StrictMode>
)
