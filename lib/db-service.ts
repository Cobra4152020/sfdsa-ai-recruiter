import { getServiceSupabase } from "./supabase-client"
import type { BadgeType } from "@/app/api/leaderboard/route"

export const dbService = {
  // Get participation leaderboard
  async getParticipationLeaderboard(limit = 10) {
    try {
      const response = await fetch(`/api/leaderboard?type=participation&limit=${limit}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch participation leaderboard")
      }

      return data.users
    } catch (error) {
      console.error("Error in getParticipationLeaderboard:", error)
      throw error
    }
  },

  // Get applicants leaderboard
  async getApplicantsLeaderboard(limit = 10) {
    try {
      const response = await fetch(`/api/leaderboard?type=applicants&limit=${limit}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch applicants leaderboard")
      }

      return data.users
    } catch (error) {
      console.error("Error in getApplicantsLeaderboard:", error)
      throw error
    }
  },

  // Get user badges
  async getUserBadges(userId: string): Promise<Record<BadgeType, boolean>> {
    try {
      const supabase = getServiceSupabase()

      const { data, error } = await supabase.from("badges").select("*").eq("user_id", userId).single()

      if (error) {
        console.error("Error fetching user badges:", error)
        return this.getDefaultBadges()
      }

      return data || this.getDefaultBadges()
    } catch (error) {
      console.error("Error in getUserBadges:", error)
      return this.getDefaultBadges()
    }
  },

  // Get default badges object (all false)
  getDefaultBadges(): Record<BadgeType, boolean> {
    return {
      written: false,
      oral: false,
      physical: false,
      polygraph: false,
      psychological: false,
      full: false,
      "chat-participation": false,
      "first-response": false,
      "application-started": false,
      "application-completed": false,
      "frequent-user": false,
      "resource-downloader": false,
    }
  },

  // Determine participant badge type based on participation count
  getParticipantBadgeType(user: any) {
    if (!user) return null

    const count = user.participationCount || 0

    if (count >= 50) return "gold"
    if (count >= 25) return "silver"
    if (count >= 10) return "bronze"
    if (count >= 1) return "starter"

    return null
  },
}