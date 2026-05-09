// ── FIREBASE SETUP & AUTH TROUBLESHOOTING ────────────────────────────────────
//
// 1. INITIAL SETUP (Firebase Console)
//    a. console.firebase.google.com → Add project
//    b. Build → Realtime Database → Create database → test mode
//    c. Project Settings (gear) → General → Your apps → Web (</>)
//       → Register app → copy firebaseConfig values
//    d. Build → Authentication → Get started → Sign-in methods:
//       → Enable: Google, Email/Password (+ Apple/Facebook if needed)
//
// 2. AUTHORIZED DOMAINS (CRITICAL for Google sign-in)
//    Firebase Console → Authentication → Settings → Authorized domains:
//    Add ALL domains where the app is hosted:
//      ✓ localhost  (added by default — dev)
//      ✓ your-project.vercel.app  (add after first Vercel deploy)
//      ✓ your-custom-domain.com   (if you set a custom domain)
//    Missing domain → "connexion échouée" / auth/unauthorized-domain error.
//
// 3. ENVIRONMENT VARIABLES (.env.local for dev / Vercel env vars for prod)
//    VITE_FIREBASE_API_KEY=AIzaSy...
//    VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
//    VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
//    VITE_FIREBASE_PROJECT_ID=your-project-id
//    VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
//    VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
//    VITE_FIREBASE_APP_ID=1:123456789:web:abc123
//    VITE_ADMIN_BOOTSTRAP_EMAIL=admin@yourdomain.com  (first admin account)
//
// 4. FIRST ADMIN BOOTSTRAP
//    Set VITE_ADMIN_BOOTSTRAP_EMAIL=your@email.com in env vars.
//    Sign in with that email → role auto-set to 'admin' → remove env var after.
//
// 5. VERCEL DEPLOYMENT CHECKLIST
//    □ vercel.json exists (SPA rewrites)
//    □ All VITE_FIREBASE_* env vars set in Vercel dashboard
//    □ Vercel preview URL added to Firebase Authorized domains
//    □ Google sign-in enabled in Firebase Console
//    □ Production domain added to Firebase Authorized domains after deploy
//
// AUTH ERROR QUICK-FIX GUIDE:
//    auth/unauthorized-domain   → add domain to Firebase Authorized domains
//    auth/operation-not-allowed → enable Google in Firebase Auth sign-in methods
//    auth/invalid-api-key       → check VITE_FIREBASE_API_KEY env var
//    auth/popup-blocked         → app auto-retries with redirect (no action needed)
//    auth/network-request-failed→ network issue, not a code problem
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getDatabase, type Database } from 'firebase/database'
import { getAuth, type Auth } from 'firebase/auth'

const cfg = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            ?? '',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        ?? '',
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL       ?? '',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         ?? '',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             ?? '',
}

// Realtime Database requires databaseURL
export const FIREBASE_ENABLED = Boolean(cfg.databaseURL)
// Auth only requires apiKey + authDomain
export const AUTH_ENABLED = Boolean(cfg.apiKey && cfg.authDomain)

let _app: FirebaseApp | null = null
let _db: Database | null = null
let _auth: Auth | null = null

if (FIREBASE_ENABLED || AUTH_ENABLED) {
  _app = getApps().length === 0 ? initializeApp(cfg) : getApps()[0]
  if (FIREBASE_ENABLED) _db = getDatabase(_app)
  if (AUTH_ENABLED) _auth = getAuth(_app)
}

export const firebaseApp = _app
export const db = _db
export const auth = _auth
