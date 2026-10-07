import { useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'

/* ------------------------------ palette ------------------------------- */
const GOLD = '#facc15'
const GOLD_D = '#ca8a04'
const GOLD_L = '#fef08a'
const CYAN = '#22d3ee'
const CYAN_D = '#0e7490'
const ROCKET = '#f43f5e'
const ROCKET_D = '#be123c'
const INK = '#1e293b'
const HULL_D = '#94a3b8'

const NEON = ['#22d3ee', '#f472b6', '#facc15', '#4ade80', '#a78bfa', '#fef9c3']
const SPARK_CHARS = ['✦', '✧', '★', '✦', '·', '★']
const COMIC = "'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', system-ui, sans-serif"

/* ----------------------------- game data ------------------------------ */
const SEQ_LEN = 30
const ANCHOR_Y = '38%'
const FLIGHT_MS = 640

function buildSeq(letters) {
  const seq = []
  while (seq.length < SEQ_LEN) seq.push(...letters)
  return seq.slice(0, SEQ_LEN)
}

const ROUNDS = [
  {
    name: 'misi jangkar',
    icon: '🪐',
    letters: ['f', 'j'],
    desc: 'bintang f dan j adalah jangkar jarimu!',
  },
].map((r) => ({ ...r, seq: buildSeq(r.letters) }))

/* ------------------------- audio (Web Audio API) ----------------------- */
let audioCtx = null

function getCtx() {
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function tone(freq, dur, vol, type = 'triangle', when = 0, slideTo = null) {
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
  o.connect(g)
  g.connect(ctx.destination)
  o.start(t)
  o.stop(t + dur + 0.05)
}

/* crisp laser zaps into a bright bell chime */
function playLaser() {
  tone(560, 0.09, 0.09, 'square', 0, 2500)
  tone(1760, 0.1, 0.13, 'sine', 0.03)
  tone(2637, 0.22, 0.09, 'sine', 0.07)
  tone(3520, 0.18, 0.045, 'sine', 0.1)
}

/* gentle, near-silent nudge for a wrong key — no penalty, no harsh tone */
function playSoft() {
  tone(320, 0.14, 0.045, 'sine', 0, 250)
}

function playLevelUp() {
  tone(659.25, 0.14, 0.12, 'triangle')
  tone(880, 0.2, 0.12, 'triangle', 0.12)
}

function playWhoosh() {
  tone(140, 1.1, 0.11, 'sawtooth', 0, 46)
  tone(220, 0.85, 0.07, 'triangle', 0.08, 1900)
}

function playFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]
  notes.forEach((f, i) => tone(f, 0.46, 0.15, 'triangle', i * 0.1))
  tone(1568, 0.85, 0.12, 'sine', 0.5)
  tone(2093, 0.7, 0.08, 'triangle', 0.55)
  tone(2637, 0.6, 0.05, 'sine', 0.62)
}

/* --------------------------- svg helpers ------------------------------ */
function starPoints(cx, cy, outer, inner, points = 5, rot = -90) {
  const pts = []
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = ((rot + i * 180) / points) * (Math.PI / 180)
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`)
  }
  return pts.join(' ')
}

const STAR_SHAPE = starPoints(110, 110, 104, 50)

/* ------------------------- art: space backdrop ------------------------ */
function SpaceBackdrop() {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 52 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 9 + Math.random() * 20,
        color: NEON[i % NEON.length],
        ch: SPARK_CHARS[i % SPARK_CHARS.length],
        delay: (i % 13) * 190,
        dur: 2.1 + (i % 7) * 0.32,
      })),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 22% 14%, rgba(124,58,237,0.34), transparent 62%),' +
            'radial-gradient(ellipse 65% 50% at 82% 78%, rgba(14,116,144,0.34), transparent 62%),' +
            'radial-gradient(ellipse 80% 60% at 50% 110%, rgba(244,63,94,0.2), transparent 66%)',
        }}
      />
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="mrb-twinkle absolute leading-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            color: s.color,
            fontSize: `${s.size}px`,
            animationDelay: `${s.delay}ms`,
            animationDuration: `${s.dur}s`,
          }}
        >
          {s.ch}
        </span>
      ))}

      {/* ringed planet */}
      <svg
        className="absolute top-[6%] left-[4%] w-[16%] max-w-[110px] opacity-70 sm:top-[8%] sm:w-[13%]"
        viewBox="0 0 120 120"
      >
        <g className="mrb-ring">
          <ellipse cx="60" cy="60" rx="56" ry="17" fill="none" stroke="#f9a8d4" strokeWidth="5" />
        </g>
        <circle cx="60" cy="60" r="30" fill="#c4b5fd" />
        <circle cx="50" cy="52" r="9" fill="#ddd6fe" opacity="0.8" />
        <circle cx="70" cy="68" r="7" fill="#a78bfa" opacity="0.85" />
        <circle cx="66" cy="46" r="4.5" fill="#ddd6fe" opacity="0.7" />
      </svg>

      {/* moon */}
      <svg
        className="absolute top-[12%] right-[5%] w-[11%] max-w-[80px] opacity-60 sm:top-[16%] sm:w-[9%]"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="38" fill="#e2e8f0" />
        <circle cx="50" cy="50" r="38" fill="#0f172a" opacity="0.42" />
        <circle cx="38" cy="42" r="7" fill="#94a3b8" opacity="0.8" />
        <circle cx="60" cy="62" r="9" fill="#64748b" opacity="0.7" />
      </svg>
    </div>
  )
}

/* ----------------------------- art: rocket ---------------------------- */
function RocketArt() {
  return (
    <svg viewBox="0 0 120 212" className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id="mrb-flame-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="45%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
        <linearGradient id="mrb-hull-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={HULL_D} />
          <stop offset="42%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={HULL_D} />
        </linearGradient>
      </defs>

      {/* exhaust flame */}
      <g className="mrb-flame">
        <path
          d="M45 166 C45 186 52 196 60 208 C68 196 75 186 75 166 Z"
          fill="url(#mrb-flame-grad)"
          opacity="0.95"
        />
        <path d="M52 166 C52 180 55 187 60 196 C65 187 68 180 68 166 Z" fill="#fffbeb" />
      </g>

      {/* fins */}
      <path
        d="M34 104 C20 118 14 134 14 152 L36 141 Z"
        fill="#fb7185"
        stroke={ROCKET_D}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M86 104 C100 118 106 134 106 152 L84 141 Z"
        fill="#fb7185"
        stroke={ROCKET_D}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* hull */}
      <path
        d="M60 10 C80 36 88 66 88 82 L88 150 C88 164 76 170 60 170 C44 170 32 164 32 150 L32 82 C32 66 40 36 60 10 Z"
        fill="url(#mrb-hull-grad)"
        stroke={HULL_D}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* nose cone */}
      <path
        d="M60 10 C80 36 87 64 88 82 L32 82 C33 64 40 36 60 10 Z"
        fill={ROCKET}
        stroke={ROCKET_D}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* gold collar */}
      <path d="M32.5 82 L87.5 82 L87.7 96 L32.3 96 Z" fill={GOLD} stroke={GOLD_D} strokeWidth="2.5" />

      {/* porthole */}
      <circle cx="60" cy="120" r="21" fill={CYAN} stroke={CYAN_D} strokeWidth="4" />
      <ellipse
        cx="51"
        cy="112"
        rx="7"
        ry="5"
        fill="#ffffff"
        opacity="0.7"
        transform="rotate(-28 51 112)"
      />

      {/* cute face */}
      <circle cx="41" cy="150" r="5" fill="#fda4af" opacity="0.9" />
      <circle cx="79" cy="150" r="5" fill="#fda4af" opacity="0.9" />
      <circle cx="50" cy="146" r="4.6" fill={INK} />
      <circle cx="70" cy="146" r="4.6" fill={INK} />
      <circle cx="51.6" cy="144.4" r="1.7" fill="#ffffff" />
      <circle cx="71.6" cy="144.4" r="1.7" fill="#ffffff" />
      <path
        d="M51 156 Q60 164 69 156"
        fill="none"
        stroke={INK}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* ------------------------- on-screen key guide ----------------------- */
const KEY_UNIT = 'min(6.1vw, 6.2vh, 2.9rem)'

const HOME_ROW = [
  { l: 'caps', w: 1.6, mod: true },
  { l: 'a' },
  { l: 's' },
  { l: 'd' },
  { l: 'f' },
  { l: 'j' },
  { l: 'k' },
  { l: 'l' },
  { l: 'enter', w: 1.8, mod: true },
]

function HomeRowGuide({ target, unlocked }) {
  const gap = 'calc(var(--u) * 0.12)'

  return (
    <div
      className="pointer-events-none w-full touch-none select-none rounded-2xl border border-cyan-300/20 bg-slate-950/65 px-2 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_-8px_24px_rgba(0,0,0,0.45)] sm:px-3 sm:py-3"
      style={{ '--u': KEY_UNIT, gap }}
      aria-hidden="true"
    >
      <div className="flex justify-center" style={{ gap }}>
        {HOME_ROW.map((key) => {
          const isTarget = key.l === target
          const isOpen = key.mod || unlocked.has(key.l)
          return (
            <div
              key={key.l}
              className={`flex items-center justify-center rounded-lg border font-extrabold transition-all duration-150 ${
                isTarget
                  ? 'animate-typing-glow border-yellow-200 bg-cyan-400 text-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.85),0_2px_0_rgba(0,0,0,0.35)]'
                  : isOpen
                    ? 'border-white/15 bg-white/12 text-white/85 shadow-[0_2px_0_rgba(0,0,0,0.35)]'
                    : 'border-white/5 bg-white/[0.04] text-white/20 shadow-[0_2px_0_rgba(0,0,0,0.3)]'
              }`}
              style={{
                width: `calc(var(--u) * ${key.w ?? 1})`,
                height: 'var(--u)',
                fontSize: `calc(var(--u) * ${key.mod ? 0.22 : 0.42})`,
              }}
            >
              {key.l}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* -------------------------- star collection meter --------------------- */
function StarMeter({ collected, total }) {
  return (
    <div
      className="flex max-w-full flex-wrap items-center justify-center gap-0.5 sm:gap-1.5 sm:px-2"
      aria-hidden="true"
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`text-sm leading-none sm:text-lg ${i < collected ? 'mrb-slot-pop' : 'opacity-20 grayscale'}`}
        >
          ⭐
        </span>
      ))}
    </div>
  )
}

/* ------------------------------ confetti ------------------------------ */
function spaceConfetti() {
  const colors = [GOLD, CYAN, '#4ade80', '#f472b6', '#a78bfa', '#ffffff']
  const star = confetti.shapeFromText({ text: '⭐', scalar: 1.7 })
  const shapes = [star, 'circle', 'square']
  const cannon = (origin, angle) =>
    confetti({
      particleCount: 80,
      angle,
      spread: 130,
      startVelocity: 52,
      gravity: 0.8,
      origin,
      colors,
      shapes,
      scalar: 1.2,
      ticks: 260,
    })
  cannon({ x: 0.02, y: 0.92 }, 68)
  cannon({ x: 0.98, y: 0.92 }, 112)
  setTimeout(() => cannon({ x: 0.2, y: 0.6 }, 78), 200)
  setTimeout(() => cannon({ x: 0.8, y: 0.6 }, 102), 300)
  setTimeout(
    () =>
      confetti({
        particleCount: 140,
        angle: 90,
        spread: 170,
        startVelocity: 58,
        gravity: 0.85,
        origin: { x: 0.5, y: 0.5 },
        colors,
        shapes,
        scalar: 1.1,
      }),
    400,
  )
  setTimeout(
    () =>
      confetti({
        particleCount: 70,
        angle: 90,
        spread: 180,
        startVelocity: 32,
        gravity: 0.6,
        origin: { x: 0.5, y: 0.1 },
        colors,
        shapes,
        scalar: 1,
      }),
    620,
  )
}

/* ----------------------------- star trail ----------------------------- */
function StarTrail({ trail, flight }) {
  if (!trail.length) return null
  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
      {trail.map((p) => (
        <span
          key={p.id}
          className="mrb-trail"
          style={{
            left: '50%',
            top: ANCHOR_Y,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
            '--dx': `${flight.dx}px`,
            '--dy': `${flight.dy}px`,
            '--ox': `${p.ox}px`,
            '--oy': `${p.oy}px`,
            animationDelay: `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  )
}

function makeTrail(id) {
  return Array.from({ length: 18 }, (_, i) => ({
    id: `${id}-${i}`,
    ox: (Math.random() - 0.5) * 90,
    oy: (Math.random() - 0.5) * 70,
    size: 5 + Math.random() * 9,
    color: NEON[i % NEON.length],
    delay: i * 22,
  }))
}

/* full-menu dialog flow runs on the Enter key alone, so kids never touch the mouse */
function useEnter(onEnter) {
  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Enter' && !e.repeat) {
        e.preventDefault()
        onEnter()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onEnter])
}

/* ----------------------------- screens -------------------------------- */
function Shell({ children, onExit, right }) {
  return (
    <div
      className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950"
      style={{ fontFamily: COMIC }}
    >
      <SpaceBackdrop />
      <div className="z-10 flex w-full shrink-0 items-center justify-between gap-2 px-4 pt-3 sm:px-6 sm:pt-4">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-sm font-extrabold text-indigo-700 shadow transition hover:scale-105 sm:px-4 sm:py-2 sm:text-lg"
        >
          <span aria-hidden="true">←</span> keluar
        </button>
        {right ?? <div className="w-16 sm:w-24" aria-hidden="true" />}
      </div>
      {children}
    </div>
  )
}

function StartScreen({ onStart, onExit }) {
  useEnter(onStart)

  return (
    <Shell onExit={onExit}>
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-4">
        <div className="animate-pop-in w-full max-w-2xl rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-9">
          <div className="mx-auto mb-2 aspect-[120/212] h-24 w-auto sm:h-32">
            <RocketArt />
          </div>
          <h1 className="text-[clamp(1.6rem,5.5vw,2.6rem)] font-extrabold leading-none text-slate-700">
            misi <span className="text-rose-500">roket</span> bintang
          </h1>
          <p className="mt-2 text-sm font-bold text-slate-500 sm:text-base">
            kumpulkan {SEQ_LEN} bintang untuk meluncurkan roketmu! ⭐
          </p>
          <p className="mt-1 text-xs font-extrabold tracking-wide text-cyan-600 sm:text-sm">
            tekan f dan j di keyboard
          </p>

          <div className="mt-4 rounded-2xl bg-indigo-50 p-3 text-left">
            <p className="mb-2 text-center text-xs font-extrabold tracking-wide text-indigo-700">
              1 misi · bintang jangkar
            </p>
            <div className="flex items-center justify-center gap-2">
              {ROUNDS[0].letters.map((l) => (
                <span
                  key={l}
                  className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-cyan-300 bg-cyan-400 text-2xl font-black text-slate-900 shadow sm:h-14 sm:w-14 sm:text-3xl"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="mt-5 w-full rounded-full bg-rose-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl"
          >
            mulai main!
          </button>
          <p className="mt-2 text-xs font-extrabold text-slate-400">
            tekan <span className="rounded-md bg-slate-200 px-1.5 py-0.5 text-slate-500">enter</span> untuk mulai
          </p>
        </div>
      </main>
    </Shell>
  )
}

function MissionIntro({ round, onNext, onExit }) {
  const r = ROUNDS[round]
  useEnter(onNext)

  return (
    <Shell onExit={onExit}>
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-4">
        <div className="animate-pop-in w-full max-w-lg rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-9">
          <span className="text-5xl sm:text-6xl" aria-hidden="true">{r.icon}</span>
          <h1 className="mt-2 text-[clamp(1.4rem,5vw,2.2rem)] font-extrabold text-slate-700">{r.name}</h1>
          <p className="text-base font-bold text-slate-500 sm:text-lg">{r.desc}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {r.letters.map((l) => (
              <span
                key={l}
                className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-cyan-300 bg-cyan-400 text-2xl font-black text-slate-900 shadow sm:h-14 sm:w-14 sm:text-3xl"
              >
                {l}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm font-bold text-slate-400">kumpulkan {SEQ_LEN} bintang!</p>
          <button
            type="button"
            onClick={onNext}
            className="mt-4 w-full rounded-full bg-rose-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl"
          >
            siap! go! 🚀
          </button>
          <p className="mt-2 text-xs font-extrabold text-slate-400">
            tekan <span className="rounded-md bg-slate-200 px-1.5 py-0.5 text-slate-500">enter</span> untuk lanjut
          </p>
        </div>
      </main>
    </Shell>
  )
}

function MissionComplete({ total, onReplay, onExit }) {
  useEnter(onReplay)

  return (
    <Shell onExit={onExit}>
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-4">
        <div className="animate-pop-in w-full max-w-lg rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-9">
          <span className="text-5xl sm:text-6xl" aria-hidden="true">🏆</span>
          <h1 className="mt-2 text-[clamp(1.4rem,5vw,2.2rem)] font-extrabold leading-tight text-slate-700">
            misi selesai!
          </h1>
          <p className="text-base font-bold text-emerald-600 sm:text-lg">
            roket berhasil meluncur! kamu hebat, pilot! 🚀
          </p>
          <p className="mt-1 text-sm font-bold text-slate-400">
            total bintang: <span className="text-amber-500">{total}</span> / {SEQ_LEN}
          </p>
          <div className="mt-2">
            <StarMeter collected={SEQ_LEN} total={SEQ_LEN} />
          </div>

          <button
            type="button"
            onClick={onReplay}
            className="animate-pov-replay mt-5 w-full rounded-full bg-rose-500 px-8 py-4 text-2xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-3xl"
          >
            main lagi
          </button>
          <p className="mt-2 text-xs font-extrabold text-slate-400">
            tekan <span className="rounded-md bg-slate-200 px-1.5 py-0.5 text-slate-500">enter</span> untuk main lagi
          </p>
        </div>
      </main>
    </Shell>
  )
}

/* ------------------------------ the game ------------------------------ */
export default function MisiRoketBintangGame({ onExit }) {
  const [screen, setScreen] = useState('entry')
  const [round, setRound] = useState(0)
  const [step, setStep] = useState(0)
  const [total, setTotal] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [flying, setFlying] = useState(false)
  const [launching, setLaunching] = useState(false)
  const [flight, setFlight] = useState({ dx: 0, dy: 0 })
  const [trail, setTrail] = useState([])
  const [wobbleKey, setWobbleKey] = useState(0)

  const starRef = useRef(null)
  const rocketRef = useRef(null)
  const timers = useRef(new Set())
  const flightId = useRef(0)

  const roundData = ROUNDS[round]
  const target = roundData.seq[step]
  const unlocked = useMemo(() => new Set(roundData.letters), [roundData])

  const later = (fn, ms) => {
    const id = setTimeout(() => {
      timers.current.delete(id)
      fn()
    }, ms)
    timers.current.add(id)
    return id
  }

  useEffect(() => {
    const pending = timers.current
    return () => {
      for (const id of pending) clearTimeout(id)
      pending.clear()
    }
  }, [])

  const stateRef = useRef({})
  stateRef.current = { step, feedback, flying, target }

  function measureFlight() {
    const from = starRef.current?.getBoundingClientRect()
    const to = rocketRef.current?.getBoundingClientRect()
    if (!from || !to) return { dx: 0, dy: 0 }
    return {
      dx: to.left + to.width / 2 - (from.left + from.width / 2),
      dy: to.top + to.height / 2 - (from.top + from.height / 2),
    }
  }

  useEffect(() => {
    if (screen !== 'playing') return

    function finishMission() {
      setLaunching(true)
      playWhoosh()
      later(() => {
        spaceConfetti()
        playFanfare()
      }, 320)
      later(() => setScreen('complete'), 1500)
    }

    const handleKey = (e) => {
      if (e.repeat || e.key.length !== 1 || !/^[a-z]$/i.test(e.key)) return
      e.preventDefault()
      const s = stateRef.current
      if (s.feedback || s.flying) return

      if (e.key.toLowerCase() === s.target) {
        setFeedback('correct')
        setFlight(measureFlight())
        setTrail(makeTrail(flightId.current++))
        setFlying(true)
        setTotal((t) => t + 1)
        playLaser()
        later(() => {
          setFlying(false)
          setFeedback(null)
          setTrail([])
          if (s.step + 1 >= SEQ_LEN) finishMission()
          else setStep(s.step + 1)
        }, FLIGHT_MS)
      } else {
        setFeedback('wrong')
        setWobbleKey((k) => k + 1)
        playSoft()
        later(() => setFeedback(null), 520)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [screen])

  function startRound(idx) {
    setRound(idx)
    setStep(0)
    setFeedback(null)
    setFlying(false)
    setTrail([])
    setLaunching(false)
    setScreen('mission-intro')
  }

  function replay() {
    setRound(0)
    setStep(0)
    setTotal(0)
    setFeedback(null)
    setFlying(false)
    setTrail([])
    setLaunching(false)
    setScreen('playing')
    playLevelUp()
  }

  if (screen === 'entry') {
    return <StartScreen onStart={() => startRound(0)} onExit={onExit} />
  }
  if (screen === 'mission-intro') return <MissionIntro round={round} onNext={() => setScreen('playing')} onExit={onExit} />
  if (screen === 'complete') {
    return <MissionComplete total={total} onReplay={replay} onExit={onExit} />
  }

  return (
    <Shell
      onExit={onExit}
      right={
        <div className="text-right">
          <p className="text-[10px] font-extrabold tracking-wide text-cyan-400 sm:text-xs">
            {roundData.name}
          </p>
          <p className="text-xs font-bold text-white/60">
            bintang {step + 1} / {SEQ_LEN}
          </p>
          <p className="text-[10px] font-bold text-amber-400/80 sm:text-xs">
            total ⭐ {total}
          </p>
        </div>
      }
    >
      <main className="relative z-10 min-h-0 flex-1">
        {/* target star */}
        <div
          className="absolute left-1/2 z-20"
          style={{ top: ANCHOR_Y, height: 'clamp(8rem, 28vh, 14rem)' }}
        >
          <div
            ref={starRef}
            className={`h-full aspect-square ${flying ? 'mrb-star-fly' : ''}`}
            style={{
              '--dx': `${flight.dx}px`,
              '--dy': `${flight.dy}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div key={wobbleKey} className="mrb-wobble h-full w-full">
              <svg
                viewBox="0 0 220 220"
                className="mrb-star-float mrb-star-glow h-full w-full"
              >
                <polygon
                  points={STAR_SHAPE}
                  fill={GOLD}
                  stroke={GOLD_D}
                  strokeWidth="7"
                  strokeLinejoin="round"
                />
                <polygon points={starPoints(110, 110, 78, 38)} fill={GOLD_L} opacity="0.55" />
                <text
                  x="110"
                  y="110"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily={COMIC}
                  fontSize="64"
                  fontWeight="900"
                  fill="#713f12"
                >
                  {target}
                </text>
              </svg>
            </div>
          </div>
        </div>

        <StarTrail trail={trail} flight={flight} />

        {/* rocket */}
        <div
          className="absolute left-1/2 z-10"
          style={{
            bottom: '3%',
            height: 'clamp(6rem, 22vh, 10rem)',
            width: 'clamp(3.4rem, 12.4vh, 5.7rem)',
            transform: 'translateX(-50%)',
          }}
        >
          <div ref={rocketRef} className={`h-full w-full ${launching ? 'mrb-launch' : 'mrb-bob'}`}>
            <RocketArt />
          </div>
        </div>
      </main>

      <div className="z-10 shrink-0 pb-3 sm:pb-4">
        <div className="flex min-h-8 items-center justify-center px-4">
          <p className="text-center" role="status" aria-live="polite">
            {feedback === 'correct' ? (
              <span className="animate-pop-in rounded-2xl bg-emerald-500/90 px-5 py-1.5 text-base font-extrabold text-white shadow-md sm:text-xl">
                tepat! bintang masuk roket ✨
              </span>
            ) : feedback === 'wrong' ? (
              <span className="animate-pop-in rounded-2xl bg-amber-400/90 px-5 py-1.5 text-base font-extrabold text-slate-900 shadow-md sm:text-xl">
                coba lagi ya! 💫
              </span>
            ) : launching ? (
              <span className="text-sm font-extrabold text-rose-300 sm:text-base">
                3… 2… 1… luncur! 🚀
              </span>
            ) : (
              <span className="text-sm font-bold text-cyan-300 sm:text-base">
                tekan tombol{' '}
                <span className="font-black text-white">{target}</span> di keyboard
              </span>
            )}
          </p>
        </div>
        <div className="px-4">
          <StarMeter collected={step + (flying ? 1 : 0)} total={SEQ_LEN} />
        </div>
        <p className="mt-1 text-center text-[10px] font-bold text-white/40 sm:text-xs">
          barisan home row — tekan di keyboard asli ⌨️
        </p>
        <div className="px-4">
          <HomeRowGuide target={flying ? null : target} unlocked={unlocked} />
        </div>
      </div>
    </Shell>
  )
}
