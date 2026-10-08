import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'

/* ============================== config ============================== */
const TOTAL = 12
const LETTERS = ['F', 'G', 'H', 'J']
const FALL_SPEED = 46 // px per second — VERY SLOW for ages 4-5
// next meteor spawns ~1s after a hit (LASER_MS + BOOM_MS + 250ms beat)
const LASER_MS = 280
const BOOM_MS = 550

const COMIC = "'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', system-ui, sans-serif"
const NEON = ['#22d3ee', '#f472b6', '#facc15', '#4ade80', '#a78bfa', '#ffffff']
const RAINBOW = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#22d3ee', '#a78bfa']

function buildSeq(n) {
  // balanced random: every letter appears ~equally, shuffled
  const seq = []
  while (seq.length < n) {
    const bag = [...LETTERS].sort(() => Math.random() - 0.5)
    seq.push(...bag)
  }
  return seq.slice(0, n)
}

/* ============================== audio =============================== */
let audioCtx = null
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}
function tone(freq, dur, vol, type = 'sine', when = 0, slideTo = null) {
  try {
    const ctx = getCtx()
    const t = ctx.currentTime + when
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type
    o.frequency.setValueAtTime(freq, t)
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g); g.connect(ctx.destination)
    o.start(t); o.stop(t + dur + 0.05)
  } catch { /* audio unavailable — stay silent */ }
}
/* crisp laser zap melting into a bright explosion chime */
function playLaserBoom() {
  tone(620, 0.1, 0.1, 'square', 0, 2400)      // laser zap up
  tone(1760, 0.12, 0.12, 'sine', 0.05)        // chime
  tone(2637, 0.22, 0.09, 'sine', 0.1)         // sparkle
  tone(523, 0.3, 0.1, 'triangle', 0.12, 1046) // explosion bloom
  tone(3520, 0.2, 0.05, 'sine', 0.16)
}
/* gentle near-silent nudge for a wrong key — no penalty */
function playSoft() {
  tone(300, 0.14, 0.04, 'sine', 0, 230)
}
function playFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]
  notes.forEach((f, i) => tone(f, 0.46, 0.14, 'triangle', i * 0.11))
  tone(1568, 0.9, 0.11, 'sine', 0.55)
  tone(2093, 0.7, 0.07, 'triangle', 0.6)
}

/* ============================ backdrop ============================== */
function SpaceBackdrop() {
  const stars = useMemo(
    () => Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 8 + Math.random() * 18,
      color: NEON[i % NEON.length],
      ch: ['✦', '✧', '★', '·'][i % 4],
      delay: (i % 13) * 190,
      dur: 2 + (i % 7) * 0.35,
    })),
    [],
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0" style={{
        background:
          'radial-gradient(ellipse 70% 55% at 20% 12%, rgba(124,58,237,0.4), transparent 62%),' +
          'radial-gradient(ellipse 65% 50% at 84% 80%, rgba(14,116,144,0.4), transparent 62%),' +
          'radial-gradient(ellipse 80% 60% at 50% 112%, rgba(244,63,94,0.22), transparent 66%)',
      }} />
      {stars.map((s) => (
        <span key={s.id} className="mrb-twinkle absolute leading-none" style={{
          left: `${s.x}%`, top: `${s.y}%`, color: s.color, fontSize: `${s.size}px`,
          animationDelay: `${s.delay}ms`, animationDuration: `${s.dur}s`,
        }}>{s.ch}</span>
      ))}
    </div>
  )
}

/* ============================== rocket ================================ */
function RocketArt({ zoom }) {
  return (
    <svg viewBox="0 0 140 220" className={`h-full w-full overflow-visible ${zoom ? 'p14-zoom' : 'mrb-bob'}`}>
      <defs>
        <linearGradient id="p14-flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="45%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
        <linearGradient id="p14-hull" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="42%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>
      <g className="mrb-flame">
        <path d="M55 172 C55 192 62 202 70 214 C78 202 85 192 85 172 Z" fill="url(#p14-flame)" opacity="0.95" />
        <path d="M62 172 C62 186 65 193 70 202 C75 193 78 186 78 172 Z" fill="#fffbeb" />
      </g>
      <path d="M44 110 C30 124 24 140 24 158 L46 147 Z" fill="#fb7185" stroke="#be123c" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M96 110 C110 124 116 140 116 158 L94 147 Z" fill="#fb7185" stroke="#be123c" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M70 12 C90 38 98 68 98 84 L98 156 C98 170 86 176 70 176 C54 176 42 170 42 156 L42 84 C42 68 50 38 70 12 Z"
        fill="url(#p14-hull)" stroke="#94a3b8" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M70 12 C90 38 97 66 98 84 L42 84 C43 66 50 38 70 12 Z" fill="#f43f5e" stroke="#be123c" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M42.5 84 L97.5 84 L97.7 98 L42.3 98 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />
      {/* astronaut in porthole */}
      <circle cx="70" cy="126" r="21" fill="#22d3ee" stroke="#0e7490" strokeWidth="4" />
      <circle cx="70" cy="129" r="13" fill="#fde68d" />            {/* face */}
      <path d="M57 124 A13 13 0 0 1 83 124 L83 120 A16 12 0 0 0 57 120 Z" fill="#f8fafc" /> {/* helmet */}
      <circle cx="65" cy="130" r="2.2" fill="#1e293b" />
      <circle cx="75" cy="130" r="2.2" fill="#1e293b" />
      <path d="M65 136 Q70 139 75 136" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="134" r="2.5" fill="#fda4af" opacity="0.9" />
      <circle cx="80" cy="134" r="2.5" fill="#fda4af" opacity="0.9" />
    </svg>
  )
}

/* ============================ key guide =============================== */
const GUIDE = [
  { l: 'F', hand: 'left', color: 'cyan' },
  { l: 'G', hand: 'left', color: 'cyan' },
  { l: 'H', hand: 'right', color: 'yellow' },
  { l: 'J', hand: 'right', color: 'yellow' },
]
function KeyGuide({ target, onTap }) {
  return (
    <div className="pointer-events-auto w-full select-none rounded-2xl border border-cyan-300/20 bg-slate-950/65 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_-8px_24px_rgba(0,0,0,0.45)]">
      <p className="mb-2 text-center text-[11px] font-extrabold tracking-widest text-white/50 uppercase sm:text-xs">
        👈 jari telunjuk kiri <span className="text-cyan-300">F G</span> · <span className="text-yellow-300">H J</span> jari telunjuk kanan 👉
      </p>
      <div className="flex justify-center gap-2 sm:gap-3">
        {GUIDE.map((k) => {
          const isTarget = k.l === target
          const cyan = k.color === 'cyan'
          return (
            <button
              key={k.l}
              type="button"
              onClick={() => onTap?.(k.l)}
              className={`flex h-16 w-16 flex-col items-center justify-center rounded-2xl border-2 font-black transition-all duration-150 sm:h-20 sm:w-20 ${
                isTarget
                  ? cyan
                    ? 'animate-typing-glow border-cyan-200 bg-cyan-400 text-slate-900 scale-110'
                    : 'border-yellow-200 bg-yellow-300 text-slate-900 scale-110 shadow-[0_0_24px_rgba(250,204,21,0.9)]'
                  : cyan
                    ? 'border-cyan-400/50 bg-cyan-400/15 text-cyan-200'
                    : 'border-yellow-300/50 bg-yellow-300/15 text-yellow-200'
              }`}
            >
              <span className="text-3xl leading-none sm:text-4xl">{k.l}</span>
              <span className="mt-1 text-[10px] font-bold opacity-70">{k.hand === 'left' ? '👈' : '👉'}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ============================== shell ================================= */
function Shell({ children, onExit, right }) {
  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950" style={{ fontFamily: COMIC }}>
      <style>{`
        @keyframes p14-rocket-zoom {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          25% { transform: translateY(4%) scale(0.94); opacity: 1; }
          100% { transform: translateY(-160%) scale(0.25); opacity: 0; }
        }
        .p14-zoom { animation: p14-rocket-zoom 1.6s cubic-bezier(0.3,0.7,0.5,1) forwards; }
        @keyframes p14-shield-pulse {
          0%,100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.04); }
        }
        .p14-shield { animation: p14-shield-pulse 2.2s ease-in-out infinite; transform-origin: center; }
        @keyframes p14-dock-bob {
          0%,100% { transform: translateY(-4px); }
          50% { transform: translateY(4px); }
        }
      `}</style>
      <SpaceBackdrop />
      <div className="z-10 flex w-full shrink-0 items-center justify-between gap-2 px-4 pt-3 sm:px-6 sm:pt-4">
        <button type="button" onClick={onExit}
          className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-sm font-extrabold text-indigo-700 shadow transition hover:scale-105 sm:px-4 sm:py-2 sm:text-lg">
          <span aria-hidden="true">←</span> keluar
        </button>
        {right ?? <div className="w-16 sm:w-24" aria-hidden="true" />}
      </div>
      {children}
    </div>
  )
}

function useEnter(onEnter) {
  useEffect(() => {
    const h = (e) => {
      if (e.code === 'Enter' && !e.repeat) { e.preventDefault(); onEnter() }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onEnter])
}

/* ============================ start screen ============================ */
function StartScreen({ onStart, onExit }) {
  useEnter(onStart)
  return (
    <Shell onExit={onExit}>
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-4">
        <div className="animate-pop-in w-full max-w-xl rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-9">
          <div className="mx-auto mb-1 h-28 w-auto sm:h-36" style={{ aspectRatio: '140/220' }}>
            <RocketArt zoom={false} />
          </div>
          <h1 className="text-[clamp(1.5rem,5.5vw,2.4rem)] font-extrabold leading-tight text-slate-700">
            🛡️ perisai <span className="text-rose-500">meteor</span> antariksa
          </h1>
          <p className="mt-1 text-sm font-bold text-slate-500 sm:text-base">
            lindungi roket dari 12 meteor lambat! tekan tombol yang sama dengan huruf di meteor ☄️
          </p>
          <div className="mt-3 flex items-center justify-center gap-2">
            {GUIDE.map((k) => (
              <span key={k.l} className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 text-xl font-black shadow sm:h-13 sm:w-13 sm:text-2xl ${
                k.color === 'cyan' ? 'border-cyan-300 bg-cyan-400 text-slate-900' : 'border-yellow-300 bg-yellow-300 text-slate-900'
              }`}>{k.l}</span>
            ))}
          </div>
          <p className="mt-2 text-xs font-extrabold tracking-wide text-cyan-600 sm:text-sm">
            F G = telunjuk kiri 👈 · H J = telunjuk kanan 👉
          </p>
          <button type="button" onClick={onStart}
            className="mt-4 w-full rounded-full bg-rose-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl">
            mulai main! 🚀
          </button>
          <p className="mt-2 text-xs font-extrabold text-slate-400">
            tekan <span className="rounded-md bg-slate-200 px-1.5 py-0.5 text-slate-500">enter</span> untuk mulai
          </p>
        </div>
      </main>
    </Shell>
  )
}

/* ============================== the game ============================== */
export default function PerisaiMeteorGame({ onExit }) {
  const [screen, setScreen] = useState('entry')
  const [seq] = useState(() => buildSeq(TOTAL))
  const [destroyed, setDestroyed] = useState(0)
  const [target, setTarget] = useState(null)
  const [feedback, setFeedback] = useState(null) // 'benar' | 'coba' | null
  const [shakeKey, setShakeKey] = useState(0)

  const areaRef = useRef(null)
  const canvasRef = useRef(null)
  const timers = useRef(new Set())
  const rafRef = useRef(0)

  // mutable game world — never triggers re-render
  const world = useRef({
    meteor: null,      // { x01, y, letter, docked, dockT }
    laser: null,       // { t0, x0,y0, x1,y1 }
    particles: [],     // { x,y,vx,vy,life,maxLife,color,size,char }
    flash: 0,
  })
  const stateRef = useRef({ screen: 'entry', destroyed: 0, target: null, busy: false })
  stateRef.current = { screen, destroyed, target, busy: stateRef.current.busy }

  const later = useCallback((fn, ms) => {
    const id = setTimeout(() => { timers.current.delete(id); fn() }, ms)
    timers.current.add(id)
    return id
  }, [])
  useEffect(() => {
    const pending = timers.current
    return () => { for (const id of pending) clearTimeout(id); pending.clear(); cancelAnimationFrame(rafRef.current) }
  }, [])

  /* ---------- geometry helpers ---------- */
  const measure = useCallback(() => {
    const area = areaRef.current
    const canvas = canvasRef.current
    if (!area || !canvas) return null
    const r = area.getBoundingClientRect()
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    if (canvas.width !== Math.round(r.width * dpr) || canvas.height !== Math.round(r.height * dpr)) {
      canvas.width = Math.round(r.width * dpr)
      canvas.height = Math.round(r.height * dpr)
    }
    return { w: r.width, h: r.height, dpr }
  }, [])

  const rocketMouth = useCallback(() => {
    const m = measure()
    if (!m) return { x: 0, y: 0 }
    return { x: m.w / 2, y: m.h - 150 }
  }, [measure])

  const shieldY = useCallback(() => {
    const m = measure()
    if (!m) return 0
    return m.h - 210 // meteor rests on top of the glowing shield
  }, [measure])

  const spawnMeteor = useCallback((index) => {
    const letter = seq[index]
    world.current.meteor = {
      x01: 0.22 + Math.random() * 0.56,
      y: -70,
      letter,
      docked: false,
      dockT: 0,
    }
    world.current.laser = null
    world.current.particles = []
    stateRef.current.busy = false
    setTarget(letter)
    setFeedback(null)
  }, [seq])

  const startGame = useCallback(() => {
    setDestroyed(0)
    setScreen('playing')
    later(() => spawnMeteor(0), 350)
  }, [later, spawnMeteor])

  /* ---------- correct-key strike ---------- */
  const strike = useCallback(() => {
    const w = world.current
    const m = w.meteor
    if (!m) return
    const geo = measure()
    if (!geo) return
    const mouth = rocketMouth()
    const mx = m.x01 * geo.w
    const my = m.y
    w.laser = { t0: performance.now(), x0: mouth.x, y0: mouth.y, x1: mx, y1: my }
    // sparkling star particles burst
    const parts = []
    for (let i = 0; i < 70; i++) {
      const a = Math.random() * Math.PI * 2
      const sp = 90 + Math.random() * 320
      parts.push({
        x: mx, y: my,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60,
        life: 0, maxLife: 0.7 + Math.random() * 0.6,
        color: RAINBOW[i % RAINBOW.length],
        size: 5 + Math.random() * 9,
        char: ['★', '✦', '✧', '·'][i % 4],
      })
    }
    // a few letter confetti of the destroyed key
    for (let i = 0; i < 10; i++) {
      parts.push({
        x: mx + (Math.random() - 0.5) * 40, y: my + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 160, vy: -120 - Math.random() * 160,
        life: 0, maxLife: 1.1, color: '#ffffff', size: 14 + Math.random() * 8,
        char: m.letter,
      })
    }
    w.particles = parts
    w.meteor = null // meteor gone — beam + sparkles remain on canvas
    w.flash = performance.now()
    playLaserBoom()
    setFeedback('benar')
    stateRef.current.busy = true
  }, [measure, rocketMouth])

  /* ---------- keyboard ---------- */
  const handlePress = useCallback((raw) => {
    const s = stateRef.current
    if (s.screen !== 'playing' || s.busy) return
    const key = String(raw || '').toUpperCase()
    if (!LETTERS.includes(key)) return // strictly F,G,H,J only
    const meteor = world.current.meteor
    if (!meteor) return
    if (key === meteor.letter) {
      strike()
      const next = s.destroyed + 1
      later(() => {
        if (next >= TOTAL) {
          setDestroyed(next)
          setTarget(null)
          world.current.particles = []
          world.current.laser = null
          setScreen('complete')
          playFanfare()
          const colors = [...RAINBOW, '#ffffff']
          const star = confetti.shapeFromText({ text: '⭐', scalar: 1.8 })
          confetti({ particleCount: 130, angle: 90, spread: 120, startVelocity: 52, gravity: 0.85, origin: { x: 0.5, y: 0.55 }, colors, shapes: [star, 'circle'], scalar: 1.15 })
          setTimeout(() => confetti({ particleCount: 90, angle: 68, spread: 100, origin: { x: 0.05, y: 0.8 }, colors }), 250)
          setTimeout(() => confetti({ particleCount: 90, angle: 112, spread: 100, origin: { x: 0.95, y: 0.8 }, colors }), 380)
        } else {
          setDestroyed(next)
          later(() => spawnMeteor(next), 250) // short beat after boom; total gap ≈ 1s
        }
      }, LASER_MS + BOOM_MS)
    } else {
      // forgiving: soft nudge only, meteor keeps floating
      playSoft()
      setFeedback('coba')
      setShakeKey((k) => k + 1)
      later(() => setFeedback((f) => (f === 'coba' ? null : f)), 600)
    }
  }, [later, spawnMeteor, strike])

  useEffect(() => {
    if (screen !== 'playing') return
    const h = (e) => {
      if (e.repeat) return
      if (e.key.length !== 1) return
      if (!/^[fghj]$/i.test(e.key)) return
      e.preventDefault()
      handlePress(e.key)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [screen, handlePress])

  /* ---------- canvas loop ---------- */
  useEffect(() => {
    if (screen !== 'playing') return
    let last = performance.now()
    const draw = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const canvas = canvasRef.current
      const geo = measure()
      if (!canvas || !geo) { rafRef.current = requestAnimationFrame(draw); return }
      const ctx = canvas.getContext('2d')
      ctx.setTransform(geo.dpr, 0, 0, geo.dpr, 0, 0)
      ctx.clearRect(0, 0, geo.w, geo.h)
      const w = world.current

      // --- update meteor ---
      const m = w.meteor
      if (m) {
        if (!m.docked) {
          m.y += FALL_SPEED * dt
          if (m.y >= shieldY()) {
            // forgiving collision: bounce gently, float in place — NO penalty
            m.y = shieldY()
            m.docked = true
            m.dockT = now
            tone(220, 0.18, 0.05, 'sine', 0, 330) // soft boing
          }
        } else {
          m.dockT += dt * 1000
          m.y = shieldY() + Math.sin(m.dockT / 380) * 6 // gentle hover on shield
        }
      }
      // --- update particles ---
      if (w.particles.length) {
        for (const p of w.particles) {
          p.life += dt
          p.x += p.vx * dt
          p.y += p.vy * dt
          p.vy += 420 * dt // soft gravity
        }
        w.particles = w.particles.filter((p) => p.life < p.maxLife)
      }

      // --- draw rainbow laser beam ---
      if (w.laser) {
        const age = now - w.laser.t0
        if (age < LASER_MS + 120) {
          const alpha = Math.max(0, 1 - age / (LASER_MS + 120))
          const segs = 6
          for (let s = 0; s < segs; s++) {
            const t0 = s / segs, t1 = (s + 1) / segs
            ctx.strokeStyle = RAINBOW[s % RAINBOW.length]
            ctx.globalAlpha = alpha
            ctx.lineWidth = 9 - s * 0.7
            ctx.lineCap = 'round'
            ctx.shadowColor = RAINBOW[s % RAINBOW.length]
            ctx.shadowBlur = 16
            ctx.beginPath()
            ctx.moveTo(
              w.laser.x0 + (w.laser.x1 - w.laser.x0) * t0,
              w.laser.y0 + (w.laser.y1 - w.laser.y0) * t0,
            )
            ctx.lineTo(
              w.laser.x0 + (w.laser.x1 - w.laser.x0) * t1,
              w.laser.y0 + (w.laser.y1 - w.laser.y0) * t1,
            )
            ctx.stroke()
          }
          ctx.shadowBlur = 0
          ctx.globalAlpha = 1
        }
      }

      // --- draw meteor ---
      if (m) {
        const mx = m.x01 * geo.w
        const my = m.y
        const R = 52
        // glow
        const glow = ctx.createRadialGradient(mx, my, R * 0.4, mx, my, R * 2.1)
        glow.addColorStop(0, 'rgba(251,146,60,0.5)')
        glow.addColorStop(1, 'rgba(251,146,60,0)')
        ctx.fillStyle = glow
        ctx.beginPath(); ctx.arc(mx, my, R * 2.1, 0, Math.PI * 2); ctx.fill()
        // rocky body
        const g = ctx.createRadialGradient(mx - 14, my - 16, 8, mx, my, R)
        g.addColorStop(0, '#fed7aa')
        g.addColorStop(0.55, '#c08457')
        g.addColorStop(1, '#7c4a2d')
        ctx.fillStyle = g
        ctx.strokeStyle = '#5b341e'
        ctx.lineWidth = 4
        ctx.beginPath()
        const wob = Math.sin(now / 500) * 2.5
        for (let i = 0; i <= 12; i++) {
          const a = (i / 12) * Math.PI * 2
          const rr = R + Math.sin(a * 3 + 1) * 5 + wob * 0.4
          const px = mx + Math.cos(a) * rr
          const py = my + Math.sin(a) * rr
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
        }
        ctx.closePath(); ctx.fill(); ctx.stroke()
        // craters
        ctx.fillStyle = 'rgba(91,52,30,0.55)'
        ctx.beginPath(); ctx.arc(mx - 20, my - 12, 9, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath(); ctx.arc(mx + 16, my + 18, 11, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath(); ctx.arc(mx + 22, my - 20, 6, 0, Math.PI * 2); ctx.fill()
        // flame trail on top
        ctx.fillStyle = 'rgba(250,204,21,0.75)'
        ctx.beginPath()
        ctx.moveTo(mx - 16, my - R + 4)
        ctx.quadraticCurveTo(mx, my - R - 26 - Math.sin(now / 130) * 7, mx + 16, my - R + 4)
        ctx.closePath(); ctx.fill()
        // big high-contrast letter badge
        ctx.fillStyle = '#ffffff'
        ctx.strokeStyle = '#1e293b'
        ctx.lineWidth = 5
        ctx.beginPath(); ctx.arc(mx, my, 27, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
        ctx.fillStyle = '#0f172a'
        ctx.font = `900 34px ${COMIC}`
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(m.letter, mx, my + 2)
        // docked hint ring
        if (m.docked) {
          ctx.strokeStyle = '#4ade80'
          ctx.lineWidth = 3
          ctx.setLineDash([8, 7])
          ctx.globalAlpha = 0.8
          ctx.beginPath(); ctx.arc(mx, my, R + 14 + Math.sin(now / 300) * 3, 0, Math.PI * 2); ctx.stroke()
          ctx.setLineDash([])
          ctx.globalAlpha = 1
        }
      }

      // --- draw particles ---
      for (const p of w.particles) {
        const k = 1 - p.life / p.maxLife
        ctx.globalAlpha = Math.max(0, k)
        ctx.fillStyle = p.color
        ctx.font = `900 ${p.size}px ${COMIC}`
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(p.char, p.x, p.y)
      }
      ctx.globalAlpha = 1

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [screen, measure, shieldY])

  /* ============================ screens =============================== */
  if (screen === 'entry') return <StartScreen onStart={startGame} onExit={onExit} />

  if (screen === 'complete') {
    return (
      <Shell onExit={onExit}>
        <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-4">
          <div className="animate-pop-in w-full max-w-lg rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-9">
            <div className="mx-auto h-32 w-auto sm:h-40" style={{ aspectRatio: '140/220' }}>
              <RocketArt zoom />
            </div>
            <span className="text-5xl sm:text-6xl" aria-hidden="true">🏆</span>
            <h1 className="mt-1 text-[clamp(1.5rem,5vw,2.3rem)] font-extrabold leading-tight text-slate-700">
              roket selamat! 🎉
            </h1>
            <p className="text-base font-bold text-emerald-600 sm:text-lg">
              kamu menghancurkan {TOTAL} meteor! astronaut bangga padamu! 🚀
            </p>
            <div className="mt-2 flex items-center justify-center gap-1.5" aria-hidden="true">
              {Array.from({ length: TOTAL }, (_, i) => (
                <span key={i} className="mrb-slot-pop text-lg sm:text-xl">⭐</span>
              ))}
            </div>
            <button type="button" onClick={() => { setScreen('entry'); setDestroyed(0); setTarget(null) }}
              className="animate-pov-replay mt-5 w-full rounded-full bg-rose-500 px-8 py-4 text-2xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-3xl">
              MAIN LAGI
            </button>
          </div>
        </main>
      </Shell>
    )
  }

  /* ------------------------------ playing ----------------------------- */
  return (
    <Shell
      onExit={onExit}
      right={
        <div className="text-right">
          <p className="text-[10px] font-extrabold tracking-wide text-cyan-300 sm:text-xs">perisai meteor</p>
          <p className="text-xs font-bold text-white/70">meteor {Math.min(destroyed + 1, TOTAL)} / {TOTAL}</p>
          <p className="text-[10px] font-bold text-amber-300/90 sm:text-xs">⭐ {destroyed}</p>
        </div>
      }
    >
      <main ref={areaRef} className="relative z-10 min-h-0 flex-1">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* progress stars */}
        <div className="pointer-events-none absolute top-1 left-1/2 flex max-w-full -translate-x-1/2 flex-wrap items-center justify-center gap-0.5 px-2" aria-hidden="true">
          {Array.from({ length: TOTAL }, (_, i) => (
            <span key={i} className={`text-sm leading-none sm:text-lg ${i < destroyed ? 'mrb-slot-pop' : 'opacity-25 grayscale'}`}>⭐</span>
          ))}
        </div>

        {/* docked hint */}
        {world.current.meteor?.docked && (
          <div className="pointer-events-none absolute top-[34%] left-1/2 -translate-x-1/2">
            <p className="animate-pop-in rounded-2xl bg-emerald-500/90 px-4 py-1.5 text-center text-sm font-extrabold whitespace-nowrap text-white shadow-md sm:text-base">
              meteor menunggu… tekan {target}! 💚
            </p>
          </div>
        )}

        {/* rocket + glowing forcefield shield */}
        <div className="pointer-events-none absolute bottom-[86px] left-1/2 sm:bottom-[104px]" style={{ transform: 'translateX(-50%)' }}>
          <div className="relative flex items-center justify-center" style={{ width: 190, height: 190 }}>
            {/* shield dome */}
            <svg viewBox="0 0 190 190" className="p14-shield absolute inset-0 h-full w-full">
              <defs>
                <radialGradient id="p14-shield-g" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.05" />
                  <stop offset="72%" stopColor="#22d3ee" stopOpacity="0.12" />
                  <stop offset="88%" stopColor="#22d3ee" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#a5f3fc" stopOpacity="0.9" />
                </radialGradient>
              </defs>
              <circle cx="95" cy="95" r="86" fill="url(#p14-shield-g)" stroke="#67e8f9" strokeWidth="4" />
              <circle cx="95" cy="95" r="86" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.7" strokeDasharray="10 8" />
              <ellipse cx="62" cy="52" rx="26" ry="12" fill="#ffffff" opacity="0.35" transform="rotate(-28 62 52)" />
            </svg>
            <div key={shakeKey} className="h-[104px] w-[64px] sm:h-[120px] sm:w-[74px]">
              <RocketArt zoom={false} />
            </div>
          </div>
        </div>
      </main>

      <div className="z-10 shrink-0 px-4 pb-3 sm:pb-4">
        <div className="flex min-h-8 items-center justify-center">
          <p className="text-center" role="status" aria-live="polite">
            {feedback === 'benar' ? (
              <span className="animate-pop-in rounded-2xl bg-emerald-500/90 px-5 py-1.5 text-base font-extrabold text-white shadow-md sm:text-xl">
                tepat! meteor meledak ✨
              </span>
            ) : feedback === 'coba' ? (
              <span className="animate-pop-in rounded-2xl bg-amber-400/90 px-5 py-1.5 text-base font-extrabold text-slate-900 shadow-md sm:text-xl">
                coba lagi ya! 💫
              </span>
            ) : (
              <span className="text-sm font-bold text-cyan-200 sm:text-base">
                tekan tombol <span className="font-black text-white">{target}</span> di keyboard ⌨️
              </span>
            )}
          </p>
        </div>
        <div className="mt-1">
          <KeyGuide target={stateRef.current.busy ? null : target} onTap={handlePress} />
        </div>
      </div>
    </Shell>
  )
}
