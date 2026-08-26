import { useEffect, useRef, useState } from 'react'

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

function BerKomGame({ onExit }) {
  const [corners] = useState(() => {
    const arr = [...PARTS]
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  })

  const [targetPart, setTargetPart] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  function activateCircle() {
    clearTimeout(timerRef.current)
    setTargetPart(pickRandom())
    setFeedback(null)
    setSelectedId(null)
  }

  function tapPart(partId) {
    if (!targetPart || feedback) return

    setSelectedId(partId)

    if (partId === targetPart.id) {
      setFeedback('correct')
      setScore((prev) => prev + 1)

      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setTargetPart(null)
        setFeedback(null)
        setSelectedId(null)
      }, 1100)
    } else {
      setFeedback('wrong')

      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setFeedback(null)
        setSelectedId(null)
      }, 700)
    }
  }

  return (
    <div className="relative flex h-dvh w-full touch-manipulation overflow-hidden bg-gradient-to-b from-sky-200 via-cyan-50 to-emerald-200">
      <button
        type="button"
        onClick={onExit}
        className="absolute left-3 top-3 z-30 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-sky-700 shadow-lg transition hover:scale-105 sm:left-5 sm:top-5 sm:px-6 sm:py-3 sm:text-2xl"
      >
        <span aria-hidden="true" className="text-xl sm:text-3xl">←</span>
        Games
      </button>

      <div className="absolute right-3 top-3 z-30 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 shadow-md sm:right-5 sm:top-5 sm:px-6 sm:py-3">
        <span className="text-xl sm:text-2xl">⭐</span>
        <span className="text-xl font-extrabold text-amber-500 sm:text-2xl">
          {score}
        </span>
      </div>

      <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
        {feedback && (
          <div
            className={`animate-pop-in whitespace-nowrap rounded-full px-6 py-2 text-lg font-extrabold shadow-lg sm:text-xl ${
              feedback === 'correct'
                ? 'bg-emerald-500 text-white'
                : 'animate-shake bg-amber-400 text-amber-900'
            }`}
          >
            {feedback === 'correct' ? 'Correct! 🎉' : 'Try again! 💪'}
          </div>
        )}

        <button
          type="button"
          onClick={activateCircle}
          disabled={!!targetPart}
          className={`flex items-center justify-center rounded-full border-[5px] bg-white shadow-2xl transition disabled:cursor-default sm:border-[6px] ${
            feedback === 'correct'
              ? 'border-emerald-400'
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
                Tap me!
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
              ? 'animate-shake ring-4 ring-amber-400'
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
