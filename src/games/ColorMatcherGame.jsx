import { useRef, useState } from 'react'
import confetti from 'canvas-confetti'

const COLORS = [
  {
    id: 'red',
    en: 'RED',
    idLabel: 'Merah',
    stroke: 'ring-red-400',
    text: 'text-red-500',
    bin: 'from-red-400 to-red-700',
    glow: 'shadow-[0_0_60px_rgba(239,68,68,0.35)]',
  },
  {
    id: 'yellow',
    en: 'YELLOW',
    idLabel: 'Kuning',
    stroke: 'ring-amber-300',
    text: 'text-amber-500',
    bin: 'from-yellow-300 to-amber-500',
    glow: 'shadow-[0_0_60px_rgba(245,158,11,0.35)]',
  },
  {
    id: 'green',
    en: 'GREEN',
    idLabel: 'Hijau',
    stroke: 'ring-emerald-400',
    text: 'text-emerald-600',
    bin: 'from-green-400 to-emerald-700',
    glow: 'shadow-[0_0_60px_rgba(16,185,129,0.35)]',
  },
  {
    id: 'blue',
    en: 'BLUE',
    idLabel: 'Biru',
    stroke: 'ring-sky-400',
    text: 'text-sky-600',
    bin: 'from-sky-400 to-blue-700',
    glow: 'shadow-[0_0_60px_rgba(14,165,233,0.35)]',
  },
]

const ITEMS = {
  red: ['🍎', '🍒', '🌹', '🚗', '🧯', '❤️'],
  yellow: ['🍋', '🌻', '🐥', '⭐', '🍌', '🚕'],
  green: ['🥦', '🍀', '🐸', '🍏', '🌵', '🚜'],
  blue: ['🫐', '💧', '🐬', '🚙', '🌀', '👕'],
}

const BIN_POSITIONS = [
  'left-3 top-24 sm:left-8 sm:top-28',
  'right-3 top-24 sm:right-8 sm:top-28',
  'left-3 bottom-6 sm:left-8 sm:bottom-8',
  'right-3 bottom-6 sm:right-8 sm:bottom-8',
]

const STAR_DIRS = [
  { x: 0, y: -90 },
  { x: 75, y: -55 },
  { x: 90, y: 10 },
  { x: 55, y: 70 },
  { x: -55, y: 70 },
  { x: -90, y: 10 },
]

const CLOUDS = [
  { left: '12%', top: '18%', dur: '7s', delay: '0s', emoji: '☁️' },
  { left: '78%', top: '24%', dur: '9s', delay: '1.5s', emoji: '⛅' },
  { left: '5%', top: '70%', dur: '8s', delay: '0.8s', emoji: '☁️' },
  { left: '85%', top: '68%', dur: '10s', delay: '2s', emoji: '☁️' },
]

let audioCtx = null

function playPop() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)()
    const t = audioCtx.currentTime
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(620, t)
    osc.frequency.exponentialRampToValueAtTime(940, t + 0.12)
    gain.gain.setValueAtTime(0.32, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(t)
    osc.stop(t + 0.22)
  } catch {
    /* no audio */
  }
}

function playYay() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)()
    ;[523.25, 659.25, 783.99].forEach((f, i) => {
      const t = audioCtx.currentTime + i * 0.09
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = f
      gain.gain.setValueAtTime(0.26, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start(t)
      osc.stop(t + 0.32)
    })
  } catch {
    /* no audio */
  }
}

function pickItem() {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]
  const pool = ITEMS[color.id]
  const emoji = pool[Math.floor(Math.random() * pool.length)]
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, color: color.id, emoji }
}

function colorOf(id) {
  return COLORS.find((c) => c.id === id) || COLORS[0]
}

function ItemBubble({ colorId, emoji }) {
  const c = colorOf(colorId)
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 rounded-full border-[6px] border-white bg-white/95 px-7 py-4 shadow-2xl ring-8 ${c.stroke} ${c.glow}`}
    >
      <span className="text-[clamp(3rem,12vmin,5.5rem)] leading-none drop-shadow">{emoji}</span>
      <span className={`text-sm font-black tracking-widest uppercase ${c.text}`}>{c.idLabel}</span>
    </div>
  )
}

function Bin({ color, index, innerRef }) {
  return (
    <button
      ref={innerRef}
      type="button"
      aria-label={color.en}
      className={`absolute z-10 flex aspect-square w-[min(29vw,11rem)] flex-col items-center justify-center gap-0.5 rounded-[2rem] border-b-[10px] border-black/25 bg-gradient-to-b ${color.bin} text-white shadow-2xl transition-transform hover:scale-105 active:scale-95 sm:w-[min(13vw,13rem)] ${BIN_POSITIONS[index]}`}
    >
      <span className="text-base font-black tracking-widest drop-shadow sm:text-3xl">{color.en}</span>
      <span className="text-xs font-bold text-white/90 sm:text-xl">{color.idLabel}</span>
    </button>
  )
}

export default function ColorMatcherGame({ onExit }) {
  const [item, setItem] = useState(pickItem)
  const [flying, setFlying] = useState(null)
  const [burst, setBurst] = useState(null)
  const stageRef = useRef(null)
  const binRefs = useRef({})

  function launchItem() {
    if (flying) return
    const stage = stageRef.current
    const bin = binRefs.current[item.color]
    if (!stage || !bin) return
    const s = stage.getBoundingClientRect()
    const b = bin.getBoundingClientRect()
    setFlying({
      key: item.id,
      color: item.color,
      emoji: item.emoji,
      fx: b.left + b.width / 2 - (s.left + s.width / 2),
      fy: b.top + b.height / 2 - (s.top + s.height / 2),
    })
    playPop()
  }

  function handleLand() {
    const bin = binRefs.current[flying.color]
    const stage = stageRef.current
    if (bin && stage) {
      const r = bin.getBoundingClientRect()
      const sr = stage.getBoundingClientRect()
      setBurst({
        key: flying.key,
        x: r.left - sr.left + r.width / 2,
        y: r.top - sr.top + r.height / 2,
      })
      confetti({
        particleCount: 45,
        spread: 80,
        startVelocity: 30,
        origin: {
          x: (r.left + r.width / 2) / window.innerWidth,
          y: (r.top + r.height / 2) / window.innerHeight,
        },
        colors: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ffffff'],
        disableForReducedMotion: true,
      })
    }
    playYay()
    setFlying(null)
    setItem(pickItem())
  }

  return (
    <div className="flex h-dvh w-full touch-manipulation select-none flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-cyan-50 to-emerald-100">
      <header className="z-20 flex w-full shrink-0 items-center justify-between px-4 pt-4 sm:px-8 sm:pt-6">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold text-slate-600 shadow transition hover:scale-105 hover:bg-white sm:px-5 sm:text-base"
        >
          ‹ Keluar
        </button>
        <h1
          className="bg-gradient-to-r from-red-500 via-amber-500 to-sky-500 bg-clip-text text-[clamp(1.6rem,5.5vw,3rem)] font-black leading-none text-transparent drop-shadow-sm"
        >
          🎨 Color Matcher
        </h1>
        <span className="w-24 sm:w-28" aria-hidden="true" />
      </header>

      <p className="z-20 shrink-0 px-4 pt-2 text-center text-sm font-bold text-slate-600 sm:pt-3 sm:text-xl">
        Tap the object and watch it hop into its color bin! ·{' '}
        <span className="text-slate-500">Ketuk benda, lihat ia terbang ke wadah warnanya!</span>
      </p>

      <div ref={stageRef} className="relative z-10 min-h-0 flex-1">
        {CLOUDS.map((c, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="animate-floaty pointer-events-none absolute select-none text-5xl opacity-70 sm:text-7xl"
            style={{ left: c.left, top: c.top, animationDuration: c.dur, animationDelay: c.delay }}
          >
            {c.emoji}
          </span>
        ))}

        {COLORS.map((c, i) => (
          <Bin key={c.id} color={c} index={i} innerRef={(el) => (binRefs.current[c.id] = el)} />
        ))}

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
            <span className="animate-pop-in absolute -translate-x-1/2 -translate-y-1/2 text-5xl sm:text-7xl">
              ✨
            </span>
          </span>
        )}

        {flying ? (
          <span
            key={flying.key}
            onAnimationEnd={handleLand}
            className="animate-color-fly pointer-events-none absolute z-30"
            style={{
              left: '50%',
              top: '50%',
              '--fx': `${flying.fx}px`,
              '--fy': `${flying.fy}px`,
            }}
          >
            <ItemBubble colorId={flying.color} emoji={flying.emoji} />
          </span>
        ) : (
          <div key={item.id} className="animate-pop-in absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={launchItem}
              aria-label={`Tap the ${colorOf(item.color).en.toLowerCase()} object`}
              className="animate-floaty cursor-pointer rounded-full transition-transform hover:scale-110 active:scale-95"
            >
              <ItemBubble colorId={item.color} emoji={item.emoji} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}