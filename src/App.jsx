// src/App.jsx
import { useState, useCallback } from 'react'
import {
  Box, Typography, Stack, Avatar, Chip, Fab, Snackbar,
  List, ListItemButton, ListItemIcon, ListItemText,
  Drawer, IconButton, Tooltip, Badge, alpha, Divider,
} from '@mui/material'
import { ThemeProvider, useTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

// Icons
import GridViewIcon from '@mui/icons-material/GridView'
import LoopIcon from '@mui/icons-material/Loop'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import StyleIcon from '@mui/icons-material/Style'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import AddIcon from '@mui/icons-material/Add'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import StarIcon from '@mui/icons-material/Star'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

import { lightTheme, darkTheme } from './theme/m3Theme'
import { useEntries } from './hooks/useEntries'
import { useOllama } from './hooks/useOllama'

import TableView    from './components/views/TableView'
import VerbView     from './components/views/VerbView'
import GrammarView  from './components/views/GrammarView'
import FlashcardView from './components/views/FlashcardView'
import BadgesView   from './components/views/BadgesView'
import AddEntryModal from './components/modals/AddEntryModal'

const DRAWER_W  = 220
const RAIL_W    = 72

const NAV_ITEMS = [
  { id: 'table',   label: 'Tablo',    icon: <GridViewIcon />     },
  { id: 'verb',    label: 'Fiiller',  icon: <LoopIcon />         },
  { id: 'grammar', label: 'Gramer',   icon: <AutoStoriesIcon />  },
  { id: 'flash',   label: 'Flashcard',icon: <StyleIcon />        },
  { id: 'badges',  label: 'Rozetler', icon: <EmojiEventsIcon />  },
]

function AppShell() {
  const theme    = useTheme()
  const c        = theme.palette.m3
  const isDark   = theme.palette.mode === 'dark'
  const [view, setView]         = useState('table')
  const [expanded, setExpanded] = useState(false)
  const [modal, setModal]       = useState(false)
  const [snack, setSnack]       = useState('')
  const [xp, setXp]             = useState(2840)
  const [streak]                = useState(14)

  const { entries, loading, addEntry, updateTranslations } = useEntries()
  const { autoTranslate, translating, ollamaError }         = useOllama()

  async function handleSave(data) {
    try {
      const entry = await addEntry(data)
      setModal(false)
      setSnack('✨ Kavram eklendi! Çeviriliyor...')
      setXp(p => p + 50)
      const translations = await autoTranslate(data.concept, data.category)
      if (translations) {
        await updateTranslations(entry.id, translations)
        setSnack('✅ 13 dile çevrildi!')
      }
    } catch (e) {
      setSnack('Hata: ' + e.message)
    }
  }

  const drawerBg = isDark ? '#1C1B1F' : c.surfaceVariant

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: theme.palette.background.default, overflow: 'hidden' }}>

      {/* ── NAVIGATION RAIL / DRAWER ── */}
      <Box sx={{
        width: expanded ? DRAWER_W : RAIL_W,
        minWidth: expanded ? DRAWER_W : RAIL_W,
        bgcolor: drawerBg,
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        zIndex: 10,
      }}>
        {/* Logo row */}
        <Stack direction="row" alignItems="center" px={expanded ? 1.5 : 1} py={1.75} gap={1}
          sx={{ minHeight: 64, overflow: 'hidden' }}>
          <IconButton size="small" onClick={() => setExpanded(p => !p)}
            sx={{ borderRadius: 2, flexShrink: 0 }}>
            {expanded ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          {expanded && (
            <Typography variant="titleLarge" sx={{ color: theme.palette.primary.main, whiteSpace: 'nowrap', overflow: 'hidden' }}>
              LinguaMap
            </Typography>
          )}
        </Stack>

        {/* Nav items */}
        <List dense sx={{ flex: 1, px: 0.5, gap: 0.5, display: 'flex', flexDirection: 'column' }}>
          {NAV_ITEMS.map(item => {
            const active = view === item.id
            return (
              <ListItemButton key={item.id} selected={active}
                onClick={() => setView(item.id)}
                sx={{
                  borderRadius: expanded ? '28px' : '16px',
                  minHeight: 48,
                  mx: expanded ? 0.75 : 0.5,
                  px: expanded ? 2 : 1,
                  justifyContent: expanded ? 'flex-start' : 'center',
                  flexDirection: expanded ? 'row' : 'column',
                  gap: expanded ? 1.5 : 0.25,
                }}>
                <ListItemIcon sx={{
                  minWidth: 'unset',
                  color: active ? c.onPrimaryContainer : theme.palette.text.secondary,
                  justifyContent: 'center',
                }}>
                  {item.icon}
                </ListItemIcon>
                {expanded
                  ? <ListItemText primary={item.label}
                      primaryTypographyProps={{ variant: 'labelLarge', sx: { color: active ? c.onPrimaryContainer : theme.palette.text.primary } }} />
                  : <Typography variant="labelSmall" sx={{ fontSize: '0.6rem', color: active ? c.onPrimaryContainer : theme.palette.text.secondary, textAlign: 'center' }}>
                      {item.label}
                    </Typography>
                }
              </ListItemButton>
            )
          })}
        </List>

        {/* Streak + XP bottom */}
        <Box sx={{ px: expanded ? 1.5 : 0.5, pb: 2 }}>
          <Divider sx={{ mb: 1.5 }} />
          <Stack
            direction={expanded ? 'row' : 'column'}
            alignItems="center" gap={expanded ? 1 : 0.5}
            sx={{ px: expanded ? 0.5 : 0, justifyContent: expanded ? 'flex-start' : 'center' }}
          >
            <Chip
              icon={<LocalFireDepartmentIcon sx={{ fontSize: '14px !important', color: '#E65100 !important' }} />}
              label={expanded ? `${streak} gün seri` : streak}
              size="small"
              sx={{ bgcolor: '#FFF3E0', color: '#E65100', fontWeight: 700, fontSize: '0.7rem',
                height: 24, maxWidth: expanded ? 'none' : 52 }}
            />
            <Chip
              icon={<StarIcon sx={{ fontSize: '13px !important', color: '#B8860B !important' }} />}
              label={expanded ? `${xp.toLocaleString()} XP` : xp > 999 ? `${Math.round(xp/1000)}k` : xp}
              size="small"
              sx={{ bgcolor: '#FFF9E0', color: '#7a5a00', fontWeight: 700, fontSize: '0.7rem',
                height: 24, maxWidth: expanded ? 'none' : 52 }}
            />
          </Stack>
        </Box>
      </Box>

      {/* ── MAIN AREA ── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

        {/* Top app bar */}
        <Box sx={{
          height: 56, minHeight: 56,
          display: 'flex', alignItems: 'center',
          px: 2, gap: 1,
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${c.outlineVariant}`,
        }}>
          <Typography variant="titleLarge" sx={{ flex: 1 }}>
            {{ table:'Kavramlar', verb:'Fiil Çekimi', grammar:'Gramer Aşamaları', flash:'Flashcard', badges:'Rozetler & XP' }[view]}
          </Typography>
          <Chip
            label={`${entries.length} kavram`} size="small"
            sx={{ bgcolor: c.secondaryContainer, color: c.onSecondaryContainer, fontWeight: 700 }}
          />
        </Box>

        {/* View content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {view === 'table'   && <TableView entries={entries} />}
          {view === 'verb'    && <VerbView />}
          {view === 'grammar' && <GrammarView />}
          {view === 'flash'   && <FlashcardView entries={entries} onXp={v => setXp(p => p + v)} />}
          {view === 'badges'  && <BadgesView xp={xp} />}
        </Box>

        {/* FAB */}
        <Fab
          size="medium"
          onClick={() => setModal(true)}
          sx={{ position: 'absolute', right: 24, bottom: 24 }}
        >
          <AddIcon />
        </Fab>
      </Box>

      {/* Modal */}
      <AddEntryModal
        open={modal} onClose={() => setModal(false)}
        onSave={handleSave} translating={translating} ollamaError={ollamaError}
      />

      {/* Snackbar */}
      <Snackbar
        open={!!snack} autoHideDuration={3000}
        onClose={() => setSnack('')}
        message={snack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  )
}

export default function App() {
  const [dark, setDark] = useState(false)

  return (
    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
      <CssBaseline />
      {/* Dark mode toggle — floating */}
      <Box sx={{ position: 'fixed', top: 12, right: 12, zIndex: 9999 }}>
        <Tooltip title={dark ? 'Açık tema' : 'Koyu tema'}>
          <IconButton onClick={() => setDark(p => !p)}
            sx={{ bgcolor: 'background.paper', boxShadow: 2, borderRadius: 2 }}>
            {dark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <AppShell />
    </ThemeProvider>
  )
}
