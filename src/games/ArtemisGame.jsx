import { useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import {
  GOOGLE_SHEET_URL,
  MISSION_TEAMS,
  STUDENTS_DATA,
  SENSOR_NAMES,
  METRICS,
} from './artemisData.js'

const STORAGE_KEY = 'artemis-telemetry-v2'
const CHANNEL_NAME = 'artemis-telemetry'

const TEAM_STYLE = {
  'artemis-1': {
    grad: 'from-rose-500 to-red-600',
    text: 'text-rose-300',
    chip: 'bg-rose-500',
    ring: 'ring-rose-400',
    dot: 'bg-rose-400',
    soft: 'bg-rose-500/10',
  },
  'artemis-2': {
    grad: 'from-sky-500 to-blue-600',
    text: 'text-sky-300',
    chip: 'bg-sky-500',
    ring: 'ring-sky-400',
    dot: 'bg-sky-400',
    soft: 'bg-sky-500/10',
  },
  'artemis-3': {
    grad: 'from-emerald-500 to-green-600',
    text: 'text-emerald-300',
    chip: 'bg-emerald-500',
    ring: 'ring-emerald-400',
    dot: 'bg-emerald-400',
    soft: 'bg-emerald-500/10',
  },
}

const DEFAULT_STORE = {
  submits: {},
  teams: {},
}

const INTRO_LINES = [
  'ATTENTION ALL FLIGHT DIRECTORS…',
  'SOLAR ACTIVITY REPORT: a coronal mass ejection from the Sun has just struck NASA’s Deep Space Network.',
  'Three years of Artemis telemetry — Orion Test, Crewed Lunar Flyby, and the South Pole Landing — arrived scrambled into one massive unsorted data stream.',
  'No Mission Control can clear Orion for orbital insertion until every core telemetry metric is computed and verified live.',
  'TEAM ASSIGNMENTS DECODED. {name}, report to your station. The launch window is open… but not for long.',
]

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_STORE, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_STORE }
}

function sum(list) {
  return list.reduce((a, b) => a + b, 0)
}

function mode(list) {
  const freq = new Map()
  for (const v of list) freq.set(v, (freq.get(v) || 0) + 1)
  let best = null
  let bestN = -1
  for (const [v, n] of freq) {
    if (n > bestN || (n === bestN && v < best)) {
      best = v
      bestN = n
    }
  }
  return best
}

function median(list) {
  const s = [...list].sort((a, b) => a - b)
  const m = s.length >> 1
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

function computeStats(list) {
  const s = [...list].sort((a, b) => a - b)
  return {
    sum: sum(list),
    avg: sum(list) / list.length,
    min: s[0],
    max: s[s.length - 1],
    mode: mode(list),
    median: median(list),
  }
}

function teamCombined(teamId) {
  return Object.values(STUDENTS_DATA)
    .filter((s) => s.team === teamId)
    .flatMap((s) => s.data)
}

function rosterFor(teamId) {
  return Object.entries(STUDENTS_DATA)
    .filter(([, s]) => s.team === teamId)
    .map(([name, s]) => ({ name, ...s }))
}

let audioCtx = null
let muted = false

function ensureAudio() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AC = window.AudioContext || window.webkitAudioContext
    if (AC) audioCtx = new AC()
  }
  return audioCtx
}

function playTone(freq, dur = 0.16, type = 'sine', gain = 0.12, when = 0) {
  if (muted) return
  const ctx = ensureAudio()
  if (!ctx) return
  const t = ctx.currentTime + when
  const osc = ctx.createOscillator()
  const amp = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  amp.gain.setValueAtTime(gain, t)
  amp.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(amp)
  amp.connect(ctx.destination)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

function sndCorrect() {
  playTone(880, 0.12)
  playTone(1175, 0.18, 'sine', 0.12, 0.1)
}

function sndError() {
  playTone(180, 0.25, 'sawtooth', 0.09)
  playTone(140, 0.28, 'sawtooth', 0.09, 0.14)
}

function sndClick() {
  playTone(660, 0.07, 'sine', 0.08)
}

function sndAlarm() {
  playTone(520, 0.12, 'square', 0.06)
  playTone(520, 0.12, 'square', 0.06, 0.22)
  playTone(520, 0.12, 'square', 0.06, 0.44)
}

function sndLaunch() {
  playTone(220, 0.7, 'sawtooth', 0.08)
  playTone(330, 0.55, 'sawtooth', 0.06, 0.18)
  playTone(440, 0.4, 'sawtooth', 0.05, 0.34)
}

function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        sz: 1 + Math.random() * 2.5,
        op: 0.3 + Math.random() * 0.7,
        c: ['#fff', '#fde68a', '#93c5fd', '#c4b5fd'][i % 4],
      })),
    [],
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full animate-floaty"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.sz,
            height: s.sz,
            backgroundColor: s.c,
            opacity: s.op,
            animationDelay: `${s.id * 200}ms`,
          }}
        />
      ))}
    </div>
  )
}

function TopBar({ onExit, right }) {
  return (
    <div className="z-10 flex w-full shrink-0 items-center justify-between px-4 pt-3 sm:px-6 sm:pt-4">
      <button
        type="button"
        onClick={onExit}
        className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-indigo-700 shadow-lg transition hover:scale-105 sm:px-6 sm:py-3 sm:text-2xl"
      >
        <span aria-hidden="true" className="text-xl sm:text-3xl">←</span>
        Games
      </button>
      <div>{right}</div>
    </div>
  )
}

function TeamBadge({ teamId, compact }) {
  const team = MISSION_TEAMS[teamId]
  const style = TEAM_STYLE[teamId]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${style.grad} font-extrabold text-white shadow ${
        compact ? 'px-3 py-1 text-xs sm:text-sm' : 'px-4 py-1.5 text-sm sm:text-base'
      }`}
    >
      <span aria-hidden="true">{team.emoji}</span>
      {team.name}
    </span>
  )
}

function TypeLine({ text, speed = 26, onDone }) {
  const [len, setLen] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    if (len >= text.length) {
      if (!doneRef.current) {
        doneRef.current = true
        onDone()
      }
      return undefined
    }
    const t = setTimeout(() => setLen((v) => v + 1), speed)
    return () => clearTimeout(t)
  }, [len, text, speed, onDone])

  return (
    <span>
      {text.slice(0, len)}
      {len < text.length && (
        <span className="animate-pulse text-cyan-300" aria-hidden="true">▌</span>
      )}
    </span>
  )
}

function CinematicIntro({ player, teamId, mission, onComplete }) {
  const [lineIdx, setLineIdx] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    sndAlarm()
  }, [])

  const lines = useMemo(
    () => INTRO_LINES.map((l) => l.replace('{name}', player)),
    [player],
  )

  function handleLineDone() {
    if (lineIdx < lines.length - 1) {
      setTimeout(() => setLineIdx((i) => i + 1), 750)
    } else {
      setFinished(true)
      sndCorrect()
    }
  }

  return (
    <div className="flip-hide flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-black text-cyan-300">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="animate-flare absolute -top-44 left-1/2 h-[75vh] w-[75vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,120,40,0.5)_0%,rgba(255,60,20,0.22)_45%,transparent_70%)]" />
      </div>
      <Stars />
      <div className="scanlines pointer-events-none absolute inset-0 z-10" aria-hidden="true" />
      <div className="animate-crt-flicker relative z-20 flex min-h-0 flex-1 flex-col">
        <div className="flex w-full shrink-0 items-center justify-between px-4 pt-4 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="animate-alert-pulse h-3 w-3 rounded-full bg-red-500" aria-hidden="true" />
            <span className="animate-alert-pulse font-mono text-[11px] font-extrabold tracking-widest text-red-400 sm:text-sm">
              ⚠ SOLAR FLARE WARNING
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              sndClick()
              onComplete()
            }}
            className="rounded-full border border-cyan-500/40 bg-cyan-950/60 px-4 py-1.5 font-mono text-xs font-bold text-cyan-300 transition hover:scale-105 hover:text-white sm:px-5 sm:text-sm"
          >
            SKIP ➔
          </button>
        </div>

        <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6">
          <div className="w-full max-w-3xl rounded-2xl border border-cyan-500/30 bg-black/70 shadow-[0_0_80px_rgba(34,211,238,0.12)] p-5 font-mono sm:p-8">
            <div className="mb-4 flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <span className="font-mono text-[10px] font-bold tracking-widest text-cyan-500/70 sm:text-xs">
                DSN-1 · MISSION CONTROL — INCOMING TRANSMISSION
              </span>
              <span className="animate-alert-pulse font-mono text-[10px] font-bold text-red-400 sm:text-xs">
                ● REC
              </span>
            </div>

            <div className="min-h-[13rem] space-y-3 font-mono sm:min-h-[15rem]">
              {lines.slice(0, lineIdx).map((l) => (
                <p
                  key={l}
                  className="text-sm font-bold text-cyan-600/70 sm:text-base"
                >
                  {l}
                </p>
              ))}
              <p className="text-lg font-extrabold leading-relaxed text-rose-300 drop-shadow-[0_0_14px_rgba(251,191,36,0.3)] sm:text-2xl">
                <TypeLine key={lineIdx} text={lines[lineIdx]} onDone={handleLineDone} />
              </p>
            </div>

            {finished && (
              <div className="animate-pop-in mt-6 flex flex-col items-center gap-4 border-t border-cyan-500/20 pt-5">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <TeamBadge teamId={teamId} compact />
                  <span className="font-mono text-sm font-bold text-cyan-300 sm:text-base">
                    {mission.codename}
                  </span>
                </div>
                <p className="font-mono text-sm font-bold text-slate-300 sm:text-base">
                  {player}, the fleet is counting on you. Go to your station.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    sndClick()
                    onComplete()
                  }}
                  className={`mt-1 w-full rounded-full bg-gradient-to-r ${TEAM_STYLE[teamId].grad} px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl`}
                >
                  🎧 Enter Mission Control →
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function LoginScreen({ onStart, onExit }) {
  const [playerName, setPlayerName] = useState('')
  const student = playerName ? STUDENTS_DATA[playerName] : null

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900">
      <Stars />
      <TopBar onExit={onExit} />
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6">
        <div className="animate-pop-in flex w-full max-w-2xl flex-col items-center gap-5 rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-10">
          <span className="text-5xl sm:text-6xl" aria-hidden="true">🛰️</span>
          <div>
            <h1 className="text-[clamp(1.75rem,6vw,3rem)] font-extrabold leading-none text-slate-700">
              Operation <span className="text-sky-600">Artemis</span>
            </h1>
            <p className="mt-2 text-sm font-bold text-slate-500 sm:text-base">
              Telemetry Control · Mission Control Center
            </p>
          </div>

          <label className="flex w-full flex-col gap-2 text-left">
            <span className="text-sm font-extrabold tracking-wide text-slate-600 uppercase">
              Select your name
            </span>
            <select
              value={playerName}
              onChange={(e) => {
                sndClick()
                setPlayerName(e.target.value)
              }}
              className="w-full rounded-2xl border-2 border-indigo-200 bg-indigo-50 px-4 py-3 text-center text-xl font-extrabold text-slate-700 outline-none focus:border-indigo-500 sm:text-2xl"
            >
              <option value="">Choose a Flight Specialist…</option>
              {Object.entries(STUDENTS_DATA).map(([name, s]) => (
                <option key={name} value={name}>
                  {name} · {MISSION_TEAMS[s.team].name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex w-full items-center justify-center gap-3">
            <span className="text-sm font-bold text-slate-400">Assigned Team:</span>
            {student ? (
              <TeamBadge teamId={student.team} />
            ) : (
              <span className="text-sm font-bold text-slate-300">—</span>
            )}
          </div>

          <button
            type="button"
            disabled={!student}
            onClick={() => {
              sndClick()
              onStart(playerName)
            }}
            className="w-full rounded-full bg-sky-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 disabled:pointer-events-none disabled:opacity-40 sm:text-2xl"
          >
            Start Mission 🚀
          </button>
        </div>
      </main>
    </div>
  )
}

function BriefingScreen({ player, mission, onOpenSheet, onContinue, onExit }) {
  const student = STUDENTS_DATA[player]
  const style = TEAM_STYLE[student.team]
  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900">
      <Stars />
      <TopBar onExit={onExit} />
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6">
        <div className="animate-pop-in flex w-full max-w-3xl flex-col items-center gap-4 rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-10">
          <span className="text-5xl" aria-hidden="true">📡</span>
          <h2 className="text-[clamp(1.5rem,5vw,2.5rem)] font-extrabold text-slate-700">
            Mission Briefing
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <TeamBadge teamId={student.team} />
            <span className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-extrabold text-slate-500 sm:text-base">
              {mission.codename}
            </span>
          </div>

          <div className="w-full rounded-2xl border border-amber-300 bg-amber-50 p-4 text-left">
            <p className="text-sm font-bold text-amber-700 sm:text-base">
              ⚠️ <span className="uppercase">Mission Alert:</span> A solar flare scrambled
              the telemetry stream! You must verify the 6 flight parameters in Row{' '}
              <b>#{student.row}</b> of the Central Google Sheet before the launch window
              closes.
            </p>
          </div>

          <div className="w-full rounded-2xl bg-slate-900 p-4 text-left font-mono text-sm text-slate-300 sm:text-base">
            <p className="mb-1 font-bold uppercase tracking-wide text-cyan-400">
              {player} · Flight Record
            </p>
            <p>
              <span className="text-slate-500">Team:</span>{' '}
              <span className="font-bold text-cyan-400">{mission.name}</span>{' '}
              <span className="text-slate-500">· Row:</span>{' '}
              <span className="font-bold text-yellow-400">{student.row}</span>{' '}
              <span className="text-slate-500">· Sensors:</span>{' '}
              <span className="font-bold text-emerald-400">
                [{student.data.join(', ')}]
              </span>
            </p>
          </div>

          <p className="max-w-xl text-base font-bold text-slate-600 sm:text-lg">
            Go to the <span className="text-indigo-600">‘Raw Telemetry Dump’</span> tab,
            find <span className="text-sky-600">{mission.name}</span> Row{' '}
            <span className="text-sky-600">{student.row}</span>, and calculate your 6
            values with Google Sheets formulas.
          </p>

          <div className="w-full rounded-2xl bg-indigo-50 p-4 text-left">
            <p className="mb-2 text-center text-xs font-extrabold text-indigo-700 uppercase sm:text-sm">
              Flight Specialist Checklist
            </p>
            <ol className="space-y-1.5 text-sm font-bold text-slate-600 sm:text-base">
              <li>1️⃣ Open the shared Google Sheet in a new tab.</li>
              <li>2️⃣ Locate your row: <b>Row {student.row}</b> for {mission.name}.</li>
              <li>
                3️⃣ Compute <b>SUM</b>, <b>AVERAGE</b>, <b>MIN</b>, <b>MAX</b>,{' '}
                <b>MODE</b> & <b>MEDIAN</b> in the sheet.
              </li>
              <li>4️⃣ Return here and transmit your values to Mission Control.</li>
            </ol>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                sndClick()
                onOpenSheet()
              }}
              className={`flex-1 rounded-full bg-gradient-to-r ${style.grad} px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl`}
            >
              🔗 Open Shared Google Sheet
            </button>
            <button
              type="button"
              onClick={() => {
                sndClick()
                onContinue()
              }}
              className="flex-1 rounded-full bg-white px-8 py-3 text-xl font-extrabold text-slate-600 shadow-lg transition hover:scale-105 sm:text-2xl"
            >
              Continue to Terminal →
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

function MetricInput({ metric, formula, state, value, onChange }) {
  const isOk = state === 'ok'
  const isBad = state === 'bad'
  return (
    <label
      className={`flex flex-col gap-1 rounded-2xl border-2 p-3 transition-all sm:p-4 ${
        isOk
          ? 'border-emerald-400 bg-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.55)]'
          : isBad
            ? 'animate-shake border-amber-400 bg-amber-50'
            : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold text-slate-700 sm:text-base">
          {metric.friendly}
          <span className="ml-1 text-indigo-500">{metric.label}</span>
        </span>
        <span
          className={`text-base leading-none ${isOk ? 'text-emerald-500' : isBad ? 'text-amber-500' : 'text-slate-300'}`}
          aria-hidden="true"
        >
          {isOk ? '✓' : isBad ? '✗' : '◌'}
        </span>
      </div>
      <input
        type="number"
        inputMode="decimal"
        step="0.1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={formula}
        className={`w-full rounded-xl px-3 py-2 text-center text-xl font-extrabold outline-none sm:text-2xl ${
          isOk
            ? 'bg-emerald-100 text-emerald-700'
            : isBad
              ? 'bg-amber-100 text-amber-800'
              : 'bg-slate-50 text-slate-700 focus:bg-sky-50'
        }`}
      />
      {isBad && (
        <p className="text-xs font-bold text-amber-600">
          Re-check your range {formula} in Google Sheets!
        </p>
      )}
    </label>
  )
}

function SensorStrip({ readings, player, teamId, row }) {
  const style = TEAM_STYLE[teamId]
  return (
    <div className={`w-full rounded-2xl ${style.soft} p-3 sm:p-4`}>
      <p className="mb-2 text-center text-xs font-extrabold uppercase tracking-wide text-slate-500">
        {player} · Row {row} · Raw Sensor Readings (5 telemetry values)
      </p>
      <div className="grid grid-cols-5 gap-2">
        {readings.map((r, i) => (
          <div
            key={i}
            className="flex flex-col items-center rounded-xl bg-white/80 px-1 py-2 shadow-sm"
          >
            <span className="text-2xl font-black text-slate-700 sm:text-3xl">{r}</span>
            <span className="text-[10px] font-bold text-slate-400 sm:text-xs">
              {SENSOR_NAMES[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TerminalScreen({ player, mission, onBack, onTransmitted }) {
  const student = STUDENTS_DATA[player]
  const readings = student.data
  const expected = useMemo(() => computeStats(readings), [readings])
  const [values, setValues] = useState({})
  const [states, setStates] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [flash, setFlash] = useState(false)

  function setValue(key, value) {
    setValues((v) => ({ ...v, [key]: value }))
  }

  function transmit() {
    const next = {}
    let perfect = true
    for (const m of METRICS) {
      const v = parseFloat(values[m.key])
      const ok = !Number.isNaN(v) && Math.abs(v - expected[m.key]) < 0.051
      next[m.key] = ok ? 'ok' : 'bad'
      if (!ok) perfect = false
    }
    setStates(next)
    if (perfect) {
      setSubmitted(true)
      sndCorrect()
      onTransmitted(player, true)
    } else {
      setFlash(true)
      setTimeout(() => setFlash(false), 600)
      sndError()
      onTransmitted(player, false)
    }
  }

  function backToRadar() {
    sndClick()
    onBack()
  }

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900">
      <Stars />
      {flash && (
        <div className="animate-flash-red pointer-events-none absolute inset-0 z-40 bg-amber-500/30" />
      )}
      <div className="z-10 flex w-full shrink-0 items-center justify-between px-4 pt-3 sm:px-6 sm:pt-4">
        <button
          type="button"
          onClick={backToRadar}
          className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-sm font-extrabold text-indigo-700 shadow transition hover:scale-105 sm:px-4 sm:py-2 sm:text-lg"
        >
          <span aria-hidden="true">←</span> Dashboard
        </button>
        <div className="text-center">
          <p className="text-[10px] font-extrabold text-cyan-400 uppercase sm:text-xs">
            {mission.codename}
          </p>
          <p className="text-xs font-bold text-white/60 sm:text-sm">
            Telemetry Terminal · {player} · Row {student.row}
          </p>
        </div>
        <div className="w-16 sm:w-24" />
      </div>

      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-4">
        {!submitted ? (
          <div className="animate-pop-in flex w-full max-w-2xl flex-col gap-4 rounded-3xl bg-white/95 p-5 shadow-lg sm:p-8">
            <div className="text-center">
              <h2 className="text-[clamp(1.5rem,5vw,2.25rem)] font-extrabold text-slate-700">
                Telemetry <span className="text-sky-600">Terminal</span>
              </h2>
              <p className="mt-1 text-sm font-bold text-slate-500 sm:text-base">
                Enter your verified sensor totals to clear the Orion capsule for launch.
              </p>
            </div>

            <SensorStrip
              readings={readings}
              player={player}
              teamId={student.team}
              row={student.row}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {METRICS.map((m) => (
                <MetricInput
                  key={m.key}
                  metric={m}
                  formula={m.sheet(student.row)}
                  state={states[m.key]}
                  value={values[m.key] || ''}
                  onChange={(v) => setValue(m.key, v)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={transmit}
              className="w-full rounded-full bg-cyan-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl"
            >
              📡 Transmit Telemetry to Mission Control
            </button>
          </div>
        ) : (
          <div className="animate-pop-in flex w-full max-w-lg flex-col items-center gap-5 rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-10">
            <span className="text-6xl" aria-hidden="true">📡</span>
            <h2 className="text-[clamp(1.5rem,5vw,2.25rem)] font-extrabold text-emerald-600">
              Transmission Received!
            </h2>
            <p className="text-base font-bold text-slate-500 sm:text-lg">
              Mission Control has verified your telemetry,{' '}
              <span className="text-sky-600">{player}</span>. Your team is one step
              closer to launch.
            </p>
            <button
              type="button"
              onClick={backToRadar}
              className="w-full rounded-full bg-sky-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl"
            >
              View Team Dashboard →
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

function BossMetricInput({ metric, state, value, onChange }) {
  const isOk = state === 'ok'
  const isBad = state === 'bad'
  return (
    <label className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500 sm:text-xs">
          {metric.label}
        </span>
        <span
          className={`text-sm leading-none ${isOk ? 'text-emerald-500' : isBad ? 'text-amber-500' : 'text-slate-300'}`}
          aria-hidden="true"
        >
          {isOk ? '✓' : isBad ? '✗' : '◌'}
        </span>
      </div>
      <input
        type="number"
        inputMode="decimal"
        step="0.1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg px-2 py-1.5 text-center text-lg font-extrabold outline-none sm:text-xl ${
          isOk
            ? 'bg-emerald-100 text-emerald-700'
            : isBad
              ? 'bg-amber-100 text-amber-800'
              : 'bg-slate-50 text-slate-700 focus:bg-sky-50'
        }`}
      />
    </label>
  )
}

function BossPanel({ teamId, done, boss, onBossSubmit }) {
  const [values, setValues] = useState({})
  const [states, setStates] = useState({})
  const unlocked = done
  const team = MISSION_TEAMS[teamId]
  const style = TEAM_STYLE[teamId]
  const expected = useMemo(() => computeStats(teamCombined(teamId)), [teamId])

  function transmit() {
    const next = {}
    let perfect = true
    for (const m of METRICS) {
      const v = parseFloat(values[m.key])
      const ok = !Number.isNaN(v) && Math.abs(v - expected[m.key]) < 0.051
      next[m.key] = ok ? 'ok' : 'bad'
      if (!ok) perfect = false
    }
    setStates(next)
    if (perfect) {
      sndCorrect()
      onBossSubmit(teamId, true)
    } else {
      sndError()
      onBossSubmit(teamId, false)
    }
  }

  if (!unlocked) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-500 p-3 text-center">
        <p className="text-xs font-extrabold text-slate-400 uppercase sm:text-sm">
          🔒 Flight Director panel locked
        </p>
        <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">
          Waiting for all {team.size} specialists to transmit…
        </p>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl border-2 ${style.ring} ${style.soft} p-3 sm:p-4`}>
      <p className="mb-2 text-center text-xs font-extrabold uppercase tracking-wide text-slate-500">
        🔑 Phase 2 · Flight Director · {team.name} Aggregate Telemetry
      </p>
      {boss ? (
        <p className="text-center text-sm font-extrabold text-emerald-500">
          ✓ Team aggregate verified — mission cleared!
        </p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {METRICS.map((m) => (
              <BossMetricInput
                key={m.key}
                metric={m}
                state={states[m.key]}
                value={values[m.key] || ''}
                onChange={(v) => setValues((prev) => ({ ...prev, [m.key]: v }))}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={transmit}
            className={`mt-3 w-full rounded-full bg-gradient-to-r ${style.grad} px-6 py-2.5 text-lg font-extrabold text-white shadow-lg transition hover:scale-105`}
          >
            Transmit Team Aggregate
          </button>
        </>
      )}
    </div>
  )
}

function TeamCard({ teamId, store, onBossSubmit, isYou }) {
  const team = MISSION_TEAMS[teamId]
  const style = TEAM_STYLE[teamId]
  const members = rosterFor(teamId)
  const doneCount = members.filter((s) => store.submits[s.name]?.perfect).length
  const allDone = doneCount === team.size
  const boss = store.teams[teamId]?.boss
  const cleared = !!(boss && boss.perfect)
  const status = cleared
    ? 'MISSION CLEARED'
    : allDone
      ? 'FLIGHT DIRECTOR READY'
      : 'IN PROGRESS'

  return (
    <div
      className={`flex flex-col gap-3 rounded-3xl border-2 bg-white/95 p-4 shadow-lg sm:p-5 ${
        cleared ? 'border-emerald-300' : 'border-slate-200'
      } ${isYou ? 'ring-2 ring-sky-300' : ''}`}
    >
      <div className="flex items-center justify-between gap-2">
        <TeamBadge teamId={teamId} compact />
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white sm:text-xs ${
            cleared ? 'bg-emerald-500' : allDone ? `bg-gradient-to-r ${style.grad}` : 'bg-slate-400'
          }`}
        >
          {status}
        </span>
      </div>

      <p className="text-xs font-bold text-slate-400 sm:text-sm">{team.codename}</p>

      <div className="flex flex-wrap gap-1.5">
        {members.map((s) => {
          const ok = store.submits[s.name]?.perfect
          return (
            <span
              key={s.name}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold transition ${
                ok
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {ok ? '✓ ' : ''}
              {s.name}
            </span>
          )
        })}
      </div>

      <div className="w-full">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 sm:text-xs">
            Team Readiness
          </span>
          <span className="text-[10px] font-extrabold text-slate-500 sm:text-xs">
            {doneCount} / {team.size}
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${style.grad} transition-all duration-700`}
            style={{ width: `${(doneCount / team.size) * 100}%` }}
          />
        </div>
      </div>

      <BossPanel
        key={`${teamId}-${doneCount}`}
        teamId={teamId}
        done={allDone}
        boss={boss}
        onBossSubmit={onBossSubmit}
      />
    </div>
  )
}

function RadarScreen({ player, store, onSwitchPlayer, onOpenTerminal, onBossSubmit, onReset, onExit, muted, onToggleMuted }) {
  const student = STUDENTS_DATA[player]
  const style = TEAM_STYLE[student.team]

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900">
      <Stars />
      <div className="z-10 flex w-full shrink-0 items-center justify-between px-4 pt-3 sm:px-6 sm:pt-4">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-sm font-extrabold text-indigo-700 shadow transition hover:scale-105 sm:px-4 sm:py-2 sm:text-lg"
        >
          <span aria-hidden="true">←</span> Exit
        </button>
        <div className="hidden text-center sm:block">
          <p className="text-xs font-extrabold text-cyan-400 uppercase sm:text-sm">
            Launch Radar · Mission Control
          </p>
          <p className="text-xs font-bold text-white/60">
            Operator: {player} · <TeamBadge teamId={student.team} compact />
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMuted}
            className="rounded-full bg-white/95 px-3 py-1.5 text-sm font-extrabold text-indigo-700 shadow transition hover:scale-105 sm:px-4 sm:py-2"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button
            type="button"
            onClick={onSwitchPlayer}
            className="rounded-full bg-white/95 px-3 py-1.5 text-sm font-extrabold text-indigo-700 shadow transition hover:scale-105 sm:px-4 sm:py-2 sm:text-lg"
          >
            🔄 Switch Player
          </button>
        </div>
      </div>

      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-start gap-4 overflow-y-auto px-4 py-4 sm:gap-6 sm:px-6 sm:py-6">
        <div className="w-full max-w-5xl text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 sm:text-xs">
            Real-time Telemetry Status
          </p>
          <h2 className="text-[clamp(1.5rem,5vw,2.5rem)] font-extrabold text-white">
            Team Launch <span className="text-sky-300">Radar</span>
          </h2>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-extrabold text-white">
              🟢 Mission Cleared
            </span>
            <span className="rounded-full bg-sky-500 px-3 py-1 text-xs font-extrabold text-white">
              🔵 Flight Director Ready
            </span>
            <span className="rounded-full bg-slate-500 px-3 py-1 text-xs font-extrabold text-white">
              🟡 In Progress
            </span>
          </div>
        </div>

        <div className="grid w-full max-w-5xl grid-cols-1 gap-4 lg:grid-cols-3">
          {Object.keys(MISSION_TEAMS).map((teamId) => (
            <TeamCard
              key={teamId}
              teamId={teamId}
              store={store}
              onBossSubmit={onBossSubmit}
              isYou={teamId === student.team}
            />
          ))}
        </div>

        <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onOpenTerminal}
            className={`rounded-full bg-gradient-to-r ${style.grad} px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl`}
          >
            📡 Open My Telemetry Terminal
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-full bg-white/20 px-6 py-3 text-base font-extrabold text-white/70 shadow transition hover:scale-105 hover:bg-white/30"
          >
            ↺ Reset Mission Data
          </button>
        </div>
      </main>
    </div>
  )
}

function LaunchScreen({ onLaunchEnd }) {
  useEffect(() => {
    sndLaunch()
    const fire = setInterval(() => {
      confetti({
        particleCount: 45,
        spread: 90,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
      })
    }, 320)
    const end = setTimeout(() => {
      clearInterval(fire)
      onLaunchEnd()
    }, 5600)
    return () => {
      clearInterval(fire)
      clearTimeout(end)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex touch-manipulation flex-col items-center justify-end overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-black">
      <Stars />
      <p className="z-20 mb-4 animate-pop-in text-2xl font-extrabold tracking-widest text-white drop-shadow-lg sm:text-4xl">
        🚀 MISSION LAUNCH IN PROGRESS
      </p>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-700" />
      <div className="animate-artemis-wiggle absolute bottom-16 left-1/2 z-10 -translate-x-1/2">
        <img
          src="/images/rocket.svg"
          alt=""
          className="animate-artemis-rise h-56 w-56 sm:h-72 sm:w-72"
        />
      </div>
      <div className="pointer-events-none absolute bottom-16 left-1/2 z-0 flex -translate-x-1/2 gap-10">
        {['puff-1', 'puff-2', 'puff-3'].map((p, i) => (
          <div
            key={p}
            className="animate-smoke-puff h-6 w-6 rounded-full bg-white/60"
            style={{ animationDelay: `${i * 300}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

function VictoryScreen({ store, onExit, onRestart }) {
  useEffect(() => {
    const burst = (x, y) =>
      confetti({ particleCount: 80, spread: 70, origin: { x, y } })
    burst(0.25, 0.4)
    burst(0.75, 0.4)
    const t = setTimeout(() => {
      if (confetti.reset) confetti.reset()
      burst(0.5, 0.3)
    }, 900)
    return () => clearTimeout(t)
  }, [])

  const clearedTeams = Object.keys(MISSION_TEAMS).filter(
    (tid) => store.teams[tid]?.clearedAt,
  )
  const fastest = clearedTeams.length
    ? clearedTeams.sort(
        (a, b) => store.teams[a].clearedAt - store.teams[b].clearedAt,
      )[0]
    : null
  const precisionTeams = Object.keys(MISSION_TEAMS).filter((tid) => {
    const members = rosterFor(tid)
    const allPerfect = members.every((s) => {
      const record = store.submits[s.name]
      return record && record.perfect && record.wrongAttempts === 0
    })
    const boss = store.teams[tid]?.boss
    return allPerfect && boss && boss.perfect && boss.wrongAttempts === 0
  })

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900">
      <Stars />
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6">
        <div className="animate-pop-in flex w-full max-w-2xl flex-col items-center gap-5 rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-10">
          <span className="text-6xl sm:text-7xl" aria-hidden="true">🌕</span>
          <h1 className="text-[clamp(1.75rem,6vw,3rem)] font-extrabold text-slate-700">
            Orion is en route to the <span className="text-sky-600">Moon!</span>
          </h1>
          <p className="text-base font-bold text-slate-500 sm:text-lg">
            All three teams verified their telemetry. Mission Control is green across the
            board!
          </p>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="text-3xl" aria-hidden="true">🥇</p>
              <p className="mt-1 text-sm font-extrabold uppercase tracking-wide text-amber-600">
                Fastest Telemetry Team
              </p>
              <p className="mt-1 text-lg font-extrabold text-slate-700">
                {fastest ? MISSION_TEAMS[fastest].name : '—'}
              </p>
              <p className="text-xs font-bold text-slate-400">
                First team to transmit 100% correct values.
              </p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-4">
              <p className="text-3xl" aria-hidden="true">🎯</p>
              <p className="mt-1 text-sm font-extrabold uppercase tracking-wide text-sky-600">
                Precision Award
              </p>
              <p className="mt-1 text-lg font-extrabold text-slate-700">
                {precisionTeams.length
                  ? precisionTeams.map((t) => MISSION_TEAMS[t].name).join(', ')
                  : 'None'}
              </p>
              <p className="text-xs font-bold text-slate-400">
                Zero incorrect validation attempts.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onRestart}
              className="flex-1 rounded-full bg-sky-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl"
            >
              ↺ Run Mission Again
            </button>
            <button
              type="button"
              onClick={onExit}
              className="flex-1 rounded-full bg-white px-8 py-3 text-xl font-extrabold text-slate-600 shadow-lg transition hover:scale-105 sm:text-2xl"
            >
              Back to Games 🎮
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ArtemisGame({ onExit }) {
  const [screen, setScreen] = useState('login')
  const [player, setPlayer] = useState(null)
  const [store, setStore] = useState(loadStore)
  const [mutedState, setMutedState] = useState(false)
  const launchRef = useRef(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    } catch {
      /* ignore */
    }
  }, [store])

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return undefined
    const channel = new BroadcastChannel(CHANNEL_NAME)
    const listener = (e) => {
      if (e.data?.type === 'store' && e.data.store) setStore(e.data.store)
    }
    channel.addEventListener('message', listener)
    return () => channel.removeEventListener('message', listener)
  }, [])

  const allCleared = Object.keys(MISSION_TEAMS).every(
    (tid) => store.teams[tid]?.clearedAt,
  )

  useEffect(() => {
    if (allCleared && !launchRef.current) {
      launchRef.current = true
      const t = setTimeout(() => setScreen('launch'), 600)
      return () => clearTimeout(t)
    }
  }, [allCleared])

  function broadcast(updated) {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const channel = new BroadcastChannel(CHANNEL_NAME)
        channel.postMessage({ type: 'store', store: updated })
      } catch {
        /* ignore */
      }
    }
    return updated
  }

  function handleIndividualSubmit(playerName, perfect) {
    setStore((prev) => {
      const prevSubmission = prev.submits[playerName] || {
        attempts: 0,
        wrongAttempts: 0,
      }
      const next = {
        ...prev,
        submits: {
          ...prev.submits,
          [playerName]: {
            ...prevSubmission,
            attempts: prevSubmission.attempts + 1,
            wrongAttempts:
              prevSubmission.wrongAttempts + (perfect ? 0 : 1),
            perfect: prevSubmission.perfect || perfect,
            at: prevSubmission.at || Date.now(),
          },
        },
      }
      broadcast(next)
      return next
    })
  }

  function handleBossSubmit(teamId, perfect) {
    setStore((prev) => {
      const prevBoss = prev.teams[teamId]?.boss || {
        attempts: 0,
        wrongAttempts: 0,
      }
      const alreadyCleared = prev.teams[teamId]?.clearedAt
      const next = {
        ...prev,
        teams: {
          ...prev.teams,
          [teamId]: {
            ...prev.teams[teamId],
            boss: {
              ...prevBoss,
              attempts: prevBoss.attempts + 1,
              wrongAttempts:
                prevBoss.wrongAttempts + (perfect ? 0 : 1),
              perfect: prevBoss.perfect || perfect,
              at: prevBoss.at || Date.now(),
            },
            clearedAt: alreadyCleared || (perfect ? Date.now() : null),
          },
        },
      }
      if (perfect && !alreadyCleared) sndAlarm()
      broadcast(next)
      return next
    })
  }

  function handleReset() {
    if (!window.confirm('Reset all mission telemetry data?')) return
    setStore({ ...DEFAULT_STORE })
    setScreen('login')
    setPlayer(null)
    launchRef.current = false
  }

  function toggleMuted() {
    setMutedState((m) => {
      muted = !m
      return !m
    })
  }

  function restart() {
    setStore({ ...DEFAULT_STORE })
    setPlayer(null)
    setScreen('login')
    launchRef.current = false
  }

  const student = player ? STUDENTS_DATA[player] : null
  const mission = student ? MISSION_TEAMS[student.team] : null

  if (screen === 'launch') {
    return <LaunchScreen onLaunchEnd={() => setScreen('victory')} />
  }
  if (screen === 'victory') {
    return <VictoryScreen store={store} onExit={onExit} onRestart={restart} />
  }
  if (screen === 'login') {
    return (
      <LoginScreen
        onStart={(p) => {
          setPlayer(p)
          setScreen('intro')
        }}
        onExit={onExit}
      />
    )
  }
  if (screen === 'intro') {
    return (
      <CinematicIntro
        player={player}
        teamId={student.team}
        mission={mission}
        onComplete={() => setScreen('briefing')}
      />
    )
  }
  if (screen === 'briefing') {
    return (
      <BriefingScreen
        player={player}
        mission={mission}
        onOpenSheet={() => {
          sndClick()
          window.open(GOOGLE_SHEET_URL, '_blank', 'noopener')
        }}
        onContinue={() => setScreen('terminal')}
        onExit={onExit}
      />
    )
  }
  if (screen === 'terminal') {
    return (
      <TerminalScreen
        player={player}
        mission={mission}
        onBack={() => setScreen('radar')}
        onTransmitted={handleIndividualSubmit}
      />
    )
  }

  return (
    <RadarScreen
      player={player}
      store={store}
      onSwitchPlayer={() => {
        sndClick()
        setPlayer(null)
        setScreen('login')
      }}
      onOpenTerminal={() => setScreen('terminal')}
      onBossSubmit={handleBossSubmit}
      onReset={handleReset}
      onExit={onExit}
      muted={mutedState}
      onToggleMuted={toggleMuted}
    />
  )
}