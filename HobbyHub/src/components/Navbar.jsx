import { Link, useLocation } from 'react-router-dom'
import { Rocket, Plus, MessageSquare, Home } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Rocket size={28} color="#FF4081" />
        CampusConnect
      </Link>
      
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <Home size={18} /> Home
        </Link>
        <Link to="/chat" className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}>
          <MessageSquare size={18} /> Chat
        </Link>
        <Link to="/create" className="btn btn-primary">
          <Plus size={18} /> New Post
        </Link>
      </div>
    </nav>
  )
}
