import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  BookOpen, ChevronRight, CheckCircle, XCircle, RotateCcw,
  BarChart2, AlertTriangle, Keyboard, BookMarked, Zap, Lightbulb, Wrench,
} from 'lucide-react'
import VariationDrill from '../variation/VariationDrill'
import { useAppStore, getCategoryAccuracy } from '../../store/useAppStore'
import { grammarQuestions } from '../../data/grammarQuestions'
import { englishGrammarQuestions } from '../../data/englishGrammarQuestions'
import { part5Questions } from '../../data/part5Questions'
import { TimerRing } from '../../components/ui/TimerRing'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useTimer } from '../../hooks/useTimer'
import { CAT_LABELS, DIFF_COLORS, ANSWER_LABELS } from '../../utils/constants'
import { SessionDebrief } from '../../components/SessionDebrief'
import { xpForGrammarSession } from '../../utils/xpEngine'
import { getLessonForCategory } from '../../utils/lessonEngine'
import type { GrammarQuestion, QuestionAttempt, GrammarSession } from '../../types'

// ── All Part 5 questions (core + advanced) ────────────────────────────────────
const ALL_PART5 = [...grammarQuestions, ...part5Questions]
const ALL_QUESTIONS = [...grammarQuestions, ...part5Questions, ...englishGrammarQuestions]

// ── Pre-lesson panel ──────────────────────────────────────────────────────────

function PreLessonPanel({ category, navigate }: { category: string; navigate: (path: string, opts?: object) => void }) {
  const [collapsed, setCollapsed] = React.useState(false)
  if (category === 'adaptive' || category === 'all' || category === 'redo_mistakes') return null
  const lesson = getLessonForCategory(category)
  if (!lesson) return null

  const ruleSection = lesson.sections.find(s => s.type === 'rule')
  const trapSection = lesson.sections.find(s => s.type === 'trap')

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.20)' }}>
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setCollapsed(v => !v)}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{lesson.icon ?? '📐'}</span>
          <div>
            <p className="text-xs font-semibold text-indigo-300">Lesson: {lesson.title}</p>
            <p className="text-[11px] text-zinc-500">{lesson.subtitle}</p>
          </div>
        </div>
        <span className="text-zinc-500 text-sm">{collapsed ? '▲' : '▼'}</span>
      </button>
      {!collapsed && (
        <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid rgba(99,102,241,0.12)' }}>
          {ruleSection && (
            <div className="mt-3">
              <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                {ruleSection.title ?? 'The Rule'}
              </p>
              <p className="text-xs text-zinc-300 leading-relaxed">{ruleSection.content}</p>
            </div>
          )}
          {trapSection && (
            <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)' }}>
              <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mb-0.5">⚠️ Watch for</p>
              <p className="text-xs text-zinc-400">{trapSection.content}</p>
            </div>
          )}
          <button
            className="text-xs text-indigo-400 underline"
            onClick={() => navigate(`/courses/${lesson.id}`, { state: { returnTo: '/grammar' } })}
          >
            View full lesson (+{lesson.xpReward} XP) →
          </button>
        </div>
      )}
    </div>
  )
}

// ── Rich Correction Panel ─────────────────────────────────────────────────────

interface CorrectionPanelProps {
  q: GrammarQuestion
  selectedAnswer: number | null
  isCorrect: boolean
  showFr: boolean
  onAddFlashcard: () => boolean  // returns true if actually added
  navigate: (path: string, opts?: object) => void
  onPracticeThisTopic: () => void
  onRepairMistake?: () => void
}

function CorrectionPanel({ q, selectedAnswer, isCorrect, showFr, onAddFlashcard, navigate, onPracticeThisTopic, onRepairMistake }: CorrectionPanelProps) {
  const [flashAdded, setFlashAdded] = useState(false)

  const lesson = getLessonForCategory(q.cat)
  const dictWord = q.linkedDictionaryWords?.[0]

  const handleFlashcard = () => {
    if (flashAdded) return
    const added = onAddFlashcard()
    if (added) setFlashAdded(true)
  }

  const resultColor = isCorrect ? 'rgba(16,185,129,0.22)' : 'rgba(239,68,68,0.22)'
  const resultBorder = isCorrect ? 'rgba(16,185,129,0.30)' : 'rgba(239,68,68,0.30)'
  const resultText = isCorrect ? '#6EE7B7' : '#FCA5A5'

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${resultBorder}` }}>

      {/* ── Result header ── */}
      <div className="px-4 py-3 flex items-start gap-3" style={{ background: isCorrect ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.07)' }}>
        <div className="mt-0.5 flex-shrink-0">
          {isCorrect
            ? <CheckCircle className="w-5 h-5 text-emerald-400" />
            : <XCircle className="w-5 h-5 text-red-400" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: resultText }}>
            {isCorrect ? 'Correct!' : `Incorrect — Correct answer: ${q.opts[q.correct]}`}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'rgba(99,102,241,0.15)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,0.25)' }}>
              {CAT_LABELS[q.cat] || q.cat}
            </span>
            {q.subtopic && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: 'rgba(139,92,246,0.12)', color: '#C4B5FD', border: '1px solid rgba(139,92,246,0.22)' }}>
                {q.subtopic}
              </span>
            )}
            {q.trapType && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: 'rgba(245,158,11,0.12)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.22)' }}>
                ⚠️ {q.trapType}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-4 py-4 space-y-4" style={{ background: 'rgba(0,0,0,0.25)' }}>

        {/* Rule highlight */}
        {q.rule && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(139,92,246,0.10)', border: '1px solid rgba(139,92,246,0.22)' }}>
            <Lightbulb className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
            <p className="text-xs font-semibold text-violet-200">{q.rule}</p>
          </div>
        )}

        {/* Main explanation */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: resultColor }}>
            {isCorrect ? 'Why this is correct' : 'Explanation'}
          </p>
          <p className="text-sm text-zinc-200 leading-relaxed">{q.exp}</p>
        </div>

        {/* Per-option breakdown */}
        {q.optExps && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Answer breakdown</p>
            {q.opts.map((opt, i) => {
              const isCorrectOpt = i === q.correct
              const isWrongSelected = i === selectedAnswer && !isCorrectOpt
              return (
                <div key={i} className="flex items-start gap-2.5 px-3 py-2 rounded-lg"
                  style={{
                    background: isCorrectOpt ? 'rgba(16,185,129,0.08)' : isWrongSelected ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isCorrectOpt ? 'rgba(16,185,129,0.22)' : isWrongSelected ? 'rgba(239,68,68,0.22)' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                  <span className={`text-[10px] font-bold mt-0.5 flex-shrink-0 w-4 ${isCorrectOpt ? 'text-emerald-400' : isWrongSelected ? 'text-red-400' : 'text-zinc-600'}`}>
                    {ANSWER_LABELS[i]}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold mb-0.5 ${isCorrectOpt ? 'text-emerald-300' : isWrongSelected ? 'text-red-300' : 'text-zinc-600'}`}>
                      {opt}{isCorrectOpt ? ' ✓' : isWrongSelected ? ' ✗' : ''}
                    </p>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">{q.optExps![i]}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Trap */}
        {q.trap && (
          <div className="flex items-start gap-2 px-3 py-2 rounded-lg"
            style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.22)' }}>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-amber-200 leading-relaxed">
              <strong className="text-amber-400">Trap: </strong>{q.trap}
            </p>
          </div>
        )}

        {/* French note */}
        {q.fr && showFr && (
          <div className="px-3 py-2 rounded-lg"
            style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.20)' }}>
            <p className="text-[11px] text-blue-200 leading-relaxed">🇫🇷 {q.fr}</p>
          </div>
        )}

        {/* Action row */}
        <div className="flex flex-wrap gap-2 pt-1">
          {!isCorrect && (
            <>
              <button onClick={handleFlashcard} disabled={flashAdded}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                style={flashAdded
                  ? { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.28)', color: '#6EE7B7' }
                  : { background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.28)', color: '#A5B4FC' }
                }>
                {flashAdded ? '✓ Saved to Flashcards' : '＋ Add to Flashcards'}
              </button>
              {onRepairMistake && (
                <button onClick={onRepairMistake}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                  style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.28)', color: '#FCA5A5' }}>
                  <Wrench className="w-3 h-3" /> Repair this mistake
                </button>
              )}
            </>
          )}
          <button onClick={onPracticeThisTopic}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
            style={{ background: 'rgba(139,92,246,0.10)', border: '1px solid rgba(139,92,246,0.22)', color: '#C4B5FD' }}>
            <Zap className="w-3 h-3" /> Practice Topic
          </button>
          {lesson && (
            <button onClick={() => navigate(`/courses/${lesson.id}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
              style={{ background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(59,130,246,0.22)', color: '#93C5FD' }}>
              <BookOpen className="w-3 h-3" /> Lesson
            </button>
          )}
          {dictWord && (
            <button onClick={() => navigate('/dictionary', { state: { initialWord: dictWord } })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.22)', color: '#6EE7B7' }}>
              <BookMarked className="w-3 h-3" /> Dictionary
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Category config ───────────────────────────────────────────────────────────

type DrillCategory =
  | 'adaptive' | 'all' | 'redo_mistakes'
  // Part 5 Core
  | 'word_form' | 'preposition' | 'conjunction' | 'verb' | 'pronoun'
  | 'article' | 'vocab' | 'collocation' | 'gerund_infinitive' | 'passive' | 'relative_clause'
  // Part 5 Advanced
  | 'connector' | 'adjective_adverb' | 'false_friend' | 'compound_adj' | 'inversion' | 'future_ability'
  // English Grammar (combined)
  | 'english_grammar'
  // English Grammar (individual)
  | 'tense_perfect' | 'tense_continuous' | 'conditionals' | 'modal_verbs'
  | 'reported_speech' | 'comparative' | 'quantifiers' | 'question_form'
  | 'time_clauses' | 'agreement'

const EG_CATEGORIES: DrillCategory[] = [
  'tense_perfect', 'tense_continuous', 'conditionals', 'modal_verbs',
  'reported_speech', 'comparative', 'quantifiers', 'question_form',
  'time_clauses', 'agreement',
]

const PART5_CORE: DrillCategory[] = ['word_form', 'preposition', 'conjunction', 'verb', 'pronoun', 'article', 'vocab', 'collocation', 'gerund_infinitive', 'passive']
const PART5_ADVANCED: DrillCategory[] = ['connector', 'adjective_adverb', 'false_friend', 'compound_adj', 'inversion', 'future_ability']

const CAT_ICONS: Partial<Record<DrillCategory, string>> = {
  word_form: '📝', preposition: '🔗', conjunction: '🔀', verb: '⚡', pronoun: '👤',
  article: '🔤', vocab: '📚', collocation: '🧩', gerund_infinitive: '🔄', passive: '🛡️',
  connector: '🔁', adjective_adverb: '↔️', false_friend: '⚠️', compound_adj: '🔗',
  inversion: '🔃', future_ability: '🚀',
  tense_perfect: '⏳', tense_continuous: '🔄', conditionals: '🔀', modal_verbs: '🎛️',
  reported_speech: '💬', comparative: '⚖️', quantifiers: '🔢', question_form: '❓',
  time_clauses: '🕐', agreement: '🤝',
}

type DrillDifficulty = 'all' | 'easy_medium' | 'hard'
type DrillMode = 'timed' | 'untimed' | 'exam'
type DrillState = 'setup' | 'active' | 'results'

// ── Main component ────────────────────────────────────────────────────────────

export const GrammarDrill: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const store = useAppStore()
  const { addGrammarSession, recordAttempt, addError, refreshMissionsIfNeeded, logActivity, addWordFlashcard, logVariationPractice } = store

  const locationState = location.state as { category?: DrillCategory } | null

  const [state, setState] = useState<DrillState>('setup')
  const [category, setCategory] = useState<DrillCategory>(
    (locationState?.category as DrillCategory) ?? 'adaptive'
  )
  const [difficulty, setDifficulty] = useState<DrillDifficulty>('all')
  const [count, setCount] = useState(20)
  const [mode, setMode] = useState<DrillMode>('timed')

  const [questions, setQuestions] = useState<GrammarQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const attemptsRef = useRef<QuestionAttempt[]>([])
  const [attemptsDisplay, setAttemptsDisplay] = useState<QuestionAttempt[]>([])
  const [correctCount, setCorrectCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const answeredRef = useRef(false)
  const questionStartTime = useRef<number>(Date.now())
  const sessionStartTime = useRef<number>(Date.now())
  const [sessionXP, setSessionXP] = useState(0)
  const prevXPRef = useRef(store.profile.xp)
  const [showDebrief, setShowDebrief] = useState(true)
  const [showVariation, setShowVariation] = useState(false)
  const [variationForQ, setVariationForQ] = useState<GrammarQuestion | null>(null)

  const catAcc = getCategoryAccuracy(store)

  const timer = useTimer(45, () => {
    if (!answeredRef.current) handleAnswer(-1)
  })

  // How many redo-mistakes questions are available
  const redoCount = useMemo(() => {
    const wrongIds = Object.entries(store.questionHistory)
      .filter(([, attempts]) => attempts.some(a => !a.correct))
      .map(([id]) => Number(id))
    return ALL_QUESTIONS.filter(q => wrongIds.includes(q.id)).length
  }, [store.questionHistory])

  const buildQuestions = useCallback((): GrammarQuestion[] => {
    let pool: GrammarQuestion[]

    if (category === 'redo_mistakes') {
      const wrongIds = Object.entries(store.questionHistory)
        .filter(([, attempts]) => attempts.some(a => !a.correct))
        .map(([id]) => Number(id))
      pool = ALL_QUESTIONS.filter(q => wrongIds.includes(q.id))
      // Sort: most recently wrong first
      pool = pool.sort((a, b) => {
        const aLast = store.questionHistory[a.id]?.slice(-1)[0]?.timestamp ?? 0
        const bLast = store.questionHistory[b.id]?.slice(-1)[0]?.timestamp ?? 0
        return bLast - aLast
      })
    } else if (category === 'english_grammar') {
      pool = englishGrammarQuestions.filter(q => EG_CATEGORIES.includes(q.cat as DrillCategory))
    } else if (category === 'adaptive') {
      const weighted: GrammarQuestion[] = []
      for (const q of ALL_PART5) {
        const pct = catAcc[q.cat]?.pct ?? 50
        const weight = pct < 60 ? 3 : pct < 80 ? 2 : 1
        for (let i = 0; i < weight; i++) weighted.push(q)
      }
      const shuffled = weighted.sort(() => Math.random() - 0.5)
      const seen = new Set<number>()
      const deduped: GrammarQuestion[] = []
      for (const q of shuffled) {
        if (!seen.has(q.id)) { seen.add(q.id); deduped.push(q) }
      }
      pool = deduped
    } else if (category === 'all') {
      pool = ALL_PART5.sort(() => Math.random() - 0.5)
    } else if (EG_CATEGORIES.includes(category)) {
      pool = englishGrammarQuestions.filter(q => q.cat === category)
    } else {
      pool = ALL_QUESTIONS.filter(q => q.cat === category)
    }

    if (difficulty === 'easy_medium') pool = pool.filter(q => q.diff !== 'hard')
    if (difficulty === 'hard') pool = pool.filter(q => q.diff === 'hard')
    if (category !== 'adaptive' && category !== 'redo_mistakes') pool = pool.sort(() => Math.random() - 0.5)

    return pool.slice(0, Math.min(count, pool.length))
  }, [category, difficulty, count, catAcc, store.questionHistory])

  const startDrill = useCallback(() => {
    const qs = buildQuestions()
    if (qs.length === 0) return
    setQuestions(qs)
    setCurrentIdx(0)
    setSelectedAnswer(null)
    setAnswered(false)
    attemptsRef.current = []
    setAttemptsDisplay([])
    setCorrectCount(0)
    setStreak(0)
    answeredRef.current = false
    sessionStartTime.current = Date.now()
    questionStartTime.current = Date.now()
    prevXPRef.current = store.profile.xp
    setShowDebrief(true)
    refreshMissionsIfNeeded()
    setState('active')
    logActivity({ type: 'drill_start', label: `Started grammar drill: ${category}`, meta: { category } })
    if (mode === 'timed') timer.restart(45)
    else timer.pause()
  }, [buildQuestions, mode, timer, store.profile.xp, refreshMissionsIfNeeded, logActivity, category])

  // Auto-start if deep-linked
  useEffect(() => {
    if (locationState?.category && state === 'setup') {
      const t = setTimeout(() => startDrill(), 100)
      return () => clearTimeout(t)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = useCallback((idx: number) => {
    if (answeredRef.current) return
    answeredRef.current = true
    timer.pause()
    setAnswered(true)
    setSelectedAnswer(idx)

    const q = questions[currentIdx]
    if (!q) return
    const isCorrect = idx === q.correct
    const timeSpent = Math.round((Date.now() - questionStartTime.current) / 1000)

    const attempt: QuestionAttempt = {
      questionId: q.id,
      correct: isCorrect,
      timeSpent,
      selectedAnswer: idx,
      cat: q.cat,
      timestamp: Date.now(),
    }

    attemptsRef.current = [...attemptsRef.current, attempt]
    setAttemptsDisplay(prev => [...prev, attempt])
    recordAttempt(attempt)

    if (isCorrect) {
      setCorrectCount(prev => prev + 1)
      setStreak(prev => prev + 1)
    } else {
      setStreak(0)
      addError({
        part: 'part5',
        category: q.cat,
        question: q.q,
        opts: [...q.opts],
        correctAnswer: q.correct,
        userAnswer: idx,
        explanation: q.exp,
        trap: q.trap,
        dangerLevel: q.diff === 'hard' ? 'critical' : q.diff === 'medium' ? 'high' : 'medium',
        timestamp: Date.now(),
      })
    }
  }, [questions, currentIdx, timer, recordAttempt, addError])

  const nextQuestion = useCallback(() => {
    if (currentIdx + 1 >= questions.length) {
      finishSession(attemptsRef.current)
      return
    }
    setCurrentIdx(prev => prev + 1)
    setSelectedAnswer(null)
    setAnswered(false)
    answeredRef.current = false
    questionStartTime.current = Date.now()
    if (mode === 'timed') timer.restart(45)
  }, [currentIdx, questions.length, mode, timer])

  const finishSession = (finalAttempts: QuestionAttempt[]) => {
    const finalCorrect = finalAttempts.filter(a => a.correct).length
    const xp = xpForGrammarSession(finalCorrect, questions.length, store.profile.streak)
    setSessionXP(xp)
    const session: GrammarSession = {
      id: `gs_${Date.now()}`,
      timestamp: Date.now(),
      category,
      count: questions.length,
      correct: finalCorrect,
      totalTime: Math.round((Date.now() - sessionStartTime.current) / 1000),
      attempts: finalAttempts,
    }
    addGrammarSession(session)
    logActivity({ type: 'drill_complete', label: `Finished grammar drill: ${finalCorrect}/${questions.length}`, meta: { category, correct: finalCorrect, total: questions.length } })
    setState('results')
  }

  // Keyboard shortcuts
  useEffect(() => {
    if (state !== 'active') return
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (['a', 'A', '1'].includes(e.key) && !answered) handleAnswer(0)
      else if (['b', 'B', '2'].includes(e.key) && !answered) handleAnswer(1)
      else if (['c', 'C', '3'].includes(e.key) && !answered) handleAnswer(2)
      else if (['d', 'D', '4'].includes(e.key) && !answered) handleAnswer(3)
      else if ((e.key === ' ' || e.key === 'Enter') && answered) {
        e.preventDefault()
        nextQuestion()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [state, answered, handleAnswer, nextQuestion])

  const q = questions[currentIdx]
  const finalCorrect = attemptsDisplay.filter(a => a.correct).length
  const accuracy = questions.length > 0 ? Math.round(finalCorrect / questions.length * 100) : 0

  const perCatResults = useMemo(() => {
    const map: Record<string, { correct: number; total: number }> = {}
    attemptsDisplay.forEach(a => {
      if (!map[a.cat]) map[a.cat] = { correct: 0, total: 0 }
      map[a.cat].total++
      if (a.correct) map[a.cat].correct++
    })
    return map
  }, [attemptsDisplay])

  const lastSession = store.grammarSessions.slice(-1)[0]

  // Helper: make a flashcard from the current wrong question
  const handleAddFlashcard = useCallback((): boolean => {
    if (!q) return false
    const front = `Fill in the blank: ${q.q}`
    const back = `${q.opts[q.correct]}${q.exp ? ` — ${q.exp}` : ''}`
    const hint = q.rule ?? q.trap
    addWordFlashcard(q.opts[q.correct], front, back, hint)
    return true
  }, [q, addWordFlashcard])

  // ── SETUP ─────────────────────────────────────────────────────────────────

  if (state === 'setup') {
    const CatButton = ({ cat }: { cat: DrillCategory }) => {
      const acc = catAcc[cat]?.pct
      const active = category === cat
      return (
        <button key={cat} onClick={() => setCategory(cat)}
          className="px-2 py-2 rounded-lg text-xs font-medium border transition-all flex flex-col items-center gap-0.5 text-center"
          style={active
            ? { background: 'rgba(99,102,241,0.30)', borderColor: '#818CF8', color: 'white' }
            : { background: 'var(--dp-surface-warm)', borderColor: 'var(--dp-border-sm)', color: 'var(--dp-text-3)' }
          }>
          <span>{CAT_ICONS[cat] ?? '📝'} {CAT_LABELS[cat] || cat}</span>
          {acc !== undefined && (
            <span className={`text-[10px] font-bold ${acc < 60 ? 'text-red-400' : acc < 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {acc}%
            </span>
          )}
        </button>
      )
    }

    // Build accuracy summary for the dashboard panel
    const accuracyCategories = [...PART5_CORE, ...PART5_ADVANCED].map(cat => ({
      cat,
      label: CAT_LABELS[cat] || cat,
      icon: CAT_ICONS[cat] ?? '📝',
      pct: catAcc[cat]?.pct,
      total: catAcc[cat]?.total ?? 0,
    })).filter(c => c.total > 0)

    const weakCats = accuracyCategories.filter(c => (c.pct ?? 100) < 65).slice(0, 3)
    const totalAttempted = Object.values(catAcc).reduce((s, v) => s + v.total, 0)
    const overallPct = totalAttempted > 0
      ? Math.round(Object.values(catAcc).reduce((s, v) => s + v.correct, 0) / totalAttempted * 100)
      : null

    return (
      <div className="p-4 sm:p-5 lg:p-6 max-w-2xl mx-auto space-y-5 pb-24 sm:pb-8">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--dp-text-1)' }}>
            Grammar <span className="text-gradient">Drill</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--dp-text-4)' }}>
            Part 5 mastery — {ALL_PART5.length} questions across {PART5_CORE.length + PART5_ADVANCED.length} categories
          </p>
        </div>

        {/* ── Part 5 Accuracy Dashboard ─────────────────────────────────────── */}
        {accuracyCategories.length > 0 && (
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--dp-surface)', border: '1px solid var(--dp-border-sm)', boxShadow: 'var(--dp-shadow-sm)' }}>
            <div className="px-4 pt-4 pb-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--dp-border-xs)' }}>
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-bold" style={{ color: 'var(--dp-text-1)' }}>Part 5 Accuracy</span>
              </div>
              {overallPct !== null && (
                <span className={`text-sm font-bold ${overallPct < 65 ? 'text-red-400' : overallPct < 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {overallPct}% overall
                </span>
              )}
            </div>
            <div className="px-4 py-3 space-y-2">
              {accuracyCategories
                .sort((a, b) => (a.pct ?? 100) - (b.pct ?? 100))
                .slice(0, 8)
                .map(c => (
                  <div key={c.cat} className="flex items-center gap-3">
                    <span className="text-xs w-4 text-center flex-shrink-0">{c.icon}</span>
                    <span className="text-[11px] w-24 flex-shrink-0 truncate" style={{ color: 'var(--dp-text-3)' }}>{c.label}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${c.pct ?? 0}%`,
                          background: (c.pct ?? 100) < 65
                            ? 'linear-gradient(90deg,#EF4444,#F97316)'
                            : (c.pct ?? 100) < 80
                              ? 'linear-gradient(90deg,#F59E0B,#EAB308)'
                              : 'linear-gradient(90deg,#10B981,#34D399)',
                        }} />
                    </div>
                    <span className={`text-[11px] font-bold w-8 text-right flex-shrink-0 ${(c.pct ?? 100) < 65 ? 'text-red-400' : (c.pct ?? 100) < 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {c.pct}%
                    </span>
                    <span className="text-[10px] w-12 text-right flex-shrink-0" style={{ color: 'var(--dp-text-4)' }}>{c.total} Q</span>
                  </div>
                ))}
            </div>
            {weakCats.length > 0 && (
              <div className="px-4 pb-4">
                <div className="rounded-xl px-3 py-2.5 flex items-center gap-3"
                  style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}>
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <p className="text-[11px]" style={{ color: '#FCA5A5' }}>
                    <strong>Weak spots:</strong> {weakCats.map(c => c.label).join(', ')} — drill these to improve fast.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Last session */}
        {lastSession && (
          <Card className="p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="text-xs mb-0.5" style={{ color: 'var(--dp-text-4)' }}>Last Session</div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-indigo-400">{Math.round(lastSession.correct / lastSession.count * 100)}%</span>
                <span className="text-sm" style={{ color: 'var(--dp-text-2)' }}>{lastSession.correct}/{lastSession.count} correct</span>
                <span className="text-xs" style={{ color: 'var(--dp-text-4)' }}>{CAT_LABELS[lastSession.category] || lastSession.category}</span>
              </div>
            </div>
            <Button size="sm" onClick={startDrill}>Quick Retry</Button>
          </Card>
        )}

        {/* Redo Mistakes CTA */}
        {redoCount > 0 && (
          <button
            onClick={() => { setCategory('redo_mistakes'); setTimeout(startDrill, 50) }}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all"
            style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.28)' }}>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-red-400" />
              <div className="text-left">
                <p className="text-sm font-bold text-red-300">Redo My Mistakes</p>
                <p className="text-xs text-zinc-500">{redoCount} questions where you made errors</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </button>
        )}

        <Card className="p-5 space-y-5">

          {/* Special modes */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--dp-text-3)' }}>
              Smart Modes
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['adaptive', 'all'] as DrillCategory[]).map(cat => {
                const active = category === cat
                return (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className="px-3 py-2.5 rounded-lg text-xs font-medium border transition-all text-left"
                    style={active
                      ? { background: 'rgba(99,102,241,0.30)', borderColor: '#818CF8', color: 'white' }
                      : { background: 'var(--dp-surface-warm)', borderColor: 'var(--dp-border-sm)', color: 'var(--dp-text-3)' }
                    }>
                    {cat === 'adaptive' ? '🎯 Adaptive — targets your weak spots' : '🔀 All Mixed — full random drill'}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Part 5 Core */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--dp-text-3)' }}>
              Part 5 Core
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {PART5_CORE.map(cat => <CatButton key={cat} cat={cat} />)}
            </div>
          </div>

          {/* Part 5 Advanced */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--dp-text-3)' }}>
              Part 5 Advanced
              <span className="ml-2 text-[10px] text-violet-400 normal-case font-normal">New topics</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-1.5">
              {PART5_ADVANCED.map(cat => <CatButton key={cat} cat={cat} />)}
            </div>
          </div>

          {/* English Grammar */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--dp-text-3)' }}>
              English Grammar Module
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['english_grammar', ...EG_CATEGORIES] as DrillCategory[]).map(cat => {
                const acc = catAcc[cat]?.pct
                const active = category === cat
                return (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className="px-2 py-2 rounded-lg text-xs font-medium border transition-all flex items-center justify-between gap-1"
                    style={active
                      ? { background: 'rgba(99,102,241,0.30)', borderColor: '#818CF8', color: 'white' }
                      : { background: 'var(--dp-surface-warm)', borderColor: 'var(--dp-border-sm)', color: 'var(--dp-text-3)' }
                    }>
                    <span>{CAT_ICONS[cat] ?? '📝'} {cat === 'english_grammar' ? '⚡ All Grammar Topics' : CAT_LABELS[cat] || cat}</span>
                    {acc !== undefined && cat !== 'english_grammar' && (
                      <span className={`text-[10px] font-bold ml-1 ${acc < 60 ? 'text-red-400' : acc < 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {acc}%
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <p className="text-xs -mt-1" style={{ color: 'var(--dp-text-4)' }}>
            {category === 'adaptive' ? '3× weight on weak categories · targets your gaps automatically' :
             category === 'all' ? 'Random mix from all Part 5 questions' :
             category === 'english_grammar' ? 'All English Grammar categories combined' :
             `${CAT_LABELS[category] || category} questions only`}
          </p>

          {/* Difficulty */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--dp-text-3)' }}>Difficulty</label>
            <div className="flex gap-2">
              {(['all', 'easy_medium', 'hard'] as DrillDifficulty[]).map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className="px-3 py-2 rounded-lg text-xs font-medium border transition-all flex-1"
                  style={difficulty === d
                    ? { background: 'rgba(99,102,241,0.30)', borderColor: '#818CF8', color: 'white' }
                    : { background: 'var(--dp-surface-warm)', borderColor: 'var(--dp-border-sm)', color: 'var(--dp-text-3)' }
                  }>
                  {d === 'all' ? 'All Levels' : d === 'easy_medium' ? 'Easy / Med' : 'Hard Only'}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--dp-text-3)' }}>Question Count</label>
            <div className="flex gap-2">
              {[10, 20, 40].map(n => (
                <button key={n} onClick={() => setCount(n)}
                  className="px-4 py-2 rounded-lg text-xs font-medium border transition-all flex-1"
                  style={count === n
                    ? { background: 'rgba(99,102,241,0.30)', borderColor: '#818CF8', color: 'white' }
                    : { background: 'var(--dp-surface-warm)', borderColor: 'var(--dp-border-sm)', color: 'var(--dp-text-3)' }
                  }>
                  {n} Q · ~{n * 0.75}min
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--dp-text-3)' }}>Mode</label>
            <div className="flex gap-2">
              {(['timed', 'untimed', 'exam'] as DrillMode[]).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className="px-3 py-2 rounded-lg text-xs font-medium border transition-all flex-1"
                  style={mode === m
                    ? { background: 'rgba(99,102,241,0.30)', borderColor: '#818CF8', color: 'white' }
                    : { background: 'var(--dp-surface-warm)', borderColor: 'var(--dp-border-sm)', color: 'var(--dp-text-3)' }
                  }>
                  {m === 'timed' ? '⏱ Timed 45s' : m === 'untimed' ? '∞ Study' : '🎓 Exam'}
                </button>
              ))}
            </div>
            <p className="text-xs mt-1.5" style={{ color: 'var(--dp-text-4)' }}>
              {mode === 'timed' ? 'Real TOEIC pace — 45s per question' :
               mode === 'untimed' ? 'Study mode — take your time, full explanations' :
               'No explanations during drill · full review at end'}
            </p>
          </div>

          <PreLessonPanel category={category} navigate={navigate} />

          <Button size="lg" className="w-full" onClick={startDrill}>
            Start Drill — {count} Questions
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-xs" style={{ color: 'var(--dp-text-4)' }}>
            <Keyboard className="w-3 h-3" />
            <span>A / B / C / D to answer · Space or Enter to advance</span>
          </div>
        </Card>
      </div>
    )
  }

  // ── ACTIVE ────────────────────────────────────────────────────────────────

  if (state === 'active' && q) {
    return (
      <div className="p-4 sm:p-5 lg:p-6 max-w-2xl mx-auto space-y-4 pb-24 sm:pb-8">

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono w-12" style={{ color: 'var(--dp-text-4)' }}>{currentIdx + 1}/{questions.length}</span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
          </div>
          {mode === 'timed' && (
            <TimerRing timeLeft={timer.timeLeft} total={45} size={48} strokeWidth={4} urgency={timer.urgency} />
          )}
        </div>

        {/* Meta chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={DIFF_COLORS[q.diff] as 'emerald' | 'amber' | 'red'}>{q.diff}</Badge>
          <Badge variant="slate">{CAT_LABELS[q.cat] || q.cat}</Badge>
          {q.subtopic && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(139,92,246,0.10)', color: '#C4B5FD', border: '1px solid rgba(139,92,246,0.20)' }}>
              {q.subtopic}
            </span>
          )}
          {streak > 1 && (
            <span className="text-xs text-amber-400 font-medium">🔥 {streak} streak</span>
          )}
        </div>

        {/* Question */}
        <Card className="p-5">
          <p className="text-base lg:text-lg font-medium leading-relaxed" style={{ color: 'var(--dp-text-1)' }}>{q.q}</p>
        </Card>

        {/* Answer choices */}
        <div className="space-y-2">
          {q.opts.map((opt, i) => {
            let bg = 'var(--dp-surface-warm)'
            let borderColor = 'var(--dp-border-sm)'
            let color = 'var(--dp-text-2)'
            let labelBg = 'rgba(255,255,255,0.07)'
            let labelColor = 'var(--dp-text-4)'
            if (answered) {
              if (i === q.correct) { bg = 'rgba(16,185,129,0.10)'; borderColor = 'rgba(16,185,129,0.35)'; color = '#6EE7B7'; labelBg = 'rgba(16,185,129,0.22)'; labelColor = '#10B981' }
              else if (i === selectedAnswer && i !== q.correct) { bg = 'rgba(239,68,68,0.10)'; borderColor = 'rgba(239,68,68,0.35)'; color = '#FCA5A5'; labelBg = 'rgba(239,68,68,0.22)'; labelColor = '#EF4444' }
              else { bg = 'rgba(255,255,255,0.02)'; borderColor = 'rgba(255,255,255,0.04)'; color = 'var(--dp-text-5)'; labelBg = 'rgba(255,255,255,0.03)'; labelColor = 'var(--dp-text-5)' }
            }
            return (
              <button key={i} onClick={() => !answered && handleAnswer(i)} disabled={answered}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left"
                style={{ background: bg, borderColor, color }}>
                <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: labelBg, color: labelColor }}>
                  {ANSWER_LABELS[i]}
                </span>
                {opt}
                {answered && i === q.correct && <CheckCircle className="w-4 h-4 ml-auto text-emerald-400 flex-shrink-0" />}
                {answered && i === selectedAnswer && i !== q.correct && <XCircle className="w-4 h-4 ml-auto text-red-400 flex-shrink-0" />}
              </button>
            )
          })}
        </div>

        {/* Rich Correction Panel */}
        {answered && mode !== 'exam' && (
          <CorrectionPanel
            q={q}
            selectedAnswer={selectedAnswer}
            isCorrect={selectedAnswer === q.correct}
            showFr={store.profile.language === 'fr'}
            onAddFlashcard={handleAddFlashcard}
            navigate={navigate}
            onPracticeThisTopic={() => {
              setCategory(q.cat as DrillCategory)
              setState('setup')
            }}
            onRepairMistake={selectedAnswer !== q.correct ? () => {
              setVariationForQ(q)
              setShowVariation(true)
            } : undefined}
          />
        )}

        {/* Variation Drill overlay */}
        {showVariation && variationForQ && (
          <VariationDrill
            sourceQuestion={variationForQ}
            showFr={store.profile.language === 'fr'}
            onDone={(score, total) => {
              logVariationPractice(variationForQ.id, variationForQ.cat, score, total)
              setShowVariation(false)
              setVariationForQ(null)
            }}
            onClose={() => {
              setShowVariation(false)
              setVariationForQ(null)
            }}
          />
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs">
            <span style={{ color: '#10B981' }}>✓ {attemptsDisplay.filter(a => a.correct).length}</span>
            <span style={{ color: '#EF4444' }}>✗ {attemptsDisplay.filter(a => !a.correct).length}</span>
          </div>
          {answered && (
            <Button onClick={nextQuestion} className="gap-1.5">
              {currentIdx + 1 >= questions.length ? 'See Results' : 'Next'}
              <ChevronRight className="w-4 h-4" />
              <span className="text-xs opacity-60 font-normal hidden sm:inline">Space</span>
            </Button>
          )}
        </div>
      </div>
    )
  }

  // ── RESULTS ───────────────────────────────────────────────────────────────

  if (state === 'results') {
    const totalTime = Math.round((Date.now() - sessionStartTime.current) / 1000)
    const avgTime = attemptsDisplay.length > 0
      ? Math.round(attemptsDisplay.reduce((s, a) => s + a.timeSpent, 0) / attemptsDisplay.length)
      : 0
    return (
      <div className="p-4 sm:p-5 lg:p-6 max-w-2xl mx-auto space-y-5 pb-24 sm:pb-8">
        {showDebrief && (
          <SessionDebrief
            xpGained={sessionXP}
            prevXP={prevXPRef.current}
            accuracy={accuracy}
            category={category}
            onContinue={() => setShowDebrief(false)}
          />
        )}

        {!showDebrief && (
          <>
            <div className="text-center">
              <div className={`text-6xl font-black mb-2 ${accuracy >= 80 ? 'text-emerald-500' : accuracy >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                {accuracy}%
              </div>
              <p style={{ color: 'var(--dp-text-3)' }}>{finalCorrect} correct out of {questions.length} questions</p>
              <p className="text-xs mt-1" style={{ color: 'var(--dp-text-4)' }}>Avg {avgTime}s · Total {Math.floor(totalTime / 60)}m{totalTime % 60}s</p>
            </div>

            {accuracy >= 80 && (
              <div className="text-center p-3 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.22)', color: '#6EE7B7' }}>
                Strong performance! All errors saved to your error notebook.
              </div>
            )}
            {accuracy < 60 && (
              <div className="text-center p-3 rounded-xl text-sm"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.22)', color: '#FCD34D' }}>
                Focus on the categories below. Use Redo Mistakes next session.
              </div>
            )}

            {Object.keys(perCatResults).length > 0 && (
              <Card className="p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--dp-text-4)' }}>
                  Results by Category
                </h3>
                <div className="space-y-2">
                  {Object.entries(perCatResults)
                    .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
                    .map(([cat, data]) => {
                      const pct = Math.round(data.correct / data.total * 100)
                      const color = pct >= 80 ? '#10B981' : pct >= 60 ? '#F59E0B' : '#EF4444'
                      return (
                        <div key={cat} className="flex items-center gap-3">
                          <button
                            onClick={() => { setCategory(cat as DrillCategory); setState('setup') }}
                            className="text-xs hover:text-indigo-400 transition-colors text-left w-28 shrink-0"
                            style={{ color: 'var(--dp-text-4)' }}>
                            {CAT_LABELS[cat] || cat}
                          </button>
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                          </div>
                          <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
                          <span className="text-xs" style={{ color: 'var(--dp-text-4)' }}>{data.correct}/{data.total}</span>
                        </div>
                      )
                    })}
                </div>
                <p className="text-xs mt-3" style={{ color: 'var(--dp-text-5)' }}>↑ Click a category to drill it next</p>
              </Card>
            )}

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setState('setup')} variant="ghost" className="flex-1">
                <RotateCcw className="w-4 h-4" /> Setup
              </Button>
              {redoCount > 0 && (
                <Button
                  onClick={() => { setCategory('redo_mistakes'); setState('setup'); setTimeout(startDrill, 50) }}
                  variant="ghost" className="flex-1"
                  style={{ borderColor: 'rgba(239,68,68,0.30)', color: '#FCA5A5' } as React.CSSProperties}>
                  <RotateCcw className="w-4 h-4" /> Redo Mistakes ({redoCount})
                </Button>
              )}
              <Button onClick={() => navigate('/errors')} variant="ghost" className="flex-1">
                <BookOpen className="w-4 h-4" /> Errors
              </Button>
              <Button onClick={() => navigate('/')} className="flex-1">
                <BarChart2 className="w-4 h-4" /> Dashboard
              </Button>
            </div>
          </>
        )}
      </div>
    )
  }

  return null
}
