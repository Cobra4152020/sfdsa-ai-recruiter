import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-client"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    const serviceClient = getServiceSupabase()

    // Get current referral count
    const { data: user, error: fetchError } = await serviceClient
      .from("users")
      .select("referralcount")
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

    const newCount = (user.referralcount || 0) + 1

    // Update referral count
    const { data: updatedUser, error: updateError } = await serviceClient
      .from("users")
      .update({
        referralcount: newCount,
        updatedat: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating referral count:", updateError)
      return NextResponse.json(
        { success: false, message: `Error updating referral count: ${updateError.message}` },
        { status: 500 },
      )
    }

    // Convert database column names to camelCase for client
    const formattedUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      participationCount: updatedUser.participationcount,
      hasApplied: updatedUser.hasapplied,
      referralCount: updatedUser.referralcount,
      createdAt: updatedUser.createdat,
      updatedAt: updatedUser.updatedat,
    }

    return NextResponse.json({ success: true, user: formattedUser })
  } catch (error) {
    console.error("Error incrementing referral count:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}