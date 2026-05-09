import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Zap, ChevronRight, Dumbbell, BookOpen, AlertTriangle } from 'lucide-react'
import { lessons, LESSON_CATEGORIES } from '../../data/courses'
import { LEARNING_PATHS } from '../../data/learningPaths'
import { getRepairLessons, getPathProgress } from '../../utils/lessonEngine'
import { useAppStore, getWeakCategories } from '../../store/useAppStore'
import type { Lesson, LearningPath } from '../../types'

// ══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ══════════════════════════════════════════════════════════════════════════════

const CAT_ACCENT: Record<string, string> = {
  grammar:          '#6366F1',
  vocabulary:       '#10B981',
  traps:            '#F43F5E',
  strategy:         '#F59E0B',
  reading:          '#0EA5E9',
  business_english: '#94A3B8',
}

const DIFF_META: Record<string, { label: string; color: string }> = {
  beginner:     { label: 'Beginner',     color: '#10B981' },
  intermediate: { label: 'Intermediate', color: '#F59E0B' },
  advanced:     { label: 'Advanced',     color: '#F43F5E' },
}

const PATH_ACCENTS: Record<string, string> = {
  indigo: '#6366F1',
  emerald: '#10B981',
  violet: '#8B5CF6',
  red: '#F43F5E',
  amber: '#F59E0B',
  sky: '#0EA5E9',
}

type Tab = 'browse' | 'paths' | 'repair'

// ══════════════════════════════════════════════════════════════════════════════
// LESSON CARD
// ══════════════════════════════════════════════════════════════════════════════

function LessonCard({ lesson, completed, onClick }: {
  lesson: Lesson
  completed: boolean
  onClick: () => void
}) {
  const accent = CAT_ACCENT[lesson.category] ?? '#6366F1'
  const diff = DIFF_META[lesson.difficulty] ?? DIFF_META.intermediate

  return (
    <button
      className="w-full text-left rounded-2xl transition-all duration-150 group relative overflow-hidden"
      style={{
        background: 'var(--dp-surface)',
        border: '1px solid var(--dp-border-sm)',
        boxShadow: 'var(--dp-shadow-xs)',
      }}
      onClick={onClick}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = `${accent}35`
        el.style.background = `${accent}09`
        el.style.boxShadow = `0 0 0 1px ${accent}20, var(--dp-shadow-sm)`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--dp-border-sm)'
        el.style.background = 'var(--dp-surface)'
        el.style.boxShadow = 'var(--dp-shadow-xs)'
      }}
    >
      {/* Category / completion accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-sm"
        style={{ background: completed ? '#10B981' : `${accent}55` }}
      />

      <div className="pl-5 pr-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {lesson.icon && (
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ background: `${accent}14`, border: `1px solid ${accent}22` }}
              >
                {lesson.icon}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-[14px] font-semibold leading-snug mb-1" style={{ color: 'var(--dp-text-1)' }}>
                {lesson.title}
              </p>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--dp-text-3)' }}>
                {lesson.subtitle}
              </p>
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-1.5">
            {completed && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.28)', color: '#10B981' }}
              >
                ✓ Done
              </span>
            )}
            <span className="text-[11px] font-semibold flex items-center gap-1" style={{ color: '#F59E0B' }}>
              <Zap className="w-2.5 h-2.5" />
              {lesson.xpReward} XP
            </span>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: '1px solid var(--dp-border-xs)' }}>
          <span className="text-[11px] font-semibold" style={{ color: diff.color }}>
            {diff.label}
          </span>
          <span style={{ color: 'var(--dp-border-md)' }}>·</span>
          <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--dp-text-3)' }}>
            <Clock className="w-3 h-3" />
            {lesson.estimatedMinutes} min
          </span>
          <span style={{ color: 'var(--dp-border-md)' }}>·</span>
          <span className="text-[11px] capitalize" style={{ color: 'var(--dp-text-3)' }}>
            {lesson.category.replace('_', ' ')}
          </span>
          <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: accent }} />
        </div>
      </div>
    </button>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// LEARNING PATH CARD
// ══════════════════════════════════════════════════════════════════════════════

function PathCard({ path, progress, onClick }: {
  path: LearningPath
  progress: number
  onClick: () => void
}) {
  const accent = PATH_ACCENTS[path.color] ?? '#6366F1'
  const done = progress === 100

  return (
    <button
      className="w-full text-left rounded-2xl overflow-hidden transition-all duration-150 group"
      style={{
        background: `linear-gradient(135deg, ${accent}09 0%, var(--dp-surface) 60%)`,
        border: `1px solid ${accent}22`,
        boxShadow: 'var(--dp-shadow-xs)',
      }}
      onClick={onClick}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = `${accent}42`
        el.style.boxShadow = `0 0 0 1px ${accent}22, var(--dp-shadow-sm)`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = `${accent}22`
        el.style.boxShadow = 'var(--dp-shadow-xs)'
      }}
    >
      <div className="px-5 py-5">
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: `${accent}16`, border: `1px solid ${accent}28` }}
          >
            {path.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[15px] font-bold leading-snug" style={{ color: 'var(--dp-text-1)' }}>{path.title}</p>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--dp-text-3)' }}>{path.subtitle}</p>
              </div>
              <span className="shrink-0 text-[11px] font-semibold flex items-center gap-1" style={{ color: '#F59E0B' }}>
                <Zap className="w-2.5 h-2.5" />
                {path.xpReward} XP
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px]" style={{ color: 'var(--dp-text-4)' }}>
              {path.steps.length} steps · ~{path.estimatedDays} days · {path.difficulty}
            </span>
            <span className="text-[11px] font-semibold" style={{ color: done ? '#10B981' : accent }}>
              {done ? '✓ Complete' : `${progress}%`}
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: done ? '#10B981' : `linear-gradient(90deg, ${accent}, ${accent}80)` }}
            />
          </div>
        </div>

        <p className="text-[13px] leading-[1.6] mt-3 line-clamp-2" style={{ color: 'var(--dp-text-3)' }}>
          {path.description}
        </p>
      </div>
    </button>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// REPAIR LESSON CARD
// ══════════════════════════════════════════════════════════════════════════════

function RepairCard({ lesson, onClick }: { lesson: Lesson; onClick: () => void }) {
  return (
    <button
      className="w-full text-left rounded-2xl overflow-hidden transition-all group"
      style={{
        background: 'rgba(244,63,94,0.04)',
        border: '1px solid rgba(244,63,94,0.18)',
      }}
      onClick={onClick}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,63,94,0.35)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,63,94,0.18)'
      }}
    >
      <div className="px-5 py-4 flex items-center gap-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.2)' }}
        >
          <span style={{ color: '#F43F5E' }}>🔧</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-zinc-100 leading-snug">{lesson.title}</p>
          <p className="text-[11px] mt-0.5" style={{ color: '#F43F5E' }}>Repair lesson — linked to your errors</p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          <span className="text-[11px] font-semibold flex items-center gap-1" style={{ color: '#F59E0B' }}>
            <Zap className="w-2.5 h-2.5" />
            {lesson.xpReward} XP
          </span>
          <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: '#F43F5E' }} />
        </div>
      </div>
    </button>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export default function CoursesHub() {
  const navigate = useNavigate()
  const store = useAppStore()
  const completedLessons = useAppStore(s => s.completedLessons)
  const [activeTab, setActiveTab] = useState<Tab>('browse')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Repair lessons
  const errorCats = store.errorNotebook
    .filter(e => !e.resolved)
    .map(e => e.category)
  const repairLessons = getRepairLessons(errorCats)

  function pathProgress(path: LearningPath) {
    return getPathProgress(path, completedLessons)
  }

  const filteredLessons = selectedCategory === 'all'
    ? lessons
    : lessons.filter(l => l.category === selectedCategory)

  const completedCount = completedLessons.length
  const totalCount = lessons.length
  const masteryPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'browse', label: 'Browse' },
    { id: 'paths',  label: 'Paths' },
    { id: 'repair', label: 'Repair', count: repairLessons.length },
  ]

  return (
    <div className="min-h-screen pb-28 sm:pb-10" style={{ background: 'var(--dp-bg)', color: 'var(--dp-text-1)' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-30 backdrop-blur-md"
        style={{ background: 'color-mix(in srgb, var(--dp-bg) 95%, transparent)', borderBottom: '1px solid var(--dp-border-sm)' }}
      >
        <div className="max-w-[720px] mx-auto px-4 py-4 space-y-4">
          {/* Title row */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[22px] font-black tracking-tight" style={{ color: 'var(--dp-text-1)' }}>Courses</h1>
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--dp-text-4)' }}>
                {completedCount} of {totalCount} lessons complete
              </p>
            </div>
            <div className="text-right">
              <p className="text-[28px] font-black tabular-nums" style={{ color: '#818CF8' }}>
                {masteryPct}%
              </p>
              <p className="text-[11px]" style={{ color: 'var(--dp-text-4)' }}>mastery</p>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${masteryPct}%`, background: 'linear-gradient(90deg, #6366F1, #818CF8)' }}
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dp-border-xs)' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[13px] font-semibold transition-all"
                style={activeTab === tab.id
                  ? { background: 'rgba(99,102,241,0.18)', color: '#818CF8', boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }
                  : { color: 'var(--dp-text-4)' }
                }
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {tab.count != null && tab.count > 0 && (
                  <span className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                    style={{ background: '#F43F5E', color: 'white' }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="max-w-[720px] mx-auto px-4 py-5">

        {/* ─ Browse ──────────────────────────────────────────────────────── */}
        {activeTab === 'browse' && (
          <div className="space-y-5">
            {/* Category filter chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                className="shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all"
                style={selectedCategory === 'all'
                  ? { background: '#6366F1', border: '1px solid #6366F1', color: 'white' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'var(--dp-text-4)' }
                }
                onClick={() => setSelectedCategory('all')}
              >
                All ({lessons.length})
              </button>
              {Object.entries(LESSON_CATEGORIES).map(([key, cat]) => {
                const count = lessons.filter(l => l.category === key).length
                const accent = CAT_ACCENT[key] ?? '#6366F1'
                if (count === 0) return null
                const active = selectedCategory === key
                return (
                  <button
                    key={key}
                    className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all"
                    style={active
                      ? { background: accent, border: `1px solid ${accent}`, color: 'white' }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'var(--dp-text-4)' }
                    }
                    onClick={() => setSelectedCategory(key)}
                  >
                    {cat.icon} {cat.label} ({count})
                  </button>
                )
              })}
            </div>

            {/* Lesson list */}
            <div className="space-y-2.5">
              {filteredLessons.map(lesson => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  completed={completedLessons.includes(lesson.id)}
                  onClick={() => navigate(`/courses/${lesson.id}`, { state: { returnTo: '/courses' } })}
                />
              ))}
              {filteredLessons.length === 0 && (
                <div
                  className="rounded-2xl py-14 text-center"
                  style={{ border: '1px dashed rgba(255,255,255,0.10)' }}
                >
                  <p className="text-[13px]" style={{ color: 'var(--dp-text-4)' }}>
                    No lessons in this category yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─ Paths ───────────────────────────────────────────────────────── */}
        {activeTab === 'paths' && (
          <div className="space-y-4">
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--dp-text-3)' }}>
              Structured learning paths guide you through lessons and drills in the optimal order.
            </p>
            <div className="space-y-3">
              {LEARNING_PATHS.map(path => (
                <PathCard
                  key={path.id}
                  path={path}
                  progress={pathProgress(path)}
                  onClick={() => navigate(`/paths/${path.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ─ Repair ──────────────────────────────────────────────────────── */}
        {activeTab === 'repair' && (
          <div className="space-y-4">
            {repairLessons.length > 0 ? (
              <>
                {/* Contextual banner */}
                <div
                  className="rounded-2xl px-5 py-4 space-y-1"
                  style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.18)' }}
                >
                  <p className="text-[13px] font-semibold" style={{ color: 'rgba(254,205,211,0.9)' }}>
                    🔧 {repairLessons.length} repair lesson{repairLessons.length > 1 ? 's' : ''} recommended
                  </p>
                  <p className="text-[12px]" style={{ color: 'var(--dp-text-3)' }}>
                    These lessons target the grammar categories where your error notebook shows recurring mistakes.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {repairLessons.map(lesson => (
                    <RepairCard
                      key={lesson.id}
                      lesson={lesson}
                      onClick={() => navigate(`/courses/${lesson.id}`, { state: { returnTo: '/courses' } })}
                    />
                  ))}
                </div>

                <button
                  className="w-full py-3 rounded-2xl text-[13px] font-medium transition-all"
                  style={{ background: 'var(--dp-surface)', border: '1px solid var(--dp-border-md)', color: 'var(--dp-text-3)' }}
                  onClick={() => navigate('/errors')}
                >
                  View Error Notebook →
                </button>
              </>
            ) : (
              <div className="py-16 text-center space-y-3">
                <p className="text-[32px]">🎉</p>
                <p className="text-[15px] font-semibold" style={{ color: 'var(--dp-text-2)' }}>No errors to repair</p>
                <p className="text-[13px]" style={{ color: 'var(--dp-text-3)' }}>
                  Complete grammar drills — any incorrect answers will generate repair lessons here.
                </p>
                <button
                  className="mt-2 text-[13px] underline underline-offset-2 transition-colors"
                  style={{ color: '#6366F1' }}
                  onClick={() => navigate('/grammar')}
                >
                  Start a Grammar Drill →
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
