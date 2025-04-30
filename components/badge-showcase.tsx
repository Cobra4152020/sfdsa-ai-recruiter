"use client"

import { useState, useEffect } from "react"
import { AchievementBadge } from "./achievement-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { BadgeType } from "@/app/api/leaderboard/route"

interface Badge {
  id: string
  badge_type: BadgeType
  name: string
  description: string
  created_at: string
}

export function BadgeShowcase() {
  const [category, setCategory] = useState<"all" | "application" | "participation">("all")
  const [badges, setBadges] = useState<Badge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBadges = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/badges")
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch badges")
        }

        setBadges(data.badges)
      } catch (err) {
        console.error("Error fetching badges:", err)
        setError("Failed to load badges. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBadges()
  }, [])

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

  const filteredBadges = badges.filter((badge) => {
    if (category === "all") return true
    if (category === "application") return applicationBadgeTypes.includes(badge.badge_type)
    return !applicationBadgeTypes.includes(badge.badge_type)
  })

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Achievement Badges</CardTitle>
          <Tabs defaultValue="all" value={category} onValueChange={(value) => setCategory(value as any)}>
            <TabsList>
              <TabsTrigger value="all">All Badges</TabsTrigger>
              <TabsTrigger value="application">Application</TabsTrigger>
              <TabsTrigger value="participation">Participation</TabsTrigger>
            </TabsList>
          </Tabs>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {filteredBadges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center text-center p-2">
                <AchievementBadge type={badge.badge_type} size="md" earned={false} />
                <h3 className="font-medium mt-2 text-sm">{badge.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
