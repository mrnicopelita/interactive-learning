import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'

const MAX_JUMPS = 10
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

const SPEED_LEVELS = [
  { level: 1, label: 'Lambat', emoji: '🐢', factor: 2.2 },
  { level: 2, label: 'Sedang', emoji: '🐇', factor: 3.0 },
  { level: 3, label: 'Cepat', emoji: '🚀', factor: 3.9 },
]

let audioCtx = null

function ensureCtx() {
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

function playBoing() {
  const ctx = ensureCtx()
  const t = ctx.currentTime
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  const f = ctx.createBiquadFilter()
  o.type = 'square'
  o.frequency.setValueAtTime(300, t)
  o.frequency.exponentialRampToValueAtTime(140, t + 0.07)
  o.frequency.exponentialRampToValueAtTime(240, t + 0.13)
  o.frequency.exponentialRampToValueAtTime(130, t + 0.22)
  f.type = 'lowpass'
  f.frequency.value = 900
  g.gain.setValueAtTime(0.16, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.24)
  o.connect(f)
  f.connect(g)
  g.connect(ctx.destination)
  o.start(t)
  o.stop(t + 0.26)
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

function speak(text, opts = {}) {
  if (!('speechSynthesis' in window)) return
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = opts.rate ?? 1.05
    u.pitch = opts.pitch ?? 1.1
    const voice = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang === 'en-US')
    if (voice) u.voice = voice
    window.speechSynthesis.speak(u)
  } catch {
    /* ignore speech errors */
  }
}

const GATES = Array.from({ length: MAX_JUMPS }, (_, i) => D_MAX + i * GAP)
const GOLD_GATE = GATES[MAX_JUMPS - 1] + GAP * 1.45
const TOTAL_Z = GOLD_GATE + 2

const CARROT_AT = Array.from({ length: MAX_JUMPS }, (_, i) => GATES[i] + GAP * 0.52)

const OBSTACLE_ASPECT = [1, 0.75, 0.55, 0.55]
const OBSTACLE_BASE = 0.45
const CARROT_BASE = 0.13

function mod(n, m) {
  return ((n % m) + m) % m
}

function PovStump() {
  return (
    <svg viewBox="0 0 80 60" aria-hidden="true" className="h-full w-full drop-shadow-[0_10px_8px_rgba(30,27,20,0.3)]">
      <rect x="10" y="18" width="60" height="38" rx="10" fill="#7c4a21" />
      <rect x="17" y="22" width="46" height="30" rx="8" fill="#a9742f" />
      <ellipse cx="40" cy="18" rx="30" ry="10" fill="#c89b52" />
      <ellipse cx="40" cy="18" rx="20" ry="6.5" fill="#e6c68f" />
      <ellipse cx="40" cy="18" rx="10" ry="3.5" fill="#f4dfb0" />
    </svg>
  )
}

function PovFence() {
  return (
    <svg viewBox="0 0 120 56" aria-hidden="true" className="h-full w-full drop-shadow-[0_10px_8px_rgba(30,27,20,0.3)]">
      <rect x="8" y="10" width="8" height="44" rx="3" fill="#8a5a2b" />
      <rect x="104" y="10" width="8" height="44" rx="3" fill="#8a5a2b" />
      <rect x="4" y="14" width="112" height="10" rx="5" fill="#c89b52" />
      <rect x="2" y="30" width="116" height="12" rx="6" fill="#a9742f" />
      <rect x="4" y="16" width="110" height="6" rx="3" fill="#e6c68f" />
    </svg>
  )
}

function PovLog() {
  return (
    <svg viewBox="0 0 120 56" aria-hidden="true" className="h-full w-full drop-shadow-[0_10px_8px_rgba(30,27,20,0.3)]">
      <ellipse cx="60" cy="30" rx="56" ry="24" fill="#7c4a21" />
      <ellipse cx="60" cy="24" rx="56" ry="20" fill="#a9742f" />
      <ellipse cx="60" cy="20" rx="50" ry="15" fill="#c89b52" />
      <ellipse cx="60" cy="18" rx="42" ry="10" fill="#e6c68f" />
      <ellipse cx="60" cy="16" rx="34" ry="6" fill="#f4dfb0" />
    </svg>
  )
}

function PovObstacle({ type }) {
  if (type === 'stump') return <PovStump />
  if (type === 'fence') return <PovFence />
  if (type === 'log') return <PovLog />
  return (
    <span aria-hidden="true" style={{ fontSize: '100%', lineHeight: 1 }}>
      🪨
    </span>
  )
}

function PovEar({ side, jumping }) {
  const base = side === 'left' ? 'rotate(-14deg)' : 'rotate(16deg)'
  return (
    <div
      className="pointer-events-none absolute z-40"
      style={{ top: -38, left: side === 'left' ? '4%' : 'auto', right: side === 'left' ? 'auto' : '4%', width: '16%', transform: base }}
    >
      <svg viewBox="0 0 40 150" aria-hidden="true" className={`h-auto w-full drop-shadow-[0_6px_6px_rgba(20,15,30,0.25)] ${jumping ? 'animate-pov-ears-jump' : 'animate-pov-ear-flap'}`}>
        <ellipse cx="20" cy="75" rx="13" ry="70" fill="#ffffff" stroke="#f0cfe0" strokeWidth="5" />
        <ellipse cx="20" cy="75" rx="5.5" ry="48" fill="#ffc9d6" />
      </svg>
    </div>
  )
}

function PovGoldenCarrot({ className = '' }) {
  return (
    <svg viewBox="0 0 240 300" aria-hidden="true" className={className}>
      <path d="M120 238 C 110 190, 88 162, 80 112 C 72 64, 100 40, 120 28 C 140 40, 168 64, 160 112 C 152 162, 130 190, 120 238 Z" fill="#f5c518" stroke="#b45309" strokeWidth="6" strokeLinejoin="round" />
      <path d="M95 120 Q120 128 143 118 M88 148 Q120 158 150 146 M102 178 Q122 186 140 178" stroke="#b45309" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M112 34 C 100 10, 70 6, 60 18 C 58 40, 96 46, 112 40 Z" fill="#22c55e" stroke="#15803d" strokeWidth="4" strokeLinejoin="round" />
      <path d="M122 34 C 130 8, 158 4, 172 16 C 176 38, 140 48, 124 40 Z" fill="#4ade80" stroke="#15803d" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  )
}

function RabbitFur() {
  return (
    <svg viewBox="0 0 400 90" aria-hidden="true" className="h-full w-full" preserveAspectRatio="none">
      <path d="M0 90 Q80 20 200 8 Q320 20 400 90 Z" fill="#ffffff" stroke="#f0cfe0" strokeWidth="4" />
      <path d="M0 90 Q90 34 200 26 Q310 34 400 90 Z" fill="#ffd9e4" opacity="0.8" />
      <ellipse cx="200" cy="6" rx="150" ry="16" fill="#f5e6ee" opacity="0.6" />
    </svg>
  )
}

export default function PovRabbitGame({ onExit }) {
  const [size, setSize] = useState(null)
  const [phase, setPhase] = useState('start')
  const [jumps, setJumps] = useState(0)
  const [picked, setPicked] = useState(0)
  const [speedLevel, setSpeedLevel] = useState(2)
  const [siap, setSiap] = useState(false)
  const [jumpFx, setJumpFx] = useState(0)
  const [landFx, setLandFx] = useState(0)
  const [earJump, setEarJump] = useState(false)
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
  const bounceRef = useRef({ active: false, t: 0 })

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

  const triggerJump = useCallback(
    (i) => {
      passedRef.current.add(i)
      playBoing()
      speak('Jump!', { rate: 1.15, pitch: 1.25 })
      setJumps((j) => j + 1)
      setJumpFx((k) => k + 1)
      setEarJump(true)
      setTimeout(() => setEarJump(false), 620)
      bounceRef.current = { active: true, t: 0 }
      const t = setTimeout(() => setLandFx((k) => k + 1), 250)
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
    if (siap && phase === 'run') speak('Ready!', { rate: 1.0, pitch: 1.0 })
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

      const b = bounceRef.current
      if (b.active) {
        b.t += dt
        const DUR = 0.62
        const scene = sceneRef.current
        if (scene) {
          if (b.t >= DUR) {
            b.active = false
            scene.style.transform = 'translateY(0px)'
          } else {
            const p = b.t / DUR
            const lift = Math.sin(p * Math.PI) * h * 0.09
            const rot = Math.sin(p * Math.PI * 2) * 1.1
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
      for (let i = 0; i < MAX_JUMPS; i++) {
        const d = GATES[i] - z
        const el = obRefs.current.get(i)
        if (el) {
          const visible = d >= D_MIN && d <= maxD
          if (visible) {
            const s = CARROT_SPD / d
            const ti = i % 4
            const sizePx = Math.max(100, h * OBSTACLE_BASE) * s
            const x = w / 2 + LANES[i] * w * (CENTER_K / d)
            const y = yOf(d)
            el.style.display = 'block'
            el.style.left = `${x}px`
            el.style.top = `${y}px`
            el.style.width = `${sizePx}px`
            el.style.height = `${sizePx * OBSTACLE_ASPECT[ti]}px`
            el.style.fontSize = ti === 0 ? `${sizePx}px` : ''
            el.style.opacity = `${0.5 + 0.5 * (1 - d / D_MAX)}`
            el.style.zIndex = Math.round((D_MAX - d) * 10)
          } else {
            el.style.display = 'none'
          }
        }
        if (running) {
          if (!passedRef.current.has(i)) {
            if (d > 0 && d <= SIAP_D && nearIdx === -1) nearIdx = i
            if (d <= PASS_D) triggerJump(i)
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
  }, [triggerJump, winNow, yOf])

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
    bounceRef.current = { active: false, t: 0 }
    setJumps(0)
    setPicked(0)
    setSiap(false)
    setJumpFx(0)
    setLandFx(0)
    setEarJump(false)
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
      const e = ['🌼', '🌸', '🌿', '🍃', '🪻', '🌻'][i % 6]
      list.push({ id: i, x, bottom, e, s: 0.7 + (i % 3) * 0.25 })
    }
    return list
  }, [size])

  return (
    <div className="flex h-dvh w-full touch-manipulation select-none flex-col overflow-hidden bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-200">
      <header className="z-30 flex w-full shrink-0 flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-5 sm:py-3">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full bg-white/85 px-4 py-2 text-sm font-extrabold text-slate-600 shadow transition hover:scale-105 hover:bg-white sm:px-5 sm:text-base"
        >
          ‹ Keluar
        </button>
        <h1 className="text-[clamp(1.35rem,4.5vw,2.5rem)] font-black leading-none text-slate-700 drop-shadow-sm">
          <span aria-hidden="true">🐰</span> POV Kelinci Berlari
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
          <span className="text-xs font-extrabold tracking-wide text-sky-800 uppercase sm:text-sm">Lompatan</span>
          <span className={`text-xl font-black text-sky-800 sm:text-2xl ${jumps > 0 ? 'animate-pop-in' : ''}`}>
            {'🐰'.repeat(Math.max(1, Math.min(3, jumps)))} {jumps}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-extrabold tracking-wide text-emerald-800 uppercase sm:text-sm">Wortel</span>
          <span className={`text-xl font-black text-emerald-700 sm:text-2xl ${picked > 0 ? 'animate-pop-in' : ''}`}>
            🥕 x {picked}
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
          <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-300" />

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
              <path d="M0 40 C 180 10, 300 80, 480 55 C 650 32, 760 90, 960 60 C 1120 38, 1240 78, 1440 45 L 1440 160 L 0 160 Z" fill="#5c8f5a" />
              <path d="M0 110 C 220 70, 420 140, 680 100 C 900 68, 1120 130, 1440 92 L 1440 160 L 0 160 Z" fill="#3f6d46" />
            </svg>
          </div>

          <div className="absolute left-0 right-0" style={{ top: `${horizon}px`, bottom: 0 }}>
            <div
              className="h-full w-full"
              style={{
                background:
                  'linear-gradient(to bottom, #86efac 0%, #4ade80 30%, #22c55e 75%, #16a34a 100%)',
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
              style={{ background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.35) 0 6%, transparent 6% 12%)' }}
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
                style={{ background: 'linear-gradient(to right, #8a6a45, #a9742f 45%, #6b4c2a)' }}
              />
            </span>
          ))}

          {Array.from({ length: MAX_JUMPS }, (_, i) => (
            <span
              key={`ob-${i}`}
              ref={registerOb(i)}
              className="absolute"
              style={{ display: 'none' }}
              aria-hidden="true"
            >
              <PovObstacle type={i % 4 === 0 ? 'rock' : i % 4 === 1 ? 'stump' : i % 4 === 2 ? 'fence' : 'log'} />
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
              🥕
            </span>
          ))}

          <span ref={goldRef} className="absolute" style={{ display: 'none' }} aria-hidden="true">
            <PovGoldenCarrot className="h-auto w-full drop-shadow-[0_16px_24px_rgba(146,64,14,0.45)]" />
          </span>
        </div>

        <PovEar side="left" jumping={earJump} />
        <PovEar side="right" jumping={earJump} />

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 h-[7vh] min-h-[40px]">
          <RabbitFur />
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-40"
          style={{ background: 'radial-gradient(ellipse at center, transparent 58%, rgba(10,15,30,0.28) 100%)' }}
        />

        <div className="pointer-events-none absolute left-3 top-2 z-50 flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1 text-white backdrop-blur-sm">
          <span className="h-2 w-2 animate-alert-pulse rounded-full bg-red-500" />
          <span className="text-[10px] font-black tracking-widest sm:text-xs">KELINCI CAM • REC</span>
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

        {jumpFx > 0 && phase === 'run' && (
          <div
            key={`splash-${jumpFx}`}
            className="animate-pov-splash pointer-events-none absolute left-1/2 top-[38%] z-50 flex -translate-x-1/2 flex-col items-center"
          >
            <span className="text-[clamp(3.5rem,12vw,8rem)] font-black leading-none text-white drop-shadow-[0_6px_0_rgba(2,6,23,0.3)]">
              LOMPAT!
            </span>
            <span className="text-[clamp(2.2rem,7.5vw,4.5rem)]" aria-hidden="true">
              🐰⬆️
            </span>
          </div>
        )}

        {phase === 'start' && (
          <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-[radial-gradient(circle,rgba(240,253,244,0.97)_0%,rgba(187,247,208,0.95)_100%)] px-4">
            <div className="animate-pop-in flex flex-col items-center text-center">
              <span className="text-[clamp(2.5rem,8vw,4rem)]" aria-hidden="true">
                🎥🐰
              </span>
              <h2 className="text-[clamp(1.6rem,5vw,2.6rem)] font-black text-emerald-900">
                GoPro di kepala kelinci!
              </h2>
              <p className="max-w-xl text-[clamp(1rem,3vw,1.35rem)] font-bold text-emerald-800">
                Lihat ladang dari mata kelinci! Saat kelinci{' '}
                <span className="text-amber-600">LOMPAT</span>, kamu juga harus lompat! 🦘
              </p>
              <p className="max-w-xl text-sm font-bold text-emerald-700 sm:text-base">
                Berdiri, tekuk lutut, lalu lompat tinggi bersama si kelinci! Tangkap juga wortel-wortelnya. 🥕
              </p>
            </div>
            <button
              type="button"
              onClick={restart}
              className="animate-pov-replay rounded-full bg-emerald-500 px-10 py-4 text-xl font-black text-white shadow-[0_6px_0_#047857] transition hover:scale-105 sm:text-2xl"
            >
              🏃 Mulai Lari!
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
                🥕
              </span>
            </div>
            <PovGoldenCarrot className="h-auto w-[min(48vw,270px)] drop-shadow-[0_18px_30px_rgba(146,64,14,0.5)]" />
            <p className="animate-pop-in text-center text-[clamp(1rem,3vw,1.5rem)] font-extrabold text-amber-800">
              Kamu menemukan Wortel Emas! 🥕🎉
            </p>
            <p className="-mt-1 text-center text-sm font-extrabold text-amber-700 sm:text-base">
              Kelinci melompat {jumps} kali dan mengumpulkan {picked} wortel!
            </p>
            <p className="text-center text-sm font-extrabold text-amber-700 sm:text-base">
              Kamu juga ikut lompat {jumps} kali, kan? Keren! 💪
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={restart}
                className="rounded-full bg-emerald-500 px-7 py-3 text-lg font-black text-white shadow-[0_5px_0_#047857] transition hover:scale-105 sm:text-xl"
              >
                🐰 Lari Lagi
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
                ▶️ Lanjut Lari!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}