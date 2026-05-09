import React from 'react'

interface TimerRingProps {
  timeLeft: number
  total: number
  size?: number
  strokeWidth?: number
  urgency?: 'normal' | 'warning' | 'critical'
  className?: string
}

export const TimerRing: React.FC<TimerRingProps> = ({
  timeLeft, total, size = 64, strokeWidth = 5, urgency = 'normal', className = ''
}) => {
  const r = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * r
  const pct = total > 0 ? timeLeft / total : 0
  const offset = circumference * (1 - pct)
  const color = urgency === 'critical' ? '#EF4444' : urgency === 'warning' ? '#F59E0B' : '#10B981'
  const m = Math.floor(timeLeft / 60); const s = timeLeft % 60
  const label = m > 0 ? `${m}:${s.toString().padStart(2,'0')}` : `${timeLeft}s`

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1E293B" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference}
          strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }} />
      </svg>
      <span className="absolute text-xs font-bold font-mono" style={{ color }}>{label}</span>
    </div>
  )
}
