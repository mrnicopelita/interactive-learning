import { useCallback, useEffect, useRef, useState } from 'react'

const IMAGES = [
  { name: 'Monitor', src: '/images/monitor.svg' },
  { name: 'CPU', src: '/images/cpu.svg' },
]

function pickRandom(excludeName) {
  const options = IMAGES.filter((image) => image.name !== excludeName)
  return options[Math.floor(Math.random() * options.length)]
}

const TRANSITION_MS = 550

function CpuMonitorGame({ onExit }) {
  const [current, setCurrent] = useState(() => pickRandom())
  const [previous, setPrevious] = useState(null)
  const timerRef = useRef(null)

  const switchImage = useCallback(() => {
    setPrevious(current)
    setCurrent(pickRandom(current.name))

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setPrevious(null)
    }, TRANSITION_MS)
  }, [current])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.code === 'Space') {
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
        className="absolute bottom-5 left-5 z-30 flex items-center gap-3 rounded-full bg-white/95 px-6 py-3 text-2xl font-extrabold text-sky-700 shadow-lg transition hover:scale-105 sm:text-3xl"
      >
        <span aria-hidden="true" className="text-3xl sm:text-4xl">←</span>
        Games
      </button>

      <header className="z-10 flex w-full items-center justify-between gap-4 bg-white/85 px-5 py-4 shadow-md backdrop-blur-sm sm:px-10">
        <div className="flex items-center gap-2 text-4xl font-extrabold text-sky-700 sm:text-5xl">
          <span aria-hidden="true" className="text-6xl sm:text-7xl">←</span>
          <span>Monitor</span>
        </div>

        <p className="hidden text-sm font-bold tracking-wide text-slate-500 uppercase md:block">
          Tap the screen or press Space!
        </p>

        <div className="flex items-center gap-2 text-4xl font-extrabold text-emerald-700 sm:text-5xl">
          <span>CPU</span>
          <span aria-hidden="true" className="text-6xl sm:text-7xl">→</span>
        </div>
      </header>

      <main className="relative flex flex-1 items-center justify-center overflow-hidden">
        {previous && (
          <img
            key={`old-${previous.name}`}
            src={previous.src}
            alt={previous.name}
            className="animate-fade-out absolute inset-0 m-auto h-[62vh] w-auto max-w-none select-none object-contain sm:h-[68vh]"
          />
        )}
        <img
          key={current.name}
          src={current.src}
          alt={current.name}
          className="animate-pop-in relative h-[62vh] w-auto max-w-none select-none object-contain drop-shadow-2xl sm:h-[68vh]"
        />
      </main>
    </div>
  )
}

export default CpuMonitorGame
