import { LinkedInCoverSlide } from './slides/linkedin/LinkedInCoverSlide.jsx'
import { LinkedInContentSlide } from './slides/linkedin/LinkedInContentSlide.jsx'
import { LinkedInCtaSlide } from './slides/linkedin/LinkedInCtaSlide.jsx'
import { LinkedInNewsCoverSlide } from './slides/linkedin/LinkedInNewsCoverSlide.jsx'
import { LinkedInNewsStorySlide } from './slides/linkedin/LinkedInNewsStorySlide.jsx'

export function LinkedInSlide({ slide, index, total, slideRef }) {
  const type = slide?.type
  const common = { slide, index, total }

  return (
    <div ref={slideRef} style={{ width: 1200, height: 1500, position: 'relative' }}>
      {type === 'hook'        ? <LinkedInCoverSlide      {...common} /> : null}
      {type === 'lesson'      ? <LinkedInContentSlide    {...common} /> : null}
      {type === 'cta'         ? <LinkedInCtaSlide        {...common} /> : null}
      {type === 'news-cover'  ? <LinkedInNewsCoverSlide  {...common} /> : null}
      {type === 'news-story'  ? <LinkedInNewsStorySlide  {...common} /> : null}
      {!type ? (
        <div style={{ width: '100%', height: '100%', background: '#1B1B1B', color: '#EAF0FB', padding: 60, fontFamily: 'Inter, sans-serif' }}>
          Missing slide type
        </div>
      ) : null}
    </div>
  )
}
