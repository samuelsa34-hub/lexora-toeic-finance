import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import { Timer, Flag, CheckCircle, XCircle, BarChart2, RotateCcw, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { grammarQuestions } from '../../data/grammarQuestions'
import { TimerRing } from '../../components/ui/TimerRing'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useTimer } from '../../hooks/useTimer'
import { CAT_LABELS, ANSWER_LABELS } from '../../utils/constants'
import type { GrammarQuestion } from '../../types'

type MockMode = 'mini' | 'part5_full' | 'reading_sprint'
type ExamState = 'select' | 'exam' | 'review' | 'results'

const MODES: { id: MockMode; label: string; questions: number; minutes: number; desc: string; color: string }[] = [
  { id: 'mini', label: 'Mini Mock', questions: 20, minutes: 15, desc: 'Quick 20-question warmup — great daily check-in', color: 'emerald' },
  { id: 'part5_full', label: 'Part 5 Full', questions: 40, minutes: 30, desc: 'Complete Part 5 simulation at real exam pace', color: 'indigo' },
  { id: 'reading_sprint', label: 'Reading Sprint', questions: 60, minutes: 45, desc: '60 mixed questions — maximum intensity drill', color: 'amber' },
]

export const MockExam: React.FC = () => {
  const navigate = useNavigate()
  const { addGrammarSession, recordAttempt, addError } = useAppStore()
  const [examState, setExamState] = useState<ExamState>('select')
  const [selectedMode, setSelectedMode] = useState<MockMode>('part5_full')
  const [questions, setQuestions] = useState<GrammarQuestion[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [flagged, setFlagged] = useState<Set<number>>(new Set())
  const [reviewIdx, setReviewIdx] = useState(0)
  const sessionStart = useRef(Date.now())
  const timerTotalRef = useRef(0)
  const submittedRef = useRef(false)

  const mode = MODES.find(m => m.id === selectedMode)!

  const timer = useTimer(mode.minutes * 60, () => {
    if (!submittedRef.current) submitExam()
  })

  const buildQuestions = useCallback((m: MockMode): GrammarQuestion[] => {
    const count = m === 'mini' ? 20 : m === 'part5_full' ? 40 : 60
    // Spread to avoid mutating the original imported array
    return [...grammarQuestions].sort(() => Math.random() - 0.5).slice(0, Math.min(count, grammarQuestions.length))
  }, [])

  const startExam = useCallback(() => {
    const currentMode = MODES.find(m => m.id === selectedMode)!
    submittedRef.current = false
    const qs = buildQuestions(selectedMode)
    setQuestions(qs)
    setCurrentQ(0)
    setAnswers({})
    setFlagged(new Set())
    sessionStart.current = Date.now()
    timerTotalRef.current = currentMode.minutes * 60
    setExamState('exam')
    timer.restart(currentMode.minutes * 60)
  }, [selectedMode, buildQuestions, timer])

  const selectAnswer = useCallback((qIdx: number, ans: number) => {
    setAnswers(prev => ({ ...prev, [qIdx]: ans }))
  }, [])

  const toggleFlag = useCallback((qIdx: number) => {
    setFlagged(prev => {
      const next = new Set(prev)
      next.has(qIdx) ? next.delete(qIdx) : next.add(qIdx)
      return next
    })
  }, [])

  const submitExam = useCallback(() => {
    if (submittedRef.current) return
    submittedRef.current = true
    timer.pause()

    questions.forEach((q, i) => {
      const userAnswer = answers[i] ?? -1
      const correct = userAnswer === q.correct
      const attempt = {
        questionId: q.id,
        correct,
        timeSpent: Math.round((Date.now() - sessionStart.current) / 1000 / Math.max(1, questions.length)),
        selectedAnswer: userAnswer,
        cat: q.cat,
        timestamp: Date.now(),
      }
      recordAttempt(attempt)
      if (!correct && userAnswer !== -1) {
        addError({
          part: 'part5',
          category: q.cat,
          question: q.q,
          opts: [...q.opts],
          correctAnswer: q.correct,
          userAnswer,
          explanation: q.exp,
          trap: q.trap,
          dangerLevel: q.diff === 'hard' ? 'critical' : q.diff === 'medium' ? 'high' : 'medium',
          timestamp: Date.now(),
        })
      }
    })

    const correctCount = questions.filter((q, i) => answers[i] === q.correct).length
    addGrammarSession({
      id: `mock_${Date.now()}`,
      timestamp: Date.now(),
      category: `mock_${selectedMode}`,
      count: questions.length,
      correct: correctCount,
      totalTime: Math.round((Date.now() - sessionStart.current) / 1000),
      attempts: [],
    })
    setExamState('results')
  }, [questions, answers, timer, recordAttempt, addError, addGrammarSession, selectedMode])

  // Keyboard shortcuts during exam
  useEffect(() => {
    if (examState !== 'exam') return
    const handler = (e: KeyboardEvent) => {
      if (['a', 'A', '1'].includes(e.key)) selectAnswer(currentQ, 0)
      else if (['b', 'B', '2'].includes(e.key)) selectAnswer(currentQ, 1)
      else if (['c', 'C', '3'].includes(e.key)) selectAnswer(currentQ, 2)
      else if (['d', 'D', '4'].includes(e.key)) selectAnswer(currentQ, 3)
      else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        setCurrentQ(prev => Math.min(questions.length - 1, prev + 1))
      }
      else if (e.key === 'ArrowLeft') setCurrentQ(prev => Math.max(0, prev - 1))
      else if (e.key === 'f' || e.key === 'F') toggleFlag(currentQ)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [examState, currentQ, questions.length, selectAnswer, toggleFlag])

  const results = useMemo(() => {
    if (examState !== 'results' && examState !== 'review') return null
    const correctCount = questions.filter((q, i) => answers[i] === q.correct).length
    const wrongQuestions = questions.filter((q, i) => answers[i] !== undefined && answers[i] !== q.correct)
    const unanswered = questions.filter((q, i) => answers[i] === undefined)
    const accuracy = questions.length > 0 ? Math.round(correctCount / questions.length * 100) : 0

    const perCat: Record<string, { correct: number; total: number }> = {}
    questions.forEach((q, i) => {
      if (!perCat[q.cat]) perCat[q.cat] = { correct: 0, total: 0 }
      perCat[q.cat].total++
      if (answers[i] === q.correct) perCat[q.cat].correct++
    })

    return { correctCount, wrongQuestions, unanswered, accuracy, perCat }
  }, [examState, questions, answers])

  // ── SELECT screen ─────────────────────────────────────────────────────────
  if (examState === 'select') {
    return (
      <div className="p-4 sm:p-5 lg:p-6 max-w-2xl mx-auto space-y-5 pb-24 sm:pb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Mock <span className="text-gradient">Exam</span></h1>
          <p className="text-slate-400 text-sm mt-1">Simulate real exam conditions — no explanations until review</p>
        </div>
        <div className="space-y-3">
          {MODES.map(m => (
            <Card key={m.id} hover onClick={() => setSelectedMode(m.id)}
              className={`p-4 transition-all ${selectedMode === m.id ? 'border-indigo-500/60 shadow-lg shadow-indigo-500/10' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{m.label}</span>
                    {selectedMode === m.id && <Badge variant="indigo">Selected</Badge>}
                  </div>
                  <p className="text-xs text-slate-400">{m.desc}</p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm font-bold text-indigo-400">{m.questions} Q</div>
                  <div className="text-xs text-slate-500">{m.minutes} min</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Button size="lg" className="w-full" onClick={startExam}>
          <Timer className="w-5 h-5" /> Start {mode.label}
        </Button>
        <div className="text-xs text-slate-600 text-center space-y-0.5">
          <p>Exam mode: no explanations shown during the exam</p>
          <p>Use A/B/C/D keys to answer · F to flag · ← → to navigate</p>
          <p>All wrong answers saved to Error Notebook after submission</p>
        </div>
      </div>
    )
  }

  // ── EXAM screen ───────────────────────────────────────────────────────────
  if (examState === 'exam') {
    const q = questions[currentQ]
    const answeredCount = Object.keys(answers).length
    const flaggedCount = flagged.size
    const timerTotal = timerTotalRef.current || mode.minutes * 60

    return (
      <div className="p-4 sm:p-5 lg:p-6 max-w-2xl mx-auto space-y-4 pb-24 sm:pb-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <TimerRing timeLeft={timer.timeLeft} total={timerTotal} size={52} urgency={timer.urgency} />
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Q {currentQ + 1} / {questions.length}</span>
              <span>{answeredCount} answered · {flaggedCount > 0 ? `${flaggedCount} flagged` : ''}</span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
            </div>
          </div>
          <Button size="sm" variant="danger" onClick={submitExam}>Submit</Button>
        </div>

        {/* Question grid */}
        <div className="flex flex-wrap gap-1">
          {questions.map((_, i) => (
            <button key={i} onClick={() => setCurrentQ(i)}
              className={`w-7 h-7 rounded text-[10px] font-bold transition-all ${
                i === currentQ ? 'bg-indigo-600 text-white ring-2 ring-indigo-400' :
                flagged.has(i) ? 'bg-amber-600/40 text-amber-300 border border-amber-500/40' :
                answers[i] !== undefined ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/20' :
                'bg-white/[0.06] text-slate-500 hover:text-slate-300 hover:bg-white/[0.08]'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question card */}
        <Card className="p-5">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="slate">Q{currentQ + 1}</Badge>
              <Badge variant="indigo">{CAT_LABELS[q.cat] || q.cat}</Badge>
            </div>
            <button onClick={() => toggleFlag(currentQ)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                flagged.has(currentQ)
                  ? 'bg-amber-600/20 border-amber-500/40 text-amber-400'
                  : 'bg-white/5 border-white/10 text-slate-500 hover:text-amber-400 hover:border-amber-500/30'
              }`}>
              <Flag className="w-3 h-3" /> {flagged.has(currentQ) ? 'Flagged' : 'Flag (F)'}
            </button>
          </div>
          <p className="text-base font-medium text-white leading-relaxed mb-4">{q.q}</p>
          <div className="space-y-2">
            {q.opts.map((opt, i) => (
              <button key={i} onClick={() => selectAnswer(currentQ, i)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left ${
                  answers[currentQ] === i
                    ? 'bg-indigo-600/25 border-indigo-500 text-indigo-300 shadow-indigo-500/10 shadow-md'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-indigo-500/40'
                }`}>
                <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  answers[currentQ] === i ? 'bg-indigo-500 text-white' : 'bg-white/10'
                }`}>{ANSWER_LABELS[i]}</span>
                {opt}
              </button>
            ))}
          </div>
        </Card>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0} className="flex-1">← Prev</Button>
          <Button onClick={() => setCurrentQ(Math.min(questions.length - 1, currentQ + 1))}
            disabled={currentQ >= questions.length - 1} className="flex-1">Next →</Button>
        </div>
      </div>
    )
  }

  // ── RESULTS screen ────────────────────────────────────────────────────────
  if (examState === 'results' && results) {
    const totalTime = Math.round((Date.now() - sessionStart.current) / 1000)
    return (
      <div className="p-4 sm:p-5 lg:p-6 max-w-2xl mx-auto space-y-5 pb-24 sm:pb-6">
        {/* Score hero */}
        <div className="text-center py-2">
          <div className={`text-7xl font-black mb-2 ${results.accuracy >= 80 ? 'text-emerald-400' : results.accuracy >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
            {results.accuracy}%
          </div>
          <p className="text-slate-300 font-medium">{results.correctCount}/{questions.length} correct</p>
          <p className="text-xs text-slate-500 mt-1">
            {results.wrongQuestions.length} wrong · {results.unanswered.length} unanswered · {Math.floor(totalTime / 60)}m{totalTime % 60}s
          </p>
          {results.accuracy >= 85 && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-semibold">
              <CheckCircle className="w-4 h-4" /> Excellent exam performance!
            </div>
          )}
          {results.accuracy < 60 && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-amber-600/10 border border-amber-500/20 rounded-xl text-amber-400 text-sm">
              <AlertTriangle className="w-4 h-4" /> Review errors and drill weak categories
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <Card className="p-5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Category Breakdown</h3>
          <div className="space-y-2.5">
            {Object.entries(results.perCat)
              .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
              .map(([cat, data]) => {
                const pct = Math.round(data.correct / data.total * 100)
                const color = pct >= 80 ? '#10B981' : pct >= 60 ? '#F59E0B' : '#EF4444'
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-24 shrink-0">{CAT_LABELS[cat] || cat}</span>
                    <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                    <span className="text-xs font-bold w-10 text-right" style={{ color }}>{pct}%</span>
                    <span className="text-xs text-slate-600 w-8 text-right">{data.correct}/{data.total}</span>
                  </div>
                )
              })}
          </div>
        </Card>

        {/* Wrong answers review */}
        {results.wrongQuestions.length > 0 && (
          <Card className="p-5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Wrong Answers ({results.wrongQuestions.length})
            </h3>
            <div className="space-y-4">
              {questions
                .filter((q, i) => answers[i] !== undefined && answers[i] !== q.correct)
                .slice(0, 8)
                .map((q, idx) => {
                  const qIdx = questions.indexOf(q)
                  const userAns = answers[qIdx]
                  return (
                    <div key={idx} className="border-b border-white/[0.07] pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start gap-2 mb-2">
                        <Badge variant="slate">{CAT_LABELS[q.cat] || q.cat}</Badge>
                      </div>
                      <p className="text-xs text-slate-300 mb-2">{q.q}</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                          <span className="text-red-400">You: {q.opts[userAns]}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span className="text-emerald-400">Correct: {q.opts[q.correct]}</span>
                        </div>
                        {q.exp && <p className="text-xs text-slate-500 ml-5 mt-1">{q.exp}</p>}
                      </div>
                    </div>
                  )
                })}
              {results.wrongQuestions.length > 8 && (
                <p className="text-xs text-slate-500 text-center">
                  +{results.wrongQuestions.length - 8} more errors saved to Error Notebook
                </p>
              )}
            </div>
          </Card>
        )}

        <p className="text-xs text-center text-indigo-400">All wrong answers saved to Error Notebook</p>

        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => setExamState('select')} className="flex-1">
            <RotateCcw className="w-4 h-4" /> New Exam
          </Button>
          <Button variant="ghost" onClick={() => navigate('/errors')} className="flex-1">
            Review Errors
          </Button>
          <Button onClick={() => navigate('/')} className="flex-1">
            <BarChart2 className="w-4 h-4" /> Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return null
}
