import { AchievementBadge } from "./achievement-badge"
import { ParticipantBadge } from "./participant-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function BadgeLegend() {
  // Achievement badges (new system)
  const achievementBadges = [
    {
      type: "written",
      name: "Written Test",
      description: "Completed written test preparation",
    },
    {
      type: "oral",
      name: "Oral Board",
      description: "Prepared for oral board interviews",
    },
    {
      type: "physical",
      name: "Physical Test",
      description: "Completed physical test preparation",
    },
    {
      type: "polygraph",
      name: "Polygraph",
      description: "Learned about the polygraph process",
    },
    {
      type: "psychological",
      name: "Psychological",
      description: "Prepared for psychological evaluation",
    },
    {
      type: "chat-participation",
      name: "Chat Participation",
      description: "Engaged with Sgt. Ken",
    },
    {
      type: "first-response",
      name: "First Response",
      description: "Received first response from Sgt. Ken",
    },
    {
      type: "application-started",
      name: "Application Started",
      description: "Started the application process",
    },
    {
      type: "application-completed",
      name: "Application Completed",
      description: "Completed the application process",
    },
    {
      type: "full",
      name: "Full Process",
      description: "Completed all preparation areas",
    },
  ]

  // Participant badges (old system)
  const participantBadges = [
    {
      type: "hard-charger",
      label: "Hard Charger",
      description: "Consistently asks questions and has applied",
    },
    {
      type: "connector",
      label: "Connector",
      description: "Connects with other participants",
    },
    {
      type: "deep-diver",
      label: "Deep Diver",
      description: "Explores topics in great detail",
    },
    {
      type: "quick-learner",
      label: "Quick Learner",
      description: "Rapidly progresses through recruitment information",
    },
    {
      type: "persistent-explorer",
      label: "Persistent Explorer",
      description: "Returns regularly to learn more",
    },
    {
      type: "dedicated-applicant",
      label: "Dedicated Applicant",
      description: "Applied and continues to engage",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Badge Legend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Achievement Badges Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">Achievement Badges</h3>
            <p className="text-sm text-[#0A3C1F]/70 dark:text-white/70 mb-6">
              Earn these badges by completing specific milestones in your recruitment journey.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {achievementBadges.map((badge) => (
                <div key={badge.type} className="flex flex-col items-center text-center">
                  <AchievementBadge type={badge.type as any} size="md" earned={true} />
                  <span className="font-medium text-sm mt-2">{badge.name}</span>
                  <span className="text-xs text-gray-500 mt-1">{badge.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Participant Badges Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">Participant Badges</h3>
            <p className="text-sm text-[#0A3C1F]/70 dark:text-white/70 mb-6">
              These badges recognize your engagement style and participation patterns.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {participantBadges.map((badge) => (
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
        </div>
      </CardContent>
    </Card>
  )
}