import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, TrendingUp, Mic2, Brain, Target, BarChart2, Layers, Wrench } from 'lucide-react'
import { Logo } from '../../components/ui/Logo'
import { StarfieldBackground } from '../../components/visuals/StarfieldBackground'
import { flags } from '../../config/flags'

// ── Portal card bullet points ─────────────────────────────────────────────────

const TOEIC_BULLETS = [
  { icon: <BookOpen className="w-3.5 h-3.5" />, text: 'Grammar & vocabulary drills' },
  { icon: <Mic2 className="w-3.5 h-3.5" />, text: 'Listening & reading practice' },
  { icon: <Brain className="w-3.5 h-3.5" />, text: 'Flashcards & spaced repetition' },
  { icon: <Target className="w-3.5 h-3.5" />, text: 'Mock exams with scoring' },
  { icon: <BarChart2 className="w-3.5 h-3.5" />, text: 'Progress tracking & analytics' },
]

const FINANCE_BULLETS = [
  { icon: <TrendingUp className="w-3.5 h-3.5" />, text: 'Market finance & trading' },
  { icon: <Layers className="w-3.5 h-3.5" />, text: 'Fixed income & derivatives' },
  { icon: <BarChart2 className="w-3.5 h-3.5" />, text: 'Options, Greeks & vol surfaces' },
  { icon: <BookOpen className="w-3.5 h-3.5" />, text: 'Bilingual finance dictionary' },
  { icon: <Wrench className="w-3.5 h-3.5" />, text: 'Professional calculators & tools' },
]

// ── Portal card ───────────────────────────────────────────────────────────────

interface PortalCardProps {
  badge: string
  title: string
  subtitle: string
  description: string
  bullets: { icon: React.ReactNode; text: string }[]
  ctaLabel: string
  accentColor: string
  accentColorDim: string
  borderGlow: string
  bgGradient: string
  badgeStyle: React.CSSProperties
  ctaStyle: React.CSSProperties
  emoji: string
  onClick: () => void
}

function PortalCard({
  badge, title, subtitle, description, bullets,
  ctaLabel, accentColor, borderGlow, bgGradient,
  badgeStyle, ctaStyle, emoji, onClick,
}: PortalCardProps) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden"
      style={{
        background: hovered ? bgGradient : 'rgba(255,255,255,0.03)',
        border: hovered ? `1px solid ${borderGlow}` : '1px solid rgba(255,255,255,0.10)',
        boxShadow: hovered ? `0 0 40px ${accentColor}18, 0 4px 24px rgba(0,0,0,0.4)` : '0 2px 12px rgba(0,0,0,0.2)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        minHeight: 420,
      }}
    >
      {/* Top section */}
      <div className="p-7 flex-1">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 mb-5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest"
          style={badgeStyle}>
          {badge}
        </div>

        {/* Icon + title */}
        <div className="flex items-start gap-4 mb-4">
          <span className="text-4xl leading-none flex-shrink-0">{emoji}</span>
          <div>
            <h2 className="text-2xl font-bold text-white leading-tight">{title}</h2>
            <div className="text-sm font-medium mt-0.5" style={{ color: accentColor }}>{subtitle}</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed mb-6">{description}</p>

        {/* Bullets */}
        <ul className="flex flex-col gap-2.5">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-center gap-2.5">
              <span className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: `${accentColor}15`, color: accentColor }}>
                {b.icon}
              </span>
              <span className="text-sm text-slate-300">{b.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA button */}
      <div className="p-7 pt-0">
        <button
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
          style={ctaStyle}
        >
          {ctaLabel}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Corner accent glow */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
          transform: 'translate(30%, -30%)',
          opacity: hovered ? 1 : 0,
        }}
      />
    </div>
  )
}

// ── Main global homepage ──────────────────────────────────────────────────────

export function GlobalHomepage() {
  const navigate = useNavigate()

  return (
    // Fixed overlay — covers everything beneath (the TOEIC layout at this route)
    <div
      className="fixed inset-0"
      style={{
        zIndex: 100,
        background: flags.starfieldHero
          ? '#0A0A0F'
          : 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(30,40,60,0.7) 0%, #09090B 60%)',
      }}
    >
      {/* Starfield layer — mounts after first paint, purely decorative */}
      {flags.starfieldHero && (
        <StarfieldBackground
          variant="full"
          className="absolute inset-0"
          fallbackImage="/assets/3d/lexora/lexora-starfield-static.avif"
        />
      )}

      {/* Scrollable content layer */}
      <div className="absolute inset-0 overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center px-4 py-12 sm:py-16">

        {/* ── BRAND HEADER ──────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center mb-10 sm:mb-14">
          <div className="flex items-center gap-3 mb-4">
            <Logo variant="icon" iconSize={44} mono={null} />
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">LEXORA</div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 -mt-0.5">
                Learning Ecosystem
              </div>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight"
              style={{ letterSpacing: '-0.02em' }}>
              Choose your universe
            </h1>
            <p className="text-slate-400 text-base max-w-md">
              One platform, two worlds. Pick where you want to start — you can switch any time.
            </p>
          </div>
        </div>

        {/* ── PORTAL CARDS ──────────────────────────────────────────────────── */}
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* LEXORA TOEIC */}
          <PortalCard
            badge="LEXORA TOEIC"
            title="English Mastery"
            subtitle="TOEIC Preparation"
            description="A structured preparation system for the TOEIC exam. Grammar, vocabulary, listening, reading — everything you need to reach your target score."
            bullets={TOEIC_BULLETS}
            ctaLabel="Enter LEXORA TOEIC"
            accentColor="#6366F1"
            accentColorDim="#4338CA"
            borderGlow="rgba(99,102,241,0.50)"
            bgGradient="rgba(99,102,241,0.06)"
            badgeStyle={{ color: '#818CF8', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}
            ctaStyle={{ background: '#6366F1', color: '#fff' }}
            emoji="📚"
            onClick={() => navigate('/toeic')}
          />

          {/* LEXORA Finance */}
          <PortalCard
            badge="LEXORA Finance"
            title="Market Finance"
            subtitle="Professional Trading & Markets"
            description="A serious finance curriculum for students targeting S&T, Investment Banking, and Asset Management. F0 foundations to F5 professional tools."
            bullets={FINANCE_BULLETS}
            ctaLabel="Enter LEXORA Finance"
            accentColor="#3B82F6"
            accentColorDim="#1D4ED8"
            borderGlow="rgba(59,130,246,0.50)"
            bgGradient="rgba(59,130,246,0.06)"
            badgeStyle={{ color: '#60A5FA', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}
            ctaStyle={{ background: '#3B82F6', color: '#fff' }}
            emoji="📈"
            onClick={() => navigate('/finance')}
          />
        </div>

        {/* ── FOOTER NOTE ───────────────────────────────────────────────────── */}
        <p className="mt-8 text-xs text-slate-600 text-center">
          You can switch between LEXORA TOEIC and LEXORA Finance at any time using the portal switcher in the sidebar.
        </p>

      </div>
      </div>
    </div>
  )
}
