"use client"

import { AchievementBadge } from "./achievement-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function BadgeShowcase() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievement Badges</CardTitle>
        <CardDescription>Earn badges by participating in different activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center gap-2">
            <AchievementBadge type="chat-participation" size="md" earned={true} />
            <span className="text-sm font-medium">Chat Participation</span>
            <span className="text-xs text-gray-500">Engage with Sgt. Ken</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <AchievementBadge type="first-response" size="md" earned={true} />
            <span className="text-sm font-medium">First Response</span>
            <span className="text-xs text-gray-500">Received first reply from Sgt. Ken</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <AchievementBadge type="written" size="md" earned={true} />
            <span className="text-sm font-medium">Written Test</span>
            <span className="text-xs text-gray-500">Complete practice tests</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <AchievementBadge type="oral" size="md" earned={false} />
            <span className="text-sm font-medium">Oral Board</span>
            <span className="text-xs text-gray-500">Practice interviews</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <AchievementBadge type="physical" size="md" earned={false} />
            <span className="text-sm font-medium">Physical Test</span>
            <span className="text-xs text-gray-500">Prepare for fitness test</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <AchievementBadge type="polygraph" size="md" earned={false} />
            <span className="text-sm font-medium">Polygraph</span>
            <span className="text-xs text-gray-500">Learn about the process</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <AchievementBadge type="psychological" size="md" earned={false} />
            <span className="text-sm font-medium">Psychological</span>
            <span className="text-xs text-gray-500">Understand evaluation</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <AchievementBadge type="full" size="lg" earned={false} />
          <span className="text-sm font-medium mt-2">Full Process Badge</span>
          <span className="text-xs text-gray-500">Complete all preparation areas</span>
        </div>
      </CardContent>
    </Card>
  )
}