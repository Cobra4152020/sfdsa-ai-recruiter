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
        position: 5, // Mock position
      })
    }

    const serviceClient = getServiceSupabase()

    // Check if the user exists
    const { data: user, error: userError } = await serviceClient
      .from("users")
      .select("id, participationcount")
      .eq("id", userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Count users with higher participation count
    const { count, error: countError } = await serviceClient
      .from("users")
      .select("id", { count: "exact", head: true })
      .gt("participationcount", user.participationcount)

    if (countError) throw countError

    // Position is count + 1 (users with higher scores + this user)
    const position = (count || 0) + 1

    return NextResponse.json({ success: true, position })
  } catch (error) {
    console.error("Error fetching leaderboard position:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
