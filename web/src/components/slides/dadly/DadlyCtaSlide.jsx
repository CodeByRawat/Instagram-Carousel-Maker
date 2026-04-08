import './dadly.css'
import dadlyLogo from '../../../assets/pagefordas logo.png'

export function DadlyCtaSlide({ slide, index, total }) {
  const features = Array.isArray(slide?.pillars) ? slide.pillars : []

  return (
    <div className="dadlySlide">
      <div className="dadlyTopBar" />

      <div className="dadlyCta">
        <div className="dadlyCtaBadge">{slide?.eyebrow || 'Built for dads'}</div>
        <div className="dadlyCtaHeadline">{slide?.headline || 'Get answers\nat 3am.'}</div>
        <div className="dadlyCtaSub">{slide?.subtitle || 'Download Dadly — the app built for new and expecting dads.'}</div>

        <div className="dadlyCtaFeatures">
          {features.map((f, i) => (
            <div key={i} className="dadlyCtaFeatureRow">
              <div className="dadlyCtaNum">{i + 1}.</div>
              <div className="dadlyCtaFeatureText">{f}</div>
            </div>
          ))}
        </div>

        <div className="dadlyCtaBtn">Download Dadly — Free Trial</div>
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
