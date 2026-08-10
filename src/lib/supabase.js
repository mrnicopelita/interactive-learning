import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function isValidSupabaseUrl(value) {
  if (typeof value !== 'string') return false
  try {
    const protocol = new URL(value).protocol
    return (protocol === 'http:' || protocol === 'https:') && value.includes('.supabase.co')
  } catch {
    return false
  }
}

export const supabase =
  isValidSupabaseUrl(supabaseUrl) && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null
