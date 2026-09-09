import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'

const MAX_JUMPS = 5
const RABBIT_X = 0.24
const OBSTACLE_GAP = 1.45
const FIRST_OBSTACLE = 1.2
const FINISH_MULT = 7.9
const GRAVITY = 1200
const JUMP_V = 700
const CARROT_PRE = [0.45, 0.85]

const SPEED_LEVELS = [
  { level: 1, label: 'Lambat', emoji: '🐢', factor: 0.24 },
  { level: 2, label: 'Sedang', emoji: '🐇', factor: 0.32 },
  { level: 3, label: 'Cepat', emoji: '🚀', factor: 0.4 },
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

function playPop() {
  const ctx = ensureCtx()
  const t = ctx.currentTime
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'triangle'
  o.frequency.setValueAtTime(520, t)
  o.frequency.exponentialRampToValueAtTime(260, t + 0.08)
  g.gain.setValueAtTime(0.18, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
  o.connect(g)
  g.connect(ctx.destination)
  o.start(t)
  o.stop(t + 0.14)
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

function RabbitSprite() {
  return (
    <svg viewBox="0 0 220 200" aria-hidden="true" className="h-auto w-full drop-shadow-[0_8px_10px_rgba(30,27,20,0.25)]">
      <ellipse cx="34" cy="146" rx="18" ry="16" fill="#ffffff" stroke="#f0cfe0" strokeWidth="3" />
      <ellipse cx="104" cy="138" rx="56" ry="54" fill="#ffffff" stroke="#f0cfe0" strokeWidth="3" />
      <ellipse cx="92" cy="164" rx="17" ry="22" fill="#ffffff" stroke="#f0cfe0" strokeWidth="3" />
      <ellipse cx="143" cy="186" rx="30" ry="14" fill="#ffffff" stroke="#f0cfe0" strokeWidth="3" />
      <ellipse cx="155" cy="176" rx="13" ry="11" fill="#ffffff" stroke="#f0cfe0" strokeWidth="3" />
      <ellipse cx="108" cy="14" rx="15" ry="46" fill="#ffffff" stroke="#f0cfe0" strokeWidth="3" transform="rotate(-14 108 60)" />
      <ellipse cx="152" cy="10" rx="15" ry="48" fill="#ffffff" stroke="#f0cfe0" strokeWidth="3" transform="rotate(9 152 56)" />
      <ellipse cx="108" cy="20" rx="7" ry="31" fill="#ffc9d6" transform="rotate(-14 108 60)" />
      <ellipse cx="152" cy="16" rx="7" ry="33" fill="#ffc9d6" transform="rotate(9 152 56)" />
      <ellipse cx="138" cy="62" rx="47" ry="44" fill="#ffffff" stroke="#f0cfe0" strokeWidth="3" />
      <circle cx="124" cy="52" r="7.5" fill="#24181d" />
      <circle cx="128" cy="48" r="2.6" fill="#ffffff" />
      <circle cx="153" cy="56" r="7.5" fill="#24181d" />
      <circle cx="157" cy="52" r="2.6" fill="#ffffff" />
      <path d="M152 70 L164 73 L154 78 Z" fill="#ff8fa5" />
      <path d="M163 81 Q169 88 175 81" stroke="#f09bb4" strokeWidth="3" strokeLinecap="round" fill="none" />
      <line x1="170" y1="75" x2="198" y2="71" stroke="#f0cfe0" strokeWidth="3" strokeLinecap="round" />
      <line x1="172" y1="79" x2="200" y2="79" stroke="#f0cfe0" strokeWidth="3" strokeLinecap="round" />
      <line x1="170" y1="84" x2="198" y2="88" stroke="#f0cfe0" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="107" cy="70" rx="8" ry="4.5" fill="#ffb3c0" opacity="0.55" />
      <ellipse cx="150" cy="78" rx="8" ry="4.5" fill="#ffb3c0" opacity="0.55" />
    </svg>
  )
}

function Rock({ h }) {
  return (
    <span
      aria-hidden="true"
      className="block drop-shadow-[0_6px_6px_rgba(30,27,20,0.35)]"
      style={{ fontSize: `${Math.max(46, h * 0.14)}px`, lineHeight: 1 }}
    >
      🪨
    </span>
  )
}

function Stump({ h }) {
  const s = Math.max(54, h * 0.16)
  return (
    <svg
      viewBox="0 0 80 60"
      aria-hidden="true"
      className="drop-shadow-[0_6px_6px_rgba(30,27,20,0.35)]"
      style={{ width: `${s * 1.4}px` }}
    >
      <rect x="10" y="18" width="60" height="38" rx="10" fill="#7c4a21" />
      <rect x="17" y="22" width="46" height="30" rx="8" fill="#a9742f" />
      <ellipse cx="40" cy="18" rx="30" ry="10" fill="#c89b52" />
      <ellipse cx="40" cy="18" rx="20" ry="6.5" fill="#e6c68f" />
      <ellipse cx="40" cy="18" rx="10" ry="3.5" fill="#f4dfb0" />
    </svg>
  )
}

function Obstacle({ type, h }) {
  return type === 'stump' ? <Stump h={h} /> : <Rock h={h} />
}

function GoldenCarrot({ className = '' }) {
  const spikes = useMemo(() => {
    return Array.from({ length: 32 }, (_, i) => {
      const r = i % 2 ? 62 : 138
      const a = (i / 32) * Math.PI * 2
      return `${(120 + Math.cos(a) * r).toFixed(1)},${(150 + Math.sin(a) * r).toFixed(1)}`
    }).join(' ')
  }, [])
  return (
    <svg viewBox="0 0 240 300" aria-hidden="true" className={className}>
      <polygon points={spikes} className="animate-gold-spin" fill="rgba(250,204,21,0.22)" />
      <path d="M120 238 C 110 190, 88 162, 80 112 C 72 64, 100 40, 120 28 C 140 40, 168 64, 160 112 C 152 162, 130 190, 120 238 Z" fill="url(#goldCarrotBody)" stroke="#b45309" strokeWidth="5" strokeLinejoin="round" />
      <path d="M95 120 Q120 128 143 118 M88 148 Q120 158 150 146 M102 178 Q122 186 140 178" stroke="#b45309" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M112 34 C 100 10, 70 6, 60 18 C 58 40, 96 46, 112 40 Z" fill="#22c55e" stroke="#15803d" strokeWidth="4" strokeLinejoin="round" />
      <path d="M122 34 C 130 8, 158 4, 172 16 C 176 38, 140 48, 124 40 Z" fill="#4ade80" stroke="#15803d" strokeWidth="4" strokeLinejoin="round" />
      <path d="M120 42 C 118 30, 114 24, 120 30 C 126 24, 122 30, 120 42 Z" fill="#a3e635" />
      <defs>
        <linearGradient id="goldCarrotBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe066" />
          <stop offset="55%" stopColor="#f5c518" />
          <stop offset="100%" stopColor="#e8a407" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function SpacePrompt({ pressed, urgent, onHit }) {
  return (
    <div
      className="pointer-events-auto flex shrink-0 cursor-pointer flex-col items-center"
      onPointerDown={(e) => {
        e.preventDefault()
        onHit()
      }}
      aria-hidden="true"
    >
      <span
        className={`relative z-10 -mb-4 text-4xl leading-none drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] sm:text-5xl ${urgent ? 'animate-bubble-bob' : 'animate-floaty'}`}
        style={{ transform: 'rotate(14deg)' }}
      >
        👍
      </span>
      <div
        className={`relative flex flex-col items-center rounded-2xl bg-gradient-to-b from-sky-300 to-sky-500 px-6 pb-2 pt-5 shadow-[0_6px_0_#0369a1,0_12px_16px_rgba(2,6,23,0.35)] sm:px-10 ${urgent ? 'animate-spasi-urgent' : 'animate-space-hint'}`}
      >
        <span className="absolute inset-x-4 top-1.5 h-1.5 rounded-full bg-white/40" />
        <span className="text-[clamp(1.15rem,3vw,1.75rem)] font-black leading-none text-white drop-shadow-[0_2px_0_rgba(2,6,23,0.35)]">
          SPACE
        </span>
        <span className="mt-1 flex gap-1.5">
          <span className={`h-2.5 w-9 rounded-full ${pressed ? 'bg-sky-900' : 'bg-sky-700'}`} />
          <span className={`h-2.5 w-9 rounded-full ${pressed ? 'bg-sky-900' : 'bg-sky-700'}`} />
          <span className={`h-2.5 w-9 rounded-full ${pressed ? 'bg-sky-900' : 'bg-sky-700'}`} />
        </span>
      </div>
      <span className="mt-2 text-sm font-extrabold text-sky-800 drop-shadow-sm sm:text-base">
        {urgent ? 'Lompat sekarang!' : 'Tekan untuk melompat'}
      </span>
    </div>
  )
}

export default function KelinciLompatGame({ onExit }) {
  const [size, setSize] = useState(null)
  const [phase, setPhase] = useState('play')
  const [jumps, setJumps] = useState(0)
  const [picked, setPicked] = useState(() => new Set())
  const [pressed, setPressed] = useState(false)
  const [urgent, setUrgent] = useState(false)
  const [popKey, setPopKey] = useState(0)
  const [sparkles, setSparkles] = useState([])
  const [speedLevel, setSpeedLevel] = useState(1)
  const stageRef = useRef(null)
  const worldRef = useRef(null)
  const rabbitRef = useRef(null)
  const rabbitInnerRef = useRef(null)
  const sizeRef = useRef({ w: 1, h: 1 })
  const scrollRef = useRef(0)
  const yRef = useRef(0)
  const vyRef = useRef(0)
  const phaseRef = useRef('play')
  const collectedRef = useRef(new Set())
  const popAtRef = useRef(0)
  const urgentRef = useRef(false)
  const winFiredRef = useRef(false)
  const speedRef = useRef(1)

  const changeSpeed = useCallback((lvl) => {
    speedRef.current = lvl
    setSpeedLevel(lvl)
  }, [])

  const addSparkle = useCallback((emoji, x, y) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setSparkles((s) => [...s, { id, emoji, x, y }])
    setTimeout(() => {
      setSparkles((s) => s.filter((s2) => s2.id !== id))
    }, 850)
  }, [])

  const screenPress = useCallback(() => {
    setPressed(true)
    setTimeout(() => setPressed(false), 160)
  }, [])

  const jump = useCallback(() => {
    if (phaseRef.current === 'win') return
    playBoing()
    screenPress()
    setJumps((j) => Math.min(MAX_JUMPS, j + 1))
    if (vyRef.current > 60) {
      vyRef.current = -JUMP_V * 0.55
    } else {
      vyRef.current = -JUMP_V
    }
    if (yRef.current > -2) yRef.current = -3
  }, [screenPress])

  useEffect(() => {
    const onDown = (e) => {
      if (e.code === 'Space' || e.key === 'Spacebar' || e.key === ' ') {
        e.preventDefault()
        const el = document.activeElement
        if (el && typeof el.blur === 'function') el.blur()
        jump()
      }
    }
    const onUp = (e) => {
      if (e.code === 'Space' || e.key === 'Spacebar' || e.key === ' ') {
        e.preventDefault()
        setPressed(false)
      }
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [jump])

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

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
      const ground = Math.max(70, h * 0.16)
      const rabbitX = RABBIT_X * w
      const winScroll = (FINISH_MULT - RABBIT_X) * w

      if (phaseRef.current !== 'win') {
        const speed = SPEED_LEVELS.find((s) => s.level === speedRef.current) || SPEED_LEVELS[0]
        if (scrollRef.current < winScroll) {
          scrollRef.current = Math.min(winScroll, scrollRef.current + speed.factor * w * dt)
        }
        yRef.current += vyRef.current * dt
        vyRef.current += GRAVITY * dt
        if (yRef.current > 0) {
          yRef.current = 0
          vyRef.current = 0
        }
        const grounded = yRef.current > -6

        let near = false
        for (let i = 0; i < MAX_JUMPS; i++) {
          const o = (FIRST_OBSTACLE + i * OBSTACLE_GAP) * w
          const sx = o - scrollRef.current
          const dist = Math.abs(sx - rabbitX)
          if (grounded && dist < w * 0.05 && ts - popAtRef.current > 380) {
            popAtRef.current = ts
            setPopKey((k) => k + 1)
            playPop()
            addSparkle('💨', sx, ground - 6)
            vyRef.current = -JUMP_V * 0.65
            yRef.current = -4
          }
          if (dist < w * 0.6 && grounded) near = true
        }

        const carrotXs = [...CARROT_PRE]
        for (let i = 0; i < MAX_JUMPS; i++) carrotXs.push((FIRST_OBSTACLE + i * OBSTACLE_GAP + 0.55) * w)
        for (const cx of carrotXs) {
          const key = Math.round(cx)
          if (collectedRef.current.has(key)) continue
          if (Math.abs(cx - scrollRef.current - rabbitX) < w * 0.035) {
            collectedRef.current.add(key)
            setPicked((prev) => new Set(prev).add(key))
            playDing()
            addSparkle('🥕', cx - scrollRef.current, ground - 6)
          }
        }

        if (urgentRef.current !== near) {
          urgentRef.current = near
          setUrgent(near)
        }

        if (scrollRef.current >= winScroll && !winFiredRef.current) {
          winFiredRef.current = true
          setPhase('win')
        }
      }

      if (worldRef.current) {
        worldRef.current.style.transform = `translate3d(${-scrollRef.current}px,0,0)`
      }
      if (rabbitRef.current) {
        const airborne = yRef.current < -2
        const rot = airborne ? -14 : 0
        const sx = airborne ? 1.08 : 1
        const sy = airborne ? 0.92 : 1
        rabbitRef.current.style.transform = `translate(-50%, ${yRef.current}px) rotate(${rot}deg) scale(${sx}, ${sy})`
        rabbitInnerRef.current.classList.toggle('animate-kelinci-bob', !airborne)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [addSparkle])

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

  function restart() {
    scrollRef.current = 0
    yRef.current = 0
    vyRef.current = 0
    collectedRef.current.clear()
    popAtRef.current = 0
    winFiredRef.current = false
    urgentRef.current = false
    setPicked(new Set())
    setJumps(0)
    setSparkles([])
    setPopKey(0)
    setUrgent(false)
    setPhase('play')
  }

  const w = size ? size.w : 1
  const h = size ? size.h : 600
  const ground = Math.max(70, h * 0.16)
  const rabbitX = RABBIT_X * w
  const courseEnd = (FINISH_MULT + 1.2) * w
  const obstacleXs = Array.from({ length: MAX_JUMPS }, (_, i) => ({
    i,
    x: (FIRST_OBSTACLE + i * OBSTACLE_GAP) * w,
    type: i % 2 ? 'stump' : 'rock',
  }))
  const carrotXs = [...CARROT_PRE]
  for (let i = 0; i < MAX_JUMPS; i++) carrotXs.push((FIRST_OBSTACLE + i * OBSTACLE_GAP + 0.55) * w)

  const decor = useMemo(() => {
    if (!size) return []
    const list = []
    for (let i = 0; i < 46; i++) {
      const x = Math.random() * (FINISH_MULT + 2) * size.w
      const e = ['🌼', '⚘', '🌷', '🌿', '🍃', '🌸'][i % 6]
      list.push({ id: i, x, e, s: 0.7 + (i % 3) * 0.25 })
    }
    return list
  }, [size])

  return (
    <div className="flex h-dvh w-full touch-manipulation select-none flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-cyan-50 to-emerald-100">
      <header className="z-20 flex w-full shrink-0 flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-5 sm:py-3">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full bg-white/85 px-4 py-2 text-sm font-extrabold text-slate-600 shadow transition hover:scale-105 hover:bg-white sm:px-5 sm:text-base"
        >
          ‹ Keluar
        </button>
        <h1 className="text-[clamp(1.35rem,4.5vw,2.5rem)] font-black leading-none text-slate-700 drop-shadow-sm">
          <span aria-hidden="true">🐰</span> Kelinci Lompat Space
        </h1>
        <button
          type="button"
          onClick={restart}
          className="rounded-full bg-emerald-500/90 px-4 py-2 text-sm font-extrabold text-white shadow-[0_4px_0_rgba(21,128,61,0.8)] transition hover:scale-105 hover:bg-emerald-500 sm:px-5 sm:text-base"
        >
          🔁 Main Lagi
        </button>
      </header>

      <div className="z-20 flex w-full shrink-0 flex-wrap items-center justify-center gap-x-5 gap-y-1 px-2 py-1 sm:py-2">
        <SpacePrompt pressed={pressed} urgent={urgent} onHit={jump} />
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-extrabold tracking-wide text-sky-800 uppercase sm:text-sm">Lompatan</span>
          <div className="flex items-center gap-1 sm:gap-1.5">
            {Array.from({ length: MAX_JUMPS }, (_, i) => (
              <span
                key={i}
                className={`text-2xl sm:text-3xl ${i < jumps ? 'animate-pop-in' : 'opacity-30 grayscale'}`}
                aria-hidden="true"
              >
                🥕
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-extrabold tracking-wide text-emerald-800 uppercase sm:text-sm">Wortel</span>
          <span className={`text-xl font-black text-emerald-700 sm:text-2xl ${picked.size > 0 ? 'animate-pop-in' : ''}`}>
            🥕 x {picked.size}
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
      </div>

      <div
        ref={stageRef}
        className="relative min-h-0 flex-1 overflow-hidden"
        onPointerDown={() => jump()}
      >
        <span
          aria-hidden="true"
          className="animate-floaty pointer-events-none absolute right-3 top-2 z-[1] select-none text-5xl opacity-90 drop-shadow-[0_0_14px_rgba(250,204,21,0.8)] sm:text-7xl"
          style={{ animationDuration: '9s' }}
        >
          ☀️
        </span>
        {[
          { top: '8%', d: '26s', delay: '0s', s: 'text-4xl sm:text-6xl' },
          { top: '16%', d: '34s', delay: '-12s', s: 'text-5xl sm:text-7xl' },
          { top: '26%', d: '29s', delay: '-24s', s: 'text-3xl sm:text-5xl' },
          { top: '40%', d: '38s', delay: '-6s', s: 'text-4xl sm:text-6xl' },
        ].map((c, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`animate-cloud-drift pointer-events-none absolute left-0 z-[1] select-none opacity-60 ${c.s}`}
            style={{ top: c.top, animationDuration: c.d, animationDelay: c.delay }}
          >
            ☁️
          </span>
        ))}

        <div ref={worldRef} className="pointer-events-none absolute inset-0 z-[2] will-change-transform" style={{ width: `${courseEnd}px` }}>
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${ground}px`,
              background:
                'linear-gradient(to bottom, #4ade80 0%, #22c55e 28%, #16a34a 78%, #15803d 100%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 opacity-40"
            style={{
              height: `${Math.max(10, ground * 0.16)}px`,
              background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0 22px, transparent 22px 44px)',
            }}
          />
          {decor.map((d) => (
            <span
              key={d.id}
              className="absolute select-none"
              style={{ left: `${d.x}px`, bottom: `${ground - 6}px`, fontSize: `${18 * d.s}px` }}
              aria-hidden="true"
            >
              {d.e}
            </span>
          ))}
          {obstacleXs.map((ob) => (
            <span key={ob.i} className="absolute" style={{ left: `${ob.x}px`, bottom: `${ground - 4}px` }}>
              <Obstacle type={ob.type} h={h} />
            </span>
          ))}
          {carrotXs.map((cx, i) =>
            picked.has(Math.round(cx)) ? null : (
              <span
                key={i}
                className="animate-carrot-bob absolute select-none"
                style={{ left: `${cx}px`, bottom: `${ground - 6}px`, fontSize: `${Math.max(46, h * 0.13)}px`, lineHeight: 1 }}
                aria-hidden="true"
              >
                🥕
              </span>
            ),
          )}
          <div className="absolute" style={{ left: `${FINISH_MULT * w}px`, bottom: `${ground - 8}px` }}>
            <GoldenCarrot className="h-auto drop-shadow-[0_16px_24px_rgba(146,64,14,0.45)]" />
            <div className="sr-only">Wortel emas</div>
          </div>
        </div>

        <div
          ref={rabbitRef}
          className="absolute z-[5]"
          style={{ left: `${rabbitX}px`, bottom: `${ground}px`, width: `${Math.max(70, h * 0.13)}px` }}
        >
          <div key={popKey} className={popKey ? 'animate-kelinci-pop' : ''}>
            <div ref={rabbitInnerRef} className="animate-kelinci-bob">
              <RabbitSprite />
            </div>
          </div>
          {urgent && (
            <span className="animate-bubble-bob absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 px-3 py-1 text-sm font-black text-emerald-700 shadow-md sm:text-base">
              Lompat! 🐰
            </span>
          )}
        </div>

        {sparkles.map((s) => (
          <span
            key={s.id}
            className="animate-float-up pointer-events-none absolute z-[6] -translate-x-1/2 text-3xl drop-shadow-md sm:text-4xl"
            style={{ left: `${s.x}px`, bottom: `${s.y}px` }}
            aria-hidden="true"
          >
            {s.emoji}
          </span>
        ))}

        {phase === 'win' && (
          <div className="absolute inset-0 z-[50] flex flex-col items-center justify-center gap-2 bg-[radial-gradient(circle,rgba(255,244,214,0.96)_0%,rgba(253,230,138,0.92)_45%,rgba(245,197,24,0.85)_100%)] px-4">
            <div className="animate-hore-bounce flex items-center gap-2 text-center">
              <span className="text-[clamp(2rem,7vw,4rem)] font-black text-amber-800 drop-shadow-[0_4px_0_rgba(146,64,14,0.35)]">
                HORE!
              </span>
              <span className="text-[clamp(1.6rem,5vw,3rem)]" aria-hidden="true">
                ⭐
              </span>
            </div>
            <GoldenCarrot className="h-auto w-[min(52vw,300px)] drop-shadow-[0_18px_30px_rgba(146,64,14,0.5)]" />
            <p className="animate-pop-in text-center text-[clamp(1rem,3vw,1.6rem)] font-extrabold text-amber-800">
              Kamu menemukan Wortel Emas! 🥕🎉
            </p>
            <p className="-mt-1 text-sm font-extrabold text-amber-700 sm:text-base">
              Setelah {jumps} lompatan dan {picked.size} wortel!
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={restart}
                className="rounded-full bg-emerald-500 px-7 py-3 text-lg font-black text-white shadow-[0_5px_0_#047857] transition hover:scale-105 sm:text-xl"
              >
                🐰 Main Lagi
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
      </div>
    </div>
  )
}