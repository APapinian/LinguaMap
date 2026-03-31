// src/test/useEntries.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MOCK_ENTRIES } from '@/constants/mockData'
import type { Entry, NewEntry, TranslationMap } from '@/types'

// ---- Test the pure data-transformation logic from useEntries ----
// (Hook itself requires renderHook + real Supabase, tested via integration)

function mergeEntryRows(
  entryRows: Array<{ id: string; concept: string; category: string; tags: string[]; cognate_group: string; created_at: string }>,
  translationRows: Array<{ entry_id: string; lang_code: string; value: string; romanization: string; notes: string }>
): Entry[] {
  return entryRows.map(row => {
    const tMap: TranslationMap = {}
    translationRows
      .filter(t => t.entry_id === row.id)
      .forEach(t => {
        tMap[t.lang_code as keyof TranslationMap] = {
          value: t.value,
          romanization: t.romanization,
          notes: t.notes,
        }
      })
    return {
      id: row.id,
      concept: row.concept,
      category: row.category as Entry['category'],
      tags: row.tags ?? [],
      cognateGroup: row.cognate_group ?? '',
      translations: tMap,
      createdAt: row.created_at,
    }
  })
}

describe('Entry data merging', () => {
  const entryRows = [
    { id: '1', concept: 'to love', category: 'verb', tags: ['duygu'], cognate_group: 'amor-group', created_at: '2024-01-01T00:00:00Z' },
    { id: '2', concept: 'water',   category: 'noun', tags: [],         cognate_group: '',           created_at: '2024-01-02T00:00:00Z' },
  ]

  const translationRows = [
    { entry_id: '1', lang_code: 'it', value: 'amare',  romanization: '',     notes: '< Lat. amare' },
    { entry_id: '1', lang_code: 'en', value: 'to love',romanization: '',     notes: ''             },
    { entry_id: '2', lang_code: 'it', value: 'acqua',  romanization: '',     notes: '< Lat. aqua'  },
    { entry_id: '2', lang_code: 'ru', value: 'вода',   romanization: 'voda', notes: ''             },
  ]

  it('merges entries with their translations', () => {
    const merged = mergeEntryRows(entryRows, translationRows)
    expect(merged).toHaveLength(2)
    expect(merged[0].translations['it']?.value).toBe('amare')
    expect(merged[0].translations['en']?.value).toBe('to love')
    expect(merged[1].translations['ru']?.romanization).toBe('voda')
  })

  it('sets cognateGroup from cognate_group column', () => {
    const merged = mergeEntryRows(entryRows, translationRows)
    expect(merged[0].cognateGroup).toBe('amor-group')
    expect(merged[1].cognateGroup).toBe('')
  })

  it('handles empty translations gracefully', () => {
    const merged = mergeEntryRows(entryRows, [])
    expect(merged[0].translations).toEqual({})
    expect(merged[1].translations).toEqual({})
  })

  it('handles entries with no matching translations', () => {
    const merged = mergeEntryRows(entryRows, [
      { entry_id: '99', lang_code: 'it', value: 'test', romanization: '', notes: '' },
    ])
    expect(merged[0].translations).toEqual({})
  })
})

describe('Mock entries integrity', () => {
  it('all mock entries have required fields', () => {
    MOCK_ENTRIES.forEach(entry => {
      expect(entry.id).toBeTruthy()
      expect(entry.concept).toBeTruthy()
      expect(['verb', 'noun', 'adj', 'phrase', 'grammar']).toContain(entry.category)
      expect(Array.isArray(entry.tags)).toBe(true)
      expect(typeof entry.translations).toBe('object')
    })
  })

  it('translations have correct shape', () => {
    MOCK_ENTRIES.forEach(entry => {
      Object.values(entry.translations).forEach(t => {
        expect(typeof t?.value).toBe('string')
        expect(typeof t?.romanization).toBe('string')
        expect(typeof t?.notes).toBe('string')
      })
    })
  })

  it('has entries for all expected categories', () => {
    const cats = new Set(MOCK_ENTRIES.map(e => e.category))
    expect(cats.has('verb')).toBe(true)
    expect(cats.has('noun')).toBe(true)
    expect(cats.has('adj')).toBe(true)
    expect(cats.has('phrase')).toBe(true)
  })
})

describe('Smart search filtering logic', () => {
  function filterEntries(entries: Entry[], query: string): Entry[] {
    if (!query) return entries
    const q = query.toLowerCase()
    return entries.filter(e => {
      const inConcept  = e.concept.toLowerCase().includes(q)
      const inTags     = e.tags.some(t => t.toLowerCase().includes(q))
      const inTrans    = Object.values(e.translations).some(t => t?.value?.toLowerCase().includes(q))
      return inConcept || inTags || inTrans
    })
  }

  it('filters by concept', () => {
    const r = filterEntries(MOCK_ENTRIES, 'love')
    expect(r.some(e => e.concept === 'to love')).toBe(true)
  })

  it('filters by tag', () => {
    const r = filterEntries(MOCK_ENTRIES, 'duygu')
    expect(r.length).toBeGreaterThan(0)
    expect(r.every(e => e.tags.some(t => t.includes('duygu')))).toBe(true)
  })

  it('filters by translation value', () => {
    const r = filterEntries(MOCK_ENTRIES, 'amare')
    expect(r.some(e => e.concept === 'to love')).toBe(true)
  })

  it('returns empty array for no match', () => {
    const r = filterEntries(MOCK_ENTRIES, 'xyznotexist')
    expect(r).toHaveLength(0)
  })

  it('returns all entries for empty query', () => {
    const r = filterEntries(MOCK_ENTRIES, '')
    expect(r).toHaveLength(MOCK_ENTRIES.length)
  })

  it('search is case-insensitive', () => {
    const r1 = filterEntries(MOCK_ENTRIES, 'LOVE')
    const r2 = filterEntries(MOCK_ENTRIES, 'love')
    expect(r1).toEqual(r2)
  })
})
