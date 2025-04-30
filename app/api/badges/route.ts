import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-client"

export async function GET() {
  try {
    const serviceClient = getServiceSupabase()

    const { data: badges, error } = await serviceClient.from("badges").select("*").order("badge_type")

    if (error) throw error

    return NextResponse.json({ success: true, badges })
  } catch (error) {
    console.error("Error fetching badges:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
