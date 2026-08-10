import { useCallback, useEffect, useMemo, useState } from 'react'
import confetti from 'canvas-confetti'
import { EXAM } from '../exams/examData.js'
import { formatTime, gradeExam } from '../exams/examEngine.js'

const MESSAGE_BY_SCORE = [
  'Keep practicing — you can do it!',
  'Good work! A little more practice and you will nail it!',
  'Amazing job! You did great!',
]

const CONFETTI_COLORS = ['#fbbf24', '#38bdf8', '#34d399', '#fb7185', '#a78bfa', '#f59e0b']

function SparkleBurst() {
  const [particles, setParticles] = useState(null)

  useEffect(() => {
    const next = Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2
      const distance = 26 + Math.random() * 28
      return {
        id: i,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 12 + Math.random() * 10,
        delay: Math.random() * 90,
      }
    })
    setParticles(next)
    const timer = setTimeout(() => setParticles(null), 700)
    return () => clearTimeout(timer)
  }, [])

  if (!particles) return null

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-6 z-20 -translate-y-1/2"
    >
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="animate-sparkle absolute left-0 top-0"
          style={{
            '--dx': `${particle.dx}px`,
            '--dy': `${particle.dy}px`,
            color: particle.color,
            fontSize: `${particle.size}px`,
            lineHeight: 1,
            animationDelay: `${particle.delay}ms`,
          }}
        >
          ✦
        </span>
      ))}
    </span>
  )
}

function ExamRunner({ onExit }) {
  const [status, setStatus] = useState('running')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [flagged, setFlagged] = useState([])
  const [timeLeft, setTimeLeft] = useState(EXAM.durationSeconds)
  const [result, setResult] = useState(null)

  const question = EXAM.questions[currentIndex]
  const isFlagged = flagged.includes(question.id)

  const completedCount = useMemo(
    () =>
      EXAM.questions.filter((q) => {
        const answer = answers[q.id]
        return answer !== undefined && answer !== null && answer !== ''
      }).length,
    [answers],
  )

  const progress = Math.round((completedCount / EXAM.questions.length) * 100)

  useEffect(() => {
    if (status !== 'running') return undefined
    const timer = setInterval(() => {
      setTimeLeft((remaining) => Math.max(0, remaining - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [status])

  useEffect(() => {
    if (status === 'running' && timeLeft === 0) {
      submitExam()
    }
  }, [timeLeft, status, submitExam])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (status !== 'running') return
      if (event.target instanceof HTMLInputElement) return
      if (event.code === 'ArrowLeft') {
        event.preventDefault()
        setCurrentIndex((index) => Math.max(0, index - 1))
      }
      if (event.code === 'ArrowRight') {
        event.preventDefault()
        setCurrentIndex((index) => Math.min(EXAM.questions.length - 1, index + 1))
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [status])

  function selectOption(optionIndex) {
    if (status !== 'running') return
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))
  }

  function handleTextInput(value) {
    if (status !== 'running') return
    setAnswers((prev) => ({ ...prev, [question.id]: value }))
  }

  function toggleFlag() {
    if (status !== 'running') return
    setFlagged((prev) =>
      prev.includes(question.id)
        ? prev.filter((id) => id !== question.id)
        : [...prev, question.id],
    )
  }

  const submitExam = useCallback(() => {
    if (status !== 'running') return
    setResult(
      gradeExam(EXAM, {
        answers,
        flaggedQuestionIds: flagged,
        timeTakenSeconds: EXAM.durationSeconds - timeLeft,
      }),
    )
    setStatus('submitted')
  }, [status, answers, flagged, timeLeft])

  function restart() {
    setStatus('running')
    setCurrentIndex(0)
    setAnswers({})
    setFlagged([])
    setTimeLeft(EXAM.durationSeconds)
    setResult(null)
  }

  if (status === 'submitted') {
    return <ResultSummary result={result} onRestart={restart} onExit={onExit} />
  }

  const currentAnswer = answers[question.id]

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-cyan-50 to-emerald-200">
      <div className="z-10 flex w-full shrink-0 items-center justify-between gap-2 px-4 pt-4 sm:px-6 sm:pt-5">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-sky-700 shadow-lg transition hover:scale-105 sm:px-6 sm:py-3 sm:text-2xl"
        >
          <span aria-hidden="true" className="text-xl sm:text-3xl">←</span>
          Games
        </button>
        <h1 className="text-[clamp(2rem,6vw,3rem)] font-extrabold leading-none text-slate-700">
          Exam
        </h1>
        <div
          className={`flex items-center gap-1 rounded-full px-3 py-2 text-lg font-extrabold shadow-lg sm:px-6 sm:py-3 sm:text-xl ${
            timeLeft <= 30 ? 'animate-pulse bg-rose-500 text-white' : 'bg-white/95 text-slate-700'
          }`}
        >
          <span aria-hidden="true">⏱</span>
          <span className="tabular-nums">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="z-10 flex w-full shrink-0 flex-col items-center gap-1.5 px-4 pt-3 sm:px-6">
        <div className="flex w-full max-w-3xl items-center justify-between text-sm font-bold text-slate-600 sm:text-base">
          <span>
            {completedCount} of {EXAM.questions.length} completed
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-3 w-full max-w-3xl overflow-hidden rounded-full bg-white/70 shadow-inner sm:h-4">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="z-10 flex w-full shrink-0 justify-center px-4 py-3 sm:px-6">
        <div className="flex max-w-full gap-2 overflow-x-auto">
          {EXAM.questions.map((q, index) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold shadow transition hover:scale-105 sm:h-11 sm:w-11 sm:text-base ${
                index === currentIndex
                  ? 'bg-sky-600 text-white'
                  : answers[q.id] !== undefined && answers[q.id] !== ''
                    ? 'bg-emerald-400 text-white'
                    : 'bg-white/95 text-slate-600'
              }`}
            >
              {index + 1}
              {flagged.includes(q.id) && (
                <span
                  className="absolute -top-1 -right-1 text-xs sm:text-sm"
                  aria-hidden="true"
                >
                  🚩
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="flex min-h-0 flex-1 flex-col items-center gap-3 px-4 pb-4 sm:px-6 sm:pb-5">
        <div className="flex min-h-0 w-full max-w-3xl flex-1 justify-center overflow-y-auto">
          <div
            key={question.id}
            className="animate-pop-in my-auto flex w-full flex-col gap-4 rounded-3xl bg-white/95 p-5 shadow-lg sm:p-7"
          >
            {question.section && (
              <span className="self-start rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold tracking-wide text-emerald-700 uppercase sm:text-sm">
                {question.section}
              </span>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-extrabold tracking-wide text-sky-700 uppercase sm:text-sm">
                Question {currentIndex + 1}
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold tracking-wide text-amber-700 uppercase sm:text-sm">
                {question.type === 'mcq'
                  ? 'Multiple Choice'
                  : question.type === 'true-false'
                    ? 'True / False'
                    : 'Short Answer'}
              </span>
            </div>

            {question.image && (
              <img
                src={question.image}
                alt=""
                className="h-24 w-24 select-none self-center object-contain drop-shadow-md sm:h-32 sm:w-32"
              />
            )}

            <p className="text-xl font-extrabold text-slate-700 sm:text-2xl">
              {question.prompt}
            </p>

            {question.type === 'mcq' || question.type === 'true-false' ? (
              <div className="flex flex-col gap-2 sm:gap-3">
                {question.options.map((option, index) => {
                  const selected = currentAnswer === index
                  return (
                    <label
                      key={option}
                      className={`relative flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-lg font-bold transition sm:text-xl ${
                        selected
                          ? 'bg-sky-600 text-white shadow-md'
                          : 'bg-sky-50 text-slate-700 hover:bg-sky-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => selectOption(index)}
                        className={`h-6 w-6 shrink-0 cursor-pointer sm:h-7 sm:w-7 ${
                          selected ? 'accent-white' : 'accent-sky-600'
                        }`}
                      />
                      <span className="min-w-0">{option}</span>
                      {selected && (
                        <>
                          <SparkleBurst />
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute top-1/2 left-6 z-20 -translate-y-1/2"
                          >
                            <span className="animate-float-up inline-block text-xl sm:text-2xl">
                              ⭐
                            </span>
                          </span>
                        </>
                      )}
                    </label>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                  onChange={(event) => handleTextInput(event.target.value)}
                  placeholder="Type your answer…"
                  autoComplete="off"
                  className="w-full rounded-2xl border-2 border-sky-200 bg-sky-50 px-4 py-3 text-lg font-bold text-slate-700 outline-none placeholder:font-semibold placeholder:text-slate-400 focus:border-sky-500 sm:text-xl"
                />
                <p className="text-xs font-semibold text-slate-400 sm:text-sm">
                  Your answer is checked automatically when you finish.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full max-w-3xl shrink-0 items-center justify-between gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 rounded-full bg-white/95 px-4 py-3 text-lg font-extrabold text-slate-600 shadow-lg transition hover:scale-105 disabled:pointer-events-none disabled:opacity-40 sm:px-6 sm:text-xl"
          >
            <span aria-hidden="true">←</span>
            Back
          </button>

          <button
            type="button"
            onClick={toggleFlag}
            className={`flex items-center gap-1 rounded-full px-4 py-3 text-lg font-extrabold shadow-lg transition hover:scale-105 sm:px-6 sm:text-xl ${
              isFlagged ? 'bg-amber-400 text-amber-900' : 'bg-white/95 text-slate-600'
            }`}
          >
            <span aria-hidden="true">🚩</span>
            {isFlagged ? 'Flagged' : 'Flag'}
          </button>

          {currentIndex === EXAM.questions.length - 1 ? (
            <button
              type="button"
              onClick={submitExam}
              className="flex items-center gap-1 rounded-full bg-emerald-500 px-4 py-3 text-lg font-extrabold text-white shadow-lg transition hover:scale-105 sm:px-6 sm:text-xl"
            >
              Finish
              <span aria-hidden="true">✓</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((index) => Math.min(EXAM.questions.length - 1, index + 1))
              }
              className="flex items-center gap-1 rounded-full bg-sky-600 px-4 py-3 text-lg font-extrabold text-white shadow-lg transition hover:scale-105 sm:px-6 sm:text-xl"
            >
              Next
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

function ResultSummary({ result, onRestart, onExit }) {
  const messageIndex =
    result.percentage >= 80 ? 2 : result.percentage >= 50 ? 1 : 0

  useEffect(() => {
    confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 }, colors: CONFETTI_COLORS })
    const timers = [300, 650, 1000].map((delay) =>
      setTimeout(
        () =>
          confetti({
            particleCount: 60,
            spread: 100,
            startVelocity: 45,
            origin: { x: 0.15 + Math.random() * 0.7, y: 0.5 },
            colors: CONFETTI_COLORS,
          }),
        delay,
      ),
    )
    return () => timers.forEach((timer) => clearTimeout(timer))
  }, [])

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-cyan-50 to-emerald-200">
      <div className="z-10 flex w-full shrink-0 items-center justify-between gap-2 px-4 pt-4 sm:px-6 sm:pt-5">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-sky-700 shadow-lg transition hover:scale-105 sm:px-6 sm:py-3 sm:text-2xl"
        >
          <span aria-hidden="true" className="text-xl sm:text-3xl">←</span>
          Games
        </button>
        <h1 className="text-[clamp(2rem,6vw,3rem)] font-extrabold leading-none text-slate-700">
          Exam
        </h1>
        <div className="w-20 sm:w-32" aria-hidden="true" />
      </div>

      <main className="flex min-h-0 flex-1 flex-col items-center gap-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
        <div className="animate-pop-in flex w-full max-w-3xl flex-col items-center gap-2 rounded-3xl bg-white/95 px-6 py-6 text-center shadow-lg sm:py-8">
          <span className="text-4xl sm:text-5xl" aria-hidden="true">
            <span className="animate-bounce inline-block">🏆</span>
          </span>
          <p className="text-[clamp(3rem,10vw,5rem)] font-extrabold leading-none text-slate-700">
            {result.score}
            <span className="text-[clamp(1.5rem,4vw,2.5rem)] text-slate-400">
              /{result.total}
            </span>
          </p>
          <p className="text-xl font-extrabold text-sky-700 sm:text-2xl">
            {MESSAGE_BY_SCORE[messageIndex]}
          </p>
          <p className="text-sm font-bold text-slate-500 sm:text-base">
            Time taken: {formatTime(result.timeTakenSeconds)} · Score:{' '}
            {result.percentage}%
          </p>
        </div>

        <div className="flex w-full max-w-3xl flex-col gap-2 sm:gap-3">
          {result.results.map((item, index) => (
            <div
              key={item.questionId}
              className={`animate-pop-in rounded-3xl p-4 shadow-md sm:p-5 ${
                item.correct ? 'bg-emerald-100' : 'bg-rose-100'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-extrabold tracking-wide text-slate-600 uppercase sm:text-base">
                  Question {index + 1}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-extrabold text-white uppercase sm:text-sm ${
                    item.correct ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                >
                  {item.correct ? 'Correct' : 'Incorrect'}
                </span>
              </div>

              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  className="mt-2 h-16 w-16 select-none object-contain sm:h-20 sm:w-20"
                />
              )}

              <p className="mt-2 text-lg font-extrabold text-slate-700 sm:text-xl">
                {item.prompt}
              </p>

              <p
                className={`mt-1 text-base font-bold sm:text-lg ${
                  item.correct ? 'text-emerald-800' : 'text-rose-800'
                }`}
              >
                Your answer: {item.givenAnswer ?? 'No answer'}
              </p>
            </div>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="rounded-full bg-emerald-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl"
          >
            Try Again
          </button>
          <button
            type="button"
            onClick={onExit}
            className="rounded-full bg-white/95 px-6 py-3 text-xl font-extrabold text-slate-600 shadow-lg transition hover:scale-105 sm:text-2xl"
          >
            Games
          </button>
        </div>
      </main>
    </div>
  )
}

export default ExamRunner
