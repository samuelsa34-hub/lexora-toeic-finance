import React, { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, BookOpen, Zap, AlertTriangle, CheckCircle2, Circle, ChevronRight } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { getTopicById } from '../../utils/topicEngine'
import {
  computeTopicMastery,
  MASTERY_COLORS,
  MASTERY_LABELS,
  MASTERY_PCT,
  ROI_COLORS,
  ROI_LABELS,
  CATEGORY_ACCENT,
  CATEGORY_LABELS,
  formatLastPracticed,
  getTopicCTA,
} from '../../utils/topicEngine'
import { getLessonById } from '../../utils/lessonEngine'
import type { TopicMasteryLevel } from '../../types'

// ── Design tokens ──────────────────────────────────────────────────────────────
const BG = '#0A0E1A'
const SURFACE = '#111827'
const SURFACE2 = '#161F30'
const BORDER = '#1F2937'
const TEXT_PRIMARY = '#F8FAFC'
const TEXT_MUTED = '#64748B'
const TEXT_DIM = '#94A3B8'

// ── Mastery ring ───────────────────────────────────────────────────────────────
function MasteryRing({ level }: { level: TopicMasteryLevel }) {
  const color = MASTERY_COLORS[level]
  const pct = MASTERY_PCT[level]
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const dash = (pct / 100) * circumference

  return (
    <div style={{ position: 'relative' as const, width: 96, height: 96 }}>
      <svg width={96} height={96} viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={48} cy={48} r={radius} fill="none" stroke="#1F2937" strokeWidth={6} />
        <circle
          cx={48} cy={48} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute' as const,
        inset: 0,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ fontSize: 16, fontWeight: 800, color }}>{pct}%</div>
        <div style={{ fontSize: 8, color: TEXT_MUTED, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
          {MASTERY_LABELS[level]}
        </div>
      </div>
    </div>
  )
}

// ── Stat cell ──────────────────────────────────────────────────────────────────
function StatCell({ value, label, color = TEXT_DIM }: { value: string | number; label: string; color?: string }) {
  return (
    <div style={{ textAlign: 'center' as const }}>
      <div style={{ fontSize: 20, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: TEXT_MUTED, marginTop: 3, letterSpacing: '0.07em', textTransform: 'uppercase' as const }}>{label}</div>
    </div>
  )
}

// ── Section block ──────────────────────────────────────────────────────────────
function SectionBlock({ title, icon, children, accent = '#6366F1' }: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  accent?: string
}) {
  return (
    <div style={{
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      borderRadius: 14,
      overflow: 'hidden',
      marginBottom: 12,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '14px 18px 12px',
        borderBottom: `1px solid ${BORDER}`,
      }}>
        {icon && (
          <span style={{ color: accent, display: 'flex', alignItems: 'center' }}>{icon}</span>
        )}
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase' as const,
          color: TEXT_DIM,
        }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '16px 18px' }}>{children}</div>
    </div>
  )
}

// ── Example card ───────────────────────────────────────────────────────────────
function ExampleItem({ correct, incorrect, note }: { correct: string; incorrect?: string; note?: string }) {
  return (
    <div style={{ marginBottom: incorrect || note ? 14 : 6 }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        padding: '8px 12px',
        background: '#10B98112',
        border: '1px solid #10B98125',
        borderRadius: 8,
        marginBottom: incorrect ? 6 : 0,
      }}>
        <span style={{ color: '#10B981', fontSize: 12, marginTop: 2, flexShrink: 0 }}>✓</span>
        <span style={{ fontSize: 14, color: '#D1FAE5', fontFamily: 'ui-monospace, monospace' }}>
          {correct}
        </span>
      </div>
      {incorrect && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          padding: '8px 12px',
          background: '#F43F5E0A',
          border: '1px solid #F43F5E20',
          borderRadius: 8,
          marginBottom: note ? 6 : 0,
        }}>
          <span style={{ color: '#F43F5E', fontSize: 12, marginTop: 2, flexShrink: 0 }}>✗</span>
          <span style={{
            fontSize: 14,
            color: '#FECDD3',
            fontFamily: 'ui-monospace, monospace',
            textDecoration: 'line-through',
            textDecorationColor: '#F43F5E60',
          }}>
            {incorrect}
          </span>
        </div>
      )}
      {note && (
        <div style={{
          fontSize: 12,
          color: TEXT_MUTED,
          paddingLeft: 6,
          fontStyle: 'italic',
        }}>
          {note}
        </div>
      )}
    </div>
  )
}

// ── Trap item ──────────────────────────────────────────────────────────────────
function TrapItem({ text }: { text: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      padding: '10px 12px',
      background: '#F59E0B0A',
      border: '1px solid #F59E0B20',
      borderRadius: 8,
      marginBottom: 6,
    }}>
      <AlertTriangle size={13} style={{ color: '#F59E0B', marginTop: 2, flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.6 }}>{text}</span>
    </div>
  )
}

// ── Linked lesson row ──────────────────────────────────────────────────────────
function LessonRow({
  lessonId,
  completedLessons,
  accent,
  onNavigate,
}: {
  lessonId: string
  completedLessons: string[]
  accent: string
  onNavigate: (id: string) => void
}) {
  const lesson = getLessonById(lessonId)
  if (!lesson) return null
  const done = completedLessons.includes(lessonId)

  return (
    <button
      onClick={() => onNavigate(lessonId)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        background: done ? '#10B9810A' : '#1F293780',
        border: `1px solid ${done ? '#10B98130' : BORDER}`,
        borderRadius: 10,
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left' as const,
        marginBottom: 8,
        transition: 'border-color 0.15s',
      }}
    >
      {done
        ? <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} />
        : <Circle size={16} style={{ color: TEXT_MUTED, flexShrink: 0 }} />
      }
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY, lineHeight: 1.3 }}>
          {lesson.title}
        </div>
        <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>
          {lesson.estimatedMinutes} min · {lesson.difficulty}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {done && (
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            color: '#10B981',
            background: '#10B98115',
            border: '1px solid #10B98130',
            borderRadius: 4,
            padding: '2px 6px',
          }}>
            Done
          </span>
        )}
        <ChevronRight size={14} style={{ color: TEXT_MUTED }} />
      </div>
    </button>
  )
}

// ── Recent error row ───────────────────────────────────────────────────────────
function RecentErrorItem({ question, dangerLevel }: { question: string; dangerLevel: string }) {
  const colorMap: Record<string, string> = {
    critical: '#F43F5E',
    high: '#F59E0B',
    medium: '#6366F1',
    low: '#64748B',
  }
  const color = colorMap[dangerLevel] ?? '#64748B'
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      padding: '10px 12px',
      background: `${color}0A`,
      border: `1px solid ${color}25`,
      borderRadius: 8,
      marginBottom: 6,
    }}>
      <span style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.1em',
        color,
        textTransform: 'uppercase' as const,
        background: `${color}15`,
        border: `1px solid ${color}30`,
        borderRadius: 4,
        padding: '2px 5px',
        flexShrink: 0,
        marginTop: 1,
      }}>
        {dangerLevel}
      </span>
      <span style={{
        fontSize: 13,
        color: TEXT_DIM,
        lineHeight: 1.5,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical' as const,
      }}>
        {question}
      </span>
    </div>
  )
}

// ── CTA button ─────────────────────────────────────────────────────────────────
function CTAButton({
  label,
  primary,
  accent,
  onClick,
}: {
  label: string
  primary?: boolean
  accent: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '13px 20px',
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        border: primary ? 'none' : `1px solid ${accent}40`,
        background: primary ? accent : `${accent}15`,
        color: primary ? '#fff' : accent,
        transition: 'opacity 0.15s',
      }}
      onMouseOver={e => (e.currentTarget.style.opacity = '0.88')}
      onMouseOut={e => (e.currentTarget.style.opacity = '1')}
    >
      {label}
    </button>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function TopicPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const store = useAppStore()

  const topic = useMemo(() => (id ? getTopicById(id) : undefined), [id])
  const mastery = useMemo(() => {
    if (!topic) return null
    return computeTopicMastery(topic, store)
  }, [topic, store.grammarSessions, store.errorNotebook, store.completedLessons])

  // Recent unresolved errors matching this topic
  const recentErrors = useMemo(() => {
    if (!topic) return []
    const twoWeeksAgo = Date.now() - 14 * 86400000
    return store.errorNotebook.filter(e => {
      if (e.resolved) return false
      if (e.lastSeen < twoWeeksAgo) return false
      if (topic.drillCategory && e.category === topic.drillCategory) return true
      if (topic.linkedLessonIds.some(lid => lid === String(e.category))) return true
      return false
    }).slice(0, 5)
  }, [topic, store.errorNotebook])

  if (!topic || !mastery) {
    return (
      <div style={{ background: BG, minHeight: '100vh', color: TEXT_PRIMARY, padding: 24 }}>
        <div style={{ color: TEXT_MUTED }}>Topic not found.</div>
      </div>
    )
  }

  const accent = CATEGORY_ACCENT[topic.category] ?? '#6366F1'
  const returnTo = (location.state as { returnTo?: string })?.returnTo ?? '/topics'

  const handleDrill = () => {
    if (topic.drillCategory) {
      navigate(`/grammar?category=${topic.drillCategory}`)
    }
  }

  const handleLesson = (lessonId: string) => {
    navigate(`/courses/${lessonId}`, { state: { returnTo: `/topics/${topic.id}` } })
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', color: TEXT_PRIMARY }}>
      {/* ── Hero ── */}
      <div style={{
        background: `radial-gradient(ellipse at 20% 50%, ${accent}14 0%, transparent 55%), ${SURFACE2}`,
        borderBottom: `1px solid ${BORDER}`,
        padding: '0 24px 28px',
        position: 'sticky' as const,
        top: 0,
        zIndex: 10,
      }}>
        {/* Back button */}
        <div style={{ paddingTop: 16, paddingBottom: 12 }}>
          <button
            onClick={() => navigate(returnTo)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: TEXT_MUTED,
              fontSize: 13,
              padding: 0,
            }}
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>

        {/* Hero content */}
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            {/* Icon */}
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: `${accent}20`,
              border: `1px solid ${accent}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              flexShrink: 0,
            }}>
              {topic.icon}
            </div>

            {/* Title block */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' as const }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase' as const,
                  color: accent,
                }}>
                  {CATEGORY_LABELS[topic.category]}
                </span>
                <span style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase' as const,
                  color: ROI_COLORS[topic.toeicROI],
                  background: `${ROI_COLORS[topic.toeicROI]}12`,
                  border: `1px solid ${ROI_COLORS[topic.toeicROI]}30`,
                  borderRadius: 4,
                  padding: '2px 6px',
                }}>
                  {ROI_LABELS[topic.toeicROI]}
                </span>
              </div>
              <h1 style={{
                fontSize: 'clamp(18px, 4vw, 24px)',
                fontWeight: 800,
                color: TEXT_PRIMARY,
                margin: '0 0 4px',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}>
                {topic.title}
              </h1>
              <p style={{ fontSize: 13, color: TEXT_MUTED, margin: 0, lineHeight: 1.5 }}>
                {topic.subtitle}
              </p>
            </div>

            {/* Mastery ring */}
            <div style={{ flexShrink: 0 }}>
              <MasteryRing level={mastery.level} />
            </div>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginTop: 20,
            paddingTop: 16,
            borderTop: `1px solid ${BORDER}`,
            flexWrap: 'wrap' as const,
          }}>
            <StatCell
              value={mastery.accuracy > 0 ? `${mastery.accuracy}%` : '—'}
              label="Accuracy"
              color={mastery.accuracy >= 72 ? '#10B981' : mastery.accuracy >= 50 ? '#F59E0B' : '#F43F5E'}
            />
            <StatCell value={mastery.attemptCount} label="Attempts" />
            <StatCell
              value={mastery.recentErrorCount}
              label="Recent errors"
              color={mastery.recentErrorCount > 0 ? '#F43F5E' : TEXT_DIM}
            />
            <StatCell
              value={formatLastPracticed(mastery.lastPracticed)}
              label="Last practiced"
            />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '20px 24px 48px', maxWidth: 760, margin: '0 auto' }}>

        {/* ── Description ── */}
        <div style={{
          fontSize: 15,
          color: TEXT_DIM,
          lineHeight: 1.8,
          marginBottom: 16,
        }}>
          {topic.description}
        </div>

        {/* ── Why it matters ── */}
        <SectionBlock
          title="Why it matters"
          icon={<Zap size={13} />}
          accent={accent}
        >
          <p style={{ fontSize: 14, color: TEXT_DIM, lineHeight: 1.8, margin: 0 }}>
            {topic.whyItMatters}
          </p>
        </SectionBlock>

        {/* ── Examples ── */}
        {topic.examples.length > 0 && (
          <SectionBlock title="Examples" icon={<BookOpen size={13} />} accent="#10B981">
            {topic.examples.map((ex, i) => (
              <ExampleItem
                key={i}
                correct={ex.correct}
                incorrect={ex.incorrect}
                note={ex.note}
              />
            ))}
          </SectionBlock>
        )}

        {/* ── Common traps ── */}
        {topic.traps.length > 0 && (
          <SectionBlock title="Common Traps" icon={<AlertTriangle size={13} />} accent="#F59E0B">
            {topic.traps.map((trap, i) => (
              <TrapItem key={i} text={trap} />
            ))}
          </SectionBlock>
        )}

        {/* ── Memory tip ── */}
        {topic.memoryTip && (
          <div style={{
            background: `${accent}0A`,
            border: `1px solid ${accent}25`,
            borderRadius: 12,
            padding: '14px 16px',
            marginBottom: 12,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
            <div>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase' as const,
                color: accent,
                marginBottom: 5,
              }}>
                Memory Tip
              </div>
              <p style={{ fontSize: 14, color: TEXT_DIM, lineHeight: 1.7, margin: 0 }}>
                {topic.memoryTip}
              </p>
            </div>
          </div>
        )}

        {/* ── Linked lessons ── */}
        {topic.linkedLessonIds.length > 0 && (
          <SectionBlock title="Linked Lessons" icon={<BookOpen size={13} />} accent={accent}>
            {topic.linkedLessonIds.map(lid => (
              <LessonRow
                key={lid}
                lessonId={lid}
                completedLessons={store.completedLessons}
                accent={accent}
                onNavigate={handleLesson}
              />
            ))}
          </SectionBlock>
        )}

        {/* ── Recent errors ── */}
        {recentErrors.length > 0 && (
          <SectionBlock title={`Recent Errors (${recentErrors.length})`} icon={<AlertTriangle size={13} />} accent="#F43F5E">
            {recentErrors.map(e => (
              <RecentErrorItem key={e.id} question={e.question} dangerLevel={e.dangerLevel} />
            ))}
            <button
              onClick={() => navigate('/errors')}
              style={{
                marginTop: 8,
                fontSize: 12,
                color: TEXT_MUTED,
                background: 'none',
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                padding: '6px 12px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              View all in Error Notebook →
            </button>
          </SectionBlock>
        )}

        {/* ── CTA strip ── */}
        {mastery.level !== 'mastered' && (
          <div style={{
            position: 'sticky' as const,
            bottom: 0,
            background: `linear-gradient(to top, ${BG} 60%, transparent)`,
            padding: '20px 0 0',
            marginTop: 20,
          }}>
            <div style={{ display: 'flex', gap: 10 }}>
              {topic.linkedLessonIds.length > 0 && !mastery.lessonCompleted && (
                <CTAButton
                  label="Start Lesson"
                  accent={accent}
                  onClick={() => handleLesson(topic.linkedLessonIds[0])}
                />
              )}
              {topic.drillCategory && (
                <CTAButton
                  label={mastery.level === 'fragile' || mastery.level === 'introduced' ? 'Drill Now' : 'Practice Drill'}
                  primary={mastery.level === 'fragile' || mastery.level === 'not_started'}
                  accent={accent}
                  onClick={handleDrill}
                />
              )}
            </div>
          </div>
        )}

        {mastery.level === 'mastered' && (
          <div style={{
            background: '#10B98112',
            border: '1px solid #10B98130',
            borderRadius: 12,
            padding: '16px 20px',
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <CheckCircle2 size={20} style={{ color: '#10B981', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#10B981' }}>Topic Mastered</div>
              <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>
                Accuracy ≥ 88%. Keep practicing occasionally to maintain your edge.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
