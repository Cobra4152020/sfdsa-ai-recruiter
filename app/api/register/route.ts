import { NextResponse } from "next/server"
import { dbService } from "@/lib/db-service"

export async function POST(request: Request) {
  try {
    const { name, email, phone, isApplying } = await request.json()

    // Validate inputs
    if (!name || !email) {
      return NextResponse.json({ success: false, message: "Name and email are required" }, { status: 400 })
    }

    // Create user using dbService (this now runs server-side)
    const user = await dbService.upsertUser({
      name,
      email,
      phone,
      participationCount: 0,
      hasApplied: isApplying || false,
      referralCount: 0,
      createdAt: new Date(),
    })

    // If user is applying, mark them as applied
    if (isApplying && user) {
      await dbService.markAsApplied(user.id)
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}