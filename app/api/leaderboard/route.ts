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
    // Mock data to ensure the API always returns something
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
        {
          user_id: "3",
          name: "Robert Johnson",
          avatar_url: null,
          participation_count: 85,
          badge_count: 3,
          nft_count: 1,
          application_progress: 50,
          rank: 3,
        },
        {
          user_id: "4",
          name: "Emily Davis",
          avatar_url: null,
          participation_count: 75,
          badge_count: 3,
          nft_count: 0,
          application_progress: 40,
          rank: 4,
        },
        {
          user_id: "5",
          name: "Michael Wilson",
          avatar_url: null,
          participation_count: 65,
          badge_count: 2,
          nft_count: 0,
          application_progress: 30,
          rank: 5,
        },
      ],
      total: 5,
    }

    return NextResponse.json(
      { success: true, leaderboard: mockLeaderboard, timestamp: Date.now() },
      { headers: API_CACHE_HEADERS },
    )
  } catch (error) {
    console.error("Error in /api/leaderboard:", error)

    // Return a minimal mock response even on error
    const fallbackLeaderboard = {
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
      ],
      total: 1,
    }

    return NextResponse.json(
      { success: true, leaderboard: fallbackLeaderboard, timestamp: Date.now() },
      { headers: API_CACHE_HEADERS },
    )
  }
}
