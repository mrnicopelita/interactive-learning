import { useEffect, useMemo, useRef, useState } from 'react'

const KB_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]

const MAX_STARS = 4

const LEVELS = [
  {
    sub: 'Penyelamat Huruf',
    desc: 'Rescue floating letters by pressing the right key!',
    icon: '🎯',
    stars: 1,
    limit: 60,
    pace: null,
    items: () => ['A', 'E', 'I', 'O', 'U', 'T', 'K', 'S', 'R', 'N'],
  },
  {
    sub: 'Penyeimbang Gadget',
    desc: 'Type short words to stabilize gadgets!',
    icon: '📱',
    stars: 1,
    limit: 60,
    pace: null,
    items: () => ['HP', 'TV', 'TIK', 'AKU', 'ITU', 'PESAN', 'BUKU', 'LAPTOP'],
  },
  {
    sub: 'Pemancar Sinyal',
    desc: 'Type HALO and your name to send a signal back to Earth!',
    icon: '🚀',
    stars: 2,
    limit: 75,
    pace: { base: 6, perChar: 2 },
    items: (name) => ['HALO', name],
  },
  {
    sub: 'Rakit Satelit',
    desc: 'Type long space words before the signal bar runs out!',
    icon: '🛰️',
    stars: 2,
    limit: 75,
    pace: { base: 5, perChar: 1.8 },
    items: () => ['ROBOT', 'SATELIT', 'BINTANG', 'LANGIT', 'BULAN', 'BUMI', 'ORBIT'],
  },
  {
    sub: 'Misi Komunikasi',
    desc: 'Type full messages. Press the SPACEBAR between words!',
    icon: '📡',
    stars: 3,
    limit: 75,
    pace: { base: 5, perChar: 1.5 },
    items: () => ['DARI BUMI', 'TERIMA KASIH', 'SELAMAT DATANG'],
  },
  {
    sub: 'Radar Zip',
    desc: 'Type lowercase and mixed-case text. Upper or lower, both work!',
    icon: '🔤',
    stars: 3,
    limit: 90,
    pace: { base: 4, perChar: 1.2 },
    items: () => ['laut', 'awan', 'Planet', 'ROCKET', 'satelit kecil', 'bintang biru'],
  },
  {
    sub: 'Kode Frekuensi',
    desc: 'Type the numbers on the top row of the keyboard!',
    icon: '🔢',
    stars: 4,
    limit: 60,
    pace: { base: 4, perChar: 1.2 },
    items: () => ['1234', '90210', '505', '777', '24680', '13579'],
  },
  {
    sub: 'Pesan Rahasia',
    desc: 'Final mission: full messages with capitals, numbers and symbols!',
    icon: '🗝️',
    stars: 4,
    limit: 100,
    pace: { base: 7, perChar: 1.1 },
    items: () => ['KIRIM KE 24', 'KODE 7B2', 'DARI SATELIT 9!', 'JANGAN PANIK 100%'],
  },
]

function formatClock(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function paceFor(level, item) {
  const cfg = LEVELS[level]?.pace
  if (!cfg || !item) return null
  return (cfg.base + item.length * cfg.perChar) * 1000
}

function DifficultyStars({ value }) {
  return (
    <p className="text-lg leading-none sm:text-2xl" aria-label={`Tingkat kesulitan ${value} dari ${MAX_STARS}`}>
      <span aria-hidden="true">
        {'⭐'.repeat(value)}
        <span className="opacity-25">{'⭐'.repeat(MAX_STARS - value)}</span>
      </span>
    </p>
  )
}

const BLOCK_COLORS = [
  'from-cyan-400 to-blue-500',
  'from-pink-400 to-rose-500',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-green-500',
  'from-violet-400 to-purple-500',
]

const ENRICH_COLORS = [
  { label: 'Cyan', value: '#22d3ee', cls: 'bg-cyan-400' },
  { label: 'Pink', value: '#f472b6', cls: 'bg-pink-400' },
  { label: 'Green', value: '#4ade80', cls: 'bg-emerald-400' },
  { label: 'Yellow', value: '#facc15', cls: 'bg-yellow-400' },
  { label: 'Purple', value: '#c084fc', cls: 'bg-purple-400' },
]

const ENRICH_SIZES = [
  { label: 'S', cls: 'text-2xl' },
  { label: 'M', cls: 'text-4xl' },
  { label: 'L', cls: 'text-6xl' },
]

function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 55 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        sz: 1 + Math.random() * 2.5,
        op: 0.3 + Math.random() * 0.7,
        c: ['#fff', '#fde68a', '#93c5fd'][i % 3],
      })),
    [],
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full animate-floaty"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.sz,
            height: s.sz,
            backgroundColor: s.c,
            opacity: s.op,
            animationDelay: `${s.id * 180}ms`,
          }}
        />
      ))}
    </div>
  )
}

function FloatingLetter({ letter, state, color }) {
  return (
    <div
      className={`relative flex items-center justify-center ${
        state === 'correct' ? 'animate-typing-rescued' : 'animate-typing-float'
      }`}
    >
      <div
        className={`flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br ${color} text-6xl font-black text-white shadow-2xl transition-all duration-200 sm:h-36 sm:w-36 sm:text-7xl ${
          state === 'correct'
            ? 'ring-4 ring-emerald-300 scale-110'
            : state === 'wrong'
              ? 'animate-shake ring-4 ring-red-400'
              : ''
        }`}
        style={{ textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
      >
        {letter}
      </div>
    </div>
  )
}

function WordDisplay({ word, charIdx, color }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5">
      {word.split('').map((ch, i) => {
        if (ch === ' ') {
          return (
            <div
              key={i}
              className={`flex h-12 w-5 items-center justify-center rounded-lg text-sm font-black transition-all duration-200 sm:h-16 sm:w-7 sm:text-lg ${
                i === charIdx
                  ? `bg-gradient-to-br ${color} text-white shadow-lg ring-2 ring-white/50 animate-typing-glow`
                  : 'bg-white/10 text-white/30'
              }`}
            >
              <span aria-hidden="true">␣</span>
              <span className="sr-only">space</span>
            </div>
          )
        }
        return (
          <div
            key={i}
            className={`flex h-16 w-14 items-center justify-center rounded-2xl text-3xl font-black transition-all duration-200 sm:h-20 sm:w-16 sm:text-4xl ${
              i < charIdx
                ? 'bg-emerald-500/30 text-emerald-300'
                : i === charIdx
                  ? `bg-gradient-to-br ${color} text-white shadow-lg ring-2 ring-white/50 animate-typing-glow`
                  : 'bg-white/10 text-white/40'
            }`}
          >
            {i <= charIdx ? ch : '?'}
          </div>
        )
      })}
    </div>
  )
}

function PaceBar({ paceMs, total, timedOut }) {
  if (paceMs == null || !total) return null
  const pct = Math.max(0, Math.min(100, (paceMs / total) * 100))
  const tone = timedOut ? 'bg-amber-400' : pct <= 30 ? 'bg-red-400' : 'bg-emerald-400'
  return (
    <div className="w-full max-w-sm px-4 sm:max-w-md">
      <div
        className={`h-3 overflow-hidden rounded-full bg-white/15 ${timedOut ? 'animate-shake' : ''}`}
        role="progressbar"
        aria-label="Sinyal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-100 ease-linear ${tone}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function VirtualKeyboard({ target, wrongKey, extraKeys }) {
  return (
    <div className="pointer-events-none flex flex-col items-center gap-1.5 px-2 pb-2 pt-1 sm:gap-2 sm:px-4 sm:pb-3">
      {KB_ROWS.map((row, ri) => (
        <div key={ri} className="flex justify-center gap-1 sm:gap-1.5">
          {row.map((letter) => {
            const isTarget = target && letter === target.toUpperCase()
            const isWrong = wrongKey === letter
            return (
              <div
                key={letter}
                className={`flex h-11 w-[8.5%] max-w-12 items-center justify-center rounded-xl text-sm font-extrabold transition-all duration-150 sm:h-14 sm:max-w-14 sm:text-lg ${
                  isTarget
                    ? 'bg-cyan-400 text-slate-900 animate-typing-glow ring-2 ring-cyan-200 scale-110'
                    : isWrong
                      ? 'bg-red-500 text-white animate-shake'
                      : 'bg-white/15 text-white/80'
                }`}
              >
                {letter}
              </div>
            )
          })}
        </div>
      ))}
      {extraKeys.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <span className="px-1 text-[10px] font-extrabold tracking-wide text-white/40 uppercase sm:text-xs">
            Karakter
          </span>
          {extraKeys.map((ch) => (
            <div
              key={ch}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-extrabold transition-all duration-150 sm:h-11 sm:w-11 sm:text-lg ${
                target === ch
                  ? 'bg-cyan-400 text-slate-900 animate-typing-glow ring-2 ring-cyan-200 scale-110'
                  : 'bg-white/15 text-white/80'
              }`}
            >
              {ch}
            </div>
          ))}
        </div>
      )}
      <div className="flex w-full justify-center">
        <div
          className={`flex h-9 w-1/2 max-w-44 items-center justify-center rounded-xl text-[10px] font-extrabold tracking-wide transition-all duration-150 sm:h-11 sm:max-w-60 sm:text-xs ${
            target === ' '
              ? 'bg-cyan-400 text-slate-900 animate-typing-glow ring-2 ring-cyan-200 scale-105'
              : 'bg-white/10 text-white/60'
          }`}
        >
          SPASI
        </div>
      </div>
    </div>
  )
}

function ConfettiBurst({ trigger }) {
  const [particles, setParticles] = useState([])
  useEffect(() => {
    if (!trigger) return
    const burst = Array.from({ length: 20 }, (_, i) => ({
      id: `${trigger}-${i}`,
      cx: (Math.random() - 0.5) * 220,
      cy: -30 - Math.random() * 80,
      cr: Math.random() * 360,
      color: ['#fbbf24', '#38bdf8', '#34d399', '#fb7185', '#a78bfa'][i % 5],
      size: 8 + Math.random() * 10,
      delay: Math.random() * 150,
      ch: ['✦', '★', '●', '◆', '✧'][i % 5],
    }))
    setParticles(burst)
    const t = setTimeout(() => setParticles([]), 1000)
    return () => clearTimeout(t)
  }, [trigger])
  if (!particles.length) return null
  return (
    <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
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

function NameEntry({ onStart, onExit }) {
  const [name, setName] = useState('')
  const ready = name.trim().length > 0
  function begin(mode) {
    if (ready) onStart(name.trim(), mode)
  }
  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900">
      <Stars />
      <div className="z-10 flex w-full shrink-0 items-center justify-between px-4 pt-4 sm:px-6 sm:pt-5">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-indigo-700 shadow-lg transition hover:scale-105 sm:px-6 sm:py-3 sm:text-2xl"
        >
          <span aria-hidden="true" className="text-xl sm:text-3xl">←</span>
          Games
        </button>
        <div className="w-20 sm:w-32" />
      </div>
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6">
        <div className="animate-pop-in flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-10">
          <span className="text-5xl sm:text-6xl" aria-hidden="true">🛰️</span>
          <h1 className="text-[clamp(1.75rem,6vw,3rem)] font-extrabold leading-none text-slate-700">
            Typing <span className="text-indigo-600">Rescue</span>!
          </h1>
          <p className="text-sm font-bold text-slate-500 sm:text-base">
            Save the floating letters in space!
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
              maxLength={12}
              className="w-full rounded-2xl border-2 border-indigo-200 bg-indigo-50 px-4 py-3 text-center text-xl font-extrabold text-slate-700 outline-none placeholder:font-semibold placeholder:text-slate-400 focus:border-indigo-500 sm:text-2xl"
            />
          </label>

          <div className="mt-1 w-full rounded-2xl bg-indigo-50 p-3 text-left">
            <p className="mb-2 text-center text-xs font-extrabold tracking-wide text-indigo-700 uppercase">
              Choose your mode
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                disabled={!ready}
                onClick={() => begin('practice')}
                className="flex flex-col items-center gap-0.5 rounded-2xl bg-cyan-500 px-4 py-3 text-white shadow transition hover:scale-[1.03] disabled:pointer-events-none disabled:opacity-40"
              >
                <span className="text-lg font-extrabold sm:text-xl">Practice 🛸</span>
                <span className="text-[11px] font-bold text-white/85 sm:text-xs">
                  No timer. Learn at your pace.
                </span>
              </button>
              <button
                type="button"
                disabled={!ready}
                onClick={() => begin('perform')}
                className="flex flex-col items-center gap-0.5 rounded-2xl bg-amber-500 px-4 py-3 text-white shadow transition hover:scale-[1.03] disabled:pointer-events-none disabled:opacity-40"
              >
                <span className="text-lg font-extrabold sm:text-xl">Perform ⏱️</span>
                <span className="text-[11px] font-bold text-white/85 sm:text-xs">
                  Countdown on. Beat the clock!
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function LevelIntro({ level, isPerform, onNext, onExit }) {
  const info = LEVELS[level]
  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900">
      <Stars />
      <div className="z-10 flex w-full shrink-0 items-center justify-between px-4 pt-4 sm:px-6 sm:pt-5">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-indigo-700 shadow-lg transition hover:scale-105 sm:px-6 sm:py-3 sm:text-2xl"
        >
          <span aria-hidden="true" className="text-xl sm:text-3xl">←</span>
          Games
        </button>
        <div className="w-20 sm:w-32" />
      </div>
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6">
        <div className="animate-pop-in flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-10">
          <span className="text-5xl sm:text-6xl" aria-hidden="true">{info.icon}</span>
          <h1 className="text-[clamp(1.5rem,5vw,2.5rem)] font-extrabold text-slate-700">
            Level {level + 1}
          </h1>
          <p className="text-lg font-bold text-indigo-600">{info.sub}</p>
          <DifficultyStars value={info.stars} />
          <p className="text-sm text-slate-500 sm:text-base">{info.desc}</p>
          {isPerform && (
            <p className="rounded-full bg-amber-100 px-4 py-1.5 text-sm font-extrabold text-amber-700 sm:text-base">
              <span aria-hidden="true">⏱️</span> {formatClock(info.limit)} to finish this level
            </p>
          )}
          <button
            type="button"
            onClick={onNext}
            className="w-full rounded-full bg-cyan-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl"
          >
            Go! 🚀
          </button>
        </div>
      </main>
    </div>
  )
}

function LevelComplete({ level, onNext, onExit, enrichFont, setEnrichFont, enrichColor, setEnrichColor }) {
  const isLast = level === LEVELS.length - 1
  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900">
      <Stars />
      <div className="z-10 flex w-full shrink-0 items-center justify-between px-4 pt-4 sm:px-6 sm:pt-5">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-indigo-700 shadow-lg transition hover:scale-105 sm:px-6 sm:py-3 sm:text-2xl"
        >
          <span aria-hidden="true" className="text-xl sm:text-3xl">←</span>
          Games
        </button>
        <div className="w-20 sm:w-32" />
      </div>
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6">
        <div className="animate-pop-in flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-10">
          <span className="text-5xl sm:text-6xl" aria-hidden="true">🎉</span>
          <h1 className="text-[clamp(1.5rem,5vw,2.5rem)] font-extrabold text-slate-700">
            Level {level + 1} Complete!
          </h1>
          <p className="text-sm font-bold text-emerald-600 sm:text-base">
            Mission successful!
          </p>

          {isLast && (
            <div className="mt-2 w-full rounded-2xl bg-indigo-50 p-4 text-left">
              <p className="mb-3 text-center text-sm font-extrabold text-indigo-700 uppercase">
                Enrichment: Customize Your Laser!
              </p>
              <div className="mb-3">
                <p className="mb-1 text-xs font-bold text-slate-500">Font Size</p>
                <div className="flex gap-2">
                  {ENRICH_SIZES.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setEnrichFont(s.cls)}
                      className={`flex-1 rounded-xl px-3 py-2 text-sm font-extrabold transition ${
                        enrichFont === s.cls
                          ? 'bg-indigo-500 text-white'
                          : 'bg-white text-slate-600'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold text-slate-500">Laser Color</p>
                <div className="flex gap-2">
                  {ENRICH_COLORS.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => setEnrichColor(c.value)}
                      className={`flex-1 rounded-xl px-2 py-2 text-xs font-extrabold text-white transition ${
                        c.cls
                      } ${
                        enrichColor === c.value
                          ? 'ring-2 ring-offset-1 ring-indigo-500'
                          : ''
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-center gap-3">
                <span
                  className={enrichFont}
                  style={{
                    color: enrichColor,
                    textShadow: `0 0 12px ${enrichColor}`,
                  }}
                >
                  A
                </span>
                <span className="text-2xl">→</span>
                <span className="text-3xl">🛰️</span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onNext}
            className="w-full rounded-full bg-cyan-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl"
          >
            {isLast ? 'Mission Complete! 🏆' : 'Next Level →'}
          </button>
        </div>
      </main>
    </div>
  )
}

function GameComplete({ name, onExit }) {
  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900">
      <Stars />
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6">
        <div className="animate-pop-in flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-10">
          <span className="text-6xl sm:text-7xl" aria-hidden="true">🏆</span>
          <h1 className="text-[clamp(1.75rem,6vw,3rem)] font-extrabold text-slate-700">
            Mission Complete!
          </h1>
          <p className="text-base font-bold text-slate-500">
            Great job, <span className="text-cyan-600">{name}</span>! You rescued all the letters!
          </p>
          <button
            type="button"
            onClick={onExit}
            className="w-full rounded-full bg-indigo-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl"
          >
            Back to Games 🎮
          </button>
        </div>
      </main>
    </div>
  )
}

function RunOver({ name, level, onRetry, onExit }) {
  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900">
      <Stars />
      <div className="z-10 flex w-full shrink-0 items-center justify-between px-4 pt-4 sm:px-6 sm:pt-5">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-indigo-700 shadow-lg transition hover:scale-105 sm:px-6 sm:py-3 sm:text-2xl"
        >
          <span aria-hidden="true" className="text-xl sm:text-3xl">←</span>
          Games
        </button>
        <div className="w-20 sm:w-32" />
      </div>
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6">
        <div className="animate-pop-in flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-10">
          <span className="text-6xl sm:text-7xl" aria-hidden="true">⏱️</span>
          <h1 className="text-[clamp(1.5rem,5vw,2.5rem)] font-extrabold text-slate-700">
            Time&apos;s Up!
          </h1>
          <p className="text-base font-bold text-slate-500">
            <span className="text-cyan-600">{name}</span>, the countdown reached zero on Level{' '}
            {level + 1} — {LEVELS[level].sub}.
          </p>
          <p className="text-sm font-semibold text-slate-400">
            You reached Level {level + 1} of {LEVELS.length}. Try Practice mode to warm up first!
          </p>
          <div className="mt-1 flex w-full flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onRetry}
              className="flex-1 rounded-full bg-amber-500 px-6 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl"
            >
              Try Again ↻
            </button>
            <button
              type="button"
              onClick={onExit}
              className="flex-1 rounded-full bg-indigo-500 px-6 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl"
            >
              Back to Games 🎮
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function TypingGame({ onExit }) {
  const [screen, setScreen] = useState('entry')
  const [playerName, setPlayerName] = useState('')
  const [level, setLevel] = useState(0)
  const [itemIdx, setItemIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [wrongKey, setWrongKey] = useState(null)
  const [confettiTrigger, setConfettiTrigger] = useState(0)
  const [paceMs, setPaceMs] = useState(null)
  const [timedOut, setTimedOut] = useState(false)
  const [mode, setMode] = useState('practice')
  const [timeLeft, setTimeLeft] = useState(null)
  const [enrichFont, setEnrichFont] = useState('text-4xl')
  const [enrichColor, setEnrichColor] = useState('#22d3ee')

  const cleanName = useMemo(
    () => playerName.toUpperCase().replace(/[^A-Z]/g, '') || 'PILOT',
    [playerName],
  )

  const currentLevelItems = useMemo(
    () => LEVELS[level]?.items(cleanName) ?? [],
    [level, cleanName],
  )
  const currentItem = currentLevelItems[itemIdx] || ''
  const target = typeof currentItem === 'string' && charIdx < currentItem.length ? currentItem[charIdx] : null
  const color = BLOCK_COLORS[itemIdx % BLOCK_COLORS.length]

  const paceMax = useMemo(
    () => (mode === 'perform' ? paceFor(level, currentItem) : null),
    [mode, level, currentItem],
  )

  const isPerform = mode === 'perform'

  const extraKeys = useMemo(() => {
    const found = new Set()
    for (const item of currentLevelItems) {
      for (const ch of String(item)) {
        if (ch !== ' ' && !/[A-Z]/i.test(ch)) found.add(ch)
      }
    }
    return [...found]
  }, [currentLevelItems])

  const stateRef = useRef({})
  stateRef.current = { target, feedback, charIdx, currentItem, itemIdx, currentLevelItems, level, timedOut }

  function processKey(pressedKey) {
    const s = stateRef.current
    if (!s.target || s.timedOut || s.feedback === 'correct' || s.feedback === 'wrong') return
    const key = pressedKey.toUpperCase()
    if (key === s.target.toUpperCase()) {
      setFeedback('correct')
      if (s.charIdx < s.currentItem.length - 1) {
        setTimeout(() => {
          setCharIdx((c) => c + 1)
          setFeedback(null)
        }, 300)
      } else {
        setConfettiTrigger((t) => t + 1)
        if (s.itemIdx < s.currentLevelItems.length - 1) {
          setTimeout(() => {
            setItemIdx((i) => i + 1)
            setCharIdx(0)
            setFeedback(null)
          }, 500)
        } else {
          setTimeout(() => {
            setScreen('level-complete')
            setFeedback(null)
          }, 600)
        }
      }
    } else {
      setFeedback('wrong')
      setWrongKey(key)
      setTimeout(() => {
        setFeedback(null)
        setWrongKey(null)
      }, 500)
    }
  }

  useEffect(() => {
    if (screen !== 'playing') return
    const handler = (e) => {
      if (e.repeat || e.key.length !== 1) return
      e.preventDefault()
      processKey(e.key)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [screen])

  useEffect(() => {
    setPaceMs(paceMax)
    setTimedOut(false)
  }, [screen, level, itemIdx, paceMax])

  useEffect(() => {
    if (screen !== 'playing' || paceMs == null || timedOut || feedback) return
    const t = setTimeout(() => {
      setPaceMs((v) => (v == null ? null : Math.max(0, v - 100)))
    }, 100)
    return () => clearTimeout(t)
  }, [screen, paceMs, timedOut, feedback])

  useEffect(() => {
    if (paceMs !== 0 || screen !== 'playing') return
    setTimedOut(true)
    setPaceMs(paceMax)
    const t = setTimeout(() => setTimedOut(false), 700)
    return () => clearTimeout(t)
  }, [paceMs, screen, paceMax])

  useEffect(() => {
    if (screen !== 'playing' || !isPerform || timeLeft == null || timeLeft <= 0) return
    const t = setTimeout(() => setTimeLeft((v) => Math.max(0, (v ?? 0) - 1)), 1000)
    return () => clearTimeout(t)
  }, [screen, isPerform, timeLeft])

  useEffect(() => {
    if (isPerform && timeLeft === 0 && screen === 'playing') setScreen('run-over')
  }, [isPerform, timeLeft, screen])

  function startLevel(lvl, m = mode) {
    setLevel(lvl)
    setItemIdx(0)
    setCharIdx(0)
    setFeedback(null)
    setWrongKey(null)
    setTimeLeft(m === 'perform' ? LEVELS[lvl].limit : null)
    setScreen('level-intro')
  }

  function nextLevel() {
    if (level < LEVELS.length - 1) {
      startLevel(level + 1)
    } else {
      setScreen('game-complete')
    }
  }

  if (screen === 'entry') {
    return (
      <NameEntry
        onStart={(n, m) => {
          setPlayerName(n)
          setMode(m)
          startLevel(0, m)
        }}
        onExit={onExit}
      />
    )
  }
  if (screen === 'run-over') {
    return (
      <RunOver
        name={playerName}
        level={level}
        onRetry={() => startLevel(0)}
        onExit={onExit}
      />
    )
  }
  if (screen === 'level-intro') {
    return <LevelIntro level={level} isPerform={isPerform} onNext={() => setScreen('playing')} onExit={onExit} />
  }
  if (screen === 'level-complete') {
    return (
      <LevelComplete
        level={level}
        onNext={nextLevel}
        onExit={onExit}
        enrichFont={enrichFont}
        setEnrichFont={setEnrichFont}
        enrichColor={enrichColor}
        setEnrichColor={setEnrichColor}
      />
    )
  }
  if (screen === 'game-complete') {
    return <GameComplete name={playerName} onExit={onExit} />
  }

  const totalItems = currentLevelItems.length
  const progress = `${itemIdx + 1} / ${totalItems}`

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900">
      <Stars />

      <div className="z-10 flex w-full shrink-0 items-center justify-between px-4 pt-3 sm:px-6 sm:pt-4">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-sm font-extrabold text-indigo-700 shadow transition hover:scale-105 sm:px-4 sm:py-2 sm:text-lg"
        >
          <span aria-hidden="true">←</span> Exit
        </button>
        <div className="text-center">
          <p className="text-[10px] font-extrabold text-cyan-400 uppercase sm:text-xs">
            Level {level + 1} · {LEVELS[level].sub}
          </p>
          <p className="text-xs font-bold text-white/60">{progress}</p>
          <div className="mt-0.5 flex items-center justify-center gap-1.5">
            {isPerform && timeLeft != null && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold tabular-nums sm:text-sm ${
                  timeLeft <= 15
                    ? 'animate-shake bg-red-500 text-white'
                    : 'bg-amber-400/90 text-slate-900'
                }`}
                aria-live="off"
              >
                <span aria-hidden="true">⏱️</span> {formatClock(timeLeft)}
              </span>
            )}
            <span className="text-[11px] sm:text-sm">
              <span aria-hidden="true">{'⭐'.repeat(LEVELS[level].stars)}</span>
              <span className="sr-only">Kesulitan {LEVELS[level].stars} dari {MAX_STARS}</span>
            </span>
          </div>
        </div>
        <div className="w-16 sm:w-24" />
      </div>

      <div className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4">
        <div className="absolute top-12 left-8 text-2xl opacity-40 sm:text-3xl">🛰️</div>
        <div className="absolute top-16 right-12 text-xl opacity-30 sm:text-2xl">🪐</div>

        <div className="flex h-10 items-center justify-center sm:h-12">
          {feedback === 'correct' && (
            <div className="animate-pop-in rounded-2xl bg-emerald-500/90 px-5 py-2 shadow-md sm:px-8">
              <p className="text-lg font-extrabold text-white sm:text-xl">Rescued! ✨</p>
            </div>
          )}
          {feedback === 'wrong' && (
            <div className="animate-pop-in rounded-2xl bg-red-500/90 px-5 py-2 shadow-md sm:px-8">
              <p className="text-lg font-extrabold text-white sm:text-xl">Try again! 🔄</p>
            </div>
          )}
          {timedOut && (
            <div className="animate-pop-in rounded-2xl bg-amber-500/90 px-5 py-2 shadow-md sm:px-8">
              <p className="text-lg font-extrabold text-white sm:text-xl">Sinyal hilang, coba lagi! ⏱️</p>
            </div>
          )}
          {!feedback && !timedOut && target && (
            <p className="text-sm font-bold text-cyan-300 sm:text-base">
              {target === ' ' ? (
                <>Tekan <span className="text-white font-black">SPASI</span> untuk spasi</>
              ) : /[A-Z]/i.test(target) ? (
                <>
                  Ketik huruf{' '}
                  <span className="font-black text-white uppercase">{target}</span> di keyboard
                </>
              ) : (
                <>
                  Ketik karakter{' '}
                  <span className="font-black text-white">{target}</span> di keyboard
                </>
              )}
            </p>
          )}
        </div>

        <div className="relative flex items-center justify-center" style={{ minHeight: '140px' }}>
          {level === 0 ? (
            <FloatingLetter
              key={`${level}-${itemIdx}`}
              letter={currentItem}
              state={feedback}
              color={color}
            />
          ) : (
            <WordDisplay
              key={`${level}-${itemIdx}`}
              word={currentItem}
              charIdx={charIdx}
              color={color}
            />
          )}
          <ConfettiBurst trigger={confettiTrigger} />
        </div>

        <PaceBar paceMs={paceMs} total={paceMax} timedOut={timedOut} />
      </div>

      <div className="z-10 shrink-0">
        <p className="mb-1 text-center text-[10px] font-bold text-white/40 sm:text-xs">
          ⌨️ Ketik langsung pada keyboard fisik
        </p>
        <VirtualKeyboard target={target} wrongKey={wrongKey} extraKeys={extraKeys} />
      </div>
    </div>
  )
}
