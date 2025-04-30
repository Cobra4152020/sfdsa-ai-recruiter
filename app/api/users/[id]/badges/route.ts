import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-client"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    // Check if we have the required environment variables
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Return mock data for development
      return NextResponse.json({
        success: true,
        badges: [
          {
            id: "1",
            user_id: userId,
            badge_type: "chat-participation",
            earned_at: new Date().toISOString(),
          },
          {
            id: "2",
            user_id: userId,
            badge_type: "application-started",
            earned_at: new Date().toISOString(),
          },
        ],
      })
    }

    const serviceClient = getServiceSupabase()

    // Check if the user exists
    const { data: user, error: userError } = await serviceClient.from("users").select("id").eq("id", userId).single()

    if (userError || !user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Fetch user's badges
    const { data: badges, error: badgesError } = await serviceClient
      .from("user_badges")
      .select("*")
      .eq("user_id", userId)

    if (badgesError) throw badgesError

    return NextResponse.json({ success: true, badges })
  } catch (error) {
    console.error("Error fetching user badges:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
