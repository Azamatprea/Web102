import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

const MODE_KEY = 'campusconnect_theme_mode'
const ACCENT_KEY = 'campusconnect_theme_accent'

export const ACCENTS = {
  pink: { label: 'Pink', value: '#ff4d8d' },
  blue: { label: 'Blue', value: '#1e88e5' },
  purple: { label: 'Purple', value: '#a855f7' },
  green: { label: 'Green', value: '#10d999' },
  orange: { label: 'Orange', value: '#f59e0b' },
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem(MODE_KEY) || 'dark')
  const [accent, setAccent] = useState(() => localStorage.getItem(ACCENT_KEY) || 'pink')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
    document.documentElement.style.setProperty('--accent', ACCENTS[accent].value)
    localStorage.setItem(MODE_KEY, mode)
    localStorage.setItem(ACCENT_KEY, accent)
  }, [mode, accent])

  const toggleMode = () => setMode(m => (m === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
