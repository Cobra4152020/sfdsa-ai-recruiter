import { AchievementBadge } from "./achievement-badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { BadgeType } from "@/app/api/leaderboard/route"

interface EarnedBadgesProps {
  badges: Record<BadgeType, boolean> | any[]
  userName: string
}

export function EarnedBadges({ badges, userName }: EarnedBadgesProps) {
  // Handle both array format (old) and record format (new)
  const badgeEntries = Array.isArray(badges)
    ? badges.map((badge) => [badge.type || badge.badge_type, true])
    : Object.entries(badges)

  // Convert kebab-case to camelCase for display
  const formatBadgeName = (name: string) => {
    return name
      .split("-")
      .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
      .join(" ")
      .split("_")
      .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
      .join(" ")
  }

  // Format badge name for display
  const getBadgeDisplayName = (badgeType: string) => {
    const formattedName = formatBadgeName(badgeType)

    // Special case formatting
    switch (badgeType) {
      case "chat-participation":
        return "Chat Participation"
      case "first-response":
        return "First Response"
      case "application-started":
        return "Application Started"
      case "application-completed":
        return "Application Completed"
      case "frequent-user":
        return "Frequent User"
      case "resource-downloader":
        return "Resource Downloader"
      default:
        return formattedName.charAt(0).toUpperCase() + formattedName.slice(1)
    }
  }

  // Filter to only show earned badges
  const earnedBadges = badgeEntries.filter(([_, earned]) => earned === true)

  if (earnedBadges.length === 0) {
    return <span className="text-gray-400 italic text-sm">No badges yet</span>
  }

  return (
    <div className="flex flex-wrap gap-1">
      {earnedBadges.map(([badgeType]) => (
        <TooltipProvider key={badgeType}>
          <Tooltip>
            <TooltipTrigger>
              <AchievementBadge type={badgeType as BadgeType} size="sm" earned={true} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{getBadgeDisplayName(badgeType)} Badge</p>
              <p className="text-xs text-gray-400">Earned by {userName}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}