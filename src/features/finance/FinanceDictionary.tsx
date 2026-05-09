import React, { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronUp, X } from 'lucide-react'
import { FINANCE_DICTIONARY } from '../../data/financeDictionary'
import type { FinanceDictEntry, FinanceCategory } from '../../types'

// ── Category metadata ─────────────────────────────────────────────────────────

const CATEGORY_META: Record<FinanceCategory, { label: string; labelFr: string; color: string }> = {
  fixed_income: { label: 'Fixed Income', labelFr: 'Obligataire', color: '#3B82F6' },
  derivatives:  { label: 'Derivatives', labelFr: 'Dérivés', color: '#8B5CF6' },
  equity:       { label: 'Equity', labelFr: 'Actions', color: '#10B981' },
  macro:        { label: 'Macro', labelFr: 'Macro', color: '#F59E0B' },
  trading:      { label: 'Trading', labelFr: 'Trading', color: '#F97316' },
  risk:         { label: 'Risk', labelFr: 'Risque', color: '#EF4444' },
  structured:   { label: 'Structured', labelFr: 'Structuré', color: '#EC4899' },
  fx:           { label: 'FX', labelFr: 'Change', color: '#06B6D4' },
  credit:       { label: 'Credit', labelFr: 'Crédit', color: '#84CC16' },
  general:      { label: 'General', labelFr: 'Général', color: '#94A3B8' },
}

// ── Category filter pill ──────────────────────────────────────────────────────

function CategoryPill({
  category,
  active,
  count,
  onClick,
}: {
  category: FinanceCategory | 'all'
  active: boolean
  count: number
  onClick: () => void
}) {
  const meta = category === 'all'
    ? { label: 'All', labelFr: '', color: '#FAFAFA' }
    : CATEGORY_META[category]

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex-shrink-0"
      style={
        active
          ? { background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}35` }
          : { background: 'rgba(255,255,255,0.04)', color: 'rgba(148,163,184,0.6)', border: '1px solid rgba(255,255,255,0.06)' }
      }
    >
      {meta.label}
      <span className="text-[10px] rounded px-1"
        style={{ background: active ? `${meta.color}25` : 'rgba(255,255,255,0.08)', color: active ? meta.color : '#64748B' }}>
        {count}
      </span>
    </button>
  )
}

// ── Dictionary card ───────────────────────────────────────────────────────────

function DictCard({ entry }: { entry: FinanceDictEntry }) {
  const [expanded, setExpanded] = useState(false)
  const meta = CATEGORY_META[entry.category]

  return (
    <div className="rounded-xl overflow-hidden transition-all duration-150"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>

      {/* Card header — always visible */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-start gap-3 p-4 text-left transition-colors"
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '' }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-bold text-slate-100">{entry.term}</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-500 italic">{entry.termFr}</span>
            <span
              className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{ color: meta.color, background: `${meta.color}12`, border: `1px solid ${meta.color}20` }}
            >
              {meta.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{entry.definition}</p>
        </div>
        <div className="flex-shrink-0 mt-0.5">
          {expanded
            ? <ChevronUp className="w-4 h-4 text-slate-500" />
            : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 flex flex-col gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>

          {/* FR definition */}
          <div className="pt-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">🇫🇷 Définition</div>
            <p className="text-xs text-slate-400 leading-relaxed">{entry.definitionFr}</p>
          </div>

          {/* Simple explanation */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Simple Explanation</div>
            <p className="text-xs leading-relaxed" style={{ color: '#93C5FD' }}>{entry.simpleExplanation}</p>
          </div>

          {/* Professional explanation */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Professional Context</div>
            <p className="text-xs text-slate-400 leading-relaxed">{entry.professionalExplanation}</p>
          </div>

          {/* Example */}
          <div className="rounded-lg p-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Example</div>
            <p className="text-xs text-slate-400 leading-relaxed">{entry.example}</p>
          </div>

          {/* Formula */}
          {entry.formula && (
            <div className="rounded-lg p-3"
              style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', fontFamily: 'var(--font-mono, monospace)' }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#60A5FA' }}>Formula</div>
              <p className="text-xs" style={{ color: '#93C5FD' }}>{entry.formula}</p>
            </div>
          )}

          {/* Interview angle */}
          {entry.interviewAngle && (
            <div className="rounded-lg p-3"
              style={{ background: 'rgba(250,204,21,0.06)', border: '1px solid rgba(250,204,21,0.15)' }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#FACC15' }}>
                🎯 Interview Angle
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{entry.interviewAngle}</p>
            </div>
          )}

          {/* Collocations */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Collocations</div>
            <div className="flex flex-wrap gap-1">
              {entry.collocations.map(c => (
                <span key={c} className="text-[10px] px-1.5 py-0.5 rounded"
                  style={{ color: 'rgba(148,163,184,0.7)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Related terms */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Related Terms</div>
            <div className="flex flex-wrap gap-1">
              {entry.relatedTerms.map(t => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded"
                  style={{ color: meta.color, background: `${meta.color}10`, border: `1px solid ${meta.color}20` }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

// ── Main dictionary page ──────────────────────────────────────────────────────

export function FinanceDictionary() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<FinanceCategory | 'all'>('all')

  const categories = useMemo<FinanceCategory[]>(() => {
    return [...new Set(FINANCE_DICTIONARY.map(e => e.category))] as FinanceCategory[]
  }, [])

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<FinanceCategory | 'all', number>> = { all: FINANCE_DICTIONARY.length }
    for (const cat of categories) {
      counts[cat] = FINANCE_DICTIONARY.filter(e => e.category === cat).length
    }
    return counts
  }, [categories])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return FINANCE_DICTIONARY.filter(entry => {
      const matchCat = activeCategory === 'all' || entry.category === activeCategory
      if (!matchCat) return false
      if (!q) return true
      return (
        entry.term.toLowerCase().includes(q) ||
        entry.termFr.toLowerCase().includes(q) ||
        entry.definition.toLowerCase().includes(q) ||
        entry.definitionFr.toLowerCase().includes(q) ||
        entry.collocations.some(c => c.toLowerCase().includes(q))
      )
    })
  }, [query, activeCategory])

  return (
    <div className="min-h-full px-6 py-8 max-w-4xl mx-auto" style={{ color: '#FAFAFA' }}>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">LEXORA Finance</div>
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Finance Dictionary</h1>
        <p className="text-sm text-slate-500">
          {FINANCE_DICTIONARY.length} bilingual terms — English definitions with French translations,
          professional context, examples, and interview angles.
        </p>
      </div>

      {/* ── SEARCH ──────────────────────────────────────────────────────────── */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search terms, definitions, collocations..."
          className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.10)',
          }}
          onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.40)' }}
          onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.10)' }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── CATEGORY FILTERS ────────────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-6">
        <CategoryPill
          category="all"
          active={activeCategory === 'all'}
          count={categoryCounts.all ?? 0}
          onClick={() => setActiveCategory('all')}
        />
        {categories.map(cat => (
          <CategoryPill
            key={cat}
            category={cat}
            active={activeCategory === cat}
            count={categoryCounts[cat] ?? 0}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>

      {/* ── RESULTS COUNT ───────────────────────────────────────────────────── */}
      <div className="mb-4 text-xs text-slate-600">
        {filtered.length} term{filtered.length !== 1 ? 's' : ''}
        {query && ` matching "${query}"`}
        {activeCategory !== 'all' && ` in ${CATEGORY_META[activeCategory].label}`}
      </div>

      {/* ── DICTIONARY CARDS ────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-2">
          {filtered.map(entry => <DictCard key={entry.id} entry={entry} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-3xl mb-3">🔍</div>
          <div className="text-sm font-semibold text-slate-400 mb-1">No results</div>
          <div className="text-xs text-slate-600">
            Try a different search term or clear the category filter
          </div>
        </div>
      )}

    </div>
  )
}
