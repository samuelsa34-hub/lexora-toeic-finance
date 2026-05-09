import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowLeft, Clock, Zap, CheckCircle, ChevronRight, Dumbbell,
  BookMarked, Brain, Target, Sparkles,
} from 'lucide-react'
import { getLessonById } from '../../utils/lessonEngine'
import { useAppStore } from '../../store/useAppStore'
import { GrammarTable } from '../../components/ui/GrammarTable'
import type { LessonSection, MiniQuizQuestion, ExampleSentence } from '../../types'

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

const CAT_LABEL: Record<string, string> = {
  grammar:          'Grammar',
  vocabulary:       'Vocabulary',
  traps:            'Trap Lab',
  strategy:         'Strategy',
  reading:          'Reading',
  business_english: 'Business English',
}

const SECTION_META: Record<string, { color: string; label: string; glyph: string }> = {
  intro:                { color: '#71717A', label: 'Introduction',         glyph: '◆' },
  rule:                 { color: '#6366F1', label: 'Core Rule',            glyph: '§' },
  examples:             { color: '#52525B', label: 'Examples',             glyph: '◇' },
  trap:                 { color: '#F59E0B', label: 'TOEIC Trap',           glyph: '⚠' },
  comparison:           { color: '#8B5CF6', label: 'Comparison',           glyph: '⇄' },
  memory_tip:           { color: '#A855F7', label: 'Memory Tip',           glyph: '◉' },
  toeic_tip:            { color: '#06B6D4', label: 'Exam Insight',         glyph: '◈' },
  french_note:          { color: '#3B82F6', label: 'Note en français',     glyph: '◎' },
  why_wrong:            { color: '#F43F5E', label: 'Common Mistake',       glyph: '✕' },
  objectives:           { color: '#10B981', label: 'What You\'ll Learn',   glyph: '✦' },
  flashcard_suggestion: { color: '#A855F7', label: 'Save to Flashcards',   glyph: '◈' },
}

const DIFF_META: Record<string, { label: string; color: string }> = {
  beginner:     { label: 'Beginner',     color: '#10B981' },
  intermediate: { label: 'Intermediate', color: '#F59E0B' },
  advanced:     { label: 'Advanced',     color: '#F43F5E' },
}

// ══════════════════════════════════════════════════════════════════════════════
// PRIMITIVES
// ══════════════════════════════════════════════════════════════════════════════

function MetaChip({ children, hex }: { children: React.ReactNode; hex?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium tracking-wide"
      style={hex
        ? { background: `${hex}14`, borderColor: `${hex}30`, color: hex }
        : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.10)', color: 'var(--dp-text-4)' }
      }
    >
      {children}
    </span>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
      <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
    </div>
  )
}

function SectionLabel({ meta }: { meta: { color: string; label: string; glyph: string } }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[11px]" style={{ color: meta.color }}>{meta.glyph}</span>
      <span className="text-[10px] uppercase font-bold tracking-[0.18em]" style={{ color: meta.color }}>
        {meta.label}
      </span>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// EXAMPLE SENTENCE CARD
// ══════════════════════════════════════════════════════════════════════════════

function ExampleCard({ ex, showFr }: { ex: ExampleSentence; showFr: boolean }) {
  const correct = ex.isCorrect
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: correct ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(244,63,94,0.25)',
        background: correct ? 'rgba(16,185,129,0.06)' : 'rgba(244,63,94,0.06)',
      }}
    >
      <div className="px-4 py-3.5 flex items-start gap-3">
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
          style={{
            background: correct ? 'rgba(16,185,129,0.20)' : 'rgba(244,63,94,0.18)',
            color: correct ? '#10B981' : '#F43F5E',
          }}
        >
          {correct ? '✓' : '✗'}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <p
            className="text-[15px] font-medium leading-relaxed"
            style={{
              color: correct ? 'var(--dp-text-1)' : 'var(--dp-text-4)',
              textDecoration: correct ? 'none' : 'line-through',
              textDecorationColor: 'rgba(244,63,94,0.5)',
            }}
          >
            {ex.en}
          </p>
          {showFr && ex.fr && (
            <p className="flex items-start gap-1.5 text-[12px] italic leading-relaxed" style={{ color: 'var(--dp-text-4)' }}>
              <span className="shrink-0 mt-px text-[10px]">🇫🇷</span>
              {ex.fr}
            </p>
          )}
          {ex.explanation && (
            <p
              className="text-[12px] leading-relaxed pt-2"
              style={{ color: 'var(--dp-text-3)', borderTop: '1px solid rgba(255,255,255,0.07)' }}
            >
              {ex.explanation}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION BLOCK RENDERERS
// ══════════════════════════════════════════════════════════════════════════════

function IntroBlock({ section, showFr }: { section: LessonSection; showFr: boolean }) {
  return (
    <div className="space-y-3">
      {section.title && (
        <p className="text-base font-semibold" style={{ color: 'var(--dp-text-1)' }}>{section.title}</p>
      )}
      <p className="text-[15px] leading-[1.8]" style={{ color: 'var(--dp-text-2)' }}>{section.content}</p>
      {showFr && section.contentFr && (
        <p className="flex items-start gap-2 text-[13px] italic leading-relaxed" style={{ color: 'var(--dp-text-4)' }}>
          <span className="shrink-0 mt-0.5 text-[11px]">🇫🇷</span>
          {section.contentFr}
        </p>
      )}
      {section.examples && section.examples.length > 0 && (
        <div className="space-y-2.5 pt-1">
          {section.examples.map((ex, i) => <ExampleCard key={i} ex={ex} showFr={showFr} />)}
        </div>
      )}
    </div>
  )
}

function ObjectivesBlock({ section, showFr }: { section: LessonSection; showFr: boolean }) {
  const items = section.items ?? (section.content ? section.content.split('\n').filter(Boolean) : [])
  const itemsFr = section.itemsFr ?? []
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(16,185,129,0.22)', background: 'rgba(16,185,129,0.04)' }}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-3"
        style={{ borderBottom: '1px solid rgba(16,185,129,0.14)', background: 'rgba(16,185,129,0.05)' }}
      >
        <Target className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#10B981' }} />
        <span className="text-[10px] uppercase tracking-[0.18em] font-bold" style={{ color: '#10B981' }}>
          {section.title ?? "What You'll Learn"}
        </span>
      </div>
      <div className="px-5 py-5 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}
            >
              {i + 1}
            </div>
            <div className="flex-1">
              <p className="text-[14px] leading-[1.65]" style={{ color: 'var(--dp-text-2)' }}>{item}</p>
              {showFr && itemsFr[i] && (
                <p className="text-[12px] italic mt-0.5" style={{ color: 'var(--dp-text-4)' }}>
                  🇫🇷 {itemsFr[i]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FlashcardSuggestionBlock({
  section, showFr, onSave,
}: {
  section: LessonSection
  showFr: boolean
  onSave?: (front: string, back: string, hint?: string) => void
}) {
  const [saved, setSaved] = useState<Set<number>>(new Set())
  const items = section.items ?? (section.content ? section.content.split('\n').filter(Boolean) : [])
  const itemsFr = section.itemsFr ?? []

  function handleSave(i: number) {
    if (saved.has(i)) return
    const front = items[i]
    const back = itemsFr[i] ?? items[i]
    onSave?.(front, back, section.title)
    setSaved(prev => new Set(prev).add(i))
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(168,85,247,0.22)', background: 'rgba(168,85,247,0.04)' }}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-3"
        style={{ borderBottom: '1px solid rgba(168,85,247,0.14)', background: 'rgba(168,85,247,0.05)' }}
      >
        <Brain className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#A855F7' }} />
        <span className="text-[10px] uppercase tracking-[0.18em] font-bold" style={{ color: '#A855F7' }}>
          {section.title ?? 'Save to Flashcards'}
        </span>
        <span className="ml-auto text-[10px]" style={{ color: 'rgba(168,85,247,0.55)' }}>
          {saved.size}/{items.length} saved
        </span>
      </div>
      <div className="px-5 py-4 space-y-2.5">
        {section.content && (
          <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--dp-text-3)' }}>{section.content}</p>
        )}
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl"
            style={{
              background: saved.has(i) ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
              border: saved.has(i) ? '1px solid rgba(16,185,129,0.22)' : '1px solid rgba(255,255,255,0.07)',
              transition: 'all 0.2s',
            }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-[13px] leading-relaxed font-medium" style={{ color: 'var(--dp-text-1)' }}>{item}</p>
              {showFr && itemsFr[i] && (
                <p className="text-[11px] italic mt-0.5" style={{ color: 'var(--dp-text-4)' }}>🇫🇷 {itemsFr[i]}</p>
              )}
            </div>
            <button
              onClick={() => handleSave(i)}
              disabled={saved.has(i)}
              className="shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
              style={saved.has(i)
                ? { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.28)', color: '#6EE7B7', cursor: 'default' }
                : { background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.28)', color: '#C4B5FD', cursor: 'pointer' }
              }
            >
              {saved.has(i) ? '✓ Saved' : '+ Card'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function RuleBlock({ section, showFr }: { section: LessonSection; showFr: boolean }) {
  return (
    <div className="relative pl-6">
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
        style={{ background: 'linear-gradient(180deg, #6366F1 0%, #4F46E5 100%)' }}
      />
      <div className="space-y-4">
        <SectionLabel meta={SECTION_META.rule} />
        {section.title && (
          <p className="text-[10px] uppercase tracking-[0.15em] font-medium" style={{ color: '#6366F1' }}>
            {section.title}
          </p>
        )}
        <p className="text-[18px] lg:text-[20px] font-bold leading-[1.45]" style={{ color: 'var(--dp-text-1)' }}>
          {section.content}
        </p>
        {showFr && section.contentFr && (
          <p className="flex items-start gap-2 text-[13px] italic" style={{ color: 'var(--dp-text-4)' }}>
            <span className="shrink-0 mt-0.5 text-[11px]">🇫🇷</span>
            {section.contentFr}
          </p>
        )}
        {section.examples && section.examples.length > 0 && (
          <div className="space-y-2.5 pt-1">
            {section.examples.map((ex, i) => <ExampleCard key={i} ex={ex} showFr={showFr} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function ExamplesBlock({ section, showFr }: { section: LessonSection; showFr: boolean }) {
  const hasExamples = section.examples && section.examples.length > 0
  return (
    <div className="space-y-3">
      {hasExamples && <SectionLabel meta={SECTION_META.examples} />}
      {section.title && (
        <p className="text-[13px] font-semibold" style={{ color: 'var(--dp-text-2)' }}>{section.title}</p>
      )}
      {section.content && (
        <p className="text-[14px] leading-relaxed" style={{ color: 'var(--dp-text-3)' }}>{section.content}</p>
      )}
      {showFr && section.contentFr && (
        <p className="flex items-start gap-1.5 text-[12px] italic" style={{ color: 'var(--dp-text-4)' }}>
          <span className="shrink-0 mt-0.5 text-[10px]">🇫🇷</span>{section.contentFr}
        </p>
      )}
      {hasExamples && (
        <div className="space-y-2.5">
          {section.examples!.map((ex, i) => <ExampleCard key={i} ex={ex} showFr={showFr} />)}
        </div>
      )}
    </div>
  )
}

function TrapBlock({ section, showFr }: { section: LessonSection; showFr: boolean }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(245,158,11,0.28)', background: 'rgba(245,158,11,0.05)' }}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-3"
        style={{ borderBottom: '1px solid rgba(245,158,11,0.16)', background: 'rgba(245,158,11,0.04)' }}
      >
        <span style={{ color: '#F59E0B' }}>⚠</span>
        <span className="text-[10px] uppercase tracking-[0.18em] font-bold" style={{ color: '#F59E0B' }}>
          TOEIC Trap{section.title ? ` — ${section.title}` : ''}
        </span>
      </div>
      <div className="px-5 py-5 space-y-3">
        <p className="text-[15px] leading-[1.75] whitespace-pre-line" style={{ color: '#FDE68A' }}>
          {section.content}
        </p>
        {showFr && section.contentFr && (
          <p className="flex items-start gap-2 text-[13px] italic whitespace-pre-line" style={{ color: '#FCD34D' }}>
            <span className="shrink-0 mt-0.5 text-[11px]">🇫🇷</span>
            {section.contentFr}
          </p>
        )}
        {section.examples && section.examples.length > 0 && (
          <div className="space-y-2.5 pt-1">
            {section.examples.map((ex, i) => <ExampleCard key={i} ex={ex} showFr={showFr} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function MemoryTipBlock({ section, showFr }: { section: LessonSection; showFr: boolean }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(168,85,247,0.22)', background: 'rgba(168,85,247,0.04)' }}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-3"
        style={{ borderBottom: '1px solid rgba(168,85,247,0.15)' }}
      >
        <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#A855F7' }} />
        <span className="text-[10px] uppercase tracking-[0.18em] font-bold" style={{ color: '#A855F7' }}>
          Memory Tip{section.title ? ` — ${section.title}` : ''}
        </span>
      </div>
      <div className="px-5 py-5 space-y-3">
        <p className="text-[15px] leading-[1.75] whitespace-pre-line" style={{ color: '#E9D5FF' }}>{section.content}</p>
        {showFr && section.contentFr && (
          <p className="flex items-start gap-2 text-[13px] italic whitespace-pre-line" style={{ color: '#D8B4FE' }}>
            <span className="shrink-0 mt-0.5 text-[11px]">🇫🇷</span>
            {section.contentFr}
          </p>
        )}
      </div>
    </div>
  )
}

function ToeicTipBlock({ section, showFr }: { section: LessonSection; showFr: boolean }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(6,182,212,0.22)', background: 'rgba(6,182,212,0.04)' }}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-3"
        style={{ borderBottom: '1px solid rgba(6,182,212,0.13)' }}
      >
        <span style={{ color: '#06B6D4' }}>◈</span>
        <span className="text-[10px] uppercase tracking-[0.18em] font-bold" style={{ color: '#06B6D4' }}>
          Exam Insight{section.title ? ` — ${section.title}` : ''}
        </span>
      </div>
      <div className="px-5 py-5 space-y-3">
        <p className="text-[15px] leading-[1.75] whitespace-pre-line" style={{ color: '#A5F3FC' }}>
          {section.content}
        </p>
        {showFr && section.contentFr && (
          <p className="flex items-start gap-2 text-[13px] italic whitespace-pre-line" style={{ color: '#67E8F9' }}>
            <span className="shrink-0 mt-0.5 text-[11px]">🇫🇷</span>
            {section.contentFr}
          </p>
        )}
        {section.examples && section.examples.length > 0 && (
          <div className="space-y-2.5 pt-1">
            {section.examples.map((ex, i) => <ExampleCard key={i} ex={ex} showFr={showFr} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function FrenchNoteBlock({ section }: { section: LessonSection }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(59,130,246,0.22)', background: 'rgba(59,130,246,0.04)' }}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-3"
        style={{ borderBottom: '1px solid rgba(59,130,246,0.12)' }}
      >
        <span className="text-[13px]">🇫🇷</span>
        <span className="text-[10px] uppercase tracking-[0.18em] font-bold" style={{ color: '#3B82F6' }}>
          Note en français{section.title ? ` — ${section.title}` : ''}
        </span>
      </div>
      <div className="px-5 py-5 space-y-2">
        <p className="text-[15px] leading-[1.75] italic whitespace-pre-line" style={{ color: '#BAE6FD' }}>
          {section.content}
        </p>
        {section.contentFr && (
          <p className="text-[13px] leading-relaxed" style={{ color: '#7DD3FC' }}>
            {section.contentFr}
          </p>
        )}
      </div>
    </div>
  )
}

function ComparisonBlock({ section, showFr }: { section: LessonSection; showFr: boolean }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(139,92,246,0.22)', background: 'rgba(139,92,246,0.04)' }}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-3"
        style={{ borderBottom: '1px solid rgba(139,92,246,0.15)' }}
      >
        <span style={{ color: '#8B5CF6' }}>⇄</span>
        <span className="text-[10px] uppercase tracking-[0.18em] font-bold" style={{ color: '#8B5CF6' }}>
          Comparison{section.title ? ` — ${section.title}` : ''}
        </span>
      </div>
      <div className="px-5 py-5 space-y-4">
        <p className="text-[15px] leading-[1.75] whitespace-pre-line" style={{ color: '#DDD6FE' }}>{section.content}</p>
        {showFr && section.contentFr && (
          <p className="flex items-start gap-2 text-[13px] italic whitespace-pre-line" style={{ color: 'var(--dp-text-4)' }}>
            <span className="shrink-0 mt-0.5 text-[11px]">🇫🇷</span>
            {section.contentFr}
          </p>
        )}
        {section.examples && section.examples.length > 0 && (
          <div className="space-y-2.5">
            {section.examples.map((ex, i) => <ExampleCard key={i} ex={ex} showFr={showFr} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function WhyWrongBlock({ section, showFr }: { section: LessonSection; showFr: boolean }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(244,63,94,0.22)', background: 'rgba(244,63,94,0.04)' }}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-3"
        style={{ borderBottom: '1px solid rgba(244,63,94,0.13)' }}
      >
        <span style={{ color: '#F43F5E' }}>✕</span>
        <span className="text-[10px] uppercase tracking-[0.18em] font-bold" style={{ color: '#F43F5E' }}>
          Common Mistake{section.title ? ` — ${section.title}` : ''}
        </span>
      </div>
      <div className="px-5 py-5 space-y-3">
        <p className="text-[15px] leading-[1.75] whitespace-pre-line" style={{ color: '#FECACA' }}>
          {section.content}
        </p>
        {showFr && section.contentFr && (
          <p className="flex items-start gap-2 text-[13px] italic whitespace-pre-line" style={{ color: '#FCA5A5' }}>
            <span className="shrink-0 mt-0.5 text-[11px]">🇫🇷</span>
            {section.contentFr}
          </p>
        )}
        {section.examples && section.examples.length > 0 && (
          <div className="space-y-2.5 pt-1">
            {section.examples.map((ex, i) => <ExampleCard key={i} ex={ex} showFr={showFr} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function TableBlock({ section, showFr }: { section: LessonSection; showFr: boolean }) {
  if (!section.tableHeaders || !section.tableRows) return null
  return (
    <div className="space-y-3">
      {(section.title || section.content) && (
        <div className="space-y-1.5">
          {section.title && (
            <p className="text-[11px] uppercase tracking-[0.15em] font-bold" style={{ color: '#6366F1' }}>
              {section.title}
            </p>
          )}
          {section.content && (
            <p className="text-[14px] leading-relaxed" style={{ color: 'var(--dp-text-3)' }}>
              {section.content}
            </p>
          )}
          {showFr && section.contentFr && (
            <p className="flex items-start gap-1.5 text-[12px] italic" style={{ color: 'var(--dp-text-4)' }}>
              <span className="shrink-0 mt-0.5 text-[10px]">🇫🇷</span>
              {section.contentFr}
            </p>
          )}
        </div>
      )}
      <GrammarTable
        headers={section.tableHeaders}
        rows={section.tableRows}
        caption={section.tableCaption}
        note={section.tableNote}
        accent={section.tableAccent}
      />
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION RENDERER ROUTER
// ══════════════════════════════════════════════════════════════════════════════

function SectionRenderer({
  section, showFr, onSaveFlashcard,
}: {
  section: LessonSection
  showFr: boolean
  onSaveFlashcard?: (front: string, back: string, hint?: string) => void
}) {
  switch (section.type) {
    case 'rule':                 return <RuleBlock            section={section} showFr={showFr} />
    case 'examples':             return <ExamplesBlock        section={section} showFr={showFr} />
    case 'trap':                 return <TrapBlock            section={section} showFr={showFr} />
    case 'memory_tip':           return <MemoryTipBlock       section={section} showFr={showFr} />
    case 'toeic_tip':            return <ToeicTipBlock        section={section} showFr={showFr} />
    case 'french_note':          return <FrenchNoteBlock      section={section} />
    case 'comparison':           return <ComparisonBlock      section={section} showFr={showFr} />
    case 'why_wrong':            return <WhyWrongBlock        section={section} showFr={showFr} />
    case 'table':                return <TableBlock           section={section} showFr={showFr} />
    case 'objectives':           return <ObjectivesBlock      section={section} showFr={showFr} />
    case 'flashcard_suggestion': return <FlashcardSuggestionBlock section={section} showFr={showFr} onSave={onSaveFlashcard} />
    default:                     return <IntroBlock           section={section} showFr={showFr} />
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// MINI QUIZ
// ══════════════════════════════════════════════════════════════════════════════

const QUIZ_LABELS = ['A', 'B', 'C', 'D'] as const

function QuizCard({ q, index, onAnswer }: {
  q: MiniQuizQuestion
  index: number
  onAnswer: (correct: boolean) => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [showOptExps, setShowOptExps] = useState(false)
  const answered = selected !== null

  function pick(i: number) {
    if (answered) return
    setSelected(i)
    onAnswer(i === q.correct)
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid var(--dp-border-sm)', background: 'var(--dp-surface)' }}
    >
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--dp-border-xs)' }}>
        <div className="flex items-start gap-3">
          <span className="text-[11px] font-bold shrink-0 mt-0.5 tabular-nums" style={{ color: 'var(--dp-text-4)' }}>
            Q{index + 1}
          </span>
          <p className="text-[15px] leading-[1.65] font-medium" style={{ color: 'var(--dp-text-1)' }}>{q.q}</p>
        </div>
      </div>

      <div className="p-3 space-y-1.5">
        {q.opts.map((opt, i) => {
          let bg = 'rgba(255,255,255,0.04)'
          let border = 'rgba(255,255,255,0.09)'
          let color = 'var(--dp-text-2)'
          let labelBg = 'rgba(255,255,255,0.07)'
          let labelColor = 'var(--dp-text-4)'
          const cursor = answered ? 'default' : 'pointer'

          if (answered) {
            if (i === q.correct) {
              bg = 'rgba(16,185,129,0.10)'; border = 'rgba(16,185,129,0.32)'; color = '#6EE7B7'
              labelBg = 'rgba(16,185,129,0.22)'; labelColor = '#10B981'
            } else if (i === selected) {
              bg = 'rgba(244,63,94,0.10)'; border = 'rgba(244,63,94,0.32)'; color = '#FCA5A5'
              labelBg = 'rgba(244,63,94,0.22)'; labelColor = '#F43F5E'
            } else {
              bg = 'rgba(255,255,255,0.02)'; border = 'rgba(255,255,255,0.04)'; color = 'var(--dp-text-5)'
              labelBg = 'rgba(255,255,255,0.03)'; labelColor = 'var(--dp-text-5)'
            }
          }

          return (
            <button key={i}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 text-[14px]"
              style={{ background: bg, border: `1px solid ${border}`, color, cursor }}
              onClick={() => pick(i)} disabled={answered}
            >
              <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ background: labelBg, color: labelColor }}>
                {QUIZ_LABELS[i]}
              </span>
              <span className="flex-1">{opt}</span>
              {answered && i === q.correct && <span className="shrink-0 text-sm" style={{ color: '#10B981' }}>✓</span>}
              {answered && i === selected && i !== q.correct && <span className="shrink-0 text-sm" style={{ color: '#F43F5E' }}>✗</span>}
            </button>
          )
        })}
      </div>

      {answered && (
        <div
          className="px-5 py-4 space-y-3"
          style={{
            borderTop: `1px solid ${selected === q.correct ? 'rgba(16,185,129,0.18)' : 'rgba(244,63,94,0.18)'}`,
            background: selected === q.correct ? 'rgba(16,185,129,0.04)' : 'rgba(244,63,94,0.04)',
          }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.15em]"
            style={{ color: selected === q.correct ? '#10B981' : '#F43F5E' }}>
            {selected === q.correct ? '✓ Correct' : '✗ Incorrect'}
          </p>
          <p className="text-[13px] leading-[1.65]" style={{ color: 'var(--dp-text-2)' }}>{q.exp}</p>
          {q.optExps && (
            <button
              className="text-[11px] underline underline-offset-2 transition-colors"
              style={{ color: '#6366F1' }}
              onClick={() => setShowOptExps(v => !v)}
            >
              {showOptExps ? 'Hide explanations' : 'Why not the other answers?'}
            </button>
          )}
          {showOptExps && q.optExps && (
            <div className="space-y-2.5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              {q.optExps.map((exp, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-[10px] font-bold shrink-0 mt-0.5 tabular-nums"
                    style={{ color: i === q.correct ? '#10B981' : 'var(--dp-text-4)' }}>
                    {QUIZ_LABELS[i]}.
                  </span>
                  <p className="text-[12px] leading-[1.6]"
                    style={{ color: i === q.correct ? '#6EE7B7' : 'var(--dp-text-4)' }}>
                    {exp}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// NEXT ACTIONS PANEL
// ══════════════════════════════════════════════════════════════════════════════

function NextActionsPanel({
  lesson, accent, navigate, onSaveKeyRule,
}: {
  lesson: ReturnType<typeof getLessonById>
  accent: string
  navigate: (path: string, opts?: object) => void
  onSaveKeyRule?: () => void
}) {
  if (!lesson) return null
  const actions: Array<{ icon: React.ReactNode; label: string; sub: string; onClick: () => void; color: string }> = []

  if (lesson.linkedCategory) {
    actions.push({
      icon: <Dumbbell className="w-4 h-4" />,
      label: 'Start Part 5 Drill',
      sub: lesson.linkedCategory.replace(/_/g, ' '),
      onClick: () => navigate('/grammar', { state: { category: lesson.linkedCategory } }),
      color: '#6366F1',
    })
  }
  if (lesson.linkedGapFill) {
    actions.push({
      icon: <span className="text-base leading-none">🧩</span>,
      label: 'Gap Fill Lab',
      sub: 'Put the rules into practice',
      onClick: () => navigate('/gapfill'),
      color: '#8B5CF6',
    })
  }
  if (lesson.linkedDictWords && lesson.linkedDictWords.length > 0) {
    actions.push({
      icon: <BookMarked className="w-4 h-4" />,
      label: 'Open Dictionary',
      sub: lesson.linkedDictWords.slice(0, 2).join(', '),
      onClick: () => navigate('/dictionary', { state: { initialWord: lesson.linkedDictWords![0] } }),
      color: '#10B981',
    })
  }
  if (onSaveKeyRule) {
    actions.push({
      icon: <Brain className="w-4 h-4" />,
      label: 'Save Rule to Flashcards',
      sub: 'Quick revision card',
      onClick: onSaveKeyRule,
      color: '#A855F7',
    })
  }

  if (actions.length === 0) return null

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${accent}22`, background: `${accent}06` }}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-3"
        style={{ borderBottom: `1px solid ${accent}14` }}
      >
        <span className="text-[10px] uppercase tracking-[0.18em] font-bold" style={{ color: accent }}>
          ↗ Next Actions
        </span>
      </div>
      <div className="p-4 grid sm:grid-cols-2 gap-2.5">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={action.onClick}
            className="flex items-center gap-3 p-3.5 rounded-xl text-left transition-all group"
            style={{
              background: `${action.color}0D`,
              border: `1px solid ${action.color}22`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = `${action.color}18`
              ;(e.currentTarget as HTMLElement).style.borderColor = `${action.color}38`
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = `${action.color}0D`
              ;(e.currentTarget as HTMLElement).style.borderColor = `${action.color}22`
            }}
          >
            <span style={{ color: action.color }}>{action.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold leading-tight" style={{ color: 'var(--dp-text-1)' }}>
                {action.label}
              </p>
              <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--dp-text-4)' }}>
                {action.sub}
              </p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-40 group-hover:opacity-70 transition-opacity" style={{ color: action.color }} />
          </button>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN LESSON VIEWER
// ══════════════════════════════════════════════════════════════════════════════

export default function LessonViewer() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo ?? '/courses'

  const lesson = id ? getLessonById(id) : undefined
  const store = useAppStore()
  const completedLessons = useAppStore(s => s.completedLessons)
  const isCompleted = lesson ? completedLessons.includes(lesson.id) : false

  const [showFr, setShowFr] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<(boolean | null)[]>([])
  const [quizDone, setQuizDone] = useState(false)
  const [readProgress, setReadProgress] = useState(0)
  const [keySaved, setKeySaved] = useState(false)

  useEffect(() => {
    if (lesson) store.logActivity({ type: 'lesson_start', label: `Started lesson: ${lesson.title}`, meta: { lessonId: lesson.id } })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id])

  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return
    const handleScroll = () => {
      const scrolled = main.scrollTop
      const total = main.scrollHeight - main.clientHeight
      setReadProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0)
    }
    main.addEventListener('scroll', handleScroll, { passive: true })
    return () => main.removeEventListener('scroll', handleScroll)
  }, [])

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--dp-bg)' }}>
        <div className="text-center space-y-4">
          <p className="text-[14px]" style={{ color: 'var(--dp-text-4)' }}>Lesson not found.</p>
          <button
            className="text-sm underline underline-offset-2"
            style={{ color: '#6366F1' }}
            onClick={() => navigate('/courses')}
          >
            Back to Courses
          </button>
        </div>
      </div>
    )
  }

  const accent = CAT_ACCENT[lesson.category] ?? '#6366F1'
  const diffMeta = DIFF_META[lesson.difficulty] ?? DIFF_META.intermediate

  function handleFlashcardSave(front: string, back: string, hint?: string) {
    store.addWordFlashcard(front.slice(0, 60), front, back, hint)
  }

  function handleSaveKeyRule() {
    if (!lesson || keySaved) return
    const front = `${lesson.title}: ${lesson.memorySummary[0] ?? lesson.objective}`
    const back = lesson.memorySummary.join(' | ')
    store.addWordFlashcard(lesson.title, front, back, 'Key Rule')
    setKeySaved(true)
  }

  function handleQuizAnswer(index: number, correct: boolean) {
    const updated = [...quizAnswers]
    updated[index] = correct
    setQuizAnswers(updated)
    if (updated.filter(a => a !== null).length === lesson!.miniQuiz.length) {
      setQuizDone(true)
    }
  }

  function handleComplete() {
    store.completeLesson(lesson!.id, lesson!.xpReward)
    store.logActivity({ type: 'lesson_complete', label: `Completed lesson: ${lesson!.title}`, meta: { lessonId: lesson!.id } })
    navigate(returnTo)
  }

  const quizScore = quizAnswers.filter(Boolean).length

  return (
    <div className="min-h-screen pb-28 sm:pb-12" style={{ background: 'var(--dp-bg)', color: 'var(--dp-text-1)' }}>

      {/* ── Reading progress bar ───────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px]" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full transition-[width] duration-150 ease-out"
          style={{ width: `${readProgress}%`, background: `linear-gradient(90deg, ${accent}, ${accent}80)` }}
        />
      </div>

      {/* ── Sticky nav ────────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{ background: 'color-mix(in srgb, var(--dp-bg) 95%, transparent)', borderBottom: '1px solid var(--dp-border-sm)' }}
      >
        <div className="max-w-[720px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: 'var(--dp-text-3)' }}
            onClick={() => navigate(returnTo)}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <p className="text-[12px] font-medium truncate max-w-[200px] hidden sm:block" style={{ color: 'var(--dp-text-4)' }}>
            {lesson.title}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFr(v => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
              style={showFr
                ? { background: 'rgba(59,130,246,0.14)', border: '1px solid rgba(59,130,246,0.30)', color: '#60A5FA' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: 'var(--dp-text-4)' }
              }
            >
              🇫🇷 <span className="hidden sm:inline">{showFr ? 'FR: ON' : 'FR'}</span>
            </button>
            {isCompleted && (
              <span className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.22)', color: '#059669' }}>
                <CheckCircle className="w-3 h-3" />
                <span className="hidden sm:inline">Done</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse at 25% 60%, ${accent}10 0%, transparent 60%),
            radial-gradient(ellipse at 78% 30%, ${accent}08 0%, transparent 55%),
            linear-gradient(180deg, var(--dp-surface) 0%, var(--dp-bg) 100%)
          `,
        }}
      >
        <div className="absolute top-8 right-8 w-32 h-32 rounded-full opacity-[0.06] blur-2xl" style={{ background: accent }} />
        <div className="max-w-[720px] mx-auto px-4 pt-10 pb-12">
          <div className="flex items-center gap-2.5 flex-wrap mb-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5" style={{ color: accent }}>
              {lesson.icon && <span>{lesson.icon}</span>}
              {CAT_LABEL[lesson.category] ?? lesson.category}
            </span>
            <span style={{ color: 'var(--dp-border-lg)' }}>·</span>
            <MetaChip hex={diffMeta.color}>{diffMeta.label}</MetaChip>
            <MetaChip>
              <Clock className="w-3 h-3" />
              {lesson.estimatedMinutes} min
            </MetaChip>
            <MetaChip hex={accent}>
              <Zap className="w-3 h-3" />
              +{lesson.xpReward} XP
            </MetaChip>
          </div>
          <h1 className="text-[32px] lg:text-[46px] font-black tracking-tight leading-[1.1] mb-4" style={{ color: 'var(--dp-text-1)' }}>
            {lesson.title}
          </h1>
          <p className="text-[16px] lg:text-[17px] leading-[1.65] max-w-[520px]" style={{ color: 'var(--dp-text-3)' }}>
            {lesson.subtitle}
          </p>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="max-w-[720px] mx-auto px-4 space-y-10 pt-2">

        {/* Objective + Why it matters */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl p-5 space-y-2"
            style={{ border: '1px solid var(--dp-border-sm)', background: 'var(--dp-surface)' }}>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: 'var(--dp-text-4)' }}>
              Objective
            </p>
            <p className="text-[14px] leading-[1.7]" style={{ color: 'var(--dp-text-2)' }}>{lesson.objective}</p>
          </div>
          <div className="rounded-2xl p-5 space-y-2"
            style={{ border: '1px solid rgba(245,158,11,0.24)', background: 'rgba(245,158,11,0.06)' }}>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: '#F59E0B' }}>
              Why it matters
            </p>
            <p className="text-[14px] leading-[1.7]" style={{ color: '#FDE68A' }}>
              {lesson.whyItMatters}
            </p>
            {showFr && lesson.whyItMattersFr && (
              <p className="text-[12px] italic pt-2 flex items-start gap-1.5"
                style={{ color: '#FCD34D', borderTop: '1px solid rgba(245,158,11,0.15)' }}>
                <span className="shrink-0 mt-0.5 text-[10px]">🇫🇷</span>
                {lesson.whyItMattersFr}
              </p>
            )}
          </div>
        </div>

        {/* "What you'll learn" objectives from lesson.objectives */}
        {lesson.objectives && lesson.objectives.length > 0 && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(16,185,129,0.22)', background: 'rgba(16,185,129,0.04)' }}
          >
            <div
              className="flex items-center gap-2.5 px-5 py-3"
              style={{ borderBottom: '1px solid rgba(16,185,129,0.14)', background: 'rgba(16,185,129,0.06)' }}
            >
              <Target className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#10B981' }} />
              <span className="text-[10px] uppercase tracking-[0.18em] font-bold" style={{ color: '#10B981' }}>
                What You'll Learn
              </span>
            </div>
            <div className="px-5 py-5 space-y-3">
              {lesson.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                    style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
                    {i + 1}
                  </div>
                  <p className="text-[14px] leading-[1.65]" style={{ color: 'var(--dp-text-2)' }}>{obj}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Lesson sections ────────────────────────────────────────────── */}
        <div className="space-y-9">
          {lesson.sections.map((section, i) => (
            <SectionRenderer
              key={i}
              section={section}
              showFr={showFr}
              onSaveFlashcard={handleFlashcardSave}
            />
          ))}
        </div>

        <Divider />

        {/* ── Key Takeaways ──────────────────────────────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(139,92,246,0.22)', background: 'rgba(139,92,246,0.04)' }}
        >
          <div
            className="flex items-center justify-between px-6 py-3.5"
            style={{ borderBottom: '1px solid rgba(139,92,246,0.15)', background: 'rgba(139,92,246,0.03)' }}
          >
            <div className="flex items-center gap-2.5">
              <span style={{ color: '#A855F7' }}>◉</span>
              <span className="text-[10px] uppercase tracking-[0.18em] font-bold" style={{ color: '#A855F7' }}>
                Key Takeaways
              </span>
            </div>
            <button
              onClick={handleSaveKeyRule}
              disabled={keySaved}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
              style={keySaved
                ? { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.28)', color: '#6EE7B7', cursor: 'default' }
                : { background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.28)', color: '#C4B5FD', cursor: 'pointer' }
              }
            >
              <Brain className="w-3 h-3" />
              {keySaved ? 'Saved' : 'Save to Flashcards'}
            </button>
          </div>
          <div className="px-6 py-6 space-y-3.5">
            {lesson.memorySummary.map((item, i) => (
              <div key={i} className="flex items-start gap-3.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                  style={{ background: 'rgba(139,92,246,0.15)', color: '#A855F7' }}>
                  {i + 1}
                </div>
                <p className="text-[14px] leading-[1.7]" style={{ color: 'var(--dp-text-2)' }}>{item}</p>
              </div>
            ))}
            {showFr && lesson.memorySummaryFr && (
              <div className="space-y-2.5 pt-4 mt-1" style={{ borderTop: '1px solid rgba(139,92,246,0.12)' }}>
                {lesson.memorySummaryFr.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-[11px] shrink-0 mt-0.5">🇫🇷</span>
                    <p className="text-[12px] italic leading-[1.6]" style={{ color: 'var(--dp-text-4)' }}>{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Divider />

        {/* ── Mini Quiz ──────────────────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: 'var(--dp-text-4)' }}>
                Mini Quiz
              </p>
              <h2 className="text-[20px] font-bold" style={{ color: 'var(--dp-text-1)' }}>Test your understanding</h2>
              <p className="text-[13px]" style={{ color: 'var(--dp-text-4)' }}>
                {lesson.miniQuiz.length} questions · based on this lesson
              </p>
            </div>
            {!quizStarted && (
              <button
                className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all"
                style={{ background: `${accent}12`, border: `1px solid ${accent}30`, color: accent }}
                onClick={() => setQuizStarted(true)}
              >
                Begin <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {!quizStarted && (
            <div className="rounded-2xl p-8 text-center"
              style={{ border: '1px dashed var(--dp-border-sm)' }}>
              <p className="text-[13px]" style={{ color: 'var(--dp-text-4)' }}>
                Answer {lesson.miniQuiz.length} questions to complete this lesson
              </p>
            </div>
          )}

          {quizStarted && (
            <div className="space-y-4">
              {lesson.miniQuiz.map((q, i) => (
                <QuizCard key={i} q={q} index={i} onAnswer={(correct) => handleQuizAnswer(i, correct)} />
              ))}
            </div>
          )}

          {quizDone && (
            <div
              className="rounded-2xl p-6 space-y-5"
              style={{
                border: quizScore === lesson.miniQuiz.length
                  ? '1px solid rgba(16,185,129,0.25)'
                  : '1px solid var(--dp-border-sm)',
                background: quizScore === lesson.miniQuiz.length
                  ? 'rgba(16,185,129,0.04)'
                  : 'var(--dp-surface)',
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="text-[36px] font-black tabular-nums"
                  style={{
                    color: quizScore === lesson.miniQuiz.length ? '#059669'
                      : quizScore >= Math.ceil(lesson.miniQuiz.length / 2) ? '#D97706'
                      : '#DC2626',
                  }}
                >
                  {quizScore}/{lesson.miniQuiz.length}
                </div>
                <div>
                  <p className="text-[15px] font-semibold" style={{ color: 'var(--dp-text-1)' }}>
                    {quizScore === lesson.miniQuiz.length
                      ? 'Perfect — lesson mastered.'
                      : quizScore >= Math.ceil(lesson.miniQuiz.length / 2)
                      ? 'Good work.'
                      : 'Review recommended.'}
                  </p>
                  <p className="text-[12px] mt-0.5" style={{ color: 'var(--dp-text-4)' }}>
                    {quizScore === lesson.miniQuiz.length
                      ? 'Every answer correct.'
                      : 'Re-read the Core Rule section before drilling.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {lesson.linkedCategory && (
                  <button
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all"
                    style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.22)', color: '#818CF8' }}
                    onClick={() => navigate('/grammar', { state: { category: lesson.linkedCategory } })}
                  >
                    <Dumbbell className="w-3.5 h-3.5" />
                    Drill: {lesson.linkedCategory!.replace(/_/g, ' ')}
                  </button>
                )}
                {lesson.linkedGapFill && (
                  <button
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all"
                    style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.22)', color: '#C4B5FD' }}
                    onClick={() => navigate('/gapfill')}
                  >
                    Gap Fill Lab
                  </button>
                )}
                <button
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                  style={isCompleted
                    ? { background: 'var(--dp-surface-warm)', border: '1px solid var(--dp-border-sm)', color: 'var(--dp-text-4)' }
                    : { background: `${accent}12`, border: `1px solid ${accent}30`, color: accent }
                  }
                  onClick={handleComplete}
                >
                  <CheckCircle className="w-4 h-4" />
                  {isCompleted ? 'Back' : `Complete · +${lesson.xpReward} XP`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Next Actions ───────────────────────────────────────────────── */}
        <NextActionsPanel
          lesson={lesson}
          accent={accent}
          navigate={navigate}
          onSaveKeyRule={keySaved ? undefined : handleSaveKeyRule}
        />

        {/* ── Continue learning ──────────────────────────────────────────── */}
        {lesson.nextLessonIds && lesson.nextLessonIds.length > 0 && (
          <div className="space-y-3 pb-2">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: 'var(--dp-text-4)' }}>
              Continue learning
            </p>
            <div className="flex gap-2.5 flex-wrap">
              {lesson.nextLessonIds.map(nextId => {
                const next = getLessonById(nextId)
                if (!next) return null
                return (
                  <button
                    key={nextId}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] transition-all group"
                    style={{ border: '1px solid var(--dp-border-sm)', background: 'var(--dp-surface)', color: 'var(--dp-text-3)' }}
                    onClick={() => navigate(`/courses/${nextId}`, { state: { returnTo } })}
                  >
                    {next.icon && <span>{next.icon}</span>}
                    <span className="group-hover:text-slate-200 transition-colors">{next.title}</span>
                    <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--dp-text-5)' }} />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Completion CTA ─────────────────────────────────────────────── */}
        {!quizStarted && (
          <button
            className="w-full py-4 rounded-2xl text-[15px] font-semibold transition-all"
            style={isCompleted
              ? { background: 'var(--dp-surface-warm)', border: '1px solid var(--dp-border-sm)', color: 'var(--dp-text-4)' }
              : { background: `linear-gradient(135deg, ${accent}18, ${accent}08)`, border: `1px solid ${accent}30`, color: accent }
            }
            onClick={handleComplete}
          >
            {isCompleted ? '← Back' : `Complete Lesson · +${lesson.xpReward} XP`}
          </button>
        )}

      </div>
    </div>
  )
}
