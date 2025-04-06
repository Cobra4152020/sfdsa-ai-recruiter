import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "participation"
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    const serviceClient = getServiceSupabase()

    let data

    if (type === "applicants") {
      // Get top applicants
      const { data: applicants, error } = await serviceClient
        .from("users")
        .select("*")
        .eq("hasapplied", true)
        .order("participationcount", { ascending: false })
        .limit(limit)

      if (error) {
        console.error("Error fetching applicants leaderboard:", error)
        return NextResponse.json(
          { success: false, message: `Error fetching applicants leaderboard: ${error.message}` },
          { status: 500 },
        )
      }

      data = applicants
    } else {
      // Get top participants
      const { data: participants, error } = await serviceClient
        .from("users")
        .select("*")
        .order("participationcount", { ascending: false })
        .limit(limit)

      if (error) {
        console.error("Error fetching participation leaderboard:", error)
        return NextResponse.json(
          { success: false, message: `Error fetching participation leaderboard: ${error.message}` },
          { status: 500 },
        )
      }

      data = participants
    }

    // Convert database column names to camelCase for client
    const formattedUsers = data.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      participationCount: user.participationcount,
      hasApplied: user.hasapplied,
      referralCount: user.referralcount,
      createdAt: user.createdat,
      updatedAt: user.updatedat,
    }))

    return NextResponse.json({ success: true, users: formattedUsers })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}