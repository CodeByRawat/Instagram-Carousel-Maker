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

// page: 'landing' | 'instagram-accounts' | 'main'
function App() {
  const [page, setPage] = useState('landing')
  const [platform, setPlatform] = useState('instagram')
  const [account, setAccount] = useState(null)
  const [theme, setTheme] = useState('stress at work')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [carousel, setCarousel] = useState(defaultCarousel)

  const exportRefs = useRef([])

  const canExport = useMemo(() => {
    return Array.isArray(carousel?.slides) && carousel.slides.length === 6
  }, [carousel])

  function handleSelectPlatform(p) {
    setPlatform(p)
    if (p === 'instagram') {
      setPage('instagram-accounts')
    } else {
      setAccount(null)
      setPage('main')
    }
  }

  function handleSelectAccount(acc) {
    setAccount(acc)
    if (acc.id === 'dadly') setCarousel(defaultDadlyCarousel)
    else setCarousel(defaultCarousel)
    setPage('main')
  }

  async function onGenerate() {
    setError('')
    setIsGenerating(true)
    try {
      const endpoint = platform === 'linkedin'
        ? '/api/generate-linkedin'
        : account?.id === 'dadly'
        ? '/api/generate-dadly'
        : '/api/generate'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ theme, language: 'en' }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || 'Failed to generate carousel.')
      }
      const data = await res.json()
      // Always keep the last (CTA) slide fixed per account
      const fixedCta = account?.id === 'dadly'
        ? defaultDadlyCarousel.slides[defaultDadlyCarousel.slides.length - 1]
        : defaultCarousel.slides[defaultCarousel.slides.length - 1]
      data.slides[data.slides.length - 1] = fixedCta
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
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed.')
    }
  }

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
          <label className="field">
            <span>Theme</span>
            <input
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g. anxiety, failure, relationships"
            />
          </label>
          <button className="btn" onClick={onGenerate} disabled={isGenerating}>
            {isGenerating ? 'Generating…' : 'Generate'}
          </button>
          <button className="btn secondary" onClick={onExport} disabled={!canExport}>
            Download PNG ZIP
          </button>
        </div>
      </header>

      {error ? <div className="error">{error}</div> : null}

      <main className="main">
        <section className="panel">
          <div className="panelTitle">Preview</div>
          <CarouselPreview
            carousel={carousel}
            SlideComponent={account?.id === 'dadly' ? DadlySlide : undefined}
          />
        </section>
      </main>

      <div className="exportStage" aria-hidden="true">
        <CarouselCanvas
          carousel={carousel}
          scale={1}
          SlideComponent={account?.id === 'dadly' ? DadlySlide : undefined}
          slideRefSetter={(idx, node) => {
            exportRefs.current[idx] = node
          }}
        />
      </div>
    </div>
  )
}

export default App
