import { Footer } from './Footer.jsx'
import { highlightFirst, renderRichText, tokenizeRichText } from '../../lib/richText.jsx'

export function LessonSlide({ slide, index, total }) {
  const { before, match, after } = highlightFirst(slide?.quote || '', slide?.highlightWord || '')
  const applicationTokens = tokenizeRichText(slide?.applicationBody || '')

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="topRule" />
      <div className="ghostNumber">{slide?.ghostNumber || String(index + 1).padStart(2, '0')}</div>

      <div style={{ flex: 1, padding: '40px 64px 60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div className="label">{slide?.lessonLabel || 'Lesson'}</div>

        <div className="sanskrit">{slide?.sanskrit || ''}</div>

        <div className="quoteMark" aria-hidden="true">
          "
        </div>

        <div style={{ marginTop: 44, maxWidth: 900, position: 'relative' }}>
          <div className="quote">
            {before}
            {match ? <em>{match}</em> : null}
            {after}
          </div>
          <div className="ref">{slide?.reference || '— Bhagavad Gita · Paraphrase'}</div>
        </div>

        <div className="divider" />

        <div className="label">{slide?.applicationLabel || 'Why it matters'}</div>
        <div className="application" style={{ marginTop: 18, maxWidth: 900 }}>
          {renderRichText(applicationTokens)}
        </div>
      </div>

      <Footer index={index} total={total} />
    </div>
  )
}

