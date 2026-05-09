import React, { useState, useMemo } from 'react'
import { Search, BookOpen, CheckCircle2, RefreshCw, TriangleAlert, Info, ChevronDown, ChevronUp, Layers, Plus } from 'lucide-react'
import { nativeExpressions, ameBrEVocab, CAT_CONFIG, type ExpressionCategory, type NativeExpression } from '../../data/nativeExpressions'
import { useAppStore } from '../../store/useAppStore'

const ALL_CATS: (ExpressionCategory | 'all')[] = [
  'all', 'meetings', 'workplace', 'emails', 'scheduling',
  'customer_service', 'time_deadlines', 'finance', 'communication', 'travel', 'negotiations',
]

type Mode = 'browse' | 'quiz' | 'ame_bre'
type DiffFilter = 'all' | 'easy' | 'medium' | 'hard'

export default function NativeExpressions() {
  const { expressionProgress, rateExpression, addWordFlashcard } = useAppStore()
  const [cat, setCat]           = useState<ExpressionCategory | 'all'>('all')
  const [mode, setMode]         = useState<Mode>('browse')
  const [search, setSearch]     = useState('')
  const [diff, setDiff]         = useState<DiffFilter>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [flashAdded, setFlashAdded] = useState<Set<string>>(new Set())

  const knownCount = useMemo(
    () => Object.values(expressionProgress).filter(v => v === 'known').length,
    [expressionProgress],
  )

  const filtered = useMemo(() => {
    let items = nativeExpressions
    if (cat !== 'all') items = items.filter(e => e.category === cat)
    if (diff !== 'all') items = items.filter(e => e.difficulty === diff)
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(e =>
        e.expression.toLowerCase().includes(q) ||
        e.meaning.toLowerCase().includes(q) ||
        e.example.toLowerCase().includes(q),
      )
    }
    return items
  }, [cat, diff, search])

  const quizItems = useMemo(
    () => filtered.filter(e => expressionProgress[e.id] !== 'known'),
    [filtered, expressionProgress],
  )

  const handleRate = (id: string, status: 'known' | 'learning') => {
    rateExpression(id, status)
  }

  const handleAddFlashcard = (expr: NativeExpression) => {
    addWordFlashcard(
      expr.expression,
      expr.expression,
      expr.fr ? `${expr.meaning}\n\n🇫🇷 ${expr.fr}` : expr.meaning,
      expr.example,
    )
    setFlashAdded(prev => new Set([...prev, expr.id]))
  }

  const handleQuizRate = (id: string, status: 'known' | 'learning') => {
    rateExpression(id, status)
    setRevealed(false)
    setQuizIndex(i => Math.min(i + 1, quizItems.length - 1))
  }

  const progressPct = nativeExpressions.length > 0
    ? Math.round((knownCount / nativeExpressions.length) * 100)
    : 0

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-5xl mx-auto pb-24 sm:pb-8">

      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white">Native Expressions</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {nativeExpressions.length} TOEIC-safe expressions · workplace, emails, travel &amp; more
            </p>
          </div>
          {/* Mode toggle */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {([
              { id: 'browse',  label: 'Browse' },
              { id: 'quiz',    label: 'Quiz' },
              { id: 'ame_bre', label: 'AmE / BrE' },
            ] as { id: Mode; label: string }[]).map(({ id, label }) => (
              <button key={id} onClick={() => { setMode(id); setQuizIndex(0); setRevealed(false) }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={mode === id
                  ? { background: 'rgba(56,189,248,0.18)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.28)' }
                  : { color: '#64748B', border: '1px solid transparent' }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 rounded-xl p-3.5" style={{ background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.15)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mastery Progress</span>
            <span className="text-sm font-bold" style={{ color: '#38BDF8' }}>{knownCount} / {nativeExpressions.length} known · {progressPct}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #5B8BF5, #38BDF8)' }} />
          </div>
        </div>
      </div>

      {/* ── AmE / BrE Table ── */}
      {mode === 'ame_bre' && (
        <AmeBrETable />
      )}

      {/* ── Browse + Quiz: shared filters ── */}
      {mode !== 'ame_bre' && (
        <>
          {/* Category tabs */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            {ALL_CATS.map(c => {
              const cfg = c === 'all' ? null : CAT_CONFIG[c]
              const isActive = cat === c
              const count = c === 'all'
                ? nativeExpressions.length
                : nativeExpressions.filter(e => e.category === c).length
              return (
                <button key={c} onClick={() => { setCat(c); setQuizIndex(0); setRevealed(false) }}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                  style={isActive
                    ? { background: cfg?.bg ?? 'rgba(255,255,255,0.10)', color: cfg?.color ?? '#fff', border: `1px solid ${cfg?.color ?? '#fff'}40` }
                    : { background: 'rgba(255,255,255,0.04)', color: '#475569', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {c === 'all' ? `All (${count})` : `${cfg!.label} (${count})`}
                </button>
              )
            })}
          </div>

          {/* Search + filter toggle */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search expressions, meanings…"
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-600 outline-none focus:border-sky-500/40"
              />
            </div>
            <button onClick={() => setShowFilters(f => !f)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748B' }}>
              <Layers className="w-3.5 h-3.5" />
              {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {showFilters && (
            <div className="flex gap-2 mb-4 flex-wrap">
              <span className="text-xs text-slate-600 self-center">Level:</span>
              {(['all', 'easy', 'medium', 'hard'] as DiffFilter[]).map(d => (
                <button key={d} onClick={() => setDiff(d)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold transition-all capitalize"
                  style={diff === d
                    ? { background: 'rgba(56,189,248,0.15)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.30)' }
                    : { background: 'rgba(255,255,255,0.04)', color: '#475569', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {d}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── BROWSE MODE ── */}
      {mode === 'browse' && (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-600">No expressions match your filters.</div>
          )}
          {filtered.map(expr => (
            <ExpressionCard
              key={expr.id}
              expr={expr}
              status={expressionProgress[expr.id]}
              onRate={status => handleRate(expr.id, status)}
              onAddFlashcard={() => handleAddFlashcard(expr)}
              flashAdded={flashAdded.has(expr.id)}
            />
          ))}
        </div>
      )}

      {/* ── QUIZ MODE ── */}
      {mode === 'quiz' && (
        <QuizMode
          items={quizItems}
          index={quizIndex}
          revealed={revealed}
          onReveal={() => setRevealed(true)}
          onNext={() => { setRevealed(false); setQuizIndex(i => Math.min(i + 1, quizItems.length - 1)) }}
          onPrev={() => { setRevealed(false); setQuizIndex(i => Math.max(i - 1, 0)) }}
          onRate={handleQuizRate}
          totalKnown={knownCount}
          total={nativeExpressions.length}
          onReset={() => { setQuizIndex(0); setRevealed(false) }}
        />
      )}
    </div>
  )
}

// ── Expression Card ────────────────────────────────────────────────────────────

interface CardProps {
  expr: NativeExpression
  status?: 'known' | 'learning'
  onRate: (s: 'known' | 'learning') => void
  onAddFlashcard: () => void
  flashAdded: boolean
}

function ExpressionCard({ expr, status, onRate, onAddFlashcard, flashAdded }: CardProps) {
  const [expanded, setExpanded] = useState(false)
  const cfg = CAT_CONFIG[expr.category]
  const isKnown = status === 'known'

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${isKnown ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}`,
      }}>

      {/* Header row — always visible */}
      <div className="flex items-start gap-3 p-4 cursor-pointer select-none" onClick={() => setExpanded(e => !e)}>
        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: cfg.color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold text-white">{expr.expression}</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wider"
              style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
            {expr.origin !== 'both' && (
              <span className="text-[10px] text-slate-600 uppercase tracking-wider">
                {expr.origin === 'american' ? '🇺🇸 AmE' : '🇬🇧 BrE'}
              </span>
            )}
            <DiffBadge diff={expr.difficulty} />
          </div>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed">{expr.meaning}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isKnown && <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} />}
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          {/* Example */}
          <div className="pt-3">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Example</p>
            <p className="text-sm text-slate-300 italic leading-relaxed">&ldquo;{expr.example}&rdquo;</p>
          </div>

          {/* TOEIC note */}
          {expr.toeicNote && (
            <div className="flex gap-2.5 rounded-xl p-3" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)' }}>
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#818CF8' }} />
              <p className="text-xs text-slate-400 leading-relaxed">{expr.toeicNote}</p>
            </div>
          )}

          {/* Warning */}
          {expr.warningNote && (
            <div className="flex gap-2.5 rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.22)' }}>
              <TriangleAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
              <p className="text-xs text-slate-400 leading-relaxed">{expr.warningNote}</p>
            </div>
          )}

          {/* French */}
          {expr.fr && (
            <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">🇫🇷 Traduction</p>
              <p className="text-xs text-slate-500 leading-relaxed">{expr.fr}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1 flex-wrap">
            <button onClick={() => onRate('known')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex-1 justify-center"
              style={status === 'known'
                ? { background: 'rgba(16,185,129,0.18)', color: '#10B981', border: '1px solid rgba(16,185,129,0.35)' }
                : { background: 'rgba(255,255,255,0.04)', color: '#64748B', border: '1px solid rgba(255,255,255,0.08)' }}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Know it
            </button>
            <button onClick={() => onRate('learning')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex-1 justify-center"
              style={status === 'learning'
                ? { background: 'rgba(56,189,248,0.18)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.35)' }
                : { background: 'rgba(255,255,255,0.04)', color: '#64748B', border: '1px solid rgba(255,255,255,0.08)' }}>
              <BookOpen className="w-3.5 h-3.5" /> Still learning
            </button>
            <button onClick={onAddFlashcard}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={flashAdded
                ? { background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.30)' }
                : { background: 'rgba(255,255,255,0.04)', color: '#64748B', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Plus className="w-3.5 h-3.5" />
              {flashAdded ? 'Added' : 'Flashcard'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Quiz Mode ──────────────────────────────────────────────────────────────────

interface QuizProps {
  items: NativeExpression[]
  index: number
  revealed: boolean
  onReveal: () => void
  onNext: () => void
  onPrev: () => void
  onRate: (id: string, status: 'known' | 'learning') => void
  totalKnown: number
  total: number
  onReset: () => void
}

function QuizMode({ items, index, revealed, onReveal, onNext, onPrev, onRate, totalKnown, total, onReset }: QuizProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <div className="text-5xl">🎉</div>
        <div className="text-center">
          <p className="text-xl font-bold text-white mb-2">All caught up!</p>
          <p className="text-slate-500 text-sm">{totalKnown} / {total} expressions marked as known.</p>
        </div>
        <button onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'rgba(56,189,248,0.15)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.30)' }}>
          <RefreshCw className="w-4 h-4" /> Review all again
        </button>
      </div>
    )
  }

  const expr = items[Math.min(index, items.length - 1)]
  const cfg = CAT_CONFIG[expr.category]

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-3 text-xs text-slate-600">
        <span>{index + 1} of {items.length} remaining</span>
        <span style={{ color: '#38BDF8' }}>{totalKnown} / {total} known</span>
      </div>
      <div className="h-1 rounded-full mb-5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all"
          style={{ width: `${(index / items.length) * 100}%`, background: 'linear-gradient(90deg, #5B8BF5, #38BDF8)' }} />
      </div>

      {/* Card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)' }}>
        {/* Expression face */}
        <div className="p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider"
              style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
            {expr.origin !== 'both' && (
              <span className="text-xs text-slate-600">{expr.origin === 'american' ? '🇺🇸' : '🇬🇧'}</span>
            )}
            <DiffBadge diff={expr.difficulty} />
          </div>
          <h2 className="text-2xl font-bold text-white leading-snug">{expr.expression}</h2>
          {!revealed && <p className="text-slate-600 text-sm mt-4 italic">What does this expression mean?</p>}
        </div>

        {/* Answer */}
        {!revealed ? (
          <div className="px-6 pb-6">
            <button onClick={onReveal}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(56,189,248,0.12)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.28)' }}>
              Reveal Answer
            </button>
          </div>
        ) : (
          <div className="border-t px-6 pb-6 pt-4 space-y-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <p className="text-slate-200 text-sm font-medium leading-relaxed">{expr.meaning}</p>
            <p className="text-slate-400 text-sm italic leading-relaxed">&ldquo;{expr.example}&rdquo;</p>
            {expr.warningNote && (
              <div className="flex gap-2 rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.22)' }}>
                <TriangleAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
                <p className="text-xs text-slate-400">{expr.warningNote}</p>
              </div>
            )}
            {expr.fr && <p className="text-xs text-slate-600 italic">🇫🇷 {expr.fr}</p>}
            <div className="flex gap-2 pt-1">
              <button onClick={() => onRate(expr.id, 'learning')}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(239,68,68,0.10)', color: '#F87171', border: '1px solid rgba(239,68,68,0.25)' }}>
                Still learning
              </button>
              <button onClick={() => onRate(expr.id, 'known')}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.28)' }}>
                Got it ✓
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-2 mt-4">
        <button onClick={onPrev} disabled={index === 0}
          className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-30"
          style={{ background: 'rgba(255,255,255,0.04)', color: '#64748B', border: '1px solid rgba(255,255,255,0.07)' }}>
          ← Prev
        </button>
        <button onClick={onNext} disabled={index >= items.length - 1}
          className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-30 ml-auto"
          style={{ background: 'rgba(255,255,255,0.04)', color: '#64748B', border: '1px solid rgba(255,255,255,0.07)' }}>
          Skip →
        </button>
      </div>
    </div>
  )
}

// ── AmE / BrE Comparison Table ────────────────────────────────────────────────

function AmeBrETable() {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-white mb-1">American vs British Vocabulary</h2>
        <p className="text-slate-400 text-sm">
          These differences appear in TOEIC Reading and Listening — both variants are used across the exam.
        </p>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Header */}
        <div className="grid grid-cols-4 gap-0 px-4 py-3"
          style={{ background: 'rgba(56,189,248,0.08)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {['🇺🇸 American', '🇬🇧 British', '🇫🇷 Français', 'TOEIC Context'].map(h => (
            <span key={h} className="text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</span>
          ))}
        </div>
        {/* Rows */}
        {ameBrEVocab.map((row, i) => (
          <div key={i} className="grid grid-cols-4 gap-0 px-4 py-3"
            style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', borderBottom: i < ameBrEVocab.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
            <span className="text-sm font-semibold" style={{ color: '#60A5FA' }}>{row.american}</span>
            <span className="text-sm font-semibold" style={{ color: '#34D399' }}>{row.british}</span>
            <span className="text-sm text-slate-400">{row.fr}</span>
            <span className="text-xs text-slate-600 self-center capitalize">{row.context}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-600 mt-3 text-center">
        TOEIC uses both American and British English — both sets of vocabulary are equally testable.
      </p>
    </div>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function DiffBadge({ diff }: { diff: 'easy' | 'medium' | 'hard' }) {
  const color = diff === 'easy' ? '#10B981' : diff === 'medium' ? '#F59E0B' : '#EF4444'
  const bg    = diff === 'easy' ? 'rgba(16,185,129,0.12)' : diff === 'medium' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)'
  return (
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
      style={{ color, background: bg }}>{diff}</span>
  )
}
