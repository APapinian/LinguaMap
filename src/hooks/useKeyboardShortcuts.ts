// src/hooks/useKeyboardShortcuts.ts
import { useEffect, useCallback } from 'react'

type View = 'table' | 'verb' | 'grammar' | 'flash' | 'badges' | 'settings'

interface ShortcutHandlers {
  onNew: () => void
  onSearch: () => void
  onEscape: () => void
  onView: (view: View) => void
}

/**
 * Global keyboard shortcuts:
 * N           → new entry modal
 * /           → focus search
 * Escape      → close modal/search
 * 1-5         → switch views (table, verb, grammar, flash, badges)
 * Ctrl+K      → focus search (VS Code style)
 */
export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const VIEWS: View[] = ['table', 'verb', 'grammar', 'flash', 'badges']

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement
    const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable

    // Escape — always active
    if (e.key === 'Escape') {
      handlers.onEscape()
      return
    }

    // Ctrl+K — search (even in input)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      handlers.onSearch()
      return
    }

    // Skip shortcuts when typing
    if (isInput) return

    if (e.key === 'n' || e.key === 'N') {
      e.preventDefault()
      handlers.onNew()
      return
    }

    if (e.key === '/') {
      e.preventDefault()
      handlers.onSearch()
      return
    }

    const num = parseInt(e.key)
    if (num >= 1 && num <= VIEWS.length) {
      e.preventDefault()
      handlers.onView(VIEWS[num - 1])
    }
  }, [handlers]) // eslint-disable-line

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown])
}
