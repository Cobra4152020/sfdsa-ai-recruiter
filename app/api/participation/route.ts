import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-client"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    const serviceClient = getServiceSupabase()

    // Get current participation count
    const { data: user, error: fetchError } = await serviceClient
      .from("users")
      .select("participation_count")
      .eq("id", userId)
      .single()

    if (fetchError) {
      console.error("Error fetching user:", fetchError)
      return NextResponse.json(
        { success: false, message: `Error fetching user: ${fetchError.message}` },
        { status: 500 },
      )
    }

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    const newCount = (user.participation_count || 0) + 1

    // Update participation count
    const { data: updatedUser, error: updateError } = await serviceClient
      .from("users")
      .update({
        participation_count: newCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating participation count:", updateError)
      return NextResponse.json(
        { success: false, message: `Error updating participation count: ${updateError.message}` },
        { status: 500 },
      )
    }

    // Convert snake_case to camelCase for client
    const formattedUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      participationCount: updatedUser.participation_count,
      hasApplied: updatedUser.has_applied,
      referralCount: updatedUser.referral_count,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
    }

    return NextResponse.json({ success: true, user: formattedUser })
  } catch (error) {
    console.error("Error incrementing participation:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}