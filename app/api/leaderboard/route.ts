import { NextResponse } from "next/server"
import { API_CACHE_HEADERS } from "@/lib/cache-utils"

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
  | "hard-charger"
  | "connector"
  | "deep-diver"
  | "quick-learner"
  | "persistent-explorer"
  | "dedicated-applicant"

export type LeaderboardTimeframe = "daily" | "weekly" | "monthly" | "all-time"
export type LeaderboardCategory = "participation" | "badges" | "nfts" | "application"

export async function GET(request: Request) {
  try {
    // Return mock data for now to prevent errors
    const mockLeaderboard = {
      users: [
        {
          user_id: "1",
          name: "John Doe",
          avatar_url: null,
          participation_count: 120,
          badge_count: 5,
          nft_count: 2,
          application_progress: 75,
          rank: 1,
        },
        {
          user_id: "2",
          name: "Jane Smith",
          avatar_url: null,
          participation_count: 95,
          badge_count: 4,
          nft_count: 1,
          application_progress: 60,
          rank: 2,
        },
      ],
      total: 2,
    }

    return NextResponse.json(
      { success: true, leaderboard: mockLeaderboard, timestamp: Date.now() },
      { headers: API_CACHE_HEADERS },
    )
  } catch (error) {
    console.error("Error in /api/leaderboard:", error)

    // Return mock data even on error
    const mockLeaderboard = {
      users: [
        {
          user_id: "1",
          name: "John Doe (Fallback)",
          avatar_url: null,
          participation_count: 120,
          badge_count: 5,
          nft_count: 2,
          application_progress: 75,
          rank: 1,
        },
      ],
      total: 1,
    }

    return NextResponse.json(
      { success: true, leaderboard: mockLeaderboard, timestamp: Date.now() },
      { headers: API_CACHE_HEADERS },
    )
  }
}
