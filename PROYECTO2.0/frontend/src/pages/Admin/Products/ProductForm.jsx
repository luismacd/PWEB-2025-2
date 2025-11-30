import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BASE_URL, handleResponse, authHeaders } from '../../../api/apiClient'
import { useAuth } from '../../../context/AuthContext'
import './ProductForm.css'

export default function ProductForm(){
  const { id } = useParams()
  const nav = useNavigate()
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nombre:'', presentacion:'', descripcion:'', categoria:'', stock:0, precio:0, imagen:'' })

  useEffect(()=>{
    if(!id) return
    (async ()=>{
      try{
        const res = await fetch(`${BASE_URL}/productos/${id}`)
        const data = await handleResponse(res)
        setForm({
          nombre: data.nombre || '',
          presentacion: data.presentacion || '',
          descripcion: data.descripcion || '',
          categoria: data.categoria || '',
          stock: data.stock || 0,
          precio: data.precio || 0,
          imagen: data.imagen || ''
        })
      }catch(e){ console.error('load product', e) }
    })()
  },[id])

  const handleChange = (k,v)=> setForm(s=>({ ...s, [k]: v }))

  const handleSubmit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try{
      const method = id ? 'PUT' : 'POST'
      const url = id ? `${BASE_URL}/productos/${id}` : `${BASE_URL}/productos`
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type':'application/json', ...authHeaders(token) },
        body: JSON.stringify(form)
      })
      await handleResponse(res)
      nav('/admin/productos')
    }catch(e){ console.error('save product', e); alert('Error al guardar') }
    finally{ setLoading(false) }
  }

  return (
    <div className='product-form-page container'>
      <h2 className='form-title'>{id ? 'Editar' : 'Agregar'} un producto</h2>
      <form className='product-form' onSubmit={handleSubmit}>
        <div className='left-col'>
          <label className='field'>
            <div className='label'>Nombre del producto</div>
            <input value={form.nombre} onChange={e=>handleChange('nombre', e.target.value)} required placeholder='Nombre del producto' />
          </label>

          <label className='field'>
            <div className='label'>Presentación</div>
            <input value={form.presentacion} onChange={e=>handleChange('presentacion', e.target.value)} placeholder='Presentación' />
          </label>

          <label className='field'>
            <div className='label'>Categoría</div>
            <div className='row'>
              <select value={form.categoria} onChange={e=>handleChange('categoria', e.target.value)}>
                <option value=''>Seleccione la categoria del producto</option>
                <option value='Videojuegos'>Videojuegos</option>
                <option value='Consola'>Consola</option>
                <option value='Accesorios'>Accesorios</option>
              </select>
              <button type='button' className='btn-add' title='Agregar categoría'>+</button>
            </div>
          </label>

          <label className='field'>
            <div className='label'>Descripción</div>
            <textarea value={form.descripcion} onChange={e=>handleChange('descripcion', e.target.value)} placeholder='Descripción del producto...' />
          </label>

        </div>

        <div className='right-col'>
          <div className='image-dropzone'>
            <div className='dz-inner'>
              {form.imagen ? <img src={form.imagen} alt='preview' className='preview' onError={(e)=>{e.currentTarget.onerror=null; e.currentTarget.src='/unknown.jpg'}} /> : (
                <div className='dz-placeholder'>
                  <div className='dz-icon'>🖼️</div>
                  <div className='dz-text'>Arrastra la imagen a esta zona</div>
                  <div className='dz-sub'>o</div>
                  <label className='dz-button'>
                    Seleccionar imagen
                    <input type='file' accept='image/*' style={{display:'none'}} onChange={(ev)=>{
                      const f = ev.target.files && ev.target.files[0];
                      if (f) {
                        const url = URL.createObjectURL(f);
                        handleChange('imagen', url);
                      }
                    }} />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className='side-controls'>
            <label className='field small'>
              <div className='label'>Stock</div>
              <input type='number' value={form.stock} onChange={e=>handleChange('stock', Number(e.target.value))} placeholder='Stock' />
            </label>

            <div className='actions'>
              <button type='submit' className='btn-create' disabled={loading}>{loading ? 'Guardando...' : (id ? 'Actualizar producto' : 'Crear producto')}</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
