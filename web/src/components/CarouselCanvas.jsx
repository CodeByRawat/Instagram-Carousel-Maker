import { Fragment } from 'react'
import { Slide } from './Slide.jsx'

export function CarouselCanvas({ carousel, scale = 1, slideRefSetter }) {
  const slides = Array.isArray(carousel?.slides) ? carousel.slides : []

  return (
    <div className="canvasWrap">
      <div
        className="canvas"
        style={{
          zoom: scale,
        }}
      >
        {slides.map((slide, idx) => (
          <Fragment key={idx}>
            <Slide
              slide={slide}
              index={idx}
              total={slides.length}
              slideRef={(node) => slideRefSetter?.(idx, node)}
            />
            {idx !== slides.length - 1 ? <div className="gap" /> : null}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

