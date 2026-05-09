import React, { useState, useRef } from 'react'
import { ChevronRight, CheckCircle, XCircle, AlertTriangle, FileText, BookOpen, RotateCcw } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { passages } from '../../data/passages'
import { TimerRing } from '../../components/ui/TimerRing'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useTimer } from '../../hooks/useTimer'
import type { ReadingSession } from '../../types'

type Tab = 'practice' | 'part5' | 'part6'

const TYPE_LABELS: Record<string, string> = {
  memo: 'Memo', email: 'Email', advertisement: 'Ad', notice: 'Notice', article: 'Article', form: 'Form', report: 'Report'
}
const TYPE_COLORS: Record<string, string> = {
  memo: 'indigo', email: 'emerald', advertisement: 'amber', notice: 'slate', article: 'red'
}
const LABELS = ['A', 'B', 'C', 'D']

export const ReadingCenter: React.FC = () => {
  const { addReadingSession, addError } = useAppStore()
  const [tab, setTab] = useState<Tab>('practice')
  const [selectedPassage, setSelectedPassage] = useState<number | null>(null)
  const [questionIdx, setQuestionIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [results, setResults] = useState<{ correct: boolean; time: number }[]>([])
  const [done, setDone] = useState(false)
  const qStartTime = useRef(Date.now())
  const sessionStart = useRef(Date.now())

  const passage = selectedPassage !== null ? passages.find(p => p.id === selectedPassage) : null
  const question = passage ? passage.questions[questionIdx] : null

  const timer = useTimer(75, () => {
    if (!answered && question) handleAnswer(-1)
  })

  const startPassage = (id: number) => {
    setSelectedPassage(id)
    setQuestionIdx(0)
    setSelectedAnswer(null)
    setAnswered(false)
    setResults([])
    setDone(false)
    qStartTime.current = Date.now()
    sessionStart.current = Date.now()
    timer.restart(75)
  }

  const handleAnswer = (idx: number) => {
    if (answered || !question || !passage) return
    timer.pause()
    setAnswered(true)
    setSelectedAnswer(idx)
    const timeSpent = Math.round((Date.now() - qStartTime.current) / 1000)
    const correct = idx === question.correct

    setResults(prev => [...prev, { correct, time: timeSpent }])

    if (!correct) {
      addError({
        part: 'part7',
        category: 'reading',
        question: question.q,
        opts: [...question.opts],
        correctAnswer: question.correct,
        userAnswer: idx,
        explanation: question.exp,
        trap: question.trap,
        dangerLevel: passage.difficulty === 'hard' ? 'critical' : 'high',
        timestamp: Date.now(),
      })
    }
  }

  const nextQuestion = () => {
    if (!passage) return
    if (questionIdx + 1 >= passage.questions.length) {
      const finalResults = [...results]
      const correctCount = finalResults.filter(r => r.correct).length
      const session: ReadingSession = {
        id: `rs_${Date.now()}`,
        timestamp: Date.now(),
        passageId: passage.id,
        correct: correctCount,
        total: passage.questions.length,
        totalTime: Math.round((Date.now() - sessionStart.current) / 1000),
      }
      addReadingSession(session)
      setDone(true)
      return
    }
    setQuestionIdx(prev => prev + 1)
    setSelectedAnswer(null)
    setAnswered(false)
    qStartTime.current = Date.now()
    timer.restart(75)
  }

  if (tab === 'part5') return <Part5Info />
  if (tab === 'part6') return <Part6Info />

  if (!selectedPassage || !passage) {
    return (
      <div className="p-4 sm:p-5 lg:p-6 max-w-3xl mx-auto space-y-5 pb-24 sm:pb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Reading <span className="text-gradient">Center</span></h1>
          <p className="text-slate-400 text-sm mt-1">Part 5, 6, and 7 strategies and practice</p>
        </div>
        <div className="flex gap-2">
          {(['practice', 'part5', 'part6'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${tab === t ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
              {t === 'practice' ? 'Part 7 Practice' : t === 'part5' ? 'Part 5 Guide' : 'Part 6 Guide'}
            </button>
          ))}
        </div>

        <div className="grid gap-3">
          {passages.map(p => (
            <Card key={p.id} hover className="p-4" onClick={() => startPassage(p.id)}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={TYPE_COLORS[p.type] as any}>{TYPE_LABELS[p.type] || p.type}</Badge>
                    <Badge variant={p.difficulty === 'easy' ? 'emerald' : p.difficulty === 'hard' ? 'red' : 'amber'}>{p.difficulty}</Badge>
                    <span className="text-xs text-slate-600">{p.wordCount} words</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{p.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>📝 {p.questions.length} questions</span>
                    <span>⏱ ~{p.estimatedTime} min</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (done) {
    const correctCount = results.filter(r => r.correct).length
    const accuracy = Math.round(correctCount / passage.questions.length * 100)
    const avgTime = results.length > 0 ? Math.round(results.reduce((s, r) => s + r.time, 0) / results.length) : 0
    return (
      <div className="p-4 sm:p-5 lg:p-6 max-w-2xl mx-auto space-y-4 pb-24 sm:pb-6">
        <div className="text-center">
          <div className={`text-6xl font-black mb-2 ${accuracy >= 75 ? 'text-emerald-400' : accuracy >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{accuracy}%</div>
          <p className="text-slate-400">{correctCount}/{passage.questions.length} correct · avg {avgTime}s per question</p>
        </div>
        <Card className="p-4 space-y-2">
          {passage.questions.map((q, i) => (
            <div key={i} className="flex items-start gap-2">
              {results[i]?.correct
                ? <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                : <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />}
              <div>
                <p className="text-xs text-slate-300">{q.q}</p>
                {!results[i]?.correct && <p className="text-xs text-emerald-400 mt-0.5">✓ {q.opts[q.correct]}</p>}
              </div>
            </div>
          ))}
        </Card>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setSelectedPassage(null)} className="flex-1">
            <RotateCcw className="w-4 h-4" /> All Passages
          </Button>
          <Button onClick={() => startPassage(passage.id)} className="flex-1">
            Retry <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  if (question) {
    return (
      <div className="p-4 sm:p-5 lg:p-6 max-w-2xl mx-auto space-y-4 pb-24 sm:pb-6">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost" onClick={() => setSelectedPassage(null)}>← Back</Button>
          <span className="text-xs text-slate-500 flex-1">{passage.title}</span>
          <TimerRing timeLeft={timer.timeLeft} total={75} size={48} urgency={timer.urgency} />
          <span className="text-xs font-mono text-slate-500">Q{questionIdx + 1}/{passage.questions.length}</span>
        </div>

        <Card className="p-4 max-h-72 overflow-y-auto">
          <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{passage.text}</pre>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={question.type === 'inference' ? 'amber' : question.type === 'vocabulary' ? 'indigo' : 'slate'}>
              {question.type.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-sm font-medium text-white mb-3">{question.q}</p>
          <div className="space-y-2">
            {question.opts.map((opt, i) => {
              let cls = 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              if (answered) {
                if (i === question.correct) cls = 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                else if (i === selectedAnswer && i !== question.correct) cls = 'bg-red-600/20 border-red-500 text-red-300'
                else cls = 'bg-white/3 border-white/5 text-slate-600'
              }
              return (
                <button key={i} onClick={() => !answered && handleAnswer(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-xs font-medium transition-all text-left ${cls}`}>
                  <span className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-xs font-bold flex-shrink-0">{LABELS[i]}</span>
                  {opt}
                  {answered && i === question.correct && <CheckCircle className="w-4 h-4 ml-auto text-emerald-400" />}
                  {answered && i === selectedAnswer && i !== question.correct && <XCircle className="w-4 h-4 ml-auto text-red-400" />}
                </button>
              )
            })}
          </div>
        </Card>

        {answered && (
          <Card className="p-4 border-indigo-500/20 bg-indigo-600/5 space-y-2">
            <p className="text-xs text-slate-300">{question.exp}</p>
            {question.trap && (
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-300"><strong>Trap: </strong>{question.trap}</p>
              </div>
            )}
          </Card>
        )}

        {answered && (
          <Button className="w-full" onClick={nextQuestion}>
            {questionIdx + 1 >= passage.questions.length ? 'See Results' : 'Next Question'} <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    )
  }

  return null
}

const Part5Info: React.FC = () => (
  <div className="p-4 sm:p-5 lg:p-6 max-w-3xl mx-auto space-y-5 pb-24 sm:pb-6">
    <h2 className="text-xl font-bold text-white">Part 5 — Incomplete Sentences Strategy</h2>
    <div className="grid gap-4">
      {[
        { title: '1. Identify Blank Position (5 sec)', body: 'Look at what comes BEFORE and AFTER the blank. Article/possessive before blank → adjective needed. Subject before blank → verb needed. Already have verb → adverb or adjective.' },
        { title: '2. Eliminate Wrong Word Forms (10 sec)', body: 'All 4 options are usually the same root word in different forms (noun/verb/adjective/adverb). Immediately eliminate forms that cannot work grammatically.' },
        { title: '3. Check for Fixed Collocations', body: 'Preposition questions: responsible FOR, comply WITH, result FROM/IN. These never change. Vocabulary questions: read all 4 options carefully for meaning.' },
        { title: '4. Time Budget: 15 seconds each', body: 'Part 5 = 40 questions in 10 min ideal (35 sec max each). If stuck after 45 sec, mark and skip. Part 7 points are more valuable. Never guess before reading all options.' },
        { title: '5. Common Trap Types', body: 'Noun vs Adjective before another noun. Adverb vs Adjective (the -ly trap). "Economic" (economy-related) vs "Economical" (efficient). Articles: first mention A, second mention THE.' },
      ].map(item => (
        <Card key={item.title} className="p-4">
          <h3 className="text-sm font-semibold text-indigo-400 mb-2">{item.title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{item.body}</p>
        </Card>
      ))}
    </div>
  </div>
)

const Part6Info: React.FC = () => (
  <div className="p-4 sm:p-5 lg:p-6 max-w-3xl mx-auto space-y-5 pb-24 sm:pb-6">
    <h2 className="text-xl font-bold text-white">Part 6 — Text Completion Strategy</h2>
    <div className="grid gap-4">
      {[
        { title: '1. Read Full Context (Critical Difference from Part 5)', body: 'Part 6 blanks depend on the surrounding paragraph. Always read the FULL sentence before AND after the blank. Context can completely change the correct tense or connector.' },
        { title: '2. Discourse Connector Questions', body: 'Some Part 6 blanks require a sentence-level connector. Ask: does the next sentence CONTRAST, ADD to, or RESULT FROM the previous one? However = contrast. Furthermore = addition. Therefore = result.' },
        { title: '3. Sentence Insertion Questions', body: 'One question in each Part 6 set asks you to INSERT A FULL SENTENCE. Read the sentences before and after the blank to find logical flow. Look for pronoun references (it, this, they) that connect to surrounding content.' },
        { title: '4. Tense Consistency', body: 'Part 6 passages have a dominant tense. If the passage is about past events, blanks usually need past tense. If future policy, use future or modal. Match the tense of surrounding paragraphs.' },
        { title: '5. Time Budget: 2 min per passage', body: 'Part 6 = 4 passages × 4 questions = 16 questions in ~8 minutes. Each passage takes about 2 minutes. Do not rush — context reading is worth the time.' },
      ].map(item => (
        <Card key={item.title} className="p-4">
          <h3 className="text-sm font-semibold text-indigo-400 mb-2">{item.title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{item.body}</p>
        </Card>
      ))}
    </div>
  </div>
)
