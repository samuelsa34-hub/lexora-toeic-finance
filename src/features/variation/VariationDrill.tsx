import React, { useState, useEffect, useCallback } from 'react'
import { CheckCircle, XCircle, X, Lightbulb, RotateCcw, ChevronRight } from 'lucide-react'
import { findVariationGroup, type VariationQ } from '../../data/variationGroups'
import type { GrammarQuestion } from '../../types'
import { ANSWER_LABELS } from '../../utils/constants'

const DRILL_SIZE = 5

interface VariationDrillProps {
  sourceQuestion: GrammarQuestion
  onDone: (score: number, total: number) => void
  onClose: () => void
  showFr?: boolean
}

export default function VariationDrill({ sourceQuestion, onDone, onClose, showFr = false }: VariationDrillProps) {
  const group = findVariationGroup(sourceQuestion.cat, sourceQuestion.trapType, sourceQuestion.subtopic)

  const [questions] = useState<VariationQ[]>(() => {
    if (!group) return []
    const shuffled = [...group.questions].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, DRILL_SIZE)
  })

  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = questions[idx]

  const handleAnswer = useCallback((i: number) => {
    if (answered) return
    setSelected(i)
    setAnswered(true)
    if (i === q.correct) setScore(s => s + 1)
  }, [answered, q])

  const handleNext = useCallback(() => {
    if (idx + 1 >= questions.length) {
      setDone(true)
    } else {
      setIdx(i => i + 1)
      setSelected(null)
      setAnswered(false)
    }
  }, [idx, questions.length])

  // Keyboard shortcuts
  useEffect(() => {
    if (done) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (!answered) {
        if (['a', 'A', '1'].includes(e.key)) handleAnswer(0)
        else if (['b', 'B', '2'].includes(e.key)) handleAnswer(1)
        else if (['c', 'C', '3'].includes(e.key)) handleAnswer(2)
        else if (['d', 'D', '4'].includes(e.key)) handleAnswer(3)
      } else if ((e.key === ' ' || e.key === 'Enter') && !done) {
        e.preventDefault()
        handleNext()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [done, answered, handleAnswer, handleNext, onClose])

  const finalScore = done ? score : 0
  const repaired = done && finalScore >= Math.ceil(questions.length * 0.6)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #0D1829 0%, #080E1E 100%)',
          border: '1px solid rgba(99,102,241,0.25)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.60)',
          maxHeight: '90vh',
        }}>

        {/* Header */}
        <div className="px-5 py-4 flex items-start justify-between flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.30)' }}>
                Repair Mode
              </span>
              {group && (
                <span className="text-[10px] font-semibold text-zinc-500">{group.name}</span>
              )}
            </div>
            {group && (
              <p className="text-xs text-zinc-400 leading-relaxed mt-1 max-w-xs">{group.rule}</p>
            )}
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg flex-shrink-0 ml-3 transition-colors hover:bg-white/[0.06]"
            style={{ color: 'rgba(255,255,255,0.35)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* No group found */}
        {!group && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <span className="text-3xl mb-3">🔍</span>
            <p className="text-sm font-semibold text-zinc-300 mb-1">No similar exercises yet</p>
            <p className="text-xs text-zinc-500 mb-5">This topic doesn't have variation drills yet. Keep practicing to improve!</p>
            <button onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(99,102,241,0.20)', border: '1px solid rgba(99,102,241,0.30)', color: '#A5B4FC' }}>
              Close
            </button>
          </div>
        )}

        {/* Done screen */}
        {group && done && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center overflow-y-auto">
            <div className="text-5xl mb-3">{repaired ? '✅' : '💪'}</div>
            <p className="text-xl font-black mb-1"
              style={{ color: repaired ? '#6EE7B7' : '#FCD34D' }}>
              {repaired ? 'Repaired!' : 'Keep Practicing'}
            </p>
            <p className="text-sm text-zinc-400 mb-5">
              {finalScore}/{questions.length} correct
              {repaired
                ? ' — you\'ve got the rule down.'
                : ' — drill this category again to solidify.'}
            </p>

            {/* Mini score bar */}
            <div className="w-full max-w-xs mb-6">
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(finalScore / questions.length) * 100}%`,
                    background: repaired ? 'linear-gradient(90deg,#10B981,#34D399)' : 'linear-gradient(90deg,#F59E0B,#EAB308)',
                  }} />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
                <span>0</span><span>{questions.length}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => onDone(finalScore, questions.length)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{ background: repaired ? 'rgba(16,185,129,0.18)' : 'rgba(99,102,241,0.20)', border: `1px solid ${repaired ? 'rgba(16,185,129,0.30)' : 'rgba(99,102,241,0.30)'}`, color: repaired ? '#6EE7B7' : '#A5B4FC' }}>
                {repaired ? 'Continue Drill' : 'Back to Drill'}
              </button>
            </div>
          </div>
        )}

        {/* Question screen */}
        {group && !done && q && (
          <div className="flex-1 overflow-y-auto">
            {/* Progress */}
            <div className="px-5 pt-4 pb-3 flex items-center gap-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span className="text-[11px] font-mono text-zinc-600">{idx + 1}/{questions.length}</span>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${((idx + 1) / questions.length) * 100}%`, background: 'linear-gradient(90deg,#6366F1,#8B5CF6)' }} />
              </div>
              <div className="flex gap-2 text-[11px]">
                <span style={{ color: '#10B981' }}>✓ {score}</span>
                <span style={{ color: '#EF4444' }}>✗ {idx - score - (answered && selected !== q.correct ? 0 : 0)}</span>
              </div>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Same-rule label */}
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Same rule, new sentence</span>
              </div>

              {/* Question */}
              <p className="text-base font-medium leading-relaxed" style={{ color: '#E2E8F0' }}>{q.q}</p>

              {/* Choices */}
              <div className="space-y-2">
                {q.opts.map((opt, i) => {
                  let bg = 'rgba(255,255,255,0.03)'
                  let borderColor = 'rgba(255,255,255,0.09)'
                  let color = '#94A3B8'
                  if (answered) {
                    if (i === q.correct) { bg = 'rgba(16,185,129,0.10)'; borderColor = 'rgba(16,185,129,0.35)'; color = '#6EE7B7' }
                    else if (i === selected && i !== q.correct) { bg = 'rgba(239,68,68,0.10)'; borderColor = 'rgba(239,68,68,0.35)'; color = '#FCA5A5' }
                    else { bg = 'rgba(255,255,255,0.01)'; borderColor = 'rgba(255,255,255,0.04)'; color = '#475569' }
                  }
                  return (
                    <button key={i} onClick={() => !answered && handleAnswer(i)} disabled={answered}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left"
                      style={{ background: bg, borderColor, color }}>
                      <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: answered ? (i === q.correct ? 'rgba(16,185,129,0.22)' : i === selected ? 'rgba(239,68,68,0.22)' : 'rgba(255,255,255,0.04)') : 'rgba(255,255,255,0.07)', color: answered ? (i === q.correct ? '#10B981' : i === selected ? '#EF4444' : '#475569') : '#64748B' }}>
                        {ANSWER_LABELS[i]}
                      </span>
                      {opt}
                      {answered && i === q.correct && <CheckCircle className="w-4 h-4 ml-auto text-emerald-400 flex-shrink-0" />}
                      {answered && i === selected && i !== q.correct && <XCircle className="w-4 h-4 ml-auto text-red-400 flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>

              {/* Explanation */}
              {answered && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl"
                    style={{ background: 'rgba(139,92,246,0.10)', border: '1px solid rgba(139,92,246,0.22)' }}>
                    <Lightbulb className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-violet-200 leading-relaxed">{q.exp}</p>
                  </div>
                  {showFr && q.fr && (
                    <div className="px-3 py-2 rounded-lg"
                      style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.20)' }}>
                      <p className="text-[11px] text-blue-200 leading-relaxed">🇫🇷 {q.fr}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Next button */}
              {answered && (
                <div className="flex justify-end pb-2">
                  <button onClick={handleNext}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                    style={{ background: 'rgba(99,102,241,0.20)', border: '1px solid rgba(99,102,241,0.30)', color: '#A5B4FC' }}>
                    {idx + 1 >= questions.length ? 'See Results' : 'Next'}
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-[10px] opacity-60 font-normal hidden sm:inline">Space</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
