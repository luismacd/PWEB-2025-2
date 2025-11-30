import { BASE_URL, handleResponse } from './apiClient';

// Local fallback helpers (used when backend is not available)
function _getLocalUsers(){
  try{ const raw = localStorage.getItem('local_users'); return raw ? JSON.parse(raw) : [] }catch{return []}
}
function _saveLocalUsers(list){
  try{ localStorage.setItem('local_users', JSON.stringify(list)) }catch{}
}
function _generateToken(payload){
  try{ return btoa(JSON.stringify({ p: payload, t: Date.now() })) }catch{return Math.random().toString(36).slice(2)}
}

export async function loginApi(email, password){
  // Try real backend first
  try{
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: email, password: password }),
    });
    // If backend returns OK-ish response, use it
    if (res.ok) return handleResponse(res);
    // otherwise fall through to local
  }catch(e){
    // network error -> fallback to local
  }

  // Local fallback: find user in local storage
  const users = _getLocalUsers();
  const found = users.find(u => (u.correo === email || u.email === email) && (u.contraseña === password || u.password === password));
  if (!found) throw new Error('Invalid credentials (local)');
  const token = _generateToken({ correo: found.correo, id: found.id || found.DNI || found.dni });
  return { token, user: found };
}

export async function registerApi(user){
  // Try backend register first
  try{
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (res.ok) return handleResponse(res);
    // otherwise fallback
  }catch(e){
    // network error -> fallback
  }

  // Local fallback: create user in local storage
  const users = _getLocalUsers();
  // prevent duplicate email
  const exists = users.find(u => u.correo === user.correo || u.email === user.email);
  if (exists) throw new Error('Email already registered (local)');
  const newUser = {
    id: (Date.now()).toString(),
    nombre: user.nombre || user.name || '',
    apellido: user.apellido || user.lastname || '',
    correo: user.correo || user.email,
    contraseña: user.contraseña || user.password,
    DNI: user.DNI || user.dni || '',
    role: user.role || user.tipo || 'usuario',
    active: true,
  };
  users.push(newUser);
  _saveLocalUsers(users);
  const token = _generateToken({ correo: newUser.correo, id: newUser.id });
  return { token, user: newUser };
}

export default { loginApi, registerApi };
