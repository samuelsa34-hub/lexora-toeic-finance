import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { LangToggle } from '../nav/LangToggle'
import { StarfieldBackground } from '../visuals/StarfieldBackground'
import { flags } from '../../config/flags'
import { useCopy } from '../../hooks/useCopy'

// ── Internal button ────────────────────────────────────────────────────────────

interface HeroCTAProps {
  label: string
  onClick: () => void
  accent: 'toeic' | 'finance'
}

function HeroCTA({ label, onClick, accent }: HeroCTAProps) {
  const [hovered, setHovered] = React.useState(false)

  const base = accent === 'toeic' ? '#4F46E5' : '#1D4ED8'
  const hover = accent === 'toeic' ? '#6366F1' : '#2563EB'
  const glow = accent === 'toeic'
    ? 'rgba(99,102,241,0.35)'
    : 'rgba(37,99,235,0.35)'

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-4 rounded-xl font-semibold text-sm text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      style={{
        background: hovered ? hover : base,
        boxShadow: hovered ? `0 0 32px ${glow}, 0 4px 16px rgba(0,0,0,0.3)` : '0 2px 8px rgba(0,0,0,0.25)',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        minWidth: 220,
      }}
    >
      {label}
    </button>
  )
}

// ── Hero section ───────────────────────────────────────────────────────────────

interface HeroSectionProps {
  onScrollDown?: () => void
}

export function HeroSection({ onScrollDown }: HeroSectionProps) {
  const navigate = useNavigate()
  const copy = useCopy()

  return (
    <section
      className="relative flex flex-col"
      style={{ minHeight: '100svh' }}
      aria-label="Hero"
    >
      {/* ── Background ─────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #0A0A0F 0%, #0F0A1F 100%)' }}
        aria-hidden="true"
      >
        {flags.starfieldHero && (
          <StarfieldBackground
            variant="full"
            className="absolute inset-0"
            fallbackImage="/assets/3d/lexora/lexora-starfield-static.avif"
          />
        )}
      </div>

      {/* ── Minimal header ─────────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-5 sm:px-8 lg:px-12 pt-5 sm:pt-7">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg"
          aria-label="LEXORA home"
        >
          <Logo variant="icon" iconSize={34} />
          <div className="flex flex-col">
            <span
              className="text-base font-black tracking-[0.09em] leading-none"
              style={{
                background: 'linear-gradient(135deg, #5B8BF5 0%, #38BDF8 52%, #7DD3FC 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              LEXORA
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-sky-400/40 leading-none mt-0.5">
              Learning Ecosystem
            </span>
          </div>
        </button>
        <LangToggle />
      </header>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 sm:px-8 text-center">
        <div className="max-w-[720px] w-full mx-auto">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-8 sm:mb-10 px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            LEXORA · Learning Ecosystem
          </div>

          {/* Headline — LCP target */}
          <h1
            className="font-semibold text-white leading-[1.08] tracking-[-0.02em] mb-6 sm:mb-7"
            style={{
              fontSize: 'clamp(30px, 5.5vw, 60px)',
            }}
          >
            {copy.hero.headline}
          </h1>

          {/* Sub-headline */}
          <p
            className="text-slate-400 leading-relaxed mx-auto mb-10 sm:mb-12"
            style={{
              fontSize: 'clamp(15px, 1.5vw, 18px)',
              maxWidth: '560px',
            }}
          >
            {copy.hero.subHeadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-7">
            <HeroCTA
              label={copy.hero.ctaToeic}
              onClick={() => navigate('/toeic')}
              accent="toeic"
            />
            <HeroCTA
              label={copy.hero.ctaFinance}
              onClick={() => navigate('/finance')}
              accent="finance"
            />
          </div>

          {/* Sign-in link */}
          <p className="text-sm text-slate-600">
            {copy.hero.signInPrompt}{' '}
            <button
              onClick={() => navigate('/')}
              className="text-slate-500 underline-offset-4 hover:underline hover:text-slate-300 transition-colors duration-150"
            >
              {copy.hero.signInCta}
            </button>
          </p>
        </div>
      </div>

      {/* ── Scroll indicator ───────────────────────────────────────────────── */}
      <div className="relative z-10 flex justify-center pb-8" aria-hidden="true">
        <button
          onClick={onScrollDown}
          className="flex flex-col items-center gap-1.5 opacity-25 hover:opacity-50 transition-opacity duration-200 focus:outline-none"
          tabIndex={-1}
          aria-hidden="true"
        >
          <span className="text-[10px] uppercase tracking-[0.15em] text-white font-medium">Scroll</span>
          <ChevronDown className="w-4 h-4 text-white animate-bounce" />
        </button>
      </div>
    </section>
  )
}
