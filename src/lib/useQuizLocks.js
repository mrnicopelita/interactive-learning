import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase.js'

export function useQuizLocks() {
  const [locks, setLocks] = useState({})
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!supabase) {
      setLoading(false)
      return
    }
    const { data } = await supabase.from('quiz_settings').select('*')
    if (data) {
      const map = {}
      for (const row of data) map[row.quiz_id] = row.is_locked
      setLocks(map)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetch()
    const interval = setInterval(fetch, 5000)
    return () => clearInterval(interval)
  }, [fetch])

  const toggleLock = useCallback(
    async (quizId) => {
      if (!supabase) return
      const currentlyLocked = locks[quizId] ?? true
      const newLocked = !currentlyLocked
      setLocks((prev) => ({ ...prev, [quizId]: newLocked }))
      await supabase
        .from('quiz_settings')
        .upsert({ quiz_id: quizId, is_locked: newLocked }, { onConflict: 'quiz_id' })
    },
    [locks],
  )

  const isLocked = useCallback(
    (quizId) => locks[quizId] ?? true,
    [locks],
  )

  return { locks, loading, toggleLock, isLocked }
}
