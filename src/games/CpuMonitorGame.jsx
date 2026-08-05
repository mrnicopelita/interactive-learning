import { useCallback, useEffect, useRef, useState } from 'react'

const PARTS = [
  { id: 'monitor', name: 'Monitor', src: '/images/monitor.svg' },
  { id: 'cpu', name: 'CPU', src: '/images/cpu.svg' },
  { id: 'mouse', name: 'Mouse', src: '/images/mouse.svg' },
  { id: 'keyboard', name: 'Keyboard', src: '/images/keyboard.svg' },
]

const DEFAULT_CHECKED = ['monitor', 'cpu']
const TRANSITION_MS = 550

function pickRandom(checked, excludeId) {
  const checkedParts = PARTS.filter((part) => checked.includes(part.id))
  let pool = checkedParts.filter((part) => part.id !== excludeId)
  if (pool.length === 0) pool = checkedParts
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

function CpuMonitorGame({ onExit }) {
  const [checkedIds, setCheckedIds] = useState(DEFAULT_CHECKED)
  const [current, setCurrent] = useState(() => pickRandom(DEFAULT_CHECKED))
  const [previous, setPrevious] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const timerRef = useRef(null)

  const switchImage = useCallback(() => {
    const next = pickRandom(checkedIds, current.id)
    if (!next) return
    setPrevious(current)
    setCurrent(next)
    setMenuOpen(false)

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setPrevious(null)
    }, TRANSITION_MS)
  }, [checkedIds, current])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.code === 'Space') {
        if (event.target instanceof HTMLInputElement) return
        event.preventDefault()
        switchImage()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      clearTimeout(timerRef.current)
    }
  }, [switchImage])

  function togglePart(partId) {
    const next = checkedIds.includes(partId)
      ? checkedIds.filter((id) => id !== partId)
      : [...checkedIds, partId]
    setCheckedIds(next)
    if (!next.includes(current.id)) {
      const replacement = pickRandom(next, current.id)
      if (replacement) setCurrent(replacement)
    }
  }

  return (
    <div
      className="relative flex h-dvh w-full cursor-pointer touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-cyan-50 to-emerald-200"
      onClick={switchImage}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onExit()
        }}
        className="absolute left-4 top-4 z-30 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-sky-700 shadow-lg transition hover:scale-105 sm:left-5 sm:top-5 sm:px-6 sm:py-3 sm:text-2xl"
      >
        <span aria-hidden="true" className="text-xl sm:text-3xl">←</span>
        Games
      </button>

      <p className="absolute left-1/2 top-5 z-30 hidden -translate-x-1/2 text-xs font-bold tracking-wide text-slate-500 uppercase sm:top-7 sm:text-sm md:block">
        Tap the screen or press Space!
      </p>

      {menuOpen && (
        <div
          className="animate-menu-up absolute bottom-24 left-1/2 z-30 w-72 -translate-x-1/2 rounded-3xl bg-white/95 p-3 shadow-2xl sm:w-80 sm:p-4"
          onClick={(event) => event.stopPropagation()}
        >
          <p className="mb-2 text-center text-base font-extrabold text-slate-600 sm:text-lg">
            Show these parts:
          </p>
          <div className="flex flex-col gap-1">
            {PARTS.map((part) => (
              <label
                key={part.id}
                className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-1.5 transition hover:bg-sky-50 sm:py-2"
              >
                <input
                  type="checkbox"
                  checked={checkedIds.includes(part.id)}
                  onChange={() => togglePart(part.id)}
                  className="h-5 w-5 cursor-pointer accent-sky-600 sm:h-6 sm:w-6"
                />
                <img
                  src={part.src}
                  alt=""
                  className="h-8 w-8 select-none object-contain sm:h-10 sm:w-10"
                />
                <span className="text-base font-bold text-slate-700 sm:text-xl">
                  {part.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <main className="relative min-h-0 flex-1">
        {previous && (
          <img
            key={`old-${previous.id}`}
            src={previous.src}
            alt={previous.name}
            className="animate-fade-out absolute inset-0 m-auto max-h-[calc(100%-1rem)] max-w-[92%] select-none object-contain"
          />
        )}
        <img
          key={current.id}
          src={current.src}
          alt={current.name}
          className="animate-pop-in absolute inset-0 m-auto max-h-[calc(100%-1rem)] max-w-[92%] select-none object-contain drop-shadow-2xl"
        />
      </main>

      <div className="z-10 flex min-h-0 items-center justify-between gap-3 px-4 pb-3 sm:px-8 sm:pb-5">
        <div className="flex min-w-0 flex-1 items-center justify-start gap-2 text-[clamp(2rem,8vw,5.5rem)] font-extrabold leading-none text-sky-700 drop-shadow-sm">
          <span aria-hidden="true">←</span>
          <span>Monitor</span>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            setMenuOpen((open) => !open)
          }}
          className="flex shrink-0 items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-base font-extrabold text-slate-600 shadow-lg transition hover:scale-105 sm:px-6 sm:py-3 sm:text-xl"
        >
          Parts
          <span aria-hidden="true" className="text-lg sm:text-2xl">
            {menuOpen ? '▼' : '▲'}
          </span>
        </button>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-[clamp(2rem,8vw,5.5rem)] font-extrabold leading-none text-emerald-700 drop-shadow-sm">
          <span>CPU</span>
          <span aria-hidden="true">→</span>
        </div>
      </div>
    </div>
  )
}

export default CpuMonitorGame
