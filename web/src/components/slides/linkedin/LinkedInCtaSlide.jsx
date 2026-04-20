import './linkedin.css'
import profilePhoto from '../../../assets/photo.png'
import { renderLinkedInText } from './renderLinkedIn.jsx'

export function LinkedInCtaSlide({ slide }) {
  const footerTag = slide?.footerTag || '/ workflow notes'

  return (
    <div className="liSlide" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      {/* Ghost accent */}
      <div style={{
        position: 'absolute', right: 50, top: 44,
        fontSize: 320, fontWeight: 900, letterSpacing: -10,
        color: 'rgba(204,255,0,0.04)', lineHeight: 1,
        pointerEvents: 'none', userSelect: 'none',
      }}>↗</div>

      {/* Center block */}
      <div style={{ width: '100%', padding: '0 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

        {/* Accent bar just above eyebrow */}
        <div style={{ width: 120, height: 8, background: '#CCFF00', marginBottom: 28 }} />

        {/* Eyebrow */}
        <div className="liCtaEyebrow">
          {slide?.eyebrow || 'BUILDING IN PUBLIC · AI & AUTOMATION'}
        </div>

        {/* Headline */}
        <div className="liCtaHeadline">
          {(slide?.headline || 'follow for\nmore.').split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>

        {/* Subtitle */}
        <div className="liCtaSubtitle" style={{ textAlign: 'center', maxWidth: '100%' }}>
          {renderLinkedInText(slide?.subtitle || "AI agents, automation workflows, and what I'm actually shipping.")}
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
        {footerTag}
      </div>

    </div>
  )
}
