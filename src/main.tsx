import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ProfileGate from './features/profiles/ProfileGate'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProfileGate>
        <App />
      </ProfileGate>
    </BrowserRouter>
  </React.StrictMode>
)
