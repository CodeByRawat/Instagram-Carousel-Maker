import profilePic from '../../assets/profile picture.png'

export function Footer({ index, total, handle = 'your_divine.sofia' }) {
  return (
    <div className="footer">
      <div className="footerLeft">
        <div className="avatar" aria-hidden="true">
          <img src={profilePic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
        </div>
        <div className="handle">{handle}</div>
      </div>
      <div className="dots" aria-label={`Slide ${index + 1} of ${total}`}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`dot ${i === index ? 'active' : ''}`} />
        ))}
      </div>
    </div>
  )
}

