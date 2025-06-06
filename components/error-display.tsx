"use client"

import React from "react"
import { getUserFriendlyErrorMessage } from "@/lib/error-handler"
import { trackError } from "@/lib/monitoring"

interface ErrorDisplayProps {
  error: unknown
  reset?: () => void
  className?: string
}

export default function ErrorDisplay({ error, reset, className = "" }: ErrorDisplayProps) {
  // Track the error when the component mounts
  React.useEffect(() => {
    trackError(error)
  }, [error])

  const errorMessage = getUserFriendlyErrorMessage(error)

  return (
    <div className={`rounded-md bg-red-50 p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{errorMessage}</p>
          </div>
          {reset && (
            <div className="mt-4">
              <button
                type="button"
                onClick={reset}
                className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
