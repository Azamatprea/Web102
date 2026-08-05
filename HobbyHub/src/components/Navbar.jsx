import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Rocket, Plus, MessageSquare, Home, User, Sun, Moon, Palette, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme, ACCENTS } from '../context/ThemeContext'

export default function Navbar() {
  const location = useLocation()
  const { username, setUsername } = useAuth()
  const { mode, toggleMode, accent, setAccent } = useTheme()

  const [profileOpen, setProfileOpen] = useState(false)
  const [nameDraft, setNameDraft] = useState(username)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const profileRef = useRef(null)
  const settingsRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setSettingsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const saveName = (e) => {
    e.preventDefault()
    setUsername(nameDraft)
    setProfileOpen(false)
  }

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Rocket size={28} className="brand-icon" />
        CampusConnect
      </Link>

      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <Home size={18} /> Home
        </Link>
        <Link to="/chat" className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}>
          <MessageSquare size={18} /> Chat
        </Link>

        <div className="nav-popover-anchor" ref={settingsRef}>
          <button
            type="button"
            className="icon-btn"
            title="Customize interface"
            onClick={() => setSettingsOpen(o => !o)}
          >
            <Palette size={18} />
          </button>
          {settingsOpen && (
            <div className="nav-popover">
              <div className="nav-popover-title">Appearance</div>
              <button type="button" className="theme-toggle-row" onClick={toggleMode}>
                {mode === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                {mode === 'dark' ? 'Dark mode' : 'Light mode'}
              </button>
              <div className="nav-popover-title" style={{ marginTop: 12 }}>Accent color</div>
              <div className="accent-swatch-row">
                {Object.entries(ACCENTS).map(([key, { label, value }]) => (
                  <button
                    key={key}
                    type="button"
                    className="accent-swatch"
                    style={{ background: value }}
                    title={label}
                    onClick={() => setAccent(key)}
                  >
                    {accent === key && <Check size={14} color="#fff" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="nav-popover-anchor" ref={profileRef}>
          <button
            type="button"
            className="icon-btn profile-btn"
            title="Your profile"
            onClick={() => { setNameDraft(username); setProfileOpen(o => !o) }}
          >
            <User size={18} />
            <span className="profile-name">{username}</span>
          </button>
          {profileOpen && (
            <div className="nav-popover">
              <div className="nav-popover-title">Display name</div>
              <form onSubmit={saveName} style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  className="form-control"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  maxLength={24}
                  autoFocus
                />
                <button type="submit" className="btn btn-primary">Save</button>
              </form>
              <p className="nav-popover-hint">No password needed — this name is saved on this device and used to tag your posts, comments, and chat messages.</p>
            </div>
          )}
        </div>

        <Link to="/create" className="btn btn-primary">
          <Plus size={18} /> New Post
        </Link>
      </div>
    </nav>
  )
}
