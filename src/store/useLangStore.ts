import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Lang = 'en' | 'fr'

interface LangStore {
  lang: Lang
  toggle: () => void
  setLang: (lang: Lang) => void
}

export const useLangStore = create<LangStore>()(
  persist(
    (set) => ({
      lang: 'en',
      toggle: () => set((s) => ({ lang: s.lang === 'en' ? 'fr' : 'en' })),
      setLang: (lang) => set({ lang }),
    }),
    { name: 'lexora_lang' }
  )
)
