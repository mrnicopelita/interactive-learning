import { useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import {
  CYBERQUEST_META,
  CYBERQUEST_STAGES,
  starsFor,
} from './cyberquestData.js'

const PROGRESS_KEY = 'cyberquest-progress-v1'

function shuffleArray(list) {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function normalizeAnswer(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
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

function startGhostDrag(event, onDrop) {
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
    onDrop(e.clientX, e.clientY)
  }

  document.addEventListener('pointermove', move)
  document.addEventListener('pointerup', up)
}

function pointInRect(rect, x, y) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}

function zoneRect(zoneId) {
  const el = document.getElementById(zoneId)
  if (!el) return null
  return el.getBoundingClientRect()
}

function burstConfetti() {
  confetti({ particleCount: 80, spread: 75, origin: { y: 0.6 } })
}

function celebrate() {
  const end = Date.now() + 4000
  const frame = () => {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } })
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

function useFinishOnDone(done, onComplete, mistakes) {
  const fired = useRef(false)
  useEffect(() => {
    if (done && !fired.current) {
      fired.current = true
      const t = setTimeout(() => onComplete(mistakes), 1200)
      return () => clearTimeout(t)
    }
  }, [done, onComplete, mistakes])
}

function StarsRow({ count, size = 'text-3xl' }) {
  return (
    <div className={`flex items-center gap-1 ${size}`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= count ? '' : 'opacity-25 grayscale'} aria-hidden="true">
          ⭐
        </span>
      ))}
    </div>
  )
}

function MinigameShell({ stage, mistakes, children }) {
  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-sky-100 via-cyan-50 to-indigo-100">
      <div className="z-10 flex w-full shrink-0 items-center justify-between gap-2 px-4 pt-3 sm:px-6 sm:pt-4">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('cyberquest-back'))}
          className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-slate-600 shadow-lg transition hover:scale-105 sm:px-6 sm:py-3"
        >
          <span aria-hidden="true" className="text-xl sm:text-3xl">←</span>
          <span className="hidden sm:inline">{stage.title}</span>
        </button>
        <div
          className={`flex items-center gap-1 rounded-full bg-gradient-to-r ${stage.color.grad} px-4 py-2 text-lg font-extrabold text-white shadow-lg sm:text-xl`}
        >
          <span aria-hidden="true">❌</span>
          <span className="tabular-nums">{mistakes}</span>
        </div>
      </div>

      <header className="z-10 flex w-full shrink-0 flex-col items-center gap-1 px-4 pt-3 text-center sm:pt-4">
        <h1 className="text-[clamp(1.5rem,5vw,2.5rem)] font-extrabold leading-none text-slate-700">
          {stage.icon} {stage.minigame.title}
        </h1>
        <p className="text-xs font-bold text-slate-500 sm:text-base">
          {stage.minigame.instruction}
        </p>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-4 pt-3 sm:gap-4 sm:px-6 sm:pb-6">
        {children}
      </main>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Stage 1 - Node Connector                                            */
/* ------------------------------------------------------------------ */
function NodeConnector({ stage, onComplete }) {
  const cfg = stage.minigame
  const correctIds = cfg.cards.filter((c) => c.correct).map((c) => c.id)
  const [solved, setSolved] = useState([])
  const [dismissed, setDismissed] = useState([])
  const [mistakes, setMistakes] = useState(0)

  const done = solved.length === correctIds.length

  function tap(card) {
    if (done) return
    if (solved.includes(card.id) || dismissed.includes(card.id)) return
    if (card.correct) {
      setSolved((prev) => [...prev, card.id])
      burstConfetti()
    } else {
      setDismissed((prev) => [...prev, card.id])
      setMistakes((m) => m + 1)
    }
  }

  useFinishOnDone(done, onComplete, mistakes)

  return (
    <MinigameShell stage={stage} mistakes={mistakes}>
      <div className="flex flex-col items-center gap-4">
        <div
          className={`w-full max-w-2xl rounded-3xl p-4 text-center shadow-inner sm:p-6 ${
            done ? 'bg-emerald-100 ring-4 ring-emerald-400' : 'bg-slate-800'
          }`}
        >
          <p
            className={`text-sm font-extrabold uppercase tracking-wide sm:text-base ${
              done ? 'text-emerald-700' : 'text-slate-300'
            }`}
          >
            {done ? '✓ Inti Pemrosesan Menyala!' : cfg.coreLabel}
          </p>
          <div className="mt-3 flex items-center justify-center gap-3 sm:gap-4">
            {correctIds.map((id) => {
              const filled = solved.includes(id)
              return (
                <div
                  key={id}
                  className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-lg transition sm:h-20 sm:w-20 ${
                    filled
                      ? 'animate-pop-in bg-gradient-to-br from-emerald-400 to-cyan-500'
                      : 'animate-pulse border-2 border-dashed border-slate-500 bg-slate-700'
                  }`}
                >
                  {filled ? '⚙️' : '·'}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
          {cfg.cards.map((card) => {
            const isSolved = solved.includes(card.id)
            const isDismissed = dismissed.includes(card.id)
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => tap(card)}
                className={`flex items-center gap-3 rounded-2xl border-2 bg-white/95 px-4 py-3 text-left text-base font-bold shadow transition sm:text-lg ${
                  isSolved ? 'pointer-events-none border-emerald-400 opacity-40' : ''
                } ${isDismissed ? 'pointer-events-none border-red-300 opacity-40' : 'hover:scale-105'}`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl ${
                    isSolved ? 'bg-emerald-500 text-white' : isDismissed ? 'bg-red-400 text-white' : 'bg-sky-100'
                  }`}
                  aria-hidden="true"
                >
                  {isSolved ? '✓' : isDismissed ? '✗' : '?'}
                </span>
                <span className={isDismissed ? 'line-through' : ''}>{card.text}</span>
              </button>
            )
          })}
        </div>
      </div>
    </MinigameShell>
  )
}

/* ------------------------------------------------------------------ */
/* Stage 2 - Sequence Builder                                          */
/* ------------------------------------------------------------------ */
function SequenceBuilder({ stage, onComplete }) {
  const sequences = stage.minigame.sequences
  const [seqIdx, setSeqIdx] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const sequence = sequences[seqIdx]
  const slots = useMemo(() => Array.from({ length: sequence.items.length }, (_, i) => i), [sequence])
  const [placed, setPlaced] = useState(() => Array(sequence.items.length).fill(null))
  const tray = useMemo(
    () => shuffleArray(sequence.items.filter((item) => !placed.includes(item.id))),
    [sequence, placed],
  )

  const done = placed.every((id) => id !== null)
  const lastSeq = seqIdx + 1 >= sequences.length

  function dropChip(item, x, y) {
    if (done) return
    for (const idx of slots) {
      const rect = zoneRect(`cq-seq-slot-${idx}`)
      if (!rect || !pointInRect(rect, x, y)) continue
      if (sequence.items[idx].id === item.id) {
        setPlaced((prev) => {
          const next = [...prev]
          next[idx] = item.id
          return next
        })
      } else {
        setMistakes((m) => m + 1)
      }
      return
    }
  }

  useEffect(() => {
    if (!done) return undefined
    burstConfetti()
    const t = setTimeout(() => {
      if (lastSeq) {
        onComplete(mistakes)
      } else {
        setSeqIdx((i) => i + 1)
        setPlaced(Array(sequences[seqIdx + 1].items.length).fill(null))
      }
    }, 1100)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  if (done && seqIdx + 1 >= sequences.length) {
    return (
      <MinigameShell stage={stage} mistakes={mistakes}>
        <FinishWide stage={stage} label="Jembatan Kokoh Kembali!" />
      </MinigameShell>
    )
  }

  return (
    <MinigameShell stage={stage} mistakes={mistakes}>
      <div className="flex flex-col items-center gap-4">
        <span className="rounded-full bg-white/90 px-5 py-2 text-lg font-extrabold text-slate-600 shadow sm:text-2xl">
          🧑‍🏫 {sequence.label}
        </span>

        <div className="flex w-full max-w-xl flex-col gap-2.5">
          {slots.map((idx) => {
            const itemId = placed[idx]
            const item = sequence.items.find((it) => it.id === itemId)
            return (
              <div
                key={idx}
                id={`cq-seq-slot-${idx}`}
                className={`flex min-h-16 items-center gap-3 rounded-2xl border-2 border-dashed px-4 py-2 transition sm:min-h-20 ${
                  item ? 'border-emerald-400 bg-emerald-50' : 'border-sky-300 bg-white/80'
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-600 text-lg font-extrabold text-white">
                  {idx + 1}
                </span>
                {item ? (
                  <span className="animate-pop-in text-base font-extrabold text-slate-700 sm:text-lg">
                    {item.text}
                  </span>
                ) : (
                  <span className="text-sm font-bold text-slate-300">Seret langkah ke sini…</span>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex w-full max-w-xl flex-wrap items-center justify-center gap-3">
          {tray.map((item) => (
            <button
              key={item.id}
              type="button"
              onPointerDown={(e) => startGhostDrag(e, (x, y) => dropChip(item, x, y))}
              className="animate-pop-in cursor-grab touch-none select-none rounded-2xl bg-white px-5 py-3 text-base font-extrabold text-slate-700 shadow-lg ring-2 ring-sky-200 transition hover:scale-105 sm:text-lg"
            >
              {item.text}
            </button>
          ))}
          {tray.length === 0 && (
            <span className="animate-pulse text-xl font-extrabold text-emerald-600">
              Urutannya benar! 🎉
            </span>
          )}
        </div>
      </div>
    </MinigameShell>
  )
}

/* ------------------------------------------------------------------ */
/* Stage 3 - Decomposition Studio                                      */
/* ------------------------------------------------------------------ */
function DecompositionStudio({ stage, onComplete }) {
  const cfg = stage.minigame
  const [placed, setPlaced] = useState([])
  const [mistakes, setMistakes] = useState(0)
  const tray = useMemo(() => shuffleArray(cfg.items.filter((i) => !placed.includes(i.id))), [cfg, placed])

  const done = placed.length === cfg.items.length

  useFinishOnDone(done, onComplete, mistakes)

  function dropChip(item, x, y) {
    if (done) return
    for (const bin of cfg.bins) {
      const rect = zoneRect(`cq-dec-${bin.id}`)
      if (rect && pointInRect(rect, x, y)) {
        if (item.bin === bin.id) {
          setPlaced((prev) => [...prev, item.id])
        } else {
          setMistakes((m) => m + 1)
        }
        return
      }
    }
    const trashRect = zoneRect('cq-dec-trash')
    if (trashRect && pointInRect(trashRect, x, y)) {
      if (item.bin === null) {
        setPlaced((prev) => [...prev, item.id])
      } else {
        setMistakes((m) => m + 1)
      }
    }
  }

  const binned = (binId) => cfg.items.filter((i) => placed.includes(i.id) && i.bin === binId)
  const trashed = cfg.items.filter((i) => placed.includes(i.id) && i.bin === null)

  return (
    <MinigameShell stage={stage} mistakes={mistakes}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-2xl rounded-3xl bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-center shadow-lg sm:p-5">
          <p className="text-xl font-extrabold text-white sm:text-2xl">
            🏠 Tujuan Besar: "{cfg.goal}"
          </p>
        </div>

        <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
          {cfg.bins.map((bin) => (
            <div
              key={bin.id}
              id={`cq-dec-${bin.id}`}
              className={`flex min-h-36 flex-col items-center gap-2 rounded-2xl border-2 p-3 shadow transition ${
                binned(bin.id).length > 0 ? 'border-emerald-400 bg-emerald-50' : 'border-dashed border-slate-300 bg-white/80'
              }`}
            >
              <span className="text-3xl" aria-hidden="true">{bin.emoji}</span>
              <span className="text-center text-sm font-extrabold text-slate-700">
                {bin.label}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {binned(bin.id).map((item) => (
                  <span key={item.id} className="animate-pop-in rounded-full bg-emerald-500 px-3 py-1 text-xs font-extrabold text-white shadow">
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          id="cq-dec-trash"
          className={`flex min-h-16 w-full max-w-2xl flex-wrap items-center justify-center gap-2 rounded-2xl border-2 p-3 shadow ${
            trashed.length > 0 ? 'border-red-300 bg-red-50' : 'border-dashed border-slate-300 bg-white/70'
          }`}
        >
          <span className="text-2xl" aria-hidden="true">🗑️</span>
          <span className="text-sm font-extrabold text-slate-500">Bukan bagian dari rencana</span>
          {trashed.map((item) => (
            <span key={item.id} className="animate-pop-in rounded-full bg-slate-500 px-3 py-1 text-xs font-extrabold text-white shadow">
              {item.label}
            </span>
          ))}
        </div>

        <div className="flex w-full max-w-2xl flex-wrap items-center justify-center gap-3">
          {tray.map((item) => (
            <button
              key={item.id}
              type="button"
              onPointerDown={(e) => startGhostDrag(e, (x, y) => dropChip(item, x, y))}
              className="animate-pop-in cursor-grab touch-none select-none rounded-2xl bg-white px-5 py-3 text-base font-extrabold text-slate-700 shadow-lg ring-2 ring-sky-200 transition hover:scale-105 sm:text-lg"
            >
              {item.label}
            </button>
          ))}
          {tray.length === 0 && (
            <span className="animate-pulse text-xl font-extrabold text-emerald-600">
              Ruangcyber rapi kembali! 🎉
            </span>
          )}
        </div>
      </div>
    </MinigameShell>
  )
}

/* ------------------------------------------------------------------ */
/* Stage 4 - Pattern Filler                                            */
/* ------------------------------------------------------------------ */
function PatternFiller({ stage, onComplete }) {
  const cfg = stage.minigame
  const [idx, setIdx] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [picked, setPicked] = useState(null)
  const solve = cfg.solves[idx]
  const done = idx >= cfg.solves.length

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => onComplete(mistakes), 600)
      return () => clearTimeout(t)
    }
    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  function choose(optionIndex) {
    if (picked !== null) return
    setPicked(optionIndex)
    if (optionIndex === solve.answer) {
      burstConfetti()
      setTimeout(() => {
        setPicked(null)
        setIdx((i) => i + 1)
      }, 900)
    } else {
      setMistakes((m) => m + 1)
      setTimeout(() => setPicked(null), 700)
    }
  }

  if (done) {
    return (
      <MinigameShell stage={stage} mistakes={mistakes}>
        <FinishWide stage={stage} label="Pintu Keamanan Terbuka!" />
      </MinigameShell>
    )
  }

  return (
    <MinigameShell stage={stage} mistakes={mistakes}>
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-center gap-2">
          {cfg.solves.map((s, i) => (
            <span
              key={s.id}
              className={`h-3 w-3 rounded-full ${i < idx ? 'bg-emerald-500' : i === idx ? 'animate-pulse bg-amber-400' : 'bg-slate-300'}`}
            />
          ))}
        </div>

        <div className="flex w-full max-w-xl flex-wrap items-center justify-center gap-3">
          {solve.display.map((d, i) => {
            const isUnknown = d === '?'
            return (
              <div
                key={i}
                className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg sm:h-20 sm:w-20 ${
                  isUnknown
                    ? 'animate-pulse border-4 border-dashed border-amber-400 bg-amber-50 text-3xl font-black text-amber-500'
                    : 'bg-white text-2xl font-black text-slate-700 sm:text-3xl'
                }`}
              >
                {d}
              </div>
            )
          })}
        </div>

        <p className="rounded-full bg-white/80 px-4 py-1.5 text-sm font-bold text-slate-500 shadow sm:text-base">
          💡 {solve.hint}
        </p>

        <div className="flex w-full max-w-xl flex-wrap items-center justify-center gap-4">
          {solve.options.map((option, optionIndex) => (
            <button
              key={option}
              type="button"
              onClick={() => choose(optionIndex)}
              className={`rounded-2xl bg-white px-6 py-4 text-2xl font-black text-slate-700 shadow-lg ring-4 transition hover:scale-105 sm:px-8 sm:py-5 sm:text-3xl ${
                picked !== null && optionIndex === solve.answer && picked === optionIndex
                  ? 'ring-emerald-400'
                  : picked !== null && picked === optionIndex
                    ? 'animate-shake ring-red-400'
                    : 'ring-sky-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {picked !== null && (
          <p
            className={`animate-pop-in rounded-full px-5 py-2 text-lg font-extrabold text-white shadow ${
              picked === solve.answer ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          >
            {picked === solve.answer ? 'Benar! Kunci berputar! 🎉' : 'Salah! Coba lagi! 💪'}
          </p>
        )}
      </div>
    </MinigameShell>
  )
}

/* ------------------------------------------------------------------ */
/* Stage 5 - Abstraction Filter                                        */
/* ------------------------------------------------------------------ */
function AbstractionFilter({ stage, onComplete }) {
  const cfg = stage.minigame
  const [filterOn, setFilterOn] = useState(false)
  const [found, setFound] = useState([])
  const [mistakes, setMistakes] = useState(0)

  const done = found.length >= cfg.totalTargets

  function tap(item) {
    if (done) return
    if (found.includes(item.id)) return
    if (item.kind === 'bus') {
      setFound((prev) => [...prev, item.id])
      if (found.length + 1 >= cfg.totalTargets) burstConfetti()
    } else {
      setMistakes((m) => m + 1)
    }
  }

  useFinishOnDone(done, onComplete, mistakes)

  return (
    <MinigameShell stage={stage} mistakes={mistakes}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full bg-white/90 px-5 py-2 text-lg font-extrabold text-slate-600 shadow">
            🎯 {cfg.mission}
          </span>
          <button
            type="button"
            onClick={() => setFilterOn((v) => !v)}
            className={`rounded-full px-6 py-2.5 text-lg font-extrabold text-white shadow-lg transition hover:scale-105 ${
              filterOn ? 'bg-violet-600 ring-4 ring-violet-300' : 'animate-pulse bg-slate-500'
            }`}
          >
            {filterOn ? '🔍 Filter Menyala' : `👓 ${cfg.filterLabel}`}
          </button>
        </div>

        <div className="grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {cfg.items.map((item) => {
            const isFound = found.includes(item.id)
            const dimmed = filterOn && item.kind === 'noise'
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => tap(item)}
                className={`relative flex flex-col items-center gap-1 rounded-2xl p-4 shadow-lg transition sm:p-5 ${
                  isFound
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-300'
                    : dimmed
                      ? 'opacity-35 blur-[2px] saturate-50'
                      : filterOn
                        ? 'animate-glow-port bg-white'
                        : 'bg-white/90'
                }`}
              >
                <span className="text-4xl sm:text-5xl" aria-hidden="true">{item.emoji}</span>
                <span className={`text-xs font-extrabold ${isFound ? 'text-white' : 'text-slate-600'}`}>
                  {item.label}
                </span>
                {isFound && (
                  <span className="animate-pop-in absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-sm text-white shadow">
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <p className="rounded-full bg-white/80 px-4 py-1.5 text-center text-sm font-bold text-slate-500 shadow">
          {filterOn
            ? 'Detail tidak penting tersembunyi — ketuk halte bus yang masih terlihat jelas!'
            : 'Nyalakan kacamata filter dulu agar fokus ke hal penting saja!'}
        </p>
      </div>
    </MinigameShell>
  )
}

/* ------------------------------------------------------------------ */
/* Stage 6 - Formatting Studio                                         */
/* ------------------------------------------------------------------ */
function FormattingStudio({ stage, onComplete }) {
  const cfg = stage.minigame
  const [taskIdx, setTaskIdx] = useState(0)
  const [styles, setStyles] = useState({})
  const [mistakes, setMistakes] = useState(0)
  const [picked, setPicked] = useState(null)

  const done = taskIdx >= cfg.tasks.length

  const titleStyle = {
    fontWeight: styles.bold ? 900 : 700,
  }
  const bodyStyle = {
    textAlign: styles.align ? 'center' : 'left',
    fontSize: styles.font ? '1.3rem' : '1rem',
  }

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => onComplete(mistakes), 600)
      return () => clearTimeout(t)
    }
    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  function choose(toolId) {
    if (picked !== null) return
    const task = cfg.tasks[taskIdx]
    if (toolId === task.tool) {
      setPicked('ok')
      setStyles((prev) => ({ ...prev, [task.tool]: true }))
      burstConfetti()
      setTimeout(() => {
        setPicked(null)
        setTaskIdx((i) => i + 1)
      }, 800)
    } else {
      setPicked('bad')
      setMistakes((m) => m + 1)
      setTimeout(() => setPicked(null), 700)
    }
  }

  if (done) {
    return (
      <MinigameShell stage={stage} mistakes={mistakes}>
        <FinishWide stage={stage} label="Koran Sekolah Siap Dicetak!" />
      </MinigameShell>
    )
  }

  const task = cfg.tasks[taskIdx]

  return (
    <MinigameShell stage={stage} mistakes={mistakes}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex w-full max-w-2xl items-center justify-between gap-2">
          <span className="rounded-full bg-white/90 px-4 py-1.5 text-base font-extrabold text-slate-600 shadow sm:text-lg">
            🖨️ {stage.minigame.instruction.split('!')[0]}!
          </span>
          <span className="rounded-full bg-rose-100 px-4 py-1.5 text-sm font-extrabold text-rose-600">
            Tugas {taskIdx + 1}/{cfg.tasks.length}
          </span>
        </div>

        <div
          className={`w-full max-w-2xl rounded-2xl rounded-tr-lg bg-white p-5 shadow-xl sm:p-7 ${
            picked === 'bad' ? 'animate-shake' : ''
          }`}
        >
          <p className="border-b-2 border-dashed border-slate-300 pb-3 text-center text-xl font-extrabold tracking-wide text-slate-800 sm:text-2xl" style={titleStyle}>
            {cfg.paper.title}
          </p>
          <p className="pt-3 text-base font-semibold text-slate-600 sm:leading-relaxed" style={bodyStyle}>
            {cfg.paper.body}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-amber-100 px-5 py-2 text-center text-base font-extrabold text-amber-700 shadow sm:text-xl">
          📋 {task.label}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {cfg.tools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => choose(tool.id)}
              className="flex flex-col items-center gap-1 rounded-2xl bg-white px-6 py-3 font-extrabold text-slate-700 shadow-lg ring-2 ring-sky-200 transition hover:scale-105"
            >
              <span
                className={`text-2xl sm:text-3xl ${
                  tool.id === 'bold'
                    ? 'font-black italic'
                    : tool.id === 'align'
                      ? 'tracking-widest'
                      : ''
                }`}
              >
                {tool.icon}
              </span>
              <span className="text-xs font-bold text-slate-500 sm:text-sm">{tool.label}</span>
            </button>
          ))}
        </div>

        {picked !== null && (
          <p
            className={`animate-pop-in rounded-full px-5 py-2 text-lg font-extrabold text-white shadow ${
              picked === 'ok' ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          >
            {picked === 'ok' ? 'Alat yang tepat! Format terpasang! 🎉' : 'Alat kurang tepat, coba lagi! 💪'}
          </p>
        )}
      </div>
    </MinigameShell>
  )
}

/* ------------------------------------------------------------------ */
/* Stage 7 - Spreadsheet Grid                                          */
/* ------------------------------------------------------------------ */
function SpreadsheetGrid({ stage, onComplete }) {
  const cfg = stage.minigame
  const cellCount = cfg.cells
  const [cells, setCells] = useState(Array(cellCount).fill(null))
  const [sum, setSum] = useState(null)
  const [wrongSum, setWrongSum] = useState(false)
  const [mistakes, setMistakes] = useState(0)

  const fullCount = cells.filter((v) => v !== null).length
  const done = sum === cfg.targetTotal

  function place(value) {
    if (done) return
    const emptyIdx = cells.findIndex((v) => v === null)
    if (emptyIdx === -1) return
    const next = [...cells]
    next[emptyIdx] = value
    setCells(next)
    setSum(null)
    setWrongSum(false)
  }

  function remove(i) {
    if (done) return
    if (cells[i] === null) return
    const next = [...cells]
    next[i] = null
    setCells(next)
    setSum(null)
    setWrongSum(false)
  }

  function pressSum() {
    if (done || fullCount !== cellCount) return
    const total = cells.reduce((a, b) => a + b, 0)
    setSum(total)
    if (total === cfg.targetTotal) {
      burstConfetti()
    } else {
      setWrongSum(true)
      setMistakes((m) => m + 1)
    }
  }

  useFinishOnDone(done, onComplete, mistakes)

  return (
    <MinigameShell stage={stage} mistakes={mistakes}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-xl overflow-hidden rounded-2xl border-2 border-slate-300 bg-white shadow-lg">
          <div className="flex items-center gap-1 border-b border-slate-200 bg-teal-600 px-3 py-2">
            <span className="text-lg font-extrabold text-white">Tabungan Kiki</span>
            <span className="ml-auto flex items-center gap-1 text-base font-extrabold text-teal-100">
              <span aria-hidden="true">🎯</span> Target: {cfg.targetTotal}
            </span>
          </div>
          <div className="grid grid-cols-[3rem_1fr] gap-px bg-slate-200">
            <div className="bg-slate-100 px-2 py-2 text-center text-sm font-extrabold text-slate-500">A</div>
            <div className="flex items-center gap-1 px-2 py-2">
              {cells.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => remove(i)}
                  className={`flex h-12 flex-1 items-center justify-center rounded-lg border-2 text-xl font-black transition ${
                    v !== null ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-dashed border-slate-300 text-slate-300'
                  }`}
                >
                  {v !== null ? v : `${i + 1}`}
                </button>
              ))}
            </div>
          </div>
          <div className={`flex items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-3 py-2`}>
            <button
              type="button"
              onClick={pressSum}
              disabled={fullCount !== cellCount || done}
              className={`rounded-full px-5 py-2 text-lg font-extrabold text-white shadow transition hover:scale-105 disabled:pointer-events-none disabled:opacity-40 ${
                wrongSum ? 'animate-shake bg-red-500' : 'bg-teal-600'
              }`}
            >
              SUM (+)
            </button>
            <span className={`text-2xl font-black ${sum === null ? 'text-slate-300' : sum === cfg.targetTotal ? 'text-emerald-600' : 'text-red-500'}`}>
              = {sum === null ? '?' : sum}
            </span>
          </div>
        </div>

        {wrongSum && (
          <p className="animate-pop-in rounded-full bg-red-500 px-5 py-2 text-lg font-extrabold text-white shadow">
            Total {sum} belum {cfg.targetTotal}. Ketuk angka untuk mengembalikannya! 💪
          </p>
        )}
        {sum === cfg.targetTotal && (
          <p className="animate-pop-in rounded-full bg-emerald-500 px-5 py-2 text-lg font-extrabold text-white shadow">
            {cfg.success} 🎉
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          {cfg.chips.map((chip) => {
            const used = cells.includes(chip.value)
            return (
              <button
                key={chip.id}
                type="button"
                disabled={used || done}
                onClick={() => place(chip.value)}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 text-2xl font-black text-amber-900 shadow-lg ring-2 ring-amber-200 transition hover:scale-110 disabled:pointer-events-none disabled:opacity-30 sm:h-20 sm:w-20"
              >
                {chip.value}
              </button>
            )
          })}
        </div>

        <p className="rounded-full bg-white/80 px-4 py-1.5 text-center text-sm font-bold text-slate-500 shadow">
          Pilih 3 koin → ketuk sel kosong → tekan SUM. Susun lagi bila belum berjumlah {cfg.targetTotal}
        </p>
      </div>
    </MinigameShell>
  )
}

/* ------------------------------------------------------------------ */
/* Stage 8 - Image Studio                                              */
/* ------------------------------------------------------------------ */
function ImageStudio({ stage, onComplete }) {
  const cfg = stage.minigame
  const [defectIdx, setDefectIdx] = useState(0)
  const [applied, setApplied] = useState({})
  const [mistakes, setMistakes] = useState(0)
  const [picked, setPicked] = useState(null)

  const done = defectIdx >= cfg.defects.length

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => onComplete(mistakes), 600)
      return () => clearTimeout(t)
    }
    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  function choose(toolId) {
    if (picked !== null) return
    const defect = cfg.defects[defectIdx]
    if (toolId === defect.tool) {
      setPicked('ok')
      setApplied((prev) => ({ ...prev, [defect.tool]: true }))
      burstConfetti()
      setTimeout(() => {
        setPicked(null)
        setDefectIdx((i) => i + 1)
      }, 800)
    } else {
      setPicked('bad')
      setMistakes((m) => m + 1)
      setTimeout(() => setPicked(null), 700)
    }
  }

  if (done) {
    return (
      <MinigameShell stage={stage} mistakes={mistakes}>
        <FinishWide stage={stage} label="Poster Sempurna!" />
      </MinigameShell>
    )
  }

  const defect = cfg.defects[defectIdx]

  const posterClass = [
    applied.crop ? 'rounded-md ring-4 ring-sky-400' : '',
    applied.resize ? 'scale-110' : '',
  ].join(' ')

  return (
    <MinigameShell stage={stage} mistakes={mistakes}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-fuchsia-100 px-5 py-2 text-base font-extrabold text-fuchsia-700 shadow sm:text-lg">
          📋 {defect.label}
        </div>

        <div className="flex h-64 w-full max-w-md items-center justify-center rounded-3xl bg-slate-200 p-4 shadow-inner sm:h-72">
          <div
            className={`flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl p-4 text-center shadow-2xl transition-all duration-300 ${posterClass} ${
              applied.bucket ? 'bg-gradient-to-br from-amber-200 to-rose-200' : 'bg-gradient-to-br from-slate-400 to-slate-500'
            }`}
          >
            <span className="text-4xl" aria-hidden="true">🎭</span>
            <p className="text-lg font-black text-white drop-shadow sm:text-xl">{cfg.posterTitle}</p>
            <p className="text-xs font-bold text-white/80">SABTU · HALAMAN SEKOLAH</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {cfg.tools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => choose(tool.id)}
              className={`flex flex-col items-center gap-1 rounded-2xl bg-white px-6 py-3 font-extrabold text-slate-700 shadow-lg ring-2 transition hover:scale-105 ${
                applied[tool.id] ? 'opacity-40' : 'ring-sky-200'
              }`}
            >
              <span className="text-3xl" aria-hidden="true">{tool.icon}</span>
              <span className="text-xs font-bold text-slate-500 sm:text-sm">{tool.label}</span>
            </button>
          ))}
        </div>

        {picked !== null && (
          <p
            className={`animate-pop-in rounded-full px-5 py-2 text-lg font-extrabold text-white shadow ${
              picked === 'ok' ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          >
            {picked === 'ok' ? 'Alat tepat! Poster berubah! 🎉' : 'Alat kurang tepat, coba lagi! 💪'}
          </p>
        )}
      </div>
    </MinigameShell>
  )
}

/* ------------------------------------------------------------------ */
/* Stage 9 - File Sorting                                              */
/* ------------------------------------------------------------------ */
function FileSorting({ stage, onComplete }) {
  const cfg = stage.minigame
  const [placed, setPlaced] = useState([])
  const [mistakes, setMistakes] = useState(0)
  const tray = useMemo(() => shuffleArray(cfg.items.filter((i) => !placed.includes(i.id))), [cfg, placed])

  const done = placed.length === cfg.items.length

  useFinishOnDone(done, onComplete, mistakes)

  function dropChip(item, x, y) {
    if (done) return
    for (const vault of cfg.vaults) {
      const rect = zoneRect(`cq-vault-${vault.id}`)
      if (rect && pointInRect(rect, x, y)) {
        if (vault.accept.includes(item.kind)) {
          setPlaced((prev) => [...prev, item.id])
        } else {
          setMistakes((m) => m + 1)
        }
        return
      }
    }
  }

  const inVault = (vaultId) =>
    cfg.items.filter((i) => placed.includes(i.id) && i.kind === vaultId)

  return (
    <MinigameShell stage={stage} mistakes={mistakes}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-3 rounded-2xl bg-slate-200 p-3 shadow-inner">
          {tray.map((item) => (
            <button
              key={item.id}
              type="button"
              onPointerDown={(e) => startGhostDrag(e, (x, y) => dropChip(item, x, y))}
              className="animate-pop-in flex cursor-grab touch-none select-none items-center gap-2 rounded-xl bg-white px-4 py-3 text-base font-extrabold text-slate-700 shadow-lg ring-2 ring-slate-300 transition hover:scale-105"
            >
              <span aria-hidden="true">📄</span>
              {item.label}
            </button>
          ))}
          {tray.length === 0 && (
            <span className="animate-pulse text-xl font-extrabold text-emerald-600">
              Semua berkas tersortir! 🎉
            </span>
          )}
        </div>

        <div className="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          {cfg.vaults.map((vault) => (
            <div
              key={vault.id}
              id={`cq-vault-${vault.id}`}
              className={`flex min-h-36 flex-col items-center gap-2 rounded-2xl border-2 p-3 shadow transition ${
                inVault(vault.id).length > 0 ? 'border-emerald-400 bg-emerald-50' : 'border-dashed border-slate-300 bg-white/80'
              }`}
            >
              <span className="text-3xl" aria-hidden="true">{vault.emoji}</span>
              <span className="text-sm font-extrabold text-slate-700">{vault.label}</span>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {inVault(vault.id).map((item) => (
                  <span key={item.id} className="animate-pop-in rounded-full bg-indigo-500 px-3 py-1 text-xs font-extrabold text-white shadow">
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MinigameShell>
  )
}

/* ------------------------------------------------------------------ */
/* Stage 10 - Conversion Portal                                        */
/* ------------------------------------------------------------------ */
function ConversionPortal({ stage, onComplete }) {
  const cfg = stage.minigame
  const [roundIdx, setRoundIdx] = useState(0)
  const [state, setState] = useState('idle') // idle | feeding | ready | ok | bad
  const [mistakes, setMistakes] = useState(0)

  const round = cfg.rounds[roundIdx]
  const done = roundIdx >= cfg.rounds.length

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => onComplete(mistakes), 600)
      return () => clearTimeout(t)
    }
    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  function feed() {
    if (state === 'feeding') return
    setState('feeding')
    setTimeout(() => setState('ready'), 900)
  }

  function choose(optionId) {
    if (state !== 'ready') return
    if (optionId === round.answer) {
      setState('ok')
      burstConfetti()
      setTimeout(() => {
        setState('idle')
        setRoundIdx((i) => i + 1)
      }, 1100)
    } else {
      setState('bad')
      setMistakes((m) => m + 1)
      setTimeout(() => setState('ready'), 900)
    }
  }

  if (done) {
    return (
      <MinigameShell stage={stage} mistakes={mistakes}>
        <FinishWide stage={stage} label="Dunia Digital Pulih! Semua Berkas Terkonversi!" />
      </MinigameShell>
    )
  }

  const portalGlow = state === 'feeding' || state === 'ready' || state === 'ok'

  return (
    <MinigameShell stage={stage} mistakes={mistakes}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/90 px-4 py-1.5 text-lg font-extrabold text-slate-600 shadow">
            Putaran {roundIdx + 1}/{cfg.rounds.length}
          </span>
        </div>

        <div className="flex w-full max-w-2xl items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-1 rounded-2xl bg-white p-4 shadow-lg">
            <span className="text-4xl" aria-hidden="true">{round.fromEmoji}</span>
            <span className="text-sm font-extrabold text-slate-700">{round.from}</span>
          </div>
          <span className="text-3xl" aria-hidden="true">➡️</span>

          <button
            type="button"
            onClick={feed}
            disabled={state === 'feeding' || state === 'ready' || state === 'ok'}
            className={`relative flex flex-col items-center gap-1 rounded-2xl px-6 py-4 font-extrabold text-white shadow-lg transition hover:scale-105 disabled:pointer-events-none ${
              portalGlow ? 'animate-glow-port bg-gradient-to-br from-orange-500 to-red-600' : 'animate-pulse bg-gradient-to-br from-orange-600 to-red-700'
            }`}
          >
            <span className="text-3xl" aria-hidden="true">🌀</span>
            <span className="text-sm">{cfg.portalName}</span>
            {state === 'feeding' && (
              <span className="animate-pulse text-xs">Mengonversi…</span>
            )}
          </button>

          <span className="text-3xl" aria-hidden="true">➡️</span>

          <div className="flex w-28 flex-col items-center gap-1 rounded-2xl bg-slate-200 p-3 shadow-inner sm:w-32">
            {state === 'ok' ? (
              <>
                <span className="text-3xl" aria-hidden="true">✅</span>
                <span className="text-center text-xs font-extrabold text-emerald-700">
                  {round.outLabel}
                </span>
              </>
            ) : (
              <>
                <span className="text-3xl text-slate-400" aria-hidden="true">📤</span>
                <span className="text-center text-xs font-bold text-slate-400">Output…</span>
              </>
            )}
          </div>
        </div>

        {state === 'ready' || state === 'bad' ? (
          <div className="flex flex-col items-center gap-3">
            <p className="rounded-full bg-white/90 px-5 py-2 text-base font-extrabold text-slate-600 shadow">
              Pilih format output yang benar untuk {round.from}!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {round.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => choose(option.id)}
                  className={`flex flex-col items-center gap-1 rounded-2xl bg-white px-6 py-3 font-extrabold text-slate-700 shadow-lg ring-2 transition hover:scale-105 ${
                    state === 'bad' && option.id === round.answer ? 'ring-emerald-400' : 'ring-sky-200'
                  }`}
                >
                  <span className="text-3xl" aria-hidden="true">{option.emoji}</span>
                  <span className="text-sm font-extrabold">{option.label}</span>
                </button>
              ))}
            </div>
            {state === 'bad' && (
              <p className="animate-pop-in rounded-full bg-red-500 px-5 py-2 text-lg font-extrabold text-white shadow">
                Format salah! Coba lagi! 💪
              </p>
            )}
          </div>
        ) : (
          <p className="animate-pulse rounded-full bg-amber-100 px-5 py-2 text-base font-extrabold text-amber-700 shadow">
            {state === 'feeding'
              ? 'Portal menggiling berkas… 🔄'
              : `Ketuk portal untuk memasukkan ${round.from}`}
          </p>
        )}
      </div>
    </MinigameShell>
  )
}

/* ------------------------------------------------------------------ */
/* Shared finish panel                                                 */
/* ------------------------------------------------------------------ */
function FinishWide({ stage, label }) {
  return (
    <div className="flex flex-col items-center gap-4 py-10">
      <div className="flex gap-3 text-5xl sm:text-6xl">
        <span className="animate-bounce" aria-hidden="true">🎉</span>
        <span className="animate-bounce" style={{ animationDelay: '0.15s' }} aria-hidden="true">✨</span>
        <span className="animate-bounce" style={{ animationDelay: '0.3s' }} aria-hidden="true">🚀</span>
      </div>
      <p className="text-center text-2xl font-extrabold text-slate-700 sm:text-3xl">{label}</p>
      <p className="text-center text-lg font-bold text-slate-500">
        Misi {stage.id} dari 10 berhasil! Misi berikutnya sedang menunggu… 💫
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Quiz phase                                                          */
/* ------------------------------------------------------------------ */
function QuizPhase({ stage, onFinish, onExit }) {
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [answer, setAnswer] = useState(null) // { picked: bool|number, correct: bool }
  const [fillValue, setFillValue] = useState('')

  const questions = stage.questions
  const question = questions[index]
  const last = index === questions.length - 1

  function gradeFill() {
    if (!fillValue.trim()) return
    const ok = question.acceptable.some((a) => normalizeAnswer(a) === normalizeAnswer(fillValue))
    setAnswer({ picked: fillValue, correct: ok })
    if (ok) setCorrectCount((c) => c + 1)
  }

  function choose(optionIndex) {
    if (answer) return
    const ok = optionIndex === question.correctIndex
    setAnswer({ picked: optionIndex, correct: ok })
    if (ok) {
      burstConfetti()
      setCorrectCount((c) => c + 1)
    }
  }

  function next() {
    if (last) {
      onFinish(correctCount)
    } else {
      setAnswer(null)
      setFillValue('')
      setIndex((i) => i + 1)
    }
  }

  const correctText =
    question.type === 'fill'
      ? question.acceptable[0]
      : question.options[question.correctIndex]

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-sky-100 via-cyan-50 to-indigo-100">
      <div className="z-10 flex w-full shrink-0 items-center justify-between gap-2 px-4 pt-3 sm:px-6 sm:pt-4">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-slate-600 shadow-lg transition hover:scale-105 sm:px-6 sm:py-3"
        >
          <span aria-hidden="true" className="text-xl sm:text-3xl">←</span>
          <span className="hidden sm:inline">Peta</span>
        </button>
        <span className="text-[clamp(1.25rem,4vw,2rem)] font-extrabold text-slate-700">
          📋 Knowledge Check
        </span>
        <span className="rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-slate-600 shadow-lg sm:text-xl">
          ✓ {correctCount}
        </span>
      </div>

      <div className="z-10 flex w-full shrink-0 flex-col items-center gap-1.5 px-4 pt-3 sm:px-6">
        <div className="flex w-full max-w-3xl items-center justify-between text-sm font-bold text-slate-600">
          <span>
            Soal {index + 1} dari {questions.length} · {stage.title}
          </span>
          <span>
            {questions.filter((_, i) => i < index).length}/{questions.length} selesai
          </span>
        </div>
        <div className="h-3 w-full max-w-3xl overflow-hidden rounded-full bg-white/70 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${(index / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <main className="flex min-h-0 flex-1 flex-col items-center gap-3 px-4 pb-4 sm:px-6 sm:pb-5">
        <div className="flex min-h-0 w-full max-w-3xl flex-1 justify-center overflow-y-auto">
          <div
            key={question.id}
            className="animate-slide-in my-auto flex w-full flex-col gap-4 rounded-3xl bg-white/95 p-5 shadow-lg sm:p-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-extrabold tracking-wide uppercase sm:text-sm ${stage.color.chip} text-white`}>
                {question.type === 'mcq'
                  ? 'Pilihan Ganda'
                  : question.type === 'true-false'
                    ? 'Benar / Salah'
                    : 'Isian'}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-500 sm:text-sm">
                {stage.icon} {stage.subtitle}
              </span>
            </div>

            <p className="text-xl font-extrabold whitespace-pre-line text-slate-700 sm:text-2xl">
              {question.prompt}
            </p>

            {question.type === 'fill' ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={fillValue}
                  onChange={(e) => setFillValue(e.target.value)}
                  placeholder="Ketik jawabanmu…"
                  autoComplete="off"
                  className="w-full rounded-2xl border-2 border-sky-200 bg-sky-50 px-4 py-3 text-lg font-bold text-slate-700 outline-none placeholder:font-semibold placeholder:text-slate-400 focus:border-sky-500 sm:text-xl"
                />
                <button
                  type="button"
                  onClick={gradeFill}
                  disabled={!fillValue.trim() || !!answer}
                  className="w-full rounded-full bg-sky-600 px-6 py-3 text-lg font-extrabold text-white shadow transition hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
                >
                  Periksa Jawaban
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 sm:gap-3">
                {question.options.map((option, optionIndex) => {
                  const selected = answer && answer.picked === optionIndex
                  const isCorrectOption = optionIndex === question.correctIndex
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => choose(optionIndex)}
                      disabled={!!answer}
                      className={`relative flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-lg font-bold transition ${
                        answer
                          ? isCorrectOption
                            ? 'bg-emerald-500 text-white shadow-md'
                            : selected
                              ? 'animate-shake bg-red-400 text-white shadow-md'
                              : 'bg-sky-50 text-slate-400'
                          : 'bg-sky-50 text-slate-700 hover:bg-sky-100'
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                          answer && (isCorrectOption || selected)
                            ? 'bg-white text-slate-700'
                            : 'bg-sky-200 text-sky-700'
                        }`}
                      >
                        {answer && isCorrectOption ? '✓' : selected ? '✗' : String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span className="min-w-0">{option}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {answer && (
              <div
                className={`animate-pop-in flex flex-col gap-1 rounded-2xl p-3 text-center ${
                  answer.correct ? 'bg-emerald-100' : 'bg-red-100'
                }`}
              >
                <span className={`text-xl font-extrabold ${answer.correct ? 'text-emerald-700' : 'text-red-600'}`}>
                  {answer.correct ? 'Benar! 🎉' : 'Belum tepat 💪'}
                </span>
                {!answer.correct && (
                  <span className="text-base font-bold text-slate-600">
                    Jawaban yang benar: <b>{correctText}</b>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full max-w-3xl shrink-0 items-center justify-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="rounded-full bg-white/95 px-5 py-3 text-lg font-extrabold text-slate-500 shadow-lg transition hover:scale-105"
          >
            Keluar
          </button>
          {answer && (
            <button
              type="button"
              onClick={next}
              className="rounded-full bg-emerald-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105"
            >
              {last ? 'Lihat Hasil ✨' : 'Lanjut →'}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Reward screen                                                       */
/* ------------------------------------------------------------------ */
function RewardScreen({ stage, result, onMap, onReplay }) {
  const fired = useRef(false)
  useEffect(() => {
    if (!fired.current) {
      fired.current = true
      celebrate()
    }
  }, [])

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950">
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 overflow-y-auto px-4 py-6">
        <div className="animate-pop-in flex w-full max-w-xl flex-col items-center gap-5 rounded-3xl bg-white/95 p-6 text-center shadow-2xl sm:p-10">
          <div className="flex flex-col items-center gap-2">
            <span className="animate-bounce text-6xl sm:text-7xl" aria-hidden="true">{stage.icon}</span>
            <p className="text-sm font-extrabold tracking-widest text-slate-400 uppercase">
              Misi {stage.id} dari 10 Selesai
            </p>
            <h1 className="text-[clamp(1.5rem,5vw,2.5rem)] font-extrabold leading-none text-slate-700">
              {stage.title} — Berhasil!
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className={`text-5xl sm:text-6xl ${
                  i <= result.stars ? 'animate-bounce drop-shadow-[0_0_14px_rgba(251,191,36,0.8)]' : 'opacity-20 grayscale'
                }`}
                style={{ animationDelay: `${i * 0.25}s` }}
                aria-hidden="true"
              >
                ⭐
              </span>
            ))}
          </div>

          <div
            className={`flex w-full flex-col items-center gap-1 rounded-2xl bg-gradient-to-r ${stage.color.grad} p-4 text-white shadow-lg`}
          >
            <span className="text-4xl" aria-hidden="true">🏅</span>
            <p className="text-xl font-extrabold sm:text-2xl">{stage.badge}</p>
            <p className="text-xs font-bold text-white/80 sm:text-sm">
              Diberikan kepada Pahlawan Digital · {stage.kisi_kisi_ref}
            </p>
          </div>

          <div className="grid w-full grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-slate-100 p-3">
              <p className="text-2xl font-black text-slate-700">{result.quizCorrect}/{result.quizTotal}</p>
              <p className="text-xs font-extrabold text-slate-500">Soal Benar</p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3">
              <p className="text-2xl font-black text-slate-700">{result.mistakes}</p>
              <p className="text-xs font-extrabold text-slate-500">Kesalahan Mini Game</p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3">
              <p className="text-2xl font-black text-amber-500">{result.stars}/3</p>
              <p className="text-xs font-extrabold text-slate-500">Bintang</p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onMap}
              className="flex-1 rounded-full bg-emerald-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl"
            >
              🗺️ Kembali ke Peta
            </button>
            <button
              type="button"
              onClick={onReplay}
              className="flex-1 rounded-full bg-sky-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl"
            >
              🔁 Main Lagi
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Stage briefing                                                      */
/* ------------------------------------------------------------------ */
function Briefing({ stage, onStart, onExit }) {
  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-sky-100 via-cyan-50 to-indigo-100">
      <div className="z-10 flex w-full shrink-0 items-center justify-between px-4 pt-3 sm:px-6 sm:pt-4">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-slate-600 shadow-lg transition hover:scale-105 sm:px-6 sm:py-3"
        >
          <span aria-hidden="true" className="text-xl sm:text-3xl">←</span>
          <span className="hidden sm:inline">Peta</span>
        </button>
        <span className="rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-slate-600 shadow-lg sm:text-xl">
          Misi {stage.id} / 10
        </span>
      </div>

      <main className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6">
        <div className="animate-pop-in flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-10">
          <span className="text-6xl" aria-hidden="true">{stage.icon}</span>
          <h1 className="text-[clamp(1.75rem,6vw,3rem)] font-extrabold leading-none text-slate-700">
            {stage.title}
          </h1>
          <span className={`rounded-full bg-gradient-to-r ${stage.color.grad} px-4 py-1.5 text-sm font-extrabold text-white shadow`}>
            {stage.kisi_kisi_ref}
          </span>

          <div className="w-full rounded-2xl bg-slate-50 p-4 text-left">
            <p className="mb-1 text-xs font-extrabold tracking-wide text-slate-400 uppercase">
              🎬 Cerita Misi
            </p>
            <p className="text-base font-bold text-slate-600 sm:text-lg">{stage.briefing}</p>
          </div>

          <div className="w-full rounded-2xl bg-sky-50 p-4 text-left">
            <p className="mb-1 text-xs font-extrabold tracking-wide text-sky-500 uppercase">
              🎮 Cara Bermain Mini Game
            </p>
            <p className="text-base font-bold text-slate-600 sm:text-lg">{stage.minigame.instruction}</p>
          </div>

          <div className="w-full rounded-2xl bg-amber-50 p-4 text-left">
            <p className="mb-1 text-xs font-extrabold tracking-wide text-amber-500 uppercase">
              📋 Knowledge Check
            </p>
            <p className="text-base font-bold text-slate-600 sm:text-lg">
              Jawab {stage.questions.length} pertanyaan pendek tentang {stage.subtitle}. Skor
              menentukan jumlah bintang! ⭐
            </p>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="w-full rounded-full bg-emerald-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl"
          >
            🚀 Mulai Misi {stage.id}!
          </button>
        </div>
      </main>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Intro / name entry                                                  */
/* ------------------------------------------------------------------ */
function IntroScreen({ progress, onStart, onExit }) {
  const [name, setName] = useState(progress.name)
  const trimmed = name.trim()

  function submit(event) {
    event.preventDefault()
    if (trimmed) onStart(trimmed)
  }

  return (
    <div className="relative flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.55)_0%,transparent_70%)]" />
        <div className="absolute bottom-10 right-8 text-7xl animate-floaty">🛰️</div>
        <div className="absolute top-24 left-6 text-6xl animate-floaty" style={{ animationDelay: '0.8s' }}>🌐</div>
        <div className="absolute bottom-24 left-10 text-5xl animate-floaty" style={{ animationDelay: '1.4s' }}>⚡</div>
      </div>

      <div className="z-10 flex w-full shrink-0 items-center justify-between px-4 pt-4 sm:px-6">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-slate-600 shadow-lg transition hover:scale-105 sm:px-6 sm:py-3"
        >
          <span aria-hidden="true" className="text-xl sm:text-3xl">←</span>
          Games
        </button>
        <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-extrabold text-sky-200 backdrop-blur-sm">
          Kelas 5 · PTS Informatika
        </span>
      </div>

      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6">
        <form
          onSubmit={submit}
          className="animate-pop-in flex w-full max-w-2xl flex-col items-center gap-5 rounded-3xl bg-white/95 p-6 text-center shadow-2xl sm:p-10"
        >
          <img
            src="/images/robot.svg"
            alt="Kiki the Cyber-Bot"
            className="h-28 w-28 animate-kelinci-bob object-contain drop-shadow-xl sm:h-36 sm:w-36"
          />
          <h1 className="text-[clamp(2rem,7vw,3.5rem)] font-extrabold leading-none text-slate-700">
            Cyber<span className="text-sky-600">Quest</span>
          </h1>
          <p className="text-sm font-bold text-slate-500 sm:text-base">{CYBERQUEST_META.game_title}</p>

          <div className="w-full space-y-2 rounded-2xl bg-sky-50 p-4 text-left">
            {CYBERQUEST_META.story_lines.map((line) => (
              <p key={line} className="text-base font-bold text-slate-600 sm:text-lg">
                {line}
              </p>
            ))}
          </div>

          <label className="flex w-full flex-col gap-2 text-left">
            <span className="text-sm font-extrabold tracking-wide text-slate-600 uppercase">Your name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Tulis namamu di sini…"
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
            Mulai Petualangan 🚀
          </button>

          {progress.name && (
            <button
              type="button"
              onClick={() => onStart(progress.name)}
              className="text-sm font-extrabold text-sky-600 underline"
            >
              Lanjut sebagai {progress.name}?
            </button>
          )}
        </form>
      </main>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Level selection map                                                 */
/* ------------------------------------------------------------------ */
function MapScreen({ progress, onSelect, onExit }) {
  const completedStages = CYBERQUEST_STAGES.filter((s) => progress.stages[s.id]?.stars > 0)
  const totalStars = Object.values(progress.stages).reduce((sum, rec) => sum + (rec.stars || 0), 0)

  return (
    <div className="relative flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.35)_0%,transparent_70%)]" />
      </div>

      <div className="z-10 flex w-full shrink-0 items-center justify-between px-4 pt-4 sm:px-6">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-slate-600 shadow-lg transition hover:scale-105 sm:px-6 sm:py-3"
        >
          <span aria-hidden="true" className="text-xl sm:text-3xl">←</span>
          Games
        </button>
        <div className="text-center">
          <p className="text-[10px] font-extrabold tracking-widest text-sky-300 uppercase">
            {CYBERQUEST_META.game_title}
          </p>
          <p className="text-sm font-bold text-white/60 sm:text-base">
            Petualang Digital: <span className="text-amber-300">{progress.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white/10 px-4 py-2 text-sm font-extrabold text-white backdrop-blur-sm sm:text-base">
          <span aria-hidden="true">⭐</span>
          <span className="text-amber-300">{totalStars}/30</span>
        </div>
      </div>

      <main className="z-10 flex min-h-0 flex-1 flex-col items-center gap-4 overflow-y-auto px-4 py-4 sm:px-6">
        <div className="flex items-center justify-center gap-3">
          <img src="/images/robot.svg" alt="" className="h-14 w-14 animate-kelinci-bob object-contain drop-shadow-lg sm:h-20 sm:w-20" />
          <div>
            <h1 className="text-[clamp(1.75rem,6vw,3rem)] font-extrabold leading-none text-white">
              Peta <span className="text-sky-400">Misi</span>
            </h1>
            <p className="text-sm font-bold text-sky-200">
              Selesaikan 10 misi untuk memulihkan dunia digital! 🗺️
            </p>
          </div>
        </div>

        <div className="grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
          {CYBERQUEST_STAGES.map((stage, index) => {
            const record = progress.stages[stage.id]
            const unlocked = index === 0 || progress.stages[CYBERQUEST_STAGES[index - 1].id]?.stars > 0
            const prevUnlocked = unlocked
            return (
              <button
                key={stage.id}
                type="button"
                disabled={!unlocked}
                onClick={() => prevUnlocked && onSelect(stage.id)}
                className={`relative flex flex-col items-center gap-2 rounded-3xl p-4 shadow-xl transition ${
                  unlocked
                    ? 'animate-pop-in bg-white/95 hover:scale-105 hover:shadow-2xl'
                    : 'bg-white/10 opacity-60'
                }`}
              >
                {index + 1 < CYBERQUEST_STAGES.length && (
                  <span
                    className={`absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-sm font-black text-white shadow sm:flex ${
                      unlocked ? stage.color.chip : 'bg-slate-600'
                    }`}
                    aria-hidden="true"
                  >
                    ›
                  </span>
                )}
                <span
                  className={`text-4xl sm:text-5xl ${
                    !unlocked ? 'brightness-50 grayscale' : ''
                  }`}
                  aria-hidden="true"
                >
                  {unlocked ? stage.icon : '🔒'}
                </span>
                <span className="text-center text-sm font-extrabold text-slate-700">
                  {stage.id}. {unlocked ? stage.title : 'Terkunci'}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-0.5 text-[10px] font-extrabold text-slate-500 uppercase">
                  {stage.subtitle}
                </span>
                {record && (
                  <StarsRow count={record.stars} size="text-lg" />
                )}
                {unlocked && !record && (
                  <span className={`rounded-full bg-gradient-to-r ${stage.color.grad} px-4 py-1 text-xs font-extrabold text-white animate-pulse`}>
                    MAIN!
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex w-full max-w-4xl items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-white backdrop-blur-sm">
          <span className="text-2xl" aria-hidden="true">🏅</span>
          <p className="text-sm font-extrabold sm:text-base">
            Lencana Digital Master: {completedStages.length} dari {CYBERQUEST_STAGES.length} diperoleh
          </p>
        </div>
      </main>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Main game component                                                 */
/* ------------------------------------------------------------------ */
function CyberQuestGame({ onExit }) {
  const [progress, setProgress] = useState(loadProgress)
  const [screen, setScreen] = useState(() => (progress.name ? 'map' : 'intro'))
  const [stageId, setStageId] = useState(null)
  const [stagePhase, setStagePhase] = useState('briefing')
  const [result, setResult] = useState(null)
  const [startMistakes, setStartMistakes] = useState(0)

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
    } catch {
      /* ignore */
    }
  }, [progress])

  useEffect(() => {
    const handler = () => setStagePhase('briefing')
    window.addEventListener('cyberquest-back', handler)
    return () => window.removeEventListener('cyberquest-back', handler)
  }, [])

  const stage = CYBERQUEST_STAGES.find((s) => s.id === stageId)

  function startAdventure(name) {
    setProgress((prev) => ({ ...prev, name }))
    setScreen('map')
  }

  function selectStage(id) {
    setStageId(id)
    setStagePhase('briefing')
    setResult(null)
  }

  function onMinigameDone(mistakes) {
    setStartMistakes(mistakes)
    setStagePhase('quiz')
  }

  function onQuizFinish(quizCorrect) {
    const nextStars = starsFor(quizCorrect, stage.questions.length, startMistakes)
    const prevRecord = progress.stages[stage.id]
    const mergedRecord = {
      stars: Math.max(prevRecord?.stars || 0, nextStars),
      mistakes: Math.min(prevRecord?.mistakes ?? Infinity, startMistakes),
      quizCorrect,
      quizTotal: stage.questions.length,
    }
    setProgress((prev) => ({
      ...prev,
      stages: { ...prev.stages, [stage.id]: mergedRecord },
    }))
    setResult({ mistakes: startMistakes, quizCorrect, quizTotal: stage.questions.length, stars: nextStars })
    setStagePhase('reward')
  }

  function replay() {
    setResult(null)
    setStagePhase('briefing')
  }

  if (screen === 'intro') {
    return <IntroScreen progress={progress} onStart={startAdventure} onExit={onExit} />
  }

  if (screen === 'map') {
    return <MapScreen progress={progress} onSelect={selectStage} onExit={onExit} />
  }

  if (stage && stagePhase === 'briefing') {
    return <Briefing stage={stage} onStart={() => setStagePhase('minigame')} onExit={() => setScreen('map')} />
  }

  if (stage && stagePhase === 'minigame') {
    const Minigame = {
      node_connector: NodeConnector,
      sequence: SequenceBuilder,
      decomposition: DecompositionStudio,
      pattern: PatternFiller,
      abstraction: AbstractionFilter,
      formatting: FormattingStudio,
      spreadsheet: SpreadsheetGrid,
      image_studio: ImageStudio,
      file_sorting: FileSorting,
      conversion: ConversionPortal,
    }[stage.minigame.type]
    return <Minigame key={stage.id} stage={stage} onComplete={onMinigameDone} />
  }

  if (stage && stagePhase === 'quiz') {
    return (
      <QuizPhase
        stage={stage}
        onFinish={onQuizFinish}
        onExit={() => setScreen('map')}
      />
    )
  }

  if (stage && stagePhase === 'reward' && result) {
    return (
      <RewardScreen
        stage={stage}
        result={result}
        onMap={() => setScreen('map')}
        onReplay={replay}
      />
    )
  }

  return <MapScreen progress={progress} onSelect={selectStage} onExit={onExit} />
}

export default CyberQuestGame