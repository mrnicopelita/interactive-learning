import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import {
  TERMINAL_PROTOCOL_META,
  TERMINAL_PROTOCOL_STAGES,
  starsFor,
} from './terminalProtocolData.js'

const PROGRESS_KEY = 'terminal-protocol-progress-v1'

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
function normalizeAnswer(value) {
  return String(value ?? '').trim().toLowerCase().replace(/\s+/g, ' ')
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return { name: '', stages: {} }
}

function useFinishOnDone(done, onComplete, mistakes) {
  const fired = useRef(false)
  useEffect(() => {
    if (done && !fired.current) {
      fired.current = true
      const t = setTimeout(() => onComplete(mistakes), 1400)
      return () => clearTimeout(t)
    }
  }, [done, onComplete, mistakes])
}

function celebrate() {
  const end = Date.now() + 3000
  const frame = () => {
    confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: ['#00FF66', '#FFB000', '#ffffff'] })
    confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: ['#00FF66', '#FFB000', '#ffffff'] })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

function termClass(text) {
  if (/^\[(ERROR|ALERT|FAIL|CRASH)/.test(text)) return 'font-bold text-[#FF5252]'
  if (/^\[(OK|SUCCESS|COMPLETE|WORKING)/.test(text)) return 'font-bold text-[#00FF66]'
  if (/^\[(HINT)/.test(text)) return 'text-amber-300/90'
  if (/^\[(BOOT|LOG|STATUS|DATA|LIST|INPUT|TASK|QUESTION|DIAGNOSTIC|DUMP|BUFFER|OUTPUT)/.test(text)) {
    return 'text-[#00FF66]'
  }
  return 'text-[#00FF66]'
}

function TermLine({ text }) {
  return <p className={`break-words whitespace-pre-wrap leading-relaxed ${termClass(text)}`}>{text}</p>
}

function BackButton({ onClick, label = 'BACK' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded border border-[#00FF66]/40 px-3 py-1 text-xs font-bold text-[#00FF66] transition hover:bg-[#00FF66] hover:text-black sm:text-sm"
    >
      {'<- '}
      {label}
    </button>
  )
}

function TermChip({ label, state = 'idle', onClick }) {
  const base =
    'rounded border px-3 py-2 text-xs font-bold transition sm:text-sm touch-manipulation cursor-default'
  if (state === 'done') {
    return (
      <span className={`${base} border-[#00FF66]/70 bg-[#00FF66]/10 text-[#00FF66]`}>
        {label} <span className="terminal-glow">[OK]</span>
      </span>
    )
  }
  if (state === 'bad') {
    return (
      <span className={`${base} animate-shake border-[#FF5252]/80 bg-[#FF5252]/10 text-[#FF5252]`}>
        {label} [WRONG]
      </span>
    )
  }
  if (state === 'selected') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} cursor-pointer border-2 border-[#FFB000] bg-[#FFB000]/15 text-[#FFB000]`}
      >
        {label} <span aria-hidden="true">▸</span>
      </button>
    )
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} cursor-pointer border-[#00FF66]/40 text-[#00FF66] hover:bg-[#00FF66]/10`}
    >
      {label}
    </button>
  )
}

function TermButton({ label, onClick, disabled = false, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded border-2 border-[#00FF66] bg-[#00FF66] px-6 py-2 text-sm font-black text-black transition hover:scale-105 sm:text-base ${
        disabled ? 'pointer-events-none opacity-30' : ''
      } ${className}`}
    >
      {label}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Terminal shell frame                                                */
/* ------------------------------------------------------------------ */
function TerminalShell({ left, right, children }) {
  return (
    <div
      className="relative flex h-dvh w-full flex-col overflow-hidden bg-[#0D0D0D] font-mono text-[#00FF66] select-text touch-manipulation"
      style={{ fontFamily: 'Courier New, monospace' }}
    >
      <div className="scanlines pointer-events-none absolute inset-0 z-40 opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 z-40 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"
        aria-hidden="true"
      />
      <header className="z-10 flex w-full shrink-0 items-center justify-between gap-2 border-b border-[#00FF66]/30 px-3 py-2 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">{left}</div>
        <div className="flex shrink-0 items-center gap-2 text-[10px] text-[#00FF66]/80 sm:text-xs">
          {right}
        </div>
      </header>
      <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-3 sm:px-5 sm:py-4">
        {children}
      </main>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Task shell (narrative log reveal + prompt + interaction)            */
/* ------------------------------------------------------------------ */
function TaskShell({
  task,
  taskIndex,
  taskTotal,
  mistakes,
  operatorName,
  onExit,
  children,
}) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    setShown(0)
  }, [task])

  useEffect(() => {
    if (shown >= task.logs.length) return undefined
    const t = setTimeout(() => setShown((s) => s + 1), 230)
    return () => clearTimeout(t)
  }, [shown, task])

  const revealed = shown >= task.logs.length

  return (
    <TerminalShell
      left={<BackButton onClick={onExit} />}
      right={
        <>
          <span className="text-[#00FF66]/70 uppercase">OPR:{operatorName}</span>
          <span className="text-[#FFB000]">
            ERR:{mistakes}
          </span>
          <span>
            TASK {taskIndex + 1}/{taskTotal}
          </span>
        </>
      }
    >
      <div className="shrink-0 border-b border-[#00FF66]/20 pb-2">
        <p className="text-[10px] tracking-widest text-[#00FF66]/70 uppercase sm:text-xs">
          {task.kisi_kisi} · {task.step}
        </p>
        <p className="terminal-glow text-sm font-bold sm:text-lg">
          SYS_ADMIN@K5_TERMINAL:~$ <span className="text-[#FFB000]">{task.command}</span>
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-3 text-xs sm:text-sm">
        {task.logs.slice(0, shown).map((line, i) => (
          <TermLine key={`${i}-${line}`} text={line} />
        ))}
        {!revealed && (
          <button
            type="button"
            onClick={() => setShown(task.logs.length)}
            className="mt-2 text-[10px] font-bold text-[#2E7D4F] underline sm:text-xs"
          >
            {'>>>'} SKIP LOG
          </button>
        )}

        {revealed && (
          <div className="animate-pop-in mt-2 flex flex-col gap-3">
            <p className="text-amber-300/90 leading-relaxed">{task.instruction}</p>
            <div className="rounded-lg border border-[#00FF66]/25 bg-black/40 p-3 sm:p-4">
              {children}
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-[#00FF66]/20 pt-2 text-[10px] text-[#00FF66]/60 sm:text-xs">
        <span className="terminal-cursor inline-block h-3.5 w-2 translate-y-0.5 bg-[#00FF66]" aria-hidden="true" />
        <span className="ml-2">waiting for operator input...</span>
      </div>
    </TerminalShell>
  )
}

/* ------------------------------------------------------------------ */
/* Task: DECOMPOSITION                                                 */
/* ------------------------------------------------------------------ */
function DecomTask(props) {
  const { task, taskIndex, taskTotal, stageMistakes, operatorName, onComplete, onExit } = props
  const [solved, setSolved] = useState([])
  const [bad, setBad] = useState(null)
  const [local, setLocal] = useState(0)

  const correctIds = task.chips.filter((c) => c.correct).map((c) => c.id)
  const done = solved.length === correctIds.length
  useFinishOnDone(done, onComplete, local)

  function tap(chip) {
    if (done) return
    if (solved.includes(chip.id)) return
    if (chip.correct) {
      setSolved((prev) => [...prev, chip.id])
      setBad(null)
    } else {
      setLocal((m) => m + 1)
      setBad(chip.id)
      setTimeout(() => setBad(null), 650)
    }
  }

  return (
    <TaskShell
      task={task}
      taskIndex={taskIndex}
      taskTotal={taskTotal}
      mistakes={stageMistakes + local}
      operatorName={operatorName}
      onExit={onExit}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase text-[#00FF66]/70">sub-tasks selected</span>
          <span className="font-bold text-[#FFB000]">
            {solved.length}/{correctIds.length}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {correctIds.map((id) =>
            solved.includes(id) ? (
              <TermChip
                key={id}
                state="done"
                label={task.chips.find((c) => c.id === id).label}
              />
            ) : (
              <span
                key={id}
                className="rounded border border-dashed border-[#00FF66]/30 px-3 py-2 text-xs text-[#00FF66]/40 sm:text-sm"
              >
                SUB_TASK_?? <span aria-hidden="true">_</span>
              </span>
            ),
          )}
        </div>

        <p className="text-xs font-bold text-amber-300/90 sm:text-sm">
          {'>'} Pilih 3 sub-tugas yang benar untuk memecah tugas besar:
        </p>

        <div className="flex flex-wrap gap-2">
          {task.chips.map((chip) => {
            if (solved.includes(chip.id)) return null
            return (
              <TermChip
                key={chip.id}
                state={bad === chip.id ? 'bad' : 'idle'}
                label={chip.label}
                onClick={() => tap(chip)}
              />
            )
          })}
        </div>

        {done && (
          <p className="terminal-glow font-bold text-[#00FF66]">
            [OK] {task.success} CITY GRID SPLIT INTO 3 CLEAR JOBS.
          </p>
        )}
      </div>
    </TaskShell>
  )
}

/* ------------------------------------------------------------------ */
/* Task: PATTERN RECOGNITION                                           */
/* ------------------------------------------------------------------ */
function PatternTask(props) {
  const { task, taskIndex, taskTotal, stageMistakes, operatorName, onComplete, onExit } = props
  const [value, setValue] = useState('')
  const [picked, setPicked] = useState(null)
  const [local, setLocal] = useState(0)

  const done = picked === 'ok'
  useFinishOnDone(done, onComplete, local)

  function submit(raw) {
    if (picked) return
    const norm = normalizeAnswer(raw)
    const ok = norm !== '' && task.accepts.includes(norm)
    setPicked(ok ? 'ok' : 'bad')
    if (ok) setValue('VAL_10')
    else {
      setLocal((m) => m + 1)
      setTimeout(() => setPicked(null), 700)
    }
  }

  function onSubmit(event) {
    event.preventDefault()
    if (!value.trim()) return
    submit(value)
  }

  return (
    <TaskShell
      task={task}
      taskIndex={taskIndex}
      taskTotal={taskTotal}
      mistakes={stageMistakes + local}
      operatorName={operatorName}
      onExit={onExit}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {task.sequence.map((v, i) => {
            const unknown = v.includes('??')
            return (
              <span
                key={`${v}-${i}`}
                className={`rounded border px-3 py-2 text-sm font-black sm:text-lg ${
                  unknown
                    ? 'animate-pulse border-[#FFB000]/80 text-[#FFB000]'
                    : 'border-[#00FF66]/40 text-[#00FF66]'
                }`}
              >
                {unknown ? 'VAL_??' : v}
              </span>
            )
          })}
        </div>

        <p className="text-center text-xs font-bold text-[#00FF66]/70 sm:text-sm">{task.hint}</p>

        <form onSubmit={onSubmit} className="flex flex-col items-center gap-2">
          <label className="text-xs font-bold text-amber-300 sm:text-sm">
            {'>'} enter missing value:
          </label>
          <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={!!picked}
              placeholder="VAL_??"
              autoComplete="off"
              className="min-w-0 flex-1 rounded border-2 border-[#00FF66]/50 bg-black px-4 py-2 font-mono text-base font-bold text-[#00FF66] outline-none placeholder:text-[#00FF66]/30 focus:border-[#00FF66] disabled:opacity-40"
            />
            <TermButton label="[ENTER]" onClick={() => submit(value)} disabled={!value.trim() || !!picked} />
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {task.options.map((opt) => (
            <TermChip
              key={opt}
              label={opt}
              state={picked === 'ok' && opt === 'VAL_10' ? 'done' : picked === 'bad' ? 'idle' : 'idle'}
              onClick={() => submit(opt)}
            />
          ))}
        </div>

        {picked === 'bad' && (
          <p className="animate-pop-in font-bold text-[#FF5252]">[WRONG] VIRUS STEMMED THE STREAM — TRY AGAIN!</p>
        )}
        {picked === 'ok' && (
          <p className="terminal-glow font-bold text-[#00FF66]">[OK] {task.success}</p>
        )}
      </div>
    </TaskShell>
  )
}

/* ------------------------------------------------------------------ */
/* Task: ABSTRACTION                                                   */
/* ------------------------------------------------------------------ */
function AbstractionTask(props) {
  const { task, taskIndex, taskTotal, stageMistakes, operatorName, onComplete, onExit } = props
  const [filter, setFilter] = useState(false)
  const [found, setFound] = useState(null)
  const [local, setLocal] = useState(0)

  const done = found !== null
  useFinishOnDone(done, onComplete, local)

  function tap(line) {
    if (done) return
    if (line.critical) setFound(line.id)
    else setLocal((m) => m + 1)
  }

  return (
    <TaskShell
      task={task}
      taskIndex={taskIndex}
      taskTotal={taskTotal}
      mistakes={stageMistakes + local}
      operatorName={operatorName}
      onExit={onExit}
    >
      <div className="flex flex-col gap-3">
        <TermButton
          label={filter ? `[ON] ${task.filter_on_label}` : `[OFF] ${task.filter_label}`}
          onClick={() => setFilter((f) => !f)}
        />

        <div className="rounded border border-[#00FF66]/20 bg-black/60 font-mono text-[11px] sm:text-sm">
          {task.lines.map((line) => {
            const dim = filter && !line.critical
            const isFound = found === line.id
            return (
              <button
                key={line.id}
                type="button"
                onClick={() => tap(line)}
                disabled={done}
                className={`block w-full px-2 py-0.5 text-left transition ${
                  line.critical
                    ? 'font-bold text-[#00FF66]'
                    : dim
                      ? 'text-[#2E7D4F] opacity-25 blur-[1px]'
                      : 'text-[#2E7D4F]'
                } ${isFound ? 'bg-[#00FF66] font-black text-black' : ''}`}
              >
                {line.text}
              </button>
            )
          })}
        </div>

        <p className="text-xs font-bold text-[#00FF66]/70 sm:text-sm">
          {filter
            ? 'Detail tidak penting tersembunyi — ketuk baris penting yang masih terlihat jelas!'
            : 'Nyalakan filter abstraksi dulu agar fokus ke baris penting saja!'}
        </p>

        {done && (
          <p className="terminal-glow font-bold text-[#00FF66]">[OK] {task.success}</p>
        )}
      </div>
    </TaskShell>
  )
}

/* ------------------------------------------------------------------ */
/* Task: ALGORITHM SEQUENCE                                            */
/* ------------------------------------------------------------------ */
function SequenceTask(props) {
  const { task, taskIndex, taskTotal, stageMistakes, operatorName, onComplete, onExit } = props
  const [selected, setSelected] = useState(null)
  const [slots, setSlots] = useState(() => Array(task.correct.length).fill(null))
  const [local, setLocal] = useState(0)

  const done = slots.every((id) => id !== null)
  useFinishOnDone(done, onComplete, local)

  function tapChip(chip) {
    if (done) return
    setSelected(chip)
  }

  function tapSlot(idx) {
    if (done) return
    if (selected) {
      if (slots[idx]) return
      if (task.correct[idx] === selected.id) {
        const next = [...slots]
        next[idx] = selected.id
        setSlots(next)
        setSelected(null)
      } else {
        setLocal((m) => m + 1)
        setSelected(null)
      }
    }
  }

  function clearSlot(idx) {
    if (done || !slots[idx]) return
    const next = [...slots]
    next[idx] = null
    setSlots(next)
  }

  return (
    <TaskShell
      task={task}
      taskIndex={taskIndex}
      taskTotal={taskTotal}
      mistakes={stageMistakes + local}
      operatorName={operatorName}
      onExit={onExit}
    >
      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold text-[#00FF66]/70 sm:text-sm">
          {'>'} Ketuk perintah di bawah (menyala kuning jika terpilih), lalu ketuk posisi yang benar di atasnya.
        </p>

        <div className="flex flex-col gap-1.5">
          {slots.map((id, idx) => {
            const chip = task.chips.find((c) => c.id === id)
            return (
              <div key={idx} className="relative">
                <button
                  type="button"
                  onClick={() => tapSlot(idx)}
                  disabled={done}
                  className={`flex w-full items-center gap-2 rounded border px-3 py-2 text-left text-xs transition sm:text-sm ${
                    chip
                      ? 'border-[#00FF66] bg-[#00FF66]/10 text-[#00FF66]'
                      : 'border-dashed border-[#00FF66]/30 text-[#00FF66]/40 hover:bg-[#00FF66]/5'
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#00FF66] font-black text-black">
                    {idx + 1}
                  </span>
                  <span>{chip ? chip.label : `CMD_${idx + 1} EMPTY`}</span>
                </button>
                {chip && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      clearSlot(idx)
                    }}
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-[10px] font-bold text-[#FF5252]"
                  >
                    [x]
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          {task.chips.map((chip) => {
            const used = slots.includes(chip.id)
            if (used) return null
            return (
              <TermChip
                key={chip.id}
                label={chip.label}
                state={selected?.id === chip.id ? 'selected' : 'idle'}
                onClick={() => tapChip(chip)}
              />
            )
          })}
        </div>

        {done && (
          <p className="terminal-glow font-bold text-[#00FF66]">
            [OK] {task.success} PATCH APPLIED IN PROPER SEQUENCE.
          </p>
        )}
      </div>
    </TaskShell>
  )
}

/* ------------------------------------------------------------------ */
/* Task: COMPUTATIONAL THINKING diagnostic                             */
/* ------------------------------------------------------------------ */
function DiagnosticTask(props) {
  const { task, taskIndex, taskTotal, stageMistakes, operatorName, onComplete, onExit } = props
  const questions = task.questions
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState(null)
  const [local, setLocal] = useState(0)

  const q = questions[index]
  const last = index === questions.length - 1

  useEffect(() => {
    if (!(answer && answer.correct && last)) return undefined
    const t = setTimeout(() => onComplete(local), 1000)
    return () => clearTimeout(t)
  }, [answer, last, onComplete, local])

  function choose(optionIndex) {
    if (answer) return
    const ok = optionIndex === q.correctIndex
    setAnswer({ picked: optionIndex, correct: ok })
    if (!ok) setLocal((m) => m + 1)
  }

  function next() {
    setAnswer(null)
    setIndex((i) => i + 1)
  }

  return (
    <TaskShell
      task={task}
      taskIndex={taskIndex}
      taskTotal={taskTotal}
      mistakes={stageMistakes + local}
      operatorName={operatorName}
      onExit={onExit}
    >
      {(
        <div className="flex flex-col gap-3">
          <p className="font-bold text-[#FFB000]">
            Q{index + 1}/{questions.length} {'>'} {q.prompt}
          </p>

          <div className="flex flex-col gap-1.5">
            {q.options.map((opt, oi) => {
              const selected = answer && answer.picked === oi
              const isRight = answer && oi === q.correctIndex
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => choose(oi)}
                  disabled={!!answer}
                  className={`rounded border px-3 py-2 text-left text-xs transition sm:text-sm ${
                    answer
                      ? isRight
                        ? 'border-[#00FF66] bg-[#00FF66]/15 font-bold text-[#00FF66]'
                        : selected
                          ? 'border-[#FF5252] bg-[#FF5252]/10 text-[#FF5252]'
                          : 'border-[#00FF66]/15 text-[#00FF66]/40'
                      : 'border-[#00FF66]/40 text-[#00FF66] hover:bg-[#00FF66]/10'
                  }`}
                >
                  <span className="mr-2 font-black">{String.fromCharCode(65 + oi)}.</span>
                  {opt}
                </button>
              )
            })}
          </div>

          {answer && (
            <div
              className={`animate-pop-in rounded border p-2 text-xs sm:text-sm ${
                answer.correct ? 'border-[#00FF66]/50 text-[#00FF66]' : 'border-[#FF5252]/50 text-[#FF5252]'
              }`}
            >
              {answer.correct ? (
                <span className="font-bold">[OK] DIAGNOSTIC NODE STABLE.</span>
              ) : (
                <span className="font-bold">[WRONG] RECALIBRATE... </span>
              )}
              {answer.correct && !last && (
                <button
                  type="button"
                  onClick={next}
                  className="ml-3 rounded border border-[#00FF66]/50 px-3 py-1 font-bold text-[#00FF66] transition hover:bg-[#00FF66] hover:text-black"
                >
                  LANJUT {'>>'}
                </button>
              )}
              {!answer.correct && (
                <button
                  type="button"
                  onClick={() => setAnswer(null)}
                  className="ml-3 rounded border border-[#FF5252]/60 px-3 py-1 font-bold text-[#FF5252] transition hover:bg-[#FF5252] hover:text-black"
                >
                  COBA LAGI {'>>'}
                </button>
              )}
            </div>
          )}

          {answer && answer.correct && last && (
            <p className="terminal-glow font-bold text-[#00FF66]">[OK] {task.success}</p>
          )}
        </div>
      )}
    </TaskShell>
  )
}

/* ------------------------------------------------------------------ */
/* Task: WORD PROCESSING                                               */
/* ------------------------------------------------------------------ */
function WordTask(props) {
  const { task, taskIndex, taskTotal, stageMistakes, operatorName, onComplete, onExit } = props
  const [round, setRound] = useState(0)
  const [applied, setApplied] = useState({})
  const [flash, setFlash] = useState(null)
  const [local, setLocal] = useState(0)

  const r = task.rounds[round]
  const done = round >= task.rounds.length

  useEffect(() => {
    if (!done) return undefined
    const t = setTimeout(() => onComplete(local), 900)
    return () => clearTimeout(t)
  }, [done, onComplete, local])

  function tap(target) {
    if (done) return
    if (target === r.target) {
      setApplied((prev) => ({ ...prev, [r.target]: true }))
      setFlash('ok')
      setTimeout(() => {
        setFlash(null)
        setRound((i) => i + 1)
      }, 950)
    } else {
      setLocal((m) => m + 1)
      setFlash('bad')
      setTimeout(() => setFlash(null), 650)
    }
  }

  return (
    <TaskShell
      task={task}
      taskIndex={taskIndex}
      taskTotal={taskTotal}
      mistakes={stageMistakes + local}
      operatorName={operatorName}
      onExit={onExit}
    >
      <div className="flex flex-col gap-3">
        {!done && (
          <p className="text-xs font-bold text-[#FFB000] sm:text-sm">
            {'>'} armed command:
            <span className="terminal-glow ml-1 rounded border border-[#FFB000]/60 bg-[#FFB000]/10 px-2 py-0.5 text-[#FFB000]">
              {r.cmd}
              <span className="terminal-cursor ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-[#FFB000]" />
            </span>
          </p>
        )}

        <div
          className={`w-full rounded border border-[#00FF66]/30 bg-black/60 p-3 sm:p-4 ${
            flash === 'bad' ? 'animate-shake border-[#FF5252]/60' : ''
          }`}
        >
          <button
            type="button"
            onClick={() => tap('title')}
            disabled={done}
            className={`block text-center text-lg font-black leading-tight tracking-wide sm:text-2xl ${
              applied.title
                ? 'text-[#FFB000] underline decoration-[#FFB000] underline-offset-4'
                : 'text-[#00FF66]'
            }`}
          >
            {task.docTitle}
          </button>
          <p className="mt-2 text-xs leading-relaxed sm:text-sm">
            <span className="text-[#00FF66]/80">Attention all citizens: </span>
            <button
              type="button"
              onClick={() => tap('warning_phrase')}
              disabled={done}
              className={`rounded px-0.5 ${
                applied.warning_phrase
                  ? 'font-black text-[#FFB000] terminal-glow-amber'
                  : 'font-black text-[#00FF66]'
              }`}
            >
              EMERGENCY WARNING
            </button>
            <span className="text-[#00FF66]/80"> — the smart grid of K5 City has failed. </span>
            <button
              type="button"
              onClick={() => tap('decoys')}
              disabled={done}
              className="text-[#00FF66]/70"
            >
              Please stay calm and conserve power.
            </button>
          </p>
        </div>

        <p className="text-xs font-bold text-[#00FF66]/60 sm:text-sm">
          {done
            ? 'Dokumen siap dibaca. Laporan darurat terformat dengan jelas!'
            : `Tugas ${round + 1}/${task.rounds.length}: ${r.label}`}
        </p>

        {flash === 'ok' && (
          <p className="animate-pop-in font-bold text-[#00FF66]">[OK] FORMAT APPLIED!</p>
        )}
        {flash === 'bad' && (
          <p className="animate-pop-in font-bold text-[#FF5252]">[WRONG] SALAH TARGET — COBA LAGI!</p>
        )}
        {done && (
          <p className="terminal-glow font-bold text-[#00FF66]">[OK] {task.success}</p>
        )}
      </div>
    </TaskShell>
  )
}

/* ------------------------------------------------------------------ */
/* Task: SPREADSHEET CALC                                              */
/* ------------------------------------------------------------------ */
function CalcTask(props) {
  const { task, taskIndex, taskTotal, stageMistakes, operatorName, onComplete, onExit } = props
  const [round, setRound] = useState(0)
  const [transcript, setTranscript] = useState([])
  const [local, setLocal] = useState(0)

  const r = task.rounds[round]
  const done = round >= task.rounds.length

  useEffect(() => {
    if (!done) return undefined
    const t = setTimeout(() => onComplete(local), 800)
    return () => clearTimeout(t)
  }, [done, onComplete, local])

  function pick(chip) {
    if (done) return
    setTranscript((prev) => [...prev, { id: `${Date.now()}-${chip.id}`, chip }])
    if (chip.good) setTimeout(() => setRound((i) => i + 1), 900)
    else setLocal((m) => m + 1)
  }

  const t = task.table

  return (
    <TaskShell
      task={task}
      taskIndex={taskIndex}
      taskTotal={taskTotal}
      mistakes={stageMistakes + local}
      operatorName={operatorName}
      onExit={onExit}
    >
      <div className="flex flex-col gap-3">
        <pre className="overflow-x-auto rounded border border-[#00FF66]/30 bg-black/60 p-3 text-[11px] leading-relaxed sm:text-sm">
          {['   | Sector | Damaged | Cost |', '   |--------+---------+------|']
            .concat(
              t.rows.map(
                (row, i) =>
                  `   | ${row.label.padEnd(7)} | ${String(row.b)}   | ${row.c}     |  <- row ${i + 2}`,
              ),
            )
            .join('\n')}
        </pre>

        <div className="flex flex-col gap-1">
          {transcript.map(({ id, chip }) => (
            <div key={id} className="animate-pop-in text-xs sm:text-sm">
              <span className="text-[#00FF66]">$ {chip.cmd}</span>{' '}
              <span className="text-[#FFB000]">{'>'} {chip.result}</span>{' '}
              <span className={chip.good ? 'font-bold text-[#00FF66]' : 'font-bold text-[#FF5252]'}>
                {chip.good ? '[OK]' : '[WRONG]'}
              </span>
            </div>
          ))}
        </div>

        {!done ? (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold text-[#FFB000] sm:text-sm">
              {'>'} TASK {round === 0 ? 'A (SUM)' : 'B (AVERAGE)'}: {r.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {r.chips.map((chip) => (
                <TermChip key={chip.id} label={chip.cmd} onClick={() => pick(chip)} />
              ))}
            </div>
          </div>
        ) : (
          <p className="terminal-glow font-bold text-[#00FF66]">[OK] {task.success}</p>
        )}
      </div>
    </TaskShell>
  )
}

/* ------------------------------------------------------------------ */
/* Task: IMAGE EDITING                                                 */
/* ------------------------------------------------------------------ */
function ImageTask(props) {
  const { task, taskIndex, taskTotal, stageMistakes, operatorName, onComplete, onExit } = props
  const [round, setRound] = useState(0)
  const [applied, setApplied] = useState([])
  const [picked, setPicked] = useState(null)
  const [local, setLocal] = useState(0)

  const r = task.rounds[round]
  const done = round >= task.rounds.length
  const cropped = applied.includes('crop')
  const contrasted = applied.includes('contrast')

  useEffect(() => {
    if (!done) return undefined
    const t = setTimeout(() => onComplete(local), 800)
    return () => clearTimeout(t)
  }, [done, onComplete, local])

  function pick(chip) {
    if (picked || done) return
    if (chip.good) {
      setApplied((prev) => [...prev, chip.id])
      setPicked('ok')
      setTimeout(() => {
        setPicked(null)
        setRound((i) => i + 1)
      }, 1000)
    } else {
      setPicked('bad')
      setLocal((m) => m + 1)
      setTimeout(() => setPicked(null), 650)
    }
  }

  const mapLines = cropped ? task.map_cropped : task.map_original

  return (
    <TaskShell
      task={task}
      taskIndex={taskIndex}
      taskTotal={taskTotal}
      mistakes={stageMistakes + local}
      operatorName={operatorName}
      onExit={onExit}
    >
      <div className="flex flex-col gap-3">
        <pre
          className={`overflow-x-auto rounded border border-[#00FF66]/30 bg-black/60 p-3 text-[10px] leading-tight transition-all duration-500 sm:text-xs ${
            contrasted ? 'terminal-glow-amber text-[#FFB000]' : 'text-[#00FF66]/80'
          } ${cropped ? 'scale-100 border-[#FFB000]/60' : ''}`}
        >
          {mapLines.join('\n')}
        </pre>

        {!done && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold text-[#FFB000] sm:text-sm">
              {'>'} TASK {round === 0 ? 'A (CROP)' : 'B (RECOLOR)'}: {r.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {r.chips.map((chip) => (
                <TermChip
                  key={chip.id}
                  label={chip.cmd}
                  state={picked === 'bad' && !chip.good ? 'bad' : 'idle'}
                  onClick={() => pick(chip)}
                />
              ))}
            </div>
          </div>
        )}

        {picked === 'ok' && (
          <p className="animate-pop-in font-bold text-[#00FF66]">[OK] IMAGE TOOL APPLIED!</p>
        )}
        {picked === 'bad' && (
          <p className="animate-pop-in font-bold text-[#FF5252]">[WRONG] TOOL TIDAK TEPAT!</p>
        )}
        {done && (
          <p className="terminal-glow font-bold text-[#00FF66]">[OK] {task.success}</p>
        )}
      </div>
    </TaskShell>
  )
}

/* ------------------------------------------------------------------ */
/* Task: FILE CONVERSION                                               */
/* ------------------------------------------------------------------ */
function ConvertTask(props) {
  const { task, taskIndex, taskTotal, stageMistakes, operatorName, onComplete, onExit } = props
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState(null)
  const [local, setLocal] = useState(0)
  const [finalShown, setFinalShown] = useState(-1)

  const done = step >= 2

  useEffect(() => {
    if (step < 2) return undefined
    if (finalShown >= task.final_lines.length) {
      const t = setTimeout(() => onComplete(local), 700)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setFinalShown((s) => s + 1), 620)
    return () => clearTimeout(t)
  }, [step, finalShown, task, onComplete, local])

  useEffect(() => {
    setFinalShown(-1)
  }, [step])

  function pick(opt) {
    if (picked || done) return
    if (opt.good) {
      setPicked('ok')
      setTimeout(() => {
        setPicked(null)
        setStep((s) => s + 1)
      }, 650)
    } else {
      setPicked('bad')
      setLocal((m) => m + 1)
      setTimeout(() => setPicked(null), 650)
    }
  }

  const current = step === 0 ? task.step0 : task.step1

  return (
    <TaskShell
      task={task}
      taskIndex={taskIndex}
      taskTotal={taskTotal}
      mistakes={stageMistakes + local}
      operatorName={operatorName}
      onExit={onExit}
    >
      <div className="flex flex-col gap-3">
        {!done && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold text-[#FFB000] sm:text-sm">
              {'>'} STEP {step === 0 ? '1/2' : '2/2'}: {current.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {current.options.map((opt) => (
                <TermChip
                  key={opt.id}
                  label={opt.label}
                  state={picked === 'bad' && !opt.good ? 'bad' : 'idle'}
                  onClick={() => pick(opt)}
                />
              ))}
            </div>
          </div>
        )}

        {step >= 1 && (
          <p className="text-xs font-bold text-[#00FF66]/70 sm:text-sm">
            {'>'} file selected: <span className="text-[#00FF66]">report_final.docx</span>
          </p>
        )}

        <div className="flex flex-col gap-1">
          {step >= 2 &&
            task.final_lines.slice(0, finalShown + 1).map((line, i) => (
              <TermLine key={`${i}-${line}`} text={line} />
            ))}
        </div>

        {picked === 'bad' && (
          <p className="animate-pop-in font-bold text-[#FF5252]">[WRONG] INPUT DITOLAK!</p>
        )}
        {done && finalShown >= task.final_lines.length && (
          <p className="terminal-glow font-bold text-[#00FF66]">[OK] {task.success}</p>
        )}
      </div>
    </TaskShell>
  )
}

/* ------------------------------------------------------------------ */
/* Intro / boot screen                                                 */
/* ------------------------------------------------------------------ */
function BootIntro({ progress, onStart, onExit }) {
  const [name, setName] = useState(progress.name)
  const [phase, setPhase] = useState('boot')
  const [shown, setShown] = useState(0)

  const lines = phase === 'boot' ? TERMINAL_PROTOCOL_META.boot_log : TERMINAL_PROTOCOL_META.story_lines
  const revealed = shown >= lines.length

  useEffect(() => {
    setShown(0)
  }, [phase])

  useEffect(() => {
    if (shown >= lines.length) return undefined
    const t = setTimeout(() => setShown((s) => s + 1), 240)
    return () => clearTimeout(t)
  }, [shown, phase, lines])

  function submit(event) {
    event.preventDefault()
    if (name.trim()) setPhase('story')
  }

  return (
    <TerminalShell
      left={<BackButton onClick={onExit} />}
      right={
        <>
          <span className="uppercase">Kelas 5 · Informatika</span>
          <span className="uppercase">PTS Terminal</span>
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3 px-1">
        <pre className="mx-auto overflow-x-auto text-center text-[8px] leading-tight text-[#FFB000] sm:text-xs">
          {TERMINAL_PROTOCOL_META.nova_bug_art.join('\n')}
        </pre>
        <p className="terminal-glow text-center text-base font-black sm:text-2xl">
          {TERMINAL_PROTOCOL_META.game_title}
        </p>

        <div className="mx-auto w-full max-w-xl rounded-lg border border-[#00FF66]/25 bg-black/50 p-3 sm:p-4">
          {lines.slice(0, shown).map((line, i) => (
            <TermLine key={`${i}-${line}`} text={line} />
          ))}
          {!revealed && (
            <button
              type="button"
              onClick={() => setShown(lines.length)}
              className="mt-2 text-[10px] font-bold text-[#2E7D4F] underline sm:text-xs"
            >
              {'>>>'} SKIP
            </button>
          )}
        </div>

        {revealed && phase === 'boot' && (
          <form onSubmit={submit} className="mx-auto flex w-full max-w-xl flex-col gap-2">
            <label className="text-xs font-bold text-amber-300 sm:text-sm">
              {'>'} enter your callsign (nama pahlawan):
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Agent Cyber 5"
                autoComplete="off"
                autoFocus
                className="min-w-0 flex-1 rounded border-2 border-[#00FF66]/50 bg-black px-4 py-2 font-mono text-base font-bold text-[#00FF66] outline-none placeholder:text-[#00FF66]/30 focus:border-[#00FF66]"
              />
              <button
                type="submit"
                disabled={!name.trim()}
                className="rounded border-2 border-[#00FF66] bg-[#00FF66] px-6 py-2 text-sm font-black text-black transition hover:scale-105 disabled:pointer-events-none disabled:opacity-30 sm:text-base"
              >
                [CONNECT]
              </button>
            </div>
          </form>
        )}

        {revealed && phase === 'story' && (
          <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
            <TermButton label="[INITIATE PROTOCOL]" onClick={() => onStart(name.trim())} />
            <button
              type="button"
              onClick={() => setPhase('boot')}
              className="text-xs font-bold text-[#2E7D4F] underline"
            >
              {'<-'} back to boot
            </button>
          </div>
        )}
      </div>
    </TerminalShell>
  )
}

/* ------------------------------------------------------------------ */
/* Stage map (mission control)                                         */
/* ------------------------------------------------------------------ */
function StageMap({ progress, onSelect, onExit }) {
  const stages = progress.stages || {}
  const s1 = stages[1]
  const s2 = stages[2]
  const totalMistakes = (s1?.mistakes ?? 0) + (s2?.mistakes ?? 0)
  const stars = totalMistakes > 0 || s1 || s2 ? starsFor(totalMistakes) : 0

  return (
    <TerminalShell
      left={<BackButton onClick={onExit} />}
      right={
        <>
          <span className="uppercase opacity-80">OPR:{progress.name || TERMINAL_PROTOCOL_META.operator}</span>
          <span className="text-[#FFB000]">ERR:{totalMistakes}</span>
          <span>{'*'.repeat(Math.max(stars, 0))}</span>
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <div className="shrink-0 border-b border-[#00FF66]/20 pb-2">
          <p className="text-[10px] tracking-widest text-[#00FF66]/70 uppercase sm:text-xs">
            {'//'} K5_CITY MISSION CONTROL
          </p>
          <p className="terminal-glow text-sm font-bold sm:text-lg">
            SELECT MISSION —{' '}
            <span className="text-[#FFB000]">
              {s1 && s2 ? 'ALL SYSTEMS RESTORED' : 'CITY GRID OFFLINE'}
            </span>
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
          {TERMINAL_PROTOCOL_STAGES.map((stage) => {
            const record = stages[stage.id]
            const unlocked = stage.id === 1 || s1?.done
            return (
              <section
                key={stage.id}
                className={`rounded-lg border p-3 sm:p-4 ${
                  unlocked ? 'border-[#00FF66]/40 bg-black/40' : 'border-[#FF5252]/40 bg-black/30'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-black text-[#FFB000]">
                    STAGE {stage.id} {'·'} {stage.short}
                  </p>
                  <p
                    className={`text-xs font-bold ${
                      record ? 'text-[#00FF66]' : unlocked ? 'animate-pulse text-amber-300' : 'text-[#FF5252]'
                    }`}
                  >
                    {record ? '[MISSION COMPLETE]' : unlocked ? '[READY]' : '[LOCKED]'}
                  </p>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[#00FF66]/80 sm:text-sm">
                  {stage.name}
                </p>
                <p className="text-xs text-[#00FF66]/60">
                  {'>'} {stage.objective}
                </p>
                <p className="text-[10px] text-[#00FF66]/50">
                  TASKS: {stage.tasks.length} · KEKELIRUAN: {record?.mistakes ?? '–'}
                </p>

                {unlocked ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <TermButton label={`[ACCESS STAGE ${stage.id}]`} onClick={() => onSelect(stage.id)} />
                  </div>
                ) : (
                  <p className="mt-2 text-xs font-bold text-[#FF5252]">
                    [LOCKED] SELESAIKAN STAGE 1 UNTUK MEMBUKA STAGE 2.
                  </p>
                )}
              </section>
            )
          })}
        </div>

        <p className="shrink-0 text-[10px] text-[#00FF66]/50">
          {'//'} Ada 2 stage. Selesaikan semua baris perintah untuk mengirim laporan darurat ke walikota.
        </p>
      </div>
    </TerminalShell>
  )
}

/* ------------------------------------------------------------------ */
/* Stage clear + victory                                               */
/* ------------------------------------------------------------------ */
function StageClearScreen({ mistakes, operatorName, onContinue, onExit }) {
  return (
    <TerminalShell
      left={<BackButton onClick={onExit} />}
      right={
        <>
          <span className="uppercase opacity-80">OPR:{operatorName}</span>
          <span className="text-[#FFB000]">ERR:{mistakes}</span>
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4">
        <pre className="overflow-x-auto text-center text-[10px] leading-tight text-[#00FF66] sm:text-sm">
          {[
            '  +=========================================+',
            '  |   [OK] STAGE 1 CLEARED                  |',
            '  |   LOGIC CORE RESTORED = ONLINE          |',
            '  |   VIRUS NOVA-BUG PURGED FROM KERNEL     |',
            '  +=========================================+',
          ].join('\n')}
        </pre>
        <p className="max-w-md text-center text-xs leading-relaxed text-[#00FF66]/80 sm:text-sm">
          Inti logika kembali menyala! Sekarang buka STAGE 2 untuk mengolah data darurat dan mengirim
          laporan ke walikota.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <TermButton label="[OPEN STAGE 2]" onClick={onContinue} />
          <button
            type="button"
            onClick={onExit}
            className="rounded border border-[#00FF66]/40 px-4 py-2 text-sm font-bold text-[#00FF66]"
          >
            EXIT
          </button>
        </div>
      </div>
    </TerminalShell>
  )
}

function VictoryScreen({ progress, onRestart, onExit }) {
  const stages = progress.stages || {}
  const s1 = stages[1]
  const s2 = stages[2]
  const totalMistakes = (s1?.mistakes ?? 0) + (s2?.mistakes ?? 0)
  const stars = starsFor(totalMistakes)

  useEffect(() => {
    celebrate()
  }, [])

  return (
    <TerminalShell
      left={<BackButton onClick={onExit} />}
      right={
        <>
          <span className="uppercase opacity-80">OPR:{progress.name}</span>
          <span className="text-[#FFB000]">ERR:{totalMistakes}</span>
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-y-auto">
        <pre className="overflow-x-auto text-center text-[9px] leading-tight text-[#00FF66] sm:text-sm">
          {[
            '  .------------------------.',
            '  |   TRANSMISSION COMPLETE  |',
            "  |   *_*_*_*_*_*_*_*_*_*_*  |",
            '  |  LOGIC CORE RESTORED ✓  |',
            '  |  REPORT SENT TO MAYOR ✓ |',
            '  |  CITY GRID BACK ONLINE  |',
            '  |   100% ✓ ✓ ✓ ✓ ✓ ✓     |',
            '  `-------------------------`',
          ].join('\n')}
        </pre>

        <p className="terminal-glow-amber text-center text-base font-black text-[#FFB000] sm:text-2xl">
          MISI BERHASIL, {progress.name || 'AGENT CYBER 5'}!
        </p>
        <p className="max-w-lg text-center text-xs leading-relaxed text-[#00FF66]/80 sm:text-sm">
          NOVA-BUG berhasil disingkirkan, logic core menyala, dan laporan darurat sudah diterima
          oleh walikota. Kota K5 aman berkat Pahlawan Terminal!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={`text-2xl sm:text-3xl ${i <= stars ? '' : 'opacity-20 grayscale'}`}
              aria-hidden="true"
            >
              ★
            </span>
          ))}
          <span className="text-[#FFB000]">{stars}/3</span>
          <span className="text-[#00FF66]/60">· errors: {totalMistakes}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <TermButton label="[RETRY PROTOCOL]" onClick={onRestart} />
          <button
            type="button"
            onClick={onExit}
            className="rounded border border-[#00FF66]/40 px-4 py-2 text-sm font-bold text-[#00FF66]"
          >
            [CLOSE TERMINAL]
          </button>
        </div>
      </div>
    </TerminalShell>
  )
}

/* ------------------------------------------------------------------ */
/* Stage runner                                                        */
/* ------------------------------------------------------------------ */
const TASK_COMPONENTS = {
  decomposition: DecomTask,
  pattern: PatternTask,
  abstraction: AbstractionTask,
  sequence: SequenceTask,
  diagnostic: DiagnosticTask,
  word: WordTask,
  spreadsheet: CalcTask,
  image: ImageTask,
  convert: ConvertTask,
}

function StageRunner({ stage, taskIndex, stageMistakes, operatorName, onComplete, onExit }) {
  const task = stage.tasks[taskIndex]
  const TaskComp = TASK_COMPONENTS[task.type]
  return (
    <TaskComp
      key={`${stage.id}-${taskIndex}`}
      stage={stage}
      task={task}
      taskIndex={taskIndex}
      taskTotal={stage.tasks.length}
      stageMistakes={stageMistakes}
      operatorName={operatorName}
      onComplete={onComplete}
      onExit={onExit}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Main game                                                           */
/* ------------------------------------------------------------------ */
function TerminalProtocolGame({ onExit }) {
  const [progress, setProgress] = useState(loadProgress)
  const [screen, setScreen] = useState(() => (progress.name ? 'stages' : 'boot'))
  const [stageId, setStageId] = useState(null)
  const [taskIndex, setTaskIndex] = useState(0)
  const [stageMistakes, setStageMistakes] = useState(0)
  const [clearedStageId, setClearedStageId] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
    } catch {
      /* ignore */
    }
  }, [progress])

  function startAdventure(name) {
    setProgress((prev) => ({ ...prev, name }))
    setScreen('stages')
  }

  function selectStage(id) {
    setStageId(id)
    setTaskIndex(0)
    setStageMistakes(0)
    setScreen('stage')
  }

  function onTaskComplete(taskMistakes) {
    const nextMistakes = stageMistakes + taskMistakes
    const stage = TERMINAL_PROTOCOL_STAGES.find((s) => s.id === stageId)
    if (taskIndex + 1 < stage.tasks.length) {
      setStageMistakes(nextMistakes)
      setTaskIndex((i) => i + 1)
      return
    }
    const record = { done: true, mistakes: nextMistakes }
    setProgress((prev) => ({
      ...prev,
      stages: { ...prev.stages, [stageId]: record },
    }))
    if (stageId === 1) {
      setClearedStageId(stageId)
      setScreen('clear')
    } else {
      setScreen('victory')
    }
  }

  if (screen === 'boot') {
    return <BootIntro progress={progress} onStart={startAdventure} onExit={onExit} />
  }

  if (screen === 'stages') {
    return <StageMap progress={progress} onSelect={selectStage} onExit={onExit} />
  }

  if (screen === 'stage' && stageId !== null) {
    const stage = TERMINAL_PROTOCOL_STAGES.find((s) => s.id === stageId)
    return (
      <StageRunner
        stage={stage}
        taskIndex={taskIndex}
        stageMistakes={stageMistakes}
        operatorName={progress.name || TERMINAL_PROTOCOL_META.operator}
        onComplete={onTaskComplete}
        onExit={() => setScreen('stages')}
      />
    )
  }

  if (screen === 'clear' && clearedStageId !== null) {
    const stage = TERMINAL_PROTOCOL_STAGES.find((s) => s.id === clearedStageId)
    return (
      <StageClearScreen
        stage={stage}
        mistakes={progress.stages?.[1]?.mistakes ?? 0}
        operatorName={progress.name || TERMINAL_PROTOCOL_META.operator}
        onContinue={() => setScreen('stages')}
        onExit={onExit}
      />
    )
  }

  if (screen === 'victory') {
    return (
      <VictoryScreen
        progress={progress}
        onRestart={() => setScreen('stages')}
        onExit={onExit}
      />
    )
  }

  return <StageMap progress={progress} onSelect={selectStage} onExit={onExit} />
}

export default TerminalProtocolGame