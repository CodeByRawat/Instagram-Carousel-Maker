import './linkedin.css'
import profilePhoto from '../../../assets/photo.png'

export function LinkedInNewsStorySlide({ slide, index }) {
  const num = slide?.storyNumber || String(index).padStart(2, '0')

  return (
    <div className="liSlide" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      {/* Ghost number */}
      <div className="liGhost">{num}</div>

      {/* Center block */}
      <div style={{ width: '100%', padding: '0 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

        {/* Accent bar just above category */}
        <div style={{ width: 120, height: 8, background: '#CCFF00', marginBottom: 28 }} />

        {/* Category + source */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center', marginBottom: 40 }}>
          {slide?.category && (
            <span style={{
              background: 'rgba(204,255,0,0.12)', color: '#CCFF00',
              fontSize: 15, fontWeight: 700, letterSpacing: 2.5,
              padding: '6px 16px', borderRadius: 4, textTransform: 'uppercase',
            }}>
              {slide.category}
            </span>
          )}
          {slide?.source && (
            <span style={{ fontSize: 15, fontWeight: 500, color: 'rgba(234,240,251,0.3)', letterSpacing: 0.5 }}>
              {slide.source}
            </span>
          )}
        </div>

        {/* Headline */}
        <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05, color: '#EAF0FB' }}>
          {slide?.headline || ''}
        </div>

        {/* Accent rule */}
        <div style={{ width: 56, height: 4, background: '#CCFF00', margin: '40px 0' }} />

        {/* Summary */}
        <div style={{ fontSize: 36, fontWeight: 400, lineHeight: 1.6, color: 'rgba(234,240,251,0.65)' }}>
          {(slide?.summary || '').split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>

      </div>

      {/* Author — bottom left */}
      <div style={{ position: 'absolute', bottom: 60, left: 80, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
          <img src={profilePhoto} alt="Sachin Rawat" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#EAF0FB', lineHeight: 1.3 }}>Sachin Rawat</div>
          <div style={{ fontSize: 20, fontWeight: 400, color: 'rgba(234,240,251,0.65)', lineHeight: 1.3 }}>AI &amp; Automation Engineer</div>
        </div>
      </div>

      {/* Footer tag — bottom right */}
      <div style={{ position: 'absolute', bottom: 60, right: 80, fontSize: 22, fontWeight: 500, color: '#CCFF00' }}>
        {slide?.footerTag || '/ daily news'}
      </div>

    </div>
  )
}
