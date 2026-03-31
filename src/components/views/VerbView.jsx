// src/components/views/VerbView.jsx
import { useState } from 'react'
import {
  Box, Typography, Stack, Card, CardContent, Chip,
  Table, TableBody, TableRow, TableCell, IconButton, Tooltip,
  Tabs, Tab, alpha,
} from '@mui/material'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import { useTheme } from '@mui/material/styles'
import { LANGS, VERB_CONJUGATIONS } from '../../constants/languages'

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

function ConjCard({ lang, conj }) {
  const theme = useTheme()
  const c = theme.palette.m3
  const famColorMap = {
    roman:  { bg: alpha(c.familyRomanBg,  0.55), accent: c.familyRoman  },
    germen: { bg: alpha(c.familyGermenBg, 0.55), accent: c.familyGermen },
    slav:   { bg: alpha(c.familySlavBg,   0.55), accent: c.familySlav   },
    other:  { bg: alpha(c.familyOtherBg,  0.55), accent: c.familyOther  },
  }
  const { bg, accent } = famColorMap[lang.family] || famColorMap.other

  return (
    <Card sx={{ bgcolor: bg, border: `1px solid ${alpha(accent, 0.3)}` }}>
      <CardContent sx={{ p: '14px !important' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="labelMedium" sx={{ color: accent, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {lang.flag} {lang.name}
          </Typography>
          <Tooltip title="Sesli oku">
            <IconButton size="small" onClick={() => speak(conj.rows[0]?.[1] || '', lang.code)}>
              <VolumeUpIcon sx={{ fontSize: 15, color: accent }} />
            </IconButton>
          </Tooltip>
        </Stack>
        <Typography variant="titleMedium" sx={{ color: accent, mb: 1, fontSize: '1rem' }}>
          {VERB_CONJUGATIONS[Object.keys(VERB_CONJUGATIONS)[0]] && conj.rows[0]?.[1]}
        </Typography>
        <Table size="small">
          <TableBody>
            {conj.rows.map(([person, form], i) => (
              <TableRow key={i} sx={{ '&:last-child td': { border: 0 } }}>
                <TableCell sx={{ py: 0.25, px: 0, width: 44, color: theme.palette.text.secondary, fontSize: '0.7rem', border: 0 }}>
                  {person}
                </TableCell>
                <TableCell sx={{ py: 0.25, px: 0, fontWeight: 700, fontSize: '0.82rem', border: 0 }}>
                  {form}
                </TableCell>
                <TableCell sx={{ py: 0.25, px: 0, border: 0, textAlign: 'right' }}>
                  <IconButton size="small" sx={{ p: 0.25, opacity: 0.5 }} onClick={() => speak(form, lang.code)}>
                    <VolumeUpIcon sx={{ fontSize: 11 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default function VerbView() {
  const theme = useTheme()
  const verbs = Object.keys(VERB_CONJUGATIONS)
  const [activeVerb, setActiveVerb] = useState(verbs[0])
  const conjs = VERB_CONJUGATIONS[activeVerb] || {}

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Verb tabs */}
      <Box sx={{ bgcolor: theme.palette.background.paper, borderBottom: `1px solid ${theme.palette.m3.outlineVariant}` }}>
        <Tabs
          value={activeVerb}
          onChange={(_, v) => setActiveVerb(v)}
          variant="scrollable" scrollButtons="auto"
          sx={{ px: 2 }}
        >
          {verbs.map(v => (
            <Tab key={v} value={v} label={v}
              sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.875rem' }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Conjugation grid */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 1.5,
        }}>
          {LANGS.map(lang => {
            const c = conjs[lang.code]
            if (!c) return null
            return <ConjCard key={lang.code} lang={lang} conj={c} />
          })}
        </Box>
      </Box>
    </Box>
  )
}
