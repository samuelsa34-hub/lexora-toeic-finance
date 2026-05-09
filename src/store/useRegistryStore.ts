import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StudentMeta, TeacherAssignment, ReviewTogetherItem } from '../types'

const AVATARS = ['🎯', '⚡', '🔥', '🦁', '🐯', '🦊', '🐺', '🦅', '🦋', '🌟', '💎', '🚀']
const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#0EA5E9', '#EC4899', '#14B8A6']

export { AVATARS, COLORS }

interface RegistryState {
  students: StudentMeta[]
  teacherPin: string
  currentStudentId: string | null
  isTeacherMode: boolean
  assignments: TeacherAssignment[]
  teacherNotes: Record<string, string>   // studentId → note
  reviewTogetherItems: ReviewTogetherItem[]
  // Cross-device monitoring: class code system
  // Teacher shares teacherClassCode with students.
  // Student enters it as joinedClassCode in Settings.
  // All Firebase writes use the joined code as the path root.
  teacherClassCode: string   // teacher's unique shareable code
  joinedClassCode: string    // class code student has entered

  addStudent: (name: string, avatar: string, color: string, targetScore?: number, extras?: Partial<StudentMeta>) => string
  addStudentWithId: (id: string, name: string, avatar: string, color: string, targetScore?: number, extras?: Partial<StudentMeta>) => void
  removeStudent: (id: string) => void
  setCurrentStudent: (id: string | null) => void
  setTeacherMode: (active: boolean) => void
  setTeacherPin: (pin: string) => void
  updateStudentLastStudied: (id: string) => void
  updateStudentTarget: (id: string, targetScore: number) => void
  addAssignment: (a: Omit<TeacherAssignment, 'id' | 'createdAt'>) => string
  removeAssignment: (id: string) => void
  setTeacherNote: (studentId: string, note: string) => void
  addReviewTogether: (item: Omit<ReviewTogetherItem, 'id' | 'createdAt'>) => void
  removeReviewTogether: (id: string) => void
  setJoinedClassCode: (code: string) => void
  setTeacherClassCode: (code: string) => void
}

export const useRegistryStore = create<RegistryState>()(
  persist(
    (set) => ({
      students: [],
      teacherPin: '1234',
      currentStudentId: null,
      isTeacherMode: false,
      assignments: [],
      teacherNotes: {},
      reviewTogetherItems: [],
      teacherClassCode: `CLASS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      joinedClassCode: '',

      addStudent: (name, avatar, color, targetScore = 900, extras = {}) => {
        const id = `student_${Date.now()}_${Math.random().toString(36).slice(2)}`
        const meta: StudentMeta = {
          id, name, avatar, color,
          createdAt: Date.now(),
          lastStudied: null,
          targetScore,
          ...extras,
        }
        set(s => ({ students: [...s.students, meta] }))
        return id
      },

      addStudentWithId: (id, name, avatar, color, targetScore = 900, extras = {}) => {
        const meta: StudentMeta = {
          id, name, avatar, color,
          createdAt: Date.now(),
          lastStudied: null,
          targetScore,
          ...extras,
        }
        set(s => ({
          students: s.students.some(st => st.id === id)
            ? s.students.map(st => st.id === id ? { ...st, name, avatar, color, ...extras } : st)
            : [...s.students, meta]
        }))
      },

      removeStudent: (id) => set(s => ({
        students: s.students.filter(st => st.id !== id),
        currentStudentId: s.currentStudentId === id ? null : s.currentStudentId,
      })),

      setCurrentStudent: (id) => set({ currentStudentId: id, isTeacherMode: false }),

      setTeacherMode: (active) => set({ isTeacherMode: active, currentStudentId: active ? null : undefined }),

      setTeacherPin: (pin) => set({ teacherPin: pin }),

      updateStudentLastStudied: (id) => set(s => ({
        students: s.students.map(st =>
          st.id === id ? { ...st, lastStudied: Date.now() } : st
        ),
      })),

      updateStudentTarget: (id, targetScore) => set(s => ({
        students: s.students.map(st =>
          st.id === id ? { ...st, targetScore } : st
        ),
      })),

      addAssignment: (a) => {
        const id = `assign_${Date.now()}_${Math.random().toString(36).slice(2)}`
        const assignment: TeacherAssignment = { ...a, id, createdAt: Date.now() }
        set(s => ({ assignments: [...s.assignments, assignment] }))
        return id
      },

      removeAssignment: (id) => set(s => ({
        assignments: s.assignments.filter(a => a.id !== id),
      })),

      setTeacherNote: (studentId, note) => set(s => ({
        teacherNotes: { ...s.teacherNotes, [studentId]: note },
      })),

      addReviewTogether: (item) => {
        const id = `rt_${Date.now()}_${Math.random().toString(36).slice(2)}`
        set(s => ({ reviewTogetherItems: [...s.reviewTogetherItems, { ...item, id, createdAt: Date.now() }] }))
      },

      removeReviewTogether: (id) => set(s => ({
        reviewTogetherItems: s.reviewTogetherItems.filter(r => r.id !== id),
      })),

      setJoinedClassCode: (code) => set({ joinedClassCode: code.trim().toUpperCase() }),
      setTeacherClassCode: (code) => set({ teacherClassCode: code.trim().toUpperCase() }),
    }),
    { name: 'toeic-warroom-registry' }
  )
)
