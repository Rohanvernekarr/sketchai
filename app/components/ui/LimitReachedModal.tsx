'use client'
import { useRouter } from 'next/navigation'

interface LimitReachedModalProps {
  isOpen: boolean
  onClose: () => void
  remainingPrompts: number
  isAnonymous: boolean
}

export default function LimitReachedModal({ 
  isOpen, 
  onClose, 
  remainingPrompts, 
  isAnonymous 
}: LimitReachedModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleLoginClick = () => {
    router.push('/')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isAnonymous 
              ? (remainingPrompts === 0 ? 'Free Trial Limit Reached' : 'Almost There!') 
              : 'Daily Limit Reached'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-semibold"
          >
            ×
          </button>
        </div>
        
        <div className="mb-6">
          {isAnonymous ? (
            remainingPrompts === 0 ? (
              <div className="space-y-3">
                <p className="text-gray-600">
                  You've used your free trial prompt! Sign in to get 3 daily AI generations.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h3 className="font-semibold text-blue-900 mb-1">What you get with an account:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 3 AI generations per day</li>
                    <li>• Save and organize your designs</li>
                    <li>• Access to premium templates</li>
                    <li>• Priority processing</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-600">
                  You have <span className="font-semibold text-orange-600">{remainingPrompts}</span> free 
                  prompt{remainingPrompts !== 1 ? 's' : ''} remaining.
                </p>
                <p className="text-sm text-gray-500">
                  Sign in now to get 3 daily AI generations and save your work!
                </p>
              </div>
            )
          ) : (
            <div className="space-y-3">
              <p className="text-gray-600">
                You've used your 3 daily AI generations. Your limit resets tomorrow.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <h3 className="font-semibold text-orange-900 mb-1">Want unlimited access?</h3>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Unlimited AI generations</li>
                  <li>• Priority processing</li>
                  <li>• Advanced features</li>
                  <li>• No daily limits</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {isAnonymous ? (
            <>
              <button
                onClick={handleLoginClick}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Sign In for Daily Access
              </button>
              {remainingPrompts > 0 && (
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Continue ({remainingPrompts} left)
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => {/* TODO: Implement premium upgrade */}}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Upgrade to Premium
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Try Again Tomorrow
              </button>
            </>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          {isAnonymous ? 'Free forever • No credit card required' : 'Limit resets daily at midnight'}
        </p>
      </div>
    </div>
  )
}