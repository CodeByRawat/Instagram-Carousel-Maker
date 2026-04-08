import { DadlyHookSlide } from './slides/dadly/DadlyHookSlide.jsx'
import { DadlyLessonSlide } from './slides/dadly/DadlyLessonSlide.jsx'
import { DadlyCtaSlide } from './slides/dadly/DadlyCtaSlide.jsx'

export function DadlySlide({ slide, index, total, slideRef }) {
  const type = slide?.type
  const common = { slide, index, total }

  return (
    <div ref={slideRef} style={{ width: 1080, height: 1350, position: 'relative' }}>
      {type === 'hook'   ? <DadlyHookSlide   {...common} /> : null}
      {type === 'lesson' ? <DadlyLessonSlide {...common} /> : null}
      {type === 'cta'    ? <DadlyCtaSlide    {...common} /> : null}
      {!type ? <div style={{ padding: 40, color: '#fff', background: '#0d1b3e', width: '100%', height: '100%' }}>Missing slide type</div> : null}
    </div>
  )
}
