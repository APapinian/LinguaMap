// src/theme/m3Theme.js
// Material Design 3 — "LinguaMap" color scheme
// Primary: Indigo-teal (learning / knowledge)
// Secondary: Teal
// Tertiary: Orange (gamification accents)

import { createTheme, alpha } from '@mui/material/styles'

// --- M3 Color Tokens (light) ---
const m3Light = {
  primary:           '#4355B9',   // md.sys.color.primary
  onPrimary:         '#FFFFFF',
  primaryContainer:  '#DEE0FF',   // used for chips, cards
  onPrimaryContainer:'#00006E',

  secondary:         '#5C5D72',
  onSecondary:       '#FFFFFF',
  secondaryContainer:'#E1E0F9',
  onSecondaryContainer:'#191A2C',

  tertiary:          '#78536B',   // gamification pink
  onTertiary:        '#FFFFFF',
  tertiaryContainer: '#FFD8EE',
  onTertiaryContainer:'#2E1126',

  error:             '#BA1A1A',
  errorContainer:    '#FFDAD6',
  onError:           '#FFFFFF',
  onErrorContainer:  '#410002',

  background:        '#FFFBFF',
  onBackground:      '#1B1B1F',
  surface:           '#FFFBFF',
  onSurface:         '#1B1B1F',

  surfaceVariant:    '#E3E1EC',
  onSurfaceVariant:  '#46464F',
  outline:           '#767680',
  outlineVariant:    '#C7C5D0',

  // Custom semantic for families
  familyRoman:       '#1565C0',
  familyRomanBg:     '#E3F2FD',
  familyGermen:      '#2E7D32',
  familyGermenBg:    '#E8F5E9',
  familySlav:        '#E65100',
  familySlavBg:      '#FFF3E0',
  familyOther:       '#6A1B9A',
  familyOtherBg:     '#F3E5F5',
}

const m3Dark = {
  primary:           '#BAC3FF',
  onPrimary:         '#08218A',
  primaryContainer:  '#2A3DA0',
  onPrimaryContainer:'#DEE0FF',

  secondary:         '#C5C4DD',
  onSecondary:       '#2E2F42',
  secondaryContainer:'#444559',
  onSecondaryContainer:'#E1E0F9',

  tertiary:          '#E8B9D5',
  onTertiary:        '#45263D',
  tertiaryContainer: '#5D3C54',
  onTertiaryContainer:'#FFD8EE',

  error:             '#FFB4AB',
  errorContainer:    '#93000A',
  onError:           '#690005',
  onErrorContainer:  '#FFDAD6',

  background:        '#1B1B1F',
  onBackground:      '#E5E1E6',
  surface:           '#1B1B1F',
  onSurface:         '#E5E1E6',

  surfaceVariant:    '#46464F',
  onSurfaceVariant:  '#C7C5D0',
  outline:           '#91909A',
  outlineVariant:    '#46464F',

  familyRoman:       '#90CAF9',
  familyRomanBg:     '#0D47A1',
  familyGermen:      '#A5D6A7',
  familyGermenBg:    '#1B5E20',
  familySlav:        '#FFCC80',
  familySlavBg:      '#BF360C',
  familyOther:       '#CE93D8',
  familyOtherBg:     '#4A148C',
}

function buildTheme(mode) {
  const c = mode === 'dark' ? m3Dark : m3Light
  return createTheme({
    palette: {
      mode,
      primary:   { main: c.primary, contrastText: c.onPrimary },
      secondary: { main: c.secondary, contrastText: c.onSecondary },
      error:     { main: c.error },
      background:{ default: c.background, paper: c.surface },
      text:      { primary: c.onSurface, secondary: c.onSurfaceVariant },
      // expose M3 tokens via augmentColor or custom keys
      m3: c,
    },

    typography: {
      fontFamily: '"Nunito", "Segoe UI", sans-serif',
      // M3 type scale
      displayLarge:  { fontSize: '3.5625rem', fontWeight: 400, lineHeight: 1.12, letterSpacing: '-0.016em' },
      displayMedium: { fontSize: '2.8125rem', fontWeight: 400, lineHeight: 1.16 },
      displaySmall:  { fontSize: '2.25rem',   fontWeight: 400, lineHeight: 1.22 },
      headlineLarge: { fontSize: '2rem',       fontWeight: 700, lineHeight: 1.25 },
      headlineMedium:{ fontSize: '1.75rem',    fontWeight: 700, lineHeight: 1.29 },
      headlineSmall: { fontSize: '1.5rem',     fontWeight: 700, lineHeight: 1.33 },
      titleLarge:    { fontSize: '1.375rem',   fontWeight: 700, lineHeight: 1.27 },
      titleMedium:   { fontSize: '1rem',       fontWeight: 700, lineHeight: 1.5, letterSpacing: '0.009em' },
      titleSmall:    { fontSize: '0.875rem',   fontWeight: 700, lineHeight: 1.43, letterSpacing: '0.006em' },
      bodyLarge:     { fontSize: '1rem',       fontWeight: 400, lineHeight: 1.5,  letterSpacing: '0.031em' },
      bodyMedium:    { fontSize: '0.875rem',   fontWeight: 400, lineHeight: 1.43, letterSpacing: '0.016em' },
      bodySmall:     { fontSize: '0.75rem',    fontWeight: 400, lineHeight: 1.33, letterSpacing: '0.025em' },
      labelLarge:    { fontSize: '0.875rem',   fontWeight: 700, lineHeight: 1.43, letterSpacing: '0.006em' },
      labelMedium:   { fontSize: '0.75rem',    fontWeight: 700, lineHeight: 1.33, letterSpacing: '0.031em' },
      labelSmall:    { fontSize: '0.6875rem',  fontWeight: 700, lineHeight: 1.45, letterSpacing: '0.031em' },
    },

    shape: {
      borderRadius: 12, // M3 default — components override individually
    },

    // M3 Elevation via box-shadow tints
    shadows: [
      'none',
      `0px 1px 2px ${alpha('#000', 0.3)}, 0px 1px 3px 1px ${alpha('#000', 0.15)}`,
      `0px 1px 2px ${alpha('#000', 0.3)}, 0px 2px 6px 2px ${alpha('#000', 0.15)}`,
      `0px 4px 8px 3px ${alpha('#000', 0.15)}, 0px 1px 3px ${alpha('#000', 0.3)}`,
      `0px 6px 10px 4px ${alpha('#000', 0.15)}, 0px 2px 3px ${alpha('#000', 0.3)}`,
      `0px 8px 12px 6px ${alpha('#000', 0.15)}, 0px 4px 4px ${alpha('#000', 0.3)}`,
      ...Array(19).fill('none'),
    ],

    components: {
      // ---------- BUTTON ----------
      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 20,         // M3 full pill
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.875rem',
            letterSpacing: '0.006em',
            padding: '10px 24px',
          }),
          contained: ({ theme }) => ({
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            boxShadow: theme.shadows[1],
            '&:hover': { boxShadow: theme.shadows[2] },
          }),
          outlined: ({ theme }) => ({
            borderColor: theme.palette.m3.outline,
            color: theme.palette.primary.main,
            '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) },
          }),
          text: ({ theme }) => ({
            color: theme.palette.primary.main,
            '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) },
          }),
        },
      },

      // ---------- FAB ----------
      MuiFab: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 16,
            backgroundColor: theme.palette.m3.tertiaryContainer,
            color: theme.palette.m3.onTertiaryContainer,
            boxShadow: theme.shadows[3],
            '&:hover': {
              backgroundColor: theme.palette.m3.tertiaryContainer,
              boxShadow: theme.shadows[4],
            },
          }),
        },
      },

      // ---------- CHIP ----------
      MuiChip: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 8,
            fontWeight: 700,
            fontSize: '0.75rem',
            letterSpacing: '0.031em',
            height: 28,
          }),
          filled: ({ theme }) => ({
            backgroundColor: theme.palette.m3.secondaryContainer,
            color: theme.palette.m3.onSecondaryContainer,
          }),
          outlined: ({ theme }) => ({
            borderColor: theme.palette.m3.outline,
            color: theme.palette.text.secondary,
          }),
          colorPrimary: ({ theme }) => ({
            backgroundColor: theme.palette.m3.primaryContainer,
            color: theme.palette.m3.onPrimaryContainer,
          }),
        },
      },

      // ---------- CARD ----------
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 16,
            boxShadow: 'none',
            border: `1px solid ${theme.palette.m3.outlineVariant}`,
            backgroundColor: mode === 'dark'
              ? alpha(theme.palette.m3.surfaceVariant, 0.3)
              : theme.palette.background.paper,
            transition: 'box-shadow 0.2s, border-color 0.2s',
            '&:hover': {
              boxShadow: theme.shadows[1],
              borderColor: theme.palette.primary.main,
            },
          }),
        },
      },

      // ---------- NAVIGATION DRAWER (Sidebar) ----------
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            border: 'none',
            backgroundColor: mode === 'dark'
              ? '#1C1B1F'
              : theme.palette.m3.surfaceVariant,
          }),
        },
      },

      // ---------- LIST ITEM (nav items) ----------
      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 28,
            margin: '2px 12px',
            padding: '12px 16px',
            '&.Mui-selected': {
              backgroundColor: theme.palette.m3.primaryContainer,
              color: theme.palette.m3.onPrimaryContainer,
              '& .MuiListItemIcon-root': { color: theme.palette.m3.onPrimaryContainer },
              '&:hover': { backgroundColor: alpha(theme.palette.m3.primaryContainer, 0.9) },
            },
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }),
        },
      },

      // ---------- TEXT FIELD ----------
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
            },
          }),
          notchedOutline: ({ theme }) => ({
            borderColor: theme.palette.m3.outline,
          }),
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: '12px 12px 0 0',
            backgroundColor: theme.palette.m3.surfaceVariant,
            '&:hover': { backgroundColor: alpha(theme.palette.m3.surfaceVariant, 0.8) },
            '&.Mui-focused': { backgroundColor: theme.palette.m3.surfaceVariant },
          }),
        },
      },

      // ---------- DIALOG ----------
      MuiDialog: {
        styleOverrides: {
          paper: ({ theme }) => ({
            borderRadius: 28,
            backgroundColor: mode === 'dark'
              ? '#2B2930'
              : '#ECE6F0',
            padding: '8px 0',
          }),
        },
      },

      // ---------- TAB ----------
      MuiTab: {
        styleOverrides: {
          root: ({ theme }) => ({
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.875rem',
            letterSpacing: '0.006em',
            borderRadius: '8px 8px 0 0',
            minHeight: 48,
          }),
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: ({ theme }) => ({
            height: 3,
            borderRadius: '3px 3px 0 0',
            backgroundColor: theme.palette.primary.main,
          }),
        },
      },

      // ---------- LINEAR PROGRESS ----------
      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: 99, height: 8 },
          bar: { borderRadius: 99 },
        },
      },

      // ---------- BADGE ----------
      MuiBadge: {
        styleOverrides: {
          badge: { fontWeight: 700, fontSize: '0.6875rem' },
        },
      },

      // ---------- TOOLTIP ----------
      MuiTooltip: {
        styleOverrides: {
          tooltip: ({ theme }) => ({
            backgroundColor: theme.palette.m3.onSurface,
            color: theme.palette.m3.surface,
            borderRadius: 8,
            fontSize: '0.75rem',
            fontWeight: 400,
          }),
        },
      },

      // ---------- SNACKBAR ----------
      MuiSnackbar: {
        styleOverrides: {
          root: { bottom: 24 },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            backgroundColor: theme.palette.m3.onSurface,
            color: theme.palette.m3.surface,
          }),
        },
      },

      // ---------- SWITCH ----------
      MuiSwitch: {
        styleOverrides: {
          root: { padding: 8 },
          thumb: { borderRadius: 12 },
          track: { borderRadius: 22 },
          switchBase: ({ theme }) => ({
            '&.Mui-checked': {
              color: theme.palette.primary.main,
              '& + .MuiSwitch-track': { backgroundColor: theme.palette.m3.primaryContainer },
            },
          }),
        },
      },

      // ---------- ICON BUTTON ----------
      MuiIconButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 20,
            '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) },
          }),
        },
      },

      // ---------- SELECT ----------
      MuiSelect: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
    },
  })
}

export const lightTheme = buildTheme('light')
export const darkTheme  = buildTheme('dark')
