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
      className="relative flex h-screen w-screen cursor-pointer flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-cyan-50 to-emerald-200"
      onClick={switchImage}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onExit()
        }}
        className="absolute left-5 top-5 z-30 flex items-center gap-3 rounded-full bg-white/95 px-6 py-3 text-2xl font-extrabold text-sky-700 shadow-lg transition hover:scale-105 sm:text-3xl"
      >
        <span aria-hidden="true" className="text-3xl sm:text-4xl">←</span>
        Games
      </button>

      <p className="absolute left-1/2 top-8 z-30 -translate-x-1/2 text-sm font-bold tracking-wide text-slate-500 uppercase sm:text-base">
        Tap the screen or press Space!
      </p>

      {menuOpen && (
        <div
          className="animate-menu-up absolute bottom-28 left-1/2 z-30 w-80 -translate-x-1/2 rounded-3xl bg-white/95 p-4 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <p className="mb-3 text-center text-lg font-extrabold text-slate-600">
            Show these parts:
          </p>
          <div className="flex flex-col gap-1.5">
            {PARTS.map((part) => (
              <label
                key={part.id}
                className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-sky-50"
              >
                <input
                  type="checkbox"
                  checked={checkedIds.includes(part.id)}
                  onChange={() => togglePart(part.id)}
                  className="h-6 w-6 cursor-pointer accent-sky-600"
                />
                <img
                  src={part.src}
                  alt=""
                  className="h-10 w-10 select-none object-contain"
                />
                <span className="text-xl font-bold text-slate-700">
                  {part.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          setMenuOpen((open) => !open)
        }}
        className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/95 px-6 py-3 text-xl font-extrabold text-slate-600 shadow-lg transition hover:scale-105"
      >
        Parts
        <span aria-hidden="true" className="text-2xl">
          {menuOpen ? '▼' : '▲'}
        </span>
      </button>

      <main className="relative flex flex-1 items-center justify-center overflow-hidden">
        {previous && (
          <img
            key={`old-${previous.id}`}
            src={previous.src}
            alt={previous.name}
            className="animate-fade-out absolute inset-0 m-auto h-[54vh] w-auto max-w-none select-none object-contain sm:h-[58vh]"
          />
        )}
        <img
          key={current.id}
          src={current.src}
          alt={current.name}
          className="animate-pop-in relative h-[54vh] w-auto max-w-none select-none object-contain drop-shadow-2xl sm:h-[58vh]"
        />
      </main>

      <div className="z-10 flex w-full items-end justify-between gap-4 px-6 pb-8 sm:px-12 sm:pb-10">
        <div className="flex items-center gap-2 text-6xl font-extrabold text-sky-700 drop-shadow-sm sm:text-8xl">
          <span aria-hidden="true">←</span>
          <span>Monitor</span>
        </div>
        <div className="flex items-center gap-2 text-6xl font-extrabold text-emerald-700 drop-shadow-sm sm:text-8xl">
          <span>CPU</span>
          <span aria-hidden="true">→</span>
        </div>
      </div>
    </div>
  )
}

export default CpuMonitorGame
