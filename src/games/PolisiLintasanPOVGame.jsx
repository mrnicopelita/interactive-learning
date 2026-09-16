import { useCallback, useEffect, useRef, useState } from 'react'

const MAX_TURNS = 10
const GAP = 7
const APPROACH = 3.5
const TURN_DIRS = ['left', 'right', 'left', 'right', 'left', 'right', 'left', 'right', 'left', 'right']
const TURN_POS = Array.from({ length: MAX_TURNS }, (_, i) => 10 + i * GAP)
const WIN_Z = TURN_POS[MAX_TURNS - 1] + 8
const SPEED = 3.2
const STEPS = 50

let audioCtx = null
function ensureCtx() {
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

function playSiren() {
  const ctx = ensureCtx()
  const t = ctx.currentTime
  const o1 = ctx.createOscillator()
  const o2 = ctx.createOscillator()
  const g = ctx.createGain()
  o1.type = 'square'; o2.type = 'square'
  g.gain.setValueAtTime(0.15, t)
  g.gain.linearRampToValueAtTime(0, t + 0.7)
  o1.frequency.setValueAtTime(600, t); o1.frequency.linearRampToValueAtTime(900, t + 0.15); o1.frequency.linearRampToValueAtTime(600, t + 0.3)
  o2.frequency.setValueAtTime(500, t); o2.frequency.linearRampToValueAtTime(800, t + 0.15); o2.frequency.linearRampToValueAtTime(500, t + 0.3)
  o1.connect(g); o2.connect(g); g.connect(ctx.destination)
  o1.start(t); o2.start(t); o1.stop(t + 0.7); o2.stop(t + 0.7)
}

function playFanfare() {
  const ctx = ensureCtx()
  ;[523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5].forEach((f, i) => {
    const t = ctx.currentTime + i * 0.12
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'triangle'; o.frequency.value = f
    g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
    o.connect(g); g.connect(ctx.destination)
    o.start(t); o.stop(t + 0.42)
  })
}

const FEMALE_HINTS = [/female|woman|girl/i, /samantha|susan|karen|moira|tessa|fiona|veena|zira|aria|salli|jenny|amira|michelle|sonia|serena|millie|hayley|linda|julie/i, /google us english|google uk english|natural|online|neural/i]

function pickFemaleVoice() {
  if (!('speechSynthesis' in window)) return null
  const en = window.speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang))
  for (const h of FEMALE_HINTS) { const hit = en.find((v) => h.test(v.name)); if (hit) return hit }
  return en[0] || null
}

function speak(text, opts = {}) {
  if (!('speechSynthesis' in window)) return
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'; u.volume = 1; u.rate = opts.rate ?? 1.3; u.pitch = opts.pitch ?? 1.4
    const v = opts.voice || pickFemaleVoice()
    if (v) u.voice = v
    window.speechSynthesis.speak(u)
  } catch {}
}

function getCurveAt(z) {
  let c = 0
  for (let i = 0; i < MAX_TURNS; i++) {
    const pos = TURN_POS[i]
    const diff = z - pos
    if (diff >= -APPROACH && diff <= 1.2) {
      const p = (diff + APPROACH) / (APPROACH + 1.2)
      const curve = Math.sin(p * Math.PI)
      c += TURN_DIRS[i] === 'left' ? -curve : curve
    }
  }
  return Math.max(-1, Math.min(1, c))
}

function CarDashboard() {
  return (
    <svg viewBox="0 0 400 90" aria-hidden="true" className="h-full w-full" preserveAspectRatio="none">
      <defs><linearGradient id="dgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a1a2e" /><stop offset="100%" stopColor="#0f0f1a" /></linearGradient></defs>
      <rect width="400" height="90" fill="url(#dgrad)" />
      <rect x="20" y="10" width="80" height="55" rx="6" fill="#0d0d1a" stroke="#333" strokeWidth="1.5" />
      <circle cx="60" cy="38" r="22" fill="#111" stroke="#444" strokeWidth="1.5" />
      <circle cx="60" cy="38" r="16" fill="#0a0a12" />
      <text x="60" y="36" textAnchor="middle" fill="#22c55e" fontSize="10" fontFamily="monospace" fontWeight="bold">80</text>
      <text x="60" y="47" textAnchor="middle" fill="#666" fontSize="6" fontFamily="monospace">KM/H</text>
      <rect x="160" y="8" width="80" height="60" rx="6" fill="#111" stroke="#333" strokeWidth="1.5" />
      <rect x="167" y="15" width="66" height="35" rx="3" fill="#0a1628" />
      <text x="200" y="30" textAnchor="middle" fill="#60a5fa" fontSize="7" fontFamily="monospace">PATROLI</text>
      <rect x="172" y="42" width="56" height="2" fill="#1e3a5f" />
      <circle cx="182" cy="43" r="2" fill="#22c55e" />
      <rect x="300" y="10" width="80" height="55" rx="6" fill="#0d0d1a" stroke="#333" strokeWidth="1.5" />
      <rect x="310" y="18" width="25" height="18" rx="2" fill="#1a0a0a" />
      <circle cx="322" cy="27" r="4" fill="#ef4444" opacity="0.4" />
      <rect x="345" y="18" width="25" height="18" rx="2" fill="#0a0a1a" />
      <circle cx="357" cy="27" r="4" fill="#3b82f6" opacity="0.4" />
      <rect x="120" y="70" width="160" height="16" rx="4" fill="#0d0d1a" stroke="#444" strokeWidth="0.8" />
      <rect x="130" y="73" width="20" height="10" rx="2" fill="#22c55e" />
      <rect x="155" y="73" width="20" height="10" rx="2" fill="#ef4444" />
      <rect x="180" y="73" width="30" height="10" rx="2" fill="#3b82f6" />
      <rect x="215" y="73" width="25" height="10" rx="2" fill="#f59e0b" />
    </svg>
  )
}

function SirenLight({ side, active }) {
  const color = side === 'left' ? '#ef4444' : '#3b82f6'
  return (
    <div className="pointer-events-none absolute z-40" style={{ top: -38, left: side === 'left' ? '4%' : 'auto', right: side === 'left' ? 'auto' : '4%', width: '16%', transform: side === 'left' ? 'rotate(-10deg)' : 'rotate(10deg)' }}>
      <div className={`h-auto w-full drop-shadow-[0_6px_6px_rgba(20,15,30,0.25)] ${active ? 'animate-pov-ears-jump' : 'animate-pov-ear-flap'}`}>
        <svg viewBox="0 0 40 150" aria-hidden="true">
          <rect x="8" y="30" width="24" height="100" rx="12" fill="#1a1a2e" stroke="#333" strokeWidth="3" />
          <circle cx="20" cy="45" r="14" fill={color} className={active ? 'siren-light-fast' : 'siren-light'} />
          <circle cx="20" cy="45" r="8" fill="#fff" opacity="0.6" />
          <rect x="6" y="25" width="28" height="10" rx="3" fill="#333" />
        </svg>
      </div>
    </div>
  )
}

export default function PolisiLintasanPOVGame({ onExit }) {
  const [turns, setTurns] = useState(0)
  const [sirenActive, setSirenActive] = useState(false)
  const sirenRef = useRef(false)
  const [turnText, setTurnText] = useState('')
  const [done, setDone] = useState(false)

  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const sizeRef = useRef({ w: 800, h: 600 })
  const zRef = useRef(0)
  const passedRef = useRef(new Set())
  const rafRef = useRef(0)
  const lastRef = useRef(0)
  const tiltRef = useRef({ active: false, t: 0, dir: 'left' })
  const turnTextTimerRef = useRef(null)
  const doneRef = useRef(false)

  const triggerTurn = useCallback((i) => {
    passedRef.current.add(i)
    playSiren()
    const dir = TURN_DIRS[i]
    speak(dir === 'left' ? 'Turn left!' : 'Turn right!', { rate: 1.3, pitch: 1.4 })
    setTurns((j) => j + 1)
    setSirenActive(true)
    sirenRef.current = true
    setTurnText(dir === 'left' ? '← MIRING KIRI!' : 'MIRING KANAN! →')
    tiltRef.current = { active: true, t: 0, dir }
    if (turnTextTimerRef.current) clearTimeout(turnTextTimerRef.current)
    turnTextTimerRef.current = setTimeout(() => setTurnText(''), 1500)
    setTimeout(() => { setSirenActive(false); sirenRef.current = false }, 800)
  }, [])

  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.getVoices()
    const h = () => window.speechSynthesis.getVoices()
    window.speechSynthesis.addEventListener('voiceschanged', h)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', h)
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas) return
    const ctx2d = canvas.getContext('2d')

    const resize = () => {
      const r = stage.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const w = Math.max(1, r.width)
      const h = Math.max(1, r.height)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0)
      sizeRef.current = { w, h }
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(stage)

    function drawFrame(ts) {
      const dt = Math.min(0.05, (ts - lastRef.current) / 1000)
      lastRef.current = ts
      const { w, h } = sizeRef.current
      const horizon = h * 0.34
      const roadBot = h * 0.9

      if (!doneRef.current) zRef.current += SPEED * dt

      const z = zRef.current

      if (z >= WIN_Z && !doneRef.current) {
        doneRef.current = true
        setDone(true)
        playFanfare()
        speak('Patroli selesai! Bagus sekali!', { rate: 1.2, pitch: 1.3 })
      }

      // TILT
      const tilt = tiltRef.current
      let tiltAngle = 0
      if (tilt.active) {
        tilt.t += dt
        const DUR = 0.9
        if (tilt.t >= DUR) { tilt.active = false } else {
          const p = tilt.t / DUR
          tiltAngle = Math.sin(p * Math.PI) * (tilt.dir === 'left' ? -7 : 7)
        }
      }

      ctx2d.save()

      // SKY
      const skyGrad = ctx2d.createLinearGradient(0, 0, 0, horizon)
      skyGrad.addColorStop(0, '#7dd3fc')
      skyGrad.addColorStop(0.5, '#bae6fd')
      skyGrad.addColorStop(1, '#e0f2fe')
      ctx2d.fillStyle = skyGrad
      ctx2d.fillRect(0, 0, w, horizon)

      // SUN
      ctx2d.beginPath()
      ctx2d.arc(w * 0.88, horizon * 0.15, 22, 0, Math.PI * 2)
      ctx2d.fillStyle = '#fde68a'
      ctx2d.fill()
      ctx2d.beginPath()
      ctx2d.arc(w * 0.88, horizon * 0.15, 28, 0, Math.PI * 2)
      ctx2d.fillStyle = 'rgba(253,230,138,0.25)'
      ctx2d.fill()

      // CLOUDS
      const drawCloud = (cx, cy, s) => {
        ctx2d.fillStyle = 'rgba(255,255,255,0.7)'
        ctx2d.beginPath(); ctx2d.arc(cx, cy, 14 * s, 0, Math.PI * 2); ctx2d.fill()
        ctx2d.beginPath(); ctx2d.arc(cx + 16 * s, cy - 4 * s, 18 * s, 0, Math.PI * 2); ctx2d.fill()
        ctx2d.beginPath(); ctx2d.arc(cx + 34 * s, cy, 12 * s, 0, Math.PI * 2); ctx2d.fill()
      }
      const cOff = (z * 3) % (w + 200)
      drawCloud(((200 - cOff) % (w + 200) + w + 200) % (w + 200) - 100, horizon * 0.22, 1.4)
      drawCloud(((600 - cOff * 0.6) % (w + 200) + w + 200) % (w + 200) - 100, horizon * 0.38, 1.1)
      drawCloud(((1000 - cOff * 0.8) % (w + 200) + w + 200) % (w + 200) - 100, horizon * 0.14, 1.6)
      drawCloud(((1400 - cOff * 0.5) % (w + 200) + w + 200) % (w + 200) - 100, horizon * 0.5, 0.9)

      // DISTANT HILLS
      ctx2d.fillStyle = '#16a34a'
      ctx2d.beginPath(); ctx2d.moveTo(0, horizon)
      for (let x = 0; x <= w; x += 40) {
        ctx2d.lineTo(x, horizon - 20 - Math.sin(x * 0.008 + 1) * 25 - Math.sin(x * 0.003) * 15)
      }
      ctx2d.lineTo(w, horizon); ctx2d.closePath(); ctx2d.fill()
      ctx2d.fillStyle = '#15803d'
      ctx2d.beginPath(); ctx2d.moveTo(0, horizon)
      for (let x = 0; x <= w; x += 40) {
        ctx2d.lineTo(x, horizon - 8 - Math.sin(x * 0.012 + 3) * 15 - Math.sin(x * 0.005 + 1) * 10)
      }
      ctx2d.lineTo(w, horizon); ctx2d.closePath(); ctx2d.fill()

      // GRASS
      const grassGrad = ctx2d.createLinearGradient(0, horizon, 0, h)
      grassGrad.addColorStop(0, '#22c55e')
      grassGrad.addColorStop(0.3, '#16a34a')
      grassGrad.addColorStop(0.7, '#15803d')
      grassGrad.addColorStop(1, '#166534')
      ctx2d.fillStyle = grassGrad
      ctx2d.fillRect(0, horizon, w, h - horizon)

      // SAND EDGES
      const sandL = ctx2d.createLinearGradient(0, 0, w * 0.18, 0)
      sandL.addColorStop(0, '#d4a052'); sandL.addColorStop(0.7, '#c29348'); sandL.addColorStop(1, 'rgba(194,147,72,0)')
      ctx2d.fillStyle = sandL
      ctx2d.fillRect(0, horizon, w * 0.18, h - horizon)
      const sandR = ctx2d.createLinearGradient(w, 0, w * 0.82, 0)
      sandR.addColorStop(0, '#d4a052'); sandR.addColorStop(0.7, '#c29348'); sandR.addColorStop(1, 'rgba(194,147,72,0)')
      ctx2d.fillStyle = sandR
      ctx2d.fillRect(w * 0.82, horizon, w * 0.18, h - horizon)

      // ROAD - perspective correct curved rendering
      const curveNow = getCurveAt(z)
      const curveFar = getCurveAt(z + 8)
      const cx = w / 2
      const roadHWBot = w * 0.18
      const roadHWTop = 2

      const leftPts = []
      const rightPts = []
      for (let i = 0; i <= STEPS; i++) {
        const t = i / STEPS
        const y = horizon + (roadBot - horizon) * t
        const perspective = t * t
        const roadHW = roadHWTop + (roadHWBot - roadHWTop) * perspective
        const curveBlend = curveFar + (curveNow - curveFar) * t
        const centerX = cx + curveBlend * w * 0.25 * perspective
        leftPts.push({ x: centerX - roadHW, y })
        rightPts.push({ x: centerX + roadHW, y })
      }

      // Road surface
      ctx2d.beginPath()
      ctx2d.moveTo(leftPts[0].x, leftPts[0].y)
      for (let i = 1; i <= STEPS; i++) ctx2d.lineTo(leftPts[i].x, leftPts[i].y)
      for (let i = STEPS; i >= 0; i--) ctx2d.lineTo(rightPts[i].x, rightPts[i].y)
      ctx2d.closePath()
      const roadGrad = ctx2d.createLinearGradient(0, horizon, 0, roadBot)
      roadGrad.addColorStop(0, '#4b5563')
      roadGrad.addColorStop(0.3, '#374151')
      roadGrad.addColorStop(1, '#1f2937')
      ctx2d.fillStyle = roadGrad
      ctx2d.fill()

      // White edge lines
      ctx2d.strokeStyle = 'rgba(255,255,255,0.7)'
      ctx2d.lineWidth = 2.5
      ctx2d.beginPath()
      leftPts.forEach((p, i) => i === 0 ? ctx2d.moveTo(p.x, p.y) : ctx2d.lineTo(p.x, p.y))
      ctx2d.stroke()
      ctx2d.beginPath()
      rightPts.forEach((p, i) => i === 0 ? ctx2d.moveTo(p.x, p.y) : ctx2d.lineTo(p.x, p.y))
      ctx2d.stroke()

      // Center dashed line
      ctx2d.strokeStyle = 'rgba(255,255,255,0.85)'
      ctx2d.lineWidth = 2
      const dashLen = 0.35
      const gapLen = 0.35
      const segLen = dashLen + gapLen
      const startZ = Math.floor(z / segLen) * segLen
      for (let sz = startZ; sz < z + 10; sz += segLen) {
        const t1 = Math.max(0, (sz - z) / 10)
        const t2 = Math.min(1, (sz + dashLen - z) / 10)
        if (t2 <= 0 || t1 >= 1) continue
        const p1 = (t1 + t2) / 2
        const p2 = t2
        const perspective1 = p1 * p1
        const perspective2 = p2 * p2
        const curveBlend1 = curveFar + (curveNow - curveFar) * p1
        const curveBlend2 = curveFar + (curveNow - curveFar) * p2
        const x1 = cx + curveBlend1 * w * 0.25 * perspective1
        const y1 = horizon + (roadBot - horizon) * p1
        const x2 = cx + curveBlend2 * w * 0.25 * perspective2
        const y2 = horizon + (roadBot - horizon) * p2
        ctx2d.globalAlpha = 0.3 + 0.55 * p1
        ctx2d.beginPath()
        ctx2d.moveTo(x1, y1)
        ctx2d.lineTo(x2, y2)
        ctx2d.stroke()
      }
      ctx2d.globalAlpha = 1

      // SIREN LIGHTS on canvas
      const sirenY = roadBot - 2
      const sirenPulse = sirenRef.current ? (Math.sin(ts * 0.02) > 0 ? 1 : 0.2) : 0.3
      ctx2d.beginPath()
      ctx2d.arc(w * 0.28, sirenY, 6, 0, Math.PI * 2)
      ctx2d.fillStyle = `rgba(239,68,68,${sirenPulse})`
      ctx2d.fill()
      ctx2d.beginPath()
      ctx2d.arc(w * 0.72, sirenY, 6, 0, Math.PI * 2)
      ctx2d.fillStyle = `rgba(59,130,246,${sirenPulse})`
      ctx2d.fill()

      ctx2d.restore()

      // TILT via CSS
      const scene = stageRef.current
      if (scene) scene.style.transform = `rotate(${tiltAngle}deg)`

      rafRef.current = requestAnimationFrame(drawFrame)
    }

    rafRef.current = requestAnimationFrame(drawFrame)
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect() }
  }, [triggerTurn])

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-sky-200">
      <header className="z-30 flex w-full shrink-0 items-center justify-between px-3 py-2 sm:px-5 sm:py-3">
        <button type="button" onClick={onExit} className="rounded-full bg-white/85 px-4 py-2 text-sm font-extrabold text-slate-600 shadow transition hover:scale-105 hover:bg-white sm:px-5 sm:text-base">‹ Keluar</button>
        <h1 className="text-[clamp(1.35rem,4.5vw,2.5rem)] font-black leading-none text-slate-700 drop-shadow-sm"><span aria-hidden="true">🚔</span> POV Polisi Berlari</h1>
        <div className="text-sm font-bold text-sky-700">{turns}/{MAX_TURNS}</div>
      </header>

      <div ref={stageRef} className="relative min-h-0 flex-1 overflow-hidden will-change-transform">
        <canvas ref={canvasRef} className="absolute inset-0" />

        <SirenLight side="left" active={sirenActive} />
        <SirenLight side="right" active={sirenActive} />

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 h-[10vh] min-h-[50px]"><CarDashboard /></div>

        <div className="pointer-events-none absolute inset-0 z-40" style={{ background: 'radial-gradient(ellipse at center, transparent 58%, rgba(10,15,30,0.28) 100%)' }} />

        <div className="pointer-events-none absolute left-3 top-2 z-50 flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1 text-white backdrop-blur-sm">
          <span className="h-2 w-2 animate-alert-pulse rounded-full bg-red-500" />
          <span className="text-[10px] font-black tracking-widest sm:text-xs">PATROLI CAM • REC</span>
        </div>

        {turnText && (
          <div className="animate-pov-splash pointer-events-none absolute left-1/2 top-[35%] z-50 flex -translate-x-1/2 flex-col items-center">
            <span className="text-[clamp(2.5rem,9vw,6rem)] font-black leading-none text-white drop-shadow-[0_6px_0_rgba(2,6,23,0.4)]">{turnText}</span>
          </div>
        )}

        {done && (
          <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle,rgba(255,244,214,0.97)_0%,rgba(253,230,138,0.93)_45%,rgba(245,197,24,0.88)_100%)]">
            <div className="animate-hore-bounce flex items-center gap-2 text-center">
              <span className="text-[clamp(2rem,7vw,4rem)] font-black text-amber-800 drop-shadow-[0_4px_0_rgba(146,64,14,0.35)]">SELESAI!</span>
              <span className="text-[clamp(1.6rem,5vw,3rem)]" aria-hidden="true">🚔</span>
            </div>
            <p className="text-center text-[clamp(1rem,3vw,1.5rem)] font-extrabold text-amber-800">Patroli {MAX_TURNS} tikungan selesai! Kerja bagus! ⭐</p>
            <div className="mt-2 flex gap-3">
              <button type="button" onClick={onExit} className="rounded-full bg-white/85 px-7 py-3 text-lg font-black text-slate-600 shadow-md transition hover:scale-105 sm:text-xl">‹ Keluar</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .siren-light { animation: siren-flash 0.5s ease-in-out infinite; }
        .siren-light-fast { animation: siren-flash 0.15s ease-in-out infinite; }
        @keyframes siren-flash { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
      `}</style>
    </div>
  )
}
