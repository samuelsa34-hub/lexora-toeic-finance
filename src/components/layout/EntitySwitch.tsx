import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home } from 'lucide-react'

type ActiveEntity = 'global' | 'toeic' | 'finance'

function getActiveEntity(pathname: string): ActiveEntity {
  if (pathname === '/') return 'global'
  if (pathname.startsWith('/finance')) return 'finance'
  return 'toeic'
}

// ── LEXORA Home button ────────────────────────────────────────────────────────

function HomeTab({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="LEXORA Home"
      className="flex flex-col items-center gap-0.5 py-2 px-2 transition-all duration-150"
      style={{
        borderBottom: isActive ? '2px solid rgba(255,255,255,0.40)' : '2px solid transparent',
        background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
      }}
    >
      <Home
        className="w-3.5 h-3.5"
        style={{ color: isActive ? 'rgba(255,255,255,0.90)' : 'rgba(148,163,184,0.50)' }}
      />
      <span
        className="text-[9px] font-bold uppercase tracking-wider leading-none"
        style={{ color: isActive ? 'rgba(255,255,255,0.80)' : 'rgba(148,163,184,0.40)' }}
      >
        Home
      </span>
    </button>
  )
}

// ── Portal tab ────────────────────────────────────────────────────────────────

function PortalTab({
  label,
  sublabel,
  emoji,
  isActive,
  onClick,
  accentColor,
}: {
  label: string
  sublabel: string
  emoji: string
  isActive: boolean
  onClick: () => void
  accentColor: string
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center gap-0.5 py-2 px-1 transition-all duration-150"
      style={
        isActive
          ? { background: `${accentColor}18`, borderBottom: `2px solid ${accentColor}` }
          : { borderBottom: '2px solid transparent' }
      }
    >
      <span className="text-base leading-none">{emoji}</span>
      <span
        className="text-[10px] font-bold uppercase tracking-wider leading-none"
        style={{ color: isActive ? accentColor : 'rgba(148,163,184,0.7)' }}
      >
        {label}
      </span>
      <span
        className="text-[9px] leading-none"
        style={{ color: isActive ? 'rgba(148,163,184,0.8)' : 'rgba(148,163,184,0.4)' }}
      >
        {sublabel}
      </span>
    </button>
  )
}

// ── EntitySwitch ──────────────────────────────────────────────────────────────

export function EntitySwitch() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const active = getActiveEntity(pathname)

  return (
    <div
      className="mx-3 mb-3 rounded-xl overflow-hidden flex"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <HomeTab isActive={active === 'global'} onClick={() => navigate('/')} />

      {/* Vertical divider */}
      <div style={{ width: 1, background: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />

      <PortalTab
        label="TOEIC"
        sublabel="English"
        emoji="📚"
        isActive={active === 'toeic'}
        onClick={() => navigate('/toeic')}
        accentColor="#6366F1"
      />
      <PortalTab
        label="Finance"
        sublabel="Markets"
        emoji="📈"
        isActive={active === 'finance'}
        onClick={() => navigate('/finance')}
        accentColor="#3B82F6"
      />
    </div>
  )
}
