import React, { useEffect, useState } from 'react'
import './HeroCarousel.css'

export default function HeroCarousel({ slides = [] }){
  const [index, setIndex] = useState(0)

  useEffect(()=>{
    const t = setInterval(()=> setIndex(i=> (i+1) % slides.length), 5000)
    return ()=> clearInterval(t)
  },[slides.length])

  if(!slides || slides.length===0) return null

  return (
    <div className="hero-carousel">
      {slides.map((s,i)=> (
        <div key={i} className={`slide ${i===index? 'active':''}`} style={{backgroundImage:`url(${s.image})`}}>
          <div className="slide-overlay">
            <div className="slide-content">
              <h2>{s.title}</h2>
              <p>{s.subtitle}</p>
              {s.cta && <button className="cta" onClick={s.onClick}>{s.cta}</button>}
            </div>
          </div>
        </div>
      ))}

      <div className="controls">
        <button className="prev" onClick={()=> setIndex(i=> (i-1+slides.length)%slides.length)}>&lt;</button>
        <div className="indicators">
          {slides.map((_,i)=> <button key={i} className={`dot ${i===index?'active':''}`} onClick={()=>setIndex(i)} />)}
        </div>
        <button className="next" onClick={()=> setIndex(i=> (i+1)%slides.length)}>&gt;</button>
      </div>
    </div>
  )
}
