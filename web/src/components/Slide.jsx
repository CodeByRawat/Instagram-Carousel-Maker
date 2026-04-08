import './slides.css'
import { HookSlide } from './slides/HookSlide.jsx'
import { LessonSlide } from './slides/LessonSlide.jsx'
import { CtaSlide } from './slides/CtaSlide.jsx'

export function Slide({ slide, index, total, slideRef }) {
  const type = slide?.type

  const common = {
    index,
    total,
    slide,
  }

  return (
    <div className="slide" ref={slideRef}>
      {type === 'hook' ? <HookSlide {...common} /> : null}
      {type === 'lesson' ? <LessonSlide {...common} /> : null}
      {type === 'cta' ? <CtaSlide {...common} /> : null}
      {!type ? <div className="slideInner">Missing slide type</div> : null}
    </div>
  )
}

