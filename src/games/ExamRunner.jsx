import { useCallback, useEffect, useMemo, useState } from 'react'
import { EXAM } from '../exams/examData.js'
import { formatTime, gradeExam } from '../exams/examEngine.js'
import { supabase } from '../lib/supabase.js'

const isQuestionAnswered = (q, answers) => {
  const answer = answers[q.id]
  return answer !== undefined && answer !== null && answer !== ''
}

const SPARKLE_COLORS = ['#fbbf24', '#38bdf8', '#34d399', '#fb7185', '#a78bfa', '#f59e0b']
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
        color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
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

function NameEntry({ exam, onStart, onExit }) {
  const [name, setName] = useState('')
  const trimmed = name.trim()

  function handleSubmit(event) {
    event.preventDefault()
    if (trimmed) onStart(trimmed)
  }

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-cyan-50 to-emerald-200">
      <div className="z-10 flex w-full shrink-0 items-center justify-between px-4 pt-4 sm:px-6 sm:pt-5">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-sky-700 shadow-lg transition hover:scale-105 sm:px-6 sm:py-3 sm:text-2xl"
        >
          <span aria-hidden="true" className="text-xl sm:text-3xl">←</span>
          Games
        </button>
        <div className="w-20 sm:w-32" aria-hidden="true" />
      </div>

      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6">
        <form
          onSubmit={handleSubmit}
          className="animate-pop-in flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-10"
        >
          <img
            src="/images/quiz.svg"
            alt=""
            className="h-20 w-20 select-none object-contain drop-shadow-md sm:h-24 sm:w-24"
          />
          <h1 className="text-[clamp(1.75rem,6vw,3rem)] font-extrabold leading-none text-slate-700">
            {exam.title}
          </h1>
          <p className="text-sm font-bold text-slate-500 sm:text-base">
            {exam.description}
          </p>

          <label className="flex w-full flex-col gap-2 text-left">
            <span className="text-sm font-extrabold tracking-wide text-slate-600 uppercase">
              Your name
            </span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Type your name…"
              autoComplete="off"
              autoFocus
              className="w-full rounded-2xl border-2 border-sky-200 bg-sky-50 px-4 py-3 text-center text-xl font-extrabold text-slate-700 outline-none placeholder:font-semibold placeholder:text-slate-400 focus:border-sky-500 sm:text-2xl"
            />
          </label>

          <button
            type="submit"
            disabled={!trimmed}
            className="w-full rounded-full bg-emerald-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 disabled:pointer-events-none disabled:opacity-40 sm:text-2xl"
          >
            Start Quiz
            <span aria-hidden="true"> 🚀</span>
          </button>
        </form>
      </main>
    </div>
  )
}

function ExamRunner({ exam = EXAM, onExit }) {
  const [status, setStatus] = useState('entry')
  const [studentName, setStudentName] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [flagged, setFlagged] = useState([])
  const [timeLeft, setTimeLeft] = useState(exam.durationSeconds)
  const [saveStatus, setSaveStatus] = useState(null)

  const question = exam.questions[currentIndex]
  const isFlagged = flagged.includes(question.id)

  const completedCount = useMemo(
    () => exam.questions.filter((q) => isQuestionAnswered(q, answers)).length,
    [answers, exam],
  )

  const progress = Math.round((completedCount / exam.questions.length) * 100)

  const submitExam = useCallback(async () => {
    if (status !== 'running') return
    const graded = gradeExam(exam, {
      answers,
      flaggedQuestionIds: flagged,
      timeTakenSeconds: exam.durationSeconds - timeLeft,
    })
    setStatus('submitted')

    if (supabase) {
      setSaveStatus('saving')
      const { error } = await supabase.from('exam_results').insert({
        student_name: studentName,
        exam_id: exam.id,
        score: graded.score,
        total: graded.total,
        percentage: graded.percentage,
        time_taken_seconds: graded.timeTakenSeconds,
        answers,
        flagged_question_ids: flagged,
      })
      setSaveStatus(error ? 'error' : 'saved')
    }
  }, [status, answers, flagged, timeLeft, studentName, exam])

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
        setCurrentIndex((index) => Math.min(exam.questions.length - 1, index + 1))
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [status, exam])

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

  function startExam(name) {
    setStudentName(name)
    setStatus('running')
  }

  function restart() {
    setStatus('running')
    setCurrentIndex(0)
    setAnswers({})
    setFlagged([])
    setTimeLeft(exam.durationSeconds)
    setSaveStatus(null)
  }

  if (status === 'entry') {
    return <NameEntry exam={exam} onStart={startExam} onExit={onExit} />
  }

  if (status === 'submitted') {
    return (
      <ThankYou
        exam={exam}
        studentName={studentName}
        saveStatus={saveStatus}
        onRestart={restart}
        onExit={onExit}
      />
    )
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
          Quiz
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
        <p className="text-xs font-extrabold tracking-wide text-slate-500 uppercase sm:text-sm">
          Hi, {studentName}! Good luck! <span aria-hidden="true">⭐</span>
        </p>
        <div className="flex w-full max-w-3xl items-center justify-between text-sm font-bold text-slate-600 sm:text-base">
          <span>
            {completedCount} of {exam.questions.length} completed
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
        <div
          className="grid w-full max-w-3xl gap-1.5 sm:gap-2"
          style={{
            gridTemplateColumns: `repeat(${Math.ceil(exam.questions.length / 2)}, minmax(0, 1fr))`,
          }}
        >
          {exam.questions.map((q, index) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`relative flex h-8 w-full items-center justify-center rounded-full text-xs font-extrabold shadow transition hover:scale-105 sm:h-11 sm:text-base ${
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
            className="animate-slide-in relative my-auto flex w-full flex-col gap-4 rounded-3xl bg-white/95 p-5 shadow-lg sm:p-7"
          >
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

            <p className="text-xl font-extrabold whitespace-pre-line text-slate-700 sm:text-2xl">
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

          {currentIndex === exam.questions.length - 1 ? (
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
              onClick={() => setCurrentIndex((index) => Math.min(exam.questions.length - 1, index + 1))}
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

function ThankYou({ exam, studentName, saveStatus, onRestart, onExit }) {
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
          {exam.title}
        </h1>
        <div className="w-20 sm:w-32" aria-hidden="true" />
      </div>

      <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4 py-6 sm:px-6">
        <div className="animate-pop-in flex w-full max-w-2xl flex-col items-center gap-3 rounded-3xl bg-white/95 px-6 py-10 text-center shadow-lg sm:py-14">
          <span className="text-4xl sm:text-6xl" aria-hidden="true">
            <span className="animate-bounce inline-block">🙏</span>
          </span>
          <h2 className="text-[clamp(2rem,6vw,3.5rem)] font-extrabold leading-none text-slate-700">
            Thank You
          </h2>
          <p className="text-xl font-extrabold text-sky-700 sm:text-2xl">
            Terima kasih, {studentName}! Kamu telah menyelesaikan {exam.title}.
          </p>
          {saveStatus === 'saving' && (
            <p className="animate-pulse text-sm font-extrabold text-sky-600 sm:text-base">
              Saving your answers…
            </p>
          )}
          {saveStatus === 'saved' && (
            <p className="text-sm font-extrabold text-emerald-600 sm:text-base">
              ✓ Jawabanmu sudah disimpan.
            </p>
          )}
          {saveStatus === 'error' && (
            <p className="text-sm font-extrabold text-rose-600 sm:text-base">
              ✗ Jawaban tidak tersimpan. Periksa koneksi dan coba lagi.
            </p>
          )}
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
