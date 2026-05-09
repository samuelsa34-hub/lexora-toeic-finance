import React from 'react'

interface ProgressRingProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  sublabel?: string
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value, max, size = 100, strokeWidth = 6, color = '#6366F1', label, sublabel
}) => {
  const r = (size - strokeWidth * 2) / 2
  const circ = 2 * Math.PI * r
  const pct = max > 0 ? Math.min(1, value / max) : 0
  const offset = circ * (1 - pct)

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />
          {/* Glow behind fill */}
          {pct > 0 && (
            <circle
              cx={size / 2} cy={size / 2} r={r}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth + 4}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ opacity: 0.12, filter: 'blur(4px)', transition: 'stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)' }}
            />
          )}
          {/* Fill */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        {label && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span className="font-bold leading-none" style={{ color, fontSize: size * 0.17 }}>{label}</span>
            {sublabel && <span className="text-slate-500 leading-none" style={{ fontSize: size * 0.1 }}>{sublabel}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
