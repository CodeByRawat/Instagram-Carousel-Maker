import './dadly.css'
import dadlyLogo from '../../../assets/pagefordas logo.png'

export function DadlyLessonSlide({ slide, index, total }) {
  return (
    <div className="dadlySlide">
      <div className="dadlyTopBar" />
      <div className="dadlyGhostNum">{slide?.ghostNumber || String(index + 1).padStart(2, '0')}</div>

      <div className="dadlyLesson">
        <div className="dadlyLessonLabel">{slide?.lessonLabel || `Tip ${index}`}</div>
        <div className="dadlyLessonHeadline">
          {formatHeadline(slide?.headline || slide?.quote || '')}
        </div>
        <div className="dadlyDivider" />
        <div className="dadlyLessonBody" dangerouslySetInnerHTML={{ __html: formatBody(slide?.body || slide?.applicationBody || '') }} />
      </div>

      <div className="dadlyFooter">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img
            src={dadlyLogo}
            alt="pagefordads"
            style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(200,146,42,0.5)' }}
          />
          <div className="dadlyHandle">@{slide?.handle || 'pagefordads'}</div>
        </div>
        <div className="dadlyDots">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`dadlyDot ${i === index ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

function formatHeadline(text) {
  return text.split(/(\*[^*]+\*)/).map((part, i) =>
    part.startsWith('*') && part.endsWith('*')
      ? <em key={i}>{part.slice(1, -1)}</em>
      : part
  )
}

function formatBody(text) {
  return text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}
