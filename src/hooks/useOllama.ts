// src/hooks/useOllama.ts
import { useState, useCallback } from 'react'
import type { TranslationMap, Category, LangCode } from '@/types'
import { useSettings } from './useSettings'

interface UseOllamaReturn {
  autoTranslate: (concept: string, category: Category) => Promise<TranslationMap | null>
  translating: boolean
  ollamaError: string | null
}

export function useOllama(): UseOllamaReturn {
  const { settings } = useSettings()
  const [translating, setTranslating] = useState(false)
  const [ollamaError, setOllamaError] = useState<string | null>(null)

  const autoTranslate = useCallback(async (
    concept: string,
    category: Category
  ): Promise<TranslationMap | null> => {
    setTranslating(true)
    setOllamaError(null)

    const prompt = `You are a precise multilingual lexicographer.
Translate the concept "${concept}" (category: ${category}) into these 13 languages.
Respond ONLY with a valid JSON object. No markdown, no preamble, no explanation.
Keys must be exactly: it, es, fr, la, de, en, ru, ja, ko, zh, el, hy, kbd
Each value must be: { "value": "...", "romanization": "...", "notes": "..." }
Rules:
- romanization: IPA-adjacent romanization for non-latin scripts (ru, ja, ko, zh, el, hy). Empty string for latin scripts.
- notes: a very brief etymological note if there is a cognate relationship with another language in the list. Empty string otherwise.
Do NOT include any key other than the 13 language codes.`

    try {
      const res = await fetch(`${settings.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: settings.ollamaModel,
          prompt,
          stream: false,
          format: 'json',
        }),
        signal: AbortSignal.timeout(60_000), // 60s timeout
      })

      if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`)

      const data = await res.json() as { response: string }
      const raw = JSON.parse(data.response) as Record<string, unknown>

      // Validate & clean output
      const result: TranslationMap = {}
      for (const [k, v] of Object.entries(raw)) {
        const code = k as LangCode
        if (typeof v === 'object' && v !== null) {
          const t = v as Record<string, unknown>
          result[code] = {
            value:         typeof t.value === 'string'         ? t.value         : '',
            romanization:  typeof t.romanization === 'string'  ? t.romanization  : '',
            notes:         typeof t.notes === 'string'         ? t.notes         : '',
          }
        }
      }

      return result
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ollama hatası'
      setOllamaError(msg)
      return null
    } finally {
      setTranslating(false)
    }
  }, [settings.ollamaUrl, settings.ollamaModel])

  return { autoTranslate, translating, ollamaError }
}
