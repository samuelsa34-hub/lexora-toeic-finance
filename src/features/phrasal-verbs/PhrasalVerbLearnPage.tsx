import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, ChevronRight, CheckCircle2, BookOpen, Lock } from 'lucide-react'
import { phrasalVerbLessons } from '../../data/phrasalVerbLessons'
import { useAppStore } from '../../store/useAppStore'

// ── Constants ─────────────────────────────────────────────────────────────────

const DIFF_META: Record<string, { label: string; color: string }> = {
  beginner:     { label: 'Beginner',     color: '#10B981' },
  intermediate: { label: 'Intermediate', color: '#F59E0B' },
  advanced:     { label: 'Advanced',     color: '#EF4444' },
}

const CHAPTER_ICONS: Record<string, string> = {
  'pv-ch-01': '📖',
  'pv-ch-02': '🔤',
  'pv-ch-03': '🗂️',
  'pv-ch-04': '💼',
  'pv-ch-05': '🔀',
  'pv-ch-06': '🔗',
  'pv-ch-07': '📝',
  'pv-ch-08': '🏢',
  'pv-ch-09': '🇫🇷',
  'pv-ch-10': '🏆',
}

const ACCENT = '#6366F1'

// ── Sub-components ─────────────────────────────────────────────────────────────

function ProgressBar({ value, total, color = ACCENT }: { value: number; total: number; color?: string }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100)
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}

function ChapterCard({
  chapter,
  chapterNumber,
  isCompleted,
  isLocked,
  onOpen,
}: {
  chapter: typeof phrasalVerbLessons[0]
  chapterNumber: number
  isCompleted: boolean
  isLocked: boolean
  onOpen: () => void
}) {
  const diff = DIFF_META[chapter.difficulty]
  const icon = CHAPTER_ICONS[chapter.id] ?? '📚'

  return (
    <button
      onClick={isLocked ? undefined : onOpen}
      disabled={isLocked}
      className="group w-full text-left rounded-2xl p-4 transition-all duration-150"
      style={{
        background: isCompleted
          ? 'rgba(16,185,129,0.06)'
          : isLocked
            ? 'rgba(255,255,255,0.02)'
            : 'rgba(255,255,255,0.04)',
        border: isCompleted
          ? '1px solid rgba(16,185,129,0.20)'
          : isLocked
            ? '1px solid rgba(255,255,255,0.05)'
            : '1px solid rgba(255,255,255,0.08)',
        opacity: isLocked ? 0.55 : 1,
        cursor: isLocked ? 'not-allowed' : 'pointer',
      }}
    >
      <div className="flex items-start gap-3">
        {/* Chapter number / status badge */}
        <div
          className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl text-base"
          style={{
            background: isCompleted
              ? 'rgba(16,185,129,0.14)'
              : isLocked
                ? 'rgba(255,255,255,0.04)'
                : `${ACCENT}12`,
            border: isCompleted
              ? '1px solid rgba(16,185,129,0.25)'
              : isLocked
                ? '1px solid rgba(255,255,255,0.06)'
                : `1px solid ${ACCENT}25`,
          }}
        >
          {isCompleted
            ? <CheckCircle2 className="w-4.5 h-4.5" style={{ color: '#10B981' }} />
            : isLocked
              ? <Lock className="w-4 h-4" style={{ color: 'rgba(148,163,184,0.35)' }} />
              : <span>{icon}</span>
          }
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: 'rgba(148,163,184,0.45)' }}
            >
              Ch. {String(chapterNumber).padStart(2, '0')}
            </span>
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ background: `${diff.color}15`, color: diff.color }}
            >
              {diff.label}
            </span>
            {isCompleted && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
                Completed
              </span>
            )}
          </div>
          <p className="text-sm font-semibold mt-0.5 leading-snug" style={{ color: isLocked ? 'rgba(148,163,184,0.45)' : 'rgba(255,255,255,0.90)' }}>
            {chapter.title}
          </p>
          <p className="text-[11px] mt-0.5 leading-snug" style={{ color: 'rgba(148,163,184,0.55)' }}>
            {chapter.objective}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" style={{ color: 'rgba(148,163,184,0.40)' }} />
              <span className="text-[10px]" style={{ color: 'rgba(148,163,184,0.40)' }}>
                {chapter.estimatedMinutes} min
              </span>
            </div>
            <span className="text-[10px] font-semibold" style={{ color: `${ACCENT}80` }}>
              +{chapter.xpReward} XP
            </span>
          </div>
        </div>

        <ChevronRight
          className="flex-shrink-0 w-4 h-4 mt-1 transition-transform duration-150 group-hover:translate-x-0.5"
          style={{ color: isLocked ? 'rgba(148,163,184,0.25)' : 'rgba(148,163,184,0.45)' }}
        />
      </div>
    </button>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PhrasalVerbLearnPage() {
  const navigate = useNavigate()
  const { completedLessons } = useAppStore()

  const completedCount = useMemo(
    () => phrasalVerbLessons.filter(l => completedLessons.includes(l.id)).length,
    [completedLessons],
  )

  const totalMinutes = useMemo(
    () => phrasalVerbLessons.reduce((sum, l) => sum + l.estimatedMinutes, 0),
    [],
  )

  const totalXP = useMemo(
    () => phrasalVerbLessons.reduce((sum, l) => sum + l.xpReward, 0),
    [],
  )

  function isLocked(index: number): boolean {
    if (index === 0) return false
    // Each chapter requires the previous to be completed
    return !completedLessons.includes(phrasalVerbLessons[index - 1].id)
  }

  function openChapter(lesson: typeof phrasalVerbLessons[0]) {
    navigate(`/toeic/phrasal-verbs/learn/${lesson.id}`, {
      state: { returnTo: '/toeic/phrasal-verbs/learn' },
    })
  }

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-2xl mx-auto pb-28 sm:pb-10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/toeic/phrasal-verbs')}
          className="text-[11px] font-semibold mb-3 flex items-center gap-1 transition-opacity hover:opacity-70"
          style={{ color: 'rgba(148,163,184,0.55)' }}
        >
          ← Phrasal Verbs Hub
        </button>

        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl"
            style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}25` }}
          >
            <BookOpen className="w-5 h-5" style={{ color: ACCENT }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 leading-snug">Learn</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(148,163,184,0.65)' }}>
              10 chapters · From foundations to mastery · TOEIC-aligned
            </p>
          </div>
        </div>
      </div>

      {/* ── Course stats ───────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-4 mb-6"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold" style={{ color: 'rgba(148,163,184,0.65)' }}>
            Course progress
          </span>
          <span className="text-xs font-bold" style={{ color: ACCENT }}>
            {completedCount}/{phrasalVerbLessons.length} chapters
          </span>
        </div>
        <ProgressBar value={completedCount} total={phrasalVerbLessons.length} />
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <span className="text-[11px]" style={{ color: 'rgba(148,163,184,0.50)' }}>
            ~{totalMinutes} min total
          </span>
          <span className="text-[11px]" style={{ color: 'rgba(148,163,184,0.50)' }}>
            {totalXP} XP available
          </span>
          <span className="text-[11px]" style={{ color: 'rgba(148,163,184,0.50)' }}>
            {phrasalVerbLessons.filter(l => l.difficulty === 'beginner').length} beginner ·{' '}
            {phrasalVerbLessons.filter(l => l.difficulty === 'intermediate').length} intermediate ·{' '}
            {phrasalVerbLessons.filter(l => l.difficulty === 'advanced').length} advanced
          </span>
        </div>
      </div>

      {/* ── Chapter list ───────────────────────────────────────────────────── */}
      <div className="space-y-2">
        {phrasalVerbLessons.map((lesson, i) => (
          <ChapterCard
            key={lesson.id}
            chapter={lesson}
            chapterNumber={i + 1}
            isCompleted={completedLessons.includes(lesson.id)}
            isLocked={isLocked(i)}
            onOpen={() => openChapter(lesson)}
          />
        ))}
      </div>

      {/* ── Recommendation tip ─────────────────────────────────────────────── */}
      {completedCount === 0 && (
        <div
          className="mt-6 rounded-2xl p-4"
          style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}18` }}
        >
          <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(148,163,184,0.75)' }}>
            <span className="font-bold" style={{ color: ACCENT }}>Start with Chapter 1</span> — it builds the
            foundation. Each subsequent chapter is unlocked when you complete the previous one.
            A chapter takes 15–30 minutes, but spaced across days is more effective than all in one sitting.
          </p>
        </div>
      )}

      {completedCount === phrasalVerbLessons.length && (
        <div
          className="mt-6 rounded-2xl p-4 text-center"
          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}
        >
          <div className="text-2xl mb-2">🏆</div>
          <p className="text-sm font-bold" style={{ color: '#10B981' }}>Course complete!</p>
          <p className="text-[12px] mt-1" style={{ color: 'rgba(148,163,184,0.65)' }}>
            All 10 chapters done. Head to the exercises to test your mastery.
          </p>
        </div>
      )}

    </div>
  )
}
