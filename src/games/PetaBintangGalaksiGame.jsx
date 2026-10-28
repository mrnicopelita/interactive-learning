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

const NEON = ['#22d3ee', '#f472b6', '#facc15', '#4ade80', '#a78bfa', '#fef9c3']
const SPARK_CHARS = ['✦', '✧', '★', '✦', '·', '★']
const COMIC = "'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', system-ui, sans-serif"

const LETTERS_LANDING = ['f', 'g', 'h', 'j']
const LETTERS_CONST = ['f', 'g', 'h', 'j']
const TOTAL_LANDING = 24
const TOTAL_CONST = 15
const LANDING_PAD_Y = 58

/* Rocket outline nodes (0-100 coordinate space) */
const NODES = [
  [50, 6], [40, 20], [40, 40], [40, 60], [40, 76],
  [15, 91], [42, 87], [50, 96], [58, 87], [85, 91],
  [60, 76], [60, 60], [60, 40], [60, 20], [50, 44]
]

/* ------------------------- audio (Web Audio API) ----------------------- */
let audioCtx = null

function getCtx() {
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function tone(freq, dur, vol, type = 'sine', when = 0, slideTo = null) {
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

function playChime(letter) {
  const base = { f: 1046.5, g: 1174.66, h: 1318.51, j: 1567.98 }[letter] || 1046.5
  tone(base, 0.34, 0.14, 'sine')
  tone(base * 1.5, 0.36, 0.08, 'sine', 0.04)
  tone(base * 2, 0.44, 0.05, 'sine', 0.09)
  tone(base * 4, 0.26, 0.03, 'triangle', 0.14)
}

function playSoft() {
  tone(320, 0.17, 0.05, 'sine', 0, 235)
}

function playWhoosh() {
  tone(240, 0.95, 0.07, 'triangle', 0, 1250)
}

function playFanfare() {
  const run = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.51, 1567.98]
  run.forEach((f, i) => tone(f, 0.3, 0.15, 'triangle', i * 0.1))
  ;[523.25, 659.25, 783.99, 1046.5].forEach((f) => tone(f, 1.5, 0.09, 'sine', 0.86))
  ;[2093, 2637, 3136, 4186].forEach((f, i) => tone(f, 0.5, 0.05, 'sine', 1.0 + i * 0.13))
}

/* ------------------------- helpers ------------------------ */
function makeSequence(letters, total) {
  const seq = []
  for (let i = 0; i < total; i++) {
    const pool = letters.filter((l) => l !== seq[i - 1])
    seq.push(pool[Math.floor(Math.random() * pool.length)])
  }
  letters.forEach((l) => {
    if (seq.includes(l)) return
    for (let k = 0; k < seq.length; k++) {
      if (seq[k] === l) continue
      if (k > 0 && seq[k - 1] === l) continue
      if (k < seq.length - 1 && seq[k + 1] === l) continue
      seq[k] = l
      return
    }
  })
  return seq
}

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

/* ------------------------- backdrop ------------------------ */
function SpaceBackdrop() {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 8 + Math.random() * 18,
        color: NEON[i % NEON.length],
        ch: SPARK_CHARS[i % SPARK_CHARS.length],
        delay: (i % 11) * 180,
        dur: 2 + (i % 6) * 0.3,
      })),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 18% 12%, rgba(124,58,237,0.32), transparent 62%),' +
            'radial-gradient(ellipse 65% 50% at 85% 80%, rgba(34,211,238,0.26), transparent 62%),' +
            'radial-gradient(ellipse 80% 60% at 50% 110%, rgba(244,63,94,0.18), transparent 66%)',
        }}
      />
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="jb-twinkle absolute leading-none"
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
      <svg className="absolute top-[10%] right-[18%] w-[13%] max-w-[100px] opacity-50 sm:top-[14%] sm:w-[11%]" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="30" fill="#c4b5fd" />
        <circle cx="50" cy="52" r="9" fill="#ddd6fe" opacity="0.8" />
        <circle cx="70" cy="68" r="7" fill="#a78bfa" opacity="0.85" />
        <circle cx="66" cy="46" r="4.5" fill="#ddd6fe" opacity="0.7" />
      </svg>
      <svg className="absolute top-[22%] left-[3%] w-[10%] max-w-[74px] opacity-55 sm:top-[26%] sm:w-[8%]" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="38" fill="#e2e8f0" />
        <circle cx="50" cy="50" r="38" fill="#0f172a" opacity="0.4" />
        <circle cx="38" cy="42" r="7" fill="#94a3b8" opacity="0.8" />
        <circle cx="60" cy="62" r="9" fill="#64748b" opacity="0.7" />
      </svg>
    </div>
  )
}

/* ------------------------- key guide ----------------------- */
const KEY_UNIT = 'min(7vw, 6.2vh, 3.4rem)'

const HOME_ROW = [
  { l: 'f', color: CYAN },
  { l: 'g', color: CYAN },
  { l: 'h', color: GOLD },
  { l: 'j', color: GOLD },
]

function HomeRowGuide({ target, active }) {
  return (
    <div
      className="pointer-events-none w-full touch-none select-none rounded-2xl border border-cyan-300/20 bg-slate-950/65 px-2 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_-8px_24px_rgba(0,0,0,0.45)] sm:px-3 sm:py-3"
      style={{ '--u': KEY_UNIT }}
      aria-hidden="true"
    >
      <div className="flex items-center justify-center gap-2 sm:gap-2.5">
        {HOME_ROW.map((key) => {
          const isActive = active.includes(key.l)
          const isTarget = !!(target && key.l === target)
          return (
            <div
              key={key.l}
              className={`flex h-[var(--u)] w-[var(--u)] shrink-0 items-center justify-center rounded-lg border-2 font-extrabold transition-all duration-150 ${
                isTarget ? 'jb-key-target' : ''
              } ${isActive ? '' : 'opacity-25'}`}
              style={{
                color: key.color,
                borderColor: isTarget ? '#ffffff' : `${key.color}66`,
                background: isActive ? `${key.color}26` : 'rgba(255,255,255,0.05)',
                fontSize: `calc(var(--u) * 0.42)`,
              }}
            >
              {key.l}
            </div>
          )
        })}
      </div>
      <div className="mt-1 flex justify-center gap-10 text-[10px] font-bold sm:text-xs">
        <span className="text-cyan-300">telunjuk kiri</span>
        <span className="text-yellow-300">telunjuk kanan</span>
      </div>
    </div>
  )
}

/* ------------------------- screens ------------------------ */
function Shell({ children, onExit }) {
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
        <div className="w-16 sm:w-24" aria-hidden="true" />
      </div>
      {children}
    </div>
  )
}

function StartScreen({ onStart, onExit }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Enter' && !e.repeat) {
        e.preventDefault()
        onStart()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onStart])

  return (
    <Shell onExit={onExit}>
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-4">
        <div className="animate-pop-in w-full max-w-2xl rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-9">
          <div className="mx-auto mb-1 text-5xl sm:text-6xl" aria-hidden="true">🚀</div>
          <h1 className="text-[clamp(1.6rem,5.5vw,2.8rem)] font-extrabold leading-none text-slate-700">
            P15 PETA BINTANG <span className="text-cyan-600">GALAKSI</span>
          </h1>
          <p className="mt-2 text-sm font-bold text-slate-500 sm:text-base">
            Oktober Space Mission · Grand Finale
          </p>
          <p className="mt-3 text-base font-bold text-slate-600 sm:text-lg">
            <b className="text-emerald-600">Level 1:</b> Bantu roket mendarat dengan aman pakai f, g, h, j.{' '}
            <b className="text-amber-600">Level 2:</b> Sambung <b className="text-amber-600">15 bintang</b> jadi konstelasi roket & menangkan{' '}
            <b className="text-rose-600">LENCANA ASTRONAUT CILIK EMAS!</b>
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {LETTERS_CONST.map((l) => (
              <span
                key={l}
                className="flex h-12 w-12 items-center justify-center rounded-xl border-2 text-2xl font-black shadow sm:h-14 sm:w-14 sm:text-3xl"
                style={{
                  color: l === 'f' || l === 'g' ? CYAN : GOLD,
                  borderColor: l === 'f' || l === 'g' ? CYAN : GOLD,
                  background: 'rgba(255,255,255,0.8)',
                }}
              >
                {l}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs font-extrabold text-cyan-600 sm:text-sm">gunakan 4 tombol ajaib: f · g · h · j</p>
          <button
            type="button"
            onClick={onStart}
            className="mt-5 w-full rounded-full bg-rose-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl"
          >
            MULAI MISI
          </button>
          <p className="mt-2 text-xs font-extrabold text-slate-400">
            tekan <span className="rounded-md bg-slate-200 px-1.5 py-0.5 text-slate-500">enter</span> untuk mulai
          </p>
        </div>
      </main>
    </Shell>
  )
}

function WinScreen({ onReplay, onNext, hasNext, level, onExit }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Enter' && !e.repeat) {
        e.preventDefault()
        if (hasNext) onNext()
        else onReplay()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onReplay, onNext, hasNext])

  useEffect(() => {
    // confetti bursts
    const colors = [GOLD, CYAN, '#f472b6', '#4ade80', '#a78bfa', '#ffffff']
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors })
    setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 }, colors }), 200)
    setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 }, colors }), 400)
  }, [])

  return (
    <Shell onExit={onExit}>
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-4">
        <div className="animate-pop-in relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#0b1030] to-[#151b4b] p-6 text-center shadow-lg sm:p-9 border-2 border-yellow-400/40">
          <div className="absolute left-1/2 top-[38%] w-[74%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-gradient from-yellow-400/55 to-transparent animate-pulse" />
          <div className="relative mx-auto mb-4 w-[min(56vw,230px)]">
            <svg viewBox="0 0 240 262" className="w-full h-auto drop-shadow-[0_0_22px_rgba(250,204,21,0.55)] animate-badge-zoom">
              <defs>
                <radialGradient id="medal" cx="34%" cy="26%" r="80%">
                  <stop offset="0%" stopColor="#fff8d6" />
                  <stop offset="42%" stopColor="#ffd83b" />
                  <stop offset="100%" stopColor="#d98a00" />
                </radialGradient>
                <linearGradient id="rib" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#be123c" />
                </linearGradient>
                <radialGradient id="space" cx="50%" cy="38%" r="72%">
                  <stop offset="0%" stopColor="#24306e" />
                  <stop offset="100%" stopColor="#070a1c" />
                </radialGradient>
                <linearGradient id="helm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#c3cedd" />
                </linearGradient>
              </defs>
              <path d="M82 150 L62 248 L102 226 L120 252 L138 226 L178 248 L158 150 Z" fill="url(#rib)" stroke="#881337" strokeWidth="4" strokeLinejoin="round" />
              <circle cx="120" cy="112" r="86" fill="url(#medal)" stroke="#b45309" strokeWidth="6" />
              <circle cx="120" cy="112" r="72" fill="url(#space)" stroke="#fde047" strokeWidth="4" />
              <g fill="#ffffff">
                <circle cx="74" cy="76" r="2.6" />
                <circle cx="167" cy="70" r="2.2" />
                <circle cx="70" cy="142" r="2" />
                <circle cx="170" cy="146" r="2.6" />
                <circle cx="120" cy="52" r="2.4" />
                <circle cx="92" cy="160" r="1.8" />
              </g>
              <path d="M64 60 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" fill="#fde047" />
              <path d="M176 104 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 z" fill="#67e8f9" />
              <g>
                <line x1="120" y1="58" x2="120" y2="46" stroke="#94a3b8" strokeWidth="5" />
                <circle cx="120" cy="41" r="7" fill="#f43f5e" stroke="#9f1239" strokeWidth="3" />
                <path d="M120 62c-26 0-46 20-46 46v12c0 26 20 46 46 46s46-20 46-46v-12c0-26-20-46-46-46z" fill="url(#helm)" stroke="#94a3b8" strokeWidth="5" />
                <rect x="88" y="84" width="64" height="38" rx="19" fill="#0b1026" stroke="#334155" strokeWidth="3" />
                <ellipse cx="103" cy="94" rx="9" ry="5" fill="#67e8f9" opacity=".9" transform="rotate(-24 103 94)" />
                <circle cx="134" cy="113" r="2.6" fill="#fde047" />
                <path d="M110 110 q8 7 16 0" fill="none" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" opacity=".8" />
              </g>
              <rect x="14" y="176" width="212" height="66" rx="20" fill="#fde047" stroke="#b45309" strokeWidth="5" />
              <text x="120" y="203" textAnchor="middle" fontSize="21" fontWeight="900" fill="#7c2d12" fontFamily={COMIC}>
                ASTRONAUT CILIK
              </text>
              <text x="120" y="232" textAnchor="middle" fontSize="24" fontWeight="900" fill="#b45309" fontFamily={COMIC}>
                EMAS
              </text>
            </svg>
          </div>
          <h2 className="text-[clamp(1.4rem,5vw,2.2rem)] font-extrabold bg-gradient-to-b from-[#fffbe6] to-[#f59e0b] bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
            {level === 1 ? 'LEVEL 1 SELESAI!' : 'ASTRONAUT CILIK EMAS'}
          </h2>
          <p className="mt-2 text-base font-bold text-slate-300 sm:text-lg">
            {level === 1 ? 'Roket berhasil mendarat dengan aman! Lanjut ke Level 2!' : 'Konstelasi roket menyala sempurna — 15 bintang tersambung!'}
          </p>
          <div className="mt-2 text-xl sm:text-2xl">⭐ ⭐ ⭐ ⭐ ⭐</div>
          {hasNext ? (
            <>
              <button
                type="button"
                onClick={onNext}
                className="mt-5 w-full rounded-full bg-gradient-to-b from-emerald-300 to-emerald-500 px-8 py-4 text-2xl font-extrabold text-emerald-900 shadow-lg transition hover:scale-105 sm:text-3xl"
              >
                LANJUT LEVEL 2
              </button>
              <p className="mt-2 text-xs font-extrabold text-slate-400">
                tekan <span className="rounded-md bg-slate-700 px-1.5 py-0.5 text-slate-300">enter</span> untuk lanjut
              </p>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onReplay}
                className="mt-5 w-full rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 px-8 py-4 text-2xl font-extrabold text-amber-900 shadow-lg transition hover:scale-105 sm:text-3xl"
              >
                MAIN LAGI
              </button>
              <p className="mt-2 text-xs font-extrabold text-slate-400">
                tekan <span className="rounded-md bg-slate-700 px-1.5 py-0.5 text-slate-300">enter</span> untuk main lagi
              </p>
            </>
          )}
        </div>
      </main>
    </Shell>
  )
}

/* ------------------------- main game ------------------------ */
export default function PetaBintangGalaksiGame({ onExit }) {
  const [screen, setScreen] = useState('start')
  const [level, setLevel] = useState(1)
  const [seq, setSeq] = useState([])
  const [step, setStep] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [wobble, setWobble] = useState(0)
  const [crashed, setCrashed] = useState(false)
  const [landing, setLanding] = useState(false)
  const [time, setTime] = useState(0)

  const reqRef = useRef(null)

  useEffect(() => {
    let start = performance.now()
    function loop(now) {
      setTime((now - start) / 1000)
      reqRef.current = requestAnimationFrame(loop)
    }
    reqRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(reqRef.current)
  }, [])

  useEffect(() => {
    if (screen !== 'play') return
    const letters = level === 1 ? LETTERS_LANDING : LETTERS_CONST
    const total = level === 1 ? TOTAL_LANDING : TOTAL_CONST
    function handleKey(e) {
      if (e.repeat) return
      const k = (e.key || '').toLowerCase()
      if (letters.indexOf(k) < 0) return
      e.preventDefault()
      if (k === seq[step]) {
        playChime(k)
        setFeedback('correct')
        setTimeout(() => {
          setFeedback(null)
          const next = step + 1
          setStep(next)
          if (next >= total) {
            if (level === 1) {
              setLanding(true)
              playWhoosh()
              setTimeout(() => {
                // simulate landing done, then check - if any wrong happened in this level conceptually just proceed
                setScreen('win')
              }, 1400)
            } else {
              setTimeout(() => {
                playWhoosh()
                setTimeout(() => playFanfare(), 640)
                setTimeout(() => setScreen('win'), 1080)
              }, 200)
            }
          }
        }, level === 1 ? 280 : 400)
      } else {
        playSoft()
        setFeedback('wrong')
        setWobble((w) => w + 1)
        if (level === 1) {
          setCrashed(true)
          // if already landed or during landing, make it fall
          setLanding((prev) => {
            if (prev) {
              setTimeout(() => {
                // trigger a "fall after landing" effect by moving further down
                const rocketEl = document.getElementById('pg-rocket')
                if (rocketEl) {
                  rocketEl.style.transition = 'bottom 900ms ease-in'
                  rocketEl.style.bottom = '-15%'
                }
              }, 50)
            }
            return prev
          })
          setTimeout(() => setCrashed(false), 900)
        }
        setTimeout(() => setFeedback(null), level === 1 ? 650 : 600)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [screen, seq, step, level])

  const startGame = () => {
    setLevel(1)
    setSeq(makeSequence(LETTERS_LANDING, TOTAL_LANDING))
    setStep(0)
    setFeedback(null)
    setWobble(0)
    setCrashed(false)
    setLanding(false)
    setScreen('play')
  }

  const nextLevel = () => {
    setLevel(2)
    setSeq(makeSequence(LETTERS_CONST, TOTAL_CONST))
    setStep(0)
    setFeedback(null)
    setWobble(0)
    setScreen('play')
  }

  const replay = () => {
    setLevel(1)
    setSeq(makeSequence(LETTERS_LANDING, TOTAL_LANDING))
    setStep(0)
    setFeedback(null)
    setWobble(0)
    setCrashed(false)
    setLanding(false)
    setScreen('play')
  }

  if (screen === 'start') return <StartScreen onStart={startGame} onExit={onExit} />
  if (screen === 'win') return <WinScreen level={level} hasNext={level === 1} onNext={nextLevel} onReplay={replay} onExit={onExit} />

  const letters = level === 1 ? LETTERS_LANDING : LETTERS_CONST
  const total = level === 1 ? TOTAL_LANDING : TOTAL_CONST
  const target = seq[step]

  return (
    <Shell onExit={onExit}>
      <div className="relative z-10 flex-1 flex flex-col min-h-0">
        <header className="flex items-start justify-between px-4 pt-2 sm:px-6">
          <div>
            <h1 className="text-lg font-extrabold text-cyan-200 sm:text-xl">P15 PETA BINTANG GALAKSI</h1>
            <div className="text-xs font-extrabold text-yellow-400 sm:text-sm">OKTOBER SPACE MISSION · GRAND FINALE</div>
          </div>
          <div className="rounded-full bg-amber-400/20 border-2 border-amber-400/60 px-3 py-1 text-sm font-black text-yellow-300 sm:text-base">
            {level === 1 ? `Pendaratan ${step} / ${total}` : `⭐ ${step} / ${total}`}
          </div>
        </header>

        <div className="flex-1 relative">
          {level === 1 && (
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
              <rect x="38" y={LANDING_PAD_Y} width="24" height="2" rx="1" fill="#22d3ee" opacity="0.9" />
              <rect x="39" y={LANDING_PAD_Y + 2} width="22" height="1.2" rx="0.6" fill="#0e7490" opacity="0.6" />
              <g opacity="0.8">
                <line x1="50" y1={LANDING_PAD_Y - 6} x2="50" y2={LANDING_PAD_Y} stroke="#facc15" strokeWidth="0.8" strokeDasharray="1 1" />
              </g>
            </svg>
          )}
          {level === 2 ? (
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
              {Array.from({ length: step }).map((_, i) => {
                if (i === 0) return null
                const a = NODES[i - 1]
                const b = NODES[i]
                const color = { f: '#22d3ee', g: '#67e8f9', h: '#facc15', j: '#fde047' }[seq[i - 1]] || '#22d3ee'
                return (
                  <line
                    key={`seg-${i}`}
                    x1={a[0]}
                    y1={a[1]}
                    x2={b[0]}
                    y2={b[1]}
                    stroke={color}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}
                  />
                )
              })}
              {NODES.map((n, i) => {
                const lit = i < step
                const active = i === step
                const color = lit || active ? { f: '#22d3ee', g: '#67e8f9', h: '#facc15', j: '#fde047' }[seq[i]] || '#22d3ee' : '#475569'
                return (
                  <g key={`node-${i}`}>
                    <circle
                      cx={n[0]}
                      cy={n[1]}
                      r={lit ? 2.2 : active ? 2.0 : 1.8}
                      fill={lit ? color : active ? 'rgba(15,23,42,0.9)' : 'rgba(15,23,42,0.7)'}
                      stroke={active ? color : lit ? color : 'rgba(148,163,184,0.5)'}
                      strokeWidth="0.6"
                      style={lit ? { filter: `drop-shadow(0 0 6px ${color})` } : {}}
                    />
                    {lit && <circle cx={n[0]} cy={n[1]} r="0.8" fill="white" opacity="0.9" />}
                  </g>
                )
              })}
            </svg>
          ) : null}

          {/* Target star */}
          {screen === 'play' && target && (
            <div className="absolute left-1/2" style={{ top: level === 1 ? '18%' : '20%', transform: 'translateX(-50%)' }} key={wobble}>
              <div className={`relative ${feedback === 'wrong' ? (level === 1 ? 'animate-shake' : 'animate-wobble') : ''}`}>
                <svg viewBox="0 0 220 220" className="w-[clamp(7rem,26vh,12rem)] h-[clamp(7rem,26vh,12rem)] animate-float" style={{ filter: `drop-shadow(0 0 30px ${level === 1 ? 'rgba(34,211,238,0.8)' : 'rgba(250,204,21,0.8)'})` }}>
                  <polygon points={STAR_SHAPE} fill={level === 1 ? '#67e8f9' : GOLD} stroke={level === 1 ? '#0e7490' : GOLD_D} strokeWidth="7" strokeLinejoin="round" />
                  <polygon points={starPoints(110, 110, 78, 38)} fill={level === 1 ? '#a5f3fc' : GOLD_L} opacity="0.55" />
                  <text x="110" y="110" textAnchor="middle" dominantBaseline="central" fontFamily={COMIC} fontSize="64" fontWeight="900" fill={level === 1 ? '#164e63' : '#713f12'}>
                    {target}
                  </text>
                </svg>
              </div>
            </div>
          )}

          {/* Rocket */}
          <div
            id="pg-rocket"
            className="absolute left-1/2 z-10"
            style={{
              bottom: level === 1 ? (landing ? `${LANDING_PAD_Y - 8}%` : `${78 - step * 1.9}%`) : '5%',
              height: 'clamp(6rem, 22vh, 10rem)',
              width: 'clamp(3.4rem, 12.4vh, 5.7rem)',
              transform: 'translateX(-50%)',
              transition: level === 1 ? 'bottom 380ms ease-out' : undefined,
            }}
          >
            <div className={`h-full w-full ${crashed && level === 1 ? 'animate-shake' : ''}`}>
              <svg viewBox="0 0 120 212" className="h-full w-full overflow-visible">
                <defs>
                  <linearGradient id="pg-flame" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="45%" stopColor="#fb923c" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                  <linearGradient id="pg-hull" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="42%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>
                </defs>
                {!landing && (
                  <g className="mrb-flame">
                    <path d="M45 166 C45 186 52 196 60 208 C68 196 75 186 75 166 Z" fill="url(#pg-flame)" opacity="0.95" />
                    <path d="M52 166 C52 180 55 187 60 196 C65 187 68 180 68 166 Z" fill="#fffbeb" />
                  </g>
                )}
                <path d="M34 104 C20 118 14 134 14 152 L36 141 Z" fill="#fb7185" stroke="#be123c" strokeWidth="3.5" strokeLinejoin="round" />
                <path d="M86 104 C100 118 106 134 106 152 L84 141 Z" fill="#fb7185" stroke="#be123c" strokeWidth="3.5" strokeLinejoin="round" />
                <path d="M60 10 C80 36 88 66 88 82 L88 150 C88 164 76 170 60 170 C44 170 32 164 32 150 L32 82 C32 66 40 36 60 10 Z" fill="url(#pg-hull)" stroke="#94a3b8" strokeWidth="3.5" strokeLinejoin="round" />
                <path d="M60 10 C80 36 87 64 88 82 L32 82 C33 64 40 36 60 10 Z" fill="#f43f5e" stroke="#be123c" strokeWidth="3.5" strokeLinejoin="round" />
                <path d="M32.5 82 L87.5 82 L87.7 96 L32.3 96 Z" fill={GOLD} stroke={GOLD_D} strokeWidth="2.5" />
                <circle cx="60" cy="120" r="21" fill={CYAN} stroke={CYAN_D} strokeWidth="4" />
                <ellipse cx="51" cy="112" rx="7" ry="5" fill="#ffffff" opacity="0.7" transform="rotate(-28 51 112)" />
                <circle cx="41" cy="150" r="5" fill="#fda4af" opacity="0.9" />
                <circle cx="79" cy="150" r="5" fill="#fda4af" opacity="0.9" />
                <circle cx="50" cy="146" r="4.6" fill={INK} />
                <circle cx="70" cy="146" r="4.6" fill={INK} />
                <circle cx="51.6" cy="144.4" r="1.7" fill="#ffffff" />
                <circle cx="71.6" cy="144.4" r="1.7" fill="#ffffff" />
                <path d="M51 156 Q60 164 69 156" fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className="shrink-0 pb-3 sm:pb-4">
          <div className="flex min-h-8 items-center justify-center px-4 mb-2">
            <p className="text-center" role="status" aria-live="polite">
              {feedback === 'correct' ? (
                <span className="animate-pop-in rounded-2xl bg-emerald-500/90 px-5 py-1.5 text-base font-extrabold text-white shadow-md sm:text-xl">
                  {level === 1 ? 'benar! arahkan roket ke landasan ✨' : 'hebat! bintang menyala ✨'}
                </span>
              ) : feedback === 'wrong' ? (
                <span className="animate-pop-in rounded-2xl bg-amber-400/90 px-5 py-1.5 text-base font-extrabold text-slate-900 shadow-md sm:text-xl">
                  {level === 1 ? 'salah! roket bisa jatuh!' : 'hampir! coba lagi 💫'}
                </span>
              ) : landing ? (
                <span className="text-sm font-extrabold text-emerald-300 sm:text-base">
                  Roket mendarat di landasan dengan aman! 🎉
                </span>
              ) : (
                <span className="text-sm font-bold text-cyan-300 sm:text-base">
                  {level === 1 ? 'Pandulah roket mendarat dengan menekan: ' : 'tekan tombol '}
                  <span className="font-black text-white">{target}</span>
                </span>
              )}
            </p>
          </div>
          <div className="px-4">
            <HomeRowGuide target={landing ? null : target} active={letters} />
          </div>
        </div>
      </div>
    </Shell>
  )
}
