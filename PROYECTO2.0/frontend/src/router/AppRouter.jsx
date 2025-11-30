import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home/Home'
import SearchResults from '../pages/SearchResults/SearchResults'
import ProductDetail from '../pages/ProductDetail/ProductDetail'
import LoginPage from '../pages/Login/Login'
import RegisterPage from '../pages/Register/Register'
import PerfilUsuario from '../pages/PerfilUsuario/PerfilUsuario'
import Carrito from '../pages/Carrito/Carrito'
import OrdenesList from '../pages/Ordenes/ListaOrdenes'
import OrdenDetalle from '../pages/Ordenes/DetalleOrden'
import CambiarContrasena from '../pages/CambiarContraseña/CambiarContraseñaPage'
import AdminDashboard from '../pages/Admin/Dashboard/DashboardAdmin'
import AdminProducts from '../pages/Admin/Products/ProductsList'
import AdminProductForm from '../pages/Admin/Products/ProductForm'
import AdminUsers from '../pages/Admin/Users/UsersList'
import AdminUserDetail from '../pages/Admin/Users/UserDetail'
import AdminOrders from '../pages/Admin/Orders/OrdersList'
import AdminOrderDetail from '../pages/Admin/Orders/OrderDetail'
import { useAuth } from '../context/AuthContext'

function RequireAdmin({ children }){
  const { user, isAdmin } = useAuth()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  // If there's no token or the auth context doesn't indicate admin, redirect to login
  // If there's no token at all, force login
  if (!token) return <Navigate to='/login' replace />
  // If we have a token but auth context hasn't resolved admin status yet, allow render and let backend enforce permissions.
  if (!isAdmin && user) return <Navigate to='/' replace />
  return children
}

function RequireAuth({ children }){
  const { user } = useAuth()
  // If there's no user in context, check if a token exists in storage.
  // This avoids redirecting to login during the brief window after login where the auth context verifies the token.
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if(!user && !token) return <Navigate to='/login' />
  return children
}

export default function AppRouter(){
  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/search' element={<SearchResults/>} />
      <Route path='/login' element={<LoginPage/>} />
      <Route path='/register' element={<RegisterPage/>} />
      <Route path='/perfil' element={<RequireAuth><PerfilUsuario/></RequireAuth>} />
      <Route path='/carrito' element={<RequireAuth><Carrito/></RequireAuth>} />
      <Route path='/ordenes' element={<RequireAuth><OrdenesList/></RequireAuth>} />
      <Route path='/ordenes/:id' element={<RequireAuth><OrdenDetalle/></RequireAuth>} />
      <Route path='/cambiar-contraseña' element={<RequireAuth><CambiarContrasena/></RequireAuth>} />
      <Route path='/categorias' element={<Home/>} />
      <Route path='/products' element={<Home/>} />
      <Route path='/producto/:id' element={<ProductDetail/>} />

      <Route path='/admin' element={<RequireAdmin><AdminDashboard/></RequireAdmin>} />
      <Route path='/admin/productos' element={<RequireAdmin><AdminProducts/></RequireAdmin>} />
      <Route path='/admin/productos/nuevo' element={<RequireAdmin><AdminProductForm/></RequireAdmin>} />
      <Route path='/admin/productos/:id' element={<RequireAdmin><AdminProductForm/></RequireAdmin>} />

      <Route path='/admin/usuarios' element={<RequireAdmin><AdminUsers/></RequireAdmin>} />
      <Route path='/admin/usuarios/:id' element={<RequireAdmin><AdminUserDetail/></RequireAdmin>} />

      <Route path='/admin/ordenes' element={<RequireAdmin><AdminOrders/></RequireAdmin>} />
      <Route path='/admin/ordenes/:id' element={<RequireAdmin><AdminOrderDetail/></RequireAdmin>} />

      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  )
}
