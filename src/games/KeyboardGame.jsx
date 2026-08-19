import { useEffect, useState } from 'react'

const ANIM_MS = 1400

const KEYS = {
  space: {
    label: 'Spacebar',
    sub: 'The Giant Jumper',
    icon: '⭐',
    ring: 'ring-sky-300',
    bg: 'bg-sky-500',
    bgOff: 'bg-white/95',
    txt: 'text-white',
    msg: 'BOING! Spacebar makes BIG spaces!',
  },
  enter: {
    label: 'Enter',
    sub: 'The Rocket Launch',
    icon: '🚀',
    ring: 'ring-emerald-300',
    bg: 'bg-emerald-500',
    bgOff: 'bg-white/95',
    txt: 'text-white',
    msg: 'GO! GO! GO!',
  },
  shift: {
    label: 'Shift',
    sub: 'The Magic Transformer',
    icon: '✨',
    ring: 'ring-amber-300',
    bg: 'bg-amber-400',
    bgOff: 'bg-white/95',
    txt: 'text-amber-900',
    msg: 'Abracadabra! abc → ABC!',
  },
  escape: {
    label: 'Escape',
    sub: 'The Safe Hideout',
    icon: '🏠',
    ring: 'ring-rose-300',
    bg: 'bg-rose-500',
    bgOff: 'bg-white/95',
    txt: 'text-white',
    msg: 'Shhh! Safe in the hideout!',
  },
}

function NameEntry({ onStart, onExit }) {
  const [name, setName] = useState('')

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-amber-200 via-orange-100 to-rose-200">
      <div className="z-10 flex w-full shrink-0 items-center justify-between px-4 pt-4 sm:px-6 sm:pt-5">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-amber-700 shadow-lg transition hover:scale-105 sm:px-6 sm:py-3 sm:text-2xl"
        >
          <span aria-hidden="true" className="text-xl sm:text-3xl">←</span>
          Games
        </button>
        <div className="w-20 sm:w-32" aria-hidden="true" />
      </div>

      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (name.trim()) onStart(name.trim())
          }}
          className="animate-pop-in flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-10"
        >
          <span className="text-5xl sm:text-6xl" aria-hidden="true">⌨️</span>
          <h1 className="text-[clamp(1.75rem,6vw,3rem)] font-extrabold leading-none text-slate-700">
            Learn the Keyboard!
          </h1>
          <p className="text-sm font-bold text-slate-500 sm:text-base">
            Tap a key or press it on the keyboard!
          </p>

          <label className="flex w-full flex-col gap-2 text-left">
            <span className="text-sm font-extrabold tracking-wide text-slate-600 uppercase">
              Your name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type your name…"
              autoComplete="off"
              autoFocus
              className="w-full rounded-2xl border-2 border-amber-200 bg-amber-50 px-4 py-3 text-center text-xl font-extrabold text-slate-700 outline-none placeholder:font-semibold placeholder:text-slate-400 focus:border-amber-500 sm:text-2xl"
            />
          </label>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full rounded-full bg-emerald-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 disabled:pointer-events-none disabled:opacity-40 sm:text-2xl"
          >
            Let's Play! 🎮
          </button>
        </form>
      </main>
    </div>
  )
}

function ConfettiBurst({ trigger }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (trigger === 0) return
    const burst = Array.from({ length: 24 }, (_, i) => ({
      id: `${trigger}-${i}`,
      cx: (Math.random() - 0.5) * 260,
      cy: -40 - Math.random() * 80,
      cr: Math.random() * 360,
      color: ['#fbbf24', '#38bdf8', '#34d399', '#fb7185', '#a78bfa', '#f59e0b'][
        i % 6
      ],
      size: 10 + Math.random() * 12,
      delay: Math.random() * 180,
      ch: ['✦', '★', '♪', '●', '◆'][i % 5],
    }))
    setParticles(burst)
    const t = setTimeout(() => setParticles([]), 1200)
    return () => clearTimeout(t)
  }, [trigger])

  if (!particles.length) return null

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="animate-confetti absolute"
          style={{
            '--cx': `${p.cx}px`,
            '--cy': `${p.cy}px`,
            '--cr': `${p.cr}deg`,
            color: p.color,
            fontSize: `${p.size}px`,
            lineHeight: 1,
            animationDelay: `${p.delay}ms`,
          }}
        >
          {p.ch}
        </span>
      ))}
    </span>
  )
}

function Stage({ activeAction, animKey, shiftOn, escapeOn }) {
  const showJump = activeAction === 'space'
  const showRocket = activeAction === 'enter'
  const showShiftFx = activeAction === 'shift' || shiftOn
  const showHideout = activeAction === 'escape' || escapeOn

  return (
    <div className="relative flex w-full flex-1 items-end justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-sky-300 to-sky-100 shadow-inner">
      {/* sky */}
      <span className="absolute top-3 left-6 text-2xl sm:text-3xl">☁️</span>
      <span className="absolute top-8 right-10 text-3xl sm:text-4xl">☀️</span>
      <span className="absolute top-4 right-1/4 text-xl sm:text-2xl">☁️</span>

      {/* ground */}
      <div className="absolute bottom-0 flex w-full items-end justify-between px-4">
        <span className="text-3xl sm:text-4xl">🌿</span>
        <span className="text-2xl sm:text-3xl">🌸</span>
        <span className="text-3xl sm:text-4xl">🌳</span>
        <span className="text-2xl sm:text-3xl">🌷</span>
        <span className="text-3xl sm:text-4xl">🌿</span>
      </div>

      {/* water gap */}
      {showJump && (
        <div className="absolute bottom-0 right-1/4 h-10 w-20 rounded-t bg-sky-400/60 sm:w-28" />
      )}

      {/* house */}
      <div
        className={`absolute bottom-6 left-6 text-6xl transition-opacity duration-300 sm:text-7xl ${
          showHideout ? 'opacity-100' : 'opacity-30'
        }`}
      >
        🏠
      </div>

      {/* character */}
      <div
        key={animKey}
        className="absolute bottom-10 text-6xl sm:text-7xl"
        style={{
          animation:
            showJump
              ? 'kb-jump 1s ease-in-out forwards'
              : showRocket
                ? 'kb-rocket 1.4s ease-in forwards'
                : showHideout
                  ? 'kb-hide 0.5s ease-in forwards'
                  : undefined,
          filter: shiftOn ? 'drop-shadow(0 0 12px rgba(251,191,36,0.8))' : undefined,
        }}
      >
        {showHideout && (
          <span className="absolute -top-4 left-2 text-2xl sm:text-3xl">💤</span>
        )}
        <span className="relative inline-block">
          {shiftOn && (
            <span className="absolute -top-3 -right-7 text-3xl sm:text-4xl">🦸</span>
          )}
          🐥
        </span>
      </div>

      {/* abc / ABC */}
      {showShiftFx && (
        <div
          key={`abc-${animKey}`}
          className="animate-pop-in absolute top-1/4 left-1/2 -translate-x-1/2"
        >
          <p
            className={`text-4xl font-black sm:text-5xl ${
              shiftOn ? 'text-amber-600' : 'text-slate-400'
            }`}
          >
            {shiftOn ? 'A B C' : 'a b c'}
          </p>
        </div>
      )}

      {/* confetti for enter */}
      {activeAction === 'enter' && <ConfettiBurst trigger={animKey} />}

      {/* key label badge */}
      {activeAction && (
        <div
          key={`badge-${animKey}`}
          className="animate-pop-in absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold text-slate-600 shadow sm:text-xs"
        >
          ⌨️ {KEYS[activeAction].label}
        </div>
      )}
    </div>
  )
}

function KeyboardStage({ onExit, studentName }) {
  const [activeAction, setActiveAction] = useState(null)
  const [animKey, setAnimKey] = useState(0)
  const [shiftOn, setShiftOn] = useState(false)
  const [escapeOn, setEscapeOn] = useState(false)

  const trigger = (action) => {
    if (action === 'shift') {
      setShiftOn((v) => !v)
    } else if (action === 'escape') {
      setEscapeOn((v) => !v)
    }
    setAnimKey((k) => k + 1)
    setActiveAction(action)
    setTimeout(() => setActiveAction(null), ANIM_MS)
  }

  useEffect(() => {
    const map = { ' ': 'space', Enter: 'enter', Shift: 'shift', Escape: 'escape' }
    const down = (e) => {
      if (map[e.code] && !e.repeat) {
        e.preventDefault()
        trigger(map[e.code])
      }
    }
    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [])

  const message = activeAction ? KEYS[activeAction].msg : 'Tap a key or press it on the keyboard!'

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-amber-200 via-orange-100 to-rose-200">
      {/* header */}
      <div className="z-10 flex w-full shrink-0 items-center justify-between gap-2 px-4 pt-4 sm:px-6 sm:pt-5">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-amber-700 shadow-lg transition hover:scale-105 sm:px-6 sm:py-3 sm:text-2xl"
        >
          <span aria-hidden="true" className="text-xl sm:text-3xl">←</span>
          Games
        </button>
        <h1 className="text-[clamp(2rem,6vw,3rem)] font-extrabold leading-none text-slate-700">
          ⌨️ Keyboard
        </h1>
        <div className="w-20 sm:w-32" aria-hidden="true" />
      </div>

      {/* greeting */}
      <div className="z-10 flex justify-center px-4 pt-2">
        <p className="text-xs font-extrabold tracking-wide text-slate-500 uppercase sm:text-sm">
          Hi, {studentName}! ⌨️
        </p>
      </div>

      {/* stage */}
      <main className="z-10 flex min-h-0 flex-1 flex-col gap-2 px-4 pt-2 pb-2 sm:px-6">
        {/* message */}
        <div className="flex h-10 items-center justify-center sm:h-12">
          {activeAction && (
            <div
              key={`msg-${animKey}`}
              className="animate-pop-in rounded-2xl bg-white/95 px-5 py-2 shadow-md sm:px-8"
            >
              <p className="text-lg font-extrabold text-slate-700 sm:text-xl">
                {KEYS[activeAction].msg}
              </p>
            </div>
          )}
          {!activeAction && (
            <p className="text-xs font-bold text-slate-400 sm:text-sm">{message}</p>
          )}
        </div>

        <Stage
          activeAction={activeAction}
          animKey={animKey}
          shiftOn={shiftOn}
          escapeOn={escapeOn}
        />
      </main>

      {/* key buttons */}
      <div className="z-10 flex w-full shrink-0 justify-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        {Object.entries(KEYS).map(([key, cfg]) => {
          const on =
            activeAction === key ||
            (key === 'shift' && shiftOn) ||
            (key === 'escape' && escapeOn)
          return (
            <button
              key={key}
              type="button"
              onClick={() => trigger(key)}
              className={`flex flex-1 max-w-[10rem] flex-col items-center gap-1 rounded-2xl px-2 py-4 text-center shadow-lg transition hover:scale-105 active:scale-95 sm:rounded-3xl sm:gap-2 sm:px-3 sm:py-5 ${
                on
                  ? `${cfg.bg} ring-4 ${cfg.ring} ${cfg.txt}`
                  : `${cfg.bgOff} hover:bg-gray-100`
              }`}
            >
              <span className="text-3xl sm:text-4xl" aria-hidden="true">
                {cfg.icon}
              </span>
              <span
                className={`text-xs font-extrabold leading-tight sm:text-sm ${
                  on ? '' : 'text-slate-700'
                }`}
              >
                {cfg.label}
              </span>
              <span
                className={`hidden text-[10px] font-bold sm:block sm:text-xs ${
                  on ? 'opacity-80' : 'text-slate-400'
                }`}
              >
                {cfg.sub}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function KeyboardGame({ onExit }) {
  const [status, setStatus] = useState('entry')
  const [name, setName] = useState('')

  if (status === 'entry') {
    return (
      <NameEntry
        onStart={(n) => {
          setName(n)
          setStatus('playing')
        }}
        onExit={onExit}
      />
    )
  }

  return <KeyboardStage onExit={onExit} studentName={name} />
}
