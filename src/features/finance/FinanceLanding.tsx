import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, TrendingUp, BookOpen, Wrench, Target, ChevronRight } from 'lucide-react'
import { FINANCE_MODULES, FINANCE_LEVEL_META } from '../../data/financeModules'
import type { FinanceModule } from '../../types'

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: FinanceModule['status'] }) {
  if (status === 'available') return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
      style={{ color: '#4ADE80', background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.20)' }}>
      Live
    </span>
  )
  if (status === 'beta') return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
      style={{ color: '#FACC15', background: 'rgba(250,204,21,0.12)', border: '1px solid rgba(250,204,21,0.20)' }}>
      Beta
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
      style={{ color: '#94A3B8', background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.12)' }}>
      Soon
    </span>
  )
}

// ── Module card ───────────────────────────────────────────────────────────────

function ModuleCard({ mod }: { mod: FinanceModule }) {
  const navigate = useNavigate()
  const clickable = mod.status !== 'coming_soon' && mod.route

  return (
    <div
      onClick={clickable ? () => navigate(mod.route!) : undefined}
      className={`rounded-xl p-4 flex flex-col gap-3 transition-all duration-150 ${clickable ? 'cursor-pointer' : 'opacity-60'}`}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        ...(clickable ? {} : {}),
      }}
      onMouseEnter={e => {
        if (clickable) {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'
          ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'
        }
      }}
      onMouseLeave={e => {
        if (clickable) {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
          ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'
        }
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{mod.icon}</span>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{mod.level}</div>
            <div className="text-sm font-semibold text-slate-200 leading-tight">{mod.title}</div>
          </div>
        </div>
        <StatusBadge status={mod.status} />
      </div>
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{mod.description}</p>
      {mod.estimatedHours > 0 && (
        <div className="text-[10px] text-slate-600">{mod.estimatedHours}h</div>
      )}
    </div>
  )
}

// ── Value proposition cards ───────────────────────────────────────────────────

const VALUE_PROPS = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    color: '#3B82F6',
    title: 'Structured Curriculum',
    desc: 'F0 foundations to F5 professional tools — a complete finance education path.',
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    color: '#8B5CF6',
    title: 'Market-Tested Content',
    desc: 'Written for S&T, IB, and AM candidates. The vocabulary, frameworks, and intuitions used on real desks.',
  },
  {
    icon: <Target className="w-5 h-5" />,
    color: '#F59E0B',
    title: 'Interview Ready',
    desc: 'Technical questions, trade pitch frameworks, and market awareness drills for finance interviews.',
  },
  {
    icon: <Wrench className="w-5 h-5" />,
    color: '#10B981',
    title: 'Professional Tools',
    desc: 'Interactive bond pricer, Black-Scholes calculator, and options payoff visualizer.',
  },
]

// ── Main landing page ─────────────────────────────────────────────────────────

export function FinanceLanding() {
  const navigate = useNavigate()
  const levelKeys = Object.keys(FINANCE_LEVEL_META)
  const availableCount = FINANCE_MODULES.filter(m => m.status === 'available' || m.status === 'beta').length

  return (
    <div className="min-h-full" style={{ background: '#09090B', color: '#FAFAFA' }}>

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 max-w-4xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(59,130,246,0.20)' }}>
          <span className="text-xs font-semibold" style={{ color: '#60A5FA' }}>LEXORA Finance</span>
          <span className="w-1 h-1 rounded-full" style={{ background: '#3B82F6' }} />
          <span className="text-xs" style={{ color: '#60A5FA' }}>{availableCount} modules available</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
          style={{ letterSpacing: '-0.02em' }}>
          Learn Finance.<br />
          <span style={{
            background: 'linear-gradient(135deg, #60A5FA 0%, #818CF8 50%, #A78BFA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Speak the Market.
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          A structured finance curriculum for students targeting S&T, Investment Banking,
          and Asset Management — from market foundations to professional-grade tools.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/finance/academy')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-150"
            style={{ background: '#3B82F6', color: '#FAFAFA' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#2563EB' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#3B82F6' }}
          >
            Explore Academy <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/finance/dictionary')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-150"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#E2E8F0', border: '1px solid rgba(255,255,255,0.10)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.10)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)' }}
          >
            Finance Dictionary
          </button>
        </div>
      </section>

      {/* ── VALUE PROPS ───────────────────────────────────────────────────────── */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUE_PROPS.map((vp, i) => (
            <div key={i} className="rounded-xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${vp.color}18`, color: vp.color }}>
                {vp.icon}
              </div>
              <div className="text-sm font-semibold text-slate-200 mb-1">{vp.title}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{vp.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CURRICULUM OVERVIEW ───────────────────────────────────────────────── */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">Curriculum</div>
            <h2 className="text-xl font-bold text-slate-100">F0 → F5 Learning Path</h2>
          </div>
          <button
            onClick={() => navigate('/finance/academy')}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: '#60A5FA' }}
          >
            View full Academy <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {levelKeys.map(level => {
            const meta = FINANCE_LEVEL_META[level]
            const mods = FINANCE_MODULES.filter(m => m.level === level)
            const available = mods.filter(m => m.status !== 'coming_soon').length
            return (
              <div
                key={level}
                className="rounded-xl p-4 cursor-pointer transition-all duration-150"
                style={{ background: meta.bgColor, border: `1px solid ${meta.borderColor}` }}
                onClick={() => navigate('/finance/academy')}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg leading-none">{meta.icon}</span>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: meta.color }}>{level}</div>
                    <div className="text-sm font-semibold text-slate-200">{meta.label}</div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-2 line-clamp-2">{meta.description}</p>
                <div className="text-[10px] text-slate-600">
                  {mods.length} modules · {available} available
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── SELECTED MODULES ──────────────────────────────────────────────────── */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">Available now</div>
          <h2 className="text-xl font-bold text-slate-100">Start Learning Today</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FINANCE_MODULES
            .filter(m => m.status === 'available' || m.status === 'beta')
            .slice(0, 6)
            .map(mod => <ModuleCard key={mod.id} mod={mod} />)}
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 max-w-2xl mx-auto text-center">
        <div className="rounded-2xl p-8"
          style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <h3 className="text-xl font-bold text-slate-100 mb-2">Ready to start?</h3>
          <p className="text-sm text-slate-500 mb-6">
            Begin with Financial Markets 101 — no prior finance knowledge required.
          </p>
          <button
            onClick={() => navigate('/finance/academy')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: '#3B82F6', color: '#FAFAFA' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#2563EB' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#3B82F6' }}
          >
            Go to Academy <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  )
}
