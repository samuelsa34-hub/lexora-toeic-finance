import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  accent?: boolean
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover, accent, onClick }) => (
  <div
    onClick={onClick}
    className={`
      ${accent ? 'card-accent' : 'card'}
      ${hover
        ? 'cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(99,102,241,0.06)]'
        : ''}
      ${className}
    `}
  >
    {children}
  </div>
)
