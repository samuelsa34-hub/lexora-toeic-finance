import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants = {
  primary:
    'bg-indigo-600 hover:bg-indigo-500 text-white border-transparent ' +
    'shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_1px_3px_rgba(0,0,0,0.4),0_0_0_1px_rgba(99,102,241,0.3)] ' +
    'hover:shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_2px_8px_rgba(0,0,0,0.4),0_0_20px_rgba(99,102,241,0.3),0_0_0_1px_rgba(99,102,241,0.45)]',
  ghost:
    'text-stone-600 dark:text-slate-300 border-stone-300 dark:border-white/[0.12] ' +
    'bg-white dark:bg-white/[0.03] hover:bg-stone-50 dark:hover:bg-white/[0.06] ' +
    'hover:border-stone-400 dark:hover:border-white/[0.20]',
  success:
    'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent ' +
    'shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_1px_3px_rgba(0,0,0,0.4)]',
  danger:
    'bg-red-600/90 hover:bg-red-500 text-white border-transparent ' +
    'shadow-[0_1px_0_rgba(255,255,255,0.1)_inset,0_1px_3px_rgba(0,0,0,0.4)]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props
}) => (
  <button
    {...props}
    disabled={disabled || loading}
    className={`
      inline-flex items-center justify-center font-semibold rounded-xl border
      transition-all duration-200 active:scale-[0.97]
      disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
      ${variants[variant]} ${sizes[size]} ${className}
    `}
  >
    {loading
      ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      : null}
    {children}
  </button>
)
