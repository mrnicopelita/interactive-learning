import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase.js'
import { QUIZ_REGISTRY } from './quizRegistry.js'

export function useQuizLocks() {
  const [locks, setLocks] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchLocks = useCallback(async () => {
    if (!supabase) {
      setLoading(false)
      return
    }
    const { data, error: fetchError } = await supabase.from('quiz_settings').select('*')
    if (fetchError) {
      setError(fetchError.message)
      setLoading(false)
      return
    }
    setError(null)
    if (data) {
      const map = {}
      for (const row of data) map[row.quiz_id] = row.is_locked
      setLocks(map)

      const knownIds = new Set(data.map((r) => r.quiz_id))
      const missing = QUIZ_REGISTRY.filter((q) => !knownIds.has(q.id))
      if (missing.length > 0) {
        const rows = missing.map((q) => ({ quiz_id: q.id, is_locked: true }))
        await supabase.from('quiz_settings').insert(rows)
        for (const q of missing) map[q.id] = true
        setLocks({ ...map })
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchLocks()
    const interval = setInterval(fetchLocks, 3000)
    return () => clearInterval(interval)
  }, [fetchLocks])

  const toggleLock = useCallback(
    async (quizId) => {
      if (!supabase) return
      const currentlyLocked = locks[quizId] ?? true
      const newLocked = !currentlyLocked
      setLocks((prev) => ({ ...prev, [quizId]: newLocked }))
      const { error: upsertError } = await supabase
        .from('quiz_settings')
        .upsert({ quiz_id: quizId, is_locked: newLocked }, { onConflict: 'quiz_id' })
      if (upsertError) {
        setError(upsertError.message)
        setLocks((prev) => ({ ...prev, [quizId]: currentlyLocked }))
      }
    },
    [locks],
  )

  const isLocked = useCallback(
    (quizId) => locks[quizId] ?? true,
    [locks],
  )

  return { locks, loading, error, toggleLock, isLocked }
}
