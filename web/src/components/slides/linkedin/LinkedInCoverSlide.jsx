import './linkedin.css'
import profilePhoto from '../../../assets/profile.png'

function headingSize(lines) {
  const maxLen = Math.max(...lines.map((l) => (l || '').length))
  if (maxLen <= 8)  return { fs: 150, blockH: 148 }
  if (maxLen <= 12) return { fs: 118, blockH: 118 }
  if (maxLen <= 16) return { fs: 96,  blockH: 96  }
  return               { fs: 80,  blockH: 80  }
}

export function LinkedInCoverSlide({ slide }) {
  const line1 = slide?.line1 || 'The most important'
  const line2 = slide?.line2 || 'file in your repo'
  const line3 = slide?.line3 || 'is a markdown file.'
  const { fs, blockH } = headingSize([line1, line2, line3])

  const subtitle = (slide?.subtitle || 'CLAUDE.md. AGENTS.md. Cursor rules.')
    .split('\n')

  return (
    <div className="liSlide">
      {/* Content stacked from top */}
      <div style={{ padding: '60px 60px 0 60px', display: 'flex', flexDirection: 'column' }}>

        {/* Accent bar */}
        <div className="liAccentBar" />

        {/* Eyebrow */}
        <div className="liEyebrow">
          {slide?.eyebrow || 'AI & AUTOMATION · FIELD NOTES'}
        </div>

        {/* 3-line headline */}
        <div style={{ marginTop: 40 }}>
          <div style={{ fontSize: fs, fontWeight: 700, letterSpacing: -4, lineHeight: 1.0, color: '#EAF0FB' }}>
            {line1}
          </div>
          <div style={{ fontSize: fs, fontWeight: 700, letterSpacing: -4, lineHeight: 1.0, color: '#EAF0FB', marginTop: 4 }}>
            {line2}
          </div>
          {/* Neon-green hero block */}
          <div style={{
            background: '#CCFF00',
            width: 820,
            minHeight: blockH,
            display: 'flex',
            alignItems: 'center',
            marginTop: 6,
            padding: '4px 0',
          }}>
            <div style={{ fontSize: fs, fontWeight: 700, letterSpacing: -4, lineHeight: 1.0, color: '#1B1B1B' }}>
              {line3}
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div style={{ marginTop: 44 }}>
          {subtitle.map((line, i) => (
            <div key={i} style={{ fontSize: 44, fontWeight: 400, lineHeight: 1.35, color: '#EAF0FB' }}>
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Footer pinned at bottom */}
      <div className="liFooter">
        <div className="liDividerLine" />
        <div className="liFooterRow">
          <div className="liAuthorBlock">
            <div className="liAvatar" style={{ overflow: 'hidden', background: 'none', padding: 0 }}>
              <img src={profilePhoto} alt="Sachin Rawat" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
            <div>
              <div className="liAuthorName">Sachin Rawat</div>
              <div className="liAuthorRole">AI &amp; Automation Engineer</div>
            </div>
          </div>
          <div className="liFooterTag">{slide?.footerTag || '/ workflow notes'}</div>
        </div>
      </div>
    </div>
  )
}
