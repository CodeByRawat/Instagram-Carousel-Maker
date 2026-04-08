import mainApp from '../../assets/main app.webp'
import topics from '../../assets/topics.webp'
import downloadApp from '../../assets/download the app .jpeg'

const screenMap = {
  app1: mainApp,
  app2: topics,
  app3: mainApp,
  app4: topics,
  app5: mainApp,
  app6: downloadApp,
}

export function Phone({ label = 'app1', width = 180, height = 320 }) {
  const screen = screenMap[label] || mainApp

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 28,
        border: '3px solid var(--black)',
        background: 'var(--black)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 24px 48px rgba(17,17,17,0.25)',
        position: 'relative',
      }}
    >
      {/* Notch */}
      <div
        style={{
          width: 60,
          height: 14,
          background: 'var(--black)',
          borderRadius: '0 0 10px 10px',
          margin: '0 auto',
          zIndex: 2,
          flexShrink: 0,
        }}
      />

      {/* Screen */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <img
          src={screen}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* Home bar */}
      <div
        style={{
          height: 18,
          background: 'var(--black)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 48,
            height: 4,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.3)',
          }}
        />
      </div>
    </div>
  )
}
