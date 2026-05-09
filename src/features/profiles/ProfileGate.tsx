import React, { useState, useEffect, useRef, useCallback } from 'react'
import { GraduationCap, Plus, Lock, Trash2, ChevronRight, Users, X, Mail, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Logo } from '../../components/ui/Logo'
import { useRegistryStore, AVATARS, COLORS } from '../../store/useRegistryStore'
import { useAppStore } from '../../store/useAppStore'
import { saveStudentSnapshot, loadStudentSnapshot, deleteStudentSnapshot } from '../../utils/studentStorage'
import { cloudWriteLogin, localBroadcastStudent } from '../../utils/cloudSync'
import { GOOGLE_CLIENT_ID, decodeGoogleJWT } from '../../config/google'
import { useAuthStore } from '../../store/useAuthStore'
import { AUTH_ENABLED } from '../../config/firebase'
import { readUserProfile, createUserProfile, readUserProgress, updateUserProfile } from '../../utils/userSync'
import type { StudentMeta } from '../../types'
import type { AuthUser } from '../../store/useAuthStore'

// ── Static scene data (outside component — stable references) ─────────────────

const STARS: Array<[number, number, number, number]> = [
  [120,40,1.2,0.80],[200,90,0.8,0.60],[350,30,1.5,0.90],[480,70,1.0,0.70],
  [600,25,1.3,0.80],[750,55,0.9,0.65],[900,35,1.4,0.85],[1050,80,0.7,0.60],
  [1150,45,1.1,0.75],[1280,65,1.3,0.80],[1380,30,0.8,0.70],[80,120,0.9,0.50],
  [240,140,1.2,0.70],[400,100,0.7,0.60],[560,130,1.0,0.65],[700,110,1.4,0.80],
  [840,150,0.8,0.55],[990,120,1.1,0.70],[1120,140,1.3,0.75],[1260,110,0.9,0.60],
  [1360,150,1.0,0.70],[160,180,1.1,0.60],[320,200,0.8,0.50],[500,170,1.3,0.70],
  [660,190,0.9,0.55],[820,160,1.2,0.65],[1000,185,0.7,0.50],[1180,175,1.0,0.60],
  [1310,195,1.4,0.70],[50,210,0.8,0.55],[430,230,1.1,0.60],[590,215,0.9,0.50],
  [760,240,1.0,0.55],[920,220,1.3,0.65],[1080,235,0.8,0.50],[1240,215,1.1,0.60],
  [300,260,1.2,0.55],[470,250,0.7,0.45],[630,270,1.0,0.50],[780,255,1.3,0.60],
  [950,265,0.8,0.50],[1110,248,1.1,0.55],[180,290,0.9,0.50],[390,280,1.2,0.55],
  [550,295,0.7,0.45],[710,285,1.0,0.50],[880,278,1.3,0.55],[1040,290,0.8,0.50],
  [1200,282,0.9,0.45],[1400,270,1.1,0.50],
]

const FIREFLIES: Array<{ x: number; y: number; delay: number; dur: number; r: number }> = [
  { x:200, y:550, delay:0.0, dur:4.2, r:3.2 },
  { x:340, y:480, delay:0.8, dur:3.8, r:2.4 },
  { x:480, y:522, delay:1.5, dur:5.0, r:2.9 },
  { x:150, y:618, delay:0.3, dur:4.5, r:2.0 },
  { x:578, y:560, delay:2.1, dur:3.6, r:3.4 },
  { x:920, y:510, delay:0.7, dur:4.8, r:2.4 },
  { x:1050,y:470, delay:1.2, dur:3.9, r:2.0 },
  { x:1180,y:540, delay:2.5, dur:4.1, r:2.9 },
  { x:1265,y:490, delay:0.4, dur:5.2, r:2.4 },
  { x:850, y:580, delay:1.8, dur:3.7, r:3.4 },
  { x:270, y:490, delay:3.0, dur:4.3, r:2.0 },
  { x:410, y:545, delay:2.3, dur:4.9, r:2.9 },
  { x:720, y:518, delay:0.9, dur:3.5, r:2.4 },
  { x:1100,y:570, delay:1.6, dur:4.7, r:3.4 },
  { x:618, y:640, delay:3.5, dur:4.0, r:2.0 },
  { x:790, y:612, delay:0.2, dur:5.5, r:2.4 },
  { x:1305,y:610, delay:2.8, dur:3.8, r:2.9 },
  { x:98,  y:590, delay:1.1, dur:4.4, r:2.0 },
]

const BUTTERFLIES: Array<{ x: number; y: number; delay: number; scale: number; hue: number; pi: number }> = [
  { x:252, y:382, delay:0.0, scale:0.80, hue:280, pi:0 },
  { x:452, y:322, delay:1.2, scale:1.00, hue:260, pi:1 },
  { x:1102,y:362, delay:0.5, scale:0.90, hue:300, pi:2 },
  { x:1252,y:422, delay:2.0, scale:0.70, hue:270, pi:0 },
  { x:652, y:348, delay:3.0, scale:1.10, hue:290, pi:1 },
  { x:882, y:398, delay:1.8, scale:0.85, hue:252, pi:2 },
]

const SCENE_STYLES = `
  @keyframes cardFadeIn {
    from { opacity:0; transform:translateY(28px) scale(0.97); }
    to   { opacity:1; transform:translateY(0)    scale(1);    }
  }
  @keyframes glowPulse {
    0%,100% { box-shadow:0 0 50px rgba(99,102,241,0.18),0 0 100px rgba(99,102,241,0.07),0 40px 80px rgba(0,0,0,0.75); }
    50%     { box-shadow:0 0 70px rgba(139,92,246,0.28),0 0 140px rgba(99,102,241,0.12),0 40px 80px rgba(0,0,0,0.75); }
  }
  @keyframes logoGlow {
    0%,100% { box-shadow:0 0 22px rgba(99,102,241,0.55),0 0 44px rgba(99,102,241,0.20); }
    50%     { box-shadow:0 0 32px rgba(139,92,246,0.75),0 0 64px rgba(99,102,241,0.30); }
  }
  @keyframes nebulaShift {
    0%,100% { transform:translateX(0px)   translateY(0px);   }
    33%     { transform:translateX(28px)  translateY(-18px);  }
    66%     { transform:translateX(-20px) translateY(14px);   }
  }
  @keyframes orbPulse {
    0%,100% { opacity:0.55; transform:scale(0.92); }
    50%     { opacity:1.00; transform:scale(1.08); }
  }
  @keyframes floatY {
    0%,100% { transform:translateY(0px);  }
    50%     { transform:translateY(-14px); }
  }
  @keyframes emblemPulse {
    0%,100% { box-shadow:0 0 50px rgba(99,102,241,0.45),0 0 100px rgba(99,102,241,0.18),0 16px 48px rgba(0,0,0,0.60); }
    50%     { box-shadow:0 0 80px rgba(139,92,246,0.65),0 0 160px rgba(99,102,241,0.28),0 16px 48px rgba(0,0,0,0.60); }
  }
  @keyframes statFadeIn {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0px);  }
  }
  @keyframes ringRotate {
    from { transform:rotate(0deg);   }
    to   { transform:rotate(360deg); }
  }
  @keyframes shimmerSlide {
    from { transform:translateX(-100%); }
    to   { transform:translateX(300%);  }
  }
  /* ── Responsive hero panel ── */
  .pg-root {
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    position:relative; z-index:10;
    min-height:100vh; padding:28px 20px 48px;
  }
  .pg-hero { display:none; }
  .pg-card-col { width:100%; max-width:480px; }
  @media (min-width:1024px) {
    .pg-root  { flex-direction:row; justify-content:center; gap:60px; padding:28px 60px 48px; }
    .pg-hero  { display:flex; flex:1; max-width:500px; }
    .pg-card-col { width:100%; max-width:460px; flex-shrink:0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .pg-hero *, [style*="animation"] { animation:none !important; }
  }
`

// ── PineTree helper ───────────────────────────────────────────────────────────

interface PineProps { x:number; y:number; height:number; width:number; color:string; opacity?:number }

function PineTree({ x, y, height, width, color, opacity=1 }: PineProps) {
  return (
    <g opacity={opacity}>
      <rect x={x-4} y={y} width={8} height={height*0.12} fill={color} rx={2} />
      {([0,1,2] as const).map(i => {
        const ly = y - height*(0.18+i*0.27)
        const lw = width*((3-i)/3)*0.95
        const lh = height*0.30
        return <polygon key={i} points={`${x},${ly-lh} ${x-lw/2},${ly} ${x+lw/2},${ly}`} fill={color} />
      })}
    </g>
  )
}

// ── Butterfly helper ──────────────────────────────────────────────────────────

function Butterfly({ x, y, delay, scale, hue, pi }: { x:number; y:number; delay:number; scale:number; hue:number; pi:number }) {
  const w  = `hsla(${hue},65%,74%,0.74)`
  const wd = `hsla(${hue},55%,58%,0.62)`
  const bd = `${0.28+delay*0.035}s`
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}
       style={{ animation:`bfPath${pi} ${7+delay*1.4}s ease-in-out infinite ${delay}s` }}>
      {/* Upper-left wing */}
      <ellipse cx={-14} cy={-8} rx={17} ry={11} fill={w} transform="rotate(-35,-14,-8)" opacity={0.85}>
        <animate attributeName="ry" values="11;1;11" dur={bd} repeatCount="indefinite" />
      </ellipse>
      {/* Upper-right wing */}
      <ellipse cx={14}  cy={-8} rx={17} ry={11} fill={w} transform="rotate(35,14,-8)"  opacity={0.85}>
        <animate attributeName="ry" values="11;1;11" dur={bd} repeatCount="indefinite" />
      </ellipse>
      {/* Lower-left wing */}
      <ellipse cx={-10} cy={9}  rx={12} ry={7}  fill={wd} transform="rotate(-18,-10,9)" opacity={0.72}>
        <animate attributeName="ry" values="7;1;7" dur={bd} repeatCount="indefinite" />
      </ellipse>
      {/* Lower-right wing */}
      <ellipse cx={10}  cy={9}  rx={12} ry={7}  fill={wd} transform="rotate(18,10,9)"  opacity={0.72}>
        <animate attributeName="ry" values="7;1;7" dur={bd} repeatCount="indefinite" />
      </ellipse>
      {/* Body */}
      <ellipse cx={0} cy={0} rx={2.5} ry={11} fill={`hsla(${hue+15},80%,88%,0.95)`} />
      {/* Antennae */}
      <path d={`M-2,-10 Q-8,-20 -11,-24`} stroke={`hsla(${hue},60%,80%,0.55)`} strokeWidth={1} fill="none" />
      <path d={`M2,-10 Q8,-20 11,-24`}    stroke={`hsla(${hue},60%,80%,0.55)`} strokeWidth={1} fill="none" />
      <circle cx={-11} cy={-24} r={1.5} fill={`hsla(${hue+20},70%,88%,0.8)`} />
      <circle cx={11}  cy={-24} r={1.5} fill={`hsla(${hue+20},70%,88%,0.8)`} />
    </g>
  )
}

// ── Premium Nebula Scene ──────────────────────────────────────────────────────

function PremiumScene() {
  // Ambient orbs — volumetric light blobs rendered as CSS divs (faster than SVG blur)
  const ORBS = [
    { l:'4%',  t:'22%', w:520, h:420, c:'rgba(67,56,202,0.20)',  dur:'22s', delay:'0s'  },
    { l:'62%', t:'8%',  w:460, h:380, c:'rgba(109,40,217,0.16)', dur:'28s', delay:'4s'  },
    { l:'48%', t:'58%', w:360, h:300, c:'rgba(79,70,229,0.12)',  dur:'20s', delay:'9s'  },
    { l:'82%', t:'44%', w:320, h:280, c:'rgba(34,211,238,0.08)', dur:'24s', delay:'2s'  },
    { l:'18%', t:'68%', w:280, h:240, c:'rgba(16,185,129,0.07)', dur:'18s', delay:'7s'  },
  ]
  return (
    <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }} aria-hidden="true">
      {/* Volumetric nebula orbs */}
      {ORBS.map((o, i) => (
        <div key={i} style={{
          position:'absolute', left:o.l, top:o.t,
          width:o.w, height:o.h,
          borderRadius:'50%',
          background:`radial-gradient(ellipse, ${o.c} 0%, transparent 70%)`,
          filter:'blur(48px)',
          animation:`nebulaShift ${o.dur} ease-in-out infinite ${o.delay}`,
        }} />
      ))}
      {/* SVG layer — background, stars, grid */}
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
           style={{ width:'100%', height:'100%', position:'absolute', inset:0 }}>
        <defs>
          <linearGradient id="ps-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#020611" />
            <stop offset="55%"  stopColor="#050A1A" />
            <stop offset="100%" stopColor="#040818" />
          </linearGradient>
          <linearGradient id="ps-fade-b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#020611" stopOpacity={0}   />
            <stop offset="100%" stopColor="#020611" stopOpacity={0.88} />
          </linearGradient>
          <linearGradient id="ps-fade-t" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#020611" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#020611" stopOpacity={0}    />
          </linearGradient>
          {/* Horizon accent — faint violet horizon glow */}
          <linearGradient id="ps-horizon" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4338CA" stopOpacity={0.10} />
            <stop offset="100%" stopColor="#4338CA" stopOpacity={0}    />
          </linearGradient>
        </defs>

        {/* ── Base void background ── */}
        <rect width={1440} height={900} fill="url(#ps-bg)" />

        {/* ── Stars ── */}
        {STARS.map(([sx,sy,sr,so],i) => (
          <circle key={i} cx={sx} cy={sy} r={sr * 0.9} fill="#FFFFFF" opacity={so * 0.65} />
        ))}

        {/* ── Perspective grid — synthwave floor (very subtle) ── */}
        {/* Horizontal lines */}
        {[600,640,685,735,792,855,900].map((y,i) => (
          <line key={`gh${i}`} x1={0} y1={y} x2={1440} y2={y}
            stroke={`rgba(99,102,241,${0.025 + i * 0.006})`} strokeWidth={1} />
        ))}
        {/* Radial lines from vanishing point */}
        {[...Array(13)].map((_,i) => {
          const bx = i * (1440 / 12)
          return (
            <line key={`gr${i}`} x1={720} y1={540} x2={bx} y2={900}
              stroke="rgba(99,102,241,0.030)" strokeWidth={1} />
          )
        })}

        {/* ── Horizon accent ── */}
        <rect x={0} y={520} width={1440} height={120} fill="url(#ps-horizon)" />

        {/* ── Top & bottom screen fades ── */}
        <rect x={0} y={0}   width={1440} height={140} fill="url(#ps-fade-t)" />
        <rect x={0} y={680} width={1440} height={220} fill="url(#ps-fade-b)" />

        {/* ── Side vignettes ── */}
        <rect x={0}    y={0} width={180} height={900} fill="rgba(2,6,17,0.40)" />
        <rect x={1260} y={0} width={180} height={900} fill="rgba(2,6,17,0.40)" />
      </svg>
    </div>
  )
}

// ── Desktop Hero Panel — 3D floating cards + emblem + tagline ────────────────

const HERO_CARDS = [
  { label:'Part 5 — Connectors',    sub:'Despite · However · Nevertheless',  icon:'📘', rx:14,  ry:-10, delay:'0s',   dur:'6.5s' },
  { label:'Verb Forms & Tense',     sub:'Past Perfect · Future Perfect',      icon:'⚡', rx: 8,  ry: 8,  delay:'1.4s', dur:'7.2s' },
  { label:'Business Vocabulary',    sub:'Finalize · Submit · Implement',      icon:'📈', rx:-6,  ry:-6,  delay:'0.7s', dur:'5.8s' },
]

function HeroPanel() {
  return (
    <div className="pg-hero" style={{
      flexDirection:'column', alignItems:'flex-start', justifyContent:'center',
      gap:36, paddingRight:8,
    }}>
      {/* ── Emblem ── */}
      <div style={{ position:'relative', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
        {/* Outer halo ring */}
        <div style={{
          position:'absolute', inset:-20, borderRadius:38,
          border:'1px solid rgba(99,102,241,0.12)',
          animation:'orbPulse 6s ease-in-out infinite 1s',
        }} />
        {/* Inner rim ring */}
        <div style={{
          position:'absolute', inset:-10, borderRadius:30,
          border:'1px solid rgba(99,102,241,0.25)',
          animation:'orbPulse 5s ease-in-out infinite',
        }} />
        {/* Rotating arc */}
        <svg width={108} height={108} style={{
          position:'absolute', top:'50%', left:'50%',
          transform:'translate(-50%,-50%)',
          animation:'ringRotate 12s linear infinite',
        }}>
          <circle cx={54} cy={54} r={50}
            fill="none" stroke="rgba(99,102,241,0.18)" strokeWidth={1}
            strokeDasharray="60 260" strokeLinecap="round" />
        </svg>
        {/* Core block */}
        <div style={{
          width:74, height:74, borderRadius:20,
          background:'linear-gradient(135deg, #3730A3 0%, #6D28D9 45%, #4F46E5 100%)',
          display:'flex', alignItems:'center', justifyContent:'center',
          animation:'emblemPulse 5s ease-in-out infinite',
          position:'relative', overflow:'hidden',
        }}>
          {/* Shimmer sweep */}
          <div style={{
            position:'absolute', top:0, left:0, right:0, bottom:0,
            background:'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
            animation:'shimmerSlide 3.5s ease-in-out infinite',
          }} />
          <span style={{
            fontSize:32, fontWeight:900, color:'#fff',
            letterSpacing:'-2px', fontFamily:"'Inter', system-ui, sans-serif",
            position:'relative', zIndex:1,
          }}>L</span>
        </div>
      </div>

      {/* ── Tagline ── */}
      <div>
        <h2 style={{
          fontSize:'clamp(26px,2.8vw,36px)', fontWeight:900,
          letterSpacing:'-0.03em', color:'#FFFFFF',
          margin:'0 0 10px', lineHeight:1.1,
        }}>
          Master English.<br />
          <span style={{
            background:'linear-gradient(135deg,#818CF8 0%,#A78BFA 50%,#38BDF8 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>Improve Faster.</span>
        </h2>
        <p style={{ fontSize:14, color:'rgba(180,170,255,0.52)', margin:0, lineHeight:1.7, maxWidth:340 }}>
          AI-powered TOEIC prep with spaced repetition,<br />
          personalized plans, and real-time analytics.
        </p>
      </div>

      {/* ── 3D floating lesson cards ── */}
      <div style={{ position:'relative', width:'100%', height:185, marginBottom:4 }}>
        {HERO_CARDS.map((card, i) => (
          <div key={i} style={{
            position:'absolute',
            left: `${i * 22}%`, top: `${i * 26}%`,
            width:210, zIndex: 3 - i,
            /* static 3D tilt unique per card */
            transform:`perspective(900px) rotateX(${card.rx}deg) rotateY(${card.ry}deg)`,
          }}>
            {/* inner floats in Y */}
            <div style={{ animation:`floatY ${card.dur} ease-in-out infinite ${card.delay}` }}>
              <div style={{
                padding:'13px 15px', borderRadius:14,
                background:'rgba(10,7,32,0.88)',
                border:'1px solid rgba(99,102,241,0.22)',
                backdropFilter:'blur(16px)',
                WebkitBackdropFilter:'blur(16px)',
                boxShadow:'0 20px 60px rgba(0,0,0,0.60), 0 0 0 1px rgba(99,102,241,0.08) inset',
                position:'relative', overflow:'hidden',
              }}>
                {/* top shimmer line */}
                <div style={{
                  position:'absolute', top:0, left:0, right:0, height:1,
                  background:'linear-gradient(90deg,transparent,rgba(99,102,241,0.55),transparent)',
                }} />
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
                  <span style={{ fontSize:15 }}>{card.icon}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:'#A5B4FC' }}>{card.label}</span>
                </div>
                <div style={{ fontSize:10.5, color:'rgba(180,170,255,0.42)', lineHeight:1.5 }}>{card.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Stats row ── */}
      <div style={{ display:'flex', gap:28 }}>
        {[
          { num:'2,400+', label:'Active Students' },
          { num:'940',    label:'Top Score Target' },
          { num:'98%',    label:'Satisfaction'     },
        ].map((s, i) => (
          <div key={i} style={{ animation:`statFadeIn 0.55s ease-out ${i * 0.12 + 0.3}s both` }}>
            <div style={{ fontSize:20, fontWeight:800, color:'#818CF8', letterSpacing:'-0.02em' }}>{s.num}</div>
            <div style={{ fontSize:10.5, color:'rgba(180,170,255,0.42)', marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Glass panel helper (reused by modals) ─────────────────────────────────────

const GLASS_OVERLAY: React.CSSProperties = {
  position:'fixed', inset:0, zIndex:100,
  background:'rgba(4,1,18,0.82)',
  backdropFilter:'blur(10px)',
  WebkitBackdropFilter:'blur(10px)',
  display:'flex', alignItems:'center', justifyContent:'center',
  padding:20,
}

const glassCard = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  background:'rgba(10,6,34,0.92)',
  backdropFilter:'blur(24px) saturate(150%)',
  WebkitBackdropFilter:'blur(24px) saturate(150%)',
  border:'1px solid rgba(139,92,246,0.26)',
  borderRadius:20,
  boxShadow:'0 0 60px rgba(99,102,241,0.14), 0 24px 60px rgba(0,0,0,0.65)',
  ...extra,
})

const glassInput: React.CSSProperties = {
  width:'100%', padding:'11px 14px',
  background:'rgba(6,3,22,0.80)',
  border:'1px solid rgba(139,92,246,0.20)',
  borderRadius:10, color:'#E8E4FF', fontSize:14,
  outline:'none', boxSizing:'border-box',
  transition:'border-color 0.2s, box-shadow 0.2s',
}

// ── AddStudentModal ───────────────────────────────────────────────────────────

interface AddStudentModalProps {
  onClose: () => void
  onAdd: (name: string, avatar: string, color: string, target: number) => void
}

function AddStudentModal({ onClose, onAdd }: AddStudentModalProps) {
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [color, setColor] = useState(COLORS[0])
  const [target, setTarget] = useState(900)

  return (
    <div style={GLASS_OVERLAY}>
      <div style={glassCard({ padding:28, width:'100%', maxWidth:430 })}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
          <div style={{ fontSize:16, fontWeight:700, color:'#E8E4FF', letterSpacing:'-0.01em' }}>New Student Profile</div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(200,190,255,0.50)', padding:4 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:11, fontWeight:600, color:'rgba(180,170,255,0.55)', marginBottom:10, letterSpacing:'0.1em', textTransform:'uppercase' }}>Avatar</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {AVATARS.map(a => (
              <button key={a} onClick={() => setAvatar(a)} style={{
                width:44, height:44, borderRadius:10, fontSize:20,
                background:avatar===a ? `${color}22` : 'rgba(255,255,255,0.04)',
                border:`2px solid ${avatar===a ? color : 'rgba(139,92,246,0.18)'}`,
                cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all 0.15s',
              }}>{a}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:11, fontWeight:600, color:'rgba(180,170,255,0.55)', marginBottom:10, letterSpacing:'0.1em', textTransform:'uppercase' }}>Color</div>
          <div style={{ display:'flex', gap:8 }}>
            {COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)} style={{
                width:28, height:28, borderRadius:'50%', background:c, border:'none', cursor:'pointer',
                outline:color===c ? `3px solid ${c}` : 'none', outlineOffset:2,
              }} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:11, fontWeight:600, color:'rgba(180,170,255,0.55)', marginBottom:8, letterSpacing:'0.1em', textTransform:'uppercase' }}>Name</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter name…" autoFocus
            style={glassInput}
            onKeyDown={e => e.key==='Enter' && name.trim() && onAdd(name.trim(), avatar, color, target)} />
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:600, color:'rgba(180,170,255,0.55)', marginBottom:8, letterSpacing:'0.1em', textTransform:'uppercase' }}>Target Score</div>
          <div style={{ display:'flex', gap:6 }}>
            {[750,850,900,940,990].map(s => (
              <button key={s} onClick={() => setTarget(s)} style={{
                flex:1, padding:'8px 0', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer',
                background:target===s ? `${color}22` : 'rgba(255,255,255,0.04)',
                border:`1px solid ${target===s ? color : 'rgba(139,92,246,0.18)'}`,
                color:target===s ? color : 'rgba(180,170,255,0.55)',
                transition:'all 0.15s',
              }}>{s}</button>
            ))}
          </div>
        </div>

        <button onClick={() => name.trim() && onAdd(name.trim(), avatar, color, target)} disabled={!name.trim()}
          style={{
            width:'100%', padding:'13px', borderRadius:11, fontSize:14, fontWeight:700, cursor:name.trim()?'pointer':'not-allowed',
            background:name.trim() ? `linear-gradient(135deg, #6366F1, #8B5CF6)` : 'rgba(255,255,255,0.06)',
            border:'none', color:name.trim()?'#fff':'rgba(180,170,255,0.35)',
            boxShadow:name.trim()?'0 0 24px rgba(99,102,241,0.35)':'none',
            transition:'all 0.2s',
          }}>
          Create Profile
        </button>
      </div>
    </div>
  )
}

// ── PinModal ──────────────────────────────────────────────────────────────────

function PinModal({ onClose, onSuccess, pin }: { onClose:()=>void; onSuccess:()=>void; pin:string }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const submit = () => { if (input===pin) onSuccess(); else { setError(true); setInput('') } }

  return (
    <div style={GLASS_OVERLAY}>
      <div style={glassCard({ padding:32, width:'100%', maxWidth:320, textAlign:'center' })}>
        <div style={{
          width:56, height:56, borderRadius:'50%',
          background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.28)',
          display:'flex', alignItems:'center', justifyContent:'center',
          margin:'0 auto 18px',
          boxShadow:'0 0 28px rgba(99,102,241,0.25)',
        }}>
          <Lock size={24} style={{ color:'#818CF8' }} />
        </div>
        <div style={{ fontSize:17, fontWeight:700, color:'#E8E4FF', marginBottom:6 }}>Teacher Access</div>
        <div style={{ fontSize:13, color:'rgba(180,170,255,0.55)', marginBottom:22 }}>Enter your PIN to continue</div>

        <input type="password" value={input} onChange={e => { setInput(e.target.value); setError(false) }}
          placeholder="••••" autoFocus maxLength={8}
          style={{ ...glassInput, textAlign:'center', letterSpacing:'0.28em', fontSize:20, marginBottom:8,
            borderColor:error?'rgba(244,63,94,0.60)':'rgba(139,92,246,0.22)' }}
          onKeyDown={e => e.key==='Enter' && submit()} />

        {error && <div style={{ fontSize:12, color:'#F87171', marginBottom:8 }}>Incorrect PIN</div>}
        <div style={{ fontSize:11, color:'rgba(180,170,255,0.35)', marginBottom:18 }}>Default PIN: 1234</div>

        <div style={{ display:'flex', gap:8 }}>
          <button onClick={onClose} style={{
            flex:1, padding:'11px', borderRadius:10, fontSize:13, fontWeight:600,
            background:'rgba(255,255,255,0.05)', border:'1px solid rgba(139,92,246,0.18)',
            color:'rgba(200,190,255,0.65)', cursor:'pointer',
          }}>Cancel</button>
          <button onClick={submit} style={{
            flex:1, padding:'11px', borderRadius:10, fontSize:13, fontWeight:700,
            background:'linear-gradient(135deg,#6366F1,#8B5CF6)', border:'none',
            color:'#fff', cursor:'pointer',
            boxShadow:'0 0 20px rgba(99,102,241,0.30)',
          }}>Enter</button>
        </div>
      </div>
    </div>
  )
}

// ── StudentCard ───────────────────────────────────────────────────────────────

function StudentCard({ student, onSelect, onDelete, score }: { student:StudentMeta; onSelect:()=>void; onDelete:()=>void; score?:number }) {
  const [hovered, setHovered] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const lastActive = student.lastStudied
    ? (() => {
        const d = Math.floor((Date.now()-student.lastStudied)/86400000)
        return d===0?'Today':d===1?'Yesterday':`${d}d ago`
      })()
    : 'New'

  return (
    <div style={{
      background:hovered ? `${student.color}10` : 'rgba(255,255,255,0.038)',
      border:`1px solid ${hovered ? student.color+'42' : 'rgba(139,92,246,0.14)'}`,
      borderRadius:14, padding:'18px 16px', cursor:'pointer',
      transition:'all 0.18s', position:'relative',
      display:'flex', flexDirection:'column', gap:12,
      boxShadow:hovered ? `0 0 28px ${student.color}18, 0 8px 24px rgba(0,0,0,0.35)` : '0 2px 12px rgba(0,0,0,0.25)',
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirmDelete(false) }}
      onClick={onSelect}>
      <button onClick={e => { e.stopPropagation(); setConfirmDelete(v=>!v) }} style={{
        position:'absolute', top:10, right:10,
        background:confirmDelete?'rgba(244,63,94,0.10)':'none',
        border:confirmDelete?'1px solid rgba(244,63,94,0.28)':'none',
        borderRadius:6, padding:5, cursor:'pointer',
        color:confirmDelete?'#F87171':'rgba(180,170,255,0.35)',
        opacity:hovered?1:0, transition:'opacity 0.15s',
      }}>
        <Trash2 size={13} />
      </button>

      {confirmDelete && (
        <div onClick={e=>e.stopPropagation()} style={{
          position:'absolute', top:36, right:10,
          ...glassCard({ padding:'10px 14px', zIndex:10, fontSize:12, color:'rgba(200,190,255,0.70)' }),
        }}>
          <div style={{ marginBottom:8, color:'#F87171' }}>Delete {student.name}?</div>
          <div style={{ display:'flex', gap:6 }}>
            <button onClick={() => setConfirmDelete(false)} style={{
              padding:'4px 10px', borderRadius:5, fontSize:11,
              background:'rgba(255,255,255,0.05)', border:'1px solid rgba(139,92,246,0.18)',
              color:'rgba(200,190,255,0.65)', cursor:'pointer',
            }}>Cancel</button>
            <button onClick={onDelete} style={{
              padding:'4px 10px', borderRadius:5, fontSize:11,
              background:'#F43F5E', border:'none', color:'#fff', cursor:'pointer',
            }}>Delete</button>
          </div>
        </div>
      )}

      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{
          width:50, height:50, borderRadius:13,
          background:`${student.color}18`, border:`1.5px solid ${student.color}35`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:24, flexShrink:0,
          boxShadow:`0 0 16px ${student.color}20`,
        }}>{student.avatar}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:700, color:'#E8E4FF', marginBottom:3 }}>{student.name}</div>
          <div style={{ fontSize:11, color:'rgba(180,170,255,0.45)' }}>{lastActive}</div>
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:10, color:'rgba(180,170,255,0.40)', marginBottom:2 }}>Est. Score</div>
          <div style={{ fontSize:20, fontWeight:800, color:student.color }}>{score??'—'}</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:10, color:'rgba(180,170,255,0.40)', marginBottom:2 }}>Target</div>
          <div style={{ fontSize:13, fontWeight:600, color:'rgba(200,190,255,0.60)' }}>{student.targetScore}</div>
        </div>
        <div style={{
          display:'flex', alignItems:'center', gap:4,
          background:`${student.color}18`, border:`1px solid ${student.color}28`,
          borderRadius:8, padding:'6px 12px',
        }}>
          <span style={{ fontSize:12, fontWeight:700, color:student.color }}>Study</span>
          <ChevronRight size={12} style={{ color:student.color }} />
        </div>
      </div>
    </div>
  )
}

// ── MigrateModal ──────────────────────────────────────────────────────────────

function MigrateModal({ onMigrate, onSkip }: { onMigrate:(name:string)=>void; onSkip:()=>void }) {
  const [name, setName] = useState('')
  return (
    <div style={GLASS_OVERLAY}>
      <div style={glassCard({ padding:30, width:'100%', maxWidth:390, textAlign:'center' })}>
        <div style={{ fontSize:32, marginBottom:14 }}>👋</div>
        <div style={{ fontSize:16, fontWeight:700, color:'#E8E4FF', marginBottom:8 }}>Welcome to Multi-Student Mode</div>
        <div style={{ fontSize:13, color:'rgba(180,170,255,0.55)', marginBottom:22, lineHeight:1.65 }}>
          We found your existing study data. Enter your name to save it to your profile.
        </div>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name…" autoFocus
          style={{ ...glassInput, marginBottom:16 }}
          onKeyDown={e=>e.key==='Enter'&&name.trim()&&onMigrate(name.trim())} />
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={onSkip} style={{
            flex:1, padding:'11px', borderRadius:10, fontSize:13, fontWeight:600,
            background:'rgba(255,255,255,0.05)', border:'1px solid rgba(139,92,246,0.18)',
            color:'rgba(200,190,255,0.65)', cursor:'pointer',
          }}>Start Fresh</button>
          <button onClick={() => name.trim()&&onMigrate(name.trim())} disabled={!name.trim()} style={{
            flex:2, padding:'11px', borderRadius:10, fontSize:13, fontWeight:700,
            background:name.trim()?'linear-gradient(135deg,#6366F1,#8B5CF6)':'rgba(255,255,255,0.06)',
            border:'none', color:name.trim()?'#fff':'rgba(180,170,255,0.35)',
            cursor:name.trim()?'pointer':'not-allowed',
            boxShadow:name.trim()?'0 0 20px rgba(99,102,241,0.28)':'none',
            transition:'all 0.2s',
          }}>Save My Progress</button>
        </div>
      </div>
    </div>
  )
}

// ── Main ProfileGate ───────────────────────────────────────────────────────────

interface ProfileGateProps { children: React.ReactNode }

export default function ProfileGate({ children }: ProfileGateProps) {
  const registry   = useRegistryStore()
  const appStore   = useAppStore()
  const authStore  = useAuthStore()

  const [showAdd,       setShowAdd]       = useState(false)
  const [showPin,       setShowPin]       = useState(false)
  const [showMigrate,   setShowMigrate]   = useState(false)
  const [showAuthForm,  setShowAuthForm]  = useState<'signin' | 'signup' | 'reset' | null>(null)
  const [showRoleSelect,setShowRoleSelect]= useState(false)
  const [pendingUser,   setPendingUser]   = useState<AuthUser | null>(null)
  const [authConnecting,setAuthConnecting]= useState(false)
  const googleBtnRef = useRef<HTMLDivElement>(null)

  // ── Firebase Auth state handler ──────────────────────────────────────────
  // Runs whenever the Firebase user changes (sign-in, sign-out, page load).
  const handleFirebaseUser = useCallback(async (fbUser: AuthUser | null) => {
    if (!fbUser) return

    // Look up their profile in Firebase RTDB
    const profile = await readUserProfile(fbUser.uid)

    if (!profile) {
      // Bootstrap: first admin via env var (checked before showing role selection)
      const bootstrapEmail = import.meta.env.VITE_ADMIN_BOOTSTRAP_EMAIL as string | undefined
      if (bootstrapEmail && fbUser.email === bootstrapEmail) {
        const name = fbUser.displayName ?? fbUser.email?.split('@')[0] ?? 'Admin'
        await createUserProfile(fbUser.uid, {
          uid: fbUser.uid,
          email: fbUser.email ?? '',
          displayName: name,
          photoURL: fbUser.photoURL ?? '',
          role: 'admin',
          provider: fbUser.providerId,
        })
        authStore._setRole('admin')
        return
      }
      // Brand new user — need role selection
      setPendingUser(fbUser)
      setShowRoleSelect(true)
      return
    }

    // Returning user — restore session
    if (profile.role === 'admin') {
      authStore._setRole('admin')
    } else if (profile.role === 'teacher') {
      registry.setTeacherMode(true)
    } else {
      await activateStudentSession(fbUser, profile.displayName, profile.joinedClassCode)
    }
  }, [registry, authStore]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!AUTH_ENABLED) return
    if (!authStore.initialized) return
    if (authStore.loading) return
    handleFirebaseUser(authStore.user)
  }, [authStore.user, authStore.initialized, authStore.loading]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Activate student session after Firebase Auth sign-in ─────────────────
  const activateStudentSession = useCallback(async (
    fbUser: AuthUser,
    name: string,
    joinedClassCode?: string,
  ) => {
    const uid   = fbUser.uid
    const avatar = '🎯'
    const color  = COLORS[Math.abs(uid.charCodeAt(0) + uid.charCodeAt(1)) % COLORS.length]

    // Ensure the student exists in the local registry (upsert by Firebase UID)
    registry.addStudentWithId(uid, name, avatar, color, 900, {
      email:    fbUser.email ?? '',
      photoUrl: fbUser.photoURL ?? '',
      googleId: uid,
    })

    // Load progress: prefer Firebase (newer / cross-device), fall back to localStorage
    const [firebaseProgress, localProgress] = await Promise.all([
      readUserProgress(uid),
      Promise.resolve(loadStudentSnapshot(uid)),
    ])

    const fbTime  = (firebaseProgress?.syncedAt as number | undefined) ?? 0
    const locTime = localProgress ? (localProgress.activityLog?.slice(-1)[0]?.ts ?? 0) : 0
    const progress = fbTime >= locTime ? firebaseProgress : localProgress

    if (progress) {
      useAppStore.setState({ ...progress as object })
    } else {
      appStore.resetAll()
      appStore.updateProfile({ name, targetScore: 900 })
    }

    registry.setCurrentStudent(uid)
    registry.updateStudentLastStudied(uid)
    appStore.logActivity({ type: 'login', label: `${name} signed in` })

    const state = useAppStore.getState()
    saveStudentSnapshot(uid, state)

    // Teacher monitoring sync (if student has joined a class)
    const code = joinedClassCode ?? registry.joinedClassCode
    if (code) {
      const prof = { name, avatar, color, email: fbUser.email ?? '', photoUrl: fbUser.photoURL ?? '', targetScore: 900 }
      cloudWriteLogin(code, uid, prof, state)
      localBroadcastStudent(code, { studentId: uid, profile: prof })
    }

    // Update last login in Firebase profile
    updateUserProfile(uid, { lastLoginAt: Date.now(), displayName: name })
  }, [registry, appStore]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Role selection handler (new users) ───────────────────────────────────
  const handleRoleSelected = useCallback(async (role: 'student' | 'teacher' | 'admin') => {
    if (!pendingUser) return
    setAuthConnecting(true)

    const name  = pendingUser.displayName ?? pendingUser.email?.split('@')[0] ?? 'Warrior'
    const uid   = pendingUser.uid

    await createUserProfile(uid, {
      uid,
      email:       pendingUser.email ?? '',
      displayName: name,
      photoURL:    pendingUser.photoURL ?? '',
      role,
      provider:    pendingUser.providerId,
    })

    authStore._setRole(role)

    if (role === 'teacher') {
      registry.setTeacherMode(true)
    } else {
      await activateStudentSession(pendingUser, name)
    }

    setShowRoleSelect(false)
    setPendingUser(null)
    setAuthConnecting(false)
  }, [pendingUser, authStore, registry, activateStudentSession])

  // ── Firebase sign-out ────────────────────────────────────────────────────
  const handleFirebaseSignOut = useCallback(async () => {
    if (registry.currentStudentId) {
      saveStudentSnapshot(registry.currentStudentId, useAppStore.getState())
    }
    await authStore.signOut()
    registry.setCurrentStudent(null)
    registry.setTeacherMode(false)
  }, [authStore, registry])

  useEffect(() => {
    const hasExistingData = localStorage.getItem('toeic-warroom-v2')
    const hasStudents     = registry.students.length > 0
    if (hasExistingData && !hasStudents && !registry.currentStudentId && !registry.isTeacherMode) {
      setShowMigrate(true)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !window.google || !googleBtnRef.current) return
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: { credential: string }) => {
        const info = decodeGoogleJWT(response.credential)
        const existing = registry.students.find(s => s.googleId === info.sub)
        if (existing) {
          handleSelectStudent(existing)
        } else {
          const avatar = '🎯'
          const color  = COLORS[registry.students.length % COLORS.length]
          const id     = registry.addStudent(info.name, avatar, color, 900, {
            googleId: info.sub, email: info.email, photoUrl: info.picture,
          })
          appStore.resetAll()
          appStore.updateProfile({ name: info.name })
          registry.setCurrentStudent(id)
          registry.updateStudentLastStudied(id)
          useAppStore.getState().logActivity({ type:'login', label:`${info.name} logged in` })
          const gState = useAppStore.getState()
          saveStudentSnapshot(id, gState)
          const { joinedClassCode: gCode } = useRegistryStore.getState()
          if (gCode) {
            cloudWriteLogin(gCode, id, { name:info.name, avatar, color, email:info.email??'', photoUrl:info.picture??'', targetScore:900 }, gState)
          }
        }
      },
    })
    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme:'filled_black', size:'large', text:'signin_with', shape:'rectangular', width:260,
    })
  }, [registry.students.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const broadcastLogin = (
    studentId: string,
    profile: { name:string; avatar:string; color:string; email?:string; photoUrl?:string; targetScore:number },
  ) => {
    const { joinedClassCode } = useRegistryStore.getState()
    if (!joinedClassCode) return
    localBroadcastStudent(joinedClassCode, { studentId, profile })
  }

  const handleMigrate = (name: string) => {
    const avatar = AVATARS[Math.floor(Math.random()*AVATARS.length)]
    const color  = COLORS[Math.floor(Math.random()*COLORS.length)]
    const id     = registry.addStudent(name, avatar, color, appStore.profile.targetScore)
    saveStudentSnapshot(id, appStore)
    registry.setCurrentStudent(id)
    registry.updateStudentLastStudied(id)
    appStore.logActivity({ type:'login', label:`${name} logged in` })
    const state = useAppStore.getState()
    saveStudentSnapshot(id, state)
    const { joinedClassCode } = useRegistryStore.getState()
    const prof = { name, avatar, color, email:'', photoUrl:'', targetScore:appStore.profile.targetScore }
    if (joinedClassCode) { cloudWriteLogin(joinedClassCode,id,prof,state); localBroadcastStudent(joinedClassCode,{studentId:id,profile:prof}) }
    setShowMigrate(false)
  }

  const handleSkipMigrate = () => { appStore.resetAll(); setShowMigrate(false); setShowAdd(true) }

  const handleSelectStudent = (student: StudentMeta) => {
    if (registry.currentStudentId && registry.currentStudentId!==student.id) {
      saveStudentSnapshot(registry.currentStudentId, appStore)
    }
    const snapshot = loadStudentSnapshot(student.id)
    if (snapshot) {
      appStore.updateProfile({ ...snapshot.profile })
      useAppStore.setState({ ...snapshot })
    } else {
      appStore.resetAll()
      appStore.updateProfile({ name:student.name, targetScore:student.targetScore })
    }
    registry.setCurrentStudent(student.id)
    registry.updateStudentLastStudied(student.id)
    useAppStore.getState().logActivity({ type:'login', label:`${student.name} logged in` })
    const state = useAppStore.getState()
    saveStudentSnapshot(student.id, state)
    const { joinedClassCode } = useRegistryStore.getState()
    const prof = { name:student.name, avatar:student.avatar, color:student.color, email:student.email??'', photoUrl:student.photoUrl??'', targetScore:student.targetScore }
    if (joinedClassCode) { cloudWriteLogin(joinedClassCode,student.id,prof,state); localBroadcastStudent(joinedClassCode,{studentId:student.id,profile:prof}) }
  }

  const handleAddStudent = (name:string, avatar:string, color:string, target:number) => {
    const id = registry.addStudent(name, avatar, color, target)
    appStore.resetAll()
    appStore.updateProfile({ name, targetScore:target })
    registry.setCurrentStudent(id)
    registry.updateStudentLastStudied(id)
    useAppStore.getState().logActivity({ type:'login', label:`${name} logged in` })
    const state = useAppStore.getState()
    saveStudentSnapshot(id, state)
    const { joinedClassCode } = useRegistryStore.getState()
    const prof = { name, avatar, color, email:'', photoUrl:'', targetScore:target }
    if (joinedClassCode) { cloudWriteLogin(joinedClassCode,id,prof,state); localBroadcastStudent(joinedClassCode,{studentId:id,profile:prof}) }
    setShowAdd(false)
  }

  const handleDeleteStudent = (id: string) => {
    deleteStudentSnapshot(id)
    registry.removeStudent(id)
  }

  const studentScores = registry.students.reduce<Record<string,number>>((acc,s) => {
    const snap = loadStudentSnapshot(s.id)
    if (!snap) return acc
    const recent = (snap.grammarSessions??[]).slice(-10)
    if (recent.length===0) { acc[s.id] = s.targetScore>900?650:550; return acc }
    const avgAcc = recent.reduce((sum,sess)=>sum+sess.correct/sess.count,0)/recent.length
    acc[s.id] = 150+Math.round(avgAcc*345)+Math.round(s.targetScore/4)
    return acc
  }, {})

  // While Firebase Auth is initializing, show nothing (prevents flash of profile gate)
  if (AUTH_ENABLED && !authStore.initialized) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
        background:'#04010F', flexDirection:'column', gap:16 }}>
        <Logo variant="icon" iconSize={52} />
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <Loader2 size={16} style={{ color:'#818CF8', animation:'spin 1s linear infinite' }} />
          <span style={{ color:'rgba(180,170,255,0.5)', fontSize:13 }}>Connecting…</span>
        </div>
        <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      </div>
    )
  }

  const isAdmin = AUTH_ENABLED && authStore.initialized && authStore.role === 'admin'
  if (registry.currentStudentId || registry.isTeacherMode || isAdmin) return <>{children}</>

  // ── Cinematic login render ────────────────────────────────────────────────

  const hasStudents = registry.students.length > 0

  return (
    <div style={{ position:'relative', minHeight:'100vh', overflow:'hidden',
      fontFamily:"'Inter', system-ui, sans-serif", color:'#E8E4FF' }}>
      <style>{SCENE_STYLES}</style>

      <PremiumScene />

      {/* Modals */}
      {showMigrate && <MigrateModal onMigrate={handleMigrate} onSkip={handleSkipMigrate} />}
      {showAdd     && <AddStudentModal onClose={() => setShowAdd(false)} onAdd={handleAddStudent} />}
      {showPin     && <PinModal pin={registry.teacherPin} onClose={() => setShowPin(false)}
                        onSuccess={() => { registry.setTeacherMode(true); setShowPin(false) }} />}

      {/* Firebase Auth — Role Selection (new users) */}
      {showRoleSelect && (
        <RoleSelectModal
          loading={authConnecting}
          onSelect={handleRoleSelected}
          onCancel={async () => { setShowRoleSelect(false); setPendingUser(null); await authStore.signOut() }}
        />
      )}

      {/* ── Main layout: hero (desktop) + auth card ── */}
      <div className="pg-root">

        {/* Desktop hero panel — hidden on tablet/mobile via .pg-hero CSS class */}
        <HeroPanel />

        {/* Auth card column */}
        <div className="pg-card-col">

        {/* Gradient border wrapper */}
        <div style={{
          width:'100%',
          borderRadius:26,
          padding:1,
          background:'linear-gradient(135deg, rgba(139,92,246,0.45) 0%, rgba(99,102,241,0.22) 35%, rgba(59,130,246,0.32) 65%, rgba(139,92,246,0.45) 100%)',
          animation:'cardFadeIn 0.85s cubic-bezier(0.22,1,0.36,1) both, glowPulse 7s ease-in-out infinite 1.2s',
        }}>
          {/* Glass card */}
          <div style={{
            borderRadius:25,
            background:'rgba(8,5,28,0.78)',
            backdropFilter:'blur(28px) saturate(160%)',
            WebkitBackdropFilter:'blur(28px) saturate(160%)',
            overflow:'hidden',
          }}>
            {/* Top shimmer line */}
            <div style={{ height:1, background:'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.60) 35%, rgba(99,102,241,0.80) 50%, rgba(139,92,246,0.60) 65%, transparent 100%)' }} />

            <div style={{ padding:'32px 36px 28px' }}>

              {/* ── Logo row ── */}
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:28 }}>
                <div style={{ animation:'logoGlow 4s ease-in-out infinite', borderRadius:13 }}>
                  <Logo variant="full" iconSize={46} showPrefix />
                </div>

                {/* Spacer + decorative dots */}
                <div style={{ flex:1 }} />
                <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                  {[1,0.5,0.25].map((o,i) => (
                    <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:`rgba(139,92,246,${o})` }} />
                  ))}
                </div>
              </div>

              {/* ── Heading ── */}
              <div style={{ marginBottom:24 }}>
                <h1 style={{ fontSize:'clamp(22px,4vw,30px)', fontWeight:800, color:'#FFFFFF', letterSpacing:'-0.025em', margin:'0 0 6px', lineHeight:1.15 }}>
                  {AUTH_ENABLED && !showAuthForm ? (
                    <>Sign in to{' '}
                      <span style={{ background:'linear-gradient(135deg,#818CF8 0%,#A78BFA 50%,#F472B6 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                        continue
                      </span>
                    </>
                  ) : AUTH_ENABLED && showAuthForm === 'signup' ? (
                    <>Create your{' '}
                      <span style={{ background:'linear-gradient(135deg,#818CF8 0%,#A78BFA 50%,#F472B6 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                        account
                      </span>
                    </>
                  ) : AUTH_ENABLED && showAuthForm === 'reset' ? (
                    <>Reset{' '}
                      <span style={{ background:'linear-gradient(135deg,#818CF8 0%,#A78BFA 50%,#F472B6 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                        password
                      </span>
                    </>
                  ) : (
                    <>Who's studying{' '}
                      <span style={{ background:'linear-gradient(135deg,#818CF8 0%,#A78BFA 50%,#F472B6 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                        today?
                      </span>
                    </>
                  )}
                </h1>
                <p style={{ fontSize:13, color:'rgba(180,170,255,0.55)', margin:0, lineHeight:1.6 }}>
                  {AUTH_ENABLED
                    ? showAuthForm === 'signup' ? 'One account, all devices, forever.'
                    : showAuthForm === 'reset'  ? 'Enter your email to receive a reset link.'
                    : showAuthForm === 'signin' ? 'Welcome back. Enter your details below.'
                    : 'Your progress follows you everywhere.'
                    : 'Select your profile to continue where you left off.'}
                </p>
              </div>

              {/* ── Divider ── */}
              <div style={{ height:1, background:'linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent)', marginBottom:24 }} />

              {/* ── Firebase Auth section (when enabled) ── */}
              {AUTH_ENABLED ? (
                showAuthForm
                  ? <AuthFormPanel
                      mode={showAuthForm}
                      onDone={() => setShowAuthForm(null)}
                      onSwitch={(m) => setShowAuthForm(m)}
                    />
                  : <FirebaseAuthPanel
                      onEmailSignIn={() => setShowAuthForm('signin')}
                      onEmailSignUp={() => setShowAuthForm('signup')}
                    />
              ) : (
                /* ── Legacy Google Sign-In (GSI, only when Firebase Auth disabled) ── */
                GOOGLE_CLIENT_ID && (
                  <div style={{ marginBottom:22 }}>
                    <div ref={googleBtnRef} style={{ display:'inline-block' }} />
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:18 }}>
                      <div style={{ flex:1, height:1, background:'rgba(139,92,246,0.18)' }} />
                      <span style={{ fontSize:11, color:'rgba(180,170,255,0.40)', letterSpacing:'0.06em' }}>or choose manually</span>
                      <div style={{ flex:1, height:1, background:'rgba(139,92,246,0.18)' }} />
                    </div>
                  </div>
                )
              )}

              {/* When Firebase Auth is enabled: show local profiles as fallback below a divider */}
              {AUTH_ENABLED && !showAuthForm && hasStudents && (
                <div style={{ marginTop:24 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
                    <div style={{ flex:1, height:1, background:'rgba(139,92,246,0.12)' }} />
                    <span style={{ fontSize:11, color:'rgba(180,170,255,0.30)', letterSpacing:'0.06em' }}>or continue without account</span>
                    <div style={{ flex:1, height:1, background:'rgba(139,92,246,0.12)' }} />
                  </div>
                </div>
              )}

              {/* ── Student grid ── */}
              {hasStudents ? (
                <div style={{
                  display:'grid',
                  gridTemplateColumns:'repeat(auto-fill, minmax(210px, 1fr))',
                  gap:10, marginBottom:22,
                }}>
                  {registry.students.map(s => (
                    <StudentCard key={s.id} student={s}
                      onSelect={() => handleSelectStudent(s)}
                      onDelete={() => handleDeleteStudent(s.id)}
                      score={studentScores[s.id]} />
                  ))}

                  {/* Add student card */}
                  <button onClick={() => setShowAdd(true)}
                    style={{
                      background:'transparent',
                      border:'1.5px dashed rgba(139,92,246,0.28)',
                      borderRadius:14, padding:20,
                      cursor:'pointer', color:'rgba(180,170,255,0.40)',
                      display:'flex', flexDirection:'column',
                      alignItems:'center', justifyContent:'center',
                      gap:8, minHeight:148,
                      transition:'all 0.18s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor='rgba(139,92,246,0.65)'
                      ;(e.currentTarget as HTMLElement).style.color='#A78BFA'
                      ;(e.currentTarget as HTMLElement).style.background='rgba(99,102,241,0.06)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor='rgba(139,92,246,0.28)'
                      ;(e.currentTarget as HTMLElement).style.color='rgba(180,170,255,0.40)'
                      ;(e.currentTarget as HTMLElement).style.background='transparent'
                    }}>
                    <Plus size={22} />
                    <span style={{ fontSize:13, fontWeight:600 }}>Add Student</span>
                  </button>
                </div>
              ) : (
                /* Empty state */
                <div style={{
                  background:'rgba(255,255,255,0.03)',
                  border:'1px solid rgba(139,92,246,0.16)',
                  borderRadius:16, padding:'38px 24px',
                  textAlign:'center', marginBottom:22,
                }}>
                  <div style={{ fontSize:38, marginBottom:14 }}>🎯</div>
                  <div style={{ fontSize:16, fontWeight:700, color:'#E8E4FF', marginBottom:8 }}>No profiles yet</div>
                  <p style={{ fontSize:13, color:'rgba(180,170,255,0.50)', margin:'0 0 22px', lineHeight:1.65, maxWidth:300, marginInline:'auto' }}>
                    Create a student profile to start tracking your TOEIC progress.
                  </p>
                  <button onClick={() => setShowAdd(true)} style={{
                    padding:'12px 28px', borderRadius:11,
                    background:'linear-gradient(135deg,#6366F1,#8B5CF6)', border:'none',
                    color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer',
                    display:'inline-flex', alignItems:'center', gap:8,
                    boxShadow:'0 0 24px rgba(99,102,241,0.35)',
                  }}>
                    <Plus size={16} /> Create First Profile
                  </button>
                </div>
              )}

              {/* ── Teacher access ── */}
              <div style={{
                paddingTop:18,
                borderTop:'1px solid rgba(139,92,246,0.14)',
                display:'flex', alignItems:'center', justifyContent:'space-between',
                flexWrap:'wrap', gap:10,
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <GraduationCap size={15} style={{ color:'rgba(180,170,255,0.40)' }} />
                  <span style={{ fontSize:13, color:'rgba(180,170,255,0.45)' }}>Are you the teacher?</span>
                </div>
                <button onClick={() => setShowPin(true)} style={{
                  display:'flex', alignItems:'center', gap:7,
                  padding:'8px 16px', borderRadius:9,
                  background:'rgba(255,255,255,0.04)',
                  border:'1px solid rgba(139,92,246,0.20)',
                  color:'rgba(200,190,255,0.65)', fontSize:13, fontWeight:600, cursor:'pointer',
                  transition:'all 0.18s',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor='rgba(139,92,246,0.50)'
                    ;(e.currentTarget as HTMLElement).style.color='#A78BFA'
                    ;(e.currentTarget as HTMLElement).style.background='rgba(99,102,241,0.08)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor='rgba(139,92,246,0.20)'
                    ;(e.currentTarget as HTMLElement).style.color='rgba(200,190,255,0.65)'
                    ;(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)'
                  }}>
                  <Users size={14} /> Teacher View
                </button>
              </div>
            </div>

            {/* Bottom shimmer line */}
            <div style={{ height:1, background:'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.35) 50%, transparent 100%)' }} />
          </div>
        </div>

        {/* Attribution below card */}
        <div style={{ marginTop:20, fontSize:11, color:'rgba(180,170,255,0.25)', letterSpacing:'0.06em', textAlign:'center' }}>
          LEXORA · 940 SCORE SPRINT
        </div>
        </div>{/* /pg-card-col */}
      </div>{/* /pg-root */}
    </div>
  )
}

// ── Firebase Auth components ───────────────────────────────────────────────────

const PROVIDER_BTN: React.CSSProperties = {
  display:'flex', alignItems:'center', justifyContent:'center', gap:10,
  width:'100%', padding:'11px 18px', borderRadius:12,
  border:'1px solid rgba(139,92,246,0.22)',
  background:'rgba(255,255,255,0.04)',
  color:'#E8E4FF', fontSize:14, fontWeight:600, cursor:'pointer',
  transition:'all 0.18s', marginBottom:10,
}

const providerHover = (e: React.MouseEvent<HTMLButtonElement>, enter: boolean) => {
  const el = e.currentTarget as HTMLElement
  el.style.background = enter ? 'rgba(99,102,241,0.10)' : 'rgba(255,255,255,0.04)'
  el.style.borderColor = enter ? 'rgba(139,92,246,0.55)' : 'rgba(139,92,246,0.22)'
}

// Google icon SVG (inline, no external dep)
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.25-.164-1.84H9v3.48h4.844a4.14 4.14 0 01-1.796 2.717v2.258h2.908C16.658 14.188 17.64 11.88 17.64 9.2z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
    <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"/>
  </svg>
)

// Apple icon
const AppleIcon = () => (
  <svg width="17" height="18" viewBox="0 0 814 1000" fill="currentColor" style={{ color:'#E8E4FF' }}>
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-167.2-107.5-115-133.9-133.3-253.9-21.5-201.9-21.5-237.9c0-198.4 130.3-303.2 259.1-303.2 66.7 0 122.1 40.8 163.8 40.8 40.3 0 103.1-43.1 176.7-43.1 27.1 0 108.2 2.6 168.6 79.7zm-110.2-209.6c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
  </svg>
)

interface FirebaseAuthPanelProps {
  onEmailSignIn: () => void
  onEmailSignUp: () => void
}

function FirebaseAuthPanel({ onEmailSignIn, onEmailSignUp }: FirebaseAuthPanelProps) {
  const authStore = useAuthStore()
  const [busy, setBusy] = useState<string | null>(null)

  const run = async (label: string, fn: () => Promise<unknown>) => {
    setBusy(label)
    try { await fn() } catch { /* error is set in store */ } finally { setBusy(null) }
  }

  return (
    <div style={{ marginBottom:8 }}>
      {authStore.error && authStore.error.length > 0 && (
        <div style={{
          background: authStore.error.includes('domain') ? 'rgba(245,158,11,0.10)' : 'rgba(248,113,113,0.10)',
          border: `1px solid ${authStore.error.includes('domain') ? 'rgba(245,158,11,0.35)' : 'rgba(248,113,113,0.28)'}`,
          borderRadius:10, padding:'10px 14px', marginBottom:14,
          fontSize:13, color: authStore.error.includes('domain') ? '#FCD34D' : '#FCA5A5',
        }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
            <X size={14} style={{ flexShrink:0, marginTop:2 }} />
            <span style={{ flex:1, lineHeight:1.5 }}>{authStore.error}</span>
            <button onClick={authStore.clearError}
              style={{ background:'none', border:'none', color:'inherit', cursor:'pointer', padding:2, flexShrink:0 }}>
              <X size={12} />
            </button>
          </div>
          {authStore.error.includes('domain') && (
            <div style={{ marginTop:8, paddingTop:8, borderTop:'1px solid rgba(245,158,11,0.20)', fontSize:11, color:'rgba(253,211,77,0.70)', lineHeight:1.6 }}>
              Fix: Firebase Console → Authentication → Settings → Authorized domains → add this domain.
            </div>
          )}
          {authStore.error.includes('not enabled') && (
            <div style={{ marginTop:8, paddingTop:8, borderTop:'1px solid rgba(248,113,113,0.20)', fontSize:11, color:'rgba(252,165,165,0.70)', lineHeight:1.6 }}>
              Fix: Firebase Console → Authentication → Sign-in methods → enable Google.
            </div>
          )}
        </div>
      )}

      {/* Google */}
      <button style={PROVIDER_BTN}
        onMouseEnter={e => providerHover(e, true)}
        onMouseLeave={e => providerHover(e, false)}
        disabled={busy !== null}
        onClick={() => run('google', () => authStore.signInWithGoogle())}>
        {busy === 'google' ? <Loader2 size={16} style={{ animation:'spin 1s linear infinite' }} /> : <GoogleIcon />}
        Continue with Google
      </button>

      {/* Apple */}
      <button style={PROVIDER_BTN}
        onMouseEnter={e => providerHover(e, true)}
        onMouseLeave={e => providerHover(e, false)}
        disabled={busy !== null}
        onClick={() => run('apple', () => authStore.signInWithApple())}>
        {busy === 'apple' ? <Loader2 size={16} style={{ animation:'spin 1s linear infinite' }} /> : <AppleIcon />}
        Continue with Apple
      </button>

      {/* Facebook */}
      <button style={PROVIDER_BTN}
        onMouseEnter={e => providerHover(e, true)}
        onMouseLeave={e => providerHover(e, false)}
        disabled={busy !== null}
        onClick={() => run('facebook', () => authStore.signInWithFacebook())}>
        {busy === 'facebook'
          ? <Loader2 size={16} style={{ animation:'spin 1s linear infinite' }} />
          : <span style={{ fontSize:16, fontWeight:900, color:'#1877F2' }}>f</span>}
        Continue with Facebook
      </button>

      {/* Divider */}
      <div style={{ display:'flex', alignItems:'center', gap:12, margin:'14px 0' }}>
        <div style={{ flex:1, height:1, background:'rgba(139,92,246,0.18)' }} />
        <span style={{ fontSize:11, color:'rgba(180,170,255,0.40)', letterSpacing:'0.06em' }}>or</span>
        <div style={{ flex:1, height:1, background:'rgba(139,92,246,0.18)' }} />
      </div>

      {/* Email options */}
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={onEmailSignIn} disabled={busy !== null}
          style={{ ...PROVIDER_BTN, flex:1, margin:0, justifyContent:'center',
            background:'rgba(99,102,241,0.12)', borderColor:'rgba(99,102,241,0.35)', color:'#A5B4FC' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(99,102,241,0.20)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(99,102,241,0.12)' }}>
          <Mail size={15} /> Sign in
        </button>
        <button onClick={onEmailSignUp} disabled={busy !== null}
          style={{ ...PROVIDER_BTN, flex:1, margin:0, justifyContent:'center',
            background:'linear-gradient(135deg,rgba(99,102,241,0.25),rgba(139,92,246,0.25))',
            borderColor:'rgba(139,92,246,0.45)', color:'#C4B5FD' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='linear-gradient(135deg,rgba(99,102,241,0.38),rgba(139,92,246,0.38))' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='linear-gradient(135deg,rgba(99,102,241,0.25),rgba(139,92,246,0.25))' }}>
          <Plus size={15} /> Create account
        </button>
      </div>

      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  )
}

// ── Email auth form ────────────────────────────────────────────────────────────

interface AuthFormPanelProps {
  mode: 'signin' | 'signup' | 'reset'
  onDone: () => void
  onSwitch: (m: 'signin' | 'signup' | 'reset') => void
}

function AuthFormPanel({ mode, onDone, onSwitch }: AuthFormPanelProps) {
  const authStore = useAuthStore()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [busy, setBusy]         = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const inputStyle: React.CSSProperties = {
    width:'100%', padding:'11px 14px', borderRadius:10,
    background:'rgba(255,255,255,0.04)', border:'1px solid rgba(139,92,246,0.25)',
    color:'#E8E4FF', fontSize:14, outline:'none', boxSizing:'border-box',
    transition:'border-color 0.15s',
  }

  const submit = async () => {
    if (!email) return
    setBusy(true)
    try {
      if (mode === 'reset') {
        await authStore.resetPassword(email)
        setResetSent(true)
      } else if (mode === 'signin') {
        await authStore.signInWithEmail(email, password)
        onDone()
      } else {
        await authStore.signUpWithEmail(email, password, name)
        // onAuthStateChanged handles the rest
        onDone()
      }
    } catch { /* error shown from store */ }
    setBusy(false)
  }

  if (resetSent) {
    return (
      <div style={{ textAlign:'center', padding:'24px 0' }}>
        <div style={{ fontSize:36, marginBottom:12 }}>📬</div>
        <div style={{ color:'#A5B4FC', fontWeight:700, marginBottom:8 }}>Check your inbox</div>
        <p style={{ color:'rgba(180,170,255,0.55)', fontSize:13, marginBottom:20 }}>
          A reset link has been sent to <strong>{email}</strong>
        </p>
        <button onClick={onDone} style={{ ...PROVIDER_BTN, width:'auto', margin:'0 auto', padding:'10px 28px' }}>
          Back to sign in
        </button>
      </div>
    )
  }

  return (
    <div style={{ marginBottom:8 }}>
      {authStore.error && (
        <div style={{
          background:'rgba(248,113,113,0.10)', border:'1px solid rgba(248,113,113,0.28)',
          borderRadius:10, padding:'10px 14px', marginBottom:14,
          fontSize:13, color:'#FCA5A5', display:'flex', alignItems:'center', gap:8,
        }}>
          <X size={14} /> {authStore.error}
          <button onClick={authStore.clearError} style={{ marginLeft:'auto', background:'none', border:'none', color:'#FCA5A5', cursor:'pointer', padding:2 }}>
            <X size={12} />
          </button>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {mode === 'signup' && (
          <input
            style={inputStyle} placeholder="Full name" value={name}
            onChange={e => setName(e.target.value)}
            onFocus={e => (e.target.style.borderColor='rgba(139,92,246,0.6)')}
            onBlur={e => (e.target.style.borderColor='rgba(139,92,246,0.25)')}
          />
        )}
        <input
          type="email" style={inputStyle} placeholder="Email address" value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          onFocus={e => (e.target.style.borderColor='rgba(139,92,246,0.6)')}
          onBlur={e => (e.target.style.borderColor='rgba(139,92,246,0.25)')}
        />
        {mode !== 'reset' && (
          <div style={{ position:'relative' }}>
            <input
              type={showPw ? 'text' : 'password'} style={{ ...inputStyle, paddingRight:44 }}
              placeholder={mode === 'signup' ? 'Password (min. 6 chars)' : 'Password'}
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              onFocus={e => (e.target.style.borderColor='rgba(139,92,246,0.6)')}
              onBlur={e => (e.target.style.borderColor='rgba(139,92,246,0.25)')}
            />
            <button onClick={() => setShowPw(v => !v)}
              style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                background:'none', border:'none', color:'rgba(180,170,255,0.45)', cursor:'pointer', padding:2 }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        )}
      </div>

      <button onClick={submit} disabled={busy || !email || (mode !== 'reset' && !password)}
        style={{
          marginTop:14, width:'100%', padding:'12px 18px', borderRadius:12,
          background: busy ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg,#6366F1,#8B5CF6)',
          border:'none', color:'#fff', fontSize:14, fontWeight:700, cursor: busy ? 'default' : 'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          boxShadow: busy ? 'none' : '0 0 24px rgba(99,102,241,0.35)',
          transition:'all 0.18s', opacity: (!email || (mode !== 'reset' && !password)) ? 0.5 : 1,
        }}>
        {busy ? <Loader2 size={16} style={{ animation:'spin 1s linear infinite' }} /> : null}
        {mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
      </button>

      {/* Footer links */}
      <div style={{ marginTop:16, display:'flex', justifyContent:'space-between', fontSize:12, color:'rgba(180,170,255,0.40)' }}>
        <button onClick={onDone}
          style={{ background:'none', border:'none', color:'rgba(180,170,255,0.40)', cursor:'pointer', fontSize:12 }}>
          ← Back
        </button>
        <div style={{ display:'flex', gap:16 }}>
          {mode === 'signin' && (
            <>
              <button onClick={() => { authStore.clearError(); onSwitch('reset') }}
                style={{ background:'none', border:'none', color:'rgba(180,170,255,0.40)', cursor:'pointer', fontSize:12 }}>
                Forgot password?
              </button>
              <button onClick={() => { authStore.clearError(); onSwitch('signup') }}
                style={{ background:'none', border:'none', color:'rgba(180,170,255,0.50)', cursor:'pointer', fontSize:12 }}>
                Create account
              </button>
            </>
          )}
          {mode === 'signup' && (
            <button onClick={() => { authStore.clearError(); onSwitch('signin') }}
              style={{ background:'none', border:'none', color:'rgba(180,170,255,0.40)', cursor:'pointer', fontSize:12 }}>
              Already have an account?
            </button>
          )}
          {mode === 'reset' && (
            <button onClick={() => { authStore.clearError(); onSwitch('signin') }}
              style={{ background:'none', border:'none', color:'rgba(180,170,255,0.40)', cursor:'pointer', fontSize:12 }}>
              Back to sign in
            </button>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  )
}

// ── Role selection modal ───────────────────────────────────────────────────────

interface RoleSelectModalProps {
  loading: boolean
  onSelect: (role: 'student' | 'teacher' | 'admin') => void
  onCancel: () => void
}

function RoleSelectModal({ loading, onSelect, onCancel }: RoleSelectModalProps) {
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:200,
      background:'rgba(4,1,15,0.85)', backdropFilter:'blur(12px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:24,
    }}>
      <div style={{
        width:'100%', maxWidth:420, borderRadius:22,
        background:'rgba(12,8,36,0.95)',
        border:'1px solid rgba(139,92,246,0.35)',
        boxShadow:'0 0 80px rgba(99,102,241,0.22)',
        padding:'36px 32px 28px',
        animation:'cardFadeIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:38, marginBottom:12 }}>👋</div>
          <div style={{ fontSize:20, fontWeight:800, color:'#FFFFFF', marginBottom:8 }}>
            Welcome to Lexora!
          </div>
          <p style={{ fontSize:14, color:'rgba(180,170,255,0.55)', lineHeight:1.6, margin:0 }}>
            How will you be using the platform?
          </p>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:20 }}>
          <button onClick={() => onSelect('student')} disabled={loading}
            style={{
              display:'flex', alignItems:'center', gap:16, padding:'18px 20px',
              borderRadius:14, background:'rgba(99,102,241,0.10)',
              border:'1px solid rgba(99,102,241,0.35)',
              cursor: loading ? 'default' : 'pointer', textAlign:'left',
              transition:'all 0.18s', width:'100%',
            }}
            onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLElement).style.background='rgba(99,102,241,0.20)'; (e.currentTarget as HTMLElement).style.borderColor='rgba(99,102,241,0.60)' } }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(99,102,241,0.10)'; (e.currentTarget as HTMLElement).style.borderColor='rgba(99,102,241,0.35)' }}>
            <span style={{ fontSize:28, flexShrink:0 }}>🎯</span>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:'#E8E4FF', marginBottom:2 }}>I am a Student</div>
              <div style={{ fontSize:12, color:'rgba(180,170,255,0.50)' }}>Track my progress, earn XP, pass TOEIC</div>
            </div>
            {loading ? <Loader2 size={16} style={{ marginLeft:'auto', color:'#818CF8', animation:'spin 1s linear infinite', flexShrink:0 }} /> : <ChevronRight size={16} style={{ marginLeft:'auto', color:'rgba(180,170,255,0.30)', flexShrink:0 }} />}
          </button>

          <button onClick={() => onSelect('teacher')} disabled={loading}
            style={{
              display:'flex', alignItems:'center', gap:16, padding:'18px 20px',
              borderRadius:14, background:'rgba(16,185,129,0.07)',
              border:'1px solid rgba(16,185,129,0.28)',
              cursor: loading ? 'default' : 'pointer', textAlign:'left',
              transition:'all 0.18s', width:'100%',
            }}
            onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLElement).style.background='rgba(16,185,129,0.16)'; (e.currentTarget as HTMLElement).style.borderColor='rgba(16,185,129,0.55)' } }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(16,185,129,0.07)'; (e.currentTarget as HTMLElement).style.borderColor='rgba(16,185,129,0.28)' }}>
            <span style={{ fontSize:28, flexShrink:0 }}>👩‍🏫</span>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:'#E8E4FF', marginBottom:2 }}>I am a Teacher</div>
              <div style={{ fontSize:12, color:'rgba(180,170,255,0.50)' }}>Monitor students, assign work, review progress</div>
            </div>
            {loading ? <Loader2 size={16} style={{ marginLeft:'auto', color:'#34D399', animation:'spin 1s linear infinite', flexShrink:0 }} /> : <ChevronRight size={16} style={{ marginLeft:'auto', color:'rgba(180,170,255,0.30)', flexShrink:0 }} />}
          </button>
        </div>

        <button onClick={onCancel} disabled={loading}
          style={{ width:'100%', background:'none', border:'none', color:'rgba(180,170,255,0.35)',
            fontSize:12, cursor: loading ? 'default' : 'pointer', padding:'6px 0' }}>
          Cancel and sign out
        </button>
        <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}
