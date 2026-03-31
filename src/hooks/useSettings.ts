// src/hooks/useSettings.ts
import { useState, useCallback } from 'react'
import type { AppSettings } from '@/types'
import { DEFAULT_SETTINGS } from '@/constants/languages'

const STORAGE_KEY = 'linguamap-settings'

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } as AppSettings
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

interface UseSettingsReturn {
  settings: AppSettings
  updateSettings: (patch: Partial<AppSettings>) => void
  resetSettings: () => void
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<AppSettings>(loadSettings)

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...patch }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const resetSettings = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setSettings({ ...DEFAULT_SETTINGS })
  }, [])

  return { settings, updateSettings, resetSettings }
}
