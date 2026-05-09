import React, { useRef } from 'react'
import { HeroSection } from '../../components/landing/HeroSection'

/**
 * Parent landing page v2 — rendered at `/` when flags.parentLandingV2 = true.
 *
 * Phase 1: Hero section only.
 * Phases 2–4: Entity cards, bridge, personas, how-it-works, social proof,
 *              pricing teaser, final CTA, footer will be added here.
 */
export function ParentLandingV2() {
  const belowHeroRef = useRef<HTMLDivElement>(null)

  const scrollDown = () => {
    belowHeroRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    // Fixed overlay — same pattern as GlobalHomepage, covers the Layout sidebar
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ zIndex: 100, background: '#0A0A0F' }}
    >
      <HeroSection onScrollDown={scrollDown} />

      {/* Remaining sections will be added in phases 2–4 */}
      <div ref={belowHeroRef} />
    </div>
  )
}
