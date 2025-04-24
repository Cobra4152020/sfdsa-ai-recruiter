"use client"

import React from "react"
import { trackError } from "@/lib/monitoring"
import ErrorDisplay from "./error-display"

interface GlobalErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class GlobalErrorBoundary extends React.Component<GlobalErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to our monitoring service
    trackError(error, {
      componentStack: errorInfo.componentStack,
      boundary: "GlobalErrorBoundary",
    })
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <ErrorDisplay error={this.state.error} reset={() => this.setState({ hasError: false, error: null })} />
        </div>
      )
    }

    return this.props.children
  }
}
