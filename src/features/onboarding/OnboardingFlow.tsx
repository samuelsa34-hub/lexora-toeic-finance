import React, { useState, useEffect } from 'react'
import { Target, CalendarDays, Clock, ChevronRight, CheckCircle2, Zap, BookOpen, Brain, TrendingUp, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { placementQuestions, scoreToBand, CAT_TO_LESSON, PLACEMENT_CAT_LABELS, type PlacementQuestion } from '../../data/placementQuestions'
import { Logo } from '../../components/ui/Logo'
import type { PlacementResults } from '../../store/useAppStore'

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = 'goals' | 'intro' | 'test' | 'results'

interface Goals {
  targetScore: number
  examDate: string
  dailyMinutes: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function computeResults(answers: Record<number, number>): PlacementResults {
  const catAcc: Record<string, { correct: number; total: number; pct: number }> = {}
  let correct = 0

  for (const q of placementQuestions) {
    const given = answers[q.id]
    const isCorrect = given === q.correct
    if (isCorrect) correct++
    if (!catAcc[q.cat]) catAcc[q.cat] = { correct: 0, total: 0, pct: 0 }
    catAcc[q.cat].total++
    if (isCorrect) catAcc[q.cat].correct++
  }
  for (const cat of Object.keys(catAcc)) {
    catAcc[cat].pct = Math.round((catAcc[cat].correct / catAcc[cat].total) * 100)
  }

  const accuracy = correct / placementQuestions.length
  const band = scoreToBand(accuracy)

  const sorted = Object.entries(catAcc).sort((a, b) => a[1].pct - b[1].pct)
  const weakCategories = sorted.filter(([, v]) => v.pct < 60).map(([k]) => k)
  const strongCategories = sorted.filter(([, v]) => v.pct >= 70).map(([k]) => k)

  const recommendedLessonIds = weakCategories
    .map(c => CAT_TO_LESSON[c])
    .filter(Boolean)
    .filter((id, i, a) => a.indexOf(id) === i)
    .slice(0, 4)

  return {
    totalQuestions: placementQuestions.length,
    correctAnswers: correct,
    accuracy: Math.round(accuracy * 100),
    estimatedScore: band.midpoint,
    estimatedRange: band.range,
    levelBand: band.level,
    categoryAccuracy: catAcc,
    weakCategories,
    strongCategories,
    recommendedLessonIds,
    completedAt: Date.now(),
  }
}

// ── Step 1: Goals ─────────────────────────────────────────────────────────────

function GoalsStep({ initial, onNext }: { initial: Goals; onNext: (g: Goals) => void }) {
  const [goals, setGoals] = useState<Goals>(initial)

  const TARGET_OPTIONS = [
    { score: 550,  label: '550',  sub: 'Entry level' },
    { score: 650,  label: '650',  sub: 'Intermediate' },
    { score: 785,  label: '785',  sub: 'Professional' },
    { score: 860,  label: '860',  sub: 'Advanced' },
    { score: 900,  label: '900',  sub: 'Expert' },
    { score: 950,  label: '950+', sub: 'Near-perfect' },
  ]

  const TIME_OPTIONS = [
    { min: 20,  label: '20 min / day' },
    { min: 40,  label: '40 min / day' },
    { min: 60,  label: '1 hour / day' },
    { min: 90,  label: '90 min / day' },
    { min: 120, label: '2 hours / day' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--dp-text-1)', margin: '0 0 6px' }}>
          What's your TOEIC goal?
        </h2>
        <p style={{ fontSize: 14, color: 'var(--dp-text-3)', margin: 0 }}>
          We'll build a learning plan tailored to you.
        </p>
      </div>

      {/* Target score */}
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--dp-text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>
          <Target size={13} /> Target TOEIC Score
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {TARGET_OPTIONS.map(opt => (
            <button
              key={opt.score}
              onClick={() => setGoals(g => ({ ...g, targetScore: opt.score }))}
              style={{
                padding: '10px 8px',
                borderRadius: 12,
                border: goals.targetScore === opt.score ? '1.5px solid #6366F1' : '1.5px solid var(--dp-border-sm)',
                background: goals.targetScore === opt.score ? 'rgba(99,102,241,0.12)' : 'var(--dp-surface)',
                color: goals.targetScore === opt.score ? '#818CF8' : 'var(--dp-text-2)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 17, fontWeight: 800 }}>{opt.label}</div>
              <div style={{ fontSize: 11, opacity: 0.65, marginTop: 2 }}>{opt.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Exam date */}
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--dp-text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>
          <CalendarDays size={13} /> Exam date <span style={{ textTransform: 'none', fontSize: 11, fontWeight: 400, letterSpacing: 0, opacity: 0.6 }}>(optional)</span>
        </label>
        <input
          type="date"
          value={goals.examDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={e => setGoals(g => ({ ...g, examDate: e.target.value }))}
          className="input-premium"
        />
      </div>

      {/* Study time */}
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--dp-text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>
          <Clock size={13} /> Available study time
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TIME_OPTIONS.map(opt => (
            <button
              key={opt.min}
              onClick={() => setGoals(g => ({ ...g, dailyMinutes: opt.min }))}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: goals.dailyMinutes === opt.min ? '1.5px solid #6366F1' : '1.5px solid var(--dp-border-sm)',
                background: goals.dailyMinutes === opt.min ? 'rgba(99,102,241,0.12)' : 'var(--dp-surface)',
                color: goals.dailyMinutes === opt.min ? '#818CF8' : 'var(--dp-text-2)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                transition: 'all 0.15s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onNext(goals)}
        style={{
          padding: '15px 0',
          borderRadius: 14,
          border: 'none',
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          color: '#fff',
          fontWeight: 800,
          fontSize: 15,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
        }}
      >
        Continue <ChevronRight size={16} />
      </button>
    </div>
  )
}

// ── Step 2: Placement Test Intro ──────────────────────────────────────────────

function TestIntroStep({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'center' }}>
      <div>
        <div style={{
          width: 64, height: 64, borderRadius: 20, margin: '0 auto 16px',
          background: 'rgba(99,102,241,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Brain size={30} style={{ color: '#818CF8' }} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--dp-text-1)', margin: '0 0 8px' }}>
          Placement Test
        </h2>
        <p style={{ fontSize: 14, color: 'var(--dp-text-3)', margin: 0, lineHeight: 1.6 }}>
          25 short questions — about 8 minutes.<br />
          We'll estimate your current level and build your plan.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { icon: BookOpen, text: 'Grammar · Vocabulary · Word forms · Connectors' },
          { icon: TrendingUp, text: 'Estimates your TOEIC range (e.g. 500–650)' },
          { icon: Target, text: 'Identifies your strengths and weaknesses' },
          { icon: Sparkles, text: 'Generates your personalized first learning plan' },
        ].map(({ icon: Icon, text }, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px', borderRadius: 12,
            background: 'var(--dp-surface)', border: '1px solid var(--dp-border-xs)',
            textAlign: 'left',
          }}>
            <Icon size={16} style={{ color: '#818CF8', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--dp-text-2)' }}>{text}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: 'var(--dp-text-3)', margin: 0 }}>
        This is not a scored test. There's no pass or fail.<br />
        Just answer honestly and we'll do the rest.
      </p>

      <button
        onClick={onStart}
        style={{
          padding: '15px 0',
          borderRadius: 14,
          border: 'none',
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          color: '#fff',
          fontWeight: 800,
          fontSize: 15,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
        }}
      >
        Start Placement Test <ArrowRight size={16} />
      </button>
    </div>
  )
}

// ── Step 3: The test itself ───────────────────────────────────────────────────

function TestStep({ onDone }: { onDone: (answers: Record<number, number>) => void }) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const q: PlacementQuestion = placementQuestions[current]
  const total = placementQuestions.length
  const progress = ((current + (revealed ? 1 : 0)) / total) * 100

  function handleSelect(idx: number) {
    if (revealed) return
    setSelected(idx)
    setRevealed(true)
    setAnswers(prev => ({ ...prev, [q.id]: idx }))
  }

  function handleNext() {
    if (current < total - 1) {
      setCurrent(i => i + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      onDone({ ...answers, [q.id]: selected ?? 0 })
    }
  }

  const isCorrect = selected === q.correct

  const OPTS = ['A', 'B', 'C', 'D']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--dp-text-3)', fontWeight: 600 }}>
            Question {current + 1} of {total}
          </span>
          <span style={{ fontSize: 12, color: 'var(--dp-text-3)' }}>
            {q.cat in PLACEMENT_CAT_LABELS ? PLACEMENT_CAT_LABELS[q.cat] : q.cat}
          </span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'var(--dp-border-sm)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
            borderRadius: 2,
            transition: 'width 0.35s ease',
          }} />
        </div>
      </div>

      {/* Question */}
      <p style={{
        fontSize: 16, fontWeight: 600, lineHeight: 1.6,
        color: 'var(--dp-text-1)', margin: 0,
        padding: '16px 18px', borderRadius: 12,
        background: 'var(--dp-surface)', border: '1px solid var(--dp-border-sm)',
      }}>
        {q.q}
      </p>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {q.opts.map((opt, i) => {
          let bg = 'var(--dp-surface)'
          let borderColor = 'var(--dp-border-sm)'
          let color = 'var(--dp-text-1)'

          if (revealed) {
            if (i === q.correct) {
              bg = 'rgba(16,185,129,0.10)'
              borderColor = 'rgba(16,185,129,0.45)'
              color = '#10B981'
            } else if (i === selected && !isCorrect) {
              bg = 'rgba(244,63,94,0.10)'
              borderColor = 'rgba(244,63,94,0.45)'
              color = '#F43F5E'
            }
          } else if (selected === i) {
            bg = 'rgba(99,102,241,0.10)'
            borderColor = '#6366F1'
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '13px 16px', borderRadius: 12,
                border: `1.5px solid ${borderColor}`,
                background: bg, color,
                cursor: revealed ? 'default' : 'pointer',
                textAlign: 'left', fontFamily: 'inherit',
                transition: 'all 0.18s',
                fontWeight: revealed && i === q.correct ? 700 : 500,
                fontSize: 14,
              }}
            >
              <span style={{
                width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800,
                background: revealed && i === q.correct
                  ? 'rgba(16,185,129,0.2)'
                  : revealed && i === selected && !isCorrect
                  ? 'rgba(244,63,94,0.2)'
                  : 'rgba(255,255,255,0.06)',
                color: 'inherit',
              }}>
                {OPTS[i]}
              </span>
              {opt}
              {revealed && i === q.correct && <CheckCircle2 size={14} style={{ marginLeft: 'auto', flexShrink: 0 }} />}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div style={{
          padding: '12px 14px', borderRadius: 10,
          background: isCorrect ? 'rgba(16,185,129,0.07)' : 'rgba(244,63,94,0.07)',
          border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.22)' : 'rgba(244,63,94,0.22)'}`,
          fontSize: 13, lineHeight: 1.55,
          color: 'var(--dp-text-2)',
        }}>
          <strong style={{ color: isCorrect ? '#10B981' : '#F43F5E' }}>
            {isCorrect ? '✓ Correct — ' : '✗ Incorrect — '}
          </strong>
          {q.exp}
        </div>
      )}

      {/* Next button */}
      {revealed && (
        <button
          onClick={handleNext}
          style={{
            padding: '13px 0', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          {current < total - 1 ? 'Next question' : 'See my results'} <ChevronRight size={15} />
        </button>
      )}
    </div>
  )
}

// ── Step 4: Results ───────────────────────────────────────────────────────────

function ResultsStep({ results, onFinish }: { results: PlacementResults; onFinish: () => void }) {
  const pctColor = results.accuracy >= 70 ? '#10B981' : results.accuracy >= 50 ? '#F59E0B' : '#F43F5E'

  const sorted = Object.entries(results.categoryAccuracy)
    .sort((a, b) => a[1].pct - b[1].pct)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Score card */}
      <div style={{
        borderRadius: 20, padding: '24px 20px', textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)',
        border: '1px solid rgba(99,102,241,0.22)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#818CF8', textTransform: 'uppercase', marginBottom: 8 }}>
          Estimated TOEIC Range
        </div>
        <div style={{ fontSize: 48, fontWeight: 900, color: '#818CF8', lineHeight: 1 }}>
          {results.estimatedRange}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--dp-text-1)', marginTop: 6 }}>
          {results.levelBand}
        </div>
        <div style={{ fontSize: 13, color: 'var(--dp-text-3)', marginTop: 4 }}>
          {results.correctAnswers} / {results.totalQuestions} correct · {results.accuracy}% accuracy
        </div>
        <div style={{ fontSize: 11, color: 'var(--dp-text-3)', marginTop: 8, fontStyle: 'italic' }}>
          This is an estimate — not an official score. Keep practicing to improve.
        </div>
      </div>

      {/* Category breakdown */}
      <div>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--dp-text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          Your results by category
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sorted.map(([cat, data]) => {
            const label = PLACEMENT_CAT_LABELS[cat] ?? cat
            const barColor = data.pct >= 70 ? '#10B981' : data.pct >= 50 ? '#F59E0B' : '#F43F5E'
            return (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: 'var(--dp-text-2)', width: 140, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--dp-border-sm)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${data.pct}%`, background: barColor, borderRadius: 3, transition: 'width 0.5s' }} />
                </div>
                <span style={{ fontSize: 12, color: 'var(--dp-text-3)', width: 36, textAlign: 'right', fontWeight: 600 }}>{data.pct}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Focus areas */}
      {results.weakCategories.length > 0 && (
        <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.22)' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <AlertTriangle size={14} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#F59E0B' }}>Focus areas for you</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {results.weakCategories.map(cat => (
              <span key={cat} style={{
                fontSize: 12, padding: '4px 10px', borderRadius: 6,
                background: 'rgba(245,158,11,0.12)', color: '#D97706',
                border: '1px solid rgba(245,158,11,0.25)', fontWeight: 600,
              }}>
                {PLACEMENT_CAT_LABELS[cat] ?? cat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended plan */}
      {results.recommendedLessonIds.length > 0 && (
        <div>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--dp-text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>
            Your first steps
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: BookOpen, color: '#6366F1', text: `Start with ${results.recommendedLessonIds.length} targeted lessons` },
              { icon: Zap, color: '#F59E0B', text: 'Complete daily grammar drills in your weak categories' },
              { icon: Brain, color: '#10B981', text: 'Add vocabulary flashcards for business English terms' },
            ].map(({ icon: Icon, color, text }, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 10,
                background: 'var(--dp-surface)', border: '1px solid var(--dp-border-xs)',
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}18`, flexShrink: 0 }}>
                  <Icon size={14} style={{ color }} />
                </div>
                <span style={{ fontSize: 13, color: 'var(--dp-text-2)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onFinish}
        style={{
          padding: '16px 0', borderRadius: 14, border: 'none',
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 4px 24px rgba(99,102,241,0.40)',
        }}
      >
        Start My Learning Plan <ArrowRight size={17} />
      </button>
    </div>
  )
}

// ── Main OnboardingFlow ───────────────────────────────────────────────────────

export default function OnboardingFlow({ onComplete, initialStep = 'goals' }: { onComplete: () => void; initialStep?: Step }) {
  const store = useAppStore()
  const [step, setStep] = useState<Step>(initialStep)
  const [results, setResults] = useState<PlacementResults | null>(null)

  const STEP_ORDER: Step[] = ['goals', 'intro', 'test', 'results']
  const stepIdx = STEP_ORDER.indexOf(step)

  // Save goals to store immediately so data isn't lost
  const handleGoalsDone = (goals: Goals) => {
    store.updateProfile({
      targetScore: goals.targetScore,
      examDate: goals.examDate || null,
      dailyGoalMinutes: goals.dailyMinutes,
    })
    setStep('intro')
  }

  const handleTestDone = (answers: Record<number, number>) => {
    const r = computeResults(answers)
    setResults(r)
    setStep('results')
  }

  const handleFinish = () => {
    if (results) {
      store.completePlacementTest(results)
    }
    onComplete()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--dp-bg)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--dp-border-xs)',
        flexShrink: 0,
      }}>
        <Logo variant="compact" iconSize={26} />
        {/* Step indicator dots */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {['goals', 'intro', 'test', 'results'].map((s, i) => (
            <div key={s} style={{
              width: i === stepIdx ? 20 : 7,
              height: 7,
              borderRadius: 4,
              background: i <= stepIdx ? '#6366F1' : 'var(--dp-border-sm)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px 40px' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>

          {step === 'goals' && (
            <GoalsStep
              initial={{ targetScore: store.profile.targetScore || 785, examDate: store.profile.examDate ?? '', dailyMinutes: store.profile.dailyGoalMinutes || 60 }}
              onNext={handleGoalsDone}
            />
          )}

          {step === 'intro' && (
            <TestIntroStep onStart={() => setStep('test')} />
          )}

          {step === 'test' && (
            <TestStep onDone={handleTestDone} />
          )}

          {step === 'results' && results && (
            <ResultsStep results={results} onFinish={handleFinish} />
          )}
        </div>
      </div>
    </div>
  )
}
