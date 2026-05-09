import React from 'react'
import { flags } from '../../config/flags'
import { Decorative3DBackground, type Decorative3DBackgroundProps } from './Decorative3DBackground'

export interface LexoraHero3DProps {
  variant?: Decorative3DBackgroundProps['variant']
  className?: string
}

export function LexoraHero3D({ variant = 'hero', className }: LexoraHero3DProps) {
  if (!flags.visual3D) return null
  return (
    <Decorative3DBackground
      entity="lexora"
      variant={variant}
      className={className}
    />
  )
}
