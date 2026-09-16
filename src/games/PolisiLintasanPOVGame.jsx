import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'

const MAX_TURNS = 10
const D_MIN = 0.12
const D_MAX = 8
const GAP = 6.5
const PASS_D = 0.34
const SIAP_D = 3.2
const CARROT_SPD = 0.95
const CENTER_K = 0.28
const POST_K = 0.32

const LANES = [-0.2, -0.07, 0.16, 0.07, -0.16, 0.22, -0.04, 0.12, -0.22, 0.17]
const POST_LANE = 0.46

const TURN_DIRS = ['left', 'right', 'left', 'right', 'left', 'right', 'left', 'right', 'left', 'right']

const SPEED_LEVELS = [
  { level: 1, label: 'Lambat', emoji: '🐢', factor: 2.2 },
  { level: 2, label: 'Sedang', emoji: '🚔', factor: 3.0 },
  { level: 3, label: 'Cepat', emoji: '🚀', factor: 3.9 },
]

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
  o1.type = 'square'
  o2.type = 'square'
  g.gain.setValueAtTime(0.12, t)
  g.gain.linearRampToValueAtTime(0, t + 0.6)
  o1.frequency.setValueAtTime(600, t)
  o1.frequency.linearRampToValueAtTime(900, t + 0.15)
  o1.frequency.linearRampToValueAtTime(600, t + 0.3)
  o2.frequency.setValueAtTime(500, t)
  o2.frequency.linearRampToValueAtTime(800, t + 0.15)
  o2.frequency.linearRampToValueAtTime(500, t + 0.3)
  o1.connect(g)
  o2.connect(g)
  g.connect(ctx.destination)
  o1.start(t)
  o2.start(t)
  o1.stop(t + 0.6)
  o2.stop(t + 0.6)
}

function playDing() {
  const ctx = ensureCtx()
  const t = ctx.currentTime
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(660, t)
  o.frequency.exponentialRampToValueAtTime(1180, t + 0.12)
  g.gain.setValueAtTime(0.2, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
  o.connect(g)
  g.connect(ctx.destination)
  o.start(t)
  o.stop(t + 0.32)
}

function playFanfare() {
  const ctx = ensureCtx()
  ;[523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5].forEach((f, i) => {
    const t = ctx.currentTime + i * 0.12
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'triangle'
    o.frequency.value = f
    g.gain.setValueAtTime(0.2, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
    o.connect(g)
    g.connect(ctx.destination)
    o.start(t)
    o.stop(t + 0.42)
  })
}

const FEMALE_HINTS = [
  /female|woman|girl/i,
  /samantha|susan|karen|moira|tessa|fiona|veena|zira|aria|salli|jenny|amira/i,
  /michelle|sonia|serena|millie|hayley|linda|julie|grover\.?s?/i,
  /google us english|google uk english|natural|online|neural/i,
]

function pickFemaleVoice() {
  if (!('speechSynthesis' in window)) return null
  const english = window.speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang))
  for (const hint of FEMALE_HINTS) {
    const hit = english.find((v) => hint.test(v.name))
    if (hit) return hit
  }
  return english[0] || null
}

function speak(text, opts = {}) {
  if (!('speechSynthesis' in window)) return
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.volume = 1
    u.rate = opts.rate ?? 1.28
    u.pitch = opts.pitch ?? 1.4
    const voice = opts.voice || pickFemaleVoice()
    if (voice) u.voice = voice
    window.speechSynthesis.speak(u)
  } catch {
    /* ignore speech errors */
  }
}

const GATES = Array.from({ length: MAX_TURNS }, (_, i) => D_MAX + i * GAP)
const GOLD_GATE = GATES[MAX_TURNS - 1] + GAP * 1.45
const TOTAL_Z = GOLD_GATE + 2

const CARROT_AT = Array.from({ length: MAX_TURNS }, (_, i) => GATES[i] + GAP * 0.52)

const TURN_ASPECT = [1, 0.8, 0.6, 0.6]
const TURN_BASE = 0.5
const CARROT_BASE = 0.13

function mod(n, m) {
  return ((n % m) + m) % m
}

function TurnSign({ dir }) {
  const isLeft = dir === 'left'
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className="h-full w-full drop-shadow-[0_10px_8px_rgba(0,0,0,0.3)]">
      <polygon points="50,5 95,50 50,95 5,50" fill="#fbbf24" stroke="#b45309" strokeWidth="4" />
      <polygon points="50,15 85,50 50,85 15,50" fill="#f59e0b" />
      {isLeft ? (
        <path d="M65 50 L30 50 M35 35 L20 50 L35 65" stroke="#1a1a2e" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ) : (
        <path d="M35 50 L70 50 M65 35 L80 50 L65 65" stroke="#1a1a2e" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      )}
    </svg>
  )
}

function PovSiren({ side, active }) {
  const base = side === 'left' ? 'rotate(-10deg)' : 'rotate(10deg)'
  const color = side === 'left' ? '#ef4444' : '#3b82f6'
  return (
    <div
      className="pointer-events-none absolute z-40"
      style={{ top: -38, left: side === 'left' ? '4%' : 'auto', right: side === 'left' ? 'auto' : '4%', width: '16%', transform: base }}
    >
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

function PovGoldenBadge({ className = '' }) {
  return (
    <svg viewBox="0 0 240 300" aria-hidden="true" className={className}>
      <circle cx="120" cy="130" r="90" fill="#f5c518" stroke="#b45309" strokeWidth="6" />
      <circle cx="120" cy="130" r="70" fill="#fbbf24" stroke="#b45309" strokeWidth="4" />
      <path d="M120 40 l18 36 40 5 -29 28 7 40 -36 -19 -36 19 7 -40 -29 -28 40 -5 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="3" />
      <text x="120" y="140" textAnchor="middle" fill="#92400e" fontSize="28" fontWeight="bold" fontFamily="sans-serif">POLISI</text>
      <text x="120" y="170" textAnchor="middle" fill="#92400e" fontSize="14" fontFamily="sans-serif">PATROLI</text>
    </svg>
  )
}

function CarDashboard() {
  return (
    <svg viewBox="0 0 400 90" aria-hidden="true" className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="dash-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0f0f1a" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="90" fill="url(#dash-grad)" />
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

export default function PolisiLintasanPOVGame({ onExit }) {
  const [size, setSize] = useState(null)
  const [phase, setPhase] = useState('start')
  const [turns, setTurns] = useState(0)
  const [picked, setPicked] = useState(0)
  const [speedLevel, setSpeedLevel] = useState(2)
  const [siap, setSiap] = useState(false)
  const [turnFx, setTurnFx] = useState(0)
  const [landFx, setLandFx] = useState(0)
  const [sirenActive, setSirenActive] = useState(false)
  const [paused, setPaused] = useState(false)

  const stageRef = useRef(null)
  const sceneRef = useRef(null)
  const obRefs = useRef(new Map())
  const carrotRefs = useRef(new Map())
  const postRefs = useRef(new Map())
  const stripRefs = useRef(new Map())
  const goldRef = useRef(null)
  const sizeRef = useRef({ w: 1, h: 1 })
  const worldZRef = useRef(0)
  const passedRef = useRef(new Set())
  const collectedRef = useRef(new Set())
  const cueIdxRef = useRef(-1)
  const siapRef = useRef(false)
  const winFiredRef = useRef(false)
  const phaseRef = useRef('start')
  const speedRef = useRef(2)
  const pausedRef = useRef(false)
  const landTimersRef = useRef([])
  const tiltRef = useRef({ active: false, t: 0, dir: 'left' })

  const changeSpeed = useCallback((lvl) => {
    speedRef.current = lvl
    setSpeedLevel(lvl)
  }, [])

  const stripCount = 9
  const postCount = 12

  const registerOb = useCallback((i) => (el) => {
    if (el) obRefs.current.set(i, el)
    else obRefs.current.delete(i)
  }, [])
  const registerCarrot = useCallback((i) => (el) => {
    if (el) carrotRefs.current.set(i, el)
    else carrotRefs.current.delete(i)
  }, [])
  const registerPost = useCallback((i) => (el) => {
    if (el) postRefs.current.set(i, el)
    else postRefs.current.delete(i)
  }, [])
  const registerStrip = useCallback((i) => (el) => {
    if (el) stripRefs.current.set(i, el)
    else stripRefs.current.delete(i)
  }, [])

  const yOf = useCallback((d) => {
    const h = sizeRef.current.h
    const horizon = h * 0.34
    return horizon + (h - horizon) * (1 - Math.min(1, d / D_MAX))
  }, [])

  const triggerTurn = useCallback(
    (i) => {
      passedRef.current.add(i)
      playSiren()
      const dir = TURN_DIRS[i % TURN_DIRS.length]
      speak(dir === 'left' ? 'Turn left!' : 'Turn right!', { rate: 1.3, pitch: 1.4 })
      setTurns((j) => j + 1)
      setTurnFx((k) => k + 1)
      setSirenActive(true)
      tiltRef.current = { active: true, t: 0, dir }
      setTimeout(() => setSirenActive(false), 800)
      const t = setTimeout(() => setLandFx((k) => k + 1), 300)
      landTimersRef.current.push(t)
    },
    [],
  )

  const winNow = useCallback(() => {
    if (winFiredRef.current) return
    winFiredRef.current = true
    playDing()
    setPhase('win')
  }, [])

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.getVoices()
    const onVoices = () => window.speechSynthesis.getVoices()
    window.speechSynthesis.addEventListener('voiceschanged', onVoices)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', onVoices)
  }, [])

  useEffect(() => {
    if (siap && phase === 'run') speak('Ready!', { rate: 1.25, pitch: 1.35 })
  }, [siap, phase])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const measure = () => {
      const r = stage.getBoundingClientRect()
      sizeRef.current = { w: Math.max(1, r.width), h: Math.max(1, r.height) }
      setSize(sizeRef.current)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage)

    let raf = 0
    let last = performance.now()

    const tick = (ts) => {
      const dt = Math.min(0.05, (ts - last) / 1000)
      last = ts
      const { w, h } = sizeRef.current
      const horizon = h * 0.34
      const fieldSpan = h - horizon
      const running = phaseRef.current === 'run' && !pausedRef.current

      if (running) {
        const sp = SPEED_LEVELS.find((s) => s.level === speedRef.current).factor
        worldZRef.current = Math.min(TOTAL_Z, worldZRef.current + sp * dt)
      }

      const maxD = D_MAX + 0.5
      const z = worldZRef.current

      const tiltState = tiltRef.current
      if (tiltState.active) {
        tiltState.t += dt
        const DUR = 0.8
        const scene = sceneRef.current
        if (scene) {
          if (tiltState.t >= DUR) {
            tiltState.active = false
            scene.style.transform = 'translateY(0px) rotate(0deg)'
          } else {
            const p = tiltState.t / DUR
            const angle = tiltState.dir === 'left' ? -6 : 6
            const rot = Math.sin(p * Math.PI) * angle
            const lift = Math.sin(p * Math.PI) * h * 0.04
            scene.style.transform = `translateY(${-lift}px) rotate(${rot}deg)`
          }
        }
      }

      for (let i = 0; i < stripCount; i++) {
        const el = stripRefs.current.get(i)
        if (!el) continue
        const d = mod((i * (D_MAX - D_MIN)) / stripCount - z - D_MIN, D_MAX - D_MIN) + D_MIN
        const y = horizon + fieldSpan * (1 - Math.min(1, d / D_MAX))
        const thin = Math.max(2, 3 + h * 0.012 * (1 - d / D_MAX))
        el.style.top = `${y - thin / 2}px`
        el.style.height = `${thin}px`
        el.style.opacity = `${0.18 + 0.5 * (1 - d / D_MAX)}`
        el.style.zIndex = Math.round((D_MAX - d) * 10)
      }

      for (let i = 0; i < postCount * 2; i++) {
        const el = postRefs.current.get(i)
        if (!el) continue
        const side = i % 2 ? 1 : -1
        const d = mod((Math.floor(i / 2) * (D_MAX - D_MIN)) / postCount - z - D_MIN, D_MAX - D_MIN) + D_MIN
        const y = horizon + fieldSpan * (1 - Math.min(1, d / D_MAX))
        const s = Math.min(1.6, CARROT_SPD / d)
        const x = w / 2 + side * POST_LANE * w * (POST_K / d)
        const postW = Math.max(6, w * 0.028 * s)
        el.style.display = 'block'
        el.style.transform = 'translate(-50%, -100%)'
        el.style.left = `${x}px`
        el.style.top = `${y}px`
        el.style.width = `${postW}px`
        el.style.height = `${postW * 2.6}px`
        el.style.opacity = `${0.4 + 0.6 * (1 - d / D_MAX)}`
        el.style.zIndex = Math.round((D_MAX - d) * 10)
      }

      let nearIdx = -1
      for (let i = 0; i < MAX_TURNS; i++) {
        const d = GATES[i] - z
        const el = obRefs.current.get(i)
        if (el) {
          const visible = d >= D_MIN && d <= maxD
          if (visible) {
            const s = CARROT_SPD / d
            const ti = i % 4
            const sizePx = Math.max(100, h * TURN_BASE) * s
            const x = w / 2 + LANES[i] * w * (CENTER_K / d)
            const y = yOf(d)
            el.style.display = 'block'
            el.style.left = `${x}px`
            el.style.top = `${y}px`
            el.style.width = `${sizePx}px`
            el.style.height = `${sizePx * TURN_ASPECT[ti]}px`
            el.style.opacity = `${0.5 + 0.5 * (1 - d / D_MAX)}`
            el.style.zIndex = Math.round((D_MAX - d) * 10)
          } else {
            el.style.display = 'none'
          }
        }
        if (running) {
          if (!passedRef.current.has(i)) {
            if (d > 0 && d <= SIAP_D && nearIdx === -1) nearIdx = i
            if (d <= PASS_D) triggerTurn(i)
          }
        }
      }

      if (nearIdx !== cueIdxRef.current) {
        cueIdxRef.current = nearIdx
        const next = nearIdx >= 0
        if (siapRef.current !== next) {
          siapRef.current = next
          setSiap(next)
        }
      }

      CARROT_AT.forEach((at, i) => {
        const el = carrotRefs.current.get(i)
        if (el) {
          const d = at - z
          const visible = d >= D_MIN && d <= maxD
          if (visible) {
            const s = CARROT_SPD / d
            const lane = (i % 2 === 0 ? -0.3 : 0.32) + ((i % 3) - 1) * 0.09
            const x = w / 2 + lane * w * (CENTER_K / d)
            const y = yOf(d) - h * 0.08
            el.style.display = 'block'
            el.style.left = `${x}px`
            el.style.top = `${y}px`
            el.style.fontSize = `${Math.max(40, h * CARROT_BASE) * s}px`
            el.style.opacity = `${0.55 + 0.45 * (1 - d / D_MAX)}`
            el.style.zIndex = Math.round((D_MAX - d) * 10)
          } else {
            el.style.display = 'none'
          }
        }
        if (running && !collectedRef.current.has(i) && at - z <= D_MIN + 0.2) {
          collectedRef.current.add(i)
          setPicked((p) => p + 1)
          playDing()
        }
      })

      if (goldRef.current) {
        const d = GOLD_GATE - z
        const visible = d >= D_MIN && d <= maxD
        if (visible) {
          const s = CARROT_SPD / d
          const y = yOf(d) - h * 0.2
          goldRef.current.style.display = 'block'
          goldRef.current.style.left = `${w / 2}px`
          goldRef.current.style.top = `${y}px`
          goldRef.current.style.width = `${Math.max(84, h * 0.28) * s}px`
          goldRef.current.style.opacity = `${0.55 + 0.45 * (1 - d / D_MAX)}`
          goldRef.current.style.zIndex = Math.round((D_MAX - d) * 10)
        } else {
          goldRef.current.style.display = 'none'
        }
        if (running && d <= PASS_D) winNow()
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [triggerTurn, winNow, yOf])

  function restart() {
    worldZRef.current = 0
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    passedRef.current.clear()
    collectedRef.current.clear()
    cueIdxRef.current = -1
    siapRef.current = false
    winFiredRef.current = false
    landTimersRef.current.forEach(clearTimeout)
    landTimersRef.current = []
    tiltRef.current = { active: false, t: 0, dir: 'left' }
    setTurns(0)
    setPicked(0)
    setSiap(false)
    setTurnFx(0)
    setLandFx(0)
    setSirenActive(false)
    setPaused(false)
    setPhase('run')
  }

  function togglePause() {
    setPaused((p) => !p)
  }

  useEffect(() => {
    if (phase !== 'win') return
    playFanfare()
    const colors = ['#f5c518', '#ffd93d', '#ffec8a', '#ffb020', '#ffffff', '#fde68a']
    const star = confetti.shapeFromText({ text: '⭐', scalar: 2 })
    const burst = (angle, origin, count) =>
      confetti({
        particleCount: count,
        angle,
        spread: 140,
        startVelocity: 50,
        gravity: 0.9,
        ticks: 260,
        origin,
        colors,
        shapes: [star, 'circle'],
        scalar: 1.2,
      })
    const timers = [
      setTimeout(() => burst(90, { x: 0.5, y: 0.45 }, 130), 200),
      setTimeout(() => burst(60, { x: 0.1, y: 0.9 }, 90), 500),
      setTimeout(() => burst(120, { x: 0.9, y: 0.9 }, 90), 700),
      setTimeout(() => burst(90, { x: 0.5, y: 0.15 }, 110), 950),
    ]
    return () => timers.forEach(clearTimeout)
  }, [phase])

  const h = size ? size.h : 600
  const horizon = h * 0.34

  const decor = useMemo(() => {
    if (!size) return []
    const { w, h: sh } = size
    const list = []
    for (let i = 0; i < 22; i++) {
      const side = i % 2 ? 1 : -1
      const x = w / 2 + side * (w * (0.3 + (i % 4) * 0.09))
      const bottom = sh * 0.42 + (i % 3) * sh * 0.05
      const e = ['🏢', '🏠', '🌳', '🌲', '🏪', '🏬'][i % 6]
      list.push({ id: i, x, bottom, e, s: 0.7 + (i % 3) * 0.25 })
    }
    return list
  }, [size])

  return (
    <div className="flex h-dvh w-full touch-manipulation select-none flex-col overflow-hidden bg-gradient-to-b from-sky-300 via-sky-100 to-slate-300">
      <header className="z-30 flex w-full shrink-0 flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-5 sm:py-3">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full bg-white/85 px-4 py-2 text-sm font-extrabold text-slate-600 shadow transition hover:scale-105 hover:bg-white sm:px-5 sm:text-base"
        >
          ‹ Keluar
        </button>
        <h1 className="text-[clamp(1.35rem,4.5vw,2.5rem)] font-black leading-none text-slate-700 drop-shadow-sm">
          <span aria-hidden="true">🚔</span> POV Polisi Berlari
        </h1>
        <button
          type="button"
          onClick={restart}
          className="rounded-full bg-amber-500/90 px-4 py-2 text-sm font-extrabold text-white shadow-[0_4px_0_rgba(180,83,9,0.8)] transition hover:scale-105 hover:bg-amber-500 sm:px-5 sm:text-base"
        >
          🔁 Ulangi
        </button>
      </header>

      <div className="z-30 flex w-full shrink-0 flex-wrap items-center justify-center gap-x-5 gap-y-1 px-2 py-1 sm:py-2">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-extrabold tracking-wide text-sky-800 uppercase sm:text-sm">Tikungan</span>
          <span className={`text-xl font-black text-sky-800 sm:text-2xl ${turns > 0 ? 'animate-pop-in' : ''}`}>
            {'↩️'.repeat(Math.max(1, Math.min(3, turns)))} {turns}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-extrabold tracking-wide text-emerald-800 uppercase sm:text-sm">Donat</span>
          <span className={`text-xl font-black text-emerald-700 sm:text-2xl ${picked > 0 ? 'animate-pop-in' : ''}`}>
            🍩 x {picked}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-extrabold tracking-wide text-amber-800 uppercase sm:text-sm">Kecepatan</span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {SPEED_LEVELS.map((sl) => (
              <button
                key={sl.level}
                type="button"
                onClick={() => changeSpeed(sl.level)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-black shadow transition sm:px-4 sm:py-2 sm:text-base ${
                  speedLevel === sl.level
                    ? 'scale-105 bg-amber-400 text-white shadow-[0_3px_0_#b45309] ring-2 ring-amber-300'
                    : 'bg-white/90 text-amber-700 hover:scale-105'
                }`}
              >
                <span aria-hidden="true">{sl.emoji}</span>
                {sl.level}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={togglePause}
          className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-black text-slate-600 shadow transition hover:scale-105 sm:px-5 sm:py-2 sm:text-base"
        >
          {paused ? '▶️ Lanjut' : '⏸️ Istirahat'}
        </button>
      </div>

      <div ref={stageRef} className="relative min-h-0 flex-1 overflow-hidden">
        <div ref={sceneRef} className="absolute inset-0 will-change-transform">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-slate-300" />

          <div className="absolute left-0 right-0 top-0" style={{ height: `${horizon}px` }}>
            <span aria-hidden="true" className="animate-floaty absolute right-[6%] top-[6%] text-5xl opacity-90 drop-shadow-[0_0_16px_rgba(250,204,21,0.8)] sm:text-7xl">
              ☀️
            </span>
            {[
              { top: '16%', d: '26s', delay: '0s', s: 'text-4xl sm:text-6xl' },
              { top: '34%', d: '34s', delay: '-12s', s: 'text-5xl sm:text-7xl' },
              { top: '52%', d: '29s', delay: '-24s', s: 'text-3xl sm:text-5xl' },
              { top: '10%', d: '38s', delay: '-6s', s: 'text-4xl sm:text-6xl' },
            ].map((c, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`animate-cloud-drift pointer-events-none absolute left-0 select-none opacity-60 ${c.s}`}
                style={{ top: c.top, animationDuration: c.d, animationDelay: c.delay }}
              >
                ☁️
              </span>
            ))}
            <svg className="absolute bottom-0 left-0 h-24 w-full opacity-70 sm:h-32" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 40 C 180 10, 300 80, 480 55 C 650 32, 760 90, 960 60 C 1120 38, 1240 78, 1440 45 L 1440 160 L 0 160 Z" fill="#6b7280" />
              <path d="M0 110 C 220 70, 420 140, 680 100 C 900 68, 1120 130, 1440 92 L 1440 160 L 0 160 Z" fill="#4b5563" />
            </svg>
          </div>

          <div className="absolute left-0 right-0" style={{ top: `${horizon}px`, bottom: 0 }}>
            <div
              className="h-full w-full"
              style={{
                background:
                  'linear-gradient(to bottom, #6b7280 0%, #4b5563 30%, #374151 75%, #1f2937 100%)',
              }}
            />
          </div>

          {decor.map((d) => (
            <span
              key={d.id}
              className="absolute select-none opacity-80"
              style={{ left: `${d.x}px`, bottom: `${d.bottom}px`, fontSize: `${22 * d.s}px` }}
              aria-hidden="true"
            >
              {d.e}
            </span>
          ))}

          {Array.from({ length: stripCount }, (_, i) => (
            <span
              key={`strip-${i}`}
              ref={registerStrip(i)}
              className="absolute left-0 right-0"
              style={{ background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 6%, transparent 6% 12%)' }}
              aria-hidden="true"
            />
          ))}

          {Array.from({ length: postCount * 2 }, (_, i) => (
            <span
              key={`post-${i}`}
              ref={registerPost(i)}
              className="absolute"
              style={{ display: 'none' }}
              aria-hidden="true"
            >
              <span
                className="block h-full w-full rounded-sm"
                style={{ background: 'linear-gradient(to right, #374151, #6b7280 45%, #1f2937)' }}
              />
            </span>
          ))}

          {Array.from({ length: MAX_TURNS }, (_, i) => (
            <span
              key={`turn-${i}`}
              ref={registerOb(i)}
              className="absolute"
              style={{ display: 'none' }}
              aria-hidden="true"
            >
              <TurnSign dir={TURN_DIRS[i % TURN_DIRS.length]} />
            </span>
          ))}

          {CARROT_AT.map((_, i) => (
            <span
              key={`carrot-${i}`}
              ref={registerCarrot(i)}
              className="animate-carrot-bob absolute"
              style={{ display: 'none', lineHeight: 1 }}
              aria-hidden="true"
            >
              🍩
            </span>
          ))}

          <span ref={goldRef} className="absolute" style={{ display: 'none' }} aria-hidden="true">
            <PovGoldenBadge className="h-auto w-full drop-shadow-[0_16px_24px_rgba(146,64,14,0.45)]" />
          </span>
        </div>

        <PovSiren side="left" active={sirenActive} />
        <PovSiren side="right" active={sirenActive} />

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 h-[10vh] min-h-[50px]">
          <CarDashboard />
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-40"
          style={{ background: 'radial-gradient(ellipse at center, transparent 58%, rgba(10,15,30,0.28) 100%)' }}
        />

        <div className="pointer-events-none absolute left-3 top-2 z-50 flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1 text-white backdrop-blur-sm">
          <span className="h-2 w-2 animate-alert-pulse rounded-full bg-red-500" />
          <span className="text-[10px] font-black tracking-widest sm:text-xs">PATROLI CAM • REC</span>
        </div>

        <div
          key={landFx}
          className="animate-pov-ring pointer-events-none absolute z-30"
          style={{ left: '50%', top: '88%', width: '130%', height: '80%' }}
          aria-hidden="true"
        >
          <div className="h-full w-full rounded-[50%]" style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.08) 55%, transparent 75%)' }} />
        </div>

        {siap && phase === 'run' && (
          <div className="animate-pov-siap pointer-events-none absolute bottom-[10vh] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-400/95 px-6 py-2 text-lg font-black text-white shadow-[0_5px_0_rgba(180,83,9,0.8)] drop-shadow-md sm:text-2xl">
            Bersiap... 💪
          </div>
        )}

        {turnFx > 0 && phase === 'run' && (
          <div
            key={`splash-${turnFx}`}
            className="animate-pov-splash pointer-events-none absolute left-1/2 top-[38%] z-50 flex -translate-x-1/2 flex-col items-center"
          >
            <span className="text-[clamp(3.5rem,12vw,8rem)] font-black leading-none text-white drop-shadow-[0_6px_0_rgba(2,6,23,0.3)]">
              MIRING!
            </span>
            <span className="text-[clamp(2.2rem,7.5vw,4.5rem)]" aria-hidden="true">
              🚔🔄
            </span>
          </div>
        )}

        {phase === 'start' && (
          <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-[radial-gradient(circle,rgba(240,253,244,0.97)_0%,rgba(187,247,208,0.95)_100%)] px-4">
            <div className="animate-pop-in flex flex-col items-center text-center">
              <span className="text-[clamp(2.5rem,8vw,4rem)]" aria-hidden="true">
                🎥🚔
              </span>
              <h2 className="text-[clamp(1.6rem,5vw,2.6rem)] font-black text-emerald-900">
                GoPro di atas mobil polisi!
              </h2>
              <p className="max-w-xl text-[clamp(1rem,3vw,1.35rem)] font-bold text-emerald-800">
                Lihat jalan dari mata mobil polisi! Saat ada tikungan,{' '}
                <span className="text-amber-600">MIRING</span> ke kiri atau kanan! 🔄
              </p>
              <p className="max-w-xl text-sm font-bold text-emerald-700 sm:text-base">
                Berdiri tegak, lalu miringkan tubuhmu mengikuti tikungan! Tangkap juga donatnya. 🍩
              </p>
            </div>
            <button
              type="button"
              onClick={restart}
              className="animate-pov-replay rounded-full bg-emerald-500 px-10 py-4 text-xl font-black text-white shadow-[0_6px_0_#047857] transition hover:scale-105 sm:text-2xl"
            >
              🚔 Mulai Patroli!
            </button>
          </div>
        )}

        {phase === 'win' && (
          <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-2 bg-[radial-gradient(circle,rgba(255,244,214,0.97)_0%,rgba(253,230,138,0.93)_45%,rgba(245,197,24,0.88)_100%)] px-4">
            <div className="animate-hore-bounce flex items-center gap-2 text-center">
              <span className="text-[clamp(2rem,7vw,4rem)] font-black text-amber-800 drop-shadow-[0_4px_0_rgba(146,64,14,0.35)]">
                HORE!
              </span>
              <span className="text-[clamp(1.6rem,5vw,3rem)]" aria-hidden="true">
                🚔
              </span>
            </div>
            <PovGoldenBadge className="h-auto w-[min(48vw,270px)] drop-shadow-[0_18px_30px_rgba(146,64,14,0.5)]" />
            <p className="animate-pop-in text-center text-[clamp(1rem,3vw,1.5rem)] font-extrabold text-amber-800">
              Kamu menemukan Lencana Emas! ⭐🎉
            </p>
            <p className="-mt-1 text-center text-sm font-extrabold text-amber-700 sm:text-base">
              Polisi melewati {turns} tikungan dan mengumpulkan {picked} donat!
            </p>
            <p className="text-center text-sm font-extrabold text-amber-700 sm:text-base">
              Kamu juga ikut miring {turns} kali, kan? Keren! 💪
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={restart}
                className="rounded-full bg-emerald-500 px-7 py-3 text-lg font-black text-white shadow-[0_5px_0_#047857] transition hover:scale-105 sm:text-xl"
              >
                🚔 Patroli Lagi
              </button>
              <button
                type="button"
                onClick={onExit}
                className="rounded-full bg-white/85 px-7 py-3 text-lg font-black text-slate-600 shadow-md transition hover:scale-105 sm:text-xl"
              >
                ‹ Keluar
              </button>
            </div>
          </div>
        )}

        {paused && phase === 'run' && (
          <div className="absolute inset-0 z-[55] flex flex-col items-center justify-center gap-3 bg-slate-900/40 backdrop-blur-[2px]">
            <div className="animate-pop-in flex flex-col items-center gap-4 rounded-3xl bg-white/95 px-8 py-6 text-center shadow-2xl">
              <span className="text-5xl" aria-hidden="true">
                💤
              </span>
              <p className="text-2xl font-black text-slate-700">Waktu Istirahat</p>
              <p className="text-sm font-bold text-slate-500">Ambil napas dulu ya!</p>
              <button
                type="button"
                onClick={togglePause}
                className="rounded-full bg-emerald-500 px-8 py-3 text-lg font-black text-white shadow-[0_5px_0_#047857] transition hover:scale-105"
              >
                ▶️ Lanjut!
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .siren-light { animation: siren-flash 0.5s ease-in-out infinite; }
        .siren-light-fast { animation: siren-flash 0.15s ease-in-out infinite; }
        @keyframes siren-flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  )
}
