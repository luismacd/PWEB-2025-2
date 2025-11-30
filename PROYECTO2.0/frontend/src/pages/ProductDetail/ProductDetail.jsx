import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById } from '../../api/productsApi'
import { useCart } from '../../context/CartContext.jsx'
import formatMoney from '../../utils/formatMoney'

export default function ProductDetail(){
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { agregarAlCarrito } = useCart()

  useEffect(()=>{
    let mounted = true
    ;(async()=>{
      setLoading(true)
      setError(null)
      try{
        const p = await getProductById(id)
        if (mounted) setProduct(p)
      }catch(e){
        console.error('getProductById error', e)
        if (mounted) setError(e?.message || 'Error al cargar el producto')
      }finally{
        if (mounted) setLoading(false)
      }
    })()
    return ()=>{ mounted = false }
  },[id])

  if (loading) return <div className="container">Cargando producto...</div>
  if (error) return <div className="container">Error: {error}</div>
  if (!product) return <div className="container">Producto no encontrado</div>

  const img = product.imagen || product.image || '/placeholder.png'

  return (
    <div className="container product-detail">
      <h2>{product.nombre}</h2>
      <div style={{display:'flex',gap:24,alignItems:'flex-start',flexWrap:'wrap'}}>
        <div style={{flex:'0 0 320px'}}>
          <img src={img} alt={product.nombre} style={{width:'100%', maxWidth:400, borderRadius:8}} />
        </div>
        <div style={{flex:'1 1 320px', minWidth:240}}>
          <p><strong>Precio:</strong> {formatMoney(product.precio)}</p>
          <p><strong>Categoría:</strong> {product.categoria || '—'}</p>
          <p><strong>Presentación:</strong> {product.presentacion || '—'}</p>
          <p><strong>Stock:</strong> {typeof product.stock !== 'undefined' ? product.stock : '—'}</p>
          <p><strong>Activo:</strong> {product.activo ? 'Sí' : 'No'}</p>
          <div style={{marginTop:12}}>
            <p><strong>Descripción:</strong></p>
            <p style={{whiteSpace:'pre-wrap'}}>{product.descripcion || 'Sin descripción disponible.'}</p>
          </div>
          <div style={{marginTop:18}}>
            <button className="product-btn" onClick={()=>agregarAlCarrito(product)}>Agregar al carrito</button>
          </div>
        </div>
      </div>
    </div>
  )
}
