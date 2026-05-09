import React from 'react'
import { GradientPlaceholder, type VisualEntity } from './GradientPlaceholder'
import { ResponsiveImage, type ResponsiveImageSources } from './ResponsiveImage'

export interface Decorative3DBackgroundProps {
  entity: VisualEntity
  variant: 'hero' | 'subtle' | 'minimal'
  className?: string
  /**
   * Optional real image sources. When provided, the image renders on top of the
   * gradient layer. When absent, the gradient fills the space (Phase 1 default).
   */
  imageSources?: ResponsiveImageSources
  imageAlt?: string
  imageSizes?: string
}

// Entity-specific SVG pattern overlays that add visual character in Phase 1
function FinanceGridOverlay() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      style={{ opacity: 0.12 }}
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 800 500"
    >
      {/* Horizontal grid lines */}
      {[50, 120, 190, 260, 330, 400, 470].map(y => (
        <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#3B82F6" strokeWidth="0.5" />
      ))}
      {/* Vertical grid lines */}
      {[80, 160, 240, 320, 400, 480, 560, 640, 720].map(x => (
        <line key={x} x1={x} y1="0" x2={x} y2="500" stroke="#3B82F6" strokeWidth="0.5" />
      ))}
      {/* Abstract yield curve sweep */}
      <path
        d="M0,380 C80,370 160,340 260,300 C360,260 440,230 540,200 C620,178 700,170 800,165"
        stroke="#3B82F6"
        strokeWidth="1.5"
        fill="none"
        opacity={0.6}
      />
      {/* Data point dots on the curve */}
      {[[260, 300], [360, 260], [460, 220], [560, 198], [660, 173]] .map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#60A5FA" opacity={0.7} />
      ))}
    </svg>
  )
}

function ToeicBokehhOverlay() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 800 500"
    >
      {/* Floating bokeh circles — soft educational atmosphere */}
      {[
        { cx: 120, cy: 80, r: 40, o: 0.06 },
        { cx: 680, cy: 120, r: 60, o: 0.05 },
        { cx: 380, cy: 60, r: 30, o: 0.08 },
        { cx: 750, cy: 380, r: 50, o: 0.05 },
        { cx: 60, cy: 350, r: 35, o: 0.07 },
        { cx: 500, cy: 430, r: 45, o: 0.04 },
      ].map(({ cx, cy, r, o }, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#2563EB" opacity={o} />
      ))}
      {/* Subtle floating card shapes */}
      {[
        { x: 60, y: 140, w: 90, h: 64, rx: 8, rot: -8, o: 0.06 },
        { x: 680, y: 200, w: 80, h: 56, rx: 8, rot: 6, o: 0.05 },
        { x: 360, y: 380, w: 100, h: 68, rx: 8, rot: -4, o: 0.04 },
      ].map(({ x, y, w, h, rx, rot, o }, i) => (
        <rect
          key={i}
          x={x} y={y} width={w} height={h} rx={rx}
          fill="none"
          stroke="#2563EB"
          strokeWidth="1"
          opacity={o}
          transform={`rotate(${rot}, ${x + w / 2}, ${y + h / 2})`}
        />
      ))}
    </svg>
  )
}

export function LexoraOrbitOverlay() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      style={{ opacity: 0.15 }}
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 800 500"
    >
      {/* Central orb suggestion */}
      <circle cx="400" cy="250" r="80" fill="none" stroke="#6366F1" strokeWidth="1" />
      <circle cx="400" cy="250" r="130" fill="none" stroke="#6366F1" strokeWidth="0.5" strokeDasharray="4 8" />
      {/* TOEIC orbit arc (left) */}
      <path
        d="M 290 170 A 140 140 0 0 0 270 330"
        fill="none" stroke="#6366F1" strokeWidth="1" opacity={0.6}
      />
      {/* Finance orbit arc (right) */}
      <path
        d="M 510 170 A 140 140 0 0 1 530 330"
        fill="none" stroke="#8B5CF6" strokeWidth="1" opacity={0.6}
      />
      {/* Orbit nodes */}
      <circle cx="290" cy="170" r="5" fill="#6366F1" opacity={0.8} />
      <circle cx="510" cy="170" r="5" fill="#3B82F6" opacity={0.8} />
    </svg>
  )
}

const PATTERN_OVERLAYS: Record<VisualEntity, React.FC | null> = {
  finance: FinanceGridOverlay,
  toeic: ToeicBokehhOverlay,
  lexora: LexoraOrbitOverlay,
}

export function Decorative3DBackground({
  entity,
  variant,
  className = '',
  imageSources,
  imageAlt = '',
  imageSizes,
}: Decorative3DBackgroundProps) {
  const PatternOverlay = variant === 'minimal' ? null : PATTERN_OVERLAYS[entity]

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Layer 1: gradient base */}
      <GradientPlaceholder entity={entity} />

      {/* Layer 2: entity pattern (hero + subtle only) */}
      {PatternOverlay && <PatternOverlay />}

      {/* Layer 3: real image (Phase 4+) — renders on top of gradient when sources provided */}
      {imageSources && (
        <div className="absolute inset-0">
          <ResponsiveImage
            sources={imageSources}
            alt={imageAlt}
            aria-hidden={true}
            sizes={imageSizes ?? '100vw'}
            fallbackEntity={entity}
            className="absolute inset-0 w-full h-full"
          />
        </div>
      )}
    </div>
  )
}
