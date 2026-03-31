// src/types/index.ts

export type LangCode =
  | 'it' | 'es' | 'fr' | 'la'
  | 'de' | 'en'
  | 'ru'
  | 'ja' | 'ko' | 'zh' | 'el' | 'hy' | 'kbd'

export type Family = 'roman' | 'germen' | 'slav' | 'other'

export type Category = 'verb' | 'noun' | 'adj' | 'phrase' | 'grammar'

export interface Lang {
  code: LangCode
  name: string
  flag: string
  family: Family
}

export interface Translation {
  value: string
  romanization: string
  notes: string
}

export type TranslationMap = Partial<Record<LangCode, Translation>>

export interface Entry {
  id: string
  concept: string
  category: Category
  tags: string[]
  cognateGroup: string
  translations: TranslationMap
  createdAt?: string
}

export interface NewEntry {
  concept: string
  category: Category
  tags: string[]
  cognateGroup: string
}

// Supabase row shapes
export interface EntryRow {
  id: string
  concept: string
  category: Category
  tags: string[]
  cognate_group: string
  created_at: string
}

export interface TranslationRow {
  id: string
  entry_id: string
  lang_code: LangCode
  value: string
  romanization: string
  notes: string
}

export interface ConjugationRow {
  id: string
  entry_id: string
  lang_code: LangCode
  tense: string
  person: string
  form: string
}

// Conjugation data shape for UI
export interface ConjData {
  rows: [string, string][]  // [person, form]
}

export type ConjMap = Partial<Record<LangCode, ConjData>>

// Grammar stage shape
export interface GramLang {
  code: LangCode
  flag: string
  name: string
  family: Family
  steps: string[]
  example: string
}

export interface GramStage {
  title: string
  subtitle: string
  langs: GramLang[]
}

// Badge
export interface Badge {
  id: string
  icon: string
  label: string
  earned: boolean
  desc: string
  xp: number
}

// Cognate tree
export interface CognateTreeData {
  root: string
  children: string[]
}

// Settings
export interface AppSettings {
  ollamaUrl: string
  ollamaModel: string
  visibleLangs: LangCode[]
  darkMode: boolean
}

// Flashcard pair
export interface FlashPair {
  concept: string
  lang: Lang
  val: string
  roman: string
  entryId: string
}

// Spaced repetition card state (SM-2 algorithm)
export interface SRState {
  entryId: string
  langCode: LangCode
  interval: number      // days
  repetition: number    // number of times reviewed
  efactor: number       // ease factor (default 2.5)
  dueDate: string       // ISO date string
  lastReviewed?: string
}
