import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-client"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    const serviceClient = getServiceSupabase()

    // Update user to mark as applied
    const { data: updatedUser, error: updateError } = await serviceClient
      .from("users")
      .update({
        hasapplied: true,
        updatedat: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single()

    if (updateError) {
      console.error("Error marking user as applied:", updateError)
      return NextResponse.json(
        { success: false, message: `Error marking user as applied: ${updateError.message}` },
        { status: 500 },
      )
    }

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
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

    // Send notification email if needed
    // This would be implemented in a separate function

    return NextResponse.json({ success: true, user: formattedUser })
  } catch (error) {
    console.error("Error marking user as applied:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}