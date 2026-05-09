import React from 'react'

export type VisualEntity = 'lexora' | 'toeic' | 'finance'

interface GradientPlaceholderProps {
  entity: VisualEntity
  className?: string
  'aria-hidden'?: boolean
}

// Entity-specific CSS gradient configs — mirror the design token values exactly
const ENTITY_CONFIG: Record<VisualEntity, {
  bg: string
  glow1: string
  glow2: string
  patternColor: string
}> = {
  lexora: {
    bg: 'radial-gradient(ellipse 130% 90% at 60% 35%, rgba(99,102,241,0.22) 0%, rgba(139,92,246,0.10) 30%, rgba(9,9,11,0.96) 65%)',
    glow1: 'rgba(99,102,241,0.18)',
    glow2: 'rgba(139,92,246,0.08)',
    patternColor: 'rgba(99,102,241,0.06)',
  },
  toeic: {
    bg: 'radial-gradient(ellipse 130% 90% at 35% 30%, rgba(37,99,235,0.24) 0%, rgba(245,158,11,0.06) 40%, rgba(15,23,42,0.93) 70%)',
    glow1: 'rgba(37,99,235,0.16)',
    glow2: 'rgba(245,158,11,0.06)',
    patternColor: 'rgba(37,99,235,0.07)',
  },
  finance: {
    bg: 'radial-gradient(ellipse 130% 90% at 65% 35%, rgba(59,130,246,0.22) 0%, rgba(250,204,21,0.04) 38%, rgba(9,9,11,0.97) 68%)',
    glow1: 'rgba(59,130,246,0.16)',
    glow2: 'rgba(250,204,21,0.03)',
    patternColor: 'rgba(59,130,246,0.08)',
  },
}

// Dot-grid SVG pattern — entity-colored dots, 24px grid spacing
function DotGrid({ color }: { color: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      style={{ opacity: 0.6 }}
    >
      <defs>
        <pattern id="dot-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-grid)" />
    </svg>
  )
}

export function GradientPlaceholder({
  entity,
  className = '',
  'aria-hidden': ariaHidden = true,
}: GradientPlaceholderProps) {
  const cfg = ENTITY_CONFIG[entity]

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden={ariaHidden}
      style={{ background: cfg.bg }}
    >
      {/* Dot grid pattern */}
      <DotGrid color={cfg.patternColor} />

      {/* Primary glow orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '70%',
          paddingBottom: '70%',
          borderRadius: '50%',
          top: '-20%',
          right: '-10%',
          background: `radial-gradient(circle, ${cfg.glow1} 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* Secondary glow orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '50%',
          paddingBottom: '50%',
          borderRadius: '50%',
          bottom: '-15%',
          left: '5%',
          background: `radial-gradient(circle, ${cfg.glow2} 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />
    </div>
  )
}
