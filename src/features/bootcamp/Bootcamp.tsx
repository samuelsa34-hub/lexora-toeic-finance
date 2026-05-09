import React, { useMemo, useState } from 'react'
import { Zap, CheckCircle, Circle, Clock, Play, AlertTriangle, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { bootcampPlans } from '../../data/bootcampPlans'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { MODULE_ROUTES, MODULE_ICONS } from '../../utils/constants'

export const Bootcamp: React.FC = () => {
  const navigate = useNavigate()
  const { profile, updateProfile, completeBootcampTask } = useAppStore()
  const [pendingDuration, setPendingDuration] = useState<7 | 10 | 14 | null>(null)
  const currentPlan = bootcampPlans.find(p => p.duration === profile.bootcampDuration) || bootcampPlans[2]

  const currentDayIndex = useMemo(() => {
    if (!profile.bootcampStartDate) return -1
    const start = new Date(profile.bootcampStartDate)
    const today = new Date()
    const diff = Math.floor((today.getTime() - start.getTime()) / 86400000)
    return Math.max(0, Math.min(diff, currentPlan.days.length - 1))
  }, [profile.bootcampStartDate, currentPlan])

  const planCompleted = profile.bootcampStartDate !== null &&
    Math.floor((Date.now() - new Date(profile.bootcampStartDate).getTime()) / 86400000) >= currentPlan.days.length

  const currentDay = currentDayIndex >= 0 && !planCompleted ? currentPlan.days[currentDayIndex] : null

  const startBootcamp = () => {
    updateProfile({ bootcampStartDate: new Date().toDateString() })
  }

  const getDayStatus = (dayIndex: number): 'completed' | 'today' | 'upcoming' => {
    if (!profile.bootcampStartDate) return 'upcoming'
    if (dayIndex < currentDayIndex) return 'completed'
    if (dayIndex === currentDayIndex && !planCompleted) return 'today'
    return planCompleted ? 'completed' : 'upcoming'
  }

  const getDayProgress = (dayTasks: typeof currentPlan.days[0]['tasks']) => {
    const done = dayTasks.filter(t => profile.completedBootcampTasks.includes(t.id)).length
    return { done, total: dayTasks.length }
  }

  const handleDurationChange = (d: 7 | 10 | 14) => {
    if (d === profile.bootcampDuration) return
    if (profile.bootcampStartDate && profile.completedBootcampTasks.length > 0) {
      setPendingDuration(d)
    } else {
      updateProfile({ bootcampDuration: d, bootcampStartDate: null, completedBootcampTasks: [] })
    }
  }

  const confirmDurationChange = () => {
    if (!pendingDuration) return
    updateProfile({ bootcampDuration: pendingDuration, bootcampStartDate: null, completedBootcampTasks: [] })
    setPendingDuration(null)
  }

  const totalTasksDone = profile.completedBootcampTasks.filter(id =>
    currentPlan.days.flatMap(d => d.tasks).some(t => t.id === id)
  ).length
  const totalTasks = currentPlan.days.reduce((s, d) => s + d.tasks.length, 0)

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-3xl mx-auto space-y-6 pb-24 sm:pb-6">
      <div>
        <h1 className="text-2xl font-black text-white">TOEIC <span className="text-gradient">Bootcamp</span></h1>
        <p className="text-slate-400 text-sm mt-1">Your personalized path to 940</p>
      </div>

      {/* Duration Selector */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Plan Duration</h3>
        {pendingDuration && (
          <div className="mb-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300">Switch to {pendingDuration}-day plan? Your current progress ({profile.completedBootcampTasks.length} tasks) will be reset.</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="danger" onClick={confirmDurationChange}>Confirm Switch</Button>
              <Button size="sm" variant="ghost" onClick={() => setPendingDuration(null)}>Cancel</Button>
            </div>
          </div>
        )}
        <div className="flex gap-3 mb-4">
          {([7, 10, 14] as (7 | 10 | 14)[]).map(d => (
            <button key={d} onClick={() => handleDurationChange(d)}
              className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                profile.bootcampDuration === d
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}>
              {d} Days
              <div className="text-xs font-normal mt-0.5 opacity-70">
                {d === 7 ? 'Intensive' : d === 10 ? 'Balanced' : 'Comprehensive'}
              </div>
            </button>
          ))}
        </div>

        {!profile.bootcampStartDate ? (
          <Button className="w-full" size="lg" onClick={startBootcamp}>
            <Play className="w-4 h-4" /> Start Bootcamp Today
          </Button>
        ) : planCompleted ? (
          <div className="text-center py-2">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold mb-2">
              <Trophy className="w-5 h-5" />
              <span>Bootcamp Complete!</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              You completed {totalTasksDone} of {totalTasks} tasks. Excellent work.
            </p>
            <Button size="sm" onClick={() => updateProfile({ bootcampStartDate: null, completedBootcampTasks: [] })}>
              Start New Bootcamp
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-slate-300">Started {profile.bootcampStartDate}</span>
              <div className="text-xs text-slate-600 mt-0.5">
                Day {currentDayIndex + 1} of {currentPlan.days.length} · {totalTasksDone}/{totalTasks} tasks done
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => updateProfile({ bootcampStartDate: null, completedBootcampTasks: [] })}>
              Reset
            </Button>
          </div>
        )}
      </Card>

      {/* Today's Detailed Tasks */}
      {currentDay && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Today — Day {currentDay.day}</h3>
            <Badge variant="amber">{currentDay.theme}</Badge>
          </div>
          <p className="text-xs text-slate-400 mb-4">{currentDay.mission}</p>
          <div className="space-y-2">
            {currentDay.tasks.map(task => {
              const done = profile.completedBootcampTasks.includes(task.id)
              const route = MODULE_ROUTES[task.module]
              return (
                <div key={task.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                    done ? 'border-emerald-500/20 bg-emerald-600/5' : 'border-stone-200 hover:border-indigo-500/20'
                  }`}>
                  <button onClick={() => completeBootcampTask(task.id)} className="mt-0.5 flex-shrink-0 transition-transform active:scale-90">
                    {done
                      ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                      : <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-sm font-medium ${done ? 'text-slate-500 line-through' : 'text-white'}`}>
                        {MODULE_ICONS[task.module] || '•'} {task.label}
                      </span>
                      <Badge variant={task.priority === 'critical' ? 'red' : task.priority === 'high' ? 'amber' : 'slate'}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">{task.detail}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-slate-600">
                        <Clock className="w-3 h-3" /> {task.minutes}m
                      </span>
                      {route && (
                        <button onClick={() => navigate(route)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                          Go to {task.module} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2 bg-stone-50 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${(getDayProgress(currentDay.tasks).done / getDayProgress(currentDay.tasks).total) * 100}%` }} />
            </div>
            <span className="text-xs text-slate-500 flex-shrink-0">
              {getDayProgress(currentDay.tasks).done}/{getDayProgress(currentDay.tasks).total} tasks
            </span>
          </div>
        </Card>
      )}

      {/* All Days overview */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Full Plan Overview</h3>
        <div className="space-y-2">
          {currentPlan.days.map((day, i) => {
            const status = getDayStatus(i)
            const progress = getDayProgress(day.tasks)
            return (
              <Card key={day.day}
                className={`p-4 transition-all ${status === 'today' ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/5' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    status === 'completed' ? 'bg-emerald-600 text-white' :
                    status === 'today' ? 'bg-indigo-600 text-white' :
                    'bg-stone-50 text-slate-500'
                  }`}>
                    {status === 'completed' ? '✓' : day.day}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-medium ${status === 'upcoming' ? 'text-slate-500' : 'text-white'}`}>
                        Day {day.day} — {day.theme}
                      </span>
                      {status === 'today' && <Badge variant="indigo">TODAY</Badge>}
                    </div>
                    {status !== 'upcoming' && (
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-stone-50 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${(progress.done / progress.total) * 100}%` }} />
                        </div>
                        <span className="text-xs text-slate-600 flex-shrink-0">{progress.done}/{progress.total}</span>
                      </div>
                    )}
                    {status === 'upcoming' && (
                      <p className="text-xs text-slate-600 mt-0.5 truncate">{day.mission}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-600 flex-shrink-0">
                    <Clock className="w-3 h-3" /> {day.timeEstimate}m
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Emergency Mode */}
      <Card className="p-5 border-red-500/20">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-400 mb-1">Emergency Protocol — 48 Hours Left?</h3>
            <p className="text-xs text-slate-400 mb-3">Compressed protocol if exam is in 2 days or less:</p>
            <div className="space-y-1.5 text-xs text-slate-300">
              {[
                'Hour 1-2: Grammar Drill → Adaptive → 40 questions',
                'Hour 3-4: Read all 5 passages, analyze every error',
                'Hour 5-6: Vocabulary → Unknown words only',
                'Hour 7-8: Trap Lab → All 20 traps',
                'Final night: Review top 10 Error Notebook mistakes. Sleep 8h.',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-red-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
              <p className="text-amber-400 mt-2 font-medium">No new material. Consolidation only.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
