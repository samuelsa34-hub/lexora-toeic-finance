import React from 'react'
import { useLangStore, type Lang } from '../../store/useLangStore'

interface LangToggleProps {
  className?: string
}

export function LangToggle({ className = '' }: LangToggleProps) {
  const { lang, setLang } = useLangStore()

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-white/10 overflow-hidden text-[11px] font-semibold tracking-[0.08em] uppercase ${className}`}
      role="group"
      aria-label="Language selector"
    >
      {(['en', 'fr'] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className="px-3 py-1.5 transition-colors duration-150"
          style={{
            background: lang === l ? 'rgba(255,255,255,0.10)' : 'transparent',
            color: lang === l ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
