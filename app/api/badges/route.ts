import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-client"

export async function GET() {
  try {
    // Check if we have the required environment variables
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Return mock data for development
      return NextResponse.json({
        success: true,
        badges: [
          {
            id: "1",
            badge_type: "written",
            name: "Written Test",
            description: "Completed the written examination",
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            badge_type: "oral",
            name: "Oral Interview",
            description: "Passed the oral interview",
            created_at: new Date().toISOString(),
          },
          // Add more mock badges here
        ],
      })
    }

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
