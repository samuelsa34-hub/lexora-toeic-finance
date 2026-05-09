import React from 'react'

// ── The Lexora Arc Mark ───────────────────────────────────────────────────────
// An ascending "L" built from two strokes: a vertical stem (precision, structure)
// and a rising diagonal base (momentum, progression). The mark reads simultaneously
// as the letter L (Lexora) and as an upward trajectory — language as the path to
// elevation. Gradient: electric blue → sky cyan = intelligence + clarity + energy.

type LogoVariant = 'full' | 'compact' | 'icon' | 'wordmark-only'
type LogoMono = 'white' | 'dark' | 'blue' | null

interface LogoProps {
  variant?: LogoVariant
  /** Icon pixel size (height). Width scales automatically. Default: 32 */
  iconSize?: number
  /** Override gradient with a flat color. null = gradient (default) */
  mono?: LogoMono
  /** Show or hide TOEIC prefix above LEXORA in full/wordmark variants. Default: true */
  showPrefix?: boolean
  className?: string
  style?: React.CSSProperties
}

function LexoraMark({
  size = 32,
  mono = null,
  withBg = true,
  id = 'lx',
}: {
  size?: number
  mono?: LogoMono
  withBg?: boolean
  id?: string
}) {
  const gradId = `${id}-mk`
  const bgId   = `${id}-bg`

  const markColor = mono === 'white' ? '#FFFFFF'
                  : mono === 'dark'  ? '#1E293B'
                  : mono === 'blue'  ? '#3B82F6'
                  : `url(#${gradId})`

  const bgFill = !withBg ? undefined
               : mono === 'dark'  ? '#EFF6FF'
               : mono === 'white' ? '#0F1B2D'
               : mono === 'blue'  ? '#1D2B4F'
               : undefined

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      style={{ flexShrink: 0, display: 'block' }}
    >
      <defs>
        {!mono && (
          <>
            <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#0D1829"/>
              <stop offset="100%" stopColor="#080E1E"/>
            </linearGradient>
            {/* Gradient follows the ascending direction of the mark (bottom-left → top-right) */}
            <linearGradient id={gradId} x1="15%" y1="85%" x2="85%" y2="15%">
              <stop offset="0%"   stopColor="#5B8BF5"/>
              <stop offset="52%"  stopColor="#38BDF8"/>
              <stop offset="100%" stopColor="#7DD3FC"/>
            </linearGradient>
          </>
        )}
      </defs>

      {/* Background tile */}
      {withBg && (
        <rect
          width="48"
          height="48"
          rx="11"
          fill={bgFill ?? (mono ? undefined : `url(#${bgId})`)}
        />
      )}
      {withBg && !mono && (
        <rect
          width="48"
          height="48"
          rx="11"
          fill="none"
          stroke="rgba(91,139,245,0.14)"
          strokeWidth="1"
        />
      )}

      {/* The Lexora Arc — ascending L */}
      {/* Stem: (16, 9) → (16, 35)  |  Rising base: (16, 35) → (38, 23) */}
      <path
        d="M 16 9 L 16 35 L 38 23"
        fill="none"
        stroke={markColor}
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ── Logo component ─────────────────────────────────────────────────────────────
export function Logo({
  variant = 'full',
  iconSize = 32,
  mono = null,
  showPrefix = true,
  className,
  style,
}: LogoProps) {
  const textPrimary   = mono === 'dark' ? '#0F172A' : '#FFFFFF'
  const textSecondary = mono === 'dark'
    ? 'rgba(15,23,42,0.45)'
    : 'rgba(125,211,252,0.45)'

  const gradientStyle: React.CSSProperties = mono
    ? { color: textPrimary }
    : {
        background: 'linear-gradient(135deg, #5B8BF5 0%, #38BDF8 52%, #7DD3FC 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }

  if (variant === 'icon') {
    return (
      <span className={className} style={style}>
        <LexoraMark size={iconSize} mono={mono} withBg id="lx-icon" />
      </span>
    )
  }

  if (variant === 'wordmark-only') {
    return (
      <span className={className} style={{ display: 'inline-flex', flexDirection: 'column', ...style }}>
        {showPrefix && (
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: textSecondary, lineHeight: 1, marginBottom: 2 }}>
            TOEIC
          </span>
        )}
        <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.10em', lineHeight: 1, ...gradientStyle }}>
          LEXORA
        </span>
      </span>
    )
  }

  if (variant === 'compact') {
    return (
      <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, ...style }}>
        <LexoraMark size={iconSize} mono={mono} withBg id="lx-compact" />
        <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.10em', lineHeight: 1, ...gradientStyle }}>
          LEXORA
        </span>
      </span>
    )
  }

  // full — default
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, ...style }}>
      <LexoraMark size={iconSize} mono={mono} withBg id="lx-full" />
      <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {showPrefix && (
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: textSecondary, lineHeight: 1 }}>
            TOEIC
          </span>
        )}
        <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.10em', lineHeight: 1, ...gradientStyle }}>
          LEXORA
        </span>
      </span>
    </span>
  )
}

// ── Large display version (login, splash, marketing) ──────────────────────────
export function LogoHero({
  mono = null,
  animate = true,
}: {
  mono?: LogoMono
  animate?: boolean
}) {
  const gradientStyle: React.CSSProperties = mono
    ? { color: '#FFFFFF' }
    : {
        background: 'linear-gradient(135deg, #5B8BF5 0%, #38BDF8 50%, #7DD3FC 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      {/* Large icon with glow */}
      <div style={{
        position: 'relative',
        animation: animate ? 'logoGlow 4s ease-in-out infinite' : undefined,
        borderRadius: 22,
        boxShadow: '0 0 22px rgba(56,189,248,0.50), 0 0 44px rgba(91,139,245,0.20)',
      }}>
        <LexoraMark size={72} mono={mono} withBg id="lx-hero" />
      </div>

      {/* Wordmark */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.20em', textTransform: 'uppercase', color: 'rgba(125,211,252,0.45)' }}>
          TOEIC
        </span>
        <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: '0.12em', lineHeight: 1, ...gradientStyle }}>
          LEXORA
        </span>
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.10em', color: 'rgba(125,211,252,0.30)', marginTop: 2 }}>
          940 SCORE SPRINT
        </span>
      </div>
    </div>
  )
}

export default Logo
