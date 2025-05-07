import { Suspense } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Trophy, Medal, Award } from "lucide-react"
import { EnhancementTracker } from "@/components/engagement-tracker"
import { BadgeDisplay } from "@/components/badge-display"
import { PointSystemExplanation } from "@/components/point-system-explanation"
import { ErrorBoundary } from "@/components/error-boundary"
import LayoutWithNavigation from "../layout-with-navigation"

export const metadata = {
  title: "Top Recruit Awards | SF Deputy Sheriff Recruitment",
  description:
    "Recognizing our most engaged candidates and top applicants for the San Francisco Deputy Sheriff's Department.",
}

export default function AwardsPage() {
  return (
    <LayoutWithNavigation>
      <div className="container mx-auto px-4 pt-8 pb-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 text-primary dark:text-primary-light">Top Recruit Awards</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Recognizing our most engaged candidates and top applicants. Engage with our AI assistant, learn about the
            application process, and join the ranks of those making a difference in San Francisco.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Tabs defaultValue="leaderboard">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
              <TabsTrigger value="leaderboard" className="flex items-center">
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </TabsTrigger>
              <TabsTrigger value="badges" className="flex items-center">
                <Medal className="h-4 w-4 mr-2" />
                Badges
              </TabsTrigger>
              <TabsTrigger value="points" className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Points
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leaderboard">
              <ErrorBoundary
                fallback={
                  <div className="p-8 text-center">Unable to load leaderboard data. Please try again later.</div>
                }
              >
                <Suspense fallback={<div className="text-center py-8">Loading leaderboard data...</div>}>
                  <EnhancementTracker />
                </Suspense>
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="badges">
              <div className="space-y-6">
                <ErrorBoundary
                  fallback={<div className="p-8 text-center">Unable to load badge data. Please try again later.</div>}
                >
                  <Suspense fallback={<div className="text-center py-8">Loading badge data...</div>}>
                    <BadgeDisplay />
                  </Suspense>
                </ErrorBoundary>
              </div>
            </TabsContent>

            <TabsContent value="points">
              <ErrorBoundary
                fallback={
                  <div className="p-8 text-center">Unable to load point system data. Please try again later.</div>
                }
              >
                <Suspense fallback={<div className="text-center py-8">Loading point system data...</div>}>
                  <PointSystemExplanation />
                </Suspense>
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </LayoutWithNavigation>
  )
}
