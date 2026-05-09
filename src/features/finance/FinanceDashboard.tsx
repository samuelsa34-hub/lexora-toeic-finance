import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, BookMarked, FileQuestion, Wrench, ChevronRight } from 'lucide-react'
import { FINANCE_MODULES, FINANCE_LEVEL_META } from '../../data/financeModules'

// ── Quick access cards ────────────────────────────────────────────────────────

const QUICK_ACCESS = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    label: 'Academy',
    desc: 'F0 → F5 curriculum',
    color: '#3B82F6',
    route: '/finance/academy',
  },
  {
    icon: <BookMarked className="w-5 h-5" />,
    label: 'Dictionary',
    desc: '28 EN+FR terms',
    color: '#8B5CF6',
    route: '/finance/dictionary',
  },
  {
    icon: <FileQuestion className="w-5 h-5" />,
    label: 'Interview',
    desc: 'Technical Q&A',
    color: '#F59E0B',
    route: '/finance/interview',
  },
  {
    icon: <Wrench className="w-5 h-5" />,
    label: 'Tools',
    desc: 'Calculators',
    color: '#10B981',
    route: '/finance/tools',
  },
]

// ── Level progress map ────────────────────────────────────────────────────────

function LevelMap() {
  const navigate = useNavigate()
  const levels = Object.entries(FINANCE_LEVEL_META)

  return (
    <div className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Curriculum Map</div>
        <div className="text-sm font-semibold text-slate-200">F0 — F5 Learning Path</div>
      </div>
      <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        {levels.map(([level, meta]) => {
          const mods = FINANCE_MODULES.filter(m => m.level === level)
          const available = mods.filter(m => m.status !== 'coming_soon').length
          const pct = mods.length > 0 ? Math.round((available / mods.length) * 100) : 0

          return (
            <button
              key={level}
              onClick={() => navigate('/finance/academy')}
              className="w-full flex items-center gap-4 px-5 py-3.5 text-left transition-all duration-100 group"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '' }}
            >
              <span className="text-lg leading-none w-6 flex-shrink-0">{meta.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: meta.color }}>{level}</span>
                  <span className="text-sm font-medium text-slate-300 truncate">{meta.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: meta.color }} />
                  </div>
                  <span className="text-[10px] text-slate-600 flex-shrink-0">
                    {available}/{mods.length}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Recommended start ─────────────────────────────────────────────────────────

function RecommendedStart() {
  const navigate = useNavigate()
  const firstAvailable = FINANCE_MODULES.find(m => m.status === 'available')

  if (!firstAvailable) return null

  return (
    <div
      className="rounded-xl p-5 cursor-pointer transition-all duration-150"
      style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}
      onClick={() => firstAvailable.route && navigate(firstAvailable.route)}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.30)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.15)' }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none flex-shrink-0">{firstAvailable.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#60A5FA' }}>
            Recommended Start · {firstAvailable.level}
          </div>
          <div className="text-base font-semibold text-slate-100 mb-1">{firstAvailable.title}</div>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{firstAvailable.description}</p>
          <div className="mt-3 flex items-center gap-1.5 text-sm font-medium" style={{ color: '#60A5FA' }}>
            Start module <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export function FinanceDashboard() {
  const navigate = useNavigate()
  const totalModules = FINANCE_MODULES.length
  const availableModules = FINANCE_MODULES.filter(m => m.status !== 'coming_soon').length

  return (
    <div className="min-h-full px-6 py-8 max-w-5xl mx-auto" style={{ color: '#FAFAFA' }}>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              LEXORA Finance
            </div>
            <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          </div>
          <button
            onClick={() => navigate('/finance/academy')}
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-all"
            style={{ background: 'rgba(59,130,246,0.10)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.20)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.18)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.10)' }}
          >
            Browse Academy <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── STATS ROW ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total Modules', value: totalModules, color: '#3B82F6' },
          { label: 'Available', value: availableModules, color: '#4ADE80' },
          { label: 'Dictionary Terms', value: 28, color: '#8B5CF6' },
          { label: 'Levels', value: 6, color: '#F59E0B' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl p-4 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-2xl font-bold mb-0.5" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── QUICK ACCESS ────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">Quick Access</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACCESS.map(qa => (
            <button
              key={qa.route}
              onClick={() => navigate(qa.route)}
              className="rounded-xl p-4 text-left flex flex-col gap-2 transition-all duration-150"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = `${qa.color}10`
                ;(e.currentTarget as HTMLElement).style.borderColor = `${qa.color}25`
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'
              }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${qa.color}18`, color: qa.color }}>
                {qa.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-200">{qa.label}</div>
                <div className="text-xs text-slate-500">{qa.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN 2-COL ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <RecommendedStart />
        </div>
        <LevelMap />
      </div>

    </div>
  )
}
