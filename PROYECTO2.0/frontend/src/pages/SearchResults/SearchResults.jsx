import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { searchProducts } from '../../api/productsApi'
import ProductCard from '../../components/ProductCard/ProductCard'

function useQuery(){ return new URLSearchParams(useLocation().search) }

export default function SearchResults(){
  const q = useQuery().get('q') || ''
  const [results, setResults] = useState([])

  useEffect(()=>{ (async()=>{ setResults(await searchProducts(q)) })() },[q])

  return (
    <div className="container">
      <h2>Resultados para: "{q}"</h2>
      <div className="grid">
        {results.map(p=> <ProductCard key={p.id} producto={p} />)}
      </div>
    </div>
  )
}
