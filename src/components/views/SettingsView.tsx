// src/components/views/SettingsView.tsx
import {
  Box, Typography, Stack, Switch, Chip, Divider,
  TextField, Select, MenuItem, Button, Alert,
  FormControlLabel, alpha, Card, CardContent,
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { useTheme } from '@mui/material/styles'
import { LANGS, FAMILY_COLORS } from '@/constants/languages'
import type { AppSettings, LangCode } from '@/types'

const OLLAMA_MODELS = ['qwen2.5:7b', 'deepseek-r1:8b', 'qwen2.5-coder:7b', 'llama3.1:8b', 'mistral:7b']

interface Props {
  settings: AppSettings
  onUpdate: (patch: Partial<AppSettings>) => void
  onReset: () => void
  isSupabaseEnabled: boolean
}

export default function SettingsView({ settings, onUpdate, onReset, isSupabaseEnabled }: Props) {
  const theme = useTheme()

  function toggleLang(code: LangCode) {
    const current = settings.visibleLangs
    if (current.includes(code)) {
      if (current.length <= 2) return // min 2 langs
      onUpdate({ visibleLangs: current.filter(c => c !== code) })
    } else {
      onUpdate({ visibleLangs: [...current, code] })
    }
  }

  return (
    <Box sx={{ p: 2, overflow: 'auto', flex: 1, maxWidth: 600 }}>
      <Stack direction="row" alignItems="center" gap={1} mb={3}>
        <SettingsIcon color="primary" />
        <Typography variant="headlineSmall">Ayarlar</Typography>
      </Stack>

      {/* Supabase status */}
      <Card sx={{ mb: 3, bgcolor: isSupabaseEnabled
        ? alpha('#2E7D32', 0.06) : alpha('#E65100', 0.06) }}>
        <CardContent sx={{ p: '14px !important' }}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Box sx={{
              width: 10, height: 10, borderRadius: '50%',
              bgcolor: isSupabaseEnabled ? '#2E7D32' : '#E65100',
            }} />
            <Typography variant="labelMedium" color={isSupabaseEnabled ? '#2E7D32' : '#E65100'}>
              {isSupabaseEnabled ? 'Supabase bağlı' : 'Mock mod (Supabase bağlı değil)'}
            </Typography>
          </Stack>
          {!isSupabaseEnabled && (
            <Typography variant="bodySmall" color="text.secondary" mt={0.5}>
              .env.local dosyasına VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY ekleyin.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Ollama */}
      <Typography variant="titleMedium" mb={1.5}>Ollama Modeli</Typography>
      <Stack gap={1.5} mb={3}>
        <TextField
          label="Ollama URL" size="small" fullWidth
          value={settings.ollamaUrl}
          onChange={e => onUpdate({ ollamaUrl: e.target.value })}
          placeholder="http://localhost:11434"
        />
        <Select
          size="small" fullWidth
          value={settings.ollamaModel}
          onChange={e => onUpdate({ ollamaModel: e.target.value })}
        >
          {OLLAMA_MODELS.map(m => (
            <MenuItem key={m} value={m}>{m}</MenuItem>
          ))}
        </Select>
        <Alert severity="info" sx={{ borderRadius: 3, py: 0.5 }}>
          <Typography variant="bodySmall">
            Yeni kavram eklendiğinde otomatik çeviri için Ollama çalışır durumda olmalı.
          </Typography>
        </Alert>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Visible languages */}
      <Typography variant="titleMedium" mb={0.5}>Görünür Diller</Typography>
      <Typography variant="bodySmall" color="text.secondary" mb={1.5}>
        Tablo ve kartlarda hangi dillerin gösterileceğini seç (min. 2)
      </Typography>

      {/* Group by family */}
      {(['roman', 'germen', 'slav', 'other'] as const).map(family => {
        const famLangs = LANGS.filter(l => l.family === family)
        const { main, bg, label } = FAMILY_COLORS[family]
        return (
          <Box key={family} mb={2}>
            <Typography variant="labelSmall" sx={{ color: main, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: '.04em' }}>
              {label}
            </Typography>
            <Stack direction="row" gap={0.75} flexWrap="wrap">
              {famLangs.map(lang => {
                const on = settings.visibleLangs.includes(lang.code)
                return (
                  <Chip
                    key={lang.code}
                    label={`${lang.flag} ${lang.name}`}
                    onClick={() => toggleLang(lang.code)}
                    size="small"
                    sx={{
                      cursor: 'pointer',
                      bgcolor: on ? alpha(main, 0.15) : 'transparent',
                      color: on ? main : theme.palette.text.secondary,
                      border: `1.5px solid ${on ? main : theme.palette.divider}`,
                      fontWeight: on ? 700 : 400,
                    }}
                  />
                )
              })}
            </Stack>
          </Box>
        )
      })}

      <Divider sx={{ mb: 3 }} />

      {/* Danger zone */}
      <Typography variant="titleMedium" color="error" mb={1.5}>Tehlikeli alan</Typography>
      <Button
        variant="outlined" color="error" startIcon={<RestartAltIcon />}
        onClick={() => { if (window.confirm('Tüm ayarlar sıfırlansın mı?')) onReset() }}
      >
        Ayarları sıfırla
      </Button>
    </Box>
  )
}
