import React, { useState } from 'react'
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react'
import { trapExamples } from '../../data/trapExamples'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'

type TrapFilter = 'all' | 'word_form' | 'preposition' | 'conjunction' | 'reading' | 'timing' | 'article'

const FILTER_LABELS: Record<TrapFilter, string> = {
  all: 'All Traps', word_form: 'Word Form', preposition: 'Preposition',
  conjunction: 'Conjunction', reading: 'Reading', timing: 'Timing', article: 'Article',
}

const CAT_COLORS: Record<string, string> = {
  word_form: 'indigo', preposition: 'amber', conjunction: 'emerald',
  reading: 'red', timing: 'red', article: 'slate',
}

export const TrapLab: React.FC = () => {
  const [filter, setFilter] = useState<TrapFilter>('all')
  const [expanded, setExpanded] = useState<number | null>(null)
  const [miniAnswered, setMiniAnswered] = useState<Record<number, number>>({})

  const filtered = filter === 'all' ? trapExamples : trapExamples.filter(t => t.category === filter)

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-3xl mx-auto space-y-5 pb-24 sm:pb-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          Trap <span className="text-gradient">Lab</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">20 critical traps that appear on every TOEIC exam</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(FILTER_LABELS) as TrapFilter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filter === f ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
            {FILTER_LABELS[f]}
            <span className="ml-1 text-slate-600">
              {f === 'all' ? trapExamples.length : trapExamples.filter(t => t.category === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Trap cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map(trap => {
          const isExpanded = expanded === trap.id
          const miniAns = miniAnswered[trap.id]
          return (
            <Card key={trap.id} className={`overflow-hidden ${isExpanded ? 'sm:col-span-2' : ''}`}>
              <div className="p-4 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : trap.id)}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={CAT_COLORS[trap.category] as any}>{trap.category.replace('_', ' ')}</Badge>
                      <span className="text-xs text-slate-600">#{trap.id}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white">{trap.title}</h3>
                    {!isExpanded && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{trap.setup.slice(0, 80)}...</p>
                    )}
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-stone-200 p-4 space-y-4">
                  {/* Setup */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">The Setup</p>
                    <pre className="text-xs text-slate-300 bg-stone-50 rounded-lg p-3 whitespace-pre-wrap font-sans">{trap.setup}</pre>
                  </div>

                  {/* Wrong answer */}
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-red-400 mb-1">Wrong: {trap.wrongAnswer}</p>
                      <p className="text-xs text-slate-400">{trap.wrongLogic}</p>
                    </div>
                  </div>

                  {/* Right answer */}
                  <div className="flex items-start gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-400 mb-1">Correct: {trap.rightAnswer}</p>
                      <p className="text-xs text-slate-400">{trap.rightLogic}</p>
                    </div>
                  </div>

                  {/* Memory cue */}
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                    <p className="text-xs font-bold text-indigo-400 mb-1">💡 Memory Cue</p>
                    <p className="text-xs text-slate-300">{trap.memoCue}</p>
                  </div>

                  {/* Mini exercise */}
                  {trap.miniExercise && (
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
                      <p className="text-xs font-bold text-amber-400 mb-2">🎯 Quick Test</p>
                      <p className="text-xs text-slate-300 mb-3">{trap.miniExercise.q}</p>
                      <div className="space-y-1.5">
                        {trap.miniExercise.opts.map((opt, i) => {
                          let cls = 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          if (miniAns !== undefined) {
                            if (i === trap.miniExercise!.correct) cls = 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                            else if (i === miniAns) cls = 'bg-red-600/20 border-red-500 text-red-300'
                            else cls = 'bg-white/3 border-white/5 text-slate-600'
                          }
                          return (
                            <button key={i} disabled={miniAns !== undefined}
                              onClick={() => setMiniAnswered(prev => ({ ...prev, [trap.id]: i }))}
                              className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all ${cls}`}>
                              {['A','B','C','D'][i]}: {opt}
                            </button>
                          )
                        })}
                      </div>
                      {miniAns !== undefined && (
                        <p className="text-xs text-emerald-400 mt-2">{trap.miniExercise.exp}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
