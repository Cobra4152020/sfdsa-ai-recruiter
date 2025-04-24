/**
 * Analytics service for tracking user interactions and events
 */

import { isProduction, ENABLE_ANALYTICS } from "@/lib/env-config"
import { logger } from "@/lib/logger"

// Types for analytics events
export type EventCategory = "engagement" | "conversion" | "navigation" | "content" | "error" | "performance"

export interface AnalyticsEvent {
  category: EventCategory
  action: string
  label?: string
  value?: number
  nonInteraction?: boolean
  dimensions?: Record<string, string>
  metrics?: Record<string, number>
}

export interface PageView {
  path: string
  title?: string
  referrer?: string
  search?: string
}

// Analytics service implementation
class AnalyticsService {
  private initialized = false
  private userId: string | null = null
  private userProperties: Record<string, any> = {}
  private enabled = ENABLE_ANALYTICS

  /**
   * Initialize analytics service
   */
  public init(): void {
    if (this.initialized) return

    if (typeof window === "undefined") return

    try {
      // Only initialize in production or if explicitly enabled
      if (!isProduction() && !this.enabled) {
        logger.info("Analytics disabled in development mode")
        return
      }

      // Initialize Google Analytics (GA4)
      this.initGoogleAnalytics()

      // Initialize other analytics services as needed
      // this.initMixpanel()
      // this.initSegment()

      this.initialized = true
      logger.info("Analytics service initialized")
    } catch (error) {
      logger.error("Failed to initialize analytics", { error })
    }
  }

  /**
   * Initialize Google Analytics
   */
  private initGoogleAnalytics(): void {
    if (typeof window === "undefined") return

    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

    if (!GA_MEASUREMENT_ID) {
      logger.warn("Google Analytics Measurement ID not found")
      return
    }

    // Load Google Analytics script
    const script = document.createElement("script")
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    script.async = true
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }

    window.gtag("js", new Date())
    window.gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: false, // We'll track page views manually
    })

    logger.info("Google Analytics initialized")
  }

  /**
   * Set user ID for tracking
   */
  public setUserId(userId: string): void {
    if (!this.initialized) this.init()

    this.userId = userId

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("set", { user_id: userId })
    }

    logger.debug("User ID set for analytics", { userId })
  }

  /**
   * Set user properties for tracking
   */
  public setUserProperties(properties: Record<string, any>): void {
    if (!this.initialized) this.init()

    this.userProperties = { ...this.userProperties, ...properties }

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("set", "user_properties", this.userProperties)
    }

    logger.debug("User properties set for analytics", { properties })
  }

  /**
   * Track page view
   */
  public trackPageView(pageView: PageView): void {
    if (!this.initialized) this.init()
    if (!this.enabled) return

    try {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "page_view", {
          page_path: pageView.path,
          page_title: pageView.title,
          page_referrer: pageView.referrer,
          page_search: pageView.search,
        })
      }

      logger.debug("Page view tracked", { pageView })
    } catch (error) {
      logger.error("Failed to track page view", { error, pageView })
    }
  }

  /**
   * Track event
   */
  public trackEvent(event: AnalyticsEvent): void {
    if (!this.initialized) this.init()
    if (!this.enabled) return

    try {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value,
          non_interaction: event.nonInteraction,
          ...event.dimensions,
          ...event.metrics,
        })
      }

      logger.debug("Event tracked", { event })
    } catch (error) {
      logger.error("Failed to track event", { error, event })
    }
  }

  /**
   * Track conversion
   */
  public trackConversion(conversionId: string, label?: string, value?: number): void {
    if (!this.initialized) this.init()
    if (!this.enabled) return

    try {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "conversion", {
          send_to: conversionId,
          event_label: label,
          value: value,
        })
      }

      logger.debug("Conversion tracked", { conversionId, label, value })
    } catch (error) {
      logger.error("Failed to track conversion", { error, conversionId })
    }
  }

  /**
   * Track error
   */
  public trackError(error: Error, context?: Record<string, any>): void {
    if (!this.initialized) this.init()
    if (!this.enabled) return

    try {
      const errorEvent: AnalyticsEvent = {
        category: "error",
        action: "exception",
        label: error.message,
        dimensions: {
          error_type: error.name,
          error_stack: error.stack || "No stack trace",
          ...context,
        },
        nonInteraction: true,
      }

      this.trackEvent(errorEvent)
      logger.debug("Error tracked", { error, context })
    } catch (trackingError) {
      logger.error("Failed to track error", { error: trackingError, originalError: error })
    }
  }

  /**
   * Track timing
   */
  public trackTiming(category: string, variable: string, value: number, label?: string): void {
    if (!this.initialized) this.init()
    if (!this.enabled) return

    try {
      const timingEvent: AnalyticsEvent = {
        category: "performance",
        action: "timing",
        label: label || variable,
        value: value,
        dimensions: {
          timing_category: category,
          timing_variable: variable,
        },
        nonInteraction: true,
      }

      this.trackEvent(timingEvent)
      logger.debug("Timing tracked", { category, variable, value, label })
    } catch (error) {
      logger.error("Failed to track timing", { error, category, variable })
    }
  }
}

// Create singleton instance
export const analytics = new AnalyticsService()

// Initialize analytics on client side
if (typeof window !== "undefined") {
  // Initialize after a short delay to not block page load
  setTimeout(() => {
    analytics.init()
  }, 1000)
}

// Add TypeScript definitions for gtag
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}
