import React, { useEffect, useState, useRef } from 'react'
import { fetchProductsPage, fetchHomeSeries, fetchRecentProducts } from '../../api/productsApi'
import ProductCard from '../../components/ProductCard/ProductCard'
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel'
import './Home.css'

export default function Home(){
  const [top, setTop] = useState([])
  const [series, setSeries] = useState([])
  const [recent, setRecent] = useState([])
  const gridRef = useRef(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [total, setTotal] = useState(null)
  const [loadingPage, setLoadingPage] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(()=>{
    (async ()=>{
      try{
        // load first page
        setLoadingPage(true)
        const p1 = await fetchProductsPage(1, limit)
        setTop(p1.productos || [])
        setTotal(typeof p1.total === 'number' ? p1.total : (p1.productos || []).length)
        const s = await fetchHomeSeries()
        setSeries(s || [])
        const r = await fetchRecentProducts(8)
        setRecent(r || [])
      }catch(e){ console.error('Home data error', e) } finally{ setLoadingPage(false) }
    })()
  },[])

  // update scroll buttons availability
  useEffect(()=>{
    const el = gridRef.current
    if (!el) return
    const update = ()=>{
      setCanScrollLeft(el.scrollLeft > 5)
      // if total pages unknown, fallback to overflow detection
      const overflow = el.scrollWidth > el.clientWidth + 5
      const totalPages = total ? Math.ceil(total / limit) : null
      if (totalPages) {
        setCanScrollRight(page < totalPages || overflow)
      } else {
        setCanScrollRight(overflow)
      }
    }
    update()
    el.addEventListener('scroll', update)
    window.addEventListener('resize', update)
    return ()=>{ el.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [top, page, total, limit])

  const hasMore = total === null ? true : top.length < total

  const loadNextPage = async () => {
    const nextPage = page + 1
    if (loadingPage) return
    try {
      setLoadingPage(true)
      const res = await fetchProductsPage(nextPage, limit)
      const newItems = res.productos || []
      if (newItems.length > 0) {
        setTop(prev => [...prev, ...newItems])
        setPage(nextPage)
        if (typeof res.total === 'number') setTotal(res.total)
      }
    } catch (e) {
      console.error('load next page', e)
    } finally {
      setLoadingPage(false)
    }
  }

  const loadAllRemaining = async () => {
    if (loadingPage) return
    try {
      setLoadingPage(true)
      let next = page + 1
      while (true) {
        const res = await fetchProductsPage(next, limit)
        const newItems = res.productos || []
        if (!newItems.length) break
        setTop(prev => [...prev, ...newItems])
        if (typeof res.total === 'number') setTotal(res.total)
        setPage(next)
        next += 1
        // small delay to allow DOM updates for large loads
        await new Promise(r => setTimeout(r, 60))
        if (res.productos.length < limit) break
      }
    } catch (e) { console.error('load all remaining', e) }
    finally { setLoadingPage(false) }
  }

  const slides = [
    { image: 'https://blog.erikstore.com/wp-content/uploads/2024/08/Juegos-mas-vendidos-de-la-historia-1080x675.webp', title: 'Games 2025', subtitle: 'All games', cta: 'Añadir al carrito' },
    { image: 'https://assets.nintendo.com/image/upload/q_auto/f_auto/store/software/switch/70010000000964/a28a81253e919298beab2295e39a56b7a5140ef15abdb56135655e5c221b2a3a', title: 'Minecraft', subtitle: 'Steam Account - GLOBAL', cta: 'Añadir al carrito' }
  ]

  return (
    <div className="home container">
      <HeroCarousel slides={slides} />

      <section className="featured-cats">
        <h2>Explora las categorías</h2>
        <div className="cats">
          <div className="cat">Videojuegos</div>
          <div className="cat">Consolas</div>
          <div className="cat">Periféricos</div>
          <div className="cat">Coleccionables</div>
        </div>
        <div className="load-controls">
          {hasMore ? (
            <>
              <button className="btn load-more" onClick={loadNextPage} disabled={loadingPage}>
                {loadingPage ? 'Cargando...' : 'Cargar más'}
              </button>
              <button className="btn load-all" onClick={loadAllRemaining} disabled={loadingPage}>
                {loadingPage ? 'Cargando...' : 'Mostrar todos'}
              </button>
            </>
          ) : (
            <div className="no-more">No hay más productos</div>
          )}
        </div>
      </section>

      <section className="new-collection">
        <h2>Nueva colección</h2>
        <div className="grid">
          {recent.map(p => <ProductCard key={p.id} producto={p} />)}
        </div>
      </section>

      <section className="top-products">
        <h2>Lo más vendido</h2>
        <div className="grid-viewport">
          {canScrollLeft && (
            <button className="carousel-btn left" onClick={() => {
              const el = gridRef.current; if (!el) return; el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' });
            }}>&lt;</button>
          )}
          <div className="grid" ref={gridRef}>
            {top.map(p=> <ProductCard key={p.id} producto={p} />)}
          </div>
          {canScrollRight && (
            <button className="carousel-btn right" onClick={async () => {
            const el = gridRef.current; if (!el) return;
            // try to load next page if available
            const nextPage = page + 1
            const alreadyLoadedCount = top.length
            const expectedTotalPages = total ? Math.ceil(total / limit) : null
            if (expectedTotalPages && nextPage > expectedTotalPages) {
              // no more pages
              el.scrollBy({ left: el.clientWidth, behavior: 'smooth' });
              return
            }
            // If next page would bring new items, fetch them
            if (!loadingPage) {
              try{
                setLoadingPage(true)
                const res = await fetchProductsPage(nextPage, limit)
                const newItems = res.productos || []
                if (newItems.length > 0) {
                  setTop(prev => [...prev, ...newItems])
                  setPage(nextPage)
                  if (typeof res.total === 'number') setTotal(res.total)
                  // allow DOM to update then scroll to next page
                  setTimeout(()=> el.scrollBy({ left: el.clientWidth, behavior: 'smooth' }), 80)
                  return
                }
              }catch(e){ console.error('load next page', e) }
              finally{ setLoadingPage(false) }
            }
            // fallback: just scroll
            el.scrollBy({ left: el.clientWidth, behavior: 'smooth' });
            }}>
              {loadingPage ? <span className="spinner"/> : '>'}
            </button>
          )}
        </div>
      </section>

      <section>
        <h2>Series nuevas</h2>
        <div className="grid small">
          {series.map(s=> (
            <div key={s.id} className="serie-card">
              <img src={s.imagen || s.image || '/placeholder.png'} alt={s.nombre} />
              <div>{s.nombre}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
