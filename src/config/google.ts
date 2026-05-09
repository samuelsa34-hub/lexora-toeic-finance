// Set VITE_GOOGLE_CLIENT_ID in your .env file.
// Get one at: https://console.cloud.google.com → APIs & Services → Credentials → OAuth 2.0 Client ID
// Authorized origins: http://localhost:3000 (dev) + your ngrok / production URL
// Authorized redirect URIs: same origins
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

export const GOOGLE_CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events'

export interface GoogleUserInfo {
  sub: string       // Google ID (unique, stable)
  email: string
  name: string
  picture: string
}

export function decodeGoogleJWT(credential: string): GoogleUserInfo {
  const payload = JSON.parse(atob(credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
  return { sub: payload.sub, email: payload.email, name: payload.name, picture: payload.picture }
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: object) => void
          renderButton: (element: HTMLElement, config: object) => void
          prompt: () => void
          cancel: () => void
        }
        oauth2: {
          initTokenClient: (config: object) => { requestAccessToken: (config?: object) => void }
        }
      }
    }
  }
}
