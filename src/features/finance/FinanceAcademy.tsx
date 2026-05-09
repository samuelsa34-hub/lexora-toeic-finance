import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { FINANCE_MODULES, FINANCE_LEVEL_META, FINANCE_MODULES_BY_LEVEL } from '../../data/financeModules'
import type { FinanceModule } from '../../types'

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: FinanceModule['status'] }) {
  if (status === 'available') return (
    <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
      style={{ color: '#4ADE80', background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.20)' }}>
      Live
    </span>
  )
  if (status === 'beta') return (
    <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
      style={{ color: '#FACC15', background: 'rgba(250,204,21,0.12)', border: '1px solid rgba(250,204,21,0.20)' }}>
      Beta
    </span>
  )
  return (
    <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
      style={{ color: '#64748B', background: 'rgba(100,116,139,0.10)', border: '1px solid rgba(100,116,139,0.15)' }}>
      Coming soon
    </span>
  )
}

// ── Module card ───────────────────────────────────────────────────────────────

function ModuleCard({ mod, accentColor }: { mod: FinanceModule; accentColor: string }) {
  const navigate = useNavigate()
  const clickable = mod.status !== 'coming_soon' && !!mod.route

  return (
    <div
      onClick={clickable ? () => navigate(mod.route!) : undefined}
      className={`rounded-xl p-5 flex flex-col gap-3 transition-all duration-150 ${!clickable ? 'opacity-50' : 'cursor-pointer'}`}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={e => {
        if (clickable) {
          (e.currentTarget as HTMLElement).style.background = `${accentColor}08`
          ;(e.currentTarget as HTMLElement).style.borderColor = `${accentColor}25`
        }
      }}
      onMouseLeave={e => {
        if (clickable) {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
          ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'
        }
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none">{mod.icon}</span>
          <div>
            <div className="text-sm font-semibold text-slate-200 leading-tight">{mod.title}</div>
            <div className="text-xs text-slate-500 mt-0.5">{mod.titleFr}</div>
          </div>
        </div>
        <StatusBadge status={mod.status} />
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 leading-relaxed">{mod.description}</p>

      {/* Topics */}
      <div className="flex flex-wrap gap-1">
        {mod.topics.slice(0, 4).map(topic => (
          <span key={topic} className="text-[10px] px-1.5 py-0.5 rounded"
            style={{ color: 'rgba(148,163,184,0.7)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {topic}
          </span>
        ))}
        {mod.topics.length > 4 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded text-slate-600">
            +{mod.topics.length - 4} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        {mod.estimatedHours > 0 ? (
          <div className="flex items-center gap-1 text-[10px] text-slate-600">
            <Clock className="w-3 h-3" />
            {mod.estimatedHours}h
          </div>
        ) : <div />}
        {clickable && (
          <div className="flex items-center gap-1 text-xs font-medium" style={{ color: accentColor }}>
            Open <ArrowRight className="w-3 h-3" />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Level section ─────────────────────────────────────────────────────────────

function LevelSection({ level }: { level: string }) {
  const [expanded, setExpanded] = useState(true)
  const meta = FINANCE_LEVEL_META[level]
  const mods = FINANCE_MODULES_BY_LEVEL[level] ?? []
  const available = mods.filter(m => m.status !== 'coming_soon').length

  return (
    <section className="rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${meta.borderColor}` }}>

      {/* Level header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left transition-colors"
        style={{ background: meta.bgColor }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.90' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
      >
        <span className="text-2xl leading-none">{meta.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: meta.color }}>
              {level}
            </span>
            <span className="text-[10px] text-slate-600">·</span>
            <span className="text-[10px] text-slate-600">{available}/{mods.length} available</span>
          </div>
          <div className="text-base font-bold text-slate-100">{meta.label}</div>
          <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{meta.description}</div>
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
      </button>

      {/* Modules grid */}
      {expanded && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          style={{ background: 'rgba(0,0,0,0.15)' }}>
          {mods.map(mod => (
            <ModuleCard key={mod.id} mod={mod} accentColor={meta.color} />
          ))}
        </div>
      )}
    </section>
  )
}

// ── Main academy page ─────────────────────────────────────────────────────────

export function FinanceAcademy() {
  const levels = Object.keys(FINANCE_LEVEL_META)
  const totalModules = FINANCE_MODULES.length
  const availableModules = FINANCE_MODULES.filter(m => m.status !== 'coming_soon').length

  return (
    <div className="min-h-full px-6 py-8 max-w-5xl mx-auto" style={{ color: '#FAFAFA' }}>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">LEXORA Finance</div>
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Finance Academy</h1>
        <p className="text-sm text-slate-500">
          {availableModules} of {totalModules} modules available · F0 foundations to F5 professional tools
        </p>
      </div>

      {/* ── LEVEL PROGRESS BAR ──────────────────────────────────────────────── */}
      <div className="mb-8 rounded-xl p-4 flex items-center gap-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex-1">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
            <span>Curriculum Progress</span>
            <span>{Math.round((availableModules / totalModules) * 100)}% available</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full transition-all"
              style={{
                width: `${(availableModules / totalModules) * 100}%`,
                background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
              }} />
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-lg font-bold text-slate-100">{availableModules}</div>
          <div className="text-[10px] text-slate-500">modules live</div>
        </div>
      </div>

      {/* ── LEVEL SECTIONS ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        {levels.map(level => (
          <LevelSection key={level} level={level} />
        ))}
      </div>

    </div>
  )
}
