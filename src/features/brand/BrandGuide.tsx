import React from 'react'
import { Logo, LogoHero } from '../../components/ui/Logo'

// ── Lexora Brand Guide ────────────────────────────────────────────────────────
// Internal reference for the Lexora visual identity system.
// Not exposed in the nav — accessible directly at /brand.

const PALETTE = [
  { name: 'Electric Blue',  hex: '#5B8BF5', use: 'Primary accent, CTAs, mark gradient start' },
  { name: 'Sky Cyan',       hex: '#38BDF8', use: 'Gradient mid, active states, highlights' },
  { name: 'Light Sky',      hex: '#7DD3FC', use: 'Gradient tip, subtle text accents' },
  { name: 'Space Dark',     hex: '#080E1E', use: 'Background, primary dark surface' },
  { name: 'Deep Navy',      hex: '#0D1829', use: 'Icon background, surface-alt' },
  { name: 'Midnight',       hex: '#111C30', use: 'Elevated surface, card background' },
  { name: 'Slate 600',      hex: '#475569', use: 'Disabled text, placeholders' },
  { name: 'Off-White',      hex: '#EDF2FF', use: 'Primary text on dark' },
  { name: 'Slate 400',      hex: '#94A3B8', use: 'Secondary text, captions' },
  { name: 'Amber',          hex: '#F59E0B', use: 'XP, streak, rewards' },
  { name: 'Emerald',        hex: '#10B981', use: 'Success, correct, mastered' },
  { name: 'Red',            hex: '#EF4444', use: 'Error, wrong, critical' },
  { name: 'Indigo (legacy)',hex: '#6366F1', use: 'UI components (retained from base system)' },
]

const FONT_SCALE = [
  { label: 'Display',   size: '36px / 900', sample: 'LEXORA' },
  { label: 'Hero',      size: '24px / 800', sample: 'Your TOEIC Journey' },
  { label: 'Title',     size: '18px / 700', sample: 'Grammar Drill — Part 5' },
  { label: 'Subhead',   size: '14px / 600', sample: 'Session Results' },
  { label: 'Body',      size: '13px / 400', sample: 'Review your errors and track progress.' },
  { label: 'Caption',   size: '11px / 500', sample: 'TOEIC · PART 5 · ACCURACY' },
  { label: 'Label',     size: '10px / 600', sample: 'LEARN · PRACTICE · REVIEW' },
]

const USAGE_CONTEXTS = [
  { ctx: 'Sidebar logo',       variant: 'full' as const,      size: 34, note: 'With TOEIC prefix · always on dark background' },
  { ctx: 'Mobile header',      variant: 'compact' as const,   size: 28, note: 'Space-constrained horizontal layout' },
  { ctx: 'App icon / favicon', variant: 'icon' as const,      size: 48, note: 'Mark only — dark bg · rounded square' },
  { ctx: 'Large icon',         variant: 'icon' as const,      size: 64, note: 'Auth loading screen, splash' },
]

export default function BrandGuide() {
  return (
    <div className="min-h-screen pb-20" style={{ background: '#080E1E', color: '#E2E8F0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Header */}
      <div className="px-8 py-10 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: 'rgba(125,211,252,0.40)', marginBottom: 8, textTransform: 'uppercase' }}>
          Visual Identity System
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '0.10em', color: '#fff', marginBottom: 6 }}>
          LEXORA
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(125,211,252,0.50)' }}>
          Brand guide — internal reference · v2.0
        </p>
      </div>

      <div className="px-8 py-10 space-y-16 max-w-5xl">

        {/* ── Primary Mark ── */}
        <Section title="The Lexora Arc — Primary Mark">
          <p className="mb-8" style={{ fontSize: 13, color: 'rgba(125,211,252,0.55)', maxWidth: 580, lineHeight: 1.7 }}>
            The mark is a bold geometric <strong style={{ color: '#38BDF8' }}>L</strong> built from two strokes:
            a vertical stem (precision, structured knowledge) and a rising diagonal base (momentum, progression, ascent).
            Read simultaneously as the letter L (Lexora) and an upward trajectory — language as the path to elevation.
            Gradient flows bottom-left to top-right, following the direction of ascent: electric blue foundation → sky cyan tip.
          </p>
          <div className="flex gap-10 flex-wrap items-end">
            <LogoHero animate={false} />
            <div className="flex flex-col gap-4">
              <Logo variant="full" iconSize={40} />
              <Logo variant="compact" iconSize={30} />
              <Logo variant="icon" iconSize={40} />
            </div>
          </div>
        </Section>

        {/* ── Logo Variants ── */}
        <Section title="Logo Variants">
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {USAGE_CONTEXTS.map(({ ctx, variant, size, note }) => (
              <div key={ctx} className="rounded-2xl p-6 flex flex-col gap-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <Logo variant={variant} iconSize={size} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{ctx}</p>
                  <p style={{ fontSize: 11, color: 'rgba(125,211,252,0.45)' }}>{note}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Monochrome Variants ── */}
        <Section title="Monochrome Variants">
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <Swatch bg="#080E1E" label="On dark (default)">
              <Logo variant="full" iconSize={36} />
            </Swatch>
            <Swatch bg="#0D1829" label="On navy">
              <Logo variant="full" iconSize={36} />
            </Swatch>
            <Swatch bg="#FFFFFF" label="On white (mono dark)">
              <Logo variant="full" iconSize={36} mono="dark" />
            </Swatch>
            <Swatch bg="#3B82F6" label="On electric blue (white)">
              <Logo variant="full" iconSize={36} mono="white" />
            </Swatch>
          </div>
        </Section>

        {/* ── Color Palette ── */}
        <Section title="Color Palette">
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {PALETTE.map(({ name, hex, use }) => (
              <div key={hex} className="flex items-center gap-3 rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="rounded-lg flex-shrink-0" style={{ width: 36, height: 36, background: hex, border: hex === '#EDF2FF' || hex === '#94A3B8' ? '1px solid rgba(255,255,255,0.15)' : 'none' }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{name}</p>
                  <p style={{ fontSize: 10, color: 'rgba(125,211,252,0.45)', fontFamily: 'monospace' }}>{hex}</p>
                  <p style={{ fontSize: 10, color: 'rgba(125,211,252,0.35)', marginTop: 1 }}>{use}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Gradient System ── */}
        <Section title="Gradient System">
          <div className="flex flex-col gap-4">
            {[
              { label: 'Brand Primary', g: 'linear-gradient(135deg, #5B8BF5, #38BDF8)' },
              { label: 'Mark Gradient', g: 'linear-gradient(135deg, #5B8BF5, #38BDF8, #7DD3FC)' },
              { label: 'Surface Gradient', g: 'linear-gradient(180deg, #0D1829, #080E1E)' },
              { label: 'Warm Dark', g: 'linear-gradient(135deg, #111C30, #0D1829)' },
              { label: 'Score Accent', g: 'linear-gradient(90deg, #5B8BF5, #38BDF8)' },
            ].map(({ label, g }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="rounded-xl flex-shrink-0" style={{ width: 180, height: 40, background: g }} />
                <p style={{ fontSize: 12, color: 'rgba(125,211,252,0.55)' }}>{label}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Typography ── */}
        <Section title="Typography Scale — Inter">
          <div className="flex flex-col gap-5">
            {FONT_SCALE.map(({ label, size, sample }) => (
              <div key={label} className="flex items-baseline gap-6 pb-5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: 90, flexShrink: 0 }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(125,211,252,0.40)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</p>
                  <p style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(125,211,252,0.30)', marginTop: 2 }}>{size}</p>
                </div>
                <p style={{
                  fontSize: label === 'Display' ? 36 : label === 'Hero' ? 24 : label === 'Title' ? 18 : label === 'Subhead' ? 14 : label === 'Caption' ? 11 : label === 'Label' ? 10 : 13,
                  fontWeight: label === 'Display' ? 900 : label === 'Hero' ? 800 : label === 'Title' ? 700 : label === 'Subhead' ? 600 : label === 'Caption' || label === 'Label' ? 600 : 400,
                  color: label === 'Body' ? 'rgba(237,242,255,0.80)' : label === 'Caption' || label === 'Label' ? 'rgba(125,211,252,0.55)' : '#fff',
                  letterSpacing: label === 'Caption' || label === 'Label' ? '0.10em' : label === 'Display' ? '0.10em' : undefined,
                  textTransform: label === 'Caption' || label === 'Label' || label === 'Display' ? 'uppercase' as const : undefined,
                }}>
                  {sample}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Usage Rules ── */}
        <Section title="Usage Rules">
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {[
              { icon: '✓', color: '#10B981', rule: 'Always use the Arc mark with the correct gradient or mono version — never recolor manually.' },
              { icon: '✓', color: '#10B981', rule: 'On dark backgrounds: use gradient or white version. On light backgrounds: use mono-dark version.' },
              { icon: '✓', color: '#10B981', rule: 'Minimum icon size: 20px. Below this, use text-only or abbreviated brand treatment.' },
              { icon: '✗', color: '#EF4444', rule: 'Never stretch, skew, rotate, or distort the mark in any direction.' },
              { icon: '✗', color: '#EF4444', rule: 'Never add drop shadows to the Arc mark — glow is reserved for loading/splash screens.' },
              { icon: '✗', color: '#EF4444', rule: 'Never place the mark on busy backgrounds without a solid or dark overlay.' },
            ].map(({ icon, color, rule }, i) => (
              <div key={i} className="flex gap-3 rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: 14, fontWeight: 800, color, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                <p style={{ fontSize: 12, color: 'rgba(237,242,255,0.70)', lineHeight: 1.6 }}>{rule}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Concept Rationale ── */}
        <Section title="Concept Rationale">
          <div className="rounded-2xl p-6" style={{ background: 'rgba(91,139,245,0.06)', border: '1px solid rgba(91,139,245,0.18)' }}>
            <p style={{ fontSize: 13, color: 'rgba(237,242,255,0.75)', lineHeight: 1.8, maxWidth: 620 }}>
              <strong style={{ color: '#7DD3FC' }}>LEXORA</strong> fuses{' '}
              <em style={{ color: '#38BDF8' }}>lexicon</em> (the total vocabulary of a language — lex, from Latin:{' '}
              <em>law, word, language</em>) with{' '}
              <em style={{ color: '#38BDF8' }}>aura</em> (brilliance, radiance, a luminous field).
              Together: <strong style={{ color: '#fff' }}>mastery through language, illuminated.</strong>{' '}
              The name signals structure, depth, and intelligence — not a boot camp, but a precision system.
              The Arc mark embodies this: the vertical stem is disciplined foundation; the rising diagonal is momentum.
              Blue-to-cyan carries the connotation of clarity, sky, intelligence, and digital precision — distinct from
              the purple-indigo palette of productivity tools, and warmer than cold tech blue.
            </p>
          </div>
        </Section>

      </div>
    </div>
  )
}

// ── Helper subcomponents ───────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: 'rgba(125,211,252,0.35)', textTransform: 'uppercase', marginBottom: 6 }}>
        ──
      </p>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 20, letterSpacing: '0.01em' }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

function Swatch({ bg, label, children }: { bg: string; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-center p-8" style={{ background: bg }}>
        {children}
      </div>
      <div className="px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <p style={{ fontSize: 11, color: 'rgba(125,211,252,0.50)' }}>{label}</p>
        <p style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(125,211,252,0.30)', marginTop: 1 }}>{bg}</p>
      </div>
    </div>
  )
}
