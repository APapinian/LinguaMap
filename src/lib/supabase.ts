// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { EntryRow, TranslationRow, ConjugationRow } from '@/types'

// Database generic type for full type-safety
export interface Database {
  public: {
    Tables: {
      entries: {
        Row: EntryRow
        Insert: Omit<EntryRow, 'id' | 'created_at'>
        Update: Partial<Omit<EntryRow, 'id' | 'created_at'>>
      }
      translations: {
        Row: TranslationRow
        Insert: Omit<TranslationRow, 'id'>
        Update: Partial<Omit<TranslationRow, 'id'>>
      }
      conjugations: {
        Row: ConjugationRow
        Insert: Omit<ConjugationRow, 'id'>
        Update: Partial<Omit<ConjugationRow, 'id'>>
      }
    }
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Export null if env vars missing — hooks fall back to mock data
export const supabase: SupabaseClient<Database> | null =
  supabaseUrl && supabaseKey
    ? createClient<Database>(supabaseUrl, supabaseKey)
    : null

export const isSupabaseEnabled = supabase !== null
