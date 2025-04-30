import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-client"

export async function POST(request: Request) {
  try {
    const { userId, badgeType } = await request.json()

    if (!userId || !badgeType) {
      return NextResponse.json({ success: false, message: "User ID and badge type are required" }, { status: 400 })
    }

    const serviceClient = getServiceSupabase()

    // Check if the badge exists
    const { data: badge, error: badgeError } = await serviceClient
      .from("badges")
      .select("*")
      .eq("badge_type", badgeType)
      .single()

    if (badgeError || !badge) {
      return NextResponse.json({ success: false, message: "Badge not found" }, { status: 404 })
    }

    // Check if the user exists
    const { data: user, error: userError } = await serviceClient.from("users").select("id").eq("id", userId).single()

    if (userError || !user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Assign the badge to the user
    const { data, error } = await serviceClient
      .from("user_badges")
      .insert({
        user_id: userId,
        badge_type: badgeType,
        earned_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      // If the error is a duplicate key error, the user already has the badge
      if (error.code === "23505") {
        return NextResponse.json({ success: true, message: "User already has this badge" })
      }
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error assigning badge:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
