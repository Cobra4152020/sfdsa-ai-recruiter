"use client"

import React from "react"

import { type ReactNode, useEffect } from "react"
import { analytics, type AnalyticsEvent } from "@/lib/analytics"

interface TrackEventProps {
  event: AnalyticsEvent
  children?: ReactNode
  fireOnMount?: boolean
}

/**
 * Component to track an analytics event
 */
export function TrackEvent({ event, children, fireOnMount = true }: TrackEventProps) {
  useEffect(() => {
    if (fireOnMount) {
      analytics.trackEvent(event)
    }
  }, [event, fireOnMount])

  if (!children) return null

  return <>{children}</>
}

interface TrackClickProps {
  action: string
  label?: string
  value?: number
  category?: AnalyticsEvent["category"]
  dimensions?: Record<string, string>
  metrics?: Record<string, number>
  children: ReactNode
}

/**
 * Component to track click events
 */
export function TrackClick({
  action,
  label,
  value,
  category = "engagement",
  dimensions,
  metrics,
  children,
}: TrackClickProps) {
  const handleClick = () => {
    analytics.trackEvent({
      category,
      action,
      label,
      value,
      dimensions,
      metrics,
    })
  }

  // Clone the child element and add onClick handler
  if (children && typeof children === "object" && "type" in (children as any)) {
    const child = children as React.ReactElement

    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        // Call the original onClick if it exists
        if (child.props.onClick) {
          child.props.onClick(e)
        }

        handleClick()
      },
    })
  }

  return <span onClick={handleClick}>{children}</span>
}
