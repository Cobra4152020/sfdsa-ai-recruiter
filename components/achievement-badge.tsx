"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState } from "react"

type BadgeType =
  | "written"
  | "oral"
  | "physical"
  | "polygraph"
  | "psychological"
  | "full"
  | "chat-participation"
  | "application-started"
  | "application-completed"
  | "first-response"
  | "frequent-user"
  | "resource-downloader"

interface AchievementBadgeProps {
  type: BadgeType
  size?: "sm" | "md" | "lg"
  earned?: boolean
  className?: string
}

export function AchievementBadge({ type, size = "md", earned = true, className }: AchievementBadgeProps) {
  const [imageError, setImageError] = useState(false)

  const badges = {
    written: "/images/badges/written-badge.svg",
    oral: "/images/badges/oral-badge.svg",
    physical: "/images/badges/physical-badge.svg",
    polygraph: "/images/badges/polygraph-badge.svg",
    psychological: "/images/badges/psychological-badge.svg",
    full: "/images/badges/full-badge.svg",
    "chat-participation": "/images/badges/chat-participation-badge.svg",
    "application-started": "/images/badges/application-started-badge.svg",
    "application-completed": "/images/badges/application-completed-badge.svg",
    "first-response": "/images/badges/first-response-badge.svg",
    "frequent-user": "/images/badges/frequent-user-badge.svg",
    "resource-downloader": "/images/badges/resource-downloader-badge.svg",
  }

  const sizes = {
    sm: 40,
    md: 64,
    lg: 96,
  }

  const badgeSize = sizes[size]

  // Format badge name for display
  const getBadgeDisplayName = (badgeType: string) => {
    return badgeType
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // If image fails to load, show a fallback
  const handleImageError = () => {
    setImageError(true)
  }

  const badgeName = getBadgeDisplayName(type)

  return (
    <div
      className={cn("relative inline-block", !earned && "opacity-40 grayscale", className)}
      role="img"
      aria-label={`${badgeName} Badge ${earned ? "Earned" : "Not Earned"}`}
    >
      {imageError ? (
        <div
          className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full"
          style={{ width: badgeSize, height: badgeSize }}
        >
          <span className="text-xs text-center px-1">{badgeName}</span>
        </div>
      ) : (
        <Image
          src={badges[type] || "/placeholder.svg"}
          width={badgeSize}
          height={badgeSize}
          alt=""
          className="drop-shadow-md"
          onError={handleImageError}
          aria-hidden="true"
        />
      )}
      {!earned && (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <div className="bg-black/30 rounded-full w-full h-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/80"
            >
              <path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2l3 6.3 7 1-5 4.8 1.2 6.9-6.2-3.2Z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}
