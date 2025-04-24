import { getServiceSupabase, withRetry } from "./supabase-client"
import type { BadgeType } from "@/app/api/leaderboard/route"

export const dbService = {
  // Get participation leaderboard
  async getParticipationLeaderboard(limit = 10) {
    try {
      return await withRetry(async () => {
        const response = await fetch(`/api/leaderboard?type=participation&limit=${limit}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // Add cache control to avoid stale data
          cache: "no-cache",
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch participation leaderboard: ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch participation leaderboard")
        }

        return data.users
      })
    } catch (error) {
      console.error("Error in getParticipationLeaderboard:", error)
      // Return empty array instead of throwing to avoid breaking the UI
      return []
    }
  },

  // Get applicants leaderboard
  async getApplicantsLeaderboard(limit = 10) {
    try {
      return await withRetry(async () => {
        const response = await fetch(`/api/leaderboard?type=applicants&limit=${limit}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // Add cache control to avoid stale data
          cache: "no-cache",
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch applicants leaderboard: ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch applicants leaderboard")
        }

        return data.users
      })
    } catch (error) {
      console.error("Error in getApplicantsLeaderboard:", error)
      // Return empty array instead of throwing to avoid breaking the UI
      return []
    }
  },

  // Get user badges with retry logic
  async getUserBadges(userId: string): Promise<Record<BadgeType, boolean>> {
    try {
      return await withRetry(async () => {
        const supabase = getServiceSupabase()

        const { data, error } = await supabase.from("badges").select("*").eq("user_id", userId).single()

        if (error) {
          console.error("Error fetching user badges:", error)
          return this.getDefaultBadges()
        }

        return data || this.getDefaultBadges()
      })
    } catch (error) {
      console.error("Error in getUserBadges:", error)
      return this.getDefaultBadges()
    }
  },

  // Update user badges with retry logic
  async updateUserBadge(userId: string, badgeType: BadgeType, value: boolean): Promise<boolean> {
    try {
      return await withRetry(async () => {
        const supabase = getServiceSupabase()

        // First check if the user exists
        const { data: user, error: userError } = await supabase.from("users").select("id").eq("id", userId).single()

        if (userError || !user) {
          console.error("User not found:", userError)
          return false
        }

        // Check if badge record exists
        const { data: badge, error: badgeError } = await supabase
          .from("badges")
          .select("*")
          .eq("user_id", userId)
          .eq("badge_type", badgeType)
          .single()

        if (badgeError && badgeError.code !== "PGRST116") {
          // PGRST116 is "No rows returned" which is expected if badge doesn't exist
          console.error("Error checking badge:", badgeError)
          return false
        }

        // If badge exists and value is true, nothing to do
        if (badge && value) {
          return true
        }

        // If badge exists and value is false, delete it
        if (badge && !value) {
          const { error: deleteError } = await supabase
            .from("badges")
            .delete()
            .eq("user_id", userId)
            .eq("badge_type", badgeType)

          if (deleteError) {
            console.error("Error deleting badge:", deleteError)
            return false
          }
          return true
        }

        // If badge doesn't exist and value is true, create it
        if (!badge && value) {
          const { error: insertError } = await supabase.from("badges").insert({
            user_id: userId,
            badge_type: badgeType,
            earned_at: new Date().toISOString(),
          })

          if (insertError) {
            console.error("Error inserting badge:", insertError)
            return false
          }
          return true
        }

        // If badge doesn't exist and value is false, nothing to do
        return true
      })
    } catch (error) {
      console.error("Error in updateUserBadge:", error)
      return false
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

  // Get user by ID with retry logic
  async getUserById(userId: string) {
    try {
      return await withRetry(async () => {
        const supabase = getServiceSupabase()

        const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

        if (error) {
          console.error("Error fetching user:", error)
          return null
        }

        return data
      })
    } catch (error) {
      console.error("Error in getUserById:", error)
      return null
    }
  },

  // Create or update user with retry logic
  async createOrUpdateUser(userData: any) {
    try {
      return await withRetry(async () => {
        const supabase = getServiceSupabase()

        // Check if user exists
        const { data: existingUser, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("email", userData.email)
          .single()

        if (userError && userError.code !== "PGRST116") {
          // PGRST116 is "No rows returned" which is expected if user doesn't exist
          console.error("Error checking user:", userError)
          return null
        }

        if (existingUser) {
          // Update existing user
          const { data, error } = await supabase
            .from("users")
            .update({
              ...userData,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingUser.id)
            .select()
            .single()

          if (error) {
            console.error("Error updating user:", error)
            return null
          }

          return data
        } else {
          // Create new user
          const { data, error } = await supabase
            .from("users")
            .insert({
              ...userData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single()

          if (error) {
            console.error("Error creating user:", error)
            return null
          }

          return data
        }
      })
    } catch (error) {
      console.error("Error in createOrUpdateUser:", error)
      return null
    }
  },
}
