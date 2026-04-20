import './linkedin.css'
import profilePhoto from '../../../assets/photo.png'

function headingSize(lines) {
  const maxLen = Math.max(...lines.map((l) => (l || '').length))
  if (maxLen <= 8)  return { fs: 210, blockH: 210 }
  if (maxLen <= 12) return { fs: 170, blockH: 170 }
  if (maxLen <= 16) return { fs: 138, blockH: 138 }
  return               { fs: 110, blockH: 110 }
}

export function LinkedInCoverSlide({ slide }) {
  const line1 = slide?.line1 || 'The most important'
  const line2 = slide?.line2 || 'file in your repo'
  const line3 = slide?.line3 || 'is a markdown file.'
  const { fs, blockH } = headingSize([line1, line2, line3])

  const subtitle = (slide?.subtitle || 'CLAUDE.md. AGENTS.md. Cursor rules.')
    .split('\n')

  return (
    <div className="liSlide" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      {/* Center block — everything stacked, center aligned */}
      <div style={{ width: '100%', padding: '0 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

        {/* Accent bar — sits just above eyebrow */}
        <div style={{ width: 120, height: 8, background: '#CCFF00', marginBottom: 28 }} />

        {/* Eyebrow */}
        <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: 2, color: '#EAF0FB', marginBottom: 44 }}>
          {slide?.eyebrow || 'AI & AUTOMATION · FIELD NOTES'}
        </div>

        {/* Headline lines */}
        <div style={{ width: '100%' }}>
          <div style={{ fontSize: fs, fontWeight: 700, letterSpacing: -5, lineHeight: 1.0, color: '#EAF0FB', textTransform: 'uppercase' }}>
            {line1}
          </div>
          <div style={{ fontSize: fs, fontWeight: 700, letterSpacing: -5, lineHeight: 1.0, color: '#EAF0FB', marginTop: 6, textTransform: 'uppercase' }}>
            {line2}
          </div>
          {/* Neon-green hero block */}
          <div style={{
            background: '#CCFF00',
            width: '100%',
            minHeight: blockH,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 8,
            padding: '6px 0',
          }}>
            <div style={{ fontSize: fs, fontWeight: 700, letterSpacing: -5, lineHeight: 1.0, color: '#1B1B1B', textTransform: 'uppercase' }}>
              {line3}
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div style={{ marginTop: 52 }}>
          {subtitle.map((line, i) => (
            <div key={i} style={{ fontSize: 52, fontWeight: 400, lineHeight: 1.35, color: '#EAF0FB' }}>
              {line}
            </div>
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
        {slide?.footerTag || '/ workflow notes'}
      </div>

    </div>
  )
}
