import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { formatTime } from '../exams/examEngine.js'

const ACCESS_CODE = 'j0gl0'

const EXAM_NAMES = {
  'kuis-berpikir-komputasional': 'Quiz G1-G3',
  'kuis-berpikir-komputasional-4': 'Quiz Grade 4',
  'kuis-berpikir-komputasional-5': 'Quiz Grade 5',
  'kuis-berpikir-komputasional-6': 'Quiz Grade 6',
}

function examName(examId) {
  return EXAM_NAMES[examId] || examId
}

function StatCard({ label, value, emoji }) {
  return (
    <div className="animate-pop-in flex min-w-[9rem] flex-1 flex-col items-center gap-1 rounded-3xl bg-white/95 px-4 py-5 text-center shadow-lg">
      <span className="text-3xl" aria-hidden="true">
        {emoji}
      </span>
      <span className="text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-none text-slate-700">
        {value}
      </span>
      <span className="text-xs font-extrabold tracking-wide text-slate-500 uppercase sm:text-sm">
        {label}
      </span>
    </div>
  )
}

function DashboardGate({ onUnlock, onExit }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    if (code.trim() === ACCESS_CODE) {
      onUnlock()
    } else {
      setError(true)
    }
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
          className="animate-pop-in flex w-full max-w-md flex-col items-center gap-4 rounded-3xl bg-white/95 p-6 text-center shadow-lg sm:p-10"
        >
          <span className="text-5xl sm:text-6xl" aria-hidden="true">
            🔐
          </span>
          <h1 className="text-[clamp(1.75rem,6vw,3rem)] font-extrabold leading-none text-slate-700">
            Admin Dashboard
          </h1>
          <p className="text-base font-bold text-slate-500 sm:text-lg">
            Tell me the code
          </p>

          <label className="flex w-full flex-col gap-2 text-left">
            <span className="text-sm font-extrabold tracking-wide text-slate-600 uppercase">
              Code
            </span>
            <input
              type="password"
              value={code}
              onChange={(event) => {
                setCode(event.target.value)
                setError(false)
              }}
              placeholder="Enter the code…"
              autoFocus
              autoComplete="off"
              className={`w-full rounded-2xl border-2 bg-sky-50 px-4 py-3 text-center text-xl font-extrabold text-slate-700 outline-none placeholder:font-semibold placeholder:text-slate-400 focus:border-sky-500 sm:text-2xl ${
                error ? 'border-rose-400' : 'border-sky-200'
              }`}
            />
          </label>

          {error && (
            <p className="text-sm font-extrabold text-rose-600 sm:text-base">
              Wrong code. Access denied.
            </p>
          )}

          <button
            type="submit"
            disabled={!code.trim()}
            className="w-full rounded-full bg-emerald-500 px-8 py-3 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 disabled:pointer-events-none disabled:opacity-40 sm:text-2xl"
          >
            Unlock
          </button>
        </form>
      </main>
    </div>
  )
}

function EditModal({ row, onSave, onCancel }) {
  const [draft, setDraft] = useState({
    student_name: row.student_name,
    exam_id: row.exam_id,
    score: String(row.score),
    total: String(row.total),
    percentage: String(row.percentage),
    time_taken_seconds: String(row.time_taken_seconds),
  })
  const [busy, setBusy] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const score = Number(draft.score)
    const total = Number(draft.total)
    const percentage = Number(draft.percentage)
    const timeTaken = Number(draft.time_taken_seconds)
    if (!draft.student_name.trim() || !draft.exam_id) return
    if (
      !Number.isFinite(score) ||
      !Number.isFinite(total) ||
      !Number.isFinite(percentage) ||
      !Number.isFinite(timeTaken)
    ) {
      return
    }
    setBusy(true)
    onSave({
      student_name: draft.student_name.trim(),
      exam_id: draft.exam_id,
      score,
      total,
      percentage,
      time_taken_seconds: timeTaken,
    })
      .catch(() => {})
      .finally(() => setBusy(false))
  }

  const fieldClass =
    'w-full rounded-2xl border-2 border-sky-200 bg-sky-50 px-4 py-2 text-base font-bold text-slate-700 outline-none placeholder:font-semibold placeholder:text-slate-400 focus:border-sky-500'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={handleSubmit}
        className="animate-pop-in flex max-h-[90dvh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <h2 className="text-xl font-extrabold text-slate-700 sm:text-2xl">
          Edit submission
        </h2>

        <label className="flex flex-col gap-1.5 text-left">
          <span className="text-xs font-extrabold tracking-wide text-slate-600 uppercase">
            Student name
          </span>
          <input
            type="text"
            value={draft.student_name}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, student_name: event.target.value }))
            }
            className={fieldClass}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-left">
          <span className="text-xs font-extrabold tracking-wide text-slate-600 uppercase">
            Quiz
          </span>
          <select
            value={draft.exam_id}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, exam_id: event.target.value }))
            }
            className={fieldClass}
          >
            {Object.entries(EXAM_NAMES).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-xs font-extrabold tracking-wide text-slate-600 uppercase">
              Score
            </span>
            <input
              type="number"
              value={draft.score}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, score: event.target.value }))
              }
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-xs font-extrabold tracking-wide text-slate-600 uppercase">
              Total
            </span>
            <input
              type="number"
              value={draft.total}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, total: event.target.value }))
              }
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-xs font-extrabold tracking-wide text-slate-600 uppercase">
              Percentage
            </span>
            <input
              type="number"
              value={draft.percentage}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, percentage: event.target.value }))
              }
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-xs font-extrabold tracking-wide text-slate-600 uppercase">
              Time (seconds)
            </span>
            <input
              type="number"
              value={draft.time_taken_seconds}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, time_taken_seconds: event.target.value }))
              }
              className={fieldClass}
            />
          </label>
        </div>

        <div className="mt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-full bg-white px-5 py-2.5 text-base font-extrabold text-slate-600 shadow transition hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-emerald-500 px-5 py-2.5 text-base font-extrabold text-white shadow transition hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
          >
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

function DashboardView({ onExit }) {
  const [state, setState] = useState({ status: 'loading' })
  const [editingRow, setEditingRow] = useState(null)
  const [notice, setNotice] = useState(null)
  const [selectedExam, setSelectedExam] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!supabase) {
        if (!cancelled) setState({ status: 'error', message: 'Supabase is not configured.' })
        return
      }
      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500)
      if (cancelled) return
      if (error) {
        setState({ status: 'error', message: error.message })
      } else {
        setState({ status: 'ready', rows: data })
      }
    }
    load()
    const interval = setInterval(load, 3000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(() => setNotice(null), 4000)
    return () => clearTimeout(timer)
  }, [notice])

  async function handleDelete(row) {
    if (!window.confirm(`Delete ${row.student_name}'s submission?`)) return
    const { error } = await supabase.from('exam_results').delete().eq('id', row.id)
    if (error) {
      setNotice({ kind: 'error', text: `Couldn't delete: ${error.message}` })
      return
    }
    setState((prev) => ({ ...prev, rows: prev.rows.filter((r) => r.id !== row.id) }))
    setNotice({ kind: 'success', text: 'Submission deleted.' })
  }

  async function handleEditSave(payload) {
    const { error } = await supabase
      .from('exam_results')
      .update(payload)
      .eq('id', editingRow.id)
    if (error) {
      setNotice({ kind: 'error', text: `Couldn't save: ${error.message}` })
      return
    }
    setState((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => (r.id === editingRow.id ? { ...r, ...payload } : r)),
    }))
    setEditingRow(null)
    setNotice({ kind: 'success', text: 'Submission updated.' })
  }

  const metrics = useMemo(() => {
    if (state.status !== 'ready') return null
    const rows = selectedExam
      ? state.rows.filter((r) => r.exam_id === selectedExam)
      : state.rows
    const attempts = rows.length
    const uniqueStudents = new Set(rows.map((r) => r.student_name)).size
    const percentages = rows.map((r) => r.percentage)
    const averagePercent = percentages.length
      ? Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length)
      : 0
    const bestPercent = percentages.length ? Math.max(...percentages) : 0
    const passed = rows.filter((r) => r.percentage >= 50).length
    const passRate = attempts ? Math.round((passed / attempts) * 100) : 0

    const perExam = new Map()
    for (const row of rows) {
      const entry = perExam.get(row.exam_id) || {
        examId: row.exam_id,
        attempts: 0,
        students: new Set(),
        percentageSum: 0,
        best: 0,
      }
      entry.attempts += 1
      entry.students.add(row.student_name)
      entry.percentageSum += row.percentage
      entry.best = Math.max(entry.best, row.percentage)
      perExam.set(row.exam_id, entry)
    }

    return {
      attempts,
      uniqueStudents,
      averagePercent,
      bestPercent,
      passRate,
      perExam: [...perExam.values()]
        .map((e) => ({
          examId: e.examId,
          attempts: e.attempts,
          students: e.students.size,
          averagePercent: Math.round(e.percentageSum / e.attempts),
          best: e.best,
        }))
        .sort((a, b) => b.attempts - a.attempts),
      recent: rows.slice(0, 15),
    }
  }, [state, selectedExam])

  if (state.status === 'loading') {
    return (
      <div className="flex h-dvh w-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-sky-200 via-cyan-50 to-emerald-200">
        <span className="animate-pulse text-4xl" aria-hidden="true">⏳</span>
        <p className="text-lg font-extrabold text-slate-600">Loading results…</p>
      </div>
    )
  }

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
        <h1 className="text-[clamp(1.5rem,5vw,2.5rem)] font-extrabold leading-none text-slate-700">
          Admin Dashboard
        </h1>
        <div className="w-20 sm:w-32" aria-hidden="true" />
      </div>

      <main className="flex min-h-0 flex-1 flex-col items-center gap-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
        {state.status === 'error' ? (
          <div className="flex w-full max-w-3xl flex-col items-center gap-2 rounded-3xl bg-rose-100 px-6 py-8 text-center shadow-lg">
            <span className="text-4xl" aria-hidden="true">⚠️</span>
            <p className="text-lg font-extrabold text-rose-700">
              Couldn't load results: {state.message}
            </p>
          </div>
        ) : (
          <>
            <div className="flex w-full max-w-5xl flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedExam(null)}
                className={`rounded-full px-5 py-2 text-sm font-extrabold shadow transition hover:scale-105 sm:text-base ${
                  selectedExam === null
                    ? 'bg-sky-600 text-white'
                    : 'bg-white/80 text-slate-600'
                }`}
              >
                All Grades
              </button>
              {Object.entries(EXAM_NAMES).map(([id, name]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedExam(id)}
                  className={`rounded-full px-5 py-2 text-sm font-extrabold shadow transition hover:scale-105 sm:text-base ${
                    selectedExam === id
                      ? 'bg-sky-600 text-white'
                      : 'bg-white/80 text-slate-600'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="flex w-full max-w-5xl flex-wrap gap-3 sm:gap-4">
              <StatCard label="Total Attempts" value={metrics.attempts} emoji="📝" />
              <StatCard label="Unique Students" value={metrics.uniqueStudents} emoji="🧑‍🎓" />
              <StatCard label="Average Score" value={`${metrics.averagePercent}%`} emoji="📈" />
              <StatCard label="Highest Score" value={`${metrics.bestPercent}%`} emoji="🏆" />
              <StatCard label="Pass Rate" value={`${metrics.passRate}%`} emoji="✅" />
            </div>

            <div className="flex w-full max-w-5xl flex-col gap-2 sm:gap-3">
              <h2 className="text-lg font-extrabold text-slate-700 sm:text-xl">
                {selectedExam ? `${examName(selectedExam)} results` : 'Results per quiz'}
              </h2>
              <div className="flex flex-wrap gap-3">
                {metrics.perExam.length === 0 && (
                  <p className="w-full rounded-3xl bg-white/95 px-6 py-5 text-center text-base font-bold text-slate-500 shadow-lg">
                    No results yet.
                  </p>
                )}
                {metrics.perExam.map((e) => (
                  <div
                    key={e.examId}
                    className="animate-pop-in flex min-w-[16rem] flex-1 flex-col gap-1 rounded-3xl bg-white/95 px-5 py-4 shadow-lg"
                  >
                    <span className="text-base font-extrabold text-sky-700 sm:text-lg">
                      {examName(e.examId)}
                    </span>
                    <span className="text-sm font-bold text-slate-500">
                      {e.attempts} attempt{e.attempts === 1 ? '' : 's'} · {e.students}{' '}
                      student{e.students === 1 ? '' : 's'}
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-sky-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"
                          style={{ width: `${e.averagePercent}%` }}
                        />
                      </div>
                      <span className="text-sm font-extrabold text-slate-700">
                        {e.averagePercent}%
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      Best: {e.best}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex w-full max-w-5xl flex-col gap-2 sm:gap-3">
              <h2 className="text-lg font-extrabold text-slate-700 sm:text-xl">
                Recent submissions
              </h2>
              {notice && (
                <div
                  className={`animate-pop-in rounded-2xl px-5 py-3 text-center text-base font-extrabold shadow ${
                    notice.kind === 'error' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {notice.text}
                </div>
              )}
              <div className="w-full overflow-x-auto rounded-3xl bg-white/95 shadow-lg">
                {metrics.recent.length === 0 ? (
                  <p className="px-6 py-5 text-center text-base font-bold text-slate-500">
                    No results yet.
                  </p>
                ) : (
                  <table className="w-full min-w-[46rem] text-left text-sm sm:text-base">
                    <thead>
                      <tr className="border-b-2 border-sky-100 text-xs font-extrabold tracking-wide text-slate-500 uppercase">
                        <th className="px-5 py-3">Student</th>
                        <th className="px-5 py-3">Quiz</th>
                        <th className="px-5 py-3">Score</th>
                        <th className="px-5 py-3">%</th>
                        <th className="px-5 py-3">Time</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.recent.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-sky-50 font-bold text-slate-600 last:border-b-0"
                        >
                          <td className="px-5 py-3">{row.student_name}</td>
                          <td className="px-5 py-3">{examName(row.exam_id)}</td>
                          <td className="px-5 py-3">
                            {row.score}/{row.total}
                          </td>
                          <td className="px-5 py-3">{row.percentage}%</td>
                          <td className="px-5 py-3">
                            {formatTime(row.time_taken_seconds)}
                          </td>
                          <td className="px-5 py-3 whitespace-nowrap">
                            {new Date(row.created_at).toLocaleString()}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingRow(row)}
                                className="rounded-full bg-sky-500 px-3 py-1.5 text-xs font-extrabold text-white shadow transition hover:scale-105 sm:text-sm"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(row)}
                                className="rounded-full bg-rose-500 px-3 py-1.5 text-xs font-extrabold text-white shadow transition hover:scale-105 sm:text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {editingRow && (
        <EditModal
          row={editingRow}
          onSave={handleEditSave}
          onCancel={() => setEditingRow(null)}
        />
      )}
    </div>
  )
}

export default function Dashboard({ onExit }) {
  const [unlocked, setUnlocked] = useState(false)
  if (!unlocked) {
    return <DashboardGate onUnlock={() => setUnlocked(true)} onExit={onExit} />
  }
  return <DashboardView onExit={onExit} />
}
