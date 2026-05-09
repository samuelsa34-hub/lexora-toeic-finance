import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, CheckCircle, XCircle, Zap, ArrowRight, RotateCcw } from 'lucide-react'
import { COLLOCATION_CATEGORIES } from '../../data/collocations'
import type { CollocationCategory, CollocationEntry } from '../../data/collocations'
import { useAppStore } from '../../store/useAppStore'

// ── Sub-components ─────────────────────────────────────────────────────────────

const CollocPill: React.FC<{ expression: string; fr: string; example: string; note?: string }> = ({
  expression, fr, example, note,
}) => {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-xl cursor-pointer transition-all duration-150"
      style={{
        background: open ? 'rgba(99,102,241,0.10)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${open ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.07)'}`,
        padding: '10px 14px',
      }}
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-200">{expression}</span>
        <span className="text-[11px] text-slate-500 flex-shrink-0">{open ? '▲' : '▼'}</span>
      </div>
      <div className="text-[11px] text-slate-500 mt-0.5">{fr}</div>
      {open && (
        <div className="mt-2 space-y-1.5 text-xs">
          <div className="italic text-slate-400">"{example}"</div>
          {note && (
            <div className="rounded-lg px-2.5 py-1.5 text-amber-300"
              style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)' }}>
              ⚡ {note}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const EntryCard: React.FC<{ entry: CollocationEntry; color: string }> = ({ entry, color }) => (
  <div className="rounded-2xl overflow-hidden"
    style={{ background: 'var(--dp-surface)', border: '1px solid var(--dp-border-sm)' }}>
    <div className="flex items-center gap-3 px-4 py-3"
      style={{ background: `${color}18`, borderBottom: '1px solid var(--dp-border-sm)' }}>
      <span className="text-xl">{entry.icon}</span>
      <div>
        <div className="text-sm font-bold text-slate-200">{entry.noun}</div>
        <div className="text-[11px] text-slate-500">{entry.nounFr}</div>
      </div>
    </div>
    <div className="p-3 space-y-2">
      {entry.pairs.map((pair, i) => (
        <CollocPill
          key={i}
          expression={pair.expression}
          fr={pair.expressionFr}
          example={pair.example}
          note={pair.note}
        />
      ))}
    </div>
  </div>
)

// ── Quick Quiz ─────────────────────────────────────────────────────────────────

const QuickQuiz: React.FC<{ cat: CollocationCategory; onPractice: () => void }> = ({ cat, onPractice }) => {
  const addWordFlashcard = useAppStore(s => s.addWordFlashcard)
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const [score, setScore] = useState(0)

  const q = cat.quiz[idx]
  const isCorrect = selected === q.correct

  const handleSelect = (i: number) => {
    if (selected !== null) return
    setSelected(i)
    if (i === q.correct) setScore(s => s + 1)
  }

  const handleNext = () => {
    if (idx + 1 >= cat.quiz.length) {
      setDone(true)
    } else {
      setIdx(i => i + 1)
      setSelected(null)
    }
  }

  const handleReset = () => {
    setIdx(0)
    setSelected(null)
    setDone(false)
    setScore(0)
  }

  const handleAddFlashcard = useCallback(() => {
    const cq = cat.quiz[idx]
    addWordFlashcard(
      cq.opts[cq.correct],
      `Choose the right collocation: ${cq.q}`,
      `${cq.opts[cq.correct]} — ${cq.exp}`,
    )
  }, [cat, idx, addWordFlashcard])

  if (done) {
    const pct = Math.round((score / cat.quiz.length) * 100)
    return (
      <div className="rounded-2xl p-6 text-center space-y-4"
        style={{ background: 'var(--dp-surface)', border: '1px solid var(--dp-border-sm)' }}>
        <div className="text-3xl font-bold" style={{ color: pct >= 80 ? '#34D399' : pct >= 60 ? '#FBBF24' : '#F87171' }}>
          {pct}%
        </div>
        <div className="text-slate-400 text-sm">{score} / {cat.quiz.length} correct</div>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <RotateCcw className="w-3.5 h-3.5" /> Retry
          </button>
          <button onClick={onPractice}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', border: '1px solid rgba(99,102,241,0.4)' }}>
            <Zap className="w-3.5 h-3.5" /> Practice Part 5
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--dp-surface)', border: '1px solid var(--dp-border-sm)' }}>
      {/* Progress */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          Question {idx + 1} / {cat.quiz.length}
        </span>
        <span className="text-xs font-semibold text-indigo-400">{score} correct</span>
      </div>
      <div className="h-1 mx-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all duration-300"
          style={{ width: `${((idx) / cat.quiz.length) * 100}%`, background: 'linear-gradient(90deg,#6366F1,#8B5CF6)' }} />
      </div>

      {/* Question */}
      <div className="px-4 py-4">
        <p className="text-sm text-slate-200 font-medium mb-3 leading-relaxed">{q.q}</p>
        <div className="grid grid-cols-1 gap-2">
          {q.opts.map((opt, i) => {
            let bg = 'rgba(255,255,255,0.04)'
            let border = 'rgba(255,255,255,0.08)'
            let textColor = '#94A3B8'
            if (selected !== null) {
              if (i === q.correct) { bg = 'rgba(52,211,153,0.12)'; border = 'rgba(52,211,153,0.30)'; textColor = '#34D399' }
              else if (i === selected) { bg = 'rgba(248,113,113,0.12)'; border = 'rgba(248,113,113,0.30)'; textColor = '#F87171' }
            } else if (selected === null) {
              // hover handled by inline
            }
            return (
              <button key={i} onClick={() => handleSelect(i)}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 flex items-center gap-2"
                style={{ background: bg, border: `1px solid ${border}`, color: textColor, cursor: selected !== null ? 'default' : 'pointer' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)' }}>
                  {['A','B','C','D'][i]}
                </span>
                {opt}
                {selected !== null && i === q.correct && <CheckCircle className="w-4 h-4 ml-auto flex-shrink-0" />}
                {selected !== null && i === selected && i !== q.correct && <XCircle className="w-4 h-4 ml-auto flex-shrink-0" />}
              </button>
            )
          })}
        </div>

        {selected !== null && (
          <div className="mt-3 space-y-2">
            <div className="rounded-xl px-3 py-2.5 text-xs leading-relaxed"
              style={{
                background: isCorrect ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
                border: `1px solid ${isCorrect ? 'rgba(52,211,153,0.20)' : 'rgba(248,113,113,0.20)'}`,
                color: '#CBD5E1',
              }}>
              {q.exp}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleAddFlashcard}
                className="text-xs px-3 py-1.5 rounded-lg text-slate-300 transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                + Flashcard
              </button>
              <button onClick={handleNext}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium text-white ml-auto"
                style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}>
                {idx + 1 < cat.quiz.length ? 'Next' : 'Finish'} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

const TAB_IDS = COLLOCATION_CATEGORIES.map(c => c.id)

export default function CollocationStudio() {
  const navigate = useNavigate()
  const [activeCat, setActiveCat] = useState(TAB_IDS[0])
  const [view, setView] = useState<'tables' | 'quiz'>('tables')

  const cat = COLLOCATION_CATEGORIES.find(c => c.id === activeCat)!

  const handlePracticePart5 = () => {
    navigate('/grammar', { state: { mode: 'topic', cat: 'collocation' } })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', boxShadow: '0 0 24px rgba(99,102,241,0.35)' }}>
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-slate-100 leading-tight">Collocation Studio</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Master natural verb + noun combinations that appear on TOEIC Part 5.
          </p>
        </div>
        <button
          onClick={handlePracticePart5}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', border: '1px solid rgba(99,102,241,0.4)' }}>
          <Zap className="w-3.5 h-3.5" /> Part 5
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {COLLOCATION_CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => { setActiveCat(c.id); setView('tables') }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium flex-shrink-0 transition-all duration-150"
            style={{
              background: activeCat === c.id ? `${c.color}22` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeCat === c.id ? `${c.color}55` : 'rgba(255,255,255,0.07)'}`,
              color: activeCat === c.id ? c.color : '#94A3B8',
            }}
          >
            <span>{c.icon}</span>
            {c.label}
          </button>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-600 uppercase tracking-widest font-semibold mr-1">{cat.label}</span>
        <div className="flex rounded-xl overflow-hidden ml-auto"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          {(['tables', 'quiz'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className="px-3.5 py-1.5 text-xs font-medium transition-all duration-150"
              style={{
                background: view === v ? 'rgba(99,102,241,0.18)' : 'transparent',
                color: view === v ? '#A5B4FC' : '#64748B',
              }}>
              {v === 'tables' ? '📋 Collocations' : '🎯 Quick Quiz'}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 -mt-2">{cat.description}</p>

      {/* Content */}
      {view === 'tables' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cat.entries.map((entry, i) => (
              <EntryCard key={i} entry={entry} color={cat.color} />
            ))}
          </div>

          {/* CTA strip */}
          <div className="rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-center gap-3"
            style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-200">Test yourself</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Try the quick quiz, then drill these collocations in Part 5.
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setView('quiz')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
                Quick Quiz
              </button>
              <button onClick={handlePracticePart5}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', border: '1px solid rgba(99,102,241,0.4)' }}>
                <ArrowRight className="w-3.5 h-3.5" /> Part 5 Drill
              </button>
            </div>
          </div>
        </div>
      ) : (
        <QuickQuiz cat={cat} onPractice={handlePracticePart5} />
      )}

    </div>
  )
}
