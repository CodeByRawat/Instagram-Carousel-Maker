import './linkedin.css'
import profilePhoto from '../../../assets/profile.png'
import { renderLinkedInText } from './renderLinkedIn.jsx'

export function LinkedInContentSlide({ slide, index }) {
  const num = slide?.slideNumber || String(index).padStart(2, '0')
  const footerTag = slide?.footerTag || '/ workflow notes'

  return (
    <div className="liSlide">
      {/* Ghost number — decorative */}
      <div className="liGhost">{num}</div>

      {/* Main content area — vertically centered between top and footer */}
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
        {/* Top anchor: accent bar + label */}
        <div>
          <div className="liAccentBar" />
          <div className="liSlideLabel" style={{ marginTop: 28 }}>
            {slide?.lessonLabel || `tip ${num}`}
          </div>
        </div>

        {/* Centred block: headline + rule + body */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div className="liHeadline">{slide?.headline || ''}</div>
          <div className="liAccentRule" />
          <div className="liBody">{renderLinkedInText(slide?.body || '')}</div>
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
          <div className="liFooterTag">{footerTag}</div>
        </div>
      </div>
    </div>
  )
}
