/**
 * Monitoring integration for tracking errors and performance
 */

import { logger } from "./logger"
import { formatErrorForLogging } from "./error-handler"

// Track errors
export function trackError(error: unknown, context?: Record<string, any>) {
  const formattedError = formatErrorForLogging(error)
  logger.error("Application error", { ...formattedError, ...context })

  // In a real application, you would send this to a monitoring service
  // Example: Sentry, LogRocket, etc.
  // if (typeof window !== 'undefined' && window.Sentry) {
  //   window.Sentry.captureException(error, { extra: context })
  // }
}

// Track performance metrics
export function trackPerformance(id: string, duration: number, context?: Record<string, any>) {
  logger.debug(`Performance: ${ id }`, { duration, ...context })

  // In a real application, you would send this to a monitoring service
  // Example: Google Analytics, Mixpanel, etc.
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', 'timing_complete', {
  //     name,
  //     value: duration,
  //     ...context
  //   })
  // }
}

// Track user actions
export function trackUserAction(action: string, context?: Record<string, any>) {
  logger.info(`User action: ${action}`, context)

  // In a real application, you would send this to an analytics service
  // Example: Google Analytics, Mixpanel, etc.
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', action, context)
  // }
}

// Performance measurement utility
export function measurePerformance<T>(id: string, fn: () => T, context?: Record<string, any>): T {
  const startTime = performance.now()
  const result = fn()
  const duration = performance.now() - startTime

  trackPerformance(name, duration, context)
  return result
}

// Async performance measurement utility
export async function measureAsyncPerformance<T>(
  id: string,
  fn: () => Promise<T>,
  context?: Record<string, any>,
): Promise<T> {
  const startTime = performance.now()
  try {
    const result = await fn()
    const duration = performance.now() - startTime

    trackPerformance(name, duration, context)
    return result
  } catch (error) {
    const duration = performance.now() - startTime
    trackPerformance(name, duration, { ...context, error: true })
    throw error
  }
}
