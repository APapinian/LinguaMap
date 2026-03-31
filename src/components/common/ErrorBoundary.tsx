// src/components/common/ErrorBoundary.tsx
import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { Box, Typography, Button, alpha } from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import RefreshIcon from '@mui/icons-material/Refresh'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[LinguaMap ErrorBoundary]', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <Box sx={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          p: 4, textAlign: 'center',
        }}>
          <Box sx={{
            width: 64, height: 64, borderRadius: '50%',
            bgcolor: alpha('#BA1A1A', 0.1),
            display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2,
          }}>
            <WarningAmberIcon sx={{ color: '#BA1A1A', fontSize: 32 }} />
          </Box>
          <Typography variant="headlineSmall" mb={1}>Bir şeyler ters gitti</Typography>
          <Typography variant="bodyMedium" color="text.secondary" mb={3} sx={{ maxWidth: 360 }}>
            {this.state.error?.message ?? 'Beklenmeyen hata'}
          </Typography>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={this.handleReset}>
            Tekrar dene
          </Button>
        </Box>
      )
    }

    return this.props.children
  }
}
