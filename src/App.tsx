// src/App.tsx
import { useState, useCallback, useRef } from 'react'
import {
  Box, Typography, Stack, Chip, Fab, Snackbar,
  List, ListItemButton, ListItemIcon, ListItemText,
  IconButton, Tooltip, Badge, alpha, Divider,
} from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

// Icons
import GridViewIcon from '@mui/icons-material/GridView'
import LoopIcon from '@mui/icons-material/Loop'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import StyleIcon from '@mui/icons-material/Style'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SettingsIcon from '@mui/icons-material/Settings'
import AddIcon from '@mui/icons-material/Add'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import StarIcon from '@mui/icons-material/Star'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import AccountTreeIcon from '@mui/icons-material/AccountTree'

import { lightTheme, darkTheme } from '@/theme/m3Theme'
import { useEntries } from '@/hooks/useEntries'
import { useOllama } from '@/hooks/useOllama'
import { useSettings } from '@/hooks/useSettings'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { isSupabaseEnabled } from '@/lib/supabase'

import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { TableViewSkeleton, VerbViewSkeleton, FlashcardSkeleton } from '@/components/common/Skeletons'

// Lazy views — code splitting
import TableView     from '@/components/views/TableView'
import VerbView      from '@/components/views/VerbView'
import GrammarView   from '@/components/views/GrammarView'
import FlashcardView from '@/components/views/FlashcardView'
import BadgesView    from '@/components/views/BadgesView'
import SettingsView  from '@/components/views/SettingsView'
import CognateGraph  from '@/components/views/CognateGraph'
import AddEntryModal from '@/components/modals/AddEntryModal'

type View = 'table' | 'verb' | 'grammar' | 'flash' | 'badges' | 'settings' | 'graph'

const NAV_ITEMS: Array<{ id: View; label: string; icon: React.ReactNode; shortcut: string }> = [
  { id: 'table',    label: 'Tablo',     icon: <GridViewIcon />,     shortcut: '1' },
  { id: 'verb',     label: 'Fiiller',   icon: <LoopIcon />,         shortcut: '2' },
  { id: 'grammar',  label: 'Gramer',    icon: <AutoStoriesIcon />,  shortcut: '3' },
  { id: 'flash',    label: 'Flashcard', icon: <StyleIcon />,        shortcut: '4' },
  { id: 'badges',   label: 'Rozetler',       icon: <EmojiEventsIcon />,  shortcut: '5' },
  { id: 'graph',    label: 'Cognate Graf',    icon: <AccountTreeIcon />,  shortcut: '6' },
  { id: 'settings', label: 'Ayarlar',         icon: <SettingsIcon />,     shortcut: '' },
]

const RAIL_W    = 72
const DRAWER_W  = 220

const VIEW_TITLES: Record<View, string> = {
  table: 'Kavramlar', verb: 'Fiil Çekimi',
  grammar: 'Gramer Aşamaları', flash: 'Flashcard',
  badges: 'Rozetler & XP', settings: 'Ayarlar',
  graph: 'Cognate Force Graph',
}

function AppShell() {
  const { settings, updateSettings, resetSettings } = useSettings()
  const [view, setView]         = useState<View>('table')
  const [expanded, setExpanded] = useState(false)
  const [modal, setModal]       = useState(false)
  const [snack, setSnack]       = useState('')
  const [xp, setXp]             = useState(2840)
  const [streak]                = useState(14)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const searchRef               = useRef<HTMLInputElement>(null)

  const isDark = settings.darkMode

  const { entries, status, error, addEntry, updateTranslations } = useEntries()
  const { autoTranslate, translating, ollamaError } = useOllama()

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNew:    () => setModal(true),
    onSearch: () => { setView('table'); setTimeout(() => searchRef.current?.focus(), 100) },
    onEscape: () => { setModal(false) },
    onView:   (v) => setView(v as View),
  })

  async function handleSave(data: { concept: string; category: string; tags: string[]; cognateGroup: string }) {
    try {
      const entry = await addEntry({
        concept: data.concept,
        category: data.category as any,
        tags: data.tags,
        cognateGroup: data.cognateGroup,
      })
      setModal(false)
      setSnack('✨ Kavram eklendi! Ollama çeviriyor...')
      setXp(p => p + 50)

      const translations = await autoTranslate(data.concept, data.category as any)
      if (translations) {
        await updateTranslations(entry.id, translations)
        setSnack('✅ 13 dile çevrildi!')
      }
    } catch (e) {
      setSnack('Hata: ' + (e instanceof Error ? e.message : String(e)))
    }
  }

  const drawerBg = isDark ? '#1C1B1F' : '#E6E0F0'

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ── NAVIGATION RAIL ── */}
      <Box sx={{
        width: expanded ? DRAWER_W : RAIL_W,
        minWidth: expanded ? DRAWER_W : RAIL_W,
        bgcolor: drawerBg,
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden', zIndex: 10,
      }}>
        {/* Logo row */}
        <Stack direction="row" alignItems="center"
          px={expanded ? 1.5 : 1} py={1.75} gap={1}
          sx={{ minHeight: 64, overflow: 'hidden' }}
        >
          <IconButton size="small" onClick={() => setExpanded(p => !p)} sx={{ borderRadius: 2, flexShrink: 0 }}>
            {expanded ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          {expanded && (
            <Typography variant="titleLarge"
              sx={{ color: isDark ? '#BAC3FF' : '#4355B9', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              🗺 LinguaMap
            </Typography>
          )}
        </Stack>

        {/* Nav */}
        <List dense sx={{ flex: 1, px: 0.5, gap: 0.5, display: 'flex', flexDirection: 'column' }}>
          {NAV_ITEMS.map(item => {
            const active = view === item.id
            return (
              <Tooltip key={item.id} title={!expanded ? `${item.label}${item.shortcut ? ` [${item.shortcut}]` : ''}` : ''} placement="right">
                <ListItemButton
                  selected={active}
                  onClick={() => setView(item.id)}
                  sx={{
                    borderRadius: expanded ? '28px' : '16px',
                    minHeight: 48, mx: expanded ? 0.75 : 0.5,
                    px: expanded ? 2 : 1,
                    justifyContent: expanded ? 'flex-start' : 'center',
                    flexDirection: expanded ? 'row' : 'column',
                    gap: expanded ? 1.5 : 0.25,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 'unset', justifyContent: 'center', color: 'inherit' }}>
                    {item.id === 'badges'
                      ? <Badge badgeContent={4} color="error"><EmojiEventsIcon /></Badge>
                      : item.icon}
                  </ListItemIcon>
                  {expanded
                    ? <ListItemText primary={item.label}
                        primaryTypographyProps={{ variant: 'labelLarge' }} />
                    : <Typography variant="labelSmall"
                        sx={{ fontSize: '0.6rem', textAlign: 'center', lineHeight: 1.2 }}>
                        {item.label}
                      </Typography>
                  }
                  {expanded && item.shortcut && (
                    <Typography variant="labelSmall"
                      sx={{ ml: 'auto', opacity: 0.4, fontSize: '0.65rem', bgcolor: 'action.hover', px: 0.75, py: 0.25, borderRadius: 1 }}>
                      {item.shortcut}
                    </Typography>
                  )}
                </ListItemButton>
              </Tooltip>
            )
          })}
        </List>

        {/* Bottom: streak + XP */}
        <Box sx={{ px: expanded ? 1.5 : 0.5, pb: 2 }}>
          <Divider sx={{ mb: 1.5 }} />
          <Stack direction={expanded ? 'row' : 'column'} alignItems="center" gap={0.5}
            sx={{ justifyContent: expanded ? 'flex-start' : 'center' }}>
            <Chip
              icon={<LocalFireDepartmentIcon sx={{ fontSize: '14px !important', color: '#E65100 !important' }} />}
              label={expanded ? `${streak} gün seri` : streak}
              size="small"
              sx={{ bgcolor: '#FFF3E0', color: '#E65100', fontWeight: 700, fontSize: '0.7rem', height: 24 }}
            />
            <Chip
              icon={<StarIcon sx={{ fontSize: '13px !important', color: '#B8860B !important' }} />}
              label={expanded ? `${xp.toLocaleString()} XP` : `${Math.round(xp/1000)}k`}
              size="small"
              sx={{ bgcolor: '#FFF9E0', color: '#7a5a00', fontWeight: 700, fontSize: '0.7rem', height: 24 }}
            />
          </Stack>
        </Box>
      </Box>

      {/* ── MAIN ── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {/* Top bar */}
        <Box sx={{
          height: 56, minHeight: 56, display: 'flex', alignItems: 'center',
          px: 2, gap: 1.5,
          bgcolor: 'background.paper',
          borderBottom: `1px solid`, borderColor: 'divider',
        }}>
          <Typography variant="titleLarge" sx={{ flex: 1 }}>{VIEW_TITLES[view]}</Typography>
          <Chip label={`${entries.length} kavram`} size="small"
            sx={{ bgcolor: isDark ? '#444559' : '#E1E0F9', color: isDark ? '#E1E0F9' : '#191A2C', fontWeight: 700 }} />
          <Tooltip title="Klavye kısayolları (N=yeni, /=ara, 1-5=görünüm)">
            <IconButton size="small" onClick={() => setShowShortcuts(p => !p)}>
              <KeyboardIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={isDark ? 'Açık tema' : 'Koyu tema'}>
            <IconButton size="small" onClick={() => updateSettings({ darkMode: !isDark })}>
              {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Supabase/error banner */}
        {error && (
          <Box sx={{ bgcolor: '#FFF3E0', borderBottom: '1px solid #FFE0B2', px: 2, py: 0.75 }}>
            <Typography variant="bodySmall" sx={{ color: '#E65100' }}>
              ⚠ Supabase bağlantısı yok — mock veri gösteriliyor. ({error})
            </Typography>
          </Box>
        )}

        {/* View content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <ErrorBoundary>
            {view === 'table' && (
              status === 'loading'
                ? <TableViewSkeleton />
                : <TableView entries={entries} searchRef={searchRef} />
            )}
            {view === 'verb' && (
              status === 'loading' ? <VerbViewSkeleton /> : <VerbView />
            )}
            {view === 'grammar' && <GrammarView />}
            {view === 'flash' && (
              status === 'loading'
                ? <FlashcardSkeleton />
                : <FlashcardView entries={entries} onXp={v => setXp(p => p + v)} />
            )}
            {view === 'badges'   && <BadgesView xp={xp} />}
            {view === 'graph'    && <CognateGraph entries={entries} />}
            {view === 'settings' && (
              <SettingsView
                settings={settings}
                onUpdate={updateSettings}
                onReset={resetSettings}
                isSupabaseEnabled={isSupabaseEnabled}
              />
            )}
          </ErrorBoundary>
        </Box>

        {/* FAB */}
        <Tooltip title="Yeni kavram ekle [N]">
          <Fab size="medium" onClick={() => setModal(true)}
            sx={{ position: 'absolute', right: 24, bottom: 24 }}>
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>

      {/* Modal */}
      <AddEntryModal
        open={modal}
        onClose={() => setModal(false)}
        onSave={handleSave}
        translating={translating}
        ollamaError={ollamaError}
      />

      {/* Snackbar */}
      <Snackbar
        open={!!snack} autoHideDuration={3200}
        onClose={() => setSnack('')}
        message={snack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  )
}

export default function App() {
  const { settings } = useSettings()
  return (
    <ThemeProvider theme={settings.darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <AppShell />
    </ThemeProvider>
  )
}
