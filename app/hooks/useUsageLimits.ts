'use client'
import { useState } from 'react'
import { useUsageLimitsContext } from '@/app/context/UsageLimitsContext'

interface UsageLimits {
  hasAccess: boolean
  isPremium: boolean
  remainingPrompts: number
  isAnonymous: boolean
  needsSession?: boolean
}

interface UseUsageLimitsResult {
  limits: UsageLimits | null
  loading: boolean
  error: string | null
  refreshLimits: () => Promise<void>
}

// Simple wrapper hook for backward compatibility
export function useUsageLimits(): UseUsageLimitsResult {
  return useUsageLimitsContext()
}

interface GenerateSketchResult {
  success: boolean
  data?: any
  error?: string
  message?: string
  remainingPrompts?: number
  isAnonymous?: boolean
  isPremium?: boolean
}

interface UseSketchGeneratorResult {
  generateSketch: (prompt: string) => Promise<GenerateSketchResult>
  loading: boolean
  error: string | null
}

export function useSketchGenerator(): UseSketchGeneratorResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSketch = async (prompt: string): Promise<GenerateSketchResult> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/generate-sketch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ prompt })
      })
      
      const data = await response.json()
      
      if (!data.success && data.error) {
        setError(data.message || data.error)
      }
      
      return data
    } catch (err) {
      const errorMessage = 'Network error while generating sketch'
      setError(errorMessage)
      console.error('Error generating sketch:', err)
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: errorMessage
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    generateSketch,
    loading,
    error
  }
}