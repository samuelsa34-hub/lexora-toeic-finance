import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, RotateCcw, Sparkles, CheckCircle, Trophy } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { getDueFlashcards } from '../../utils/spacedRepetition'
import type { SRRating } from '../../store/useAppStore'

const RATINGS: { rating: SRRating; label: string; sub: string; bg: string; border: string; color: string; hBg: string }[] = [
  { rating: 0, label: 'Again',  sub: 'Tomorrow',   bg: 'rgba(239,68,68,0.10)',   border: 'rgba(239,68,68,0.30)',   color: '#F87171', hBg: 'rgba(239,68,68,0.20)' },
  { rating: 1, label: 'Hard',   sub: '~2 days',    bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.28)', color: '#FCD34D', hBg: 'rgba(245,158,11,0.20)' },
  { rating: 2, label: 'Good',   sub: '~4 days',    bg: 'rgba(99,102,241,0.10)',  border: 'rgba(99,102,241,0.28)', color: '#818CF8', hBg: 'rgba(99,102,241,0.20)' },
  { rating: 3, label: 'Easy',   sub: '~1 week',    bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.28)', color: '#6EE7B7', hBg: 'rgba(16,185,129,0.20)' },
]

export default function WordFlashcardDrill() {
  const navigate = useNavigate()
  const { wordFlashcards, reviewFlashcard } = useAppStore()
  const [flipped, setFlipped] = useState(false)
  const [doneIds, setDoneIds] = useState<string[]>([])
  const [showSummary, setShowSummary] = useState(false)

  const dueCards = useMemo(() => getDueFlashcards(wordFlashcards), [wordFlashcards])
  const remaining = dueCards.filter(c => !doneIds.includes(c.id))
  const card = remaining[0] ?? null
  const total = dueCards.length
  const doneCount = doneIds.length

  const handleRate = (rating: SRRating) => {
    if (!card) return
    reviewFlashcard(card.id, rating)
    const next = [...doneIds, card.id]
    setDoneIds(next)
    setFlipped(false)
    if (next.length >= total) setShowSummary(true)
  }

  if (dueCards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        style={{ background: 'var(--dp-bg)' }}>
        <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--dp-text-1)' }}>All caught up!</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--dp-text-4)' }}>
          No flashcards due for review. Check back tomorrow.
        </p>
        <button onClick={() => navigate('/vocabulary')}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
          Browse Vocabulary
        </button>
      </div>
    )
  }

  if (showSummary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        style={{ background: 'var(--dp-bg)' }}>
        <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
        <h2 className="text-2xl font-black mb-1" style={{ color: 'var(--dp-text-1)' }}>Session complete!</h2>
        <p className="text-sm mb-2" style={{ color: 'var(--dp-text-3)' }}>
          {total} card{total > 1 ? 's' : ''} reviewed
        </p>
        <p className="text-xs mb-8" style={{ color: 'var(--dp-text-5)' }}>
          Cards are scheduled for future review based on your ratings.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <button onClick={() => { setDoneIds([]); setFlipped(false); setShowSummary(false) }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}>
            <RotateCcw className="w-4 h-4" /> Review Again
          </button>
          <button onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--dp-surface)', border: '1px solid var(--dp-border-sm)', color: 'var(--dp-text-2)' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const progress = total > 0 ? (doneCount / total) * 100 : 0

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--dp-bg)' }}>

      {/* Header */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3"
        style={{ background: 'var(--dp-bg)', borderBottom: '1px solid var(--dp-border-sm)', backdropFilter: 'blur(14px)' }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--dp-text-4)' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-bold" style={{ color: 'var(--dp-text-1)' }}>Flashcard Review</span>
          </div>
          <span className="text-xs font-mono" style={{ color: 'var(--dp-text-4)' }}>{doneCount}/{total}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #6366F1, #8B5CF6)' }} />
        </div>
      </div>

      {/* Card area */}
      {card && (
        <div className="flex-1 flex flex-col px-4 py-6 max-w-xl mx-auto w-full gap-5">

          {/* Flip card */}
          <div style={{ perspective: '1000px' }}>
            <div
              className="relative cursor-pointer select-none"
              style={{
                transformStyle: 'preserve-3d',
                transition: 'transform 0.45s',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                minHeight: '220px',
              }}
              onClick={() => setFlipped(f => !f)}
            >
              {/* Front */}
              <div className="absolute inset-0 rounded-2xl p-6 flex flex-col items-center justify-center text-center"
                style={{ backfaceVisibility: 'hidden', background: 'var(--dp-surface)', border: '1px solid var(--dp-border-sm)', boxShadow: 'var(--dp-shadow-sm)' }}>
                <p className="text-3xl font-black mb-2" style={{ color: 'var(--dp-text-1)' }}>{card.front}</p>
                {card.hint && (
                  <p className="text-xs italic mt-2" style={{ color: 'var(--dp-text-4)' }}>{card.hint}</p>
                )}
                <p className="text-xs mt-4" style={{ color: 'var(--dp-text-5)' }}>Tap to reveal answer</p>
              </div>
              {/* Back */}
              <div className="absolute inset-0 rounded-2xl p-6 flex flex-col items-center justify-center text-center"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'var(--dp-surface)', border: '1px solid rgba(99,102,241,0.30)', boxShadow: 'var(--dp-shadow-sm)' }}>
                <p className="text-xl font-bold mb-1" style={{ color: 'var(--dp-text-1)' }}>{card.word}</p>
                <p className="text-base leading-relaxed" style={{ color: 'var(--dp-text-2)' }}>{card.back}</p>
                {card.consecutiveCorrect !== undefined && card.consecutiveCorrect > 0 && (
                  <p className="text-xs mt-3 text-emerald-400">{card.consecutiveCorrect} correct in a row</p>
                )}
              </div>
            </div>
          </div>

          {/* SR rating buttons — only shown after flip */}
          {flipped ? (
            <div>
              <p className="text-xs text-center mb-3" style={{ color: 'var(--dp-text-4)' }}>
                How well did you know this?
              </p>
              <div className="grid grid-cols-4 gap-2">
                {RATINGS.map(r => (
                  <button key={r.rating}
                    onClick={() => handleRate(r.rating)}
                    className="py-3 rounded-xl text-sm font-bold transition-all flex flex-col items-center gap-0.5"
                    style={{ background: r.bg, border: `1px solid ${r.border}`, color: r.color }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = r.hBg }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = r.bg }}>
                    <span>{r.label}</span>
                    <span className="text-[10px] font-normal opacity-70">{r.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-center" style={{ color: 'var(--dp-text-5)' }}>
              {remaining.length - 1} card{remaining.length - 1 !== 1 ? 's' : ''} remaining after this one
            </p>
          )}
        </div>
      )}
    </div>
  )
}
