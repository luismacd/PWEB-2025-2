import React, { createContext, useContext, useEffect, useState } from 'react'
import { loginApi, registerApi } from '../api/authApi'
import { BASE_URL, authHeaders, handleResponse } from '../api/apiClient'

const AuthContext = createContext()

export function AuthProvider({ children }){
  // Persist user and token in localStorage
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem('token') } catch { return null }
  })

  // Flexible login: either login(email, password) -> calls API, or login(userObj) for legacy usage
  const login = async (a, b) => {
    // Clear any previous auth state before attempting a fresh login
    setUser(null);
    setToken(null);
    try { localStorage.removeItem('user'); localStorage.removeItem('token'); } catch {}

    // legacy: passed a user object
    if (typeof a === 'object'){
      // normalize and persist the provided user object
      const normalized = _normalizeUser(a);
      setUser(normalized)
      try { localStorage.setItem('user', JSON.stringify(normalized)) } catch {}
      return true
    }

    // standard: email,password
    try{
      const res = await loginApi(a, b)
      // support responses like { token, user } or { token, usuario }
      const tk = res.token || res.accessToken || res.tok || null
      const u = res.user || res.usuario || res.data || null
      if(tk){
        setToken(tk)
        try{ localStorage.setItem('token', tk) }catch{}
      }
      if(u){
        const normalized = _normalizeUser(u)
        setUser(normalized)
        try{ localStorage.setItem('user', JSON.stringify(normalized)) }catch{}
      }
      return !!(tk || u)
    }catch(e){
      console.error('login error', e)
      return false
    }
  }

  const register = async (userObj) => {
    try{
      // clear previous auth state before registering
      setUser(null);
      setToken(null);
      try { localStorage.removeItem('user'); localStorage.removeItem('token'); } catch {}

      const res = await registerApi(userObj)
      // If register API returns token/user, persist automatically
      const tk = res?.token || res?.accessToken || null
      const u = res?.user || res?.usuario || res?.data || null
      if(tk){
        setToken(tk)
        try{ localStorage.setItem('token', tk) }catch{}
      }
      if(u){
        const normalized = _normalizeUser(u)
        setUser(normalized)
        try{ localStorage.setItem('user', JSON.stringify(normalized)) }catch{}
      }
      return res
    }catch(e){
      console.error('register error', e)
      throw e
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    try { localStorage.removeItem('user'); localStorage.removeItem('token') } catch {}
  }

  // On mount / when token changes: verify token with backend (/auth/me).
  useEffect(() => {
    let cancelled = false;
    async function verify() {
      try {
        const localTk = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
        if (!localTk) return;
        const res = await fetch(`${BASE_URL}/auth/me`, { headers: authHeaders(localTk) });
        if (!res.ok) {
          // token invalid - clear stored auth
          setUser(null);
          setToken(null);
          try { localStorage.removeItem('user'); localStorage.removeItem('token') } catch {}
          return;
        }
        const body = await handleResponse(res);
        if (!cancelled && body) {
          const normalized = _normalizeUser(body);
          setUser(normalized);
          try { localStorage.setItem('user', JSON.stringify(normalized)) } catch {}
          // ensure token stored
          if (!token) {
            try { localStorage.setItem('token', localTk); setToken(localTk) } catch {}
          }
        }
      } catch (err) {
        // on network error, do nothing (keep existing local values)
        console.warn('Auth verify error', err);
      }
    }
    verify();
    return () => { cancelled = true; };
  }, [token]);

  // Helper to determine admin status
  const isAdmin = Boolean(user && (user.role === 'admin' || user.tipo === 'admin' || user.tipoUsuario === 'admin'))

  // --- internal helpers ---
  function _normalizeUser(u){
    if(!u) return null
    const tipo = u.tipoUsuario || u.tipo || u.role || u.roleName || null
    const nombre = u.nombre || u.name || u.firstName || u.fullName || u.fullname || ''
    const correo = u.correo || u.email || (u.usuario && u.usuario.correo) || ''
    const id = u.id || u.userId || u._id || null
    const normalized = { ...u, id, nombre, correo, tipoUsuario: tipo, role: tipo }
    return normalized
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext

