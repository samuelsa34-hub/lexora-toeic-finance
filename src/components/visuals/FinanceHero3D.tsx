import React from 'react'
import { flags } from '../../config/flags'
import { Decorative3DBackground, type Decorative3DBackgroundProps } from './Decorative3DBackground'

export interface FinanceHero3DProps {
  variant?: Decorative3DBackgroundProps['variant']
  className?: string
}

export function FinanceHero3D({ variant = 'hero', className }: FinanceHero3DProps) {
  if (!flags.visual3D) return null
  return (
    <Decorative3DBackground
      entity="finance"
      variant={variant}
      className={className}
    />
  )
}
