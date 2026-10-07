import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'

/* ------------------------------ palette ------------------------------- */
const GOLD = '#facc15'
const GOLD_D = '#ca8a04'
const GOLD_L = '#fef08a'
const CYAN = '#22d3ee'
const CYAN_D = '#0e7490'
const GREEN = '#4ade80'
const ROCKET = '#f43f5e'
const ROCKET_D = '#be123c'
const INK = '#1e293b'
const HULL_D = '#94a3b8'

const NEON = ['#22d3ee', '#4ade80', '#facc15', '#f472b6', '#a78bfa', '#fef9c3']
const SPARK_CHARS = ['â¦', 'â§', 'â', 'â¦', 'Â·', 'â']
const COMIC = "'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', system-ui, sans-serif"

/* ----------------------------- game data ------------------------------ */
const SEQ_LEN = 10
const STAR_Y = '30%'
const FLIGHT_MS = 640
const ZOOM_MS = 1150

function alternate(a, b, n) {
  const seq = []
  for (let i = 0; i < n; i++) seq.push(i % 2 ? b : a)
  return seq
}

function cycle(letters, n) {
  const seq = []
  for (let i = 0; i < n; i++) seq.push(letters[i % letters.length])
  return seq
}

const ROUNDS = [
  {
    name: 'jembatan g & h',
    icon: 'ð',
    letters: ['G', 'H'],
    desc: 'g dan h â jari telunjuk kiri dan kanan!',
    seq: alternate('G', 'H', SEQ_LEN),
  },
  {
    name: 'g & h dua-dua',
    icon: 'ð',
    letters: ['G', 'H'],
    desc: 'kadang g dua kali, kadang h dua kali!',
    seq: ['G', 'H', 'H', 'G', 'G', 'H', 'G', 'H', 'H', 'G'],
  },
  {
    name: 'jangkar + g & h',
    icon: 'â',
    letters: ['F', 'G', 'J', 'H'],
    desc: 'jari jangkar f dan j bertemu g dan h!',
    seq: cycle(['F', 'G', 'J', 'H'], SEQ_LEN),
  },
  {
    name: 'f g h j lengkap',
    icon: 'ð',
    letters: ['F', 'G', 'H', 'J'],
    desc: 'gabungkan semua bintang f g h j!',
    seq: cycle(['G', 'F', 'J', 'H'], SEQ_LEN),
  },
  {
    name: 'campuran ekstra',
    icon: 'ðª',
    letters: ['F', 'G', 'H', 'J'],
    desc: 'roulette f g h j melintasi galaksi!',
    seq: cycle(['J', 'H', 'F', 'G'], SEQ_LEN),
  },
  {
    name: 'grand final',
    icon: 'ð ',
    letters: ['F', 'G', 'H', 'J'],
    desc: 'jembatan terakhir: semua bintang f g h j!',
    seq: ['F', 'G', 'H', 'J', 'G', 'H', 'F', 'J', 'H', 'G'],
  },
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

/* crisp cosmic chime for a correct key */
function playChime() {
  tone(880, 0.11, 0.09, 'sine')
  tone(1320, 0.11, 0.08, 'sine', 0.05)
  tone(1760, 0.2, 0.06, 'sine', 0.1)
  tone(2640, 0.24, 0.04, 'sine', 0.15)
}

/* gentle, near-silent nudge for a wrong key â no penalty, no harsh tone */
function playSoft() {
  tone(300, 0.14, 0.04, 'sine', 0, 220)
}

function playLevelUp() {
  tone(659.25, 0.14, 0.11, 'triangle')
  tone(880, 0.2, 0.11, 'triangle', 0.12)
}

function playWhoosh() {
  tone(140, 1.1, 0.11, 'sawtooth', 0, 46)
  tone(220, 0.85, 0.06, 'triangle', 0.08, 1900)
}

function playFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]
  notes.forEach((f, i) => tone(f, 0.45, 0.14, 'triangle', i * 0.1))
  tone(1568, 0.8, 0.11, 'sine', 0.5)
  tone(2093, 0.7, 0.07, 'triangle', 0.55)
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

      {/* distant planet */}
      <svg
        className="absolute top-[10%] right-[18%] w-[13%] max-w-[100px] opacity-50 sm:top-[14%] sm:w-[11%]"
        viewBox="0 0 120 120"
      >
        <circle cx="60" cy="60" r="30" fill="#c4b5fd" />
        <circle cx="50" cy="52" r="9" fill="#ddd6fe" opacity="0.8" />
        <circle cx="70" cy="68" r="7" fill="#a78bfa" opacity="0.85" />
        <circle cx="66" cy="46" r="4.5" fill="#ddd6fe" opacity="0.7" />
      </svg>

      {/* moon */}
      <svg
        className="absolute top-[22%] left-[3%] w-[10%] max-w-[74px] opacity-55 sm:top-[26%] sm:w-[8%]"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="38" fill="#e2e8f0" />
        <circle cx="50" cy="50" r="38" fill="#0f172a" opacity="0.4" />
        <circle cx="38" cy="42" r="7" fill="#94a3b8" opacity="0.8" />
        <circle cx="60" cy="62" r="9" fill="#64748b" opacity="0.7" />
      </svg>
    </div>
  )
}

/* ----------------------------- art: rocket ---------------------------- */
function RocketArt() {
  return (
    <svg viewBox="0 0 110 210" className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id="jb-flame-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="45%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
        <linearGradient id="jb-hull-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={HULL_D} />
          <stop offset="42%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={HULL_D} />
        </linearGradient>
      </defs>

      <g className="jb-flame">
        <path
          d="M41 164 C41 186 49 196 55 208 C61 196 69 186 69 164 Z"
          fill="url(#jb-flame-grad)"
          opacity="0.95"
        />
        <path d="M48 164 C48 179 51 186 55 194 C59 186 62 179 62 164 Z" fill="#fffbeb" />
      </g>

      <path
        d="M30 100 C18 114 13 130 13 148 L33 138 Z"
        fill="#fb7185"
        stroke={ROCKET_D}
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <path
        d="M80 100 C92 114 97 130 97 148 L77 138 Z"
        fill="#fb7185"
        stroke={ROCKET_D}
        strokeWidth="3.4"
        strokeLinejoin="round"
      />

      <path
        d="M55 8 C75 36 82 64 82 80 L82 148 C82 162 70 168 55 168 C40 168 28 162 28 148 L28 80 C28 64 35 36 55 8 Z"
        fill="url(#jb-hull-grad)"
        stroke={HULL_D}
        strokeWidth="3.4"
        strokeLinejoin="round"
      />

      <path
        d="M55 8 C75 36 81 62 82 80 L28 80 C29 62 35 36 55 8 Z"
        fill={ROCKET}
        stroke={ROCKET_D}
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <path d="M28.4 80 L81.6 80 L81.8 94 L28.2 94 Z" fill={GOLD} stroke={GOLD_D} strokeWidth="2.4" />

      <circle cx="55" cy="120" r="20" fill={CYAN} stroke={CYAN_D} strokeWidth="4" />
      <ellipse cx="47" cy="113" rx="6.5" ry="4.5" fill="#ffffff" opacity="0.7" transform="rotate(-28 47 113)" />

      <circle cx="37" cy="148" r="4.8" fill="#fda4af" opacity="0.9" />
      <circle cx="73" cy="148" r="4.8" fill="#fda4af" opacity="0.9" />
      <circle cx="46" cy="144" r="4.4" fill={INK} />
      <circle cx="64" cy="144" r="4.4" fill={INK} />
      <circle cx="47.5" cy="142.5" r="1.6" fill="#ffffff" />
      <circle cx="65.5" cy="142.5" r="1.6" fill="#ffffff" />
      <path
        d="M47 154 Q55 162 63 154"
        fill="none"
        stroke={INK}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* -------------------------- art: space station ------------------------ */
function StationArt() {
  return (
    <svg viewBox="0 0 140 150" className="jb-station-pulse h-full w-full overflow-visible">
      <g>
        <line x1="70" y1="6" x2="70" y2="46" stroke="#94a3b8" strokeWidth="3" />
        <polygon points="70,16 64,30 76,30" fill="#f472b6" />
        <circle cx="70" cy="50" r="2.6" fill="#f472b6" />
      </g>
      <g>
        <rect x="20" y="52" width="26" height="10" rx="2" fill="#334155" stroke="#64748b" strokeWidth="2" />
        <rect x="94" y="52" width="26" height="10" rx="2" fill="#334155" stroke="#64748b" strokeWidth="2" />
        <rect x="16" y="46" width="34" height="6" rx="2" fill="#67e8f9" opacity="0.85" />
        <rect x="90" y="46" width="34" height="6" rx="2" fill="#67e8f9" opacity="0.85" />
      </g>
      <circle cx="70" cy="72" r="30" fill="#0e7490" stroke="#22d3ee" strokeWidth="4" />
      <circle cx="70" cy="72" r="18" fill="#164e63" stroke="#67e8f9" strokeWidth="2.5" />
      <circle cx="70" cy="72" r="7" fill="#a5f3fc" opacity="0.9" />
      <rect x="55" y="112" width="30" height="18" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
      <path d="M48 130 L92 130 L84 144 L56 144 Z" fill="#475569" stroke="#94a3b8" strokeWidth="2.5" />
    </svg>
  )
}

/* ------------------------- on-screen key guide ----------------------- */
const KEY_UNIT = 'min(7vw, 6.2vh, 3.4rem)'

const HOME_ROW = [
  { l: 'F', color: CYAN },
  { l: 'G', color: GREEN },
  { l: 'H', color: GOLD },
  { l: 'J', color: CYAN },
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
            <Fragment key={key.l}>
              {key.l === 'H' && <div aria-hidden="true" className="w-[min(6vw,3rem)] shrink-0" />}
              <div
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
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

/* ----------------------------- bridge tiles --------------------------- */
function Bridge({ placed, total }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 z-10" style={{ top: '58%' }} aria-hidden="true">
      {Array.from({ length: total }, (_, i) => {
        const on = i < placed
        return (
          <div
            key={i}
            className="absolute"
            style={{ left: `calc(15% + ${i * 6.4}%)`, width: 'min(5.2vw, 5.4vh, 42px)', height: 'min(5.2vw, 5.4vh, 42px)' }}
          >
            <div
              className={`flex h-full w-full items-center justify-center rounded-xl border-2 ${
                on ? 'jb-tile bg-cyan-400/25 text-white' : 'border-white/10 bg-white/[0.03] text-white/25'
              }`}
              style={{
                borderColor: on ? CYAN : undefined,
                boxShadow: on ? '0 0 14px rgba(34,211,238,0.7), 0 0 30px rgba(34,211,238,0.3)' : undefined,
                fontSize: 'calc(min(5.2vw, 5.4vh, 42px) * 0.5)',
              }}
            >
              {on ? 'â¦' : 'Â·'}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------ confetti ------------------------------ */
function cosmicConfetti(originX) {
  const colors = [GOLD, CYAN, GREEN, '#f472b6', '#a78bfa', '#ffffff']
  const star = confetti.shapeFromText({ text: 'â­', scalar: 1.6 })
  const shapes = [star, 'circle', 'square']
  const cannon = (origin, angle) =>
    confetti({
      particleCount: 70,
      angle,
      spread: 130,
      startVelocity: 48,
      gravity: 0.8,
      origin,
      colors,
      shapes,
      scalar: 1.15,
      ticks: 240,
    })
  cannon({ x: originX, y: 0.5 }, 90)
  cannon({ x: Math.max(0.15, originX â 0.2), y: 0.6 }, 70)
  cannon({ x: Math.min(0.85, originX + 0.2), y: 0.6 }, 110)
  setTimeout(
    () =>
      confetti({
        particleCount: 60,
        angle: 90,
        spread: 170,
        startVelocity: 55,
        gravity: 0.85,
        origin: { x: originX, y: 0.35 },
        colors,
        shapes,
        scalar: 1,
      }),
    300,
  )
}

/* ------------------------- star trail helpers ------------------------ */
function StarTrail({ trail, flight }) {
  if (!trail.length) return null
  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
      {trail.map((p) => (
        <span
          key={p.id}
          className="jb-trail"
          style={{
            left: '50%',
            top: STAR_Y,
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
  return Array.from({ length: 16 }, (_, i) => ({
    id: `${id}-${i}`,
    ox: (Math.random() â 0.5) * 90,
    oy: (Math.random() â 0.5) * 70,
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
          <span aria-hidden="true">â</span> keluar
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
          <div className="mx-auto mb-1 text-5xl sm:text-6xl" aria-hidden="true">ð</div>
          <h1 className="text-[clamp(1.6rem,5.5vw,2.6rem)] font-extrabold leading-none text-slate-700">
            Jembatan Bintang <span className="text-cyan-600">G-H</span>
          </h1>
          <p className="mt-2 text-sm font-bold text-slate-500 sm:text-base">
            bangun jembatan {SEQ_LEN} bintang untuk menyeberangi jurang galaksi!
          </p>
          <p className="mt-1 text-xs font-extrabold tracking-wide text-cyan-600 sm:text-sm">
            g â jari telunjuk kiri Â· h â jari telunjuk kanan
          </p>

          <div className="mt-4 rounded-2xl bg-indigo-50 p-3 text-left">
            <p className="mb-2 text-center text-xs font-extrabold tracking-wide text-indigo-700">
              6 jembatan misi
            </p>
            <div className="flex flex-col items-center gap-2">
              {ROUNDS.map((r) => (
                <span
                  key={r.name}
                  className="flex items-center justify-center gap-1 rounded-xl border-2 border-cyan-200 bg-white px-3 py-1.5 text-base font-black text-slate-800 sm:text-lg"
                >
                  {r.letters.map((l) => (
                    <span key={l} style={{ color: l === 'G' ? GREEN : l === 'H' ? GOLD : '#334155' }}>
                      {l}
                    </span>
                  ))}
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

function RoundIntro({ round, onNext, onExit }) {
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
                className="flex h-12 w-12 items-center justify-center rounded-xl border-2 bg-indigo-50 text-2xl font-black shadow sm:h-14 sm:w-14 sm:text-3xl"
                style={{
                  color: l === 'G' ? GREEN : l === 'H' ? GOLD : CYAN,
                  borderColor: l === 'G' ? GREEN : l === 'H' ? GOLD : CYAN,
                }}
              >
                {l}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm font-bold text-slate-400">kumpulkan {SEQ_LEN} bintang!</p>
          <div className="mt-4">
            <div className="animate-pov-replay mx-auto inline-flex items-center gap-2 rounded-full border-4 border-rose-200 bg-rose-500 px-6 py-3 text-white shadow-lg">
              <span aria-hidden="true">â¨ï¸</span>
              <span className="text-lg font-extrabold sm:text-xl">tekan</span>
              <span className="rounded-md bg-white px-2.5 py-0.5 text-lg font-black text-rose-600 sm:text-xl">
                ENTER
              </span>
              <span className="text-lg font-extrabold sm:text-xl">untuk lanjut</span>
            </div>
            <p className="mt-2 text-xs font-extrabold text-slate-400">
              hari ini bukan main mouse — tekan tombol enter ya!
            </p>
          </div>
        </div>
      </main>
    </Shell>
  )
}

function CompleteScreen({ total, onReplay, onExit }) {
  useEnter(onReplay)

  return (
    <Shell onExit={onExit}>
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-4">
        <div className="animate-pop-in w-full max-w-lg rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-9">
          <span className="text-5xl sm:text-6xl" aria-hidden="true">ð</span>
          <h1 className="mt-2 text-[clamp(1.4rem,5vw,2.2rem)] font-extrabold leading-tight text-slate-700">
            jembatan selesai!
          </h1>
          <p className="text-base font-bold text-emerald-600 sm:text-lg">
            roket berhasil menyeberang ke stasiun luar angkasa!
          </p>
          <p className="mt-1 text-sm font-bold text-slate-400">
            total bintang: <span className="text-amber-500">{total}</span> / {ROUNDS.length * SEQ_LEN}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-0.5">
            {Array.from({ length: ROUNDS.length * SEQ_LEN }, (_, i) => (
              <span key={i} className="animate-pop-in text-sm leading-none">
                â­
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onReplay}
            className="animate-pov-replay mt-5 w-full rounded-full bg-rose-500 px-8 py-4 text-2xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-3xl"
          >
            MAIN LAGI
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
export default function JembatanBintangGame({ onExit }) {
  const [screen, setScreen] = useState('entry')
  const [round, setRound] = useState(0)
  const [step, setStep] = useState(0)
  const [total, setTotal] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [flying, setFlying] = useState(false)
  const [zooming, setZooming] = useState(false)
  const [flight, setFlight] = useState({ dx: 0, dy: 0 })
  const [zoom, setZoom] = useState({ dx: 0, dy: 0 })
  const [trail, setTrail] = useState([])
  const [wobbleKey, setWobbleKey] = useState(0)

  const starRef = useRef(null)
  const rocketRef = useRef(null)
  const stationRef = useRef(null)
  const timers = useRef(new Set())
  const trailId = useRef(0)

  const roundData = ROUNDS[round]
  const target = roundData.seq[step]
  const activeKeys = roundData.letters

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
  stateRef.current = { step, feedback, flying, zooming, target, round }

  function measureFlight() {
    const from = starRef.current?.getBoundingClientRect()
    const to = rocketRef.current?.getBoundingClientRect()
    if (!from || !to) return { dx: 0, dy: 0 }
    return {
      dx: to.left + to.width / 2 â (from.left + from.width / 2),
      dy: to.top + to.height / 2 â (from.top + from.height / 2),
    }
  }

  function measureZoom() {
    const from = rocketRef.current?.getBoundingClientRect()
    const to = stationRef.current?.getBoundingClientRect()
    if (!from || !to) return { dx: 0, dy: 0 }
    return {
      dx: to.left + to.width / 2 â (from.left + from.width / 2),
      dy: to.top + to.height / 2 â (from.top + from.height / 2),
    }
  }

  useEffect(() => {
    if (screen !== 'playing') return

    function completeRound() {
      setZoom(measureZoom())
      setZooming(true)
      playWhoosh()
      later(() => {
        playFanfare()
        cosmicConfetti(0.82)
      }, 950)
      later(() => {
        const next = stateRef.current.round + 1
        setZooming(false)
        if (next >= ROUNDS.length) {
          setScreen('complete')
        } else {
          playLevelUp()
          setRound(next)
          setStep(0)
          setScreen('round-intro')
        }
      }, ZOOM_MS + 250)
    }

    const handleKey = (e) => {
      if (e.repeat || e.key.length !== 1 || !/^[a-z]$/i.test(e.key)) return
      e.preventDefault()
      const s = stateRef.current
      if (s.feedback || s.flying || s.zooming) return

      if (e.key.toUpperCase() === s.target) {
        setFeedback('correct')
        setFlight(measureFlight())
        setTrail(makeTrail(trailId.current++))
        setFlying(true)
        setTotal((t) => t + 1)
        playChime()
        later(() => {
          setFlying(false)
          setFeedback(null)
          setTrail([])
          if (s.step + 1 >= SEQ_LEN) completeRound()
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

  function startRound() {
    setRound(0)
    setStep(0)
    setFeedback(null)
    setFlying(false)
    setZooming(false)
    setTrail([])
    setScreen('round-intro')
  }

  function replay() {
    setRound(0)
    setStep(0)
    setTotal(0)
    setFeedback(null)
    setFlying(false)
    setZooming(false)
    setTrail([])
    setScreen('playing')
    playLevelUp()
  }

  if (screen === 'entry') return <StartScreen onStart={startRound} onExit={onExit} />
  if (screen === 'round-intro') return <RoundIntro round={round} onNext={() => setScreen('playing')} onExit={onExit} />
  if (screen === 'complete') return <CompleteScreen total={total} onReplay={replay} onExit={onExit} />

  const placed = Math.min(SEQ_LEN, step + (flying || zooming ? 1 : 0))

  return (
    <Shell
      onExit={onExit}
      right={
        <div className="text-right">
          <p className="text-[10px] font-extrabold tracking-wide text-cyan-400 sm:text-xs">
            {roundData.name}
          </p>
          <p className="text-xs font-bold text-white/60">
            bintang {Math.min(step + 1, SEQ_LEN)} / {SEQ_LEN}
          </p>
          <p className="text-[10px] font-bold text-amber-400/80 sm:text-xs">
            total â­ {total}
          </p>
        </div>
      }
    >
      <main className="relative z-10 min-h-0 flex-1">
        {/* target star */}
        <div className="absolute left-1/2 z-20" style={{ top: STAR_Y, height: 'clamp(7rem, 26vh, 12.5rem)' }}>
          <div
            ref={starRef}
            className={`h-full aspect-square ${flying ? 'jb-star-fly' : ''}`}
            style={{
              '--dx': `${flight.dx}px`,
              '--dy': `${flight.dy}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div key={wobbleKey} className={`h-full w-full ${feedback === 'wrong' ? 'jb-wobble' : ''}`}>
              <svg viewBox="0 0 220 220" className="jb-star-float jb-star-glow h-full w-full">
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

        <Bridge placed={placed} total={SEQ_LEN} />

        {/* rocket (docked left) */}
        <div
          className="absolute z-10"
          style={{ left: '4%', bottom: '5%', width: 'clamp(3.8rem, 16vh, 6.4rem)' }}
        >
          <div
            ref={rocketRef}
            className={`h-full w-full ${zooming ? 'jb-zoom' : ''}`}
            style={{ '--zdx': `${zoom.dx}px`, '--zdy': `${zoom.dy}px` }}
          >
            <div className="jb-bob">
              <RocketArt />
            </div>
          </div>
        </div>

        {/* space station (docked right) */}
        <div
          className="absolute z-10"
          style={{ right: '3%', bottom: '9%', width: 'clamp(4.2rem, 17vh, 6.8rem)' }}
        >
          <div ref={stationRef}>
            <StationArt />
          </div>
          <div className="absolute -top-7 right-0 text-2xl leading-none sm:text-3xl" aria-hidden="true">
            ð©âð
          </div>
        </div>
      </main>

      <div className="z-10 shrink-0 pb-3 sm:pb-4">
        <div className="flex min-h-8 items-center justify-center px-4">
          <p className="text-center" role="status" aria-live="polite">
            {feedback === 'correct' ? (
              <span className="animate-pop-in rounded-2xl bg-emerald-500/90 px-5 py-1.5 text-base font-extrabold text-white shadow-md sm:text-xl">
                tepat! jembatan bertambah â¨
              </span>
            ) : feedback === 'wrong' ? (
              <span className="animate-pop-in rounded-2xl bg-amber-400/90 px-5 py-1.5 text-base font-extrabold text-slate-900 shadow-md sm:text-xl">
                coba lagi ya, fokus dulu! ð«
              </span>
            ) : zooming ? (
              <span className="text-sm font-extrabold text-rose-300 sm:text-base">
                roket menyeberangi jembatan! ð
              </span>
            ) : (
              <span className="text-sm font-bold text-cyan-300 sm:text-base">
                tekan tombol{' '}
                <span className="font-black text-white">{target}</span> di keyboard
              </span>
            )}
          </p>
        </div>
        <p className="mt-1 text-center text-[10px] font-bold text-white/40 sm:text-xs">
          g â telunjuk kiri (hijau) Â· h â telunjuk kanan (kuning)
        </p>
        <div className="px-4">
          <HomeRowGuide target={flying || zooming ? null : target} active={activeKeys} />
        </div>
      </div>
    </Shell>
  )
}