import { useState } from 'react'
import { Slide } from './Slide.jsx'
import './CarouselPreview.css'

const SLIDE_W = 1080
const SLIDE_H = 1080

export function CarouselPreview({ carousel, scale = 0.65 }) {
  const slides = Array.isArray(carousel?.slides) ? carousel.slides : []
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((i) => Math.max(0, i - 1))
  const next = () => setCurrent((i) => Math.min(slides.length - 1, i + 1))

  const frameW = SLIDE_W * scale
  const frameH = SLIDE_H * scale

  return (
    <div className="igPreviewWrap">
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
                <Slide slide={slide} index={idx} total={slides.length} />
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
