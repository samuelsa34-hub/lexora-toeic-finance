import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, ChevronRight, ChevronDown, ChevronUp, Zap, CheckCircle, RotateCcw, Table, Star } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useRegistryStore } from '../../store/useRegistryStore'
import { CAT_LABELS } from '../../utils/constants'
import { englishGrammarQuestions } from '../../data/englishGrammarQuestions'
import type { QuestionCategory } from '../../types'
import {
  GRAMMAR_CONCEPTS,
  PRONOUN_TABLE,
  SENTENCE_STRUCTURE_TABLE,
  KEY_RULES,
  COMMON_PHRASAL_VERBS,
  COMMON_VERB_PREPOSITIONS,
  GROUP_LABELS,
  type GrammarConcept,
} from '../../data/grammarBasicsData'

// ── Constants ─────────────────────────────────────────────────────────────────

const EG_DRILL_CATEGORIES: QuestionCategory[] = [
  'tense_perfect', 'tense_continuous', 'conditionals', 'modal_verbs',
  'reported_speech', 'comparative', 'quantifiers', 'question_form',
  'time_clauses', 'agreement',
]

const LABEL_COLORS = {
  blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  violet: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  rose: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  slate: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
}

type Tab = 'learn' | 'drills' | 'review'

// ── Storage helpers ───────────────────────────────────────────────────────────

function loadReadConcepts(studentId: string | null): Set<string> {
  try {
    const key = `eg-basics-read-${studentId ?? 'default'}`
    const stored = localStorage.getItem(key)
    return new Set(JSON.parse(stored ?? '[]'))
  } catch { return new Set() }
}

function saveReadConcepts(studentId: string | null, set: Set<string>) {
  try {
    const key = `eg-basics-read-${studentId ?? 'default'}`
    localStorage.setItem(key, JSON.stringify([...set]))
  } catch { /* ignore */ }
}

// ── Mini-quiz state per concept ───────────────────────────────────────────────

interface QuizState {
  answers: (number | null)[]
  submitted: boolean[]
}

// ── ConceptCard ───────────────────────────────────────────────────────────────

interface ConceptCardProps {
  concept: GrammarConcept
  isRead: boolean
  onMarkRead: (id: string) => void
  logActivity: (opts: { type: string; label: string; meta?: object }) => void
}

function ConceptCard({ concept, isRead, onMarkRead, logActivity }: ConceptCardProps) {
  const [open, setOpen] = useState(false)
  const [quizState, setQuizState] = useState<QuizState>({
    answers: new Array(concept.quiz.length).fill(null),
    submitted: new Array(concept.quiz.length).fill(false),
  })

  const handleToggle = useCallback(() => {
    const next = !open
    setOpen(next)
    if (next) {
      logActivity({ type: 'topic_open', label: `Opened grammar concept: ${concept.title}`, meta: { category: concept.id } })
    }
  }, [open, concept, logActivity])

  const handleAnswer = (qIdx: number, aIdx: number) => {
    if (quizState.submitted[qIdx]) return
    setQuizState(prev => {
      const answers = [...prev.answers]; answers[qIdx] = aIdx
      const submitted = [...prev.submitted]; submitted[qIdx] = true
      return { answers, submitted }
    })
    // Mark concept as read on first correct answer
    if (aIdx === concept.quiz[qIdx].correct) {
      onMarkRead(concept.id)
    }
  }

  const allCorrect = quizState.submitted.every((s, i) => s && quizState.answers[i] === concept.quiz[i].correct)

  return (
    <div
      className="rounded-xl border transition-all duration-200 overflow-hidden"
      style={isRead
        ? { background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.22)' }
        : { background: 'var(--dp-surface)', borderColor: 'var(--dp-border-sm)' }
      }
    >
      {/* Card header */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        <span className="text-xl flex-shrink-0">{concept.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-white">{concept.title}</p>
            {isRead && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
          </div>
          <p className="text-[11px] text-zinc-500 leading-snug mt-0.5 line-clamp-1">{concept.definition}</p>
        </div>
        <span className="text-zinc-600 flex-shrink-0">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-4 pb-5 pt-4 space-y-5" style={{ borderTop: '1px solid var(--dp-border-sm)' }}>
          {/* Definition + role */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                Role: {concept.role}
              </span>
              {concept.position && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Position: {concept.position}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">{concept.explanation}</p>
          </div>

          {/* Examples */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Examples</p>
            <div className="space-y-3">
              {concept.examples.map((ex, i) => (
                <div key={i} className="bg-black/20 rounded-lg px-3 py-2.5">
                  {ex.parts ? (
                    <div className="flex flex-wrap items-baseline gap-1.5 mb-1.5">
                      {ex.parts.map((p, j) => (
                        <span key={j} className="inline-flex flex-col items-center gap-0.5">
                          <span className="text-sm font-semibold text-white">{p.text}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${LABEL_COLORS[p.color]}`}>
                            {p.label}
                          </span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white font-medium mb-1">{ex.sentence}</p>
                  )}
                  {ex.note && <p className="text-[11px] text-zinc-500 italic">{ex.note}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Common mistakes */}
          {concept.mistakes && concept.mistakes.length > 0 && (
            <div className="bg-red-950/20 border border-red-500/20 rounded-lg px-3 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-red-400 mb-2">⚠️ Common Mistakes</p>
              <ul className="space-y-1">
                {concept.mistakes.map((m, i) => (
                  <li key={i} className="text-[11px] text-zinc-400 leading-relaxed">{m}</li>
                ))}
              </ul>
            </div>
          )}

          {/* French note */}
          {concept.fr && (
            <div className="bg-blue-950/20 border border-blue-500/20 rounded-lg px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 mb-1">🇫🇷 French learner note</p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{concept.fr}</p>
            </div>
          )}

          {/* Mini quiz */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">Quick Check</p>
            <div className="space-y-4">
              {concept.quiz.map((q, qi) => {
                const answered = quizState.submitted[qi]
                const selected = quizState.answers[qi]
                return (
                  <div key={qi} className="space-y-2">
                    <p className="text-xs font-medium text-zinc-300">{q.q}</p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {q.opts.map((opt, oi) => {
                        let cls = 'text-left w-full px-3 py-2 rounded-lg text-xs border transition-all '
                        if (!answered) {
                          cls += 'bg-white/[0.04] border-white/10 text-zinc-400 hover:border-violet-500/40 hover:text-zinc-200'
                        } else if (oi === q.correct) {
                          cls += 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        } else if (oi === selected) {
                          cls += 'bg-red-950/30 border-red-500/40 text-red-300'
                        } else {
                          cls += 'bg-black/20 border-white/8 text-zinc-600 opacity-50'
                        }
                        return (
                          <button key={oi} className={cls} onClick={() => handleAnswer(qi, oi)} disabled={answered}>
                            <span className="font-bold mr-2 text-zinc-500">
                              {['A', 'B', 'C', 'D'][oi]}.
                            </span>
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                    {answered && (
                      <p className="text-[11px] text-zinc-500 italic leading-relaxed px-1">{q.exp}</p>
                    )}
                  </div>
                )
              })}
            </div>
            {allCorrect && !isRead && (
              <div className="mt-3 flex items-center gap-2 text-emerald-400 text-xs">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>All correct! Concept marked as reviewed.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── ReviewSheet ───────────────────────────────────────────────────────────────

function ReviewSheet() {
  return (
    <div className="space-y-8">
      {/* Pronoun table */}
      <section>
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Table className="w-4 h-4 text-violet-400" /> Complete Pronoun Table
        </h2>
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--dp-border-sm)' }}>
          <table className="w-full text-xs min-w-[500px]">
            <thead>
              <tr style={{ background: 'var(--dp-surface-warm)', borderBottom: '1px solid var(--dp-border-sm)' }}>
                {PRONOUN_TABLE.headers.map(h => (
                  <th key={h} className="px-3 py-2.5 text-left font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRONOUN_TABLE.rows.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'var(--dp-surface)' }}>
                  <td className="px-3 py-2 text-zinc-500 font-medium">{row[0]}</td>
                  <td className="px-3 py-2"><span className="text-blue-300 font-semibold">{row[1]}</span></td>
                  <td className="px-3 py-2"><span className="text-emerald-300 font-semibold">{row[2]}</span></td>
                  <td className="px-3 py-2"><span className="text-amber-300 font-semibold">{row[3]}</span></td>
                  <td className="px-3 py-2"><span className="text-violet-300 font-semibold">{row[4]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-3 mt-2 text-[10px]">
          <span className="text-blue-300">■ Subject pronouns</span>
          <span className="text-emerald-300">■ Object pronouns</span>
          <span className="text-amber-300">■ Possessive adjectives</span>
          <span className="text-violet-300">■ Possessive pronouns</span>
        </div>
      </section>

      {/* Sentence structure table */}
      <section>
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Table className="w-4 h-4 text-blue-400" /> Sentence Elements
        </h2>
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--dp-border-sm)' }}>
          <table className="w-full text-xs min-w-[480px]">
            <thead>
              <tr style={{ background: 'var(--dp-surface-warm)', borderBottom: '1px solid var(--dp-border-sm)' }}>
                {SENTENCE_STRUCTURE_TABLE.headers.map(h => (
                  <th key={h} className="px-3 py-2.5 text-left font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SENTENCE_STRUCTURE_TABLE.rows.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'var(--dp-surface)' }}>
                  {row.map((cell, j) => (
                    <td key={j} className={`px-3 py-2 ${j === 0 ? 'text-white font-semibold' : 'text-zinc-400'}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Key rules */}
      <section>
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400" /> Key Rules to Remember
        </h2>
        <div className="rounded-xl p-4 space-y-2" style={{ background: 'var(--dp-surface)', border: '1px solid var(--dp-border-sm)' }}>
          {KEY_RULES.map((rule, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="text-[10px] font-bold text-violet-400 mt-0.5 flex-shrink-0">{i + 1}.</span>
              <p className="text-xs text-zinc-300 leading-relaxed">{rule}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Phrasal verbs */}
      <section>
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <span className="text-base">🧩</span> Common Phrasal Verbs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {COMMON_PHRASAL_VERBS.map((pv, i) => (
            <div key={i} className="rounded-lg px-3 py-2.5" style={{ background: 'var(--dp-surface)', border: '1px solid var(--dp-border-sm)' }}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-bold text-violet-300">{pv.verb}</span>
                <span className="text-[10px] text-zinc-500 italic truncate">{pv.meaning}</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">"{pv.example}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Verb + prepositions */}
      <section>
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <span className="text-base">🔗</span> Common Verb + Preposition
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {COMMON_VERB_PREPOSITIONS.map((vp, i) => (
            <div key={i} className="rounded-lg px-3 py-2.5" style={{ background: 'var(--dp-surface)', border: '1px solid var(--dp-border-sm)' }}>
              <span className="text-sm font-bold text-blue-300">{vp.verb}</span>
              <p className="text-[11px] text-zinc-500 mt-0.5">"{vp.example}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Possessive comparison */}
      <section>
        <h2 className="text-sm font-bold text-white mb-3">Possessive Adjective vs Pronoun</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2">
              Possessive Adjective + noun
            </p>
            <div className="space-y-1.5 text-xs text-zinc-300">
              <p>This is <span className="text-amber-300 font-bold">my</span> book.</p>
              <p>That is <span className="text-amber-300 font-bold">your</span> phone.</p>
              <p>It is <span className="text-amber-300 font-bold">her</span> car.</p>
              <p>We lost <span className="text-amber-300 font-bold">our</span> keys.</p>
            </div>
          </div>
          <div className="bg-violet-950/20 border border-violet-500/20 rounded-xl p-4">
            <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-2">
              Possessive Pronoun (replaces noun)
            </p>
            <div className="space-y-1.5 text-xs text-zinc-300">
              <p>This book is <span className="text-violet-300 font-bold">mine</span>.</p>
              <p>That phone is <span className="text-violet-300 font-bold">yours</span>.</p>
              <p>That car is <span className="text-violet-300 font-bold">hers</span>.</p>
              <p>Those keys are <span className="text-violet-300 font-bold">ours</span>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subject vs Object pronoun */}
      <section>
        <h2 className="text-sm font-bold text-white mb-3">Subject Pronoun vs Object Pronoun</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-blue-950/20 border border-blue-500/20 rounded-xl p-4">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2">Subject → before verb</p>
            <div className="space-y-1.5 text-xs text-zinc-300">
              <p><span className="text-blue-300 font-bold">I</span> work every day.</p>
              <p><span className="text-blue-300 font-bold">She</span> studies hard.</p>
              <p><span className="text-blue-300 font-bold">They</span> play football.</p>
            </div>
          </div>
          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">Object → after verb / preposition</p>
            <div className="space-y-1.5 text-xs text-zinc-300">
              <p>He loves <span className="text-emerald-300 font-bold">me</span>.</p>
              <p>I see <span className="text-emerald-300 font-bold">her</span> every day.</p>
              <p>She talked to <span className="text-emerald-300 font-bold">them</span>.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// ── DrillsTab ─────────────────────────────────────────────────────────────────

function DrillsTab({ navigate, catStats, qCount }: {
  navigate: (path: string, opts?: object) => void
  catStats: Record<string, { pct: number; total: number; correct: number }>
  qCount: Record<string, number>
}) {
  const getMasteryColor = (pct: number) => {
    if (pct < 0) return 'bg-zinc-700'
    if (pct >= 90) return 'bg-emerald-500'
    if (pct >= 75) return 'bg-indigo-500'
    if (pct >= 55) return 'bg-amber-500'
    return 'bg-red-500'
  }
  const getMasteryLabel = (pct: number) => {
    if (pct < 0) return 'Not started'
    if (pct >= 90) return 'Mastered'
    if (pct >= 75) return 'Proficient'
    if (pct >= 55) return 'Developing'
    return 'Needs work'
  }

  const EG_ICONS: Record<string, string> = {
    tense_perfect: '⏳', tense_continuous: '🔄', conditionals: '🔀', modal_verbs: '🎛️',
    reported_speech: '💬', comparative: '⚖️', quantifiers: '🔢', question_form: '❓',
    time_clauses: '🕐', agreement: '🤝',
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate('/grammar', { state: { category: 'english_grammar' } })}
        className="w-full flex items-center justify-between px-5 py-4 bg-violet-600/20 border border-violet-500/30 rounded-xl hover:bg-violet-600/30 transition-all group"
      >
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-violet-400" />
          <div className="text-left">
            <p className="text-sm font-bold text-violet-300">Practice All Topics</p>
            <p className="text-xs text-zinc-500">
              Drill all {englishGrammarQuestions.length} questions in one adaptive session
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-violet-400 group-hover:translate-x-0.5 transition-transform" />
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EG_DRILL_CATEGORIES.map(cat => {
          const stats = catStats[cat] ?? { pct: -1, total: 0, correct: 0 }
          const hasPracticed = stats.total > 0

          return (
            <div key={cat} className="rounded-xl p-4 transition-all" style={{ background: 'var(--dp-surface)', border: '1px solid var(--dp-border-sm)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,92,246,0.35)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dp-border-sm)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{EG_ICONS[cat] ?? '📝'}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{CAT_LABELS[cat]}</p>
                    <p className="text-[11px] text-zinc-500">{qCount[cat] ?? 0} questions</p>
                  </div>
                </div>
                {hasPracticed && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    stats.pct >= 90 ? 'bg-emerald-500/20 text-emerald-400' :
                    stats.pct >= 75 ? 'bg-indigo-500/20 text-indigo-400' :
                    stats.pct >= 55 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {getMasteryLabel(stats.pct)}
                  </span>
                )}
              </div>

              <div className="h-1.5 bg-white/8 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getMasteryColor(stats.pct)}`}
                  style={{ width: hasPracticed ? `${stats.pct}%` : '0%' }}
                />
              </div>

              {hasPracticed && (
                <p className="text-[11px] text-zinc-600 mb-3">{stats.correct}/{stats.total} correct · {stats.pct}%</p>
              )}

              <button
                onClick={() => navigate('/grammar', { state: { category: cat } })}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-violet-600/10 border border-violet-500/20 text-violet-400 text-xs font-semibold hover:bg-violet-600/20 transition-all"
              >
                {hasPracticed ? 'Practice again' : 'Start drill'} <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function EnglishGrammarHub() {
  const navigate = useNavigate()
  const store = useAppStore()
  const registry = useRegistryStore()
  const studentId = registry.currentStudentId

  const [tab, setTab] = useState<Tab>('learn')

  const [readConcepts, setReadConcepts] = useState<Set<string>>(() =>
    loadReadConcepts(studentId)
  )

  const handleMarkRead = useCallback((id: string) => {
    setReadConcepts(prev => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      saveReadConcepts(studentId, next)
      store.logActivity({ type: 'lesson_complete', label: `Reviewed concept: ${id}`, meta: { lessonId: id } })
      return next
    })
  }, [studentId, store])

  const logActivity = useCallback((opts: { type: string; label: string; meta?: object }) => {
    store.logActivity(opts as Parameters<typeof store.logActivity>[0])
  }, [store])

  // Log that the hub was opened
  useEffect(() => {
    store.logActivity({ type: 'lesson_start', label: 'Opened English Grammar module' })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const catStats = useMemo(() => {
    const result: Record<string, { correct: number; total: number; pct: number }> = {}
    for (const cat of EG_DRILL_CATEGORIES) {
      let correct = 0; let total = 0
      for (const s of store.grammarSessions) {
        for (const a of s.attempts) {
          if (a.cat === cat) { total++; if (a.correct) correct++ }
        }
      }
      result[cat] = { correct, total, pct: total > 0 ? Math.round(correct / total * 100) : -1 }
    }
    return result
  }, [store.grammarSessions])

  const qCount = useMemo(() => {
    const map: Record<string, number> = {}
    for (const q of englishGrammarQuestions) {
      map[q.cat] = (map[q.cat] ?? 0) + 1
    }
    return map
  }, [])

  const totalConcepts = GRAMMAR_CONCEPTS.length
  const readCount = readConcepts.size
  const progressPct = Math.round((readCount / totalConcepts) * 100)

  // Group concepts
  const groupedConcepts = useMemo(() => {
    const groups: Record<GrammarConcept['group'], GrammarConcept[]> = {
      structure: [], 'parts-of-speech': [], pronouns: [], verbs: [],
    }
    for (const c of GRAMMAR_CONCEPTS) groups[c.group].push(c)
    return groups
  }, [])

  const TABS = [
    { id: 'learn' as Tab, label: 'Learn', icon: '📖' },
    { id: 'drills' as Tab, label: 'Drills', icon: '⚡' },
    { id: 'review' as Tab, label: 'Review Sheet', icon: '📋' },
  ]

  return (
    <div className="min-h-screen bg-black/20 text-white p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">English Grammar</h1>
            <p className="text-xs text-zinc-500">
              {totalConcepts} concepts · {englishGrammarQuestions.length} drill questions
            </p>
          </div>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Build a solid foundation: sentence structure, parts of speech, pronouns, possessives, and verbs.
        </p>
      </div>

      {/* Progress bar */}
      {readCount > 0 && (
        <div className="mb-5 rounded-xl p-3.5" style={{ background: 'var(--dp-surface)', border: '1px solid var(--dp-border-sm)' }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-zinc-400">Concepts reviewed</span>
            <span className="text-sm font-bold text-violet-400">{readCount} / {totalConcepts}</span>
          </div>
          <div className="h-2 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl p-1 mb-5" style={{ background: 'var(--dp-surface)', border: '1px solid var(--dp-border-sm)' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              tab === t.id
                ? 'bg-violet-600/20 text-violet-300 border border-violet-500/20'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'learn' && (
        <div className="space-y-6">
          {(Object.entries(groupedConcepts) as [GrammarConcept['group'], GrammarConcept[]][]).map(
            ([group, concepts]) => (
              <section key={group}>
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
                  <span className="flex-1">{GROUP_LABELS[group]}</span>
                  <span className="text-[10px] text-zinc-600 font-normal normal-case">
                    {concepts.filter(c => readConcepts.has(c.id)).length}/{concepts.length} reviewed
                  </span>
                </h2>
                <div className="space-y-2">
                  {concepts.map(concept => (
                    <ConceptCard
                      key={concept.id}
                      concept={concept}
                      isRead={readConcepts.has(concept.id)}
                      onMarkRead={handleMarkRead}
                      logActivity={logActivity}
                    />
                  ))}
                </div>
              </section>
            )
          )}

          {readCount === totalConcepts && (
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 text-center">
              <p className="text-emerald-400 font-bold text-sm">🎉 All concepts reviewed!</p>
              <p className="text-xs text-zinc-500 mt-1">
                Head to the Drills tab to practice with real questions.
              </p>
              <button
                onClick={() => setTab('drills')}
                className="mt-3 px-4 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-600/30 transition-all"
              >
                Go to Drills →
              </button>
            </div>
          )}

          {readCount > 0 && readCount < totalConcepts && (
            <button
              onClick={() => {
                const next = GRAMMAR_CONCEPTS.find(c => !readConcepts.has(c.id))
                if (next) {
                  document.getElementById(`concept-${next.id}`)?.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-zinc-500 text-xs hover:text-zinc-300 transition-all"
              style={{ background: 'var(--dp-surface)', border: '1px solid var(--dp-border-sm)' }}
            >
              <RotateCcw className="w-3 h-3" />
              Continue where you left off
            </button>
          )}
        </div>
      )}

      {tab === 'drills' && (
        <DrillsTab navigate={navigate} catStats={catStats} qCount={qCount} />
      )}

      {tab === 'review' && <ReviewSheet />}
    </div>
  )
}
