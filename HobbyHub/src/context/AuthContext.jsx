import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'campusconnect_username'

function randomUsername() {
  return 'Student' + Math.floor(1000 + Math.random() * 9000)
}

export function AuthProvider({ children }) {
  const [username, setUsernameState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return stored
    const generated = randomUsername()
    localStorage.setItem(STORAGE_KEY, generated)
    return generated
  })

  const setUsername = (name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    localStorage.setItem(STORAGE_KEY, trimmed)
    setUsernameState(trimmed)
  }

  return (
    <AuthContext.Provider value={{ username, setUsername }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
