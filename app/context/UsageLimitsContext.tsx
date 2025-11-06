'use client'
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface UsageLimits {
  hasAccess: boolean
  isPremium: boolean
  remainingPrompts: number
  isAnonymous: boolean
  needsSession?: boolean
}

interface UsageLimitsContextType {
  limits: UsageLimits | null
  loading: boolean
  error: string | null
  refreshLimits: () => Promise<void>
}

const UsageLimitsContext = createContext<UsageLimitsContextType | null>(null)

export function UsageLimitsProvider({ children }: { children: React.ReactNode }) {
  const [limits, setLimits] = useState<UsageLimits | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLimits = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/generate-sketch', {
        method: 'GET',
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setLimits(data.limits)
      } else {
        setError(data.message || 'Failed to fetch usage limits')
      }
    } catch (err) {
      setError('Network error while fetching usage limits')
      console.error('Error fetching usage limits:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLimits()
  }, [fetchLimits])

  const value = {
    limits,
    loading,
    error,
    refreshLimits: fetchLimits
  }

  return (
    <UsageLimitsContext.Provider value={value}>
      {children}
    </UsageLimitsContext.Provider>
  )
}

export function useUsageLimitsContext() {
  const context = useContext(UsageLimitsContext)
  if (!context) {
    throw new Error('useUsageLimitsContext must be used within a UsageLimitsProvider')
  }
  return context
}