// src/components/views/FlashcardView.jsx
import { useState, useEffect, useMemo, useRef } from 'react'
import {
  Box, Typography, Stack, Button, LinearProgress,
  Chip, alpha, IconButton, Tooltip,
} from '@mui/material'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { useTheme } from '@mui/material/styles'
import { LANGS } from '../../constants/languages'

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

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function FlashcardView({ entries, onXp }) {
  const theme = useTheme()
  const c = theme.palette.m3

  const pairs = useMemo(() => {
    const ps = []
    entries.forEach(e => {
      LANGS.forEach(l => {
        const t = e.translations?.[l.code]
        if (t?.value) ps.push({ concept: e.concept, lang: l, val: t.value, roman: t.romanization || '' })
      })
    })
    return shuffle(ps)
  }, [entries])

  const [idx, setIdx]         = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [revealed, setReveal] = useState(false)
  const [streak, setStreak]   = useState(0)
  const [done, setDone]       = useState(false)
  const [animKey, setAnimKey] = useState(0)

  const pair = pairs[idx % pairs.length]
  const pct  = Math.round((idx / pairs.length) * 100)

  const famColorMap = {
    roman:  { bg: alpha(c.familyRomanBg, 0.6), accent: c.familyRoman  },
    germen: { bg: alpha(c.familyGermenBg,0.6), accent: c.familyGermen },
    slav:   { bg: alpha(c.familySlavBg,  0.6), accent: c.familySlav   },
    other:  { bg: alpha(c.familyOtherBg, 0.6), accent: c.familyOther  },
  }
  const { bg, accent } = famColorMap[pair?.lang?.family] || famColorMap.other

  function flipCard() {
    if (revealed) return
    setFlipped(true)
    setTimeout(() => setReveal(true), 260)
  }

  function next(correct) {
    if (correct) { setStreak(s => s + 1); onXp?.(10) }
    else setStreak(0)
    if (idx + 1 >= pairs.length) { setDone(true); return }
    setAnimKey(k => k + 1)
    setIdx(i => i + 1)
    setFlipped(false)
    setReveal(false)
  }

  function restart() {
    setIdx(0); setFlipped(false); setReveal(false); setStreak(0); setDone(false)
  }

  if (done) return (
    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2, p: 3 }}>
      <Typography variant="displaySmall">🎉</Typography>
      <Typography variant="headlineMedium">Tamamlandı!</Typography>
      <Typography variant="bodyLarge" color="text.secondary">{pairs.length} kart · {streak} seri</Typography>
      <Button variant="contained" onClick={restart} startIcon={<RestartAltIcon />}>Tekrar Başla</Button>
    </Box>
  )

  if (!pair) return null

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, gap: 2.5, overflow: 'auto' }}>
      {/* Progress */}
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        <Stack direction="row" justifyContent="space-between" mb={0.75}>
          <Typography variant="labelSmall" color="text.secondary">{idx + 1} / {pairs.length}</Typography>
          <Stack direction="row" alignItems="center" gap={0.5}>
            {streak >= 3 && (
              <Chip label={`🔥 ${streak} seri`} size="small"
                sx={{ bgcolor: '#FFF3E0', color: '#E65100', fontWeight: 700, fontSize: '0.72rem', height: 22 }} />
            )}
            <Typography variant="labelSmall" color="text.secondary">%{pct}</Typography>
          </Stack>
        </Stack>
        <LinearProgress variant="determinate" value={pct} sx={{
          height: 8, borderRadius: 99,
          bgcolor: theme.palette.m3.outlineVariant,
          '& .MuiLinearProgress-bar': { bgcolor: theme.palette.primary.main },
        }} />
      </Box>

      {/* 3D flip card */}
      <Box key={animKey} sx={{
        width: '100%', maxWidth: 440, height: 220,
        perspective: '800px', cursor: revealed ? 'default' : 'pointer',
      }} onClick={!revealed ? flipCard : undefined}>
        <Box sx={{
          width: '100%', height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {/* FRONT */}
          <Box sx={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.m3.outlineVariant}`,
            borderRadius: 4,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', p: 3, gap: 1,
            boxShadow: theme.shadows[2],
          }}>
            <Chip
              label={`${pair.lang.flag} ${pair.lang.name}`} size="small"
              sx={{ bgcolor: alpha(accent, 0.15), color: accent, fontWeight: 700, mb: 0.5 }}
            />
            <Typography variant="displaySmall" sx={{ fontSize: pair.lang.family === 'other' ? '2.25rem' : '2rem', textAlign: 'center', lineHeight: 1.2 }}>
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
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            bgcolor: alpha(theme.palette.primary.main, 0.07),
            border: `2px solid ${theme.palette.primary.main}`,
            borderRadius: 4,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', p: 3, gap: 1,
            boxShadow: theme.shadows[2],
          }}>
            <Chip label="✓ Cevap" size="small" sx={{ bgcolor: theme.palette.m3.primaryContainer, color: theme.palette.m3.onPrimaryContainer, fontWeight: 700 }} />
            <Typography variant="headlineMedium" color="primary" textAlign="center">
              {pair.concept}
            </Typography>
            <Tooltip title="Kavramı oku">
              <IconButton size="small" onClick={() => speak(pair.concept, 'en')}
                sx={{ bgcolor: theme.palette.m3.primaryContainer, color: theme.palette.m3.onPrimaryContainer }}>
                <VolumeUpIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Action buttons */}
      {!revealed ? (
        <Button variant="contained" size="large" onClick={flipCard}
          sx={{ borderRadius: 20, px: 4, fontWeight: 700 }}>
          Cevabı Göster
        </Button>
      ) : (
        <Stack direction="row" gap={1.5} width="100%" maxWidth={440}>
          <Button fullWidth variant="outlined" size="large" onClick={() => next(false)}
            sx={{ borderRadius: 20, borderColor: theme.palette.error.main, color: theme.palette.error.main, fontWeight: 700,
              '&:hover': { bgcolor: theme.palette.m3.errorContainer } }}>
            ✗ Bilmiyorum
          </Button>
          <Button fullWidth variant="outlined" size="large" onClick={() => next(true, true)}
            sx={{ borderRadius: 20, fontWeight: 700 }}>
            → Atla
          </Button>
          <Button fullWidth variant="contained" size="large" onClick={() => next(true)}
            sx={{ borderRadius: 20, fontWeight: 700 }}>
            ✓ Biliyorum
          </Button>
        </Stack>
      )}
    </Box>
  )
}
