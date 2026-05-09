import { create } from 'zustand'

type Theme = 'dark' | 'light'

interface ThemeStore {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

function applyTheme(theme: Theme) {
  const html = document.documentElement
  if (theme === 'light') {
    html.classList.remove('dark')
    html.setAttribute('data-theme', 'light')
  } else {
    html.classList.add('dark')
    html.removeAttribute('data-theme')
  }
  localStorage.setItem('dp-theme', theme)
}

const stored = localStorage.getItem('dp-theme') as Theme | null
applyTheme(stored ?? 'dark')

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: stored ?? 'dark',
  toggleTheme: () =>
    set(s => {
      const next: Theme = s.theme === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      return { theme: next }
    }),
  setTheme: (theme) => {
    applyTheme(theme)
    set({ theme })
  },
}))
