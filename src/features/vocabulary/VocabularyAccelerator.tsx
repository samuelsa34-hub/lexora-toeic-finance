import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, RotateCcw, Star, BookOpen, BookMarked } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { vocabularyBank } from '../../data/vocabularyBank'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { getDictionaryEntry } from '../../data/dictionaryEntries'
import type { VocabRatingValue } from '../../types'

type VocabCat = 'all' | 'finance' | 'hr' | 'marketing' | 'operations' | 'legal' | 'travel' | 'customer_service'

const CAT_LABELS: Record<VocabCat, string> = {
  all: 'All', finance: 'Finance', hr: 'HR', marketing: 'Marketing',
  operations: 'Operations', legal: 'Legal', travel: 'Travel & Office', customer_service: 'Customer Service',
}

const QUIZ_OPTS_COUNT = 4

export const VocabularyAccelerator: React.FC = () => {
  const navigate = useNavigate()
  const { vocabRatings, rateVocab, addVocabSession, logActivity } = useAppStore()
  const [cat, setCat] = useState<VocabCat>('all')
  const [priorityOnly, setPriorityOnly] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [cardIdx, setCardIdx] = useState(0)
  const [quizMode, setQuizMode] = useState(false)
  const [quizSelected, setQuizSelected] = useState<number | null>(null)
  const [quizAnswered, setQuizAnswered] = useState(false)

  const filtered = useMemo(() => {
    let words = cat === 'all' ? [...vocabularyBank] : vocabularyBank.filter(w => {
      if (cat === 'travel') return w.cat === 'travel' || w.cat === 'office' || w.cat === 'meetings'
      if (cat === 'customer_service') return w.cat === 'customer_service'
      return w.cat === cat
    })
    if (priorityOnly) words = words.filter(w => w.level === 1)
    // Sort: unknown first, then learning, then known
    return words.sort((a, b) => {
      const order: Record<string, number> = { unknown: 0, null: 1, learning: 2, known: 3 }
      const ra = order[String(vocabRatings[a.word] ?? 'null')] ?? 1
      const rb = order[String(vocabRatings[b.word] ?? 'null')] ?? 1
      return ra - rb
    })
  }, [cat, priorityOnly, vocabRatings])

  const word = filtered[cardIdx]

  const knownCount = Object.values(vocabRatings).filter(r => r === 'known').length
  const learningCount = Object.values(vocabRatings).filter(r => r === 'learning').length
  const unknownCount = Object.values(vocabRatings).filter(r => r === 'unknown').length

  const quizOptions = useMemo(() => {
    if (!word) return []
    const allDefs = vocabularyBank.map(w => w.toeicDef)
    const wrong = allDefs.filter(d => d !== word.toeicDef).sort(() => Math.random() - 0.5).slice(0, 3)
    const opts = [word.toeicDef, ...wrong].sort(() => Math.random() - 0.5)
    return opts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word?.word, cardIdx])

  const correctQuizIdx = quizOptions.indexOf(word?.toeicDef || '')

  const goTo = (idx: number) => {
    setCardIdx(Math.max(0, Math.min(idx, filtered.length - 1)))
    setFlipped(false)
    setQuizSelected(null)
    setQuizAnswered(false)
  }

  const rate = (rating: VocabRatingValue) => {
    if (!word) return
    rateVocab(word.word, rating)
    if (cardIdx + 1 >= filtered.length) {
      // Compute known count after this rating (vocabRatings hasn't updated yet in this render)
      const prevRating = vocabRatings[word.word]
      const knownDelta = rating === 'known' && prevRating !== 'known' ? 1
        : rating !== 'known' && prevRating === 'known' ? -1 : 0
      const knownAfter = Object.values(vocabRatings).filter(r => r === 'known').length + knownDelta
      addVocabSession({
        id: `vs_${Date.now()}`,
        timestamp: Date.now(),
        category: cat,
        cardsReviewed: filtered.length,
        known: Math.max(0, knownAfter),
      })
      logActivity({ type: 'vocab_session', label: `Vocab session: ${filtered.length} cards, ${Math.max(0, knownAfter)} known`, meta: { total: filtered.length } })
    }
    goTo(cardIdx + 1 < filtered.length ? cardIdx + 1 : 0)
  }

  const handleQuizAnswer = (idx: number) => {
    setQuizSelected(idx)
    setQuizAnswered(true)
  }

  if (!word) {
    return (
      <div className="p-4 sm:p-5 lg:p-6 max-w-2xl mx-auto text-center">
        <p className="text-slate-400">No words match current filters</p>
        <Button className="mt-4" onClick={() => { setCat('all'); setPriorityOnly(false) }}>Reset Filters</Button>
      </div>
    )
  }

  const rating = vocabRatings[word.word]

  const masteryPct = filtered.length > 0 ? Math.round(knownCount / filtered.length * 100) : 0
  const newCount = filtered.length - knownCount - learningCount - unknownCount

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-2xl mx-auto space-y-4 pb-24 sm:pb-6">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--dp-text-1)' }}>
            Vocabulary <span className="text-gradient">Accelerator</span>
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--dp-text-4)' }}>
            {vocabularyBank.length} TOEIC business words · French support
          </p>
        </div>
        <Button size="sm" variant={quizMode ? 'primary' : 'ghost'}
          onClick={() => { setQuizMode(!quizMode); setQuizSelected(null); setQuizAnswered(false) }}>
          {quizMode ? '📖 Cards' : '🎯 Quiz'}
        </Button>
      </div>

      {/* ── Mastery progress bar ────────────────────────────────────────── */}
      <div className="rounded-2xl p-4 space-y-3" style={{ background: 'var(--dp-surface)', border: '1px solid var(--dp-border-sm)', boxShadow: 'var(--dp-shadow-xs)' }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--dp-text-4)' }}>Mastery Progress</span>
          <span className="text-sm font-bold text-emerald-400">{masteryPct}% known</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${masteryPct}%`, background: 'linear-gradient(90deg,#10B981,#34D399)' }} />
        </div>
        <div className="grid grid-cols-4 gap-2 pt-1">
          {[
            { label: 'Known',    value: knownCount,    color: '#10B981', bg: 'rgba(16,185,129,0.09)',  border: 'rgba(16,185,129,0.20)' },
            { label: 'Learning', value: learningCount, color: '#F59E0B', bg: 'rgba(245,158,11,0.09)',  border: 'rgba(245,158,11,0.20)' },
            { label: 'Unknown',  value: unknownCount,  color: '#EF4444', bg: 'rgba(239,68,68,0.09)',   border: 'rgba(239,68,68,0.20)' },
            { label: 'New',      value: newCount,      color: 'var(--dp-text-3)', bg: 'var(--dp-surface-alt)', border: 'var(--dp-border-sm)' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-2.5 text-center"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <div className="text-base font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--dp-text-4)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Category filters ────────────────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar flex-wrap">
        {(Object.keys(CAT_LABELS) as VocabCat[]).map(c => (
          <button key={c} onClick={() => { setCat(c); setCardIdx(0); setFlipped(false) }}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
            style={cat === c
              ? { background: '#6366F1', borderColor: '#6366F1', color: '#fff' }
              : { background: 'var(--dp-surface)', borderColor: 'var(--dp-border-sm)', color: 'var(--dp-text-3)' }
            }>
            {CAT_LABELS[c]}
          </button>
        ))}
        <button onClick={() => setPriorityOnly(!priorityOnly)}
          className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
          style={priorityOnly
            ? { background: '#D97706', borderColor: '#D97706', color: '#fff' }
            : { background: 'var(--dp-surface)', borderColor: 'var(--dp-border-sm)', color: 'var(--dp-text-3)' }
          }>
          ⭐ Critical
        </button>
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between">
        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${((cardIdx + 1) / filtered.length) * 100}%` }} />
        </div>
        <span className="ml-3 text-xs font-mono flex-shrink-0" style={{ color: 'var(--dp-text-4)' }}>{cardIdx + 1}/{filtered.length}</span>
      </div>

      {/* ── Flashcard ───────────────────────────────────────────────────── */}
      {!quizMode ? (
        <div style={{ perspective: '1000px' }}>
          <div
            className="relative cursor-pointer select-none"
            style={{ transformStyle: 'preserve-3d', transition: 'transform 0.5s', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', minHeight: '260px' }}
            onClick={() => setFlipped(!flipped)}
          >
            {/* Front */}
            <div className="absolute inset-0 rounded-2xl p-6 flex flex-col items-center justify-center text-center"
              style={{ backfaceVisibility: 'hidden', background: 'var(--dp-surface)', border: '1px solid var(--dp-border-sm)', boxShadow: 'var(--dp-shadow-sm)' }}>
              <Badge variant={rating === 'known' ? 'emerald' : rating === 'learning' ? 'amber' : rating === 'unknown' ? 'red' : 'slate'} className="mb-4">
                {rating || 'new'}
              </Badge>
              <div className="text-3xl font-black mb-2" style={{ color: 'var(--dp-text-1)' }}>{word.word}</div>
              <div className="text-sm italic" style={{ color: 'var(--dp-text-4)' }}>{word.pos}</div>
              {word.level === 1 && <Star className="w-4 h-4 text-amber-400 mt-2" />}
              <p className="text-xs mt-4" style={{ color: 'var(--dp-text-4)' }}>Tap to reveal</p>
            </div>
            {/* Back */}
            <div className="absolute inset-0 rounded-2xl p-5 overflow-y-auto"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'var(--dp-surface)', border: '1px solid rgba(99,102,241,0.30)', boxShadow: 'var(--dp-shadow-sm)' }}>
              <div className="text-xl font-bold mb-1" style={{ color: 'var(--dp-text-1)' }}>{word.word}</div>
              <div className="font-semibold mb-3 text-indigo-400">🇫🇷 {word.fr}</div>
              <div className="text-sm mb-2" style={{ color: 'var(--dp-text-2)' }}>
                <strong style={{ color: 'var(--dp-text-3)' }}>TOEIC: </strong>{word.toeicDef}
              </div>
              <div className="text-xs mb-1 italic" style={{ color: 'var(--dp-text-3)' }}>"{word.example}"</div>
              <div className="text-xs italic mb-3" style={{ color: 'var(--dp-text-4)' }}>"{word.exampleFr}"</div>
              {word.collocations.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {word.collocations.map(c => (
                    <span key={c} className="px-2 py-0.5 rounded-md text-xs text-indigo-400 border"
                      style={{ background: 'rgba(99,102,241,0.08)', borderColor: 'rgba(99,102,241,0.20)' }}>{c}</span>
                  ))}
                </div>
              )}
              {word.memoryTip && (
                <div className="rounded-lg p-2 mb-2"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.20)' }}>
                  <p className="text-xs text-amber-300"><strong>Tip: </strong>{word.memoryTip}</p>
                </div>
              )}
              {word.falseFriend && (
                <div className="rounded-lg p-2"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)' }}>
                  <p className="text-xs text-red-300"><strong>False Friend: </strong>{word.falseFriend}</p>
                </div>
              )}
              {getDictionaryEntry(word.word) && (
                <button
                  onClick={e => { e.stopPropagation(); navigate('/dictionary', { state: { initialWord: word.word.toLowerCase() } }) }}
                  className="mt-3 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg w-full justify-center transition-all"
                  style={{ background: 'rgba(99,102,241,0.10)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.20)' }}>
                  <BookMarked className="w-3 h-3" /> View Full Entry in Dictionary
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Card className="p-5">
          <p className="text-base font-semibold mb-4" style={{ color: 'var(--dp-text-1)' }}>
            What does <strong className="text-indigo-400">"{word.word}"</strong> mean in a TOEIC context?
          </p>
          <div className="space-y-2">
            {quizOptions.map((opt, i) => {
              const isCorrect = i === correctQuizIdx
              const isWrong = quizAnswered && i === quizSelected && !isCorrect
              return (
                <button key={i} onClick={() => !quizAnswered && handleQuizAnswer(i)}
                  className="w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all"
                  style={quizAnswered
                    ? isCorrect
                      ? { background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.40)', color: '#6EE7B7' }
                      : isWrong
                        ? { background: 'rgba(239,68,68,0.10)', borderColor: 'rgba(239,68,68,0.35)', color: '#FCA5A5' }
                        : { background: 'var(--dp-surface-alt)', borderColor: 'var(--dp-border-xs)', color: 'var(--dp-text-4)' }
                    : { background: 'var(--dp-surface-warm)', borderColor: 'var(--dp-border-sm)', color: 'var(--dp-text-2)' }
                  }>
                  {opt}
                </button>
              )
            })}
          </div>
          {quizAnswered && (
            <>
              <div className="mt-3 p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)' }}>
                <p className="text-xs" style={{ color: 'var(--dp-text-2)' }}>{word.def}</p>
                <p className="text-xs text-indigo-400 mt-1">🇫🇷 {word.fr}</p>
              </div>
              <button
                onClick={() => goTo(cardIdx + 1 < filtered.length ? cardIdx + 1 : 0)}
                className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.30)', color: '#818CF8' }}>
                Next Word →
              </button>
            </>
          )}
        </Card>
      )}

      {/* ── Rating buttons ──────────────────────────────────────────────── */}
      {!quizMode && flipped && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: '✗ Didn\'t Know', action: 'unknown', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.30)', color: '#F87171', hBg: 'rgba(239,68,68,0.22)' },
            { label: '⟳ Review Again', action: 'learning', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.28)', color: '#FCD34D', hBg: 'rgba(245,158,11,0.20)' },
            { label: '✓ Knew It', action: 'known', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.28)', color: '#6EE7B7', hBg: 'rgba(16,185,129,0.20)' },
          ].map(btn => (
            <button key={btn.action}
              onClick={() => rate(btn.action as VocabRatingValue)}
              className="py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: btn.bg, border: `1px solid ${btn.border}`, color: btn.color }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = btn.hBg }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = btn.bg }}>
              {btn.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => goTo(cardIdx - 1)} disabled={cardIdx === 0}>
          <ChevronLeft className="w-4 h-4" /> Prev
        </Button>
        <button onClick={() => setFlipped(false)}
          className="p-2 rounded-lg transition-all"
          style={{ color: 'var(--dp-text-4)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--dp-text-2)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--dp-text-4)' }}>
          <RotateCcw className="w-4 h-4" />
        </button>
        <Button variant="ghost" size="sm" onClick={() => goTo(cardIdx + 1)} disabled={cardIdx >= filtered.length - 1}>
          Next <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
