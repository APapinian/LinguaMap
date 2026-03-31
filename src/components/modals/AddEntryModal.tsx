// src/components/modals/AddEntryModal.tsx
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Stack, Chip, Box,
  Typography, CircularProgress, Alert, alpha,
} from '@mui/material'
import { useState } from 'react'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { useTheme } from '@mui/material/styles'

const CATEGORIES = [
  { value: 'verb',    label: 'Fiil'   },
  { value: 'noun',    label: 'İsim'   },
  { value: 'adj',     label: 'Sıfat'  },
  { value: 'phrase',  label: 'İfade'  },
  { value: 'grammar', label: 'Gramer' },
]

export default function AddEntryModal({ open, onClose, onSave, translating, ollamaError }) {
  const theme = useTheme()
  const [form, setForm] = useState({ concept: '', category: 'verb', tags: '', cognateGroup: '' })
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])

  function handleTag(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const v = tagInput.trim().replace(/,/g, '')
      if (v && !tags.includes(v)) setTags(p => [...p, v])
      setTagInput('')
    }
  }
  function removeTag(t) { setTags(p => p.filter(x => x !== t)) }

  function handleSave() {
    if (!form.concept.trim()) return
    onSave({ concept: form.concept.trim(), category: form.category, tags, cognateGroup: form.cognateGroup.trim() })
    setForm({ concept: '', category: 'verb', tags: '', cognateGroup: '' })
    setTags([])
    setTagInput('')
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>Yeni kavram ekle</DialogTitle>
      <DialogContent sx={{ pt: '16px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>

        <TextField
          label="Kavram" fullWidth variant="outlined" size="small"
          value={form.concept}
          onChange={e => setForm(p => ({ ...p, concept: e.target.value }))}
          placeholder="örn: to love"
          autoFocus
        />

        <TextField
          select label="Kategori" fullWidth variant="outlined" size="small"
          value={form.category}
          onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
        >
          {CATEGORIES.map(c => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
        </TextField>

        {/* Tag input */}
        <Box>
          <TextField
            label="Etiketler" fullWidth variant="outlined" size="small"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleTag}
            placeholder="Yaz + Enter"
            helperText="Enter ile ekle"
          />
          {tags.length > 0 && (
            <Stack direction="row" gap={0.5} flexWrap="wrap" mt={0.75}>
              {tags.map(t => (
                <Chip key={t} label={`#${t}`} size="small" onDelete={() => removeTag(t)}
                  sx={{ bgcolor: theme.palette.m3.secondaryContainer, color: theme.palette.m3.onSecondaryContainer, fontWeight: 700, fontSize: '0.7rem' }}
                />
              ))}
            </Stack>
          )}
        </Box>

        <TextField
          label="Cognate grubu (opsiyonel)" fullWidth variant="outlined" size="small"
          value={form.cognateGroup}
          onChange={e => setForm(p => ({ ...p, cognateGroup: e.target.value }))}
          placeholder="amor-group"
        />

        {/* Ollama notice */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          borderRadius: 3, p: 1.25,
        }}>
          <AutoAwesomeIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
          <Typography variant="bodySmall" color="text.secondary">
            Kaydettikten sonra Ollama 13 dile otomatik çevirecek.
          </Typography>
        </Box>

        {ollamaError && <Alert severity="warning" sx={{ borderRadius: 3 }}>Ollama bağlantı hatası — çeviri atlandı.</Alert>}
        {translating && (
          <Stack direction="row" alignItems="center" gap={1}>
            <CircularProgress size={14} />
            <Typography variant="bodySmall" color="text.secondary">Çeviriliyor...</Typography>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 20 }}>İptal</Button>
        <Button onClick={handleSave} variant="contained" disabled={!form.concept.trim() || translating}
          startIcon={translating ? <CircularProgress size={14} color="inherit" /> : <AutoAwesomeIcon />}
          sx={{ borderRadius: 20 }}>
          Kaydet + Çevir
        </Button>
      </DialogActions>
    </Dialog>
  )
}
