// src/components/common/Skeletons.tsx
import { Box, Skeleton, Stack, Card, CardContent } from '@mui/material'

export function EntryCardSkeleton() {
  return (
    <Card sx={{ mb: 1.5 }}>
      <CardContent sx={{ p: '14px !important' }}>
        <Stack direction="row" alignItems="center" gap={1} mb={1.5}>
          <Skeleton variant="rounded" width={40} height={22} sx={{ borderRadius: '6px' }} />
          <Skeleton variant="text" width={160} height={24} />
          <Box flex={1} />
          <Skeleton variant="rounded" width={80} height={22} sx={{ borderRadius: '6px' }} />
        </Stack>
        <Stack direction="row" alignItems="center" gap={1}>
          {Array.from({ length: 13 }).map((_, i) => (
            <Skeleton key={i} variant="circular" width={22} height={22} />
          ))}
          <Box flex={1} />
          <Skeleton variant="rounded" width={40} height={6} sx={{ borderRadius: 99, flex: 1, maxWidth: 80 }} />
          <Skeleton variant="text" width={28} />
        </Stack>
      </CardContent>
    </Card>
  )
}

export function TableViewSkeleton() {
  return (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="rounded" height={40} sx={{ borderRadius: 99, mb: 2 }} />
      <Stack direction="row" gap={1} mb={2}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" width={60} height={32} sx={{ borderRadius: 99 }} />
        ))}
      </Stack>
      {Array.from({ length: 4 }).map((_, i) => (
        <EntryCardSkeleton key={i} />
      ))}
    </Box>
  )
}

export function ConjCardSkeleton() {
  return (
    <Card>
      <CardContent sx={{ p: '14px !important' }}>
        <Stack direction="row" justifyContent="space-between" mb={1}>
          <Skeleton variant="text" width={100} />
          <Skeleton variant="circular" width={24} height={24} />
        </Stack>
        <Skeleton variant="text" width={80} height={28} sx={{ mb: 1 }} />
        {Array.from({ length: 4 }).map((_, i) => (
          <Stack key={i} direction="row" gap={1} mb={0.5}>
            <Skeleton variant="text" width={32} />
            <Skeleton variant="text" width={80} />
          </Stack>
        ))}
      </CardContent>
    </Card>
  )
}

export function VerbViewSkeleton() {
  return (
    <Box>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" gap={1}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" width={80} height={36} sx={{ borderRadius: 99 }} />
          ))}
        </Stack>
      </Box>
      <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 1.5 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ConjCardSkeleton key={i} />
        ))}
      </Box>
    </Box>
  )
}

export function FlashcardSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, gap: 2.5 }}>
      <Skeleton variant="rounded" width="100%" height={8} sx={{ maxWidth: 440, borderRadius: 99 }} />
      <Skeleton variant="rounded" width="100%" height={200} sx={{ maxWidth: 440, borderRadius: 4 }} />
      <Skeleton variant="rounded" width={200} height={48} sx={{ borderRadius: 99 }} />
    </Box>
  )
}
