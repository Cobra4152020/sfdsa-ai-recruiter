"use client"

import { usePageView } from "@/lib/analytics/hooks"
import { type ReactNode, useEffect } from "react"
import { analytics } from "@/lib/analytics"
import { useUser } from "@/context/user-context"

interface AnalyticsProviderProps {
  children: ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  // Track page views
  usePageView()

  // Get user info
  const { currentUser, isLoggedIn } = useUser()

  // Set user ID and properties when user logs in
  useEffect(() => {
    if (isLoggedIn && currentUser?.id) {
      analytics.setUserId(currentUser.id)

      analytics.setUserProperties({
        has_applied: currentUser.hasApplied || false,
        participation_count: currentUser.participationCount || 0,
        referral_count: currentUser.referralCount || 0,
        email_domain: currentUser.email ? currentUser.email.split("@")[1] : undefined,
        has_phone: !!currentUser.phone,
      })
    }
  }, [isLoggedIn, currentUser])

  return <>{children}</>
}
