import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-client"

// Define badge types
export type BadgeType =
  | "written"
  | "oral"
  | "physical"
  | "polygraph"
  | "psychological"
  | "full"
  | "chat-participation"
  | "first-response"
  | "application-started"
  | "application-completed"
  | "frequent-user"
  | "resource-downloader"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "participation"
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    const serviceClient = getServiceSupabase()

    let data

    if (type === "applicants") {
      // Get top applicants
      try {
        // First try with badges relationship
        const { data: applicants, error } = await serviceClient
          .from("users")
          .select("*, badges(*)")
          .eq("hasapplied", true)
          .order("participationcount", { ascending: false })
          .limit(limit)

        if (error) throw error
        data = applicants
      } catch (error) {
        console.error("Error fetching applicants with badges:", error)

        // Fallback: fetch without badges relationship
        const { data: applicants, error: fallbackError } = await serviceClient
          .from("users")
          .select("*")
          .eq("hasapplied", true)
          .order("participationcount", { ascending: false })
          .limit(limit)

        if (fallbackError) {
          throw fallbackError
        }

        data = applicants
      }
    } else {
      // Get top participants
      try {
        // First try with badges relationship
        const { data: participants, error } = await serviceClient
          .from("users")
          .select("*, badges(*)")
          .order("participationcount", { ascending: false })
          .limit(limit)

        if (error) throw error
        data = participants
      } catch (error) {
        console.error("Error fetching participants with badges:", error)

        // Fallback: fetch without badges relationship
        const { data: participants, error: fallbackError } = await serviceClient
          .from("users")
          .select("*")
          .order("participationcount", { ascending: false })
          .limit(limit)

        if (fallbackError) {
          throw fallbackError
        }

        data = participants
      }
    }

    // Convert database column names to camelCase for client and process badges
    const formattedUsers = data.map((user) => {
      // Default badges object where all badges are false
      const defaultBadges = {
        written: false,
        oral: false,
        physical: false,
        polygraph: false,
        psychological: false,
        full: false,
        chatParticipation: false,
        firstResponse: false,
        applicationStarted: false,
        applicationCompleted: false,
        frequentUser: false,
        resourceDownloader: false,
      }

      // Process user badges if they exist
      const badges = { ...defaultBadges }

      if (user.badges && Array.isArray(user.badges)) {
        user.badges.forEach((badge) => {
          // Convert snake_case badge types to camelCase
          const badgeType = badge.badge_type.replace(/-/g, "_").replace(/_([a-z])/g, (g) => g[1].toUpperCase())
          badges[badgeType] = true
        })
      }

      // Automatically assign some badges based on user data
      if (user.participationcount > 0) {
        badges.chatParticipation = true
      }

      if (user.participationcount > 0) {
        badges.firstResponse = true
      }

      if (user.hasapplied) {
        badges.applicationStarted = true
      }

      if (user.participationcount >= 10) {
        badges.frequentUser = true
      }

      return {
        id: user.id,
        name: user.name || "Anonymous User",
        email: user.email,
        phone: user.phone,
        participationCount: user.participationcount || 0,
        hasApplied: user.hasapplied || false,
        referralCount: user.referralcount || 0,
        createdAt: user.createdat || new Date().toISOString(),
        updatedAt: user.updatedat || new Date().toISOString(),
        badges: badges,
      }
    })

    return NextResponse.json({ success: true, users: formattedUsers })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}