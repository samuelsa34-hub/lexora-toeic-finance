import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Heart, Flame, Trophy, RotateCcw, ChevronRight, Timer, AlertTriangle } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { grammarQuestions } from '../../data/grammarQuestions'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useTimer } from '../../hooks/useTimer'
import { ANSWER_LABELS, CAT_LABELS } from '../../utils/constants'
import { xpForGapFill } from '../../utils/xpEngine'
import type { GrammarQuestion } from '../../types'

type GapMode = 'precision' | 'speed' | 'survival' | 'combo'
type LabState = 'menu' | 'playing' | 'gameover' | 'results'

const MODE_CONFIG: Record<GapMode, { label: string; icon: string; desc: string; color: string; timerSeconds: number | null; lives: number | null }> = {
  precision: {
    label: 'Precision',
    icon: '🎯',
    desc: 'No timer · Zero tolerance for errors · Think before you click',
    color: '#6366F1',
    timerSeconds: null,
    lives: null,
  },
  speed: {
    label: 'Speed Run',
    icon: '⚡',
    desc: '15 seconds per gap · Every second counts · +80% XP',
    color: '#F59E0B',
    timerSeconds: 15,
    lives: null,
  },
  survival: {
    label: 'Survival',
    icon: '❤️',
    desc: '3 lives · Wrong answer costs a life · +50% XP',
    color: '#EF4444',
    timerSeconds: null,
    lives: 3,
  },
  combo: {
    label: 'Combo',
    icon: '🔥',
    desc: 'Build streak multiplier · Wrong answer resets combo · +40% XP',
    color: '#10B981',
    timerSeconds: null,
    lives: null,
  },
}

function buildPool(count: number): GrammarQuestion[] {
  return [...grammarQuestions].sort(() => Math.random() - 0.5).slice(0, Math.min(count, grammarQuestions.length))
}

function highlightBlank(q: string): React.ReactNode {
  const parts = q.split('_____')
  if (parts.length === 1) return <span>{q}</span>
  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="inline-block mx-1 px-3 py-0.5 rounded-lg bg-indigo-600/20 border border-indigo-500/50 text-indigo-300 font-bold text-base min-w-[80px] text-center">
              ______
            </span>
          )}
        </React.Fragment>
      ))}
    </>
  )
}

export const GapFillLab: React.FC = () => {
  const navigate = useNavigate()
  const { addXP, advanceMission } = useAppStore()

  const [labState, setLabState] = useState<LabState>('menu')
  const [mode, setMode] = useState<GapMode>('combo')
  const [questionCount, setQuestionCount] = useState(15)

  const [questions, setQuestions] = useState<GrammarQuestion[]>([])
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const answeredRef = useRef(false)
  const startTimeRef = useRef<number>(Date.now())

  // Stats
  const [correct, setCorrect] = useState(0)
  const [lives, setLives] = useState(3)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [results, setResults] = useState<{ q: GrammarQuestion; userAns: number; time: number }[]>([])
  const [sessionXP, setSessionXP] = useState(0)

  const cfg = MODE_CONFIG[mode]

  const timer = useTimer(cfg.timerSeconds ?? 15, () => {
    if (mode === 'speed' && !answeredRef.current) handleAnswer(-1)
  })

  const q = questions[idx]

  const startGame = useCallback(() => {
    const pool = buildPool(questionCount)
    setQuestions(pool)
    setIdx(0)
    setSelected(null)
    setAnswered(false)
    answeredRef.current = false
    setCorrect(0)
    setLives(cfg.lives ?? 3)
    setCombo(0)
    setMaxCombo(0)
    setResults([])
    startTimeRef.current = Date.now()
    if (mode === 'speed') timer.restart(15)
    else timer.pause()
    setLabState('playing')
  }, [questionCount, cfg.lives, mode, timer])

  const handleAnswer = useCallback((answerIdx: number) => {
    if (answeredRef.current || !q) return
    answeredRef.current = true
    if (mode === 'speed') timer.pause()

    const isCorrect = answerIdx === q.correct
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000)

    setSelected(answerIdx)
    setAnswered(true)
    setResults(prev => [...prev, { q, userAns: answerIdx, time: timeSpent }])

    if (isCorrect) {
      setCorrect(prev => prev + 1)
      setCombo(prev => {
        const next = prev + 1
        setMaxCombo(m => Math.max(m, next))
        return next
      })
    } else {
      if (mode === 'combo') setCombo(0)
      if (mode === 'survival') {
        setLives(prev => {
          const next = prev - 1
          if (next <= 0) {
            setTimeout(() => setLabState('gameover'), 800)
          }
          return next
        })
      }
    }
  }, [q, mode, timer])

  const nextQuestion = useCallback(() => {
    if (idx + 1 >= questions.length) {
      const xp = xpForGapFill(correct, mode, maxCombo)
      setSessionXP(xp)
      addXP(xp)
      advanceMission(`dm_grammar_${new Date().toDateString()}`, questions.length)
      setLabState('results')
      return
    }
    setIdx(prev => prev + 1)
    setSelected(null)
    setAnswered(false)
    answeredRef.current = false
    startTimeRef.current = Date.now()
    if (mode === 'speed') timer.restart(15)
  }, [idx, questions.length, correct, mode, maxCombo, addXP, advanceMission, timer])

  // Keyboard shortcuts
  useEffect(() => {
    if (labState !== 'playing') return
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (['a', 'A', '1'].includes(e.key) && !answered) handleAnswer(0)
      else if (['b', 'B', '2'].includes(e.key) && !answered) handleAnswer(1)
      else if (['c', 'C', '3'].includes(e.key) && !answered) handleAnswer(2)
      else if (['d', 'D', '4'].includes(e.key) && !answered) handleAnswer(3)
      else if ((e.key === ' ' || e.key === 'Enter') && answered) { e.preventDefault(); nextQuestion() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [labState, answered, handleAnswer, nextQuestion])

  // ── MENU ──────────────────────────────────────────────────────────────────
  if (labState === 'menu') {
    return (
      <div className="p-4 sm:p-5 lg:p-6 max-w-2xl mx-auto space-y-6 pb-24 sm:pb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Gap Fill <span className="text-gradient">Lab</span></h1>
          <p className="text-slate-400 text-sm mt-1">Complete the sentence — 4 game modes · 100 Part 5 patterns</p>
        </div>

        {/* Mode Selector */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Select Mode</label>
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(MODE_CONFIG) as [GapMode, typeof MODE_CONFIG[GapMode]][]).map(([key, cfg]) => (
              <button key={key} onClick={() => setMode(key)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  mode === key ? 'border-opacity-60 shadow-lg' : 'border-white/10 bg-white/3 hover:bg-white/5'
                }`}
                style={mode === key ? {
                  borderColor: cfg.color,
                  background: `${cfg.color}10`,
                  boxShadow: `0 4px 20px ${cfg.color}15`,
                } : {}}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{cfg.icon}</span>
                  <span className="text-sm font-bold text-white">{cfg.label}</span>
                  {mode === key && <Badge variant="indigo">Selected</Badge>}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{cfg.desc}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                  {cfg.timerSeconds && <span className="flex items-center gap-1"><Timer className="w-3 h-3" />{cfg.timerSeconds}s</span>}
                  {cfg.lives && <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{cfg.lives} lives</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Questions</label>
          <div className="flex gap-2">
            {[10, 15, 25].map(n => (
              <button key={n} onClick={() => setQuestionCount(n)}
                className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all flex-1 ${
                  questionCount === n ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}>
                {n} gaps
              </button>
            ))}
          </div>
        </div>

        <Button size="lg" className="w-full" onClick={startGame}>
          {cfg.icon} Launch {cfg.label} · {questionCount} questions
        </Button>
      </div>
    )
  }

  // ── GAME OVER (survival only) ─────────────────────────────────────────────
  if (labState === 'gameover') {
    const accuracy = results.length > 0 ? Math.round(correct / results.length * 100) : 0
    return (
      <div className="p-4 sm:p-5 lg:p-6 max-w-2xl mx-auto space-y-5 pb-24 sm:pb-6 text-center">
        <div className="text-6xl mb-2">💀</div>
        <h2 className="text-2xl font-black text-red-400">Eliminated</h2>
        <p className="text-slate-400">You ran out of lives after {results.length} questions</p>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-white">{correct}</div>
            <div className="text-xs text-slate-500 mt-1">Correct</div>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-amber-400">{accuracy}%</div>
            <div className="text-xs text-slate-500 mt-1">Accuracy</div>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-orange-400">{maxCombo}×</div>
            <div className="text-xs text-slate-500 mt-1">Best Combo</div>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button onClick={startGame} className="flex-1"><RotateCcw className="w-4 h-4" /> Retry</Button>
          <Button onClick={() => setLabState('menu')} variant="ghost" className="flex-1">Change Mode</Button>
        </div>
      </div>
    )
  }

  // ── RESULTS ───────────────────────────────────────────────────────────────
  if (labState === 'results') {
    const accuracy = questions.length > 0 ? Math.round(correct / questions.length * 100) : 0
    const wrongAnswers = results.filter(r => r.userAns !== r.q.correct)
    return (
      <div className="p-4 sm:p-5 lg:p-6 max-w-2xl mx-auto space-y-5 pb-24 sm:pb-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-5xl">
            {accuracy >= 90 ? '🏆' : accuracy >= 75 ? '⭐' : accuracy >= 60 ? '👍' : '💪'}
          </div>
          <div className={`text-5xl font-black ${accuracy >= 80 ? 'text-emerald-400' : accuracy >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
            {accuracy}%
          </div>
          <p className="text-slate-400">{correct} / {questions.length} gaps filled correctly</p>
        </div>

        {/* XP */}
        <div className="flex items-center justify-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="text-lg font-bold text-amber-400">+{sessionXP} XP</span>
          <span className="text-xs text-slate-500">· {MODE_CONFIG[mode].label} mode</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-orange-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4" /> {maxCombo}×
            </div>
            <div className="text-xs text-slate-500 mt-1">Best Combo</div>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-emerald-400">{correct}</div>
            <div className="text-xs text-slate-500 mt-1">Correct</div>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-red-400">{questions.length - correct}</div>
            <div className="text-xs text-slate-500 mt-1">Missed</div>
          </div>
        </div>

        {/* Wrong answers review */}
        {wrongAnswers.length > 0 && (
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Missed Gaps — Review
            </h3>
            <div className="space-y-3">
              {wrongAnswers.slice(0, 5).map(({ q: question, userAns }, i) => (
                <div key={i} className="border border-stone-200 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                    {question.q.replace('_____', `[${question.opts[question.correct]}]`)}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-red-400 line-through">{userAns >= 0 ? question.opts[userAns] : 'Timeout'}</span>
                    <span className="text-slate-600">→</span>
                    <span className="text-emerald-400 font-semibold">{question.opts[question.correct]}</span>
                    <Badge variant="slate" className="ml-auto">{CAT_LABELS[question.cat] || question.cat}</Badge>
                  </div>
                  {question.trap && (
                    <p className="text-xs text-amber-400 mt-1.5">⚠ {question.trap}</p>
                  )}
                </div>
              ))}
              {wrongAnswers.length > 5 && (
                <p className="text-xs text-slate-600 text-center">+{wrongAnswers.length - 5} more — check Error Notebook</p>
              )}
            </div>
          </Card>
        )}

        <div className="flex flex-wrap gap-2">
          <Button onClick={startGame} className="flex-1">
            <RotateCcw className="w-4 h-4" /> Play Again
          </Button>
          <Button onClick={() => setLabState('menu')} variant="ghost" className="flex-1">
            Change Mode
          </Button>
          <Button onClick={() => navigate('/')} variant="ghost" className="flex-1">
            Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // ── PLAYING ───────────────────────────────────────────────────────────────
  if (labState === 'playing' && q) {
    const livesLeft = lives
    const comboColor = combo >= 5 ? '#FBBF24' : combo >= 3 ? '#F97316' : combo >= 2 ? '#10B981' : '#6366F1'

    return (
      <div className="p-4 sm:p-5 lg:p-6 max-w-2xl mx-auto space-y-4 pb-24 sm:pb-6">
        {/* Top bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-mono w-12">{idx + 1}/{questions.length}</span>
          <div className="flex-1 h-1.5 bg-stone-50 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300"
              style={{ width: `${((idx + 1) / questions.length) * 100}%`, backgroundColor: cfg.color }} />
          </div>

          {/* Survival: lives */}
          {mode === 'survival' && (
            <div className="flex gap-1 flex-shrink-0">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart key={i} className={`w-4 h-4 ${i < livesLeft ? 'text-red-400' : 'text-slate-700'}`}
                  fill={i < livesLeft ? '#EF4444' : 'transparent'} />
              ))}
            </div>
          )}

          {/* Combo mode: streak counter */}
          {mode === 'combo' && combo > 1 && (
            <div className="flex items-center gap-1 flex-shrink-0 font-bold text-sm" style={{ color: comboColor }}>
              <Flame className="w-4 h-4" /> {combo}×
            </div>
          )}

          {/* Speed mode: timer ring */}
          {mode === 'speed' && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className={`text-sm font-bold font-mono ${timer.timeLeft <= 5 ? 'text-red-400' : 'text-slate-400'}`}>
                {timer.timeLeft}s
              </div>
              <div className="w-6 h-6 relative">
                <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="#1E293B" strokeWidth="3" />
                  <circle cx="12" cy="12" r="10" fill="none" strokeWidth="3"
                    stroke={timer.timeLeft <= 5 ? '#EF4444' : '#F59E0B'}
                    strokeDasharray={`${2 * Math.PI * 10}`}
                    strokeDashoffset={`${2 * Math.PI * 10 * (1 - timer.timeLeft / 15)}`}
                    className="transition-all duration-1000" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Mode badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm">{cfg.icon}</span>
          <span className="text-xs font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
          <Badge variant="slate">{CAT_LABELS[q.cat] || q.cat}</Badge>
        </div>

        {/* Question sentence */}
        <Card className="p-5">
          <p className="text-base lg:text-lg font-medium text-white leading-relaxed">
            {highlightBlank(q.q)}
          </p>
          {q.rule && (
            <p className="text-xs text-slate-600 mt-2 italic">{q.rule}</p>
          )}
        </Card>

        {/* Answer options */}
        <div className="grid grid-cols-2 gap-2">
          {q.opts.map((opt, i) => {
            let cls = 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-indigo-500/40'
            if (answered) {
              if (i === q.correct) cls = 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
              else if (i === selected && i !== q.correct) cls = 'bg-red-600/20 border-red-500 text-red-300'
              else cls = 'bg-white/3 border-white/5 text-slate-600'
            }
            return (
              <button key={i} onClick={() => !answered && handleAnswer(i)} disabled={answered}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all text-left ${cls}`}>
                <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  answered && i === q.correct ? 'bg-emerald-500 text-white' :
                  answered && i === selected ? 'bg-red-500 text-white' : 'bg-white/10'
                }`}>{ANSWER_LABELS[i]}</span>
                {opt}
              </button>
            )
          })}
        </div>

        {/* Explanation after answer */}
        {answered && (
          <Card className="p-3 border-indigo-500/20 bg-indigo-600/5">
            <p className="text-xs text-slate-300">{q.exp}</p>
            {q.trap && (
              <p className="text-xs text-amber-400 mt-1.5 flex items-start gap-1.5">
                <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                {q.trap}
              </p>
            )}
            {q.fr && (
              <p className="text-xs text-indigo-400 mt-1.5 flex items-start gap-1.5">
                <span className="flex-shrink-0">🇫🇷</span>
                {q.fr}
              </p>
            )}
          </Card>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span className="text-emerald-400">✓ {correct}</span>
            <span className="text-red-400">✗ {idx + 1 - correct - (answered ? 0 : 1)}</span>
          </div>
          {answered && (
            <Button onClick={nextQuestion} className="gap-1.5">
              {idx + 1 >= questions.length ? <><Trophy className="w-4 h-4" /> Finish</> : <>Next <ChevronRight className="w-4 h-4" /></>}
              <span className="text-xs opacity-60 hidden sm:inline">Space</span>
            </Button>
          )}
        </div>
      </div>
    )
  }

  return null
}
