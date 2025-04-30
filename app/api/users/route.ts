import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-client"

export async function GET() {
  try {
    const serviceClient = getServiceSupabase()

    const { data: users, error } = await serviceClient.from("users").select("id, name, email").order("name")

    if (error) throw error

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
