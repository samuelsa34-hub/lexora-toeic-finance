import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Search, BookOpen, Star, StarOff, Zap, Plus, X, ChevronRight,
  AlertCircle, Clock,
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { dictionaryEntries, searchDictionary, getDictionaryEntriesForTags } from '../../data/dictionaryEntries'
import type { DictionaryEntry } from '../../types'

// ── Accent palette by level ───────────────────────────────────────────────────
const LEVEL_COLORS: Record<1 | 2 | 3, { accent: string; bg: string; label: string }> = {
  1: { accent: '#10B981', bg: 'rgba(16,185,129,0.10)', label: 'Foundation' },
  2: { accent: '#F59E0B', bg: 'rgba(245,158,11,0.10)', label: 'Intermediate' },
  3: { accent: '#EF4444', bg: 'rgba(239,68,68,0.10)', label: 'Advanced' },
}

const POS_COLORS: Record<string, string> = {
  noun: '#6366F1', verb: '#EC4899', adjective: '#F59E0B', adverb: '#10B981',
  pronoun: '#8B5CF6', conjunction: '#3B82F6', determiner: '#06B6D4',
  preposition: '#EF4444', phrase: '#78716C',
}

const ALL_TAGS = ['grammar', 'business', 'toeic', 'legal', 'finance', 'management', 'formal', 'connector', 'verb', 'adjective']

// ── Sub-components ────────────────────────────────────────────────────────────

function LevelBadge({ level }: { level: 1 | 2 | 3 }) {
  const c = LEVEL_COLORS[level]
  return (
    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.accent, border: `1px solid ${c.accent}30` }}>
      {c.label}
    </span>
  )
}

function PosBadge({ pos }: { pos: string }) {
  const color = POS_COLORS[pos] ?? '#64748B'
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
      style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>
      {pos}
    </span>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-widest mb-2"
      style={{ color: 'var(--dp-text-4)' }}>
      {children}
    </div>
  )
}

function Divider() {
  return <div className="my-4" style={{ height: 1, background: 'var(--dp-border-xs)' }} />
}

function ChipList({ items, color = '#6366F1' }: { items: string[]; color?: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span key={i}
          className="text-xs px-2.5 py-1 rounded-lg"
          style={{ background: `${color}12`, color, border: `1px solid ${color}20` }}>
          {item}
        </span>
      ))}
    </div>
  )
}

// ── Word Result Row ───────────────────────────────────────────────────────────

function WordRow({
  entry, active, saved, onClick
}: {
  entry: DictionaryEntry
  active: boolean
  saved: boolean
  onClick: () => void
}) {
  const lc = LEVEL_COLORS[entry.level]
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 transition-all duration-100 flex items-center gap-3 group"
      style={{
        background: active ? 'rgba(99,102,241,0.09)' : 'transparent',
        borderLeft: active ? '2px solid #6366F1' : '2px solid transparent',
      }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-sm truncate"
            style={{ color: active ? '#818CF8' : 'var(--dp-text-1)' }}>
            {entry.word}
          </span>
          {entry.phonetic && (
            <span className="text-[11px] hidden sm:inline" style={{ color: 'var(--dp-text-4)' }}>
              {entry.phonetic}
            </span>
          )}
        </div>
        <div className="text-xs truncate pr-2" style={{ color: 'var(--dp-text-3)' }}>
          {entry.pos.slice(0, 2).join(', ')} — {entry.definition.slice(0, 60)}…
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {saved && <Star className="w-3 h-3" style={{ color: '#F59E0B' }} />}
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
          style={{ background: lc.bg, color: lc.accent }}>
          L{entry.level}
        </span>
        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity"
          style={{ color: 'var(--dp-text-4)' }} />
      </div>
    </button>
  )
}

// ── Create Flashcard Modal ────────────────────────────────────────────────────

function FlashcardModal({
  entry, onClose, onSave
}: {
  entry: DictionaryEntry
  onClose: () => void
  onSave: (front: string, back: string, hint: string) => void
}) {
  const [front, setFront] = useState(entry.word)
  const [back, setBack] = useState(entry.definition.slice(0, 100))
  const [hint, setHint] = useState(entry.phonetic ?? '')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-md rounded-2xl p-6 space-y-4"
        style={{ background: 'var(--dp-surface)', border: '1px solid var(--dp-border-md)' }}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base" style={{ color: 'var(--dp-text-1)' }}>Create Flashcard</h3>
          <button onClick={onClose} style={{ color: 'var(--dp-text-4)' }}><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--dp-text-3)' }}>Front (Question)</label>
            <input
              className="w-full rounded-xl px-3 py-2.5 text-sm"
              style={{ background: 'var(--dp-surface-warm)', border: '1px solid var(--dp-border-sm)', color: 'var(--dp-text-1)' }}
              value={front}
              onChange={e => setFront(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--dp-text-3)' }}>Back (Answer)</label>
            <textarea
              className="w-full rounded-xl px-3 py-2.5 text-sm resize-none"
              rows={3}
              style={{ background: 'var(--dp-surface-warm)', border: '1px solid var(--dp-border-sm)', color: 'var(--dp-text-1)' }}
              value={back}
              onChange={e => setBack(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--dp-text-3)' }}>Hint (optional)</label>
            <input
              className="w-full rounded-xl px-3 py-2.5 text-sm"
              style={{ background: 'var(--dp-surface-warm)', border: '1px solid var(--dp-border-sm)', color: 'var(--dp-text-1)' }}
              value={hint}
              onChange={e => setHint(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--dp-surface-warm)', color: 'var(--dp-text-2)', border: '1px solid var(--dp-border-sm)' }}>
            Cancel
          </button>
          <button
            onClick={() => { onSave(front, back, hint); onClose() }}
            className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
            Create Card
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Add to List Modal ─────────────────────────────────────────────────────────

function AddToListModal({
  word, vocabLists, onClose, onAdd, onCreate
}: {
  word: string
  vocabLists: import('../../types').VocabList[]
  onClose: () => void
  onAdd: (listId: string) => void
  onCreate: (name: string) => void
}) {
  const [newName, setNewName] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-sm rounded-2xl p-6 space-y-4"
        style={{ background: 'var(--dp-surface)', border: '1px solid var(--dp-border-md)' }}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base" style={{ color: 'var(--dp-text-1)' }}>Add to Vocab List</h3>
          <button onClick={onClose} style={{ color: 'var(--dp-text-4)' }}><X className="w-4 h-4" /></button>
        </div>
        <div className="text-xs" style={{ color: 'var(--dp-text-3)' }}>
          Adding: <span className="font-semibold" style={{ color: '#818CF8' }}>{word}</span>
        </div>
        {vocabLists.length > 0 ? (
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {vocabLists.map(list => (
              <button
                key={list.id}
                onClick={() => { onAdd(list.id); onClose() }}
                className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors"
                style={{ background: 'var(--dp-surface-warm)', border: '1px solid var(--dp-border-xs)' }}>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--dp-text-1)' }}>{list.name}</div>
                  <div className="text-xs" style={{ color: 'var(--dp-text-4)' }}>{list.words.length} words</div>
                </div>
                <Plus className="w-4 h-4" style={{ color: 'var(--dp-text-3)' }} />
              </button>
            ))}
          </div>
        ) : (
          <div className="text-sm text-center py-3" style={{ color: 'var(--dp-text-3)' }}>
            No vocab lists yet. Create one below.
          </div>
        )}
        <div className="pt-1">
          <div className="text-xs font-semibold mb-1.5" style={{ color: 'var(--dp-text-3)' }}>Create new list</div>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl px-3 py-2 text-sm"
              placeholder="List name…"
              style={{ background: 'var(--dp-surface-warm)', border: '1px solid var(--dp-border-sm)', color: 'var(--dp-text-1)' }}
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
            <button
              onClick={() => { if (newName.trim()) { onCreate(newName.trim()); onClose() } }}
              disabled={!newName.trim()}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
              style={{ background: '#6366F1' }}>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Word Detail Panel ─────────────────────────────────────────────────────────

function WordDetail({
  entry,
  isSaved,
  onSave,
  onUnsave,
  onFlashcard,
  onAddToList,
  savedWordNote,
  onNoteChange,
}: {
  entry: DictionaryEntry
  isSaved: boolean
  onSave: () => void
  onUnsave: () => void
  onFlashcard: () => void
  onAddToList: () => void
  savedWordNote?: string
  onNoteChange: (note: string) => void
}) {
  const [note, setNote] = useState(savedWordNote ?? '')
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showFr, setShowFr] = useState(false)
  const lc = LEVEL_COLORS[entry.level]

  useEffect(() => { setNote(savedWordNote ?? '') }, [savedWordNote, entry.id])

  const handleNoteChange = (val: string) => {
    setNote(val)
    if (noteTimer.current) clearTimeout(noteTimer.current)
    noteTimer.current = setTimeout(() => onNoteChange(val), 800)
  }

  return (
    <div className="h-full overflow-y-auto" style={{ color: 'var(--dp-text-1)' }}>
      {/* ── Header ── */}
      <div className="sticky top-0 z-10 px-5 pt-5 pb-4"
        style={{ background: 'var(--dp-surface)', borderBottom: '1px solid var(--dp-border-xs)' }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black tracking-tight leading-none mb-1"
              style={{ color: 'var(--dp-text-1)' }}>
              {entry.word}
            </h2>
            {entry.phonetic && (
              <div className="text-sm font-mono mb-2" style={{ color: 'var(--dp-text-4)' }}>
                {entry.phonetic}
              </div>
            )}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {entry.pos.map(p => <PosBadge key={p} pos={p} />)}
              <LevelBadge level={entry.level} />
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0 pt-1">
            <button
              onClick={isSaved ? onUnsave : onSave}
              title={isSaved ? 'Remove from saved words' : 'Save word'}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={isSaved
                ? { background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' }
                : { background: 'var(--dp-surface-warm)', color: 'var(--dp-text-2)', border: '1px solid var(--dp-border-sm)' }}>
              {isSaved ? <Star className="w-3.5 h-3.5 fill-current" /> : <StarOff className="w-3.5 h-3.5" />}
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
        {/* Action bar */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={onFlashcard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: 'rgba(99,102,241,0.10)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.20)' }}>
            <Zap className="w-3 h-3" /> Flashcard
          </button>
          <button
            onClick={onAddToList}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: 'rgba(16,185,129,0.08)', color: '#10B981', border: '1px solid rgba(16,185,129,0.20)' }}>
            <Plus className="w-3 h-3" /> Add to List
          </button>
          <button
            onClick={() => setShowFr(f => !f)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ml-auto"
            style={showFr
              ? { background: 'rgba(139,92,246,0.12)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.25)' }
              : { background: 'var(--dp-surface-warm)', color: 'var(--dp-text-3)', border: '1px solid var(--dp-border-xs)' }}>
            FR
          </button>
        </div>
      </div>

      <div className="px-5 pt-4 pb-6 space-y-0">

        {/* ── Definition ── */}
        <div className="mb-4">
          <SectionLabel>Definition</SectionLabel>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--dp-text-1)' }}>
            {entry.definition}
          </p>
          {showFr && entry.definitionFr && (
            <p className="text-sm leading-relaxed mt-2 italic" style={{ color: '#A78BFA' }}>
              {entry.definitionFr}
            </p>
          )}
        </div>

        {/* ── Grammar note ── */}
        {entry.grammarNote && (
          <>
            <Divider />
            <div className="mb-4">
              <SectionLabel>Grammar Note</SectionLabel>
              <div className="rounded-xl p-3.5 text-sm leading-relaxed whitespace-pre-line"
                style={{
                  background: 'rgba(99,102,241,0.07)',
                  border: '1px solid rgba(99,102,241,0.15)',
                  color: 'var(--dp-text-2)',
                }}>
                {entry.grammarNote}
              </div>
            </div>
          </>
        )}

        {/* ── Examples ── */}
        {entry.examples.length > 0 && (
          <>
            <Divider />
            <div className="mb-4">
              <SectionLabel>Examples</SectionLabel>
              <div className="space-y-2.5">
                {entry.examples.map((ex, i) => (
                  <div key={i} className="group">
                    <div className="flex gap-2 text-sm">
                      <span className="mt-0.5 flex-shrink-0 text-[10px] font-bold rounded px-1"
                        style={{ background: lc.bg, color: lc.accent }}>
                        {i + 1}
                      </span>
                      <span style={{ color: 'var(--dp-text-1)' }}>{ex}</span>
                    </div>
                    {showFr && entry.examplesFr?.[i] && (
                      <div className="flex gap-2 text-xs mt-1 ml-5 italic" style={{ color: '#A78BFA' }}>
                        {entry.examplesFr[i]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Collocations ── */}
        {entry.collocations && entry.collocations.length > 0 && (
          <>
            <Divider />
            <div className="mb-4">
              <SectionLabel>Common Collocations</SectionLabel>
              <ChipList items={entry.collocations} color="#6366F1" />
            </div>
          </>
        )}

        {/* ── Verb+Prep ── */}
        {entry.verbPrep && entry.verbPrep.length > 0 && (
          <>
            <Divider />
            <div className="mb-4">
              <SectionLabel>Verb + Preposition</SectionLabel>
              <ChipList items={entry.verbPrep} color="#EC4899" />
            </div>
          </>
        )}

        {/* ── Phrasal Verbs ── */}
        {entry.phrasalVerbs && entry.phrasalVerbs.length > 0 && (
          <>
            <Divider />
            <div className="mb-4">
              <SectionLabel>Phrasal Verbs</SectionLabel>
              <ChipList items={entry.phrasalVerbs} color="#8B5CF6" />
            </div>
          </>
        )}

        {/* ── Synonyms / Antonyms ── */}
        {(entry.synonyms?.length || entry.antonyms?.length) ? (
          <>
            <Divider />
            <div className="mb-4 grid grid-cols-2 gap-4">
              {entry.synonyms && entry.synonyms.length > 0 && (
                <div>
                  <SectionLabel>Synonyms</SectionLabel>
                  <div className="flex flex-col gap-1">
                    {entry.synonyms.map((s, i) => (
                      <span key={i} className="text-xs" style={{ color: 'var(--dp-text-2)' }}>→ {s}</span>
                    ))}
                  </div>
                </div>
              )}
              {entry.antonyms && entry.antonyms.length > 0 && (
                <div>
                  <SectionLabel>Antonyms</SectionLabel>
                  <div className="flex flex-col gap-1">
                    {entry.antonyms.map((s, i) => (
                      <span key={i} className="text-xs" style={{ color: 'var(--dp-text-2)' }}>→ {s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}

        {/* ── TOEIC Context ── */}
        {entry.toeicContext && (
          <>
            <Divider />
            <div className="mb-4">
              <SectionLabel>TOEIC Context</SectionLabel>
              <div className="rounded-xl p-3.5 text-sm leading-relaxed flex gap-2.5"
                style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.20)', color: 'var(--dp-text-2)' }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
                <span>{entry.toeicContext}</span>
              </div>
            </div>
          </>
        )}

        {/* ── Common Mistakes ── */}
        {entry.commonMistakes && entry.commonMistakes.length > 0 && (
          <>
            <Divider />
            <div className="mb-4">
              <SectionLabel>Common Mistakes</SectionLabel>
              <div className="space-y-2">
                {entry.commonMistakes.map((m, i) => (
                  <div key={i} className="flex gap-2.5 text-sm rounded-xl p-3"
                    style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                    <X className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#EF4444' }} />
                    <span style={{ color: 'var(--dp-text-2)' }}>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Confused With ── */}
        {entry.confusedWith && entry.confusedWith.length > 0 && (
          <>
            <Divider />
            <div className="mb-4">
              <SectionLabel>Often Confused With</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {entry.confusedWith.map((w, i) => (
                  <span key={i}
                    className="text-xs font-mono font-semibold px-2.5 py-1.5 rounded-lg"
                    style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.20)' }}>
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Forms ── */}
        {(entry.plural || entry.irregularForms?.length) ? (
          <>
            <Divider />
            <div className="mb-4">
              <SectionLabel>Word Forms</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {entry.plural && (
                  <span className="text-xs px-2.5 py-1.5 rounded-lg"
                    style={{ background: 'rgba(99,102,241,0.08)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.20)' }}>
                    Plural: {entry.plural}
                  </span>
                )}
                {entry.irregularForms?.map((f, i) => (
                  <span key={i} className="text-xs px-2.5 py-1.5 rounded-lg"
                    style={{ background: 'rgba(99,102,241,0.08)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.20)' }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {/* ── Tags ── */}
        {entry.tags && entry.tags.length > 0 && (
          <>
            <Divider />
            <div className="mb-4">
              <SectionLabel>Tags</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {entry.tags.map((t, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--dp-surface-warm)', color: 'var(--dp-text-3)', border: '1px solid var(--dp-border-xs)' }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── My Note ── */}
        <Divider />
        <div>
          <SectionLabel>My Note</SectionLabel>
          <textarea
            value={note}
            onChange={e => handleNoteChange(e.target.value)}
            placeholder="Add a personal note about this word…"
            rows={3}
            className="w-full rounded-xl px-3 py-2.5 text-sm resize-none"
            style={{
              background: 'var(--dp-surface-warm)',
              border: '1px solid var(--dp-border-sm)',
              color: 'var(--dp-text-1)',
            }}
          />
          <div className="text-[10px] mt-1" style={{ color: 'var(--dp-text-4)' }}>Auto-saved as you type</div>
        </div>

      </div>
    </div>
  )
}

// ── Main Dictionary Component ─────────────────────────────────────────────────

export default function Dictionary() {
  const {
    savedWords, recentDictSearches,
    saveWord, unsaveWord, updateWordNote,
    addWordFlashcard, createVocabList, addWordToList,
    addDictSearch, vocabLists,
  } = useAppStore()

  const location = useLocation()
  const incomingWord = (location.state as { initialWord?: string } | null)?.initialWord ?? null

  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(
    incomingWord ?? dictionaryEntries[0]?.id ?? null
  )
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [showFlashcardModal, setShowFlashcardModal] = useState(false)
  const [showListModal, setShowListModal] = useState(false)
  const [mobileShowDetail, setMobileShowDetail] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    let base = query.trim()
      ? searchDictionary(query)
      : activeTag
        ? getDictionaryEntriesForTags([activeTag])
        : [...dictionaryEntries]

    if (showSavedOnly) base = base.filter(e => !!savedWords[e.id])
    return base
  }, [query, activeTag, showSavedOnly, savedWords])

  const selectedEntry = useMemo(
    () => dictionaryEntries.find(e => e.id === selectedId) ?? null,
    [selectedId]
  )

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
    setMobileShowDetail(true)
    addDictSearch(id)
  }, [addDictSearch])

  const handleSearch = (val: string) => {
    setQuery(val)
    setActiveTag(null)
    if (results.length > 0 && results[0]) setSelectedId(results[0].id)
  }

  useEffect(() => {
    if (results.length > 0 && !results.find(e => e.id === selectedId)) {
      setSelectedId(results[0].id)
    }
  }, [results, selectedId])

  const handleFlashcard = (front: string, back: string, hint: string) => {
    if (!selectedEntry) return
    addWordFlashcard(selectedEntry.word, front, back, hint || undefined)
  }

  const handleAddToList = (listId: string) => {
    if (!selectedEntry) return
    addWordToList(selectedEntry.id, listId)
  }

  const handleCreateList = (name: string) => {
    if (!selectedEntry) return
    const id = createVocabList(name)
    addWordToList(selectedEntry.id, id)
  }

  return (
    <div className="flex flex-col h-full min-h-screen" style={{ background: 'var(--dp-bg)' }}>

      {/* ── Page Header ── */}
      <div className="flex-shrink-0 px-4 sm:px-6 pt-5 pb-4"
        style={{ borderBottom: '1px solid var(--dp-border-sm)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.20)' }}>
              <BookOpen className="w-5 h-5" style={{ color: '#818CF8' }} />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight leading-none" style={{ color: 'var(--dp-text-1)' }}>
                Learner Dictionary
              </h1>
              <div className="text-xs mt-0.5" style={{ color: 'var(--dp-text-4)' }}>
                {dictionaryEntries.length} words · TOEIC-focused · Original definitions
              </div>
            </div>
            {Object.keys(savedWords).length > 0 && (
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setShowSavedOnly(s => !s)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={showSavedOnly
                    ? { background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' }
                    : { background: 'var(--dp-surface)', color: 'var(--dp-text-3)', border: '1px solid var(--dp-border-sm)' }}>
                  <Star className={`w-3 h-3 ${showSavedOnly ? 'fill-current' : ''}`} />
                  Saved ({Object.keys(savedWords).length})
                </button>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: 'var(--dp-text-4)' }} />
            <input
              ref={inputRef}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
              placeholder="Search words, definitions, tags…"
              style={{
                background: 'var(--dp-surface)',
                border: '1px solid var(--dp-border-sm)',
                color: 'var(--dp-text-1)',
              }}
              value={query}
              onChange={e => handleSearch(e.target.value)}
            />
            {query && (
              <button onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--dp-text-4)' }}>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tag filter */}
          <div className="flex gap-1.5 mt-2.5 overflow-x-auto no-scrollbar pb-0.5">
            {ALL_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => { setActiveTag(activeTag === tag ? null : tag); setQuery('') }}
                className="flex-shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all"
                style={activeTag === tag
                  ? { background: 'rgba(99,102,241,0.15)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.30)' }
                  : { background: 'var(--dp-surface)', color: 'var(--dp-text-3)', border: '1px solid var(--dp-border-xs)' }}>
                #{tag}
              </button>
            ))}
          </div>

          {/* Recent searches */}
          {recentDictSearches.length > 0 && !query && (
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1"
                style={{ color: 'var(--dp-text-4)' }}>
                <Clock className="w-3 h-3" /> Recent:
              </span>
              {recentDictSearches.slice(0, 6).map(id => {
                const e = dictionaryEntries.find(x => x.id === id)
                if (!e) return null
                return (
                  <button
                    key={id}
                    onClick={() => handleSelect(id)}
                    className="text-xs px-2 py-0.5 rounded-lg"
                    style={{ background: 'var(--dp-surface)', color: 'var(--dp-text-3)', border: '1px solid var(--dp-border-xs)' }}>
                    {e.word}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Main content — split panel ── */}
      <div className="flex-1 overflow-hidden max-w-6xl mx-auto w-full flex">

        {/* Left: word list */}
        <div className={`${mobileShowDetail ? 'hidden' : 'flex'} md:flex flex-col w-full md:w-72 lg:w-80 flex-shrink-0 overflow-hidden`}
          style={{ borderRight: '1px solid var(--dp-border-sm)' }}>

          {/* Results count */}
          <div className="px-4 py-2 flex-shrink-0"
            style={{ borderBottom: '1px solid var(--dp-border-xs)', background: 'var(--dp-surface)' }}>
            <span className="text-xs" style={{ color: 'var(--dp-text-4)' }}>
              {results.length} {results.length === 1 ? 'word' : 'words'}
              {showSavedOnly && ' · saved only'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto" style={{ background: 'var(--dp-surface)' }}>
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2">
                <Search className="w-8 h-8" style={{ color: 'var(--dp-text-4)' }} />
                <div className="text-sm" style={{ color: 'var(--dp-text-3)' }}>No results found</div>
              </div>
            ) : (
              results.map(entry => (
                <WordRow
                  key={entry.id}
                  entry={entry}
                  active={entry.id === selectedId}
                  saved={!!savedWords[entry.id]}
                  onClick={() => handleSelect(entry.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right: word detail */}
        <div className={`${mobileShowDetail ? 'flex' : 'hidden'} md:flex flex-col flex-1 overflow-hidden`}
          style={{ background: 'var(--dp-surface)' }}>

          {/* Mobile back button */}
          <div className="md:hidden px-4 py-2 flex-shrink-0"
            style={{ borderBottom: '1px solid var(--dp-border-xs)' }}>
            <button
              onClick={() => setMobileShowDetail(false)}
              className="flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: '#818CF8' }}>
              ← Back to list
            </button>
          </div>

          {selectedEntry ? (
            <WordDetail
              key={selectedEntry.id}
              entry={selectedEntry}
              isSaved={!!savedWords[selectedEntry.id]}
              onSave={() => saveWord(selectedEntry.id)}
              onUnsave={() => unsaveWord(selectedEntry.id)}
              onFlashcard={() => setShowFlashcardModal(true)}
              onAddToList={() => setShowListModal(true)}
              savedWordNote={savedWords[selectedEntry.id]?.note}
              onNoteChange={note => updateWordNote(selectedEntry.id, note)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 p-6">
              <BookOpen className="w-10 h-10" style={{ color: 'var(--dp-text-4)' }} />
              <div className="text-center">
                <div className="font-semibold mb-1" style={{ color: 'var(--dp-text-2)' }}>Select a word</div>
                <div className="text-sm" style={{ color: 'var(--dp-text-4)' }}>
                  Choose a word from the list to see its full entry.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {showFlashcardModal && selectedEntry && (
        <FlashcardModal
          entry={selectedEntry}
          onClose={() => setShowFlashcardModal(false)}
          onSave={handleFlashcard}
        />
      )}
      {showListModal && selectedEntry && (
        <AddToListModal
          word={selectedEntry.word}
          vocabLists={vocabLists}
          onClose={() => setShowListModal(false)}
          onAdd={handleAddToList}
          onCreate={handleCreateList}
        />
      )}
    </div>
  )
}
