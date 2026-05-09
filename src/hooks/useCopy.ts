import { useEffect } from 'react'
import { useLangStore } from '../store/useLangStore'
import { en } from '../content/landing/parent.en'
import { fr } from '../content/landing/parent.fr'

export function useCopy() {
  const { lang } = useLangStore()

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return lang === 'fr' ? fr : en
}
