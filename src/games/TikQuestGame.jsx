import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { TIK_QUEST_META, TIK_LEVELS } from './tikQuestData.js'

const PROGRESS_KEY = 'tikquest-progress-v1'

function shuffleArray(list) {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return null
}

function saveProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    /* ignore */
  }
}

function firstUncompletedIndex(savedBadges) {
  const index = TIK_LEVELS.findIndex((level) => !savedBadges.includes(level.id))
  return index === -1 ? 0 : index
}

function pointsForLevel(mistakes) {
  return Math.max(40, 100 - mistakes * 15)
}

function starsForLevel(mistakes) {
  if (mistakes <= 1) return 3
  if (mistakes <= 3) return 2
  return 1
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
  ghost.style.zIndex = '60'
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
  confetti({ particleCount: 70, spread: 75, origin: { y: 0.6 } })
}

function celebrate() {
  const end = Date.now() + 3500
  const frame = () => {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } })
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

let audioCtx = null

function getAudioCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (AC) audioCtx = new AC()
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function tone(freq, start, dur, type = 'sine', vol = 0.18) {
  const ac = getAudioCtx()
  if (!ac) return
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(vol, start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.start(start)
  osc.stop(start + dur + 0.06)
}

function playChime(kind) {
  const ac = getAudioCtx()
  if (!ac) return
  const t = ac.currentTime
  if (kind === 'correct') {
    tone(523.25, t, 0.12)
    tone(659.25, t + 0.1, 0.12)
    tone(783.99, t + 0.2, 0.22)
  } else if (kind === 'wrong') {
    tone(220, t, 0.18, 'sawtooth', 0.1)
    tone(174.61, t + 0.15, 0.3, 'sawtooth', 0.1)
  } else if (kind === 'click') {
    tone(880, t, 0.06, 'triangle', 0.07)
  } else if (kind === 'win') {
    ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, t + i * 0.12, 0.3))
  }
}

function useFinishOnDone(done, onComplete, mistakes, delay = 1100) {
  const fired = useRef(false)
  useEffect(() => {
    if (done && !fired.current) {
      fired.current = true
      const timer = setTimeout(() => onComplete(mistakes), delay)
      return () => clearTimeout(timer)
    }
  }, [done, onComplete, mistakes, delay])
}

function useRisingEdge(value, fn) {
  const ref = useRef(false)
  useEffect(() => {
    if (value && !ref.current) {
      ref.current = true
      fn()
    }
  }, [value, fn])
}

function useTeachingHint() {
  const [tip, setTip] = useState(null)
  const hideRef = useRef(null)
  const teach = useCallback((message) => {
    setTip(message)
    clearTimeout(hideRef.current)
    hideRef.current = setTimeout(() => setTip(null), 5500)
  }, [])
  useEffect(() => () => clearTimeout(hideRef.current), [])
  return { tip, teach }
}

function LearningTip({ tip }) {
  if (!tip) return null
  return (
    <div className="animate-pop-in flex w-full max-w-xl items-start gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-left shadow-lg ring-2 ring-amber-300">
      <span className="text-xl" aria-hidden="true">🔍</span>
      <div>
        <p className="text-xs font-extrabold uppercase tracking-widest text-amber-600">Bity tahu jawabannya!</p>
        <p className="text-sm font-bold leading-snug text-slate-700">{tip}</p>
      </div>
    </div>
  )
}

function StarsRow({ count, size = 'text-3xl' }) {
  return (
    <div className={`flex items-center justify-center gap-1 ${size}`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= count ? '' : 'opacity-25 grayscale'} aria-hidden="true">
          ⭐
        </span>
      ))}
    </div>
  )
}

function SuccessBanner({ text }) {
  return (
    <div className="animate-pop-in flex flex-col items-center gap-2 py-8 text-center">
      <div className="flex gap-2 text-4xl sm:text-5xl">
        <span className="animate-bounce" aria-hidden="true">🎉</span>
        <span className="animate-bounce" style={{ animationDelay: '0.15s' }} aria-hidden="true">✨</span>
      </div>
      <p className="text-xl font-extrabold text-emerald-600 sm:text-2xl">{text}</p>
      <p className="text-base font-bold text-slate-500">Lencana hampir diraih… 💫</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Level 1 - Morning routine sequence                                  */
/* ------------------------------------------------------------------ */
function LevelSequence({ cfg, onComplete, playSound }) {
  const seq = cfg.sequence
  const [placed, setPlaced] = useState(Array(seq.correct.length).fill(null))
  const [mistakes, setMistakes] = useState(0)
  const { tip, teach } = useTeachingHint()
  const tray = useMemo(
    () => shuffleArray(seq.items.filter((item) => !placed.includes(item.id))),
    [seq, placed],
  )
  const done = tray.length === 0 && placed.every((id) => id !== null)

  useFinishOnDone(done, onComplete, mistakes)

  function dropChip(item, x, y) {
    if (done) return
    for (let i = 0; i < seq.correct.length; i += 1) {
      const rect = zoneRect(`tq-seq-slot-${i}`)
      if (!rect || !pointInRect(rect, x, y)) continue
      if (seq.correct[i] === item.id) {
        setPlaced((prev) => {
          const next = [...prev]
          next[i] = item.id
          return next
        })
        playSound('correct')
        burstConfetti()
      } else {
        setMistakes((m) => m + 1)
        playSound('wrong')
        const correctItem = seq.items.find((it) => it.id === seq.correct[i])
        teach(
          `Langkah ke-${i + 1} seharusnya: "${correctItem.icon} ${correctItem.label}". ${seq.spots[i]?.reason || ''}`,
        )
      }
      return
    }
  }

  if (done) {
    return <SuccessBanner text={seq.success} />
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <LearningTip tip={tip} />
      <div className="flex w-full max-w-xl flex-col gap-2.5">
        {seq.items.map((item, i) => {
          const itemId = placed[i]
          const filled = seq.items.find((it) => it.id === itemId)
          return (
            <div
              key={item.id}
              id={`tq-seq-slot-${i}`}
              className={`flex min-h-16 items-center gap-3 rounded-2xl border-2 border-dashed px-4 py-2 transition sm:min-h-20 ${
                filled ? 'border-emerald-400 bg-emerald-50' : 'border-sky-300 bg-white/85'
              }`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-600 text-lg font-extrabold text-white">
                {i + 1}
              </span>
              {filled ? (
                <span className="animate-pop-in text-base font-extrabold text-slate-700 sm:text-lg">
                  {filled.icon} {filled.label}
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
            {item.icon} {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Level 2 - Room cleanup decomposition                                */
/* ------------------------------------------------------------------ */
function LevelDecompose({ cfg, onComplete, playSound }) {
  const dec = cfg.decompose
  const allItems = useMemo(() => [...dec.correct, ...dec.distractors], [dec])
  const [placed, setPlaced] = useState([])
  const [mistakes, setMistakes] = useState(0)
  const { tip, teach } = useTeachingHint()
  const tray = useMemo(
    () => shuffleArray(allItems.filter((item) => !placed.includes(item.id))),
    [allItems, placed],
  )
  const done = tray.length === 0

  useFinishOnDone(done, onComplete, mistakes)

  function dropChip(item, x, y) {
    if (done) return
    const isCorrect = dec.correct.some((c) => c.id === item.id)
    const goalRect = zoneRect('tq-dec-goal')
    const trashRect = zoneRect('tq-dec-trash')
    if (goalRect && pointInRect(goalRect, x, y)) {
      if (isCorrect) {
        setPlaced((prev) => [...prev, item.id])
        playSound('correct')
        burstConfetti()
      } else {
        setMistakes((m) => m + 1)
        playSound('wrong')
        teach(dec.teach)
      }
      return
    }
    if (trashRect && pointInRect(trashRect, x, y)) {
      if (!isCorrect) {
        setPlaced((prev) => [...prev, item.id])
        playSound('correct')
        burstConfetti()
      } else {
        setMistakes((m) => m + 1)
        playSound('wrong')
        teach(dec.teach)
      }
    }
  }

  if (done) {
    return <SuccessBanner text={dec.success} />
  }

  const inGoal = (id) => placed.includes(id)

  return (
    <div className="flex flex-col items-center gap-4">
      <LearningTip tip={tip} />
      <div
        id="tq-dec-goal"
        className={`flex w-full max-w-2xl flex-col items-center gap-3 rounded-3xl p-4 shadow transition sm:p-5 ${
          placed.length > 0 ? 'border-2 border-emerald-400 bg-emerald-50' : 'border-2 border-dashed border-slate-300 bg-white/85'
        }`}
      >
        <p className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2 text-center text-lg font-extrabold text-white shadow sm:text-xl">
          🏠 {dec.goalLabel}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {dec.correct.map((item) => (
            <span
              key={item.id}
              className={`rounded-full px-3 py-1.5 text-sm font-extrabold shadow transition ${
                inGoal(item.id) ? 'animate-pop-in bg-emerald-500 text-white' : 'border-2 border-dashed border-slate-300 bg-white/70 text-slate-300'
              }`}
            >
              {item.icon} {item.label}
            </span>
          ))}
        </div>
      </div>

      <div
        id="tq-dec-trash"
        className={`flex min-h-14 w-full max-w-2xl flex-wrap items-center justify-center gap-2 rounded-2xl border-2 p-3 shadow transition ${
          tray.some((t) => dec.distractors.some((d) => d.id === t.id)) && tray.length < allItems.length
            ? 'border-red-300 bg-red-50'
            : 'border-dashed border-slate-300 bg-white/80'
        }`}
      >
        <span className="text-2xl" aria-hidden="true">🗑️</span>
        <span className="text-sm font-extrabold text-slate-500">Bukan bagian dari rencana beres-beres</span>
        {dec.distractors.map((item) =>
          inGoal(item.id) || !placed.includes(item.id) ? null : (
            <span key={item.id} className="animate-pop-in rounded-full bg-slate-500 px-3 py-1 text-xs font-extrabold text-white shadow">
              {item.icon} {item.label}
            </span>
          ),
        )}
      </div>

      <div className="flex w-full max-w-2xl flex-wrap items-center justify-center gap-3">
        {tray.map((item) => (
          <button
            key={item.id}
            type="button"
            onPointerDown={(e) => startGhostDrag(e, (x, y) => dropChip(item, x, y))}
            className="animate-pop-in cursor-grab touch-none select-none rounded-2xl bg-white px-5 py-3 text-base font-extrabold text-slate-700 shadow-lg ring-2 ring-sky-200 transition hover:scale-105 sm:text-lg"
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Level 3 - Pattern breaker                                           */
/* ------------------------------------------------------------------ */
function LevelPatterns({ cfg, onComplete, playSound }) {
  const solves = cfg.patterns.solves
  const [idx, setIdx] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [picked, setPicked] = useState(null)
  const { tip, teach } = useTeachingHint()
  const done = idx >= solves.length

  useFinishOnDone(done, onComplete, mistakes, 600)

  if (done) {
    return <SuccessBanner text={cfg.patterns.success} />
  }

  const solve = solves[idx]

  function choose(option) {
    if (picked) return
    setPicked(option.id)
    if (option.id === solve.answer) {
      playSound('correct')
      burstConfetti()
      setTimeout(() => {
        setPicked(null)
        setIdx((i) => i + 1)
      }, 850)
    } else {
      setMistakes((m) => m + 1)
      playSound('wrong')
      teach(solve.teach)
      setTimeout(() => setPicked(null), 700)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <LearningTip tip={tip} />
      <div className="flex items-center gap-2">
        {solves.map((s, i) => (
          <span
            key={s.id}
            className={`h-3 w-3 rounded-full ${i < idx ? 'bg-emerald-500' : i === idx ? 'animate-pulse bg-amber-400' : 'bg-slate-300'}`}
          />
        ))}
      </div>

      <div className="flex w-full max-w-xl flex-wrap items-center justify-center gap-2.5">
        {solve.display.map((d, i) => {
          const isUnknown = d === '?'
          return (
            <div
              key={`${solve.id}-${i}`}
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

      <p className="rounded-full bg-white/85 px-5 py-2 text-center text-sm font-bold text-slate-500 shadow sm:text-base">
        💡 {solve.hint}
      </p>

      <div className="flex w-full max-w-xl flex-wrap items-center justify-center gap-3">
        {solve.options.map((option) => {
          const isPicked = picked === option.id
          const isGood = isPicked && option.id === solve.answer
          const isBad = isPicked && option.id !== solve.answer
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => choose(option)}
              className={`flex flex-col items-center gap-1 rounded-2xl bg-white px-5 py-3 font-extrabold text-slate-700 shadow-lg ring-4 transition hover:scale-105 sm:px-7 sm:py-4 ${
                isGood ? 'ring-emerald-400' : isBad ? 'animate-shake ring-red-400' : 'ring-sky-200'
              }`}
            >
              <span className="text-3xl sm:text-4xl" aria-hidden="true">{option.icon}</span>
              <span className="text-sm font-extrabold sm:text-base">{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Shared click-to-connect match board                                 */
/* ------------------------------------------------------------------ */
function MatchBoard({ leftList, rightList, matchedLeft, matchedRight, selected, onTap, wrongPair }) {
  function cardClass(isMatched, isSelected, isWrong) {
    if (isMatched) return 'border-emerald-400 bg-emerald-50 opacity-80'
    if (isWrong) return 'animate-shake border-red-400 bg-red-50'
    if (isSelected) return 'border-sky-500 ring-4 ring-sky-200 bg-sky-50'
    return 'border-slate-200 bg-white hover:scale-105'
  }

  return (
    <div className="grid w-full max-w-2xl grid-cols-2 items-stretch gap-3 sm:gap-5">
      <div className="flex flex-col gap-3">
        {leftList.map((item) => {
          const isMatched = matchedLeft.includes(item.id)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTap('left', item.id)}
              className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-3 text-left text-base font-extrabold text-slate-700 shadow transition sm:py-4 sm:text-lg ${cardClass(
                isMatched,
                selected?.side === 'left' && selected.id === item.id,
                wrongPair?.leftId === item.id,
              )}`}
            >
              <span className="text-2xl sm:text-3xl" aria-hidden="true">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {isMatched && <span className="text-emerald-500" aria-hidden="true">✅</span>}
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-3">
        {rightList.map((item) => {
          const isMatched = matchedRight.includes(item.id)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTap('right', item.id)}
              className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-3 text-left text-sm font-bold text-slate-600 shadow transition sm:py-4 sm:text-base ${cardClass(
                isMatched,
                selected?.side === 'right' && selected.id === item.id,
                wrongPair?.rightId === item.id,
              )}`}
            >
              <span className="text-2xl sm:text-3xl" aria-hidden="true">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {isMatched && <span className="text-emerald-500" aria-hidden="true">✅</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function useMatchPairs(pairs, playSound, onWrong) {
  const [selected, setSelected] = useState(null)
  const [matchedLeft, setMatchedLeft] = useState([])
  const [matchedRight, setMatchedRight] = useState([])
  const [wrongPair, setWrongPair] = useState(null)
  const [mistakes, setMistakes] = useState(0)
  const allMatched = matchedLeft.length === pairs.length

  function tap(side, id) {
    if (allMatched) return
    if (side === 'left' && matchedLeft.includes(id)) return
    if (side === 'right' && matchedRight.includes(id)) return
    if (!selected) {
      setSelected({ side, id })
      return
    }
    if (selected.side === side) {
      setSelected({ side, id })
      return
    }
    const leftId = side === 'left' ? id : selected.id
    const rightId = side === 'right' ? id : selected.id
    const pair = pairs.find((p) => p.left.id === leftId && p.right.id === rightId)
    setSelected(null)
    if (pair) {
      setMatchedLeft((prev) => [...prev, leftId])
      setMatchedRight((prev) => [...prev, rightId])
      playSound('correct')
      burstConfetti()
    } else {
      setMistakes((m) => m + 1)
      setWrongPair({ leftId, rightId })
      playSound('wrong')
      if (onWrong) onWrong(leftId)
      setTimeout(() => setWrongPair(null), 600)
    }
  }

  return { selected, matchedLeft, matchedRight, mistakes, setMistakes, allMatched, tap, wrongPair }
}

/* ------------------------------------------------------------------ */
/* Level 4 - Computer anatomy matching                                 */
/* ------------------------------------------------------------------ */
function LevelMachine({ cfg, onComplete, playSound }) {
  const machine = cfg.machine
  const [phase, setPhase] = useState('match')
  const { tip, teach } = useTeachingHint()
  const match = useMatchPairs(
    machine.pairs,
    playSound,
    (leftId) => {
      const pair = machine.pairs.find((p) => p.left.id === leftId)
      if (pair) teach(`Ingat! "${pair.left.label}" itu fungsinya: ${pair.right.label}. ${pair.teach || ''}`)
    },
  )
  const rightList = useMemo(() => shuffleArray(machine.pairs.map((p) => p.right)), [machine])
  const [bonusPicked, setBonusPicked] = useState(false)

  useEffect(() => {
    if (match.allMatched) {
      const timer = setTimeout(() => setPhase('bonus'), 700)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [match.allMatched])

  useFinishOnDone(phase === 'bonus' && bonusPicked === 'good', onComplete, match.mistakes, 900)

  function chooseBonus(choice) {
    if (bonusPicked) return
    if (choice === 'good') {
      setBonusPicked('good')
      playSound('correct')
      burstConfetti()
    } else {
      match.setMistakes((m) => m + 1)
      setBonusPicked('bad')
      playSound('wrong')
      teach(machine.bonus.teach)
      setTimeout(() => setBonusPicked(false), 700)
    }
  }

  if (phase === 'bonus') {
    const bonus = machine.bonus
    return (
      <div className="flex flex-col items-center gap-5">
        <LearningTip tip={tip} />
        <p className="rounded-full bg-white/90 px-5 py-2 text-center text-base font-extrabold text-slate-600 shadow sm:text-lg">
          🎯 {bonus.prompt}
        </p>
        <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-4 sm:flex-row">
          {[bonus.good, bonus.bad].map((opt) => {
            const isGood = opt.id === 'good'
            const isPickedGood = bonusPicked === 'good' && isGood
            const isPickedBad = bonusPicked === 'bad' && !isGood
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => chooseBonus(isGood ? 'good' : 'bad')}
                className={`flex w-full max-w-xs flex-col items-center gap-2 rounded-3xl border-2 p-5 font-extrabold text-slate-700 shadow-lg ring-4 transition hover:scale-105 ${
                  isPickedGood
                    ? 'border-emerald-400 bg-emerald-50 ring-emerald-300'
                    : isPickedBad
                      ? 'animate-shake border-red-400 bg-red-50 ring-red-300'
                      : 'border-slate-200 bg-white ring-sky-200'
                }`}
              >
                <span className="text-5xl" aria-hidden="true">{opt.icon}</span>
                <span className="text-center text-base sm:text-lg">{opt.label}</span>
                {isPickedGood && <span className="animate-pop-in rounded-full bg-emerald-500 px-4 py-1 text-sm text-white">Benar! {bonus.success}</span>}
                {isPickedBad && <span className="animate-pop-in rounded-full bg-red-500 px-4 py-1 text-sm text-white">Coba lagi! 💪</span>}
              </button>
            )
          })}
        </div>
        {match.allMatched && (
          <p className="animate-pop-in rounded-full bg-emerald-100 px-5 py-2 text-sm font-bold text-emerald-700 shadow">
            Semua perangkat sudah tersambung dengan fungsinya!
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <LearningTip tip={tip} />
      <p className="flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 text-center text-sm font-bold text-slate-500 shadow sm:text-base">
        👆 Ketuk perangkat, lalu ketuk fungsi pasangannya
      </p>
      <MatchBoard
        leftList={machine.pairs.map((p) => p.left)}
        rightList={rightList}
        matchedLeft={match.matchedLeft}
        matchedRight={match.matchedRight}
        selected={match.selected}
        onTap={match.tap}
        wrongPair={match.wrongPair}
      />
      {match.allMatched && (
        <p className="animate-pop-in rounded-full bg-emerald-500 px-5 py-2 text-base font-extrabold text-white shadow">
          Anatomi komputer tersambung! Sekarang bonus kecerdasan digital! 🧠
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Level 5 - Polite messenger chat                                     */
/* ------------------------------------------------------------------ */
function LevelChat({ cfg, onComplete, playSound }) {
  const chats = cfg.chat.chats
  const [round, setRound] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [messages, setMessages] = useState([])
  const [answered, setAnswered] = useState(false)
  const [shaken, setShaken] = useState(false)
  const { tip, teach } = useTeachingHint()
  const done = round >= chats.length

  useFinishOnDone(done, onComplete, mistakes, 900)

  function choose(option) {
    if (answered) return
    if (option.correct) {
      setAnswered(true)
      playSound('correct')
      burstConfetti()
      setMessages((prev) => [...prev, { from: 'me', text: option.text, ok: true }])
      setTimeout(() => {
        setMessages((prev) => [...prev, { from: 'them', text: option.reply, ok: true }])
        setTimeout(() => {
          setRound((r) => r + 1)
          setMessages([])
          setAnswered(false)
        }, 1100)
      }, 650)
    } else {
      setMistakes((m) => m + 1)
      setShaken(true)
      playSound('wrong')
      teach(chat.warning)
      setTimeout(() => setShaken(false), 800)
    }
  }

  if (done) {
    return <SuccessBanner text={cfg.chat.success} />
  }

  const chat = chats[round]

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <LearningTip tip={tip} />
      <div className="flex items-center gap-2 rounded-t-3xl bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2.5 shadow">
        <span className="text-xl" aria-hidden="true">📱</span>
        <span className="text-lg font-extrabold text-white">{cfg.chat.appName}</span>
        <span className="ml-auto rounded-full bg-white/90 px-3 py-0.5 text-xs font-extrabold text-rose-600">
          Chat {round + 1}/{chats.length}
        </span>
      </div>

      <div className={`flex min-h-72 flex-col gap-2.5 rounded-b-3xl bg-white p-4 shadow-inner ${shaken ? 'animate-shake' : ''}`}>
        <div className="flex items-start gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xl" aria-hidden="true">
            {chat.avatar}
          </span>
          <div className="max-w-[80%] rounded-2xl rounded-tl-md bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 shadow sm:text-base">
            {chat.message}
          </div>
        </div>

        {messages.map((msg, i) =>
          msg.from === 'them' ? (
            <div key={i} className="animate-pop-in flex items-start gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xl" aria-hidden="true">
                {chat.avatar}
              </span>
              <div className="max-w-[80%] rounded-2xl rounded-tl-md bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 shadow sm:text-base">
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex items-start justify-end gap-2">
              <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2.5 text-sm font-bold text-white shadow sm:text-base">
                {msg.text}
              </div>
            </div>
          ),
        )}

        {answered && (
          <span className="animate-pulse px-2 text-xs font-bold text-slate-400">Bity sedang mengetik…</span>
        )}

        <div className="mt-auto flex flex-col gap-2 pt-3">
          {!answered ? (
            chat.options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => choose(option)}
                className="rounded-2xl border-2 border-rose-200 bg-white px-4 py-3 text-left text-sm font-bold text-slate-600 shadow transition hover:scale-[1.02] hover:border-rose-400 sm:text-base"
              >
                💬 {option.text}
              </button>
            ))
          ) : (
            <p className="animate-pop-in text-center text-sm font-extrabold text-emerald-600">
              Pesan ramah terkirim! ✨
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Level 6 - Digital artist studio                                     */
/* ------------------------------------------------------------------ */
function LevelStudio({ cfg, onComplete, playSound }) {
  const studio = cfg.studio
  const { tip, teach } = useTeachingHint()
  const match = useMatchPairs(
    studio.pairs,
    playSound,
    (leftId) => {
      const pair = studio.pairs.find((p) => p.tool.id === leftId)
      if (pair) teach(`Alat "${pair.tool.label}" digunakan untuk ${pair.action.label}. ${pair.teach || ''}`)
    },
  )
  const rightList = useMemo(() => shuffleArray(studio.pairs.map((p) => p.action)), [studio])
  const [effects, setEffects] = useState({
    bucket: false,
    eraser: false,
    pencil: false,
    shapes: false,
  })

  useFinishOnDone(match.allMatched, onComplete, match.mistakes)

  function paintPreview(toolId) {
    setEffects((prev) => ({ ...prev, [toolId]: true }))
  }

  useEffect(() => {
    if (match.matchedLeft.length === 0) return undefined
    const last = match.matchedLeft[match.matchedLeft.length - 1]
    const timer = setTimeout(() => paintPreview(last), 350)
    return () => clearTimeout(timer)
  }, [match.matchedLeft])

  if (match.allMatched) {
    return <SuccessBanner text={studio.success} />
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <LearningTip tip={tip} />
      <div className="relative h-48 w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-b from-sky-200 from-20% via-white to-emerald-200 shadow-inner sm:h-56">
        <span className="absolute right-6 top-4 text-4xl" aria-hidden="true">☁️</span>
        <span className="absolute right-16 top-10 text-4xl" aria-hidden="true">☁️</span>
        <span
          className={`absolute left-8 top-5 flex h-14 w-14 items-center justify-center rounded-full text-3xl transition ${
            effects.bucket ? 'bg-yellow-300 shadow-lg' : 'bg-slate-300'
          }`}
          aria-hidden="true"
        >
          ☀️
        </span>
        {effects.pencil && (
          <svg
            viewBox="0 0 100 40"
            className="animate-pop-in absolute bottom-14 left-6 h-10 w-36 opacity-80"
            aria-hidden="true"
          >
            <path d="M4 30 C 18 8, 30 40, 44 18 S 70 8, 92 22" fill="none" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
        {effects.shapes && (
          <>
            <span className="animate-pop-in absolute bottom-20 right-8 text-3xl" aria-hidden="true">⭐</span>
            <span className="animate-pop-in absolute bottom-8 right-24 flex h-10 w-10 items-center justify-center rounded-full border-4 border-sky-500" aria-hidden="true" />
          </>
        )}
        <span className="absolute bottom-4 left-10 text-3xl" aria-hidden="true">🌸</span>
        <span className="absolute bottom-4 right-10 text-3xl" aria-hidden="true">🌷</span>
        {!effects.eraser && (
          <span className="absolute right-14 bottom-6 h-5 w-12 rounded-full bg-slate-400 blur-[1px]" aria-hidden="true" />
        )}
        {effects.eraser && (
          <span className="animate-pop-in absolute right-10 bottom-4 rounded-full bg-slate-200 px-2.5 py-1 text-xs font-bold text-slate-500 shadow" aria-hidden="true">
            noda terhapus 🧽
          </span>
        )}
      </div>

      <MatchBoard
        leftList={studio.pairs.map((p) => p.tool)}
        rightList={rightList}
        matchedLeft={match.matchedLeft}
        matchedRight={match.matchedRight}
        selected={match.selected}
        onTap={match.tap}
        wrongPair={match.wrongPair}
      />

      {!match.selected && match.matchedLeft.length < studio.pairs.length && (
        <p className="animate-pulse rounded-full bg-white/85 px-5 py-2 text-center text-sm font-bold text-slate-500 shadow">
          👆 Ketuk alat di kiri, lalu ketuk kegunaannya di kanan. Perhatikan lukisan berubah!
        </p>
      )}
      {match.selected && (
        <p className="animate-pop-in rounded-full bg-amber-100 px-5 py-2 text-sm font-extrabold text-amber-700 shadow">
          Sekarang ketuk kegunaan yang cocok untuk alat yang kamu pilih!
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Level 7 - Word document & print shop                                */
/* ------------------------------------------------------------------ */
function LevelOffice({ cfg, onComplete, playSound }) {
  const office = cfg.office
  const [taskIdx, setTaskIdx] = useState(0)
  const [fontApplied, setFontApplied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [printed, setPrinted] = useState(false)
  const [picked, setPicked] = useState(null)
  const [mistakes, setMistakes] = useState(0)
  const { tip, teach } = useTeachingHint()
  const done = taskIdx >= office.tasks.length

  useFinishOnDone(done, onComplete, mistakes, 1000)

  if (done) {
    return <SuccessBanner text={office.success} />
  }

  const task = office.tasks[taskIdx]

  function choose(toolId) {
    if (picked) return
    if (toolId !== task.id) {
      setPicked('bad')
      setMistakes((m) => m + 1)
      playSound('wrong')
      teach(`Langkah ini: ${task.whisper}`)
      setTimeout(() => setPicked(null), 700)
      return
    }
    setPicked('ok')
    playSound('correct')
    burstConfetti()
    if (task.id === 'font') setFontApplied(true)
    if (task.id === 'save') setSaved(true)
    if (task.id === 'print') setPrinted(true)
    setTimeout(() => {
      setPicked(null)
      setTaskIdx((i) => i + 1)
    }, 850)
  }

  const printerState = printed ? 'done' : taskIdx >= 2 ? 'active' : 'idle'

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-4">
      <LearningTip tip={tip} />
      <div className="flex w-full items-center justify-between gap-2">
        <span className="rounded-full bg-white/90 px-4 py-1.5 text-base font-extrabold text-slate-600 shadow sm:text-lg">
          🗂️ Tugas {taskIdx + 1} dari {office.tasks.length}
        </span>
        <span className="animate-pulse rounded-full bg-amber-100 px-4 py-1.5 text-sm font-extrabold text-amber-700 shadow">
          📋 {task.whisper}
        </span>
      </div>

      <div className="relative w-full overflow-hidden rounded-2xl bg-slate-200 p-4 shadow-inner sm:p-5">
        <div className={`relative flex flex-col gap-3 sm:flex-row sm:items-start ${picked === 'bad' ? 'animate-shake' : ''}`}>
          <div
            className={`flex-1 rounded-xl bg-white p-5 shadow-lg transition-all duration-300 sm:p-6 ${
              saved ? 'ring-2 ring-emerald-400' : ''
            }`}
          >
            <p className={`border-b-2 border-dashed border-slate-300 pb-3 text-center font-extrabold tracking-wide text-slate-800 transition ${fontApplied ? 'text-2xl' : 'text-base'}`}>
              📖 {office.paper.title}
            </p>
            <p className={`pt-3 font-semibold text-slate-600 transition ${fontApplied ? 'text-lg leading-relaxed' : 'text-xs leading-snug'}`}>
              {office.paper.body}
            </p>
            {saved && (
              <p className="animate-pop-in mt-3 flex items-center gap-2 rounded-xl bg-emerald-100 px-3 py-2 text-sm font-extrabold text-emerald-700">
                💾 {task.done}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-col items-center gap-1 rounded-xl bg-slate-100 p-3 shadow">
            <span className={`flex h-14 w-14 items-center justify-center rounded-lg text-3xl shadow-inner ${printerState === 'done' ? 'bg-emerald-200' : printerState === 'active' ? 'animate-glow-port bg-sky-100' : 'bg-white'}`} aria-hidden="true">
              🖨️
            </span>
            <span className="text-xs font-bold text-slate-500">Printer</span>
            {printerState !== 'idle' && (
              <span className={`h-3 w-10 rounded-sm bg-white shadow ${printerState === 'active' ? 'animate-pulse' : ''}`} aria-hidden="true" />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {office.tasks.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => choose(t.id)}
            className={`flex flex-col items-center gap-1 rounded-2xl bg-white px-6 py-3 font-extrabold text-slate-700 shadow-lg ring-2 transition hover:scale-105 ${
              (t.id === 'font' && fontApplied) || (t.id === 'save' && saved) || (t.id === 'print' && printed)
                ? 'pointer-events-none opacity-40 ring-slate-200'
                : t.id === task.id
                  ? 'animate-glow-port ring-amber-400'
                  : 'ring-sky-200'
            }`}
          >
            <span className="text-3xl" aria-hidden="true">{t.icon}</span>
            <span className="text-xs font-extrabold text-slate-500 sm:text-sm">{t.label}</span>
          </button>
        ))}
      </div>

      {picked !== null && (
        <p
          className={`animate-pop-in rounded-full px-5 py-2 text-lg font-extrabold text-white shadow ${
            picked === 'ok' ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        >
          {picked === 'ok' ? task.done : 'Bukan langkah ini. Coba pikirkan langkah yang benar! 💪'}
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Level 8 - Presentation master slide builder                         */
/* ------------------------------------------------------------------ */
function LevelSlides({ cfg, onComplete, playSound }) {
  const slides = cfg.slides
  const [taskIdx, setTaskIdx] = useState(0)
  const [textChoice, setTextChoice] = useState(null)
  const [schemeChoice, setSchemeChoice] = useState(null)
  const [picked, setPicked] = useState(null)
  const [mistakes, setMistakes] = useState(0)
  const { tip, teach } = useTeachingHint()
  const done = taskIdx >= slides.tasks.length

  useFinishOnDone(done, onComplete, mistakes, 700)

  if (done) {
    return <SuccessBanner text={slides.success} />
  }

  const task = slides.tasks[taskIdx]

  function choose(option) {
    if (picked) return
    setPicked(option.id)
    if (option.correct) {
      playSound('correct')
      burstConfetti()
      if (task.id === 'text') setTextChoice(option.id)
      if (task.id === 'scheme') setSchemeChoice(option.id)
      setTimeout(() => {
        setPicked(null)
        setTaskIdx((i) => i + 1)
      }, 850)
    } else {
      setMistakes((m) => m + 1)
      playSound('wrong')
      teach(task.teach)
      setTimeout(() => setPicked(null), 700)
    }
  }

  const bgClass = schemeChoice === 'bad' ? 'bg-yellow-50' : 'bg-white'
  const textClass = schemeChoice === 'bad' ? 'text-yellow-400' : 'text-slate-900'

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-4">
      <LearningTip tip={tip} />
      <div className="flex w-full items-center justify-center gap-2">
        {slides.tasks.map((t, i) => (
          <span key={t.id} className={`h-3 w-3 rounded-full ${i < taskIdx ? 'bg-emerald-500' : i === taskIdx ? 'animate-pulse bg-amber-400' : 'bg-slate-300'}`} />
        ))}
      </div>

      <div className={`w-full rounded-2xl ${bgClass} p-6 shadow-xl ring-1 ring-slate-200 sm:p-8`}>
        <p className={`text-center text-2xl font-black sm:text-3xl ${textClass}`}>☀️ Hari Ini Cerah</p>
        <p className={`mt-3 text-center font-bold ${textClass} ${textChoice === 'long' ? 'text-sm leading-relaxed' : 'text-lg'}`}>
          {textChoice === 'long'
            ? 'Hari ini cuaca sangat cerah dan langit bersih tanpa awan gelap, matahari bersinar hangat sepanjang hari sehingga semua orang bisa bermain di luar rumah dengan gembira dan penuh semangat.'
            : 'Cuaca cerah, ayo bermain di luar!'}
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <span className={`h-10 w-10 rounded-full border-4 ${schemeChoice === 'bad' ? 'border-yellow-400' : 'border-slate-800'}`} aria-hidden="true" />
          <span className={`h-10 w-10 rounded-full border-4 ${schemeChoice === 'bad' ? 'bg-yellow-50' : 'bg-white'}`} aria-hidden="true" />
          <span className="text-lg font-bold text-slate-400">— slide preview</span>
        </div>
      </div>

      <p className="rounded-full bg-white/90 px-5 py-2 text-center text-base font-extrabold text-slate-600 shadow sm:text-lg">
        📋 {task.label}
      </p>

      <div className="grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
        {task.options.map((option) => {
          const isPicked = picked === option.id
          const isGood = isPicked && option.correct
          const isBad = isPicked && !option.correct
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => choose(option)}
              className={`flex items-center gap-3 rounded-2xl border-2 bg-white px-4 py-4 text-left text-sm font-extrabold text-slate-700 shadow-lg ring-4 transition hover:scale-105 sm:text-base ${
                isGood ? 'border-emerald-400 ring-emerald-300' : isBad ? 'animate-shake border-red-400 ring-red-300' : 'border-slate-200 ring-sky-200'
              }`}
            >
              <span className="text-3xl" aria-hidden="true">{option.icon}</span>
              <span>{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Level 9 - Ergonomic doctor                                          */
/* ------------------------------------------------------------------ */
function LevelErgo({ cfg, onComplete, playSound }) {
  const erg = cfg.ergo
  const [angle, setAngle] = useState(50)
  const [brightness, setBrightness] = useState(2)
  const [breakOn, setBreakOn] = useState(false)
  const [breakLeft, setBreakLeft] = useState(erg.breakSeconds)
  const [mistakes] = useState(0)
  const { tip, teach } = useTeachingHint()
  const postureOk = Math.abs(angle - erg.posture.target) <= erg.posture.tolerance
  const brightOk = brightness >= erg.brightness.lo && brightness <= erg.brightness.hi

  useRisingEdge(postureOk, () => {
    playSound('correct')
    burstConfetti()
  })
  useRisingEdge(brightOk, () => {
    playSound('correct')
    burstConfetti()
  })
  useRisingEdge(breakOn, () => playSound('correct'))

  useEffect(() => {
    if (!breakOn) return undefined
    const timer = setInterval(() => {
      setBreakLeft((s) => {
        if (s <= 1) {
          clearInterval(timer)
          playSound('win')
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [breakOn, playSound])

  useFinishOnDone(postureOk && brightOk && breakOn, onComplete, mistakes, 1300)

  if (postureOk && brightOk && breakOn) {
    return <SuccessBanner text={erg.success} />
  }

  const tilt = angle - 90

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-5">
      <LearningTip tip={tip} />
      <div className="flex w-full flex-col items-center gap-3 rounded-3xl bg-gradient-to-b from-orange-50 to-amber-100 p-4 shadow-inner sm:flex-row sm:gap-5 sm:p-6">
        <div className="relative w-44 shrink-0 sm:w-52">
          <div
            className={`mx-auto flex h-32 w-24 items-center justify-center rounded-2xl bg-gradient-to-b from-zinc-300 to-zinc-400 shadow-lg transition sm:h-36 sm:w-28 ${
              brightOk ? '' : 'pointer-events-none opacity-40'
            }`}
            aria-hidden="true"
          >
            <span className="text-5xl" aria-hidden="true">🖥️</span>
          </div>
          {!brightOk && <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60 text-2xl" aria-hidden="true">🌙</div>}
          <div
            className="absolute -bottom-1 left-1/2 h-3 w-28 -translate-x-1/2 rounded-full bg-amber-600 shadow"
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-1 flex-col items-center gap-1 sm:items-start">
          <div
            className="text-6xl transition-transform duration-300"
            style={{ transform: `rotate(${Math.max(-40, Math.min(40, tilt * -1.2))}deg)`, transformOrigin: '50% 90%' }}
            aria-hidden="true"
          >
            {postureOk ? '🧍' : '🧎'}
          </div>
          <p className={`text-center text-base font-extrabold sm:text-left ${postureOk ? 'text-emerald-600' : 'text-slate-500'}`}>
            {postureOk ? 'Punggung tegak 90°! Sempurna! ✅' : `Sudut punggung: ${angle}°`}
            {!postureOk && angle < 70 && ' — coba duduk lebih tegak!'}
            {!postureOk && angle > 110 && ' — jangan condong terlalu jauh!'}
          </p>
          <p className={`text-sm font-bold ${brightOk ? 'text-sky-600' : 'text-slate-400'}`}>
            Kecerahan layar: {brightness}/10 {brightOk ? '— nyaman untuk mata ✅' : brightness < 4 ? '(terlalu redup)' : '(terlalu menyilaukan)'}
          </p>
        </div>
      </div>

      <div className="grid w-full max-w-xl gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-lg">
          <p className="text-center text-sm font-extrabold text-slate-600">🦴 Duduk Tegak</p>
          <input
            type="range"
            min="30"
            max="130"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            onPointerUp={() => {
              if (!postureOk) teach('Bayangkan garis lurus dari kepala ke pinggul! Atur sudut punggung mendekati 90° supaya punggung tidak sakit.')
            }}
            className="mt-3 w-full accent-orange-500"
          />
          <p className={`mt-1 text-center text-xs font-bold ${postureOk ? 'text-emerald-600' : 'text-slate-400'}`}>
            Target punggung 90°
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-lg">
          <p className="text-center text-sm font-extrabold text-slate-600">💡 Atur Kecerahan</p>
          <input
            type="range"
            min={erg.brightness.min}
            max={erg.brightness.max}
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            onPointerUp={() => {
              if (!brightOk) teach('Pilih kecerahan di dalam zona nyaman yang ditandai. Terlalu redup atau terlalu menyilaukan membuat mata cepat lelah.')
            }}
            className="mt-3 w-full accent-sky-500"
          />
          <p className={`mt-1 text-center text-xs font-bold ${brightOk ? 'text-sky-600' : 'text-slate-400'}`}>
            Zona nyaman: {erg.brightness.lo}–{erg.brightness.hi}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 shadow-lg">
          <p className="text-center text-sm font-extrabold text-slate-600">👁️ Istirahatkan Mata</p>
          {!breakOn ? (
            <button
              type="button"
              onClick={() => {
                setBreakOn(true)
                playSound('click')
              }}
              className="rounded-full bg-gradient-to-r from-orange-400 to-red-600 px-5 py-2.5 text-base font-extrabold text-white shadow-lg transition hover:scale-105"
            >
              Mulai {erg.breakSeconds} detik
            </button>
          ) : (
            <p className={`text-3xl font-black ${breakLeft === 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
              {breakLeft === 0 ? 'Selesai! ✓' : `${breakLeft} s`}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { label: 'Duduk tegak', ok: postureOk },
          { label: 'Kecerahan nyaman', ok: brightOk },
          { label: 'Istirahat mata 20 detik', ok: breakOn },
        ].map((check) => (
          <span
            key={check.label}
            className={`rounded-full px-4 py-1.5 text-sm font-extrabold shadow transition ${
              check.ok ? 'animate-pop-in bg-emerald-500 text-white' : 'bg-white/80 text-slate-400'
            }`}
          >
            {check.ok ? '✅ ' : '🔲 '}
            {check.label}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Level registry                                                      */
/* ------------------------------------------------------------------ */
const LEVEL_COMPONENTS = {
  sequence: LevelSequence,
  decompose: LevelDecompose,
  patterns: LevelPatterns,
  machine: LevelMachine,
  chat: LevelChat,
  studio: LevelStudio,
  office: LevelOffice,
  slides: LevelSlides,
  ergo: LevelErgo,
}

/* ------------------------------------------------------------------ */
/* Quest shell chrome                                                  */
/* ------------------------------------------------------------------ */
function QuestShell({ levelIndex, score, badges, soundOn, onToggleSound, onExit, onReset, onComplete, playSound, resetKey }) {
  const level = TIK_LEVELS[levelIndex]
  const [showHint, setShowHint] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const LevelComponent = LEVEL_COMPONENTS[level.type]

  useEffect(() => {
    setElapsed(0)
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(timer)
  }, [levelIndex])

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50 to-sky-50">
      <header className="z-10 flex w-full shrink-0 flex-col gap-2 px-4 pt-3 sm:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExit}
            className="flex h-11 shrink-0 items-center gap-1 rounded-full bg-white/95 px-3 text-lg font-extrabold text-slate-600 shadow-lg transition hover:scale-105 sm:px-4"
          >
            <span aria-hidden="true">←</span>
            <span className="hidden sm:inline">Peta</span>
          </button>

          <div className="min-w-0 flex-1 text-center">
            <h1 className="truncate text-lg font-extrabold leading-tight text-slate-700 sm:text-2xl">
              {level.icon} {level.title}
            </h1>
            <p className="text-xs font-bold text-slate-400 sm:text-sm">{level.topic}</p>
          </div>

          <button
            type="button"
            onClick={onToggleSound}
            className="flex h-11 shrink-0 items-center justify-center rounded-full bg-white/95 px-3 text-lg shadow-lg transition hover:scale-105 sm:px-4"
            aria-label={soundOn ? 'Matikan suara' : 'Nyalakan suara'}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
        </div>

        <div className="flex items-center gap-3 px-1 pb-1">
          <span className="shrink-0 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-slate-600 shadow sm:text-sm">
            Level {levelIndex + 1}/9
          </span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/80 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-sky-500 transition-all duration-500"
              style={{ width: `${(badges.length / TIK_LEVELS.length) * 100}%` }}
            />
          </div>
          <span className="shrink-0 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-slate-600 shadow sm:text-sm">
            🏅 {badges.length}/9
          </span>
          <span className="shrink-0 rounded-full bg-sky-600 px-3 py-1 text-xs font-extrabold text-white shadow sm:text-sm">
            ⭐ {score}
          </span>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4">
        <p
          className={`flex items-start gap-2 rounded-2xl bg-gradient-to-r ${level.color.grad} px-4 py-2.5 text-sm font-extrabold text-white shadow-lg sm:text-base`}
        >
          <span className="shrink-0 text-lg sm:text-xl" aria-hidden="true">🕵️</span>
          <span>{level.instruction}</span>
        </p>

        <div className="my-auto flex min-h-0 flex-col items-center justify-center gap-3">
          <LevelComponent key={`${levelIndex}-${resetKey}`} cfg={level} onComplete={(mistakes) => onComplete(levelIndex, mistakes, elapsed)} playSound={playSound} />
        </div>
      </main>

      <footer className="z-10 flex w-full shrink-0 items-center justify-center gap-3 px-4 pb-3">
        <button
          type="button"
          onClick={() => setShowHint((v) => !v)}
          className={`rounded-full px-5 py-2.5 text-base font-extrabold shadow-lg transition hover:scale-105 sm:px-6 ${showHint ? 'bg-amber-500 text-white' : 'bg-white/95 text-amber-600'}`}
        >
          💡 Petunjuk
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full bg-white/95 px-5 py-2.5 text-base font-extrabold text-slate-600 shadow-lg transition hover:scale-105 sm:px-6"
        >
          🔄 Ulangi Kasus
        </button>
      </footer>

      {showHint && (
        <div className="fixed inset-x-0 bottom-20 z-40 flex justify-center px-4">
          <div className="animate-menu-up flex w-full max-w-md items-start gap-3 rounded-2xl bg-white px-5 py-4 shadow-2xl ring-2 ring-amber-300">
            <span className="text-2xl" aria-hidden="true">🔍</span>
            <p className="flex-1 text-base font-bold text-slate-700">{level.hint}</p>
            <button
              type="button"
              onClick={() => setShowHint(false)}
              className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-extrabold text-slate-500"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Completion overlay                                                  */
/* ------------------------------------------------------------------ */
function CompleteOverlay({ info, onAdvance }) {
  const level = TIK_LEVELS[info.levelIndex]
  const isLast = info.levelIndex >= TIK_LEVELS.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="animate-pop-in w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
        <div className="animate-floaty mx-auto flex h-24 w-24 flex-col items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-5xl shadow-lg">
          <span aria-hidden="true">{level.badgeIcon}</span>
        </div>
        <p className="mt-4 text-sm font-extrabold uppercase tracking-widest text-amber-600">Kasus terpecahkan!</p>
        <h2 className="mt-1 text-2xl font-black text-slate-800 sm:text-3xl">{level.badge}</h2>
        <p className="mt-1 text-sm font-bold text-slate-500">
          {level.title} · {level.topic}
        </p>

        <div className="mt-4 flex items-center justify-center gap-5">
          <div>
            <StarsRow count={info.stars} size="text-4xl" />
            <p className="mt-1 text-xs font-bold text-slate-400">
              🕐 {info.elapsed} detik
            </p>
          </div>
          <span className="text-lg font-bold text-slate-300" aria-hidden="true">|</span>
          <div>
            <p className="text-4xl font-black text-emerald-500">+{info.points}</p>
            <p className="text-xs font-bold text-slate-400">poin kasus</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAdvance}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-6 py-3.5 text-xl font-extrabold text-white shadow-lg transition hover:scale-105"
        >
          {isLast ? '🏆 Lihat Hasil & Sertifikat' : 'Lanjut ke Kasus Berikutnya →'}
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Home screen                                                         */
/* ------------------------------------------------------------------ */
function HomeScreen({ name, setName, saved, onStart, onResume, onViewCert }) {
  const [storyIdx, setStoryIdx] = useState(0)
  const completedCount = saved?.badges?.length || 0
  const allDone = completedCount >= TIK_LEVELS.length
  const hasProgress = completedCount > 0

  useEffect(() => {
    if (storyIdx >= TIK_QUEST_META.story_lines.length) return undefined
    const timer = setTimeout(() => setStoryIdx((i) => i + 1), 2400)
    return () => clearTimeout(timer)
  }, [storyIdx])

  const storyLine = TIK_QUEST_META.story_lines[Math.min(storyIdx, TIK_QUEST_META.story_lines.length - 1)]

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-slate-800 via-slate-900 to-amber-950">
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-y-auto px-4 py-6 sm:gap-6">
        <div className="text-center">
          <div className="animate-floaty text-7xl sm:text-8xl" aria-hidden="true">🕵️</div>
          <h1 className="mt-2 text-3xl font-black leading-tight text-amber-300 sm:text-5xl">
            Detective Bity&apos;s
            <br />
            <span className="text-white">TIK Quest</span>
          </h1>
          <p className="mt-2 text-sm font-extrabold text-amber-200/80 sm:text-lg">
            🧩 9 Kasus · 9 Lencana TIK · 1 Sertifikat Master
          </p>
        </div>

        <div className="w-full max-w-lg rounded-2xl bg-white p-5 text-center shadow-2xl sm:p-6">
          <p className="min-h-12 text-base font-bold text-slate-700 sm:text-lg">{storyLine}</p>
          {storyIdx >= TIK_QUEST_META.story_lines.length && (
            <div className="mt-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tulis nama detektifmu di sini…"
                className="w-full rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-center text-lg font-extrabold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none"
              />
              <button
                type="button"
                disabled={!name.trim()}
                onClick={onStart}
                className="mt-3 w-full rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-6 py-3.5 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
              >
                🔍 Mulai Menyelidiki!
              </button>
            </div>
          )}
        </div>

        {hasProgress && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {!allDone && (
              <button
                type="button"
                onClick={onResume}
                className="rounded-full bg-emerald-500 px-6 py-3 text-lg font-extrabold text-white shadow-lg transition hover:scale-105"
              >
                ▶ Lanjutkan (Level {firstUncompletedIndex(saved.badges) + 1} · {saved.score} poin)
              </button>
            )}
            {allDone && (
              <button
                type="button"
                onClick={onViewCert}
                className="rounded-full bg-amber-300 px-6 py-3 text-lg font-extrabold text-amber-900 shadow-lg transition hover:scale-105"
              >
                🏆 Lihat Sertifikat
              </button>
            )}
            <button
              type="button"
              onClick={onStart}
              className="rounded-full bg-white/90 px-6 py-3 text-lg font-extrabold text-slate-600 shadow-lg transition hover:scale-105"
            >
              🔄 Mulai Baru
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2">
          {TIK_LEVELS.map((level) => {
            const earned = saved?.badges?.includes(level.id)
            return (
              <span
                key={level.id}
                className={`flex h-11 w-11 items-center justify-center rounded-full text-xl shadow ${earned ? 'bg-amber-300' : 'opacity-30 grayscale'}`}
                aria-hidden="true"
              >
                {earned ? level.badgeIcon : level.icon}
              </span>
            )
          })}
        </div>
      </main>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Certificate                                                        */
/* ------------------------------------------------------------------ */
function Certificate({ name, score, starsMap, badges, dateStr }) {
  return (
    <div className="print-certificate flex h-full w-full items-center justify-center bg-white p-6">
      <div className="relative flex h-[180mm] w-[270mm] flex-col items-center justify-center rounded-xl border-[6px] border-amber-500 bg-[linear-gradient(135deg,#fffaf0,#fef3c7)] px-10 shadow-2xl">
        <div className="absolute inset-2 rounded-lg border-2 border-amber-400" />
        <div className="absolute inset-4 rounded-lg border border-amber-300 border-dashed" />

        <p className="text-sm font-extrabold uppercase tracking-[0.5em] text-amber-600">Sertifikat Penghargaan</p>
        <h1 className="mt-1 text-5xl font-black uppercase tracking-wide text-slate-800">Master TIK Detective</h1>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-4xl" aria-hidden="true">🕵️</span>
          <p className="text-xl font-bold text-slate-500">Detective Bity&apos;s TIK Quest</p>
        </div>

        <p className="mt-6 text-base font-bold text-slate-500">Diberikan kepada</p>
        <p className="mt-1 border-b-2 border-amber-500 px-12 pb-1 text-4xl font-black uppercase text-slate-900">
          {name}
        </p>
        <p className="mx-auto mt-2 max-w-md text-center text-sm font-semibold text-slate-500">
          yang telah menyelesaikan 9 kasus TIK dan menghimpun seluruh 9 Lencana TIK dengan total skor{' '}
          <span className="font-extrabold text-amber-600">{score}/900</span> pada tanggal {dateStr}.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {TIK_LEVELS.map((level) => {
            const earned = badges.includes(level.id)
            return (
              <div
                key={level.id}
                className={`flex flex-col items-center gap-0.5 rounded-xl border-2 px-3 py-2 ${
                  earned ? 'border-amber-300 bg-white' : 'border-slate-200 opacity-40'
                }`}
              >
                <span className="text-2xl" aria-hidden="true">{level.badgeIcon}</span>
                <span className="text-[10px] font-extrabold text-slate-600">{level.badge}</span>
                <span className="text-[10px] font-bold text-amber-500">{'⭐'.repeat(starsMap[level.id] || 0) || '☆'}</span>
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex w-full items-end justify-between px-16">
          <div className="text-center">
            <p className="pb-1 text-lg font-black italic text-slate-800">Detective Bity</p>
            <div className="h-px w-44 border-t-2 border-slate-400" />
            <p className="mt-1 text-xs font-bold text-slate-500">Kepala Sekolah Detektif TIK</p>
          </div>
          <span className="text-5xl" aria-hidden="true">🔍</span>
          <div className="text-center">
            <p className="pb-1 text-lg font-black text-slate-800">{name}</p>
            <div className="h-px w-44 border-t-2 border-slate-400" />
            <p className="mt-1 text-xs font-bold text-slate-500">Detektif Cilik Kelas 3</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Summary screen                                                      */
/* ------------------------------------------------------------------ */
function SummaryScreen({ name, score, starsMap, badges, onExit, onReplay }) {
  const [showCert, setShowCert] = useState(false)
  const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  const perfect = score >= TIK_QUEST_META.max_score

  return (
    <>
      <style>{`@page { size: A4 landscape; margin: 0; } .print-certificate { print-color-adjust: exact; -webkit-print-color-adjust: exact; }`}</style>

      <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-slate-800 via-slate-900 to-amber-950 print:hidden">
        <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-y-auto px-4 py-6 sm:gap-6">
          <div className="text-center">
            <div className="animate-floaty text-6xl sm:text-7xl" aria-hidden="true">🏆</div>
            <h1 className="mt-1 text-3xl font-black text-amber-300 sm:text-4xl">SELAMAT!</h1>
            <p className="text-lg font-bold text-amber-100/80">
              {name}, kamu adalah <span className="font-black text-white">Master TIK Detective!</span>
            </p>
          </div>

          <div className="flex w-full max-w-lg flex-col items-center gap-4 rounded-3xl bg-white p-6 shadow-2xl">
            {perfect ? (
              <p className="animate-pop-in rounded-full bg-amber-100 px-5 py-2 text-lg font-extrabold text-amber-700">
                ⚜️ Sempurna! Skor {score}/900!
              </p>
            ) : (
              <p className="rounded-full bg-sky-100 px-5 py-2 text-base font-extrabold text-sky-700">
                Total skor: {score}/900
              </p>
            )}
            <StarsRow count={perfect ? 3 : score >= 700 ? 3 : score >= 400 ? 2 : 1} size="text-4xl" />
            <p className="font-bold text-slate-500">
              {badges.length} dari {TIK_LEVELS.length} lencana berhasil dikumpulkan
            </p>

            <div className="grid w-full grid-cols-3 gap-2 sm:grid-cols-5">
              {TIK_LEVELS.map((level) => {
                const earned = badges.includes(level.id)
                return (
                  <div
                    key={level.id}
                    className={`flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-2 text-center ${
                      earned ? 'border-amber-300 bg-amber-50' : 'border-slate-200 opacity-40'
                    }`}
                  >
                    <span className="text-2xl" aria-hidden="true">{level.badgeIcon}</span>
                    <span className="text-[10px] font-extrabold leading-tight text-slate-600">{level.badge}</span>
                    {earned && <span className="text-[10px] text-amber-500">{'⭐'.repeat(starsMap[level.id] || 0)}</span>}
                  </div>
                )
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowCert(true)}
                className="rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-6 py-3 text-lg font-extrabold text-white shadow-lg transition hover:scale-105"
              >
                🖨️ Cetak / Unduh Sertifikat
              </button>
              <button
                type="button"
                onClick={onReplay}
                className="rounded-full bg-white px-6 py-3 text-lg font-extrabold text-slate-600 shadow-lg transition hover:scale-105"
              >
                🔄 Main Lagi
              </button>
              <button
                type="button"
                onClick={onExit}
                className="rounded-full bg-white/70 px-6 py-3 text-lg font-extrabold text-slate-500 shadow-lg transition hover:scale-105"
              >
                ← Peta
              </button>
            </div>
          </div>
        </main>
      </div>

      {showCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 print:hidden">
          <div className="animate-pop-in flex max-h-full w-full flex-col items-center gap-4 overflow-y-auto rounded-2xl bg-slate-800 p-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-6 py-3 text-lg font-extrabold text-white shadow-lg transition hover:scale-105"
              >
                🖨️ Cetak / Simpan PDF
              </button>
              <button
                type="button"
                onClick={() => setShowCert(false)}
                className="rounded-full bg-white px-6 py-3 text-lg font-extrabold text-slate-600 shadow-lg transition hover:scale-105"
              >
                ✕ Tutup
              </button>
            </div>
            <div className="w-full overflow-x-auto">
              <Certificate name={name} score={score} starsMap={starsMap} badges={badges} dateStr={dateStr} />
            </div>
          </div>
        </div>
      )}

      <div className="hidden print:block">
        <Certificate name={name} score={score} starsMap={starsMap} badges={badges} dateStr={dateStr} />
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Main game                                                           */
/* ------------------------------------------------------------------ */
export default function TikQuestGame({ onExit }) {
  const [screen, setScreen] = useState('home')
  const [name, setName] = useState(() => loadProgress()?.name || '')
  const [levelIndex, setLevelIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [badges, setBadges] = useState([])
  const [starsMap, setStarsMap] = useState({})
  const [soundOn, setSoundOn] = useState(true)
  const [resetKey, setResetKey] = useState(0)
  const [completeInfo, setCompleteInfo] = useState(null)
  const saved = loadProgress()

  const playSound = useCallback((kind) => {
    if (soundOn) playChime(kind)
  }, [soundOn])

  function startFresh() {
    const clean = {
      name: name.trim(),
      score: 0,
      badges: [],
      stars: {},
      savedAt: Date.now(),
    }
    saveProgress(clean)
    setLevelIndex(0)
    setScore(0)
    setBadges([])
    setStarsMap({})
    setCompleteInfo(null)
    setResetKey((k) => k + 1)
    setScreen('play')
  }

  function resume() {
    const progress = loadProgress()
    const targetIndex = progress ? firstUncompletedIndex(progress.badges || []) : 0
    setLevelIndex(targetIndex)
    setScore(progress?.score || 0)
    setBadges(progress?.badges || [])
    setStarsMap(progress?.stars || {})
    setCompleteInfo(null)
    setResetKey((k) => k + 1)
    setScreen('play')
  }

  function viewCert() {
    const progress = loadProgress() || {}
    setLevelIndex(0)
    setScore(progress.score || 0)
    setBadges(progress.badges || [])
    setStarsMap(progress.stars || {})
    setScreen('summary')
  }

  function handleComplete(completedIndex, mistakes, elapsed) {
    const points = pointsForLevel(mistakes)
    const stars = starsForLevel(mistakes)
    const level = TIK_LEVELS[completedIndex]
    setScore((prev) => prev + points)
    setBadges((prev) => (prev.includes(level.id) ? prev : [...prev, level.id]))
    setStarsMap((prev) => ({ ...prev, [level.id]: stars }))
    setCompleteInfo({ levelIndex: completedIndex, points, stars, mistakes, elapsed })
    playSound('win')
    celebrate()

    const progress = loadProgress() || {}
    saveProgress({
      name: progress.name || name.trim(),
      score: (progress.score || 0) + points,
      badges: [...new Set([...(progress.badges || []), level.id])],
      stars: { ...(progress.stars || {}), [level.id]: stars },
      savedAt: Date.now(),
    })
  }

  function handleAdvance() {
    setCompleteInfo(null)
    setResetKey((k) => k + 1)
    if (levelIndex + 1 >= TIK_LEVELS.length) {
      setScreen('summary')
    } else {
      setLevelIndex((i) => i + 1)
    }
  }

  function handleReset() {
    setCompleteInfo(null)
    setResetKey((k) => k + 1)
  }

  if (screen === 'summary') {
    return <SummaryScreen name={name} score={score} starsMap={starsMap} badges={badges} onExit={onExit} onReplay={startFresh} />
  }

  if (screen === 'play') {
    return (
      <>
        <QuestShell
          levelIndex={levelIndex}
          score={score}
          badges={badges}
          soundOn={soundOn}
          onToggleSound={() => setSoundOn((v) => !v)}
          onExit={onExit}
          onReset={handleReset}
          onComplete={handleComplete}
          playSound={playSound}
          resetKey={resetKey}
        />
        {completeInfo && <CompleteOverlay levelIndex={levelIndex} info={completeInfo} onAdvance={handleAdvance} />}
      </>
    )
  }

  return (
    <HomeScreen
      name={name}
      setName={setName}
      saved={saved}
      onStart={startFresh}
      onResume={resume}
      onViewCert={viewCert}
    />
  )
}