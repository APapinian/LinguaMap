// src/components/views/BadgesView.jsx
import {
  Box, Typography, Stack, Card, CardContent, Chip, LinearProgress, alpha,
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import { useTheme } from '@mui/material/styles'
import { BADGES } from '../../constants/languages'

export default function BadgesView({ xp }) {
  const theme = useTheme()
  const earned = BADGES.filter(b => b.earned)
  const locked = BADGES.filter(b => !b.earned)
  const totalXp = BADGES.filter(b => b.earned).reduce((s, b) => s + b.xp, 0)
  const maxXp   = BADGES.reduce((s, b) => s + b.xp, 0)

  return (
    <Box sx={{ p: 2, overflow: 'auto', flex: 1 }}>
      {/* XP summary */}
      <Card sx={{ mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
        <CardContent>
          <Stack direction="row" alignItems="center" gap={2}>
            <Typography variant="displayMedium" sx={{ fontSize: '2.5rem' }}>⭐</Typography>
            <Box flex={1}>
              <Typography variant="headlineSmall" color="primary">{xp.toLocaleString()} XP</Typography>
              <Typography variant="bodySmall" color="text.secondary">{earned.length} / {BADGES.length} rozet kazanıldı</Typography>
              <LinearProgress variant="determinate" value={(totalXp / maxXp) * 100}
                sx={{ mt: 1, height: 8, borderRadius: 99, bgcolor: theme.palette.m3.outlineVariant,
                  '& .MuiLinearProgress-bar': { bgcolor: theme.palette.primary.main } }} />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Earned */}
      <Typography variant="titleMedium" mb={1.5}>Kazanıldı ({earned.length})</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 1.5, mb: 3 }}>
        {earned.map(b => (
          <Card key={b.id} sx={{
            bgcolor: '#FFF9E0',
            border: `1.5px solid #FFC800`,
            textAlign: 'center',
          }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontSize: 32, mb: 1 }}>{b.icon}</Typography>
              <Typography variant="titleSmall" sx={{ color: '#7a5a00', display: 'block', mb: 0.5 }}>{b.label}</Typography>
              <Typography variant="bodySmall" color="text.secondary" sx={{ fontSize: '0.68rem' }}>{b.desc}</Typography>
              <Chip label={`+${b.xp} XP`} size="small"
                sx={{ mt: 1, bgcolor: '#FFF3E0', color: '#E65100', fontWeight: 700, fontSize: '0.65rem', height: 20 }} />
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Locked */}
      <Typography variant="titleMedium" mb={1.5} color="text.secondary">Kilitli ({locked.length})</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 1.5 }}>
        {locked.map(b => (
          <Card key={b.id} sx={{ opacity: 0.55, textAlign: 'center' }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Typography sx={{ fontSize: 32, mb: 1, filter: 'grayscale(1)' }}>{b.icon}</Typography>
              <Typography variant="titleSmall" sx={{ display: 'block', mb: 0.5 }}>{b.label}</Typography>
              <Typography variant="bodySmall" color="text.secondary" sx={{ fontSize: '0.68rem' }}>{b.desc}</Typography>
              <Stack direction="row" alignItems="center" justifyContent="center" gap={0.5} mt={1}>
                <LockIcon sx={{ fontSize: 11, color: 'text.disabled' }} />
                <Typography variant="labelSmall" color="text.disabled" sx={{ fontSize: '0.65rem' }}>+{b.xp} XP</Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}
