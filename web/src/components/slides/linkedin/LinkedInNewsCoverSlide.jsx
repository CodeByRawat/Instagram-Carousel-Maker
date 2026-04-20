import './linkedin.css'
import profilePhoto from '../../../assets/photo.png'

export function LinkedInNewsCoverSlide({ slide }) {
  const storyCount = slide?.storyCount || '10 STORIES'

  return (
    <div className="liSlide" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      {/* Center block */}
      <div style={{ width: '100%', padding: '0 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

        {/* Accent bar just above eyebrow */}
        <div style={{ width: 120, height: 8, background: '#CCFF00', marginBottom: 28 }} />

        {/* Eyebrow */}
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 2.5, color: 'rgba(234,240,251,0.55)', textTransform: 'uppercase', marginBottom: 48 }}>
          {slide?.eyebrow || 'AI & AUTOMATION · DAILY NEWS'}
        </div>

        {/* Giant day number */}
        <div style={{ fontSize: 260, fontWeight: 900, letterSpacing: -12, lineHeight: 0.85, color: '#EAF0FB' }}>
          {slide?.dateDay || '19'}
        </div>

        {/* Month + Year */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 20, justifyContent: 'center' }}>
          <div style={{ fontSize: 90, fontWeight: 800, letterSpacing: -3, color: '#CCFF00', lineHeight: 1 }}>
            {slide?.dateMonth || 'APR'}
          </div>
          <div style={{ fontSize: 80, fontWeight: 400, letterSpacing: -2, color: 'rgba(234,240,251,0.3)', lineHeight: 1 }}>
            {slide?.dateYear || '2026'}
          </div>
        </div>

        {/* Story count pill */}
        <div style={{ marginTop: 52 }}>
          <span style={{
            background: '#CCFF00', color: '#1B1B1B',
            fontSize: 20, fontWeight: 800, letterSpacing: 2,
            padding: '12px 26px', borderRadius: 4, textTransform: 'uppercase',
          }}>
            {storyCount}
          </span>
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 42, fontWeight: 400, color: 'rgba(234,240,251,0.55)', marginTop: 28, lineHeight: 1.4 }}>
          {slide?.subtitle || 'what happened in AI today'}
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
