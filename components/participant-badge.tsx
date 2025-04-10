import React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Shield, Award, Zap, Brain, CheckCircle, Link } from "lucide-react"

export type ParticipantBadgeType =
  | "hard-charger"
  | "deep-diver"
  | "quick-learner"
  | "persistent-explorer"
  | "dedicated-applicant"
  | "connector"

interface ParticipantBadgeProps {
  type: ParticipantBadgeType
  size?: "sm" | "md" | "lg"
  showTooltip?: boolean
}

export function ParticipantBadge({ type, size = "md", showTooltip = true }: ParticipantBadgeProps) {
  // Define badge designs with Lucide icons instead of image files
  const badges = {
    "hard-charger": {
      icon: <Shield className="text-white" />,
      label: "Hard Charger",
      description: "Consistently asks questions and has applied",
      bgColor: "from-amber-500 to-orange-600",
      borderColor: "border-amber-300",
      shadowColor: "rgba(245, 158, 11, 0.5)",
    },
    "deep-diver": {
      icon: <Brain className="text-white" />,
      label: "Deep Diver",
      description: "Explores topics in great detail",
      bgColor: "from-blue-500 to-indigo-600",
      borderColor: "border-blue-300",
      shadowColor: "rgba(59, 130, 246, 0.5)",
    },
    "quick-learner": {
      icon: <Zap className="text-white" />,
      label: "Quick Learner",
      description: "Rapidly progresses through recruitment information",
      bgColor: "from-purple-500 to-violet-600",
      borderColor: "border-purple-300",
      shadowColor: "rgba(139, 92, 246, 0.5)",
    },
    "persistent-explorer": {
      icon: <Brain className="text-white" />,
      label: "Persistent Explorer",
      description: "Returns regularly to learn more",
      bgColor: "from-emerald-500 to-green-600",
      borderColor: "border-emerald-300",
      shadowColor: "rgba(16, 185, 129, 0.5)",
    },
    "dedicated-applicant": {
      icon: <CheckCircle className="text-white" />,
      label: "Dedicated Applicant",
      description: "Applied and continues to engage",
      bgColor: "from-red-500 to-rose-600",
      borderColor: "border-red-300",
      shadowColor: "rgba(239, 68, 68, 0.5)",
    },
    connector: {
      icon: <Link className="text-white" />,
      label: "Connector",
      description: "Connects with other participants",
      bgColor: "from-cyan-500 to-teal-600",
      borderColor: "border-cyan-300",
      shadowColor: "rgba(6, 182, 212, 0.5)",
    },
  }

  // Add a fallback badge in case the type doesn't exist
  const badge = badges[type] || {
    icon: <Award className="text-white" />,
    label: "Badge",
    description: "Achievement badge",
    bgColor: "from-gray-500 to-gray-600",
    borderColor: "border-gray-300",
    shadowColor: "rgba(107, 114, 128, 0.5)",
  }

  // Size classes
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  // Badge component with styling
  const BadgeComponent = (
    <div
      className={`relative inline-flex items-center justify-center rounded-full ${sizeClasses[size]} transition-all duration-300 transform hover:scale-110`}
      style={{
        boxShadow: `0 0 8px 1px ${badge.shadowColor}`,
      }}
    >
      {/* Badge content */}
      <div
        className={`relative flex items-center justify-center h-full w-full rounded-full border ${badge.borderColor} bg-gradient-to-br ${badge.bgColor} overflow-hidden`}
      >
        {React.cloneElement(badge.icon, { className: `${iconSizes[size]}` })}
      </div>

      {/* Subtle shine effect */}
      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[-100%] w-[300%] h-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transform rotate-45 animate-shine"></div>
      </div>
    </div>
  )

  // Return with or without tooltip based on prop
  return showTooltip ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{BadgeComponent}</TooltipTrigger>
        <TooltipContent className="bg-black/90 border-gray-700 text-white">
          <div className="text-sm">
            <p className="font-bold text-white">{badge.label}</p>
            <p className="text-xs text-gray-300">{badge.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    BadgeComponent
  )
}