import React from 'react'
import { flags } from '../../config/flags'
import { Decorative3DBackground, type Decorative3DBackgroundProps } from './Decorative3DBackground'

export interface ToeicHero3DProps {
  variant?: Decorative3DBackgroundProps['variant']
  className?: string
}

export function ToeicHero3D({ variant = 'hero', className }: ToeicHero3DProps) {
  if (!flags.visual3D) return null
  return (
    <Decorative3DBackground
      entity="toeic"
      variant={variant}
      className={className}
    />
  )
}
