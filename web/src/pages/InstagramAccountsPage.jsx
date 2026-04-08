import './InstagramAccountsPage.css'
import sofiaAvatar from '../assets/profile picture.png'
import dadlyAvatar from '../assets/pagefordas logo.png'

const ACCOUNTS = [
  {
    id: 'sofia',
    name: 'your_divine.sofia',
    label: 'Sofia',
    handle: '@your_divine.sofia',
    desc: 'Wisdom & Spirituality',
    avatar: sofiaAvatar,
  },
  {
    id: 'dadly',
    name: 'dadly',
    label: 'Dadly App',
    handle: '@dadly',
    desc: 'Fatherhood & Parenting',
    avatar: dadlyAvatar,
  },
  {
    id: 'datawithsachin',
    name: 'datawithsachin',
    label: 'DataWithSachin',
    handle: '@datawithsachin',
    desc: 'Data & Analytics',
    avatar: null,
  },
]

export function InstagramAccountsPage({ onSelectAccount, onBack }) {
  return (
    <div className="accountsPage">
      <button className="backBtn" onClick={onBack}>
        ← Back
      </button>

      <div className="accountsHero">
        <div className="accountsBadge">Instagram</div>
        <h2 className="accountsTitle">Choose an account</h2>
        <p className="accountsSubtitle">Select the page you want to create a carousel for.</p>
      </div>

      <div className="accountCards">
        {ACCOUNTS.map((account) => (
          <button
            key={account.id}
            className="accountCard"
            onClick={() => onSelectAccount(account)}
          >
            <div className="accountAvatar">
              {account.avatar && (
                <img src={account.avatar} alt={account.label} className="accountAvatarImg" />
              )}
            </div>
            <div className="accountInfo">
              <div className="accountLabel">{account.label}</div>
              <div className="accountHandle">{account.handle}</div>
              <div className="accountDesc">{account.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
