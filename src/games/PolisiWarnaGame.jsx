import { useRef, useState } from 'react'
import confetti from 'canvas-confetti'

const STATIONS = [
  {
    id: 'red',
    bg: 'from-red-400 to-red-700',
    roof: 'bg-red-800',
    light: '#ef4444',
  },
  {
    id: 'yellow',
    bg: 'from-yellow-300 to-amber-500',
    roof: 'bg-amber-700',
    light: '#f59e0b',
  },
  {
    id: 'green',
    bg: 'from-green-400 to-green-700',
    roof: 'bg-green-800',
    light: '#22c55e',
  },
  {
    id: 'blue',
    bg: 'from-sky-400 to-blue-700',
    roof: 'bg-blue-800',
    light: '#3b82f6',
  },
]

const CARS = {
  red: { top: '#ff8a75', bottom: '#e23b2c' },
  yellow: { top: '#ffe37f', bottom: '#eab308' },
  green: { top: '#86e39c', bottom: '#1fa64f' },
  blue: { top: '#7fc6ff', bottom: '#2f6bff' },
}

const CLOUDS = [
  { top: '10%', left: '8%', dur: '9s', delay: '0s' },
  { top: '12%', left: '72%', dur: '11s', delay: '1.4s' },
  { top: '32%', left: '88%', dur: '10s', delay: '0.6s' },
  { top: '34%', left: '2%', dur: '8s', delay: '1.8s' },
]

const STAR_DIRS = [
  { x: 0, y: -95 },
  { x: 78, y: -60 },
  { x: 94, y: 8 },
  { x: 58, y: 72 },
  { x: -58, y: 72 },
  { x: -94, y: 8 },
]

const SKIN = '#f3b888'
const SKIN_DARK = '#e2a06e'
const SHIRT = '#8a5324'
const SHIRT_DARK = '#6f3f16'
const CAP = '#5f3f1f'
const CAP_DARK = '#26272e'
const GOLD = '#f5c518'
const HAIR = '#14141e'
const TROUSER = '#20202b'
const SHOE = '#12121a'

let audioCtx = null

function ensureCtx() {
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

function playNino() {
  const ctx = ensureCtx()
  const t0 = ctx.currentTime
  const twin = (osc) => {
    osc.type = 'square'
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.07, t0)
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.18)
    osc.connect(gain)
    gain.connect(ctx.destination)
  }
  for (let i = 0; i < 3; i++) {
    const hi = ctx.createOscillator()
    const lo = ctx.createOscillator()
    hi.frequency.setValueAtTime(880, t0 + i * 0.22)
    lo.frequency.setValueAtTime(660, t0 + i * 0.22 + 0.11)
    twin(hi)
    twin(lo)
    hi.start(t0 + i * 0.22)
    lo.start(t0 + i * 0.22 + 0.11)
    hi.stop(t0 + i * 0.22 + 0.2)
    lo.stop(t0 + i * 0.22 + 0.11 + 0.2)
  }
}

function playYay() {
  const ctx = ensureCtx()
  ;[523.25, 659.25, 783.99].forEach((f, i) => {
    const t = ctx.currentTime + i * 0.09
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = f
    gain.gain.setValueAtTime(0.24, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.32)
  })
}

function pickCar() {
  const ids = Object.keys(CARS)
  const color = ids[Math.floor(Math.random() * ids.length)]
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, color }
}

function Officer({ side, gender }) {
  const girl = gender === 'girl'
  const waveToCenter = side === 'left'
  return (
    <svg viewBox="0 0 220 240" className="h-auto w-[min(30vw,11rem)] drop-shadow-lg" aria-hidden="true">
      {waveToCenter ? (
        <g className="animate-wave" style={{ transformBox: 'fill-box', transformOrigin: 'left bottom' }}>
          <line x1="146" y1="116" x2="198" y2="84" stroke={SHIRT_DARK} strokeWidth="17" strokeLinecap="round" />
          <circle cx="201" cy="81" r="9" fill={SKIN} />
        </g>
      ) : (
        <line x1="146" y1="116" x2="168" y2="158" stroke={SHIRT_DARK} strokeWidth="17" strokeLinecap="round" />
      )}

      <rect x="78" y="178" width="22" height="36" rx="10" fill={TROUSER} />
      <rect x="120" y="178" width="22" height="36" rx="10" fill={TROUSER} />
      <ellipse cx="89" cy="218" rx="17" ry="9" fill={SHOE} />
      <ellipse cx="131" cy="218" rx="17" ry="9" fill={SHOE} />

      <rect x="64" y="158" width="92" height="11" rx="4" fill="#1b1b24" />
      <rect x="103" y="159" width="14" height="9" rx="2" fill={GOLD} />

      <rect x="64" y="104" width="92" height="80" rx="30" fill={SHIRT} />
      <rect x="82" y="126" width="18" height="22" rx="4" fill={GOLD} />
      <circle cx="82" cy="135" r="3" fill={SHIRT_DARK} />
      <path d="M70 152 h14 M136 152 h14" stroke="#5a3612" strokeWidth="2" opacity="0.6" />
      <circle cx="110" cy="132" r="3" fill={SHIRT_DARK} />
      <circle cx="110" cy="146" r="3" fill={SHIRT_DARK} />

      {!waveToCenter ? (
        <line x1="74" y1="116" x2="54" y2="158" stroke={SHIRT_DARK} strokeWidth="17" strokeLinecap="round" />
      ) : (
        <line x1="74" y1="116" x2="52" y2="156" stroke={SHIRT_DARK} strokeWidth="17" strokeLinecap="round" />
      )}

      <rect x="102" y="96" width="16" height="12" fill={SKIN_DARK} />
      <circle cx="110" cy="64" r="42" fill={SKIN} />

      {girl && (
        <>
          <circle cx="62" cy="58" r="12" fill={HAIR} />
          <circle cx="158" cy="58" r="12" fill={HAIR} />
          <circle cx="62" cy="58" r="3.5" fill="#e11d48" />
          <circle cx="158" cy="58" r="3.5" fill="#e11d48" />
        </>
      )}

      <circle cx="110" cy="78" r="5.5" fill="#1b1b21" />
      <circle cx="112" cy="76" r="1.8" fill="#ffffff" />
      <circle cx="148" cy="78" r="5.5" fill="#1b1b21" />
      <circle cx="150" cy="76" r="1.8" fill="#ffffff" />

      {!girl && (
        <path d="M92 66 Q110 60 128 66 L128 62 Q110 54 92 62 Z" fill={HAIR} />
      )}

      {girl && (
        <path d="M78 70 Q100 60 118 66 Q128 68 130 72 Q112 58 92 64 Q82 66 78 70 Z" fill={HAIR} />
      )}

      <path d="M98 86 Q110 96 122 86" stroke="#7c3b20" strokeWidth="3" strokeLinecap="round" fill="none" />
      <ellipse cx="78" cy="86" rx="7" ry="4" fill="#f7a9a9" opacity="0.55" />
      <ellipse cx="142" cy="86" rx="7" ry="4" fill="#f7a9a9" opacity="0.55" />
      <circle cx="96" cy="70" r="2" fill={SKIN_DARK} />
      <circle cx="124" cy="70" r="2" fill={SKIN_DARK} />

      <rect x="68" y="24" width="84" height="28" rx="14" fill={CAP} />
      <rect x="68" y="48" width="84" height="11" rx="4" fill={CAP_DARK} />
      <ellipse cx="110" cy="53.5" rx="12" ry="8" fill={GOLD} />
      <path
        d="M110 47 l2 4 4.3 0.6 -3.1 3 0.7 4.3 -3.9 -2 -3.9 2 0.7 -4.3 -3.1 -3 4.3 -0.6 Z"
        fill="#7c5726"
      />
      <ellipse cx="110" cy="63" rx="38" ry="9" fill="#2b241c" />

      <rect x="62" y="62" width="11" height="36" rx="5" fill={HAIR} />
      <rect x="147" y="62" width="11" height="36" rx="5" fill={HAIR} />
    </svg>
  )
}

function Station({ s, innerRef }) {
  return (
    <div ref={innerRef} className="relative flex flex-col items-end">
      <div className="flex flex-col items-center">
        <span
          className="animate-alert-pulse h-3 w-3 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)]"
          style={{ background: s.light }}
        />
        <div className="z-10 -mt-0.5 h-8 w-[110%] rounded-t-xl border-b-4 border-black/25 bg-gradient-to-b from-white/30 to-white/5 shadow-lg">
          <div className={`h-full w-full rounded-t-xl ${s.roof}`} />
        </div>
        <div className="z-10 -mt-1 flex h-6 w-11 items-center justify-center rounded-sm bg-white shadow-md">
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
            <path
              d="M10 1.5l2.4 4.9 5.4 0.8 -3.9 3.8 0.9 5.3 -4.8-2.5 -4.8 2.5 0.9-5.3 -3.9-3.8 5.4-0.8 Z"
              fill="#d2a106"
            />
          </svg>
        </div>
        <div className={`relative -mt-1 flex h-[5.6rem] w-[min(22vw,7rem)] flex-col items-center justify-end rounded-t-lg bg-gradient-to-b ${s.bg} pb-2 shadow-2xl sm:h-24`}>
          <div className="absolute left-1.5 top-2 flex flex-col gap-1.5">
            <div className="h-5 w-5 rounded-sm bg-white/85" />
            <div className="h-5 w-5 rounded-sm bg-white/85" />
          </div>
          <div className="absolute right-1.5 top-2 flex flex-col gap-1.5">
            <div className="h-5 w-5 rounded-sm bg-white/85" />
            <div className="h-5 w-5 rounded-sm bg-white/85" />
          </div>
          <div className="h-11 w-9 rounded-t-full border-2 border-b-0 border-white bg-white/90 shadow-inner" />
        </div>
      </div>
    </div>
  )
}

function Car({ color, className, style }) {
  const p = CARS[color]
  return (
    <svg viewBox="0 0 240 132" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id={`car-body-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.top} />
          <stop offset="100%" stopColor={p.bottom} />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="124" rx="98" ry="8" fill="rgba(2,6,23,0.18)" />
      <rect x="26" y="92" width="188" height="18" rx="9" fill={p.bottom} />
      <rect x="24" y="56" width="192" height="54" rx="26" fill={`url(#car-body-${color})`} />
      <rect x="56" y="34" width="112" height="42" rx="20" fill="#cfeaff" />
      <rect x="56" y="34" width="112" height="22" rx="20" fill="#e6f6ff" opacity="0.85" />
      <rect x="28" y="86" width="184" height="9" rx="4" fill="rgba(255,255,255,0.3)" />
      <path d="M120 56 L120 100" stroke="rgba(0,0,0,0.15)" strokeWidth="3" />
      <circle cx="129" cy="74" r="3" fill="rgba(255,255,255,0.75)" />
      <circle cx="74" cy="106" r="16" fill="#1f2330" />
      <circle cx="74" cy="106" r="8" fill="#dbe0e6" />
      <circle cx="74" cy="106" r="3" fill="#9aa3af" />
      <circle cx="166" cy="106" r="16" fill="#1f2330" />
      <circle cx="166" cy="106" r="8" fill="#dbe0e6" />
      <circle cx="166" cy="106" r="3" fill="#9aa3af" />
      <circle cx="96" cy="56" r="7" fill="#ffffff" />
      <circle cx="130" cy="56" r="7" fill="#ffffff" />
      <circle cx="97.5" cy="54.5" r="3.4" fill="#20283a" />
      <circle cx="131.5" cy="54.5" r="3.4" fill="#20283a" />
      <circle cx="98.5" cy="53" r="1.2" fill="#ffffff" />
      <circle cx="132.5" cy="53" r="1.2" fill="#ffffff" />
      <path d="M104 68 Q114 75 124 68" stroke="#20283a" strokeWidth="3" strokeLinecap="round" fill="none" />
      <line x1="60" y1="34" x2="42" y2="18" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
      <circle cx="40" cy="15" r="5" fill="#ef4444" />
    </svg>
  )
}

export default function PolisiWarnaGame({ onExit }) {
  const [item, setItem] = useState(pickCar)
  const [flying, setFlying] = useState(null)
  const [burst, setBurst] = useState(null)
  const stageRef = useRef(null)
  const stationRefs = useRef({})

  function launchCar() {
    if (flying) return
    const stage = stageRef.current
    const station = stationRefs.current[item.color]
    if (!stage || !station) return
    const s = stage.getBoundingClientRect()
    const b = station.getBoundingClientRect()
    const cx = b.left + b.width / 2
    const cy = b.top + b.height / 2
    setFlying({
      ...item,
      fx: cx - (s.left + s.width / 2),
      fy: cy - (s.top + s.height * 0.22),
    })
    playNino()
  }

  function handleLand() {
    const station = stationRefs.current[flying.color]
    const stage = stageRef.current
    if (station && stage) {
      const r = station.getBoundingClientRect()
      const sr = stage.getBoundingClientRect()
      setBurst({
        key: flying.id,
        x: r.left - sr.left + r.width / 2,
        y: r.top - sr.top + r.height * 0.45,
      })
      confetti({
        particleCount: 45,
        spread: 80,
        startVelocity: 30,
        origin: {
          x: (r.left + r.width / 2) / window.innerWidth,
          y: (r.top + r.height * 0.45) / window.innerHeight,
        },
        colors: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ffffff'],
        disableForReducedMotion: true,
      })
    }
    playYay()
    setTimeout(() => {
      setFlying(null)
      setItem(pickCar())
    }, 260)
  }

  return (
    <div className="flex h-dvh w-full touch-manipulation select-none flex-col overflow-hidden bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-200/70">
      <header className="z-20 flex w-full shrink-0 items-center justify-between px-4 pt-4 sm:px-8 sm:pt-6">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold text-slate-600 shadow transition hover:scale-105 hover:bg-white sm:px-5 sm:text-base"
        >
          ‹ Keluar
        </button>
        <h1 className="text-[clamp(1.6rem,5.5vw,3rem)] font-black leading-none text-slate-800 drop-shadow-sm">
          <span aria-hidden="true">🚨</span> POLISI WARNA
        </h1>
        <span className="w-24 sm:w-28" aria-hidden="true" />
      </header>

      <div ref={stageRef} className="relative z-10 min-h-0 flex-1">
        <span className="animate-floaty pointer-events-none absolute right-6 top-4 select-none text-6xl opacity-90 sm:text-8xl" aria-hidden="true" style={{ animationDuration: '10s' }}>☀️</span>
        {CLOUDS.map((c, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="animate-floaty pointer-events-none absolute select-none text-5xl opacity-70 sm:text-7xl"
            style={{ top: c.top, left: c.left, animationDuration: c.dur, animationDelay: c.delay }}
          >
            ☁️
          </span>
        ))}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[3.5vh] bg-gradient-to-b from-emerald-400 to-emerald-600" />
        <div className="pointer-events-none absolute inset-x-0 bottom-[3.5vh] z-[5] h-[2vh] bg-slate-700/50" />

        <div className="pointer-events-none absolute bottom-0 left-0 z-10">
          <Officer side="left" gender="boy" />
        </div>
        <div className="animate-floaty pointer-events-none absolute bottom-0 right-0 z-10" style={{ animationDuration: '7s' }}>
          <Officer side="right" gender="girl" />
        </div>

        <div className="absolute bottom-[2.5vh] left-1/2 z-10 flex -translate-x-1/2 items-end gap-2 sm:gap-4">
          {STATIONS.map((s) => (
            <Station key={s.id} s={s} innerRef={(el) => (stationRefs.current[s.id] = el)} />
          ))}
        </div>

        {burst && (
          <span
            key={burst.key}
            className="pointer-events-none absolute z-30"
            style={{ left: burst.x, top: burst.y }}
            aria-hidden="true"
          >
            {STAR_DIRS.map((d, i) => (
              <span
                key={i}
                className="animate-sparkle absolute -translate-x-1/2 -translate-y-1/2 text-2xl sm:text-4xl"
                style={{ '--dx': `${d.x}px`, '--dy': `${d.y}px` }}
              >
                ⭐
              </span>
            ))}
            <span className="animate-pop-in absolute -translate-x-1/2 -translate-y-1/2 text-5xl sm:text-7xl">✨</span>
          </span>
        )}

        {flying ? (
          <span
            key={flying.id}
            onAnimationEnd={handleLand}
            className="animate-color-fly pointer-events-none absolute z-30"
            style={{ left: '50%', top: '22%', '--fx': `${flying.fx}px`, '--fy': `${flying.fy}px` }}
          >
            <Car color={flying.color} className="w-[min(46vmin,250px)]" />
          </span>
        ) : (
          <div key={item.id} className="absolute left-1/2 top-[22%] z-20 -translate-x-1/2">
            <div className="animate-vehicle-drop">
              <button
                type="button"
                onClick={launchCar}
                aria-label={`Tap the ${item.color} car`}
                className="animate-floaty cursor-pointer rounded-2xl transition-transform hover:scale-105 active:scale-95"
                style={{ animationDuration: '4.5s' }}
              >
                <Car color={item.color} className="w-[min(46vmin,250px)]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}