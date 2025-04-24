"use client"

/**
 * React hooks for analytics
 */

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { analytics, type AnalyticsEvent } from "./index"
import { useUser } from "@/context/user-context"

/**
 * Hook to track page views
 */
export function usePageView() {
  const pathname = usePathname()
  const [searchParams, setSearchParams] = useState<string>("")
  const { currentUser } = useUser()

  // Get search params safely on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSearchParams(window.location.search)
    }
  }, [])

  useEffect(() => {
    if (!pathname) return

    // Set user ID if available
    if (currentUser?.id) {
      analytics.setUserId(currentUser.id)

      // Set user properties
      analytics.setUserProperties({
        has_applied: currentUser.hasApplied || false,
        participation_count: currentUser.participationCount || 0,
        referral_count: currentUser.referralCount || 0,
      })
    }

    // Track page view
    analytics.trackPageView({
      path: pathname,
      search: searchParams,
      title: document.title,
      referrer: document.referrer,
    })
  }, [pathname, searchParams, currentUser])
}

/**
 * Hook to track component mount time
 */
export function useTrackComponentLoad(componentName: string) {
  const startTimeRef = useRef<number>(performance.now())

  useEffect(() => {
    const loadTime = performance.now() - startTimeRef.current

    analytics.trackTiming("component", "load", loadTime, componentName)

    return () => {
      const mountDuration = performance.now() - startTimeRef.current
      analytics.trackTiming("component", "mount_duration", mountDuration, componentName)
    }
  }, [componentName])
}

/**
 * Hook to track form submissions
 */
export function useTrackFormSubmission(formName: string) {
  const trackSubmit = (isSuccess: boolean, data?: Record<string, any>) => {
    const event: AnalyticsEvent = {
      category: "engagement",
      action: isSuccess ? "form_submit_success" : "form_submit_failure",
      label: formName,
      dimensions: {
        form_name: formName,
        ...data,
      },
    }

    analytics.trackEvent(event)
  }

  return trackSubmit
}

/**
 * Hook to track user interactions
 */
export function useTrackInteraction() {
  const trackInteraction = (action: string, label?: string, value?: number, dimensions?: Record<string, any>) => {
    const event: AnalyticsEvent = {
      category: "engagement",
      action,
      label,
      value,
      dimensions,
    }

    analytics.trackEvent(event)
  }

  return trackInteraction
}
