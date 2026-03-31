// src/components/views/TableView.tsx
import { useState, useMemo, type RefObject } from 'react'
import {
  Box, Typography, Chip, Stack, Card, CardContent, CardActionArea,
  Collapse, LinearProgress, Tooltip, IconButton, TextField,
  InputAdornment, ToggleButton, ToggleButtonGroup, Divider, alpha,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ClearIcon from '@mui/icons-material/Clear'
import { useTheme } from '@mui/material/styles'
import { LANGS, FAMILIES, COGNATE_TREES, CATEGORY_META } from '@/constants/languages'

const LANG_CODE_MAP = {
  it:'it-IT',es:'es-ES',fr:'fr-FR',la:'it-IT',de:'de-DE',en:'en-GB',
  ru:'ru-RU',ja:'ja-JP',ko:'ko-KR',zh:'zh-CN',el:'el-GR',hy:'hy-AM',kbd:'tr-TR',
}

function speak(text, code) {
  if (!window.speechSynthesis) return
  const u = new SpeechSynthesisUtterance(text)
  u.lang = LANG_CODE_MAP[code] || 'en-US'
  u.rate = 0.85
  speechSynthesis.cancel()
  speechSynthesis.speak(u)
}

// --- Family color chip ---
function FamilyDot({ family, theme }) {
  const c = theme.palette.m3
  const map = {
    roman:  { bg: c.familyRomanBg,  fg: c.familyRoman  },
    germen: { bg: c.familyGermenBg, fg: c.familyGermen },
    slav:   { bg: c.familySlavBg,   fg: c.familySlav   },
    other:  { bg: c.familyOtherBg,  fg: c.familyOther  },
  }
  const { bg, fg } = map[family] || map.other
  return (
    <Box sx={{
      width: 10, height: 10, borderRadius: '50%',
      bgcolor: fg, flexShrink: 0, display: 'inline-block',
    }} />
  )
}

// --- Category chip ---
function CategoryChip({ category }) {
  const theme = useTheme()
  const meta = CATEGORY_META[category] || { label: category, color: 'default' }
  const colMap = {
    primary:   { bg: theme.palette.m3.primaryContainer,   fg: theme.palette.m3.onPrimaryContainer   },
    secondary: { bg: theme.palette.m3.secondaryContainer, fg: theme.palette.m3.onSecondaryContainer },
    tertiary:  { bg: theme.palette.m3.tertiaryContainer,  fg: theme.palette.m3.onTertiaryContainer  },
    success:   { bg: '#C8E6C9', fg: '#1B5E20' },
    warning:   { bg: '#FFF3E0', fg: '#E65100' },
  }
  const { bg, fg } = colMap[meta.color] || colMap.primary
  return (
    <Chip
      label={meta.label} size="small"
      sx={{ bgcolor: bg, color: fg, fontWeight: 700, fontSize: '0.68rem', height: 22, borderRadius: '6px' }}
    />
  )
}

// --- Cognate tree ---
function CognateTree({ groupKey }) {
  const theme = useTheme()
  const tree = COGNATE_TREES[groupKey]
  if (!tree) return null
  return (
    <Box sx={{
      bgcolor: alpha(theme.palette.m3.primaryContainer, 0.4),
      borderRadius: 3, p: 1.5, mb: 1.5,
      border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
    }}>
      <Stack direction="row" alignItems="center" gap={0.75} mb={1}>
        <AccountTreeIcon sx={{ fontSize: 14, color: theme.palette.primary.main }} />
        <Typography variant="labelSmall" color="primary">Cognate ağacı — {groupKey}</Typography>
      </Stack>
      <Stack direction="row" alignItems="flex-start" gap={1}>
        <Box sx={{
          bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText,
          px: 1, py: 0.5, borderRadius: 2, fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap',
        }}>
          {tree.root}
        </Box>
        <Box sx={{
          borderLeft: `2px solid ${theme.palette.primary.main}`,
          pl: 1.5, ml: 0.5,
          display: 'flex', flexDirection: 'column', gap: 0.25,
        }}>
          {tree.children.map((c, i) => (
            <Typography key={i} variant="bodySmall" sx={{
              position: 'relative',
              '&::before': {
                content: '""', position: 'absolute', left: -14, top: '50%',
                width: 10, height: 1, bgcolor: theme.palette.primary.main,
              },
            }}>
              {c}
            </Typography>
          ))}
        </Box>
      </Stack>
    </Box>
  )
}

// --- Lang cell in expanded grid ---
function LangCell({ lang, translation }) {
  const theme = useTheme()
  const c = theme.palette.m3
  const famColorMap = {
    roman:  { bg: alpha(c.familyRomanBg,  0.6), border: alpha(c.familyRoman,  0.3), accent: c.familyRoman  },
    germen: { bg: alpha(c.familyGermenBg, 0.6), border: alpha(c.familyGermen, 0.3), accent: c.familyGermen },
    slav:   { bg: alpha(c.familySlavBg,   0.6), border: alpha(c.familySlav,   0.3), accent: c.familySlav   },
    other:  { bg: alpha(c.familyOtherBg,  0.6), border: alpha(c.familyOther,  0.3), accent: c.familyOther  },
  }
  const { bg, border, accent } = famColorMap[lang.family] || famColorMap.other
  const t = translation || {}

  return (
    <Box sx={{
      bgcolor: bg, border: `1px solid ${border}`,
      borderRadius: 3, p: 1.25, minWidth: 0,
      transition: 'border-color 0.2s',
      '&:hover': { borderColor: accent },
    }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.5}>
        <Typography variant="labelSmall" sx={{ color: accent, fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '.04em' }}>
          {lang.flag} {lang.name}
        </Typography>
        {t.value && (
          <Tooltip title="Sesli oku">
            <IconButton size="small" sx={{ p: 0.25 }} onClick={() => speak(t.value, lang.code)}>
              <VolumeUpIcon sx={{ fontSize: 13, color: accent }} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Typography variant="titleSmall" sx={{ lineHeight: 1.3, fontSize: lang.family === 'other' ? '1rem' : '0.9rem' }}>
        {t.value || '—'}
      </Typography>

      {t.romanization && (
        <Typography variant="bodySmall" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic', mt: 0.25, display: 'block' }}>
          {t.romanization}
        </Typography>
      )}

      {/* Inline phonetic sentence (romanization as reading guide) */}
      {t.romanization && (
        <Box sx={{
          mt: 0.5, px: 0.75, py: 0.25,
          bgcolor: alpha(accent, 0.12), borderRadius: 1,
          display: 'inline-flex', alignItems: 'center', gap: 0.4,
        }}>
          <Typography variant="labelSmall" sx={{ color: accent, fontSize: '0.6rem' }}>
            /{t.romanization}/
          </Typography>
          <IconButton size="small" sx={{ p: 0 }} onClick={() => speak(t.romanization, 'en')}>
            <VolumeUpIcon sx={{ fontSize: 10, color: accent }} />
          </IconButton>
        </Box>
      )}

      {t.notes && (
        <Typography variant="bodySmall" sx={{ color: accent, mt: 0.5, fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: 0.25 }}>
          ⊕ {t.notes}
        </Typography>
      )}
    </Box>
  )
}

// --- Entry row card ---
function EntryCard({ entry }) {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)

  const done = LANGS.filter(l => entry.translations?.[l.code]?.value).length
  const pct  = Math.round((done / LANGS.length) * 100)

  return (
    <Card sx={{ mb: 1.5, overflow: 'visible' }}>
      {/* Header */}
      <CardActionArea onClick={() => setExpanded(p => !p)} sx={{ borderRadius: '16px 16px 0 0' }}>
        <CardContent sx={{ pb: '12px !important', pt: 1.75, px: 2 }}>
          <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
            <CategoryChip category={entry.category} />
            <Typography variant="titleMedium" sx={{ flex: 1, minWidth: 80 }}>
              {entry.concept}
            </Typography>
            {entry.cognateGroup && (
              <Chip
                icon={<AccountTreeIcon sx={{ fontSize: '12px !important' }} />}
                label={entry.cognateGroup}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  fontWeight: 700, fontSize: '0.65rem', height: 22, borderRadius: '6px',
                }}
              />
            )}
            <Stack direction="row" gap={0.5} flexWrap="wrap">
              {entry.tags?.map(t => (
                <Chip key={t} label={`#${t}`} size="small" variant="outlined"
                  sx={{ fontSize: '0.62rem', height: 20, borderRadius: '6px', borderColor: theme.palette.m3.outlineVariant }} />
              ))}
            </Stack>
            {expanded ? <ExpandLessIcon sx={{ color: theme.palette.text.secondary }} />
                      : <ExpandMoreIcon sx={{ color: theme.palette.text.secondary }} />}
          </Stack>

          {/* Progress bar */}
          <Box mt={1.25}>
            <Stack direction="row" alignItems="center" gap={1.5}>
              {/* Family dots */}
              <Stack direction="row" gap={0.4}>
                {LANGS.map(l => {
                  const has = !!entry.translations?.[l.code]?.value
                  const famMap = {
                    roman:  theme.palette.m3.familyRoman,
                    germen: theme.palette.m3.familyGermen,
                    slav:   theme.palette.m3.familySlav,
                    other:  theme.palette.m3.familyOther,
                  }
                  return (
                    <Tooltip key={l.code} title={`${l.flag} ${l.name}`}>
                      <Box sx={{
                        width: 18, height: 18, borderRadius: '50%',
                        bgcolor: has ? famMap[l.family] : theme.palette.m3.outlineVariant,
                        fontSize: '0.6rem', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', cursor: 'default',
                        border: has ? 'none' : `1px solid ${theme.palette.m3.outline}`,
                        transition: 'background-color 0.2s',
                      }}>
                        {has ? '' : ''}
                      </Box>
                    </Tooltip>
                  )
                })}
              </Stack>
              <LinearProgress
                variant="determinate" value={pct}
                sx={{ flex: 1, height: 6, borderRadius: 99,
                  bgcolor: theme.palette.m3.outlineVariant,
                  '& .MuiLinearProgress-bar': { bgcolor: theme.palette.primary.main },
                }}
              />
              <Typography variant="labelSmall" color="text.secondary" sx={{ minWidth: 28 }}>
                {pct}%
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </CardActionArea>

      {/* Expanded */}
      <Collapse in={expanded}>
        <Divider />
        <Box sx={{ p: 2, pt: 1.5 }}>
          {entry.cognateGroup && <CognateTree groupKey={entry.cognateGroup} />}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: 1,
          }}>
            {LANGS.map(l => (
              <LangCell key={l.code} lang={l} translation={entry.translations?.[l.code]} />
            ))}
          </Box>
        </Box>
      </Collapse>
    </Card>
  )
}

// --- Main TableView ---
interface TableViewProps {
  entries: import('@/types').Entry[]
  searchRef?: RefObject<HTMLInputElement>
}
export default function TableView({ entries, searchRef }: TableViewProps) {
  const theme = useTheme()
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')

  const filtered = useMemo(() => {
    return entries.filter(e => {
      // smart search — concept, tag, translation value, lang name
      if (search) {
        const q = search.toLowerCase()
        const inConcept = e.concept.toLowerCase().includes(q)
        const inTag = e.tags?.some(t => t.toLowerCase().includes(q))
        const inTrans = Object.values(e.translations || {}).some(t => t.value?.toLowerCase().includes(q))
        if (!inConcept && !inTag && !inTrans) return false
      }
      if (['verb','noun','adj','phrase'].includes(filter) && e.category !== filter) return false
      if (['roman','germen','slav','other'].includes(filter)) {
        const famLangs = LANGS.filter(l => l.family === filter).map(l => l.code)
        if (!famLangs.some(lc => e.translations?.[lc]?.value)) return false
      }
      if (filter === 'cognate' && !e.cognateGroup) return false
      return true
    })
  }, [entries, search, filter])

  const c = theme.palette.m3
  const famChips = [
    { key: 'roman',  label: 'Roman',  color: c.familyRoman  },
    { key: 'germen', label: 'Cermen', color: c.familyGermen },
    { key: 'slav',   label: 'Slav',   color: c.familySlav   },
    { key: 'other',  label: 'Diğer',  color: c.familyOther  },
  ]

  return (
    <Box sx={{ p: 2, overflow: 'auto', flex: 1 }}>
      {/* Search */}
      <TextField
        fullWidth size="small" placeholder="Kavram, etiket veya çeviri ara..."
        value={search} onChange={e => setSearch(e.target.value)}
        inputRef={searchRef}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" color="action" /></InputAdornment>,
          endAdornment: search ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setSearch('')}><ClearIcon fontSize="small" /></IconButton>
            </InputAdornment>
          ) : null,
          sx: { borderRadius: 99 },
        }}
        sx={{ mb: 2 }}
      />

      {/* Filters */}
      <Stack direction="row" gap={1} flexWrap="wrap" mb={2} alignItems="center">
        <ToggleButtonGroup
          value={filter} exclusive
          onChange={(_, v) => v && setFilter(v)}
          size="small"
          sx={{ '& .MuiToggleButton-root': { borderRadius: '20px !important', border: 'none', px: 1.5, py: 0.5, fontSize: '0.75rem', fontWeight: 700 } }}
        >
          {['all','verb','noun','adj','phrase'].map(k => (
            <ToggleButton key={k} value={k} sx={{
              '&.Mui-selected': {
                bgcolor: theme.palette.m3.primaryContainer,
                color: theme.palette.m3.onPrimaryContainer,
              },
            }}>
              {{ all:'Tümü', verb:'Fiil', noun:'İsim', adj:'Sıfat', phrase:'İfade' }[k]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Family filters */}
        {famChips.map(fc => (
          <Chip
            key={fc.key}
            label={fc.label}
            size="small"
            onClick={() => setFilter(filter === fc.key ? 'all' : fc.key)}
            icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: fc.color, ml: '8px !important' }} />}
            sx={{
              cursor: 'pointer',
              bgcolor: filter === fc.key ? alpha(fc.color, 0.18) : 'transparent',
              color: filter === fc.key ? fc.color : theme.palette.text.secondary,
              border: `1.5px solid ${filter === fc.key ? fc.color : theme.palette.m3.outlineVariant}`,
              fontWeight: 700, fontSize: '0.72rem',
              '& .MuiChip-icon': { color: fc.color },
            }}
          />
        ))}

        <Chip
          label="⊕ Cognate" size="small"
          onClick={() => setFilter(filter === 'cognate' ? 'all' : 'cognate')}
          sx={{
            cursor: 'pointer',
            bgcolor: filter === 'cognate' ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
            color: filter === 'cognate' ? theme.palette.primary.main : theme.palette.text.secondary,
            border: `1.5px solid ${filter === 'cognate' ? theme.palette.primary.main : theme.palette.m3.outlineVariant}`,
            fontWeight: 700, fontSize: '0.72rem',
          }}
        />
      </Stack>

      {/* Results */}
      {filtered.length === 0 ? (
        <Box textAlign="center" py={6}>
          <Typography variant="headlineSmall" mb={1}>🔍</Typography>
          <Typography variant="bodyMedium" color="text.secondary">Kavram bulunamadı</Typography>
        </Box>
      ) : (
        filtered.map(e => <EntryCard key={e.id} entry={e} />)
      )}
    </Box>
  )
}
