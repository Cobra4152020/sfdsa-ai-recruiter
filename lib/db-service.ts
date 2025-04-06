import { v4 as uuidv4 } from "uuid"
import { supabase, getServiceSupabase } from "./supabase-client"
import type { BadgeType } from "@/components/earned-badges"

// Types for user and leaderboard data
export interface UserData {
  id: string
  name: string
  email: string
  phone: string
  participationCount: number
  hasApplied: boolean
  referralCount: number
  createdAt: string | Date
  badges?: BadgeType[]
}

// Badge definitions
export const BADGE_TYPES = {
  FIRST_INTERACTION: "first_interaction",
  APPLIED: "applied",
  ENGAGEMENT_BRONZE: "engagement_bronze",
  ENGAGEMENT_SILVER: "engagement_silver",
  ENGAGEMENT_GOLD: "engagement_gold",
  REFERRAL: "referral",
}

// Participant badge types
export const PARTICIPANT_BADGE_TYPES = {
  HARD_CHARGER: "hard_charger",
  DEEP_DIVER: "deep_diver",
  QUICK_LEARNER: "quick_learner",
  PERSISTENT_EXPLORER: "persistent_explorer",
  DEDICATED_APPLICANT: "dedicated_applicant",
}

// Participant badge type mapping
export type ParticipantBadgeType =
  | "hard-charger"
  | "deep-diver"
  | "quick-learner"
  | "persistent-explorer"
  | "dedicated-applicant"

// Database service implementation using Supabase or mock
class DatabaseService {
  private notificationEmail = "kennethlomba@gmail.com" // Email to receive notifications
  private isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  private mockUsers: UserData[] = []

  constructor() {
    // Initialize mock data if in mock mode
    if (this.isMockMode) {
      this.initializeMockData()
    }
  }

  // Initialize mock data for development/preview
  private initializeMockData() {
    // Create sample users with various participation levels and badges
    this.mockUsers = [
      {
        id: "1",
        name: "Michael Rodriguez",
        email: "michael.r@example.com",
        phone: "(415) 555-1234",
        participationCount: 42,
        hasApplied: true,
        referralCount: 3,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      },
      {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "(415) 555-2345",
        participationCount: 38,
        hasApplied: true,
        referralCount: 0,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
      },
      {
        id: "3",
        name: "James Thompson",
        email: "james.t@example.com",
        phone: "(415) 555-3456",
        participationCount: 35,
        hasApplied: false,
        referralCount: 1,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      },
      {
        id: "4",
        name: "Emily Kim",
        email: "emily.k@example.com",
        phone: "(415) 555-4567",
        participationCount: 33,
        hasApplied: true,
        referralCount: 2,
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
      },
      {
        id: "5",
        name: "David Wilson",
        email: "david.w@example.com",
        phone: "(415) 555-5678",
        participationCount: 31,
        hasApplied: false,
        referralCount: 0,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      },
      {
        id: "6",
        name: "Jessica Martinez",
        email: "jessica.m@example.com",
        phone: "(415) 555-6789",
        participationCount: 29,
        hasApplied: true,
        referralCount: 0,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
      },
      {
        id: "7",
        name: "Robert Patel",
        email: "robert.p@example.com",
        phone: "(415) 555-7890",
        participationCount: 27,
        hasApplied: false,
        referralCount: 1,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
      {
        id: "8",
        name: "Lisa Smith",
        email: "lisa.s@example.com",
        phone: "(415) 555-8901",
        participationCount: 25,
        hasApplied: true,
        referralCount: 0,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
      },
      {
        id: "9",
        name: "John Davis",
        email: "john.d@example.com",
        phone: "(415) 555-9012",
        participationCount: 23,
        hasApplied: true,
        referralCount: 0,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        id: "10",
        name: "Amanda Brown",
        email: "amanda.b@example.com",
        phone: "(415) 555-0123",
        participationCount: 21,
        hasApplied: false,
        referralCount: 0,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    ]
  }

  // Initialize the database (create tables if they don't exist)
  async initialize() {
    if (this.isMockMode) {
      console.log("Running in mock mode - no initialization needed")
      return
    }

    const serviceSupabase = getServiceSupabase()

    // Check if the users table exists and create it if needed
    try {
      // For simplicity, we assume if we can query the table, it exists
      await serviceSupabase.from("users").select("id").limit(1)
    } catch (error) {
      console.error("Error checking users table, attempting to create:", error)

      // We would normally define the schema through Supabase directly
      // but this is a fallback in case the table doesn't exist
      try {
        await serviceSupabase.rpc("create_users_table_if_not_exists")
      } catch (createError) {
        console.error("Failed to create users table:", createError)
      }
    }
  }

  // Add or update a user
  async upsertUser(userData: Partial<UserData>): Promise<UserData> {
    try {
      const isNewUser = !userData.id
      const id = userData.id || uuidv4()
      const now = new Date().toISOString()

      // Prepare the user data for Supabase
      const userToUpsert = {
        id,
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        participationCount: userData.participationCount || 0,
        hasApplied: userData.hasApplied || false,
        referralCount: userData.referralCount || 0,
        createdAt: userData.createdAt || now,
        updatedAt: now,
      }

      // If in mock mode, handle with mock implementation
      if (this.isMockMode) {
        const existingUserIndex = this.mockUsers.findIndex(
          (user) => (userData.id && user.id === userData.id) || (userData.email && user.email === userData.email),
        )

        if (existingUserIndex !== -1) {
          // Update existing user
          this.mockUsers[existingUserIndex] = {
            ...this.mockUsers[existingUserIndex],
            ...userToUpsert,
            createdAt: this.mockUsers[existingUserIndex].createdAt, // Preserve original creation time
          }

          // Send notification email for applied user
          if (userData.hasApplied) {
            await this.sendNotificationEmail(this.mockUsers[existingUserIndex])
          }

          return this.mockUsers[existingUserIndex]
        } else {
          // Insert new user
          const newUser = {
            ...userToUpsert,
            createdAt: new Date(now),
          }

          this.mockUsers.push(newUser)

          // Send notification email for new users
          await this.sendNotificationEmail(newUser)

          // Award first interaction badge for new users
          await this.awardBadge(newUser.id, BADGE_TYPES.FIRST_INTERACTION)

          return newUser
        }
      }

      // Get service role client to bypass RLS
      const serviceClient = getServiceSupabase()

      // Check if user already exists with this email
      if (!userData.id && userData.email) {
        const { data: existingUser, error: findError } = await serviceClient
          .from("users")
          .select("id")
          .eq("email", userData.email)
          .single()

        if (findError) {
          console.error("Error checking for existing user:", findError)
        }

        if (existingUser) {
          // Update the existing user instead
          const { data: updatedUser, error } = await serviceClient
            .from("users")
            .update({
              ...userToUpsert,
              id: existingUser.id,
              createdAt: undefined, // Don't update creation time
            })
            .eq("id", existingUser.id)
            .select("*")
            .single()

          if (error) {
            console.error("Error updating existing user:", error)
            throw error
          }

          // Send notification email for applied user
          if (userData.hasApplied) {
            await this.sendNotificationEmail(updatedUser)
          }

          return updatedUser
        }
      }

      // Insert new user or update existing one by ID
      if (isNewUser) {
        // Insert new user
        const { data: newUser, error } = await serviceClient.from("users").insert(userToUpsert).select("*").single()

        if (error) {
          console.error("Error inserting new user:", error)
          throw error
        }

        // Send notification email for new users
        await this.sendNotificationEmail(newUser)

        // Award first interaction badge for new users
        await this.awardBadge(newUser.id, BADGE_TYPES.FIRST_INTERACTION)

        return newUser
      } else {
        // Update existing user
        const { data: updatedUser, error } = await serviceClient
          .from("users")
          .update({
            ...userToUpsert,
            createdAt: undefined, // Don't update creation time
          })
          .eq("id", id)
          .select("*")
          .single()

        if (error) {
          console.error("Error updating user:", error)
          throw error
        }

        return updatedUser
      }
    } catch (error) {
      console.error("Error in upsertUser:", error)
      throw error
    }
  }

  // Send notification email when a new user signs up or applies
  private async sendNotificationEmail(user: UserData): Promise<void> {
    try {
      // Skip sending emails in mock mode
      if (this.isMockMode) {
        console.log("Mock mode: Would send notification email for user:", user.name)
        return
      }

      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientEmail: this.notificationEmail,
          userName: user.name,
          userEmail: user.email,
          userPhone: user.phone,
          hasApplied: user.hasApplied,
          signupDate: user.createdAt,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send notification email")
      }

      console.log("Notification email sent successfully")
    } catch (error) {
      console.error("Error sending notification email:", error)
    }
  }

  // Increment participation count for a user
  async incrementParticipation(userId: string): Promise<UserData | null> {
    // If in mock mode, handle with mock implementation
    if (this.isMockMode) {
      const userIndex = this.mockUsers.findIndex((user) => user.id === userId)
      if (userIndex === -1) return null

      const newCount = (this.mockUsers[userIndex].participationCount || 0) + 1
      this.mockUsers[userIndex].participationCount = newCount

      // Check if user has reached badge thresholds
      if (newCount === 5) {
        await this.awardBadge(userId, BADGE_TYPES.ENGAGEMENT_BRONZE)
      } else if (newCount === 15) {
        await this.awardBadge(userId, BADGE_TYPES.ENGAGEMENT_SILVER)
      } else if (newCount === 30) {
        await this.awardBadge(userId, BADGE_TYPES.ENGAGEMENT_GOLD)
      }

      return this.mockUsers[userIndex]
    }

    const serviceClient = getServiceSupabase()

    const { data: user, error: fetchError } = await serviceClient
      .from("users")
      .select("participationCount")
      .eq("id", userId)
      .single()

    if (fetchError || !user) return null

    const newCount = (user.participationCount || 0) + 1

    const { data: updatedUser, error: updateError } = await serviceClient
      .from("users")
      .update({ participationCount: newCount, updatedAt: new Date().toISOString() })
      .eq("id", userId)
      .select("*")
      .single()

    if (updateError) {
      console.error("Error incrementing participation:", updateError)
      return null
    }

    // Check if user has reached badge thresholds
    if (newCount === 5) {
      await this.awardBadge(userId, BADGE_TYPES.ENGAGEMENT_BRONZE)
    } else if (newCount === 15) {
      await this.awardBadge(userId, BADGE_TYPES.ENGAGEMENT_SILVER)
    } else if (newCount === 30) {
      await this.awardBadge(userId, BADGE_TYPES.ENGAGEMENT_GOLD)
    }

    return updatedUser
  }

  // Increment referral count for a user
  async incrementReferralCount(userId: string): Promise<UserData | null> {
    // If in mock mode, handle with mock implementation
    if (this.isMockMode) {
      const userIndex = this.mockUsers.findIndex((user) => user.id === userId)
      if (userIndex === -1) return null

      const newCount = (this.mockUsers[userIndex].referralCount || 0) + 1
      this.mockUsers[userIndex].referralCount = newCount

      // Award referral badge on first referral
      if (newCount === 1) {
        await this.awardBadge(userId, BADGE_TYPES.REFERRAL)
      }

      return this.mockUsers[userIndex]
    }

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("referralCount")
      .eq("id", userId)
      .single()

    if (fetchError || !user) return null

    const newCount = (user.referralCount || 0) + 1

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ referralCount: newCount, updatedAt: new Date().toISOString() })
      .eq("id", userId)
      .select("*")
      .single()

    if (updateError) {
      console.error("Error incrementing referral count:", updateError)
      return null
    }

    // Award referral badge on first referral
    if (newCount === 1) {
      await this.awardBadge(userId, BADGE_TYPES.REFERRAL)
    }

    return updatedUser
  }

  // Mark user as applied
  async markAsApplied(userId: string): Promise<UserData | null> {
    // If in mock mode, handle with mock implementation
    if (this.isMockMode) {
      const userIndex = this.mockUsers.findIndex((user) => user.id === userId)
      if (userIndex === -1) return null

      this.mockUsers[userIndex].hasApplied = true

      // Send notification email when user applies
      await this.sendNotificationEmail(this.mockUsers[userIndex])

      // Award applied badge
      await this.awardBadge(userId, BADGE_TYPES.APPLIED)

      return this.mockUsers[userIndex]
    }

    const serviceClient = getServiceSupabase()

    const { data: updatedUser, error } = await serviceClient
      .from("users")
      .update({ hasApplied: true, updatedAt: new Date().toISOString() })
      .eq("id", userId)
      .select("*")
      .single()

    if (error) {
      console.error("Error marking user as applied:", error)
      return null
    }

    // Send notification email when user applies
    await this.sendNotificationEmail(updatedUser)

    // Award applied badge
    await this.awardBadge(userId, BADGE_TYPES.APPLIED)

    return updatedUser
  }

  // Get participation leaderboard
  async getParticipationLeaderboard(limit = 10): Promise<UserData[]> {
    try {
      // If in mock mode, return mock data
      if (this.isMockMode) {
        // Sort by participation count and limit
        const sortedUsers = [...this.mockUsers]
          .sort((a, b) => b.participationCount - a.participationCount)
          .slice(0, limit)

        // Add badges and participant badge type to each user
        const usersWithBadges = await Promise.all(
          sortedUsers.map(async (user) => {
            const badges = await this.getUserBadges(user.id)
            const participantBadgeType = this.getParticipantBadgeType(user)
            return { ...user, badges, participantBadgeType }
          }),
        )

        return usersWithBadges
      }

      const serviceClient = getServiceSupabase()

      const { data, error } = await serviceClient
        .from("users")
        .select("*")
        .order("participationCount", { ascending: false })
        .limit(limit)

      if (error) {
        console.error("Error fetching top recruits data:", error)
        return []
      }

      // Fetch badges for each user
      const usersWithBadges = await Promise.all(
        (data || []).map(async (user) => {
          const badges = await this.getUserBadges(user.id)
          return { ...user, badges }
        }),
      )

      return usersWithBadges
    } catch (error) {
      console.error("Error fetching top recruits data:", error)
      return []
    }
  }

  // Get applicants leaderboard
  async getApplicantsLeaderboard(limit = 10): Promise<UserData[]> {
    try {
      // If in mock mode, return mock data
      if (this.isMockMode) {
        // Filter applied users, sort by participation count and limit
        const sortedUsers = [...this.mockUsers]
          .filter((user) => user.hasApplied)
          .sort((a, b) => b.participationCount - a.participationCount)
          .slice(0, limit)

        // Add badges and participant badge type to each user
        const usersWithBadges = await Promise.all(
          sortedUsers.map(async (user) => {
            const badges = await this.getUserBadges(user.id)
            const participantBadgeType = this.getParticipantBadgeType(user)
            return { ...user, badges, participantBadgeType }
          }),
        )

        return usersWithBadges
      }

      const serviceClient = getServiceSupabase()

      // First get all users who have applied
      const { data, error } = await serviceClient.from("users").select("*").eq("hasApplied", true)

      if (error) {
        console.error("Error fetching top applicants data:", error)
        return []
      }

      // Then sort them by participation count and limit the results
      const sortedData = (data || []).sort((a, b) => b.participationCount - a.participationCount).slice(0, limit)

      // Fetch badges for each user
      const usersWithBadges = await Promise.all(
        sortedData.map(async (user) => {
          const badges = await this.getUserBadges(user.id)
          return { ...user, badges }
        }),
      )

      return usersWithBadges
    } catch (error) {
      console.error("Error fetching top applicants data:", error)
      return []
    }
  }

  // Determine participant badge type based on user behavior
  getParticipantBadgeType(user: UserData): ParticipantBadgeType | null {
    // Hard Charger: High participation (20+) and has applied
    if (user.participationCount >= 20 && user.hasApplied) {
      return "hard-charger"
    }

    // Dedicated Applicant: Has applied and continues to engage (10+ interactions)
    if (user.hasApplied && user.participationCount >= 10) {
      return "dedicated-applicant"
    }

    // Deep Diver: Very high participation (30+) but hasn't applied yet
    if (user.participationCount >= 30 && !user.hasApplied) {
      return "deep-diver"
    }

    // Quick Learner: Rapid participation growth in a short time
    // This would require tracking participation timestamps in a real implementation
    // For mock purposes, we'll use referral count as a proxy for quick learning
    if (user.referralCount >= 2) {
      return "quick-learner"
    }

    // Persistent Explorer: Moderate but consistent participation (15+)
    if (user.participationCount >= 15) {
      return "persistent-explorer"
    }

    return null
  }

  // Award a badge to a user
  async awardBadge(userId: string, badgeType: string): Promise<BadgeType | null> {
    try {
      // In a real implementation, we would store badges in a separate table
      // For this mock implementation, we'll use predefined badge types

      const badge = this.getBadgeDefinition(badgeType)
      if (!badge) return null

      // In a real implementation, we would insert a record in a badges table
      // For now, we'll just return the badge definition

      // Send badge notification email
      await this.sendBadgeNotificationEmail(userId, badge)

      return badge
    } catch (error) {
      console.error("Error awarding badge:", error)
      return null
    }
  }

  // Get all badges for a user
  async getUserBadges(userId: string): Promise<BadgeType[]> {
    try {
      // If in mock mode, generate badges based on user data
      if (this.isMockMode) {
        const user = this.mockUsers.find((u) => u.id === userId)
        if (!user) return []

        const badges: BadgeType[] = []

        // First interaction badge (everyone has this)
        badges.push(this.getBadgeDefinition(BADGE_TYPES.FIRST_INTERACTION)!)

        // Applied badge
        if (user.hasApplied) {
          badges.push(this.getBadgeDefinition(BADGE_TYPES.APPLIED)!)
        }

        // Engagement badges
        if (user.participationCount >= 30) {
          badges.push(this.getBadgeDefinition(BADGE_TYPES.ENGAGEMENT_GOLD)!)
        } else if (user.participationCount >= 15) {
          badges.push(this.getBadgeDefinition(BADGE_TYPES.ENGAGEMENT_SILVER)!)
        } else if (user.participationCount >= 5) {
          badges.push(this.getBadgeDefinition(BADGE_TYPES.ENGAGEMENT_BRONZE)!)
        }

        // Referral badge
        if (user.referralCount > 0) {
          badges.push(this.getBadgeDefinition(BADGE_TYPES.REFERRAL)!)
        }

        return badges
      }

      const serviceClient = getServiceSupabase()

      const { data: user, error } = await serviceClient
        .from("users")
        .select("participationCount, hasApplied, referralCount")
        .eq("id", userId)
        .single()

      if (error || !user) return []

      const badges: BadgeType[] = []

      // First interaction badge (everyone has this)
      badges.push(this.getBadgeDefinition(BADGE_TYPES.FIRST_INTERACTION)!)

      // Applied badge
      if (user.hasApplied) {
        badges.push(this.getBadgeDefinition(BADGE_TYPES.APPLIED)!)
      }

      // Engagement badges
      if (user.participationCount >= 30) {
        badges.push(this.getBadgeDefinition(BADGE_TYPES.ENGAGEMENT_GOLD)!)
      } else if (user.participationCount >= 15) {
        badges.push(this.getBadgeDefinition(BADGE_TYPES.ENGAGEMENT_SILVER)!)
      } else if (user.participationCount >= 5) {
        badges.push(this.getBadgeDefinition(BADGE_TYPES.ENGAGEMENT_BRONZE)!)
      }

      // Referral badge
      if (user.referralCount > 0) {
        badges.push(this.getBadgeDefinition(BADGE_TYPES.REFERRAL)!)
      }

      return badges
    } catch (error) {
      console.error("Error getting user badges:", error)
      return []
    }
  }

  // Get badge definition
  private getBadgeDefinition(badgeType: string): BadgeType | null {
    const now = new Date()

    switch (badgeType) {
      case BADGE_TYPES.FIRST_INTERACTION:
        return {
          id: BADGE_TYPES.FIRST_INTERACTION,
          name: "First Step",
          description: "Awarded for taking the first step in your journey with the SF Sheriff's Office",
          icon: "shield",
          color: "green-500",
          earnedAt: now,
          shareMessage:
            "I've taken my first step toward a career with the San Francisco Sheriff's Office! Join me in exploring this rewarding opportunity.",
        }
      case BADGE_TYPES.APPLIED:
        return {
          id: BADGE_TYPES.APPLIED,
          name: "Applicant",
          description: "Awarded for applying to the SF Sheriff's Office",
          icon: "star",
          color: "yellow-500",
          earnedAt: now,
          shareMessage:
            "I've officially applied to join the San Francisco Sheriff's Office! Excited to begin this journey in law enforcement and public service.",
        }
      case BADGE_TYPES.ENGAGEMENT_BRONZE:
        return {
          id: BADGE_TYPES.ENGAGEMENT_BRONZE,
          name: "Bronze Engagement",
          description: "Awarded for 5+ interactions with our recruitment platform",
          icon: "medal",
          color: "amber-600",
          earnedAt: now,
          shareMessage:
            "I've earned the Bronze Engagement badge with the San Francisco Sheriff's Office! Join me in exploring career opportunities in law enforcement.",
        }
      case BADGE_TYPES.ENGAGEMENT_SILVER:
        return {
          id: BADGE_TYPES.ENGAGEMENT_SILVER,
          name: "Silver Engagement",
          description: "Awarded for 15+ interactions with our recruitment platform",
          icon: "medal",
          color: "slate-400",
          earnedAt: now,
          shareMessage:
            "I've earned the Silver Engagement badge with the San Francisco Sheriff's Office! I'm learning so much about this rewarding career path.",
        }
      case BADGE_TYPES.ENGAGEMENT_GOLD:
        return {
          id: BADGE_TYPES.ENGAGEMENT_GOLD,
          name: "Gold Engagement",
          description: "Awarded for 30+ interactions with our recruitment platform",
          icon: "trophy",
          color: "yellow-500",
          earnedAt: now,
          shareMessage:
            "I've earned the Gold Engagement badge with the San Francisco Sheriff's Office! I'm committed to pursuing a career in law enforcement.",
        }
      case BADGE_TYPES.REFERRAL:
        return {
          id: BADGE_TYPES.REFERRAL,
          name: "Recruiter",
          description: "Awarded for referring others to the SF Sheriff's Office",
          icon: "target",
          color: "blue-500",
          earnedAt: now,
          shareMessage:
            "I'm helping build the future of the San Francisco Sheriff's Office by referring great candidates! Join me in this rewarding career.",
        }
      default:
        return null
    }
  }

  // Send badge notification email
  private async sendBadgeNotificationEmail(userId: string, badge: BadgeType): Promise<void> {
    try {
      // Skip sending emails in mock mode
      if (this.isMockMode) {
        console.log("Mock mode: Would send badge notification email for badge:", badge.name)
        return
      }

      const { data: user, error } = await supabase.from("users").select("name, email").eq("id", userId).single()

      if (error || !user) {
        console.error("Error getting user for badge notification:", error)
        return
      }

      const response = await fetch("/api/send-badge-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientEmail: user.email,
          userName: user.name,
          badgeName: badge.name,
          badgeDescription: badge.description,
          badgeShareMessage: badge.shareMessage,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send badge notification email")
      }

      console.log("Badge notification email sent successfully")
    } catch (error) {
      console.error("Error sending badge notification email:", error)
    }
  }
}

// Export a singleton instance
export const dbService = new DatabaseService()