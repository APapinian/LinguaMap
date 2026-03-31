// src/test/cognateGraph.test.ts
import { describe, it, expect } from 'vitest'
import { COGNATE_TREES, LANGS, VERB_CONJUGATIONS } from '@/constants/languages'
import type { Entry } from '@/types'

// ── Cognate tree data integrity ──────────────────────────────────────────
describe('Cognate tree data', () => {
  it('all cognate groups have a root', () => {
    Object.values(COGNATE_TREES).forEach(tree => {
      expect(tree.root).toBeTruthy()
      expect(typeof tree.root).toBe('string')
    })
  })

  it('all cognate groups have at least 2 children', () => {
    Object.values(COGNATE_TREES).forEach(tree => {
      expect(tree.children.length).toBeGreaterThanOrEqual(2)
    })
  })

  it('children are formatted as "code: value"', () => {
    Object.values(COGNATE_TREES).forEach(tree => {
      tree.children.forEach(child => {
        expect(child).toMatch(/^[a-z]+:/)
      })
    })
  })
})

// ── Graph building logic ─────────────────────────────────────────────────
describe('CognateGraph node building', () => {
  const mockEntries: Entry[] = [
    {
      id: '1', concept: 'to love', category: 'verb',
      tags: [], cognateGroup: 'amor-group',
      translations: {
        it: { value: 'amare',  romanization: '', notes: '' },
        es: { value: 'amar',   romanization: '', notes: '' },
        fr: { value: 'aimer',  romanization: '', notes: '' },
        la: { value: 'amare',  romanization: '', notes: '' },
        de: { value: 'lieben', romanization: '', notes: '' },
        en: { value: 'to love',romanization: '', notes: '' },
      },
    },
    {
      id: '2', concept: 'water', category: 'noun',
      tags: [], cognateGroup: 'aqua-group',
      translations: {
        it: { value: 'acqua', romanization: '', notes: '' },
        es: { value: 'agua',  romanization: '', notes: '' },
      },
    },
    {
      id: '3', concept: 'no group', category: 'noun',
      tags: [], cognateGroup: '',
      translations: { en: { value: 'test', romanization: '', notes: '' } },
    },
  ]

  function buildGraph(entries: Entry[]) {
    const nodes: Array<{ id: string; type: string; group: string }> = []
    const links: Array<{ source: string; target: string }> = []
    const nodeIds = new Set<string>()

    const addNode = (id: string, type: string, group: string) => {
      if (!nodeIds.has(id)) { nodes.push({ id, type, group }); nodeIds.add(id) }
    }

    const grouped = entries.filter(e => e.cognateGroup)
    const groups = [...new Set(grouped.map(e => e.cognateGroup))]

    groups.forEach(group => {
      const rootId = `root__${group}`
      addNode(rootId, 'root', group)
      entries.filter(e => e.cognateGroup === group).forEach(entry => {
        LANGS.forEach(lang => {
          const t = entry.translations?.[lang.code]
          if (!t?.value) return
          const langId = `lang__${group}__${lang.code}`
          addNode(langId, 'lang', group)
          const linkExists = links.some(l => l.source === rootId && l.target === langId)
          if (!linkExists) links.push({ source: rootId, target: langId })
        })
      })
    })
    return { nodes, links }
  }

  it('creates root nodes for each cognate group', () => {
    const { nodes } = buildGraph(mockEntries)
    const roots = nodes.filter(n => n.type === 'root')
    expect(roots).toHaveLength(2) // amor-group + aqua-group
    expect(roots.map(r => r.group)).toContain('amor-group')
    expect(roots.map(r => r.group)).toContain('aqua-group')
  })

  it('creates lang nodes only for translations with values', () => {
    const { nodes } = buildGraph(mockEntries)
    const langNodes = nodes.filter(n => n.type === 'lang')
    expect(langNodes.length).toBeGreaterThan(0)
    // 6 langs for to-love + 2 langs for water
    expect(langNodes.length).toBe(8)
  })

  it('does not create nodes for entries without cognate groups', () => {
    const { nodes } = buildGraph(mockEntries)
    // No node for entry with id 3 (no cognateGroup)
    const testNode = nodes.find(n => n.id.includes('3'))
    expect(testNode).toBeUndefined()
  })

  it('creates links from root to each lang node', () => {
    const { links } = buildGraph(mockEntries)
    const amorLinks = links.filter(l => l.source === 'root__amor-group')
    expect(amorLinks).toHaveLength(6)
  })

  it('no duplicate node IDs', () => {
    const { nodes } = buildGraph(mockEntries)
    const ids = nodes.map(n => n.id)
    const unique = new Set(ids)
    expect(ids.length).toBe(unique.size)
  })
})

// ── Expanded verb conjugation data ───────────────────────────────────────
describe('Expanded verb conjugations', () => {
  const verbs = Object.keys(VERB_CONJUGATIONS)

  it('has 3 verbs', () => {
    expect(verbs).toHaveLength(3)
    expect(verbs).toContain('to love')
    expect(verbs).toContain('to be')
    expect(verbs).toContain('to go')
  })

  it('each verb has data for at least 10 languages', () => {
    verbs.forEach(verb => {
      const langCount = Object.keys(VERB_CONJUGATIONS[verb]).length
      expect(langCount).toBeGreaterThanOrEqual(10)
    })
  })

  it('each verb-language pair has an infinitive', () => {
    verbs.forEach(verb => {
      Object.values(VERB_CONJUGATIONS[verb]).forEach(data => {
        expect(data?.infinitive).toBeTruthy()
        expect(typeof data?.infinitive).toBe('string')
      })
    })
  })

  it('each verb-language pair has at least 2 tenses', () => {
    verbs.forEach(verb => {
      Object.values(VERB_CONJUGATIONS[verb]).forEach(data => {
        expect(data?.tenses.length).toBeGreaterThanOrEqual(2)
      })
    })
  })

  it('each tense has at least 1 conjugation row', () => {
    verbs.forEach(verb => {
      Object.values(VERB_CONJUGATIONS[verb]).forEach(data => {
        data?.tenses.forEach(tense => {
          expect(tense.rows.length).toBeGreaterThanOrEqual(1)
          tense.rows.forEach(([person, form]) => {
            expect(typeof person).toBe('string')
            expect(typeof form).toBe('string')
          })
        })
      })
    })
  })

  it('all major languages have Geniş Zaman', () => {
    const majorLangs = ['it', 'es', 'fr', 'de', 'en', 'ru', 'ja', 'ko']
    verbs.forEach(verb => {
      majorLangs.forEach(lang => {
        const data = VERB_CONJUGATIONS[verb][lang as keyof typeof VERB_CONJUGATIONS[typeof verbs[0]]]
        const hasPresent = data?.tenses.some(t => t.tense === 'Geniş Zaman')
        expect(hasPresent).toBe(true)
      })
    })
  })

  it('all major languages have Geçmiş Zaman', () => {
    const majorLangs = ['it', 'es', 'fr', 'de', 'en', 'ru', 'ja']
    verbs.forEach(verb => {
      majorLangs.forEach(lang => {
        const data = VERB_CONJUGATIONS[verb][lang as keyof typeof VERB_CONJUGATIONS[typeof verbs[0]]]
        const hasPast = data?.tenses.some(t => t.tense === 'Geçmiş Zaman')
        expect(hasPast).toBe(true)
      })
    })
  })
})

// ── Keyboard shortcut logic ───────────────────────────────────────────────
describe('Keyboard shortcut view mapping', () => {
  const viewMap: Record<string, string> = {
    '1': 'table', '2': 'verb', '3': 'grammar', '4': 'flash', '5': 'badges'
  }

  it('maps digit keys 1-5 to correct views', () => {
    expect(viewMap['1']).toBe('table')
    expect(viewMap['2']).toBe('verb')
    expect(viewMap['3']).toBe('grammar')
    expect(viewMap['4']).toBe('flash')
    expect(viewMap['5']).toBe('badges')
  })

  it('has exactly 5 view mappings', () => {
    expect(Object.keys(viewMap)).toHaveLength(5)
  })

  function shouldIgnoreShortcut(tagName: string, isContentEditable: boolean): boolean {
    return ['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName) || isContentEditable
  }

  it('ignores shortcuts when focus is on input', () => {
    expect(shouldIgnoreShortcut('INPUT', false)).toBe(true)
    expect(shouldIgnoreShortcut('TEXTAREA', false)).toBe(true)
    expect(shouldIgnoreShortcut('SELECT', false)).toBe(true)
  })

  it('ignores shortcuts when contentEditable', () => {
    expect(shouldIgnoreShortcut('DIV', true)).toBe(true)
  })

  it('allows shortcuts on regular elements', () => {
    expect(shouldIgnoreShortcut('BODY', false)).toBe(false)
    expect(shouldIgnoreShortcut('DIV', false)).toBe(false)
    expect(shouldIgnoreShortcut('MAIN', false)).toBe(false)
  })
})

// ── Settings persistence ─────────────────────────────────────────────────
describe('Settings logic', () => {
  const DEFAULT = {
    ollamaUrl: 'http://localhost:11434',
    ollamaModel: 'qwen2.5:7b',
    visibleLangs: LANGS.map(l => l.code),
    darkMode: false,
  }

  it('default settings have all 13 languages visible', () => {
    expect(DEFAULT.visibleLangs).toHaveLength(13)
  })

  it('default dark mode is false', () => {
    expect(DEFAULT.darkMode).toBe(false)
  })

  it('language toggle enforces minimum 2 visible languages', () => {
    function toggleLang(current: string[], code: string): string[] {
      if (current.includes(code)) {
        if (current.length <= 2) return current // min 2
        return current.filter(c => c !== code)
      }
      return [...current, code]
    }

    let langs = ['en', 'it']
    langs = toggleLang(langs, 'en') // trying to remove when only 2 left
    expect(langs).toHaveLength(2)
    expect(langs).toContain('en')

    langs = ['en', 'it', 'fr']
    langs = toggleLang(langs, 'fr')
    expect(langs).toHaveLength(2)
    expect(langs).not.toContain('fr')
  })

  it('merges partial settings with defaults', () => {
    function mergeSettings(defaults: typeof DEFAULT, saved: Partial<typeof DEFAULT>): typeof DEFAULT {
      return { ...defaults, ...saved }
    }

    const saved = { darkMode: true }
    const merged = mergeSettings(DEFAULT, saved)
    expect(merged.darkMode).toBe(true)
    expect(merged.ollamaModel).toBe('qwen2.5:7b') // from defaults
    expect(merged.visibleLangs).toHaveLength(13)  // from defaults
  })
})
