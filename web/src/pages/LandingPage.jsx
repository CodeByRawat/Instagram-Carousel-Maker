import instagramIcon from '../assets/instagram.png'
import linkedinIcon from '../assets/linkedin.png'
import './LandingPage.css'

export function LandingPage({ onSelectPlatform }) {
  return (
    <div className="landing">
      <div className="landingHero">
        <div className="landingBadge">✦ AI-Powered</div>
        <h1 className="landingTitle">Carousel Studio</h1>
        <p className="landingSubtitle">
          Create stunning, on-brand carousels for social media — powered by ancient wisdom.
        </p>
      </div>

      <div className="platformCards">
        <button className="platformCard instagram" onClick={() => onSelectPlatform('instagram')}>
          <img src={instagramIcon} alt="Instagram" className="platformCardIcon" />
          <div className="platformCardName">Instagram</div>
          <div className="platformCardDesc">Square 1:1 · 6 slides · Story-driven</div>
        </button>

        <button className="platformCard linkedin" onClick={() => onSelectPlatform('linkedin')}>
          <img src={linkedinIcon} alt="LinkedIn" className="platformCardIcon" />
          <div className="platformCardName">LinkedIn</div>
          <div className="platformCardDesc">Professional · 6 slides · Thought leadership</div>
        </button>
      </div>
    </div>
  )
}
