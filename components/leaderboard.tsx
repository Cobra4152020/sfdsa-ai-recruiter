"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AchievementBadge } from "./achievement-badge"
import type { BadgeType } from "@/app/api/leaderboard/route"

interface UserBadges {
  written: boolean
  oral: boolean
  physical: boolean
  polygraph: boolean
  psychological: boolean
  full: boolean
  chatParticipation: boolean
  firstResponse: boolean
  applicationStarted: boolean
  applicationCompleted: boolean
  frequentUser: boolean
  resourceDownloader: boolean
}

interface LeaderboardUser {
  id: string
  name: string
  email?: string
  phone?: string
  participationCount: number
  hasApplied: boolean
  referralCount?: number
  createdAt?: string
  updatedAt?: string
  badges: UserBadges
}

export function Leaderboard() {
  const [timeframe, setTimeframe] = useState("weekly")
  const [leaderboardType, setLeaderboardType] = useState<"participation" | "applicants">("participation")
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/leaderboard?type=${leaderboardType}&limit=10`)
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch leaderboard")
        }

        setUsers(data.users)
      } catch (err) {
        console.error("Error fetching leaderboard:", err)
        setError("Failed to load leaderboard. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [leaderboardType])

  // Helper function to convert camelCase badge names to kebab-case for the component
  const formatBadgeType = (badgeName: string): BadgeType => {
    return badgeName.replace(/([A-Z])/g, "-$1").toLowerCase() as BadgeType
  }

  return (
    <Card className="border border-[#0A3C1F]/20 dark:border-[#FFD700]/20">
      <CardHeader className="pb-2 bg-[#0A3C1F] text-white dark:bg-[#0A3C1F] dark:text-[#FFD700]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center">
            <span className="mr-2">🏆</span> Engagement Champions
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <Tabs
              defaultValue="participation"
              value={leaderboardType}
              onValueChange={(value) => setLeaderboardType(value as "participation" | "applicants")}
            >
              <TabsList>
                <TabsTrigger value="participation">All Users</TabsTrigger>
                <TabsTrigger value="applicants">Applicants</TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs defaultValue="weekly" value={timeframe} onValueChange={setTimeframe}>
              <TabsList>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="alltime">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A3C1F]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No users found</div>
            ) : (
              users.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#0A3C1F] dark:bg-[#FFD700] text-white dark:text-[#0A3C1F] rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.participationCount} points</div>
                    </div>
                  </div>
                  <div className="flex gap-1 overflow-x-auto pb-1 max-w-[180px] sm:max-w-none">
                    {Object.entries(user.badges).map(([badgeName, earned]) => {
                      // Skip displaying badges that aren't earned
                      if (!earned) return null

                      return (
                        <AchievementBadge key={badgeName} type={formatBadgeType(badgeName)} size="sm" earned={true} />
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
