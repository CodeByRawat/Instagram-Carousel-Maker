import { Footer } from './Footer.jsx'
import { renderRichText, tokenizeRichText } from '../../lib/richText.jsx'

export function HookSlide({ slide, index, total }) {
  const headlineTokens = tokenizeRichText(slide?.headline || '')

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className="topRule" />
      <div className="roleTag">{slide?.roleTag || 'AI Automation & Newsletter Strategist'}</div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '86px 54px 140px',
          height: '100%',
        }}
      >
        <div className="headline">{renderRichText(headlineTokens)}</div>
        <div className="subtext">{slide?.subtext || ''}</div>
      </div>

      <Footer index={index} total={total} />
    </div>
  )
}
