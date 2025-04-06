import { ParticipantBadge } from "@/components/participant-badge"

export function BadgeLegend() {
  const badges = [
    { type: "hard-charger", label: "Hard Charger", description: "Consistently asks questions and has applied" },
    { type: "connector", label: "Connector", description: "Connects with other participants" },
    { type: "deep-diver", label: "Deep Diver", description: "Explores topics in great detail" },
    {
      type: "quick-learner",
      label: "Quick Learner",
      description: "Rapidly progresses through recruitment information",
    },
    { type: "persistent-explorer", label: "Persistent Explorer", description: "Returns regularly to learn more" },
    { type: "dedicated-applicant", label: "Dedicated Applicant", description: "Applied and continues to engage" },
  ] as const

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-lg p-6 shadow-md border border-[#E0D6B8] dark:border-[#333333]">
      <h3 className="text-lg font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">Achievement Badges</h3>
      <p className="text-sm text-[#0A3C1F]/70 dark:text-white/70 mb-6">
        Earn these exclusive badges by engaging with our recruitment process. Share them on social media to showcase
        your journey!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.type}
            className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <ParticipantBadge type={badge.type} size="md" />
            <div>
              <span className="font-bold text-[#0A3C1F] dark:text-white">{badge.label}</span>
              <p className="text-xs text-[#0A3C1F]/70 dark:text-white/70 mt-1">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

