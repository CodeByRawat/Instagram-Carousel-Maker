import './dadly.css'
import dadlyLogo from '../../../assets/pagefordas logo.png'

export function DadlyHookSlide({ slide, index, total }) {
  return (
    <div className="dadlySlide">
      <div className="dadlyTopBar" />
      <div className="dadlyTag">{slide?.roleTag || 'FOR DADS'}</div>

      <div className="dadlyHook">
        <div className="dadlyEyebrow">{slide?.eyebrow || '↓ Read this'}</div>
        <div className="dadlyHookHeadline">
          {formatHeadline(slide?.headline || 'Nobody *prepares* you for this.')}
        </div>
        <div className="dadlyHookSub">{slide?.subtext || ''}</div>
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
