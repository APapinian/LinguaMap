// src/hooks/useOllama.js
import { useState, useCallback } from 'react'

const BASE_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434'
const MODEL    = import.meta.env.VITE_OLLAMA_MODEL || 'qwen2.5:7b'

export function useOllama() {
  const [translating, setTranslating] = useState(false)
  const [ollamaError, setOllamaError] = useState(null)

  const autoTranslate = useCallback(async (concept, category) => {
    setTranslating(true)
    setOllamaError(null)
    try {
      const prompt = `You are a precise multilingual lexicographer.
Translate the concept "${concept}" (category: ${category}) into these 13 languages.
Respond ONLY with a JSON object — no markdown, no preamble, no explanation.
Keys: it, es, fr, la, de, en, ru, ja, ko, zh, el, hy, kbd
Each value must be: { "value": "...", "romanization": "...", "notes": "..." }
romanization: provide only for non-latin scripts (ru, ja, ko, zh, el, hy), empty string otherwise.
notes: brief etymological note if there is a cognate relation to another language in the list, else empty string.`

      const res = await fetch(`${BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: MODEL, prompt, stream: false, format: 'json' }),
      })
      if (!res.ok) throw new Error(`Ollama ${res.status}`)
      const data = await res.json()
      const parsed = JSON.parse(data.response)
      return parsed
    } catch (err) {
      setOllamaError(err.message)
      return null
    } finally {
      setTranslating(false)
    }
  }, [])

  return { autoTranslate, translating, ollamaError }
}
