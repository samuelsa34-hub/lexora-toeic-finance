import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { ChevronRight, ChevronLeft, RotateCcw, Sparkles, CheckCircle, XCircle, BookOpen, Zap, Trophy } from 'lucide-react'
import { flashCards, FlashCard, FlashCat, CAT_CONFIG } from '../../data/flashCards'

// ── Helpers ───────────────────────────────────────────────────────────────────

function DiffDots({ level, accent }: { level: FlashCard['difficulty']; accent: string }) {
  const filled = level === 'easy' ? 1 : level === 'medium' ? 2 : 3
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map(i => (
        <div key={i} className="w-2 h-2 rounded-full transition-all"
          style={{ background: i <= filled ? accent : 'rgba(255,255,255,0.12)' }} />
      ))}
    </div>
  )
}

function Sentence({
  text, accent, filledAnswer,
}: { text: string; accent: string; filledAnswer?: string }) {
  const parts = text.split('___')
  if (parts.length === 1) return <>{text}</>
  return (
    <>
      {parts[0]}
      {filledAnswer ? (
        <span style={{
          color: accent, fontWeight: 800,
          background: `${accent}22`, borderRadius: 6,
          padding: '1px 10px', borderBottom: `2px solid ${accent}`,
        }}>
          {filledAnswer}
        </span>
      ) : (
        <span style={{
          borderBottom: `2px solid ${accent}60`,
          color: 'rgba(255,255,255,0.25)',
          fontWeight: 600, padding: '0 14px',
          minWidth: 52, display: 'inline-block', textAlign: 'center',
        }}>
          ___
        </span>
      )}
      {parts[1]}
    </>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function FlashDrill() {
  const [selectedCat, setSelectedCat] = useState<FlashCat | 'all'>('all')
  const [cardIndex, setCardIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showExp, setShowExp] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [sliding, setSliding] = useState<'left' | 'right' | null>(null)

  const deck = useMemo(
    () => selectedCat === 'all' ? flashCards : flashCards.filter(c => c.cat === selectedCat),
    [selectedCat],
  )

  const card = deck[Math.min(cardIndex, deck.length - 1)]
  const cfg = card ? CAT_CONFIG[card.cat] : null
  const answeredIdx = card ? answers[card.id] : undefined
  const answered = answeredIdx !== undefined
  const isCorrect = answered && answeredIdx === card?.correct
  const isLastCard = cardIndex === deck.length - 1

  const answeredCount = deck.filter(c => answers[c.id] !== undefined).length
  const correctCount = deck.filter(c => answers[c.id] === c.correct).length

  const catCounts = useMemo(() => {
    const m: Record<string, number> = {}
    flashCards.forEach(c => { m[c.cat] = (m[c.cat] || 0) + 1 })
    return m
  }, [])

  const navigate = useCallback((dir: 'next' | 'prev') => {
    const nextIdx = dir === 'next' ? cardIndex + 1 : cardIndex - 1
    if (nextIdx < 0 || nextIdx >= deck.length) return
    setSliding(dir === 'next' ? 'left' : 'right')
    setTimeout(() => {
      setCardIndex(nextIdx)
      const nextCard = deck[nextIdx]
      setShowExp(nextCard ? answers[nextCard.id] !== undefined : false)
      setSliding(null)
    }, 140)
  }, [cardIndex, deck, answers])

  const handleAnswer = useCallback((i: number) => {
    if (!card || answered) return
    setAnswers(p => ({ ...p, [card.id]: i }))
    setShowExp(true)
  }, [card, answered])

  const handleCatChange = (cat: FlashCat | 'all') => {
    setSelectedCat(cat)
    setCardIndex(0)
    setShowExp(false)
    setShowSummary(false)
  }

  const handleReset = () => {
    setAnswers({})
    setCardIndex(0)
    setShowExp(false)
    setShowSummary(false)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return
      if (!card) return
      if (e.key === '1') handleAnswer(0)
      else if (e.key === '2') handleAnswer(1)
      else if (e.key === '3') handleAnswer(2)
      else if (e.key === '4') handleAnswer(3)
      else if ((e.key === 'ArrowRight' || e.key === 'Enter') && answered) {
        if (isLastCard) setShowSummary(true)
        else navigate('next')
      }
      else if (e.key === 'ArrowLeft') navigate('prev')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [card, answered, handleAnswer, navigate, isLastCard])

  // ── Summary screen ──────────────────────────────────────────────────────────
  if (showSummary) {
    const pct = deck.length > 0 ? Math.round((correctCount / deck.length) * 100) : 0
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '💪' : '📚'
    const msg = pct >= 80
      ? "Excellent! You're mastering these patterns."
      : pct >= 60
      ? 'Good progress — review the ones you missed.'
      : 'Keep practicing — every attempt builds recall.'

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ background: 'linear-gradient(135deg, #060B14 0%, #0d1a2e 100%)' }}>
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-5">{emoji}</div>
          <div className="text-4xl font-extrabold text-white mb-1">{pct}%</div>
          <div className="text-slate-400 mb-1 font-medium">
            {correctCount} / {deck.length} correct
          </div>
          <p className="text-sm text-slate-500 mb-10">{msg}</p>

          {/* Per-category breakdown */}
          {selectedCat === 'all' && (
            <div className="mb-8 text-left rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
              {(Object.keys(CAT_CONFIG) as FlashCat[]).map(cat => {
                const catCards = deck.filter(c => c.cat === cat)
                if (catCards.length === 0) return null
                const catCorrect = catCards.filter(c => answers[c.id] === c.correct).length
                const catAnswered = catCards.filter(c => answers[c.id] !== undefined).length
                const catPct = catAnswered > 0 ? Math.round((catCorrect / catAnswered) * 100) : null
                const c = CAT_CONFIG[cat]
                return (
                  <div key={cat} className="flex items-center gap-3 px-4 py-3"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.accent }} />
                    <span className="text-xs text-slate-400 flex-1">{c.label}</span>
                    <span className="text-xs font-semibold" style={{ color: catPct === null ? '#475569' : catPct >= 80 ? '#34D399' : catPct >= 60 ? '#FBBF24' : '#F87171' }}>
                      {catPct === null ? '—' : `${catPct}%`}
                    </span>
                    <span className="text-xs text-slate-600">{catAnswered}/{catCards.length}</span>
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={handleReset}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}>
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <button onClick={() => { handleReset(); setSelectedCat('all') }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 transition-all"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              All Cards
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!card || !cfg) return null

  const { accent, gradient } = cfg

  // ── Option pill styling ────────────────────────────────────────────────────
  const getOptStyle = (i: number) => {
    if (!answered) return {
      bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.78)',
    }
    if (i === card.correct) return {
      bg: 'rgba(52,211,153,0.14)', border: '#34D399', color: '#34D399',
    }
    if (i === answeredIdx) return {
      bg: 'rgba(248,113,113,0.14)', border: '#F87171', color: '#F87171',
    }
    return { bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.2)' }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#060B14' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3"
        style={{ background: 'rgba(6,11,20,0.96)', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(14px)' }}>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-bold text-white tracking-tight">Flash Cards</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">{answeredCount} / {deck.length} answered</span>
            <button onClick={handleReset} title="Reset"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/5 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${deck.length > 0 ? (answeredCount / deck.length) * 100 : 0}%`,
              background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
            }} />
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {(['all', ...Object.keys(CAT_CONFIG)] as Array<'all' | FlashCat>).map(cat => {
            const isActive = selectedCat === cat
            const c = cat !== 'all' ? CAT_CONFIG[cat] : null
            const count = cat === 'all' ? flashCards.length : (catCounts[cat] || 0)
            const activeColor = c ? c.accent : '#818CF8'
            return (
              <button key={cat} onClick={() => handleCatChange(cat)}
                className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: isActive ? `${activeColor}22` : 'rgba(255,255,255,0.05)',
                  color: isActive ? activeColor : '#475569',
                  border: `1px solid ${isActive ? `${activeColor}50` : 'transparent'}`,
                }}>
                {cat === 'all' ? `All (${count})` : `${c!.label} (${count})`}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Card area ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col px-4 py-4 max-w-2xl mx-auto w-full">

        {/* Nav row */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate('prev')} disabled={cardIndex === 0}
            className="p-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>
          <span className="text-xs text-slate-500 font-medium">
            Card <span className="text-slate-300">{cardIndex + 1}</span> / <span className="text-slate-300">{deck.length}</span>
          </span>
          <button onClick={() => navigate('next')} disabled={cardIndex === deck.length - 1}
            className="p-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* ── Card ─────────────────────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden"
          style={{
            background: gradient,
            border: `1px solid ${accent}28`,
            boxShadow: `0 0 60px ${accent}18, 0 20px 60px rgba(0,0,0,0.5)`,
            opacity: sliding ? 0.35 : 1,
            transform: sliding === 'left' ? 'translateX(-18px)' : sliding === 'right' ? 'translateX(18px)' : 'none',
            transition: 'opacity 140ms ease, transform 140ms ease',
          }}>

          {/* Card header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="text-xs font-bold tracking-widest px-2.5 py-1 rounded-full uppercase"
              style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}40` }}>
              {cfg.tag}
            </div>
            <div className="flex items-center gap-2.5">
              <DiffDots level={card.difficulty} accent={accent} />
              <span className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: `${accent}70` }}>
                {card.difficulty}
              </span>
            </div>
          </div>

          {/* Sentence */}
          <div className="px-5 pb-8">
            <p className="text-2xl font-semibold leading-relaxed" style={{ color: 'rgba(255,255,255,0.93)' }}>
              <Sentence
                text={card.sentence}
                accent={accent}
                filledAnswer={answered ? card.options[card.correct] : undefined}
              />
            </p>
          </div>

          <div style={{ height: 1, background: `${accent}15` }} />

          {/* Options 2×2 grid */}
          <div className="p-4 grid grid-cols-2 gap-2.5">
            {card.options.map((opt, i) => {
              const s = getOptStyle(i)
              const showCheck = answered && i === card.correct
              const showCross = answered && i === answeredIdx && i !== card.correct
              return (
                <button key={i} onClick={() => handleAnswer(i)} disabled={answered}
                  className="group flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold text-left transition-all duration-150"
                  style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, cursor: answered ? 'default' : 'pointer' }}
                  onMouseEnter={e => {
                    if (answered) return
                    const el = e.currentTarget as HTMLElement
                    el.style.background = `${accent}18`
                    el.style.borderColor = `${accent}55`
                    el.style.color = '#fff'
                  }}
                  onMouseLeave={e => {
                    if (answered) return
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.05)'
                    el.style.borderColor = 'rgba(255,255,255,0.1)'
                    el.style.color = 'rgba(255,255,255,0.78)'
                  }}
                >
                  <span className="text-xs font-bold w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: answered ? 'transparent' : `${accent}22`, color: answered ? s.color : accent }}>
                    {i + 1}
                  </span>
                  {showCheck && <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#34D399' }} />}
                  {showCross && <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#F87171' }} />}
                  <span className="leading-snug">{opt}</span>
                </button>
              )
            })}
          </div>

          {/* ── Explanation panel ──────────────────────────────────────── */}
          {answered && showExp && (
            <div className="mx-4 mb-4 rounded-xl p-4 space-y-2.5"
              style={{
                background: isCorrect ? 'rgba(52,211,153,0.07)' : 'rgba(248,113,113,0.07)',
                border: `1px solid ${isCorrect ? 'rgba(52,211,153,0.22)' : 'rgba(248,113,113,0.22)'}`,
              }}>

              {/* Result */}
              <div className="flex items-center gap-2">
                {isCorrect
                  ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                }
                <span className="text-sm font-bold"
                  style={{ color: isCorrect ? '#34D399' : '#F87171' }}>
                  {isCorrect ? 'Correct!' : `Answer: ${card.options[card.correct]}`}
                </span>
              </div>

              {/* Explanation text */}
              <p className="text-sm text-slate-300 leading-relaxed">{card.explanation}</p>

              {/* Rule box */}
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg"
                style={{ background: `${accent}12`, borderLeft: `3px solid ${accent}` }}>
                <BookOpen className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: accent }} />
                <p className="text-xs font-medium leading-relaxed" style={{ color: `${accent}CC` }}>
                  {card.rule}
                </p>
              </div>

              {/* Trap box */}
              {card.trap && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg"
                  style={{ background: 'rgba(251,191,36,0.08)', borderLeft: '3px solid #FBBF24' }}>
                  <Zap className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
                  <p className="text-xs leading-relaxed text-amber-300">
                    <span className="font-semibold">Trap: </span>{card.trap}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Bottom action ──────────────────────────────────────────── */}
          {answered && (
            <div className="px-4 pb-4">
              <button
                onClick={() => isLastCard ? setShowSummary(true) : navigate('next')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: `${accent}22`,
                  border: `1px solid ${accent}45`,
                  color: accent,
                }}>
                {isLastCard
                  ? <><Trophy className="w-4 h-4" /> See Results</>
                  : <>Next Card <ChevronRight className="w-4 h-4" /></>
                }
              </button>
            </div>
          )}
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-xs text-slate-700 mt-4 pb-4">
          Press 1–4 to answer · ← → to navigate · Enter for next
        </p>
      </div>
    </div>
  )
}
