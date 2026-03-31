// src/hooks/useEntries.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, isSupabaseEnabled } from '@/lib/supabase'
import { MOCK_ENTRIES } from '@/constants/mockData'
import type { Entry, NewEntry, TranslationMap, LangCode } from '@/types'

type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

interface UseEntriesReturn {
  entries: Entry[]
  status: FetchStatus
  error: string | null
  addEntry: (data: NewEntry) => Promise<Entry>
  updateTranslations: (entryId: string, translations: TranslationMap) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  refetch: () => Promise<void>
}

export function useEntries(): UseEntriesReturn {
  const [entries, setEntries] = useState<Entry[]>([])
  const [status, setStatus]   = useState<FetchStatus>('idle')
  const [error, setError]     = useState<string | null>(null)
  const abortRef              = useRef<AbortController | null>(null)

  const fetchEntries = useCallback(async () => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setStatus('loading')
    setError(null)

    try {
      if (!isSupabaseEnabled || !supabase) {
        // Mock mode
        await new Promise(r => setTimeout(r, 400)) // simulate network
        setEntries(MOCK_ENTRIES.map(e => ({ ...e })))
        setStatus('success')
        return
      }

      // 1. Fetch entries
      const { data: entryRows, error: e1 } = await supabase
        .from('entries')
        .select('*')
        .order('created_at', { ascending: false })
      if (e1) throw new Error(e1.message)

      // 2. Fetch all translations in one query
      const { data: translationRows, error: e2 } = await supabase
        .from('translations')
        .select('*')
      if (e2) throw new Error(e2.message)

      // 3. Merge
      const merged: Entry[] = (entryRows ?? []).map(row => {
        const tMap: TranslationMap = {}
        ;(translationRows ?? [])
          .filter(t => t.entry_id === row.id)
          .forEach(t => {
            tMap[t.lang_code as LangCode] = {
              value: t.value,
              romanization: t.romanization,
              notes: t.notes,
            }
          })
        return {
          id: row.id,
          concept: row.concept,
          category: row.category,
          tags: row.tags ?? [],
          cognateGroup: row.cognate_group ?? '',
          translations: tMap,
          createdAt: row.created_at,
        }
      })

      setEntries(merged)
      setStatus('success')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(msg)
      setStatus('error')
      // Fallback to mock
      setEntries(MOCK_ENTRIES.map(e => ({ ...e })))
    }
  }, [])

  useEffect(() => {
    fetchEntries()
    return () => abortRef.current?.abort()
  }, [fetchEntries])

  // Real-time subscription
  useEffect(() => {
    if (!isSupabaseEnabled || !supabase) return
    const channel = supabase
      .channel('entries-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'entries' }, () => {
        fetchEntries()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchEntries])

  const addEntry = useCallback(async (data: NewEntry): Promise<Entry> => {
    const tempId = `temp-${Date.now()}`
    const optimistic: Entry = {
      id: tempId,
      concept: data.concept,
      category: data.category,
      tags: data.tags,
      cognateGroup: data.cognateGroup,
      translations: {},
      createdAt: new Date().toISOString(),
    }

    // Optimistic update
    setEntries(prev => [optimistic, ...prev])

    if (!isSupabaseEnabled || !supabase) {
      return optimistic
    }

    const { data: row, error } = await supabase
      .from('entries')
      .insert({
        concept: data.concept,
        category: data.category,
        tags: data.tags,
        cognate_group: data.cognateGroup,
      })
      .select()
      .single()

    if (error) {
      // Rollback optimistic update
      setEntries(prev => prev.filter(e => e.id !== tempId))
      throw new Error(error.message)
    }

    const confirmed: Entry = { ...optimistic, id: row.id, createdAt: row.created_at }
    setEntries(prev => prev.map(e => e.id === tempId ? confirmed : e))
    return confirmed
  }, [])

  const updateTranslations = useCallback(async (
    entryId: string,
    translations: TranslationMap
  ): Promise<void> => {
    // Optimistic
    setEntries(prev =>
      prev.map(e => e.id === entryId ? { ...e, translations } : e)
    )

    if (!isSupabaseEnabled || !supabase) return

    const rows = Object.entries(translations).map(([lang_code, t]) => ({
      entry_id: entryId,
      lang_code: lang_code as LangCode,
      value: t?.value ?? '',
      romanization: t?.romanization ?? '',
      notes: t?.notes ?? '',
    }))

    const { error } = await supabase
      .from('translations')
      .upsert(rows, { onConflict: 'entry_id,lang_code' })

    if (error) throw new Error(error.message)
  }, [])

  const deleteEntry = useCallback(async (id: string): Promise<void> => {
    // Optimistic
    setEntries(prev => prev.filter(e => e.id !== id))

    if (!isSupabaseEnabled || !supabase) return

    const { error } = await supabase.from('entries').delete().eq('id', id)
    if (error) {
      // Rollback — refetch to restore
      await fetchEntries()
      throw new Error(error.message)
    }
  }, [fetchEntries])

  return { entries, status, error, addEntry, updateTranslations, deleteEntry, refetch: fetchEntries }
}
