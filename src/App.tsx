import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './features/dashboard/Dashboard'
import { Bootcamp } from './features/bootcamp/Bootcamp'
import { GrammarDrill } from './features/grammar/GrammarDrill'
import { VocabularyAccelerator } from './features/vocabulary/VocabularyAccelerator'
import { ReadingCenter } from './features/reading/ReadingCenter'
import { ListeningCenter } from './features/listening/ListeningCenter'
import { TrapLab } from './features/traps/TrapLab'
import { MockExam } from './features/mock/MockExam'
import { ErrorNotebook } from './features/errors/ErrorNotebook'
import { Analytics } from './features/analytics/Analytics'
import { Strategy } from './features/strategy/Strategy'
import { Profile } from './features/profile/Profile'
import { Settings } from './features/settings/Settings'
import { GapFillLab } from './features/gapfill/GapFillLab'
import CoursesHub from './features/courses/CoursesHub'
import LessonViewer from './features/courses/LessonViewer'
import TopicsHub from './features/topics/TopicsHub'
import TopicPage from './features/topics/TopicPage'
import Part6Lab from './features/part6/Part6Lab'
import TeacherDashboard from './features/teacher/TeacherDashboard'
import AdminDashboard from './features/admin/AdminDashboard'
import PriorityCenter from './features/priority/PriorityCenter'
import EnglishGrammarHub from './features/english-grammar/EnglishGrammarHub'
import FlashDrill from './features/flash/FlashDrill'
import Dictionary from './features/dictionary/Dictionary'
import CollocationStudio from './features/collocations/CollocationStudio'
import WordFlashcardDrill from './features/vocabulary/WordFlashcardDrill'
import BrandGuide from './features/brand/BrandGuide'
import NativeExpressions from './features/expressions/NativeExpressions'
import GrammarDetective from './features/grammar-detective/GrammarDetective'
import PhrasalVerbsHub from './features/phrasal-verbs/PhrasalVerbsHub'
import PhrasalVerbLearnPage from './features/phrasal-verbs/PhrasalVerbLearnPage'
import { useRegistryStore } from './store/useRegistryStore'
import { useAppStore } from './store/useAppStore'
import { useAuthStore } from './store/useAuthStore'
import { saveStudentSnapshot, writePresence } from './utils/studentStorage'
import { cloudWritePresence, cloudWriteSnapshot, cloudWriteOffline } from './utils/cloudSync'
import { writeUserProgress } from './utils/userSync'
import OnboardingFlow from './features/onboarding/OnboardingFlow'
import PlacementOnlyFlow from './features/onboarding/PlacementOnlyFlow'
import { FinanceLayout } from './components/layout/FinanceLayout'
import { FinanceLanding } from './features/finance/FinanceLanding'
import { FinanceDashboard } from './features/finance/FinanceDashboard'
import { FinanceAcademy } from './features/finance/FinanceAcademy'
import { FinanceDictionary } from './features/finance/FinanceDictionary'
import { GlobalHomepage } from './features/global/GlobalHomepage'
import { ParentLandingV2 } from './features/landing/ParentLandingV2'
import { flags } from './config/flags'

export default function App() {
  const { isTeacherMode } = useRegistryStore()
  const authStore = useAuthStore()
  const appStore = useAppStore()

  // ── Live snapshot flush ───────────────────────────────────────────────────
  // Debounced 1 s: writes localStorage + Firebase teacher monitoring stats
  // + Firebase per-user progress snapshot (cross-device progress sync).
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null
    const unsubscribe = useAppStore.subscribe(() => {
      const { currentStudentId, joinedClassCode } = useRegistryStore.getState()
      if (!currentStudentId) return
      if (timer) clearTimeout(timer)
      const sid = currentStudentId
      const code = joinedClassCode
      timer = setTimeout(() => {
        const state = useAppStore.getState()
        saveStudentSnapshot(sid, state)
        if (code) cloudWriteSnapshot(code, sid, state)
        // Cross-device progress sync: write to /users/{uid}/snapshot
        const { user } = useAuthStore.getState()
        if (user && user.uid === sid) writeUserProgress(sid, state)
      }, 1000)
    })
    return () => {
      unsubscribe()
      if (timer) clearTimeout(timer)
    }
  }, [])

  // ── Presence heartbeat ────────────────────────────────────────────────────
  // Every 30 s: writes to localStorage (same-device) + Firebase (cross-device)
  // so the teacher sees idle students as online even when no study events fire.
  useEffect(() => {
    const interval = setInterval(() => {
      const { currentStudentId, joinedClassCode } = useRegistryStore.getState()
      if (!currentStudentId) return
      writePresence(currentStudentId)
      if (joinedClassCode) cloudWritePresence(joinedClassCode, currentStudentId)
    }, 30_000)
    return () => clearInterval(interval)
  }, [])

  // ── Offline on tab close ──────────────────────────────────────────────────
  // Marks the student offline in Firebase when they close the tab/browser.
  useEffect(() => {
    const onUnload = () => {
      const { currentStudentId, joinedClassCode } = useRegistryStore.getState()
      if (currentStudentId && joinedClassCode) {
        cloudWriteOffline(joinedClassCode, currentStudentId)
      }
    }
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [])

  // ── Legacy migration shim ─────────────────────────────────────────────────
  // Users created before the placement test feature had baseScore=650 by default.
  // Mark them as legacy so the dashboard shows a soft recalibration CTA instead
  // of forcing them through onboarding.
  useEffect(() => {
    const { profile } = useAppStore.getState()
    if (
      profile.baseScore === 650 &&
      !profile.placementTestCompleted &&
      !profile.isLegacyDefault
    ) {
      appStore.updateProfile({ isLegacyDefault: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (authStore.role === 'admin') {
    return <AdminDashboard />
  }

  if (isTeacherMode) {
    return <TeacherDashboard />
  }

  // ── New user onboarding gate ──────────────────────────────────────────────
  // Only new users (baseScore === 0, never assessed) see the onboarding.
  // Legacy users (baseScore === 650, isLegacyDefault) go straight to the app.
  const { profile } = appStore
  if (!profile.placementTestCompleted && profile.baseScore === 0 && !profile.isLegacyDefault) {
    return <OnboardingFlow onComplete={() => { /* state update triggers re-render */ }} />
  }

  return (
    <Routes>
      {/* ── Finance portal (/finance/*) — must come before path="/" ─────────── */}
      <Route path="/finance" element={<FinanceLayout />}>
        <Route index element={<FinanceDashboard />} />
        <Route path="academy" element={<FinanceAcademy />} />
        <Route path="dictionary" element={<FinanceDictionary />} />
        <Route path="landing" element={<FinanceLanding />} />
        {/* Deep-dive routes — placeholder until content is built */}
        <Route path="fixed-income" element={<FinanceAcademy />} />
        <Route path="derivatives" element={<FinanceAcademy />} />
        <Route path="interview" element={<FinanceAcademy />} />
        <Route path="tools" element={<FinanceAcademy />} />
      </Route>

      <Route path="/" element={<Layout />}>
        {/* Root: v2 brand gateway (flag) or legacy portal selection */}
        <Route index element={flags.parentLandingV2 ? <ParentLandingV2 /> : <GlobalHomepage />} />
        {/* TOEIC portal entry points */}
        <Route path="toeic" element={<Dashboard />} />
        <Route path="toeic/dashboard" element={<Dashboard />} />
        <Route path="courses" element={<CoursesHub />} />
        <Route path="courses/:id" element={<LessonViewer />} />
        <Route path="topics" element={<TopicsHub />} />
        <Route path="topics/:id" element={<TopicPage />} />
        <Route path="part6" element={<Part6Lab />} />
        <Route path="bootcamp" element={<Bootcamp />} />
        <Route path="grammar" element={<GrammarDrill />} />
        <Route path="gapfill" element={<GapFillLab />} />
        <Route path="vocabulary" element={<VocabularyAccelerator />} />
        <Route path="reading" element={<ReadingCenter />} />
        <Route path="listening" element={<ListeningCenter />} />
        <Route path="traps" element={<TrapLab />} />
        <Route path="mock" element={<MockExam />} />
        <Route path="errors" element={<ErrorNotebook />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="strategy" element={<Strategy />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="priority" element={<PriorityCenter />} />
        <Route path="english-grammar" element={<EnglishGrammarHub />} />
        <Route path="flash" element={<FlashDrill />} />
        <Route path="dictionary" element={<Dictionary />} />
        <Route path="collocations" element={<CollocationStudio />} />
        <Route path="myflash" element={<WordFlashcardDrill />} />
        <Route path="brand" element={<BrandGuide />} />
        <Route path="expressions" element={<NativeExpressions />} />
        <Route path="grammar-detective" element={<GrammarDetective />} />
        <Route path="phrasal-verbs" element={<PhrasalVerbsHub />} />
        <Route path="phrasal-verbs/learn" element={<PhrasalVerbLearnPage />} />
        <Route path="phrasal-verbs/learn/:id" element={<LessonViewer />} />
        <Route path="placement" element={<PlacementOnlyFlow />} />
      </Route>
    </Routes>
  )
}
