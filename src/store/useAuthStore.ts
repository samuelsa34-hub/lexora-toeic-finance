import { create } from 'zustand'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  OAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  updateProfile as fbUpdateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth, AUTH_ENABLED } from '../config/firebase'

export type AuthRole = 'student' | 'teacher' | 'admin' | null

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  providerId: string
}

interface AuthState {
  user: AuthUser | null
  role: AuthRole
  loading: boolean
  error: string | null
  initialized: boolean

  _setUser: (user: AuthUser | null) => void
  _setRole: (role: AuthRole) => void
  _setLoading: (v: boolean) => void
  _setError: (msg: string | null) => void
  _setInitialized: () => void

  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<FirebaseUser>
  signInWithGoogle: () => Promise<FirebaseUser | null>
  signInWithApple: () => Promise<FirebaseUser | null>
  signInWithFacebook: () => Promise<FirebaseUser | null>
  signInWithTwitter: () => Promise<FirebaseUser | null>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  loading: AUTH_ENABLED,
  error: null,
  initialized: !AUTH_ENABLED,

  _setUser: (user) => set({ user }),
  _setRole: (role) => set({ role }),
  _setLoading: (loading) => set({ loading }),
  _setError: (error) => set({ error }),
  _setInitialized: () => set({ initialized: true, loading: false }),

  signInWithEmail: async (email, password) => {
    if (!auth) throw new Error('Firebase Auth not configured')
    set({ error: null })
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (e) {
      const code = (e as { code?: string }).code
      console.error('[Auth] Email sign-in error:', code, e)
      const msg = friendlyError(code)
      set({ error: msg })
      throw e
    }
  },

  signUpWithEmail: async (email, password, displayName) => {
    if (!auth) throw new Error('Firebase Auth not configured')
    set({ error: null })
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) await fbUpdateProfile(cred.user, { displayName })
      return cred.user
    } catch (e) {
      const code = (e as { code?: string }).code
      console.error('[Auth] Sign-up error:', code, e)
      const msg = friendlyError(code)
      set({ error: msg })
      throw e
    }
  },

  signInWithGoogle: async () => {
    if (!auth) throw new Error('Firebase Auth not configured')
    set({ error: null })
    const provider = new GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')
    try {
      const cred = await signInWithPopup(auth, provider)
      return cred.user
    } catch (e) {
      const code = (e as { code?: string }).code
      console.error('[Auth] Google sign-in error:', code, e)
      // Popup blocked → fall back to redirect (Safari, mobile, strict settings)
      if (code === 'auth/popup-blocked') {
        console.info('[Auth] Popup blocked — falling back to redirect flow')
        try {
          await signInWithRedirect(auth, provider)
          return null // page navigates away; result handled via getRedirectResult
        } catch (redirectErr) {
          const rCode = (redirectErr as { code?: string }).code
          console.error('[Auth] Redirect fallback error:', rCode, redirectErr)
          const msg = friendlyError(rCode)
          set({ error: msg || 'Sign-in failed. Please try again.' })
          throw redirectErr
        }
      }
      // Popup closed / cancelled → silent, no error shown
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return null
      }
      const msg = friendlyError(code)
      set({ error: msg })
      throw e
    }
  },

  signInWithApple: async () => {
    if (!auth) throw new Error('Firebase Auth not configured')
    set({ error: null })
    const provider = new OAuthProvider('apple.com')
    provider.addScope('name')
    provider.addScope('email')
    try {
      const cred = await signInWithPopup(auth, provider)
      return cred.user
    } catch (e) {
      const code = (e as { code?: string }).code
      console.error('[Auth] Apple sign-in error:', code, e)
      if (code === 'auth/popup-blocked') {
        try { await signInWithRedirect(auth, provider); return null } catch { /* fall through */ }
      }
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null
      const msg = friendlyError(code)
      set({ error: msg })
      throw e
    }
  },

  signInWithFacebook: async () => {
    if (!auth) throw new Error('Firebase Auth not configured')
    set({ error: null })
    try {
      const cred = await signInWithPopup(auth, new FacebookAuthProvider())
      return cred.user
    } catch (e) {
      const code = (e as { code?: string }).code
      console.error('[Auth] Facebook sign-in error:', code, e)
      if (code === 'auth/popup-blocked') {
        try { await signInWithRedirect(auth, new FacebookAuthProvider()); return null } catch { /* fall through */ }
      }
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null
      const msg = friendlyError(code)
      set({ error: msg })
      throw e
    }
  },

  signInWithTwitter: async () => {
    if (!auth) throw new Error('Firebase Auth not configured')
    set({ error: null })
    try {
      const cred = await signInWithPopup(auth, new TwitterAuthProvider())
      return cred.user
    } catch (e) {
      const code = (e as { code?: string }).code
      console.error('[Auth] Twitter sign-in error:', code, e)
      if (code === 'auth/popup-blocked') {
        try { await signInWithRedirect(auth, new TwitterAuthProvider()); return null } catch { /* fall through */ }
      }
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null
      const msg = friendlyError(code)
      set({ error: msg })
      throw e
    }
  },

  signOut: async () => {
    if (!auth) return
    try {
      await fbSignOut(auth)
    } catch { /* non-fatal */ }
    set({ user: null, role: null })
  },

  resetPassword: async (email) => {
    if (!auth) throw new Error('Firebase Auth not configured')
    set({ error: null })
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (e) {
      const code = (e as { code?: string }).code
      console.error('[Auth] Password reset error:', code, e)
      const msg = friendlyError(code)
      set({ error: msg })
      throw e
    }
  },

  clearError: () => set({ error: null }),
}))

// ── Auth state listener + redirect result (set up once on module load) ────────

if (AUTH_ENABLED && auth) {
  // Handle post-redirect sign-in (Safari, mobile, popup-blocked fallback)
  getRedirectResult(auth)
    .then(result => {
      if (result?.user) {
        console.info('[Auth] Redirect sign-in completed:', result.user.email)
        // onAuthStateChanged will fire and handle profile creation
      }
    })
    .catch(err => {
      const code = (err as { code?: string }).code
      if (code && code !== 'auth/no-current-user') {
        console.error('[Auth] Redirect result error:', code)
        useAuthStore.getState()._setError(friendlyError(code))
      }
    })

  onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    const store = useAuthStore.getState()
    if (firebaseUser) {
      store._setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        providerId: firebaseUser.providerData[0]?.providerId ?? 'password',
      })
    } else {
      store._setUser(null)
      store._setRole(null)
    }
    store._setInitialized()
  })
}

// ── Error code → human-readable message ──────────────────────────────────────
function friendlyError(code?: string): string {
  switch (code) {
    // Credentials
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.'
    case 'auth/requires-recent-login':
      return 'Please sign out and sign in again to continue.'

    // Rate / network
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a moment and try again.'
    case 'auth/network-request-failed':
      return 'Network error — check your internet connection and try again.'

    // Popup / provider
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Enable popups for this site, or try the email option.'
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return ''

    // Domain / config
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for sign-in. Add it in Firebase Console → Authentication → Settings → Authorized domains.'
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Enable it in Firebase Console → Authentication → Sign-in methods.'
    case 'auth/invalid-api-key':
      return 'Firebase API key is invalid. Check your VITE_FIREBASE_API_KEY environment variable.'
    case 'auth/configuration-not-found':
      return 'Firebase Auth configuration is missing. Verify your environment variables.'
    case 'auth/app-not-authorized':
      return 'This app is not authorized to use Firebase Auth. Check your Firebase project settings.'

    // Internal
    case 'auth/internal-error':
      return 'An internal error occurred. Please try again in a moment.'

    default:
      return 'Sign-in failed. Please try again.'
  }
}
