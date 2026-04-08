import { Phone } from './Phone.jsx'
import profilePic from '../../assets/profile picture.png'
import logo from '../../assets/logo.jpeg'

export function CtaSlide({ slide, index, total }) {
  const pillars = Array.isArray(slide?.pillars) ? slide.pillars : []

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className="topRule red" />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '620px 1fr',
          height: '100%',
        }}
      >
        <div style={{ padding: '78px 54px 160px' }}>
          <div className="label">{slide?.eyebrow || 'Follow for daily practice'}</div>
          <div style={{ marginTop: 14 }} className="headline">
            {slide?.headline || 'Build a calm mind — one verse a day.'}
          </div>
          <div className="subtext" style={{ maxWidth: 520 }}>
            {slide?.subtitle || 'Download the app. Save this post. Come back tomorrow.'}
          </div>

          <div style={{ marginTop: 26, display: 'grid', gap: 10 }}>
            {pillars.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 900,
                    color: 'var(--red)',
                    flex: '0 0 auto',
                    minWidth: 22,
                    lineHeight: 1.4,
                  }}
                >
                  {i + 1}.
                </div>
                <div style={{ fontSize: 20, color: 'var(--mid)', lineHeight: 1.35 }}>
                  {p}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 26 }}>
            <span
              style={{
                fontWeight: 900,
                fontSize: 26,
                borderBottom: '3px solid var(--red)',
                paddingBottom: 4,
              }}
            >
              @{slide?.handle || 'your_divine.sofia'}
            </span>
          </div>
        </div>

        <div style={{ background: 'var(--cream2)', padding: '78px 54px 160px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 24 }}>
            <img
              src={logo}
              alt="Wisdom app logo"
              style={{ width: 72, height: 72, borderRadius: 18, objectFit: 'cover', boxShadow: '0 8px 24px rgba(17,17,17,0.15)' }}
            />
            <Phone label={slide?.appScreenKey || 'app1'} width={260} height={460} />
          </div>
        </div>
      </div>

      <div className="authorBar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="avatar" style={{ borderColor: 'rgba(255,255,255,0.9)' }}>
            <img src={profilePic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          </div>
          <div className="authorMeta">
            <div className="authorHandle">@{slide?.handle || 'your_divine.sofia'}</div>
          </div>
        </div>

        <div style={{ display: 'grid', justifyItems: 'end', gap: 10 }}>
          <div className="ctaIcons">Like · Save · Share ✦</div>
          <div className="dots" aria-label={`Slide ${index + 1} of ${total}`}>
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`dot ${i === index ? 'active' : ''}`}
                style={{ background: i === index ? 'var(--red)' : 'rgba(255,255,255,0.35)' }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

