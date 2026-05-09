import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle, ChevronDown, ChevronUp, Zap, BookOpen } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import {
  part6Passages,
  DOC_TYPE_LABELS,
  DOC_TYPE_ICONS,
  BLANK_TYPE_LABELS,
  BLANK_TYPE_COLORS,
} from '../../data/part6Passages'
import type { Part6Passage, Part6Question } from '../../types'

// ── Design tokens ──────────────────────────────────────────────────────────────
const BG = '#0A0E1A'
const SURFACE = '#111827'
const SURFACE2 = '#161F30'
const BORDER = '#1F2937'
const TEXT_PRIMARY = '#F8FAFC'
const TEXT_MUTED = '#64748B'
const TEXT_DIM = '#94A3B8'

const DIFF_COLORS: Record<string, string> = {
  easy: '#10B981',
  medium: '#F59E0B',
  hard: '#F43F5E',
}

const ANSWER_LABELS = ['A', 'B', 'C', 'D'] as const

// ── Document type header renderer ──────────────────────────────────────────────
function DocumentHeader({ passage }: { passage: Part6Passage }) {
  const accentMap: Record<string, string> = {
    email: '#0EA5E9',
    memo: '#6366F1',
    press_release: '#10B981',
    job_ad: '#F59E0B',
    notice: '#F43F5E',
    advertisement: '#8B5CF6',
    announcement: '#06B6D4',
    business_update: '#6366F1',
  }
  const accent = accentMap[passage.docType] ?? '#6366F1'

  const headerStyle: React.CSSProperties = {
    background: `${accent}0A`,
    border: `1px solid ${accent}25`,
    borderRadius: 10,
    padding: '14px 18px',
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  }

  return (
    <div style={headerStyle}>
      <span style={{ fontSize: 22, flexShrink: 0 }}>{DOC_TYPE_ICONS[passage.docType]}</span>
      <div>
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase' as const,
          color: accent,
          marginBottom: 3,
        }}>
          {DOC_TYPE_LABELS[passage.docType]} · {passage.difficulty.charAt(0).toUpperCase() + passage.difficulty.slice(1)}
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY }}>
          {passage.title}
        </div>
        <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>
          {passage.topic}
        </div>
      </div>
    </div>
  )
}

// ── Document body with inline blank buttons ────────────────────────────────────
interface DocumentBodyProps {
  body: string
  answers: (0 | 1 | 2 | 3 | null)[]
  activeBlank: number | null
  submitted: boolean
  correctAnswers: (0 | 1 | 2 | 3)[]
  onBlankClick: (index: number) => void
}

function DocumentBody({ body, answers, activeBlank, submitted, correctAnswers, onBlankClick }: DocumentBodyProps) {
  const parts = body.split(/(\{\{[1-4]\}\})/g)

  return (
    <div style={{
      fontSize: 15,
      lineHeight: 1.9,
      color: TEXT_DIM,
      fontFamily: '"Inter", system-ui, sans-serif',
    }}>
      {parts.map((part, i) => {
        const match = part.match(/^\{\{([1-4])\}\}$/)
        if (!match) {
          return (
            <span key={i} style={{ whiteSpace: 'pre-wrap' as const }}>
              {part}
            </span>
          )
        }
        const blankIndex = parseInt(match[1]) - 1
        const answer = answers[blankIndex]
        const isActive = activeBlank === blankIndex
        const isAnswered = answer !== null
        const isCorrect = submitted && answer === correctAnswers[blankIndex]
        const isWrong = submitted && answer !== null && answer !== correctAnswers[blankIndex]

        let bg = isActive ? '#6366F120' : isAnswered ? '#E5E1DC' : 'rgba(229,225,220,0.5)'
        let border = isActive ? '#6366F1' : isAnswered ? '#D6D3D1' : '#D6D3D1'
        let color = TEXT_PRIMARY

        if (isCorrect) { bg = '#10B98118'; border = '#10B981'; color = '#10B981' }
        if (isWrong) { bg = '#F43F5E15'; border = '#F43F5E'; color = '#F43F5E' }

        const label = isAnswered
          ? ANSWER_LABELS[answer as number]
          : `${blankIndex + 1}`

        return (
          <button
            key={i}
            onClick={() => !submitted && onBlankClick(blankIndex)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 32,
              height: 26,
              padding: '0 8px',
              margin: '0 3px',
              borderRadius: 6,
              background: bg,
              border: `1.5px solid ${border}`,
              color,
              fontSize: 12,
              fontWeight: 700,
              cursor: submitted ? 'default' : 'pointer',
              verticalAlign: 'middle',
              transition: 'all 0.15s',
              letterSpacing: '0.06em',
            }}
          >
            {isCorrect && <CheckCircle2 size={10} style={{ marginRight: 3 }} />}
            {isWrong && <XCircle size={10} style={{ marginRight: 3 }} />}
            {label}
          </button>
        )
      })}
    </div>
  )
}

// ── Answer option panel ────────────────────────────────────────────────────────
interface AnswerPanelProps {
  question: Part6Question
  blankIndex: number
  answer: 0 | 1 | 2 | 3 | null
  submitted: boolean
  onSelect: (value: 0 | 1 | 2 | 3) => void
}

function AnswerPanel({ question, blankIndex, answer, submitted, onSelect }: AnswerPanelProps) {
  const typeColor = BLANK_TYPE_COLORS[question.type] ?? '#6366F1'

  return (
    <div style={{
      background: SURFACE2,
      border: `1px solid ${BORDER}`,
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 10,
    }}>
      {/* Question header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${BORDER}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#6366F118',
            border: '1px solid #6366F130',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: '#6366F1',
          }}>
            {blankIndex + 1}
          </div>
          <span style={{ fontSize: 13, color: TEXT_DIM, fontWeight: 500 }}>
            Question {blankIndex + 1}
          </span>
        </div>
        <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: typeColor,
          background: `${typeColor}12`,
          border: `1px solid ${typeColor}25`,
          borderRadius: 4,
          padding: '2px 6px',
        }}>
          {BLANK_TYPE_LABELS[question.type]}
        </span>
      </div>

      {/* Options */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
        {question.opts.map((opt, i) => {
          const selected = answer === i
          const isCorrect = submitted && i === question.correct
          const isWrong = submitted && selected && i !== question.correct

          let bg = selected ? '#6366F115' : 'transparent'
          let border = selected ? '#6366F150' : BORDER
          let textColor = selected ? TEXT_PRIMARY : TEXT_DIM
          let labelColor = TEXT_MUTED

          if (isCorrect) { bg = '#10B98112'; border = '#10B98140'; textColor = '#D1FAE5'; labelColor = '#10B981' }
          if (isWrong) { bg = '#F43F5E0A'; border = '#F43F5E30'; textColor = '#FECDD3'; labelColor = '#F43F5E' }
          if (submitted && !selected && i === question.correct) {
            bg = '#10B9810A'; border = '#10B98130'; textColor = '#A7F3D0'; labelColor = '#10B981'
          }

          return (
            <button
              key={i}
              onClick={() => !submitted && onSelect(i as 0 | 1 | 2 | 3)}
              disabled={submitted}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 8,
                cursor: submitted ? 'default' : 'pointer',
                textAlign: 'left' as const,
                width: '100%',
                transition: 'all 0.12s',
              }}
            >
              <span style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: `${labelColor}18`,
                border: `1px solid ${labelColor}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                color: labelColor,
                flexShrink: 0,
              }}>
                {ANSWER_LABELS[i]}
              </span>
              <span style={{ fontSize: 13, color: textColor, flex: 1 }}>{opt}</span>
              {isCorrect && <CheckCircle2 size={14} style={{ color: '#10B981', flexShrink: 0 }} />}
              {isWrong && <XCircle size={14} style={{ color: '#F43F5E', flexShrink: 0 }} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Explanation card (post-submit) ─────────────────────────────────────────────
interface ExplanationCardProps {
  question: Part6Question
  blankIndex: number
  userAnswer: 0 | 1 | 2 | 3 | null
}

function ExplanationCard({ question, blankIndex, userAnswer }: ExplanationCardProps) {
  const [expanded, setExpanded] = useState(false)
  const correct = question.correct
  const isRight = userAnswer === correct
  const accentColor = isRight ? '#10B981' : '#F43F5E'

  return (
    <div style={{
      background: `${accentColor}08`,
      border: `1px solid ${accentColor}25`,
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 10,
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          {isRight
            ? <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} />
            : <XCircle size={16} style={{ color: '#F43F5E', flexShrink: 0 }} />
          }
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isRight ? '#10B981' : '#F43F5E' }}>
              Question {blankIndex + 1} — {isRight ? 'Correct' : 'Incorrect'}
            </div>
            <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 1 }}>
              Correct answer: <strong style={{ color: TEXT_DIM }}>{ANSWER_LABELS[correct]}. {question.opts[correct]}</strong>
            </div>
          </div>
        </div>
        <button
          onClick={() => setExpanded(v => !v)}
          style={{
            background: 'none',
            border: `1px solid ${BORDER}`,
            borderRadius: 6,
            padding: '4px 8px',
            cursor: 'pointer',
            color: TEXT_MUTED,
            fontSize: 11,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            flexShrink: 0,
          }}
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          Explain
        </button>
      </div>

      {/* Expanded explanation */}
      {expanded && (
        <div style={{
          borderTop: `1px solid ${accentColor}20`,
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column' as const,
          gap: 12,
        }}>
          {/* Why correct */}
          <div>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color: '#10B981',
              marginBottom: 5,
            }}>
              Why {ANSWER_LABELS[correct]} is correct
            </div>
            <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>
              {question.exp}
            </p>
            {question.fr && (
              <div style={{
                marginTop: 8,
                padding: '8px 12px',
                background: '#6366F10A',
                border: '1px solid #6366F120',
                borderRadius: 6,
                fontSize: 12,
                color: '#A5B4FC',
                fontStyle: 'italic',
              }}>
                🇫🇷 {question.fr}
              </div>
            )}
          </div>

          {/* Why not the others */}
          <div>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color: TEXT_MUTED,
              marginBottom: 8,
            }}>
              Why not the others?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
              {question.optExps.map((optExp, i) => {
                const isCorrectOpt = i === correct
                const wasChosen = i === userAnswer
                const color = isCorrectOpt ? '#10B981' : wasChosen ? '#F43F5E' : TEXT_MUTED

                return (
                  <div key={i} style={{
                    display: 'flex',
                    gap: 10,
                    padding: '8px 10px',
                    background: isCorrectOpt ? '#10B9810A' : wasChosen ? '#F43F5E08' : 'rgba(229,225,220,0.3)',
                    border: `1px solid ${isCorrectOpt ? '#10B98125' : wasChosen ? '#F43F5E20' : BORDER}`,
                    borderRadius: 7,
                  }}>
                    <span style={{
                      width: 20,
                      height: 20,
                      borderRadius: 5,
                      background: `${color}15`,
                      border: `1px solid ${color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 700,
                      color,
                      flexShrink: 0,
                    }}>
                      {ANSWER_LABELS[i]}
                    </span>
                    <span style={{ fontSize: 12, color: TEXT_DIM, lineHeight: 1.6 }}>{optExp}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Passage selection card ─────────────────────────────────────────────────────
interface PassageCardProps {
  passage: Part6Passage
  onStart: () => void
}

function PassageCard({ passage, onStart }: PassageCardProps) {
  const [hovered, setHovered] = useState(false)
  const diffColor = DIFF_COLORS[passage.difficulty] ?? '#64748B'
  const accentMap: Record<string, string> = {
    email: '#0EA5E9', memo: '#6366F1', press_release: '#10B981',
    job_ad: '#F59E0B', notice: '#F43F5E', advertisement: '#8B5CF6',
    announcement: '#06B6D4', business_update: '#6366F1',
  }
  const accent = accentMap[passage.docType] ?? '#6366F1'

  return (
    <button
      onClick={onStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: SURFACE,
        border: `1px solid ${hovered ? accent : BORDER}`,
        borderRadius: 12,
        padding: '18px',
        cursor: 'pointer',
        textAlign: 'left' as const,
        transition: 'border-color 0.2s, transform 0.15s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 12,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: `${accent}15`,
          border: `1px solid ${accent}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          flexShrink: 0,
        }}>
          {DOC_TYPE_ICONS[passage.docType]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' as const }}>
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase' as const,
              color: accent,
            }}>
              {DOC_TYPE_LABELS[passage.docType]}
            </span>
            <span style={{
              fontSize: 9,
              fontWeight: 600,
              color: diffColor,
              background: `${diffColor}12`,
              border: `1px solid ${diffColor}25`,
              borderRadius: 4,
              padding: '1px 5px',
              textTransform: 'capitalize' as const,
            }}>
              {passage.difficulty}
            </span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY, lineHeight: 1.3 }}>
            {passage.title}
          </div>
          <div style={{
            fontSize: 11,
            color: TEXT_MUTED,
            marginTop: 3,
            lineHeight: 1.4,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
          }}>
            {passage.topic}
          </div>
        </div>
      </div>

      {/* Blank type chips */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const }}>
        {passage.questions.map((q, i) => {
          const tc = BLANK_TYPE_COLORS[q.type] ?? '#6366F1'
          return (
            <span key={i} style={{
              fontSize: 9,
              fontWeight: 600,
              color: tc,
              background: `${tc}12`,
              border: `1px solid ${tc}25`,
              borderRadius: 4,
              padding: '2px 6px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
            }}>
              {i + 1}. {BLANK_TYPE_LABELS[q.type]}
            </span>
          )
        })}
      </div>

      {/* Start CTA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
        borderTop: `1px solid ${BORDER}`,
      }}>
        <span style={{ fontSize: 11, color: TEXT_MUTED }}>4 blanks · Part 6 format</span>
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          color: accent,
          background: `${accent}15`,
          border: `1px solid ${accent}25`,
          borderRadius: 6,
          padding: '4px 12px',
        }}>
          Practice →
        </span>
      </div>
    </button>
  )
}

// ── Score display ──────────────────────────────────────────────────────────────
function ScoreBadge({ score, total }: { score: number; total: number }) {
  const pct = Math.round((score / total) * 100)
  const color = pct >= 75 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#F43F5E'
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: '20px',
      background: `${color}08`,
      border: `1px solid ${color}25`,
      borderRadius: 14,
      marginBottom: 20,
    }}>
      <div style={{ textAlign: 'center' as const }}>
        <div style={{ fontSize: 36, fontWeight: 800, color, lineHeight: 1 }}>{score}/{total}</div>
        <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
          Correct
        </div>
      </div>
      <div style={{ width: 1, height: 40, background: BORDER }} />
      <div style={{ textAlign: 'center' as const }}>
        <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{pct}%</div>
        <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
          Accuracy
        </div>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
type Phase = 'select' | 'practice' | 'review'

export default function Part6Lab() {
  const navigate = useNavigate()
  const { addXP, addPart6Session, addError, logActivity } = useAppStore()

  const [phase, setPhase] = useState<Phase>('select')
  const [currentPassage, setCurrentPassage] = useState<Part6Passage | null>(null)
  const [answers, setAnswers] = useState<(0 | 1 | 2 | 3 | null)[]>([null, null, null, null])
  const [activeBlank, setActiveBlank] = useState<number | null>(0)
  const [xpAwarded, setXpAwarded] = useState(false)

  const allAnswered = answers.every(a => a !== null)

  const correctAnswers = useMemo(
    () => currentPassage?.questions.map(q => q.correct) ?? [],
    [currentPassage]
  )

  const score = useMemo(
    () => answers.filter((a, i) => a !== null && a === correctAnswers[i]).length,
    [answers, correctAnswers]
  )

  const xpEarned = useMemo(() => {
    if (!currentPassage) return 0
    const base = 30
    const bonusPerCorrect = 15
    const diffBonus = currentPassage.difficulty === 'hard' ? 20 : currentPassage.difficulty === 'medium' ? 10 : 0
    return base + score * bonusPerCorrect + diffBonus
  }, [score, currentPassage])

  const handleStart = (passage: Part6Passage) => {
    setCurrentPassage(passage)
    setAnswers([null, null, null, null])
    setActiveBlank(0)
    setXpAwarded(false)
    logActivity({ type: 'part6_start', label: `Started Part 6: ${passage.title}` })
    setPhase('practice')
  }

  const handleAnswer = (blankIndex: number, value: 0 | 1 | 2 | 3) => {
    setAnswers(prev => {
      const next = [...prev] as (0 | 1 | 2 | 3 | null)[]
      next[blankIndex] = value
      return next
    })
    // Auto-advance to next unanswered blank
    const nextUnanswered = answers.findIndex((a, i) => i > blankIndex && a === null)
    if (nextUnanswered !== -1) {
      setActiveBlank(nextUnanswered)
    }
  }

  const handleSubmit = () => {
    if (!currentPassage) return
    if (!xpAwarded) {
      addXP(xpEarned)
      setXpAwarded(true)

      const sessionId = `p6_${Date.now()}_${Math.random().toString(36).slice(2)}`
      addPart6Session({
        id: sessionId,
        timestamp: Date.now(),
        passageId: currentPassage.id,
        answers: answers as (0 | 1 | 2 | 3 | null)[],
        correct: score,
        total: 4,
      })

      // Feed wrong answers into Error Notebook
      currentPassage.questions.forEach((q, i) => {
        if (answers[i] !== null && answers[i] !== q.correct) {
          addError({
            timestamp: Date.now(),
            part: 'part6',
            category: q.type,
            question: `[Part 6 · ${currentPassage.title}] Blank ${i + 1}: ${q.opts.join(' / ')}`,
            opts: Array.from(q.opts),
            correctAnswer: q.correct,
            userAnswer: answers[i] as number,
            explanation: q.exp,
            trap: undefined,
            dangerLevel: 'high',
          })
        }
      })
      logActivity({ type: 'part6_complete', label: `Finished Part 6: ${score}/4`, meta: { correct: score, total: 4 } })
    }
    setPhase('review')
  }

  const handleReset = () => {
    setPhase('select')
    setCurrentPassage(null)
    setAnswers([null, null, null, null])
    setActiveBlank(0)
  }

  // ── SELECT SCREEN ──
  if (phase === 'select') {
    return (
      <div style={{ background: BG, minHeight: '100vh', color: TEXT_PRIMARY }}>
        {/* Hero */}
        <div style={{ padding: '32px 24px 0', maxWidth: 860, margin: '0 auto' }}>
          <div style={{ marginBottom: 6 }}>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase' as const,
              color: '#6366F1',
            }}>
              TOEIC PART 6
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(22px, 5vw, 30px)',
            fontWeight: 800,
            color: TEXT_PRIMARY,
            lineHeight: 1.2,
            margin: '0 0 8px',
            letterSpacing: '-0.02em',
          }}>
            Text Completion
          </h1>
          <p style={{ fontSize: 14, color: TEXT_MUTED, margin: '0 0 24px', lineHeight: 1.7 }}>
            Each passage contains 4 blanks. Read the document carefully — every blank tests a different skill:
            grammar, vocabulary, collocation, or connector logic.
            Choose the answer that best fits the meaning <em>and</em> the grammar of the entire text.
          </p>

          {/* How Part 6 works */}
          <div style={{
            background: '#6366F10A',
            border: '1px solid #6366F120',
            borderRadius: 12,
            padding: '14px 18px',
            marginBottom: 28,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12,
          }}>
            {[
              { icon: '📄', label: 'Read the full document', desc: 'Context matters for every blank' },
              { icon: '🔍', label: 'Identify the trap type', desc: 'Grammar / vocab / connector / collocation' },
              { icon: '✏️', label: 'Fill all 4 blanks', desc: 'One correct answer per blank' },
              { icon: '📊', label: 'Review rich explanations', desc: 'Every option explained in detail' },
            ].map(({ icon, label, desc }) => (
              <div key={label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: TEXT_PRIMARY }}>{label}</div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Passage grid */}
        <div style={{ padding: '0 24px 48px', maxWidth: 860, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 12,
          }}>
            {part6Passages.map(p => (
              <PassageCard key={p.id} passage={p} onStart={() => handleStart(p)} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!currentPassage) return null

  // ── PRACTICE SCREEN ──
  if (phase === 'practice') {
    return (
      <div style={{ background: BG, minHeight: '100vh', color: TEXT_PRIMARY }}>
        {/* Header */}
        <div style={{
          padding: '14px 20px',
          borderBottom: `1px solid ${BORDER}`,
          background: SURFACE2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          position: 'sticky' as const,
          top: 0,
          zIndex: 10,
        }}>
          <button
            onClick={handleReset}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer', color: TEXT_MUTED, fontSize: 13,
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ display: 'flex', gap: 6 }}>
            {answers.map((a, i) => (
              <button
                key={i}
                onClick={() => setActiveBlank(i)}
                style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: activeBlank === i ? '#6366F120' : a !== null ? '#E5E1DC' : 'transparent',
                  border: `1.5px solid ${activeBlank === i ? '#6366F1' : a !== null ? '#374151' : BORDER}`,
                  color: activeBlank === i ? '#6366F1' : a !== null ? TEXT_DIM : TEXT_MUTED,
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                }}>
                {i + 1}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 12, color: TEXT_MUTED }}>
            {answers.filter(a => a !== null).length}/4
          </div>
        </div>

        {/* Two-panel layout on desktop */}
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '20px 20px 40px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 1fr)',
          gap: 20,
          alignItems: 'start',
        }}>
          {/* Left: Document */}
          <div>
            <DocumentHeader passage={currentPassage} />
            <div style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: 14,
              padding: '24px 28px',
            }}>
              <DocumentBody
                body={currentPassage.body}
                answers={answers}
                activeBlank={activeBlank}
                submitted={false}
                correctAnswers={correctAnswers as (0 | 1 | 2 | 3)[]}
                onBlankClick={setActiveBlank}
              />
            </div>

            {/* Submit */}
            <div style={{ marginTop: 16 }}>
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: allAnswered ? 'pointer' : 'not-allowed',
                  background: allAnswered ? '#6366F1' : '#E5E1DC',
                  border: 'none',
                  color: allAnswered ? '#fff' : TEXT_MUTED,
                  transition: 'background 0.15s',
                }}
              >
                {allAnswered ? 'Submit Answers →' : `Answer all blanks (${answers.filter(a => a !== null).length}/4 done)`}
              </button>
            </div>
          </div>

          {/* Right: Answer panels */}
          <div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
              Answer Options
            </div>
            {currentPassage.questions.map((q, i) => (
              <AnswerPanel
                key={i}
                question={q}
                blankIndex={i}
                answer={answers[i]}
                submitted={false}
                onSelect={(v) => handleAnswer(i, v)}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── REVIEW SCREEN ──
  return (
    <div style={{ background: BG, minHeight: '100vh', color: TEXT_PRIMARY }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: `1px solid ${BORDER}`,
        background: SURFACE2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        position: 'sticky' as const,
        top: 0,
        zIndex: 10,
      }}>
        <button
          onClick={handleReset}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer', color: TEXT_MUTED, fontSize: 13,
          }}
        >
          <ArrowLeft size={14} /> All Passages
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Zap size={13} style={{ color: '#F59E0B' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#F59E0B' }}>+{xpEarned} XP</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 20px 48px' }}>
        {/* Score */}
        <ScoreBadge score={score} total={4} />

        {/* Two-panel layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 1fr)',
          gap: 20,
          alignItems: 'start',
        }}>
          {/* Left: Document with answers shown */}
          <div>
            <DocumentHeader passage={currentPassage} />
            <div style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: 14,
              padding: '24px 28px',
            }}>
              <DocumentBody
                body={currentPassage.body}
                answers={answers}
                activeBlank={null}
                submitted={true}
                correctAnswers={correctAnswers as (0 | 1 | 2 | 3)[]}
                onBlankClick={() => {}}
              />
            </div>
          </div>

          {/* Right: Explanations */}
          <div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
              Explanations
            </div>
            {currentPassage.questions.map((q, i) => (
              <ExplanationCard key={i} question={q} blankIndex={i} userAnswer={answers[i]} />
            ))}

            {/* Linked lesson CTA */}
            {currentPassage.linkedLessonId && (
              <button
                onClick={() => navigate(`/courses/${currentPassage.linkedLessonId}`, { state: { returnTo: '/part6' } })}
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  background: '#6366F110',
                  border: '1px solid #6366F130',
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 10,
                  textAlign: 'left' as const,
                  transition: 'border-color 0.15s',
                }}
              >
                <BookOpen size={15} style={{ color: '#6366F1', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#818CF8' }}>Study the linked lesson</div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 1 }}>
                    Deep explanation of this passage's grammar pattern
                  </div>
                </div>
              </button>
            )}

            {/* Try another */}
            <button
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '13px 16px',
                background: '#E5E1DC',
                border: `1px solid ${BORDER}`,
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                color: TEXT_DIM,
              }}
            >
              Try Another Passage
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
