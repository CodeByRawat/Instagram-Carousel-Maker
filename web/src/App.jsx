import './App.css'
import { useMemo, useRef, useState } from 'react'
import { CarouselCanvas } from './components/CarouselCanvas.jsx'
import { CarouselPreview } from './components/CarouselPreview.jsx'
import { exportCarouselZip } from './lib/export.js'
import { defaultCarousel } from './lib/sample.js'
import instagramIcon from './assets/instagram.png'
import linkedinIcon from './assets/linkedin.png'
import { LandingPage } from './pages/LandingPage.jsx'
import { InstagramAccountsPage } from './pages/InstagramAccountsPage.jsx'
import { DadlySlide } from './components/DadlySlide.jsx'
import { defaultDadlyCarousel } from './lib/sample-dadly.js'
import { LinkedInSlide } from './components/LinkedInSlide.jsx'
import { defaultLinkedInCarousel } from './lib/sample-linkedin.js'

// linkedinMode: 'generate' | 'from-content' | 'study'
function App() {
  const [page, setPage] = useState('landing')
  const [platform, setPlatform] = useState('instagram')
  const [account, setAccount] = useState(null)
  const [theme, setTheme] = useState('stress at work')
  const [slideCount, setSlideCount] = useState(8)
  const [linkedinMode, setLinkedinMode] = useState('generate')
  const [content, setContent] = useState('')
  const [studyTopic, setStudyTopic] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [carousel, setCarousel] = useState(defaultCarousel)

  const isLinkedIn = platform === 'linkedin'
  const slideHeight = isLinkedIn ? 1080 : 1350
  const activeSlideComponent = isLinkedIn
    ? LinkedInSlide
    : account?.id === 'dadly'
    ? DadlySlide
    : undefined

  const exportRefs = useRef([])

  const canExport = useMemo(() => {
    return Array.isArray(carousel?.slides) && carousel.slides.length > 0
  }, [carousel])

  function handleSelectPlatform(p) {
    setPlatform(p)
    if (p === 'instagram') {
      setPage('instagram-accounts')
    } else {
      setAccount(null)
      setCarousel(defaultLinkedInCarousel)
      setPage('main')
    }
  }

  function handleSelectAccount(acc) {
    setAccount(acc)
    if (acc.id === 'dadly') setCarousel(defaultDadlyCarousel)
    else setCarousel(defaultCarousel)
    setPage('main')
  }

  function handleLinkedinModeChange(mode) {
    setLinkedinMode(mode)
    setError('')
  }

  async function onGenerate() {
    setError('')
    setIsGenerating(true)
    try {
      let endpoint, body

      if (isLinkedIn && linkedinMode === 'from-content') {
        if (!content.trim()) throw new Error('Paste some content first.')
        endpoint = '/api/generate-linkedin-from-content'
        body = { content, slideCount }
      } else if (isLinkedIn && linkedinMode === 'study') {
        if (!studyTopic.trim()) throw new Error('Enter a topic first.')
        endpoint = '/api/generate-linkedin-study'
        body = { topic: studyTopic, slideCount }
      } else {
        endpoint = isLinkedIn
          ? '/api/generate-linkedin'
          : account?.id === 'dadly'
          ? '/api/generate-dadly'
          : '/api/generate'
        body = { theme, language: 'en', slideCount: isLinkedIn ? slideCount : undefined }
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const b = await res.json().catch(() => ({}))
        throw new Error(b?.error || 'Failed to generate carousel.')
      }
      const data = await res.json()

      // Keep the last (CTA) slide fixed — only for non-LinkedIn modes
      if (!isLinkedIn) {
        const fixedCta = account?.id === 'dadly'
          ? defaultDadlyCarousel.slides[defaultDadlyCarousel.slides.length - 1]
          : defaultCarousel.slides[defaultCarousel.slides.length - 1]
        data.slides[data.slides.length - 1] = fixedCta
      }

      setCarousel(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setIsGenerating(false)
    }
  }

  async function onExport() {
    setError('')
    try {
      await exportCarouselZip({
        theme: carousel?.theme || theme,
        slideNodes: exportRefs.current.filter(Boolean),
        slideHeight,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed.')
    }
  }

  const generateLabel = isLinkedIn && linkedinMode === 'from-content'
    ? 'Convert to slides'
    : 'Generate'

  if (page === 'landing') {
    return <LandingPage onSelectPlatform={handleSelectPlatform} />
  }

  if (page === 'instagram-accounts') {
    return (
      <InstagramAccountsPage
        onSelectAccount={handleSelectAccount}
        onBack={() => setPage('landing')}
      />
    )
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbarLeft">
          <button className="backBtn topbarBack" onClick={() => setPage(platform === 'instagram' ? 'instagram-accounts' : 'landing')}>
            ← Back
          </button>
          <div>
            <div className="brand">Carousel Studio</div>
            <div className="subtitle">
              <img
                src={platform === 'instagram' ? instagramIcon : linkedinIcon}
                alt={platform}
                className="topbarPlatformIcon"
              />
              {platform === 'instagram' && account
                ? account.handle
                : platform === 'linkedin'
                ? 'LinkedIn'
                : ''}
            </div>
          </div>
        </div>

        <div className="controls">
          {/* Mode-specific primary input */}
          {(!isLinkedIn || linkedinMode === 'generate') && (
            <label className="field">
              <span>Theme</span>
              <input
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g. anxiety, failure, relationships"
              />
            </label>
          )}
          {isLinkedIn && linkedinMode === 'study' && (
            <label className="field">
              <span>Topic</span>
              <input
                value={studyTopic}
                onChange={(e) => setStudyTopic(e.target.value)}
                placeholder="e.g. RAG, prompt caching, MCP, tool use"
              />
            </label>
          )}

          {/* Slide count — LinkedIn only */}
          {isLinkedIn && (
            <label className="field">
              <span>Slides</span>
              <select value={slideCount} onChange={(e) => setSlideCount(Number(e.target.value))}>
                {[5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>{n} slides</option>
                ))}
              </select>
            </label>
          )}

          <button className="btn" onClick={onGenerate} disabled={isGenerating}>
            {isGenerating ? 'Generating…' : generateLabel}
          </button>
          <button className="btn secondary" onClick={onExport} disabled={!canExport}>
            Download PNG ZIP
          </button>
        </div>
      </header>

      {/* LinkedIn mode selector */}
      {isLinkedIn && (
        <div className="liModeTabs">
          <button
            className={`liModeTab ${linkedinMode === 'generate' ? 'active' : ''}`}
            onClick={() => handleLinkedinModeChange('generate')}
          >
            <span className="liModeIcon">✦</span>
            Generate
          </button>
          <button
            className={`liModeTab ${linkedinMode === 'from-content' ? 'active' : ''}`}
            onClick={() => handleLinkedinModeChange('from-content')}
          >
            <span className="liModeIcon">↓</span>
            From content
          </button>
          <button
            className={`liModeTab ${linkedinMode === 'study' ? 'active' : ''}`}
            onClick={() => handleLinkedinModeChange('study')}
          >
            <span className="liModeIcon">∿</span>
            Study AI
          </button>
        </div>
      )}

      {/* From-content: paste area */}
      {isLinkedIn && linkedinMode === 'from-content' && (
        <div className="liContentPanel">
          <div className="liContentPanelLabel">
            Paste your content
            <span className="liContentPanelHint">
              Blog post · article · tweet · rough notes · anything
            </span>
          </div>
          <textarea
            className="liContentTextarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste a blog post, article, tweet, or rough notes here. The AI will extract the key ideas and rewrite them as carousel slides in your voice."
            rows={8}
          />
          {content.trim().length > 0 && (
            <div className="liContentCount">{content.trim().length} characters</div>
          )}
        </div>
      )}

      {/* Study AI: topic context */}
      {isLinkedIn && linkedinMode === 'study' && (
        <div className="liStudyHint">
          <strong>What works well:</strong>
          {' '}RAG · embeddings · prompt caching · tool use · MCP · vector DBs · fine-tuning · agents · context windows · function calling
        </div>
      )}

      {error ? <div className="error">{error}</div> : null}

      <main className="main">
        <section className="panel">
          <div className="panelTitle">Preview</div>
          <CarouselPreview
            carousel={carousel}
            SlideComponent={activeSlideComponent}
            slideHeight={slideHeight}
          />
        </section>
      </main>

      <div className="exportStage" aria-hidden="true">
        <CarouselCanvas
          carousel={carousel}
          scale={1}
          SlideComponent={activeSlideComponent}
          slideRefSetter={(idx, node) => {
            exportRefs.current[idx] = node
          }}
        />
      </div>
    </div>
  )
}

export default App
