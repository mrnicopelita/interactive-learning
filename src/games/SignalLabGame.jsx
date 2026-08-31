import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'

const PARTS = [
  {
    id: 'monitor',
    name: 'Monitor',
    src: '/images/monitor.svg',
    direction: 'out',
    portId: 'port-out',
  },
  {
    id: 'tv',
    name: 'TV',
    src: '/images/tv.svg',
    direction: 'out',
    portId: 'port-out',
  },
  {
    id: 'speaker',
    name: 'Speaker',
    src: '/images/speaker.svg',
    direction: 'out',
    portId: 'port-out',
  },
  {
    id: 'keyboard',
    name: 'Keyboard',
    src: '/images/keyboard.svg',
    direction: 'in',
    portId: 'port-in',
  },
  {
    id: 'mouse',
    name: 'Mouse',
    src: '/images/mouse.svg',
    direction: 'in',
    portId: 'port-in',
  },
  {
    id: 'microphone',
    name: 'Microphone',
    src: '/images/microphone.svg',
    direction: 'in',
    portId: 'port-in',
  },
  {
    id: 'smartphone',
    name: 'Smartphone',
    src: '/images/smartphone.svg',
    direction: 'both',
    portId: 'port-both',
  },
  {
    id: 'tablet',
    name: 'Tablet',
    src: '/images/tablet.svg',
    direction: 'both',
    portId: 'port-both',
  },
  {
    id: 'radio',
    name: 'Radio',
    src: '/images/radio.svg',
    direction: 'both',
    portId: 'port-both',
  },
  {
    id: 'printer',
    name: 'Printer',
    src: '/images/printer.svg',
    direction: 'out',
    portId: 'port-out',
  },
  {
    id: 'projector',
    name: 'Projector',
    src: '/images/projector.svg',
    direction: 'out',
    portId: 'port-out',
  },
  {
    id: 'headphones',
    name: 'Headphones',
    src: '/images/headphones.svg',
    direction: 'out',
    portId: 'port-out',
  },
  {
    id: 'digitalclock',
    name: 'Digital Clock',
    src: '/images/digitalclock.svg',
    direction: 'out',
    portId: 'port-out',
  },
  {
    id: 'joystick',
    name: 'Joystick',
    src: '/images/joystick.svg',
    direction: 'in',
    portId: 'port-in',
  },
  {
    id: 'scanner',
    name: 'Scanner',
    src: '/images/scanner.svg',
    direction: 'in',
    portId: 'port-in',
  },
  {
    id: 'gamepad',
    name: 'Gamepad',
    src: '/images/gamepad.svg',
    direction: 'in',
    portId: 'port-in',
  },
  {
    id: 'smartwatch',
    name: 'Smart Watch',
    src: '/images/smartwatch.svg',
    direction: 'both',
    portId: 'port-both',
  },
  {
    id: 'laptop',
    name: 'Laptop',
    src: '/images/laptop.svg',
    direction: 'both',
    portId: 'port-both',
  },
  {
    id: 'interactiveboard',
    name: 'Interactive Board',
    src: '/images/interactiveboard.svg',
    direction: 'both',
    portId: 'port-both',
  },
]

const PORTS = [
  {
    id: 'port-out',
    title: 'Jalur Keluar',
    subtitle: 'Satu Arah Keluar',
    color: 'sky',
    arrows: 'out',
    label: 'Monitor · TV · Speaker',
    hint: 'Hanya melihat',
  },
  {
    id: 'port-in',
    title: 'Papan Kontrol Masuk',
    subtitle: 'Satu Arah Masuk',
    color: 'emerald',
    arrows: 'in',
    label: 'Keyboard · Mouse · Mic',
    hint: 'Hanya memberi perintah',
  },
  {
    id: 'port-both',
    title: 'Pusat Komunikasi Dua Arah',
    subtitle: 'Dua Arah / Gabungan',
    color: 'violet',
    arrows: 'both',
    label: 'Smartphone · Tablet · Radio',
    hint: 'Bisa ketuk & lihat',
  },
]

function ArrowSet({ mode, className }) {
  if (mode === 'out') {
    return (
      <div className={`flex flex-col gap-0.5 sm:gap-1 ${className}`}>
        <span className="text-xl leading-none text-sky-400 sm:text-2xl lg:text-3xl">↑</span>
        <span className="text-xl leading-none text-sky-400 sm:text-2xl lg:text-3xl">↑</span>
        <span className="text-xl leading-none text-sky-400 sm:text-2xl lg:text-3xl">↑</span>
      </div>
    )
  }
  if (mode === 'in') {
    return (
      <div className={`flex flex-col gap-0.5 sm:gap-1 ${className}`}>
        <span className="text-xl leading-none text-emerald-400 sm:text-2xl lg:text-3xl">↓</span>
        <span className="text-xl leading-none text-emerald-400 sm:text-2xl lg:text-3xl">↓</span>
        <span className="text-xl leading-none text-emerald-400 sm:text-2xl lg:text-3xl">↓</span>
      </div>
    )
  }
  return (
    <div className={`flex flex-col gap-0.5 sm:gap-1 ${className}`}>
      <span className="text-xl leading-none text-violet-400 sm:text-2xl lg:text-3xl">⇅</span>
      <span className="text-xl leading-none text-violet-400 sm:text-2xl lg:text-3xl">⇅</span>
      <span className="text-xl leading-none text-violet-400 sm:text-2xl lg:text-3xl">⇅</span>
    </div>
  )
}

const TIME_LIMIT = 45

function SignalLabGame({ onExit }) {
  const [placed, setPlaced] = useState([])
  const [wrongFlash, setWrongFlash] = useState(false)
  const [wrongMsg, setWrongMsg] = useState(false)
  const [wrongCount, setWrongCount] = useState(0)
  const [seconds, setSeconds] = useState(TIME_LIMIT)
  const [timeOut, setTimeOut] = useState(false)
  const timerTickRef = useRef(null)
  const flashTimerRef = useRef(null)

  useEffect(() => {
    timerTickRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerTickRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      clearInterval(timerTickRef.current)
      clearTimeout(flashTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (seconds <= 0) setTimeOut(true)
  }, [seconds])

  const remaining = PARTS.filter((p) => !placed.includes(p.id))
  const done = placed.length === PARTS.length

  function startDrag(event, part) {
    if (done || timeOut) return
    const target = event.currentTarget
    const rect = target.getBoundingClientRect()
    const ghost = target.cloneNode(true)
    ghost.style.position = 'fixed'
    ghost.style.left = `${rect.left}px`
    ghost.style.top = `${rect.top}px`
    ghost.style.width = `${rect.width}px`
    ghost.style.pointerEvents = 'none'
    ghost.style.zIndex = '50'
    ghost.style.opacity = '0.9'
    document.body.appendChild(ghost)

    const offsetX = event.clientX - rect.left
    const offsetY = event.clientY - rect.top

    const move = (e) => {
      ghost.style.left = `${e.clientX - offsetX}px`
      ghost.style.top = `${e.clientY - offsetY}px`
    }

    const up = (e) => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
      ghost.remove()
      drop(part, e.clientX, e.clientY)
    }

    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', up)
  }

  function drop(part, x, y) {
    const portEl = document.getElementById(part.portId)
    if (!portEl) return
    const r = portEl.getBoundingClientRect()
    const inside =
      x >= r.left &&
      x <= r.right &&
      y >= r.top &&
      y <= r.bottom

    if (inside) {
      setPlaced((prev) => [...prev, part.id])
      setWrongMsg(false)
      confetti({ particleCount: 60, spread: 70, origin: { x: x / window.innerWidth, y: y / window.innerHeight } })
    } else {
      setWrongCount((prev) => prev + 1)
      setWrongFlash(true)
      setWrongMsg(true)
      clearTimeout(flashTimerRef.current)
      setTimeout(() => setWrongFlash(false), 500)
      flashTimerRef.current = setTimeout(() => setWrongMsg(false), 1200)
    }
  }

  function restart() {
    clearInterval(timerTickRef.current)
    timerTickRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerTickRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    setPlaced([])
    setWrongCount(0)
    setWrongMsg(false)
    setTimeOut(false)
    setSeconds(TIME_LIMIT)
  }

  if (done || timeOut) {
    const success = done
    return (
      <div className="relative flex h-dvh w-full touch-manipulation flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-indigo-900 via-sky-900 to-slate-900">
        {success && <ConfettiCelebration />}
        <div className="animate-pop-in flex max-w-lg flex-col items-center gap-4 rounded-3xl bg-white/10 px-6 py-8 text-center backdrop-blur-md sm:gap-5 sm:px-12 sm:py-10 lg:max-w-xl">
          <div className="flex gap-3 text-4xl sm:text-5xl lg:text-6xl">
            {success ? (
              <>
                <span className="animate-bounce" aria-hidden="true">🚀</span>
                <span className="animate-bounce" style={{ animationDelay: '0.15s' }} aria-hidden="true">⭐</span>
                <span className="animate-bounce" style={{ animationDelay: '0.3s' }} aria-hidden="true">✨</span>
              </>
            ) : (
              <span className="animate-bounce" aria-hidden="true">⏰</span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
            {success ? 'Sinyal Terhubung!' : 'Waktu Habis!'}
          </h1>
          <p className="text-base font-bold text-sky-200 sm:text-lg lg:text-xl">
            {success
              ? 'Semua perangkat sudah masuk ke port yang benar!'
              : `Masih ada ${remaining.length} perangkat yang belum masuk.`}
          </p>
          <div className="mt-1 flex items-center gap-3">
            <div
              className={`flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-extrabold sm:text-base ${
                success ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/15 text-sky-200'
              }`}
            >
              <span aria-hidden="true">⏱️</span>
              {TIME_LIMIT - seconds} detik
            </div>
            <div className="flex items-center gap-1 rounded-full bg-red-500/20 px-4 py-1.5 text-sm font-extrabold text-red-300 sm:text-base">
              <span aria-hidden="true">💡</span>
              {wrongCount} salah
            </div>
          </div>
          <div className="flex gap-3 sm:gap-4">
            <button
              type="button"
              onClick={restart}
              className="rounded-full bg-sky-500 px-6 py-2.5 text-lg font-extrabold text-white shadow-lg transition hover:scale-105 sm:px-8 sm:py-3 sm:text-xl lg:text-2xl"
            >
              Main Lagi
            </button>
            <button
              type="button"
              onClick={onExit}
              className="rounded-full bg-white/20 px-6 py-2.5 text-lg font-extrabold text-white shadow-lg transition hover:scale-105 sm:px-8 sm:py-3 sm:text-xl lg:text-2xl"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-indigo-900 via-sky-900 to-slate-900">
      {wrongFlash && (
        <div className="animate-flash-red pointer-events-none absolute inset-0 z-40 bg-red-500/30" />
      )}

      {wrongMsg && (
        <div className="animate-pop-in pointer-events-none absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
          <div className="animate-shake flex items-center gap-2 whitespace-nowrap rounded-full bg-red-500 px-6 py-3 text-xl font-extrabold text-white shadow-2xl sm:px-8 sm:text-2xl">
            <span aria-hidden="true">💡</span>
            Salah! Coba di port yang benar!
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-6 top-16 h-24 w-24 rounded-full bg-yellow-200 opacity-20 blur-2xl" />
        <div className="absolute right-10 top-32 h-20 w-20 rounded-full bg-sky-300 opacity-20 blur-2xl" />
        <div className="absolute bottom-24 left-1/3 h-28 w-28 rounded-full bg-violet-300 opacity-20 blur-2xl" />
      </div>

      <button
        type="button"
        onClick={onExit}
        className="absolute left-3 top-3 z-30 flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-extrabold text-white shadow-lg backdrop-blur-sm transition hover:scale-105 sm:left-5 sm:top-5 sm:px-6 sm:py-3 sm:text-2xl"
      >
        <span aria-hidden="true" className="text-lg sm:text-3xl">←</span>
        Permainan
      </button>

      <div
        className={`absolute right-3 top-3 z-30 flex items-center gap-2 rounded-full px-4 py-2 text-lg font-extrabold shadow-lg backdrop-blur-sm transition sm:right-5 sm:top-5 sm:px-6 sm:py-3 sm:text-2xl ${
          seconds <= 5
            ? 'bg-red-500/90 text-white'
            : 'bg-white/15 text-white'
        }`}
      >
        <span aria-hidden="true">⏱️</span>
        <span className={seconds <= 5 ? 'animate-pulse' : ''}>{seconds}</span>
      </div>

      <header className="z-10 flex w-full shrink-0 flex-col items-center gap-1 px-4 pt-14 text-center sm:pt-16 lg:pt-18">
        <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-extrabold leading-none text-white lg:text-5xl xl:text-6xl">
          Sinyal <span className="text-sky-300">Lab</span>
        </h1>
        <p className="text-xs font-bold text-sky-200 sm:text-base lg:text-lg">
          Seret perangkat ke port yang tepat di stasiun luar angkasa! 🛰️
        </p>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col justify-between gap-2 overflow-hidden px-3 pb-4 pt-2 sm:gap-4 sm:px-6 sm:pb-6">
        <div className="flex min-h-0 flex-1 flex-wrap content-start items-start justify-center gap-3 overflow-y-auto px-2 pt-2 sm:gap-4">
          {remaining.map((part, index) => (
            <button
              key={part.id}
              type="button"
              onPointerDown={(e) => startDrag(e, part)}
              className="animate-floaty flex cursor-grab touch-none flex-col items-center gap-1 rounded-3xl bg-white/10 p-3 shadow-xl backdrop-blur-sm ring-1 ring-white/20 transition hover:scale-105 sm:p-4"
              style={{ animationDelay: `${index * 0.4}s` }}
            >
              <img
                src={part.src}
                alt=""
                className="h-16 w-16 object-contain drop-shadow-lg sm:h-20 sm:w-20 lg:h-24 lg:w-24"
              />
              <span className="text-xs font-extrabold text-white sm:text-sm lg:text-base">
                {part.name}
              </span>
            </button>
          ))}
        </div>

        <div className="grid w-full shrink-0 grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3 lg:gap-4">
          {PORTS.map((port) => {
            const portParts = placed.filter(
              (id) => PARTS.find((p) => p.id === id).portId === port.id,
            )
            const portFull = portParts.length > 0
            return (
              <div
                key={port.id}
                id={port.id}
                className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 p-2 ring-2 backdrop-blur-sm sm:gap-2 sm:rounded-3xl sm:p-3 lg:p-4"
                style={{
                  borderColor: port.color,
                  ...(portFull
                    ? { boxShadow: '0 0 20px 4px rgba(77,201,255,0.5)' }
                    : {}),
                }}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <ArrowSet mode={port.arrows} />
                  <span className="text-sm font-extrabold text-white sm:text-base lg:text-lg">
                    {port.title}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-sky-200 sm:text-xs lg:text-sm">
                  {port.subtitle} · {port.hint}
                </span>
                <div className="flex min-h-10 flex-wrap items-center justify-center gap-1 sm:min-h-14 sm:gap-2">
                  {portParts.length === 0 ? (
                    <span className="text-[10px] font-bold text-slate-300 opacity-60 sm:text-xs">
                      Seret ke sini
                    </span>
                  ) : (
                    portParts.map((id) => {
                      const p = PARTS.find((x) => x.id === id)
                      return (
                        <img
                          key={id}
                          src={p.src}
                          alt={p.name}
                          className="animate-pop-in h-10 w-10 object-contain drop-shadow sm:h-14 sm:w-14 lg:h-16 lg:w-16"
                        />
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

function ConfettiCelebration() {
  const started = useRef(false)
  if (!started.current) {
    started.current = true
    const end = Date.now() + 4000
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } })
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }
  return null
}

export default SignalLabGame
