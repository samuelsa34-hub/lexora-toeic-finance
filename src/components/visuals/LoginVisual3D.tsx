import React from 'react'
import { flags } from '../../config/flags'
import { GradientPlaceholder } from './GradientPlaceholder'
import { LexoraOrbitOverlay } from './Decorative3DBackground'

export interface LoginVisual3DProps {
  className?: string
}

/**
 * Phase 2 target: drops into ProfileGate's .pg-hero desktop panel.
 * Currently renders the Lexora gradient + orbit overlay when visual3D is enabled.
 * Phase 2 will swap in AVIF/WebP hero image over this base.
 */
export function LoginVisual3D({ className }: LoginVisual3DProps) {
  if (!flags.visual3D) return null
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`} aria-hidden="true">
      <GradientPlaceholder entity="lexora" />
      <LexoraOrbitOverlay />
    </div>
  )
}
