import './linkedin.css'
import profilePhoto from '../../../assets/profile.png'
import { renderLinkedInText } from './renderLinkedIn.jsx'

export function LinkedInCtaSlide({ slide }) {
  const footerTag = slide?.footerTag || '/ workflow notes'

  return (
    <div className="liSlide">
      {/* Ghost accent */}
      <div style={{
        position: 'absolute',
        right: 50,
        top: 44,
        fontSize: 280,
        fontWeight: 900,
        letterSpacing: -10,
        color: 'rgba(204,255,0,0.04)',
        lineHeight: 1,
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        ↗
      </div>

      {/* Main content — vertically centred */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: '60px 60px 200px 60px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Top anchor */}
        <div>
          <div className="liAccentBar" />
        </div>

        {/* Centred content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="liCtaEyebrow">
            {slide?.eyebrow || 'BUILDING IN PUBLIC · AI & AUTOMATION'}
          </div>
          <div className="liCtaHeadline">
            {(slide?.headline || 'follow for\nmore.').split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
          <div className="liCtaSubtitle">
            {renderLinkedInText(slide?.subtitle || "AI agents, automation workflows, and what I'm actually shipping.")}
          </div>
        </div>
      </div>

      {/* Footer */}
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
          <div className="liFooterTag">{footerTag}</div>
        </div>
      </div>
    </div>
  )
}
