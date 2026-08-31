import { useEffect, useMemo, useRef, useState } from 'react'

const KB_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]

const LEVEL1_ITEMS = ['A', 'E', 'I', 'O', 'U', 'T', 'K', 'S', 'R', 'N']
const LEVEL2_ITEMS = ['HP', 'TV', 'TIK', 'AKU', 'ITU']

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

const LEVEL_META = [
  { title: 'Level 1', sub: 'Penyelamat Huruf', desc: 'Rescue floating letters by pressing the right key!', icon: '🎯' },
  { title: 'Level 2', sub: 'Penyeimbang Gadget', desc: 'Type short words to stabilize gadgets!', icon: '📱' },
  { title: 'Level 3', sub: 'Pemancar Sinyal', desc: 'Type HALO and your name to send a signal back to Earth!', icon: '🚀' },
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
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {word.split('').map((ch, i) => (
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
      ))}
    </div>
  )
}

function VirtualKeyboard({ target, wrongKey }) {
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
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (name.trim()) onStart(name.trim())
          }}
          className="animate-pop-in flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-10"
        >
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
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full rounded-full bg-cyan-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 disabled:pointer-events-none disabled:opacity-40 sm:text-2xl"
          >
            Start Mission! 🚀
          </button>
        </form>
      </main>
    </div>
  )
}

function LevelIntro({ level, onNext, onExit }) {
  const info = LEVEL_META[level]
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
            {info.title}
          </h1>
          <p className="text-lg font-bold text-indigo-600">{info.sub}</p>
          <p className="text-sm text-slate-500 sm:text-base">{info.desc}</p>
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
  const isLast = level === 2
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

export default function TypingGame({ onExit }) {
  const [screen, setScreen] = useState('entry')
  const [playerName, setPlayerName] = useState('')
  const [level, setLevel] = useState(0)
  const [itemIdx, setItemIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [wrongKey, setWrongKey] = useState(null)
  const [confettiTrigger, setConfettiTrigger] = useState(0)
  const [enrichFont, setEnrichFont] = useState('text-4xl')
  const [enrichColor, setEnrichColor] = useState('#22d3ee')

  const cleanName = useMemo(
    () => playerName.toUpperCase().replace(/[^A-Z]/g, '') || 'PILOT',
    [playerName],
  )

  const levelItems = useMemo(
    () => [LEVEL1_ITEMS, LEVEL2_ITEMS, ['HALO', cleanName]],
    [cleanName],
  )

  const currentLevelItems = levelItems[level] || []
  const currentItem = currentLevelItems[itemIdx] || ''
  const target = typeof currentItem === 'string' && charIdx < currentItem.length ? currentItem[charIdx] : null
  const color = BLOCK_COLORS[itemIdx % BLOCK_COLORS.length]

  const stateRef = useRef({})
  stateRef.current = { target, feedback, charIdx, currentItem, itemIdx, currentLevelItems, level }

  function processKey(pressedKey) {
    const s = stateRef.current
    if (!s.target || s.feedback === 'correct' || s.feedback === 'wrong') return
    const key = pressedKey.toUpperCase()
    if (key === s.target) {
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

  function startLevel(lvl) {
    setLevel(lvl)
    setItemIdx(0)
    setCharIdx(0)
    setFeedback(null)
    setWrongKey(null)
    setScreen('level-intro')
  }

  function nextLevel() {
    if (level < 2) {
      startLevel(level + 1)
    } else {
      setScreen('game-complete')
    }
  }

  if (screen === 'entry') {
    return (
      <NameEntry
        onStart={(n) => {
          setPlayerName(n)
          startLevel(0)
        }}
        onExit={onExit}
      />
    )
  }
  if (screen === 'level-intro') {
    return <LevelIntro level={level} onNext={() => setScreen('playing')} onExit={onExit} />
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
            Level {level + 1} · {LEVEL_META[level].sub}
          </p>
          <p className="text-xs font-bold text-white/60">{progress}</p>
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
          {!feedback && target && (
            <p className="text-sm font-bold text-cyan-300 sm:text-base">
              Ketik huruf <span className="text-white font-black">{target}</span> di keyboard
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
      </div>

      <div className="z-10 shrink-0">
        <p className="mb-1 text-center text-[10px] font-bold text-white/40 sm:text-xs">
          ⌨️ Ketik langsung pada keyboard fisik
        </p>
        <VirtualKeyboard target={target} wrongKey={wrongKey} />
      </div>
    </div>
  )
}
