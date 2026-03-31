// src/hooks/useEntries.js
import { useState, useEffect, useCallback } from 'react'
import { MOCK_ENTRIES } from '../constants/languages'

let supabase = null
try {
  const { createClient } = await import('@supabase/supabase-js')
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (url && key) supabase = createClient(url, key)
} catch (_) {}

export function useEntries() {
  const [entries, setEntries]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    try {
      if (supabase) {
        const { data: entryRows, error: e1 } = await supabase
          .from('entries').select('*').order('created_at', { ascending: false })
        if (e1) throw e1

        const { data: translations, error: e2 } = await supabase
          .from('translations').select('*')
        if (e2) throw e2

        const merged = entryRows.map(entry => {
          const tMap = {}
          translations
            .filter(t => t.entry_id === entry.id)
            .forEach(t => { tMap[t.lang_code] = { value: t.value, romanization: t.romanization, notes: t.notes } })
          return { ...entry, translations: tMap }
        })
        setEntries(merged)
      } else {
        // Dev mode — use mock data
        setEntries(MOCK_ENTRIES.map(e => ({ ...e })))
      }
    } catch (err) {
      setError(err.message)
      setEntries(MOCK_ENTRIES.map(e => ({ ...e })))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  const addEntry = useCallback(async (entry) => {
    const newEntry = { ...entry, id: String(Date.now()), translations: {} }
    if (supabase) {
      const { data, error } = await supabase.from('entries').insert({
        concept: entry.concept, category: entry.category,
        tags: entry.tags, cognate_group: entry.cognateGroup,
      }).select().single()
      if (error) throw error
      newEntry.id = data.id
    }
    setEntries(prev => [newEntry, ...prev])
    return newEntry
  }, [])

  const updateTranslations = useCallback(async (entryId, translations) => {
    setEntries(prev =>
      prev.map(e => e.id === entryId ? { ...e, translations } : e)
    )
    if (supabase) {
      const rows = Object.entries(translations).map(([lang_code, t]) => ({
        entry_id: entryId, lang_code,
        value: t.value, romanization: t.romanization, notes: t.notes,
      }))
      await supabase.from('translations').upsert(rows, { onConflict: 'entry_id,lang_code' })
    }
  }, [])

  const deleteEntry = useCallback(async (id) => {
    setEntries(prev => prev.filter(e => e.id !== id))
    if (supabase) await supabase.from('entries').delete().eq('id', id)
  }, [])

  return { entries, loading, error, addEntry, updateTranslations, deleteEntry, refetch: fetchEntries }
}
