import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Scan, ChevronRight, RotateCcw, Trophy, Target, BookOpen, TrendingUp, X, Lightbulb } from 'lucide-react'
import { sentenceItems, ROLE_META, type SentenceItem, type GrammarRole } from '../../data/sentenceAnalysis'
import { useAppStore } from '../../store/useAppStore'

// ── Types ─────────────────────────────────────────────────────────────────────

type Screen = 'setup' | 'drill' | 'results'

type TokenState = 'idle' | 'correct' | 'wrong' | 'missed'

interface DrillItem extends SentenceItem {
  shuffleIndex: number
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ROLES_ALL = Object.keys(ROLE_META) as GrammarRole[]

const FILTER_GROUPS: { label: string; roles: GrammarRole[] }[] = [
  { label: 'All roles', roles: ROLES_ALL },
  { label: 'Parts of Speech', roles: ['verb', 'noun', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction'] },
  { label: 'Sentence Roles', roles: ['subject_noun', 'object_noun', 'complement'] },
  { label: 'Verb Types', roles: ['verb', 'auxiliary', 'modal'] },
  { label: 'TOEIC Focus', roles: ['adjective', 'adverb', 'complement', 'modal', 'auxiliary'] },
]

const DIFFICULTIES = ['all', 'beginner', 'intermediate', 'advanced'] as const
type DiffFilter = typeof DIFFICULTIES[number]

// ── Helpers ───────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getPct(n: number, d: number) {
  return d === 0 ? 0 : Math.round((n / d) * 100)
}

// ── Token Chip ────────────────────────────────────────────────────────────────

interface TokenChipProps {
  word: string
  index: number
  state: TokenState
  answered: boolean
  targetRole: GrammarRole
  onClick: (i: number) => void
}

function TokenChip({ word, index, state, answered, targetRole, onClick }: TokenChipProps) {
  const meta = ROLE_META[targetRole]

  const styles: Record<TokenState, React.CSSProperties> = {
    idle: {
      background: 'var(--dp-surface2)',
      color: 'var(--dp-text-1)',
      border: '1.5px solid var(--dp-border-sm)',
      transform: 'scale(1)',
      cursor: answered ? 'default' : 'pointer',
    },
    correct: {
      background: `${meta.color}20`,
      color: meta.color,
      border: `1.5px solid ${meta.color}60`,
      transform: 'scale(1.06)',
      cursor: 'default',
      fontWeight: 700,
    },
    wrong: {
      background: 'rgba(244,63,94,0.15)',
      color: '#F43F5E',
      border: '1.5px solid rgba(244,63,94,0.5)',
      transform: 'scale(1)',
      cursor: 'default',
      textDecoration: 'line-through',
    },
    missed: {
      background: `${meta.color}18`,
      color: meta.color,
      border: `1.5px dashed ${meta.color}70`,
      transform: 'scale(1)',
      cursor: 'default',
      fontWeight: 700,
    },
  }

  return (
    <button
      onClick={() => !answered && onClick(index)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 14px',
        borderRadius: 10,
        fontSize: 15,
        lineHeight: 1.3,
        fontFamily: 'inherit',
        transition: 'all 0.18s ease',
        outline: 'none',
        ...styles[state],
      }}
    >
      {word}
    </button>
  )
}

// ── Explanation Panel ─────────────────────────────────────────────────────────

interface ExplanationPanelProps {
  item: SentenceItem
  wasCorrect: boolean
  showFr: boolean
  onNext: () => void
  isLast: boolean
}

function ExplanationPanel({ item, wasCorrect, showFr, onNext, isLast }: ExplanationPanelProps) {
  const meta = ROLE_META[item.targetRole]

  return (
    <div
      style={{
        marginTop: 24,
        borderRadius: 16,
        overflow: 'hidden',
        border: wasCorrect ? `1px solid ${meta.color}30` : '1px solid rgba(244,63,94,0.25)',
        animation: 'fadeSlideIn 0.22s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: wasCorrect ? `${meta.color}12` : 'rgba(244,63,94,0.08)',
          borderBottom: wasCorrect ? `1px solid ${meta.color}20` : '1px solid rgba(244,63,94,0.15)',
        }}
      >
        <span style={{ fontSize: 18 }}>{wasCorrect ? '✓' : '✗'}</span>
        <span style={{ fontWeight: 700, fontSize: 14, color: wasCorrect ? meta.color : '#F43F5E' }}>
          {wasCorrect ? 'Correct!' : 'Not quite'}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--dp-text-3)' }}>
          {meta.glyph} {meta.label}
        </span>
      </div>

      {/* Explanation */}
      <div style={{ padding: '14px 18px', background: 'var(--dp-surface)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--dp-text-2)', margin: 0 }}>
          {item.explanation}
        </p>
        {showFr && item.explanationFr && (
          <p style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--dp-text-3)', margin: 0, fontStyle: 'italic' }}>
            🇫🇷 {item.explanationFr}
          </p>
        )}
        {item.rule && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              padding: '10px 12px',
              borderRadius: 10,
              background: `${meta.color}09`,
              border: `1px solid ${meta.color}20`,
            }}
          >
            <Lightbulb size={14} style={{ color: meta.color, flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--dp-text-2)', margin: 0 }}>
              {item.rule}
            </p>
          </div>
        )}
      </div>

      {/* Next button */}
      <div style={{ padding: '10px 18px 14px', background: 'var(--dp-surface)', borderTop: '1px solid var(--dp-border-xs)' }}>
        <button
          onClick={onNext}
          style={{
            width: '100%',
            padding: '11px 0',
            borderRadius: 10,
            border: 'none',
            background: meta.color,
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          {isLast ? 'See Results' : 'Next sentence'} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

// ── Setup Screen ──────────────────────────────────────────────────────────────

interface SetupScreenProps {
  filterGroup: number
  diffFilter: DiffFilter
  sessionSize: number
  stats: { attempts: number; correct: number; byRole: Record<string, { attempts: number; correct: number }> }
  onSetFilterGroup: (i: number) => void
  onSetDiff: (d: DiffFilter) => void
  onSetSize: (n: number) => void
  onStart: () => void
  showFr: boolean
}

function SetupScreen({ filterGroup, diffFilter, sessionSize, stats, onSetFilterGroup, onSetDiff, onSetSize, onStart, showFr }: SetupScreenProps) {
  const globalPct = getPct(stats.correct, stats.attempts)

  const roleRows = Object.entries(ROLE_META).map(([role, meta]) => {
    const s = stats.byRole[role]
    return { role: role as GrammarRole, meta, attempts: s?.attempts ?? 0, correct: s?.correct ?? 0 }
  }).filter(r => r.attempts > 0).sort((a, b) => getPct(a.correct, a.attempts) - getPct(b.correct, b.attempts))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, margin: '0 auto 14px',
          background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Scan size={28} style={{ color: '#6366F1' }} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--dp-text-1)', margin: '0 0 6px' }}>
          Grammar Detective
        </h1>
        <p style={{ fontSize: 14, color: 'var(--dp-text-3)', margin: 0 }}>
          Click the word that matches the grammar role. No guessing — just analysis.
        </p>
      </div>

      {/* Stats banner */}
      {stats.attempts > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10,
          padding: '14px 16px', borderRadius: 14,
          background: 'var(--dp-surface)', border: '1px solid var(--dp-border-sm)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#6366F1' }}>{stats.attempts}</div>
            <div style={{ fontSize: 11, color: 'var(--dp-text-3)', marginTop: 2 }}>Analyzed</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#10B981' }}>{stats.correct}</div>
            <div style={{ fontSize: 11, color: 'var(--dp-text-3)', marginTop: 2 }}>Correct</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: globalPct >= 70 ? '#10B981' : globalPct >= 50 ? '#F59E0B' : '#F43F5E' }}>
              {globalPct}%
            </div>
            <div style={{ fontSize: 11, color: 'var(--dp-text-3)', marginTop: 2 }}>Accuracy</div>
          </div>
        </div>
      )}

      {/* Weak roles */}
      {roleRows.length > 0 && (
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--dp-text-3)', marginBottom: 8, textTransform: 'uppercase' }}>
            Your accuracy by role
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {roleRows.map(({ role, meta, attempts, correct }) => {
              const pct = getPct(correct, attempts)
              return (
                <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, color: meta.color, fontWeight: 700, width: 96, flexShrink: 0 }}>{meta.label}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--dp-border-sm)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct >= 70 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#F43F5E', borderRadius: 3, transition: 'width 0.4s' }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--dp-text-3)', width: 36, textAlign: 'right' }}>{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Filter: Role group */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--dp-text-3)', marginBottom: 8, textTransform: 'uppercase' }}>
          Focus on
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {FILTER_GROUPS.map((g, i) => (
            <button
              key={i}
              onClick={() => onSetFilterGroup(i)}
              style={{
                padding: '7px 13px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                border: filterGroup === i ? '1.5px solid #6366F1' : '1.5px solid var(--dp-border-sm)',
                background: filterGroup === i ? 'rgba(99,102,241,0.12)' : 'var(--dp-surface)',
                color: filterGroup === i ? '#6366F1' : 'var(--dp-text-2)',
                cursor: 'pointer',
              }}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter: Difficulty */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--dp-text-3)', marginBottom: 8, textTransform: 'uppercase' }}>
          Difficulty
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              onClick={() => onSetDiff(d)}
              style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, flex: 1,
                border: diffFilter === d ? '1.5px solid #6366F1' : '1.5px solid var(--dp-border-sm)',
                background: diffFilter === d ? 'rgba(99,102,241,0.12)' : 'var(--dp-surface)',
                color: diffFilter === d ? '#6366F1' : 'var(--dp-text-2)',
                cursor: 'pointer', textTransform: 'capitalize',
              }}
            >
              {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Session size */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--dp-text-3)', marginBottom: 8, textTransform: 'uppercase' }}>
          Session size
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          {[5, 10, 15, 20].map(n => (
            <button
              key={n}
              onClick={() => onSetSize(n)}
              style={{
                padding: '7px 0', borderRadius: 8, fontSize: 14, fontWeight: 700, flex: 1,
                border: sessionSize === n ? '1.5px solid #6366F1' : '1.5px solid var(--dp-border-sm)',
                background: sessionSize === n ? 'rgba(99,102,241,0.12)' : 'var(--dp-surface)',
                color: sessionSize === n ? '#6366F1' : 'var(--dp-text-2)',
                cursor: 'pointer',
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Start */}
      <button
        onClick={onStart}
        style={{
          padding: '16px 0', borderRadius: 14, border: 'none',
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
        }}
      >
        <Scan size={18} /> Start Analysis
      </button>
    </div>
  )
}

// ── Results Screen ────────────────────────────────────────────────────────────

interface ResultsScreenProps {
  items: DrillItem[]
  results: Record<string, boolean>
  onRestart: () => void
  onSetup: () => void
  showFr: boolean
}

function ResultsScreen({ items, results, onRestart, onSetup, showFr }: ResultsScreenProps) {
  const correct = Object.values(results).filter(Boolean).length
  const total = items.length
  const pct = getPct(correct, total)

  const tier = pct >= 80 ? { label: 'Expert', color: '#10B981', icon: '🏆' }
    : pct >= 60 ? { label: 'Developing', color: '#F59E0B', icon: '📈' }
    : { label: 'Keep Practicing', color: '#F43F5E', icon: '🔍' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Score card */}
      <div style={{
        textAlign: 'center', padding: '28px 20px',
        borderRadius: 20, border: `1px solid ${tier.color}30`,
        background: `${tier.color}08`,
      }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>{tier.icon}</div>
        <div style={{ fontSize: 48, fontWeight: 900, color: tier.color, lineHeight: 1 }}>{pct}%</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--dp-text-1)', marginTop: 6 }}>{tier.label}</div>
        <div style={{ fontSize: 13, color: 'var(--dp-text-3)', marginTop: 4 }}>{correct} / {total} correct</div>
      </div>

      {/* Per-question review */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--dp-text-3)', marginBottom: 10, textTransform: 'uppercase' }}>
          Review
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item, i) => {
            const ok = results[item.id]
            const meta = ROLE_META[item.targetRole]
            const correctWord = item.tokens[item.correctIndex]
            return (
              <div
                key={item.id}
                style={{
                  padding: '12px 14px', borderRadius: 12,
                  background: 'var(--dp-surface)',
                  border: ok ? `1px solid ${meta.color}25` : '1px solid rgba(244,63,94,0.2)',
                  display: 'flex', flexDirection: 'column', gap: 4,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, color: ok ? meta.color : '#F43F5E', fontWeight: 700, flexShrink: 0 }}>
                    {ok ? '✓' : '✗'}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--dp-text-2)', lineHeight: 1.4 }}>{item.sentence}</span>
                </div>
                {!ok && (
                  <div style={{ display: 'flex', gap: 6, paddingLeft: 22 }}>
                    <span style={{ fontSize: 12, color: meta.color, fontWeight: 600 }}>
                      {meta.glyph} {meta.label}: "{correctWord}"
                    </span>
                  </div>
                )}
                {showFr && item.explanationFr && !ok && (
                  <p style={{ fontSize: 11.5, color: 'var(--dp-text-3)', margin: '2px 0 0 22px', fontStyle: 'italic' }}>
                    {item.explanationFr}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onSetup}
          style={{
            flex: 1, padding: '13px 0', borderRadius: 12,
            border: '1.5px solid var(--dp-border-sm)',
            background: 'var(--dp-surface)', color: 'var(--dp-text-2)',
            fontWeight: 700, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <Target size={15} /> Change Filter
        </button>
        <button
          onClick={onRestart}
          style={{
            flex: 1, padding: '13px 0', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <RotateCcw size={15} /> Practice Again
        </button>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function GrammarDetective() {
  const navigate = useNavigate()
  const store = useAppStore()
  const showFr = store.profile.language === 'fr'

  const [screen, setScreen] = useState<Screen>('setup')
  const [filterGroup, setFilterGroup] = useState(0)
  const [diffFilter, setDiffFilter] = useState<DiffFilter>('all')
  const [sessionSize, setSessionSize] = useState(10)

  const [queue, setQueue] = useState<DrillItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [tokenStates, setTokenStates] = useState<TokenState[]>([])
  const [answered, setAnswered] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)
  const [results, setResults] = useState<Record<string, boolean>>({})

  const currentItem = queue[currentIndex] ?? null

  // Build a filtered + shuffled queue
  const buildQueue = useCallback(() => {
    const targetRoles = FILTER_GROUPS[filterGroup].roles
    let pool = sentenceItems.filter(item => {
      if (!targetRoles.includes(item.targetRole)) return false
      if (diffFilter !== 'all' && item.difficulty !== diffFilter) return false
      return true
    })
    if (pool.length === 0) pool = sentenceItems // fallback: no match → use all
    const shuffled = shuffleArray(pool).slice(0, sessionSize)
    return shuffled.map((item, i) => ({ ...item, shuffleIndex: i }))
  }, [filterGroup, diffFilter, sessionSize])

  function handleStart() {
    const q = buildQueue()
    setQueue(q)
    setCurrentIndex(0)
    setResults({})
    setAnswered(false)
    setWasCorrect(false)
    if (q.length > 0) {
      setTokenStates(new Array(q[0].tokens.length).fill('idle'))
    }
    setScreen('drill')
  }

  function handleRestart() {
    handleStart()
  }

  // When currentIndex changes, reset token states
  useEffect(() => {
    if (currentItem) {
      setTokenStates(new Array(currentItem.tokens.length).fill('idle'))
      setAnswered(false)
      setWasCorrect(false)
    }
  }, [currentIndex, currentItem?.id])

  function handleTokenClick(i: number) {
    if (!currentItem || answered) return

    const correct = i === currentItem.correctIndex
    setWasCorrect(correct)
    setAnswered(true)

    store.recordGrammarDetective(currentItem.targetRole, correct)
    setResults(prev => ({ ...prev, [currentItem.id]: correct }))

    // Update token visual states
    const next = new Array(currentItem.tokens.length).fill('idle') as TokenState[]
    if (correct) {
      next[i] = 'correct'
    } else {
      next[i] = 'wrong'
      next[currentItem.correctIndex] = 'missed'
    }
    setTokenStates(next)
  }

  function handleNext() {
    if (currentIndex >= queue.length - 1) {
      setScreen('results')
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  const progress = queue.length > 0 ? ((currentIndex + (answered ? 1 : 0)) / queue.length) * 100 : 0

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dp-bg)', paddingBottom: 60 }}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'var(--dp-surface-blur, var(--dp-surface))',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--dp-border-xs)',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button
          onClick={() => screen === 'setup' ? navigate(-1) : setScreen('setup')}
          style={{ padding: 8, borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--dp-text-3)', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <Scan size={16} style={{ color: '#6366F1' }} />
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--dp-text-1)' }}>Grammar Detective</span>
        </div>

        {screen === 'drill' && (
          <span style={{ fontSize: 12, color: 'var(--dp-text-3)', fontWeight: 600 }}>
            {currentIndex + 1} / {queue.length}
          </span>
        )}

        {screen === 'results' && (
          <button
            onClick={() => navigate('/courses')}
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6366F1', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
          >
            <BookOpen size={13} /> Courses
          </button>
        )}
      </div>

      {/* Progress bar (drill only) */}
      {screen === 'drill' && (
        <div style={{ height: 3, background: 'var(--dp-border-xs)' }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
            transition: 'width 0.4s ease',
          }} />
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px' }}>

        {/* ── SETUP ── */}
        {screen === 'setup' && (
          <SetupScreen
            filterGroup={filterGroup}
            diffFilter={diffFilter}
            sessionSize={sessionSize}
            stats={store.grammarDetectiveStats}
            onSetFilterGroup={setFilterGroup}
            onSetDiff={setDiffFilter}
            onSetSize={setSessionSize}
            onStart={handleStart}
            showFr={showFr}
          />
        )}

        {/* ── DRILL ── */}
        {screen === 'drill' && currentItem && (
          <div style={{ animation: 'fadeSlideIn 0.22s ease' }}>
            {/* Role badge */}
            <div style={{ marginBottom: 20 }}>
              {(() => {
                const meta = ROLE_META[currentItem.targetRole]
                return (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '6px 14px', borderRadius: 24,
                    background: meta.bg, border: `1px solid ${meta.color}30`,
                  }}>
                    <span style={{ fontSize: 14 }}>{meta.glyph}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {meta.label}
                    </span>
                    <span style={{ fontSize: 12, color: meta.color, opacity: 0.7 }}>· {meta.description}</span>
                  </div>
                )
              })()}
            </div>

            {/* Question */}
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--dp-text-1)', margin: '0 0 20px', lineHeight: 1.4 }}>
              {currentItem.question}
            </h2>

            {/* Token chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
              {currentItem.tokens.map((word, i) => (
                <TokenChip
                  key={i}
                  word={word}
                  index={i}
                  state={tokenStates[i] ?? 'idle'}
                  answered={answered}
                  targetRole={currentItem.targetRole}
                  onClick={handleTokenClick}
                />
              ))}
            </div>

            {/* Sentence context (small) */}
            <p style={{ fontSize: 12, color: 'var(--dp-text-3)', margin: '8px 0 0', fontStyle: 'italic' }}>
              "{currentItem.sentence}"
            </p>

            {/* Explanation */}
            {answered && (
              <ExplanationPanel
                item={currentItem}
                wasCorrect={wasCorrect}
                showFr={showFr}
                onNext={handleNext}
                isLast={currentIndex >= queue.length - 1}
              />
            )}
          </div>
        )}

        {/* ── RESULTS ── */}
        {screen === 'results' && (
          <ResultsScreen
            items={queue}
            results={results}
            onRestart={handleRestart}
            onSetup={() => setScreen('setup')}
            showFr={showFr}
          />
        )}
      </div>
    </div>
  )
}
