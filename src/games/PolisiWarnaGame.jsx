import { useRef, useState } from 'react'
import confetti from 'canvas-confetti'

const STATIONS = [
  { id: 'red', bg: 'from-red-400 to-red-700', roof: 'bg-red-800', light: '#ef4444' },
  { id: 'yellow', bg: 'from-yellow-300 to-amber-500', roof: 'bg-amber-700', light: '#f59e0b' },
  { id: 'green', bg: 'from-green-400 to-green-700', roof: 'bg-green-800', light: '#22c55e' },
  { id: 'blue', bg: 'from-sky-400 to-blue-700', roof: 'bg-blue-800', light: '#3b82f6' },
]

const CAR_IMG = {
  red: '/images/cars-red.png',
  yellow: '/images/cars-yellow.png',
  green: '/images/cars-green.png',
  blue: '/images/cars-blue.png',
}

const CLOUDS = [
  { top: '10%', left: '8%', dur: '9s', delay: '0s' },
  { top: '12%', left: '72%', dur: '11s', delay: '1.4s' },
  { top: '32%', left: '88%', dur: '10s', delay: '0.6s' },
  { top: '34%', left: '2%', dur: '8s', delay: '1.8s' },
]

const STAR_DIRS = [
  { x: 0, y: -105 },
  { x: 85, y: -65 },
  { x: 100, y: 10 },
  { x: 62, y: 80 },
  { x: -62, y: 80 },
  { x: -100, y: 10 },
]

const REWARD_EMOJI = [
  { e: '⭐', x: 0, y: -120 },
  { e: '🎉', x: 110, y: -80 },
  { e: '💛', x: -110, y: -70 },
  { e: '🎊', x: 70, y: -130 },
  { e: '🧡', x: -70, y: -120 },
  { e: '✨', x: 140, y: -40 },
  { e: '✨', x: -140, y: -35 },
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

function playPick() {
  const ctx = ensureCtx()
  const t = ctx.currentTime
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'triangle'
  o.frequency.setValueAtTime(480, t)
  o.frequency.exponentialRampToValueAtTime(760, t + 0.08)
  g.gain.setValueAtTime(0.18, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
  o.connect(g)
  g.connect(ctx.destination)
  o.start(t)
  o.stop(t + 0.14)
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

function playFanfare() {
  const ctx = ensureCtx()
  ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
    const t = ctx.currentTime + i * 0.11
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'triangle'
    o.frequency.value = f
    g.gain.setValueAtTime(0.22, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
    o.connect(g)
    g.connect(ctx.destination)
    o.start(t)
    o.stop(t + 0.38)
  })
}

function playBuzz() {
  const ctx = ensureCtx()
  for (let i = 0; i < 2; i++) {
    const t = ctx.currentTime + i * 0.16
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    o.type = 'sawtooth'
    o.frequency.setValueAtTime(230 - i * 45, t)
    o.frequency.exponentialRampToValueAtTime(110, t + 0.15)
    f.type = 'lowpass'
    f.frequency.value = 620
    g.gain.setValueAtTime(0.16, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.16)
    o.connect(f)
    f.connect(g)
    g.connect(ctx.destination)
    o.start(t)
    o.stop(t + 0.18)
  }
}

function pickCar() {
  const ids = Object.keys(CAR_IMG)
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

      {!girl && <path d="M92 66 Q110 60 128 66 L128 62 Q110 54 92 62 Z" fill={HAIR} />}

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

function Station({ s, innerRef, alert, pop }) {
  return (
    <div ref={innerRef} className="relative">
      {alert && (
        <span
          className="animate-pop-in absolute -inset-2 z-0 rounded-3xl bg-red-500/40 ring-4 ring-red-500"
          aria-hidden="true"
        />
      )}
      {pop && (
        <span
          className="animate-station-pop absolute -inset-3 z-0 rounded-3xl bg-white/50 shadow-[0_0_45px_rgba(255,255,255,0.85)] ring-4 ring-white"
          aria-hidden="true"
        />
      )}
      <div className={`relative z-[1] flex flex-col items-center ${alert ? 'animate-shake' : ''} ${pop ? 'animate-station-pop' : ''}`}>
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

function homePoint(stage) {
  const r = stage.getBoundingClientRect()
  return { x: r.width / 2, y: r.height * 0.22 }
}

function celebrateAt(rect) {
  const cx = (rect.left + rect.width / 2) / window.innerWidth
  const cy = (rect.top + rect.height * 0.45) / window.innerHeight
  const star = confetti.shapeFromText({ text: '⭐', scalar: 1.1 })
  const palette = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ffffff']
  confetti({ particleCount: 60, spread: 90, startVelocity: 40, angle: 90, origin: { x: cx, y: cy }, colors: palette })
  confetti({ particleCount: 26, spread: 100, startVelocity: 34, angle: 90, origin: { x: cx, y: cy - 0.08 }, colors: palette, shapes: [star, 'circle'], scalar: 1.05 })
  setTimeout(() => {
    confetti({ particleCount: 55, spread: 100, startVelocity: 45, angle: 60, origin: { x: 0.05, y: 0.9 }, colors: palette })
  }, 160)
  setTimeout(() => {
    confetti({ particleCount: 55, spread: 100, startVelocity: 45, angle: 120, origin: { x: 0.95, y: 0.9 }, colors: palette })
  }, 300)
}

export default function PolisiWarnaGame({ onExit }) {
  const [item, setItem] = useState(pickCar)
  const [phase, setPhase] = useState('idle')
  const [pos, setPos] = useState(null)
  const [burst, setBurst] = useState(null)
  const [wrongStation, setWrongStation] = useState(null)
  const [wrongMark, setWrongMark] = useState(null)
  const [rewardStation, setRewardStation] = useState(null)
  const stageRef = useRef(null)
  const stationRefs = useRef({})
  const posRef = useRef(null)

  function stageInfo(e) {
    const s = stageRef.current
    if (!s) return null
    const r = s.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top, r }
  }

  function onCarDown(e) {
    if (phase !== 'idle' || !stageRef.current) return
    e.preventDefault()
    const p = stageInfo(e)
    if (!p) return
    const w = p.r.width
    const x = Math.max(0, Math.min(w, p.x))
    const y = Math.max(0, Math.min(p.r.height, p.y))
    setPos({ x, y })
    posRef.current = { x, y }
    setPhase('dragging')
    playPick()
  }

  function onCarMove(e) {
    if (phase !== 'dragging') return
    e.preventDefault()
    const p = stageInfo(e)
    if (!p) return
    const x = Math.max(0, Math.min(p.r.width, p.x))
    const y = Math.max(0, Math.min(p.r.height, p.y))
    setPos({ x, y })
    posRef.current = { x, y }
  }

  function dropTarget(p) {
    const s = stageRef.current
    if (!s) return null
    const r = s.getBoundingClientRect()
    for (const st of STATIONS) {
      const el = stationRefs.current[st.id]
      if (!el) continue
      const br = el.getBoundingClientRect()
      const cx = br.left - r.left + br.width / 2
      const cy = br.top - r.top + br.height / 2
      if (Math.abs(p.x - cx) <= br.width * 0.85 && Math.abs(p.y - cy) <= br.height * 1.05) {
        return st
      }
    }
    return null
  }

  function onCarUp(e) {
    if (phase !== 'dragging') return
    e.preventDefault()
    const p = posRef.current
    if (!p) return
    const target = dropTarget(p)
    if (!target) {
      setPhase('idle')
      const s = stageRef.current
      if (s) setPos(homePoint(s))
      return
    }
    if (target.id === item.color) {
      succeedDrop()
    } else {
      wrongDrop(target, p)
    }
  }

  function onCarCancel() {
    if (phase !== 'dragging') return
    const s = stageRef.current
    if (s) setPos(homePoint(s))
    setPhase('idle')
  }

  function wrongDrop(target, p) {
    setWrongStation(target.id)
    setWrongMark({ key: Date.now(), x: p.x, y: p.y })
    setPhase('wrong')
    playBuzz()
    setTimeout(() => {
      setWrongStation(null)
      setWrongMark(null)
      setPhase('idle')
      if (stageRef.current) setPos(homePoint(stageRef.current))
    }, 800)
  }

  function succeedDrop() {
    setRewardStation(item.color)
    setPhase('success')
    playNino()
    playFanfare()
    const station = stationRefs.current[item.color]
    const stage = stageRef.current
    if (station && stage) {
      const sr = stage.getBoundingClientRect()
      const r = station.getBoundingClientRect()
      setBurst({
        key: item.id,
        x: r.left - sr.left + r.width / 2,
        y: r.top - sr.top + r.height * 0.4,
      })
      celebrateAt(r)
    }
    setTimeout(() => {
      setPhase('idle')
      setRewardStation(null)
      setBurst(null)
      setPos(homePoint(stageRef.current))
      setItem(pickCar())
    }, 1000)
  }

  const carStyle = {
    touchAction: 'none',
    transform: phase === 'success' ? 'translate(-50%,-50%) scale(0.5)' : 'translate(-50%,-50%)',
    transition:
      phase === 'dragging'
        ? 'none'
        : 'left 0.45s cubic-bezier(0.34,1.26,0.5,1), top 0.45s cubic-bezier(0.34,1.26,0.5,1), transform 0.35s ease',
  }
  if (pos) {
    carStyle.left = `${pos.x}px`
    carStyle.top = `${pos.y}px`
  } else {
    carStyle.left = '50%'
    carStyle.top = '22%'
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

      <div ref={stageRef} className="pointer-events-auto relative z-10 min-h-0 flex-1">
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
            <Station
              key={s.id}
              s={s}
              innerRef={(el) => (stationRefs.current[s.id] = el)}
              alert={wrongStation === s.id}
              pop={rewardStation === s.id}
            />
          ))}
        </div>

        {phase === 'wrong' && (
          <div className="animate-flash-red pointer-events-none absolute inset-0 z-40" aria-hidden="true" />
        )}

        {wrongMark && (
          <span
            key={wrongMark.key}
            className="animate-shake pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-1/2 text-7xl font-black text-red-600 drop-shadow-[0_0_18px_rgba(0,0,0,0.4)]"
            style={{ left: wrongMark.x, top: wrongMark.y }}
            aria-hidden="true"
          >
            ✗
          </span>
        )}

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
            {REWARD_EMOJI.map((r, i) => (
              <span
                key={i}
                className="animate-sparkle absolute -translate-x-1/2 -translate-y-1/2 text-3xl sm:text-5xl"
                style={{ '--dx': `${r.x}px`, '--dy': `${r.y}px` }}
              >
                {r.e}
              </span>
            ))}
            <span className="animate-pop-in absolute -translate-x-1/2 -translate-y-1/2 text-6xl sm:text-8xl">✨</span>
          </span>
        )}

        <div
          key={item.id}
          role="button"
          aria-label={`Drag the ${item.color} car to its station`}
          tabIndex={0}
          onPointerDown={onCarDown}
          onPointerMove={onCarMove}
          onPointerUp={onCarUp}
          onPointerCancel={onCarCancel}
          className={`absolute z-20 ${phase === 'idle' ? 'cursor-grab' : ''} ${phase === 'dragging' ? 'cursor-grabbing' : ''}`}
          style={carStyle}
        >
          <div className={pos === null ? 'animate-vehicle-drop' : ''}>
            <div
              className={`pointer-events-none ${phase === 'dragging' ? '' : 'animate-floaty'}`}
              style={{ animationDuration: '4.5s' }}
            >
              <img
                src={CAR_IMG[item.color]}
                alt=""
                draggable="false"
                className={`w-[min(46vmin,250px)] h-auto ${phase === 'wrong' ? 'animate-shake drop-shadow-[0_0_24px_rgba(239,68,68,0.95)]' : ''} ${phase === 'dragging' ? 'drop-shadow-[0_14px_18px_rgba(2,6,23,0.35)]' : 'drop-shadow-[0_8px_14px_rgba(2,6,23,0.25)]'}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}