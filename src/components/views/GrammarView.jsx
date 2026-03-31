// src/components/views/GrammarView.jsx
import { useState } from 'react'
import {
  Box, Typography, Stack, Card, CardContent, Stepper, Step,
  StepLabel, StepContent, Button, Chip, IconButton, Tooltip,
  alpha, Tabs, Tab,
} from '@mui/material'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useTheme } from '@mui/material/styles'
import { GRAMMAR_STAGES } from '../../constants/languages'

const LANG_CODE_MAP = {
  it:'it-IT',es:'es-ES',fr:'fr-FR',la:'it-IT',de:'de-DE',en:'en-GB',
  ru:'ru-RU',ja:'ja-JP',ko:'ko-KR',zh:'zh-CN',el:'el-GR',hy:'hy-AM',kbd:'tr-TR',
}
function speak(text, code) {
  if (!window.speechSynthesis) return
  const u = new SpeechSynthesisUtterance(text)
  u.lang = LANG_CODE_MAP[code] || 'en-US'
  u.rate = 0.85; speechSynthesis.cancel(); speechSynthesis.speak(u)
}

function GramCard({ langData }) {
  const theme = useTheme()
  const c = theme.palette.m3
  const famColorMap = {
    roman:  { bg: alpha(c.familyRomanBg,  0.5), accent: c.familyRoman  },
    germen: { bg: alpha(c.familyGermenBg, 0.5), accent: c.familyGermen },
    slav:   { bg: alpha(c.familySlavBg,   0.5), accent: c.familySlav   },
    other:  { bg: alpha(c.familyOtherBg,  0.5), accent: c.familyOther  },
  }
  const { bg, accent } = famColorMap[langData.family] || famColorMap.other
  const [activeStep, setActiveStep] = useState(0)
  const done = activeStep >= langData.steps.length

  return (
    <Card sx={{ bgcolor: bg, border: `1px solid ${alpha(accent, 0.3)}`, minWidth: 220 }}>
      <CardContent sx={{ p: '14px !important' }}>
        <Stack direction="row" alignItems="center" gap={1} mb={1.5}>
          <Typography variant="labelMedium" sx={{ color: accent, flex: 1 }}>
            {langData.flag} {langData.name}
          </Typography>
          {done && <CheckCircleIcon sx={{ fontSize: 16, color: accent }} />}
        </Stack>

        {/* M3-style numbered steps */}
        <Stack gap={0.5} mb={1.5}>
          {langData.steps.map((step, i) => (
            <Stack key={i} direction="row" alignItems="center" gap={0.75}
              sx={{
                opacity: i <= activeStep ? 1 : 0.4,
                transition: 'opacity 0.3s',
                cursor: 'pointer',
              }}
              onClick={() => setActiveStep(Math.max(activeStep, i + 1))}
            >
              <Box sx={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                bgcolor: i < activeStep ? accent : i === activeStep ? alpha(accent, 0.2) : 'transparent',
                border: `1.5px solid ${i <= activeStep ? accent : c.outlineVariant}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.6rem', fontWeight: 700,
                color: i < activeStep ? theme.palette.getContrastText(accent) : accent,
                transition: 'all 0.2s',
              }}>
                {i < activeStep ? '✓' : i + 1}
              </Box>
              <Typography variant="bodySmall" sx={{ fontSize: '0.72rem', color: i <= activeStep ? theme.palette.text.primary : theme.palette.text.secondary }}>
                {step}
              </Typography>
            </Stack>
          ))}
        </Stack>

        {/* Example with audio */}
        <Box sx={{
          bgcolor: alpha(accent, 0.1), borderRadius: 2, px: 1.25, py: 0.75,
          display: 'flex', alignItems: 'center', gap: 0.5,
        }}>
          <Typography variant="bodySmall" sx={{ fontStyle: 'italic', flex: 1, fontSize: '0.72rem', color: theme.palette.text.secondary }}>
            {langData.example}
          </Typography>
          <Tooltip title="Sesli oku">
            <IconButton size="small" sx={{ p: 0.25 }} onClick={() => speak(langData.example, langData.code)}>
              <VolumeUpIcon sx={{ fontSize: 13, color: accent }} />
            </IconButton>
          </Tooltip>
        </Box>

        {!done && (
          <Button size="small" variant="text"
            sx={{ mt: 1, color: accent, fontSize: '0.72rem', fontWeight: 700, p: 0 }}
            onClick={() => setActiveStep(p => Math.min(p + 1, langData.steps.length))}
          >
            Sonraki adım →
          </Button>
        )}
        {done && (
          <Button size="small" variant="text"
            sx={{ mt: 1, color: accent, fontSize: '0.72rem', p: 0 }}
            onClick={() => setActiveStep(0)}
          >
            Sıfırla
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default function GrammarView() {
  const theme = useTheme()
  const [stageIdx, setStageIdx] = useState(0)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Stage tabs */}
      <Box sx={{ bgcolor: theme.palette.background.paper, borderBottom: `1px solid ${theme.palette.m3.outlineVariant}` }}>
        <Tabs
          value={stageIdx} onChange={(_, v) => setStageIdx(v)}
          variant="scrollable" scrollButtons="auto" sx={{ px: 2 }}
        >
          {GRAMMAR_STAGES.map((s, i) => (
            <Tab key={i} value={i}
              label={
                <Box textAlign="left">
                  <Typography variant="labelMedium" display="block">{s.title}</Typography>
                  <Typography variant="bodySmall" color="text.secondary" sx={{ fontSize: '0.65rem' }}>{s.subtitle}</Typography>
                </Box>
              }
              sx={{ textTransform: 'none', alignItems: 'flex-start', minHeight: 56 }}
            />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {GRAMMAR_STAGES[stageIdx] && (
          <>
            <Stack direction="row" alignItems="baseline" gap={1} mb={2}>
              <Typography variant="headlineSmall">{GRAMMAR_STAGES[stageIdx].title}</Typography>
              <Chip label={GRAMMAR_STAGES[stageIdx].subtitle} size="small"
                sx={{ bgcolor: theme.palette.m3.secondaryContainer, color: theme.palette.m3.onSecondaryContainer }} />
            </Stack>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 1.5,
            }}>
              {GRAMMAR_STAGES[stageIdx].langs.map(lang => (
                <GramCard key={lang.code} langData={lang} />
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}
