import { useState, useRef, useEffect } from 'react'
import { Slide } from './Slide.jsx'
import './CarouselPreview.css'

const SLIDE_W = 1200
const MAX_SCALE = 0.65

export function CarouselPreview({ carousel, SlideComponent = Slide, slideHeight = 1500 }) {
  const SLIDE_H = slideHeight
  const slides = Array.isArray(carousel?.slides) ? carousel.slides : []
  const [current, setCurrent] = useState(0)
  const [scale, setScale] = useState(MAX_SCALE)
  const wrapRef = useRef(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const available = entry.contentRect.width - 32 // 16px padding each side
      const computed = Math.min(available / SLIDE_W, MAX_SCALE)
      setScale(Math.max(computed, 0.2))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const prev = () => setCurrent((i) => Math.max(0, i - 1))
  const next = () => setCurrent((i) => Math.min(slides.length - 1, i + 1))

  const frameW = SLIDE_W * scale
  const frameH = SLIDE_H * scale

  return (
    <div className="igPreviewWrap" ref={wrapRef}>
      {/* Slide frame — clips to one slide at a time */}
      <div className="igFrame" style={{ width: frameW, height: frameH }}>

        {/* Scale + slide track */}
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: SLIDE_W * slides.length, height: SLIDE_H }}>
          <div
            className="igTrack"
            style={{ transform: `translateX(${-current * SLIDE_W}px)` }}
          >
            {slides.map((slide, idx) => (
              <div key={idx} style={{ width: SLIDE_W, height: SLIDE_H, flexShrink: 0 }}>
                <SlideComponent slide={slide} index={idx} total={slides.length} />
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        {current > 0 && (
          <button className="igArrow igArrow--left" onClick={prev} aria-label="Previous slide">
            ‹
          </button>
        )}
        {current < slides.length - 1 && (
          <button className="igArrow igArrow--right" onClick={next} aria-label="Next slide">
            ›
          </button>
        )}

        {/* Slide counter badge */}
        <div className="igCounter">{current + 1} / {slides.length}</div>
      </div>

      {/* Dots */}
      <div className="igDots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`igDot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
