import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen, Zap, Puzzle, AlignLeft, GraduationCap,
  ChevronRight, CheckCircle2, Lock, BarChart2, Plus,
} from 'lucide-react'
import {
  phrasalVerbs, getVerbsBySet, SET_LABELS, SET_DESCRIPTIONS,
} from '../../data/phrasalVerbs'
import { useAppStore } from '../../store/useAppStore'
import type { PhrasalVerbSet } from '../../types'

// ── Constants ─────────────────────────────────────────────────────────────────

const ACCENT = '#6366F1'

const SETS: PhrasalVerbSet[] = [1, 2, 3, 4]

const SET_ICONS: Record<PhrasalVerbSet, string> = {
  1: '📘',
  2: '🗂️',
  3: '⚡',
  4: '🏆',
}

const SET_COLORS: Record<PhrasalVerbSet, { accent: string; bg: string; border: string }> = {
  1: { accent: '#6366F1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.20)' },
  2: { accent: '#3B82F6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.20)' },
  3: { accent: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.20)' },
  4: { accent: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.20)' },
}

type ExerciseMode = {
  id: string
  label: string
  description: string
  icon: React.ElementType
  path: string
  available: boolean
  xp: number
}

const EXERCISE_MODES: ExerciseMode[] = [
  {
    id: 'learn',
    label: 'Learn',
    description: 'Study 10 structured chapters: particles, verb families, business contexts, TOEIC strategies, and mastery.',
    icon: BookOpen,
    path: '/toeic/phrasal-verbs/learn',
    available: true,
    xp: 20,
  },
  {
    id: 'fill',
    label: 'Fill in the Blank',
    description: 'Complete sentences by typing the correct phrasal verb.',
    icon: AlignLeft,
    path: '/toeic/phrasal-verbs/fill',
    available: false,
    xp: 50,
  },
  {
    id: 'particle',
    label: 'Particle Choice',
    description: 'Pick the right particle to complete the phrasal verb.',
    icon: Puzzle,
    path: '/toeic/phrasal-verbs/particle',
    available: false,
    xp: 30,
  },
  {
    id: 'matching',
    label: 'Matching',
    description: 'Match phrasal verbs to their definitions in timed pairs.',
    icon: Zap,
    path: '/toeic/phrasal-verbs/matching',
    available: false,
    xp: 40,
  },
  {
    id: 'toeic',
    label: 'TOEIC Part 5',
    description: 'Answer TOEIC-style four-option questions under exam conditions.',
    icon: GraduationCap,
    path: '/toeic/phrasal-verbs/part5',
    available: false,
    xp: 80,
  },
]

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatPill({
  value, label, accent = ACCENT,
}: { value: string | number; label: string; accent?: string }) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl"
      style={{ background: `${accent}10`, border: `1px solid ${accent}25` }}
    >
      <span className="text-xl font-bold leading-none" style={{ color: accent }}>{value}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(148,163,184,0.70)' }}>
        {label}
      </span>
    </div>
  )
}

function SetCard({
  set,
  onSelect,
}: {
  set: PhrasalVerbSet
  onSelect: (set: PhrasalVerbSet) => void
}) {
  const verbs = getVerbsBySet(set)
  const c = SET_COLORS[set]

  return (
    <button
      onClick={() => onSelect(set)}
      className="group w-full text-left rounded-2xl p-4 transition-all duration-150"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-2xl leading-none flex-shrink-0">{SET_ICONS[set]}</span>
          <div className="min-w-0">
            <div className="font-bold text-sm text-slate-200 leading-snug truncate">
              {SET_LABELS[set]}
            </div>
            <div
              className="text-[11px] mt-0.5 leading-snug line-clamp-2"
              style={{ color: 'rgba(148,163,184,0.65)' }}
            >
              {SET_DESCRIPTIONS[set]}
            </div>
          </div>
        </div>
        <ChevronRight
          className="w-4 h-4 flex-shrink-0 mt-0.5 transition-transform duration-150 group-hover:translate-x-0.5"
          style={{ color: c.accent }}
        />
      </div>

      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span
          className="text-[11px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${c.accent}18`, color: c.accent, border: `1px solid ${c.accent}30` }}
        >
          {verbs.length} verbs
        </span>
        <span className="text-[10px]" style={{ color: 'rgba(148,163,184,0.45)' }}>
          {verbs.filter(v => v.level === 1).length} foundation ·{' '}
          {verbs.filter(v => v.level === 2).length} intermediate ·{' '}
          {verbs.filter(v => v.level === 3).length} advanced
        </span>
      </div>
    </button>
  )
}

function ExerciseCard({ mode, onNavigate }: { mode: ExerciseMode; onNavigate?: () => void }) {
  const Icon = mode.icon
  const Tag = mode.available ? 'button' : 'div'
  return (
    <Tag
      {...(mode.available ? { onClick: onNavigate, type: 'button' as const } : {})}
      className="relative rounded-2xl p-4 flex items-start gap-3 w-full text-left"
      style={{
        background: mode.available ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)',
        border: mode.available ? '1px solid rgba(99,102,241,0.25)' : '1px solid rgba(255,255,255,0.06)',
        opacity: mode.available ? 1 : 0.65,
        cursor: mode.available ? 'pointer' : 'default',
      }}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl"
        style={{
          background: mode.available ? 'rgba(99,102,241,0.14)' : 'rgba(255,255,255,0.05)',
        }}
      >
        {mode.available
          ? <Icon className="w-4 h-4" style={{ color: ACCENT }} />
          : <Lock className="w-4 h-4" style={{ color: 'rgba(148,163,184,0.35)' }} />
        }
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-sm font-semibold"
            style={{ color: mode.available ? 'rgba(255,255,255,0.90)' : 'rgba(148,163,184,0.55)' }}
          >
            {mode.label}
          </span>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{
              background: mode.available ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.06)',
              color: mode.available ? ACCENT : 'rgba(148,163,184,0.40)',
            }}
          >
            +{mode.xp} XP
          </span>
          {!mode.available && (
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(148,163,184,0.45)' }}
            >
              Coming soon
            </span>
          )}
        </div>
        <p
          className="text-[11px] mt-0.5 leading-snug"
          style={{ color: 'rgba(148,163,184,0.55)' }}
        >
          {mode.description}
        </p>
      </div>
    </Tag>
  )
}

// ── Verb table (per-set preview) ───────────────────────────────────────────────

function VerbTable({ set, onClose }: { set: PhrasalVerbSet; onClose: () => void }) {
  const verbs = getVerbsBySet(set)
  const c = SET_COLORS[set]
  const { addWordFlashcard } = useAppStore()
  const [added, setAdded] = useState<Set<string>>(new Set())

  const handleAddFlashcard = (v: typeof verbs[0]) => {
    addWordFlashcard(
      v.verb,
      v.verb,
      `${v.definition}\n\n🇫🇷 ${v.definitionFr}\n\n💬 "${v.example}"`,
      v.synonyms?.join(', '),
    )
    setAdded(prev => new Set([...prev, v.id]))
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-slate-200">
          {SET_ICONS[set]} {SET_LABELS[set]}
        </h2>
        <button
          onClick={onClose}
          className="text-[11px] font-semibold px-3 py-1 rounded-lg transition-colors"
          style={{
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(148,163,184,0.70)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          ← Back
        </button>
      </div>

      <div className="space-y-2">
        {verbs.map(v => (
          <div
            key={v.id}
            className="rounded-xl p-3"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${c.border}`,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm" style={{ color: c.accent }}>
                    {v.verb}
                  </span>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(148,163,184,0.55)' }}
                  >
                    {v.separable ? 'separable' : 'inseparable'}
                  </span>
                  {v.level === 3 && (
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(239,68,68,0.10)', color: '#EF4444' }}
                    >
                      advanced
                    </span>
                  )}
                </div>
                <p className="text-[12px] mt-1 leading-snug" style={{ color: 'rgba(148,163,184,0.80)' }}>
                  {v.definition}
                </p>
                <p className="text-[11px] mt-0.5 leading-snug" style={{ color: 'rgba(148,163,184,0.50)' }}>
                  🇫🇷 {v.definitionFr}
                </p>
                <p className="text-[11px] mt-1.5 italic leading-snug" style={{ color: 'rgba(148,163,184,0.55)' }}>
                  "{v.example}"
                </p>
                {v.synonyms && v.synonyms.length > 0 && (
                  <p className="text-[10px] mt-1" style={{ color: 'rgba(148,163,184,0.40)' }}>
                    ≈ {v.synonyms.join(' · ')}
                  </p>
                )}
                {v.toeicContext && (
                  <p
                    className="text-[10px] mt-1.5 px-2 py-1 rounded-lg leading-snug"
                    style={{ background: 'rgba(99,102,241,0.08)', color: 'rgba(148,163,184,0.60)', border: '1px solid rgba(99,102,241,0.12)' }}
                  >
                    📝 TOEIC: {v.toeicContext}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleAddFlashcard(v)}
                title="Add to flashcards"
                className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-150"
                style={{
                  background: added.has(v.id) ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)',
                  border: added.has(v.id) ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(255,255,255,0.08)',
                  color: added.has(v.id) ? '#10B981' : 'rgba(148,163,184,0.45)',
                }}
              >
                {added.has(v.id) ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Hub ───────────────────────────────────────────────────────────────────

export default function PhrasalVerbsHub() {
  const navigate = useNavigate()
  const [activeSet, setActiveSet] = useState<PhrasalVerbSet | null>(null)

  const totalVerbs = phrasalVerbs.length
  const separableCount = phrasalVerbs.filter(v => v.separable).length

  const levelCounts = useMemo(() => ({
    1: phrasalVerbs.filter(v => v.level === 1).length,
    2: phrasalVerbs.filter(v => v.level === 2).length,
    3: phrasalVerbs.filter(v => v.level === 3).length,
  }), [])

  const handleSetSelect = (set: PhrasalVerbSet) => {
    setActiveSet(prev => prev === set ? null : set)
  }

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-3xl mx-auto pb-28 sm:pb-10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/toeic')}
          className="text-[11px] font-semibold mb-3 flex items-center gap-1 transition-opacity hover:opacity-70"
          style={{ color: 'rgba(148,163,184,0.55)' }}
        >
          ← Dashboard
        </button>

        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl text-2xl"
            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}
          >
            🔗
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 leading-snug">Phrasal Verbs</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(148,163,184,0.65)' }}>
              Master the essential TOEIC phrasal verbs — 4 curated sets, 5 exercise types.
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap mb-6">
        <StatPill value={totalVerbs} label="Verbs" accent={ACCENT} />
        <StatPill value={4} label="Sets" accent="#3B82F6" />
        <StatPill value={levelCounts[1]} label="Foundation" accent="#10B981" />
        <StatPill value={levelCounts[2]} label="Intermediate" accent="#F59E0B" />
        <StatPill value={separableCount} label="Separable" accent="#8B5CF6" />
      </div>

      {/* ── Sets ───────────────────────────────────────────────────────────── */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.50)' }}>
            Study Sets
          </h2>
          <span className="text-[10px]" style={{ color: 'rgba(148,163,184,0.35)' }}>
            Tap a set to preview all verbs
          </span>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {SETS.map(set => (
            <SetCard key={set} set={set} onSelect={handleSetSelect} />
          ))}
        </div>

        {activeSet !== null && (
          <VerbTable set={activeSet} onClose={() => setActiveSet(null)} />
        )}
      </section>

      {/* ── Exercise modes ─────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.50)' }}>
            Exercise Modes
          </h2>
          <div className="flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5" style={{ color: 'rgba(148,163,184,0.35)' }} />
            <span className="text-[10px]" style={{ color: 'rgba(148,163,184,0.35)' }}>
              Phases 2–5 coming
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {EXERCISE_MODES.map(mode => (
            <ExerciseCard
              key={mode.id}
              mode={mode}
              onNavigate={mode.available ? () => navigate(mode.path) : undefined}
            />
          ))}
        </div>
      </section>

      {/* ── TOEIC tip banner ───────────────────────────────────────────────── */}
      <div
        className="mt-6 rounded-2xl p-4"
        style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)' }}
      >
        <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(148,163,184,0.75)' }}>
          <span className="font-bold text-indigo-400">TOEIC Tip:</span>{' '}
          Phrasal verbs appear across all 7 parts of TOEIC, but are especially frequent in
          Part 5 (vocabulary/preposition questions), Part 3/4 conversations, and Part 7 emails.
          Knowing whether a verb is <span className="font-semibold text-slate-300">separable</span> (object can split
          the verb) helps eliminate traps in Part 5.
        </p>
      </div>

    </div>
  )
}
