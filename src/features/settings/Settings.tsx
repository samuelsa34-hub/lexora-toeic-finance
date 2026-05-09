import React, { useState } from 'react'
import { Settings as SettingsIcon, Target, Calendar, Clock, Globe, Moon, Trash2, AlertTriangle, CheckCircle, Users } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useRegistryStore } from '../../store/useRegistryStore'
import { cloudWriteLogin, localBroadcastStudent } from '../../utils/cloudSync'
import { FIREBASE_ENABLED } from '../../config/firebase'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'

export const Settings: React.FC = () => {
  const { profile, updateProfile, resetAll } = useAppStore()
  const { joinedClassCode, setJoinedClassCode, currentStudentId, students } = useRegistryStore()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [saved, setSaved] = useState(false)
  const [classCodeInput, setClassCodeInput] = useState(joinedClassCode)
  const [classJoinState, setClassJoinState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [classJoinError, setClassJoinError] = useState('')

  const handleChange = (updates: Parameters<typeof updateProfile>[0]) => {
    updateProfile(updates)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const handleReset = () => {
    resetAll()
    setShowResetConfirm(false)
  }

  return (
    <div className="p-4 sm:p-5 lg:p-6 space-y-6 max-w-2xl mx-auto pb-24 sm:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-indigo-400" /> Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">Customize your war room experience</p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium animate-pulse">
            <CheckCircle className="w-4 h-4" /> Saved
          </div>
        )}
      </div>

      {/* Exam Setup */}
      <Card className="p-5">
        <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-indigo-400" /> Exam Setup
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Exam Date
            </label>
            <input
              type="date"
              value={profile.examDate ?? ''}
              onChange={e => handleChange({ examDate: e.target.value || null })}
              className="input-premium"
            />
            {profile.examDate && (
              <p className="text-xs text-slate-500 mt-1">
                {Math.max(0, Math.ceil((new Date(profile.examDate).getTime() - Date.now()) / 86400000))} days remaining
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Current Score (your TOEIC baseline)
            </label>
            <input
              type="number"
              min={10} max={990} step={5}
              value={profile.baseScore}
              onChange={e => handleChange({ baseScore: Math.min(990, Math.max(10, Number(e.target.value))) })}
              className="input-premium"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Target Score: <span className="text-indigo-400 font-bold">{profile.targetScore}</span>
            </label>
            <input
              type="range"
              min={700} max={990} step={5}
              value={profile.targetScore}
              onChange={e => handleChange({ targetScore: Number(e.target.value) })}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>700</span>
              <span>850</span>
              <span>940</span>
              <span>990</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Display Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={e => handleChange({ name: e.target.value || 'Warrior' })}
              placeholder="Warrior"
              maxLength={30}
              className="input-premium"
            />
          </div>
        </div>
      </Card>

      {/* Study Preferences */}
      <Card className="p-5">
        <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-emerald-400" /> Study Preferences
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Daily Study Goal</label>
            <select
              value={profile.dailyGoalMinutes}
              onChange={e => handleChange({ dailyGoalMinutes: Number(e.target.value) })}
              className="input-premium"
            >
              <option value={30}>30 minutes (Minimal)</option>
              <option value={60}>1 hour (Light)</option>
              <option value={90}>1.5 hours (Moderate)</option>
              <option value={120}>2 hours (Intensive)</option>
              <option value={180}>3 hours (War Mode)</option>
              <option value={240}>4 hours (Full Sprint)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Bootcamp Duration</label>
            <div className="grid grid-cols-3 gap-2">
              {([7, 10, 14] as const).map(d => (
                <button
                  key={d}
                  onClick={() => handleChange({ bootcampDuration: d })}
                  className={`py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                    profile.bootcampDuration === d
                      ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300'
                      : 'bg-stone-50 border-stone-200 text-slate-400 hover:border-stone-200'
                  }`}
                >
                  {d} Days
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              {profile.bootcampDuration === 7 ? 'Emergency sprint — maximum intensity' :
               profile.bootcampDuration === 10 ? 'Balanced intensive program' :
               'Full preparation program — highest score gain'}
            </p>
          </div>
        </div>
      </Card>

      {/* Language & Interface */}
      <Card className="p-5">
        <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-amber-400" /> Language & Interface
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Interface Language
              <span className="text-xs text-slate-500 ml-2">(affects French explanations)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'fr', label: '🇫🇷 Français', desc: 'French explanations shown' },
                { value: 'en', label: '🇬🇧 English', desc: 'English only mode' },
              ].map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => handleChange({ language: value as 'en' | 'fr' })}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    profile.language === value
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                      : 'bg-stone-50 border-stone-200 text-slate-400 hover:border-stone-200'
                  }`}
                >
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Theme
            </label>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-stone-50">
              <Moon className="w-4 h-4 text-indigo-400" />
              <div className="flex-1">
                <div className="text-sm text-slate-300 font-medium">Dark Mode</div>
                <div className="text-xs text-slate-500">Optimized for focus and eye comfort</div>
              </div>
              <Badge variant="indigo">Active</Badge>
            </div>
            <p className="text-xs text-slate-600 mt-1.5">Light mode available in future updates</p>
          </div>
        </div>
      </Card>

      {/* Join a Class */}
      <Card className="p-5">
        <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-1">
          <Users className="w-4 h-4 text-indigo-400" /> Join a Class
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Enter the class code your teacher shared with you. Once joined, your teacher sees your live progress from any device worldwide.
          {!FIREBASE_ENABLED && <span className="text-amber-500 block mt-1">⚠ Firebase not configured — cross-device sync is disabled. See <code>src/config/firebase.ts</code>.</span>}
        </p>
        <div className="flex gap-2">
          <input
            value={classCodeInput}
            onChange={e => { setClassCodeInput(e.target.value.toUpperCase()); setClassJoinState('idle'); setClassJoinError('') }}
            placeholder="e.g. CLASS-ABC123"
            disabled={classJoinState === 'loading'}
            className="input-premium font-mono font-bold tracking-widest flex-1"
          />
          <button
            disabled={classJoinState === 'loading' || !classCodeInput.trim()}
            onClick={async () => {
              const code = classCodeInput.trim().toUpperCase()
              if (!code) return
              setClassJoinState('loading')
              setClassJoinError('')
              // Always persist the code locally first
              setJoinedClassCode(code)
              const student = currentStudentId ? students.find(s => s.id === currentStudentId) : null
              const prof = student ? {
                name: student.name, avatar: student.avatar, color: student.color,
                email: student.email ?? '', photoUrl: student.photoUrl ?? '',
                targetScore: student.targetScore,
              } : null
              // BroadcastChannel: notify any teacher tab open in the same browser immediately
              if (prof && currentStudentId) {
                localBroadcastStudent(code, { studentId: currentStudentId, profile: prof })
              }
              // Firebase: push to cloud for cross-device visibility
              if (FIREBASE_ENABLED && currentStudentId && prof) {
                try {
                  await cloudWriteLogin(code, currentStudentId, prof, useAppStore.getState())
                  setClassJoinState('ok')
                  setTimeout(() => setClassJoinState('idle'), 3000)
                } catch (e) {
                  const msg = e instanceof Error ? e.message : String(e)
                  setClassJoinError(msg)
                  setClassJoinState('error')
                }
              } else {
                setClassJoinState('ok')
                setTimeout(() => setClassJoinState('idle'), 2000)
              }
            }}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-colors flex-shrink-0"
            style={{
              background: classJoinState === 'ok' ? '#10B981' : classJoinState === 'error' ? '#F43F5E' : '#6366F1',
              color: '#fff', border: 'none',
              cursor: classJoinState === 'loading' || !classCodeInput.trim() ? 'not-allowed' : 'pointer',
              opacity: classJoinState === 'loading' || !classCodeInput.trim() ? 0.7 : 1,
            }}
          >
            {classJoinState === 'loading' ? '…' : classJoinState === 'ok' ? '✓ Joined' : 'Join'}
          </button>
        </div>
        {classJoinState === 'error' && (
          <p className="text-xs text-red-400 mt-2">Firebase error: {classJoinError} — check your database rules and config.</p>
        )}
        {joinedClassCode && classJoinState !== 'error' && (
          <p className="text-xs text-indigo-400 mt-2">
            {classJoinState === 'ok' && FIREBASE_ENABLED
              ? '✓ You are now visible in your teacher\'s dashboard.'
              : `Currently in class: `}
            <strong className="font-mono">{joinedClassCode}</strong>
          </p>
        )}
      </Card>

      {/* Danger Zone */}
      <Card className="p-5 border-red-900/30">
        <h2 className="text-base font-semibold text-red-400 flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4" /> Danger Zone
        </h2>

        {!showResetConfirm ? (
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-300">Reset All Progress</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Permanently delete all sessions, errors, vocabulary ratings, and study data. This cannot be undone.
              </div>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowResetConfirm(true)}
            >
              <Trash2 className="w-3.5 h-3.5" /> Reset
            </Button>
          </div>
        ) : (
          <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-300">
                <strong>This will permanently delete:</strong>
                <ul className="list-disc list-inside mt-1 text-xs text-red-400 space-y-0.5">
                  <li>All grammar drill sessions and history</li>
                  <li>All vocabulary ratings</li>
                  <li>All reading sessions</li>
                  <li>All error notebook entries</li>
                  <li>Study streak and total time</li>
                  <li>Bootcamp progress</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleReset}>
                <Trash2 className="w-3.5 h-3.5" /> Yes, Delete Everything
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* App info */}
      <div className="text-center text-xs text-slate-600 pb-4">
        <p>Lexora · v1.0 · Built for elite 940+ preparation</p>
        <p className="mt-0.5">Your data is stored locally on this device</p>
      </div>
    </div>
  )
}
