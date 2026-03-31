// src/hooks/useSR.ts
// SM-2 Spaced Repetition algorithm (SuperMemo 2)
// https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method

import { useState, useCallback } from 'react'
import type { SRState, LangCode } from '@/types'

const STORAGE_KEY = 'linguamap-sr'

function load(): Record<string, SRState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function save(states: Record<string, SRState>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(states)) } catch {}
}

function srKey(entryId: string, langCode: LangCode) {
  return `${entryId}__${langCode}`
}

function todayIso() {
  return new Date().toISOString().split('T')[0]
}

function addDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

/**
 * SM-2 update:
 * quality: 0-5 (0=blackout, 3=correct with effort, 5=perfect)
 */
function sm2(state: SRState, quality: number): SRState {
  const q = Math.max(0, Math.min(5, quality))
  let { efactor, repetition, interval } = state

  // Update ease factor
  efactor = efactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  efactor = Math.max(1.3, efactor)

  if (q < 3) {
    // Failed — reset
    repetition = 0
    interval = 1
  } else {
    if (repetition === 0) interval = 1
    else if (repetition === 1) interval = 6
    else interval = Math.round(interval * efactor)
    repetition += 1
  }

  return {
    ...state,
    interval,
    repetition,
    efactor,
    dueDate: addDays(interval),
    lastReviewed: todayIso(),
  }
}

interface UseSRReturn {
  isDue: (entryId: string, langCode: LangCode) => boolean
  getState: (entryId: string, langCode: LangCode) => SRState
  review: (entryId: string, langCode: LangCode, quality: number) => void
  getDueCards: (pairs: Array<{ entryId: string; langCode: LangCode }>) => Array<{ entryId: string; langCode: LangCode }>
  resetAll: () => void
}

export function useSR(): UseSRReturn {
  const [states, setStates] = useState<Record<string, SRState>>(load)

  function getOrInit(entryId: string, langCode: LangCode): SRState {
    const key = srKey(entryId, langCode)
    return states[key] ?? {
      entryId,
      langCode,
      interval: 0,
      repetition: 0,
      efactor: 2.5,
      dueDate: todayIso(),
    }
  }

  const isDue = useCallback((entryId: string, langCode: LangCode): boolean => {
    const s = states[srKey(entryId, langCode)]
    if (!s) return true // never reviewed = due
    return s.dueDate <= todayIso()
  }, [states])

  const getState = useCallback((entryId: string, langCode: LangCode): SRState => {
    return getOrInit(entryId, langCode)
  }, [states]) // eslint-disable-line

  const review = useCallback((entryId: string, langCode: LangCode, quality: number) => {
    setStates(prev => {
      const current = prev[srKey(entryId, langCode)] ?? {
        entryId, langCode, interval: 0, repetition: 0, efactor: 2.5, dueDate: todayIso(),
      }
      const next = { ...prev, [srKey(entryId, langCode)]: sm2(current, quality) }
      save(next)
      return next
    })
  }, [])

  const getDueCards = useCallback((
    pairs: Array<{ entryId: string; langCode: LangCode }>
  ) => {
    return pairs.filter(p => {
      const s = states[srKey(p.entryId, p.langCode)]
      if (!s) return true
      return s.dueDate <= todayIso()
    })
  }, [states])

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setStates({})
  }, [])

  return { isDue, getState, review, getDueCards, resetAll }
}
