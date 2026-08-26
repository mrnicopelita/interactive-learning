import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'

const TOTAL_ROUNDS = 10

const PARTS = [
  { id: 'monitor', name: 'Monitor', src: '/images/monitor.svg' },
  { id: 'cpu', name: 'CPU', src: '/images/cpu.svg' },
  { id: 'keyboard', name: 'Keyboard', src: '/images/keyboard.svg' },
  { id: 'mouse', name: 'Mouse', src: '/images/mouse.svg' },
]

const CORNER_POSITIONS = [
  'left-3 top-24 sm:left-6 sm:top-28',
  'right-3 top-24 sm:right-6 sm:top-28',
  'left-3 bottom-6 sm:left-6 sm:bottom-10',
  'right-3 bottom-6 sm:right-6 sm:bottom-10',
]

function pickRandom() {
  return PARTS[Math.floor(Math.random() * PARTS.length)]
}

function shuffleArray(list) {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function fireCorrect() {
  confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } })
}

function fireWork() {
  const end = Date.now() + 3000
  const frame = () => {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } })
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

function BerKomGame({ onExit }) {
  const [corners] = useState(() => shuffleArray(PARTS))
  const [correct, setCorrect] = useState(0)
  const [targetPart, setTargetPart] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [done, setDone] = useState(false)
  const [showFlash, setShowFlash] = useState(false)
  const timerRef = useRef(null)
  const firedRef = useRef(false)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  useEffect(() => {
    if (correct >= TOTAL_ROUNDS && !firedRef.current) {
      firedRef.current = true
      const t = setTimeout(() => {
        setDone(true)
        fireWork()
      }, 1200)
      return () => clearTimeout(t)
    }
  }, [correct])

  function activateCircle() {
    clearTimeout(timerRef.current)
    setTargetPart(pickRandom())
    setFeedback(null)
    setSelectedId(null)
  }

  function tapPart(partId) {
    if (!targetPart || feedback || done) return

    setSelectedId(partId)

    if (partId === targetPart.id) {
      setFeedback('correct')
      fireCorrect()

      setCorrect((prev) => prev + 1)

      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setTargetPart(null)
        setFeedback(null)
        setSelectedId(null)
      }, 1100)
    } else {
      setFeedback('wrong')
      setShowFlash(true)
      setTimeout(() => setShowFlash(false), 500)

      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setFeedback(null)
        setSelectedId(null)
      }, 700)
    }
  }

  function restart() {
    clearTimeout(timerRef.current)
    setCorrect(0)
    setTargetPart(null)
    setSelectedId(null)
    setFeedback(null)
    setDone(false)
    setShowFlash(false)
    firedRef.current = false
  }

  if (done) {
    return (
      <div className="relative flex h-dvh w-full touch-manipulation flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-sky-200 via-cyan-50 to-emerald-200">
        <div className="animate-pop-in flex max-w-lg flex-col items-center gap-6 rounded-3xl bg-white/95 px-8 py-10 text-center shadow-2xl sm:px-12">
          <div className="flex gap-3 text-5xl sm:text-6xl">
            <span className="animate-bounce" aria-hidden="true">🎉</span>
            <span className="animate-bounce" style={{ animationDelay: '0.15s' }} aria-hidden="true">✨</span>
            <span className="animate-bounce" style={{ animationDelay: '0.3s' }} aria-hidden="true">⭐</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-700 sm:text-4xl">
            Kerja Bagus!
          </h1>
          <p className="text-lg font-bold text-slate-500 sm:text-xl">
            Kamu sudah menyelesaikan semua soal!
          </p>
          <p className="text-sm font-bold text-slate-400">
            Skor: {correct} / {TOTAL_ROUNDS}
          </p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={restart}
              className="rounded-full bg-sky-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl"
            >
              Main Lagi
            </button>
            <button
              type="button"
              onClick={onExit}
              className="rounded-full bg-white px-8 py-3 text-xl font-extrabold text-slate-600 shadow-lg transition hover:scale-105 sm:text-2xl"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-dvh w-full touch-manipulation overflow-hidden bg-gradient-to-b from-sky-200 via-cyan-50 to-emerald-200">
      {showFlash && (
        <div className="animate-flash-red pointer-events-none absolute inset-0 z-40 bg-red-500/30" />
      )}

      <button
        type="button"
        onClick={onExit}
        className="absolute left-3 top-3 z-30 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-sky-700 shadow-lg transition hover:scale-105 sm:left-5 sm:top-5 sm:px-6 sm:py-3 sm:text-2xl"
      >
        <span aria-hidden="true" className="text-xl sm:text-3xl">←</span>
        Permainan
      </button>

      <div className="absolute right-3 top-3 z-30 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 shadow-md sm:right-5 sm:top-5 sm:px-6 sm:py-3">
        <span className="text-xl sm:text-2xl">⭐</span>
        <span className="text-xl font-extrabold text-amber-500 sm:text-2xl">
          {correct}
        </span>
      </div>

      <div className="absolute left-1/2 top-16 z-30 flex -translate-x-1/2 gap-1.5">
        {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-full transition-all sm:h-4 sm:w-4 ${
              i < correct
                ? 'bg-emerald-500'
                : i === correct
                  ? 'bg-sky-400 ring-2 ring-sky-200'
                  : 'bg-white/40'
            }`}
          />
        ))}
      </div>

      <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
        {feedback && (
          <div
            className={`animate-pop-in whitespace-nowrap rounded-full px-6 py-2 text-lg font-extrabold shadow-lg sm:text-xl ${
              feedback === 'correct'
                ? 'bg-emerald-500 text-white'
                : 'animate-shake bg-red-500 text-white'
            }`}
          >
            {feedback === 'correct' ? 'Benar! 🎉' : 'Salah! Coba lagi! 💪'}
          </div>
        )}

        <button
          type="button"
          onClick={activateCircle}
          disabled={!!targetPart}
          className={`flex items-center justify-center rounded-full border-[5px] bg-white shadow-2xl transition disabled:cursor-default sm:border-[6px] ${
            feedback === 'correct'
              ? 'scale-110 border-emerald-400'
              : feedback === 'wrong'
                ? 'border-red-400'
                : 'border-dashed border-sky-300'
          } ${!targetPart ? 'animate-pulse' : ''}`}
          style={{
            width: 'min(42vw, 220px)',
            height: 'min(42vw, 220px)',
          }}
        >
          {!targetPart ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-5xl sm:text-6xl">👆</span>
              <span className="text-xs font-bold text-sky-500 sm:text-sm">
                Ketuk saya!
              </span>
            </div>
          ) : (
            <img
              key={targetPart.id}
              src={targetPart.src}
              alt={targetPart.name}
              className="animate-pop-in h-[68%] w-[68%] object-contain drop-shadow-md"
            />
          )}
        </button>
      </div>

      {corners.map((part, index) => (
        <button
          key={part.id}
          type="button"
          onClick={() => tapPart(part.id)}
          className={`absolute z-20 flex flex-col items-center gap-1 rounded-3xl bg-white/95 p-3 shadow-xl transition sm:p-4 ${CORNER_POSITIONS[index]} ${
            selectedId === part.id && feedback === 'wrong'
              ? 'animate-shake ring-4 ring-red-400'
              : selectedId === part.id && feedback === 'correct'
                ? 'animate-pop-in ring-4 ring-emerald-400'
                : ''
          }`}
        >
          <img
            src={part.src}
            alt=""
            className="h-20 w-20 object-contain drop-shadow-md sm:h-28 sm:w-28"
          />
          <span className="text-sm font-extrabold text-slate-700 sm:text-lg">
            {part.name}
          </span>
        </button>
      ))}
    </div>
  )
}

export default BerKomGame
