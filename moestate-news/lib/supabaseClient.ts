import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const enableSupabase = process.env.NEXT_PUBLIC_ENABLE_SUPABASE === 'true'

export function getSupabaseClient() {
  if (!enableSupabase || !supabaseUrl || !supabaseAnonKey) {
    return null
  }
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

export function isSupabaseEnabled(): boolean {
  return enableSupabase && !!supabaseUrl && !!supabaseAnonKey
}

