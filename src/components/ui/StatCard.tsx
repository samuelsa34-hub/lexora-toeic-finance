import React from 'react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: React.ReactNode
  color?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, sub, icon, color = '#6366F1', trend, trendValue }) => (
  <div
    className="card p-4 transition-all duration-200 hover:-translate-y-0.5"
    style={{ '--accent': color } as React.CSSProperties}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-stone-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 truncate">{label}</p>
        <p className="text-2xl font-bold leading-none" style={{ color }}>{value}</p>
        {sub && <p className="text-xs text-stone-400 dark:text-slate-500 mt-1.5">{sub}</p>}
      </div>
      {icon && (
        <div
          className="p-2.5 rounded-xl flex-shrink-0"
          style={{
            background: `${color}12`,
            border: `1px solid ${color}22`,
            color,
          }}
        >
          {icon}
        </div>
      )}
    </div>
    {trend && trendValue && (
      <div className={`flex items-center gap-1 mt-3 text-xs font-semibold ${
        trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : trend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-stone-400 dark:text-slate-500'
      }`}>
        <span className="text-base leading-none">
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
        </span>
        <span>{trendValue}</span>
      </div>
    )}
  </div>
)
