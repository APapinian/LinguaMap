// src/components/views/VerbView.tsx — v3 multi-tense
import { useState } from 'react'
import {
  Box, Typography, Stack, Card, CardContent,
  Table, TableBody, TableRow, TableCell,
  IconButton, Tooltip, Tabs, Tab, Chip, alpha,
} from '@mui/material'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import { useTheme } from '@mui/material/styles'
import { LANGS, FAMILY_COLORS, TTS_LANG_MAP, VERB_CONJUGATIONS } from '@/constants/languages'
import type { TenseData, VerbLangData, TenseName } from '@/constants/languages'
import type { LangCode } from '@/types'

function speak(text: string, code: string) {
  if (!window.speechSynthesis) return
  const u = new SpeechSynthesisUtterance(text)
  u.lang = TTS_LANG_MAP[code as LangCode] || 'en-US'
  u.rate = 0.85; speechSynthesis.cancel(); speechSynthesis.speak(u)
}

function ConjCard({ lang, data }: { lang: typeof LANGS[number]; data: VerbLangData }) {
  const theme = useTheme()
  const { main: accent } = FAMILY_COLORS[lang.family]
  const [tenseIdx, setTenseIdx] = useState(0)
  const tense: TenseData = data.tenses[tenseIdx]

  return (
    <Card sx={{ border: `1px solid ${alpha(accent, 0.3)}` }}>
      <CardContent sx={{ p: '14px !important' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.75}>
          <Typography variant="labelMedium" sx={{ color: accent }}>{lang.flag} {lang.name}</Typography>
          <Tooltip title="Mastarı sesli oku">
            <IconButton size="small" onClick={() => speak(data.infinitive, lang.code)}>
              <VolumeUpIcon sx={{ fontSize: 15, color: accent }} />
            </IconButton>
          </Tooltip>
        </Stack>
        <Typography variant="titleMedium" sx={{ color: accent, mb: 1.25, fontSize: '1.05rem' }}>{data.infinitive}</Typography>

        {/* Tense chips */}
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
          {data.tenses.map((t, i) => (
            <Chip key={i} label={t.tense} size="small" onClick={() => setTenseIdx(i)}
              sx={{
                fontSize: '0.6rem', height: 19, cursor: 'pointer',
                bgcolor: i === tenseIdx ? alpha(accent, 0.18) : 'transparent',
                color: i === tenseIdx ? accent : theme.palette.text.secondary,
                border: `1px solid ${i === tenseIdx ? accent : theme.palette.divider}`,
                fontWeight: i === tenseIdx ? 700 : 400,
              }} />
          ))}
        </Box>

        {/* Table */}
        <Box sx={{ bgcolor: alpha(accent, 0.05), borderRadius: 2, p: 0.5 }}>
          <Table size="small" sx={{ '& td': { border: 0, py: 0.25, px: 0.5 } }}>
            <TableBody>
              {tense.rows.map(([person, form], i) => (
                <TableRow key={i}>
                  <TableCell sx={{ color: theme.palette.text.secondary, fontSize: '0.68rem', width: 52, fontStyle: 'italic' }}>{person}</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.82rem' }}>{form}</TableCell>
                  <TableCell sx={{ textAlign: 'right', width: 26 }}>
                    <IconButton size="small" sx={{ p: 0.2, opacity: 0.45 }} onClick={() => speak(form, lang.code)}>
                      <VolumeUpIcon sx={{ fontSize: 10 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  )
}

function TenseCoverage({ verbData }: { verbData: Partial<Record<LangCode, VerbLangData>> }) {
  const theme = useTheme()
  const allTenses: TenseName[] = ['Geniş Zaman', 'Geçmiş Zaman', 'Gelecek Zaman', 'Dilek/Şart', 'Emir']
  const activeLangs = LANGS.filter(l => verbData[l.code])
  if (activeLangs.length === 0) return null

  return (
    <Box sx={{ bgcolor: theme.palette.background.paper, borderBottom: `1px solid ${theme.palette.divider}`, px: 2, py: 1.25, overflowX: 'auto' }}>
      <Typography variant="labelSmall" color="text.secondary" mb={0.75} display="block">Zaman kapsamı</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: `110px repeat(${allTenses.length}, 1fr)`, gap: '4px 3px', minWidth: 440 }}>
        <Box />
        {allTenses.map(tn => (
          <Typography key={tn} variant="labelSmall" sx={{ fontSize: '0.58rem', textAlign: 'center', color: theme.palette.text.secondary }}>
            {tn.replace(' Zaman', '')}
          </Typography>
        ))}
        {activeLangs.map(lang => {
          const data = verbData[lang.code]!
          const has = (tn: TenseName) => data.tenses.some(t => t.tense === tn)
          const { main } = FAMILY_COLORS[lang.family]
          return [
            <Typography key={`lbl-${lang.code}`} variant="labelSmall"
              sx={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: 0.4 }}>
              {lang.flag} {lang.name}
            </Typography>,
            ...allTenses.map(tn => (
              <Box key={`${lang.code}-${tn}`} sx={{
                height: 16, borderRadius: 0.75,
                bgcolor: has(tn) ? alpha(main, 0.22) : theme.palette.divider,
                border: `1px solid ${has(tn) ? alpha(main, 0.45) : 'transparent'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {has(tn) && <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: main }} />}
              </Box>
            )),
          ]
        })}
      </Box>
    </Box>
  )
}

export default function VerbView() {
  const theme = useTheme()
  const verbs = Object.keys(VERB_CONJUGATIONS)
  const [activeVerb, setActiveVerb] = useState(verbs[0])
  const verbData = (VERB_CONJUGATIONS[activeVerb] ?? {}) as Partial<Record<LangCode, VerbLangData>>

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Box sx={{ bgcolor: theme.palette.background.paper, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Tabs value={activeVerb} onChange={(_, v) => setActiveVerb(v)} variant="scrollable" scrollButtons="auto" sx={{ px: 2 }}>
          {verbs.map(v => <Tab key={v} value={v} label={v} sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.875rem' }} />)}
        </Tabs>
      </Box>
      <TenseCoverage verbData={verbData} />
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 1.5 }}>
          {LANGS.map(lang => {
            const data = verbData[lang.code]
            if (!data) return null
            return <ConjCard key={lang.code} lang={lang} data={data} />
          })}
        </Box>
      </Box>
    </Box>
  )
}
