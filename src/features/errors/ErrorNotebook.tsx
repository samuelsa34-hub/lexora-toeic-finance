import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { XCircle, CheckCircle, AlertTriangle, Trash2, BookOpen, Dumbbell, GraduationCap, BookMarked } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { CAT_LABELS } from '../../utils/constants'
import { getRepairLesson } from '../../utils/lessonEngine'
import { getDictionaryEntry } from '../../data/dictionaryEntries'
import type { ErrorEntry } from '../../types'

function findDictMatch(text: string) {
  const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean)
  for (const w of words) {
    const entry = getDictionaryEntry(w)
    if (entry) return entry
  }
  return null
}

type FilterType = 'all' | 'unresolved' | 'high_danger'
type SortType = 'date' | 'frequency' | 'danger'

const DANGER_COLORS: Record<string, string> = { low: 'emerald', medium: 'amber', high: 'red', critical: 'red' }

function daysAgo(ts: number): string {
  const diff = Date.now() - ts
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  return `${days}d ago`
}

export const ErrorNotebook: React.FC = () => {
  const navigate = useNavigate()
  const { errorNotebook, resolveError, clearResolvedErrors } = useAppStore()
  const [filter, setFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortType>('date')
  const [partFilter, setPartFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  const unresolvedCount = errorNotebook.filter(e => !e.resolved).length
  const criticalCount = errorNotebook.filter(e => e.dangerLevel === 'critical').length
  const resolvedCount = errorNotebook.filter(e => e.resolved).length

  const clearResolved = () => {
    clearResolvedErrors()
    setShowConfirmClear(false)
  }

  const filtered = useMemo(() => {
    let list = [...errorNotebook]
    if (filter === 'unresolved') list = list.filter(e => !e.resolved)
    if (filter === 'high_danger') list = list.filter(e => e.dangerLevel === 'high' || e.dangerLevel === 'critical')
    if (partFilter !== 'all') list = list.filter(e => e.part === partFilter)
    if (catFilter !== 'all') list = list.filter(e => String(e.category) === catFilter)
    if (sortBy === 'date') list.sort((a, b) => b.lastSeen - a.lastSeen)
    if (sortBy === 'frequency') list.sort((a, b) => b.occurrences - a.occurrences)
    if (sortBy === 'danger') {
      const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
      list.sort((a, b) => (order[a.dangerLevel] ?? 4) - (order[b.dangerLevel] ?? 4))
    }
    return list
  }, [errorNotebook, filter, sortBy, partFilter, catFilter])

  const allCats = useMemo(() => [...new Set(errorNotebook.map(e => String(e.category)))], [errorNotebook])
  const allParts = useMemo(() => [...new Set(errorNotebook.map(e => e.part))], [errorNotebook])

  // Most frequent error category — used for the "Drill weakest" button
  const topErrorCat = useMemo(() => {
    if (errorNotebook.length === 0) return null
    const counts: Record<string, number> = {}
    errorNotebook.filter(e => !e.resolved).forEach(e => {
      const cat = String(e.category)
      counts[cat] = (counts[cat] || 0) + e.occurrences
    })
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    return sorted[0]?.[0] ?? null
  }, [errorNotebook])

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-3xl mx-auto space-y-5 pb-24 sm:pb-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Error <span className="text-gradient">Notebook</span>
            {unresolvedCount > 0 && <Badge variant="red">{unresolvedCount} open</Badge>}
          </h1>
          <p className="text-slate-400 text-sm mt-1">Track and resolve every mistake</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {topErrorCat && unresolvedCount > 0 && (
            <Button size="sm" variant="ghost"
              onClick={() => navigate('/grammar', { state: { category: topErrorCat } })}>
              <Dumbbell className="w-3.5 h-3.5" /> Drill weakest
            </Button>
          )}
          {resolvedCount > 0 && (
            <Button size="sm" variant="ghost" onClick={() => setShowConfirmClear(true)}>
              <Trash2 className="w-3 h-3" /> Clear Resolved
            </Button>
          )}
        </div>
      </div>

      {showConfirmClear && (
        <Card className="p-4 border-amber-500/30">
          <p className="text-sm text-amber-300 mb-3">Remove all {resolvedCount} resolved errors?</p>
          <div className="flex gap-2">
            <Button size="sm" variant="danger" onClick={clearResolved}>Confirm</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowConfirmClear(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-white">{errorNotebook.length}</div>
          <div className="text-xs text-slate-500 mt-1">Total</div>
        </div>
        <div className="bg-stone-50 border border-red-500/20 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
          <div className="text-xs text-slate-500 mt-1">Critical</div>
        </div>
        <div className="bg-stone-50 border border-emerald-500/20 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-emerald-400">{resolvedCount}</div>
          <div className="text-xs text-slate-500 mt-1">Resolved</div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex gap-2 flex-wrap items-center">
          {(['all', 'unresolved', 'high_danger'] as FilterType[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                filter === f ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}>
              {f === 'all' ? 'All' : f === 'unresolved' ? 'Open' : 'High Danger'}
            </button>
          ))}
          <select value={sortBy} onChange={e => setSortBy(e.target.value as SortType)}
            className="ml-auto bg-stone-50 border border-stone-200 text-slate-400 text-xs rounded-lg px-2 py-1.5">
            <option value="date">Sort: Date</option>
            <option value="frequency">Sort: Frequency</option>
            <option value="danger">Sort: Danger</option>
          </select>
        </div>
        {(allParts.length > 1 || allCats.length > 1) && (
          <div className="flex gap-2 flex-wrap">
            <select value={partFilter} onChange={e => setPartFilter(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-slate-400 text-xs rounded-lg px-2 py-1.5">
              <option value="all">All Parts</option>
              {allParts.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
            </select>
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-slate-400 text-xs rounded-lg px-2 py-1.5">
              <option value="all">All Categories</option>
              {allCats.map(c => <option key={c} value={c}>{CAT_LABELS[c] || c}</option>)}
            </select>
            {catFilter !== 'all' && (
              <Button size="sm" variant="ghost"
                onClick={() => navigate('/grammar', { state: { category: catFilter } })}>
                <Dumbbell className="w-3 h-3" /> Drill {CAT_LABELS[catFilter] || catFilter}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Error list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-400 mb-2">
            {errorNotebook.length === 0 ? 'No errors yet — start drilling!' : 'No errors match your filters'}
          </h3>
          <p className="text-sm text-slate-600">
            {errorNotebook.length === 0
              ? 'Every mistake in Grammar Drill or Reading will appear here automatically.'
              : 'Try clearing the filters to see all errors.'}
          </p>
          {errorNotebook.length === 0 && (
            <Button size="sm" className="mt-4" onClick={() => navigate('/grammar')}>
              Start Grammar Drill
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(err => (
            <ErrorCard key={err.id} error={err}
              expanded={expandedId === err.id}
              onToggle={() => setExpandedId(expandedId === err.id ? null : err.id)}
              onResolve={() => resolveError(err.id)}
              onDrill={() => navigate('/grammar', { state: { category: err.category } })}
              onRepair={(lessonId) => navigate(`/courses/${lessonId}`, { state: { returnTo: '/errors' } })}
              onLookup={(wordId) => navigate('/dictionary', { state: { initialWord: wordId } })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const ErrorCard: React.FC<{
  error: ErrorEntry
  expanded: boolean
  onToggle: () => void
  onResolve: () => void
  onDrill: () => void
  onRepair: (lessonId: string) => void
  onLookup: (wordId: string) => void
}> = ({ error, expanded, onToggle, onResolve, onDrill, onRepair, onLookup }) => {
  const dangerColor = DANGER_COLORS[error.dangerLevel] || 'slate'
  const repairLesson = getRepairLesson(String(error.category))
  const dictMatch = findDictMatch(error.opts[error.correctAnswer] ?? '')

  return (
    <Card className={`border-l-2 transition-all ${
      error.resolved ? 'opacity-50' : ''
    } ${
      error.dangerLevel === 'critical' ? 'border-l-red-500' :
      error.dangerLevel === 'high' ? 'border-l-amber-500' : 'border-l-slate-600'
    }`}>
      <div className="p-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge variant={dangerColor as any}>{error.dangerLevel}</Badge>
              <Badge variant="slate">{CAT_LABELS[String(error.category)] || String(error.category)}</Badge>
              {error.occurrences > 1 && <Badge variant="red">×{error.occurrences}</Badge>}
              {error.resolved && <Badge variant="emerald">resolved</Badge>}
              <span className="text-xs text-slate-600 ml-auto">{daysAgo(error.lastSeen)}</span>
            </div>
            <p className="text-sm text-slate-300 line-clamp-1">{error.question}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-red-400 line-through truncate max-w-[40%]">{error.opts[error.userAnswer]}</span>
              <span className="text-xs text-slate-600 flex-shrink-0">→</span>
              <span className="text-xs text-emerald-400 truncate max-w-[40%]">{error.opts[error.correctAnswer]}</span>
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-stone-200 p-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Question</p>
            <p className="text-sm text-slate-300">{error.question}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {error.opts.map((opt, i) => (
              <div key={i} className={`px-3 py-2 rounded-lg text-xs border ${
                i === error.correctAnswer ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-300' :
                i === error.userAnswer ? 'bg-red-600/10 border-red-500/30 text-red-300' :
                'bg-white/3 border-white/5 text-slate-600'
              }`}>
                {['A', 'B', 'C', 'D'][i]}: {opt}
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Explanation</p>
            <p className="text-xs text-slate-300">{error.explanation}</p>
          </div>
          {error.trap && (
            <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-300"><strong>Trap: </strong>{error.trap}</p>
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="ghost" onClick={onDrill} className="flex-1">
              <Dumbbell className="w-3.5 h-3.5" /> Drill
            </Button>
            {repairLesson && (
              <Button size="sm" variant="ghost" onClick={() => onRepair(repairLesson.id)} className="flex-1">
                <GraduationCap className="w-3.5 h-3.5" /> Repair Lesson
              </Button>
            )}
            {dictMatch && (
              <Button size="sm" variant="ghost" onClick={() => onLookup(dictMatch.id)} className="flex-1">
                <BookMarked className="w-3.5 h-3.5" /> Look Up: {dictMatch.word}
              </Button>
            )}
            {!error.resolved && (
              <Button size="sm" variant="success" onClick={onResolve} className="flex-1">
                <CheckCircle className="w-4 h-4" /> Resolved
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
