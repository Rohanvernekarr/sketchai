'use client'
import { useUsageLimits } from '@/app/hooks/useUsageLimits'

interface UsageIndicatorProps {
  className?: string
}

export default function UsageIndicator({ className = '' }: UsageIndicatorProps) {
  const { limits, loading } = useUsageLimits()

  if (loading || !limits) return null

  // Don't show for premium users
  if (!limits.isAnonymous && limits.isPremium) return null

  const getIndicatorColor = () => {
    if (!limits.hasAccess) return 'bg-red-500'
    if (limits.remainingPrompts === 0) return 'bg-red-500'
    if (limits.remainingPrompts === 1) return 'bg-orange-500'
    return 'bg-green-500'
  }

  const getTextColor = () => {
    if (!limits.hasAccess) return 'text-red-700'
    if (limits.remainingPrompts === 0) return 'text-red-700'
    if (limits.remainingPrompts === 1) return 'text-orange-700'
    return 'text-green-700'
  }

  const getMessage = () => {
    if (!limits.hasAccess) {
      if (limits.isAnonymous) {
        return 'Free trial used • Sign in for daily access'
      } else {
        return 'Daily limit reached • Resets tomorrow'
      }
    }
    
    if (limits.isAnonymous) {
      const remaining = limits.remainingPrompts
      if (remaining === 0) return 'Last free prompt used'
      if (remaining === 1) return '1 free prompt remaining'
      return `${remaining} free prompts remaining`
    } else {
      // Authenticated user with daily limits
      const remaining = limits.remainingPrompts
      if (remaining === 0) return 'Daily limit used • Resets tomorrow'
      if (remaining === 1) return '1 prompt left today'
      return `${remaining} prompts left today`
    }
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${className}`}>
      <div className={`w-2 h-2 rounded-full ${getIndicatorColor()}`} />
      <span className={`text-sm font-medium ${getTextColor()}`}>
        {getMessage()}
      </span>
      {limits.isAnonymous && (
        <span onClick={() => window.location.href = '/'} className="text-xs text-gray-400 hover:text-gray-300 cursor-pointer">
          • Sign in for daily access
        </span>
      )}
    </div>
  )
}