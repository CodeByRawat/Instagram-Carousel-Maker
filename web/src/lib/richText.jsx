function pushText(out, text, keyBase) {
  if (!text) return
  out.push({ type: 'text', text, key: `${keyBase}-t-${out.length}` })
}

export function tokenizeRichText(input) {
  const s = String(input || '')
  const out = []
  let i = 0

  while (i < s.length) {
    const boldStart = s.indexOf('**', i)
    const emStart = s.indexOf('*', i)

    const next =
      boldStart === -1 && emStart === -1
        ? -1
        : boldStart !== -1 && (emStart === -1 || boldStart < emStart)
          ? boldStart
          : emStart

    if (next === -1) {
      pushText(out, s.slice(i), 'end')
      break
    }

    pushText(out, s.slice(i, next), 'pre')

    if (next === boldStart) {
      const close = s.indexOf('**', next + 2)
      if (close === -1) {
        pushText(out, s.slice(next), 'unclosed-bold')
        break
      }
      out.push({
        type: 'bold',
        text: s.slice(next + 2, close),
        key: `b-${out.length}`,
      })
      i = close + 2
      continue
    }

    const close = s.indexOf('*', next + 1)
    if (close === -1) {
      pushText(out, s.slice(next), 'unclosed-em')
      break
    }
    out.push({
      type: 'em',
      text: s.slice(next + 1, close),
      key: `e-${out.length}`,
    })
    i = close + 1
  }

  return out
}

export function renderRichText(tokens) {
  return tokens.map((t) => {
    if (t.type === 'bold') return <strong key={t.key}>{t.text}</strong>
    if (t.type === 'em') return <em key={t.key}>{t.text}</em>
    return <span key={t.key}>{t.text}</span>
  })
}

export function highlightFirst(text, word) {
  const s = String(text || '')
  const w = String(word || '').trim()
  if (!w) return { before: s, match: '', after: '' }

  const idx = s.toLowerCase().indexOf(w.toLowerCase())
  if (idx === -1) return { before: s, match: '', after: '' }
  return {
    before: s.slice(0, idx),
    match: s.slice(idx, idx + w.length),
    after: s.slice(idx + w.length),
  }
}

