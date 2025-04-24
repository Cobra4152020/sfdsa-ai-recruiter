"use client"

import { useEffect } from "react"
import ErrorDisplay from "@/components/error-display"
import { trackError } from "@/lib/monitoring"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to our monitoring service
    trackError(error, { page: "error", digest: error.digest })
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Something went wrong</h2>
        <ErrorDisplay error={error} reset={reset} className="mb-4" />
        <p className="text-center text-gray-600 text-sm mt-8">
          If this problem persists, please contact our support team.
        </p>
      </div>
    </div>
  )
}
