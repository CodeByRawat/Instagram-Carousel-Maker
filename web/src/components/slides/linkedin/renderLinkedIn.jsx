export function renderLinkedInText(text) {
  return (text || '').split('\n').map((line, i) => {
    if (line.startsWith('===') && line.endsWith('===')) {
      const content = line.slice(3, -3)
      return (
        <div key={i} style={{
          background: '#CCFF00',
          color: '#1B1B1B',
          fontWeight: 700,
          display: 'inline-block',
          padding: '2px 12px 2px 0',
          marginTop: 6,
          lineHeight: 1.1,
        }}>
          {content}
        </div>
      )
    }

    if (line.includes('[pill]')) {
      const pills = [...line.matchAll(/\[pill\](.*?)\[\/pill\]/g)].map((m) => m[1])
      if (pills.length > 0) {
        return (
          <div key={i} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', margin: '12px 0' }}>
            {pills.map((p, j) => (
              <span key={j} style={{
                background: '#CCFF00',
                color: '#1B1B1B',
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: -0.3,
                padding: '8px 22px',
                borderRadius: 6,
              }}>
                {p}
              </span>
            ))}
          </div>
        )
      }
    }

    // inline ===...=== within a regular line (e.g. CTA subtitle)
    if (line.includes('===')) {
      const parts = line.split(/(===[^=]+===)/)
      return (
        <div key={i}>
          {parts.map((part, j) =>
            part.startsWith('===') && part.endsWith('===')
              ? (
                <span key={j} style={{
                  background: '#CCFF00',
                  color: '#1B1B1B',
                  fontWeight: 700,
                  padding: '1px 8px 1px 0',
                }}>
                  {part.slice(3, -3)}
                </span>
              )
              : part
          )}
        </div>
      )
    }

    const segments = line.split(/(\*\*[^*]+\*\*)/).map((seg, j) =>
      seg.startsWith('**') && seg.endsWith('**')
        ? <strong key={j}>{seg.slice(2, -2)}</strong>
        : seg
    )
    return <div key={i}>{segments}</div>
  })
}
