import React from 'react'
import { useFirebaseConn } from '../../hooks/useFirebaseConn'
import type { FirebaseConnState } from '../../utils/cloudSync'

const CONFIG: Record<FirebaseConnState, { label: string; color: string; bg: string; border: string; dot: string; pulse: boolean }> = {
  connected:    { label: 'Live sync',      color: '#10B981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.28)', dot: '#10B981', pulse: true  },
  connecting:   { label: 'Connecting…',   color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.28)', dot: '#F59E0B', pulse: false },
  disconnected: { label: 'Reconnecting…', color: '#F87171', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.28)',  dot: '#EF4444', pulse: false },
  unconfigured: { label: 'Local only',    color: '#64748B', bg: 'rgba(100,116,139,0.10)',border: 'rgba(100,116,139,0.25)',dot: '#475569', pulse: false },
}

interface Props {
  /** compact = icon + minimal text; default = full badge */
  size?: 'compact' | 'default'
}

export const FirebaseStatusBadge: React.FC<Props> = ({ size = 'default' }) => {
  const state = useFirebaseConn()
  const c = CONFIG[state]

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: size === 'compact' ? 5 : 7,
      padding: size === 'compact' ? '3px 8px' : '5px 11px',
      borderRadius: 99,
      background: c.bg,
      border: `1px solid ${c.border}`,
      fontSize: size === 'compact' ? 10 : 11,
      fontWeight: 600,
      color: c.color,
      letterSpacing: '0.03em',
      userSelect: 'none',
    }}>
      {/* Status dot */}
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: c.dot, flexShrink: 0,
        boxShadow: c.pulse ? `0 0 0 0 ${c.dot}` : undefined,
        animation: c.pulse ? 'fbStatusPulse 2s ease-in-out infinite' : undefined,
      }} />
      {c.label}
      {state === 'unconfigured' && size !== 'compact' && (
        <span style={{ fontSize: 10, color: c.color, opacity: 0.7 }}>— add .env.local</span>
      )}

      {/* Keyframe animation inlined once */}
      <style>{`
        @keyframes fbStatusPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
          50%      { box-shadow: 0 0 0 4px rgba(16,185,129,0); }
        }
      `}</style>
    </div>
  )
}
