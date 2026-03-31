// src/components/views/FlashcardView.tsx
import { useState, useMemo, useCallback } from 'react'
import {
  Box, Typography, Stack, Button, LinearProgress,
  Chip, alpha, IconButton, Tooltip, ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SchoolIcon from '@mui/icons-material/School'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import { useTheme } from '@mui/material/styles'
import { LANGS, FAMILY_COLORS, TTS_LANG_MAP } from '@/constants/languages'
import { useSR } from '@/hooks/useSR'
import type { Entry, FlashPair } from '@/types'

function speak(text: string, code: string) {
  if (!window.speechSynthesis) return
  const u = new SpeechSynthesisUtterance(text)
  u.lang = TTS_LANG_MAP[code as keyof typeof TTS_LANG_MAP] || 'en-US'
  u.rate = 0.85
  speechSynthesis.cancel()
  speechSynthesis.speak(u)
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type Mode = 'all' | 'due'

interface Props {
  entries: Entry[]
  onXp: (amount: number) => void
}

export default function FlashcardView({ entries, onXp }: Props) {
  const theme = useTheme()
  const { review, getDueCards } = useSR()
  const [mode, setMode] = useState<Mode>('due')
  const [idx, setIdx]         = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [revealed, setReveal] = useState(false)
  const [streak, setStreak]   = useState(0)
  const [done, setDone]       = useState(false)
  const [animKey, setAnimKey] = useState(0)

  // Build all pairs
  const allPairs = useMemo<FlashPair[]>(() => {
    const ps: FlashPair[] = []
    entries.forEach(e => {
      LANGS.forEach(l => {
        const t = e.translations?.[l.code]
        if (t?.value) ps.push({ concept: e.concept, lang: l, val: t.value, roman: t.romanization || '', entryId: e.id })
      })
    })
    return shuffle(ps)
  }, [entries])

  // Due cards only
  const duePairs = useMemo<FlashPair[]>(() => {
    const dueKeys = getDueCards(allPairs.map(p => ({ entryId: p.entryId, langCode: p.lang.code })))
    const dueSet = new Set(dueKeys.map(k => `${k.entryId}__${k.langCode}`))
    return allPairs.filter(p => dueSet.has(`${p.entryId}__${p.lang.code}`))
  }, [allPairs, getDueCards])

  const pairs = mode === 'due' ? (duePairs.length > 0 ? duePairs : allPairs) : allPairs

  const pair = pairs[idx % pairs.length]

  if (!pair || pairs.length === 0) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2, p: 3 }}>
        <Typography variant="headlineSmall">📭</Typography>
        <Typography variant="bodyLarge" color="text.secondary">Henüz kart yok. Kavram ekle!</Typography>
      </Box>
    )
  }

  const pct = Math.round((idx / pairs.length) * 100)
  const { main: accent } = FAMILY_COLORS[pair.lang.family]

  function flipCard() {
    if (revealed) return
    setFlipped(true)
    setTimeout(() => setReveal(true), 260)
  }

  // SM-2 quality mapping:
  // "Bilmiyorum" → 1, "Atla" → 3, "Zorlandım" → 3, "Biliyorum" → 5
  function next(quality: number) {
    review(pair.entryId, pair.lang.code, quality)
    if (quality >= 3) {
      setStreak(s => s + 1)
      onXp(quality === 5 ? 10 : 5)
    } else {
      setStreak(0)
    }
    if (idx + 1 >= pairs.length) { setDone(true); return }
    setAnimKey(k => k + 1)
    setIdx(i => i + 1)
    setFlipped(false)
    setReveal(false)
  }

  function restart() {
    setIdx(0); setFlipped(false); setReveal(false)
    setStreak(0); setDone(false); setAnimKey(k => k + 1)
  }

  if (done) return (
    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2, p: 3, textAlign: 'center' }}>
      <Typography sx={{ fontSize: 56 }}>🎉</Typography>
      <Typography variant="headlineMedium">Tamamlandı!</Typography>
      <Typography variant="bodyLarge" color="text.secondary">
        {pairs.length} kart · En uzun seri: {streak}
      </Typography>
      <Button variant="contained" onClick={restart} startIcon={<RestartAltIcon />} sx={{ borderRadius: 20 }}>
        Tekrar Başla
      </Button>
    </Box>
  )

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, gap: 2.5, overflow: 'auto' }}>

      {/* Mode selector */}
      <Stack direction="row" alignItems="center" gap={1.5} width="100%" maxWidth={440}>
        <ToggleButtonGroup value={mode} exclusive onChange={(_, v) => { if (v) { setMode(v); restart() } }} size="small">
          <ToggleButton value="due" sx={{ borderRadius: '20px 0 0 20px !important', px: 1.5, fontSize: '0.75rem', fontWeight: 700, textTransform: 'none' }}>
            <SchoolIcon sx={{ fontSize: 15, mr: 0.5 }} />
            Tekrar gerekli ({duePairs.length})
          </ToggleButton>
          <ToggleButton value="all" sx={{ borderRadius: '0 20px 20px 0 !important', px: 1.5, fontSize: '0.75rem', fontWeight: 700, textTransform: 'none' }}>
            <ShuffleIcon sx={{ fontSize: 15, mr: 0.5 }} />
            Tümü ({allPairs.length})
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Progress */}
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        <Stack direction="row" justifyContent="space-between" mb={0.75}>
          <Typography variant="labelSmall" color="text.secondary">{idx + 1} / {pairs.length}</Typography>
          <Stack direction="row" alignItems="center" gap={0.75}>
            {streak >= 3 && (
              <Chip
                label={`🔥 ${streak} seri`} size="small"
                sx={{ bgcolor: '#FFF3E0', color: '#E65100', fontWeight: 700, fontSize: '0.72rem', height: 22,
                  animation: 'pulse 0.3s ease', '@keyframes pulse': { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.08)' } },
                }}
              />
            )}
            <Typography variant="labelSmall" color="text.secondary">%{pct}</Typography>
          </Stack>
        </Stack>
        <LinearProgress variant="determinate" value={pct} sx={{
          height: 8, borderRadius: 99,
          bgcolor: theme.palette.divider,
          '& .MuiLinearProgress-bar': { bgcolor: theme.palette.primary.main },
        }} />
      </Box>

      {/* 3D Flip Card */}
      <Box
        key={animKey}
        sx={{ width: '100%', maxWidth: 440, height: 230, perspective: '900px', cursor: revealed ? 'default' : 'pointer' }}
        onClick={!revealed ? flipCard : undefined}
      >
        <Box sx={{
          width: '100%', height: '100%', position: 'relative',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.52s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {/* FRONT */}
          <Box sx={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 4,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, gap: 1,
            boxShadow: theme.shadows[2],
          }}>
            <Chip
              label={`${pair.lang.flag} ${pair.lang.name}`} size="small"
              sx={{ bgcolor: alpha(accent, 0.15), color: accent, fontWeight: 700, mb: 0.5 }}
            />
            <Typography variant="displaySmall" sx={{
              fontSize: pair.lang.family === 'other' ? '2.25rem' : '2rem',
              textAlign: 'center', lineHeight: 1.2,
            }}>
              {pair.val}
            </Typography>
            {pair.roman && (
              <Stack direction="row" alignItems="center" gap={0.5}>
                <Typography variant="bodyMedium" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  /{pair.roman}/
                </Typography>
                <Tooltip title="Romanizasyonu oku">
                  <IconButton size="small" sx={{ p: 0.25 }} onClick={e => { e.stopPropagation(); speak(pair.roman, 'en') }}>
                    <VolumeUpIcon sx={{ fontSize: 13 }} />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
            <Stack direction="row" alignItems="center" gap={0.5} mt={0.5}>
              <Tooltip title="Sesli oku">
                <IconButton size="small"
                  onClick={e => { e.stopPropagation(); speak(pair.val, pair.lang.code) }}
                  sx={{ bgcolor: alpha(accent, 0.1), color: accent, '&:hover': { bgcolor: alpha(accent, 0.2) } }}
                >
                  <VolumeUpIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Typography variant="bodySmall" color="text.secondary">Kartı çevir</Typography>
            </Stack>
          </Box>

          {/* BACK */}
          <Box sx={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            bgcolor: alpha(theme.palette.primary.main, 0.07),
            border: `2px solid ${theme.palette.primary.main}`,
            borderRadius: 4,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, gap: 1.5,
            boxShadow: theme.shadows[2],
          }}>
            <Chip label="✓ Cevap" size="small"
              sx={{ bgcolor: theme.palette.primary.main, color: '#fff', fontWeight: 700 }} />
            <Typography variant="headlineMedium" color="primary" textAlign="center">
              {pair.concept}
            </Typography>
            <Tooltip title="Kavramı İngilizce oku">
              <IconButton size="small" onClick={() => speak(pair.concept, 'en')}
                sx={{ bgcolor: alpha(theme.palette.primary.main, 0.12), color: theme.palette.primary.main }}>
                <VolumeUpIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* SM-2 Action buttons */}
      {!revealed ? (
        <Button variant="contained" size="large" onClick={flipCard}
          sx={{ borderRadius: 20, px: 5, fontWeight: 700 }}>
          Cevabı Göster
        </Button>
      ) : (
        <Stack gap={1} width="100%" maxWidth={440}>
          <Stack direction="row" gap={1}>
            <Button fullWidth variant="outlined" size="medium" onClick={() => next(1)}
              sx={{ borderRadius: 20, borderColor: theme.palette.error.main, color: theme.palette.error.main, fontWeight: 700, fontSize: '0.8rem',
                '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.06) } }}>
              ✗ Bilmiyorum
            </Button>
            <Button fullWidth variant="outlined" size="medium" onClick={() => next(3)}
              sx={{ borderRadius: 20, fontWeight: 700, fontSize: '0.8rem' }}>
              〰 Zorlandım
            </Button>
            <Button fullWidth variant="contained" size="medium" onClick={() => next(5)}
              sx={{ borderRadius: 20, fontWeight: 700, fontSize: '0.8rem' }}>
              ✓ Kolay!
            </Button>
          </Stack>
          <Typography variant="bodySmall" color="text.secondary" textAlign="center" sx={{ fontSize: '0.68rem' }}>
            Cevabınız bir sonraki tekrar tarihini belirler (SM-2 algoritması)
          </Typography>
        </Stack>
      )}
    </Box>
  )
}
