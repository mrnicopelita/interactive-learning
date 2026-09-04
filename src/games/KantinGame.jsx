import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import {
  TEAMS, ROLES, MENU_ITEMS, QUEUE_CATEGORIES, STUDENTS,
  DEFAULT_FLOWCHART_NODES, DEFAULT_FLOWCHART_CONNECTIONS,
  CUSTOMER_PRESETS, TEST_SCRIPTS, PROBLEMS_TEMPLATE, OBJECTIVE_METRICS,
  SCORING_WEIGHTS, PHASE_DURATIONS,
} from './kantinData.js'

const STORAGE_KEY = 'kantin-crisis-v1'
const CHANNEL_NAME = 'kantin-crisis'

const TEAM_STYLE = {
  A: { grad: 'from-red-500 to-rose-600', text: 'text-red-300', chip: 'bg-red-500', ring: 'ring-red-400', soft: 'bg-red-500/10', border: 'border-red-300' },
  B: { grad: 'from-blue-500 to-indigo-600', text: 'text-blue-300', chip: 'bg-blue-500', ring: 'ring-blue-400', soft: 'bg-blue-500/10', border: 'border-blue-300' },
}

const ROLE_STYLE = {
  analyst: { grad: 'from-sky-500 to-blue-600', bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-700' },
  strategist: { grad: 'from-purple-500 to-violet-600', bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700' },
  algorist: { grad: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700' },
  simulator: { grad: 'from-orange-500 to-amber-600', bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700' },
  qa: { grad: 'from-red-500 to-rose-600', bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700' },
}

const DEFAULT_STORE = {
  teams: { A: { members: {}, requirements: null, rules: null, flowchart: null, menu: null, presets: null, testScripts: [], deployed: false, bugs: [], patches: [], score: null }, B: { members: {}, requirements: null, rules: null, flowchart: null, menu: null, presets: null, testScripts: [], deployed: false, bugs: [], patches: [], score: null } },
  phase: 'login',
  timer: 0,
  activeTests: [],
  testResults: {},
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_STORE, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return { ...DEFAULT_STORE }
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

function sndCorrect() { playTone(880, 0.12); playTone(1175, 0.18, 'sine', 0.12, 0.1) }
function sndError() { playTone(180, 0.25, 'sawtooth', 0.09); playTone(140, 0.28, 'sawtooth', 0.09, 0.14) }
function sndClick() { playTone(660, 0.07, 'sine', 0.08) }
function sndAlarm() { playTone(520, 0.12, 'square', 0.06); playTone(520, 0.12, 'square', 0.06, 0.22); playTone(520, 0.12, 'square', 0.06, 0.44) }
function sndDeploy() { playTone(440, 0.3, 'sawtooth', 0.08); playTone(660, 0.25, 'sawtooth', 0.06, 0.15); playTone(880, 0.4, 'sawtooth', 0.05, 0.3) }
function sndBug() { playTone(200, 0.15, 'square', 0.1); playTone(150, 0.2, 'square', 0.1, 0.12); playTone(100, 0.25, 'square', 0.1, 0.25) }
function sndPatch() { playTone(523, 0.1); playTone(659, 0.1, 'sine', 0.1, 0.08); playTone(784, 0.15, 'sine', 0.1, 0.16) }

function formatTime(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function TopBar({ onExit, right, title }) {
  return (
    <div className="z-10 flex w-full shrink-0 items-center justify-between px-4 pt-3 sm:px-6 sm:pt-4">
      <button type="button" onClick={onExit} className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-lg font-extrabold text-amber-700 shadow-lg transition hover:scale-105 sm:px-6 sm:py-3 sm:text-2xl">
        <span aria-hidden="true">←</span> Games
      </button>
      {title && <span className="text-sm font-extrabold text-white/80 sm:text-base">{title}</span>}
      <div>{right}</div>
    </div>
  )
}

function TeamBadge({ teamId, compact }) {
  const team = TEAMS[teamId]
  const style = TEAM_STYLE[teamId]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${style.grad} font-extrabold text-white shadow ${compact ? 'px-3 py-1 text-xs sm:text-sm' : 'px-4 py-1.5 text-sm sm:text-base'}`}>
      <span aria-hidden="true">{team.emoji}</span>
      {team.name}
    </span>
  )
}

function RoleBadge({ roleId, compact }) {
  const role = ROLES.find(r => r.id === roleId)
  const style = ROLE_STYLE[roleId]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${style.bg} ${style.border} border-2 font-extrabold ${style.text} ${compact ? 'px-2.5 py-0.5 text-[10px] sm:text-xs' : 'px-3 py-1 text-xs sm:text-sm'}`}>
      <span aria-hidden="true">{role.icon}</span>
      {role.name}
    </span>
  )
}

function Timer({ seconds, phase }) {
  const isUrgent = seconds <= 60
  const isCritical = seconds <= 30
  return (
    <div className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-lg font-extrabold shadow-lg sm:text-2xl ${isCritical ? 'animate-shake bg-red-500 text-white' : isUrgent ? 'bg-amber-400 text-amber-900' : 'bg-white/95 text-slate-700'}`}>
      <span aria-hidden="true">⏱</span>
      <span>{formatTime(seconds)}</span>
      {phase && <span className="text-xs font-bold text-slate-400 sm:text-sm">{phase}</span>}
    </div>
  )
}

function ProgressBar({ current, total, label, color = 'amber' }) {
  const pct = total > 0 ? (current / total) * 100 : 0
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 sm:text-xs">{label}</span>
          <span className="text-[10px] font-extrabold text-slate-500 sm:text-xs">{current} / {total}</span>
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full bg-${color}-500 transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function BugAlert({ bug, onDismiss }) {
  useEffect(() => { sndBug() }, [])
  return (
    <div className="animate-pop-in fixed inset-x-4 top-4 z-50 mx-auto max-w-xl rounded-2xl border-2 border-red-400 bg-red-50 p-4 shadow-2xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2">
      <div className="flex items-start gap-3">
        <span className="text-3xl" aria-hidden="true">🚨</span>
        <div className="flex-1">
          <p className="text-sm font-extrabold uppercase tracking-wide text-red-500">Critical Bug #{bug.id}</p>
          <p className="mt-1 text-base font-bold text-red-700 sm:text-lg">{bug.desc}</p>
          <p className="mt-1 text-xs font-bold text-red-400">at Node: {bug.node}</p>
        </div>
        <button type="button" onClick={onDismiss} className="rounded-full bg-red-200 px-3 py-1 text-xs font-extrabold text-red-700 hover:bg-red-300">✕</button>
      </div>
    </div>
  )
}

/* ─── LOGIN SCREEN ─── */
function LoginScreen({ onJoin, onExit }) {
  const [selectedName, setSelectedName] = useState('')
  const student = selectedName ? STUDENTS.find(s => s.name === selectedName) : null

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-amber-200 via-orange-100 to-yellow-200">
      <TopBar onExit={onExit} />
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6">
        <div className="animate-pop-in flex w-full max-w-xl flex-col items-center gap-5 rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-10">
          <span className="text-6xl sm:text-7xl" aria-hidden="true">🍽️</span>
          <div>
            <h1 className="text-[clamp(1.5rem,5vw,2.75rem)] font-extrabold leading-none text-slate-700">
              Krisis <span className="text-amber-600">15 Menit</span>
            </h1>
            <p className="mt-1 text-sm font-bold text-slate-500 sm:text-base">Kantin SMP Nusantara</p>
          </div>

          <div className="w-full rounded-2xl bg-amber-50 p-3 text-left sm:p-4">
            <p className="text-xs font-bold text-amber-700 sm:text-sm">
              🏫 Jam istirahat hanya <b>15 menit</b> untuk <b>300 siswa</b>. Antrean kacau, transaksi lambat, pesanan salah. Bangun sistem pelayanan kantin otomatis!
            </p>
          </div>

          <label className="flex w-full flex-col gap-2 text-left">
            <span className="text-sm font-extrabold tracking-wide text-slate-600 uppercase">Pilih Nama Kamu</span>
            <select
              value={selectedName}
              onChange={(e) => { sndClick(); setSelectedName(e.target.value) }}
              className="w-full rounded-2xl border-2 border-amber-200 bg-amber-50 px-4 py-3 text-center text-lg font-bold text-slate-700 outline-none focus:border-amber-500 sm:text-xl"
            >
              <option value="">— Pilih Siswa —</option>
              {STUDENTS.map(s => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
          </label>

          <div className="flex items-center justify-center gap-3">
            <span className="text-sm font-bold text-slate-400">Tim:</span>
            {student ? (
              <TeamBadge teamId={student.team} />
            ) : (
              <span className="text-sm font-bold text-slate-300">—</span>
            )}
          </div>

          <button
            type="button"
            disabled={!student}
            onClick={() => { sndClick(); onJoin(student.name, student.team) }}
            className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 disabled:pointer-events-none disabled:opacity-40 sm:text-2xl"
          >
            Masuk ke Kantin 🍽️
          </button>
        </div>
      </main>
    </div>
  )
}

/* ─── ROLE SELECTION ─── */
function RoleSelectScreen({ player, teamId, onSelect, onExit }) {
  const [selectedRole, setSelectedRole] = useState(null)

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-amber-200 via-orange-100 to-yellow-200">
      <TopBar onExit={onExit} right={<TeamBadge teamId={teamId} compact />} />
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6">
        <div className="animate-pop-in flex w-full max-w-3xl flex-col items-center gap-4 rounded-3xl bg-white/95 p-5 shadow-lg sm:p-8">
          <h2 className="text-[clamp(1.25rem,4vw,2rem)] font-extrabold text-slate-700">
            {player}, Pilih <span className="text-amber-600">Peran</span> Digital
          </h2>
          <p className="text-xs font-bold text-slate-500 sm:text-sm">Setiap PC menampilkan antarmuka yang berbeda sesuai tugasmu.</p>

          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {ROLES.map(role => {
              const s = ROLE_STYLE[role.id]
              const isSelected = selectedRole === role.id
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => { sndClick(); setSelectedRole(role.id) }}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-3 text-center transition sm:p-4 ${isSelected ? `${s.border} ${s.bg} ring-2 ring-offset-2 ${s.border} scale-[1.03] shadow-lg` : 'border-slate-200 bg-white hover:scale-[1.02]'}`}
                >
                  <span className="text-3xl sm:text-4xl" aria-hidden="true">{role.icon}</span>
                  <p className={`text-sm font-extrabold sm:text-base ${isSelected ? s.text : 'text-slate-700'}`}>{role.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 sm:text-xs">{role.module}</p>
                  <p className="text-[10px] font-bold text-slate-500 sm:text-xs">{role.desc}</p>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            disabled={!selectedRole}
            onClick={() => { sndClick(); onSelect(selectedRole) }}
            className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 disabled:pointer-events-none disabled:opacity-40 sm:text-2xl"
          >
            Mulai Misi 🚀
          </button>
        </div>
      </main>
    </div>
  )
}

/* ─── PHASE 1: BRIEFING ─── */
function BriefingScreen({ player, teamId, role, timer, onReady, onExit }) {
  const roleData = ROLES.find(r => r.id === role)
  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-amber-200 via-orange-100 to-yellow-200">
      <TopBar onExit={onExit} right={<Timer seconds={timer} phase="Briefing" />} />
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6">
        <div className="animate-pop-in flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl bg-white/95 p-5 shadow-lg sm:p-8">
          <span className="text-5xl sm:text-6xl" aria-hidden="true">📋</span>
          <h2 className="text-[clamp(1.25rem,4vw,2rem)] font-extrabold text-slate-700">Mission Briefing</h2>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <TeamBadge teamId={teamId} compact />
            <RoleBadge roleId={role} compact />
          </div>

          <div className="w-full rounded-2xl bg-amber-50 p-4 text-left">
            <p className="text-sm font-bold text-amber-800 sm:text-base">
              ⏰ <b>FASE 1: LOGIN & BRIEFING</b> — Tim kamu terdiri dari 5 orang dengan peran berbeda. Siapkan diri untuk membangun sistem kantin otomatis!
            </p>
          </div>

          <div className="w-full rounded-2xl bg-slate-900 p-4 text-left text-sm text-slate-300 sm:text-base">
            <p className="mb-2 font-extrabold uppercase tracking-wide text-amber-400">{player} · {roleData.name}</p>
            <p><span className="text-slate-500">Modul:</span> <span className="font-bold text-amber-300">{roleData.module}</span></p>
            <p className="mt-2"><span className="text-slate-500">Tugas:</span> <span className="font-bold text-white">{roleData.desc}</span></p>
          </div>

          <div className="w-full rounded-2xl bg-amber-50 p-4 text-left">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-amber-600 sm:text-sm">Alur Permainan</p>
            <ol className="space-y-1 text-xs font-bold text-slate-600 sm:text-sm">
              <li>1️⃣ <b>FASE 1</b> — Briefing & Pemilihan Peran (5 menit)</li>
              <li>2️⃣ <b>FASE 2</b> — Pengembangan Paralel (20 menit)</li>
              <li>3️⃣ <b>FASE 3</b> — Build & Integrasi (3 menit)</li>
              <li>4️⃣ <b>FASE 4</b> — Stress-Test & Debugging (15 menit)</li>
              <li>5️⃣ <b>FASE 5</b> — Leaderboard & Evaluasi</li>
            </ol>
          </div>

          <button
            type="button"
            onClick={() => { sndClick(); onReady() }}
            className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl"
          >
            Siap Bekerja! 💪
          </button>
        </div>
      </main>
    </div>
  )
}

/* ─── ANALYST PANEL ─── */
function AnalystPanel({ data, onChange, locked }) {
  const [problems, setProblems] = useState(data?.problems || PROBLEMS_TEMPLATE.map(p => ({ ...p, impact: '', solution: '' })))
  const [metrics, setMetrics] = useState(data?.metrics || OBJECTIVE_METRICS.map(m => ({ ...m, value: '' })))
  const [saved, setSaved] = useState(!!data?.problems)
  const [errors, setErrors] = useState([])

  function validate() {
    const errs = []
    problems.forEach((p, i) => {
      if (!p.impact.trim()) errs.push(`Masalah #${i + 1}: Dampak belum diisi`)
      if (!p.solution.trim()) errs.push(`Masalah #${i + 1}: Solusi belum diisi`)
    })
    metrics.forEach((m) => {
      if (!m.value || Number(m.value) <= 0) errs.push(`Metrik "${m.label}" belum diisi`)
    })
    return errs
  }

  function handleSave() {
    const errs = validate()
    setErrors(errs)
    if (errs.length === 0) {
      sndCorrect()
      setSaved(true)
      onChange({ problems, metrics, validated: true })
    } else {
      sndError()
      setSaved(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Mission Brief */}
      <div className="rounded-2xl bg-sky-100 p-3 sm:p-4">
        <p className="mb-1 text-sm font-extrabold text-sky-800 sm:text-base">🎯 Misi Kamu: Analisis Masalah Kantin</p>
        <p className="text-xs font-bold text-sky-600 sm:text-sm">
          Sebagai <b>System Analyst</b>, tugasmu adalah mengidentifikasi masalah utama kantin dan menentukan target kinerja sistem.
        </p>
        <ol className="mt-2 space-y-1 text-xs font-bold text-slate-600 sm:text-sm">
          <li>1️⃣ <b>Isi 3 masalah utama</b> — Tuliskan dampak dan solusi untuk setiap masalah.</li>
          <li>2️⃣ <b>Tentukan metrik target</b> — Berapa detik per siswa? Berapa persen akurasi?</li>
          <li>3️⃣ <b>Simpan jawabanmu</b> — Tekan tombol "Simpan" setelah selesai.</li>
        </ol>
      </div>

      {/* Step 1: Problems */}
      <div className="rounded-2xl bg-sky-50 p-3 sm:p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-xs font-extrabold text-white">1</span>
          <p className="text-xs font-extrabold uppercase tracking-wide text-sky-600 sm:text-sm">Isi 3 Masalah Utama Kantin</p>
        </div>
        {problems.map((p, i) => {
          const impactOk = p.impact.trim().length > 0
          const solutionOk = p.solution.trim().length > 0
          return (
            <div key={p.id} className="mb-3 rounded-xl border border-sky-200 bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-extrabold text-sky-700">Masalah #{i + 1}: {p.problem}</p>
                {impactOk && solutionOk && <span className="text-sm text-green-500">✅</span>}
              </div>
              <label className="mb-2 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500">Dampak <span className="text-red-400">*</span></span>
                <input
                  type="text" value={p.impact} disabled={locked}
                  onChange={(e) => { const n = [...problems]; n[i] = { ...n[i], impact: e.target.value }; setProblems(n); setSaved(false) }}
                  placeholder="Contoh: Siswa antre > 10 menit, waktu istirahat habis"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-sky-400 disabled:bg-slate-50"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500">Solusi <span className="text-red-400">*</span></span>
                <input
                  type="text" value={p.solution} disabled={locked}
                  onChange={(e) => { const n = [...problems]; n[i] = { ...n[i], solution: e.target.value }; setProblems(n); setSaved(false) }}
                  placeholder="Contoh: Sistem antrean berbasis kategori (Express, Berat, Minuman)"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-sky-400 disabled:bg-slate-50"
                />
              </label>
            </div>
          )
        })}
      </div>

      {/* Step 2: Metrics */}
      <div className="rounded-2xl bg-sky-50 p-3 sm:p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-xs font-extrabold text-white">2</span>
          <p className="text-xs font-extrabold uppercase tracking-wide text-sky-600 sm:text-sm">Tentukan Metrik Target</p>
        </div>
        <p className="mb-3 text-[10px] font-bold text-slate-500 sm:text-xs">Target ini menjadi acuan apakah sistem kantin sudah berhasil.</p>
        {metrics.map((m, i) => {
          const ok = m.value && Number(m.value) > 0
          return (
            <div key={m.id} className="mb-2 flex items-center gap-2">
              <span className="min-w-[120px] text-xs font-bold text-slate-600">{m.label} <span className="text-red-400">*</span></span>
              <input
                type="number" value={m.value || ''} disabled={locked}
                onChange={(e) => { const n = [...metrics]; n[i] = { ...n[i], value: e.target.value }; setMetrics(n); setSaved(false) }}
                placeholder={`Target: ${m.target} ${m.unit}`}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-bold text-slate-700 outline-none disabled:bg-slate-50 ${ok ? 'border-green-300 bg-green-50' : 'border-slate-200 focus:border-sky-400'}`}
              />
              <span className="text-[10px] font-bold text-slate-400">{m.unit}</span>
              {ok && <span className="text-sm text-green-500">✅</span>}
            </div>
          )
        })}
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-3">
          <p className="mb-1 text-xs font-extrabold text-red-600">⚠️ Masalah yang perlu diperbaiki:</p>
          {errors.map((err, i) => (
            <p key={i} className="text-[10px] font-bold text-red-500">• {err}</p>
          ))}
        </div>
      )}

      {/* Save Button */}
      <button
        type="button" disabled={locked}
        onClick={handleSave}
        className={`w-full rounded-full px-6 py-3 text-lg font-extrabold text-white shadow-lg transition hover:scale-105 ${saved ? 'bg-green-500' : 'bg-gradient-to-r from-sky-500 to-blue-600'}`}
      >
        {saved ? '✅ Tersimpan — Edit Lagi?' : '💾 Simpan Jawaban'}
      </button>
    </div>
  )
}

/* ─── STRATEGIST PANEL ─── */
function StrategistPanel({ data, onChange, locked }) {
  const [activeCategories, setActiveCategories] = useState(data?.activeCategories || ['express', 'berat', 'minuman', 'snack'])
  const [activeVars, setActiveVars] = useState(data?.activeVars || ['itemName', 'paymentMethod', 'amount'])
  const [ignoredVars, setIgnoredVars] = useState(data?.ignoredVars || ['studentName', 'queuePosition', 'prepTime', 'stockLevel'])
  const [saved, setSaved] = useState(!!data?.activeCategories)
  const [errors, setErrors] = useState([])

  const allVars = [
    { id: 'itemName', label: 'Nama Item', desc: 'Apa yang dipesan (Nasi Goreng, Es Teh, dll)', important: true },
    { id: 'itemCategory', label: 'Kategori Item', desc: 'Jenis: berat, minuman, atau snack', important: false },
    { id: 'paymentMethod', label: 'Metode Bayar', desc: 'Tunai, Uang Pas, atau Transfer', important: true },
    { id: 'amount', label: 'Jumlah Uang', desc: 'Berapa uang yang dibawa siswa', important: true },
    { id: 'prepTime', label: 'Waktu Siap', desc: 'Berapa lama makanan disiapkan (detik)', important: false },
    { id: 'stockLevel', label: 'Stok Tersisa', desc: 'Sisa makanan di kantin', important: false },
    { id: 'studentName', label: 'Nama Siswa', desc: 'Siapa yang memesan', important: false },
    { id: 'queuePosition', label: 'Posisi Antrean', desc: 'Urutan siswa di antrean', important: false },
  ]

  function validate() {
    const errs = []
    if (activeCategories.length < 2) errs.push('Minimal 2 kategori antrean harus aktif')
    if (activeVars.length < 3) errs.push('Minimal 3 variabel harus aktif')
    return errs
  }

  function handleSave() {
    const errs = validate()
    setErrors(errs)
    if (errs.length === 0) {
      sndCorrect()
      setSaved(true)
      onChange({ activeCategories, activeVars, ignoredVars, validated: true })
    } else {
      sndError()
      setSaved(false)
    }
  }

  function toggleCategory(catId) {
    sndClick()
    setActiveCategories(prev => prev.includes(catId) ? prev.filter(x => x !== catId) : [...prev, catId])
    setSaved(false)
  }

  function moveVarToActive(varId) {
    sndClick()
    setIgnoredVars(prev => prev.filter(x => x !== varId))
    if (!activeVars.includes(varId)) setActiveVars(prev => [...prev, varId])
    setSaved(false)
  }

  function moveVarToIgnored(varId) {
    sndClick()
    setActiveVars(prev => prev.filter(x => x !== varId))
    if (!ignoredVars.includes(varId)) setIgnoredVars(prev => [...prev, varId])
    setSaved(false)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Mission Brief */}
      <div className="rounded-2xl bg-purple-100 p-3 sm:p-4">
        <p className="mb-1 text-sm font-extrabold text-purple-800 sm:text-base">🎯 Misi Kamu: Konfigurasi Aturan Kantin</p>
        <p className="text-xs font-bold text-purple-600 sm:text-sm">
          Sebagai <b>Solution Strategist</b>, tugasmu adalah menentukan <b>aturan main</b> untuk sistem kantin.
        </p>
        <ol className="mt-2 space-y-1 text-xs font-bold text-slate-600 sm:text-sm">
          <li>1️⃣ <b>Pilih kategori antrean</b> — Aktifkan kategori yang ingin dilayani sistem.</li>
          <li>2️⃣ <b>Atur variabel</b> — Pilih data apa yang perlu diproses, mana yang diabaikan.</li>
          <li>3️⃣ <b>Simpan jawabanmu</b> — Tekan tombol "Simpan" setelah selesai.</li>
        </ol>
      </div>

      {/* Step 1: Queue Categories */}
      <div className="rounded-2xl bg-purple-50 p-3 sm:p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-xs font-extrabold text-white">1</span>
          <p className="text-xs font-extrabold uppercase tracking-wide text-purple-600 sm:text-sm">Atur Kategori Antrean</p>
        </div>
        <p className="mb-3 text-[10px] font-bold text-slate-500 sm:text-xs">
          Klik untuk menyalakan/mematikan. Sistem hanya melayani kategori yang <b>aktif</b>.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {QUEUE_CATEGORIES.map(cat => {
            const isActive = activeCategories.includes(cat.id)
            return (
              <button
                key={cat.id} type="button" disabled={locked}
                onClick={() => toggleCategory(cat.id)}
                className={`flex items-center gap-2 rounded-xl border-2 p-2.5 text-left transition sm:p-3 ${isActive ? `border-${cat.color}-400 bg-${cat.color}-50 shadow-sm` : 'border-slate-200 bg-white opacity-50'}`}
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded-full ${isActive ? `bg-${cat.color}-500` : 'bg-slate-300'}`}>
                  <span className="text-[10px] font-extrabold text-white">{isActive ? '✓' : '✕'}</span>
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-700">{cat.name}</p>
                  <p className="text-[10px] font-bold text-slate-400">{cat.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step 2: Variables */}
      <div className="rounded-2xl bg-purple-50 p-3 sm:p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-xs font-extrabold text-white">2</span>
          <p className="text-xs font-extrabold uppercase tracking-wide text-purple-600 sm:text-sm">Pilih Variabel yang Diproses</p>
        </div>
        <p className="mb-3 text-[10px] font-bold text-slate-500 sm:text-xs">
          <b>Aktif</b> = data yang dibaca sistem. <b>Diacuhkan</b> = diabaikan.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-2 border-green-300 bg-green-50 p-2.5">
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wide text-green-600 sm:text-xs">✅ Aktif ({activeVars.length})</p>
            <div className="space-y-1.5">
              {activeVars.map(v => {
                const vData = allVars.find(x => x.id === v)
                return (
                  <div key={v} className="flex items-center justify-between rounded-lg bg-white p-2">
                    <div>
                      <p className="text-xs font-extrabold text-slate-700">{vData?.label || v}</p>
                      <p className="text-[9px] font-bold text-slate-400">{vData?.desc}</p>
                    </div>
                    <button type="button" disabled={locked} onClick={() => moveVarToIgnored(v)}
                      className="shrink-0 rounded-full bg-red-100 px-2 py-1 text-[10px] font-extrabold text-red-600 hover:bg-red-200 disabled:opacity-50">
                      Matikan
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-2.5">
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wide text-slate-500 sm:text-xs">🚫 Diacuhkan ({ignoredVars.length})</p>
            <div className="space-y-1.5">
              {ignoredVars.map(v => {
                const vData = allVars.find(x => x.id === v)
                return (
                  <div key={v} className="flex items-center justify-between rounded-lg bg-white p-2 opacity-60">
                    <div>
                      <p className="text-xs font-extrabold text-slate-600">{vData?.label || v}</p>
                      <p className="text-[9px] font-bold text-slate-400">{vData?.desc}</p>
                    </div>
                    <button type="button" disabled={locked} onClick={() => moveVarToActive(v)}
                      className="shrink-0 rounded-full bg-green-100 px-2 py-1 text-[10px] font-extrabold text-green-600 hover:bg-green-200 disabled:opacity-50">
                      Aktifkan
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-3">
          <p className="mb-1 text-xs font-extrabold text-red-600">⚠️ Masalah yang perlu diperbaiki:</p>
          {errors.map((err, i) => (
            <p key={i} className="text-[10px] font-bold text-red-500">• {err}</p>
          ))}
        </div>
      )}

      {/* Save Button */}
      <button
        type="button" disabled={locked}
        onClick={handleSave}
        className={`w-full rounded-full px-6 py-3 text-lg font-extrabold text-white shadow-lg transition hover:scale-105 ${saved ? 'bg-green-500' : 'bg-gradient-to-r from-purple-500 to-violet-600'}`}
      >
        {saved ? '✅ Tersimpan — Edit Lagi?' : '💾 Simpan Jawaban'}
      </button>
    </div>
  )
}

/* ─── ALGORIST PANEL (FLOWCHART) ─── */
function AlgoristPanel({ data, onChange, locked }) {
  const [nodes, setNodes] = useState(data?.nodes || DEFAULT_FLOWCHART_NODES)
  const [connections, setConnections] = useState(data?.connections || DEFAULT_FLOWCHART_CONNECTIONS)
  const [selectedNode, setSelectedNode] = useState(null)
  const [saved, setSaved] = useState(!!data?.nodes)
  const [errors, setErrors] = useState([])
  const canvasRef = useRef(null)

  function validate() {
    const errs = []
    const hasStart = nodes.some(n => n.type === 'start')
    const hasEnd = nodes.some(n => n.type === 'end')
    if (!hasStart) errs.push('Flowchart harus punya blok START')
    if (!hasEnd) errs.push('Flowchart harus punya blok FINISH')
    if (connections.length === 0) errs.push('Minimal ada 1 hubungan antar blok')
    return errs
  }

  function handleSave() {
    const errs = validate()
    setErrors(errs)
    if (errs.length === 0) {
      sndCorrect()
      setSaved(true)
      onChange({ nodes, connections, validated: true })
    } else {
      sndError()
      setSaved(false)
    }
  }

  function addNode(type) {
    const id = `node-${Date.now()}`
    const labels = { process: 'Proses Baru', decision: 'Kondisi?', output: 'Output', start: 'START', end: 'FINISH' }
    const maxY = Math.max(...nodes.map(n => n.y), 0)
    setNodes(prev => [...prev, { id, type, label: labels[type], x: 50, y: maxY + 60 }])
    setSaved(false)
  }

  function updateNodeLabel(id, label) {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, label } : n))
    setSaved(false)
  }

  function removeNode(id) {
    setNodes(prev => prev.filter(n => n.id !== id))
    setConnections(prev => prev.filter(c => c.from !== id && c.to !== id))
    if (selectedNode === id) setSelectedNode(null)
    setSaved(false)
  }

  function addConnection() {
    if (!selectedNode) return
    const targets = nodes.filter(n => n.id !== selectedNode)
    if (targets.length === 0) return
    const lastNode = nodes.find(n => n.id === selectedNode)
    const closest = targets.reduce((best, n) => {
      const dy = n.y - lastNode.y
      return dy > 0 && dy < (best?.y - lastNode.y || Infinity) ? n : best
    }, null)
    if (closest && !connections.find(c => c.from === selectedNode && c.to === closest.id)) {
      setConnections(prev => [...prev, { from: selectedNode, to: closest.id, label: '' }])
      setSaved(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Mission Brief */}
      <div className="rounded-2xl bg-emerald-100 p-3 sm:p-4">
        <p className="mb-1 text-sm font-extrabold text-emerald-800 sm:text-base">🎯 Misi Kamu: Susun Flowchart Logika</p>
        <p className="text-xs font-extrabold text-emerald-600 sm:text-sm">
          Sebagai <b>Lead Algorist</b>, tugamu adalah menyusun <b>bagan alir (flowchart)</b> yang menjadi mesin eksekusi sistem kantin.
        </p>
        <ol className="mt-2 space-y-1 text-xs font-bold text-slate-600 sm:text-sm">
          <li>1️⃣ <b>Tambah blok</b> — Klik tombol "+ Proses", "+ Kondisi (IF)", atau "+ Output".</li>
          <li>2️⃣ <b>Hubungkan blok</b> — Klik blok lalu klik "+ Hubungkan" untuk menyambung.</li>
          <li>3️⃣ <b>Edit label</b> — Klik blok untuk mengubah teksnya.</li>
          <li>4️⃣ <b>Simpan</b> — Tekan tombol "Simpan" setelah flowchart selesai.</li>
        </ol>
      </div>

      {/* Flowchart Editor */}
      <div className="rounded-2xl bg-emerald-50 p-3 sm:p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-extrabold text-white">1</span>
          <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-600 sm:text-sm">Flowchart Editor — Core Engine</p>
        </div>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {['process', 'decision', 'output'].map(type => (
            <button key={type} type="button" disabled={locked} onClick={() => { sndClick(); addNode(type) }}
              className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-extrabold text-white transition hover:scale-105 disabled:opacity-50">
              + {type === 'process' ? 'Proses' : type === 'decision' ? 'Kondisi (IF)' : 'Output'}
            </button>
          ))}
          <button type="button" disabled={locked || !selectedNode} onClick={() => { sndClick(); addConnection() }}
            className="rounded-full bg-sky-500 px-3 py-1.5 text-xs font-extrabold text-white transition hover:scale-105 disabled:opacity-50">
            + Hubungkan
          </button>
        </div>

        <div ref={canvasRef} className="relative min-h-[300px] rounded-xl border-2 border-dashed border-emerald-300 bg-white p-2">
          {nodes.map(node => {
            const isSelected = selectedNode === node.id
            const isDecision = node.type === 'decision'
            return (
              <div
                key={node.id}
                onClick={() => { sndClick(); setSelectedNode(node.id) }}
                className={`absolute left-1/2 flex -translate-x-1/2 cursor-pointer items-center justify-center rounded-lg border-2 px-3 py-2 text-[10px] font-extrabold transition sm:text-xs ${
                  isSelected ? 'border-emerald-500 bg-emerald-100 shadow-lg scale-110 z-10' :
                  isDecision ? 'border-amber-400 bg-amber-50 rotate-0' :
                  node.type === 'start' || node.type === 'end' ? 'border-emerald-400 bg-emerald-50 rounded-full' :
                  'border-slate-300 bg-white'
                }`}
                style={{ top: `${node.y}px` }}
              >
                {node.type === 'decision' && <span className="mr-1">◇</span>}
                {node.label}
                {isSelected && !locked && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); removeNode(node.id) }}
                    className="ml-2 rounded-full bg-red-400 px-1.5 py-0.5 text-[8px] text-white hover:bg-red-500">✕</button>
                )}
              </div>
            )
          })}

          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {connections.map((conn, i) => {
              const from = nodes.find(n => n.id === conn.from)
              const to = nodes.find(n => n.id === conn.to)
              if (!from || !to) return null
              return (
                <g key={i}>
                  <line x1="50%" y1={from.y + 20} x2="50%" y2={to.y} stroke="#10b981" strokeWidth="2" strokeDasharray={conn.label ? '' : '4'} />
                  {conn.label && (
                    <text x="52%" y={(from.y + 20 + to.y) / 2} fill="#6b7280" fontSize="10" fontWeight="bold">{conn.label}</text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {selectedNode && (
          <div className="mt-2 rounded-xl border border-emerald-200 bg-white p-2">
            <p className="mb-1 text-[10px] font-extrabold text-emerald-600">Edit Node Label:</p>
            <input
              type="text"
              value={nodes.find(n => n.id === selectedNode)?.label || ''}
              onChange={(e) => updateNodeLabel(selectedNode, e.target.value)}
              disabled={locked}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-emerald-400 disabled:bg-slate-50"
            />
          </div>
        )}

        <p className="mt-2 text-[10px] font-bold text-emerald-600 sm:text-xs">
          💡 Tips: Flowchart harus punya START dan FINISH. Kondisi (IF) punya 2 jalur: YA dan TIDAK.
        </p>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-3">
          <p className="mb-1 text-xs font-extrabold text-red-600">⚠️ Masalah yang perlu diperbaiki:</p>
          {errors.map((err, i) => (
            <p key={i} className="text-[10px] font-bold text-red-500">• {err}</p>
          ))}
        </div>
      )}

      {/* Save Button */}
      <button
        type="button" disabled={locked}
        onClick={handleSave}
        className={`w-full rounded-full px-6 py-3 text-lg font-extrabold text-white shadow-lg transition hover:scale-105 ${saved ? 'bg-green-500' : 'bg-gradient-to-r from-emerald-500 to-green-600'}`}
      >
        {saved ? '✅ Tersimpan — Edit Lagi?' : '💾 Simpan Jawaban'}
      </button>
    </div>
  )
}

/* ─── SIMULATOR PANEL ─── */
function SimulatorPanel({ data, onChange }) {
  const [menuItems, setMenuItems] = useState(data?.menuItems || MENU_ITEMS)
  const [presets, setPresets] = useState(data?.presets || CUSTOMER_PRESETS)
  const [saved, setSaved] = useState(!!data?.menuItems)
  const [errors, setErrors] = useState([])

  function validate() {
    const errs = []
    menuItems.forEach(item => {
      if (item.price <= 0) errs.push(`"${item.name}" harga harus lebih dari 0`)
      if (item.stock <= 0) errs.push(`"${item.name}" stok harus lebih dari 0`)
    })
    if (presets.length === 0) errs.push('Minimal ada 1 preset pelanggan')
    return errs
  }

  function handleSave() {
    const errs = validate()
    setErrors(errs)
    if (errs.length === 0) {
      sndCorrect()
      setSaved(true)
      onChange({ menuItems, presets, validated: true })
    } else {
      sndError()
      setSaved(false)
    }
  }

  function updateMenuItem(id, field, value) {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item))
    setSaved(false)
  }

  function addMenuItem() {
    const id = `item-${Date.now()}`
    setMenuItems(prev => [...prev, { id, name: 'Menu Baru', price: 0, prepTime: 10, category: 'snack', stock: 0 }])
    setSaved(false)
  }

  function removeMenuItem(id) {
    setMenuItems(prev => prev.filter(item => item.id !== id))
    setSaved(false)
  }

  function addPreset() {
    const id = `c-${Date.now()}`
    setPresets(prev => [...prev, { id, name: 'Siswa Baru', items: [], payment: 'tunai', amount: 0, desc: 'Preset baru' }])
    setSaved(false)
  }

  function removePreset(id) {
    setPresets(prev => prev.filter(p => p.id !== id))
    setSaved(false)
  }

  function updatePreset(id, field, value) {
    setPresets(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
    setSaved(false)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Mission Brief */}
      <div className="rounded-2xl bg-orange-100 p-3 sm:p-4">
        <p className="mb-1 text-sm font-extrabold text-orange-800 sm:text-base">🎯 Misi Kamu: Rancang Menu & Data Kantin</p>
        <p className="text-xs font-bold text-orange-600 sm:text-sm">
          Sebagai <b>Interface & Data Simulator</b>, tugamu adalah merancang <b>menu makanan</b> dan <b>data pelanggan</b> untuk simulasi.
        </p>
        <ol className="mt-2 space-y-1 text-xs font-bold text-slate-600 sm:text-sm">
          <li>1️⃣ <b>Periksa daftar menu</b> — Pastikan semua item punya harga dan stok.</li>
          <li>2️⃣ <b>Periksa preset pelanggan</b> — Pastikan ada data siswa untuk simulasi.</li>
          <li>3️⃣ <b>Simpan</b> — Tekan tombol "Simpan" jika data sudah benar.</li>
        </ol>
      </div>

      {/* Menu Items */}
      <div className="rounded-2xl bg-orange-50 p-3 sm:p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-extrabold text-white">1</span>
          <p className="text-xs font-extrabold uppercase tracking-wide text-orange-600 sm:text-sm">Daftar Menu Kantin</p>
        </div>
        <p className="mb-3 text-[10px] font-bold text-slate-500 sm:text-xs">Edit harga dan stok setiap item. Data ini akan digunakan oleh sistem saat memproses pesanan.</p>
        <div className="space-y-2">
          {menuItems.map(item => {
            const ok = item.price > 0 && item.stock > 0
            return (
              <div key={item.id} className={`rounded-xl border-2 p-3 ${ok ? 'border-green-200 bg-white' : 'border-red-200 bg-red-50'}`}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-extrabold text-slate-700">{item.name}</p>
                    {ok ? <span className="text-xs text-green-500">✅</span> : <span className="text-xs text-red-500">⚠️</span>}
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${item.category === 'berat' ? 'bg-amber-100 text-amber-700' : item.category === 'minuman' ? 'bg-sky-100 text-sky-700' : 'bg-purple-100 text-purple-700'}`}>
                    {item.category}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-slate-400">Harga (Rp)</span>
                    <input type="number" value={item.price}
                      onChange={(e) => updateMenuItem(item.id, 'price', Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-orange-400"
                    />
                  </label>
                  <label className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-slate-400">Stok</span>
                    <input type="number" value={item.stock}
                      onChange={(e) => updateMenuItem(item.id, 'stock', Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-orange-400"
                    />
                  </label>
                </div>
                <button type="button" onClick={() => { sndClick(); removeMenuItem(item.id) }}
                  className="mt-1 text-[9px] font-bold text-red-400 hover:text-red-600">✕ Hapus</button>
              </div>
            )
          })}
        </div>
        <button type="button" onClick={() => { sndClick(); addMenuItem() }}
          className="mt-2 w-full rounded-full border-2 border-dashed border-orange-300 bg-white px-4 py-2 text-xs font-extrabold text-orange-500 transition hover:bg-orange-50">
          + Tambah Menu Baru
        </button>
      </div>

      {/* Customer Presets */}
      <div className="rounded-2xl bg-orange-50 p-3 sm:p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-extrabold text-white">2</span>
          <p className="text-xs font-extrabold uppercase tracking-wide text-orange-600 sm:text-sm">Preset Pelanggan</p>
        </div>
        <p className="mb-3 text-[10px] font-bold text-slate-500 sm:text-xs">Edit data siswa untuk simulasi. Data ini menjadi dummy pelanggan saat simulasi berjalan.</p>
        <div className="space-y-2">
          {presets.map(p => (
            <div key={p.id} className="rounded-xl border-2 border-orange-200 bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <input type="text" value={p.name}
                  onChange={(e) => updatePreset(p.id, 'name', e.target.value)}
                  className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-xs font-extrabold text-slate-700 outline-none focus:border-orange-400"
                />
                <select value={p.payment}
                  onChange={(e) => updatePreset(p.id, 'payment', e.target.value)}
                  className="rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-600 outline-none focus:border-orange-400"
                >
                  <option value="tunai">💵 Tunai</option>
                  <option value="pas">💰 Uang Pas</option>
                  <option value="transfer">📱 Transfer</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold text-slate-400">Uang Dibawa (Rp)</span>
                  <input type="number" value={p.amount}
                    onChange={(e) => updatePreset(p.id, 'amount', Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700 outline-none focus:border-orange-400"
                  />
                </label>
                <label className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold text-slate-400">Keterangan</span>
                  <input type="text" value={p.desc}
                    onChange={(e) => updatePreset(p.id, 'desc', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700 outline-none focus:border-orange-400"
                  />
                </label>
              </div>
              <button type="button" onClick={() => { sndClick(); removePreset(p.id) }}
                className="mt-1 text-[9px] font-bold text-red-400 hover:text-red-600">✕ Hapus</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => { sndClick(); addPreset() }}
          className="mt-2 w-full rounded-full border-2 border-dashed border-orange-300 bg-white px-4 py-2 text-xs font-extrabold text-orange-500 transition hover:bg-orange-50">
          + Tambah Preset Baru
        </button>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-3">
          <p className="mb-1 text-xs font-extrabold text-red-600">⚠️ Masalah yang perlu diperbaiki:</p>
          {errors.map((err, i) => (
            <p key={i} className="text-[10px] font-bold text-red-500">• {err}</p>
          ))}
        </div>
      )}

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        className={`w-full rounded-full px-6 py-3 text-lg font-extrabold text-white shadow-lg transition hover:scale-105 ${saved ? 'bg-green-500' : 'bg-gradient-to-r from-orange-500 to-amber-600'}`}
      >
        {saved ? '✅ Tersimpan — Edit Lagi?' : '💾 Simpan Jawaban'}
      </button>
    </div>
  )
}

/* ─── QA PANEL ─── */
function QAPanel({ data, onChange, teamId, locked }) {
  const [scripts, setScripts] = useState(data?.scripts || TEST_SCRIPTS.map(s => ({ ...s, enabled: true })))
  const [saved, setSaved] = useState(!!data?.scripts)
  const [errors, setErrors] = useState([])
  const opponentTeam = teamId === 'A' ? 'B' : 'A'

  function validate() {
    const errs = []
    const enabledCount = scripts.filter(s => s.enabled).length
    if (enabledCount < 5) errs.push(`Minimal 5 test script aktif (sekarang: ${enabledCount})`)
    return errs
  }

  function handleSave() {
    const errs = validate()
    setErrors(errs)
    if (errs.length === 0) {
      sndCorrect()
      setSaved(true)
      onChange({ scripts, validated: true })
    } else {
      sndError()
      setSaved(false)
    }
  }

  function toggleScript(id) {
    setScripts(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))
    setSaved(false)
  }

  const enabledCount = scripts.filter(s => s.enabled).length

  return (
    <div className="flex flex-col gap-3">
      {/* Mission Brief */}
      <div className="rounded-2xl bg-red-100 p-3 sm:p-4">
        <p className="mb-1 text-sm font-extrabold text-red-800 sm:text-base">🎯 Misi Kamu: Siapkan Serangan Stress-Test</p>
        <p className="text-xs font-bold text-red-600 sm:text-sm">
          Sebagai <b>Test Evaluator / QA</b>, tugamu adalah menyiapkan <b>10 skenario kacau</b> untuk menyerang sistem <b>{TEAMS[opponentTeam].name}</b>.
        </p>
        <ol className="mt-2 space-y-1 text-xs font-bold text-slate-600 sm:text-sm">
          <li>1️⃣ <b>Pilih test script</b> — Aktifkan minimal 5 skenario yang ingin dikirim.</li>
          <li>2️⃣ <b>Periksa jenis skenario</b> — Ada edge-case, stress, dan bug.</li>
          <li>3️⃣ <b>Simpan</b> — Tekan tombol "Simpan" untuk mengunci pilihanmu.</li>
        </ol>
      </div>

      {/* Test Scripts */}
      <div className="rounded-2xl bg-red-50 p-3 sm:p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-extrabold text-white">1</span>
          <p className="text-xs font-extrabold uppercase tracking-wide text-red-600 sm:text-sm">Pilih Test Script Aktif</p>
        </div>

        <ProgressBar current={enabledCount} total={10} label="Test Scripts Aktif" color="red" />
        {enabledCount < 5 && (
          <p className="mt-1 text-[10px] font-bold text-red-500">⚠️ Minimal 5 script harus aktif</p>
        )}

        <div className="mt-3 space-y-2">
          {scripts.map((script, i) => (
            <div key={script.id} className={`rounded-xl border-2 p-2.5 transition sm:p-3 ${script.enabled ? 'border-red-300 bg-red-100' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-700">#{i + 1}</span>
                    <span className="text-xs font-extrabold text-red-700">{script.name}</span>
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold ${script.type === 'edge-case' ? 'bg-amber-100 text-amber-700' : script.type === 'stress' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                      {script.type}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] font-bold text-slate-500 sm:text-xs">{script.desc}</p>
                </div>
                <button
                  type="button" disabled={locked}
                  onClick={() => { sndClick(); toggleScript(script.id) }}
                  className={`rounded-full px-3 py-1.5 text-xs font-extrabold transition ${script.enabled ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-500'} disabled:opacity-50`}
                >
                  {script.enabled ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-3">
          <p className="mb-1 text-xs font-extrabold text-red-600">⚠️ Masalah yang perlu diperbaiki:</p>
          {errors.map((err, i) => (
            <p key={i} className="text-[10px] font-bold text-red-500">• {err}</p>
          ))}
        </div>
      )}

      {/* Save Button */}
      <button
        type="button" disabled={locked}
        onClick={handleSave}
        className={`w-full rounded-full px-6 py-3 text-lg font-extrabold text-white shadow-lg transition hover:scale-105 ${saved ? 'bg-green-500' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}
      >
        {saved ? '✅ Tersimpan — Edit Lagi?' : '💾 Simpan Jawaban'}
      </button>
    </div>
  )
}

/* ─── PHASE 2: DEVELOPMENT ─── */
function DevelopmentScreen({ player, teamId, role, store, onUpdate, timer, onExit }) {
  const teamData = store.teams[teamId]
  const rolePanel = {
    analyst: <AnalystPanel data={teamData.requirements} onChange={(d) => onUpdate(teamId, 'requirements', d)} locked={false} />,
    strategist: <StrategistPanel data={teamData.rules} onChange={(d) => onUpdate(teamId, 'rules', d)} locked={false} />,
    algorist: <AlgoristPanel data={teamData.flowchart} onChange={(d) => onUpdate(teamId, 'flowchart', d)} locked={false} />,
    simulator: <SimulatorPanel data={{ menuItems: teamData.menu?.items, presets: teamData.menu?.presets }} onChange={(d) => onUpdate(teamId, 'menu', d)} locked={false} />,
    qa: <QAPanel data={{ scripts: teamData.testScripts }} onChange={(d) => onUpdate(teamId, 'testScripts', d.scripts)} teamId={teamId} locked={false} />,
  }

  const memberCount = Object.keys(teamData.members).length
  const allRoles = ['analyst', 'strategist', 'algorist', 'simulator', 'qa']

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-amber-200 via-orange-100 to-yellow-200">
      <TopBar onExit={onExit} right={<Timer seconds={timer} phase="Pengembangan" />} title={`${TEAMS[teamId].emoji} ${TEAMS[teamId].name}`} />
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center gap-3 overflow-y-auto px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <TeamBadge teamId={teamId} compact />
          <RoleBadge roleId={role} compact />
          <span className="text-xs font-bold text-slate-500">· {player}</span>
        </div>

        <ProgressBar current={memberCount} total={5} label="Tim Anggota Online" color="amber" />

        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {allRoles.map(r => {
            const member = teamData.members[r]
            const isActive = r === role
            return (
              <span key={r} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold sm:text-xs ${member ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'} ${isActive ? 'ring-2 ring-amber-400' : ''}`}>
                {ROLES.find(x => x.id === r).icon} {member || '???'}
              </span>
            )
          })}
        </div>

        <div className="w-full max-w-2xl">
          {rolePanel[role]}
        </div>
      </main>
    </div>
  )
}

/* ─── PHASE 3: BUILD ─── */
function BuildScreen({ teamId, store, onDeploy, onExit, timerWarning, onDismissWarning }) {
  const teamData = store.teams[teamId]
  const reqOk = teamData.requirements?.validated
  const rulesOk = teamData.rules?.validated
  const flowOk = teamData.flowchart?.validated
  const menuOk = teamData.menu?.validated
  const readyCount = [reqOk, rulesOk, flowOk, menuOk].filter(Boolean).length
  const allReady = readyCount === 4
  const deployed = teamData.deployed

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-amber-200 via-orange-100 to-yellow-200">
      {timerWarning && (
        <div className="animate-pop-in fixed inset-x-4 top-4 z-50 mx-auto max-w-xl rounded-2xl border-2 border-red-400 bg-red-50 p-4 shadow-2xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2">
          <div className="flex items-start gap-3">
            <span className="text-3xl" aria-hidden="true">🚨</span>
            <div className="flex-1">
              <p className="text-sm font-extrabold uppercase tracking-wide text-red-600">Deploy Gagal!</p>
              <p className="mt-1 text-base font-bold text-red-800 sm:text-lg">Masih ada role yang belum simpan jawaban. Minta mereka segera menekan "Simpan Jawaban"!</p>
            </div>
            <button type="button" onClick={onDismissWarning} className="rounded-full bg-red-200 px-3 py-1 text-xs font-extrabold text-red-700 hover:bg-red-300">✕</button>
          </div>
        </div>
      )}
      <TopBar onExit={onExit} right={<TeamBadge teamId={teamId} compact />} title="Build & Integrasi" />
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6">
        <div className="animate-pop-in flex w-full max-w-xl flex-col items-center gap-4 rounded-3xl bg-white/95 p-5 shadow-lg sm:p-8">
          <span className="text-5xl sm:text-6xl" aria-hidden="true">🔨</span>
          <h2 className="text-[clamp(1.25rem,4vw,2rem)] font-extrabold text-slate-700">Build & Integration</h2>
          <p className="text-xs font-bold text-slate-500 sm:text-sm">Kompilasi data dari semua modul menjadi Sistem Kantin Live.</p>

          <ProgressBar current={readyCount} total={4} label="Modul Terintegrasi" color={allReady ? 'green' : 'amber'} />

          <div className="w-full space-y-2">
            {[
              { label: '📊 PC1: Analisis Masalah', ok: reqOk, hint: 'Analyst harus simpan jawaban', role: 'analyst' },
              { label: '⚙️ PC2: Aturan & Parameter', ok: rulesOk, hint: 'Strategist harus simpan jawaban', role: 'strategist' },
              { label: '🔗 PC3: Flowchart Logika', ok: flowOk, hint: 'Algorist harus simpan jawaban', role: 'algorist' },
              { label: '🎨 PC4: Menu & Data', ok: menuOk, hint: 'Simulator harus simpan jawaban', role: 'simulator' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between rounded-xl border-2 p-3 ${item.ok ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                <div>
                  <span className="text-sm font-extrabold text-slate-700">{item.label}</span>
                  {!item.ok && <p className="text-[10px] font-bold text-red-600">❌ {item.hint}</p>}
                </div>
                <span className={`text-lg ${item.ok ? 'text-green-500' : 'text-red-400'}`}>{item.ok ? '✅' : '❌'}</span>
              </div>
            ))}
          </div>

          {!allReady && (
            <div className="w-full rounded-2xl border-2 border-red-300 bg-red-50 p-3">
              <p className="text-xs font-extrabold text-red-600 sm:text-sm">
                ⚠️ TIDAK BISA DEPLOY! Semua role harus menekan "Simpan Jawaban" terlebih dahulu.
              </p>
              <p className="mt-1 text-[10px] font-bold text-red-500 sm:text-xs">
                Kembali ke halaman modul masing-masing dan tekan tombol simpan.
              </p>
            </div>
          )}

          <button
            type="button"
            disabled={!allReady || deployed}
            onClick={() => { sndDeploy(); onDeploy() }}
            className={`w-full rounded-full px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl ${deployed ? 'bg-green-500' : 'bg-gradient-to-r from-amber-500 to-orange-500 disabled:pointer-events-none disabled:opacity-40'}`}
          >
            {deployed ? '✅ System Deployed!' : '🚀 DEPLOY SYSTEM'}
          </button>
        </div>
      </main>
    </div>
  )
}

/* ─── PHASE 4: STRESS TEST ─── */

function StressTestScreen({ player, teamId, role, store, onUpdate, timer, onExit }) {
  const teamData = store.teams[teamId]
  const opponentTeam = teamId === 'A' ? 'B' : 'A'
  const isQA = role === 'qa'
  const [bugAlert, setBugAlert] = useState(null)
  const [testRunning, setTestRunning] = useState(false)
  const [testProgress, setTestProgress] = useState(0)
  const [localLogs, setLocalLogs] = useState([])
  const [testDone, setTestDone] = useState(false)

  const menu = teamData.menu?.items || MENU_ITEMS
  const testScripts = isQA ? (store.teams[opponentTeam]?.testScripts || []) : (teamData.testScripts || [])

  useEffect(() => {
    if (store.activeTests?.length > 0) {
      const latest = store.activeTests[store.activeTests.length - 1]
      if (latest.targetTeam === teamId && latest.status === 'running') {
        setBugAlert({ id: latest.id, desc: latest.desc, node: latest.node })
        sndBug()
        setTimeout(() => setBugAlert(null), 5000)
      }
    }
  }, [store.activeTests])

  function fireTestScripts() {
    if (testRunning) return
    setTestRunning(true)
    setTestProgress(0)
    setTestDone(false)
    setLocalLogs([])

    const enabled = testScripts.filter(s => s.enabled)
    let i = 0

    const interval = setInterval(() => {
      if (i >= enabled.length) {
        clearInterval(interval)
        setTestRunning(false)
        setTestDone(true)
        sndCorrect()
        return
      }

      const script = enabled[i]
      const result = runTest(script)
      setLocalLogs(prev => [...prev, { script: script.name, result, time: Date.now() }])
      setTestProgress(i + 1)

      if (result === 'FAIL') {
        onUpdate(opponentTeam, 'bugs', [
          ...(store.teams[opponentTeam]?.bugs || []),
          { id: script.id, name: script.name, desc: script.desc, fixed: false, time: Date.now() }
        ])
      }

      i++
    }, 800)
  }

  function runTest(script) {
    const input = script.input
    if (input.stockOverride !== undefined) {
      const item = menu.find(m => m.id === input.itemId)
      if (item && input.stockOverride <= 0) return 'FAIL'
    }
    if (input.amount !== undefined && input.total !== undefined) {
      if (input.amount < input.total) return 'FAIL'
    }
    if (input.items && input.items.length === 0) return 'FAIL'
    if (input.items === null) return 'FAIL'
    if (input.itemId && !menu.find(m => m.id === input.itemId)) return 'FAIL'
    if (input.cancelAt) return 'FAIL'
    if (input.payment === 'transfer' && input.verify === false) return 'FAIL'
    if (input.stockOverride !== undefined && input.stockOverride < 0) return 'FAIL'
    if (input.items && input.items.length > 5) return 'FAIL'
    return 'PASS'
  }

  function applyPatch(bugId) {
    sndPatch()
    onUpdate(teamId, 'patches', [
      ...(teamData.patches || []),
      { bugId, time: Date.now(), by: player }
    ])
    onUpdate(teamId, 'bugs', (teamData.bugs || []).map(b => b.id === bugId ? { ...b, fixed: true } : b))
  }

  const bugs = teamData.bugs || []
  const unfixedBugs = bugs.filter(b => !b.fixed)
  const fixedBugs = bugs.filter(b => b.fixed)
  const passCount = localLogs.filter(l => l.result === 'PASS').length
  const failCount = localLogs.filter(l => l.result === 'FAIL').length

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-amber-200 via-orange-100 to-yellow-200">
      {bugAlert && <BugAlert bug={bugAlert} onDismiss={() => setBugAlert(null)} />}
      <TopBar onExit={onExit} right={<Timer seconds={timer} phase="Stress-Test" />} title={`${TEAMS[teamId].emoji} ${isQA ? 'QA Console' : 'Debug Console'}`} />
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center gap-3 overflow-y-auto px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <TeamBadge teamId={teamId} compact />
          <RoleBadge roleId={role} compact />
          {!isQA && <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-extrabold text-red-600">🚨 {unfixedBugs.length} Bug Aktif</span>}
        </div>

        {isQA ? (
          <div className="w-full max-w-2xl">
            {/* Mission Brief for QA */}
            <div className="rounded-2xl bg-red-100 p-3 sm:p-4">
              <p className="mb-1 text-sm font-extrabold text-red-800 sm:text-base">🎯 Misi Kamu: Serang Sistem Lawan</p>
              <p className="text-xs font-bold text-red-600 sm:text-sm">
                Sebagai <b>QA Tester</b>, tugamu adalah menjalankan test script ke sistem <b>{TEAMS[opponentTeam].name}</b>.
              </p>
              <ol className="mt-2 space-y-1 text-xs font-bold text-slate-600 sm:text-sm">
                <li>1️⃣ <b>Tekan "FIRE TEST SCRIPTS"</b> — Sistem akan menjalankan semua script aktif secara otomatis.</li>
                <li>2️⃣ <b>Perhatikan hasilnya</b> — PASS = sistem lawan lolos, FAIL = bug ditemukan!</li>
                <li>3️⃣ <b>Lihat Test Log</b> — Hasil uji akan muncul di bawah secara real-time.</li>
              </ol>
            </div>

            {/* Fire Button */}
            <div className="mt-3 rounded-2xl bg-red-50 p-3 sm:p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-extrabold text-white">1</span>
                <p className="text-xs font-extrabold uppercase tracking-wide text-red-600 sm:text-sm">Fire Test Scripts → {TEAMS[opponentTeam].name}</p>
              </div>
              <ProgressBar current={testProgress} total={testScripts.filter(s => s.enabled).length} label="Progress Pengujian" color="red" />
              <button
                type="button" disabled={testRunning}
                onClick={() => { sndAlarm(); fireTestScripts() }}
                className={`mt-3 w-full rounded-full px-6 py-3 text-lg font-extrabold text-white shadow-lg transition hover:scale-105 ${testRunning ? 'bg-slate-400' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}
              >
                {testRunning ? `⏳ Testing... ${testProgress}/${testScripts.filter(s => s.enabled).length}` : '🔥 FIRE TEST SCRIPTS'}
              </button>
            </div>

            {/* Test Log */}
            <div className="mt-3 rounded-2xl bg-slate-900 p-3 sm:p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-extrabold uppercase tracking-wide text-green-400 sm:text-sm">📋 Test Log</p>
                {testDone && (
                  <div className="flex gap-2">
                    <span className="rounded-full bg-green-900/50 px-2 py-0.5 text-[10px] font-extrabold text-green-400">✅ {passCount} PASS</span>
                    <span className="rounded-full bg-red-900/50 px-2 py-0.5 text-[10px] font-extrabold text-red-400">❌ {failCount} FAIL</span>
                  </div>
                )}
              </div>
              <div className="max-h-[300px] space-y-1 overflow-y-auto font-mono text-xs">
                {localLogs.length === 0 && <p className="text-slate-500">Belum ada test yang dijalankan...</p>}
                {localLogs.map((log, i) => (
                  <div key={i} className={`rounded-lg px-2 py-1 ${log.result === 'PASS' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    <span className="text-slate-500">[{new Date(log.time).toLocaleTimeString()}]</span> {log.script}: <span className="font-extrabold">{log.result}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            {testDone && (
              <div className={`mt-3 rounded-2xl p-3 sm:p-4 ${failCount > 0 ? 'bg-red-50 border-2 border-red-300' : 'bg-green-50 border-2 border-green-300'}`}>
                <p className={`text-sm font-extrabold sm:text-base ${failCount > 0 ? 'text-red-700' : 'text-green-700'}`}>
                  {failCount > 0 ? `🚨 ${failCount} Bug Ditemukan di Sistem ${TEAMS[opponentTeam].name}!` : `🛡️ Semua Test Lolos! Sistem ${TEAMS[opponentTeam].name} Aman.`}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            {/* Mission Brief for Debug */}
            <div className="rounded-2xl bg-amber-100 p-3 sm:p-4">
              <p className="mb-1 text-sm font-extrabold text-amber-800 sm:text-base">🎯 Misi Kamu: Defend & Patch</p>
              <p className="text-xs font-bold text-amber-600 sm:text-sm">
                Tim QA lawan sedang menyerang sistem kamu. Tugamu adalah memperbaiki bug secepat mungkin!
              </p>
              <ol className="mt-2 space-y-1 text-xs font-bold text-slate-600 sm:text-sm">
                <li>1️⃣ <b>Tunggu serangan</b> — Bug akan muncul sebagai alert merah.</li>
                <li>2️⃣ <b>Baca deskripsi bug</b> — Pahami apa yang rusak.</li>
                <li>3️⃣ <b>TEKAN "APPLY PATCH"</b> — Untuk memperbaiki bug tersebut.</li>
                <li>4️⃣ <b>Pantau status</b> — Bug yang sudah diperbaiki akan berubah hijau.</li>
              </ol>
            </div>

            {/* Bug List */}
            {unfixedBugs.length > 0 && (
              <div className="mt-3 rounded-2xl bg-red-50 p-3 sm:p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-extrabold text-white">1</span>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-red-600 sm:text-sm">🐛 Bug List — Live Debugging</p>
                </div>
                <div className="space-y-2">
                  {unfixedBugs.map(bug => (
                    <div key={bug.id} className="animate-shake rounded-xl border-2 border-red-300 bg-red-100 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-extrabold text-red-700">CRITICAL BUG #{bug.id}: {bug.name}</p>
                          <p className="text-[10px] font-bold text-red-500">{bug.desc}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => { sndClick(); applyPatch(bug.id) }}
                          className="shrink-0 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-extrabold text-white transition hover:scale-105"
                        >
                          🔧 APPLY PATCH
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fixed Bugs */}
            {fixedBugs.length > 0 && (
              <div className="mt-3 rounded-2xl bg-green-50 p-3 sm:p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-extrabold text-white">2</span>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-green-600 sm:text-sm">✅ Bug Fixed ({fixedBugs.length})</p>
                </div>
                {fixedBugs.map(bug => (
                  <div key={bug.id} className="rounded-xl border border-green-200 bg-white p-2">
                    <p className="text-xs font-extrabold text-green-700">✓ {bug.name}</p>
                  </div>
                ))}
              </div>
            )}

            {/* No Bugs Yet */}
            {unfixedBugs.length === 0 && fixedBugs.length === 0 && (
              <div className="mt-3 rounded-2xl bg-green-50 p-6 text-center">
                <span className="text-4xl" aria-hidden="true">🛡️</span>
                <p className="mt-2 text-sm font-extrabold text-green-700">Sistem Aman!</p>
                <p className="text-xs font-bold text-slate-500">Belum ada bug yang terdeteksi. Tunggu serangan dari QA tim lawan.</p>
              </div>
            )}

            {/* System Status */}
            <div className="mt-3 rounded-2xl bg-slate-900 p-3 sm:p-4">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-amber-400 sm:text-sm">📊 Status Sistem</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-green-900/30 p-2">
                  <p className="text-lg font-extrabold text-green-400">{teamData.menu?.items?.length || 8}</p>
                  <p className="text-[10px] font-bold text-slate-400">Menu Items</p>
                </div>
                <div className="rounded-xl bg-amber-900/30 p-2">
                  <p className="text-lg font-extrabold text-amber-400">{teamData.flowchart?.nodes?.length || 10}</p>
                  <p className="text-[10px] font-bold text-slate-400">Flow Nodes</p>
                </div>
                <div className="rounded-xl bg-red-900/30 p-2">
                  <p className="text-lg font-extrabold text-red-400">{fixedBugs.length}/{bugs.length}</p>
                  <p className="text-[10px] font-bold text-slate-400">Bugs Fixed</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

/* ─── LEADERBOARD ─── */
function LeaderboardScreen({ store, onExit, onRestart }) {
  useEffect(() => {
    const burst = (x, y) => confetti({ particleCount: 80, spread: 70, origin: { x, y } })
    burst(0.25, 0.4)
    burst(0.75, 0.4)
    const t = setTimeout(() => { if (confetti.reset) confetti.reset(); burst(0.5, 0.3) }, 900)
    return () => clearTimeout(t)
  }, [])

  function computeTeamScore(teamId) {
    const team = store.teams[teamId]
    const hasReqs = team.requirements ? 1 : 0
    const hasRules = team.rules ? 1 : 0
    const hasFlow = team.flowchart ? 1 : 0
    const hasMenu = team.menu ? 1 : 0
    const completion = ((hasReqs + hasRules + hasFlow + hasMenu) / 4) * 100

    const totalBugs = (team.bugs || []).length
    const fixedBugs = (team.bugs || []).filter(b => b.fixed).length
    const stability = totalBugs > 0 ? (fixedBugs / totalBugs) * 100 : (team.deployed ? 100 : 0)

    const patches = team.patches || []
    const agility = patches.length > 0 ? Math.min(100, 50 + patches.length * 10) : (totalBugs === 0 && team.deployed ? 100 : 0)

    const testScripts = team.testScripts || []
    const enabledTests = testScripts.filter(s => s.enabled).length
    const rigor = Math.min(100, (enabledTests / 10) * 100)

    const total = Math.round(
      completion * SCORING_WEIGHTS.completion +
      stability * SCORING_WEIGHTS.stability +
      agility * SCORING_WEIGHTS.agility +
      rigor * SCORING_WEIGHTS.rigor
    )

    return { completion: Math.round(completion), stability: Math.round(stability), agility: Math.round(agility), rigor: Math.round(rigor), total }
  }

  const scoreA = computeTeamScore('A')
  const scoreB = computeTeamScore('B')
  const winner = scoreA.total > scoreB.total ? 'A' : scoreB.total > scoreA.total ? 'B' : null

  return (
    <div className="flex h-dvh w-full touch-manipulation flex-col overflow-hidden bg-gradient-to-b from-amber-200 via-orange-100 to-yellow-200">
      <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6">
        <div className="animate-pop-in flex w-full max-w-2xl flex-col items-center gap-5 rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-10">
          <span className="text-6xl sm:text-7xl" aria-hidden="true">🏆</span>
          <h1 className="text-[clamp(1.5rem,5vw,2.75rem)] font-extrabold text-slate-700">
            Papan Skor <span className="text-amber-600">Akhir</span>
          </h1>

          {winner && (
            <div className="rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3 text-xl font-extrabold text-white shadow-lg">
              🎉 {TEAMS[winner].name} MENANG! 🎉
            </div>
          )}

          <div className="grid w-full grid-cols-2 gap-3">
            {['A', 'B'].map(teamId => {
              const score = teamId === 'A' ? scoreA : scoreB
              const isWinner = teamId === winner
              return (
                <div key={teamId} className={`rounded-2xl border-2 p-4 ${isWinner ? 'border-amber-400 bg-amber-50 shadow-lg' : 'border-slate-200 bg-white'}`}>
                  <TeamBadge teamId={teamId} compact />
                  <p className="mt-3 text-4xl font-extrabold text-slate-700">{score.total}</p>
                  <p className="text-xs font-bold text-slate-400">Total Skor</p>

                  <div className="mt-3 space-y-2 text-left">
                    {[
                      { label: 'System Completion', val: score.completion, weight: '20%', color: 'sky', desc: 'Seberapa lengkap modul yang diselesaikan' },
                      { label: 'First-Run Stability', val: score.stability, weight: '40%', color: 'green', desc: 'Bug yang berhasil diperbaiki dari total bug' },
                      { label: 'Debugging Agility', val: score.agility, weight: '30%', color: 'purple', desc: 'Kecepatan merespon & memperbaiki bug' },
                      { label: 'QA Test Rigor', val: score.rigor, weight: '10%', color: 'red', desc: 'Jumlah test script yang aktif dijalankan' },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500">{item.label} ({item.weight})</span>
                          <span className="text-xs font-extrabold text-slate-700">{item.val}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                          <div className={`h-full rounded-full bg-${item.color}-500`} style={{ width: `${item.val}%` }} />
                        </div>
                        <p className="mt-0.5 text-[9px] font-bold text-slate-400">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <button type="button" onClick={onRestart}
              className="flex-1 rounded-full bg-amber-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 sm:text-2xl">
              ↺ Main Lagi
            </button>
            <button type="button" onClick={onExit}
              className="flex-1 rounded-full bg-white px-8 py-3 text-xl font-extrabold text-slate-600 shadow-lg transition hover:scale-105 sm:text-2xl">
              Back to Games 🎮
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

/* ─── MAIN GAME COMPONENT ─── */
export default function KantinGame({ onExit }) {
  const [screen, setScreen] = useState('login')
  const [player, setPlayer] = useState(null)
  const [teamId, setTeamId] = useState(null)
  const [role, setRole] = useState(null)
  const [store, setStore] = useState(loadStore)
  const [timer, setTimer] = useState(PHASE_DURATIONS.brief)
  const timerRef = useRef(null)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)) } catch { /* ignore */ }
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

  const [timerWarning, setTimerWarning] = useState(false)

  useEffect(() => {
    if (screen === 'briefing' || screen === 'development' || screen === 'build' || screen === 'stresstest') {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 60 && prev > 59 && screen === 'development') {
            setTimerWarning(true)
            sndAlarm()
          }
          if (prev <= 1) {
            clearInterval(timerRef.current)
            if (screen === 'briefing') {
              setScreen('development')
            } else if (screen === 'development') {
              setScreen('build')
            } else if (screen === 'build') {
              const teamData = store.teams[teamId]
              const allValidated = teamData.requirements?.validated && teamData.rules?.validated && teamData.flowchart?.validated && teamData.menu?.validated
              if (!allValidated) {
                setTimerWarning(true)
                sndError()
                return 60
              }
              setScreen('stresstest')
              setTimer(PHASE_DURATIONS.test)
            } else if (screen === 'stresstest') {
              setScreen('leaderboard')
            }
            setTimerWarning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timerRef.current)
    }
  }, [screen, store, teamId])

  function broadcast(updated) {
    if (typeof BroadcastChannel !== 'undefined') {
      try { new BroadcastChannel(CHANNEL_NAME).postMessage({ type: 'store', store: updated }) } catch { /* ignore */ }
    }
    return updated
  }

  function handleJoin(name, team) {
    setPlayer(name)
    setTeamId(team)
    setStore(prev => broadcast({
      ...prev,
      teams: { ...prev.teams, [team]: { ...prev.teams[team], members: { ...prev.teams[team].members, [role || 'pending']: name } } }
    }))
    setScreen('roleSelect')
  }

  function handleRoleSelect(selectedRole) {
    setRole(selectedRole)
    setStore(prev => {
      const newMembers = { ...prev.teams[teamId].members }
      delete newMembers[role]
      newMembers[selectedRole] = player
      return broadcast({
        ...prev,
        teams: { ...prev.teams, [teamId]: { ...prev.teams[teamId], members: newMembers } }
      })
    })
    setTimer(PHASE_DURATIONS.brief)
    setScreen('briefing')
  }

  function handleUpdate(team, key, value) {
    setStore(prev => broadcast({
      ...prev,
      teams: { ...prev.teams, [team]: { ...prev.teams[team], [key]: value } }
    }))
  }

  function handleDeploy() {
    setStore(prev => broadcast({
      ...prev,
      teams: { ...prev.teams, [teamId]: { ...prev.teams[teamId], deployed: true } }
    }))
    setTimer(PHASE_DURATIONS.test)
    setScreen('stresstest')
  }

  function handleRestart() {
    setStore({ ...DEFAULT_STORE })
    setPlayer(null)
    setTeamId(null)
    setRole(null)
    setScreen('login')
  }

  if (screen === 'login') return <LoginScreen onJoin={handleJoin} onExit={onExit} />
  if (screen === 'roleSelect') return <RoleSelectScreen player={player} teamId={teamId} onSelect={handleRoleSelect} onExit={onExit} />
  if (screen === 'briefing') return <BriefingScreen player={player} teamId={teamId} role={role} timer={timer} onReady={() => { setTimer(PHASE_DURATIONS.develop); setScreen('development') }} onExit={onExit} />
  if (screen === 'development') return (
    <>
      {timerWarning && (
        <div className="animate-pop-in fixed inset-x-4 top-4 z-50 mx-auto max-w-xl rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 shadow-2xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2">
          <div className="flex items-start gap-3">
            <span className="text-3xl" aria-hidden="true">⏰</span>
            <div className="flex-1">
              <p className="text-sm font-extrabold uppercase tracking-wide text-amber-600">Waktu Habis 1 Menit Lagi!</p>
              <p className="mt-1 text-base font-bold text-amber-800 sm:text-lg">Segera tekan "Simpan Jawaban" sebelum waktu habis!</p>
            </div>
            <button type="button" onClick={() => setTimerWarning(false)} className="rounded-full bg-amber-200 px-3 py-1 text-xs font-extrabold text-amber-700 hover:bg-amber-300">✕</button>
          </div>
        </div>
      )}
      <DevelopmentScreen player={player} teamId={teamId} role={role} store={store} onUpdate={handleUpdate} timer={timer} onExit={onExit} />
    </>
  )
  if (screen === 'build') return <BuildScreen teamId={teamId} store={store} onDeploy={handleDeploy} onExit={onExit} timerWarning={timerWarning} onDismissWarning={() => setTimerWarning(false)} />
  if (screen === 'stresstest') return <StressTestScreen player={player} teamId={teamId} role={role} store={store} onUpdate={handleUpdate} timer={timer} onExit={onExit} />
  if (screen === 'leaderboard') return <LeaderboardScreen store={store} onExit={onExit} onRestart={handleRestart} />

  return null
}
