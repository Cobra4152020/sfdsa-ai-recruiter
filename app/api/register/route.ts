import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-client"

export async function POST(request: Request) {
  try {
    const { name, email, phone, isApplying } = await request.json()

    // Validate inputs
    if (!name || !email) {
      return NextResponse.json({ success: false, message: "Name and email are required" }, { status: 400 })
    }

    // Get service client for admin operations
    const serviceClient = getServiceSupabase()

    // Check if user already exists
    const { data: existingUser, error: findError } = await serviceClient
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (findError) {
      console.error("Error checking for existing user:", findError)
      return NextResponse.json(
        { success: false, message: `Error checking for existing user: ${findError.message}` },
        { status: 500 },
      )
    }

    let user

    if (existingUser) {
      // Update existing user
      const { data: updatedUser, error: updateError } = await serviceClient
        .from("users")
        .update({
          name,
          email,
          phone: phone || null,
          hasapplied: isApplying || false,
          updatedat: new Date().toISOString(),
        })
        .eq("id", existingUser.id)
        .select()
        .single()

      if (updateError) {
        console.error("Error updating user:", updateError)
        return NextResponse.json(
          { success: false, message: `Error updating user: ${updateError.message}` },
          { status: 500 },
        )
      }

      user = updatedUser
    } else {
      // Insert new user
      const { data: newUser, error: insertError } = await serviceClient
        .from("users")
        .insert({
          id: crypto.randomUUID(),
          name,
          email,
          phone: phone || null,
          participationcount: 0,
          hasapplied: isApplying || false,
          referralcount: 0,
          createdat: new Date().toISOString(),
          updatedat: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) {
        console.error("Error inserting new user:", insertError)
        return NextResponse.json(
          { success: false, message: `Error inserting new user: ${insertError.message}` },
          { status: 500 },
        )
      }

      user = newUser
    }

    // Convert database column names to camelCase for client
    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      participationCount: user.participationcount,
      hasApplied: user.hasapplied,
      referralCount: user.referralcount,
      createdAt: user.createdat,
      updatedAt: user.updatedat,
    }

    // Send notification email if needed
    // This would be implemented in a separate function

    return NextResponse.json({ success: true, user: formattedUser })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}