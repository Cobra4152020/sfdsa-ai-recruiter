"use client"

import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BadgeSharingDialog } from "@/components/badge-sharing-dialog"

export interface BadgeType {
  id: string
  name: string
  description: string
  icon: "shield" | "award" | "trophy" | "star" | "target" | "medal"
  color: string
  earnedAt: Date
  shareMessage: string
  imageUrl?: string
  emoji?: string
}

interface EarnedBadgesProps {
  badges: BadgeType[]
  userName: string
}

export function EarnedBadges({ badges, userName }: EarnedBadgesProps) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null)
  const [isSharingOpen, setIsSharingOpen] = useState(false)

  const handleBadgeClick = (badge: BadgeType) => {
    setSelectedBadge(badge)
    setIsSharingOpen(true)
  }

  // Map badge types to fun badge emojis and styles
  const getBadgeStyles = (badge: BadgeType) => {
    const styles: Record<string, { bgColor: string; borderColor: string; shadowColor: string; emoji: string }> = {
      shield: {
        bgColor: "from-emerald-500 to-green-600",
        borderColor: "border-emerald-300",
        shadowColor: "rgba(16, 185, 129, 0.5)",
        emoji: "🛡️",
      },
      award: {
        bgColor: "from-amber-500 to-orange-600",
        borderColor: "border-amber-300",
        shadowColor: "rgba(245, 158, 11, 0.5)",
        emoji: "🏆",
      },
      trophy: {
        bgColor: "from-yellow-400 to-yellow-600",
        borderColor: "border-yellow-300",
        shadowColor: "rgba(234, 179, 8, 0.5)",
        emoji: "🏅",
      },
      star: {
        bgColor: "from-blue-500 to-indigo-600",
        borderColor: "border-blue-300",
        shadowColor: "rgba(59, 130, 246, 0.5)",
        emoji: "⭐",
      },
      target: {
        bgColor: "from-purple-500 to-violet-600",
        borderColor: "border-purple-300",
        shadowColor: "rgba(139, 92, 246, 0.5)",
        emoji: "🎯",
      },
      medal: {
        bgColor: "from-red-500 to-rose-600",
        borderColor: "border-red-300",
        shadowColor: "rgba(239, 68, 68, 0.5)",
        emoji: "🥇",
      },
    }

    // Default style if the icon type is not found
    const defaultStyle = {
      bgColor: "from-gray-500 to-gray-600",
      borderColor: "border-gray-300",
      shadowColor: "rgba(107, 114, 128, 0.5)",
      emoji: "🔔",
    }

    return styles[badge.icon] || defaultStyle
  }

  // Render a fun badge
  const renderBadge = (badge: BadgeType) => {
    const style = getBadgeStyles(badge)
    const emoji = badge.emoji || style.emoji

    return (
      <button
        key={badge.id}
        onClick={() => handleBadgeClick(badge)}
        className="relative inline-flex items-center justify-center rounded-full h-7 w-7 transition-all duration-300 transform hover:scale-110 group"
        style={{
          boxShadow: `0 0 8px 1px ${style.shadowColor}`,
        }}
        aria-label={`${badge.name} badge`}
      >
        {/* Badge content */}
        <div
          className={`relative flex items-center justify-center h-full w-full rounded-full border ${style.borderColor} bg-gradient-to-br ${style.bgColor} overflow-hidden`}
        >
          <span className="text-white text-sm">{emoji}</span>
        </div>

        {/* Subtle shine effect */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-[-100%] w-[300%] h-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transform rotate-45 group-hover:animate-shine"></div>
        </div>
      </button>
    )
  }

  return (
    <div className="flex flex-wrap gap-1">
      <TooltipProvider>
        {badges.map((badge) => (
          <Tooltip key={badge.id}>
            <TooltipTrigger asChild>{renderBadge(badge)}</TooltipTrigger>
            <TooltipContent className="bg-black/90 border-gray-700 text-white">
              <div className="text-sm">
                <p className="font-bold text-white">{badge.name}</p>
                <p className="text-xs text-gray-300">{badge.description}</p>
                <p className="text-xs mt-1 text-gray-400">Earned: {new Date(badge.earnedAt).toLocaleDateString()}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>

      {selectedBadge && (
        <BadgeSharingDialog
          isOpen={isSharingOpen}
          onClose={() => setIsSharingOpen(false)}
          badge={selectedBadge}
          userName={userName}
        />
      )}
    </div>
  )
}

