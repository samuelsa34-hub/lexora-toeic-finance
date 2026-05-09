import React from 'react'

type BadgeVariant = 'indigo' | 'emerald' | 'amber' | 'red' | 'slate'

const variants: Record<BadgeVariant, string> = {
  indigo:  'bg-indigo-50  dark:bg-indigo-500/10  text-indigo-700  dark:text-indigo-300  border-indigo-200  dark:border-indigo-500/20',
  emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20',
  amber:   'bg-amber-50   dark:bg-amber-500/10   text-amber-700   dark:text-amber-300   border-amber-200   dark:border-amber-500/20',
  red:     'bg-red-50     dark:bg-red-500/10     text-red-700     dark:text-red-300     border-red-200     dark:border-red-500/20',
  slate:   'bg-stone-100  dark:bg-white/[0.05]   text-stone-500   dark:text-slate-400   border-stone-200   dark:border-white/[0.08]',
}

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'indigo', className = '' }) => (
  <span
    className={`
      inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold
      border tracking-wide ${variants[variant]} ${className}
    `}
  >
    {children}
  </span>
)
