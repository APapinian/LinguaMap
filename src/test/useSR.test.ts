// src/test/useSR.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Test the SM-2 algorithm logic directly
// We extract the pure sm2 function for unit testing

type SRState = {
  entryId: string
  langCode: string
  interval: number
  repetition: number
  efactor: number
  dueDate: string
  lastReviewed?: string
}

function todayIso() {
  return new Date().toISOString().split('T')[0]
}

function addDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function sm2(state: SRState, quality: number): SRState {
  const q = Math.max(0, Math.min(5, quality))
  let { efactor, repetition, interval } = state

  efactor = efactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  efactor = Math.max(1.3, efactor)

  if (q < 3) {
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
    efactor: parseFloat(efactor.toFixed(4)),
    dueDate: addDays(interval),
    lastReviewed: todayIso(),
  }
}

const baseState: SRState = {
  entryId: 'test-1',
  langCode: 'it',
  interval: 0,
  repetition: 0,
  efactor: 2.5,
  dueDate: todayIso(),
}

describe('SM-2 spaced repetition algorithm', () => {
  it('perfect response (quality=5) increases interval', () => {
    const result = sm2(baseState, 5)
    expect(result.repetition).toBe(1)
    expect(result.interval).toBe(1)
    expect(result.efactor).toBeGreaterThan(2.5)
  })

  it('good response (quality=4) works correctly', () => {
    const result = sm2(baseState, 4)
    expect(result.repetition).toBe(1)
    expect(result.interval).toBe(1)
    expect(result.efactor).toBeCloseTo(2.5, 1)
  })

  it('failed response (quality=2) resets repetition', () => {
    const stateAfterReview: SRState = { ...baseState, repetition: 3, interval: 10, efactor: 2.5 }
    const result = sm2(stateAfterReview, 2)
    expect(result.repetition).toBe(0)
    expect(result.interval).toBe(1)
  })

  it('blackout (quality=0) resets and clamps efactor at 1.3', () => {
    // Multiple failures should bring efactor toward minimum
    let state = { ...baseState, efactor: 1.4 }
    state = sm2(state, 0)
    expect(state.efactor).toBeGreaterThanOrEqual(1.3)
    expect(state.repetition).toBe(0)
  })

  it('second repetition gives interval of 6', () => {
    let state = sm2(baseState, 5)           // rep 0 → 1, interval=1
    state = sm2(state, 5)                   // rep 1 → 2, interval=6
    expect(state.interval).toBe(6)
    expect(state.repetition).toBe(2)
  })

  it('third repetition multiplies by efactor', () => {
    let state = sm2(baseState, 5)           // interval=1
    state = sm2(state, 5)                   // interval=6
    const efactor = state.efactor
    state = sm2(state, 5)                   // interval = round(6 * efactor)
    expect(state.interval).toBe(Math.round(6 * efactor))
    expect(state.repetition).toBe(3)
  })

  it('dueDate is set correctly', () => {
    const result = sm2(baseState, 5)
    expect(result.dueDate).toBe(addDays(result.interval))
  })

  it('lastReviewed is set to today', () => {
    const result = sm2(baseState, 5)
    expect(result.lastReviewed).toBe(todayIso())
  })

  it('quality is clamped to 0-5', () => {
    const r1 = sm2(baseState, -1)
    const r2 = sm2(baseState, 0)
    expect(r1.efactor).toBe(r2.efactor)

    const r3 = sm2(baseState, 99)
    const r4 = sm2(baseState, 5)
    expect(r3.efactor).toBe(r4.efactor)
  })
})

describe('SM-2 progressive learning', () => {
  it('simulates a full learning sequence', () => {
    let state = { ...baseState }
    const intervals: number[] = []

    // Simulate 6 perfect reviews
    for (let i = 0; i < 6; i++) {
      state = sm2(state, 5)
      intervals.push(state.interval)
    }

    // Intervals should be increasing: 1, 6, >6, >prev...
    expect(intervals[0]).toBe(1)
    expect(intervals[1]).toBe(6)
    for (let i = 2; i < intervals.length; i++) {
      expect(intervals[i]).toBeGreaterThan(intervals[i - 1])
    }
  })

  it('recovery after failure — intervals restart', () => {
    let state = sm2(baseState, 5) // interval=1
    state = sm2(state, 5)          // interval=6
    state = sm2(state, 5)          // interval>6
    const highInterval = state.interval

    // Failure
    state = sm2(state, 1)
    expect(state.interval).toBe(1)
    expect(state.repetition).toBe(0)

    // Recovery
    state = sm2(state, 5)
    expect(state.interval).toBe(1)
    state = sm2(state, 5)
    expect(state.interval).toBe(6)
  })
})
