"use client"

import { useState, useEffect } from "react"
import { UserProvider, useUser } from "@/context/user-context"
import { OptInForm } from "@/components/opt-in-form"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AchievementBadge } from "@/components/achievement-badge"
import { DebugUser } from "@/components/debug-user"
import { SkipToContent } from "@/components/skip-to-content"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { BadgeType } from "@/app/api/leaderboard/route"

interface Badge {
  id: string
  badge_type: BadgeType
  name: string
  description: string
  created_at: string
}

interface UserBadge {
  id: string
  user_id: string
  badge_type: BadgeType
  earned_at: string
}

function UserDashboard() {
  const { currentUser, isLoggedIn } = useUser()
  const [isOptInFormOpen, setIsOptInFormOpen] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [allBadges, setAllBadges] = useState<Badge[]>([])
  const [userBadges, setUserBadges] = useState<UserBadge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [leaderboardPosition, setLeaderboardPosition] = useState<number | null>(null)

  const showOptInForm = (applying = false) => {
    setIsApplying(applying)
    setIsOptInFormOpen(true)
  }

  useEffect(() => {
    if (!isLoggedIn || !currentUser) {
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch all badges
        const badgesResponse = await fetch("/api/badges")
        const badgesData = await badgesResponse.json()

        if (!badgesData.success) {
          throw new Error(badgesData.message || "Failed to fetch badges")
        }

        setAllBadges(badgesData.badges)

        // Fetch user's badges
        const userBadgesResponse = await fetch(`/api/users/${currentUser.id}/badges`)
        const userBadgesData = await userBadgesResponse.json()

        if (!userBadgesData.success) {
          throw new Error(userBadgesData.message || "Failed to fetch user badges")
        }

        setUserBadges(userBadgesData.badges)

        // Fetch user's leaderboard position
        const leaderboardResponse = await fetch(`/api/users/${currentUser.id}/leaderboard-position`)
        const leaderboardData = await leaderboardResponse.json()

        if (leaderboardData.success) {
          setLeaderboardPosition(leaderboardData.position)
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load your data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isLoggedIn, currentUser])

  // Helper function to check if user has earned a badge
  const hasEarnedBadge = (badgeType: BadgeType) => {
    return userBadges.some((badge) => badge.badge_type === badgeType)
  }

  // Calculate progress
  const calculateProgress = () => {
    if (allBadges.length === 0) return 0
    const earnedCount = userBadges.length
    return Math.round((earnedCount / allBadges.length) * 100)
  }

  // Group badges by category
  const applicationBadgeTypes: BadgeType[] = [
    "written",
    "oral",
    "physical",
    "polygraph",
    "psychological",
    "full",
    "application-started",
    "application-completed",
  ]

  const applicationBadges = allBadges.filter((badge) => applicationBadgeTypes.includes(badge.badge_type))
  const participationBadges = allBadges.filter((badge) => !applicationBadgeTypes.includes(badge.badge_type))

  return (
    <div className="min-h-screen flex flex-col">
      <SkipToContent />
      <ImprovedHeader showOptInForm={() => showOptInForm(true)} />
      <main id="main-content" className="flex-1 pt-32 pb-16 bg-[#F8F5EE] dark:bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">Your Dashboard</h1>
            <p className="text-lg text-[#0A3C1F]/70 dark:text-white/70 max-w-2xl mx-auto">
              Track your progress and achievements
            </p>
          </div>

          {!isLoggedIn ? (
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <h2 className="text-2xl font-bold mb-4">Sign In to View Your Dashboard</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
                    Please sign in to view your achievements, track your progress, and see your leaderboard position.
                  </p>
                  <button
                    onClick={() => showOptInForm(false)}
                    className="px-6 py-2 bg-[#0A3C1F] text-white dark:bg-[#FFD700] dark:text-[#0A3C1F] rounded-md hover:opacity-90 transition-opacity"
                  >
                    Sign In
                  </button>
                </CardContent>
              </Card>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A3C1F] dark:border-[#FFD700]"></div>
            </div>
          ) : error ? (
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-red-500">{error}</div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* User Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-lg font-medium mb-1">Badges Earned</h3>
                      <p className="text-3xl font-bold text-[#0A3C1F] dark:text-[#FFD700]">{userBadges.length}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">out of {allBadges.length} total badges</p>
                    </div>

                    <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-lg font-medium mb-1">Completion</h3>
                      <div className="w-full max-w-[120px] mb-2">
                        <Progress value={calculateProgress()} className="h-4" />
                      </div>
                      <p className="text-3xl font-bold text-[#0A3C1F] dark:text-[#FFD700]">{calculateProgress()}%</p>
                    </div>

                    <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-lg font-medium mb-1">Leaderboard Rank</h3>
                      {leaderboardPosition ? (
                        <p className="text-3xl font-bold text-[#0A3C1F] dark:text-[#FFD700]">#{leaderboardPosition}</p>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Not ranked yet</p>
                      )}
                      <a href="/leaderboard" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1">
                        View Leaderboard
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Badges Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Badges</CardTitle>
                  <CardDescription>Track your achievements and see what badges you can earn next</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList className="mb-6">
                      <TabsTrigger value="all">All Badges</TabsTrigger>
                      <TabsTrigger value="earned">Earned</TabsTrigger>
                      <TabsTrigger value="unearned">Unearned</TabsTrigger>
                      <TabsTrigger value="application">Application</TabsTrigger>
                      <TabsTrigger value="participation">Participation</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {allBadges.map((badge) => (
                          <div key={badge.id} className="flex flex-col items-center text-center p-2">
                            <AchievementBadge
                              type={badge.badge_type}
                              size="md"
                              earned={hasEarnedBadge(badge.badge_type)}
                            />
                            <h3 className="font-medium mt-2 text-sm">{badge.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{badge.description}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="earned">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {allBadges
                          .filter((badge) => hasEarnedBadge(badge.badge_type))
                          .map((badge) => (
                            <div key={badge.id} className="flex flex-col items-center text-center p-2">
                              <AchievementBadge type={badge.badge_type} size="md" earned={true} />
                              <h3 className="font-medium mt-2 text-sm">{badge.name}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{badge.description}</p>
                            </div>
                          ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="unearned">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {allBadges
                          .filter((badge) => !hasEarnedBadge(badge.badge_type))
                          .map((badge) => (
                            <div key={badge.id} className="flex flex-col items-center text-center p-2">
                              <AchievementBadge type={badge.badge_type} size="md" earned={false} />
                              <h3 className="font-medium mt-2 text-sm">{badge.name}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{badge.description}</p>
                            </div>
                          ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="application">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {applicationBadges.map((badge) => (
                          <div key={badge.id} className="flex flex-col items-center text-center p-2">
                            <AchievementBadge
                              type={badge.badge_type}
                              size="md"
                              earned={hasEarnedBadge(badge.badge_type)}
                            />
                            <h3 className="font-medium mt-2 text-sm">{badge.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{badge.description}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="participation">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {participationBadges.map((badge) => (
                          <div key={badge.id} className="flex flex-col items-center text-center p-2">
                            <AchievementBadge
                              type={badge.badge_type}
                              size="md"
                              earned={hasEarnedBadge(badge.badge_type)}
                            />
                            <h3 className="font-medium mt-2 text-sm">{badge.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{badge.description}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Next Steps Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                  <CardDescription>Complete these actions to earn more badges</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {!hasEarnedBadge("chat-participation") && (
                      <li className="flex items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-shrink-0 mr-3">
                          <AchievementBadge type="chat-participation" size="sm" earned={false} />
                        </div>
                        <div>
                          <h3 className="font-medium">Start a conversation with Sgt. Ken</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Ask questions about the application process to earn the Chat Participation badge
                          </p>
                          <a
                            href="/#chat-section"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                          >
                            Chat Now
                          </a>
                        </div>
                      </li>
                    )}

                    {!hasEarnedBadge("application-started") && (
                      <li className="flex items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-shrink-0 mr-3">
                          <AchievementBadge type="application-started" size="sm" earned={false} />
                        </div>
                        <div>
                          <h3 className="font-medium">Start your application</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Begin the application process to earn the Application Started badge
                          </p>
                          <button
                            onClick={() => showOptInForm(true)}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
                          >
                            Apply Now
                          </button>
                        </div>
                      </li>
                    )}

                    {!hasEarnedBadge("resource-downloader") && (
                      <li className="flex items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-shrink-0 mr-3">
                          <AchievementBadge type="resource-downloader" size="sm" earned={false} />
                        </div>
                        <div>
                          <h3 className="font-medium">Download recruitment resources</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Download information packets to earn the Resource Downloader badge
                          </p>
                          <a
                            href="/resources"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                          >
                            View Resources
                          </a>
                        </div>
                      </li>
                    )}

                    {!hasEarnedBadge("frequent-user") && (
                      <li className="flex items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-shrink-0 mr-3">
                          <AchievementBadge type="frequent-user" size="sm" earned={false} />
                        </div>
                        <div>
                          <h3 className="font-medium">Engage regularly</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Continue to engage with our recruitment resources to earn the Frequent User badge
                          </p>
                        </div>
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <ImprovedFooter />

      {/* Opt-in form dialog */}
      <OptInForm
        isOpen={isOptInFormOpen}
        onClose={() => {
          setIsOptInFormOpen(false)
          setIsApplying(false)
        }}
        isApplying={isApplying}
      />

      {/* Debug component */}
      <DebugUser />
    </div>
  )
}

// Main export - IMPORTANT: Wrap with UserProvider
export default function DashboardPageWrapper() {
  return (
    <UserProvider>
      <UserDashboard />
    </UserProvider>
  )
}
