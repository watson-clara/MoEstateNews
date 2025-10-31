'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export default function ViewError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  // log error for debugging
  useEffect(() => {
    console.error('view page error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Oops, Something Went Wrong
            </h2>
                <p className="text-text-muted mb-6">
                  {error.message || 'Something went wrong loading briefs'}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={reset} variant="primary">
                    Try Again
              </Button>
          // button to navigate to the home page when clicked
          <Button onClick={() => router.push('/moestate-news')} variant="ghost">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
